const std = @import("std");
const evm = @import("evm");
const Address = @import("Address");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Initialize database and VM
    var database = evm.MemoryDatabase.init(allocator);
    defer database.deinit();

    var vm = try evm.Vm.init_with_hardfork(allocator, database.to_database_interface(), evm.Hardfork.SHANGHAI);
    defer vm.deinit();

    // Simple constructor that should return 0x42
    // PUSH1 0x42  (0x6042)
    // PUSH1 0x00  (0x6000) 
    // MSTORE      (0x52)
    // PUSH1 0x01  (0x6001)
    // PUSH1 0x1F  (0x601F)
    // RETURN      (0xF3)
    const init_code = [_]u8{ 0x60, 0x42, 0x60, 0x00, 0x52, 0x60, 0x01, 0x60, 0x1F, 0xF3 };

    const creator = Address.from_hex("0x1000000000000000000000000000000000000001") catch unreachable;
    const value: u256 = 0;
    const gas: u64 = 100000;

    std.log.info("Creating contract with init code: {any}", .{std.fmt.fmtSliceHexLower(&init_code)});

    const result = vm.create_contract(creator, value, &init_code, gas) catch |err| {
        std.log.err("Contract creation failed: {}", .{err});
        return;
    };

    std.log.info("Contract creation result:", .{});
    std.log.info("  Success: {}", .{result.success});
    std.log.info("  Address: {any}", .{result.address});
    std.log.info("  Gas left: {}", .{result.gas_left});
    std.log.info("  Output length: {}", .{if (result.output) |output| output.len else 0});
    
    if (result.output) |output| {
        std.log.info("  Output bytes: {any}", .{std.fmt.fmtSliceHexLower(output)});
    } else {
        std.log.info("  Output: null");
    }

    // Check if code was actually stored
    const stored_code = vm.state.get_code(result.address);
    std.log.info("  Stored code length: {}", .{stored_code.len});
    if (stored_code.len > 0) {
        std.log.info("  Stored code: {any}", .{std.fmt.fmtSliceHexLower(stored_code)});
    }
}