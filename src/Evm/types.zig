// Common types used across the EVM module
// This file exists to prevent circular dependencies and ensure consistent type definitions

const std = @import("std");

// Export the U256 type directly to avoid circular dependencies
pub const @"u256" = u64;

// Re-export other common types as needed