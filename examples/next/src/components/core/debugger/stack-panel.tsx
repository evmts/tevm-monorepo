'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StackPanelProps {
  stack: string[];
  currentOpcode: string;
  pc: number;
}

/**
 * @notice Component to display the current EVM stack and opcodes
 */
const StackPanel = ({ stack, currentOpcode, pc }: StackPanelProps) => {
  // Mock next opcodes for demonstration
  const nextOpcodes = [
    { pc: pc + 1, op: 'PUSH1', arg: '0x80' },
    { pc: pc + 3, op: 'MSTORE' },
    { pc: pc + 4, op: 'CALLVALUE' },
    { pc: pc + 5, op: 'DUP1' },
  ];

  return (
    <div className="h-full space-y-4 overflow-auto p-2">
      <Card className="bg-background border-border">
        <CardHeader className="py-2">
          <CardTitle className="text-xs font-medium">Current Opcode</CardTitle>
        </CardHeader>
        <CardContent className="py-1">
          <div className="rounded-md bg-black p-2 font-mono text-xs">
            <div className="font-semibold text-white">
              {pc}: {currentOpcode}
            </div>
            <div className="text-muted-foreground mt-2 text-xs">
              Next opcodes:
            </div>
            {nextOpcodes.map((next, i) => (
              <div key={i} className="text-muted-foreground text-xs">
                {next.pc}: {next.op} {next.arg || ''}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background border-border">
        <CardHeader className="py-2">
          <CardTitle className="text-xs font-medium">Stack</CardTitle>
        </CardHeader>
        <CardContent className="py-1">
          {stack.length === 0 ? (
            <div className="text-muted-foreground p-2 text-xs">
              Stack is empty
            </div>
          ) : (
            <div className="font-mono text-xs">
              {stack
                .slice()
                .reverse()
                .map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex justify-between border-b p-2 last:border-0',
                      index === 0 && 'bg-muted/50', // highlight top of stack
                    )}
                  >
                    <span className="text-muted-foreground">
                      {stack.length - 1 - index}:
                    </span>
                    <span className="max-w-[200px] truncate" title={item}>
                      {item}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StackPanel;
