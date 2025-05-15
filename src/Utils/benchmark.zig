const std = @import("std");

/// Configuration options for benchmark runs
pub const BenchmarkOptions = struct {
    /// Number of warmup iterations to run before measuring
    warmup_iterations: usize = 3,
    /// Number of iterations to run for measurement
    iterations: usize = 10,
    /// Whether to print benchmark results as they complete
    print_results: bool = true,
    /// Minimum execution time per sample in nanoseconds
    /// Used to determine how many executions to bundle together
    min_time_per_sample: u64 = 1_000_000, // 1ms
    /// Maximum number of samples to collect
    max_samples: usize = 100,
};

/// Result of a benchmark run
pub const BenchmarkResult = struct {
    /// Name of the benchmark
    name: []const u8,
    /// Timing samples in nanoseconds
    samples: []const u64,
    /// Memory allocator used for samples allocation
    allocator: std.mem.Allocator,
    /// Total memory allocated during the benchmark (if measured)
    memory_used: ?usize = null,

    /// Free resources used by the benchmark result
    pub fn deinit(self: *BenchmarkResult) void {
        self.allocator.free(self.samples);
    }

    /// Get the minimum execution time
    pub fn min(self: *const BenchmarkResult) u64 {
        var min_val: u64 = std.math.maxInt(u64);
        for (self.samples) |sample| {
            min_val = @min(min_val, sample);
        }
        return min_val;
    }

    /// Get the maximum execution time
    pub fn max(self: *const BenchmarkResult) u64 {
        var max_val: u64 = 0;
        for (self.samples) |sample| {
            max_val = @max(max_val, sample);
        }
        return max_val;
    }

    /// Get the average execution time
    pub fn mean(self: *const BenchmarkResult) u64 {
        var sum: u64 = 0;
        for (self.samples) |sample| {
            sum += sample;
        }
        return sum / self.samples.len;
    }

    /// Get the median execution time
    pub fn median(self: *const BenchmarkResult) u64 {
        // Create a copy of samples for sorting
        var samples_copy = self.allocator.dupe(u64, self.samples) catch return self.mean();
        defer self.allocator.free(samples_copy);

        std.sort.heap(u64, samples_copy, {}, comptime std.sort.asc(u64));

        if (samples_copy.len % 2 == 0) {
            const mid = samples_copy.len / 2;
            return (samples_copy[mid - 1] + samples_copy[mid]) / 2;
        } else {
            return samples_copy[samples_copy.len / 2];
        }
    }

    /// Print a summary of the benchmark results
    pub fn printSummary(self: *const BenchmarkResult) void {
        const min_time = self.min();
        const max_time = self.max();
        const mean_time = self.mean();
        const median_time = self.median();

        std.debug.print("Benchmark: {s}\n", .{self.name});
        std.debug.print("  Samples: {d}\n", .{self.samples.len});
        std.debug.print("  Min:     {d} ns\n", .{min_time});
        std.debug.print("  Max:     {d} ns\n", .{max_time});
        std.debug.print("  Mean:    {d} ns\n", .{mean_time});
        std.debug.print("  Median:  {d} ns\n", .{median_time});
        if (self.memory_used) |mem_used| {
            std.debug.print("  Memory:  {d} bytes\n", .{mem_used});
        }
    }
};

/// Benchmark function type
pub const BenchmarkFn = *const fn () void;

/// Benchmark function type with memory tracking
pub const BenchmarkWithAllocatorFn = *const fn (allocator: std.mem.Allocator) void;

/// Benchmark runner
pub const Benchmark = struct {
    allocator: std.mem.Allocator,
    options: BenchmarkOptions,
    timer: std.time.Timer,

    /// Initialize a new benchmark runner
    pub fn init(allocator: std.mem.Allocator, options: BenchmarkOptions) !Benchmark {
        return Benchmark{
            .allocator = allocator,
            .options = options,
            .timer = try std.time.Timer.start(),
        };
    }

    /// Run a benchmark function
    pub fn run(self: *Benchmark, name: []const u8, func: BenchmarkFn) !BenchmarkResult {
        // Warmup phase
        for (0..self.options.warmup_iterations) |_| {
            // Call the function once to warm caches
            func();
            // Force the compiler not to optimize the call away
            std.mem.doNotOptimizeAway({});
        }

        // Determine the number of iterations per sample
        var iterations_per_sample: usize = 1;
        {
            // Measure how long a single iteration takes
            self.timer.reset();
            func();
            const single_iter_time = self.timer.lap();
            
            // If a single iteration is too fast, bundle multiple iterations together
            if (single_iter_time < self.options.min_time_per_sample) {
                iterations_per_sample = @max(
                    1, 
                    @as(usize, @intCast(self.options.min_time_per_sample / @max(1, single_iter_time)))
                );
            }
        }

        // Allocate samples array
        const samples = try self.allocator.alloc(u64, self.options.max_samples);
        errdefer self.allocator.free(samples);
        
        // Measurement phase
        var sample_index: usize = 0;
        while (sample_index < self.options.max_samples) : (sample_index += 1) {
            self.timer.reset();
            
            // Run multiple iterations if needed to get a measurable time
            for (0..iterations_per_sample) |_| {
                func();
                std.mem.doNotOptimizeAway({});
            }
            
            const elapsed = self.timer.lap();
            samples[sample_index] = elapsed / iterations_per_sample;
        }

        // Create result
        const result = BenchmarkResult{
            .name = name,
            .samples = samples[0..sample_index],
            .allocator = self.allocator,
        };

        // Print results if enabled
        if (self.options.print_results) {
            result.printSummary();
        }

        return result;
    }

    /// Run a benchmark function with memory tracking
    pub fn runWithAllocator(
        self: *Benchmark, 
        name: []const u8, 
        func: BenchmarkWithAllocatorFn
    ) !BenchmarkResult {
        // Create a tracking allocator
        var gpa = std.heap.GeneralPurposeAllocator(.{}){};
        const tracking_allocator = gpa.allocator();
        defer _ = gpa.deinit();

        // Warmup phase
        for (0..self.options.warmup_iterations) |_| {
            func(tracking_allocator);
            std.mem.doNotOptimizeAway({});
        }

        // Determine the number of iterations per sample (similar to run())
        var iterations_per_sample: usize = 1;
        {
            self.timer.reset();
            func(tracking_allocator);
            const single_iter_time = self.timer.lap();
            
            if (single_iter_time < self.options.min_time_per_sample) {
                iterations_per_sample = @max(
                    1, 
                    @as(usize, @intCast(self.options.min_time_per_sample / @max(1, single_iter_time)))
                );
            }
        }

        // Reset GPA stats to start measuring memory usage
        _ = gpa.deinit();
        gpa = std.heap.GeneralPurposeAllocator(.{}){};
        
        // Allocate samples array
        const samples = try self.allocator.alloc(u64, self.options.max_samples);
        errdefer self.allocator.free(samples);
        
        // Measurement phase
        var sample_index: usize = 0;
        while (sample_index < self.options.max_samples) : (sample_index += 1) {
            self.timer.reset();
            
            for (0..iterations_per_sample) |_| {
                func(tracking_allocator);
                std.mem.doNotOptimizeAway({});
            }
            
            const elapsed = self.timer.lap();
            samples[sample_index] = elapsed / iterations_per_sample;
        }

        // Create result with memory tracking
        // Note: memory usage reported will be from all iterations
        const result = BenchmarkResult{
            .name = name,
            .samples = samples[0..sample_index],
            .allocator = self.allocator,
            .memory_used = gpa.total_requested_bytes,
        };

        if (self.options.print_results) {
            result.printSummary();
        }

        return result;
    }

    /// Compare multiple benchmark functions and print the results
    pub fn compare(
        self: *Benchmark,
        name: []const u8,
        funcs: []const struct { name: []const u8, func: BenchmarkFn }
    ) !void {
        std.debug.print("Benchmark Comparison: {s}\n", .{name});
        
        var results = try self.allocator.alloc(BenchmarkResult, funcs.len);
        defer {
            for (results) |*result| {
                result.deinit();
            }
            self.allocator.free(results);
        }
        
        // Run all benchmarks
        for (funcs, 0..) |func_info, i| {
            const result = try self.run(func_info.name, func_info.func);
            results[i] = result;
        }
        
        // Find the baseline (fastest median)
        var baseline_index: usize = 0;
        var best_median: u64 = std.math.maxInt(u64);
        
        for (results, 0..) |result, i| {
            const med = result.median();
            if (med < best_median) {
                best_median = med;
                baseline_index = i;
            }
        }
        
        // Print comparison
        std.debug.print("\nComparison Summary:\n", .{});
        std.debug.print("  Baseline: {s} ({d} ns)\n", .{results[baseline_index].name, best_median});
        
        for (results, 0..) |result, i| {
            if (i == baseline_index) continue;
            
            const result_median = result.median();
            const percentage = @as(f64, @floatFromInt(result_median)) / @as(f64, @floatFromInt(best_median)) * 100.0 - 100.0;
            
            std.debug.print("  {s}: {d} ns (+{d:.2}%)\n", .{
                result.name,
                result_median,
                percentage,
            });
        }
    }
};

/// Example usage
test "benchmark example" {
    const allocator = std.testing.allocator;
    
    var bench = try Benchmark.init(allocator, .{
        .warmup_iterations = 2,
        .iterations = 5,
        .print_results = false,
    });
    
    const result = try bench.run("example", exampleBenchFn);
    defer result.deinit();
    
    try std.testing.expect(result.samples.len > 0);
}

/// Example benchmark function
fn exampleBenchFn() void {
    var sum: u64 = 0;
    for (0..1000) |i| {
        sum += i;
    }
    std.mem.doNotOptimizeAway(sum);
}

/// Example comparison test
test "benchmark comparison" {
    const allocator = std.testing.allocator;
    
    var bench = try Benchmark.init(allocator, .{
        .warmup_iterations = 2,
        .iterations = 5,
        .print_results = false,
    });
    
    const funcs = [_]struct { name: []const u8, func: BenchmarkFn }{
        .{ .name = "fast", .func = fastBenchFn },
        .{ .name = "slow", .func = slowBenchFn },
    };
    
    try bench.compare("speed test", &funcs);
}

fn fastBenchFn() void {
    var sum: u64 = 0;
    for (0..100) |i| {
        sum += i;
    }
    std.mem.doNotOptimizeAway(sum);
}

fn slowBenchFn() void {
    var sum: u64 = 0;
    for (0..10000) |i| {
        sum += i;
    }
    std.mem.doNotOptimizeAway(sum);
}