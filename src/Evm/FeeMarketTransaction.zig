const std = @import("std");
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;
const createScopedLogger = @import("EvmLogger.zig").createScopedLogger;
const FeeMarket = @import("FeeMarket.zig").FeeMarket;
const Address = @import("../Address/address.zig").Address;

// Create a file-specific logger
const logger = createLogger(@src().file);

/// TransactionType enum for the different types of transactions in Ethereum
/// 
/// EIP-2718 introduced typed transactions to Ethereum, with each type
/// having a different format and capabilities. 
pub const TransactionType = enum(u8) {
    /// Legacy transaction (pre-EIP-2718)
    /// The original transaction format without an explicit type
    Legacy = 0,
    
    /// AccessList transaction (EIP-2930)
    /// Introduced access lists to optimize gas usage for contract interactions
    AccessList = 1,
    
    /// FeeMarket transaction (EIP-1559)
    /// Introduced base fee and priority fee for improved fee market dynamics
    FeeMarket = 2,
    
    /// Blob transaction (EIP-4844)
    /// Supports data blobs for Layer 2 rollups with reduced gas costs
    Blob = 3,
};

/// AccessListEntry represents a single entry in an access list
/// 
/// These entries are used in both EIP-2930 and EIP-1559 transactions to
/// specify addresses and storage slots that will be accessed during execution.
/// Pre-declaring these accesses optimizes gas costs under EIP-2929 by marking
/// the slots as "warm" before transaction execution begins.
pub const AccessListEntry = struct {
    /// The Ethereum address being accessed during transaction execution
    address: Address,
    
    /// List of 32-byte storage slot keys that will be accessed at this address
    /// Each key corresponds to a specific storage slot in the account's state
    storage_keys: []const [32]u8,
};

/// AccessList represents a complete list of addresses and storage slots
/// that will be accessed during transaction execution.
///
/// Benefits of using access lists:
/// 1. Gas savings: Pre-declared accesses have reduced gas costs under EIP-2929
/// 2. Predictability: Helps prevent unexpected out-of-gas errors from cold accesses
/// 3. Optimization: Makes gas costs more predictable for complex transactions
///
/// This type is a slice of AccessListEntry structures.
pub const AccessList = []const AccessListEntry;

/// FeeMarketTransaction represents an EIP-1559 transaction
///
/// EIP-1559 transactions have the following additional fields compared to legacy transactions:
/// - max_fee_per_gas: Maximum total fee per gas the sender is willing to pay
/// - max_priority_fee_per_gas: Maximum tip per gas the sender is willing to pay to miners
/// - access_list: List of addresses and storage slots the transaction plans to access
pub const FeeMarketTransaction = struct {
    /// Chain ID for replay protection
    chain_id: u64,
    
    /// Sender's nonce
    nonce: u64,
    
    /// Maximum tip per gas to be given to miners
    max_priority_fee_per_gas: u64,
    
    /// Maximum total fee per gas the sender is willing to pay
    max_fee_per_gas: u64,
    
    /// Maximum gas the transaction may consume
    gas_limit: u64,
    
    /// Recipient address (null for contract creation)
    to: ?Address,
    
    /// Value in wei to be transferred
    value: u256,
    
    /// Transaction data payload
    data: []const u8,
    
    /// List of addresses and storage keys the transaction plans to access
    access_list: AccessList,
    
    /// Signature values
    signature_yParity: bool,
    signature_r: [32]u8,
    signature_s: [32]u8,
    
    /// Calculate the sender's address from the transaction's signature
    ///
    /// Returns: The sender's address
    pub fn getSender(self: *const FeeMarketTransaction) !Address {
        // In a real implementation, this would recover the address from the signature
        // For now, return a placeholder
        var addr_bytes = [_]u8{0} ** 20;
        return Address{ .bytes = addr_bytes };
    }
    
    /// Calculate the effective gas price for this transaction
    ///
    /// This uses the EIP-1559 rules to determine how much gas price is
    /// effectively paid, and how much goes to the miner vs. being burned.
    ///
    /// Parameters:
    /// - base_fee_per_gas: The block's base fee
    ///
    /// Returns: The effective gas price and the miner tip
    pub fn getEffectiveGasPrice(self: *const FeeMarketTransaction, base_fee_per_gas: u64) struct {
        effective_gas_price: u64,
        miner_tip: u64,
    } {
        const scoped = createScopedLogger(logger, "getEffectiveGasPrice()");
        defer scoped.deinit();
        
        logger.debug("Calculating effective gas price for EIP-1559 transaction", .{});
        logger.debug("Base fee: {d}, max fee: {d}, max priority fee: {d}", .{
            base_fee_per_gas, self.max_fee_per_gas, self.max_priority_fee_per_gas
        });
        
        const result = FeeMarket.getEffectiveGasPrice(
            base_fee_per_gas,
            self.max_fee_per_gas,
            self.max_priority_fee_per_gas
        );
        
        logger.debug("Effective gas price: {d}, miner tip: {d}", .{
            result.effective_gas_price, result.miner_fee
        });
        
        return .{
            .effective_gas_price = result.effective_gas_price,
            .miner_tip = result.miner_fee,
        };
    }
    
    /// Calculate the cost of this transaction in wei
    ///
    /// This calculates the total cost including the transferred value
    /// and the gas cost at the effective gas price.
    ///
    /// Parameters:
    /// - base_fee_per_gas: The block's base fee
    ///
    /// Returns: The total cost in wei
    pub fn getCost(self: *const FeeMarketTransaction, base_fee_per_gas: u64) u256 {
        const scoped = createScopedLogger(logger, "getCost()");
        defer scoped.deinit();
        
        logger.debug("Calculating transaction cost", .{});
        
        // Get the effective gas price
        const gas_price_info = self.getEffectiveGasPrice(base_fee_per_gas);
        const effective_gas_price = gas_price_info.effective_gas_price;
        
        // Calculate the gas cost
        const gas_cost: u256 = @as(u256, effective_gas_price) * @as(u256, self.gas_limit);
        
        // Add the transferred value
        const total_cost = gas_cost + self.value;
        
        logger.debug("Gas cost: {d}, value: {d}, total cost: {d}", .{
            gas_cost, self.value, total_cost
        });
        
        return total_cost;
    }
    
    /// Encode the transaction to RLP format
    ///
    /// In a real implementation, this would encode the transaction to RLP format
    /// which is used for serialization in Ethereum.
    ///
    /// Returns: The RLP-encoded transaction
    pub fn encodeRLP(self: *const FeeMarketTransaction, allocator: std.mem.Allocator) ![]u8 {
        _ = self;
        _ = allocator;
        // In a real implementation, this would encode the transaction to RLP
        // For now, return a placeholder
        return allocator.alloc(u8, 0);
    }
    
    /// Calculate the hash of this transaction
    ///
    /// This hash is used as the transaction ID.
    ///
    /// Returns: The 32-byte transaction hash
    pub fn hash(self: *const FeeMarketTransaction) ![32]u8 {
        _ = self;
        // In a real implementation, this would calculate the keccak256 hash
        // of the RLP-encoded transaction
        // For now, return a placeholder
        return [_]u8{0} ** 32;
    }
    
    /// Create a new FeeMarketTransaction
    ///
    /// This is a constructor for the FeeMarketTransaction struct.
    ///
    /// Parameters:
    /// - allocator: Memory allocator
    /// - chain_id: Chain ID for replay protection
    /// - nonce: Sender's nonce
    /// - max_priority_fee_per_gas: Maximum tip per gas for miners
    /// - max_fee_per_gas: Maximum total fee per gas
    /// - gas_limit: Maximum gas the transaction may consume
    /// - to: Recipient address (null for contract creation)
    /// - value: Value in wei to be transferred
    /// - data: Transaction data payload
    /// - access_list: List of addresses and storage keys to access
    /// - signature_yParity: Signature Y parity
    /// - signature_r: Signature R value
    /// - signature_s: Signature S value
    ///
    /// Returns: A new FeeMarketTransaction
    pub fn create(
        allocator: std.mem.Allocator,
        chain_id: u64,
        nonce: u64,
        max_priority_fee_per_gas: u64,
        max_fee_per_gas: u64,
        gas_limit: u64,
        to: ?Address,
        value: u256,
        data: []const u8,
        access_list: AccessList,
        signature_yParity: bool,
        signature_r: [32]u8,
        signature_s: [32]u8,
    ) !*FeeMarketTransaction {
        const scoped = createScopedLogger(logger, "create()");
        defer scoped.deinit();
        
        logger.debug("Creating new EIP-1559 fee market transaction", .{});
        
        // Validate the max_fee_per_gas is at least max_priority_fee_per_gas
        if (max_fee_per_gas < max_priority_fee_per_gas) {
            logger.err("max_fee_per_gas ({d}) is less than max_priority_fee_per_gas ({d})", .{
                max_fee_per_gas, max_priority_fee_per_gas
            });
            return error.InvalidFee;
        }
        
        // Allocate a new transaction
        var tx = try allocator.create(FeeMarketTransaction);
        
        // Copy the data
        var data_copy = try allocator.alloc(u8, data.len);
        std.mem.copy(u8, data_copy, data);
        
        // Copy the access list (in a real implementation)
        // For now, we're just storing the reference since this is for testing
        
        // Initialize the transaction
        tx.* = FeeMarketTransaction{
            .chain_id = chain_id,
            .nonce = nonce,
            .max_priority_fee_per_gas = max_priority_fee_per_gas,
            .max_fee_per_gas = max_fee_per_gas,
            .gas_limit = gas_limit,
            .to = to,
            .value = value,
            .data = data_copy,
            .access_list = access_list,
            .signature_yParity = signature_yParity,
            .signature_r = signature_r,
            .signature_s = signature_s,
        };
        
        logger.info("Created EIP-1559 transaction with max fee {d} and priority fee {d}", .{
            max_fee_per_gas, max_priority_fee_per_gas
        });
        
        return tx;
    }
    
    /// Free resources used by the transaction
    ///
    /// This releases any memory allocated by the transaction.
    ///
    /// Parameters:
    /// - allocator: Memory allocator used to create the transaction
    pub fn deinit(self: *FeeMarketTransaction, allocator: std.mem.Allocator) void {
        logger.debug("Deallocating EIP-1559 transaction", .{});
        
        // Free the data
        allocator.free(self.data);
        
        // Free the transaction
        allocator.destroy(self);
    }
};

// Tests for the FeeMarketTransaction implementation

test "FeeMarketTransaction - basic functionality" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Create a test transaction
    var to_bytes = [_]u8{0} ** 20;
    to_bytes[19] = 1;
    const to = Address{ .bytes = to_bytes };
    
    const data = [_]u8{ 0xAB, 0xCD, 0xEF };
    const access_list = [_]AccessListEntry{};
    
    var tx = try FeeMarketTransaction.create(
        allocator,
        1, // chain_id
        42, // nonce
        1_000_000_000, // max_priority_fee_per_gas (1 gwei)
        2_000_000_000, // max_fee_per_gas (2 gwei)
        100_000, // gas_limit
        to, // to
        1_000_000_000_000_000_000, // value (1 ETH)
        &data, // data
        &access_list, // access_list
        false, // signature_yParity
        [_]u8{0} ** 32, // signature_r
        [_]u8{0} ** 32, // signature_s
    );
    defer tx.deinit(allocator);
    
    // Test getEffectiveGasPrice
    {
        const base_fee = 500_000_000; // 0.5 gwei
        const result = tx.getEffectiveGasPrice(base_fee);
        
        // Effective gas price should be base fee + priority fee = 1.5 gwei
        try testing.expectEqual(@as(u64, 1_500_000_000), result.effective_gas_price);
        
        // Miner tip should be the priority fee = 1 gwei
        try testing.expectEqual(@as(u64, 1_000_000_000), result.miner_tip);
    }
    
    // Test with base fee higher than expected
    {
        const base_fee = 1_500_000_000; // 1.5 gwei
        const result = tx.getEffectiveGasPrice(base_fee);
        
        // Effective gas price should be limited to max fee = 2 gwei
        try testing.expectEqual(@as(u64, 2_000_000_000), result.effective_gas_price);
        
        // Miner tip should be what's left after base fee = 0.5 gwei
        try testing.expectEqual(@as(u64, 500_000_000), result.miner_tip);
    }
    
    // Test getCost
    {
        const base_fee = 500_000_000; // 0.5 gwei
        const cost = tx.getCost(base_fee);
        
        // Gas cost should be 1.5 gwei * 100,000 gas = 150,000,000,000 wei
        // Plus 1 ETH value = 1,000,000,000,000,000,000 wei
        // Total = 1,000,000,000,150,000,000 wei
        const expected_gas_cost: u256 = 150_000_000_000;
        const expected_total: u256 = 1_000_000_000_000_000_000 + expected_gas_cost;
        
        try testing.expectEqual(expected_total, cost);
    }
}

test "FeeMarketTransaction - error handling" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Try to create a transaction with max_fee < max_priority_fee
    var to_bytes = [_]u8{0} ** 20;
    to_bytes[19] = 1;
    const to = Address{ .bytes = to_bytes };
    
    const data = [_]u8{ 0xAB, 0xCD, 0xEF };
    const access_list = [_]AccessListEntry{};
    
    const result = FeeMarketTransaction.create(
        allocator,
        1, // chain_id
        42, // nonce
        2_000_000_000, // max_priority_fee_per_gas (2 gwei)
        1_000_000_000, // max_fee_per_gas (1 gwei) - INVALID!
        100_000, // gas_limit
        to, // to
        1_000_000_000_000_000_000, // value (1 ETH)
        &data, // data
        &access_list, // access_list
        false, // signature_yParity
        [_]u8{0} ** 32, // signature_r
        [_]u8{0} ** 32, // signature_s
    );
    
    // Should fail with InvalidFee error
    try testing.expectError(error.InvalidFee, result);
}