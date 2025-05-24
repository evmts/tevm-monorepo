const std = @import("std");
const testing = std.testing;
const Evm = @import("evm.zig").Evm;
const Interpreter = @import("interpreter.zig").Interpreter;
const createContract = @import("Contract.zig").createContract;
const Frame = @import("Frame.zig").Frame;
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;

// Real TestBasicOps bytecode (deployed portion from solc compilation)
const TEST_BASIC_OPS_BYTECODE = "608060405234801561000f575f5ffd5b5060043610610106575f3560e01c8063a37bb5141161009e578063e10fb98f1161006e578063e10fb98f14610189578063e38cc06b14610189578063e7d5a62b14610197578063f613a6871461010a578063fac7a1101461010a575f5ffd5b8063a37bb51414610182578063ae40f72f14610189578063ca61cdac14610189578063d197429b14610190575f5ffd5b80635b3aea1d116100d95780635b3aea1d1461014b578063619768991461010a5780638816b3cd146101745780638a4836e81461017b575f5ffd5b8063086356831461010a5780630d18ac291461012257806317a91fe81461013457806329c1476614610145575b5f5ffd5b60015b60405190151581526020015b60405180910390f35b604051602160f91b8152602001610119565b600c5b604051908152602001610119565b5f61010d565b60408051600160f81b8152600160f91b6020820152600360f81b91810191909152606001610119565b6010610137565b6005610137565b6007610137565b601e610137565b6008610137565b5f1961013756fea26469706673582212205276fd99b80b0eaf556457d587ffb9e13e83ba160ea47fb86d09b54ee814e4f664736f6c634300081e0033";

// Function selectors for TestBasicOps (from ABI)
const Selectors = struct {
    const testAdd = [4]u8{ 0x0d, 0x18, 0xac, 0x29 };
    const testSub = [4]u8{ 0x17, 0xa9, 0x1f, 0xe8 };
    const testMul = [4]u8{ 0x29, 0xc1, 0x47, 0x66 };
    const testDiv = [4]u8{ 0x5b, 0x3a, 0xea, 0x1d };
    const testLt = [4]u8{ 0x08, 0x63, 0x56, 0x83 };
    const testGt = [4]u8{ 0x61, 0x97, 0x68, 0x99 };
    const testEq = [4]u8{ 0x88, 0x16, 0xb3, 0xcd };
    const testAnd = [4]u8{ 0x8a, 0x48, 0x36, 0xe8 };
    const testOr = [4]u8{ 0xa3, 0x7b, 0xb5, 0x14 };
    const testXor = [4]u8{ 0xae, 0x40, 0xf7, 0x2f };
    const testNot = [4]u8{ 0xca, 0x61, 0xcd, 0xac };
    const testShl = [4]u8{ 0xd1, 0x97, 0x42, 0x9b };
    const testShr = [4]u8{ 0xe1, 0x0f, 0xb9, 0x8f };
    const returnTrue = [4]u8{ 0xe3, 0x8c, 0xc0, 0x6b };
    const returnFalse = [4]u8{ 0xe7, 0xd5, 0xa6, 0x2b };
    const returnByte = [4]u8{ 0xf6, 0x13, 0xa6, 0x87 };
    const returnThreeBytes = [4]u8{ 0xfa, 0xc7, 0xa1, 0x10 };
};

// Helper to convert hex string to bytes
fn hexToBytes(allocator: std.mem.Allocator, hex: []const u8) ![]u8 {
    const start: usize = if (hex.len >= 2 and hex[0] == '0' and hex[1] == 'x') 2 else 0;
    const hex_without_prefix = hex[start..];
    
    if (hex_without_prefix.len % 2 != 0) {
        return error.InvalidHexLength;
    }
    
    const bytes = try allocator.alloc(u8, hex_without_prefix.len / 2);
    
    var i: usize = 0;
    while (i < hex_without_prefix.len) : (i += 2) {
        const byte_str = hex_without_prefix[i..i + 2];
        bytes[i / 2] = try std.fmt.parseInt(u8, byte_str, 16);
    }
    
    return bytes;
}

// Helper to run a contract function and get the result
fn runContractFunction(allocator: std.mem.Allocator, bytecode: []const u8, selector: [4]u8) !struct {
    success: bool,
    return_data: []const u8,
    gas_used: u64,
} {
    // Create EVM instance
    var evm_instance = try Evm.init(null);
    
    // Create interpreter
    var interpreter = try Interpreter.init(allocator, &evm_instance);
    defer interpreter.deinit();
    
    // Create addresses
    const caller: [20]u8 = [_]u8{0x12} ** 20;
    const contract_addr: [20]u8 = [_]u8{0x34} ** 20;
    
    // Create contract
    const initial_gas = 1_000_000;
    var contract = createContract(
        contract_addr,
        caller,
        0, // value
        initial_gas
    );
    contract.code = bytecode;
    
    // Create frame
    var frame = Frame{
        .contract = contract,
        .stack = Stack{},
        .memory = try Memory.init(allocator),
        .returndata = &[_]u8{},
        .gas_remaining = contract.gas,
        .gas_refund = 0,
        .return_range = .{ .offset = 0, .length = 0 },
        .pc = 0,
        .allocator = allocator,
    };
    // Stack no longer needs deinit
    defer frame.memory.deinit();
    
    // Push the frame
    try interpreter.pushFrame(frame);
    defer _ = interpreter.popFrame();
    
    // Run the contract with the function selector
    const result = interpreter.run(&contract, &selector, false) catch |err| {
        std.debug.print("Contract execution error: {}\n", .{err});
        return .{
            .success = false,
            .return_data = &[_]u8{},
            .gas_used = initial_gas - contract.gas,
        };
    };
    
    // Copy return data to prevent it being freed
    const return_data_copy = try allocator.alloc(u8, result.return_data.len);
    @memcpy(return_data_copy, result.return_data);
    
    return .{
        .success = true,
        .return_data = return_data_copy,
        .gas_used = initial_gas - contract.gas,
    };
}

test "TestBasicOps integration tests" {
    std.debug.print("\n=== TestBasicOps Contract Integration Tests ===\n", .{});
    
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Convert bytecode from hex
    const bytecode = try hexToBytes(allocator, TEST_BASIC_OPS_BYTECODE);
    defer allocator.free(bytecode);
    
    // Test 1: testAdd() - should return 30
    {
        std.debug.print("\nTest: testAdd()\n", .{});
        const result = try runContractFunction(allocator, bytecode, Selectors.testAdd);
        
        std.debug.print("  Success: {}\n", .{result.success});
        std.debug.print("  Gas used: {}\n", .{result.gas_used});
        std.debug.print("  Return data length: {}\n", .{result.return_data.len});
        
        if (result.success and result.return_data.len >= 32) {
            const value = result.return_data[31];
            std.debug.print("  Returned value: {}\n", .{value});
            try testing.expectEqual(@as(u8, 30), value);
        } else {
            return error.TestFailed;
        }
    }
    
    // Test 2: testSub() - should return 30
    {
        std.debug.print("\nTest: testSub()\n", .{});
        const result = try runContractFunction(allocator, bytecode, Selectors.testSub);
        
        std.debug.print("  Success: {}\n", .{result.success});
        std.debug.print("  Gas used: {}\n", .{result.gas_used});
        std.debug.print("  Return data length: {}\n", .{result.return_data.len});
        
        if (result.success and result.return_data.len >= 32) {
            const value = result.return_data[31];
            std.debug.print("  Returned value: {}\n", .{value});
            try testing.expectEqual(@as(u8, 30), value);
        } else {
            return error.TestFailed;
        }
    }
    
    // Test 3: testMul() - should return 30
    {
        std.debug.print("\nTest: testMul()\n", .{});
        const result = try runContractFunction(allocator, bytecode, Selectors.testMul);
        
        std.debug.print("  Success: {}\n", .{result.success});
        std.debug.print("  Gas used: {}\n", .{result.gas_used});
        std.debug.print("  Return data length: {}\n", .{result.return_data.len});
        
        if (result.success and result.return_data.len >= 32) {
            const value = result.return_data[31];
            std.debug.print("  Returned value: {}\n", .{value});
            try testing.expectEqual(@as(u8, 30), value);
        } else {
            return error.TestFailed;
        }
    }
    
    // Test 4: testDiv() - should return 30
    {
        std.debug.print("\nTest: testDiv()\n", .{});
        const result = try runContractFunction(allocator, bytecode, Selectors.testDiv);
        
        std.debug.print("  Success: {}\n", .{result.success});
        std.debug.print("  Gas used: {}\n", .{result.gas_used});
        std.debug.print("  Return data length: {}\n", .{result.return_data.len});
        
        if (result.success and result.return_data.len >= 32) {
            const value = result.return_data[31];
            std.debug.print("  Returned value: {}\n", .{value});
            try testing.expectEqual(@as(u8, 30), value);
        } else {
            return error.TestFailed;
        }
    }
    
    // Test 5: testLt() - should return true (1)
    {
        std.debug.print("\nTest: testLt()\n", .{});
        const result = try runContractFunction(allocator, bytecode, Selectors.testLt);
        
        std.debug.print("  Success: {}\n", .{result.success});
        std.debug.print("  Gas used: {}\n", .{result.gas_used});
        std.debug.print("  Return data length: {}\n", .{result.return_data.len});
        
        if (result.success and result.return_data.len >= 32) {
            const value = result.return_data[31];
            std.debug.print("  Returned value: {} (bool: {})\n", .{ value, value == 1 });
            try testing.expectEqual(@as(u8, 1), value);
        } else {
            return error.TestFailed;
        }
    }
    
    // Test 6: testGt() - should return true (1)
    {
        std.debug.print("\nTest: testGt()\n", .{});
        const result = try runContractFunction(allocator, bytecode, Selectors.testGt);
        
        std.debug.print("  Success: {}\n", .{result.success});
        std.debug.print("  Gas used: {}\n", .{result.gas_used});
        std.debug.print("  Return data length: {}\n", .{result.return_data.len});
        
        if (result.success and result.return_data.len >= 32) {
            const value = result.return_data[31];
            std.debug.print("  Returned value: {} (bool: {})\n", .{ value, value == 1 });
            try testing.expectEqual(@as(u8, 1), value);
        } else {
            return error.TestFailed;
        }
    }
    
    // Test 7: testAnd() - should return 7
    {
        std.debug.print("\nTest: testAnd()\n", .{});
        const result = try runContractFunction(allocator, bytecode, Selectors.testAnd);
        
        std.debug.print("  Success: {}\n", .{result.success});
        std.debug.print("  Gas used: {}\n", .{result.gas_used});
        std.debug.print("  Return data length: {}\n", .{result.return_data.len});
        
        if (result.success and result.return_data.len >= 32) {
            const value = result.return_data[31];
            std.debug.print("  Returned value: {}\n", .{value});
            try testing.expectEqual(@as(u8, 7), value);
        } else {
            return error.TestFailed;
        }
    }
    
    // Test 8: returnThreeBytes() - should return (0x01, 0x02, 0x03)
    {
        std.debug.print("\nTest: returnThreeBytes()\n", .{});
        const result = try runContractFunction(allocator, bytecode, Selectors.returnThreeBytes);
        
        std.debug.print("  Success: {}\n", .{result.success});
        std.debug.print("  Gas used: {}\n", .{result.gas_used});
        std.debug.print("  Return data length: {}\n", .{result.return_data.len});
        
        if (result.success and result.return_data.len >= 96) {
            // The return data should be ABI encoded: 3 bytes32 values
            const byte1 = result.return_data[31];
            const byte2 = result.return_data[63];
            const byte3 = result.return_data[95];
            
            std.debug.print("  Returned values: 0x{x:0>2}, 0x{x:0>2}, 0x{x:0>2}\n", .{ byte1, byte2, byte3 });
            
            try testing.expectEqual(@as(u8, 0x01), byte1);
            try testing.expectEqual(@as(u8, 0x02), byte2);
            try testing.expectEqual(@as(u8, 0x03), byte3);
        } else {
            std.debug.print("  ERROR: Unexpected return data length\n", .{});
            return error.TestFailed;
        }
    }
    
    std.debug.print("\n✅ All tests passed!\n", .{});
}