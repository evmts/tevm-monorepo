'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

interface MemoryPanelProps {
  memory: Record<string, string>;
}

/**
 * @notice Component to display EVM memory
 */
const MemoryPanel = ({ memory }: MemoryPanelProps) => {
  const [memoryFilter, setMemoryFilter] = useState('');

  const filteredMemory = Object.entries(memory).filter(([offset]) =>
    memoryFilter
      ? offset.toLowerCase().includes(memoryFilter.toLowerCase())
      : true,
  );

  return (
    <div className="h-full overflow-auto bg-black p-2">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-muted-foreground text-xs">
          Memory (32-byte words)
        </div>
        <div className="relative w-32">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-3 w-3" />
          <Input
            placeholder="Filter..."
            className="h-7 pl-7 text-xs"
            value={memoryFilter}
            onChange={(e) => setMemoryFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredMemory.length === 0 ? (
        <div className="text-muted-foreground p-2 text-xs italic">
          {Object.keys(memory).length === 0
            ? 'Memory is empty'
            : 'No memory addresses match filter'}
        </div>
      ) : (
        <div className="space-y-1">
          {filteredMemory.map(([offset, value]) => (
            <div key={offset} className="flex items-start gap-2">
              <span className="text-muted-foreground w-16 pt-1 text-right font-mono text-xs">
                {offset}:
              </span>
              <code className="flex-1 overflow-x-auto rounded bg-gray-900 p-1 font-mono text-xs">
                {value}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryPanel;
