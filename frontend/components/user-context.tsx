"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type ThemeName = "terminal" | "cyberpunk" | "dracula" | "mono"

export type Badge = {
  id: string
  label: string
  icon: string
  description: string
  unlocked: boolean
}

export type UserProfile = {
  name: string
  avatar: string
  level: number
  xp: number
  xpToNext: number
  activeBadge: Badge | null
  badges: Badge[]
  streak: number
  theme: ThemeName
  totalLogs: number
}

const DEFAULT_BADGES: Badge[] = [
  { id: "bug-hunter", label: "Bug Hunter", icon: "~", description: "Resolveu 10+ erros", unlocked: true },
  { id: "daily-master", label: "Daily Master", icon: "*", description: "7 dias seguidos de logs", unlocked: true },
  { id: "solucionador", label: "Solucionador", icon: "+", description: "Documentou 20+ solucoes", unlocked: false },
  { id: "mentor", label: "Mentor", icon: ">", description: "50+ comentarios uteis", unlocked: false },
  { id: "resiliente", label: "Resiliente", icon: "#", description: "Compartilhou 10+ frustracoes", unlocked: true },
]

const THEME_UNLOCK_LEVELS: Record<ThemeName, number> = {
  terminal: 0,
  cyberpunk: 3,
  dracula: 5,
  mono: 8,
}

const THEME_LABELS: Record<ThemeName, string> = {
  terminal: "Terminal (Padrao)",
  cyberpunk: "Cyberpunk",
  dracula: "Dracula",
  mono: "Mono High-Contrast",
}

type UserContextType = {
  user: UserProfile
  setTheme: (theme: ThemeName) => void
  setActiveBadge: (badge: Badge | null) => void
  availableThemes: { name: ThemeName; label: string; unlocked: boolean }[]
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    name: "dev_user",
    avatar: "D",
    level: 5,
    xp: 340,
    xpToNext: 500,
    activeBadge: DEFAULT_BADGES[1],
    badges: DEFAULT_BADGES,
    streak: 7,
    theme: "terminal",
    totalLogs: 47,
  })

  const setTheme = useCallback((theme: ThemeName) => {
    setUser((prev) => ({ ...prev, theme }))
    if (theme === "terminal") {
      document.documentElement.removeAttribute("data-theme")
    } else {
      document.documentElement.setAttribute("data-theme", theme)
    }
  }, [])

  const setActiveBadge = useCallback((badge: Badge | null) => {
    setUser((prev) => ({ ...prev, activeBadge: badge }))
  }, [])

  const availableThemes = (Object.keys(THEME_UNLOCK_LEVELS) as ThemeName[]).map((name) => ({
    name,
    label: THEME_LABELS[name],
    unlocked: user.level >= THEME_UNLOCK_LEVELS[name],
  }))

  return (
    <UserContext.Provider value={{ user, setTheme, setActiveBadge, availableThemes }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
