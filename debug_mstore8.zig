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

    // Create a test contract
    const creator_address = [_]u8{0x10} ++ [_]u8{0x00} ** 19;
    const contract_address = [_]u8{0x20} ++ [_]u8{0x00} ** 19;
    
    // Simple test bytecode for MSTORE8: PUSH1 0xFF, PUSH1 0x00, MSTORE8, STOP
    const test_bytecode = [_]u8{
        0x60, 0xFF, // PUSH1 0xFF (value)
        0x60, 0x00, // PUSH1 0x00 (offset)
        0x53,       // MSTORE8
        0x00,       // STOP
    };

    std.log.info("=== MSTORE8 DEBUG TEST ===", .{});
    std.log.info("Test bytecode: {any}", .{test_bytecode});

    var test_contract = evm.Contract.init(
        creator_address,
        contract_address,
        0,
        1000000,
        &test_bytecode,
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    defer test_contract.deinit(allocator, null);

    const result = vm.interpret(&test_contract, &[_]u8{}) catch |err| {
        std.log.err("Execution failed: {}", .{err});
        return;
    };

    std.log.info("Execution result: status={}, gas_left={}", .{ result.status, result.gas_left });

    // Try to check what happened - we can't easily access the frame memory from here
    // but we can see if the execution succeeded
    std.log.info("Test completed successfully", .{});
}