const std = @import("std");
const Address = @import("Address").Address;
const Evm = @import("Evm");
const common = @import("common.zig");
const crypto = @import("crypto.zig");
const math = @import("math.zig");
const bls12_381 = @import("bls12_381.zig");
const kzg = @import("kzg.zig");
const ChainRules = Evm.ChainRules;
const EvmLogger = @import("../EvmLogger.zig").EvmLogger;
const createLogger = @import("../EvmLogger.zig").createLogger;

// Create a file-specific logger
const logger = createLogger("Precompiles.zig");

/// PrecompiledContract is the basic interface for native contracts implemented in Zig.
/// Each contract must provide a method to calculate required gas based on input size
/// and a method to execute the contract logic.
pub const PrecompiledContract = struct {
    /// Calculate required gas for execution
    requiredGas: fn (input: []const u8) u64,
    
    /// Execute the precompiled contract
    run: fn (input: []const u8, allocator: std.mem.Allocator) anyerror!?[]u8,
};

/// PrecompiledContracts is a mapping of addresses to precompiled contracts
pub const PrecompiledContracts = std.AutoHashMap(Address, *const PrecompiledContract);

/// Create and return a map of precompiled contracts for Homestead
pub fn homesteadContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = PrecompiledContracts.init(allocator);
    
    // Address 0x01: ECRECOVER
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x01}), &crypto.ECRecover);
    
    // Address 0x02: SHA256
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x02}), &crypto.SHA256Hash);
    
    // Address 0x03: RIPEMD160
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x03}), &crypto.RIPEMD160Hash);
    
    // Address 0x04: IDENTITY (data copy)
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x04}), &common.DataCopy);

    logger.debug("Created Homestead precompiled contracts", .{});
    
    return contracts;
}

/// Create and return a map of precompiled contracts for Byzantium
pub fn byzantiumContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try homesteadContracts(allocator);
    
    // Address 0x05: ModExp
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x05}), &math.BigModExp);
    
    // Address 0x06: Bn256Add
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x06}), &crypto.Bn256AddByzantium);
    
    // Address 0x07: Bn256ScalarMul
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x07}), &crypto.Bn256ScalarMulByzantium);
    
    // Address 0x08: Bn256Pairing
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x08}), &crypto.Bn256PairingByzantium);

    logger.debug("Created Byzantium precompiled contracts", .{});
    
    return contracts;
}

/// Create and return a map of precompiled contracts for Istanbul
pub fn istanbulContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try byzantiumContracts(allocator);
    
    // Update BN256 contracts to use Istanbul gas costs
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x06}), &crypto.Bn256AddIstanbul);
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x07}), &crypto.Bn256ScalarMulIstanbul);
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x08}), &crypto.Bn256PairingIstanbul);
    
    // Address 0x09: Blake2F
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x09}), &crypto.Blake2F);

    logger.debug("Created Istanbul precompiled contracts", .{});
    
    return contracts;
}

/// Create and return a map of precompiled contracts for Berlin
pub fn berlinContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try istanbulContracts(allocator);
    
    // Update ModExp to use EIP-2565 gas cost formula
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x05}), &math.BigModExpEIP2565);

    logger.debug("Created Berlin precompiled contracts", .{});
    
    return contracts;
}

/// Create and return a map of precompiled contracts for Cancun
pub fn cancunContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try berlinContracts(allocator);
    
    // Address 0x0a: KZG Point Evaluation
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x0a}), &kzg.PointEvaluation);

    logger.debug("Created Cancun precompiled contracts", .{});
    
    return contracts;
}

/// Create and return a map of precompiled contracts for Prague
pub fn pragueContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try cancunContracts(allocator);
    
    // Address 0x0b: BLS12_381 G1 Add
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x0b}), &bls12_381.G1Add);
    
    // Address 0x0c: BLS12_381 G1 Mul
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x0c}), &bls12_381.G1MultiExp);
    
    // Address 0x0d: BLS12_381 G2 Add
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x0d}), &bls12_381.G2Add);
    
    // Address 0x0e: BLS12_381 G2 Mul
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x0e}), &bls12_381.G2MultiExp);
    
    // Address 0x0f: BLS12_381 Pairing
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x0f}), &bls12_381.Pairing);
    
    // Address 0x10: BLS12_381 Map G1
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x10}), &bls12_381.MapG1);
    
    // Address 0x11: BLS12_381 Map G2
    try contracts.put(Address.fromBytesAddress(&[_]u8{0x11}), &bls12_381.MapG2);

    logger.debug("Created Prague precompiled contracts", .{});
    
    return contracts;
}

/// Get precompiled contracts based on chain rules
pub fn activePrecompiledContracts(allocator: std.mem.Allocator, rules: ChainRules) !PrecompiledContracts {
    if (rules.IsVerkle) {
        // Verkle rules match Berlin
        logger.debug("Using Verkle precompiled contracts (same as Berlin)", .{});
        return try berlinContracts(allocator);
    } else if (rules.IsPrague) {
        logger.debug("Using Prague precompiled contracts", .{});
        return try pragueContracts(allocator);
    } else if (rules.IsCancun) {
        logger.debug("Using Cancun precompiled contracts", .{});
        return try cancunContracts(allocator);
    } else if (rules.IsBerlin) {
        logger.debug("Using Berlin precompiled contracts", .{});
        return try berlinContracts(allocator);
    } else if (rules.IsIstanbul) {
        logger.debug("Using Istanbul precompiled contracts", .{});
        return try istanbulContracts(allocator);
    } else if (rules.IsByzantium) {
        logger.debug("Using Byzantium precompiled contracts", .{});
        return try byzantiumContracts(allocator);
    } else {
        logger.debug("Using Homestead precompiled contracts", .{});
        return try homesteadContracts(allocator);
    }
}

/// Run a precompiled contract
/// Returns the output bytes and remaining gas, or an error if the execution failed
pub fn runPrecompiledContract(
    contract: *const PrecompiledContract, 
    input: []const u8, 
    gas: u64,
    allocator: std.mem.Allocator,
    logger_opt: ?*EvmLogger
) !struct { output: ?[]u8, remaining_gas: u64 } {
    // Calculate gas required
    const required_gas = contract.requiredGas(input);
    
    // Check if we have enough gas
    if (gas < required_gas) {
        logger.err("Not enough gas for precompiled contract, required: {d}, available: {d}", .{required_gas, gas});
        return error.OutOfGas;
    }
    
    // Log gas consumption if logger is available
    if (logger_opt) |logger_instance| {
        logger_instance.debug("Precompiled contract gas consumption: {d}", .{required_gas});
    }
    
    // Use gas
    const remaining_gas = gas - required_gas;
    
    // Run the contract
    const output = try contract.run(input, allocator);
    
    return .{
        .output = output,
        .remaining_gas = remaining_gas,
    };
}

// Tests
test "Active precompiled contracts per hardfork" {
    const allocator = std.testing.allocator;
    
    // Test Homestead contracts
    {
        var rules = ChainRules{};
        rules.IsByzantium = false;
        rules.IsIstanbul = false;
        rules.IsBerlin = false;
        rules.IsCancun = false;
        rules.IsPrague = false;
        
        var contracts = try activePrecompiledContracts(allocator, rules);
        defer contracts.deinit();
        
        try std.testing.expectEqual(@as(usize, 4), contracts.count());
    }
    
    // Test Byzantium contracts
    {
        var rules = ChainRules{};
        rules.IsIstanbul = false;
        rules.IsBerlin = false;
        rules.IsCancun = false;
        rules.IsPrague = false;
        
        var contracts = try activePrecompiledContracts(allocator, rules);
        defer contracts.deinit();
        
        try std.testing.expectEqual(@as(usize, 8), contracts.count());
    }
    
    // Test Istanbul contracts
    {
        var rules = ChainRules{};
        rules.IsBerlin = false;
        rules.IsCancun = false;
        rules.IsPrague = false;
        
        var contracts = try activePrecompiledContracts(allocator, rules);
        defer contracts.deinit();
        
        try std.testing.expectEqual(@as(usize, 9), contracts.count());
    }
    
    // Test Berlin contracts
    {
        var rules = ChainRules{};
        rules.IsCancun = false;
        rules.IsPrague = false;
        
        var contracts = try activePrecompiledContracts(allocator, rules);
        defer contracts.deinit();
        
        try std.testing.expectEqual(@as(usize, 9), contracts.count());
    }
    
    // Test Cancun contracts
    {
        var rules = ChainRules{};
        rules.IsPrague = false;
        
        var contracts = try activePrecompiledContracts(allocator, rules);
        defer contracts.deinit();
        
        try std.testing.expectEqual(@as(usize, 10), contracts.count());
    }
    
    // Test Prague contracts
    {
        var rules = ChainRules{};
        rules.IsPrague = true;
        
        var contracts = try activePrecompiledContracts(allocator, rules);
        defer contracts.deinit();
        
        try std.testing.expectEqual(@as(usize, 17), contracts.count());
    }
}