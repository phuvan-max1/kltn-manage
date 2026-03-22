/**
 * Seed script to populate Google Sheets with test data for all roles.
 * Run: npx tsx scripts/seed-data.ts
 */
import { google } from 'googleapis'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SHEET_ID = process.env.GOOGLE_SHEETS_ID!

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

async function main() {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  console.log('🔌 Connecting to Google Sheets...')
  console.log(`📄 Sheet ID: ${SHEET_ID}`)

  // ── 1. Seed users sheet ──────────────────────────────────────────
  const usersHeader = [
    ['email', 'role', 'name', 'mssv_msgv', 'khoa', 'he_dao_tao', 'active', 'created_at', 'password'],
  ]
  const usersData = [
    ['sv1@student.hcmute.edu.vn', 'STUDENT', 'Nguyen Van A', '21110001', 'CNTT', 'DH', 'TRUE', '2026-03-22T08:00:00.000Z', '21110001'],
    ['sv2@student.hcmute.edu.vn', 'STUDENT', 'Tran Thi B', '21110002', 'CNTT', 'DH', 'TRUE', '2026-03-22T08:00:00.000Z', '21110002'],
    ['sv3@student.hcmute.edu.vn', 'STUDENT', 'Le Van C', '21110003', 'DTVT', 'DH', 'TRUE', '2026-03-22T08:00:00.000Z', '21110003'],
    ['gvhd1@hcmute.edu.vn', 'GVHD', 'PGS.TS Nguyen Minh Khoa', 'GV001', 'CNTT', '-', 'TRUE', '2026-03-22T08:00:00.000Z', 'GV001'],
    ['gvpb1@hcmute.edu.vn', 'GVPB', 'TS. Pham Quoc Dung', 'GV002', 'CNTT', '-', 'TRUE', '2026-03-22T08:00:00.000Z', 'GV002'],
    ['truongbm@hcmute.edu.vn', 'TRUONG_BM', 'PGS.TS Nguyen Van Truong', 'GV003', 'CNTT', '-', 'TRUE', '2026-03-22T08:00:00.000Z', 'GV003'],
    ['hoidong1@hcmute.edu.vn', 'HOI_DONG', 'TS. Hoang Thi Nhi', 'HD001', 'CNTT', '-', 'TRUE', '2026-03-22T08:00:00.000Z', 'HD001'],
    ['admin@hcmute.edu.vn', 'ADMIN', 'Admin He Thong', 'ADMIN', '-', '-', 'TRUE', '2026-03-22T08:00:00.000Z', 'admin123'],
  ]

  // Clear existing users data and write fresh
  console.log('\n📝 Seeding users sheet...')
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SHEET_ID,
      range: 'users!A1:Z1000',
    })
  } catch {
    console.log('  ⚠️ Could not clear users sheet (might not exist yet)')
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'users!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [...usersHeader, ...usersData] },
  })
  console.log(`  ✅ Added ${usersData.length} users`)

  // ── 2. Seed de_tai sheet ─────────────────────────────────────────
  const detaiHeader = [
    ['id', 'ten_de_tai', 'mang_de_tai', 'email_sv', 'email_gvhd', 'ten_cty', 'dot', 'loai', 'trang_thai', 'updated_at'],
  ]
  const detaiData = [
    ['dt-001', 'He thong quan ly khoa luan tot nghiep', 'Web', 'sv1@student.hcmute.edu.vn', 'gvhd1@hcmute.edu.vn', 'FPT Software', 'HK2-2025-2026', 'KLTN', 'CHO_DUYET', '2026-03-22T08:30:00.000Z'],
    ['dt-002', 'Nhan dien van ban tieng Viet bang OCR va AI', 'AI', 'sv2@student.hcmute.edu.vn', 'gvhd1@hcmute.edu.vn', 'VNG Corp', 'HK2-2025-2026', 'KLTN', 'DA_DUYET', '2026-03-22T09:00:00.000Z'],
    ['dt-003', 'Ung dung IoT giam sat moi truong', 'IoT', 'sv3@student.hcmute.edu.vn', 'gvhd1@hcmute.edu.vn', '', 'HK2-2025-2026', 'BCTT', 'CHO_DUYET', '2026-03-22T09:30:00.000Z'],
  ]

  console.log('\n📝 Seeding de_tai sheet...')
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SHEET_ID,
      range: 'de_tai!A1:Z1000',
    })
  } catch {
    console.log('  ⚠️ Could not clear de_tai sheet (might not exist yet)')
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'de_tai!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [...detaiHeader, ...detaiData] },
  })
  console.log(`  ✅ Added ${detaiData.length} de_tai records`)

  // ── 3. Seed ho_so sheet ──────────────────────────────────────────
  const hosoHeader = [
    ['id', 'email_sv', 'email_gvhd', 'diem_gvhd', 'diem_gvpb', 'diem_hd', 'bien_ban', 'chinh_sua'],
  ]
  const hosoData = [
    ['hs-001', 'sv2@student.hcmute.edu.vn', 'gvhd1@hcmute.edu.vn', '8.5', '8.0', '8.25', '', 'FALSE'],
  ]

  console.log('\n📝 Seeding ho_so sheet...')
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SHEET_ID,
      range: 'ho_so!A1:Z1000',
    })
  } catch {
    console.log('  ⚠️ Could not clear ho_so sheet (might not exist yet)')
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'ho_so!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [...hosoHeader, ...hosoData] },
  })
  console.log(`  ✅ Added ${hosoData.length} ho_so records`)

  // ── Summary ──────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60))
  console.log('🎉 Seed data complete!')
  console.log('═'.repeat(60))
  console.log('\nTest accounts (email / password):')
  console.log('─'.repeat(50))
  usersData.forEach((row) => {
    console.log(`  ${row[1].padEnd(12)} │ ${row[0].padEnd(35)} │ ${row[8]}`)
  })
  console.log('─'.repeat(50))
}

main().catch((err) => {
  console.error('❌ Seed failed:', err.message || err)
  process.exit(1)
})
