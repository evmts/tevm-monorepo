import { useState, useEffect, useReducer } from 'react';
import { spawn } from 'child_process';

export const useExec = (command: string, cwd: string, args = [] as string[], onSuccess: () => void) => {
  const [isStarted, mutate] = useReducer(() => true, false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [exitCode, setExitCode] = useState<number>();
  useEffect(() => {
    if (!isStarted) {
      return;
    }
    const child = spawn(command, args, { cwd });
    child.stdout.on('data', (data) => {
      setOutput((prev) => prev + data.toString());
    });
    child.stderr.on('error', (data) => {
      setError((prev) => prev + data.toString());
    });
    child.stderr.on('data', (data) => {
      setError((prev) => prev + data.toString());
    });
    child.on('close', (code) => {
      setExitCode(code ?? 0);
      if (code === 0) {
        onSuccess();
      }
    });
  }, [command, ...args, isStarted]);

  return {
    data: output,
    stdout: output,
    stderr: error,
    error,
    exitCode,
    mutate,
    isRunning: isStarted,
    isSuccess: exitCode === 0,
    isError: exitCode !== undefined && exitCode !== 0
  };
};

