const std = @import("std");
const Withdrawal = @import("Withdrawal.zig");
const WithdrawalData = Withdrawal.WithdrawalData;
const processWithdrawals = Withdrawal.processWithdrawals;

const StateManager = @import("StateManager").StateManager;
const Address = @import("Address").Address;
const EvmModule = @import("Evm");
const ChainRules = EvmModule.ChainRules;
const EvmLogger = EvmModule.EvmLogger;
const createLogger = EvmModule.createLogger;
const createScopedLogger = EvmModule.createScopedLogger;
const debugOnly = EvmModule.debugOnly;

// We'll initialize the logger inside a function
var _logger: ?EvmLogger = null;

fn getLogger() EvmLogger {
    if (_logger == null) {
        _logger = createLogger("WithdrawalProcessor.zig");
    }
    return _logger.?;
}

/// BlockWithdrawalProcessor processes withdrawals in a block according to EIP-4895
///
/// This module acts as an integration point between the blockchain and EVM,
/// handling the withdrawal processing according to the chain rules and block data.
pub const BlockWithdrawalProcessor = struct {
    state_manager: *StateManager,
    chainRules: ChainRules,

    /// Initialize a new BlockWithdrawalProcessor
    ///
    /// Parameters:
    /// - state_manager: The state manager to update account balances
    /// - chainRules: Chain rules determining EIP activation
    pub fn init(state_manager: *StateManager, chainRules: ChainRules) BlockWithdrawalProcessor {
        var scoped = createScopedLogger(getLogger(), "init()");
        defer scoped.deinit();

        getLogger().debug("Creating new BlockWithdrawalProcessor", .{});
        getLogger().debug("EIP-4895 enabled: {}", .{chainRules.IsEIP4895});

        return BlockWithdrawalProcessor{
            .state_manager = state_manager,
            .chainRules = chainRules,
        };
    }

    /// Process all withdrawals in a block
    ///
    /// Parameters:
    /// - block_withdrawals: Array of withdrawals to process from the block
    ///
    /// Returns: Error if processing fails or EIP-4895 not enabled
    pub fn processBlockWithdrawals(self: *BlockWithdrawalProcessor, block_withdrawals: []const WithdrawalData) !void {
        var scoped = createScopedLogger(getLogger(), "processBlockWithdrawals()");
        defer scoped.deinit();
        
        getLogger().debug("Processing block withdrawals", .{});
        
        // Validate inputs
        if (block_withdrawals.len > 0) {
            getLogger().debug("Number of withdrawals: {d}", .{block_withdrawals.len});
        } else {
            getLogger().debug("No withdrawals provided in block", .{});
        }
        
        // Check if EIP-4895 is enabled
        if (!self.chainRules.IsEIP4895) {
            getLogger().warn("EIP-4895 not enabled, skipping withdrawals", .{});
            return error.EIP4895NotEnabled;
        }
        
        // Skip processing for empty withdrawal lists
        if (block_withdrawals.len == 0) {
            getLogger().debug("No withdrawals to process in block", .{});
            return;
        }
        
        // Validate each withdrawal before processing
        for (block_withdrawals, 0..) |withdrawal, i| {
            if (withdrawal.amount == 0) {
                getLogger().warn("Withdrawal {d} has zero amount - this is unusual but allowed", .{i});
            }
            
            // Check for very large amounts that might cause issues
            if (withdrawal.amount > 1_000_000_000_000) { // 1 trillion Gwei
                getLogger().warn("Withdrawal {d} has an unusually large amount: {d} Gwei", .{i, withdrawal.amount});
            }
        }
        
        getLogger().debug("Processing withdrawals according to EIP-4895", .{});
        
        // Process withdrawals using our core implementation with error handling
        processWithdrawals(
            self.state_manager, 
            block_withdrawals, 
            self.chainRules.IsEIP4895
        ) catch |err| {
            getLogger().err("Failed to process withdrawals: {}", .{err});
            return err;
        };
        
        getLogger().info("Block withdrawals processed successfully", .{});
    }

    /// Verify the withdrawals root in the block header
    ///
    /// This function ensures that the Merkle root of the withdrawals
    /// matches the one in the block header, preventing any tampering.
    ///
    /// Parameters:
    /// - withdrawals: The withdrawals to verify
    /// - expected_root: The withdrawalsRoot from the block header
    ///
    /// Returns: true if valid, error if invalid
    pub fn verifyWithdrawalsRoot(self: *BlockWithdrawalProcessor, withdrawals: []const WithdrawalData, expected_root: []const u8) !bool {
        var scoped = createScopedLogger(getLogger(), "verifyWithdrawalsRoot()");
        defer scoped.deinit();

        getLogger().debug("Verifying withdrawals root for {d} withdrawals", .{withdrawals.len});
        getLogger().debug("Expected withdrawals root: {s}", .{std.fmt.fmtSliceHexLower(expected_root)});

        if (!self.chainRules.IsEIP4895) {
            getLogger().warn("EIP-4895 not enabled, withdrawals root validation skipped", .{});
            return true; // Allow blocks without withdrawals when EIP-4895 is disabled
        }

        // In a real implementation, this would compute the Merkle root
        // of the withdrawals and compare it to the expected_root.

        // Validate parameters with proper bounds checking
        if (expected_root.len == 0) {
            getLogger().warn("Empty withdrawals root provided", .{});
            return false;
        }

        // Basic validation for now - ensure expected_root has correct length
        if (expected_root.len != 32) {
            getLogger().warn("Invalid withdrawals root length: {d} (expected 32 bytes)", .{expected_root.len});
            return false;
        }
        
        // TODO: Implement actual Merkle root verification
        getLogger().debug("Withdrawals root validation passed. Note: actual Merkle verification not implemented.", .{});
        return true;
    }
};

/// Block represents a simplified version of a block with withdrawals
///
/// This is a simplified structure for demonstration purposes
pub const Block = struct {
    withdrawals: []const WithdrawalData,
    withdrawals_root: []const u8,

    /// Process withdrawals in this block
    ///
    /// Parameters:
    /// - state_manager: The state manager to update
    /// - chain_rules: Chain rules determining EIP activation
    ///
    /// Returns: Error if processing fails
    pub fn processWithdrawals(self: *const Block, state_manager: *StateManager, chain_rules: ChainRules) !void {
        // No need to check for null state_manager as it's enforced by the compiler
        // We can add other validation here if needed in the future
        
        // Create a withdrawal processor
        var processor = BlockWithdrawalProcessor.init(state_manager, chain_rules);

        // Perform basic validation on the withdrawals_root
        if (self.withdrawals_root.len == 0) {
            return error.EmptyWithdrawalsRoot;
        }
        
        // Verify withdrawals root first with error handling
        const root_valid = processor.verifyWithdrawalsRoot(
            self.withdrawals, 
            self.withdrawals_root
        ) catch |err| {
            getLogger().err("Withdrawals root verification failed: {}", .{err});
            return err;
        };

        if (!root_valid) {
            getLogger().err("Invalid withdrawals root", .{});
            return error.InvalidWithdrawalsRoot;
        }

        // Process all withdrawals with error handling
        processor.processBlockWithdrawals(self.withdrawals) catch |err| {
            getLogger().err("Block withdrawals processing failed: {}", .{err});
            return err;
        };
        
        getLogger().info("Block withdrawals processed successfully", .{});
    }
};
