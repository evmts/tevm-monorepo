'use client';

import { useCallback, useEffect, useState } from 'react';

export interface LogEntry {
  pc: number;
  message: string;
  timestamp: string;
  type: string;
}

export interface CallStackEntry {
  address: string;
  function: string;
}

// Mock execution step for our simulated debugger
interface ExecutionStep {
  pc: number;
  line: number;
  opcode: string;
  stack: string[];
  memory: Record<string, string>;
  gas: number;
}

/**
 * @notice A hook to handle the debugging functionality
 * @dev This is a mock implementation that will be replaced with real TEVM integration
 */
const useDebugger = (sourceCode: string) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set());
  const [stack, setStack] = useState<string[]>([]);
  const [memory, setMemory] = useState<Record<string, string>>({});
  const [storage, setStorage] = useState<Record<string, string>>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pc, setPc] = useState(0);
  const [opcode, setOpcode] = useState('');
  const [gasLeft, setGasLeft] = useState(1000000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [callStack, setCallStack] = useState<CallStackEntry[]>([]);

  // Mock execution steps for demonstration
  const executionSteps: ExecutionStep[] = [
    { pc: 0, line: 3, opcode: 'PUSH1', stack: [], memory: {}, gas: 1000000 },
    {
      pc: 2,
      line: 5,
      opcode: 'MSTORE',
      stack: ['0x80', '0x40'],
      memory: { '0x40': '0x80' },
      gas: 999997,
    },
    {
      pc: 3,
      line: 7,
      opcode: 'CALLVALUE',
      stack: [],
      memory: { '0x40': '0x80' },
      gas: 999994,
    },
    {
      pc: 4,
      line: 7,
      opcode: 'DUP1',
      stack: ['0x0'],
      memory: { '0x40': '0x80' },
      gas: 999992,
    },
    {
      pc: 5,
      line: 8,
      opcode: 'ISZERO',
      stack: ['0x0', '0x0'],
      memory: { '0x40': '0x80' },
      gas: 999989,
    },
    {
      pc: 6,
      line: 8,
      opcode: 'PUSH2',
      stack: ['0x1'],
      memory: { '0x40': '0x80' },
      gas: 999986,
    },
    {
      pc: 9,
      line: 8,
      opcode: 'JUMPI',
      stack: ['0x1', '0x010c'],
      memory: { '0x40': '0x80' },
      gas: 999983,
    },
    {
      pc: 10,
      line: 9,
      opcode: 'PUSH1',
      stack: [],
      memory: { '0x40': '0x80' },
      gas: 999980,
    },
    {
      pc: 12,
      line: 9,
      opcode: 'DUP1',
      stack: ['0x0'],
      memory: { '0x40': '0x80' },
      gas: 999977,
    },
    {
      pc: 13,
      line: 9,
      opcode: 'REVERT',
      stack: ['0x0', '0x0'],
      memory: { '0x40': '0x80' },
      gas: 999974,
    },
    {
      pc: 268,
      line: 12,
      opcode: 'JUMPDEST',
      stack: [],
      memory: { '0x40': '0x80' },
      gas: 999971,
    },
    {
      pc: 269,
      line: 13,
      opcode: 'PUSH1',
      stack: [],
      memory: { '0x40': '0x80' },
      gas: 999968,
    },
    {
      pc: 271,
      line: 13,
      opcode: 'PUSH1',
      stack: ['0x0'],
      memory: { '0x40': '0x80' },
      gas: 999965,
    },
    {
      pc: 273,
      line: 13,
      opcode: 'MLOAD',
      stack: ['0x0', '0x40'],
      memory: { '0x40': '0x80' },
      gas: 999962,
    },
    {
      pc: 274,
      line: 14,
      opcode: 'SWAP1',
      stack: ['0x0', '0x80'],
      memory: { '0x40': '0x80' },
      gas: 999959,
    },
    {
      pc: 275,
      line: 14,
      opcode: 'POP',
      stack: ['0x80', '0x0'],
      memory: { '0x40': '0x80' },
      gas: 999956,
    },
    {
      pc: 276,
      line: 15,
      opcode: 'PUSH1',
      stack: ['0x80'],
      memory: { '0x40': '0x80' },
      gas: 999953,
    },
    {
      pc: 278,
      line: 15,
      opcode: 'MSTORE',
      stack: ['0x80', '0x40'],
      memory: { '0x40': '0x80' },
      gas: 999950,
    },
    {
      pc: 279,
      line: 17,
      opcode: 'CALLVALUE',
      stack: [],
      memory: { '0x40': '0x80' },
      gas: 999947,
    },
    {
      pc: 280,
      line: 17,
      opcode: 'DUP1',
      stack: ['0x0'],
      memory: { '0x40': '0x80' },
      gas: 999944,
    },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  // Toggle breakpoint
  const toggleBreakpoint = useCallback((line: number) => {
    setBreakpoints((prev) => {
      const newBreakpoints = new Set(prev);
      if (newBreakpoints.has(line)) {
        newBreakpoints.delete(line);
      } else {
        newBreakpoints.add(line);
      }
      return newBreakpoints;
    });
  }, []);

  // Step function
  const step = useCallback(() => {
    if (currentStepIndex < executionSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextStep = executionSteps[nextIndex];

      setCurrentStepIndex(nextIndex);
      setCurrentLine(nextStep.line);
      setPc(nextStep.pc);
      setOpcode(nextStep.opcode);
      setStack(nextStep.stack);
      setMemory(nextStep.memory);
      setGasLeft(nextStep.gas);

      // Add a log entry for demonstration
      if (nextStep.opcode === 'REVERT') {
        setLogs((prev) => [
          ...prev,
          {
            pc: nextStep.pc,
            message: 'Execution reverted: insufficient funds',
            type: 'error',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else if (nextIndex % 5 === 0) {
        setLogs((prev) => [
          ...prev,
          {
            pc: nextStep.pc,
            message: `Executing ${nextStep.opcode} at line ${nextStep.line}`,
            type: 'info',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }

      // Update call stack for demonstration
      if (nextStep.opcode === 'CALL' || nextStep.opcode === 'DELEGATECALL') {
        setCallStack((prev) => [
          ...prev,
          {
            address: '0x1234...5678',
            function: 'transfer(address,uint256)',
          },
        ]);
      } else if (nextStep.opcode === 'RETURN' && callStack.length > 0) {
        setCallStack((prev) => prev.slice(0, -1));
      }

      // Update storage for demonstration
      if (nextIndex % 7 === 0) {
        setStorage((prev) => ({
          ...prev,
          [`0x${Math.floor(Math.random() * 1000)
            .toString(16)
            .padStart(4, '0')}`]: `0x${Math.floor(Math.random() * 1000000)
            .toString(16)
            .padStart(8, '0')}`,
        }));
      }

      setIsPaused(true);
      setIsRunning(true);
    } else {
      // End of execution
      setIsRunning(false);
      setIsPaused(false);

      setLogs((prev) => [
        ...prev,
        {
          pc: pc,
          message: 'Execution completed successfully',
          type: 'info',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  }, [currentStepIndex, executionSteps, pc, callStack.length]);

  // Continue execution
  const continueExecution = useCallback(() => {
    setIsPaused(false);
    setIsRunning(true);

    // Simulate continuous execution until breakpoint or end
    const runUntilBreakpoint = () => {
      if (currentStepIndex < executionSteps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        const nextStep = executionSteps[nextIndex];

        // Check if we hit a breakpoint
        if (breakpoints.has(nextStep.line)) {
          step();
          return;
        }

        setCurrentStepIndex(nextIndex);
        setCurrentLine(nextStep.line);
        setPc(nextStep.pc);
        setOpcode(nextStep.opcode);
        setStack(nextStep.stack);
        setMemory(nextStep.memory);
        setGasLeft(nextStep.gas);

        // Continue execution with a small delay to simulate processing
        setTimeout(runUntilBreakpoint, 100);
      } else {
        // End of execution
        setIsRunning(false);
        setIsPaused(false);

        setLogs((prev) => [
          ...prev,
          {
            pc: pc,
            message: 'Execution completed successfully',
            type: 'info',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    };

    runUntilBreakpoint();
  }, [currentStepIndex, executionSteps, breakpoints, step, pc]);

  // Pause execution
  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  // Reset debugger
  const reset = useCallback(() => {
    setCurrentStepIndex(-1);
    setCurrentLine(0);
    setPc(0);
    setOpcode('');
    setStack([]);
    setMemory({});
    setStorage({});
    setGasLeft(1000000);
    setIsRunning(false);
    setIsPaused(false);
    setCallStack([]);
    setLogs([]);
  }, []);

  // Initialize with first step
  useEffect(() => {
    if (currentStepIndex === -1 && executionSteps.length > 0) {
      step();
    }
  }, [currentStepIndex, executionSteps.length, step]);

  return {
    sourceCode,
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
    reset,
    callStack,
  };
};

export default useDebugger;
