"use client"

interface StorageViewProps {
  storage: {
    slot: string
    key: string
    value: string
    diff: boolean
  }[]
}

export function StorageView({ storage }: StorageViewProps) {
  return (
    <div className="p-4">
      <div className="font-medium mb-2">Contract Storage</div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-text-secondary">
            <th className="py-2 px-1 w-16">Slot</th>
            <th className="py-2 px-1">Key</th>
            <th className="py-2 px-1">Value</th>
            <th className="py-2 px-1 w-12">Diff</th>
          </tr>
        </thead>
        <tbody>
          {storage.map((item, i) => (
            <tr key={i} className="border-b border-highlight-line">
              <td className="py-2 px-1 font-mono text-sm">{item.slot}</td>
              <td className="py-2 px-1">{item.key}</td>
              <td className="py-2 px-1 font-mono text-sm truncate">{item.value}</td>
              <td className="py-2 px-1">
                {item.diff && <span className="inline-block w-2 h-2 bg-accent rounded-full"></span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
