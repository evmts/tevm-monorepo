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
/// EIP-1559 introduced a new transaction type with a fee market mechanism that:
/// - Burns the base fee (removing ETH from circulation)
/// - Allows users to specify maximum fees they're willing to pay
/// - Provides more predictable transaction confirmation times
/// - Reduces the incentive for miners to manipulate fees
///
/// Key differences from legacy transactions:
/// - max_fee_per_gas: Maximum total fee per gas the sender is willing to pay
/// - max_priority_fee_per_gas: Maximum tip per gas the sender is willing to pay to miners
/// - access_list: List of addresses and storage slots the transaction plans to access
pub const FeeMarketTransaction = struct {
    /// Chain ID for replay protection (EIP-155)
    /// Prevents transactions from one network being replayed on another
    chain_id: u64,
    
    /// Sender's account nonce
    /// Incremented for each transaction to prevent replay attacks
    nonce: u64,
    
    /// Maximum priority fee (tip) per gas unit
    /// This portion goes directly to miners/validators as an incentive
    max_priority_fee_per_gas: u64,
    
    /// Maximum total fee per gas the sender is willing to pay
    /// Includes both the base fee (burned) and priority fee (to miners)
    max_fee_per_gas: u64,
    
    /// Maximum amount of gas this transaction can consume
    /// Protects senders from spending more than intended on gas
    gas_limit: u64,
    
    /// Recipient address (null for contract creation transactions)
    /// When null, the transaction creates a new contract
    to: ?Address,
    
    /// Amount of ether (in wei) to transfer with the transaction
    value: u256,
    
    /// Transaction input data (for contract calls or deployments)
    /// Contains function selectors and parameters or contract bytecode
    data: []const u8,
    
    /// Optional pre-declared storage accesses for gas optimization
    /// Allows the EVM to pre-warm accesses for lower gas costs
    access_list: AccessList,
    
    /// ECDSA signature components
    /// These values prove the transaction was authorized by the sender
    signature_yParity: bool, // Parity bit for the y-coordinate
    signature_r: [32]u8,     // r component of the signature
    signature_s: [32]u8,     // s component of the signature
    
    /// Recover the sender's address from the transaction's signature
    ///
    /// This uses ECDSA signature recovery to determine which Ethereum address
    /// authorized this transaction. The process involves:
    /// 1. Constructing the transaction hash (signed message)
    /// 2. Recovering the public key from the signature components
    /// 3. Deriving the Ethereum address from the public key
    ///
    /// Returns: The sender's address
    pub fn getSender(self: *const FeeMarketTransaction) !Address {
        // Note: This is a placeholder implementation
        // A complete implementation would:
        // 1. RLP encode the transaction without the signature
        // 2. Hash the encoded transaction with keccak256
        // 3. Recover the public key using the signature components
        // 4. Hash the public key and take the last 20 bytes as the address
        
        // For now, return a placeholder address
        var addr_bytes = [_]u8{0} ** 20;
        return Address{ .bytes = addr_bytes };
    }
    
    /// Calculate the effective gas price for this transaction
    ///
    /// Under EIP-1559, the actual gas price paid is calculated based on:
    /// - The current block's base fee (which is burned)
    /// - The transaction's maximum fee per gas
    /// - The transaction's maximum priority fee per gas (tip to miners)
    ///
    /// The calculation follows these rules:
    /// 1. The effective gas price cannot exceed the max_fee_per_gas
    /// 2. The priority fee (tip) is capped at max_priority_fee_per_gas
    /// 3. The remaining amount after base fee goes to miners as a tip
    ///
    /// Parameters:
    /// - base_fee_per_gas: The current block's base fee (in wei)
    ///
    /// Returns: A struct containing the effective gas price and miner tip
    pub fn getEffectiveGasPrice(self: *const FeeMarketTransaction, base_fee_per_gas: u64) struct {
        effective_gas_price: u64,
        miner_tip: u64,
    } {
        const scoped = createScopedLogger(logger, "getEffectiveGasPrice()");
        defer scoped.deinit();
        
        logger.debug("Calculating effective gas price for EIP-1559 transaction", .{});
        logger.debug("Block base fee: {d} wei", .{base_fee_per_gas});
        logger.debug("Transaction max fee: {d} wei, max priority fee: {d} wei", .{
            self.max_fee_per_gas, self.max_priority_fee_per_gas
        });
        
        // Delegate to the FeeMarket module for the calculation
        // This ensures consistent fee calculations across the codebase
        const result = FeeMarket.getEffectiveGasPrice(
            base_fee_per_gas,
            self.max_fee_per_gas,
            self.max_priority_fee_per_gas
        );
        
        logger.debug("Calculated effective gas price: {d} wei", .{result.effective_gas_price});
        logger.debug("Miner tip portion: {d} wei", .{result.miner_fee});
        
        return .{
            .effective_gas_price = result.effective_gas_price,
            .miner_tip = result.miner_fee,
        };
    }
    
    /// Calculate the total cost of this transaction in wei
    ///
    /// The total cost of a transaction consists of:
    /// 1. The maximum gas cost (gas_limit * effective_gas_price)
    /// 2. The value being transferred to the recipient
    ///
    /// Note: This calculates the maximum cost a sender needs to have available
    /// in their account. The actual cost may be lower if the transaction
    /// uses less gas than the gas limit.
    ///
    /// Parameters:
    /// - base_fee_per_gas: The current block's base fee
    ///
    /// Returns: The total maximum cost in wei
    pub fn getCost(self: *const FeeMarketTransaction, base_fee_per_gas: u64) u256 {
        const scoped = createScopedLogger(logger, "getCost()");
        defer scoped.deinit();
        
        logger.debug("Calculating maximum transaction cost", .{});
        
        // Calculate the effective gas price based on current base fee
        const gas_price_info = self.getEffectiveGasPrice(base_fee_per_gas);
        const effective_gas_price = gas_price_info.effective_gas_price;
        
        // Calculate the maximum gas cost (gas_limit * effective_gas_price)
        // This is the maximum amount that could be spent on gas
        const gas_cost: u256 = @as(u256, effective_gas_price) * @as(u256, self.gas_limit);
        
        // Add the transferred value to get the total transaction cost
        const total_cost = gas_cost + self.value;
        
        logger.debug("Maximum gas cost: {d} wei", .{gas_cost});
        logger.debug("Transferred value: {d} wei", .{self.value});
        logger.debug("Total transaction cost: {d} wei", .{total_cost});
        
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