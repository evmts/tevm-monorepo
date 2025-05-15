const std = @import("std");
const frame = @import("frame.zig");

/// Tracing modes to control verbosity
pub const TraceMode = enum {
    /// No tracing
    None,
    /// Only trace executed instructions
    Instructions,
    /// Trace instructions, gas usage, and stack changes
    Detailed,
    /// Trace all operations including memory and storage
    Full,
};

/// Trace event types 
pub const TraceEventType = enum {
    InstructionStart,
    InstructionEnd,
    MemoryAccess,
    StorageAccess,
    StackOperation,
    CallStart,
    CallEnd,
    CreateStart,
    CreateEnd,
    Log,
    GasUpdate,
    Error,
};

/// Trace event data 
pub const TraceEvent = struct {
    /// Type of trace event
    event_type: TraceEventType,
    /// Timestamp in nanoseconds
    timestamp: u64,
    /// Program counter/instruction position
    pc: ?usize = null,
    /// Opcode (0x00-0xff)
    opcode: ?u8 = null,
    /// Gas used/remaining
    gas: ?struct {
        before: u64,
        after: u64,
    } = null,
    /// Depth in the call stack
    depth: ?u16 = null,
    /// Memory operation details
    memory_op: ?struct {
        offset: usize,
        size: usize,
        is_read: bool,
    } = null,
    /// Storage operation details
    storage_op: ?struct {
        key: u256,
        value: ?u256,
        is_read: bool,
    } = null,
    /// Stack operation details
    stack_op: ?struct {
        stack_size_before: usize,
        stack_size_after: usize,
        is_push: bool,
        values: ?[]const u256,
    } = null,
    /// Error information if any
    error_info: ?[]const u8 = null,
    /// Generic message for additional context
    message: ?[]const u8 = null,
};

/// Trace callback function type
pub const TraceCallbackFn = fn(event: TraceEvent) void;

/// Tracer configuration
pub const TracerConfig = struct {
    /// Tracing mode
    mode: TraceMode = .None,
    /// Whether to capture timing information
    capture_timing: bool = true,
    /// Function to call for each trace event
    callback: ?TraceCallbackFn = null,
    /// Optional file to write trace events to
    trace_file: ?std.fs.File = null,
    /// Maximum number of events to store in memory (0 = unlimited)
    max_events: usize = 0,
    /// Allocator for internal storage
    allocator: std.mem.Allocator,
};

/// EVM tracer for capturing execution details
pub const Tracer = struct {
    /// Tracer configuration
    config: TracerConfig,
    /// Stored trace events (if enabled)
    events: std.ArrayList(TraceEvent),
    /// Whether tracing is active
    active: bool = false,
    /// Timer for timing events
    timer: std.time.Timer,
    /// Current call depth
    current_depth: u16 = 0,
    /// Current program counter
    current_pc: usize = 0,
    /// Current opcode
    current_opcode: u8 = 0,
    /// Last gas remaining value
    last_gas: u64 = 0,

    /// Initialize a new tracer
    pub fn init(config: TracerConfig) !Tracer {
        return Tracer{
            .config = config,
            .events = std.ArrayList(TraceEvent).init(config.allocator),
            .timer = try std.time.Timer.start(),
        };
    }

    /// Deinitialize tracer and free resources
    pub fn deinit(self: *Tracer) void {
        // Free stored events
        for (self.events.items) |*event| {
            if (event.message) |msg| {
                self.config.allocator.free(msg);
            }
            if (event.error_info) |info| {
                self.config.allocator.free(info);
            }
            if (event.stack_op) |stack| {
                if (stack.values) |values| {
                    self.config.allocator.free(values);
                }
            }
        }
        self.events.deinit();
    }

    /// Start tracing (returns whether tracing is now active)
    pub fn start(self: *Tracer) bool {
        if (self.config.mode == .None) return false;
        
        self.active = true;
        self.current_depth = 0;
        self.current_pc = 0;
        self.current_opcode = 0;
        self.last_gas = 0;
        
        self.timer.reset();
        return true;
    }

    /// Stop tracing
    pub fn stop(self: *Tracer) void {
        self.active = false;
    }

    /// Clear all stored events
    pub fn clear(self: *Tracer) void {
        // First free any allocated memory in events
        for (self.events.items) |*event| {
            if (event.message) |msg| {
                self.config.allocator.free(msg);
            }
            if (event.error_info) |info| {
                self.config.allocator.free(info);
            }
            if (event.stack_op) |stack| {
                if (stack.values) |values| {
                    self.config.allocator.free(values);
                }
            }
        }
        
        // Then clear the list
        self.events.clearRetainingCapacity();
    }

    /// Trace an instruction start
    pub fn traceInstructionStart(
        self: *Tracer, 
        pc: usize, 
        opcode: u8, 
        gas_remaining: u64
    ) !void {
        if (!self.active or self.config.mode == .None) return;
        
        self.current_pc = pc;
        self.current_opcode = opcode;
        self.last_gas = gas_remaining;
        
        const event = TraceEvent{
            .event_type = .InstructionStart,
            .timestamp = self.timer.lap(),
            .pc = pc,
            .opcode = opcode,
            .gas = .{ .before = gas_remaining, .after = gas_remaining },
            .depth = self.current_depth,
        };
        
        try self.recordEvent(event);
    }

    /// Trace an instruction end
    pub fn traceInstructionEnd(
        self: *Tracer, 
        gas_remaining: u64
    ) !void {
        if (!self.active or self.config.mode == .None) return;
        
        const event = TraceEvent{
            .event_type = .InstructionEnd,
            .timestamp = self.timer.lap(),
            .pc = self.current_pc,
            .opcode = self.current_opcode,
            .gas = .{ .before = self.last_gas, .after = gas_remaining },
            .depth = self.current_depth,
        };
        
        try self.recordEvent(event);
        self.last_gas = gas_remaining;
    }

    /// Trace a memory access
    pub fn traceMemoryAccess(
        self: *Tracer, 
        offset: usize, 
        size: usize, 
        is_read: bool
    ) !void {
        if (!self.active or self.config.mode != .Full) return;
        
        const event = TraceEvent{
            .event_type = .MemoryAccess,
            .timestamp = self.timer.lap(),
            .pc = self.current_pc,
            .opcode = self.current_opcode,
            .depth = self.current_depth,
            .memory_op = .{
                .offset = offset,
                .size = size,
                .is_read = is_read,
            },
        };
        
        try self.recordEvent(event);
    }

    /// Trace a storage access
    pub fn traceStorageAccess(
        self: *Tracer, 
        key: u256, 
        value: ?u256, 
        is_read: bool
    ) !void {
        if (!self.active or self.config.mode != .Full) return;
        
        const event = TraceEvent{
            .event_type = .StorageAccess,
            .timestamp = self.timer.lap(),
            .pc = self.current_pc,
            .opcode = self.current_opcode,
            .depth = self.current_depth,
            .storage_op = .{
                .key = key,
                .value = value,
                .is_read = is_read,
            },
        };
        
        try self.recordEvent(event);
    }

    /// Trace a stack operation
    pub fn traceStackOperation(
        self: *Tracer,
        stack_before: []const u256,
        stack_after: []const u256,
        is_push: bool
    ) !void {
        if (!self.active or self.config.mode == .Instructions) return;
        
        // For detailed mode, we don't need to copy the whole stack
        var values: ?[]const u256 = null;
        
        if (self.config.mode == .Full) {
            // In full mode, capture the entire stack diff
            const diff_size = if (is_push) 
                stack_after.len - stack_before.len
            else 
                stack_before.len - stack_after.len;
                
            if (diff_size > 0) {
                var diff_values = try self.config.allocator.alloc(u256, diff_size);
                
                if (is_push) {
                    // Copy newly pushed values
                    const start_idx = stack_before.len;
                    for (0..diff_size) |i| {
                        diff_values[i] = stack_after[start_idx + i];
                    }
                } else {
                    // Copy popped values
                    const start_idx = stack_after.len;
                    for (0..diff_size) |i| {
                        diff_values[i] = stack_before[start_idx + i];
                    }
                }
                
                values = diff_values;
            }
        }
        
        const event = TraceEvent{
            .event_type = .StackOperation,
            .timestamp = self.timer.lap(),
            .pc = self.current_pc,
            .opcode = self.current_opcode,
            .depth = self.current_depth,
            .stack_op = .{
                .stack_size_before = stack_before.len,
                .stack_size_after = stack_after.len,
                .is_push = is_push,
                .values = values,
            },
        };
        
        try self.recordEvent(event);
    }

    /// Trace a call start
    pub fn traceCallStart(
        self: *Tracer,
        input: frame.FrameInput
    ) !void {
        if (!self.active or self.config.mode == .None) return;
        
        var msg_buf: [128]u8 = undefined;
        const msg = switch (input) {
            .Call => |call| blk: {
                const addr = std.fmt.bufPrintZ(&msg_buf, "CALL to {any}", .{call.target}) catch "CALL";
                break :blk try self.config.allocator.dupe(u8, addr);
            },
            .Create => blk: {
                const create_msg = "CREATE contract";
                break :blk try self.config.allocator.dupe(u8, create_msg);
            },
        };
        
        const event = TraceEvent{
            .event_type = .CallStart,
            .timestamp = self.timer.lap(),
            .pc = self.current_pc,
            .depth = self.current_depth,
            .message = msg,
        };
        
        self.current_depth += 1;
        try self.recordEvent(event);
    }

    /// Trace a call end
    pub fn traceCallEnd(
        self: *Tracer,
        result: frame.FrameResult
    ) !void {
        if (!self.active or self.config.mode == .None) return;
        
        if (self.current_depth > 0) {
            self.current_depth -= 1;
        }
        
        var msg_buf: [128]u8 = undefined;
        const msg = switch (result) {
            .Call => |call| blk: {
                const status_str = switch (call.status) {
                    .Success => "success",
                    .Revert => "reverted",
                    else => "failed",
                };
                const status = std.fmt.bufPrintZ(
                    &msg_buf, 
                    "CALL ended with {s}, gas used: {d}", 
                    .{status_str, call.gasUsed}
                ) catch "CALL ended";
                break :blk try self.config.allocator.dupe(u8, status);
            },
            .Create => |create| blk: {
                const addr_str = if (create.createdAddress) |addr|
                    std.fmt.bufPrintZ(&msg_buf, "CREATE ended, address: {any}", .{addr}) catch "CREATE ended"
                else
                    "CREATE failed";
                break :blk try self.config.allocator.dupe(u8, addr_str);
            },
        };
        
        const event = TraceEvent{
            .event_type = .CallEnd,
            .timestamp = self.timer.lap(),
            .depth = self.current_depth,
            .message = msg,
        };
        
        try self.recordEvent(event);
    }

    /// Trace gas usage
    pub fn traceGasUpdate(
        self: *Tracer, 
        gas_used: u64, 
        gas_remaining: u64
    ) !void {
        if (!self.active or self.config.mode == .Instructions) return;
        
        const event = TraceEvent{
            .event_type = .GasUpdate,
            .timestamp = self.timer.lap(),
            .pc = self.current_pc,
            .gas = .{ .before = gas_used + gas_remaining, .after = gas_remaining },
            .depth = self.current_depth,
        };
        
        try self.recordEvent(event);
    }

    /// Trace an error
    pub fn traceError(
        self: *Tracer, 
        err: anyerror, 
        message: ?[]const u8
    ) !void {
        if (!self.active) return;
        
        var err_buf: [256]u8 = undefined;
        const err_str = std.fmt.bufPrintZ(&err_buf, "Error: {s}", .{@errorName(err)}) catch "Error";
        
        const err_info = try self.config.allocator.dupe(u8, err_str);
        const msg_copy = if (message) |msg| 
            try self.config.allocator.dupe(u8, msg) 
        else 
            null;
        
        const event = TraceEvent{
            .event_type = .Error,
            .timestamp = self.timer.lap(),
            .pc = self.current_pc,
            .depth = self.current_depth,
            .error_info = err_info,
            .message = msg_copy,
        };
        
        try self.recordEvent(event);
    }

    /// Internal method to record an event
    fn recordEvent(self: *Tracer, event: TraceEvent) !void {
        // Call callback if registered
        if (self.config.callback) |callback| {
            callback(event);
        }
        
        // Write to file if configured
        if (self.config.trace_file) |file| {
            var buf: [1024]u8 = undefined;
            const fmt_result = try std.fmt.bufPrint(
                &buf, 
                "{d},{},{d},{d},{any}\n", 
                .{
                    event.timestamp,
                    @tagName(event.event_type),
                    event.pc orelse 0,
                    event.depth orelse 0,
                    event.opcode orelse 0
                }
            );
            _ = try file.write(fmt_result);
        }
        
        // Store in memory if max_events is not 0
        if (self.config.max_events == 0 or self.events.items.len < self.config.max_events) {
            try self.events.append(event);
        }
    }

    /// Generate and return a human-readable trace report
    pub fn generateReport(self: *const Tracer, allocator: std.mem.Allocator) ![]const u8 {
        var output = std.ArrayList(u8).init(allocator);
        defer output.deinit();
        
        const writer = output.writer();
        
        try writer.print("EVM Execution Trace Report\n", .{});
        try writer.print("=========================\n\n", .{});
        try writer.print("Total events: {d}\n", .{self.events.items.len});
        
        if (self.events.items.len == 0) {
            try writer.print("No trace events recorded.\n", .{});
            return try output.toOwnedSlice();
        }
        
        // Calculate total execution time
        const start_time = self.events.items[0].timestamp;
        const end_time = self.events.items[self.events.items.len - 1].timestamp;
        const total_time_ns = end_time - start_time;
        const total_time_ms = @as(f64, @floatFromInt(total_time_ns)) / 1_000_000.0;
        
        try writer.print("Execution time: {d:.2} ms\n\n", .{total_time_ms});
        
        // Count instruction types
        var opcode_counts = std.AutoHashMap(u8, usize).init(allocator);
        defer opcode_counts.deinit();
        
        var total_gas_used: u64 = 0;
        
        for (self.events.items) |event| {
            if (event.event_type == .InstructionStart and event.opcode != null) {
                const opcode = event.opcode.?;
                const entry = try opcode_counts.getOrPut(opcode);
                if (!entry.found_existing) {
                    entry.value_ptr.* = 0;
                }
                entry.value_ptr.* += 1;
            }
            
            if (event.event_type == .InstructionEnd and event.gas != null) {
                const gas_info = event.gas.?;
                total_gas_used += (gas_info.before - gas_info.after);
            }
        }
        
        try writer.print("Total gas used: {d}\n\n", .{total_gas_used});
        
        // Print instruction distribution
        try writer.print("Instruction Distribution:\n", .{});
        try writer.print("------------------------\n", .{});
        
        var opcode_iter = opcode_counts.iterator();
        var opcodes = std.ArrayList(struct { opcode: u8, count: usize }).init(allocator);
        defer opcodes.deinit();
        
        while (opcode_iter.next()) |entry| {
            try opcodes.append(.{ .opcode = entry.key_ptr.*, .count = entry.value_ptr.* });
        }
        
        // Sort by frequency (most common first)
        std.sort.heap(
            struct { opcode: u8, count: usize },
            opcodes.items,
            {},
            struct {
                fn lessThan(_: void, a: struct { opcode: u8, count: usize }, b: struct { opcode: u8, count: usize }) bool {
                    return a.count > b.count; // Sort in descending order
                }
            }.lessThan,
        );
        
        // Print top opcodes
        const top_count = @min(opcodes.items.len, 10);
        for (0..top_count) |i| {
            const entry = opcodes.items[i];
            try writer.print("  0x{X:0>2}: {d} times\n", .{entry.opcode, entry.count});
        }
        
        return try output.toOwnedSlice();
    }
};

test "tracer basic operation" {
    const allocator = std.testing.allocator;
    
    var tracer = try Tracer.init(.{
        .mode = .Full,
        .allocator = allocator,
        .max_events = 100,
    });
    defer tracer.deinit();
    
    _ = tracer.start();
    try tracer.traceInstructionStart(0, 0x60, 1000); // PUSH1
    try tracer.traceInstructionEnd(995);
    
    try tracer.traceInstructionStart(2, 0x01, 995); // ADD
    try tracer.traceInstructionEnd(992);
    
    try std.testing.expectEqual(@as(usize, 2), tracer.events.items.len);
}