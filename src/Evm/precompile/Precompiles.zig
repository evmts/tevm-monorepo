const std = @import("std");
// Use an alternative approach for Address in tests
const builtin = @import("builtin");
const Address = if (builtin.is_test) 
    [20]u8 // Just use the raw type in tests
else 
    @import("Address").Address;
const common = @import("common.zig");
const crypto = @import("crypto.zig");
const math = @import("math.zig");
const bls12_381 = @import("bls12_381.zig");
const kzg = @import("kzg.zig");
// Simple logger for tests that doesn't require importing EvmLogger
const EvmLogger = struct {
    name: []const u8,
    
    pub fn debug(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        if (builtin.mode == .Debug) {
            std.debug.print("[DEBUG][{s}] " ++ fmt ++ "\n", .{self.name} ++ args);
        }
    }
    
    pub fn info(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        std.debug.print("[INFO][{s}] " ++ fmt ++ "\n", .{self.name} ++ args);
    }
    
    pub fn warn(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        std.debug.print("[WARN][{s}] " ++ fmt ++ "\n", .{self.name} ++ args);
    }
    
    pub fn err(self: EvmLogger, comptime fmt: []const u8, args: anytype) void {
        std.debug.print("[ERROR][{s}] " ++ fmt ++ "\n", .{self.name} ++ args);
    }
};

fn createLogger(name: []const u8) EvmLogger {
    return EvmLogger{ .name = name };
}

fn createScopedLogger(parent: EvmLogger, name: []const u8) struct {
    name: []const u8,
    
    pub fn deinit(self: @This()) void {
        _ = self;
    }
    
    pub fn debug(self: @This(), comptime fmt: []const u8, args: anytype) void {
        _ = self;
        _ = fmt;
        _ = args;
    }
} {
    _ = parent;
    return .{ .name = name };
}

fn debugOnly(comptime callback: anytype) void {
    // This does nothing in production code
    _ = callback;
}
// Define ChainRules directly in precompiles for testing since we cannot import Evm module in tests
const ChainRules = struct {
    IsEIP1559: bool = false,
    IsEIP2929: bool = false,
    IsEIP2930: bool = false,
    IsEIP3529: bool = false,
    IsEIP3198: bool = false,
    IsEIP3541: bool = false,
    IsEIP3651: bool = false,
    IsEIP3855: bool = false,
    IsEIP3860: bool = false,
    IsEIP4895: bool = false,
    IsEIP4844: bool = false,
    IsEIP5656: bool = false,
    IsByzantium: bool = false,
    IsIstanbul: bool = false,
    IsBerlin: bool = false,
    IsCancun: bool = false,
    IsPrague: bool = false,

    pub fn forHardfork(hardfork: Hardfork) ChainRules {
        return switch (hardfork) {
            .Frontier, .Homestead, .TangerineWhistle, .SpuriousDragon => .{},
            .Byzantium, .Constantinople, .Petersburg => .{
                .IsByzantium = true,
            },
            .Istanbul => .{
                .IsByzantium = true,
                .IsIstanbul = true,
            },
            .Berlin => .{
                .IsByzantium = true,
                .IsIstanbul = true,
                .IsBerlin = true,
                .IsEIP2929 = true,
                .IsEIP2930 = true,
            },
            .London => .{
                .IsByzantium = true,
                .IsIstanbul = true,
                .IsBerlin = true,
                .IsEIP1559 = true,
                .IsEIP2929 = true,
                .IsEIP2930 = true,
                .IsEIP3198 = true,
                .IsEIP3529 = true,
                .IsEIP3541 = true,
            },
            .ArrowGlacier, .GrayGlacier, .Merge => .{
                .IsByzantium = true,
                .IsIstanbul = true,
                .IsBerlin = true,
                .IsEIP1559 = true,
                .IsEIP2929 = true,
                .IsEIP2930 = true,
                .IsEIP3198 = true,
                .IsEIP3529 = true,
                .IsEIP3541 = true,
            },
            .Shanghai => .{
                .IsByzantium = true,
                .IsIstanbul = true,
                .IsBerlin = true,
                .IsEIP1559 = true,
                .IsEIP2929 = true,
                .IsEIP2930 = true,
                .IsEIP3198 = true,
                .IsEIP3529 = true,
                .IsEIP3541 = true,
                .IsEIP3651 = true,
                .IsEIP3855 = true,
                .IsEIP3860 = true,
                .IsEIP4895 = true,
            },
            .Cancun => .{
                .IsByzantium = true,
                .IsIstanbul = true,
                .IsBerlin = true,
                .IsCancun = true,
                .IsEIP1559 = true,
                .IsEIP2929 = true,
                .IsEIP2930 = true,
                .IsEIP3198 = true,
                .IsEIP3529 = true,
                .IsEIP3541 = true,
                .IsEIP3651 = true,
                .IsEIP3855 = true,
                .IsEIP3860 = true,
                .IsEIP4895 = true,
                .IsEIP4844 = true,
                .IsEIP5656 = true,
            },
            .Prague => .{
                .IsByzantium = true,
                .IsIstanbul = true,
                .IsBerlin = true,
                .IsCancun = true,
                .IsPrague = true,
                .IsEIP1559 = true,
                .IsEIP2929 = true,
                .IsEIP2930 = true,
                .IsEIP3198 = true,
                .IsEIP3529 = true,
                .IsEIP3541 = true,
                .IsEIP3651 = true,
                .IsEIP3855 = true,
                .IsEIP3860 = true,
                .IsEIP4895 = true,
                .IsEIP4844 = true,
                .IsEIP5656 = true,
            },
            .Verkle => .{
                .IsByzantium = true,
                .IsIstanbul = true,
                .IsBerlin = true,
                .IsCancun = true,
                .IsPrague = true,
                .IsEIP1559 = true,
                .IsEIP2929 = true,
                .IsEIP2930 = true,
                .IsEIP3198 = true,
                .IsEIP3529 = true,
                .IsEIP3541 = true,
                .IsEIP3651 = true,
                .IsEIP3855 = true,
                .IsEIP3860 = true,
                .IsEIP4895 = true,
                .IsEIP4844 = true,
                .IsEIP5656 = true,
            },
        };
    }
};

// Define Hardfork enum for use in ChainRules.forHardfork
pub const Hardfork = enum {
    Frontier,
    Homestead,
    TangerineWhistle,
    SpuriousDragon,
    Byzantium,
    Constantinople,
    Petersburg,
    Istanbul,
    Berlin,
    London,
    ArrowGlacier,
    GrayGlacier,
    Merge,
    Shanghai,
    Cancun,
    Prague,
    Verkle,
};

// Create a file-specific logger
const logger = createLogger("Precompiles.zig");

// Helper to create addresses for precompiled contracts
fn createPrecompileAddress(value: u8) Address {
    var addr = [_]u8{0} ** 20;
    addr[19] = value;
    return addr;
}

/// Use the PrecompiledContract type defined in common.zig
const PrecompiledContract = common.PrecompiledContract;

/// PrecompiledContracts is a mapping of addresses to precompiled contracts
pub const PrecompiledContracts = std.AutoHashMap(Address, *const PrecompiledContract);

/// Create and return a map of precompiled contracts for Homestead
pub fn homesteadContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = PrecompiledContracts.init(allocator);
    
    // Address 0x01: ECRECOVER
    try contracts.put(createPrecompileAddress(0x01), &crypto.ECRecover);
    
    // Address 0x02: SHA256
    try contracts.put(createPrecompileAddress(0x02), &crypto.SHA256Hash);
    
    // Address 0x03: RIPEMD160
    try contracts.put(createPrecompileAddress(0x03), &crypto.RIPEMD160Hash);
    
    // Address 0x04: IDENTITY (data copy)
    try contracts.put(createPrecompileAddress(0x04), &common.DataCopy);

    logger.debug("Created Homestead precompiled contracts", .{});
    
    return contracts;
}

/// Create and return a map of precompiled contracts for Byzantium
pub fn byzantiumContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try homesteadContracts(allocator);
    
    // Address 0x05: ModExp
    try contracts.put(createPrecompileAddress(0x05), &math.BigModExp);
    
    // Address 0x06: Bn256Add
    try contracts.put(createPrecompileAddress(0x06), &crypto.Bn256AddByzantium);
    
    // Address 0x07: Bn256ScalarMul
    try contracts.put(createPrecompileAddress(0x07), &crypto.Bn256ScalarMulByzantium);
    
    // Address 0x08: Bn256Pairing
    try contracts.put(createPrecompileAddress(0x08), &crypto.Bn256PairingByzantium);

    logger.debug("Created Byzantium precompiled contracts", .{});
    
    return contracts;
}

/// Create and return a map of precompiled contracts for Istanbul
pub fn istanbulContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try byzantiumContracts(allocator);
    
    // Update BN256 contracts to use Istanbul gas costs
    try contracts.put(createPrecompileAddress(0x06), &crypto.Bn256AddIstanbul);
    try contracts.put(createPrecompileAddress(0x07), &crypto.Bn256ScalarMulIstanbul);
    try contracts.put(createPrecompileAddress(0x08), &crypto.Bn256PairingIstanbul);
    
    // Address 0x09: Blake2F
    try contracts.put(createPrecompileAddress(0x09), &crypto.Blake2F);

    logger.debug("Created Istanbul precompiled contracts", .{});
    
    return contracts;
}

/// Create and return a map of precompiled contracts for Berlin
pub fn berlinContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try istanbulContracts(allocator);
    
    // Update ModExp to use EIP-2565 gas cost formula
    try contracts.put(createPrecompileAddress(0x05), &math.BigModExpEIP2565);

    logger.debug("Created Berlin precompiled contracts", .{});
    
    return contracts;
}

/// Create and return a map of precompiled contracts for Cancun
pub fn cancunContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try berlinContracts(allocator);
    
    // Address 0x0a: KZG Point Evaluation
    try contracts.put(createPrecompileAddress(0x0a), &kzg.PointEvaluation);

    logger.debug("Created Cancun precompiled contracts", .{});
    
    return contracts;
}

/// Create and return a map of precompiled contracts for Prague
pub fn pragueContracts(allocator: std.mem.Allocator) !PrecompiledContracts {
    var contracts = try cancunContracts(allocator);
    
    // Address 0x0b: BLS12_381 G1 Add
    try contracts.put(createPrecompileAddress(0x0b), &bls12_381.G1Add);
    
    // Address 0x0c: BLS12_381 G1 Mul
    try contracts.put(createPrecompileAddress(0x0c), &bls12_381.G1MultiExp);
    
    // Address 0x0d: BLS12_381 G2 Add
    try contracts.put(createPrecompileAddress(0x0d), &bls12_381.G2Add);
    
    // Address 0x0e: BLS12_381 G2 Mul
    try contracts.put(createPrecompileAddress(0x0e), &bls12_381.G2MultiExp);
    
    // Address 0x0f: BLS12_381 Pairing
    try contracts.put(createPrecompileAddress(0x0f), &bls12_381.Pairing);
    
    // Address 0x10: BLS12_381 Map G1
    try contracts.put(createPrecompileAddress(0x10), &bls12_381.MapG1);
    
    // Address 0x11: BLS12_381 Map G2
    try contracts.put(createPrecompileAddress(0x11), &bls12_381.MapG2);

    logger.debug("Created Prague precompiled contracts", .{});
    
    return contracts;
}

/// Get precompiled contracts based on chain rules
pub fn activePrecompiledContracts(allocator: std.mem.Allocator, rules: ChainRules) !PrecompiledContracts {
    if (rules.IsPrague) {
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
    
    // Return the result with outputting data and remaining gas
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
        rules.IsByzantium = true; // Enable Byzantium
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
        rules.IsByzantium = true; // Enable Byzantium
        rules.IsIstanbul = true; // Enable Istanbul
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
        rules.IsByzantium = true; // Enable Byzantium
        rules.IsIstanbul = true; // Enable Istanbul
        rules.IsBerlin = true; // Enable Berlin
        rules.IsCancun = false;
        rules.IsPrague = false;
        
        var contracts = try activePrecompiledContracts(allocator, rules);
        defer contracts.deinit();
        
        try std.testing.expectEqual(@as(usize, 9), contracts.count());
    }
    
    // Test Cancun contracts
    {
        var rules = ChainRules{};
        rules.IsByzantium = true; // Enable Byzantium
        rules.IsIstanbul = true; // Enable Istanbul
        rules.IsBerlin = true; // Enable Berlin
        rules.IsCancun = true; // Enable Cancun
        rules.IsPrague = false;
        
        var contracts = try activePrecompiledContracts(allocator, rules);
        defer contracts.deinit();
        
        try std.testing.expectEqual(@as(usize, 10), contracts.count());
    }
    
    // Test Prague contracts
    {
        var rules = ChainRules{};
        rules.IsByzantium = true; // Enable Byzantium
        rules.IsIstanbul = true; // Enable Istanbul
        rules.IsBerlin = true; // Enable Berlin
        rules.IsCancun = true; // Enable Cancun
        rules.IsPrague = true; // Enable Prague
        
        var contracts = try activePrecompiledContracts(allocator, rules);
        defer contracts.deinit();
        
        try std.testing.expectEqual(@as(usize, 17), contracts.count());
    }
}