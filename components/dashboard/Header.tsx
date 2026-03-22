import Image from 'next/image'
import { ROLE_LABELS } from '@/lib/roles'
import { Role } from '@/types'

interface HeaderProps {
  user: {
    name: string
    email: string
    image?: string
    role: Role
  }
}

export default function Header({ user }: HeaderProps) {
  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || 'U'

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <p className="text-sm text-slate-500">He thong quan ly KLTN</p>
        <p className="text-lg font-semibold text-slate-900">HCMUTE</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500">
            {ROLE_LABELS[user.role]} - {user.email}
          </p>
        </div>

        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full border border-slate-200"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a3a6b] text-sm font-bold text-white">
            {initial}
          </div>
        )}
      </div>
    </header>
  )
}
