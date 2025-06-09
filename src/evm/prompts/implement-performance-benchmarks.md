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

## Reference Implementations

### geth

<explanation>
The go-ethereum codebase demonstrates comprehensive benchmarking patterns: systematic opcode benchmarking, blockchain insertion benchmarks with various workloads, and proper Go benchmark setup with timer control. The key pattern is the opBenchmark helper function that sets up EVM context, executes operations repeatedly, and validates results.
</explanation>

**Opcode Benchmarking Framework** - `/go-ethereum/core/vm/instructions_test.go` (lines 282-309):
```go
func opBenchmark(bench *testing.B, op executionFunc, args ...string) {
	var (
		evm   = NewEVM(BlockContext{}, nil, params.TestChainConfig, Config{})
		stack = newstack()
		scope = &ScopeContext{nil, stack, nil}
	)
	// convert args
	intArgs := make([]*uint256.Int, len(args))
	for i, arg := range args {
		intArgs[i] = new(uint256.Int).SetBytes(common.Hex2Bytes(arg))
	}
	pc := uint64(0)
	bench.ResetTimer()
	for i := 0; i < bench.N; i++ {
		for _, arg := range intArgs {
			stack.push(arg)
		}
		op(&pc, evm.interpreter, scope)
		stack.pop()
	}
	bench.StopTimer()

	for i, arg := range args {
		want := new(uint256.Int).SetBytes(common.Hex2Bytes(arg))
		if have := intArgs[i]; !want.Eq(have) {
			bench.Fatalf("input #%d mutated, have %x want %x", i, have, want)
		}
	}
}
```

**Specific Opcode Benchmarks** - `/go-ethereum/core/vm/instructions_test.go` (lines 312-323):
```go
func BenchmarkOpAdd64(b *testing.B) {
	x := "ffffffff"
	y := "fd37f3e2"
	opBenchmark(b, opAdd, x, y)
}

func BenchmarkOpAdd128(b *testing.B) {
	x := "ffffffffffffffff"
	y := "fd37f3e2bba2c4dd"
	opBenchmark(b, opAdd, x, y)
}
```

**Blockchain Benchmarks** - `/go-ethereum/core/bench_test.go` (lines 36-71):
```go
func BenchmarkInsertChain_empty_memdb(b *testing.B) {
	benchInsertChain(b, false, nil)
}
func BenchmarkInsertChain_valueTx_memdb(b *testing.B) {
	benchInsertChain(b, false, genValueTx(0))
}
func BenchmarkInsertChain_valueTx_100kB_memdb(b *testing.B) {
	benchInsertChain(b, false, genValueTx(100*1024))
}
func BenchmarkInsertChain_ring200_memdb(b *testing.B) {
	benchInsertChain(b, false, genTxRing(200))
}
func BenchmarkInsertChain_ring1000_memdb(b *testing.B) {
	benchInsertChain(b, false, genTxRing(1000))
}
```

## References

- [Snailtracer EVM Benchmarks](https://github.com/ziyadedher/evm-bench)
- [EVM Performance Analysis](https://notes.ethereum.org/@ipsilon/evm-object-format-overview)
- [Benchmarking Best Practices](https://www.brendangregg.com/blog/2018-06-30/benchmarking-checklist.html)