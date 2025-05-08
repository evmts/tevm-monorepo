//! Call frame implementation for ZigEVM
//! This module implements call frame management for nested calls in the EVM

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Address = types.Address;
const Error = types.Error;
const Memory = @import("../memory/memory.zig").Memory;
const Stack = @import("../stack/stack.zig").Stack;
const ReturnData = @import("return_data.zig").ReturnData;

/// Max call depth allowed by the EVM
pub const MAX_CALL_DEPTH: u16 = 1024;

/// Call type specifies the kind of call operation
pub const CallType = enum {
    CALL,
    CALLCODE,
    DELEGATECALL,
    STATICCALL,
};

/// Call frame represents a single execution context in a call stack
/// Each frame tracks its own state independently
pub const CallFrame = struct {
    // Addresses involved in the call
    caller: Address,
    address: Address,  // Contract being executed
    code_address: Address, // Address of the code being executed (may differ from address in DELEGATECALL)
    
    // Context flags
    is_static: bool,   // Is this a static call context?
    should_transfer: bool, // Should value be transferred with the call?
    
    // Call data and value
    call_data: []const u8,
    value: U256,
    
    // Execution state
    memory: Memory,
    stack: Stack,
    pc: usize = 0,
    code: []const u8,
    gas_left: u64,
    gas_refund: u64 = 0,
    depth: u16,
    
    // Return data management
    return_data: ReturnData,
    return_offset: usize = 0,
    return_size: usize = 0,
    
    // Parent frame reference
    parent: ?*CallFrame = null,
    
    // Allocator for memory management
    allocator: std.mem.Allocator,
    
    /// Initialize a new call frame
    pub fn init(
        allocator: std.mem.Allocator,
        caller: Address,
        address: Address,
        code_address: Address,
        code: []const u8,
        call_data: []const u8,
        value: U256,
        gas: u64,
        depth: u16,
        is_static: bool,
        should_transfer: bool,
        parent: ?*CallFrame,
    ) !CallFrame {
        if (depth >= MAX_CALL_DEPTH) {
            return Error.CallDepthExceeded;
        }
        
        return CallFrame{
            .caller = caller,
            .address = address,
            .code_address = code_address,
            .is_static = is_static,
            .should_transfer = should_transfer,
            .call_data = call_data,
            .value = value,
            .memory = try Memory.init(allocator),
            .stack = Stack.init(),
            .code = code,
            .gas_left = gas,
            .depth = depth,
            .return_data = ReturnData.init(allocator),
            .allocator = allocator,
            .parent = parent,
        };
    }
    
    /// Clean up resources
    pub fn deinit(self: *CallFrame) void {
        self.memory.deinit();
        self.return_data.deinit();
    }
    
    /// Create call arguments struct for a new call
    pub const CallArgs = struct {
        call_type: CallType,
        gas: u64,
        address: Address,
        value: U256,
        call_data_offset: usize,
        call_data_size: usize,
        return_data_offset: usize,
        return_data_size: usize,
    };
    
    /// Process a call operation (CALL, CALLCODE, DELEGATECALL, STATICCALL)
    pub fn processCall(self: *CallFrame, args: CallArgs) !void {
        // This would be the implementation for handling calls
        // For now, just throw an error as placeholder
        return Error.InvalidOpcode;
    }
    
    /// Get memory segment to use as call data
    fn getCallData(self: *CallFrame, offset: usize, size: usize) ![]const u8 {
        if (size == 0) {
            return &[_]u8{};
        }
        
        // Ensure memory is large enough
        _ = self.memory.expand(offset + size);
        
        // Get slice from memory
        return self.memory.page.buffer[offset..][0..size];
    }
    
    /// Check if a call is allowed in this context
    fn isCallAllowed(self: *CallFrame, args: CallArgs) bool {
        // In a static context, value transfers are not allowed
        if (self.is_static and args.call_type != .STATICCALL) {
            if (!args.value.isZero()) {
                return false;
            }
        }
        
        return true;
    }
};

/// Error returned when call depth exceeds maximum
pub fn callDepthExceeded() Error {
    return Error.CallDepthExceeded;
}

/// Opcode placeholders

/// CALL opcode placeholder
pub fn call() Error!void {
    return Error.InvalidOpcode;
}

/// CALLCODE opcode placeholder
pub fn callcode() Error!void {
    return Error.InvalidOpcode;
}

/// DELEGATECALL opcode placeholder
pub fn delegatecall() Error!void {
    return Error.InvalidOpcode;
}

/// STATICCALL opcode placeholder
pub fn staticcall() Error!void {
    return Error.InvalidOpcode;
}