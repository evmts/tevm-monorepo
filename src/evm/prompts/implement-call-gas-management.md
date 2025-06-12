# Implement Call Gas Management

You are implementing Call Gas Management for the Tevm EVM written in Zig. Your goal is to implement comprehensive gas management for CALL operations following Ethereum specifications and maintaining compatibility with existing implementations.

<<<<<<< HEAD
=======
<review>
**Implementation Status: PARTIALLY COMPLETED ❌**

**What is implemented:**
- CallGasCalculation struct with base_cost, gas_forwarded, and gas_stipend fields
- calculate_call_gas function implementing 63/64 gas forwarding rule
- Gas constants including CALL_GAS_RETENTION_DIVISOR and GAS_STIPEND_VALUE_TRANSFER
- Partial implementation of gas tracking system
- Basic framework for call gas calculations

**Critical Issues:**
- ✅ **SYNTAX ERROR FIXED**: Previous semicolon issue resolved
- ❌ **NEW COMPILATION ERROR**: Missing blake2f import in precompiles.zig
- ❌ **Tests failing**: `zig build test-all` fails due to missing blake2f declaration

**Error Details:**
```
src/evm/precompiles/precompiles.zig:132:20: error: use of undeclared identifier 'blake2f'
            return blake2f.execute(input, output, gas_limit);
                   ^~~~~~~
```

**TODOs:**
- 🔴 **URGENT**: Fix syntax error in call_gas_calculator.zig line 117
- 🔄 Complete CallGasTracker implementation 
- 🔄 Add comprehensive test suite for gas calculations
- 🔄 Integration with existing call opcodes (CALL, DELEGATECALL, etc.)
- 🔄 Add stipend handling for value transfers
- 🔄 Performance optimization and benchmarks
- 🔄 Edge case handling (overflow, underflow)
- 🔄 Documentation and examples

**Test Coverage:**
- ❌ Cannot run tests due to compilation error
- Expected test areas needed:
  - 63/64 gas forwarding rule accuracy
  - Stipend calculations for value transfers
  - Edge cases (zero gas, maximum gas)
  - Integration with call opcodes
  - Gas retention validation

**Next Steps:**
1. Fix syntax error in call_gas_calculator.zig:117
2. Ensure `zig build test-all` passes
3. Add comprehensive test suite
4. Complete CallGasTracker implementation
5. Integration testing with call operations

**Overall Assessment: Implementation started but blocked by syntax error. Cannot proceed until compilation issues are resolved.**
</review>

>>>>>>> origin/main
## Development Workflow
- **Branch**: `feat_implement_call_gas_management` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_call_gas_management feat_implement_call_gas_management`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement the 63/64th gas forwarding rule for call operations in the EVM. This is a critical system feature that determines how much gas is forwarded to subcalls, preventing malicious contracts from consuming all available gas while still allowing legitimate operations to complete.

## ELI5

Think of the 63/64th gas rule like a safety mechanism for a car's fuel system. Imagine you're on a road trip and need to make several stops, but you want to ensure you always have enough fuel to get back home.

The rule works like this:
- **You have a tank of gas** (your available gas for the current contract)
- **When calling another contract** (making a stop), you can only give away 63/64th of your remaining gas
- **You must keep 1/64th** (about 1.56%) as a "reserve tank" for your own operations
- **This prevents getting stranded** if the other contract uses all the gas you gave it

This is crucial because:
- **Prevents Gas Attacks**: Malicious contracts can't trick you into giving away all your gas and leave you unable to finish your own operations
- **Enables Deep Calls**: You can still make long chains of contract calls because each level keeps a small reserve
- **Maintains Predictability**: Smart contract developers can reliably estimate gas usage

Real-world analogy:
- Like keeping some cash in your wallet when lending money to friends
- Or saving some battery on your phone when hotspotting for others
- Always having a "safety buffer" for essential operations

The enhanced version includes:
- **Optimized Calculations**: Faster gas computation using efficient arithmetic
- **Edge Case Handling**: Proper behavior when gas amounts are very small
- **Attack Prevention**: Additional protections against sophisticated gas manipulation attempts

Without this rule, a single malicious contract could "drink all the gas" and break the entire call chain.

## EVM Specification

### Gas Forwarding Rule
- **Rule**: When making a call, forward at most 63/64th of available gas
- **Retention**: Always retain at least 1/64th of gas for post-call operations
- **Applies to**: CALL, CALLCODE, DELEGATECALL, STATICCALL, CREATE, CREATE2
- **Purpose**: Prevent gas exhaustion attacks while allowing deep call stacks

### Mathematical Formula
```
gas_to_forward = min(requested_gas, available_gas - floor(available_gas / 64))
retained_gas = available_gas - gas_to_forward
```

## Implementation Requirements

### Core Functionality
1. **Gas Calculation**: Implement 63/64th forwarding calculation
2. **Call Integration**: Apply rule to all call operations
3. **Error Handling**: Proper out-of-gas detection
4. **Post-Call Gas**: Track remaining gas after call completion

### Files to Modify
- `/src/evm/execution/system.zig` - Update call operations
- `/src/evm/constants/gas_constants.zig` - Add gas forwarding constants
- `/src/evm/frame.zig` - Gas tracking utilities
- `/test/evm/gas/gas_accounting_test.zig` - Add comprehensive tests

## Success Criteria

1. **Gas Forwarding**: Correctly implements 63/64th rule for all call types
2. **Gas Retention**: Always retains minimum 1/64th gas for caller
3. **Ethereum Compatibility**: Matches mainnet behavior for gas calculations
4. **Test Coverage**: Comprehensive tests for edge cases and gas accounting
5. **Integration**: Works properly with existing call infrastructure

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly


## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "delegation.hpp"
#include "eof.hpp"
#include "instructions.hpp"
#include <variant>

constexpr int64_t MIN_RETAINED_GAS = 5000;
constexpr int64_t MIN_CALLEE_GAS = 2300;
constexpr int64_t CALL_VALUE_COST = 9000;
constexpr int64_t ACCOUNT_CREATION_COST = 25000;

namespace evmone::instr::core
{
namespace
{
/// Get target address of a code executing instruction.
///
/// Returns EIP-7702 delegate address if addr is delegated, or addr itself otherwise.
/// Applies gas charge for accessing delegate account and may fail with out of gas.
inline std::variant<evmc::address, Result> get_target_address(
    const evmc::address& addr, int64_t& gas_left, ExecutionState& state) noexcept
{
    // ... (implementation not directly relevant to 63/64 rule, but good context)
}
}  // namespace

template <Opcode Op>
Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    static_assert(
        Op == OP_CALL || Op == OP_CALLCODE || Op == OP_DELEGATECALL || Op == OP_STATICCALL);

    const auto gas = stack.pop();
    const auto dst = intx::be::trunc<evmc::address>(stack.pop());
    const auto value = (Op == OP_STATICCALL || Op == OP_DELEGATECALL) ? 0 : stack.pop();
    const auto has_value = value != 0;
    const auto input_offset_u256 = stack.pop();
    const auto input_size_u256 = stack.pop();
    const auto output_offset_u256 = stack.pop();
    const auto output_size_u256 = stack.pop();

    stack.push(0);  // Assume failure.
    state.return_data.clear();

    if (state.rev >= EVMC_BERLIN && state.host.access_account(dst) == EVMC_ACCESS_COLD)
    {
        if ((gas_left -= instr::additional_cold_account_access_cost) < 0)
            return {EVMC_OUT_OF_GAS, gas_left};
    }
    
    // ...

    evmc_message msg{.kind = to_call_kind(Op)};
    msg.flags = (Op == OP_STATICCALL) ? uint32_t{EVMC_STATIC} : state.msg->flags;
    // ... (message setup)

    auto cost = has_value ? CALL_VALUE_COST : 0;

    if constexpr (Op == OP_CALL)
    {
        if (has_value && state.in_static_mode())
            return {EVMC_STATIC_MODE_VIOLATION, gas_left};

        if ((has_value || state.rev < EVMC_SPURIOUS_DRAGON) && !state.host.account_exists(dst))
            cost += ACCOUNT_CREATION_COST;
    }

    if ((gas_left -= cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};

    msg.gas = std::numeric_limits<int64_t>::max();
    if (gas < msg.gas)
        msg.gas = static_cast<int64_t>(gas);

    if (state.rev >= EVMC_TANGERINE_WHISTLE)  // EIP-150: 63/64 rule
        msg.gas = std::min(msg.gas, gas_left - gas_left / 64);
    else if (msg.gas > gas_left)
        return {EVMC_OUT_OF_GAS, gas_left};

    if (has_value)
    {
        msg.gas += 2300;  // Add stipend.
        gas_left += 2300;
    }

    if (state.msg->depth >= 1024)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    if (has_value && intx::be::load<uint256>(state.host.get_balance(state.msg->recipient)) < value)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    const auto result = state.host.call(msg);
    state.return_data.assign(result.output_data, result.output_size);
    stack.top() = result.status_code == EVMC_SUCCESS;

    if (const auto copy_size = std::min(output_size, result.output_size); copy_size > 0)
        std::memcpy(&state.memory[output_offset], result.output_data, copy_size);

    const auto gas_used = msg.gas - result.gas_left;
    gas_left -= gas_used;
    state.gas_refund += result.gas_refund;
    return {EVMC_SUCCESS, gas_left};
}


template <Opcode Op>
Result create_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    static_assert(Op == OP_CREATE || Op == OP_CREATE2);

    if (state.in_static_mode())
        return {EVMC_STATIC_MODE_VIOLATION, gas_left};

    const auto endowment = stack.pop();
    const auto init_code_offset_u256 = stack.pop();
    const auto init_code_size_u256 = stack.pop();
    const auto salt = (Op == OP_CREATE2) ? stack.pop() : uint256{};

    // ... (memory checks and init code cost calculation) ...

    if (state.msg->depth >= 1024)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    if (endowment != 0 &&
        intx::be::load<uint256>(state.host.get_balance(state.msg->recipient)) < endowment)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    evmc_message msg{.kind = to_call_kind(Op)};
    msg.gas = gas_left;
    if (state.rev >= EVMC_TANGERINE_WHISTLE)
        msg.gas = msg.gas - msg.gas / 64;
    
    // ... (rest of create implementation) ...

    const auto result = state.host.call(msg);
    gas_left -= msg.gas - result.gas_left;
    state.gas_refund += result.gas_refund;

    state.return_data.assign(result.output_data, result.output_size);
    if (result.status_code == EVMC_SUCCESS)
        stack.top() = intx::be::load<uint256>(result.create_address);

    return {EVMC_SUCCESS, gas_left};
}
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "baseline.hpp"
#include "eof.hpp"
#include "execution_state.hpp"
#include "instructions_traits.hpp"
#include "instructions_xmacro.hpp"
#include <evmone_precompiles/keccak.hpp>

// This file contains constants referenced in instructions_calls.cpp
// which are useful for gas calculation.
namespace evmone::instr::core
{
// ... (other code)
Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept;
// ... (other code)
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <evmc/evmc.hpp>
#include <intx/intx.hpp>
#include <exception>
#include <memory>
#include <string>
#include <vector>

namespace evmone
{
// ... (other code)

/// Generic execution state for generic instructions implementations.
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};
    bytes return_data;

    /// Reference to original EVM code container.
    bytes_view original_code;

    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;
    // ... (other fields and methods)
};
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/unittests/evm_calls_test.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019-2020 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

/// This file contains EVM unit tests that perform any kind of calls.

#include "evm_fixture.hpp"

using namespace evmc::literals;
using namespace evmone::test;

// ...

TEST_P(evm, call_with_value_low_gas)
{
    // Create the call destination account.
    host.accounts[0x0000000000000000000000000000000000000000_address] = {};
    for (auto call_op : {OP_CALL, OP_CALLCODE})
    {
        auto code = 4 * push(0) + push(1) + 2 * push(0) + call_op + OP_POP;
        execute(9721, code);
        EXPECT_EQ(result.status_code, EVMC_SUCCESS);
        EXPECT_EQ(result.gas_left, 2300 - 2);
    }
}

TEST_P(evm, call_high_gas)
{
    rev = EVMC_HOMESTEAD;
    host.accounts[0xaa_address] = {};

    for (auto call_opcode : {OP_CALL, OP_CALLCODE, OP_DELEGATECALL})
    {
        execute(5000, 5 * push(0) + push(0xaa) + push(0x134c) + call_opcode);
        EXPECT_EQ(result.status_code, EVMC_OUT_OF_GAS);
    }
}

TEST_P(evm, create_gas)
{
    size_t c = 0;
    for (auto r : {EVMC_HOMESTEAD, EVMC_TANGERINE_WHISTLE})
    {
        ++c;
        rev = r;
        execute(50000, create());
        EXPECT_EQ(result.status_code, EVMC_SUCCESS);
        EXPECT_EQ(gas_used, rev == EVMC_HOMESTEAD ? 50000 : 49719) << rev;
        ASSERT_EQ(host.recorded_calls.size(), c);
        EXPECT_EQ(host.recorded_calls.back().gas, rev == EVMC_HOMESTEAD ? 17991 : 17710) << rev;
    }
}
```
</file>
</evmone>

## Prompt Corrections
The original prompt is good, but it could be improved by clarifying two related aspects of call gas management:

1.  **Gas Stipend for Value Transfers**: When `CALL` or `CALLCODE` transfers a non-zero `value`, an additional 2300 gas "stipend" is added to the forwarded gas *after* the 63/64th rule is applied. This ensures the recipient has enough gas to execute basic logging even if the caller forwards minimal gas. This is a critical detail for compatibility.

2.  **Gas Forwarding for `CREATE` vs. `CALL`**: The prompt groups all call/create operations together. However, there's a key difference in how gas is determined:
    *   `CALL`, `CALLCODE`, `DELEGATECALL`, and `STATICCALL` take a `gas` parameter from the stack. The amount forwarded is `min(requested_gas, available_gas - floor(available_gas / 64))`.
    *   `CREATE` and `CREATE2` do **not** take a `gas` parameter. Instead, they forward a portion of the *currently available* gas: `available_gas - floor(available_gas / 64)`.

The provided `evmone` snippets clearly show these distinctions and should be used as a reference.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/contract.rs">
```rust
//! Contains the contract-related instructions.
// ...

/// Create a new contract.
pub fn create<WIRE: InterpreterTypes, const IS_CREATE2: bool, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    // ... (omitted initial checks)

    let mut gas_limit = context.interpreter.control.gas().remaining();

    // EIP-150: Gas cost changes for IO-heavy operations
    if context
        .interpreter
        .runtime_flag
        .spec_id()
        .is_enabled_in(SpecId::TANGERINE)
    {
        // Take l64 part of it.
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

/// Call a contract.
pub fn call<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn!([local_gas_limit, to, value], context.interpreter);
    let to = to.into_address();
    // Max gas limit is not possible in real ethereum situation.
    let local_gas_limit = u64::try_from(local_gas_limit).unwrap_or(u64::MAX);

    let has_transfer = !value.is_zero();
    // ... (omitted static call checks and memory setup)

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
            // ... (omitted other fields)
            gas_limit,
            // ...
        }))),
        InstructionResult::CallOrCreate,
    );
}
// ... similar logic for CALLCODE, DELEGATECALL, and STATICCALL using calc_call_gas helper
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/contract/call_helpers.rs">
```rust
//! Helper functions for call instructions.

// ...

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
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
//! EVM gas calculation utilities.

// ...

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
    // ...
}

impl Gas {
    // ...

    /// Returns the amount of gas remaining.
    #[inline]
    pub const fn remaining(&self) -> u64 {
        self.remaining
    }

    /// Return remaining gas after subtracting 63/64 parts.
    pub const fn remaining_63_of_64_parts(&self) -> u64 {
        self.remaining - self.remaining / 64
    }
    
    // ...

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
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/calc.rs">
```rust
// ...

/// Calculate call gas cost for the call instruction.
///
/// There is three types of gas.
/// * Account access gas. after berlin it can be cold or warm.
/// * Transfer value gas. If value is transferred and balance of target account is updated.
/// * If account is not existing and needs to be created. After Spurious dragon
///   this is only accounted if value is transferred.
///
// ...
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
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/constants.rs">
```rust
// ...

/// EIP-1884: Repricing for trie-size-dependent opcodes
pub const ISTANBUL_SLOAD_GAS: u64 = 800;
pub const SSTORE_SET: u64 = 20000;
pub const SSTORE_RESET: u64 = 5000;
pub const REFUND_SSTORE_CLEARS: i64 = 15000;

// ...

// Berlin eip2929 constants
pub const ACCESS_LIST_ADDRESS: u64 = 2400;
pub const ACCESS_LIST_STORAGE_KEY: u64 = 1900;
pub const COLD_SLOAD_COST: u64 = 2100;
pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
pub const WARM_STORAGE_READ_COST: u64 = 100;

// ...

pub const CALL_STIPEND: u64 = 2300;
pub const MIN_CALLEE_GAS: u64 = CALL_STIPEND;
```
</file>
</revm>

## Prompt Corrections
The original prompt is excellent and covers the core requirements well. Here are a few minor improvements based on the `revm` implementation:

1.  **Distinction between `CREATE` and `CALL` Gas Forwarding**:
    *   For `CALL`, `CALLCODE`, `DELEGATECALL`, and `STATICCALL`, the gas forwarded is `min(requested_gas, available_gas_after_costs - floor(available_gas_after_costs / 64))`.
    *   For `CREATE` and `CREATE2`, the gas forwarded is simply `available_gas_after_costs - floor(available_gas_after_costs / 64)`. The `min` with requested gas is not applicable as the opcode doesn't take a gas parameter from the stack. The `revm` code shows this distinction clearly.

2.  **Gas Stipend (`CALLSTIPEND`)**: The prompt should clarify that the `2300` gas stipend for value-transferring calls is *added* to the forwarded gas *after* the 63/64th rule calculation. The total gas consumed by the caller still includes this stipend. `revm`'s `call` function demonstrates this: `gas_limit = gas_limit.saturating_add(gas::CALL_STIPEND);`.

3.  **Hardfork Specificity**: The 63/64th rule was introduced in the `Tangerine Whistle` hardfork (EIP-150). The implementation should be conditional on this hardfork being active. The `revm` code handles this with `spec_id.is_enabled_in(TANGERINE)`. This is a critical detail for compatibility.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
def calculate_message_call_gas(
    value: U256,
    gas: Uint,
    gas_left: Uint,
    memory_cost: Uint,
    extra_gas: Uint,
    call_stipend: Uint = GAS_CALL_STIPEND,
) -> MessageCallGas:
    """
    Calculates the MessageCallGas (cost and gas made available to the sub-call)
    for executing call Opcodes.

    Parameters
    ----------
    value:
        The amount of `ETH` that needs to be transferred.
    gas :
        The amount of gas provided to the message-call.
    gas_left :
        The amount of gas left in the current frame.
    memory_cost :
        The amount needed to extend the memory in the current frame.
    extra_gas :
        The amount of gas needed for transferring value + creating a new
        account inside a message call.
    call_stipend :
        The amount of stipend provided to a message call to execute code while
        transferring value(ETH).

    Returns
    -------
    message_call_gas: `MessageCallGas`
    """
    call_stipend = Uint(0) if value == 0 else call_stipend
    if gas_left < extra_gas + memory_cost:
        return MessageCallGas(gas + extra_gas, gas + call_stipend)

    gas = min(gas, max_message_call_gas(gas_left - memory_cost - extra_gas))

    return MessageCallGas(gas + extra_gas, gas + call_stipend)


def max_message_call_gas(gas: Uint) -> Uint:
    """
    Calculates the maximum gas that is allowed for making a message call

    Parameters
    ----------
    gas :
        The amount of gas provided to the message-call.

    Returns
    -------
    max_allowed_message_call_gas: `ethereum.base_types.Uint`
        The maximum gas allowed for making the message-call.
    """
    return gas - (gas // Uint(64))
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/system.py">
```python
def generic_create(
    evm: Evm,
    endowment: U256,
    contract_address: Address,
    memory_start_position: U256,
    memory_size: U256,
) -> None:
    """
    Core logic used by the `CREATE*` family of opcodes.
    """
    # This import causes a circular import error
    # if it's not moved inside this method
    from ...vm.interpreter import (
        MAX_CODE_SIZE,
        STACK_DEPTH_LIMIT,
        process_create_message,
    )

    call_data = memory_read_bytes(
        evm.memory, memory_start_position, memory_size
    )
    if len(call_data) > 2 * MAX_CODE_SIZE:
        raise OutOfGasError

    create_message_gas = max_message_call_gas(Uint(evm.gas_left))
    evm.gas_left -= create_message_gas
    if evm.message.is_static:
        raise WriteInStaticContext
    evm.return_data = b""

    sender_address = evm.message.current_target
    sender = get_account(evm.message.block_env.state, sender_address)

    if (
        sender.balance < endowment
        or sender.nonce == Uint(2**64 - 1)
        or evm.message.depth + Uint(1) > STACK_DEPTH_LIMIT
    ):
        evm.gas_left += create_message_gas
        push(evm.stack, U256(0))
        return

    evm.accessed_addresses.add(contract_address)
    
    # ... Omitted code for brevity ...

    child_message = Message(
        # ... Omitted message fields ...
        gas=create_message_gas,
        # ... Omitted message fields ...
    )
    child_evm = process_create_message(child_message)

    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(0))
    else:
        incorporate_child_on_success(evm, child_evm)
        evm.return_data = b""
        push(evm.stack, U256.from_be_bytes(child_evm.message.current_target))


def call(evm: Evm) -> None:
    """
    Message-call into an account.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    gas = Uint(pop(evm.stack))
    to = to_address(pop(evm.stack))
    value = pop(evm.stack)
    memory_input_start_position = pop(evm.stack)
    memory_input_size = pop(evm.stack)
    memory_output_start_position = pop(evm.stack)
    memory_output_size = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory,
        [
            (memory_input_start_position, memory_input_size),
            (memory_output_start_position, memory_output_size),
        ],
    )

    if to in evm.accessed_addresses:
        access_gas_cost = GAS_WARM_ACCESS
    else:
        evm.accessed_addresses.add(to)
        access_gas_cost = GAS_COLD_ACCOUNT_ACCESS

    code_address = to

    create_gas_cost = (
        Uint(0)
        if is_account_alive(evm.message.block_env.state, to) or value == 0
        else GAS_NEW_ACCOUNT
    )
    transfer_gas_cost = Uint(0) if value == 0 else GAS_CALL_VALUE
    message_call_gas = calculate_message_call_gas(
        value,
        gas,
        Uint(evm.gas_left),
        extend_memory.cost,
        access_gas_cost + create_gas_cost + transfer_gas_cost,
    )
    charge_gas(evm, message_call_gas.cost + extend_memory.cost)
    if evm.message.is_static and value != U256(0):
        raise WriteInStaticContext
    evm.memory += b"\x00" * extend_memory.expand_by
    sender_balance = get_account(
        evm.message.block_env.state, evm.message.current_target
    ).balance
    if sender_balance < value:
        push(evm.stack, U256(0))
        evm.return_data = b""
        evm.gas_left += message_call_gas.sub_call
    else:
        generic_call(
            evm,
            message_call_gas.sub_call,
            value,
            evm.message.current_target,
            to,
            code_address,
            True,
            False,
            memory_input_start_position,
            memory_input_size,
            memory_output_start_position,
            memory_output_size,
        )

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
</execution-specs>
## Prompt Corrections
The mathematical formula in the original prompt is a good simplification, but it's important to note a subtle detail from the spec.

**Original Formula:**
```
gas_to_forward = min(requested_gas, available_gas - floor(available_gas / 64))
```

**Correction based on `calculate_message_call_gas`:**
The 63/64th rule is applied to the gas remaining *after* other costs for the `CALL` operation itself have been deducted (like memory expansion, value transfer cost, and account access costs), not the total `available_gas`.

A more precise representation would be:
```
base_cost = GAS_CALL + memory_expansion_cost + value_transfer_cost + account_access_cost
gas_available_for_subcall = available_gas - base_cost
max_forwardable_gas = gas_available_for_subcall - floor(gas_available_for_subcall / 64)
gas_to_forward = min(requested_gas, max_forwardable_gas)
```
This ensures that the parent context always has enough gas for its own operations post-call, even after paying the base cost for the call itself.

---

An excellent request. Implementing the 63/64th gas forwarding rule is a foundational part of EVM execution. Here are the most relevant code snippets from `execution-specs` that illustrate how this is handled, focusing on the Tangerine Whistle EIP-150 changes and their modern application.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
def max_message_call_gas(gas: Uint) -> Uint:
    """
    Calculates the maximum gas that is allowed for making a message call

    Parameters
    ----------
    gas :
        The amount of gas provided to the message-call.

    Returns
    -------
    max_allowed_message_call_gas: `ethereum.base_types.Uint`
        The maximum gas allowed for making the message-call.
    """
    return gas - (gas // Uint(64))


def calculate_message_call_gas(
    value: U256,
    gas: Uint,
    gas_left: Uint,
    memory_cost: Uint,
    extra_gas: Uint,
    call_stipend: Uint = GAS_CALL_STIPEND,
) -> MessageCallGas:
    """
    Calculates the MessageCallGas (cost and gas made available to the sub-call)
    for executing call Opcodes.

    Parameters
    ----------
    value:
        The amount of `ETH` that needs to be transferred.
    gas :
        The amount of gas provided to the message-call.
    gas_left :
        The amount of gas left in the current frame.
    memory_cost :
        The amount needed to extend the memory in the current frame.
    extra_gas :
        The amount of gas needed for transferring value + creating a new
        account inside a message call.
    call_stipend :
        The amount of stipend provided to a message call to execute code while
        transferring value(ETH).

    Returns
    -------
    message_call_gas: `MessageCallGas`
    """
    call_stipend = Uint(0) if value == 0 else call_stipend
    if gas_left < extra_gas + memory_cost:
        return MessageCallGas(gas + extra_gas, gas + call_stipend)

    gas = min(gas, max_message_call_gas(gas_left - memory_cost - extra_gas))

    return MessageCallGas(gas + extra_gas, gas + call_stipend)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
def generic_create(
    evm: Evm,
    endowment: U256,
    contract_address: Address,
    memory_start_position: U256,
    memory_size: U256,
) -> None:
    """
    Core logic used by the `CREATE*` family of opcodes.
    """
    # ... (initial checks) ...
    
    # This is the key part for CREATE/CREATE2:
    # All remaining gas is forwarded, subject to the 63/64 rule.
    create_message_gas = max_message_call_gas(Uint(evm.gas_left))
    evm.gas_left -= create_message_gas
    
    # ... (rest of create logic) ...

    child_message = Message(
        # ...
        gas=create_message_gas,
        # ...
    )
    child_evm = process_create_message(child_message)

    # ... (handle child_evm result) ...


def call(evm: Evm) -> None:
    """
    Message-call into an account.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    gas = Uint(pop(evm.stack))
    to = to_address(pop(evm.stack))
    value = pop(evm.stack)
    memory_input_start_position = pop(evm.stack)
    memory_input_size = pop(evm.stack)
    memory_output_start_position = pop(evm.stack)
    memory_output_size = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory,
        [
            (memory_input_start_position, memory_input_size),
            (memory_output_start_position, memory_output_size),
        ],
    )

    if to in evm.accessed_addresses:
        access_gas_cost = GAS_WARM_ACCESS
    else:
        evm.accessed_addresses.add(to)
        access_gas_cost = GAS_COLD_ACCOUNT_ACCESS

    code_address = to

    create_gas_cost = (
        Uint(0)
        if is_account_alive(evm.message.block_env.state, to) or value == 0
        else GAS_NEW_ACCOUNT
    )
    transfer_gas_cost = Uint(0) if value == 0 else GAS_CALL_VALUE
    
    # This function calculates total cost and how much gas to forward.
    # It internally uses max_message_call_gas (the 63/64 rule).
    message_call_gas = calculate_message_call_gas(
        value,
        gas,
        Uint(evm.gas_left),
        extend_memory.cost,
        access_gas_cost + create_gas_cost + transfer_gas_cost,
    )
    # The base cost of the CALL operation itself is deducted from the current frame.
    charge_gas(evm, message_call_gas.cost + extend_memory.cost)

    # ... (pre-call checks) ...
    
    # The call is made with the calculated gas to forward.
    generic_call(
        evm,
        message_call_gas.sub_call,
        value,
        evm.message.current_target,
        to,
        code_address,
        True,
        False,
        memory_input_start_position,
        memory_input_size,
        memory_output_start_position,
        memory_output_size,
    )
    
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """
    # ...
    gas: Uint
    # ...
    parent_evm: Optional["Evm"]


@dataclass
class Evm:
    """The internal state of the virtual machine."""
    # ...
    gas_left: Uint
    # ...
    message: Message
    # ...
    error: Optional[EthereumException]


def incorporate_child_on_success(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of a successful `child_evm` into the parent `evm`.
    """
    # This line is critical: it returns the gas left over from the sub-call
    # back to the parent frame.
    evm.gas_left += child_evm.gas_left
    evm.logs += child_evm.logs
    evm.refund_counter += child_evm.refund_counter
    # ...


def incorporate_child_on_error(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of an unsuccessful `child_evm` into the parent `evm`.
    """
    # ...
    # Gas is also returned on error (e.g., REVERT)
    evm.gas_left += child_evm.gas_left
```
</file>
</execution-specs>

## Prompt Corrections

The original prompt is well-structured and accurate. The mathematical formula provided is a correct and concise representation of the 63/64th rule. The list of affected opcodes and files to modify are also correct. No corrections are necessary. The provided code snippets should give a clear implementation path based on the official Ethereum specification.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call runs the code of the given account with the given input data and returns
// the returned data, the leftover gas and an error if one occurred.
//
// The returned error will be an error indicating a EVM fault, returned by the
// EVM, or an error indicating that the EVM has run out of gas. If the account
// does not exist or is a contract without code, an error is returned.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the gas limit
	if gas > evm.gas {
		return nil, gas, ErrGasLimitReached
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}

	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	if !evm.StateDB.Exist(addr) {
		precompiles := PrecompiledContractsCleanRoom
		if p := precompiles[addr]; p != nil {
			return RunPrecompiledContract(p, input, gas)
		}
	}
	code := evm.StateDB.GetCode(addr)
	if len(code) == 0 {
		return nil, gas, nil
	}
	// It's a call.
	// Sub-call starts here
	transfer(evm.StateDB, caller.Address(), to.Address(), value)

	// Treat this far-reaching change as a read also, to capture it in the access list
	evm.journal.touchAddress(addr)

	// Create a new interpreter, set the context and run.
	ret, err = evm.interpreter.Run(NewContract(caller, to, value, gas), input, false)

	// When an error occurs, we revert the changes made in this call.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != errExecutionReverted {
			gas = 0
		}
	}
	return ret, gas, err
}

// Create creates a new account with the given code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure there's no existing contract already at the designated address
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1, NonceChangeContractCreator)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	contractHash := evm.StateDB.GetCodeHash(contractAddr)
	if evm.StateDB.GetNonce(contractAddr) != 0 || (contractHash != (common.Hash{}) && contractHash != emptyCodeHash) {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)

	// EIP-161: If the new account is empty after creation, it is added to the suicide list
	// and will be removed if the transaction ends successfully.
	if evm.chainRules.IsEIP158 {
		if evm.StateDB.Empty(contractAddr) {
			evm.journal.addSuicide(contractAddr)
		}
	}
	transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// Create a new contract and set the code that's supposed to be executed.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCodeOptionalHash(&contractAddr, codeAndHash{code: code})

	// Fire up the interpreter and execute the code, returns the code that needs to be stored.
	if evm.interpreter.hasHook() {
		evm.interpreter.getHooks().OnContractCallStart(evm, caller.Address(), contractAddr, contract.Code, contract.Gas, contract.value, nil, vm.CREATE)
	}

	ret, err = evm.interpreter.Run(contract, nil, true)

	// Check whether the max code size has been exceeded, assign err if the case.
	maxCodeSizeExceeded := evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize
	if err == nil && maxCodeSizeExceeded {
		err = ErrMaxCodeSizeExceeded
	}
	// If the interpreter returns with an error or the code size is exceeded, take the gas remaining
	// from the contract and also revert the state to the last snapshot.
	if err != nil {
		gas = 0
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != errExecutionReverted {
			// In case of a revert, we also get the gas remaining from the contract.
			// Otherwise, we only get the error.
			gas = contract.Gas
		}
	}
	// Otherwise, check the gas consumption and refund the caller.
	// EIP-3541: cannot start with 0xef. This check is done before setting code.
	if err == nil && len(ret) > 0 && ret[0] == 0xef && evm.chainRules.IsEIP3541 {
		err = ErrInvalidCode
	}
	if err == nil {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.UseGas(createDataGas) {
			evm.StateDB.SetCode(contractAddr, ret)
		} else {
			err = ErrCodeStoreOutOfGas
		}
	}
	if err != nil {
		// In case of an error, we charge all gas and revert the state.
		// However, in case of ErrCodeStoreOutOfGas, this is not a consensus fault
		// and the remaining gas is left as is.
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrCodeStoreOutOfGas {
			gas = 0
		}
	}
	return ret, contractAddr, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the general call operator.
func opCall(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	stack := scope.Stack
	// Pop 7 things from the stack and grab the salt.
	gas, to, value, inOffset, inSize, retOffset, retSize := stack.Pop7()
	if !gas.IsUint64() {
		return nil, ErrGasUintOverflow
	}
	// The call is executed with a 63/64th rule. The top 64th of the gas is
	// not forwarded but kept in the parent call.
	// EIP-150: all but one 64th of the caller's gas is passed to the callee.
	g := gas.Uint64()
	if g > interpreter.gas {
		g = interpreter.gas
	}
	g = g - g/64

	// memory parameter checking needs to be done immediately, prior to anything else
	mem := scope.Memory
	ret, err := mem.GetPtr(retOffset.Uint64(), retSize.Uint64())
	if err != nil {
		return nil, err
	}
	in, err := mem.GetPtr(inOffset.Uint64(), inSize.Uint64())
	if err != nil {
		return nil, err
	}
	toAddr := to.Address()

	// If the caller is in a static context, then the CALL is also static.
	var result []byte
	var resultErr error
	if interpreter.readOnly {
		result, _, resultErr = interpreter.evm.StaticCall(scope.contract, toAddr, in, g)
	} else {
		result, _, resultErr = interpreter.evm.Call(scope.contract, toAddr, in, g, value.ToBig())
	}

	if resultErr == nil {
		stack.Push(&U256.one)
	} else {
		stack.Push(&U256.zero)
	}

	if resultErr == nil || resultErr == errExecutionReverted {
		// Handle the memory copying in case the call was successful
		if retSize.Sign() > 0 {
			copy(ret, result)
		}
		// If it's a revert, the returned data is the revert reason
		if resultErr == errExecutionReverted {
			interpreter.returnData = result
		}
	}
	return nil, nil
}

// opCreate implements the CREATE opcode.
func opCreate(pc *uint64, interpreter *Interpreter, scope *ScopeContext) ([]byte, error) {
	var (
		value          = scope.Stack.Pop()
		offset, size   = scope.Stack.Pop2()
		input, err     = scope.Memory.GetPtr(offset.Uint64(), size.Uint64())
		gas            = interpreter.gas
		contract       = scope.contract
		contractCloner = contract.copy()
	)
	if err != nil {
		return nil, err
	}
	// EIP-150: all but one 64th of the caller's gas is passed to the callee.
	gas = gas - gas/64
	// Call the interpreter to create the new contract
	_, address, _, err := interpreter.evm.Create(contractCloner, input, gas, value.ToBig())
	// Assure that the state of the scope is synchronized with the state of the EVM.
	scope.contract = contractCloner

	// handle the returned data
	if err != nil {
		scope.Stack.Push(&U256.zero)
	} else {
		stackVal := new(uint256.Int).SetBytes(address.Bytes())
		scope.Stack.Push(stackVal)
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// callGas returns the gas required for calling a contract.
//
// The cost of gas was changed during the homestead price change.
// See Homestead hard fork for more information.
func callGas(isEIP150 bool, availableGas, newAccountGas, gas uint64, value *big.Int) (uint64, error) {
	if isEIP150 {
		gas = availableGas - availableGas/64
		if gas < newAccountGas {
			return 0, errGasLimitReached
		}
		gas -= newAccountGas
	}
	// EIP-150: do not transfer value if available gas is not enough
	if value.Sign() > 0 {
		if gas < params.CallStipend {
			return 0, errGasLimitReached
		}
		gas -= params.CallStipend
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Gas limit of a transaction.
	TxGas = 21000

	// Gas limit of a transaction that creates a contract.
	TxGasContractCreation = 53000

	// Call stipend, minimum gas supplied to a call to ensure that the receiving
	// contract will be able to handle a state-changing call.
	CallStipend = 2300

	// Gas cost of a CALL operation.
	CallGas = 40

	// Gas cost of a CALLCODE operation.
	CallCodeGas = 40

	// Gas cost of a DELEGATECALL operation.
	DelegateCallGas = 40

	// Gas cost of a STATICCALL operation.
	StaticCallGas = 40

	// Gas cost of a SUICIDE operation.
	SuicideGas = 0

	// Gas cost of a SUICIDE operation when it clears the account.
	SuicideRefundGas = 24000

	// Cost of a CREATE operation.
	CreateGas = 32000

	// Cost of an account-creating call.
	CallNewAccountGas = 25000

	// Paid for every transaction that transfers value to a new account.
	CallValueTransferGas = 9000

	// Gas cost of a LOG operation.
	LogGas = 375

	// Gas cost of a LOGx operation with x topics.
	LogTopicGas = 375

	// Gas cost of a LOG operation with specified byte size.
	LogDataGas = 8

	// ...
)
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt's mathematical formula is a slight simplification. The 63/64ths rule applies to the gas *remaining after* the initial costs of the call (base cost, value transfer cost, memory expansion, etc.) have been deducted, not the total available gas.

The `go-ethereum` implementation reveals a more nuanced calculation:

1.  **Calculate `upfront_cost`**: This includes the base cost of the opcode (`CALL`, `CREATE`, etc.), a value-transfer stipend (`CallStipend`), and any gas for memory expansion.
2.  **Calculate `gas_after_upfront`**: This is `available_gas - upfront_cost`.
3.  **Apply 64th rule**: The maximum gas that can be forwarded is `gas_after_upfront - floor(gas_after_upfront / 64)`.
4.  **Determine `gas_to_forward`**: The final forwarded gas is the lesser of the gas requested by the caller and the `max_forwardable_gas` calculated in the previous step.

For a correct implementation, it's critical to deduct the initial operation costs *before* applying the 63/64th rule. Additionally, the `CallStipend` of 2300 gas must be added to the forwarded gas if the call involves a value transfer, which is an important exception to the rule.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the generic CALL operation.
func opCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize *uint64) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, addr, value, inOffset, inSize, retOffset, retSize := stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop()
	// Most common path is no value transfer, so access in-place
	if !value.IsZero() && evm.readOnly {
		return nil, ErrWriteProtection
	}
	// Gas check: check if supplied gas is uint64, if it is higher, use ALL gas.
	// We need to use all of our own gas here since it's not possible to supply
	// so much gas.
	var gasLimit uint64
	if gas.IsUint64() {
		gasLimit = gas.Uint64()
	} else {
		gasLimit = contract.Gas()
	}

	// Apply 63/64 gas rule (EIP-150)
	if evm.chainRules.IsEIP150 {
		availableGas := contract.Gas()
		gasLimit = min(gasLimit, availableGas-availableGas/64)
	}
	// ... (memory expansion and gas cost calculation) ...

	// Get arguments from memory
	args := mem.GetPtr(inOffset.Uint64(), inSize.Uint64())

	// Perform the call
	ret, returnGas, err := evm.Call(contract, common.Address(addr.Bytes20()), args, gasLimit, value)
	if err != nil {
		stack.push(U256(0))
	} else {
		stack.push(U256(1))
	}
	// ... (handle return data) ...
	contract.UseGas(gasLimit - returnGas)
	return nil, nil
}

// opDelegateCall is the DELEGATECALL operation.
func opDelegateCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize *uint64) ([]byte, error) {
	// Pop gas, address, argument offset, argument length, return offset, return length
	gas, addr, inOffset, inSize, retOffset, retSize := stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop()

	// Gas check
	var gasLimit uint64
	if gas.IsUint64() {
		gasLimit = gas.Uint64()
	} else {
		gasLimit = contract.Gas()
	}

	// Apply 63/64 gas rule (EIP-150)
	if evm.chainRules.IsEIP150 {
		availableGas := contract.Gas()
		gasLimit = min(gasLimit, availableGas-availableGas/64)
	}
	// ... (memory expansion and gas cost calculation) ...

	// Get arguments from memory
	args := mem.GetPtr(inOffset.Uint64(), inSize.Uint64())

	// Perform the call
	ret, returnGas, err := evm.DelegateCall(contract, common.Address(addr.Bytes20()), args, gasLimit)
	if err != nil {
		stack.push(U256(0))
	} else {
		stack.push(U256(1))
	}
	// ... (handle return data) ...
	contract.UseGas(gasLimit - returnGas)
	return nil, nil
}

// opStaticCall is the STATICCALL operation.
func opStaticCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize *uint64) ([]byte, error) {
	// Pop gas, address, argument offset, argument length, return offset, return length
	gas, addr, inOffset, inSize, retOffset, retSize := stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop()

	// Gas check
	var gasLimit uint64
	if gas.IsUint64() {
		gasLimit = gas.Uint64()
	} else {
		gasLimit = contract.Gas()
	}

	// Apply 63/64 gas rule (EIP-150)
	if evm.chainRules.IsEIP150 {
		availableGas := contract.Gas()
		gasLimit = min(gasLimit, availableGas-availableGas/64)
	}
	// ... (memory expansion and gas cost calculation) ...

	// Get arguments from memory
	args := mem.GetPtr(inOffset.Uint64(), inSize.Uint64())

	// Perform the call
	ret, returnGas, err := evm.StaticCall(contract, common.Address(addr.Bytes20()), args, gasLimit)
	if err != nil {
		stack.push(U256(0))
	} else {
		stack.push(U256(1))
	}
	// ... (handle return data) ...
	contract.UseGas(gasLimit - returnGas)
	return nil, nil
}


// opCreate is the CREATE operation.
func opCreate(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize *uint64) ([]byte, error) {
	// ... (error checks for write protection and depth) ...

	// Pop value, offset, and size from the stack
	value, offset, size := stack.pop(), stack.pop(), stack.pop()
	
	// ... (memory expansion gas) ...
	
	// Get init code from memory
	code := mem.GetPtr(offset.Uint64(), size.Uint64())

	// Calculate gas for creation
	gas := contract.Gas()
	if evm.chainRules.IsEIP150 {
		gas -= gas / 64
	}

	// Create the contract
	res, address, returnGas, suberr := evm.Create(contract, code, gas, value)
	
	// ... (handle result and stack push) ...
	
	// Consume gas, post-call
	contract.UseGas(gas - returnGas)

	return nil, nil
}


// opCreate2 is the CREATE2 operation.
func opCreate2(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize *uint64) ([]byte, error) {
	// ... (error checks) ...

	// Pop value, offset, size, and salt from the stack
	value, offset, size, salt := stack.pop(), stack.pop(), stack.pop(), stack.pop()
	
	// ... (memory and dynamic gas calculations) ...

	// Get init code from memory
	code := mem.GetPtr(offset.Uint64(), size.Uint64())
	
	// Calculate gas for creation
	gas := contract.Gas()
	if evm.chainRules.IsEIP150 {
		gas -= gas / 64
	}
	
	// Create the contract using CREATE2
	res, address, returnGas, suberr := evm.Create2(contract, code, gas, salt, value)
	
	// ... (handle result and stack push) ...
	
	// Consume gas, post-call
	contract.UseGas(gas - returnGas)
	
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// EIP-150: all but one 64th of the caller's gas is forwarded to the callee.
//
// This method is almost the same as the one above, but it requires that the
// gas is uint64.
func callGas(isEIP150 bool, availableGas, requestedGas uint64) uint64 {
	if isEIP150 {
		gas := availableGas - availableGas/64
		// If the gas is not enough, then the caller cannot afford the call
		// and the call will fail with "out of gas" error.
		// All the gas will be consumed in this case.
		if requestedGas > gas {
			return availableGas
		}
		return requestedGas
	}
	if requestedGas > availableGas {
		return availableGas
	}
	return requestedGas
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call runs the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (depth and value transfer checks) ...

	// Grab the snapshot of the current state.
	snapshot := evm.StateDB.Snapshot()

	p, isPrecompile := evm.precompile(addr)
	if !isPrecompile {
		// Transfer value, and create account if necessary.
		if err := evm.transfer(evm.StateDB, caller.Address(), addr, value, Dump); err != nil {
			return nil, gas, err
		}
		// Create a new contract object for the call, and set the code that is to be
		// executed by the EVM. If the account has no code, we can abort here.
		code := evm.StateDB.GetCode(addr)
		if len(code) == 0 {
			return nil, gas, nil
		}
		// Create a new contract and set the code.
		contract := NewContract(caller, AccountRef(addr), value, gas)
		contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), code)
		// ...
		ret, err = run(evm, contract, input, false)
	} else {
		// Execute the precompiled contract.
		ret, gas, err = RunPrecompiledContract(p, input, gas)
	}
	// ... (handle errors and state revert) ...
	return ret, gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (depth and value transfer checks) ...

	// Create a new account on the state
	contractAddr = crypto.CreateAddress(caller.Address(), evm.StateDB.GetNonce(caller.Address()))
	
	// ... (nonce and collision checks) ...
	
	// Initialise a new contract and set the code that is to be executed by the EVM.
	// The contract is a subsidised account with zero code, zero nonce and zero balance.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	
	// ... (handle pre-shanghai create failure) ...
	
	// Run the body of the contract.
	ret, err = run(evm, contract, code, true)

	// ... (handle deployment, code size checks, and gas cost for code storage) ...

	return ret, contractAddr, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ... other constants ...

	// Gas cost of a CALL operation.
	CallGas uint64 = 40
	// Gas stipend for CALL operations with value transfers.
	CallStipend uint64 = 2300
	// Gas cost of a CALL operation with value transfer.
	CallValueTransferGas uint64 = 9000
	// Gas cost of a CALL operation which creates a new account.
	CallNewAccountGas uint64 = 25000

	// ... other constants ...
)
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides a good overview, but based on the go-ethereum implementation, here are some corrections and improvements:

1.  **Formula Applicability**: The mathematical formula `gas_to_forward = min(requested_gas, available_gas - floor(available_gas / 64))` is accurate for the `CALL`, `CALLCODE`, `DELEGATECALL`, and `STATICCALL` opcodes, where `requested_gas` is an argument taken from the stack. However, for `CREATE` and `CREATE2`, there is no `requested_gas` parameter. Instead, these opcodes forward all available gas, minus the 1/64th retention. The formula for them is simply `gas_to_forward = available_gas - floor(available_gas / 64)`. The implementation requirements should distinguish between these two cases.

2.  **Magic Number `64`**: The `go-ethereum` code hardcodes the number `64` for the gas forwarding rule (e.g., `gas - gas/64`). While this is correct, it's a "magic number". For the Zig implementation, it would be best practice to define a named constant in `/src/evm/constants/gas_constants.zig`, for example:
    ```zig
    /// Denominator for the EIP-150 gas stipend calculation.
    /// At most 63/64 of the remaining gas can be forwarded.
    pub const CallGasStipendDenominator: u64 = 64;
    ```
    This improves readability and maintainability.

3.  **Value Transfer Stipend**: The "call gas management" logic is more complex than just the 63/64th rule. A crucial part, especially for `CALL`, is the `CallStipend` (2300 gas). If a `CALL` operation transfers a non-zero `value`, this stipend is *added* to the forwarded gas *after* the 63/64 calculation. This ensures the recipient has enough gas to execute basic logic even if the caller forwards a small amount. This should be a requirement.

4.  **Hardfork Context**: The 63/64th rule was introduced in **EIP-150 (Tangerine Whistle hardfork)**. The implementation must be conditional on this hardfork being active. The go-ethereum code consistently checks `evm.chainRules.IsEIP150` before applying the rule. The Zig implementation should do the same.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// EIP-150: Gas cost changes for IO-heavy operations.
//
// AllGasCap is the gas cap of the second CALL in the contract of EIP150 test case,
// which is 63/64 of the caller's gas.
AllGasCap uint64 = 64
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// Gas cost of a CALL operation.
func gasCall(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	var (
		gas            = uint64(0)
		gasProvided    = stack.Back(0).Uint64()
		addr           = common.Address(stack.Back(1).Uint256().Bytes20())
		value          = stack.Back(2)
		in_offset_u64  = stack.Back(3).Uint64()
		in_size_u64    = stack.Back(4).Uint64()
		ret_offset_u64 = stack.Back(5).Uint64()
		ret_size_u64   = stack.Back(6).Uint64()
	)
	// EIP150: The gas passed to the callee is reduced by floor(gas/64).
	if evm.chainRules.IsEIP150 {
		gasProvided = availableGas(contract.Gas, gasProvided)
	}

	gas += GasQuickStep // Top-up gas for calculate gas costs
	memoryGas, err := memoryGasCost(mem, in_offset_u64, in_size_u64, ret_offset_u64, ret_size_u64)
	if err != nil {
		return 0, err
	}
	gas += memoryGas

	var snapshot = evm.StateDB.Snapshot()
	if !evm.StateDB.Exist(addr) {
		if !evm.chainRules.IsEIP158 && value.Sign() != 0 {
			gas += params.CallNewAccountGas
		} else if evm.chainRules.IsEIP158 && value.Sign() != 0 && !evm.StateDB.HasSuicided(addr) {
			gas += params.CallNewAccountGas
		}
	}
	if value.Sign() != 0 {
		gas += params.CallValueTransferGas
	}
	evm.StateDB.RevertToSnapshot(snapshot)

	cost, err := istanbulGasCosts(evm, contract, addr, gas)
	if err != nil {
		return 0, err
	}
	return gasProvided + cost, nil
}

// availableGas is the amount of gas still available for a sub-call.
func availableGas(gas, provided uint64) uint64 {
	// eip150: all but one 64th of the caller's gas is passed to the callee.
	//
	// gas is the total gas of the caller, and provided is the gas specified
	// in the CALL instruction.
	//
	// if the caller has gas g, and specifies a call with gas g',
	// the callee is given g_c = min(g', g - g/64).
	//
	// if g - g/64 < g', the specified gas is capped.
	gas -= gas / 64
	if provided > gas {
		return gas
	}
	return provided
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the generic CALL instruction.
func opCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	var (
		gas            = stack.pop()
		addr           = stack.pop().Bytes20()
		value          = stack.pop()
		in_offset_u64  = stack.pop().Uint64()
		in_size_u64    = stack.pop().Uint64()
		ret_offset_u64 = stack.pop().Uint64()
		ret_size_u64   = stack.pop().Uint64()
	)
	in_offset, in_size, ret_offset, ret_size := toMemoryOffsets(in_offset_u64, in_size_u64, ret_offset_u64, ret_size_u64)

	// Get the arguments from memory
	args := mem.GetPtr(int64(in_offset), int64(in_size))

	// Check for depth restrictions
	if evm.depth > int(params.CallCreateDepth) {
		stack.push(zero)
		return nil, nil
	}
	// Make sure the read-only flag is carried over
	readOnly := evm.readOnly
	if !readOnly {
		// EIP-2200, don't allow state modification if gas is too low
		if evm.chainRules.IsIstanbul && contract.Gas < params.SstoreSentryGasEIP2200 {
			// This check is imperfect, because we don't know how much gas will be
			// consumed by the memory expansion. It's possible that we have just
			// enough gas to expand memory, but not enough to make the call.
			// It's also possible that we have enough gas to make the call, but not
			// enough to complete the call, in which case we are not EIP-2200 compliant.
			// This is a known issue, and we have to live with it.
		}
		// For CALL, if value is > 0, and we're not in read-only setting, the
		// evm.readOnly is toggled to false.
		// In read-only, we can't do value transfers, so it's fine.
		if value.Sign() > 0 {
			readOnly = false
		}
	}
	// Gas to be forwarded for the call.
	// Add stipend for value transfer if needed.
	// EIP-150: all but one 64th of the caller's gas is passed to the callee.
	g := gas.Uint64()
	if evm.chainRules.IsEIP150 {
		g = availableGas(contract.Gas, g)
	}
	if value.Sign() > 0 {
		g += params.CallStipend
	}
	// Execute the call
	ret, returnGas, err := evm.Call(contract, addr, args, g, value)
	if err != nil {
		stack.push(zero)
	} else {
		stack.push(one)
	}
	if err == nil || err == vm.ErrExecutionReverted {
		mem.Set(ret_offset, ret_size, ret)
	}
	contract.Gas += returnGas
	return ret, err
}

// opDelegateCall implements the DELEGATECALL opcode.
func opDelegateCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) ([]byte, error) {
	// Pop gas, address, argument offset, argument length, return offset, return length
	var (
		gas            = stack.pop()
		addr           = stack.pop().Bytes20()
		in_offset_u64  = stack.pop().Uint64()
		in_size_u64    = stack.pop().Uint64()
		ret_offset_u64 = stack.pop().Uint64()
		ret_size_u64   = stack.pop().Uint64()
	)
	in_offset, in_size, ret_offset, ret_size := toMemoryOffsets(in_offset_u64, in_size_u64, ret_offset_u64, ret_size_u64)

	// Get the arguments from memory
	args := mem.GetPtr(int64(in_offset), int64(in_size))

	// Check for depth restrictions
	if evm.depth > int(params.CallCreateDepth) {
		stack.push(zero)
		return nil, nil
	}
	// Gas to be forwarded for the call.
	// EIP-150: all but one 64th of the caller's gas is passed to the callee.
	g := gas.Uint64()
	if evm.chainRules.IsEIP150 {
		g = availableGas(contract.Gas, g)
	}
	// Execute the call
	ret, returnGas, err := evm.DelegateCall(contract, addr, args, g)
	if err != nil {
		stack.push(zero)
	} else {
		stack.push(one)
	}
	if err == nil || err == vm.ErrExecutionReverted {
		mem.Set(ret_offset, ret_size, ret)
	}
	contract.Gas += returnGas
	return ret, err
}

// opStaticCall implements the STATICCALL opcode.
func opStaticCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) ([]byte, error) {
	// Pop gas, address, argument offset, argument length, return offset, return length
	var (
		gas            = stack.pop()
		addr           = stack.pop().Bytes20()
		in_offset_u64  = stack.pop().Uint64()
		in_size_u64    = stack.pop().Uint64()
		ret_offset_u64 = stack.pop().Uint64()
		ret_size_u64   = stack.pop().Uint64()
	)
	in_offset, in_size, ret_offset, ret_size := toMemoryOffsets(in_offset_u64, in_size_u64, ret_offset_u64, ret_size_u64)

	// Get the arguments from memory
	args := mem.GetPtr(int64(in_offset), int64(in_size))

	// Check for depth restrictions
	if evm.depth > int(params.CallCreateDepth) {
		stack.push(zero)
		return nil, nil
	}
	// Gas to be forwarded for the call.
	// EIP-150: all but one 64th of the caller's gas is passed to the callee.
	g := gas.Uint64()
	if evm.chainRules.IsEIP150 {
		g = availableGas(contract.Gas, g)
	}
	// Execute the call
	ret, returnGas, err := evm.StaticCall(contract, addr, args, g)
	if err != nil {
		stack.push(zero)
	} else {
		stack.push(one)
	}
	if err == nil || err == vm.ErrExecutionReverted {
		mem.Set(ret_offset, ret_size, ret)
	}
	contract.Gas += returnGas
	return ret, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if value.Sign() != 0 {
		// Redundant check, we can't modify the state in read-only
		if evm.readOnly {
			return nil, common.Address{}, gas, ErrWriteProtection
		}
		if evm.CanTransfer(evm.StateDB, caller.Address(), value) {
			evm.StateDB.Transfer(caller.Address(), contractAddr, value)
		} else {
			return nil, common.Address{}, gas, ErrInsufficientBalance
		}
	}
	// Ensure there's no existing contract already at the designated address
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	// Check whether the created address is colliding
	if codeHash := evm.StateDB.GetCodeHash(contractAddr); codeHash != (common.Hash{}) && codeHash != emptyCodeHash {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// Set the nonce of the new account to 1 (needed for legacy). The EIP
	// that introduced this rule is correct, but the Yellow Paper is not,
	// so we're doing things by the book.
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1)
	}
	// EIP150: The gas passed to the callee is reduced by floor(gas/64).
	if evm.chainRules.IsEIP150 {
		gas -= gas / 64
	}
	// Create a new contract and execute the code.
	contract := NewContract(caller, AccountRef(contractAddr), value, code, gas)
	contract.setCallCode(&contractAddr, crypto.Keccak256Hash(code), code)

	if evm.chainRules.IsEIP3541 {
		if len(code) > 0 && code[0] == 0xEF {
			return nil, contractAddr, gas, ErrInvalidCode
		}
	}
	// The contract's init code is executed with the given gas, and the returned
	// code is checked against the max code size.
	ret, err = run(evm, contract, nil, false)
	if err == nil {
		if len(ret) > params.MaxCodeSize {
			err = ErrMaxCodeSizeExceeded
		} else {
			createDataGas := uint64(len(ret)) * params.CreateDataGas
			if contract.UseGas(createDataGas) {
				evm.StateDB.SetCode(contractAddr, ret)
			} else {
				err = ErrCodeStoreOutOfGas
			}
		}
	}
	// When the account has been created, the err is not errExecutionReverted,
	// the state needs to be rolled back when hitting error in deployment.
	if err != nil && err != ErrExecutionReverted {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrCodeStoreOutOfGas {
			contract.UseGas(contract.Gas)
		}
	}
	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas cost changes for IO-heavy operations.
//
// AllGasCap is the gas cap of the second CALL in the contract of EIP150 test case,
// which is 63/64 of the caller's gas.
AllGasCap uint64 = 64

// CallGas is the gas belonging to the CALL processing.
var CallGas uint64 = 40

// CallStipend is the gas stipend for CALL operations.
var CallStipend uint64 = 2300

// CallValueTransferGas is the gas required for value transfers.
var CallValueTransferGas uint64 = 9000

// CallNewAccountGas is the gas required for new account creations.
var CallNewAccountGas uint64 = 25000
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// callGas returns the actual gas cost of the call.
//
// The cost of gas was changed twice over the course of the fork history.
//
// EIP150:
//   The gas passed to the callee is reduced by floor(gas/64).
//
// EIP2929:
//   When a call is made to an address that is not warm, 2600 gas is charged.
//   An address is warm if it is on the precompile list or in the access list.
func callGas(isEip150 bool, availableGas, providedGas uint64, value *big.Int) (uint64, error) {
	if isEip150 {
		// EIP150: The gas passed to the callee is reduced by floor(gas/64).
		availableGas = availableGas - availableGas/params.AllGasCap
	}
	// Cap the provided gas to the maximum available on the caller.
	gas := min(providedGas, availableGas)

	// If the call has a value, add the stipend.
	// The stipend is only added if the recipient has zero code, but it's
	// easier to add it always and have the callee burn it if it's not needed.
	if value.Sign() > 0 {
		gas += params.CallStipend
	}
	return gas, nil
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt provides a good overview of the 63/64th rule. Here are a few corrections and improvements based on the go-ethereum implementation:

1.  **Stipend for Value Transfers**: A critical detail for `CALL` operations (not applicable to `DELEGATECALL` or `STATICCALL`) is the `CallStipend` (2300 gas). If a call transfers a non-zero value, this stipend is **added** to the gas forwarded to the recipient *after* the 63/64th calculation. This ensures that a recipient contract has enough gas to at least execute some basic logging or logic, even if the forwarded gas is very low.

2.  **Gas Calculation for `CREATE` vs `CALL`**: The gas forwarding logic for `CREATE`/`CREATE2` is simpler than for `CALL`. For creation opcodes, there is no `requested_gas` parameter from the stack. The gas forwarded is simply the remaining available gas after applying the 63/64th rule.

    *   **For `CALL` style opcodes**: `gas_to_forward = min(requested_gas, available_gas - floor(available_gas / 64))`
    *   **For `CREATE` style opcodes**: `gas_to_forward = available_gas - floor(available_gas / 64)`

3.  **The `AllGasCap` Constant**: In go-ethereum, the divisor `64` is defined as a named constant `params.AllGasCap`. It's good practice to define this as a constant, as suggested in `/src/evm/constants/gas_constants.zig`.

4.  **EIP-150 Tangerine Whistle**: The 63/64th rule was introduced in EIP-150. The logic should be placed behind a hardfork check (e.g., `if (chain_rules.IsEIP150)`), as seen in the go-ethereum code. This ensures historical compatibility.

---

<go-ethereum>
<file path="httpshttps://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// callGas returns the actual gas cost of the call.
//
// The cost of gas was changed during the homestead price change HF.
// As part of EIP 150 (TangerineWhistle), the returned gas is gas - base * 63 / 64.
func callGas(isEip150 bool, availableGas, base uint64, callCost *uint256.Int) (uint64, error) {
	if isEip150 {
		availableGas = availableGas - base
		gas := availableGas - availableGas/64
		// If the bit length exceeds 64 bit we know that the newly calculated "gas" for EIP150
		// is smaller than the requested amount. Therefore we return the new gas instead
		// of returning an error.
		if !callCost.IsUint64() || gas < callCost.Uint64() {
			return gas, nil
		}
	}
	if !callCost.IsUint64() {
		return 0, ErrGasUintOverflow
	}

	return callCost.Uint64(), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
func gasCall(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	var (
		gas            uint64
		transfersValue = !stack.Back(2).IsZero()
		address        = common.Address(stack.Back(1).Bytes20())
	)
	if evm.chainRules.IsEIP158 {
		if transfersValue && evm.StateDB.Empty(address) {
			gas += params.CallNewAccountGas
		}
	} else if !evm.StateDB.Exist(address) {
		gas += params.CallNewAccountGas
	}
	if transfersValue {
		gas += params.CallValueTransferGas
	}
	memoryGas, err := memoryGasCost(mem, memorySize)
	if err != nil {
		return 0, err
	}
	var overflow bool
	if gas, overflow = math.SafeAdd(gas, memoryGas); overflow {
		return 0, ErrGasUintOverflow
	}

	evm.callGasTemp, err = callGas(evm.chainRules.IsEIP150, contract.Gas, gas, stack.Back(0))
	if err != nil {
		return 0, err
	}
	if gas, overflow = math.SafeAdd(gas, evm.callGasTemp); overflow {
		return 0, ErrGasUintOverflow
	}

	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opCall(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	stack := scope.Stack
	// Pop gas. The actual gas in interpreter.evm.callGasTemp.
	// We can use this as a temporary value
	temp := stack.pop()
	gas := interpreter.evm.callGasTemp
	// Pop other call parameters.
	addr, value, inOffset, inSize, retOffset, retSize := stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop()
	toAddr := common.Address(addr.Bytes20())
	// Get the arguments from the memory.
	args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	if interpreter.readOnly && !value.IsZero() {
		return nil, ErrWriteProtection
	}
	if !value.IsZero() {
		gas += params.CallStipend
	}
	ret, returnGas, err := interpreter.evm.Call(scope.Contract.Address(), toAddr, args, gas, &value)

	if err != nil {
		temp.Clear()
	} else {
		temp.SetOne()
	}
	stack.push(&temp)
	if err == nil || err == ErrExecutionReverted {
		scope.Memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}

	scope.Contract.RefundGas(returnGas, interpreter.evm.Config.Tracer, tracing.GasChangeCallLeftOverRefunded)

	interpreter.returnData = ret
	return ret, nil
}

func opCreate(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.readOnly {
		return nil, ErrWriteProtection
	}
	var (
		value        = scope.Stack.pop()
		offset, size = scope.Stack.pop(), scope.Stack.pop()
		input        = scope.Memory.GetCopy(offset.Uint64(), size.Uint64())
		gas          = scope.Contract.Gas
	)
	if interpreter.evm.chainRules.IsEIP150 {
		gas -= gas / 64
	}

	// reuse size int for stackvalue
	stackvalue := size

	scope.Contract.UseGas(gas, interpreter.evm.Config.Tracer, tracing.GasChangeCallContractCreation)

	res, addr, returnGas, suberr := interpreter.evm.Create(scope.Contract.Address(), input, gas, &value)
	// Push item on the stack based on the returned error. If the ruleset is
	// homestead we must check for CodeStoreOutOfGasError (homestead only
	// rule) and treat as an error, if the ruleset is frontier we must
	// ignore this error and pretend the operation was successful.
	if interpreter.evm.chainRules.IsHomestead && suberr == ErrCodeStoreOutOfGas {
		stackvalue.Clear()
	} else if suberr != nil && suberr != ErrCodeStoreOutOfGas {
		stackvalue.Clear()
	} else {
		stackvalue.SetBytes(addr.Bytes())
	}
	scope.Stack.push(&stackvalue)

	scope.Contract.RefundGas(returnGas, interpreter.evm.Config.Tracer, tracing.GasChangeCallLeftOverRefunded)

	if suberr == ErrExecutionReverted {
		interpreter.returnData = res // set REVERT data to return data buffer
		return res, nil
	}
	interpreter.returnData = nil // clear dirty return data buffer
	return nil, nil
}

func opCreate2(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.readOnly {
		return nil, ErrWriteProtection
	}
	var (
		endowment    = scope.Stack.pop()
		offset, size = scope.Stack.pop(), scope.Stack.pop()
		salt         = scope.Stack.pop()
		input        = scope.Memory.GetCopy(offset.Uint64(), size.Uint64())
		gas          = scope.Contract.Gas
	)

	// Apply EIP150
	gas -= gas / 64
	scope.Contract.UseGas(gas, interpreter.evm.Config.Tracer, tracing.GasChangeCallContractCreation2)
	// reuse size int for stackvalue
	stackvalue := size
	res, addr, returnGas, suberr := interpreter.evm.Create2(scope.Contract.Address(), input, gas,
		&endowment, &salt)
	// Push item on the stack based on the returned error.
	if suberr != nil {
		stackvalue.Clear()
	} else {
		stackvalue.SetBytes(addr.Bytes())
	}
	scope.Stack.push(&stackvalue)
	scope.Contract.RefundGas(returnGas, interpreter.evm.Config.Tracer, tracing.GasChangeCallLeftOverRefunded)

	if suberr == ErrExecutionReverted {
		interpreter.returnData = res // set REVERT data to return data buffer
		return res, nil
	}
	interpreter.returnData = nil // clear dirty return data buffer
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takse
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (captureBegin hook)
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	if !value.IsZero() && !evm.Context.CanTransfer(evm.StateDB, caller, value) {
		return nil, gas, ErrInsufficientBalance
	}
	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	// ... (account creation logic for non-existent accounts)

	evm.Context.Transfer(evm.StateDB, caller, addr, value)

	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas, evm.Config.Tracer)
	} else {
		// Initialise a new contract and set the code that is to be used by the EVM.
		code := evm.resolveCode(addr)
		if len(code) == 0 {
			ret, err = nil, nil // gas is unchanged
		} else {
			// The contract is a scoped environment for this execution context only.
			contract := NewContract(caller, addr, value, gas, evm.jumpDests)
			contract.IsSystemCall = isSystemCall(caller)
			contract.SetCallCode(evm.resolveCodeHash(addr), code)
			ret, err = evm.interpreter.Run(contract, input, false)
			gas = contract.Gas
		}
	}
	// ... (revert logic)
	return ret, gas, err
}

// create creates a new contract using code as deployment code.
func (evm *EVM) create(caller common.Address, code []byte, gas uint64, value *uint256.Int, address common.Address, typ OpCode) (ret []byte, createAddress common.Address, leftOverGas uint64, err error) {
	// ... (depth and balance checks)
	
	// ... (address collision checks)

	snapshot := evm.StateDB.Snapshot()
	if !evm.StateDB.Exist(address) {
		evm.StateDB.CreateAccount(address)
	}
	evm.StateDB.CreateContract(address)
	
	// ...
	
	evm.Context.Transfer(evm.StateDB, caller, address, value)

	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	contract := NewContract(caller, address, value, gas, evm.jumpDests)

	// Explicitly set the code to a null hash to prevent caching of jump analysis
	// for the initialization code.
	contract.SetCallCode(common.Hash{}, code)
	contract.IsDeployment = true

	ret, err = evm.initNewContract(contract, address)
	if err != nil && (evm.chainRules.IsHomestead || err != ErrCodeStoreOutOfGas) {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			contract.UseGas(contract.Gas, evm.Config.Tracer, tracing.GasChangeCallFailedExecution)
		}
	}
	return ret, address, contract.Gas, err
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt's formula for gas forwarding is a bit of a simplification.

**Original Formula:**
`gas_to_forward = min(requested_gas, available_gas - floor(available_gas / 64))`

**Correction:**
The 63/64th rule applies to the gas *remaining after* the upfront costs of the call operation (e.g., memory expansion, warming addresses, value transfer cost) have been deducted. The `go-ethereum` implementation makes this clear.

**Corrected Formula:**
1.  `upfront_cost = memory_cost + access_cost + value_transfer_cost + ...`
2.  `gas_after_upfront = available_gas - upfront_cost`
3.  `max_forwardable = gas_after_upfront - floor(gas_after_upfront / 64)`
4.  `gas_to_forward = min(requested_gas, max_forwardable)`

**Additional Nuance for CREATE/CREATE2:**
The prompt groups all call-like opcodes together. However, `CREATE` and `CREATE2` behave differently. They do not take a `gas` parameter from the stack. Instead, they forward almost all remaining gas after their own upfront costs have been deducted, following the 63/64th rule on the remaining amount.

- **`CALL` / `CALLCODE` / `DELEGATECALL` / `STATICCALL`**: Forward `min(requested_gas, max_forwardable)`.
- **`CREATE` / `CREATE2`**: Forward `remaining_gas - floor(remaining_gas / 64)`.

This distinction is important for a correct implementation.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/protocol_params.go">
```go
// Gas cost of a CALL when transferring value.
const CallValueTransferGas = 9000

// Gas cost of a CALL when a new account is created.
const CallNewAccountGas = 25000

// Gas stipend for CALL when transferring value.
const CallStipend = 2300
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/gas.go">
```go
// callGas returns the actual gas cost of a call.
//
// The cost of gas was changed during the homestead price change.
// See EIP-150 for more information.
func callGas(rules *params.Rules, available, requested, callCost uint64) (uint64, error) {
	if rules.IsEIP150 {
		// EIP-150: The gas passed to the callee is G - G/64.
		available = available - callCost
		gas := available - available/64
		// If the requested gas is greater than the amount of gas that is available
		// the call takes all available gas.
		if requested > gas {
			return gas, nil
		}
		return requested, nil
	}
	if available < callCost+requested {
		return 0, ErrOutOfGas
	}
	return requested, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/instructions.go">
```go
// makeCall is a helper function for the CALL-like opcodes.
// It returns a function closure which can be used by the EVM interpreter.
func makeCall(isCallCode, isDelegateCall, isStaticCall bool) executionFunc {
	return func(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
		// Pop gas, address, value, in offset, in size, out offset, out size.
		var (
			gas                  = interpreter.stack.pop()
			addr                 = interpreter.stack.pop()
			value, inOffset, inSize, outOffset, outSize stackElem
		)
		if isDelegateCall {
			inOffset, inSize, outOffset, outSize = interpreter.stack.popN(4)
		} else {
			value, inOffset, inSize, outOffset, outSize = interpreter.stack.popN(5)
		}
		// Ensure the call is not static if value is transferred.
		if scope.Contract.Static && value.Sign() > 0 {
			return nil, ErrWriteProtection
		}
		// Get memory and range check.
		// The call will be a no-op if the memory is not accessible
		// and return an error.
		var (
			input    []byte
			err      error
			gasLimit uint64 = math.MaxUint64
		)
		if interpreter.evm.Config.RespectCreateMemoryLimit() && scope.Memory.Len() > interpreter.evm.Config.CreateMemoryLimit {
			return nil, ErrMemoryLimit
		}
		if inSize.IsUint64() && inSize.Uint64() > 0 {
			input, err = scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())
			if err != nil {
				return nil, err
			}
		}
		// Establish a new contract and set the an appropriate gas limit for it.
		var (
			address    = common.Address(addr.Bytes20())
			isTransfer = value.Sign() > 0
			callCost   = uint64(0)
			stipend    = uint64(0)
		)
		// Calculate the call cost, this is needed for the gas forwarding,
		// and will also be used later for gas charging.
		if gas.IsUint64() {
			gasLimit = gas.Uint64()
		}
		var (
			precompiles    = interpreter.genPrecompiles()
			isPrecompile   = precompiles.IsPrecompile(address)
			found, iswarm  = interpreter.evm.StateDB.AddressInAccessList(address)
			create, iscold = !interpreter.evm.StateDB.Exist(address), true
		)
		if !isPrecompile {
			callCost, err = callCost(interpreter.evm.chainRules, found, iswarm, create, isTransfer)
			if err != nil {
				return nil, err
			}
		}
		if isTransfer {
			stipend = params.CallStipend
		}
		// EIP-150: The gas passed to the callee is G - G/64.
		callGas, err := callGas(interpreter.evm.chainRules, scope.Gas, gasLimit+stipend, callCost)
		if err != nil {
			return nil, err
		}
		gas.SetUint64(callGas)

		// Create the new state scope for the child call.
		var (
			ret        []byte
			returnGas  uint64
			vmerr      error
			contract   = scope.Contract
			from       = scope.Contract.Address()
			readOnly   = scope.Contract.Static || isStaticCall
			callTarget *Contract
		)
		if isCallCode {
			callTarget = NewContract(scope.Contract.Caller(), contract, value.ToBig(), gas.Uint64())
			// This is not allowed in static context, but it does not matter because
			// the value is 0. So we can elide this check.
		} else if isDelegateCall {
			callTarget = NewContract(scope.Contract.Caller(), NewAddress(from, address), value.ToBig(), gas.Uint64())
			callTarget.CallerAddress = scope.Contract.CallerAddress
			callTarget.Value = scope.Contract.Value
		} else {
			callTarget = NewContract(from, address, value.ToBig(), gas.Uint64())
		}
		// Execute the call
		if isPrecompile {
			ret, returnGas, vmerr = interpreter.evm.CallPrecompile(callTarget, input, gas.Uint64())
		} else {
			ret, returnGas, vmerr = interpreter.evm.Call(callTarget, input, gas.Uint64(), readOnly)
		}
		if vmerr != nil {
			if vmerr == ErrExecutionReverted {
				interpreter.stack.push(gas.SetUint64(0)) // failure
			} else {
				// Any other error, wemette need to distinguish between them
				// But for now, we push 0 for all of them
				interpreter.stack.push(gas.SetUint64(0))
			}
		} else {
			interpreter.stack.push(gas.SetUint64(1)) // success
		}
		scope.Gas -= (gas.Uint64() - returnGas)

		// The returned data is capped by the memory limit.
		if outSize := outSize.Uint64(); outSize > 0 {
			if mlen := scope.Memory.Len(); outOffset.Uint64() > mlen {
				if err := scope.Memory.Resize(outOffset.Uint64() + outSize); err != nil {
					return nil, err
				}
			}
			copy(scope.Memory.Data()[outOffset.Uint64():], ret)
		}
		scope.Contract.ReturnData = ret
		return nil, nil
	}
}

// opCreate is the EVM CREATE opcode implementation.
func opCreate(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	// Pop value, offset and size from the stack.
	var (
		value, offset, size = interpreter.stack.popN(3)
		gas                 = interpreter.gas
	)
	// Check whether the call is static. If so, deny state changing operations.
	if scope.Contract.Static {
		return nil, ErrWriteProtection
	}
	// Check whether the depth of the call stack has exceeded the limit.
	if interpreter.evm.depth >= int(params.CallCreateDepth) {
		interpreter.stack.push(gas.SetUint64(0))
		return nil, nil
	}
	// Consume the gas which is required for memory expansion.
	mem, err := scope.Memory.GetPtr(offset.Uint64(), size.Uint64())
	if err != nil {
		return nil, err
	}
	// Deduct the cost of memory expansion.
	gas -= uint64(len(mem) - scope.Memory.Len())
	// EIP-3860: initcode cost, 2 gas per 32-byte word.
	// This was previously done in `evm.Create` but has been moved here
	// to allow for JUMPDEST-analysis to be performed before this check.
	if interpreter.evm.chainRules.IsShanghai {
		if err := initCodeGas(size.Uint64()); err != nil {
			return nil, err
		}
		var overflow bool
		// gas = gas - (size.Uint64()+31)/32*params.InitCodeGas
		words := (size.Uint64() + 31) / 32
		gas, overflow = bits.Sub64(gas, words*params.InitCodeGas)
		if overflow {
			return nil, ErrOutOfGas
		}
	}
	// EIP-150: The gas passed to the callee is G - G/64.
	gas = gas - gas/64

	// Create a new contract.
	contract, returnGas, err := interpreter.evm.Create(scope.Contract, mem, gas, value.ToBig())
	if err != nil {
		// In case of any error, we need to push 0 to stack.
		interpreter.stack.push(new(uint256.Int))
		return nil, err
	}
	gas = returnGas

	if contract.Address != (common.Address{}) {
		interpreter.stack.push(new(uint256.Int).SetBytes(contract.Address.Bytes()))
	} else {
		interpreter.stack.push(new(uint256.Int))
	}
	scope.Gas = gas
	return nil, nil
}

// opCreate2 is the EVM CREATE2 opcode implementation.
func opCreate2(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	// Pop value, offset, size, salt from the stack.
	var (
		endowment, offset, size, salt = interpreter.stack.popN(4)
		gas                           = interpreter.gas
	)
	// Check whether the call is static. If so, deny state changing operations.
	if scope.Contract.Static {
		return nil, ErrWriteProtection
	}
	// Check whether the depth of the call stack has exceeded the limit.
	if interpreter.evm.depth >= int(params.CallCreateDepth) {
		interpreter.stack.push(new(uint256.Int))
		return nil, nil
	}
	// Consume the gas which is required for memory expansion.
	mem, err := scope.Memory.GetPtr(offset.Uint64(), size.Uint64())
	if err != nil {
		return nil, err
	}
	// Deduct the cost of memory expansion.
	gas -= uint64(len(mem) - scope.Memory.Len())

	// EIP-3860: initcode cost, 2 gas per 32-byte word.
	// This was previously done in `evm.Create2` but has been moved here
	// to allow for JUMPDEST-analysis to be performed before this check.
	if interpreter.evm.chainRules.IsShanghai {
		if err := initCodeGas(size.Uint64()); err != nil {
			return nil, err
		}
		var overflow bool
		// gas = gas - (size.Uint64()+31)/32*params.InitCodeGas
		words := (size.Uint64() + 31) / 32
		gas, overflow = bits.Sub64(gas, words*params.InitCodeGas)
		if overflow {
			return nil, ErrOutOfGas
		}
	}
	// Consume the gas which is required for hashing the init code.
	var overflow bool
	gas, overflow = bits.Sub64(gas, wordsForGethHash(size.Uint64())*params.Keccak256WordGas)
	if overflow {
		return nil, ErrOutOfGas
	}
	// EIP-150: The gas passed to the callee is G - G/64.
	gas = gas - gas/64

	// Create a new contract.
	contract, returnGas, err := interpreter.evm.Create2(scope.Contract, mem, gas, endowment.ToBig(), salt.Bytes32())
	if err != nil {
		interpreter.stack.push(new(uint256.Int))
		return nil, err
	}
	gas = returnGas

	if contract.Address != (common.Address{}) {
		interpreter.stack.push(new(uint256.Int).SetBytes(contract.Address.Bytes()))
	} else {
		interpreter.stack.push(new(uint256.Int))
	}
	scope.Gas = gas
	return nil, nil
}
```
</go-ethereum>

## Prompt Corrections
The original prompt's mathematical formula for gas forwarding is a good simplification, but it misses a key detail from EIP-150: the `CallStipend`.

### `CallStipend` for Value Transfers
- **What it is**: A gas stipend of 2300 is given to a contract if the call transfers a non-zero ETH value.
- **Why it matters**: It ensures that a recipient contract has enough gas to execute at least basic logging or other minimal operations even if the caller forwards very little gas.
- **How it's applied**: The `CallStipend` is *added* to the gas being forwarded to the callee, but the total is still capped by the 63/64ths rule.

### Corrected Gas Forwarding Logic
A more precise flow for calculating the gas forwarded to a subcall (`gas_to_forward`) is:

1.  **Calculate base cost**: `base_cost` = cost of memory expansion + cost of account access (cold/warm) + cost for value transfer + etc.
2.  **Calculate available gas for subcall**: `available_for_subcall = current_gas - base_cost`.
3.  **Apply 63/64 rule**: `max_forwardable = available_for_subcall - floor(available_for_subcall / 64)`.
4.  **Determine requested gas with stipend**:
    *   `stipend = (value > 0) ? 2300 : 0`
    *   `requested_with_stipend = requested_gas_from_stack + stipend`
5.  **Final calculation**: `gas_to_forward = min(requested_with_stipend, max_forwardable)`.

The `go-ethereum/core/vm/instructions.go` file, particularly the `makeCall` and `callGas` functions, shows this interaction clearly. For `CREATE` and `CREATE2`, the stipend is not applied, but the 63/64 rule is still used on the remaining gas.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run runs the given contract's code with the given input data and returns the
// return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered deterministic, meaning that no error should be returned which is not
// guaranteed to be present on all nodes executing the exact same code and block.
// For example, memory allocation errors should not be returned.
//
// The interpreter will also return the amount of gas remaining, which is unused
// gas that should be refunded to the caller.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	for {
		// ...
		op := contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		// ...
		switch op {
		// ...
		case CALL:
			// ..., gas, addr, value, in, insize, out, outsize := stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop()
			stack.require(7)
			gas, addr, value, in, insize, out, outsize := stack.popN(7)

			toAddr := common.Address(addr.Bytes20())
			args := memory.GetPtr(in.Uint64(), insize.Uint64())

			// EIP150: cap gas to all but 1/64 of the remaining gas
			var (
				cost         uint64
				stipend      = params.CallStipend
				callGas, err = in.callGas(value, gas.Uint64(), contract.Gas)
			)
			if err != nil {
				return nil, err
			}
			cost += callGas

			// Transfer value if non-zero, still do it even if callGas is zero
			if value.Sign() > 0 {
				if in.evm.chainRules.IsEIP2315 {
					// Hot-load account, but don't charge gas for it. It's covered by the call cost.
					in.evm.StateDB.GetBalance(toAddr)
				}
				cost += params.CallValueTransferGas
			}
			ret, returnGas, err := in.evm.Call(contract, toAddr, args, callGas-stipend, value)
			if err != nil {
				return nil, err
			}
			gas.SetUint64(returnGas + stipend)
			stack.push(gas)
			if err == nil {
				stack.push(in.bigTrue)
			} else {
				stack.push(in.bigFalse)
			}
			// ...
		case CALLCODE:
			// ... similar logic, also uses callGas ...
		case DELEGATECALL:
			// ...
			gas, toAddress, inOffset, inSize, _, _ := stack.popN(6)
			// ...
			// EIP150: cap gas to all but 1/64 of the remaining gas.
			callGas, err := in.callGas(common.Big0, gas.Uint64(), contract.Gas)
			// ...
			ret, returnGas, err := in.evm.DelegateCall(contract, toAddr, args, callGas)
			// ...
		case STATICCALL:
			// ...
			gas, toAddress, inOffset, inSize, _, _ := stack.popN(6)
			// ...
			// EIP150: cap gas to all but 1/64 of the remaining gas.
			callGas, err := in.callGas(common.Big0, gas.Uint64(), contract.Gas)
			// ...
			ret, returnGas, err := in.evm.StaticCall(contract, toAddr, args, callGas)
			// ...
		case CREATE:
			// ...
			// EIP150: cap gas to all but 1/64 of the remaining gas
			gas := interpreter.evm.Gas()
			gas = gas - gas/64

			res, addr, returnGas, err := interpreter.evm.Create(contract, code, gas, value)
			// ...
		case CREATE2:
			// ...
			// EIP150: cap gas to all but 1/64 of the remaining gas
			gas := interpreter.evm.Gas()
			gas = gas - gas/64

			res, addr, returnGas, err := interpreter.evm.Create2(contract, code, gas, endowment, salt)
			// ...
		// ...
		}
	}
}

// callGas checks the availability of gas and calculates the amount of gas available for the sub call.
func (in *Interpreter) callGas(value *uint256.Int, requested, available uint64) (uint64, error) {
	if !in.evm.IsEIP150() {
		if available < requested {
			return 0, ErrOutOfGas
		}
		return requested, nil
	}
	// EIP150: The gas passed to the callee is the requested value,
	// which is all-but-one-64th of the remaining gas.
	gas := available - available/64
	if requested > gas {
		requested = gas
	}

	// The call is given a stipend of 2300 gas if it is a value-transfer call.
	// This is a 'free' gift of gas from the call, which is not paid for by the caller.
	// This is also the case for CALLCODE.
	if value.Sign() > 0 {
		requested += params.CallStipend
	}
	// Check that the caller has enough gas to send the stipend, and if not,
	// all gas is consumed.
	if available < requested {
		return 0, ErrOutOfGas
	}
	return requested, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ...
	CallValueTransferGas  uint64 = 9000  // Paid for CALL when the value transfer is non-zero.
	CallNewAccountGas     uint64 = 25000 // Paid for CALL when the destination address didn't exist prior.
	// ...
	CallStipend           uint64 = 2300  // Free gas given at beginning of call.
	// ...
	CreateGas             uint64 = 32000 // Once per CREATE operation & contract-creation transaction.
	Create2Gas            uint64 = 32000 // Once per CREATE2 operation
	// ...
	// These have been changed during the course of the chain
	CallGasFrontier              uint64 = 40  // Once per CALL operation & message call transaction.
	CallGasEIP150                uint64 = 700 // Static portion of gas for CALL-derivates after EIP 150 (Tangerine)
	// ...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// IsEIP150 returns whether num is either equal to the EIP150 fork block or greater.
func (c *ChainConfig) IsEIP150(num *big.Int) bool {
	return isBlockForked(c.EIP150Block, num)
}

// isBlockForked returns whether a fork scheduled at block s is active at the
// given head block. Whilst this method is the same as isTimestampForked, they
// are explicitly separate for clearer reading.
func isBlockForked(s, head *big.Int) bool {
	if s == nil || head == nil {
		return false
	}
	return s.Cmp(head) <= 0
}

// ...

// MainnetChainConfig is the chain parameters to run a node on the main network.
var MainnetChainConfig = &ChainConfig{
	ChainID:                 big.NewInt(1),
	HomesteadBlock:          big.NewInt(1_150_000),
	DAOForkBlock:            big.NewInt(1_920_000),
	DAOForkSupport:          true,
	EIP150Block:             big.NewInt(2_463_000),
	EIP155Block:             big.NewInt(2_675_000),
	EIP158Block:             big.NewInt(2_675_000),
	ByzantiumBlock:          big.NewInt(4_370_000),
	ConstantinopleBlock:     big.NewInt(7_280_000),
	PetersburgBlock:         big.NewInt(7_280_000),
	IstanbulBlock:           big.NewInt(9_069_000),
	MuirGlacierBlock:        big.NewInt(9_200_000),
	BerlinBlock:             big.NewInt(12_244_000),
	LondonBlock:             big.NewInt(12_965_000),
	ArrowGlacierBlock:       big.NewInt(13_773_000),
	GrayGlacierBlock:        big.NewInt(15_050_000),
	TerminalTotalDifficulty: MainnetTerminalTotalDifficulty, // 58_750_000_000_000_000_000_000
	ShanghaiTime:            newUint64(1681338455),
	CancunTime:              newUint64(1710338135),
	PragueTime:              newUint64(1746612311),
	DepositContractAddress:  common.HexToAddress("0x00000000219ab540356cbb839cbe05303d7705fa"),
	Ethash:                  new(EthashConfig),
	BlobScheduleConfig: &BlobScheduleConfig{
		Cancun: DefaultCancunBlobConfig,
		Prague: DefaultPragueBlobConfig,
	},
}
```
</file>
</go-ethereum>

## Prompt Corrections
The mathematical formula provided in the prompt is a slight simplification. The `available_gas` in the formula is not the total gas remaining in the caller's context but rather the gas remaining *after* deducting the upfront costs of the call operation itself (e.g., base fee, memory expansion costs, value transfer costs).

A more accurate sequence of calculations for `CALL` operations, as seen in `go-ethereum`, is:

1.  **Calculate Upfront Cost**:
    `upfront_cost = base_call_cost + memory_expansion_cost + value_transfer_cost + ...`
2.  **Determine Gas Available for Forwarding**:
    `gas_available_to_forward = caller_gas_remaining - upfront_cost`
3.  **Apply 63/64 Rule**:
    `gas_cap = gas_available_to_forward - floor(gas_available_to_forward / 64)`
4.  **Determine Gas to Forward (Pre-Stipend)**:
    `gas_to_forward = min(requested_gas_from_stack, gas_cap)`
5.  **Add Stipend (for value transfers)**:
    If value > 0, the final gas forwarded to the callee includes a 2300 gas stipend:
    `final_gas_for_callee = gas_to_forward + CallStipend`

For `CREATE` and `CREATE2`, which do not take a `gas` parameter from the stack, the logic is simpler: they forward all but 1/64th of the remaining gas after the upfront costs are paid.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// opCall is the EVM opcode handler for the CALL instruction.
func opCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, a *uint256.Int) ([]byte, error) {
	// Pop gas, address, value, args offset, args size, ret offset, ret size
	gas, to, value, inoffset, insize, retoffset, retsize := stack.Pop7()

	// Check for memory expansion
	memorySize, err := memorySize(mem, inoffset, insize)
	if err != nil {
		return nil, err
	}
	memorySize, err = memorySize(mem, retoffset, retsize)
	if err != nil {
		return nil, err
	}
	// Calculate the gas cost of the call.
	gasCost, err := gasCall(evm.chainConfig, evm, contract, stack, mem, memorySize)
	if err != nil {
		return nil, err
	}
	// EIP-150: Ensure that the called gas is not too high
	availableGas := contract.Gas()
	if err := contract.UseGas(gasCost); err != nil {
		return nil, err
	}
	availableGas -= gasCost

	// The amount of gas to be passed to the callee. EIP-150 states that up to
	// 63/64 of the remaining gas can be passed.
	if evm.chainConfig.IsEIP150(evm.BlockNumber) {
		gas64 := availableGas / 64
		if gas.Uint64() > availableGas-gas64 {
			gas.SetUint64(availableGas - gas64)
		}
	} else {
		if gas.Uint64() > availableGas {
			gas.SetUint64(availableGas)
		}
	}
	// Take stipend for value transfer, if any.
	// EIP-2315: The stipend is only sent if the call depth is not at the maximum.
	if value.Sign() > 0 && evm.depth < 1024 {
		gas.Add(gas, uint256.NewInt(params.CallStipend))
	}
	// Execute the call
	toAddr := to.Address()
	in, _ := mem.GetPtr(inoffset.Uint64(), insize.Uint64()) // Get without causing memory expansion
	ret, returnGas, err := evm.Call(contract, toAddr, in, gas.Uint64(), value)

	// handle the returned data
	if err == nil {
		stack.Push(uint256.NewInt(1))
	} else {
		stack.Push(uint256.NewInt(0))
	}
	mem.Set(retoffset.Uint64(), retsize.Uint64(), ret)
	evm.interpreter.returnData = ret

	contract.Gas += returnGas

	return nil, nil
}

// opCreate is the EVM opcode handler for the CREATE instruction.
func opCreate(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, a *uint256.Int) ([]byte, error) {
	// Pop value, offset, size
	value, offset, size := stack.Pop3()

	// check for memory expansion
	memorySize, err := memorySize(mem, offset, size)
	if err != nil {
		return nil, err
	}
	gasCost, err := gasCreate(mem, memorySize)
	if err != nil {
		return nil, err
	}
	if err := contract.UseGas(gasCost); err != nil {
		return nil, err
	}
	// The new address is a function of the sender's address and nonce.
	code, _ := mem.GetPtr(offset.Uint64(), size.Uint64())
	gas := uint256.NewInt(contract.Gas)
	// EIP-150: The gas passed to the creation function is also reduced by a 64th.
	if evm.chainConfig.IsEIP150(evm.BlockNumber) {
		gas.SetUint64(contract.Gas - contract.Gas/64)
	}
	// Actual gas used by the contract creation, including the stored code.
	contract.UseGas(gas.Uint64())

	// Execute the create operation
	addr, _, returnGas, err := evm.Create(contract, code, gas.Uint64(), value)
	// The returned gas is added to the caller's gas pool
	contract.Gas += returnGas
	if err != nil {
		stack.Push(uint256.NewInt(0))
	} else {
		stack.Push(uint256.NewInt(0).SetBytes(addr.Bytes()))
	}
	// The return data of a create is empty and not set
	return nil, nil
}

// opDelegateCall is the EVM opcode handler for the DELEGATECALL instruction.
func opDelegateCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, a *uint256.Int) ([]byte, error) {
	// Pop gas, address, args offset, args size, ret offset, ret size
	gas, to, inoffset, insize, retoffset, retsize := stack.Pop6()

	// ... [memory expansion and intrinsic gas calculation similar to opCall] ...
	
	// The amount of gas to be passed to the callee. EIP-150 states that up to
	// 63/64 of the remaining gas can be passed.
	availableGas := contract.Gas()
	// ... (calculate gasCost for memory, etc.) ...
	availableGas -= gasCost
	
	if evm.chainConfig.IsEIP150(evm.BlockNumber) {
		gas64 := availableGas / 64
		if gas.Uint64() > availableGas-gas64 {
			gas.SetUint64(availableGas - gas64)
		}
	} else {
		if gas.Uint64() > availableGas {
			gas.SetUint64(availableGas)
		}
	}
	// Execute the delegate call
	toAddr := to.Address()
	in, _ := mem.GetPtr(inoffset.Uint64(), insize.Uint64())
	ret, returnGas, err := evm.DelegateCall(contract, toAddr, in, gas.Uint64())

	// ... [handle return data and push to stack similar to opCall] ...
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// gasCall calculates the gas requirement for a CALL-like opcode.
//
// The cost of gas was changed during the homestead price change and EIP-150.
//
// Old gas cost:
//   callGas = GasCall + codeGas
//
// New gas cost:
//   callGas = GasCall + codeGas + memoryGas
//   codeGas = IsAccountEmpty(address) * GasCallNewAccount + GasCallStipend (if value > 0)
//
// memoryGas is the gas cost to expand the memory to accommodate the return message.
//
func gasCall(config *params.ChainConfig, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// Pop gas, address, value from the stack.
	var (
		gas      = stack.Back(0)
		to       = stack.Back(1).Address()
		value    = stack.Back(2)
		cost     uint64
		err      error
	)
	// EIP-150 and Tangerine Whistle are active at the same time.
	isEIP150 := config.IsEIP150(evm.BlockNumber)
	if isEIP150 {
		cost, err = memory.GasCost(memorySize)
		if err != nil {
			return 0, err
		}
	}
	// In homestead, the CALL cost is calculated with the given gas setting. But in
	// EIP150, the gas is deducted using the 63/64 rule and the cost of call is based
	// on the actual gas forwarded.
	var (
		gasval = gas.Uint64()
		inner  = gas.Uint64()
	)
	if isEIP150 {
		availableGas := contract.Gas() - cost
		gas64 := availableGas / 64
		if gasval > availableGas-gas64 {
			inner = availableGas - gas64
		}
	}

	if config.IsEIP2929(evm.BlockNumber) {
		// Explicitly added to the access list.
		evm.StateDB.AddAddressToAccessList(to)
		slotCost, _ := evm.StateDB.AddressInAccessList(to)
		if !slotCost {
			cost += params.ColdAccountAccessCost
		}
	}
	if value.Sign() != 0 {
		cost += params.CallValueTransferGas
		if !evm.StateDB.Exist(to) {
			cost += params.CallNewAccountGas
		}
	}
	return cost, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas costs
const (
    // ...
	GasCallStipend uint64 = 2300 // A stipend for call when no value transfer occurs
    // ...
)

// EIP-150 specific values
const (
    CallValueTransferGas   uint64 = 9000  // Paid for CALL when the value transfer is non-zero
    CallNewAccountGas      uint64 = 25000 // Paid for CALL when the destination address didn't exist prior
)

// EIP-2929 specific values
const (
	ColdSloadCost         = 2100
	ColdAccountAccessCost = 2600
	WarmStorageReadCost   = 100
)

```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt's formula for gas forwarding is a good simplification, but the actual implementation in go-ethereum reveals a more nuanced sequence of operations. A more precise description would be:

1.  **Calculate Intrinsic Gas:** First, the EVM calculates the *intrinsic gas* for the call operation itself. This includes costs for memory expansion, any value transfer (`CallValueTransferGas`), and creating a new account if the destination doesn't exist (`CallNewAccountGas`).
2.  **Deduct Intrinsic Gas:** This intrinsic gas is immediately deducted from the caller's available gas.
3.  **Calculate Forwardable Gas:** The 63/64th rule is applied to the gas *remaining* after the intrinsic cost has been paid.
    - `gas_after_intrinsic_cost = available_gas - intrinsic_gas`
    - `max_forwardable_gas = gas_after_intrinsic_cost - floor(gas_after_intrinsic_cost / 64)`
4.  **Determine Final Forwarded Gas:** The actual gas forwarded to the sub-call is the minimum of the gas requested on the stack and the `max_forwardable_gas` calculated above.
    - `gas_to_forward = min(requested_gas, max_forwardable_gas)`
5.  **Stipend:** If the call involves a non-zero value transfer, an additional `CallStipend` (2300 gas) is added to the `gas_to_forward`. This ensures the recipient has enough gas to at least log the receipt of funds, even if the main forwarded gas is low. This stipend is an *addition* to the forwarded amount, not part of the 63/64 rule calculation itself.

This corrected flow is important for matching mainnet behavior precisely.

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/gas/call_gas_management_test.zig`)
```zig
// Test basic call gas management functionality
test "call_gas_management basic gas forwarding with known scenarios"
test "call_gas_management handles 63/64 rule correctly"
test "call_gas_management validates gas stipend calculations"
test "call_gas_management produces expected gas consumption"
```

#### 2. **Integration Tests**
```zig
test "call_gas_management integrates with EVM call operations"
test "call_gas_management works with existing gas accounting"
test "call_gas_management maintains hardfork compatibility"
test "call_gas_management handles nested call gas propagation"
```

#### 3. **Performance Tests**
```zig
test "call_gas_management meets gas calculation speed targets"
test "call_gas_management overhead measurement vs baseline"
test "call_gas_management scalability under high call frequency"
test "call_gas_management benchmark complex gas scenarios"
```

#### 4. **Error Handling Tests**
```zig
test "call_gas_management proper out-of-gas error handling"
test "call_gas_management handles invalid gas amounts"
test "call_gas_management graceful degradation on gas calculation errors"
test "call_gas_management recovery from gas accounting failures"
```

#### 5. **Compliance Tests**
```zig
test "call_gas_management EVM specification gas rule compliance"
test "call_gas_management cross-client gas behavior consistency"
test "call_gas_management hardfork gas rule adherence"
test "call_gas_management deterministic gas calculations"
```

#### 6. **Security Tests**
```zig
test "call_gas_management handles malicious gas requests safely"
test "call_gas_management prevents gas manipulation attacks"
test "call_gas_management validates gas-based DoS prevention"
test "call_gas_management maintains gas isolation properties"
```

### Test Development Priority
1. **Core gas management functionality tests** - Ensure basic gas forwarding works
2. **Compliance tests** - Meet EVM specification gas requirements
3. **Performance tests** - Achieve gas calculation efficiency targets
4. **Security tests** - Prevent gas-related vulnerabilities
5. **Error handling tests** - Robust gas failure management
6. **Edge case tests** - Handle gas boundary conditions

### Test Data Sources
- **EVM specification**: Official gas calculation requirements
- **Reference implementations**: Cross-client gas compatibility data
- **Performance baselines**: Gas calculation speed measurements
- **Security test vectors**: Gas manipulation prevention cases
- **Real-world scenarios**: Production gas usage pattern validation

### Continuous Testing
- Run `zig build test-all` after every code change
- Maintain 100% test coverage for public gas management APIs
- Validate gas calculation accuracy regression prevention
- Test debug and release builds with different gas scenarios
- Verify cross-platform gas calculation consistency

### Test-First Examples

**Before writing any implementation:**
```zig
test "call_gas_management basic 63/64 rule application" {
    // This test MUST fail initially
    const available_gas: u64 = 10000;
    const requested_gas: u64 = 8000;
    
    const result = call_gas_management.calculateForwardedGas(available_gas, requested_gas);
    const expected = available_gas - (available_gas / 64); // 63/64 rule
    try testing.expectEqual(@min(requested_gas, expected), result.forwarded_gas);
}
```

**Only then implement:**
```zig
pub const call_gas_management = struct {
    pub fn calculateForwardedGas(available: u64, requested: u64) !GasCalculationResult {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Notes
- **Never commit without passing tests** (`zig build test-all`)
- **Test all gas rule combinations** - Especially for different hardforks
- **Verify EVM specification compliance** - Critical for protocol gas correctness
- **Test gas performance implications** - Especially for high-frequency call scenarios
- **Validate gas security properties** - Prevent gas manipulation and DoS attacks

