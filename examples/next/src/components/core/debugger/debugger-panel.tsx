'use client';

import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  StepForward,
  SkipForward,
  CornerUpLeft,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import SourceCodeViewer from './source-code-viewer';
import StackPanel from './stack-panel';
import MemoryPanel from './memory-panel';
import StoragePanel from './storage-panel';
import LogsPanel from './logs-panel';
import useDebugger from '@/lib/hooks/use-debugger';

interface DebuggerPanelProps {
  contractAddress: string;
  sourceCode?: string;
  isDebugging: boolean;
  onToggleDebugging: () => void;
}

/**
 * @notice The main debugger panel containing source code viewer and debug controls
 */
const DebuggerPanel = ({
  contractAddress,
  sourceCode = '',
  isDebugging,
  onToggleDebugging,
}: DebuggerPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Use our debugger hook
  const {
    currentLine,
    breakpoints,
    toggleBreakpoint,
    stack,
    memory,
    storage,
    logs,
    pc,
    opcode,
    gasLeft,
    isRunning,
    isPaused,
    step,
    continue: continueExecution,
    pause,
    reset
  } = useDebugger(sourceCode);

  // Mock source code if none provided
  const displaySourceCode = sourceCode || `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private _value;

    // Event declaration
    event ValueChanged(address indexed author, uint256 newValue);

    // Store a new value
    function store(uint256 newValue) public {
        _value = newValue;

        // Emit the event
        emit ValueChanged(msg.sender, newValue);
    }

    // Retrieve the stored value
    function retrieve() public view returns (uint256) {
        return _value;
    }
}`;

  return (
    <Card className="border border-border bg-background overflow-hidden">
      <div
        className="flex items-center justify-between p-3 border-b border-border cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Solidity Debugger</h3>
          <Badge variant="outline" className="text-xs">
            {contractAddress.substring(0, 10)}...{contractAddress.substring(contractAddress.length - 8)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30">
            <Button
              variant="ghost"
              size="icon"
              onClick={isPaused ? continueExecution : pause}
              title={isPaused ? 'Continue' : 'Pause'}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={step}
              title="Step Into"
            >
              <StepForward className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={step} // In a full implementation, this would be step over
              title="Step Over"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={step} // In a full implementation, this would be step out
              title="Step Out"
            >
              <CornerUpLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={reset}
              title="Reset Debugger"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 ml-4 text-xs">
              <span className="text-muted-foreground">PC:</span>
              <span className="font-mono">{pc}</span>
              <span className="text-muted-foreground ml-2">Opcode:</span>
              <span className="font-mono">{opcode}</span>
              <span className="text-muted-foreground ml-2">Gas left:</span>
              <span className="font-mono">{gasLeft}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-border">
            <div className="border-r border-border h-[400px] overflow-auto">
              <SourceCodeViewer
                sourceCode={displaySourceCode}
                currentLine={currentLine}
                breakpoints={Array.from(breakpoints)}
                onToggleBreakpoint={toggleBreakpoint}
              />
            </div>
            <div className="h-[400px]">
              <Tabs defaultValue="stack" className="h-full">
                <TabsList className="w-full grid grid-cols-4 bg-muted/30 rounded-none">
                  <TabsTrigger value="stack">Stack</TabsTrigger>
                  <TabsTrigger value="memory">Memory</TabsTrigger>
                  <TabsTrigger value="storage">Storage</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="stack" className="h-[calc(100%-40px)] m-0">
                  <StackPanel stack={stack} currentOpcode={opcode} pc={pc} />
                </TabsContent>
                <TabsContent value="memory" className="h-[calc(100%-40px)] m-0">
                  <MemoryPanel memory={memory} />
                </TabsContent>
                <TabsContent value="storage" className="h-[calc(100%-40px)] m-0">
                  <StoragePanel storage={storage} />
                </TabsContent>
                <TabsContent value="logs" className="h-[calc(100%-40px)] m-0">
                  <LogsPanel logs={logs} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default DebuggerPanel;