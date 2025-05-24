# Withdrawal & WithdrawalProcessor Implementation Issue

## Overview

Withdrawal.zig and WithdrawalProcessor.zig implement EIP-4895 validator withdrawals, enabling the transfer of ETH from the beacon chain to the EVM for staking rewards and validator exits post-merge.

## Requirements

- Define withdrawal data structure per EIP-4895
- Convert amounts from Gwei to Wei correctly
- Process withdrawals in order by index
- Credit withdrawal amounts to recipient addresses
- Handle account creation for new addresses
- Support batch withdrawal processing
- Integrate with state manager for balance updates
- Validate withdrawal data integrity
- Track total withdrawn amount
- Support Shanghai hardfork activation

## Interface

```zig
const std = @import("std");
const Address = @import("address").Address;
const StateManager = @import("StateManager.zig").StateManager;

pub const WithdrawalError = error{
    InvalidAmount,
    InvalidIndex,
    StateUpdateFailed,
    OutOfMemory,
};

/// Withdrawal data per EIP-4895
pub const Withdrawal = struct {
    /// Unique withdrawal index (monotonically increasing)
    index: u64,
    /// Validator index from beacon chain
    validator_index: u64,
    /// Recipient address on execution layer
    address: Address,
    /// Amount in Gwei (10^9 Gwei = 1 ETH)
    amount: u64,

    /// Convert Gwei amount to Wei
    pub fn amountInWei(self: *const Withdrawal) u128 {
        return @as(u128, self.amount) * 1_000_000_000;
    }

    /// Validate withdrawal data
    pub fn validate(self: *const Withdrawal) WithdrawalError!void {
        // Amount must be reasonable (prevent overflow)
        if (self.amount > 32_000_000_000) { // 32 ETH max per withdrawal
            return error.InvalidAmount;
        }
    }

    /// Create withdrawal from beacon chain data
    pub fn fromBeaconData(
        index: u64,
        validator_index: u64,
        address: Address,
        amount_gwei: u64,
    ) WithdrawalError!Withdrawal {
        const withdrawal = Withdrawal{
            .index = index,
            .validator_index = validator_index,
            .address = address,
            .amount = amount_gwei,
        };
        
        try withdrawal.validate();
        return withdrawal;
    }

    /// RLP encode withdrawal
    pub fn encode(self: *const Withdrawal, allocator: std.mem.Allocator) ![]u8 {
        var items = std.ArrayList(rlp.Item).init(allocator);
        defer items.deinit();

        try items.append(.{ .String = std.mem.asBytes(&self.index) });
        try items.append(.{ .String = std.mem.asBytes(&self.validator_index) });
        try items.append(.{ .String = &self.address });
        try items.append(.{ .String = std.mem.asBytes(&self.amount) });

        return rlp.encode(allocator, .{ .List = items.items });
    }

    /// RLP decode withdrawal
    pub fn decode(allocator: std.mem.Allocator, data: []const u8) !Withdrawal {
        const decoded = try rlp.decode(allocator, data);
        defer decoded.deinit();

        const list = decoded.List;
        if (list.len != 4) return error.InvalidWithdrawal;

        return Withdrawal{
            .index = try rlp.decodeInt(u64, list[0]),
            .validator_index = try rlp.decodeInt(u64, list[1]),
            .address = try Address.fromBytes(list[2].String),
            .amount = try rlp.decodeInt(u64, list[3]),
        };
    }
};

/// Processes withdrawals updating account balances
pub const WithdrawalProcessor = struct {
    /// State manager for account updates
    state_manager: *StateManager,
    /// Track total amount withdrawn
    total_withdrawn: u128,
    /// Track number of withdrawals processed
    withdrawals_processed: u64,
    /// Allocator for temporary allocations
    allocator: std.mem.Allocator,

    /// Initialize withdrawal processor
    pub fn init(state_manager: *StateManager, allocator: std.mem.Allocator) WithdrawalProcessor {
        return .{
            .state_manager = state_manager,
            .total_withdrawn = 0,
            .withdrawals_processed = 0,
            .allocator = allocator,
        };
    }

    /// Process a single withdrawal
    pub fn processWithdrawal(self: *WithdrawalProcessor, withdrawal: *const Withdrawal) WithdrawalError!void {
        // Validate withdrawal
        try withdrawal.validate();
        
        // Convert amount to Wei
        const amount_wei = withdrawal.amountInWei();
        
        // Get or create account
        var account = try self.state_manager.getAccount(withdrawal.address);
        if (account == null) {
            // Create new account with withdrawal amount
            try self.state_manager.createAccount(withdrawal.address);
            account = try self.state_manager.getAccount(withdrawal.address);
        }
        
        // Add withdrawal amount to balance
        const new_balance = account.?.balance + amount_wei;
        try self.state_manager.setBalance(withdrawal.address, new_balance);
        
        // Update tracking
        self.total_withdrawn += amount_wei;
        self.withdrawals_processed += 1;
        
        // Log withdrawal
        std.log.info("Processed withdrawal {}: {} Gwei to {}", .{
            withdrawal.index,
            withdrawal.amount,
            withdrawal.address,
        });
    }

    /// Process multiple withdrawals in order
    pub fn processWithdrawals(self: *WithdrawalProcessor, withdrawals: []const Withdrawal) WithdrawalError!void {
        // Validate withdrawals are in order
        var last_index: u64 = 0;
        for (withdrawals) |withdrawal| {
            if (withdrawal.index <= last_index and last_index != 0) {
                return error.InvalidIndex;
            }
            last_index = withdrawal.index;
        }
        
        // Process each withdrawal
        for (withdrawals) |withdrawal| {
            try self.processWithdrawal(&withdrawal);
        }
    }

    /// Process withdrawals for a block
    pub fn processBlockWithdrawals(
        self: *WithdrawalProcessor,
        block_withdrawals: ?[]const Withdrawal,
    ) WithdrawalError!void {
        // No withdrawals before Shanghai
        if (block_withdrawals == null) {
            return;
        }
        
        try self.processWithdrawals(block_withdrawals.?);
    }

    /// Get withdrawal processing summary
    pub fn getSummary(self: *const WithdrawalProcessor) WithdrawalSummary {
        return .{
            .total_withdrawn = self.total_withdrawn,
            .withdrawals_processed = self.withdrawals_processed,
            .average_withdrawal = if (self.withdrawals_processed > 0)
                self.total_withdrawn / self.withdrawals_processed
            else 0,
        };
    }

    /// Reset processor state
    pub fn reset(self: *WithdrawalProcessor) void {
        self.total_withdrawn = 0;
        self.withdrawals_processed = 0;
    }
};

/// Summary of withdrawal processing
pub const WithdrawalSummary = struct {
    total_withdrawn: u128,
    withdrawals_processed: u64,
    average_withdrawal: u128,
};

/// Helper to convert withdrawal list to MPT root
pub fn calculateWithdrawalsRoot(allocator: std.mem.Allocator, withdrawals: []const Withdrawal) !B256 {
    var trie = try Trie.init(allocator);
    defer trie.deinit();
    
    for (withdrawals, 0..) |withdrawal, i| {
        const key = try rlp.encodeInt(allocator, i);
        defer allocator.free(key);
        
        const value = try withdrawal.encode(allocator);
        defer allocator.free(value);
        
        try trie.put(key, value);
    }
    
    return trie.root();
}
```

## Code Reference from Existing Implementation

From the existing Withdrawal.zig:

```zig
// WithdrawalData represents a withdrawal from the beacon chain to the EVM
// as defined in EIP-4895
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
```

From WithdrawalProcessor.zig:

```zig
/// Processes a withdrawal by crediting the specified account with the withdrawal amount.
/// This operation cannot fail and must always succeed to maintain consensus.
///
/// Parameters:
/// - stateManager: The state manager to update account balances
/// - withdrawal: The withdrawal data to process
///
/// Returns: Error if account operations fail (this should not happen in practice)
pub fn processWithdrawal(stateManager: *StateManager, withdrawal: *const WithdrawalData) !void {
    const logger = getLogger();
    const scoped = createScopedLogger(logger, "processWithdrawal");
    defer scoped.deinit();
    
    // Convert Gwei to Wei (1 Gwei = 10^9 Wei)
    const amountWei = @as(u128, withdrawal.amount) * 1_000_000_000;
    
    logger.info("Processing withdrawal index={d} validator={d} amount={d} Gwei ({d} Wei) to address={s}", .{
        withdrawal.index,
        withdrawal.validatorIndex,
        withdrawal.amount,
        amountWei,
        std.fmt.bytesToHex(withdrawal.address, .lower),
    });
```

## Reference Implementations

### Go-Ethereum (consensus/beacon/consensus.go)

```go
// Finalize implements consensus.Engine, performing post-transaction state modifications.
func (beacon *Beacon) Finalize(chain consensus.ChainHeaderReader, header *types.Header, state *state.StateDB, body *types.Body) {
    // Withdrawals processing
    for _, w := range body.Withdrawals {
        // Convert amount from gwei to wei
        amount := new(uint256.Int).SetUint64(w.Amount)
        amount = amount.Mul(amount, uint256.NewInt(params.GWei))
        state.AddBalance(w.Address, amount, tracing.BalanceIncreaseWithdrawal)
    }
}

// Withdrawal represents a validator withdrawal from the consensus layer.
type Withdrawal struct {
    Index      uint64         `json:"index"`          // monotonically increasing identifier
    Validator  uint64         `json:"validatorIndex"` // index of validator associated with withdrawal
    Address    common.Address `json:"address"`        // target address for withdrawn ether
    Amount     uint64         `json:"amount"`         // withdrawal amount in Gwei
}
```

### revm (crates/primitives/src/withdrawal.rs)

```rust
/// Withdrawal represents a validator withdrawal from the beacon chain.
#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct Withdrawal {
    /// Monotonically increasing identifier issued by consensus layer.
    pub index: u64,
    /// Index of validator associated with withdrawal.
    pub validator_index: u64,
    /// Target address for withdrawn ether.
    pub address: Address,
    /// Withdrawal amount in gwei.
    pub amount_gwei: u64,
}

impl Withdrawal {
    /// Return the withdrawal amount in wei.
    pub fn amount_wei(&self) -> U256 {
        U256::from(self.amount_gwei) * U256::from(1_000_000_000)
    }
}
```

### evmone (lib/evmone/state.hpp)

```cpp
struct Withdrawal
{
    uint64_t index = 0;
    uint64_t validator_index = 0;
    address recipient;
    uint64_t amount_gwei = 0;

    [[nodiscard]] bool operator==(const Withdrawal&) const noexcept = default;
};

/// Applies withdrawals to the state by increasing recipients' balances.
inline void apply_withdrawals(State& state, const std::vector<Withdrawal>& withdrawals)
{
    for (const auto& w : withdrawals)
    {
        const auto amount_wei = intx::uint256{w.amount_gwei} * 1'000'000'000;
        state.touch(w.recipient).balance += amount_wei;
    }
}
```

## Usage Example

```zig
// Initialize withdrawal processor
var processor = WithdrawalProcessor.init(&state_manager, allocator);

// Create withdrawals from beacon chain data
const withdrawals = [_]Withdrawal{
    try Withdrawal.fromBeaconData(
        100,        // index
        1234,       // validator index
        recipient1, // address
        1000000,    // 1M Gwei = 1 ETH
    ),
    try Withdrawal.fromBeaconData(
        101,
        1235,
        recipient2,
        500000,     // 0.5 ETH
    ),
};

// Process withdrawals for block
try processor.processBlockWithdrawals(&withdrawals);

// Get processing summary
const summary = processor.getSummary();
std.log.info("Processed {} withdrawals, total {} Wei", .{
    summary.withdrawals_processed,
    summary.total_withdrawn,
});

// Calculate withdrawals root for block header
const withdrawals_root = try calculateWithdrawalsRoot(allocator, &withdrawals);
```

## Testing Requirements

1. **Basic Processing**:
   - Test single withdrawal processing
   - Test batch withdrawal processing
   - Test Gwei to Wei conversion
   - Test account creation for new addresses

2. **Validation**:
   - Test withdrawal index ordering
   - Test amount validation
   - Test invalid withdrawal rejection

3. **State Updates**:
   - Test balance increases
   - Test account creation
   - Test existing account updates

4. **Edge Cases**:
   - Test zero amount withdrawals
   - Test maximum amount withdrawals
   - Test empty withdrawal list
   - Test pre-Shanghai blocks (no withdrawals)

5. **Integration**:
   - Test with StateManager
   - Test withdrawal root calculation
   - Test block processing

## References

- [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) - Beacon chain push withdrawals as operations
- [Shanghai Upgrade](https://ethereum.org/en/history/#shanghai) - Enabled staking withdrawals
- [Go-Ethereum withdrawal.go](https://github.com/ethereum/go-ethereum/blob/master/core/types/withdrawal.go)