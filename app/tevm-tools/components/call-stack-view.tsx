"use client"

interface CallStackViewProps {
  callStack: {
    name: string
    source: string
    line: number
  }[]
}

export function CallStackView({ callStack }: CallStackViewProps) {
  return (
    <div className="p-4">
      <div className="font-medium mb-2">Call Stack</div>
      <div className="space-y-1">
        {callStack.map((frame, i) => (
          <div key={i} className="flex items-center py-2 px-2 hover:bg-highlight-line rounded cursor-pointer">
            <div className="font-mono text-accent">{frame.name}()</div>
            <div className="ml-auto text-text-secondary text-sm">
              {frame.source}:{frame.line}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
