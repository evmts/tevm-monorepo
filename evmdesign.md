# EVM Design - Build Order

This document outlines the order for building the EVM from scratch, organized to avoid downstream dependencies that are unimplemented.

## Phase 1: Core Types and Utilities

### Memory.zig
See detailed specification in [1_memory.issue.md](./1_memory.issue.md)

### bitvec.zig

**Purpose**: Provides a bit vector implementation for tracking valid JUMPDEST positions and distinguishing code from data in EVM bytecode.

**Requirements**:
- Efficiently store and query individual bit flags for each byte position in bytecode
- Support bytecode analysis to identify which bytes are executable code vs data
- Handle PUSH instructions that embed data within the bytecode
- Memory efficient storage using u64 chunks
- Support both owned and borrowed memory patterns

**Interface**:

```zig
// Main bit vector structure
pub const BitVec = struct {
    bits: []u64,      // Bit array stored in u64 chunks (64 bits per chunk)
    size: usize,      // Total length in bits
    owned: bool,      // Whether this bitvec owns its memory (for cleanup)
    
    // Create a new BitVec with the given size, allocating memory
    pub fn init(allocator: std.mem.Allocator, size: usize) !BitVec
    
    // Create a BitVec from existing memory (not owned, won't be freed)
    pub fn fromMemory(bits: []u64, size: usize) BitVec
    
    // Free allocated memory if owned
    pub fn deinit(self: *BitVec, allocator: std.mem.Allocator) void
    
    // Set a bit at the given position to 1
    pub fn set(self: *BitVec, pos: usize) void
    
    // Clear a bit at the given position to 0
    pub fn clear(self: *BitVec, pos: usize) void
    
    // Check if a bit is set at the given position
    pub fn isSet(self: *const BitVec, pos: usize) bool
    
    // Check if the position represents a valid code segment (alias for isSet)
    pub fn codeSegment(self: *const BitVec, pos: usize) bool
};

// Analyze bytecode to create a bitmap of valid code positions
// Returns a BitVec where:
//   - bit = 1: byte at this position is executable code
//   - bit = 0: byte at this position is data (e.g., PUSH arguments)
pub fn codeBitmap(code: []const u8) BitVec
```

**Implementation Details**:
- Uses 64-bit chunks for efficient storage and bit operations
- `codeBitmap` must parse bytecode and identify PUSH1-PUSH32 instructions
- Bytes following PUSH instructions are marked as data (bit = 0)
- All other bytes are marked as code (bit = 1)
- Gracefully handles allocation failures by returning empty bitmap

**Dependencies**:
- `std` - Zig standard library
- `opcodes.zig` - For `isPush()` function to identify PUSH opcodes

- create TestEvmLogger.zig
- create EvmLogger.zig

## Phase 2: Basic Data Structures

### Stack.zig
See detailed specification in [2_stack.issue.md](./2_stack.issue.md)

- create Storage.zig

## Phase 3: Account and State Primitives

- create Account.zig
- create State/Account.zig
- create State/Storage.zig
- create State/Journal.zig
- create State/StateDB.zig
- create State/StateManager.zig
- create State/state.zig

## Phase 4: Execution Context

- create Contract.zig
- create Frame.zig
- create InterpreterState.zig

## Phase 5: Transaction Types

- create FeeMarket.zig
- create FeeMarketTransaction.zig
- create eip7702.zig
- create Withdrawal.zig
- create WithdrawalProcessor.zig

## Phase 6: Opcodes Foundation

- create opcodes/package.zig
- create opcodes/build.zig
- create opcodes/math.zig
- create opcodes/math2.zig
- create opcodes/bitwise.zig
- create opcodes/comparison.zig
- create opcodes/push.zig
- create opcodes/memory.zig
- create opcodes/storage.zig
- create opcodes/transient.zig
- create opcodes/log.zig
- create opcodes/environment.zig
- create opcodes/block.zig
- create opcodes/blob.zig
- create opcodes/crypto.zig
- create opcodes/crypto_standalone.zig
- create opcodes/controlflow.zig
- create opcodes/fixed_controlflow.zig
- create opcodes/fixed_controlflow_debug.zig
- create opcodes/calls.zig

## Phase 7: Jump Table

- create jumpTable/package.zig
- create jumpTable/JumpTable.zig

## Phase 8: Core Opcodes Assembly

- create opcodes.zig
- create opcodes_all.zig

## Phase 9: Precompiles

- create precompile/package.zig
- create precompile/params.zig
- create precompile/common.zig
- create precompile/crypto.zig
- create precompile/math.zig
- create precompile/bls12_381.zig
- create precompile/kzg.zig
- create precompile/Precompiles.zig
- create precompiles/Contract.zig
- create precompiles/Precompiled.zig
- create precompiles.zig

## Phase 10: State Management

- create Journal.zig
- create Storage.zig
- create StateDB.zig
- create state.zig

## Phase 11: Interpreter and EVM Core

- create interpreter.zig
- create evm.zig

## Phase 12: Package Entry Point

- create package.zig

## Notes

- Each file should be created and tested before moving to the next
- Import dependencies should only reference files created in earlier phases
- This order ensures all dependencies are available when needed
- Test files can be created alongside their implementation files