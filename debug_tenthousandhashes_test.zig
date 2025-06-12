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
    const creator_address = [_]u8{0x30} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));

    // TenThousandHashes bytecode from evm-bench (hex decoded)
    const bytecode_hex = "6080604052348015600e575f5ffd5b50609780601a5f395ff3fe6080604052348015600e575f5ffd5b50600436106026575f3560e01c806330627b7c14602a575b5f5ffd5b60306032565b005b5f5b614e20811015605e5760408051602081018390520160408051601f19818403019052526001016034565b5056fea26469706673582212202c247f39d615d7f66942cd6ed505d8ea34fbfcbe16ac875ed08c4a9c229325f364736f6c634300081e0033";
    
    // Decode hex to bytes
    const bytecode = try allocator.alloc(u8, bytecode_hex.len / 2);
    defer allocator.free(bytecode);
    _ = try std.fmt.hexToBytes(bytecode, bytecode_hex);

    std.debug.print("=== DETAILED TenThousandHashes CREATE DEBUG ===\n", .{});
    std.debug.print("Creator address: {any}\n", .{creator_address});
    std.debug.print("Creator balance: {}\n", .{vm.state.get_balance(creator_address)});
    std.debug.print("Constructor bytecode length: {} bytes\n", .{bytecode.len});
    std.debug.print("Constructor bytecode (first 32 bytes): {any}\n", .{bytecode[0..@min(32, bytecode.len)]});

    // Deploy the contract using CREATE with detailed error handling
    const create_result = vm.create_contract(
        creator_address,
        0,
        bytecode,
        10000000, // Higher gas limit for complex contract
    ) catch |err| {
        std.debug.print("CREATE FAILED with error: {}\n", .{err});
        std.debug.print("This means the constructor execution itself failed\n", .{});
        return;
    };
    defer if (create_result.output) |output| allocator.free(output);

    std.debug.print("=== CREATE EXECUTION COMPLETED ===\n", .{});
    std.debug.print("CREATE success: {}\n", .{create_result.success});
    std.debug.print("CREATE address: {any}\n", .{create_result.address});
    std.debug.print("CREATE gas_left: {}\n", .{create_result.gas_left});
    
    if (create_result.output) |output| {
        std.debug.print("CREATE output length: {} bytes\n", .{output.len});
        if (output.len > 0) {
            std.debug.print("CREATE output (first 32 bytes): {any}\n", .{output[0..@min(32, output.len)]});
        } else {
            std.debug.print("WARNING: CREATE output is EMPTY - this is the problem!\n", .{});
        }
    } else {
        std.debug.print("WARNING: CREATE output is NULL - this is the problem!\n", .{});
    }

    // Check that CREATE succeeded  
    if (!create_result.success) {
        std.debug.print("ERROR: CREATE reported failure - constructor execution failed\n", .{});
        return;
    }

    // Check what code is actually stored at the address
    const deployed_code = vm.state.get_code(create_result.address);
    std.debug.print("=== POST-CREATE CODE VERIFICATION ===\n", .{});
    std.debug.print("Code stored at address length: {} bytes\n", .{deployed_code.len});
    
    if (deployed_code.len == 0) {
        std.debug.print("CRITICAL: No code stored at contract address!\n", .{});
        std.debug.print("This means either:\n", .{});
        std.debug.print("1. Constructor returned empty output (RETURN with 0 length)\n", .{});
        std.debug.print("2. set_code() failed to store the code\n", .{});
        std.debug.print("3. get_code() failed to retrieve the code\n", .{});
    } else {
        std.debug.print("SUCCESS: Code was stored! First 32 bytes: {any}\n", .{deployed_code[0..@min(32, deployed_code.len)]});
    }
}