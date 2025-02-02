import { NextRequest, NextResponse } from 'next/server'
import getCurrentUser from '@/app/actions/users/getCurrentUser'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params

    const currentUser = await getCurrentUser()

    if (!currentUser?.id) {
      return new NextResponse('Chưa xác thực', { status: 401 })
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true }
    })

    if (!existingConversation) {
      return new NextResponse('Không tìm thấy cuộc trò chuyện', { status: 404 })
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      }
    })

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'deleteConversation', existingConversation)
      }
    })

    return NextResponse.json(deletedConversation)
  } catch (error) {
    console.error('ERROR_CONVERSATION_DELETE', error)
    return NextResponse.json(
      { message: 'Lỗi internal của server DELETE CONVERSATION', status: 500 },
      { status: 500 }
    )
  }
}
