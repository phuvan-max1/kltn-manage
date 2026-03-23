'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoginCard from '@/components/auth/LoginCard'
import { ROLE_DASHBOARD_MAP } from '@/lib/roles'
import { Role } from '@/types'

export default function LoginPage() {
  const { data: session, status, update: updateSession } = useSession()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState<'student' | 'lecturer' | 'password' | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setError(params.get('error'))
    setReason(params.get('reason'))
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      const role = session.user.role as Role
      const target = ROLE_DASHBOARD_MAP[role]
      if (target) {
        router.replace(target)
      }
    }
  }, [session, status, router])

  const handleSignIn = async (type: 'student' | 'lecturer') => {
    setPasswordError(null)
    setError(null)
    setReason(null)
    setLoading(type)
    await signIn('google', { callbackUrl: '/' })
  }

  const handlePasswordSignIn = async () => {
    setError(null)
    setReason(null)
    setPasswordError(null)

    if (!identifier.trim() || !password.trim()) {
      setPasswordError('Vui long nhap day du ten dang nhap va mat khau.')
      return
    }

    setLoading('password')
    try {
      const result = await signIn('credentials', {
        identifier: identifier.trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setLoading(null)
        setPasswordError('Sai ten dang nhap hoac mat khau, hoac tai khoan chua duoc kich hoat.')
        return
      }

      // After successful credentials login, try to get the session with retries
      let sessionData = null
      for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 500))
        const sessionRes = await fetch('/api/auth/session')
        sessionData = await sessionRes.json()
        if (sessionData?.user?.role) break
      }
      
      if (sessionData?.user?.role) {
        const role = sessionData.user.role as Role
        const target = ROLE_DASHBOARD_MAP[role]
        window.location.href = target || '/dashboard/student'
      } else {
        // Fallback: force full page reload to let server handle redirect
        window.location.href = '/'
      }
    } catch {
      setLoading(null)
      setPasswordError('Co loi xay ra khi dang nhap. Vui long thu lai.')
    }
  }

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#edf2f9]">
        <div className="text-slate-500">Dang tai...</div>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#edf2f9] px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#e5edf8_48%,#d9e5f5_100%)]" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#1a3a6b]/10 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#0ea5e9]/15 blur-3xl" />

      <section className="relative z-10 flex w-full justify-center">
        <LoginCard
          error={error}
          reason={reason}
          passwordError={passwordError}
          loading={loading}
          identifier={identifier}
          password={password}
          onIdentifierChange={setIdentifier}
          onPasswordChange={setPassword}
          onPasswordSignIn={handlePasswordSignIn}
          onStudentSignIn={() => handleSignIn('student')}
          onLecturerSignIn={() => handleSignIn('lecturer')}
        />
      </section>
    </main>
  )
}
