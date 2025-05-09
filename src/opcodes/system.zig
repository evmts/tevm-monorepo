//! System operation opcodes for ZigEVM
//! This module implements system operations like LOG, SELFDESTRUCT, CALL, etc.

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Address = types.Address;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;

/// Represents the type of log operation (LOG0-LOG4)
pub const LogType = enum(u8) {
    LOG0 = 0,
    LOG1 = 1,
    LOG2 = 2,
    LOG3 = 3,
    LOG4 = 4,
};

/// Interface for log event emission
pub const LogEmitter = struct {
    /// Function pointer type for emitting logs
    pub const EmitFn = *const fn(address: Address, topics: []const U256, data: []const u8) Error!void;
    
    /// The actual function pointer to call
    emit_fn: EmitFn,
    
    /// Create a new LogEmitter with the given emit function
    pub fn init(emit_fn: EmitFn) LogEmitter {
        return LogEmitter{
            .emit_fn = emit_fn,
        };
    }
    
    /// Emit a log with the given data
    pub fn emit(self: *const LogEmitter, address: Address, topics: []const U256, data: []const u8) !void {
        return self.emit_fn(address, topics, data);
    }
};

/// Interface for account operations
pub const AccountOperator = struct {
    /// Function pointer type for self-destructing accounts
    pub const SelfDestructFn = *const fn(address: Address, beneficiary: Address) Error!void;
    
    /// Function pointer type for loading account info
    pub const LoadAccountFn = *const fn(address: Address) Error!?U256;
    
    /// The function pointers to use
    self_destruct_fn: SelfDestructFn,
    load_account_fn: LoadAccountFn,
    
    /// Create a new AccountOperator with the given functions
    pub fn init(self_destruct_fn: SelfDestructFn, load_account_fn: LoadAccountFn) AccountOperator {
        return AccountOperator{
            .self_destruct_fn = self_destruct_fn,
            .load_account_fn = load_account_fn,
        };
    }
    
    /// Self-destruct an account
    pub fn selfDestruct(self: *const AccountOperator, address: Address, beneficiary: Address) !void {
        return self.self_destruct_fn(address, beneficiary);
    }
    
    /// Load account information
    pub fn loadAccount(self: *const AccountOperator, address: Address) !?U256 {
        return self.load_account_fn(address);
    }
};

/// Generic implementation of LOG opcodes (LOG0-LOG4)
/// Takes number of topics as a parameter
pub fn log(
    stack: *Stack,
    memory: *Memory,
    num_topics: u8, 
    log_emitter: ?*const LogEmitter,
    caller_address: ?Address,
) !void {
    // Get memory offset and size
    const size = try stack.pop();
    const offset = try stack.pop();
    
    // Ensure they fit in usize
    if (size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0 or
        offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_offset = @intCast(offset.words[0]);
    const mem_size = @intCast(size.words[0]);
    
    // Get the log data from memory
    var data: []const u8 = &[_]u8{};
    if (mem_size > 0) {
        // Ensure memory is expanded
        _ = memory.expand(mem_offset + mem_size);
        
        // Get slice from memory
        data = memory.page.buffer[mem_offset..][0..mem_size];
    }
    
    // Get topics from stack
    var topics = try std.heap.c_allocator.alloc(U256, num_topics);
    defer std.heap.c_allocator.free(topics);
    
    for (0..num_topics) |i| {
        topics[num_topics - 1 - i] = try stack.pop();
    }
    
    // If log emitter is provided, emit the log
    if (log_emitter != null and caller_address != null) {
        try log_emitter.?.emit(caller_address.?, topics, data);
    }
}

/// Implementation of LOG0 opcode
pub fn log0(
    stack: *Stack,
    memory: *Memory,
    log_emitter: ?*const LogEmitter,
    caller_address: ?Address,
) !void {
    return log(stack, memory, 0, log_emitter, caller_address);
}

/// Implementation of LOG1 opcode
pub fn log1(
    stack: *Stack,
    memory: *Memory,
    log_emitter: ?*const LogEmitter,
    caller_address: ?Address,
) !void {
    return log(stack, memory, 1, log_emitter, caller_address);
}

/// Implementation of LOG2 opcode
pub fn log2(
    stack: *Stack,
    memory: *Memory,
    log_emitter: ?*const LogEmitter,
    caller_address: ?Address,
) !void {
    return log(stack, memory, 2, log_emitter, caller_address);
}

/// Implementation of LOG3 opcode
pub fn log3(
    stack: *Stack,
    memory: *Memory,
    log_emitter: ?*const LogEmitter,
    caller_address: ?Address,
) !void {
    return log(stack, memory, 3, log_emitter, caller_address);
}

/// Implementation of LOG4 opcode
pub fn log4(
    stack: *Stack,
    memory: *Memory,
    log_emitter: ?*const LogEmitter,
    caller_address: ?Address,
) !void {
    return log(stack, memory, 4, log_emitter, caller_address);
}

/// Implementation of SELFDESTRUCT opcode
pub fn selfdestruct(
    stack: *Stack,
    account_operator: ?*const AccountOperator,
    caller_address: ?Address,
) !void {
    // Get beneficiary address from stack
    const beneficiary_u256 = try stack.pop();
    
    // Convert to Address type (using first 20 bytes)
    var beneficiary_bytes: [20]u8 = undefined;
    
    // Convert U256 to Address bytes (big-endian)
    var u256_bytes: [32]u8 = undefined;
    beneficiary_u256.toBytes(&u256_bytes);
    
    // Use the last 20 bytes (right-aligned)
    @memcpy(&beneficiary_bytes, u256_bytes[12..32]);
    
    const beneficiary = Address{ .bytes = beneficiary_bytes };
    
    // If account operator is provided, perform self-destruct
    if (account_operator != null and caller_address != null) {
        try account_operator.?.selfDestruct(caller_address.?, beneficiary);
    }
}

// Placeholder for CALL opcode implementation
pub fn call() Error!void {
    return Error.InvalidOpcode; // Not yet implemented
}

// Placeholder for CALLCODE opcode implementation
pub fn callcode() Error!void {
    return Error.InvalidOpcode; // Not yet implemented
}

// Placeholder for DELEGATECALL opcode implementation
pub fn delegatecall() Error!void {
    return Error.InvalidOpcode; // Not yet implemented
}

// Placeholder for STATICCALL opcode implementation
pub fn staticcall() Error!void {
    return Error.InvalidOpcode; // Not yet implemented
}

// Placeholder for CREATE opcode implementation
pub fn create() Error!void {
    return Error.InvalidOpcode; // Not yet implemented
}

// Placeholder for CREATE2 opcode implementation
pub fn create2() Error!void {
    return Error.InvalidOpcode; // Not yet implemented
}