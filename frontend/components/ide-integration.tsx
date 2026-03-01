"use client"

import { Code, Download, ArrowRight, Terminal } from "lucide-react"

export function IDEIntegration() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-mono font-semibold text-card-foreground">
          <span className="text-primary">$</span> integracao-ide
        </h2>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          Envie logs direto do VS Code
        </p>
      </div>

      {/* VS Code Extension card */}
      <div className="p-4 space-y-3">
        <div className="bg-terminal border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Code className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-mono font-semibold text-foreground">
                .log() for VS Code
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-1 leading-relaxed">
                Selecione um trecho de codigo ou uma mensagem de erro e envie
                diretamente para o .log() com um atalho de teclado.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-3 space-y-2">
            {[
              "Envie snippets com Ctrl+Shift+L",
              "Capture erros do terminal automaticamente",
              "Tags automaticas baseadas no projeto",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-primary shrink-0" />
                <span className="text-xs font-mono text-muted-foreground">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Install command */}
          <div className="mt-4 bg-secondary/30 border border-border rounded p-2.5 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-primary shrink-0" />
            <code className="text-xs font-mono text-terminal-foreground flex-1">
              ext install dotlog.vscode-extension
            </code>
          </div>

          <button className="mt-3 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded text-xs font-mono font-semibold hover:opacity-90 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Instalar Extensao
          </button>
        </div>
      </div>
    </div>
  )
}
