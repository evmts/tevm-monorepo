const std = @import("std");
const Contract = @import("contract.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");
const JumpTable = @import("jump_table.zig");
const Frame = @import("frame.zig");

const Self = @This();

allocator: std.mem.Allocator,

return_data: []u8 = &[_]u8{},

stack: Stack = .{},
memory: Memory,
table: JumpTable,

depth: u16 = 0,

read_only: bool = false,

pub fn init(allocator: std.mem.Allocator) !Self {
    var memory = try Memory.init_default(allocator);
    memory.finalize_root();
    
    return Self{ 
        .allocator = allocator, 
        .memory = memory,
        .table = JumpTable.init(),
    };
}

pub fn deinit(self: *Self) void {
    self.memory.deinit();
}

pub fn interpret(self: *Self, contract: *Contract, input: []const u8) ![]const u8 {
    _ = input;

    self.depth += 1;
    defer self.depth -= 1;

    var pc: usize = 0;
    var frame = Frame.init(self.allocator, contract);

    while (true) {
        const operation = self.table.get_operation(contract.get_op(pc));
        // Cast frame and self to the opaque types expected by execute
        const interpreter_ptr: *Operation.Interpreter = @ptrCast(&frame);
        const state_ptr: *Operation.State = @ptrCast(self);
        const result = try operation.execute(pc, interpreter_ptr, state_ptr);
        
        // Update pc based on result (for now, just increment)
        pc += 1;
        
        // Check if we should stop
        if (result.len > 0 or pc >= contract.code_size) {
            return result;
        }
    }
}
