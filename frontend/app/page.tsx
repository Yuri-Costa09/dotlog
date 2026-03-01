"use client"

import { useState, useCallback } from "react"
import { SprintSidebar } from "@/components/sprint-sidebar"
import { FeedHeader } from "@/components/feed-header"
// ✅ FIX: initialLogs now correctly comes from log-card — no duplicate definition here
import { LogCard, type LogData, initialLogs } from "@/components/log-card"
import { DailyLogButton } from "@/components/daily-log-button"
import { CreateLogModal } from "@/components/create-log-modal"
import { EffortGraph } from "@/components/effort-graph"
import { IDEIntegration } from "@/components/ide-integration"
import { FocusModeBanner } from "@/components/focus-mode"
import { UserProvider, useUser } from "@/components/user-context"
import { ProfilePanel } from "@/components/profile-panel"
import { Flame } from "lucide-react"

// ✅ FIX: Type guard to safely validate filter values from FeedHeader
const VALID_FILTERS = ["todos", "error", "warning", "frustration", "success"] as const
type FilterType = (typeof VALID_FILTERS)[number]

function isValidFilter(value: string): value is FilterType {
  return VALID_FILTERS.includes(value as FilterType)
}

function StreakIndicator({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20">
      <Flame className="w-3.5 h-3.5 text-primary" />
      <span className="text-xs font-mono font-semibold text-primary">{streak}d</span>
      <span className="text-[10px] font-mono text-muted-foreground">streak</span>
    </div>
  )
}

function HomeContent() {
  const { user } = useUser()
  const [showCreateLog, setShowCreateLog] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos")
  const [hasPostedToday, setHasPostedToday] = useState(false)
  const [focusDismissed, setFocusDismissed] = useState(false)

  // ✅ FIX: Removed redundant (log: LogData) annotation — inferred from initialLogs type
  const filteredLogs =
    activeFilter === "todos"
      ? initialLogs
      : initialLogs.filter((log) => log.type === activeFilter)

  const handleSelectLog = useCallback((logId: string) => {
    const element = document.getElementById(`log-${logId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [])

  // ✅ FIX: Safe filter change using type guard instead of unsafe cast
  const handleFilterChange = (value: string) => {
    if (isValidFilter(value)) {
      setActiveFilter(value)
    }
  }

  // ✅ FIX: hasPostedToday is now set to true when a log is successfully created
  const handleCreateLogClose = (posted?: boolean) => {
    if (posted) {
      setHasPostedToday(true)
    }
    setShowCreateLog(false)
  }

  const showFocusBanner = !hasPostedToday && !focusDismissed

  return (
    <div className="h-dvh flex overflow-hidden bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:relative z-40 h-full transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <SprintSidebar onSelectLog={handleSelectLog} />
      </div>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <FeedHeader
            onFilterChange={handleFilterChange}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto p-4 space-y-4">
              {showFocusBanner && (
                <FocusModeBanner
                  hasPostedToday={hasPostedToday}
                  onDismiss={() => setFocusDismissed(true)}
                />
              )}

              {filteredLogs.map((log: LogData) => (
                <div key={log.id} id={`log-${log.id}`}>
                  <LogCard log={log} />
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm font-mono text-muted-foreground">
                    <span className="text-primary">$</span> Nenhum log encontrado para este filtro
                  </p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    .log( o_o ) — tente outro filtro
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="hidden xl:flex w-80 flex-col border-l border-border bg-sidebar overflow-y-auto">
          <div className="p-4 space-y-4">
            <ProfilePanel />

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-mono font-semibold text-card-foreground">
                  <span className="text-primary">$</span> status-do-dia
                </h2>
                <StreakIndicator streak={user.streak} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-terminal rounded p-3 text-center">
                  <p className="text-lg font-mono font-bold text-primary">12</p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    Logs esta semana
                  </p>
                </div>
                <div className="bg-terminal rounded p-3 text-center">
                  <p className="text-lg font-mono font-bold text-foreground">Nv.{user.level}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">Nivel atual</p>
                </div>
                <div className="bg-terminal rounded p-3 text-center">
                  <p className="text-lg font-mono font-bold text-success">68%</p>
                  <p className="text-[10px] font-mono text-muted-foreground">Resolvidos</p>
                </div>
                <div className="bg-terminal rounded p-3 text-center">
                  <p className="text-lg font-mono font-bold text-warning">156</p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    Ja passei por isso
                  </p>
                </div>
              </div>
            </div>

            <EffortGraph />
            <IDEIntegration />

            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-sm font-mono font-semibold text-card-foreground mb-3">
                <span className="text-primary">#</span> tags-em-alta
              </h2>
              <div className="space-y-2">
                {[
                  { tag: "React", count: 342 },
                  { tag: "Docker", count: 218 },
                  { tag: "Python", count: 195 },
                  { tag: "TypeScript", count: 167 },
                  { tag: "CI/CD", count: 134 },
                ].map((t) => (
                  <div key={t.tag} className="flex items-center justify-between">
                    <span className="text-xs font-mono text-card-foreground">#{t.tag}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {t.count} logs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>

      <DailyLogButton onClick={() => setShowCreateLog(true)} />

      {/* ✅ FIX: onClose now accepts optional `posted` boolean to track daily posting */}
      {showCreateLog && <CreateLogModal onClose={handleCreateLogClose} />}
    </div>
  )
}

export default function Home() {
  return (
    <UserProvider>
      <HomeContent />
    </UserProvider>
  )
}