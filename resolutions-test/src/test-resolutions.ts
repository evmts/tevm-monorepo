import { TestHarness, GoBridge } from 'ts-go-test';
import * as path from 'node:path';
import { resolveImports, moduleFactory } from '@tevm/resolutions';

const GO_CLI_PATH = path.resolve(__dirname, '../../resolutions-go/bin/cli');

async function runTests() {
  // Create the test harness
  const bridge = new GoBridge({ cliPath: GO_CLI_PATH });
  const harness = new TestHarness(bridge);
  
  // Set up the virtual file system with test fixtures
  await harness.setupFiles(async (vfs) => {
    await vfs.addDirectory(path.resolve(__dirname, '../../bundler-packages/resolutions/src/fixtures'), ['.sol']);
  });
  
  // Create FAO for TypeScript tests
  const fao = harness.getFileAccessObject();
  
  // Test resolveImports
  const basicContract = path.resolve(__dirname, '../../bundler-packages/resolutions/src/fixtures/basic/Contract.sol');
  const basicContractContent = await fao.readFile(basicContract, 'utf-8');
  
  const resolveImportsResult = await harness.compareImplementations(
    'resolveImports - basic contract',
    resolveImports,
    'resolveImports',
    [basicContract, basicContractContent, {}, [], false],
    (params, files) => ({
      absolutePath: params[0],
      code: params[1],
      remappings: params[2],
      libs: params[3],
      sync: params[4],
      files
    })
  );
  
  console.log(`Test ${resolveImportsResult.name}: ${resolveImportsResult.success ? 'PASSED' : 'FAILED'}`);
  if (!resolveImportsResult.success) {
    console.error(resolveImportsResult.details || resolveImportsResult.error);
  }
  
  // Test moduleFactory
  const moduleFactoryResult = await harness.compareImplementations(
    'moduleFactory - basic contract',
    moduleFactory,
    'moduleFactory',
    [basicContract, basicContractContent, {}, [], fao, false],
    (params, files) => ({
      absolutePath: params[0],
      rawCode: params[1],
      remappings: params[2],
      libs: params[3],
      sync: params[5],
      files
    })
  );
  
  console.log(`Test ${moduleFactoryResult.name}: ${moduleFactoryResult.success ? 'PASSED' : 'FAILED'}`);
  if (!moduleFactoryResult.success) {
    console.error(moduleFactoryResult.details || moduleFactoryResult.error);
  }
}

runTests().catch(console.error);