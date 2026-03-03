"use client"

import { useState } from "react"
import { Search, Menu } from "lucide-react"

export type FilterType = "todos" | "error" | "warning" | "frustration" | "success"

export function FeedHeader({
  onFilterChange,
  onToggleSidebar,
}: {
  onFilterChange?: (filter: FilterType) => void
  onToggleSidebar?: () => void
}) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos")
  const [searchOpen, setSearchOpen] = useState(false)

const filters: { key: FilterType; label: string; color: string }[] = [
  { key: "todos", label: "Todos", color: "text-foreground" },
  { key: "frustration", label: "T_T Frustracoes", color: "text-frustration" }, // Usa --frustration
  { key: "error", label: ">_< Erros", color: "text-destructive" },
  { key: "warning", label: "o_o Avisos", color: "text-warning" }, // Usa seu novo tom
  { key: "success", label: "^_^ Resolvidos", color: "text-success" },
]

  const handleFilter = (filter: FilterType) => {
    setActiveFilter(filter)
    onFilterChange?.(filter)
  }

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded hover:bg-secondary transition-colors cursor-pointer"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-4 h-4 text-foreground" />
        </button>

        <div className="flex-1 flex items-center gap-3">
          <h1 className="text-sm font-mono font-semibold text-foreground">
            <span className="text-primary">~/</span>feed
          </h1>

          {/* Filter tabs */}
          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Filtros de logs">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilter(f.key)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeFilter === f.key
                    ? `bg-secondary ${f.color} font-semibold`
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          {searchOpen && (
            <input
              type="search"
              placeholder="Buscar logs..."
              className="bg-input border border-border rounded px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-48"
              autoFocus
            />
          )}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1.5 rounded hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Buscar"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Mobile filters */}
      <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilter(f.key)}
            className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === f.key
                ? `bg-secondary ${f.color} font-semibold`
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </header>
  )
}
