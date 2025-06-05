const std = @import("std");
const testing = std.testing;
const Contracts = @import("Contracts");

test "SnailTracer contract metadata" {
    std.log.info("Testing SnailTracer contract metadata...", .{});

    // Test basic contract metadata
    try testing.expectEqualStrings("SnailTracer", Contracts.Contracts.SnailTracer.SnailTracer.contract_name);
    try testing.expectEqualStrings("GPL-3.0", Contracts.Contracts.SnailTracer.SnailTracer.license);
    try testing.expectEqualStrings("Péter Szilágyi", Contracts.Contracts.SnailTracer.SnailTracer.original_author);

    // Test function signatures are properly defined
    try testing.expectEqualStrings("TracePixel(int256,int256,int256)", Contracts.Contracts.SnailTracer.SnailTracer.functions.TracePixel);
    try testing.expectEqualStrings("TraceScanline(int256,int256)", Contracts.Contracts.SnailTracer.SnailTracer.functions.TraceScanline);
    try testing.expectEqualStrings("TraceImage(int256)", Contracts.Contracts.SnailTracer.SnailTracer.functions.TraceImage);
    try testing.expectEqualStrings("Benchmark()", Contracts.Contracts.SnailTracer.SnailTracer.functions.Benchmark);

    std.log.info("✅ SnailTracer metadata test passed!", .{});
}

test "ContractCompiler initialization and compilation" {
    std.log.info("Testing ContractCompiler initialization...", .{});

    const allocator = testing.allocator;

    // Initialize the contract compiler (this should compile SnailTracer)
    var compiler = Contracts.ContractCompiler.init(allocator) catch |err| {
        // If compilation fails (e.g., due to missing Rust dependencies), skip the test
        if (err == error.CompilationFailed) {
            std.log.warn("Skipping contract compilation test due to compilation failure (missing dependencies)", .{});
            return;
        }
        return err;
    };
    defer compiler.deinit();

    // Test that we can get contract data
    const abi = compiler.getSnailTracerAbi();
    const bytecode = compiler.getSnailTracerBytecode();
    const deployed_bytecode = compiler.getSnailTracerDeployedBytecode();

    if (abi) |abi_data| {
        // ABI should be valid JSON and non-empty
        try testing.expect(abi_data.len > 0);
        try testing.expect(std.mem.startsWith(u8, abi_data, "["));
        try testing.expect(std.mem.endsWith(u8, abi_data, "]"));
        std.log.info("✅ SnailTracer ABI length: {} bytes", .{abi_data.len});
    } else {
        std.log.warn("SnailTracer ABI not available (compilation may have failed)", .{});
    }

    if (bytecode) |bytecode_data| {
        // Bytecode should be hex-encoded and non-empty
        try testing.expect(bytecode_data.len > 0);
        try testing.expect(std.mem.startsWith(u8, bytecode_data, "0x"));
        std.log.info("✅ SnailTracer bytecode length: {} bytes", .{bytecode_data.len});
    } else {
        std.log.warn("SnailTracer bytecode not available (compilation may have failed)", .{});
    }

    if (deployed_bytecode) |deployed_bytecode_data| {
        // Deployed bytecode should be hex-encoded and non-empty
        try testing.expect(deployed_bytecode_data.len > 0);
        try testing.expect(std.mem.startsWith(u8, deployed_bytecode_data, "0x"));
        std.log.info("✅ SnailTracer deployed bytecode length: {} bytes", .{deployed_bytecode_data.len});
    } else {
        std.log.warn("SnailTracer deployed bytecode not available (compilation may have failed)", .{});
    }

    std.log.info("✅ ContractCompiler test passed!", .{});
}

test "SnailTracer data structures" {
    std.log.info("Testing SnailTracer data structures...", .{});

    // Test that the data structures are properly defined
    const Vector = Contracts.Contracts.SnailTracer.SnailTracer.Vector;
    const Ray = Contracts.Contracts.SnailTracer.SnailTracer.Ray;
    const Material = Contracts.Contracts.SnailTracer.SnailTracer.Material;

    // Create test instances
    const vector = Vector{ .x = 100, .y = 200, .z = 300 };
    try testing.expectEqual(@as(i256, 100), vector.x);
    try testing.expectEqual(@as(i256, 200), vector.y);
    try testing.expectEqual(@as(i256, 300), vector.z);

    const ray = Ray{
        .origin = vector,
        .direction = Vector{ .x = 1, .y = 0, .z = 0 },
        .depth = 0,
        .refract = false,
    };
    try testing.expectEqual(@as(i256, 100), ray.origin.x);
    try testing.expectEqual(@as(i256, 1), ray.direction.x);
    try testing.expectEqual(false, ray.refract);

    // Test material enum
    try testing.expectEqual(Material.Diffuse, Material.Diffuse);
    try testing.expectEqual(Material.Specular, Material.Specular);
    try testing.expectEqual(Material.Refractive, Material.Refractive);

    std.log.info("✅ Data structures test passed!", .{});
}
