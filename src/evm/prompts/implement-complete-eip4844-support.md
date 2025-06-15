# Implement Complete EIP-4844 Support

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_complete_eip4844_support` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_complete_eip4844_support feat_implement_complete_eip4844_support`
3. **Work in isolation**: `cd g/feat_implement_complete_eip4844_support`
4. **Commit message**: `✨ feat: implement complete EIP-4844 blob transaction support`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement complete EIP-4844 support for blob transactions beyond just the opcodes (BLOBHASH, BLOBBASEFEE). This includes blob validation, blob gas market mechanics, KZG commitment verification, and blob storage management. EIP-4844 introduces proto-danksharding to Ethereum, enabling more scalable L2 solutions.

## EIP-4844 Specification

### Core Components

#### 1. Blob Transaction Type
```zig
pub const BlobTransaction = struct {
    chain_id: u64,
    nonce: u64,
    max_priority_fee_per_gas: u256,
    max_fee_per_gas: u256,
    gas_limit: u64,
    to: ?Address,
    value: u256,
    data: []const u8,
    access_list: AccessList,
    max_fee_per_blob_gas: u256,
    blob_versioned_hashes: []const B256,
    
    // Not included in transaction, but needed for validation
    blobs: ?[]const Blob,
    commitments: ?[]const KZGCommitment,
    proofs: ?[]const KZGProof,
};
```

#### 2. Blob Structure
```zig
pub const BYTES_PER_BLOB = 131072; // 128 KB
pub const FIELD_ELEMENTS_PER_BLOB = 4096;
pub const BLS_MODULUS = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001;

pub const Blob = struct {
    data: [BYTES_PER_BLOB]u8,
    
    pub fn to_kzg_polynomial(self: *const Blob) KZGPolynomial {
        // Convert blob bytes to field elements for KZG
        var field_elements: [FIELD_ELEMENTS_PER_BLOB]FieldElement = undefined;
        
        for (0..FIELD_ELEMENTS_PER_BLOB) |i| {
            const start = i * 32;
            const end = start + 32;
            field_elements[i] = FieldElement.from_bytes(self.data[start..end]);
        }
        
        return KZGPolynomial{ .coefficients = field_elements };
    }
};
```

#### 3. KZG Commitments and Proofs
```zig
pub const KZGCommitment = struct {
    data: [48]u8, // BLS12-381 G1 point
    
    pub fn verify_blob_kzg_proof(
        blob: *const Blob,
        commitment: *const KZGCommitment,
        proof: *const KZGProof
    ) bool {
        // Verify that the commitment matches the blob
        const polynomial = blob.to_kzg_polynomial();
        const computed_commitment = kzg_commit(&polynomial);
        
        return std.mem.eql(u8, &commitment.data, &computed_commitment.data);
    }
};

pub const KZGProof = struct {
    data: [48]u8, // BLS12-381 G1 point
};
```

### Blob Gas Market

#### 1. Blob Gas Pricing
```zig
pub const BLOB_BASE_FEE_UPDATE_FRACTION = 3338477;
pub const BLOB_GASPRICE_UPDATE_FRACTION = 3338477;
pub const MIN_BLOB_GASPRICE = 1;
pub const MAX_BLOB_GAS_PER_BLOCK = 786432; // 6 blobs * 131072 gas per blob
pub const TARGET_BLOB_GAS_PER_BLOCK = 393216; // 3 blobs * 131072 gas per blob

pub fn calculate_blob_base_fee(parent_blob_gas_used: u64, parent_blob_base_fee: u256) u256 {
    if (parent_blob_gas_used == TARGET_BLOB_GAS_PER_BLOCK) {
        return parent_blob_base_fee;
    } else if (parent_blob_gas_used > TARGET_BLOB_GAS_PER_BLOCK) {
        // Increase base fee
        const delta = parent_blob_gas_used - TARGET_BLOB_GAS_PER_BLOCK;
        const base_fee_delta = @max(
            parent_blob_base_fee * delta / TARGET_BLOB_GAS_PER_BLOCK / BLOB_BASE_FEE_UPDATE_FRACTION,
            1
        );
        return parent_blob_base_fee + base_fee_delta;
    } else {
        // Decrease base fee
        const delta = TARGET_BLOB_GAS_PER_BLOCK - parent_blob_gas_used;
        const base_fee_delta = parent_blob_base_fee * delta / TARGET_BLOB_GAS_PER_BLOCK / BLOB_BASE_FEE_UPDATE_FRACTION;
        return if (parent_blob_base_fee > base_fee_delta) 
            parent_blob_base_fee - base_fee_delta 
        else 
            MIN_BLOB_GASPRICE;
    }
}
```

## Implementation Requirements

### Core Functionality
1. **Blob Transaction Processing**: Parse and validate blob transactions
2. **KZG Verification**: Verify blob commitments and proofs
3. **Blob Gas Market**: Implement blob base fee calculation
4. **Blob Storage**: Manage blob data lifecycle
5. **Block Validation**: Validate blob constraints in blocks
6. **Fee Calculation**: Compute blob fees for transactions

### Blob Validation Pipeline
```zig
pub const BlobValidationError = error{
    InvalidBlobCount,
    InvalidVersionedHash,
    KZGVerificationFailed,
    BlobGasLimitExceeded,
    InsufficientBlobGasFee,
    InvalidBlobData,
};

pub const BlobValidator = struct {
    kzg_settings: KZGSettings,
    
    pub fn validate_blob_transaction(
        self: *BlobValidator,
        tx: *const BlobTransaction,
        current_blob_base_fee: u256
    ) BlobValidationError!void {
        // Validate blob count
        if (tx.blob_versioned_hashes.len == 0 or tx.blob_versioned_hashes.len > 6) {
            return BlobValidationError.InvalidBlobCount;
        }
        
        // Validate max fee per blob gas
        if (tx.max_fee_per_blob_gas < current_blob_base_fee) {
            return BlobValidationError.InsufficientBlobGasFee;
        }
        
        // Validate versioned hashes if blobs are provided
        if (tx.blobs) |blobs| {
            if (blobs.len != tx.blob_versioned_hashes.len) {
                return BlobValidationError.InvalidBlobCount;
            }
            
            if (tx.commitments) |commitments| {
                if (commitments.len != blobs.len) {
                    return BlobValidationError.InvalidBlobCount;
                }
                
                // Verify each blob against its commitment
                for (blobs, commitments, tx.blob_versioned_hashes) |*blob, *commitment, versioned_hash| {
                    // Verify versioned hash
                    const computed_hash = compute_versioned_hash(commitment);
                    if (!std.mem.eql(u8, &versioned_hash.bytes, &computed_hash.bytes)) {
                        return BlobValidationError.InvalidVersionedHash;
                    }
                    
                    // Verify KZG commitment
                    if (tx.proofs) |proofs| {
                        const proof_index = @intFromPtr(blob) - @intFromPtr(blobs.ptr);
                        const proof = &proofs[proof_index];
                        
                        if (!KZGCommitment.verify_blob_kzg_proof(blob, commitment, proof)) {
                            return BlobValidationError.KZGVerificationFailed;
                        }
                    }
                }
            }
        }
    }
};
```

## Implementation Tasks

### Task 1: Implement Blob Data Structures
File: `/src/evm/blob/blob_types.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;
const B256 = @import("../Types/B256.ts").B256;
const U256 = @import("../Types/U256.ts").U256;

pub const BYTES_PER_BLOB = 131072;
pub const FIELD_ELEMENTS_PER_BLOB = 4096;
pub const MAX_BLOBS_PER_TRANSACTION = 6;
pub const GAS_PER_BLOB = 131072;

// BLS12-381 field modulus for KZG
pub const BLS_MODULUS: U256 = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001;

pub const Blob = struct {
    data: [BYTES_PER_BLOB]u8,
    
    pub fn init() Blob {
        return Blob{ .data = [_]u8{0} ** BYTES_PER_BLOB };
    }
    
    pub fn from_bytes(bytes: []const u8) !Blob {
        if (bytes.len != BYTES_PER_BLOB) {
            return error.InvalidBlobSize;
        }
        
        var blob = Blob.init();
        @memcpy(&blob.data, bytes);
        return blob;
    }
    
    pub fn get_field_element(self: *const Blob, index: usize) FieldElement {
        if (index >= FIELD_ELEMENTS_PER_BLOB) {
            return FieldElement.zero();
        }
        
        const start = index * 32;
        const end = start + 32;
        return FieldElement.from_bytes(self.data[start..end]);
    }
};

pub const FieldElement = struct {
    value: U256,
    
    pub fn zero() FieldElement {
        return FieldElement{ .value = 0 };
    }
    
    pub fn from_bytes(bytes: []const u8) FieldElement {
        if (bytes.len != 32) {
            return FieldElement.zero();
        }
        
        const value = U256.from_be_bytes(bytes);
        
        // Ensure value is less than BLS modulus
        if (value >= BLS_MODULUS) {
            return FieldElement.zero();
        }
        
        return FieldElement{ .value = value };
    }
    
    pub fn to_bytes(self: *const FieldElement) [32]u8 {
        return self.value.to_be_bytes();
    }
};

pub const KZGCommitment = struct {
    data: [48]u8,
    
    pub fn init() KZGCommitment {
        return KZGCommitment{ .data = [_]u8{0} ** 48 };
    }
    
    pub fn from_bytes(bytes: []const u8) !KZGCommitment {
        if (bytes.len != 48) {
            return error.InvalidCommitmentSize;
        }
        
        var commitment = KZGCommitment.init();
        @memcpy(&commitment.data, bytes);
        return commitment;
    }
};

pub const KZGProof = struct {
    data: [48]u8,
    
    pub fn init() KZGProof {
        return KZGProof{ .data = [_]u8{0} ** 48 };
    }
    
    pub fn from_bytes(bytes: []const u8) !KZGProof {
        if (bytes.len != 48) {
            return error.InvalidProofSize;
        }
        
        var proof = KZGProof.init();
        @memcpy(&proof.data, bytes);
        return proof;
    }
};

pub const VersionedHash = struct {
    bytes: [32]u8,
    
    pub fn compute_versioned_hash(commitment: *const KZGCommitment) VersionedHash {
        // Version 1 versioned hash: sha256(commitment)[1] = 0x01
        const Sha256 = std.crypto.hash.sha2.Sha256;
        var hasher = Sha256.init(.{});
        hasher.update(&commitment.data);
        var hash = hasher.finalResult();
        
        // Set version byte to 0x01
        hash[0] = 0x01;
        
        return VersionedHash{ .bytes = hash };
    }
};
```

### Task 2: Implement Blob Gas Market
File: `/src/evm/blob/blob_gas_market.zig`
```zig
const std = @import("std");
const U256 = @import("../Types/U256.ts").U256;

// EIP-4844 blob gas constants
pub const BLOB_BASE_FEE_UPDATE_FRACTION = 3338477;
pub const MIN_BLOB_GASPRICE = 1;
pub const MAX_BLOB_GAS_PER_BLOCK = 786432; // 6 blobs * 131072
pub const TARGET_BLOB_GAS_PER_BLOCK = 393216; // 3 blobs * 131072

pub const BlobGasMarket = struct {
    pub fn calculate_blob_base_fee(
        parent_blob_gas_used: u64,
        parent_blob_base_fee: U256
    ) U256 {
        if (parent_blob_gas_used == TARGET_BLOB_GAS_PER_BLOCK) {
            return parent_blob_base_fee;
        }
        
        if (parent_blob_gas_used > TARGET_BLOB_GAS_PER_BLOCK) {
            return calculate_blob_fee_increase(parent_blob_gas_used, parent_blob_base_fee);
        } else {
            return calculate_blob_fee_decrease(parent_blob_gas_used, parent_blob_base_fee);
        }
    }
    
    fn calculate_blob_fee_increase(blob_gas_used: u64, base_fee: U256) U256 {
        const excess_blob_gas = blob_gas_used - TARGET_BLOB_GAS_PER_BLOCK;
        
        // delta = max(parent_blob_base_fee * excess_blob_gas / TARGET_BLOB_GAS_PER_BLOCK / BLOB_BASE_FEE_UPDATE_FRACTION, 1)
        const numerator = base_fee * excess_blob_gas;
        const denominator = TARGET_BLOB_GAS_PER_BLOCK * BLOB_BASE_FEE_UPDATE_FRACTION;
        const delta = @max(numerator / denominator, 1);
        
        return base_fee + delta;
    }
    
    fn calculate_blob_fee_decrease(blob_gas_used: u64, base_fee: U256) U256 {
        const deficit_blob_gas = TARGET_BLOB_GAS_PER_BLOCK - blob_gas_used;
        
        // delta = parent_blob_base_fee * deficit_blob_gas / TARGET_BLOB_GAS_PER_BLOCK / BLOB_BASE_FEE_UPDATE_FRACTION
        const numerator = base_fee * deficit_blob_gas;
        const denominator = TARGET_BLOB_GAS_PER_BLOCK * BLOB_BASE_FEE_UPDATE_FRACTION;
        const delta = numerator / denominator;
        
        return if (base_fee > delta) base_fee - delta else MIN_BLOB_GASPRICE;
    }
    
    pub fn calculate_blob_fee(blob_count: u32, blob_base_fee: U256) U256 {
        const blob_gas_used = blob_count * GAS_PER_BLOB;
        return blob_gas_used * blob_base_fee;
    }
    
    pub fn validate_blob_gas_limit(blob_count: u32) bool {
        const total_blob_gas = blob_count * GAS_PER_BLOB;
        return total_blob_gas <= MAX_BLOB_GAS_PER_BLOCK;
    }
};
```

### Task 3: Implement KZG Verification Interface
File: `/src/evm/blob/kzg_verification.zig`
```zig
const std = @import("std");
const Blob = @import("blob_types.zig").Blob;
const KZGCommitment = @import("blob_types.zig").KZGCommitment;
const KZGProof = @import("blob_types.zig").KZGProof;

// This is a placeholder interface for KZG verification
// Actual implementation would need to link to c-kzg library or implement BLS12-381 arithmetic

pub const KZGVerificationError = error{
    InvalidCommitment,
    InvalidProof,
    VerificationFailed,
    LibraryNotAvailable,
};

pub const KZGVerifier = struct {
    trusted_setup: ?TrustedSetup,
    
    pub fn init(allocator: std.mem.Allocator) !KZGVerifier {
        // Load trusted setup for KZG verification
        // This would typically load from a file or embedded data
        const trusted_setup = try TrustedSetup.load(allocator);
        
        return KZGVerifier{
            .trusted_setup = trusted_setup,
        };
    }
    
    pub fn deinit(self: *KZGVerifier, allocator: std.mem.Allocator) void {
        if (self.trusted_setup) |*setup| {
            setup.deinit(allocator);
        }
    }
    
    pub fn verify_blob_kzg_proof(
        self: *const KZGVerifier,
        blob: *const Blob,
        commitment: *const KZGCommitment,
        proof: *const KZGProof
    ) KZGVerificationError!bool {
        // This is a placeholder implementation
        // Real implementation would:
        // 1. Convert blob to polynomial coefficients
        // 2. Verify that commitment = commit(polynomial)
        // 3. Verify KZG proof of evaluation
        
        if (self.trusted_setup == null) {
            return KZGVerificationError.LibraryNotAvailable;
        }
        
        // Placeholder: basic validation
        if (std.mem.allEqual(u8, &commitment.data, 0)) {
            return KZGVerificationError.InvalidCommitment;
        }
        
        if (std.mem.allEqual(u8, &proof.data, 0)) {
            return KZGVerificationError.InvalidProof;
        }
        
        // TODO: Implement actual KZG verification
        // For now, return true for non-zero commitments and proofs
        return true;
    }
    
    pub fn blob_to_kzg_commitment(
        self: *const KZGVerifier,
        blob: *const Blob
    ) KZGVerificationError!KZGCommitment {
        if (self.trusted_setup == null) {
            return KZGVerificationError.LibraryNotAvailable;
        }
        
        // TODO: Implement actual KZG commitment computation
        // This would convert blob to polynomial and compute commitment
        
        // Placeholder implementation
        var commitment = KZGCommitment.init();
        
        // Use hash of blob as placeholder commitment
        const Sha256 = std.crypto.hash.sha2.Sha256;
        var hasher = Sha256.init(.{});
        hasher.update(&blob.data);
        const hash = hasher.finalResult();
        
        @memcpy(commitment.data[0..32], &hash);
        // Fill remaining 16 bytes with pattern
        @memset(commitment.data[32..48], 0x42);
        
        return commitment;
    }
};

const TrustedSetup = struct {
    g1_points: []G1Point,
    g2_points: []G2Point,
    
    pub fn load(allocator: std.mem.Allocator) !TrustedSetup {
        // TODO: Load actual trusted setup
        // For now, create minimal placeholder
        
        const g1_points = try allocator.alloc(G1Point, 4096);
        const g2_points = try allocator.alloc(G2Point, 65);
        
        // Initialize with placeholder values
        for (g1_points) |*point| {
            point.* = G1Point.identity();
        }
        
        for (g2_points) |*point| {
            point.* = G2Point.identity();
        }
        
        return TrustedSetup{
            .g1_points = g1_points,
            .g2_points = g2_points,
        };
    }
    
    pub fn deinit(self: *TrustedSetup, allocator: std.mem.Allocator) void {
        allocator.free(self.g1_points);
        allocator.free(self.g2_points);
    }
};

const G1Point = struct {
    x: [48]u8,
    y: [48]u8,
    
    pub fn identity() G1Point {
        return G1Point{
            .x = [_]u8{0} ** 48,
            .y = [_]u8{0} ** 48,
        };
    }
};

const G2Point = struct {
    x: [96]u8,
    y: [96]u8,
    
    pub fn identity() G2Point {
        return G2Point{
            .x = [_]u8{0} ** 96,
            .y = [_]u8{0} ** 96,
        };
    }
};
```

### Task 4: Implement Blob Transaction Type
File: `/src/evm/transaction/blob_transaction.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const B256 = @import("../Types/B256.ts").B256;
const AccessList = @import("access_list.zig").AccessList;
const Blob = @import("../blob/blob_types.zig").Blob;
const KZGCommitment = @import("../blob/blob_types.zig").KZGCommitment;
const KZGProof = @import("../blob/blob_types.zig").KZGProof;
const VersionedHash = @import("../blob/blob_types.zig").VersionedHash;

pub const BLOB_TX_TYPE = 0x03;

pub const BlobTransaction = struct {
    // EIP-1559 fields
    chain_id: u64,
    nonce: u64,
    max_priority_fee_per_gas: U256,
    max_fee_per_gas: U256,
    gas_limit: u64,
    to: ?Address,
    value: U256,
    data: []const u8,
    access_list: AccessList,
    
    // EIP-4844 fields
    max_fee_per_blob_gas: U256,
    blob_versioned_hashes: []const VersionedHash,
    
    // Not part of transaction encoding, but needed for pool/validation
    blobs: ?[]const Blob,
    commitments: ?[]const KZGCommitment,
    proofs: ?[]const KZGProof,
    
    // Signature
    v: U256,
    r: U256,
    s: U256,
    
    pub fn init(allocator: std.mem.Allocator) BlobTransaction {
        return BlobTransaction{
            .chain_id = 0,
            .nonce = 0,
            .max_priority_fee_per_gas = 0,
            .max_fee_per_gas = 0,
            .gas_limit = 0,
            .to = null,
            .value = 0,
            .data = &[_]u8{},
            .access_list = AccessList.init(allocator),
            .max_fee_per_blob_gas = 0,
            .blob_versioned_hashes = &[_]VersionedHash{},
            .blobs = null,
            .commitments = null,
            .proofs = null,
            .v = 0,
            .r = 0,
            .s = 0,
        };
    }
    
    pub fn deinit(self: *BlobTransaction, allocator: std.mem.Allocator) void {
        self.access_list.deinit();
        
        if (self.data.len > 0) {
            allocator.free(self.data);
        }
        
        if (self.blob_versioned_hashes.len > 0) {
            allocator.free(self.blob_versioned_hashes);
        }
        
        if (self.blobs) |blobs| {
            allocator.free(blobs);
        }
        
        if (self.commitments) |commitments| {
            allocator.free(commitments);
        }
        
        if (self.proofs) |proofs| {
            allocator.free(proofs);
        }
    }
    
    pub fn get_blob_count(self: *const BlobTransaction) u32 {
        return @as(u32, @intCast(self.blob_versioned_hashes.len));
    }
    
    pub fn get_blob_gas_used(self: *const BlobTransaction) u64 {
        return self.get_blob_count() * GAS_PER_BLOB;
    }
    
    pub fn calculate_blob_fee(self: *const BlobTransaction, blob_base_fee: U256) U256 {
        const blob_gas_used = self.get_blob_gas_used();
        return blob_gas_used * blob_base_fee;
    }
    
    pub fn encode_for_signing(self: *const BlobTransaction, allocator: std.mem.Allocator) ![]u8 {
        // Encode transaction for signature hash calculation
        // This follows EIP-2718 typed transaction encoding
        
        var list = std.ArrayList(u8).init(allocator);
        defer list.deinit();
        
        // Transaction type
        try list.append(BLOB_TX_TYPE);
        
        // RLP encode transaction payload
        // [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data, access_list, max_fee_per_blob_gas, blob_versioned_hashes]
        
        // TODO: Implement RLP encoding
        // This is a placeholder
        
        return list.toOwnedSlice();
    }
    
    pub fn hash(self: *const BlobTransaction, allocator: std.mem.Allocator) !B256 {
        const encoded = try self.encode_for_signing(allocator);
        defer allocator.free(encoded);
        
        const Keccak256 = std.crypto.hash.sha3.Keccak256;
        var hasher = Keccak256.init(.{});
        hasher.update(encoded);
        const hash_bytes = hasher.finalResult();
        
        return B256.from_slice(&hash_bytes);
    }
};
```

### Task 5: Update Block Structure with Blob Support
File: `/src/evm/block/blob_block.zig` (modify existing block structure)
```zig
const BlobGasMarket = @import("../blob/blob_gas_market.zig").BlobGasMarket;

pub const BlockHeader = struct {
    // Existing fields...
    
    // EIP-4844 fields
    blob_gas_used: u64,
    excess_blob_gas: u64,
    
    pub fn get_blob_base_fee(self: *const BlockHeader) U256 {
        // Calculate blob base fee from excess blob gas
        return calculate_blob_base_fee_from_excess_gas(self.excess_blob_gas);
    }
};

pub const Block = struct {
    header: BlockHeader,
    transactions: []Transaction,
    blob_transactions: []BlobTransaction,
    
    pub fn validate_blob_constraints(self: *const Block) bool {
        var total_blob_gas: u64 = 0;
        
        for (self.blob_transactions) |*tx| {
            total_blob_gas += tx.get_blob_gas_used();
        }
        
        // Check blob gas limit
        if (total_blob_gas > MAX_BLOB_GAS_PER_BLOCK) {
            return false;
        }
        
        // Update header blob gas used
        return self.header.blob_gas_used == total_blob_gas;
    }
};

fn calculate_blob_base_fee_from_excess_gas(excess_blob_gas: u64) U256 {
    // EIP-4844 formula: fake_exponential(MIN_BLOB_GASPRICE, excess_blob_gas, BLOB_GASPRICE_UPDATE_FRACTION)
    
    if (excess_blob_gas == 0) {
        return MIN_BLOB_GASPRICE;
    }
    
    // Simplified exponential approximation
    // This should be replaced with the exact fake_exponential function from EIP-4844
    const factor = excess_blob_gas / BLOB_GASPRICE_UPDATE_FRACTION;
    return MIN_BLOB_GASPRICE * (@as(U256, 1) << @min(factor, 64));
}
```

### Task 6: Update Opcodes with Blob Context
File: `/src/evm/execution/blob_opcodes.zig`
```zig
// Update BLOBHASH opcode implementation
pub fn execute_blobhash(vm: *Vm, frame: *Frame) !ExecutionResult {
    const index = frame.stack.pop_unsafe();
    
    // Get blob versioned hashes from transaction context
    const blob_hashes = frame.context.blob_versioned_hashes orelse {
        // No blob transaction context, push zero
        frame.stack.push_unsafe(0);
        return ExecutionResult.continue_execution;
    };
    
    if (index >= blob_hashes.len) {
        // Index out of bounds, push zero
        frame.stack.push_unsafe(0);
    } else {
        // Push the versioned hash
        const versioned_hash = blob_hashes[index];
        const hash_value = U256.from_be_bytes(&versioned_hash.bytes);
        frame.stack.push_unsafe(hash_value);
    }
    
    return ExecutionResult.continue_execution;
}

// Update BLOBBASEFEE opcode implementation  
pub fn execute_blobbasefee(vm: *Vm, frame: *Frame) !ExecutionResult {
    // Get blob base fee from block context
    const blob_base_fee = vm.block_context.get_blob_base_fee();
    frame.stack.push_unsafe(blob_base_fee);
    
    return ExecutionResult.continue_execution;
}
```

## Testing Requirements

### Test File
Create `/test/evm/blob/eip4844_test.zig`

### Test Cases
```zig
test "blob gas market calculations" {
    // Test blob base fee calculation
    // Test fee increases and decreases
    // Test minimum blob gas price enforcement
}

test "blob transaction validation" {
    // Test valid blob transactions
    // Test invalid blob counts
    // Test versioned hash validation
    // Test KZG proof verification
}

test "blob data structures" {
    // Test blob creation and field element extraction
    // Test KZG commitment and proof structures
    // Test versioned hash computation
}

test "block blob constraints" {
    // Test blob gas limit enforcement
    // Test blob gas used calculation
    // Test excess blob gas tracking
}

test "blob opcodes integration" {
    // Test BLOBHASH opcode with various indices
    // Test BLOBBASEFEE opcode
    // Test opcodes without blob context
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/blob/blob_types.zig` - Core blob data structures
- `/src/evm/blob/blob_gas_market.zig` - Blob gas pricing
- `/src/evm/blob/kzg_verification.zig` - KZG verification interface
- `/src/evm/transaction/blob_transaction.zig` - Blob transaction type
- `/src/evm/block/blob_block.zig` - Block with blob support
- `/src/evm/execution/blob_opcodes.zig` - Blob-related opcodes
- `/test/evm/blob/eip4844_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-4844 Compliance**: Full compliance with EIP-4844 specification
2. **Blob Validation**: Proper validation of blob transactions and data
3. **Gas Market**: Accurate blob gas pricing and fee calculation
4. **KZG Integration**: Working KZG commitment and proof verification
5. **Block Validation**: Proper blob constraints in block validation
6. **Opcode Support**: Correct implementation of BLOBHASH and BLOBBASEFEE

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **EIP-4844 specification compliance** - Must match exact behavior
3. **KZG verification accuracy** - Critical for blob security
4. **Gas market correctness** - Affects economic incentives
5. **Integration with existing systems** - Work with current transaction processing
6. **Test with real blob data** - Use actual EIP-4844 test vectors

## References

- [EIP-4844: Shard Blob Transactions](https://eips.ethereum.org/EIPS/eip-4844)
- [KZG Polynomial Commitments](https://dankradfeist.de/ethereum/2020/06/16/kate-polynomial-commitments.html)
- [C-KZG Library](https://github.com/ethereum/c-kzg-4844) - Reference implementation
- [EIP-4844 Test Vectors](https://github.com/ethereum/tests/tree/develop/src/EIPTestsFiller/StateTests/stEIP4844-blobtransactions)