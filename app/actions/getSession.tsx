// Hooks use of the auth user already exists login. ( Use for server side)
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
export default async function getSession() {
  return await getServerSession(authOptions)
}
