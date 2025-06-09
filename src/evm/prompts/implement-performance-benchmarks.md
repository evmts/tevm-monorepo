# Implement Performance Benchmarks

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_performance_benchmarks` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_performance_benchmarks feat_implement_performance_benchmarks`
3. **Work in isolation**: `cd g/feat_implement_performance_benchmarks`
4. **Commit message**: `✨ feat: implement Snailtracer benchmarking vs Geth and Reth`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive performance benchmarking suite to compare Tevm EVM performance against Geth, Reth, and other EVM implementations using Snailtracer and other benchmarks.

## Implementation Requirements

### Core Functionality
1. **Snailtracer Integration**: Benchmark using Snailtracer test suite
2. **Comparative Analysis**: Compare against Geth, Reth, and other EVMs
3. **Automated Testing**: CI/CD integration for regression detection
4. **Detailed Metrics**: Gas/second, transactions/second, memory usage
5. **Report Generation**: Generate performance reports and charts

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Establish baseline metrics** - Record current performance levels
3. **Test realistic workloads** - Use real-world transaction patterns
4. **Monitor regressions** - Detect performance degradation
5. **Document methodology** - Ensure reproducible benchmarks

## References

- [Snailtracer EVM Benchmarks](https://github.com/ziyadedher/evm-bench)
- [EVM Performance Analysis](https://notes.ethereum.org/@ipsilon/evm-object-format-overview)
- [Benchmarking Best Practices](https://www.brendangregg.com/blog/2018-06-30/benchmarking-checklist.html)