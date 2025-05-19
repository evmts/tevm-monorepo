const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const Contract = @import("../Contract.zig").Contract;
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;
const JumpTable = @import("../JumpTable.zig");
const block = @import("block.zig");
const Address = @import("../../Address/address.zig").Address;
const Evm = @import("../evm.zig").Evm;
const ChainRules = @import("../evm.zig").ChainRules;
const Hardfork = @import("../evm.zig").Hardfork;

test "BLOCKHASH opcode" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Create test contract
    var address_bytes = [_]u8{0} ** 20;
    address_bytes[19] = 1;
    const address = Address{ .bytes = address_bytes };
    
    var caller_bytes = [_]u8{0} ** 20;
    caller_bytes[19] = 2;
    const caller = Address{ .bytes = caller_bytes };
    
    var contract = try Contract.init(allocator, address, caller, 0, &[_]u8{});
    defer contract.deinit();
    
    // Create EVM
    var evm = Evm.init();
    
    // Create a jump table
    var jump_table = JumpTable.JumpTable.init();
    try block.registerBlockOpcodes(allocator, &jump_table);
    defer {
        inline for (0x40..0x49) |i| {
            if (jump_table.table[i]) |op| {
                allocator.destroy(op);
            }
        }
    }
    
    // Create interpreter
    var interpreter = Interpreter.create(allocator, &evm, jump_table);
    
    // Create execution frame
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Test BLOCKHASH
    // Push block number to stack
    try frame.stack.push(123);
    
    // Execute BLOCKHASH
    _ = try block.opBlockhash(0, &interpreter, &frame);
    
    // Expect result on stack
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    try testing.expectEqual(@as(u256, 0), frame.stack.data[0]);
}

test "Block information opcodes" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Create test contract
    var address_bytes = [_]u8{0} ** 20;
    address_bytes[19] = 1;
    const address = Address{ .bytes = address_bytes };
    
    var caller_bytes = [_]u8{0} ** 20;
    caller_bytes[19] = 2;
    const caller = Address{ .bytes = caller_bytes };
    
    var contract = try Contract.init(allocator, address, caller, 0, &[_]u8{});
    defer contract.deinit();
    
    // Create EVM
    var evm = Evm.init();
    
    // Create a jump table
    var jump_table = JumpTable.JumpTable.init();
    try block.registerBlockOpcodes(allocator, &jump_table);
    defer {
        inline for (0x40..0x49) |i| {
            if (jump_table.table[i]) |op| {
                allocator.destroy(op);
            }
        }
    }
    
    // Create interpreter
    var interpreter = Interpreter.create(allocator, &evm, jump_table);
    
    // Create execution frame
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Test COINBASE
    _ = try block.opCoinbase(0, &interpreter, &frame);
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    try testing.expectEqual(@as(u256, 0), frame.stack.data[0]);
    
    // Clear stack
    frame.stack.size = 0;
    
    // Test TIMESTAMP
    _ = try block.opTimestamp(0, &interpreter, &frame);
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    // Current timestamp should be non-zero
    try testing.expect(frame.stack.data[0] > 0);
    
    // Clear stack
    frame.stack.size = 0;
    
    // Test NUMBER
    _ = try block.opNumber(0, &interpreter, &frame);
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    try testing.expectEqual(@as(u256, 1), frame.stack.data[0]);
    
    // Clear stack
    frame.stack.size = 0;
    
    // Test DIFFICULTY (pre-merge)
    evm.chainRules = ChainRules.forHardfork(.London);
    _ = try block.opDifficulty(0, &interpreter, &frame);
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    try testing.expectEqual(@as(u256, 2500000000000000), frame.stack.data[0]);
    
    // Clear stack
    frame.stack.size = 0;
    
    // Test PREVRANDAO (post-merge)
    evm.chainRules = ChainRules.forHardfork(.Merge);
    _ = try block.opDifficulty(0, &interpreter, &frame);
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    try testing.expectEqual(@as(u256, 0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef), frame.stack.data[0]);
    
    // Clear stack
    frame.stack.size = 0;
    
    // Test GASLIMIT
    _ = try block.opGaslimit(0, &interpreter, &frame);
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    try testing.expectEqual(@as(u256, 30000000), frame.stack.data[0]);
    
    // Clear stack
    frame.stack.size = 0;
    
    // Test CHAINID
    _ = try block.opChainid(0, &interpreter, &frame);
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    try testing.expectEqual(@as(u256, 1), frame.stack.data[0]);
    
    // Clear stack
    frame.stack.size = 0;
    
    // Test SELFBALANCE
    _ = try block.opSelfbalance(0, &interpreter, &frame);
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    try testing.expectEqual(@as(u256, 0), frame.stack.data[0]);
    
    // Clear stack
    frame.stack.size = 0;
    
    // Test BASEFEE
    evm.chainRules = ChainRules.forHardfork(.London);
    _ = try block.opBasefee(0, &interpreter, &frame);
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    try testing.expectEqual(@as(u256, 1000000000), frame.stack.data[0]);
    
    // Clear stack
    frame.stack.size = 0;
    
    // Test BASEFEE with EIP-1559 disabled
    evm.chainRules = ChainRules.forHardfork(.Berlin);
    const basefee_result = block.opBasefee(0, &interpreter, &frame);
    try testing.expectError(error.InvalidOpcode, basefee_result);
}