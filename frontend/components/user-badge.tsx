
"use client"

import { useUser } from "@/components/user-context"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UserBadgeProps {
  badgeLabel?: string;
  variant?: string;
}

export function UserBadge({ badgeLabel, variant }: UserBadgeProps) {
  const { user, currentBadgeVariant } = useUser()

  const activeLabel = badgeLabel || user.activeBadge?.label;
  const activeVariant = variant || currentBadgeVariant || "pixel";

  if (!activeLabel) return null

  const iconName = activeLabel.toLowerCase().replace(/\s+/g, "_");
  const imagePath = `/badges/${iconName}-${activeVariant}.svg`;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div 
            className="relative z-10 flex items-center cursor-help transition-all duration-200 hover:scale-125 active:scale-95"
            style={{ 
              maskImage: `url(${imagePath})`,
              WebkitMaskImage: `url(${imagePath})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              backgroundColor: 'white', // ✅ Agora os ícones serão sempre brancos
              width: '1rem',
              height: '1rem',
            }}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-[10px] font-mono shadow-md border-primary/20">
          {activeLabel}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}