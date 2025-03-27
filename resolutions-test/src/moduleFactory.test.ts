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
  // Test with basic contract
  it('should match TypeScript implementation for basic contract', async () => {
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
  
  // Test with imports
  it('should match TypeScript implementation for contract with imports', async () => {
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
  
  // Test with remappings
  it('should match TypeScript implementation for contract with remappings', async () => {
    const fao = harness.getFileAccessObject();
    const contractPath = path.resolve(__dirname, '../../bundler-packages/resolutions/src/fixtures/withremappings/Contract.sol');
    const code = await fao.readFile(contractPath, 'utf-8');
    
    // Read remappings.json to get remappings
    const remappingsPath = path.resolve(__dirname, '../../bundler-packages/resolutions/src/fixtures/withremappings/remappings.json');
    const remappingsContent = await fao.readFile(remappingsPath, 'utf-8');
    const remappings = JSON.parse(remappingsContent);
    
    const result = await harness.compareImplementations(
      'moduleFactory - contract with remappings',
      moduleFactory,
      'moduleFactory',
      [contractPath, code, remappings, [], fao, false],
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
  
  // Test with multi-level imports
  it('should match TypeScript implementation for contract with multilevel imports', async () => {
    const fao = harness.getFileAccessObject();
    const contractPath = path.resolve(__dirname, '../../bundler-packages/resolutions/src/fixtures/multilevel/Contract.sol');
    const code = await fao.readFile(contractPath, 'utf-8');
    
    const result = await harness.compareImplementations(
      'moduleFactory - contract with multilevel imports',
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
  
  // Test with circular imports
  it('should match TypeScript implementation for contract with circular imports', async () => {
    const fao = harness.getFileAccessObject();
    const contractPath = path.resolve(__dirname, '../../bundler-packages/resolutions/src/fixtures/circular/ContractA.sol');
    const code = await fao.readFile(contractPath, 'utf-8');
    
    const result = await harness.compareImplementations(
      'moduleFactory - contract with circular imports',
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
  
  // Test with different pragma versions
  it('should match TypeScript implementation for contracts with different pragma versions', async () => {
    const fao = harness.getFileAccessObject();
    const contractPath = path.resolve(__dirname, '../../bundler-packages/resolutions/src/fixtures/differentpragma/Contract.sol');
    const code = await fao.readFile(contractPath, 'utf-8');
    
    const result = await harness.compareImplementations(
      'moduleFactory - contract with different pragma versions',
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