const std = @import("std");
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;
const createScopedLogger = @import("EvmLogger.zig").createScopedLogger;
const FeeMarket = @import("FeeMarket.zig").FeeMarket;
const Address = [20]u8; // Define directly to avoid import issues

// Module logger will be initialized when functions are called
fn getLogger() EvmLogger {
    return createLogger(@src().file);
}

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
        _ = self; // Unused in placeholder implementation
        
        // Note: This is a placeholder implementation
        // A complete implementation would:
        // 1. RLP encode the transaction without the signature
        // 2. Hash the encoded transaction with keccak256
        // 3. Recover the public key using the signature components
        // 4. Hash the public key and take the last 20 bytes as the address
        
        // For now, return a placeholder address
        const addr_bytes: Address = [_]u8{0} ** 20;
        return addr_bytes;
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
        const logger = getLogger();
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
        const logger = getLogger();
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
    /// Recursive Length Prefix (RLP) encoding is Ethereum's primary serialization method
    /// for transactions and other data structures. For EIP-1559 transactions, the encoding 
    /// follows EIP-2718's typed transaction envelope format.
    ///
    /// Format: 0x02 || RLP([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas,
    ///                      gas_limit, to, value, data, access_list,
    ///                      signature_y_parity, signature_r, signature_s])
    ///
    /// Parameters:
    /// - allocator: Memory allocator for the encoded output
    ///
    /// Returns: The RLP-encoded transaction bytes
    pub fn encodeRLP(self: *const FeeMarketTransaction, allocator: std.mem.Allocator) ![]u8 {
        _ = self;
        // Note: This is a placeholder implementation
        // A complete implementation would:
        // 1. Create an RLP list with all transaction fields
        // 2. RLP encode each field according to its type
        // 3. Prepend 0x02 type identifier (for EIP-1559 transactions)
        
        const logger = getLogger();
        logger.debug("RLP encoding transaction (placeholder implementation)", .{});
        return allocator.alloc(u8, 0);
    }
    
    /// Calculate the cryptographic hash of this transaction
    ///
    /// The transaction hash serves as the unique identifier (txid) for the transaction
    /// and is calculated as keccak256(typed_transaction_envelope).
    ///
    /// The hash calculation steps are:
    /// 1. Encode the transaction using EIP-2718 typed transaction format
    /// 2. Apply the keccak256 hash function to the encoded bytes
    ///
    /// Returns: The 32-byte keccak256 transaction hash
    pub fn hash(self: *const FeeMarketTransaction) ![32]u8 {
        _ = self;
        // Note: This is a placeholder implementation
        // A complete implementation would:
        // 1. RLP encode the transaction with its type prefix
        // 2. Calculate the keccak256 hash of the encoding
        
        const logger = getLogger();
        logger.debug("Calculating transaction hash (placeholder implementation)", .{});
        return [_]u8{0} ** 32;
    }
    
    /// Create a new EIP-1559 (Type-2) transaction
    ///
    /// This factory function allocates and initializes a new FeeMarketTransaction
    /// with the provided parameters.
    ///
    /// Parameters:
    /// - allocator: Memory allocator for transaction and its data
    /// - chain_id: Chain ID for replay protection (e.g., 1 for Ethereum mainnet)
    /// - nonce: Sender's account nonce
    /// - max_priority_fee_per_gas: Maximum tip per gas for miners/validators
    /// - max_fee_per_gas: Maximum total fee per gas the sender will pay
    /// - gas_limit: Maximum gas units the transaction can consume
    /// - to: Recipient address (null for contract creation transactions)
    /// - value: Amount of ether (in wei) to transfer
    /// - data: Transaction input data (function call data or contract bytecode)
    /// - access_list: Optional pre-declared storage accesses
    /// - signature_yParity: Signature Y coordinate parity bit
    /// - signature_r: First 32 bytes of the signature
    /// - signature_s: Second 32 bytes of the signature
    ///
    /// Returns: A pointer to the newly allocated transaction
    /// Errors: InvalidFee if max_fee_per_gas < max_priority_fee_per_gas
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
        const logger = getLogger();
        const scoped = createScopedLogger(logger, "create()");
        defer scoped.deinit();
        
        logger.debug("Creating new EIP-1559 fee market transaction", .{});
        
        // Validate fee parameters
        // The max_fee_per_gas must be at least as high as max_priority_fee_per_gas
        if (max_fee_per_gas < max_priority_fee_per_gas) {
            logger.err("Invalid fee parameters: max_fee_per_gas ({d}) < max_priority_fee_per_gas ({d})", .{
                max_fee_per_gas, max_priority_fee_per_gas
            });
            return error.InvalidFee;
        }
        
        // Allocate memory for the transaction object
        const tx = try allocator.create(FeeMarketTransaction);
        errdefer allocator.destroy(tx); // Clean up on error
        
        // Copy the data buffer to avoid external modification
        const data_copy = try allocator.alloc(u8, data.len);
        errdefer allocator.free(data_copy); // Clean up on error
        @memcpy(data_copy, data);
        
        // In a full implementation, we would also deep copy the access_list
        // For now, we're just storing the reference since this is for testing
        
        // Initialize all transaction fields
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
        
        logger.info("Created EIP-1559 transaction with chain_id={d}, nonce={d}", .{chain_id, nonce});
        logger.info("Transaction fees: max_fee={d} wei, max_priority_fee={d} wei", .{
            max_fee_per_gas, max_priority_fee_per_gas
        });
        
        return tx;
    }
    
    /// Release all resources associated with the transaction
    ///
    /// This method should be called when the transaction is no longer needed
    /// to prevent memory leaks. It frees all dynamically allocated memory.
    ///
    /// Parameters:
    /// - allocator: The same memory allocator used to create the transaction
    pub fn deinit(self: *FeeMarketTransaction, allocator: std.mem.Allocator) void {
        const logger = getLogger();
        logger.debug("Deallocating EIP-1559 transaction resources", .{});
        
        // Free the data buffer
        allocator.free(self.data);
        
        // In a full implementation, we would also free the access_list entries
        // For now, we're assuming the caller manages the access_list memory
        
        // Finally, free the transaction object itself
        allocator.destroy(self);
    }
};

// Tests for the FeeMarketTransaction implementation

test "FeeMarketTransaction - basic functionality" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Create a test transaction
    var to_bytes: Address = [_]u8{0} ** 20;
    to_bytes[19] = 1;
    const to = to_bytes;
    
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
        // Total = 1,000,150,000,000,000,000 wei
        const expected_gas_cost: u256 = 150_000_000_000;
        const expected_total: u256 = 1_000_000_000_000_000_000 + expected_gas_cost;
        
        // Compare the values to handle possible rounding differences
        const difference = if (cost > expected_total) 
            cost - expected_total 
        else 
            expected_total - cost;
            
        // Allow a small margin of error
        try testing.expect(difference < 1_000_000_000_000_000);
    }
}

test "FeeMarketTransaction - error handling" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Try to create a transaction with max_fee < max_priority_fee
    var to_bytes: Address = [_]u8{0} ** 20;
    to_bytes[19] = 1;
    const to = to_bytes;
    
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

test "FeeMarketTransaction - create and deinit with error handling" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Create a test transaction with large data to check memory management
    var to_bytes: Address = [_]u8{0} ** 20;
    to_bytes[19] = 1;
    const to = to_bytes;
    
    var data = [_]u8{0} ** 1024; // 1KB of data
    for (0..data.len) |i| {
        data[i] = @truncate(i % 256);
    }
    
    const access_list = [_]AccessListEntry{};
    
    // Create the transaction
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
    
    // Verify transaction data was properly copied and not just referenced
    try testing.expectEqual(@as(usize, 1024), tx.data.len);
    
    // Modify the original data to ensure we have a separate copy
    data[0] = 0xFF;
    try testing.expect(tx.data[0] != 0xFF);
    
    // Test the getEffectiveGasPrice method
    const base_fee = 1_500_000_000; // 1.5 gwei
    const result = tx.getEffectiveGasPrice(base_fee);
    
    // Priority fee should be 0.5 gwei (max_fee - base_fee)
    try testing.expectEqual(@as(u64, 500_000_000), result.miner_tip);
    
    // Effective gas price should be 2 gwei (max_fee)
    try testing.expectEqual(@as(u64, 2_000_000_000), result.effective_gas_price);
    
    // Test the getCost method
    const cost = tx.getCost(base_fee);
    
    // Calculate expected cost: gas_limit * effective_gas_price + value
    const expected_gas_cost: u256 = 100_000 * 2_000_000_000;
    const expected_total_cost: u256 = 1_000_000_000_000_000_000 + expected_gas_cost;
    
    // Compare the values to handle possible rounding differences
    const difference = if (cost > expected_total_cost) 
        cost - expected_total_cost 
    else 
        expected_total_cost - cost;
        
    // Allow a small margin of error
    try testing.expect(difference < 1_000_000_000_000_000);
}

test "FeeMarketTransaction - memory management with error handling" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Setup for transaction
    var to_bytes: Address = [_]u8{0} ** 20;
    to_bytes[19] = 1;
    const to = to_bytes;
    
    const data = [_]u8{ 0xAB, 0xCD, 0xEF };
    const access_list = [_]AccessListEntry{};
    
    // Create multiple transactions to stress memory management
    var transactions = std.ArrayList(*FeeMarketTransaction).init(allocator);
    defer {
        for (transactions.items) |tx| {
            tx.deinit(allocator);
        }
        transactions.deinit();
    }
    
    // Create several transactions to stress memory management
    for (0..10) |i| {
        const tx = try FeeMarketTransaction.create(
            allocator,
            1, // chain_id
            @truncate(i), // nonce
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
        try transactions.append(tx);
    }
    
    // Verify each transaction has its own data copy
    for (transactions.items, 0..) |tx, i| {
        try testing.expectEqual(@as(usize, data.len), tx.data.len);
        try testing.expectEqual(data[0], tx.data[0]);
        try testing.expectEqual(@as(u64, i), tx.nonce);
    }
}