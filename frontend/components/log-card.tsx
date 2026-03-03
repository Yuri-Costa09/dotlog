"use client"

import { useState } from "react"
import { Clock, Users, Heart } from "lucide-react"
import { LogoBadge } from "@/components/interactive-logo"
import { UserBadge } from "./user-badge"

export type LogType = "error" | "warning" | "success" | "frustration"

export type LogData = {
  id: string
  author: string
  avatar: string
  badge?: string
  statusCode: string
  description: string
  snippet?: string
  tags: string[]
  type: LogType
  timeSpent: string
  timestamp: string
  relatedCount: number
  commentCount: number
  category?: "code" | "human"
}

/**
 * ✅ FIX: initialLogs exportado novamente para resolver o erro no page.tsx
 */
export const initialLogs: LogData[] = [
  {
    id: "1",
    author: "ana_dev",
    avatar: "A",
    badge: "Bug Hunter",
    statusCode: "TypeError: Cannot read property 'map' of undefined",
    description: "Perdi 2h tentando entender porque meu array estava undefined.",
    snippet: "// ✅ Depois\nconst items = (data ?? []).map(item => item.name)",
    tags: ["#React", "#API", "#JavaScript"],
    type: "error",
    category: "code",
    timeSpent: "2h 15min",
    timestamp: "hoje, 14:32",
    relatedCount: 47,
    commentCount: 12,
  },
  {
    id: "3",
    author: "julia_codes",
    avatar: "J",
    badge: "Resiliente",
    statusCode: "Reuniao de 2h que poderia ter sido um email",
    description: "Terceira vez essa semana que sinto que meu tempo nao esta sendo respeitado.",
    tags: ["#SoftSkill", "#Produtividade"],
    type: "frustration",
    category: "human",
    timeSpent: "2h 00min",
    timestamp: "hoje, 09:00",
    relatedCount: 134,
    commentCount: 41,
  }
]

export function LogCard({ log }: { log: LogData }) {
  const [hasRelated, setHasRelated] = useState(false)
  
  const typeInfo = (type: LogType) => {
    switch (type) {
      case "error": return { text: "ERRO", face: "error" as const, border: "border-l-destructive", bg: "bg-destructive/15 text-destructive" }
      case "warning": return { text: "AVISO", face: "thinking" as const, border: "border-l-warning", bg: "bg-warning/15 text-warning" }
      case "frustration": return { text: "FRUSTRACAO", face: "frustration" as const, border: "border-l-warning", bg: "bg-warning/15 text-warning" }
      case "success": return { text: "RESOLVIDO", face: "success" as const, border: "border-l-success", bg: "bg-success/15 text-success" }
    }
  }

  const style = typeInfo(log.type)
  const isHuman = log.category === "human" || log.type === "frustration"

  return (
    <article className={`bg-card border border-border border-l-4 ${style.border} rounded-lg overflow-hidden transition-all hover:border-primary/30 shadow-sm mb-4`}>
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-sm text-primary font-bold font-mono shrink-0 border border-border">
            {log.avatar}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-card-foreground truncate">
                {log.author}
              </span>
              
              {/* ✅ Badge com tamanho ajustado e hover liberado */}
              {log.badge && (
                <div className="flex shrink-0 items-center justify-center w-4 h-4 overflow-visible">
                  <UserBadge badgeLabel={log.badge} /> 
                </div>
              )} 
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${style.bg}`}>
                {style.text}
              </span>
              {isHuman && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  SOFT SKILL
                </span>
              )}
              <span className="text-[10px] text-muted-foreground font-mono">• {log.timestamp}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-1">
          <LogoBadge type={style.face} />
        </div>
      </div>

      <div className="px-4 pb-3">
        <h3 className="text-[13px] font-mono font-semibold text-card-foreground">
          <span className="text-primary/70 mr-1">$</span>{log.statusCode}
        </h3>
        <p className="text-xs text-muted-foreground font-mono mt-1.5">{log.description}</p>
      </div>

      {log.snippet && (
        <div className="mx-4 mb-3 rounded bg-terminal border border-border overflow-hidden">
          <pre className="p-3 text-xs font-mono text-terminal-foreground overflow-x-auto code-block">
            <code>{log.snippet}</code>
          </pre>
        </div>
      )}

      <div className="px-4 py-3 border-t border-border flex items-center gap-3">
        <button 
          onClick={() => setHasRelated(!hasRelated)} 
          className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${hasRelated ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          {isHuman ? <Heart className={`w-3.5 h-3.5 ${hasRelated ? "fill-primary" : ""}`} /> : <Users className="w-3.5 h-3.5" />}
          <span>{isHuman ? "Tamo junto" : "Ja passei por isso"}</span>
        </button>
        <div className="ml-auto text-xs font-mono text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" /> {log.timeSpent}
        </div>
      </div>
    </article>
  )
}