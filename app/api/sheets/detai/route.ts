import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDeTai, updateDeTaiStatus } from '@/lib/sheets'
import { Role } from '@/types'

const STAFF_ROLES: Role[] = ['GVHD', 'GVPB', 'TRUONG_BM', 'HOI_DONG', 'ADMIN']
const STATUS_LIST = ['CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'HOAN_THANH'] as const

export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = session.user.role

  if (role === 'STUDENT') {
    return NextResponse.json(await getDeTai(session.user.email))
  }

  if (STAFF_ROLES.includes(role)) {
    if (role === 'ADMIN' || role === 'TRUONG_BM') {
      return NextResponse.json(await getDeTai())
    }

    return NextResponse.json(await getDeTai(session.user.email))
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session || !STAFF_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id, trang_thai } = body

  if (!id || !trang_thai) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
  }

  if (!STATUS_LIST.includes(trang_thai)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await updateDeTaiStatus(id, trang_thai)
  return NextResponse.json({ success: true })
}
