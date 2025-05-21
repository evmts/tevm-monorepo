const std = @import("std");
const testing = std.testing;
const evm_mod = @import("evm.zig");
const Evm = evm_mod.Evm;
const interpreter_mod = @import("interpreter.zig");
const Interpreter = interpreter_mod.Interpreter;
const JumpTable = @import("JumpTable.zig").JumpTable;
const opcodes = @import("opcodes.zig");

// Test the new convenience init() method added to Interpreter
test "Interpreter init with default jump table" {
    const allocator = std.testing.allocator;
    
    // First create an EVM instance
    var evm = try Evm.init(null);
    
    // Now create an interpreter using the new init() method
    var interpreter = try Interpreter.init(allocator, &evm);
    defer interpreter.deinit();
    
    // Verify that the interpreter was initialized correctly
    try testing.expectEqual(&evm, interpreter.evm);
    try testing.expect(interpreter.table.items.len >= 256); // Jump table should be populated
    
    // Test that essential opcodes were registered
    try testing.expect(interpreter.table.items[0].isValid());    // STOP opcode
    try testing.expect(interpreter.table.items[1].isValid());    // ADD opcode
    try testing.expect(interpreter.table.items[96].isValid());   // PUSH1 opcode
    try testing.expect(interpreter.table.items[160].isValid());  // POP opcode
}

// Test that the constructor properly initializes memory for the interpreter
test "Interpreter init properly allocates resources" {
    const allocator = std.testing.allocator;
    
    // Create an EVM instance
    var evm = try Evm.init(null);
    
    // Use a scoped block to ensure resources are freed
    {
        var interpreter = try Interpreter.init(allocator, &evm);
        defer interpreter.deinit();
        
        // Verify allocator is stored correctly
        try testing.expectEqual(allocator, interpreter.allocator);
    }
    
    // If we get here without memory leaks, the deinit worked properly
}