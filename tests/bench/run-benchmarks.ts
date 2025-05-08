#!/usr/bin/env node
/**
 * Script to run benchmarks and generate reports
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuration
const benchResultsPath = path.join(__dirname, 'benchmark-results.json');
const benchOutputPath = path.join(__dirname, 'benchmark-report.md');

// Run benchmarks
console.log('Running benchmarks...');
try {
  execSync('pnpm bench:run', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to run benchmarks:', error);
  process.exit(1);
}

// Check if results file exists
if (!fs.existsSync(benchResultsPath)) {
  console.error(`Benchmark results file not found: ${benchResultsPath}`);
  process.exit(1);
}

// Read and parse benchmark results
const results = JSON.parse(fs.readFileSync(benchResultsPath, 'utf8'));

// Generate report
console.log('Generating benchmark report...');

let report = `# ZigEVM Benchmark Report

Generated on: ${new Date().toISOString()}

## Performance Comparison with revm

This report compares the performance of ZigEVM with revm across various operations.

`;

// Process results by group
for (const [group, tasks] of Object.entries(results)) {
  report += `### ${group}\n\n`;
  report += '| Operation | ZigEVM (ops/sec) | revm (ops/sec) | Ratio (ZigEVM/revm) |\n';
  report += '|-----------|------------------|----------------|---------------------|\n';
  
  // Group tasks by operation
  const operations = {};
  for (const task of Object.values(tasks)) {
    // Skip if not a valid benchmark task
    if (!task.name) continue;
    
    // Extract operation name and implementation
    const match = task.name.match(/^(ZigEVM|revm) (.+)$/);
    if (!match) continue;
    
    const [_, implementation, operation] = match;
    if (!operations[operation]) {
      operations[operation] = {};
    }
    
    operations[operation][implementation] = task.hz;
  }
  
  // Add each operation to the table
  for (const [operation, impls] of Object.entries(operations)) {
    const zigEvmHz = impls['ZigEVM'] || 0;
    const revmHz = impls['revm'] || 0;
    const ratio = revmHz > 0 ? zigEvmHz / revmHz : 'N/A';
    
    report += `| ${operation} | ${zigEvmHz.toFixed(2)} | ${revmHz.toFixed(2)} | ${typeof ratio === 'number' ? ratio.toFixed(2) : ratio} |\n`;
  }
  
  report += '\n';
}

// Add a chart placeholder
report += `
## Performance Chart

\`\`\`
This is a placeholder for a performance chart.
In a real implementation, we would generate a chart here
using the benchmark data.
\`\`\`

## Analysis

- ZigEVM is designed to be WASM-friendly, which affects performance characteristics
- Performance is measured for core EVM operations to identify bottlenecks
- The goal is to make ZigEVM the fastest WASM-compatible EVM implementation

`;

// Write report to file
fs.writeFileSync(benchOutputPath, report);

console.log(`Benchmark report generated: ${benchOutputPath}`);