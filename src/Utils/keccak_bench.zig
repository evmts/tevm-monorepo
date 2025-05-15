const std = @import("std");
const bench = @import("benchmark.zig");
const keccak = @import("keccak256.zig");
const hex = @import("hex.zig");

pub fn main() !void {
    // Parse command-line arguments for benchmark configuration
    var general_purpose_allocator = std.heap.GeneralPurposeAllocator(.{}){};
    const gpa = general_purpose_allocator.allocator();
    defer _ = general_purpose_allocator.deinit();

    // Create benchmark runner with default options
    var benchRunner = try bench.Benchmark.init(gpa, .{
        .warmup_iterations = 5,
        .iterations = 50,
        .min_time_per_sample = 10_000_000, // 10ms
    });

    // Generate test data of varying sizes
    const small_data = try generateRandomBytes(gpa, 32); // 32 bytes (typical hash size)
    defer gpa.free(small_data);
    const medium_data = try generateRandomBytes(gpa, 1024); // 1KB
    defer gpa.free(medium_data);
    const large_data = try generateRandomBytes(gpa, 32768); // 32KB
    defer gpa.free(large_data);

    // Generate hex strings from the data
    const small_hex = try bytesToHexString(gpa, small_data);
    defer gpa.free(small_hex);
    const medium_hex = try bytesToHexString(gpa, medium_data);
    defer gpa.free(medium_hex);
    const large_hex = try bytesToHexString(gpa, large_data);
    defer gpa.free(large_hex);

    // Test data, functions, and output buffers for benchmarks
    var result_buf: [32]u8 = undefined;
    var hex_result_buf: [66]u8 = undefined; // 0x + 64 chars

    // Create benchmark functions that capture the test data and buffers
    const keccak_small = struct {
        fn run() void {
            keccak.zig_keccak256(small_data.ptr, small_data.len, &result_buf);
            std.mem.doNotOptimizeAway(result_buf);
        }
    }.run;

    const keccak_medium = struct {
        fn run() void {
            keccak.zig_keccak256(medium_data.ptr, medium_data.len, &result_buf);
            std.mem.doNotOptimizeAway(result_buf);
        }
    }.run;

    const keccak_large = struct {
        fn run() void {
            keccak.zig_keccak256(large_data.ptr, large_data.len, &result_buf);
            std.mem.doNotOptimizeAway(result_buf);
        }
    }.run;

    const keccak_hex_small = struct {
        fn run() void {
            _ = keccak.zig_keccak256_hex(small_hex.ptr, small_hex.len, &hex_result_buf);
            std.mem.doNotOptimizeAway(hex_result_buf);
        }
    }.run;

    const keccak_hex_medium = struct {
        fn run() void {
            _ = keccak.zig_keccak256_hex(medium_hex.ptr, medium_hex.len, &hex_result_buf);
            std.mem.doNotOptimizeAway(hex_result_buf);
        }
    }.run;

    const keccak_hex_large = struct {
        fn run() void {
            _ = keccak.zig_keccak256_hex(large_hex.ptr, large_hex.len, &hex_result_buf);
            std.mem.doNotOptimizeAway(hex_result_buf);
        }
    }.run;

    // Benchmark and compare data size impact on raw bytes
    std.debug.print("\n--- Benchmarking keccak256 with different byte array sizes ---\n", .{});
    const raw_funcs = [_]struct { name: []const u8, func: bench.BenchmarkFn }{
        .{ .name = "32 bytes", .func = keccak_small },
        .{ .name = "1 KB", .func = keccak_medium },
        .{ .name = "32 KB", .func = keccak_large },
    };
    try benchRunner.compare("Keccak256 (raw bytes)", &raw_funcs);

    // Benchmark and compare data size impact on hex strings
    std.debug.print("\n--- Benchmarking keccak256_hex with different hex string sizes ---\n", .{});
    const hex_funcs = [_]struct { name: []const u8, func: bench.BenchmarkFn }{
        .{ .name = "32 bytes (hex)", .func = keccak_hex_small },
        .{ .name = "1 KB (hex)", .func = keccak_hex_medium },
        .{ .name = "32 KB (hex)", .func = keccak_hex_large },
    };
    try benchRunner.compare("Keccak256 (hex strings)", &hex_funcs);

    // Benchmark raw keccak implementation for 32-byte input
    const small_result = try benchRunner.run("Keccak256 (32 bytes)", keccak_small);
    defer small_result.deinit();

    // Print throughput information
    const bytes_per_sec = @as(u64, @intCast(small_data.len)) * 1_000_000_000 / small_result.median();
    std.debug.print("\nThroughput (32 bytes): {d} bytes/sec ({d} MB/sec)\n", 
        .{ bytes_per_sec, bytes_per_sec / (1024 * 1024) });

    const large_result = try benchRunner.run("Keccak256 (32 KB)", keccak_large);
    defer large_result.deinit();

    const large_bytes_per_sec = @as(u64, @intCast(large_data.len)) * 1_000_000_000 / large_result.median();
    std.debug.print("Throughput (32 KB): {d} bytes/sec ({d} MB/sec)\n", 
        .{ large_bytes_per_sec, large_bytes_per_sec / (1024 * 1024) });
}

/// Helper function to generate random bytes
fn generateRandomBytes(allocator: std.mem.Allocator, size: usize) ![]u8 {
    var bytes = try allocator.alloc(u8, size);
    var prng = std.rand.DefaultPrng.init(@as(u64, @bitCast(std.time.timestamp())));
    const random = prng.random();
    
    for (bytes) |*b| {
        b.* = random.intRangeAtMost(u8, 0, 255);
    }
    
    return bytes;
}

/// Helper function to convert bytes to hex string
fn bytesToHexString(allocator: std.mem.Allocator, bytes: []const u8) ![]u8 {
    // 0x prefix + 2 chars per byte
    const hex_len = 2 + bytes.len * 2;
    var hex_buf = try allocator.alloc(u8, hex_len);
    
    // Write 0x prefix
    hex_buf[0] = '0';
    hex_buf[1] = 'x';
    
    // Convert bytes to hex
    for (bytes, 0..) |byte, i| {
        const hi = std.fmt.digitToChar(@as(u4, @truncate(byte >> 4)), .lower);
        const lo = std.fmt.digitToChar(@as(u4, @truncate(byte & 0x0F)), .lower);
        hex_buf[2 + i * 2] = hi;
        hex_buf[2 + i * 2 + 1] = lo;
    }
    
    return hex_buf;
}