"use client"

import { useState } from "react"
import { useUser, type ThemeName, type Badge } from "@/components/user-context"
import { ChevronDown, ChevronUp, Lock, Check, Palette, Award } from "lucide-react"

export function ProfilePanel() {
  const { user, setTheme, setActiveBadge, availableThemes } = useUser()
  const [expanded, setExpanded] = useState(false)
  const [section, setSection] = useState<"theme" | "badge" | null>(null)

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* User header */}
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
            {user.activeBadge && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[oklch(0.5_0.15_220)]/15 text-[oklch(0.7_0.15_220)]">
                [{user.activeBadge.label}]
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-mono text-muted-foreground">
              Nv.{user.level}
            </span>
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
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-border">
          {/* Section tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setSection(section === "theme" ? null : "theme")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono transition-colors cursor-pointer ${
                section === "theme" ? "bg-secondary text-primary" : "text-muted-foreground hover:text-card-foreground"
              }`}
            >
              <Palette className="w-3 h-3" />
              Temas
            </button>
            <button
              onClick={() => setSection(section === "badge" ? null : "badge")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono transition-colors cursor-pointer ${
                section === "badge" ? "bg-secondary text-primary" : "text-muted-foreground hover:text-card-foreground"
              }`}
            >
              <Award className="w-3 h-3" />
              Badges
            </button>
          </div>

          {/* Theme selector */}
          {section === "theme" && (
            <div className="p-3 space-y-1.5">
              {availableThemes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => t.unlocked && setTheme(t.name)}
                  disabled={!t.unlocked}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-mono transition-colors ${
                    !t.unlocked
                      ? "opacity-40 cursor-not-allowed text-muted-foreground"
                      : user.theme === t.name
                        ? "bg-primary/15 text-primary cursor-pointer"
                        : "text-card-foreground hover:bg-secondary cursor-pointer"
                  }`}
                >
                  <ThemePreview theme={t.name} />
                  <span className="flex-1 text-left">{t.label}</span>
                  {!t.unlocked && <Lock className="w-3 h-3" />}
                  {t.unlocked && user.theme === t.name && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}

          {/* Badge selector */}
          {section === "badge" && (
            <div className="p-3 space-y-1.5">
              {/* Option to clear badge */}
              <button
                onClick={() => setActiveBadge(null)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-mono transition-colors cursor-pointer ${
                  !user.activeBadge
                    ? "bg-primary/15 text-primary"
                    : "text-card-foreground hover:bg-secondary"
                }`}
              >
                <span className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-[10px] text-muted-foreground">
                  -
                </span>
                <span className="flex-1 text-left">Sem badge</span>
                {!user.activeBadge && <Check className="w-3 h-3" />}
              </button>
              {user.badges.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => badge.unlocked && setActiveBadge(badge)}
                  disabled={!badge.unlocked}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-mono transition-colors ${
                    !badge.unlocked
                      ? "opacity-40 cursor-not-allowed text-muted-foreground"
                      : user.activeBadge?.id === badge.id
                        ? "bg-primary/15 text-primary cursor-pointer"
                        : "text-card-foreground hover:bg-secondary cursor-pointer"
                  }`}
                >
                  <span className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-[10px] text-primary font-bold">
                    {badge.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <span className="block">[{badge.label}]</span>
                    <span className="block text-[10px] text-muted-foreground">{badge.description}</span>
                  </div>
                  {!badge.unlocked && <Lock className="w-3 h-3" />}
                  {badge.unlocked && user.activeBadge?.id === badge.id && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ThemePreview({ theme }: { theme: ThemeName }) {
  const colors: Record<ThemeName, string[]> = {
    terminal: ["bg-[oklch(0.16_0.02_170)]", "bg-[oklch(0.75_0.15_65)]", "bg-[oklch(0.22_0.02_170)]"],
    cyberpunk: ["bg-[oklch(0.13_0.01_300)]", "bg-[oklch(0.72_0.22_340)]", "bg-[oklch(0.2_0.02_300)]"],
    dracula: ["bg-[oklch(0.19_0.02_280)]", "bg-[oklch(0.68_0.18_300)]", "bg-[oklch(0.25_0.03_280)]"],
    mono: ["bg-[oklch(0.08_0_0)]", "bg-[oklch(0.98_0_0)]", "bg-[oklch(0.18_0_0)]"],
  }
  const c = colors[theme]
  return (
    <div className="flex gap-0.5">
      <span className={`w-3 h-3 rounded-sm ${c[0]} border border-border`} />
      <span className={`w-3 h-3 rounded-sm ${c[1]}`} />
      <span className={`w-3 h-3 rounded-sm ${c[2]} border border-border`} />
    </div>
  )
}
