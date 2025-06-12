const std = @import("std");
const evm = @import("evm");
const Address = @import("Address");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Initialize memory database
    var memory_db = evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();

    // Initialize VM
    var vm = try evm.Vm.init(allocator, db_interface, null, null);
    defer vm.deinit();

    // Set up creator account with balance
    const creator_address: [20]u8 = [_]u8{0x10} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));

    std.debug.print("=== Debugging Contract Creation ===\n", .{});

    // Constructor that actually puts data in memory before returning
    const init_code = [_]u8{
        0x60, 0x42, // PUSH1 0x42 (data to store)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x52,       // MSTORE (store 0x42 at memory offset 0)
        0x60, 0x01, // PUSH1 1 (size = 1 byte)
        0x60, 0x1F, // PUSH1 31 (offset = 31, last byte of the 32-byte word)
        0xF3,       // RETURN
    };

    std.debug.print("Init code length: {}\n", .{init_code.len});

    // Deploy the contract
    const create_result = try vm.create_contract(
        creator_address, // creator
        0,               // value
        &init_code,      // init code
        1000000,         // gas
    );

    std.debug.print("\nCreate result:\n", .{});
    std.debug.print("  Success: {}\n", .{create_result.success});
    std.debug.print("  Gas left: {}\n", .{create_result.gas_left});
    
    if (create_result.output) |output| {
        std.debug.print("  Output length: {}\n", .{output.len});
        // Just show the length for now
        std.debug.print("  Output has {} bytes\n", .{output.len});
    } else {
        std.debug.print("  Output: null\n", .{});
    }

    // Check deployed code
    const deployed_code = vm.state.get_code(create_result.address);
    std.debug.print("  Deployed code length: {}\n", .{deployed_code.len});
    // Just show the length for now
    std.debug.print("  Deployed code has {} bytes\n", .{deployed_code.len});
}