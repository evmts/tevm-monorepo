const std = @import("std");

// Use direct file imports to avoid module import issues
const StateManager = @import("../StateManager/StateManager.zig").StateManager;
const Address = @import("../Address/address.zig").Address;
const B160 = @import("../StateManager/StateManager.zig").B160;

// Use direct file imports for logging
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;
const createScopedLogger = @import("EvmLogger.zig").createScopedLogger;
const debugOnly = @import("EvmLogger.zig").debugOnly;

// We'll initialize the logger inside a function
var _logger: ?EvmLogger = null;

fn getLogger() EvmLogger {
    if (_logger == null) {
        _logger = createLogger("Withdrawal.zig");
    }
    return _logger.?;
}

// Convert Address ([20]u8) to B160 for StateManager

fn addressToB160(address: Address) B160 {
    var b160 = B160{ .bytes = undefined };
    // Safe copy with explicit sizes to prevent buffer overflows
    @memcpy(b160.bytes[0..20], address[0..20]);
    return b160;
}

/// WithdrawalData represents a withdrawal from the beacon chain to the EVM
/// as defined in EIP-4895
///
/// EIP-4895 introduces a new operation called withdrawals which enables
/// the transfer of ETH from the beacon chain to the EVM, required for
/// withdrawing validator rewards and stake.
pub const WithdrawalData = struct {
    /// The unique identifier for this withdrawal
    index: u64,

    /// The validator index in the beacon chain
    validatorIndex: u64,

    /// The recipient address in the EVM
    address: Address,

    /// Amount in Gwei (must be converted to Wei for EVM)
    amount: u64,

    /// Create a withdrawal from its components
    ///
    /// Parameters:
    /// - index: The withdrawal index (sequential)
    /// - validatorIndex: The validator index from the beacon chain
    /// - address: The EVM recipient address
    /// - amount: The amount in Gwei to withdraw
    ///
    /// Returns: A new WithdrawalData instance
    pub fn init(index: u64, validatorIndex: u64, address: Address, amount: u64) WithdrawalData {
        var scoped = createScopedLogger(getLogger(), "init()");
        defer scoped.deinit();

        getLogger().debug("Creating new withdrawal record", .{});
        getLogger().debug("  Index: {d}", .{index});
        getLogger().debug("  Validator Index: {d}", .{validatorIndex});
        getLogger().debug("  Amount (Gwei): {d}", .{amount});

        return WithdrawalData{
            .index = index,
            .validatorIndex = validatorIndex,
            .address = address,
            .amount = amount,
        };
    }

    /// Convert amount from Gwei to Wei (multiplication by 10^9)
    ///
    /// In the EVM, all values are handled in Wei, but withdrawals specify
    /// amounts in Gwei, so conversion is needed.
    ///
    /// Returns: The amount in Wei as a u128 (to handle large values)
    pub fn amountInWei(self: *const WithdrawalData) u128 {
        const GWEI_TO_WEI: u128 = 1_000_000_000; // 10^9
        return @as(u128, self.amount) * GWEI_TO_WEI;
    }
};

/// Processes a list of withdrawals by crediting the recipient accounts
///
/// This is the main implementation of EIP-4895, which takes a list of
/// withdrawals and applies them to the EVM state by increasing the
/// balance of the recipient accounts.
///
/// Parameters:
/// - stateManager: The state manager to update account balances
/// - withdrawals: The list of withdrawals to process
/// - isEIP4895Enabled: Whether EIP-4895 is enabled in the chain rules
///
/// Returns: An error if the state update fails
pub fn processWithdrawals(stateManager: *StateManager, withdrawals: []const WithdrawalData, isEIP4895Enabled: bool) !void {
    var scoped = createScopedLogger(getLogger(), "processWithdrawals()");
    defer scoped.deinit();

    if (!isEIP4895Enabled) {
        getLogger().warn("Attempted to process withdrawals with EIP-4895 disabled", .{});
        return error.EIP4895NotEnabled;
    }

    getLogger().debug("Processing {d} withdrawals", .{withdrawals.len});

    for (withdrawals, 0..) |withdrawal, i| {
        getLogger().debug("Processing withdrawal {d}/{d} (index {d})", .{ i + 1, withdrawals.len, withdrawal.index });
        getLogger().debug("  Recipient: {}", .{withdrawal.address});

        const amountInWei = withdrawal.amountInWei();
        getLogger().debug("  Amount: {d} Gwei ({d} Wei)", .{ withdrawal.amount, amountInWei });

        try rewardAccount(stateManager, withdrawal.address, amountInWei);

        getLogger().debug("  Withdrawal processed successfully", .{});
    }

    getLogger().info("All withdrawals processed successfully", .{});
}

/// Rewards an account by increasing its balance
///
/// This function gets the account state, increases its balance by the
/// specified amount, and saves the updated state back to the state manager.
///
/// Parameters:
/// - stateManager: The state manager to update
/// - address: The address of the account to reward
/// - amount: The amount (in Wei) to add to the account's balance
///
/// Returns: An error if the state update fails
fn rewardAccount(stateManager: *StateManager, address: Address, amount: u128) !void {
    var scoped = createScopedLogger(getLogger(), "rewardAccount()");
    defer scoped.deinit();

    getLogger().debug("Rewarding account: {}", .{address});
    getLogger().debug("Amount: {d} Wei", .{amount});

    // Convert address to B160 for StateManager
    const b160_address = addressToB160(address);

    // Get the account from state (or create a new one if it doesn't exist)
    var account = try stateManager.getAccount(b160_address) orelse blk: {
        getLogger().debug("Account does not exist, creating new account", .{});
        break :blk try stateManager.createAccount(b160_address, 0);
    };

    // Increase the account balance
    const oldBalance = account.balance;
    account.balance += amount;

    getLogger().debug("Balance updated: {d} -> {d}", .{ oldBalance, account.balance });

    // Save the updated account state
    try stateManager.putAccount(b160_address, account);

    getLogger().debug("Account rewarded successfully", .{});
}
