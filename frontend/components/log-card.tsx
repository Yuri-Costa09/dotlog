"use client"

import { useState } from "react"
import { Clock, Users, MessageSquare, Tag, Wrench, Heart, ChevronDown, ChevronUp, Send } from "lucide-react"
import { LogoBadge } from "@/components/interactive-logo"

export type LogType = "error" | "warning" | "success" | "frustration"

export type LogData = {
  id: string
  author: string
  avatar: string
  badge?: string
  badgeIcon?: string
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
  fix?: string
}

export const initialLogs: LogData[] = [
  {
    id: "1",
    author: "ana_dev",
    avatar: "A",
    badge: "Bug Hunter",
    badgeIcon: "~",
    statusCode: "TypeError: Cannot read property 'map' of undefined",
    description: "Perdi 2h tentando entender porque meu array estava undefined. A API retornava um objeto, nao um array, e eu nao estava tratando o caso de erro.",
    snippet: "// ❌ Antes\nconst items = data.map(item => item.name)\n\n// ✅ Depois\nconst items = (data ?? []).map(item => item.name)",
    tags: ["#React", "#API", "#JavaScript"],
    type: "error",
    category: "code",
    timeSpent: "2h 15min",
    timestamp: "hoje, 14:32",
    relatedCount: 47,
    commentCount: 12,
  },
  {
    id: "2",
    author: "marcos_rb",
    avatar: "M",
    badge: "Docker Sailor",
    badgeIcon: "🐳",
    statusCode: "Container keeps restarting with exit code 137",
    description: "Meu container ficava morrendo sem motivo aparente. Depois de muito debug, descobri que era OOM killer — limite de memória muito baixo no compose.",
    snippet: "# docker-compose.yml\nservices:\n  app:\n    mem_limit: 512m   # ❌ muito baixo\n    mem_limit: 1g     # ✅ resolvido",
    tags: ["#Docker", "#DevOps", "#Linux"],
    type: "success",
    category: "code",
    timeSpent: "3h 40min",
    timestamp: "hoje, 11:15",
    relatedCount: 89,
    commentCount: 23,
    fix: "Aumentei o mem_limit para 1g no docker-compose e adicionei monitoramento de memória com docker stats.",
  },
  {
    id: "3",
    author: "julia_codes",
    avatar: "J",
    statusCode: "Reuniao de 2h que poderia ter sido um email",
    description: "Terceira vez essa semana que sinto que meu tempo nao esta sendo respeitado. Dificil manter foco depois disso.",
    tags: ["#SoftSkill", "#Produtividade", "#Comunicacao"],
    type: "frustration",
    category: "human",
    timeSpent: "2h 00min",
    timestamp: "hoje, 09:00",
    relatedCount: 134,
    commentCount: 41,
  },
  {
    id: "4",
    author: "pedro_ts",
    avatar: "P",
    badge: "Type Wizard",
    badgeIcon: "✦",
    statusCode: "TS2345: Argument of type 'string | undefined' is not assignable",
    description: "TypeScript reclamando de um valor que eu tinha certeza que existia. Precisei entender melhor o fluxo de dados antes de sair colocando '!' em tudo.",
    snippet: "// ❌ Perigoso\nconst name = user.profile!.name\n\n// ✅ Seguro\nconst name = user.profile?.name ?? 'Anônimo'",
    tags: ["#TypeScript", "#React", "#BugFix"],
    type: "warning",
    category: "code",
    timeSpent: "45min",
    timestamp: "ontem, 17:22",
    relatedCount: 62,
    commentCount: 8,
  },
  {
    id: "5",
    author: "carol_dev",
    avatar: "C",
    badge: "CI Champion",
    badgeIcon: "⚙",
    statusCode: "Pipeline failing on deploy step — permission denied",
    description: "O CI passava nos testes mas morria no deploy. Era uma variavel de ambiente que nao estava configurada no ambiente de producao.",
    snippet: "# .github/workflows/deploy.yml\n- name: Deploy\n  env:\n    API_KEY: ${{ secrets.PROD_API_KEY }}  # ✅ adicionar secret no repo",
    tags: ["#CI/CD", "#GitHub", "#DevOps"],
    type: "success",
    category: "code",
    timeSpent: "1h 20min",
    timestamp: "ontem, 14:05",
    relatedCount: 31,
    commentCount: 6,
    fix: "Adicionei o secret PROD_API_KEY nas configurações do repositório e atualizei o workflow para referenciá-lo corretamente.",
  },
]

function getTypeBorder(type: LogType) {
  switch (type) {
    case "error":
      return "border-l-destructive"
    case "warning":
    case "frustration":
      return "border-l-warning"
    case "success":
      return "border-l-success"
  }
}

function getTypeLabel(type: LogType) {
  switch (type) {
    case "error":
      return { text: "ERRO", face: "error" as const }
    case "warning":
      return { text: "AVISO", face: "thinking" as const }
    case "frustration":
      return { text: "FRUSTRACAO", face: "frustration" as const }
    case "success":
      return { text: "RESOLVIDO", face: "success" as const }
  }
}

function getTypeBadgeBg(type: LogType) {
  switch (type) {
    case "error":
      return "bg-destructive/15 text-destructive"
    case "warning":
    case "frustration":
      return "bg-warning/15 text-warning"
    case "success":
      return "bg-success/15 text-success"
  }
}

function isHumanLog(log: LogData) {
  return log.category === "human" || log.type === "frustration"
}

export function LogCard({
  log,
  onStatusChange,
}: {
  log: LogData
  onStatusChange?: (id: string, fix: string) => void
}) {
  const [hasRelated, setHasRelated] = useState(false)
  const [relatedCount, setRelatedCount] = useState(log.relatedCount)
  const [showFixForm, setShowFixForm] = useState(false)
  const [fixText, setFixText] = useState(log.fix || "")
  const typeInfo = getTypeLabel(log.type)
  const human = isHumanLog(log)

  const handleRelated = () => {
    setHasRelated(!hasRelated)
    setRelatedCount((prev) => (hasRelated ? prev - 1 : prev + 1))
  }

  const handleSubmitFix = () => {
    if (fixText.trim()) {
      onStatusChange?.(log.id, fixText)
      setShowFixForm(false)
    }
  }

  const canResolve =
    log.type === "error" || log.type === "warning" || log.type === "frustration"

  return (
    <article
      className={`bg-card border border-border border-l-4 ${getTypeBorder(log.type)} rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/30 shadow-sm`}
    >
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
              {log.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-[oklch(0.5_0.15_220)]/30 text-[oklch(0.7_0.15_220)] leading-none">
                  {log.badgeIcon && <span className="mr-0.5">{log.badgeIcon}</span>}
                  {log.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${getTypeBadgeBg(log.type)}`}
              >
                {typeInfo.text}
              </span>
              {human && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  SOFT SKILL
                </span>
              )}
              <span className="text-[10px] text-muted-foreground font-mono">
                • {log.timestamp}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-1 opacity-80 hover:opacity-100 transition-opacity">
          <LogoBadge type={typeInfo.face} />
        </div>
      </div>

      <div className="px-4 pb-3">
        <h3 className="text-[13px] font-mono font-semibold text-card-foreground leading-snug">
          <span className="text-primary/70 mr-1">$</span>
          {log.statusCode}
        </h3>
        <p className="text-xs text-muted-foreground font-mono mt-1.5 leading-relaxed">
          {log.description}
        </p>
      </div>

      {log.snippet && (
        <div className="mx-4 mb-3 rounded bg-terminal border border-border overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border bg-secondary/30">
            <span className="w-2 h-2 rounded-full bg-destructive/60" />
            <span className="w-2 h-2 rounded-full bg-warning/60" />
            <span className="w-2 h-2 rounded-full bg-success/60" />
            <span className="ml-2 text-[10px] text-muted-foreground font-mono">terminal</span>
          </div>
          <pre className="p-3 text-xs font-mono text-terminal-foreground overflow-x-auto leading-relaxed code-block">
            <code>{log.snippet}</code>
          </pre>
        </div>
      )}

      {log.fix && log.type === "success" && (
        <div className="mx-4 mb-3 rounded bg-success/5 border border-success/20 overflow-hidden">
          <div className="px-3 py-1.5 border-b border-success/20 bg-success/10">
            <span className="text-[10px] font-mono text-success font-semibold">
              {human ? "// Plano de Acao:" : "// Fix:"}
            </span>
          </div>
          <p className="p-3 text-xs font-mono text-card-foreground leading-relaxed">{log.fix}</p>
        </div>
      )}

      <div className="px-4 pb-3 flex items-center gap-1.5 flex-wrap">
        <Tag className="w-3 h-3 text-muted-foreground" />
        {log.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {canResolve && showFixForm && (
        <div className="mx-4 mb-3 rounded bg-terminal border border-border overflow-hidden">
          <div className="px-3 py-1.5 border-b border-border bg-secondary/30">
            <span className="text-[10px] font-mono text-muted-foreground">
              {human ? "// Plano de Acao:" : "// Fix:"}
            </span>
          </div>
          <textarea
            value={fixText}
            onChange={(e) => setFixText(e.target.value)}
            placeholder={
              human
                ? "Descreva o plano de acao ou como lidou com a situacao..."
                : "Descreva a solucao ou cole o codigo corrigido..."
            }
            rows={3}
            className="w-full bg-transparent px-3 py-2 text-xs font-mono text-terminal-foreground placeholder:text-muted-foreground focus:outline-none resize-none code-block leading-relaxed"
          />
          <div className="px-3 py-2 border-t border-border flex items-center justify-end gap-2">
            <button
              onClick={() => setShowFixForm(false)}
              className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitFix}
              className="flex items-center gap-1 bg-success/20 text-success px-2.5 py-1 rounded text-[10px] font-mono font-semibold hover:bg-success/30 transition-colors cursor-pointer"
            >
              <Send className="w-3 h-3" />
              Resolver
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-t border-border flex items-center gap-3 flex-wrap">
        <button
          onClick={handleRelated}
          className={`flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
            hasRelated
              ? "text-primary font-semibold"
              : "text-muted-foreground hover:text-card-foreground"
          }`}
          aria-label={human ? "Tamo junto" : "Ja passei por isso"}
        >
          {human ? (
            <Heart className={`w-3.5 h-3.5 ${hasRelated ? "fill-primary" : ""}`} />
          ) : (
            <Users className="w-3.5 h-3.5" />
          )}
          <span>{human ? "Tamo junto" : "Ja passei por isso"}</span>
          <span className="text-[10px] ml-0.5">({relatedCount})</span>
        </button>

        <button
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
          aria-label="Comentarios"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{log.commentCount}</span>
        </button>

        {canResolve && !showFixForm && (
          <button
            onClick={() => setShowFixForm(true)}
            className="flex items-center gap-1.5 text-xs font-mono text-success/70 hover:text-success transition-colors cursor-pointer"
            aria-label="Documentar solucao"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Documentar Solucao</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        )}

        {canResolve && showFixForm && (
          <button
            onClick={() => setShowFixForm(false)}
            className="flex items-center gap-1.5 text-xs font-mono text-warning hover:text-warning/80 transition-colors cursor-pointer"
          >
            <ChevronUp className="w-3 h-3" />
            <span>Fechar</span>
          </button>
        )}

        <div className="ml-auto flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{log.timeSpent}</span>
        </div>
      </div>
    </article>
  )
}