'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  BookMarked,
  ClipboardList,
  FileCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react'
import { ROLE_LABELS } from '@/lib/roles'
import { Role } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  STUDENT: [
    { label: 'Tong quan', href: '/dashboard/student', icon: LayoutDashboard },
    { label: 'De tai cua toi', href: '/dashboard/student', icon: BookMarked },
    { label: 'Tien do', href: '/dashboard/student', icon: ClipboardList },
  ],
  GVHD: [
    { label: 'Tong quan', href: '/dashboard/lecturer', icon: LayoutDashboard },
    { label: 'Danh sach huong dan', href: '/dashboard/lecturer', icon: Users },
    { label: 'Duyet de tai', href: '/dashboard/lecturer', icon: FileCheck },
  ],
  GVPB: [
    { label: 'Tong quan', href: '/dashboard/lecturer', icon: LayoutDashboard },
    { label: 'De tai phan bien', href: '/dashboard/lecturer', icon: BookMarked },
  ],
  TRUONG_BM: [
    { label: 'Tong quan', href: '/dashboard/bm', icon: LayoutDashboard },
    { label: 'Quan ly de tai', href: '/dashboard/bm', icon: Settings },
    { label: 'Phan cong hoi dong', href: '/dashboard/bm', icon: Users },
  ],
  HOI_DONG: [
    { label: 'Tong quan', href: '/dashboard/lecturer', icon: LayoutDashboard },
    { label: 'Bien ban hoi dong', href: '/dashboard/lecturer', icon: ClipboardList },
  ],
  ADMIN: [
    { label: 'Tong quan', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Quan ly users', href: '/dashboard/admin', icon: Users },
    { label: 'Tat ca de tai', href: '/dashboard/admin', icon: BookMarked },
  ],
}

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const items = NAV_ITEMS[role] || []

  return (
    <aside className="flex h-full w-64 flex-col bg-[#1a3a6b] text-white">
      <div className="border-b border-white/10 px-4 py-4">
        <p className="text-sm font-bold tracking-wide">HE THONG QUAN LY KLTN</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-blue-100">
          <GraduationCap className="h-4 w-4" />
          HCMUTE
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <p className="mb-2 px-3 text-xs text-blue-100">{ROLE_LABELS[role]}</p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-blue-100 transition-colors hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Dang xuat
        </button>
      </div>
    </aside>
  )
}
