import React from 'react'

export default function StatCard({ label, value, color = 'rose' }: { label: string; value: string; color?: 'rose' | 'blue' | 'purple' | 'teal' }) {
  const bg =
    color === 'rose'
      ? 'from-rose-50 to-rose-100'
      : color === 'blue'
        ? 'from-blue-50 to-blue-100'
        : color === 'purple'
          ? 'from-violet-50 to-violet-100'
          : 'from-emerald-50 to-emerald-100'
  const accent =
    color === 'rose'
      ? 'text-rose-700'
      : color === 'blue'
        ? 'text-blue-700'
        : color === 'purple'
          ? 'text-violet-700'
          : 'text-emerald-700'

  return (
    <div className={`rounded-xl border border-slate-200 bg-gradient-to-br ${bg} p-3 shadow-sm`}>
      <div>
        <div className="admin-metric-label">{label}</div>
        <div className={`admin-metric-value mt-0.5 ${accent}`}>{value}</div>
      </div>
    </div>
  )
}
