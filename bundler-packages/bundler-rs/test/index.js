const { bundleCodeJs } = require('../');
const { join } = require('path');
const { strictEqual } = require('assert');

async function runTest() {
  console.log('Testing bundler-rs...');
  
  try {
    const result = await bundleCodeJs(join(__dirname, 'fixtures/test.js'), {
      sourceMap: true
    });
    
    console.log('✅ Successfully bundled code');
    strictEqual(typeof result.code, 'string', 'Expected result.code to be a string');
    strictEqual(typeof result.sourceMap, 'string', 'Expected result.sourceMap to be a string');
    strictEqual(typeof result.modules, 'object', 'Expected result.modules to be an object');
    
    console.log('All tests passed!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runTest().catch(console.error);