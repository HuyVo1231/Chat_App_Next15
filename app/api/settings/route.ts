import getCurrentUser from '@/app/actions/users/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()

    const { image, name } = body

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Chưa xác thực', { status: 401 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        image: image,
        name: name
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error('CHANGE INFO ERROR', error)
    return NextResponse.json({ message: 'Lỗi internal của server', status: 500 }, { status: 500 })
  }
}
