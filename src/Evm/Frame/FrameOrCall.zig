const FrameResult = @import("FrameResult.zig").FrameResult;
const FrameInput = @import("FrameInput.zig").FrameInput;

/// Result of frame execution - either a result or a new call
pub const FrameOrCall = union(enum) {
    /// Execution completed with this result
    Result: FrameResult,
    /// Execution needs to create a new call
    Call: FrameInput,
};