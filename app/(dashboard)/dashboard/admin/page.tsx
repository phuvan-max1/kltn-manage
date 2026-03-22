import StatsCard from '@/components/dashboard/StatsCard'
import DetaiTable from '@/components/detai/DetaiTable'
import { getDeTai } from '@/lib/sheets'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const detais = await getDeTai()

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard admin</h1>
        <p className="mt-1 text-sm text-slate-500">Toan quyen quan tri he thong KLTN</p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatsCard title="Tong de tai" value={detais.length} color="blue" />
        <StatsCard
          title="Cho duyet"
          value={detais.filter((d) => d.trang_thai === 'CHO_DUYET').length}
          color="yellow"
        />
        <StatsCard
          title="Da hoan thanh"
          value={detais.filter((d) => d.trang_thai === 'HOAN_THANH').length}
          color="green"
        />
        <StatsCard
          title="Tu choi"
          value={detais.filter((d) => d.trang_thai === 'TU_CHOI').length}
          color="yellow"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Tong hop de tai</h2>
        <DetaiTable data={detais} />
      </section>
    </div>
  )
}
