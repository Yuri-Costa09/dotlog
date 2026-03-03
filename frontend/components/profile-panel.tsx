"use client"

import { useState } from "react"
import { useUser, type ThemeName } from "@/components/user-context"
import { ChevronDown, ChevronUp, Lock, Check, Palette, Award } from "lucide-react"
import { UserBadge } from "./user-badge"

/**
 * Preview das cores de cada tema para o seletor
 */
function ThemePreview({ theme }: { theme: ThemeName }) {
  const colors: Record<ThemeName, string[]> = {
    terminal: [
      "bg-[oklch(0.13_0_0)]",       // --terminal
      "bg-[oklch(0.62_0.22_264)]",  // --primary (#0055FF)
      "bg-[oklch(0.8_0.16_80)]"     // --warning
    ], 
    cyberpunk: [
      "bg-[oklch(0.13_0_0)]", 
      "bg-[oklch(0.72_0.22_340)]", 
      "bg-[oklch(0.72_0.22_340)]"
    ],
    dracula: [
      "bg-[oklch(0.19_0.02_280)]", 
      "bg-[oklch(0.68_0.18_300)]", 
      "bg-[oklch(0.55195_0.1011_254.68)]"
    ],
    mono: [
      "bg-[oklch(0.08_0_0)]", 
      "bg-[oklch(0.98_0_0)]", 
      "bg-[oklch(0.18_0_0)]"
    ],
  }

  const c = colors[theme]
  
  return (
    <div className="flex gap-0.5">
      <span className={`w-3 h-3 rounded-sm ${c[0]} border border-border/50`} />
      <span className={`w-3 h-3 rounded-sm ${c[1]}`} />
      <span className={`w-3 h-3 rounded-sm ${c[2]} border border-border/50`} />
    </div>
  )
}

export function ProfilePanel() {
  const { user, setTheme, setActiveBadge, availableThemes } = useUser()
  const [expanded, setExpanded] = useState(false)
  const [section, setSection] = useState<"theme" | "badge" | null>(null)

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden font-sans">
      {/* Header do Usuário */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-sm text-primary font-bold font-mono shrink-0">
          {user.avatar}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-semibold text-card-foreground">
              {user.name}
            </span>
            {/* Badge atual ao lado do nome */}
            <UserBadge />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-mono text-muted-foreground">Nv.{user.level}</span>
            <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden max-w-20">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {user.xp}/{user.xpToNext} xp
            </span>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Abas de Navegação */}
          <div className="flex border-b border-border">
            <button 
              onClick={() => setSection("theme")} 
              className={`flex-1 py-2 text-xs font-mono transition-colors ${section === "theme" ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Palette className="inline w-3 h-3 mr-1" /> Temas
            </button>
            <button 
              onClick={() => setSection("badge")} 
              className={`flex-1 py-2 text-xs font-mono transition-colors ${section === "badge" ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Award className="inline w-3 h-3 mr-1" /> Badges
            </button>
          </div>

          {/* Seção de Temas */}
          {section === "theme" && (
            <div className="p-3 space-y-1.5">
              {availableThemes.map((t) => (
                <button 
                  key={t.name} 
                  onClick={() => t.unlocked && setTheme(t.name)} 
                  disabled={!t.unlocked} 
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-mono transition-colors ${!t.unlocked ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary"}`}
                >
                  <ThemePreview theme={t.name} />
                  <span className="flex-1 text-left">{t.label}</span>
                  {!t.unlocked ? <Lock className="w-3 h-3" /> : user.theme === t.name && <Check className="w-3 h-3 text-primary" />}
                </button>
              ))}
            </div>
          )}

          {/* Seção de Badges (Bloqueados e Desbloqueados) */}
          {section === "badge" && (
            <div className="p-3 space-y-1.5">
              {user.badges.map((badge) => {
                const isLocked = !badge.unlocked;
                const isActive = user.activeBadge?.id === badge.id;

                return (
                  <button 
                    key={badge.id} 
                    onClick={() => !isLocked && setActiveBadge(badge)} 
                    disabled={isLocked} 
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-mono transition-colors relative
                      ${isLocked ? "opacity-40 cursor-not-allowed" : "hover:bg-secondary cursor-pointer"}`}
                  >
                    {/* O UserBadge herda o backgroundColor: white do componente */}
                    <div className={isLocked ? "grayscale" : ""}>
                      <UserBadge badgeLabel={badge.label} />
                    </div>

                    <div className="flex-1 text-left ml-1">
                      <span className={`block font-bold ${isLocked ? "text-muted-foreground" : "text-card-foreground"}`}>
                        {isLocked ? "???" : `[${badge.label}]`}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight block">
                        {badge.description}
                      </span>
                    </div>

                    {/* Ícone de status: Check para ativo, Cadeado para bloqueado */}
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-muted-foreground/50" />
                    ) : (
                      isActive && <Check className="w-3 h-3 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}