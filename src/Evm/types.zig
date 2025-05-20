// Common types used across the EVM module
// This file exists to prevent circular dependencies and ensure consistent type definitions

const std = @import("std");

// Export the U256 type from Stack.zig
pub const @"u256" = @import("Stack.zig").@"u256";

// Re-export other common types as needed