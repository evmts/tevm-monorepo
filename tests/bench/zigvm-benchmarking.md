# ZigEVM Benchmarking Methodology

This document outlines the benchmarking approach for the ZigEVM implementation, providing guidelines for benchmark development, execution, analysis, and integration into the continuous integration (CI) pipeline.

## Goals of Benchmarking

1. **Performance Measurement**: Accurately measure and track the performance of ZigEVM operations
2. **Comparison**: Compare ZigEVM with other EVM implementations (evmone, revm)
3. **Regression Detection**: Detect performance regressions during development
4. **Optimization Guidance**: Identify bottlenecks and prioritize optimization efforts
5. **WebAssembly Optimization**: Ensure optimal performance when compiled to WebAssembly

## Benchmark Categories

### 1. Basic Opcode Benchmarks

**Purpose**: Measure the performance of individual EVM opcodes

**Implementation**:
- Create benchmarks for each opcode category:
  - Stack operations (PUSH, POP, SWAP, DUP)
  - Arithmetic operations (ADD, SUB, MUL, DIV, SDIV, MOD, etc.)
  - Bitwise operations (AND, OR, XOR, NOT, etc.)
  - Comparison operations (EQ, GT, LT, etc.)
  - Environment operations (ADDRESS, BALANCE, ORIGIN, etc.)
  - Memory operations (MLOAD, MSTORE, MSTORE8, etc.)
  - Storage operations (SLOAD, SSTORE)
  - Flow control operations (JUMP, JUMPI, etc.)
  - System operations (RETURN, REVERT, etc.)

**Example**:
```typescript
// in opcodes.bench.ts
bench('ZigEVM ADD', () => {
  const bytecode = new Uint8Array([
    0x60, 0x01, // PUSH1 0x01
    0x60, 0x02, // PUSH1 0x02
    0x01,       // ADD
  ]);
  zigevm.execute(zigEvmHandle, bytecode);
});
```

### 2. Standard Contract Benchmarks

**Purpose**: Measure performance on real-world contract patterns

**Implementation**:
- Create benchmarks for standard token contracts:
  - ERC20 (transfer, approve, transferFrom)
  - ERC721 (mint, transfer, approval)
  - ERC1155 (batch transfers, approvals)
- Include popular DeFi contract patterns:
  - Swaps (Uniswap-style)
  - Lending (Aave/Compound-style)
  - Staking
- Test with different Solidity compiler optimization levels

**Example**:
```typescript
// in contracts.bench.ts
bench('ZigEVM ERC20 Transfer', () => {
  const erc20Contract = loadPrecompiledContract('ERC20');
  
  // Deploy
  const { contractAddress } = zigevm.execute(
    zigEvmHandle, 
    erc20Contract.bytecode,
    new Uint8Array(),
    DEPLOY_GAS_LIMIT
  );
  
  // Execute transfer method
  const transferData = encodeFunction('transfer(address,uint256)', [
    '0x1234567890123456789012345678901234567890',
    '1000000000000000000' // 1 token
  ]);
  
  zigevm.execute(
    zigEvmHandle,
    erc20Contract.runtimeBytecode,
    transferData,
    CALL_GAS_LIMIT,
    contractAddress
  );
});
```

### 3. Gas-Intensive Benchmarks

**Purpose**: Measure performance on operations with high gas costs

**Implementation**:
- Implement benchmarks for:
  - SSTORE (new storage slots vs. existing slots)
  - KECCAK256 with various input sizes
  - EXP with different exponent sizes
  - CALLDATACOPY and RETURNDATACOPY with large data sizes
  - Complex loops with many operations
  - Gas metering overhead measurement

**Example**:
```typescript
// in gas.bench.ts
bench('ZigEVM SSTORE (new slot)', () => {
  // Benchmark storing to new slots
  const bytecode = createSstoreToNewSlots(100); // Create 100 new slots
  zigevm.execute(zigEvmHandle, bytecode);
});

bench('ZigEVM KECCAK256 (large input)', () => {
  // Benchmark keccak256 of 10KB data
  const bytecode = createKeccak256Benchmark(10 * 1024);
  zigevm.execute(zigEvmHandle, bytecode);
});
```

### 4. Memory-Intensive Benchmarks

**Purpose**: Measure performance of memory management and operations

**Implementation**:
- Create benchmarks for:
  - Memory expansion patterns (linear vs. exponential growth)
  - Large memory allocations
  - MLOAD/MSTORE with different access patterns (sequential, random, strided)
  - Memory copy operations of various sizes
  - Mixed operations with frequent memory access

**Example**:
```typescript
// in memory.bench.ts
bench('ZigEVM Memory Expansion (linear)', () => {
  // Expand memory in 32-byte increments up to 1MB
  const bytecode = createMemoryExpansionBytecode({
    pattern: 'linear',
    initialSize: 0,
    finalSize: 1024 * 1024,
    step: 32
  });
  zigevm.execute(zigEvmHandle, bytecode);
});

bench('ZigEVM Memory Copy (large)', () => {
  // Copy 100KB of memory
  const bytecode = createMemoryCopyBytecode({
    sourceOffset: 0,
    destOffset: 100 * 1024,
    size: 100 * 1024
  });
  zigevm.execute(zigEvmHandle, bytecode);
});
```

### 5. Storage-Intensive Benchmarks

**Purpose**: Measure performance of storage operations

**Implementation**:
- Implement benchmarks for:
  - Cold vs. warm storage access patterns
  - Multiple SLOAD/SSTORE operations to measure caching effectiveness
  - Storage slot collisions and hash calculations
  - Complex storage patterns used in mappings and arrays
  - EIP-2200 net gas metering scenarios

**Example**:
```typescript
// in storage.bench.ts
bench('ZigEVM Storage (cold access)', () => {
  // Access 100 different storage slots that have never been accessed
  const bytecode = createColdStorageAccessBytecode(100);
  zigevm.execute(zigEvmHandle, bytecode);
});

bench('ZigEVM Storage (warm access)', () => {
  // First make sure slots are loaded
  zigevm.execute(zigEvmHandle, createColdStorageAccessBytecode(100));
  
  // Now access them again when they're warm
  zigevm.execute(zigEvmHandle, createWarmStorageAccessBytecode(100));
});
```

### 6. Blockchain-Specific Benchmarks

**Purpose**: Measure performance on real-world blockchain interactions

**Implementation**:
- Create benchmarks for:
  - Block processing with varying transaction counts
  - Historical mainnet block execution
  - Varying transaction types (legacy, EIP-1559, EIP-4844 blob transactions)
  - Transactions with different gas limits and utilization
  - Complex contract creation patterns

**Example**:
```typescript
// in blockchain.bench.ts
bench('ZigEVM Block Processing (100 tx)', () => {
  // Create a synthetic block with 100 transactions
  const block = createSyntheticBlock({
    transactionCount: 100,
    txTypes: ['legacy', 'eip1559'],
    averageGasUsed: 150000
  });
  
  // Execute the entire block
  executeBlock(zigevm, zigEvmHandle, block);
});
```

### 7. Comparative Benchmarks

**Purpose**: Compare ZigEVM with reference implementations (evmone, revm)

**Implementation**:
- Create benchmark harnesses that can execute the same workload on:
  - ZigEVM (WebAssembly)
  - revm (via JavaScript bindings)
  - evmone (via native bindings if available)
- Ensure identical inputs and measurements
- Create standardized test suites for all implementations

**Example**:
```typescript
// in comparative.bench.ts
async function runComparativeBenchmark(bytecode, calldata = new Uint8Array()) {
  // Run on ZigEVM
  const zigEvmStart = performance.now();
  const zigEvmResult = zigevm.execute(zigEvmHandle, bytecode, calldata);
  const zigEvmTime = performance.now() - zigEvmStart;
  
  // Run on revm
  const revmStart = performance.now();
  const revmResult = await revm.execute(bytecode, calldata);
  const revmTime = performance.now() - revmStart;
  
  // Log results
  console.log(`ZigEVM: ${zigEvmTime.toFixed(3)}ms | revm: ${revmTime.toFixed(3)}ms`);
  
  return {
    zigEvm: { time: zigEvmTime, result: zigEvmResult },
    revm: { time: revmTime, result: revmResult }
  };
}

bench('Comparative - ERC20 Transfer', async () => {
  const bytecode = loadContract('ERC20').runtimeBytecode;
  const calldata = encodeFunction('transfer(address,uint256)', [ADDRESS, AMOUNT]);
  
  return runComparativeBenchmark(bytecode, calldata);
});
```

## Benchmarking Infrastructure

### Benchmark Runner

Implement a robust benchmark runner that:
1. Loads and initializes the ZigEVM WASM module
2. Runs each benchmark in isolation
3. Collects accurate performance metrics
4. Handles warmup runs to avoid JIT compilation overhead
5. Supports parallel and sequential execution modes
6. Generates detailed reports

```typescript
// benchmark-runner.ts
export async function runBenchmarkSuite(options = {}) {
  // Initialize WASM module
  const zigevm = new ZigEvm();
  await zigevm.init(options.wasmPath);
  const handle = zigevm.create();
  
  // Find all benchmark files
  const benchmarkFiles = findBenchmarkFiles();
  
  // Run warmup (JIT warmup)
  await runWarmup(zigevm, handle);
  
  // Run all benchmarks
  const results = [];
  for (const file of benchmarkFiles) {
    const suite = await import(file);
    for (const benchmark of suite.benchmarks) {
      const result = await runBenchmark(zigevm, handle, benchmark);
      results.push(result);
    }
  }
  
  // Generate report
  generateReport(results, options.outputPath);
  
  // Cleanup
  zigevm.destroy(handle);
}
```

### Reporting

Create comprehensive benchmark reports including:
1. Raw performance metrics (execution time, operations per second)
2. Comparative metrics against baseline and other implementations
3. Trend charts showing performance over time
4. Gas usage statistics
5. Memory allocation metrics
6. Anomaly detection for significant performance changes

Example report structure:
```markdown
# ZigEVM Benchmark Report - 2025-05-08

## Summary
- Total benchmarks: 120
- Improved: 15
- Regressed: 3
- Unchanged: 102

## Highlights
- 30% improvement in SSTORE operations
- 15% improvement in memory operations
- 5% regression in complex arithmetic (flagged for investigation)

## Details

### Opcode Benchmarks
| Opcode | Time (μs) | vs. Previous | vs. revm | vs. evmone |
|--------|-----------|--------------|----------|------------|
| ADD    | 0.25      | -5%          | +10%     | -15%       |
| SUB    | 0.28      | -3%          | +8%      | -18%       |
| MUL    | 0.42      | -30%         | -5%      | -25%       |
| ...    | ...       | ...          | ...      | ...        |

### Contract Benchmarks
| Contract | Operation | Time (ms) | Gas Used | vs. Previous |
|----------|-----------|-----------|----------|--------------|
| ERC20    | Transfer  | 0.85      | 35,435   | -12%         |
| ERC20    | Approve   | 0.62      | 25,102   | -8%          |
| ...      | ...       | ...       | ...      | ...          |

## Trend Analysis
[Chart showing performance trends over last 10 commits]

## Recommendations
- Consider optimizing KECCAK256 operation - 20% slower than revm
- Memory allocation strategy improvement shows good results
- Investigate regression in complex arithmetic operations
```

## CI Integration

### Automated Benchmark Pipeline

Implement a CI pipeline for benchmarking:
1. **Trigger**: Run on significant PRs and scheduled intervals (daily/weekly)
2. **Environment**: Use consistent hardware for reliable comparisons
3. **Execution**: Run full benchmark suite with appropriate warmup
4. **Reporting**: Generate and store benchmark reports
5. **Analysis**: Detect regressions and improvements
6. **Notification**: Alert team of significant changes

```yaml
# .github/workflows/benchmark.yml
name: ZigEVM Benchmarks

on:
  push:
    branches: [ main ]
  pull_request:
    paths:
      - 'src/**'
      - 'tests/bench/**'
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sundays

jobs:
  benchmark:
    runs-on: benchmark-runner  # Dedicated runner for consistent results
    steps:
      - uses: actions/checkout@v3
      
      - name: Build WASM
        run: zig build wasm
        
      - name: Run benchmarks
        run: cd tests && node bench/run-benchmarks.js
        
      - name: Compare with baseline
        uses: ./.github/actions/benchmark-compare
        
      - name: Store results
        uses: actions/upload-artifact@v3
        with:
          name: benchmark-results
          path: tests/bench/benchmark-report.md
          
      - name: Update benchmark history
        if: github.ref == 'refs/heads/main'
        run: ./scripts/update-benchmark-history.sh
```

### Performance Regression Detection

Implement an automated system to detect performance regressions:
1. Compare current benchmark results with baseline
2. Flag significant regressions (configurable threshold, e.g., 5%)
3. Provide detailed context for debugging
4. Block PR merge if critical regressions are detected

```typescript
// benchmark-compare.ts
async function compareBenchmarks(current, baseline, threshold = 0.05) {
  const regressions = [];
  
  for (const [name, currentResult] of Object.entries(current)) {
    const baselineResult = baseline[name];
    if (!baselineResult) continue;
    
    const percentChange = (currentResult.time - baselineResult.time) / baselineResult.time;
    
    if (percentChange > threshold) {
      regressions.push({
        name,
        percentChange: percentChange * 100,
        currentTime: currentResult.time,
        baselineTime: baselineResult.time,
        significant: percentChange > threshold * 2
      });
    }
  }
  
  return regressions;
}
```

## WebAssembly-Specific Considerations

Implement special benchmarks and tooling for WebAssembly:
1. Measure WASM binary size after optimization
2. Compare performance between different browsers (Chrome, Firefox, Safari)
3. Evaluate performance with and without browser optimizations
4. Measure initialization time and memory overhead
5. Test performance in both browser and Node.js environments

```typescript
// wasm-specific.bench.ts
bench('ZigEVM WASM Initialization', async () => {
  const startTime = performance.now();
  
  // Create new instance and measure initialization time
  const zigevm = new ZigEvm();
  await zigevm.init(WASM_PATH);
  
  return performance.now() - startTime;
});

bench('ZigEVM WASM Memory Overhead', async () => {
  const memoryBefore = performance.memory.usedJSHeapSize;
  
  // Create instance
  const zigevm = new ZigEvm();
  await zigevm.init(WASM_PATH);
  
  const memoryAfter = performance.memory.usedJSHeapSize;
  return memoryAfter - memoryBefore;
});
```

## Next Steps for Implementation

1. **Establish Baseline**: Create initial benchmark suite with basic operations
2. **CI Integration**: Set up automated benchmark runs in CI
3. **Comparative Framework**: Build infrastructure to compare with revm/evmone
4. **Expand Coverage**: Implement comprehensive benchmark suites for all categories
5. **Visualization**: Create dashboard for visualizing benchmark results over time
6. **Regression Testing**: Implement automated regression detection and alerting
7. **Documentation**: Create detailed documentation on benchmark methodology

## Conclusion

A comprehensive benchmarking strategy is essential for ensuring ZigEVM achieves its performance goals. By implementing the benchmarks and infrastructure described in this document, we can:

1. Systematically improve ZigEVM performance
2. Identify optimization opportunities
3. Prevent performance regressions
4. Demonstrate ZigEVM's performance advantages
5. Ensure optimal performance in WebAssembly environments

This benchmarking approach will help make ZigEVM the fastest WASM-compatible EVM implementation available.