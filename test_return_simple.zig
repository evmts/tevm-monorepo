const std = @import("std");
const evm = @import("src/evm/evm.zig");
const utils = @import("src/Utils/utils.zig");
const Address = @import("src/Address/Address.ts");

pub fn main() \!void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Initialize VM
    var vm = try evm.Vm.init(allocator);
    defer vm.deinit();

    // Bytecode: PUSH1 0x05, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
    const bytecode = [_]u8{ 0x60, 0x05, 0x60, 0x00, 0x52, 0x60, 0x20, 0x60, 0x00, 0xf3 };

    // Run bytecode
    const result = try vm.run(&bytecode, Address.zero(), 100000, null);
    defer if (result.output) |output| allocator.free(output);

    std.debug.print("Result status: {}\n", .{result.status});
    std.debug.print("Gas left: {}\n", .{result.gas_left});
    std.debug.print("Gas used: {}\n", .{result.gas_used});
    
    if (result.output) |output| {
        std.debug.print("Output length: {}\n", .{output.len});
        if (output.len > 0) {
            std.debug.print("Output data: ", .{});
            for (output) |byte| {
                std.debug.print("{x:0>2} ", .{byte});
            }
            std.debug.print("\n", .{});
        }
    } else {
        std.debug.print("Output is null\n", .{});
    }
}
EOF < /dev/null