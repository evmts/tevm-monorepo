const address = @import("Address");
const InstructionResult = @import("InstructionResult.zig").InstructionResult;

/// Frame execution results
pub const FrameResult = union(enum) {
    Call: struct {
        status: InstructionResult,
        returnData: []const u8,
        gasUsed: u64,
        gasRefunded: u64,
    },
    
    Create: struct {
        status: InstructionResult,
        returnData: []const u8,
        gasUsed: u64,
        gasRefunded: u64,
        createdAddress: ?address.Address,
    },
};