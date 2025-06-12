const std = @import("std");
const evm = @import("evm");
const Address = @import("Address");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    std.log.info("=== SIMPLE CREATE DEBUG SESSION ===", .{});

    // Initialize memory database and VM
    var memory_db = evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();

    var vm = evm.Vm.init(allocator, db_interface, null, null) catch |err| {
        std.log.err("Failed to initialize VM: {}", .{err});
        return;
    };
    defer vm.deinit();

    // Creator address with sufficient balance
    const creator_address = [_]u8{0x10} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));

    std.log.info("Creator balance set to: {}", .{vm.state.get_balance(creator_address)});

    // Simplest possible constructor that returns one byte (STOP opcode)
    const constructor_bytecode = [_]u8{
        0x60, 0x00, // PUSH1 0x00 (STOP opcode to store)
        0x60, 0x00, // PUSH1 0x00 (memory offset)
        0x52,       // MSTORE (store to memory)
        0x60, 0x01, // PUSH1 0x01 (size to return - 1 byte)
        0x60, 0x1F, // PUSH1 0x1F (offset - last byte of word)
        0xF3,       // RETURN
    };

    std.log.info("Constructor bytecode length: {} bytes", .{constructor_bytecode.len});
    std.log.info("Constructor bytecode: {any}", .{constructor_bytecode});

    // Step-by-step execution
    std.log.info("=== EXECUTING CREATE ===", .{});
    const create_result = vm.create_contract(
        creator_address,
        0,
        &constructor_bytecode,
        1000000,
    ) catch |err| {
        std.log.err("CREATE failed with error: {}", .{err});
        return;
    };
    defer if (create_result.output) |output| allocator.free(output);

    std.log.info("=== CREATE RESULT ===", .{});
    std.log.info("Success: {}", .{create_result.success});
    std.log.info("Address: {any}", .{create_result.address});
    std.log.info("Gas left: {}", .{create_result.gas_left});
    
    if (create_result.output) |output| {
        std.log.info("Output length: {}", .{output.len});
        if (output.len > 0) {
            std.log.info("Output: {any}", .{output});
        } else {
            std.log.warn("Output is EMPTY!", .{});
        }
    } else {
        std.log.warn("Output is NULL!", .{});
    }

    // Check stored code
    const deployed_code = vm.state.get_code(create_result.address);
    std.log.info("=== STORED CODE CHECK ===", .{});
    std.log.info("Deployed code length: {}", .{deployed_code.len});
    if (deployed_code.len > 0) {
        std.log.info("Deployed code: {any}", .{deployed_code});
    } else {
        std.log.warn("NO CODE STORED AT ADDRESS!", .{});
    }
}