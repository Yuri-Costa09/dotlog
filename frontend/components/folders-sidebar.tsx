"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText, Terminal } from "lucide-react"
import { InteractiveLogo } from "@/components/interactive-logo"

// Mudança de nomenclatura de 'Sprint' para 'Folder'
type FolderType = {
  id: string
  name: string
  path: string
  logs: { id: string; title: string; type: "error" | "warning" | "success" }[]
  isOpen?: boolean
}

const mockFolders: FolderType[] = [
  {
    id: "1",
    name: "project-python",
    path: "/home/dev/project-python",
    logs: [
      { id: "1a", title: "TypeError: NoneType", type: "error" },
      { id: "1b", title: "pip install fix", type: "success" },
      { id: "1c", title: "venv path warning", type: "warning" },
    ],
  },
  {
    id: "2",
    name: "web-app-react",
    path: "/home/dev/web-app-react",
    logs: [
      { id: "2a", title: "useEffect loop", type: "error" },
      { id: "2b", title: "Context pattern", type: "success" },
    ],
  },
  {
    id: "3",
    name: "infrastructure-devops",
    path: "/home/dev/infrastructure-devops",
    logs: [
      { id: "3a", title: "Docker build fail", type: "error" },
      { id: "3b", title: "nginx.conf fix", type: "success" },
      { id: "3c", title: "SSL cert expired", type: "warning" },
      { id: "3d", title: "CI/CD pipeline ok", type: "success" },
    ],
  },
]

function getTypeColor(type: string) {
  switch (type) {
    case "error":
      return "text-destructive"
    case "warning":
      return "text-warning"
    case "success":
      return "text-success"
    default:
      return "text-muted-foreground"
  }
}

export function FolderSidebar({
  onSelectLog,
}: {
  onSelectLog?: (logId: string) => void
}) {
  // Estado agora gerencia 'folders'
  const [folders, setFolders] = useState<FolderType[]>(
    mockFolders.map((f) => ({ ...f, isOpen: f.id === "1" }))
  )

  const toggleFolder = (id: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isOpen: !f.isOpen } : f))
    )
  }

  return (
    <aside className="w-72 h-full flex flex-col border-r border-border bg-sidebar">
      {/* Logo Section */}
      <div className="p-4 border-b border-border">
        <InteractiveLogo size="md" />
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          Documente seu processo
        </p>
      </div>

      {/* Terminal path - agora refletindo 'folders' */}
      <div className="px-4 py-2 border-b border-border bg-terminal flex items-center gap-2">
        <Terminal className="w-3 h-3 text-primary" />
        <span className="text-xs text-terminal-foreground font-mono">
          ~/root/folders
        </span>
        <span className="text-xs text-primary cursor-blink">_</span>
      </div>

      {/* Folder tree structure */}
      <nav className="flex-1 overflow-y-auto p-2" aria-label="Pastas de projetos">
        <div className="space-y-1">
          {folders.map((folder) => (
            <div key={folder.id}>
              <button
                onClick={() => toggleFolder(folder.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
              >
                {folder.isOpen ? (
                  <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                )}
                {folder.isOpen ? (
                  <FolderOpen className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Folder className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span className="font-mono text-xs truncate">{folder.name}</span>
                <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                  {folder.logs.length}
                </span>
              </button>

              {/* Logs within the folder */}
              {folder.isOpen && (
                <div className="ml-5 border-l border-border pl-2 space-y-0.5 mt-0.5">
                  {folder.logs.map((log) => (
                    <button
                      key={log.id}
                      onClick={() => onSelectLog?.(log.id)}
                      className="w-full flex items-center gap-2 px-2 py-1 rounded text-xs hover:bg-sidebar-accent transition-colors cursor-pointer"
                    >
                      <FileText className={`w-3 h-3 shrink-0 ${getTypeColor(log.type)}`} />
                      <span className="font-mono truncate text-sidebar-foreground">
                        {log.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* User info status */}
      <div className="p-3 border-t border-border bg-terminal">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center text-xs text-primary font-bold font-mono">
            {"L"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-sidebar-foreground truncate">dev_user</p>
            <p className="text-[10px] text-muted-foreground font-mono">Explorando diretórios</p>
          </div>
        </div>
      </div>
    </aside>
  )
}