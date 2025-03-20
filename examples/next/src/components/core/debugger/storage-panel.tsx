'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StoragePanelProps {
  storage: Record<string, string>;
}

/**
 * @notice Component to display EVM storage
 */
const StoragePanel = ({ storage }: StoragePanelProps) => {
  const [storageFilter, setStorageFilter] = useState('');

  const filteredStorage = Object.entries(storage).filter(([key]) =>
    storageFilter ? key.toLowerCase().includes(storageFilter.toLowerCase()) : true
  );

  return (
    <div className="h-full p-2 overflow-auto bg-black">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-muted-foreground">Contract Storage</div>
        <div className="relative w-32">
          <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Filter..."
            className="pl-7 h-7 text-xs"
            value={storageFilter}
            onChange={(e) => setStorageFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredStorage.length === 0 ? (
        <div className="text-xs text-muted-foreground p-2 italic">
          {Object.keys(storage).length === 0
            ? 'Storage is empty'
            : 'No storage keys match filter'}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredStorage.map(([key, value]) => (
            <div key={key} className="p-2 border border-gray-800 rounded-md">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Key:</span>
                <span className="font-mono truncate max-w-[200px]" title={key}>
                  {key}
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Value:</span>
                <span className="font-mono truncate max-w-[200px]" title={value}>
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoragePanel;