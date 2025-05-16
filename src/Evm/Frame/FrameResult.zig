const address = @import("Address");
const InstructionResult = @import("InstructionResult.zig").InstructionResult;
const Bytes = @import("Bytes.zig").Bytes;

/// Frame execution results
pub const FrameResult = union(enum) {
    Call: struct {
        status: InstructionResult,
        returnData: Bytes,
        gasUsed: u64,
        gasRefunded: u64,
    },
    
    Create: struct {
        status: InstructionResult,
        returnData: Bytes,
        gasUsed: u64,
        gasRefunded: u64,
        createdAddress: ?address.Address,
    },
};