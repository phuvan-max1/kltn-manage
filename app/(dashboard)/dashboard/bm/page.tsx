import StatsCard from '@/components/dashboard/StatsCard'
import DetaiTable from '@/components/detai/DetaiTable'
import { getDeTai } from '@/lib/sheets'

export const dynamic = 'force-dynamic'

export default async function BmDashboard() {
  const detais = await getDeTai()

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard truong bo mon</h1>
        <p className="mt-1 text-sm text-slate-500">Quan ly va dieu phoi toan bo de tai trong dot</p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatsCard title="Tong de tai" value={detais.length} color="blue" />
        <StatsCard
          title="Cho duyet"
          value={detais.filter((d) => d.trang_thai === 'CHO_DUYET').length}
          color="yellow"
        />
        <StatsCard
          title="Da duyet"
          value={detais.filter((d) => d.trang_thai === 'DA_DUYET').length}
          color="green"
        />
        <StatsCard
          title="Tu choi"
          value={detais.filter((d) => d.trang_thai === 'TU_CHOI').length}
          color="yellow"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Toan bo de tai</h2>
        <DetaiTable data={detais} />
      </section>
    </div>
  )
}
