const std = @import("std");
const evm = @import("evm");
const Address = @import("Address");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){}; 
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Initialize memory database and VM
    var memory_db = evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();

    var vm = evm.Vm.init(allocator, db_interface, null, null) catch unreachable;
    defer vm.deinit();

    const creator_address = [_]u8{0x10} ++ [_]u8{0x00} ** 19;
    const contract_address = [_]u8{0x20} ++ [_]u8{0x00} ** 19;
    
    std.log.info("=== JUMPI INVALID JUMP DEBUG TEST ===", .{});
    
    // Test case 1: Valid jump to JUMPDEST
    {
        std.log.info("Test 1: Valid JUMPI to JUMPDEST", .{});
        // PUSH1 0x05 (target), PUSH1 0x01 (condition), JUMPI, STOP, JUMPDEST, STOP
        const valid_bytecode = [_]u8{
            0x60, 0x05,  // PUSH1 5 (jump target)
            0x60, 0x01,  // PUSH1 1 (condition true)
            0x57,        // JUMPI
            0x00,        // STOP (should not execute)
            0x5B,        // JUMPDEST (at position 5)
            0x00,        // STOP
        };

        var valid_contract = evm.Contract.init(
            creator_address,
            contract_address,
            0,
            1000000,
            &valid_bytecode,
            [_]u8{0} ** 32,
            &[_]u8{},
            false,
        );
        defer valid_contract.deinit(allocator, null);

        const valid_result = vm.interpret(&valid_contract, &[_]u8{}) catch |err| {
            std.log.err("Valid JUMPI failed: {}", .{err});
            return;
        };
        
        std.log.info("Valid JUMPI result: status={}, gas_left={}", .{ valid_result.status, valid_result.gas_left });
    }
    
    // Test case 2: Invalid jump to non-JUMPDEST
    {
        std.log.info("Test 2: Invalid JUMPI to non-JUMPDEST", .{});
        // PUSH1 0x05 (target), PUSH1 0x01 (condition), JUMPI, STOP, STOP (no JUMPDEST), STOP
        const invalid_bytecode = [_]u8{
            0x60, 0x05,  // PUSH1 5 (jump target - invalid)
            0x60, 0x01,  // PUSH1 1 (condition true)
            0x57,        // JUMPI
            0x00,        // STOP (should not execute)
            0x00,        // STOP (at position 5 - invalid jump target)
            0x00,        // STOP
        };

        var invalid_contract = evm.Contract.init(
            creator_address,
            contract_address,
            0,
            1000000,
            &invalid_bytecode,
            [_]u8{0} ** 32,
            &[_]u8{},
            false,
        );
        defer invalid_contract.deinit(allocator, null);

        const invalid_result = vm.interpret(&invalid_contract, &[_]u8{}) catch |err| {
            std.log.info("Invalid JUMPI correctly failed with error: {}", .{err});
            return;
        };
        
        std.log.err("Invalid JUMPI should have failed but succeeded: status={}, gas_left={}", .{ invalid_result.status, invalid_result.gas_left });
    }
    
    // Test case 3: JUMPI with false condition (should not jump)
    {
        std.log.info("Test 3: JUMPI with false condition", .{});
        // PUSH1 0x05 (target), PUSH1 0x00 (condition false), JUMPI, STOP
        const false_condition_bytecode = [_]u8{
            0x60, 0x05,  // PUSH1 5 (jump target)
            0x60, 0x00,  // PUSH1 0 (condition false)
            0x57,        // JUMPI
            0x00,        // STOP (should execute)
        };

        var false_contract = evm.Contract.init(
            creator_address,
            contract_address,
            0,
            1000000,
            &false_condition_bytecode,
            [_]u8{0} ** 32,
            &[_]u8{},
            false,
        );
        defer false_contract.deinit(allocator, null);

        const false_result = vm.interpret(&false_contract, &[_]u8{}) catch |err| {
            std.log.err("False condition JUMPI failed: {}", .{err});
            return;
        };
        
        std.log.info("False condition JUMPI result: status={}, gas_left={}", .{ false_result.status, false_result.gas_left });
    }
    
    // Test case 4: Jump out of bounds
    {
        std.log.info("Test 4: JUMPI out of bounds", .{});
        // PUSH1 0xFF (target out of bounds), PUSH1 0x01 (condition), JUMPI, STOP
        const oob_bytecode = [_]u8{
            0x60, 0xFF,  // PUSH1 255 (jump target out of bounds)
            0x60, 0x01,  // PUSH1 1 (condition true)
            0x57,        // JUMPI
            0x00,        // STOP
        };

        var oob_contract = evm.Contract.init(
            creator_address,
            contract_address,
            0,
            1000000,
            &oob_bytecode,
            [_]u8{0} ** 32,
            &[_]u8{},
            false,
        );
        defer oob_contract.deinit(allocator, null);

        const oob_result = vm.interpret(&oob_contract, &[_]u8{}) catch |err| {
            std.log.info("Out of bounds JUMPI correctly failed with error: {}", .{err});
            return;
        };
        
        std.log.err("Out of bounds JUMPI should have failed but succeeded: status={}, gas_left={}", .{ oob_result.status, oob_result.gas_left });
    }
}