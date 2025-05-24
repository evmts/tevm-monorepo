# Transaction Types Implementation Issue

## Overview

FeeMarketTransaction.zig implements Ethereum transaction types including legacy (Type 0), EIP-2930 (Type 1), EIP-1559 (Type 2), and EIP-4844 (Type 3) transactions with proper encoding, signature handling, and validation.

## Requirements

- Support all transaction types (Legacy, AccessList, FeeMarket, Blob)
- Implement RLP encoding/decoding for each type
- Handle transaction signing and signature recovery
- Validate transaction fields per EIP specifications
- Calculate transaction hash correctly for each type
- Support access list encoding and gas calculations
- Handle blob transactions with KZG commitments
- Implement sender recovery from signatures
- Support transaction intrinsic gas calculation
- Provide type detection from raw bytes

## Interface

```zig
const std = @import("std");
const Address = @import("address").Address;
const B256 = @import("utils").B256;
const Signature = @import("signature").Signature;
const rlp = @import("rlp");

pub const TransactionError = error{
    InvalidTransactionType,
    InvalidSignature,
    InvalidChainId,
    InsufficientFunds,
    NonceTooLow,
    GasLimitTooLow,
    InvalidAccessList,
    BlobFeeTooLow,
    TooManyBlobs,
    InvalidBlobCommitment,
    RLPDecodingError,
};

/// Transaction types per EIP-2718
pub const TransactionType = enum(u8) {
    /// Legacy transaction (pre-EIP-2718)
    Legacy = 0,
    /// AccessList transaction (EIP-2930)
    AccessList = 1,
    /// FeeMarket transaction (EIP-1559)
    FeeMarket = 2,
    /// Blob transaction (EIP-4844)
    Blob = 3,
};

/// Access list entry for warm storage
pub const AccessListEntry = struct {
    address: Address,
    storage_keys: []const B256,
};

/// Transaction interface that all types must implement
pub const Transaction = union(TransactionType) {
    Legacy: LegacyTransaction,
    AccessList: AccessListTransaction,
    FeeMarket: FeeMarketTransaction,
    Blob: BlobTransaction,

    /// Get transaction type
    pub fn txType(self: *const Transaction) TransactionType {
        return @as(TransactionType, self.*);
    }

    /// Get sender address (recovered from signature)
    pub fn sender(self: *const Transaction) TransactionError!Address {
        return switch (self.*) {
            .Legacy => |tx| tx.recoverSender(),
            .AccessList => |tx| tx.recoverSender(),
            .FeeMarket => |tx| tx.recoverSender(),
            .Blob => |tx| tx.recoverSender(),
        };
    }

    /// Get transaction hash
    pub fn hash(self: *const Transaction) B256 {
        return switch (self.*) {
            .Legacy => |tx| tx.hash(),
            .AccessList => |tx| tx.hash(),
            .FeeMarket => |tx| tx.hash(),
            .Blob => |tx| tx.hash(),
        };
    }

    /// Get effective gas price given base fee
    pub fn effectiveGasPrice(self: *const Transaction, base_fee: ?u64) u64 {
        return switch (self.*) {
            .Legacy => |tx| tx.gas_price,
            .AccessList => |tx| tx.gas_price,
            .FeeMarket => |tx| blk: {
                const bf = base_fee orelse 0;
                const priority = @min(tx.max_priority_fee_per_gas, tx.max_fee_per_gas - bf);
                break :blk bf + priority;
            },
            .Blob => |tx| blk: {
                const bf = base_fee orelse 0;
                const priority = @min(tx.max_priority_fee_per_gas, tx.max_fee_per_gas - bf);
                break :blk bf + priority;
            },
        };
    }

    /// Encode transaction to bytes
    pub fn encode(self: *const Transaction, allocator: std.mem.Allocator) ![]u8 {
        return switch (self.*) {
            .Legacy => |tx| tx.encode(allocator),
            inline else => |tx, tag| blk: {
                const inner = try tx.encode(allocator);
                defer allocator.free(inner);
                
                var result = try allocator.alloc(u8, inner.len + 1);
                result[0] = @intFromEnum(tag);
                @memcpy(result[1..], inner);
                break :blk result;
            },
        };
    }

    /// Decode transaction from bytes
    pub fn decode(allocator: std.mem.Allocator, data: []const u8) TransactionError!Transaction {
        if (data.len == 0) return error.InvalidTransactionType;

        // Legacy transaction if first byte >= 0xc0 (RLP list)
        if (data[0] >= 0xc0) {
            return .{ .Legacy = try LegacyTransaction.decode(allocator, data) };
        }

        // Otherwise typed transaction
        const tx_type = data[0];
        const payload = data[1..];

        return switch (tx_type) {
            0x01 => .{ .AccessList = try AccessListTransaction.decode(allocator, payload) },
            0x02 => .{ .FeeMarket = try FeeMarketTransaction.decode(allocator, payload) },
            0x03 => .{ .Blob = try BlobTransaction.decode(allocator, payload) },
            else => error.InvalidTransactionType,
        };
    }
};

/// Legacy transaction (Type 0)
pub const LegacyTransaction = struct {
    nonce: u64,
    gas_price: u64,
    gas_limit: u64,
    to: ?Address,
    value: u256,
    data: []const u8,
    v: u64,
    r: B256,
    s: B256,

    /// Calculate transaction hash
    pub fn hash(self: *const LegacyTransaction) B256 {
        const encoded = self.encode(std.heap.page_allocator) catch unreachable;
        defer std.heap.page_allocator.free(encoded);
        return B256.keccak256(encoded);
    }

    /// Recover sender from signature
    pub fn recoverSender(self: *const LegacyTransaction) TransactionError!Address {
        const chain_id = if (self.v >= 35) (self.v - 35) / 2 else null;
        const recovery_id = if (chain_id) |_| @intCast(u8, (self.v - 35) % 2) else @intCast(u8, self.v - 27);
        
        const sig = Signature{
            .r = self.r,
            .s = self.s,
            .v = recovery_id,
        };

        const hash = self.signingHash(chain_id);
        return sig.recover(hash) catch error.InvalidSignature;
    }

    /// Get signing hash (different for EIP-155)
    fn signingHash(self: *const LegacyTransaction, chain_id: ?u64) B256 {
        // Encode for signing (without signature fields)
        var list = std.ArrayList(rlp.Item).init(std.heap.page_allocator);
        defer list.deinit();

        list.append(.{ .String = std.mem.asBytes(&self.nonce) }) catch unreachable;
        list.append(.{ .String = std.mem.asBytes(&self.gas_price) }) catch unreachable;
        list.append(.{ .String = std.mem.asBytes(&self.gas_limit) }) catch unreachable;
        
        if (self.to) |to| {
            list.append(.{ .String = &to }) catch unreachable;
        } else {
            list.append(.{ .String = &[_]u8{} }) catch unreachable;
        }
        
        list.append(.{ .String = std.mem.asBytes(&self.value) }) catch unreachable;
        list.append(.{ .String = self.data }) catch unreachable;

        // EIP-155 replay protection
        if (chain_id) |id| {
            list.append(.{ .String = std.mem.asBytes(&id) }) catch unreachable;
            list.append(.{ .String = &[_]u8{} }) catch unreachable;
            list.append(.{ .String = &[_]u8{} }) catch unreachable;
        }

        const encoded = rlp.encode(std.heap.page_allocator, .{ .List = list.items }) catch unreachable;
        defer std.heap.page_allocator.free(encoded);

        return B256.keccak256(encoded);
    }

    /// RLP encode transaction
    pub fn encode(self: *const LegacyTransaction, allocator: std.mem.Allocator) ![]u8 {
        var items = std.ArrayList(rlp.Item).init(allocator);
        defer items.deinit();

        try items.append(.{ .String = std.mem.asBytes(&self.nonce) });
        try items.append(.{ .String = std.mem.asBytes(&self.gas_price) });
        try items.append(.{ .String = std.mem.asBytes(&self.gas_limit) });
        
        if (self.to) |to| {
            try items.append(.{ .String = &to });
        } else {
            try items.append(.{ .String = &[_]u8{} });
        }
        
        try items.append(.{ .String = std.mem.asBytes(&self.value) });
        try items.append(.{ .String = self.data });
        try items.append(.{ .String = std.mem.asBytes(&self.v) });
        try items.append(.{ .String = &self.r });
        try items.append(.{ .String = &self.s });

        return rlp.encode(allocator, .{ .List = items.items });
    }

    /// RLP decode transaction
    pub fn decode(allocator: std.mem.Allocator, data: []const u8) !LegacyTransaction {
        const decoded = try rlp.decode(allocator, data);
        defer decoded.deinit();

        const list = decoded.List;
        if (list.len != 9) return error.RLPDecodingError;

        return LegacyTransaction{
            .nonce = try rlp.decodeInt(u64, list[0]),
            .gas_price = try rlp.decodeInt(u64, list[1]),
            .gas_limit = try rlp.decodeInt(u64, list[2]),
            .to = if (list[3].String.len == 0) null else try Address.fromBytes(list[3].String),
            .value = try rlp.decodeInt(u256, list[4]),
            .data = try allocator.dupe(u8, list[5].String),
            .v = try rlp.decodeInt(u64, list[6]),
            .r = try B256.fromBytes(list[7].String),
            .s = try B256.fromBytes(list[8].String),
        };
    }
};

/// EIP-2930 Access List Transaction (Type 1)
pub const AccessListTransaction = struct {
    chain_id: u64,
    nonce: u64,
    gas_price: u64,
    gas_limit: u64,
    to: ?Address,
    value: u256,
    data: []const u8,
    access_list: []const AccessListEntry,
    v: u8,
    r: B256,
    s: B256,

    /// Calculate transaction hash
    pub fn hash(self: *const AccessListTransaction) B256 {
        var buf: [1024]u8 = undefined;
        buf[0] = 0x01; // Transaction type
        const encoded = self.encode(std.heap.page_allocator) catch unreachable;
        defer std.heap.page_allocator.free(encoded);
        @memcpy(buf[1..1 + encoded.len], encoded);
        return B256.keccak256(buf[0..1 + encoded.len]);
    }

    /// Recover sender from signature
    pub fn recoverSender(self: *const AccessListTransaction) TransactionError!Address {
        const sig = Signature{ .r = self.r, .s = self.s, .v = self.v };
        const hash = self.signingHash();
        return sig.recover(hash) catch error.InvalidSignature;
    }

    /// Get signing hash
    fn signingHash(self: *const AccessListTransaction) B256 {
        var buf: [1024]u8 = undefined;
        buf[0] = 0x01; // Transaction type
        
        // Encode without signature for signing
        const encoded = self.encodeForSigning(std.heap.page_allocator) catch unreachable;
        defer std.heap.page_allocator.free(encoded);
        
        @memcpy(buf[1..1 + encoded.len], encoded);
        return B256.keccak256(buf[0..1 + encoded.len]);
    }

    // ... encoding/decoding methods
};

/// EIP-1559 Fee Market Transaction (Type 2)
pub const FeeMarketTransaction = struct {
    chain_id: u64,
    nonce: u64,
    max_priority_fee_per_gas: u64,
    max_fee_per_gas: u64,
    gas_limit: u64,
    to: ?Address,
    value: u256,
    data: []const u8,
    access_list: []const AccessListEntry,
    v: u8,
    r: B256,
    s: B256,

    /// Validate transaction fields
    pub fn validate(self: *const FeeMarketTransaction) TransactionError!void {
        // max_priority_fee_per_gas must not exceed max_fee_per_gas
        if (self.max_priority_fee_per_gas > self.max_fee_per_gas) {
            return error.InvalidTransactionType;
        }
        
        // Basic validation
        if (self.gas_limit < 21000) {
            return error.GasLimitTooLow;
        }
    }

    /// Calculate intrinsic gas
    pub fn intrinsicGas(self: *const FeeMarketTransaction) u64 {
        var gas: u64 = 21000; // Base transaction cost
        
        // Contract creation costs more
        if (self.to == null) {
            gas += 32000;
        }
        
        // Data costs
        for (self.data) |byte| {
            if (byte == 0) {
                gas += 4;
            } else {
                gas += 16;
            }
        }
        
        // Access list costs (EIP-2930)
        gas += @intCast(u64, self.access_list.len) * 2400;
        for (self.access_list) |entry| {
            gas += @intCast(u64, entry.storage_keys.len) * 1900;
        }
        
        return gas;
    }

    // ... other methods
};

/// EIP-4844 Blob Transaction (Type 3)
pub const BlobTransaction = struct {
    chain_id: u64,
    nonce: u64,
    max_priority_fee_per_gas: u64,
    max_fee_per_gas: u64,
    gas_limit: u64,
    to: Address, // Cannot be null for blob transactions
    value: u256,
    data: []const u8,
    access_list: []const AccessListEntry,
    max_fee_per_blob_gas: u64,
    blob_versioned_hashes: []const B256,
    v: u8,
    r: B256,
    s: B256,

    /// Validate blob transaction
    pub fn validate(self: *const BlobTransaction) TransactionError!void {
        // Must have at least one blob
        if (self.blob_versioned_hashes.len == 0) {
            return error.InvalidTransactionType;
        }
        
        // Cannot have too many blobs
        if (self.blob_versioned_hashes.len > 6) {
            return error.TooManyBlobs;
        }
        
        // All blob hashes must have version 0x01
        for (self.blob_versioned_hashes) |hash| {
            if (hash[0] != 0x01) {
                return error.InvalidBlobCommitment;
            }
        }
    }

    // ... other methods
};
```

## Code Reference from Existing Implementation

From the existing FeeMarketTransaction.zig:

```zig
// AccessListEntry represents a single entry in an access list
// 
// These entries are used in both EIP-2930 and EIP-1559 transactions to
// specify addresses and storage slots that will be accessed during execution.
// Pre-declaring these accesses optimizes gas costs under EIP-2929 by marking
// the slots as "warm" before transaction execution begins.
pub const AccessListEntry = struct {
    /// The Ethereum address being accessed during transaction execution
    address: Address,
    
    /// List of 32-byte storage slot keys that will be accessed at this address
    /// Each key corresponds to a specific storage slot in the account's state
    storage_keys: []const [32]u8,
};
```

## Reference Implementations

### Go-Ethereum (core/types/transaction.go)

```go
// TxData is the underlying data of a transaction.
type TxData interface {
    txType() byte // returns the type ID
    copy() TxData // creates a deep copy

    chainID() *big.Int
    accessList() AccessList
    data() []byte
    gas() uint64
    gasPrice() *big.Int
    gasTipCap() *big.Int
    gasFeeCap() *big.Int
    value() *big.Int
    nonce() uint64
    to() *common.Address

    rawSignatureValues() (v, r, s *big.Int)
    setSignatureValues(chainID, v, r, s *big.Int)
}

// DynamicFeeTx represents an EIP-1559 transaction.
type DynamicFeeTx struct {
    ChainID    *big.Int
    Nonce      uint64
    GasTipCap  *big.Int // a.k.a. maxPriorityFeePerGas
    GasFeeCap  *big.Int // a.k.a. maxFeePerGas
    Gas        uint64
    To         *common.Address `rlp:"nil"` // nil means contract creation
    Value      *big.Int
    Data       []byte
    AccessList AccessList

    // Signature values
    V *big.Int `json:"v" gencodec:"required"`
    R *big.Int `json:"r" gencodec:"required"`
    S *big.Int `json:"s" gencodec:"required"`
}
```

### revm (crates/primitives/src/env.rs)

```rust
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum TxKind {
    Call(Address),
    Create,
}

#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct TxEnv {
    /// Caller aka Author aka transaction signer
    pub caller: Address,
    /// The gas limit of the transaction
    pub gas_limit: u64,
    /// The gas price of the transaction
    pub gas_price: U256,
    /// The destination of the transaction
    pub transact_to: TxKind,
    /// The value sent in the transaction
    pub value: U256,
    /// The data of the transaction
    pub data: Bytes,
    /// The nonce of the transaction
    pub nonce: Option<u64>,
    /// The chain ID of the transaction
    pub chain_id: Option<u64>,
    /// A list of addresses and storage keys that the transaction will access
    pub access_list: Vec<(Address, Vec<U256>)>,
    /// The priority fee per gas
    pub gas_priority_fee: Option<U256>,
    /// The list of blob versioned hashes
    pub blob_hashes: Vec<B256>,
    /// The max fee per blob gas
    pub max_fee_per_blob_gas: Option<U256>,
}
```

## Usage Example

```zig
// Decode transaction from raw bytes
const raw_tx = try std.fs.cwd().readFileAlloc(allocator, "tx.bin", 1024 * 1024);
defer allocator.free(raw_tx);

const tx = try Transaction.decode(allocator, raw_tx);

// Get transaction details
const sender = try tx.sender();
const tx_hash = tx.hash();
const tx_type = tx.txType();

// Calculate effective gas price with current base fee
const base_fee = 30_000_000_000; // 30 gwei
const effective_price = tx.effectiveGasPrice(base_fee);

// Validate transaction based on type
switch (tx) {
    .FeeMarket => |fmt| try fmt.validate(),
    .Blob => |blob| try blob.validate(),
    else => {},
}

// Calculate intrinsic gas
const intrinsic_gas = switch (tx) {
    .FeeMarket => |fmt| fmt.intrinsicGas(),
    .Blob => |blob| blob.intrinsicGas(),
    else => 21000,
};

// Check if transaction has enough gas
if (tx.gas_limit < intrinsic_gas) {
    return error.IntrinsicGas;
}
```

## Testing Requirements

1. **Encoding/Decoding**:
   - Test RLP encoding for all transaction types
   - Test decoding with type detection
   - Test signature encoding

2. **Signature Recovery**:
   - Test sender recovery for each type
   - Test EIP-155 chain ID validation
   - Test invalid signature handling

3. **Validation**:
   - Test field validation for each type
   - Test gas limit validation
   - Test access list validation

4. **Gas Calculations**:
   - Test intrinsic gas calculation
   - Test effective gas price
   - Test blob gas calculations

## References

- [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) - Typed Transaction Envelope
- [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) - Access List Transaction Type
- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - Fee Market Transaction Type  
- [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) - Blob Transaction Type