const std = @import("std");
const zbench = @import("zbench");

// Gas cost constants from EVM specification
const GasQuickStep: u64 = 2;
const GasFastestStep: u64 = 3;
const GasFastStep: u64 = 5;
const GasMidStep: u64 = 8;
const GasSlowStep: u64 = 10;
const GasExtStep: u64 = 20;

const Keccak256Gas: u64 = 30;
const Keccak256WordGas: u64 = 6;

const SloadGas: u64 = 100;
const ColdSloadCost: u64 = 2100;
const ColdAccountAccessCost: u64 = 2600;
const WarmStorageReadCost: u64 = 100;

// Simulated gas accounting structure
const GasTracker = struct {
    consumed: u64 = 0,
    limit: u64 = 10_000_000, // 10M gas limit like Ethereum mainnet
    
    fn consume(self: *GasTracker, amount: u64) bool {
        if (self.consumed + amount > self.limit) {
            return false; // Out of gas
        }
        self.consumed += amount;
        return true;
    }
    
    fn remaining(self: *const GasTracker) u64 {
        return self.limit - self.consumed;
    }
    
    fn reset(self: *GasTracker) void {
        self.consumed = 0;
    }
};

// Storage key type for access list
const StorageKey = struct {
    address: u256,
    key: u256,
};

// Simple access list implementation for benchmarking
const AccessList = struct {
    addresses: std.ArrayList(u256),
    storage_keys: std.ArrayList(StorageKey),
    allocator: std.mem.Allocator,
    
    fn init(allocator: std.mem.Allocator) AccessList {
        return AccessList{
            .addresses = std.ArrayList(u256).init(allocator),
            .storage_keys = std.ArrayList(StorageKey).init(allocator),
            .allocator = allocator,
        };
    }
    
    fn deinit(self: *AccessList) void {
        self.addresses.deinit();
        self.storage_keys.deinit();
    }
    
    fn isAddressWarm(self: *const AccessList, address: u256) bool {
        for (self.addresses.items) |addr| {
            if (addr == address) return true;
        }
        return false;
    }
    
    fn markAddressWarm(self: *AccessList, address: u256) !void {
        if (!self.isAddressWarm(address)) {
            try self.addresses.append(address);
        }
    }
    
    fn isStorageWarm(self: *const AccessList, address: u256, key: u256) bool {
        for (self.storage_keys.items) |item| {
            if (item.address == address and item.key == key) return true;
        }
        return false;
    }
    
    fn markStorageWarm(self: *AccessList, address: u256, key: u256) !void {
        if (!self.isStorageWarm(address, key)) {
            try self.storage_keys.append(.{ .address = address, .key = key });
        }
    }
    
    fn reset(self: *AccessList) void {
        self.addresses.clearRetainingCapacity();
        self.storage_keys.clearRetainingCapacity();
    }
};

// Benchmark basic gas accounting operations
fn benchmarkBasicGasAccounting(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 10000;
    
    for (0..iterations) |_| {
        var gas = GasTracker{};
        
        // Simulate typical transaction gas consumption
        _ = gas.consume(21000); // Base transaction cost
        _ = gas.consume(GasFastestStep); // ADD
        _ = gas.consume(GasFastStep); // MUL  
        _ = gas.consume(GasMidStep); // KECCAK256 base
        _ = gas.consume(SloadGas); // SLOAD
        _ = gas.consume(GasExtStep); // BALANCE
        
        const remaining = gas.remaining();
        std.mem.doNotOptimizeAway(remaining);
    }
}

// Benchmark gas calculation for different opcode categories
fn benchmarkOpcodeGasCalculation(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 10000;
    
    for (0..iterations) |_| {
        var total_gas: u64 = 0;
        
        // Quick operations (PC, MSIZE, GAS)
        for (0..10) |_| {
            total_gas += GasQuickStep;
        }
        
        // Fastest operations (ADD, SUB, LT, GT)
        for (0..20) |_| {
            total_gas += GasFastestStep;
        }
        
        // Fast operations (MUL, DIV, MOD)
        for (0..10) |_| {
            total_gas += GasFastStep;
        }
        
        // Mid operations (ADDMOD, MULMOD)
        for (0..5) |_| {
            total_gas += GasMidStep;
        }
        
        std.mem.doNotOptimizeAway(total_gas);
    }
}

// Benchmark dynamic gas calculation (KECCAK256, EXP)
fn benchmarkDynamicGasCalculation(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 5000;
    
    for (0..iterations) |_| {
        var total_gas: u64 = 0;
        
        // KECCAK256 with various data sizes
        for (1..33) |word_count| { // 1 to 32 words
            total_gas += Keccak256Gas + (@as(u64, @intCast(word_count)) * Keccak256WordGas);
        }
        
        // EXP with various exponent sizes
        for (1..9) |byte_count| { // 1 to 8 bytes
            const exp_gas = GasSlowStep + (@as(u64, @intCast(byte_count)) * 50); // 50 gas per byte
            total_gas += exp_gas;
        }
        
        std.mem.doNotOptimizeAway(total_gas);
    }
}

// Benchmark cold vs warm access (EIP-2929)
fn benchmarkColdWarmAccess(allocator: std.mem.Allocator) void {
    var access_list = AccessList.init(allocator);
    defer access_list.deinit();
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        access_list.reset();
        var total_gas: u64 = 0;
        
        const address1: u256 = 0x1234567890ABCDEF;
        const storage_key: u256 = 0x1111111111111111;
        
        // First access - cold
        if (!access_list.isAddressWarm(address1)) {
            total_gas += ColdAccountAccessCost; // 2600 gas
            access_list.markAddressWarm(address1) catch {};
        } else {
            total_gas += WarmStorageReadCost; // 100 gas
        }
        
        // Second access to same address - warm
        if (!access_list.isAddressWarm(address1)) {
            total_gas += ColdAccountAccessCost;
            access_list.markAddressWarm(address1) catch {};
        } else {
            total_gas += WarmStorageReadCost;
        }
        
        // Storage access patterns
        if (!access_list.isStorageWarm(address1, storage_key)) {
            total_gas += ColdSloadCost; // 2100 gas
            access_list.markStorageWarm(address1, storage_key) catch {};
        } else {
            total_gas += SloadGas; // 100 gas
        }
        
        // Warm storage access
        if (!access_list.isStorageWarm(address1, storage_key)) {
            total_gas += ColdSloadCost;
            access_list.markStorageWarm(address1, storage_key) catch {};
        } else {
            total_gas += SloadGas;
        }
        
        std.mem.doNotOptimizeAway(total_gas);
    }
}

// Benchmark gas limit checking and overflow protection
fn benchmarkGasLimitChecking(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 10000;
    
    for (0..iterations) |_| {
        var gas = GasTracker{ .limit = 100000 }; // Lower limit for testing
        
        // Consume gas until near limit
        var operations: u32 = 0;
        while (gas.consume(GasFastestStep)) {
            operations += 1;
            if (operations > 50000) break; // Safety break
        }
        
        // Try to consume more gas (should fail)
        const success = gas.consume(GasFastestStep);
        std.mem.doNotOptimizeAway(success);
        std.mem.doNotOptimizeAway(operations);
    }
}

// Benchmark complex gas calculation (typical transaction)
fn benchmarkComplexGasCalculation(allocator: std.mem.Allocator) void {
    var access_list = AccessList.init(allocator);
    defer access_list.deinit();
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        access_list.reset();
        var gas = GasTracker{};
        
        // Base transaction cost
        _ = gas.consume(21000);
        
        // Contract interaction simulation
        const contract_address: u256 = 0x123456789ABCDEF0;
        
        // Cold account access (CALL)
        if (!access_list.isAddressWarm(contract_address)) {
            _ = gas.consume(ColdAccountAccessCost);
            access_list.markAddressWarm(contract_address) catch {};
        }
        
        // Function execution simulation
        _ = gas.consume(GasFastestStep * 10); // Multiple ADD operations
        _ = gas.consume(GasFastStep * 5);     // Multiple MUL operations
        _ = gas.consume(GasMidStep * 2);      // ADDMOD operations
        
        // Storage operations
        for (0..3) |i| {
            const storage_key: u256 = @intCast(i);
            if (!access_list.isStorageWarm(contract_address, storage_key)) {
                _ = gas.consume(ColdSloadCost);
                access_list.markStorageWarm(contract_address, storage_key) catch {};
            } else {
                _ = gas.consume(SloadGas);
            }
        }
        
        // Hash computation
        _ = gas.consume(Keccak256Gas + (4 * Keccak256WordGas)); // Hash 128 bytes
        
        const final_gas = gas.consumed;
        std.mem.doNotOptimizeAway(final_gas);
    }
}

// Benchmark gas calculation edge cases
fn benchmarkGasEdgeCases(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 5000;
    
    for (0..iterations) |_| {
        var gas = GasTracker{};
        
        // Test gas consumption patterns that could cause overflow
        const large_gas_amount: u64 = 1_000_000;
        
        // Multiple large operations
        for (0..5) |_| {
            if (!gas.consume(large_gas_amount)) {
                break; // Out of gas
            }
        }
        
        // Test remaining gas calculation
        const remaining = gas.remaining();
        
        // Test exact gas limit consumption
        if (remaining > 0) {
            _ = gas.consume(remaining);
        }
        
        // This should fail (exceeds limit)
        const overflow_attempt = gas.consume(1);
        
        std.mem.doNotOptimizeAway(overflow_attempt);
        std.mem.doNotOptimizeAway(remaining);
    }
}

// Benchmark memory expansion gas calculation
fn benchmarkMemoryExpansionGas(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 5000;
    
    for (0..iterations) |_| {
        var total_gas: u64 = 0;
        
        // Memory expansion cost calculation (quadratic)
        for (1..100) |memory_words| {
            const words = @as(u64, @intCast(memory_words));
            
            // Simplified memory expansion gas formula
            // gas = (words * words) / 512 + (3 * words)
            const memory_gas = (words * words) / 512 + (3 * words);
            total_gas += memory_gas;
        }
        
        std.mem.doNotOptimizeAway(total_gas);
    }
}

// Benchmark call stipend and gas forwarding calculations
fn benchmarkCallGasCalculation(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 5000;
    
    for (0..iterations) |_| {
        var gas = GasTracker{};
        
        // Simulate CALL operation gas calculation
        const available_gas = gas.remaining();
        
        // EIP-150: Max 63/64 of available gas can be forwarded
        const max_gas_to_forward = available_gas - (available_gas / 64);
        
        // Call stipend for value transfers
        const call_stipend: u64 = 2300;
        
        // Calculate total gas for call
        const call_gas = if (max_gas_to_forward > call_stipend) 
            max_gas_to_forward 
        else 
            call_stipend;
        
        // Consume gas for the call
        _ = gas.consume(call_gas);
        
        std.mem.doNotOptimizeAway(call_gas);
    }
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Gas Accounting Benchmarks\n", .{});
    try stdout.print("=========================\n\n", .{});

    var bench = zbench.Benchmark.init(std.heap.page_allocator, .{});
    defer bench.deinit();

    // Basic gas accounting benchmarks
    try bench.add("Basic Gas Accounting", benchmarkBasicGasAccounting, .{});
    try bench.add("Opcode Gas Calculation", benchmarkOpcodeGasCalculation, .{});
    try bench.add("Dynamic Gas Calculation", benchmarkDynamicGasCalculation, .{});

    // EIP-2929 benchmarks
    try bench.add("Cold vs Warm Access", benchmarkColdWarmAccess, .{});

    // Advanced gas calculation benchmarks
    try bench.add("Gas Limit Checking", benchmarkGasLimitChecking, .{});
    try bench.add("Complex Gas Calculation", benchmarkComplexGasCalculation, .{});
    try bench.add("Gas Edge Cases", benchmarkGasEdgeCases, .{});
    try bench.add("Memory Expansion Gas", benchmarkMemoryExpansionGas, .{});
    try bench.add("Call Gas Calculation", benchmarkCallGasCalculation, .{});

    // Run benchmarks
    try stdout.print("Running benchmarks...\n\n", .{});
    try bench.run(stdout);
}