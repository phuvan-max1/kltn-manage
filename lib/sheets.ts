import 'server-only'
import { google } from 'googleapis'
import { DeTaiRecord, Role, UserRecord } from '@/types'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env: ${name}`)
  }
  return value
}

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: requiredEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
      private_key: requiredEnv('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  })
}

export async function getSheetsClient() {
  const auth = getAuth()
  return google.sheets({ version: 'v4', auth })
}

interface ParsedUserRow {
  user: UserRecord
  candidatePasswords: string[]
  raw: string[]
}

function normalizeCell(value: string | undefined): string {
  return (value ?? '').toString().trim()
}

function parseRole(value: string | undefined): Role | null {
  const raw = normalizeCell(value).toUpperCase().replace(/\s+/g, '').replace(/-/g, '_')

  const roleMap: Record<string, Role> = {
    STUDENT: 'STUDENT',
    SV: 'STUDENT',
    SINHVIEN: 'STUDENT',
    SINH_VIEN: 'STUDENT',
    GVHD: 'GVHD',
    GIANGVIENHUONGDAN: 'GVHD',
    GVPB: 'GVPB',
    GIANGVIENPHANBIEN: 'GVPB',
    TRUONG_BM: 'TRUONG_BM',
    TRUONGBM: 'TRUONG_BM',
    HOI_DONG: 'HOI_DONG',
    HOIDONG: 'HOI_DONG',
    ADMIN: 'ADMIN',
  }

  return roleMap[raw] ?? null
}

function parseActive(value: string | undefined): boolean {
  const raw = normalizeCell(value).toLowerCase()
  return ['true', '1', 'yes', 'y', 'active'].includes(raw)
}

function parseUserRow(row: string[]): ParsedUserRow | null {
  const roleFromColB = parseRole(row[1])
  const roleFromColC = parseRole(row[2])
  const role = roleFromColB ?? roleFromColC

  if (!role) {
    return null
  }

  const isStandardFormat = roleFromColB !== null
  const name = isStandardFormat ? normalizeCell(row[2]) : normalizeCell(row[1])
  const mssvMsgv = isStandardFormat ? normalizeCell(row[3]) : normalizeCell(row[4] || row[5])
  const khoa = isStandardFormat ? normalizeCell(row[4]) : '-'
  const heDaoTao = isStandardFormat ? normalizeCell(row[5]) : '-'
  const active = isStandardFormat ? parseActive(row[6]) : parseActive(row[3])

  const explicitPassword = isStandardFormat
    ? normalizeCell(row[8])
    : normalizeCell(row[6] || row[7])
  const mssv = normalizeCell(row[4])
  const msgv = normalizeCell(row[5])

  const candidatePasswords = Array.from(
    new Set(
      [explicitPassword, mssvMsgv, mssv, msgv]
        .map((value) => value.trim())
        .filter((value) => value.length > 0),
    ),
  )

  return {
    user: {
      email: normalizeCell(row[0]),
      role,
      name,
      mssv_msgv: mssvMsgv,
      khoa,
      he_dao_tao: heDaoTao,
      active,
    },
    candidatePasswords,
    raw: row,
  }
}

async function loadParsedUsers(): Promise<ParsedUserRow[]> {
  const sheets = await getSheetsClient()
  const sheetId = requiredEnv('GOOGLE_SHEETS_ID')
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'users!A2:Z1000',
  })

  const rows = res.data.values || []
  return rows
    .map((row) => parseUserRow(row))
    .filter((row): row is ParsedUserRow => row !== null)
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const parsedUsers = await loadParsedUsers()
  const found = parsedUsers.find((item) => item.user.email.toLowerCase() === email.toLowerCase())
  return found?.user ?? null
}

export async function verifyUserCredentials(
  identifier: string,
  password: string,
): Promise<{ user: UserRecord | null; reason: string }> {
  const normalizedIdentifier = normalizeCell(identifier).toLowerCase()
  const normalizedPassword = normalizeCell(password)

  if (!normalizedIdentifier || !normalizedPassword) {
    return { user: null, reason: 'missing-credentials' }
  }

  const parsedUsers = await loadParsedUsers()
  const found = parsedUsers.find((item) => {
    const keys = [
      item.user.email,
      item.user.mssv_msgv,
      normalizeCell(item.raw[4]),
      normalizeCell(item.raw[5]),
    ]
      .map((value) => value.toLowerCase())
      .filter((value) => value.length > 0)

    return keys.includes(normalizedIdentifier)
  })

  if (!found) {
    return { user: null, reason: 'identifier-not-found' }
  }

  if (!found.user.active) {
    return { user: null, reason: 'inactive' }
  }

  if (found.candidatePasswords.length === 0) {
    return { user: null, reason: 'no-password-configured' }
  }

  const isValidPassword = found.candidatePasswords.includes(normalizedPassword)
  if (!isValidPassword) {
    return { user: null, reason: 'invalid-password' }
  }

  return { user: found.user, reason: 'ok' }
}

export async function getDeTai(emailFilter?: string): Promise<DeTaiRecord[]> {
  const sheets = await getSheetsClient()
  const sheetId = requiredEnv('GOOGLE_SHEETS_ID')
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'de_tai!A2:J1000',
  })

  const rows = res.data.values || []
  const records: DeTaiRecord[] = rows.map((r) => ({
    id: r[0] ?? '',
    ten_de_tai: r[1] ?? '',
    mang_de_tai: r[2] ?? '',
    email_sv: r[3] ?? '',
    email_gvhd: r[4] ?? '',
    ten_cty: r[5] ?? '',
    dot: r[6] ?? '',
    loai: (r[7] ?? 'KLTN') as DeTaiRecord['loai'],
    trang_thai: (r[8] ?? 'CHO_DUYET') as DeTaiRecord['trang_thai'],
    updated_at: r[9] ?? '',
  }))

  if (!emailFilter) {
    return records
  }

  return records.filter(
    (detai) =>
      detai.email_sv.toLowerCase() === emailFilter.toLowerCase() ||
      detai.email_gvhd.toLowerCase() === emailFilter.toLowerCase(),
  )
}

export async function appendDeTai(
  data: Omit<DeTaiRecord, 'id' | 'updated_at' | 'trang_thai'>,
): Promise<string> {
  const sheets = await getSheetsClient()
  const sheetId = requiredEnv('GOOGLE_SHEETS_ID')
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'de_tai!A:J',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          id,
          data.ten_de_tai,
          data.mang_de_tai,
          data.email_sv,
          data.email_gvhd,
          data.ten_cty,
          data.dot,
          data.loai,
          'CHO_DUYET',
          now,
        ],
      ],
    },
  })

  return id
}

export async function updateDeTaiStatus(
  id: string,
  trang_thai: DeTaiRecord['trang_thai'],
): Promise<void> {
  const sheets = await getSheetsClient()
  const sheetId = requiredEnv('GOOGLE_SHEETS_ID')
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'de_tai!A2:A1000',
  })

  const rows = res.data.values || []
  const rowIndex = rows.findIndex((r) => r[0] === id)

  if (rowIndex === -1) {
    throw new Error('Khong tim thay de tai')
  }

  const rowNum = rowIndex + 2

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `de_tai!I${rowNum}:J${rowNum}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[trang_thai, new Date().toISOString()]],
    },
  })
}
