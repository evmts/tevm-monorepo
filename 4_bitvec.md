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
EOF < /dev/null