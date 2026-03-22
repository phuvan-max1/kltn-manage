import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { appendDeTai } from '@/lib/sheets'

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { ten_de_tai, mang_de_tai, email_gvhd, ten_cty, dot, loai } = body

  if (!ten_de_tai || !mang_de_tai || !email_gvhd || !dot || !loai) {
    return NextResponse.json({ error: 'Thieu thong tin bat buoc' }, { status: 400 })
  }

  if (loai !== 'BCTT' && loai !== 'KLTN') {
    return NextResponse.json({ error: 'Loai khong hop le' }, { status: 400 })
  }

  const id = await appendDeTai({
    ten_de_tai,
    mang_de_tai,
    email_sv: session.user.email,
    email_gvhd,
    ten_cty: ten_cty || '',
    dot,
    loai,
  })

  return NextResponse.json({ success: true, id }, { status: 201 })
}
