const std = @import("std");

/// ExecutionError represents various error conditions that can occur during EVM execution
///
/// This module defines all possible error conditions that can occur during the execution
/// of EVM bytecode. These errors are used throughout the EVM implementation to signal
/// various failure conditions, from normal stops to critical errors.
///
/// ## Error Categories
///
/// The errors can be broadly categorized into:
///
/// 1. **Normal Termination**: STOP, REVERT, INVALID
/// 2. **Resource Exhaustion**: OutOfGas, StackOverflow, MemoryLimitExceeded
/// 3. **Invalid Operations**: InvalidJump, InvalidOpcode, StaticStateChange
/// 4. **Bounds Violations**: StackUnderflow, OutOfOffset, ReturnDataOutOfBounds
/// 5. **Contract Creation**: DeployCodeTooBig, MaxCodeSizeExceeded, InvalidCodeEntry
/// 6. **Call Stack**: DepthLimit
/// 7. **Memory Management**: OutOfMemory, InvalidOffset, InvalidSize, ChildContextActive
/// 8. **Future Features**: EOFNotSupported
const ExecutionError = @This();

/// Error types for EVM execution
///
/// Each error represents a specific condition that can occur during EVM execution.
/// Some errors (like STOP and REVERT) are normal termination conditions, while
/// others represent actual failure states.
pub const Error = error{
    /// Normal termination via STOP opcode (0x00)
    /// This is not an error condition - it signals successful completion
    STOP,

    /// State reversion via REVERT opcode (0xFD)
    /// Returns data and reverts all state changes in the current context
    REVERT,

    /// Execution of INVALID opcode (0xFE)
    /// Consumes all remaining gas and reverts state
    INVALID,

    /// Insufficient gas to complete operation
    /// Occurs when gas_remaining < gas_required for any operation
    OutOfGas,

    /// Attempted to pop from empty stack or insufficient stack items
    /// Stack operations require specific minimum stack sizes
    StackUnderflow,

    /// Stack size exceeded maximum of 1024 elements
    /// Pushing to a full stack causes this error
    StackOverflow,

    /// JUMP/JUMPI to invalid destination
    /// Destination must be a JUMPDEST opcode at a valid position
    InvalidJump,

    /// Attempted to execute undefined opcode
    /// Not all byte values 0x00-0xFF are defined opcodes
    InvalidOpcode,

    /// Attempted state modification in static call context
    /// SSTORE, LOG*, CREATE*, and SELFDESTRUCT are forbidden in static calls
    StaticStateChange,

    /// Memory or calldata access beyond valid bounds
    /// Usually from integer overflow in offset calculations
    OutOfOffset,

    /// Gas calculation resulted in integer overflow
    /// Can occur with extremely large memory expansions
    GasUintOverflow,

    /// Attempted write in read-only context
    /// Similar to StaticStateChange but more general
    WriteProtection,

    /// RETURNDATACOPY accessing data beyond RETURNDATASIZE
    /// Unlike other copy operations, this is a hard error
    ReturnDataOutOfBounds,

    /// Invalid access to return data buffer
    /// Occurs when RETURNDATACOPY offset + size > return data size
    InvalidReturnDataAccess,

    /// Contract deployment code exceeds maximum size
    /// Deployment bytecode has its own size limits
    DeployCodeTooBig,

    /// Deployed contract code exceeds 24,576 byte limit (EIP-170)
    /// Prevents storing excessively large contracts
    MaxCodeSizeExceeded,

    /// Invalid contract initialization code
    /// Can occur with malformed constructor bytecode
    InvalidCodeEntry,

    /// Call stack depth exceeded 1024 levels
    /// Prevents infinite recursion and stack overflow attacks
    DepthLimit,

    /// Memory allocation failed (host environment issue)
    /// Not a normal EVM error - indicates system resource exhaustion
    OutOfMemory,

    /// Invalid memory offset in operation
    /// Usually from malformed offset values
    InvalidOffset,

    /// Invalid memory size in operation
    /// Usually from malformed size values
    InvalidSize,

    /// Memory expansion would exceed configured limits
    /// Prevents excessive memory usage (typically 32MB limit)
    MemoryLimitExceeded,

    /// Attempted operation while child memory context is active
    /// Memory contexts must be properly managed
    ChildContextActive,

    /// Attempted to revert/commit without active child context
    /// Memory context operations must be balanced
    NoChildContextToRevertOrCommit,

    /// EOF (EVM Object Format) features not yet implemented
    /// Placeholder for future EOF-related opcodes
    EOFNotSupported,

    // Database errors from the database interface
    /// Account not found in the database
    AccountNotFound,
    /// Storage slot not found for the given address
    StorageNotFound,
    /// Contract code not found for the given hash
    CodeNotFound,
    /// Invalid address format
    InvalidAddress,
    /// Database corruption detected
    DatabaseCorrupted,
    /// Network error when accessing remote database
    NetworkError,
    /// Permission denied accessing database
    PermissionDenied,
    /// Invalid snapshot identifier
    InvalidSnapshot,
    /// Batch operation not in progress
    NoBatchInProgress,
    /// Snapshot not found
    SnapshotNotFound,
};

/// Get a human-readable description for an execution error
///
/// Provides detailed descriptions of what each error means and when it occurs.
/// Useful for debugging, logging, and error reporting.
///
/// ## Parameters
/// - `err`: The execution error to describe
///
/// ## Returns
/// A string slice containing a human-readable description of the error
///
/// ## Example
/// ```zig
/// const err = Error.StackOverflow;
/// const desc = get_description(err);
/// std.log.err("EVM execution failed: {s}", .{desc});
/// ```
pub fn get_description(err: Error) []const u8 {
    return switch (err) {
        Error.STOP => "Normal STOP opcode execution",
        Error.REVERT => "REVERT opcode - state reverted",
        Error.INVALID => "INVALID opcode or invalid operation",
        Error.OutOfGas => "Out of gas",
        Error.StackUnderflow => "Stack underflow",
        Error.StackOverflow => "Stack overflow (beyond 1024 elements)",
        Error.InvalidJump => "Jump to invalid destination",
        Error.InvalidOpcode => "Undefined opcode",
        Error.StaticStateChange => "State modification in static context",
        Error.OutOfOffset => "Memory access out of bounds",
        Error.GasUintOverflow => "Gas calculation overflow",
        Error.WriteProtection => "Write to protected storage",
        Error.ReturnDataOutOfBounds => "Return data access out of bounds",
        Error.InvalidReturnDataAccess => "Invalid return data access - offset + size exceeds data length",
        Error.DeployCodeTooBig => "Contract creation code too large",
        Error.MaxCodeSizeExceeded => "Contract code size exceeds limit",
        Error.InvalidCodeEntry => "Invalid contract entry code",
        Error.DepthLimit => "Call depth exceeds limit (1024)",
        Error.OutOfMemory => "Out of memory allocation failed",
        Error.InvalidOffset => "Invalid memory offset",
        Error.InvalidSize => "Invalid memory size",
        Error.MemoryLimitExceeded => "Memory limit exceeded",
        Error.ChildContextActive => "Child context is active",
        Error.NoChildContextToRevertOrCommit => "No child context to revert or commit",
        Error.EOFNotSupported => "EOF (EVM Object Format) opcode not supported",
        Error.AccountNotFound => "Account not found in database",
        Error.StorageNotFound => "Storage slot not found in database",
        Error.CodeNotFound => "Contract code not found in database",
        Error.InvalidAddress => "Invalid address format",
        Error.DatabaseCorrupted => "Database corruption detected",
        Error.NetworkError => "Network error accessing database",
        Error.PermissionDenied => "Permission denied accessing database",
        Error.InvalidSnapshot => "Invalid snapshot identifier",
        Error.NoBatchInProgress => "No batch operation in progress",
        Error.SnapshotNotFound => "Snapshot not found in database",
    };
}
