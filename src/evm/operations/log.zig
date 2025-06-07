/// Event logging operations module for the EVM
/// 
/// This module provides the LOG operations (LOG0 through LOG4) which emit
/// events on the blockchain. Events are a crucial part of smart contract
/// communication, allowing contracts to signal state changes and provide
/// data to external observers (dApps, indexers, etc.).

const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const log = opcodes.log;

/// LOG operations implementation functions
/// 
/// LOG operations emit events with 0 to 4 indexed topics plus arbitrary data.
/// These operations are created dynamically in the jump table based on the
/// number of topics (0-4). The actual Operation structs are generated at runtime.
/// 
/// Gas cost formula: 375 + 375 × topic_count + 8 × data_size + memory_expansion_cost
/// 
/// Note: LOG operations are not allowed in static calls (will revert).

/// LOG0 operation (0xA0): Emit Event with No Topics
/// 
/// Emits an event with data but no indexed topics.
/// Used for simple logging without indexed parameters.
/// 
/// Stack: [..., offset, size] → [...]
/// 
/// Where:
/// - offset: Starting position in memory for event data
/// - size: Number of bytes of event data
pub const op_log0 = log.op_log0;

/// LOG1 operation (0xA1): Emit Event with 1 Topic
/// 
/// Emits an event with one indexed topic and data.
/// Typically, topic0 is the event signature hash.
/// 
/// Stack: [..., offset, size, topic0] → [...]
/// 
/// Where:
/// - offset: Starting position in memory for event data
/// - size: Number of bytes of event data
/// - topic0: First indexed topic (usually event signature)
pub const op_log1 = log.op_log1;

/// LOG2 operation (0xA2): Emit Event with 2 Topics
/// 
/// Emits an event with two indexed topics and data.
/// Used when one parameter needs to be indexed for filtering.
/// 
/// Stack: [..., offset, size, topic0, topic1] → [...]
/// 
/// Where:
/// - offset: Starting position in memory for event data
/// - size: Number of bytes of event data
/// - topic0: First indexed topic (usually event signature)
/// - topic1: Second indexed topic (indexed parameter)
pub const op_log2 = log.op_log2;

/// LOG3 operation (0xA3): Emit Event with 3 Topics
/// 
/// Emits an event with three indexed topics and data.
/// Used when two parameters need to be indexed for filtering.
/// 
/// Stack: [..., offset, size, topic0, topic1, topic2] → [...]
/// 
/// Where:
/// - offset: Starting position in memory for event data
/// - size: Number of bytes of event data
/// - topic0: First indexed topic (usually event signature)
/// - topic1: Second indexed topic (first indexed parameter)
/// - topic2: Third indexed topic (second indexed parameter)
pub const op_log3 = log.op_log3;

/// LOG4 operation (0xA4): Emit Event with 4 Topics
/// 
/// Emits an event with four indexed topics and data.
/// Maximum number of indexed topics supported by EVM.
/// 
/// Stack: [..., offset, size, topic0, topic1, topic2, topic3] → [...]
/// 
/// Where:
/// - offset: Starting position in memory for event data
/// - size: Number of bytes of event data
/// - topic0: First indexed topic (usually event signature)
/// - topic1: Second indexed topic (first indexed parameter)
/// - topic2: Third indexed topic (second indexed parameter)
/// - topic3: Fourth indexed topic (third indexed parameter)
/// 
/// Note: Indexed parameters allow efficient filtering but are limited
/// to 32 bytes each. Larger values are hashed before indexing.
pub const op_log4 = log.op_log4;
