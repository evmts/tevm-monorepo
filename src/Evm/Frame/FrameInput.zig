const address = @import("Address");
const CallScheme = @import("CallScheme.zig").CallScheme;
const Bytes = @import("Bytes.zig").Bytes;

/// Represents EVM execution frame input parameters
pub const FrameInput = union(enum) {
    /// Standard call to address
    Call: struct {
        callData: Bytes,
        gasLimit: u64,
        target: address.Address,
        codeAddress: address.Address, // Address where code is loaded from
        caller: address.Address,
        value: u256,
        callType: CallScheme,
        isStatic: bool,
    },
    
    /// Contract creation
    Create: struct {
        initCode: Bytes,
        gasLimit: u64,
        caller: address.Address,
        value: u256,
        salt: ?[32]u8, // NULL for regular CREATE, non-null for CREATE2
    },
    
    pub fn getGasLimit(self: FrameInput) u64 {
        return switch (self) {
            .Call => |call| call.gasLimit,
            .Create => |create| create.gasLimit,
        };
    }
};