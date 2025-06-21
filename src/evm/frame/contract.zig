//! Production-quality Contract module for EVM execution context.
//!
//! This module provides the core abstraction for contract execution in the EVM,
//! managing bytecode, gas accounting, storage access tracking, and JUMPDEST validation.
//! It incorporates performance optimizations from modern EVM implementations including
//! evmone, revm, and go-ethereum.
//!
//! ## Architecture
//! The Contract structure represents a single execution frame in the EVM call stack.
//! Each contract call (CALL, DELEGATECALL, STATICCALL, CREATE) creates a new Contract
//! instance that tracks its own gas, storage access, and execution state.
//!
//! ## Performance Characteristics
//! - **JUMPDEST validation**: O(log n) using binary search on pre-sorted positions
//! - **Storage access**: O(1) with warm/cold tracking for EIP-2929
//! - **Code analysis**: Cached globally with thread-safe access
//! - **Memory management**: Zero-allocation paths for common operations
//! - **Storage pooling**: Reuses hash maps to reduce allocation pressure
//!
//! ## Key Features
//! 1. **Code Analysis Caching**: Bytecode is analyzed once and cached globally
//! 2. **EIP-2929 Support**: Tracks warm/cold storage slots for gas calculation
//! 3. **Static Call Protection**: Prevents state modifications in read-only contexts
//! 4. **Gas Refund Tracking**: Manages gas refunds with EIP-3529 limits
//! 5. **Deployment Support**: Handles both CREATE and CREATE2 deployment flows
//!
//! ## Thread Safety
//! The global analysis cache uses mutex protection when multi-threaded,
//! automatically degrading to no-op mutexes in single-threaded builds.
//!
//! ## Memory Management
//! Contracts can optionally use a StoragePool to reuse hash maps across
//! multiple contract executions, significantly reducing allocation overhead
//! in high-throughput scenarios.
//!
//! ## Reference Implementations
//! - go-ethereum: https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go
//! - revm: https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/contract.rs
//! - evmone: https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp
const std = @import("std");
const builtin = @import("builtin");
const constants = @import("../constants/constants.zig");
const bitvec = @import("bitvec.zig");
const Address = @import("Address");
const ExecutionError = @import("../execution/execution_error.zig");
const CodeAnalysis = @import("code_analysis.zig");
const StoragePool = @import("storage_pool.zig");
const Log = @import("../log.zig");

/// Maximum gas refund allowed (EIP-3529)
const MAX_REFUND_QUOTIENT = 5;

/// Error types for Contract operations
pub const ContractError = std.mem.Allocator.Error || StorageOperationError;
pub const StorageOperationError = error{
    OutOfAllocatorMemory,
    InvalidStorageOperation,
};
pub const CodeAnalysisError = std.mem.Allocator.Error;

/// Global analysis cache
var analysis_cache: ?std.AutoHashMap([32]u8, *CodeAnalysis) = null;

// Comptime check for WASM target
const is_wasm = builtin.target.cpu.arch == .wasm32;

// Only include mutex for non-WASM builds
var cache_mutex = if (!is_wasm) std.Thread.Mutex{} else {};

/// Contract represents the execution context for a single call frame in the EVM.
///
/// Each contract execution (whether from external transaction, internal call,
/// or contract creation) operates within its own Contract instance. This design
/// enables proper isolation, gas accounting, and state management across the
/// call stack.
const Contract = @This();

// ============================================================================
// Identity and Context Fields
// ============================================================================

/// The address where this contract's code is deployed.
///
/// - For regular calls: The callee's address
/// - For DELEGATECALL: The current contract's address (code from elsewhere)
/// - For CREATE/CREATE2: Initially zero, set after address calculation
address: Address.Address,

/// The address that initiated this contract execution.
///
/// - For external transactions: The EOA that signed the transaction
/// - For internal calls: The contract that executed CALL/DELEGATECALL/etc
/// - For CREATE/CREATE2: The creating contract's address
///
/// Note: This is msg.sender in Solidity, not tx.origin
caller: Address.Address,

/// The amount of Wei sent with this contract call.
///
/// - Regular calls: Can be any amount (if not static)
/// - DELEGATECALL: Always 0 (uses parent's value)
/// - STATICCALL: Always 0 (no value transfer allowed)
/// - CREATE/CREATE2: Initial balance for new contract
value: u256,

// ============================================================================
// Code and Analysis Fields
// ============================================================================

/// The bytecode being executed in this context.
///
/// - Regular calls: The deployed contract's runtime bytecode
/// - CALLCODE/DELEGATECALL: The external contract's code
/// - CREATE/CREATE2: The initialization bytecode (constructor)
///
/// This slice is a view into existing memory, not owned by Contract.
code: []const u8,

/// Keccak256 hash of the contract bytecode.
///
/// Used for:
/// - Code analysis caching (avoids re-analyzing same bytecode)
/// - EXTCODEHASH opcode implementation
/// - CREATE2 address calculation
///
/// For deployments, this is set to zero as there's no deployed code yet.
code_hash: [32]u8,

/// Cached length of the bytecode for performance.
///
/// Storing this separately avoids repeated slice.len calls in hot paths
/// like bounds checking for PC and CODECOPY operations.
code_size: u64,

/// Optional reference to pre-computed code analysis.
///
/// Contains:
/// - JUMPDEST positions for O(log n) validation
/// - Code vs data segments (bitvector)
/// - Static analysis results (has CREATE, has SELFDESTRUCT, etc)
///
/// This is lazily computed on first jump and cached globally.
analysis: ?*const CodeAnalysis,

// ============================================================================
// Gas Tracking Fields
// ============================================================================

/// Remaining gas available for execution.
///
/// Decremented by each operation according to its gas cost.
/// If this reaches 0, execution halts with out-of-gas error.
///
/// Gas forwarding rules:
/// - CALL: Limited by 63/64 rule (EIP-150)
/// - DELEGATECALL/STATICCALL: Same rules as CALL
/// - CREATE/CREATE2: All remaining gas minus stipend
gas: u64,

/// Accumulated gas refund from storage operations.
///
/// Tracks gas to be refunded at transaction end from:
/// - SSTORE: Clearing storage slots
/// - SELFDESTRUCT: Contract destruction (pre-London)
///
/// Limited to gas_used / 5 by EIP-3529 (London hardfork).
gas_refund: u64,

// ============================================================================
// Input/Output Fields
// ============================================================================

/// Input data passed to this contract execution.
///
/// - External transactions: Transaction data field
/// - CALL/STATICCALL: Data passed in call
/// - DELEGATECALL: Data passed (preserves msg.data)
/// - CREATE/CREATE2: Constructor arguments
///
/// Accessed via CALLDATALOAD, CALLDATASIZE, CALLDATACOPY opcodes.
input: []const u8,

// ============================================================================
// Execution Flags
// ============================================================================

/// Indicates this is a contract deployment (CREATE/CREATE2).
///
/// When true:
/// - Executing initialization code (constructor)
/// - No deployed code exists at the address yet
/// - Result will be stored as contract code if successful
is_deployment: bool,

/// Indicates this is a system-level call.
///
/// System calls bypass certain checks and gas costs.
/// Used for precompiles and protocol-level operations.
is_system_call: bool,

/// Indicates read-only execution context (STATICCALL).
///
/// When true, these operations will fail:
/// - SSTORE (storage modification)
/// - LOG0-LOG4 (event emission)
/// - CREATE/CREATE2 (contract creation)
/// - SELFDESTRUCT (contract destruction)
/// - CALL with value transfer
is_static: bool,

// ============================================================================
// Storage Access Tracking (EIP-2929)
// ============================================================================

/// Tracks which storage slots have been accessed (warm vs cold).
///
/// EIP-2929 charges different gas costs:
/// - Cold access (first time): 2100 gas
/// - Warm access (subsequent): 100 gas
///
/// Key: storage slot, Value: true (accessed)
/// Can be borrowed from StoragePool for efficiency.
storage_access: ?*std.AutoHashMap(u256, bool),

/// Tracks original storage values for gas refund calculations.
///
/// Used by SSTORE to determine gas costs and refunds based on:
/// - Original value (at transaction start)
/// - Current value (in storage)
/// - New value (being set)
///
/// Key: storage slot, Value: original value
original_storage: ?*std.AutoHashMap(u256, u256),

/// Whether this contract address was cold at call start.
///
/// Used for EIP-2929 gas calculations:
/// - Cold contract: Additional 2600 gas for first access
/// - Warm contract: No additional cost
///
/// Contracts become warm after first access in a transaction.
is_cold: bool,

// ============================================================================
// Optimization Fields
// ============================================================================

/// Quick flag indicating if bytecode contains any JUMPDEST opcodes.
///
/// Enables fast-path optimization:
/// - If false, all jumps fail immediately (no valid destinations)
/// - If true, full JUMPDEST analysis is needed
///
/// Set during initialization by scanning bytecode.
has_jumpdests: bool,

/// Flag indicating empty bytecode.
///
/// Empty contracts (no code) are common in Ethereum:
/// - EOAs (externally owned accounts)
/// - Destroyed contracts
/// - Contracts that failed deployment
///
/// Enables fast-path for calls to codeless addresses.
is_empty: bool,

/// Creates a new Contract for executing existing deployed code.
///
/// This is the standard constructor for CALL, CALLCODE, DELEGATECALL,
/// and STATICCALL operations. The contract code must already exist
/// at the specified address.
///
/// ## Parameters
/// - `caller`: The address initiating this call (msg.sender)
/// - `addr`: The address where the code is deployed
/// - `value`: Wei being transferred (0 for DELEGATECALL/STATICCALL)
/// - `gas`: Gas allocated for this execution
/// - `code`: The contract bytecode to execute
/// - `code_hash`: Keccak256 hash of the bytecode
/// - `input`: Call data (function selector + arguments)
/// - `is_static`: Whether this is a read-only context
///
/// ## Example
/// ```zig
/// const contract = Contract.init(
///     caller_address,
///     contract_address,
///     value,
///     gas_limit,
///     bytecode,
///     bytecode_hash,
///     calldata,
///     false, // not static
/// );
/// ```
pub fn init(
    caller: Address.Address,
    addr: Address.Address,
    value: u256,
    gas: u64,
    code: []const u8,
    code_hash: [32]u8,
    input: []const u8,
    is_static: bool,
) Contract {
    return Contract{
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

/// Creates a new Contract for deploying new bytecode.
///
/// Used for CREATE and CREATE2 operations. The contract address
/// is initially zero and will be set by the VM after computing
/// the deployment address.
///
/// ## Parameters
/// - `caller`: The creating contract's address
/// - `value`: Initial balance for the new contract
/// - `gas`: Gas allocated for deployment
/// - `code`: Initialization bytecode (constructor)
/// - `salt`: Optional salt for CREATE2 (null for CREATE)
///
/// ## Address Calculation
/// - CREATE: address = keccak256(rlp([sender, nonce]))[12:]
/// - CREATE2: address = keccak256(0xff ++ sender ++ salt ++ keccak256(code))[12:]
///
/// ## Deployment Flow
/// 1. Execute initialization code
/// 2. Code returns runtime bytecode
/// 3. VM stores runtime bytecode at computed address
/// 4. Contract becomes callable at that address
///
/// ## Example
/// ```zig
/// // CREATE
/// const contract = Contract.init_deployment(
///     deployer_address,
///     initial_balance,
///     gas_limit,
///     init_bytecode,
///     null, // no salt for CREATE
/// );
/// ```
pub fn init_deployment(
    caller: Address.Address,
    value: u256,
    gas: u64,
    code: []const u8,
    salt: ?[32]u8,
) Contract {
    const contract = Contract{
        .address = Address.zero(),
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = code,
        .code_hash = [_]u8{0} ** 32, // Deployment doesn't have code hash. This could be kekkac256(0) instead of 0
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

    if (salt == null) return contract;
    // Salt is used for CREATE2 address calculation
    // The actual address calculation happens in the VM's create2_contract method

    return contract;
}

/// Performs a quick scan to check if bytecode contains any JUMPDEST opcodes.
///
/// This is a fast O(n) scan used during contract initialization to set
/// the `has_jumpdests` flag. If no JUMPDESTs exist, we can skip all
/// jump validation as any JUMP/JUMPI will fail.
///
/// ## Note
/// This doesn't account for JUMPDEST bytes inside PUSH data.
/// Full analysis is deferred until actually needed (lazy evaluation).
///
/// ## Returns
/// - `true`: At least one 0x5B byte found
/// - `false`: No JUMPDEST opcodes present
fn contains_jumpdest(code: []const u8) bool {
    for (code) |op| {
        if (op == constants.JUMPDEST) return true;
    }
    return false;
}

/// Validates if a jump destination is valid within the contract bytecode.
///
/// A valid jump destination must:
/// 1. Be within code bounds (< code_size)
/// 2. Point to a JUMPDEST opcode (0x5B)
/// 3. Not be inside PUSH data (validated by code analysis)
///
/// ## Parameters
/// - `allocator`: Allocator for lazy code analysis
/// - `dest`: Target program counter from JUMP/JUMPI
///
/// ## Returns
/// - `true`: Valid JUMPDEST at the target position
/// - `false`: Invalid destination (out of bounds, not JUMPDEST, or in data)
///
/// ## Performance
/// - Fast path: Empty code or no JUMPDESTs (immediate false)
/// - Analyzed code: O(log n) binary search
/// - First jump: O(n) analysis then O(log n) search
///
/// ## Example
/// ```zig
/// if (!contract.valid_jumpdest(allocator, jump_target)) {
///     return ExecutionError.InvalidJump;
/// }
/// ```
pub fn valid_jumpdest(self: *Contract, allocator: std.mem.Allocator, dest: u256) bool {
    // Fast path: empty code or out of bounds
    if (self.is_empty or dest >= self.code_size) return false;

    // Fast path: no JUMPDESTs in code
    if (!self.has_jumpdests) return false;
    const pos: u32 = @intCast(@min(dest, std.math.maxInt(u32)));

    // Ensure analysis is performed
    self.ensure_analysis(allocator);

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
    // Fallback: check if position is code and contains JUMPDEST opcode
    if (self.is_code(pos) and pos < self.code_size) {
        return self.code[@intCast(pos)] == constants.JUMPDEST;
    }
    return false;
}

/// Ensure code analysis is performed
fn ensure_analysis(self: *Contract, allocator: std.mem.Allocator) void {
    if (self.analysis == null and !self.is_empty) {
        self.analysis = analyze_code(allocator, self.code, self.code_hash) catch |err| {
            // Log analysis failure for debugging - but continue execution
            Log.debug("Contract.ensure_analysis: analyze_code failed: {any}", .{err});
            return;
        };
    }
}

/// Check if position is code (not data)
pub fn is_code(self: *const Contract, pos: u64) bool {
    if (self.analysis) |analysis| {
        // We know pos is within bounds if analysis exists, so use unchecked version
        return analysis.code_segments.is_set_unchecked(@intCast(pos));
    }
    return true;
}

/// Attempts to consume gas from the contract's available gas.
///
/// This is the primary gas accounting method, called before every
/// operation to ensure sufficient gas remains.
///
/// ## Parameters
/// - `amount`: Gas units to consume
///
/// ## Returns
/// - `true`: Gas successfully deducted
/// - `false`: Insufficient gas (triggers out-of-gas error)
///
/// ## Usage
/// ```zig
/// if (!contract.use_gas(operation_cost)) {
///     return ExecutionError.OutOfGas;
/// }
/// ```
pub fn use_gas(self: *Contract, amount: u64) bool {
    if (self.gas < amount) return false;
    self.gas -= amount;
    return true;
}

/// Use gas without checking (when known safe)
pub fn use_gas_unchecked(self: *Contract, amount: u64) void {
    self.gas -= amount;
}

/// Refund gas to contract
pub fn refund_gas(self: *Contract, amount: u64) void {
    self.gas += amount;
}

/// Add to gas refund counter with clamping
pub fn add_gas_refund(self: *Contract, amount: u64) void {
    const max_refund = self.gas / MAX_REFUND_QUOTIENT;
    self.gas_refund = @min(self.gas_refund + amount, max_refund);
}

/// Subtract from gas refund counter with clamping
pub fn sub_gas_refund(self: *Contract, amount: u64) void {
    self.gas_refund = if (self.gas_refund > amount) self.gas_refund - amount else 0;
}

pub const MarkStorageSlotWarmError = error{
    OutOfAllocatorMemory,
};

/// Mark storage slot as warm with pool support
pub fn mark_storage_slot_warm(self: *Contract, allocator: std.mem.Allocator, slot: u256, pool: ?*StoragePool) MarkStorageSlotWarmError!bool {
    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = p.borrow_access_map() catch |err| switch (err) {
                StoragePool.BorrowAccessMapError.OutOfAllocatorMemory => {
                    Log.debug("Contract.mark_storage_slot_warm: failed to borrow access map: {any}", .{err});
                    return MarkStorageSlotWarmError.OutOfAllocatorMemory;
                },
            };
        } else {
            self.storage_access = allocator.create(std.AutoHashMap(u256, bool)) catch |err| {
                Log.debug("Contract.mark_storage_slot_warm: allocation failed: {any}", .{err});
                return MarkStorageSlotWarmError.OutOfAllocatorMemory;
            };
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(allocator);
        }
    }

    const map = self.storage_access.?;
    const was_cold = !map.contains(slot);
    if (was_cold) {
        map.put(slot, true) catch |err| {
            Log.debug("Contract.mark_storage_slot_warm: map.put failed: {any}", .{err});
            return MarkStorageSlotWarmError.OutOfAllocatorMemory;
        };
    }
    return was_cold;
}

/// Check if storage slot is cold
pub fn is_storage_slot_cold(self: *const Contract, slot: u256) bool {
    if (self.storage_access) |map| {
        return !map.contains(slot);
    }
    return true;
}

/// Batch mark storage slots as warm
pub fn mark_storage_slots_warm(self: *Contract, allocator: std.mem.Allocator, slots: []const u256, pool: ?*StoragePool) ContractError!void {
    if (slots.len == 0) return;

    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = p.borrow_access_map() catch |err| {
                Log.debug("Failed to borrow access map from pool: {any}", .{err});
                return switch (err) {
                    StoragePool.BorrowAccessMapError.OutOfAllocatorMemory => StorageOperationError.OutOfAllocatorMemory,
                };
            };
        } else {
            self.storage_access = allocator.create(std.AutoHashMap(u256, bool)) catch |err| {
                Log.debug("Failed to create storage access map: {any}", .{err});
                return switch (err) {
                    std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
                };
            };
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(allocator);
        }
    }

    const map = self.storage_access.?;
    map.ensureTotalCapacity(@as(u32, @intCast(map.count() + slots.len))) catch |err| {
        Log.debug("Failed to ensure capacity for {d} storage slots: {any}", .{ slots.len, err });
        return switch (err) {
            std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
        };
    };

    for (slots) |slot| {
        map.putAssumeCapacity(slot, true);
    }
}

/// Store original storage value
pub fn set_original_storage_value(self: *Contract, allocator: std.mem.Allocator, slot: u256, value: u256, pool: ?*StoragePool) ContractError!void {
    if (self.original_storage == null) {
        if (pool) |p| {
            self.original_storage = p.borrow_storage_map() catch |err| {
                Log.debug("Failed to borrow storage map from pool: {any}", .{err});
                return switch (err) {
                    StoragePool.BorrowStorageMapError.OutOfAllocatorMemory => StorageOperationError.OutOfAllocatorMemory,
                };
            };
        } else {
            self.original_storage = allocator.create(std.AutoHashMap(u256, u256)) catch |err| {
                Log.debug("Failed to create original storage map: {any}", .{err});
                return switch (err) {
                    std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
                };
            };
            self.original_storage.?.* = std.AutoHashMap(u256, u256).init(allocator);
        }
    }

    self.original_storage.?.put(slot, value) catch |err| {
        Log.debug("Failed to store original storage value for slot {d}: {any}", .{ slot, err });
        return switch (err) {
            std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
        };
    };
}

/// Get original storage value
pub fn get_original_storage_value(self: *const Contract, slot: u256) ?u256 {
    if (self.original_storage) |map| {
        return map.get(slot);
    }
    return null;
}

pub fn get_op(self: *const Contract, n: u64) u8 {
    return if (n < self.code_size) self.code[@intCast(n)] else constants.STOP;
}

/// Get opcode at position without bounds check
pub fn get_op_unchecked(self: *const Contract, n: u64) u8 {
    return self.code[n];
}

/// Set call code (for CALLCODE/DELEGATECALL)
pub fn set_call_code(self: *Contract, hash: [32]u8, code: []const u8) void {
    self.code = code;
    self.code_hash = hash;
    self.code_size = code.len;
    self.has_jumpdests = contains_jumpdest(code);
    self.is_empty = code.len == 0;
    self.analysis = null;
}

/// Clean up contract resources
pub fn deinit(self: *Contract, allocator: std.mem.Allocator, pool: ?*StoragePool) void {
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
        if (self.storage_access) |map| {
            map.deinit();
            allocator.destroy(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            map.deinit();
            allocator.destroy(map);
            self.original_storage = null;
        }
    }
    // Analysis is typically cached globally, so don't free
}

/// Analyzes bytecode and caches the results globally for reuse.
///
/// This function performs comprehensive static analysis on EVM bytecode:
/// 1. Identifies code vs data segments (for JUMPDEST validation)
/// 2. Extracts and sorts all JUMPDEST positions
/// 3. Detects special opcodes (CREATE, SELFDESTRUCT, dynamic jumps)
/// 4. Caches results by code hash for reuse
///
/// ## Parameters
/// - `allocator`: Memory allocator for analysis structures
/// - `code`: The bytecode to analyze
/// - `code_hash`: Hash for cache lookup/storage
///
/// ## Returns
/// Pointer to CodeAnalysis (cached or newly created)
///
/// ## Performance
/// - First analysis: O(n) where n is code length
/// - Subsequent calls: O(1) cache lookup
/// - Thread-safe with mutex protection
///
/// ## Caching Strategy
/// Analysis results are cached globally by code hash. This is highly
/// effective as the same contract code is often executed many times
/// across different addresses (e.g., proxy patterns, token contracts).
///
/// ## Example
/// ```zig
/// const analysis = try Contract.analyze_code(
///     allocator,
///     bytecode,
///     bytecode_hash,
/// );
/// // Analysis is now cached for future use
/// ```
pub fn analyze_code(allocator: std.mem.Allocator, code: []const u8, code_hash: [32]u8) CodeAnalysisError!*const CodeAnalysis {
    if (comptime !is_wasm) {
        cache_mutex.lock();
        defer cache_mutex.unlock();
    }

    if (analysis_cache == null) {
        analysis_cache = std.AutoHashMap([32]u8, *CodeAnalysis).init(allocator);
    }

    if (analysis_cache.?.get(code_hash)) |cached| {
        return cached;
    }

    const analysis = allocator.create(CodeAnalysis) catch |err| {
        Log.debug("Failed to allocate CodeAnalysis: {any}", .{err});
        return err;
    };

    analysis.code_segments = try bitvec.code_bitmap(allocator, code);

    var jumpdests = std.ArrayList(u32).init(allocator);
    defer jumpdests.deinit();

    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];

        if (op == constants.JUMPDEST and analysis.code_segments.is_set_unchecked(i)) {
            jumpdests.append(@as(u32, @intCast(i))) catch |err| {
                Log.debug("Failed to append jumpdest position {d}: {any}", .{ i, err });
                return err;
            };
        }

        if (constants.is_push(op)) {
            const push_size = constants.get_push_size(op);
            i += push_size + 1;
        } else {
            i += 1;
        }
    }

    // Sort for binary search
    std.mem.sort(u32, jumpdests.items, {}, comptime std.sort.asc(u32));
    analysis.jumpdest_positions = jumpdests.toOwnedSlice() catch |err| {
        Log.debug("Failed to convert jumpdests to owned slice: {any}", .{err});
        return err;
    };

    analysis.max_stack_depth = 0;
    analysis.block_gas_costs = null;
    analysis.has_dynamic_jumps = contains_op(code, &[_]u8{ constants.JUMP, constants.JUMPI });
    analysis.has_static_jumps = false;
    analysis.has_selfdestruct = contains_op(code, &[_]u8{constants.SELFDESTRUCT});
    analysis.has_create = contains_op(code, &[_]u8{ constants.CREATE, constants.CREATE2 });

    analysis_cache.?.put(code_hash, analysis) catch |err| {
        Log.debug("Failed to cache code analysis: {any}", .{err});
        // Continue without caching - return the analysis anyway
    };

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
pub fn clear_analysis_cache(allocator: std.mem.Allocator) void {
    if (comptime !is_wasm) {
        cache_mutex.lock();
        defer cache_mutex.unlock();
    }

    if (analysis_cache) |*cache| {
        var iter = cache.iterator();
        while (iter.next()) |entry| {
            entry.value_ptr.*.deinit(allocator);
            allocator.destroy(entry.value_ptr.*);
        }
        cache.deinit();
        analysis_cache = null;
    }
}

/// Analyze jump destinations - public wrapper for ensure_analysis
pub fn analyze_jumpdests(self: *Contract, allocator: std.mem.Allocator) void {
    self.ensure_analysis(allocator);
}

/// Create a contract to execute bytecode at a specific address
/// This is useful for testing or executing code that should be treated as if it's deployed at an address
/// The caller must separately call vm.state.set_code(address, bytecode) to deploy the code
pub fn init_at_address(
    caller: Address.Address,
    address: Address.Address,
    value: u256,
    gas: u64,
    bytecode: []const u8,
    input: []const u8,
    is_static: bool,
) Contract {
    // Calculate code hash for the bytecode
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    return Contract{
        .address = address,
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = bytecode,
        .code_hash = code_hash,
        .code_size = bytecode.len,
        .input = input,
        .is_static = is_static,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = true,
        .gas_refund = 0,
        .is_deployment = false,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(bytecode),
        .is_empty = bytecode.len == 0,
    };
}
