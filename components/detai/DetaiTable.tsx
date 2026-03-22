import { DeTaiRecord } from '@/types'

interface DetaiTableProps {
  data: DeTaiRecord[]
}

const STATUS_LABELS: Record<DeTaiRecord['trang_thai'], string> = {
  CHO_DUYET: 'Cho duyet',
  DA_DUYET: 'Da duyet',
  TU_CHOI: 'Tu choi',
  HOAN_THANH: 'Hoan thanh',
}

const STATUS_STYLES: Record<DeTaiRecord['trang_thai'], string> = {
  CHO_DUYET: 'bg-amber-100 text-amber-800',
  DA_DUYET: 'bg-blue-100 text-blue-800',
  TU_CHOI: 'bg-red-100 text-red-800',
  HOAN_THANH: 'bg-emerald-100 text-emerald-800',
}

export default function DetaiTable({ data }: DetaiTableProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        Chua co de tai nao.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Ten de tai</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Loai</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">GVHD</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Dot</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Trang thai</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Cap nhat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((detai) => (
              <tr key={detai.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{detai.ten_de_tai}</p>
                  <p className="text-xs text-slate-500">{detai.mang_de_tai}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">{detai.loai}</td>
                <td className="px-4 py-3 text-slate-700">{detai.email_gvhd}</td>
                <td className="px-4 py-3 text-slate-700">{detai.dot}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      STATUS_STYLES[detai.trang_thai]
                    }`}
                  >
                    {STATUS_LABELS[detai.trang_thai]}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {detai.updated_at ? new Date(detai.updated_at).toLocaleString('vi-VN') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
