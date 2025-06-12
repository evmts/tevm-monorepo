const std = @import("std");
const zbench = @import("zbench");
const evm_root = @import("evm");

// Import EVM components  
const evm = evm_root.evm;
const Address = evm.Address;

// Simple benchmarks for basic EVM operations
fn benchmarkAddressCreation(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    // Benchmark address creation from various sources
    for (0..1000) |i| {
        const addr = Address.from_u256(@intCast(i));
        std.mem.doNotOptimizeAway(&addr);
    }
}

fn benchmarkAddressConversions(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    // Test address to u256 and back conversions
    for (0..1000) |i| {
        const value: u256 = @intCast(i + 1000000);
        const addr = Address.from_u256(value);
        const converted_back = Address.to_u256(addr);
        std.mem.doNotOptimizeAway(converted_back);
    }
}

fn benchmarkZeroAddress(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    // Benchmark zero address creation
    for (0..10000) |_| {
        const zero_addr = Address.zero();
        std.mem.doNotOptimizeAway(&zero_addr);
    }
}

fn benchmarkAddressComparisons(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const addr1 = Address.from_u256(0xCAFEBABE);
    const addr2 = Address.from_u256(0xDEADBEEF);
    const zero_addr = Address.zero();
    
    // Benchmark address comparisons
    for (0..10000) |_| {
        const eq1 = std.mem.eql(u8, &addr1, &addr2);
        const eq2 = std.mem.eql(u8, &addr1, &zero_addr);
        std.mem.doNotOptimizeAway(eq1);
        std.mem.doNotOptimizeAway(eq2);
    }
}

fn benchmarkAddressHashing(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    // Benchmark simple address hash calculations
    for (0..1000) |i| {
        const addr = Address.from_u256(@intCast(i));
        
        // Simple hash calculation without hashmap
        var hash: u64 = 0;
        for (addr) |byte| {
            hash = hash *% 31 +% @as(u64, byte);
        }
        
        std.mem.doNotOptimizeAway(hash);
    }
}

fn benchmarkKeccak256Addresses(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    // Benchmark Keccak256 hashing of addresses (common EVM operation)
    for (0..100) |i| {
        const addr = Address.from_u256(@intCast(i + 12345));
        
        var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
        hasher.update(&addr);
        var hash: [32]u8 = undefined;
        hasher.final(&hash);
        
        std.mem.doNotOptimizeAway(&hash);
    }
}

// Combined stress test simulating typical EVM address usage patterns
fn benchmarkAddressStressTest(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    // Simulate a transaction processing pattern
    for (0..100) |i| {
        // Create sender and receiver addresses
        const sender = Address.from_u256(@intCast(i));
        const receiver = Address.from_u256(@intCast(i + 1000));
        
        // Convert to u256 for balance calculations
        const sender_balance = Address.to_u256(sender);
        const receiver_balance = Address.to_u256(receiver);
        
        // Simulate balance transfer calculation
        const transfer_amount: u256 = 1000000000000000000; // 1 ETH in wei
        const new_sender_balance = sender_balance -% transfer_amount;
        const new_receiver_balance = receiver_balance +% transfer_amount;
        
        // Convert back to addresses (simulating storage keys)
        const sender_key = Address.from_u256(new_sender_balance);
        const receiver_key = Address.from_u256(new_receiver_balance);
        
        // Compare addresses
        const is_zero_sender = std.mem.eql(u8, &sender_key, &Address.zero());
        const is_zero_receiver = std.mem.eql(u8, &receiver_key, &Address.zero());
        
        std.mem.doNotOptimizeAway(is_zero_sender);
        std.mem.doNotOptimizeAway(is_zero_receiver);
    }
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("EVM Address Benchmarks\n", .{});
    try stdout.print("=======================\n\n", .{});

    var bench = zbench.Benchmark.init(std.heap.page_allocator, .{});
    defer bench.deinit();

    // Register benchmarks for EVM address operations
    try bench.add("Address Creation (1000x)", benchmarkAddressCreation, .{});
    try bench.add("Address Conversions (1000x)", benchmarkAddressConversions, .{});
    try bench.add("Zero Address Creation (10000x)", benchmarkZeroAddress, .{});
    try bench.add("Address Comparisons (10000x)", benchmarkAddressComparisons, .{});
    try bench.add("Address Hashing (1000x)", benchmarkAddressHashing, .{});
    try bench.add("Keccak256 Addresses (100x)", benchmarkKeccak256Addresses, .{});
    try bench.add("Address Stress Test (100x)", benchmarkAddressStressTest, .{});

    // Run benchmarks
    try stdout.print("Running EVM address benchmarks...\n\n", .{});
    try bench.run(stdout);
}