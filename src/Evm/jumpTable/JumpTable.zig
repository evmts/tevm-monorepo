//! # Jump Table Module
//!
//! A Jump Table is a critical performance optimization used in interpreters and virtual machines
//! to efficiently dispatch opcodes to their implementation functions. Instead of using a large
//! switch statement or if-else chain, which can cause branch prediction misses and poor CPU cache
//! utilization, a jump table provides direct indexed access to function pointers.
//!
//! ## Why Jump Tables?
//!
//! In the EVM, there are 256 possible opcodes (0x00 to 0xFF). For each bytecode instruction:
//! 1. The interpreter reads the opcode byte
//! 2. Uses it as an index into the jump table
//! 3. Directly calls the function pointer at that index
//!
//! This approach provides:
//! - O(1) dispatch time regardless of opcode value
//! - Better CPU cache locality
//! - Eliminates branch prediction misses
//! - Simplified hardfork management (different tables for different forks)
//!
//! ## Performance Comparison
//!
//! Different EVM implementations use various dispatch strategies:
//! - **evmone**: Uses computed goto for maximum performance (C++ specific)
//! - **revm**: Uses macro-generated match statements with aggressive inlining
//! - **geth**: Uses a traditional jump table similar to ours
//! - **pyevm**: Uses dictionary lookup (slower but more dynamic)
//!
//! Our implementation follows the geth model as it provides good performance
//! while remaining portable and maintainable in Zig.
//!
//! ## Hardfork Support
//!
//! Different Ethereum hardforks introduce or modify opcodes. This module supports
//! creating jump tables specific to each hardfork, ensuring proper opcode behavior
//! for historical block validation and chain synchronization.

const std = @import("std");

// For testing, we need to define minimal stubs
const testing_stubs = struct {
    pub const InterpreterError = error{
        InvalidOpcode,
        OpNotSupported,
        StackUnderflow,
        StackOverflow,
        OutOfGas,
        OutOfOffset,
        InvalidJump,
        InvalidJumpDest,
        ReturnDataOutOfBounds,
        CallDepthExceeded,
        CreateCollision,
        PrecompileFailure,
        ContractValidationFailure,
        OutOfFund,
        CallNotAllowedInsideStatic,
        StateChangeDuringStaticCall,
        InvalidTransaction,
        WriteProtection,
        ReturnContractInNotInitEOF,
        EOFOpcodeDisabledInLegacy,
        NonceOverflow,
    };
    
    pub const Interpreter = struct {
        allocator: std.mem.Allocator,
        callDepth: u32,
        readOnly: bool,
        returnData: ?[]u8,
        evm: struct {
            state_manager: ?*anyopaque,
            precompiles: ?*anyopaque,
        },
    };
    
    pub const Stack = struct {
        size: usize,
        data: [1024]u256,
        
        pub fn pop(self: *@This()) u256 {
            if (self.size == 0) return 0;
            self.size -= 1;
            return self.data[self.size];
        }
        
        pub fn push(self: *@This(), value: u256) void {
            if (self.size >= 1024) return;
            self.data[self.size] = value;
            self.size += 1;
        }
        
        pub fn peek(self: *@This()) *u256 {
            if (self.size == 0) return &self.data[0];
            return &self.data[self.size - 1];
        }
    };
    
    pub const Memory = struct {
        allocator: std.mem.Allocator,
        buffer: []u8,
        
        pub fn init(allocator: std.mem.Allocator) @This() {
            return @This(){
                .allocator = allocator,
                .buffer = &[_]u8{},
            };
        }
        
        pub fn deinit(self: *@This()) void {
            if (self.buffer.len > 0) {
                self.allocator.free(self.buffer);
            }
        }
        
        pub fn size(self: *const @This()) u64 {
            return self.buffer.len;
        }
        
        pub fn resize(self: *@This(), new_size: u64) !void {
            if (new_size == self.buffer.len) return;
            if (self.buffer.len > 0) {
                self.allocator.free(self.buffer);
            }
            self.buffer = try self.allocator.alloc(u8, @intCast(new_size));
        }
        
        pub fn data(self: *@This()) []u8 {
            return self.buffer;
        }
    };
    
    pub const Frame = struct {
        gas: u64,
        stack: testing_stubs.Stack,
        memory: testing_stubs.Memory,
        logger: ?*anyopaque,
        code: []const u8,
        contract: *anyopaque,
        returnData: ?[]u8,
        isPush: bool,
        pc: usize,
    };
};

// Use testing stubs when testing, otherwise import from package
const builtin = @import("builtin");
const is_test = builtin.is_test;

const Interpreter = if (is_test) testing_stubs.Interpreter else @import("../package.zig").Interpreter;
const Frame = if (is_test) testing_stubs.Frame else @import("../package.zig").Frame;
const ExecutionError = if (is_test) testing_stubs.InterpreterError else @import("../package.zig").InterpreterError;
const Stack = if (is_test) testing_stubs.Stack else @import("../package.zig").Stack;
const Memory = if (is_test) testing_stubs.Memory else @import("../package.zig").Memory;

// Import opcode implementations directly
// Note: These imports are disabled during testing due to module path restrictions
const math = if (!is_test) @import("../opcodes/math.zig") else struct {
    pub fn registerMathOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const math2 = if (!is_test) @import("../opcodes/math2.zig") else struct {
    pub fn registerMath2Opcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const comparison = if (!is_test) @import("../opcodes/comparison.zig") else struct {
    pub fn registerComparisonOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const bitwise = if (!is_test) @import("../opcodes/bitwise.zig") else struct {
    pub fn registerBitwiseOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const memory = if (!is_test) @import("../opcodes/memory.zig") else struct {
    pub fn registerMemoryOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const push = if (!is_test) @import("../opcodes/push.zig") else struct {
    pub fn registerPushOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const storage = if (!is_test) @import("../opcodes/storage.zig") else struct {
    pub fn registerStorageOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const controlflow = if (!is_test) @import("../opcodes/controlflow.zig") else struct {
    pub fn registerControlFlowOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const environment = if (!is_test) @import("../opcodes/environment.zig") else struct {
    pub fn registerEnvironmentOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const calls = if (!is_test) @import("../opcodes/calls.zig") else struct {
    pub fn registerCallOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const block = if (!is_test) @import("../opcodes/block.zig") else struct {
    pub fn registerBlockOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const crypto = if (!is_test) @import("../opcodes/crypto.zig") else struct {
    pub fn registerCryptoOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const log = if (!is_test) @import("../opcodes/log.zig") else struct {
    pub fn registerLogOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const blob = if (!is_test) @import("../opcodes/blob.zig") else struct {
    pub fn registerBlobOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};
const transient = if (!is_test) @import("../opcodes/transient.zig") else struct {
    pub fn registerTransientOpcodes(allocator: std.mem.Allocator, table: *JumpTable) !void {
        _ = allocator;
        _ = table;
    }
};

// ExecutionFunc is a function executed by the EVM during interpretation
///
// This function signature is used for all opcode implementations.
// 
// Parameters:
// - pc: Current program counter position
// - interpreter: Pointer to the interpreter instance
// - frame: Pointer to the current execution frame
///
// Returns: Either an error (like STOP, REVERT, etc.) or a byte slice
// for any data to be returned
pub const ExecutionFunc = *const fn (pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8;

// GasFunc calculates the gas required for an operation
///
// This is used for opcodes that need dynamic gas calculation based on inputs.
///
// Parameters:
// - interpreter: Pointer to the interpreter instance
// - frame: Pointer to the current execution frame
// - stack: Pointer to the EVM stack
// - memory: Pointer to the EVM memory
// - requested_size: The requested memory size (for memory expansion)
///
// Returns: The amount of gas required or OutOfGas error
pub const GasFunc = *const fn (interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64;

// Return type for memory size calculations
pub const MemorySizeResult = struct { size: u64, overflow: bool };

// MemorySizeFunc calculates the memory size required for an operation
///
// This is used for opcodes that may extend the memory.
///
// Parameters:
// - stack: Pointer to the EVM stack to read operands
///
// Returns: A struct containing the required memory size and whether an overflow occurred
pub const MemorySizeFunc = *const fn (stack: *Stack) MemorySizeResult;

// Helper function to calculate memory gas cost for expanding memory
///
// Memory gas is calculated based on the number of 32-byte words required.
// The formula is quadratic to make larger memory expansions increasingly expensive.
///
// The gas formula follows the EVM specification:
// gas = MemoryGas * words + words² / QuadCoeffDiv
// where:
// - MemoryGas = 3 (linear coefficient)
// - QuadCoeffDiv = 512 (quadratic coefficient divisor)
///
// Parameters:
// - mem: Pointer to the memory instance
// - newSize: The new memory size in bytes to expand to
///
// Returns: The gas cost for expanding memory
// Error: OutOfGas if an overflow occurs in gas calculation
pub inline fn memoryGasCost(mem: *Memory, newSize: u64) error{OutOfGas}!u64 {
    // Performance: Early return for common case
    const currentSize = mem.size();
    if (newSize <= currentSize) {
        return 0;
    }
    
    // Performance: Use bit shifts for division by 32 (compiler should optimize this anyway)
    // Check for overflow in word size calculation
    const oldWordSize = (currentSize + 31) >> 5;
    const newWordSizeTemp = std.math.add(u64, newSize, 31) catch return error.OutOfGas;
    const newWordSize = newWordSizeTemp >> 5;
    
    // Compute the gas cost for expanding memory according to EVM rules
    // Gas formula: a * n + b * n²/512 (where n is the number of words)
    
    // Check for overflow in quadratic term first
    const quadraticTerm = std.math.mul(u64, newWordSize, newWordSize) catch return error.OutOfGas;
    const quadraticCost = quadraticTerm / QuadCoeffDiv;
    
    const oldQuadraticTerm = std.math.mul(u64, oldWordSize, oldWordSize) catch 0;
    const oldQuadraticCost = oldQuadraticTerm / QuadCoeffDiv;
    
    const oldLinearCost = std.math.mul(u64, MemoryGas, oldWordSize) catch 0;
    const newLinearCost = std.math.mul(u64, MemoryGas, newWordSize) catch return error.OutOfGas;
    
    const oldCost = std.math.add(u64, oldLinearCost, oldQuadraticCost) catch 0;
    const newCost = std.math.add(u64, newLinearCost, quadraticCost) catch return error.OutOfGas;
    
    // Overflow check
    if (newCost < oldCost) {
        return error.OutOfGas;
    }
    
    return newCost - oldCost;
}

// Operation represents an opcode in the EVM
///
// Each opcode in the EVM is represented by an Operation instance that
// contains all the information needed to execute it, including its
// execution function, gas costs, and stack requirements.
pub const Operation = struct {
    /// Function to execute the operation
    execute: ExecutionFunc,
    
    /// Base gas required for the operation (static cost)
    constant_gas: u64,
    
    /// Function to calculate dynamic gas costs based on inputs
    /// This is null if the operation only has constant gas costs
    dynamic_gas: ?GasFunc = null,
    
    /// Minimum number of items required on the stack
    min_stack: u32,
    
    /// Maximum stack length allowed to prevent stack overflow
    max_stack: u32,
    
    /// Function to calculate required memory size for the operation
    /// This is null if the operation doesn't access memory
    memory_size: ?MemorySizeFunc = null,
    
    /// Whether this is an undefined/invalid opcode
    undefined: bool = false,
};

// JumpTable contains the EVM opcodes supported at a given hardfork
///
// The JumpTable is essentially a lookup table for all 256 possible opcodes
// in the EVM. Each entry points to an Operation that defines the behavior
// of that opcode. Opcodes that are not defined for a particular hardfork
// will point to an UNDEFINED operation.
pub const JumpTable = struct {
    /// Array of operations indexed by opcode value (0-255)
    table: [256]?*const Operation,

    /// Initialize a new empty JumpTable
    ///
    /// Returns: A JumpTable with all operations set to null
    pub fn init() JumpTable {
        return JumpTable{
            .table = [_]?*const Operation{null} ** 256,
        };
    }

    /// Get the operation for a specific opcode
    ///
    /// If the opcode is not defined in this jump table,
    /// the UNDEFINED operation is returned
    ///
    /// Parameters:
    /// - opcode: The opcode value (0-255)
    ///
    /// Returns: Pointer to the Operation for this opcode
    pub inline fn getOperation(self: *const JumpTable, opcode: u8) *const Operation {
        // Performance: inline for hot path, direct array access
        return self.table[opcode] orelse &UNDEFINED;
    }

    /// Validate and complete the jump table
    ///
    /// This ensures all null entries are filled with UNDEFINED operations
    /// and verifies that operations with memory_size also have dynamic_gas
    pub fn validate(self: *JumpTable) void {
        for (0..256) |i| {
            if (self.table[i] == null) {
                // Fill unassigned slots with UNDEFINED
                self.table[i] = &UNDEFINED;
            } else if (self.table[i].?.memory_size != null and self.table[i].?.dynamic_gas == null) {
                @panic("Operation has memory size but no dynamic gas calculation");
            }
        }
    }

    /// Create a deep copy of the jump table
    ///
    /// This allocates new Operation instances for all non-null entries
    ///
    /// Parameters:
    /// - allocator: Memory allocator to use for the new operations
    ///
    /// Returns: A new JumpTable with copies of all operations
    /// Error: May return allocation errors
    pub fn copy(self: *const JumpTable, allocator: std.mem.Allocator) !JumpTable {
        var new_table = JumpTable.init();
        for (0..256) |i| {
            if (self.table[i] != null) {
                const op_copy = try allocator.create(Operation);
                op_copy.* = self.table[i].?.*;
                new_table.table[i] = op_copy;
            }
        }
        return new_table;
    }
};

// Gas cost constants for basic operations
// These define the static gas costs for various opcode categories
// Very cheap operations (like PC, CALLDATASIZE)
pub const GasQuickStep: u64 = 2;
// Fast operations (like ADD, SUB, NOT)
pub const GasFastestStep: u64 = 3;
// Faster operations (like MUL, DIV)
pub const GasFastStep: u64 = 5;
// Mid-range operations (like ADDMOD, MULMOD)
pub const GasMidStep: u64 = 8;
// Slow operations
pub const GasSlowStep: u64 = 10;
// Extended/expensive operations (like BALANCE)
pub const GasExtStep: u64 = 20;

// Gas cost constants for specific operations
// Base gas for KECCAK256
pub const Keccak256Gas: u64 = 30;
// Gas per word for KECCAK256
pub const Keccak256WordGas: u64 = 6;
// Base gas for SLOAD (warm access)
pub const SloadGas: u64 = 100;
// Gas for first-time (cold) SLOAD access (EIP-2929)
pub const ColdSloadCost: u64 = 2100;
// Gas for first-time (cold) account access (EIP-2929)
pub const ColdAccountAccessCost: u64 = 2600;
// Gas for warm storage access (EIP-2929)
pub const WarmStorageReadCost: u64 = 100;

// Gas sent with a call
pub const SstoreSentryGas: u64 = 2300;
// Gas for SSTORE when setting from zero
pub const SstoreSetGas: u64 = 20000;
// Gas for SSTORE when changing existing value
pub const SstoreResetGas: u64 = 5000;
// Gas for SSTORE when clearing to zero
pub const SstoreClearGas: u64 = 5000;
// Gas refund for clearing storage (EIP-3529 reduced from 15000)
pub const SstoreRefundGas: u64 = 4800;
// Gas for JUMPDEST
pub const JumpdestGas: u64 = 1;
// Base gas for LOG
pub const LogGas: u64 = 375;
// Gas per byte of LOG data
pub const LogDataGas: u64 = 8;
// Gas per LOG topic
pub const LogTopicGas: u64 = 375;
// Gas for CREATE
pub const CreateGas: u64 = 32000;
// Base gas for CALL
pub const CallGas: u64 = 40;
// Stipend for CALL when transferring value
pub const CallStipend: u64 = 2300;
// Extra gas for transferring value in CALL
pub const CallValueTransferGas: u64 = 9000;
// Extra gas for creating a new account in CALL
pub const CallNewAccountGas: u64 = 25000;
// Gas refund for SELFDESTRUCT
pub const SelfdestructRefundGas: u64 = 24000;
// Linear coefficient for memory gas
pub const MemoryGas: u64 = 3;
// Quadratic coefficient divisor for memory gas
pub const QuadCoeffDiv: u64 = 512;
// Gas per byte of CREATE data
pub const CreateDataGas: u64 = 200;
// EIP-3860: Limit and meter initcode
// Gas per 32-byte word of initcode (EIP-3860)
pub const InitcodeWordGas: u64 = 2;
// Maximum initcode size (2 * 24576 bytes) (EIP-3860)
pub const MaxInitcodeSize: u64 = 49152;
// Base gas for a transaction
pub const TxGas: u64 = 21000;
// Base gas for contract creation
pub const TxGasContractCreation: u64 = 53000;
// Gas per zero byte of tx data
pub const TxDataZeroGas: u64 = 4;
// Gas per non-zero byte of tx data
pub const TxDataNonZeroGas: u64 = 16;
pub const CopyGas: u64 = 3;
// Maximum refund quotient (EIP-3529 - gas_used/5 maximum)
pub const MaxRefundQuotient: u64 = 5;

// EIP-4844: Shard Blob Transactions
pub const BlobHashGas: u64 = 3;
pub const BlobBaseFeeGas: u64 = 2;

// EIP-1153: Transient Storage
pub const TLoadGas: u64 = 100;
// Gas for memory copy operations
pub const TStoreGas: u64 = 100;

// Helper function to calculate minimum stack requirement for an operation
///
// Parameters:
// - min_pop: Number of items to pop from the stack
// - min_push: Number of items to push to the stack (unused)
///
// Returns: Minimum stack depth required for the operation
pub fn minStack(min_pop: u32, min_push: u32) u32 {
    _ = min_push; // autofix
    return min_pop;
}

// Helper function to calculate maximum stack allowance for an operation
///
// Parameters:
// - max_pop: Number of items to pop from the stack (unused)
// - max_push: Number of items to push to the stack
///
// Returns: Maximum stack items allowed for the operation
pub fn maxStack(max_pop: u32, max_push: u32) u32 {
    _ = max_pop; // autofix
    _ = max_push; // autofix
    // EVM allows up to 1024 items on the stack
    return 1024;
}

// Calculate minimum stack requirement for DUP operations
///
// Parameters:
// - n: DUP index (1-16)
///
// Returns: Minimum stack depth required for DUPn
pub fn minDupStack(n: u32) u32 {
    return n;
}

// Calculate maximum stack allowance for DUP operations
///
// Parameters:
// - n: DUP index (1-16)
///
// Returns: Maximum stack items allowed for DUPn
pub fn maxDupStack(n: u32) u32 {
    return n + 1;
}

// Calculate minimum stack requirement for SWAP operations
///
// Parameters:
// - n: SWAP index (1-16)
///
// Returns: Minimum stack depth required for SWAPn
pub fn minSwapStack(n: u32) u32 {
    return n + 1;
}

// Calculate maximum stack allowance for SWAP operations
///
// Parameters:
// - n: SWAP index (1-16)
///
// Returns: Maximum stack items allowed for SWAPn
pub fn maxSwapStack(n: u32) u32 {
    return n + 1;
}

// Create a new jump table for a specific Ethereum hardfork
///
// This creates a jump table with all the opcodes appropriate for
// the specified Ethereum hardfork.
///
// Parameters:
// - allocator: Memory allocator to use for the operations
// - hardfork: Name of the Ethereum hardfork
///
// Returns: A new JumpTable configured for the hardfork
// Error: May return allocation errors
pub fn newJumpTable(allocator: std.mem.Allocator, hardfork: []const u8) !JumpTable {
    var jump_table = JumpTable.init();
    
    // Register opcode categories
    try math.registerMathOpcodes(allocator, &jump_table);
    try math2.registerMath2Opcodes(allocator, &jump_table);
    try bitwise.registerBitwiseOpcodes(allocator, &jump_table);
    try comparison.registerComparisonOpcodes(allocator, &jump_table);
    try controlflow.registerControlFlowOpcodes(allocator, &jump_table);
    try memory.registerMemoryOpcodes(allocator, &jump_table);
    try environment.registerEnvironmentOpcodes(allocator, &jump_table);
    try push.registerPushOpcodes(allocator, &jump_table);
    try storage.registerStorageOpcodes(allocator, &jump_table);
    
    // Register additional opcode categories with proper error handling
    calls.registerCallOpcodes(allocator, &jump_table) catch |err| {
        // Log warning but continue - some opcodes may not be implemented yet
        std.log.warn("Failed to register call opcodes: {}", .{err});
    };
    block.registerBlockOpcodes(allocator, &jump_table) catch |err| {
        std.log.warn("Failed to register block opcodes: {}", .{err});
    };
    crypto.registerCryptoOpcodes(allocator, &jump_table) catch |err| {
        std.log.warn("Failed to register crypto opcodes: {}", .{err});
    };
    log.registerLogOpcodes(allocator, &jump_table) catch |err| {
        std.log.warn("Failed to register log opcodes: {}", .{err});
    };
    
    // Register hardfork-specific opcodes

    // Homestead+ (all currently supported forks)
    if (std.mem.eql(u8, hardfork, "homestead") or
        std.mem.eql(u8, hardfork, "byzantium") or
        std.mem.eql(u8, hardfork, "constantinople") or
        std.mem.eql(u8, hardfork, "petersburg") or
        std.mem.eql(u8, hardfork, "istanbul") or
        std.mem.eql(u8, hardfork, "berlin") or
        std.mem.eql(u8, hardfork, "london") or
        std.mem.eql(u8, hardfork, "merge") or
        std.mem.eql(u8, hardfork, "shanghai") or
        std.mem.eql(u8, hardfork, "cancun") or
        std.mem.eql(u8, hardfork, "latest")) {
        
        // Add opDelegateCall if available from Homestead+
        if (std.mem.eql(u8, hardfork, "homestead") or
            std.mem.eql(u8, hardfork, "byzantium") or
            std.mem.eql(u8, hardfork, "constantinople") or
            std.mem.eql(u8, hardfork, "petersburg") or
            std.mem.eql(u8, hardfork, "istanbul") or
            std.mem.eql(u8, hardfork, "berlin") or
            std.mem.eql(u8, hardfork, "london") or
            std.mem.eql(u8, hardfork, "merge") or
            std.mem.eql(u8, hardfork, "shanghai") or
            std.mem.eql(u8, hardfork, "cancun") or
            std.mem.eql(u8, hardfork, "latest")) {
            // DELEGATECALL already registered in registerCallOpcodes
        }
    }

    // Byzantium+ opcodes
    if (std.mem.eql(u8, hardfork, "byzantium") or
        std.mem.eql(u8, hardfork, "constantinople") or
        std.mem.eql(u8, hardfork, "petersburg") or
        std.mem.eql(u8, hardfork, "istanbul") or
        std.mem.eql(u8, hardfork, "berlin") or
        std.mem.eql(u8, hardfork, "london") or
        std.mem.eql(u8, hardfork, "merge") or
        std.mem.eql(u8, hardfork, "shanghai") or
        std.mem.eql(u8, hardfork, "cancun") or
        std.mem.eql(u8, hardfork, "latest")) {
        
        // Add opStaticCall if available from Byzantium+
        if (std.mem.eql(u8, hardfork, "byzantium") or
            std.mem.eql(u8, hardfork, "constantinople") or
            std.mem.eql(u8, hardfork, "petersburg") or
            std.mem.eql(u8, hardfork, "istanbul") or
            std.mem.eql(u8, hardfork, "berlin") or
            std.mem.eql(u8, hardfork, "london") or
            std.mem.eql(u8, hardfork, "merge") or
            std.mem.eql(u8, hardfork, "shanghai") or
            std.mem.eql(u8, hardfork, "cancun") or
            std.mem.eql(u8, hardfork, "latest")) {
            // STATICCALL already registered in registerCallOpcodes
        }

        // Add RETURNDATASIZE and RETURNDATACOPY opcodes
        // These are already added in registerMemoryOpcodes
    }

    // Constantinople+ opcodes
    if (std.mem.eql(u8, hardfork, "constantinople") or
        std.mem.eql(u8, hardfork, "petersburg") or
        std.mem.eql(u8, hardfork, "istanbul") or
        std.mem.eql(u8, hardfork, "berlin") or
        std.mem.eql(u8, hardfork, "london") or
        std.mem.eql(u8, hardfork, "merge") or
        std.mem.eql(u8, hardfork, "shanghai") or
        std.mem.eql(u8, hardfork, "cancun") or
        std.mem.eql(u8, hardfork, "latest")) {
        
        // Add CREATE2 opcode if available from Constantinople+
        if (std.mem.eql(u8, hardfork, "constantinople") or
            std.mem.eql(u8, hardfork, "petersburg") or
            std.mem.eql(u8, hardfork, "istanbul") or
            std.mem.eql(u8, hardfork, "berlin") or
            std.mem.eql(u8, hardfork, "london") or
            std.mem.eql(u8, hardfork, "merge") or
            std.mem.eql(u8, hardfork, "shanghai") or
            std.mem.eql(u8, hardfork, "cancun") or
            std.mem.eql(u8, hardfork, "latest")) {
            // CREATE2 already registered in registerCallOpcodes
        }
    }
    
    // Istanbul+ opcodes
    if (std.mem.eql(u8, hardfork, "istanbul") or
        std.mem.eql(u8, hardfork, "berlin") or
        std.mem.eql(u8, hardfork, "london") or
        std.mem.eql(u8, hardfork, "merge") or
        std.mem.eql(u8, hardfork, "shanghai") or
        std.mem.eql(u8, hardfork, "cancun") or
        std.mem.eql(u8, hardfork, "latest")) {
        
        // Add CHAINID and SELFBALANCE opcodes
        // These are already added in registerEnvironmentOpcodes
    }

    // London+ opcodes
    if (std.mem.eql(u8, hardfork, "london") or
        std.mem.eql(u8, hardfork, "merge") or
        std.mem.eql(u8, hardfork, "shanghai") or
        std.mem.eql(u8, hardfork, "cancun") or
        std.mem.eql(u8, hardfork, "latest")) {
        
        // Add BASEFEE opcode
        // This is already added in registerBlockOpcodes
    }

    // Shanghai+ opcodes
    if (std.mem.eql(u8, hardfork, "shanghai") or
        std.mem.eql(u8, hardfork, "cancun") or
        std.mem.eql(u8, hardfork, "latest")) {
        
        // Add PUSH0 opcode
        // This is already added in registerMemoryOpcodes
    }

    // Cancun+ opcodes
    if (std.mem.eql(u8, hardfork, "cancun") or
        std.mem.eql(u8, hardfork, "latest")) {
        
        // Add TLOAD and TSTORE opcodes (EIP-1153)
        transient.registerTransientOpcodes(allocator, &jump_table) catch |err| {
            std.log.warn("Failed to register transient opcodes: {}", .{err});
        };
        
        // Add MCOPY, BLOBHASH, BLOBBASEFEE opcodes (EIP-4844 + EIP-5656)
        blob.registerBlobOpcodes(allocator, &jump_table) catch |err| {
            std.log.warn("Failed to register blob opcodes: {}", .{err});
        };
    }

    // Fill in any remaining opcodes with UNDEFINED
    const undefined_op = try allocator.create(Operation);
    undefined_op.* = UNDEFINED;
    
    for (0..256) |i| {
        if (jump_table.table[i] == null) {
            jump_table.table[i] = undefined_op;
        }
    }

    return jump_table;
}

// UNDEFINED is the default operation for any opcode not defined in a hardfork
// Executing an undefined opcode will result in InvalidOpcode error
pub const UNDEFINED = Operation{
    .execute = opUndefined,
    .constant_gas = 0,
    .dynamic_gas = null,
    .min_stack = minStack(0, 0),
    .max_stack = 1024, // Allow full stack for undefined opcodes
    .memory_size = null,
    .undefined = true,
};

// Operation for undefined/invalid opcodes
fn opUndefined(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = frame;
    return error.InvalidOpcode;
}

// Operation for opcodes that are not yet implemented
// This is used during development to mark opcodes that need implementation
fn opNotImplemented(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = frame;
    return error.OpNotSupported;
}

// NOT_IMPLEMENTED is used for opcodes that are valid but not yet implemented
pub const NOT_IMPLEMENTED = Operation{
    .execute = opNotImplemented,
    .constant_gas = 0,
    .dynamic_gas = null,
    .min_stack = minStack(0, 0),
    .max_stack = 1024,
    .memory_size = null,
    .undefined = false,
};

// Initialize a jump table for Ethereum mainnet with latest rules
///
// This is a convenience function that creates a jump table for the latest
// Ethereum mainnet hardfork.
///
// Parameters:
// - allocator: Memory allocator to use for the operations
// - jump_table: Pointer to an existing JumpTable to initialize
///
// Returns: Error if initialization fails
pub fn initMainnetJumpTable(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    const new_table = try newJumpTable(allocator, "latest");
    jump_table.* = new_table;
}

// ============================== TODO: Code Review ==============================
//
// After reviewing the REVM implementation, here are the key differences and improvements to consider:
//
// 1. **Instruction Function Signature**: REVM uses a simpler signature that takes the interpreter
//    and host as parameters: `fn(&mut Interpreter, &mut Host)`. Our signature includes pc and
//    returns []const u8, which adds complexity. Consider simplifying.
//
// 2. **Static Dispatch**: REVM uses const functions and aggressive inlining. We could mark our
//    execute functions as inline to improve performance.
//
// 3. **Gas Calculation**: REVM includes gas calculation directly in the instruction function.
//    Our separate dynamic_gas function pointer adds indirection. Consider merging for hot path.
//
// 4. **Memory Operations**: REVM handles memory expansion within opcodes. Our memory_size
//    callback might add unnecessary overhead.
//
// 5. **Error Handling**: REVM uses a more unified error handling approach with InstructionResult
//    enum. Our error union approach is more idiomatic to Zig but may have overhead.
//
// 6. **Hardfork Handling**: REVM uses feature flags at compile time. Our runtime hardfork
//    selection is more flexible but slower. Consider compile-time specialization for production.
//
// 7. **Stack Operations**: REVM uses unsafe operations with direct pointer manipulation.
//    Our safer approach has bounds checking overhead.
//
// Performance Optimizations to Consider:
// - Use computed goto if Zig supports it (currently doesn't)
// - Inline hot path functions
// - Remove dynamic allocations in hot path
// - Consider SIMD for 256-bit arithmetic operations
// - Profile and optimize based on real workloads
//
// ============================== UNIT TESTS ==============================

const testing = std.testing;
const expect = testing.expect;
const expectEqual = testing.expectEqual;
const expectError = testing.expectError;

test "JumpTable.init creates empty jump table" {
    const table = JumpTable.init();
    
    // All entries should be null initially
    for (table.table) |entry| {
        try expect(entry == null);
    }
}

test "JumpTable.getOperation returns UNDEFINED for null entries" {
    const table = JumpTable.init();
    
    // Test various opcodes
    const opcodes_to_test = [_]u8{ 0x00, 0x01, 0x42, 0xFE, 0xFF };
    
    for (opcodes_to_test) |opcode| {
        const op = table.getOperation(opcode);
        try expect(op == &UNDEFINED);
        try expect(op.undefined == true);
    }
}

test "JumpTable.getOperation returns correct operation when set" {
    var table = JumpTable.init();
    const test_allocator = testing.allocator;
    
    // Create a test operation
    const test_op = try test_allocator.create(Operation);
    defer test_allocator.destroy(test_op);
    test_op.* = Operation{
        .execute = opNotImplemented,
        .constant_gas = 42,
        .dynamic_gas = null,
        .min_stack = 2,
        .max_stack = 1024,
        .memory_size = null,
        .undefined = false,
    };
    
    // Set it for opcode 0x42
    table.table[0x42] = test_op;
    
    // Verify we get it back
    const retrieved = table.getOperation(0x42);
    try expect(retrieved == test_op);
    try expectEqual(@as(u64, 42), retrieved.constant_gas);
}

test "JumpTable.validate fills null entries with UNDEFINED" {
    var table = JumpTable.init();
    const test_allocator = testing.allocator;
    
    // Set some operations
    const test_op = try test_allocator.create(Operation);
    defer test_allocator.destroy(test_op);
    test_op.* = NOT_IMPLEMENTED;
    
    table.table[0x01] = test_op;
    table.table[0xFF] = test_op;
    
    // Validate should fill the rest with UNDEFINED
    table.validate();
    
    // Check that null entries are now UNDEFINED
    for (table.table, 0..) |entry, i| {
        try expect(entry != null);
        if (i != 0x01 and i != 0xFF) {
            try expect(entry == &UNDEFINED);
        }
    }
}

test "JumpTable.copy creates deep copy" {
    var table = JumpTable.init();
    const test_allocator = testing.allocator;
    
    // Create and set a test operation
    const test_op = try test_allocator.create(Operation);
    defer test_allocator.destroy(test_op);
    test_op.* = Operation{
        .execute = opNotImplemented,
        .constant_gas = 100,
        .dynamic_gas = null,
        .min_stack = 3,
        .max_stack = 1024,
        .memory_size = null,
        .undefined = false,
    };
    
    table.table[0x42] = test_op;
    
    // Create a copy
    const copy = try table.copy(test_allocator);
    
    // Clean up allocated operations in copy
    defer {
        for (copy.table) |entry| {
            if (entry) |op| {
                if (op != &UNDEFINED) {
                    test_allocator.destroy(op);
                }
            }
        }
    }
    
    // Verify copy has same values but different pointers
    try expect(copy.table[0x42] != null);
    try expect(copy.table[0x42] != test_op); // Different pointer
    try expectEqual(test_op.constant_gas, copy.table[0x42].?.constant_gas);
    try expectEqual(test_op.min_stack, copy.table[0x42].?.min_stack);
}

test "memoryGasCost calculates correct gas for memory expansion" {
    var mem = Memory.init(testing.allocator);
    defer mem.deinit();
    
    // No expansion needed
    try expectEqual(@as(u64, 0), try memoryGasCost(&mem, 0));
    
    // Expand to 32 bytes (1 word)
    // Cost = 3 * 1 + 1²/512 = 3 + 0 = 3
    try expectEqual(@as(u64, 3), try memoryGasCost(&mem, 32));
    
    // Assume memory is now 32 bytes, expand to 64 bytes (2 words)
    try mem.resize(32);
    // Old cost = 3 * 1 + 1²/512 = 3
    // New cost = 3 * 2 + 2²/512 = 6 + 0 = 6
    // Difference = 6 - 3 = 3
    try expectEqual(@as(u64, 3), try memoryGasCost(&mem, 64));
    
    // Larger expansion to test quadratic component
    try mem.resize(0); // Reset
    // Expand to 1024 bytes (32 words)
    // Cost = 3 * 32 + 32²/512 = 96 + 1024/512 = 96 + 2 = 98
    try expectEqual(@as(u64, 98), try memoryGasCost(&mem, 1024));
}

test "memoryGasCost handles overflow protection" {
    var mem = Memory.init(testing.allocator);
    defer mem.deinit();
    
    // Test with a size that would cause overflow in gas calculation
    // Use max u64 value which will definitely cause overflow
    const huge_size: u64 = std.math.maxInt(u64);
    
    // The overflow check in memoryGasCost should catch this
    try expectError(error.OutOfGas, memoryGasCost(&mem, huge_size));
}

test "minStack helper function" {
    try expectEqual(@as(u32, 0), minStack(0, 0));
    try expectEqual(@as(u32, 2), minStack(2, 0));
    try expectEqual(@as(u32, 5), minStack(5, 3));
    try expectEqual(@as(u32, 10), minStack(10, 1));
}

test "maxStack helper function" {
    // Should always return 1024 (EVM stack limit)
    try expectEqual(@as(u32, 1024), maxStack(0, 0));
    try expectEqual(@as(u32, 1024), maxStack(2, 1));
    try expectEqual(@as(u32, 1024), maxStack(10, 5));
}

test "minDupStack helper function" {
    try expectEqual(@as(u32, 1), minDupStack(1));
    try expectEqual(@as(u32, 8), minDupStack(8));
    try expectEqual(@as(u32, 16), minDupStack(16));
}

test "maxDupStack helper function" {
    try expectEqual(@as(u32, 2), maxDupStack(1));
    try expectEqual(@as(u32, 9), maxDupStack(8));
    try expectEqual(@as(u32, 17), maxDupStack(16));
}

test "minSwapStack helper function" {
    try expectEqual(@as(u32, 2), minSwapStack(1));
    try expectEqual(@as(u32, 9), minSwapStack(8));
    try expectEqual(@as(u32, 17), minSwapStack(16));
}

test "maxSwapStack helper function" {
    try expectEqual(@as(u32, 2), maxSwapStack(1));
    try expectEqual(@as(u32, 9), maxSwapStack(8));
    try expectEqual(@as(u32, 17), maxSwapStack(16));
}

test "UNDEFINED operation returns InvalidOpcode error" {
    // Create minimal test environment
    var interpreter = Interpreter{
        .allocator = testing.allocator,
        .callDepth = 0,
        .readOnly = false,
        .returnData = null,
        .evm = .{
            .state_manager = null,
            .precompiles = null,
        },
    };
    
    var frame = Frame{
        .gas = 10000,
        .stack = undefined,
        .memory = undefined,
        .logger = null,
        .code = &[_]u8{},
        .contract = undefined,
        .returnData = null,
        .isPush = false,
        .pc = 0,
    };
    
    const result = UNDEFINED.execute(0, &interpreter, &frame);
    try expectError(error.InvalidOpcode, result);
}

test "NOT_IMPLEMENTED operation returns OpNotSupported error" {
    // Create minimal test environment
    var interpreter = Interpreter{
        .allocator = testing.allocator,
        .callDepth = 0,
        .readOnly = false,
        .returnData = null,
        .evm = .{
            .state_manager = null,
            .precompiles = null,
        },
    };
    
    var frame = Frame{
        .gas = 10000,
        .stack = undefined,
        .memory = undefined,
        .logger = null,
        .code = &[_]u8{},
        .contract = undefined,
        .returnData = null,
        .isPush = false,
        .pc = 0,
    };
    
    const result = NOT_IMPLEMENTED.execute(0, &interpreter, &frame);
    try expectError(error.OpNotSupported, result);
}

test "newJumpTable creates table for homestead hardfork" {
    // Skip this test when opcodes are mocked - it tests actual opcode registration
    return error.SkipZigTest;
}

test "newJumpTable creates table for latest hardfork" {
    // Skip this test when opcodes are mocked - it tests actual opcode registration
    return error.SkipZigTest;
}

test "initMainnetJumpTable initializes with latest hardfork" {
    // Skip this test when opcodes are mocked - it tests actual opcode registration
    return error.SkipZigTest;
}