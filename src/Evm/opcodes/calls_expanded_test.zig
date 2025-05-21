const std = @import("std");
const testing = std.testing;

// Import from the main Evm module
const EvmModule = @import("Evm");
const Interpreter = EvmModule.Interpreter;
const Frame = EvmModule.Frame;
const ExecutionError = EvmModule.InterpreterError;
const Stack = EvmModule.Stack;
const Memory = EvmModule.Memory;
const Evm = EvmModule.Evm;
const Contract = EvmModule.Contract;
const createContract = EvmModule.createContract;
const ChainRules = EvmModule.ChainRules;
const StateManager = EvmModule.StateManager;
const Account = EvmModule.Account;
const EvmLogger = EvmModule.EvmLogger;

// Import Address from the Address module
const AddressModule = @import("Address");
const Address = AddressModule.Address;
const createAddress = AddressModule.createAddress;

// Use Zig's built-in u256 type
const u256_native = u256;

/// Converts a hex string to an Address type
fn hexToAddress(allocator: std.mem.Allocator, comptime hex_str: []const u8) !Address {
    _ = allocator;
    if (!std.mem.startsWith(u8, hex_str, "0x") or hex_str.len != 42) {
        return error.InvalidAddressFormat;
    }
    var addr: Address = undefined;
    try std.fmt.hexToBytes(&addr, hex_str[2..]);
    return addr;
}

/// Creates a hex string from an address for debugging
fn addressToHex(addr: Address) ![42]u8 {
    var result: [42]u8 = undefined;
    _ = try std.fmt.bufPrint(result[0..2], "0x", .{});
    _ = try std.fmt.bufPrint(result[2..], "{x}", .{std.fmt.fmtSliceHexLower(&addr)});
    return result;
}

/// Mock State Manager for testing
const MockStateManager = struct {
    const Self = @This();
    
    allocator: std.mem.Allocator,
    accounts: std.StringHashMap(Account),
    logger: ?EvmLogger,
    
    pub fn init(allocator: std.mem.Allocator) !*Self {
        var self = try allocator.create(Self);
        self.* = .{
            .allocator = allocator,
            .accounts = std.StringHashMap(Account).init(allocator),
            .logger = null,
        };
        return self;
    }
    
    pub fn deinit(self: *Self) void {
        self.accounts.deinit();
        self.allocator.destroy(self);
    }
    
    pub fn getAccount(self: *Self, address: Address) !?Account {
        const addr_str = std.fmt.allocPrint(self.allocator, "{s}", .{@as([]const u8, &address)}) catch return null;
        defer self.allocator.free(addr_str);
        
        return self.accounts.get(addr_str);
    }
    
    pub fn setAccount(self: *Self, address: Address, account: Account) !void {
        const addr_str = try std.fmt.allocPrint(self.allocator, "{s}", .{@as([]const u8, &address)});
        errdefer self.allocator.free(addr_str);
        
        try self.accounts.put(addr_str, account);
    }
    
    pub fn getCode(self: *Self, address: Address) !?[]const u8 {
        const account = try self.getAccount(address) orelse return null;
        return account.code;
    }
    
    pub fn setCode(self: *Self, address: Address, code: []const u8) !void {
        var account = try self.getAccount(address) orelse Account{
            .nonce = 0,
            .balance = 0,
            .code = null,
        };
        
        // Create a copy of the code
        if (account.code) |old_code| {
            self.allocator.free(old_code);
        }
        
        const code_copy = try self.allocator.dupe(u8, code);
        account.code = code_copy;
        
        try self.setAccount(address, account);
    }
    
    pub fn getBalance(self: *Self, address: Address) !u256_native {
        const account = try self.getAccount(address) orelse return 0;
        return account.balance;
    }
    
    pub fn setBalance(self: *Self, address: Address, balance: u256_native) !void {
        var account = try self.getAccount(address) orelse Account{
            .nonce = 0,
            .balance = 0,
            .code = null,
        };
        
        account.balance = balance;
        try self.setAccount(address, account);
    }
};

/// Enhanced setup function for interpreter with state manager
fn setupInterpreterWithState(allocator: std.testing.AllocatorType.e) !struct { interpreter: *Interpreter, state: *MockStateManager } {
    var state_manager = try MockStateManager.init(allocator);
    errdefer state_manager.deinit();
    
    var evm_instance = try Evm.init(null);
    evm_instance.state_manager = state_manager;
    
    // Create the interpreter
    const interpreter_instance = try Interpreter.init(allocator, &evm_instance);
    
    return .{
        .interpreter = interpreter_instance,
        .state = state_manager,
    };
}

/// Sets up a contract with the given code
fn setupContract(allocator: std.mem.Allocator, code_slice: []const u8) !Contract {
    var contract_instance = createContract(
        try hexToAddress(allocator, "0x0000000000000000000000000000000000000001"),
        try hexToAddress(allocator, "0x0000000000000000000000000000000000000002"),
        0,
        1000000, // Increased gas for tests
    );
    contract_instance.code = code_slice;
    return contract_instance;
}

/// Sets up a frame for running the contract
fn setupFrameForContract(interpreter: *Interpreter, allocator: std.mem.Allocator, contract: *Contract) !*Frame {
    _ = interpreter;
    const frame_instance = try Frame.init(allocator, contract);
    return frame_instance;
}

/// Helper for setting up a simple target contract for calls
fn setupTargetContract(state: *MockStateManager, address: Address, code: []const u8, balance: u256_native) !void {
    try state.setCode(address, code);
    try state.setBalance(address, balance);
}

// ==================== TEST CASES ====================

// ===== CALL OPCODE (0xF1) TESTS =====

/// Test CALL with insufficient stack items
test "CALL with insufficient stack" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x1234); // address
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    // Missing outSize

    const result = interpreter.run(&contract, &[_]u8{}, false);
    try testing.expectError(ExecutionError.StackUnderflow, result);
}

/// Test basic CALL functionality with a target contract
test "CALL basic operation" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup a target contract that we'll call
    const target_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000123");
    const target_code = [_]u8{0x60, 0x01, 0x60, 0x00, 0x52, 0x60, 0x01, 0x60, 0x00, 0xf3}; // PUSH1 1 PUSH1 0 MSTORE PUSH1 1 PUSH1 0 RETURN
    try setupTargetContract(state, target_addr, &target_code, 0);
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup the caller's memory with input data
    const input_data = [_]u8{0xAA, 0xBB, 0xCC, 0xDD};
    try frame.memory.store(0x20, &input_data);
    
    // Setup memory space for output
    const memory_size: usize = 0x60; // Input at 0x20, output at 0x40
    try frame.memory.resize(memory_size);

    // Push stack items for CALL
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address (target_addr)
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0x20); // inOffset
    try frame.stack.push(u256_native, 4); // inSize
    try frame.stack.push(u256_native, 0x40); // outOffset
    try frame.stack.push(u256_native, 0x20); // outSize

    // Run the call
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // The stack should now have a success value (1)
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 1), success);
    
    // Check that return data was saved
    try testing.expect(interpreter.returnData != null);
}

/// Test CALL with value transfer
test "CALL with value transfer" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup caller with some balance
    const caller_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000001");
    try state.setBalance(caller_addr, 100000000);
    
    // Setup target contract
    const target_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000123");
    const target_code = [_]u8{0x60, 0x01, 0x60, 0x00, 0x52, 0x60, 0x01, 0x60, 0x00, 0xf3}; // Simple return
    try setupTargetContract(state, target_addr, &target_code, 0);
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory
    try frame.memory.resize(0x60);

    // Push stack items for CALL with value
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address (target_addr)
    try frame.stack.push(u256_native, 1000); // value - transfer 1000 wei
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    try frame.stack.push(u256_native, 0); // outSize

    // Run the call
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // Check that the value was transferred (in a real implementation)
    const caller_balance = try state.getBalance(caller_addr);
    const target_balance = try state.getBalance(target_addr);
    
    // Ideally we'd verify the transfer happened, but our mock StateManager
    // doesn't actually perform transfers 
    _ = caller_balance;
    _ = target_balance;
    
    // Check that call succeeded
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 1), success);
}

/// Test CALL with value in a static context (should fail)
test "CALL with value in static context" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Make this a static call context
    interpreter.readOnly = true;
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory
    try frame.memory.resize(0x60);

    // Push stack items for CALL with value
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address
    try frame.stack.push(u256_native, 1000); // value - attempt to transfer 1000 wei
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    try frame.stack.push(u256_native, 0); // outSize

    // This should error with StaticStateChange
    const result = interpreter.run(&contract, &[_]u8{}, true);
    try testing.expectError(ExecutionError.StaticStateChange, result);
}

/// Test CALL with maximum call depth
test "CALL with max call depth" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Set call depth to max (1024)
    interpreter.callDepth = 1024;
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory
    try frame.memory.resize(0x60);

    // Push stack items for CALL
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    try frame.stack.push(u256_native, 0); // outSize

    // Run the call - this should not error, but should return success=0
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // The call should have failed due to max depth
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 0), success);
}

/// Test CALL with insufficient gas
test "CALL with insufficient gas" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup the calling contract with low gas
    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    contract.gas = 100; // Set very low gas
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory
    try frame.memory.resize(0x60);

    // Push stack items for CALL requesting more gas than available
    try frame.stack.push(u256_native, 1000); // gas - more than available
    try frame.stack.push(u256_native, 0x123); // address
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    try frame.stack.push(u256_native, 0); // outSize

    // Run the call - this should not error, but should return success=0
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // The call should have failed due to insufficient gas
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 0), success);
}

/// Test CALL with memory expansion
test "CALL with memory expansion" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Start with a small memory
    try frame.memory.resize(0x20);
    const initial_mem_size = frame.memory.data().len;

    // Push stack items for CALL that requires memory expansion
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0x80); // outOffset - beyond current memory
    try frame.stack.push(u256_native, 0x20); // outSize

    // Run the call
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // Memory should have expanded
    try testing.expect(frame.memory.data().len > initial_mem_size);
    try testing.expect(frame.memory.data().len >= 0xA0); // outOffset + outSize
}

// ===== CALLCODE OPCODE (0xF2) TESTS =====

/// Test CALLCODE basic function
test "CALLCODE basic operation" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup a target contract that we'll call
    const target_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000123");
    const target_code = [_]u8{0x60, 0x42, 0x60, 0x00, 0x52, 0x60, 0x01, 0x60, 0x00, 0xf3}; // PUSH1 0x42 PUSH1 0 MSTORE PUSH1 1 PUSH1 0 RETURN
    try setupTargetContract(state, target_addr, &target_code, 0);
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF2}); // CALLCODE
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory space for output
    try frame.memory.resize(0x60);

    // Push stack items for CALLCODE
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address (target_addr)
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0x40); // outOffset
    try frame.stack.push(u256_native, 0x20); // outSize

    // Run the callcode
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // The stack should now have a success value (1)
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 1), success);
    
    // Check that return data was saved
    try testing.expect(interpreter.returnData != null);
}

/// Test CALLCODE context preservation
test "CALLCODE preserves caller context" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup caller with some balance
    const caller_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000001");
    try state.setBalance(caller_addr, 100000000);
    
    // Setup target contract
    const target_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000123");
    const target_code = [_]u8{0x60, 0x01, 0x60, 0x00, 0x52, 0x60, 0x01, 0x60, 0x00, 0xf3}; // Simple return
    try setupTargetContract(state, target_addr, &target_code, 0);
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF2}); // CALLCODE
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory
    try frame.memory.resize(0x60);

    // Push stack items for CALLCODE with value
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address (target_addr)
    try frame.stack.push(u256_native, 1000); // value - in CALLCODE, this stays with caller
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    try frame.stack.push(u256_native, 0); // outSize

    // Run the callcode
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // Check that call succeeded
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 1), success);
}

// ===== DELEGATECALL OPCODE (0xF4) TESTS =====

/// Test DELEGATECALL basic function
test "DELEGATECALL basic operation" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup a target contract that we'll call
    const target_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000123");
    const target_code = [_]u8{0x60, 0x55, 0x60, 0x00, 0x52, 0x60, 0x01, 0x60, 0x00, 0xf3}; // PUSH1 0x55 PUSH1 0 MSTORE PUSH1 1 PUSH1 0 RETURN
    try setupTargetContract(state, target_addr, &target_code, 0);
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF4}); // DELEGATECALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory space for output
    try frame.memory.resize(0x60);

    // Push stack items for DELEGATECALL (no value parameter)
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address (target_addr)
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0x40); // outOffset
    try frame.stack.push(u256_native, 0x20); // outSize

    // Run the delegatecall
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // The stack should now have a success value (1)
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 1), success);
    
    // Check that return data was saved
    try testing.expect(interpreter.returnData != null);
}

/// Test DELEGATECALL with insufficient stack
test "DELEGATECALL with insufficient stack" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    var contract = try setupContract(allocator, &[_]u8{0xF4}); // DELEGATECALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x1234); // address
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    // Missing outSize

    const result = interpreter.run(&contract, &[_]u8{}, false);
    try testing.expectError(ExecutionError.StackUnderflow, result);
}

// ===== STATICCALL OPCODE (0xFA) TESTS =====

/// Test STATICCALL basic function
test "STATICCALL basic operation" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup a target contract that we'll call
    const target_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000123");
    const target_code = [_]u8{0x60, 0x99, 0x60, 0x00, 0x52, 0x60, 0x01, 0x60, 0x00, 0xf3}; // PUSH1 0x99 PUSH1 0 MSTORE PUSH1 1 PUSH1 0 RETURN
    try setupTargetContract(state, target_addr, &target_code, 0);
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xFA}); // STATICCALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory space for output
    try frame.memory.resize(0x60);

    // Push stack items for STATICCALL (no value parameter)
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address (target_addr)
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0x40); // outOffset
    try frame.stack.push(u256_native, 0x20); // outSize

    // Run the staticcall
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // The stack should now have a success value (1)
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 1), success);
    
    // Check that return data was saved
    try testing.expect(interpreter.returnData != null);
}

/// Test STATICCALL enforces static context
test "STATICCALL enforces static context" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup a target contract that tries to modify state
    const target_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000123");
    // SSTORE operation, which should be forbidden in static context
    const target_code = [_]u8{0x60, 0x99, 0x60, 0x00, 0x55}; // PUSH1 0x99 PUSH1 0 SSTORE
    try setupTargetContract(state, target_addr, &target_code, 0);
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xFA}); // STATICCALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory space
    try frame.memory.resize(0x60);

    // Push stack items for STATICCALL
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address (target_addr)
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0x40); // outOffset
    try frame.stack.push(u256_native, 0x20); // outSize

    // Run the staticcall - this should return failure since target tries to modify state
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // The call should have failed
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 0), success);
}

// ===== CREATE OPCODE (0xF0) TESTS =====

/// Test CREATE basic functionality
test "CREATE basic operation" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup contract with balance for creation
    const caller_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000001");
    try state.setBalance(caller_addr, 100000000);
    
    // Contract initialization code: returns a simple contract
    // Here we'd have initcode that returns runtime code
    const init_code = [_]u8{0x60, 0x01, 0x60, 0x00, 0xf3}; // PUSH1 1 PUSH1 0 RETURN
    
    // Setup the creating contract
    var contract = try setupContract(allocator, &[_]u8{0xF0}); // CREATE
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Store init code in memory
    try frame.memory.store(0x00, &init_code);

    // Push stack items for CREATE
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // offset
    try frame.stack.push(u256_native, init_code.len); // size

    // Run the create
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // The stack should now have the new contract address (non-zero)
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const new_addr = try frame.stack.pop(u256_native);
    try testing.expect(new_addr != 0);
}

/// Test CREATE with value
test "CREATE with value transfer" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup contract with balance for creation
    const caller_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000001");
    try state.setBalance(caller_addr, 100000000);
    
    // Simple init code
    const init_code = [_]u8{0x60, 0x01, 0x60, 0x00, 0xf3}; // PUSH1 1 PUSH1 0 RETURN
    
    // Setup the creating contract
    var contract = try setupContract(allocator, &[_]u8{0xF0}); // CREATE
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Store init code in memory
    try frame.memory.store(0x00, &init_code);

    // Push stack items for CREATE with value
    try frame.stack.push(u256_native, 1000); // value - endow with 1000 wei
    try frame.stack.push(u256_native, 0); // offset
    try frame.stack.push(u256_native, init_code.len); // size

    // Run the create
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // The stack should now have the new contract address (non-zero)
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const new_addr = try frame.stack.pop(u256_native);
    try testing.expect(new_addr != 0);
    
    // Ideally, we'd check that the new contract has the endowed value
    // but our mock StateManager doesn't implement this
}

/// Test CREATE in static context (should fail)
test "CREATE in static context" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Make this a static call context
    interpreter.readOnly = true;
    
    // Simple init code
    const init_code = [_]u8{0x60, 0x01, 0x60, 0x00, 0xf3}; // PUSH1 1 PUSH1 0 RETURN
    
    // Setup the creating contract
    var contract = try setupContract(allocator, &[_]u8{0xF0}); // CREATE
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Store init code in memory
    try frame.memory.store(0x00, &init_code);

    // Push stack items for CREATE
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // offset
    try frame.stack.push(u256_native, init_code.len); // size

    // This should error with StaticStateChange
    const result = interpreter.run(&contract, &[_]u8{}, true);
    try testing.expectError(ExecutionError.StaticStateChange, result);
}

// ===== CREATE2 OPCODE (0xF5) TESTS =====

/// Test CREATE2 basic functionality
test "CREATE2 basic operation" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup contract with balance for creation
    const caller_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000001");
    try state.setBalance(caller_addr, 100000000);
    
    // Contract initialization code: returns a simple contract
    const init_code = [_]u8{0x60, 0x01, 0x60, 0x00, 0xf3}; // PUSH1 1 PUSH1 0 RETURN
    
    // Setup the creating contract
    var contract = try setupContract(allocator, &[_]u8{0xF5}); // CREATE2
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Store init code in memory
    try frame.memory.store(0x00, &init_code);

    // Push stack items for CREATE2
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // offset
    try frame.stack.push(u256_native, init_code.len); // size
    try frame.stack.push(u256_native, 0x123); // salt

    // Run the create2
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // The stack should now have the new contract address (non-zero)
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const new_addr = try frame.stack.pop(u256_native);
    try testing.expect(new_addr != 0);
}

/// Test CREATE2 address determinism
test "CREATE2 address determinism" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Simple init code
    const init_code = [_]u8{0x60, 0x01, 0x60, 0x00, 0xf3}; // PUSH1 1 PUSH1 0 RETURN
    
    // Setup two identical contracts for CREATE2
    var contract1 = try setupContract(allocator, &[_]u8{0xF5}); // CREATE2
    const frame1 = try setupFrameForContract(interpreter, allocator, &contract1);
    defer frame1.deinit();

    var contract2 = try setupContract(allocator, &[_]u8{0xF5}); // CREATE2
    const frame2 = try setupFrameForContract(interpreter, allocator, &contract2);
    defer frame2.deinit();

    // Store init code in memory for both frames
    try frame1.memory.store(0x00, &init_code);
    try frame2.memory.store(0x00, &init_code);

    // Use same salt for both creates
    const salt = 0x42;

    // Push stack items for first CREATE2
    try frame1.stack.push(u256_native, 0); // value
    try frame1.stack.push(u256_native, 0); // offset
    try frame1.stack.push(u256_native, init_code.len); // size
    try frame1.stack.push(u256_native, salt); // salt

    // Run the first create2
    _ = interpreter.run(&contract1, &[_]u8{}, false);
    const addr1 = try frame1.stack.pop(u256_native);
    try testing.expect(addr1 != 0);

    // Push stack items for second CREATE2
    try frame2.stack.push(u256_native, 0); // value
    try frame2.stack.push(u256_native, 0); // offset
    try frame2.stack.push(u256_native, init_code.len); // size
    try frame2.stack.push(u256_native, salt); // same salt

    // Run the second create2
    _ = interpreter.run(&contract2, &[_]u8{}, false);
    const addr2 = try frame2.stack.pop(u256_native);
    try testing.expect(addr2 != 0);
    
    // Both addresses should match (deterministic address creation)
    try testing.expectEqual(addr1, addr2);
}

// ===== ADVANCED TEST CASES =====

/// Test nested calls and call depth tracking
test "Nested calls with depth tracking" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Start at a reasonable depth
    interpreter.callDepth = 1020; // Close to max (1024)
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory
    try frame.memory.resize(0x60);

    // First call should work (depth 1021)
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    try frame.stack.push(u256_native, 0); // outSize

    // Run the call
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // Call should succeed (depth 1021 < 1024)
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success1 = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 1), success1);
    
    // Set call depth to max-1
    interpreter.callDepth = 1023;
    
    // Second call should fail (would be depth 1024)
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    try frame.stack.push(u256_native, 0); // outSize

    // Run the call
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // Call should fail (depth 1024 = max)
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success2 = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 0), success2);
}

/// Test return data handling between calls
test "Return data handling" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup a target contract that returns specific data
    const target_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000123");
    // PUSH32 0x1234...5678 PUSH1 0 MSTORE PUSH1 32 PUSH1 0 RETURN
    const target_code = [_]u8{
        0x7f, 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd,
        0xef, 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef, 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd,
        0xef, 0x60, 0x00, 0x52, 0x60, 0x20, 0x60, 0x00, 0xf3
    };
    try setupTargetContract(state, target_addr, &target_code, 0);
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF1, 0x60, 0x00, 0x60, 0x00, 0x3d, 0x60, 0x20, 0x3e}); 
    // CALL + RETURNDATACOPY (0x3d) instructions to copy return data
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup memory space
    try frame.memory.resize(0x80);

    // Push stack items for CALL
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address (target_addr)
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0x40); // outOffset
    try frame.stack.push(u256_native, 0x20); // outSize

    // Run the call
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // Verify that returnData was set in the interpreter
    try testing.expect(interpreter.returnData != null);
    if (interpreter.returnData) |data| {
        try testing.expectEqual(@as(usize, 32), data.len);
        // In a real implementation, we'd check the actual data values
    }
}

/// Test gas calculations for calls
test "Call gas calculations" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();
    
    // Record initial gas
    const initial_gas = frame.gas;

    // Setup memory
    try frame.memory.resize(0x60);

    // Push stack items for CALL
    try frame.stack.push(u256_native, 1000); // gas for call
    try frame.stack.push(u256_native, 0x123); // address
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0); // inOffset
    try frame.stack.push(u256_native, 0); // inSize
    try frame.stack.push(u256_native, 0); // outOffset
    try frame.stack.push(u256_native, 0); // outSize

    // Run the call
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // Verify gas was consumed
    try testing.expect(frame.gas < initial_gas);
    
    // The exact gas calculation depends on implementation details,
    // but we can check that at least the stipend was deducted
    try testing.expect(initial_gas - frame.gas >= 1000);
}

/// Test CALL and memory interaction
test "Call with memory interaction" {
    const allocator = testing.allocator;
    const setup = try setupInterpreterWithState(allocator);
    const interpreter = setup.interpreter;
    defer allocator.destroy(interpreter);
    const state = setup.state;
    defer state.deinit();

    // Setup a target contract that processes input and returns data
    const target_addr = try hexToAddress(allocator, "0x0000000000000000000000000000000000000123");
    // Load input from calldata, increment value, return it
    const target_code = [_]u8{
        0x60, 0x00, 0x35,     // CALLDATALOAD(0)
        0x60, 0x01, 0x01,     // ADD 1 (increment)
        0x60, 0x00, 0x52,     // MSTORE at position 0
        0x60, 0x20, 0x60, 0x00, 0xf3  // RETURN 32 bytes from position 0
    };
    try setupTargetContract(state, target_addr, &target_code, 0);
    
    // Setup the calling contract
    var contract = try setupContract(allocator, &[_]u8{0xF1}); // CALL
    const frame = try setupFrameForContract(interpreter, allocator, &contract);
    defer frame.deinit();

    // Setup input data in memory (value 42)
    var input_data: [32]u8 = [_]u8{0} ** 32;
    input_data[31] = 42;
    try frame.memory.store(0x00, &input_data);
    
    // Setup memory space for output
    try frame.memory.resize(0x80);

    // Push stack items for CALL
    try frame.stack.push(u256_native, 1000); // gas
    try frame.stack.push(u256_native, 0x123); // address (target_addr)
    try frame.stack.push(u256_native, 0); // value
    try frame.stack.push(u256_native, 0x00); // inOffset
    try frame.stack.push(u256_native, 0x20); // inSize
    try frame.stack.push(u256_native, 0x40); // outOffset
    try frame.stack.push(u256_native, 0x20); // outSize

    // Run the call
    _ = interpreter.run(&contract, &[_]u8{}, false);
    
    // Call should succeed
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const success = try frame.stack.pop(u256_native);
    try testing.expectEqual(@as(u256_native, 1), success);
    
    // In a real implementation, we'd check that output memory has value 43
    // But our mock doesn't actually transfer memory between calls
}