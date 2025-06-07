const Address = @import("Address");

/// Represents a single, revertible change to the EVM state.
/// This is the core data structure for the state journal, allowing the EVM
/// to undo changes in case of a REVERT or error.
pub const JournalEntry = union(enum) {
    /// A storage slot was modified.
    StorageChange: struct {
        address: Address.Address,
        key: u256,
        /// The value of the storage slot *before* this change.
        old_value: u256,
    },
    /// An account's balance was modified.
    BalanceChange: struct {
        address: Address.Address,
        /// The balance of the account *before* this change.
        old_balance: u256,
    },
    /// An account's nonce was modified.
    NonceChange: struct {
        address: Address.Address,
        /// The nonce of the account *before* this change.
        old_nonce: u64,
    },
    /// A contract's code was set. Reverting this will remove the code.
    CodeChange: struct {
        address: Address.Address,
    },
    /// A new account was created. Reverting this will remove the account entirely.
    AccountCreated: struct {
        address: Address.Address,
    },
    /// An account was marked for self-destruction. Reverting this un-marks it.
    AccountDestructed: struct {
        address: Address.Address,
    },
    /// A transient storage slot was modified.
    TransientStorageChange: struct {
        address: Address.Address,
        key: u256,
        /// The value of the transient storage slot *before* this change.
        old_value: u256,
    },
    /// A log was emitted. Reverting this removes the log.
    Log: void,
};
