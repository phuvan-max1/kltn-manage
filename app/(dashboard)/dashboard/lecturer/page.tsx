import StatsCard from '@/components/dashboard/StatsCard'
import DetaiTable from '@/components/detai/DetaiTable'
import { auth } from '@/lib/auth'
import { getDeTai } from '@/lib/sheets'

export const dynamic = 'force-dynamic'

export default async function LecturerDashboard() {
  const session = await auth()
  const detais = await getDeTai(session!.user.email)

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard giang vien</h1>
        <p className="mt-1 text-sm text-slate-500">Tong quan sinh vien huong dan va de tai phu trach</p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard title="Tong de tai" value={detais.length} color="blue" />
        <StatsCard
          title="Can duyet"
          value={detais.filter((d) => d.trang_thai === 'CHO_DUYET').length}
          color="yellow"
        />
        <StatsCard
          title="Da hoan thanh"
          value={detais.filter((d) => d.trang_thai === 'HOAN_THANH').length}
          color="green"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Danh sach de tai lien quan</h2>
        <DetaiTable data={detais} />
      </section>
    </div>
  )
}
