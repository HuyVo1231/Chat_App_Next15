import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()

    const { message, conversationId, image } = body

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Chưa xác thực', { status: 401 })
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: { connect: { id: conversationId } },
        sender: { connect: { id: currentUser.id } },
        seen: { connect: { id: currentUser.id } }
      },
      include: {
        seen: true,
        sender: true
      }
    })

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        messages: {
          connect: { id: newMessage.id }
        },
        lastMessageAt: new Date()
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true
          }
        }
      }
    })

    await pusherServer.trigger(conversationId, 'newMessage', newMessage)

    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1]

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'updateConversation', {
        id: conversationId,
        messages: [lastMessage]
      })
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error('REGISTRATION ERROR', error)
    return NextResponse.json({ message: 'Lỗi internal của server', status: 500 }, { status: 500 })
  }
}
