import { describe, it, expect, beforeAll } from 'vitest';
import { moduleFactory } from '@tevm/resolutions';
import { TestHarness, GoBridge } from 'ts-go-test';
import path from 'node:path';

// Setup test harness once for all tests
const bridge = new GoBridge({ cliPath: path.resolve(__dirname, '../../resolutions-go/bin/cli') });
const harness = new TestHarness(bridge);

// Setup files before tests run
beforeAll(async () => {
  await harness.setupFiles(async (vfs) => {
    await vfs.addDirectory(path.resolve(__dirname, '../../bundler-packages/resolutions/src/fixtures'), ['.sol']);
  });
});

describe('moduleFactory', () => {
  // Go comparison test
  it('Go implementation should match TypeScript implementation for basic contract', async () => {
    const fao = harness.getFileAccessObject();
    const contractPath = path.resolve(__dirname, '../../bundler-packages/resolutions/src/fixtures/basic/Contract.sol');
    const code = await fao.readFile(contractPath, 'utf-8');
    
    const result = await harness.compareImplementations(
      'moduleFactory - basic contract',
      moduleFactory,
      'moduleFactory',
      [contractPath, code, {}, [], fao, false],
      (params, files) => ({
        absolutePath: params[0],
        rawCode: params[1],
        remappings: params[2],
        libs: params[3],
        sync: params[5],
        files
      })
    );
    
    expect(result.success).toBe(true);
    if (!result.success) {
      console.error(result.details || result.error);
    }
  });
  
  it('Go implementation should match TypeScript implementation for contract with imports', async () => {
    const fao = harness.getFileAccessObject();
    const contractPath = path.resolve(__dirname, '../../bundler-packages/resolutions/src/fixtures/withlib/Contract.sol');
    const code = await fao.readFile(contractPath, 'utf-8');
    
    const result = await harness.compareImplementations(
      'moduleFactory - contract with imports',
      moduleFactory,
      'moduleFactory',
      [contractPath, code, {}, [], fao, false],
      (params, files) => ({
        absolutePath: params[0],
        rawCode: params[1],
        remappings: params[2],
        libs: params[3],
        sync: params[5],
        files
      })
    );
    
    expect(result.success).toBe(true);
    if (!result.success) {
      console.error(result.details || result.error);
    }
  });
});