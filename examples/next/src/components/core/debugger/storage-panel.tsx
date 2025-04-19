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
    storageFilter
      ? key.toLowerCase().includes(storageFilter.toLowerCase())
      : true,
  );

  return (
    <div className="h-full overflow-auto bg-black p-2">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-muted-foreground text-xs">Contract Storage</div>
        <div className="relative w-32">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-3 w-3" />
          <Input
            placeholder="Filter..."
            className="h-7 pl-7 text-xs"
            value={storageFilter}
            onChange={(e) => setStorageFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredStorage.length === 0 ? (
        <div className="text-muted-foreground p-2 text-xs italic">
          {Object.keys(storage).length === 0
            ? 'Storage is empty'
            : 'No storage keys match filter'}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredStorage.map(([key, value]) => (
            <div key={key} className="rounded-md border border-gray-800 p-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Key:</span>
                <span className="max-w-[200px] truncate font-mono" title={key}>
                  {key}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Value:</span>
                <span
                  className="max-w-[200px] truncate font-mono"
                  title={value}
                >
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
