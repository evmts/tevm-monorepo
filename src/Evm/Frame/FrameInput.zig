const address = @import("Address");
const CallScheme = @import("CallScheme.zig").CallScheme;

/// Represents EVM execution frame input parameters
pub const FrameInput = union(enum) {
    /// Standard call to address
    Call: struct {
        callData: []const u8,
        gasLimit: u64,
        target: address.Address,
        codeAddress: address.Address, // Address where code is loaded from
        caller: address.Address,
        value: u256,
        callType: CallScheme,
        isStatic: bool,
    },
    
    /// Regular contract creation (CREATE)
    Create: struct {
        initCode: []const u8,
        gasLimit: u64,
        caller: address.Address,
        value: u256,
    },
    
    /// Contract creation with salt (CREATE2)
    Create2: struct {
        initCode: []const u8,
        gasLimit: u64,
        caller: address.Address,
        value: u256,
        salt: [32]u8, // Required for CREATE2
    },
    
    pub fn getGasLimit(self: FrameInput) u64 {
        return switch (self) {
            .Call => |call| call.gasLimit,
            .Create => |create| create.gasLimit,
            .Create2 => |create2| create2.gasLimit,
        };
    }
};