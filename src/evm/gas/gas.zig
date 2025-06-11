/// Gas-related utilities and tracking for EVM execution.
///
/// This module provides infrastructure for tracking gas refunds and
/// original storage values needed for complex EIP-2200 SSTORE operations.

pub const RefundTracker = @import("refund_tracker.zig").RefundTracker;
pub const StorageOriginalValues = @import("storage_original_values.zig").StorageOriginalValues;
pub const StorageKeyContext = @import("storage_original_values.zig").StorageKeyContext;
pub const get_or_store_original = @import("storage_original_values.zig").get_or_store_original;
pub const SStoreGasCalculator = @import("sstore_gas.zig").SStoreGasCalculator;
pub const SStoreResult = @import("sstore_gas.zig").SStoreResult;
pub const calculate_sstore_operation = @import("sstore_gas.zig").calculate_sstore_operation;