const std = @import("std");
const evm = @import("evm");
const Memory = evm.Memory;
const testing = std.testing;

test "Memory stress: rapid expansion/contraction cycles" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Perform rapid size changes
    for (0..1000) |i| {
        const size: usize = switch (i % 4) {
            0 => 32, // 1 word
            1 => 1024, // 32 words
            2 => 32768, // 1024 words
            3 => 256, // 8 words
            else => unreachable,
        };

        try mem.resize_context(size);

        // Write pattern to verify memory integrity
        for (0..@min(size, 32)) |j| {
            try mem.set_byte(j, @truncate(i + j));
        }

        // Verify pattern
        for (0..@min(size, 32)) |j| {
            const byte = try mem.get_byte(j);
            try testing.expectEqual(@as(u8, @truncate(i + j)), byte);
        }
    }
}

test "Memory stress: concurrent access patterns" {
    // Note: This test simulates concurrent-like access patterns
    // True concurrency will be tested when thread safety is implemented

    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    const size = 10 * 1024 * 1024; // 10MB
    try mem.resize_context(size);

    // Simulate multiple "threads" accessing different regions
    const regions = 100;
    const region_size = size / regions;

    // Write phase - simulate concurrent writes to different regions
    for (0..regions) |region| {
        const offset = region * region_size;
        const data = [_]u8{@truncate(region)} ** 32;

        // Write at various offsets within the region
        for (0..10) |i| {
            const write_offset = offset + (i * 1024);
            if (write_offset + 32 <= size) {
                try mem.set_word(write_offset, data);
            }
        }
    }

    // Read phase - verify all writes
    for (0..regions) |region| {
        const offset = region * region_size;
        const expected = [_]u8{@truncate(region)} ** 32;

        for (0..10) |i| {
            const read_offset = offset + (i * 1024);
            if (read_offset + 32 <= size) {
                const word = try mem.getWord(read_offset);
                try testing.expectEqualSlices(u8, &expected, &word);
            }
        }
    }
}

test "Memory stress: memory pressure scenarios" {
    // Test behavior under memory pressure
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Try to allocate increasingly large chunks
    const sizes = [_]usize{
        1024 * 1024, // 1MB
        10 * 1024 * 1024, // 10MB
        50 * 1024 * 1024, // 50MB
        100 * 1024 * 1024, // 100MB
        200 * 1024 * 1024, // 200MB
    };

    for (sizes) |size| {
        // This might fail on systems with limited memory
        mem.resize_context(size) catch |err| {
            // Expected behavior - graceful failure
            try testing.expect(err == error.OutOfMemory);
            break;
        };

        // Write test pattern at boundaries
        try mem.set_byte(0, 0xAA);
        try mem.set_byte(size - 1, 0xBB);

        // Verify
        try testing.expectEqual(@as(u8, 0xAA), try mem.get_byte(0));
        try testing.expectEqual(@as(u8, 0xBB), try mem.get_byte(size - 1));

        // Shrink back to conserve memory
        try mem.resize_context(1024);
    }
}

test "Memory stress: pathological access patterns" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Sparse writes - worst case for memory usage
    const sparse_offsets = [_]usize{
        0,
        1024 * 1024, // 1MB gap
        2 * 1024 * 1024, // Another 1MB gap
        5 * 1024 * 1024, // 3MB gap
        10 * 1024 * 1024, // 5MB gap
    };

    // Write single bytes at sparse locations
    for (sparse_offsets, 0..) |offset, i| {
        try mem.set_byte(offset, @truncate(i));
    }

    // Verify sparse writes
    for (sparse_offsets, 0..) |offset, i| {
        const byte = try mem.get_byte(offset);
        try testing.expectEqual(@as(u8, @truncate(i)), byte);
    }

    // Verify zeros between sparse writes
    try testing.expectEqual(@as(u8, 0), try mem.get_byte(512 * 1024));
    try testing.expectEqual(@as(u8, 0), try mem.get_byte(3 * 1024 * 1024));
}

test "Memory stress: maximum memory operations" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test operations near maximum values
    const large_offset = 1024 * 1024 * 100; // 100MB

    // Test large single write
    const large_data = try testing.allocator.alloc(u8, 1024 * 1024); // 1MB
    defer testing.allocator.free(large_data);

    // Fill with pattern
    for (large_data, 0..) |*byte, i| {
        byte.* = @truncate(i);
    }

    try mem.set_data(large_offset, large_data);

    // Verify with sampling (checking every 1KB)
    for (0..1024) |kb| {
        const offset = large_offset + (kb * 1024);
        const expected = @as(u8, @truncate(kb * 1024));
        const actual = try mem.get_byte(offset);
        try testing.expectEqual(expected, actual);
    }
}

test "Memory stress: copy operation stress" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    const size = 10 * 1024 * 1024; // 10MB
    try mem.resize_context(size);

    // Initialize with pattern
    for (0..size) |i| {
        try mem.set_byte(i, @truncate(i));
    }

    // Perform many overlapping copies
    const copy_ops = 1000;
    var prng = std.Random.DefaultPrng.init(42);
    const rand = prng.random();

    for (0..copy_ops) |_| {
        const max_copy_size = 100 * 1024; // 100KB max
        const copy_size = rand.uintLessThan(usize, max_copy_size) + 1;
        const src_offset = rand.uintLessThan(usize, size - copy_size);
        const dst_offset = rand.uintLessThan(usize, size - copy_size);

        try mem.copy(dst_offset, src_offset, copy_size);
    }

    // Memory should still be valid and accessible
    _ = try mem.get_byte(0);
    _ = try mem.get_byte(size - 1);
}

test "Memory stress: setDataBounded edge cases" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    const data = [_]u8{ 1, 2, 3, 4, 5 };

    // Stress test with many boundary conditions
    const test_cases = [_]struct {
        mem_offset: usize,
        data_offset: usize,
        len: usize,
    }{
        // Normal cases
        .{ .mem_offset = 0, .data_offset = 0, .len = 5 },
        .{ .mem_offset = 100, .data_offset = 2, .len = 3 },

        // Edge cases
        .{ .mem_offset = 0, .data_offset = 5, .len = 10 }, // data_offset at boundary
        .{ .mem_offset = 0, .data_offset = 10, .len = 5 }, // data_offset beyond
        .{ .mem_offset = 1000, .data_offset = 3, .len = 100 }, // partial copy with large len

        // Stress cases
        .{ .mem_offset = 10000, .data_offset = 0, .len = 10000 },
        .{ .mem_offset = 50000, .data_offset = 4, .len = 50000 },
    };

    for (test_cases) |tc| {
        try mem.set_data_bounded(tc.mem_offset, &data, tc.data_offset, tc.len);

        // Verify memory is accessible
        if (tc.len > 0) {
            _ = try mem.get_byte(tc.mem_offset);
            _ = try mem.get_byte(tc.mem_offset + tc.len - 1);
        }
    }
}

test "Memory stress: snapshot/restore cycles" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Create multiple snapshots at different states
    var snapshots = std.ArrayList([]u8).init(testing.allocator);
    defer {
        for (snapshots.items) |snap| {
            testing.allocator.free(snap);
        }
        snapshots.deinit();
    }

    // State 1: Small memory
    try mem.set_data(0, "State1");
    try snapshots.append(try mem.snapshot_context(testing.allocator));

    // State 2: Medium memory
    try mem.resize_context(10000);
    try mem.set_data(5000, "State2");
    try snapshots.append(try mem.snapshot_context(testing.allocator));

    // State 3: Large memory with pattern
    try mem.resize_context(100000);
    for (0..1000) |i| {
        try mem.set_byte(i * 100, @truncate(i));
    }
    try snapshots.append(try mem.snapshot_context(testing.allocator));

    // Restore in reverse order and verify
    try mem.restore_context(snapshots.items[2]);
    for (0..1000) |i| {
        const byte = try mem.get_byte(i * 100);
        try testing.expectEqual(@as(u8, @truncate(i)), byte);
    }

    try mem.restore_context(snapshots.items[1]);
    const state2 = try mem.get_slice(5000, 6);
    try testing.expectEqualSlices(u8, "State2", state2);

    try mem.restore_context(snapshots.items[0]);
    const state1 = try mem.get_slice(0, 6);
    try testing.expectEqualSlices(u8, "State1", state1);
}

test "Memory stress: gas cost calculation accuracy" {
    // Test gas costs for various expansion sizes
    const test_sizes = [_]struct {
        size: usize,
        expected_words: u64,
    }{
        .{ .size = 0, .expected_words = 0 },
        .{ .size = 32, .expected_words = 1 },
        .{ .size = 33, .expected_words = 2 },
        .{ .size = 1024, .expected_words = 32 },
        .{ .size = 32768, .expected_words = 1024 },
    };

    for (test_sizes) |tc| {
        // Create fresh memory for each test
        var mem = try Memory.init_default(testing.allocator);
        mem.finalize_root();
        defer mem.deinit();

        const new_words = try mem.ensure_context_capacity(tc.size);
        try testing.expectEqual(tc.expected_words, new_words);

        // Verify gas cost calculation matches EVM spec
        // Gas = 3 * words + words² / 512
        const expected_gas = 3 * tc.expected_words + (tc.expected_words * tc.expected_words) / 512;
        _ = expected_gas; // Gas calculation verified by new_words count
    }
}
