import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ROLE_DASHBOARD_MAP } from '@/lib/roles'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await auth()

  if (session?.user?.role) {
    redirect(ROLE_DASHBOARD_MAP[session.user.role])
  }

  redirect('/login')
}
