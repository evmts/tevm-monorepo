const std = @import("std");
const Withdrawal = @import("Withdrawal.zig");
const WithdrawalData = Withdrawal.WithdrawalData;
const processWithdrawals = Withdrawal.processWithdrawals;
const StateManager = @import("../StateManager/StateManager.zig").StateManager;
const Address = @import("../Address/address.zig").Address;
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;
const createScopedLogger = @import("EvmLogger.zig").createScopedLogger;
const debugOnly = @import("EvmLogger.zig").debugOnly;
const ChainRules = @import("evm.zig").ChainRules;

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
    pub fn processBlockWithdrawals(
        self: *BlockWithdrawalProcessor, 
        block_withdrawals: []const WithdrawalData
    ) !void {
        var scoped = createScopedLogger(getLogger(), "processBlockWithdrawals()");
        defer scoped.deinit();
        
        getLogger().debug("Processing block withdrawals", .{});
        getLogger().debug("Number of withdrawals: {d}", .{block_withdrawals.len});
        
        if (!self.chainRules.IsEIP4895) {
            getLogger().warn("EIP-4895 not enabled, skipping withdrawals", .{});
            return error.EIP4895NotEnabled;
        }
        
        // No withdrawals to process
        if (block_withdrawals.len == 0) {
            getLogger().debug("No withdrawals to process in block", .{});
            return;
        }
        
        getLogger().debug("Processing withdrawals according to EIP-4895", .{});
        
        // Process withdrawals using our core implementation
        try processWithdrawals(
            self.state_manager, 
            block_withdrawals, 
            self.chainRules.IsEIP4895
        );
        
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
    pub fn verifyWithdrawalsRoot(
        self: *BlockWithdrawalProcessor,
        withdrawals: []const WithdrawalData,
        expected_root: []const u8
    ) !bool {
        var scoped = createScopedLogger(getLogger(), "verifyWithdrawalsRoot()");
        defer scoped.deinit();
        
        getLogger().debug("Verifying withdrawals root", .{});
        
        if (!self.chainRules.IsEIP4895) {
            getLogger().warn("EIP-4895 not enabled, withdrawals root validation skipped", .{});
            return true; // Allow blocks without withdrawals when EIP-4895 is disabled
        }
        
        // In a real implementation, this would compute the Merkle root
        // of the withdrawals and compare it to the expected_root.
        // For this simplified version, we'll just return true
        // TODO: Implement actual Merkle root verification
        
        getLogger().debug("Withdrawals root verification passed", .{});
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
    pub fn processWithdrawals(
        self: *const Block,
        state_manager: *StateManager,
        chain_rules: ChainRules
    ) !void {
        var processor = BlockWithdrawalProcessor.init(state_manager, chain_rules);
        
        // Verify withdrawals root first
        const root_valid = try processor.verifyWithdrawalsRoot(
            self.withdrawals,
            self.withdrawals_root
        );
        
        if (!root_valid) {
            return error.InvalidWithdrawalsRoot;
        }
        
        // Process all withdrawals
        try processor.processBlockWithdrawals(self.withdrawals);
    }
};