"use client"

import { useState, useCallback } from "react"
import { FolderSidebar } from "@/components/folders-sidebar"
import { FeedHeader } from "@/components/feed-header"
import { LogCard, type LogData, initialLogs } from "@/components/log-card"
import { CreateLogModal } from "@/components/create-log-modal"
import { CreateLogTrigger } from "@/components/create-log-trigger"
import { IDEIntegration } from "@/components/ide-integration"
import { FocusModeBanner } from "@/components/focus-mode"
import { UserProvider, useUser } from "@/components/user-context"
import { ProfilePanel } from "@/components/profile-panel"
import { Flame, ShieldAlert } from "lucide-react"

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
    <div className="h-screen flex overflow-hidden bg-background">
      
      {/* Sidebar Esquerda: Mantida para navegação básica */}
      <div className={`fixed lg:relative z-40 h-full bg-sidebar border-r border-border transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <FolderSidebar onSelectLog={(id) => document.getElementById(`log-${id}`)?.scrollIntoView({ behavior: "smooth" })} />
      </div>

      <main className="flex-1 flex overflow-hidden">
        {/* Coluna Central: Foco em Moderação */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-border">
          <FeedHeader
            onFilterChange={handleFilterChange}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="flex-1 overflow-y-auto bg-background/50">
            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
              
              {/* OCULTO: Focus Mode */}
              {/* {!hasPostedToday && !focusDismissed && (
                <FocusModeBanner
                  hasPostedToday={hasPostedToday}
                  onDismiss={() => setFocusDismissed(true)}
                />
              )} */}

              {/* OCULTO: Gatilho de Criação de Log */}
              {/* <div onClick={() => setShowCreateLog(true)}>
                <CreateLogTrigger />
              </div> */}

              <div className="space-y-4">
                {/* PLACEHOLDER: Espaço para o sistema de denúncia/verificação */}
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                  <ShieldAlert className="w-12 h-12 text-primary/40 mb-4" />
                  <h2 className="text-lg font-mono font-bold text-foreground">Ambiente de Moderação</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-2">
                    Logs ocultos para priorizar o fluxo de verificação e denúncia.
                  </p>
                </div>

                {/* OCULTO: Feed de Logs */}
                {/* {filteredLogs.map((log) => (
                  <div key={log.id} id={`log-${log.id}`}>
                    <LogCard log={log} />
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>

        {/* OCULTO: Sidebar Direita Completa */}
        {/* <aside className="hidden xl:flex w-80 flex-col bg-card/30 overflow-y-auto h-full">
          <div className="p-4 space-y-6">
            <ProfilePanel />

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
        */}
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