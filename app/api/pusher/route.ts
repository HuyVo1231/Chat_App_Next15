import getSession from '@/app/actions/users/getSession'
import { pusherServer } from '@/app/libs/pusher'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session?.user?.email) {
    return new NextResponse('Chưa xác thực', { status: 401 })
  }

  const body = await request.text()
  const params = new URLSearchParams(body)
  const socket_id = params.get('socket_id')
  const channel_name = params.get('channel_name')
  const user_email = session?.user?.email

  const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, {
    user_id: user_email
  })

  return NextResponse.json(authResponse)
}
