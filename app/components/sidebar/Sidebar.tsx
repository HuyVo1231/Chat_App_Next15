import DesktopSidebar from './DesktopSidebar'
import MobileFooter from './MobileFooter'

import getCurrentUser from '@/app/actions/users/getCurrentUser'

export async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser()

  return (
    <div className='h-full'>
      <DesktopSidebar currentUser={currentUser} />
      <MobileFooter />
      <main className='h-full lg:pl-20'>{children}</main>
    </div>
  )
}
