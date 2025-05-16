const std = @import("std");

pub const evm = @import("Evm");
pub const utils = @import("Utils");

pub fn main() void {
    // Create state manager
    var stateManager = evm.frame.StateManager{};
    
    // Initialize EVM
    var evm_instance = evm.Evm.init(std.heap.page_allocator, &stateManager);
    
    // Create a simple call input
    var input = evm.frame.FrameInput{
        .Call = .{
            .callData = &[_]u8{},
            .gasLimit = 100000,
            .target = evm.address.ZERO_ADDRESS,
            .codeAddress = evm.address.ZERO_ADDRESS,
            .caller = evm.address.ZERO_ADDRESS,
            .value = 0,
            .callType = .Call,
            .isStatic = false,
        },
    };
    
    // Execute
    _ = evm_instance.execute(&input) catch unreachable;
}
