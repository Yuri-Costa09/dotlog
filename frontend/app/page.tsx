"use client"

import { useState, useCallback } from "react"
import { FolderSidebar } from "@/components/folders-sidebar"
import { FeedHeader } from "@/components/feed-header"
import { LogCard, type LogData, initialLogs } from "@/components/log-card"
import { CreateLogModal } from "@/components/create-log-modal"
import { CreateLogTrigger } from "@/components/create-log-trigger" // ✅ Integrando o trigger
import { IDEIntegration } from "@/components/ide-integration"
import { FocusModeBanner } from "@/components/focus-mode"
import { UserProvider, useUser } from "@/components/user-context"
import { ProfilePanel } from "@/components/profile-panel"
import { Flame } from "lucide-react"

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

  const filteredLogs = activeFilter === "todos" 
    ? initialLogs 
    : initialLogs.filter((log) => log.type === activeFilter)

  const handleFilterChange = (value: string) => {
    if (isValidFilter(value)) setActiveFilter(value)
  }

  const handleCreateLogClose = (posted?: boolean) => {
    if (posted) setHasPostedToday(true)
    setShowCreateLog(false)
  }

  return (
    // ✅ h-screen e overflow-hidden garantem que a UI preencha a altura toda sem scroll na página inteira
    <div className="h-screen flex overflow-hidden bg-background">
      
      {/* Sidebar Esquerda: h-full garante que ela estique até o pé da página */}
      <div className={`fixed lg:relative z-40 h-full bg-sidebar border-r border-border transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <FolderSidebar onSelectLog={(id) => document.getElementById(`log-${id}`)?.scrollIntoView({ behavior: "smooth" })} />
      </div>

      <main className="flex-1 flex overflow-hidden">
        {/* Coluna Central: Timeline */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-border">
          <FeedHeader
            onFilterChange={handleFilterChange}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="flex-1 overflow-y-auto bg-background/50">
            {/* ✅ Aumentei o max-w para 4xl para a timeline não ficar tão "espremida" em telas grandes */}
            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
              
              {!hasPostedToday && !focusDismissed && (
                <FocusModeBanner
                  hasPostedToday={hasPostedToday}
                  onDismiss={() => setFocusDismissed(true)}
                />
              )}

              {/* ✅ Novo Gatilho de Log substituindo o botão flutuante */}
              <div onClick={() => setShowCreateLog(true)}>
                <CreateLogTrigger />
              </div>

              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div key={log.id} id={`log-${log.id}`}>
                    <LogCard log={log} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Sidebar Direita: bg-card preenche o espaço e h-full evita o fundo vazio */}
        <aside className="hidden xl:flex w-80 flex-col bg-card/30 overflow-y-auto h-full">
          <div className="p-4 space-y-6">
            <ProfilePanel />

            {/* Widget de Status com Grid ajustado */}
            <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Status do Dia
                </h2>
                <StreakIndicator streak={user.streak} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-secondary/30 rounded p-2 text-center border border-border/50">
                  <p className="text-lg font-mono font-bold text-primary">12</p>
                  <p className="text-[9px] font-mono text-muted-foreground uppercase">Logs</p>
                </div>
                <div className="bg-secondary/30 rounded p-2 text-center border border-border/50">
                  <p className="text-lg font-mono font-bold text-success">68%</p>
                  <p className="text-[9px] font-mono text-muted-foreground uppercase">Fix</p>
                </div>
              </div>
            </div>

            <IDEIntegration />

            {/* Tags em Alta */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                # Tags em Alta
              </h2>
              <div className="space-y-2">
                {["React", "Docker", "Python", "CI/CD"].map((tag) => (
                  <div key={tag} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">#{tag}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/50">120 logs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>

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