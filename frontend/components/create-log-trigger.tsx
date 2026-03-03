// components/create-log-trigger.tsx
import { UserBadge } from "./user-badge"
import { useUser } from "@/components/user-context"
import { Plus } from "lucide-react"

export function CreateLogTrigger() {
  const { user } = useUser()

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6 transition-all hover:border-primary/30 group cursor-pointer">
      <div className="flex items-center gap-3">
        {/* Avatar do Usuário Logado */}
        <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-sm text-primary font-bold font-mono shrink-0 border border-border">
          {user.avatar}
        </div>

        {/* O "Botão" disfarçado de Input */}
        <div className="flex-1 flex items-center justify-between bg-secondary/50 rounded-md px-4 py-2.5 border border-transparent group-hover:border-primary/20 transition-colors">
          <span className="text-sm font-mono text-muted-foreground">
            O que aconteceu no código hoje?
          </span>
          <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
      
      {/* Rodapé sutil com o badge atual do usuário */}
      <div className="flex items-center gap-2 mt-3 ml-13 border-t border-border/50 pt-2">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Postando como
        </span>
        <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-0.5 rounded border border-border/50">
          <span className="text-[10px] font-mono font-bold text-foreground">{user.name}</span>
          <UserBadge />
        </div>
      </div>
    </div>
  )
}