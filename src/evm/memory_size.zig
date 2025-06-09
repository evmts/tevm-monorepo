/// Memory access requirements for EVM operations.
///
/// MemorySize encapsulates the memory region that an operation needs to access,
/// defined by an offset and size. This is used for:
/// - Calculating memory expansion costs
/// - Validating memory bounds
/// - Pre-allocating memory before operations
///
/// ## Memory Expansion
/// The EVM charges gas for memory expansion in 32-byte words. When an operation
/// accesses memory beyond the current size, the memory must expand to accommodate
/// it, incurring additional gas costs.
///
/// ## Gas Calculation
/// Memory expansion cost is quadratic:
/// - memory_cost = (memory_size_word ** 2) / 512 + (3 * memory_size_word)
/// - memory_size_word = (offset + size + 31) / 32
///
/// ## Zero-Size Edge Case
/// Operations with size=0 don't access memory and don't trigger expansion,
/// regardless of the offset value. This is important for operations like
/// RETURNDATACOPY with zero length.
///
/// Example:
/// ```zig
/// // MLOAD at offset 0x100 needs 32 bytes
/// const mem_size = MemorySize{ .offset = 0x100, .size = 32 };
/// 
/// // Calculate required memory size
/// const required = mem_size.offset + mem_size.size; // 0x120
/// ```
const MemorySize = @This();

/// Starting offset in memory where the operation begins.
/// This is typically popped from the stack.
offset: u64,

/// Number of bytes the operation needs to access.
/// A size of 0 means no memory access (and no expansion).
size: u64,
