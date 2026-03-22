'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  emailSv: string
}

export default function DetaiForm({ emailSv }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    ten_de_tai: '',
    mang_de_tai: '',
    email_gvhd: '',
    ten_cty: '',
    dot: '',
    loai: 'KLTN' as 'KLTN' | 'BCTT',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/sheets/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email_sv: emailSv }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Co loi xay ra')
      }

      setSuccess(true)
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Khong the dang ky de tai')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mb-2 text-4xl text-emerald-600">✓</div>
        <p className="font-semibold text-emerald-800">Dang ky thanh cong</p>
        <p className="mt-1 text-sm text-emerald-700">De tai cua ban dang cho giang vien duyet.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Ten de tai *</label>
          <input
            required
            value={form.ten_de_tai}
            onChange={(e) => setForm((prev) => ({ ...prev, ten_de_tai: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-[#1a3a6b] focus:ring-2"
            placeholder="Nhap ten de tai"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Mang de tai *</label>
          <input
            required
            value={form.mang_de_tai}
            onChange={(e) => setForm((prev) => ({ ...prev, mang_de_tai: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-[#1a3a6b] focus:ring-2"
            placeholder="Vi du: AI, Web, IoT"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email GVHD *</label>
          <input
            required
            type="email"
            value={form.email_gvhd}
            onChange={(e) => setForm((prev) => ({ ...prev, email_gvhd: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-[#1a3a6b] focus:ring-2"
            placeholder="gvhd@hcmute.edu.vn"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Dot *</label>
          <input
            required
            value={form.dot}
            onChange={(e) => setForm((prev) => ({ ...prev, dot: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-[#1a3a6b] focus:ring-2"
            placeholder="HK1-2025-2026"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Loai *</label>
          <select
            value={form.loai}
            onChange={(e) => setForm((prev) => ({ ...prev, loai: e.target.value as 'KLTN' | 'BCTT' }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-[#1a3a6b] focus:ring-2"
          >
            <option value="KLTN">Khoa luan tot nghiep</option>
            <option value="BCTT">Bao cao thuc tap</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Ten cong ty (neu co)</label>
          <input
            value={form.ten_cty}
            onChange={(e) => setForm((prev) => ({ ...prev, ten_cty: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-[#1a3a6b] focus:ring-2"
            placeholder="Cong ty thuc tap"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-lg bg-[#1a3a6b] font-semibold text-white transition hover:bg-[#142d54] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Dang ghi vao he thong...' : 'Dang ky de tai'}
      </button>
    </form>
  )
}
