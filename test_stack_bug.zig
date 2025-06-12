const std = @import("std");
const evm = @import("evm");
const Address = @import("Address");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var memory_db = evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();

    var vm = evm.Vm.init(allocator, db_interface, null, null) catch unreachable;
    defer vm.deinit();

    const creator_address = [_]u8{0x30} ++ [_]u8{0x00} ** 19;
    try vm.state.set_balance(creator_address, std.math.maxInt(u256));

    std.debug.print("=== TESTING CORRECTED CONSTRUCTOR ===\n", .{});
    
    // This is the CORRECTED constructor that should work
    const fixed_constructor = [_]u8{
        0x60, 0x97, // PUSH1 0x97 (151) - size for CODECOPY
        0x60, 0x1a, // PUSH1 0x1a (26) - offset for CODECOPY  
        0x5f,       // PUSH0 - destOffset for CODECOPY
        0x39,       // CODECOPY - copy runtime code to memory
        0x60, 0x97, // PUSH1 0x97 (151) - *** PUSH SIZE AGAIN ***
        0x5f,       // PUSH0 - offset for RETURN
        0xf3,       // RETURN - return 151 bytes
        // Followed by 151 bytes of dummy runtime code
        0x60, 0x00, 0x35, // PUSH1 0, CALLDATALOAD (dummy runtime)
    };
    
    // Extend with dummy runtime code to reach 151 bytes total after offset 26
    var extended_constructor = std.ArrayList(u8).init(allocator);
    defer extended_constructor.deinit();
    
    try extended_constructor.appendSlice(&fixed_constructor);
    
    // Add enough dummy runtime bytes to make offset 26 + 151 bytes valid
    const needed_runtime_bytes = 26 + 151 - fixed_constructor.len;
    for (0..needed_runtime_bytes) |_| {
        try extended_constructor.append(0x00); // STOP opcodes as dummy runtime
    }

    std.debug.print("Testing fixed constructor with {} bytes\n", .{extended_constructor.items.len});

    const create_result = vm.create_contract(
        creator_address,
        0,
        extended_constructor.items,
        1000000,
    ) catch |err| {
        std.debug.print("CREATE failed: {}\n", .{err});
        return;
    };
    defer if (create_result.output) |output| allocator.free(output);

    std.debug.print("Fixed constructor result:\n", .{});
    std.debug.print("  Success: {}\n", .{create_result.success});
    if (create_result.output) |output| {
        std.debug.print("  Output length: {} bytes\n", .{output.len});
        std.debug.print("  Expected: 151 bytes\n", .{});
        if (output.len == 151) {
            std.debug.print("  ✅ SUCCESS: Constructor returns correct runtime code length!\n", .{});
        } else {
            std.debug.print("  ❌ FAIL: Wrong output length\n", .{});
        }
    } else {
        std.debug.print("  ❌ FAIL: No output\n", .{});
    }

    const deployed_code = vm.state.get_code(create_result.address);
    std.debug.print("  Deployed code length: {} bytes\n", .{deployed_code.len});
    if (deployed_code.len == 151) {
        std.debug.print("  ✅ SUCCESS: Runtime code stored correctly!\n", .{});
    } else {
        std.debug.print("  ❌ FAIL: Runtime code not stored\n", .{});
    }
}