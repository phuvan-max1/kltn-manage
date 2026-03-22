import type { DefaultSession } from 'next-auth'

export type Role = 'STUDENT' | 'GVHD' | 'GVPB' | 'TRUONG_BM' | 'HOI_DONG' | 'ADMIN'

export interface UserRecord {
  email: string
  role: Role
  name: string
  mssv_msgv: string
  khoa: string
  he_dao_tao: string
  active: boolean
}

export interface DeTaiRecord {
  id: string
  ten_de_tai: string
  mang_de_tai: string
  email_sv: string
  email_gvhd: string
  ten_cty: string
  dot: string
  loai: 'BCTT' | 'KLTN'
  trang_thai: 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI' | 'HOAN_THANH'
  updated_at: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      email: string
      name: string
      image?: string
      role: Role
      mssv_msgv: string
      khoa: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role
    mssv_msgv?: string
    khoa?: string
    dbName?: string
  }
}
