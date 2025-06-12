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
    
    // Test bytecode: Store "Hello" in memory, then RETURN it
    // PUSH1 0x48 (H), PUSH1 0x00, MSTORE8  
    // PUSH1 0x65 (e), PUSH1 0x01, MSTORE8
    // PUSH1 0x6C (l), PUSH1 0x02, MSTORE8
    // PUSH1 0x6C (l), PUSH1 0x03, MSTORE8  
    // PUSH1 0x6F (o), PUSH1 0x04, MSTORE8
    // PUSH1 0x05 (length), PUSH1 0x00 (offset), RETURN
    const test_bytecode = [_]u8{
        0x60, 0x48, 0x60, 0x00, 0x53, // Store 'H' at offset 0
        0x60, 0x65, 0x60, 0x01, 0x53, // Store 'e' at offset 1  
        0x60, 0x6C, 0x60, 0x02, 0x53, // Store 'l' at offset 2
        0x60, 0x6C, 0x60, 0x03, 0x53, // Store 'l' at offset 3
        0x60, 0x6F, 0x60, 0x04, 0x53, // Store 'o' at offset 4
        0x60, 0x05,                   // PUSH1 5 (size)  
        0x60, 0x00,                   // PUSH1 0 (offset)
        0xF3,                         // RETURN
    };

    std.log.info("=== RETURN DATA DEBUG TEST ===", .{});
    std.log.info("Test bytecode length: {} bytes", .{test_bytecode.len});

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
    
    if (result.output) |output| {
        std.log.info("Result output: {} bytes: {any}", .{ output.len, output });
        std.log.info("Result output as string: {s}", .{output});
    } else {
        std.log.info("Result output: null", .{});
    }

    std.log.info("VM return_data: {} bytes: {any}", .{ vm.return_data.len, vm.return_data });
    if (vm.return_data.len > 0) {
        std.log.info("VM return_data as string: {s}", .{vm.return_data});
    }
}