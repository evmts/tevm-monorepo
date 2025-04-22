"use client"

interface VariablesViewProps {
  variables: {
    name: string
    value: string
    type: string
  }[]
}

export function VariablesView({ variables }: VariablesViewProps) {
  return (
    <div className="p-4">
      <div className="font-medium mb-2">Local Variables</div>
      <div className="space-y-1">
        {variables.map((variable, i) => (
          <div key={i} className="flex items-start py-1 border-b border-highlight-line">
            <div className="w-1/3 text-text-secondary">{variable.name}</div>
            <div className="w-1/3 font-mono">{variable.value}</div>
            <div className="w-1/3 text-text-secondary text-sm">{variable.type}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
