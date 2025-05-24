const std = @import("std");
// Import from parent directory using relative paths
const jumpTableModule = @import("../jumpTable/package.zig");
const JumpTable = jumpTableModule.JumpTable;
const Operation = jumpTableModule.Operation;
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../interpreter.zig").InterpreterError;
const stackModule = @import("../Stack.zig");
const Stack = stackModule.Stack;
const StackError = stackModule.StackError;
const Memory = @import("../Memory.zig").Memory;
const StateManager = @import("StateManager").StateManager;
const B160 = @import("StateManager").B160;

// Helper to convert Stack errors to ExecutionError
fn mapStackError(err: StackError) ExecutionError {
    return switch (err) {
        error.OutOfBounds => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        error.OutOfMemory => ExecutionError.OutOfGas,
    };
}

// BLOCKHASH operation - Get the hash of one of the 256 most recent complete blocks
pub fn opBlockhash(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // Get the block number from the stack
    const blockNumber = frame.stack.pop() catch |err| return mapStackError(err);
    
    // In a real implementation, we would fetch historical block hashes based on blockNumber
    // For now, return a dummy hash value
    // EVM spec: if block number is not one of the 256 most recent blocks, return 0
    _ = blockNumber; // Use the variable to avoid unused variable error
    frame.stack.push(0) catch |err| return mapStackError(err);
    
    return "";
}

// COINBASE operation - Get the block's beneficiary address
// Note: EIP-3651 makes COINBASE always warm for EIP-2929 gas metering
pub fn opCoinbase(pc: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // In a real implementation, we would set the actual COINBASE address
    // For now, use a dummy coinbase address (zero address)
    const coinbase_address_value: u256 = 0;
    
    // The COINBASE address is already marked as warm at the start of execution
    // per EIP-3651, so we don't need to mark it warm here. This is handled during
    // transaction setup.
    
    // Push the coinbase address to the stack
    frame.stack.push(coinbase_address_value) catch |err| return mapStackError(err);
    
    return "";
}

// TIMESTAMP operation - Get the block's timestamp
pub fn opTimestamp(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // In a real implementation, this would return the current block's timestamp
    // For now, use the current timestamp
    const now = std.time.timestamp();
    frame.stack.push(@as(u256, @intCast(now))) catch |err| return mapStackError(err);
    
    return "";
}

// NUMBER operation - Get the block's number
pub fn opNumber(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // In a real implementation, this would return the current block number
    // For now, return a dummy value
    frame.stack.push(1) catch |err| return mapStackError(err);
    
    return "";
}

// DIFFICULTY/PREVRANDAO operation - Get the block's difficulty or random value
// Post-Merge (Paris) this opcode returns the random value from the beacon chain
pub fn opDifficulty(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if we are post-Merge
    if (interpreter.evm.chainRules.IsMerge) {
        // PREVRANDAO: Return the beacon chain random value
        // For now, return a dummy random value
        frame.stack.push(0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef) catch |err| return mapStackError(err);
    } else {
        // DIFFICULTY: Return the block's difficulty
        // For now, return a standard pre-merge difficulty value
        frame.stack.push(2500000000000000) catch |err| return mapStackError(err); // Example difficulty
    }
    
    return "";
}

// GASLIMIT operation - Get the block's gas limit
pub fn opGaslimit(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // In a real implementation, this would return the current block's gas limit
    // For now, return a standard gas limit
    frame.stack.push(30000000) catch |err| return mapStackError(err); // 30 million gas
    
    return "";
}

// CHAINID operation - Get the chain ID
pub fn opChainid(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // In a real implementation, this would return the chain ID from configuration
    // For now, return Ethereum mainnet chain ID (1)
    frame.stack.push(1) catch |err| return mapStackError(err);
    
    return "";
}

// SELFBALANCE operation - Get balance of currently executing account
pub fn opSelfbalance(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if we have a state manager in the EVM
    if (interpreter.evm.state_manager == null) {
        // If no state manager, return 0 balance
        frame.stack.push(0) catch |err| return mapStackError(err);
        return "";
    }
    
    // Get the current contract's address
    const address = frame.address();
    
    // Get the account from state
    const b160_address = B160{ .bytes = address };
    if (try interpreter.evm.state_manager.?.getAccount(b160_address)) |account| {
        // Push account balance to stack
        frame.stack.push(account.balance.value) catch |err| return mapStackError(err);
    } else {
        // Account doesn't exist, push 0
        frame.stack.push(0) catch |err| return mapStackError(err);
    }
    
    return "";
}

// BASEFEE operation - Get the block's base fee (EIP-3198)
pub fn opBasefee(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-3198 is active (BASEFEE opcode added in London)
    if (!interpreter.evm.chainRules.IsEIP3198) {
        return ExecutionError.InvalidOpcode;
    }
    
    // In a real implementation, this would return the current block's base fee
    // from block header, which was introduced with EIP-1559 fee market
    // For now, return a standard base fee value
    frame.stack.push(1000000000) catch |err| return mapStackError(err); // 1 gwei
    
    return "";
}

// Register all block-related opcodes in the given jump table
pub fn registerBlockOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // BLOCKHASH (0x40)
    const blockhash_op = try allocator.create(Operation);
    blockhash_op.* = Operation{
        .execute = opBlockhash,
        .constant_gas = jumpTableModule.GasMidStep,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
    };
    jump_table.table[0x40] = blockhash_op;
    
    // COINBASE (0x41)
    const coinbase_op = try allocator.create(Operation);
    coinbase_op.* = Operation{
        .execute = opCoinbase,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x41] = coinbase_op;
    
    // TIMESTAMP (0x42)
    const timestamp_op = try allocator.create(Operation);
    timestamp_op.* = Operation{
        .execute = opTimestamp,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x42] = timestamp_op;
    
    // NUMBER (0x43)
    const number_op = try allocator.create(Operation);
    number_op.* = Operation{
        .execute = opNumber,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x43] = number_op;
    
    // DIFFICULTY/PREVRANDAO (0x44)
    const difficulty_op = try allocator.create(Operation);
    difficulty_op.* = Operation{
        .execute = opDifficulty,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x44] = difficulty_op;
    
    // GASLIMIT (0x45)
    const gaslimit_op = try allocator.create(Operation);
    gaslimit_op.* = Operation{
        .execute = opGaslimit,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x45] = gaslimit_op;
    
    // CHAINID (0x46)
    const chainid_op = try allocator.create(Operation);
    chainid_op.* = Operation{
        .execute = opChainid,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x46] = chainid_op;
    
    // SELFBALANCE (0x47)
    const selfbalance_op = try allocator.create(Operation);
    selfbalance_op.* = Operation{
        .execute = opSelfbalance,
        .constant_gas = jumpTableModule.GasFastStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x47] = selfbalance_op;
    
    // BASEFEE (0x48)
    const basefee_op = try allocator.create(Operation);
    basefee_op.* = Operation{
        .execute = opBasefee,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x48] = basefee_op;
}

// Simple test for block opcodes
test "block opcodes - basic functionality" {
    const testing = std.testing;
    const allocator = std.testing.allocator;
    
    // Create a test jump table
    var jt = *JumpTable.init();
    
    // Register block opcodes
    try registerBlockOpcodes(allocator, &jt);
    
    // Verify opcode entries
    try testing.expect(jt.table[0x40] != null); // BLOCKHASH
    try testing.expect(jt.table[0x41] != null); // COINBASE
    try testing.expect(jt.table[0x42] != null); // TIMESTAMP
    try testing.expect(jt.table[0x43] != null); // NUMBER
    try testing.expect(jt.table[0x44] != null); // DIFFICULTY/PREVRANDAO
    try testing.expect(jt.table[0x45] != null); // GASLIMIT
    try testing.expect(jt.table[0x46] != null); // CHAINID
    try testing.expect(jt.table[0x47] != null); // SELFBALANCE
    try testing.expect(jt.table[0x48] != null); // BASEFEE
    
    // Clean up allocated operations
    inline for (0x40..0x49) |i| {
        if (jt.table[i]) |op| {
            allocator.destroy(op);
        }
    }
}

test "BLOCKHASH opcode functionality" {
    const allocator = std.testing.allocator;
    
    // Create a mock EVM
    var evm_instance = Interpreter.Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP2929 = false,
            .IsEIP4844 = false,
            .IsEIP5656 = false,
        },
        .state_manager = null,
        .gas_used = 0,
        .remaining_gas = 1000000,
        .refund = 0,
        .context = null,
    };
    
    // Create interpreter
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
        .evm = &evm_instance,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    // Create frame
    var frame = Frame{
        .stack = Stack{},
        .memory = Memory.init(allocator, null) catch unreachable,
        .gas = 1000000,
        .contract = null,
        .returndata = &[_]u8{},
    };
    // Stack no longer needs deinit
    defer frame.memory.deinit();
    
    // Test block hash lookup
    frame.stack.push(123) catch |err| return mapStackError(err);
    _ = try opBlockhash(0, &interpreter, &frame);
    
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    // In our simplified implementation, this returns 0
    try std.testing.expectEqual(@as(u256, 0), frame.stack.data[0]);
}

test "Block information opcodes functionality" {
    const allocator = std.testing.allocator;
    
    // Create a mock EVM with context
    var evm_instance = Interpreter.Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP2929 = false,
            .IsEIP4844 = false,
            .IsEIP5656 = false,
        },
        .state_manager = null,
        .gas_used = 0,
        .remaining_gas = 1000000,
        .refund = 0,
        .context = null,
    };
    
    // Create a mock context with block information
    const coinbase_addr = [_]u8{0xAA} ** 20;
    var context = struct {
        coinbase: [20]u8,
        timestamp: u64,
        block_number: u64,
        difficulty: u256,
        prevrandao: u256,
        gas_limit: u64,
        chain_id: u256,
        base_fee: u256,
    }{
        .coinbase = coinbase_addr,
        .timestamp = 1234567890,
        .block_number = 12345,
        .difficulty = 2500000000000000,
        .prevrandao = 0x0123456789abcdef,
        .gas_limit = 30000000,
        .chain_id = 1,
        .base_fee = 1000000000,
    };
    evm_instance.context = &context;
    
    // Create interpreter
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
        .evm = &evm_instance,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    // Create frame with a contract
    var contract_address = [_]u8{0} ** 20;
    contract_address[19] = 1;
    
    var contract = struct {
        address: [20]u8,
    }{
        .address = contract_address,
    };
    
    var frame = Frame{
        .stack = Stack{},
        .memory = Memory.init(allocator, null) catch unreachable,
        .gas = 1000000,
        .contract = &contract,
        .returndata = &[_]u8{},
    };
    // Stack no longer needs deinit
    defer frame.memory.deinit();
    
    // Test COINBASE
    _ = try opCoinbase(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    const coinbase_result = frame.stack.data[0] & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try std.testing.expectEqual(@as(u256, 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA), coinbase_result);
    _ = try frame.stack.pop();
    
    // Test TIMESTAMP
    _ = try opTimestamp(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 1234567890), frame.stack.data[0]);
    _ = try frame.stack.pop();
    
    // Test NUMBER
    _ = try opNumber(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 12345), frame.stack.data[0]);
    _ = try frame.stack.pop();
    
    // Test DIFFICULTY (pre-merge)
    evm_instance.chainRules.IsMerge = false;
    _ = try opDifficulty(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 2500000000000000), frame.stack.data[0]);
    _ = try frame.stack.pop();
    
    // Test PREVRANDAO (post-merge)
    evm_instance.chainRules.IsMerge = true;
    _ = try opDifficulty(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 0x0123456789abcdef), frame.stack.data[0]);
    _ = try frame.stack.pop();
    
    // Test GASLIMIT
    _ = try opGaslimit(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 30000000), frame.stack.data[0]);
    _ = try frame.stack.pop();
    
    // Test CHAINID
    _ = try opChainid(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 1), frame.stack.data[0]);
    _ = try frame.stack.pop();
    
    // Test SELFBALANCE (returns 0 without state manager)
    _ = try opSelfbalance(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 0), frame.stack.data[0]);
    _ = try frame.stack.pop();
    
    // Test BASEFEE
    evm_instance.chainRules.IsEIP3198 = true;
    _ = try opBasefee(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 1000000000), frame.stack.data[0]);
}

test "Block opcodes error conditions" {
    const allocator = std.testing.allocator;
    
    // Create a mock EVM
    var evm_instance = Interpreter.Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP2929 = false,
            .IsEIP4844 = false,
            .IsEIP5656 = false,
            .IsMerge = false,
            .IsEIP3198 = false,
        },
        .state_manager = null,
        .gas_used = 0,
        .remaining_gas = 1000000,
        .refund = 0,
        .context = null,
    };
    
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
        .evm = &evm_instance,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    var frame = Frame{
        .stack = Stack{},
        .memory = Memory.init(allocator, null) catch unreachable,
        .gas = 1000000,
        .contract = null,
        .returndata = &[_]u8{},
    };
    defer frame.memory.deinit();
    
    // Test BLOCKHASH with empty stack
    const result1 = opBlockhash(0, &interpreter, &frame);
    try std.testing.expectError(ExecutionError.StackUnderflow, result1);
    
    // Test BASEFEE with EIP-3198 disabled
    evm_instance.chainRules.IsEIP3198 = false;
    const result2 = opBasefee(0, &interpreter, &frame);
    try std.testing.expectError(ExecutionError.InvalidOpcode, result2);
}

test "SELFBALANCE with state manager" {
    const allocator = std.testing.allocator;
    
    // Mock state manager that returns a balance
    const MockStateManager = struct {
        pub fn getAccount(self: *@This(), address: [20]u8) ?struct { balance: u256 } {
            _ = self;
            _ = address;
            return .{ .balance = 12345678900000000000 }; // 12.34 ETH in wei
        }
    };
    
    var state_manager = MockStateManager{};
    
    var evm_instance = Interpreter.Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP2929 = false,
            .IsEIP4844 = false,
            .IsEIP5656 = false,
            .IsMerge = false,
            .IsEIP3198 = false,
        },
        .state_manager = &state_manager,
        .gas_used = 0,
        .remaining_gas = 1000000,
        .refund = 0,
        .context = null,
    };
    
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
        .evm = &evm_instance,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    var contract_address = [_]u8{0} ** 20;
    contract_address[19] = 1;
    
    var contract = struct {
        address: [20]u8,
    }{
        .address = contract_address,
    };
    
    var frame = Frame{
        .stack = Stack{},
        .memory = Memory.init(allocator, null) catch unreachable,
        .gas = 1000000,
        .contract = &contract,
        .returndata = &[_]u8{},
    };
    defer frame.memory.deinit();
    
    // Test SELFBALANCE with state manager
    _ = try opSelfbalance(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 12345678900000000000), frame.stack.data[0]);
}

test "Block opcodes with real context values" {
    const allocator = std.testing.allocator;
    
    var evm_instance = Interpreter.Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP2929 = false,
            .IsEIP4844 = false,
            .IsEIP5656 = false,
            .IsMerge = true,
            .IsEIP3198 = true,
        },
        .state_manager = null,
        .gas_used = 0,
        .remaining_gas = 1000000,
        .refund = 0,
        .context = null,
    };
    
    // Test with more realistic context values
    const coinbase_addr = [_]u8{
        0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF,
        0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF,
        0x01, 0x23, 0x45, 0x67,
    };
    
    var context = struct {
        coinbase: [20]u8,
        timestamp: u64,
        block_number: u64,
        difficulty: u256,
        prevrandao: u256,
        gas_limit: u64,
        chain_id: u256,
        base_fee: u256,
    }{
        .coinbase = coinbase_addr,
        .timestamp = 1704067200, // 2024-01-01 00:00:00 UTC
        .block_number = 19000000,
        .difficulty = 0,
        .prevrandao = 0xdeadbeefcafebabe1234567890abcdef1234567890abcdef1234567890abcdef,
        .gas_limit = 30000000,
        .chain_id = 1, // Ethereum mainnet
        .base_fee = 25000000000, // 25 gwei
    };
    evm_instance.context = &context;
    
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
        .evm = &evm_instance,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    var frame = Frame{
        .stack = Stack{},
        .memory = Memory.init(allocator, null) catch unreachable,
        .gas = 1000000,
        .contract = null,
        .returndata = &[_]u8{},
    };
    defer frame.memory.deinit();
    
    // Test TIMESTAMP with realistic value
    _ = try opTimestamp(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 1704067200), frame.stack.data[0]);
    _ = try frame.stack.pop();
    
    // Test NUMBER with realistic block number
    _ = try opNumber(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 19000000), frame.stack.data[0]);
    _ = try frame.stack.pop();
    
    // Test PREVRANDAO (post-merge)
    _ = try opDifficulty(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(
        @as(u256, 0xdeadbeefcafebabe1234567890abcdef1234567890abcdef1234567890abcdef),
        frame.stack.data[0]
    );
    _ = try frame.stack.pop();
    
    // Test BASEFEE with realistic value
    _ = try opBasefee(0, &interpreter, &frame);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    try std.testing.expectEqual(@as(u256, 25000000000), frame.stack.data[0]);
}

test "registerBlockOpcodes comprehensive" {
    const allocator = std.testing.allocator;
    
    // Create a jump table
    var jump_table = JumpTable{
        .table = undefined,
    };
    
    // Initialize all table entries to null
    for (&jump_table.table) |*entry| {
        entry.* = null;
    }
    
    // Register block opcodes
    try registerBlockOpcodes(allocator, &jump_table);
    
    // Verify all block opcodes were registered correctly
    const block_opcodes = [_]struct { opcode: u8, name: []const u8 }{
        .{ .opcode = 0x40, .name = "BLOCKHASH" },
        .{ .opcode = 0x41, .name = "COINBASE" },
        .{ .opcode = 0x42, .name = "TIMESTAMP" },
        .{ .opcode = 0x43, .name = "NUMBER" },
        .{ .opcode = 0x44, .name = "DIFFICULTY" },
        .{ .opcode = 0x45, .name = "GASLIMIT" },
        .{ .opcode = 0x46, .name = "CHAINID" },
        .{ .opcode = 0x47, .name = "SELFBALANCE" },
        .{ .opcode = 0x48, .name = "BASEFEE" },
    };
    
    for (block_opcodes) |op_info| {
        try std.testing.expect(jump_table.table[op_info.opcode] != null);
        
        // Verify gas costs are set
        const operation = jump_table.table[op_info.opcode].?;
        try std.testing.expect(operation.constant_gas > 0);
    }
    
    // Clean up
    for (block_opcodes) |op_info| {
        if (jump_table.table[op_info.opcode]) |op| {
            allocator.destroy(op);
        }
    }
}