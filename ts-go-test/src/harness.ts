import { GoBridge } from './bridge.js';
import { compareResults } from './comparison.js';
import { VirtualFileSystem } from './fileSystem.js';

export type TestResult = {
  name: string;
  success: boolean;
  details?: string;
  error?: Error;
};

export class TestHarness {
  private bridge: GoBridge;
  private virtualFs: VirtualFileSystem;
  
  constructor(bridge: GoBridge) {
    this.bridge = bridge;
    this.virtualFs = new VirtualFileSystem();
  }
  
  async setupFiles(setupFn: (vfs: VirtualFileSystem) => Promise<void>): Promise<void> {
    await setupFn(this.virtualFs);
  }
  
  getFileAccessObject() {
    return this.virtualFs.createFileAccessObject();
  }
  
  async compareImplementations<T extends unknown[], R>(
    testName: string,
    tsFunction: (...args: T) => Promise<R> | R,
    goFunctionName: string,
    params: T,
    transformParams?: (params: T, files: Record<string, string>) => unknown
  ): Promise<TestResult> {
    try {
      // Get all TS parameters
      const tsResult = await Promise.resolve(tsFunction(...params));
      
      // Transform parameters for Go if needed
      const goParams = transformParams ? 
        transformParams(params, this.virtualFs.getAllFiles()) : 
        { params, files: this.virtualFs.getAllFiles() };
      
      // Call Go implementation
      const goResult = await this.bridge.callFunction(goFunctionName, goParams);
      
      // Compare results
      const comparison = compareResults(tsResult, goResult);
      
      if (!comparison.equal) {
        return {
          name: testName,
          success: false,
          details: comparison.differences
        };
      }
      
      return {
        name: testName,
        success: true
      };
      
    } catch (error) {
      return {
        name: testName,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }
}