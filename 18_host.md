# Host Interface Implementation Issue

## Overview

The Host interface defines the abstraction layer between the EVM interpreter and the blockchain environment, providing access to accounts, storage, blocks, and external calls while maintaining modularity and testability.

## Requirements

- Define clear interface between EVM and environment
- Support account and storage access
- Provide block and transaction context
- Handle external calls and creates
- Enable precompile execution
- Support logging and events
- Handle self-destruct scheduling
- Provide code and balance queries
- Support different backend implementations
- Enable testing with mock hosts

## Interface

```zig
const std = @import("std");
const Address = @import("address").Address;
const B256 = @import("utils").B256;
const Account = @import("Account.zig").Account;
const Log = @import("Log.zig").Log;

pub const HostError = error{
    AccountNotFound,
    InsufficientBalance,
    CodeNotFound,
    PrecompileError,
    CallDepthExceeded,
    OutOfGas,
    StackOverflow,
};

/// Result from external calls
pub const CallResult = struct {
    /// Whether the call succeeded
    success: bool,
    /// Gas remaining after call
    gas_left: u64,
    /// Output data from call
    output: ?[]const u8,
    /// Whether state should be reverted
    reverted: bool,
};

/// Parameters for external calls
pub const CallParams = struct {
    /// Type of call
    kind: CallKind,
    /// Caller address
    caller: Address,
    /// Target address
    to: Address,
    /// Value to transfer
    value: u256,
    /// Input data
    data: []const u8,
    /// Gas limit for call
    gas_limit: u64,
    /// Whether call is static
    is_static: bool,
};

/// Parameters for contract creation
pub const CreateParams = struct {
    /// Type of create
    kind: CreateKind,
    /// Creator address
    caller: Address,
    /// Value to transfer
    value: u256,
    /// Initialization code
    init_code: []const u8,
    /// Gas limit
    gas_limit: u64,
    /// Salt for CREATE2
    salt: ?B256,
};

/// Result from contract creation
pub const CreateResult = struct {
    /// Created contract address
    address: Address,
    /// Whether creation succeeded
    success: bool,
    /// Gas remaining
    gas_left: u64,
    /// Contract code if successful
    output: ?[]const u8,
    /// Whether state should be reverted
    reverted: bool,
};

/// Call types
pub const CallKind = enum {
    Call,
    CallCode,
    DelegateCall,
    StaticCall,
};

/// Create types
pub const CreateKind = enum {
    Create,
    Create2,
};

/// Block context provided by host
pub const BlockContext = struct {
    /// Current block number
    number: u64,
    /// Current block timestamp
    timestamp: u64,
    /// Block gas limit
    gas_limit: u64,
    /// Block coinbase/beneficiary
    coinbase: Address,
    /// Block difficulty/prevrandao
    difficulty: u256,
    /// Base fee per gas (EIP-1559)
    base_fee: u64,
    /// Blob base fee (EIP-4844)
    blob_base_fee: u64,
    /// Chain ID
    chain_id: u64,
};

/// Transaction context provided by host
pub const TxContext = struct {
    /// Transaction origin
    origin: Address,
    /// Gas price
    gas_price: u256,
    /// Blob hashes (EIP-4844)
    blob_hashes: []const B256,
    /// Block hashes available
    block_hashes: []const B256,
};

/// Main host interface
pub const Host = struct {
    /// Virtual table for dynamic dispatch
    vtable: *const VTable,
    /// Implementation pointer
    impl: *anyopaque,

    pub const VTable = struct {
        // Account operations
        accountExists: *const fn (impl: *anyopaque, address: Address) HostError!bool,
        getBalance: *const fn (impl: *anyopaque, address: Address) HostError!u256,
        getCode: *const fn (impl: *anyopaque, address: Address) HostError![]const u8,
        getCodeHash: *const fn (impl: *anyopaque, address: Address) HostError!B256,
        getCodeSize: *const fn (impl: *anyopaque, address: Address) HostError!u64,
        getNonce: *const fn (impl: *anyopaque, address: Address) HostError!u64,
        
        // Storage operations
        getStorage: *const fn (impl: *anyopaque, address: Address, key: B256) HostError!B256,
        setStorage: *const fn (impl: *anyopaque, address: Address, key: B256, value: B256) HostError!void,
        getOriginalStorage: *const fn (impl: *anyopaque, address: Address, key: B256) HostError!B256,
        
        // Transient storage (EIP-1153)
        getTransientStorage: *const fn (impl: *anyopaque, address: Address, key: B256) HostError!B256,
        setTransientStorage: *const fn (impl: *anyopaque, address: Address, key: B256, value: B256) HostError!void,
        
        // Account modification
        setBalance: *const fn (impl: *anyopaque, address: Address, balance: u256) HostError!void,
        setNonce: *const fn (impl: *anyopaque, address: Address, nonce: u64) HostError!void,
        setCode: *const fn (impl: *anyopaque, address: Address, code: []const u8) HostError!void,
        createAccount: *const fn (impl: *anyopaque, address: Address) HostError!void,
        selfDestruct: *const fn (impl: *anyopaque, address: Address, beneficiary: Address) HostError!void,
        
        // Access tracking (EIP-2929)
        accessAccount: *const fn (impl: *anyopaque, address: Address) HostError!bool,
        accessStorage: *const fn (impl: *anyopaque, address: Address, key: B256) HostError!bool,
        
        // Calls and creates
        call: *const fn (impl: *anyopaque, params: CallParams) HostError!CallResult,
        create: *const fn (impl: *anyopaque, params: CreateParams) HostError!CreateResult,
        
        // Precompiles
        executePrecompile: *const fn (impl: *anyopaque, address: Address, input: []const u8, gas: u64) HostError!CallResult,
        isPrecompile: *const fn (impl: *anyopaque, address: Address) bool,
        
        // Logging
        log: *const fn (impl: *anyopaque, log: Log) HostError!void,
        
        // Block information
        getBlockHash: *const fn (impl: *anyopaque, number: u64) HostError!B256,
        getBlockContext: *const fn (impl: *anyopaque) BlockContext,
        getTxContext: *const fn (impl: *anyopaque) TxContext,
        
        // Gas
        useGas: *const fn (impl: *anyopaque, amount: u64) HostError!void,
        gasLeft: *const fn (impl: *anyopaque) u64,
        
        // Allocator
        getAllocator: *const fn (impl: *anyopaque) std.mem.Allocator,
    };

    // Convenience methods that forward to vtable

    pub fn accountExists(self: *Host, address: Address) !bool {
        return self.vtable.accountExists(self.impl, address);
    }

    pub fn getBalance(self: *Host, address: Address) !u256 {
        return self.vtable.getBalance(self.impl, address);
    }

    pub fn getCode(self: *Host, address: Address) ![]const u8 {
        return self.vtable.getCode(self.impl, address);
    }

    pub fn getCodeHash(self: *Host, address: Address) !B256 {
        return self.vtable.getCodeHash(self.impl, address);
    }

    pub fn getCodeSize(self: *Host, address: Address) !u64 {
        return self.vtable.getCodeSize(self.impl, address);
    }

    pub fn getNonce(self: *Host, address: Address) !u64 {
        return self.vtable.getNonce(self.impl, address);
    }

    pub fn getStorage(self: *Host, address: Address, key: B256) !B256 {
        return self.vtable.getStorage(self.impl, address, key);
    }

    pub fn setStorage(self: *Host, address: Address, key: B256, value: B256) !void {
        return self.vtable.setStorage(self.impl, address, key, value);
    }

    pub fn getOriginalStorage(self: *Host, address: Address, key: B256) !B256 {
        return self.vtable.getOriginalStorage(self.impl, address, key);
    }

    pub fn getTransientStorage(self: *Host, address: Address, key: B256) !B256 {
        return self.vtable.getTransientStorage(self.impl, address, key);
    }

    pub fn setTransientStorage(self: *Host, address: Address, key: B256, value: B256) !void {
        return self.vtable.setTransientStorage(self.impl, address, key, value);
    }

    pub fn setBalance(self: *Host, address: Address, balance: u256) !void {
        return self.vtable.setBalance(self.impl, address, balance);
    }

    pub fn setNonce(self: *Host, address: Address, nonce: u64) !void {
        return self.vtable.setNonce(self.impl, address, nonce);
    }

    pub fn setCode(self: *Host, address: Address, code: []const u8) !void {
        return self.vtable.setCode(self.impl, address, code);
    }

    pub fn createAccount(self: *Host, address: Address) !void {
        return self.vtable.createAccount(self.impl, address);
    }

    pub fn selfDestruct(self: *Host, address: Address, beneficiary: Address) !void {
        return self.vtable.selfDestruct(self.impl, address, beneficiary);
    }

    pub fn accessAccount(self: *Host, address: Address) !bool {
        return self.vtable.accessAccount(self.impl, address);
    }

    pub fn accessStorage(self: *Host, address: Address, key: B256) !bool {
        return self.vtable.accessStorage(self.impl, address, key);
    }

    pub fn call(self: *Host, params: CallParams) !CallResult {
        return self.vtable.call(self.impl, params);
    }

    pub fn create(self: *Host, params: CreateParams) !CreateResult {
        return self.vtable.create(self.impl, params);
    }

    pub fn executePrecompile(self: *Host, address: Address, input: []const u8, gas: u64) !CallResult {
        return self.vtable.executePrecompile(self.impl, address, input, gas);
    }

    pub fn isPrecompile(self: *Host, address: Address) bool {
        return self.vtable.isPrecompile(self.impl, address);
    }

    pub fn log(self: *Host, log_entry: Log) !void {
        return self.vtable.log(self.impl, log_entry);
    }

    pub fn getBlockHash(self: *Host, number: u64) !B256 {
        return self.vtable.getBlockHash(self.impl, number);
    }

    pub fn getBlockContext(self: *Host) BlockContext {
        return self.vtable.getBlockContext(self.impl);
    }

    pub fn getTxContext(self: *Host) TxContext {
        return self.vtable.getTxContext(self.impl);
    }

    pub fn useGas(self: *Host, amount: u64) !void {
        return self.vtable.useGas(self.impl, amount);
    }

    pub fn gasLeft(self: *Host) u64 {
        return self.vtable.gasLeft(self.impl);
    }

    pub fn getAllocator(self: *Host) std.mem.Allocator {
        return self.vtable.getAllocator(self.impl);
    }
};

/// Standard host implementation backed by StateManager
pub const StandardHost = struct {
    state_manager: *StateManager,
    precompiles: *Precompiles,
    block_ctx: BlockContext,
    tx_ctx: TxContext,
    gas_meter: *Gas,
    logs: std.ArrayList(Log),
    allocator: std.mem.Allocator,
    call_stack: std.ArrayList(CallFrame),
    self_destructs: std.ArrayList(SelfDestruct),

    const CallFrame = struct {
        caller: Address,
        contract: Address,
        is_static: bool,
        depth: u32,
    };

    const SelfDestruct = struct {
        address: Address,
        beneficiary: Address,
    };

    pub fn init(
        allocator: std.mem.Allocator,
        state_manager: *StateManager,
        precompiles: *Precompiles,
        block_ctx: BlockContext,
        tx_ctx: TxContext,
        gas_meter: *Gas,
    ) !StandardHost {
        return .{
            .state_manager = state_manager,
            .precompiles = precompiles,
            .block_ctx = block_ctx,
            .tx_ctx = tx_ctx,
            .gas_meter = gas_meter,
            .logs = std.ArrayList(Log).init(allocator),
            .allocator = allocator,
            .call_stack = std.ArrayList(CallFrame).init(allocator),
            .self_destructs = std.ArrayList(SelfDestruct).init(allocator),
        };
    }

    pub fn deinit(self: *StandardHost) void {
        self.logs.deinit();
        self.call_stack.deinit();
        self.self_destructs.deinit();
    }

    pub fn toHost(self: *StandardHost) Host {
        return .{
            .vtable = &vtable,
            .impl = self,
        };
    }

    // VTable implementation
    const vtable = Host.VTable{
        .accountExists = accountExists,
        .getBalance = getBalance,
        .getCode = getCode,
        .getCodeHash = getCodeHash,
        .getCodeSize = getCodeSize,
        .getNonce = getNonce,
        .getStorage = getStorage,
        .setStorage = setStorage,
        .getOriginalStorage = getOriginalStorage,
        .getTransientStorage = getTransientStorage,
        .setTransientStorage = setTransientStorage,
        .setBalance = setBalance,
        .setNonce = setNonce,
        .setCode = setCode,
        .createAccount = createAccount,
        .selfDestruct = selfDestruct,
        .accessAccount = accessAccount,
        .accessStorage = accessStorage,
        .call = call,
        .create = create,
        .executePrecompile = executePrecompile,
        .isPrecompile = isPrecompile,
        .log = addLog,
        .getBlockHash = getBlockHash,
        .getBlockContext = getBlockContext,
        .getTxContext = getTxContext,
        .useGas = useGas,
        .gasLeft = gasLeft,
        .getAllocator = getAllocator,
    };

    // Implementation methods
    fn accountExists(impl: *anyopaque, address: Address) HostError!bool {
        const self: *StandardHost = @ptrCast(@alignCast(impl));
        return self.state_manager.accountExists(address) catch error.AccountNotFound;
    }

    fn getBalance(impl: *anyopaque, address: Address) HostError!u256 {
        const self: *StandardHost = @ptrCast(@alignCast(impl));
        return self.state_manager.getBalance(address) catch error.AccountNotFound;
    }

    fn getCode(impl: *anyopaque, address: Address) HostError![]const u8 {
        const self: *StandardHost = @ptrCast(@alignCast(impl));
        return self.state_manager.getCode(address) catch error.CodeNotFound;
    }

    // ... implement all other methods

    fn call(impl: *anyopaque, params: CallParams) HostError!CallResult {
        const self: *StandardHost = @ptrCast(@alignCast(impl));
        
        // Check call depth
        if (self.call_stack.items.len >= 1024) {
            return error.CallDepthExceeded;
        }
        
        // Push call frame
        try self.call_stack.append(.{
            .caller = params.caller,
            .contract = params.to,
            .is_static = params.is_static,
            .depth = @intCast(u32, self.call_stack.items.len),
        });
        defer _ = self.call_stack.pop();
        
        // Execute call (would integrate with interpreter)
        // This is simplified - actual implementation would create new interpreter instance
        
        return CallResult{
            .success = true,
            .gas_left = params.gas_limit / 2, // Placeholder
            .output = null,
            .reverted = false,
        };
    }

    fn executePrecompile(impl: *anyopaque, address: Address, input: []const u8, gas: u64) HostError!CallResult {
        const self: *StandardHost = @ptrCast(@alignCast(impl));
        
        const result = self.precompiles.execute(
            address,
            input,
            gas,
            self.allocator,
        ) catch return error.PrecompileError;
        
        return CallResult{
            .success = result.success,
            .gas_left = gas - result.gas_cost,
            .output = result.output,
            .reverted = false,
        };
    }
};

/// Mock host for testing
pub const MockHost = struct {
    accounts: std.AutoHashMap(Address, MockAccount),
    logs: std.ArrayList(Log),
    block_ctx: BlockContext,
    tx_ctx: TxContext,
    allocator: std.mem.Allocator,

    const MockAccount = struct {
        balance: u256,
        nonce: u64,
        code: []const u8,
        storage: std.AutoHashMap(B256, B256),
    };

    pub fn init(allocator: std.mem.Allocator) MockHost {
        return .{
            .accounts = std.AutoHashMap(Address, MockAccount).init(allocator),
            .logs = std.ArrayList(Log).init(allocator),
            .block_ctx = .{
                .number = 1,
                .timestamp = 1000,
                .gas_limit = 30_000_000,
                .coinbase = Address.zero(),
                .difficulty = 0,
                .base_fee = 0,
                .blob_base_fee = 0,
                .chain_id = 1,
            },
            .tx_ctx = .{
                .origin = Address.zero(),
                .gas_price = 0,
                .blob_hashes = &.{},
                .block_hashes = &.{},
            },
            .allocator = allocator,
        };
    }

    pub fn deinit(self: *MockHost) void {
        var iter = self.accounts.iterator();
        while (iter.next()) |entry| {
            entry.value_ptr.storage.deinit();
        }
        self.accounts.deinit();
        self.logs.deinit();
    }

    pub fn setAccount(self: *MockHost, address: Address, balance: u256, nonce: u64, code: []const u8) !void {
        const account = MockAccount{
            .balance = balance,
            .nonce = nonce,
            .code = code,
            .storage = std.AutoHashMap(B256, B256).init(self.allocator),
        };
        try self.accounts.put(address, account);
    }

    pub fn toHost(self: *MockHost) Host {
        // Similar vtable setup as StandardHost
        return .{
            .vtable = &mock_vtable,
            .impl = self,
        };
    }

    // ... implement mock methods
};
```

## Reference Implementations

### Go-Ethereum (core/vm/interface.go)

```go
// EVMLogger is used to collect execution traces from an EVM transaction
type EVMLogger interface {
    // Transaction level
    CaptureStart(from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
    CaptureEnd(output []byte, gasUsed uint64, err error)
    // Top call frame
    CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
    CaptureExit(output []byte, gasUsed uint64, err error)
    // Opcode level
    CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
    CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
}

// StateDB is an EVM database for full state querying.
type StateDB interface {
    CreateAccount(common.Address)
    
    SubBalance(common.Address, *uint256.Int, tracing.BalanceChangeReason)
    AddBalance(common.Address, *uint256.Int, tracing.BalanceChangeReason)
    GetBalance(common.Address) *uint256.Int
    
    GetNonce(common.Address) uint64
    SetNonce(common.Address, uint64)
    
    GetCodeHash(common.Address) common.Hash
    GetCode(common.Address) []byte
    SetCode(common.Address, []byte)
    GetCodeSize(common.Address) int
    
    AddRefund(uint64)
    SubRefund(uint64)
    GetRefund() uint64
    
    GetCommittedState(common.Address, common.Hash) common.Hash
    GetState(common.Address, common.Hash) common.Hash
    SetState(common.Address, common.Hash, common.Hash)
    
    GetTransientState(addr common.Address, key common.Hash) common.Hash
    SetTransientState(addr common.Address, key, value common.Hash)
    
    SelfDestruct(common.Address)
    HasSelfDestructed(common.Address) bool
    
    // Exist reports whether the given account exists in state.
    Exist(common.Address) bool
    // Empty returns whether the given account is empty.
    Empty(common.Address) bool
    
    AddressInAccessList(addr common.Address) bool
    SlotInAccessList(addr common.Address, slot common.Hash) (addressOk bool, slotOk bool)
    AddAddressToAccessList(addr common.Address)
    AddSlotToAccessList(addr common.Address, slot common.Hash)
    Prepare(rules params.Rules, sender, coinbase common.Address, dest *common.Address, precompiles []common.Address, txAccesses types.AccessList)
    
    RevertToSnapshot(int)
    Snapshot() int
    
    AddLog(*types.Log)
    AddPreimage(common.Hash, []byte)
}
```

### revm (crates/primitives/src/env.rs)

```rust
/// EVM environment host.
pub trait Host {
    /// Returns a reference to the environment.
    fn env(&self) -> &Env;

    /// Returns a mutable reference to the environment.
    fn env_mut(&mut self) -> &mut Env;

    /// Load an account.
    fn load_account(&mut self, address: Address) -> Option<LoadAccountResult>;

    /// Get the block hash of the given block `number`.
    fn block_hash(&mut self, number: u64) -> Option<B256>;

    /// Get balance of `address` and if the account is cold.
    fn balance(&mut self, address: Address) -> Option<StateLoad<U256>>;

    /// Get code of `address` and if the account is cold.
    fn code(&mut self, address: Address) -> Option<StateLoad<Bytes>>;

    /// Get code hash of `address` and if the account is cold.
    fn code_hash(&mut self, address: Address) -> Option<StateLoad<B256>>;

    /// Get storage value of `address` at `index` and if the account is cold.
    fn sload(&mut self, address: Address, index: U256) -> Option<StateLoad<U256>>;

    /// Set storage value of `address` at `index`.
    fn sstore(&mut self, address: Address, index: U256, value: U256) -> Option<SStoreResult>;

    /// Get the transient storage value of `address` at `index`.
    fn tload(&mut self, address: Address, index: U256) -> U256;

    /// Set the transient storage value of `address` at `index`.
    fn tstore(&mut self, address: Address, index: U256, value: U256);

    /// Emit a log owned by `address` with given `LogData`.
    fn log(&mut self, log: Log);

    /// Mark `address` to be deleted, with funds transferred to `target`.
    fn selfdestruct(&mut self, address: Address, target: Address) -> Option<SelfDestructResult>;
}
```

### evmone (include/evmone/host.hpp)

```cpp
/// The EVMC Host interface
class Host : public evmc_host_context
{
public:
    virtual ~Host() = default;

    /// @name EVMC host interface
    /// @{
    virtual bool account_exists(const address& addr) const noexcept = 0;

    virtual bytes32 get_storage(const address& addr, const bytes32& key) const noexcept = 0;

    virtual evmc_storage_status set_storage(const address& addr, const bytes32& key,
        const bytes32& value) noexcept = 0;

    virtual uint256be get_balance(const address& addr) const noexcept = 0;

    virtual size_t get_code_size(const address& addr) const noexcept = 0;

    virtual bytes32 get_code_hash(const address& addr) const noexcept = 0;

    virtual size_t copy_code(const address& addr, size_t code_offset, uint8_t* buffer_data,
        size_t buffer_size) const noexcept = 0;

    virtual bool selfdestruct(const address& addr, const address& beneficiary) noexcept = 0;

    virtual Result call(const evmc_message& msg) noexcept = 0;

    virtual evmc_tx_context get_tx_context() const noexcept = 0;

    virtual bytes32 get_block_hash(int64_t block_number) const noexcept = 0;

    virtual void emit_log(const address& addr, const uint8_t* data, size_t data_size,
        const bytes32 topics[], size_t topics_count) noexcept = 0;

    virtual evmc_access_status access_account(const address& addr) noexcept = 0;

    virtual evmc_access_status access_storage(const address& addr, const bytes32& key) noexcept = 0;

    virtual bytes32 get_transient_storage(const address& addr, const bytes32& key) const noexcept = 0;

    virtual void set_transient_storage(const address& addr, const bytes32& key,
        const bytes32& value) noexcept = 0;
    /// @}
};
```

## Usage Example

```zig
// Create standard host with state manager
var standard_host = try StandardHost.init(
    allocator,
    &state_manager,
    &precompiles,
    block_context,
    tx_context,
    &gas_meter,
);
defer standard_host.deinit();

var host = standard_host.toHost();

// Use in interpreter
const balance = try host.getBalance(address);
const code = try host.getCode(contract_address);

// Access tracking
const was_cold = try host.accessAccount(address);
if (was_cold) {
    // Charge cold access cost
}

// Storage operations
const value = try host.getStorage(address, slot);
try host.setStorage(address, slot, new_value);

// External call
const result = try host.call(.{
    .kind = .Call,
    .caller = sender,
    .to = recipient,
    .value = amount,
    .data = input,
    .gas_limit = gas,
    .is_static = false,
});

// Logging
try host.log(.{
    .address = contract,
    .topics = &[_]B256{topic1, topic2},
    .data = log_data,
});

// For testing with mock host
var mock_host = MockHost.init(allocator);
defer mock_host.deinit();

try mock_host.setAccount(test_address, 1000000, 1, &[_]u8{});
var test_host = mock_host.toHost();

// Use mock host for testing
const mock_balance = try test_host.getBalance(test_address);
```

## Testing Requirements

1. **Interface Compliance**:
   - Test all host methods
   - Test error conditions
   - Test vtable dispatch

2. **State Operations**:
   - Test account CRUD
   - Test storage operations
   - Test transient storage

3. **Call Handling**:
   - Test external calls
   - Test creates
   - Test precompiles
   - Test call depth limits

4. **Access Tracking**:
   - Test warm/cold tracking
   - Test access list pre-warming
   - Test gas cost differences

5. **Mock Testing**:
   - Test mock host behavior
   - Test isolation between tests
   - Test deterministic results

## References

- [EVMC Host Interface](https://evmc.ethereum.org/)
- [Go-Ethereum VM interfaces](https://github.com/ethereum/go-ethereum/blob/master/core/vm/interface.go)
- [revm Host trait](https://github.com/bluealloy/revm/blob/main/crates/primitives/src/env.rs)
- [evmone host.hpp](https://github.com/ethereum/evmone/blob/master/include/evmone/host.hpp)