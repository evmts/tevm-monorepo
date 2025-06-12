const std = @import("std");
const ecrecover = @import("src/evm/precompiles/ecrecover.zig");
const secp256k1 = @import("src/evm/precompiles/secp256k1.zig");

test "debug ecrecover behavior" {
    std.debug.print("\n=== ECRECOVER DEBUG TEST ===\n", .{});
    
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Test case from failing test: v=27, r=1, s=1
    input[63] = 27; // v = 27
    input[95] = 1;  // r = 1
    input[127] = 1; // s = 1
    
    std.debug.print("Input - v: {}, r: {}, s: {}\n", .{ input[63], input[95], input[127] });
    
    const result = ecrecover.execute(&input, &output, 5000);
    
    if (result.is_success()) {
        std.debug.print("Execution successful\n", .{});
        std.debug.print("Gas used: {}\n", .{result.get_gas_used()});
        std.debug.print("Output size: {}\n", .{result.get_output_size()});
        
        if (result.get_output_size() > 0) {
            std.debug.print("Recovered address: 0x", .{});
            for (output[12..32]) |byte| {
                std.debug.print("{:02x}", .{byte});
            }
            std.debug.print("\n", .{});
        }
    } else {
        std.debug.print("Execution failed\n", .{});
        if (result.get_error()) |err| {
            std.debug.print("Error: {}\n", .{err});
        }
    }
    
    // Test with all zeros (should definitely fail)
    @memset(&input, 0);
    @memset(&output, 0);
    
    std.debug.print("\n--- All zeros test ---\n", .{});
    const zero_result = ecrecover.execute(&input, &output, 5000);
    
    if (zero_result.is_success()) {
        std.debug.print("Zero test successful - Output size: {}\n", .{zero_result.get_output_size()});
    } else {
        std.debug.print("Zero test failed\n", .{});
    }
}