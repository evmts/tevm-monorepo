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

    // Creator address with sufficient balance
    const creator_address = [_]u8{0x10} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));

    // Simple constructor that returns a single STOP opcode (0x00) as runtime code
    const constructor_bytecode = [_]u8{
        0x60, 0x00, // PUSH1 0x00 (STOP opcode to store)
        0x60, 0x00, // PUSH1 0x00 (memory offset for 32-byte word)
        0x52,       // MSTORE (store 32-byte word to memory)
        0x60, 0x01, // PUSH1 0x01 (size to return - 1 byte)
        0x60, 0x1F, // PUSH1 0x1F (offset 31 - last byte of 32-byte word)
        0xF3,       // RETURN
    };

    std.log.info("=== DEBUGGING CREATE SIMPLE ===", .{});
    std.log.info("Constructor bytecode: {any}", .{constructor_bytecode});

    // Deploy the contract using CREATE
    const create_result = vm.create_contract(
        creator_address,
        0,
        &constructor_bytecode,
        1000000,
    ) catch |err| {
        std.log.err("CREATE failed with error: {}", .{err});
        return err;
    };
    defer if (create_result.output) |output| allocator.free(output);

    std.log.info("CREATE result: success={}, address={any}", .{ create_result.success, create_result.address });
    
    if (create_result.output) |output| {
        std.log.info("CREATE output length: {}, content: {any}", .{ output.len, output });
    } else {
        std.log.info("CREATE output is null", .{});
    }

    // Check deployed code
    const deployed_code = vm.state.get_code(create_result.address);
    std.log.info("Deployed code length: {}, content: {any}", .{ deployed_code.len, deployed_code });
}