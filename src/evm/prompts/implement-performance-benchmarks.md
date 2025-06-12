# Implement Performance Benchmarks

You are implementing Performance Benchmarks for the Tevm EVM written in Zig. Your goal is to implement comprehensive performance benchmarking framework following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_performance_benchmarks` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_performance_benchmarks feat_implement_performance_benchmarks`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive performance benchmarking framework to validate EVM performance against industry standards (Geth, Revm, Evmone), detect performance regressions, track optimization progress, and guide future performance improvements. This includes micro-benchmarks for individual components, macro-benchmarks for complete execution scenarios, and statistical analysis tools.

## ELI5

Think of performance benchmarking like timing race cars to see which is fastest. Just like you'd test a car on different tracks (highway, city, mountain roads) to understand its performance in various conditions, we test our EVM on different smart contracts and scenarios. We measure how fast it runs, compare it to other EVMs like comparing lap times, and watch for any slowdowns that might indicate problems. This helps us make sure our EVM is always running at peak performance and getting faster over time.

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

### Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly


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

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/benchmarks/performance_benchmarks_test.zig`)
```zig
// Test basic benchmark functionality
test "benchmark_manager basic functionality with known scenarios"
test "benchmark_manager handles edge cases correctly"
test "benchmark_manager validates input parameters"
test "benchmark_manager produces correct output format"
test "benchmark_registry manages benchmarks correctly"
test "statistical_analyzer computes statistics correctly"
test "regression_detector identifies performance regressions"
test "comparison_engine compares results accurately"
```

#### 2. **Integration Tests**
```zig
test "benchmark_system integrates with EVM execution context"
test "benchmark_system works with existing EVM systems"
test "benchmark_system maintains compatibility with hardforks"
test "benchmark_system handles system-level interactions"
test "benchmark_results integrate with analysis tools"
test "benchmark_reports export correctly"
test "benchmark_automation runs scheduled tests"
test "benchmark_comparison validates against baselines"
```

#### 3. **Functional Tests**
```zig
test "benchmark_system end-to-end functionality works correctly"
test "benchmark_system handles realistic usage scenarios"
test "benchmark_system maintains behavior under load"
test "benchmark_system processes complex inputs correctly"
test "micro_benchmarks measure individual components"
test "macro_benchmarks measure complete scenarios"
test "regression_tests detect performance degradation"
test "comparison_benchmarks validate against references"
```

#### 4. **Performance Tests**
```zig
test "benchmark_system meets performance requirements"
test "benchmark_system memory usage within bounds"
test "benchmark_system scalability with large inputs"
test "benchmark_system benchmark against baseline"
test "benchmark_overhead_minimal"
test "benchmark_accuracy_maintained"
test "benchmark_repeatability_ensured"
test "benchmark_stability_verified"
```

#### 5. **Error Handling Tests**
```zig
test "benchmark_system error propagation works correctly"
test "benchmark_system proper error types and messages"
test "benchmark_system graceful handling of invalid inputs"
test "benchmark_system recovery from failure states"
test "benchmark_validation rejects invalid configurations"
test "benchmark_execution handles timeouts"
test "benchmark_analysis handles insufficient data"
test "benchmark_comparison handles missing baselines"
```

#### 6. **Compatibility Tests**
```zig
test "benchmark_system maintains EVM specification compliance"
test "benchmark_system cross-client behavior consistency"
test "benchmark_system backward compatibility preserved"
test "benchmark_system platform-specific behavior verified"
test "benchmark_results compatible with analysis tools"
test "benchmark_formats match industry standards"
test "benchmark_metrics align with specifications"
test "benchmark_baselines remain valid"
```

### Test Development Priority
1. **Start with core functionality** - Ensure basic benchmark execution and measurement works correctly
2. **Add integration tests** - Verify system-level interactions with EVM execution
3. **Implement performance tests** - Meet efficiency requirements for benchmark operations
4. **Add error handling tests** - Robust failure management for benchmark errors
5. **Test edge cases** - Handle boundary conditions like timeout scenarios and invalid inputs
6. **Verify compatibility** - Ensure cross-platform consistency and reference compatibility

### Test Data Sources
- **EVM specification requirements**: Performance requirement verification
- **Reference implementation data**: Cross-client benchmark comparison
- **Performance benchmarks**: Historical baseline validation
- **Real-world execution scenarios**: Production performance validation
- **Synthetic test cases**: Stress testing and edge condition validation

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify cross-platform compatibility

### Test-First Examples

**Before writing any implementation:**
```zig
test "benchmark_manager basic functionality" {
    // This test MUST fail initially
    const allocator = testing.allocator;
    
    var benchmark_manager = BenchmarkManager.init(allocator, BenchmarkManager.BenchmarkConfig.default());
    defer benchmark_manager.deinit();
    
    const simple_benchmark = MicroBenchmark{
        .name = "ADD_opcode",
        .setup = test_setups.add_opcode_setup,
        .execution = test_executions.add_opcode_execution,
        .teardown = test_teardowns.simple_teardown,
    };
    
    try benchmark_manager.registerBenchmark(simple_benchmark);
    
    const result = try benchmark_manager.runBenchmark("ADD_opcode");
    
    try testing.expect(result.execution_time_ns > 0);
    try testing.expect(result.gas_used > 0);
    try testing.expectEqual(BenchmarkStatus.Success, result.status);
}
```

**Only then implement:**
```zig
pub const BenchmarkManager = struct {
    pub fn runBenchmark(self: *BenchmarkManager, name: []const u8) !BenchmarkResult {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test benchmark accuracy** - Ensure measurements reflect actual performance
- **Verify statistical validity** - Benchmarks must be statistically significant
- **Test cross-platform benchmark behavior** - Ensure consistent results across platforms
- **Validate integration points** - Test all external interfaces thoroughly

## References

- [Snailtracer EVM Benchmarks](https://github.com/ziyadedher/evm-bench)
- [EVM Performance Analysis](https://notes.ethereum.org/@ipsilon/evm-object-format-overview)
- [Benchmarking Best Practices](https://www.brendangregg.com/blog/2018-06-30/benchmarking-checklist.html)

## EVMONE Context

An analysis of the `evmone` codebase reveals a robust benchmarking strategy primarily using the Google Benchmark library. The most relevant patterns for your prompt are:
1.  **Synthetic Benchmarks:** `evmone` generates bytecode on-the-fly to create micro-benchmarks for individual opcodes and instruction patterns. This is a powerful technique for isolating and measuring the performance of specific components.
2.  **State-Test Based Benchmarks:** It reuses existing state-test files (complex execution scenarios) as macro-benchmarks. This allows for performance testing against realistic, complex workloads.
3.  **Pluggable VM Runner:** The benchmark runner is designed to execute different EVM implementations (including evmone's "baseline" and "advanced" interpreters, and external VMs) against the same set of benchmarks, which is ideal for reference comparison.

The following snippets demonstrate these core patterns.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/test/bench/bench.cpp">
This is the main entry point for the `evmone-bench` tool. It demonstrates how to parse command-line arguments to load different VMs and test suites, register benchmarks, and run them. This serves as the top-level `BenchmarkManager`.

```cpp
/// ./evmone/test/bench/bench.cpp
void register_benchmarks(std::span<const BenchmarkCase> benchmark_cases)
{
    evmc::VM* advanced_vm = nullptr;
    evmc::VM* baseline_vm = nullptr;
    // ... find registered VMs ...

    for (const auto& b : benchmark_cases)
    {
        if (advanced_vm != nullptr)
        {
            // Register a benchmark for code analysis (a micro-benchmark)
            RegisterBenchmark("advanced/analyse/" + b.name, [&b](State& state) {
                bench_analyse<advanced::AdvancedCodeAnalysis, advanced_analyse>(
                    state, default_revision, b.code);
            })->Unit(kMicrosecond);
        }

        // ... more analysis benchmarks ...

        for (const auto& input : b.inputs)
        {
            const auto case_name = b.name + (!input.name.empty() ? '/' + input.name : "");

            if (advanced_vm != nullptr)
            {
                // Register a benchmark for full execution (a macro-benchmark)
                const auto name = "advanced/execute/" + case_name;
                RegisterBenchmark(name, [&vm = *advanced_vm, &b, &input](State& state) {
                    bench_advanced_execute(state, vm, b.code, input.input, input.expected_output);
                })->Unit(kMicrosecond);
            }
            
            // ... more execution benchmarks for other VM types ...
        }
    }
}

int main(int argc, char** argv)
{
    MaybeReenterWithoutASLR(argc, argv);

    using namespace evmone::test;
    try
    {
        Initialize(&argc, argv);  // Consumes --benchmark_ options.
        const auto [ec, benchmark_cases] = parseargs(argc, argv);
        if (ec == cli_parsing_error && ReportUnrecognizedArguments(argc, argv))
            return ec;

        if (ec != 0)
            return ec;

        // Register different EVM implementations for comparison
        registered_vms["advanced"] = evmc::VM{evmc_create_evmone(), {{"advanced", ""}}};
        registered_vms["baseline"] = evmc::VM{evmc_create_evmone()};
        registered_vms["bnocgoto"] = evmc::VM{evmc_create_evmone(), {{"cgoto", "no"}}};
        
        // Register benchmarks from loaded files and synthetic generators
        register_benchmarks(benchmark_cases);
        register_synthetic_benchmarks();
        
        RunSpecifiedBenchmarks();
        return 0;
    }
    catch (const std::exception& ex)
    {
        std::cerr << ex.what() << "\n";
        return -1;
    }
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/bench/helpers.hpp">
This file contains the core benchmark execution loop. The `bench_execute` template is the function that gets timed by the benchmarking library. It sets up the EVM message, executes the code, and performs basic validation. This is analogous to the work done inside your `BenchmarkManager`'s measurement loop.

```cpp
/// ./evmone/test/bench/helpers.hpp
template <typename ExecutionStateT, typename AnalysisT,
    ExecuteFn<ExecutionStateT, AnalysisT> execute_fn, AnalyseFn<AnalysisT> analyse_fn>
inline void bench_execute(benchmark::State& state, evmc::VM& vm, bytes_view code, bytes_view input,
    bytes_view expected_output) noexcept
{
    constexpr auto rev = default_revision;
    constexpr auto gas_limit = default_gas_limit;

    // Analysis is done once before the benchmark loop
    const auto analysis = analyse_fn(rev, code);
    evmc::MockedHost host;
    ExecutionStateT exec_state;
    evmc_message msg{};
    msg.kind = EVMC_CALL;
    msg.gas = gas_limit;
    msg.input_data = input.data();
    msg.input_size = input.size();


    {  // Test run for validation before benchmarking.
        const auto r = execute_fn(vm, exec_state, analysis, msg, rev, host, code);
        if (r.status_code != EVMC_SUCCESS)
        {
            state.SkipWithError(("failure: " + std::to_string(r.status_code)).c_str());
            return;
        }

        if (!expected_output.empty())
        {
            // ... validation logic ...
        }
    }

    auto total_gas_used = int64_t{0};
    auto iteration_gas_used = int64_t{0};
    // The main measurement loop, managed by the benchmark library.
    for (auto _ : state)
    {
        const auto r = execute_fn(vm, exec_state, analysis, msg, rev, host, code);
        iteration_gas_used = gas_limit - r.gas_left;
        total_gas_used += iteration_gas_used;
    }

    using benchmark::Counter;
    state.counters["gas_used"] = Counter(static_cast<double>(iteration_gas_used));
    state.counters["gas_rate"] = Counter(static_cast<double>(total_gas_used), Counter::kIsRate);
}

// A convenient alias for executing a benchmark on the baseline interpreter.
constexpr auto bench_baseline_execute =
    bench_execute<ExecutionState, baseline::CodeAnalysis, baseline_execute, baseline_analyse>;
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/bench/synthetic_benchmarks.cpp">
This file is the most relevant for implementing micro-benchmarks. It contains functions to generate synthetic bytecode designed to stress-test individual opcodes or small instruction sequences. This avoids filesystem access and provides highly-focused, repeatable tests.

```cpp
/// ./evmone/test/bench/synthetic_benchmarks.cpp

/// Generates the EVM benchmark loop inner code for the given opcode and "mode".
bytecode generate_loop_inner_code(CodeParams params)
{
    const auto [opcode, mode] = params;
    const auto category = get_instruction_category(opcode);
    switch (mode)
    {
    case Mode::min_stack:
        switch (category)
        {
        // ... case for each instruction category ...
        case InstructionCategory::binop:
            // DUP1 DUP1 ADD DUP1 ADD DUP1 ADD ... POP
            return OP_DUP1 + (stack_limit - 1) * (OP_DUP1 + bytecode{opcode}) + OP_POP;
        // ... more cases ...
        }
        break;

    case Mode::full_stack:
        switch (category)
        {
        // ... case for each instruction category ...
        case InstructionCategory::binop:
            // DUP1 DUP1 DUP1 ... ADD ADD ADD ... POP
            return stack_limit * OP_DUP1 + (stack_limit - 1) * opcode + OP_POP;
        // ... more cases ...
        }
        break;
    }

    return {};
}

/// Generates a benchmark loop with given inner code.
bytecode generate_loop_v2(const bytecode& inner_code)
{
    const auto counter =
        push("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01");  // -255
    const auto jumpdest_offset = counter.size();
    return counter + OP_JUMPDEST + inner_code +  // loop label + inner code
           push(1) + OP_ADD + OP_DUP1 +          // counter += 1
           push(jumpdest_offset) + OP_JUMPI;     // jump to jumpdest_offset if counter != 0
}


void register_synthetic_benchmarks()
{
    std::vector<CodeParams> params_list;

    // Binops.
    for (const auto opcode : {OP_ADD, OP_MUL, OP_SUB, OP_SIGNEXTEND, OP_LT, OP_GT, OP_SLT, OP_SGT,
             OP_EQ, OP_AND, OP_OR, OP_XOR, OP_BYTE, OP_SHL, OP_SHR, OP_SAR})
        params_list.insert(
            params_list.end(), {{opcode, Mode::min_stack}, {opcode, Mode::full_stack}});
    
    // ... register other opcode categories ...

    for (const auto params : params_list)
    {
        for (auto& [vm_name, vm] : registered_vms)
        {
            RegisterBenchmark(std::string{vm_name} + "/total/synth/" + to_string(params),
                [&vm, params](
                    State& state) { bench_evmc_execute(state, vm, generate_code(params)); })
                ->Unit(kMicrosecond);
        }
    }
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/t8n/t8n.cpp">
The `t8n` (state transition) tool provides a clear example of a full macro-benchmark scenario. It loads a pre-state, block environment, and a list of transactions, then executes them sequentially, updating the state along the way. This is the pattern you would use for comprehensive, end-to-end performance validation.

```cpp
/// ./evmone/test/t8n/t8n.cpp
int main(int argc, const char* argv[])
{
    // ... argument parsing ...

    try
    {
        // ... argument parsing and file loading ...

        state::BlockInfo block;
        TestBlockHashes block_hashes;
        TestState state;

        if (!alloc_file.empty())
        {
            const auto j = json::json::parse(std::ifstream{alloc_file}, nullptr, false);
            state = from_json<TestState>(j);
            validate_state(state, rev);
        }
        if (!env_file.empty())
        {
            const auto j = json::json::parse(std::ifstream{env_file});
            block = from_json_with_rev(j, rev);
            block_hashes = from_json<TestBlockHashes>(j);
        }
        
        // ... difficulty and base fee calculation ...

        int64_t cumulative_gas_used = 0;
        auto blob_gas_left = static_cast<int64_t>(state::max_blob_gas_per_block(rev));
        std::vector<state::Transaction> transactions;
        std::vector<state::TransactionReceipt> receipts;
        int64_t block_gas_left = block.gas_limit;
        std::vector<state::Requests> requests;

        // Parse and execute transactions
        if (!txs_file.empty())
        {
            const auto j_txs = json::json::parse(std::ifstream{txs_file});

            evmc::VM vm{evmc_create_evmone()};

            // ... pre-block system calls ...

            for (size_t i = 0; i < j_txs.size(); ++i)
            {
                auto tx = test::from_json<state::Transaction>(j_txs[i]);
                // ... transaction validation ...

                auto res = test::transition(
                    state, block, block_hashes, tx, rev, vm, block_gas_left, blob_gas_left);

                if (holds_alternative<std::error_code>(res))
                {
                    // ... handle rejected transaction ...
                }
                else
                {
                    auto& receipt = get<state::TransactionReceipt>(res);
                    // ... update cumulative gas, receipts, etc. ...
                    block_gas_left -= receipt.gas_used;
                }
            }

            // ... post-block system calls and finalization ...
            test::finalize(
                state, rev, block.coinbase, block_reward, block.ommers, block.withdrawals);
        }

        // ... write results to files ...
    }
    catch (const std::exception& e)
    {
        std::cerr << e.what() << '\n';
        return 1;
    }

    return 0;
}
```
</file>
</evmone>

## Prompt Corrections
The original prompt includes a comprehensive, from-scratch design for a benchmark framework, including a `StatisticalAnalyzer`. While this is a valid approach, it's worth noting that `evmone` (and many other high-performance C++ projects) delegates this responsibility to a dedicated library, **Google Benchmark**.

**Correction & Suggestion:** Instead of building a statistical engine from scratch, consider integrating a mature Zig benchmarking library or using `std.testing.benchmark`. These libraries handle the complexities of stable measurements, statistical calculations (mean, stddev, iterations/sec), and regression detection in a standardized way. The `evmone` code shows a pattern of *preparing* workloads (synthetic or file-based) and then passing a simple execution loop to the benchmark runner, which is a highly effective and maintainable pattern.



## REVM Context

<revm>
<explanation>
The `revm` codebase uses the `criterion` crate for its benchmarking framework. This is a common pattern in the Rust ecosystem. The core idea is to:
1. Define a main benchmark runner function that sets up benchmark groups.
2. For each component (like a precompile), create a dedicated function that adds specific benchmarks to a group.
3. Inside the benchmark function, set up any necessary input data.
4. Use `group.bench_function` to define a named benchmark. This function takes a closure where the code to be benchmarked is called within a `b.iter(|| ...)` loop. This is analogous to Go's `for i := 0; i < b.N; i++` loop.

This approach provides excellent examples for creating both micro-benchmarks (for individual precompiles/opcodes) and macro-benchmarks (for full transaction execution).
</explanation>

## Production-Ready Benchmarking Infrastructure Patterns

The following sections provide detailed implementation patterns extracted from production EVM implementations (REVM and EVMOne) for building a comprehensive benchmarking framework.

### REVM Advanced Benchmarking Infrastructure

<explanation>
REVM demonstrates sophisticated benchmarking patterns using codspeed-criterion-compat for continuous performance monitoring. Key patterns include specialized BenchmarkDB for isolated testing, gas rate tracking, deterministic test data generation, and comprehensive coverage from micro-benchmarks to full transaction scenarios.
</explanation>

**Framework Configuration and Setup**:
```zig
// Equivalent Zig pattern for REVM's benchmarking setup
pub const BenchmarkFramework = struct {
    allocator: std.mem.Allocator,
    
    // REVM uses codspeed-criterion-compat for CI/CD performance tracking
    pub const Config = struct {
        warm_up_time_ms: u64 = 500,
        measurement_time_ms: u64 = 1500,
        sample_size: u32 = 10,
        enable_codspeed_tracking: bool = true, // For regression detection
    };
    
    // Specialized benchmark database (inspired by REVM's BenchmarkDB)
    pub const BenchmarkDB = struct {
        bytecode: Bytecode,
        code_hash: B256,
        
        // Fixed benchmark addresses for consistent results
        pub const BENCH_TARGET: Address = Address.fromSlice(&[_]u8{0xff} ** 20);
        pub const BENCH_CALLER: Address = Address.fromSlice(&[_]u8{0xee} ** 20);
        pub const BENCH_TARGET_BALANCE: U256 = U256.fromInt(10_000_000_000_000_000);
        
        pub fn new(bytecode: Bytecode) BenchmarkDB {
            return BenchmarkDB{
                .bytecode = bytecode,
                .code_hash = keccak256(bytecode.bytes()),
            };
        }
    };
    
    // Gas rate measurement (REVM tracks gas/second metrics)
    pub fn measureGasRate(gas_used: u64, duration_ns: u64) f64 {
        if (duration_ns == 0) return 0.0;
        return @as(f64, @floatFromInt(gas_used)) / (@as(f64, @floatFromInt(duration_ns)) / 1_000_000_000.0);
    }
};
```

**Deterministic Test Data Generation** (REVM Pattern):
```zig
// REVM uses fixed RNG seeds for reproducible benchmarks
pub const TestDataGenerator = struct {
    const RNG_SEED: u64 = 42; // Fixed seed from REVM
    rng: std.rand.DefaultPrng,
    
    pub fn init() TestDataGenerator {
        return TestDataGenerator{
            .rng = std.rand.DefaultPrng.init(RNG_SEED),
        };
    }
    
    // Generate deterministic test vectors for precompile benchmarks
    pub fn generateEcrecoverInput(self: *TestDataGenerator) [128]u8 {
        var input: [128]u8 = undefined;
        self.rng.random().bytes(&input);
        return input;
    }
    
    // REVM's multi-size testing pattern for scalability analysis
    pub fn getBenchmarkSizes() []const usize {
        return &[_]usize{ 1, 2, 128, 256 }; // From REVM's MSM benchmarks
    }
};
```

**Comprehensive Benchmark Categories** (REVM Structure):
```zig
pub const BenchmarkSuite = struct {
    // Core EVM benchmarks (matching REVM's revme/benches/)
    pub const CoreBenchmarks = enum {
        Analysis,        // Bytecode analysis operations
        Burntpix,       // Real-world contract scenarios
        Snailtracer,    // Gas-intensive computation (1B gas limit)
        Transfer,       // Simple ETH transfers
        TransferMulti,  // Batch operations (1000 transactions)
        EvmBuild,       // EVM instance construction overhead
    };
    
    // Precompile benchmarks (matching REVM's precompile structure)
    pub const PrecompileBenchmarks = enum {
        Ecrecover,      // Secp256k1 signature recovery
        Bls12381G1Add,  // BLS12-381 G1 addition
        Bls12381G1Msm,  // BLS12-381 G1 multi-scalar multiplication
        Bls12381G2Add,  // BLS12-381 G2 addition
        Bls12381G2Msm,  // BLS12-381 G2 multi-scalar multiplication
        Bls12381Pairing, // BLS12-381 pairing check
        Bn128Add,       // BN128 elliptic curve addition
        Bn128Mul,       // BN128 elliptic curve multiplication
        Bn128Pairing,   // BN128 pairing check
        KzgPointEval,   // KZG point evaluation (EIP-4844)
    };
    
    // REVM's batch transaction testing pattern
    pub fn benchmarkTransferMulti(allocator: std.mem.Allocator) !BenchmarkResult {
        const num_transfers = 1000; // Matches REVM
        var context = try createBenchmarkContext(allocator);
        defer context.deinit();
        
        const start_time = std.time.nanoTimestamp();
        for (0..num_transfers) |i| {
            const tx = createTransferTx(@intCast(i));
            const result = try context.evm.transact(tx);
            
            // Balance verification (REVM pattern)
            const expected_balance = BenchmarkDB.BENCH_TARGET_BALANCE.add(U256.fromInt(i));
            const actual_balance = context.evm.db.getBalance(BenchmarkDB.BENCH_TARGET);
            if (!expected_balance.eql(actual_balance)) {
                return error.BalanceVerificationFailed;
            }
        }
        const duration_ns = std.time.nanoTimestamp() - start_time;
        
        return BenchmarkResult{
            .duration_ns = @intCast(duration_ns),
            .gas_used = num_transfers * 21000, // Standard transfer gas
            .gas_rate = BenchmarkFramework.measureGasRate(num_transfers * 21000, @intCast(duration_ns)),
        };
    }
};
```

### EVMOne Advanced Performance Measurement Patterns

<explanation>
EVMOne provides sophisticated performance measurement using Google Benchmark library with emphasis on gas rate calculations, memory allocation benchmarking, statistical reliability measures, and multi-VM comparison frameworks. Key patterns include synthetic loop generation, O(1) LRU cache benchmarking, and microsecond-precision gas rate tracking.
</explanation>

**Gas Rate Measurement Infrastructure** (EVMOne Pattern):
```zig
// EVMOne's gas rate calculation approach
pub const GasRateTracker = struct {
    total_gas_used: u64 = 0,
    iteration_count: u64 = 0,
    
    pub fn recordIteration(self: *GasRateTracker, gas_used: u64) void {
        self.total_gas_used += gas_used;
        self.iteration_count += 1;
    }
    
    // EVMOne uses benchmark::Counter::kIsRate for gas/second metrics
    pub fn getGasRate(self: GasRateTracker, duration_ns: u64) f64 {
        if (duration_ns == 0) return 0.0;
        const duration_seconds = @as(f64, @floatFromInt(duration_ns)) / 1_000_000_000.0;
        return @as(f64, @floatFromInt(self.total_gas_used)) / duration_seconds;
    }
    
    // EVMOne tracks bytes analyzed per second for analysis benchmarks
    pub fn getBytesAnalyzedRate(bytes_analyzed: u64, duration_ns: u64) f64 {
        if (duration_ns == 0) return 0.0;
        const duration_seconds = @as(f64, @floatFromInt(duration_ns)) / 1_000_000_000.0;
        return @as(f64, @floatFromInt(bytes_analyzed)) / duration_seconds;
    }
};
```

**Synthetic Benchmark Generation** (EVMOne Pattern):
```zig
// EVMOne generates optimized synthetic loops for instruction benchmarking
pub const SyntheticBenchmarks = struct {
    // EVMOne uses two loop variants for performance comparison
    pub fn generateOptimizedLoop(allocator: std.mem.Allocator, instruction: Opcode) ![]u8 {
        var bytecode = std.ArrayList(u8).init(allocator);
        
        // EVMOne pattern: 255 iterations with counter manipulation
        try bytecode.append(@intFromEnum(Opcode.PUSH1));
        try bytecode.append(0xFF); // 255 iterations
        try bytecode.append(@intFromEnum(Opcode.PUSH1));
        try bytecode.append(0x00); // counter
        
        // Loop with the target instruction
        const loop_start = bytecode.items.len;
        try bytecode.append(@intFromEnum(Opcode.DUP2));  // duplicate counter
        try bytecode.append(@intFromEnum(instruction));   // target instruction
        try bytecode.append(@intFromEnum(Opcode.POP));    // clean stack
        try bytecode.append(@intFromEnum(Opcode.PUSH1));
        try bytecode.append(0x01);
        try bytecode.append(@intFromEnum(Opcode.ADD));    // increment counter
        try bytecode.append(@intFromEnum(Opcode.DUP1));   // duplicate for comparison
        try bytecode.append(@intFromEnum(Opcode.DUP3));   // duplicate limit
        try bytecode.append(@intFromEnum(Opcode.LT));     // compare
        try bytecode.append(@intFromEnum(Opcode.PUSH2));
        const jump_addr = @as(u16, @intCast(loop_start));
        try bytecode.append(@intCast(jump_addr >> 8));
        try bytecode.append(@intCast(jump_addr & 0xFF));
        try bytecode.append(@intFromEnum(Opcode.JUMPI)); // conditional jump
        
        try bytecode.append(@intFromEnum(Opcode.STOP));
        return bytecode.toOwnedSlice();
    }
    
    // EVMOne's instruction category benchmarks
    pub const InstructionCategories = enum {
        Nop,      // No-operation patterns
        Nullop,   // Nullary operators (e.g., ADDRESS, ORIGIN)
        Unop,     // Unary operators (e.g., NOT, ISZERO)
        Binop,    // Binary operators (e.g., ADD, MUL)
        Push,     // PUSH operations
        Dup,      // DUP operations
        Swap,     // SWAP operations
    };
};
```

**LRU Cache Performance Benchmarks** (EVMOne Pattern):
```zig
// EVMOne benchmarks O(1) LRU cache operations for state caching
pub const LRUCacheBenchmark = struct {
    const CacheSize = 1000;
    
    pub fn benchmarkCacheHit(allocator: std.mem.Allocator) !BenchmarkResult {
        var cache = LRUCache(u64, u64, CacheSize).init(allocator);
        defer cache.deinit();
        
        // Pre-populate cache
        for (0..CacheSize) |i| {
            try cache.put(@intCast(i), @intCast(i * 2));
        }
        
        const start_time = std.time.nanoTimestamp();
        
        // Benchmark cache hits
        for (0..10000) |i| {
            const key = i % CacheSize;
            _ = cache.get(@intCast(key)); // All hits
        }
        
        const duration_ns = std.time.nanoTimestamp() - start_time;
        return BenchmarkResult{
            .operation_count = 10000,
            .duration_ns = @intCast(duration_ns),
            .operations_per_second = 10000.0 / (@as(f64, @floatFromInt(duration_ns)) / 1_000_000_000.0),
        };
    }
    
    // EVMOne tests cache miss and eviction scenarios
    pub fn benchmarkCacheMissWithEviction(allocator: std.mem.Allocator) !BenchmarkResult {
        var cache = LRUCache(u64, u64, CacheSize).init(allocator);
        defer cache.deinit();
        
        const start_time = std.time.nanoTimestamp();
        
        // Force cache misses and evictions
        for (0..10000) |i| {
            try cache.put(@intCast(i), @intCast(i * 2)); // Causes evictions after CacheSize
        }
        
        const duration_ns = std.time.nanoTimestamp() - start_time;
        return BenchmarkResult{
            .operation_count = 10000,
            .duration_ns = @intCast(duration_ns),
            .operations_per_second = 10000.0 / (@as(f64, @floatFromInt(duration_ns)) / 1_000_000_000.0),
        };
    }
};
```

**Memory Allocation Benchmarking** (EVMOne Pattern):
```zig
// EVMOne benchmarks different allocation strategies
pub const MemoryAllocationBenchmarks = struct {
    // EVMOne tests allocation sizes from 1KB to 128MB
    pub const AllocationSizes = [_]usize{
        1024,           // 1KB
        1024 * 16,      // 16KB
        1024 * 256,     // 256KB
        1024 * 1024,    // 1MB
        1024 * 1024 * 16, // 16MB
        1024 * 1024 * 128, // 128MB
    };
    
    pub fn benchmarkMalloc(size: usize, iterations: u32) !BenchmarkResult {
        const start_time = std.time.nanoTimestamp();
        
        for (0..iterations) |_| {
            const ptr = std.c.malloc(size);
            if (ptr == null) return error.AllocationFailed;
            std.c.free(ptr);
        }
        
        const duration_ns = std.time.nanoTimestamp() - start_time;
        return BenchmarkResult{
            .operation_count = iterations,
            .duration_ns = @intCast(duration_ns),
            .bytes_per_second = (@as(f64, @floatFromInt(size * iterations))) / (@as(f64, @floatFromInt(duration_ns)) / 1_000_000_000.0),
        };
    }
    
    // EVMOne compares malloc vs mmap on Unix systems
    pub fn benchmarkMmap(size: usize, iterations: u32) !BenchmarkResult {
        if (builtin.os.tag != .linux and builtin.os.tag != .macos) {
            return error.UnsupportedPlatform;
        }
        
        const start_time = std.time.nanoTimestamp();
        
        for (0..iterations) |_| {
            const ptr = std.c.mmap(null, size, std.c.PROT.READ | std.c.PROT.WRITE, std.c.MAP.PRIVATE | std.c.MAP.ANONYMOUS, -1, 0);
            if (ptr == std.c.MAP_FAILED) return error.MmapFailed;
            _ = std.c.munmap(ptr, size);
        }
        
        const duration_ns = std.time.nanoTimestamp() - start_time;
        return BenchmarkResult{
            .operation_count = iterations,
            .duration_ns = @intCast(duration_ns),
            .bytes_per_second = (@as(f64, @floatFromInt(size * iterations))) / (@as(f64, @floatFromInt(duration_ns)) / 1_000_000_000.0),
        };
    }
};
```

**Multi-VM Comparison Framework** (EVMOne Pattern):
```zig
// EVMOne supports comparing multiple VM implementations
pub const MultiVMBenchmark = struct {
    pub const VMImplementation = enum {
        TevmBaseline,
        TevmOptimized,
        TevmAdvanced,
        External, // For comparison with other EVMs
    };
    
    pub const ComparisonResult = struct {
        baseline_result: BenchmarkResult,
        optimized_result: BenchmarkResult,
        advanced_result: BenchmarkResult,
        performance_ratio: f64, // optimized vs baseline
        regression_detected: bool,
    };
    
    pub fn compareImplementations(
        allocator: std.mem.Allocator,
        bytecode: []const u8,
        input: []const u8
    ) !ComparisonResult {
        // EVMOne pattern: run same test on multiple VM implementations
        const baseline_result = try benchmarkImplementation(.TevmBaseline, bytecode, input, allocator);
        const optimized_result = try benchmarkImplementation(.TevmOptimized, bytecode, input, allocator);
        const advanced_result = try benchmarkImplementation(.TevmAdvanced, bytecode, input, allocator);
        
        const performance_ratio = @as(f64, @floatFromInt(baseline_result.duration_ns)) / 
                                 @as(f64, @floatFromInt(optimized_result.duration_ns));
        
        // EVMOne uses statistical significance testing for regression detection
        const regression_detected = performance_ratio < 0.95; // 5% performance degradation threshold
        
        return ComparisonResult{
            .baseline_result = baseline_result,
            .optimized_result = optimized_result,
            .advanced_result = advanced_result,
            .performance_ratio = performance_ratio,
            .regression_detected = regression_detected,
        };
    }
};
```

**Statistical Reliability Measures** (EVMOne Pattern):
```zig
// EVMOne implements statistical reliability measures
pub const StatisticalReliability = struct {
    // EVMOne uses MaybeReenterWithoutASLR for consistent memory layout
    pub fn disableASLR() !void {
        // Platform-specific ASLR disabling for consistent benchmarks
        // This ensures memory layout consistency across runs
        if (builtin.os.tag == .linux) {
            // On Linux, this would require specific process setup
            std.log.warn("ASLR disabling not implemented for Linux in this example", .{});
        }
    }
    
    // EVMOne uses benchmark::DoNotOptimize equivalent
    pub fn doNotOptimize(comptime T: type, value: T) T {
        // Prevent compiler optimization of benchmark code
        // Equivalent to EVMOne's benchmark::DoNotOptimize
        asm volatile ("" : : [value] "r" (value) : "memory");
        return value;
    }
    
    // EVMOne uses benchmark::ClobberMemory equivalent
    pub fn clobberMemory() void {
        // Ensure memory barriers in benchmarks
        asm volatile ("" : : : "memory");
    }
    
    // EVMOne validates benchmark results during execution
    pub fn validateBenchmarkResult(expected_output: []const u8, actual_output: []const u8) !void {
        if (!std.mem.eql(u8, expected_output, actual_output)) {
            return error.BenchmarkValidationFailed;
        }
    }
};
```

<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/benches/bench.rs">
```rust
//! Benchmarks for the crypto precompiles
/// `ecrecover` benchmarks
pub mod ecrecover;
/// `eip1962` benchmarks
pub mod eip1962;
/// `eip2537` benchmarks
pub mod eip2537;
/// `eip4844` benchmarks
pub mod eip4844;

use criterion::{criterion_group, criterion_main, Criterion};

/// Benchmarks different cryptography-related precompiles.
pub fn benchmark_crypto_precompiles(c: &mut Criterion) {
    let mut group = c.benchmark_group("Crypto Precompile benchmarks");

    // Run BLS12-381 benchmarks (EIP-2537)
    eip2537::add_g1_add_benches(&mut group);
    eip2537::add_g2_add_benches(&mut group);
    eip2537::add_g1_msm_benches(&mut group);
    eip2537::add_g2_msm_benches(&mut group);
    eip2537::add_pairing_benches(&mut group);
    eip2537::add_map_fp_to_g1_benches(&mut group);
    eip2537::add_map_fp2_to_g2_benches(&mut group);

    // Run BN128 benchmarks
    eip1962::add_bn128_add_benches(&mut group);
    eip1962::add_bn128_mul_benches(&mut group);
    eip1962::add_bn128_pair_benches(&mut group);

    // Run secp256k1 benchmarks
    ecrecover::add_benches(&mut group);

    // Run KZG point evaluation benchmarks
    eip4844::add_benches(&mut group);
}

criterion_group! {
    name = benches;
    config = Criterion::default();
    targets = benchmark_crypto_precompiles
}

criterion_main!(benches);
```
</file>

<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/benches/ecrecover.rs">
```rust
//! Benchmarks for the ecrecover precompile
use criterion::{measurement::Measurement, BenchmarkGroup};
use primitives::{hex, keccak256, Bytes, U256};
use revm_precompile::secp256k1::ec_recover_run;
use secp256k1::{Message, SecretKey, SECP256K1};

/// Add benches for the ecrecover precompile
pub fn add_benches<M: Measurement>(group: &mut BenchmarkGroup<'_, M>) {
    // Generate secp256k1 signature
    let data = hex::decode("1337133713371337").unwrap();
    let hash = keccak256(data);
    let secret_key = SecretKey::new(&mut rand::thread_rng());

    let message = Message::from_digest_slice(&hash[..]).unwrap();
    let s = SECP256K1.sign_ecdsa_recoverable(&message, &secret_key);
    let (rec_id, data) = s.serialize_compact();
    let rec_id = i32::from(rec_id) as u8 + 27;

    let mut message_and_signature = [0u8; 128];
    message_and_signature[0..32].copy_from_slice(&hash[..]);

    // Fit signature into format the precompile expects
    let rec_id = U256::from(rec_id as u64);
    message_and_signature[32..64].copy_from_slice(&rec_id.to_be_bytes::<32>());
    message_and_signature[64..128].copy_from_slice(&data);

    let message_and_signature = Bytes::from(message_and_signature);

    group.bench_function("ecrecover precompile", |b| {
        b.iter(|| ec_recover_run(&message_and_signature, u64::MAX).unwrap())
    });
}
```
</file>

<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/benches/eip1962.rs">
```rust
//! Benchmarks for the BN128 precompiles
use criterion::{measurement::Measurement, BenchmarkGroup};
use primitives::hex;
use primitives::Bytes;
use revm_precompile::bn128::{
    add::ISTANBUL_ADD_GAS_COST,
    mul::ISTANBUL_MUL_GAS_COST,
    pair::{ISTANBUL_PAIR_BASE, ISTANBUL_PAIR_PER_POINT},
    run_add, run_mul, run_pair,
};

/// Add benches for the BN128 add precompile
pub fn add_bn128_add_benches<M: Measurement>(group: &mut BenchmarkGroup<'_, M>) {
    let ecadd_input = hex::decode(
        "\
         18b18acfb4c2c30276db5411368e7185b311dd124691610c5d3b74034e093dc9\
         063c909c4720840cb5134cb9f59fa749755796819658d32efc0d288198f37266\
         07c2b7f58a84bd6145f00c9c2bc0bb1a187f20ff2c92963a88019e7c6a014eed\
         06614e20c147e940f2d70da3f74c9a17df361706a4485c742bd6788478fa17d7",
    )
    .unwrap();
    let input = Bytes::from(ecadd_input);

    group.bench_function("bn128 add precompile", |b| {
        b.iter(|| run_add(&input, ISTANBUL_ADD_GAS_COST, 150).unwrap())
    });
}

/// Add benches for the BN128 mul precompile
pub fn add_bn128_mul_benches<M: Measurement>(group: &mut BenchmarkGroup<'_, M>) {
    let ecmul_input = hex::decode(
        "\
         18b18acfb4c2c30276db5411368e7185b311dd124691610c5d3b74034e093dc9\
         063c909c4720840cb5134cb9f59fa749755796819658d32efc0d288198f37266\
         06614e20c147e940f2d70da3f74c9a17df361706a4485c742bd6788478fa17d7",
    )
    .unwrap();
    let input = Bytes::from(ecmul_input);

    group.bench_function("bn128 mul precompile", |b| {
        b.iter(|| run_mul(&input, ISTANBUL_MUL_GAS_COST, 6000).unwrap())
    });
}
```
</file>

<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/benches/eip2537.rs">
```rust
//! Benchmarks for the BLS12-381 precompiles
use ark_bls12_381::{Fq, Fr, G1Affine, G2Affine};
use ark_ec::AffineRepr;
use arkworks_general::{encode_base_field, encode_field_32_bytes, random_field, random_points};
use criterion::{measurement::Measurement, BenchmarkGroup};
use primitives::Bytes;
use rand::{rngs::StdRng, SeedableRng};
use revm_precompile::bls12_381_const::{PADDED_FP_LENGTH, PADDED_G1_LENGTH, PADDED_G2_LENGTH};

const RNG_SEED: u64 = 42;
const MAX_MSM_SIZE: usize = 256;
const MAX_PAIRING_PAIRS: usize = 16;

type PrecompileInput = Vec<u8>;

// ... (helper functions for generating random points and test vectors) ...

/// Add benches for the BLS12-381 G1 msm precompile
pub fn add_g1_msm_benches<M: Measurement>(group: &mut BenchmarkGroup<'_, M>) {
    use revm_precompile::bls12_381::g1_msm::PRECOMPILE;

    let precompile = *PRECOMPILE.precompile();

    let sizes_to_bench = [MAX_MSM_SIZE, MAX_MSM_SIZE / 2, 2, 1];

    for size in sizes_to_bench {
        let mut rng = StdRng::seed_from_u64(RNG_SEED);
        let test_vector = g1_msm_test_vectors(size, &mut rng);
        let input = Bytes::from(test_vector);

        group.bench_function(format!("g1_msm (size {})", size), |b| {
            b.iter(|| precompile(&input, u64::MAX).unwrap());
        });
    }
}

fn g1_msm_test_vectors(msm_size: usize, rng: &mut StdRng) -> PrecompileInput {
    let points: Vec<G1Affine> = random_points(msm_size, rng);
    let scalars: Vec<Fr> = random_field(msm_size, rng);

    let mut input = Vec::new();
    for (point, scalar) in points.iter().zip(scalars.iter()) {
        input.extend(encode_bls12381_g1_point(point));
        input.extend(encode_field_32_bytes(scalar));
    }

    input
}

// ... (other benchmark functions like add_pairing_benches, etc.) ...
```
</file>
</revm>



## EXECUTION-SPECS Context

An excellent and well-defined prompt for implementing a performance benchmarking framework. The provided specifications are clear and comprehensive.

The `execution-specs` codebase provides a Python implementation of the EVM, which serves as a valuable reference for understanding the core logic that needs to be benchmarked. The tests, in particular, demonstrate how to set up and run isolated EVM execution scenarios, a pattern that is directly applicable to creating both micro and macro benchmarks.

Here are the most relevant code snippets to guide your implementation.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
This file contains the core execution loop of the EVM. The `execute_code` function is the heart of the interpreter, fetching and dispatching opcodes. This is the central piece of logic that the benchmark framework will measure, both as a whole (macro-benchmarks) and for individual opcodes (micro-benchmarks).

```python
def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: `ethereum.vm.EVM`
        Items containing execution specific objects
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        valid_jump_destinations=valid_jump_destinations,
        logs=(),
        refund_counter=0,
        running=True,
        message=message,
        output=b"",
        accounts_to_delete=set(),
        return_data=b"",
        error=None,
        accessed_addresses=message.accessed_addresses,
        accessed_storage_keys=message.accessed_storage_keys,
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/fork.py">
This file contains the high-level `state_transition` and `process_transaction` functions. These are essential for creating macro-benchmarks that simulate the execution of entire transactions or blocks, providing a realistic workload for performance measurement. Understanding this flow is key to setting up complex benchmark scenarios.

```python
def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    """
    Execute a transaction against the provided environment.

    This function processes the actions needed to execute a transaction.
    It decrements the sender's account after calculating the gas fee and
    refunds them the proper amount after execution. Calling contracts,
    deploying code, and incrementing nonces are all examples of actions that
    happen within this function or from a call made within this function.

    Accounts that are marked for deletion are processed and destroyed after
    execution.

    Parameters
    ----------
    block_env :
        Environment for the Ethereum Virtual Machine.
    block_output :
        The block output for the current block.
    tx :
        Transaction to execute.
    index:
        Index of the transaction in the block.
    """
    trie_set(
        block_output.transactions_trie,
        rlp.encode(index),
        encode_transaction(tx),
    )

    intrinsic_gas = validate_transaction(tx)

    (
        sender,
        effective_gas_price,
        blob_versioned_hashes,
        tx_blob_gas_used,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )

    sender_account = get_account(block_env.state, sender)

    if isinstance(tx, BlobTransaction):
        blob_gas_fee = calculate_data_fee(block_env.excess_blob_gas, tx)
    else:
        blob_gas_fee = Uint(0)

    effective_gas_fee = tx.gas * effective_gas_price

    gas = tx.gas - intrinsic_gas
    increment_nonce(block_env.state, sender)

    sender_balance_after_gas_fee = (
        Uint(sender_account.balance) - effective_gas_fee - blob_gas_fee
    )
    set_account_balance(
        block_env.state, sender, U256(sender_balance_after_gas_fee)
    )
    # ...
    # Message preparation and execution
    # ...
    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)
    # ...
    # Gas refund and fee transfer logic
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/arithmetic.py">
This file is a perfect example of how individual opcodes are implemented. The `add` function is simple, self-contained, and a prime candidate for a micro-benchmark. The pattern of popping from the stack, performing an operation, and pushing the result is fundamental.

```python
def add(evm: Evm) -> None:
    """
    Adds the top two elements of the stack together, and pushes the result back
    on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    result = x.wrapping_add(y)

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/storage.py">
The `sstore` opcode implementation demonstrates a more complex operation involving state access and dynamic gas calculation based on the values being written. This serves as an excellent template for a more involved micro-benchmark that measures the performance of state-modifying operations under different conditions (e.g., warm vs. cold access, zero to non-zero transitions).

```python
def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)
    if evm.gas_left <= GAS_CALL_STIPEND:
        raise OutOfGasError

    state = evm.message.block_env.state
    original_value = get_storage_original(
        state, evm.message.current_target, key
    )
    current_value = get_storage(state, evm.message.current_target, key)

    gas_cost = Uint(0)

    if (evm.message.current_target, key) not in evm.accessed_storage_keys:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        gas_cost += GAS_COLD_SLOAD

    if original_value == current_value and current_value != new_value:
        if original_value == 0:
            gas_cost += GAS_STORAGE_SET
        else:
            gas_cost += GAS_STORAGE_UPDATE - GAS_COLD_SLOAD
    else:
        gas_cost += GAS_WARM_ACCESS
    
    # ... Refund Counter Calculation ...

    charge_gas(evm, gas_cost)
    if evm.message.is_static:
        raise WriteInStaticContext
    set_storage(state, evm.message.current_target, key, new_value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/tests/helpers/load_vm_tests.py">
The `VmTestLoader` class is an ideal reference for building benchmark scenarios. It shows exactly how to initialize a `BlockEnvironment` and a `TransactionEnvironment` from a JSON description, prepare a `Message`, and execute it via `process_message_call`. This pattern can be directly adapted to load different benchmark scenarios from files.

```python
class VmTestLoader:
    """
    All the methods and imports required to run the VM tests.
    """

    def __init__(self, network: str, fork_name: str):
        # ... imports and setup ...

    def run_test(
        self, test_dir: str, test_file: str, check_gas_left: bool = True
    ) -> None:
        """
        Execute a test case and check its post state.
        """
        test_data = self.load_test(test_dir, test_file)
        block_env = test_data["block_env"]
        tx_env = test_data["tx_env"]
        tx = test_data["tx"]

        message = self.prepare_message(
            block_env=block_env,
            tx_env=tx_env,
            tx=tx,
        )

        output = self.process_message_call(message)
        # ... assertions ...
    
    def json_to_block_env(self, json_data: Any) -> Any:
        """
        Deserialize a `BlockEnvironment` instance from JSON.
        """
        # ... logic to create block environment ...

    def json_to_state(self, raw: Any) -> Any:
        """
        Deserialize a `State` from JSON.
        """
        # ... logic to create state ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/trace.py">
The tracing infrastructure defined here is highly relevant. While its primary purpose is debugging, it can be repurposed for benchmarking. By implementing a custom `EvmTracer`, you can hook into events like `OpStart` and `OpEnd` to precisely measure the execution time of each opcode, providing the raw data for your statistical analysis engine.

```python
@dataclass
class OpStart:
    """
    Trace event that is triggered before executing an opcode.
    """

    op: enum.Enum
    """
    Opcode that is about to be executed.
    ...
    """


@dataclass
class OpEnd:
    """
    Trace event that is triggered after executing an opcode.
    """

# ...

def evm_trace(
    evm: object,
    event: TraceEvent,
    /,
    trace_memory: bool = False,
    trace_stack: bool = True,
    trace_return_data: bool = False,
) -> None:
    """
    Emit a trace to the active [`EvmTracer`].

    [`EvmTracer`]: ref:ethereum.trace.EvmTracer
    """
    global _evm_trace
    _evm_trace(
        evm,
        event,
        trace_memory=trace_memory,
        trace_stack=trace_stack,
        trace_return_data=trace_return_data,
    )
```
</file>
</execution-specs>
```

**Final-Review:** 
1. **The user wants to implement a performance benchmarking framework.** I have selected files relevant to setting up and running EVM execution, which is the core of what needs to be benchmarked.
2. **Micro-benchmarks:** `instructions/arithmetic.py` and `instructions/storage.py` provide clear examples of simple and complex opcodes to benchmark.
3. **Macro-benchmarks:** `fork.py` (`process_transaction`) and `tests/helpers/load_vm_tests.py` (`VmTestLoader`) show how to set up and run entire transaction scenarios.
4. **Statistical Analysis**: The prompt defines the Zig struct for this. My snippets provide the *inputs* for such analysis. Specifically, `interpreter.py` (`execute_code`'s return value) and `trace.py` (for fine-grained data collection) are relevant.
5. **Reference Comparison**: I am providing snippets from the Python reference implementation (`execution-specs`), which is what the user would compare their Zig implementation against.
6. **The output format is correct.** I have used the `<execution-specs>` and `<file>` tags as requested.
7. **The explanations are concise and relevant.** Each file snippet is preceded by a brief explanation of why it's useful for the task.

The selected snippets are high-quality and directly relevant to the user's request. They cover the full spectrum from individual opcode execution to full transaction processing, providing a solid foundation for building the requested benchmarking framework. The inclusion of the test loader is particularly valuable as it's a practical example of how to orchestrate a test/benchmark run. The `trace.py` file is a good hint for how to gather detailed performance data without modifying the core EVM loop too much.

The provided snippets give a good overview without being overwhelming. The selection seems complete and well-justified. I will now generate the final response.

---

An analysis of the `execution-specs` provides excellent patterns for setting up benchmarks. The core idea is to isolate each opcode as a function that takes the `Evm` state and modifies it. This mirrors how micro-benchmarks should be structured. For macro-benchmarks, the `process_transaction` function provides a complete workflow for executing a transaction from start to finish.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/arithmetic.py">
```python
"""
Ethereum Virtual Machine (EVM) Arithmetic Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM Arithmetic instructions.
"""

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint

from ethereum.utils.numeric import get_sign

from .. import Evm
from ..gas import (
    GAS_EXPONENTIATION,
    GAS_EXPONENTIATION_PER_BYTE,
    GAS_LOW,
    GAS_MID,
    GAS_VERY_LOW,
    charge_gas,
)
from ..stack import pop, push


def add(evm: Evm) -> None:
    """
    Adds the top two elements of the stack together, and pushes the result back
    on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    result = x.wrapping_add(y)

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mul(evm: Evm) -> None:
    """
    Multiply the top two elements of the stack, and pushes the result back
    on the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    x = pop(evm.stack)
    y = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_LOW)

    # OPERATION
    result = x.wrapping_mul(y)

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)



def exp(evm: Evm) -> None:
    """
    Exponential operation of the top 2 elements. Pushes the result back on
    the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    base = Uint(pop(evm.stack))
    exponent = Uint(pop(evm.stack))

    # GAS
    # This is equivalent to 1 + floor(log(y, 256)). But in python the log
    # function is inaccurate leading to wrong results.
    exponent_bits = exponent.bit_length()
    exponent_bytes = (exponent_bits + Uint(7)) // Uint(8)
    charge_gas(
        evm, GAS_EXPONENTIATION + GAS_EXPONENTIATION_PER_BYTE * exponent_bytes
    )

    # OPERATION
    result = U256(pow(base, exponent, Uint(U256.MAX_VALUE) + Uint(1)))

    push(evm.stack, result)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/storage.py">
```python
"""
Ethereum Virtual Machine (EVM) Storage Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM storage related instructions.
"""
from ethereum_types.numeric import Uint

from ...state import get_storage, get_storage_original, set_storage
from .. import Evm
from ..exceptions import OutOfGasError, WriteInStaticContext
from ..gas import (
    GAS_CALL_STIPEND,
    GAS_COLD_SLOAD,
    GAS_STORAGE_CLEAR_REFUND,
    GAS_STORAGE_SET,
    GAS_STORAGE_UPDATE,
    GAS_WARM_ACCESS,
    charge_gas,
)
from ..stack import pop, push


def sload(evm: Evm) -> None:
    """
    Loads to the stack, the value corresponding to a certain key from the
    storage of the current account.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()

    # GAS
    if (evm.message.current_target, key) in evm.accessed_storage_keys:
        charge_gas(evm, GAS_WARM_ACCESS)
    else:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        charge_gas(evm, GAS_COLD_SLOAD)

    # OPERATION
    value = get_storage(
        evm.message.block_env.state, evm.message.current_target, key
    )

    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)
    if evm.gas_left <= GAS_CALL_STIPEND:
        raise OutOfGasError

    state = evm.message.block_env.state
    original_value = get_storage_original(
        state, evm.message.current_target, key
    )
    current_value = get_storage(state, evm.message.current_target, key)

    gas_cost = Uint(0)

    if (evm.message.current_target, key) not in evm.accessed_storage_keys:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        gas_cost += GAS_COLD_SLOAD

    if original_value == current_value and current_value != new_value:
        if original_value == 0:
            gas_cost += GAS_STORAGE_SET
        else:
            gas_cost += GAS_STORAGE_UPDATE - GAS_COLD_SLOAD
    else:
        gas_cost += GAS_WARM_ACCESS

    # Refund Counter Calculation
    if current_value != new_value:
        if original_value != 0 and current_value != 0 and new_value == 0:
            # Storage is cleared for the first time in the transaction
            evm.refund_counter += int(GAS_STORAGE_CLEAR_REFUND)

        if original_value != 0 and current_value == 0:
            # Gas refund issued earlier to be reversed
            evm.refund_counter -= int(GAS_STORAGE_CLEAR_REFUND)

        if original_value == new_value:
            # Storage slot being restored to its original value
            if original_value == 0:
                # Slot was originally empty and was SET earlier
                evm.refund_counter += int(GAS_STORAGE_SET - GAS_WARM_ACCESS)
            else:
                # Slot was originally non-empty and was UPDATED earlier
                evm.refund_counter += int(
                    GAS_STORAGE_UPDATE - GAS_COLD_SLOAD - GAS_WARM_ACCESS
                )

    charge_gas(evm, gas_cost)
    if evm.message.is_static:
        raise WriteInStaticContext
    set_storage(state, evm.message.current_target, key, new_value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: `ethereum.vm.EVM`
        Items containing execution specific objects
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        valid_jump_destinations=valid_jump_destinations,
        logs=(),
        refund_counter=0,
        running=True,
        message=message,
        output=b"",
        accounts_to_delete=set(),
        touched_accounts=set(),
        return_data=b"",
        error=None,
        accessed_addresses=message.accessed_addresses,
        accessed_storage_keys=message.accessed_storage_keys,
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    """
    Execute a transaction against the provided environment.
    ...
    """
    trie_set(
        block_output.transactions_trie,
        rlp.encode(index),
        encode_transaction(tx),
    )

    intrinsic_gas = validate_transaction(tx)

    (
        sender,
        effective_gas_price,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )

    sender_account = get_account(block_env.state, sender)

    effective_gas_fee = tx.gas * effective_gas_price

    gas = tx.gas - intrinsic_gas
    increment_nonce(block_env.state, sender)

    sender_balance_after_gas_fee = (
        Uint(sender_account.balance) - effective_gas_fee
    )
    set_account_balance(
        block_env.state, sender, U256(sender_balance_after_gas_fee)
    )

    access_list_addresses = set()
    access_list_storage_keys = set()
    if isinstance(tx, (AccessListTransaction, FeeMarketTransaction)):
        for access in tx.access_list:
            access_list_addresses.add(access.account)
            for slot in access.slots:
                access_list_storage_keys.add((access.account, slot))

    tx_env = vm.TransactionEnvironment(
        origin=sender,
        gas_price=effective_gas_price,
        gas=gas,
        access_list_addresses=access_list_addresses,
        access_list_storage_keys=access_list_storage_keys,
        index_in_block=index,
        tx_hash=get_transaction_hash(encode_transaction(tx)),
        traces=[],
    )

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    tx_gas_used_before_refund = tx.gas - tx_output.gas_left
    tx_gas_refund = min(
        tx_gas_used_before_refund // Uint(5), Uint(tx_output.refund_counter)
    )
    tx_gas_used_after_refund = tx_gas_used_before_refund - tx_gas_refund
    tx_gas_left = tx.gas - tx_gas_used_after_refund
    gas_refund_amount = tx_gas_left * effective_gas_price

    # For non-1559 transactions effective_gas_price == tx.gas_price
    priority_fee_per_gas = effective_gas_price - block_env.base_fee_per_gas
    transaction_fee = tx_gas_used_after_refund * priority_fee_per_gas

    # refund gas
    sender_balance_after_refund = get_account(
        block_env.state, sender
    ).balance + U256(gas_refund_amount)
    set_account_balance(block_env.state, sender, sender_balance_after_refund)

    # transfer miner fees
    coinbase_balance_after_mining_fee = get_account(
        block_env.state, block_env.coinbase
    ).balance + U256(transaction_fee)
    if coinbase_balance_after_mining_fee != 0:
        set_account_balance(
            block_env.state,
            block_env.coinbase,
            coinbase_balance_after_mining_fee,
        )
    elif account_exists_and_is_empty(block_env.state, block_env.coinbase):
        destroy_account(block_env.state, block_env.coinbase)

    for address in tx_output.accounts_to_delete:
        destroy_account(block_env.state, address)

    destroy_touched_empty_accounts(block_env.state, tx_output.touched_accounts)

    block_output.block_gas_used += tx_gas_used_after_refund

    receipt = make_receipt(
        tx, tx_output.error, block_output.block_gas_used, tx_output.logs
    )

    receipt_key = rlp.encode(Uint(index))
    block_output.receipt_keys += (receipt_key,)

    trie_set(
        block_output.receipts_trie,
        receipt_key,
        receipt,
    )

    block_output.block_logs += tx_output.logs
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt correctly identifies the need for a comprehensive benchmarking framework, including micro and macro benchmarks. The provided `BenchmarkManager` and `StatisticalAnalyzer` structs are a solid foundation.

However, one correction and one clarification for the prompt:

1.  **Correction on `op_...` functions**: The prompt implies that `op_*` functions are being added or modified. In reality, the `op_*` functions in `src/evm/execution/*.zig` are part of the existing EVM implementation. The benchmarking framework will *call* these functions, not redefine them. The goal is to measure the performance of these existing opcode implementations.
2.  **Clarification on `run_all_benchmarks`**: The `run_all_benchmarks` function will need to orchestrate the setup of `Evm` and `Contract` contexts for each benchmark. This involves creating an `Evm` instance, setting up the stack and memory with appropriate data for the benchmarked opcode (for micro-benchmarks), or setting up a full transaction context (for macro-benchmarks), and then calling the respective execution function. The provided `execution-specs` snippets show exactly how to set up the `Evm` context (`Evm` and `Message` dataclasses) and how individual opcode functions (`add`, `sstore`, etc.) are invoked.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/metrics.go">
```go
// CollectProcessMetrics periodically collects various metrics about the running process.
func CollectProcessMetrics(refresh time.Duration) {
	// Short circuit if the metrics system is disabled
	if !metricsEnabled {
		return
	}

	// Create the various data collectors
	var (
		cpustats  = make([]CPUStats, 2)
		diskstats = make([]DiskStats, 2)
		rstats    = make([]runtimeStats, 2)
	)
	// ... (metric definitions) ...
	var (
		cpuSysLoad            = GetOrRegisterGauge("system/cpu/sysload", DefaultRegistry)
		cpuSysWait            = GetOrRegisterGauge("system/cpu/syswait", DefaultRegistry)
		cpuProcLoad           = GetOrRegisterGauge("system/cpu/procload", DefaultRegistry)
		// ... more metrics
	)

	var lastCollectTime time.Time

	// Iterate loading the different stats and updating the meters.
	now, prev := 0, 1
	for ; ; now, prev = prev, now {
		// Gather CPU times.
		ReadCPUStats(&cpustats[now])
		collectTime := time.Now()
		secondsSinceLastCollect := collectTime.Sub(lastCollectTime).Seconds()
		lastCollectTime = collectTime
		if secondsSinceLastCollect > 0 {
			sysLoad := cpustats[now].GlobalTime - cpustats[prev].GlobalTime
			sysWait := cpustats[now].GlobalWait - cpustats[prev].GlobalWait
			procLoad := cpustats[now].LocalTime - cpustats[prev].LocalTime
			// Convert to integer percentage.
			cpuSysLoad.Update(int64(sysLoad / secondsSinceLastCollect * 100))
			cpuSysWait.Update(int64(sysWait / secondsSinceLastCollect * 100))
			cpuProcLoad.Update(int64(procLoad / secondsSinceLastCollect * 100))
			// ...
		}

		// Go runtime metrics
		readRuntimeStats(&rstats[now])
		// ...

		time.Sleep(refresh)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/histogram.go">
```go
type HistogramSnapshot interface {
	Count() int64
	Max() int64
	Mean() float64
	Min() int64
	Percentile(float64) float64
	Percentiles([]float64) []float64
	Size() int
	StdDev() float64
	Sum() int64
	Variance() float64
}

// Histogram calculates distribution statistics from a series of int64 values.
type Histogram interface {
	Clear()
	Update(int64)
	Snapshot() HistogramSnapshot
}

// StandardHistogram is the standard implementation of a Histogram and uses a
// Sample to bound its memory use.
type StandardHistogram struct {
	sample Sample
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/sample.go">
```go
// Sample maintains a statistically-significant selection of values from
// a stream.
type Sample interface {
	Snapshot() *sampleSnapshot
	Clear()
	Update(int64)
}

// sampleSnapshot is a read-only copy of a Sample.
type sampleSnapshot struct {
	count  int64
	values []int64

	max      int64
	min      int64
	mean     float64
	sum      int64
	variance float64
}

// Mean returns the mean value at the time the snapshot was taken.
func (s *sampleSnapshot) Mean() float64 { return s.mean }

// Percentiles returns a slice of arbitrary percentiles of values at the time
// the snapshot was taken.
func (s *sampleSnapshot) Percentiles(ps []float64) []float64 {
	return CalculatePercentiles(s.values, ps)
}

// StdDev returns the standard deviation of values at the time the snapshot was
// taken.
func (s *sampleSnapshot) StdDev() float64 {
	if s.variance == 0.0 {
		s.variance = SampleVariance(s.mean, s.values)
	}
	return math.Sqrt(s.variance)
}

// ExpDecaySample is an exponentially-decaying sample using a forward-decaying
// priority reservoir.
type ExpDecaySample struct {
    // ...
}

// UniformSample implements a uniform sample using Vitter's Algorithm R.
type UniformSample struct {
	count         int64
	mutex         sync.Mutex
	reservoirSize int
	values        []int64
	rand          *rand.Rand
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
// MeterSnapshot is a read-only copy of the meter's internal values.
type MeterSnapshot struct {
	count                          int64
	rate1, rate5, rate15, rateMean float64
}

// Rate1 returns the one-minute moving average rate of events per second at the
// time the snapshot was taken.
func (m *MeterSnapshot) Rate1() float64 { return m.rate1 }

// RateMean returns the meter's mean rate of events per second at the time the
// snapshot was taken.
func (m *MeterSnapshot) RateMean() float64 { return m.rateMean }

// Meter count events to produce exponentially-weighted moving average rates
// at one-, five-, and fifteen-minutes and a mean rate.
type Meter struct {
	count     atomic.Int64
	uncounted atomic.Int64 // not yet added to the EWMAs
	rateMean  atomic.Uint64

	a1, a5, a15 *EWMA
	startTime   time.Time
	stopped     atomic.Bool
}

// Mark records the occurrence of n events.
func (m *Meter) Mark(n int64) {
	m.uncounted.Add(n)
}

// Snapshot returns a read-only copy of the meter.
func (m *Meter) Snapshot() *MeterSnapshot {
	return &MeterSnapshot{
		count:    m.count.Load() + m.uncounted.Load(),
		rate1:    m.a1.Snapshot().Rate(),
		rate5:    m.a5.Snapshot().Rate(),
		rate15:   m.a15.Snapshot().Rate(),
		rateMean: math.Float64frombits(m.rateMean.Load()),
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/timer.go">
```go
// Timer captures the duration and rate of events, using a Histogram and a Meter.
type Timer struct {
	histogram Histogram
	meter     *Meter
	mutex     sync.Mutex
}

// Time record the duration of the execution of the given function.
func (t *Timer) Time(f func()) {
	ts := time.Now()
	f()
	t.Update(time.Since(ts))
}

// Update the duration of an event, in nanoseconds.
func (t *Timer) Update(d time.Duration) {
	t.mutex.Lock()
	defer t.mutex.Unlock()
	t.histogram.Update(d.Nanoseconds())
	t.meter.Mark(1)
}

// TimerSnapshot is a read-only copy of another Timer.
type TimerSnapshot struct {
	histogram HistogramSnapshot
	meter     *MeterSnapshot
}

// ... methods to access histogram and meter snapshots ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/registry.go">
```go
// A Registry holds references to a set of metrics by name and can iterate
// over them, calling callback functions provided by the user.
type Registry interface {
	// Each call the given function for each registered metric.
	Each(func(string, interface{}))

	// Get the metric by the given name or nil if none is registered.
	Get(string) interface{}

	// GetOrRegister gets an existing metric or registers the given one.
	GetOrRegister(string, interface{}) interface{}

	// Register the given metric under the given name.
	Register(string, interface{}) error

	// Unregister the metric with the given name.
	Unregister(string)
    // ...
}

// StandardRegistry the standard implementation of a Registry uses sync.map
// of names to metrics.
type StandardRegistry struct {
	metrics sync.Map
}

// GetAll metrics in the Registry
func (r *StandardRegistry) GetAll() map[string]map[string]interface{} {
	data := make(map[string]map[string]interface{})
	r.Each(func(name string, i interface{}) {
		values := make(map[string]interface{})
		switch metric := i.(type) {
		case *Counter:
			values["count"] = metric.Snapshot().Count()
		case Histogram:
			h := metric.Snapshot()
			ps := h.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
			values["count"] = h.Count()
			values["min"] = h.Min()
			values["max"] = h.Max()
			values["mean"] = h.Mean()
			values["stddev"] = h.StdDev()
			values["median"] = ps[0]
			// ...
		case *Meter:
			m := metric.Snapshot()
			values["count"] = m.Count()
			values["1m.rate"] = m.Rate1()
			// ...
		case *Timer:
			t := metric.Snapshot()
			ps := t.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
			values["count"] = t.Count()
			values["mean"] = t.Mean()
			// ...
		}
		data[name] = values
	})
	return data
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/log.go">
```go
// LogScaled outputs each metric in the given registry periodically using the given
// logger. Print timings in `scale` units (eg time.Millisecond) rather than nanos.
func LogScaled(r Registry, freq time.Duration, scale time.Duration, l Logger) {
	du := float64(scale)
	duSuffix := scale.String()[1:]

	for range time.Tick(freq) {
		r.Each(func(name string, i interface{}) {
			switch metric := i.(type) {
			// ...
			case Histogram:
				h := metric.Snapshot()
				ps := h.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
				l.Printf("histogram %s\n", name)
				l.Printf("  count:       %9d\n", h.Count())
				l.Printf("  min:         %9d\n", h.Min())
				l.Printf("  max:         %9d\n", h.Max())
				l.Printf("  mean:        %12.2f\n", h.Mean())
				l.Printf("  stddev:      %12.2f\n", h.StdDev())
				l.Printf("  median:      %12.2f\n", ps[0])
				l.Printf("  75%%:         %12.2f\n", ps[1])
				l.Printf("  95%%:         %12.2f\n", ps[2])
				l.Printf("  99%%:         %12.2f\n", ps[3])
				l.Printf("  99.9%%:       %12.2f\n", ps[4])
			case *Meter:
				m := metric.Snapshot()
				l.Printf("meter %s\n", name)
				l.Printf("  count:       %9d\n", m.Count())
				l.Printf("  1-min rate:  %12.2f\n", m.Rate1())
				l.Printf("  5-min rate:  %12.2f\n", m.Rate5())
				l.Printf("  15-min rate: %12.2f\n", m.Rate15())
				l.Printf("  mean rate:   %12.2f\n", m.RateMean())
			// ...
			}
		})
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/runner.go">
```go
type execStats struct {
	Time           time.Duration `json:"time"`           // The execution Time.
	Allocs         int64         `json:"allocs"`         // The number of heap allocations during execution.
	BytesAllocated int64         `json:"bytesAllocated"` // The cumulative number of bytes allocated during execution.
	GasUsed        uint64        `json:"gasUsed"`        // the amount of gas used during execution
}

func timedExec(bench bool, execFunc func() ([]byte, uint64, error)) ([]byte, execStats, error) {
	if bench {
		testing.Init()
		// Do one warm-up run
		output, gasUsed, err := execFunc()
		result := testing.Benchmark(func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				haveOutput, haveGasUsed, haveErr := execFunc()
				if !bytes.Equal(haveOutput, output) {
					panic(fmt.Sprintf("output differs\nhave %x\nwant %x\n", haveOutput, output))
				}
				if haveGasUsed != gasUsed {
					panic(fmt.Sprintf("gas differs, have %v want %v", haveGasUsed, gasUsed))
				}
				if haveErr != err {
					panic(fmt.Sprintf("err differs, have %v want %v", haveErr, err))
				}
			}
		})
		// Get the average execution time from the benchmarking result.
		// There are other useful stats here that could be reported.
		stats := execStats{
			Time:           time.Duration(result.NsPerOp()),
			Allocs:         result.AllocsPerOp(),
			BytesAllocated: result.AllocedBytesPerOp(),
			GasUsed:        gasUsed,
		}
		return output, stats, err
	}
    // ... non-bench path ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/staterunner.go">
```go
// runStateTest loads the state-test given by fname, and executes the test.
func runStateTest(ctx *cli.Context, fname string) ([]testResult, error) {
	src, err := os.ReadFile(fname)
	if err != nil {
		return nil, err
	}
	var testsByName map[string]tests.StateTest
	if err := json.Unmarshal(src, &testsByName); err != nil {
		return nil, fmt.Errorf("unable to read test file %s: %w", fname, err)
	}

	cfg := vm.Config{Tracer: tracerFromFlags(ctx)}
	// ... regex and fork filtering ...
	
	// Iterate over all the tests, run them and aggregate the results
	results := make([]testResult, 0, len(testsByName))
	for key, test := range testsByName {
        // ...
		for i, st := range test.Subtests() {
            // ...
			result := &testResult{Name: key, Fork: st.Fork, Pass: true}
			test.Run(st, cfg, false, rawdb.HashScheme, func(err error, state *tests.StateTestState) {
				// ...
				// Collect bench stats if requested.
				if ctx.Bool(BenchFlag.Name) {
					_, stats, _ := timedExec(true, func() ([]byte, uint64, error) {
						_, _, gasUsed, _ := test.RunNoVerify(st, cfg, false, rawdb.HashScheme)
						return nil, gasUsed, nil
					})
					result.Stats = &stats
				}
				// ...
			})
			results = append(results, *result)
		}
	}
	return results, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/reporter.go">
```go
// testResult contains the execution status after running a state test, any
// error that might have occurred and a dump of the final state if requested.
type testResult struct {
	Name  string       `json:"name"`
	Pass  bool         `json:"pass"`
	Root  *common.Hash `json:"stateRoot,omitempty"`
	Fork  string       `json:"fork"`
	Error string       `json:"error,omitempty"`
	State *state.Dump  `json:"state,omitempty"`
	Stats *execStats   `json:"benchStats,omitempty"`
}

func (r testResult) String() string {
	var status string
	if r.Pass {
		status = fmt.Sprintf("[%s]", PASS)
	} else {
		status = fmt.Sprintf("[%s]", FAIL)
	}
	// ...
	out := fmt.Sprintf("%s %s%s", status, info, extra)
	if r.State != nil {
		state, _ := json.MarshalIndent(r.State, "", "  ")
		out += "\n" + string(state)
	}
	return out
}

// report prints the after-test summary.
func report(ctx *cli.Context, results []testResult) {
	if ctx.Bool(HumanReadableFlag.Name) {
		pass := 0
		for _, r := range results {
			if r.Pass {
				pass++
			}
		}
		for _, r := range results {
			fmt.Println(r)
		}
		fmt.Println("--")
		fmt.Printf("%d tests passed, %d tests failed.\n", pass, len(results)-pass)
		return
	}
	out, _ := json.MarshalIndent(results, "", "  ")
	fmt.Println(string(out))
}
```
</file>
</go-ethereum>
```

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions_test.go">
```go
// opBenchmark is a helper function for benchmarking EVM opcodes. It sets up a
// minimal EVM environment, stack, and scope, then executes the specified opcode
// `bench.N` times. This pattern is ideal for creating micro-benchmarks for
// individual EVM instructions.
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

// These benchmarks demonstrate how to use the `opBenchmark` helper to test
// specific opcodes with varying input sizes. This allows for detailed performance
// analysis of individual arithmetic operations.
func BenchmarkOpAdd(b *testing.B) {
	opBenchmark(b, opAdd, "01", "02")
}

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

func BenchmarkOpAdd256(b *testing.B) {
	x := "fd37f3e2bba2c4ddafd37f3e2bba2c4d"
	y := "ffffffffffffffffffffffffffffffff"
	opBenchmark(b, opAdd, x, y)
}

// These benchmarks show how to test stateful opcodes like SLOAD and SSTORE.
// They require more setup within the benchmark function to prepare the StateDB
// with the necessary account and storage data before running the opcode. This
// pattern is essential for accurately benchmarking operations that interact
// with world state.
func BenchmarkOpSload(b *testing.B) {
	state, _ := state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	sloadBenchmark(b, state)
}

func BenchmarkOpSloadCold(b *testing.B) {
	state, _ := state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	for i := 0; i < b.N; i++ {
		state.Finalise(false) // clear journal
		sloadBenchmark(b, state)
	}
}

func BenchmarkOpSstore(b *testing.B) {
	for _, contract := range []struct {
		name string
		f    func(b *testing.B)
	}{
		{"Set", sstoreSetBenchmark},
		{"Reset", sstoreResetBenchmark},
		{"Clear", sstoreClearBenchmark},
	} {
		b.Run(contract.name, contract.f)
	}
}

func sloadBenchmark(b *testing.B, statedb *state.StateDB) {
	var (
		stack    = newstack()
		testaddr = common.HexToAddress("0xaa")
		slot     = common.HexToHash("0x01")
		evm      = NewEVM(BlockContext{}, statedb, params.TestChainConfig, Config{})
		scope    = &ScopeContext{nil, stack, nil}
	)
	statedb.SetState(testaddr, slot, common.HexToHash("0x01"))
	stack.push(new(uint256.Int).SetBytes(slot.Bytes()))
	pc := uint64(0)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		scope.Contract.Address()
		opSload(&pc, evm.interpreter, scope)
		stack.pop() // pop result
		stack.push(new(uint256.Int).SetBytes(slot.Bytes()))
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/bench_test.go">
```go
// These benchmarks demonstrate how to create macro-benchmarks for entire
// processes like chain insertion. Different functions are created for
// different workloads (empty blocks, blocks with value transfers, etc.)
// to test performance under various conditions.
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

// `benchInsertChain` is the core helper function for macro-benchmarking. It
// sets up a test blockchain and database, generates a chain of blocks with a
// specified transaction workload, and then measures the time it takes to
// insert that chain. This is a model for end-to-end performance validation.
func benchInsertChain(b *testing.B, verkle bool, txGen func(int, int) *types.Transaction) {
	var (
		gspec    = &Genesis{Config: params.TestChainConfig}
		engine   = ethash.NewFaker()
		database = rawdb.NewMemoryDatabase()
		statedb  *state.StateDB
		root     common.Hash
	)
	if verkle {
		gspec.Config.VerkleTime = new(uint64)
		root, _ = verkle.BuildFromAccounts(rawdb.NewMemoryDatabase(), gspec.Alloc.Accounts(), nil)
	} else {
		tr, _ := trie.New(trie.TrieID(common.Hash{}), trie.NewDatabase(database, nil))
		statedb, _ = state.New(common.Hash{}, state.NewDatabaseWithNodeDB(database, tr.NodeDB()), nil)
		gspec.MustCommit(database, statedb)
		root = statedb.Root()
	}

	blocks := makeBlocks(b.N, gspec, database, engine, root, txGen)
	b.ReportAllocs()
	b.ResetTimer()

	// Create a new blockchain to run the benchmark against
	chain, _ := NewBlockChain(rawdb.NewMemoryDatabase(), nil, gspec, nil, engine, vm.Config{}, nil)
	defer chain.Stop()

	if _, err := chain.InsertChain(blocks); err != nil {
		b.Fatalf("failed to insert chain: %v", err)
	}
}

// `makeBlocks` generates a chain of blocks for benchmarking. It's a key part
// of the setup for macro-benchmarks, creating the data that will be processed.
func makeBlocks(n int, gspec *Genesis, db ethdb.Database, engine consensus.Engine, root common.Hash, txGen func(i, j int) *types.Transaction) types.Blocks {
	blocks, _ := GenerateChain(gspec.Config, gspec.ToBlock(), engine, db, n, func(i int, gen *BlockGen) {
		gen.SetCoinbase(testCoinbase)
		gen.header.Root = root
		if txGen != nil {
			for j := 0; j < 1; j++ {
				tx := txGen(i, j)
				gen.AddTx(tx)
			}
		}
	})
	return blocks
}

// These helper functions generate different types of transactions for use in
// macro-benchmarks. This allows for testing the EVM's performance with varied
// and realistic workloads, from simple value transfers to complex contract
// interactions.
var (
	testKey, _  = crypto.HexToECDSA("b71c71a67e1177ad4e901695e1b4b9ee17ae16c6668d313eac2f96dbcda3f291")
	testAddr    = crypto.PubkeyToAddress(testKey.PublicKey)
	testCoinbase = common.Address{0: 0x22, 19: 0x33}
	testSigner  = types.LatestSignerForChainID(big.NewInt(1))
)

// genValueTx creates a value-transfer transaction.
func genValueTx(dataSize int) func(i, j int) *types.Transaction {
	return func(i, j int) *types.Transaction {
		var to common.Address
		to[0] = byte(i)
		to[1] = byte(j)

		var data []byte
		if dataSize > 0 {
			data = make([]byte, dataSize)
			for i := range data {
				data[i] = byte(i)
			}
		}
		tx, _ := types.SignNewTx(testKey, testSigner, &types.LegacyTx{
			Nonce:    uint64(i),
			GasPrice: big.NewInt(1000),
			Gas:      25000,
			To:       &to,
			Value:    big.NewInt(1000),
			Data:     data,
		})
		return tx
	}
}

// genTxRing creates a chain of transactions where each one sends to the next.
// This is used to create a large number of accounts and test performance with
// a wide state.
func genTxRing(n int) func(i, j int) *types.Transaction {
	addrs := make([]common.Address, n)
	keys := make([]*ecdsa.PrivateKey, n)
	for i := 0; i < n; i++ {
		keys[i], _ = crypto.GenerateKey()
		addrs[i] = crypto.PubkeyToAddress(keys[i].PublicKey)
	}

	// first address gets some money
	genesis := &Genesis{
		Config: params.TestChainConfig,
		Alloc:  GenesisAlloc{addrs[0]: {Balance: big.NewInt(1000000000000000000)}},
	}
	db := rawdb.NewMemoryDatabase()
	genesis.Commit(db, nil)

	return func(i, j int) *types.Transaction {
		from := i % n
		to := (i + 1) % n
		tx, _ := types.SignNewTx(keys[from], testSigner, &types.LegacyTx{
			Nonce:    0,
			GasPrice: big.NewInt(10000),
			Gas:      21000,
			To:       &addrs[to],
			Value:    big.NewInt(1000),
		})
		return tx
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm_test.go">
```go
// This benchmark executes a well-known, compute-intensive smart contract (Fibonacci).
// It demonstrates how to benchmark the full contract execution lifecycle, including
// state setup, EVM interpretation, and result validation. This is a form of macro-
// benchmark focused on a single contract's performance.
func BenchmarkFibonacci(b *testing.B) {
	state, _ := state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)

	// The contract is a simple fibonacci generator
	// contract Fib {
	//	 function fib(uint a) constant returns (uint) {
	//		 if (a == 0) {
	//			 return 0;
	//		 } else if (a == 1) {
	//			 return 1;
	//		 } else {
	//			 return fib(a - 1) + fib(a - 2);
	//		 }
	//	 }
	// }
	// 606060405260678060106000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480630c1412f9146037576035565b005b604b6002565b600435600057156000f35b600435600157156001f35b60003560016024565b816001600083815b919050909102036029565b905091905056
	// 0c1412f9 = sha3(fib(uint256))[:4]
	data := common.Hex2Bytes("606060405260678060106000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480630c1412f9146037576035565b005b604b6002565b600435600057156000f35b600435600157156001f35b60003560016024565b816001600083815b919050909102036029565b905091905056")
	benchmarkContract(b, state, data)
}

// `benchmarkContract` is a helper that encapsulates the common logic for running
// a contract benchmark. It creates an EVM, sets up the contract code and input,
// and then runs the interpreter loop `b.N` times.
func benchmarkContract(b *testing.B, statedb *state.StateDB, data []byte) {
	var (
		to    = common.Address{1}
		from  = common.Address{2}
		value = new(uint256.Int)
		gas   = uint64(10000000)
	)

	// fib(10)
	// Method ID: 0x0c1412f9
	// Arg 1: 000000000000000000000000000000000000000000000000000000000000000a
	input := common.Hex2Bytes("0c1412f9000000000000000000000000000000000000000000000000000000000000000a")

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		evm := NewEVM(BlockContext{}, statedb, params.TestChainConfig, Config{})
		evm.stateDB.SetCode(to, data)

		// The benchmark is about the pure execution of the EVM, so we "pre-warm"
		// the state so that there are no one-time costs included in the benchmark
		evm.stateDB.SetBalance(from, testAddr, new(uint256.Int).SetUint64(10000000000000000))
		evm.stateDB.Prepare(Rules{}, from, common.Address{}, &to, ActivePrecompiles(Rules{}), nil)

		ret, _, err := evm.Call(from, to, input, gas, value)
		if err != nil {
			b.Fatal(err)
		}
		// fib(10) = 55
		if res := new(uint256.Int).SetBytes(ret); res.Uint64() != 55 {
			b.Fatalf("invalid return value: have %d, want %d", res, 55)
		}
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions_test.go">
```go
// opBenchmark is a helper function for benchmarking EVM opcodes. It sets up the
// necessary EVM context (EVM, stack, scope) and repeatedly executes the given
// operation within the Go testing.B benchmark loop. This pattern is ideal for
// creating isolated micro-benchmarks for individual opcodes.
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

// Example usage of the opBenchmark helper to create specific benchmarks for
// the ADD opcode with different sized inputs (64-bit and 256-bit).
func BenchmarkOpAdd64(b *testing.B) {
	x := "ffffffff"
	y := "fd37f3e2"
	opBenchmark(b, opAdd, x, y)
}

func BenchmarkOpAdd256(b *testing.B) {
	x := "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
	y := "fd37f3e2bba2c4dd22ac32598325e6f3165b4365191d84814b7e4512e61a33a0"
	opBenchmark(b, opAdd, x, y)
}

// Example of a benchmark for the MSTORE opcode, demonstrating how to
// prepare the memory and stack for the operation.
func BenchmarkOpMstore(b *testing.B) {
	var (
		evm   = NewEVM(BlockContext{}, nil, params.TestChainConfig, Config{})
		stack = newstack()
		mem   = NewMemory()
		scope = &ScopeContext{mem, stack, nil}
	)
	val := common.Hex2Bytes("000000000000000000000000000000000000000000000000000000000000000f")
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		stack.push(new(uint256.Int).SetBytes(val))
		stack.push(new(uint256.Int).SetUint64(0))

		opMstore(&evm.interpreter.pc, evm.interpreter, scope)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts_test.go">
```go
// benchmarkSstore is a helper for benchmarking the SSTORE opcode under various
// conditions (e.g., writing to a new slot, resetting a slot). This is a more
// advanced pattern for testing stateful operations where gas costs are dynamic.
func benchmarkSstore(b *testing.B, code []byte) {
	statedb, _ := state.New(common.Hash{}, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)

	from := common.HexToAddress("0xaa")
	to := common.HexToAddress("0xbb")

	var (
		vmenv    = NewEVM(BlockContext{}, TxContext{From: from}, statedb, params.TestChainConfig, Config{})
		sender   = vm.AccountRef(from)
		contract = NewContract(sender, vm.AccountRef(to), new(big.Int), 10000000)
	)
	contract.SetCallCode(&to, to, code) // Don't remove, need the code for execution

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		// statedb needs to be reset, otherwise we're not benchmarking the same
		// thing every time
		statedb.RevertToSnapshot(0)
		vmenv.StateDB = statedb
		vmenv.Call(sender, to, nil, contract.Gas, contract.Value)
	}
}

// BenchmarkSstore uses the benchmark helper to create a suite of sub-benchmarks
// for SSTORE, covering different state-change scenarios, each with a very different
// performance profile. This demonstrates how to structure complex benchmarks.
func BenchmarkSstore(b *testing.B) {
	b.Run("noop", func(b *testing.B) {
		// Setting storage to the same value
		benchmarkSstore(b, sstoreCode(big.NewInt(1), big.NewInt(1)))
	})
	b.Run("create", func(b *testing.B) {
		// Setting storage from zero to non-zero
		benchmarkSstore(b, sstoreCode(big.NewInt(0), big.NewInt(1)))
	})
	b.Run("reset", func(b *testing.B) {
		// Setting storage from non-zero to a different non-zero value
		benchmarkSstore(b, sstoreCode(big.NewInt(1), big.NewInt(2)))
	})
	b.Run("clear", func(b *testing.B) {
		// Setting storage from non-zero to a zero value
		benchmarkSstore(b, sstoreCode(big.NewInt(1), big.NewInt(0)))
	})
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiled_contracts_test.go">
```go
// Example of benchmarking a precompiled contract (blake2f). This pattern is
// different from opcode benchmarking as it involves preparing input data and calling
// the precompile's `Run` method directly.
func BenchmarkBlake2f(b *testing.B) {
	var (
		p = blake2f{}
		// from EIP-152#test-case-2
		in = common.Hex2Bytes("0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
	)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		p.Run(in)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/bench_test.go">
```go
// benchInsertChain is a helper function for creating macro-benchmarks that
// test the performance of inserting a chain of blocks into the blockchain. It
// handles database setup, chain generation, and the core benchmarking loop.
// The `work` function allows customization of the transactions within each block.
func benchInsertChain(b *testing.B, memonly bool, work func(int, *BlockGen)) {
	db := rawdb.NewMemoryDatabase()
	if !memonly {
		dir := b.TempDir()
		ldb, err := rawdb.NewLevelDBDatabase(dir, 0, 0, "", false)
		if err != nil {
			b.Fatal(err)
		}
		db = ldb
	}

	gspec := &Genesis{
		Config: params.TestChainConfig,
		Alloc:  GenesisAlloc{benchAddress: {Balance: benchBalance}},
	}
	genesis := gspec.ToBlock(nil)
	engine := ethash.NewFaker()

	// Generate the chain.
	chain, _ := GenerateChain(gspec.Config, genesis, engine, db, b.N, work)
	b.ReportAllocs()
	b.SetBytes(int64(rawdb.GetDatabaseSize(db)))
	b.ResetTimer()

	// Import the chain.
	blockchain, _ := NewBlockChain(db, nil, gspec, nil, engine, vm.Config{}, nil)
	defer blockchain.Stop()
	if _, err := blockchain.InsertChain(chain); err != nil {
		b.Fatalf("inserting chain failed: %v", err)
	}
}

// Example macro-benchmarks that use the benchInsertChain helper to test
// different block processing workloads. This shows how to build a suite
// of macro-benchmarks to cover various real-world scenarios.
func BenchmarkInsertChain_empty_memdb(b *testing.B) {
	benchInsertChain(b, true, nil)
}
func BenchmarkInsertChain_valueTx_memdb(b *testing.B) {
	benchInsertChain(b, true, genValueTx(0))
}
func BenchmarkInsertChain_valueTx_100kB_memdb(b *testing.B) {
	benchInsertChain(b, true, genValueTx(100*1024))
}
func BenchmarkInsertChain_ring200_memdb(b *testing.B) {
	benchInsertChain(b, true, genTxRing(200))
}
func BenchmarkInsertChain_ring1000_memdb(b *testing.B) {
	benchInsertChain(b, true, genTxRing(1000))
}
func BenchmarkInsertChain_empty(b *testing.B) {
	benchInsertChain(b, false, nil)
}
func BenchmarkInsertChain_valueTx(b *testing.B) {
	benchInsertChain(b, false, genValueTx(0))
}
func BenchmarkInsertChain_valueTx_100kB(b *testing.B) {
	benchInsertChain(b, false, genValueTx(100*1024))
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_test.go">
```go
// BenchmarkStateDB provides a benchmark for raw StateDB performance, testing
// account creation and balance retrieval. This is a good example of a focused
// component-level benchmark.
func BenchmarkStateDB(b *testing.B) {
	db := state.NewDatabase(rawdb.NewMemoryDatabase())

	for _, n := range []int{100, 1000, 10000} {
		addrs := make([]common.Address, n)
		for i := 0; i < n; i++ {
			addrs[i][0] = byte(i)
			addrs[i][1] = byte(i >> 8)
		}
		b.Run(fmt.Sprintf("Create-N=%d", n), func(b *testing.B) {
			benchmarkStateDBWrites(b, db, addrs)
		})
		b.Run(fmt.Sprintf("Get-N=%d", n), func(b *testing.B) {
			benchmarkStateDBReads(b, db, addrs)
		})
	}
}

// benchmarkStateDBWrites is a helper that populates a StateDB with accounts.
func benchmarkStateDBWrites(b *testing.B, db state.Database, addrs []common.Address) {
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		s, _ := state.New(common.Hash{}, db, nil)
		for _, addr := range addrs {
			s.CreateAccount(addr)
			s.SetBalance(addr, benchBalance)
		}
		b.StopTimer()
		s.Commit(false)
		b.StartTimer()
	}
}

// benchmarkStateDBReads is a helper that reads balances from a pre-populated StateDB.
func benchmarkStateDBReads(b *testing.B, db state.Database, addrs []common.Address) {
	s, _ := state.New(common.Hash{}, db, nil)
	for _, addr := range addrs {
		s.CreateAccount(addr)
		s.SetBalance(addr, benchBalance)
	}
	root, _ := s.Commit(false)
	b.ReportAllocs()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		s, _ := state.New(root, db, nil)
		for _, addr := range addrs {
			s.GetBalance(addr)
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/blockchain_test.go">
```go
// BenchmarkHeaderVerification provides an example of a focused macro-benchmark,
// testing only the header verification component of block processing.
func BenchmarkHeaderVerification(b *testing.B) {
	var (
		gspec = &Genesis{
			Config: params.MainnetChainConfig,
			Alloc:  decodeGenesisAlloc(mainnetAllocData),
		}
		engine = ethash.NewFaker()
	)
	blocks, _ := GenerateChain(gspec.Config, gspec.ToBlock(nil), engine, rawdb.NewMemoryDatabase(), b.N, nil)

	b.ResetTimer()

	blockchain, _ := NewBlockChain(rawdb.NewMemoryDatabase(), nil, gspec, nil, engine, vm.Config{}, nil)
	defer blockchain.Stop()

	for _, block := range blocks {
		if err := blockchain.engine.VerifyHeader(blockchain, block.Header(), true); err != nil {
			b.Fatalf("block %d failed verification: %v", block.NumberU64(), err)
		}
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions_test.go">
```go
func benchmarkSStore(b *testing.B, parallel int) {
	var (
		statedb, _   = state.New(types.EmptyRootHash, state.NewDatabaseForTesting())
		evm          = NewEVM(BlockContext{}, statedb, params.TestChainConfig, Config{})
		address      = common.Address{1}
		keys, values = make([]common.Hash, 100), make([]common.Hash, 100)
	)
	for i := 0; i < len(keys); i++ {
		keys[i] = common.BytesToHash([]byte{byte(i)})
		values[i] = common.BytesToHash([]byte{byte(i)})
	}
	statedb.CreateAccount(address)

	// Create a new scope for the contract since we need to add the contract to the scope.
	contract := NewContract(common.Address{}, address, new(uint256.Int), 10000000, nil)

	b.SetParallelism(parallel)
	b.ResetTimer()

	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			for i := 0; i < 100; i++ {
				// We need to create a new stack and scope for every run because the
				// stack and scope are mutated by the run.
				var (
					stack = newstack()
					scope = &ScopeContext{
						Memory:   NewMemory(),
						Stack:    stack,
						Contract: contract,
					}
					pc = uint64(0)
				)
				// Create the stack for the SSTORE operation
				stack.push(new(uint256.Int).SetBytes(values[i].Bytes()))
				stack.push(new(uint256.Int).SetBytes(keys[i].Bytes()))
				// Run the operation
				opSstore(&pc, evm.interpreter, scope)
				// Clean up the stack.
				returnStack(stack)
			}
		}
	})
}
func BenchmarkSStore(b *testing.B) {
	benchmarkSStore(b, 10)
}
func BenchmarkSStore100(b *testing.B) {
	benchmarkSStore(b, 100)
}
func BenchmarkSStore1000(b *testing.B) {
	benchmarkSStore(b, 1000)
}

func benchmarkCall(b *testing.B, contractCode []byte) {
	var (
		statedb, _ = state.New(types.EmptyRootHash, state.NewDatabaseForTesting())
		caller     = common.Address{1}
		address    = common.Address{2}
		gas        = uint64(10000000)
	)
	// setup the state db
	statedb.CreateAccount(caller)
	statedb.CreateAccount(address)
	statedb.SetCode(address, contractCode)

	// Create the contract and scope for the call.
	contract := NewContract(caller, address, new(uint256.Int), gas, nil)

	var (
		stack = newstack()
		mem   = NewMemory()
		scope = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		pc  = uint64(0)
		evm = NewEVM(BlockContext{
			CanTransfer: func(db StateDB, address common.Address, amount *uint256.Int) bool {
				return true
			},
			Transfer: func(db StateDB, sender, recipient common.Address, amount *uint256.Int) {},
		}, statedb, params.TestChainConfig, Config{})
	)
	// Since we are calling a contract, we need to push the arguments for the call
	// operation on the stack.
	stack.push(uint256.NewInt(0))    // ret len
	stack.push(uint256.NewInt(0))    // ret offset
	stack.push(uint256.NewInt(0))    // args len
	stack.push(uint256.NewInt(0))    // args offset
	stack.push(uint256.NewInt(0))    // value
	stack.push(new(uint256.Int).SetBytes(address.Bytes())) // address
	stack.push(uint256.NewInt(gas)) // gas

	// set the callGasTemp
	g, _ := gasCall(evm.chainRules.IsEIP150, contract.Gas, 666, stack.Back(0))
	evm.callGasTemp = g

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		opCall(&pc, evm.interpreter, scope)

		// Pop the success value from the stack.
		scope.Stack.pop()

		// Refill the stack for the next call.
		scope.Stack.push(uint256.NewInt(0)) // ret len
		scope.Stack.push(uint256.NewInt(0)) // ret offset
		scope.Stack.push(uint256.NewInt(0)) // args len
		scope.Stack.push(uint256.NewInt(0)) // args offset
		scope.Stack.push(uint256.NewInt(0)) // value
		scope.Stack.push(new(uint256.Int).SetBytes(address.Bytes()))
		scope.Stack.push(uint256.NewInt(gas))
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/bench_test.go">
```go
func benchInsertChain(b *testing.B, disk bool, gen func(int, *BlockGen)) {
	// Create the database in memory or in a temporary directory.
	var db ethdb.Database
	if !disk {
		db = rawdb.NewMemoryDatabase()
	} else {
		pdb, err := pebble.New(b.TempDir(), 128, 128, "", false)
		if err != nil {
			b.Fatalf("cannot create temporary database: %v", err)
		}
		db = rawdb.NewDatabase(pdb)
		defer db.Close()
	}
	// Generate a chain of b.N blocks using the supplied block
	// generator function.
	gspec := &Genesis{
		Config: params.TestChainConfig,
		Alloc:  types.GenesisAlloc{benchRootAddr: {Balance: benchRootFunds}},
	}
	_, chain, _ := GenerateChainWithGenesis(gspec, ethash.NewFaker(), b.N, gen)

	// Time the insertion of the new chain.
	// State and blocks are stored in the same DB.
	chainman, _ := NewBlockChain(db, nil, gspec, nil, ethash.NewFaker(), vm.Config{}, nil)
	defer chainman.Stop()
	b.ReportAllocs()
	b.ResetTimer()
	if i, err := chainman.InsertChain(chain); err != nil {
		b.Fatalf("insert error (block %d): %v\n", i, err)
	}
}

func BenchmarkStateDB_Random(b *testing.B) {
	db, _ := state.New(types.EmptyRootHash, state.NewDatabaseForTesting())

	addrs := make([]common.Address, 2000)
	for i := 0; i < len(addrs); i++ {
		addrs[i] = common.BytesToAddress([]byte{byte(i >> 8), byte(i)})
	}
	for _, addr := range addrs {
		db.AddBalance(addr, uint256.NewInt(1), tracing.BalanceChangeUnspecified)
	}
	db.Commit(0, false, false)

	rng := rand.New(rand.NewSource(0))
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		for j := 0; j < 100; j++ {
			addr := addrs[rng.Intn(len(addrs))]
			db.AddBalance(addr, uint256.NewInt(1), tracing.BalanceChangeUnspecified)
		}
		db.Commit(0, false, false)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts_test.go">
```go
func benchmarkPrecompiled(addr string, test precompiledTest, bench *testing.B) {
	if test.NoBenchmark {
		return
	}
	p := allPrecompiles[common.HexToAddress(addr)]
	in := common.Hex2Bytes(test.Input)
	reqGas := p.RequiredGas(in)

	var (
		res  []byte
		err  error
		data = make([]byte, len(in))
	)

	bench.Run(fmt.Sprintf("%s-Gas=%d", test.Name, reqGas), func(bench *testing.B) {
		bench.ReportAllocs()
		start := time.Now()
		bench.ResetTimer()
		for i := 0; i < bench.N; i++ {
			copy(data, in)
			res, _, err = RunPrecompiledContract(p, data, reqGas, nil)
		}
		bench.StopTimer()
		elapsed := uint64(time.Since(start))
		if elapsed < 1 {
			elapsed = 1
		}
		gasUsed := reqGas * uint64(bench.N)
		bench.ReportMetric(float64(reqGas), "gas/op")
		// Keep it as uint64, multiply 100 to get two digit float later
		mgasps := (100 * 1000 * gasUsed) / elapsed
		bench.ReportMetric(float64(mgasps)/100, "mgas/s")
		//Check if it is correct
		if err != nil {
			bench.Error(err)
			return
		}
		if common.Bytes2Hex(res) != test.Expected {
			bench.Errorf("Expected %v, got %v", test.Expected, common.Bytes2Hex(res))
			return
		}
	})
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions_test.go">
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

func BenchmarkOpAdd256(b *testing.B) {
	x := "ffffffffffffffffffffffffffffffff"
	y := "fd37f3e2bba2c4ddafd37f3e2bba2c4d"
	opBenchmark(b, opAdd, x, y)
}

func BenchmarkOpMul256(b *testing.B) {
	x := "ffffffffffffffffffffffffffffffff"
	y := "fd37f3e2bba2c4ddafd37f3e2bba2c4d"
	opBenchmark(b, opMul, x, y)
}

func BenchmarkOpDiv256(b *testing.B) {
	x := "ffffffffffffffffffffffffffffffff"
	y := "fd37f3e2bba2c4ddafd37f3e2bba2c4d"
	opBenchmark(b, opDiv, x, y)
}

func BenchmarkOpSdiv256(b *testing.B) {
	x := "80000000000000000000000000000000"
	y := "fffffffffffffffffffffffffffffffe"
	opBenchmark(b, opSdiv, x, y)
}

func BenchmarkOpExp(b *testing.B) {
	x := "fd37f3e2bba2c4ddafd37f3e2bba2c4d"
	y := "ffffffffffffffffffffffffffffffff"
	opBenchmark(b, opExp, x, y)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts_test.go">
```go
func benchmarkCreate(b *testing.B, code []byte, config vm.Config) {
	var (
		testAddress = common.BytesToAddress([]byte("contract"))
		caller      = common.BytesToAddress([]byte("caller"))
	)

	statedb, _ := state.New(types.EmptyRootHash, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	statedb.SetBalance(caller, uint256.NewInt(1000000000000000000))

	evm := vm.NewEVM(vm.BlockContext{}, vm.TxContext{Origin: caller, GasPrice: new(big.Int).SetUint64(0)}, statedb, params.TestChainConfig, config)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		statedb.SetAddress(testAddress, common.Hash{})
		statedb.SetCode(testAddress, nil)
		statedb.SetNonce(testAddress, 0)

		_, _, err := evm.Create(vm.AccountRef(caller), code, 10000000, new(uint256.Int))
		if err != nil {
			b.Fatal(err)
		}
		statedb.RevertToSnapshot(0)
	}
}

func benchmarkCall(b *testing.B, code []byte, config vm.Config, data []byte) {
	var (
		testAddress = common.BytesToAddress([]byte("contract"))
		caller      = common.BytesToAddress([]byte("caller"))
	)

	statedb, _ := state.New(types.EmptyRootHash, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
	statedb.SetBalance(caller, uint256.NewInt(1000000000000000000))
	statedb.SetCode(testAddress, code)

	evm := vm.NewEVM(vm.BlockContext{}, vm.TxContext{Origin: caller, GasPrice: new(big.Int).SetUint64(0)}, statedb, params.TestChainConfig, config)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _, err := evm.Call(vm.AccountRef(caller), testAddress, data, 10000000, new(uint256.Int))
		if err != nil {
			b.Fatal(err)
		}
	}
}

func BenchmarkCall(b *testing.B) {
	benchmarkCall(b, callCode, vm.Config{}, nil)
}

func BenchmarkCreate(b *testing.B) {
	benchmarkCreate(b, creationCode, vm.Config{})
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object_test.go">
```go
func BenchmarkSstore(b *testing.B) {
	var (
		db      = state.NewDatabase(rawdb.NewMemoryDatabase(), nil)
		state, _ = state.New(types.EmptyRootHash, db, nil)
		addr    = common.HexToAddress("0xaa")
		key     = common.Hash{}
		value1  = common.Hash{0x01}
		value2  = common.Hash{0x02}
	)
	state.CreateAccount(addr)

	b.Run("Set", func(b *testing.B) {
		benchmarkSstore(b, state, addr, key, common.Hash{}, value1)
	})
	b.Run("Reset", func(b *testing.B) {
		benchmarkSstore(b, state, addr, key, value1, value2)
	})
	b.Run("Delete", func(b *testing.B) {
		benchmarkSstore(b, state, addr, key, value1, common.Hash{})
	})
}

func benchmarkSstore(b *testing.B, s *state.StateDB, addr common.Address, key, from, to common.Hash) {
	b.ReportAllocs()
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		b.StopTimer()
		snap := s.Snapshot()
		s.SetState(addr, key, from)
		b.StartTimer()

		s.SetState(addr, key, to)

		b.StopTimer()
		s.RevertToSnapshot(snap)
		b.StartTimer()
	}
}

func BenchmarkSload(b *testing.B) {
	var (
		db       = state.NewDatabase(rawdb.NewMemoryDatabase(), nil)
		state, _ = state.New(types.EmptyRootHash, db, nil)
		addr     = common.HexToAddress("0xaa")
		key      = common.Hash{}
		value    = common.Hash{0x01}
	)
	state.CreateAccount(addr)
	state.SetState(addr, key, value)

	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		state.GetState(addr, key)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/bench_test.go">
```go
func benchInsertChain(b *testing.B, disk bool, txsgen func(int) types.Transactions) {
	var db ethdb.Database
	if disk {
		dir, err := os.MkdirTemp("", "chain-bench-")
		if err != nil {
			b.Fatalf("cannot create temporary directory: %v", err)
		}
		defer os.RemoveAll(dir)
		db, err = rawdb.NewLevelDBDatabase(dir, 1024, 1024, "", false)
		if err != nil {
			b.Fatalf("error opening database: %v", err)
		}
		defer db.Close()
	} else {
		db = rawdb.NewMemoryDatabase()
	}
	gspec := &Genesis{
		Config:     params.TestChainConfig,
		Alloc:      GenesisAlloc{testBankAddress: {Balance: testBankFunds}},
		BaseFee:    big.NewInt(params.InitialBaseFee),
		Difficulty: big.NewInt(1),
	}
	genesis := gspec.MustCommit(db)
	chain, _ := NewBlockChain(db, nil, gspec, nil, ethash.NewFaker(), vm.Config{}, nil, nil)
	defer chain.Stop()

	// Create a batch of blocks to import
	blocks := make(types.Blocks, 0, b.N)
	var txgas uint64
	if txsgen != nil {
		for _, tx := range txsgen(0) {
			txgas += tx.Gas()
		}
	}
	g := new(GasPool).AddGas(gspec.GasLimit)
	for i := 0; i < b.N; i++ {
		var txs types.Transactions
		if txsgen != nil {
			txs = txsgen(i)
		}
		block, _ := chain.engine.FinalizeAndAssemble(chain, chain.CurrentBlock(), g, nil, txs, nil, nil)
		blocks = append(blocks, block)
	}
	b.SetBytes(gspec.GasLimit*int64(b.N) + int64(txgas)*int64(b.N))
	b.ReportAllocs()
	b.ResetTimer()

	// Start importing the blocks and measuring the time
	if _, err := chain.InsertChain(blocks); err != nil {
		b.Fatalf("failed to insert chain: %v", err)
	}
}

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

func BenchmarkInsertChain_empty_disk(b *testing.B) {
	benchInsertChain(b, true, nil)
}
func BenchmarkInsertChain_valueTx_disk(b *testing.B) {
	benchInsertChain(b, true, genValueTx(0))
}
func BenchmarkInsertChain_valueTx_100kB_disk(b *testing.B) {
	benchInsertChain(b, true, genValueTx(100*1024))
}
func BenchmarkInsertChain_ring200_disk(b *testing.B) {
	benchInsertChain(b, true, genTxRing(200))
}
func BenchmarkInsertChain_ring1000_disk(b *testing.B) {
	benchInsertChain(b, true, genTxRing(1000))
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition_test.go">
```go
// State transition benchmark
func BenchmarkStateTransition(b *testing.B) {
	b.ReportAllocs()

	var (
		db, _   = ethdb.NewMemDatabase()
		key, _  = crypto.HexToECDSA("b71c71a67e1177ad4e901695e1b4b9ee17ae16c6668d313eac2f96dbcda3f291")
		address = crypto.PubkeyToAddress(key.PublicKey)
		gspec   = &Genesis{
			Config: params.MainnetChainConfig,
			Alloc:  GenesisAlloc{address: {Balance: big.NewInt(1000000000000000000)}},
		}
		genesis = gspec.MustCommit(db)
		chain, _   = NewBlockChain(db, nil, gspec, nil, ethash.NewFaker(), vm.Config{}, nil, nil)
		tx, _      = types.SignNewTx(key, types.HomesteadSigner{}, &types.LegacyTx{
			Nonce:    0,
			GasPrice: big.NewInt(10000000000),
			Gas:      21000,
			To:       &common.Address{},
			Value:    big.NewInt(1000),
		})
	)
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		// Create a new state from the genesis and post a single transaction
		// into it, which will be the only thing the benchmark will measure.
		statedb, _ := state.New(genesis.Root(), state.NewDatabase(db, nil), nil)
		statedb.SetBalance(address, big.NewInt(1000000000000000000))

		msg := txToMessage(tx, gspec.Config, genesis.BaseFee)
		context := NewEVMBlockContext(genesis.Header(), chain, nil)
		vmenv := vm.NewEVM(context, statedb, gspec.Config, vm.Config{})

		// Run the transaction and benchmark the time
		b.StartTimer()
		_, _, err := ApplyMessage(vmenv, msg, new(GasPool).AddGas(tx.Gas()))
		b.StopTimer()

		if err != nil {
			b.Fatalf("failed to apply message: %v", err)
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm_test.go">
```go
func BenchmarkEVM(b *testing.B) {
	var (
		statedb, _ = state.New(types.EmptyRootHash, state.NewDatabase(rawdb.NewMemoryDatabase()), nil)
		rules      = params.TestChainConfig.Rules(new(big.Int), false, 0)
		evm        = NewEVM(BlockContext{}, TxContext{}, statedb, params.TestChainConfig, Config{})
	)
	var R [1000]common.Address
	for i := 0; i < len(R); i++ {
		statedb.CreateAccount(R[i])
		statedb.SetBalance(R[i], uint256.NewInt(1))
	}
	var (
		x, y = uint256.NewInt(1), uint256.NewInt(2)
		r    = new(uint256.Int)
		code = []byte{
			PUSH1, 0x01,
			PUSH1, 0x02,
			ADD,
			PUSH1, 0x00,
			MSTORE,
			PUSH1, 0x20,
			PUSH1, 0x00,
			RETURN,
		}
	)
	contract := NewContract(AccountRef(common.Address{}), AccountRef(common.Address{}), new(uint256.Int), 1000000)
	contract.SetCallCode(&common.Address{}, crypto.Keccak256Hash(code), code)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		evm.interpreter.run(contract, nil, false, rules)
		r.Add(x, y)
	}
}
```
</file>
</go-ethereum>
<prompt-corrections>
### Prompt Corrections

*   The original prompt provided an excellent starting point with `go-ethereum/core/vm/instructions_test.go` and `go-ethereum/core/bench_test.go`. These files demonstrate micro and macro benchmarking patterns, respectively.
*   The provided context has been expanded with additional `go-ethereum` files to give a more complete picture of their benchmarking and testing strategies, which will be useful for implementing a comprehensive framework as requested.

*   `core/vm/contracts_test.go`: Shows how to benchmark contract-level opcodes like `CALL` and `CREATE`.
*   `core/state/state_object_test.go`: Provides clear examples of benchmarking state-intensive operations like `SSTORE` and `SLOAD` under different scenarios (e.g., setting a new value vs. resetting an existing one). This is crucial for performance validation.
*   `core/state_transition_test.go`: Contains a macro-benchmark for an entire state transition, which is a key high-level performance metric.
*   `core/vm/evm_test.go`: Includes a basic benchmark for the EVM interpreter loop itself.

These additions provide a richer set of reference implementations covering a wider range of EVM performance aspects, from individual opcodes to full transaction processing. The patterns of using helper functions (`benchmark*`) and setting up different scenarios within `b.Run` are highly relevant.
</prompt-corrections>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions_test.go">
```go
// opBenchmark is a helper function for benchmarking EVM instructions.
// It sets up a basic EVM and stack, pushes the provided hex-encoded arguments,
// and executes the given operation function `op` for `bench.N` iterations.
// It also verifies that the input arguments on the stack are not mutated during execution.
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

// Example usage of opBenchmark for the SHA3 opcode, demonstrating how to
// benchmark an operation that reads from memory.
func BenchmarkOpSha3(b *testing.B) {
	var (
		evm      = NewEVM(BlockContext{}, nil, params.TestChainConfig, Config{})
		stack    = newstack()
		memory   = NewMemory()
		testData = []byte("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
		scope    = &ScopeContext{memory, stack, nil}
	)
	memory.Set(0, 32, testData)
	stack.push(uint256.NewInt(32))
	stack.push(uint256.NewInt(0))

	pc := uint64(0)
	b.ReportAllocs()
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		opSha3(&pc, evm.interpreter, scope)
		stack.pop() // pop result
		stack.push(uint256.NewInt(32))
		stack.push(uint256.NewInt(0))
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiled_test.go">
```go
// precompiledBenchmark is a helper function for benchmarking precompiled contracts.
// It sets up the input data, controls the benchmark timer, and runs the precompile
// for `b.N` iterations, ensuring the output is correct.
func precompiledBenchmark(b *testing.B, p PrecompiledContract, input []byte, output []byte) {
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		// We can't rely on the input being constant across runs, so make a copy.
		in := common.CopyBytes(input)
		ret, err := p.Run(in)
		if err != nil {
			b.Fatal(err)
		}
		if !bytes.Equal(ret, output) {
			b.Fatalf("output mismatch: have %x, want %x", ret, output)
		}
	}
}

// Example usage of precompiledBenchmark for the SHA256 precompile.
func BenchmarkSha256(b *testing.B) {
	data := []byte("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
	hash := sha256.Sum256(data)
	b.SetBytes(int64(len(data)))
	precompiledBenchmark(b, &sha256hash{}, data, hash[:])
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/bench_test.go">
```go
// benchInsertChain is a macro-benchmark that measures the performance of inserting a chain of blocks.
// It sets up a blockchain with a genesis block and then repeatedly inserts a generated
// chain, measuring the total time taken. This pattern is excellent for end-to-end
// performance validation and regression detection.
func benchInsertChain(b *testing.B, assembly bool, genTx func(int, common.Address, *types.Signer) *types.Transaction) {
	// Generate a canonical chain to act as the main dataset
	var (
		gspec    = core.DefaultGenesisBlock()
		engine   = ethash.NewFaker()
		db       = rawdb.NewMemoryDatabase()
		genesis  = gspec.MustCommit(db)
		blocks   = make(types.Blocks, 1024)
		receipts = make([][]*types.Receipt, len(blocks))
	)
	var (
		signer = types.HomesteadSigner{}
		key, _ = crypto.GenerateKey()
	)
	for i := 0; i < len(blocks); i++ {
		// Create a new block with a single transaction
		block, receipt := core.GenerateBlock(gspec.Config, genesis, engine, db, 1, func(j int, b *core.BlockGen) {
			if genTx != nil {
				tx := genTx(i, crypto.PubkeyToAddress(key.PublicKey), &signer)
				b.AddTx(tx)
			}
		})
		blocks[i] = block
		receipts[i] = receipt
		genesis = block
	}

	b.ReportAllocs()
	b.ResetTimer()

	// Import the chain again and again
	for i := 0; i < b.N; i++ {
		// Create a new blockchain to import into
		blockchain, _ := core.NewBlockChain(rawdb.NewMemoryDatabase(), nil, gspec, nil, engine, vm.Config{}, nil, nil)
		b.StopTimer()
		// Do not measure the setup of the new blockchain
		if assembly {
			if _, err := blockchain.InsertBlockAndSetHead(blocks, receipts, true); err != nil {
				b.Fatalf("failed to insert chain: %v", err)
			}
		} else {
			if n, err := blockchain.InsertChain(blocks); err != nil {
				b.Fatalf("failed to insert chain (block %d): %v", n, err)
			}
		}
		b.StartTimer()
		// Only measure the teardown of the created chain
		blockchain.Stop()
	}
}

// genValueTx creates a simple value transfer transaction to a random address.
// This is an example of a workload generator for macro-benchmarks.
func genValueTx(i int, from common.Address, signer *types.Signer) *types.Transaction {
	key, _ := crypto.GenerateKey()
	tx, _ := types.SignTx(types.NewTransaction(uint64(i), crypto.PubkeyToAddress(key.PublicKey), big.NewInt(1000), 21000, big.NewInt(1), nil), *signer, key)
	return tx
}

// genTxRing creates a transaction that cycles funds through a set of accounts.
// This simulates a more complex workload with multiple state changes.
func genTxRing(naccounts int) func(int, common.Address, *types.Signer) *types.Transaction {
	// Create the accounts and feed them some wei
	keys := make([]*ecdsa.PrivateKey, naccounts)
	for i := 0; i < naccounts; i++ {
		keys[i], _ = crypto.GenerateKey()
	}
	// Return a generator function that sends a transaction from a cyclic account
	return func(i int, from common.Address, signer *types.Signer) *types.Transaction {
		key := keys[i%len(keys)]
		tx, _ := types.SignTx(types.NewTransaction(0, crypto.PubkeyToAddress(keys[(i+1)%len(keys)].PublicKey), big.NewInt(1000), 21000, big.NewInt(1), nil), *signer, key)
		return tx
	}
}

func BenchmarkInsertChain_valueTx_memdb(b *testing.B) {
	benchInsertChain(b, false, func(i int, from common.Address, signer *types.Signer) *types.Transaction {
		return genValueTx(i, from, signer)
	})
}

func BenchmarkInsertChain_ring1000_memdb(b *testing.B) {
	benchInsertChain(b, false, genTxRing(1000))
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_test.go">
```go
// benchmarkStateDB_SLOAD_Warm benchmarks SLOAD performance for a "warm" storage slot,
// meaning the slot has been accessed before within the same transaction. Warm
// accesses are significantly cheaper and faster.
func benchmarkStateDB_SLOAD_Warm(b *testing.B, db ethdb.Database, r *rand.Rand) {
	// create some accounts
	addrs := make([]common.Address, 2)
	for i := 0; i < len(addrs); i++ {
		r.Read(addrs[i][:])
	}
	sdb := newBenchState(b, db)

	// Create a non-empty storage account to test SLOADs on
	addr := addrs[0]
	sdb.CreateAccount(addr)
	skey := common.BytesToHash(common.LeftPadBytes([]byte{0x01}, 32))
	sdb.SetState(addr, skey, common.Hash{0x01})
	sdb.Commit(nil, false)

	b.ResetTimer()
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		// In each iteration, we need to fetch the state from the db
		// We can't just do sdb.GetState, because that's cached in-memory
		// So, we use another statedb, with the same root.
		sdb2, err := state.New(sdb.OriginalRoot(), sdb.Database(), nil)
		if err != nil {
			b.Fatal(err)
		}
		// The first access is not what we want to measure
		sdb2.GetState(addr, skey)
		// The second access is what we want to measure
		sdb2.GetState(addr, skey)
	}
}

// benchmarkStateDB_SLOAD_Cold benchmarks SLOAD performance for a "cold" storage slot,
// representing the first time a slot is accessed in a transaction. Cold accesses
// are more expensive due to the need to load data from the database.
func benchmarkStateDB_SLOAD_Cold(b *testing.B, db ethdb.Database, r *rand.Rand) {
	// create some accounts
	addrs := make([]common.Address, 2)
	for i := 0; i < len(addrs); i++ {
		r.Read(addrs[i][:])
	}
	sdb := newBenchState(b, db)

	// Create a non-empty storage account to test SLOADs on
	addr := addrs[0]
	sdb.CreateAccount(addr)
	skey := common.BytesToHash(common.LeftPadBytes([]byte{0x01}, 32))
	sdb.SetState(addr, skey, common.Hash{0x01})
	sdb.Commit(nil, false)

	b.ResetTimer()
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		// In each iteration, we need to fetch the state from the db
		// We can't just do sdb.GetState, because that's cached in-memory
		// So, we use another statedb, with the same root.
		sdb2, err := state.New(sdb.OriginalRoot(), sdb.Database(), nil)
		if err != nil {
			b.Fatal(err)
		}
		// First access is cold
		sdb2.GetState(addr, skey)
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions_test.go">
```go
// opBenchmark is a helper function for benchmarking opcodes.
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

// Example of a benchmark for a stateful opcode (SSTORE).
// This demonstrates how to set up the EVM state (StateDB) for a benchmark.
func BenchmarkOpSstore(b *testing.B) {
	var (
		evm, _  = NewEVM(BlockContext{}, rpc.BlockNumber(0), new(uint256.Int), nil, params.TestChainConfig, Config{}), nil
		stack   = newstack()
		scope   = &ScopeContext{nil, stack, nil}
		key     = new(uint256.Int)
		value   = new(uint256.Int).SetUint64(0xc0ffee)
		pc      = uint64(0)
		address = common.HexToAddress("0xaa")
	)
	// pre-condition
	scope.self = NewContract(common.Address{}, address, new(uint256.Int), 100000, nil)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		key.SetUint64(uint64(i))
		stack.push(value)
		stack.push(key)

		opSstore(&pc, evm.interpreter, scope)
	}
}

// Example of a benchmark for an opcode with dynamic gas costs based on memory (SHA3).
// This shows how memory is managed and allocated within a benchmark.
func BenchmarkOpSha3(b *testing.B) {
	var (
		evm   = NewEVM(BlockContext{}, rpc.BlockNumber(0), new(uint256.Int), nil, params.TestChainConfig, Config{})
		stack = newstack()
		scope = &ScopeContext{nil, stack, new(Memory)}
		pc    = uint64(0)
	)

	allocs := []int{1, 2, 5, 10, 20}
	for _, n := range allocs {
		size := n * 32
		scope.mem.Resize(uint64(size))

		offset := new(uint256.Int)
		val := new(uint256.Int).SetUint64(uint64(size))

		b.Run(fmt.Sprintf("size %d", size), func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				stack.push(val)
				stack.push(offset)
				opSha3(&pc, evm.interpreter, scope)
				stack.pop()
			}
		})
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/bench_test.go">
```go
// This is the helper function that implements the macro-benchmark for inserting a chain.
// It takes a testing.B, a flag for database type, and a transaction generator function.
// This pattern allows for creating many benchmark variations with different configurations.
func benchInsertChain(b *testing.B, statedb bool, txGen func(int) (*types.Transaction, error)) {
	var (
		db      ethdb.Database
		gendb   ethdb.Database
		testcfg *params.ChainConfig
		err     error
	)
	// Setup the database based on the 'statedb' flag.
	if !statedb {
		db = rawdb.NewMemoryDatabase()
		gendb = db
		testcfg = params.TestChainConfig
	} else {
		db, err = rawdb.NewLevelDBDatabase(b.TempDir(), 0, 0, "", false)
		if err != nil {
			b.Fatal("could not open statedb", "err", err)
		}
		defer db.Close()

		triedb := triedb.NewDatabase(db, nil)
		defer triedb.Close()

		gendb = triedb.Open(db, types.EmptyRootHash)
		testcfg = params.TestChainConfig
	}

	// Create a genesis block and a blockchain instance.
	gspec := &core.Genesis{Config: testcfg, Alloc: types.GenesisAlloc{testAddress: {Balance: testBalance}}}
	genesis := gspec.MustCommit(gendb)

	chain, _ := core.NewBlockChain(db, nil, gspec, nil, ethash.NewFaker(), vm.Config{}, nil)
	defer chain.Stop()

	// Generate a batch of transactions if a generator is provided.
	var txs []*types.Transaction
	if txGen != nil {
		txs = make([]*types.Transaction, b.N)
		for i := 0; i < b.N; i++ {
			tx, err := txGen(i)
			if err != nil {
				b.Fatal(err)
			}
			txs[i] = tx
		}
	} else {
		txs = make([]*types.Transaction, 0)
	}
	b.ReportAllocs()
	b.ResetTimer()

	// Insert the generated transactions into blocks and then into the chain.
	for i := 0; i < b.N; i++ {
		parent := genesis
		if i > 0 {
			parent, _ = chain.GetBlockByNumber(uint64(i))
		}
		block, _ := testWorker.GenerateBlock([]*types.Transaction{txs[i]}, parent, time.Now().Unix())
		if _, err := chain.InsertChain(types.Blocks{block}); err != nil {
			b.Fatalf("failed to insert block: %v", err)
		}
	}
}

// genValueTx creates a simple value-transfer transaction. The size of the data field
// can be specified to simulate different transaction loads.
func genValueTx(size int) func(int) (*types.Transaction, error) {
	return func(i int) (*types.Transaction, error) {
		nonce := uint64(i)
		tx := types.NewTx(&types.LegacyTx{
			Nonce:    nonce,
			To:       &testAddress,
			Value:    big.NewInt(10),
			Gas:      params.TxGas,
			GasPrice: big.NewInt(params.GWei),
			Data:     make([]byte, size),
		})
		return types.SignTx(tx, types.HomesteadSigner{}, testKey)
	}
}

// genTxRing creates a complex transaction workload where a set of accounts send
// funds to each other in a ring, ensuring state is modified across many accounts.
func genTxRing(n int) func(int) (*types.Transaction, error) {
	// Create the accounts and private keys for the ring
	keys := make([]*ecdsa.PrivateKey, n)
	addrs := make([]common.Address, n)
	for i := 0; i < n; i++ {
		keys[i], _ = crypto.GenerateKey()
		addrs[i] = crypto.PubkeyToAddress(keys[i].PublicKey)
	}
	// Create the transaction generator
	return func(i int) (*types.Transaction, error) {
		from := i % n
		to := (i + 1) % n

		nonce := uint64(i / n)
		tx := types.NewTx(&types.LegacyTx{
			Nonce:    nonce,
			To:       &addrs[to],
			Value:    big.NewInt(10),
			Gas:      params.TxGas,
			GasPrice: big.NewInt(params.GWei),
		})
		return types.SignTx(tx, types.HomesteadSigner{}, keys[from])
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts_test.go">
```go
// This benchmark function runs various pieces of EVM bytecode to test performance
// on different types of contract logic (e.g., loops, calculations).
func BenchmarkEVM_Run(b *testing.B) {
	varDirectionCode := "6001600055"
	varNormalCode := "6000600155"
	dupCode := "60018080808080808080"
	loopCode := "60006000600060005b6001600055600110156012576001016000555b600f60005360005b"
	macroLoopCode := `5b60016000556000540160005560005460010260005560005460020360005560005460005260016000f0600054600104600055600054600105600055600054600035600055600054600090600090600090600090600090600160005a9050945093509250915090505b`
	fibonacciCode := `6001600055600160015560005460015401600155600a1015601c576001016000555b`

	tests := []struct {
		name string
		code string
	}{
		{name: "direction", code: varDirectionCode},
		{name: "normal", code: varNormalCode},
		{name: "dup", code: dupCode},
		{name: "loop", code: loopCode},
		{name: "macro", code: macroLoopCode},
		{name: "fibonacci", code: fibonacciCode},
	}

	for _, test := range tests {
		b.Run(test.name, func(b *testing.B) {
			code := common.Hex2Bytes(test.code)
			// Create a test harness with a contract that runs the specified code.
			harness, err := newEVMHarness()
			if err != nil {
				b.Fatal(err)
			}
			addr := common.HexToAddress("0xaa")
			harness.statedb.SetCode(addr, code)
			b.ResetTimer()
			for i := 0; i < b.N; i++ {
				// Each benchmark iteration re-initializes the state and EVM
				// to ensure isolation and accurate measurement.
				harness.statedb.Snapshot()
				_, _, err = harness.evm.Call(
					NewContract(common.Address{}, addr, new(uint256.Int), 10000000, nil),
					nil,
					false,
				)
				if err != nil {
					b.Fatal(err)
				}
				harness.statedb.RevertToSnapshot(harness.snap)
			}
		})
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm_test.go">
```go
// benchmarkContract is a generic helper for benchmarking the execution of a
// given EVM bytecode snippet. It initializes an EVM with a contract containing
// the code and runs it repeatedly.
func benchmarkContract(b *testing.B, code []byte) {
	var (
		address = common.HexToAddress("0xaa")
		caller  = common.Address{}
		evm     *EVM
	)
	harness, err := newEVMHarness()
	if err != nil {
		b.Fatal(err)
	}
	defer harness.close()
	evm = harness.evm

	contract := NewContract(caller, address, new(uint256.Int), 100000000000000, code)
	evm.StateDB.SetCode(address, code)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		// For each iteration, a snapshot of the state is taken and reverted
		// to ensure that runs don't interfere with each other. This is crucial
		// for benchmarks involving state changes.
		snap := evm.StateDB.Snapshot()
		evm.Call(contract, nil, false)
		evm.StateDB.RevertToSnapshot(snap)
	}
}

// Below are examples of using the benchmarkContract helper for different scenarios.

func BenchmarkSingleTx(b *testing.B) {
	from, _ := crypto.HexToECDSA("b71c71a67e1177ad4e901695e1b4b9ee17ae16c6668d313eac2f96dbcda3f291")
	fromAddr := crypto.PubkeyToAddress(from.PublicKey)
	toAddr := common.HexToAddress("b94f5374fce5edbc8e2a8697c15331677e6ebf0b")

	harness, err := newEVMHarness()
	if err != nil {
		b.Fatal(err)
	}
	defer harness.close()

	tx := types.NewTx(&types.LegacyTx{
		Nonce:    0,
		To:       &toAddr,
		Value:    big.NewInt(1000),
		Gas:      params.TxGas,
		GasPrice: big.NewInt(params.GWei),
	})
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		snap := harness.statedb.Snapshot()
		// Apply the transaction to the state.
		_, err := harness.state.Transition(harness.evm, fromAddr, tx)
		if err != nil {
			b.Fatal(err)
		}
		harness.statedb.RevertToSnapshot(snap)
	}
}

// BenchmarkTransfer benchmarks a simple value transfer, which is a very common
// operation and a good baseline for EVM performance.
func BenchmarkTransfer(b *testing.B) {
	benchmarkContract(b, nil)
}
```
</file>
</go-ethereum>

