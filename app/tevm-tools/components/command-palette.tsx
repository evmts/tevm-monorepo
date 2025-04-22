"use client"

import { useEffect, useState, useRef } from "react"
import { Search, FileIcon, FunctionSquare, Settings, Play } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery("")
      setTimeout(() => {
        inputRef.current?.focus()
      }, 10)
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const commands = [
    { id: "open", icon: FileIcon, label: "Open File", shortcut: "Ctrl+O" },
    { id: "run", icon: Play, label: "Run Contract", shortcut: "F5" },
    { id: "jump", icon: FunctionSquare, label: "Jump to Function", shortcut: "Ctrl+G" },
    { id: "settings", icon: Settings, label: "Open Settings", shortcut: "Ctrl+," },
  ]

  const filteredCommands = query
    ? commands.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  return (
    <div
      className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade"
      onClick={onClose}
      role="dialog"
      aria-label="Command Palette"
    >
      <div
        className="w-full max-w-xl bg-bg-panel rounded-lg shadow-lg overflow-hidden animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-highlight-line p-4">
          <Search className="h-5 w-5 mr-2 text-text-secondary" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="border-none shadow-none focus-visible:ring-0 bg-transparent"
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.map((command) => (
            <div
              key={command.id}
              className="flex items-center px-4 py-3 hover:bg-highlight-line cursor-pointer"
              onClick={onClose}
            >
              <command.icon className="h-5 w-5 mr-3 text-accent" />
              <span>{command.label}</span>
              <span className="ml-auto text-text-secondary text-sm font-mono">{command.shortcut}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
