"use client"

import { useState, useEffect } from "react"

const faces = {
  default: "*_*",
  error: ">_<",
  success: "^_^",
  thinking: "o_o",
  frustration: "T_T",
  debug: "@_@",
}

type FaceType = keyof typeof faces

export function InteractiveLogo({
  mood = "default",
  size = "lg",
}: {
  mood?: FaceType
  size?: "sm" | "md" | "lg"
}) {
  const [currentFace, setCurrentFace] = useState<FaceType>(mood)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setCurrentFace(mood)
  }, [mood])

  const handleClick = () => {
    setIsAnimating(true)
    const faceKeys = Object.keys(faces) as FaceType[]
    const currentIndex = faceKeys.indexOf(currentFace)
    const nextIndex = (currentIndex + 1) % faceKeys.length
    setCurrentFace(faceKeys[nextIndex])
    setTimeout(() => setIsAnimating(false), 300)
  }

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} font-mono font-bold tracking-tight transition-transform duration-300 cursor-pointer select-none ${isAnimating ? "scale-110" : "scale-100"}`}
      aria-label="Logo interativo do .log()"
    >
      <span className="text-foreground">.</span>
      <span className="text-foreground">log</span>
      <span className="text-primary">(</span>
      <span className="text-primary inline-block min-w-[3ch] text-center transition-all duration-300">
        {" "}{faces[currentFace]}{" "}
      </span>
      <span className="text-primary">)</span>
    </button>
  )
}

export function LogoBadge({ type }: { type: FaceType }) {
  return (
    <span className="text-xs font-mono">
      <span className="text-muted-foreground">.</span>
      <span className="text-muted-foreground">log</span>
      <span className="text-primary">(</span>
      <span className="text-primary">{faces[type]}</span>
      <span className="text-primary">)</span>
    </span>
  )
}
