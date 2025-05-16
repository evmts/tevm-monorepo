const std = @import("std");
pub const block = @import("Block");
pub const address = @import("Address");
pub const frame = @import("Frame.zig");
const _ = @import("log_config.zig"); // Import for log configuration

// Define a scoped logger for EVM-related logs
const log = std.log.scoped(.evm);

pub const ExecutionContext = struct {
    block: block.Block = block.Block{
        .number = 0,
        .coinbase = address.ZERO_ADDRESS,
        .timestamp = 0,
        .difficulty = 0,
        .prevRandao = .{0} ** 32,
        .gasLimit = 0,
        .getBlobGasPrice = 0,
        .baseFeePerGas = null,
    },
    gasPrice: u256 = 0,
    origin: [20]u8 = address.ZERO_ADDRESS,
};

pub const CallParams = struct {
    message: Message,
    context: ExecutionContext,
};

pub const Message = struct {
    caller: [20]u8 = address.ZERO_ADDRESS,
    gasLimit: u256 = 0xffffff,
    to: [20]u8 = address.ZERO_ADDRESS,
    value: u256 = 0,
    data: []u8,
    code: []u8,
    depth: u16 = 0,
    isStatic: bool = false,
    salt: [32]u8 = [_]u8{0} ** 32,
    selfdestruct: []const [20]u8 = &[_][20]u8{},
    blobVersionedHashes: []const [32]u8 = &[_][32]u8{},
};

pub const Log = struct {
    address: []const u8,
    topics: []const []const u8,
    data: []const u8,
};

pub const ExecuteResult = struct {
    gas: ?u256 = null,
    executionGasUsed: u256,
    returnValue: []u8,
    logs: ?[]Log = null,
    selfdestruct: ?[][20]u8 = null,
    createdAddresses: ?[][20]u8 = null,
    gasRefund: ?u256 = null,
    blobGasUsed: ?u256 = null,
};

pub const ExecuteError = error{
    OUT_OF_GAS,
    CODESTORE_OUT_OF_GAS,
    CODESIZE_EXCEEDS_MAXIMUM,
    STACK_UNDERFLOW,
    STACK_OVERFLOW,
    INVALID_JUMP,
    INVALID_OPCODE,
    OUT_OF_RANGE,
    REVERT,
    STATIC_STATE_CHANGE,
    INTERNAL_ERROR,
    CREATE_COLLISION,
    STOP,
    REFUND_EXHAUSTED,
    VALUE_OVERFLOW,
    INSUFFICIENT_BALANCE,
    INVALID_BYTECODE_RESULT,
    INITCODE_SIZE_VIOLATION,
    INVALID_INPUT_LENGTH,
    INVALID_EOF_FORMAT,
    BLS_12_381_INVALID_INPUT_LENGTH,
    BLS_12_381_POINT_NOT_ON_CURVE,
    BLS_12_381_INPUT_EMPTY,
    BLS_12_381_FP_NOT_IN_FIELD,
    BN254_FP_NOT_IN_FIELD,
    INVALID_COMMITMENT,
    INVALID_INPUTS,
    INVALID_PROOF,
};

const Account = struct {
    balance: u256,
    nonce: u64,
};

const CodeMap = std.AutoHashMap(address.Address, []u8);
const AccountMap = std.AutoHashMap(address.Address, Account);
const StorageMaps = std.AutoHashMap(u256, u256);
pub const StateManager = struct {
    bytecode: CodeMap,
    accounts: AccountMap,
    storage: StorageMaps,
};

pub const Evm = struct {
    allocator: std.mem.Allocator,
    stateManager: *frame.StateManager,

    pub fn init(allocator: std.mem.Allocator, stateManager: *frame.StateManager) Evm {
        return Evm{
            .allocator = allocator,
            .stateManager = stateManager,
        };
    }

    // Helper method to create the appropriate frame
    pub fn createFrame(self: Evm, input: frame.FrameInput, code: []const u8, depth: u16) !@import("Frame/Frame.zig").Frame {
        // Create checkpoint for state changes
        const checkpoint = self.stateManager.checkpoint();

        // Initialize and return the frame
        return try @import("Frame/Frame.zig").Frame.init(self.allocator, input, code, depth, checkpoint);
    }

    pub fn execute(self: *Evm, input: frame.FrameInput) !frame.FrameResult {
        // Debug message to verify this method is called
        log.debug("STARTING EVM.EXECUTE", .{});

        var code: []const u8 = undefined;

        // Get the code based on frame input type
        switch (input) {
            .Call => |call| {
                // For a call, load the code from the target address
                log.debug("Loading code for address: {any}", .{call.codeAddress});
                code = try self.stateManager.loadCode(call.codeAddress);
                log.debug("Call input - Gas Limit: {d}, Code length: {d}", .{ call.gasLimit, code.len });
            },
            .Create => |create| {
                // For create, use the init code
                code = create.initCode;
                log.debug("Create input - Gas Limit: {d}, Init code length: {d}", .{ create.gasLimit, create.initCode.len });
            },
        }

        log.debug("Creating frame...", .{});
        // Create a new frame
        var currentFrame = try self.createFrame(input, code, 0);
        defer currentFrame.deinit();
        log.debug("Frame created", .{});

        // Debug info
        log.debug("Calling debug on frame...", .{});
        currentFrame.debug();
        log.debug("Debug call completed", .{});

        // Execute the frame
        log.debug("Executing frame...", .{});
        const result = try currentFrame.execute(self.stateManager);
        log.debug("Frame execution completed", .{});

        // Handle the result
        log.debug("Handling result...", .{});
        switch (result) {
            .Result => |frameResult| {
                log.debug("Got Result, returning frameResult", .{});

                // Make sure we return the correct result type based on the input type
                if (input == .Create) {
                    if (frameResult == .Call) {
                        log.debug("Converting Call result to Create result", .{});
                        const callResult = frameResult.Call;
                        return frame.FrameResult{ .Create = .{
                            .status = callResult.status,
                            .returnData = callResult.returnData,
                            .gasUsed = callResult.gasUsed,
                            .gasRefunded = callResult.gasRefunded,
                            .createdAddress = null,
                        } };
                    }
                } else if (input == .Call) {
                    if (frameResult == .Create) {
                        log.debug("Converting Create result to Call result", .{});
                        const createResult = frameResult.Create;
                        return frame.FrameResult{ .Call = .{
                            .status = createResult.status,
                            .returnData = createResult.returnData,
                            .gasUsed = createResult.gasUsed,
                            .gasRefunded = createResult.gasRefunded,
                        } };
                    }
                }

                return frameResult;
            },
            .Call => |callInput| {
                // In a real implementation, we would recursively handle the call
                // but for now we'll just return a success result
                log.debug("Got Call result", .{});
                if (callInput == .Call) {
                    log.debug("Call type: Call", .{});
                    return frame.FrameResult{ .Call = .{
                        .status = .Success,
                        .returnData = &[_]u8{},
                        .gasUsed = 0,
                        .gasRefunded = 0,
                    } };
                } else {
                    log.debug("Call type: Create", .{});
                    return frame.FrameResult{ .Create = .{
                        .status = .Success,
                        .returnData = &[_]u8{},
                        .gasUsed = 0,
                        .gasRefunded = 0,
                        .createdAddress = null,
                    } };
                }
            },
        }
        log.debug("FINISHED EVM.EXECUTE", .{});
    }
};

test "Evm.execute call" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var stateManager = frame.StateManager{};
    var evm = Evm.init(allocator, &stateManager);

    // Create a simple call input
    const input = frame.FrameInput{
        .Call = .{
            .callData = &[_]u8{},
            .gasLimit = 100000,
            .target = address.ZERO_ADDRESS,
            .codeAddress = address.ZERO_ADDRESS,
            .caller = address.ZERO_ADDRESS,
            .value = 0,
            .callType = .Call,
            .isStatic = false,
        },
    };

    // Mock code for testing
    stateManager.mockCode = &[_]u8{0x00}; // STOP opcode

    // Execute the frame
    const result = try evm.execute(input);

    // Verify result
    switch (result) {
        .Call => |callResult| {
            try std.testing.expectEqual(frame.InstructionResult.Success, callResult.status);
        },
        .Create => {
            try std.testing.expect(false); // We shouldn't get a Create result
        },
    }
}

test "Evm.execute create" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var stateManager = frame.StateManager{};
    var evm = Evm.init(allocator, &stateManager);

    // Create a contract creation input
    const input = frame.FrameInput{
        .Create = .{
            .initCode = &[_]u8{0x00}, // Simple STOP opcode
            .gasLimit = 100000,
            .caller = address.ZERO_ADDRESS,
            .value = 0,
            .salt = null, // Regular CREATE (not CREATE2)
        },
    };

    // Execute the frame
    const result = try evm.execute(input);

    // Verify result
    switch (result) {
        .Call => {
            try std.testing.expect(false); // We shouldn't get a Call result
        },
        .Create => |createResult| {
            try std.testing.expectEqual(frame.InstructionResult.Success, createResult.status);
        },
    }
}
