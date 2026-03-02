"use client"

import { useState, useEffect } from "react"

const faces = {
  default: "_", // Atualizado para o seu novo padrão
  error: ">_<",
  success: "^_^",
  thinking: "o_o",
  frustration: "T_T",
  debug: "@_@",
}

type FaceType = keyof typeof faces

export function InteractiveLogo({
  mood = "default",
  size = "md", // Ajustado para md como padrão da sidebar
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
      // tracking-tighter remove o espaço entre as letras da fonte mono
      className={`${sizeClasses[size]} font-mono font-bold tracking-tighter transition-transform duration-300 cursor-pointer select-none ${isAnimating ? "scale-105" : "scale-100"}`}
      aria-label="Logo interativo do .log()"
    >
      {/* Cores conforme seu rascunho: ponto e log em branco/foreground */}
      <span className="text-foreground">.log</span>
      
      {/* Parênteses e Face em azul/primary colados */}
      <span className="text-primary">(</span>
      <span className="text-primary inline-block transition-all duration-300 px-[1px]">
        {faces[currentFace]}
      </span>
      <span className="text-primary">)</span>
    </button>
  )
}

export function LogoBadge({ type }: { type: FaceType }) {
  return (
    <span className="text-xs font-mono inline-flex items-center tracking-tighter">
      <span className="text-muted-foreground">.log</span>
      <span className="text-primary">(</span>
      <span className="text-primary px-[1px]">{faces[type]}</span>
      <span className="text-primary">)</span>
    </span>
  )
}