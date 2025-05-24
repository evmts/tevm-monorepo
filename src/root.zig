const std = @import("std");

pub const evm = @import("evm");
pub const utils = @import("Utils");

pub const EvmState = extern struct {
    pc: u32 = 0,
    opcode: [*c]const u8 = null,
    opcode_len: usize = 0,
    gasLeft: u64 = 0,
    depth: u32 = 0,
    stack: [*c][*c]const u8 = null,
    stack_lengths: [*c]usize = null,
    stack_count: usize = 0,
    memory: [*c]const u8 = null,
    memory_len: usize = 0,
    storage_keys: [*c][*c]const u8 = null,
    storage_key_lengths: [*c]usize = null,
    storage_values: [*c][*c]const u8 = null,
    storage_value_lengths: [*c]usize = null,
    storage_count: usize = 0,
    logs: [*c][*c]const u8 = null,
    logs_lengths: [*c]usize = null,
    logs_count: usize = 0,
    returnData: [*c]const u8 = null,
    returnData_len: usize = 0,
};

export fn keccak256(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) void {
    const input = input_ptr[0..input_len];
    const output = output_ptr[0..32];
    std.crypto.hash.sha3.Keccak256.hash(input, output, .{});
}

export fn loadBytecode(bytecode_hex_ptr: [*]const u8, bytecode_hex_len: usize) void {
    const bytecode_hex = bytecode_hex_ptr[0..bytecode_hex_len];
    _ = bytecode_hex;
}

export fn resetEvm() void {
    // TODO: Implement EVM reset functionality
}

export fn stepEvm(state_ptr: [*]u8, state_len: *usize) void {
    const state_json = "{}";
    const json_bytes = state_json.len;

    if (json_bytes <= state_len.*) {
        @memcpy(state_ptr[0..json_bytes], state_json);
        state_len.* = json_bytes;
    } else {
        state_len.* = 0;
    }
}

export fn toggleRunPause(state_ptr: [*]u8, state_len: *usize) void {
    const state_json = "{}";
    const json_bytes = state_json.len;

    if (json_bytes <= state_len.*) {
        @memcpy(state_ptr[0..json_bytes], state_json);
        state_len.* = json_bytes;
    } else {
        state_len.* = 0;
    }
}

export fn getEvmState(state_ptr: [*]u8, state_len: *usize) void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    var allocator = gpa.allocator();
    errdefer gpa.deinit();

    var state = EvmState{
        .pc = 42,
        .gasLeft = 100000,
        .depth = 1,
    };

    const allocStr = struct {
        fn func(alloc: std.mem.Allocator, str: []const u8) ![*c]const u8 {
            const buf = try alloc.alloc(u8, str.len);
            @memcpy(buf, str);
            return @ptrCast(buf.ptr);
        }
    }.func;

    const opcode = "PUSH1";
    state.opcode = allocStr(allocator, opcode) catch {
        state_len.* = 0;
        return;
    };
    state.opcode_len = opcode.len;

    const stack_items = [_][]const u8{
        "0x0000000000000000000000000000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000000000000000000000000000002",
    };

    const stack_count = stack_items.len;
    var stack_ptrs = allocator.alloc([*c]const u8, stack_count) catch {
        state_len.* = 0;
        return;
    };

    var stack_lens = allocator.alloc(usize, stack_count) catch {
        state_len.* = 0;
        return;
    };

    for (stack_items, 0..) |item, i| {
        stack_ptrs[i] = allocStr(allocator, item) catch {
            state_len.* = 0;
            return;
        };
        stack_lens[i] = item.len;
    }

    state.stack = @ptrCast(stack_ptrs.ptr);
    state.stack_lengths = @ptrCast(stack_lens.ptr);
    state.stack_count = stack_count;

    const memory = "0x0000000000000000000000000000000000000000000000000000000000000000";
    state.memory = allocStr(allocator, memory) catch {
        state_len.* = 0;
        return;
    };
    state.memory_len = memory.len;

    const storage_pairs = [_]struct { key: []const u8, value: []const u8 }{
        .{
            .key = "0x0000000000000000000000000000000000000000000000000000000000000001",
            .value = "0x0000000000000000000000000000000000000000000000000000000000000010",
        },
        .{
            .key = "0x0000000000000000000000000000000000000000000000000000000000000002",
            .value = "0x0000000000000000000000000000000000000000000000000000000000000020",
        },
    };

    const storage_count = storage_pairs.len;
    var storage_key_ptrs = allocator.alloc([*c]const u8, storage_count) catch {
        state_len.* = 0;
        return;
    };

    var storage_key_lens = allocator.alloc(usize, storage_count) catch {
        state_len.* = 0;
        return;
    };

    var storage_value_ptrs = allocator.alloc([*c]const u8, storage_count) catch {
        state_len.* = 0;
        return;
    };

    var storage_value_lens = allocator.alloc(usize, storage_count) catch {
        state_len.* = 0;
        return;
    };

    for (storage_pairs, 0..) |pair, i| {
        storage_key_ptrs[i] = allocStr(allocator, pair.key) catch {
            state_len.* = 0;
            return;
        };
        storage_key_lens[i] = pair.key.len;

        storage_value_ptrs[i] = allocStr(allocator, pair.value) catch {
            state_len.* = 0;
            return;
        };
        storage_value_lens[i] = pair.value.len;
    }

    state.storage_keys = @ptrCast(storage_key_ptrs.ptr);
    state.storage_key_lengths = @ptrCast(storage_key_lens.ptr);
    state.storage_values = @ptrCast(storage_value_ptrs.ptr);
    state.storage_value_lengths = @ptrCast(storage_value_lens.ptr);
    state.storage_count = storage_count;

    const logs = [_][]const u8{
        "{\"address\":\"0x1234...\",\"topics\":[\"0xabcd...\"],\"data\":\"0x0000...\"}",
    };

    const logs_count = logs.len;
    var logs_ptrs = allocator.alloc([*c]const u8, logs_count) catch {
        state_len.* = 0;
        return;
    };

    var logs_lens = allocator.alloc(usize, logs_count) catch {
        state_len.* = 0;
        return;
    };

    for (logs, 0..) |log, i| {
        logs_ptrs[i] = allocStr(allocator, log) catch {
            state_len.* = 0;
            return;
        };
        logs_lens[i] = log.len;
    }

    state.logs = @ptrCast(logs_ptrs.ptr);
    state.logs_lengths = @ptrCast(logs_lens.ptr);
    state.logs_count = logs_count;

    const return_data = "0x";
    state.returnData = allocStr(allocator, return_data) catch {
        state_len.* = 0;
        return;
    };
    state.returnData_len = return_data.len;

    const state_size = @sizeOf(EvmState);
    if (state_size <= state_len.*) {
        const state_bytes: [*]const u8 = @ptrCast(&state);
        @memcpy(state_ptr[0..state_size], state_bytes[0..state_size]);
        state_len.* = state_size;
    } else {
        state_len.* = 0;
    }
}
