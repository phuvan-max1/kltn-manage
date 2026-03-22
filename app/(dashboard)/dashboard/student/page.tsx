import StatsCard from '@/components/dashboard/StatsCard'
import DetaiForm from '@/components/detai/DetaiForm'
import DetaiTable from '@/components/detai/DetaiTable'
import { auth } from '@/lib/auth'
import { getDeTai } from '@/lib/sheets'

export const dynamic = 'force-dynamic'

export default async function StudentDashboard() {
  const session = await auth()
  const detais = await getDeTai(session!.user.email)
  const hasActiveDeTai = detais.some((d) => d.trang_thai !== 'TU_CHOI')

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Xin chao, {session!.user.name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {session!.user.mssv_msgv} - {session!.user.khoa}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard title="De tai cua toi" value={detais.length} color="blue" />
        <StatsCard
          title="Dang cho duyet"
          value={detais.filter((d) => d.trang_thai === 'CHO_DUYET').length}
          color="yellow"
        />
        <StatsCard
          title="Da hoan thanh"
          value={detais.filter((d) => d.trang_thai === 'HOAN_THANH').length}
          color="green"
        />
      </section>

      {detais.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Danh sach de tai</h2>
          <DetaiTable data={detais} />
        </section>
      )}

      {!hasActiveDeTai && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Dang ky de tai moi</h2>
          <DetaiForm emailSv={session!.user.email} />
        </section>
      )}
    </div>
  )
}
