import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher'

export async function POST(request: Request) {
  try {
    const { conversationId } = await request.json()

    const currentUser = await getCurrentUser()

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Chưa xác thực', { status: 401 })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: true,
        messages: { include: { seen: true } }
      }
    })

    if (!conversation) {
      return new NextResponse('Không tìm thấy cuộc trò chuyện', { status: 404 })
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1]

    if (!lastMessage) {
      return new NextResponse('Không tìm thấy tin nhắn mới nhất', { status: 404 })
    }

    const updatedMessage = await prisma.message.update({
      where: { id: lastMessage.id },
      data: {
        seen: {
          connect: { id: currentUser.id }
        }
      },
      include: {
        sender: true,
        seen: true
      }
    })

    await pusherServer.trigger(currentUser.email, 'updateConversation', {
      id: conversationId,
      messages: [updatedMessage]
    })

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation)
    }

    await pusherServer.trigger(conversationId, 'updateMessage', updatedMessage)

    return NextResponse.json(updatedMessage)
  } catch (error) {
    return new NextResponse(`Lỗi ở server: ${error.message || error}`, { status: 500 })
  }
}
