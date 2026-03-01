import React from 'react'

export default function StatCard({ label, value, color = 'rose' }: { label: string; value: string; color?: 'rose' | 'blue' | 'purple' | 'teal' }) {
  const tone =
    color === 'rose'
      ? { background: 'bg-[#fff2ef]', border: 'border-[#f4d2c9]', text: 'text-[#8f2c1d]' }
      : color === 'blue'
        ? { background: 'bg-[#edf3ff]', border: 'border-[#cfdcf7]', text: 'text-[#1f477a]' }
        : color === 'purple'
          ? { background: 'bg-[#f1eeff]', border: 'border-[#d9cff4]', text: 'text-[#4a3e87]' }
          : { background: 'bg-[#ecfaf2]', border: 'border-[#c5e8d5]', text: 'text-[#136444]' }

  return (
    <div className={`rounded-xl border ${tone.border} ${tone.background} p-3 shadow-sm`}>
      <div>
        <div className="admin-metric-label">{label}</div>
        <div className={`admin-metric-value mt-0.5 ${tone.text}`}>{value}</div>
      </div>
    </div>
  )
}
