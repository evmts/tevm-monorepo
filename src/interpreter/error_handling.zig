// error_handling.zig
//! Error handling and status codes for ZigEVM
//! This module defines comprehensive error types and handling mechanisms for ZigEVM

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Address = types.Address;
const Error = types.Error;

/// Execution status codes - expanded version based on revm's InstructionResult
pub const StatusCode = enum {
    // Successful completion states
    Continue,       // Execution should continue
    Stop,           // Normal termination with STOP opcode
    Return,         // Normal termination with RETURN opcode and return data
    SelfDestruct,   // Contract self-destructed
    
    // Reversion states (state changes rolled back)
    Revert,         // Explicit REVERT opcode
    
    // Fatal error states (no state changes, full reversion)
    OutOfGas,            // Not enough gas to complete execution
    InvalidOpcode,       // Encountered an undefined opcode
    InvalidJump,         // JUMP/JUMPI to invalid destination
    InvalidJumpDest,     // Jump destination is not a JUMPDEST opcode
    StackUnderflow,      // Stack pop with insufficient items
    StackOverflow,       // Stack push beyond the stack limit
    OutOfOffset,         // Memory access with invalid offset
    OutOfMemory,         // Memory expansion error
    ReturnDataOutOfBounds, // RETURNDATACOPY with out-of-bounds access
    StaticModeViolation, // State-modifying operation in static call context
    CallTooDeep,         // Exceeded the maximum call depth (1024)
    CreateCollision,     // Address collision when creating new contract
    PrecompileError,     // Error in precompiled contract execution
    NonceOverflow,       // Account nonce would overflow
    BalanceOverflow,     // Account balance would overflow
    BalanceUnderflow,    // Account balance would underflow
    GasOverflow,         // Gas calculation overflow
    ContractSizeLimit,   // Contract bytecode exceeds size limit
    CodeStoreError,      // Error storing contract code
    InternalError,       // Unexpected internal error
};

/// Helper struct for propagating execution status and results
pub const ExecutionStatus = struct {
    code: StatusCode,
    gas_used: u64 = 0,
    gas_refunded: u64 = 0,
    return_data: []const u8 = &[_]u8{},
    error_message: ?[]const u8 = null,
    
    /// Check if the status code indicates execution should continue
    pub fn shouldContinue(self: ExecutionStatus) bool {
        return self.code == .Continue;
    }
    
    /// Check if the status code indicates execution terminated successfully
    pub fn isSuccess(self: ExecutionStatus) bool {
        return self.code == .Stop or self.code == .Return or self.code == .SelfDestruct;
    }
    
    /// Check if the status code indicates execution reverted
    pub fn isRevert(self: ExecutionStatus) bool {
        return self.code == .Revert;
    }
    
    /// Check if the status code indicates an error condition
    pub fn isError(self: ExecutionStatus) bool {
        return @intFromEnum(self.code) >= @intFromEnum(StatusCode.OutOfGas);
    }
    
    /// Convert a ZigEVM Error type to the corresponding StatusCode
    pub fn fromError(err: Error, gas_used: u64) ExecutionStatus {
        const code = switch (err) {
            Error.OutOfGas => StatusCode.OutOfGas,
            Error.InvalidOpcode => StatusCode.InvalidOpcode,
            Error.InvalidJump => StatusCode.InvalidJump,
            Error.InvalidJumpDest => StatusCode.InvalidJumpDest,
            Error.StackOverflow => StatusCode.StackOverflow,
            Error.StackUnderflow => StatusCode.StackUnderflow,
            Error.ReturnDataOutOfBounds => StatusCode.ReturnDataOutOfBounds,
            Error.CallDepthExceeded => StatusCode.CallTooDeep,
            Error.InvalidOffset => StatusCode.OutOfOffset,
            Error.WriteProtection => StatusCode.StaticModeViolation,
            // Map remaining errors to appropriate status codes
            else => StatusCode.InternalError,
        };
        
        return .{
            .code = code,
            .gas_used = gas_used,
            .gas_refunded = 0,
            .return_data = &[_]u8{},
        };
    }
    
    /// Convert a StatusCode to the corresponding Error type
    pub fn toError(self: ExecutionStatus) Error {
        return switch (self.code) {
            .OutOfGas => Error.OutOfGas,
            .InvalidOpcode => Error.InvalidOpcode,
            .InvalidJump, .InvalidJumpDest => Error.InvalidJump,
            .StackUnderflow => Error.StackUnderflow,
            .StackOverflow => Error.StackOverflow,
            .ReturnDataOutOfBounds => Error.ReturnDataOutOfBounds,
            .CallTooDeep => Error.CallDepthExceeded,
            .OutOfOffset => Error.InvalidOffset,
            .StaticModeViolation => Error.WriteProtection,
            .Continue, .Stop, .Return, .SelfDestruct, .Revert => unreachable, // These aren't errors
            else => Error.InternalError,
        };
    }
    
    /// Convert to the final ExecutionResult type
    pub fn toExecutionResult(self: ExecutionStatus, allocator: std.mem.Allocator) !types.ExecutionResult {
        if (self.isSuccess()) {
            // For successful completion
            var return_data = if (self.return_data.len > 0) 
                try allocator.dupe(u8, self.return_data) 
                else &[_]u8{};
                
            return .{
                .Success = .{
                    .gas_used = self.gas_used,
                    .gas_refunded = self.gas_refunded,
                    .return_data = return_data,
                }
            };
        } else if (self.isRevert()) {
            // For REVERT
            var return_data = if (self.return_data.len > 0) 
                try allocator.dupe(u8, self.return_data) 
                else &[_]u8{};
                
            return .{
                .Revert = .{
                    .gas_used = self.gas_used,
                    .return_data = return_data,
                }
            };
        } else {
            // For errors
            return .{
                .Error = .{
                    .error_type = self.toError(),
                    .gas_used = self.gas_used,
                }
            };
        }
    }
};

/// Expanded type for handling errors when calling external contracts
pub const CallResult = struct {
    status: ExecutionStatus,
    address: ?Address = null,
    
    pub fn success() CallResult {
        return .{
            .status = .{
                .code = .Stop,
                .gas_used = 0,
                .gas_refunded = 0,
            },
        };
    }
    
    pub fn failure(err: Error) CallResult {
        return .{
            .status = ExecutionStatus.fromError(err, 0),
        };
    }
    
    pub fn isSuccess(self: CallResult) bool {
        return self.status.isSuccess();
    }
    
    pub fn isRevert(self: CallResult) bool {
        return self.status.isRevert();
    }
    
    pub fn isError(self: CallResult) bool {
        return self.status.isError();
    }
};