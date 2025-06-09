# Implement EIP-7702 EOA Account Code Delegation

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_eip7702_delegation` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_eip7702_delegation feat_implement_eip7702_delegation`
3. **Work in isolation**: `cd g/feat_implement_eip7702_delegation`
4. **Commit message**: `✨ feat: implement EIP-7702 EOA account code delegation`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement EIP-7702 which allows Externally Owned Accounts (EOAs) to temporarily delegate their code execution to a smart contract. This enables EOAs to have smart contract functionality while maintaining their key-based ownership model. EIP-7702 is a key component for account abstraction and improved user experience.

## EIP-7702 Specification

### Core Concepts

#### 1. Delegation Designation
```zig
pub const DELEGATION_DESIGNATION_MAGIC = 0xef0100;

pub const DelegationDesignation = struct {
    chain_id: u64,
    address: Address,
    nonce: u64,
    
    pub fn encode(self: *const DelegationDesignation) [60]u8 {
        var encoded: [60]u8 = undefined;
        
        // Magic bytes (3 bytes)
        encoded[0] = 0xef;
        encoded[1] = 0x01;
        encoded[2] = 0x00;
        
        // Chain ID (8 bytes, big-endian)
        std.mem.writeIntBig(u64, encoded[3..11], self.chain_id);
        
        // Address (20 bytes)
        @memcpy(encoded[11..31], &self.address.bytes);
        
        // Nonce (8 bytes, big-endian) + padding (21 bytes of zeros)
        std.mem.writeIntBig(u64, encoded[31..39], self.nonce);
        @memset(encoded[39..60], 0);
        
        return encoded;
    }
    
    pub fn decode(encoded: []const u8) !DelegationDesignation {
        if (encoded.len != 60) {
            return error.InvalidDelegationLength;
        }
        
        // Check magic bytes
        if (encoded[0] != 0xef or encoded[1] != 0x01 or encoded[2] != 0x00) {
            return error.InvalidDelegationMagic;
        }
        
        const chain_id = std.mem.readIntBig(u64, encoded[3..11]);
        
        var address: Address = undefined;
        @memcpy(&address.bytes, encoded[11..31]);
        
        const nonce = std.mem.readIntBig(u64, encoded[31..39]);
        
        // Verify padding is all zeros
        for (encoded[39..60]) |byte| {
            if (byte != 0) {
                return error.InvalidDelegationPadding;
            }
        }
        
        return DelegationDesignation{
            .chain_id = chain_id,
            .address = address,
            .nonce = nonce,
        };
    }
};
```

#### 2. Authorization Tuple
```zig
pub const AuthorizationTuple = struct {
    chain_id: u64,
    address: Address,
    nonce: u64,
    y_parity: u8,
    r: U256,
    s: U256,
    
    pub fn init() AuthorizationTuple {
        return AuthorizationTuple{
            .chain_id = 0,
            .address = Address.zero(),
            .nonce = 0,
            .y_parity = 0,
            .r = 0,
            .s = 0,
        };
    }
    
    pub fn hash(self: *const AuthorizationTuple) B256 {
        // Calculate hash for signature verification
        // Hash = keccak256(MAGIC || rlp([chain_id, address, nonce]))
        
        const encoded_data = self.encode_for_signing();
        
        const Keccak256 = std.crypto.hash.sha3.Keccak256;
        var hasher = Keccak256.init(.{});
        hasher.update(&encoded_data);
        const hash_bytes = hasher.finalResult();
        
        return B256.from_slice(&hash_bytes);
    }
    
    fn encode_for_signing(self: *const AuthorizationTuple) [43]u8 {
        var encoded: [43]u8 = undefined;
        
        // Magic constant for EIP-7702
        encoded[0] = 0x05; // EIP-7702 magic
        
        // RLP encode [chain_id, address, nonce]
        // This is a simplified encoding - real implementation would use proper RLP
        std.mem.writeIntBig(u64, encoded[1..9], self.chain_id);
        @memcpy(encoded[9..29], &self.address.bytes);
        std.mem.writeIntBig(u64, encoded[29..37], self.nonce);
        
        // Padding
        @memset(encoded[37..43], 0);
        
        return encoded;
    }
    
    pub fn recover_authority(self: *const AuthorizationTuple) !Address {
        // Recover the address that signed this authorization
        const message_hash = self.hash();
        
        // Use ECRECOVER to get signer address
        return ecrecover_address(
            &message_hash.bytes,
            self.y_parity + 27, // Convert to recovery ID
            self.r,
            self.s
        );
    }
};
```

### Transaction Type
```zig
pub const SET_CODE_TX_TYPE = 0x04;

pub const SetCodeTransaction = struct {
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
    
    // EIP-7702 field
    authorization_list: []const AuthorizationTuple,
    
    // Signature
    y_parity: u8,
    r: U256,
    s: U256,
    
    pub fn process_authorizations(
        self: *const SetCodeTransaction,
        state: *State,
        chain_id: u64
    ) ![]AuthorizationResult {
        var results = try state.allocator.alloc(AuthorizationResult, self.authorization_list.len);
        
        for (self.authorization_list, 0..) |*auth, i| {
            results[i] = try process_single_authorization(auth, state, chain_id);
        }
        
        return results;
    }
};

pub const AuthorizationResult = union(enum) {
    success: Address, // Authority address that was delegated
    invalid_chain_id: void,
    invalid_signature: void,
    invalid_nonce: void,
    authority_is_deployed: void, // Authority already has code
};
```

## Implementation Requirements

### Core Functionality
1. **Authorization Processing**: Validate and apply authorization tuples
2. **Code Delegation**: Set EOA code to delegation designation
3. **Execution Context**: Handle delegated execution properly
4. **Nonce Management**: Track authorization nonces separately
5. **Revert Handling**: Proper cleanup of delegations on revert
6. **Chain ID Validation**: Ensure authorizations match current chain

### State Management
```zig
pub const AccountDelegation = struct {
    is_delegated: bool,
    delegated_address: Address,
    authorization_nonce: u64,
    
    pub fn init() AccountDelegation {
        return AccountDelegation{
            .is_delegated = false,
            .delegated_address = Address.zero(),
            .authorization_nonce = 0,
        };
    }
};

pub const DelegationManager = struct {
    delegations: std.HashMap(Address, AccountDelegation, AddressContext, std.hash_map.default_max_load_percentage),
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) DelegationManager {
        return DelegationManager{
            .delegations = std.HashMap(Address, AccountDelegation, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *DelegationManager) void {
        self.delegations.deinit();
    }
    
    pub fn set_delegation(
        self: *DelegationManager,
        authority: Address,
        delegated_to: Address,
        nonce: u64
    ) !void {
        const delegation = AccountDelegation{
            .is_delegated = true,
            .delegated_address = delegated_to,
            .authorization_nonce = nonce,
        };
        
        try self.delegations.put(authority, delegation);
    }
    
    pub fn get_delegation(self: *DelegationManager, address: Address) ?AccountDelegation {
        return self.delegations.get(address);
    }
    
    pub fn remove_delegation(self: *DelegationManager, address: Address) void {
        _ = self.delegations.remove(address);
    }
    
    pub fn get_effective_code_address(self: *DelegationManager, address: Address) Address {
        if (self.get_delegation(address)) |delegation| {
            if (delegation.is_delegated) {
                return delegation.delegated_address;
            }
        }
        return address;
    }
};
```

## Implementation Tasks

### Task 1: Implement Authorization Data Structures
File: `/src/evm/eip7702/authorization.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const B256 = @import("../Types/B256.ts").B256;

pub const EIP7702_MAGIC = 0x05;
pub const DELEGATION_DESIGNATION_PREFIX = [3]u8{ 0xef, 0x01, 0x00 };

pub const AuthorizationTuple = struct {
    chain_id: u64,
    address: Address,
    nonce: u64,
    y_parity: u8,
    r: U256,
    s: U256,
    
    pub fn init() AuthorizationTuple {
        return AuthorizationTuple{
            .chain_id = 0,
            .address = Address.zero(),
            .nonce = 0,
            .y_parity = 0,
            .r = 0,
            .s = 0,
        };
    }
    
    pub fn commitment_hash(self: *const AuthorizationTuple) B256 {
        // Calculate keccak256(0x05 || rlp([chain_id, address, nonce]))
        var buffer: [100]u8 = undefined; // Adequate size for encoding
        var stream = std.io.fixedBufferStream(&buffer);
        var writer = stream.writer();
        
        // Magic byte
        writer.writeByte(EIP7702_MAGIC) catch unreachable;
        
        // RLP encode [chain_id, address, nonce]
        encode_authorization_rlp(writer, self) catch unreachable;
        
        const encoded = stream.getWritten();
        
        const Keccak256 = std.crypto.hash.sha3.Keccak256;
        var hasher = Keccak256.init(.{});
        hasher.update(encoded);
        const hash_bytes = hasher.finalResult();
        
        return B256.from_slice(&hash_bytes);
    }
    
    pub fn recover_authority(self: *const AuthorizationTuple) !Address {
        const commit_hash = self.commitment_hash();
        
        // Recover signer address using ECRECOVER
        return ecrecover_address(
            &commit_hash.bytes,
            self.y_parity + 27,
            self.r,
            self.s
        );
    }
    
    pub fn is_valid_for_chain(self: *const AuthorizationTuple, chain_id: u64) bool {
        return self.chain_id == chain_id;
    }
};

fn encode_authorization_rlp(writer: anytype, auth: *const AuthorizationTuple) !void {
    // Simplified RLP encoding for [chain_id, address, nonce]
    // In production, use a proper RLP library
    
    // Write chain_id as big-endian u64
    var chain_id_bytes: [8]u8 = undefined;
    std.mem.writeIntBig(u64, &chain_id_bytes, auth.chain_id);
    try writer.writeAll(&chain_id_bytes);
    
    // Write address
    try writer.writeAll(&auth.address.bytes);
    
    // Write nonce as big-endian u64
    var nonce_bytes: [8]u8 = undefined;
    std.mem.writeIntBig(u64, &nonce_bytes, auth.nonce);
    try writer.writeAll(&nonce_bytes);
}

pub const DelegationDesignation = struct {
    chain_id: u64,
    address: Address,
    nonce: u64,
    
    pub fn encode(self: *const DelegationDesignation) [60]u8 {
        var designation: [60]u8 = undefined;
        
        // Magic prefix (3 bytes)
        @memcpy(designation[0..3], &DELEGATION_DESIGNATION_PREFIX);
        
        // Chain ID (8 bytes, big-endian)
        std.mem.writeIntBig(u64, designation[3..11], self.chain_id);
        
        // Address (20 bytes)
        @memcpy(designation[11..31], &self.address.bytes);
        
        // Nonce (8 bytes, big-endian)
        std.mem.writeIntBig(u64, designation[31..39], self.nonce);
        
        // Padding (21 bytes of zeros)
        @memset(designation[39..60], 0);
        
        return designation;
    }
    
    pub fn decode(code: []const u8) ?DelegationDesignation {
        if (code.len != 60) return null;
        
        // Check magic prefix
        if (!std.mem.eql(u8, code[0..3], &DELEGATION_DESIGNATION_PREFIX)) {
            return null;
        }
        
        // Check padding is all zeros
        for (code[39..60]) |byte| {
            if (byte != 0) return null;
        }
        
        const chain_id = std.mem.readIntBig(u64, code[3..11]);
        
        var address: Address = undefined;
        @memcpy(&address.bytes, code[11..31]);
        
        const nonce = std.mem.readIntBig(u64, code[31..39]);
        
        return DelegationDesignation{
            .chain_id = chain_id,
            .address = address,
            .nonce = nonce,
        };
    }
    
    pub fn is_valid_delegation(code: []const u8) bool {
        return decode(code) != null;
    }
};

// Placeholder for ECRECOVER - should use actual implementation
fn ecrecover_address(hash: []const u8, v: u8, r: U256, s: U256) !Address {
    // TODO: Implement actual ECRECOVER
    // This is a placeholder
    _ = hash;
    _ = v;
    _ = r;
    _ = s;
    return error.NotImplemented;
}
```

### Task 2: Implement Set Code Transaction Type
File: `/src/evm/transaction/set_code_transaction.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const AccessList = @import("access_list.zig").AccessList;
const AuthorizationTuple = @import("../eip7702/authorization.zig").AuthorizationTuple;

pub const SET_CODE_TX_TYPE = 0x04;

pub const SetCodeTransaction = struct {
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
    
    // EIP-7702 field
    authorization_list: []const AuthorizationTuple,
    
    // Signature
    y_parity: u8,
    r: U256,
    s: U256,
    
    pub fn init(allocator: std.mem.Allocator) SetCodeTransaction {
        return SetCodeTransaction{
            .chain_id = 0,
            .nonce = 0,
            .max_priority_fee_per_gas = 0,
            .max_fee_per_gas = 0,
            .gas_limit = 0,
            .to = null,
            .value = 0,
            .data = &[_]u8{},
            .access_list = AccessList.init(allocator),
            .authorization_list = &[_]AuthorizationTuple{},
            .y_parity = 0,
            .r = 0,
            .s = 0,
        };
    }
    
    pub fn deinit(self: *SetCodeTransaction, allocator: std.mem.Allocator) void {
        self.access_list.deinit();
        
        if (self.data.len > 0) {
            allocator.free(self.data);
        }
        
        if (self.authorization_list.len > 0) {
            allocator.free(self.authorization_list);
        }
    }
    
    pub fn get_authorization_count(self: *const SetCodeTransaction) u32 {
        return @as(u32, @intCast(self.authorization_list.len));
    }
    
    pub fn encode_for_signing(self: *const SetCodeTransaction, allocator: std.mem.Allocator) ![]u8 {
        // Encode transaction for signature hash calculation
        var list = std.ArrayList(u8).init(allocator);
        defer list.deinit();
        
        // Transaction type
        try list.append(SET_CODE_TX_TYPE);
        
        // RLP encode transaction payload
        // [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data, access_list, authorization_list]
        
        // TODO: Implement proper RLP encoding
        // This is a placeholder
        
        return list.toOwnedSlice();
    }
    
    pub fn hash(self: *const SetCodeTransaction, allocator: std.mem.Allocator) !B256 {
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

### Task 3: Implement Authorization Processing
File: `/src/evm/eip7702/authorization_processor.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;
const State = @import("../state/state.zig").State;
const AuthorizationTuple = @import("authorization.zig").AuthorizationTuple;
const DelegationDesignation = @import("authorization.zig").DelegationDesignation;

pub const AuthorizationError = error{
    InvalidChainId,
    InvalidSignature,
    InvalidNonce,
    AuthorityHasCode,
    RecoveryFailed,
};

pub const AuthorizationResult = union(enum) {
    success: struct {
        authority: Address,
        delegated_to: Address,
    },
    invalid_chain_id: void,
    invalid_signature: void,
    invalid_nonce: void,
    authority_has_code: void,
};

pub const AuthorizationProcessor = struct {
    pub fn process_authorization(
        auth: *const AuthorizationTuple,
        state: *State,
        chain_id: u64
    ) AuthorizationResult {
        // Validate chain ID
        if (!auth.is_valid_for_chain(chain_id)) {
            return AuthorizationResult.invalid_chain_id;
        }
        
        // Recover authority address
        const authority = auth.recover_authority() catch {
            return AuthorizationResult.invalid_signature;
        };
        
        // Check if authority already has code deployed (not delegation)
        const existing_code = state.get_code(authority);
        if (existing_code.len > 0) {
            // Check if it's a delegation designation
            if (!DelegationDesignation.is_valid_delegation(existing_code)) {
                return AuthorizationResult.authority_has_code;
            }
        }
        
        // Check authorization nonce
        const current_auth_nonce = state.get_authorization_nonce(authority);
        if (auth.nonce != current_auth_nonce) {
            return AuthorizationResult.invalid_nonce;
        }
        
        // Create delegation designation
        const designation = DelegationDesignation{
            .chain_id = chain_id,
            .address = auth.address,
            .nonce = auth.nonce,
        };
        
        // Set the delegation code
        const designation_code = designation.encode();
        state.set_code(authority, &designation_code);
        
        // Increment authorization nonce
        state.set_authorization_nonce(authority, current_auth_nonce + 1);
        
        return AuthorizationResult{
            .success = .{
                .authority = authority,
                .delegated_to = auth.address,
            }
        };
    }
    
    pub fn process_authorization_list(
        authorization_list: []const AuthorizationTuple,
        state: *State,
        chain_id: u64,
        allocator: std.mem.Allocator
    ) ![]AuthorizationResult {
        var results = try allocator.alloc(AuthorizationResult, authorization_list.len);
        
        for (authorization_list, 0..) |*auth, i| {
            results[i] = process_authorization(auth, state, chain_id);
        }
        
        return results;
    }
    
    pub fn get_effective_code_address(state: *State, address: Address) Address {
        const code = state.get_code(address);
        
        if (DelegationDesignation.decode(code)) |designation| {
            return designation.address;
        }
        
        return address;
    }
    
    pub fn is_delegated_account(state: *State, address: Address) bool {
        const code = state.get_code(address);
        return DelegationDesignation.is_valid_delegation(code);
    }
};
```

### Task 4: Update State Management
File: `/src/evm/state/state.zig` (modify existing)
```zig
// Add authorization nonce tracking to account state
pub const Account = struct {
    // Existing fields...
    authorization_nonce: u64,
    
    pub fn init() Account {
        return Account{
            // Existing initialization...
            .authorization_nonce = 0,
        };
    }
};

pub const State = struct {
    // Existing fields...
    
    pub fn get_authorization_nonce(self: *State, address: Address) u64 {
        if (self.get_account(address)) |account| {
            return account.authorization_nonce;
        }
        return 0;
    }
    
    pub fn set_authorization_nonce(self: *State, address: Address, nonce: u64) void {
        const account = self.get_or_create_account(address);
        account.authorization_nonce = nonce;
    }
    
    pub fn get_effective_code(self: *State, address: Address) []const u8 {
        const code = self.get_code(address);
        
        // Check if it's a delegation
        if (DelegationDesignation.decode(code)) |designation| {
            // Return the code of the delegated address
            return self.get_code(designation.address);
        }
        
        return code;
    }
    
    pub fn get_effective_code_address(self: *State, address: Address) Address {
        const code = self.get_code(address);
        
        if (DelegationDesignation.decode(code)) |designation| {
            return designation.address;
        }
        
        return address;
    }
};
```

### Task 5: Update VM Execution Context
File: `/src/evm/vm.zig` (modify existing)
```zig
const AuthorizationProcessor = @import("eip7702/authorization_processor.zig").AuthorizationProcessor;

pub const Vm = struct {
    // Existing fields...
    
    pub fn execute_set_code_transaction(
        self: *Vm,
        tx: *const SetCodeTransaction
    ) !TransactionResult {
        // Process authorizations before transaction execution
        const auth_results = try AuthorizationProcessor.process_authorization_list(
            tx.authorization_list,
            &self.state,
            self.chain_id,
            self.allocator
        );
        defer self.allocator.free(auth_results);
        
        // Log authorization results
        for (auth_results) |result| {
            switch (result) {
                .success => |info| {
                    Log.debug("Authorization successful: {} delegated to {}", .{ info.authority, info.delegated_to });
                },
                else => {
                    Log.debug("Authorization failed: {}", .{result});
                },
            }
        }
        
        // Execute transaction normally
        return self.execute_transaction_base(tx);
    }
    
    pub fn get_execution_code(self: *Vm, address: Address) []const u8 {
        // Get the effective code for execution
        return self.state.get_effective_code(address);
    }
    
    pub fn get_execution_code_address(self: *Vm, address: Address) Address {
        // Get the effective code address for execution
        return self.state.get_effective_code_address(address);
    }
};
```

### Task 6: Update Call Operations
File: `/src/evm/execution/system.zig` (modify existing calls)
```zig
// Update CALL operations to handle delegation
pub fn execute_call(vm: *Vm, frame: *Frame) !ExecutionResult {
    // ... existing call setup ...
    
    // Get effective code address for the target
    const effective_code_address = vm.get_execution_code_address(target_address);
    const execution_code = vm.get_execution_code(target_address);
    
    // Create call context with proper addresses
    const call_context = CallContext{
        .address = target_address,        // Original target (for storage, balance, etc.)
        .code_address = effective_code_address, // Where to get code from
        .caller = frame.context.address,
        .value = value,
        .call_data = input_data,
        .gas_limit = gas_calc.gas_forwarded,
        .code = execution_code,
    };
    
    // ... rest of call execution ...
}

// Similar updates for DELEGATECALL, STATICCALL, etc.
```

## Testing Requirements

### Test File
Create `/test/evm/eip7702/eip7702_test.zig`

### Test Cases
```zig
test "authorization tuple encoding and recovery" {
    // Test authorization tuple creation
    // Test commitment hash calculation
    // Test authority recovery from signature
}

test "delegation designation encoding" {
    // Test designation encoding/decoding
    // Test magic prefix validation
    // Test padding validation
}

test "authorization processing" {
    // Test valid authorization processing
    // Test invalid chain ID rejection
    // Test invalid nonce rejection
    // Test authority with existing code rejection
}

test "set code transaction execution" {
    // Test transaction with authorization list
    // Test multiple authorizations in one transaction
    // Test authorization failures
}

test "delegated execution" {
    // Test calling delegated EOA
    // Test storage access (should use original address)
    // Test code execution (should use delegated code)
}

test "delegation edge cases" {
    // Test delegating to non-existent contract
    // Test delegation chain limits
    // Test delegation with revert
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/eip7702/authorization.zig` - Authorization data structures
- `/src/evm/transaction/set_code_transaction.zig` - New transaction type
- `/src/evm/eip7702/authorization_processor.zig` - Authorization processing logic
- `/src/evm/state/state.zig` - Add authorization nonce tracking
- `/src/evm/vm.zig` - Update VM for delegation support
- `/src/evm/execution/system.zig` - Update call operations
- `/test/evm/eip7702/eip7702_test.zig` - Comprehensive tests

## Success Criteria

1. **EIP-7702 Compliance**: Full compliance with EIP-7702 specification
2. **Authorization Validation**: Proper validation of authorization tuples
3. **Delegation Execution**: Correct execution of delegated code
4. **State Management**: Proper tracking of authorization nonces
5. **Transaction Processing**: Support for set code transaction type
6. **Security**: Proper validation prevents unauthorized delegations

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **EIP-7702 specification compliance** - Must match exact behavior
3. **Signature verification accuracy** - Critical for security
4. **Proper address resolution** - Code vs storage address handling
5. **Nonce management** - Prevent replay attacks
6. **Integration testing** - Test with real smart contracts

## References

- [EIP-7702: Set EOA account code](https://eips.ethereum.org/EIPS/eip-7702)
- [Account Abstraction Overview](https://ethereum.org/en/roadmap/account-abstraction/)
- [EIP-3074: AUTH and AUTHCALL opcodes](https://eips.ethereum.org/EIPS/eip-3074) - Related proposal
- [EIP-7702 Test Vectors](https://github.com/ethereum/tests/tree/develop/src/EIPTestsFiller/StateTests/stEIP7702)