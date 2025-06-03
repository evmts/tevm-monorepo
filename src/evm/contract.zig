/// Production-quality Contract module for EVM execution context
///
/// This module manages contract execution context including bytecode, gas accounting,
/// storage access tracking, and JUMPDEST validation. It incorporates performance
/// optimizations from modern EVM implementations like evmone and reth.
///
/// Performance characteristics:
/// - O(log n) JUMPDEST validation using binary search
/// - Zero-allocation paths for common operations
/// - Inline hot-path functions for minimal overhead
/// - Storage pooling to reduce allocation pressure
///
/// Reference implementations:
/// - go-ethereum: https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go
/// - revm: https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/contract.rs
/// - evmone: https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp
const std = @import("std");
const constants = @import("constants.zig");
const bitvec = @import("bitvec.zig");
const Address = @import("Address");
const CodeAnalysis = @import("code_analysis.zig");
const StoragePool = @import("storage_pool.zig");

/// Maximum gas refund allowed (EIP-3529)
const MAX_REFUND_QUOTIENT = 5;

/// Global analysis cache (simplified version)
var analysis_cache: ?std.AutoHashMap([32]u8, *CodeAnalysis) = null;
var cache_mutex: std.Thread.Mutex = .{};

/// Contract represents the execution context for a single call in the EVM
const Self = @This();
// Identity and context
address: Address.Address,
caller: Address.Address,
value: u256,

// Code and analysis
code: []const u8,
code_hash: [32]u8,
code_size: u64, // Pre-computed for efficiency
analysis: ?*const CodeAnalysis, // Enhanced analysis structure

// Gas tracking
gas: u64,
gas_refund: u64,

// Input/output
input: []const u8,

// Execution flags
is_deployment: bool,
is_system_call: bool,
is_static: bool, // For STATICCALL context

// Storage access tracking (EIP-2929)
storage_access: ?*std.AutoHashMap(u256, bool),
original_storage: ?*std.AutoHashMap(u256, u256),
is_cold: bool,

// Optimization fields
has_jumpdests: bool, // Quick check to skip analysis
is_empty: bool, // For empty contracts

/// Initialize a new Contract with optimizations
pub fn init(
    caller: Address.Address,
    addr: Address.Address,
    value: u256,
    gas: u64,
    code: []const u8,
    code_hash: [32]u8,
    input: []const u8,
    is_static: bool,
) Self {
    return Self{
        .address = addr,
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = code,
        .code_hash = code_hash,
        .code_size = code.len,
        .input = input,
        .is_static = is_static,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = true,
        .gas_refund = 0,
        .is_deployment = false,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(code),
        .is_empty = code.len == 0,
    };
}

pub fn init_deployment(
    caller: Address.Address,
    value: u256,
    gas: u64,
    code: []const u8,
    salt: ?[32]u8,
) Self {
    const contract = Self{
        .address = Address.zero(),
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = code,
        .code_hash = [_]u8{0} ** 32, // Deployment doesn't have code hash. This could be kekkak256(0) instead of 0
        .code_size = code.len,
        .input = &[_]u8{},
        .is_static = false,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = false, // Deployment is always warm
        .gas_refund = 0,
        .is_deployment = true,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(code),
        .is_empty = code.len == 0,
    };

    if (salt == null) {
        return contract;
    }
    // Salt is used for CREATE2 address calculation
    // The actual address calculation happens in the VM's create2_contract method

    return contract;
}

/// Quick scan for JUMPDEST presence
fn contains_jumpdest(code: []const u8) bool {
    for (code) |op| {
        if (op == constants.JUMPDEST) return true;
    }
    return false;
}

/// Validate jump destination with optimizations
pub fn valid_jumpdest(self: *Self, dest: u256) bool {
    // Fast path: empty code or out of bounds
    if (self.is_empty or dest >= self.code_size) {
        return false;
    }
    // Fast path: no JUMPDESTs in code
    if (!self.has_jumpdests) {
        return false;
    }
    const pos: u32 = @intCast(@min(dest, std.math.maxInt(u32)));
    // Fast path: not a JUMPDEST opcode
    if (self.code[pos] != constants.JUMPDEST) {
        return false;
    }
    // Ensure analysis is performed
    self.ensure_analysis();
    // Binary search in sorted JUMPDEST positions
    if (self.analysis) |analysis| {
        if (analysis.jumpdest_positions.len > 0) {
            const Context = struct { target: u32 };
            const found = std.sort.binarySearch(
                u32,
                analysis.jumpdest_positions,
                Context{ .target = pos },
                struct {
                    fn compare(ctx: Context, item: u32) std.math.Order {
                        return std.math.order(ctx.target, item);
                    }
                }.compare,
            );
            return found != null;
        }
    }
    // Fallback to bitvec check
    return self.is_code(pos);
}

/// Ensure code analysis is performed
fn ensure_analysis(self: *Self) void {
    if (self.analysis == null and !self.is_empty) {
        self.analysis = analyze_code(self.code, self.code_hash) catch null;
    }
}

/// Check if position is code (not data)
pub inline fn is_code(self: *const Self, pos: u64) bool {
    if (self.analysis) |analysis| {
        return analysis.code_segments.is_set(pos);
    }
    return true; // Assume code if not analyzed
}

/// Use gas with inline optimization
pub inline fn use_gas(self: *Self, amount: u64) bool {
    if (self.gas < amount) {
        return false;
    }
    self.gas -= amount;
    return true;
}

/// Use gas without checking (when known safe)
pub inline fn use_gas_unchecked(self: *Self, amount: u64) void {
    self.gas -= amount;
}

/// Refund gas to contract
pub inline fn refund_gas(self: *Self, amount: u64) void {
    self.gas += amount;
}

/// Add to gas refund counter with clamping
pub inline fn add_gas_refund(self: *Self, amount: u64) void {
    const max_refund = self.gas / MAX_REFUND_QUOTIENT;
    self.gas_refund = @min(self.gas_refund + amount, max_refund);
}

/// Subtract from gas refund counter with clamping
pub inline fn sub_gas_refund(self: *Self, amount: u64) void {
    self.gas_refund = if (self.gas_refund > amount) self.gas_refund - amount else 0;
}

/// Mark storage slot as warm with pool support
pub fn mark_storage_slot_warm(self: *Self, slot: u256, pool: ?*StoragePool) !bool {
    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = try p.borrow_access_map();
        } else {
            self.storage_access = try std.heap.page_allocator.create(std.AutoHashMap(u256, bool));
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(std.heap.page_allocator);
        }
    }

    const map = self.storage_access.?;
    const was_cold = !map.contains(slot);
    if (was_cold) {
        try map.put(slot, true);
    }
    return was_cold;
}

/// Check if storage slot is cold
pub fn is_storage_slot_cold(self: *const Self, slot: u256) bool {
    if (self.storage_access) |map| {
        return !map.contains(slot);
    }
    return true; // All slots are cold if not tracked
}

/// Batch mark storage slots as warm
pub fn mark_storage_slots_warm(self: *Self, slots: []const u256, pool: ?*StoragePool) !void {
    if (slots.len == 0) return;

    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = try p.borrow_access_map();
        } else {
            self.storage_access = try std.heap.page_allocator.create(std.AutoHashMap(u256, bool));
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(std.heap.page_allocator);
        }
    }

    const map = self.storage_access.?;
    try map.ensureTotalCapacity(@as(u32, @intCast(map.count() + slots.len)));

    for (slots) |slot| {
        map.putAssumeCapacity(slot, true);
    }
}

/// Store original storage value
pub fn set_original_storage_value(self: *Self, slot: u256, value: u256, pool: ?*StoragePool) !void {
    if (self.original_storage == null) {
        if (pool) |p| {
            self.original_storage = try p.borrow_storage_map();
        } else {
            self.original_storage = try std.heap.page_allocator.create(std.AutoHashMap(u256, u256));
            self.original_storage.?.* = std.AutoHashMap(u256, u256).init(std.heap.page_allocator);
        }
    }

    try self.original_storage.?.put(slot, value);
}

/// Get original storage value
pub fn get_original_storage_value(self: *const Self, slot: u256) ?u256 {
    if (self.original_storage) |map| {
        return map.get(slot);
    }
    return null;
}

/// Get opcode at position (inline for performance)
pub fn get_op(self: *const Self, n: u64) u8 {
    return if (n < self.code_size) self.code[n] else constants.STOP;
}

/// Get opcode at position without bounds check
pub fn get_op_unchecked(self: *const Self, n: u64) u8 {
    return self.code[n];
}

/// Set call code (for CALLCODE/DELEGATECALL)
pub fn set_call_code(self: *Self, hash: [32]u8, code: []const u8) void {
    self.code = code;
    self.code_hash = hash;
    self.code_size = code.len;
    self.has_jumpdests = contains_jumpdest(code);
    self.is_empty = code.len == 0;
    self.analysis = null; // Reset analysis
}

/// Clean up contract resources
pub fn deinit(self: *Self, pool: ?*StoragePool) void {
    // Return maps to pool if available
    if (pool) |p| {
        if (self.storage_access) |map| {
            p.return_access_map(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            p.return_storage_map(map);
            self.original_storage = null;
        }
    } else {
        // Direct cleanup
        if (self.storage_access) |map| {
            map.deinit();
            std.heap.page_allocator.destroy(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            map.deinit();
            std.heap.page_allocator.destroy(map);
            self.original_storage = null;
        }
    }
    // Analysis is typically cached globally, so don't free
}

/// Analyze code and cache results
pub fn analyze_code(code: []const u8, code_hash: [32]u8) !*const CodeAnalysis {
    // Check cache first
    cache_mutex.lock();
    defer cache_mutex.unlock();

    if (analysis_cache == null) {
        analysis_cache = std.AutoHashMap([32]u8, *CodeAnalysis).init(std.heap.page_allocator);
    }

    if (analysis_cache.?.get(code_hash)) |cached| {
        return cached;
    }

    // Perform analysis
    const allocator = std.heap.page_allocator;
    const analysis = try allocator.create(CodeAnalysis);

    // Analyze code segments
    analysis.code_segments = bitvec.code_bitmap(code);

    // Find and sort JUMPDEST positions
    var jumpdests = std.ArrayList(u32).init(allocator);
    defer jumpdests.deinit();

    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];

        if (op == constants.JUMPDEST and analysis.code_segments.is_set(i)) {
            try jumpdests.append(@as(u32, @intCast(i)));
        }

        // Skip PUSH data
        if (constants.is_push(op)) {
            const push_size = constants.get_push_size(op);
            i += push_size + 1;
        } else {
            i += 1;
        }
    }

    // Sort for binary search
    std.mem.sort(u32, jumpdests.items, {}, comptime std.sort.asc(u32));
    analysis.jumpdest_positions = try jumpdests.toOwnedSlice();

    // Analyze other properties
    analysis.max_stack_depth = 0; // Stack depth analysis is optional for optimization
    analysis.block_gas_costs = null; // Gas cost analysis is optional for optimization
    analysis.has_dynamic_jumps = contains_op(code, &[_]u8{ constants.JUMP, constants.JUMPI });
    analysis.has_static_jumps = false; // Static jump detection is optional for optimization
    analysis.has_selfdestruct = contains_op(code, &[_]u8{constants.SELFDESTRUCT});
    analysis.has_create = contains_op(code, &[_]u8{ constants.CREATE, constants.CREATE2 });

    // Cache the analysis
    try analysis_cache.?.put(code_hash, analysis);

    return analysis;
}

/// Check if code contains any of the given opcodes
pub fn contains_op(code: []const u8, opcodes: []const u8) bool {
    for (code) |op| {
        for (opcodes) |target| {
            if (op == target) return true;
        }
    }
    return false;
}

/// Clear the global analysis cache
pub fn clear_analysis_cache() void {
    cache_mutex.lock();
    defer cache_mutex.unlock();

    if (analysis_cache) |*cache| {
        var iter = cache.iterator();
        while (iter.next()) |entry| {
            entry.value_ptr.*.deinit(std.heap.page_allocator);
            std.heap.page_allocator.destroy(entry.value_ptr.*);
        }
        cache.deinit();
        analysis_cache = null;
    }
}

/// Analyze jump destinations - public wrapper for ensure_analysis
pub fn analyze_jumpdests(self: *Self) void {
    self.ensure_analysis();
}
