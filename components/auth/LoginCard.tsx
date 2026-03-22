'use client'

import GoogleButton from '@/components/auth/GoogleButton'

interface LoginCardProps {
  error?: string | null
  reason?: string | null
  passwordError?: string | null
  loading: 'student' | 'lecturer' | 'password' | null
  identifier: string
  password: string
  onIdentifierChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onPasswordSignIn: () => void
  onStudentSignIn: () => void
  onLecturerSignIn: () => void
}

export default function LoginCard({
  error,
  reason,
  passwordError,
  loading,
  identifier,
  password,
  onIdentifierChange,
  onPasswordChange,
  onPasswordSignIn,
  onStudentSignIn,
  onLecturerSignIn,
}: LoginCardProps) {
  const getOauthErrorMessage = () => {
    if (error !== 'unauthorized') {
      return 'Dang nhap Google that bai. Vui long thu lai.'
    }

    switch (reason) {
      case 'missing-email':
        return 'Google khong tra ve email. Vui long kiem tra tai khoan Google.'
      case 'not-in-users-sheet':
        return 'Email chua co trong sheet users hoac role chua hop le.'
      case 'inactive':
        return 'Tai khoan da bi khoa (active != TRUE). Vui long lien he quan tri.'
      case 'sheets-unreachable':
        return 'Khong ket noi duoc Google Sheets. Kiem tra env/key/quyen share sheet.'
      default:
        return 'Tai khoan Gmail chua duoc cap quyen truy cap he thong.'
    }
  }

  return (
    <div className="w-full max-w-[560px] rounded-md border border-slate-200 bg-white px-8 py-7 shadow-sm">
      <h2 className="text-[50px] font-bold uppercase tracking-tight text-[#3a5aa0]">Dang nhap</h2>
      <p className="mt-1 text-[18px] text-slate-500">Cong thong tin dao tao</p>

      <div className="mt-8 space-y-4">
        <label className="block">
          <span className="ml-3 bg-white px-1 text-sm text-slate-500">Ten dang nhap</span>
          <input
            value={identifier}
            onChange={(e) => onIdentifierChange(e.target.value)}
            className="h-12 w-full rounded border border-slate-400 bg-white px-3 text-slate-700 outline-none transition focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/20"
            placeholder="Email hoac MSSV/MSGV"
          />
        </label>

        <label className="block">
          <span className="ml-3 bg-white px-1 text-sm text-slate-500">Mat khau</span>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-slate-700 outline-none transition focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/20"
            placeholder="********"
          />
        </label>

        <button
          type="button"
          onClick={onPasswordSignIn}
          disabled={loading !== null}
          className="h-11 w-full rounded bg-[#1a3a6b] text-lg font-semibold text-white transition hover:bg-[#142d54] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading === 'password' ? 'Dang dang nhap...' : 'Dang nhap'}
        </button>
      </div>

      {passwordError && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {passwordError}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {getOauthErrorMessage()}
        </div>
      )}

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-sm text-slate-400">Hoac dang nhap voi Google</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-3">
        <GoogleButton loading={loading !== null} onClick={onStudentSignIn}>
          {loading === 'student' ? 'Dang xu ly...' : 'Dang nhap voi Google Sinh vien'}
        </GoogleButton>
        <GoogleButton loading={loading !== null} onClick={onLecturerSignIn}>
          {loading === 'lecturer' ? 'Dang xu ly...' : 'Dang nhap voi Google Giang vien'}
        </GoogleButton>
      </div>

      <p className="mt-5 border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
        Su dung tai khoan @hcmute.edu.vn hoac @student.hcmute.edu.vn
      </p>
    </div>
  )
}
