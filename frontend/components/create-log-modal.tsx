"use client"

import { useState } from "react"
import { X, Code, ImageIcon, Send } from "lucide-react"
import { InteractiveLogo } from "@/components/interactive-logo"
import { useUser } from "@/components/user-context"

type LogType = "error" | "warning" | "success" | "frustration"

export function CreateLogModal({ onClose }: { onClose: () => void }) {
  const { user } = useUser()
  const [logType, setLogType] = useState<LogType>("error")
  const [statusCode, setStatusCode] = useState("")
  const [description, setDescription] = useState("")
  const [snippet, setSnippet] = useState("")
  const [tags, setTags] = useState("")
  const [timeSpent, setTimeSpent] = useState("")

  const types: { key: LogType; label: string; face: string; category: string }[] = [
    { key: "error", label: "Erro Critico", face: ">_<", category: "Codigo" },
    { key: "warning", label: "Aviso", face: "o_o", category: "Codigo" },
    { key: "frustration", label: "Frustracao", face: "T_T", category: "Humano" },
    { key: "success", label: "Resolvido", face: "^_^", category: "Ambos" },
  ]

  const isHumanType = logType === "frustration"

  const suggestedTags = isHumanType
    ? ["#SoftSkill", "#Gestao", "#MentalHealth", "#Daily"]
    : ["#React", "#Python", "#Docker", "#TypeScript"]

  const getTypeBg = (type: LogType, isActive: boolean) => {
    if (!isActive) return "bg-secondary text-secondary-foreground"
    switch (type) {
      case "error":
        return "bg-destructive/20 text-destructive border-destructive/40"
      case "warning":
        return "bg-warning/20 text-warning border-warning/40"
      case "frustration":
        return "bg-warning/20 text-warning border-warning/40"
      case "success":
        return "bg-success/20 text-success border-success/40"
    }
  }

  const getMood = () => {
    switch (logType) {
      case "error": return "error" as const
      case "warning": return "thinking" as const
      case "frustration": return "frustration" as const
      case "success": return "success" as const
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-terminal sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              novo-log.md
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Author preview with badge */}
        <div className="flex flex-col items-center gap-2 py-4 border-b border-border">
          <InteractiveLogo size="sm" mood={getMood()} />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              Publicando como <span className="text-card-foreground font-semibold">{user.name}</span>
            </span>
            {user.activeBadge && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[oklch(0.5_0.15_220)]/15 text-[oklch(0.7_0.15_220)]">
                {user.activeBadge.icon && <span className="mr-0.5">{user.activeBadge.icon}</span>}[{user.activeBadge.label}]
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Type selector */}
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-2 block">
              Categoria do log
            </label>
            <div className="grid grid-cols-2 gap-2">
              {types.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setLogType(t.key)}
                  className={`px-3 py-2 rounded border text-xs font-mono transition-colors cursor-pointer ${getTypeBg(t.key, logType === t.key)}`}
                >
                  <span className="block text-center text-base">{t.face}</span>
                  <span className="block text-center mt-0.5">{t.label}</span>
                  <span className="block text-center text-[9px] opacity-60 mt-0.5">{t.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Code / Title */}
          <div>
            <label
              htmlFor="status-code"
              className="text-xs font-mono text-muted-foreground mb-1.5 flex items-center gap-1.5"
            >
              <span className="text-primary">$</span> {isHumanType ? "Titulo da Frustracao" : "Status / Erro"}
            </label>
            <input
              id="status-code"
              type="text"
              value={statusCode}
              onChange={(e) => setStatusCode(e.target.value)}
              placeholder={isHumanType ? "Reuniao que deveria ter sido um e-mail..." : "TypeError: Cannot read property..."}
              className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="text-xs font-mono text-muted-foreground mb-1.5 block"
            >
              {isHumanType ? "O que aconteceu? Como voce se sentiu?" : "O que aconteceu?"}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isHumanType ? "Descreva a situacao e como ela te afetou..." : "Descreva o contexto, o que tentou e como resolveu..."}
              rows={3}
              className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none leading-relaxed"
            />
          </div>

          {/* Snippet - only for code logs */}
          {!isHumanType && (
            <div>
              <label
                htmlFor="snippet"
                className="text-xs font-mono text-muted-foreground mb-1.5 flex items-center gap-1.5"
              >
                <Code className="w-3 h-3" /> Snippet de codigo (opcional)
              </label>
              <textarea
                id="snippet"
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                placeholder="// Cole seu codigo ou mensagem de erro aqui"
                rows={4}
                className="w-full bg-terminal border border-border rounded px-3 py-2 text-xs font-mono text-terminal-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none code-block leading-relaxed"
              />
            </div>
          )}

          {/* Suggested Tags */}
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-1.5 block">
              Tags sugeridas
            </label>
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTags((prev) => prev ? `${prev}, ${tag}` : tag)}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-secondary text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Tags + Time */}
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <label
                htmlFor="tags"
                className="text-xs font-mono text-muted-foreground mb-1.5 block"
              >
                Tags (separadas por virgula)
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={isHumanType ? "#SoftSkill, #Gestao" : "#React, #API, #Docker"}
                className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="w-28">
              <label
                htmlFor="time-spent"
                className="text-xs font-mono text-muted-foreground mb-1.5 block"
              >
                Tempo gasto
              </label>
              <input
                id="time-spent"
                type="text"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                placeholder={isHumanType ? "reflexao" : "2h 30min"}
                className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Image upload placeholder */}
          <button className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded py-3 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer">
            <ImageIcon className="w-4 h-4" />
            <span>Adicionar captura de tela</span>
          </button>
        </div>

        {/* Submit */}
        <div className="px-4 py-3 border-t border-border bg-terminal flex items-center justify-between sticky bottom-0">
          <span className="text-[10px] font-mono text-muted-foreground">
            {isHumanType ? "Voce nao esta sozinho nessa" : "Seu log sera visivel apos a publicacao"}
          </span>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-mono font-semibold hover:opacity-90 transition-colors cursor-pointer">
            <Send className="w-3.5 h-3.5" />
            Publicar Log
          </button>
        </div>
      </div>
    </div>
  )
}
