const std = @import("std");
const testing = std.testing;
const BitVec = @import("evm").BitVec;
const constants = @import("evm").constants;
const analyzeCode = @import("evm").analyzeCode;
const analyzeJumpdests = @import("evm").analyzeJumpdests;
const analyzeBytecode = @import("evm").analyzeBytecode;
const PaddedAnalysis = @import("evm").PaddedAnalysis;
const analyzeWithPadding = @import("evm").analyzeWithPadding;

// Helper to create test bytecode
fn createBytecode(comptime opcodes: []const u8) []const u8 {
    return opcodes;
}

test "BitVec: initialization and basic operations" {
    const allocator = testing.allocator;
    
    // Test zero-size BitVec
    {
        var bv = try BitVec.init(allocator, 0);
        defer bv.deinit(allocator);
        try testing.expectEqual(@as(usize, 0), bv.bit_count);
        try testing.expectEqual(@as(usize, 0), bv.chunk_count);
        try testing.expect(!bv.isSet(0));
    }
    
    // Test small BitVec
    {
        var bv = try BitVec.init(allocator, 100);
        defer bv.deinit(allocator);
        
        try testing.expectEqual(@as(usize, 100), bv.bit_count);
        try testing.expectEqual(@as(usize, 2), bv.chunk_count); // 100 bits needs 2 u64s
        
        // Initially all bits should be 0
        for (0..100) |i| {
            try testing.expect(!bv.isSet(i));
        }
        
        // Set some bits
        bv.set(0);
        bv.set(63);
        bv.set(64);
        bv.set(99);
        
        try testing.expect(bv.isSet(0));
        try testing.expect(bv.isSet(63));
        try testing.expect(bv.isSet(64));
        try testing.expect(bv.isSet(99));
        try testing.expect(!bv.isSet(1));
        try testing.expect(!bv.isSet(50));
        
        // Clear some bits
        bv.clear(0);
        bv.clear(64);
        
        try testing.expect(!bv.isSet(0));
        try testing.expect(bv.isSet(63));
        try testing.expect(!bv.isSet(64));
        try testing.expect(bv.isSet(99));
    }
}

test "BitVec: static buffer initialization" {
    const allocator = testing.allocator;
    
    // Test with static buffer (no allocation)
    {
        var buffer: [2]u64 = undefined;
        var bv = try BitVec.initStatic(&buffer, 100, allocator);
        defer bv.deinit(allocator);
        
        try testing.expect(!bv.owns_memory);
        try testing.expectEqual(@as(usize, 100), bv.bit_count);
        
        // Should work the same as dynamic allocation
        bv.set(50);
        try testing.expect(bv.isSet(50));
    }
    
    // Test fallback to dynamic allocation for large sizes
    {
        var small_buffer: [1]u64 = undefined;
        var bv = try BitVec.initStatic(&small_buffer, 1000, allocator);
        defer bv.deinit(allocator);
        
        try testing.expect(bv.owns_memory); // Should have allocated
        try testing.expectEqual(@as(usize, 1000), bv.bit_count);
    }
}

test "BitVec: boundary conditions" {
    const allocator = testing.allocator;
    var bv = try BitVec.init(allocator, 128);
    defer bv.deinit(allocator);
    
    // Test operations at chunk boundaries
    bv.set(0);    // First bit of first chunk
    bv.set(63);   // Last bit of first chunk
    bv.set(64);   // First bit of second chunk
    bv.set(127);  // Last bit of second chunk
    
    try testing.expect(bv.isSet(0));
    try testing.expect(bv.isSet(63));
    try testing.expect(bv.isSet(64));
    try testing.expect(bv.isSet(127));
    
    // Test out-of-bounds access (should be safe)
    bv.set(128);    // Beyond bit_count
    bv.set(1000);   // Way beyond
    try testing.expect(!bv.isSet(128));
    try testing.expect(!bv.isSet(1000));
}

test "BitVec: toggle operation" {
    const allocator = testing.allocator;
    var bv = try BitVec.init(allocator, 10);
    defer bv.deinit(allocator);
    
    // Toggle bits
    bv.toggle(5);
    try testing.expect(bv.isSet(5));
    
    bv.toggle(5);
    try testing.expect(!bv.isSet(5));
    
    // Multiple toggles
    bv.toggle(5);
    bv.toggle(5);
    bv.toggle(5);
    try testing.expect(bv.isSet(5));
}

test "BitVec: setAll and clearAll" {
    const allocator = testing.allocator;
    var bv = try BitVec.init(allocator, 100);
    defer bv.deinit(allocator);
    
    // Set all bits
    bv.setAll();
    for (0..100) |i| {
        try testing.expect(bv.isSet(i));
    }
    
    // Clear all bits
    bv.clearAll();
    for (0..100) |i| {
        try testing.expect(!bv.isSet(i));
    }
    
    // Test setAll with non-aligned size
    var bv2 = try BitVec.init(allocator, 70); // Not a multiple of 64
    defer bv2.deinit(allocator);
    
    bv2.setAll();
    for (0..70) |i| {
        try testing.expect(bv2.isSet(i));
    }
    // Bits beyond bit_count should still be false
    try testing.expect(!bv2.isSet(70));
}

test "BitVec: popcount" {
    const allocator = testing.allocator;
    var bv = try BitVec.init(allocator, 128);
    defer bv.deinit(allocator);
    
    try testing.expectEqual(@as(usize, 0), bv.popcount());
    
    // Set specific number of bits
    bv.set(0);
    bv.set(1);
    bv.set(63);
    bv.set(64);
    bv.set(127);
    
    try testing.expectEqual(@as(usize, 5), bv.popcount());
    
    // Test with all bits set
    bv.setAll();
    try testing.expectEqual(@as(usize, 128), bv.popcount());
}

test "BitVec: findFirstSet and findNextSet" {
    const allocator = testing.allocator;
    var bv = try BitVec.init(allocator, 200);
    defer bv.deinit(allocator);
    
    // Empty bitvec
    try testing.expect(bv.findFirstSet() == null);
    
    // Set some bits
    bv.set(10);
    bv.set(50);
    bv.set(100);
    bv.set(150);
    
    // Find first
    try testing.expectEqual(@as(?usize, 10), bv.findFirstSet());
    
    // Find next
    try testing.expectEqual(@as(?usize, 50), bv.findNextSet(10));
    try testing.expectEqual(@as(?usize, 100), bv.findNextSet(50));
    try testing.expectEqual(@as(?usize, 150), bv.findNextSet(100));
    try testing.expect(bv.findNextSet(150) == null);
    
    // Test finding next across chunk boundaries
    var bv2 = try BitVec.init(allocator, 128);
    defer bv2.deinit(allocator);
    
    bv2.set(63);  // Last bit of first chunk
    bv2.set(64);  // First bit of second chunk
    
    try testing.expectEqual(@as(?usize, 63), bv2.findFirstSet());
    try testing.expectEqual(@as(?usize, 64), bv2.findNextSet(63));
}

test "BitVec: fromSlice" {
    // Test creating BitVec from existing memory
    var chunks = [_]u64{ 0b1010101010101010, 0b1111000011110000 };
    var bv = BitVec.fromSlice(&chunks, 128);
    
    // Check specific bits
    try testing.expect(!bv.isSet(0));
    try testing.expect(bv.isSet(1));
    try testing.expect(!bv.isSet(2));
    try testing.expect(bv.isSet(3));
    
    // Should not own memory
    try testing.expect(!bv.owns_memory);
}

test "analyzeCode: basic PUSH handling" {
    const allocator = testing.allocator;
    
    // PUSH1 0x01 PUSH2 0x0203 ADD
    const code = [_]u8{ 
        constants.PUSH1, 0x01,
        constants.PUSH2, 0x02, 0x03,
        constants.ADD
    };
    
    var bitmap = try analyzeCode(allocator, &code);
    defer bitmap.deinit(allocator);
    
    // Opcodes should be marked as code
    try testing.expect(bitmap.isValidCodePosition(0)); // PUSH1
    try testing.expect(bitmap.isValidCodePosition(2)); // PUSH2
    try testing.expect(bitmap.isValidCodePosition(5)); // ADD
    
    // PUSH data should NOT be marked as code
    try testing.expect(!bitmap.isValidCodePosition(1)); // 0x01
    try testing.expect(!bitmap.isValidCodePosition(3)); // 0x02
    try testing.expect(!bitmap.isValidCodePosition(4)); // 0x03
}

test "analyzeCode: all PUSH variants" {
    const allocator = testing.allocator;
    
    // Test PUSH0 through PUSH32
    {
        // PUSH0 doesn't have data
        const code = [_]u8{ constants.PUSH0, constants.ADD };
        var bitmap = try analyzeCode(allocator, &code);
        defer bitmap.deinit(allocator);
        
        try testing.expect(bitmap.isValidCodePosition(0)); // PUSH0
        try testing.expect(bitmap.isValidCodePosition(1)); // ADD
    }
    
    // Test PUSH32 (maximum size)
    {
        var code: [34]u8 = undefined;
        code[0] = constants.PUSH32;
        @memset(code[1..33], 0xFF); // 32 bytes of data
        code[33] = constants.STOP;
        
        var bitmap = try analyzeCode(allocator, &code);
        defer bitmap.deinit(allocator);
        
        try testing.expect(bitmap.isValidCodePosition(0));  // PUSH32
        try testing.expect(bitmap.isValidCodePosition(33)); // STOP
        
        // All 32 data bytes should not be code
        for (1..33) |i| {
            try testing.expect(!bitmap.isValidCodePosition(i));
        }
    }
}

test "analyzeCode: truncated PUSH at end" {
    const allocator = testing.allocator;
    
    // PUSH2 with only 1 byte of data (truncated)
    const code = [_]u8{ constants.PUSH2, 0x01 };
    
    var bitmap = try analyzeCode(allocator, &code);
    defer bitmap.deinit(allocator);
    
    try testing.expect(bitmap.isValidCodePosition(0)); // PUSH2
    try testing.expect(!bitmap.isValidCodePosition(1)); // Partial data
}

test "analyzeJumpdests: basic functionality" {
    const allocator = testing.allocator;
    
    // PUSH1 0x04 JUMP STOP JUMPDEST ADD
    const code = [_]u8{
        constants.PUSH1, 0x04,
        constants.JUMP,
        constants.STOP,
        constants.JUMPDEST,
        constants.ADD
    };
    
    var jumpdests = try analyzeJumpdests(allocator, &code);
    defer jumpdests.deinit(allocator);
    
    // Only position 4 should be marked as JUMPDEST
    try testing.expect(!jumpdests.isSet(0));
    try testing.expect(!jumpdests.isSet(1));
    try testing.expect(!jumpdests.isSet(2));
    try testing.expect(!jumpdests.isSet(3));
    try testing.expect(jumpdests.isSet(4)); // JUMPDEST
    try testing.expect(!jumpdests.isSet(5));
}

test "analyzeJumpdests: JUMPDEST in PUSH data" {
    const allocator = testing.allocator;
    
    // PUSH2 0x5B5B (0x5B = JUMPDEST opcode)
    const code = [_]u8{
        constants.PUSH2, constants.JUMPDEST, constants.JUMPDEST,
        constants.JUMPDEST, // Real JUMPDEST after the PUSH
    };
    
    var jumpdests = try analyzeJumpdests(allocator, &code);
    defer jumpdests.deinit(allocator);
    
    // The bytes in PUSH data should NOT be marked as JUMPDEST
    try testing.expect(!jumpdests.isSet(1)); // JUMPDEST byte in data
    try testing.expect(!jumpdests.isSet(2)); // JUMPDEST byte in data
    
    // Only the real JUMPDEST should be marked
    try testing.expect(jumpdests.isSet(3));
}

test "analyzeBytecode: combined analysis" {
    const allocator = testing.allocator;
    
    // Complex bytecode with multiple features
    const code = [_]u8{
        constants.PUSH1, 0x08,      // 0-1: Push jump target
        constants.DUP1,             // 2: Duplicate
        constants.JUMPDEST,         // 3: First jumpdest
        constants.PUSH2, 0x5B, 0x5B,// 4-6: PUSH with JUMPDEST bytes in data
        constants.POP,              // 7: Pop
        constants.JUMPDEST,         // 8: Second jumpdest
        constants.STOP,             // 9: Stop
    };
    
    var analysis = try analyzeBytecode(allocator, &code);
    defer analysis.deinit(allocator);
    
    // Check code bitmap
    try testing.expect(analysis.code_bitmap.isSet(0));  // PUSH1
    try testing.expect(!analysis.code_bitmap.isSet(1)); // PUSH data
    try testing.expect(analysis.code_bitmap.isSet(2));  // DUP1
    try testing.expect(analysis.code_bitmap.isSet(3));  // JUMPDEST
    try testing.expect(analysis.code_bitmap.isSet(4));  // PUSH2
    try testing.expect(!analysis.code_bitmap.isSet(5)); // PUSH data
    try testing.expect(!analysis.code_bitmap.isSet(6)); // PUSH data
    try testing.expect(analysis.code_bitmap.isSet(7));  // POP
    try testing.expect(analysis.code_bitmap.isSet(8));  // JUMPDEST
    try testing.expect(analysis.code_bitmap.isSet(9));  // STOP
    
    // Check jumpdest bitmap
    try testing.expect(!analysis.jumpdest_bitmap.isSet(0));
    try testing.expect(!analysis.jumpdest_bitmap.isSet(1));
    try testing.expect(!analysis.jumpdest_bitmap.isSet(2));
    try testing.expect(analysis.jumpdest_bitmap.isSet(3));  // First JUMPDEST
    try testing.expect(!analysis.jumpdest_bitmap.isSet(4));
    try testing.expect(!analysis.jumpdest_bitmap.isSet(5)); // Not a real JUMPDEST
    try testing.expect(!analysis.jumpdest_bitmap.isSet(6)); // Not a real JUMPDEST
    try testing.expect(!analysis.jumpdest_bitmap.isSet(7));
    try testing.expect(analysis.jumpdest_bitmap.isSet(8));  // Second JUMPDEST
    try testing.expect(!analysis.jumpdest_bitmap.isSet(9));
}

test "BitVec: large contract simulation" {
    const allocator = testing.allocator;
    
    // Simulate a 24KB contract (maximum contract size)
    const contract_size = 24576;
    var bv = try BitVec.init(allocator, contract_size);
    defer bv.deinit(allocator);
    
    // Set every 100th bit (simulating JUMPDEST positions)
    var i: usize = 0;
    while (i < contract_size) : (i += 100) {
        bv.set(i);
    }
    
    // Verify
    var count: usize = 0;
    i = 0;
    while (i < contract_size) : (i += 1) {
        if (bv.isSet(i)) {
            try testing.expect(i % 100 == 0);
            count += 1;
        }
    }
    
    try testing.expectEqual(@as(usize, 246), count); // 24576 / 100 = 245.76
    try testing.expectEqual(count, bv.popcount());
}

test "BitVec: performance patterns" {
    const allocator = testing.allocator;
    
    // Test pattern that might appear in real bytecode analysis
    var bv = try BitVec.init(allocator, 1000);
    defer bv.deinit(allocator);
    
    // Simulate marking code vs data pattern
    var pc: usize = 0;
    while (pc < 1000) {
        bv.set(pc); // Mark as code
        
        // Simulate PUSH2 (skip 2 bytes of data)
        if (pc % 10 == 0 and pc + 2 < 1000) {
            bv.clear(pc + 1);
            bv.clear(pc + 2);
            pc += 3;
        } else {
            pc += 1;
        }
    }
    
    // Iterate using findNextSet
    var jumpdest_count: usize = 0;
    var pos = bv.findFirstSet();
    while (pos) |p| {
        if (p % 13 == 0) { // Arbitrary JUMPDEST pattern
            jumpdest_count += 1;
        }
        pos = bv.findNextSet(p);
    }
    
    try testing.expect(jumpdest_count > 0);
}

test "BitVec: edge cases" {
    const allocator = testing.allocator;
    
    // Single bit
    {
        var bv = try BitVec.init(allocator, 1);
        defer bv.deinit(allocator);
        
        bv.set(0);
        try testing.expect(bv.isSet(0));
        try testing.expectEqual(@as(usize, 1), bv.popcount());
    }
    
    // Exactly 64 bits
    {
        var bv = try BitVec.init(allocator, 64);
        defer bv.deinit(allocator);
        
        bv.set(0);
        bv.set(63);
        try testing.expect(bv.isSet(0));
        try testing.expect(bv.isSet(63));
        try testing.expectEqual(@as(usize, 2), bv.popcount());
    }
    
    // 65 bits (spans two chunks)
    {
        var bv = try BitVec.init(allocator, 65);
        defer bv.deinit(allocator);
        
        bv.set(64);
        try testing.expect(bv.isSet(64));
        try testing.expect(!bv.isSet(65)); // Out of bounds
    }
}

test "analyzeCode: real-world patterns" {
    const allocator = testing.allocator;
    
    // Simulate common Solidity patterns
    {
        // Constructor pattern: PUSH 0x80 PUSH 0x40 MSTORE
        const code = [_]u8{
            constants.PUSH1, 0x80,
            constants.PUSH1, 0x40,
            constants.MSTORE,
        };
        
        var bitmap = try analyzeCode(allocator, &code);
        defer bitmap.deinit(allocator);
        
        try testing.expect(bitmap.isSet(0));  // PUSH1
        try testing.expect(!bitmap.isSet(1)); // 0x80
        try testing.expect(bitmap.isSet(2));  // PUSH1
        try testing.expect(!bitmap.isSet(3)); // 0x40
        try testing.expect(bitmap.isSet(4));  // MSTORE
    }
    
    // Function selector pattern
    {
        // PUSH4 0x12345678 EQ PUSH2 0x0100 JUMPI
        const code = [_]u8{
            constants.PUSH4, 0x12, 0x34, 0x56, 0x78,
            constants.EQ,
            constants.PUSH2, 0x01, 0x00,
            constants.JUMPI,
        };
        
        var bitmap = try analyzeCode(allocator, &code);
        defer bitmap.deinit(allocator);
        
        try testing.expect(bitmap.isSet(0));   // PUSH4
        try testing.expect(!bitmap.isSet(1));  // data
        try testing.expect(!bitmap.isSet(2));  // data
        try testing.expect(!bitmap.isSet(3));  // data
        try testing.expect(!bitmap.isSet(4));  // data
        try testing.expect(bitmap.isSet(5));   // EQ
        try testing.expect(bitmap.isSet(6));   // PUSH2
        try testing.expect(!bitmap.isSet(7));  // data
        try testing.expect(!bitmap.isSet(8));  // data
        try testing.expect(bitmap.isSet(9));   // JUMPI
    }
}

test "BitVec: unchecked operations" {
    const allocator = testing.allocator;
    var bv = try BitVec.init(allocator, 100);
    defer bv.deinit(allocator);
    
    // Test unchecked set
    bv.setUnchecked(50);
    try testing.expect(bv.isSetUnchecked(50));
    
    // Test unchecked clear
    bv.clearUnchecked(50);
    try testing.expect(!bv.isSetUnchecked(50));
    
    // Unchecked operations at boundaries
    bv.setUnchecked(0);
    bv.setUnchecked(63);
    bv.setUnchecked(64);
    bv.setUnchecked(99);
    
    try testing.expect(bv.isSetUnchecked(0));
    try testing.expect(bv.isSetUnchecked(63));
    try testing.expect(bv.isSetUnchecked(64));
    try testing.expect(bv.isSetUnchecked(99));
}

test "BitVec: serialization and deserialization" {
    const allocator = testing.allocator;
    
    // Create and populate a BitVec
    var bv = try BitVec.init(allocator, 200);
    defer bv.deinit(allocator);
    
    // Set some bits in a pattern
    var i: usize = 0;
    while (i < 200) : (i += 13) {
        bv.set(i);
    }
    
    // Serialize to bytes
    const bytes = bv.asSlice();
    
    // Deserialize from bytes
    var bv2 = try BitVec.fromBytes(allocator, bytes, 200);
    defer bv2.deinit(allocator);
    
    // Verify the pattern is preserved
    i = 0;
    while (i < 200) : (i += 1) {
        try testing.expectEqual(bv.isSet(i), bv2.isSet(i));
    }
    
    // Test popcount is the same
    try testing.expectEqual(bv.popcount(), bv2.popcount());
}

test "analyzeWithPadding: empty bytecode" {
    const allocator = testing.allocator;
    
    var analysis = try analyzeWithPadding(allocator, &[_]u8{});
    defer analysis.deinit(allocator);
    
    try testing.expect(analysis.was_padded);
    try testing.expectEqual(@as(usize, 1), analysis.padded_code.len);
    try testing.expectEqual(constants.STOP, analysis.padded_code[0]);
}

test "analyzeWithPadding: bytecode ending with STOP" {
    const allocator = testing.allocator;
    
    const code = [_]u8{
        constants.PUSH1, 0x01,
        constants.ADD,
        constants.STOP,
    };
    
    var analysis = try analyzeWithPadding(allocator, &code);
    defer analysis.deinit(allocator);
    
    try testing.expect(!analysis.was_padded);
    try testing.expectEqual(code.len, analysis.padded_code.len);
    try testing.expectEqualSlices(u8, &code, analysis.padded_code);
}

test "analyzeWithPadding: bytecode needing STOP" {
    const allocator = testing.allocator;
    
    const code = [_]u8{
        constants.PUSH1, 0x01,
        constants.ADD,
    };
    
    var analysis = try analyzeWithPadding(allocator, &code);
    defer analysis.deinit(allocator);
    
    try testing.expect(analysis.was_padded);
    try testing.expectEqual(code.len + 1, analysis.padded_code.len);
    try testing.expectEqualSlices(u8, &code, analysis.padded_code[0..code.len]);
    try testing.expectEqual(constants.STOP, analysis.padded_code[analysis.padded_code.len - 1]);
}

test "analyzeWithPadding: incomplete PUSH" {
    const allocator = testing.allocator;
    
    // PUSH2 with only 1 byte of data
    const code = [_]u8{
        constants.PUSH2, 0x01,
    };
    
    var analysis = try analyzeWithPadding(allocator, &code);
    defer analysis.deinit(allocator);
    
    try testing.expect(analysis.was_padded);
    try testing.expectEqual(@as(usize, 4), analysis.padded_code.len); // PUSH2 + 1 + 1 padding + STOP
    try testing.expectEqual(constants.PUSH2, analysis.padded_code[0]);
    try testing.expectEqual(@as(u8, 0x01), analysis.padded_code[1]);
    try testing.expectEqual(constants.STOP, analysis.padded_code[2]);
    try testing.expectEqual(constants.STOP, analysis.padded_code[3]);
}

test "analyzeWithPadding: JUMPDEST tracking" {
    const allocator = testing.allocator;
    
    const code = [_]u8{
        constants.JUMPDEST,         // 0
        constants.PUSH1, 0x05,      // 1-2
        constants.JUMP,             // 3
        constants.STOP,             // 4
        constants.JUMPDEST,         // 5
        constants.PUSH2, constants.JUMPDEST, constants.JUMPDEST, // 6-8 (JUMPDEST in data)
        constants.JUMPDEST,         // 9
    };
    
    var analysis = try analyzeWithPadding(allocator, &code);
    defer analysis.deinit(allocator);
    
    // Check JUMPDESTs
    try testing.expect(analysis.jumpdest_bitmap.isSet(0));  // Real JUMPDEST
    try testing.expect(!analysis.jumpdest_bitmap.isSet(1)); // PUSH1
    try testing.expect(!analysis.jumpdest_bitmap.isSet(2)); // Data
    try testing.expect(!analysis.jumpdest_bitmap.isSet(3)); // JUMP
    try testing.expect(!analysis.jumpdest_bitmap.isSet(4)); // STOP
    try testing.expect(analysis.jumpdest_bitmap.isSet(5));  // Real JUMPDEST
    try testing.expect(!analysis.jumpdest_bitmap.isSet(6)); // PUSH2
    try testing.expect(!analysis.jumpdest_bitmap.isSet(7)); // Data (JUMPDEST byte)
    try testing.expect(!analysis.jumpdest_bitmap.isSet(8)); // Data (JUMPDEST byte)
    try testing.expect(analysis.jumpdest_bitmap.isSet(9));  // Real JUMPDEST
}

test "analyzeWithPadding: large incomplete PUSH32" {
    const allocator = testing.allocator;
    
    // PUSH32 with no data
    const code = [_]u8{constants.PUSH32};
    
    var analysis = try analyzeWithPadding(allocator, &code);
    defer analysis.deinit(allocator);
    
    try testing.expect(analysis.was_padded);
    try testing.expectEqual(@as(usize, 34), analysis.padded_code.len); // 1 + 32 + 1 STOP
    try testing.expectEqual(constants.PUSH32, analysis.padded_code[0]);
    
    // All padding should be STOP
    for (1..34) |i| {
        try testing.expectEqual(constants.STOP, analysis.padded_code[i]);
    }
}