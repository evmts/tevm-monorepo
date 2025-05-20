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
pub const SstoreRefundGas: u64 = 4800;       /// Gas refund for clearing storage (EIP-3529 reduced from 15000)
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
// EIP-3860: Limit and meter initcode
pub const InitcodeWordGas: u64 = 2;          /// Gas per 32-byte word of initcode (EIP-3860)
pub const MaxInitcodeSize: u64 = 49152;      /// Maximum initcode size (2 * 24576 bytes) (EIP-3860)
pub const TxGas: u64 = 21000;                /// Base gas for a transaction
pub const TxGasContractCreation: u64 = 53000; /// Base gas for contract creation
pub const TxDataZeroGas: u64 = 4;            /// Gas per zero byte of tx data
pub const TxDataNonZeroGas: u64 = 16;        /// Gas per non-zero byte of tx data
pub const CopyGas: u64 = 3;
pub const MaxRefundQuotient: u64 = 5;        /// Maximum refund quotient (EIP-3529 - gas_used/5 maximum)

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
    return n + 1;
}

/// Calculate maximum stack allowance for SWAP operations
///
/// Parameters:
/// - n: SWAP index (1-16)
///
/// Returns: Maximum stack items allowed for SWAPn
pub fn maxSwapStack(n: u32) u32 {
    return n + 1;
}

/// Create a new jump table for a specific Ethereum hardfork
///
/// This creates a jump table with all the opcodes appropriate for
/// the specified Ethereum hardfork.
///
/// Parameters:
/// - allocator: Memory allocator to use for the operations
/// - hardfork: Name of the Ethereum hardfork
///
/// Returns: A new JumpTable configured for the hardfork
/// Error: May return allocation errors
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
    try storage.registerStorageOpcodes(allocator, &jump_table);
    try calls.registerCallOpcodes(allocator, &jump_table);
    try block.registerBlockOpcodes(allocator, &jump_table);
    try crypto.registerCryptoOpcodes(allocator, &jump_table);
    try log.registerLogOpcodes(allocator, &jump_table);
    
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
        try transient.registerTransientOpcodes(allocator, &jump_table);
        
        // Add MCOPY, BLOBHASH, BLOBBASEFEE opcodes (EIP-4844 + EIP-5656)
        try blob.registerBlobOpcodes(allocator, &jump_table);
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

/// UNDEFINED is the default operation for any opcode not defined in a hardfork
/// Executing an undefined opcode will result in InvalidOpcode error
pub const UNDEFINED = Operation{
    .execute = opcodes.opUndefined,
    .constant_gas = 0,
    .dynamic_gas = null,
    .min_stack = minStack(0, 0),
    .max_stack = maxStack(0, 0),
    .memory_size = null,
    .undefined = true,
};