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

    std.debug.print("=== TESTING MINIMAL RETURN CONSTRUCTOR ===\n", .{});
    
    // Minimal constructor that just returns some bytes from memory
    const minimal_constructor = [_]u8{
        // First, store some data in memory
        0x60, 0x42,       // PUSH1 0x42 (data to store)
        0x60, 0x00,       // PUSH1 0x00 (memory offset)
        0x52,             // MSTORE (store 0x42 at memory[0..32])
        
        // Now return it
        0x60, 0x20,       // PUSH1 0x20 (32 bytes to return)
        0x60, 0x00,       // PUSH1 0x00 (offset in memory)
        0xf3,             // RETURN
    };

    std.debug.print("Testing minimal constructor that stores and returns 32 bytes\n", .{});

    const create_result = vm.create_contract(
        creator_address,
        0,
        &minimal_constructor,
        1000000,
    ) catch |err| {
        std.debug.print("CREATE failed: {}\n", .{err});
        return;
    };
    defer if (create_result.output) |output| allocator.free(output);

    std.debug.print("Minimal constructor result:\n", .{});
    std.debug.print("  Success: {}\n", .{create_result.success});
    if (create_result.output) |output| {
        std.debug.print("  Output length: {} bytes\n", .{output.len});
        if (output.len > 0) {
            std.debug.print("  Output (first 8 bytes): {any}\n", .{output[0..@min(8, output.len)]});
            std.debug.print("  Expected: 32 bytes starting with 0x42\n", .{});
            if (output.len == 32 and output[31] == 0x42) {
                std.debug.print("  ✅ SUCCESS: RETURN opcode works correctly!\n", .{});
            } else {
                std.debug.print("  ❌ FAIL: Wrong output content\n", .{});
            }
        } else {
            std.debug.print("  ❌ FAIL: No output - RETURN bug confirmed\n", .{});
        }
    } else {
        std.debug.print("  ❌ FAIL: No output - RETURN bug confirmed\n", .{});
    }

    const deployed_code = vm.state.get_code(create_result.address);
    std.debug.print("  Deployed code length: {} bytes\n", .{deployed_code.len});
}