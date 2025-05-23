const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Stack = evm.Stack;
const Frame = evm.Frame;
const Contract = evm.Contract;
const Interpreter = evm.Interpreter;
const Evm = evm.Evm;
const math = @import("math.zig");
const math2 = @import("math2.zig");
const comparison = @import("comparison.zig");
const bitwise = @import("bitwise.zig");
const JumpTableModule = evm.jumpTable;

// Define a Test structure to match the JSON format
const JsonTest = struct {
    X: []const u8,
    Y: []const u8,
    Expected: []const u8,
};

// Parse a hex string to a u256
fn parseHexToBigInt(hex_str: []const u8) !u256 {
    var result: u256 = 0;
    
    for (hex_str) |c| {
        // Skip 0x prefix if present
        if (hex_str.len > 1 and hex_str[0] == '0' and (hex_str[1] == 'x' or hex_str[1] == 'X')) {
            continue;
        }
        
        const nibble: u8 = switch (c) {
            '0'...'9' => c - '0',
            'a'...'f' => c - 'a' + 10,
            'A'...'F' => c - 'A' + 10,
            else => return error.InvalidHexCharacter,
        };
        
        result = (result << 4) | nibble;
    }
    
    return result;
}

// Create a temporary testing environment
fn createTestEnvironment(allocator: std.mem.Allocator) !struct {
    evm: *Evm,
    interpreter: Interpreter,
    frame: Frame,
    contract: *Contract.Contract
} {
    var evm = try allocator.create(Evm);
    evm.* = Evm.init();
    
    var contract = try allocator.create(Contract.Contract);
    contract.* = Contract.Contract{
        .code = try allocator.alloc(u8, 0),
        .input = &[_]u8{},
        .address = undefined,
        .caller = undefined,
        .value = 0,
        .gas = 1000000,
        .code_hash = [_]u8{0} ** 32,
        .analysis = null,
        .jumpdests = null,
        .is_deployment = false,
        .is_system_call = false,
    };
    
    const interpreter = Interpreter.create(allocator, evm, JumpTableModule.JumpTable.init());
    var frame = try Frame.init(allocator, contract);
    
    return .{
        .evm = evm,
        .interpreter = interpreter,
        .frame = frame,
        .contract = contract,
    };
}

// Run a single test for an opcode
fn runOpTest(
    allocator: std.testing.Allocator,
    op_fn: fn (usize, *Interpreter, *Frame) anyerror![]const u8,
    x: []const u8,
    y: []const u8,
    expected: []const u8,
) !void {
    var env = try createTestEnvironment(allocator);
    defer {
        allocator.free(env.contract.code);
        allocator.destroy(env.contract);
        allocator.destroy(env.evm);
        env.frame.deinit();
    }
    
    // Parse hex values
    const x_val = try parseHexToBigInt(x);
    const y_val = try parseHexToBigInt(y);
    const expected_val = try parseHexToBigInt(expected);
    
    // Set up the stack
    try env.frame.stack.push(x_val);
    try env.frame.stack.push(y_val);
    
    // Execute the operation
    _ = try op_fn(0, &env.interpreter, &env.frame);
    
    // Check the result (should be one value on the stack)
    try testing.expectEqual(@as(usize, 1), env.frame.stack.size);
    const result = try env.frame.stack.peek().*;
    try testing.expectEqual(expected_val, result);
}

// Load and run tests from a JSON file
fn runJsonTests(
    allocator: std.testing.Allocator,
    json_path: []const u8,
    op_fn: fn (usize, *Interpreter, *Frame) anyerror![]const u8,
) !void {
    // Read the JSON file
    const file = try std.fs.cwd().openFile(json_path, .{});
    defer file.close();
    
    const file_content = try file.readToEndAlloc(allocator, 1024 * 1024); // 1MB max
    defer allocator.free(file_content);
    
    // Parse JSON
    var parser = std.json.Parser.init(allocator, false);
    defer parser.deinit();
    
    var tree = try parser.parse(file_content);
    defer tree.deinit();
    
    // Expect an array of tests
    if (tree.root != .Array) {
        return error.InvalidJson;
    }
    
    const tests = tree.root.Array.items;
    for (tests, 0..) |test_obj, i| {
        if (test_obj != .Object) {
            std.debug.print("Test {d} is not an object\n", .{i});
            continue;
        }
        
        const test_map = test_obj.Object;
        
        const x = test_map.get("X") orelse {
            std.debug.print("Test {d} missing X value\n", .{i});
            continue;
        };
        
        const y = test_map.get("Y") orelse {
            std.debug.print("Test {d} missing Y value\n", .{i});
            continue;
        };
        
        const expected = test_map.get("Expected") orelse {
            std.debug.print("Test {d} missing Expected value\n", .{i});
            continue;
        };
        
        if (x != .String or y != .String or expected != .String) {
            std.debug.print("Test {d} has invalid value types\n", .{i});
            continue;
        }
        
        try runOpTest(allocator, op_fn, x.String, y.String, expected.String);
        std.debug.print("Test {d} passed\n", .{i});
    }
}

test "Run ADD JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_add.json",
        math.opAdd
    );
}

test "Run SUB JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_sub.json",
        math.opSub
    );
}

test "Run MUL JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_mul.json",
        math.opMul
    );
}

test "Run DIV JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_div.json",
        math.opDiv
    );
}

test "Run SDIV JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_sdiv.json",
        math2.opSdiv
    );
}

test "Run MOD JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_mod.json",
        math2.opMod
    );
}

test "Run SMOD JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_smod.json",
        math2.opSmod
    );
}

test "Run EXP JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_exp.json",
        math2.opExp
    );
}

test "Run AND JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_and.json",
        bitwise.opAnd
    );
}

test "Run OR JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_or.json",
        bitwise.opOr
    );
}

test "Run XOR JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_xor.json",
        bitwise.opXor
    );
}

test "Run BYTE JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_byte.json",
        bitwise.opByte
    );
}

test "Run SHL JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_shl.json",
        bitwise.opShl
    );
}

test "Run SHR JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_shr.json",
        bitwise.opShr
    );
}

test "Run SAR JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_sar.json",
        bitwise.opSar
    );
}

test "Run LT JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_lt.json",
        comparison.opLt
    );
}

test "Run GT JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_gt.json",
        comparison.opGt
    );
}

test "Run SLT JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_slt.json",
        comparison.opSlt
    );
}

test "Run SGT JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_sgt.json",
        comparison.opSgt
    );
}

test "Run EQ JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_eq.json",
        comparison.opEq
    );
}

test "Run SIGNEXT JSON tests" {
    try runJsonTests(
        testing.allocator,
        "/Users/williamcory/tevm/main/src/Evm/go-ethereum/core/vm/testdata/testcases_signext.json",
        math2.opSignextend
    );
}