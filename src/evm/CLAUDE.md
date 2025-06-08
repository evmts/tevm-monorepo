# EVM Implementation CLAUDE.md

## Overview

This directory contains a high-performance Ethereum Virtual Machine (EVM) implementation written in Zig. The implementation prioritizes both correctness and performance through a sophisticated two-stage safety system that enables aggressive optimizations while maintaining full Ethereum compatibility.

## Architecture

### Core Components

- **VM (`vm.zig`)** - Main virtual machine orchestrating contract execution
- **JumpTable (`jump_table.zig`)** - Opcode dispatch with O(1) lookup and pre-execution validation
- **Stack (`stack.zig`)** - High-performance 1024-element stack with unsafe optimizations
- **Memory (`memory.zig`)** - Context-aware memory management with copy-on-write semantics
- **State (`evm_state.zig`)** - World state management (accounts, storage, logs)
- **Frame (`frame.zig`)** - Execution context containing stack, memory, and gas accounting

### Opcode Implementation (`opcodes/`)

Opcodes are organized by category:
- `arithmetic.zig` - ADD, MUL, SUB, DIV, etc.
- `bitwise.zig` - AND, OR, XOR, NOT, bit shifts
- `comparison.zig` - LT, GT, EQ, ISZERO
- `control.zig` - JUMP, JUMPI, STOP, RETURN, REVERT
- `crypto.zig` - KECCAK256/SHA3
- `environment.zig` - ADDRESS, CALLER, CALLVALUE, etc.
- `block.zig` - BLOCKHASH, TIMESTAMP, NUMBER, etc.
- `memory.zig` - MLOAD, MSTORE, MSIZE, MCOPY
- `storage.zig` - SLOAD, SSTORE, TLOAD, TSTORE
- `stack.zig` - POP, PUSH0-32, DUP1-16, SWAP1-16
- `log.zig` - LOG0-4
- `system.zig` - CREATE, CALL, DELEGATECALL, etc.

## Performance Philosophy

### Two-Stage Safety System

1. **Pre-execution Validation** (`jump_table.zig` + `stack_validation.zig`)
   - Validates all stack requirements before opcode execution
   - Consumes base gas costs upfront
   - Ensures all safety constraints are met

2. **Unsafe Performance Operations** (opcode implementations)
   - Skip redundant bounds checking during execution
   - Use direct memory access patterns
   - Eliminate function call overhead with batching

### Key Performance Techniques

#### 1. Unsafe Operations
```zig
// BEFORE: Safe but slower
const a = try stack.pop();  // Bounds checking
const b = try stack.pop();  // More bounds checking
try stack.push(a + b);      // Overflow checking

// AFTER: Unsafe but faster (bounds pre-validated)
const b = stack.pop_unsafe();        // No bounds check
const a = stack.peek_unsafe().*;     // Direct memory access
stack.set_top_unsafe(a + b);         // In-place modification
```

#### 2. Batch Operations
```zig
// Combine multiple stack operations into single calls
const values = stack.pop2_push1_unsafe(result);
// Returns {a, b} and pushes result in one operation
```

#### 3. In-Place Modifications
```zig
// Modify stack top directly instead of pop/push cycles
const value = stack.peek_unsafe().*;
stack.set_top_unsafe(processed_value);
```

## Zig-Specific Style Guidelines

### Naming Conventions
- **Functions**: `snake_case` (e.g., `validate_stack_requirements`)
- **Variables**: `snake_case` (e.g., `gas_remaining`, `stack_size`)
- **Structs/Types**: `PascalCase` (e.g., `ExecutionError`, `JumpTable`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_STACK_SIZE`, `GAS_LIMIT`)

### Performance Rules
- **NO `inline` keyword**: Let the compiler decide on inlining for optimal WASM bundle size vs performance
- **Prefer `if (!condition) unreachable;` over `std.debug.assert`**: More readable and is the literal implementation
- **Use `@branchHint(.likely)` for hot paths and `@branchHint(.cold)` for error paths**

### Safety Patterns
```zig
// Preferred error handling pattern
if (stack.size < required_items) {
    return ExecutionError.Error.StackUnderflow;
}

// Debug assertions for development (compiled out in release)
if (!condition) unreachable;

// Branch hints for performance
@branchHint(.likely);   // Hot execution paths
@branchHint(.cold);     // Error handling paths
```

## Testing Guidelines

### Critical Testing Rules
- **NEVER commit Zig code until `zig build test-all` passes**
- Run `zig build test-all` early and often - tests are extremely fast
- Always use `zig build test-all` (NOT `zig test` directly) because tests use module imports

### Test Categories
- **Unit tests** - Individual component correctness
- **Integration tests** - Opcode interaction and execution flow
- **Gas tests** - Accurate gas consumption
- **Stack validation tests** - Bounds checking logic
- **Hardfork tests** - Compatibility across Ethereum versions

### Testing Performance Code
When testing performance-critical unsafe operations:
```zig
test "unsafe operations assume valid preconditions" {
    var stack = Stack{};
    
    // Set up valid preconditions
    try stack.append(10);
    try stack.append(20);
    
    // Now safe to use unsafe operations
    const value = stack.pop_unsafe();
    try testing.expectEqual(@as(u256, 20), value);
}
```

## Key Implementation Details

### Jump Table Design
- **O(1) opcode dispatch** via direct array indexing
- **Cache-line aligned** for optimal memory access
- **Hardfork-specific tables** for version compatibility
- **Null entries default to UNDEFINED** operation

### Stack Implementation
- **Fixed 1024-element capacity** per EVM specification
- **32-byte aligned** for SIMD operations
- **Separate safe/unsafe variants** for all operations
- **Batched operations** for common patterns
- **CamelCase compatibility aliases** for existing tests

### Memory Management
- **Context-aware design** with parent/child relationships
- **Copy-on-write semantics** for efficient forking
- **Word-aligned operations** for optimal access patterns
- **Bounds checking with overflow protection**

### State Management
- **HashMap-based storage** for efficient lookups
- **Transient storage support** (EIP-1153)
- **Event log collection** with memory management
- **Account state tracking** (balances, nonces, code)

## Debugging and Development

### Debug Logging
The EVM uses structured debug logging throughout:
```zig
Log.debug("VM.interpret: Starting execution, depth={}, gas={}", .{ depth, gas });
Log.debug("Stack.pop: Popped value={}, new_size={}", .{ value, new_size });
```

### Common Pitfalls
1. **Using `zig test` directly** - Always use `zig build test-all`
2. **Adding `inline` keywords** - Let the compiler decide
3. **Using `std.debug.assert`** - Prefer `if (!condition) unreachable;`
4. **Forgetting bounds validation** - Unsafe operations assume valid preconditions
5. **Missing branch hints** - Add `@branchHint()` to performance-critical paths

### Performance Profiling
- Use `@setCold(true)` for error handling functions
- Profile with different optimization levels
- Test both debug and release builds
- Verify WASM bundle size impact

## Hardfork Support

The implementation supports all major Ethereum hardforks from Frontier to Cancun:
- **Operation availability** determined by hardfork version
- **Gas cost changes** handled in jump table generation
- **New opcodes** added with appropriate hardfork guards
- **EIP implementations** clearly documented and tested

## Future Considerations

### Planned Optimizations
- **SIMD arithmetic operations** for 256-bit math
- **Optimized memory copying** for large data moves
- **Better cache utilization** in hot paths
- **Compile-time opcode specialization**

### Architecture Evolution
- **Pluggable opcode implementations** for custom VMs
- **Parallel execution** for independent transactions
- **State commitment optimization** for proof generation
- **WebAssembly-specific optimizations**

## Contributing to EVM Code

1. **Understand the safety system** - Pre-validation enables unsafe optimizations
2. **Follow performance patterns** - Use established unsafe operation styles
3. **Test thoroughly** - Include both safe and unsafe operation tests
4. **Document optimizations** - Explain why unsafe operations are safe
5. **Maintain compatibility** - Ensure changes work across all hardforks
6. **Profile changes** - Verify performance improvements are real

Remember: The EVM implementation prioritizes both correctness and performance. Every optimization must maintain full Ethereum compatibility while providing measurable performance benefits.