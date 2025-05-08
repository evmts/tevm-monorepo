//! Interpreter implementation for ZigEVM
//! This module implements the core EVM interpreter that executes EVM bytecode

const std = @import("std");
const types = @import("../util/types.zig");
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;

const U256 = types.U256;
const Address = types.Address;
const Hash = types.Hash;
const Error = types.Error;
const ExecutionResult = types.ExecutionResult;

/// Result of opcode execution
pub const InterpreterAction = enum {
    Continue,
    Stop,
    Return,
    Revert,
    SelfDestruct,
};

/// Interpreter for executing EVM bytecode
pub const Interpreter = struct {
    // Execution state
    pc: usize = 0,
    code: []const u8,
    stack: Stack,
    memory: Memory,
    gas_left: u64,
    original_gas: u64,
    gas_refund: u64 = 0,
    return_data: []u8,
    return_data_allocator: std.mem.Allocator,
    jump_dest_map: []bool,
    depth: u16,
    
    // For now, this is just a placeholder shell - we'll implement the full functionality in later steps
    
    /// Initialize a new Interpreter instance
    pub fn init(
        allocator: std.mem.Allocator,
        code: []const u8,
        gas_limit: u64,
        depth: u16,
    ) !Interpreter {
        const jump_dest_map = try analyzeJumpDests(allocator, code);
        errdefer allocator.free(jump_dest_map);
        
        return Interpreter{
            .code = code,
            .stack = Stack.init(),
            .memory = try Memory.init(allocator),
            .gas_left = gas_limit,
            .original_gas = gas_limit,
            .return_data = &[_]u8{},
            .return_data_allocator = allocator,
            .jump_dest_map = jump_dest_map,
            .depth = depth,
        };
    }
    
    /// Clean up resources
    pub fn deinit(self: *Interpreter) void {
        self.memory.deinit();
        if (self.return_data.len > 0) {
            self.return_data_allocator.free(self.return_data);
        }
        self.return_data_allocator.free(self.jump_dest_map);
    }
    
    /// Main execution loop - placeholder implementation
    pub fn execute(self: *Interpreter) ExecutionResult {
        // Save original gas for calculating gas used at the end
        const original_gas = self.gas_left;
        
        // This is just a placeholder skeleton - the actual implementation
        // will be added in a later task
        
        return .{
            .Success = .{
                .gas_used = original_gas - self.gas_left,
                .gas_refunded = self.gas_refund,
                .return_data = &[_]u8{},
            }
        };
    }
    
    /// Set return data from memory
    pub fn setReturnData(self: *Interpreter, offset: usize, size: usize) !void {
        // Free previous return data if any
        if (self.return_data.len > 0) {
            self.return_data_allocator.free(self.return_data);
            self.return_data = &[_]u8{};
        }
        
        // Allocate new return data buffer
        if (size > 0) {
            var data = try self.return_data_allocator.alloc(u8, size);
            errdefer self.return_data_allocator.free(data);
            
            // Copy data from memory (handling out-of-bounds access)
            const available = if (offset >= self.memory.size) 0 
                else std.math.min(size, self.memory.size - offset);
                
            // Initialize with zeros
            @memset(data, 0);
            
            // Copy available data
            if (available > 0) {
                @memcpy(data[0..available], self.memory.data[offset..][0..available]);
            }
            
            self.return_data = data;
        }
    }
    
    /// Verify a jump destination is valid
    pub fn isValidJumpDest(self: *Interpreter, dest: usize) bool {
        if (dest >= self.code.len) {
            return false;
        }
        return self.jump_dest_map[dest];
    }
};

/// Analyze bytecode to identify all valid JUMPDEST positions
fn analyzeJumpDests(allocator: std.mem.Allocator, code: []const u8) ![]bool {
    var result = try allocator.alloc(bool, code.len);
    @memset(result, false);
    
    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];
        
        // JUMPDEST opcode (0x5B)
        if (op == 0x5B) {
            result[i] = true;
        } 
        // PUSH operations (0x60-0x7F) have immediate data to skip
        else if (op >= 0x60 and op <= 0x7F) {
            const n = @as(usize, op) - 0x5F; // Number of bytes to push
            i += n;
            if (i >= code.len) break;
        }
        
        i += 1;
    }
    
    return result;
}

// Tests
test "Interpreter initialization" {
    const bytecode = [_]u8{0x60, 0x01, 0x60, 0x02, 0x01, 0x60, 0x03, 0x5B, 0x00};
    var interpreter = try Interpreter.init(std.testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    try std.testing.expect(interpreter.code.len == bytecode.len);
    try std.testing.expect(interpreter.gas_left == 100000);
    try std.testing.expect(interpreter.depth == 0);
    try std.testing.expect(interpreter.jump_dest_map[7] == true); // JUMPDEST at position 7
    try std.testing.expect(interpreter.jump_dest_map[0] == false); // Not a JUMPDEST
}

test "Jump destination analysis" {
    const bytecode = [_]u8{
        0x60, 0x10, // PUSH1 0x10
        0x5B,       // JUMPDEST
        0x60, 0x20, // PUSH1 0x20
        0x01,       // ADD
        0x5B,       // JUMPDEST
        0x00,       // STOP
    };
    
    const jumpdests = try analyzeJumpDests(std.testing.allocator, &bytecode);
    defer std.testing.allocator.free(jumpdests);
    
    try std.testing.expect(jumpdests[2] == true);  // JUMPDEST at position 2
    try std.testing.expect(jumpdests[6] == true);  // JUMPDEST at position 6
    try std.testing.expect(jumpdests[0] == false); // PUSH1 at position 0
    try std.testing.expect(jumpdests[1] == false); // Immediate data of PUSH1
}