# Implement Performance Benchmarks

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_performance_benchmarks` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_performance_benchmarks feat_implement_performance_benchmarks`
3. **Work in isolation**: `cd g/feat_implement_performance_benchmarks`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a comprehensive performance benchmarking framework to validate EVM performance against industry standards (Geth, Revm, Evmone), detect performance regressions, track optimization progress, and guide future performance improvements. This includes micro-benchmarks for individual components, macro-benchmarks for complete execution scenarios, and statistical analysis tools.

## ELI5

Think of this like creating a sophisticated stopwatch and speedometer for the EVM engine. Just like a car manufacturer tests their engines against competitors and measures acceleration, fuel efficiency, and top speed, this framework measures how fast our EVM executes different operations and compares it to other implementations like Geth and Revm. It catches when changes accidentally make things slower (like a mechanic noticing reduced horsepower) and helps identify which parts need tuning for better performance.

## Performance Benchmark Specifications

### Core Benchmark Framework

#### 1. Benchmark Manager
```zig
pub const BenchmarkManager = struct {
    allocator: std.mem.Allocator,
    config: BenchmarkConfig,
    benchmark_registry: BenchmarkRegistry,
    result_aggregator: ResultAggregator,
    statistical_analyzer: StatisticalAnalyzer,
    regression_detector: RegressionDetector,
    comparison_engine: ComparisonEngine,
    
    pub const BenchmarkConfig = struct {
        enable_benchmarking: bool,
        enable_statistical_analysis: bool,
        enable_regression_detection: bool,
        enable_reference_comparison: bool,
        benchmark_duration_ms: u64,
        warmup_iterations: u32,
        measurement_iterations: u32,
        statistical_significance: f64,
        regression_threshold: f64,
        output_format: OutputFormat,
        
        pub const OutputFormat = enum {
            JSON,
            CSV,
            Human,
            CI,
        };
        
        pub fn production() BenchmarkConfig {
            return BenchmarkConfig{
                .enable_benchmarking = true,
                .enable_statistical_analysis = true,
                .enable_regression_detection = true,
                .enable_reference_comparison = true,
                .benchmark_duration_ms = 10000, // 10 seconds
                .warmup_iterations = 100,
                .measurement_iterations = 1000,
                .statistical_significance = 0.05, // 95% confidence
                .regression_threshold = 0.05, // 5% regression threshold
                .output_format = .JSON,
            };
        }
        
        pub fn development() BenchmarkConfig {
            return BenchmarkConfig{
                .enable_benchmarking = true,
                .enable_statistical_analysis = true,
                .enable_regression_detection = false,
                .enable_reference_comparison = false,
                .benchmark_duration_ms = 5000, // 5 seconds
                .warmup_iterations = 50,
                .measurement_iterations = 500,
                .statistical_significance = 0.1, // 90% confidence
                .regression_threshold = 0.1, // 10% regression threshold
                .output_format = .Human,
            };
        }
        
        pub fn ci() BenchmarkConfig {
            return BenchmarkConfig{
                .enable_benchmarking = true,
                .enable_statistical_analysis = true,
                .enable_regression_detection = true,
                .enable_reference_comparison = true,
                .benchmark_duration_ms = 30000, // 30 seconds
                .warmup_iterations = 200,
                .measurement_iterations = 2000,
                .statistical_significance = 0.01, // 99% confidence
                .regression_threshold = 0.03, // 3% regression threshold
                .output_format = .CI,
            };
        }
    };
    
    // Comprehensive benchmark execution and analysis framework
    pub fn run_all_benchmarks(self: *BenchmarkManager) !BenchmarkSuiteResult {
        var suite_result = BenchmarkSuiteResult.init(self.allocator);
        
        // Run micro-benchmarks (individual components)
        try self.run_micro_benchmarks(&suite_result);
        
        // Run macro-benchmarks (full execution scenarios)
        try self.run_macro_benchmarks(&suite_result);
        
        // Run comparison benchmarks against reference implementations
        if (self.config.enable_reference_comparison) {
            try self.run_comparison_benchmarks(&suite_result);
        }
        
        // Perform statistical analysis
        if (self.config.enable_statistical_analysis) {
            try self.analyze_results(&suite_result);
        }
        
        // Check for performance regressions
        if (self.config.enable_regression_detection) {
            try self.detect_regressions(&suite_result);
        }
        
        return suite_result;
    }
};
```

#### 2. Statistical Analysis Engine
```zig
pub const StatisticalAnalyzer = struct {
    allocator: std.mem.Allocator,
    
    pub fn analyze(self: *StatisticalAnalyzer, measurements: []const f64) BenchmarkStatistics {
        // Calculate comprehensive statistics including:
        // - Mean, median, standard deviation
        // - Min, max, 95th/99th percentiles
        // - Operations per second
        // - Confidence intervals
        // - Statistical significance tests
        
        const mean = self.calculate_mean(measurements);
        const std_dev = self.calculate_standard_deviation(measurements, mean);
        const confidence_interval = self.calculate_confidence_interval(measurements, mean, std_dev, 0.05);
        
        return BenchmarkStatistics{
            .sample_count = @intCast(measurements.len),
            .mean = mean,
            .median = self.calculate_percentile(measurements, 50.0),
            .std_dev = std_dev,
            .min = self.find_minimum(measurements),
            .max = self.find_maximum(measurements),
            .p95 = self.calculate_percentile(measurements, 95.0),
            .p99 = self.calculate_percentile(measurements, 99.0),
            .operations_per_second = if (mean > 0) 1_000_000_000.0 / mean else 0,
            .confidence_interval = confidence_interval,
        };
    }
    
    pub fn compare_distributions(
        self: *StatisticalAnalyzer,
        baseline: []const f64,
        comparison: []const f64
    ) StatisticalComparison {
        // Perform statistical significance testing
        // Calculate effect sizes and confidence intervals
        // Determine if performance differences are meaningful
    }
};
```

### Implementation Requirements

### Core Functionality
1. **Comprehensive Benchmarking**: Micro and macro benchmarks covering all EVM components
2. **Statistical Analysis**: Rigorous statistical analysis with confidence intervals and significance testing
3. **Reference Comparison**: Comparison against industry-standard EVM implementations (Geth, Revm, Evmone)
4. **Regression Detection**: Automated detection of performance regressions with configurable thresholds
5. **Result Aggregation**: Structured collection and analysis of benchmark results
6. **CI/CD Integration**: Automated benchmarking in continuous integration workflows

### Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Performance isolation** - Benchmarks must not interfere with each other or be affected by external factors
3. **Statistical validity** - All statistical analyses must be mathematically sound and well-documented
4. **Reproducibility** - Benchmark results must be reproducible across different runs and environments
5. **Accuracy** - Benchmark implementations must accurately reflect real EVM execution patterns
6. **Efficiency** - Benchmark framework itself must have minimal overhead and fast execution

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