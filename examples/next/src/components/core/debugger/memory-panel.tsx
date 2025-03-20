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
    memoryFilter ? offset.toLowerCase().includes(memoryFilter.toLowerCase()) : true
  );

  return (
    <div className="h-full p-2 overflow-auto bg-black">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-muted-foreground">Memory (32-byte words)</div>
        <div className="relative w-32">
          <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Filter..."
            className="pl-7 h-7 text-xs"
            value={memoryFilter}
            onChange={(e) => setMemoryFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredMemory.length === 0 ? (
        <div className="text-xs text-muted-foreground p-2 italic">
          {Object.keys(memory).length === 0
            ? 'Memory is empty'
            : 'No memory addresses match filter'}
        </div>
      ) : (
        <div className="space-y-1">
          {filteredMemory.map(([offset, value]) => (
            <div key={offset} className="flex items-start gap-2">
              <span className="text-xs text-muted-foreground font-mono w-16 text-right pt-1">
                {offset}:
              </span>
              <code className="text-xs font-mono bg-gray-900 p-1 rounded flex-1 overflow-x-auto">
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