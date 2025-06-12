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

    std.debug.print("=== Contract Creation Test ===\n", .{});

    // Simple constructor that returns runtime code
    const init_code = [_]u8{
        0x60, 0x0A, // PUSH1 10 (length of runtime code)
        0x60, 0x0C, // PUSH1 12 (offset of runtime code)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x39,       // CODECOPY
        0x60, 0x0A, // PUSH1 10 (length)
        0x60, 0x00, // PUSH1 0 (offset)
        0xF3,       // RETURN
        // Runtime code starts here
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x00, // PUSH1 0x00
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 0x20
        0x60, 0x00, // PUSH1 0x00
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

    std.debug.print("Create result:\n", .{});
    std.debug.print("  Success: {}\n", .{create_result.success});
    std.debug.print("  Gas left: {}\n", .{create_result.gas_left});
    
    if (create_result.output) |output| {
        std.debug.print("  Output length: {}\n", .{output.len});
    } else {
        std.debug.print("  Output: null\n", .{});
    }

    if (!create_result.success) {
        std.debug.print("Contract creation failed!\n", .{});
        return;
    }

    // Check if the code was actually deployed
    const deployed_code = vm.state.get_code(create_result.address);
    std.debug.print("Deployed code length: {}\n", .{deployed_code.len});
    
    if (deployed_code.len > 0) {
        std.debug.print("SUCCESS: Code was deployed!\n", .{});
    } else {
        std.debug.print("ISSUE: No code found at deployed address!\n", .{});
    }
}