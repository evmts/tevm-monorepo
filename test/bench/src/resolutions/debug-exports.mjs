import * as resolutionsRs from '@tevm/resolutions-rs';

console.log('Available exports:', Object.keys(resolutionsRs));

// Test calling the exports
console.log('\nTesting exports:');
for (const key of Object.keys(resolutionsRs)) {
  console.log(`- ${key} type:`, typeof resolutionsRs[key]);
}

// Test simple function call
try {
  console.log('\nTesting resolveImports function:');
  const tempFile = '/tmp/test.sol';
  const code = `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract Test {}\n`;
  
  const result = await resolutionsRs.resolveImports(tempFile, code, {}, []);
  console.log('Result:', result);
} catch (e) {
  console.error('Error testing resolveImports:', e);
}