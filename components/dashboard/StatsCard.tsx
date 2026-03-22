interface StatsCardProps {
  title: string
  value: number
  color?: 'blue' | 'yellow' | 'green'
}

const colorMap: Record<NonNullable<StatsCardProps['color']>, string> = {
  blue: 'border-blue-200 bg-blue-50 text-blue-900',
  yellow: 'border-amber-200 bg-amber-50 text-amber-900',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-900',
}

export default function StatsCard({ title, value, color = 'blue' }: StatsCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  )
}
