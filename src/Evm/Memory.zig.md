# Memory, Stack, and Frame Implementation Comparison

This document compares the implementation of EVM memory, stack, and execution frames across different Ethereum VM implementations: Tevm (Zig), go-ethereum, revm (Rust), and evmone (C++).

## Overview

Memory, stack, and execution frames are core components of any EVM implementation, responsible for:

1. **Memory**: A byte-addressable linear memory space that expands as needed
2. **Stack**: Fixed-size stack holding up to 1024 256-bit values for operation inputs/outputs
3. **Frame**: Execution context that manages resources during contract execution

These components define how the EVM handles data during execution, affecting both correctness and performance.

## Memory Implementation

### Tevm (Zig)

The Tevm implementation in Zig uses a clean, explicit approach with an `ArrayList` as the backing store:

```zig
pub const Memory = struct {
    /// The underlying byte array storing the memory contents
    store: std.ArrayList(u8),
    
    /// Cached gas cost from the last memory expansion for gas metering
    last_gas_cost: u64,
    
    /// Memory allocator used for memory operations
    allocator: std.mem.Allocator,
    
    // ... methods ...
}
```

Key characteristics:
- Uses `ArrayList<u8>` for dynamic resizing
- Explicit memory allocator for resource management
- Clear separation between copy and view methods
- Manual implementation of memory operations like `set32`
- Comprehensive error handling
- Explicit memory layout with big-endian conversion

Core operations:
- `set(offset, size, value)`: Copies data to memory
- `set32(offset, val)`: Specialized method for 256-bit values 
- `resize(size)`: Expands memory to a specific size
- `getCopy(offset, size)`: Returns a new copy of a memory region
- `getPtr(offset, size)`: Returns a direct slice (view) into memory
- `copy(dst, src, length)`: Implements MEMMOVE (overlapping copy)

Memory expansion is handled explicitly with method calls, and gas calculation is separated from the memory implementation itself.

### go-ethereum

The go-ethereum implementation uses a simple byte slice with dynamic expansion:

```go
type Memory struct {
    store       []byte
    lastGasCost uint64
}
```

Key characteristics:
- Uses Go slice for dynamic resizing with append
- Garbage-collected memory management
- Intermingled gas calculation and memory operations
- Optimized for gas metering

Core operations:
- `Set(offset, size uint64, value []byte)`: Store bytes at offset
- `Set32(offset uint64, val *uint256.Int)`: Store 256-bit integer
- `Resize(size uint64)`: Expand memory to size
- `GetCopy(offset, size int64)`: Copy memory region
- `GetPtr(offset, size int64)`: Get slice of memory

Memory expansion uses Go's append mechanism with overflow checking. Gas calculation is often integrated directly into memory operations.

### revm (Rust)

The revm implementation focuses on efficiency with zero-copy operations where possible:

```rust
pub struct Memory {
    data: Vec<u8>,
    effective_len: usize,
    limit: Option<usize>,
}
```

Key characteristics:
- Uses Rust's `Vec<u8>` with efficient capacity management
- Tracks effective length separately from capacity
- Optional memory limit for gas metering
- Zero-copy operations where possible
- Ownership and borrowing for memory safety

Core operations:
- `resize_offset(offset: usize, len: usize)`: Resize based on access
- `store8(offset: usize, byte: u8)`: Store single byte
- `store(offset: usize, data: &[u8])`: Store bytes
- `store32(offset: usize, value: U256)`: Store 256-bit value
- `view(offset: usize, len: usize)`: Zero-copy memory view
- `copy(dst: usize, src: usize, len: usize)`: Copy memory regions
- `effective_len()`: Get effective memory size for gas calculation

Memory expansion is handled lazily based on access patterns, and gas calculations are separate from the memory implementation.

### evmone (C++)

The evmone implementation focuses on raw performance with direct memory manipulation:

```cpp
class Memory {
    std::vector<uint8_t> m_data;
    size_t m_effective_size = 0;
    
    // ...
};
```

Key characteristics:
- Uses `std::vector<uint8_t>` with efficient resizing
- Tracks effective size for gas calculation
- Minimal abstraction with direct memory access
- Efficient bit manipulation for 256-bit values
- Manual memory management

Core operations:
- `grow(size_t size)`: Expand memory to size
- `store8(size_t offset, uint8_t value)`: Store single byte
- `store(size_t offset, const uint8_t* data, size_t size)`: Store bytes
- `store32(size_t offset, const intx::uint256& value)`: Store 256-bit integer
- `load32(size_t offset)`: Load 256-bit integer
- `copy(size_t dst_offset, size_t src_offset, size_t size)`: Copy memory regions
- `size()`: Get effective memory size

Memory expansion is performed with vector reserve/resize operations, and gas calculations are handled in a separate component.

## Stack Implementation

### Tevm (Zig)

Tevm implements the stack with a fixed-size array and explicit bounds checking:

```zig
pub const Stack = struct {
    data: [1024]u256 align(@alignOf(u256)) = undefined,
    size: usize = 0,
    
    // ... methods ...
}
```

Key characteristics:
- Fixed-size array with 1024 elements
- Size tracking with explicit bounds checking
- Both safe and unsafe (optimized) variants of operations
- Comprehensive error handling with `StackError` union
- Specialized methods for all EVM stack operations

Core operations:
- `push(value)`: Push value onto stack
- `pop()`: Pop value from stack
- `peek()`: Get reference to top element
- `swap1()` through `swap16()`: Swap operations
- `dup(n)`: Duplicate nth stack item
- `back(n)`: Get reference to nth element from top
- `popn(N)`: Pop multiple values at once (compile-time N)

The implementation includes both safe (error-returning) and unsafe (assert-based) variants for performance-critical code paths.

### go-ethereum

Go-ethereum uses a dynamically-sized slice with a 1024 element capacity:

```go
type Stack struct {
    data []uint256.Int
}
```

Key characteristics:
- Slice-based implementation with bounds checking
- Panic-based error handling for stack overflow/underflow
- Optimized for common operations
- Integrated with Go's garbage collection

Core operations:
- `push(d *uint256.Int)`: Push value onto stack
- `pop() (ret uint256.Int)`: Pop value from stack
- `peek() *uint256.Int`: Get pointer to top element
- `swap(n int)`: Generic swap operation for any depth
- `dup(n int)`: Generic dup operation for any depth

The implementation relies on Go's runtime for bounds checking, with panics for stack underflow/overflow.

### revm (Rust)

Revm's stack implementation uses Rust's type system and custom error handling:

```rust
pub struct Stack {
    data: [U256; 1024],
    size: usize,
}
```

Key characteristics:
- Fixed-size array with 1024 elements
- Strong typing with Rust's type system
- Result-based error handling
- Efficient implementation using Rust's zero-cost abstractions
- Clear error types for different stack errors

Core operations:
- `push(&mut self, value: U256) -> Result<(), StackError>`: Push value
- `pop(&mut self) -> Result<U256, StackError>`: Pop value
- `peek(&self, pos: usize) -> Result<&U256, StackError>`: View element
- `swap(&mut self, n: usize) -> Result<(), StackError>`: Swap operation
- `dup(&mut self, n: usize) -> Result<(), StackError>`: Dup operation

Rust's ownership model ensures memory safety, and the Result type provides comprehensive error handling.

### evmone (C++)

Evmone's stack implementation is highly optimized for performance:

```cpp
class Stack {
    uint256* m_top;
    uint256 m_storage[1024];
    
    // ...
};
```

Key characteristics:
- Direct pointer manipulation for maximum performance
- Fixed-size array with 1024 elements
- Minimal bounds checking
- Manual memory management
- Exception-based error handling for stack errors

Core operations:
- `push(const uint256& value)`: Push value onto stack
- `pop() -> uint256`: Pop value from stack
- `top() -> uint256&`: Get reference to top element
- `swap(size_t n)`: Swap operations
- `dup(size_t n)`: Duplicate stack item

The implementation uses direct pointer manipulation for performance, with exceptions for error conditions.

## Frame Implementation

### Tevm (Zig)

Tevm's Frame implementation represents a complete execution context:

```zig
pub const Frame = struct {
    // Core execution context
    op: []const u8 = undefined, 
    pc: usize = 0, 
    cost: u64 = 0, 
    err: ?ExecutionError = null, 
    
    // Execution resources
    memory: Memory, 
    stack: Stack, 
    contract: *Contract, 
    
    // Call data and return data
    returnData: ?[]u8 = null, 
    returnSize: usize = 0, 
    
    // Logging and memory management
    logger: EvmLogger,
    allocator: std.mem.Allocator,
    
    // ... methods ...
}
```

Key characteristics:
- Comprehensive execution context
- Strong error handling with detailed error types
- Explicit memory management with allocator pattern
- Extensive logging for debugging
- Clear resource ownership and lifecycle management

Core operations:
- `init(allocator, contract)`: Create new frame
- `deinit()`: Free resources
- `setReturnData(data)`: Set return data buffer
- `memoryData()`, `stackData()`: Access execution resources
- `caller()`, `address()`, etc.: Access execution context
- Various logging methods for debugging

The Frame manages resource ownership and provides helper methods for common operations, with explicit resource cleanup.

### go-ethereum

Go-ethereum uses a `ScopeContext` combined with interpreter state:

```go
type ScopeContext struct {
    Memory   *Memory
    Stack    *Stack
    Contract *Contract
}

type EVMInterpreter struct {
    evm       *EVM
    cfg       Config
    returnData []byte
    
    // ...
    pc       *uint64
    stack    *Stack
    memory   *Memory
    contract *Contract
    
    // ...
}
```

Key characteristics:
- Split design with ScopeContext for resource access
- Integrated with the interpreter
- Garbage collection for memory management
- Less explicit error handling
- Optimized for production use

Core operations are distributed between the ScopeContext and EVMInterpreter, with the interpreter handling most of the execution logic.

### revm (Rust)

Revm uses a more modular approach with separate Host and Interpreter:

```rust
pub struct Interpreter<'a, H: Host> {
    pc: usize,
    gas: Gas,
    memory: Memory,
    stack: Stack,
    return_data_buffer: Vec<u8>,
    
    // External context
    contract: Contract,
    host: &'a mut H,
    
    // ...
}
```

Key characteristics:
- Host trait for external interactions
- Strong separation of concerns
- Rust's ownership model for resource management
- Comprehensive error handling with custom error types
- Trait-based design for extensibility

Core operations are distributed across the Interpreter and Host implementations, with the host handling external state interactions and the interpreter focusing on EVM execution.

### evmone (C++)

Evmone uses a minimalist execution state with function pointers for performance:

```cpp
struct ExecutionState {
    Stack stack;
    Memory memory;
    bytes return_data;
    
    int64_t gas_left = 0;
    int32_t pc = 0;
    int32_t status = EVMC_SUCCESS;
    
    // ...
};
```

Key characteristics:
- Minimal design focused on performance
- Direct memory manipulation
- Function-based dispatch for opcodes
- Less abstraction with focus on execution speed
- Manual memory management

The execution state is passed directly to opcode handler functions, which modify it in place for maximum performance.

## Gas Calculation Approaches

The implementations vary in how they handle gas calculation, especially for memory expansion:

### Tevm (Zig)

```zig
/// Calculate memory expansion gas cost
pub fn memoryGasCost(size: u64) !u64 {
    const words = (size + 31) / 32;
    const word_gas = words * memory_gas_per_word;
    const linear_cost = word_gas;
    const quadratic_cost = words * words / memory_gas_quad_coeff_div;
    return linear_cost + quadratic_cost;
}
```

Key characteristics:
- Separate gas calculation function
- Explicit error handling for overflow
- Clear separation from memory operations
- Manual calculation of quadratic costs

### go-ethereum

```go
func memoryGasCost(mem *Memory, newSize uint64) (uint64, error) {
    if newSize == 0 {
        return 0, nil
    }
    
    // Calculate memory expansion cost
    newWords := toWordSize(newSize)
    oldWords := toWordSize(mem.Len())
    
    if oldWords > newWords {
        return 0, nil
    }
    
    // Expand quadratically
    cost := newWords * params.MemoryGas
    
    quadratic := (newWords*newWords - oldWords*oldWords) / params.QuadCoeffDiv
    cost += quadratic
    
    if cost > math.MaxUint64 {
        return 0, ErrGasUintOverflow
    }
    
    return cost, nil
}
```

Key characteristics:
- Integrated gas calculation with memory expansion
- Caching of previous gas cost
- Optimized for repeated calculations
- Explicit overflow checking

### revm (Rust)

```rust
pub fn memory_gas(size_in_bytes: usize) -> Result<u64, Error> {
    let words = num_words(size_in_bytes);
    
    // Linear cost
    let mut cost = words as u64 * MEMORY_GAS_PER_WORD;
    
    // Quadratic cost
    cost = cost.saturating_add(
        words.saturating_mul(words) as u64 / MEMORY_GAS_QUAD_COEFF_DIV
    );
    
    Ok(cost)
}
```

Key characteristics:
- Separate gas calculation function
- Use of saturating arithmetic to prevent overflow
- Clear error return for calculation errors
- Efficient implementation with minimal branches

### evmone (C++)

```cpp
inline int64_t memory_expansion_cost(uint64_t size, uint64_t current_size) noexcept {
    const auto new_words = ((size + 31) / 32);
    const auto old_words = ((current_size + 31) / 32);
    
    if (new_words <= old_words)
        return 0;
    
    const auto new_cost = 3 * new_words + new_words * new_words / 512;
    const auto old_cost = 3 * old_words + old_words * old_words / 512;
    return new_cost - old_cost;
}
```

Key characteristics:
- Calculates incremental cost rather than total cost
- Highly optimized implementation with minimal branches
- No error handling (assumes overflow doesn't happen)
- Direct integration with opcode execution

## Performance Considerations

The different implementations make various trade-offs between safety, readability, and performance:

### Tevm (Zig)

- **Strengths**: Clear code structure, explicit error handling, memory safety
- **Optimizations**: Unsafe variants for performance-critical paths, manual inlining
- **Trade-offs**: More verbose code, some repeated logic
- **Unique aspects**: Comprehensive debugging infrastructure, separate safe/unsafe paths

### go-ethereum

- **Strengths**: Battle-tested production code, comprehensive features
- **Optimizations**: Caching, optimized paths for common operations
- **Trade-offs**: Panic-based error handling, less explicit resource management
- **Unique aspects**: Integration with other go-ethereum components

### revm (Rust)

- **Strengths**: Type safety, efficient abstractions, clear error handling
- **Optimizations**: Zero-copy operations, Rust's compiler optimizations
- **Trade-offs**: More complex abstractions
- **Unique aspects**: Trait-based design for extensibility

### evmone (C++)

- **Strengths**: Maximum performance, minimal overhead
- **Optimizations**: Direct pointer manipulation, specialized dispatch
- **Trade-offs**: Less emphasis on readability, manual memory management
- **Unique aspects**: Computed goto dispatch, minimal abstraction layers

## Memory Safety and Error Handling

The implementations differ significantly in how they handle memory safety and errors:

### Tevm (Zig)

```zig
pub fn resize(self: *Memory, size: u64) !void {
    try self.store.resize(size);
}

pub fn getCopy(self: *const Memory, offset: u64, size: u64) []u8 {
    if (size == 0) {
        return &[_]u8{};
    }

    const cpy = self.allocator.alloc(u8, size) catch {
        @panic("memory allocation failed");
    };
    @memcpy(cpy, self.store.items[offset .. offset + size]);
    return cpy;
}
```

Uses explicit error handling with Zig's error unions and try/catch syntax, with clear ownership semantics.

### go-ethereum

```go
func (m *Memory) Resize(size uint64) {
    if size > uint64(len(m.store)) {
        m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
    }
}

func (m *Memory) GetCopy(offset, size int64) (cpy []byte) {
    if size == 0 {
        return nil
    }

    if len(m.store) > int(offset) {
        cpy = make([]byte, size)
        copy(cpy, m.store[offset:])
        return
    }
    return
}
```

Relies on Go's runtime checks with panics for error conditions, and garbage collection for memory management.

### revm (Rust)

```rust
pub fn resize_offset(&mut self, offset: usize, len: usize) -> Result<(), MemoryError> {
    if len == 0 {
        return Ok(());
    }

    let end = offset.checked_add(len).ok_or(MemoryError::OutOfBounds)?;
    self.resize(end)
}

pub fn view(&self, offset: usize, len: usize) -> Result<&[u8], MemoryError> {
    if len == 0 {
        return Ok(&[]);
    }
    
    let end = offset.checked_add(len).ok_or(MemoryError::OutOfBounds)?;
    if end > self.data.len() {
        return Err(MemoryError::OutOfBounds);
    }
    
    Ok(&self.data[offset..end])
}
```

Uses Rust's Result type for comprehensive error handling, with strong ownership semantics and borrow checking.

### evmone (C++)

```cpp
void Memory::grow(size_t size) {
    m_effective_size = std::max(m_effective_size, size);
    if (size > m_data.size())
        m_data.resize(size);
}

byteciew Memory::view(size_t offset, size_t size) const noexcept {
    if (offset + size > m_data.size())
        return {};
    return {m_data.data() + offset, size};
}
```

Uses exception-based error handling for critical errors, with direct memory access and manual bounds checking.

## Stack and Memory Limits

The implementations enforce similar limits, but with different approaches:

### Stack Limits

- All implementations limit stack size to 1024 elements
- All track stack depth for operations like SWAP and DUP
- All enforce bounds checking on stack operations

### Memory Limits

- No fixed memory size limit in any implementation
- All implementations track memory size for gas calculation
- All handle memory expansion with gas cost increases
- Quadratic gas cost effectively limits memory growth

## Conclusions

The memory, stack, and frame implementations across the four codebases highlight their different design philosophies:

1. **Tevm (Zig)** provides a clean, well-documented implementation with strong error handling and explicit resource management. It emphasizes clarity and correctness, with separate safe and unsafe paths for performance.

2. **go-ethereum** offers a comprehensive implementation focused on production use, with optimizations for common operations and integration with other go-ethereum components. It relies on Go's runtime for memory safety and error handling.

3. **revm (Rust)** leverages Rust's type system and ownership model for memory safety and error handling, with a focus on zero-cost abstractions and performance. Its trait-based design provides flexibility and extensibility.

4. **evmone (C++)** prioritizes raw performance with minimal abstraction, using direct memory manipulation and specialized dispatch mechanisms. It makes trade-offs favoring execution speed over code clarity.

All implementations correctly implement the EVM specification, but with different approaches to memory management, error handling, and performance optimization that reflect the strengths and idioms of their respective languages.