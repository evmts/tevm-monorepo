const std = @import("std");
const evm = @import("evm");
const Address = @import("Address");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){}; 
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    std.log.info("=== DEBUG CREATE SIMPLE TEST ===", .{});

    // Initialize memory database and VM
    var memory_db = evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();

    var vm = evm.Vm.init(allocator, db_interface, null, null) catch |err| {
        std.log.err("Failed to initialize VM: {}", .{err});
        return;
    };
    defer vm.deinit();

    // Creator address
    const creator_address = [_]u8{0x10} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));
    std.log.info("Set creator balance", .{});

    // Simple constructor that returns a single byte (0x00) as runtime code
    // Same as the test case to debug the exact issue
    const constructor_bytecode = [_]u8{
        0x60, 0x00, // PUSH1 0x00 (STOP opcode to store)  
        0x60, 0x00, // PUSH1 0x00 (memory offset)
        0x53,       // MSTORE8 (store single byte to memory[0])
        0x60, 0x01, // PUSH1 0x01 (size to return - 1 byte)
        0x60, 0x00, // PUSH1 0x00 (offset 0 - first byte)
        0xF3,       // RETURN
    };

    std.log.info("Constructor bytecode: {any}", .{constructor_bytecode});

    // Deploy using CREATE
    std.log.info("Starting CREATE contract...", .{});
    const create_result = vm.create_contract(
        creator_address,
        0,
        &constructor_bytecode,
        1000000,
    ) catch |err| {
        std.log.err("CREATE failed with error: {}", .{err});
        return;
    };

    std.log.info("CREATE result: success={}, address={any}", .{ create_result.success, create_result.address });
    defer if (create_result.output) |output| allocator.free(output);

    if (!create_result.success) {
        std.log.err("CREATE operation failed", .{});
        return;
    }

    // Check deployed code
    std.log.info("Checking deployed code...", .{});
    const deployed_code = vm.state.get_code(create_result.address);
    std.log.info("Deployed code length: {}", .{deployed_code.len});
    
    if (deployed_code.len > 0) {
        std.log.info("Deployed code: {any}", .{deployed_code});
        std.log.info("SUCCESS: Code was deployed correctly!", .{});
    } else {
        std.log.err("FAILURE: No code found at contract address!", .{});
    }

    std.log.info("=== END DEBUG TEST ===", .{});
}