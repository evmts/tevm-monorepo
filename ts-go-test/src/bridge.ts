import { spawn } from 'node:child_process';

export type GoCliOptions = {
  cliPath: string;
  timeout?: number; // ms
};

export class GoBridge {
  private cliPath: string;
  private timeout: number;

  constructor(options: GoCliOptions) {
    this.cliPath = options.cliPath;
    this.timeout = options.timeout || 30000; // 30s default timeout
  }

  async callFunction<TInput, TOutput>(
    functionName: string, 
    params: TInput
  ): Promise<TOutput> {
    return new Promise((resolve, reject) => {
      const proc = spawn(this.cliPath, [functionName]);
      
      const timer = setTimeout(() => {
        proc.kill();
        reject(new Error(`Execution timed out after ${this.timeout}ms`));
      }, this.timeout);
      
      proc.stdin.write(JSON.stringify(params));
      proc.stdin.end();
      
      let stdout = '';
      let stderr = '';
      
      proc.stdout.on('data', data => { stdout += data.toString(); });
      proc.stderr.on('data', data => { stderr += data.toString(); });
      
      proc.on('close', code => {
        clearTimeout(timer);
        
        if (code !== 0) {
          reject(new Error(`Process exited with code ${code}: ${stderr}`));
          return;
        }
        
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse output: ${e instanceof Error ? e.message : String(e)}`));
        }
      });
    });
  }
}