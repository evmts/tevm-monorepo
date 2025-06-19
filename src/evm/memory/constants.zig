/// Memory-related constants for EVM execution contexts.
/// Initial capacity for memory buffer (4KB)
pub const InitialCapacity: usize = 4 * 1024;

/// Default memory limit (32MB)
pub const DefaultMemoryLimit: u64 = 32 * 1024 * 1024;

/// Calculate number of 32-byte words needed for byte length (rounds up)
pub fn calculate_num_words(len: usize) usize {
    return (len + 31) / 32;
}
