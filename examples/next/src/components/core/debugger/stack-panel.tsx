'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    <div className="space-y-4 p-2 h-full overflow-auto">
      <Card className="bg-background border-border">
        <CardHeader className="py-2">
          <CardTitle className="text-xs font-medium">Current Opcode</CardTitle>
        </CardHeader>
        <CardContent className="py-1">
          <div className="font-mono bg-black p-2 rounded-md text-xs">
            <div className="font-semibold text-white">
              {pc}: {currentOpcode}
            </div>
            <div className="text-xs text-muted-foreground mt-2">Next opcodes:</div>
            {nextOpcodes.map((next, i) => (
              <div key={i} className="text-xs text-muted-foreground">
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
            <div className="text-xs text-muted-foreground p-2">Stack is empty</div>
          ) : (
            <div className="font-mono text-xs">
              {stack
                .slice()
                .reverse()
                .map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-2 border-b last:border-0 flex justify-between',
                      index === 0 && 'bg-muted/50' // highlight top of stack
                    )}
                  >
                    <span className="text-muted-foreground">
                      {stack.length - 1 - index}:
                    </span>
                    <span className="truncate max-w-[200px]" title={item}>
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