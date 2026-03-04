"use client"

import { ShieldAlert, Check, Trash2, AlertTriangle } from "lucide-react"
import { type LogData } from "./log-card"

interface ModerationCardProps {
  log: LogData
  reason: string
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function ModerationCard({ log, reason, onApprove, onReject }: ModerationCardProps) {
  return (
    <div className="bg-card border-2 border-warning/20 rounded-lg overflow-hidden transition-all hover:border-warning/40">
      {/* Header de Alerta */}
      <div className="bg-warning/10 px-4 py-2 border-b border-warning/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="text-[10px] font-mono font-bold text-warning uppercase tracking-tighter">
            Conteúdo Denunciado
          </span>
        </div>
        <span className="text-[10px] font-mono text-warning/70 italic">
          Motivo: {reason}
        </span>
      </div>

      {/* Conteúdo do Post Corrigido */}
      <div className="p-4 opacity-70 grayscale-[0.5]">
        <div className="flex items-center gap-2 mb-2">
          {/* Se log.author for apenas uma string, use assim: */}
          <span className="text-xs font-mono font-bold text-primary">@{log.author}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{log.timestamp}</span>
        </div>
        {/* Verifique se a propriedade correta é 'description' ou 'text' no seu LogData */}
        <p className="text-sm font-mono line-clamp-2">
          {"description" in log ? (log as any).description : "Conteúdo não disponível"}
        </p>
      </div>

      {/* Ações de Moderação */}
      <div className="grid grid-cols-2 border-t border-border">
        <button 
          onClick={() => onApprove(log.id)}
          className="flex items-center justify-center gap-2 py-3 bg-success/10 hover:bg-success/20 text-success text-xs font-mono font-bold transition-colors border-r border-border"
        >
          <Check className="w-4 h-4" />
          APROVAR
        </button>
        <button 
          onClick={() => onReject(log.id)}
          className="flex items-center justify-center gap-2 py-3 bg-error/10 hover:bg-error/20 text-error text-xs font-mono font-bold transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          REMOVER
        </button>
      </div>
    </div>
  )
}