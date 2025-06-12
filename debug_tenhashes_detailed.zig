const std = @import("std");
const evm = @import("evm");
const Address = @import("Address");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    std.log.info("=== TEN THOUSAND HASHES CREATE DEBUG ===", .{});

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
    const creator_address = [_]u8{0x30} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));

    // TenThousandHashes bytecode from evm-bench (hex decoded)
    const bytecode_hex = "6080604052348015600e575f5ffd5b50609780601a5f395ff3fe6080604052348015600e575f5ffd5b50600436106026575f3560e01c806330627b7c14602a575b5f5ffd5b60306032565b005b5f5b614e20811015605e5760408051602081018390520160408051601f19818403019052526001016034565b5056fea26469706673582212202c247f39d615d7f66942cd6ed505d8ea34fbfcbe16ac875ed08c4a9c229325f364736f6c634300081e0033";
    
    // Decode hex to bytes
    const bytecode = try allocator.alloc(u8, bytecode_hex.len / 2);
    defer allocator.free(bytecode);
    _ = try std.fmt.hexToBytes(bytecode, bytecode_hex);

    std.log.info("Constructor bytecode length: {} bytes", .{bytecode.len});
    std.log.info("Constructor bytecode (first 32 bytes): {any}", .{bytecode[0..@min(32, bytecode.len)]});

    // Let's manually decode some of the constructor to understand what it's doing
    std.log.info("=== MANUAL BYTECODE ANALYSIS ===", .{});
    var i: usize = 0;
    while (i < @min(20, bytecode.len)) {
        const opcode = bytecode[i];
        std.log.info("Offset {}: 0x{X:0>2}", .{ i, opcode });
        i += 1;
    }

    // Deploy the contract using CREATE with detailed error handling
    std.log.info("=== EXECUTING CREATE ===", .{});
    const create_result = vm.create_contract(
        creator_address,
        0,
        bytecode,
        10000000, // Higher gas limit for complex contract
    ) catch |err| {
        std.log.err("CREATE FAILED with error: {}", .{err});
        return;
    };
    defer if (create_result.output) |output| allocator.free(output);

    std.log.info("=== CREATE EXECUTION COMPLETED ===", .{});
    std.log.info("CREATE success: {}", .{create_result.success});
    std.log.info("CREATE address: {any}", .{create_result.address});
    std.log.info("CREATE gas_left: {}", .{create_result.gas_left});
    
    if (create_result.output) |output| {
        std.log.info("CREATE output length: {} bytes", .{output.len});
        if (output.len > 0) {
            std.log.info("CREATE output (first 32 bytes): {any}", .{output[0..@min(32, output.len)]});
        } else {
            std.log.warn("CREATE output is EMPTY!", .{});
        }
    } else {
        std.log.warn("CREATE output is NULL!", .{});
    }

    // Check what code is actually stored at the address
    const deployed_code = vm.state.get_code(create_result.address);
    std.log.info("=== POST-CREATE CODE VERIFICATION ===", .{});
    std.log.info("Code stored at address length: {} bytes", .{deployed_code.len});
    
    if (deployed_code.len == 0) {
        std.log.err("CRITICAL: No code stored at contract address!", .{});
        std.log.err("This means the constructor returned empty output (RETURN with 0 length)", .{});
    } else {
        std.log.info("SUCCESS: Code was stored! First 32 bytes: {any}", .{deployed_code[0..@min(32, deployed_code.len)]});
    }
}