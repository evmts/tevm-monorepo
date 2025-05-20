const std = @import("std");
const opcodes = @import("opcodes.zig");
const Interpreter = @import("interpreter.zig").Interpreter;
const Frame = @import("Frame.zig").Frame;
const ExecutionError = @import("Frame.zig").ExecutionError;
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;
const math = @import("opcodes/math.zig");
const math2 = @import("opcodes/math2.zig");
const comparison = @import("opcodes/comparison.zig");
const bitwise = @import("opcodes/bitwise.zig");
const memory = @import("opcodes/memory.zig");
const storage = @import("opcodes/storage.zig");
const controlflow = @import("opcodes/controlflow.zig");
const environment = @import("opcodes/environment.zig");
const calls = @import("opcodes/calls.zig");
const block = @import("opcodes/block.zig");
const crypto = @import("opcodes/crypto.zig");
const log = @import("opcodes/log.zig");
const blob = @import("opcodes/blob.zig");
const transient = @import("opcodes/transient.zig");

/// ExecutionFunc is a function executed by the EVM during interpretation
///
/// This function signature is used for all opcode implementations.
/// 
/// Parameters:
/// - pc: Current program counter position
/// - interpreter: Pointer to the interpreter instance
/// - frame: Pointer to the current execution frame
///
/// Returns: Either an error (like STOP, REVERT, etc.) or a byte slice
/// for any data to be returned
pub const ExecutionFunc = *const fn (pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8;

/// GasFunc calculates the gas required for an operation
///
/// This is used for opcodes that need dynamic gas calculation based on inputs.
///
/// Parameters:
/// - interpreter: Pointer to the interpreter instance
/// - frame: Pointer to the current execution frame
/// - stack: Pointer to the EVM stack
/// - memory: Pointer to the EVM memory
/// - requested_size: The requested memory size (for memory expansion)
///
/// Returns: The amount of gas required or OutOfGas error
pub const GasFunc = *const fn (interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64;

/// MemorySizeFunc calculates the memory size required for an operation
///
/// This is used for opcodes that may extend the memory.
///
/// Parameters:
/// - stack: Pointer to the EVM stack to read operands
///
/// Returns: A struct containing the required memory size and whether an overflow occurred
pub const MemorySizeFunc = *const fn (stack: *Stack) struct { size: u64, overflow: bool };

/// Helper function to calculate memory gas cost for expanding memory
///
/// Memory gas is calculated based on the number of 32-byte words required.
/// The formula is quadratic to make larger memory expansions increasingly expensive.
///
/// The gas formula follows the EVM specification:
/// gas = MemoryGas * words + words² / QuadCoeffDiv
/// where:
/// - MemoryGas = 3 (linear coefficient)
/// - QuadCoeffDiv = 512 (quadratic coefficient divisor)
///
/// Parameters:
/// - mem: Pointer to the memory instance
/// - newSize: The new memory size in bytes to expand to
///
/// Returns: The gas cost for expanding memory
/// Error: OutOfGas if an overflow occurs in gas calculation
pub fn memoryGasCost(mem: *Memory, newSize: u64) error{OutOfGas}!u64 {
    // If no change in memory size, no additional cost
    if (newSize <= mem.size()) {
        return 0;
    }
    
    const oldSize = mem.size();
    const oldWordSize = (oldSize + 31) / 32;
    const newWordSize = (newSize + 31) / 32;
    
    // Compute the gas cost for expanding memory according to EVM rules
    // Gas formula: a * n + b * n²/512 (where n is the number of words)
    const oldCost = MemoryGas * oldWordSize + oldWordSize * oldWordSize / QuadCoeffDiv;
    const newCost = MemoryGas * newWordSize + newWordSize * newWordSize / QuadCoeffDiv;
    
    if (newCost < oldCost) {
        return error.OutOfGas; // Overflow protection
    }
    
    return newCost - oldCost;
}

/// Operation represents an opcode in the EVM
///
/// Each opcode in the EVM is represented by an Operation instance that
/// contains all the information needed to execute it, including its
/// execution function, gas costs, and stack requirements.
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

/// JumpTable contains the EVM opcodes supported at a given hardfork
///
/// The JumpTable is essentially a lookup table for all 256 possible opcodes
/// in the EVM. Each entry points to an Operation that defines the behavior
/// of that opcode. Opcodes that are not defined for a particular hardfork
/// will point to an UNDEFINED operation.
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
    pub fn getOperation(self: *const JumpTable, opcode: u8) *const Operation {
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

/// Gas cost constants for basic operations
/// These define the static gas costs for various opcode categories
/// Very cheap operations (like PC, CALLDATASIZE)
pub const GasQuickStep: u64 = 2;
/// Fast operations (like ADD, SUB, NOT)
pub const GasFastestStep: u64 = 3;
/// Faster operations (like MUL, DIV)
pub const GasFastStep: u64 = 5;
/// Mid-range operations (like ADDMOD, MULMOD)
pub const GasMidStep: u64 = 8;
/// Slow operations
pub const GasSlowStep: u64 = 10;
/// Extended/expensive operations (like BALANCE)
pub const GasExtStep: u64 = 20;

/// Gas cost constants for specific operations
pub const Keccak256Gas: u64 = 30;            /// Base gas for KECCAK256
pub const Keccak256WordGas: u64 = 6;         /// Gas per word for KECCAK256
pub const SloadGas: u64 = 100;               /// Base gas for SLOAD (warm access)
pub const ColdSloadCost: u64 = 2100;         /// Gas for first-time (cold) SLOAD access (EIP-2929)
pub const ColdAccountAccessCost: u64 = 2600; /// Gas for first-time (cold) account access (EIP-2929)
pub const WarmStorageReadCost: u64 = 100;    /// Gas for warm storage access (EIP-2929)

pub const SstoreSentryGas: u64 = 2300;       /// Gas sent with a call
pub const SstoreSetGas: u64 = 20000;         /// Gas for SSTORE when setting from zero
pub const SstoreResetGas: u64 = 5000;        /// Gas for SSTORE when changing existing value
pub const SstoreClearGas: u64 = 5000;        /// Gas for SSTORE when clearing to zero
pub const SstoreRefundGas: u64 = 15000;      /// Gas refund for clearing storage
pub const JumpdestGas: u64 = 1;              /// Gas for JUMPDEST
pub const LogGas: u64 = 375;                 /// Base gas for LOG
pub const LogDataGas: u64 = 8;               /// Gas per byte of LOG data
pub const LogTopicGas: u64 = 375;            /// Gas per LOG topic
pub const CreateGas: u64 = 32000;            /// Gas for CREATE
pub const CallGas: u64 = 40;                 /// Base gas for CALL
pub const CallStipend: u64 = 2300;           /// Stipend for CALL when transferring value
pub const CallValueTransferGas: u64 = 9000;  /// Extra gas for transferring value in CALL
pub const CallNewAccountGas: u64 = 25000;    /// Extra gas for creating a new account in CALL
pub const SelfdestructRefundGas: u64 = 24000; /// Gas refund for SELFDESTRUCT
pub const MemoryGas: u64 = 3;                /// Linear coefficient for memory gas
pub const QuadCoeffDiv: u64 = 512;           /// Quadratic coefficient divisor for memory gas
pub const CreateDataGas: u64 = 200;          /// Gas per byte of CREATE data
pub const TxGas: u64 = 21000;                /// Base gas for a transaction
pub const TxGasContractCreation: u64 = 53000; /// Base gas for contract creation
pub const TxDataZeroGas: u64 = 4;            /// Gas per zero byte of tx data
pub const TxDataNonZeroGas: u64 = 16;        /// Gas per non-zero byte of tx data
pub const CopyGas: u64 = 3;

// EIP-4844: Shard Blob Transactions
pub const BlobHashGas: u64 = 3;
pub const BlobBaseFeeGas: u64 = 2;

// EIP-1153: Transient Storage
pub const TLoadGas: u64 = 100;
pub const TStoreGas: u64 = 100;                  /// Gas for memory copy operations

/// Helper function to calculate minimum stack requirement for an operation
///
/// Parameters:
/// - min_pop: Number of items to pop from the stack
/// - min_push: Number of items to push to the stack (unused)
///
/// Returns: Minimum stack depth required for the operation
pub fn minStack(min_pop: u32, min_push: u32) u32 {
    _ = min_push; // autofix
    return min_pop;
}

/// Helper function to calculate maximum stack allowance for an operation
///
/// Parameters:
/// - max_pop: Number of items to pop from the stack (unused)
/// - max_push: Number of items to push to the stack
///
/// Returns: Maximum stack items allowed for the operation
pub fn maxStack(max_pop: u32, max_push: u32) u32 {
    _ = max_pop; // autofix
    return max_push;
}

/// Calculate minimum stack requirement for DUP operations
///
/// Parameters:
/// - n: DUP index (1-16)
///
/// Returns: Minimum stack depth required for DUPn
pub fn minDupStack(n: u32) u32 {
    return n;
}

/// Calculate maximum stack allowance for DUP operations
///
/// Parameters:
/// - n: DUP index (1-16)
///
/// Returns: Maximum stack items allowed for DUPn
pub fn maxDupStack(n: u32) u32 {
    return n + 1;
}

/// Calculate minimum stack requirement for SWAP operations
///
/// Parameters:
/// - n: SWAP index (1-16)
///
/// Returns: Minimum stack depth required for SWAPn
pub fn minSwapStack(n: u32) u32 {
    return n;
}

/// Calculate maximum stack allowance for SWAP operations
///
/// Parameters:
/// - n: SWAP index (1-16)
///
/// Returns: Maximum stack items allowed for SWAPn
pub fn maxSwapStack(n: u32) u32 {
    return n;
}

// Define a default undefined operation
var UNDEFINED = Operation{
    .execute = undefinedExecute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = 0,
    .undefined = true,
};

fn undefinedExecute(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = frame;
    return ExecutionError.INVALID;
}

// We'll use the controlflow module for STOP now

fn dummyExecute(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    _ = frame;
    return "";
}

// Create a new frontier instruction set
pub fn newFrontierInstructionSet(allocator: std.mem.Allocator) !JumpTable {
    var jt = JumpTable.init();

    // Register control flow opcodes (STOP, JUMP, JUMPI, PC, JUMPDEST, RETURN, REVERT, INVALID, SELFDESTRUCT)
    try controlflow.registerControlFlowOpcodes(allocator, &jt);

    const add_op = try allocator.create(Operation);
    add_op.* = Operation{
        .execute = dummyExecute,
        .constant_gas = GasFastestStep,
        .min_stack = minStack(2, 1),
        .max_stack = maxStack(2, 1),
    };
    jt.table[0x01] = add_op;

    // Register math opcodes (ADD, SUB, MUL, etc.)
    try math.registerMathOpcodes(allocator, &jt);
    
    // Register advanced math opcodes (ADDMOD, MULMOD, EXP, SIGNEXTEND, SDIV, MOD, SMOD)
    try math2.registerMath2Opcodes(allocator, &jt);
    
    // Register comparison opcodes (LT, GT, SLT, SGT, EQ, ISZERO)
    try comparison.registerComparisonOpcodes(allocator, &jt);
    
    // Register bitwise opcodes (AND, OR, XOR, NOT, BYTE, SHL, SHR, SAR)
    try bitwise.registerBitwiseOpcodes(allocator, &jt);
    
    // Register memory opcodes (MLOAD, MSTORE, MSTORE8, MSIZE, POP, PUSH*, DUP*, SWAP*)
    try memory.registerMemoryOpcodes(allocator, &jt);
    
    // Register storage opcodes (SLOAD, SSTORE)
    try storage.registerStorageOpcodes(allocator, &jt);
    
    // Register environment opcodes (ADDRESS, BALANCE, etc.)
    try environment.registerEnvironmentOpcodes(allocator, &jt);
    
    // Register block opcodes (BLOCKHASH, COINBASE, TIMESTAMP, etc.)
    try block.registerBlockOpcodes(allocator, &jt);
    
    // Register call opcodes (CALL, CALLCODE, DELEGATECALL, STATICCALL, CREATE, CREATE2)
    try calls.registerCallOpcodes(allocator, &jt);
    
    // Register cryptographic opcodes (KECCAK256)
    try crypto.registerCryptoOpcodes(allocator, &jt);
    
    // Register LOG opcodes (LOG0, LOG1, LOG2, LOG3, LOG4)
    try log.registerLogOpcodes(allocator, &jt);
    
    // Register EIP-4844 blob opcodes (BLOBHASH, BLOBBASEFEE) and EIP-5656 (MCOPY)
    try blob.registerBlobOpcodes(allocator, &jt);
    
    // Register EIP-1153 transient storage opcodes (TLOAD, TSTORE)
    try transient.registerTransientOpcodes(allocator, &jt);

    // Add more operations based on Geth's frontier implementation
    // This would continue for all opcodes...

    jt.validate();
    return jt;
}

// Create test for the JumpTable
test "JumpTable basic operations" {
    const allocator = std.testing.allocator;

    var jt = try newFrontierInstructionSet(allocator);
    defer {
        // Free allocated operations
        for (0..256) |i| {
            if (jt.table[i] != null and !jt.table[i].?.undefined) {
                allocator.destroy(jt.table[i].?);
            }
        }
    }

    // Test a couple of operations
    const stop_op = jt.getOperation(0x00);
    try std.testing.expectEqual(@as(u64, 0), stop_op.constant_gas);

    const add_op = jt.getOperation(0x01);
    try std.testing.expectEqual(@as(u64, GasFastestStep), add_op.constant_gas);
    
    // Test environment opcodes
    const address_op = jt.getOperation(0x30); // ADDRESS
    try std.testing.expectEqual(@as(u64, GasQuickStep), address_op.constant_gas);
    
    const balance_op = jt.getOperation(0x31); // BALANCE
    try std.testing.expectEqual(@as(u64, GasExtStep), balance_op.constant_gas);
    
    // Test block opcodes
    const blockhash_op = jt.getOperation(0x40); // BLOCKHASH
    try std.testing.expectEqual(@as(u64, GasMidStep), blockhash_op.constant_gas);
    
    const coinbase_op = jt.getOperation(0x41); // COINBASE
    try std.testing.expectEqual(@as(u64, GasQuickStep), coinbase_op.constant_gas);
    
    const timestamp_op = jt.getOperation(0x42); // TIMESTAMP
    try std.testing.expectEqual(@as(u64, GasQuickStep), timestamp_op.constant_gas);
    
    const difficulty_op = jt.getOperation(0x44); // DIFFICULTY/PREVRANDAO
    try std.testing.expectEqual(@as(u64, GasQuickStep), difficulty_op.constant_gas);
    
    const chainid_op = jt.getOperation(0x46); // CHAINID
    try std.testing.expectEqual(@as(u64, GasQuickStep), chainid_op.constant_gas);
    
    // Test call opcodes
    const call_op = jt.getOperation(0xF1); // CALL
    try std.testing.expectEqual(@as(u64, CallGas), call_op.constant_gas);
    
    const create_op = jt.getOperation(0xF0); // CREATE
    try std.testing.expectEqual(@as(u64, CreateGas), create_op.constant_gas);
    
    const delegatecall_op = jt.getOperation(0xF4); // DELEGATECALL
    try std.testing.expectEqual(@as(u64, CallGas), delegatecall_op.constant_gas);
    
    const create2_op = jt.getOperation(0xF5); // CREATE2
    try std.testing.expectEqual(@as(u64, CreateGas), create2_op.constant_gas);

    // Test an undefined operation
    const undef_op = jt.getOperation(0xFF);
    try std.testing.expect(undef_op.undefined);
}

// Create a very basic test for JumpTable that doesn't depend on external implementation details
test "JumpTable initialization and validation" {
    const jt = JumpTable.init();
    try std.testing.expectEqual(@as(usize, 256), jt.table.len);

    // Check that all entries are initially null
    for (jt.table) |entry| {
        try std.testing.expectEqual(true, entry == null);
    }

    // Validate should fill all nulls with UNDEFINED
    var mutable_jt = jt;
    mutable_jt.validate();

    // Now check that all entries have been filled
    for (mutable_jt.table) |entry| {
        try std.testing.expectEqual(false, entry == null);
        try std.testing.expectEqual(true, entry.?.undefined);
    }
}

test "JumpTable stack calculation helpers" {
    try std.testing.expectEqual(@as(u32, 2), minStack(2, 1));
    try std.testing.expectEqual(@as(u32, 1), maxStack(2, 1));

    try std.testing.expectEqual(@as(u32, 3), minDupStack(3));
    try std.testing.expectEqual(@as(u32, 4), maxDupStack(3));

    try std.testing.expectEqual(@as(u32, 4), minSwapStack(4));
    try std.testing.expectEqual(@as(u32, 4), maxSwapStack(4));
}

test "JumpTable gas constants" {
    try std.testing.expectEqual(@as(u64, 2), GasQuickStep);
    try std.testing.expectEqual(@as(u64, 3), GasFastestStep);
    try std.testing.expectEqual(@as(u64, 5), GasFastStep);
    try std.testing.expectEqual(@as(u64, 8), GasMidStep);
    try std.testing.expectEqual(@as(u64, 10), GasSlowStep);
    try std.testing.expectEqual(@as(u64, 20), GasExtStep);

    try std.testing.expectEqual(@as(u64, 30), Keccak256Gas);
    try std.testing.expectEqual(@as(u64, 375), LogGas);
    try std.testing.expectEqual(@as(u64, 32000), CreateGas);
}