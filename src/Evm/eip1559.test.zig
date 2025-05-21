const std = @import("std");
const evm = @import("evm");
const FeeMarket = evm.FeeMarket;
const ChainRules = evm.ChainRules;
const Hardfork = evm.Hardfork;
const block = @import("opcodes/block.zig"); // Keeping this direct import for opcodes
const Interpreter = evm.Interpreter;
const Frame = evm.Frame;
const Contract = evm.Contract;
const Stack = evm.Stack;
const Memory = evm.Memory;
const JumpTable = evm.JumpTable;
const Evm = evm.Evm;
const address = @import("address");
const Address = address.Address;

test "EIP-1559 - BASEFEE opcode behavior" {
    // Test to verify that the BASEFEE opcode correctly works with EIP-1559
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
    
    // Create a jump table with the BASEFEE opcode
    var jump_table = JumpTable.JumpTable.init();
    try block.registerBlockOpcodes(allocator, &jump_table);
    defer {
        inline for (0x40..0x49) |i| {
            if (jump_table.table[i]) |op| {
                allocator.destroy(op);
            }
        }
    }
    
    // Test with EIP-1559 (London) enabled
    {
        // Create EVM with London rules (EIP-1559 enabled)
        var evm = try Evm.init(null);
        evm.chainRules = ChainRules.forHardfork(.London);
        
        // Create interpreter
        var interpreter = Interpreter.create(allocator, &evm, jump_table);
        
        // Create execution frame
        var frame = try Frame.init(allocator, &contract);
        defer frame.deinit();
        
        // Execute BASEFEE opcode
        _ = try block.opBasefee(0, &interpreter, &frame);
        
        // Verify result on stack
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
        try testing.expectEqual(@as(u256, 1000000000), frame.stack.data[0]); // Should be 1 gwei
    }
    
    // Test with EIP-1559 (London) disabled
    {
        // Create EVM with Berlin rules (before EIP-1559)
        var evm = try Evm.init(null);
        evm.chainRules = ChainRules.forHardfork(.Berlin);
        
        // Create interpreter
        var interpreter = Interpreter.create(allocator, &evm, jump_table);
        
        // Create execution frame
        var frame = try Frame.init(allocator, &contract);
        defer frame.deinit();
        
        // Execute BASEFEE opcode - should fail with InvalidOpcode
        const result = block.opBasefee(0, &interpreter, &frame);
        try testing.expectError(error.InvalidOpcode, result);
    }
}

test "EIP-1559 - Base fee adjustment algorithm" {
    // Test the EIP-1559 base fee adjustment algorithm
    const testing = std.testing;
    
    // Test case 1: Empty block - base fee should not change
    {
        const parent_base_fee = 1_000_000_000; // 1 gwei
        const parent_gas_used = 0;
        const parent_gas_target = 15_000_000;
        
        const next_base_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        try testing.expectEqual(parent_base_fee, next_base_fee);
    }
    
    // Test case 2: Target block - base fee should not change
    {
        const parent_base_fee = 1_000_000_000; // 1 gwei
        const parent_gas_target = 15_000_000;
        const parent_gas_used = parent_gas_target;
        
        const next_base_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        try testing.expectEqual(parent_base_fee, next_base_fee);
    }
    
    // Test case 3: Full block - base fee should increase by 12.5%
    {
        const parent_base_fee = 1_000_000_000; // 1 gwei
        const parent_gas_target = 15_000_000;
        const parent_gas_used = parent_gas_target * 2; // 100% over target
        
        const next_base_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        // Base fee should increase by 12.5%
        const expected = parent_base_fee + (parent_base_fee / 8);
        
        // Allow a small margin of error due to integer division
        try testing.expect(next_base_fee >= expected - 10);
        try testing.expect(next_base_fee <= expected + 10);
    }
    
    // Test case 4: Half-full block - base fee should decrease by 6.25%
    {
        const parent_base_fee = 1_000_000_000; // 1 gwei
        const parent_gas_target = 15_000_000;
        const parent_gas_used = parent_gas_target / 2; // 50% under target
        
        const next_base_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        // Base fee should decrease by about 6.25%
        const expected = parent_base_fee - (parent_base_fee / 16);
        
        // Allow a small margin of error due to integer division
        try testing.expect(next_base_fee >= expected - 10);
        try testing.expect(next_base_fee <= expected + 10);
    }
    
    // Test case 5: Minimum base fee
    {
        const parent_base_fee = FeeMarket.MIN_BASE_FEE;
        const parent_gas_target = 15_000_000;
        const parent_gas_used = 0; // Empty block, would normally decrease
        
        const next_base_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        // Base fee should not go below minimum
        try testing.expectEqual(FeeMarket.MIN_BASE_FEE, next_base_fee);
    }
}

test "EIP-1559 - Effective gas price calculation" {
    // Test the effective gas price calculation for EIP-1559 transactions
    const testing = std.testing;
    
    // Test case 1: Standard case
    {
        const base_fee = 1_000_000_000; // 1 gwei
        const max_fee = 3_000_000_000; // 3 gwei
        const max_priority_fee = 1_000_000_000; // 1 gwei
        
        const result = FeeMarket.getEffectiveGasPrice(base_fee, max_fee, max_priority_fee);
        
        // Effective gas price should be base fee + priority fee = 2 gwei
        try testing.expectEqual(@as(u64, 2_000_000_000), result.effective_gas_price);
        
        // Miner fee should be the priority fee = 1 gwei
        try testing.expectEqual(@as(u64, 1_000_000_000), result.miner_fee);
    }
    
    // Test case 2: Max fee limits priority fee
    {
        const base_fee = 1_000_000_000; // 1 gwei
        const max_fee = 1_500_000_000; // 1.5 gwei
        const max_priority_fee = 1_000_000_000; // 1 gwei
        
        const result = FeeMarket.getEffectiveGasPrice(base_fee, max_fee, max_priority_fee);
        
        // Effective gas price should be limited to max fee = 1.5 gwei
        try testing.expectEqual(@as(u64, 1_500_000_000), result.effective_gas_price);
        
        // Miner fee should be what's left after base fee = 0.5 gwei
        try testing.expectEqual(@as(u64, 500_000_000), result.miner_fee);
    }
    
    // Test case 3: Zero priority fee
    {
        const base_fee = 1_000_000_000; // 1 gwei
        const max_fee = 2_000_000_000; // 2 gwei
        const max_priority_fee = 0; // 0 gwei
        
        const result = FeeMarket.getEffectiveGasPrice(base_fee, max_fee, max_priority_fee);
        
        // Effective gas price should be just the base fee = 1 gwei
        try testing.expectEqual(@as(u64, 1_000_000_000), result.effective_gas_price);
        
        // Miner fee should be zero
        try testing.expectEqual(@as(u64, 0), result.miner_fee);
    }
}

test "EIP-1559 - Gas target calculation" {
    // Test the gas target calculation for EIP-1559
    const testing = std.testing;
    
    // Test standard block gas limit
    {
        const gas_limit = 30_000_000;
        const gas_target = FeeMarket.getGasTarget(gas_limit);
        
        // Gas target should be half the gas limit
        try testing.expectEqual(@as(u64, 15_000_000), gas_target);
    }
    
    // Test non-standard block gas limit
    {
        const gas_limit = 12_345_678;
        const gas_target = FeeMarket.getGasTarget(gas_limit);
        
        // Gas target should be half the gas limit
        try testing.expectEqual(@as(u64, 6_172_839), gas_target);
    }
}