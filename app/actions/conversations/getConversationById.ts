import prisma from '@/app/libs/prismadb'
import getCurrentUser from '../users/getCurrentUser'
import { FullConversationType } from '@/app/types'

const getConversationByID = async (conversationId: string): Promise<FullConversationType> => {
  const currentUser = await getCurrentUser()

  if (!currentUser?.email) {
    return null
  }

  try {
    const conversation = await prisma?.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            sender: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })
    return conversation
  } catch (error: any) {
    return null
  }
}
export default getConversationByID
