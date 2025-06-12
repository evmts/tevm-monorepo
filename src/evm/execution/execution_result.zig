//! ExecutionResult module - Represents the outcome of executing an EVM opcode
//! 
//! This module defines the result structure returned by opcode execution functions.
//! Every opcode in the EVM returns an ExecutionResult that indicates:
//! - How many bytes of bytecode were consumed
//! - Whether execution should continue or halt (and if halting, what data to return)
//! 
//! ## Design Philosophy
//! 
//! The ExecutionResult struct provides a uniform interface for all opcode implementations
//! to communicate their results back to the main execution loop. This design allows for:
//! - Clean separation between opcode logic and control flow
//! - Efficient bytecode parsing without redundant position tracking
//! - Clear signaling of execution termination with associated data
//! 
//! ## Usage Pattern
//! 
//! ```zig
//! // In an opcode implementation
//! pub fn execute_add(vm: *VM) ExecutionResult {
//!     // Perform addition logic...
//!     return ExecutionResult{ .bytes_consumed = 1 }; // Continue execution
//! }
//! 
//! pub fn execute_return(vm: *VM) ExecutionResult {
//!     const data = vm.memory.read_range(offset, size);
//!     return ExecutionResult{ 
//!         .bytes_consumed = 1,
//!         .output = data  // Non-empty output signals halt
//!     };
//! }
//! ```

const std = @import("std");

/// ExecutionResult holds the result of executing a single EVM opcode
/// 
/// This struct is returned by every opcode execution function to indicate:
/// 1. How many bytes of bytecode were consumed (opcode + immediate data)
/// 2. Whether execution should continue or halt (indicated by output)
/// 
/// The EVM execution loop uses this information to:
/// - Advance the program counter by `bytes_consumed`
/// - Determine whether to continue executing or return control to caller
/// - Pass return data back to the calling context when halting
const ExecutionResult = @This();

/// Number of bytes consumed by this opcode (including immediate data)
/// 
/// Most opcodes consume exactly 1 byte (just the opcode itself), but some
/// consume additional bytes for immediate data:
/// 
/// - **PUSH1-PUSH32**: Consume 1 + n bytes (opcode + n bytes of data)
/// - **All other opcodes**: Consume exactly 1 byte
/// 
/// The execution loop uses this value to advance the program counter (PC)
/// to the next instruction. Incorrect values here will cause the VM to
/// misinterpret subsequent bytecode.
/// 
/// ## Examples
/// - ADD opcode (0x01): bytes_consumed = 1
/// - PUSH1 0x42: bytes_consumed = 2 (1 for opcode, 1 for data)
/// - PUSH32 <32 bytes>: bytes_consumed = 33 (1 for opcode, 32 for data)
bytes_consumed: usize = 1,

/// Return data if the execution should halt (empty means continue)
/// 
/// This field serves a dual purpose:
/// 1. **Empty slice (`""`)**: Execution continues to the next instruction
/// 2. **Non-empty slice**: Execution halts and returns this data
/// 
/// Opcodes that halt execution include:
/// - **RETURN**: Returns specified data from memory
/// - **REVERT**: Returns revert data and reverts state changes  
/// - **STOP**: Halts with empty return data (but still non-empty slice)
/// - **INVALID**: Halts with empty data and consumes all gas
/// - **SELFDESTRUCT**: Halts after scheduling account destruction
/// 
/// The data in this field is typically:
/// - Memory contents for RETURN/REVERT
/// - Empty (but allocated) slice for STOP/INVALID
/// - Contract creation bytecode for CREATE operations
/// 
/// ## Memory Management
/// The slice should reference memory owned by the VM's memory system
/// or be a compile-time constant empty slice. The execution loop does
/// not free this memory.
output: []const u8 = "",
