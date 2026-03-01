"use client"

import { useState, useMemo } from "react"

type DayData = { date: string; level: number; hours: number }

// Hardcoded contribution data to avoid any SSR/client mismatch
const CONTRIBUTION_DATA: DayData[][] = (() => {
  // Pre-seeded deterministic data: 20 weeks x 7 days
  const raw = [
    [4,0,6,3,0,5,2],[7,1,4,0,3,6,1],[0,2,5,7,0,3,4],
    [6,0,1,5,3,0,7],[2,4,0,6,1,3,0],[5,7,2,0,4,1,6],
    [0,3,5,2,7,0,1],[4,6,0,3,1,5,2],[7,0,4,6,0,2,3],
    [1,5,0,7,3,4,0],[6,2,1,0,5,3,7],[0,4,6,2,0,1,5],
    [3,7,0,4,6,0,2],[1,5,3,0,7,2,4],[0,6,1,5,0,3,7],
    [4,0,2,6,3,1,0],[5,7,0,4,2,6,1],[0,3,5,1,7,0,4],
    [6,2,0,3,5,7,1],[0,4,6,0,2,5,3],
  ]
  const baseDate = new Date("2026-02-28T00:00:00Z")
  return raw.map((weekHours, wi) => {
    return weekHours.map((hours, di) => {
      const date = new Date(baseDate)
      date.setDate(date.getDate() - ((19 - wi) * 7 + (6 - di)))
      const level = hours === 0 ? 0 : hours <= 1 ? 1 : hours <= 3 ? 2 : hours <= 5 ? 3 : 4
      return {
        date: date.toISOString().split("T")[0],
        level,
        hours,
      }
    })
  })
})()

const skills = [
  { name: "React", hours: 42, color: "bg-chart-1" },
  { name: "Python", hours: 28, color: "bg-chart-2" },
  { name: "DevOps", hours: 18, color: "bg-chart-3" },
  { name: "Linux", hours: 15, color: "bg-chart-4" },
  { name: "SQL", hours: 12, color: "bg-chart-5" },
]

const totalHours = skills.reduce((sum, s) => sum + s.hours, 0)

function getCellColor(level: number) {
  switch (level) {
    case 0:
      return "bg-secondary"
    case 1:
      return "bg-primary/20"
    case 2:
      return "bg-primary/40"
    case 3:
      return "bg-primary/70"
    case 4:
      return "bg-primary"
    default:
      return "bg-secondary"
  }
}

export function EffortGraph() {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string
    hours: number
  } | null>(null)

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-mono font-semibold text-card-foreground">
          <span className="text-primary">$</span> grafico-de-esforco
        </h2>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          {totalHours}h de estudo nas ultimas 20 semanas
        </p>
      </div>

      {/* Contribution Grid */}
      <div className="p-4">
        <div className="flex gap-[3px] overflow-x-auto pb-2">
          {CONTRIBUTION_DATA.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-[11px] h-[11px] rounded-sm ${getCellColor(day.level)} transition-colors cursor-pointer hover:ring-1 hover:ring-primary/50`}
                  onMouseEnter={() =>
                    setHoveredCell({ date: day.date, hours: day.hours })
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                  title={`${day.date}: ${day.hours}h`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className="mt-2 text-[10px] font-mono text-muted-foreground">
            {hoveredCell.date} — {hoveredCell.hours}h de estudo
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-muted-foreground">
          <span>Menos</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-[11px] h-[11px] rounded-sm ${getCellColor(level)}`}
            />
          ))}
          <span>Mais</span>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="px-4 pb-4">
        <h3 className="text-xs font-mono text-muted-foreground mb-2">
          Habilidades por tempo
        </h3>
        <div className="space-y-2">
          {skills.map((skill) => (
            <div key={skill.name} className="flex items-center gap-2">
              <span className="text-xs font-mono text-card-foreground w-16 shrink-0">
                {skill.name}
              </span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full ${skill.color} transition-all duration-500`}
                  style={{ width: `${(skill.hours / totalHours) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
                {skill.hours}h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
