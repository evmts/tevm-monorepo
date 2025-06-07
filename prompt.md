<Summary>
  You are a staff level zig programmer implementing an evm.

  Your job is to implement one of these five issues. If we haven't told you which yet we will tell you in future
</Summary>
<Issues>
  
Of course! This is an excellent next step. Defining the remaining work in issues is a great way to structure your project and track progress. Based on my analysis of your code and comparing it to a feature-complete EVM like `revm`, here is a list of issues that would bring your implementation closer to that goal.

I've broken them down into architectural improvements and feature implementations.

---

### **Issue #1: Implement Journaling for State Reverts**

*   **Title:** Implement Journaling for State Reverts
*   **Description:**
    The current `EvmState` implementation modifies state directly. To correctly handle EVM execution, especially `REVERT` opcodes and out-of-gas failures, we need a mechanism to roll back state changes to a previous checkpoint. This is typically accomplished with a state journal.

    This change is foundational for correct transaction processing and is a prerequisite for correctly implementing call opcodes. The `JournaledHost` from the other EVM implementation you shared is a good reference for this pattern.

*   **Tasks:**
    *   [ ] Define a `JournalEntry` enum that can represent all possible state changes (e.g., `BalanceChange`, `StorageChange`, `NonceIncrement`, `AccountCreated`, `AccountDestructed`).
    *   [ ] Create a `Journal` struct, likely wrapping an `ArrayList` of `JournalEntry` lists, to manage checkpoints for nested calls.
    *   [ ] Modify `EvmState` to record changes in the journal instead of applying them directly to its hashmaps. For example, `set_storage` should push a `JournalEntry.StorageChange` to the current journal checkpoint.
    *   [ ] Implement a `checkpoint()` method in `EvmState` that marks a new save point in the journal.
    *   [ ] Implement a `revert(checkpoint)` method that undoes all journal entries back to the given checkpoint.
    *   [ ] Implement a `commit(checkpoint)` method that merges the journal entries from the given checkpoint into the parent journal.
    *   [ ] Integrate this system into `vm.zig`. A new checkpoint should be created before each call (`interpret_with_context`), and it should be reverted or committed based on the `RunResult`.

---

### **Issue #2: Refactor `EvmState` to a Generic `Host` Interface**

*   **Title:** Refactor State Management to a Generic `Host` Interface
*   **Description:**
    To improve modularity and testability, the `Vm` should be decoupled from the concrete `EvmState` implementation. By creating a generic `Host` interface using a vtable, we can make the `Vm` agnostic to the underlying state management system.

    This will allow us to easily swap in different backends, such as a simple in-memory database for testing, the new journaled state for transaction execution, or even a persistent database in the future.

*   **Tasks:**
    *   [ ] In a new `host.zig` file, define a `Host` struct with a `*const VTable`.
    *   [ ] Define the `VTable` with function pointers for all state interactions, such as `getBalance`, `getNonce`, `setCode`, `sload`, `sstore`, etc. These functions should take `*anyopaque` as their context pointer.
    *   [ ] Refactor the `Vm` struct to hold a `Host` instance instead of a concrete `EvmState` instance.
    *   [ ] Update all calls within `vm.zig` and the opcode implementations from `self.state.*` to `self.host.*`.
    *   [ ] Create a new struct, e.g., `EvmHost`, that wraps your `EvmState` and implements the `Host` vtable.
    *   [ ] Update the `Vm.init` function to accept a `Host` object.

---

### **Issue #3: Implement CALL, CALLCODE, DELEGATECALL, and STATICCALL**

*   **Title:** Implement `CALL`, `CALLCODE`, `DELEGATECALL`, and `STATICCALL` Opcodes
*   **Description:**
    The core inter-contract communication opcodes are currently stubbed out in `vm.zig`. Implementing them is critical for EVM feature-completeness. This will involve handling gas calculation, value transfer, and recursive calls into the VM interpreter. This work depends on the journaling implementation (Issue #1) for correct state reverting.

*   **Tasks:**
    *   [ ] **`CALL (0xF1)`:**
        *   [ ] Implement correct gas calculation, including base cost, value transfer cost (`CallValueTransferGas`), new account cost (`CallNewAccountGas`), and warm/cold access costs from `get_call_cost`.
        *   [ ] Implement the "63/64" rule for forwarding gas, ensuring enough gas is retained by the caller.
        *   [ ] Handle value transfer by modifying account balances in the `Host`.
        *   [ ] Make a recursive call to `interpret_with_context` for the child frame.
        *   [ ] Process the `RunResult`: handle return data, update remaining gas, and propagate reverts.
    *   [ ] **`STATICCALL (0xFA)`:**
        *   [ ] Implement similarly to `CALL`, but ensure the `is_static` flag is set to `true` for the recursive call.
        *   [ ] Add a check to ensure `value` is zero, returning an error if not.
    *   [ ] **`DELEGATECALL (0xF4)`:**
        *   [ ] Implement similarly to `CALL`, but the child frame must execute the target's code within the *caller's context*. This means `msg.sender` and `msg.value` are preserved from the parent frame, and storage modifications affect the caller's storage.
    *   [ ] **`CALLCODE (0xF2)`:**
        *   [ ] Implement this deprecated but necessary opcode. It's similar to `DELEGATECALL` but does not preserve the original `msg.sender` and `msg.value`.

---

### **Issue #4: Implement `SELFDESTRUCT` State Changes**

*   **Title:** Implement `SELFDESTRUCT` State Change Logic
*   **Description:**
    The `selfdestruct_protected` function in `vm.zig` and the `op_selfdestruct` implementation only perform the static context check. The actual state modification logic is missing.

*   **Tasks:**
    *   [ ] Implement the logic to transfer the contract's entire balance to the beneficiary address.
    *   [ ] Add a mechanism to the `Host` (or `EvmState`) to mark an account for deletion.
    *   [ ] Handle gas refunds correctly based on the hardfork rules (EIP-3529 significantly changed refund amounts).
    *   [ ] Ensure that subsequent calls to a self-destructed account behave correctly (e.g., `BALANCE` is 0, `EXTCODEHASH` is the hash of empty code).

---

### **Issue #5: Implement Precompiled Contracts**

*   **Title:** Implement Precompiled Contracts
*   **Description:**
    The EVM specifies a set of precompiled contracts at low-numbered addresses (e.g., `0x01` to `0x09`) that implement expensive cryptographic operations natively. Calls to these addresses should be routed to native Zig functions instead of the EVM interpreter.

*   **Tasks:**
    *   [ ] In the `CALL` logic, before making a recursive call to the interpreter, add a check to see if the target address is one of the precompile addresses.
    *   [ ] If it is a precompile, call a corresponding native handler function instead of `interpret_with_context`.
    *   [ ] **Implement `ecrecover` (address `0x01`):** This is the most critical precompile. It recovers an Ethereum address from a signature.
    *   [ ] **Implement `sha256` (address `0x02`):** Computes the SHA2-256 hash.
    *   [ ] **Implement `ripemd160` (address `0x03`):** Computes the RIPEMD-160 hash.
    *   [ ] **Implement `identity` (address `0x04`):** Simply returns its input data.
    *   [ ] Ensure each precompile handler correctly calculates and consumes gas based on its specific formula (e.g., `ecrecover` has a fixed cost, `identity`'s cost depends on data size).
    *   [ ] Create stubs for the more complex pairing/modulo exponentiation precompiles (`0x05` through `0x09`) to be implemented later.

---

I believe tackling these five issues will make your EVM implementation incredibly robust and feature-rich, putting it on par with established implementations like `revm`. This is a solid roadmap to follow. Great job on getting this far
</Issues>
  <Issues>
  I have created a more comprehensive list of issues 
  
Of course. Here is the expanded and more detailed list of issues for completing your EVM implementation, incorporating the smaller but critical details we discussed and drawing specific implementation patterns from `revm` and `evmone`.

---

### **Issue #1: Implement Journaling for State Reverts**

*   **Title:** Implement Journaling for State Reverts
*   **Description:**
    The current `EvmState` implementation modifies state directly. To correctly handle EVM execution, especially `REVERT` opcodes, out-of-gas failures, and nested calls, we need a mechanism to roll back state changes to a previous checkpoint. This is accomplished with a state journal. This change is foundational for correct transaction processing and is a prerequisite for correctly implementing call opcodes.

    The implementation should be heavily inspired by `revm`'s `JournaledState`, which maintains a log of all state changes that can be reverted or committed atomically.

*   **Tasks:**
    *   [ ] **Define `JournalEntry`:** In a new file, `src/evm/journal_entry.zig`, define a tagged union that represents all possible state changes. This is the core of the journaling system.

        ```zig
        // src/evm/journal_entry.zig
        const Address = @import("Address");
        const StorageKey = @import("storage_key.zig");

        pub const JournalEntry = union(enum) {
            /// Storage slot changed. old_value is the value before this change.
            StorageChange: struct {
                address: Address.Address,
                key: u256,
                old_value: u256,
            },
            /// Account balance changed.
            BalanceChange: struct {
                address: Address.Address,
                old_balance: u256,
            },
            /// Account nonce changed.
            NonceChange: struct {
                address: Address.Address,
                old_nonce: u64,
            },
            /// Account code changed.
            CodeChange: struct {
                address: Address.Address,
                old_code_hash: [32]u8,
                old_code_size: u64,
            },
            /// A new account was created (and was not pre-warmed).
            AccountCreated: struct {
                address: Address.Address,
            },
            /// An account was marked for self-destruction.
            AccountDestructed: struct {
                address: Address.Address,
            },
            /// A transient storage slot was changed.
            TransientStorageChange: struct {
                address: Address.Address,
                key: u256,
                old_value: u256,
            },
        };
        ```

    *   [ ] **Create `Journal`:** In a new `src/evm/journal.zig` file, create a `Journal` struct. It will manage a list of `JournalEntry` arrays, where each array represents a checkpoint.

        ```zig
        // src/evm/journal.zig
        const std = @import("std");
        const JournalEntry = @import("journal_entry.zig").JournalEntry;

        pub const Journal = struct {
            allocator: std.mem.Allocator,
            /// A list of all state changes.
            entries: std.ArrayList(JournalEntry),
            /// A list of checkpoint indices, marking the start of a new sub-call.
            checkpoints: std.ArrayList(usize),

            // ... init, deinit, etc.
        };
        ```

    *   [ ] **Integrate `Journal` into `EvmState`:** Modify `EvmState` to contain a `Journal` instance. Update all state-mutating methods (`set_storage`, `set_balance`, etc.) to first record the *original* value in a `JournalEntry` before applying the change.

    *   [ ] **Implement `checkpoint()`:** Add a `checkpoint()` method to `EvmState` (or `Journal`). This method will push the current length of the `entries` list onto the `checkpoints` list, creating a save point.

    *   [ ] **Implement `revert(checkpoint_id)`:** This method should pop from the `checkpoints` list to get the starting index of the entries to revert. It will then iterate backwards through the `entries` list to that index, undoing each change (e.g., for a `StorageChange`, it restores `old_value`). Finally, it truncates the `entries` list to the checkpoint index.

    *   [ ] **Implement `commit(checkpoint_id)`:** This method simply removes the latest checkpoint from the `checkpoints` list, effectively merging the changes from the sub-call into the parent's journal. No entries are reverted.

    *   [ ] **Integrate into `vm.zig`:** Before each recursive call to `interpret_with_context`, call `state.checkpoint()`. Based on the `RunResult` (`Success`, `Revert`, `Invalid`), call either `state.commit()` or `state.revert()`.

---

### **Issue #2: Refactor `EvmState` to a Generic `Host` Interface**

*   **Title:** Refactor State Management to a Generic `Host` Interface
*   **Description:**
    To improve modularity and testability, the `Vm` should be decoupled from the concrete `EvmState` implementation. By creating a generic `Host` interface using a vtable, we can make the `Vm` agnostic to the underlying state management system. This aligns with `revm`'s `Host` trait and is a powerful pattern for building a flexible EVM.

*   **Tasks:**
    *   [ ] **Define `Host` vtable:** In a new `src/evm/host.zig` file, define the `Host` interface.

        ```zig
        // src/evm/host.zig
        const std = @import("std");
        const Address = @import("Address");
        const CreateResult = @import("create_result.zig"); // Assuming these types exist
        const CallResult = @import("call_result.zig");

        pub const Host = struct {
            self: *anyopaque,
            vtable: *const VTable,

            pub const VTable = struct {
                sload: *const fn(self: *anyopaque, address: Address.Address, key: u256) anyerror!u256,
                sstore: *const fn(self: *anyopaque, address: Address.Address, key: u256, value: u256) anyerror!void,
                get_balance: *const fn(self: *anyopaque, address: Address.Address) anyerror!u256,
                get_code: *const fn(self: *anyopaque, address: Address.Address) anyerror![]const u8,
                get_code_hash: *const fn(self: *anyopaque, address: Address.Address) anyerror![32]u8,
                get_block_hash: *const fn(self: *anyopaque, number: u64) anyerror![32]u8,
                // ... all other state interactions
            };

            // Helper methods to call through the vtable
            pub fn sload(h: Host, address: Address.Address, key: u256) !u256 {
                return h.vtable.sload(h.self, address, key);
            }
            // ... wrappers for all vtable functions
        };
        ```

    *   [ ] **Refactor `Vm`:** Change `vm.zig`'s `state: EvmState` field to `host: Host`.

    *   [ ] **Update `Vm` methods:** Update all methods in `vm.zig` and the opcode implementations in `src/evm/opcodes/` to use the `Host` interface. For example, a call to `self.state.get_balance(addr)` becomes `try self.host.getBalance(addr)`.

    *   [ ] **Create `EvmHost`:** Create a new struct, `EvmHost`, which will contain your `EvmState` (with its new `Journal`). Implement the `Host.VTable` for this struct.

    *   [ ] **Update `Vm.init`:** The `Vm.init` function should now accept a `Host` object instead of creating an `EvmState` internally. This completes the decoupling.

---

### **Issue #3: Implement CALL, CALLCODE, DELEGATECALL, and STATICCALL**

*   **Title:** Implement `CALL`, `CALLCODE`, `DELEGATECALL`, and `STATICCALL` Opcodes
*   **Description:**
    The core inter-contract communication opcodes are currently stubbed out. Implementing them is critical for EVM feature-completeness. This will involve handling gas calculation, value transfer, context setup, and recursive calls into the VM interpreter. This work *must* be done after the Journaling (Issue #1) is complete.

*   **Tasks:**
    *   [ ] **`CALL (0xF1)` in `vm.zig`:**
        *   **Gas Calculation:** Implement the full gas calculation: `gas_cost = call_gas + value_transfer_gas + new_account_gas`.
            *   `call_gas`: Use `get_call_cost` to determine warm/cold access cost (100 or 2600).
            *   `value_transfer_gas`: Add 9000 gas if `value > 0`.
            *   `new_account_gas`: Add 25000 gas if `value > 0` and the target account does not exist.
        *   **Gas Forwarding:** Implement the "63/64 rule" from EIP-150. The gas forwarded to the child call is `gas_available = min(requested_gas, parent_gas_remaining - (parent_gas_remaining / 64))`.
        *   **Value Transfer:** If `value > 0`, check `host.get_balance(caller) >= value`. If so, use the host to debit the caller and credit the callee.
        *   **Recursive Call:** Create a new `Contract` instance for the callee and make a recursive call to `interpret_with_context`.
        *   **Result Handling:** Process the returned `RunResult`. If successful, copy the output to the parent's memory and the `return_data_buffer`. If reverted, do the same but propagate the revert. Update the parent's gas with the child's `gas_left`.

    *   [ ] **`STATICCALL (0xFA)`:**
        *   Implement almost identically to `CALL`.
        *   CRITICAL: Before making the recursive call, assert that `value` is zero. If not, this is an immediate `WriteProtection` error.
        *   Set the `is_static` flag to `true` for the recursive `interpret_with_context` call.

    *   [ ] **`DELEGATECALL (0xF4)`:**
        *   Gas calculation is similar to `CALL` but with no `value_transfer_gas` or `new_account_gas`.
        *   CRITICAL: When creating the new `Contract` frame for the recursive call, the context must be set up carefully:
            *   The `caller` for the new frame is the *parent's caller*.
            *   The `value` for the new frame is the *parent's value*.
            *   The `address` for the new frame is the *parent's address*.
            *   The `code` and `code_hash` are from the target `code_address`.
        *   This ensures the called code operates on the storage of the calling contract with the identity of the original caller.

    *   [ ] **`CALLCODE (0xF2)`:**
        *   Implement this deprecated but necessary opcode. It is very similar to `DELEGATECALL`.
        *   The key difference: `value` is the value passed in the `CALLCODE` instruction, but `caller` and `address` remain those of the parent frame. This is a subtle but important distinction.

---

### **Issue #4: Implement `SELFDESTRUCT` State Changes**

*   **Title:** Implement `SELFDESTRUCT` State Change Logic
*   **Description:**
    The `selfdestruct_protected` function and `op_selfdestruct` implementation currently only perform the static context check. The actual state modification logic is missing and must be recorded in the journal.

*   **Tasks:**
    *   [ ] **Balance Transfer:** In `op_selfdestruct`, get the full balance of the contract being destroyed (`frame.contract.address`). Add this balance to the beneficiary address. Both actions must be recorded as `JournalEntry.BalanceChange`.
    *   [ ] **Journaling:** Create a new `JournalEntry.AccountDestructed` and add it to the journal. This marks the account for deletion upon successful transaction completion.
    *   [ ] **Gas Refunds:**
        *   If `chain_rules.IsLondon` is `false`, and this is the first time this account is self-destructed in the transaction, call `frame.add_gas_refund(gas_constants.SelfdestructRefundGas)`.
        *   If `chain_rules.IsLondon` is `true`, refunds for `SELFDESTRUCT` are removed. No refund is granted.
    *   [ ] **Host Logic:** The `Host` or `EvmState` needs to know about destructed accounts. When a `JournalEntry.AccountDestructed` is committed, the account should be marked as destroyed. Subsequent calls to `get_balance`, `get_code`, etc., for this address should return zero/empty, as if the account never existed.

---

### **Issue #5: Implement Precompile Dispatcher**

*   **Title:** Implement Precompile Dispatcher
*   **Description:** This is an architectural prerequisite for implementing the precompiled contracts. Before implementing the logic for each precompile, the `CALL` family of opcodes must be ableto identify a call to a precompile address and route it to a native function handler instead of the EVM interpreter loop.
*   **Tasks:**
    *   [ ] In the `call_contract` function in `vm.zig`, add a check at the very beginning: `if (to.is_precompile())` where `is_precompile` checks if an address is in the range `0x01` to `0x09`.
    *   [ ] If it is a precompile address, call a new function `execute_precompile(to, input, gas_limit)` instead of continuing with the normal `interpret_with_context` logic.
    *   [ ] The `execute_precompile` function will act as a dispatcher. It should take the address, input data, and gas limit, and use a `switch` on the address to call the appropriate native handler.

        ```zig
        // in vm.zig
        fn execute_precompile(self: *Self, address: Address.Address, input: []const u8, gas_limit: u64) !CallResult {
            return switch (address.to_u256()) {
                0x01 => self.handle_ecrecover(input, gas_limit),
                0x02 => self.handle_sha256(input, gas_limit),
                // ... other precompiles
                else => unreachable, // Should be caught by is_precompile check
            };
        }
        ```

---

### **Issue #6: Implement All Precompiled Contracts**

*   **Title:** Implement All Precompiled Contracts
*   **Description:**
    With the dispatcher in place (Issue #5), implement the native logic for each precompiled contract. Each handler must perform its cryptographic operation, calculate and consume the correct gas, and return the output.

*   **Tasks:**
    *   [ ] **`0x01: ecrecover`:** Gas: 3000. Recovers an Ethereum address from a signature (`hash`, `v`, `r`, `s`). This is critical for signature verification.
    *   [ ] **`0x02: sha256`:** Gas: `60 + 12 * ceil(data_len / 32)`. Computes the SHA2-256 hash. Uses `std.crypto.hash.Sha256`.
    *   [ ] **`0x03: ripemd160`:** Gas: `600 + 120 * ceil(data_len / 32)`. Computes the RIPEMD-160 hash. Will require an external library or implementation.
    *   [ ] **`0x04: identity`:** Gas: `15 + 3 * ceil(data_len / 32)`. Simply returns its input data. Used for cheap data copying.
    *   [ ] **`0x05: modexp`:** Complex gas cost (see EIP-2565). Performs modular exponentiation. This is computationally expensive and requires a big integer library.
    *   [ ] **`0x06: ecAdd`:** (Byzantium) Gas: 150 (500 pre-Berlin). Elliptic curve point addition on `alt_bn128`.
    *   [ ] **`0x07: ecMul`:** (Byzantium) Gas: 6000 (40000 pre-Berlin). Elliptic curve point multiplication on `alt_bn128`.
    *   [ ] **`0x08: ecPairing`:** (Byzantium) Gas: `45000 * k + 34000`. Elliptic curve pairing check. The most complex precompile.
    *   [ ] **`0x09: blake2f`:** (Istanbul) Gas depends on the number of rounds. Blake2f compression function for Zcash compatibility.

---

### **Issue #7: Implement EIP-3541: Reject new contracts starting with 0xEF**

*   **Title:** Implement EIP-3541 Validation
*   **Description:**
    The London hardfork introduced a rule that new contracts cannot be deployed if their bytecode starts with the `0xEF` byte. This reserves the prefix for the future EVM Object Format (EOF).
*   **Location:** `src/evm/vm.zig`, inside `create_contract_internal`.
*   **Task:**
    *   [ ] After executing the init code and obtaining the `deployment_code`, add the following check:

        ```zig
        // in create_contract_internal, after getting deployment_code
        if (self.chain_rules.IsEIP3541 and deployment_code.len > 0 and deployment_code[0] == 0xEF) {
            return CreateResult.initFailure(0, ExecutionError.Error.InvalidCodeEntry); // Consume all gas
        }
        ```

---

### **Issue #8: Implement Gas Refunds for `SSTORE`**

*   **Title:** Implement `SSTORE` Gas Refund Logic
*   **Description:**
    The `Contract` struct has a `gas_refund` field, but the `SSTORE` opcode in `src/evm/opcodes/storage.zig` does not yet calculate or apply gas refunds according to the complex rules defined by EIP-2200 and later modified by EIP-3529.

*   **Location:** `src/evm/opcodes/storage.zig`, inside `op_sstore`.
*   **Tasks:**
    *   [ ] **Track Original Values:** Before calculating gas, ensure the *original* value of the storage slot (the value it had at the start of the transaction) is available. This may require enhancing the `Journal` or `Host` to track this.
    *   [ ] **Implement Refund Logic:** After setting the new value, add refund logic. The core refund amount is `gas_constants.SstoreRefundGas` (4800 post-London, 15000 pre-London).
        *   **Add Refund:** If `current_value != 0` and `new_value == 0`, call `frame.contract.add_gas_refund()`.
        *   **Subtract Refund:** If `current_value == 0` and `new_value != 0`, but `original_value != 0`, this negates a previous refund. Call `frame.contract.sub_gas_refund()`.
        *   **Subtract and Add:** If `current_value != 0`, `new_value != 0`, and `original_value == new_value`, this is a no-op that was previously a refund. Call `frame.contract.sub_gas_refund()`.
    *   [ ] **Clamp Refund:** The final refund applied at the end of the transaction cannot exceed `gas_used / 5` (post-London) or `gas_used / 2` (pre-London). This logic should be in the main transaction processing loop, not the opcode itself.

  </Issues>
<Context>
  To help you with this problem of implementing your issue we are providing reference code. Please use the reference code to help your pursuit
  <Tevm description="This is our implementation in zig. we will compare to evmone and revm too">
```zig [src/evm/evm_log.zig]
const Address = @import("Address");

/// EVM event log representation
/// 
/// This struct represents a log entry emitted by smart contracts using the LOG0-LOG4 opcodes.
/// Logs are a crucial part of the Ethereum event system, allowing contracts to emit indexed
/// data that can be efficiently queried by external applications.
/// 
/// ## Overview
/// 
/// Event logs serve multiple purposes in the EVM:
/// - **Event Notification**: Notify external applications about state changes
/// - **Cheaper Storage**: Store data in logs instead of contract storage (much cheaper gas cost)
/// - **Historical Queries**: Enable efficient querying of past events
/// - **Debugging**: Provide insight into contract execution
/// 
/// ## Log Structure
/// 
/// Each log entry contains:
/// - **Address**: The contract that emitted the log
/// - **Topics**: Up to 4 indexed 32-byte values for efficient filtering
/// - **Data**: Arbitrary length non-indexed data
/// 
/// ## Topics vs Data
/// 
/// The distinction between topics and data is important:
/// - **Topics**: Indexed for efficient filtering, limited to 4 entries of 32 bytes each
/// - **Data**: Not indexed, can be arbitrary length, cheaper to include
/// 
/// ## Gas Costs
/// 
/// - LOG0: 375 gas base + 8 gas per byte of data
/// - LOG1-LOG4: 375 gas base + 375 gas per topic + 8 gas per byte of data
/// 
/// ## Example Usage
/// 
/// In Solidity:
/// ```solidity
/// event Transfer(address indexed from, address indexed to, uint256 value);
/// emit Transfer(msg.sender, recipient, amount);
/// ```
/// 
/// This would create a log with:
/// - topics[0]: keccak256("Transfer(address,address,uint256)")
/// - topics[1]: from address (indexed)
/// - topics[2]: to address (indexed)
/// - data: encoded uint256 value
const Self = @This();

/// The address of the contract that emitted this log
address: Address.Address,

/// Indexed topics for efficient log filtering
/// 
/// - First topic (if any) is typically the event signature hash
/// - Subsequent topics are indexed event parameters
/// - Maximum of 4 topics per log (LOG0 has 0, LOG4 has 4)
topics: []const u256,

/// Non-indexed event data
/// 
/// Contains ABI-encoded event parameters that were not marked as indexed.
/// This data is not searchable but is cheaper to include than topics.
data: []const u8,
```
```zig [src/evm/run_result.zig]
const ExecutionError = @import("execution_error.zig");

/// Result of an EVM execution run.
///
/// RunResult encapsulates the outcome of executing EVM bytecode, including
/// success/failure status, gas consumption, and any output data. This is
/// the primary return type for VM execution functions.
///
/// ## Design Rationale
/// The result combines multiple pieces of information needed after execution:
/// - Status indicates how execution ended (success, revert, error)
/// - Gas tracking for accounting and refunds
/// - Output data for return values or revert messages
/// - Optional error details for debugging
///
/// ## Status Types
/// - Success: Execution completed normally
/// - Revert: Explicit revert (REVERT opcode or require failure)
/// - Invalid: Invalid operation (bad opcode, stack error, etc.)
/// - OutOfGas: Execution ran out of gas
///
/// ## Usage
/// ```zig
/// const result = vm.run(bytecode, gas_limit);
/// switch (result.status) {
///     .Success => {
///         // Process output data
///         const return_data = result.output orelse &[_]u8{};
///     },
///     .Revert => {
///         // Handle revert with reason
///         const revert_reason = result.output orelse &[_]u8{};
///     },
///     .Invalid => {
///         // Handle error
///         std.log.err("Execution failed: {?}", .{result.err});
///     },
///     .OutOfGas => {
///         // Handle out of gas
///     },
/// }
/// ```
const Self = @This();

/// Execution completion status.
///
/// Indicates how the execution ended. This maps to EVM execution outcomes:
/// - Success: Normal completion (STOP, RETURN, or end of code)
/// - Revert: Explicit revert (REVERT opcode)
/// - Invalid: Execution error (invalid opcode, stack error, etc.)
/// - OutOfGas: Gas exhausted during execution
pub const Status = enum {
    /// Execution completed successfully
    Success,
    /// Execution was explicitly reverted
    Revert,
    /// Execution failed due to invalid operation
    Invalid,
    /// Execution ran out of gas
    OutOfGas,
};
status: Status,

/// Optional execution error details.
///
/// Present when status is Invalid, providing specific error information
/// for debugging and error reporting.
err: ?ExecutionError.Error,

/// Remaining gas after execution.
///
/// For successful execution, this is refunded to the caller.
/// For failed execution, this may be zero or partially consumed.
gas_left: u64,

/// Total gas consumed during execution.
///
/// Calculated as: initial_gas - gas_left
/// Used for:
/// - Transaction receipts
/// - Gas accounting
/// - Performance monitoring
gas_used: u64,

/// Output data from execution.
///
/// Contents depend on execution status:
/// - Success: Return data from RETURN opcode
/// - Revert: Revert reason from REVERT opcode
/// - Invalid/OutOfGas: Usually null
///
/// Note: Empty output is different from null output.
/// Empty means explicit empty return, null means no return.
output: ?[]const u8,

pub fn init(
    initial_gas: u64,
    gas_left: u64,
    status: Status,
    err: ?ExecutionError.Error,
    output: ?[]const u8,
) Self {
    return Self{
        .status = status,
        .err = err,
        .gas_left = gas_left,
        .gas_used = initial_gas - gas_left,
        .output = output,
    };
}
```
```zig [src/evm/opcode.zig]
/// EVM opcode definitions and utilities.
///
/// This module defines all EVM opcodes as specified in the Ethereum Yellow Paper
/// and various EIPs. Each opcode is a single byte instruction that the EVM
/// interpreter executes.
///
/// ## Opcode Categories
/// - Arithmetic: ADD, MUL, SUB, DIV, MOD, EXP, etc.
/// - Comparison: LT, GT, EQ, ISZERO
/// - Bitwise: AND, OR, XOR, NOT, SHL, SHR, SAR
/// - Environmental: ADDRESS, BALANCE, CALLER, CALLVALUE
/// - Block Information: BLOCKHASH, COINBASE, TIMESTAMP, NUMBER
/// - Stack Operations: POP, PUSH1-PUSH32, DUP1-DUP16, SWAP1-SWAP16
/// - Memory Operations: MLOAD, MSTORE, MSTORE8, MSIZE
/// - Storage Operations: SLOAD, SSTORE, TLOAD, TSTORE
/// - Flow Control: JUMP, JUMPI, PC, JUMPDEST
/// - System Operations: CREATE, CALL, RETURN, REVERT, SELFDESTRUCT
/// - Logging: LOG0-LOG4
///
/// ## Opcode Encoding
/// Opcodes are encoded as single bytes (0x00-0xFF). Not all byte values
/// are assigned; unassigned values are treated as INVALID operations.
///
/// ## Hardfork Evolution
/// New opcodes are introduced through EIPs and activated at specific
/// hardforks. Examples:
/// - PUSH0 (EIP-3855): Shanghai hardfork
/// - TLOAD/TSTORE (EIP-1153): Cancun hardfork
/// - MCOPY (EIP-5656): Cancun hardfork
///
/// Example:
/// ```zig
/// const opcode = Opcode.Enum.ADD;
/// const byte_value = opcode.to_u8(); // 0x01
/// const name = opcode.get_name(); // "ADD"
/// ```
pub const MemorySize = @import("memory_size.zig");

/// Opcode module providing EVM instruction definitions.
const Self = @This();

/// Enumeration of all EVM opcodes with their byte values.
///
/// Each opcode is assigned a specific byte value that remains
/// constant across all EVM implementations. The enum ensures
/// type safety when working with opcodes.
pub const Enum = enum(u8) {
    /// Halts execution (0x00)
    STOP = 0x00,
    /// Addition operation: a + b (0x01)
    ADD = 0x01,
    /// Multiplication operation: a * b (0x02)
    MUL = 0x02,
    /// Subtraction operation: a - b (0x03)
    SUB = 0x03,
    /// Integer division operation: a / b (0x04)
    DIV = 0x04,
    /// Signed integer division operation (0x05)
    SDIV = 0x05,
    /// Modulo operation: a % b (0x06)
    MOD = 0x06,
    /// Signed modulo operation (0x07)
    SMOD = 0x07,
    /// Addition modulo: (a + b) % N (0x08)
    ADDMOD = 0x08,
    /// Multiplication modulo: (a * b) % N (0x09)
    MULMOD = 0x09,
    /// Exponential operation: a ** b (0x0A)
    EXP = 0x0A,
    /// Sign extend operation (0x0B)
    SIGNEXTEND = 0x0B,
    /// Less-than comparison: a < b (0x10)
    LT = 0x10,
    /// Greater-than comparison: a > b (0x11)
    GT = 0x11,
    /// Signed less-than comparison (0x12)
    SLT = 0x12,
    /// Signed greater-than comparison (0x13)
    SGT = 0x13,
    /// Equality comparison: a == b (0x14)
    EQ = 0x14,
    /// Check if value is zero (0x15)
    ISZERO = 0x15,
    /// Bitwise AND operation (0x16)
    AND = 0x16,
    /// Bitwise OR operation (0x17)
    OR = 0x17,
    /// Bitwise XOR operation (0x18)
    XOR = 0x18,
    /// Bitwise NOT operation (0x19)
    NOT = 0x19,
    /// Retrieve single byte from word (0x1A)
    BYTE = 0x1A,
    /// Logical shift left (0x1B)
    SHL = 0x1B,
    /// Logical shift right (0x1C)
    SHR = 0x1C,
    /// Arithmetic shift right (0x1D)
    SAR = 0x1D,
    /// Compute Keccak-256 hash (0x20)
    KECCAK256 = 0x20,
    /// Get address of currently executing account (0x30)
    ADDRESS = 0x30,
    /// Get balance of the given account (0x31)
    BALANCE = 0x31,
    /// Get execution origination address (0x32)
    ORIGIN = 0x32,
    /// Get caller address (0x33)
    CALLER = 0x33,
    /// Get deposited value by the caller (0x34)
    CALLVALUE = 0x34,
    /// Load input data of current call (0x35)
    CALLDATALOAD = 0x35,
    /// Get size of input data in current call (0x36)
    CALLDATASIZE = 0x36,
    /// Copy input data to memory (0x37)
    CALLDATACOPY = 0x37,
    /// Get size of code running in current environment (0x38)
    CODESIZE = 0x38,
    /// Copy code to memory (0x39)
    CODECOPY = 0x39,
    /// Get price of gas in current environment (0x3A)
    GASPRICE = 0x3A,
    EXTCODESIZE = 0x3B,
    EXTCODECOPY = 0x3C,
    RETURNDATASIZE = 0x3D,
    RETURNDATACOPY = 0x3E,
    EXTCODEHASH = 0x3F,
    BLOCKHASH = 0x40,
    COINBASE = 0x41,
    TIMESTAMP = 0x42,
    NUMBER = 0x43,
    PREVRANDAO = 0x44,
    GASLIMIT = 0x45,
    CHAINID = 0x46,
    SELFBALANCE = 0x47,
    BASEFEE = 0x48,
    BLOBHASH = 0x49,
    BLOBBASEFEE = 0x4A,
    POP = 0x50,
    MLOAD = 0x51,
    MSTORE = 0x52,
    MSTORE8 = 0x53,
    /// Load word from storage (0x54)
    SLOAD = 0x54,
    /// Store word to storage (0x55)
    SSTORE = 0x55,
    /// Unconditional jump (0x56)
    JUMP = 0x56,
    /// Conditional jump (0x57)
    JUMPI = 0x57,
    /// Get current program counter (0x58)
    PC = 0x58,
    /// Get size of active memory in bytes (0x59)
    MSIZE = 0x59,
    /// Get amount of available gas (0x5A)
    GAS = 0x5A,
    /// Mark valid jump destination (0x5B)
    JUMPDEST = 0x5B,
    /// Load word from transient storage (0x5C)
    TLOAD = 0x5C,
    /// Store word to transient storage (0x5D)
    TSTORE = 0x5D,
    /// Copy memory areas (0x5E)
    MCOPY = 0x5E,
    /// Push zero onto stack (0x5F)
    PUSH0 = 0x5F,
    PUSH1 = 0x60,
    PUSH2 = 0x61,
    PUSH3 = 0x62,
    PUSH4 = 0x63,
    PUSH5 = 0x64,
    PUSH6 = 0x65,
    PUSH7 = 0x66,
    PUSH8 = 0x67,
    PUSH9 = 0x68,
    PUSH10 = 0x69,
    PUSH11 = 0x6A,
    PUSH12 = 0x6B,
    PUSH13 = 0x6C,
    PUSH14 = 0x6D,
    PUSH15 = 0x6E,
    PUSH16 = 0x6F,
    PUSH17 = 0x70,
    PUSH18 = 0x71,
    PUSH19 = 0x72,
    PUSH20 = 0x73,
    PUSH21 = 0x74,
    PUSH22 = 0x75,
    PUSH23 = 0x76,
    PUSH24 = 0x77,
    PUSH25 = 0x78,
    PUSH26 = 0x79,
    PUSH27 = 0x7A,
    PUSH28 = 0x7B,
    PUSH29 = 0x7C,
    PUSH30 = 0x7D,
    PUSH31 = 0x7E,
    PUSH32 = 0x7F,
    DUP1 = 0x80,
    DUP2 = 0x81,
    DUP3 = 0x82,
    DUP4 = 0x83,
    DUP5 = 0x84,
    DUP6 = 0x85,
    DUP7 = 0x86,
    DUP8 = 0x87,
    DUP9 = 0x88,
    DUP10 = 0x89,
    DUP11 = 0x8A,
    DUP12 = 0x8B,
    DUP13 = 0x8C,
    DUP14 = 0x8D,
    DUP15 = 0x8E,
    DUP16 = 0x8F,
    SWAP1 = 0x90,
    SWAP2 = 0x91,
    SWAP3 = 0x92,
    SWAP4 = 0x93,
    SWAP5 = 0x94,
    SWAP6 = 0x95,
    SWAP7 = 0x96,
    SWAP8 = 0x97,
    SWAP9 = 0x98,
    SWAP10 = 0x99,
    SWAP11 = 0x9A,
    SWAP12 = 0x9B,
    SWAP13 = 0x9C,
    SWAP14 = 0x9D,
    SWAP15 = 0x9E,
    SWAP16 = 0x9F,
    LOG0 = 0xA0,
    LOG1 = 0xA1,
    LOG2 = 0xA2,
    LOG3 = 0xA3,
    LOG4 = 0xA4,
    /// Create new contract (0xF0)
    CREATE = 0xF0,
    /// Message-call into account (0xF1)
    CALL = 0xF1,
    /// Message-call with current code (0xF2)
    CALLCODE = 0xF2,
    /// Halt execution returning output data (0xF3)
    RETURN = 0xF3,
    /// Call with current sender and value (0xF4)
    DELEGATECALL = 0xF4,
    /// Create with deterministic address (0xF5)
    CREATE2 = 0xF5,
    /// Load return data (0xF7)
    RETURNDATALOAD = 0xF7,
    /// Extended call (EOF) (0xF8)
    EXTCALL = 0xF8,
    /// Extended delegate call (EOF) (0xF9)
    EXTDELEGATECALL = 0xF9,
    /// Static message-call (0xFA)
    STATICCALL = 0xFA,
    /// Extended static call (EOF) (0xFB)
    EXTSTATICCALL = 0xFB,
    /// Halt execution reverting state changes (0xFD)
    REVERT = 0xFD,
    /// Invalid instruction (0xFE)
    INVALID = 0xFE,
    /// Destroy current contract (0xFF)
    SELFDESTRUCT = 0xFF,

};

/// Convert an opcode to its byte representation.
///
/// Returns the underlying byte value of the opcode for use in
/// bytecode encoding/decoding and jump table lookups.
///
/// @param self The opcode to convert
/// @return The byte value (0x00-0xFF)
///
/// Example:
/// ```zig
/// const add_byte = Opcode.Enum.ADD.to_u8(); // Returns 0x01
/// const push1_byte = Opcode.Enum.PUSH1.to_u8(); // Returns 0x60
/// ```
pub fn to_u8(self: Enum) u8 {
        return @intFromEnum(self);
    }

/// Get the human-readable name of an opcode.
///
/// Returns the mnemonic string representation of the opcode
/// as used in assembly code and debugging output.
///
/// @param self The opcode to get the name of
/// @return Static string containing the opcode mnemonic
///
/// Example:
/// ```zig
/// const name = Opcode.Enum.ADD.get_name(); // Returns "ADD"
/// std.debug.print("Executing opcode: {s}\n", .{name});
/// ```
pub fn get_name(self: Enum) []const u8 {
    const names = comptime blk: {
        var result: [256][]const u8 = undefined;
        
        // Initialize all to "UNDEFINED"
        for (&result) |*name| {
            name.* = "UNDEFINED";
        }
        
        // Map enum values to their names using reflection
        const enum_info = @typeInfo(Enum);
        switch (enum_info) {
            .@"enum" => |e| {
                for (e.fields) |field| {
                    const value = @field(Enum, field.name);
                    result[@intFromEnum(value)] = field.name;
                }
            },
            else => @compileError("get_name requires an enum type"),
        }
        
        break :blk result;
    };
    
    return names[@intFromEnum(self)];
}


/// Common opcodes re-exported as module-level constants.
///
/// These provide convenient access to frequently used opcodes
/// without needing to reference the Enum type. Useful for:
/// - Bytecode analysis
/// - Opcode matching in interpreters
/// - Test assertions
///
/// Example:
/// ```zig
/// if (bytecode[pc] == Opcode.JUMPDEST) {
///     // Mark as valid jump destination
/// }
/// ```
pub const STOP = Enum.STOP;
pub const ADD = Enum.ADD;
pub const MUL = Enum.MUL;
pub const SUB = Enum.SUB;
pub const DIV = Enum.DIV;
pub const JUMP = Enum.JUMP;
pub const JUMPI = Enum.JUMPI;
pub const JUMPDEST = Enum.JUMPDEST;
pub const CREATE = Enum.CREATE;
pub const CREATE2 = Enum.CREATE2;
pub const SELFDESTRUCT = Enum.SELFDESTRUCT;
pub const INVALID = Enum.INVALID;
```
```zig [src/evm/create_result.zig]
const Address = @import("Address");

/// Result structure for contract creation operations in the EVM.
///
/// This structure encapsulates the outcome of deploying a new smart contract
/// through CREATE or CREATE2 opcodes. It provides all necessary information
/// about the deployment result, including the new contract's address and any
/// revert data if the deployment failed.
///
/// ## Contract Creation Flow
/// 1. Execute initcode (constructor bytecode)
/// 2. Initcode returns runtime bytecode
/// 3. Runtime bytecode is stored at computed address
/// 4. This result structure is returned
///
/// ## Address Computation
/// - **CREATE**: address = keccak256(rlp([sender, nonce]))[12:]
/// - **CREATE2**: address = keccak256(0xff ++ sender ++ salt ++ keccak256(initcode))[12:]
///
/// ## Success Conditions
/// A creation succeeds when:
/// - Initcode executes without reverting
/// - Sufficient gas remains for code storage
/// - Returned bytecode size ≤ 24,576 bytes (EIP-170)
/// - No address collision occurs
///
/// ## Failure Modes
/// - Initcode reverts (REVERT opcode or error)
/// - Out of gas during execution
/// - Returned bytecode exceeds size limit
/// - Address collision (extremely rare)
/// - Stack depth exceeded
///
/// ## Example Usage
/// ```zig
/// const result = try vm.create_contract(value, initcode, gas, salt);
/// if (result.success) {
///     // Contract deployed at result.address
///     log.info("Deployed to: {}", .{result.address});
/// } else {
///     // Deployment failed, check output for revert reason
///     if (result.output) |revert_data| {
///         log.err("Deployment failed: {}", .{revert_data});
///     }
/// }
/// defer if (result.output) |output| allocator.free(output);
/// ```
const Self = @This();

/// Indicates whether the contract creation succeeded.
///
/// - `true`: Contract successfully deployed and code stored on-chain
/// - `false`: Creation failed due to revert, gas, or other errors
///
/// ## State Changes
/// - Success: All state changes are committed, contract exists at address
/// - Failure: All state changes are reverted, no contract is deployed
success: bool,

/// The address where the contract was (or would have been) deployed.
///
/// This address is computed deterministically before execution begins:
/// - For CREATE: Based on sender address and nonce
/// - For CREATE2: Based on sender, salt, and initcode hash
///
/// ## Important Notes
/// - Address is computed even if creation fails
/// - Can be used to predict addresses before deployment
/// - Useful for counterfactual instantiation patterns
///
/// ## Address Collision
/// If this address already contains a contract, creation fails.
/// The probability of collision is negligible (2^-160).
address: Address.Address,

/// Amount of gas remaining after the creation attempt.
///
/// ## Gas Accounting
/// - Deducted: Initcode execution + code storage (200 per byte)
/// - Refunded: Unused gas returns to caller
/// - Minimum: 32,000 gas for CREATE/CREATE2 base cost
///
/// ## Usage Patterns
/// - Success: Add back to calling context's available gas
/// - Failure with revert: Some gas may remain (unlike out-of-gas)
/// - Failure out-of-gas: Will be 0 or very low
gas_left: u64,

/// Optional data returned by the contract creation.
///
/// ## Success Case
/// - Contains the runtime bytecode to be stored on-chain
/// - Size must be ≤ 24,576 bytes (MAX_CODE_SIZE)
/// - Empty output creates a contract with no code
///
/// ## Failure Case
/// - Contains revert reason if REVERT was used
/// - `null` for out-of-gas or invalid operations
/// - Useful for debugging deployment failures
///
/// ## Memory Management
/// The output buffer is allocated by the VM and ownership transfers
/// to the caller, who must free it when no longer needed.
///
/// ## Examples
/// ```zig
/// // Success: output contains runtime bytecode
/// if (result.success and result.output) |bytecode| {
///     assert(bytecode.len <= MAX_CODE_SIZE);
/// }
///
/// // Failure: output may contain revert message
/// if (!result.success and result.output) |reason| {
///     // Decode revert reason (often ABI-encoded string)
/// }
/// ```
output: ?[]const u8,

pub fn initFailure(gas_left: u64, output: ?[]const u8) Self {
    return Self{
        .success = false,
        .address = Address.zero(),
        .gas_left = gas_left,
        .output = output,
    };
}
```
```zig [src/evm/chain_rules.zig]
const std = @import("std");
const Hardfork = @import("hardfork.zig").Hardfork;
const Log = @import("log.zig");

/// Configuration for Ethereum protocol rules and EIP activations across hardforks.
///
/// This structure defines which Ethereum Improvement Proposals (EIPs) and protocol
/// rules are active during EVM execution. It serves as the central configuration
/// point for hardfork-specific behavior, enabling the EVM to correctly execute
/// transactions according to the rules of any supported Ethereum hardfork.
///
/// ## Purpose
/// The Ethereum protocol evolves through hardforks that introduce new features,
/// change gas costs, add opcodes, or modify execution semantics. This structure
/// encapsulates all these changes, allowing the EVM to maintain compatibility
/// with any point in Ethereum's history.
///
/// ## Default Configuration
/// By default, all fields are set to support the latest stable hardfork (Cancun),
/// ensuring new deployments get the most recent protocol features. Use the
/// `for_hardfork()` method to configure for specific historical hardforks.
///
/// ## Usage Pattern
/// ```zig
/// // Create rules for a specific hardfork
/// const rules = ChainRules.for_hardfork(.LONDON);
/// 
/// // Check if specific features are enabled
/// if (rules.IsEIP1559) {
///     // Use EIP-1559 fee market logic
/// }
/// ```
///
/// ## Hardfork Progression
/// The Ethereum mainnet hardfork progression:
/// 1. Frontier (July 2015) - Initial release
/// 2. Homestead (March 2016) - First major improvements
/// 3. DAO Fork (July 2016) - Emergency fork after DAO hack
/// 4. Tangerine Whistle (October 2016) - Gas repricing (EIP-150)
/// 5. Spurious Dragon (November 2016) - State cleaning (EIP-158)
/// 6. Byzantium (October 2017) - Major protocol upgrade
/// 7. Constantinople (February 2019) - Efficiency improvements
/// 8. Petersburg (February 2019) - Constantinople fix
/// 9. Istanbul (December 2019) - Gas cost adjustments
/// 10. Muir Glacier (January 2020) - Difficulty bomb delay
/// 11. Berlin (April 2021) - Gas improvements (EIP-2929)
/// 12. London (August 2021) - EIP-1559 fee market
/// 13. Arrow Glacier (December 2021) - Difficulty bomb delay
/// 14. Gray Glacier (June 2022) - Difficulty bomb delay
/// 15. The Merge (September 2022) - Proof of Stake transition
/// 16. Shanghai (April 2023) - Withdrawals enabled
/// 17. Cancun (March 2024) - Proto-danksharding
///
/// ## Memory Layout
/// This structure uses bool fields for efficient memory usage and fast access.
/// The compiler typically packs multiple bools together for cache efficiency.
const Self = @This();

/// Homestead hardfork activation flag (March 2016).
///
/// ## Key Changes
/// - Fixed critical issues from Frontier release
/// - Introduced DELEGATECALL opcode (0xF4) for library pattern
/// - Changed difficulty adjustment algorithm
/// - Removed canary contracts
/// - Fixed gas cost inconsistencies
///
/// ## EVM Impact
/// - New opcode: DELEGATECALL for code reuse with caller's context
/// - Modified CREATE behavior for out-of-gas scenarios
/// - Changed gas costs for CALL operations
IsHomestead: bool = true,

/// EIP-150 "Tangerine Whistle" hardfork activation (October 2016).
///
/// ## Purpose
/// Addressed denial-of-service attack vectors by repricing operations
/// that were underpriced relative to their computational complexity.
///
/// ## Key Changes
/// - Increased gas costs for EXTCODESIZE, EXTCODECOPY, BALANCE, CALL, CALLCODE, DELEGATECALL
/// - Increased gas costs for SLOAD from 50 to 200
/// - 63/64 rule for CALL operations gas forwarding
/// - Max call depth reduced from 1024 to 1024 (stack-based)
///
/// ## Security Impact
/// Mitigated "Shanghai attacks" that exploited underpriced opcodes
/// to create transactions consuming excessive resources.
IsEIP150: bool = true,

/// EIP-158 "Spurious Dragon" hardfork activation (November 2016).
///
/// ## Purpose
/// State size reduction through removal of empty accounts,
/// complementing EIP-150's gas repricing.
///
/// ## Key Changes  
/// - Empty account deletion (nonce=0, balance=0, code empty)
/// - Changed SELFDESTRUCT refund behavior
/// - Introduced EXP cost increase for large exponents
/// - Replay attack protection via chain ID
///
/// ## State Impact
/// Significantly reduced state size by removing ~20 million empty
/// accounts created by previous attacks.
IsEIP158: bool = true,

/// EIP-1559 fee market mechanism activation (London hardfork).
///
/// ## Purpose
/// Revolutionary change to Ethereum's fee mechanism introducing
/// base fee burning and priority fees (tips).
///
/// ## Key Changes
/// - Dynamic base fee adjusted per block based on utilization
/// - Base fee burned, reducing ETH supply
/// - Priority fee (tip) goes to miners/validators
/// - New transaction type (Type 2) with maxFeePerGas and maxPriorityFeePerGas
/// - BASEFEE opcode (0x48) to access current base fee
///
/// ## Economic Impact
/// - More predictable gas prices
/// - ETH becomes deflationary under high usage
/// - Better UX with fee estimation
IsEIP1559: bool = true,

/// Constantinople hardfork activation (February 2019).
///
/// ## Purpose
/// Optimization-focused upgrade adding cheaper operations and
/// preparing for future scaling solutions.
///
/// ## Key Changes
/// - New opcodes: SHL (0x1B), SHR (0x1C), SAR (0x1D) for bitwise shifting
/// - New opcode: EXTCODEHASH (0x3F) for cheaper code hash access
/// - CREATE2 (0xF5) for deterministic contract addresses
/// - Reduced gas costs for SSTORE operations (EIP-1283)
/// - Delayed difficulty bomb by 12 months
///
/// ## Developer Impact
/// - Bitwise operations enable more efficient algorithms
/// - CREATE2 enables counterfactual instantiation patterns
/// - Cheaper storage operations for certain patterns
IsConstantinople: bool = true,

/// Petersburg hardfork activation (February 2019).
///
/// ## Purpose
/// Emergency fix to Constantinople, disabling EIP-1283 due to
/// reentrancy concerns discovered before mainnet deployment.
///
/// ## Key Changes
/// - Removed EIP-1283 (SSTORE gas metering) from Constantinople
/// - Kept all other Constantinople features
/// - Essentially Constantinople minus problematic EIP
///
/// ## Historical Note
/// Constantinople was deployed on testnet but postponed on mainnet
/// when security researchers found the reentrancy issue. Petersburg
/// represents the actually deployed version.
IsPetersburg: bool = true,

/// Istanbul hardfork activation (December 2019).
///
/// ## Purpose
/// Gas cost adjustments based on real-world usage data and addition
/// of new opcodes for layer 2 support.
///
/// ## Key Changes
/// - EIP-152: Blake2b precompile for interoperability
/// - EIP-1108: Reduced alt_bn128 precompile gas costs
/// - EIP-1344: CHAINID opcode (0x46) for replay protection  
/// - EIP-1884: Repricing for trie-size dependent opcodes
/// - EIP-2028: Reduced calldata gas cost (16 gas per non-zero byte)
/// - EIP-2200: Rebalanced SSTORE gas cost with stipend
///
/// ## Opcodes Added
/// - CHAINID (0x46): Returns the current chain ID
/// - SELFBALANCE (0x47): Get balance without expensive BALANCE call
///
/// ## Performance Impact
/// Significant reduction in costs for L2 solutions using calldata.
IsIstanbul: bool = true,

/// Berlin hardfork activation (April 2021).
///
/// ## Purpose
/// Major gas model reform introducing access lists and fixing
/// long-standing issues with state access pricing.
///
/// ## Key Changes
/// - EIP-2565: Reduced ModExp precompile gas cost
/// - EIP-2718: Typed transaction envelope framework
/// - EIP-2929: Gas cost increase for state access opcodes
/// - EIP-2930: Optional access lists (Type 1 transactions)
///
/// ## Access List Impact
/// - First-time SLOAD: 2100 gas (cold) vs 100 gas (warm)
/// - First-time account access: 2600 gas (cold) vs 100 gas (warm)
/// - Transactions can pre-declare accessed state for gas savings
///
/// ## Developer Considerations
/// Access lists allow contracts to optimize gas usage by pre-warming
/// storage slots and addresses they'll interact with.
IsBerlin: bool = true,

/// London hardfork activation (August 2021).
///
/// ## Purpose  
/// Most significant economic change to Ethereum, introducing base fee
/// burning and dramatically improving fee predictability.
///
/// ## Key Changes
/// - EIP-1559: Fee market reform with base fee burning
/// - EIP-3198: BASEFEE opcode (0x48) to read current base fee
/// - EIP-3529: Reduction in refunds (SELFDESTRUCT, SSTORE)
/// - EIP-3541: Reject contracts starting with 0xEF byte
/// - EIP-3554: Difficulty bomb delay
///
/// ## EIP-3541 Impact
/// Reserves 0xEF prefix for future EVM Object Format (EOF),
/// preventing deployment of contracts with this prefix.
///
/// ## Economic Changes
/// - Base fee burned makes ETH potentially deflationary
/// - Gas price volatility significantly reduced
/// - Better fee estimation and user experience
IsLondon: bool = true,

/// The Merge activation (September 2022).
///
/// ## Purpose
/// Historic transition from Proof of Work to Proof of Stake,
/// reducing energy consumption by ~99.95%.
///
/// ## Key Changes
/// - EIP-3675: Consensus layer transition
/// - EIP-4399: DIFFICULTY (0x44) renamed to PREVRANDAO
/// - Removed block mining rewards
/// - Block time fixed at ~12 seconds
///
/// ## PREVRANDAO Usage
/// The DIFFICULTY opcode now returns the previous block's RANDAO
/// value, providing a source of randomness from the beacon chain.
/// Not suitable for high-security randomness needs.
///
/// ## Network Impact
/// - No more uncle blocks
/// - Predictable block times
/// - Validators replace miners
IsMerge: bool = true,

/// Shanghai hardfork activation (April 2023).
///
/// ## Purpose
/// First major upgrade post-Merge, enabling validator withdrawals
/// and introducing efficiency improvements.
///
/// ## Key Changes
/// - EIP-3651: Warm COINBASE address (reduced gas for MEV)
/// - EIP-3855: PUSH0 opcode (0x5F) for gas efficiency
/// - EIP-3860: Limit and meter initcode size
/// - EIP-4895: Beacon chain withdrawals
///
/// ## PUSH0 Impact
/// New opcode that pushes zero onto stack for 2 gas,
/// replacing common pattern of `PUSH1 0` (3 gas).
///
/// ## Withdrawal Mechanism
/// Validators can finally withdraw staked ETH, completing
/// the Proof of Stake transition.
IsShanghai: bool = true,

/// Cancun hardfork activation (March 2024).
///
/// ## Purpose
/// Major scalability upgrade introducing blob transactions for L2s
/// and transient storage for advanced contract patterns.
///
/// ## Key Changes
/// - EIP-1153: Transient storage opcodes (TLOAD 0x5C, TSTORE 0x5D)
/// - EIP-4844: Proto-danksharding with blob transactions
/// - EIP-4788: Beacon block root in EVM
/// - EIP-5656: MCOPY opcode (0x5E) for memory copying
/// - EIP-6780: SELFDESTRUCT only in same transaction
/// - EIP-7516: BLOBBASEFEE opcode (0x4A)
///
/// ## Blob Transactions
/// New transaction type carrying data blobs (4096 field elements)
/// for L2 data availability at ~10x lower cost.
///
/// ## Transient Storage
/// Storage that persists only within a transaction, enabling
/// reentrancy locks and other patterns without permanent storage.
IsCancun: bool = true,

/// Prague hardfork activation flag (future upgrade).
///
/// ## Status
/// Not yet scheduled or fully specified. Expected to include:
/// - EOF (EVM Object Format) implementation
/// - Account abstraction improvements
/// - Further gas optimizations
///
/// ## Note
/// This flag is reserved for future use and should remain
/// false until Prague specifications are finalized.
IsPrague: bool = false,

/// Verkle trees activation flag (future upgrade).
///
/// ## Purpose
/// Fundamental change to Ethereum's state storage using Verkle trees
/// instead of Merkle Patricia tries for massive witness size reduction.
///
/// ## Expected Benefits
/// - Witness sizes reduced from ~10MB to ~200KB
/// - Enables stateless clients
/// - Improved sync times and network efficiency
///
/// ## Status
/// Under active research and development. Will require extensive
/// testing before mainnet deployment.
IsVerkle: bool = false,

/// Byzantium hardfork activation (October 2017).
///
/// ## Purpose
/// Major protocol upgrade adding privacy features and improving
/// smart contract capabilities.
///
/// ## Key Changes
/// - New opcodes: REVERT (0xFD), RETURNDATASIZE (0x3D), RETURNDATACOPY (0x3E)
/// - New opcode: STATICCALL (0xFA) for read-only calls
/// - Added precompiles for zkSNARK verification (alt_bn128)
/// - Difficulty bomb delay by 18 months
/// - Block reward reduced from 5 to 3 ETH
///
/// ## REVERT Impact
/// Allows contracts to revert with data, enabling better error
/// messages while still refunding remaining gas.
///
/// ## Privacy Features
/// zkSNARK precompiles enable privacy-preserving applications
/// like private transactions and scalability solutions.
IsByzantium: bool = true,

/// EIP-2930 optional access lists activation (Berlin hardfork).
///
/// ## Purpose
/// Introduces Type 1 transactions with optional access lists,
/// allowing senders to pre-declare state they'll access.
///
/// ## Benefits
/// - Mitigates breaking changes from EIP-2929 gas increases
/// - Allows gas savings by pre-warming storage slots
/// - Provides predictable gas costs for complex interactions
///
/// ## Transaction Format
/// Type 1 transactions include an access list of:
/// - Addresses to be accessed
/// - Storage keys per address to be accessed
///
/// ## Gas Savings
/// Pre-declaring access saves ~2000 gas per address and
/// ~2000 gas per storage slot on first access.
IsEIP2930: bool = true,

/// EIP-3198 BASEFEE opcode activation (London hardfork).
///
/// ## Purpose
/// Provides smart contracts access to the current block's base fee,
/// enabling on-chain fee market awareness.
///
/// ## Opcode Details
/// - BASEFEE (0x48): Pushes current block's base fee onto stack
/// - Gas cost: 2 (same as other block context opcodes)
///
/// ## Use Cases
/// - Fee estimation within contracts
/// - Conditional execution based on network congestion
/// - MEV-aware contract patterns
/// - Gas price oracles
///
/// ## Complementary to EIP-1559
/// Essential for contracts to interact properly with the
/// new fee market mechanism.
IsEIP3198: bool = true,

/// EIP-3651 warm COINBASE activation (Shanghai hardfork).
///
/// ## Purpose
/// Pre-warms the COINBASE address (block producer) to reduce gas costs
/// for common patterns, especially in MEV transactions.
///
/// ## Gas Impact
/// - Before: First COINBASE access costs 2600 gas (cold)
/// - After: COINBASE always costs 100 gas (warm)
///
/// ## MEV Considerations
/// Critical for MEV searchers and builders who frequently
/// interact with the block producer address for payments.
///
/// ## Implementation
/// The COINBASE address is added to the warm address set
/// at the beginning of transaction execution.
IsEIP3651: bool = true,

/// EIP-3855 PUSH0 instruction activation (Shanghai hardfork).
///
/// ## Purpose
/// Introduces dedicated opcode for pushing zero onto the stack,
/// optimizing a very common pattern in smart contracts.
///
/// ## Opcode Details
/// - PUSH0 (0x5F): Pushes 0 onto the stack
/// - Gas cost: 2 (base opcode cost)
/// - Replaces: PUSH1 0x00 (costs 3 gas)
///
/// ## Benefits
/// - 33% gas reduction for pushing zero
/// - Smaller bytecode (1 byte vs 2 bytes)
/// - Cleaner assembly code
///
/// ## Usage Statistics
/// Analysis showed ~11% of all PUSH operations push zero,
/// making this a significant optimization.
IsEIP3855: bool = true,

/// EIP-3860 initcode size limit activation (Shanghai hardfork).
///
/// ## Purpose
/// Introduces explicit limits and gas metering for contract creation
/// code to prevent DoS vectors and ensure predictable costs.
///
/// ## Key Limits
/// - Maximum initcode size: 49152 bytes (2x max contract size)
/// - Gas cost: 2 gas per 32-byte word of initcode
///
/// ## Affected Operations
/// - CREATE: Limited initcode size
/// - CREATE2: Limited initcode size
/// - Contract creation transactions
///
/// ## Security Rationale
/// Previously unlimited initcode could cause nodes to consume
/// excessive resources during contract deployment verification.
IsEIP3860: bool = true,

/// EIP-4895 beacon chain withdrawals activation (Shanghai hardfork).
///
/// ## Purpose
/// Enables validators to withdraw staked ETH from the beacon chain
/// to the execution layer, completing the PoS transition.
///
/// ## Mechanism
/// - Withdrawals are processed as system-level operations
/// - Not regular transactions - no gas cost or signature
/// - Automatically credited to withdrawal addresses
/// - Up to 16 withdrawals per block
///
/// ## Validator Operations
/// - Partial withdrawals: Excess balance above 32 ETH
/// - Full withdrawals: Complete exit from validation
///
/// ## Network Impact
/// Completes the Ethereum staking lifecycle, allowing validators
/// to access their staked funds and rewards.
IsEIP4895: bool = true,

/// EIP-4844 proto-danksharding activation (Cancun hardfork).
///
/// ## Purpose
/// Introduces blob-carrying transactions for scalable data availability,
/// reducing L2 costs by ~10-100x through temporary data storage.
///
/// ## Blob Details
/// - Size: 4096 field elements (~125 KB)
/// - Max per block: 6 blobs (~750 KB)
/// - Retention: ~18 days (4096 epochs)
/// - Separate fee market with blob base fee
///
/// ## New Components
/// - Type 3 transactions with blob commitments
/// - KZG commitments for data availability proofs
/// - Blob fee market independent of execution gas
/// - BLOBHASH opcode (0x49) to access blob commitments
///
/// ## L2 Impact
/// Dramatically reduces costs for rollups by providing
/// dedicated data availability layer.
IsEIP4844: bool = true,

/// EIP-1153 transient storage activation (Cancun hardfork).
///
/// ## Purpose
/// Introduces transaction-scoped storage that automatically clears
/// after execution, enabling efficient temporary data patterns.
///
/// ## New Opcodes
/// - TLOAD (0x5C): Load from transient storage
/// - TSTORE (0x5D): Store to transient storage
/// - Gas costs: 100 for TLOAD, 100 for TSTORE
///
/// ## Key Properties
/// - Cleared after each transaction (not persisted)
/// - Reverted on transaction failure
/// - Separate namespace from persistent storage
/// - More gas efficient than SSTORE/SLOAD for temporary data
///
/// ## Use Cases
/// - Reentrancy guards without storage slots
/// - Temporary computation results
/// - Cross-contract communication within transaction
IsEIP1153: bool = true,

/// EIP-5656 MCOPY instruction activation (Cancun hardfork).
///
/// ## Purpose
/// Native memory copying instruction replacing inefficient
/// loop-based implementations in smart contracts.
///
/// ## Opcode Details
/// - MCOPY (0x5E): Copy memory regions
/// - Stack: [dest_offset, src_offset, length]
/// - Gas: 3 + 3 * ceil(length / 32) + memory expansion
///
/// ## Performance Impact
/// - ~10x faster than Solidity's loop-based copying
/// - Reduces bytecode size for memory operations
/// - Critical for data-heavy operations
///
/// ## Common Patterns
/// Optimizes array copying, string manipulation, and
/// data structure operations in smart contracts.
IsEIP5656: bool = true,

/// EIP-3541 contract code prefix restriction (London hardfork).
///
/// ## Purpose
/// Reserves the 0xEF byte prefix for future EVM Object Format (EOF),
/// preventing deployment of contracts with this prefix.
///
/// ## Restrictions
/// - New contracts cannot start with 0xEF byte
/// - Applies to CREATE, CREATE2, and deployment transactions
/// - Existing contracts with 0xEF prefix remain valid
///
/// ## EOF Preparation
/// This reservation enables future introduction of:
/// - Structured contract format with metadata
/// - Separate code and data sections
/// - Static jumps and improved analysis
/// - Versioning for EVM upgrades
///
/// ## Developer Impact
/// Extremely rare in practice as 0xEF was not a valid opcode,
/// making accidental conflicts unlikely.
IsEIP3541: bool = true,

/// Creates a ChainRules configuration for a specific Ethereum hardfork.
///
/// This factory function generates the appropriate set of protocol rules
/// for any supported hardfork, enabling the EVM to execute transactions
/// according to historical consensus rules.
///
/// ## Parameters
/// - `hardfork`: The target hardfork to configure rules for
///
/// ## Returns
/// A fully configured ChainRules instance with all flags set appropriately
/// for the specified hardfork.
///
/// ## Algorithm
/// The function starts with all features enabled (latest hardfork) and then
/// selectively disables features that weren't available at the specified
/// hardfork. This approach ensures new features are automatically included
/// in the latest configuration.
///
/// ## Example
/// ```zig
/// // Configure EVM for London hardfork rules
/// const london_rules = ChainRules.for_hardfork(.LONDON);
/// 
/// // Configure EVM for historical execution (e.g., replaying old blocks)
/// const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
/// ```
///
/// ## Hardfork Ordering
/// Each hardfork case disables all features introduced after it,
/// maintaining historical accuracy for transaction replay and testing.
/// Mapping of chain rule fields to the hardfork in which they were introduced.
const HardforkRule = struct {
    field_name: []const u8,
    introduced_in: Hardfork,
};

/// Comptime-generated mapping of all chain rules to their introduction hardforks.
/// This data-driven approach replaces the massive switch statement.
/// Default chain rules for the latest hardfork (CANCUN).
/// Pre-generated at compile time for zero runtime overhead.
pub const DEFAULT = for_hardfork(.DEFAULT);

const HARDFORK_RULES = [_]HardforkRule{
    .{ .field_name = "IsHomestead", .introduced_in = .HOMESTEAD },
    .{ .field_name = "IsEIP150", .introduced_in = .TANGERINE_WHISTLE },
    .{ .field_name = "IsEIP158", .introduced_in = .SPURIOUS_DRAGON },
    .{ .field_name = "IsByzantium", .introduced_in = .BYZANTIUM },
    .{ .field_name = "IsConstantinople", .introduced_in = .CONSTANTINOPLE },
    .{ .field_name = "IsPetersburg", .introduced_in = .PETERSBURG },
    .{ .field_name = "IsIstanbul", .introduced_in = .ISTANBUL },
    .{ .field_name = "IsBerlin", .introduced_in = .BERLIN },
    .{ .field_name = "IsLondon", .introduced_in = .LONDON },
    .{ .field_name = "IsMerge", .introduced_in = .MERGE },
    .{ .field_name = "IsShanghai", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsCancun", .introduced_in = .CANCUN },
    // EIPs grouped by their hardfork
    .{ .field_name = "IsEIP1559", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP2930", .introduced_in = .BERLIN },
    .{ .field_name = "IsEIP3198", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP3541", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP3651", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP3855", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP3860", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP4895", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP4844", .introduced_in = .CANCUN },
    .{ .field_name = "IsEIP1153", .introduced_in = .CANCUN },
    .{ .field_name = "IsEIP5656", .introduced_in = .CANCUN },
};

pub fn for_hardfork(hardfork: Hardfork) Self {
    var rules = Self{}; // All fields default to true
    
    // Disable features that were introduced after the target hardfork
    inline for (HARDFORK_RULES) |rule| {
        if (@intFromEnum(hardfork) < @intFromEnum(rule.introduced_in)) {
            @field(rules, rule.field_name) = false;
        }
    }
    
    return rules;
}
```
```zig [src/evm/execution_result.zig]
//! ExecutionResult module - Represents the outcome of executing an EVM opcode
//! 
//! This module defines the result structure returned by opcode execution functions.
//! Every opcode in the EVM returns an ExecutionResult that indicates:
//! - How many bytes of bytecode were consumed
//! - Whether execution should continue or halt (and if halting, what data to return)
//! 
//! ## Design Philosophy
//! 
//! The ExecutionResult struct provides a uniform interface for all opcode implementations
//! to communicate their results back to the main execution loop. This design allows for:
//! - Clean separation between opcode logic and control flow
//! - Efficient bytecode parsing without redundant position tracking
//! - Clear signaling of execution termination with associated data
//! 
//! ## Usage Pattern
//! 
//! ```zig
//! // In an opcode implementation
//! pub fn execute_add(vm: *VM) ExecutionResult {
//!     // Perform addition logic...
//!     return ExecutionResult{ .bytes_consumed = 1 }; // Continue execution
//! }
//! 
//! pub fn execute_return(vm: *VM) ExecutionResult {
//!     const data = vm.memory.read_range(offset, size);
//!     return ExecutionResult{ 
//!         .bytes_consumed = 1,
//!         .output = data  // Non-empty output signals halt
//!     };
//! }
//! ```

const std = @import("std");

/// ExecutionResult holds the result of executing a single EVM opcode
/// 
/// This struct is returned by every opcode execution function to indicate:
/// 1. How many bytes of bytecode were consumed (opcode + immediate data)
/// 2. Whether execution should continue or halt (indicated by output)
/// 
/// The EVM execution loop uses this information to:
/// - Advance the program counter by `bytes_consumed`
/// - Determine whether to continue executing or return control to caller
/// - Pass return data back to the calling context when halting
const Self = @This();

/// Number of bytes consumed by this opcode (including immediate data)
/// 
/// Most opcodes consume exactly 1 byte (just the opcode itself), but some
/// consume additional bytes for immediate data:
/// 
/// - **PUSH1-PUSH32**: Consume 1 + n bytes (opcode + n bytes of data)
/// - **All other opcodes**: Consume exactly 1 byte
/// 
/// The execution loop uses this value to advance the program counter (PC)
/// to the next instruction. Incorrect values here will cause the VM to
/// misinterpret subsequent bytecode.
/// 
/// ## Examples
/// - ADD opcode (0x01): bytes_consumed = 1
/// - PUSH1 0x42: bytes_consumed = 2 (1 for opcode, 1 for data)
/// - PUSH32 <32 bytes>: bytes_consumed = 33 (1 for opcode, 32 for data)
bytes_consumed: usize = 1,

/// Return data if the execution should halt (empty means continue)
/// 
/// This field serves a dual purpose:
/// 1. **Empty slice (`""`)**: Execution continues to the next instruction
/// 2. **Non-empty slice**: Execution halts and returns this data
/// 
/// Opcodes that halt execution include:
/// - **RETURN**: Returns specified data from memory
/// - **REVERT**: Returns revert data and reverts state changes  
/// - **STOP**: Halts with empty return data (but still non-empty slice)
/// - **INVALID**: Halts with empty data and consumes all gas
/// - **SELFDESTRUCT**: Halts after scheduling account destruction
/// 
/// The data in this field is typically:
/// - Memory contents for RETURN/REVERT
/// - Empty (but allocated) slice for STOP/INVALID
/// - Contract creation bytecode for CREATE operations
/// 
/// ## Memory Management
/// The slice should reference memory owned by the VM's memory system
/// or be a compile-time constant empty slice. The execution loop does
/// not free this memory.
output: []const u8 = "",
```
```zig [src/evm/bitvec.zig]
const std = @import("std");
const constants = @import("constants.zig");

/// BitVec is a bit vector implementation used for tracking JUMPDEST positions in bytecode
const Self = @This();

/// Bit array stored in u64 chunks
bits: []u64,
/// Total length in bits
size: usize,
/// Whether this bitvec owns its memory (and should free it)
owned: bool,

/// Error types for BitVec operations
pub const BitVecError = error{
    /// Position is out of bounds for the bit vector
    PositionOutOfBounds,
};

/// Error type for BitVec initialization
pub const BitVecInitError = std.mem.Allocator.Error;

/// Error type for code bitmap creation
pub const CodeBitmapError = BitVecInitError;

/// Create a new BitVec with the given size
pub fn init(allocator: std.mem.Allocator, size: usize) BitVecInitError!Self {
    const u64_size = (size + 63) / 64; // Round up to nearest u64
    const bits = try allocator.alloc(u64, u64_size);
    @memset(bits, 0); // Initialize all bits to 0
    return Self{
        .bits = bits,
        .size = size,
        .owned = true,
    };
}

/// Create a BitVec from existing memory (not owned)
pub fn from_memory(bits: []u64, size: usize) Self {
    return Self{
        .bits = bits,
        .size = size,
        .owned = false,
    };
}

/// Free allocated memory if owned
pub fn deinit(self: *Self, allocator: std.mem.Allocator) void {
    if (self.owned) {
        allocator.free(self.bits);
        self.bits = &.{};
        self.size = 0;
    }
}

/// Set a bit at the given position
pub fn set(self: *Self, pos: usize) BitVecError!void {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] |= bit;
}

/// Set a bit at the given position without bounds checking
pub fn set_unchecked(self: *Self, pos: usize) void {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] |= bit;
}

/// Clear a bit at the given position
pub fn clear(self: *Self, pos: usize) BitVecError!void {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] &= ~bit;
}

/// Clear a bit at the given position without bounds checking
pub fn clear_unchecked(self: *Self, pos: usize) void {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] &= ~bit;
}

/// Check if a bit is set at the given position
pub fn is_set(self: *const Self, pos: usize) BitVecError!bool {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    return (self.bits[idx] & bit) != 0;
}

/// Check if a bit is set at the given position without bounds checking
pub fn is_set_unchecked(self: *const Self, pos: usize) bool {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    return (self.bits[idx] & bit) != 0;
}

/// Check if the position represents a valid code segment
pub fn code_segment(self: *const Self, pos: usize) BitVecError!bool {
    return self.is_set(pos);
}

/// Check if the position represents a valid code segment without bounds checking
pub fn code_segment_unchecked(self: *const Self, pos: usize) bool {
    return self.is_set_unchecked(pos);
}

/// Analyze bytecode to identify valid JUMPDEST locations and code segments
pub fn code_bitmap(allocator: std.mem.Allocator, code: []const u8) CodeBitmapError!Self {
    var bitmap = try Self.init(allocator, code.len);
    errdefer bitmap.deinit(allocator);

    // Mark all positions as valid code initially
    for (0..code.len) |i| {
        bitmap.set_unchecked(i);
    }

    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];

        // If the opcode is a PUSH, skip the pushed bytes
        if (constants.is_push(op)) {
            const push_bytes = constants.get_push_size(op); // Get number of bytes to push

            // Mark pushed bytes as data (not code)
            var j: usize = 1;
            while (j <= push_bytes and i + j < code.len) : (j += 1) {
                bitmap.clear_unchecked(i + j);
            }

            // Skip the pushed bytes
            if (i + push_bytes + 1 < code.len) {
                i += push_bytes + 1;
            } else {
                i = code.len;
            }
        } else {
            i += 1;
        }
    }

    return bitmap;
}

```
```zig [src/evm/memory_size.zig]
/// Memory access requirements for EVM operations.
///
/// MemorySize encapsulates the memory region that an operation needs to access,
/// defined by an offset and size. This is used for:
/// - Calculating memory expansion costs
/// - Validating memory bounds
/// - Pre-allocating memory before operations
///
/// ## Memory Expansion
/// The EVM charges gas for memory expansion in 32-byte words. When an operation
/// accesses memory beyond the current size, the memory must expand to accommodate
/// it, incurring additional gas costs.
///
/// ## Gas Calculation
/// Memory expansion cost is quadratic:
/// - memory_cost = (memory_size_word ** 2) / 512 + (3 * memory_size_word)
/// - memory_size_word = (offset + size + 31) / 32
///
/// ## Zero-Size Edge Case
/// Operations with size=0 don't access memory and don't trigger expansion,
/// regardless of the offset value. This is important for operations like
/// RETURNDATACOPY with zero length.
///
/// Example:
/// ```zig
/// // MLOAD at offset 0x100 needs 32 bytes
/// const mem_size = MemorySize{ .offset = 0x100, .size = 32 };
/// 
/// // Calculate required memory size
/// const required = mem_size.offset + mem_size.size; // 0x120
/// ```
const Self = @This();

/// Starting offset in memory where the operation begins.
/// This is typically popped from the stack.
offset: u64,

/// Number of bytes the operation needs to access.
/// A size of 0 means no memory access (and no expansion).
size: u64,
```
```zig [src/evm/access_list.zig]
const std = @import("std");
const Address = @import("Address");
const AccessListStorageKey = @import("access_list_storage_key.zig");
const AccessListStorageKeyContext = @import("access_list_storage_key_context.zig");

/// EIP-2929 & EIP-2930: Access list management for gas cost calculation
/// 
/// Tracks which addresses and storage slots have been accessed during transaction
/// execution. First access (cold) costs more gas than subsequent accesses (warm).
/// 
/// Gas costs:
/// - Cold address access: 2600 gas
/// - Warm address access: 100 gas  
/// - Cold storage slot access: 2100 gas
/// - Warm storage slot access: 100 gas
pub const AccessList = @This();

// Error types for AccessList operations
pub const AccessAddressError = std.mem.Allocator.Error;
pub const AccessStorageSlotError = std.mem.Allocator.Error;
pub const PreWarmAddressesError = std.mem.Allocator.Error;
pub const PreWarmStorageSlotsError = std.mem.Allocator.Error;
pub const InitTransactionError = std.mem.Allocator.Error;
pub const GetCallCostError = std.mem.Allocator.Error;


// Gas costs defined by EIP-2929
pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
pub const WARM_ACCOUNT_ACCESS_COST: u64 = 100;
pub const COLD_SLOAD_COST: u64 = 2100;
pub const WARM_SLOAD_COST: u64 = 100;

// Additional costs for CALL operations
pub const COLD_CALL_EXTRA_COST: u64 = COLD_ACCOUNT_ACCESS_COST - WARM_ACCOUNT_ACCESS_COST;

allocator: std.mem.Allocator,
/// Warm addresses - addresses that have been accessed
addresses: std.AutoHashMap(Address.Address, void),
/// Warm storage slots - storage slots that have been accessed
storage_slots: std.HashMap(AccessListStorageKey, void, AccessListStorageKeyContext, 80),

pub fn init(allocator: std.mem.Allocator) AccessList {
    return .{
        .allocator = allocator,
        .addresses = std.AutoHashMap(Address.Address, void).init(allocator),
        .storage_slots = std.HashMap(AccessListStorageKey, void, AccessListStorageKeyContext, 80).init(allocator),
    };
}

pub fn deinit(self: *AccessList) void {
    self.addresses.deinit();
    self.storage_slots.deinit();
}

/// Clear all access lists for a new transaction
pub fn clear(self: *AccessList) void {
    self.addresses.clearRetainingCapacity();
    self.storage_slots.clearRetainingCapacity();
}

/// Mark an address as accessed and return the gas cost
/// Returns COLD_ACCOUNT_ACCESS_COST if first access, WARM_ACCOUNT_ACCESS_COST if already accessed
pub fn access_address(self: *AccessList, address: Address.Address) AccessAddressError!u64 {
    const result = try self.addresses.getOrPut(address);
    if (result.found_existing) return WARM_ACCOUNT_ACCESS_COST;
    return COLD_ACCOUNT_ACCESS_COST;
}

/// Mark a storage slot as accessed and return the gas cost
/// Returns COLD_SLOAD_COST if first access, WARM_SLOAD_COST if already accessed
pub fn access_storage_slot(self: *AccessList, address: Address.Address, slot: u256) AccessStorageSlotError!u64 {
    const key = AccessListStorageKey{ .address = address, .slot = slot };
    const result = try self.storage_slots.getOrPut(key);
    if (result.found_existing) return WARM_SLOAD_COST;
    return COLD_SLOAD_COST;
}

/// Check if an address is warm (has been accessed)
pub fn is_address_warm(self: *const AccessList, address: Address.Address) bool {
    return self.addresses.contains(address);
}

/// Check if a storage slot is warm (has been accessed)
pub fn is_storage_slot_warm(self: *const AccessList, address: Address.Address, slot: u256) bool {
    const key = AccessListStorageKey{ .address = address, .slot = slot };
    return self.storage_slots.contains(key);
}

/// Pre-warm addresses from EIP-2930 access list
pub fn pre_warm_addresses(self: *AccessList, addresses: []const Address.Address) PreWarmAddressesError!void {
    for (addresses) |address| {
        try self.addresses.put(address, {});
    }
}

/// Pre-warm storage slots from EIP-2930 access list
pub fn pre_warm_storage_slots(self: *AccessList, address: Address.Address, slots: []const u256) PreWarmStorageSlotsError!void {
    for (slots) |slot| {
        const key = AccessListStorageKey{ .address = address, .slot = slot };
        try self.storage_slots.put(key, {});
    }
}

/// Initialize transaction access list with pre-warmed addresses
/// According to EIP-2929, tx.origin and block.coinbase are always pre-warmed
pub fn init_transaction(self: *AccessList, tx_origin: Address.Address, coinbase: Address.Address, to: ?Address.Address) InitTransactionError!void {
    // Clear previous transaction data
    self.clear();
    
    try self.addresses.put(tx_origin, {});
    try self.addresses.put(coinbase, {});
    
    if (to) |to_address| {
        try self.addresses.put(to_address, {});
    }
}

/// Get the extra gas cost for accessing an address (for CALL operations)
/// Returns 0 if warm, COLD_CALL_EXTRA_COST if cold
pub fn get_call_cost(self: *AccessList, address: Address.Address) GetCallCostError!u64 {
    const result = try self.addresses.getOrPut(address);
    if (result.found_existing) return 0;
    return COLD_CALL_EXTRA_COST;
}

// Tests
const testing = std.testing;

test "AccessList basic operations" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const test_address = [_]u8{1} ** 20;
    
    // First access should be cold
    const cost1 = try access_list.access_address(test_address);
    try testing.expectEqual(COLD_ACCOUNT_ACCESS_COST, cost1);
    
    // Second access should be warm
    const cost2 = try access_list.access_address(test_address);
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, cost2);
    
    // Check warmth
    try testing.expect(access_list.is_address_warm(test_address));
    
    const cold_address = [_]u8{2} ** 20;
    try testing.expect(!access_list.is_address_warm(cold_address));
}

test "AccessList storage slots" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const test_address = [_]u8{1} ** 20;
    const slot1: u256 = 42;
    const slot2: u256 = 100;
    
    // First access to slot1 should be cold
    const cost1 = try access_list.access_storage_slot(test_address, slot1);
    try testing.expectEqual(COLD_SLOAD_COST, cost1);
    
    // Second access to slot1 should be warm
    const cost2 = try access_list.access_storage_slot(test_address, slot1);
    try testing.expectEqual(WARM_SLOAD_COST, cost2);
    
    // First access to slot2 should be cold
    const cost3 = try access_list.access_storage_slot(test_address, slot2);
    try testing.expectEqual(COLD_SLOAD_COST, cost3);
    
    // Check warmth
    try testing.expect(access_list.is_storage_slot_warm(test_address, slot1));
    try testing.expect(access_list.is_storage_slot_warm(test_address, slot2));
    try testing.expect(!access_list.is_storage_slot_warm(test_address, 999));
}

test "AccessList transaction initialization" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const tx_origin = [_]u8{1} ** 20;
    const coinbase = [_]u8{2} ** 20;
    const to_address = [_]u8{3} ** 20;
    
    try access_list.init_transaction(tx_origin, coinbase, to_address);
    
    // All should be pre-warmed
    try testing.expect(access_list.is_address_warm(tx_origin));
    try testing.expect(access_list.is_address_warm(coinbase));
    try testing.expect(access_list.is_address_warm(to_address));
    
    // Accessing them should return warm cost
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(tx_origin));
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(coinbase));
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(to_address));
}

test "AccessList pre-warming from EIP-2930" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const addresses = [_]Address.Address{
        [_]u8{1} ** 20,
        [_]u8{2} ** 20,
        [_]u8{3} ** 20,
    };
    
    try access_list.pre_warm_addresses(&addresses);
    
    // All should be warm
    for (addresses) |address| {
        try testing.expect(access_list.is_address_warm(address));
        try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(address));
    }
    
    // Test storage slot pre-warming
    const contract_address = [_]u8{4} ** 20;
    const slots = [_]u256{ 1, 2, 3, 100 };
    
    try access_list.pre_warm_storage_slots(contract_address, &slots);
    
    for (slots) |slot| {
        try testing.expect(access_list.is_storage_slot_warm(contract_address, slot));
        try testing.expectEqual(WARM_SLOAD_COST, try access_list.access_storage_slot(contract_address, slot));
    }
}

test "AccessList call costs" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const cold_address = [_]u8{1} ** 20;
    const warm_address = [_]u8{2} ** 20;
    
    // Pre-warm one address
    try access_list.pre_warm_addresses(&[_]Address.Address{warm_address});
    
    // Cold address should have extra cost
    try testing.expectEqual(COLD_CALL_EXTRA_COST, try access_list.get_call_cost(cold_address));
    
    // Warm address should have no extra cost
    try testing.expectEqual(@as(u64, 0), try access_list.get_call_cost(warm_address));
    
    // After getting cost, cold address should now be warm
    try testing.expect(access_list.is_address_warm(cold_address));
}
```
```zig [src/evm/memory_limits.zig]
const std = @import("std");

/// EVM Memory Limit Constants
/// 
/// The EVM doesn't have a hard memory limit in the specification, but practical
/// limits exist due to gas costs. Memory expansion has quadratic gas costs that
/// make extremely large allocations prohibitively expensive.
///
/// Most production EVMs implement practical memory limits to prevent DoS attacks
/// and ensure predictable resource usage.

/// Maximum memory size in bytes (32 MB)
/// This is a reasonable limit that matches many production EVM implementations.
/// At 32 MB, the gas cost would be approximately:
/// - Words: 1,048,576 (32 MB / 32 bytes)
/// - Linear cost: 3 * 1,048,576 = 3,145,728 gas
/// - Quadratic cost: (1,048,576^2) / 512 = 2,147,483,648 gas
/// - Total: ~2.15 billion gas (far exceeding any reasonable block gas limit)
pub const MAX_MEMORY_SIZE: u64 = 32 * 1024 * 1024; // 32 MB

/// Alternative reasonable limits used by other implementations:
/// - 16 MB: More conservative limit
pub const CONSERVATIVE_MEMORY_LIMIT: u64 = 16 * 1024 * 1024;

/// - 64 MB: More permissive limit
pub const PERMISSIVE_MEMORY_LIMIT: u64 = 64 * 1024 * 1024;

/// Calculate the gas cost for a given memory size
pub fn calculate_memory_gas_cost(size_bytes: u64) u64 {
    const words = (size_bytes + 31) / 32;
    const linear_cost = 3 * words;
    const quadratic_cost = (words * words) / 512;
    return linear_cost + quadratic_cost;
}

/// Check if a memory size would exceed reasonable gas limits
pub fn is_memory_size_reasonable(size_bytes: u64, available_gas: u64) bool {
    const gas_cost = calculate_memory_gas_cost(size_bytes);
    return gas_cost <= available_gas;
}

test "memory gas costs" {
    const testing = std.testing;
    
    // Test small allocations
    try testing.expectEqual(@as(u64, 3), calculate_memory_gas_cost(32)); // 1 word
    try testing.expectEqual(@as(u64, 6), calculate_memory_gas_cost(64)); // 2 words
    
    // Test 1 KB
    const kb_cost = calculate_memory_gas_cost(1024);
    try testing.expect(kb_cost > 96); // Should be more than linear cost alone
    
    // Test 1 MB - should be very expensive
    const mb_cost = calculate_memory_gas_cost(1024 * 1024);
    try testing.expect(mb_cost > 1_000_000); // Over 1 million gas
    
    // Test 32 MB - should be prohibitively expensive
    const limit_cost = calculate_memory_gas_cost(MAX_MEMORY_SIZE);
    try testing.expect(limit_cost > 2_000_000_000); // Over 2 billion gas
}

test "reasonable memory sizes" {
    const testing = std.testing;
    
    // With 10 million gas (reasonable for a transaction)
    const available_gas: u64 = 10_000_000;
    
    // Small sizes should be reasonable
    try testing.expect(is_memory_size_reasonable(1024, available_gas)); // 1 KB
    try testing.expect(is_memory_size_reasonable(10 * 1024, available_gas)); // 10 KB
    
    // Large sizes should not be reasonable
    try testing.expect(!is_memory_size_reasonable(10 * 1024 * 1024, available_gas)); // 10 MB
    try testing.expect(!is_memory_size_reasonable(MAX_MEMORY_SIZE, available_gas)); // 32 MB
}
```
```zig [src/evm/wasm_stubs.zig]
// Minimal stubs for WASM/freestanding build
const std = @import("std");

// Thread stub for single-threaded WASM
pub const DummyMutex = struct {
    pub fn lock(self: *@This()) void { _ = self; }
    pub fn unlock(self: *@This()) void { _ = self; }
};

// Logging stub for WASM
pub fn log(
    comptime level: std.log.Level,
    comptime scope: @TypeOf(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    _ = level;
    _ = scope;
    _ = format;
    _ = args;
    // No-op in WASM
}

// Panic stub for WASM
pub fn panic(msg: []const u8, error_return_trace: ?*std.builtin.StackTrace, ret_addr: ?usize) noreturn {
    _ = msg;
    _ = error_return_trace;
    _ = ret_addr;
    unreachable;
}
```
```zig [src/evm/access_list_storage_key_context.zig]
const AccessListStorageKey = @import("access_list_storage_key.zig");

/// HashMap context for AccessListStorageKey
const Self = @This();

pub fn hash(ctx: Self, key: AccessListStorageKey) u64 {
    _ = ctx;
    return key.hash();
}

pub fn eql(ctx: Self, a: AccessListStorageKey, b: AccessListStorageKey) bool {
    _ = ctx;
    return a.eql(b);
}
```
```zig [src/evm/execution_error.zig]
const std = @import("std");

/// ExecutionError represents various error conditions that can occur during EVM execution
/// 
/// This module defines all possible error conditions that can occur during the execution
/// of EVM bytecode. These errors are used throughout the EVM implementation to signal
/// various failure conditions, from normal stops to critical errors.
/// 
/// ## Error Categories
/// 
/// The errors can be broadly categorized into:
/// 
/// 1. **Normal Termination**: STOP, REVERT, INVALID
/// 2. **Resource Exhaustion**: OutOfGas, StackOverflow, MemoryLimitExceeded
/// 3. **Invalid Operations**: InvalidJump, InvalidOpcode, StaticStateChange
/// 4. **Bounds Violations**: StackUnderflow, OutOfOffset, ReturnDataOutOfBounds
/// 5. **Contract Creation**: DeployCodeTooBig, MaxCodeSizeExceeded, InvalidCodeEntry
/// 6. **Call Stack**: DepthLimit
/// 7. **Memory Management**: OutOfMemory, InvalidOffset, InvalidSize, ChildContextActive
/// 8. **Future Features**: EOFNotSupported
const Self = @This();

/// Error types for EVM execution
/// 
/// Each error represents a specific condition that can occur during EVM execution.
/// Some errors (like STOP and REVERT) are normal termination conditions, while
/// others represent actual failure states.
pub const Error = error{
    /// Normal termination via STOP opcode (0x00)
    /// This is not an error condition - it signals successful completion
    STOP,
    
    /// State reversion via REVERT opcode (0xFD)
    /// Returns data and reverts all state changes in the current context
    REVERT,
    
    /// Execution of INVALID opcode (0xFE)
    /// Consumes all remaining gas and reverts state
    INVALID,
    
    /// Insufficient gas to complete operation
    /// Occurs when gas_remaining < gas_required for any operation
    OutOfGas,
    
    /// Attempted to pop from empty stack or insufficient stack items
    /// Stack operations require specific minimum stack sizes
    StackUnderflow,
    
    /// Stack size exceeded maximum of 1024 elements
    /// Pushing to a full stack causes this error
    StackOverflow,
    
    /// JUMP/JUMPI to invalid destination
    /// Destination must be a JUMPDEST opcode at a valid position
    InvalidJump,
    
    /// Attempted to execute undefined opcode
    /// Not all byte values 0x00-0xFF are defined opcodes
    InvalidOpcode,
    
    /// Attempted state modification in static call context
    /// SSTORE, LOG*, CREATE*, and SELFDESTRUCT are forbidden in static calls
    StaticStateChange,
    
    /// Memory or calldata access beyond valid bounds
    /// Usually from integer overflow in offset calculations
    OutOfOffset,
    
    /// Gas calculation resulted in integer overflow
    /// Can occur with extremely large memory expansions
    GasUintOverflow,
    
    /// Attempted write in read-only context
    /// Similar to StaticStateChange but more general
    WriteProtection,
    
    /// RETURNDATACOPY accessing data beyond RETURNDATASIZE
    /// Unlike other copy operations, this is a hard error
    ReturnDataOutOfBounds,
    
    /// Contract deployment code exceeds maximum size
    /// Deployment bytecode has its own size limits
    DeployCodeTooBig,
    
    /// Deployed contract code exceeds 24,576 byte limit (EIP-170)
    /// Prevents storing excessively large contracts
    MaxCodeSizeExceeded,
    
    /// Invalid contract initialization code
    /// Can occur with malformed constructor bytecode
    InvalidCodeEntry,
    
    /// Call stack depth exceeded 1024 levels
    /// Prevents infinite recursion and stack overflow attacks
    DepthLimit,
    
    /// Memory allocation failed (host environment issue)
    /// Not a normal EVM error - indicates system resource exhaustion
    OutOfMemory,
    
    /// Invalid memory offset in operation
    /// Usually from malformed offset values
    InvalidOffset,
    
    /// Invalid memory size in operation
    /// Usually from malformed size values
    InvalidSize,
    
    /// Memory expansion would exceed configured limits
    /// Prevents excessive memory usage (typically 32MB limit)
    MemoryLimitExceeded,
    
    /// Attempted operation while child memory context is active
    /// Memory contexts must be properly managed
    ChildContextActive,
    
    /// Attempted to revert/commit without active child context
    /// Memory context operations must be balanced
    NoChildContextToRevertOrCommit,
    
    /// EOF (EVM Object Format) features not yet implemented
    /// Placeholder for future EOF-related opcodes
    EOFNotSupported,
};

/// Get a human-readable description for an execution error
/// 
/// Provides detailed descriptions of what each error means and when it occurs.
/// Useful for debugging, logging, and error reporting.
/// 
/// ## Parameters
/// - `err`: The execution error to describe
/// 
/// ## Returns
/// A string slice containing a human-readable description of the error
/// 
/// ## Example
/// ```zig
/// const err = Error.StackOverflow;
/// const desc = get_description(err);
/// std.log.err("EVM execution failed: {s}", .{desc});
/// ```
pub fn get_description(err: Error) []const u8 {
    return switch (err) {
        Error.STOP => "Normal STOP opcode execution",
        Error.REVERT => "REVERT opcode - state reverted",
        Error.INVALID => "INVALID opcode or invalid operation",
        Error.OutOfGas => "Out of gas",
        Error.StackUnderflow => "Stack underflow",
        Error.StackOverflow => "Stack overflow (beyond 1024 elements)",
        Error.InvalidJump => "Jump to invalid destination",
        Error.InvalidOpcode => "Undefined opcode",
        Error.StaticStateChange => "State modification in static context",
        Error.OutOfOffset => "Memory access out of bounds",
        Error.GasUintOverflow => "Gas calculation overflow",
        Error.WriteProtection => "Write to protected storage",
        Error.ReturnDataOutOfBounds => "Return data access out of bounds",
        Error.DeployCodeTooBig => "Contract creation code too large",
        Error.MaxCodeSizeExceeded => "Contract code size exceeds limit",
        Error.InvalidCodeEntry => "Invalid contract entry code",
        Error.DepthLimit => "Call depth exceeds limit (1024)",
        Error.OutOfMemory => "Out of memory allocation failed",
        Error.InvalidOffset => "Invalid memory offset",
        Error.InvalidSize => "Invalid memory size",
        Error.MemoryLimitExceeded => "Memory limit exceeded",
        Error.ChildContextActive => "Child context is active",
        Error.NoChildContextToRevertOrCommit => "No child context to revert or commit",
        Error.EOFNotSupported => "EOF (EVM Object Format) opcode not supported",
    };
}
```
```zig [src/evm/hardfork.zig]
/// Ethereum hardfork identifiers.
///
/// Hardforks represent protocol upgrades that change EVM behavior,
/// gas costs, or add new features. Each hardfork builds upon the
/// previous ones, maintaining backward compatibility while adding
/// improvements.
///
/// ## Hardfork History
/// The EVM has evolved through multiple hardforks, each addressing
/// specific issues or adding new capabilities:
/// - Early forks focused on security and gas pricing
/// - Later forks added new opcodes and features
/// - Recent forks optimize performance and add L2 support
///
/// ## Using Hardforks
/// Hardforks are primarily used to:
/// - Configure jump tables with correct opcodes
/// - Set appropriate gas costs for operations
/// - Enable/disable features based on fork rules
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// const is_berlin_plus = @intFromEnum(hardfork) >= @intFromEnum(Hardfork.BERLIN);
/// ```
pub const Hardfork = enum {
    /// Original Ethereum launch (July 2015).
    /// Base EVM with fundamental opcodes.
    FRONTIER,
    
    /// First planned hardfork (March 2016).
    /// Added DELEGATECALL and fixed critical issues.
    HOMESTEAD,
    
    /// Emergency fork for DAO hack (July 2016).
    /// No EVM changes, only state modifications.
    DAO,
    
    /// Gas repricing fork (October 2016).
    /// EIP-150: Increased gas costs for IO-heavy operations.
    TANGERINE_WHISTLE,
    
    /// State cleaning fork (November 2016).
    /// EIP-161: Removed empty accounts.
    SPURIOUS_DRAGON,
    
    /// Major feature fork (October 2017).
    /// Added REVERT, RETURNDATASIZE, RETURNDATACOPY, STATICCALL.
    BYZANTIUM,
    
    /// Efficiency improvements (February 2019).
    /// Added CREATE2, shift opcodes, EXTCODEHASH.
    CONSTANTINOPLE,
    
    /// Quick fix fork (February 2019).
    /// Removed EIP-1283 due to reentrancy concerns.
    PETERSBURG,
    
    /// Gas optimization fork (December 2019).
    /// EIP-2200: Rebalanced SSTORE costs.
    /// Added CHAINID and SELFBALANCE.
    ISTANBUL,
    
    /// Difficulty bomb delay (January 2020).
    /// No EVM changes.
    MUIR_GLACIER,
    
    /// Access list fork (April 2021).
    /// EIP-2929: Gas cost for cold/warm access.
    /// EIP-2930: Optional access lists.
    BERLIN,
    
    /// Fee market reform (August 2021).
    /// EIP-1559: Base fee and new transaction types.
    /// Added BASEFEE opcode.
    LONDON,
    
    /// Difficulty bomb delay (December 2021).
    /// No EVM changes.
    ARROW_GLACIER,
    
    /// Difficulty bomb delay (June 2022).
    /// No EVM changes.
    GRAY_GLACIER,
    
    /// Proof of Stake transition (September 2022).
    /// Replaced DIFFICULTY with PREVRANDAO.
    MERGE,
    
    /// Withdrawal enabling fork (April 2023).
    /// EIP-3855: PUSH0 opcode.
    SHANGHAI,
    
    /// Proto-danksharding fork (March 2024).
    /// EIP-4844: Blob transactions.
    /// EIP-1153: Transient storage (TLOAD/TSTORE).
    /// EIP-5656: MCOPY opcode.
    CANCUN,

    /// Default hardfork for new chains.
    /// Set to latest stable fork (currently CANCUN).
    pub const DEFAULT = Hardfork.CANCUN;
};
```
```zig [src/evm/eip_7702_bytecode.zig]
const Address = @import("Address");

/// Magic bytes that identify EIP-7702 delegated code
/// 
/// EIP-7702 introduces a new transaction type that allows EOAs (Externally Owned Accounts)
/// to temporarily delegate their code execution to a contract address. This is marked
/// by prepending the contract address with these magic bytes: 0xE7 0x02
pub const EIP7702_MAGIC_BYTES = [2]u8{ 0xE7, 0x02 };

/// EIP-7702 bytecode representation for delegated EOA code
/// 
/// This struct represents the bytecode format introduced by EIP-7702, which allows
/// EOAs to delegate their code execution to a contract address. The bytecode format
/// consists of the magic bytes (0xE7, 0x02) followed by a 20-byte address.
/// 
/// ## EIP-7702 Overview
/// 
/// EIP-7702 enables EOAs to temporarily act like smart contracts by delegating
/// their code execution to an existing contract. This is useful for:
/// - Account abstraction without deploying new contracts
/// - Batched transactions from EOAs
/// - Sponsored transactions
/// - Enhanced wallet functionality
/// 
/// ## Bytecode Format
/// 
/// The delegated bytecode format is exactly 22 bytes:
/// - Bytes 0-1: Magic bytes (0xE7, 0x02)
/// - Bytes 2-21: Contract address to delegate to
/// 
/// When the EVM encounters this bytecode format, it executes the code at the
/// specified contract address in the context of the EOA.
const Self = @This();

/// The contract address that this EOA delegates execution to
address: Address.Address,

/// Creates a new EIP-7702 bytecode representation
/// 
/// ## Parameters
/// - `address`: The contract address to delegate execution to
/// 
/// ## Returns
/// A new EIP7702Bytecode instance
/// 
/// ## Example
/// ```zig
/// const delegate_address = Address.from_hex("0x742d35Cc6634C0532925a3b844Bc9e7595f62d3c");
/// const bytecode = EIP7702Bytecode.new(delegate_address);
/// ```
pub fn new(address: Address.Address) Self {
    return .{ .address = address };
}

/// Creates an EIP-7702 bytecode representation from raw bytes
/// 
/// Parses the bytecode format to extract the delegation address.
/// This function expects the input to include the magic bytes.
/// 
/// ## Parameters
/// - `bytes`: Raw bytecode bytes, should be at least 22 bytes (2 magic + 20 address)
/// 
/// ## Returns
/// A new EIP7702Bytecode instance
/// 
/// ## Errors
/// Currently this function doesn't validate the magic bytes or length,
/// but may return malformed results if the input is invalid.
/// 
/// ## Example
/// ```zig
/// const raw_bytecode = &[_]u8{0xE7, 0x02} ++ address_bytes;
/// const bytecode = try EIP7702Bytecode.new_raw(raw_bytecode);
/// ```
pub fn new_raw(bytes: []const u8) !Self {
    var address: Address.Address = undefined;
    if (bytes.len > 20) {
        @memcpy(&address, bytes[2..22]);
    }
    return Self.new(address);
}

/// Returns the raw bytecode representation
/// 
/// **NOTE**: This function is currently incomplete and returns an empty slice.
/// It should return the full 22-byte bytecode including magic bytes and address.
/// 
/// ## Parameters
/// - `self`: The EIP7702Bytecode instance
/// 
/// ## Returns
/// The raw bytecode bytes (currently returns empty slice - TODO: implement properly)
/// 
/// ## TODO
/// This function should be implemented to return:
/// - Bytes 0-1: EIP7702_MAGIC_BYTES
/// - Bytes 2-21: The delegation address
pub fn raw(self: *const Self) []const u8 {
    _ = self;
    return &[_]u8{};
}
```
```zig [src/evm/fee_market.zig]
const std = @import("std");
const Log = @import("log.zig");

// FeeMarket implements the EIP-1559 fee market mechanism
///
// The EIP-1559 fee market introduces a base fee per block that moves
// up or down based on how full the previous block was compared to the target.
///
// Key features:
// 1. Base fee per block that is burned (not paid to miners)
// 2. Priority fee (tip) that goes to miners
// 3. Base fee adjustment based on block fullness

/// Helper function to calculate fee delta safely avoiding overflow and division by zero
fn calculate_fee_delta(fee: u64, gas_delta: u64, gas_target: u64, denominator: u64) u64 {
    // Using u128 for intermediate calculation to avoid overflow
    const intermediate: u128 = @as(u128, fee) * @as(u128, gas_delta);
    // Avoid division by zero
    const divisor: u128 = @max(1, @as(u128, gas_target) * @as(u128, denominator));
    const result: u64 = @intCast(@min(@as(u128, std.math.maxInt(u64)), intermediate / divisor));

    // Always return at least 1 to ensure some movement
    return @max(1, result);
}
/// Minimum base fee per gas (in wei)
/// This ensures the base fee never goes to zero
pub const MIN_BASE_FEE: u64 = 7;

/// Base fee change denominator
/// The base fee can change by at most 1/BASE_FEE_CHANGE_DENOMINATOR
/// (or 12.5% with the value of 8) between blocks
pub const BASE_FEE_CHANGE_DENOMINATOR: u64 = 8;

/// Initialize base fee for the first EIP-1559 block
///
/// This is used when transitioning from a pre-EIP-1559 chain to
/// an EIP-1559 enabled chain.
///
/// Parameters:
/// - parent_gas_used: Gas used by the parent block
/// - parent_gas_limit: Gas limit of the parent block
///
/// Returns: The initial base fee (in wei)
pub fn initial_base_fee(parent_gas_used: u64, parent_gas_limit: u64) u64 {
    Log.debug("Initializing base fee for first EIP-1559 block", .{});
    Log.debug("Parent block gas used: {d}, gas limit: {d}", .{ parent_gas_used, parent_gas_limit });

    // Initial base fee formula from the EIP-1559 specification
    // If the parent block used exactly the target gas, the initial base fee is 1 gwei
    // If it used more, the initial base fee is higher
    // If it used less, the initial base fee is lower

    // Target gas usage is half the block gas limit
    const parent_gas_target = parent_gas_limit / 2;

    // Initial base fee calculation
    var base_fee: u64 = 1_000_000_000; // 1 gwei in wei

    // Adjust initial base fee based on parent block's gas usage
    if (parent_gas_used > 0) {
        const gas_used_delta = if (parent_gas_used > parent_gas_target)
            parent_gas_used - parent_gas_target
        else
            parent_gas_target - parent_gas_used;

        const base_fee_delta = calculate_fee_delta(base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        if (parent_gas_used > parent_gas_target) {
            base_fee = base_fee + base_fee_delta;
        } else if (base_fee > base_fee_delta) {
            base_fee = base_fee - base_fee_delta;
        }
    }

    // Ensure base fee is at least the minimum
    base_fee = @max(base_fee, MIN_BASE_FEE);

    Log.debug("Initial base fee calculated: {d} wei", .{base_fee});
    return base_fee;
}

/// Calculate the next block's base fee based on the current block
///
/// This implements the EIP-1559 base fee adjustment algorithm:
/// - If the block used exactly the target gas, the base fee remains the same
/// - If the block used more than the target, the base fee increases
/// - If the block used less than the target, the base fee decreases
/// - The maximum change per block is 12.5% (1/8)
///
/// Parameters:
/// - parent_base_fee: Base fee of the parent block
/// - parent_gas_used: Gas used by the parent block
/// - parent_gas_target: Target gas usage of the parent block
///
/// Returns: The next block's base fee (in wei)
pub fn next_base_fee(parent_base_fee: u64, parent_gas_used: u64, parent_gas_target: u64) u64 {
    Log.debug("Calculating next block's base fee", .{});
    Log.debug("Parent block base fee: {d} wei", .{parent_base_fee});
    Log.debug("Parent block gas used: {d}, gas target: {d}", .{ parent_gas_used, parent_gas_target });

    // If parent block is empty, keep the base fee the same
    // Skip the delta calculations and just return the parent fee directly
    if (parent_gas_used == 0) {
        Log.debug("Parent block was empty, keeping base fee the same: {d} wei", .{parent_base_fee});
        return parent_base_fee;
    }

    // Calculate base fee delta
    var new_base_fee = parent_base_fee;

    if (parent_gas_used == parent_gas_target) {
        // If parent block used exactly the target gas, keep the base fee the same
        Log.debug("Parent block used exactly the target gas, keeping base fee the same", .{});
    } else if (parent_gas_used > parent_gas_target) {
        // If parent block used more than the target gas, increase the base fee

        // Calculate gas used delta as a fraction of target
        const gas_used_delta = parent_gas_used - parent_gas_target;

        // Calculate the base fee delta (max 12.5% increase)
        const base_fee_delta = calculate_fee_delta(parent_base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        // Increase the base fee
        // The overflow check is probably unnecessary given gas limits, but it's a good safety measure
        new_base_fee = std.math.add(u64, parent_base_fee, base_fee_delta) catch parent_base_fee;

        Log.debug("Parent block used more than target gas, increasing base fee by {d} wei", .{base_fee_delta});
    } else {
        // If parent block used less than the target gas, decrease the base fee

        // Calculate gas used delta as a fraction of target
        const gas_used_delta = parent_gas_target - parent_gas_used;

        // Calculate the base fee delta (max 12.5% decrease)
        const base_fee_delta = calculate_fee_delta(parent_base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        // Decrease the base fee, but don't go below the minimum
        new_base_fee = if (parent_base_fee > base_fee_delta)
            parent_base_fee - base_fee_delta
        else
            MIN_BASE_FEE;

        Log.debug("Parent block used less than target gas, decreasing base fee by {d} wei", .{base_fee_delta});
    }

    // Ensure base fee is at least the minimum
    new_base_fee = @max(new_base_fee, MIN_BASE_FEE);

    Log.debug("Next block base fee calculated: {d} wei", .{new_base_fee});
    return new_base_fee;
}

/// Calculate the effective gas price for an EIP-1559 transaction
///
/// The effective gas price is the minimum of:
/// 1. max_fee_per_gas specified by the sender
/// 2. base_fee_per_gas + max_priority_fee_per_gas
///
/// Parameters:
/// - base_fee_per_gas: Current block's base fee
/// - max_fee_per_gas: Maximum fee the sender is willing to pay
/// - max_priority_fee_per_gas: Maximum tip the sender is willing to pay to the miner
///
/// Returns: The effective gas price, and the miner's portion of the fee
pub fn get_effective_gas_price(base_fee_per_gas: u64, max_fee_per_gas: u64, max_priority_fee_per_gas: u64) struct { effective_gas_price: u64, miner_fee: u64 } {
    Log.debug("Calculating effective gas price", .{});
    Log.debug("Base fee: {d}, max fee: {d}, max priority fee: {d}", .{ base_fee_per_gas, max_fee_per_gas, max_priority_fee_per_gas });

    // Ensure the transaction at least pays the base fee
    if (max_fee_per_gas < base_fee_per_gas) {
        std.log.warn("Transaction's max fee ({d}) is less than base fee ({d})", .{ max_fee_per_gas, base_fee_per_gas });
        // In a real implementation, this transaction would be rejected
        // For now, just return the max fee and zero miner fee
        return .{ .effective_gas_price = max_fee_per_gas, .miner_fee = 0 };
    }

    // Calculate the priority fee (tip to miner)
    // This is limited by both max_priority_fee_per_gas and the leftover after base fee
    const max_priority_fee = @min(max_priority_fee_per_gas, max_fee_per_gas - base_fee_per_gas);

    // The effective gas price is base fee plus priority fee
    const effective_gas_price = base_fee_per_gas + max_priority_fee;

    Log.debug("Effective gas price: {d} wei", .{effective_gas_price});
    Log.debug("Miner fee (priority fee): {d} wei", .{max_priority_fee});

    return .{ .effective_gas_price = effective_gas_price, .miner_fee = max_priority_fee };
}

/// Get the gas target for a block
///
/// The gas target is the desired gas usage per block, which is typically
/// half of the maximum gas limit.
///
/// Parameters:
/// - gas_limit: The block's gas limit
///
/// Returns: The gas target for the block
pub fn get_gas_target(gas_limit: u64) u64 {
    return gas_limit / 2;
}
```
```zig [src/evm/error_mapping.zig]
//! Error mapping module - Translates component-specific errors to ExecutionError
//! 
//! This module provides a centralized error translation layer that maps errors from
//! various EVM components (Stack, Memory, VM) to the unified ExecutionError type.
//! This ensures consistent error handling throughout the EVM implementation.
//! 
//! ## Purpose
//! 
//! Different EVM components have their own error types:
//! - Stack operations can fail with overflow/underflow
//! - Memory operations can exceed limits or have invalid offsets
//! - VM operations can violate state rules or run out of resources
//! 
//! This module translates all these specific errors into ExecutionError values
//! that the main execution loop can handle uniformly.
//! 
//! ## Design Benefits
//! 
//! 1. **Separation of Concerns**: Components define their own error types
//! 2. **Consistent Handling**: All errors are mapped to ExecutionError
//! 3. **Maintainability**: Error mappings are centralized in one place
//! 4. **Type Safety**: Compile-time checking of error mappings
//! 
//! ## Usage Pattern
//! 
//! ```zig
//! // Instead of:
//! const value = stack.pop() catch |err| switch (err) {
//!     Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
//!     // ... handle other cases
//! };
//! 
//! // Use:
//! const value = try stack_pop(stack);
//! ```

const std = @import("std");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");

/// Map Stack errors to ExecutionError
/// 
/// Translates stack-specific errors into execution errors that can be
/// handled by the main EVM execution loop.
/// 
/// ## Error Mappings
/// - `Overflow` → `StackOverflow`: Stack exceeded 1024 elements
/// - `Underflow` → `StackUnderflow`: Attempted to pop from empty stack
/// - `OutOfBounds` → `StackUnderflow`: Invalid stack position access
/// - `InvalidPosition` → `StackUnderflow`: Peek/swap at invalid position
/// 
/// ## Parameters
/// - `err`: The Stack error to map
/// 
/// ## Returns
/// The corresponding ExecutionError
pub fn map_stack_error(err: Stack.Error) ExecutionError.Error {
    return switch (err) {
        Stack.Error.Overflow => ExecutionError.Error.StackOverflow,
        Stack.Error.Underflow => ExecutionError.Error.StackUnderflow,
        Stack.Error.OutOfBounds => ExecutionError.Error.StackUnderflow,
        Stack.Error.InvalidPosition => ExecutionError.Error.StackUnderflow,
    };
}

/// Map Memory errors to ExecutionError
/// 
/// Translates memory-specific errors into execution errors. Note that
/// memory limit exceeded is mapped to OutOfGas per EVM specifications.
/// 
/// ## Error Mappings
/// - `OutOfMemory` → `OutOfMemory`: System allocation failure
/// - `InvalidOffset` → `InvalidOffset`: Offset beyond addressable range
/// - `InvalidSize` → `InvalidSize`: Size calculation overflow
/// - `MemoryLimitExceeded` → `OutOfGas`: Memory expansion too expensive
/// - `ChildContextActive` → `ChildContextActive`: Context management error
/// - `NoChildContextToRevertOrCommit` → `NoChildContextToRevertOrCommit`: No context to revert
/// 
/// ## Special Case: MemoryLimitExceeded
/// The EVM doesn't have a specific "memory limit exceeded" error. Instead,
/// memory expansion that would be too expensive results in OutOfGas.
/// 
/// ## Parameters
/// - `err`: The Memory error to map
/// 
/// ## Returns
/// The corresponding ExecutionError
pub fn map_memory_error(err: Memory.MemoryError) ExecutionError.Error {
    return switch (err) {
        Memory.MemoryError.OutOfMemory => ExecutionError.Error.OutOfMemory,
        Memory.MemoryError.InvalidOffset => ExecutionError.Error.InvalidOffset,
        Memory.MemoryError.InvalidSize => ExecutionError.Error.InvalidSize,
        Memory.MemoryError.MemoryLimitExceeded => ExecutionError.Error.OutOfGas, // Map memory limit exceeded to OutOfGas as per EVM spec
        Memory.MemoryError.ChildContextActive => ExecutionError.Error.ChildContextActive,
        Memory.MemoryError.NoChildContextToRevertOrCommit => ExecutionError.Error.NoChildContextToRevertOrCommit,
    };
}

/// Map VM-level errors to ExecutionError
/// 
/// Translates general VM errors (typically from state operations or
/// system-level failures) into execution errors.
/// 
/// ## Error Mappings
/// - `OutOfMemory` → `OutOfGas`: System resource exhaustion
/// - `WriteProtection` → `WriteProtection`: Attempted write in static context
/// - All others → `OutOfGas`: Conservative default for unknown errors
/// 
/// ## Design Note
/// Unknown errors default to OutOfGas as it's the safest error that
/// ensures state is reverted and no invalid operations succeed.
/// 
/// ## Parameters
/// - `err`: Any error type (uses anyerror for flexibility)
/// 
/// ## Returns
/// The corresponding ExecutionError
pub fn map_vm_error(err: anyerror) ExecutionError.Error {
    return switch (err) {
        error.OutOfMemory => ExecutionError.Error.OutOfGas,
        error.WriteProtection => ExecutionError.Error.WriteProtection,
        // Default to OutOfGas for allocation failures
        else => ExecutionError.Error.OutOfGas,
    };
}

/// Helper function for stack pop with error mapping
/// 
/// Wraps Stack.pop() with automatic error translation to ExecutionError.
/// This is the preferred way to pop values from the stack in opcode implementations.
/// 
/// ## Parameters
/// - `stack`: Mutable reference to the Stack
/// 
/// ## Returns
/// - Success: The popped u256 value
/// - Error: Mapped ExecutionError (typically StackUnderflow)
/// 
/// ## Example
/// ```zig
/// const a = try stack_pop(vm.stack);
/// const b = try stack_pop(vm.stack);
/// const result = a + b;
/// ```
pub fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| map_stack_error(err);
}

/// Helper function for stack push with error mapping
/// 
/// Wraps Stack.append() with automatic error translation to ExecutionError.
/// This is the preferred way to push values onto the stack in opcode implementations.
/// 
/// ## Parameters
/// - `stack`: Mutable reference to the Stack
/// - `value`: The u256 value to push
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (typically StackOverflow)
/// 
/// ## Example
/// ```zig
/// const result = a + b;
/// try stack_push(vm.stack, result);
/// ```
pub fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| map_stack_error(err);
}

/// Helper function for stack peek with error mapping
/// 
/// Wraps Stack.peek() with automatic error translation to ExecutionError.
/// Allows reading stack values without popping them.
/// 
/// ## Parameters
/// - `stack`: Const reference to the Stack
/// - `position`: Zero-based position from top (0 = top element)
/// 
/// ## Returns
/// - Success: The u256 value at the specified position
/// - Error: Mapped ExecutionError (typically StackUnderflow)
/// 
/// ## Example
/// ```zig
/// // Peek at top element without removing it
/// const top = try stack_peek(vm.stack, 0);
/// ```
pub fn stack_peek(stack: *const Stack, position: usize) ExecutionError.Error!u256 {
    return stack.peek(position) catch |err| map_stack_error(err);
}

/// Helper function for memory set_byte with error mapping
/// 
/// Wraps Memory.set_byte() with automatic error translation.
/// Sets a single byte at the specified memory offset.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `offset`: Byte offset in memory
/// - `value`: The byte value to write
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (OutOfGas if expansion needed)
pub fn memory_set_byte(memory: *Memory, offset: usize, value: u8) ExecutionError.Error!void {
    return memory.set_byte(offset, value) catch |err| map_memory_error(err);
}

/// Helper function for memory set_u256 with error mapping
/// 
/// Wraps Memory.set_u256() to store a 256-bit word in memory.
/// Automatically handles memory expansion if needed.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `offset`: Byte offset in memory (will write 32 bytes)
/// - `value`: The u256 value to write
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (OutOfGas if expansion needed)
/// 
/// ## Note
/// Writes 32 bytes in big-endian format starting at offset
pub fn memory_set_u256(memory: *Memory, offset: usize, value: u256) ExecutionError.Error!void {
    return memory.set_u256(offset, value) catch |err| map_memory_error(err);
}

/// Helper function for memory set_data with error mapping
/// 
/// Wraps Memory.set_data() to copy arbitrary data into memory.
/// Handles memory expansion and bounds checking.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `offset`: Starting byte offset in memory
/// - `data`: Slice of bytes to copy
/// 
/// ## Returns
/// - Success: void  
/// - Error: Mapped ExecutionError (OutOfGas if expansion needed)
/// 
/// ## Example
/// ```zig
/// try memory_set_data(vm.memory, 0x20, calldata);
/// ```
pub fn memory_set_data(memory: *Memory, offset: usize, data: []const u8) ExecutionError.Error!void {
    return memory.set_data(offset, data) catch |err| map_memory_error(err);
}

/// Helper function for memory get_slice with error mapping
/// 
/// Wraps Memory.get_slice() to read a range of bytes from memory.
/// Returns zeros for uninitialized memory regions.
/// 
/// ## Parameters
/// - `memory`: Const reference to Memory
/// - `offset`: Starting byte offset
/// - `size`: Number of bytes to read
/// 
/// ## Returns
/// - Success: Slice of memory contents
/// - Error: Mapped ExecutionError (InvalidOffset/InvalidSize)
/// 
/// ## Memory Expansion
/// Reading does NOT expand memory - accessing beyond current size
/// returns zeros without charging gas
pub fn memory_get_slice(memory: *const Memory, offset: usize, size: usize) ExecutionError.Error![]const u8 {
    return memory.get_slice(offset, size) catch |err| map_memory_error(err);
}

/// Helper function for memory ensure_capacity with error mapping
/// 
/// Ensures memory has at least the specified capacity, expanding if needed.
/// This is useful for pre-allocating memory before operations.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `size`: Required memory size in bytes
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (OutOfGas if expansion too expensive)
/// 
/// ## Gas Cost
/// Memory expansion has quadratic gas cost, making large expansions expensive
pub fn memory_ensure_capacity(memory: *Memory, size: usize) ExecutionError.Error!void {
    _ = memory.ensure_context_capacity(size) catch |err| return map_memory_error(err);
}

/// Helper function for memory copy_within with error mapping
/// 
/// Wraps Memory.copy_within() for copying data within memory (MCOPY opcode).
/// Handles overlapping regions correctly.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `src`: Source offset in memory
/// - `dest`: Destination offset in memory
/// - `size`: Number of bytes to copy
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError
/// 
/// ## Note
/// Expands memory if dest + size exceeds current size
pub fn memory_copy_within(memory: *Memory, src: usize, dest: usize, size: usize) ExecutionError.Error!void {
    return memory.copy_within(src, dest, size) catch |err| map_memory_error(err);
}

/// Helper function for memory get_u256 with error mapping
/// 
/// Reads a 256-bit word from memory at the specified offset.
/// 
/// ## Parameters
/// - `memory`: Const reference to Memory
/// - `offset`: Byte offset to read from (reads 32 bytes)
/// 
/// ## Returns
/// - Success: The u256 value read from memory
/// - Error: Mapped ExecutionError
/// 
/// ## Note
/// Reads 32 bytes in big-endian format and converts to u256
pub fn memory_get_u256(memory: *const Memory, offset: usize) ExecutionError.Error!u256 {
    return memory.get_u256(offset) catch |err| map_memory_error(err);
}

/// Helper function for memory set_data_bounded with error mapping
/// 
/// Copies a bounded portion of data into memory with offset control.
/// Useful for CALLDATACOPY and similar opcodes that specify source offset.
/// 
/// ## Parameters
/// - `memory`: Mutable reference to Memory
/// - `offset`: Destination offset in memory
/// - `data`: Source data slice
/// - `data_offset`: Offset within the source data
/// - `size`: Number of bytes to copy
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError
/// 
/// ## Behavior
/// If data_offset + size exceeds data length, pads with zeros
pub fn memory_set_data_bounded(memory: *Memory, offset: usize, data: []const u8, data_offset: usize, size: usize) ExecutionError.Error!void {
    return memory.set_data_bounded(offset, data, data_offset, size) catch |err| map_memory_error(err);
}

/// Helper function for VM storage operations with error mapping
/// 
/// Wraps VM state storage operations with error translation.
/// Storage operations can fail due to write protection or resource limits.
/// 
/// ## Parameters
/// - `vm`: The VM instance (uses anytype for flexibility)
/// - `address`: The account address
/// - `slot`: The storage slot (u256)
/// - `value`: The value to store (u256)
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (typically WriteProtection in static calls)
/// 
/// ## Note
/// Uses anytype to work with different VM implementations
pub fn vm_set_storage(vm: anytype, address: anytype, slot: u256, value: u256) ExecutionError.Error!void {
    vm.state.set_storage(address, slot, value) catch |err| return map_vm_error(err);
}

/// Helper function for VM storage read with error mapping
/// 
/// Reads a value from contract storage (SLOAD opcode).
/// 
/// ## Parameters
/// - `vm`: The VM instance
/// - `address`: The account address
/// - `slot`: The storage slot to read
/// 
/// ## Returns
/// - Success: The stored u256 value (0 if uninitialized)
/// - Error: Mapped ExecutionError
/// 
/// ## Gas Cost
/// SLOAD has different costs for cold/warm slots (EIP-2929)
pub fn vm_get_storage(vm: anytype, address: anytype, slot: u256) ExecutionError.Error!u256 {
    return vm.state.get_storage(address, slot);
}

/// Helper function for VM transient storage write with error mapping
/// 
/// Sets a value in transient storage (TSTORE opcode from EIP-1153).
/// Transient storage is cleared after each transaction.
/// 
/// ## Parameters
/// - `vm`: The VM instance
/// - `address`: The account address
/// - `slot`: The storage slot
/// - `value`: The value to store
/// 
/// ## Returns
/// - Success: void
/// - Error: Mapped ExecutionError (WriteProtection in static calls)
/// 
/// ## Note
/// Transient storage provides cheaper temporary storage within a transaction
pub fn vm_set_transient_storage(vm: anytype, address: anytype, slot: u256, value: u256) ExecutionError.Error!void {
    vm.state.set_transient_storage(address, slot, value) catch |err| return map_vm_error(err);
}

/// Helper function for VM transient storage read with error mapping
/// 
/// Reads a value from transient storage (TLOAD opcode from EIP-1153).
/// 
/// ## Parameters
/// - `vm`: The VM instance
/// - `address`: The account address  
/// - `slot`: The storage slot to read
/// 
/// ## Returns
/// - Success: The stored u256 value (0 if uninitialized)
/// - Error: Mapped ExecutionError
/// 
/// ## Note
/// Transient storage is always warm (no cold/warm distinction)
pub fn vm_get_transient_storage(vm: anytype, address: anytype, slot: u256) ExecutionError.Error!u256 {
    return vm.state.get_transient_storage(address, slot);
}

test "map_stack_error" {
    const testing = std.testing;

    try testing.expectEqual(ExecutionError.Error.StackOverflow, map_stack_error(Stack.Error.Overflow));
    try testing.expectEqual(ExecutionError.Error.StackUnderflow, map_stack_error(Stack.Error.Underflow));
    try testing.expectEqual(ExecutionError.Error.StackUnderflow, map_stack_error(Stack.Error.OutOfBounds));
    try testing.expectEqual(ExecutionError.Error.StackUnderflow, map_stack_error(Stack.Error.InvalidPosition));
}

test "map_memory_error" {
    const testing = std.testing;

    try testing.expectEqual(ExecutionError.Error.OutOfMemory, map_memory_error(Memory.MemoryError.OutOfMemory));
    try testing.expectEqual(ExecutionError.Error.InvalidOffset, map_memory_error(Memory.MemoryError.InvalidOffset));
    try testing.expectEqual(ExecutionError.Error.InvalidSize, map_memory_error(Memory.MemoryError.InvalidSize));
    try testing.expectEqual(ExecutionError.Error.OutOfGas, map_memory_error(Memory.MemoryError.MemoryLimitExceeded)); // Updated to match OutOfGas mapping
    try testing.expectEqual(ExecutionError.Error.ChildContextActive, map_memory_error(Memory.MemoryError.ChildContextActive));
    try testing.expectEqual(ExecutionError.Error.NoChildContextToRevertOrCommit, map_memory_error(Memory.MemoryError.NoChildContextToRevertOrCommit));
}

test "map_vm_error" {
    const testing = std.testing;

    try testing.expectEqual(ExecutionError.Error.OutOfGas, map_vm_error(error.OutOfMemory));
    try testing.expectEqual(ExecutionError.Error.WriteProtection, map_vm_error(error.WriteProtection));
    // Test unknown error defaults to OutOfGas
    try testing.expectEqual(ExecutionError.Error.OutOfGas, map_vm_error(error.UnknownError));
}
```
```zig [src/evm/storage_pool.zig]
const std = @import("std");

/// Object pool for EVM storage-related hash maps to reduce allocation pressure.
///
/// The StoragePool manages reusable hash maps for storage slot tracking and access
/// patterns, significantly reducing allocation/deallocation overhead during EVM
/// execution. This is particularly important for contracts that make heavy use
/// of storage operations.
///
/// ## Design Rationale
/// EVM execution frequently creates and destroys hash maps for:
/// - Tracking which storage slots have been accessed (warm/cold for EIP-2929)
/// - Storing original storage values for gas refund calculations
///
/// Rather than allocating new maps for each contract call, this pool maintains
/// a cache of cleared maps ready for reuse.
///
/// ## Usage Pattern
/// ```zig
/// var pool = StoragePool.init(allocator);
/// defer pool.deinit();
///
/// // Borrow a map
/// const map = try pool.borrow_storage_map();
/// defer pool.return_storage_map(map);
///
/// // Use the map for storage operations
/// try map.put(slot, value);
/// ```
///
/// ## Thread Safety
/// This pool is NOT thread-safe. Each thread should maintain its own pool
/// or use external synchronization.
const Self = @This();

/// Pool of reusable access tracking maps (slot -> accessed flag)
access_maps: std.ArrayList(*std.AutoHashMap(u256, bool)),
/// Pool of reusable storage value maps (slot -> value)
storage_maps: std.ArrayList(*std.AutoHashMap(u256, u256)),
/// Allocator used for creating new maps when pool is empty
allocator: std.mem.Allocator,

/// Initialize a new storage pool.
///
/// @param allocator The allocator to use for creating new maps
/// @return A new StoragePool instance
///
/// Example:
/// ```zig
/// var pool = StoragePool.init(allocator);
/// defer pool.deinit();
/// ```
pub fn init(allocator: std.mem.Allocator) Self {
    return .{
        .access_maps = std.ArrayList(*std.AutoHashMap(u256, bool)).init(allocator),
        .storage_maps = std.ArrayList(*std.AutoHashMap(u256, u256)).init(allocator),
        .allocator = allocator,
    };
}

/// Clean up the storage pool and all contained maps.
///
/// This function destroys all pooled maps and frees their memory.
/// After calling deinit, the pool should not be used.
///
/// Note: Any maps currently borrowed from the pool will become invalid
/// after deinit. Ensure all borrowed maps are returned before calling this.
pub fn deinit(self: *Self) void {
    // Clean up any remaining maps
    for (self.access_maps.items) |map| {
        map.deinit();
        self.allocator.destroy(map);
    }
    for (self.storage_maps.items) |map| {
        map.deinit();
        self.allocator.destroy(map);
    }
    self.access_maps.deinit();
    self.storage_maps.deinit();
}

/// Error type for access map borrowing operations
pub const BorrowAccessMapError = error{
    /// Allocator failed to allocate memory for a new map
    OutOfAllocatorMemory,
};

/// Borrow an access tracking map from the pool.
///
/// Access maps track which storage slots have been accessed during execution,
/// used for EIP-2929 warm/cold access gas pricing.
///
/// If the pool has available maps, one is returned immediately.
/// Otherwise, a new map is allocated.
///
/// @return A cleared hash map ready for use
/// @throws OutOfAllocatorMemory if allocation fails
///
/// Example:
/// ```zig
/// const access_map = try pool.borrow_access_map();
/// defer pool.return_access_map(access_map);
///
/// // Track storage slot access
/// try access_map.put(slot, true);
/// const was_accessed = access_map.get(slot) orelse false;
/// ```
pub fn borrow_access_map(self: *Self) BorrowAccessMapError!*std.AutoHashMap(u256, bool) {
    if (self.access_maps.items.len > 0) return self.access_maps.pop() orelse unreachable;
    const map = self.allocator.create(std.AutoHashMap(u256, bool)) catch {
        return BorrowAccessMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, bool).init(self.allocator);
    return map;
}

/// Return an access map to the pool for reuse.
///
/// The map is cleared but its capacity is retained to avoid
/// reallocation on next use. If the pool fails to store the
/// returned map (due to memory pressure), it is silently discarded.
///
/// @param map The map to return to the pool
///
/// Note: The map should not be used after returning it to the pool.
pub fn return_access_map(self: *Self, map: *std.AutoHashMap(u256, bool)) void {
    map.clearRetainingCapacity();
    self.access_maps.append(map) catch {};
}

/// Error type for storage map borrowing operations
pub const BorrowStorageMapError = error{
    /// Allocator failed to allocate memory for a new map
    OutOfAllocatorMemory,
};

/// Borrow a storage value map from the pool.
///
/// Storage maps store slot values, typically used for tracking original
/// values to calculate gas refunds or implement storage rollback.
///
/// If the pool has available maps, one is returned immediately.
/// Otherwise, a new map is allocated.
///
/// @return A cleared hash map ready for use
/// @throws OutOfAllocatorMemory if allocation fails
///
/// Example:
/// ```zig
/// const storage_map = try pool.borrow_storage_map();
/// defer pool.return_storage_map(storage_map);
///
/// // Store original value before modification
/// try storage_map.put(slot, original_value);
/// ```
pub fn borrow_storage_map(self: *Self) BorrowStorageMapError!*std.AutoHashMap(u256, u256) {
    if (self.storage_maps.pop()) |map| {
        return map;
    }
    const map = self.allocator.create(std.AutoHashMap(u256, u256)) catch {
        return BorrowStorageMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, u256).init(self.allocator);
    return map;
}

/// Return a storage map to the pool for reuse.
///
/// The map is cleared but its capacity is retained to avoid
/// reallocation on next use. If the pool fails to store the
/// returned map (due to memory pressure), it is silently discarded.
///
/// @param map The map to return to the pool
///
/// Note: The map should not be used after returning it to the pool.
pub fn return_storage_map(self: *Self, map: *std.AutoHashMap(u256, u256)) void {
    map.clearRetainingCapacity();
    self.storage_maps.append(map) catch {};
}
```
```zig [src/evm/vm.zig]
const std = @import("std");
const Contract = @import("contract.zig");
const Stack = @import("stack.zig");
const JumpTable = @import("jump_table.zig");
const Frame = @import("frame.zig");
const Operation = @import("operation.zig");
const Address = @import("Address");
const StoragePool = @import("storage_pool.zig");
const AccessList = @import("access_list.zig");
const ExecutionError = @import("execution_error.zig");
const rlp = @import("Rlp");
const Keccak256 = std.crypto.hash.sha3.Keccak256;
const ChainRules = @import("chain_rules.zig");
const gas_constants = @import("gas_constants.zig");
const constants = @import("constants.zig");
const Log = @import("log.zig");
const EvmLog = @import("evm_log.zig");
const Context = @import("context.zig");
const EvmState = @import("evm_state.zig");
pub const StorageKey = @import("storage_key.zig");
pub const CreateResult = @import("create_result.zig");
pub const CallResult = @import("call_result.zig");
pub const RunResult = @import("run_result.zig");
const Hardfork = @import("hardfork.zig").Hardfork;

/// Virtual Machine for executing Ethereum bytecode.
///
/// Manages contract execution, gas accounting, state access, and protocol enforcement
/// according to the configured hardfork rules. Supports the full EVM instruction set
/// including contract creation, calls, and state modifications.
const Self = @This();

/// Memory allocator for VM operations
allocator: std.mem.Allocator,
/// Return data from the most recent operation
return_data: []u8 = &[_]u8{},
/// Legacy stack field (unused in current implementation)
stack: Stack = .{},
/// Opcode dispatch table for the configured hardfork
table: JumpTable,
/// Protocol rules for the current hardfork
chain_rules: ChainRules,
// TODO should be injected
/// World state including accounts, storage, and code
state: EvmState,
/// Transaction and block context
context: Context,
/// Warm/cold access tracking for EIP-2929 gas costs
access_list: AccessList,
/// Current call depth for overflow protection
depth: u16 = 0,
/// Whether the current context is read-only (STATICCALL)
read_only: bool = false,

/// Initialize VM with a jump table and corresponding chain rules.
///
/// @param allocator Memory allocator for VM operations
/// @param jump_table Optional jump table. If null, uses JumpTable.DEFAULT (latest hardfork)
/// @param chain_rules Optional chain rules. If null, uses ChainRules.DEFAULT (latest hardfork)
/// @return Initialized VM instance
///
/// Example with custom jump table and rules:
/// ```zig
/// const my_table = comptime JumpTable.init_from_hardfork(.BERLIN);
/// const my_rules = ChainRules.for_hardfork(.BERLIN);
/// var vm = try VM.init(allocator, &my_table, &my_rules);
/// ```
///
/// Example with default (latest):
/// ```zig
/// var vm = try VM.init(allocator, null, null);
/// ```
pub fn init(allocator: std.mem.Allocator, jump_table: ?*const JumpTable, chain_rules: ?*const ChainRules) std.mem.Allocator.Error!Self {
    var state = try EvmState.init(allocator);
    errdefer state.deinit();

    var access_list = AccessList.init(allocator);
    errdefer access_list.deinit();

    return Self{
        .allocator = allocator,
        .table = (jump_table orelse &JumpTable.DEFAULT).*,
        .chain_rules = (chain_rules orelse &ChainRules.DEFAULT).*,
        .state = state,
        .context = Context.init(),
        .access_list = access_list,
    };
}

/// Initialize VM with a specific hardfork.
/// Convenience function that creates the jump table at runtime.
/// For production use, consider pre-generating the jump table at compile time.
pub fn init_with_hardfork(allocator: std.mem.Allocator, hardfork: Hardfork) std.mem.Allocator.Error!Self {
    const table = JumpTable.init_from_hardfork(hardfork);
    const rules = ChainRules.for_hardfork(hardfork);
    return init(allocator, &table, &rules);
}

/// Free all VM resources.
/// Must be called when finished with the VM to prevent memory leaks.
pub fn deinit(self: *Self) void {
    self.state.deinit();
    self.access_list.deinit();
    Contract.clear_analysis_cache(self.allocator);
}

/// Execute contract bytecode and return the result.
///
/// This is the main execution entry point. The contract must be properly initialized
/// with bytecode, gas limit, and input data. The VM executes opcodes sequentially
/// until completion, error, or gas exhaustion.
///
/// Time complexity: O(n) where n is the number of opcodes executed.
/// Memory: May allocate for return data if contract returns output.
///
/// Example:
/// ```zig
/// var contract = Contract.init_at_address(caller, addr, 0, 100000, code, input, false);
/// defer contract.deinit(vm.allocator, null);
/// try vm.state.set_code(addr, code);
/// const result = try vm.interpret(&contract, input);
/// defer if (result.output) |output| vm.allocator.free(output);
/// ```
///
/// See also: interpret_static() for read-only execution
pub fn interpret(self: *Self, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, false);
}

/// Execute contract bytecode in read-only mode.
/// Identical to interpret() but prevents any state modifications.
/// Used for view functions and static analysis.
pub fn interpret_static(self: *Self, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, true);
}

/// Core bytecode execution with configurable static context.
/// Runs the main VM loop, executing opcodes sequentially while tracking
/// gas consumption and handling control flow changes.
pub fn interpret_with_context(self: *Self, contract: *Contract, input: []const u8, is_static: bool) ExecutionError.Error!RunResult {
    self.depth += 1;
    defer self.depth -= 1;

    const prev_read_only = self.read_only;
    defer self.read_only = prev_read_only;

    self.read_only = self.read_only or is_static;

    const initial_gas = contract.gas;
    var pc: usize = 0;
    var frame = try Frame.init(self.allocator, contract);
    defer frame.deinit();
    frame.memory.finalize_root();
    frame.is_static = self.read_only;
    frame.depth = @as(u32, @intCast(self.depth));
    frame.input = input;
    frame.gas_remaining = contract.gas;

    const interpreter_ptr: *Operation.Interpreter = @ptrCast(self);
    const state_ptr: *Operation.State = @ptrCast(&frame);

    while (pc < contract.code_size) {
        const opcode = contract.get_op(pc);
        frame.pc = pc;

        const result = self.table.execute(pc, interpreter_ptr, state_ptr, opcode) catch |err| {
            contract.gas = frame.gas_remaining;
            self.return_data = @constCast(frame.return_data_buffer);

            var output: ?[]const u8 = null;
            if (frame.return_data_buffer.len > 0) {
                output = self.allocator.dupe(u8, frame.return_data_buffer) catch {
                    // We are out of memory, which is a critical failure. The safest way to
                    // handle this is to treat it as an OutOfGas error, which consumes
                    // all gas and stops execution.
                    return RunResult.init(initial_gas, 0, .OutOfGas, ExecutionError.Error.OutOfMemory, null);
                };
            }

            return switch (err) {
                ExecutionError.Error.InvalidOpcode => {
                    // INVALID opcode consumes all remaining gas
                    frame.gas_remaining = 0;
                    contract.gas = 0;
                    return RunResult.init(initial_gas, 0, .Invalid, err, output);
                },
                ExecutionError.Error.STOP => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Success, null, output);
                },
                ExecutionError.Error.REVERT => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Revert, err, output);
                },
                ExecutionError.Error.OutOfGas => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .OutOfGas, err, output);
                },
                ExecutionError.Error.InvalidJump,
                ExecutionError.Error.StackUnderflow,
                ExecutionError.Error.StackOverflow,
                ExecutionError.Error.StaticStateChange,
                ExecutionError.Error.WriteProtection,
                ExecutionError.Error.DepthLimit,
                ExecutionError.Error.MaxCodeSizeExceeded,
                ExecutionError.Error.OutOfMemory,
                => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Invalid, err, output);
                },
                else => return err, // Unexpected error
            };
        };

        if (frame.pc != pc) {
            pc = frame.pc;
        } else {
            pc += result.bytes_consumed;
        }
    }

    contract.gas = frame.gas_remaining;
    self.return_data = @constCast(frame.return_data_buffer);

    const output: ?[]const u8 = if (frame.return_data_buffer.len > 0) try self.allocator.dupe(u8, frame.return_data_buffer) else null;

    return RunResult.init(
        initial_gas,
        frame.gas_remaining,
        .Success,
        null,
        output,
    );
}

fn create_contract_internal(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64, new_address: Address.Address) std.mem.Allocator.Error!CreateResult {
    if (self.state.get_code(new_address).len > 0) {
        // Contract already exists at this address
        return CreateResult.initFailure(gas, null);
    }

    const creator_balance = self.state.get_balance(creator);
    if (creator_balance < value) {
        return CreateResult.initFailure(gas, null);
    }

    if (value > 0) {
        try self.state.set_balance(creator, creator_balance - value);
        try self.state.set_balance(new_address, value);
    }

    if (init_code.len == 0) {
        // No init code means empty contract
        return CreateResult{
            .success = true,
            .address = new_address,
            .gas_left = gas,
            .output = null,
        };
    }

    var hasher = Keccak256.init(.{});
    hasher.update(init_code);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    var init_contract = Contract.init(
        creator, // caller (who is creating this contract)
        new_address, // address (the new contract's address)
        value, // value being sent to this contract
        gas, // gas available for init code execution
        init_code, // the init code to execute
        code_hash, // hash of the init code
        &[_]u8{}, // no input data for init code
        false, // not static
    );
    defer init_contract.deinit(self.allocator, null);

    // Execute the init code - this should return the deployment bytecode
    const init_result = self.interpret_with_context(&init_contract, &[_]u8{}, false) catch |err| {
        if (err == ExecutionError.Error.REVERT) {
            // On revert, we should still consume gas but not all
            return CreateResult.initFailure(init_contract.gas, null);
        }

        // Most initcode failures should return 0 address and consume all gas
        return CreateResult.initFailure(0, null);
    };

    const deployment_code = init_result.output orelse &[_]u8{};

    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    if (deployment_code.len > constants.MAX_CODE_SIZE) {
        return CreateResult.initFailure(0, null);
    }

    const deploy_code_gas = @as(u64, @intCast(deployment_code.len)) * constants.DEPLOY_CODE_GAS_PER_BYTE;

    if (deploy_code_gas > init_result.gas_left) {
        return CreateResult.initFailure(0, null);
    }

    try self.state.set_code(new_address, deployment_code);

    const gas_left = init_result.gas_left - deploy_code_gas;

    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas_left,
        .output = deployment_code,
    };
}

// Contract creation with CREATE opcode
pub const CreateContractError = std.mem.Allocator.Error || Address.CalculateAddressError;

/// Create a new contract using CREATE opcode semantics.
///
/// Increments creator's nonce, calculates address via keccak256(rlp([sender, nonce])),
/// transfers value if specified, executes init code, and deploys resulting bytecode.
///
/// Parameters:
/// - creator: Account initiating contract creation
/// - value: Wei to transfer to new contract (0 for no transfer)
/// - init_code: Bytecode executed to generate contract code
/// - gas: Maximum gas for entire creation process
///
/// Returns CreateResult with success=false if:
/// - Creator balance < value (insufficient funds)
/// - Contract exists at calculated address (collision)
/// - Init code reverts or runs out of gas
/// - Deployed bytecode > 24,576 bytes (EIP-170)
/// - Insufficient gas for deployment (200 gas/byte)
///
/// Time complexity: O(init_code_length + deployed_code_length)
/// Memory: Allocates space for deployed bytecode
///
/// See also: create2_contract() for deterministic addresses
pub fn create_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractError!CreateResult {
    const nonce = try self.state.increment_nonce(creator);
    const new_address = try Address.calculate_create_address(self.allocator, creator, nonce);
    return self.create_contract_internal(creator, value, init_code, gas, new_address);
}

pub const CallContractError = std.mem.Allocator.Error;

/// Execute a CALL operation to another contract.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Implement value transfer, gas calculation, recursive execution, and return data handling.
pub fn call_contract(self: *Self, caller: Address.Address, to: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    _ = self;
    _ = caller;
    _ = to;
    _ = value;
    _ = input;
    _ = gas;
    _ = is_static;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const ConsumeGasError = ExecutionError.Error;

pub const Create2ContractError = std.mem.Allocator.Error || Address.CalculateCreate2AddressError;

/// Create a new contract using CREATE2 opcode semantics.
///
/// Calculates a deterministic address using keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:],
/// transfers value if specified, executes the initialization code, and deploys
/// the resulting bytecode. Unlike CREATE, the address is predictable before deployment.
pub fn create2_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractError!CreateResult {
    // Calculate the new contract address using CREATE2 formula:
    // address = keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]
    const new_address = try Address.calculate_create2_address(self.allocator, creator, salt, init_code);
    return self.create_contract_internal(creator, value, init_code, gas, new_address);
}

pub const CallcodeContractError = std.mem.Allocator.Error;

// TODO
/// Execute a CALLCODE operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target code in current contract's context while preserving caller information.
pub fn callcode_contract(self: *Self, current: Address.Address, code_address: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallcodeContractError!CallResult {
    _ = self;
    _ = current;
    _ = code_address;
    _ = value;
    _ = input;
    _ = gas;
    _ = is_static;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const DelegatecallContractError = std.mem.Allocator.Error;

/// Execute a DELEGATECALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target code with current caller and value context preserved.
pub fn delegatecall_contract(self: *Self, current: Address.Address, code_address: Address.Address, input: []const u8, gas: u64, is_static: bool) DelegatecallContractError!CallResult {
    _ = self;
    _ = current;
    _ = code_address;
    _ = input;
    _ = gas;
    _ = is_static;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const StaticcallContractError = std.mem.Allocator.Error;

/// Execute a STATICCALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target contract in guaranteed read-only mode.
pub fn staticcall_contract(self: *Self, caller: Address.Address, to: Address.Address, input: []const u8, gas: u64) StaticcallContractError!CallResult {
    _ = self;
    _ = caller;
    _ = to;
    _ = input;
    _ = gas;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const EmitLogError = std.mem.Allocator.Error;

/// Emit an event log (LOG0-LOG4 opcodes).
/// Records an event that will be included in the transaction receipt.
pub fn emit_log(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) EmitLogError!void {
    try self.state.emit_log(address, topics, data);
}

pub const InitTransactionAccessListError = AccessList.InitTransactionError;

/// Initialize the access list for a new transaction (EIP-2929).
/// Must be called at the start of each transaction to set up warm/cold access tracking.
pub fn init_transaction_access_list(self: *Self, to: ?Address.Address) InitTransactionAccessListError!void {
    try self.access_list.init_transaction(self.context.tx_origin, self.context.block_coinbase, to);
}

pub const PreWarmAddressesError = AccessList.PreWarmAddressesError;

/// Mark addresses as warm to reduce gas costs for subsequent access.
/// Used with EIP-2930 access lists to pre-warm addresses in transactions.
/// Time complexity: O(n) where n is the number of addresses.
pub fn pre_warm_addresses(self: *Self, addresses: []const Address.Address) PreWarmAddressesError!void {
    try self.access_list.pre_warm_addresses(addresses);
}

pub const PreWarmStorageSlotsError = AccessList.PreWarmStorageSlotsError;

/// Mark storage slots as warm to reduce gas costs for subsequent access.
/// Used with EIP-2930 access lists in transactions.
pub fn pre_warm_storage_slots(self: *Self, address: Address.Address, slots: []const u256) PreWarmStorageSlotsError!void {
    try self.access_list.pre_warm_storage_slots(address, slots);
}

pub const GetAddressAccessCostError = AccessList.AccessAddressError;

/// Get the gas cost for accessing an address and mark it as warm.
/// Returns higher gas for first access, lower gas for subsequent access per EIP-2929.
/// Time complexity: O(1) with hash table lookup.
pub fn get_address_access_cost(self: *Self, address: Address.Address) GetAddressAccessCostError!u64 {
    return self.access_list.access_address(address);
}

pub const GetStorageAccessCostError = AccessList.AccessStorageSlotError;

/// Get the gas cost for accessing a storage slot and mark it as warm.
/// Returns 2100 gas for cold access, 100 gas for warm access (Berlin hardfork).
pub fn get_storage_access_cost(self: *Self, address: Address.Address, slot: u256) GetStorageAccessCostError!u64 {
    return self.access_list.access_storage_slot(address, slot);
}

pub const GetCallCostError = AccessList.GetCallCostError;

/// Get the additional gas cost for a CALL operation based on address warmth.
/// Returns extra gas required for calls to cold addresses (EIP-2929).
pub fn get_call_cost(self: *Self, address: Address.Address) GetCallCostError!u64 {
    return self.access_list.get_call_cost(address);
}

pub const ValidateStaticContextError = error{WriteProtection};

/// Validate that state modifications are allowed in the current context.
/// Returns WriteProtection error if called within a static (read-only) context.
pub fn validate_static_context(self: *const Self) ValidateStaticContextError!void {
    if (self.read_only) return error.WriteProtection;
}

pub const SetStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set a storage value with static context protection.
/// Used by the SSTORE opcode to prevent storage modifications in static calls.
pub fn set_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) SetStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_storage(address, slot, value);
}

pub const SetTransientStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set a transient storage value with static context protection.
/// Transient storage (EIP-1153) is cleared at the end of each transaction.
pub fn set_transient_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) SetTransientStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_transient_storage(address, slot, value);
}

pub const SetBalanceProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set an account balance with static context protection.
/// Prevents balance modifications during static calls.
pub fn set_balance_protected(self: *Self, address: Address.Address, balance: u256) SetBalanceProtectedError!void {
    try self.validate_static_context();
    try self.state.set_balance(address, balance);
}

pub const SetCodeProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Deploy contract code with static context protection.
/// Prevents code deployment during static calls.
pub fn set_code_protected(self: *Self, address: Address.Address, code: []const u8) SetCodeProtectedError!void {
    try self.validate_static_context();
    try self.state.set_code(address, code);
}

pub const EmitLogProtectedError = ValidateStaticContextError || EmitLogError;

/// Emit a log with static context protection.
/// Prevents log emission during static calls as logs modify the transaction state.
pub fn emit_log_protected(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) EmitLogProtectedError!void {
    try self.validate_static_context();
    try self.emit_log(address, topics, data);
}

pub const CreateContractProtectedError = ValidateStaticContextError || CreateContractError;

/// Create a contract with static context protection.
/// Prevents contract creation during static calls.
pub fn create_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create_contract(creator, value, init_code, gas);
}

pub const Create2ContractProtectedError = ValidateStaticContextError || Create2ContractError;

/// Create a contract with CREATE2 and static context protection.
/// Prevents contract creation during static calls.
pub fn create2_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create2_contract(creator, value, init_code, salt, gas);
}

pub const ValidateValueTransferError = error{WriteProtection};

/// Validate that value transfer is allowed in the current context.
/// Static calls cannot transfer value (msg.value must be 0).
pub fn validate_value_transfer(self: *const Self, value: u256) ValidateValueTransferError!void {
    if (self.read_only and value != 0) return error.WriteProtection;
}

pub const SelfdestructProtectedError = ValidateStaticContextError;

/// Execute SELFDESTRUCT with static context protection.
/// NOT FULLY IMPLEMENTED - currently only validates static context.
/// TODO: Transfer remaining balance to beneficiary and mark contract for deletion.
pub fn selfdestruct_protected(self: *Self, contract: Address.Address, beneficiary: Address.Address) SelfdestructProtectedError!void {
    _ = contract;
    _ = beneficiary;
    try self.validate_static_context();
}
```
```zig [src/evm/contract.zig]
//! Production-quality Contract module for EVM execution context.
//!
//! This module provides the core abstraction for contract execution in the EVM,
//! managing bytecode, gas accounting, storage access tracking, and JUMPDEST validation.
//! It incorporates performance optimizations from modern EVM implementations including
//! evmone, revm, and go-ethereum.
//!
//! ## Architecture
//! The Contract structure represents a single execution frame in the EVM call stack.
//! Each contract call (CALL, DELEGATECALL, STATICCALL, CREATE) creates a new Contract
//! instance that tracks its own gas, storage access, and execution state.
//!
//! ## Performance Characteristics
//! - **JUMPDEST validation**: O(log n) using binary search on pre-sorted positions
//! - **Storage access**: O(1) with warm/cold tracking for EIP-2929
//! - **Code analysis**: Cached globally with thread-safe access
//! - **Memory management**: Zero-allocation paths for common operations
//! - **Storage pooling**: Reuses hash maps to reduce allocation pressure
//!
//! ## Key Features
//! 1. **Code Analysis Caching**: Bytecode is analyzed once and cached globally
//! 2. **EIP-2929 Support**: Tracks warm/cold storage slots for gas calculation
//! 3. **Static Call Protection**: Prevents state modifications in read-only contexts
//! 4. **Gas Refund Tracking**: Manages gas refunds with EIP-3529 limits
//! 5. **Deployment Support**: Handles both CREATE and CREATE2 deployment flows
//!
//! ## Thread Safety
//! The global analysis cache uses mutex protection when multi-threaded,
//! automatically degrading to no-op mutexes in single-threaded builds.
//!
//! ## Memory Management
//! Contracts can optionally use a StoragePool to reuse hash maps across
//! multiple contract executions, significantly reducing allocation overhead
//! in high-throughput scenarios.
//!
//! ## Reference Implementations
//! - go-ethereum: https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go
//! - revm: https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/contract.rs
//! - evmone: https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp
const std = @import("std");
const constants = @import("constants.zig");
const bitvec = @import("bitvec.zig");
const Address = @import("Address");
const ExecutionError = @import("execution_error.zig");
const CodeAnalysis = @import("code_analysis.zig");
const StoragePool = @import("storage_pool.zig");
const Log = @import("log.zig");

/// Maximum gas refund allowed (EIP-3529)
const MAX_REFUND_QUOTIENT = 5;

/// Error types for Contract operations
pub const ContractError = std.mem.Allocator.Error || StorageOperationError;
pub const StorageOperationError = error{
    OutOfAllocatorMemory,
    InvalidStorageOperation,
};
pub const CodeAnalysisError = std.mem.Allocator.Error;

/// Global analysis cache (simplified version)
var analysis_cache: ?std.AutoHashMap([32]u8, *CodeAnalysis) = null;
// Use conditional compilation for thread safety
const is_single_threaded = @import("builtin").single_threaded;
const Mutex = if (is_single_threaded) struct {
    pub fn lock(self: *@This()) void {
        _ = self;
    }
    pub fn unlock(self: *@This()) void {
        _ = self;
    }
} else std.Thread.Mutex;

var cache_mutex: Mutex = .{};

/// Contract represents the execution context for a single call frame in the EVM.
///
/// Each contract execution (whether from external transaction, internal call,
/// or contract creation) operates within its own Contract instance. This design
/// enables proper isolation, gas accounting, and state management across the
/// call stack.
const Self = @This();

// ============================================================================
// Identity and Context Fields
// ============================================================================

/// The address where this contract's code is deployed.
///
/// - For regular calls: The callee's address
/// - For DELEGATECALL: The current contract's address (code from elsewhere)
/// - For CREATE/CREATE2: Initially zero, set after address calculation
address: Address.Address,

/// The address that initiated this contract execution.
///
/// - For external transactions: The EOA that signed the transaction
/// - For internal calls: The contract that executed CALL/DELEGATECALL/etc
/// - For CREATE/CREATE2: The creating contract's address
///
/// Note: This is msg.sender in Solidity, not tx.origin
caller: Address.Address,

/// The amount of Wei sent with this contract call.
///
/// - Regular calls: Can be any amount (if not static)
/// - DELEGATECALL: Always 0 (uses parent's value)
/// - STATICCALL: Always 0 (no value transfer allowed)
/// - CREATE/CREATE2: Initial balance for new contract
value: u256,

// ============================================================================
// Code and Analysis Fields
// ============================================================================

/// The bytecode being executed in this context.
///
/// - Regular calls: The deployed contract's runtime bytecode
/// - CALLCODE/DELEGATECALL: The external contract's code
/// - CREATE/CREATE2: The initialization bytecode (constructor)
///
/// This slice is a view into existing memory, not owned by Contract.
code: []const u8,

/// Keccak256 hash of the contract bytecode.
///
/// Used for:
/// - Code analysis caching (avoids re-analyzing same bytecode)
/// - EXTCODEHASH opcode implementation
/// - CREATE2 address calculation
///
/// For deployments, this is set to zero as there's no deployed code yet.
code_hash: [32]u8,

/// Cached length of the bytecode for performance.
///
/// Storing this separately avoids repeated slice.len calls in hot paths
/// like bounds checking for PC and CODECOPY operations.
code_size: u64,

/// Optional reference to pre-computed code analysis.
///
/// Contains:
/// - JUMPDEST positions for O(log n) validation
/// - Code vs data segments (bitvector)
/// - Static analysis results (has CREATE, has SELFDESTRUCT, etc)
///
/// This is lazily computed on first jump and cached globally.
analysis: ?*const CodeAnalysis,

// ============================================================================
// Gas Tracking Fields
// ============================================================================

/// Remaining gas available for execution.
///
/// Decremented by each operation according to its gas cost.
/// If this reaches 0, execution halts with out-of-gas error.
///
/// Gas forwarding rules:
/// - CALL: Limited by 63/64 rule (EIP-150)
/// - DELEGATECALL/STATICCALL: Same rules as CALL
/// - CREATE/CREATE2: All remaining gas minus stipend
gas: u64,

/// Accumulated gas refund from storage operations.
///
/// Tracks gas to be refunded at transaction end from:
/// - SSTORE: Clearing storage slots
/// - SELFDESTRUCT: Contract destruction (pre-London)
///
/// Limited to gas_used / 5 by EIP-3529 (London hardfork).
gas_refund: u64,

// ============================================================================
// Input/Output Fields
// ============================================================================

/// Input data passed to this contract execution.
///
/// - External transactions: Transaction data field
/// - CALL/STATICCALL: Data passed in call
/// - DELEGATECALL: Data passed (preserves msg.data)
/// - CREATE/CREATE2: Constructor arguments
///
/// Accessed via CALLDATALOAD, CALLDATASIZE, CALLDATACOPY opcodes.
input: []const u8,

// ============================================================================
// Execution Flags
// ============================================================================

/// Indicates this is a contract deployment (CREATE/CREATE2).
///
/// When true:
/// - Executing initialization code (constructor)
/// - No deployed code exists at the address yet
/// - Result will be stored as contract code if successful
is_deployment: bool,

/// Indicates this is a system-level call.
///
/// System calls bypass certain checks and gas costs.
/// Used for precompiles and protocol-level operations.
is_system_call: bool,

/// Indicates read-only execution context (STATICCALL).
///
/// When true, these operations will fail:
/// - SSTORE (storage modification)
/// - LOG0-LOG4 (event emission)
/// - CREATE/CREATE2 (contract creation)
/// - SELFDESTRUCT (contract destruction)
/// - CALL with value transfer
is_static: bool,

// ============================================================================
// Storage Access Tracking (EIP-2929)
// ============================================================================

/// Tracks which storage slots have been accessed (warm vs cold).
///
/// EIP-2929 charges different gas costs:
/// - Cold access (first time): 2100 gas
/// - Warm access (subsequent): 100 gas
///
/// Key: storage slot, Value: true (accessed)
/// Can be borrowed from StoragePool for efficiency.
storage_access: ?*std.AutoHashMap(u256, bool),

/// Tracks original storage values for gas refund calculations.
///
/// Used by SSTORE to determine gas costs and refunds based on:
/// - Original value (at transaction start)
/// - Current value (in storage)
/// - New value (being set)
///
/// Key: storage slot, Value: original value
original_storage: ?*std.AutoHashMap(u256, u256),

/// Whether this contract address was cold at call start.
///
/// Used for EIP-2929 gas calculations:
/// - Cold contract: Additional 2600 gas for first access
/// - Warm contract: No additional cost
///
/// Contracts become warm after first access in a transaction.
is_cold: bool,

// ============================================================================
// Optimization Fields
// ============================================================================

/// Quick flag indicating if bytecode contains any JUMPDEST opcodes.
///
/// Enables fast-path optimization:
/// - If false, all jumps fail immediately (no valid destinations)
/// - If true, full JUMPDEST analysis is needed
///
/// Set during initialization by scanning bytecode.
has_jumpdests: bool,

/// Flag indicating empty bytecode.
///
/// Empty contracts (no code) are common in Ethereum:
/// - EOAs (externally owned accounts)
/// - Destroyed contracts
/// - Contracts that failed deployment
///
/// Enables fast-path for calls to codeless addresses.
is_empty: bool,

/// Creates a new Contract for executing existing deployed code.
///
/// This is the standard constructor for CALL, CALLCODE, DELEGATECALL,
/// and STATICCALL operations. The contract code must already exist
/// at the specified address.
///
/// ## Parameters
/// - `caller`: The address initiating this call (msg.sender)
/// - `addr`: The address where the code is deployed
/// - `value`: Wei being transferred (0 for DELEGATECALL/STATICCALL)
/// - `gas`: Gas allocated for this execution
/// - `code`: The contract bytecode to execute
/// - `code_hash`: Keccak256 hash of the bytecode
/// - `input`: Call data (function selector + arguments)
/// - `is_static`: Whether this is a read-only context
///
/// ## Example
/// ```zig
/// const contract = Contract.init(
///     caller_address,
///     contract_address,
///     value,
///     gas_limit,
///     bytecode,
///     bytecode_hash,
///     calldata,
///     false, // not static
/// );
/// ```
pub fn init(
    caller: Address.Address,
    addr: Address.Address,
    value: u256,
    gas: u64,
    code: []const u8,
    code_hash: [32]u8,
    input: []const u8,
    is_static: bool,
) Self {
    return Self{
        .address = addr,
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = code,
        .code_hash = code_hash,
        .code_size = code.len,
        .input = input,
        .is_static = is_static,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = true,
        .gas_refund = 0,
        .is_deployment = false,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(code),
        .is_empty = code.len == 0,
    };
}

/// Creates a new Contract for deploying new bytecode.
///
/// Used for CREATE and CREATE2 operations. The contract address
/// is initially zero and will be set by the VM after computing
/// the deployment address.
///
/// ## Parameters
/// - `caller`: The creating contract's address
/// - `value`: Initial balance for the new contract
/// - `gas`: Gas allocated for deployment
/// - `code`: Initialization bytecode (constructor)
/// - `salt`: Optional salt for CREATE2 (null for CREATE)
///
/// ## Address Calculation
/// - CREATE: address = keccak256(rlp([sender, nonce]))[12:]
/// - CREATE2: address = keccak256(0xff ++ sender ++ salt ++ keccak256(code))[12:]
///
/// ## Deployment Flow
/// 1. Execute initialization code
/// 2. Code returns runtime bytecode
/// 3. VM stores runtime bytecode at computed address
/// 4. Contract becomes callable at that address
///
/// ## Example
/// ```zig
/// // CREATE
/// const contract = Contract.init_deployment(
///     deployer_address,
///     initial_balance,
///     gas_limit,
///     init_bytecode,
///     null, // no salt for CREATE
/// );
/// ```
pub fn init_deployment(
    caller: Address.Address,
    value: u256,
    gas: u64,
    code: []const u8,
    salt: ?[32]u8,
) Self {
    const contract = Self{
        .address = Address.zero(),
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = code,
        .code_hash = [_]u8{0} ** 32, // Deployment doesn't have code hash. This could be kekkac256(0) instead of 0
        .code_size = code.len,
        .input = &[_]u8{},
        .is_static = false,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = false, // Deployment is always warm
        .gas_refund = 0,
        .is_deployment = true,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(code),
        .is_empty = code.len == 0,
    };

    if (salt == null) return contract;
    // Salt is used for CREATE2 address calculation
    // The actual address calculation happens in the VM's create2_contract method

    return contract;
}

/// Performs a quick scan to check if bytecode contains any JUMPDEST opcodes.
///
/// This is a fast O(n) scan used during contract initialization to set
/// the `has_jumpdests` flag. If no JUMPDESTs exist, we can skip all
/// jump validation as any JUMP/JUMPI will fail.
///
/// ## Note
/// This doesn't account for JUMPDEST bytes inside PUSH data.
/// Full analysis is deferred until actually needed (lazy evaluation).
///
/// ## Returns
/// - `true`: At least one 0x5B byte found
/// - `false`: No JUMPDEST opcodes present
fn contains_jumpdest(code: []const u8) bool {
    for (code) |op| {
        if (op == constants.JUMPDEST) return true;
    }
    return false;
}

/// Validates if a jump destination is valid within the contract bytecode.
///
/// A valid jump destination must:
/// 1. Be within code bounds (< code_size)
/// 2. Point to a JUMPDEST opcode (0x5B)
/// 3. Not be inside PUSH data (validated by code analysis)
///
/// ## Parameters
/// - `allocator`: Allocator for lazy code analysis
/// - `dest`: Target program counter from JUMP/JUMPI
///
/// ## Returns
/// - `true`: Valid JUMPDEST at the target position
/// - `false`: Invalid destination (out of bounds, not JUMPDEST, or in data)
///
/// ## Performance
/// - Fast path: Empty code or no JUMPDESTs (immediate false)
/// - Analyzed code: O(log n) binary search
/// - First jump: O(n) analysis then O(log n) search
///
/// ## Example
/// ```zig
/// if (!contract.valid_jumpdest(allocator, jump_target)) {
///     return ExecutionError.InvalidJump;
/// }
/// ```
pub fn valid_jumpdest(self: *Self, allocator: std.mem.Allocator, dest: u256) bool {
    // Fast path: empty code or out of bounds
    if (self.is_empty or dest >= self.code_size) return false;

    // Fast path: no JUMPDESTs in code
    if (!self.has_jumpdests) return false;
    const pos: u32 = @intCast(@min(dest, std.math.maxInt(u32)));

    // Ensure analysis is performed
    self.ensure_analysis(allocator);

    // Binary search in sorted JUMPDEST positions
    if (self.analysis) |analysis| {
        if (analysis.jumpdest_positions.len > 0) {
            const Context = struct { target: u32 };
            const found = std.sort.binarySearch(
                u32,
                analysis.jumpdest_positions,
                Context{ .target = pos },
                struct {
                    fn compare(ctx: Context, item: u32) std.math.Order {
                        return std.math.order(ctx.target, item);
                    }
                }.compare,
            );
            return found != null;
        }
    }
    // Fallback to bitvec check
    return self.is_code(pos);
}

/// Ensure code analysis is performed
fn ensure_analysis(self: *Self, allocator: std.mem.Allocator) void {
    if (self.analysis == null and !self.is_empty) {
        self.analysis = analyze_code(allocator, self.code, self.code_hash) catch null;
    }
}

/// Check if position is code (not data)
pub inline fn is_code(self: *const Self, pos: u64) bool {
    if (self.analysis) |analysis| {
        // We know pos is within bounds if analysis exists, so use unchecked version
        return analysis.code_segments.is_set_unchecked(@intCast(pos));
    }
    return true;
}

/// Attempts to consume gas from the contract's available gas.
///
/// This is the primary gas accounting method, called before every
/// operation to ensure sufficient gas remains. The inline directive
/// ensures this hot-path function has minimal overhead.
///
/// ## Parameters
/// - `amount`: Gas units to consume
///
/// ## Returns
/// - `true`: Gas successfully deducted
/// - `false`: Insufficient gas (triggers out-of-gas error)
///
/// ## Usage
/// ```zig
/// if (!contract.use_gas(operation_cost)) {
///     return ExecutionError.OutOfGas;
/// }
/// ```
///
/// ## Note
/// This method is marked inline for performance as it's called
/// millions of times during contract execution.
pub inline fn use_gas(self: *Self, amount: u64) bool {
    if (self.gas < amount) return false;
    self.gas -= amount;
    return true;
}

/// Use gas without checking (when known safe)
pub inline fn use_gas_unchecked(self: *Self, amount: u64) void {
    self.gas -= amount;
}

/// Refund gas to contract
pub inline fn refund_gas(self: *Self, amount: u64) void {
    self.gas += amount;
}

/// Add to gas refund counter with clamping
pub inline fn add_gas_refund(self: *Self, amount: u64) void {
    const max_refund = self.gas / MAX_REFUND_QUOTIENT;
    self.gas_refund = @min(self.gas_refund + amount, max_refund);
}

/// Subtract from gas refund counter with clamping
pub inline fn sub_gas_refund(self: *Self, amount: u64) void {
    self.gas_refund = if (self.gas_refund > amount) self.gas_refund - amount else 0;
}

pub const MarkStorageSlotWarmError = error{
    OutOfAllocatorMemory,
};

/// Mark storage slot as warm with pool support
pub fn mark_storage_slot_warm(self: *Self, allocator: std.mem.Allocator, slot: u256, pool: ?*StoragePool) MarkStorageSlotWarmError!bool {
    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = p.borrow_access_map() catch |err| switch (err) {
                StoragePool.BorrowAccessMapError.OutOfAllocatorMemory => {
                    Log.debug("Contract.mark_storage_slot_warm: failed to borrow access map: {any}", .{err});
                    return MarkStorageSlotWarmError.OutOfAllocatorMemory;
                },
            };
        } else {
            self.storage_access = allocator.create(std.AutoHashMap(u256, bool)) catch |err| {
                Log.debug("Contract.mark_storage_slot_warm: allocation failed: {any}", .{err});
                return MarkStorageSlotWarmError.OutOfAllocatorMemory;
            };
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(allocator);
        }
    }

    const map = self.storage_access.?;
    const was_cold = !map.contains(slot);
    if (was_cold) {
        map.put(slot, true) catch |err| {
            Log.debug("Contract.mark_storage_slot_warm: map.put failed: {any}", .{err});
            return MarkStorageSlotWarmError.OutOfAllocatorMemory;
        };
    }
    return was_cold;
}

/// Check if storage slot is cold
pub fn is_storage_slot_cold(self: *const Self, slot: u256) bool {
    if (self.storage_access) |map| {
        return !map.contains(slot);
    }
    return true;
}

/// Batch mark storage slots as warm
pub fn mark_storage_slots_warm(self: *Self, allocator: std.mem.Allocator, slots: []const u256, pool: ?*StoragePool) ContractError!void {
    if (slots.len == 0) return;

    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = p.borrow_access_map() catch |err| {
                Log.debug("Failed to borrow access map from pool: {any}", .{err});
                return switch (err) {
                    StoragePool.BorrowAccessMapError.OutOfAllocatorMemory => StorageOperationError.OutOfAllocatorMemory,
                };
            };
        } else {
            self.storage_access = allocator.create(std.AutoHashMap(u256, bool)) catch |err| {
                Log.debug("Failed to create storage access map: {any}", .{err});
                return switch (err) {
                    std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
                };
            };
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(allocator);
        }
    }

    const map = self.storage_access.?;
    map.ensureTotalCapacity(@as(u32, @intCast(map.count() + slots.len))) catch |err| {
        Log.debug("Failed to ensure capacity for {d} storage slots: {any}", .{ slots.len, err });
        return switch (err) {
            std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
        };
    };

    for (slots) |slot| {
        map.putAssumeCapacity(slot, true);
    }
}

/// Store original storage value
pub fn set_original_storage_value(self: *Self, allocator: std.mem.Allocator, slot: u256, value: u256, pool: ?*StoragePool) ContractError!void {
    if (self.original_storage == null) {
        if (pool) |p| {
            self.original_storage = p.borrow_storage_map() catch |err| {
                Log.debug("Failed to borrow storage map from pool: {any}", .{err});
                return switch (err) {
                    StoragePool.BorrowStorageMapError.OutOfAllocatorMemory => StorageOperationError.OutOfAllocatorMemory,
                };
            };
        } else {
            self.original_storage = allocator.create(std.AutoHashMap(u256, u256)) catch |err| {
                Log.debug("Failed to create original storage map: {any}", .{err});
                return switch (err) {
                    std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
                };
            };
            self.original_storage.?.* = std.AutoHashMap(u256, u256).init(allocator);
        }
    }

    self.original_storage.?.put(slot, value) catch |err| {
        Log.debug("Failed to store original storage value for slot {d}: {any}", .{ slot, err });
        return switch (err) {
            std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
        };
    };
}

/// Get original storage value
pub fn get_original_storage_value(self: *const Self, slot: u256) ?u256 {
    if (self.original_storage) |map| {
        return map.get(slot);
    }
    return null;
}

/// Get opcode at position (inline for performance)
pub fn get_op(self: *const Self, n: u64) u8 {
    return if (n < self.code_size) self.code[@intCast(n)] else constants.STOP;
}

/// Get opcode at position without bounds check
pub fn get_op_unchecked(self: *const Self, n: u64) u8 {
    return self.code[n];
}

/// Set call code (for CALLCODE/DELEGATECALL)
pub fn set_call_code(self: *Self, hash: [32]u8, code: []const u8) void {
    self.code = code;
    self.code_hash = hash;
    self.code_size = code.len;
    self.has_jumpdests = contains_jumpdest(code);
    self.is_empty = code.len == 0;
    self.analysis = null;
}

/// Clean up contract resources
pub fn deinit(self: *Self, allocator: std.mem.Allocator, pool: ?*StoragePool) void {
    if (pool) |p| {
        if (self.storage_access) |map| {
            p.return_access_map(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            p.return_storage_map(map);
            self.original_storage = null;
        }
    } else {
        if (self.storage_access) |map| {
            map.deinit();
            allocator.destroy(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            map.deinit();
            allocator.destroy(map);
            self.original_storage = null;
        }
    }
    // Analysis is typically cached globally, so don't free
}

/// Analyzes bytecode and caches the results globally for reuse.
///
/// This function performs comprehensive static analysis on EVM bytecode:
/// 1. Identifies code vs data segments (for JUMPDEST validation)
/// 2. Extracts and sorts all JUMPDEST positions
/// 3. Detects special opcodes (CREATE, SELFDESTRUCT, dynamic jumps)
/// 4. Caches results by code hash for reuse
///
/// ## Parameters
/// - `allocator`: Memory allocator for analysis structures
/// - `code`: The bytecode to analyze
/// - `code_hash`: Hash for cache lookup/storage
///
/// ## Returns
/// Pointer to CodeAnalysis (cached or newly created)
///
/// ## Performance
/// - First analysis: O(n) where n is code length
/// - Subsequent calls: O(1) cache lookup
/// - Thread-safe with mutex protection
///
/// ## Caching Strategy
/// Analysis results are cached globally by code hash. This is highly
/// effective as the same contract code is often executed many times
/// across different addresses (e.g., proxy patterns, token contracts).
///
/// ## Example
/// ```zig
/// const analysis = try Contract.analyze_code(
///     allocator,
///     bytecode,
///     bytecode_hash,
/// );
/// // Analysis is now cached for future use
/// ```
pub fn analyze_code(allocator: std.mem.Allocator, code: []const u8, code_hash: [32]u8) CodeAnalysisError!*const CodeAnalysis {
    cache_mutex.lock();
    defer cache_mutex.unlock();

    if (analysis_cache == null) {
        analysis_cache = std.AutoHashMap([32]u8, *CodeAnalysis).init(allocator);
    }

    if (analysis_cache.?.get(code_hash)) |cached| {
        return cached;
    }

    const analysis = allocator.create(CodeAnalysis) catch |err| {
        Log.debug("Failed to allocate CodeAnalysis: {any}", .{err});
        return err;
    };

    analysis.code_segments = try bitvec.code_bitmap(allocator, code);

    var jumpdests = std.ArrayList(u32).init(allocator);
    defer jumpdests.deinit();

    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];

        if (op == constants.JUMPDEST and analysis.code_segments.is_set_unchecked(i)) {
            jumpdests.append(@as(u32, @intCast(i))) catch |err| {
                Log.debug("Failed to append jumpdest position {d}: {any}", .{ i, err });
                return err;
            };
        }

        if (constants.is_push(op)) {
            const push_size = constants.get_push_size(op);
            i += push_size + 1;
        } else {
            i += 1;
        }
    }

    // Sort for binary search
    std.mem.sort(u32, jumpdests.items, {}, comptime std.sort.asc(u32));
    analysis.jumpdest_positions = jumpdests.toOwnedSlice() catch |err| {
        Log.debug("Failed to convert jumpdests to owned slice: {any}", .{err});
        return err;
    };

    analysis.max_stack_depth = 0;
    analysis.block_gas_costs = null;
    analysis.has_dynamic_jumps = contains_op(code, &[_]u8{ constants.JUMP, constants.JUMPI });
    analysis.has_static_jumps = false;
    analysis.has_selfdestruct = contains_op(code, &[_]u8{constants.SELFDESTRUCT});
    analysis.has_create = contains_op(code, &[_]u8{ constants.CREATE, constants.CREATE2 });

    analysis_cache.?.put(code_hash, analysis) catch |err| {
        Log.debug("Failed to cache code analysis: {any}", .{err});
        // Continue without caching - return the analysis anyway
    };

    return analysis;
}

/// Check if code contains any of the given opcodes
pub fn contains_op(code: []const u8, opcodes: []const u8) bool {
    for (code) |op| {
        for (opcodes) |target| {
            if (op == target) return true;
        }
    }
    return false;
}

/// Clear the global analysis cache
pub fn clear_analysis_cache(allocator: std.mem.Allocator) void {
    cache_mutex.lock();
    defer cache_mutex.unlock();

    if (analysis_cache) |*cache| {
        var iter = cache.iterator();
        while (iter.next()) |entry| {
            entry.value_ptr.*.deinit(allocator);
            allocator.destroy(entry.value_ptr.*);
        }
        cache.deinit();
        analysis_cache = null;
    }
}

/// Analyze jump destinations - public wrapper for ensure_analysis
pub fn analyze_jumpdests(self: *Self, allocator: std.mem.Allocator) void {
    self.ensure_analysis(allocator);
}

/// Create a contract to execute bytecode at a specific address
/// This is useful for testing or executing code that should be treated as if it's deployed at an address
/// The caller must separately call vm.state.set_code(address, bytecode) to deploy the code
pub fn init_at_address(
    caller: Address.Address,
    address: Address.Address,
    value: u256,
    gas: u64,
    bytecode: []const u8,
    input: []const u8,
    is_static: bool,
) Self {
    // Calculate code hash for the bytecode
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    return Self{
        .address = address,
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = bytecode,
        .code_hash = code_hash,
        .code_size = bytecode.len,
        .input = input,
        .is_static = is_static,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = true,
        .gas_refund = 0,
        .is_deployment = false,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(bytecode),
        .is_empty = bytecode.len == 0,
    };
}
```
```zig [src/evm/storage_key.zig]
const std = @import("std");
const Address = @import("Address");

/// Composite key for EVM storage operations combining address and slot.
///
/// The StorageKey uniquely identifies a storage location within the EVM by
/// combining a contract address with a 256-bit storage slot number. This is
/// fundamental to how the EVM organizes persistent contract storage.
///
/// ## Design Rationale
/// Each smart contract has its own isolated storage space addressed by 256-bit
/// slots. To track storage across multiple contracts in a single VM instance,
/// we need a composite key that includes both the contract address and the
/// slot number.
///
/// ## Storage Model
/// In the EVM:
/// - Each contract has 2^256 storage slots
/// - Each slot can store a 256-bit value
/// - Slots are initially zero and only consume gas when first written
///
/// ## Usage
/// ```zig
/// const key = StorageKey{
///     .address = contract_address,
///     .slot = 0x0, // First storage slot
/// };
///
/// // Use in hash maps for storage tracking
/// var storage = std.AutoHashMap(StorageKey, u256).init(allocator);
/// try storage.put(key, value);
/// ```
///
/// ## Hashing Strategy
/// The key implements a generic hash function that works with any hasher
/// implementing the standard update() interface. The address is hashed first,
/// followed by the slot number in big-endian format.
const Self = @This();

/// The contract address that owns this storage slot.
/// Standard 20-byte Ethereum address.
address: Address.Address,

/// The 256-bit storage slot number within the contract's storage space.
/// Slots are sparsely allocated - most remain at zero value.
slot: u256,

/// Compute a hash of this storage key for use in hash maps.
///
/// This function is designed to work with Zig's AutoHashMap and any
/// hasher that implements the standard `update([]const u8)` method.
///
/// The hash combines both the address and slot to ensure unique hashes
/// for different storage locations. The slot is converted to big-endian
/// bytes to ensure consistent hashing across different architectures.
///
/// @param self The storage key to hash
/// @param hasher Any hasher with an update() method
///
/// Example:
/// ```zig
/// var map = std.AutoHashMap(StorageKey, u256).init(allocator);
/// const key = StorageKey{ .address = addr, .slot = slot };
/// try map.put(key, value); // Uses hash() internally
/// ```
pub fn hash(self: Self, hasher: anytype) void {
    // Hash the address bytes
    hasher.update(&self.address);
    // Hash the slot as bytes in big-endian format for consistency
    var slot_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &slot_bytes, self.slot, .big);
    hasher.update(&slot_bytes);
}

/// Check equality between two storage keys.
///
/// Two storage keys are equal if and only if both their address and
/// slot number match exactly. This is used by hash maps to resolve
/// collisions and find exact matches.
///
/// @param a First storage key
/// @param b Second storage key
/// @return true if both address and slot match
///
/// Example:
/// ```zig
/// const key1 = StorageKey{ .address = addr, .slot = 0 };
/// const key2 = StorageKey{ .address = addr, .slot = 0 };
/// std.debug.assert(key1.eql(key2));
/// ```
pub fn eql(a: Self, b: Self) bool {
    return std.mem.eql(u8, &a.address, &b.address) and a.slot == b.slot;
}
```
```zig [src/evm/evm_state.zig]
//! EVM state management module - Tracks blockchain state during execution
//! 
//! This module provides the state storage layer for the EVM, managing all
//! mutable blockchain state including account balances, storage, code, nonces,
//! transient storage, and event logs.
//! 
//! ## State Components
//! 
//! The EVM state consists of:
//! - **Account State**: Balances, nonces, and contract code
//! - **Persistent Storage**: Contract storage slots (SSTORE/SLOAD)
//! - **Transient Storage**: Temporary storage within transactions (TSTORE/TLOAD)
//! - **Event Logs**: Emitted events from LOG0-LOG4 opcodes
//! 
//! ## Design Philosophy
//! 
//! This implementation uses hash maps for efficient lookups and modifications.
//! All state changes are applied immediately (no journaling in this layer).
//! For transaction rollback support, this should be wrapped in a higher-level
//! state manager that implements checkpointing/journaling.
//! 
//! ## Memory Management
//! 
//! All state data is heap-allocated using the provided allocator. The state
//! owns all data it stores and properly cleans up in deinit().
//! 
//! ## Thread Safety
//! 
//! This implementation is NOT thread-safe. Concurrent access must be synchronized
//! externally.

const std = @import("std");
const Address = @import("Address");
const EvmLog = @import("evm_log.zig");
const StorageKey = @import("storage_key.zig");
const Log = @import("log.zig");

/// EVM state container
/// 
/// Manages all mutable blockchain state during EVM execution.
/// This includes account data, storage, and transaction artifacts.
const Self = @This();

/// Memory allocator for all state allocations
allocator: std.mem.Allocator,

/// Persistent contract storage (SSTORE/SLOAD)
/// Maps (address, slot) -> value
storage: std.AutoHashMap(StorageKey, u256),

/// Account balances in wei
/// Maps address -> balance
balances: std.AutoHashMap(Address.Address, u256),

/// Contract bytecode
/// Maps address -> code bytes
/// Empty slice for EOAs (Externally Owned Accounts)
code: std.AutoHashMap(Address.Address, []const u8),

/// Account nonces (transaction counters)
/// Maps address -> nonce
/// Incremented on each transaction from the account
nonces: std.AutoHashMap(Address.Address, u64),

/// Transient storage (EIP-1153: TSTORE/TLOAD)
/// Maps (address, slot) -> value
/// Cleared after each transaction
transient_storage: std.AutoHashMap(StorageKey, u256),

/// Event logs emitted during execution
/// Ordered list of all LOG0-LOG4 events
logs: std.ArrayList(EvmLog),

/// Initialize a new EVM state instance
/// 
/// Creates empty state with the provided allocator. All maps and lists
/// are initialized empty.
/// 
/// ## Parameters
/// - `allocator`: Memory allocator for all state allocations
/// 
/// ## Returns
/// - Success: New initialized state instance
/// - Error: OutOfMemory if allocation fails
/// 
/// ## Example
/// ```zig
/// var state = try EvmState.init(allocator);
/// defer state.deinit();
/// ```
pub fn init(allocator: std.mem.Allocator) std.mem.Allocator.Error!Self {
    var storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer storage.deinit();

    var balances = std.AutoHashMap(Address.Address, u256).init(allocator);
    errdefer balances.deinit();

    var code = std.AutoHashMap(Address.Address, []const u8).init(allocator);
    errdefer code.deinit();

    var nonces = std.AutoHashMap(Address.Address, u64).init(allocator);
    errdefer nonces.deinit();

    var transient_storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer transient_storage.deinit();

    var logs = std.ArrayList(EvmLog).init(allocator);
    errdefer logs.deinit();

    return Self{
        .allocator = allocator,
        .storage = storage,
        .balances = balances,
        .code = code,
        .nonces = nonces,
        .transient_storage = transient_storage,
        .logs = logs,
    };
}

/// Clean up all allocated resources
/// 
/// Frees all memory used by the state, including:
/// - All hash maps
/// - Log data (topics and data arrays)
/// - Any allocated slices
/// 
/// ## Important
/// After calling deinit(), the state instance is invalid and
/// must not be used.
pub fn deinit(self: *Self) void {
    self.storage.deinit();
    self.balances.deinit();
    self.code.deinit();
    self.nonces.deinit();
    self.transient_storage.deinit();

    // Clean up logs - free allocated memory for topics and data
    for (self.logs.items) |log| {
        self.allocator.free(log.topics);
        self.allocator.free(log.data);
    }
    self.logs.deinit();
}

// State access methods

/// Get a value from persistent storage
/// 
/// Reads a storage slot for the given address. Returns 0 for
/// uninitialized slots (EVM default).
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// 
/// ## Returns
/// The stored value, or 0 if not set
/// 
/// ## Gas Cost
/// In real EVM: 100-2100 gas depending on cold/warm access
pub fn get_storage(self: *const Self, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    return self.storage.get(key) orelse 0;
}

/// Set a value in persistent storage
/// 
/// Updates a storage slot for the given address. Setting a value
/// to 0 is different from deleting it - it still consumes storage.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number  
/// - `value`: Value to store
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Gas Cost
/// In real EVM: 2900-20000 gas depending on current/new value
pub fn set_storage(self: *Self, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    try self.storage.put(key, value);
}

/// Get account balance
/// 
/// Returns the balance in wei for the given address.
/// Non-existent accounts have balance 0.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// Balance in wei (0 for non-existent accounts)
pub fn get_balance(self: *const Self, address: Address.Address) u256 {
    return self.balances.get(address) orelse 0;
}

/// Set account balance
/// 
/// Updates the balance for the given address. Setting balance
/// creates the account if it doesn't exist.
/// 
/// ## Parameters
/// - `address`: Account address
/// - `balance`: New balance in wei
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Note
/// Balance can exceed total ETH supply in test scenarios
pub fn set_balance(self: *Self, address: Address.Address, balance: u256) std.mem.Allocator.Error!void {
    try self.balances.put(address, balance);
}

/// Get contract code
/// 
/// Returns the bytecode deployed at the given address.
/// EOAs and non-existent accounts return empty slice.
/// 
/// ## Parameters
/// - `address`: Contract address
/// 
/// ## Returns
/// Contract bytecode (empty slice for EOAs)
/// 
/// ## Note
/// The returned slice is owned by the state - do not free
pub fn get_code(self: *const Self, address: Address.Address) []const u8 {
    return self.code.get(address) orelse &[_]u8{};
}

/// Set contract code
/// 
/// Deploys bytecode to the given address. The state takes
/// ownership of the code slice.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `code`: Bytecode to deploy
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Important
/// The state does NOT copy the code - it takes ownership
/// of the provided slice
pub fn set_code(self: *Self, address: Address.Address, code: []const u8) std.mem.Allocator.Error!void {
    try self.code.put(address, code);
}

/// Get account nonce
/// 
/// Returns the transaction count for the given address.
/// Non-existent accounts have nonce 0.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// Current nonce (0 for new accounts)
/// 
/// ## Note
/// Nonce prevents transaction replay attacks
pub fn get_nonce(self: *const Self, address: Address.Address) u64 {
    return self.nonces.get(address) orelse 0;
}

/// Set account nonce
/// 
/// Updates the transaction count for the given address.
/// 
/// ## Parameters
/// - `address`: Account address
/// - `nonce`: New nonce value
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Warning
/// Setting nonce below current value can enable replay attacks
pub fn set_nonce(self: *Self, address: Address.Address, nonce: u64) std.mem.Allocator.Error!void {
    try self.nonces.put(address, nonce);
}

/// Increment account nonce
/// 
/// Atomically increments the nonce and returns the previous value.
/// Used when processing transactions from an account.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// - Success: Previous nonce value (before increment)
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Example
/// ```zig
/// const tx_nonce = try state.increment_nonce(sender);
/// // tx_nonce is used for the transaction
/// // account nonce is now tx_nonce + 1
/// ```
pub fn increment_nonce(self: *Self, address: Address.Address) std.mem.Allocator.Error!u64 {
    const current_nonce = self.get_nonce(address);
    const new_nonce = current_nonce + 1;
    try self.set_nonce(address, new_nonce);
    return current_nonce;
}

// Transient storage methods

/// Get a value from transient storage
/// 
/// Reads a transient storage slot (EIP-1153). Transient storage
/// is cleared after each transaction, making it cheaper than
/// persistent storage for temporary data.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// 
/// ## Returns
/// The stored value, or 0 if not set
/// 
/// ## Gas Cost
/// TLOAD: 100 gas (always warm)
pub fn get_transient_storage(self: *const Self, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    return self.transient_storage.get(key) orelse 0;
}

/// Set a value in transient storage
/// 
/// Updates a transient storage slot (EIP-1153). Values are
/// automatically cleared after the transaction completes.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// - `value`: Value to store temporarily
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Gas Cost
/// TSTORE: 100 gas (always warm)
/// 
/// ## Use Cases
/// - Reentrancy locks
/// - Temporary computation results
/// - Cross-contract communication within a transaction
pub fn set_transient_storage(self: *Self, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    try self.transient_storage.put(key, value);
}

// Log methods

/// Emit an event log
/// 
/// Records an event log from LOG0-LOG4 opcodes. The log is added
/// to the transaction's log list and cannot be removed.
/// 
/// ## Parameters
/// - `address`: Contract emitting the log
/// - `topics`: Indexed topics (0-4 entries)
/// - `data`: Non-indexed log data
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if allocation fails
/// 
/// ## Memory Management
/// This function copies both topics and data to ensure they
/// persist beyond the current execution context.
/// 
/// ## Example
/// ```zig
/// // Emit Transfer event
/// const topics = [_]u256{
///     0x123..., // Transfer event signature
///     from_addr, // indexed from
///     to_addr,   // indexed to  
/// };
/// const data = encode_u256(amount);
/// try state.emit_log(contract_addr, &topics, data);
/// ```
pub fn emit_log(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) std.mem.Allocator.Error!void {
    // Clone the data to ensure it persists
    const data_copy = try self.allocator.alloc(u8, data.len);
    @memcpy(data_copy, data);

    // Clone the topics to ensure they persist
    const topics_copy = try self.allocator.alloc(u256, topics.len);
    @memcpy(topics_copy, topics);

    const log = EvmLog{
        .address = address,
        .topics = topics_copy,
        .data = data_copy,
    };

    try self.logs.append(log);
}
```
```zig [src/evm/frame.zig]
const std = @import("std");
const Memory = @import("memory.zig");
const Stack = @import("stack.zig");
const Contract = @import("contract.zig");
const ExecutionError = @import("execution_error.zig");
const Log = @import("log.zig");

/// EVM execution frame representing a single call context.
///
/// A Frame encapsulates all the state needed to execute a contract call,
/// including the stack, memory, gas tracking, and execution context.
/// Each contract call or message creates a new frame.
///
/// ## Frame Hierarchy
/// Frames form a call stack during execution:
/// - External transactions create the root frame
/// - CALL/CREATE operations create child frames
/// - Frames are limited by maximum call depth (1024)
///
/// ## Execution Model
/// The frame tracks:
/// - Computational state (stack, memory, PC)
/// - Gas consumption and limits
/// - Input/output data
/// - Static call restrictions
///
/// ## Memory Management
/// Each frame has its own memory space that:
/// - Starts empty and expands as needed
/// - Is cleared when the frame completes
/// - Charges quadratic gas for expansion
///
/// Example:
/// ```zig
/// var frame = try Frame.init(allocator, &contract);
/// defer frame.deinit();
/// frame.gas_remaining = 1000000;
/// try frame.stack.append(42);
/// ```
const Self = @This();

/// Current opcode being executed (for debugging/tracing).
op: []const u8 = undefined,

/// Program counter position in bytecode.
/// @deprecated Use program_counter instead
pc: usize = 0,

/// Gas cost of current operation.
cost: u64 = 0,

/// Error that occurred during execution, if any.
err: ?ExecutionError.Error = null,

/// Frame's memory space for temporary data storage.
/// Grows dynamically and charges gas quadratically.
memory: Memory,

/// Operand stack for the stack machine.
/// Limited to 1024 elements per EVM rules.
stack: Stack,

/// Contract being executed in this frame.
/// Contains code, address, and contract metadata.
contract: *Contract,

/// Data returned from last call (for RETURNDATASIZE/COPY).
/// @deprecated Use return_data_buffer instead
return_data: ?[]u8 = null,

/// Allocator for dynamic memory allocations.
allocator: std.mem.Allocator,

/// Flag indicating execution should halt.
/// Set by STOP, RETURN, REVERT, or errors.
stop: bool = false,

/// Remaining gas for this execution.
/// Decremented by each operation; execution fails at 0.
gas_remaining: u64 = 0,

/// Whether this is a STATICCALL context.
/// Prohibits state modifications (SSTORE, CREATE, SELFDESTRUCT).
is_static: bool = false,

/// Buffer containing return data from child calls.
/// Used by RETURNDATASIZE and RETURNDATACOPY opcodes.
return_data_buffer: []const u8 = &[_]u8{},

/// Input data for this call (calldata).
/// Accessed by CALLDATALOAD, CALLDATASIZE, CALLDATACOPY.
input: []const u8 = &[_]u8{},

/// Current call depth in the call stack.
/// Limited to 1024 to prevent stack overflow attacks.
depth: u32 = 0,

/// Output data to be returned from this frame.
/// Set by RETURN or REVERT operations.
output: []const u8 = &[_]u8{},

/// Current position in contract bytecode.
/// Incremented by opcode size, modified by JUMP/JUMPI.
program_counter: usize = 0,

/// Create a new execution frame with default settings.
///
/// Initializes a frame with empty stack and memory, ready for execution.
/// Gas and other parameters must be set after initialization.
///
/// @param allocator Memory allocator for dynamic allocations
/// @param contract The contract to execute
/// @return New frame instance
/// @throws OutOfMemory if memory initialization fails
///
/// Example:
/// ```zig
/// var frame = try Frame.init(allocator, &contract);
/// defer frame.deinit();
/// frame.gas_remaining = gas_limit;
/// frame.input = calldata;
/// ```
pub fn init(allocator: std.mem.Allocator, contract: *Contract) std.mem.Allocator.Error!Self {
    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = try Memory.init_default(allocator),
        .stack = .{},
    };
}

/// Create a frame with specific initial state.
///
/// Used for creating frames with pre-existing state, such as when
/// resuming execution or creating child frames with inherited state.
/// All parameters are optional and default to sensible values.
///
/// @param allocator Memory allocator
/// @param contract Contract to execute
/// @param op Current opcode (optional)
/// @param pc Program counter (optional, deprecated)
/// @param cost Gas cost of current op (optional)
/// @param err Existing error state (optional)
/// @param memory Pre-initialized memory (optional)
/// @param stack Pre-initialized stack (optional)
/// @param return_data Return data buffer (optional, deprecated)
/// @param stop Halt flag (optional)
/// @param gas_remaining Available gas (optional)
/// @param is_static Static call flag (optional)
/// @param return_data_buffer Child return data (optional)
/// @param input Call data (optional)
/// @param depth Call stack depth (optional)
/// @param output Output buffer (optional)
/// @param program_counter Current PC (optional)
/// @return Configured frame instance
/// @throws OutOfMemory if memory initialization fails
///
/// Example:
/// ```zig
/// // Create child frame inheriting depth and static mode
/// const child_frame = try Frame.init_with_state(
///     allocator,
///     &child_contract,
///     .{ .depth = parent.depth + 1, .is_static = parent.is_static }
/// );
/// ```
pub fn init_with_state(
    allocator: std.mem.Allocator,
    contract: *Contract,
    op: ?[]const u8,
    pc: ?usize,
    cost: ?u64,
    err: ?ExecutionError.Error,
    memory: ?Memory,
    stack: ?Stack,
    return_data: ?[]u8,
    stop: ?bool,
    gas_remaining: ?u64,
    is_static: ?bool,
    return_data_buffer: ?[]const u8,
    input: ?[]const u8,
    depth: ?u32,
    output: ?[]const u8,
    program_counter: ?usize,
) std.mem.Allocator.Error!Self {
    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = memory orelse try Memory.init_default(allocator),
        .stack = stack orelse .{},
        .op = op orelse undefined,
        .pc = pc orelse 0,
        .cost = cost orelse 0,
        .err = err,
        .return_data = return_data,
        .stop = stop orelse false,
        .gas_remaining = gas_remaining orelse 0,
        .is_static = is_static orelse false,
        .return_data_buffer = return_data_buffer orelse &[_]u8{},
        .input = input orelse &[_]u8{},
        .depth = depth orelse 0,
        .output = output orelse &[_]u8{},
        .program_counter = program_counter orelse 0,
    };
}

/// Clean up frame resources.
///
/// Releases memory allocated by the frame. Must be called when
/// the frame is no longer needed to prevent memory leaks.
///
/// @param self The frame to clean up
pub fn deinit(self: *Self) void {
    self.memory.deinit();
}

/// Error type for gas consumption operations.
pub const ConsumeGasError = error{
    /// Insufficient gas to complete operation
    OutOfGas,
};

/// Consume gas from the frame's remaining gas.
///
/// Deducts the specified amount from gas_remaining. If insufficient
/// gas is available, returns OutOfGas error and execution should halt.
///
/// @param self The frame consuming gas
/// @param amount Gas units to consume
/// @throws OutOfGas if amount > gas_remaining
///
/// Example:
/// ```zig
/// // Charge gas for operation
/// try frame.consume_gas(operation.constant_gas);
/// 
/// // Charge dynamic gas
/// const memory_cost = calculate_memory_gas(size);
/// try frame.consume_gas(memory_cost);
/// ```
pub fn consume_gas(self: *Self, amount: u64) ConsumeGasError!void {
    if (amount > self.gas_remaining) return ConsumeGasError.OutOfGas;
    self.gas_remaining -= amount;
}
```
```zig [src/evm/log.zig]
const std = @import("std");

/// Professional logger for the EVM that provides consistent, clean logging
/// Only debug and error logging are provided - no info logging for performance
const Log = @This();

/// Private logger instance
const logger = std.log;

/// Debug log that only compiles in debug builds
/// This is an inline function that gets optimized away in release builds
pub inline fn debug(comptime format: []const u8, args: anytype) void {
    logger.debug("[EVM] " ++ format, args);
}

/// Error log for critical issues
pub inline fn err(comptime format: []const u8, args: anytype) void {
    logger.err("[EVM] " ++ format, args);
}

/// Warning log for non-critical issues
pub inline fn warn(comptime format: []const u8, args: anytype) void {
    logger.warn("[EVM] " ++ format, args);
}
```
```zig [src/evm/operation.zig]
const std = @import("std");
const Opcode = @import("opcode.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");

/// Operation metadata and execution functions for EVM opcodes.
///
/// This module defines the structure for EVM operations, including their
/// execution logic, gas costs, and stack requirements. Each opcode in the
/// EVM is associated with an Operation that controls its behavior.
///
/// ## Design Philosophy
/// Operations encapsulate all opcode-specific logic:
/// - Execution function that implements the opcode
/// - Gas calculation (both constant and dynamic)
/// - Stack validation requirements
/// - Memory expansion calculations
///
/// ## Function Types
/// The module uses function pointers for flexibility, allowing:
/// - Different implementations for different hardforks
/// - Optimized variants for specific conditions
/// - Mock implementations for testing
///
/// ## Gas Model
/// EVM gas costs consist of:
/// - Constant gas: Fixed cost for the operation
/// - Dynamic gas: Variable cost based on operation parameters
///
/// Example:
/// ```zig
/// // ADD operation
/// const add_op = Operation{
///     .execute = executeAdd,
///     .constant_gas = 3,
///     .min_stack = 2,
///     .max_stack = Stack.CAPACITY - 1,
/// };
/// ```
pub const ExecutionResult = @import("execution_result.zig");

/// Forward declaration for the interpreter context.
/// The actual interpreter implementation provides VM state and context.
pub const Interpreter = opaque {};

/// Forward declaration for execution state.
/// Contains transaction context, account state, and execution environment.
pub const State = opaque {};

/// Function signature for opcode execution.
///
/// Each opcode implements this signature to perform its operation.
/// The function has access to:
/// - Program counter for reading immediate values
/// - Interpreter for stack/memory manipulation
/// - State for account and storage access
///
/// @param pc Current program counter position
/// @param interpreter VM interpreter context
/// @param state Execution state and environment
/// @return Execution result indicating success/failure and gas consumption
pub const ExecutionFunc = *const fn (pc: usize, interpreter: *Interpreter, state: *State) ExecutionError.Error!ExecutionResult;

/// Function signature for dynamic gas calculation.
///
/// Some operations have variable gas costs based on:
/// - Current state (e.g., cold vs warm storage access)
/// - Operation parameters (e.g., memory expansion size)
/// - Network rules (e.g., EIP-2929 access lists)
///
/// @param interpreter VM interpreter context
/// @param state Execution state
/// @param stack Current stack for parameter inspection
/// @param memory Current memory for size calculations
/// @param requested_size Additional memory requested by operation
/// @return Dynamic gas cost to add to constant gas
/// @throws OutOfGas if gas calculation overflows
pub const GasFunc = *const fn (interpreter: *Interpreter, state: *State, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64;

/// Function signature for memory size calculation.
///
/// Operations that access memory need to calculate the required size
/// before execution to:
/// - Charge memory expansion gas
/// - Validate memory bounds
/// - Pre-allocate memory if needed
///
/// @param stack Stack containing operation parameters
/// @return Required memory size for the operation
pub const MemorySizeFunc = *const fn (stack: *Stack) Opcode.MemorySize;

/// EVM operation definition containing all metadata and functions.
///
/// Each entry in the jump table is an Operation that fully describes
/// how to execute an opcode, including validation, gas calculation,
/// and the actual execution logic.
const Self = @This();

/// Execution function implementing the opcode logic.
/// This is called after all validations pass.
execute: ExecutionFunc,

/// Base gas cost for this operation.
/// This is the minimum gas charged regardless of parameters.
/// Defined by the Ethereum Yellow Paper and EIPs.
constant_gas: u64,

/// Optional dynamic gas calculation function.
/// Operations with variable costs (storage, memory, calls) use this
/// to calculate additional gas based on runtime parameters.
dynamic_gas: ?GasFunc = null,

/// Minimum stack items required before execution.
/// The operation will fail with StackUnderflow if the stack
/// has fewer than this many items.
min_stack: u32,

/// Maximum stack size allowed before execution.
/// Ensures the operation won't cause stack overflow.
/// Calculated as: CAPACITY - (pushes - pops)
max_stack: u32,

/// Optional memory size calculation function.
/// Operations that access memory use this to determine
/// memory expansion requirements before execution.
memory_size: ?MemorySizeFunc = null,

/// Indicates if this is an undefined/invalid opcode.
/// Undefined opcodes consume all gas and fail execution.
/// Used for opcodes not assigned in the current hardfork.
undefined: bool = false,

/// Singleton NULL operation for unassigned opcode slots.
///
/// This operation is used for opcodes that:
/// - Are not yet defined in the current hardfork
/// - Have been removed in the current hardfork
/// - Are reserved for future use
///
/// Executing NULL always results in InvalidOpcode error.
pub const NULL = Self{
    .execute = undefined_execute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
    .undefined = true,
};

/// Execution function for undefined opcodes.
///
/// Consumes all remaining gas and returns InvalidOpcode error.
/// This ensures undefined opcodes cannot be used for computation.
fn undefined_execute(pc: usize, interpreter: *Interpreter, state: *State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.Error.InvalidOpcode;
}```
```zig [src/evm/memory.zig]
const std = @import("std");
const Log = @import("log.zig");

/// Memory implementation for efficient EVM call context management.
const Self = @This();

pub const MemoryError = error{
    OutOfMemory,
    InvalidOffset,
    InvalidSize,
    MemoryLimitExceeded,
    ChildContextActive,
    NoChildContextToRevertOrCommit,
};

/// Calculate number of 32-byte words needed for byte length (rounds up)
pub fn calculate_num_words(len: usize) usize {
    return (len + 31) / 32;
}

shared_buffer: std.ArrayList(u8),
allocator: std.mem.Allocator,
my_checkpoint: usize,
child_active_checkpoint: ?usize,
memory_limit: u64,
root_ptr: *Self,

pub const InitialCapacity: usize = 4 * 1024;
pub const DefaultMemoryLimit: u64 = 32 * 1024 * 1024; // 32 MB

/// Initializes the root Memory context. This instance owns the shared_buffer.
/// The caller must ensure the returned Memory is stored at a stable address
/// and call finalize_root() before use.
pub fn init(
    allocator: std.mem.Allocator,
    initial_capacity: usize,
    memory_limit: u64,
) !Self {
    var shared_buffer = std.ArrayList(u8).init(allocator);
    errdefer shared_buffer.deinit();
    try shared_buffer.ensureTotalCapacity(initial_capacity);

    return Self{
        .shared_buffer = shared_buffer,
        .allocator = allocator,
        .my_checkpoint = 0,
        .child_active_checkpoint = null,
        .memory_limit = memory_limit,
        .root_ptr = undefined,
    };
}

/// Finalizes the root Memory by setting root_ptr to itself.
/// Must be called after init() and the Memory is stored at its final address.
pub fn finalize_root(self: *Self) void {
    self.root_ptr = self;
}

pub fn init_default(allocator: std.mem.Allocator) !Self {
    return try init(allocator, InitialCapacity, DefaultMemoryLimit);
}

/// Deinitializes the shared_buffer. Should ONLY be called on the root Memory instance.
/// Child contexts should not call this.
pub fn deinit(self: *Self) void {
    if (self.my_checkpoint == 0 and self.root_ptr == self) {
        self.shared_buffer.deinit();
    }
}

/// Creates a new child Memory context.
pub fn new_child_context(self: *Self) MemoryError!Self {
    if (self.child_active_checkpoint != null) return MemoryError.ChildContextActive;
    const new_checkpoint = self.root_ptr.shared_buffer.items.len;
    self.child_active_checkpoint = new_checkpoint;

    return Self{
        .shared_buffer = undefined,
        .allocator = undefined,
        .my_checkpoint = new_checkpoint,
        .child_active_checkpoint = null,
        .memory_limit = self.memory_limit,
        .root_ptr = self.root_ptr,
    };
}

/// Reverts memory changes made by the most recent child context.
/// Truncates the shared_buffer to the length it had before the child context was created.
pub fn revert_child_context(self: *Self) MemoryError!void {
    const revert_to_len = self.child_active_checkpoint orelse
        return MemoryError.NoChildContextToRevertOrCommit;

    // Access shared_buffer via root_ptr to modify it
    // Ensure this doesn't shrink below the current context's my_checkpoint if called on non-root.
    if (revert_to_len < self.my_checkpoint) {
        // This should not happen if logic is correct (parent reverting its own child)
        std.debug.panic("Revert length {d} is less than parent's own checkpoint {d}", .{ revert_to_len, self.my_checkpoint });
    }

    self.root_ptr.shared_buffer.items.len = revert_to_len;
    self.child_active_checkpoint = null;
}

/// Commits memory changes made by the most recent child context.
/// Essentially makes the current shared_buffer length the new baseline.
pub fn commit_child_context(self: *Self) MemoryError!void {
    if (self.child_active_checkpoint == null) return MemoryError.NoChildContextToRevertOrCommit;
    // Committing means the current length of the shared buffer is accepted.
    // We just clear the checkpoint, so the new length persists.
    self.child_active_checkpoint = null;
}

// Memory Query Functions

/// Returns the size of the memory region visible to the current context.
pub fn context_size(self: *const Self) usize {
    const total_len = self.root_ptr.shared_buffer.items.len;
    if (total_len < self.my_checkpoint) {
        // This indicates a bug or inconsistent state
        return 0;
    }
    return total_len - self.my_checkpoint;
}

/// Returns the total allocated size of the shared buffer.
pub fn total_shared_buffer_size(self: *const Self) usize {
    return self.root_ptr.shared_buffer.items.len;
}

/// Returns the capacity of the shared buffer.
pub fn total_shared_buffer_capacity(self: *const Self) usize {
    return self.root_ptr.shared_buffer.capacity;
}

pub fn get_memory_limit(self: *const Self) u64 {
    return self.memory_limit;
}

/// Sets the global memory limit. Should ideally be called on the root context.
pub fn set_memory_limit(self: *Self, new_limit: u64) void {
    self.root_ptr.memory_limit = new_limit; // All contexts see the same limit via root_ptr
}

// Memory Modification Functions

/// Resizes the current context's memory region to `new_context_size` bytes.
/// This may involve growing or shrinking the global shared_buffer.
/// If growing, new memory is zero-initialized.
/// Uses 2x growth strategy for the shared_buffer if it needs to expand.
pub fn resize_context(self: *Self, new_context_size: usize) MemoryError!void {
    // @setCold(true); // Not available in Zig 0.14.0
    const new_total_len = self.my_checkpoint + new_context_size;

    if (new_total_len > self.memory_limit) return MemoryError.MemoryLimitExceeded;

    const root = self.root_ptr;
    const old_total_len = root.shared_buffer.items.len;

    // Shrinking the context (or shared buffer if this makes it smaller)
    if (new_total_len <= old_total_len) {
        if (new_total_len < self.my_checkpoint) {
            // Trying to shrink context such that its end is before its start
            return MemoryError.InvalidSize;
        }
        root.shared_buffer.items.len = new_total_len;
        return;
    }

    // Growing the context (and potentially the shared buffer)
    if (new_total_len > root.shared_buffer.capacity) {
        var new_capacity = root.shared_buffer.capacity;
        if (new_capacity == 0) new_capacity = 1; // Handle initial zero capacity
        while (new_capacity < new_total_len) {
            const doubled = @mulWithOverflow(new_capacity, 2);
            if (doubled[1] != 0) {
                // Overflow occurred
                return MemoryError.OutOfMemory;
            }
            new_capacity = doubled[0];
        }
        // Ensure new_capacity doesn't exceed memory_limit
        if (new_capacity > self.memory_limit and self.memory_limit <= std.math.maxInt(usize)) {
            new_capacity = @intCast(self.memory_limit);
        }
        if (new_total_len > new_capacity) return MemoryError.MemoryLimitExceeded;
        try root.shared_buffer.ensureTotalCapacity(new_capacity);
    }

    // Set new length and zero-initialize the newly added part
    root.shared_buffer.items.len = new_total_len;
    @memset(root.shared_buffer.items[old_total_len..new_total_len], 0);
}

/// Resizes the context's memory to the smallest multiple of 32 bytes that can contain `min_logical_context_size`.
pub fn resize_context_word_aligned(self: *Self, min_logical_context_size: usize) MemoryError!void {
    const num_words_needed = calculate_num_words(min_logical_context_size);
    const actual_new_context_size = num_words_needed * 32;
    try self.resize_context(actual_new_context_size);
}

/// Ensures the current context's memory region is at least `min_context_size` bytes.
/// Returns the number of *new 32-byte words added to the shared_buffer* if it expanded.
/// This is crucial for EVM gas calculation.
pub fn ensure_context_capacity(self: *Self, min_context_size: usize) MemoryError!u64 {
    const required_total_len = self.my_checkpoint + min_context_size;
    if (required_total_len > self.memory_limit) return MemoryError.MemoryLimitExceeded;

    const root = self.root_ptr;
    const old_total_buffer_len = root.shared_buffer.items.len;
    const old_total_words = calculate_num_words(old_total_buffer_len);

    if (required_total_len <= old_total_buffer_len) {
        // Buffer is already large enough
        return 0;
    }

    // Call resize_context to potentially expand the shared buffer
    try self.resize_context(min_context_size);

    const new_total_buffer_len = root.shared_buffer.items.len;
    const new_total_words = calculate_num_words(new_total_buffer_len);

    if (new_total_words > old_total_words) return new_total_words - old_total_words else return 0;
}

// Data Access Functions

/// Read a single byte at context-relative offset.
pub fn get_byte(self: *const Self, relative_offset: usize) MemoryError!u8 {
    if (relative_offset >= self.context_size()) return MemoryError.InvalidOffset;
    const abs_offset = self.my_checkpoint + relative_offset;
    return self.root_ptr.shared_buffer.items[abs_offset];
}

/// Write a single byte at context-relative offset.
pub fn set_byte(self: *Self, relative_offset: usize, value: u8) MemoryError!void {
    const required_context_len = relative_offset + 1;
    _ = try self.ensure_context_capacity(required_context_len);

    const abs_offset = self.my_checkpoint + relative_offset;
    self.root_ptr.shared_buffer.items[abs_offset] = value;
}

/// Read 32 bytes (word) at context-relative offset.
pub fn get_word(self: *const Self, relative_offset: usize) MemoryError![32]u8 {
    if (relative_offset + 32 > self.context_size()) return MemoryError.InvalidOffset;
    var word: [32]u8 = undefined;
    const abs_offset = self.my_checkpoint + relative_offset;
    @memcpy(&word, self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + 32]);
    return word;
}

/// Write 32 bytes (word) at context-relative offset.
pub fn set_word(self: *Self, relative_offset: usize, value: [32]u8) MemoryError!void {
    const required_context_len = relative_offset + 32;
    _ = try self.ensure_context_capacity(required_context_len);

    const abs_offset = self.my_checkpoint + relative_offset;
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + 32], &value);
}

/// Read 32 bytes as u256 at context-relative offset.
pub fn get_u256(self: *const Self, relative_offset: usize) MemoryError!u256 {
    const word = try self.get_word(relative_offset);
    // Convert big-endian bytes to u256
    var value: u256 = 0;
    for (word) |byte| {
        value = (value << 8) | byte;
    }
    return value;
}

/// Write u256 as 32 bytes at context-relative offset.
pub fn set_u256(self: *Self, relative_offset: usize, value: u256) MemoryError!void {
    var word: [32]u8 = [_]u8{0} ** 32;

    // Convert u256 to big-endian bytes
    var v = value;
    var i: usize = 31;
    while (v > 0) : (i -%= 1) {
        word[i] = @truncate(v & 0xFF);
        v >>= 8;
        if (i == 0) break;
    }

    try self.set_word(relative_offset, word);
}

/// Read arbitrary slice of memory at context-relative offset.
pub fn get_slice(self: *const Self, relative_offset: usize, len: usize) MemoryError![]const u8 {
    if (len == 0) return &[_]u8{};
    const end = std.math.add(usize, relative_offset, len) catch return MemoryError.InvalidSize;
    if (end > self.context_size()) return MemoryError.InvalidOffset;
    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + len;
    return self.root_ptr.shared_buffer.items[abs_offset..abs_end];
}

/// Write arbitrary data at context-relative offset.
pub fn set_data(self: *Self, relative_offset: usize, data: []const u8) MemoryError!void {
    if (data.len == 0) return;

    const end = std.math.add(usize, relative_offset, data.len) catch return MemoryError.InvalidSize;
    _ = try self.ensure_context_capacity(end);

    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + data.len;
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset..abs_end], data);
}

/// Write data with source offset and length (handles partial copies and zero-fills).
pub fn set_data_bounded(
    self: *Self,
    relative_memory_offset: usize,
    data: []const u8,
    data_offset: usize,
    len: usize,
) MemoryError!void {
    if (len == 0) return;

    const end = std.math.add(usize, relative_memory_offset, len) catch return MemoryError.InvalidSize;
    _ = try self.ensure_context_capacity(end);

    const abs_offset = self.my_checkpoint + relative_memory_offset;
    const abs_end = abs_offset + len;

    // If source offset is beyond data bounds, fill with zeros
    if (data_offset >= data.len) {
        @memset(self.root_ptr.shared_buffer.items[abs_offset..abs_end], 0);
        return;
    }

    // Calculate how much we can actually copy
    const data_end = @min(data_offset + len, data.len);
    const copy_len = data_end - data_offset;

    // Copy available data
    if (copy_len > 0) {
        @memcpy(
            self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + copy_len],
            data[data_offset..data_end],
        );
    }

    // Zero-fill the rest
    if (copy_len < len) {
        @memset(self.root_ptr.shared_buffer.items[abs_offset + copy_len .. abs_end], 0);
    }
}

/// Copy within memory (handles overlapping regions correctly).
pub fn copy(self: *Self, relative_dest: usize, relative_src: usize, len: usize) MemoryError!void {
    if (len == 0) return;

    // Check for integer overflow
    const src_end = std.math.add(usize, relative_src, len) catch return MemoryError.InvalidSize;
    const dest_end = std.math.add(usize, relative_dest, len) catch return MemoryError.InvalidSize;

    // Ensure memory is large enough
    const required_size = @max(src_end, dest_end);
    _ = try self.ensure_context_capacity(required_size);

    const abs_src = self.my_checkpoint + relative_src;
    const abs_dest = self.my_checkpoint + relative_dest;
    const abs_src_end = abs_src + len;
    const abs_dest_end = abs_dest + len;

    const src_slice = self.root_ptr.shared_buffer.items[abs_src..abs_src_end];
    const dest_slice = self.root_ptr.shared_buffer.items[abs_dest..abs_dest_end];

    // Use optimized copy functions that handle overlapping
    if (abs_dest <= abs_src) {
        std.mem.copyForwards(u8, dest_slice, src_slice);
    } else {
        std.mem.copyBackwards(u8, dest_slice, src_slice);
    }
}

// Unsafe Operations

/// Get raw pointer to memory at context-relative offset.
/// WARNING: No bounds checking - caller must ensure offset is valid.
pub fn get_ptr_unsafe(self: *Self, relative_offset: usize) [*]u8 {
    @setRuntimeSafety(false);
    return self.root_ptr.shared_buffer.items.ptr + self.my_checkpoint + relative_offset;
}

/// Get const raw pointer to memory at context-relative offset.
/// WARNING: No bounds checking - caller must ensure offset is valid.
pub fn get_const_ptr_unsafe(self: *const Self, relative_offset: usize) [*]const u8 {
    @setRuntimeSafety(false);
    return self.root_ptr.shared_buffer.items.ptr + self.my_checkpoint + relative_offset;
}

/// Set bytes without bounds checking.
/// WARNING: No bounds checking - caller must ensure memory has sufficient size.
pub fn set_unsafe(self: *Self, relative_offset: usize, data: []const u8) void {
    @setRuntimeSafety(false);
    const abs_offset = self.my_checkpoint + relative_offset;
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + data.len], data);
}

// Utility Functions

/// Returns a hex string representation of the *current context's memory*.
pub fn to_hex(self: *const Self, output_allocator: std.mem.Allocator) MemoryError![]u8 {
    const ctx_slice = self.context_slice() catch return MemoryError.InvalidOffset;
    const hex_len = ctx_slice.len * 2;
    if (hex_len == 0) return output_allocator.alloc(u8, 0) catch return MemoryError.OutOfMemory;

    const hex_str = output_allocator.alloc(u8, hex_len) catch return MemoryError.OutOfMemory;
    for (ctx_slice, 0..) |byte, i| {
        _ = std.fmt.bufPrint(hex_str[i * 2 .. (i + 1) * 2], "{x:0>2}", .{byte}) catch unreachable;
    }
    return hex_str;
}

/// Creates a snapshot of the *current context's memory region*.
/// The snapshot is a copy and is independent of the Memory.
pub fn snapshot_context(self: *const Self, output_allocator: std.mem.Allocator) MemoryError![]u8 {
    const ctx_slice = self.context_slice() catch return MemoryError.InvalidOffset;
    const snap = output_allocator.alloc(u8, ctx_slice.len) catch return MemoryError.OutOfMemory;
    @memcpy(snap, ctx_slice);
    return snap;
}

/// Restores the *current context's memory region* from a snapshot.
/// This may resize the context.
pub fn restore_context(self: *Self, snapshot: []const u8) MemoryError!void {
    try self.resize_context(snapshot.len);
    const abs_offset_start = self.my_checkpoint;
    const abs_offset_end = self.my_checkpoint + snapshot.len;
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset_start..abs_offset_end], snapshot);
}

// Helper to get a slice of the current context's memory
fn context_slice(self: *const Self) MemoryError![]const u8 {
    const total_len = self.root_ptr.shared_buffer.items.len;
    if (self.my_checkpoint > total_len) return MemoryError.InvalidOffset;
    return self.root_ptr.shared_buffer.items[self.my_checkpoint..total_len];
}

// Aliases for API compatibility with existing Memory module
pub const size = context_size;
pub const is_empty = context_is_empty;

/// Check if context memory is empty.
pub fn context_is_empty(self: *const Self) bool {
    return self.context_size() == 0;
}

/// Resize memory (alias for resize_context for compatibility).
pub fn resize(self: *Self, new_size: usize) MemoryError!void {
    return self.resize_context(new_size);
}

/// Ensure capacity (alias for ensure_context_capacity for compatibility).
pub fn ensure_capacity(self: *Self, min_size: usize) MemoryError!u64 {
    return self.ensure_context_capacity(min_size);
}

/// Resize word aligned (alias for compatibility).
pub fn resize_word_aligned(self: *Self, min_size: usize) MemoryError!void {
    return self.resize_context_word_aligned(min_size);
}

/// Copy within memory (alias for copy method for backwards compatibility)
pub fn copy_within(self: *Self, src: usize, dest: usize, len: usize) MemoryError!void {
    return self.copy(dest, src, len);
}

/// Get total size of memory (context size)
pub fn total_size(self: *const Self) usize {
    return self.context_size();
}

/// Get a mutable slice to the entire memory buffer (context-relative)
pub fn slice(self: *Self) []u8 {
    const ctx_size = self.context_size();
    const abs_start = self.my_checkpoint;
    const abs_end = abs_start + ctx_size;
    return self.root_ptr.shared_buffer.items[abs_start..abs_end];
}
```
```zig [src/evm/stack_validation.zig]
const std = @import("std");
const Stack = @import("stack.zig");
const Operation = @import("operation.zig");
const ExecutionError = @import("execution_error.zig");

/// Stack validation utilities for EVM operations.
///
/// This module provides validation functions to ensure stack operations
/// will succeed before attempting them. This is crucial for:
/// - Preventing execution errors
/// - Enabling optimized unsafe operations after validation
/// - Maintaining EVM correctness
///
/// ## Validation Strategy
/// The EVM uses two-phase validation:
/// 1. Pre-execution validation (this module)
/// 2. Unsafe operations after validation passes
///
/// This allows opcodes to use fast unsafe operations in hot paths
/// while maintaining safety guarantees.
///
/// ## Stack Limits
/// The EVM enforces strict stack limits:
/// - Maximum depth: 1024 elements
/// - Underflow: Cannot pop from empty stack
/// - Overflow: Cannot exceed maximum depth
pub const ValidationPatterns = @import("validation_patterns.zig");

/// Validates stack requirements using Operation metadata.
///
/// Each EVM operation has min_stack and max_stack requirements:
/// - min_stack: Minimum elements needed on stack
/// - max_stack: Maximum allowed before operation (to prevent overflow)
///
/// @param stack The stack to validate
/// @param operation The operation with stack requirements
/// @throws StackUnderflow if stack has fewer than min_stack elements
/// @throws StackOverflow if stack has more than max_stack elements
///
/// Example:
/// ```zig
/// // Validate before executing an opcode
/// try validate_stack_requirements(&frame.stack, &operation);
/// // Safe to use unsafe operations now
/// operation.execute(&frame);
/// ```
pub fn validate_stack_requirements(
    stack: *const Stack,
    operation: *const Operation,
) ExecutionError.Error!void {
    const stack_size = stack.size;

    // Check minimum stack requirement
    if (stack_size < operation.min_stack) return ExecutionError.Error.StackUnderflow;

    // Check maximum stack requirement
    // max_stack represents the maximum stack size allowed BEFORE the operation
    // to ensure we don't overflow after the operation completes
    if (stack_size > operation.max_stack) return ExecutionError.Error.StackOverflow;
}

/// Validates stack has capacity for pop/push operations.
///
/// More flexible than validate_stack_requirements, this function
/// validates arbitrary pop/push counts. Used by:
/// - Dynamic operations (e.g., LOG with variable topics)
/// - Custom validation logic
/// - Testing and debugging
///
/// @param stack The stack to validate
/// @param pop_count Number of elements to pop
/// @param push_count Number of elements to push
/// @throws StackUnderflow if stack has < pop_count elements
/// @throws StackOverflow if operation would exceed capacity
///
/// Example:
/// ```zig
/// // Validate LOG3 operation (pops 5, pushes 0)
/// try validate_stack_operation(&stack, 5, 0);
/// ```
pub fn validate_stack_operation(
    stack: *const Stack,
    pop_count: u32,
    push_count: u32,
) ExecutionError.Error!void {
    const stack_size = stack.size;

    // Check if we have enough items to pop
    if (stack_size < pop_count) return ExecutionError.Error.StackUnderflow;

    // Calculate stack size after operation
    const new_size = stack_size - pop_count + push_count;

    // Check if result would overflow
    if (new_size > Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
}

/// Calculate the maximum allowed stack size for an operation.
///
/// The max_stack value ensures that after an operation completes,
/// the stack won't exceed capacity. This is calculated as:
/// - If operation grows stack: CAPACITY - net_growth
/// - If operation shrinks/neutral: CAPACITY
///
/// @param pop_count Number of elements operation pops
/// @param push_count Number of elements operation pushes
/// @return Maximum allowed stack size before operation
///
/// Example:
/// ```zig
/// // PUSH1 operation (pop 0, push 1)
/// const max = calculate_max_stack(0, 1); // Returns 1023
/// // Stack must have <= 1023 elements before PUSH1
/// ```
pub fn calculate_max_stack(pop_count: u32, push_count: u32) u32 {
    if (push_count > pop_count) {
        const net_growth = push_count - pop_count;
        return @intCast(Stack.CAPACITY - net_growth);
    }
    // If operation reduces stack or is neutral, max is CAPACITY
    return Stack.CAPACITY;
}


// Tests
const testing = std.testing;

test "validate_stack_requirements" {
    var stack = Stack{};

    // Test underflow
    const op_needs_2 = Operation{
        .execute = undefined,
        .constant_gas = 3,
        .min_stack = 2,
        .max_stack = Stack.CAPACITY - 1,
    };

    try testing.expectError(ExecutionError.Error.StackUnderflow, validate_stack_requirements(&stack, &op_needs_2));

    // Add items and test success
    try stack.append(1);
    try stack.append(2);
    try validate_stack_requirements(&stack, &op_needs_2);

    // Test overflow
    const op_max_10 = Operation{
        .execute = undefined,
        .constant_gas = 3,
        .min_stack = 0,
        .max_stack = 10,
    };

    // Fill stack beyond max_stack
    var i: usize = 2;
    while (i < 11) : (i += 1) {
        try stack.append(@intCast(i));
    }

    try testing.expectError(ExecutionError.Error.StackOverflow, validate_stack_requirements(&stack, &op_max_10));
}

test "validate_stack_operation" {
    var stack = Stack{};

    // Test underflow
    try testing.expectError(ExecutionError.Error.StackUnderflow, validate_stack_operation(&stack, 2, 1));

    // Add items
    try stack.append(10);
    try stack.append(20);

    // Binary op should succeed
    try validate_stack_operation(&stack, 2, 1);

    // Test overflow - fill stack almost to capacity
    stack.size = Stack.CAPACITY - 1;

    // Operation that would overflow
    try testing.expectError(ExecutionError.Error.StackOverflow, validate_stack_operation(&stack, 0, 2));
}

test "calculate_max_stack" {
    // Binary operations (pop 2, push 1) - net decrease of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY), calculate_max_stack(2, 1));

    // Push operations (pop 0, push 1) - net increase of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), calculate_max_stack(0, 1));

    // DUP operations (pop 0, push 1) - net increase of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), calculate_max_stack(0, 1));

    // Operations that push more than pop
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 3), calculate_max_stack(1, 4));
}

test "ValidationPatterns" {
    var stack = Stack{};

    // Test binary op validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_binary_op(&stack));
    try stack.append(1);
    try stack.append(2);
    try ValidationPatterns.validate_binary_op(&stack);

    // Test DUP validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_dup(&stack, 3));
    try ValidationPatterns.validate_dup(&stack, 2);

    // Test SWAP validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_swap(&stack, 2));
    try ValidationPatterns.validate_swap(&stack, 1);

    // Test PUSH validation at capacity
    stack.size = Stack.CAPACITY;
    try testing.expectError(ExecutionError.Error.StackOverflow, ValidationPatterns.validate_push(&stack));
}
```
```zig [src/evm/jump_table.zig]
const std = @import("std");
const Opcode = @import("opcode.zig");
const Operation = @import("operation.zig");
const Hardfork = @import("hardfork.zig").Hardfork;
const ExecutionError = @import("execution_error.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");
const Frame = @import("frame.zig");
const Contract = @import("contract.zig");
const Address = @import("Address");
const Log = @import("log.zig");

const opcodes = @import("opcodes/package.zig");
const stack_ops = opcodes.stack;
const log = opcodes.log;
const operation_specs = @import("operation_specs.zig");

/// EVM jump table for efficient opcode dispatch.
///
/// The jump table is a critical performance optimization that maps opcodes
/// to their execution handlers. Instead of using a switch statement with
/// 256 cases, the jump table provides O(1) dispatch by indexing directly
/// into an array of function pointers.
///
/// ## Design Rationale
/// - Array indexing is faster than switch statement branching
/// - Cache-line alignment improves memory access patterns
/// - Hardfork-specific tables allow for efficient versioning
/// - Null entries default to UNDEFINED operation
///
/// ## Hardfork Evolution
/// The jump table evolves with each hardfork:
/// - New opcodes are added (e.g., PUSH0 in Shanghai)
/// - Gas costs change (e.g., SLOAD in Berlin)
/// - Opcodes are removed or modified
///
/// ## Performance Considerations
/// - 64-byte cache line alignment reduces cache misses
/// - Direct indexing eliminates branch prediction overhead
/// - Operation structs are immutable for thread safety
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// const opcode = bytecode[pc];
/// const operation = table.get_operation(opcode);
/// const result = try table.execute(pc, interpreter, state, opcode);
/// ```
const Self = @This();

/// CPU cache line size for optimal memory alignment.
/// Most modern x86/ARM processors use 64-byte cache lines.
const CACHE_LINE_SIZE = 64;

/// Array of operation handlers indexed by opcode value.
/// Aligned to cache line boundaries for optimal performance.
/// Null entries are treated as undefined opcodes.
table: [256]?*const Operation align(CACHE_LINE_SIZE),

/// CANCUN jump table, pre-generated at compile time.
/// This is the latest hardfork configuration.
pub const CANCUN = init_from_hardfork(.CANCUN);

/// Default jump table for the latest hardfork.
/// References CANCUN to avoid generating the same table twice.
/// This is what gets used when no jump table is specified.
pub const DEFAULT = CANCUN;

/// Create an empty jump table with all entries set to null.
///
/// This creates a blank jump table that must be populated with
/// operations before use. Typically, you'll want to use
/// init_from_hardfork() instead to get a pre-configured table.
///
/// @return An empty jump table
pub fn init() Self {
    return Self{
        .table = [_]?*const Operation{null} ** 256,
    };
}

/// Get the operation handler for a given opcode.
///
/// Returns the operation associated with the opcode, or the NULL
/// operation if the opcode is undefined in this jump table.
///
/// @param self The jump table
/// @param opcode The opcode byte value (0x00-0xFF)
/// @return Operation handler (never null)
///
/// Example:
/// ```zig
/// const op = table.get_operation(0x01); // Get ADD operation
/// ```
pub inline fn get_operation(self: *const Self, opcode: u8) *const Operation {
    return self.table[opcode] orelse &Operation.NULL;
}

/// Execute an opcode using the jump table.
///
/// This is the main dispatch function that:
/// 1. Looks up the operation for the opcode
/// 2. Validates stack requirements
/// 3. Consumes gas
/// 4. Executes the operation
///
/// @param self The jump table
/// @param pc Current program counter
/// @param interpreter VM interpreter context
/// @param state Execution state (cast to Frame internally)
/// @param opcode The opcode to execute
/// @return Execution result with gas consumed
/// @throws InvalidOpcode if opcode is undefined
/// @throws StackUnderflow/Overflow if validation fails
/// @throws OutOfGas if insufficient gas
///
/// Example:
/// ```zig
/// const result = try table.execute(pc, &interpreter, &state, bytecode[pc]);
/// ```
pub fn execute(self: *const Self, pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State, opcode: u8) ExecutionError.Error!Operation.ExecutionResult {
    const operation = self.get_operation(opcode);

    // Cast state to Frame to access gas_remaining and stack
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (operation.undefined) {
        frame.gas_remaining = 0;
        return ExecutionError.Error.InvalidOpcode;
    }

    const stack_validation = @import("stack_validation.zig");
    try stack_validation.validate_stack_requirements(&frame.stack, operation);

    if (operation.constant_gas > 0) {
        try frame.consume_gas(operation.constant_gas);
    }

    const res = try operation.execute(pc, interpreter, state);
    return res;
}

/// Validate and fix the jump table.
///
/// Ensures all entries are valid:
/// - Null entries are replaced with UNDEFINED operation
/// - Operations with memory_size must have dynamic_gas
/// - Invalid operations are logged and replaced
///
/// This should be called after manually constructing a jump table
/// to ensure it's safe for execution.
///
/// @param self The jump table to validate
pub fn validate(self: *Self) void {
    for (0..256) |i| {
        if (self.table[i] == null) {
            self.table[i] = &Operation.NULL;
        } else if (self.table[i].?.memory_size != null and self.table[i].?.dynamic_gas == null) {
            // Log error instead of panicking
            std.debug.print("Warning: Operation 0x{x} has memory size but no dynamic gas calculation\n", .{i});
            // Set to NULL to prevent issues
            self.table[i] = &Operation.NULL;
        }
    }
}

pub fn copy(self: *const Self, allocator: std.mem.Allocator) !Self {
    _ = allocator;
    return Self{
        .table = self.table,
    };
}

// Convenience functions for creating jump tables for specific hardforks
pub fn new_frontier_instruction_set() Self {
    return init_from_hardfork(.FRONTIER);
}

pub fn new_homestead_instruction_set() Self {
    return init_from_hardfork(.HOMESTEAD);
}

pub fn new_tangerine_whistle_instruction_set() Self {
    return init_from_hardfork(.TANGERINE_WHISTLE);
}

pub fn new_spurious_dragon_instruction_set() Self {
    return init_from_hardfork(.SPURIOUS_DRAGON);
}

pub fn new_byzantium_instruction_set() Self {
    return init_from_hardfork(.BYZANTIUM);
}

pub fn new_constantinople_instruction_set() Self {
    return init_from_hardfork(.CONSTANTINOPLE);
}

pub fn new_petersburg_instruction_set() Self {
    return init_from_hardfork(.PETERSBURG);
}

pub fn new_istanbul_instruction_set() Self {
    return init_from_hardfork(.ISTANBUL);
}

pub fn new_berlin_instruction_set() Self {
    return init_from_hardfork(.BERLIN);
}

pub fn new_london_instruction_set() Self {
    return init_from_hardfork(.LONDON);
}

pub fn new_merge_instruction_set() Self {
    return init_from_hardfork(.MERGE);
}

pub fn new_shanghai_instruction_set() Self {
    return init_from_hardfork(.SHANGHAI);
}

pub fn new_cancun_instruction_set() Self {
    return init_from_hardfork(.CANCUN);
}

/// Get the hardfork when an operation was introduced based on its variant.
fn get_operation_hardfork(variant: ?[]const u8) Hardfork {
    if (variant == null) return .FRONTIER;

    const v = variant.?;

    // Map variant string to hardfork enum
    if (std.mem.eql(u8, v, "FRONTIER")) {
        return .FRONTIER;
    } else if (std.mem.eql(u8, v, "HOMESTEAD")) {
        return .HOMESTEAD;
    } else if (std.mem.eql(u8, v, "TANGERINE_WHISTLE")) {
        return .TANGERINE_WHISTLE;
    } else if (std.mem.eql(u8, v, "SPURIOUS_DRAGON")) {
        return .SPURIOUS_DRAGON;
    } else if (std.mem.eql(u8, v, "BYZANTIUM")) {
        return .BYZANTIUM;
    } else if (std.mem.eql(u8, v, "CONSTANTINOPLE")) {
        return .CONSTANTINOPLE;
    } else if (std.mem.eql(u8, v, "PETERSBURG")) {
        return .PETERSBURG;
    } else if (std.mem.eql(u8, v, "ISTANBUL")) {
        return .ISTANBUL;
    } else if (std.mem.eql(u8, v, "BERLIN")) {
        return .BERLIN;
    } else if (std.mem.eql(u8, v, "LONDON")) {
        return .LONDON;
    } else if (std.mem.eql(u8, v, "MERGE")) {
        return .MERGE;
    } else if (std.mem.eql(u8, v, "SHANGHAI")) {
        return .SHANGHAI;
    } else if (std.mem.eql(u8, v, "CANCUN")) {
        return .CANCUN;
    }

    // Default to FRONTIER for unknown variants
    return .FRONTIER;
}

/// Create a jump table configured for a specific hardfork.
///
/// This is the primary way to create a jump table. It starts with
/// the Frontier base configuration and applies all changes up to
/// the specified hardfork.
///
/// @param hardfork The target hardfork configuration
/// @return A fully configured jump table
///
/// Hardfork progression:
/// - FRONTIER: Base EVM opcodes
/// - HOMESTEAD: DELEGATECALL
/// - TANGERINE_WHISTLE: Gas repricing (EIP-150)
/// - BYZANTIUM: REVERT, RETURNDATASIZE, STATICCALL
/// - CONSTANTINOPLE: CREATE2, SHL/SHR/SAR, EXTCODEHASH
/// - ISTANBUL: CHAINID, SELFBALANCE, more gas changes
/// - BERLIN: Access lists, cold/warm storage
/// - LONDON: BASEFEE
/// - SHANGHAI: PUSH0
/// - CANCUN: BLOBHASH, MCOPY, transient storage
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// // Table includes all opcodes through Cancun
/// ```
pub fn init_from_hardfork(hardfork: Hardfork) Self {
    @setEvalBranchQuota(10000);
    var jt = Self.init();

    // With ALL_OPERATIONS sorted by hardfork, we can iterate once.
    // Each opcode will be set to the latest active version for the target hardfork.
    inline for (operation_specs.ALL_OPERATIONS) |spec| {
        const op_hardfork = get_operation_hardfork(spec.variant);
        if (@intFromEnum(op_hardfork) <= @intFromEnum(hardfork)) {
            const op = struct {
                pub const operation = operation_specs.generate_operation(spec);
            };
            jt.table[spec.opcode] = &op.operation;
        }
    }

    // Dynamic operations are still generated inline

    // 0x60s & 0x70s: Push operations
    inline for (0..32) |i| {
        const n = i + 1;
        jt.table[0x60 + i] = &Operation{
            .execute = stack_ops.make_push(n),
            .constant_gas = opcodes.gas_constants.GasFastestStep,
            .min_stack = 0,
            .max_stack = Stack.CAPACITY - 1,
        };
    }

    // 0x80s: Duplication Operations
    inline for (1..17) |n| {
        jt.table[0x80 + n - 1] = &Operation{
            .execute = stack_ops.make_dup(n),
            .constant_gas = opcodes.gas_constants.GasFastestStep,
            .min_stack = @intCast(n),
            .max_stack = Stack.CAPACITY - 1,
        };
    }

    // 0x90s: Exchange Operations
    inline for (1..17) |n| {
        jt.table[0x90 + n - 1] = &Operation{
            .execute = stack_ops.make_swap(n),
            .constant_gas = opcodes.gas_constants.GasFastestStep,
            .min_stack = @intCast(n + 1),
            .max_stack = Stack.CAPACITY,
        };
    }

    // 0xa0s: Logging Operations
    inline for (0..5) |n| {
        jt.table[0xa0 + n] = &Operation{
            .execute = log.make_log(n),
            .constant_gas = opcodes.gas_constants.LogGas + opcodes.gas_constants.LogTopicGas * n,
            .min_stack = @intCast(n + 2),
            .max_stack = Stack.CAPACITY,
        };
    }

    jt.validate();

    return jt;
}
```
```zig [src/evm/access_list_storage_key.zig]
const std = @import("std");
const Address = @import("Address");

/// Storage slot key combining address and slot for access list operations
/// This version provides direct hash output for use with HashMap
const Self = @This();

address: Address.Address,
slot: u256,

pub fn hash(self: Self) u64 {
    var hasher = std.hash.Wyhash.init(0);
    hasher.update(&self.address);
    hasher.update(std.mem.asBytes(&self.slot));
    return hasher.final();
}

pub fn eql(self: Self, other: Self) bool {
    return std.mem.eql(u8, &self.address, &other.address) and self.slot == other.slot;
}
```
```zig [src/evm/code_analysis.zig]
const std = @import("std");
const bitvec = @import("bitvec.zig");

/// Advanced code analysis for EVM bytecode optimization.
///
/// This structure holds pre-computed analysis results for a contract's bytecode,
/// enabling efficient execution by pre-identifying jump destinations, code segments,
/// and other properties that would otherwise need to be computed at runtime.
///
/// The analysis is performed once when a contract is first loaded and cached for
/// subsequent executions, significantly improving performance for frequently-used
/// contracts.
///
/// ## Fields
/// - `code_segments`: Bit vector marking which bytes are executable code vs data
/// - `jumpdest_positions`: Sorted array of valid JUMPDEST positions for O(log n) validation
/// - `block_gas_costs`: Optional pre-computed gas costs for basic blocks
/// - `max_stack_depth`: Maximum stack depth required by the contract
/// - `has_dynamic_jumps`: Whether the code contains JUMP/JUMPI with dynamic targets
/// - `has_static_jumps`: Whether the code contains JUMP/JUMPI with static targets
/// - `has_selfdestruct`: Whether the code contains SELFDESTRUCT opcode
/// - `has_create`: Whether the code contains CREATE/CREATE2 opcodes
///
/// ## Performance
/// - Jump destination validation: O(log n) using binary search
/// - Code segment checking: O(1) using bit vector
/// - Enables dead code elimination and other optimizations
///
/// ## Memory Management
/// The analysis owns its allocated memory and must be properly cleaned up
/// using the `deinit` method to prevent memory leaks.
const Self = @This();

/// Bit vector marking which bytes in the bytecode are executable code vs data.
/// 
/// Each bit corresponds to a byte in the contract bytecode:
/// - 1 = executable code byte
/// - 0 = data byte (e.g., PUSH arguments)
///
/// This is critical for JUMPDEST validation since jump destinations
/// must point to actual code, not data bytes within PUSH instructions.
code_segments: bitvec,

/// Sorted array of all valid JUMPDEST positions in the bytecode.
///
/// Pre-sorted to enable O(log n) binary search validation of jump targets.
/// Only positions marked as code (not data) and containing the JUMPDEST
/// opcode (0x5B) are included.
jumpdest_positions: []const u32,

/// Optional pre-computed gas costs for each basic block.
///
/// When present, enables advanced gas optimization by pre-calculating
/// the gas cost of straight-line code sequences between jumps.
/// This is an optional optimization that may not be computed for all contracts.
block_gas_costs: ?[]const u32,

/// Maximum stack depth required by any execution path in the contract.
///
/// Pre-computed through static analysis to enable early detection of
/// stack overflow conditions. A value of 0 indicates the depth wasn't analyzed.
max_stack_depth: u16,

/// Indicates whether the contract contains JUMP/JUMPI opcodes with dynamic targets.
///
/// Dynamic jumps (where the target is computed at runtime) prevent certain
/// optimizations and require full jump destination validation at runtime.
has_dynamic_jumps: bool,

/// Indicates whether the contract contains JUMP/JUMPI opcodes with static targets.
///
/// Static jumps (where the target is a constant) can be pre-validated
/// and optimized during analysis.
has_static_jumps: bool,

/// Indicates whether the contract contains the SELFDESTRUCT opcode (0xFF).
///
/// Contracts with SELFDESTRUCT require special handling for state management
/// and cannot be marked as "pure" or side-effect free.
has_selfdestruct: bool,

/// Indicates whether the contract contains CREATE or CREATE2 opcodes.
///
/// Contracts that can deploy other contracts require additional
/// gas reservation and state management considerations.
has_create: bool,

/// Releases all memory allocated by this code analysis.
///
/// This method must be called when the analysis is no longer needed to prevent
/// memory leaks. It safely handles all owned resources including:
/// - The code segments bit vector
/// - The jumpdest positions array
/// - The optional block gas costs array
///
/// ## Parameters
/// - `self`: The analysis instance to clean up
/// - `allocator`: The same allocator used to create the analysis resources
///
/// ## Safety
/// After calling deinit, the analysis instance should not be used again.
/// All pointers to analysis data become invalid.
///
/// ## Example
/// ```zig
/// var analysis = try analyzeCode(allocator, bytecode);
/// defer analysis.deinit(allocator);
/// ```
pub fn deinit(self: *Self, allocator: std.mem.Allocator) void {
    self.code_segments.deinit(allocator);
    if (self.jumpdest_positions.len > 0) {
        allocator.free(self.jumpdest_positions);
    }
    if (self.block_gas_costs) |costs| {
        allocator.free(costs);
    }
}
```
```zig [src/evm/stack.zig]
const std = @import("std");

/// High-performance EVM stack implementation with fixed capacity.
///
/// The Stack is a core component of the EVM execution model, providing a
/// Last-In-First-Out (LIFO) data structure for 256-bit values. All EVM
/// computations operate on this stack, making its performance critical.
///
/// ## Design Rationale
/// - Fixed capacity of 1024 elements (per EVM specification)
/// - 32-byte alignment for optimal memory access on modern CPUs
/// - Separate safe and unsafe variants of operations for flexibility
/// - Batched operations for common patterns (pop2_push1, etc.)
///
/// ## EVM Stack Model
/// The EVM uses a stack-based execution model where:
/// - Most operations pop operands from the stack and push results
/// - Stack depth is limited to 1024 to prevent DoS attacks
/// - Stack underflow/overflow are execution errors
/// - DUP and SWAP operations allow stack manipulation
///
/// ## Performance Optimizations
/// - Aligned memory for SIMD-friendly access patterns
/// - Unsafe variants skip bounds checking in hot paths
/// - Batched operations reduce function call overhead
/// - Specialized variants for common operations (DUP1, SWAP1)
///
/// ## Safety Model
/// All operations have two variants:
/// - Safe: Returns errors on invalid operations
/// - Unsafe: Assumes preconditions are met (used after validation)
///
/// Example:
/// ```zig
/// var stack = Stack{};
/// try stack.append(100); // Safe variant
/// stack.append_unsafe(200); // Unsafe variant (faster)
/// ```
const Self = @This();

/// Maximum stack capacity as defined by the EVM specification.
/// This limit prevents stack-based DoS attacks.
pub const CAPACITY: usize = 1024;

/// Error types for stack operations.
/// These map directly to EVM execution errors.
pub const Error = error{
    /// Stack would exceed 1024 elements
    Overflow,
    /// Attempted to pop from empty stack
    Underflow,
    /// Index out of valid range
    OutOfBounds,
    /// Invalid position for DUP/SWAP (must be 1-16)
    InvalidPosition,
};

/// Stack storage aligned to 32-byte boundaries.
/// Alignment improves performance on modern CPUs by:
/// - Enabling SIMD operations
/// - Reducing cache line splits
/// - Improving memory prefetching
data: [CAPACITY]u256 align(32) = [_]u256{0} ** CAPACITY,

/// Current number of elements on the stack.
/// Invariant: 0 <= size <= CAPACITY
size: usize = 0,

/// Create a new stack from a slice of values.
///
/// Useful for testing and initializing stacks with predefined values.
/// Values are pushed in order, so values[0] will be deepest in stack.
///
/// @param values The values to initialize the stack with
/// @return A new stack containing the values
/// @throws Overflow if values.len > CAPACITY
///
/// Example:
/// ```zig
/// const values = [_]u256{10, 20, 30};
/// const stack = try Stack.from_slice(&values);
/// // Stack: [10, 20, 30] with 30 on top
/// ```
pub inline fn from_slice(values: []const u256) Error!Self {
    var stack = Self{};
    for (values) |value| {
        try stack.append(value);
    }
    return stack;
}

/// Push a value onto the stack (safe version).
///
/// @param self The stack to push onto
/// @param value The 256-bit value to push
/// @throws Overflow if stack is at capacity
///
/// Example:
/// ```zig
/// try stack.append(0x1234);
/// ```
pub inline fn append(self: *Self, value: u256) Error!void {
    if (self.size >= CAPACITY) return Error.Overflow;
    self.data[self.size] = value;
    self.size += 1;
}

/// Push a value onto the stack (unsafe version).
///
/// Caller must ensure stack has capacity. Used in hot paths
/// after validation has already been performed.
///
/// @param self The stack to push onto
/// @param value The 256-bit value to push
pub inline fn append_unsafe(self: *Self, value: u256) void {
    self.data[self.size] = value;
    self.size += 1;
}

/// Alias for append_unsafe (camelCase compatibility).
pub inline fn appendUnsafe(self: *Self, value: u256) void {
    self.append_unsafe(value);
}

/// Pop a value from the stack (safe version).
///
/// Removes and returns the top element. Clears the popped
/// slot to prevent information leakage.
///
/// @param self The stack to pop from
/// @return The popped value
/// @throws Underflow if stack is empty
///
/// Example:
/// ```zig
/// const value = try stack.pop();
/// ```
pub inline fn pop(self: *Self) Error!u256 {
    if (self.size == 0) return Error.Underflow;
    self.size -= 1;
    const value = self.data[self.size];
    self.data[self.size] = 0;
    return value;
}

/// Pop a value from the stack (unsafe version).
///
/// Caller must ensure stack is not empty. Used in hot paths
/// after validation.
///
/// @param self The stack to pop from
/// @return The popped value
pub inline fn pop_unsafe(self: *Self) u256 {
    self.size -= 1;
    const value = self.data[self.size];
    self.data[self.size] = 0;
    return value;
}

pub inline fn popUnsafe(self: *Self) u256 {
    return self.pop_unsafe();
}

/// Peek at the top value without removing it (safe version).
///
/// @param self The stack to peek at
/// @return Pointer to the top value
/// @throws OutOfBounds if stack is empty
///
/// Example:
/// ```zig
/// const top = try stack.peek();
/// std.debug.print("Top value: {}", .{top.*});
/// ```
pub inline fn peek(self: *const Self) Error!*const u256 {
    if (self.size == 0) return Error.OutOfBounds;
    return &self.data[self.size - 1];
}

/// Peek at the top value without removing it (unsafe version).
///
/// Caller must ensure stack is not empty.
///
/// @param self The stack to peek at
/// @return Pointer to the top value
pub inline fn peek_unsafe(self: *const Self) *const u256 {
    return &self.data[self.size - 1];
}

pub inline fn peekUnsafe(self: *const Self) *const u256 {
    return self.peek_unsafe();
}

/// Check if the stack is empty.
///
/// @param self The stack to check
/// @return true if stack has no elements
pub inline fn is_empty(self: *const Self) bool {
    return self.size == 0;
}

pub inline fn isEmpty(self: *const Self) bool {
    return self.is_empty();
}

/// Check if the stack is at capacity.
///
/// @param self The stack to check
/// @return true if stack has 1024 elements
pub inline fn is_full(self: *const Self) bool {
    return self.size == CAPACITY;
}

pub inline fn isFull(self: *const Self) bool {
    return self.is_full();
}

/// Get value at position n from the top (0-indexed).
///
/// back(0) returns the top element, back(1) returns second from top, etc.
///
/// @param self The stack to access
/// @param n Position from top (0-indexed)
/// @return The value at position n
/// @throws OutOfBounds if n >= stack size
///
/// Example:
/// ```zig
/// // Stack: [10, 20, 30] with 30 on top
/// const top = try stack.back(0); // Returns 30
/// const second = try stack.back(1); // Returns 20
/// ```
pub inline fn back(self: *const Self, n: usize) Error!u256 {
    if (n >= self.size) return Error.OutOfBounds;
    return self.data[self.size - n - 1];
}

pub inline fn back_unsafe(self: *const Self, n: usize) u256 {
    return self.data[self.size - n - 1];
}

pub inline fn backUnsafe(self: *const Self, n: usize) u256 {
    return self.back_unsafe(n);
}

pub inline fn peek_n(self: *const Self, n: usize) Error!u256 {
    if (n >= self.size) return Error.OutOfBounds;
    return self.data[self.size - n - 1];
}

pub inline fn peekN(self: *const Self, n: usize) Error!u256 {
    return self.peek_n(n);
}

pub inline fn peek_n_unsafe(self: *const Self, n: usize) Error!u256 {
    return self.data[self.size - n - 1];
}

/// Swap the top element with the nth element (1-indexed).
///
/// SWAP1 swaps top two elements, SWAP2 swaps top with 3rd, etc.
/// Limited to SWAP1 through SWAP16 per EVM specification.
///
/// @param self The stack to operate on
/// @param n Position to swap with (1-16)
/// @throws InvalidPosition if n is 0 or > 16
/// @throws OutOfBounds if stack has <= n elements
///
/// Example:
/// ```zig
/// // Stack: [10, 20, 30, 40] with 40 on top
/// try stack.swap(2); // SWAP2
/// // Stack: [10, 40, 30, 20] with 20 on top
/// ```
pub inline fn swap(self: *Self, n: usize) Error!void {
    if (n == 0 or n > 16) return Error.InvalidPosition;
    if (self.size <= n) return Error.OutOfBounds;
    std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
}

pub inline fn swap_unsafe(self: *Self, n: usize) Error!void {
    std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
}

pub inline fn swapUnsafe(self: *Self, n: usize) void {
    std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
}

pub inline fn swap_n(self: *Self, comptime N: usize) Error!void {
    if (N == 0 or N > 16) @compileError("Invalid swap position");
    if (self.size <= N) return Error.OutOfBounds;
    const top_idx = self.size - 1;
    const swap_idx = self.size - N - 1;
    std.mem.swap(@TypeOf(self.data[0]), &self.data[top_idx], &self.data[swap_idx]);
}

pub inline fn swapN(self: *Self, n: usize) Error!void {
    return self.swap(n);
}

pub inline fn swap_n_unsafe(self: *Self, comptime N: usize) void {
    if (N == 0 or N > 16) @compileError("Invalid swap position");
    @setRuntimeSafety(false);
    // Unsafe: No bounds checking - caller must ensure self.size > N
    const top_idx = self.size - 1;
    const swap_idx = self.size - N - 1;
    const temp = self.data[top_idx];
    self.data[top_idx] = self.data[swap_idx];
    self.data[swap_idx] = temp;
}

pub inline fn swapNUnsafe(self: *Self, n: usize) void {
    const top_idx = self.size - 1;
    const swap_idx = self.size - n - 1;
    std.mem.swap(u256, &self.data[top_idx], &self.data[swap_idx]);
}

/// Duplicate the nth element onto the top of stack (1-indexed).
///
/// DUP1 duplicates the top element, DUP2 duplicates the 2nd, etc.
/// Limited to DUP1 through DUP16 per EVM specification.
///
/// @param self The stack to operate on
/// @param n Position to duplicate from (1-16)
/// @throws InvalidPosition if n is 0 or > 16
/// @throws OutOfBounds if stack has < n elements
/// @throws Overflow if stack is at capacity
///
/// Example:
/// ```zig
/// // Stack: [10, 20, 30] with 30 on top
/// try stack.dup(2); // DUP2
/// // Stack: [10, 20, 30, 20] with 20 on top
/// ```
pub inline fn dup(self: *Self, n: usize) Error!void {
    if (n == 0 or n > 16) return Error.InvalidPosition;
    if (n > self.size) return Error.OutOfBounds;
    if (self.size >= CAPACITY) return Error.Overflow;
    try self.append(self.data[self.size - n]);
}

pub inline fn dup_unsafe(self: *Self, n: usize) void {
    self.append_unsafe(self.data[self.size - n]);
}

pub inline fn dupUnsafe(self: *Self, n: usize) void {
    self.dup_unsafe(n);
}

pub inline fn dup_n(self: *Self, comptime N: usize) Error!void {
    if (N == 0 or N > 16) @compileError("Invalid dup position");
    if (N > self.size) return Error.OutOfBounds;
    if (self.size >= CAPACITY) return Error.Overflow;
    try self.append(self.data[self.size - N]);
}

pub inline fn dupN(self: *Self, n: usize) Error!void {
    return self.dup(n);
}

pub inline fn dup_n_unsafe(self: *Self, comptime N: usize) void {
    if (N == 0 or N > 16) @compileError("Invalid dup position");
    @setRuntimeSafety(false);
    // Unsafe: No bounds checking - caller must ensure N <= self.size and self.size < CAPACITY
    self.append_unsafe(self.data[self.size - N]);
}

pub inline fn dupNUnsafe(self: *Self, n: usize) void {
    self.append_unsafe(self.data[self.size - n]);
}

pub inline fn pop_n(self: *Self, comptime N: usize) Error![N]u256 {
    if (self.size < N) return Error.OutOfBounds;

    self.size -= N;
    var result: [N]u256 = undefined;

    inline for (0..N) |i| {
        result[i] = self.data[self.size + i];
        // Can consider not clearing here for perf
        self.data[self.size + i] = 0;
    }

    return result;
}

pub inline fn popn(self: *Self, n: usize) Error![]u256 {
    if (self.size < n) return Error.OutOfBounds;

    self.size -= n;
    const result = self.data[self.size .. self.size + n];

    return result;
}

/// Pop N values and return reference to new top (for opcodes that pop N and push 1)
pub inline fn pop_n_top(self: *Self, comptime N: usize) Error!struct {
    values: [N]u256,
    top: *u256,
} {
    if (self.size <= N) return Error.OutOfBounds;
    const values = try self.pop_n(N);
    return .{ .values = values, .top = &self.data[self.size - 1] };
}

pub inline fn popn_top(self: *Self, n: usize) Error!struct {
    values: []u256,
    top: *u256,
} {
    if (self.size <= n) return Error.OutOfBounds;
    const values = try self.popn(n);
    return .{ .values = values, .top = &self.data[self.size - 1] };
}

// EIP-663 operations

/// DUPN - duplicate Nth element (dynamic N from bytecode)
pub inline fn dup_n_dynamic(self: *Self, n: u8) Error!void {
    if (n == 0) return Error.InvalidPosition;
    const idx = @as(usize, n);
    if (idx > self.size) return Error.OutOfBounds;
    if (self.size >= CAPACITY) return Error.Overflow;
    try self.append(self.data[self.size - idx]);
}

pub inline fn dupn(self: *Self, n: usize) Error!void {
    return self.dup(n);
}

/// SWAPN - swap top with Nth element (dynamic N from bytecode)
pub inline fn swap_n_dynamic(self: *Self, n: u8) Error!void {
    // EIP-663: swap the top element with the one at `depth + 1`
    if (n >= self.size) return Error.OutOfBounds;
    const last = self.size - 1;
    std.mem.swap(
        u256,
        &self.data[last],
        &self.data[last - n],
    );
}

pub inline fn swapn(self: *Self, n: usize) Error!void {
    return self.swap(n);
}

pub inline fn exchange(self: *Self, n: u8, m: u8) Error!void {
    if (m == 0) return Error.InvalidPosition;

    const n_idx = @as(usize, n) + 1;
    const m_idx = n_idx + @as(usize, m);

    if (m_idx > self.size) return Error.OutOfBounds;

    std.mem.swap(u256, &self.data[n_idx], &self.data[m_idx]);
}

/// Clear all elements from the stack.
///
/// Resets size to 0 and zeroes memory to prevent information leakage.
/// The zeroing can be removed for performance if security is not a concern.
///
/// @param self The stack to clear
pub inline fn clear(self: *Self) void {
    self.size = 0;
    @memset(&self.data, 0); // could consider removing for perf
}

pub inline fn to_slice(self: *const Self) []const u256 {
    return self.data[0..self.size];
}

pub inline fn toSlice(self: *const Self) []const u256 {
    return self.to_slice();
}

/// Check if a stack operation would succeed.
///
/// Validates that the stack has enough elements to pop and enough
/// capacity for the pushes. Used by opcodes to pre-validate operations.
///
/// @param self The stack to check
/// @param pop_count Number of elements that will be popped
/// @param push_count Number of elements that will be pushed
/// @return true if operation would succeed
///
/// Example:
/// ```zig
/// // Check if we can do a binary operation (pop 2, push 1)
/// if (stack.check_requirements(2, 1)) {
///     // Safe to proceed
/// }
/// ```
pub inline fn check_requirements(self: *const Self, pop_count: usize, push_count: usize) bool {
    return self.size >= pop_count and (self.size - pop_count + push_count) <= CAPACITY;
}

pub inline fn checkRequirements(self: *const Self, pop_count: usize, push_count: usize) bool {
    return self.check_requirements(pop_count, push_count);
}

// Batched operations for performance optimization

/// Batched operation: pop 2 values and push 1 result.
///
/// Optimized for binary operations (ADD, MUL, etc.) that consume two
/// operands and produce one result. Reduces overhead by combining
/// operations into a single function.
///
/// @param self The stack to operate on
/// @param result The value to push after popping
/// @return The two popped values
/// @throws OutOfBounds if stack has < 2 elements
///
/// Example:
/// ```zig
/// // Implementing ADD operation
/// const operands = try stack.pop2_push1(a_plus_b);
/// // operands.a and operands.b contain the popped values
/// ```
pub inline fn pop2_push1(self: *Self, result: u256) Error!struct { a: u256, b: u256 } {
    if (self.size < 2) return Error.OutOfBounds;

    // Pop two values
    self.size -= 2;
    const a = self.data[self.size];
    const b = self.data[self.size + 1];

    // Push result (reuses first popped slot)
    self.data[self.size] = result;
    self.size += 1;

    return .{ .a = a, .b = b };
}

/// Pop 2 values and push 1 result (unsafe version for hot paths)
pub inline fn pop2_push1_unsafe(self: *Self, result: u256) struct { a: u256, b: u256 } {
    @setRuntimeSafety(false);

    self.size -= 2;
    const a = self.data[self.size];
    const b = self.data[self.size + 1];

    self.data[self.size] = result;
    self.size += 1;

    return .{ .a = a, .b = b };
}

/// Pop 3 values and push 1 result - common for ternary operations
pub inline fn pop3_push1(self: *Self, result: u256) Error!struct { a: u256, b: u256, c: u256 } {
    if (self.size < 3) return Error.OutOfBounds;

    self.size -= 3;
    const a = self.data[self.size];
    const b = self.data[self.size + 1];
    const c = self.data[self.size + 2];

    self.data[self.size] = result;
    self.size += 1;

    return .{ .a = a, .b = b, .c = c };
}

/// Pop 3 values and push 1 result (unsafe version)
pub inline fn pop3_push1_unsafe(self: *Self, result: u256) struct { a: u256, b: u256, c: u256 } {
    @setRuntimeSafety(false);

    self.size -= 3;
    const a = self.data[self.size];
    const b = self.data[self.size + 1];
    const c = self.data[self.size + 2];

    self.data[self.size] = result;
    self.size += 1;

    return .{ .a = a, .b = b, .c = c };
}

/// Pop 1 value and push 1 result - for unary operations
pub inline fn pop1_push1(self: *Self, result: u256) Error!u256 {
    if (self.size < 1) return Error.OutOfBounds;

    const value = self.data[self.size - 1];
    self.data[self.size - 1] = result;

    return value;
}

/// Pop 1 value and push 1 result (unsafe version)
pub inline fn pop1_push1_unsafe(self: *Self, result: u256) u256 {
    @setRuntimeSafety(false);

    const value = self.data[self.size - 1];
    self.data[self.size - 1] = result;

    return value;
}

/// Pop 2 values without pushing - for comparison operations
pub inline fn pop2(self: *Self) Error!struct { a: u256, b: u256 } {
    if (self.size < 2) return Error.OutOfBounds;

    self.size -= 2;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
    };
}

/// Pop 2 values without pushing (unsafe version)
pub inline fn pop2_unsafe(self: *Self) struct { a: u256, b: u256 } {
    @setRuntimeSafety(false);

    self.size -= 2;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
    };
}

/// Pop 3 values without pushing - for memory operations
pub inline fn pop3(self: *Self) Error!struct { a: u256, b: u256, c: u256 } {
    if (self.size < 3) return Error.OutOfBounds;

    self.size -= 3;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
        .c = self.data[self.size + 2],
    };
}

/// Pop 3 values without pushing (unsafe version)
pub inline fn pop3_unsafe(self: *Self) struct { a: u256, b: u256, c: u256 } {
    @setRuntimeSafety(false);

    self.size -= 3;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
        .c = self.data[self.size + 2],
    };
}

/// Optimized implementation of SWAP1 operation.
///
/// SWAP1 is the most common swap operation, so this specialized
/// version avoids the generic swap overhead. Manually unrolled
/// for maximum performance.
///
/// @param self The stack to operate on
/// @throws OutOfBounds if stack has < 2 elements
///
/// Example:
/// ```zig
/// // Stack: [10, 20] with 20 on top
/// try stack.swap1_optimized();
/// // Stack: [20, 10] with 10 on top
/// ```
pub inline fn swap1_optimized(self: *Self) Error!void {
    if (self.size < 2) return Error.OutOfBounds;

    const top_idx = self.size - 1;
    const second_idx = self.size - 2;

    const temp = self.data[top_idx];
    self.data[top_idx] = self.data[second_idx];
    self.data[second_idx] = temp;
}

/// Optimized implementation of DUP1 operation.
///
/// DUP1 is the most common duplication operation, so this specialized
/// version avoids the generic dup overhead. Directly copies the top
/// element.
///
/// @param self The stack to operate on
/// @throws OutOfBounds if stack is empty
/// @throws Overflow if stack is at capacity
///
/// Example:
/// ```zig
/// // Stack: [10, 20] with 20 on top
/// try stack.dup1_optimized();
/// // Stack: [10, 20, 20] with 20 on top
/// ```
pub inline fn dup1_optimized(self: *Self) Error!void {
    if (self.size == 0) return Error.OutOfBounds;
    if (self.size >= CAPACITY) return Error.Overflow;

    self.data[self.size] = self.data[self.size - 1];
    self.size += 1;
}

/// Batch push multiple values
pub inline fn push_batch(self: *Self, values: []const u256) Error!void {
    if (self.size + values.len > CAPACITY) return Error.Overflow;

    @memcpy(self.data[self.size .. self.size + values.len], values);
    self.size += values.len;
}

/// Get multiple top values without popping (for opcodes that need to peek at multiple values)
pub inline fn peek_multiple(self: *const Self, comptime N: usize) Error![N]u256 {
    if (self.size < N) return Error.OutOfBounds;

    var result: [N]u256 = undefined;
    inline for (0..N) |i| {
        result[i] = self.data[self.size - N + i];
    }
    return result;
}

pub inline fn set_top_unsafe(self: *Self, value: u256) void {
    // @setRuntimeSafety(false); // Removed as per user feedback
    // Assumes stack is not empty; this should be guaranteed by jump_table validation
    // for opcodes that use this pattern (e.g., after a pop and peek on a stack with >= 2 items).
    self.data[self.size - 1] = value;
}

pub inline fn set_top_two_unsafe(self: *Self, top: u256, second: u256) void {
    // Assumes stack has at least 2 elements; this should be guaranteed by jump_table validation
    self.data[self.size - 1] = top;
    self.data[self.size - 2] = second;
}
```
```zig [src/evm/operation_specs.zig]
const std = @import("std");
const opcodes = @import("opcodes/package.zig");
const gas_constants = @import("gas_constants.zig");
const Stack = @import("stack.zig");
const Operation = @import("operation.zig");

/// Specification for an EVM operation.
/// This data structure allows us to define all operations in a single place
/// and generate the Operation structs at compile time.
pub const OpSpec = struct {
    /// Operation name (e.g., "ADD", "MUL")
    name: []const u8,
    /// Opcode byte value (0x00-0xFF)
    opcode: u8,
    /// Execution function
    execute: Operation.ExecutionFunc,
    /// Base gas cost
    gas: u64,
    /// Minimum stack items required
    min_stack: u32,
    /// Maximum stack size allowed (usually Stack.CAPACITY or Stack.CAPACITY - 1)
    max_stack: u32,
    /// Optional: for hardfork variants, specify which variant this is
    variant: ?[]const u8 = null,
};

/// Complete specification of all EVM opcodes.
/// This replaces the scattered Operation definitions across multiple files.
pub const ALL_OPERATIONS = [_]OpSpec{
    // 0x00s: Stop and Arithmetic Operations
    .{ .name = "STOP", .opcode = 0x00, .execute = opcodes.control.op_stop, .gas = 0, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "ADD", .opcode = 0x01, .execute = opcodes.arithmetic.op_add, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MUL", .opcode = 0x02, .execute = opcodes.arithmetic.op_mul, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SUB", .opcode = 0x03, .execute = opcodes.arithmetic.op_sub, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "DIV", .opcode = 0x04, .execute = opcodes.arithmetic.op_div, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SDIV", .opcode = 0x05, .execute = opcodes.arithmetic.op_sdiv, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MOD", .opcode = 0x06, .execute = opcodes.arithmetic.op_mod, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SMOD", .opcode = 0x07, .execute = opcodes.arithmetic.op_smod, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "ADDMOD", .opcode = 0x08, .execute = opcodes.arithmetic.op_addmod, .gas = gas_constants.GasMidStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "MULMOD", .opcode = 0x09, .execute = opcodes.arithmetic.op_mulmod, .gas = gas_constants.GasMidStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "EXP", .opcode = 0x0a, .execute = opcodes.arithmetic.op_exp, .gas = 10, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SIGNEXTEND", .opcode = 0x0b, .execute = opcodes.arithmetic.op_signextend, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },

    // 0x10s: Comparison & Bitwise Logic Operations
    .{ .name = "LT", .opcode = 0x10, .execute = opcodes.comparison.op_lt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "GT", .opcode = 0x11, .execute = opcodes.comparison.op_gt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SLT", .opcode = 0x12, .execute = opcodes.comparison.op_slt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SGT", .opcode = 0x13, .execute = opcodes.comparison.op_sgt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "EQ", .opcode = 0x14, .execute = opcodes.comparison.op_eq, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "ISZERO", .opcode = 0x15, .execute = opcodes.comparison.op_iszero, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "AND", .opcode = 0x16, .execute = opcodes.bitwise.op_and, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "OR", .opcode = 0x17, .execute = opcodes.bitwise.op_or, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "XOR", .opcode = 0x18, .execute = opcodes.bitwise.op_xor, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "NOT", .opcode = 0x19, .execute = opcodes.bitwise.op_not, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "BYTE", .opcode = 0x1a, .execute = opcodes.bitwise.op_byte, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SHL", .opcode = 0x1b, .execute = opcodes.bitwise.op_shl, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = "CONSTANTINOPLE" },
    .{ .name = "SHR", .opcode = 0x1c, .execute = opcodes.bitwise.op_shr, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = "CONSTANTINOPLE" },
    .{ .name = "SAR", .opcode = 0x1d, .execute = opcodes.bitwise.op_sar, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = "CONSTANTINOPLE" },

    // 0x20s: Crypto
    .{ .name = "SHA3", .opcode = 0x20, .execute = opcodes.crypto.op_sha3, .gas = gas_constants.Keccak256Gas, .min_stack = 2, .max_stack = Stack.CAPACITY },

    // 0x30s: Environmental Information
    .{ .name = "ADDRESS", .opcode = 0x30, .execute = opcodes.environment.op_address, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "BALANCE_FRONTIER", .opcode = 0x31, .execute = opcodes.environment.op_balance, .gas = 20, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "FRONTIER" },
    .{ .name = "BALANCE_TANGERINE", .opcode = 0x31, .execute = opcodes.environment.op_balance, .gas = 400, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "TANGERINE_WHISTLE" },
    .{ .name = "BALANCE_ISTANBUL", .opcode = 0x31, .execute = opcodes.environment.op_balance, .gas = 700, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "ISTANBUL" },
    .{ .name = "BALANCE_BERLIN", .opcode = 0x31, .execute = opcodes.environment.op_balance, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "BERLIN" },
    .{ .name = "ORIGIN", .opcode = 0x32, .execute = opcodes.environment.op_origin, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLER", .opcode = 0x33, .execute = opcodes.environment.op_caller, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLVALUE", .opcode = 0x34, .execute = opcodes.environment.op_callvalue, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLDATALOAD", .opcode = 0x35, .execute = opcodes.environment.op_calldataload, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "CALLDATASIZE", .opcode = 0x36, .execute = opcodes.environment.op_calldatasize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLDATACOPY", .opcode = 0x37, .execute = opcodes.memory.op_calldatacopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "CODESIZE", .opcode = 0x38, .execute = opcodes.environment.op_codesize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CODECOPY", .opcode = 0x39, .execute = opcodes.environment.op_codecopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "GASPRICE", .opcode = 0x3a, .execute = opcodes.environment.op_gasprice, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "EXTCODESIZE_FRONTIER", .opcode = 0x3b, .execute = opcodes.environment.op_extcodesize, .gas = 20, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "FRONTIER" },
    .{ .name = "EXTCODESIZE_TANGERINE", .opcode = 0x3b, .execute = opcodes.environment.op_extcodesize, .gas = 700, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "TANGERINE_WHISTLE" },
    .{ .name = "EXTCODESIZE_ISTANBUL", .opcode = 0x3b, .execute = opcodes.environment.op_extcodesize, .gas = 700, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "ISTANBUL" },
    .{ .name = "EXTCODESIZE", .opcode = 0x3b, .execute = opcodes.environment.op_extcodesize, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "BERLIN" },
    .{ .name = "EXTCODECOPY_FRONTIER", .opcode = 0x3c, .execute = opcodes.environment.op_extcodecopy, .gas = 20, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = "FRONTIER" },
    .{ .name = "EXTCODECOPY_TANGERINE", .opcode = 0x3c, .execute = opcodes.environment.op_extcodecopy, .gas = 700, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = "TANGERINE_WHISTLE" },
    .{ .name = "EXTCODECOPY_ISTANBUL", .opcode = 0x3c, .execute = opcodes.environment.op_extcodecopy, .gas = 700, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = "ISTANBUL" },
    .{ .name = "EXTCODECOPY", .opcode = 0x3c, .execute = opcodes.environment.op_extcodecopy, .gas = 0, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = "BERLIN" },
    .{ .name = "RETURNDATASIZE", .opcode = 0x3d, .execute = opcodes.memory.op_returndatasize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = "BYZANTIUM" },
    .{ .name = "RETURNDATACOPY", .opcode = 0x3e, .execute = opcodes.memory.op_returndatacopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY, .variant = "BYZANTIUM" },
    .{ .name = "EXTCODEHASH", .opcode = 0x3f, .execute = opcodes.environment.op_extcodehash, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "CONSTANTINOPLE" },

    // 0x40s: Block Information
    .{ .name = "BLOCKHASH", .opcode = 0x40, .execute = opcodes.block.op_blockhash, .gas = 20, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "COINBASE", .opcode = 0x41, .execute = opcodes.block.op_coinbase, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "TIMESTAMP", .opcode = 0x42, .execute = opcodes.block.op_timestamp, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "NUMBER", .opcode = 0x43, .execute = opcodes.block.op_number, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "DIFFICULTY", .opcode = 0x44, .execute = opcodes.block.op_difficulty, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "GASLIMIT", .opcode = 0x45, .execute = opcodes.block.op_gaslimit, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CHAINID", .opcode = 0x46, .execute = opcodes.environment.op_chainid, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = "ISTANBUL" },
    .{ .name = "SELFBALANCE", .opcode = 0x47, .execute = opcodes.environment.op_selfbalance, .gas = gas_constants.GasFastStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = "ISTANBUL" },
    .{ .name = "BASEFEE", .opcode = 0x48, .execute = opcodes.block.op_basefee, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = "LONDON" },
    .{ .name = "BLOBHASH", .opcode = 0x49, .execute = opcodes.block.op_blobhash, .gas = gas_constants.BlobHashGas, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "CANCUN" },
    .{ .name = "BLOBBASEFEE", .opcode = 0x4a, .execute = opcodes.block.op_blobbasefee, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = "CANCUN" },

    // 0x50s: Stack, Memory, Storage and Flow Operations
    .{ .name = "POP", .opcode = 0x50, .execute = opcodes.stack.op_pop, .gas = gas_constants.GasQuickStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "MLOAD", .opcode = 0x51, .execute = opcodes.memory.op_mload, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "MSTORE", .opcode = 0x52, .execute = opcodes.memory.op_mstore, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MSTORE8", .opcode = 0x53, .execute = opcodes.memory.op_mstore8, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SLOAD_FRONTIER", .opcode = 0x54, .execute = opcodes.storage.op_sload, .gas = 50, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "FRONTIER" },
    .{ .name = "SLOAD_TANGERINE", .opcode = 0x54, .execute = opcodes.storage.op_sload, .gas = 200, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "TANGERINE_WHISTLE" },
    .{ .name = "SLOAD_ISTANBUL", .opcode = 0x54, .execute = opcodes.storage.op_sload, .gas = 800, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "ISTANBUL" },
    .{ .name = "SLOAD", .opcode = 0x54, .execute = opcodes.storage.op_sload, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "BERLIN" },
    .{ .name = "SSTORE", .opcode = 0x55, .execute = opcodes.storage.op_sstore, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "JUMP", .opcode = 0x56, .execute = opcodes.control.op_jump, .gas = gas_constants.GasMidStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "JUMPI", .opcode = 0x57, .execute = opcodes.control.op_jumpi, .gas = gas_constants.GasSlowStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "PC", .opcode = 0x58, .execute = opcodes.control.op_pc, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "MSIZE", .opcode = 0x59, .execute = opcodes.memory.op_msize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "GAS", .opcode = 0x5a, .execute = opcodes.system.gas_op, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "JUMPDEST", .opcode = 0x5b, .execute = opcodes.control.op_jumpdest, .gas = gas_constants.JumpdestGas, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "TLOAD", .opcode = 0x5c, .execute = opcodes.storage.op_tload, .gas = gas_constants.WarmStorageReadCost, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "CANCUN" },
    .{ .name = "TSTORE", .opcode = 0x5d, .execute = opcodes.storage.op_tstore, .gas = gas_constants.WarmStorageReadCost, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = "CANCUN" },
    .{ .name = "MCOPY", .opcode = 0x5e, .execute = opcodes.memory.op_mcopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY, .variant = "CANCUN" },
    .{ .name = "PUSH0", .opcode = 0x5f, .execute = opcodes.stack.op_push0, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = "SHANGHAI" },

    // 0x60s & 0x70s: Push operations (generated dynamically in jump table)
    // 0x80s: Duplication operations (generated dynamically in jump table)
    // 0x90s: Exchange operations (generated dynamically in jump table)
    // 0xa0s: Logging operations (generated dynamically in jump table)

    // 0xf0s: System operations
    .{ .name = "CREATE", .opcode = 0xf0, .execute = opcodes.system.op_create, .gas = gas_constants.CreateGas, .min_stack = 3, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALL_FRONTIER", .opcode = 0xf1, .execute = opcodes.system.op_call, .gas = 40, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = "FRONTIER" },
    .{ .name = "CALL", .opcode = 0xf1, .execute = opcodes.system.op_call, .gas = 700, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = "TANGERINE_WHISTLE" },
    .{ .name = "CALLCODE_FRONTIER", .opcode = 0xf2, .execute = opcodes.system.op_callcode, .gas = 40, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = "FRONTIER" },
    .{ .name = "CALLCODE", .opcode = 0xf2, .execute = opcodes.system.op_callcode, .gas = 700, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = "TANGERINE_WHISTLE" },
    .{ .name = "RETURN", .opcode = 0xf3, .execute = opcodes.control.op_return, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "DELEGATECALL", .opcode = 0xf4, .execute = opcodes.system.op_delegatecall, .gas = 40, .min_stack = 6, .max_stack = Stack.CAPACITY - 1, .variant = "HOMESTEAD" },
    .{ .name = "DELEGATECALL_TANGERINE", .opcode = 0xf4, .execute = opcodes.system.op_delegatecall, .gas = 700, .min_stack = 6, .max_stack = Stack.CAPACITY - 1, .variant = "TANGERINE_WHISTLE" },
    .{ .name = "CREATE2", .opcode = 0xf5, .execute = opcodes.system.op_create2, .gas = gas_constants.CreateGas, .min_stack = 4, .max_stack = Stack.CAPACITY - 1, .variant = "CONSTANTINOPLE" },
    .{ .name = "STATICCALL", .opcode = 0xfa, .execute = opcodes.system.op_staticcall, .gas = 700, .min_stack = 6, .max_stack = Stack.CAPACITY - 1, .variant = "BYZANTIUM" },
    .{ .name = "REVERT", .opcode = 0xfd, .execute = opcodes.control.op_revert, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = "BYZANTIUM" },
    .{ .name = "INVALID", .opcode = 0xfe, .execute = opcodes.control.op_invalid, .gas = 0, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "SELFDESTRUCT_FRONTIER", .opcode = 0xff, .execute = opcodes.control.op_selfdestruct, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "FRONTIER" },
    .{ .name = "SELFDESTRUCT", .opcode = 0xff, .execute = opcodes.control.op_selfdestruct, .gas = 5000, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "TANGERINE_WHISTLE" },
};

/// Generate an Operation struct from an OpSpec.
pub fn generate_operation(spec: OpSpec) Operation {
    return Operation{
        .execute = spec.execute,
        .constant_gas = spec.gas,
        .min_stack = spec.min_stack,
        .max_stack = spec.max_stack,
    };
}
```
```zig [src/evm/constants.zig]
//! EVM opcode constants and bytecode analysis utilities.
//!
//! This module serves as the central definition point for all EVM opcodes
//! and provides utility functions for bytecode analysis. All opcodes are
//! defined as comptime constants for zero-cost abstraction and compile-time
//! verification.
//!
//! ## Organization
//! Opcodes are grouped by their functional categories:
//! - Arithmetic operations (0x00-0x0B)
//! - Comparison & bitwise logic (0x10-0x1D)
//! - Keccak hashing (0x20)
//! - Environmental information (0x30-0x3F)
//! - Block information (0x40-0x4A)
//! - Stack, memory, storage operations (0x50-0x5F)
//! - Push operations (0x60-0x7F)
//! - Duplication operations (0x80-0x8F)
//! - Exchange operations (0x90-0x9F)
//! - Logging operations (0xA0-0xA4)
//! - System operations (0xF0-0xFF)
//!
//! ## Usage
//! ```zig
//! const opcode = bytecode[pc];
//! if (constants.is_push(opcode)) {
//!     const push_size = constants.get_push_size(opcode);
//!     // Skip over the push data
//!     pc += 1 + push_size;
//! }
//! ```
//!
//! ## Hardfork Considerations
//! Some opcodes are only available after specific hardforks:
//! - PUSH0 (0x5F): Shanghai
//! - TLOAD/TSTORE (0x5C/0x5D): Cancun
//! - MCOPY (0x5E): Cancun
//! - BASEFEE (0x48): London
//! - CHAINID (0x46): Istanbul
//!
//! Reference: https://www.evm.codes/

// ============================================================================
// Arithmetic Operations (0x00-0x0B)
// ============================================================================

/// Halts execution of the current context.
/// Stack: [] -> []
/// Gas: 0
pub const STOP: u8 = 0x00;

/// Addition operation with modulo 2^256.
/// Stack: [a, b] -> [a + b]
/// Gas: 3
pub const ADD: u8 = 0x01;
/// Multiplication operation with modulo 2^256.
/// Stack: [a, b] -> [a * b]
/// Gas: 5
pub const MUL: u8 = 0x02;

/// Subtraction operation with modulo 2^256.
/// Stack: [a, b] -> [a - b]
/// Gas: 3
pub const SUB: u8 = 0x03;

/// Integer division operation.
/// Stack: [a, b] -> [a / b] (0 if b == 0)
/// Gas: 5
pub const DIV: u8 = 0x04;
pub const SDIV: u8 = 0x05;
pub const MOD: u8 = 0x06;
pub const SMOD: u8 = 0x07;
pub const ADDMOD: u8 = 0x08;
pub const MULMOD: u8 = 0x09;
/// Exponential operation (a ** b).
/// Stack: [a, b] -> [a ** b]
/// Gas: 10 + 50 per byte in exponent
/// Note: Gas cost increases with size of exponent
pub const EXP: u8 = 0x0A;

/// Sign extension operation.
/// Stack: [b, x] -> [y] where y is sign-extended x from (b+1)*8 bits
/// Gas: 5
pub const SIGNEXTEND: u8 = 0x0B;

// ============================================================================
// Comparison & Bitwise Logic Operations (0x10-0x1D)
// ============================================================================
pub const LT: u8 = 0x10;
pub const GT: u8 = 0x11;
pub const SLT: u8 = 0x12;
pub const SGT: u8 = 0x13;
pub const EQ: u8 = 0x14;
pub const ISZERO: u8 = 0x15;
pub const AND: u8 = 0x16;
pub const OR: u8 = 0x17;
pub const XOR: u8 = 0x18;
pub const NOT: u8 = 0x19;
pub const BYTE: u8 = 0x1A;
pub const SHL: u8 = 0x1B;
pub const SHR: u8 = 0x1C;
pub const SAR: u8 = 0x1D;

// ============================================================================
// Cryptographic Operations (0x20)
// ============================================================================

/// Computes Keccak-256 hash of memory region.
/// Stack: [offset, size] -> [hash]
/// Gas: 30 + 6 per word + memory expansion
pub const KECCAK256: u8 = 0x20;

// ============================================================================
// Environmental Information (0x30-0x3F)
// ============================================================================
pub const ADDRESS: u8 = 0x30;
pub const BALANCE: u8 = 0x31;
pub const ORIGIN: u8 = 0x32;
pub const CALLER: u8 = 0x33;
pub const CALLVALUE: u8 = 0x34;
pub const CALLDATALOAD: u8 = 0x35;
pub const CALLDATASIZE: u8 = 0x36;
pub const CALLDATACOPY: u8 = 0x37;
pub const CODESIZE: u8 = 0x38;
pub const CODECOPY: u8 = 0x39;
pub const GASPRICE: u8 = 0x3A;
pub const EXTCODESIZE: u8 = 0x3B;
pub const EXTCODECOPY: u8 = 0x3C;
pub const RETURNDATASIZE: u8 = 0x3D;
pub const RETURNDATACOPY: u8 = 0x3E;
pub const EXTCODEHASH: u8 = 0x3F;

// ============================================================================
// Block Information (0x40-0x4A)
// ============================================================================
pub const BLOCKHASH: u8 = 0x40;
pub const COINBASE: u8 = 0x41;
pub const TIMESTAMP: u8 = 0x42;
pub const NUMBER: u8 = 0x43;
pub const PREVRANDAO: u8 = 0x44;
pub const GASLIMIT: u8 = 0x45;
pub const CHAINID: u8 = 0x46;
pub const SELFBALANCE: u8 = 0x47;
pub const BASEFEE: u8 = 0x48;
pub const BLOBHASH: u8 = 0x49;
pub const BLOBBASEFEE: u8 = 0x4A;

// ============================================================================
// Stack, Memory, Storage and Flow Operations (0x50-0x5F)
// ============================================================================
pub const POP: u8 = 0x50;
pub const MLOAD: u8 = 0x51;
pub const MSTORE: u8 = 0x52;
pub const MSTORE8: u8 = 0x53;
/// Load value from storage.
/// Stack: [key] -> [value]
/// Gas: 100 (warm) or 2100 (cold) since Berlin
pub const SLOAD: u8 = 0x54;

/// Store value to storage.
/// Stack: [key, value] -> []
/// Gas: Complex - depends on current value and new value
/// Note: Most expensive operation, can cost 20000 gas
pub const SSTORE: u8 = 0x55;
pub const JUMP: u8 = 0x56;
pub const JUMPI: u8 = 0x57;
pub const PC: u8 = 0x58;
pub const MSIZE: u8 = 0x59;
pub const GAS: u8 = 0x5A;
/// Valid jump destination marker.
/// Stack: [] -> []
/// Gas: 1
/// Note: Only opcode that can be jumped to
pub const JUMPDEST: u8 = 0x5B;
pub const TLOAD: u8 = 0x5C;
pub const TSTORE: u8 = 0x5D;
pub const MCOPY: u8 = 0x5E;
/// Push zero onto the stack (Shanghai hardfork).
/// Stack: [] -> [0]
/// Gas: 2
/// Note: More efficient than PUSH1 0x00
pub const PUSH0: u8 = 0x5F;

// ============================================================================
// Push Operations (0x60-0x7F)
// ============================================================================
pub const PUSH1: u8 = 0x60;
pub const PUSH2: u8 = 0x61;
pub const PUSH3: u8 = 0x62;
pub const PUSH4: u8 = 0x63;
pub const PUSH5: u8 = 0x64;
pub const PUSH6: u8 = 0x65;
pub const PUSH7: u8 = 0x66;
pub const PUSH8: u8 = 0x67;
pub const PUSH9: u8 = 0x68;
pub const PUSH10: u8 = 0x69;
pub const PUSH11: u8 = 0x6A;
pub const PUSH12: u8 = 0x6B;
pub const PUSH13: u8 = 0x6C;
pub const PUSH14: u8 = 0x6D;
pub const PUSH15: u8 = 0x6E;
pub const PUSH16: u8 = 0x6F;
pub const PUSH17: u8 = 0x70;
pub const PUSH18: u8 = 0x71;
pub const PUSH19: u8 = 0x72;
pub const PUSH20: u8 = 0x73;
pub const PUSH21: u8 = 0x74;
pub const PUSH22: u8 = 0x75;
pub const PUSH23: u8 = 0x76;
pub const PUSH24: u8 = 0x77;
pub const PUSH25: u8 = 0x78;
pub const PUSH26: u8 = 0x79;
pub const PUSH27: u8 = 0x7A;
pub const PUSH28: u8 = 0x7B;
pub const PUSH29: u8 = 0x7C;
pub const PUSH30: u8 = 0x7D;
pub const PUSH31: u8 = 0x7E;
pub const PUSH32: u8 = 0x7F;

// ============================================================================
// Duplication Operations (0x80-0x8F)
// ============================================================================
pub const DUP1: u8 = 0x80;
pub const DUP2: u8 = 0x81;
pub const DUP3: u8 = 0x82;
pub const DUP4: u8 = 0x83;
pub const DUP5: u8 = 0x84;
pub const DUP6: u8 = 0x85;
pub const DUP7: u8 = 0x86;
pub const DUP8: u8 = 0x87;
pub const DUP9: u8 = 0x88;
pub const DUP10: u8 = 0x89;
pub const DUP11: u8 = 0x8A;
pub const DUP12: u8 = 0x8B;
pub const DUP13: u8 = 0x8C;
pub const DUP14: u8 = 0x8D;
pub const DUP15: u8 = 0x8E;
pub const DUP16: u8 = 0x8F;

// ============================================================================
// Exchange Operations (0x90-0x9F)
// ============================================================================
pub const SWAP1: u8 = 0x90;
pub const SWAP2: u8 = 0x91;
pub const SWAP3: u8 = 0x92;
pub const SWAP4: u8 = 0x93;
pub const SWAP5: u8 = 0x94;
pub const SWAP6: u8 = 0x95;
pub const SWAP7: u8 = 0x96;
pub const SWAP8: u8 = 0x97;
pub const SWAP9: u8 = 0x98;
pub const SWAP10: u8 = 0x99;
pub const SWAP11: u8 = 0x9A;
pub const SWAP12: u8 = 0x9B;
pub const SWAP13: u8 = 0x9C;
pub const SWAP14: u8 = 0x9D;
pub const SWAP15: u8 = 0x9E;
pub const SWAP16: u8 = 0x9F;

// ============================================================================
// Logging Operations (0xA0-0xA4)
// ============================================================================
pub const LOG0: u8 = 0xA0;
pub const LOG1: u8 = 0xA1;
pub const LOG2: u8 = 0xA2;
pub const LOG3: u8 = 0xA3;
pub const LOG4: u8 = 0xA4;

// ============================================================================
// System Operations (0xF0-0xFF)
// ============================================================================
pub const CREATE: u8 = 0xF0;
pub const CALL: u8 = 0xF1;
pub const CALLCODE: u8 = 0xF2;
pub const RETURN: u8 = 0xF3;
pub const DELEGATECALL: u8 = 0xF4;
pub const CREATE2: u8 = 0xF5;
pub const RETURNDATALOAD: u8 = 0xF7;
pub const EXTCALL: u8 = 0xF8;
pub const EXTDELEGATECALL: u8 = 0xF9;
pub const STATICCALL: u8 = 0xFA;
pub const EXTSTATICCALL: u8 = 0xFB;
pub const REVERT: u8 = 0xFD;
pub const INVALID: u8 = 0xFE;
/// Destroy contract and send balance to address.
/// Stack: [address] -> []
/// Gas: 5000 + dynamic costs
/// Note: Deprecated - only works in same transaction (Cancun)
pub const SELFDESTRUCT: u8 = 0xFF;

/// Checks if an opcode is a PUSH operation (PUSH1-PUSH32).
///
/// PUSH operations place N bytes of immediate data onto the stack,
/// where N is determined by the specific PUSH opcode.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` if the opcode is between PUSH1 (0x60) and PUSH32 (0x7F)
/// - `false` otherwise
///
/// ## Example
/// ```zig
/// if (is_push(opcode)) {
///     const data_size = get_push_size(opcode);
///     // Read `data_size` bytes following the opcode
/// }
/// ```
pub inline fn is_push(op: u8) bool {
    return op >= PUSH1 and op <= PUSH32;
}

/// Returns the number of immediate data bytes for a PUSH opcode.
///
/// PUSH1 pushes 1 byte, PUSH2 pushes 2 bytes, etc., up to PUSH32
/// which pushes 32 bytes of immediate data from the bytecode.
///
/// ## Parameters
/// - `op`: The opcode to analyze
///
/// ## Returns
/// - 1-32 for valid PUSH opcodes (PUSH1-PUSH32)
/// - 0 for non-PUSH opcodes
///
/// ## Algorithm
/// For valid PUSH opcodes: size = opcode - 0x60 + 1
///
/// ## Example
/// ```zig
/// const size = get_push_size(PUSH20); // Returns 20
/// const size2 = get_push_size(ADD);   // Returns 0
/// ```
pub inline fn get_push_size(op: u8) u8 {
    if (!is_push(op)) return 0;
    return op - PUSH1 + 1;
}

/// Checks if an opcode is a DUP operation (DUP1-DUP16).
///
/// DUP operations duplicate a stack item and push the copy onto the stack.
/// DUP1 duplicates the top item, DUP2 the second item, etc.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` if the opcode is between DUP1 (0x80) and DUP16 (0x8F)
/// - `false` otherwise
///
/// ## Stack Effect
/// DUPn: [... vn ... v1] -> [... vn ... v1 vn]
pub inline fn is_dup(op: u8) bool {
    return op >= DUP1 and op <= DUP16;
}

/// Get the stack position for a DUP opcode
/// Returns 0 for non-DUP opcodes
pub inline fn get_dup_position(op: u8) u8 {
    if (!is_dup(op)) return 0;
    return op - DUP1 + 1;
}

/// Check if an opcode is a SWAP operation
pub inline fn is_swap(op: u8) bool {
    return op >= SWAP1 and op <= SWAP16;
}

/// Get the stack position for a SWAP opcode
/// Returns 0 for non-SWAP opcodes
pub inline fn get_swap_position(op: u8) u8 {
    if (!is_swap(op)) return 0;
    return op - SWAP1 + 1;
}

/// Check if an opcode is a LOG operation
pub inline fn is_log(op: u8) bool {
    return op >= LOG0 and op <= LOG4;
}

/// Get the number of topics for a LOG opcode
/// Returns 0 for non-LOG opcodes
pub inline fn get_log_topic_count(op: u8) u8 {
    if (!is_log(op)) return 0;
    return op - LOG0;
}

/// Checks if an opcode terminates execution of the current context.
///
/// Terminating operations end the current execution context and cannot
/// be followed by any other operations in the execution flow.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` for STOP, RETURN, REVERT, SELFDESTRUCT, INVALID
/// - `false` otherwise
///
/// ## Terminating Opcodes
/// - STOP (0x00): Halts execution successfully
/// - RETURN (0xF3): Returns data and halts successfully
/// - REVERT (0xFD): Reverts state changes and returns data
/// - SELFDESTRUCT (0xFF): Destroys contract and sends balance
/// - INVALID (0xFE): Invalid operation, always reverts
///
/// ## Usage
/// ```zig
/// if (is_terminating(opcode)) {
///     // This is the last operation in this context
///     return;
/// }
/// ```
pub inline fn is_terminating(op: u8) bool {
    return op == STOP or op == RETURN or op == REVERT or op == SELFDESTRUCT or op == INVALID;
}

/// Check if an opcode is a call operation
pub inline fn is_call(op: u8) bool {
    return op == CALL or op == CALLCODE or op == DELEGATECALL or op == STATICCALL or
        op == EXTCALL or op == EXTDELEGATECALL or op == EXTSTATICCALL;
}

/// Check if an opcode is a create operation
pub inline fn is_create(op: u8) bool {
    return op == CREATE or op == CREATE2;
}

/// Checks if an opcode can modify blockchain state.
///
/// State-modifying operations are restricted in static calls and
/// require special handling for gas accounting and rollback.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns  
/// - `true` for operations that modify storage, create contracts, or emit logs
/// - `false` for read-only operations
///
/// ## State-Modifying Opcodes
/// - SSTORE: Modifies contract storage
/// - CREATE/CREATE2: Deploys new contracts
/// - SELFDESTRUCT: Destroys contract and transfers balance
/// - LOG0-LOG4: Emits events (modifies receipts)
///
/// ## Note
/// CALL can also modify state indirectly if it transfers value,
/// but this function only checks direct state modifications.
///
/// ## Static Call Protection
/// These operations will fail with an error if executed within
/// a STATICCALL context.
pub inline fn modifies_state(op: u8) bool {
    return op == SSTORE or op == CREATE or op == CREATE2 or op == SELFDESTRUCT or
        op == LOG0 or op == LOG1 or op == LOG2 or op == LOG3 or op == LOG4;
}

/// Check if an opcode is valid
pub inline fn is_valid(op: u8) bool {
    return op != INVALID;
}

// ============================================================================
// Contract Size and Gas Constants
// ============================================================================

/// Maximum allowed size for deployed contract bytecode.
///
/// ## Value
/// 24,576 bytes (24 KB)
///
/// ## Origin
/// Defined by EIP-170 (activated in Spurious Dragon hardfork)
///
/// ## Rationale
/// - Prevents excessive blockchain growth from large contracts
/// - Ensures contracts can be loaded into memory efficiently
/// - Encourages modular contract design
///
/// ## Implications
/// - Contract creation fails if initcode returns bytecode larger than this
/// - Does NOT limit initcode size (see EIP-3860 for that)
/// - Libraries and proxy patterns help work around this limit
///
/// Reference: https://eips.ethereum.org/EIPS/eip-170
pub const MAX_CODE_SIZE: u32 = 24576;

/// Gas cost per byte of deployed contract code.
///
/// ## Value
/// 200 gas per byte
///
/// ## Usage
/// Charged during contract creation (CREATE/CREATE2) based on the
/// size of the returned bytecode that will be stored on-chain.
///
/// ## Calculation
/// `deployment_gas_cost = len(returned_code) * 200`
///
/// ## Example
/// A 1000-byte contract costs an additional 200,000 gas to deploy
/// beyond the execution costs.
///
/// ## Note
/// This is separate from the initcode gas cost introduced in EIP-3860.
pub const DEPLOY_CODE_GAS_PER_BYTE: u64 = 200;
```
```zig [src/evm/call_result.zig]
/// Result structure returned by contract call operations.
///
/// This structure encapsulates the outcome of executing a contract call in the EVM,
/// including standard calls (CALL), code calls (CALLCODE), delegate calls (DELEGATECALL),
/// and static calls (STATICCALL). It provides a unified interface for handling the
/// results of all inter-contract communication operations.
///
/// ## Usage
/// This structure is returned by the VM's call methods and contains all information
/// needed to determine the outcome of a call and process its results.
///
/// ## Call Types
/// - **CALL**: Standard contract call with its own storage context
/// - **CALLCODE**: Executes external code in current storage context (deprecated)
/// - **DELEGATECALL**: Executes external code with current storage and msg context
/// - **STATICCALL**: Read-only call that cannot modify state
///
/// ## Example
/// ```zig
/// const result = try vm.call_contract(caller, to, value, input, gas, is_static);
/// if (result.success) {
///     // Process successful call
///     if (result.output) |data| {
///         // Handle returned data
///     }
/// } else {
///     // Handle failed call - gas_left indicates remaining gas
/// }
/// defer if (result.output) |output| allocator.free(output);
/// ```
const Self = @This();

/// Indicates whether the call completed successfully.
///
/// - `true`: Call executed without errors and any state changes were committed
/// - `false`: Call failed due to revert, out of gas, or other errors
///
/// Note: A successful call may still have no output data if the called
/// contract intentionally returns nothing.
success: bool,

/// Amount of gas remaining after the call execution.
///
/// This value is important for gas accounting:
/// - For successful calls: Indicates unused gas to be refunded to the caller
/// - For failed calls: May be non-zero if the call reverted (vs running out of gas)
///
/// The calling context should add this back to its available gas to continue execution.
gas_left: u64,

/// Optional output data returned by the called contract.
///
/// - `null`: No data was returned (valid for both success and failure)
/// - `[]const u8`: Returned data buffer
///
/// ## Memory Management
/// The output data is allocated by the VM and ownership is transferred to the caller.
/// The caller is responsible for freeing this memory when no longer needed.
///
/// ## For Different Call Types
/// - **RETURN**: Contains the data specified in the RETURN opcode
/// - **REVERT**: Contains the revert reason/data if provided
/// - **STOP**: Will be null (no data returned)
/// - **Out of Gas/Invalid**: Will be null
output: ?[]const u8,
```
```zig [src/evm/opcodes/comparison.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");

pub fn op_lt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a < b) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_gt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a > b) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_slt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));

    const result: u256 = if (a_i256 < b_i256) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_sgt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));

    const result: u256 = if (a_i256 > b_i256) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_eq(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a == b) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_iszero(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 1);

    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a == 0) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/opcodes/system.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Contract = @import("../contract.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;
const gas_constants = @import("../gas_constants.zig");
const AccessList = @import("../access_list.zig").AccessList;
const error_mapping = @import("../error_mapping.zig");

// Import helper functions from error_mapping
const stack_pop = error_mapping.stack_pop;
const stack_push = error_mapping.stack_push;
const map_memory_error = error_mapping.map_memory_error;

// Gas opcode handler
pub fn gas_op(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try stack_push(&frame.stack, @as(u256, @intCast(frame.gas_remaining)));

    return Operation.ExecutionResult{};
}

// Helper to check if u256 fits in usize
fn check_offset_bounds(value: u256) ExecutionError.Error!void {
    if (value > std.math.maxInt(usize)) return ExecutionError.Error.InvalidOffset;
}

pub fn op_create(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Check if we're in a static call
    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    const value = try stack_pop(&frame.stack);
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);

    // Debug: CREATE opcode: value, offset, size

    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }

    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) return ExecutionError.Error.MaxCodeSizeExceeded;

    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        try check_offset_bounds(offset);

        const offset_usize = @as(usize, @intCast(offset));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);

        // Ensure memory is available and get the slice
        _ = frame.memory.ensure_context_capacity(offset_usize + size_usize) catch |err| return map_memory_error(err);
        init_code = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);
    }

    // Calculate gas for creation
    const init_code_cost = @as(u64, @intCast(init_code.len)) * gas_constants.CreateDataGas;

    // EIP-3860: Add gas cost for initcode word size (2 gas per 32-byte word) - Shanghai and later
    const initcode_word_cost = if (vm.chain_rules.IsEIP3860)
        @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.InitcodeWordGas
    else
        0;
    try frame.consume_gas(init_code_cost + initcode_word_cost);

    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);

    // Create the contract
    const result = try vm.create_contract(frame.contract.address, value, init_code, gas_for_call);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;

    if (!result.success) {
        try stack_push(&frame.stack, 0);
        frame.return_data_buffer = result.output orelse &[_]u8{};
        return Operation.ExecutionResult{};
    }

    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try stack_push(&frame.stack, to_u256(result.address));

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    return Operation.ExecutionResult{};
}

/// CREATE2 opcode - Create contract with deterministic address
pub fn op_create2(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    const value = try stack_pop(&frame.stack);
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    const salt = try stack_pop(&frame.stack);

    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }

    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) return ExecutionError.Error.MaxCodeSizeExceeded;

    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        try check_offset_bounds(offset);

        const offset_usize = @as(usize, @intCast(offset));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);

        // Ensure memory is available and get the slice
        _ = frame.memory.ensure_context_capacity(offset_usize + size_usize) catch |err| return map_memory_error(err);
        init_code = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);
    }

    const init_code_cost = @as(u64, @intCast(init_code.len)) * gas_constants.CreateDataGas;
    const hash_cost = @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.Keccak256WordGas;

    // EIP-3860: Add gas cost for initcode word size (2 gas per 32-byte word) - Shanghai and later
    const initcode_word_cost = if (vm.chain_rules.IsEIP3860)
        @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.InitcodeWordGas
    else
        0;
    try frame.consume_gas(init_code_cost + hash_cost + initcode_word_cost);

    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);

    // Create the contract with CREATE2
    const result = try vm.create2_contract(frame.contract.address, value, init_code, salt, gas_for_call);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;

    if (!result.success) {
        try stack_push(&frame.stack, 0);
        frame.return_data_buffer = result.output orelse &[_]u8{};
        return Operation.ExecutionResult{};
    }

    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try stack_push(&frame.stack, to_u256(result.address));

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    return Operation.ExecutionResult{};
}

pub fn op_call(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try stack_pop(&frame.stack);
    const to = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);
    const args_offset = try stack_pop(&frame.stack);
    const args_size = try stack_pop(&frame.stack);
    const ret_offset = try stack_pop(&frame.stack);
    const ret_size = try stack_pop(&frame.stack);

    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        // Check that offset + size doesn't overflow and fits in usize
        if (args_offset > std.math.maxInt(usize) or args_size > std.math.maxInt(usize)) return ExecutionError.Error.InvalidOffset;
        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        // Check that offset + size doesn't overflow usize
        if (args_offset_usize > std.math.maxInt(usize) - args_size_usize) return ExecutionError.Error.InvalidOffset;

        _ = frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize) catch |err| return map_memory_error(err);
        args = frame.memory.get_slice(args_offset_usize, args_size_usize) catch |err| return map_memory_error(err);
    }

    // Ensure return memory
    if (ret_size > 0) {
        // Check that offset + size doesn't overflow and fits in usize
        if (ret_offset > std.math.maxInt(usize) or ret_size > std.math.maxInt(usize)) return ExecutionError.Error.InvalidOffset;
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        // Check that offset + size doesn't overflow usize
        if (ret_offset_usize > std.math.maxInt(usize) - ret_size_usize) return ExecutionError.Error.InvalidOffset;

        _ = frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize) catch |err| return map_memory_error(err);
    }

    if (frame.is_static and value != 0) return ExecutionError.Error.WriteProtection;

    const to_address = from_u256(to);

    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    if (value != 0) {
        gas_for_call += 2300; // Stipend
    }

    // Execute the call
    const result = try vm.call_contract(frame.contract.address, to_address, value, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try stack_push(&frame.stack, if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_callcode(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try stack_pop(&frame.stack);
    const to = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);
    const args_offset = try stack_pop(&frame.stack);
    const args_size = try stack_pop(&frame.stack);
    const ret_offset = try stack_pop(&frame.stack);
    const ret_size = try stack_pop(&frame.stack);

    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize) catch |err| return map_memory_error(err);
        args = frame.memory.get_slice(args_offset_usize, args_size_usize) catch |err| return map_memory_error(err);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize) catch |err| return map_memory_error(err);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    if (value != 0) {
        gas_for_call += 2300; // Stipend
    }

    // Execute the callcode (execute target's code with current storage context)
    // For callcode, we use the current contract's address as the execution context
    const result = try vm.callcode_contract(frame.contract.address, to_address, value, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try stack_push(&frame.stack, if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_delegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try stack_pop(&frame.stack);
    const to = try stack_pop(&frame.stack);
    const args_offset = try stack_pop(&frame.stack);
    const args_size = try stack_pop(&frame.stack);
    const ret_offset = try stack_pop(&frame.stack);
    const ret_size = try stack_pop(&frame.stack);

    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize) catch |err| return map_memory_error(err);
        args = frame.memory.get_slice(args_offset_usize, args_size_usize) catch |err| return map_memory_error(err);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize) catch |err| return map_memory_error(err);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    // Execute the delegatecall (execute target's code with current storage context and msg.sender/value)
    // For delegatecall, we preserve the current contract's context
    // Note: delegatecall doesn't transfer value, it uses the current contract's value
    const result = try vm.delegatecall_contract(frame.contract.address, to_address, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try stack_push(&frame.stack, if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_staticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try stack_pop(&frame.stack);
    const to = try stack_pop(&frame.stack);
    const args_offset = try stack_pop(&frame.stack);
    const args_size = try stack_pop(&frame.stack);
    const ret_offset = try stack_pop(&frame.stack);
    const ret_size = try stack_pop(&frame.stack);

    // Check depth
    if (frame.depth >= 1024) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize) catch |err| return map_memory_error(err);
        args = frame.memory.get_slice(args_offset_usize, args_size_usize) catch |err| return map_memory_error(err);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize) catch |err| return map_memory_error(err);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    // Execute the static call (no value transfer, is_static = true)
    const result = try vm.call_contract(frame.contract.address, to_address, 0, args, gas_for_call, true);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try stack_push(&frame.stack, if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}
/// EXTCALL opcode (0xF8): External call with EOF validation
/// Not implemented - EOF feature
pub fn op_extcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}

/// EXTDELEGATECALL opcode (0xF9): External delegate call with EOF validation
/// Not implemented - EOF feature
pub fn op_extdelegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}

/// EXTSTATICCALL opcode (0xFB): External static call with EOF validation
/// Not implemented - EOF feature
pub fn op_extstaticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}
```
```zig [src/evm/opcodes/arithmetic.zig]
/// Arithmetic operations for the Ethereum Virtual Machine
///
/// This module implements all arithmetic opcodes for the EVM, including basic
/// arithmetic (ADD, SUB, MUL, DIV), signed operations (SDIV, SMOD), modular
/// arithmetic (MOD, ADDMOD, MULMOD), exponentiation (EXP), and sign extension
/// (SIGNEXTEND).
///
/// ## Design Philosophy
///
/// All operations follow a consistent pattern:
/// 1. Pop operands from the stack (validated by jump table)
/// 2. Perform the arithmetic operation
/// 3. Push the result back onto the stack
///
/// ## Performance Optimizations
///
/// - **Unsafe Operations**: Stack bounds checking is done by the jump table,
///   allowing opcodes to use unsafe stack operations for maximum performance
/// - **In-Place Updates**: Results are written directly to stack slots to
///   minimize memory operations
/// - **Wrapping Arithmetic**: Uses Zig's wrapping operators (`+%`, `*%`, `-%`)
///   for correct 256-bit overflow behavior
///
/// ## EVM Arithmetic Rules
///
/// - All values are 256-bit unsigned integers (u256)
/// - Overflow wraps around (e.g., MAX_U256 + 1 = 0)
/// - Division by zero returns 0 (not an error)
/// - Modulo by zero returns 0 (not an error)
/// - Signed operations interpret u256 as two's complement i256
///
/// ## Gas Costs
///
/// - ADD, SUB, NOT: 3 gas (GasFastestStep)
/// - MUL, DIV, SDIV, MOD, SMOD: 5 gas (GasFastStep)
/// - ADDMOD, MULMOD, SIGNEXTEND: 8 gas (GasMidStep)
/// - EXP: 10 gas + 50 per byte of exponent
///
/// ## Stack Requirements
///
/// Operation    | Stack Input | Stack Output | Description
/// -------------|-------------|--------------|-------------
/// ADD          | [a, b]      | [a + b]      | Addition with overflow
/// MUL          | [a, b]      | [a * b]      | Multiplication with overflow
/// SUB          | [a, b]      | [a - b]      | Subtraction with underflow
/// DIV          | [a, b]      | [a / b]      | Division (b=0 returns 0)
/// SDIV         | [a, b]      | [a / b]      | Signed division
/// MOD          | [a, b]      | [a % b]      | Modulo (b=0 returns 0)
/// SMOD         | [a, b]      | [a % b]      | Signed modulo
/// ADDMOD       | [a, b, n]   | [(a+b)%n]    | Addition modulo n
/// MULMOD       | [a, b, n]   | [(a*b)%n]    | Multiplication modulo n
/// EXP          | [a, b]      | [a^b]        | Exponentiation
/// SIGNEXTEND   | [b, x]      | [y]          | Sign extend x from byte b
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");

/// ADD opcode (0x01) - Addition operation
///
/// Pops two values from the stack, adds them with wrapping overflow,
/// and pushes the result.
///
/// ## Stack Input
/// - `a`: First operand (second from top)
/// - `b`: Second operand (top)
///
/// ## Stack Output
/// - `a + b`: Sum with 256-bit wrapping overflow
///
/// ## Gas Cost
/// 3 gas (GasFastestStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate sum = (a + b) mod 2^256
/// 4. Push sum to stack
///
/// ## Example
/// Stack: [10, 20] => [30]
/// Stack: [MAX_U256, 1] => [0] (overflow wraps)
pub fn op_add(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const sum = a +% b;

    frame.stack.set_top_unsafe(sum);

    return Operation.ExecutionResult{};
}

/// MUL opcode (0x02) - Multiplication operation
///
/// Pops two values from the stack, multiplies them with wrapping overflow,
/// and pushes the result.
///
/// ## Stack Input
/// - `a`: First operand (second from top)
/// - `b`: Second operand (top)
///
/// ## Stack Output
/// - `a * b`: Product with 256-bit wrapping overflow
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate product = (a * b) mod 2^256
/// 4. Push product to stack
///
/// ## Example
/// Stack: [10, 20] => [200]
/// Stack: [2^128, 2^128] => [0] (overflow wraps)
pub fn op_mul(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;
    const product = a *% b;

    frame.stack.set_top_unsafe(product);

    return Operation.ExecutionResult{};
}

/// SUB opcode (0x03) - Subtraction operation
///
/// Pops two values from the stack, subtracts the top from the second,
/// with wrapping underflow, and pushes the result.
///
/// ## Stack Input
/// - `a`: Minuend (second from top)
/// - `b`: Subtrahend (top)
///
/// ## Stack Output
/// - `a - b`: Difference with 256-bit wrapping underflow
///
/// ## Gas Cost
/// 3 gas (GasFastestStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate result = (a - b) mod 2^256
/// 4. Push result to stack
///
/// ## Example
/// Stack: [30, 10] => [20]
/// Stack: [10, 20] => [2^256 - 10] (underflow wraps)
pub fn op_sub(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a -% b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// DIV opcode (0x04) - Unsigned integer division
///
/// Pops two values from the stack, divides the second by the top,
/// and pushes the integer quotient. Division by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend (second from top)
/// - `b`: Divisor (top)
///
/// ## Stack Output
/// - `a / b`: Integer quotient, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. If b = 0, result = 0 (no error)
/// 4. Else result = floor(a / b)
/// 5. Push result to stack
///
/// ## Example
/// Stack: [20, 5] => [4]
/// Stack: [7, 3] => [2] (integer division)
/// Stack: [100, 0] => [0] (division by zero)
///
/// ## Note
/// Unlike most programming languages, EVM division by zero does not
/// throw an error but returns 0. This is a deliberate design choice
/// to avoid exceptional halting conditions.
pub fn op_div(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = if (b == 0) 0 else a / b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SDIV opcode (0x05) - Signed integer division
///
/// Pops two values from the stack, interprets them as signed integers,
/// divides the second by the top, and pushes the signed quotient.
/// Division by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend as signed i256 (second from top)
/// - `b`: Divisor as signed i256 (top)
///
/// ## Stack Output
/// - `a / b`: Signed integer quotient, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Interpret both as two's complement signed integers
/// 4. If b = 0, result = 0
/// 5. Else if a = -2^255 and b = -1, result = -2^255 (overflow case)
/// 6. Else result = truncated division a / b
/// 7. Push result to stack
///
/// ## Example
/// Stack: [20, 5] => [4]
/// Stack: [-20, 5] => [-4] (0xfff...fec / 5)
/// Stack: [-20, -5] => [4]
/// Stack: [MIN_I256, -1] => [MIN_I256] (overflow protection)
///
/// ## Note
/// The special case for MIN_I256 / -1 prevents integer overflow,
/// as the mathematical result (2^255) cannot be represented in i256.
pub fn op_sdiv(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (b == 0) {
        result = 0;
    } else {
        const a_i256 = @as(i256, @bitCast(a));
        const b_i256 = @as(i256, @bitCast(b));
        const min_i256 = @as(i256, 1) << 255;
        if (a_i256 == min_i256 and b_i256 == -1) {
            result = @as(u256, @bitCast(min_i256));
        } else {
            const result_i256 = @divTrunc(a_i256, b_i256);
            result = @as(u256, @bitCast(result_i256));
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// MOD opcode (0x06) - Modulo remainder operation
///
/// Pops two values from the stack, calculates the remainder of dividing
/// the second by the top, and pushes the result. Modulo by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend (second from top)
/// - `b`: Divisor (top)
///
/// ## Stack Output
/// - `a % b`: Remainder of a / b, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. If b = 0, result = 0 (no error)
/// 4. Else result = a modulo b
/// 5. Push result to stack
///
/// ## Example
/// Stack: [17, 5] => [2]
/// Stack: [100, 10] => [0]
/// Stack: [7, 0] => [0] (modulo by zero)
///
/// ## Note
/// The result is always in range [0, b-1] for b > 0.
/// Like DIV, modulo by zero returns 0 rather than throwing an error.
pub fn op_mod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = if (b == 0) 0 else a % b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SMOD opcode (0x07) - Signed modulo remainder operation
///
/// Pops two values from the stack, interprets them as signed integers,
/// calculates the signed remainder, and pushes the result.
/// Modulo by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend as signed i256 (second from top)
/// - `b`: Divisor as signed i256 (top)
///
/// ## Stack Output
/// - `a % b`: Signed remainder, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Interpret both as two's complement signed integers
/// 4. If b = 0, result = 0
/// 5. Else result = signed remainder of a / b
/// 6. Push result to stack
///
/// ## Example
/// Stack: [17, 5] => [2]
/// Stack: [-17, 5] => [-2] (sign follows dividend)
/// Stack: [17, -5] => [2]
/// Stack: [-17, -5] => [-2]
///
/// ## Note
/// In signed modulo, the result has the same sign as the dividend (a).
/// This follows the Euclidean division convention where:
/// a = b * q + r, where |r| < |b| and sign(r) = sign(a)
pub fn op_smod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (b == 0) {
        result = 0;
    } else {
        const a_i256 = @as(i256, @bitCast(a));
        const b_i256 = @as(i256, @bitCast(b));
        const result_i256 = @rem(a_i256, b_i256);
        result = @as(u256, @bitCast(result_i256));
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// ADDMOD opcode (0x08) - Addition modulo n
///
/// Pops three values from the stack, adds the first two, then takes
/// the modulo with the third value. Handles overflow correctly by
/// computing (a + b) mod n, not ((a + b) mod 2^256) mod n.
///
/// ## Stack Input
/// - `a`: First addend (third from top)
/// - `b`: Second addend (second from top)
/// - `n`: Modulus (top)
///
/// ## Stack Output
/// - `(a + b) % n`: Sum modulo n, or 0 if n = 0
///
/// ## Gas Cost
/// 8 gas (GasMidStep)
///
/// ## Execution
/// 1. Pop n from stack (modulus)
/// 2. Pop b from stack (second addend)
/// 3. Pop a from stack (first addend)
/// 4. If n = 0, result = 0
/// 5. Else result = (a + b) mod n
/// 6. Push result to stack
///
/// ## Example
/// Stack: [10, 20, 7] => [2] ((10 + 20) % 7)
/// Stack: [MAX_U256, 5, 10] => [4] (overflow handled)
/// Stack: [50, 50, 0] => [0] (modulo by zero)
///
/// ## Note
/// This operation is atomic - the addition and modulo are
/// performed as one operation to handle cases where a + b
/// exceeds 2^256.
pub fn op_addmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 3);

    const n = frame.stack.pop_unsafe();
    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (n == 0) {
        result = 0;
    } else {
        // The EVM ADDMOD operation computes (a + b) % n
        // Since we're working with u256, overflow wraps automatically
        // So (a +% b) gives us (a + b) mod 2^256
        // Then we just need to compute that result mod n
        const sum = a +% b; // Wrapping addition
        result = sum % n;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// MULMOD opcode (0x09) - Multiplication modulo n
///
/// Pops three values from the stack, multiplies the first two, then
/// takes the modulo with the third value. Correctly handles cases where
/// the product exceeds 2^256.
///
/// ## Stack Input
/// - `a`: First multiplicand (third from top)
/// - `b`: Second multiplicand (second from top)
/// - `n`: Modulus (top)
///
/// ## Stack Output
/// - `(a * b) % n`: Product modulo n, or 0 if n = 0
///
/// ## Gas Cost
/// 8 gas (GasMidStep)
///
/// ## Execution
/// 1. Pop n from stack (modulus)
/// 2. Pop b from stack (second multiplicand)
/// 3. Pop a from stack (first multiplicand)
/// 4. If n = 0, result = 0
/// 5. Else compute (a * b) mod n using Russian peasant algorithm
/// 6. Push result to stack
///
/// ## Algorithm
/// Uses Russian peasant multiplication with modular reduction:
/// - Reduces inputs modulo n first
/// - Builds product bit by bit, reducing modulo n at each step
/// - Avoids need for 512-bit intermediate values
///
/// ## Example
/// Stack: [10, 20, 7] => [4] ((10 * 20) % 7)
/// Stack: [2^128, 2^128, 100] => [0] (handles overflow)
/// Stack: [50, 50, 0] => [0] (modulo by zero)
///
/// ## Note
/// This operation correctly computes (a * b) mod n even when
/// a * b exceeds 2^256, unlike naive (a *% b) % n approach.
pub fn op_mulmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 3);

    const n = frame.stack.pop_unsafe();
    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (n == 0) {
        result = 0;
    } else {
        // For MULMOD, we need to compute (a * b) % n where a * b might overflow
        // We can't just do (a *% b) % n because that would give us ((a * b) % 2^256) % n
        // which is not the same as (a * b) % n when a * b >= 2^256

        // We'll use the Russian peasant multiplication algorithm with modular reduction
        // This allows us to compute (a * b) % n without needing the full 512-bit product
        result = 0;
        var x = a % n;
        var y = b % n;

        while (y > 0) {
            // If y is odd, add x to result (mod n)
            if ((y & 1) == 1) {
                const sum = result +% x;
                result = sum % n;
            }

            x = (x +% x) % n;

            y >>= 1;
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// EXP opcode (0x0A) - Exponentiation
///
/// Pops two values from the stack and raises the second to the power
/// of the top. All operations are modulo 2^256.
///
/// ## Stack Input
/// - `a`: Base (second from top)
/// - `b`: Exponent (top)
///
/// ## Stack Output
/// - `a^b`: Result of a raised to power b, modulo 2^256
///
/// ## Gas Cost
/// - Static: 10 gas
/// - Dynamic: 50 gas per byte of exponent
/// - Total: 10 + 50 * byte_size_of_exponent
///
/// ## Execution
/// 1. Pop b from stack (exponent)
/// 2. Pop a from stack (base)
/// 3. Calculate dynamic gas cost based on exponent size
/// 4. Consume the dynamic gas
/// 5. Calculate a^b using binary exponentiation
/// 6. Push result to stack
///
/// ## Algorithm
/// Uses binary exponentiation (square-and-multiply):
/// - Processes exponent bit by bit
/// - Squares base for each bit position
/// - Multiplies result when bit is set
/// - All operations modulo 2^256
///
/// ## Example
/// Stack: [2, 10] => [1024]
/// Stack: [3, 4] => [81]
/// Stack: [10, 0] => [1] (anything^0 = 1)
/// Stack: [0, 10] => [0] (0^anything = 0, except 0^0 = 1)
///
/// ## Gas Examples
/// - 2^10: 10 + 50*1 = 60 gas (exponent fits in 1 byte)
/// - 2^256: 10 + 50*2 = 110 gas (exponent needs 2 bytes)
/// - 2^(2^255): 10 + 50*32 = 1610 gas (huge exponent)
pub fn op_exp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;

    std.debug.assert(frame.stack.size >= 2);

    const exp = frame.stack.pop_unsafe();
    const base = frame.stack.peek_unsafe().*;

    var exp_copy = exp;
    var byte_size: u64 = 0;
    while (exp_copy > 0) : (exp_copy >>= 8) {
        byte_size += 1;
    }
    if (byte_size > 0) {
        const gas_cost = 50 * byte_size;
        try frame.consume_gas(gas_cost);
    }

    var result: u256 = 1;
    var b = base;
    var e = exp;

    while (e > 0) {
        if ((e & 1) == 1) {
            result *%= b;
        }
        b *%= b;
        e >>= 1;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SIGNEXTEND opcode (0x0B) - Sign extension
///
/// Extends the sign bit of a value from a given byte position to fill
/// all higher-order bits. Used to convert smaller signed integers to
/// full 256-bit representation.
///
/// ## Stack Input
/// - `b`: Byte position of sign bit (0-indexed from right)
/// - `x`: Value to sign-extend
///
/// ## Stack Output
/// - Sign-extended value
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack (byte position)
/// 2. Pop x from stack (value to extend)
/// 3. If b >= 31, return x unchanged (already full width)
/// 4. Find sign bit at position (b * 8 + 7)
/// 5. If sign bit = 1, fill higher bits with 1s
/// 6. If sign bit = 0, fill higher bits with 0s
/// 7. Push result to stack
///
/// ## Byte Position
/// - b = 0: Extend from byte 0 (bits 0-7, rightmost byte)
/// - b = 1: Extend from byte 1 (bits 8-15)
/// - b = 31: Extend from byte 31 (bits 248-255, leftmost byte)
///
/// ## Example
/// Stack: [0, 0x7F] => [0x7F] (positive sign, no change)
/// Stack: [0, 0x80] => [0xFFFF...FF80] (negative sign extended)
/// Stack: [1, 0x80FF] => [0xFFFF...80FF] (extend from byte 1)
/// Stack: [31, x] => [x] (already full width)
///
/// ## Use Cases
/// - Converting int8/int16/etc to int256
/// - Arithmetic on mixed-width signed integers
/// - Implementing higher-level language semantics
pub fn op_signextend(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const byte_num = frame.stack.pop_unsafe();
    const x = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (byte_num >= 31) {
        result = x;
    } else {
        const byte_index = @as(u8, @intCast(byte_num));
        const sign_bit_pos = byte_index * 8 + 7;

        const sign_bit = (x >> @intCast(sign_bit_pos)) & 1;

        const keep_bits = sign_bit_pos + 1;

        if (sign_bit == 1) {
            // First, create a mask of all 1s for the upper bits
            if (keep_bits >= 256) {
                result = x;
            } else {
                const shift_amount = @as(u9, 256) - @as(u9, keep_bits);
                const ones_mask = ~(@as(u256, 0) >> @intCast(shift_amount));
                result = x | ones_mask;
            }
        } else {
            // Sign bit is 0, extend with 0s (just mask out upper bits)
            if (keep_bits >= 256) {
                result = x;
            } else {
                const zero_mask = (@as(u256, 1) << @intCast(keep_bits)) - 1;
                result = x & zero_mask;
            }
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/opcodes/control.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const ExecutionResult = @import("../execution_result.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const AccessList = @import("../access_list.zig").AccessList;
const Address = @import("Address");
const from_u256 = Address.from_u256;
const error_mapping = @import("../error_mapping.zig");

// Import helper function from error_mapping
const map_memory_error = error_mapping.map_memory_error;

pub fn op_stop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    return ExecutionError.Error.STOP;
}

pub fn op_jump(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 1);

    // Use unsafe pop since bounds checking is done by jump_table
    const dest = frame.stack.pop_unsafe();

    // Check if destination is a valid JUMPDEST (pass u256 directly)
    if (!frame.contract.valid_jumpdest(frame.allocator, dest)) return ExecutionError.Error.InvalidJump;

    // After validation, convert to usize for setting pc
    if (dest > std.math.maxInt(usize)) return ExecutionError.Error.InvalidJump;

    frame.pc = @as(usize, @intCast(dest));

    return ExecutionResult{};
}

pub fn op_jumpi(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const dest = values.b; // Second from top (was on top)
    const condition = values.a; // Third from top (was second)

    if (condition != 0) {
        // Check if destination is a valid JUMPDEST (pass u256 directly)
        if (!frame.contract.valid_jumpdest(frame.allocator, dest)) return ExecutionError.Error.InvalidJump;

        // After validation, convert to usize for setting pc
        if (dest > std.math.maxInt(usize)) return ExecutionError.Error.InvalidJump;

        frame.pc = @as(usize, @intCast(dest));
    }

    return ExecutionResult{};
}

pub fn op_pc(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size < Stack.CAPACITY);

    // Use unsafe push since bounds checking is done by jump_table
    frame.stack.append_unsafe(@as(u256, @intCast(pc)));

    return ExecutionResult{};
}

pub fn op_jumpdest(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // No-op, just marks valid jump destination
    return ExecutionResult{};
}

pub fn op_return(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const size = values.b; // Second from top (was on top)
    const offset = values.a; // Third from top (was second)

    if (size == 0) {
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);

            _ = frame.memory.ensure_context_capacity(end) catch |err| return map_memory_error(err);
        }

        // Get data from memory
        const data = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);

        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        frame.return_data_buffer = data;
    }

    return ExecutionError.Error.STOP; // RETURN ends execution normally
}

pub fn op_revert(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const size = values.b; // Second from top (was on top)
    const offset = values.a; // Third from top (was second)

    if (size == 0) {
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);

            _ = frame.memory.ensure_context_capacity(end) catch |err| return map_memory_error(err);
        }

        // Get data from memory
        const data = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);

        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        frame.return_data_buffer = data;
    }

    return ExecutionError.Error.REVERT;
}

pub fn op_invalid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug: op_invalid entered
    // INVALID opcode consumes all remaining gas
    frame.gas_remaining = 0;
    // Debug: op_invalid returning InvalidOpcode

    return ExecutionError.Error.InvalidOpcode;
}

pub fn op_selfdestruct(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Check if we're in a static call
    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    std.debug.assert(frame.stack.size >= 1);

    // Use unsafe pop since bounds checking is done by jump_table
    const beneficiary_u256 = frame.stack.pop_unsafe();
    const beneficiary = from_u256(beneficiary_u256);

    // EIP-2929: Check if beneficiary address is cold and consume appropriate gas
    const access_cost = vm.access_list.access_address(beneficiary) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Schedule selfdestruct for execution at the end of the transaction
    // For now, just return STOP

    return ExecutionError.Error.STOP;
}
```
```zig [src/evm/opcodes/package.zig]
// Package file for opcodes modules
// This file serves as the entry point for importing opcode modules

// Re-export all opcode modules for easy access
pub const arithmetic = @import("arithmetic.zig");
pub const bitwise = @import("bitwise.zig");
pub const block = @import("block.zig");
pub const comparison = @import("comparison.zig");
pub const control = @import("control.zig");
pub const crypto = @import("crypto.zig");
pub const environment = @import("environment.zig");
pub const log = @import("log.zig");
pub const memory = @import("memory.zig");
pub const stack = @import("stack.zig");
pub const storage = @import("storage.zig");
pub const system = @import("system.zig");

// Re-export common types
pub const Operation = @import("../operation.zig");
pub const ExecutionError = @import("../execution_error.zig");
pub const Frame = @import("../frame.zig");
pub const Stack = @import("../stack.zig");
pub const Memory = @import("../memory.zig");
pub const Vm = @import("../vm.zig");
pub const Contract = @import("../contract.zig");
pub const gas_constants = @import("../gas_constants.zig");
```
```zig [src/evm/opcodes/bitwise.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");

pub fn op_and(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a & b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_or(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a | b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_xor(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a ^ b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_not(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 1);

    const value = frame.stack.peek_unsafe().*;

    const result = ~value;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_byte(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const i = frame.stack.pop_unsafe();
    const val = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (i >= 32) {
        result = 0;
    } else {
        const i_usize = @as(usize, @intCast(i));
        // Byte 0 is MSB, byte 31 is LSB
        // To get byte i, we need to shift right by (31 - i) * 8 positions
        const shift_amount = (31 - i_usize) * 8;
        result = (val >> @intCast(shift_amount)) & 0xFF;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_shl(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const shift = frame.stack.pop_unsafe();
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        result = 0;
    } else {
        result = value << @intCast(shift);
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_shr(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const shift = frame.stack.pop_unsafe();
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        result = 0;
    } else {
        result = value >> @intCast(shift);
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_sar(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const shift = frame.stack.pop_unsafe();
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        const sign_bit = value >> 255;
        if (sign_bit == 1) {
            result = std.math.maxInt(u256);
        } else {
            result = 0;
        }
    } else {
        // Arithmetic shift preserving sign
        const shift_amount = @as(u8, @intCast(shift));
        const value_i256 = @as(i256, @bitCast(value));
        const result_i256 = value_i256 >> shift_amount;
        result = @as(u256, @bitCast(result_i256));
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/opcodes/crypto.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const error_mapping = @import("../error_mapping.zig");

// Import helper functions from error_mapping
const stack_pop = error_mapping.stack_pop;
const stack_push = error_mapping.stack_push;
const map_memory_error = error_mapping.map_memory_error;

pub fn op_sha3(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);

    // Check bounds before anything else
    if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    if (size == 0) {
        // Even with size 0, we need to validate the offset is reasonable
        if (offset > 0) {
            // Check if offset is beyond reasonable memory limits
            const offset_usize = @as(usize, @intCast(offset));
            const memory_limits = @import("../memory_limits.zig");
            if (offset_usize > memory_limits.MAX_MEMORY_SIZE) return ExecutionError.Error.OutOfOffset;
        }
        // Hash of empty data = keccak256("")
        const empty_hash: u256 = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        try stack_push(&frame.stack, empty_hash);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));
    const size_usize = @as(usize, @intCast(size));

    // Check if offset + size would overflow
    const end = std.math.add(usize, offset_usize, size_usize) catch {
        return ExecutionError.Error.OutOfOffset;
    };

    // Check if the end position exceeds reasonable memory limits
    const memory_limits = @import("../memory_limits.zig");
    if (end > memory_limits.MAX_MEMORY_SIZE) return ExecutionError.Error.OutOfOffset;

    // Dynamic gas cost for hashing
    const word_size = (size_usize + 31) / 32;
    const gas_cost = 6 * word_size;
    _ = vm;
    try frame.consume_gas(gas_cost);

    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(offset_usize + size_usize) catch |err| return map_memory_error(err);

    // Get data and hash
    const data = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);

    // Calculate keccak256 hash
    var hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(data, &hash, .{});

    // Hash calculated successfully

    // Convert hash to u256
    var result: u256 = 0;
    for (hash) |byte| {
        result = (result << 8) | byte;
    }

    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}

// Alias for backwards compatibility
pub const op_keccak256 = op_sha3;
```
```zig [src/evm/opcodes/environment.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;
const gas_constants = @import("../gas_constants.zig");
const AccessList = @import("../access_list.zig").AccessList;
const error_mapping = @import("../error_mapping.zig");

// Import helper functions from error_mapping
const stack_pop = error_mapping.stack_pop;
const stack_push = error_mapping.stack_push;
const map_memory_error = error_mapping.map_memory_error;

pub fn op_address(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push contract address as u256
    const addr = to_u256(frame.contract.address);
    try stack_push(&frame.stack, addr);

    return Operation.ExecutionResult{};
}

pub fn op_balance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try stack_pop(&frame.stack);
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get balance from VM state
    const balance = vm.state.get_balance(address);
    try stack_push(&frame.stack, balance);

    return Operation.ExecutionResult{};
}

pub fn op_origin(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push transaction origin address
    const origin = to_u256(vm.context.tx_origin);
    try stack_push(&frame.stack, origin);

    return Operation.ExecutionResult{};
}

pub fn op_caller(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push caller address
    const caller = to_u256(frame.contract.caller);
    try stack_push(&frame.stack, caller);

    return Operation.ExecutionResult{};
}

pub fn op_callvalue(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push call value
    try stack_push(&frame.stack, frame.contract.value);

    return Operation.ExecutionResult{};
}

pub fn op_gasprice(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push gas price from transaction context
    try stack_push(&frame.stack, vm.context.gas_price);

    return Operation.ExecutionResult{};
}

pub fn op_extcodesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try stack_pop(&frame.stack);
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get code size from VM state
    const code = vm.state.get_code(address);
    try stack_push(&frame.stack, @as(u256, @intCast(code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_extcodecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try stack_pop(&frame.stack);
    const mem_offset = try stack_pop(&frame.stack);
    const code_offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const address = from_u256(address_u256);
    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get external code from VM state
    const code = vm.state.get_code(address);

    // Use set_data_bounded to copy the code to memory
    // This handles partial copies and zero-padding automatically
    try error_mapping.memory_set_data_bounded(&frame.memory, mem_offset_usize, code, code_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_extcodehash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try stack_pop(&frame.stack);
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get code from VM state and compute hash
    const code = vm.state.get_code(address);
    if (code.len == 0) {
        // Empty account - return zero
        try stack_push(&frame.stack, 0);
    } else {
        // Compute keccak256 hash of the code
        var hash: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(code, &hash, .{});

        // Convert hash to u256
        var hash_u256: u256 = 0;
        for (hash) |byte| {
            hash_u256 = (hash_u256 << 8) | byte;
        }
        try stack_push(&frame.stack, hash_u256);
    }

    return Operation.ExecutionResult{};
}

pub fn op_selfbalance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get balance of current executing contract
    const self_address = frame.contract.address;
    const balance = vm.state.get_balance(self_address);
    try stack_push(&frame.stack, balance);

    return Operation.ExecutionResult{};
}

pub fn op_chainid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push chain ID from VM context
    try stack_push(&frame.stack, vm.context.chain_id);

    return Operation.ExecutionResult{};
}

pub fn op_calldatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push size of calldata - use frame.input which is set by the VM
    // The frame.input is the actual calldata for this execution context
    try stack_push(&frame.stack, @as(u256, @intCast(frame.input.len)));

    return Operation.ExecutionResult{};
}

pub fn op_codesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push size of current contract's code
    try stack_push(&frame.stack, @as(u256, @intCast(frame.contract.code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_calldataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop offset from stack
    const offset = try stack_pop(&frame.stack);

    if (offset > std.math.maxInt(usize)) {
        // Offset too large, push zero
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));
    const calldata = frame.input; // Use frame.input, not frame.contract.input

    // Load 32 bytes from calldata, padding with zeros if necessary
    var value: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        if (offset_usize + i < calldata.len) {
            value = (value << 8) | calldata[offset_usize + i];
        } else {
            value = value << 8; // Pad with zero
        }
    }

    try stack_push(&frame.stack, value);

    return Operation.ExecutionResult{};
}

pub fn op_calldatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop memory offset, data offset, and size
    const mem_offset = try stack_pop(&frame.stack);
    const data_offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation (VERYLOW * word_count)
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get calldata from frame.input
    const calldata = frame.input;

    // Use set_data_bounded to copy the calldata to memory
    // This handles partial copies and zero-padding automatically
    try error_mapping.memory_set_data_bounded(&frame.memory, mem_offset_usize, calldata, data_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_codecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop memory offset, code offset, and size
    const mem_offset = try stack_pop(&frame.stack);
    const code_offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get current contract code
    const code = frame.contract.code;

    // Use set_data_bounded to copy the code to memory
    // This handles partial copies and zero-padding automatically
    try error_mapping.memory_set_data_bounded(&frame.memory, mem_offset_usize, code, code_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}
/// RETURNDATALOAD opcode (0xF7): Loads a 32-byte word from return data
/// This is an EOF opcode that allows reading from the return data buffer
pub fn op_returndataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop offset from stack
    const offset = try stack_pop(&frame.stack);

    // Check if offset is within bounds
    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));
    const return_data = frame.return_data_buffer;

    // If offset + 32 > return_data.len, this is an error (unlike CALLDATALOAD which pads with zeros)
    if (offset_usize + 32 > return_data.len) return ExecutionError.Error.OutOfOffset;

    // Load 32 bytes from return data
    var value: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        value = (value << 8) | return_data[offset_usize + i];
    }

    try stack_push(&frame.stack, value);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/opcodes/log.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const Address = @import("Address");
const error_mapping = @import("../error_mapping.zig");

// Compile-time verification that this file is being used
const COMPILE_TIME_LOG_VERSION = "2024_LOG_FIX_V2";

// Import Log struct from VM
const Log = Vm.Log;

// Import helper functions from error_mapping
const stack_pop = error_mapping.stack_pop;
const stack_push = error_mapping.stack_push;
const map_memory_error = error_mapping.map_memory_error;

pub fn make_log(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn log(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));
            const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

            // Debug logging removed for production

            // Check if we're in a static call
            if (frame.is_static) return ExecutionError.Error.WriteProtection;

            // REVM EXACT MATCH: Pop offset first, then len (revm: popn!([offset, len]))
            const offset = try stack_pop(&frame.stack);
            const size = try stack_pop(&frame.stack);

            // Debug logging removed for production

            // Pop N topics in order and store them in REVERSE (revm: stack.popn::<N>() returns in push order)
            var topics: [4]u256 = undefined;
            for (0..n) |i| {
                topics[n - 1 - i] = try stack_pop(&frame.stack);
                // Topic popped successfully
            }

            if (size == 0) {
                // Empty data
                // Emit empty log
                try vm.emit_log(frame.contract.address, topics[0..n], &[_]u8{});
                return Operation.ExecutionResult{};
            }

            // Process non-empty log data

            if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
                // Offset or size exceeds maximum
                return ExecutionError.Error.OutOfOffset;
            }

            const offset_usize = @as(usize, @intCast(offset));
            const size_usize = @as(usize, @intCast(size));

            // Convert to usize for memory operations

            // Note: Base LOG gas (375) and topic gas (375 * N) are handled by jump table as constant_gas
            // We only need to handle dynamic costs: memory expansion and data bytes

            // 1. Calculate memory expansion gas cost
            const current_size = frame.memory.context_size();
            const new_size = offset_usize + size_usize;
            const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);

            // Memory expansion gas calculated

            try frame.consume_gas(memory_gas);

            // 2. Dynamic gas for data
            const byte_cost = gas_constants.LogDataGas * size_usize;

            // Calculate dynamic gas for data

            try frame.consume_gas(byte_cost);

            // Gas consumed successfully

            // Ensure memory is available
            _ = frame.memory.ensure_context_capacity(offset_usize + size_usize) catch |err| {
                // Memory allocation failed
                return map_memory_error(err);
            };

            // Get log data
            const data = frame.memory.get_slice(offset_usize, size_usize) catch |err| {
                // Failed to get memory slice
                return map_memory_error(err);
            };

            // Emit log with data

            // Add log
            try vm.emit_log(frame.contract.address, topics[0..n], data);

            return Operation.ExecutionResult{};
        }
    }.log;
}

// LOG operations are now generated directly in jump_table.zig using make_log()
```
```zig [src/evm/opcodes/memory.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Memory = @import("../memory.zig");
const gas_constants = @import("../gas_constants.zig");
const error_mapping = @import("../error_mapping.zig");

// Import helper functions from error_mapping for operations we can't optimize
const map_memory_error = error_mapping.map_memory_error;

// Helper to check if u256 fits in usize
inline fn check_offset_bounds(value: u256) ExecutionError.Error!void {
    if (value > std.math.maxInt(usize)) return ExecutionError.Error.InvalidOffset;
}

pub fn op_mload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 1);

    // Get offset from top of stack unsafely - bounds checking is done in jump_table.zig
    const offset = frame.stack.peek_unsafe().*;

    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 32;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);

    try frame.consume_gas(gas_cost);

    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(offset_usize + 32) catch |err| return map_memory_error(err);

    // Read 32 bytes from memory
    const value = frame.memory.get_u256(offset_usize) catch |err| return map_memory_error(err);

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

pub fn op_mstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // EVM Stack: [..., value, offset] where offset is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const offset = popped.b; // Second popped (was top)

    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 32; // MSTORE writes 32 bytes
    const expansion_gas_cost = gas_constants.memory_gas_cost(current_size, new_size);

    try frame.consume_gas(expansion_gas_cost);

    // Ensure memory is available
    try error_mapping.memory_ensure_capacity(&frame.memory, offset_usize + 32);

    // Write 32 bytes to memory (big-endian)
    try error_mapping.memory_set_u256(&frame.memory, offset_usize, value);

    return Operation.ExecutionResult{};
}

pub fn op_mstore8(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // EVM Stack: [..., value, offset] where offset is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const offset = popped.b; // Second popped (was top)

    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 1;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(gas_cost);

    // Ensure memory is available - expand to word boundary to match gas calculation
    const word_aligned_size = ((new_size + 31) / 32) * 32;
    try error_mapping.memory_ensure_capacity(&frame.memory, word_aligned_size);

    // Write single byte to memory
    const byte_value = @as(u8, @truncate(value));
    try error_mapping.memory_set_byte(&frame.memory, offset_usize, byte_value);

    return Operation.ExecutionResult{};
}

pub fn op_msize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size < Stack.CAPACITY);

    // MSIZE returns the size in bytes, but memory is always expanded in 32-byte words
    // So we need to round up to the nearest word boundary
    const size = frame.memory.context_size();
    const word_aligned_size = ((size + 31) / 32) * 32;

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(word_aligned_size)));

    return Operation.ExecutionResult{};
}

pub fn op_mcopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 3);

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., dest, src, size] (top to bottom)
    const size = frame.stack.pop_unsafe();
    const src = frame.stack.pop_unsafe();
    const dest = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (dest > std.math.maxInt(usize) or src > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const dest_usize = @as(usize, @intCast(dest));
    const src_usize = @as(usize, @intCast(src));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const max_addr = @max(dest_usize + size_usize, src_usize + size_usize);
    const memory_gas = gas_constants.memory_gas_cost(current_size, max_addr);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available for both source and destination
    try error_mapping.memory_ensure_capacity(&frame.memory, max_addr);

    // Copy with overlap handling
    try error_mapping.memory_copy_within(&frame.memory, src_usize, dest_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_calldataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 1);

    // Get offset from top of stack unsafely - bounds checking is done in jump_table.zig
    const offset = frame.stack.peek_unsafe().*;

    if (offset > std.math.maxInt(usize)) {
        // Replace top of stack with 0
        frame.stack.set_top_unsafe(0);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));

    // Read 32 bytes from calldata (pad with zeros)
    var result: u256 = 0;

    for (0..32) |i| {
        if (offset_usize + i < frame.input.len) {
            result = (result << 8) | frame.input[offset_usize + i];
        } else {
            result = result << 8;
        }
    }

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_calldatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size < Stack.CAPACITY);

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.input.len)));

    return Operation.ExecutionResult{};
}

pub fn op_calldatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 3);

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, data_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const data_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(mem_offset_usize + size_usize) catch |err| return map_memory_error(err);

    // Copy calldata to memory
    frame.memory.set_data_bounded(mem_offset_usize, frame.input, data_offset_usize, size_usize) catch |err| return map_memory_error(err);

    return Operation.ExecutionResult{};
}

pub fn op_codesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size < Stack.CAPACITY);

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.contract.code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_codecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 3);

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, code_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const code_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(mem_offset_usize + size_usize) catch |err| return map_memory_error(err);

    // Copy code to memory
    frame.memory.set_data_bounded(mem_offset_usize, frame.contract.code, code_offset_usize, size_usize) catch |err| return map_memory_error(err);

    return Operation.ExecutionResult{};
}

pub fn op_returndatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size < Stack.CAPACITY);

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.return_data_buffer.len)));

    return Operation.ExecutionResult{};
}

pub fn op_returndatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 3);

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, data_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const data_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Check bounds
    if (data_offset_usize + size_usize > frame.return_data_buffer.len) return ExecutionError.Error.ReturnDataOutOfBounds;

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(mem_offset_usize + size_usize) catch |err| return map_memory_error(err);

    // Copy return data to memory
    frame.memory.set_data(mem_offset_usize, frame.return_data_buffer[data_offset_usize .. data_offset_usize + size_usize]) catch |err| return map_memory_error(err);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/opcodes/storage.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const error_mapping = @import("../error_mapping.zig");
const Address = @import("Address");
const Log = @import("../log.zig");

// EIP-3529 (London) gas costs for SSTORE
const SSTORE_SET_GAS: u64 = 20000;
const SSTORE_RESET_GAS: u64 = 2900;
const SSTORE_CLEARS_REFUND: u64 = 4800;

// Helper to convert Stack errors to ExecutionError
fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| switch (err) {
        Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
}

fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

fn calculate_sstore_gas(current: u256, new: u256) u64 {
    if (current == new) return 0;
    if (current == 0) return SSTORE_SET_GAS;
    if (new == 0) return SSTORE_RESET_GAS;
    return SSTORE_RESET_GAS;
}

pub fn op_sload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    std.debug.assert(frame.stack.size >= 1);

    const slot = frame.stack.peek_unsafe().*;

    if (vm.chain_rules.IsBerlin) {
        const Contract = @import("../contract.zig");
        const is_cold = frame.contract.mark_storage_slot_warm(frame.allocator, slot, null) catch |err| switch (err) {
            Contract.MarkStorageSlotWarmError.OutOfAllocatorMemory => {
                return ExecutionError.Error.OutOfMemory;
            },
        };
        const gas_cost = if (is_cold) gas_constants.ColdSloadCost else gas_constants.WarmStorageReadCost;
        try frame.consume_gas(gas_cost);
    } else {
        // Pre-Berlin: gas is handled by jump table constant_gas
        // For Istanbul, this would be 800 gas set in the jump table
    }

    const value = try error_mapping.vm_get_storage(vm, frame.contract.address, slot);

    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

/// SSTORE opcode - Store value in persistent storage
pub fn op_sstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    // EIP-1706: Disable SSTORE with gasleft lower than call stipend (2300)
    // This prevents reentrancy attacks by ensuring enough gas remains for exception handling
    if (vm.chain_rules.IsIstanbul and frame.gas_remaining <= gas_constants.SstoreSentryGas) return ExecutionError.Error.OutOfGas;

    std.debug.assert(frame.stack.size >= 2);

    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    const current_value = try error_mapping.vm_get_storage(vm, frame.contract.address, slot);

    const Contract = @import("../contract.zig");
    const is_cold = frame.contract.mark_storage_slot_warm(frame.allocator, slot, null) catch |err| switch (err) {
        Contract.MarkStorageSlotWarmError.OutOfAllocatorMemory => {
            Log.err("SSTORE: mark_storage_slot_warm failed: {}", .{err});
            return ExecutionError.Error.OutOfMemory;
        },
    };

    var total_gas: u64 = 0;

    if (is_cold) {
        total_gas += gas_constants.ColdSloadCost;
    }

    // Add dynamic gas based on value change
    const dynamic_gas = calculate_sstore_gas(current_value, value);
    total_gas += dynamic_gas;

    // Consume all gas at once
    try frame.consume_gas(total_gas);

    try error_mapping.vm_set_storage(vm, frame.contract.address, slot, value);

    return Operation.ExecutionResult{};
}

pub fn op_tload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Gas is already handled by jump table constant_gas = 100

    std.debug.assert(frame.stack.size >= 1);

    // Get slot from top of stack unsafely - bounds checking is done in jump_table.zig
    const slot = frame.stack.peek_unsafe().*;

    const value = try error_mapping.vm_get_transient_storage(vm, frame.contract.address, slot);

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

pub fn op_tstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    // Gas is already handled by jump table constant_gas = 100

    std.debug.assert(frame.stack.size >= 2);

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    try error_mapping.vm_set_transient_storage(vm, frame.contract.address, slot, value);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/opcodes/stack.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const error_mapping = @import("../error_mapping.zig");

pub fn op_pop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    _ = try error_mapping.stack_pop(&frame.stack);

    return Operation.ExecutionResult{};
}

pub fn op_push0(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try error_mapping.stack_push(&frame.stack, 0);

    return Operation.ExecutionResult{};
}

// Generate push operations for PUSH1 through PUSH32
pub fn make_push(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn push(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            std.debug.assert(frame.stack.size < Stack.CAPACITY);

            var value: u256 = 0;
            const code = frame.contract.code;

            for (0..n) |i| {
                if (pc + 1 + i < code.len) {
                    value = (value << 8) | code[pc + 1 + i];
                } else {
                    value = value << 8;
                }
            }

            frame.stack.append_unsafe(value);

            // PUSH operations consume 1 + n bytes
            // (1 for the opcode itself, n for the immediate data)
            return Operation.ExecutionResult{ .bytes_consumed = 1 + n };
        }
    }.push;
}

// PUSH operations are now generated directly in jump_table.zig using make_push()

// Generate dup operations
pub fn make_dup(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn dup(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            std.debug.assert(frame.stack.size >= n);
            std.debug.assert(frame.stack.size < Stack.CAPACITY);

            frame.stack.dup_unsafe(n);

            return Operation.ExecutionResult{};
        }
    }.dup;
}

// DUP operations are now generated directly in jump_table.zig using make_dup()

// Generate swap operations
pub fn make_swap(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn swap(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            std.debug.assert(frame.stack.size >= n + 1);

            frame.stack.swapUnsafe(n);

            return Operation.ExecutionResult{};
        }
    }.swap;
}

// SWAP operations are now generated directly in jump_table.zig using make_swap()
```
```zig [src/evm/opcodes/block.zig]
const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Address = @import("Address");
const error_mapping = @import("../error_mapping.zig");

pub fn op_blockhash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const block_number = try error_mapping.stack_pop(&frame.stack);

    const current_block = vm.context.block_number;

    if (block_number >= current_block) {
        try error_mapping.stack_push(&frame.stack, 0);
    } else if (current_block > block_number + 256) {
        try error_mapping.stack_push(&frame.stack, 0);
    } else if (block_number == 0) {
        try error_mapping.stack_push(&frame.stack, 0);
    } else {
        // Return a pseudo-hash based on block number for testing
        // In production, this would retrieve the actual block hash from chain history
        const hash = std.hash.Wyhash.hash(0, std.mem.asBytes(&block_number));
        try error_mapping.stack_push(&frame.stack, hash);
    }

    return Operation.ExecutionResult{};
}

pub fn op_coinbase(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try error_mapping.stack_push(&frame.stack, Address.to_u256(vm.context.block_coinbase));

    return Operation.ExecutionResult{};
}

pub fn op_timestamp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try error_mapping.stack_push(&frame.stack, @as(u256, @intCast(vm.context.block_timestamp)));

    return Operation.ExecutionResult{};
}

pub fn op_number(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try error_mapping.stack_push(&frame.stack, @as(u256, @intCast(vm.context.block_number)));

    return Operation.ExecutionResult{};
}

pub fn op_difficulty(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get difficulty/prevrandao from block context
    // Post-merge this returns PREVRANDAO
    try error_mapping.stack_push(&frame.stack, vm.context.block_difficulty);

    return Operation.ExecutionResult{};
}

pub fn op_prevrandao(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    // Same as difficulty post-merge
    return op_difficulty(pc, interpreter, state);
}

pub fn op_gaslimit(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try error_mapping.stack_push(&frame.stack, @as(u256, @intCast(vm.context.block_gas_limit)));

    return Operation.ExecutionResult{};
}

pub fn op_basefee(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get base fee from block context
    // Push base fee (EIP-1559)
    try error_mapping.stack_push(&frame.stack, vm.context.block_base_fee);

    return Operation.ExecutionResult{};
}

pub fn op_blobhash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const index = try error_mapping.stack_pop(&frame.stack);

    // EIP-4844: Get blob hash at index
    if (index >= vm.context.blob_hashes.len) {
        try error_mapping.stack_push(&frame.stack, 0);
    } else {
        const idx = @as(usize, @intCast(index));
        try error_mapping.stack_push(&frame.stack, vm.context.blob_hashes[idx]);
    }

    return Operation.ExecutionResult{};
}

pub fn op_blobbasefee(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get blob base fee from block context
    // Push blob base fee (EIP-4844)
    try error_mapping.stack_push(&frame.stack, vm.context.blob_base_fee);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/context.zig]
const std = @import("std");
const Address = @import("Address");

/// Execution context providing transaction and block information to the EVM.
///
/// This structure encapsulates all environmental data that smart contracts
/// can access during execution. It provides the context needed for opcodes
/// like ORIGIN, TIMESTAMP, COINBASE, etc. to return appropriate values.
///
/// ## Purpose
/// The context separates environmental information from the VM's execution
/// state, enabling:
/// - Consistent environment across nested calls
/// - Easy testing with mock environments
/// - Support for historical block execution
/// - Fork simulation with custom parameters
///
/// ## Opcode Mapping
/// Context fields map directly to EVM opcodes:
/// - `tx_origin` → ORIGIN (0x32)
/// - `gas_price` → GASPRICE (0x3A)
/// - `block_number` → NUMBER (0x43)
/// - `block_timestamp` → TIMESTAMP (0x42)
/// - `block_coinbase` → COINBASE (0x41)
/// - `block_difficulty` → DIFFICULTY/PREVRANDAO (0x44)
/// - `block_gas_limit` → GASLIMIT (0x45)
/// - `chain_id` → CHAINID (0x46)
/// - `block_base_fee` → BASEFEE (0x48)
/// - `blob_hashes` → BLOBHASH (0x49)
///
/// ## Usage Example
/// ```zig
/// const context = Context.init_with_values(
///     .tx_origin = sender_address,
///     .gas_price = 20_000_000_000, // 20 gwei
///     .block_number = 15_000_000,
///     .block_timestamp = 1656633600,
///     .block_coinbase = miner_address,
///     .block_difficulty = 0, // post-merge
///     .block_gas_limit = 30_000_000,
///     .chain_id = 1, // mainnet
///     .block_base_fee = 15_000_000_000,
///     .blob_hashes = &.{},
///     .blob_base_fee = 1,
/// );
/// ```
const Self = @This();

/// The original sender address that initiated the transaction.
///
/// ## ORIGIN Opcode (0x32)
/// This value remains constant throughout all nested calls and
/// represents the externally-owned account (EOA) that signed the
/// transaction.
///
/// ## Security Warning
/// Using tx.origin for authentication is dangerous as it can be
/// exploited through phishing attacks. Always use msg.sender instead.
///
/// ## Example
/// EOA → Contract A → Contract B → Contract C
/// - tx.origin = EOA (same for all)
/// - msg.sender differs at each level
tx_origin: Address.Address = Address.zero(),
/// The gas price for the current transaction in wei.
///
/// ## GASPRICE Opcode (0x3A)
/// Returns the effective gas price that the transaction is paying:
/// - Legacy transactions: The specified gas price
/// - EIP-1559 transactions: min(maxFeePerGas, baseFee + maxPriorityFeePerGas)
///
/// ## Typical Values
/// - 1 gwei = 1,000,000,000 wei
/// - Mainnet: Usually 10-100 gwei
/// - Test networks: Often 0 or 1 gwei
gas_price: u256 = 0,
/// The current block number (height).
///
/// ## NUMBER Opcode (0x43)
/// Returns the number of the block being executed. Block numbers
/// start at 0 (genesis) and increment by 1 for each block.
///
/// ## Network Examples
/// - Mainnet genesis: 0
/// - The Merge: ~15,537,394
/// - Typical mainnet: >18,000,000
///
/// ## Use Cases
/// - Time-locked functionality
/// - Random number generation (pre-Merge)
/// - Historical reference points
block_number: u64 = 0,
/// The current block's timestamp in Unix seconds.
///
/// ## TIMESTAMP Opcode (0x42)
/// Returns seconds since Unix epoch (January 1, 1970).
/// Miners/validators can manipulate this within limits:
/// - Must be > parent timestamp
/// - Should be close to real time
///
/// ## Time Precision
/// - Pre-Merge: ~13 second blocks, loose precision
/// - Post-Merge: 12 second slots, more predictable
///
/// ## Security Note
/// Can be manipulated by miners/validators within ~15 seconds.
/// Not suitable for precise timing or as randomness source.
block_timestamp: u64 = 0,
/// The address of the block's miner/validator (beneficiary).
///
/// ## COINBASE Opcode (0x41)
/// Returns the address that receives block rewards and fees:
/// - Pre-Merge: Miner who found the block
/// - Post-Merge: Validator proposing the block
///
/// ## Special Values
/// - Zero address: Often used in tests
/// - Burn address: Some L2s burn fees
///
/// ## MEV Considerations
/// Searchers often send payments to block.coinbase for
/// transaction inclusion guarantees.
block_coinbase: Address.Address = Address.zero(),
/// Block difficulty (pre-Merge) or PREVRANDAO (post-Merge).
///
/// ## DIFFICULTY/PREVRANDAO Opcode (0x44)
/// The meaning changed at The Merge:
/// - Pre-Merge: Mining difficulty value
/// - Post-Merge: Previous block's RANDAO value
///
/// ## PREVRANDAO Usage
/// Provides weak randomness from beacon chain:
/// - NOT cryptographically secure
/// - Can be biased by validators
/// - Suitable only for non-critical randomness
///
/// ## Typical Values
/// - Pre-Merge: 10^15 to 10^16 range
/// - Post-Merge: Random 256-bit value
block_difficulty: u256 = 0,
/// Maximum gas allowed in the current block.
///
/// ## GASLIMIT Opcode (0x45)
/// Returns the total gas limit for all transactions in the block.
/// This limit is adjusted by miners/validators within protocol rules:
/// - Can change by max 1/1024 per block
/// - Target: 15M gas (100% full blocks)
/// - Max: 30M gas (200% full blocks)
///
/// ## Typical Values
/// - Mainnet: ~30,000,000
/// - Some L2s: 100,000,000+
///
/// ## EIP-1559 Impact
/// Elastic block sizes allow temporary increases to 2x target.
block_gas_limit: u64 = 0,
/// The chain identifier for replay protection.
///
/// ## CHAINID Opcode (0x46)
/// Returns the unique identifier for the current chain,
/// preventing transaction replay across different networks.
///
/// ## Common Values
/// - 1: Ethereum Mainnet
/// - 5: Goerli (deprecated)
/// - 11155111: Sepolia
/// - 137: Polygon
/// - 10: Optimism
/// - 42161: Arbitrum One
///
/// ## EIP-155
/// Introduced chain ID to prevent replay attacks where
/// signed transactions could be valid on multiple chains.
chain_id: u256 = 1,
/// The base fee per gas for the current block (EIP-1559).
///
/// ## BASEFEE Opcode (0x48)
/// Returns the minimum fee per gas that must be paid for
/// transaction inclusion. Dynamically adjusted based on
/// parent block's gas usage:
/// - Increases if blocks are >50% full
/// - Decreases if blocks are <50% full
/// - Changes by max 12.5% per block
///
/// ## Fee Calculation
/// Total fee = (base fee + priority fee) * gas used
/// Base fee is burned, priority fee goes to validator.
///
/// ## Typical Values
/// - Low congestion: 5-10 gwei
/// - Normal: 15-30 gwei  
/// - High congestion: 100+ gwei
block_base_fee: u256 = 0,
/// List of blob hashes for EIP-4844 blob transactions.
///
/// ## BLOBHASH Opcode (0x49)
/// Returns the hash of a blob at the specified index.
/// Blob transactions can include up to 6 blobs, each
/// containing ~125KB of data for L2 data availability.
///
/// ## Blob Properties
/// - Size: 4096 field elements (~125KB)
/// - Hash: KZG commitment of blob data
/// - Lifetime: ~18 days on chain
/// - Cost: Separate blob fee market
///
/// ## Empty for Non-Blob Transactions
/// Regular transactions have no blob hashes.
blob_hashes: []const u256 = &[_]u256{},
/// The base fee per blob gas for the current block (EIP-4844).
///
/// ## BLOBBASEFEE Opcode (0x4A)  
/// Returns the current base fee for blob gas, which uses
/// a separate fee market from regular transaction gas.
///
/// ## Blob Fee Market
/// - Independent from regular gas fees
/// - Target: 3 blobs per block
/// - Max: 6 blobs per block
/// - Adjusts similar to EIP-1559
///
/// ## Cost Calculation
/// Blob cost = blob_base_fee * blob_gas_used
/// Where blob_gas_used = num_blobs * 131,072
///
/// ## Typical Values
/// - Low usage: 1 wei
/// - High usage: Can spike significantly
blob_base_fee: u256 = 0,

/// Creates a new context with default values.
///
/// ## Default Values
/// - All addresses: Zero address (0x0000...0000)
/// - All numbers: 0
/// - Chain ID: 1 (Ethereum mainnet)
/// - Blob hashes: Empty array
///
/// ## Usage
/// ```zig
/// const context = Context.init();
/// // Suitable for basic testing, but usually you'll want
/// // to set more realistic values
/// ```
///
  <
/// ## Warning
/// Default values may not be suitable for production use.
/// Consider using `init_with_values` for realistic contexts.
pub fn init() Self {
    return .{};
}

/// Creates a new context with specified values.
///
/// This constructor allows full control over all environmental
/// parameters, enabling accurate simulation of any blockchain state.
///
/// ## Parameters
/// - `tx_origin`: EOA that initiated the transaction
/// - `gas_price`: Effective gas price in wei
/// - `block_number`: Current block height
/// - `block_timestamp`: Unix timestamp in seconds
/// - `block_coinbase`: Block producer address
/// - `block_difficulty`: Difficulty or PREVRANDAO value
/// - `block_gas_limit`: Maximum gas for the block
/// - `chain_id`: Network identifier
/// - `block_base_fee`: EIP-1559 base fee
/// - `blob_hashes`: Array of blob hashes for EIP-4844
/// - `blob_base_fee`: Base fee for blob gas
///
/// ## Example
/// ```zig
/// const context = Context.init_with_values(
///     sender_address,           // tx_origin
///     20_000_000_000,          // gas_price: 20 gwei
///     18_500_000,              // block_number
///     1_700_000_000,           // block_timestamp
///     validator_address,        // block_coinbase
///     0,                       // block_difficulty (post-merge)
///     30_000_000,              // block_gas_limit
///     1,                       // chain_id: mainnet
///     15_000_000_000,          // block_base_fee: 15 gwei
///     &[_]u256{},              // blob_hashes: none
///     1,                       // blob_base_fee: minimum
/// );
/// ```
pub fn init_with_values(
    tx_origin: Address.Address,
    gas_price: u256,
    block_number: u64,
    block_timestamp: u64,
    block_coinbase: Address.Address,
    block_difficulty: u256,
    block_gas_limit: u64,
    chain_id: u256,
    block_base_fee: u256,
    blob_hashes: []const u256,
    blob_base_fee: u256,
) Self {
    return .{
        .tx_origin = tx_origin,
        .gas_price = gas_price,
        .block_number = block_number,
        .block_timestamp = block_timestamp,
        .block_coinbase = block_coinbase,
        .block_difficulty = block_difficulty,
        .block_gas_limit = block_gas_limit,
        .chain_id = chain_id,
        .block_base_fee = block_base_fee,
        .blob_hashes = blob_hashes,
        .blob_base_fee = blob_base_fee,
    };
}

/// Checks if the context represents Ethereum mainnet.
///
/// ## Returns
/// - `true` if chain_id == 1 (Ethereum mainnet)
/// - `false` for all other networks
///
/// ## Common Chain IDs
/// - 1: Ethereum Mainnet ✓
/// - 5: Goerli Testnet ✗
/// - 137: Polygon ✗
/// - 10: Optimism ✗
///
/// ## Usage
/// ```zig
/// if (context.is_eth_mainnet()) {
///     // Apply mainnet-specific logic
///     // e.g., different gas limits, precompiles
/// }
/// ```
///
/// ## Note
/// This is a convenience method. For checking other chains,
/// compare chain_id directly.
pub fn is_eth_mainnet(self: Self) bool {
    return self.chain_id == 1;
}
```
```zig [src/evm/evm.zig]
//! EVM (Ethereum Virtual Machine) module - Core execution engine
//!
//! This is the main entry point for the EVM implementation. It exports all
//! the components needed to execute Ethereum bytecode, manage state, and
//! handle the complete lifecycle of smart contract execution.
//!
//! ## Architecture Overview
//!
//! The EVM is structured into several key components:
//!
//! ### Core Execution
//! - **VM**: The main virtual machine that orchestrates execution
//! - **Frame**: Execution contexts for calls and creates
//! - **Stack**: 256-bit word stack (max 1024 elements)
//! - **Memory**: Byte-addressable memory (expands as needed)
//! - **Contract**: Code and storage management
//!
//! ### Opcodes
//! - **Opcode**: Enumeration of all EVM instructions
//! - **Operation**: Metadata about each opcode (gas, stack effects)
//! - **JumpTable**: Maps opcodes to their implementations
//! - **opcodes/**: Individual opcode implementations
//!
//! ### Error Handling
//! - **ExecutionError**: Unified error type for all execution failures
//! - Strongly typed errors for each component
//! - Error mapping utilities for consistent handling
//!
//! ### Utilities
//! - **CodeAnalysis**: Bytecode analysis and jump destination detection
//! - **Hardfork**: Fork-specific behavior configuration
//! - **gas_constants**: Gas cost calculations
//! - **chain_rules**: Chain-specific validation rules
//!
//! ## Usage Example
//!
//! ```zig
//! const evm = @import("evm");
//!
//! // Create a VM instance
//! var vm = try evm.Vm.init(allocator, config);
//! defer vm.deinit();
//!
//! // Execute bytecode
//! const result = try vm.run(bytecode, context);
//! ```
//!
//! ## Design Principles
//!
//! 1. **Correctness**: Strict adherence to Ethereum Yellow Paper
//! 2. **Performance**: Efficient execution with minimal allocations
//! 3. **Safety**: Strong typing and comprehensive error handling
//! 4. **Modularity**: Clear separation of concerns
//! 5. **Testability**: Extensive test coverage for all components

const std = @import("std");

// Import external modules
/// Address utilities for Ethereum addresses
pub const Address = @import("Address");

// Import all EVM modules

/// Bytecode analysis for jump destination detection
pub const CodeAnalysis = @import("code_analysis.zig");

/// Contract code and storage management
pub const Contract = @import("contract.zig");

/// Unified error types for EVM execution
pub const ExecutionError = @import("execution_error.zig");

/// Execution frame/context management
pub const Frame = @import("frame.zig");

/// Ethereum hardfork configuration
pub const Hardfork = @import("hardfork.zig");

/// Opcode to implementation mapping
pub const JumpTable = @import("jump_table.zig");

/// Byte-addressable memory implementation
pub const Memory = @import("memory.zig");

/// EVM instruction enumeration
pub const Opcode = @import("opcode.zig");

/// Opcode metadata (gas costs, stack effects)
pub const Operation = @import("operation.zig");

/// 256-bit word stack implementation
pub const Stack = @import("stack.zig");

/// Stack depth validation utilities
pub const stack_validation = @import("stack_validation.zig");

/// Storage slot pooling for gas optimization
pub const StoragePool = @import("storage_pool.zig");

/// Main virtual machine implementation
pub const Vm = @import("vm.zig");

// Import opcodes
/// All opcode implementations (arithmetic, stack, memory, etc.)
pub const opcodes = @import("opcodes/package.zig");

// Import utility modules

/// Bit vector utilities for jump destination tracking
pub const bitvec = @import("bitvec.zig");

/// Chain-specific validation rules
pub const chain_rules = @import("chain_rules.zig");

/// EVM constants (stack size, memory limits, etc.)
pub const constants = @import("constants.zig");

/// EIP-7702 EOA delegation bytecode format
pub const eip_7702_bytecode = @import("eip_7702_bytecode.zig");

/// Fee market calculations (EIP-1559)
pub const fee_market = @import("fee_market.zig");

/// Gas cost constants and calculations
pub const gas_constants = @import("gas_constants.zig");

/// Memory size limits and expansion rules
pub const memory_limits = @import("memory_limits.zig");

// Export all error types for strongly typed error handling
///
/// These error types provide fine-grained error handling throughout
/// the EVM. Each error type corresponds to a specific failure mode,
/// allowing precise error handling and recovery strategies.

// VM error types
/// Errors from VM contract creation operations
pub const CreateContractError = Vm.CreateContractError;
pub const CallContractError = Vm.CallContractError;
pub const ConsumeGasError = Vm.ConsumeGasError;
pub const Create2ContractError = Vm.Create2ContractError;
pub const CallcodeContractError = Vm.CallcodeContractError;
pub const DelegatecallContractError = Vm.DelegatecallContractError;
pub const StaticcallContractError = Vm.StaticcallContractError;
pub const EmitLogError = Vm.EmitLogError;
pub const InitTransactionAccessListError = Vm.InitTransactionAccessListError;
pub const PreWarmAddressesError = Vm.PreWarmAddressesError;
pub const PreWarmStorageSlotsError = Vm.PreWarmStorageSlotsError;
pub const GetAddressAccessCostError = Vm.GetAddressAccessCostError;
pub const GetStorageAccessCostError = Vm.GetStorageAccessCostError;
pub const GetCallCostError = Vm.GetCallCostError;
pub const ValidateStaticContextError = Vm.ValidateStaticContextError;
pub const SetStorageProtectedError = Vm.SetStorageProtectedError;
pub const SetTransientStorageProtectedError = Vm.SetTransientStorageProtectedError;
pub const SetBalanceProtectedError = Vm.SetBalanceProtectedError;
pub const SetCodeProtectedError = Vm.SetCodeProtectedError;
pub const EmitLogProtectedError = Vm.EmitLogProtectedError;
pub const CreateContractProtectedError = Vm.CreateContractProtectedError;
pub const Create2ContractProtectedError = Vm.Create2ContractProtectedError;
pub const ValidateValueTransferError = Vm.ValidateValueTransferError;
pub const SelfdestructProtectedError = Vm.SelfdestructProtectedError;

// VM result types
/// Result of running EVM bytecode
pub const RunResult = Vm.RunResult;
/// Result of CREATE/CREATE2 operations
pub const CreateResult = Vm.CreateResult;
/// Result of CALL/DELEGATECALL/STATICCALL operations
pub const CallResult = Vm.CallResult;

// Memory error types
/// Errors from memory operations (expansion, access)
pub const MemoryError = Memory.MemoryError;

// Stack error types
/// Errors from stack operations (overflow, underflow)
pub const StackError = Stack.Error;

// Contract error types
/// General contract operation errors
pub const ContractError = Contract.ContractError;
/// Storage access errors
pub const StorageOperationError = Contract.StorageOperationError;
/// Bytecode analysis errors
pub const CodeAnalysisError = Contract.CodeAnalysisError;
/// Storage warming errors (EIP-2929)
pub const MarkStorageSlotWarmError = Contract.MarkStorageSlotWarmError;

// Access List error types (imported via import statement to avoid circular deps)
/// Access list module for EIP-2929/2930 support
const AccessListModule = @import("access_list.zig");
/// Error accessing addresses in access list
pub const AccessAddressError = AccessListModule.AccessAddressError;
/// Error accessing storage slots in access list
pub const AccessStorageSlotError = AccessListModule.AccessStorageSlotError;
/// Error pre-warming addresses
pub const PreWarmAddressesAccessListError = AccessListModule.PreWarmAddressesError;
/// Error pre-warming storage slots
pub const PreWarmStorageSlotsAccessListError = AccessListModule.PreWarmStorageSlotsError;
/// Error initializing transaction access list
pub const InitTransactionError = AccessListModule.InitTransactionError;
/// Error calculating call costs with access list
pub const GetCallCostAccessListError = AccessListModule.GetCallCostError;

// Address error types
/// Error calculating CREATE address
pub const CalculateAddressError = Address.CalculateAddressError;
/// Error calculating CREATE2 address
pub const CalculateCreate2AddressError = Address.CalculateCreate2AddressError;

// Execution error
/// Main execution error enumeration used throughout EVM
pub const ExecutionErrorEnum = ExecutionError.Error;

// Tests - run all module tests
test {
    std.testing.refAllDeclsRecursive(@This());
}
```
```zig [src/evm/validation_patterns.zig]
const Stack = @import("stack.zig");
const ExecutionError = @import("execution_error.zig");

/// Common validation patterns for EVM stack operations.
///
/// This module provides optimized validation functions for frequently used
/// stack operation patterns in the EVM. These functions check stack requirements
/// before operations execute, preventing stack underflow/overflow errors.
///
/// ## Design Philosophy
/// Rather than repeating validation logic across opcodes, these functions
/// encapsulate common patterns:
/// - Binary operations: pop 2, push 1 (ADD, MUL, SUB, etc.)
/// - Ternary operations: pop 3, push 1 (ADDMOD, MULMOD, etc.)
/// - Comparison operations: pop 2, push 1 (LT, GT, EQ, etc.)
/// - Unary operations: pop 1, push 1 (NOT, ISZERO, etc.)
///
/// ## Performance
/// These validation functions are designed to be inlined by the compiler,
/// making them zero-cost abstractions over direct validation code.
const Self = @This();

/// Validates stack requirements for binary operations.
///
/// Binary operations consume two stack items and produce one result.
/// This pattern is used by arithmetic operations like ADD, MUL, SUB, DIV,
/// and bitwise operations like AND, OR, XOR.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 2 items or would overflow
///
/// Example:
/// ```zig
/// // Before ADD operation
/// try validate_binary_op(&frame.stack);
/// const b = frame.stack.pop();
/// const a = frame.stack.pop();
/// frame.stack.push(a + b);
/// ```
pub fn validate_binary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 2, 1);
}

/// Validates stack requirements for ternary operations.
///
/// Ternary operations consume three stack items and produce one result.
/// This pattern is used by operations like ADDMOD and MULMOD which
/// perform modular arithmetic.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 3 items or would overflow
///
/// Example:
/// ```zig
/// // Before ADDMOD operation: (a + b) % n
/// try validate_ternary_op(&frame.stack);
/// const n = frame.stack.pop();
/// const b = frame.stack.pop();
/// const a = frame.stack.pop();
/// frame.stack.push((a + b) % n);
/// ```
pub fn validate_ternary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 3, 1);
}

/// Validates stack requirements for comparison operations.
///
/// Comparison operations consume two stack items and produce one boolean
/// result (0 or 1). This includes LT, GT, SLT, SGT, and EQ operations.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 2 items or would overflow
///
/// Note: This is functionally identical to validate_binary_op but exists
/// as a separate function for semantic clarity and potential future
/// specialization.
pub fn validate_comparison_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 2, 1);
}

/// Validates stack requirements for unary operations.
///
/// Unary operations consume one stack item and produce one result.
/// This pattern is used by operations like NOT, ISZERO, and SIGNEXTEND.
///
/// @param stack The stack to validate
/// @return Error if stack is empty or would overflow
///
/// Example:
/// ```zig
/// // Before ISZERO operation
/// try validate_unary_op(&frame.stack);
/// const value = frame.stack.pop();
/// frame.stack.push(if (value == 0) 1 else 0);
/// ```
pub fn validate_unary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 1, 1);
}

/// Validates stack requirements for DUP operations.
///
/// DUP operations duplicate the nth stack item, pushing a copy onto the top.
/// They consume no items but add one, so the stack must have:
/// - At least n items to duplicate from
/// - Room for one more item
///
/// @param stack The stack to validate
/// @param n The position to duplicate from (1-based, DUP1 duplicates top item)
/// @return StackUnderflow if fewer than n items, StackOverflow if full
///
/// Example:
/// ```zig
/// // DUP3 operation
/// try validate_dup(&frame.stack, 3);
/// const value = frame.stack.peek(2); // 0-based indexing
/// frame.stack.push(value);
/// ```
pub fn validate_dup(stack: *const Stack, n: u32) ExecutionError.Error!void {
    // DUP pops 0 and pushes 1
    if (stack.size < n) return ExecutionError.Error.StackUnderflow;
    if (stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
}

/// Validates stack requirements for SWAP operations.
///
/// SWAP operations exchange the top stack item with the (n+1)th item.
/// They don't change the stack size, but require at least n+1 items.
///
/// @param stack The stack to validate
/// @param n The position to swap with (1-based, SWAP1 swaps top two items)
/// @return StackUnderflow if stack has n or fewer items
///
/// Example:
/// ```zig
/// // SWAP2 operation swaps top with 3rd item
/// try validate_swap(&frame.stack, 2);
/// frame.stack.swap(2);
/// ```
pub fn validate_swap(stack: *const Stack, n: u32) ExecutionError.Error!void {
    // SWAP needs at least n+1 items on stack
    if (stack.size <= n) return ExecutionError.Error.StackUnderflow;
}

/// Validates stack requirements for PUSH operations.
///
/// PUSH operations add one new item to the stack. They only require
/// checking that the stack isn't already full.
///
/// @param stack The stack to validate
/// @return StackOverflow if stack is at capacity
///
/// Example:
/// ```zig
/// // PUSH1 operation
/// try validate_push(&frame.stack);
/// const value = readByte(pc + 1);
/// frame.stack.push(value);
/// ```
pub fn validate_push(stack: *const Stack) ExecutionError.Error!void {
    if (stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
}

// Import the helper function
const validate_stack_operation = @import("stack_validation.zig").validate_stack_operation;
```
```zig [src/evm/gas_constants.zig]
/// EVM gas cost constants for opcode execution
///
/// This module defines all gas cost constants used in EVM execution according
/// to the Ethereum Yellow Paper and various EIPs. Gas costs are critical for
/// preventing denial-of-service attacks and fairly pricing computational resources.
///
/// ## Gas Cost Categories
///
/// Operations are grouped by computational complexity:
/// - **Quick** (2 gas): Trivial operations like PC, MSIZE, GAS
/// - **Fastest** (3 gas): Simple arithmetic like ADD, SUB, NOT, LT, GT
/// - **Fast** (5 gas): More complex arithmetic like MUL, DIV, MOD
/// - **Mid** (8 gas): Advanced arithmetic like ADDMOD, MULMOD, SIGNEXTEND
/// - **Slow** (10 gas): Operations requiring more computation
/// - **Ext** (20+ gas): External operations like BALANCE, EXTCODESIZE
///
/// ## Historical Changes
///
/// Gas costs have evolved through various EIPs:
/// - EIP-150: Increased costs for IO-heavy operations
/// - EIP-2200: SSTORE net gas metering
/// - EIP-2929: Increased costs for cold storage/account access
/// - EIP-3529: Reduced refunds and cold access costs
/// - EIP-3860: Initcode metering
///
/// ## Usage
/// ```zig
/// const gas_cost = switch (opcode) {
///     0x01 => GasFastestStep, // ADD
///     0x02 => GasFastStep,    // MUL
///     0x20 => Keccak256Gas + (data_size_words * Keccak256WordGas),
///     else => 0,
/// };
/// ```

/// Gas cost for very cheap operations
/// Operations: ADDRESS, ORIGIN, CALLER, CALLVALUE, CALLDATASIZE, CODESIZE,
/// GASPRICE, RETURNDATASIZE, PC, MSIZE, GAS, CHAINID, SELFBALANCE
pub const GasQuickStep: u64 = 2;

/// Gas cost for simple arithmetic and logic operations
/// Operations: ADD, SUB, NOT, LT, GT, SLT, SGT, EQ, ISZERO, AND, OR, XOR,
/// CALLDATALOAD, MLOAD, MSTORE, MSTORE8, PUSH operations, DUP operations,
/// SWAP operations
pub const GasFastestStep: u64 = 3;

/// Gas cost for multiplication and division operations
/// Operations: MUL, DIV, SDIV, MOD, SMOD, EXP (per byte of exponent)
pub const GasFastStep: u64 = 5;

/// Gas cost for advanced arithmetic operations
/// Operations: ADDMOD, MULMOD, SIGNEXTEND, KECCAK256 (base cost)
pub const GasMidStep: u64 = 8;

/// Gas cost for operations requiring moderate computation
/// Operations: JUMPI
pub const GasSlowStep: u64 = 10;

/// Gas cost for operations that interact with other accounts/contracts
/// Operations: BALANCE, EXTCODESIZE, BLOCKHASH
pub const GasExtStep: u64 = 20;

// ============================================================================
// Hashing Operation Costs
// ============================================================================

/// Base gas cost for KECCAK256 (SHA3) operation
/// This is the fixed cost regardless of input size
pub const Keccak256Gas: u64 = 30;

/// Additional gas cost per 32-byte word for KECCAK256
/// Total cost = Keccak256Gas + (word_count * Keccak256WordGas)
pub const Keccak256WordGas: u64 = 6;

// ============================================================================
// Storage Operation Costs (EIP-2929 & EIP-2200)
// ============================================================================

/// Gas cost for SLOAD on a warm storage slot
/// After EIP-2929, warm access is significantly cheaper than cold
pub const SloadGas: u64 = 100;

/// Gas cost for first-time (cold) SLOAD access in a transaction
/// EIP-2929: Prevents underpriced state access attacks
pub const ColdSloadCost: u64 = 2100;

/// Gas cost for first-time (cold) account access in a transaction
/// EIP-2929: Applied to BALANCE, EXTCODESIZE, EXTCODECOPY, EXTCODEHASH, CALL family
pub const ColdAccountAccessCost: u64 = 2600;

/// Gas cost for warm storage read operations
/// EIP-2929: Subsequent accesses to the same slot/account in a transaction
pub const WarmStorageReadCost: u64 = 100;

/// Minimum gas that must remain for SSTORE to succeed
/// Prevents storage modifications when gas is nearly exhausted
pub const SstoreSentryGas: u64 = 2300;

/// Gas cost for SSTORE when setting a storage slot from zero to non-zero
/// This is the most expensive storage operation as it increases state size
pub const SstoreSetGas: u64 = 20000;

/// Gas cost for SSTORE when changing an existing non-zero value to another non-zero value
/// Cheaper than initial set since slot is already allocated
pub const SstoreResetGas: u64 = 5000;

/// Gas cost for SSTORE when clearing a storage slot (non-zero to zero)
/// Same cost as reset, but eligible for gas refund
pub const SstoreClearGas: u64 = 5000;

/// Gas refund for clearing storage slot to zero
/// EIP-3529: Reduced from 15000 to prevent gas refund abuse
pub const SstoreRefundGas: u64 = 4800;
// ============================================================================
// Control Flow Costs
// ============================================================================

/// Gas cost for JUMPDEST opcode
/// Minimal cost as it's just a marker for valid jump destinations
pub const JumpdestGas: u64 = 1;

// ============================================================================
// Logging Operation Costs
// ============================================================================

/// Base gas cost for LOG operations (LOG0-LOG4)
/// This is the fixed cost before considering data size and topics
pub const LogGas: u64 = 375;

/// Gas cost per byte of data in LOG operations
/// Incentivizes efficient event data usage
pub const LogDataGas: u64 = 8;

/// Gas cost per topic in LOG operations
/// Each additional topic (LOG1, LOG2, etc.) adds this cost
pub const LogTopicGas: u64 = 375;

// ============================================================================
// Contract Creation and Call Costs
// ============================================================================

/// Base gas cost for CREATE opcode
/// High cost reflects the expense of deploying new contracts
pub const CreateGas: u64 = 32000;
/// Base gas cost for CALL operations
/// This is the minimum cost before additional charges
pub const CallGas: u64 = 40;

/// Gas stipend provided to called contract when transferring value
/// Ensures called contract has minimum gas to execute basic operations
pub const CallStipend: u64 = 2300;

/// Additional gas cost when CALL transfers value (ETH)
/// Makes value transfers more expensive to prevent spam
pub const CallValueTransferGas: u64 = 9000;

/// Additional gas cost when CALL creates a new account
/// Reflects the cost of adding a new entry to the state trie
pub const CallNewAccountGas: u64 = 25000;

/// Gas refund for SELFDESTRUCT operation
/// Incentivizes cleaning up unused contracts
pub const SelfdestructRefundGas: u64 = 24000;
// ============================================================================
// Memory Expansion Costs
// ============================================================================

/// Linear coefficient for memory gas calculation
/// Part of the formula: gas = MemoryGas * words + words² / QuadCoeffDiv
pub const MemoryGas: u64 = 3;

/// Quadratic coefficient divisor for memory gas calculation
/// Makes memory expansion quadratically expensive to prevent DoS attacks
pub const QuadCoeffDiv: u64 = 512;

// ============================================================================
// Contract Deployment Costs
// ============================================================================

/// Gas cost per byte of contract deployment code
/// Applied to the bytecode being deployed via CREATE/CREATE2
pub const CreateDataGas: u64 = 200;

/// Gas cost per 32-byte word of initcode
/// EIP-3860: Prevents deploying excessively large contracts
pub const InitcodeWordGas: u64 = 2;

/// Maximum allowed initcode size in bytes
/// EIP-3860: Limit is 49152 bytes (2 * MAX_CODE_SIZE)
pub const MaxInitcodeSize: u64 = 49152;

// ============================================================================
// Transaction Costs
// ============================================================================

/// Base gas cost for a standard transaction
/// Minimum cost for any transaction regardless of data or computation
pub const TxGas: u64 = 21000;

/// Base gas cost for contract creation transaction
/// Higher than standard tx due to contract deployment overhead
pub const TxGasContractCreation: u64 = 53000;

/// Gas cost per zero byte in transaction data
/// Cheaper than non-zero bytes to incentivize data efficiency
pub const TxDataZeroGas: u64 = 4;

/// Gas cost per non-zero byte in transaction data
/// Higher cost reflects increased storage and bandwidth requirements
pub const TxDataNonZeroGas: u64 = 16;

/// Gas cost per word for copy operations
/// Applied to CODECOPY, EXTCODECOPY, RETURNDATACOPY, etc.
pub const CopyGas: u64 = 3;

/// Maximum gas refund as a fraction of gas used
/// EIP-3529: Reduced from 1/2 to 1/5 to prevent refund abuse
pub const MaxRefundQuotient: u64 = 5;

// ============================================================================
// EIP-4844: Shard Blob Transactions
// ============================================================================

/// Gas cost for BLOBHASH opcode
/// Returns the hash of a blob associated with the transaction
pub const BlobHashGas: u64 = 3;

/// Gas cost for BLOBBASEFEE opcode
/// Returns the base fee for blob gas
pub const BlobBaseFeeGas: u64 = 2;

// ============================================================================
// EIP-1153: Transient Storage
// ============================================================================

/// Gas cost for TLOAD (transient storage load)
/// Transient storage is cleared after each transaction
pub const TLoadGas: u64 = 100;

/// Gas cost for TSTORE (transient storage store)
/// Same cost as TLOAD, much cheaper than persistent storage
pub const TStoreGas: u64 = 100;

/// Calculate memory expansion gas cost
/// 
/// Computes the gas cost for expanding EVM memory from current_size to new_size bytes.
/// Memory expansion follows a quadratic cost formula to prevent DoS attacks.
/// 
/// ## Parameters
/// - `current_size`: Current memory size in bytes
/// - `new_size`: Requested new memory size in bytes
/// 
/// ## Returns
/// - Gas cost for the expansion (0 if new_size <= current_size)
/// 
/// ## Formula
/// The total memory cost for n words is: 3n + n²/512
/// Where a word is 32 bytes.
/// 
/// Pre-computed memory expansion costs for common sizes.
/// 
/// This lookup table stores the total memory cost for sizes up to 32KB (1024 words).
/// Using a LUT converts runtime calculations to O(1) lookups for common cases.
/// The formula is: 3n + n²/512 where n is the number of 32-byte words.
pub const MEMORY_EXPANSION_LUT = blk: {
    @setEvalBranchQuota(10000);
    const max_words = 1024; // Pre-compute for up to 32KB of memory
    var costs: [max_words]u64 = undefined;
    
    for (0..max_words) |words| {
        costs[words] = MemoryGas * words + (words * words) / QuadCoeffDiv;
    }
    
    break :blk costs;
};

/// The expansion cost is: total_cost(new_size) - total_cost(current_size)
/// 
/// ## Examples
/// - Expanding from 0 to 32 bytes (1 word): 3 + 0 = 3 gas
/// - Expanding from 0 to 64 bytes (2 words): 6 + 0 = 6 gas
/// - Expanding from 0 to 1024 bytes (32 words): 96 + 2 = 98 gas
/// - Expanding from 1024 to 2048 bytes: 294 - 98 = 196 gas
/// 
/// ## Edge Cases
/// - If new_size <= current_size, no expansion needed, returns 0
/// - Sizes are rounded up to the nearest word (32 bytes)
/// - At 32MB, gas cost exceeds 2 billion, effectively preventing larger allocations
/// 
/// ## Performance
/// - Uses pre-computed lookup table for sizes up to 32KB (O(1) lookup)
/// - Falls back to calculation for larger sizes
pub fn memory_gas_cost(current_size: u64, new_size: u64) u64 {
    if (new_size <= current_size) return 0;
    
    const current_words = (current_size + 31) / 32;
    const new_words = (new_size + 31) / 32;
    
    // Use lookup table for common cases (up to 32KB)
    if (new_words < MEMORY_EXPANSION_LUT.len) {
        const current_cost = if (current_words < MEMORY_EXPANSION_LUT.len)
            MEMORY_EXPANSION_LUT[current_words]
        else
            MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;
            
        return MEMORY_EXPANSION_LUT[new_words] - current_cost;
    }
    
    // Fall back to calculation for larger sizes
    const current_cost = MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;
    const new_cost = MemoryGas * new_words + (new_words * new_words) / QuadCoeffDiv;
    return new_cost - current_cost;
}
```
/Tevm>

  <Evmone>
    ```rs [evmone/lib/evmone_precompiles/keccak.c]
// ethash: C/C++ implementation of Ethash, the Ethereum Proof of Work algorithm.
// Copyright 2018 Pawel Bylica.
// SPDX-License-Identifier: Apache-2.0

#include "keccak.h"

// Provide __has_attribute macro if not defined.
#ifndef __has_attribute
#define __has_attribute(name) 0
#endif

// Provide __has_builtin macro if not defined.
#ifndef __has_builtin
#define __has_builtin(x) 0
#endif

// [[always_inline]]
#if defined(_MSC_VER)
#define ALWAYS_INLINE __forceinline
#elif __has_attribute(always_inline)
#define ALWAYS_INLINE __attribute__((always_inline))
#else
#define ALWAYS_INLINE
#endif

#if !__has_builtin(__builtin_memcpy) && !defined(__GNUC__)
#include <string.h>
#define __builtin_memcpy memcpy
#endif

#if defined(__BYTE_ORDER__) && __BYTE_ORDER__ == __ORDER_BIG_ENDIAN__
#define to_le64(X) __builtin_bswap64(X)
#else
#define to_le64(X) X
#endif

/// Loads 64-bit integer from given memory location as little-endian number.
static inline ALWAYS_INLINE uint64_t load_le(const uint8_t* data)
{
    /* memcpy is the best way of expressing the intention. Every compiler will
       optimize is to single load instruction if the target architecture
       supports unaligned memory access (GCC and clang even in O0).
       This is great trick because we are violating C/C++ memory alignment
       restrictions with no performance penalty. */
    uint64_t word;
    __builtin_memcpy(&word, data, sizeof(word));
    return to_le64(word);
}

/// Rotates the bits of x left by the count value specified by s.
/// The s must be in range <0, 64> exclusively, otherwise the result is undefined.
static inline uint64_t rol(uint64_t x, unsigned s)
{
    return (x << s) | (x >> (64 - s));
}

static const uint64_t round_constants[24] = {  //
    0x0000000000000001, 0x0000000000008082, 0x800000000000808a, 0x8000000080008000,
    0x000000000000808b, 0x0000000080000001, 0x8000000080008081, 0x8000000000008009,
    0x000000000000008a, 0x0000000000000088, 0x0000000080008009, 0x000000008000000a,
    0x000000008000808b, 0x800000000000008b, 0x8000000000008089, 0x8000000000008003,
    0x8000000000008002, 0x8000000000000080, 0x000000000000800a, 0x800000008000000a,
    0x8000000080008081, 0x8000000000008080, 0x0000000080000001, 0x8000000080008008};


/// The Keccak-f[1600] function.
///
/// The implementation of the Keccak-f function with 1600-bit width of the permutation (b).
/// The size of the state is also 1600 bit what gives 25 64-bit words.
///
/// @param state  The state of 25 64-bit words on which the permutation is to be performed.
///
/// The implementation based on:
/// - "simple" implementation by Ronny Van Keer, included in "Reference and optimized code in C",
///   https://keccak.team/archives.html, CC0-1.0 / Public Domain.
static inline ALWAYS_INLINE void keccakf1600_implementation(uint64_t state[25])
{
    uint64_t Aba, Abe, Abi, Abo, Abu;
    uint64_t Aga, Age, Agi, Ago, Agu;
    uint64_t Aka, Ake, Aki, Ako, Aku;
    uint64_t Ama, Ame, Ami, Amo, Amu;
    uint64_t Asa, Ase, Asi, Aso, Asu;

    uint64_t Eba, Ebe, Ebi, Ebo, Ebu;
    uint64_t Ega, Ege, Egi, Ego, Egu;
    uint64_t Eka, Eke, Eki, Eko, Eku;
    uint64_t Ema, Eme, Emi, Emo, Emu;
    uint64_t Esa, Ese, Esi, Eso, Esu;

    uint64_t Ba, Be, Bi, Bo, Bu;

    uint64_t Da, De, Di, Do, Du;

    Aba = state[0];
    Abe = state[1];
    Abi = state[2];
    Abo = state[3];
    Abu = state[4];
    Aga = state[5];
    Age = state[6];
    Agi = state[7];
    Ago = state[8];
    Agu = state[9];
    Aka = state[10];
    Ake = state[11];
    Aki = state[12];
    Ako = state[13];
    Aku = state[14];
    Ama = state[15];
    Ame = state[16];
    Ami = state[17];
    Amo = state[18];
    Amu = state[19];
    Asa = state[20];
    Ase = state[21];
    Asi = state[22];
    Aso = state[23];
    Asu = state[24];

    for (size_t n = 0; n < 24; n += 2)
    {
        // Round (n + 0): Axx -> Exx

        Ba = Aba ^ Aga ^ Aka ^ Ama ^ Asa;
        Be = Abe ^ Age ^ Ake ^ Ame ^ Ase;
        Bi = Abi ^ Agi ^ Aki ^ Ami ^ Asi;
        Bo = Abo ^ Ago ^ Ako ^ Amo ^ Aso;
        Bu = Abu ^ Agu ^ Aku ^ Amu ^ Asu;

        Da = Bu ^ rol(Be, 1);
        De = Ba ^ rol(Bi, 1);
        Di = Be ^ rol(Bo, 1);
        Do = Bi ^ rol(Bu, 1);
        Du = Bo ^ rol(Ba, 1);

        Ba = Aba ^ Da;
        Be = rol(Age ^ De, 44);
        Bi = rol(Aki ^ Di, 43);
        Bo = rol(Amo ^ Do, 21);
        Bu = rol(Asu ^ Du, 14);
        Eba = Ba ^ (~Be & Bi) ^ round_constants[n];
        Ebe = Be ^ (~Bi & Bo);
        Ebi = Bi ^ (~Bo & Bu);
        Ebo = Bo ^ (~Bu & Ba);
        Ebu = Bu ^ (~Ba & Be);

        Ba = rol(Abo ^ Do, 28);
        Be = rol(Agu ^ Du, 20);
        Bi = rol(Aka ^ Da, 3);
        Bo = rol(Ame ^ De, 45);
        Bu = rol(Asi ^ Di, 61);
        Ega = Ba ^ (~Be & Bi);
        Ege = Be ^ (~Bi & Bo);
        Egi = Bi ^ (~Bo & Bu);
        Ego = Bo ^ (~Bu & Ba);
        Egu = Bu ^ (~Ba & Be);

        Ba = rol(Abe ^ De, 1);
        Be = rol(Agi ^ Di, 6);
        Bi = rol(Ako ^ Do, 25);
        Bo = rol(Amu ^ Du, 8);
        Bu = rol(Asa ^ Da, 18);
        Eka = Ba ^ (~Be & Bi);
        Eke = Be ^ (~Bi & Bo);
        Eki = Bi ^ (~Bo & Bu);
        Eko = Bo ^ (~Bu & Ba);
        Eku = Bu ^ (~Ba & Be);

        Ba = rol(Abu ^ Du, 27);
        Be = rol(Aga ^ Da, 36);
        Bi = rol(Ake ^ De, 10);
        Bo = rol(Ami ^ Di, 15);
        Bu = rol(Aso ^ Do, 56);
        Ema = Ba ^ (~Be & Bi);
        Eme = Be ^ (~Bi & Bo);
        Emi = Bi ^ (~Bo & Bu);
        Emo = Bo ^ (~Bu & Ba);
        Emu = Bu ^ (~Ba & Be);

        Ba = rol(Abi ^ Di, 62);
        Be = rol(Ago ^ Do, 55);
        Bi = rol(Aku ^ Du, 39);
        Bo = rol(Ama ^ Da, 41);
        Bu = rol(Ase ^ De, 2);
        Esa = Ba ^ (~Be & Bi);
        Ese = Be ^ (~Bi & Bo);
        Esi = Bi ^ (~Bo & Bu);
        Eso = Bo ^ (~Bu & Ba);
        Esu = Bu ^ (~Ba & Be);


        // Round (n + 1): Exx -> Axx

        Ba = Eba ^ Ega ^ Eka ^ Ema ^ Esa;
        Be = Ebe ^ Ege ^ Eke ^ Eme ^ Ese;
        Bi = Ebi ^ Egi ^ Eki ^ Emi ^ Esi;
        Bo = Ebo ^ Ego ^ Eko ^ Emo ^ Eso;
        Bu = Ebu ^ Egu ^ Eku ^ Emu ^ Esu;

        Da = Bu ^ rol(Be, 1);
        De = Ba ^ rol(Bi, 1);
        Di = Be ^ rol(Bo, 1);
        Do = Bi ^ rol(Bu, 1);
        Du = Bo ^ rol(Ba, 1);

        Ba = Eba ^ Da;
        Be = rol(Ege ^ De, 44);
        Bi = rol(Eki ^ Di, 43);
        Bo = rol(Emo ^ Do, 21);
        Bu = rol(Esu ^ Du, 14);
        Aba = Ba ^ (~Be & Bi) ^ round_constants[n + 1];
        Abe = Be ^ (~Bi & Bo);
        Abi = Bi ^ (~Bo & Bu);
        Abo = Bo ^ (~Bu & Ba);
        Abu = Bu ^ (~Ba & Be);

        Ba = rol(Ebo ^ Do, 28);
        Be = rol(Egu ^ Du, 20);
        Bi = rol(Eka ^ Da, 3);
        Bo = rol(Eme ^ De, 45);
        Bu = rol(Esi ^ Di, 61);
        Aga = Ba ^ (~Be & Bi);
        Age = Be ^ (~Bi & Bo);
        Agi = Bi ^ (~Bo & Bu);
        Ago = Bo ^ (~Bu & Ba);
        Agu = Bu ^ (~Ba & Be);

        Ba = rol(Ebe ^ De, 1);
        Be = rol(Egi ^ Di, 6);
        Bi = rol(Eko ^ Do, 25);
        Bo = rol(Emu ^ Du, 8);
        Bu = rol(Esa ^ Da, 18);
        Aka = Ba ^ (~Be & Bi);
        Ake = Be ^ (~Bi & Bo);
        Aki = Bi ^ (~Bo & Bu);
        Ako = Bo ^ (~Bu & Ba);
        Aku = Bu ^ (~Ba & Be);

        Ba = rol(Ebu ^ Du, 27);
        Be = rol(Ega ^ Da, 36);
        Bi = rol(Eke ^ De, 10);
        Bo = rol(Emi ^ Di, 15);
        Bu = rol(Eso ^ Do, 56);
        Ama = Ba ^ (~Be & Bi);
        Ame = Be ^ (~Bi & Bo);
        Ami = Bi ^ (~Bo & Bu);
        Amo = Bo ^ (~Bu & Ba);
        Amu = Bu ^ (~Ba & Be);

        Ba = rol(Ebi ^ Di, 62);
        Be = rol(Ego ^ Do, 55);
        Bi = rol(Eku ^ Du, 39);
        Bo = rol(Ema ^ Da, 41);
        Bu = rol(Ese ^ De, 2);
        Asa = Ba ^ (~Be & Bi);
        Ase = Be ^ (~Bi & Bo);
        Asi = Bi ^ (~Bo & Bu);
        Aso = Bo ^ (~Bu & Ba);
        Asu = Bu ^ (~Ba & Be);
    }

    state[0] = Aba;
    state[1] = Abe;
    state[2] = Abi;
    state[3] = Abo;
    state[4] = Abu;
    state[5] = Aga;
    state[6] = Age;
    state[7] = Agi;
    state[8] = Ago;
    state[9] = Agu;
    state[10] = Aka;
    state[11] = Ake;
    state[12] = Aki;
    state[13] = Ako;
    state[14] = Aku;
    state[15] = Ama;
    state[16] = Ame;
    state[17] = Ami;
    state[18] = Amo;
    state[19] = Amu;
    state[20] = Asa;
    state[21] = Ase;
    state[22] = Asi;
    state[23] = Aso;
    state[24] = Asu;
}

static void keccakf1600_generic(uint64_t state[25])
{
    keccakf1600_implementation(state);
}

/// The pointer to the best Keccak-f[1600] function implementation,
/// selected during runtime initialization.
static void (*keccakf1600_best)(uint64_t[25]) = keccakf1600_generic;


#if !defined(_MSC_VER) && defined(__x86_64__) && __has_attribute(target)
__attribute__((target("bmi,bmi2"))) static void keccakf1600_bmi(uint64_t state[25])
{
    keccakf1600_implementation(state);
}

__attribute__((constructor)) static void select_keccakf1600_implementation(void)
{
    // Init CPU information.
    // This is needed on macOS because of the bug: https://bugs.llvm.org/show_bug.cgi?id=48459.
    __builtin_cpu_init();

    // Check if both BMI and BMI2 are supported. Some CPUs like Intel E5-2697 v2 incorrectly
    // report BMI2 but not BMI being available.
    if (__builtin_cpu_supports("bmi") && __builtin_cpu_supports("bmi2"))
        keccakf1600_best = keccakf1600_bmi;
}
#endif


static inline ALWAYS_INLINE void keccak(
    uint64_t* out, size_t bits, const uint8_t* data, size_t size)
{
    static const size_t word_size = sizeof(uint64_t);
    const size_t hash_size = bits / 8;
    const size_t block_size = (1600 - bits * 2) / 8;

    size_t i;
    uint64_t* state_iter;
    uint64_t last_word = 0;
    uint8_t* last_word_iter = (uint8_t*)&last_word;

    uint64_t state[25] = {0};

    while (size >= block_size)
    {
        for (i = 0; i < (block_size / word_size); ++i)
        {
            state[i] ^= load_le(data);
            data += word_size;
        }

        keccakf1600_best(state);

        size -= block_size;
    }

    state_iter = state;

    while (size >= word_size)
    {
        *state_iter ^= load_le(data);
        ++state_iter;
        data += word_size;
        size -= word_size;
    }

    while (size > 0)
    {
        *last_word_iter = *data;
        ++last_word_iter;
        ++data;
        --size;
    }
    *last_word_iter = 0x01;
    *state_iter ^= to_le64(last_word);

    state[(block_size / word_size) - 1] ^= 0x8000000000000000;

    keccakf1600_best(state);

    for (i = 0; i < (hash_size / word_size); ++i)
        out[i] = to_le64(state[i]);
}

union ethash_hash256 ethash_keccak256(const uint8_t* data, size_t size)
{
    union ethash_hash256 hash;
    keccak(hash.word64s, 256, data, size);
    return hash;
}

union ethash_hash256 ethash_keccak256_32(const uint8_t data[32])
{
    union ethash_hash256 hash;
    keccak(hash.word64s, 256, data, 32);
    return hash;
}
```

  </Evmone>
<Revm>
```rs [revm/crates/interpreter/src/interpreter/ext_bytecode.rs]
use core::ops::Deref;

use bytecode::{eof::CodeInfo, utils::read_u16, Bytecode};
use primitives::{Bytes, B256};

use super::{EofCodeInfo, EofContainer, EofData, Immediates, Jumps, LegacyBytecode};

#[cfg(feature = "serde")]
mod serde;

#[derive(Debug)]
pub struct ExtBytecode {
    base: Bytecode,
    bytecode_hash: Option<B256>,
    instruction_pointer: *const u8,
}

impl Deref for ExtBytecode {
    type Target = Bytecode;

    fn deref(&self) -> &Self::Target {
        &self.base
    }
}

impl ExtBytecode {
    /// Create new extended bytecode and set the instruction pointer to the start of the bytecode.
    pub fn new(base: Bytecode) -> Self {
        let instruction_pointer = base.bytecode_ptr();
        Self {
            base,
            instruction_pointer,
            bytecode_hash: None,
        }
    }

    /// Creates new `ExtBytecode` with the given hash.
    pub fn new_with_hash(base: Bytecode, hash: B256) -> Self {
        let instruction_pointer = base.bytecode_ptr();
        Self {
            base,
            instruction_pointer,
            bytecode_hash: Some(hash),
        }
    }

    /// Regenerates the bytecode hash.
    pub fn regenerate_hash(&mut self) -> B256 {
        let hash = self.base.hash_slow();
        self.bytecode_hash = Some(hash);
        hash
    }

    /// Returns the bytecode hash.
    pub fn hash(&mut self) -> Option<B256> {
        self.bytecode_hash
    }
}

impl Jumps for ExtBytecode {
    #[inline]
    fn relative_jump(&mut self, offset: isize) {
        self.instruction_pointer = unsafe { self.instruction_pointer.offset(offset) };
    }

    #[inline]
    fn absolute_jump(&mut self, offset: usize) {
        self.instruction_pointer = unsafe { self.base.bytes_ref().as_ptr().add(offset) };
    }

    #[inline]
    fn is_valid_legacy_jump(&mut self, offset: usize) -> bool {
        self.base
            .legacy_jump_table()
            .expect("Panic if not legacy")
            .is_valid(offset)
    }

    #[inline]
    fn opcode(&self) -> u8 {
        // SAFETY: `instruction_pointer` always point to bytecode.
        unsafe { *self.instruction_pointer }
    }

    #[inline]
    fn pc(&self) -> usize {
        // SAFETY: `instruction_pointer` should be at an offset from the start of the bytes.
        // In practice this is always true unless a caller modifies the `instruction_pointer` field manually.
        unsafe {
            self.instruction_pointer
                .offset_from(self.base.bytes_ref().as_ptr()) as usize
        }
    }
}

impl Immediates for ExtBytecode {
    #[inline]
    fn read_u16(&self) -> u16 {
        unsafe { read_u16(self.instruction_pointer) }
    }

    #[inline]
    fn read_u8(&self) -> u8 {
        unsafe { *self.instruction_pointer }
    }

    #[inline]
    fn read_slice(&self, len: usize) -> &[u8] {
        unsafe { core::slice::from_raw_parts(self.instruction_pointer, len) }
    }

    #[inline]
    fn read_offset_u16(&self, offset: isize) -> u16 {
        unsafe {
            read_u16(
                self.instruction_pointer
                    // Offset for max_index that is one byte
                    .offset(offset),
            )
        }
    }
}

impl EofCodeInfo for ExtBytecode {
    fn code_info(&self, idx: usize) -> Option<&CodeInfo> {
        self.base.eof().and_then(|eof| eof.body.code_info.get(idx))
    }

    fn code_section_pc(&self, idx: usize) -> Option<usize> {
        self.base
            .eof()
            .and_then(|eof| eof.body.eof_code_section_start(idx))
    }
}

impl EofData for ExtBytecode {
    fn data(&self) -> &[u8] {
        self.base.eof().expect("eof").data()
    }

    fn data_slice(&self, offset: usize, len: usize) -> &[u8] {
        self.base.eof().expect("eof").data_slice(offset, len)
    }

    fn data_size(&self) -> usize {
        self.base.eof().expect("eof").header.data_size as usize
    }
}

impl EofContainer for ExtBytecode {
    fn eof_container(&self, index: usize) -> Option<&Bytes> {
        self.base
            .eof()
            .and_then(|eof| eof.body.container_section.get(index))
    }
}

impl LegacyBytecode for ExtBytecode {
    fn bytecode_len(&self) -> usize {
        // Inform the optimizer that the bytecode cannot be EOF to remove a bounds check.
        assume!(!self.base.is_eof());
        self.base.len()
    }

    fn bytecode_slice(&self) -> &[u8] {
        // Inform the optimizer that the bytecode cannot be EOF to remove a bounds check.
        assume!(!self.base.is_eof());
        self.base.original_byte_slice()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use primitives::Bytes;

    #[test]
    fn test_with_hash_constructor() {
        let bytecode = Bytecode::new_raw(Bytes::from(&[0x60, 0x00][..]));
        let hash = bytecode.hash_slow();
        let ext_bytecode = ExtBytecode::new_with_hash(bytecode.clone(), hash);
        assert_eq!(ext_bytecode.bytecode_hash, Some(hash));
    }
}
```
```rs [revm/crates/interpreter/src/interpreter/ext_bytecode/serde.rs]
use super::ExtBytecode;
use crate::interpreter::Jumps;
use primitives::B256;
use serde::{Deserialize, Deserializer, Serialize, Serializer};

#[derive(Serialize, Deserialize)]
struct ExtBytecodeSerde {
    base: bytecode::Bytecode,
    program_counter: usize,
    bytecode_hash: Option<B256>,
}

impl Serialize for ExtBytecode {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        ExtBytecodeSerde {
            base: self.base.clone(),
            program_counter: self.pc(),
            bytecode_hash: self.bytecode_hash,
        }
        .serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for ExtBytecode {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let ExtBytecodeSerde {
            base,
            program_counter,
            bytecode_hash,
        } = ExtBytecodeSerde::deserialize(deserializer)?;

        let mut bytecode = if let Some(hash) = bytecode_hash {
            Self::new_with_hash(base, hash)
        } else {
            Self::new(base)
        };

        if program_counter >= bytecode.base.bytecode().len() {
            panic!("serde pc: {program_counter} is greater than or equal to bytecode len");
        }
        bytecode.absolute_jump(program_counter);
        Ok(bytecode)
    }
}
```
```rs [revm/crates/interpreter/src/interpreter/shared_memory.rs]
use super::MemoryTr;
use core::{
    cell::{Ref, RefCell, RefMut},
    cmp::min,
    fmt,
    ops::Range,
};
use primitives::{hex, B256, U256};
use std::{rc::Rc, vec::Vec};

/// A sequential memory shared between calls, which uses
/// a `Vec` for internal representation.
/// A [SharedMemory] instance should always be obtained using
/// the `new` static method to ensure memory safety.
#[derive(Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct SharedMemory {
    /// The underlying buffer.
    buffer: Rc<RefCell<Vec<u8>>>,
    /// Memory checkpoints for each depth.
    /// Invariant: these are always in bounds of `data`.
    my_checkpoint: usize,
    /// Child checkpoint that we need to free context to.
    child_checkpoint: Option<usize>,
    /// Memory limit. See [`Cfg`](context_interface::Cfg).
    #[cfg(feature = "memory_limit")]
    memory_limit: u64,
}

impl fmt::Debug for SharedMemory {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("SharedMemory")
            .field("current_len", &self.len())
            .field("context_memory", &hex::encode(&*self.context_memory()))
            .finish_non_exhaustive()
    }
}

impl Default for SharedMemory {
    #[inline]
    fn default() -> Self {
        Self::new()
    }
}

impl MemoryTr for SharedMemory {
    fn set_data(&mut self, memory_offset: usize, data_offset: usize, len: usize, data: &[u8]) {
        self.set_data(memory_offset, data_offset, len, data);
    }

    fn set(&mut self, memory_offset: usize, data: &[u8]) {
        self.set(memory_offset, data);
    }

    fn size(&self) -> usize {
        self.len()
    }

    fn copy(&mut self, destination: usize, source: usize, len: usize) {
        self.copy(destination, source, len);
    }

    fn slice(&self, range: Range<usize>) -> Ref<'_, [u8]> {
        self.slice_range(range)
    }

    fn local_memory_offset(&self) -> usize {
        self.my_checkpoint
    }

    fn set_data_from_global(
        &mut self,
        memory_offset: usize,
        data_offset: usize,
        len: usize,
        data_range: Range<usize>,
    ) {
        self.global_to_local_set_data(memory_offset, data_offset, len, data_range);
    }

    /// Returns a byte slice of the memory region at the given offset.
    ///
    /// # Safety
    ///
    /// In debug this will panic on out of bounds. In release it will silently fail.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    fn global_slice(&self, range: Range<usize>) -> Ref<'_, [u8]> {
        let buffer = self.buffer.borrow(); // Borrow the inner Vec<u8>
        Ref::map(buffer, |b| match b.get(range) {
            Some(slice) => slice,
            None => debug_unreachable!("slice OOB: range; len: {}", self.len()),
        })
    }

    fn resize(&mut self, new_size: usize) -> bool {
        self.resize(new_size);
        true
    }
}

impl SharedMemory {
    /// Creates a new memory instance that can be shared between calls.
    ///
    /// The default initial capacity is 4KiB.
    #[inline]
    pub fn new() -> Self {
        Self::with_capacity(4 * 1024) // from evmone
    }

    /// Creates a new memory instance with a given shared buffer.
    pub fn new_with_buffer(buffer: Rc<RefCell<Vec<u8>>>) -> Self {
        Self {
            buffer,
            my_checkpoint: 0,
            child_checkpoint: None,
            #[cfg(feature = "memory_limit")]
            memory_limit: u64::MAX,
        }
    }

    /// Creates a new memory instance that can be shared between calls with the given `capacity`.
    #[inline]
    pub fn with_capacity(capacity: usize) -> Self {
        Self {
            buffer: Rc::new(RefCell::new(Vec::with_capacity(capacity))),
            my_checkpoint: 0,
            child_checkpoint: None,
            #[cfg(feature = "memory_limit")]
            memory_limit: u64::MAX,
        }
    }

    /// Creates a new memory instance that can be shared between calls,
    /// with `memory_limit` as upper bound for allocation size.
    ///
    /// The default initial capacity is 4KiB.
    #[cfg(feature = "memory_limit")]
    #[inline]
    pub fn new_with_memory_limit(memory_limit: u64) -> Self {
        Self {
            memory_limit,
            ..Self::new()
        }
    }

    /// Returns `true` if the `new_size` for the current context memory will
    /// make the shared buffer length exceed the `memory_limit`.
    #[cfg(feature = "memory_limit")]
    #[inline]
    pub fn limit_reached(&self, new_size: usize) -> bool {
        self.my_checkpoint.saturating_add(new_size) as u64 > self.memory_limit
    }

    /// Prepares the shared memory for a new child context.
    ///
    /// # Panics
    ///
    /// Panics if this function was already called without freeing child context.
    #[inline]
    pub fn new_child_context(&mut self) -> SharedMemory {
        if self.child_checkpoint.is_some() {
            panic!("new_child_context was already called without freeing child context");
        }
        let new_checkpoint = self.buffer.borrow().len();
        self.child_checkpoint = Some(new_checkpoint);
        SharedMemory {
            buffer: self.buffer.clone(),
            my_checkpoint: new_checkpoint,
            // child_checkpoint is same as my_checkpoint
            child_checkpoint: None,
            #[cfg(feature = "memory_limit")]
            memory_limit: self.memory_limit,
        }
    }

    /// Prepares the shared memory for returning from child context. Do nothing if there is no child context.
    #[inline]
    pub fn free_child_context(&mut self) {
        let Some(child_checkpoint) = self.child_checkpoint.take() else {
            return;
        };
        unsafe {
            self.buffer.borrow_mut().set_len(child_checkpoint);
        }
    }

    /// Returns the length of the current memory range.
    #[inline]
    pub fn len(&self) -> usize {
        self.buffer.borrow().len() - self.my_checkpoint
    }

    /// Returns `true` if the current memory range is empty.
    #[inline]
    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }

    /// Resizes the memory in-place so that `len` is equal to `new_len`.
    #[inline]
    pub fn resize(&mut self, new_size: usize) {
        self.buffer
            .borrow_mut()
            .resize(self.my_checkpoint + new_size, 0);
    }

    /// Returns a byte slice of the memory region at the given offset.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn slice_len(&self, offset: usize, size: usize) -> Ref<'_, [u8]> {
        self.slice_range(offset..offset + size)
    }

    /// Returns a byte slice of the memory region at the given offset.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn slice_range(&self, range: Range<usize>) -> Ref<'_, [u8]> {
        let buffer = self.buffer.borrow(); // Borrow the inner Vec<u8>
        Ref::map(buffer, |b| {
            match b.get(range.start + self.my_checkpoint..range.end + self.my_checkpoint) {
                Some(slice) => slice,
                None => debug_unreachable!("slice OOB: range; len: {}", self.len()),
            }
        })
    }

    /// Returns a byte slice of the memory region at the given offset.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn global_slice_range(&self, range: Range<usize>) -> Ref<'_, [u8]> {
        let buffer = self.buffer.borrow(); // Borrow the inner Vec<u8>
        Ref::map(buffer, |b| match b.get(range) {
            Some(slice) => slice,
            None => debug_unreachable!("slice OOB: range; len: {}", self.len()),
        })
    }

    /// Returns a byte slice of the memory region at the given offset.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn slice_mut(&mut self, offset: usize, size: usize) -> RefMut<'_, [u8]> {
        let buffer = self.buffer.borrow_mut(); // Borrow the inner Vec<u8> mutably
        RefMut::map(buffer, |b| {
            match b.get_mut(self.my_checkpoint + offset..self.my_checkpoint + offset + size) {
                Some(slice) => slice,
                None => debug_unreachable!("slice OOB: {offset}..{}", offset + size),
            }
        })
    }

    /// Returns the byte at the given offset.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    pub fn get_byte(&self, offset: usize) -> u8 {
        self.slice_len(offset, 1)[0]
    }

    /// Returns a 32-byte slice of the memory region at the given offset.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    pub fn get_word(&self, offset: usize) -> B256 {
        (*self.slice_len(offset, 32)).try_into().unwrap()
    }

    /// Returns a U256 of the memory region at the given offset.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    pub fn get_u256(&self, offset: usize) -> U256 {
        self.get_word(offset).into()
    }

    /// Sets the `byte` at the given `index`.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn set_byte(&mut self, offset: usize, byte: u8) {
        self.set(offset, &[byte]);
    }

    /// Sets the given 32-byte `value` to the memory region at the given `offset`.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn set_word(&mut self, offset: usize, value: &B256) {
        self.set(offset, &value[..]);
    }

    /// Sets the given U256 `value` to the memory region at the given `offset`.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn set_u256(&mut self, offset: usize, value: U256) {
        self.set(offset, &value.to_be_bytes::<32>());
    }

    /// Set memory region at given `offset`.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn set(&mut self, offset: usize, value: &[u8]) {
        if !value.is_empty() {
            self.slice_mut(offset, value.len()).copy_from_slice(value);
        }
    }

    /// Set memory from data. Our memory offset+len is expected to be correct but we
    /// are doing bound checks on data/data_offeset/len and zeroing parts that is not copied.
    ///
    /// # Panics
    ///
    /// Panics if memory is out of bounds.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn set_data(&mut self, memory_offset: usize, data_offset: usize, len: usize, data: &[u8]) {
        let mut dst = self.context_memory_mut();
        unsafe { set_data(dst.as_mut(), data, memory_offset, data_offset, len) };
    }

    /// Set data from global memory to local memory. If global range is smaller than len, zeroes the rest.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn global_to_local_set_data(
        &mut self,
        memory_offset: usize,
        data_offset: usize,
        len: usize,
        data_range: Range<usize>,
    ) {
        let mut buffer = self.buffer.borrow_mut(); // Borrow the inner Vec<u8> mutably
        let (src, dst) = buffer.split_at_mut(self.my_checkpoint);
        let src = if data_range.is_empty() {
            &mut []
        } else {
            src.get_mut(data_range).unwrap()
        };
        unsafe { set_data(dst, src, memory_offset, data_offset, len) };
    }

    /// Copies elements from one part of the memory to another part of itself.
    ///
    /// # Panics
    ///
    /// Panics on out of bounds.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn copy(&mut self, dst: usize, src: usize, len: usize) {
        self.context_memory_mut().copy_within(src..src + len, dst);
    }

    /// Returns a reference to the memory of the current context, the active memory.
    #[inline]
    pub fn context_memory(&self) -> Ref<'_, [u8]> {
        let buffer = self.buffer.borrow();
        Ref::map(buffer, |b| match b.get(self.my_checkpoint..) {
            Some(slice) => slice,
            None => debug_unreachable!("Context memory should be always valid"),
        })
    }

    /// Returns a mutable reference to the memory of the current context.
    #[inline]
    pub fn context_memory_mut(&mut self) -> RefMut<'_, [u8]> {
        let buffer = self.buffer.borrow_mut(); // Borrow the inner Vec<u8> mutably
        RefMut::map(buffer, |b| match b.get_mut(self.my_checkpoint..) {
            Some(slice) => slice,
            None => debug_unreachable!("Context memory should be always valid"),
        })
    }
}

/// Copies data from src to dst taking into account the offsets and len.
///
/// If src does not have enough data, it nullifies the rest of dst that is not copied.
///
/// # Safety
///
/// Assumes that dst has enough space to copy the data.
/// Assumes that src has enough data to copy.
/// Assumes that dst_offset and src_offset are in bounds.
/// Assumes that dst and src are valid.
/// Assumes that dst and src do not overlap.
unsafe fn set_data(dst: &mut [u8], src: &[u8], dst_offset: usize, src_offset: usize, len: usize) {
    if src_offset >= src.len() {
        // Nullify all memory slots
        dst.get_mut(dst_offset..dst_offset + len).unwrap().fill(0);
        return;
    }
    let src_end = min(src_offset + len, src.len());
    let src_len = src_end - src_offset;
    debug_assert!(src_offset < src.len() && src_end <= src.len());
    let data = unsafe { src.get_unchecked(src_offset..src_end) };
    unsafe {
        dst.get_unchecked_mut(dst_offset..dst_offset + src_len)
            .copy_from_slice(data)
    };

    // Nullify rest of memory slots
    // SAFETY: Memory is assumed to be valid, and it is commented where this assumption is made.
    unsafe {
        dst.get_unchecked_mut(dst_offset + src_len..dst_offset + len)
            .fill(0)
    };
}

/// Returns number of words what would fit to provided number of bytes,
/// i.e. it rounds up the number bytes to number of words.
#[inline]
pub const fn num_words(len: usize) -> usize {
    len.saturating_add(31) / 32
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_num_words() {
        assert_eq!(num_words(0), 0);
        assert_eq!(num_words(1), 1);
        assert_eq!(num_words(31), 1);
        assert_eq!(num_words(32), 1);
        assert_eq!(num_words(33), 2);
        assert_eq!(num_words(63), 2);
        assert_eq!(num_words(64), 2);
        assert_eq!(num_words(65), 3);
        assert_eq!(num_words(usize::MAX), usize::MAX / 32);
    }

    #[test]
    fn new_free_child_context() {
        let mut sm1 = SharedMemory::new();

        assert_eq!(sm1.buffer.borrow().len(), 0);
        assert_eq!(sm1.my_checkpoint, 0);

        unsafe { sm1.buffer.borrow_mut().set_len(32) };
        assert_eq!(sm1.len(), 32);
        let mut sm2 = sm1.new_child_context();

        assert_eq!(sm2.buffer.borrow().len(), 32);
        assert_eq!(sm2.my_checkpoint, 32);
        assert_eq!(sm2.len(), 0);

        unsafe { sm2.buffer.borrow_mut().set_len(96) };
        assert_eq!(sm2.len(), 64);
        let mut sm3 = sm2.new_child_context();

        assert_eq!(sm3.buffer.borrow().len(), 96);
        assert_eq!(sm3.my_checkpoint, 96);
        assert_eq!(sm3.len(), 0);

        unsafe { sm3.buffer.borrow_mut().set_len(128) };
        let sm4 = sm3.new_child_context();
        assert_eq!(sm4.buffer.borrow().len(), 128);
        assert_eq!(sm4.my_checkpoint, 128);
        assert_eq!(sm4.len(), 0);

        // Free contexts
        drop(sm4);
        sm3.free_child_context();
        assert_eq!(sm3.buffer.borrow().len(), 128);
        assert_eq!(sm3.my_checkpoint, 96);
        assert_eq!(sm3.len(), 32);

        sm2.free_child_context();
        assert_eq!(sm2.buffer.borrow().len(), 96);
        assert_eq!(sm2.my_checkpoint, 32);
        assert_eq!(sm2.len(), 64);

        sm1.free_child_context();
        assert_eq!(sm1.buffer.borrow().len(), 32);
        assert_eq!(sm1.my_checkpoint, 0);
        assert_eq!(sm1.len(), 32);
    }

    #[test]
    fn resize() {
        let mut sm1 = SharedMemory::new();
        sm1.resize(32);
        assert_eq!(sm1.buffer.borrow().len(), 32);
        assert_eq!(sm1.len(), 32);
        assert_eq!(sm1.buffer.borrow().get(0..32), Some(&[0_u8; 32] as &[u8]));

        let mut sm2 = sm1.new_child_context();
        sm2.resize(96);
        assert_eq!(sm2.buffer.borrow().len(), 128);
        assert_eq!(sm2.len(), 96);
        assert_eq!(sm2.buffer.borrow().get(32..128), Some(&[0_u8; 96] as &[u8]));

        sm1.free_child_context();
        assert_eq!(sm1.buffer.borrow().len(), 32);
        assert_eq!(sm1.len(), 32);
        assert_eq!(sm1.buffer.borrow().get(0..32), Some(&[0_u8; 32] as &[u8]));
    }
}
```
```rs [revm/crates/interpreter/src/interpreter/return_data.rs]
use crate::interpreter::ReturnData;
use primitives::Bytes;
#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};

#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
#[derive(Clone, Debug, Default)]
pub struct ReturnDataImpl(pub Bytes);

impl ReturnData for ReturnDataImpl {
    fn buffer(&self) -> &Bytes {
        &self.0
    }

    fn set_buffer(&mut self, bytes: Bytes) {
        self.0 = bytes;
    }
}
```
```rs [revm/crates/interpreter/src/interpreter/runtime_flags.rs]
use primitives::hardfork::SpecId;

use super::RuntimeFlag;
#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};

#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
pub struct RuntimeFlags {
    pub is_static: bool,
    pub is_eof_init: bool,
    pub is_eof: bool,
    pub spec_id: SpecId,
}

impl RuntimeFlag for RuntimeFlags {
    fn is_static(&self) -> bool {
        self.is_static
    }

    fn is_eof(&self) -> bool {
        self.is_eof
    }

    fn is_eof_init(&self) -> bool {
        self.is_eof_init
    }

    fn spec_id(&self) -> SpecId {
        self.spec_id
    }
}
```
```rs [revm/crates/interpreter/src/interpreter/input.rs]
use crate::{interpreter_types::InputsTr, CallInput};
use primitives::{Address, U256};
#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};

/// Inputs for the interpreter that are used for execution of the call.
#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct InputsImpl {
    /// Storage of this account address is being used.
    pub target_address: Address,
    /// Address of the bytecode that is being executed. This field is not used inside Interpreter but it is used
    /// by dependent projects that would need to know the address of the bytecode.
    pub bytecode_address: Option<Address>,
    /// Address of the caller of the call.
    pub caller_address: Address,
    /// Input data for the call.
    pub input: CallInput,
    /// Value of the call.
    pub call_value: U256,
}

impl InputsTr for InputsImpl {
    fn target_address(&self) -> Address {
        self.target_address
    }

    fn caller_address(&self) -> Address {
        self.caller_address
    }

    fn bytecode_address(&self) -> Option<&Address> {
        self.bytecode_address.as_ref()
    }

    fn input(&self) -> &CallInput {
        &self.input
    }

    fn call_value(&self) -> U256 {
        self.call_value
    }
}
```
```rs [revm/crates/interpreter/src/interpreter/stack.rs]
use crate::InstructionResult;
use core::{fmt, ptr};
use primitives::U256;
use std::vec::Vec;

use super::StackTr;

/// EVM interpreter stack limit.
pub const STACK_LIMIT: usize = 1024;

/// EVM stack with [STACK_LIMIT] capacity of words.
#[derive(Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize))]
pub struct Stack {
    /// The underlying data of the stack.
    data: Vec<U256>,
}

impl fmt::Display for Stack {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("[")?;
        for (i, x) in self.data.iter().enumerate() {
            if i > 0 {
                f.write_str(", ")?;
            }
            write!(f, "{x}")?;
        }
        f.write_str("]")
    }
}

impl Default for Stack {
    #[inline]
    fn default() -> Self {
        Self::new()
    }
}

impl Clone for Stack {
    fn clone(&self) -> Self {
        // Use `Self::new()` to ensure the cloned Stack maintains the STACK_LIMIT capacity,
        // and then copy the data. This preserves the invariant that Stack always has
        // STACK_LIMIT capacity, which is crucial for the safety and correctness of other methods.
        let mut new_stack = Self::new();
        new_stack.data.extend_from_slice(&self.data);
        new_stack
    }
}

impl StackTr for Stack {
    fn len(&self) -> usize {
        self.len()
    }

    #[inline]
    fn popn<const N: usize>(&mut self) -> Option<[U256; N]> {
        if self.len() < N {
            return None;
        }
        // SAFETY: Stack length is checked above.
        Some(unsafe { self.popn::<N>() })
    }

    #[inline]
    fn popn_top<const POPN: usize>(&mut self) -> Option<([U256; POPN], &mut U256)> {
        if self.len() < POPN + 1 {
            return None;
        }
        // SAFETY: Stack length is checked above.
        Some(unsafe { self.popn_top::<POPN>() })
    }

    fn exchange(&mut self, n: usize, m: usize) -> bool {
        self.exchange(n, m)
    }

    fn dup(&mut self, n: usize) -> bool {
        self.dup(n)
    }

    fn push(&mut self, value: U256) -> bool {
        self.push(value)
    }
}

impl Stack {
    /// Instantiate a new stack with the [default stack limit][STACK_LIMIT].
    #[inline]
    pub fn new() -> Self {
        Self {
            // SAFETY: Expansion functions assume that capacity is `STACK_LIMIT`.
            data: Vec::with_capacity(STACK_LIMIT),
        }
    }

    /// Returns the length of the stack in words.
    #[inline]
    pub fn len(&self) -> usize {
        self.data.len()
    }

    /// Returns whether the stack is empty.
    #[inline]
    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
    }

    /// Returns a reference to the underlying data buffer.
    #[inline]
    pub fn data(&self) -> &Vec<U256> {
        &self.data
    }

    /// Returns a mutable reference to the underlying data buffer.
    #[inline]
    pub fn data_mut(&mut self) -> &mut Vec<U256> {
        &mut self.data
    }

    /// Consumes the stack and returns the underlying data buffer.
    #[inline]
    pub fn into_data(self) -> Vec<U256> {
        self.data
    }

    /// Removes the topmost element from the stack and returns it, or `StackUnderflow` if it is
    /// empty.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn pop(&mut self) -> Result<U256, InstructionResult> {
        self.data.pop().ok_or(InstructionResult::StackUnderflow)
    }

    /// Removes the topmost element from the stack and returns it.
    ///
    /// # Safety
    ///
    /// The caller is responsible for checking the length of the stack.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub unsafe fn pop_unsafe(&mut self) -> U256 {
        self.data.pop().unwrap_unchecked()
    }

    /// Peeks the top of the stack.
    ///
    /// # Safety
    ///
    /// The caller is responsible for checking the length of the stack.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub unsafe fn top_unsafe(&mut self) -> &mut U256 {
        let len = self.data.len();
        self.data.get_unchecked_mut(len - 1)
    }

    /// Pops `N` values from the stack.
    ///
    /// # Safety
    ///
    /// The caller is responsible for checking the length of the stack.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub unsafe fn popn<const N: usize>(&mut self) -> [U256; N] {
        if N == 0 {
            return [U256::ZERO; N];
        }
        let mut result = [U256::ZERO; N];
        for v in &mut result {
            *v = self.data.pop().unwrap_unchecked();
        }
        result
    }

    /// Pops `N` values from the stack and returns the top of the stack.
    ///
    /// # Safety
    ///
    /// The caller is responsible for checking the length of the stack.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub unsafe fn popn_top<const POPN: usize>(&mut self) -> ([U256; POPN], &mut U256) {
        let result = self.popn::<POPN>();
        let top = self.top_unsafe();
        (result, top)
    }

    /// Push a new value onto the stack.
    ///
    /// If it will exceed the stack limit, returns false and leaves the stack
    /// unchanged.
    #[inline]
    #[must_use]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn push(&mut self, value: U256) -> bool {
        // Allows the compiler to optimize out the `Vec::push` capacity check.
        assume!(self.data.capacity() == STACK_LIMIT);
        if self.data.len() == STACK_LIMIT {
            return false;
        }
        self.data.push(value);
        true
    }

    /// Peek a value at given index for the stack, where the top of
    /// the stack is at index `0`. If the index is too large,
    /// `StackError::Underflow` is returned.
    #[inline]
    pub fn peek(&self, no_from_top: usize) -> Result<U256, InstructionResult> {
        if self.data.len() > no_from_top {
            Ok(self.data[self.data.len() - no_from_top - 1])
        } else {
            Err(InstructionResult::StackUnderflow)
        }
    }

    /// Duplicates the `N`th value from the top of the stack.
    ///
    /// # Panics
    ///
    /// Panics if `n` is 0.
    #[inline]
    #[must_use]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn dup(&mut self, n: usize) -> bool {
        assume!(n > 0, "attempted to dup 0");
        let len = self.data.len();
        if len < n || len + 1 > STACK_LIMIT {
            false
        } else {
            // SAFETY: Check for out of bounds is done above and it makes this safe to do.
            unsafe {
                let ptr = self.data.as_mut_ptr().add(len);
                ptr::copy_nonoverlapping(ptr.sub(n), ptr, 1);
                self.data.set_len(len + 1);
            }
            true
        }
    }

    /// Swaps the topmost value with the `N`th value from the top.
    ///
    /// # Panics
    ///
    /// Panics if `n` is 0.
    #[inline(always)]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn swap(&mut self, n: usize) -> bool {
        self.exchange(0, n)
    }

    /// Exchange two values on the stack.
    ///
    /// `n` is the first index, and the second index is calculated as `n + m`.
    ///
    /// # Panics
    ///
    /// Panics if `m` is zero.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn exchange(&mut self, n: usize, m: usize) -> bool {
        assume!(m > 0, "overlapping exchange");
        let len = self.data.len();
        let n_m_index = n + m;
        if n_m_index >= len {
            return false;
        }
        // SAFETY: `n` and `n_m` are checked to be within bounds, and they don't overlap.
        unsafe {
            // Note: `ptr::swap_nonoverlapping` is more efficient than `slice::swap` or `ptr::swap`
            // because it operates under the assumption that the pointers do not overlap,
            // eliminating an intermediate copy,
            // which is a condition we know to be true in this context.
            let top = self.data.as_mut_ptr().add(len - 1);
            core::ptr::swap_nonoverlapping(top.sub(n), top.sub(n_m_index), 1);
        }
        true
    }

    /// Pushes an arbitrary length slice of bytes onto the stack, padding the last word with zeros
    /// if necessary.
    #[inline]
    pub fn push_slice(&mut self, slice: &[u8]) -> Result<(), InstructionResult> {
        if slice.is_empty() {
            return Ok(());
        }

        let n_words = slice.len().div_ceil(32);
        let new_len = self.data.len() + n_words;
        if new_len > STACK_LIMIT {
            return Err(InstructionResult::StackOverflow);
        }

        // SAFETY: Length checked above.
        unsafe {
            let dst = self.data.as_mut_ptr().add(self.data.len()).cast::<u64>();
            self.data.set_len(new_len);

            let mut i = 0;

            // Write full words
            let words = slice.chunks_exact(32);
            let partial_last_word = words.remainder();
            for word in words {
                // Note: We unroll `U256::from_be_bytes` here to write directly into the buffer,
                // instead of creating a 32 byte array on the stack and then copying it over.
                for l in word.rchunks_exact(8) {
                    dst.add(i).write(u64::from_be_bytes(l.try_into().unwrap()));
                    i += 1;
                }
            }

            if partial_last_word.is_empty() {
                return Ok(());
            }

            // Write limbs of partial last word
            let limbs = partial_last_word.rchunks_exact(8);
            let partial_last_limb = limbs.remainder();
            for l in limbs {
                dst.add(i).write(u64::from_be_bytes(l.try_into().unwrap()));
                i += 1;
            }

            // Write partial last limb by padding with zeros
            if !partial_last_limb.is_empty() {
                let mut tmp = [0u8; 8];
                tmp[8 - partial_last_limb.len()..].copy_from_slice(partial_last_limb);
                dst.add(i).write(u64::from_be_bytes(tmp));
                i += 1;
            }

            debug_assert_eq!(i.div_ceil(4), n_words, "wrote too much");

            // Zero out upper bytes of last word
            let m = i % 4; // 32 / 8
            if m != 0 {
                dst.add(i).write_bytes(0, 4 - m);
            }
        }

        Ok(())
    }

    /// Set a value at given index for the stack, where the top of the
    /// stack is at index `0`. If the index is too large,
    /// `StackError::Underflow` is returned.
    #[inline]
    pub fn set(&mut self, no_from_top: usize, val: U256) -> Result<(), InstructionResult> {
        if self.data.len() > no_from_top {
            let len = self.data.len();
            self.data[len - no_from_top - 1] = val;
            Ok(())
        } else {
            Err(InstructionResult::StackUnderflow)
        }
    }
}

#[cfg(feature = "serde")]
impl<'de> serde::Deserialize<'de> for Stack {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let mut data = Vec::<U256>::deserialize(deserializer)?;
        if data.len() > STACK_LIMIT {
            return Err(serde::de::Error::custom(std::format!(
                "stack size exceeds limit: {} > {}",
                data.len(),
                STACK_LIMIT
            )));
        }
        data.reserve(STACK_LIMIT - data.len());
        Ok(Self { data })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn run(f: impl FnOnce(&mut Stack)) {
        let mut stack = Stack::new();
        // Fill capacity with non-zero values
        unsafe {
            stack.data.set_len(STACK_LIMIT);
            stack.data.fill(U256::MAX);
            stack.data.set_len(0);
        }
        f(&mut stack);
    }

    #[test]
    fn push_slices() {
        // No-op
        run(|stack| {
            stack.push_slice(b"").unwrap();
            assert_eq!(stack.data, []);
        });

        // One word
        run(|stack| {
            stack.push_slice(&[42]).unwrap();
            assert_eq!(stack.data, [U256::from(42)]);
        });

        let n = 0x1111_2222_3333_4444_5555_6666_7777_8888_u128;
        run(|stack| {
            stack.push_slice(&n.to_be_bytes()).unwrap();
            assert_eq!(stack.data, [U256::from(n)]);
        });

        // More than one word
        run(|stack| {
            let b = [U256::from(n).to_be_bytes::<32>(); 2].concat();
            stack.push_slice(&b).unwrap();
            assert_eq!(stack.data, [U256::from(n); 2]);
        });

        run(|stack| {
            let b = [&[0; 32][..], &[42u8]].concat();
            stack.push_slice(&b).unwrap();
            assert_eq!(stack.data, [U256::ZERO, U256::from(42)]);
        });

        run(|stack| {
            let b = [&[0; 32][..], &n.to_be_bytes()].concat();
            stack.push_slice(&b).unwrap();
            assert_eq!(stack.data, [U256::ZERO, U256::from(n)]);
        });

        run(|stack| {
            let b = [&[0; 64][..], &n.to_be_bytes()].concat();
            stack.push_slice(&b).unwrap();
            assert_eq!(stack.data, [U256::ZERO, U256::ZERO, U256::from(n)]);
        });
    }

    #[test]
    fn stack_clone() {
        // Test cloning an empty stack
        let empty_stack = Stack::new();
        let cloned_empty = empty_stack.clone();
        assert_eq!(empty_stack, cloned_empty);
        assert_eq!(cloned_empty.len(), 0);
        assert_eq!(cloned_empty.data().capacity(), STACK_LIMIT);

        // Test cloning a partially filled stack
        let mut partial_stack = Stack::new();
        for i in 0..10 {
            assert!(partial_stack.push(U256::from(i)));
        }
        let mut cloned_partial = partial_stack.clone();
        assert_eq!(partial_stack, cloned_partial);
        assert_eq!(cloned_partial.len(), 10);
        assert_eq!(cloned_partial.data().capacity(), STACK_LIMIT);

        // Test that modifying the clone doesn't affect the original
        assert!(cloned_partial.push(U256::from(100)));
        assert_ne!(partial_stack, cloned_partial);
        assert_eq!(partial_stack.len(), 10);
        assert_eq!(cloned_partial.len(), 11);

        // Test cloning a full stack
        let mut full_stack = Stack::new();
        for i in 0..STACK_LIMIT {
            assert!(full_stack.push(U256::from(i)));
        }
        let mut cloned_full = full_stack.clone();
        assert_eq!(full_stack, cloned_full);
        assert_eq!(cloned_full.len(), STACK_LIMIT);
        assert_eq!(cloned_full.data().capacity(), STACK_LIMIT);

        // Test push to the full original or cloned stack should return StackOverflow
        assert!(!full_stack.push(U256::from(100)));
        assert!(!cloned_full.push(U256::from(100)));
    }
}
```
```rs [revm/crates/interpreter/src/interpreter/subroutine_stack.rs]
use std::vec::Vec;

use crate::interpreter_types::SubRoutineStack;

/// Function(Sub Routine) return frame in eof
///
/// Needed information for returning from a function.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct SubRoutineReturnFrame {
    /// The index of the code container that this frame is executing.
    pub idx: usize,
    /// The program counter where frame execution should continue.
    pub pc: usize,
}

impl SubRoutineReturnFrame {
    /// Return new function frame.
    pub fn new(idx: usize, pc: usize) -> Self {
        Self { idx, pc }
    }
}

/// Function Stack
#[derive(Clone, Debug, Default, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct SubRoutineImpl {
    pub return_stack: Vec<SubRoutineReturnFrame>,
    pub current_code_idx: usize,
}

impl SubRoutineImpl {
    /// Returns new function stack.
    pub fn new() -> Self {
        Self {
            return_stack: Vec::new(),
            current_code_idx: 0,
        }
    }

    pub fn len(&self) -> usize {
        self.return_stack.len()
    }

    pub fn is_empty(&self) -> bool {
        self.return_stack.is_empty()
    }

    /// Return stack length
    pub fn return_stack_len(&self) -> usize {
        self.return_stack.len()
    }

    /// Sets current_code_idx, this is needed for JUMPF opcode.
    pub fn set_current_code_idx(&mut self, idx: usize) {
        self.current_code_idx = idx;
    }
}

impl SubRoutineStack for SubRoutineImpl {
    fn len(&self) -> usize {
        self.return_stack.len()
    }

    fn routine_idx(&self) -> usize {
        self.current_code_idx
    }

    fn push(&mut self, program_counter: usize, new_idx: usize) -> bool {
        if self.return_stack.len() >= 1024 {
            return false;
        }
        self.return_stack.push(SubRoutineReturnFrame {
            idx: self.current_code_idx,
            pc: program_counter,
        });
        self.current_code_idx = new_idx;
        true
    }

    fn pop(&mut self) -> Option<usize> {
        self.return_stack.pop().map(|i| {
            self.current_code_idx = i.idx;
            i.pc
        })
    }

    fn set_routine_idx(&mut self, idx: usize) {
        self.current_code_idx = idx;
    }
}
```
```rs [revm/crates/interpreter/src/interpreter/loop_control.rs]
use crate::interpreter_types::LoopControl as LoopControlTr;
use crate::{Gas, InstructionResult, InterpreterAction};
#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};

#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
pub struct LoopControl {
    /// The execution control flag.
    ///
    /// If this is not set to [`Continue`][InstructionResult::Continue], the interpreter will stop execution.
    pub instruction_result: InstructionResult,
    /// Actions that the EVM should do.
    ///
    /// Set inside `CALL` or `CREATE` instructions and `RETURN` or `REVERT` instructions.
    ///
    /// Additionally those instructions will set [`InstructionResult`] to
    /// [`CallOrCreate`][InstructionResult::CallOrCreate]/[`Return`][InstructionResult::Return]/[`Revert`][InstructionResult::Revert]
    /// so we know the reason.
    pub next_action: InterpreterAction,
    pub gas: Gas,
}

impl LoopControl {
    pub fn new(gas_limit: u64) -> Self {
        Self {
            instruction_result: InstructionResult::Continue,
            next_action: InterpreterAction::None,
            gas: Gas::new(gas_limit),
        }
    }
}

impl LoopControlTr for LoopControl {
    fn set_instruction_result(&mut self, result: InstructionResult) {
        self.instruction_result = result;
    }

    fn set_next_action(&mut self, action: InterpreterAction, result: InstructionResult) {
        self.next_action = action;
        self.instruction_result = result;
    }

    fn gas(&self) -> &Gas {
        &self.gas
    }

    fn gas_mut(&mut self) -> &mut Gas {
        &mut self.gas
    }

    fn instruction_result(&self) -> InstructionResult {
        self.instruction_result
    }
    fn take_next_action(&mut self) -> InterpreterAction {
        core::mem::take(&mut self.next_action)
    }
}
```
```rs [revm/crates/interpreter/src/instructions/contract/call_helpers.rs]
use crate::{
    gas,
    interpreter::Interpreter,
    interpreter_types::{InterpreterTypes, LoopControl, MemoryTr, RuntimeFlag, StackTr},
};
use context_interface::{context::StateLoad, journaled_state::AccountLoad};
use core::{cmp::min, ops::Range};
use primitives::{hardfork::SpecId::*, U256};

#[inline]
pub fn get_memory_input_and_out_ranges(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
) -> Option<(Range<usize>, Range<usize>)> {
    popn!([in_offset, in_len, out_offset, out_len], interpreter, None);

    let mut in_range = resize_memory(interpreter, in_offset, in_len)?;

    if !in_range.is_empty() {
        let offset = interpreter.memory.local_memory_offset();
        in_range = in_range.start.saturating_add(offset)..in_range.end.saturating_add(offset);
    }

    let ret_range = resize_memory(interpreter, out_offset, out_len)?;
    Some((in_range, ret_range))
}

/// Resize memory and return range of memory.
/// If `len` is 0 dont touch memory and return `usize::MAX` as offset and 0 as length.
#[inline]
pub fn resize_memory(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
    offset: U256,
    len: U256,
) -> Option<Range<usize>> {
    let len = as_usize_or_fail_ret!(interpreter, len, None);
    let offset = if len != 0 {
        let offset = as_usize_or_fail_ret!(interpreter, offset, None);
        resize_memory!(interpreter, offset, len, None);
        offset
    } else {
        usize::MAX //unrealistic value so we are sure it is not used
    };
    Some(offset..offset + len)
}

#[inline]
pub fn calc_call_gas(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
    account_load: StateLoad<AccountLoad>,
    has_transfer: bool,
    local_gas_limit: u64,
) -> Option<u64> {
    let call_cost = gas::call_cost(
        interpreter.runtime_flag.spec_id(),
        has_transfer,
        account_load,
    );
    gas!(interpreter, call_cost, None);

    // EIP-150: Gas cost changes for IO-heavy operations
    let gas_limit = if interpreter.runtime_flag.spec_id().is_enabled_in(TANGERINE) {
        // Take l64 part of gas_limit
        min(
            interpreter.control.gas().remaining_63_of_64_parts(),
            local_gas_limit,
        )
    } else {
        local_gas_limit
    };

    Some(gas_limit)
}
```
```rs [revm/crates/interpreter/src/instructions/host.rs]
use crate::{
    gas::{self, warm_cold_cost, CALL_STIPEND},
    instructions::utility::{IntoAddress, IntoU256},
    interpreter_types::{InputsTr, InterpreterTypes, LoopControl, MemoryTr, RuntimeFlag, StackTr},
    Host, InstructionResult,
};
use core::cmp::min;
use primitives::{hardfork::SpecId::*, Bytes, Log, LogData, B256, BLOCK_HASH_HISTORY, U256};

use crate::InstructionContext;

pub fn balance<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn_top!([], top, context.interpreter);
    let address = top.into_address();
    let Some(balance) = context.host.balance(address) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };
    let spec_id = context.interpreter.runtime_flag.spec_id();
    gas!(
        context.interpreter,
        if spec_id.is_enabled_in(BERLIN) {
            warm_cold_cost(balance.is_cold)
        } else if spec_id.is_enabled_in(ISTANBUL) {
            // EIP-1884: Repricing for trie-size-dependent opcodes
            700
        } else if spec_id.is_enabled_in(TANGERINE) {
            400
        } else {
            20
        }
    );
    *top = balance.data;
}

/// EIP-1884: Repricing for trie-size-dependent opcodes
pub fn selfbalance<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    check!(context.interpreter, ISTANBUL);
    gas!(context.interpreter, gas::LOW);

    let Some(balance) = context
        .host
        .balance(context.interpreter.input.target_address())
    else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };
    push!(context.interpreter, balance.data);
}

pub fn extcodesize<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    popn_top!([], top, context.interpreter);
    let address = top.into_address();
    let Some(code) = context.host.load_account_code(address) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };
    let spec_id = context.interpreter.runtime_flag.spec_id();
    if spec_id.is_enabled_in(BERLIN) {
        gas!(context.interpreter, warm_cold_cost(code.is_cold));
    } else if spec_id.is_enabled_in(TANGERINE) {
        gas!(context.interpreter, 700);
    } else {
        gas!(context.interpreter, 20);
    }

    *top = U256::from(code.len());
}

/// EIP-1052: EXTCODEHASH opcode
pub fn extcodehash<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    check!(context.interpreter, CONSTANTINOPLE);
    popn_top!([], top, context.interpreter);
    let address = top.into_address();
    let Some(code_hash) = context.host.load_account_code_hash(address) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };
    let spec_id = context.interpreter.runtime_flag.spec_id();
    if spec_id.is_enabled_in(BERLIN) {
        gas!(context.interpreter, warm_cold_cost(code_hash.is_cold));
    } else if spec_id.is_enabled_in(ISTANBUL) {
        gas!(context.interpreter, 700);
    } else {
        gas!(context.interpreter, 400);
    }
    *top = code_hash.into_u256();
}

pub fn extcodecopy<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    popn!(
        [address, memory_offset, code_offset, len_u256],
        context.interpreter
    );
    let address = address.into_address();
    let Some(code) = context.host.load_account_code(address) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    let len = as_usize_or_fail!(context.interpreter, len_u256);
    gas_or_fail!(
        context.interpreter,
        gas::extcodecopy_cost(
            context.interpreter.runtime_flag.spec_id(),
            len,
            code.is_cold
        )
    );
    if len == 0 {
        return;
    }
    let memory_offset = as_usize_or_fail!(context.interpreter, memory_offset);
    let code_offset = min(as_usize_saturated!(code_offset), code.len());
    resize_memory!(context.interpreter, memory_offset, len);

    // Note: This can't panic because we resized memory to fit.
    context
        .interpreter
        .memory
        .set_data(memory_offset, code_offset, len, &code);
}

pub fn blockhash<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BLOCKHASH);
    popn_top!([], number, context.interpreter);

    let requested_number = *number;
    let block_number = context.host.block_number();

    let Some(diff) = block_number.checked_sub(requested_number) else {
        *number = U256::ZERO;
        return;
    };

    let diff = as_u64_saturated!(diff);

    // blockhash should push zero if number is same as current block number.
    if diff == 0 {
        *number = U256::ZERO;
        return;
    }

    *number = if diff <= BLOCK_HASH_HISTORY {
        let Some(hash) = context.host.block_hash(as_u64_saturated!(requested_number)) else {
            context
                .interpreter
                .control
                .set_instruction_result(InstructionResult::FatalExternalError);
            return;
        };
        U256::from_be_bytes(hash.0)
    } else {
        U256::ZERO
    }
}

pub fn sload<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn_top!([], index, context.interpreter);

    let Some(value) = context
        .host
        .sload(context.interpreter.input.target_address(), *index)
    else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    gas!(
        context.interpreter,
        gas::sload_cost(context.interpreter.runtime_flag.spec_id(), value.is_cold)
    );
    *index = value.data;
}

pub fn sstore<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_non_staticcall!(context.interpreter);

    popn!([index, value], context.interpreter);

    let Some(state_load) =
        context
            .host
            .sstore(context.interpreter.input.target_address(), index, value)
    else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    // EIP-1706 Disable SSTORE with gasleft lower than call stipend
    if context
        .interpreter
        .runtime_flag
        .spec_id()
        .is_enabled_in(ISTANBUL)
        && context.interpreter.control.gas().remaining() <= CALL_STIPEND
    {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::ReentrancySentryOOG);
        return;
    }
    gas!(
        context.interpreter,
        gas::sstore_cost(
            context.interpreter.runtime_flag.spec_id(),
            &state_load.data,
            state_load.is_cold
        )
    );

    context
        .interpreter
        .control
        .gas_mut()
        .record_refund(gas::sstore_refund(
            context.interpreter.runtime_flag.spec_id(),
            &state_load.data,
        ));
}

/// EIP-1153: Transient storage opcodes
/// Store value to transient storage
pub fn tstore<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CANCUN);
    require_non_staticcall!(context.interpreter);
    gas!(context.interpreter, gas::WARM_STORAGE_READ_COST);

    popn!([index, value], context.interpreter);

    context
        .host
        .tstore(context.interpreter.input.target_address(), index, value);
}

/// EIP-1153: Transient storage opcodes
/// Load value from transient storage
pub fn tload<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CANCUN);
    gas!(context.interpreter, gas::WARM_STORAGE_READ_COST);

    popn_top!([], index, context.interpreter);

    *index = context
        .host
        .tload(context.interpreter.input.target_address(), *index);
}

pub fn log<const N: usize, H: Host + ?Sized>(
    context: InstructionContext<'_, H, impl InterpreterTypes>,
) {
    require_non_staticcall!(context.interpreter);

    popn!([offset, len], context.interpreter);
    let len = as_usize_or_fail!(context.interpreter, len);
    gas_or_fail!(context.interpreter, gas::log_cost(N as u8, len as u64));
    let data = if len == 0 {
        Bytes::new()
    } else {
        let offset = as_usize_or_fail!(context.interpreter, offset);
        resize_memory!(context.interpreter, offset, len);
        Bytes::copy_from_slice(context.interpreter.memory.slice_len(offset, len).as_ref())
    };
    if context.interpreter.stack.len() < N {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::StackUnderflow);
        return;
    }
    let Some(topics) = context.interpreter.stack.popn::<N>() else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::StackUnderflow);
        return;
    };

    let log = Log {
        address: context.interpreter.input.target_address(),
        data: LogData::new(topics.into_iter().map(B256::from).collect(), data)
            .expect("LogData should have <=4 topics"),
    };

    context.host.log(log);
}

pub fn selfdestruct<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    require_non_staticcall!(context.interpreter);
    popn!([target], context.interpreter);
    let target = target.into_address();

    let Some(res) = context
        .host
        .selfdestruct(context.interpreter.input.target_address(), target)
    else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    // EIP-3529: Reduction in refunds
    if !context
        .interpreter
        .runtime_flag
        .spec_id()
        .is_enabled_in(LONDON)
        && !res.previously_destroyed
    {
        context
            .interpreter
            .control
            .gas_mut()
            .record_refund(gas::SELFDESTRUCT)
    }

    gas!(
        context.interpreter,
        gas::selfdestruct_cost(context.interpreter.runtime_flag.spec_id(), res)
    );

    context
        .interpreter
        .control
        .set_instruction_result(InstructionResult::SelfDestruct);
}
```
```rs [revm/crates/interpreter/src/instructions/control.rs]
use crate::{
    gas,
    interpreter::Interpreter,
    interpreter_types::{
        EofCodeInfo, Immediates, InterpreterTypes, Jumps, LoopControl, MemoryTr, RuntimeFlag,
        StackTr, SubRoutineStack,
    },
    InstructionResult, InterpreterAction, InterpreterResult,
};
use primitives::{Bytes, U256};

use crate::InstructionContext;

pub fn rjump<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, gas::BASE);
    let offset = context.interpreter.bytecode.read_i16() as isize;
    // In spec it is +3 but pointer is already incremented in
    // `Interpreter::step` so for revm is +2.
    context.interpreter.bytecode.relative_jump(offset + 2);
}

pub fn rjumpi<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, gas::CONDITION_JUMP_GAS);
    popn!([condition], context.interpreter);
    // In spec it is +3 but pointer is already incremented in
    // `Interpreter::step` so for revm is +2.
    let mut offset = 2;
    if !condition.is_zero() {
        offset += context.interpreter.bytecode.read_i16() as isize;
    }

    context.interpreter.bytecode.relative_jump(offset);
}

pub fn rjumpv<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, gas::CONDITION_JUMP_GAS);
    popn!([case], context.interpreter);
    let case = as_isize_saturated!(case);

    let max_index = context.interpreter.bytecode.read_u8() as isize;
    // For number of items we are adding 1 to max_index, multiply by 2 as each offset is 2 bytes
    // and add 1 for max_index itself. Note that revm already incremented the instruction pointer
    let mut offset = (max_index + 1) * 2 + 1;

    if case <= max_index {
        offset += context.interpreter.bytecode.read_offset_i16(1 + case * 2) as isize;
    }
    context.interpreter.bytecode.relative_jump(offset);
}

pub fn jump<ITy: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, ITy>) {
    gas!(context.interpreter, gas::MID);
    popn!([target], context.interpreter);
    jump_inner(context.interpreter, target);
}

pub fn jumpi<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::HIGH);
    popn!([target, cond], context.interpreter);

    if !cond.is_zero() {
        jump_inner(context.interpreter, target);
    }
}

#[inline]
fn jump_inner<WIRE: InterpreterTypes>(interpreter: &mut Interpreter<WIRE>, target: U256) {
    let target = as_usize_or_fail!(interpreter, target, InstructionResult::InvalidJump);
    if !interpreter.bytecode.is_valid_legacy_jump(target) {
        interpreter
            .control
            .set_instruction_result(InstructionResult::InvalidJump);
        return;
    }
    // SAFETY: `is_valid_jump` ensures that `dest` is in bounds.
    interpreter.bytecode.absolute_jump(target);
}

pub fn jumpdest_or_nop<WIRE: InterpreterTypes, H: ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::JUMPDEST);
}

pub fn callf<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, gas::LOW);

    let idx = context.interpreter.bytecode.read_u16() as usize;
    // Get target types
    let Some(types) = context.interpreter.bytecode.code_info(idx) else {
        panic!("Invalid EOF in execution, expecting correct intermediate in callf")
    };

    // Check max stack height for target code section.
    // Safe to subtract as max_stack_height is always more than inputs.
    if context.interpreter.stack.len() + types.max_stack_increase as usize > 1024 {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::StackOverflow);
        return;
    }

    // Push current idx and PC to the callf stack.
    // PC is incremented by 2 to point to the next instruction after callf.
    if !(context
        .interpreter
        .sub_routine
        .push(context.interpreter.bytecode.pc() + 2, idx))
    {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::SubRoutineStackOverflow);
        return;
    };
    let pc = context
        .interpreter
        .bytecode
        .code_section_pc(idx)
        .expect("Invalid code section index");
    context.interpreter.bytecode.absolute_jump(pc);
}

pub fn retf<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, gas::RETF_GAS);

    let Some(jump) = context.interpreter.sub_routine.pop() else {
        panic!("Expected function frame")
    };

    context.interpreter.bytecode.absolute_jump(jump);
}

pub fn jumpf<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, gas::LOW);

    let idx = context.interpreter.bytecode.read_u16() as usize;

    // Get target types
    let types = context
        .interpreter
        .bytecode
        .code_info(idx)
        .expect("Invalid code section index");

    // Check max stack height for target code section.
    if context.interpreter.stack.len() + types.max_stack_increase as usize > 1024 {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::StackOverflow);
        return;
    }
    context.interpreter.sub_routine.set_routine_idx(idx);
    let pc = context
        .interpreter
        .bytecode
        .code_section_pc(idx)
        .expect("Invalid code section index");
    context.interpreter.bytecode.absolute_jump(pc);
}

pub fn pc<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    // - 1 because we have already advanced the instruction pointer in `Interpreter::step`
    push!(
        context.interpreter,
        U256::from(context.interpreter.bytecode.pc() - 1)
    );
}

#[inline]
fn return_inner(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
    instruction_result: InstructionResult,
) {
    // Zero gas cost
    // gas!(interpreter, gas::ZERO)
    popn!([offset, len], interpreter);
    let len = as_usize_or_fail!(interpreter, len);
    // Important: Offset must be ignored if len is zeros
    let mut output = Bytes::default();
    if len != 0 {
        let offset = as_usize_or_fail!(interpreter, offset);
        resize_memory!(interpreter, offset, len);
        output = interpreter.memory.slice_len(offset, len).to_vec().into()
    }

    let gas = *interpreter.control.gas();
    interpreter.control.set_next_action(
        InterpreterAction::Return {
            result: InterpreterResult {
                output,
                gas,
                result: instruction_result,
            },
        },
        instruction_result,
    );
}

pub fn ret<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    return_inner(context.interpreter, InstructionResult::Return);
}

/// EIP-140: REVERT instruction
pub fn revert<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, BYZANTIUM);
    return_inner(context.interpreter, InstructionResult::Revert);
}

/// Stop opcode. This opcode halts the execution.
pub fn stop<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    context
        .interpreter
        .control
        .set_instruction_result(InstructionResult::Stop);
}

/// Invalid opcode. This opcode halts the execution.
pub fn invalid<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    context
        .interpreter
        .control
        .set_instruction_result(InstructionResult::InvalidFEOpcode);
}

/// Unknown opcode. This opcode halts the execution.
pub fn unknown<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    context
        .interpreter
        .control
        .set_instruction_result(InstructionResult::OpcodeNotFound);
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::interpreter::SubRoutineReturnFrame;
    use crate::{instruction_table, interpreter::EthInterpreter};
    use bytecode::opcode::{CALLF, JUMPF, NOP, RETF, RJUMP, RJUMPI, RJUMPV, STOP};
    use bytecode::{
        eof::{CodeInfo, Eof},
        Bytecode,
    };
    use primitives::bytes;
    use std::sync::Arc;

    #[test]
    fn rjump() {
        let bytecode = Bytecode::new_raw(Bytes::from(&[RJUMP, 0x00, 0x02, STOP, STOP]));
        let mut interpreter = Interpreter::<EthInterpreter>::default().with_bytecode(bytecode);

        interpreter.runtime_flag.is_eof = true;
        let table = instruction_table();

        interpreter.step_dummy(&table);
        assert_eq!(interpreter.bytecode.pc(), 5)
    }

    #[test]
    fn rjumpi() {
        let bytecode = Bytecode::new_raw(Bytes::from(&[
            RJUMPI, 0x00, 0x03, RJUMPI, 0x00, 0x01, STOP, STOP,
        ]));
        let mut interpreter = Interpreter::default().with_bytecode(bytecode);

        interpreter.runtime_flag.is_eof = true;
        let table = instruction_table();

        let _ = interpreter.stack.push(U256::from(1));
        let _ = interpreter.stack.push(U256::from(0));

        // Dont jump
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.bytecode.pc(), 3);
        // Jumps to last opcode
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.bytecode.pc(), 7);
    }

    #[test]
    fn rjumpv() {
        let bytecode = Bytecode::new_raw(Bytes::from(&[
            RJUMPV,
            0x01, // max index, 0 and 1
            0x00, // first x0001
            0x01,
            0x00, // second 0x0002
            0x02,
            NOP,
            NOP,
            NOP,
            RJUMP,
            0xFF,
            (-12i8) as u8,
            STOP,
        ]));
        let mut interpreter = Interpreter::default().with_bytecode(bytecode);

        interpreter.runtime_flag.is_eof = true;
        let table = instruction_table();

        // More then max_index
        let _ = interpreter.stack.push(U256::from(10));
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.bytecode.pc(), 6);

        // Cleanup
        interpreter.step_dummy(&table);
        interpreter.step_dummy(&table);
        interpreter.step_dummy(&table);
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.bytecode.pc(), 0);

        // Jump to first index of vtable
        let _ = interpreter.stack.push(U256::from(0));
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.bytecode.pc(), 7);

        // Cleanup
        interpreter.step_dummy(&table);
        interpreter.step_dummy(&table);
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.bytecode.pc(), 0);

        // Jump to second index of vtable
        let _ = interpreter.stack.push(U256::from(1));
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.bytecode.pc(), 8);
    }

    fn dummy_eof() -> Eof {
        let bytes = bytes!("ef00010100040200010001ff00000000800000fe");
        Eof::decode(bytes).unwrap()
    }

    fn eof_setup(bytes1: Bytes, bytes2: Bytes) -> Interpreter {
        eof_setup_with_types(bytes1, bytes2, CodeInfo::default())
    }

    /// Two code section and types section is for last code.
    fn eof_setup_with_types(bytes1: Bytes, bytes2: Bytes, types: CodeInfo) -> Interpreter {
        let mut eof = dummy_eof();

        eof.body.code_section.clear();
        eof.body.code_info.clear();
        eof.header.code_sizes.clear();

        eof.header.code_sizes.push(bytes1.len() as u16);
        eof.body.code_section.push(bytes1.len());
        eof.body.code_info.push(CodeInfo::new(0, 0, 11));

        eof.header.code_sizes.push(bytes2.len() as u16);
        eof.body.code_section.push(bytes2.len() + bytes1.len());
        eof.body.code_info.push(types);

        // added two code infos that are 4 bytes each.
        eof.header.types_size = 2 * 4;

        eof.body.code = Bytes::from([bytes1, bytes2].concat());

        // encoding EOF is done se we can generate a raw bytecode.
        // raw bytecode is used to calculate program counter.
        let encoded = eof.encode_slow();

        let bytecode = Bytecode::Eof(Arc::new(Eof::decode(encoded).unwrap()));

        Interpreter::default().with_bytecode(bytecode)
    }

    #[test]
    fn callf_retf_stop() {
        let table = instruction_table();

        let bytes1 = Bytes::from([CALLF, 0x00, 0x01, STOP]);
        let bytes2 = Bytes::from([RETF]);
        let mut interpreter = eof_setup(bytes1, bytes2.clone());
        interpreter.runtime_flag.is_eof = true;
        let base_pc = interpreter.bytecode.pc();

        // CALLF
        interpreter.step_dummy(&table);

        assert_eq!(interpreter.sub_routine.current_code_idx, 1);
        assert_eq!(
            interpreter.sub_routine.return_stack[0],
            SubRoutineReturnFrame::new(0, 3 + base_pc)
        );
        // points to second code section, at RETF opcode
        assert_eq!(interpreter.bytecode.pc() - base_pc, 4);

        // RETF
        interpreter.step_dummy(&table);

        assert_eq!(interpreter.sub_routine.current_code_idx, 0);
        assert_eq!(interpreter.sub_routine.return_stack, Vec::new());
        // we have returned from the second code section and next opcode is STOP
        assert_eq!(interpreter.bytecode.pc() - base_pc, 3);

        // STOP
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Stop
        );
    }

    #[test]
    fn callf_stop() {
        let table = instruction_table();

        let bytes1 = Bytes::from([CALLF, 0x00, 0x01]);
        let bytes2 = Bytes::from([STOP]);
        let mut interpreter = eof_setup(bytes1, bytes2.clone());
        interpreter.runtime_flag.is_eof = true;
        let base_pc = interpreter.bytecode.pc();

        // CALLF
        interpreter.step_dummy(&table);

        assert_eq!(interpreter.sub_routine.current_code_idx, 1);
        assert_eq!(
            interpreter.sub_routine.return_stack[0],
            SubRoutineReturnFrame::new(0, 3 + base_pc)
        );
        // program counter points to STOP of second code section.
        assert_eq!(interpreter.bytecode.pc(), 3 + base_pc);

        // STOP
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Stop
        );
    }

    #[test]
    fn callf_stack_overflow() {
        let table = instruction_table();

        let bytes1 = Bytes::from([CALLF, 0x00, 0x01]);
        let bytes2 = Bytes::from([STOP]);
        let mut interpreter =
            eof_setup_with_types(bytes1, bytes2.clone(), CodeInfo::new(0, 0, 1023));
        interpreter.runtime_flag.is_eof = true;

        // push two items so we can overflow the CALLF call.
        // overflow happens if max_stack_increase + stack.len is more than 1024
        let _ = interpreter.stack.push(U256::from(0));
        let _ = interpreter.stack.push(U256::from(0));

        // CALLF
        interpreter.step_dummy(&table);

        // Stack overflow
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::StackOverflow
        );
    }

    #[test]
    fn jumpf_stop() {
        let table = instruction_table();

        let bytes1 = Bytes::from([JUMPF, 0x00, 0x01]);
        let bytes2 = Bytes::from([STOP]);
        let mut interpreter = eof_setup(bytes1, bytes2.clone());
        interpreter.runtime_flag.is_eof = true;
        let base_pc = interpreter.bytecode.pc();

        // JUMPF
        interpreter.step_dummy(&table);

        // fails after this line
        assert_eq!(interpreter.sub_routine.current_code_idx, 1);
        assert!(interpreter.sub_routine.return_stack.is_empty());
        // program counter points to STOP of second code section.
        assert_eq!(interpreter.bytecode.pc(), 3 + base_pc);

        // STOP
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Stop
        );
    }

    #[test]
    fn jumpf_stack_overflow() {
        let table = instruction_table();

        let bytes1 = Bytes::from([JUMPF, 0x00, 0x01, STOP]);
        let bytes2 = Bytes::from([STOP]);
        let mut interpreter =
            eof_setup_with_types(bytes1, bytes2.clone(), CodeInfo::new(0, 0, 1023));
        interpreter.runtime_flag.is_eof = true;

        // push two items so we can overflow the JUMPF call.
        // overflow happens if max_stack_size + stack.len is more than 1024
        let _ = interpreter.stack.push(U256::from(0));
        let _ = interpreter.stack.push(U256::from(0));

        // JUMPF
        interpreter.step_dummy(&table);

        // Stack overflow
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::StackOverflow
        );
    }
}
```
```rs [revm/crates/interpreter/src/instructions/utility.rs]
use primitives::{Address, B256, U256};

/// Pushes an arbitrary length slice of bytes onto the stack, padding the last word with zeros
/// if necessary.
///
/// # Panics
///
/// Panics if slice is longer than 32 bytes.
#[inline]
pub fn cast_slice_to_u256(slice: &[u8], dest: &mut U256) {
    if slice.is_empty() {
        return;
    }
    assert!(slice.len() <= 32, "slice too long");

    let n_words = slice.len().div_ceil(32);

    // SAFETY: Length checked above.
    unsafe {
        //let dst = self.data.as_mut_ptr().add(self.data.len()).cast::<u64>();
        //self.data.set_len(new_len);
        let dst = dest.as_limbs_mut().as_mut_ptr();

        let mut i = 0;

        // Write full words
        let words = slice.chunks_exact(32);
        let partial_last_word = words.remainder();
        for word in words {
            // Note: We unroll `U256::from_be_bytes` here to write directly into the buffer,
            // instead of creating a 32 byte array on the stack and then copying it over.
            for l in word.rchunks_exact(8) {
                dst.add(i).write(u64::from_be_bytes(l.try_into().unwrap()));
                i += 1;
            }
        }

        if partial_last_word.is_empty() {
            return;
        }

        // Write limbs of partial last word
        let limbs = partial_last_word.rchunks_exact(8);
        let partial_last_limb = limbs.remainder();
        for l in limbs {
            dst.add(i).write(u64::from_be_bytes(l.try_into().unwrap()));
            i += 1;
        }

        // Write partial last limb by padding with zeros
        if !partial_last_limb.is_empty() {
            let mut tmp = [0u8; 8];
            tmp[8 - partial_last_limb.len()..].copy_from_slice(partial_last_limb);
            dst.add(i).write(u64::from_be_bytes(tmp));
            i += 1;
        }

        debug_assert_eq!(i.div_ceil(4), n_words, "wrote too much");

        // Zero out upper bytes of last word
        let m = i % 4; // 32 / 8
        if m != 0 {
            dst.add(i).write_bytes(0, 4 - m);
        }
    }
}

pub trait IntoU256 {
    fn into_u256(self) -> U256;
}

impl IntoU256 for Address {
    fn into_u256(self) -> U256 {
        self.into_word().into_u256()
    }
}

impl IntoU256 for B256 {
    fn into_u256(self) -> U256 {
        U256::from_be_bytes(self.0)
    }
}

pub trait IntoAddress {
    fn into_address(self) -> Address;
}

impl IntoAddress for U256 {
    fn into_address(self) -> Address {
        Address::from_word(B256::from(self.to_be_bytes()))
    }
}

#[cfg(test)]
mod tests {
    use primitives::address;

    use super::*;

    #[test]
    fn test_into_u256() {
        let addr = address!("0x0000000000000000000000000000000000000001");
        let u256 = addr.into_u256();
        assert_eq!(u256, U256::from(0x01));
        assert_eq!(u256.into_address(), addr);
    }
}
```
```rs [revm/crates/interpreter/src/instructions/bitwise.rs]
use super::i256::i256_cmp;
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, RuntimeFlag, StackTr},
    InstructionContext,
};
use core::cmp::Ordering;
use primitives::U256;

pub fn lt<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = U256::from(op1 < *op2);
}

pub fn gt<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    *op2 = U256::from(op1 > *op2);
}

pub fn slt<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    *op2 = U256::from(i256_cmp(&op1, op2) == Ordering::Less);
}

pub fn sgt<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    *op2 = U256::from(i256_cmp(&op1, op2) == Ordering::Greater);
}

pub fn eq<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    *op2 = U256::from(op1 == *op2);
}

pub fn iszero<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([], op1, context.interpreter);
    *op1 = U256::from(op1.is_zero());
}

pub fn bitand<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1 & *op2;
}

pub fn bitor<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    *op2 = op1 | *op2;
}

pub fn bitxor<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    *op2 = op1 ^ *op2;
}

pub fn not<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([], op1, context.interpreter);

    *op1 = !*op1;
}

pub fn byte<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    let o1 = as_usize_saturated!(op1);
    *op2 = if o1 < 32 {
        // `31 - o1` because `byte` returns LE, while we want BE
        U256::from(op2.byte(31 - o1))
    } else {
        U256::ZERO
    };
}

/// EIP-145: Bitwise shifting instructions in EVM
pub fn shl<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CONSTANTINOPLE);
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    let shift = as_usize_saturated!(op1);
    *op2 = if shift < 256 {
        *op2 << shift
    } else {
        U256::ZERO
    }
}

/// EIP-145: Bitwise shifting instructions in EVM
pub fn shr<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CONSTANTINOPLE);
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    let shift = as_usize_saturated!(op1);
    *op2 = if shift < 256 {
        *op2 >> shift
    } else {
        U256::ZERO
    }
}

/// EIP-145: Bitwise shifting instructions in EVM
pub fn sar<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CONSTANTINOPLE);
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    let shift = as_usize_saturated!(op1);
    *op2 = if shift < 256 {
        op2.arithmetic_shr(shift)
    } else if op2.bit(255) {
        U256::MAX
    } else {
        U256::ZERO
    };
}

#[cfg(test)]
mod tests {
    use crate::{
        host::DummyHost,
        instructions::bitwise::{byte, sar, shl, shr},
        interpreter_types::LoopControl,
        InstructionContext, Interpreter,
    };
    use primitives::{uint, U256};

    #[test]
    fn test_shift_left() {
        let mut interpreter = Interpreter::default();

        struct TestCase {
            value: U256,
            shift: U256,
            expected: U256,
        }

        uint! {
            let test_cases = [
                TestCase {
                    value: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                    shift: 0x00_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                },
                TestCase {
                    value: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                    shift: 0x01_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000002_U256,
                },
                TestCase {
                    value: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                    shift: 0xff_U256,
                    expected: 0x8000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                    shift: 0x0100_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                    shift: 0x0101_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                    shift: 0x00_U256,
                    expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                },
                TestCase {
                    value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                    shift: 0x01_U256,
                    expected: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe_U256,
                },
                TestCase {
                    value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                    shift: 0xff_U256,
                    expected: 0x8000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                    shift: 0x0100_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                    shift: 0x01_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                    shift: 0x01_U256,
                    expected: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe_U256,
                },
            ];
        }

        for test in test_cases {
            push!(interpreter, test.value);
            push!(interpreter, test.shift);
            let context = InstructionContext {
                host: &mut DummyHost,
                interpreter: &mut interpreter,
            };
            shl(context);
            let res = interpreter.stack.pop().unwrap();
            assert_eq!(res, test.expected);
        }
    }

    #[test]
    fn test_logical_shift_right() {
        let mut interpreter = Interpreter::default();

        struct TestCase {
            value: U256,
            shift: U256,
            expected: U256,
        }

        uint! {
            let test_cases = [
                TestCase {
                    value: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                    shift: 0x00_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                },
                TestCase {
                    value: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                    shift: 0x01_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0x8000000000000000000000000000000000000000000000000000000000000000_U256,
                    shift: 0x01_U256,
                    expected: 0x4000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0x8000000000000000000000000000000000000000000000000000000000000000_U256,
                    shift: 0xff_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                },
                TestCase {
                    value: 0x8000000000000000000000000000000000000000000000000000000000000000_U256,
                    shift: 0x0100_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0x8000000000000000000000000000000000000000000000000000000000000000_U256,
                    shift: 0x0101_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                    shift: 0x00_U256,
                    expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                },
                TestCase {
                    value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                    shift: 0x01_U256,
                    expected: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                },
                TestCase {
                    value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                    shift: 0xff_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                },
                TestCase {
                    value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                    shift: 0x0100_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                },
                TestCase {
                    value: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                    shift: 0x01_U256,
                    expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                },
            ];
        }

        for test in test_cases {
            push!(interpreter, test.value);
            push!(interpreter, test.shift);
            let context = InstructionContext {
                host: &mut DummyHost,
                interpreter: &mut interpreter,
            };
            shr(context);
            let res = interpreter.stack.pop().unwrap();
            assert_eq!(res, test.expected);
        }
    }

    #[test]
    fn test_arithmetic_shift_right() {
        let mut interpreter = Interpreter::default();

        struct TestCase {
            value: U256,
            shift: U256,
            expected: U256,
        }

        uint! {
        let test_cases = [
            TestCase {
                value: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                shift: 0x00_U256,
                expected: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
            },
            TestCase {
                value: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
                shift: 0x01_U256,
                expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
            },
            TestCase {
                value: 0x8000000000000000000000000000000000000000000000000000000000000000_U256,
                shift: 0x01_U256,
                expected: 0xc000000000000000000000000000000000000000000000000000000000000000_U256,
            },
            TestCase {
                value: 0x8000000000000000000000000000000000000000000000000000000000000000_U256,
                shift: 0xff_U256,
                expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
            },
            TestCase {
                value: 0x8000000000000000000000000000000000000000000000000000000000000000_U256,
                shift: 0x0100_U256,
                expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
            },
            TestCase {
                value: 0x8000000000000000000000000000000000000000000000000000000000000000_U256,
                shift: 0x0101_U256,
                expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
            },
            TestCase {
                value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                shift: 0x00_U256,
                expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
            },
            TestCase {
                value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                shift: 0x01_U256,
                expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
            },
            TestCase {
                value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                shift: 0xff_U256,
                expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
            },
            TestCase {
                value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                shift: 0x0100_U256,
                expected: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
            },
            TestCase {
                value: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
                shift: 0x01_U256,
                expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
            },
            TestCase {
                value: 0x4000000000000000000000000000000000000000000000000000000000000000_U256,
                shift: 0xfe_U256,
                expected: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
            },
            TestCase {
                value: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                shift: 0xf8_U256,
                expected: 0x000000000000000000000000000000000000000000000000000000000000007f_U256,
            },
            TestCase {
                value: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                shift: 0xfe_U256,
                expected: 0x0000000000000000000000000000000000000000000000000000000000000001_U256,
            },
            TestCase {
                value: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                shift: 0xff_U256,
                expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
            },
            TestCase {
                value: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_U256,
                shift: 0x0100_U256,
                expected: 0x0000000000000000000000000000000000000000000000000000000000000000_U256,
            },
        ];
            }

        for test in test_cases {
            push!(interpreter, test.value);
            push!(interpreter, test.shift);
            let context = InstructionContext {
                host: &mut DummyHost,
                interpreter: &mut interpreter,
            };
            sar(context);
            let res = interpreter.stack.pop().unwrap();
            assert_eq!(res, test.expected);
        }
    }

    #[test]
    fn test_byte() {
        struct TestCase {
            input: U256,
            index: usize,
            expected: U256,
        }

        let mut interpreter = Interpreter::default();

        let input_value = U256::from(0x1234567890abcdef1234567890abcdef_u128);
        let test_cases = (0..32)
            .map(|i| {
                let byte_pos = 31 - i;

                let shift_amount = U256::from(byte_pos * 8);
                let byte_value = (input_value >> shift_amount) & U256::from(0xFF);
                TestCase {
                    input: input_value,
                    index: i,
                    expected: byte_value,
                }
            })
            .collect::<Vec<_>>();

        for test in test_cases.iter() {
            push!(interpreter, test.input);
            push!(interpreter, U256::from(test.index));
            let context = InstructionContext {
                host: &mut DummyHost,
                interpreter: &mut interpreter,
            };
            byte(context);
            let res = interpreter.stack.pop().unwrap();
            assert_eq!(res, test.expected, "Failed at index: {}", test.index);
        }
    }
}
```
```rs [revm/crates/interpreter/src/instructions/memory.rs]
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, MemoryTr, RuntimeFlag, StackTr},
};
use core::cmp::max;
use primitives::U256;

use crate::InstructionContext;

pub fn mload<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([], top, context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, top);
    resize_memory!(context.interpreter, offset, 32);
    *top =
        U256::try_from_be_slice(context.interpreter.memory.slice_len(offset, 32).as_ref()).unwrap()
}

pub fn mstore<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn!([offset, value], context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, offset);
    resize_memory!(context.interpreter, offset, 32);
    context
        .interpreter
        .memory
        .set(offset, &value.to_be_bytes::<32>());
}

pub fn mstore8<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn!([offset, value], context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, offset);
    resize_memory!(context.interpreter, offset, 1);
    context.interpreter.memory.set(offset, &[value.byte(0)]);
}

pub fn msize<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        U256::from(context.interpreter.memory.size())
    );
}

// EIP-5656: MCOPY - Memory copying instruction
pub fn mcopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CANCUN);
    popn!([dst, src, len], context.interpreter);

    // Into usize or fail
    let len = as_usize_or_fail!(context.interpreter, len);
    // Deduce gas
    gas_or_fail!(context.interpreter, gas::copy_cost_verylow(len));
    if len == 0 {
        return;
    }

    let dst = as_usize_or_fail!(context.interpreter, dst);
    let src = as_usize_or_fail!(context.interpreter, src);
    // Resize memory
    resize_memory!(context.interpreter, max(dst, src), len);
    // Copy memory in place
    context.interpreter.memory.copy(dst, src, len);
}
```
```rs [revm/crates/interpreter/src/instructions/arithmetic.rs]
use super::i256::{i256_div, i256_mod};
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, RuntimeFlag, StackTr},
    InstructionContext,
};
use primitives::U256;

pub fn add<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1.wrapping_add(*op2);
}

pub fn mul<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::LOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1.wrapping_mul(*op2);
}

pub fn sub<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1.wrapping_sub(*op2);
}

pub fn div<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::LOW);
    popn_top!([op1], op2, context.interpreter);
    if !op2.is_zero() {
        *op2 = op1.wrapping_div(*op2);
    }
}

pub fn sdiv<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::LOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = i256_div(op1, *op2);
}

pub fn rem<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::LOW);
    popn_top!([op1], op2, context.interpreter);
    if !op2.is_zero() {
        *op2 = op1.wrapping_rem(*op2);
    }
}

pub fn smod<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::LOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = i256_mod(op1, *op2)
}

pub fn addmod<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::MID);
    popn_top!([op1, op2], op3, context.interpreter);
    *op3 = op1.add_mod(op2, *op3)
}

pub fn mulmod<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::MID);
    popn_top!([op1, op2], op3, context.interpreter);
    *op3 = op1.mul_mod(op2, *op3)
}

pub fn exp<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    let spec_id = context.interpreter.runtime_flag.spec_id();
    popn_top!([op1], op2, context.interpreter);
    gas_or_fail!(context.interpreter, gas::exp_cost(spec_id, *op2));
    *op2 = op1.pow(*op2);
}

/// Implements the `SIGNEXTEND` opcode as defined in the Ethereum Yellow Paper.
///
/// In the yellow paper `SIGNEXTEND` is defined to take two inputs, we will call them
/// `x` and `y`, and produce one output.
///
/// The first `t` bits of the output (numbering from the left, starting from 0) are
/// equal to the `t`-th bit of `y`, where `t` is equal to `256 - 8(x + 1)`.
///
/// The remaining bits of the output are equal to the corresponding bits of `y`.
///
/// **Note**: If `x >= 32` then the output is equal to `y` since `t <= 0`.
///
/// To efficiently implement this algorithm in the case `x < 32` we do the following.
///
/// Let `b` be equal to the `t`-th bit of `y` and let `s = 255 - t = 8x + 7`
/// (this is effectively the same index as `t`, but numbering the bits from the
/// right instead of the left).
///
/// We can create a bit mask which is all zeros up to and including the `t`-th bit,
/// and all ones afterwards by computing the quantity `2^s - 1`.
///
/// We can use this mask to compute the output depending on the value of `b`.
///
/// If `b == 1` then the yellow paper says the output should be all ones up to
/// and including the `t`-th bit, followed by the remaining bits of `y`; this is equal to
/// `y | !mask` where `|` is the bitwise `OR` and `!` is bitwise negation.
///
/// Similarly, if `b == 0` then the yellow paper says the output should start with all zeros,
/// then end with bits from `b`; this is equal to `y & mask` where `&` is bitwise `AND`.
pub fn signextend<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::LOW);
    popn_top!([ext], x, context.interpreter);
    // For 31 we also don't need to do anything.
    if ext < U256::from(31) {
        let ext = ext.as_limbs()[0];
        let bit_index = (8 * ext + 7) as usize;
        let bit = x.bit(bit_index);
        let mask = (U256::from(1) << bit_index) - U256::from(1);
        *x = if bit { *x | !mask } else { *x & mask };
    }
}
```
```rs [revm/crates/interpreter/src/instructions/system.rs]
use crate::{
    gas,
    interpreter::Interpreter,
    interpreter_types::{
        InputsTr, InterpreterTypes, LegacyBytecode, LoopControl, MemoryTr, ReturnData, RuntimeFlag,
        StackTr,
    },
    CallInput, InstructionResult,
};
use core::ptr;
use primitives::{B256, KECCAK_EMPTY, U256};

use crate::InstructionContext;

pub fn keccak256<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn_top!([offset], top, context.interpreter);
    let len = as_usize_or_fail!(context.interpreter, top);
    gas_or_fail!(context.interpreter, gas::keccak256_cost(len));
    let hash = if len == 0 {
        KECCAK_EMPTY
    } else {
        let from = as_usize_or_fail!(context.interpreter, offset);
        resize_memory!(context.interpreter, from, len);
        primitives::keccak256(context.interpreter.memory.slice_len(from, len).as_ref())
    };
    *top = hash.into();
}

pub fn address<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        context
            .interpreter
            .input
            .target_address()
            .into_word()
            .into()
    );
}

pub fn caller<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        context
            .interpreter
            .input
            .caller_address()
            .into_word()
            .into()
    );
}

pub fn codesize<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        U256::from(context.interpreter.bytecode.bytecode_len())
    );
}

pub fn codecopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn!([memory_offset, code_offset, len], context.interpreter);
    let len = as_usize_or_fail!(context.interpreter, len);
    let Some(memory_offset) = memory_resize(context.interpreter, memory_offset, len) else {
        return;
    };
    let code_offset = as_usize_saturated!(code_offset);

    // Note: This can't panic because we resized memory to fit.
    context.interpreter.memory.set_data(
        memory_offset,
        code_offset,
        len,
        context.interpreter.bytecode.bytecode_slice(),
    );
}

pub fn calldataload<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    //pop_top!(interpreter, offset_ptr);
    popn_top!([], offset_ptr, context.interpreter);
    let mut word = B256::ZERO;
    let offset = as_usize_saturated!(offset_ptr);
    let input = context.interpreter.input.input();
    let input_len = input.len();
    if offset < input_len {
        let count = 32.min(input_len - offset);

        // SAFETY: `count` is bounded by the calldata length.
        // This is `word[..count].copy_from_slice(input[offset..offset + count])`, written using
        // raw pointers as apparently the compiler cannot optimize the slice version, and using
        // `get_unchecked` twice is uglier.
        match context.interpreter.input.input() {
            CallInput::Bytes(bytes) => {
                unsafe {
                    ptr::copy_nonoverlapping(bytes.as_ptr().add(offset), word.as_mut_ptr(), count)
                };
            }
            CallInput::SharedBuffer(range) => {
                let input_slice = context.interpreter.memory.global_slice(range.clone());
                unsafe {
                    ptr::copy_nonoverlapping(
                        input_slice.as_ptr().add(offset),
                        word.as_mut_ptr(),
                        count,
                    )
                };
            }
        }
    }
    *offset_ptr = word.into();
}

pub fn calldatasize<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        U256::from(context.interpreter.input.input().len())
    );
}

pub fn callvalue<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    push!(context.interpreter, context.interpreter.input.call_value());
}

pub fn calldatacopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn!([memory_offset, data_offset, len], context.interpreter);
    let len = as_usize_or_fail!(context.interpreter, len);
    let Some(memory_offset) = memory_resize(context.interpreter, memory_offset, len) else {
        return;
    };

    let data_offset = as_usize_saturated!(data_offset);
    match context.interpreter.input.input() {
        CallInput::Bytes(bytes) => {
            context
                .interpreter
                .memory
                .set_data(memory_offset, data_offset, len, bytes.as_ref());
        }
        CallInput::SharedBuffer(range) => {
            context.interpreter.memory.set_data_from_global(
                memory_offset,
                data_offset,
                len,
                range.clone(),
            );
        }
    }
}

/// EIP-211: New opcodes: RETURNDATASIZE and RETURNDATACOPY
pub fn returndatasize<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, BYZANTIUM);
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        U256::from(context.interpreter.return_data.buffer().len())
    );
}

/// EIP-211: New opcodes: RETURNDATASIZE and RETURNDATACOPY
pub fn returndatacopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, BYZANTIUM);
    popn!([memory_offset, offset, len], context.interpreter);

    let len = as_usize_or_fail!(context.interpreter, len);
    let data_offset = as_usize_saturated!(offset);

    // Old legacy behavior is to panic if data_end is out of scope of return buffer.
    // This behavior is changed in EOF.
    let data_end = data_offset.saturating_add(len);
    if data_end > context.interpreter.return_data.buffer().len()
        && !context.interpreter.runtime_flag.is_eof()
    {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::OutOfOffset);
        return;
    }

    let Some(memory_offset) = memory_resize(context.interpreter, memory_offset, len) else {
        return;
    };

    // Note: This can't panic because we resized memory to fit.
    context.interpreter.memory.set_data(
        memory_offset,
        data_offset,
        len,
        context.interpreter.return_data.buffer(),
    );
}

/// Part of EOF `<https://eips.ethereum.org/EIPS/eip-7069>`.
pub fn returndataload<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([], offset, context.interpreter);
    let offset_usize = as_usize_saturated!(offset);

    let mut output = [0u8; 32];
    if let Some(available) = context
        .interpreter
        .return_data
        .buffer()
        .len()
        .checked_sub(offset_usize)
    {
        let copy_len = available.min(32);
        output[..copy_len].copy_from_slice(
            &context.interpreter.return_data.buffer()[offset_usize..offset_usize + copy_len],
        );
    }

    *offset = B256::from(output).into();
}

pub fn gas<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        U256::from(context.interpreter.control.gas().remaining())
    );
}

// common logic for copying data from a source buffer to the EVM's memory
pub fn memory_resize(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
    memory_offset: U256,
    len: usize,
) -> Option<usize> {
    // Safe to cast usize to u64
    gas_or_fail!(interpreter, gas::copy_cost_verylow(len), None);
    if len == 0 {
        return None;
    }
    let memory_offset = as_usize_or_fail_ret!(interpreter, memory_offset, None);
    resize_memory!(interpreter, memory_offset, len, None);

    Some(memory_offset)
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::{instruction_table, InstructionResult};
    use bytecode::{opcode::RETURNDATACOPY, opcode::RETURNDATALOAD, Bytecode};
    use primitives::{bytes, Bytes};

    #[test]
    fn returndataload() {
        let bytecode = Bytecode::new_raw(Bytes::from(&[
            RETURNDATALOAD,
            RETURNDATALOAD,
            RETURNDATALOAD,
            RETURNDATALOAD,
        ]));
        let mut interpreter = Interpreter::default().with_bytecode(bytecode);

        let table = instruction_table();
        interpreter.runtime_flag.is_eof = true;

        let _ = interpreter.stack.push(U256::from(0));
        interpreter.return_data.set_buffer(bytes!(
            "000000000000000400000000000000030000000000000002000000000000000100"
        ));

        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.stack.data(),
            &vec![U256::from_limbs([0x01, 0x02, 0x03, 0x04])]
        );

        let _ = interpreter.stack.pop();
        let _ = interpreter.stack.push(U256::from(1));

        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Continue
        );
        assert_eq!(
            interpreter.stack.data(),
            &vec![U256::from_limbs([0x0100, 0x0200, 0x0300, 0x0400])]
        );

        let _ = interpreter.stack.pop();
        let _ = interpreter.stack.push(U256::from(32));
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Continue
        );
        assert_eq!(
            interpreter.stack.data(),
            &vec![U256::from_limbs([0x00, 0x00, 0x00, 0x00])]
        );

        // Offset right at the boundary of the return data buffer size
        let _ = interpreter.stack.pop();
        let _ = interpreter
            .stack
            .push(U256::from(interpreter.return_data.buffer().len()));
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Continue
        );
        assert_eq!(
            interpreter.stack.data(),
            &vec![U256::from_limbs([0x00, 0x00, 0x00, 0x00])]
        );
    }

    #[test]
    fn returndatacopy() {
        let bytecode = Bytecode::new_raw(Bytes::from(&[
            RETURNDATACOPY,
            RETURNDATACOPY,
            RETURNDATACOPY,
            RETURNDATACOPY,
            RETURNDATACOPY,
            RETURNDATACOPY,
        ]));
        let mut interpreter = Interpreter::default().with_bytecode(bytecode);

        let table = instruction_table();
        interpreter.runtime_flag.is_eof = true;

        interpreter.return_data.set_buffer(bytes!(
            "000000000000000400000000000000030000000000000002000000000000000100"
        ));
        interpreter.memory.resize(256);

        // Copying within bounds
        let _ = interpreter.stack.push(U256::from(32));
        let _ = interpreter.stack.push(U256::from(0));
        let _ = interpreter.stack.push(U256::from(0));

        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Continue
        );
        assert_eq!(
            *interpreter.memory.slice(0..32),
            interpreter.return_data.buffer()[0..32]
        );

        // Copying with partial out-of-bounds (should zero pad)
        let _ = interpreter.stack.push(U256::from(64));
        let _ = interpreter.stack.push(U256::from(16));
        let _ = interpreter.stack.push(U256::from(64));
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Continue
        );
        assert_eq!(
            *interpreter.memory.slice(64..80),
            interpreter.return_data.buffer()[16..32]
        );
        assert_eq!(*interpreter.memory.slice(80..128), [0u8; 48]);

        // Completely out-of-bounds (should be all zeros)
        let _ = interpreter.stack.push(U256::from(32));
        let _ = interpreter.stack.push(U256::from(96));
        let _ = interpreter.stack.push(U256::from(128));
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Continue
        );
        assert_eq!(*interpreter.memory.slice(128..160), [0u8; 32]);

        // Large offset
        let _ = interpreter.stack.push(U256::from(32));
        let _ = interpreter.stack.push(U256::MAX);
        let _ = interpreter.stack.push(U256::from(0));
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Continue
        );
        assert_eq!(*interpreter.memory.slice(0..32), [0u8; 32]);

        // Offset just before the boundary of the return data buffer size
        let _ = interpreter.stack.push(U256::from(32));
        let _ = interpreter
            .stack
            .push(U256::from(interpreter.return_data.buffer().len() - 32));
        let _ = interpreter.stack.push(U256::from(0));
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Continue
        );
        assert_eq!(
            *interpreter.memory.slice(0..32),
            interpreter.return_data.buffer()[interpreter.return_data.buffer().len() - 32..]
        );

        // Offset right at the boundary of the return data buffer size
        let _ = interpreter.stack.push(U256::from(32));
        let _ = interpreter
            .stack
            .push(U256::from(interpreter.return_data.buffer().len()));
        let _ = interpreter.stack.push(U256::from(0));
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::Continue
        );
        assert_eq!(*interpreter.memory.slice(0..32), [0u8; 32]);
    }
}
```
```rs [revm/crates/interpreter/src/instructions/data.rs]
use crate::{
    gas::{cost_per_word, BASE, DATA_LOAD_GAS, VERYLOW},
    interpreter_types::{
        EofData, Immediates, InterpreterTypes, Jumps, LoopControl, MemoryTr, RuntimeFlag, StackTr,
    },
};
use primitives::{B256, U256};

use crate::InstructionContext;

pub fn data_load<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, DATA_LOAD_GAS);
    popn_top!([], offset, context.interpreter);

    let offset_usize = as_usize_saturated!(offset);

    let slice = context.interpreter.bytecode.data_slice(offset_usize, 32);

    let mut word = [0u8; 32];
    word[..slice.len()].copy_from_slice(slice);

    *offset = U256::from_be_bytes(word);
}

pub fn data_loadn<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, VERYLOW);
    let offset = context.interpreter.bytecode.read_u16() as usize;

    let slice = context.interpreter.bytecode.data_slice(offset, 32);

    let mut word = [0u8; 32];
    word[..slice.len()].copy_from_slice(slice);

    push!(context.interpreter, B256::new(word).into());

    // Add +2 to the instruction pointer to skip the offset
    context.interpreter.bytecode.relative_jump(2);
}

pub fn data_size<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, BASE);

    push!(
        context.interpreter,
        U256::from(context.interpreter.bytecode.data_size())
    );
}

pub fn data_copy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, VERYLOW);
    popn!([mem_offset, offset, size], context.interpreter);

    // Sizes more than u64::MAX will spend all the gas in memory resize.
    let size = as_usize_or_fail!(context.interpreter, size);
    // Size of zero should not change the memory
    if size == 0 {
        return;
    }
    // Fail if mem offset is big as it will spend all the gas
    let mem_offset = as_usize_or_fail!(context.interpreter, mem_offset);
    resize_memory!(context.interpreter, mem_offset, size);

    gas_or_fail!(context.interpreter, cost_per_word(size, VERYLOW));

    let offset = as_usize_saturated!(offset);
    let data = context.interpreter.bytecode.data();

    // Set data from the eof to the shared memory. Padded it with zeros.
    context
        .interpreter
        .memory
        .set_data(mem_offset, offset, size, data);
}

#[cfg(test)]
mod test {
    use bytecode::{Bytecode, Eof};
    use primitives::{b256, bytes, Bytes};
    use std::sync::Arc;

    use super::*;
    use crate::{instruction_table, Interpreter};
    use bytecode::opcode::{DATACOPY, DATALOAD, DATALOADN, DATASIZE};

    fn dummy_eof(code_bytes: Bytes) -> Bytecode {
        let bytes = bytes!("ef00010100040200010001ff00000000800000fe");
        let mut eof = Eof::decode(bytes).unwrap();

        eof.body.data_section =
            bytes!("000000000000000000000000000000000000000000000000000000000000000102030405");
        eof.header.data_size = eof.body.data_section.len() as u16;

        eof.header.code_sizes[0] = code_bytes.len() as u16;
        eof.body.code_section[0] = code_bytes.len();
        eof.body.code = code_bytes;
        Bytecode::Eof(Arc::new(eof))
    }

    #[test]
    fn dataload_dataloadn() {
        let table = instruction_table();

        let eof = dummy_eof(Bytes::from([
            DATALOAD, DATALOADN, 0x00, 0x00, DATALOAD, DATALOADN, 0x00, 35, DATALOAD, DATALOADN,
            0x00, 36, DATASIZE,
        ]));

        let mut interpreter = Interpreter::default().with_bytecode(eof);
        interpreter.runtime_flag.is_eof = true;

        // DATALOAD
        let _ = interpreter.stack.push(U256::from(0));
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.data(), &vec![U256::from(0x01)]);
        interpreter.stack.pop().unwrap();

        // DATALOADN
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.data(), &vec![U256::from(0x01)]);
        interpreter.stack.pop().unwrap();

        // DATALOAD (padding)
        let _ = interpreter.stack.push(U256::from(35));
        interpreter.step_dummy(&table);

        assert_eq!(
            interpreter.stack.data(),
            &vec![b256!("0500000000000000000000000000000000000000000000000000000000000000").into()]
        );
        interpreter.stack.pop().unwrap();

        // DATALOADN (padding)
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.stack.data(),
            &vec![b256!("0500000000000000000000000000000000000000000000000000000000000000").into()]
        );
        interpreter.stack.pop().unwrap();

        // DATALOAD (out of bounds)
        let _ = interpreter.stack.push(U256::from(36));
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.data(), &vec![U256::ZERO]);
        interpreter.stack.pop().unwrap();

        // DATALOADN (out of bounds)
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.data(), &vec![U256::ZERO]);
        interpreter.stack.pop().unwrap();

        // DATA SIZE
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.data(), &vec![U256::from(36)]);
    }

    #[test]
    fn data_copy() {
        let table = instruction_table();
        let eof = dummy_eof(Bytes::from([DATACOPY, DATACOPY, DATACOPY, DATACOPY]));

        let mut interpreter = Interpreter::default().with_bytecode(eof);
        interpreter.runtime_flag.is_eof = true;

        // Data copy
        // size, offset mem_offset,
        let _ = interpreter.stack.push(U256::from(32));
        let _ = interpreter.stack.push(U256::from(0));
        let _ = interpreter.stack.push(U256::from(0));

        interpreter.step_dummy(&table);
        assert_eq!(
            *interpreter.memory.context_memory(),
            bytes!("0000000000000000000000000000000000000000000000000000000000000001")
        );

        // Data copy (Padding)
        // size, offset mem_offset,
        let _ = interpreter.stack.push(U256::from(2));
        let _ = interpreter.stack.push(U256::from(35));
        let _ = interpreter.stack.push(U256::from(1));
        interpreter.step_dummy(&table);
        assert_eq!(
            *interpreter.memory.context_memory(),
            bytes!("0005000000000000000000000000000000000000000000000000000000000001")
        );

        // Data copy (Out of bounds)
        // size, offset mem_offset,
        let _ = interpreter.stack.push(U256::from(2));
        let _ = interpreter.stack.push(U256::from(37));
        let _ = interpreter.stack.push(U256::from(1));
        interpreter.step_dummy(&table);
        assert_eq!(
            *interpreter.memory.context_memory(),
            bytes!("0000000000000000000000000000000000000000000000000000000000000001")
        );

        // Data copy (Size == 0)
        // mem_offset, offset, size
        let _ = interpreter.stack.push(U256::from(0));
        let _ = interpreter.stack.push(U256::from(37));
        let _ = interpreter.stack.push(U256::from(1));
        interpreter.step_dummy(&table);
        assert_eq!(
            *interpreter.memory.context_memory(),
            bytes!("0000000000000000000000000000000000000000000000000000000000000001")
        );
    }
}
```
```rs [revm/crates/interpreter/src/instructions/block_info.rs]
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, RuntimeFlag, StackTr},
    Host,
};
use primitives::{hardfork::SpecId::*, U256};

use crate::InstructionContext;

/// EIP-1344: ChainID opcode
pub fn chainid<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, ISTANBUL);
    gas!(context.interpreter, gas::BASE);
    push!(context.interpreter, context.host.chain_id());
}

pub fn coinbase<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        context.host.beneficiary().into_word().into()
    );
}

pub fn timestamp<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE);
    push!(context.interpreter, context.host.timestamp());
}

pub fn block_number<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE);
    push!(context.interpreter, U256::from(context.host.block_number()));
}

pub fn difficulty<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE);
    if context
        .interpreter
        .runtime_flag
        .spec_id()
        .is_enabled_in(MERGE)
    {
        // Unwrap is safe as this fields is checked in validation handler.
        push!(context.interpreter, context.host.prevrandao().unwrap());
    } else {
        push!(context.interpreter, context.host.difficulty());
    }
}

pub fn gaslimit<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE);
    push!(context.interpreter, context.host.gas_limit());
}

/// EIP-3198: BASEFEE opcode
pub fn basefee<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, LONDON);
    gas!(context.interpreter, gas::BASE);
    push!(context.interpreter, context.host.basefee());
}

/// EIP-7516: BLOBBASEFEE opcode
pub fn blob_basefee<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    check!(context.interpreter, CANCUN);
    gas!(context.interpreter, gas::BASE);
    push!(context.interpreter, context.host.blob_gasprice());
}
```
```rs [revm/crates/interpreter/src/instructions/contract.rs]
mod call_helpers;

pub use call_helpers::{calc_call_gas, get_memory_input_and_out_ranges, resize_memory};

use crate::{
    gas::{self, EOF_CREATE_GAS, MIN_CALLEE_GAS},
    instructions::utility::IntoAddress,
    interpreter::Interpreter,
    interpreter_action::FrameInput,
    interpreter_types::{
        EofContainer, Immediates, InputsTr, InterpreterTypes, Jumps, LoopControl, MemoryTr,
        ReturnData, RuntimeFlag, StackTr,
    },
    CallInput, CallInputs, CallScheme, CallValue, CreateInputs, EOFCreateInputs, Host,
    InstructionResult, InterpreterAction, InterpreterResult,
};
use bytecode::eof::{Eof, EofHeader};
use context_interface::CreateScheme;
use core::cmp::max;
use primitives::{eof::new_eof_address, hardfork::SpecId, Address, Bytes, B256, U256};
use std::boxed::Box;

use crate::InstructionContext;

/// EOF Create instruction
pub fn eofcreate<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    require_eof!(context.interpreter);
    require_non_staticcall!(context.interpreter);
    gas!(context.interpreter, EOF_CREATE_GAS);
    let initcontainer_index = context.interpreter.bytecode.read_u8();

    popn!([salt, input_offset, input_size, value], context.interpreter);

    let container = context
        .interpreter
        .bytecode
        .eof_container(initcontainer_index as usize)
        .expect("valid container")
        .clone();

    // Resize memory and get return range.
    let Some(input_range) = resize_memory(context.interpreter, input_offset, input_size) else {
        return;
    };

    let input = if !input_range.is_empty() {
        context
            .interpreter
            .memory
            .slice(input_range)
            .to_vec()
            .into()
    } else {
        Bytes::new()
    };

    let eof = Eof::decode(container.clone()).expect("Subcontainer is verified");

    if !eof.body.is_data_filled {
        // Should be always false as it is verified by eof verification.
        panic!("Panic if data section is not full");
    }

    // Calculate new address
    let created_address = new_eof_address(
        context.interpreter.input.target_address(),
        salt.to_be_bytes().into(),
    );

    let gas_limit = context.interpreter.control.gas().remaining_63_of_64_parts();
    gas!(context.interpreter, gas_limit);

    // Send container for execution as all deployed containers are preverified to be valid EOF.
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::EOFCreate(Box::new(
            EOFCreateInputs::new_opcode(
                context.interpreter.input.target_address(),
                created_address,
                value,
                eof,
                gas_limit,
                CallInput::Bytes(input),
            ),
        ))),
        InstructionResult::CallOrCreate,
    );

    // jump over initcontainer index.
    context.interpreter.bytecode.relative_jump(1);
}

/// Instruction to create a new EOF contract from a transaction initcode.
pub fn txcreate<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    // TODO(EOF) only accepted in EOF.
    require_eof!(context.interpreter);
    require_non_staticcall!(context.interpreter);
    gas!(context.interpreter, EOF_CREATE_GAS);

    // pop tx_initcode_hash, salt, input_offset, input_size, value from the operand stack
    popn!(
        [tx_initcode_hash, salt, input_offset, input_size, value],
        context.interpreter
    );
    let tx_initcode_hash = B256::from(tx_initcode_hash);

    // perform (and charge for) memory expansion using [input_offset, input_size]
    let Some(input_range) = resize_memory(context.interpreter, input_offset, input_size) else {
        return;
    };

    // Get validated initcode with all its subcontainers validated recursively.
    let Some(initcode) = context.host.initcode_by_hash(tx_initcode_hash) else {
        // If initcode is not found or not valid, push 0 on the stack.
        push!(context.interpreter, U256::ZERO);
        return;
    };

    // caller’s memory slice [input_offset:input_size] is used as calldata
    let input = if !input_range.is_empty() {
        context
            .interpreter
            .memory
            .slice(input_range)
            .to_vec()
            .into()
    } else {
        Bytes::new()
    };

    // Decode initcode as EOF.
    let eof = Eof::decode(initcode).expect("Subcontainer is verified");

    // Calculate new address
    let created_address = new_eof_address(
        context.interpreter.input.target_address(),
        salt.to_be_bytes().into(),
    );

    let gas_limit = context.interpreter.control.gas().remaining_63_of_64_parts();
    gas!(context.interpreter, gas_limit);

    // Send container for execution as all deployed containers are preverified to be valid EOF.
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::EOFCreate(Box::new(
            EOFCreateInputs::new_opcode(
                context.interpreter.input.target_address(),
                created_address,
                value,
                eof,
                gas_limit,
                CallInput::Bytes(input),
            ),
        ))),
        InstructionResult::CallOrCreate,
    );
}

pub fn return_contract<H: Host + ?Sized>(
    context: InstructionContext<'_, H, impl InterpreterTypes>,
) {
    if !context.interpreter.runtime_flag.is_eof_init() {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::ReturnContractInNotInitEOF);
        return;
    }
    let deploy_container_index = context.interpreter.bytecode.read_u8();
    popn!([aux_data_offset, aux_data_size], context.interpreter);
    let aux_data_size = as_usize_or_fail!(context.interpreter, aux_data_size);
    let container = context
        .interpreter
        .bytecode
        .eof_container(deploy_container_index as usize)
        .expect("valid container")
        .clone();

    // Convert to EOF so we can check data section size.
    let (eof_header, _) = EofHeader::decode(&container).expect("valid EOF header");

    let static_aux_size = eof_header.eof_size() - container.len();

    // Important: Offset must be ignored if len is zeros
    let mut output = if aux_data_size != 0 {
        let aux_data_offset = as_usize_or_fail!(context.interpreter, aux_data_offset);
        resize_memory!(context.interpreter, aux_data_offset, aux_data_size);

        let aux_slice = context
            .interpreter
            .memory
            .slice_len(aux_data_offset, aux_data_size);

        [&container, aux_slice.as_ref()].concat()
    } else {
        container.to_vec()
    };

    // `data_size - static_aux_size` give us current data `container` size.
    // And with `aux_slice` len we can calculate new data size.
    let new_data_size = eof_header.data_size as usize - static_aux_size + aux_data_size;
    if new_data_size > 0xFFFF {
        // Aux data is too big
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::EofAuxDataOverflow);
        return;
    }
    if new_data_size < eof_header.data_size as usize {
        // Aux data is too small
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::EofAuxDataTooSmall);
        return;
    }
    let new_data_size = (new_data_size as u16).to_be_bytes();

    // Set new data size in eof bytes as we know exact index.
    output[eof_header.data_size_raw_i()..][..2].clone_from_slice(&new_data_size);
    let output: Bytes = output.into();

    let result = InstructionResult::ReturnContract;
    let gas = *context.interpreter.control.gas();
    context.interpreter.control.set_next_action(
        crate::InterpreterAction::Return {
            result: InterpreterResult {
                output,
                gas,
                result,
            },
        },
        result,
    );
}

pub fn extcall_input(interpreter: &mut Interpreter<impl InterpreterTypes>) -> Option<Bytes> {
    popn!([input_offset, input_size], interpreter, None);
    let return_memory_offset = resize_memory(interpreter, input_offset, input_size)?;

    if return_memory_offset.is_empty() {
        return Some(Bytes::new());
    }

    Some(Bytes::copy_from_slice(
        interpreter.memory.slice(return_memory_offset).as_ref(),
    ))
}

#[inline]
pub fn extcall_gas_calc<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: &mut InstructionContext<'_, H, WIRE>,
    target: Address,
    transfers_value: bool,
) -> Option<u64> {
    let Some(account_load) = context.host.load_account_delegated(target) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return None;
    };

    // account_load.is_empty will be accounted if there is transfer value
    // Berlin can be hardcoded as extcall came after berlin.
    let call_cost = gas::call_cost(
        context.interpreter.runtime_flag.spec_id(),
        transfers_value,
        account_load,
    );
    gas!(context.interpreter, call_cost, None);

    // Calculate the gas available to callee as caller’s
    // remaining gas reduced by max(ceil(gas/64), MIN_RETAINED_GAS) (MIN_RETAINED_GAS is 5000).
    let gas_reduce = max(context.interpreter.control.gas().remaining() / 64, 5000);
    let gas_limit = context
        .interpreter
        .control
        .gas()
        .remaining()
        .saturating_sub(gas_reduce);

    // The MIN_CALLEE_GAS rule is a replacement for stipend:
    // it simplifies the reasoning about the gas costs and is
    // applied uniformly for all introduced EXT*CALL instructions.
    //
    // If Gas available to callee is less than MIN_CALLEE_GAS trigger light failure (Same as Revert).
    if gas_limit < MIN_CALLEE_GAS {
        // Push 1 to stack to indicate that call light failed.
        // It is safe to ignore stack overflow error as we already popped multiple values from stack.
        let _ = context.interpreter.stack.push(U256::from(1));
        context.interpreter.return_data.clear();
        // Return none to continue execution.
        return None;
    }

    gas!(context.interpreter, gas_limit, None);
    Some(gas_limit)
}

/// Pop target address from stack and check if it is valid.
///
/// Valid address has first 12 bytes as zeroes.
#[inline]
pub fn pop_extcall_target_address(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
) -> Option<Address> {
    popn!([target_address], interpreter, None);
    let target_address = B256::from(target_address);
    // Check if target is left padded with zeroes.
    if target_address[..12].iter().any(|i| *i != 0) {
        interpreter
            .control
            .set_instruction_result(InstructionResult::InvalidEXTCALLTarget);
        return None;
    }
    // Discard first 12 bytes.
    Some(Address::from_word(target_address))
}

pub fn extcall<WIRE: InterpreterTypes, H: Host + ?Sized>(
    mut context: InstructionContext<'_, H, WIRE>,
) {
    require_eof!(context.interpreter);

    // Pop target address
    let Some(target_address) = pop_extcall_target_address(context.interpreter) else {
        return;
    };

    // Input call
    let Some(input) = extcall_input(context.interpreter) else {
        return;
    };

    popn!([value], context.interpreter);
    let has_transfer = !value.is_zero();
    if context.interpreter.runtime_flag.is_static() && has_transfer {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::CallNotAllowedInsideStatic);
        return;
    }

    let Some(gas_limit) = extcall_gas_calc(&mut context, target_address, has_transfer) else {
        return;
    };

    // Call host to interact with target contract
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::Call(Box::new(CallInputs {
            input: CallInput::Bytes(input),
            gas_limit,
            target_address,
            caller: context.interpreter.input.target_address(),
            bytecode_address: target_address,
            value: CallValue::Transfer(value),
            scheme: CallScheme::ExtCall,
            is_static: context.interpreter.runtime_flag.is_static(),
            is_eof: true,
            return_memory_offset: 0..0,
        }))),
        InstructionResult::CallOrCreate,
    );
}

pub fn extdelegatecall<WIRE: InterpreterTypes, H: Host + ?Sized>(
    mut context: InstructionContext<'_, H, WIRE>,
) {
    require_eof!(context.interpreter);

    // Pop target address
    let Some(target_address) = pop_extcall_target_address(context.interpreter) else {
        return;
    };

    // Input call
    let Some(input) = extcall_input(context.interpreter) else {
        return;
    };

    let Some(gas_limit) = extcall_gas_calc(&mut context, target_address, false) else {
        return;
    };

    // Call host to interact with target contract
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::Call(Box::new(CallInputs {
            input: CallInput::Bytes(input),
            gas_limit,
            target_address: context.interpreter.input.target_address(),
            caller: context.interpreter.input.caller_address(),
            bytecode_address: target_address,
            value: CallValue::Apparent(context.interpreter.input.call_value()),
            scheme: CallScheme::ExtDelegateCall,
            is_static: context.interpreter.runtime_flag.is_static(),
            is_eof: true,
            return_memory_offset: 0..0,
        }))),
        InstructionResult::CallOrCreate,
    );
}

pub fn extstaticcall<WIRE: InterpreterTypes, H: Host + ?Sized>(
    mut context: InstructionContext<'_, H, WIRE>,
) {
    require_eof!(context.interpreter);

    // Pop target address
    let Some(target_address) = pop_extcall_target_address(context.interpreter) else {
        return;
    };

    // Input call
    let Some(input) = extcall_input(context.interpreter) else {
        return;
    };

    let Some(gas_limit) = extcall_gas_calc(&mut context, target_address, false) else {
        return;
    };

    // Call host to interact with target contract
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::Call(Box::new(CallInputs {
            input: CallInput::Bytes(input),
            gas_limit,
            target_address,
            caller: context.interpreter.input.target_address(),
            bytecode_address: target_address,
            value: CallValue::Transfer(U256::ZERO),
            scheme: CallScheme::ExtStaticCall,
            is_static: true,
            is_eof: true,
            return_memory_offset: 0..0,
        }))),
        InstructionResult::CallOrCreate,
    );
}

pub fn create<WIRE: InterpreterTypes, const IS_CREATE2: bool, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    require_non_staticcall!(context.interpreter);

    // EIP-1014: Skinny CREATE2
    if IS_CREATE2 {
        check!(context.interpreter, PETERSBURG);
    }

    popn!([value, code_offset, len], context.interpreter);
    let len = as_usize_or_fail!(context.interpreter, len);

    let mut code = Bytes::new();
    if len != 0 {
        // EIP-3860: Limit and meter initcode
        if context
            .interpreter
            .runtime_flag
            .spec_id()
            .is_enabled_in(SpecId::SHANGHAI)
        {
            // Limit is set as double of max contract bytecode size
            if len > context.host.max_initcode_size() {
                context
                    .interpreter
                    .control
                    .set_instruction_result(InstructionResult::CreateInitCodeSizeLimit);
                return;
            }
            gas!(context.interpreter, gas::initcode_cost(len));
        }

        let code_offset = as_usize_or_fail!(context.interpreter, code_offset);
        resize_memory!(context.interpreter, code_offset, len);
        code = Bytes::copy_from_slice(
            context
                .interpreter
                .memory
                .slice_len(code_offset, len)
                .as_ref(),
        );
    }

    // EIP-1014: Skinny CREATE2
    let scheme = if IS_CREATE2 {
        popn!([salt], context.interpreter);
        // SAFETY: `len` is reasonable in size as gas for it is already deducted.
        gas_or_fail!(context.interpreter, gas::create2_cost(len));
        CreateScheme::Create2 { salt }
    } else {
        gas!(context.interpreter, gas::CREATE);
        CreateScheme::Create
    };

    let mut gas_limit = context.interpreter.control.gas().remaining();

    // EIP-150: Gas cost changes for IO-heavy operations
    if context
        .interpreter
        .runtime_flag
        .spec_id()
        .is_enabled_in(SpecId::TANGERINE)
    {
        // Take remaining gas and deduce l64 part of it.
        gas_limit -= gas_limit / 64
    }
    gas!(context.interpreter, gas_limit);

    // Call host to interact with target contract
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::Create(Box::new(CreateInputs {
            caller: context.interpreter.input.target_address(),
            scheme,
            value,
            init_code: code,
            gas_limit,
        }))),
        InstructionResult::CallOrCreate,
    );
}

pub fn call<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn!([local_gas_limit, to, value], context.interpreter);
    let to = to.into_address();
    // Max gas limit is not possible in real ethereum situation.
    let local_gas_limit = u64::try_from(local_gas_limit).unwrap_or(u64::MAX);

    let has_transfer = !value.is_zero();
    if context.interpreter.runtime_flag.is_static() && has_transfer {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::CallNotAllowedInsideStatic);
        return;
    }

    let Some((input, return_memory_offset)) = get_memory_input_and_out_ranges(context.interpreter)
    else {
        return;
    };

    let Some(account_load) = context.host.load_account_delegated(to) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    let Some(mut gas_limit) = calc_call_gas(
        context.interpreter,
        account_load,
        has_transfer,
        local_gas_limit,
    ) else {
        return;
    };

    gas!(context.interpreter, gas_limit);

    // Add call stipend if there is value to be transferred.
    if has_transfer {
        gas_limit = gas_limit.saturating_add(gas::CALL_STIPEND);
    }

    // Call host to interact with target contract
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::Call(Box::new(CallInputs {
            input: CallInput::SharedBuffer(input),
            gas_limit,
            target_address: to,
            caller: context.interpreter.input.target_address(),
            bytecode_address: to,
            value: CallValue::Transfer(value),
            scheme: CallScheme::Call,
            is_static: context.interpreter.runtime_flag.is_static(),
            is_eof: false,
            return_memory_offset,
        }))),
        InstructionResult::CallOrCreate,
    );
}

pub fn call_code<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    popn!([local_gas_limit, to, value], context.interpreter);
    let to = Address::from_word(B256::from(to));
    // Max gas limit is not possible in real ethereum situation.
    let local_gas_limit = u64::try_from(local_gas_limit).unwrap_or(u64::MAX);

    //pop!(context.interpreter, value);
    let Some((input, return_memory_offset)) = get_memory_input_and_out_ranges(context.interpreter)
    else {
        return;
    };

    let Some(mut load) = context.host.load_account_delegated(to) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    // Set `is_empty` to false as we are not creating this account.
    load.is_empty = false;
    let Some(mut gas_limit) =
        calc_call_gas(context.interpreter, load, !value.is_zero(), local_gas_limit)
    else {
        return;
    };

    gas!(context.interpreter, gas_limit);

    // Add call stipend if there is value to be transferred.
    if !value.is_zero() {
        gas_limit = gas_limit.saturating_add(gas::CALL_STIPEND);
    }

    // Call host to interact with target contract
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::Call(Box::new(CallInputs {
            input: CallInput::SharedBuffer(input),
            gas_limit,
            target_address: context.interpreter.input.target_address(),
            caller: context.interpreter.input.target_address(),
            bytecode_address: to,
            value: CallValue::Transfer(value),
            scheme: CallScheme::CallCode,
            is_static: context.interpreter.runtime_flag.is_static(),
            is_eof: false,
            return_memory_offset,
        }))),
        InstructionResult::CallOrCreate,
    );
}

pub fn delegate_call<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    check!(context.interpreter, HOMESTEAD);
    popn!([local_gas_limit, to], context.interpreter);
    let to = Address::from_word(B256::from(to));
    // Max gas limit is not possible in real ethereum situation.
    let local_gas_limit = u64::try_from(local_gas_limit).unwrap_or(u64::MAX);

    let Some((input, return_memory_offset)) = get_memory_input_and_out_ranges(context.interpreter)
    else {
        return;
    };

    let Some(mut load) = context.host.load_account_delegated(to) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    // Set is_empty to false as we are not creating this account.
    load.is_empty = false;
    let Some(gas_limit) = calc_call_gas(context.interpreter, load, false, local_gas_limit) else {
        return;
    };

    gas!(context.interpreter, gas_limit);

    // Call host to interact with target contract
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::Call(Box::new(CallInputs {
            input: CallInput::SharedBuffer(input),
            gas_limit,
            target_address: context.interpreter.input.target_address(),
            caller: context.interpreter.input.caller_address(),
            bytecode_address: to,
            value: CallValue::Apparent(context.interpreter.input.call_value()),
            scheme: CallScheme::DelegateCall,
            is_static: context.interpreter.runtime_flag.is_static(),
            is_eof: false,
            return_memory_offset,
        }))),
        InstructionResult::CallOrCreate,
    );
}

pub fn static_call<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    check!(context.interpreter, BYZANTIUM);
    popn!([local_gas_limit, to], context.interpreter);
    let to = Address::from_word(B256::from(to));
    // Max gas limit is not possible in real ethereum situation.
    let local_gas_limit = u64::try_from(local_gas_limit).unwrap_or(u64::MAX);

    let Some((input, return_memory_offset)) = get_memory_input_and_out_ranges(context.interpreter)
    else {
        return;
    };

    let Some(mut load) = context.host.load_account_delegated(to) else {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };
    // Set `is_empty` to false as we are not creating this account.
    load.is_empty = false;
    let Some(gas_limit) = calc_call_gas(context.interpreter, load, false, local_gas_limit) else {
        return;
    };
    gas!(context.interpreter, gas_limit);

    // Call host to interact with target contract
    context.interpreter.control.set_next_action(
        InterpreterAction::NewFrame(FrameInput::Call(Box::new(CallInputs {
            input: CallInput::SharedBuffer(input),
            gas_limit,
            target_address: to,
            caller: context.interpreter.input.target_address(),
            bytecode_address: to,
            value: CallValue::Transfer(U256::ZERO),
            scheme: CallScheme::StaticCall,
            is_static: true,
            is_eof: false,
            return_memory_offset,
        }))),
        InstructionResult::CallOrCreate,
    );
}
```
```rs [revm/crates/interpreter/src/instructions/i256.rs]
use core::cmp::Ordering;
use primitives::U256;

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(i8)]
pub enum Sign {
    // Same as `cmp::Ordering`
    Minus = -1,
    Zero = 0,
    #[allow(dead_code)] // "constructed" with `mem::transmute` in `i256_sign` below
    Plus = 1,
}

pub const MAX_POSITIVE_VALUE: U256 = U256::from_limbs([
    0xffffffffffffffff,
    0xffffffffffffffff,
    0xffffffffffffffff,
    0x7fffffffffffffff,
]);

pub const MIN_NEGATIVE_VALUE: U256 = U256::from_limbs([
    0x0000000000000000,
    0x0000000000000000,
    0x0000000000000000,
    0x8000000000000000,
]);

const FLIPH_BITMASK_U64: u64 = 0x7FFF_FFFF_FFFF_FFFF;

#[inline]
pub fn i256_sign(val: &U256) -> Sign {
    if val.bit(U256::BITS - 1) {
        Sign::Minus
    } else {
        // SAFETY: false == 0 == Zero, true == 1 == Plus
        unsafe { core::mem::transmute::<bool, Sign>(!val.is_zero()) }
    }
}

#[inline]
pub fn i256_sign_compl(val: &mut U256) -> Sign {
    let sign = i256_sign(val);
    if sign == Sign::Minus {
        two_compl_mut(val);
    }
    sign
}

#[inline]
fn u256_remove_sign(val: &mut U256) {
    // SAFETY: U256 does not have any padding bytes
    unsafe {
        val.as_limbs_mut()[3] &= FLIPH_BITMASK_U64;
    }
}

#[inline]
pub fn two_compl_mut(op: &mut U256) {
    *op = two_compl(*op);
}

#[inline]
pub fn two_compl(op: U256) -> U256 {
    op.wrapping_neg()
}

#[inline]
pub fn i256_cmp(first: &U256, second: &U256) -> Ordering {
    let first_sign = i256_sign(first);
    let second_sign = i256_sign(second);
    match first_sign.cmp(&second_sign) {
        // Note: Adding `if first_sign != Sign::Zero` to short circuit zero comparisons performs
        // slower on average, as of #582
        Ordering::Equal => first.cmp(second),
        o => o,
    }
}

#[inline]
pub fn i256_div(mut first: U256, mut second: U256) -> U256 {
    let second_sign = i256_sign_compl(&mut second);
    if second_sign == Sign::Zero {
        return U256::ZERO;
    }

    let first_sign = i256_sign_compl(&mut first);
    if first == MIN_NEGATIVE_VALUE && second == U256::from(1) {
        return two_compl(MIN_NEGATIVE_VALUE);
    }

    // Necessary overflow checks are done above, perform the division
    let mut d = first / second;

    // Set sign bit to zero
    u256_remove_sign(&mut d);

    // Two's complement only if the signs are different
    // Note: This condition has better codegen than an exhaustive match, as of #582
    if (first_sign == Sign::Minus && second_sign != Sign::Minus)
        || (second_sign == Sign::Minus && first_sign != Sign::Minus)
    {
        two_compl(d)
    } else {
        d
    }
}

#[inline]
pub fn i256_mod(mut first: U256, mut second: U256) -> U256 {
    let first_sign = i256_sign_compl(&mut first);
    if first_sign == Sign::Zero {
        return U256::ZERO;
    }

    let second_sign = i256_sign_compl(&mut second);
    if second_sign == Sign::Zero {
        return U256::ZERO;
    }

    let mut r = first % second;

    // Set sign bit to zero
    u256_remove_sign(&mut r);

    if first_sign == Sign::Minus {
        two_compl(r)
    } else {
        r
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use core::num::Wrapping;
    use primitives::uint;

    #[test]
    fn div_i256() {
        // Sanity checks based on i8. Notice that we need to use `Wrapping` here because
        // Rust will prevent the overflow by default whereas the EVM does not.
        assert_eq!(Wrapping(i8::MIN) / Wrapping(-1), Wrapping(i8::MIN));
        assert_eq!(i8::MAX / -1, -i8::MAX);

        uint! {
            assert_eq!(i256_div(MIN_NEGATIVE_VALUE, -1_U256), MIN_NEGATIVE_VALUE);
            assert_eq!(i256_div(MIN_NEGATIVE_VALUE, 1_U256), MIN_NEGATIVE_VALUE);
            assert_eq!(i256_div(MAX_POSITIVE_VALUE, 1_U256), MAX_POSITIVE_VALUE);
            assert_eq!(i256_div(MAX_POSITIVE_VALUE, -1_U256), -1_U256 * MAX_POSITIVE_VALUE);
            assert_eq!(i256_div(100_U256, -1_U256), -100_U256);
            assert_eq!(i256_div(100_U256, 2_U256), 50_U256);
        }
    }
    #[test]
    fn test_i256_sign() {
        uint! {
            assert_eq!(i256_sign(&0_U256), Sign::Zero);
            assert_eq!(i256_sign(&1_U256), Sign::Plus);
            assert_eq!(i256_sign(&-1_U256), Sign::Minus);
            assert_eq!(i256_sign(&MIN_NEGATIVE_VALUE), Sign::Minus);
            assert_eq!(i256_sign(&MAX_POSITIVE_VALUE), Sign::Plus);
        }
    }

    #[test]
    fn test_i256_sign_compl() {
        uint! {
            let mut zero = 0_U256;
            let mut positive = 1_U256;
            let mut negative = -1_U256;
            assert_eq!(i256_sign_compl(&mut zero), Sign::Zero);
            assert_eq!(i256_sign_compl(&mut positive), Sign::Plus);
            assert_eq!(i256_sign_compl(&mut negative), Sign::Minus);
        }
    }

    #[test]
    fn test_two_compl() {
        uint! {
            assert_eq!(two_compl(0_U256), 0_U256);
            assert_eq!(two_compl(1_U256), -1_U256);
            assert_eq!(two_compl(-1_U256), 1_U256);
            assert_eq!(two_compl(2_U256), -2_U256);
            assert_eq!(two_compl(-2_U256), 2_U256);

            // Two's complement of the min value is itself.
            assert_eq!(two_compl(MIN_NEGATIVE_VALUE), MIN_NEGATIVE_VALUE);
        }
    }

    #[test]
    fn test_two_compl_mut() {
        uint! {
            let mut value = 1_U256;
            two_compl_mut(&mut value);
            assert_eq!(value, -1_U256);
        }
    }

    #[test]
    fn test_i256_cmp() {
        uint! {
            assert_eq!(i256_cmp(&1_U256, &2_U256), Ordering::Less);
            assert_eq!(i256_cmp(&2_U256, &2_U256), Ordering::Equal);
            assert_eq!(i256_cmp(&3_U256, &2_U256), Ordering::Greater);
            assert_eq!(i256_cmp(&-1_U256, &-1_U256), Ordering::Equal);
            assert_eq!(i256_cmp(&-1_U256, &-2_U256), Ordering::Greater);
            assert_eq!(i256_cmp(&-1_U256, &0_U256), Ordering::Less);
            assert_eq!(i256_cmp(&-2_U256, &2_U256), Ordering::Less);
        }
    }

    #[test]
    fn test_i256_div() {
        uint! {
            assert_eq!(i256_div(1_U256, 0_U256), 0_U256);
            assert_eq!(i256_div(0_U256, 1_U256), 0_U256);
            assert_eq!(i256_div(0_U256, -1_U256), 0_U256);
            assert_eq!(i256_div(MIN_NEGATIVE_VALUE, 1_U256), MIN_NEGATIVE_VALUE);
            assert_eq!(i256_div(4_U256, 2_U256), 2_U256);
            assert_eq!(i256_div(MIN_NEGATIVE_VALUE, MIN_NEGATIVE_VALUE), 1_U256);
            assert_eq!(i256_div(2_U256, -1_U256), -2_U256);
            assert_eq!(i256_div(-2_U256, -1_U256), 2_U256);
        }
    }

    #[test]
    fn test_i256_mod() {
        uint! {
            assert_eq!(i256_mod(0_U256, 1_U256), 0_U256);
            assert_eq!(i256_mod(1_U256, 0_U256), 0_U256);
            assert_eq!(i256_mod(4_U256, 2_U256), 0_U256);
            assert_eq!(i256_mod(3_U256, 2_U256), 1_U256);
            assert_eq!(i256_mod(MIN_NEGATIVE_VALUE, 1_U256), 0_U256);
            assert_eq!(i256_mod(2_U256, 2_U256), 0_U256);
            assert_eq!(i256_mod(2_U256, 3_U256), 2_U256);
            assert_eq!(i256_mod(-2_U256, 3_U256), -2_U256);
            assert_eq!(i256_mod(2_U256, -3_U256), 2_U256);
            assert_eq!(i256_mod(-2_U256, -3_U256), -2_U256);
        }
    }
}
```
```rs [revm/crates/interpreter/src/instructions/stack.rs]
use crate::{
    gas,
    instructions::utility::cast_slice_to_u256,
    interpreter_types::{Immediates, InterpreterTypes, Jumps, LoopControl, RuntimeFlag, StackTr},
};
use primitives::U256;

use crate::InstructionContext;

pub fn pop<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    // Can ignore return. as relative N jump is safe operation.
    popn!([_i], context.interpreter);
}

/// EIP-3855: PUSH0 instruction
///
/// Introduce a new instruction which pushes the constant value 0 onto the stack.
pub fn push0<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, SHANGHAI);
    gas!(context.interpreter, gas::BASE);
    push!(context.interpreter, U256::ZERO);
}

pub fn push<const N: usize, WIRE: InterpreterTypes, H: ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::VERYLOW);
    push!(context.interpreter, U256::ZERO);
    popn_top!([], top, context.interpreter);

    let imm = context.interpreter.bytecode.read_slice(N);
    cast_slice_to_u256(imm, top);

    // Can ignore return. as relative N jump is safe operation
    context.interpreter.bytecode.relative_jump(N as isize);
}

pub fn dup<const N: usize, WIRE: InterpreterTypes, H: ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::VERYLOW);
    if !context.interpreter.stack.dup(N) {
        context
            .interpreter
            .control
            .set_instruction_result(crate::InstructionResult::StackOverflow);
    }
}

pub fn swap<const N: usize, WIRE: InterpreterTypes, H: ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::VERYLOW);
    assert!(N != 0);
    if !context.interpreter.stack.exchange(0, N) {
        context
            .interpreter
            .control
            .set_instruction_result(crate::InstructionResult::StackOverflow);
    }
}

pub fn dupn<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, gas::VERYLOW);
    let imm = context.interpreter.bytecode.read_u8();
    if !context.interpreter.stack.dup(imm as usize + 1) {
        context
            .interpreter
            .control
            .set_instruction_result(crate::InstructionResult::StackOverflow);
    }
    context.interpreter.bytecode.relative_jump(1);
}

pub fn swapn<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, gas::VERYLOW);
    let imm = context.interpreter.bytecode.read_u8();
    if !context.interpreter.stack.exchange(0, imm as usize + 1) {
        context
            .interpreter
            .control
            .set_instruction_result(crate::InstructionResult::StackOverflow);
    }
    context.interpreter.bytecode.relative_jump(1);
}

pub fn exchange<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    require_eof!(context.interpreter);
    gas!(context.interpreter, gas::VERYLOW);
    let imm = context.interpreter.bytecode.read_u8();
    let n = (imm >> 4) + 1;
    let m = (imm & 0x0F) + 1;
    if !context.interpreter.stack.exchange(n as usize, m as usize) {
        context
            .interpreter
            .control
            .set_instruction_result(crate::InstructionResult::StackOverflow);
    }
    context.interpreter.bytecode.relative_jump(1);
}

#[cfg(test)]
mod test {
    use crate::{instruction_table, InstructionResult, Interpreter};
    use bytecode::opcode::{DUPN, EXCHANGE, STOP, SWAPN};
    use bytecode::Bytecode;
    use primitives::{Bytes, U256};

    #[test]
    fn dupn() {
        let bytecode = Bytecode::new_raw(Bytes::from(&[DUPN, 0x00, DUPN, 0x01, DUPN, 0x02, STOP]));
        let mut interpreter = Interpreter::default().with_bytecode(bytecode);

        let table = instruction_table();

        interpreter.runtime_flag.is_eof = true;
        let _ = interpreter.stack.push(U256::from(10));
        let _ = interpreter.stack.push(U256::from(20));

        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.pop(), Ok(U256::from(20)));
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.pop(), Ok(U256::from(10)));
        interpreter.step_dummy(&table);
        assert_eq!(
            interpreter.control.instruction_result,
            InstructionResult::StackOverflow
        );
    }

    #[test]
    fn swapn() {
        let bytecode = Bytecode::new_raw(Bytes::from(&[SWAPN, 0x00, SWAPN, 0x01, STOP]));
        let mut interpreter = Interpreter::default().with_bytecode(bytecode);

        let table = instruction_table();
        interpreter.runtime_flag.is_eof = true;

        let _ = interpreter.stack.push(U256::from(10));
        let _ = interpreter.stack.push(U256::from(20));
        let _ = interpreter.stack.push(U256::from(0));

        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.peek(0), Ok(U256::from(20)));
        assert_eq!(interpreter.stack.peek(1), Ok(U256::from(0)));
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.peek(0), Ok(U256::from(10)));
        assert_eq!(interpreter.stack.peek(2), Ok(U256::from(20)));
    }

    #[test]
    fn exchange() {
        let bytecode = Bytecode::new_raw(Bytes::from(&[EXCHANGE, 0x00, EXCHANGE, 0x11, STOP]));
        let mut interpreter = Interpreter::default().with_bytecode(bytecode);

        let table = instruction_table();
        interpreter.runtime_flag.is_eof = true;

        let _ = interpreter.stack.push(U256::from(1));
        let _ = interpreter.stack.push(U256::from(5));
        let _ = interpreter.stack.push(U256::from(10));
        let _ = interpreter.stack.push(U256::from(15));
        let _ = interpreter.stack.push(U256::from(0));

        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.peek(1), Ok(U256::from(10)));
        assert_eq!(interpreter.stack.peek(2), Ok(U256::from(15)));
        interpreter.step_dummy(&table);
        assert_eq!(interpreter.stack.peek(2), Ok(U256::from(1)));
        assert_eq!(interpreter.stack.peek(4), Ok(U256::from(15)));
    }
}
```
```rs [revm/crates/interpreter/src/instructions/macros.rs]
//! Utility macros to help implementing opcode instruction functions.

/// `const` Option `?`.
#[macro_export]
macro_rules! tri {
    ($e:expr) => {
        match $e {
            Some(v) => v,
            None => return None,
        }
    };
}

/// Fails the instruction if the current call is static.
#[macro_export]
macro_rules! require_non_staticcall {
    ($interpreter:expr) => {
        if $interpreter.runtime_flag.is_static() {
            $interpreter
                .control
                .set_instruction_result($crate::InstructionResult::StateChangeDuringStaticCall);
            return;
        }
    };
}

#[macro_export]
macro_rules! otry {
    ($expression: expr) => {{
        let Some(value) = $expression else {
            return;
        };
        value
    }};
}

/// Error if the current call is executing EOF.
#[macro_export]
macro_rules! require_eof {
    ($interpreter:expr) => {
        if !$interpreter.runtime_flag.is_eof() {
            $interpreter
                .control
                .set_instruction_result($crate::InstructionResult::EOFOpcodeDisabledInLegacy);
            return;
        }
    };
}

/// Check if the `SPEC` is enabled, and fail the instruction if it is not.
#[macro_export]
macro_rules! check {
    ($interpreter:expr, $min:ident) => {
        if !$interpreter
            .runtime_flag
            .spec_id()
            .is_enabled_in(primitives::hardfork::SpecId::$min)
        {
            $interpreter
                .control
                .set_instruction_result($crate::InstructionResult::NotActivated);
            return;
        }
    };
}

/// Records a `gas` cost and fails the instruction if it would exceed the available gas.
#[macro_export]
macro_rules! gas {
    ($interpreter:expr, $gas:expr) => {
        $crate::gas!($interpreter, $gas, ())
    };
    ($interpreter:expr, $gas:expr, $ret:expr) => {
        if !$interpreter.control.gas_mut().record_cost($gas) {
            $interpreter
                .control
                .set_instruction_result($crate::InstructionResult::OutOfGas);
            return $ret;
        }
    };
}

/// Same as [`gas!`], but with `gas` as an option.
#[macro_export]
macro_rules! gas_or_fail {
    ($interpreter:expr, $gas:expr) => {
        $crate::gas_or_fail!($interpreter, $gas, ())
    };
    ($interpreter:expr, $gas:expr, $ret:expr) => {
        match $gas {
            Some(gas_used) => $crate::gas!($interpreter, gas_used, $ret),
            None => {
                $interpreter
                    .control
                    .set_instruction_result($crate::InstructionResult::OutOfGas);
                return $ret;
            }
        }
    };
}

/// Resizes the interpreterreter memory if necessary. Fails the instruction if the memory or gas limit
/// is exceeded.
#[macro_export]
macro_rules! resize_memory {
    ($interpreter:expr, $offset:expr, $len:expr) => {
        $crate::resize_memory!($interpreter, $offset, $len, ())
    };
    ($interpreter:expr, $offset:expr, $len:expr, $ret:expr) => {
        let words_num = $crate::interpreter::num_words($offset.saturating_add($len));
        match $interpreter
            .control
            .gas_mut()
            .record_memory_expansion(words_num)
        {
            $crate::gas::MemoryExtensionResult::Extended => {
                $interpreter.memory.resize(words_num * 32);
            }
            $crate::gas::MemoryExtensionResult::OutOfGas => {
                $interpreter
                    .control
                    .set_instruction_result($crate::InstructionResult::MemoryOOG);
                return $ret;
            }
            $crate::gas::MemoryExtensionResult::Same => (), // no action
        };
    };
}

/// Pops n values from the stack. Fails the instruction if n values can't be popped.
#[macro_export]
macro_rules! popn {
    ([ $($x:ident),* ],$interpreterreter:expr $(,$ret:expr)? ) => {
        let Some([$( $x ),*]) = $interpreterreter.stack.popn() else {
            $interpreterreter.control.set_instruction_result($crate::InstructionResult::StackUnderflow);
            return $($ret)?;
        };
    };
}

/// Pops n values from the stack and returns the top value. Fails the instruction if n values can't be popped.
#[macro_export]
macro_rules! popn_top {
    ([ $($x:ident),* ], $top:ident, $interpreterreter:expr $(,$ret:expr)? ) => {
        let Some(([$( $x ),*], $top)) = $interpreterreter.stack.popn_top() else {
            $interpreterreter.control.set_instruction_result($crate::InstructionResult::StackUnderflow);
            return $($ret)?;
        };
    };
}

/// Pushes a `B256` value onto the stack. Fails the instruction if the stack is full.
#[macro_export]
macro_rules! push {
    ($interpreter:expr, $x:expr $(,$ret:item)?) => (
        if !($interpreter.stack.push($x)) {
            $interpreter.control.set_instruction_result($crate::InstructionResult::StackOverflow);
            return $($ret)?;
        }
    )
}

/// Converts a `U256` value to a `u64`, saturating to `MAX` if the value is too large.
#[macro_export]
macro_rules! as_u64_saturated {
    ($v:expr) => {
        match $v.as_limbs() {
            x => {
                if (x[1] == 0) & (x[2] == 0) & (x[3] == 0) {
                    x[0]
                } else {
                    u64::MAX
                }
            }
        }
    };
}

/// Converts a `U256` value to a `usize`, saturating to `MAX` if the value is too large.
#[macro_export]
macro_rules! as_usize_saturated {
    ($v:expr) => {
        usize::try_from($crate::as_u64_saturated!($v)).unwrap_or(usize::MAX)
    };
}

/// Converts a `U256` value to a `isize`, saturating to `isize::MAX` if the value is too large.
#[macro_export]
macro_rules! as_isize_saturated {
    ($v:expr) => {
        // `isize_try_from(u64::MAX)`` will fail and return isize::MAX
        // This is expected behavior as we are saturating the value.
        isize::try_from($crate::as_u64_saturated!($v)).unwrap_or(isize::MAX)
    };
}

/// Converts a `U256` value to a `usize`, failing the instruction if the value is too large.
#[macro_export]
macro_rules! as_usize_or_fail {
    ($interpreter:expr, $v:expr) => {
        $crate::as_usize_or_fail_ret!($interpreter, $v, ())
    };
    ($interpreter:expr, $v:expr, $reason:expr) => {
        $crate::as_usize_or_fail_ret!($interpreter, $v, $reason, ())
    };
}

/// Converts a `U256` value to a `usize` and returns `ret`,
/// failing the instruction if the value is too large.
#[macro_export]
macro_rules! as_usize_or_fail_ret {
    ($interpreter:expr, $v:expr, $ret:expr) => {
        $crate::as_usize_or_fail_ret!(
            $interpreter,
            $v,
            $crate::InstructionResult::InvalidOperandOOG,
            $ret
        )
    };

    ($interpreter:expr, $v:expr, $reason:expr, $ret:expr) => {
        match $v.as_limbs() {
            x => {
                if (x[0] > usize::MAX as u64) | (x[1] != 0) | (x[2] != 0) | (x[3] != 0) {
                    $interpreter.control.set_instruction_result($reason);
                    return $ret;
                }
                x[0] as usize
            }
        }
    };
}
```
```rs [revm/crates/interpreter/src/instructions/tx_info.rs]
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, RuntimeFlag, StackTr},
    Host,
};
use primitives::U256;

use crate::InstructionContext;

pub fn gasprice<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        U256::from(context.host.effective_gas_price())
    );
}

pub fn origin<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        context.host.caller().into_word().into()
    );
}

// EIP-4844: Shard Blob Transactions
pub fn blob_hash<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    check!(context.interpreter, CANCUN);
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([], index, context.interpreter);
    let i = as_usize_saturated!(index);
    *index = context.host.blob_hash(i).unwrap_or_default();
}
```
```rs [revm/crates/interpreter/src/interpreter_action.rs]
mod call_inputs;
mod call_outcome;
mod create_inputs;
mod create_outcome;
mod eof_create_inputs;

pub use call_inputs::{CallInput, CallInputs, CallScheme, CallValue};
pub use call_outcome::CallOutcome;
pub use create_inputs::CreateInputs;
pub use create_outcome::CreateOutcome;
pub use eof_create_inputs::{EOFCreateInputs, EOFCreateKind};

use crate::InterpreterResult;
use std::boxed::Box;

#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum FrameInput {
    /// `CALL`, `CALLCODE`, `DELEGATECALL`, `STATICCALL`
    /// or EOF `EXTCALL`, `EXTDELEGATECALL`, `EXTSTATICCALL` instruction called.
    Call(Box<CallInputs>),
    /// `CREATE` or `CREATE2` instruction called.
    Create(Box<CreateInputs>),
    /// EOF `CREATE` instruction called.
    EOFCreate(Box<EOFCreateInputs>),
}

impl AsMut<Self> for FrameInput {
    fn as_mut(&mut self) -> &mut Self {
        self
    }
}

#[derive(Clone, Debug, Default, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum InterpreterAction {
    /// New frame
    NewFrame(FrameInput),
    /// Interpreter finished execution.
    Return { result: InterpreterResult },
    /// No action
    #[default]
    None,
}

impl InterpreterAction {
    /// Returns `true` if action is call.
    pub fn is_call(&self) -> bool {
        matches!(self, InterpreterAction::NewFrame(FrameInput::Call(..)))
    }

    /// Returns `true` if action is create.
    pub fn is_create(&self) -> bool {
        matches!(self, InterpreterAction::NewFrame(FrameInput::Create(..)))
    }

    /// Returns `true` if action is return.
    pub fn is_return(&self) -> bool {
        matches!(self, InterpreterAction::Return { .. })
    }

    /// Returns `true` if action is none.
    pub fn is_none(&self) -> bool {
        matches!(self, InterpreterAction::None)
    }

    /// Returns `true` if action is some.
    pub fn is_some(&self) -> bool {
        !self.is_none()
    }

    /// Returns [`InterpreterResult`] if action is return.
    ///
    /// Else it returns [None].
    pub fn into_result_return(self) -> Option<InterpreterResult> {
        match self {
            InterpreterAction::Return { result } => Some(result),
            _ => None,
        }
    }
}
```
```rs [revm/crates/interpreter/src/instruction_result.rs]
use context_interface::{
    journaled_state::TransferError,
    result::{HaltReason, OutOfGasError, SuccessReason},
};
use core::fmt::Debug;

#[repr(u8)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum InstructionResult {
    // Success Codes
    #[default]
    /// Execution should continue to the next one.
    Continue = 0x00,
    /// Encountered a `STOP` opcode
    Stop,
    /// Return from the current call.
    Return,
    /// Self-destruct the current contract.
    SelfDestruct,
    /// Return a contract (used in contract creation).
    ReturnContract,

    // Revert Codes
    /// Revert the transaction.
    Revert = 0x10,
    /// Exceeded maximum call depth.
    CallTooDeep,
    /// Insufficient funds for transfer.
    OutOfFunds,
    /// Revert if `CREATE`/`CREATE2` starts with `0xEF00`.
    CreateInitCodeStartingEF00,
    /// Invalid EVM Object Format (EOF) init code.
    InvalidEOFInitCode,
    /// `ExtDelegateCall` calling a non EOF contract.
    InvalidExtDelegateCallTarget,

    // Action Codes
    /// Indicates a call or contract creation.
    CallOrCreate = 0x20,

    // Error Codes
    /// Out of gas error.
    OutOfGas = 0x50,
    /// Out of gas error encountered during memory expansion.
    MemoryOOG,
    /// The memory limit of the EVM has been exceeded.
    MemoryLimitOOG,
    /// Out of gas error encountered during the execution of a precompiled contract.
    PrecompileOOG,
    /// Out of gas error encountered while calling an invalid operand.
    InvalidOperandOOG,
    /// Out of gas error encountered while checking for reentrancy sentry.
    ReentrancySentryOOG,
    /// Unknown or invalid opcode.
    OpcodeNotFound,
    /// Invalid `CALL` with value transfer in static context.
    CallNotAllowedInsideStatic,
    /// Invalid state modification in static call.
    StateChangeDuringStaticCall,
    /// An undefined bytecode value encountered during execution.
    InvalidFEOpcode,
    /// Invalid jump destination. Dynamic jumps points to invalid not jumpdest opcode.
    InvalidJump,
    /// The feature or opcode is not activated in this version of the EVM.
    NotActivated,
    /// Attempting to pop a value from an empty stack.
    StackUnderflow,
    /// Attempting to push a value onto a full stack.
    StackOverflow,
    /// Invalid memory or storage offset.
    OutOfOffset,
    /// Address collision during contract creation.
    CreateCollision,
    /// Payment amount overflow.
    OverflowPayment,
    /// Error in precompiled contract execution.
    PrecompileError,
    /// Nonce overflow.
    NonceOverflow,
    /// Exceeded contract size limit during creation.
    CreateContractSizeLimit,
    /// Created contract starts with invalid bytes (`0xEF`).
    CreateContractStartingWithEF,
    /// Exceeded init code size limit (EIP-3860:  Limit and meter initcode).
    CreateInitCodeSizeLimit,
    /// Fatal external error. Returned by database.
    FatalExternalError,
    /// `RETURNCONTRACT` called outside init EOF code.
    ReturnContractInNotInitEOF,
    /// Legacy contract is calling opcode that is enabled only in EOF.
    EOFOpcodeDisabledInLegacy,
    /// Stack overflow in EOF subroutine function calls.
    SubRoutineStackOverflow,
    /// Aux data overflow, new aux data is larger than `u16` max size.
    EofAuxDataOverflow,
    /// Aux data is smaller than already present data size.
    EofAuxDataTooSmall,
    /// `EXT*CALL` target address needs to be padded with 0s.
    InvalidEXTCALLTarget,
}

impl From<TransferError> for InstructionResult {
    fn from(e: TransferError) -> Self {
        match e {
            TransferError::OutOfFunds => InstructionResult::OutOfFunds,
            TransferError::OverflowPayment => InstructionResult::OverflowPayment,
            TransferError::CreateCollision => InstructionResult::CreateCollision,
        }
    }
}

impl From<SuccessReason> for InstructionResult {
    fn from(value: SuccessReason) -> Self {
        match value {
            SuccessReason::Return => InstructionResult::Return,
            SuccessReason::Stop => InstructionResult::Stop,
            SuccessReason::SelfDestruct => InstructionResult::SelfDestruct,
            SuccessReason::EofReturnContract => InstructionResult::ReturnContract,
        }
    }
}

impl From<HaltReason> for InstructionResult {
    fn from(value: HaltReason) -> Self {
        match value {
            HaltReason::OutOfGas(error) => match error {
                OutOfGasError::Basic => Self::OutOfGas,
                OutOfGasError::InvalidOperand => Self::InvalidOperandOOG,
                OutOfGasError::Memory => Self::MemoryOOG,
                OutOfGasError::MemoryLimit => Self::MemoryLimitOOG,
                OutOfGasError::Precompile => Self::PrecompileOOG,
                OutOfGasError::ReentrancySentry => Self::ReentrancySentryOOG,
            },
            HaltReason::OpcodeNotFound => Self::OpcodeNotFound,
            HaltReason::InvalidFEOpcode => Self::InvalidFEOpcode,
            HaltReason::InvalidJump => Self::InvalidJump,
            HaltReason::NotActivated => Self::NotActivated,
            HaltReason::StackOverflow => Self::StackOverflow,
            HaltReason::StackUnderflow => Self::StackUnderflow,
            HaltReason::OutOfOffset => Self::OutOfOffset,
            HaltReason::CreateCollision => Self::CreateCollision,
            HaltReason::PrecompileError => Self::PrecompileError,
            HaltReason::NonceOverflow => Self::NonceOverflow,
            HaltReason::CreateContractSizeLimit => Self::CreateContractSizeLimit,
            HaltReason::CreateContractStartingWithEF => Self::CreateContractStartingWithEF,
            HaltReason::CreateInitCodeSizeLimit => Self::CreateInitCodeSizeLimit,
            HaltReason::OverflowPayment => Self::OverflowPayment,
            HaltReason::StateChangeDuringStaticCall => Self::StateChangeDuringStaticCall,
            HaltReason::CallNotAllowedInsideStatic => Self::CallNotAllowedInsideStatic,
            HaltReason::OutOfFunds => Self::OutOfFunds,
            HaltReason::CallTooDeep => Self::CallTooDeep,
            HaltReason::EofAuxDataOverflow => Self::EofAuxDataOverflow,
            HaltReason::EofAuxDataTooSmall => Self::EofAuxDataTooSmall,
            HaltReason::SubRoutineStackOverflow => Self::SubRoutineStackOverflow,
            HaltReason::InvalidEXTCALLTarget => Self::InvalidEXTCALLTarget,
        }
    }
}

#[macro_export]
macro_rules! return_ok {
    () => {
        $crate::InstructionResult::Continue
            | $crate::InstructionResult::Stop
            | $crate::InstructionResult::Return
            | $crate::InstructionResult::SelfDestruct
            | $crate::InstructionResult::ReturnContract
    };
}

#[macro_export]
macro_rules! return_revert {
    () => {
        $crate::InstructionResult::Revert
            | $crate::InstructionResult::CallTooDeep
            | $crate::InstructionResult::OutOfFunds
            | $crate::InstructionResult::InvalidEOFInitCode
            | $crate::InstructionResult::CreateInitCodeStartingEF00
            | $crate::InstructionResult::InvalidExtDelegateCallTarget
    };
}

#[macro_export]
macro_rules! return_error {
    () => {
        $crate::InstructionResult::OutOfGas
            | $crate::InstructionResult::MemoryOOG
            | $crate::InstructionResult::MemoryLimitOOG
            | $crate::InstructionResult::PrecompileOOG
            | $crate::InstructionResult::InvalidOperandOOG
            | $crate::InstructionResult::ReentrancySentryOOG
            | $crate::InstructionResult::OpcodeNotFound
            | $crate::InstructionResult::CallNotAllowedInsideStatic
            | $crate::InstructionResult::StateChangeDuringStaticCall
            | $crate::InstructionResult::InvalidFEOpcode
            | $crate::InstructionResult::InvalidJump
            | $crate::InstructionResult::NotActivated
            | $crate::InstructionResult::StackUnderflow
            | $crate::InstructionResult::StackOverflow
            | $crate::InstructionResult::OutOfOffset
            | $crate::InstructionResult::CreateCollision
            | $crate::InstructionResult::OverflowPayment
            | $crate::InstructionResult::PrecompileError
            | $crate::InstructionResult::NonceOverflow
            | $crate::InstructionResult::CreateContractSizeLimit
            | $crate::InstructionResult::CreateContractStartingWithEF
            | $crate::InstructionResult::CreateInitCodeSizeLimit
            | $crate::InstructionResult::FatalExternalError
            | $crate::InstructionResult::ReturnContractInNotInitEOF
            | $crate::InstructionResult::EOFOpcodeDisabledInLegacy
            | $crate::InstructionResult::SubRoutineStackOverflow
            | $crate::InstructionResult::EofAuxDataTooSmall
            | $crate::InstructionResult::EofAuxDataOverflow
            | $crate::InstructionResult::InvalidEXTCALLTarget
    };
}

impl InstructionResult {
    /// Returns whether the result is a success.
    #[inline]
    pub const fn is_ok(self) -> bool {
        matches!(self, crate::return_ok!())
    }

    #[inline]
    pub const fn is_ok_or_revert(self) -> bool {
        matches!(self, crate::return_ok!() | crate::return_revert!())
    }

    #[inline]
    pub const fn is_continue(self) -> bool {
        matches!(self, InstructionResult::Continue)
    }

    /// Returns whether the result is a revert.
    #[inline]
    pub const fn is_revert(self) -> bool {
        matches!(self, crate::return_revert!())
    }

    /// Returns whether the result is an error.
    #[inline]
    pub const fn is_error(self) -> bool {
        matches!(self, return_error!())
    }
}

/// Internal results that are not exposed externally
#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash)]
pub enum InternalResult {
    /// Internal instruction that signals Interpreter should continue running.
    InternalContinue,
    /// Internal instruction that signals call or create.
    InternalCallOrCreate,
    /// Internal CREATE/CREATE starts with 0xEF00
    CreateInitCodeStartingEF00,
    /// Internal to ExtDelegateCall
    InvalidExtDelegateCallTarget,
}

#[derive(Copy, Clone, Debug, PartialEq, Eq, Hash)]
pub enum SuccessOrHalt<HaltReasonTr> {
    Success(SuccessReason),
    Revert,
    Halt(HaltReasonTr),
    FatalExternalError,
    Internal(InternalResult),
}

impl<HaltReasonTr> SuccessOrHalt<HaltReasonTr> {
    /// Returns true if the transaction returned successfully without halts.
    #[inline]
    pub fn is_success(self) -> bool {
        matches!(self, SuccessOrHalt::Success(_))
    }

    /// Returns the [SuccessReason] value if this a successful result
    #[inline]
    pub fn to_success(self) -> Option<SuccessReason> {
        match self {
            SuccessOrHalt::Success(reason) => Some(reason),
            _ => None,
        }
    }

    /// Returns true if the transaction reverted.
    #[inline]
    pub fn is_revert(self) -> bool {
        matches!(self, SuccessOrHalt::Revert)
    }

    /// Returns true if the EVM has experienced an exceptional halt
    #[inline]
    pub fn is_halt(self) -> bool {
        matches!(self, SuccessOrHalt::Halt(_))
    }

    /// Returns the [HaltReason] value the EVM has experienced an exceptional halt
    #[inline]
    pub fn to_halt(self) -> Option<HaltReasonTr> {
        match self {
            SuccessOrHalt::Halt(reason) => Some(reason),
            _ => None,
        }
    }
}

impl<HALT: From<HaltReason>> From<HaltReason> for SuccessOrHalt<HALT> {
    fn from(reason: HaltReason) -> Self {
        SuccessOrHalt::Halt(reason.into())
    }
}

impl<HaltReasonTr: From<HaltReason>> From<InstructionResult> for SuccessOrHalt<HaltReasonTr> {
    fn from(result: InstructionResult) -> Self {
        match result {
            InstructionResult::Continue => Self::Internal(InternalResult::InternalContinue), // used only in interpreter loop
            InstructionResult::Stop => Self::Success(SuccessReason::Stop),
            InstructionResult::Return => Self::Success(SuccessReason::Return),
            InstructionResult::SelfDestruct => Self::Success(SuccessReason::SelfDestruct),
            InstructionResult::Revert => Self::Revert,
            InstructionResult::CreateInitCodeStartingEF00 => Self::Revert,
            InstructionResult::CallOrCreate => Self::Internal(InternalResult::InternalCallOrCreate), // used only in interpreter loop
            InstructionResult::CallTooDeep => Self::Halt(HaltReason::CallTooDeep.into()), // not gonna happen for first call
            InstructionResult::OutOfFunds => Self::Halt(HaltReason::OutOfFunds.into()), // Check for first call is done separately.
            InstructionResult::OutOfGas => {
                Self::Halt(HaltReason::OutOfGas(OutOfGasError::Basic).into())
            }
            InstructionResult::MemoryLimitOOG => {
                Self::Halt(HaltReason::OutOfGas(OutOfGasError::MemoryLimit).into())
            }
            InstructionResult::MemoryOOG => {
                Self::Halt(HaltReason::OutOfGas(OutOfGasError::Memory).into())
            }
            InstructionResult::PrecompileOOG => {
                Self::Halt(HaltReason::OutOfGas(OutOfGasError::Precompile).into())
            }
            InstructionResult::InvalidOperandOOG => {
                Self::Halt(HaltReason::OutOfGas(OutOfGasError::InvalidOperand).into())
            }
            InstructionResult::ReentrancySentryOOG => {
                Self::Halt(HaltReason::OutOfGas(OutOfGasError::ReentrancySentry).into())
            }
            InstructionResult::OpcodeNotFound | InstructionResult::ReturnContractInNotInitEOF => {
                Self::Halt(HaltReason::OpcodeNotFound.into())
            }
            InstructionResult::CallNotAllowedInsideStatic => {
                Self::Halt(HaltReason::CallNotAllowedInsideStatic.into())
            } // first call is not static call
            InstructionResult::StateChangeDuringStaticCall => {
                Self::Halt(HaltReason::StateChangeDuringStaticCall.into())
            }
            InstructionResult::InvalidFEOpcode => Self::Halt(HaltReason::InvalidFEOpcode.into()),
            InstructionResult::InvalidJump => Self::Halt(HaltReason::InvalidJump.into()),
            InstructionResult::NotActivated => Self::Halt(HaltReason::NotActivated.into()),
            InstructionResult::StackUnderflow => Self::Halt(HaltReason::StackUnderflow.into()),
            InstructionResult::StackOverflow => Self::Halt(HaltReason::StackOverflow.into()),
            InstructionResult::OutOfOffset => Self::Halt(HaltReason::OutOfOffset.into()),
            InstructionResult::CreateCollision => Self::Halt(HaltReason::CreateCollision.into()),
            InstructionResult::OverflowPayment => Self::Halt(HaltReason::OverflowPayment.into()), // Check for first call is done separately.
            InstructionResult::PrecompileError => Self::Halt(HaltReason::PrecompileError.into()),
            InstructionResult::NonceOverflow => Self::Halt(HaltReason::NonceOverflow.into()),
            InstructionResult::CreateContractSizeLimit
            | InstructionResult::CreateContractStartingWithEF => {
                Self::Halt(HaltReason::CreateContractSizeLimit.into())
            }
            InstructionResult::CreateInitCodeSizeLimit => {
                Self::Halt(HaltReason::CreateInitCodeSizeLimit.into())
            }
            // TODO : (EOF) Add proper Revert subtype.
            InstructionResult::InvalidEOFInitCode => Self::Revert,
            InstructionResult::FatalExternalError => Self::FatalExternalError,
            InstructionResult::EOFOpcodeDisabledInLegacy => {
                Self::Halt(HaltReason::OpcodeNotFound.into())
            }
            InstructionResult::SubRoutineStackOverflow => {
                Self::Halt(HaltReason::SubRoutineStackOverflow.into())
            }
            InstructionResult::ReturnContract => Self::Success(SuccessReason::EofReturnContract),
            InstructionResult::EofAuxDataOverflow => {
                Self::Halt(HaltReason::EofAuxDataOverflow.into())
            }
            InstructionResult::EofAuxDataTooSmall => {
                Self::Halt(HaltReason::EofAuxDataTooSmall.into())
            }
            InstructionResult::InvalidEXTCALLTarget => {
                Self::Halt(HaltReason::InvalidEXTCALLTarget.into())
            }
            InstructionResult::InvalidExtDelegateCallTarget => {
                Self::Internal(InternalResult::InvalidExtDelegateCallTarget)
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::InstructionResult;

    #[test]
    fn all_results_are_covered() {
        match InstructionResult::Continue {
            return_error!() => {}
            return_revert!() => {}
            return_ok!() => {}
            InstructionResult::CallOrCreate => {}
        }
    }

    #[test]
    fn test_results() {
        let ok_results = vec![
            InstructionResult::Continue,
            InstructionResult::Stop,
            InstructionResult::Return,
            InstructionResult::SelfDestruct,
        ];

        for result in ok_results {
            assert!(result.is_ok());
            assert!(!result.is_revert());
            assert!(!result.is_error());
        }

        let revert_results = vec![
            InstructionResult::Revert,
            InstructionResult::CallTooDeep,
            InstructionResult::OutOfFunds,
        ];

        for result in revert_results {
            assert!(!result.is_ok());
            assert!(result.is_revert());
            assert!(!result.is_error());
        }

        let error_results = vec![
            InstructionResult::OutOfGas,
            InstructionResult::MemoryOOG,
            InstructionResult::MemoryLimitOOG,
            InstructionResult::PrecompileOOG,
            InstructionResult::InvalidOperandOOG,
            InstructionResult::OpcodeNotFound,
            InstructionResult::CallNotAllowedInsideStatic,
            InstructionResult::StateChangeDuringStaticCall,
            InstructionResult::InvalidFEOpcode,
            InstructionResult::InvalidJump,
            InstructionResult::NotActivated,
            InstructionResult::StackUnderflow,
            InstructionResult::StackOverflow,
            InstructionResult::OutOfOffset,
            InstructionResult::CreateCollision,
            InstructionResult::OverflowPayment,
            InstructionResult::PrecompileError,
            InstructionResult::NonceOverflow,
            InstructionResult::CreateContractSizeLimit,
            InstructionResult::CreateContractStartingWithEF,
            InstructionResult::CreateInitCodeSizeLimit,
            InstructionResult::FatalExternalError,
        ];

        for result in error_results {
            assert!(!result.is_ok());
            assert!(!result.is_revert());
            assert!(result.is_error());
        }
    }
}
```
```rs [revm/crates/interpreter/src/gas/constants.rs]
pub const ZERO: u64 = 0;
pub const BASE: u64 = 2;

pub const VERYLOW: u64 = 3;
pub const DATA_LOADN_GAS: u64 = 3;

pub const CONDITION_JUMP_GAS: u64 = 4;
pub const RETF_GAS: u64 = 3;
pub const DATA_LOAD_GAS: u64 = 4;

pub const LOW: u64 = 5;
pub const MID: u64 = 8;
pub const HIGH: u64 = 10;
pub const JUMPDEST: u64 = 1;
pub const SELFDESTRUCT: i64 = 24000;
pub const CREATE: u64 = 32000;
pub const CALLVALUE: u64 = 9000;
pub const NEWACCOUNT: u64 = 25000;
pub const EXP: u64 = 10;
pub const MEMORY: u64 = 3;
pub const LOG: u64 = 375;
pub const LOGDATA: u64 = 8;
pub const LOGTOPIC: u64 = 375;
pub const KECCAK256: u64 = 30;
pub const KECCAK256WORD: u64 = 6;
pub const COPY: u64 = 3;
pub const BLOCKHASH: u64 = 20;
pub const CODEDEPOSIT: u64 = 200;

/// EIP-1884: Repricing for trie-size-dependent opcodes
pub const ISTANBUL_SLOAD_GAS: u64 = 800;
pub const SSTORE_SET: u64 = 20000;
pub const SSTORE_RESET: u64 = 5000;
pub const REFUND_SSTORE_CLEARS: i64 = 15000;

/// The standard cost of calldata token.
pub const STANDARD_TOKEN_COST: u64 = 4;
/// The cost of a non-zero byte in calldata.
pub const NON_ZERO_BYTE_DATA_COST: u64 = 68;
/// The multiplier for a non zero byte in calldata.
pub const NON_ZERO_BYTE_MULTIPLIER: u64 = NON_ZERO_BYTE_DATA_COST / STANDARD_TOKEN_COST;
/// The cost of a non-zero byte in calldata adjusted by [EIP-2028](https://eips.ethereum.org/EIPS/eip-2028).
pub const NON_ZERO_BYTE_DATA_COST_ISTANBUL: u64 = 16;
/// The multiplier for a non zero byte in calldata adjusted by [EIP-2028](https://eips.ethereum.org/EIPS/eip-2028).
pub const NON_ZERO_BYTE_MULTIPLIER_ISTANBUL: u64 =
    NON_ZERO_BYTE_DATA_COST_ISTANBUL / STANDARD_TOKEN_COST;
// The cost floor per token as defined by [EIP-2028](https://eips.ethereum.org/EIPS/eip-2028).
pub const TOTAL_COST_FLOOR_PER_TOKEN: u64 = 10;

pub const EOF_CREATE_GAS: u64 = 32000;

// Berlin eip2929 constants
pub const ACCESS_LIST_ADDRESS: u64 = 2400;
pub const ACCESS_LIST_STORAGE_KEY: u64 = 1900;
pub const COLD_SLOAD_COST: u64 = 2100;
pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
pub const WARM_STORAGE_READ_COST: u64 = 100;
pub const WARM_SSTORE_RESET: u64 = SSTORE_RESET - COLD_SLOAD_COST;

/// EIP-3860 : Limit and meter initcode
pub const INITCODE_WORD_COST: u64 = 2;

pub const CALL_STIPEND: u64 = 2300;
pub const MIN_CALLEE_GAS: u64 = CALL_STIPEND;
```
```rs [revm/crates/interpreter/src/gas/calc.rs]
use super::constants::*;
use crate::{num_words, tri, SStoreResult, SelfDestructResult, StateLoad};
use context_interface::{
    journaled_state::AccountLoad, transaction::AccessListItemTr as _, Transaction, TransactionType,
};
use primitives::{eip7702, hardfork::SpecId, U256};

/// `SSTORE` opcode refund calculation.
#[allow(clippy::collapsible_else_if)]
#[inline]
pub fn sstore_refund(spec_id: SpecId, vals: &SStoreResult) -> i64 {
    if spec_id.is_enabled_in(SpecId::ISTANBUL) {
        // EIP-3529: Reduction in refunds
        let sstore_clears_schedule = if spec_id.is_enabled_in(SpecId::LONDON) {
            (SSTORE_RESET - COLD_SLOAD_COST + ACCESS_LIST_STORAGE_KEY) as i64
        } else {
            REFUND_SSTORE_CLEARS
        };
        if vals.is_new_eq_present() {
            0
        } else {
            if vals.is_original_eq_present() && vals.is_new_zero() {
                sstore_clears_schedule
            } else {
                let mut refund = 0;

                if !vals.is_original_zero() {
                    if vals.is_present_zero() {
                        refund -= sstore_clears_schedule;
                    } else if vals.is_new_zero() {
                        refund += sstore_clears_schedule;
                    }
                }

                if vals.is_original_eq_new() {
                    let (gas_sstore_reset, gas_sload) = if spec_id.is_enabled_in(SpecId::BERLIN) {
                        (SSTORE_RESET - COLD_SLOAD_COST, WARM_STORAGE_READ_COST)
                    } else {
                        (SSTORE_RESET, sload_cost(spec_id, false))
                    };
                    if vals.is_original_zero() {
                        refund += (SSTORE_SET - gas_sload) as i64;
                    } else {
                        refund += (gas_sstore_reset - gas_sload) as i64;
                    }
                }

                refund
            }
        }
    } else {
        if !vals.is_present_zero() && vals.is_new_zero() {
            REFUND_SSTORE_CLEARS
        } else {
            0
        }
    }
}

/// `CREATE2` opcode cost calculation.
#[inline]
pub const fn create2_cost(len: usize) -> Option<u64> {
    CREATE.checked_add(tri!(cost_per_word(len, KECCAK256WORD)))
}

#[inline]
const fn log2floor(value: U256) -> u64 {
    let mut l: u64 = 256;
    let mut i = 3;
    loop {
        if value.as_limbs()[i] == 0u64 {
            l -= 64;
        } else {
            l -= value.as_limbs()[i].leading_zeros() as u64;
            if l == 0 {
                return l;
            } else {
                return l - 1;
            }
        }
        if i == 0 {
            break;
        }
        i -= 1;
    }
    l
}

/// `EXP` opcode cost calculation.
#[inline]
pub fn exp_cost(spec_id: SpecId, power: U256) -> Option<u64> {
    if power.is_zero() {
        Some(EXP)
    } else {
        // EIP-160: EXP cost increase
        let gas_byte = U256::from(if spec_id.is_enabled_in(SpecId::SPURIOUS_DRAGON) {
            50
        } else {
            10
        });
        let gas = U256::from(EXP)
            .checked_add(gas_byte.checked_mul(U256::from(log2floor(power) / 8 + 1))?)?;

        u64::try_from(gas).ok()
    }
}

/// `*COPY` opcodes cost calculation.
#[inline]
pub const fn copy_cost_verylow(len: usize) -> Option<u64> {
    copy_cost(VERYLOW, len)
}

/// `EXTCODECOPY` opcode cost calculation.
#[inline]
pub const fn extcodecopy_cost(spec_id: SpecId, len: usize, is_cold: bool) -> Option<u64> {
    let base_gas = if spec_id.is_enabled_in(SpecId::BERLIN) {
        warm_cold_cost(is_cold)
    } else if spec_id.is_enabled_in(SpecId::TANGERINE) {
        700
    } else {
        20
    };
    copy_cost(base_gas, len)
}

#[inline]
pub const fn copy_cost(base_cost: u64, len: usize) -> Option<u64> {
    base_cost.checked_add(tri!(cost_per_word(len, COPY)))
}

/// `LOG` opcode cost calculation.
#[inline]
pub const fn log_cost(n: u8, len: u64) -> Option<u64> {
    tri!(LOG.checked_add(tri!(LOGDATA.checked_mul(len)))).checked_add(LOGTOPIC * n as u64)
}

/// `KECCAK256` opcode cost calculation.
#[inline]
pub const fn keccak256_cost(len: usize) -> Option<u64> {
    KECCAK256.checked_add(tri!(cost_per_word(len, KECCAK256WORD)))
}

/// Calculate the cost of buffer per word.
#[inline]
pub const fn cost_per_word(len: usize, multiple: u64) -> Option<u64> {
    multiple.checked_mul(num_words(len) as u64)
}

/// EIP-3860: Limit and meter initcode
///
/// Apply extra gas cost of 2 for every 32-byte chunk of initcode.
///
/// This cannot overflow as the initcode length is assumed to be checked.
#[inline]
pub const fn initcode_cost(len: usize) -> u64 {
    let Some(cost) = cost_per_word(len, INITCODE_WORD_COST) else {
        panic!("initcode cost overflow")
    };
    cost
}

/// `SLOAD` opcode cost calculation.
#[inline]
pub const fn sload_cost(spec_id: SpecId, is_cold: bool) -> u64 {
    if spec_id.is_enabled_in(SpecId::BERLIN) {
        if is_cold {
            COLD_SLOAD_COST
        } else {
            WARM_STORAGE_READ_COST
        }
    } else if spec_id.is_enabled_in(SpecId::ISTANBUL) {
        // EIP-1884: Repricing for trie-size-dependent opcodes
        ISTANBUL_SLOAD_GAS
    } else if spec_id.is_enabled_in(SpecId::TANGERINE) {
        // EIP-150: Gas cost changes for IO-heavy operations
        200
    } else {
        50
    }
}

/// `SSTORE` opcode cost calculation.
#[inline]
pub fn sstore_cost(spec_id: SpecId, vals: &SStoreResult, is_cold: bool) -> u64 {
    if spec_id.is_enabled_in(SpecId::BERLIN) {
        // Berlin specification logic
        let mut gas_cost = istanbul_sstore_cost::<WARM_STORAGE_READ_COST, WARM_SSTORE_RESET>(vals);

        if is_cold {
            gas_cost += COLD_SLOAD_COST;
        }
        gas_cost
    } else if spec_id.is_enabled_in(SpecId::ISTANBUL) {
        // Istanbul logic
        istanbul_sstore_cost::<ISTANBUL_SLOAD_GAS, SSTORE_RESET>(vals)
    } else {
        // Frontier logic
        frontier_sstore_cost(vals)
    }
}

/// EIP-2200: Structured Definitions for Net Gas Metering
#[inline]
fn istanbul_sstore_cost<const SLOAD_GAS: u64, const SSTORE_RESET_GAS: u64>(
    vals: &SStoreResult,
) -> u64 {
    if vals.is_new_eq_present() {
        SLOAD_GAS
    } else if vals.is_original_eq_present() && vals.is_original_zero() {
        SSTORE_SET
    } else if vals.is_original_eq_present() {
        SSTORE_RESET_GAS
    } else {
        SLOAD_GAS
    }
}

/// Frontier sstore cost just had two cases set and reset values.
#[inline]
fn frontier_sstore_cost(vals: &SStoreResult) -> u64 {
    if vals.is_present_zero() && !vals.is_new_zero() {
        SSTORE_SET
    } else {
        SSTORE_RESET
    }
}

/// `SELFDESTRUCT` opcode cost calculation.
#[inline]
pub const fn selfdestruct_cost(spec_id: SpecId, res: StateLoad<SelfDestructResult>) -> u64 {
    // EIP-161: State trie clearing (invariant-preserving alternative)
    let should_charge_topup = if spec_id.is_enabled_in(SpecId::SPURIOUS_DRAGON) {
        res.data.had_value && !res.data.target_exists
    } else {
        !res.data.target_exists
    };

    // EIP-150: Gas cost changes for IO-heavy operations
    let selfdestruct_gas_topup = if spec_id.is_enabled_in(SpecId::TANGERINE) && should_charge_topup
    {
        25000
    } else {
        0
    };

    // EIP-150: Gas cost changes for IO-heavy operations
    let selfdestruct_gas = if spec_id.is_enabled_in(SpecId::TANGERINE) {
        5000
    } else {
        0
    };

    let mut gas = selfdestruct_gas + selfdestruct_gas_topup;
    if spec_id.is_enabled_in(SpecId::BERLIN) && res.is_cold {
        gas += COLD_ACCOUNT_ACCESS_COST
    }
    gas
}

/// Calculate call gas cost for the call instruction.
///
/// There is three types of gas.
/// * Account access gas. after berlin it can be cold or warm.
/// * Transfer value gas. If value is transferred and balance of target account is updated.
/// * If account is not existing and needs to be created. After Spurious dragon
///   this is only accounted if value is transferred.
///
/// account_load.is_empty will be accounted only if hardfork is SPURIOUS_DRAGON and
/// there is transfer value.
///
/// This means that [`bytecode::opcode::EXTSTATICCALL`],
/// [`bytecode::opcode::EXTDELEGATECALL`] that dont transfer value will not be
/// effected by this field.
///
/// [`bytecode::opcode::CALL`], [`bytecode::opcode::EXTCALL`] use this field.
///
/// While [`bytecode::opcode::STATICCALL`], [`bytecode::opcode::DELEGATECALL`],
/// [`bytecode::opcode::CALLCODE`] need to have this field hardcoded to false
/// as they were present before SPURIOUS_DRAGON hardfork.
#[inline]
pub const fn call_cost(
    spec_id: SpecId,
    transfers_value: bool,
    account_load: StateLoad<AccountLoad>,
) -> u64 {
    let is_empty = account_load.data.is_empty;
    // Account access.
    let mut gas = if spec_id.is_enabled_in(SpecId::BERLIN) {
        warm_cold_cost_with_delegation(account_load)
    } else if spec_id.is_enabled_in(SpecId::TANGERINE) {
        // EIP-150: Gas cost changes for IO-heavy operations
        700
    } else {
        40
    };

    // Transfer value cost
    if transfers_value {
        gas += CALLVALUE;
    }

    // New account cost
    if is_empty {
        // EIP-161: State trie clearing (invariant-preserving alternative)
        if spec_id.is_enabled_in(SpecId::SPURIOUS_DRAGON) {
            // Account only if there is value transferred.
            if transfers_value {
                gas += NEWACCOUNT;
            }
        } else {
            gas += NEWACCOUNT;
        }
    }

    gas
}

/// Berlin warm and cold storage access cost for account access.
#[inline]
pub const fn warm_cold_cost(is_cold: bool) -> u64 {
    if is_cold {
        COLD_ACCOUNT_ACCESS_COST
    } else {
        WARM_STORAGE_READ_COST
    }
}

/// Berlin warm and cold storage access cost for account access.
///
/// If delegation is Some, add additional cost for delegation account load.
#[inline]
pub const fn warm_cold_cost_with_delegation(load: StateLoad<AccountLoad>) -> u64 {
    let mut gas = warm_cold_cost(load.is_cold);
    if let Some(is_cold) = load.data.is_delegate_account_cold {
        gas += warm_cold_cost(is_cold);
    }
    gas
}

/// Memory expansion cost calculation for a given number of words.
#[inline]
pub const fn memory_gas(num_words: usize) -> u64 {
    let num_words = num_words as u64;
    MEMORY
        .saturating_mul(num_words)
        .saturating_add(num_words.saturating_mul(num_words) / 512)
}

/// Init and floor gas from transaction
#[derive(Clone, Copy, Debug, Default)]
pub struct InitialAndFloorGas {
    /// Initial gas for transaction.
    pub initial_gas: u64,
    /// If transaction is a Call and Prague is enabled
    /// floor_gas is at least amount of gas that is going to be spent.
    pub floor_gas: u64,
}

impl InitialAndFloorGas {
    /// Create a new InitialAndFloorGas instance.
    #[inline]
    pub const fn new(initial_gas: u64, floor_gas: u64) -> Self {
        Self {
            initial_gas,
            floor_gas,
        }
    }
}

/// Initial gas that is deducted for transaction to be included.
/// Initial gas contains initial stipend gas, gas for access list and input data.
///
/// # Returns
///
/// - Intrinsic gas
/// - Number of tokens in calldata
pub fn calculate_initial_tx_gas(
    spec_id: SpecId,
    input: &[u8],
    is_create: bool,
    access_list_accounts: u64,
    access_list_storages: u64,
    authorization_list_num: u64,
) -> InitialAndFloorGas {
    let mut gas = InitialAndFloorGas::default();

    // Initdate stipend
    let tokens_in_calldata = get_tokens_in_calldata(input, spec_id.is_enabled_in(SpecId::ISTANBUL));

    // TODO(EOF) Tx type is removed
    // initcode stipend
    // for initcode in initcodes {
    //     tokens_in_calldata += get_tokens_in_calldata(initcode.as_ref(), true);
    // }

    gas.initial_gas += tokens_in_calldata * STANDARD_TOKEN_COST;

    // Get number of access list account and storages.
    gas.initial_gas += access_list_accounts * ACCESS_LIST_ADDRESS;
    gas.initial_gas += access_list_storages * ACCESS_LIST_STORAGE_KEY;

    // Base stipend
    gas.initial_gas += if is_create {
        if spec_id.is_enabled_in(SpecId::HOMESTEAD) {
            // EIP-2: Homestead Hard-fork Changes
            53000
        } else {
            21000
        }
    } else {
        21000
    };

    // EIP-3860: Limit and meter initcode
    // Init code stipend for bytecode analysis
    if spec_id.is_enabled_in(SpecId::SHANGHAI) && is_create {
        gas.initial_gas += initcode_cost(input.len())
    }

    // EIP-7702
    if spec_id.is_enabled_in(SpecId::PRAGUE) {
        gas.initial_gas += authorization_list_num * eip7702::PER_EMPTY_ACCOUNT_COST;

        // Calculate gas floor for EIP-7623
        gas.floor_gas = calc_tx_floor_cost(tokens_in_calldata);
    }

    gas
}

/// Initial gas that is deducted for transaction to be included.
/// Initial gas contains initial stipend gas, gas for access list and input data.
///
/// # Returns
///
/// - Intrinsic gas
/// - Number of tokens in calldata
pub fn calculate_initial_tx_gas_for_tx(tx: impl Transaction, spec: SpecId) -> InitialAndFloorGas {
    let mut accounts = 0;
    let mut storages = 0;
    // legacy is only tx type that does not have access list.
    if tx.tx_type() != TransactionType::Legacy {
        (accounts, storages) = tx
            .access_list()
            .map(|al| {
                al.fold((0, 0), |(mut num_accounts, mut num_storage_slots), item| {
                    num_accounts += 1;
                    num_storage_slots += item.storage_slots().count();

                    (num_accounts, num_storage_slots)
                })
            })
            .unwrap_or_default();
    }

    // Access initcodes only if tx is Eip7873.
    // TODO(EOF) Tx type is removed
    // let initcodes = if tx.tx_type() == TransactionType::Eip7873 {
    //     tx.initcodes()
    // } else {
    //     &[]
    // };

    calculate_initial_tx_gas(
        spec,
        tx.input(),
        tx.kind().is_create(),
        accounts as u64,
        storages as u64,
        tx.authorization_list_len() as u64,
        //initcodes,
    )
}

/// Retrieve the total number of tokens in calldata.
#[inline]
pub fn get_tokens_in_calldata(input: &[u8], is_istanbul: bool) -> u64 {
    let zero_data_len = input.iter().filter(|v| **v == 0).count() as u64;
    let non_zero_data_len = input.len() as u64 - zero_data_len;
    let non_zero_data_multiplier = if is_istanbul {
        // EIP-2028: Transaction data gas cost reduction
        NON_ZERO_BYTE_MULTIPLIER_ISTANBUL
    } else {
        NON_ZERO_BYTE_MULTIPLIER
    };
    zero_data_len + non_zero_data_len * non_zero_data_multiplier
}

/// Calculate the transaction cost floor as specified in EIP-7623.
#[inline]
pub fn calc_tx_floor_cost(tokens_in_calldata: u64) -> u64 {
    tokens_in_calldata * TOTAL_COST_FLOOR_PER_TOKEN + 21_000
}
```
```rs [revm/crates/interpreter/src/instructions.rs]
//! EVM opcode implementations.

#[macro_use]
pub mod macros;
pub mod arithmetic;
pub mod bitwise;
pub mod block_info;
pub mod contract;
pub mod control;
pub mod data;
pub mod host;
pub mod i256;
pub mod memory;
pub mod stack;
pub mod system;
pub mod tx_info;
pub mod utility;

use crate::{interpreter_types::InterpreterTypes, Host, InstructionContext};

/// EVM opcode function signature.
pub type Instruction<W, H> = fn(InstructionContext<'_, H, W>);

/// Instruction table is list of instruction function pointers mapped to 256 EVM opcodes.
pub type InstructionTable<W, H> = [Instruction<W, H>; 256];

/// Returns the instruction table for the given spec.
pub const fn instruction_table<WIRE: InterpreterTypes, H: Host + ?Sized>(
) -> [Instruction<WIRE, H>; 256] {
    use bytecode::opcode::*;
    let mut table = [control::unknown as Instruction<WIRE, H>; 256];

    table[STOP as usize] = control::stop;
    table[ADD as usize] = arithmetic::add;
    table[MUL as usize] = arithmetic::mul;
    table[SUB as usize] = arithmetic::sub;
    table[DIV as usize] = arithmetic::div;
    table[SDIV as usize] = arithmetic::sdiv;
    table[MOD as usize] = arithmetic::rem;
    table[SMOD as usize] = arithmetic::smod;
    table[ADDMOD as usize] = arithmetic::addmod;
    table[MULMOD as usize] = arithmetic::mulmod;
    table[EXP as usize] = arithmetic::exp;
    table[SIGNEXTEND as usize] = arithmetic::signextend;

    table[LT as usize] = bitwise::lt;
    table[GT as usize] = bitwise::gt;
    table[SLT as usize] = bitwise::slt;
    table[SGT as usize] = bitwise::sgt;
    table[EQ as usize] = bitwise::eq;
    table[ISZERO as usize] = bitwise::iszero;
    table[AND as usize] = bitwise::bitand;
    table[OR as usize] = bitwise::bitor;
    table[XOR as usize] = bitwise::bitxor;
    table[NOT as usize] = bitwise::not;
    table[BYTE as usize] = bitwise::byte;
    table[SHL as usize] = bitwise::shl;
    table[SHR as usize] = bitwise::shr;
    table[SAR as usize] = bitwise::sar;

    table[KECCAK256 as usize] = system::keccak256;

    table[ADDRESS as usize] = system::address;
    table[BALANCE as usize] = host::balance;
    table[ORIGIN as usize] = tx_info::origin;
    table[CALLER as usize] = system::caller;
    table[CALLVALUE as usize] = system::callvalue;
    table[CALLDATALOAD as usize] = system::calldataload;
    table[CALLDATASIZE as usize] = system::calldatasize;
    table[CALLDATACOPY as usize] = system::calldatacopy;
    table[CODESIZE as usize] = system::codesize;
    table[CODECOPY as usize] = system::codecopy;

    table[GASPRICE as usize] = tx_info::gasprice;
    table[EXTCODESIZE as usize] = host::extcodesize;
    table[EXTCODECOPY as usize] = host::extcodecopy;
    table[RETURNDATASIZE as usize] = system::returndatasize;
    table[RETURNDATACOPY as usize] = system::returndatacopy;
    table[EXTCODEHASH as usize] = host::extcodehash;
    table[BLOCKHASH as usize] = host::blockhash;
    table[COINBASE as usize] = block_info::coinbase;
    table[TIMESTAMP as usize] = block_info::timestamp;
    table[NUMBER as usize] = block_info::block_number;
    table[DIFFICULTY as usize] = block_info::difficulty;
    table[GASLIMIT as usize] = block_info::gaslimit;
    table[CHAINID as usize] = block_info::chainid;
    table[SELFBALANCE as usize] = host::selfbalance;
    table[BASEFEE as usize] = block_info::basefee;
    table[BLOBHASH as usize] = tx_info::blob_hash;
    table[BLOBBASEFEE as usize] = block_info::blob_basefee;

    table[POP as usize] = stack::pop;
    table[MLOAD as usize] = memory::mload;
    table[MSTORE as usize] = memory::mstore;
    table[MSTORE8 as usize] = memory::mstore8;
    table[SLOAD as usize] = host::sload;
    table[SSTORE as usize] = host::sstore;
    table[JUMP as usize] = control::jump;
    table[JUMPI as usize] = control::jumpi;
    table[PC as usize] = control::pc;
    table[MSIZE as usize] = memory::msize;
    table[GAS as usize] = system::gas;
    table[JUMPDEST as usize] = control::jumpdest_or_nop;
    table[TLOAD as usize] = host::tload;
    table[TSTORE as usize] = host::tstore;
    table[MCOPY as usize] = memory::mcopy;

    table[PUSH0 as usize] = stack::push0;
    table[PUSH1 as usize] = stack::push::<1, _, _>;
    table[PUSH2 as usize] = stack::push::<2, _, _>;
    table[PUSH3 as usize] = stack::push::<3, _, _>;
    table[PUSH4 as usize] = stack::push::<4, _, _>;
    table[PUSH5 as usize] = stack::push::<5, _, _>;
    table[PUSH6 as usize] = stack::push::<6, _, _>;
    table[PUSH7 as usize] = stack::push::<7, _, _>;
    table[PUSH8 as usize] = stack::push::<8, _, _>;
    table[PUSH9 as usize] = stack::push::<9, _, _>;
    table[PUSH10 as usize] = stack::push::<10, _, _>;
    table[PUSH11 as usize] = stack::push::<11, _, _>;
    table[PUSH12 as usize] = stack::push::<12, _, _>;
    table[PUSH13 as usize] = stack::push::<13, _, _>;
    table[PUSH14 as usize] = stack::push::<14, _, _>;
    table[PUSH15 as usize] = stack::push::<15, _, _>;
    table[PUSH16 as usize] = stack::push::<16, _, _>;
    table[PUSH17 as usize] = stack::push::<17, _, _>;
    table[PUSH18 as usize] = stack::push::<18, _, _>;
    table[PUSH19 as usize] = stack::push::<19, _, _>;
    table[PUSH20 as usize] = stack::push::<20, _, _>;
    table[PUSH21 as usize] = stack::push::<21, _, _>;
    table[PUSH22 as usize] = stack::push::<22, _, _>;
    table[PUSH23 as usize] = stack::push::<23, _, _>;
    table[PUSH24 as usize] = stack::push::<24, _, _>;
    table[PUSH25 as usize] = stack::push::<25, _, _>;
    table[PUSH26 as usize] = stack::push::<26, _, _>;
    table[PUSH27 as usize] = stack::push::<27, _, _>;
    table[PUSH28 as usize] = stack::push::<28, _, _>;
    table[PUSH29 as usize] = stack::push::<29, _, _>;
    table[PUSH30 as usize] = stack::push::<30, _, _>;
    table[PUSH31 as usize] = stack::push::<31, _, _>;
    table[PUSH32 as usize] = stack::push::<32, _, _>;

    table[DUP1 as usize] = stack::dup::<1, _, _>;
    table[DUP2 as usize] = stack::dup::<2, _, _>;
    table[DUP3 as usize] = stack::dup::<3, _, _>;
    table[DUP4 as usize] = stack::dup::<4, _, _>;
    table[DUP5 as usize] = stack::dup::<5, _, _>;
    table[DUP6 as usize] = stack::dup::<6, _, _>;
    table[DUP7 as usize] = stack::dup::<7, _, _>;
    table[DUP8 as usize] = stack::dup::<8, _, _>;
    table[DUP9 as usize] = stack::dup::<9, _, _>;
    table[DUP10 as usize] = stack::dup::<10, _, _>;
    table[DUP11 as usize] = stack::dup::<11, _, _>;
    table[DUP12 as usize] = stack::dup::<12, _, _>;
    table[DUP13 as usize] = stack::dup::<13, _, _>;
    table[DUP14 as usize] = stack::dup::<14, _, _>;
    table[DUP15 as usize] = stack::dup::<15, _, _>;
    table[DUP16 as usize] = stack::dup::<16, _, _>;

    table[SWAP1 as usize] = stack::swap::<1, _, _>;
    table[SWAP2 as usize] = stack::swap::<2, _, _>;
    table[SWAP3 as usize] = stack::swap::<3, _, _>;
    table[SWAP4 as usize] = stack::swap::<4, _, _>;
    table[SWAP5 as usize] = stack::swap::<5, _, _>;
    table[SWAP6 as usize] = stack::swap::<6, _, _>;
    table[SWAP7 as usize] = stack::swap::<7, _, _>;
    table[SWAP8 as usize] = stack::swap::<8, _, _>;
    table[SWAP9 as usize] = stack::swap::<9, _, _>;
    table[SWAP10 as usize] = stack::swap::<10, _, _>;
    table[SWAP11 as usize] = stack::swap::<11, _, _>;
    table[SWAP12 as usize] = stack::swap::<12, _, _>;
    table[SWAP13 as usize] = stack::swap::<13, _, _>;
    table[SWAP14 as usize] = stack::swap::<14, _, _>;
    table[SWAP15 as usize] = stack::swap::<15, _, _>;
    table[SWAP16 as usize] = stack::swap::<16, _, _>;

    table[LOG0 as usize] = host::log::<0, _>;
    table[LOG1 as usize] = host::log::<1, _>;
    table[LOG2 as usize] = host::log::<2, _>;
    table[LOG3 as usize] = host::log::<3, _>;
    table[LOG4 as usize] = host::log::<4, _>;

    table[DATALOAD as usize] = data::data_load;
    table[DATALOADN as usize] = data::data_loadn;
    table[DATASIZE as usize] = data::data_size;
    table[DATACOPY as usize] = data::data_copy;

    table[RJUMP as usize] = control::rjump;
    table[RJUMPI as usize] = control::rjumpi;
    table[RJUMPV as usize] = control::rjumpv;
    table[CALLF as usize] = control::callf;
    table[RETF as usize] = control::retf;
    table[JUMPF as usize] = control::jumpf;
    table[DUPN as usize] = stack::dupn;
    table[SWAPN as usize] = stack::swapn;
    table[EXCHANGE as usize] = stack::exchange;

    table[EOFCREATE as usize] = contract::eofcreate;
    table[TXCREATE as usize] = contract::txcreate;
    table[RETURNCONTRACT as usize] = contract::return_contract;

    table[CREATE as usize] = contract::create::<_, false, _>;
    table[CALL as usize] = contract::call;
    table[CALLCODE as usize] = contract::call_code;
    table[RETURN as usize] = control::ret;
    table[DELEGATECALL as usize] = contract::delegate_call;
    table[CREATE2 as usize] = contract::create::<_, true, _>;

    table[RETURNDATALOAD as usize] = system::returndataload;
    table[EXTCALL as usize] = contract::extcall;
    table[EXTDELEGATECALL as usize] = contract::extdelegatecall;
    table[STATICCALL as usize] = contract::static_call;
    table[EXTSTATICCALL as usize] = contract::extstaticcall;
    table[REVERT as usize] = control::revert;
    table[INVALID as usize] = control::invalid;
    table[SELFDESTRUCT as usize] = host::selfdestruct;
    table
}

#[cfg(test)]
mod tests {
    use super::instruction_table;
    use crate::{host::DummyHost, interpreter::EthInterpreter};
    use bytecode::opcode::*;

    #[test]
    fn all_instructions_and_opcodes_used() {
        // known unknown instruction we compare it with other instructions from table.
        let unknown_instruction = 0x0C_usize;
        let instr_table = instruction_table::<EthInterpreter, DummyHost>();

        let unknown_istr = instr_table[unknown_instruction];
        for (i, instr) in instr_table.iter().enumerate() {
            let is_opcode_unknown = OpCode::new(i as u8).is_none();
            //
            let is_instr_unknown = std::ptr::fn_addr_eq(*instr, unknown_istr);
            assert_eq!(
                is_instr_unknown, is_opcode_unknown,
                "Opcode 0x{:X?} is not handled",
                i
            );
        }
    }
}
```
```rs [revm/crates/interpreter/src/host.rs]
use context_interface::{
    context::{ContextTr, SStoreResult, SelfDestructResult, StateLoad},
    journaled_state::AccountLoad,
    Block, Cfg, Database, JournalTr, LocalContextTr, Transaction, TransactionType,
};
use primitives::{Address, Bytes, Log, StorageKey, StorageValue, B256, U256};

use crate::instructions::utility::IntoU256;

/// Host trait with all methods that are needed by the Interpreter.
///
/// This trait is implemented for all types that have `ContextTr` trait.
///
/// There are few groups of functions which are Block, Transaction, Config, Database and Journal functions.
pub trait Host {
    /* Block */

    /// Block basefee, calls ContextTr::block().basefee()
    fn basefee(&self) -> U256;
    /// Block blob gasprice, calls `ContextTr::block().blob_gasprice()`
    fn blob_gasprice(&self) -> U256;
    /// Block gas limit, calls ContextTr::block().gas_limit()
    fn gas_limit(&self) -> U256;
    /// Block difficulty, calls ContextTr::block().difficulty()
    fn difficulty(&self) -> U256;
    /// Block prevrandao, calls ContextTr::block().prevrandao()
    fn prevrandao(&self) -> Option<U256>;
    /// Block number, calls ContextTr::block().number()
    fn block_number(&self) -> U256;
    /// Block timestamp, calls ContextTr::block().timestamp()
    fn timestamp(&self) -> U256;
    /// Block beneficiary, calls ContextTr::block().beneficiary()
    fn beneficiary(&self) -> Address;
    /// Chain id, calls ContextTr::cfg().chain_id()
    fn chain_id(&self) -> U256;

    /* Transaction */

    /// Transaction effective gas price, calls `ContextTr::tx().effective_gas_price(basefee as u128)`
    fn effective_gas_price(&self) -> U256;
    /// Transaction caller, calls `ContextTr::tx().caller()`
    fn caller(&self) -> Address;
    /// Transaction blob hash, calls `ContextTr::tx().blob_hash(number)`
    fn blob_hash(&self, number: usize) -> Option<U256>;
    /// Initcodes mapped to the hash.
    fn initcode_by_hash(&mut self, hash: B256) -> Option<Bytes>;

    /* Config */

    /// Max initcode size, calls `ContextTr::cfg().max_code_size().saturating_mul(2)`
    fn max_initcode_size(&self) -> usize;

    /* Database */

    /// Block hash, calls `ContextTr::journal().db().block_hash(number)`
    fn block_hash(&mut self, number: u64) -> Option<B256>;

    /* Journal */

    /// Selfdestruct account, calls `ContextTr::journal().selfdestruct(address, target)`
    fn selfdestruct(
        &mut self,
        address: Address,
        target: Address,
    ) -> Option<StateLoad<SelfDestructResult>>;

    /// Log, calls `ContextTr::journal().log(log)`
    fn log(&mut self, log: Log);
    /// Sstore, calls `ContextTr::journal().sstore(address, key, value)`
    fn sstore(
        &mut self,
        address: Address,
        key: StorageKey,
        value: StorageValue,
    ) -> Option<StateLoad<SStoreResult>>;

    /// Sload, calls `ContextTr::journal().sload(address, key)`
    fn sload(&mut self, address: Address, key: StorageKey) -> Option<StateLoad<StorageValue>>;
    /// Tstore, calls `ContextTr::journal().tstore(address, key, value)`
    fn tstore(&mut self, address: Address, key: StorageKey, value: StorageValue);
    /// Tload, calls `ContextTr::journal().tload(address, key)`
    fn tload(&mut self, address: Address, key: StorageKey) -> StorageValue;
    /// Balance, calls `ContextTr::journal().load_account(address)`
    fn balance(&mut self, address: Address) -> Option<StateLoad<U256>>;
    /// Load account delegated, calls `ContextTr::journal().load_account_delegated(address)`
    fn load_account_delegated(&mut self, address: Address) -> Option<StateLoad<AccountLoad>>;
    /// Load account code, calls `ContextTr::journal().load_account_code(address)`
    fn load_account_code(&mut self, address: Address) -> Option<StateLoad<Bytes>>;
    /// Load account code hash, calls `ContextTr::journal().code_hash(address)`
    fn load_account_code_hash(&mut self, address: Address) -> Option<StateLoad<B256>>;
}

impl<CTX: ContextTr> Host for CTX {
    /* Block */

    fn basefee(&self) -> U256 {
        U256::from(self.block().basefee())
    }

    fn blob_gasprice(&self) -> U256 {
        U256::from(self.block().blob_gasprice().unwrap_or(0))
    }

    fn gas_limit(&self) -> U256 {
        U256::from(self.block().gas_limit())
    }

    fn difficulty(&self) -> U256 {
        self.block().difficulty()
    }

    fn prevrandao(&self) -> Option<U256> {
        self.block().prevrandao().map(|r| r.into_u256())
    }

    fn block_number(&self) -> U256 {
        self.block().number()
    }

    fn timestamp(&self) -> U256 {
        U256::from(self.block().timestamp())
    }

    fn beneficiary(&self) -> Address {
        self.block().beneficiary()
    }

    fn chain_id(&self) -> U256 {
        U256::from(self.cfg().chain_id())
    }

    /* Transaction */

    fn effective_gas_price(&self) -> U256 {
        let basefee = self.block().basefee();
        U256::from(self.tx().effective_gas_price(basefee as u128))
    }

    fn caller(&self) -> Address {
        self.tx().caller()
    }

    fn blob_hash(&self, number: usize) -> Option<U256> {
        let tx = &self.tx();
        if tx.tx_type() != TransactionType::Eip4844 {
            return None;
        }
        tx.blob_versioned_hashes()
            .get(number)
            .map(|t| U256::from_be_bytes(t.0))
    }

    fn initcode_by_hash(&mut self, hash: B256) -> Option<Bytes> {
        self.local().get_validated_initcode(hash)
    }

    /* Config */

    fn max_initcode_size(&self) -> usize {
        self.cfg().max_code_size().saturating_mul(2)
    }

    /* Database */

    fn block_hash(&mut self, requested_number: u64) -> Option<B256> {
        self.journal()
            .db()
            .block_hash(requested_number)
            .map_err(|e| {
                *self.error() = Err(e.into());
            })
            .ok()
    }

    /* Journal */

    fn load_account_delegated(&mut self, address: Address) -> Option<StateLoad<AccountLoad>> {
        self.journal()
            .load_account_delegated(address)
            .map_err(|e| {
                *self.error() = Err(e.into());
            })
            .ok()
    }

    /// Gets balance of `address` and if the account is cold.
    fn balance(&mut self, address: Address) -> Option<StateLoad<U256>> {
        self.journal()
            .load_account(address)
            .map(|acc| acc.map(|a| a.info.balance))
            .map_err(|e| {
                *self.error() = Err(e.into());
            })
            .ok()
    }

    /// Gets code of `address` and if the account is cold.
    fn load_account_code(&mut self, address: Address) -> Option<StateLoad<Bytes>> {
        self.journal()
            .code(address)
            .map_err(|e| {
                *self.error() = Err(e.into());
            })
            .ok()
    }

    /// Gets code hash of `address` and if the account is cold.
    fn load_account_code_hash(&mut self, address: Address) -> Option<StateLoad<B256>> {
        self.journal()
            .code_hash(address)
            .map_err(|e| {
                *self.error() = Err(e.into());
            })
            .ok()
    }

    /// Gets storage value of `address` at `index` and if the account is cold.
    fn sload(&mut self, address: Address, index: StorageKey) -> Option<StateLoad<StorageValue>> {
        self.journal()
            .sload(address, index)
            .map_err(|e| {
                *self.error() = Err(e.into());
            })
            .ok()
    }

    /// Sets storage value of account address at index.
    ///
    /// Returns [`StateLoad`] with [`SStoreResult`] that contains original/new/old storage value.
    fn sstore(
        &mut self,
        address: Address,
        index: StorageKey,
        value: StorageValue,
    ) -> Option<StateLoad<SStoreResult>> {
        self.journal()
            .sstore(address, index, value)
            .map_err(|e| {
                *self.error() = Err(e.into());
            })
            .ok()
    }

    /// Gets the transient storage value of `address` at `index`.
    fn tload(&mut self, address: Address, index: StorageKey) -> StorageValue {
        self.journal().tload(address, index)
    }

    /// Sets the transient storage value of `address` at `index`.
    fn tstore(&mut self, address: Address, index: StorageKey, value: StorageValue) {
        self.journal().tstore(address, index, value)
    }

    /// Emits a log owned by `address` with given `LogData`.
    fn log(&mut self, log: Log) {
        self.journal().log(log);
    }

    /// Marks `address` to be deleted, with funds transferred to `target`.
    fn selfdestruct(
        &mut self,
        address: Address,
        target: Address,
    ) -> Option<StateLoad<SelfDestructResult>> {
        self.journal()
            .selfdestruct(address, target)
            .map_err(|e| {
                *self.error() = Err(e.into());
            })
            .ok()
    }
}

/// Dummy host that implements [`Host`] trait and  returns all default values.
pub struct DummyHost;

impl Host for DummyHost {
    fn basefee(&self) -> U256 {
        U256::ZERO
    }

    fn blob_gasprice(&self) -> U256 {
        U256::ZERO
    }

    fn gas_limit(&self) -> U256 {
        U256::ZERO
    }

    fn difficulty(&self) -> U256 {
        U256::ZERO
    }

    fn prevrandao(&self) -> Option<U256> {
        None
    }

    fn block_number(&self) -> U256 {
        U256::ZERO
    }

    fn timestamp(&self) -> U256 {
        U256::ZERO
    }

    fn beneficiary(&self) -> Address {
        Address::ZERO
    }

    fn chain_id(&self) -> U256 {
        U256::ZERO
    }

    fn effective_gas_price(&self) -> U256 {
        U256::ZERO
    }

    fn caller(&self) -> Address {
        Address::ZERO
    }

    fn initcode_by_hash(&mut self, _hash: B256) -> Option<Bytes> {
        None
    }

    fn blob_hash(&self, _number: usize) -> Option<U256> {
        None
    }

    fn max_initcode_size(&self) -> usize {
        0
    }

    fn block_hash(&mut self, _number: u64) -> Option<B256> {
        None
    }

    fn selfdestruct(
        &mut self,
        _address: Address,
        _target: Address,
    ) -> Option<StateLoad<SelfDestructResult>> {
        None
    }

    fn log(&mut self, _log: Log) {}

    fn sstore(
        &mut self,
        _address: Address,
        _key: StorageKey,
        _value: StorageValue,
    ) -> Option<StateLoad<SStoreResult>> {
        None
    }

    fn sload(&mut self, _address: Address, _key: StorageKey) -> Option<StateLoad<StorageValue>> {
        None
    }

    fn tstore(&mut self, _address: Address, _key: StorageKey, _value: StorageValue) {}

    fn tload(&mut self, _address: Address, _key: StorageKey) -> StorageValue {
        StorageValue::ZERO
    }

    fn balance(&mut self, _address: Address) -> Option<StateLoad<U256>> {
        None
    }

    fn load_account_delegated(&mut self, _address: Address) -> Option<StateLoad<AccountLoad>> {
        None
    }

    fn load_account_code(&mut self, _address: Address) -> Option<StateLoad<Bytes>> {
        None
    }

    fn load_account_code_hash(&mut self, _address: Address) -> Option<StateLoad<B256>> {
        None
    }
}
```
```rs [revm/crates/interpreter/src/instruction_context.rs]
use crate::{interpreter_types::Jumps, Interpreter, InterpreterTypes};

use super::Instruction;

pub struct InstructionContext<'a, H: ?Sized, ITy: InterpreterTypes> {
    pub host: &'a mut H,
    pub interpreter: &'a mut Interpreter<ITy>,
}

impl<H: ?Sized, ITy: InterpreterTypes> InstructionContext<'_, H, ITy> {
    /// Executes the instruction at the current instruction pointer.
    ///
    /// Internally it will increment instruction pointer by one.
    #[inline]
    pub(crate) fn step(self, instruction_table: &[Instruction<ITy, H>; 256]) {
        // Get current opcode.
        let opcode = self.interpreter.bytecode.opcode();

        // SAFETY: In analysis we are doing padding of bytecode so that we are sure that last
        // byte instruction is STOP so we are safe to just increment program_counter bcs on last instruction
        // it will do noop and just stop execution of this contract
        self.interpreter.bytecode.relative_jump(1);

        // Execute instruction.
        instruction_table[opcode as usize](self)
    }
}
```
```rs [revm/crates/interpreter/src/gas.rs]
//! EVM gas calculation utilities.

mod calc;
mod constants;

pub use calc::*;
pub use constants::*;

/// Represents the state of gas during execution.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Gas {
    /// The initial gas limit. This is constant throughout execution.
    limit: u64,
    /// The remaining gas.
    remaining: u64,
    /// Refunded gas. This is used only at the end of execution.
    refunded: i64,
    /// Memoisation of values for memory expansion cost.
    memory: MemoryGas,
}

impl Gas {
    /// Creates a new `Gas` struct with the given gas limit.
    #[inline]
    pub const fn new(limit: u64) -> Self {
        Self {
            limit,
            remaining: limit,
            refunded: 0,
            memory: MemoryGas::new(),
        }
    }

    /// Creates a new `Gas` struct with the given gas limit, but without any gas remaining.
    #[inline]
    pub const fn new_spent(limit: u64) -> Self {
        Self {
            limit,
            remaining: 0,
            refunded: 0,
            memory: MemoryGas::new(),
        }
    }

    /// Returns the gas limit.
    #[inline]
    pub const fn limit(&self) -> u64 {
        self.limit
    }

    /// Returns the memory gas.
    #[inline]
    pub fn memory(&self) -> &MemoryGas {
        &self.memory
    }

    /// Returns the memory gas.
    #[inline]
    pub fn memory_mut(&mut self) -> &mut MemoryGas {
        &mut self.memory
    }

    /// Returns the total amount of gas that was refunded.
    #[inline]
    pub const fn refunded(&self) -> i64 {
        self.refunded
    }

    /// Returns the total amount of gas spent.
    #[inline]
    pub const fn spent(&self) -> u64 {
        self.limit - self.remaining
    }

    /// Returns the total amount of gas spent, minus the refunded gas.
    #[inline]
    pub const fn spent_sub_refunded(&self) -> u64 {
        self.spent().saturating_sub(self.refunded as u64)
    }

    /// Returns the amount of gas remaining.
    #[inline]
    pub const fn remaining(&self) -> u64 {
        self.remaining
    }

    /// Return remaining gas after subtracting 63/64 parts.
    pub const fn remaining_63_of_64_parts(&self) -> u64 {
        self.remaining - self.remaining / 64
    }

    /// Erases a gas cost from the totals.
    #[inline]
    pub fn erase_cost(&mut self, returned: u64) {
        self.remaining += returned;
    }

    /// Spends all remaining gas.
    #[inline]
    pub fn spend_all(&mut self) {
        self.remaining = 0;
    }

    /// Records a refund value.
    ///
    /// `refund` can be negative but `self.refunded` should always be positive
    /// at the end of transact.
    #[inline]
    pub fn record_refund(&mut self, refund: i64) {
        self.refunded += refund;
    }

    /// Set a refund value for final refund.
    ///
    /// Max refund value is limited to Nth part (depending of fork) of gas spend.
    ///
    /// Related to EIP-3529: Reduction in refunds
    #[inline]
    pub fn set_final_refund(&mut self, is_london: bool) {
        let max_refund_quotient = if is_london { 5 } else { 2 };
        self.refunded = (self.refunded() as u64).min(self.spent() / max_refund_quotient) as i64;
    }

    /// Set a refund value. This overrides the current refund value.
    #[inline]
    pub fn set_refund(&mut self, refund: i64) {
        self.refunded = refund;
    }

    /// Set a spent value. This overrides the current spent value.
    #[inline]
    pub fn set_spent(&mut self, spent: u64) {
        self.remaining = self.limit.saturating_sub(spent);
    }

    /// Records an explicit cost.
    ///
    /// Returns `false` if the gas limit is exceeded.
    #[inline]
    #[must_use = "prefer using `gas!` instead to return an out-of-gas error on failure"]
    pub fn record_cost(&mut self, cost: u64) -> bool {
        if let Some(new_remaining) = self.remaining.checked_sub(cost) {
            self.remaining = new_remaining;
            return true;
        }
        false
    }

    /// Record memory expansion
    #[inline]
    #[must_use = "internally uses record_cost that flags out of gas error"]
    pub fn record_memory_expansion(&mut self, new_len: usize) -> MemoryExtensionResult {
        let Some(additional_cost) = self.memory.record_new_len(new_len) else {
            return MemoryExtensionResult::Same;
        };

        if !self.record_cost(additional_cost) {
            return MemoryExtensionResult::OutOfGas;
        }

        MemoryExtensionResult::Extended
    }
}

pub enum MemoryExtensionResult {
    /// Memory was extended.
    Extended,
    /// Memory size stayed the same.
    Same,
    /// Not enough gas to extend memory.
    OutOfGas,
}

/// Utility struct that speeds up calculation of memory expansion
/// It contains the current memory length and its memory expansion cost.
///
/// It allows us to split gas accounting from memory structure.
#[derive(Clone, Copy, Default, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct MemoryGas {
    /// Current memory length
    pub words_num: usize,
    /// Current memory expansion cost
    pub expansion_cost: u64,
}

impl MemoryGas {
    pub const fn new() -> Self {
        Self {
            words_num: 0,
            expansion_cost: 0,
        }
    }

    #[inline]
    pub fn record_new_len(&mut self, new_num: usize) -> Option<u64> {
        if new_num <= self.words_num {
            return None;
        }
        self.words_num = new_num;
        let mut cost = crate::gas::calc::memory_gas(new_num);
        core::mem::swap(&mut self.expansion_cost, &mut cost);
        // Safe to subtract because we know that new_len > length
        // Notice the swap above.
        Some(self.expansion_cost - cost)
    }
}
```
```rs [revm/crates/interpreter/src/interpreter_action/create_outcome.rs]
use crate::{Gas, InstructionResult, InterpreterResult};
use primitives::{Address, Bytes};

/// Represents the outcome of a create operation in an interpreter.
///
/// This struct holds the result of the operation along with an optional address.
///
/// It provides methods to determine the next action based on the result of the operation.
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CreateOutcome {
    /// The result of the interpreter operation
    pub result: InterpreterResult,
    /// An optional address associated with the create operation
    pub address: Option<Address>,
}

impl CreateOutcome {
    /// Constructs a new [`CreateOutcome`].
    ///
    /// # Arguments
    ///
    /// * `result` - An [`InterpreterResult`] representing the result of the interpreter operation.
    /// * `address` - An optional [`Address`] associated with the create operation.
    ///
    /// # Returns
    ///
    /// A new [`CreateOutcome`] instance.
    pub fn new(result: InterpreterResult, address: Option<Address>) -> Self {
        Self { result, address }
    }

    /// Retrieves a reference to the [`InstructionResult`] from the [`InterpreterResult`].
    ///
    /// This method provides access to the [`InstructionResult`] which represents the
    /// outcome of the instruction execution.
    ///
    /// It encapsulates the result information such as whether the instruction was
    /// executed successfully, resulted in a revert, or encountered a fatal error.
    ///
    /// # Returns
    ///
    /// A reference to the [`InstructionResult`].
    pub fn instruction_result(&self) -> &InstructionResult {
        &self.result.result
    }

    /// Retrieves a reference to the output bytes from the [`InterpreterResult`].
    ///
    /// This method returns the output of the interpreted operation.
    ///
    /// The output is typically used when the operation successfully completes and
    /// returns data.
    ///
    /// # Returns
    ///
    /// A reference to the output [`Bytes`].
    pub fn output(&self) -> &Bytes {
        &self.result.output
    }

    /// Retrieves a reference to the [`Gas`] details from the [`InterpreterResult`].
    ///
    /// This method provides access to the gas details of the operation, which includes
    /// information about gas used, remaining, and refunded.
    ///
    /// It is essential for understanding the gas consumption of the operation.
    ///
    /// # Returns
    ///
    /// A reference to the [`Gas`] details.
    pub fn gas(&self) -> &Gas {
        &self.result.gas
    }
}
```
```rs [revm/crates/interpreter/src/interpreter_action/create_inputs.rs]
use context_interface::CreateScheme;
use primitives::{Address, Bytes, U256};

/// Inputs for a create call
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CreateInputs {
    /// Caller address of the EVM
    pub caller: Address,
    /// The create scheme
    pub scheme: CreateScheme,
    /// The value to transfer
    pub value: U256,
    /// The init code of the contract
    pub init_code: Bytes,
    /// The gas limit of the call
    pub gas_limit: u64,
}

impl CreateInputs {
    /// Returns the address that this create call will create.
    pub fn created_address(&self, nonce: u64) -> Address {
        match self.scheme {
            CreateScheme::Create => self.caller.create(nonce),
            CreateScheme::Create2 { salt } => self
                .caller
                .create2_from_code(salt.to_be_bytes(), &self.init_code),
            CreateScheme::Custom { address } => address,
        }
    }
}
```
```rs [revm/crates/interpreter/src/interpreter_action/eof_create_inputs.rs]
use std::sync::Arc;

use bytecode::Eof;
use primitives::{Address, Bytes, U256};

use super::CallInput;

/// EOF create can be called from two places:
/// * EOFCREATE opcode
/// * Creation transaction.
///
/// Creation transaction uses initdata and packs EOF and initdata inside it,
/// and this eof bytecode needs to be validated.
///
/// Opcode creation uses already validated EOF bytecode, and input from Interpreter memory.
///
/// Address is already known and is passed as an argument.
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum EOFCreateKind {
    Tx {
        initdata: Bytes,
    },
    Opcode {
        initcode: Arc<Eof>,
        input: CallInput,
        created_address: Address,
    },
}

impl EOFCreateKind {
    /// Returns created address
    pub fn created_address(&self) -> Option<&Address> {
        match self {
            EOFCreateKind::Opcode {
                created_address, ..
            } => Some(created_address),
            EOFCreateKind::Tx { .. } => None,
        }
    }
}

impl Default for EOFCreateKind {
    fn default() -> Self {
        EOFCreateKind::Opcode {
            initcode: Arc::new(Eof::default()),
            input: CallInput::Bytes(Bytes::default()),
            created_address: Address::default(),
        }
    }
}

/// Inputs for EOF Create call
#[derive(Debug, Default, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct EOFCreateInputs {
    /// Caller of EOF Create
    pub caller: Address,
    /// Values of ether transferred
    pub value: U256,
    /// Gas limit for the create call
    pub gas_limit: u64,
    /// EOF Create kind
    pub kind: EOFCreateKind,
}

impl EOFCreateInputs {
    /// Creates new EOF Create input from transaction that has concatenated eof init code and calldata.
    ///
    /// Legacy transaction still have optional nonce so we need to obtain it.
    pub fn new(caller: Address, value: U256, gas_limit: u64, kind: EOFCreateKind) -> Self {
        //let (eof_init_code, input) = Eof::decode_dangling(tx.data.clone())?;
        EOFCreateInputs {
            caller,
            value,
            gas_limit,
            kind,
        }
    }

    /// Returns a new instance of EOFCreateInput.
    pub fn new_opcode(
        caller: Address,
        created_address: Address,
        value: U256,
        eof_init_code: Eof,
        gas_limit: u64,
        input: CallInput,
    ) -> EOFCreateInputs {
        EOFCreateInputs::new(
            caller,
            value,
            gas_limit,
            EOFCreateKind::Opcode {
                initcode: Arc::new(eof_init_code),
                input,
                created_address,
            },
        )
    }
}
```
```rs [revm/crates/interpreter/src/interpreter_action/call_inputs.rs]
use context_interface::{ContextTr, LocalContextTr};
use core::ops::Range;
use primitives::{Address, Bytes, U256};
/// Input enum for a call.
///
/// As CallInput uses shared memory buffer it can get overridden if not used directly when call happens.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum CallInput {
    /// The Range points to the SharedMemory buffer. Buffer can be found in [`context_interface::LocalContextTr::shared_memory_buffer_slice`] function.
    /// And can be accessed with `evm.ctx().local().shared_memory_buffer()`
    ///
    /// # Warning
    ///
    /// Use it with caution, CallInput shared buffer can be overridden if context from child call is returned so
    /// recommendation is to fetch buffer at first Inspector call and clone it from [`context_interface::LocalContextTr::shared_memory_buffer_slice`] function.
    SharedBuffer(Range<usize>),
    /// Bytes of the call data.
    Bytes(Bytes),
}

impl CallInput {
    /// Returns the length of the call input.
    pub fn len(&self) -> usize {
        match self {
            Self::Bytes(bytes) => bytes.len(),
            Self::SharedBuffer(range) => range.len(),
        }
    }

    /// Returns `true` if the call input is empty.
    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }

    /// Returns the bytes of the call input.
    ///
    /// SharedMemory buffer can be shrunked or overwritten if the child call returns the
    /// shared memory context to its parent, the range in `CallInput::SharedBuffer` can show unexpected data.
    ///
    /// # Allocation
    ///
    /// If this `CallInput` is a `SharedBuffer`, the slice will be copied
    /// into a fresh `Bytes` buffer, which can pose a performance penalty.
    pub fn bytes<CTX>(&self, ctx: &mut CTX) -> Bytes
    where
        CTX: ContextTr,
    {
        match self {
            CallInput::Bytes(bytes) => bytes.clone(),
            CallInput::SharedBuffer(range) => ctx
                .local()
                .shared_memory_buffer_slice(range.clone())
                .map(|b| Bytes::from(b.to_vec()))
                .unwrap_or_default(),
        }
    }
}

impl Default for CallInput {
    /// Returns a default `CallInput` with an empty `Bytes`.
    #[inline]
    fn default() -> Self {
        CallInput::Bytes(Bytes::default())
    }
}

/// Inputs for a call.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CallInputs {
    /// The call data of the call.
    pub input: CallInput,
    /// The return memory offset where the output of the call is written.
    ///
    /// In EOF, this range is invalid as EOF calls do not write output to memory.
    pub return_memory_offset: Range<usize>,
    /// The gas limit of the call.
    pub gas_limit: u64,
    /// The account address of bytecode that is going to be executed.
    ///
    /// Previously `context.code_address`.
    pub bytecode_address: Address,
    /// Target address, this account storage is going to be modified.
    ///
    /// Previously `context.address`.
    pub target_address: Address,
    /// This caller is invoking the call.
    ///
    /// Previously `context.caller`.
    pub caller: Address,
    /// Call value.
    ///
    /// **Note**: This value may not necessarily be transferred from caller to callee, see [`CallValue`].
    ///
    /// Previously `transfer.value` or `context.apparent_value`.
    pub value: CallValue,
    /// The call scheme.
    ///
    /// Previously `context.scheme`.
    pub scheme: CallScheme,
    /// Whether the call is a static call, or is initiated inside a static call.
    pub is_static: bool,
    /// Whether the call is initiated from EOF bytecode.
    pub is_eof: bool,
}

impl CallInputs {
    /// Returns `true` if the call will transfer a non-zero value.
    #[inline]
    pub fn transfers_value(&self) -> bool {
        self.value.transfer().is_some_and(|x| x > U256::ZERO)
    }

    /// Returns the transfer value.
    ///
    /// This is the value that is transferred from caller to callee, see [`CallValue`].
    #[inline]
    pub const fn transfer_value(&self) -> Option<U256> {
        self.value.transfer()
    }

    /// Returns the **apparent** call value.
    ///
    /// This value is not actually transferred, see [`CallValue`].
    #[inline]
    pub const fn apparent_value(&self) -> Option<U256> {
        self.value.apparent()
    }

    /// Returns the address of the transfer source account.
    ///
    /// This is only meaningful if `transfers_value` is `true`.
    #[inline]
    pub const fn transfer_from(&self) -> Address {
        self.caller
    }

    /// Returns the address of the transfer target account.
    ///
    /// This is only meaningful if `transfers_value` is `true`.
    #[inline]
    pub const fn transfer_to(&self) -> Address {
        self.target_address
    }

    /// Returns the call value, regardless of the transfer value type.
    ///
    /// **Note**: This value may not necessarily be transferred from caller to callee, see [`CallValue`].
    #[inline]
    pub const fn call_value(&self) -> U256 {
        self.value.get()
    }
}

/// Call scheme.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum CallScheme {
    /// `CALL`.
    Call,
    /// `CALLCODE`
    CallCode,
    /// `DELEGATECALL`
    DelegateCall,
    /// `STATICCALL`
    StaticCall,
    /// `EXTCALL`
    ExtCall,
    /// `EXTSTATICCALL`
    ExtStaticCall,
    /// `EXTDELEGATECALL`
    ExtDelegateCall,
}

impl CallScheme {
    /// Returns true if it is EOF EXT*CALL.
    pub fn is_ext(&self) -> bool {
        matches!(
            self,
            Self::ExtCall | Self::ExtStaticCall | Self::ExtDelegateCall
        )
    }

    /// Returns true if it is ExtDelegateCall.
    pub fn is_ext_delegate_call(&self) -> bool {
        matches!(self, Self::ExtDelegateCall)
    }
}

/// Call value.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum CallValue {
    /// Concrete value, transferred from caller to callee at the end of the transaction.
    Transfer(U256),
    /// Apparent value, that is **not** actually transferred.
    ///
    /// Set when in a `DELEGATECALL` call type, and used by the `CALLVALUE` opcode.
    Apparent(U256),
}

impl Default for CallValue {
    #[inline]
    fn default() -> Self {
        CallValue::Transfer(U256::ZERO)
    }
}

impl CallValue {
    /// Returns the call value, regardless of the type.
    #[inline]
    pub const fn get(&self) -> U256 {
        match *self {
            Self::Transfer(value) | Self::Apparent(value) => value,
        }
    }

    /// Returns the transferred value, if any.
    #[inline]
    pub const fn transfer(&self) -> Option<U256> {
        match *self {
            Self::Transfer(transfer) => Some(transfer),
            Self::Apparent(_) => None,
        }
    }

    /// Returns whether the call value will be transferred.
    #[inline]
    pub const fn is_transfer(&self) -> bool {
        matches!(self, Self::Transfer(_))
    }

    /// Returns the apparent value, if any.
    #[inline]
    pub const fn apparent(&self) -> Option<U256> {
        match *self {
            Self::Transfer(_) => None,
            Self::Apparent(apparent) => Some(apparent),
        }
    }

    /// Returns whether the call value is apparent, and not actually transferred.
    #[inline]
    pub const fn is_apparent(&self) -> bool {
        matches!(self, Self::Apparent(_))
    }
}
```
```rs [revm/crates/interpreter/src/interpreter_action/call_outcome.rs]
use crate::{Gas, InstructionResult, InterpreterResult};
use core::ops::Range;
use primitives::Bytes;

/// Represents the outcome of a call operation in a virtual machine.
///
/// This struct encapsulates the result of executing an instruction by an interpreter, including
/// the result itself, gas usage information, and the memory offset where output data is stored.
///
/// # Fields
///
/// * `result` - The result of the interpreter's execution, including output data and gas usage.
/// * `memory_offset` - The range in memory where the output data is located.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CallOutcome {
    pub result: InterpreterResult,
    pub memory_offset: Range<usize>,
}

impl CallOutcome {
    /// Constructs a new [`CallOutcome`].
    ///
    /// Creates an instance of [`CallOutcome`] with the given interpreter result and memory offset.
    ///
    /// # Arguments
    ///
    /// * `result` - The result of the interpreter's execution.
    /// * `memory_offset` - The range in memory indicating where the output data is stored.
    pub fn new(result: InterpreterResult, memory_offset: Range<usize>) -> Self {
        Self {
            result,
            memory_offset,
        }
    }

    /// Returns a reference to the instruction result.
    ///
    /// Provides access to the result of the executed instruction.
    ///
    /// # Returns
    ///
    /// A reference to the [`InstructionResult`].
    pub fn instruction_result(&self) -> &InstructionResult {
        &self.result.result
    }

    /// Returns the gas usage information.
    ///
    /// Provides access to the gas usage details of the executed instruction.
    ///
    /// # Returns
    ///
    /// An instance of [`Gas`] representing the gas usage.
    pub fn gas(&self) -> Gas {
        self.result.gas
    }

    /// Returns a reference to the output data.
    ///
    /// Provides access to the output data generated by the executed instruction.
    ///
    /// # Returns
    ///
    /// A reference to the output data as [`Bytes`].
    pub fn output(&self) -> &Bytes {
        &self.result.output
    }

    /// Returns the start position of the memory offset.
    ///
    /// Provides the starting index of the memory range where the output data is stored.
    ///
    /// # Returns
    ///
    /// The starting index of the memory offset as [`usize`].
    pub fn memory_start(&self) -> usize {
        self.memory_offset.start
    }

    /// Returns the length of the memory range.
    ///
    /// Provides the length of the memory range where the output data is stored.
    ///
    /// # Returns
    ///
    /// The length of the memory range as [`usize`].
    pub fn memory_length(&self) -> usize {
        self.memory_offset.len()
    }
}
```
```rs [revm/crates/interpreter/src/lib.rs]
//! # revm-interpreter
//!
//! Interpreter is part of the project that executes EVM instructions.
#![cfg_attr(not(test), warn(unused_crate_dependencies))]
#![cfg_attr(not(feature = "std"), no_std)]

#[cfg(not(feature = "std"))]
extern crate alloc as std;

#[macro_use]
mod macros;

pub mod gas;
pub mod host;
pub mod instruction_context;
mod instruction_result;
pub mod instructions;
pub mod interpreter;
pub mod interpreter_action;
pub mod interpreter_types;

// Reexport primary types.
pub use context_interface::{
    context::{SStoreResult, SelfDestructResult, StateLoad},
    CreateScheme,
};
pub use gas::{Gas, InitialAndFloorGas};
pub use host::Host;
pub use instruction_context::InstructionContext;
pub use instruction_result::*;
pub use instructions::{instruction_table, Instruction, InstructionTable};
pub use interpreter::{
    num_words, InputsImpl, Interpreter, InterpreterResult, SharedMemory, Stack, STACK_LIMIT,
};
pub use interpreter_action::{
    CallInput, CallInputs, CallOutcome, CallScheme, CallValue, CreateInputs, CreateOutcome,
    EOFCreateInputs, EOFCreateKind, FrameInput, InterpreterAction,
};
pub use interpreter_types::InterpreterTypes;
pub use primitives::{constants::MAX_INITCODE_SIZE, eip170::MAX_CODE_SIZE};
```
```rs [revm/crates/interpreter/src/macros.rs]
#[macro_export]
macro_rules! debug_unreachable {
    ($($t:tt)*) => {
        if cfg!(debug_assertions) {
            unreachable!($($t)*);
        } else {
            unsafe { core::hint::unreachable_unchecked() };
        }
    };
}

#[macro_export]
macro_rules! assume {
    ($e:expr $(,)?) => {
        if !$e {
            debug_unreachable!(stringify!($e));
        }
    };

    ($e:expr, $($t:tt)+) => {
        if !$e {
            debug_unreachable!($($t)+);
        }
    };
}
```
```rs [revm/crates/interpreter/src/interpreter_types.rs]
use crate::{CallInput, Gas, InstructionResult, InterpreterAction};
use bytecode::eof::CodeInfo;
use core::cell::Ref;
use core::ops::{Deref, Range};
use primitives::{hardfork::SpecId, Address, Bytes, B256, U256};

/// Helper function to read immediates data from the bytecode
pub trait Immediates {
    #[inline]
    fn read_i16(&self) -> i16 {
        self.read_u16() as i16
    }
    fn read_u16(&self) -> u16;

    #[inline]
    fn read_i8(&self) -> i8 {
        self.read_u8() as i8
    }
    fn read_u8(&self) -> u8;

    #[inline]
    fn read_offset_i16(&self, offset: isize) -> i16 {
        self.read_offset_u16(offset) as i16
    }
    fn read_offset_u16(&self, offset: isize) -> u16;

    fn read_slice(&self, len: usize) -> &[u8];
}

/// Trait for fetching inputs of the call.
pub trait InputsTr {
    /// Returns target address of the call.
    fn target_address(&self) -> Address;
    /// Returns bytecode address of the call. For DELEGATECALL this address will be different from target address.
    /// And if initcode is called this address will be [`None`].
    fn bytecode_address(&self) -> Option<&Address>;
    /// Returns caller address of the call.
    fn caller_address(&self) -> Address;
    /// Returns input of the call.
    fn input(&self) -> &CallInput;
    /// Returns call value of the call.
    fn call_value(&self) -> U256;
}

/// Trait needed for legacy bytecode.
///
/// Used in [`bytecode::opcode::CODECOPY`] and [`bytecode::opcode::CODESIZE`] opcodes.
pub trait LegacyBytecode {
    /// Returns current bytecode original length. Used in [`bytecode::opcode::CODESIZE`] opcode.
    fn bytecode_len(&self) -> usize;
    /// Returns current bytecode original slice. Used in [`bytecode::opcode::CODECOPY`] opcode.
    fn bytecode_slice(&self) -> &[u8];
}

/// Trait for Interpreter to be able to jump
pub trait Jumps {
    /// Relative jumps does not require checking for overflow.
    fn relative_jump(&mut self, offset: isize);
    /// Absolute jumps require checking for overflow and if target is a jump destination
    /// from jump table.
    fn absolute_jump(&mut self, offset: usize);
    /// Check legacy jump destination from jump table.
    fn is_valid_legacy_jump(&mut self, offset: usize) -> bool;
    /// Returns current program counter.
    fn pc(&self) -> usize;
    /// Returns instruction opcode.
    fn opcode(&self) -> u8;
}

/// Trait for Interpreter memory operations.
pub trait MemoryTr {
    /// Sets memory data at given offset from data with a given data_offset and len.
    ///
    /// # Panics
    ///
    /// Panics if range is out of scope of allocated memory.
    fn set_data(&mut self, memory_offset: usize, data_offset: usize, len: usize, data: &[u8]);

    /// Inner clone part of memory from global context to local context.
    /// This is used to clone calldata to memory.
    ///
    /// # Panics
    ///
    /// Panics if range is out of scope of allocated memory.
    fn set_data_from_global(
        &mut self,
        memory_offset: usize,
        data_offset: usize,
        len: usize,
        data_range: Range<usize>,
    );

    /// Memory slice with global range. This range
    ///
    /// # Panics
    ///
    /// Panics if range is out of scope of allocated memory.
    fn global_slice(&self, range: Range<usize>) -> Ref<'_, [u8]>;

    /// Offset of local context of memory.
    fn local_memory_offset(&self) -> usize;

    /// Sets memory data at given offset.
    ///
    /// # Panics
    ///
    /// Panics if range is out of scope of allocated memory.
    fn set(&mut self, memory_offset: usize, data: &[u8]);

    /// Returns memory size.
    fn size(&self) -> usize;

    /// Copies memory data from source to destination.
    ///
    /// # Panics
    /// Panics if range is out of scope of allocated memory.
    fn copy(&mut self, destination: usize, source: usize, len: usize);

    /// Memory slice with range
    ///
    /// # Panics
    ///
    /// Panics if range is out of scope of allocated memory.
    fn slice(&self, range: Range<usize>) -> Ref<'_, [u8]>;

    /// Memory slice len
    ///
    /// Uses [`slice`][MemoryTr::slice] internally.
    fn slice_len(&self, offset: usize, len: usize) -> impl Deref<Target = [u8]> + '_ {
        self.slice(offset..offset + len)
    }

    /// Resizes memory to new size
    ///
    /// # Note
    ///
    /// It checks memory limits.
    fn resize(&mut self, new_size: usize) -> bool;
}

/// Returns EOF containers. Used by [`bytecode::opcode::RETURNCONTRACT`] and [`bytecode::opcode::EOFCREATE`] opcodes.
pub trait EofContainer {
    /// Returns EOF container at given index.
    fn eof_container(&self, index: usize) -> Option<&Bytes>;
}

/// Handles EOF introduced sub routine calls.
pub trait SubRoutineStack {
    /// Returns sub routine stack length.
    fn len(&self) -> usize;

    /// Returns `true` if sub routine stack is empty.
    fn is_empty(&self) -> bool {
        self.len() == 0
    }

    /// Returns current sub routine index.
    fn routine_idx(&self) -> usize;

    /// Sets new code section without touching subroutine stack.
    ///
    /// This is used for [`bytecode::opcode::JUMPF`] opcode. Where
    /// tail call is performed.
    fn set_routine_idx(&mut self, idx: usize);

    /// Pushes a new frame to the stack and new code index.
    fn push(&mut self, old_program_counter: usize, new_idx: usize) -> bool;

    /// Pops previous subroutine, sets previous code index and returns program counter.
    fn pop(&mut self) -> Option<usize>;
}

/// Functions needed for Interpreter Stack operations.
pub trait StackTr {
    /// Returns stack length.
    fn len(&self) -> usize;

    /// Returns `true` if stack is empty.
    fn is_empty(&self) -> bool {
        self.len() == 0
    }

    /// Pushes values to the stack.
    ///
    /// Returns `true` if push was successful, `false` if stack overflow.
    ///
    /// # Note
    /// Error is internally set in interpreter.
    #[must_use]
    fn push(&mut self, value: U256) -> bool;

    /// Pushes B256 value to the stack.
    ///
    /// Internally converts B256 to U256 and then calls [`StackTr::push`].
    #[must_use]
    fn push_b256(&mut self, value: B256) -> bool {
        self.push(value.into())
    }

    /// Pops value from the stack.
    #[must_use]
    fn popn<const N: usize>(&mut self) -> Option<[U256; N]>;

    /// Pop N values from the stack and return top value.
    #[must_use]
    fn popn_top<const POPN: usize>(&mut self) -> Option<([U256; POPN], &mut U256)>;

    /// Returns top value from the stack.
    #[must_use]
    fn top(&mut self) -> Option<&mut U256> {
        self.popn_top::<0>().map(|(_, top)| top)
    }

    /// Pops one value from the stack.
    #[must_use]
    fn pop(&mut self) -> Option<U256> {
        self.popn::<1>().map(|[value]| value)
    }

    /// Pops address from the stack.
    ///
    /// Internally call [`StackTr::pop`] and converts [`U256`] into [`Address`].
    #[must_use]
    fn pop_address(&mut self) -> Option<Address> {
        self.pop().map(|value| Address::from(value.to_be_bytes()))
    }

    /// Exchanges two values on the stack.
    ///
    /// Indexes are based from the top of the stack.
    ///
    /// Returns `true` if swap was successful, `false` if stack underflow.
    #[must_use]
    fn exchange(&mut self, n: usize, m: usize) -> bool;

    /// Duplicates the `N`th value from the top of the stack.
    ///
    /// Index is based from the top of the stack.
    ///
    /// Returns `true` if duplicate was successful, `false` if stack underflow.
    #[must_use]
    fn dup(&mut self, n: usize) -> bool;
}

/// EOF data fetching.
pub trait EofData {
    /// Returns EOF data.
    fn data(&self) -> &[u8];
    /// Returns EOF data slice.
    fn data_slice(&self, offset: usize, len: usize) -> &[u8];
    /// Returns EOF data size.
    fn data_size(&self) -> usize;
}

/// EOF code info.
pub trait EofCodeInfo {
    /// Returns code information containing stack information.
    fn code_info(&self, idx: usize) -> Option<&CodeInfo>;

    /// Returns program counter at the start of code section.
    fn code_section_pc(&self, idx: usize) -> Option<usize>;
}

/// Returns return data.
pub trait ReturnData {
    /// Returns return data.
    fn buffer(&self) -> &Bytes;

    /// Sets return buffer.
    fn set_buffer(&mut self, bytes: Bytes);

    /// Clears return buffer.
    fn clear(&mut self) {
        self.set_buffer(Bytes::new());
    }
}

pub trait LoopControl {
    fn set_instruction_result(&mut self, result: InstructionResult);
    fn set_next_action(&mut self, action: InterpreterAction, result: InstructionResult);
    fn gas(&self) -> &Gas;
    fn gas_mut(&mut self) -> &mut Gas;
    fn instruction_result(&self) -> InstructionResult;
    fn take_next_action(&mut self) -> InterpreterAction;
}

pub trait RuntimeFlag {
    fn is_static(&self) -> bool;
    fn is_eof(&self) -> bool;
    fn is_eof_init(&self) -> bool;
    fn spec_id(&self) -> SpecId;
}

pub trait Interp {
    type Instruction;
    type Action;

    fn run(&mut self, instructions: &[Self::Instruction; 256]) -> Self::Action;
}

pub trait InterpreterTypes {
    type Stack: StackTr;
    type Memory: MemoryTr;
    type Bytecode: Jumps + Immediates + LegacyBytecode + EofData + EofContainer + EofCodeInfo;
    type ReturnData: ReturnData;
    type Input: InputsTr;
    type SubRoutineStack: SubRoutineStack;
    type Control: LoopControl;
    type RuntimeFlag: RuntimeFlag;
    type Extend;
    type Output;
}
```
```rs [revm/crates/interpreter/src/interpreter.rs]
pub mod ext_bytecode;
mod input;
mod loop_control;
mod return_data;
mod runtime_flags;
mod shared_memory;
mod stack;
mod subroutine_stack;

// re-exports
pub use ext_bytecode::ExtBytecode;
pub use input::InputsImpl;
pub use loop_control::LoopControl as LoopControlImpl;
pub use return_data::ReturnDataImpl;
pub use runtime_flags::RuntimeFlags;
pub use shared_memory::{num_words, SharedMemory};
pub use stack::{Stack, STACK_LIMIT};
pub use subroutine_stack::{SubRoutineImpl, SubRoutineReturnFrame};

// imports
use crate::{
    host::DummyHost, instruction_context::InstructionContext, interpreter_types::*, CallInput, Gas,
    Host, InstructionResult, InstructionTable, InterpreterAction,
};
use bytecode::Bytecode;
use primitives::{hardfork::SpecId, Address, Bytes, U256};

/// Main interpreter structure that contains all components defines in [`InterpreterTypes`].s
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(::serde::Serialize, ::serde::Deserialize))]
pub struct Interpreter<WIRE: InterpreterTypes = EthInterpreter> {
    pub bytecode: WIRE::Bytecode,
    pub stack: WIRE::Stack,
    pub return_data: WIRE::ReturnData,
    pub memory: WIRE::Memory,
    pub input: WIRE::Input,
    pub sub_routine: WIRE::SubRoutineStack,
    pub control: WIRE::Control,
    pub runtime_flag: WIRE::RuntimeFlag,
    pub extend: WIRE::Extend,
}

impl<EXT: Default> Interpreter<EthInterpreter<EXT>> {
    /// Create new interpreter
    pub fn new(
        memory: SharedMemory,
        bytecode: ExtBytecode,
        inputs: InputsImpl,
        is_static: bool,
        is_eof_init: bool,
        spec_id: SpecId,
        gas_limit: u64,
    ) -> Self {
        let runtime_flag = RuntimeFlags {
            spec_id,
            is_static,
            is_eof: bytecode.is_eof(),
            is_eof_init,
        };

        Self {
            bytecode,
            stack: Stack::new(),
            return_data: ReturnDataImpl::default(),
            memory,
            input: inputs,
            sub_routine: SubRoutineImpl::default(),
            control: LoopControlImpl::new(gas_limit),
            runtime_flag,
            extend: EXT::default(),
        }
    }

    /// Sets the bytecode that is going to be executed
    pub fn with_bytecode(mut self, bytecode: Bytecode) -> Self {
        self.bytecode = ExtBytecode::new(bytecode);
        self
    }
}

impl Default for Interpreter<EthInterpreter> {
    fn default() -> Self {
        Interpreter::new(
            SharedMemory::new(),
            ExtBytecode::new(Bytecode::default()),
            InputsImpl {
                target_address: Address::ZERO,
                bytecode_address: None,
                caller_address: Address::ZERO,
                input: CallInput::default(),
                call_value: U256::ZERO,
            },
            false,
            false,
            SpecId::default(),
            u64::MAX,
        )
    }
}

/// Default types for Ethereum interpreter.
pub struct EthInterpreter<EXT = (), MG = SharedMemory> {
    _phantom: core::marker::PhantomData<fn() -> (EXT, MG)>,
}

impl<EXT> InterpreterTypes for EthInterpreter<EXT> {
    type Stack = Stack;
    type Memory = SharedMemory;
    type Bytecode = ExtBytecode;
    type ReturnData = ReturnDataImpl;
    type Input = InputsImpl;
    type SubRoutineStack = SubRoutineImpl;
    type Control = LoopControlImpl;
    type RuntimeFlag = RuntimeFlags;
    type Extend = EXT;
    type Output = InterpreterAction;
}

impl<IW: InterpreterTypes> Interpreter<IW> {
    /// Resets the control to the initial state. so that we can run the interpreter again.
    #[inline]
    pub fn reset_control(&mut self) {
        self.control
            .set_next_action(InterpreterAction::None, InstructionResult::Continue);
    }

    /// Takes the next action from the control and returns it.
    #[inline]
    pub fn take_next_action(&mut self) -> InterpreterAction {
        // Return next action if it is some.
        let action = self.control.take_next_action();
        if action != InterpreterAction::None {
            return action;
        }
        // If not, return action without output as it is a halt.
        InterpreterAction::Return {
            result: InterpreterResult {
                result: self.control.instruction_result(),
                // Return empty bytecode
                output: Bytes::new(),
                gas: *self.control.gas(),
            },
        }
    }

    /// Executes the instruction at the current instruction pointer.
    ///
    /// Internally it will increment instruction pointer by one.
    #[inline]
    pub fn step<H: ?Sized>(&mut self, instruction_table: &InstructionTable<IW, H>, host: &mut H) {
        let context = InstructionContext {
            interpreter: self,
            host,
        };
        context.step(instruction_table);
    }

    /// Executes the instruction at the current instruction pointer.
    ///
    /// Internally it will increment instruction pointer by one.
    ///
    /// This uses dummy Host.
    #[inline]
    pub fn step_dummy(&mut self, instruction_table: &InstructionTable<IW, DummyHost>) {
        let context = InstructionContext {
            interpreter: self,
            host: &mut DummyHost,
        };
        context.step(instruction_table);
    }

    /// Executes the interpreter until it returns or stops.
    #[inline]
    pub fn run_plain<H: ?Sized>(
        &mut self,
        instruction_table: &InstructionTable<IW, H>,
        host: &mut H,
    ) -> InterpreterAction {
        self.reset_control();

        while self.control.instruction_result().is_continue() {
            let context = InstructionContext {
                interpreter: self,
                host,
            };
            context.step(instruction_table);
        }

        self.take_next_action()
    }
}

/// The result of an interpreter operation.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(::serde::Serialize, ::serde::Deserialize))]
pub struct InterpreterResult {
    /// The result of the instruction execution.
    pub result: InstructionResult,
    /// The output of the instruction execution.
    pub output: Bytes,
    /// The gas usage information.
    pub gas: Gas,
}

impl InterpreterResult {
    /// Returns a new `InterpreterResult` with the given values.
    pub fn new(result: InstructionResult, output: Bytes, gas: Gas) -> Self {
        Self {
            result,
            output,
            gas,
        }
    }

    /// Returns whether the instruction result is a success.
    #[inline]
    pub const fn is_ok(&self) -> bool {
        self.result.is_ok()
    }

    /// Returns whether the instruction result is a revert.
    #[inline]
    pub const fn is_revert(&self) -> bool {
        self.result.is_revert()
    }

    /// Returns whether the instruction result is an error.
    #[inline]
    pub const fn is_error(&self) -> bool {
        self.result.is_error()
    }
}

// Special implementation for types where Output can be created from InterpreterAction
impl<IW: InterpreterTypes> Interpreter<IW>
where
    IW::Output: From<InterpreterAction>,
{
    /// Takes the next action from the control and returns it as the specific Output type.
    #[inline]
    pub fn take_next_action_as_output(&mut self) -> IW::Output {
        From::from(self.take_next_action())
    }

    /// Executes the interpreter until it returns or stops, returning the specific Output type.
    #[inline]
    pub fn run_plain_as_output<H: Host + ?Sized>(
        &mut self,
        instruction_table: &InstructionTable<IW, H>,
        host: &mut H,
    ) -> IW::Output {
        From::from(self.run_plain(instruction_table, host))
    }
}

#[cfg(test)]
mod tests {
    #[test]
    #[cfg(feature = "serde")]
    fn test_interpreter_serde() {
        use super::*;
        use bytecode::Bytecode;
        use primitives::{Address, Bytes, U256};

        let bytecode = Bytecode::new_raw(Bytes::from(&[0x60, 0x00, 0x60, 0x00, 0x01][..]));
        let interpreter = Interpreter::<EthInterpreter>::new(
            SharedMemory::new(),
            ExtBytecode::new(bytecode),
            InputsImpl {
                target_address: Address::ZERO,
                caller_address: Address::ZERO,
                bytecode_address: None,
                input: CallInput::Bytes(Bytes::default()),
                call_value: U256::ZERO,
            },
            false,
            false,
            SpecId::default(),
            u64::MAX,
        );

        let serialized = bincode::serialize(&interpreter).unwrap();

        let deserialized: Interpreter<EthInterpreter> = bincode::deserialize(&serialized).unwrap();

        assert_eq!(
            interpreter.bytecode.pc(),
            deserialized.bytecode.pc(),
            "Program counter should be preserved"
        );
    }
}
```

  </Revm>
</Context>
