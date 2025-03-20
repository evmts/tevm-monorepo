'use client';

import { useState } from 'react';
import { Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DebuggerPanel from './debugger-panel';

interface DebuggerToggleProps {
  contractAddress?: string;
  sourceCode?: string;
}

/**
 * @notice Component to toggle the debugger interface
 * @dev Placed in the contract interaction area to let users debug contract operations
 */
const DebuggerToggle = ({
  contractAddress = '',
  sourceCode = '',
}: DebuggerToggleProps) => {
  const [isDebugging, setIsDebugging] = useState(false);

  return (
    <div className="space-y-4">
      {contractAddress && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsDebugging(!isDebugging)}
          >
            <Bug className="h-4 w-4" />
            {isDebugging ? 'Hide Debugger' : 'Debug Contract'}
          </Button>
        </div>
      )}

      {isDebugging && contractAddress && (
        <DebuggerPanel
          contractAddress={contractAddress}
          sourceCode={sourceCode}
          isDebugging={isDebugging}
          onToggleDebugging={() => setIsDebugging(false)}
        />
      )}
    </div>
  );
};

export default DebuggerToggle;