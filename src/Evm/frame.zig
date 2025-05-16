const std = @import("std");
const address = @import("Address");

// Re-export types from subdirectories
pub const CallScheme = @import("Frame/CallScheme.zig").CallScheme;
pub const JournalCheckpoint = @import("Frame/JournalCheckpoint.zig").JournalCheckpoint;
pub const FrameInput = @import("Frame/FrameInput.zig").FrameInput;
pub const InstructionResult = @import("Frame/InstructionResult.zig").InstructionResult;
pub const FrameResult = @import("Frame/FrameResult.zig").FrameResult;
pub const Memory = @import("Frame/Memory.zig").Memory;
pub const Stack = @import("Frame/Stack.zig").Stack;
pub const ExecutionState = @import("Frame/ExecutionState.zig").ExecutionState;
pub const FrameOrCall = @import("Frame/FrameOrCall.zig").FrameOrCall;
pub const StateManager = @import("Frame/StateManager.zig").StateManager;
pub const Frame = @import("Frame/Frame.zig").Frame;

// Log configuration
const _ = @import("log_config.zig");
const log = std.log.scoped(.frame);
