const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Memory = evm.Memory;
const memory_limits = evm.memory_limits;

test "Memory limit enforcement - default limit" {
    const allocator = testing.allocator;
    
    // Create memory with default limit (32 MB)
    var memory = try Memory.init_default(allocator);
    defer memory.deinit();
    memory.finalize_root();
    
    // Verify default limit is set correctly
    try testing.expectEqual(Memory.DefaultMemoryLimit, memory.get_memory_limit());
    try testing.expectEqual(@as(u64, 32 * 1024 * 1024), memory.get_memory_limit());
}

test "Memory limit enforcement - custom limit" {
    const allocator = testing.allocator;
    
    // Create memory with custom 1 MB limit
    const custom_limit: u64 = 1 * 1024 * 1024;
    var memory = try Memory.init(allocator, Memory.InitialCapacity, custom_limit);
    defer memory.deinit();
    memory.finalize_root();
    
    // Verify custom limit is set
    try testing.expectEqual(custom_limit, memory.get_memory_limit());
    
    // Try to allocate within limit - should succeed
    try memory.resize_context(512 * 1024); // 512 KB
    try testing.expectEqual(@as(usize, 512 * 1024), memory.context_size());
    
    // Try to allocate beyond limit - should fail
    const result = memory.resize_context(2 * 1024 * 1024); // 2 MB
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, result);
}

test "Memory limit enforcement - ensure_context_capacity" {
    const allocator = testing.allocator;
    
    // Create memory with 100 KB limit
    const limit: u64 = 100 * 1024;
    var memory = try Memory.init(allocator, 1024, limit);
    defer memory.deinit();
    memory.finalize_root();
    
    // Ensure capacity within limit - should succeed
    const words_added = try memory.ensure_context_capacity(50 * 1024);
    try testing.expect(words_added > 0);
    
    // Ensure capacity beyond limit - should fail
    const result = memory.ensure_context_capacity(200 * 1024);
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, result);
}

test "Memory limit enforcement - child contexts inherit limit" {
    const allocator = testing.allocator;
    
    // Create root with custom limit
    const limit: u64 = 1 * 1024 * 1024; // 1 MB
    var root = try Memory.init(allocator, 1024, limit);
    defer root.deinit();
    root.finalize_root();
    
    // Create child context
    var child = try root.new_child_context();
    
    // Child should inherit the same limit
    try testing.expectEqual(limit, child.get_memory_limit());
    
    // Child allocation beyond limit should fail
    const result = child.resize_context(2 * 1024 * 1024);
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, result);
}

test "Memory limit enforcement - set_memory_limit" {
    const allocator = testing.allocator;
    
    var memory = try Memory.init_default(allocator);
    defer memory.deinit();
    memory.finalize_root();
    
    // Change memory limit
    const new_limit: u64 = 16 * 1024 * 1024; // 16 MB
    memory.set_memory_limit(new_limit);
    
    // Verify new limit
    try testing.expectEqual(new_limit, memory.get_memory_limit());
    
    // Allocate within new limit
    try memory.resize_context(8 * 1024 * 1024); // 8 MB
    
    // Allocate beyond new limit - should fail
    const result = memory.resize_context(20 * 1024 * 1024); // 20 MB
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, result);
}

test "Memory limit enforcement - data operations respect limit" {
    const allocator = testing.allocator;
    
    // Small limit for testing
    const limit: u64 = 1024;
    var memory = try Memory.init(allocator, 256, limit);
    defer memory.deinit();
    memory.finalize_root();
    
    // set_byte beyond limit
    const byte_result = memory.set_byte(2000, 0xFF);
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, byte_result);
    
    // set_word beyond limit
    const word_result = memory.set_word(1000, [_]u8{0} ** 32);
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, word_result);
    
    // set_data beyond limit
    const data = [_]u8{1, 2, 3, 4, 5};
    const data_result = memory.set_data(1020, &data);
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, data_result);
}

test "Memory limit enforcement - copy operations respect limit" {
    const allocator = testing.allocator;
    
    const limit: u64 = 1024;
    var memory = try Memory.init(allocator, 256, limit);
    defer memory.deinit();
    memory.finalize_root();
    
    // First allocate some data
    try memory.resize_context(512);
    
    // Copy that would require expansion beyond limit
    const result = memory.copy(800, 0, 256);
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, result);
}

test "Memory limit enforcement - reasonable gas costs" {
    const allocator = testing.allocator;
    
    var memory = try Memory.init_default(allocator);
    defer memory.deinit();
    memory.finalize_root();
    
    // Calculate gas costs for various sizes
    const kb_gas = memory_limits.calculate_memory_gas_cost(1024);
    const mb_gas = memory_limits.calculate_memory_gas_cost(1024 * 1024);
    const limit_gas = memory_limits.calculate_memory_gas_cost(Memory.DefaultMemoryLimit);
    
    // 1 KB should be cheap
    try testing.expect(kb_gas < 1000);
    
    // 1 MB should be expensive but feasible
    try testing.expect(mb_gas > 100_000);
    try testing.expect(mb_gas < 10_000_000);
    
    // 32 MB (default limit) should be prohibitively expensive
    try testing.expect(limit_gas > 1_000_000_000);
}

test "Memory limit enforcement - prevents DoS attacks" {
    const allocator = testing.allocator;
    
    // Even with "unlimited" memory, gas costs prevent abuse
    var memory = try Memory.init(allocator, 1024, std.math.maxInt(u64));
    defer memory.deinit();
    memory.finalize_root();
    
    // Set a reasonable limit
    memory.set_memory_limit(Memory.DefaultMemoryLimit);
    
    // Attempting to allocate huge amounts should fail
    const huge_size = 1024 * 1024 * 1024; // 1 GB
    const result = memory.resize_context(huge_size);
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, result);
}