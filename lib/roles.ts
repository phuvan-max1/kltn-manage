import { Role } from '@/types'

export const ROLE_DASHBOARD_MAP: Record<Role, string> = {
  STUDENT: '/dashboard/student',
  GVHD: '/dashboard/lecturer',
  GVPB: '/dashboard/lecturer',
  TRUONG_BM: '/dashboard/bm',
  HOI_DONG: '/dashboard/lecturer',
  ADMIN: '/dashboard/admin',
}

export const ROUTE_ALLOWED_ROLES: Record<string, Role[]> = {
  '/dashboard/student': ['STUDENT'],
  '/dashboard/lecturer': ['GVHD', 'GVPB', 'HOI_DONG'],
  '/dashboard/bm': ['TRUONG_BM'],
  '/dashboard/admin': ['ADMIN'],
}

export function canAccess(role: Role, path: string): boolean {
  const matchedRoute = Object.keys(ROUTE_ALLOWED_ROLES).find(
    (route) => path === route || path.startsWith(`${route}/`),
  )

  if (!matchedRoute) {
    return true
  }

  return ROUTE_ALLOWED_ROLES[matchedRoute].includes(role)
}

export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: 'Sinh vien',
  GVHD: 'Giang vien huong dan',
  GVPB: 'Giang vien phan bien',
  TRUONG_BM: 'Truong bo mon',
  HOI_DONG: 'Hoi dong',
  ADMIN: 'Quan tri vien',
}
