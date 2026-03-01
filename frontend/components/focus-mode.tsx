"use client"

import { Eye, EyeOff, Lock } from "lucide-react"

export function FocusModeBanner({
  hasPostedToday,
  onDismiss,
}: {
  hasPostedToday: boolean
  onDismiss?: () => void
}) {
  if (hasPostedToday) return null

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-mono font-semibold text-foreground">
            Modo Foco Ativado
          </h3>
          <p className="text-xs text-muted-foreground font-mono mt-1 leading-relaxed">
            Publique seu Daily Log primeiro para desbloquear o feed de hoje.
            Documentar seu processo e a prioridade.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-mono font-semibold hover:opacity-90 transition-colors cursor-pointer">
              <Eye className="w-3.5 h-3.5" />
              Criar meu log
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Pular por hoje
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
