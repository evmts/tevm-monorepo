# BitVec - JUMPDEST Analysis Module

## Overview
Create a bit vector implementation for analyzing EVM bytecode to identify valid JUMPDEST locations. This module is crucial for validating jump operations in the EVM by distinguishing between actual code and data embedded in bytecode (e.g., PUSH instruction data).

## Motivation
The EVM requires validation of jump destinations to ensure jumps only target valid JUMPDEST opcodes that are part of actual code (not data). This requires analyzing bytecode to:
- Track which bytes are executable code vs data
- Identify valid JUMPDEST locations
- Support efficient lookup during execution

The bitvec module provides:
- Efficient bit-level storage for code/data classification
- Fast lookup for JUMPDEST validation
- Caching support for analyzed contracts

## Requirements

### 1. Core BitVec Structure
```zig
pub const BitVec = struct {
    /// Bit array stored in u64 chunks for efficiency
    bits: []u64,
    /// Total length in bits
    size: usize,
    /// Whether this bitvec owns its memory (and should free it)
    owned: bool,
};
```

### 2. BitVec Methods

#### Initialization
```zig
/// Create a new BitVec with the given size
/// All bits are initialized to 0
pub fn init(allocator: std.mem.Allocator, size: usize) \!BitVec {
    const u64_size = (size + 63) / 64; // Round up to nearest u64
    const bits = try allocator.alloc(u64, u64_size);
    @memset(bits, 0); // Initialize all bits to 0
    return BitVec{
        .bits = bits,
        .size = size,
        .owned = true,
    };
}

/// Create a BitVec from existing memory (not owned)
/// Useful for creating views into cached analysis data
pub fn fromMemory(bits: []u64, size: usize) BitVec {
    return BitVec{
        .bits = bits,
        .size = size,
        .owned = false,
    };
}
```

#### Memory Management
```zig
/// Free allocated memory if owned
/// Must be called for owned BitVecs to prevent memory leaks
pub fn deinit(self: *BitVec, allocator: std.mem.Allocator) void {
    if (self.owned) {
        allocator.free(self.bits);
        self.bits = &.{};
        self.size = 0;
    }
}
```

#### Bit Operations
```zig
/// Set a bit at the given position to 1
/// No-op if position is out of bounds
pub fn set(self: *BitVec, pos: usize) void {
    if (pos >= self.size) return;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] |= bit;
}

/// Clear a bit at the given position to 0
/// No-op if position is out of bounds
pub fn clear(self: *BitVec, pos: usize) void {
    if (pos >= self.size) return;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] &= ~bit;
}

/// Check if a bit is set at the given position
/// Returns false if position is out of bounds
pub fn isSet(self: *const BitVec, pos: usize) bool {
    if (pos >= self.size) return false;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    return (self.bits[idx] & bit) \!= 0;
}
```

#### Code Analysis
```zig
/// Check if the position represents a valid code segment
/// This is the main interface for JUMPDEST validation
pub fn codeSegment(self: *const BitVec, pos: usize) bool {
    return self.isSet(pos);
}
```

### 3. Bytecode Analysis Function
```zig
/// Analyze bytecode to identify valid code segments and JUMPDEST locations
/// 
/// This function creates a bitmap where:
/// - 1 = executable code byte
/// - 0 = data byte (e.g., PUSH instruction data)
///
/// The analysis works by:
/// 1. Initially marking all bytes as code
/// 2. Identifying PUSH instructions
/// 3. Marking the bytes after PUSH as data based on push size
///
/// Parameters:
/// - code: The bytecode to analyze
///
/// Returns: BitVec with code/data classification
pub fn codeBitmap(code: []const u8) BitVec {
    const allocator = std.heap.page_allocator;
    var bitmap = BitVec.init(allocator, code.len) catch {
        // If allocation fails, return an empty bitmap
        return BitVec{ .bits = &.{}, .size = 0, .owned = false };
    };
    
    // Mark all positions as valid code initially
    for (0..code.len) |i| {
        bitmap.set(i);
    }
    
    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];
        
        // If the opcode is a PUSH, skip the pushed bytes
        if (isPush(op)) {
            const push_bytes = getPushSize(op);
            
            // Mark pushed bytes as data (not code)
            var j: usize = 1;
            while (j <= push_bytes and i + j < code.len) : (j += 1) {
                bitmap.clear(i + j);
            }
            
            // Skip past the PUSH instruction and its data
            i += push_bytes + 1;
        } else {
            i += 1;
        }
    }
    
    return bitmap;
}
```

### 4. Helper Functions (from constants module)
```zig
// These would be imported from the constants module (Issue #3)
fn isPush(opcode: u8) bool {
    return opcode >= 0x60 and opcode <= 0x7f; // PUSH1 to PUSH32
}

fn getPushSize(opcode: u8) u8 {
    if (opcode == 0x5f) return 0; // PUSH0
    if (opcode >= 0x60 and opcode <= 0x7f) {
        return opcode - 0x5f; // PUSH1 = 1 byte, PUSH2 = 2 bytes, etc.
    }
    return 0;
}
```

## Usage Example
```zig
// Analyze contract bytecode
const bytecode = [_]u8{ 
    0x60, 0x80, // PUSH1 0x80
    0x60, 0x40, // PUSH1 0x40  
    0x52,       // MSTORE
    0x5b,       // JUMPDEST
    0x60, 0x00, // PUSH1 0x00
    0x56        // JUMP
};

var analysis = codeBitmap(&bytecode);
defer analysis.deinit(allocator);

// Check if position 5 is a valid JUMPDEST
if (bytecode[5] == JUMPDEST and analysis.codeSegment(5)) {
    // Valid jump destination
}

// Position 1 (0x80) is data, not code
std.debug.assert(\!analysis.codeSegment(1));

// Position 5 (JUMPDEST) is code
std.debug.assert(analysis.codeSegment(5));
```

## Implementation Notes

1. **Bit Packing**: Store bits in u64 chunks for efficient memory usage and cache performance
2. **Bounds Checking**: All operations should gracefully handle out-of-bounds access
3. **Memory Ownership**: Support both owned and borrowed memory for flexibility
4. **Allocation Strategy**: Use page allocator for simplicity, but consider allowing custom allocators
5. **Error Handling**: Return empty bitmap on allocation failure rather than propagating errors

## Testing Requirements

1. **Basic Operations**:
   - Test set/clear/isSet with various positions
   - Test boundary conditions (0, size-1, out of bounds)
   - Test bit operations across u64 boundaries

2. **Code Analysis**:
   - Test PUSH instruction data marking
   - Test various PUSH sizes (PUSH1 through PUSH32)
   - Test PUSH0 special case
   - Test bytecode ending mid-PUSH
   - Test empty bytecode
   - Test bytecode with only JUMPDEST opcodes

3. **Memory Management**:
   - Test proper cleanup with deinit
   - Test borrowed vs owned memory
   - Test large bytecode (multiple u64 chunks)

## Performance Considerations

1. **Bit-level operations**: Use efficient bit manipulation instead of byte arrays
2. **Cache-friendly**: Pack bits into u64 for better cache utilization  
3. **Minimal allocations**: Single allocation for the entire bit array
4. **Fast lookup**: O(1) access to check if a position is code or data

## Integration with Contract

The Contract module will use BitVec to:
```zig
pub fn validJumpdest(self: *Contract, dest: u256) bool {
    // Check if destination is within bounds
    if (dest >= self.code.len) return false;
    
    const udest = dest.toU64();
    
    // Check if it's a JUMPDEST opcode
    if (self.code[udest] \!= JUMPDEST) return false;
    
    // Check if it's part of code (not data)
    return self.isCode(udest);
}

pub fn isCode(self: *Contract, pos: u64) bool {
    if (self.analysis) |analysis| {
        return analysis.codeSegment(pos);
    }
    // Lazy initialization of analysis
    self.analysis = codeBitmap(self.code);
    return self.analysis.?.codeSegment(pos);
}
```

## References

- [EIP-3540](https://eips.ethereum.org/EIPS/eip-3540) - EVM Object Format (EOF) for code/data separation
- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) - Section 9.4.3 Jump Destination Validity
- [Go-Ethereum jump_table.go](https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go)
- [Evmone analysis.hpp](https://github.com/ethereum/evmone/blob/master/lib/evmone/analysis.hpp)

## Reference Implementations

### revm Implementation

From revm analysis (using the `bitvec` crate):

```rust
// revm uses the bitvec crate for efficient bit manipulation
use bitvec::vec::BitVec;
use once_cell::race::OnceBox;
use primitives::hex;
use std::{fmt::Debug, sync::Arc};

/// A table of valid `jump` destinations. Cheap to clone and memory efficient, one bit per opcode.
#[derive(Clone, PartialEq, Eq, Hash, Ord, PartialOrd)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct JumpTable(pub Arc<BitVec<u8>>);

impl JumpTable {
    /// Gets the raw bytes of the jump map.
    #[inline]
    pub fn as_slice(&self) -> &[u8] {
        self.0.as_raw_slice()
    }

    /// Constructs a jump map from raw bytes and length.
    ///
    /// Bit length represents number of used bits inside slice.
    ///
    /// # Panics
    ///
    /// Panics if number of bits in slice is less than bit_len.
    #[inline]
    pub fn from_slice(slice: &[u8], bit_len: usize) -> Self {
        assert!(
            slice.len() * 8 >= bit_len,
            "slice bit length {} is less than bit_len {}",
            slice.len() * 8,
            bit_len
        );
        let mut bitvec = BitVec::from_slice(slice);
        unsafe { bitvec.set_len(bit_len) };
        Self(Arc::new(bitvec))
    }

    /// Checks if `pc` is a valid jump destination.
    #[inline]
    pub fn is_valid(&self, pc: usize) -> bool {
        pc < self.0.len() && unsafe { *self.0.get_unchecked(pc) }
    }
}
```

revm's bytecode analysis function:

```rust
/// Analyze the bytecode to find the jumpdests. Used to create a jump table
/// that is needed for [`crate::LegacyAnalyzedBytecode`].
/// This function contains a hot loop and should be optimized as much as possible.
///
/// # Safety
///
/// The function uses unsafe pointer arithmetic, but maintains the following invariants:
/// - The iterator never advances beyond the end of the bytecode
/// - All pointer offsets are within bounds of the bytecode
/// - The jump table is never accessed beyond its allocated size
///
/// Undefined behavior if the bytecode does not end with a valid STOP opcode. Please check
/// [`crate::LegacyAnalyzedBytecode::new`] for details on how the bytecode is validated.
pub fn analyze_legacy(bytecode: Bytes) -> (JumpTable, Bytes) {
    if bytecode.is_empty() {
        return (JumpTable::default(), Bytes::from_static(&[opcode::STOP]));
    }

    let mut jumps: BitVec<u8> = bitvec![u8, Lsb0; 0; bytecode.len()];
    let range = bytecode.as_ptr_range();
    let start = range.start;
    let mut iterator = start;
    let end = range.end;
    let mut opcode = 0;

    while iterator < end {
        opcode = unsafe { *iterator };
        if opcode::JUMPDEST == opcode {
            // SAFETY: Jumps are max length of the code
            unsafe { jumps.set_unchecked(iterator.offset_from(start) as usize, true) }
            iterator = unsafe { iterator.offset(1) };
        } else {
            let push_offset = opcode.wrapping_sub(opcode::PUSH1);
            if push_offset < 32 {
                // SAFETY: Iterator access range is checked in the while loop
                iterator = unsafe { iterator.offset((push_offset + 2) as isize) };
            } else {
                // SAFETY: Iterator access range is checked in the while loop
                iterator = unsafe { iterator.offset(1) };
            }
        }
    }

    // Calculate padding needed to ensure bytecode ends with STOP
    // If we're at the end and last opcode is not STOP, we need 1 more byte
    let padding_size = (iterator as usize) - (end as usize) + (opcode != opcode::STOP) as usize;
    if padding_size > 0 {
        let mut padded_bytecode = Vec::with_capacity(bytecode.len() + padding_size);
        padded_bytecode.extend_from_slice(&bytecode);
        padded_bytecode.extend(vec![0; padding_size]);
        (JumpTable(Arc::new(jumps)), Bytes::from(padded_bytecode))
    } else {
        (JumpTable(Arc::new(jumps)), bytecode)
    }
}
```

### evmone Implementation

From evmone analysis (using `std::vector<bool>` as the underlying bitset):

```cpp
/// Bitset of valid jumpdest positions.
class JumpdestBitset : std::vector<bool>
{
public:
    using std::vector<bool>::operator[];

    JumpdestBitset(size_t size) : std::vector<bool>(size) {}

    bool check_jumpdest(size_t index) const noexcept { return index < size() && (*this)[index]; }
};

CodeAnalysis::JumpdestMap analyze_jumpdests(bytes_view code)
{
    // To find if op is any PUSH opcode (OP_PUSH1 <= op <= OP_PUSH32)
    // it can be noticed that OP_PUSH32 is INT8_MAX (0x7f) therefore
    // static_cast<int8_t>(op) <= OP_PUSH32 is always true and can be skipped.
    static_assert(OP_PUSH32 == std::numeric_limits<int8_t>::max());

    CodeAnalysis::JumpdestMap map(code.size());  // Allocate and init bitmap with zeros.
    for (size_t i = 0; i < code.size(); ++i)
    {
        const auto op = code[i];
        if (static_cast<int8_t>(op) >= OP_PUSH1)  // If any PUSH opcode (see explanation above).
            i += op - size_t{OP_PUSH1 - 1};       // Skip PUSH data.
        else if (INTX_UNLIKELY(op == OP_JUMPDEST))
            map[i] = true;
    }

    return map;
}
```

## Performance Comparison

### revm Optimizations:
1. **Arc-wrapped BitVec**: Cheap cloning with reference counting
2. **Unsafe optimizations**: Direct unchecked access in hot paths
3. **Pointer arithmetic**: Avoids bounds checking in the analysis loop
4. **Pre-allocated capacity**: Minimizes allocations
5. **Lsb0 bit ordering**: Optimized for x86/x64 architectures

### evmone Optimizations:
1. **std::vector<bool>**: Specialized bit-packed container
2. **Compile-time PUSH32 check**: Clever optimization to avoid one comparison
3. **INTX_UNLIKELY macro**: Branch prediction hints
4. **Simple loop structure**: Compiler-friendly for optimization

### Key Differences from Zig Implementation:
1. **Memory management**: Both use reference counting (Arc in Rust, implicit in C++)
2. **Bit packing**: Both use specialized bit containers, not raw u64 arrays
3. **Error handling**: revm uses unsafe for performance, evmone uses bounds checking
4. **Analysis approach**: Both analyze in a single pass, but revm also handles padding

## Prototype Implementation

Here's a more complete Zig implementation based on the reference implementations:

```zig
const std = @import("std");
const Allocator = std.mem.Allocator;

pub const BitVec = struct {
    /// Bit array stored in u64 chunks for efficiency
    bits: []u64,
    /// Total length in bits
    size: usize,
    /// Whether this bitvec owns its memory (and should free it)
    owned: bool,
    /// Allocator used for memory management
    allocator: ?Allocator = null,

    /// Create a new BitVec with the given size
    /// All bits are initialized to 0
    pub fn init(allocator: Allocator, size: usize) !BitVec {
        const u64_size = (size + 63) / 64; // Round up to nearest u64
        const bits = try allocator.alloc(u64, u64_size);
        @memset(bits, 0); // Initialize all bits to 0
        return BitVec{
            .bits = bits,
            .size = size,
            .owned = true,
            .allocator = allocator,
        };
    }

    /// Create a BitVec from existing memory (not owned)
    /// Useful for creating views into cached analysis data
    pub fn fromMemory(bits: []u64, size: usize) BitVec {
        return BitVec{
            .bits = bits,
            .size = size,
            .owned = false,
            .allocator = null,
        };
    }

    /// Free allocated memory if owned
    /// Must be called for owned BitVecs to prevent memory leaks
    pub fn deinit(self: *BitVec) void {
        if (self.owned and self.allocator != null) {
            self.allocator.?.free(self.bits);
            self.bits = &.{};
            self.size = 0;
        }
    }

    /// Set a bit at the given position to 1
    /// No-op if position is out of bounds
    pub inline fn set(self: *BitVec, pos: usize) void {
        if (pos >= self.size) return;
        const idx = pos / 64;
        const bit = @as(u64, 1) << @intCast(pos % 64);
        self.bits[idx] |= bit;
    }

    /// Set a bit without bounds checking (for performance)
    pub inline fn set_unchecked(self: *BitVec, pos: usize) void {
        const idx = pos / 64;
        const bit = @as(u64, 1) << @intCast(pos % 64);
        self.bits[idx] |= bit;
    }

    /// Clear a bit at the given position to 0
    /// No-op if position is out of bounds
    pub inline fn clear(self: *BitVec, pos: usize) void {
        if (pos >= self.size) return;
        const idx = pos / 64;
        const bit = @as(u64, 1) << @intCast(pos % 64);
        self.bits[idx] &= ~bit;
    }

    /// Check if a bit is set at the given position
    /// Returns false if position is out of bounds
    pub inline fn isSet(self: *const BitVec, pos: usize) bool {
        if (pos >= self.size) return false;
        const idx = pos / 64;
        const bit = @as(u64, 1) << @intCast(pos % 64);
        return (self.bits[idx] & bit) != 0;
    }

    /// Check if a bit is set without bounds checking (for performance)
    pub inline fn isSet_unchecked(self: *const BitVec, pos: usize) bool {
        const idx = pos / 64;
        const bit = @as(u64, 1) << @intCast(pos % 64);
        return (self.bits[idx] & bit) != 0;
    }

    /// Check if the position represents a valid code segment
    /// This is the main interface for JUMPDEST validation
    pub inline fn codeSegment(self: *const BitVec, pos: usize) bool {
        return self.isSet(pos);
    }

    /// Get raw bytes of the bit vector (for serialization)
    pub fn asSlice(self: *const BitVec) []const u8 {
        const byte_ptr = @as([*]const u8, @ptrCast(self.bits.ptr));
        const byte_len = self.bits.len * @sizeOf(u64);
        return byte_ptr[0..byte_len];
    }

    /// Create from raw bytes (for deserialization)
    pub fn fromSlice(allocator: Allocator, slice: []const u8, bit_len: usize) !BitVec {
        const u64_size = (bit_len + 63) / 64;
        const byte_size = u64_size * @sizeOf(u64);
        
        // Ensure we have enough bytes
        if (slice.len * 8 < bit_len) {
            return error.InsufficientData;
        }
        
        const bits = try allocator.alloc(u64, u64_size);
        
        // Copy the data
        const dest_bytes = @as([*]u8, @ptrCast(bits.ptr));
        @memcpy(dest_bytes[0..@min(slice.len, byte_size)], slice[0..@min(slice.len, byte_size)]);
        
        // Zero any remaining bytes
        if (slice.len < byte_size) {
            @memset(dest_bytes[slice.len..byte_size], 0);
        }
        
        return BitVec{
            .bits = bits,
            .size = bit_len,
            .owned = true,
            .allocator = allocator,
        };
    }
};

/// Opcodes needed for analysis
const JUMPDEST: u8 = 0x5b;
const PUSH0: u8 = 0x5f;
const PUSH1: u8 = 0x60;
const PUSH32: u8 = 0x7f;
const STOP: u8 = 0x00;

/// Get the size of data for a PUSH opcode
inline fn getPushDataSize(opcode: u8) u8 {
    // Optimization from evmone: PUSH32 is 0x7f (INT8_MAX)
    // So casting to i8 and checking >= PUSH1 works for all PUSH opcodes
    const signed = @as(i8, @bitCast(opcode));
    if (signed >= @as(i8, @bitCast(PUSH1))) {
        return opcode - (PUSH1 - 1);
    }
    return 0;
}

/// Result of bytecode analysis
pub const AnalysisResult = struct {
    jump_table: BitVec,
    padded_code: []u8,
    allocator: Allocator,

    pub fn deinit(self: *AnalysisResult) void {
        self.jump_table.deinit();
        self.allocator.free(self.padded_code);
    }
};

/// Analyze bytecode to identify valid code segments and JUMPDEST locations
/// 
/// This function creates a bitmap where:
/// - 1 = valid JUMPDEST location
/// - 0 = not a valid JUMPDEST (either data or other opcode)
///
/// Also pads the bytecode if necessary to ensure it ends with STOP
pub fn analyzeLegacy(allocator: Allocator, code: []const u8) !AnalysisResult {
    if (code.len == 0) {
        // Empty code needs just a STOP opcode
        const padded = try allocator.alloc(u8, 1);
        padded[0] = STOP;
        return AnalysisResult{
            .jump_table = try BitVec.init(allocator, 0),
            .padded_code = padded,
            .allocator = allocator,
        };
    }
    
    var jumps = try BitVec.init(allocator, code.len);
    errdefer jumps.deinit();
    
    // Fast path using pointer arithmetic (similar to revm)
    var i: usize = 0;
    var last_opcode: u8 = 0;
    
    while (i < code.len) {
        const opcode = code[i];
        last_opcode = opcode;
        
        if (opcode == JUMPDEST) {
            jumps.set_unchecked(i);
            i += 1;
        } else {
            const push_size = getPushDataSize(opcode);
            if (push_size > 0) {
                // Skip the opcode and its data
                i += 1 + push_size;
            } else {
                i += 1;
            }
        }
    }
    
    // Calculate padding needed
    const overshoot = if (i > code.len) i - code.len else 0;
    const needs_stop = last_opcode != STOP;
    const padding_size = overshoot + @as(usize, @intFromBool(needs_stop));
    
    // Create padded bytecode if needed
    const padded_code = if (padding_size > 0) blk: {
        const padded = try allocator.alloc(u8, code.len + padding_size);
        @memcpy(padded[0..code.len], code);
        @memset(padded[code.len..], STOP);
        break :blk padded;
    } else blk: {
        const padded = try allocator.alloc(u8, code.len);
        @memcpy(padded, code);
        break :blk padded;
    };
    
    return AnalysisResult{
        .jump_table = jumps,
        .padded_code = padded_code,
        .allocator = allocator,
    };
}

/// Simpler version that just returns the jump table (no padding)
pub fn codeBitmap(allocator: Allocator, code: []const u8) !BitVec {
    var bitmap = try BitVec.init(allocator, code.len);
    errdefer bitmap.deinit();
    
    // Mark all positions as valid code initially
    for (0..code.len) |idx| {
        bitmap.set(@intCast(idx));
    }
    
    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];
        const push_size = getPushDataSize(op);
        
        if (push_size > 0) {
            // Mark pushed bytes as data (not code)
            var j: usize = 1;
            while (j <= push_size and i + j < code.len) : (j += 1) {
                bitmap.clear(i + j);
            }
            i += push_size + 1;
        } else {
            i += 1;
        }
    }
    
    return bitmap;
}
```

## Comprehensive Test Suite

```zig
const testing = std.testing;

test "BitVec basic operations" {
    var bv = try BitVec.init(testing.allocator, 100);
    defer bv.deinit();
    
    // Test initial state (all zeros)
    for (0..100) |i| {
        try testing.expect(!bv.isSet(i));
    }
    
    // Test set
    bv.set(0);
    bv.set(31);
    bv.set(32);
    bv.set(63);
    bv.set(64);
    bv.set(99);
    
    try testing.expect(bv.isSet(0));
    try testing.expect(bv.isSet(31));
    try testing.expect(bv.isSet(32));
    try testing.expect(bv.isSet(63));
    try testing.expect(bv.isSet(64));
    try testing.expect(bv.isSet(99));
    
    // Test clear
    bv.clear(31);
    try testing.expect(!bv.isSet(31));
    
    // Test out of bounds
    bv.set(100); // Should be no-op
    try testing.expect(!bv.isSet(100));
}

test "BitVec serialization" {
    var bv = try BitVec.init(testing.allocator, 100);
    defer bv.deinit();
    
    // Set some bits
    bv.set(0);
    bv.set(7);
    bv.set(64);
    bv.set(99);
    
    // Serialize
    const bytes = bv.asSlice();
    
    // Deserialize
    var bv2 = try BitVec.fromSlice(testing.allocator, bytes, 100);
    defer bv2.deinit();
    
    // Check bits are preserved
    try testing.expect(bv2.isSet(0));
    try testing.expect(bv2.isSet(7));
    try testing.expect(bv2.isSet(64));
    try testing.expect(bv2.isSet(99));
    try testing.expect(!bv2.isSet(1));
    try testing.expect(!bv2.isSet(50));
}

test "analyzeLegacy empty bytecode" {
    var result = try analyzeLegacy(testing.allocator, &[_]u8{});
    defer result.deinit();
    
    try testing.expectEqual(@as(usize, 1), result.padded_code.len);
    try testing.expectEqual(STOP, result.padded_code[0]);
}

test "analyzeLegacy with JUMPDEST" {
    const bytecode = [_]u8{
        JUMPDEST,        // 0: valid jumpdest
        PUSH1, 0x01,     // 1-2: push instruction
        JUMPDEST,        // 3: valid jumpdest
        PUSH1, JUMPDEST, // 4-5: JUMPDEST in push data (not valid)
        JUMPDEST,        // 6: valid jumpdest
        STOP,            // 7: stop
    };
    
    var result = try analyzeLegacy(testing.allocator, &bytecode);
    defer result.deinit();
    
    try testing.expect(result.jump_table.isSet(0));
    try testing.expect(!result.jump_table.isSet(1));
    try testing.expect(!result.jump_table.isSet(2));
    try testing.expect(result.jump_table.isSet(3));
    try testing.expect(!result.jump_table.isSet(4));
    try testing.expect(!result.jump_table.isSet(5)); // JUMPDEST in data
    try testing.expect(result.jump_table.isSet(6));
    try testing.expect(!result.jump_table.isSet(7));
}

test "analyzeLegacy padding" {
    // Bytecode ending without STOP
    const bytecode1 = [_]u8{ PUSH1, 0x01, ADD };
    var result1 = try analyzeLegacy(testing.allocator, &bytecode1);
    defer result1.deinit();
    try testing.expectEqual(@as(usize, 4), result1.padded_code.len);
    try testing.expectEqual(STOP, result1.padded_code[3]);
    
    // Bytecode ending with incomplete PUSH
    const bytecode2 = [_]u8{ PUSH1, 0x01, PUSH2, 0x02 };
    var result2 = try analyzeLegacy(testing.allocator, &bytecode2);
    defer result2.deinit();
    try testing.expectEqual(@as(usize, 6), result2.padded_code.len); // 4 + 1 missing + 1 STOP
    try testing.expectEqual(STOP, result2.padded_code[5]);
    
    // Bytecode ending with PUSH32
    const bytecode3 = [_]u8{ PUSH32 };
    var result3 = try analyzeLegacy(testing.allocator, &bytecode3);
    defer result3.deinit();
    try testing.expectEqual(@as(usize, 34), result3.padded_code.len); // 1 + 32 + 1 STOP
}

test "codeBitmap basic" {
    const bytecode = [_]u8{
        PUSH1, 0x80,     // 0-1: PUSH1 (0 is code, 1 is data)
        PUSH1, 0x40,     // 2-3: PUSH1 (2 is code, 3 is data)  
        MSTORE,          // 4: code
        JUMPDEST,        // 5: code
        PUSH1, 0x00,     // 6-7: PUSH1 (6 is code, 7 is data)
        JUMP,            // 8: code
    };
    
    var bitmap = try codeBitmap(testing.allocator, &bytecode);
    defer bitmap.deinit();
    
    // Check code positions
    try testing.expect(bitmap.codeSegment(0));  // PUSH1
    try testing.expect(!bitmap.codeSegment(1)); // data
    try testing.expect(bitmap.codeSegment(2));  // PUSH1
    try testing.expect(!bitmap.codeSegment(3)); // data
    try testing.expect(bitmap.codeSegment(4));  // MSTORE
    try testing.expect(bitmap.codeSegment(5));  // JUMPDEST
    try testing.expect(bitmap.codeSegment(6));  // PUSH1
    try testing.expect(!bitmap.codeSegment(7)); // data
    try testing.expect(bitmap.codeSegment(8));  // JUMP
}

test "codeBitmap all PUSH sizes" {
    var bytecode = std.ArrayList(u8).init(testing.allocator);
    defer bytecode.deinit();
    
    // Test PUSH1 through PUSH32
    for (PUSH1..PUSH32 + 1) |push_op| {
        try bytecode.append(@intCast(push_op));
        // Add dummy data for the push
        const data_size = push_op - PUSH1 + 1;
        for (0..data_size) |_| {
            try bytecode.append(0xFF);
        }
    }
    
    var bitmap = try codeBitmap(testing.allocator, bytecode.items);
    defer bitmap.deinit();
    
    var pos: usize = 0;
    for (PUSH1..PUSH32 + 1) |push_op| {
        // The PUSH opcode itself is code
        try testing.expect(bitmap.codeSegment(pos));
        pos += 1;
        
        // The data bytes are not code
        const data_size = push_op - PUSH1 + 1;
        for (0..data_size) |_| {
            try testing.expect(!bitmap.codeSegment(pos));
            pos += 1;
        }
    }
}

// Performance benchmarks (compile with ReleaseFast)
test "BitVec performance" {
    if (@import("builtin").mode != .ReleaseFast) return;
    
    const size = 1_000_000;
    var bv = try BitVec.init(testing.allocator, size);
    defer bv.deinit();
    
    // Benchmark set operations
    const start_set = std.time.nanoTimestamp();
    for (0..size) |i| {
        if (i % 3 == 0) {
            bv.set_unchecked(i);
        }
    }
    const set_time = std.time.nanoTimestamp() - start_set;
    
    // Benchmark isSet operations
    var count: usize = 0;
    const start_get = std.time.nanoTimestamp();
    for (0..size) |i| {
        if (bv.isSet_unchecked(i)) {
            count += 1;
        }
    }
    const get_time = std.time.nanoTimestamp() - start_get;
    
    std.debug.print("\nBitVec Performance ({}M bits):\n", .{size / 1_000_000});
    std.debug.print("  Set ops: {} ns/op\n", .{set_time / size});
    std.debug.print("  Get ops: {} ns/op\n", .{get_time / size});
    std.debug.print("  Found: {} set bits\n", .{count});
}
```

## Key Implementation Improvements from Reference Analysis

1. **Memory Management**:
   - Added proper allocator tracking for owned BitVecs
   - Implemented serialization/deserialization for caching
   - Added unchecked variants for performance-critical paths

2. **Analysis Algorithm**:
   - Implemented bytecode padding (like revm)
   - Added fast pointer arithmetic path option
   - Proper handling of all PUSH opcodes including edge cases

3. **Performance Optimizations**:
   - Inline functions for hot paths
   - Unchecked access methods for validated indices
   - Efficient bit manipulation using u64 chunks

4. **Safety Features**:
   - Bounds checking by default
   - Proper cleanup in deinit
   - Error handling for edge cases

This implementation combines the best practices from both revm and evmone while adapting to Zig's idioms and safety features.