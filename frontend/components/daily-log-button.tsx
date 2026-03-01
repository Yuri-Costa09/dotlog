"use client"

import { Plus } from "lucide-react"

export function DailyLogButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg font-mono text-sm font-semibold shadow-lg hover:opacity-90 transition-all duration-200 hover:scale-105 cursor-pointer accent-glow"
      aria-label="Criar novo Daily Log"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Daily Log</span>
    </button>
  )
}
