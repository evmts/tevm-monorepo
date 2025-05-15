const std = @import("std");
const evm = @import("evm.zig");
const frame = @import("frame.zig");
const address = @import("Address");
const tracer = @import("tracer.zig");

// Sample bytecode that exercises different parts of the EVM
const test_bytecode = [_]u8{
    0x60, 0x20, // PUSH1 32 (value to store)
    0x60, 0x00, // PUSH1 0 (position in memory)
    0x52,       // MSTORE
    0x60, 0x01, // PUSH1 1
    0x60, 0x02, // PUSH1 2
    0x01,       // ADD
    0x60, 0x00, // PUSH1 0
    0x55,       // SSTORE (store value 3 at storage position 0)
    0x60, 0x20, // PUSH1 32
    0x60, 0x00, // PUSH1 0
    0x51,       // MLOAD
    0x60, 0x00, // PUSH1 0
    0x54,       // SLOAD
    0x00,       // STOP
};

pub fn main() !void {
    // Setup allocator
    var general_purpose_allocator = std.heap.GeneralPurposeAllocator(.{}){};
    const gpa = general_purpose_allocator.allocator();
    defer _ = general_purpose_allocator.deinit();

    // Setup trace file (optional)
    const trace_file = std.fs.cwd().createFile(
        "evm_trace.csv",
        .{ .read = true, .truncate = true },
    ) catch null;
    defer if (trace_file) |*file| file.close();

    // Create a tracer
    var evm_tracer = try tracer.Tracer.init(.{
        .mode = .Full,
        .allocator = gpa,
        .trace_file = trace_file,
        .callback = traceEventCallback,
    });
    defer evm_tracer.deinit();

    // Start the tracer
    _ = evm_tracer.start();

    // Create state manager (mock for example)
    var state_manager = FrameStateManager{ .tracer = &evm_tracer };

    // Setup EVM
    var vm = evm.Evm.init(gpa, &state_manager);

    // Run a test execution
    std.debug.print("Running EVM execution with tracing enabled...\n", .{});

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

    // Set mock code for execution
    state_manager.mockCode = &test_bytecode;

    // Execute
    _ = try vm.execute(input);

    // Stop tracing
    evm_tracer.stop();

    // Generate and print trace report
    const report = try evm_tracer.generateReport(gpa);
    defer gpa.free(report);

    std.debug.print("\n{s}\n", .{report});
    std.debug.print("\nFull trace written to evm_trace.csv\n", .{});
}

// Callback function for trace events
fn traceEventCallback(event: tracer.TraceEvent) void {
    switch (event.event_type) {
        .InstructionStart => {
            if (event.opcode) |opcode| {
                std.debug.print("EXEC [0x{X:0>2}] @ pc={d}\n", .{opcode, event.pc.?});
            }
        },
        .Error => {
            if (event.error_info) |info| {
                std.debug.print("ERROR: {s}\n", .{info});
            }
        },
        else => {}, // Ignore other events in this example
    }
}

// Extended StateManager for tracing
const FrameStateManager = struct {
    tracer: *tracer.Tracer,
    mockCode: []const u8 = &[_]u8{},

    // Actual state manager methods (minimal implementation for example)
    pub fn checkpoint(self: *FrameStateManager) usize {
        return 0;
    }

    pub fn commit(self: *FrameStateManager, _: usize) !void {}

    pub fn revert(self: *FrameStateManager, _: usize) !void {}

    pub fn loadCode(self: *FrameStateManager, _: address.Address) ![]const u8 {
        return self.mockCode;
    }

    pub fn loadAccount(self: *FrameStateManager, _: address.Address) !?frame.Account {
        return frame.Account{
            .balance = 0,
            .nonce = 0,
        };
    }

    pub fn getStorage(self: *FrameStateManager, _: address.Address, key: u256) !u256 {
        // Trace the storage access
        _ = try self.tracer.traceStorageAccess(key, null, true);
        return 0;
    }

    pub fn setStorage(self: *FrameStateManager, _: address.Address, key: u256, value: u256) !void {
        // Trace the storage write
        _ = try self.tracer.traceStorageAccess(key, value, false);
    }
};