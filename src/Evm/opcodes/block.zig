const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const JumpTable = @import("../JumpTable.zig");

/// BLOCKHASH operation - Get the hash of one of the 256 most recent complete blocks
pub fn opBlockhash(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // Get the block number from the stack
    const blockNumber = try frame.stack.pop();
    
    // In a real implementation, we would fetch historical block hashes based on blockNumber
    // For now, return a dummy hash value
    // EVM spec: if block number is not one of the 256 most recent blocks, return 0
    _ = blockNumber; // Use the variable to avoid unused variable error
    try frame.stack.push(0);
    
    return "";
}

/// COINBASE operation - Get the block's beneficiary address
pub fn opCoinbase(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // In a real implementation, this would return the current block's coinbase address
    // For now, return a dummy value (zero address)
    try frame.stack.push(0);
    
    return "";
}

/// TIMESTAMP operation - Get the block's timestamp
pub fn opTimestamp(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // In a real implementation, this would return the current block's timestamp
    // For now, use the current timestamp
    const now = std.time.timestamp();
    try frame.stack.push(@as(u256, @intCast(now)));
    
    return "";
}

/// NUMBER operation - Get the block's number
pub fn opNumber(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // In a real implementation, this would return the current block number
    // For now, return a dummy value
    try frame.stack.push(1);
    
    return "";
}

/// DIFFICULTY/PREVRANDAO operation - Get the block's difficulty or random value
/// Post-Merge (Paris) this opcode returns the random value from the beacon chain
pub fn opDifficulty(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if we are post-Merge
    if (interpreter.evm.chainRules.IsMerge) {
        // PREVRANDAO: Return the beacon chain random value
        // For now, return a dummy random value
        try frame.stack.push(0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef);
    } else {
        // DIFFICULTY: Return the block's difficulty
        // For now, return a standard pre-merge difficulty value
        try frame.stack.push(2500000000000000); // Example difficulty
    }
    
    return "";
}

/// GASLIMIT operation - Get the block's gas limit
pub fn opGaslimit(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // In a real implementation, this would return the current block's gas limit
    // For now, return a standard gas limit
    try frame.stack.push(30000000); // 30 million gas
    
    return "";
}

/// CHAINID operation - Get the chain ID
pub fn opChainid(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    _ = interpreter;
    
    // In a real implementation, this would return the chain ID from configuration
    // For now, return Ethereum mainnet chain ID (1)
    try frame.stack.push(1);
    
    return "";
}

/// SELFBALANCE operation - Get balance of currently executing account
pub fn opSelfbalance(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if we have a state manager in the EVM
    if (interpreter.evm.state_manager == null) {
        // If no state manager, return 0 balance
        try frame.stack.push(0);
        return "";
    }
    
    // Get the current contract's address
    const address = frame.address();
    
    // Get the account from state
    if (try interpreter.evm.state_manager.?.getAccount(address)) |account| {
        // Push account balance to stack
        try frame.stack.push(account.balance.value);
    } else {
        // Account doesn't exist, push 0
        try frame.stack.push(0);
    }
    
    return "";
}

/// BASEFEE operation - Get the block's base fee (EIP-1559)
pub fn opBasefee(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if EIP-1559 is active
    if (!interpreter.evm.chainRules.IsEIP1559) {
        return ExecutionError.InvalidOpcode;
    }
    
    // In a real implementation, this would return the current block's base fee
    // For now, return a standard base fee value
    try frame.stack.push(1000000000); // 1 gwei
    
    return "";
}

/// Register all block-related opcodes in the given jump table
pub fn registerBlockOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // BLOCKHASH (0x40)
    const blockhash_op = try allocator.create(JumpTable.Operation);
    blockhash_op.* = JumpTable.Operation{
        .execute = opBlockhash,
        .constant_gas = JumpTable.GasMidStep,
        .min_stack = JumpTable.minStack(1, 1),
        .max_stack = JumpTable.maxStack(1, 1),
    };
    jump_table.table[0x40] = blockhash_op;
    
    // COINBASE (0x41)
    const coinbase_op = try allocator.create(JumpTable.Operation);
    coinbase_op.* = JumpTable.Operation{
        .execute = opCoinbase,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x41] = coinbase_op;
    
    // TIMESTAMP (0x42)
    const timestamp_op = try allocator.create(JumpTable.Operation);
    timestamp_op.* = JumpTable.Operation{
        .execute = opTimestamp,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x42] = timestamp_op;
    
    // NUMBER (0x43)
    const number_op = try allocator.create(JumpTable.Operation);
    number_op.* = JumpTable.Operation{
        .execute = opNumber,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x43] = number_op;
    
    // DIFFICULTY/PREVRANDAO (0x44)
    const difficulty_op = try allocator.create(JumpTable.Operation);
    difficulty_op.* = JumpTable.Operation{
        .execute = opDifficulty,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x44] = difficulty_op;
    
    // GASLIMIT (0x45)
    const gaslimit_op = try allocator.create(JumpTable.Operation);
    gaslimit_op.* = JumpTable.Operation{
        .execute = opGaslimit,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x45] = gaslimit_op;
    
    // CHAINID (0x46)
    const chainid_op = try allocator.create(JumpTable.Operation);
    chainid_op.* = JumpTable.Operation{
        .execute = opChainid,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x46] = chainid_op;
    
    // SELFBALANCE (0x47)
    const selfbalance_op = try allocator.create(JumpTable.Operation);
    selfbalance_op.* = JumpTable.Operation{
        .execute = opSelfbalance,
        .constant_gas = JumpTable.GasFastStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x47] = selfbalance_op;
    
    // BASEFEE (0x48)
    const basefee_op = try allocator.create(JumpTable.Operation);
    basefee_op.* = JumpTable.Operation{
        .execute = opBasefee,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x48] = basefee_op;
}

// Simple test for block opcodes
test "block opcodes - basic functionality" {
    const testing = std.testing;
    const allocator = std.testing.allocator;
    
    // Create a test jump table
    var jt = JumpTable.JumpTable.init();
    
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