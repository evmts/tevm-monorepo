const std = @import("std");
const address = @import("Address");

// Import all the frame components
const Bytes = @import("Bytes.zig").Bytes;
const CallScheme = @import("CallScheme.zig").CallScheme;
const JournalCheckpoint = @import("JournalCheckpoint.zig").JournalCheckpoint;
const FrameInput = @import("FrameInput.zig").FrameInput;
const InstructionResult = @import("InstructionResult.zig").InstructionResult;
const FrameResult = @import("FrameResult.zig").FrameResult;
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;
const ExecutionState = @import("ExecutionState.zig").ExecutionState;
const FrameOrCall = @import("FrameOrCall.zig").FrameOrCall;
const StateManager = @import("StateManager.zig").StateManager;

// Import logging configuration
const _ = @import("../log_config.zig"); // Import for log configuration

// Define a scoped logger for Frame-related logs
const log = std.log.scoped(.frame);

/// Main execution frame - represents a single execution context
pub const Frame = struct {
    allocator: std.mem.Allocator,
    /// The input that created this frame
    input: FrameInput,
    /// Current execution state
    state: ExecutionState,
    /// Bytecode being executed
    code: Bytes,
    /// Depth in the call stack (limit 1024)
    depth: u16,
    /// Journal checkpoint for state changes
    checkpoint: JournalCheckpoint,
    
    pub fn init(
        allocator: std.mem.Allocator, 
        input: FrameInput, 
        code: Bytes,
        depth: u16,
        checkpoint: JournalCheckpoint
    ) !Frame {
        const gasLimit = input.getGasLimit();
        
        return Frame{
            .allocator = allocator,
            .input = input,
            .state = ExecutionState.init(allocator, gasLimit),
            .code = code,
            .depth = depth,
            .checkpoint = checkpoint,
        };
    }
    
    pub fn deinit(self: *Frame) void {
        self.state.deinit();
    }
    
    /// Debug method that logs information about the frame
    pub fn debug(self: *Frame) void {
        log.debug("\n=== FRAME DEBUG [Depth: {d}] ===", .{self.depth});
        
        // Print input information based on type
        switch (self.input) {
            .Call => |call| {
                log.debug("Type: Call", .{});
                log.debug("Gas Limit: {d}", .{call.gasLimit});
                log.debug("Target: {any}", .{call.target});
                log.debug("Code Address: {any}", .{call.codeAddress});
                log.debug("Caller: {any}", .{call.caller});
                log.debug("Value: {d}", .{call.value});
                log.debug("Call Type: {s}", .{@tagName(call.callType)});
                log.debug("Is Static: {}", .{call.isStatic});
                log.debug("Call Data Size: {d} bytes", .{call.callData.len});
            },
            .Create => |create| {
                log.debug("Type: Create", .{});
                log.debug("Gas Limit: {d}", .{create.gasLimit});
                log.debug("Caller: {any}", .{create.caller});
                log.debug("Value: {d}", .{create.value});
                log.debug("Has Salt: {}", .{create.salt != null});
                log.debug("Init Code Size: {d} bytes", .{create.initCode.len});
            },
        }
        
        // Print code information
        log.debug("Code Length: {d} bytes", .{self.code.len});
        if (self.code.len > 0) {
            var bytesStr: [50]u8 = undefined;
            var fbs = std.io.fixedBufferStream(&bytesStr);
            const writer = fbs.writer();
            
            const len = @min(self.code.len, 10);
            var i: usize = 0;
            while (i < len) : (i += 1) {
                writer.print("{x:0>2} ", .{self.code[i]}) catch break;
            }
            
            log.debug("First 10 bytes: {s}", .{bytesStr[0..fbs.pos]});
        }
        
        // Print current execution state
        log.debug("PC: {d}", .{self.state.pc});
        log.debug("Gas Remaining: {d}", .{self.state.gas.remaining});
        log.debug("Gas Refunded: {d}", .{self.state.gas.refunded});
        log.debug("Stack Size: {d}", .{self.state.stack.data.items.len});
        log.debug("Memory Size: {d} bytes", .{self.state.memory.data.items.len});
        
        log.debug("=== END FRAME DEBUG ===\n", .{});
    }
    
    /// Execute the frame until completion or a new call is needed
    pub fn execute(self: *Frame, stateManager: *StateManager) !FrameOrCall {
        // Simple implementation for initial tests
        // Just check for basic opcodes and handle them
        log.debug("Starting execution", .{});
        _ = stateManager; // Silence unused parameter warning
        
        if (self.code.len == 0) {
            log.debug("Empty code, returning success", .{});
            // Empty code returns success
            return FrameOrCall{ 
                .Result = FrameResult{
                    .Call = .{
                        .status = .Success,
                        .returnData = &[_]u8{},
                        .gasUsed = self.input.getGasLimit() - self.state.gas.remaining,
                        .gasRefunded = self.state.gas.refunded,
                    }
                }
            };
        }
        
        log.debug("Code length is {d}, first byte: {x:0>2}", .{self.code.len, self.code[0]});
        
        // In a real implementation, we would loop through the bytecode and interpret opcodes
        // but for this simplified version, we'll just check for STOP (0x00)
        if (self.code[0] == 0x00) {
            log.debug("Found STOP opcode, returning success", .{});
            // STOP opcode
            return FrameOrCall{ 
                .Result = FrameResult{
                    .Call = .{
                        .status = .Success,
                        .returnData = &[_]u8{},
                        .gasUsed = self.input.getGasLimit() - self.state.gas.remaining,
                        .gasRefunded = self.state.gas.refunded,
                    }
                }
            };
        }
        
        log.debug("Unknown opcode, returning InvalidOpcode", .{});
        // Default response for other opcodes (not yet implemented)
        return FrameOrCall{ 
            .Result = FrameResult{
                .Call = .{
                    .status = .InvalidOpcode,
                    .returnData = &[_]u8{},
                    .gasUsed = self.input.getGasLimit() - self.state.gas.remaining,
                    .gasRefunded = self.state.gas.refunded,
                }
            }
        };
    }
};