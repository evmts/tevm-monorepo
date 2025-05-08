# ZigEVM Implementation Issues

This document tracks the missing functionality in our Zig EVM implementation compared to the reference implementations (evmone and revm).

## Table of Contents

- [Core Execution](#core-execution)
- [Instructions](#instructions)
- [Gas Calculation](#gas-calculation)
- [State Management](#state-management)
- [Precompiles](#precompiles)
- [Advanced Features](#advanced-features)
- [Integration and Protocol](#integration-and-protocol)
- [Optimization and Performance](#optimization-and-performance)

## Core Execution

### Issue #1: Opcode Definitions
**Tags**: `core`, `opcodes`, `definitions`

We need to define all EVM opcodes in a structured way similar to evmone's `instructions_opcodes.hpp` or revm's `opcode.rs`.

**Requirements**:
- Create an enum or constants for all opcodes in the EVM specification
- Include opcode metadata (stack inputs/outputs, gas costs, etc.)
- Handle both legacy and newer opcodes added in recent hard forks

**Implementation Reference**:
```rust
// From revm/crates/bytecode/src/opcode.rs
pub const STOP: u8 = 0x00;
pub const ADD: u8 = 0x01;
pub const MUL: u8 = 0x02;
// ... and so on
```

**Tests to Add**:
- Test existence of all required opcodes
- Test opcode properties

---

### Issue #2: Opcode Execution Table
**Tags**: `core`, `execution`, `dispatcher`

We need a dispatch mechanism to map opcodes to their implementations, following the pattern in revm's `instructions.rs`.

**Context**:
In the EVM, instructions are represented as single-byte opcodes (0x00-0xFF). To execute bytecode efficiently, we need a fast way to map these opcodes to their implementation functions. The current implementation in ZigEVM has a basic dispatch structure in `src/opcodes/dispatch.zig`, but it's incomplete and doesn't cover all opcodes.

The revm implementation uses an elegant approach with a function pointer array (jump table) where each index corresponds to an opcode value. This allows for O(1) lookup of the function that should handle a particular opcode. The table is initialized with a default handler for invalid opcodes, and then each supported opcode is mapped to its specific implementation.

**Requirements**:
- Complete the jump table or function pointer array for fast opcode dispatch
- Map each opcode to its implementation function
- Support for all standard EVM opcodes
- Handle unknown opcodes with a proper error
- Support different EVM versions where opcodes may be enabled/disabled

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/instructions.rs
pub fn instruction_table<WIRE: InterpreterTypes, H: Host + ?Sized>() -> [Instruction<WIRE, H>; 256] {
    use bytecode::opcode::*;
    // Initialize all opcodes to the "unknown" handler
    let mut table = [control::unknown as Instruction<WIRE, H>; 256];

    // Map each supported opcode to its implementation
    table[STOP as usize] = control::stop;
    table[ADD as usize] = arithmetic::add;
    table[MUL as usize] = arithmetic::mul;
    table[SUB as usize] = arithmetic::sub;
    table[DIV as usize] = arithmetic::div;
    // ... and so on for all supported opcodes
    
    // Return the complete table
    table
}

// Implementation of the opcode handler function type
type Instruction<W, H> = for<'a> fn(&'a mut Interpreter<W>, &'a mut H);

// Example of an arithmetic operation implementation
pub fn add<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    _host: &mut H,
) {
    // Calculate gas cost
    gas!(interpreter, gas::VERYLOW);
    
    // Pop values from stack
    popn_top!([op1], op2, interpreter);
    
    // Perform operation
    *op2 = op1.wrapping_add(*op2);
}

// Default handler for unknown or invalid opcodes
pub fn unknown<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    _host: &mut H,
) {
    interpreter.control.set_instruction_result(InstructionResult::InvalidOpcode);
}

// Main execution loop in the interpreter
pub fn run_plain<H: Host + ?Sized>(&mut self, instruction_table: &InstructionTable<IW, H>, host: &mut H) {
    self.reset_control();

    // Main execution loop
    while self.control.instruction_result().is_continue() {
        // Get the current opcode
        let opcode = self.bytecode.opcode();
        
        // Increment program counter
        self.bytecode.relative_jump(1);
        
        // Execute the opcode
        instruction_table[opcode as usize](self, host);
    }
}
```

**Tests to Add**:
- Test proper dispatch to the correct instruction implementation
- Test handling of unknown opcodes
- Test gas tracking during execution
- Test edge cases (overflows, underflows, invalid jumps)
- Test compatibility with different EVM versions

---

### Issue #3: Main Execution Loop Implementation
**Tags**: `core`, `execution`, `interpreter`

Our current `execute` function in `interpreter.zig` has a basic structure but needs to be enhanced to properly support the full range of EVM execution features.

**Context**:
The main execution loop is the heart of the EVM interpreter, responsible for fetching opcodes from bytecode, executing them, and managing the execution state. The current implementation in `src/interpreter/interpreter.zig` has a basic structure but lacks some important features like proper gas accounting, full error handling, and comprehensive support for all termination conditions.

In revm and evmone, the execution loop uses an efficient approach where each opcode implementation is responsible for its own logic, gas accounting, and state updates. The loop simply fetches the next opcode, dispatches to its implementation, and continues until a termination condition is reached.

**Requirements**:
- Improve the main execution loop to properly fetch, decode, and execute opcodes
- Implement comprehensive gas accounting during execution
- Support all termination conditions:
  - STOP: Normal termination with success
  - RETURN: Termination with return data
  - REVERT: Reversion of state changes with return data
  - Error conditions: Out of gas, invalid opcode, stack overflow/underflow, etc.
- Properly handle return data across calls
- Implement support for tracing and debugging (optional)
- Ensure efficiency and performance of the core loop

**Implementation Reference**:
```cpp
// From evmone/lib/evmone/advanced_execution.cpp
// This example shows the core execution loop from evmone
evmc_result execute(AdvancedExecutionState& state, const AdvancedCodeAnalysis& analysis) noexcept
{
    state.analysis.advanced = &analysis;  // Allow accessing the analysis by instructions.

    // Loop initialization - get the first instruction
    const auto* instr = state.analysis.advanced->instrs.data();
    
    // Main execution loop - each instruction returns the next instruction to execute
    // This allows for efficient handling of control flow instructions like JUMP
    while (instr != nullptr)
        instr = instr->fn(instr, state);

    // After execution completes, handle gas accounting
    // Only return unused gas for successful executions or reverts
    const auto gas_left =
        (state.status == EVMC_SUCCESS || state.status == EVMC_REVERT) ? state.gas_left : 0;
        
    // Gas refunds are only applied for successful executions
    const auto gas_refund = (state.status == EVMC_SUCCESS) ? state.gas_refund : 0;

    // Validate output parameters
    assert(state.output_size != 0 || state.output_offset == 0);
    
    // Construct and return the execution result
    return evmc::make_result(state.status, gas_left, gas_refund,
        state.memory.data() + state.output_offset, state.output_size);
}

// From revm/crates/interpreter/src/interpreter.rs
// This example shows the main execution loop from revm
pub fn run_plain<H: Host + ?Sized>(
    &mut self,
    instruction_table: &InstructionTable<IW, H>,
    host: &mut H,
) -> InterpreterAction {
    // Initialize control state
    self.reset_control();

    // Main execution loop
    while self.control.instruction_result().is_continue() {
        // Fetch the current opcode
        let opcode = self.bytecode.opcode();
        
        // Increment program counter before execution
        // This allows opcodes to modify PC if needed (e.g., JUMP)
        self.bytecode.relative_jump(1);
        
        // Execute the opcode by dispatching to its implementation
        instruction_table[opcode as usize](self, host);
    }

    // Determine the next action based on execution result
    self.take_next_action()
}

// Handle the execution result
pub fn take_next_action(&mut self) -> InterpreterAction {
    match self.control.instruction_result() {
        InstructionResult::Continue => panic!("Unexpected continue result"),
        InstructionResult::Stop => InterpreterAction::Stop,
        InstructionResult::Return => InterpreterAction::Return,
        InstructionResult::Revert => InterpreterAction::Revert,
        InstructionResult::SelfDestruct => InterpreterAction::SelfDestruct,
        InstructionResult::CallTooDeep
        | InstructionResult::PrecompileError
        | InstructionResult::OutOfGas
        | InstructionResult::OutOfOffset
        | InstructionResult::StackOverflow
        | InstructionResult::StackUnderflow
        | InstructionResult::InvalidJump
        | InstructionResult::InvalidRange
        | InstructionResult::InvalidOpcode
        | InstructionResult::StaticModeViolation
        | InstructionResult::MemoryLimitOOG
        | InstructionResult::MemoryOOG
        | InstructionResult::NotActivated
        | InstructionResult::OpcodeNotFound => InterpreterAction::Error,
    }
}
```

**Tests to Add**:
- Test simple program execution with various opcodes
- Test gas accounting during execution:
  - Normal completion within gas limit
  - Out of gas conditions
  - Gas refunds
- Test all termination conditions:
  - Normal STOP
  - RETURN with different data sizes
  - REVERT with different data sizes
  - Various error conditions
- Test program counter handling, especially with control flow opcodes (JUMP, JUMPI)
- Test handling of invalid opcodes and other error conditions

---

## Instructions

### Issue #4: Arithmetic Instructions
**Tags**: `instructions`, `arithmetic`

Implement all arithmetic opcodes (ADD, SUB, MUL, DIV, etc.).

**Requirements**:
- Implement all arithmetic operations with correct overflow/underflow handling
- Support for U256 operations
- Proper gas cost calculations

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/instructions/arithmetic.rs
pub fn add<WIRE: InterpreterTypes, H: Host + ?Sized>(interpreter: &mut Interpreter<WIRE>, _host: &mut H) {
    pop_top\!(interpreter, a, b);
    let c = a.overflowing_add(b).0;
    push_top\!(interpreter, c);
}

pub fn mul<WIRE: InterpreterTypes, H: Host + ?Sized>(interpreter: &mut Interpreter<WIRE>, _host: &mut H) {
    pop_top\!(interpreter, a, b);
    let c = a.overflowing_mul(b).0;
    push_top\!(interpreter, c);
}

// ... other arithmetic operations
```

**Tests to Add**:
- Test each arithmetic operation with various inputs
- Test boundary cases (overflow, underflow, division by zero)
- Test gas costs for each operation

---

### Issue #5: Bitwise Instructions
**Tags**: `instructions`, `bitwise`

Implement all bitwise operations (AND, OR, XOR, NOT, etc.).

**Requirements**:
- Implement all bitwise operations
- Correct handling of U256 operands
- Proper gas cost calculations

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/instructions/bitwise.rs
pub fn bitand<WIRE: InterpreterTypes, H: Host + ?Sized>(interpreter: &mut Interpreter<WIRE>, _host: &mut H) {
    pop_top\!(interpreter, a, b);
    push_top\!(interpreter, a & b);
}

pub fn bitor<WIRE: InterpreterTypes, H: Host + ?Sized>(interpreter: &mut Interpreter<WIRE>, _host: &mut H) {
    pop_top\!(interpreter, a, b);
    push_top\!(interpreter, a | b);
}

// ... other bitwise operations
```

**Tests to Add**:
- Test each bitwise operation with various inputs
- Test boundary cases
- Test gas costs for each operation

---

### Issue #41: Complete Opcode Instruction Implementations
**Tags**: `instructions`, `opcodes`, `core`

While the basic structure for opcode dispatch is in place, many opcodes still need to be implemented in the dispatch table.

**Requirements**:
- Complete the implementation of all standard EVM opcodes
- Ensure proper gas metering for each opcode
- Add necessary arithmetic operations (SDIV, SMOD, ADDMOD, MULMOD, etc.)
- Add environmental opcodes (ADDRESS, BALANCE, ORIGIN, CALLER, etc.)
- Add blockchain state opcodes (BLOCKHASH, COINBASE, TIMESTAMP, etc.)
- Add system operations (CREATE, CALL, CALLCODE, DELEGATECALL, etc.)

**Implementation Reference**:
```cpp
// From evmone/lib/evmone/advanced_execution.cpp
template <evmc_status_code status_code = EVMC_SUCCESS, bool check_eoc = false>
const Op* op_stop(const Op* op, ExecutionState& state) noexcept
{
    state.status = status_code;
    // Skip the next instruction if end of code should not be checked.
    return check_eoc ? nullptr : op + 1;
}

// Arithmetic operations
template <void (*F)(uint256&, const uint256&, const uint256&)>
const Op* op_arithmetic(const Op* op, ExecutionState& state) noexcept
{
    const auto x = state.stack.pop();
    auto& y = state.stack.top();
    F(y, y, x);
    return op + 1;
}

// Environmental operations
const Op* op_address(const Op* op, ExecutionState& state) noexcept
{
    state.stack.push(intx::be::load<uint256>(state.msg->destination));
    return op + 1;
}

// Blockchain state operations
const Op* op_timestamp(const Op* op, ExecutionState& state) noexcept
{
    state.stack.push(state.block->timestamp);
    return op + 1;
}
```

**Tests to Add**:
- Test each opcode implementation with various inputs
- Test edge cases and boundary conditions
- Test gas metering accuracy
- Test compatibility with Ethereum specification

---

### Issue #42: Efficient Modular Arithmetic and Cryptographic Operations
**Tags**: `arithmetic`, `cryptography`, `performance`

Implement efficient 256-bit modular arithmetic operations that are crucial for cryptographic operations and complex EVM computations.

**Requirements**:
- Implement efficient algorithms for ADDMOD and MULMOD that handle the full 512-bit intermediate results
- Optimize EXP for large exponents, including dynamic gas calculation
- Implement signed arithmetic operations (SDIV, SMOD) correctly
- Ensure correctness for edge cases (zeros, max values)

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/instructions/arithmetic.rs 
// (optimized version of MULMOD)
pub fn mulmod<WIRE: InterpreterTypes, H: Host + ?Sized>(interpreter: &mut Interpreter<WIRE>, _host: &mut H) {
    pop_top!(interpreter, n, y, x);
    
    // Handle edge cases
    if n.is_zero() {
        push_top!(interpreter, WIRE::U256::ZERO);
        return;
    }
    
    // Use specialized library for 512-bit multiplication and modular reduction
    let result = WIRE::U256::mulmod(x, y, n);
    push_top!(interpreter, result);
}

// From primitive_types crate (U256 efficient mulmod implementation)
pub fn mulmod(self, other: Self, modulus: Self) -> Self {
    // Convert to BigUint for 512-bit intermediate
    let x = self.to_biguint();
    let y = other.to_biguint();
    let m = modulus.to_biguint();
    
    // Perform full 512-bit multiplication and modular reduction
    // (x * y) % m
    let result = (x * y) % m;
    
    // Convert back to U256
    U256::from_biguint(result)
}
```

**Tests to Add**:
- Test modular arithmetic with various inputs, including edge cases
- Test handling of intermediate 512-bit values
- Test gas calculation for operations with dynamic gas costs (EXP)
- Benchmark performance against naive implementations

---

### Issue #6: Memory Instructions
**Tags**: `instructions`, `memory`

Implement memory-related opcodes (MLOAD, MSTORE, MSTORE8, etc.).

**Requirements**:
- Implement all memory operations with proper bounds checking
- Calculate gas costs for memory expansion
- Handle memory accesses efficiently

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/instructions/memory.rs
pub fn mload<WIRE: InterpreterTypes, H: Host + ?Sized>(interpreter: &mut Interpreter<WIRE>, _host: &mut H) {
    pop_top\!(interpreter, address);
    let address = as_usize_saturated\!(address);
    let expanded_addr = interpreter.shared_memory.expand_memory::<3>(address, 32)?;

    let mut value = U256::ZERO;
    interpreter.shared_memory.get_memory_u256(expanded_addr, &mut value);
    push_top\!(interpreter, value);
}

pub fn mstore<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    _host: &mut H,
) {
    pop_top\!(interpreter, address, value);
    let address = as_usize_saturated\!(address);
    let expanded_addr = interpreter.shared_memory.expand_memory::<3>(address, 32)?;
    interpreter.shared_memory.set_memory_u256(expanded_addr, value);
}

// ... other memory operations
```

**Tests to Add**:
- Test memory loading and storing with various offsets
- Test memory expansion and gas costs
- Test out-of-bounds memory access

---

### Issue #7: Storage Instructions
**Tags**: `instructions`, `storage`

Implement storage-related opcodes (SLOAD, SSTORE).

**Requirements**:
- Interface with the state manager for storage operations
- Calculate correct gas costs for storage operations (including refunds)
- Support EIP-2200 net gas metering for SSTORE

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/instructions/host.rs
pub fn sload<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    // Get the key from the stack
    pop_top\!(interpreter, key);
    // Call host to get the value for the key from storage
    let value = host.sload(&mut interpreter.return_data, interpreter.caller_address, key)?;
    // Push the result onto the stack
    push_top\!(interpreter, value);
}

pub fn sstore<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    // Check if we're in a static context (STATICCALL)
    check_static\!(interpreter);
    
    // Get the key and value from the stack
    pop_top\!(interpreter, key, value);
    
    // Call host to store the key/value pair
    let (gas_cost, gas_refund) =
        host.sstore(&mut interpreter.return_data, interpreter.caller_address, key, value)?;
    
    // Apply the gas cost and refund
    interpreter.gas_remaining = interpreter.gas_remaining.saturating_sub(gas_cost);
    interpreter.gas_refund = interpreter.gas_refund.saturating_add(gas_refund);
}
```

**Tests to Add**:
- Test storage loading and storing
- Test gas costs and refunds for storage operations
- Test storage operations in static context (should fail)

---

## Gas Calculation

### Issue #8: Gas Cost Calculation
**Tags**: `gas`, `execution`

Implement accurate gas cost calculation for all operations.

**Context**:
Gas metering is a fundamental aspect of the EVM, serving both as a mechanism to prevent infinite loops and as a way to charge for computational resources. Each operation in the EVM has an associated gas cost that must be carefully calculated and tracked during execution.

Gas costs in the EVM are categorized as either:
1. **Static costs**: Fixed values for operations like ADD, SUB, MUL
2. **Dynamic costs**: Calculated at runtime based on inputs or state changes, such as memory expansion or storage operations

The current ZigEVM implementation has a basic framework for tracking gas, but it lacks the detailed gas calculation logic required for accurate metering of all EVM operations, especially for complex operations like memory expansion and storage manipulation.

**Requirements**:
- Implement accurate gas cost calculation for all opcodes based on the Yellow Paper and relevant EIPs
- Support dynamic gas costs:
  - Memory expansion costs (quadratic formula)
  - Storage operations with different costs based on state changes (EIP-2200)
  - Complex operations like EXP with costs based on input size
  - Access list costs (EIP-2929)
- Track and apply gas refunds (for SSTORE, SELFDESTRUCT)
- Handle out-of-gas errors gracefully
- Support gas cost differences across hard forks

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/gas/constants.rs
// Static gas costs
pub const ZERO: u64 = 0;
pub const BASE: u64 = 2;
pub const VERYLOW: u64 = 3;
pub const LOW: u64 = 5;
pub const MID: u64 = 8;
pub const HIGH: u64 = 10;
// ... more constants

// From revm/crates/interpreter/src/gas/calc.rs
// Dynamic gas calculations

// Memory expansion gas calculation (quadratic formula from Yellow Paper)
pub fn memory_gas(size: usize) -> Option<u64> {
    // Gas cost for memory expansion
    let size_in_words = words_for_memory_len(size);
    // memory_gas = 3 * words + words^2 / 512
    size_in_words
        .checked_mul(MEMORY_GAS_PER_WORD)?
        .checked_add(size_in_words.checked_mul(size_in_words)? / MEMORY_EXPANSION_QUAD_DENOMINATOR)
}

// SSTORE gas calculation (based on EIP-2200 net gas metering)
pub fn sstore_gas(original: &U256, current: &U256, new: &U256, is_cold: bool) -> (u64, u64) {
    // Get cold access cost if applicable
    let cold_gas = if is_cold { COLD_SLOAD_COST } else { 0 };
    
    // Case 1: Current value equals new value (no change)
    if current == new {
        return (WARM_STORAGE_READ_COST + cold_gas, 0);
    }
    
    // Case 2: Current value equals original value (first write in transaction)
    if current == original {
        // Case 2a: Original value is zero (creating new storage slot)
        if original.is_zero() {
            return (SSTORE_SET_GAS + cold_gas, 0);
        }
        // Case 2b: Original value is non-zero, new value is zero (clearing storage)
        else if new.is_zero() {
            return (SSTORE_RESET_GAS + cold_gas, SSTORE_RESET_REFUND);
        }
        // Case 2c: Original is non-zero, new is non-zero (modifying existing value)
        else {
            return (SSTORE_RESET_GAS + cold_gas, 0);
        }
    }
    
    // Case 3: Current value is different from original (dirty slot)
    // Complex refund calculations for various scenarios
    let mut gas_refund = 0;
    
    // Case 3a: Original value is non-zero
    if !original.is_zero() {
        // If current is zero but original isn't, we've already refunded for clearing
        if current.is_zero() {
            gas_refund -= SSTORE_RESET_REFUND;
        }
        // If we're now clearing the slot back to original zero value, add refund
        else if new.is_zero() {
            gas_refund += SSTORE_RESET_REFUND;
        }
    }
    
    // Case 3b: If the new value equals the original value
    if original == new {
        // If original is zero, we're clearing back to original empty state
        if original.is_zero() {
            gas_refund += SSTORE_SET_REFUND;
        }
        // Otherwise we're reverting to original non-zero value
        else {
            gas_refund += SSTORE_RESET_REFUND;
        }
    }
    
    // Return warm storage read cost + cold access fee if applicable, plus calculated refund
    (WARM_STORAGE_READ_COST + cold_gas, gas_refund)
}

// Gas calculation for EXP opcode (depends on exponent byte size)
pub fn exp_gas(exponent_byte_size: u64) -> u64 {
    EXP_GAS + EXP_BYTE_GAS * exponent_byte_size
}

// Usage in an opcode implementation
pub fn sstore<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    // Make sure we're not in a static context
    check_static!(interpreter);
    
    // Get key and value from stack
    popn!([key, value], interpreter);
    
    // Get original and current values from storage
    let address = interpreter.caller_address;
    let original = host.original_storage(address, key)?;
    let current = host.storage(address, key)?;
    
    // Calculate gas cost and refund
    let is_cold = !host.is_warm(address, key);
    let (gas_cost, gas_refund) = sstore_gas(&original, &current, &value, is_cold);
    
    // Charge gas
    gas!(interpreter, gas_cost);
    
    // Add refund
    interpreter.gas_refund += gas_refund;
    
    // Update storage
    host.set_storage(address, key, value)?;
}
```

**Tests to Add**:
- Test gas calculation for simple operations (ADD, SUB, etc.)
- Test gas calculation for memory expansion with different sizes
- Test gas calculation and refunds for storage operations:
  - Setting new values
  - Modifying existing values
  - Clearing values
  - Re-setting to original values
- Test gas calculation for complex operations (EXP, SHA3, etc.)
- Test gas limit enforcement and out-of-gas handling
- Test compatibility with different EVM versions

---

## State Management

### Issue #9: State Management Interface
**Tags**: `state`, `storage`

Create an interface for state management that can be used by the EVM.

**Requirements**:
- Define a state management interface for account and storage access
- Support for account creation, deletion, and modification
- Support for storage access and modification

**Implementation Reference**:
```rust
// From revm/crates/database/interface/src/lib.rs
pub trait Database {
    /// Get basic account information.
    fn basic(&mut self, address: H160) -> Result<Option<AccountInfo>, Self::Error>;
    
    /// Get storage value from account storage.
    fn storage(&mut self, address: H160, key: U256) -> Result<U256, Self::Error>;
    
    /// Get account code by its hash.
    fn code(&mut self, code_hash: H256) -> Result<Bytecode, Self::Error>;
    
    /// Update account information.
    fn set_basic(&mut self, address: H160, info: AccountInfo) -> Result<(), Self::Error>;
    
    /// Update account storage.
    fn set_storage(&mut self, address: H160, key: U256, value: U256) -> Result<(), Self::Error>;
    
    /// Update account code.
    fn set_code(&mut self, address: H160, code: Bytecode) -> Result<(), Self::Error>;
}
```

**Tests to Add**:
- Test basic account operations (create, read, update)
- Test storage operations (read, write)
- Test code operations (read, update)

---

## Precompiles

### Issue #10: Precompile Contracts
**Tags**: `precompiles`, `contracts`

Implement standard Ethereum precompile contracts.

**Requirements**:
- Implement all standard precompile contracts (ecrecover, sha256, etc.)
- Support for gas cost calculation for precompiles
- Proper error handling

**Implementation Reference**:
```rust
// From revm/crates/precompile/src/lib.rs
pub struct Precompiles<const N: usize> {
    /// List of precompile functions.
    pub addresses: [Option<PrecompileAddress>; N],
}

impl<const N: usize> Precompiles<N> {
    /// Run the precompile at the given address.
    pub fn run(
        &self,
        address: Address,
        input: &[u8],
        gas_limit: u64,
        _context: &Context,
    ) -> Result<PrecompileResult, EvmError> {
        let Some(address_index) = self.get_precompile_index(address) else {
            return Err(EvmError::Precompile);
        };

        let result = match address_index {
            1 => ecrecover::ecrecover(input, gas_limit),
            2 => hash::sha256(input, gas_limit),
            3 => hash::ripemd160(input, gas_limit),
            4 => identity::identity(input, gas_limit),
            // ... other precompiles
            _ => return Err(EvmError::Precompile),
        };

        result
    }
}
```

**Tests to Add**:
- Test each precompile with valid inputs
- Test precompiles with invalid inputs
- Test gas costs for precompiles

---

## Advanced Features

### Issue #11: EVM Tracing Support
**Tags**: `tracing`, `debugging`

Implement tracing support for debugging and monitoring EVM execution.

**Requirements**:
- Create a tracing interface for capturing execution steps
- Support for different trace formats (full, callTracer, etc.)
- Low overhead when tracing is not enabled

**Implementation Reference**:
```cpp
// From evmone/lib/evmone/tracing.hpp
class Tracer
{
public:
    /// VM execution started notification.
    virtual void notify_execution_start(
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept = 0;

    /// VM instruction executed notification.
    virtual void notify_instruction_start(
        uint32_t pc, const intx::uint256* stack_top, int stack_height, int64_t gas,
        const ExecutionState& state) noexcept = 0;

    /// VM execution terminated notification.
    virtual void notify_execution_end(const evmc_result& result) noexcept = 0;
};
```

**Tests to Add**:
- Test tracing simple execution
- Test different trace formats
- Test trace output correctness

---

### Issue #12: Advanced Gas Metering (EIP-1283, EIP-2200)
**Tags**: `gas`, `eips`

Implement advanced gas metering for storage operations as specified in EIP-1283 and EIP-2200.

**Requirements**:
- Implement net gas metering for SSTORE operations
- Support gas refunds for storage operations
- Handle edge cases correctly

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/gas/calc.rs
pub fn sstore_gas_eip2200(
    original: &U256,
    current: &U256,
    new: &U256,
    gas_remaining: u64,
    is_cold: bool,
) -> Result<(u64, i64), Error> {
    let zero_to_nonzero = current.is_zero() && \!new.is_zero();
    let nonzero_to_zero = \!current.is_zero() && new.is_zero();
    let cold_gas = if is_cold { COLD_SLOAD_COST } else { 0 };

    // Special case: revert all in case gas_remaining is not enough for potential SSTORE_SET_GAS
    if zero_to_nonzero && gas_remaining <= (SSTORE_SET_GAS + cold_gas) {
        return Err(Error::OutOfGas);
    }

    if current == new {
        Ok((SLOAD_GAS + cold_gas, 0))
    } else if original == current {
        if original.is_zero() {
            Ok((SSTORE_SET_GAS + cold_gas, 0))
        } else if new.is_zero() {
            Ok((SSTORE_RESET_GAS + cold_gas, SSTORE_RESET_REFUND))
        } else {
            Ok((SSTORE_RESET_GAS + cold_gas, 0))
        }
    } else {
        let mut gas_refund = 0;
        if \!original.is_zero() {
            if current.is_zero() {
                gas_refund -= SSTORE_RESET_REFUND;
            } else if new.is_zero() {
                gas_refund += SSTORE_RESET_REFUND;
            }
        }
        if original == new {
            if original.is_zero() {
                gas_refund += SSTORE_SET_REFUND;
            } else {
                gas_refund += SSTORE_RESET_REFUND;
            }
        }
        Ok((SLOAD_GAS + cold_gas, gas_refund))
    }
}
```

**Tests to Add**:
- Test gas costs for different SSTORE scenarios
- Test gas refunds for SSTORE operations
- Test compatibility with EIP specifications

---

### Issue #13: EIP-4844 Blob Transaction Support
**Tags**: `eips`, `transactions`

Implement support for EIP-4844 blob transactions.

**Requirements**:
- Add support for blob transactions
- Implement blob-related opcodes (BLOBHASH, BLOBBASEFEE)
- Calculate proper gas costs for blob operations

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/instructions/block_info.rs
pub fn blob_basefee<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    push_top\!(interpreter, host.blob_basefee()?);
}

// From revm/crates/interpreter/src/instructions/tx_info.rs
pub fn blob_hash<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    // Index from the stack
    pop_top\!(interpreter, index);
    // Get the blob hash from the host
    let hash = host.blob_hash(&mut interpreter.return_data, index)?;
    // Push the result onto the stack
    push_top\!(interpreter, hash);
}
```

**Tests to Add**:
- Test blob-related opcodes
- Test gas costs for blob operations
- Test blob transactions

---

### Issue #14: EIP-1559 Fee Market Support
**Tags**: `eips`, `gas`

Implement support for EIP-1559 fee market.

**Requirements**:
- Add support for base fee and priority fee calculation
- Implement the BASEFEE opcode
- Properly handle maximum fee cap and priority fee cap

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/instructions/block_info.rs
pub fn basefee<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    push_top\!(interpreter, host.block_base_fee_per_gas()?);
}
```

**Tests to Add**:
- Test BASEFEE opcode
- Test transaction validation with EIP-1559 parameters
- Test gas calculations with EIP-1559 fee structure

---

### Issue #15: EOF (EIP-3540, EIP-3670) Support
**Tags**: `eips`, `bytecode`

Implement support for EOF (Ethereum Object Format) contracts.

**Requirements**:
- Add support for EOF container format validation
- Implement EOF execution semantics
- Support EOF-specific opcodes

**Implementation Reference**:
```rust
// From revm/crates/bytecode/src/eof/verification.rs
pub fn verify_eof_code(code: &[u8]) -> Option<ContainerVersion> {
    // Check EOF magic
    if code.len() < 3 || code[0] \!= 0xEF || code[1] \!= 0x00 {
        return None;
    }

    // Check version
    match code[2] {
        1 => Some(ContainerVersion::V1),
        _ => None,
    }
}
```

**Tests to Add**:
- Test EOF container validation
- Test EOF code execution
- Test EOF-specific opcodes

---

### Issue #21: Return Data Buffer Management
**Tags**: `memory`, `return-data`, `core`

Implement proper return data buffer management with support for RETURNDATASIZE and RETURNDATACOPY opcodes.

**Context**:
The return data buffer is a critical component introduced in the Byzantium hard fork (EIP-211) that temporarily stores the data returned from the most recent external call. This buffer is accessible through the RETURNDATASIZE and RETURNDATACOPY opcodes, allowing contracts to efficiently work with arbitrary-length return data from external calls.

In the ZigEVM, a basic `ReturnData` struct has been added in `src/interpreter/return_data.zig`, but the implementation is not complete, and the integration with call operations is missing. The return data buffer needs to be properly managed across nested call contexts, where each call should update the caller's return data buffer when it returns.

**Requirements**:
- Complete the implementation of the dedicated return data buffer manager
- Implement RETURNDATASIZE and RETURNDATACOPY opcodes
- Ensure proper handling of nested call contexts
- Update the return data buffer when calls return:
  - For successful calls: set the buffer to the output data
  - For reverted calls: set the buffer to the revert data
  - For failed calls: clear the buffer
- Add proper error handling for out-of-bounds access

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/interpreter/return_data.rs
pub struct ReturnDataImpl {
    pub(crate) buffer: Bytes,
}

impl ReturnDataImpl {
    #[inline]
    pub fn new(bytes: Bytes) -> Self {
        Self { buffer: bytes }
    }

    #[inline]
    pub fn get(&self, offset: usize, size: usize) -> Option<Bytes> {
        let end = offset.saturating_add(size);
        if end <= self.buffer.len() {
            Some(self.buffer.slice(offset, end))
        } else {
            None
        }
    }

    #[inline]
    pub fn len(&self) -> usize {
        self.buffer.len()
    }
}

// Opcode implementations
pub fn returndatasize<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    _host: &mut H,
) {
    // Push the size of the return data buffer onto the stack
    push_top!(interpreter, U256::from(interpreter.return_data.len()));
}

pub fn returndatacopy<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    _host: &mut H,
) {
    // Pop destination offset, source offset, and size from stack
    popn!([dest_offset, offset, size], interpreter);
    
    // Calculate gas cost (VERYLOW base cost + dynamic memory cost)
    gas!(interpreter, gas::VERYLOW + gas::memory_copy_cost(size));
    
    let dest_offset = dest_offset.as_usize();
    let offset = offset.as_usize();
    let size = size.as_usize();
    
    // Nothing to copy if size is zero
    if size == 0 {
        return;
    }
    
    // Check bounds - critical security check!
    if offset.saturating_add(size) > interpreter.return_data.len() {
        interpreter.status = InstructionResult::ReturnDataOutOfBounds;
        return;
    }
    
    // Resize memory if needed to accommodate the copied data
    resize_memory!(interpreter, dest_offset, size);
    
    // Copy data from return data buffer to memory
    interpreter.memory.set_data(
        dest_offset,
        offset,
        size,
        interpreter.return_data.as_ref(),
    );
}

// From revm's handler
// When a call returns, the return data buffer is updated
fn return_result(&mut self, evm: &mut EVM, result: FrameResult) -> Result<(), ERROR> {
    // ...
    match result {
        FrameResult::Call(outcome) => {
            // ...
            // Set caller's return data buffer to callee's output
            interpreter.return_data.set_buffer(outcome.result.output);
            // ...
        }
        // ...
    }
    // ...
}
```

**Tests to Add**:
- Test RETURNDATASIZE returns correct size
- Test RETURNDATACOPY properly copies data
- Test edge cases like out-of-bounds access
- Test return data propagation across call contexts
- Test interaction between different call types (CALL, DELEGATECALL, STATICCALL) and return data

---

### Issue #22: System Operation Instructions
**Tags**: `instructions`, `system`, `core`

Implement system operation opcodes such as LOG, SELFDESTRUCT, and others that interact with the blockchain state and EVM environment.

**Requirements**:
- Implement LOG0-LOG4 opcodes for emitting events
- Implement SELFDESTRUCT for contract deletion
- Implement environment information opcodes (COINBASE, TIMESTAMP, etc.)

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/instructions/system.rs
pub fn selfdestruct<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    pop_top!(interpreter, address_u256);
    let address = u256_to_address(&address_u256);
    
    // Check for static mode violation
    if interpreter.is_static {
        interpreter.status = InstructionResult::StaticModeViolation;
        return;
    }
    
    let beneficiary = host.load_account(address)?;
    let current_contract = host.load_account(interpreter.context.address)?;
    
    // Transfer remaining balance
    host.transfer(interpreter.context.address, address, current_contract.balance)?;
    
    // Mark account for deletion
    host.selfdestruct(interpreter.context.address, address)?;
    
    interpreter.status = InstructionResult::Stop;
}

pub fn log<WIRE: InterpreterTypes, H: Host + ?Sized, const N_TOPICS: usize>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    // Check for static mode violation
    if interpreter.is_static {
        interpreter.status = InstructionResult::StaticModeViolation;
        return;
    }
    
    popn!([offset, size], interpreter);
    
    // Get memory data
    let offset = offset.as_usize();
    let size = size.as_usize();
    
    // Calculate gas cost
    gas!(interpreter, gas::LOG + gas::LOG_DATA * size + gas::LOG_TOPIC * N_TOPICS);
    
    // Get topics from stack
    let mut topics = [H256::default(); N_TOPICS];
    for i in 0..N_TOPICS {
        pop_top!(interpreter, topic);
        topics[i] = u256_to_h256(topic);
    }
    
    // Get data from memory
    resize_memory!(interpreter, offset, size);
    let data = interpreter.memory.get_slice(offset, size);
    
    // Emit log
    host.log(interpreter.context.address, data, &topics)?;
}

pub fn blockhash<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    pop_top!(interpreter, number);
    
    // Calculate gas cost
    gas!(interpreter, gas::BLOCKHASH);
    
    // Get block hash
    let hash = if number < host.env().block.number && 
               host.env().block.number <= number + 256 {
        host.get_block_hash(number)?
    } else {
        H256::default()
    };
    
    push_top!(interpreter, h256_to_u256(hash));
}
```

**Tests to Add**:
- Test LOG opcodes with various topic counts
- Test SELFDESTRUCT behavior and balance transfer
- Test blockchain environment opcodes
- Test static context restrictions

---

### Issue #23: Call Depth Tracking and Management
**Tags**: `execution`, `calls`, `gas`

Implement proper call depth tracking and management to handle EVM call stack limits and nested calls.

**Requirements**:
- Track call depth across nested calls
- Enforce the 1024 call depth limit
- Implement proper gas forwarding for calls
- Handle the different call types (CALL, DELEGATECALL, STATICCALL, etc.)

**Implementation Reference**:
```cpp
// From evmone/lib/evmone/instructions_calls.cpp
template <Opcode Op>
evmc_result call(ExecutionState& state, const instruction::call_arguments& args) noexcept
{
    // Check call depth limit
    if (state.message->depth >= 1024)
        return {EVMC_CALL_DEPTH_EXCEEDED, state.gas_left};

    // Handle different call types
    evmc_call_kind kind;
    if constexpr (Op == OP_CALL)
        kind = EVMC_CALL;
    else if constexpr (Op == OP_DELEGATECALL)
        kind = EVMC_DELEGATECALL;
    else if constexpr (Op == OP_STATICCALL)
        kind = EVMC_STATICCALL;
    else
        kind = EVMC_CALLCODE;

    // Calculate gas to forward
    auto gas = static_cast<int64_t>(args.gas);
    
    // Create message
    evmc_message msg{};
    msg.kind = kind;
    msg.flags = state.message->flags;
    msg.depth = state.message->depth + 1;
    msg.gas = gas;
    msg.destination = args.destination;
    msg.sender = kind == EVMC_DELEGATECALL ? state.message->sender : state.message->destination;
    msg.input_data = args.call_data.data;
    msg.input_size = args.call_data.size;
    msg.value = args.call_value;
    
    // If it's a STATICCALL or we're already static, propagate static flag
    if (kind == EVMC_STATICCALL || (state.message->flags & EVMC_STATIC) != 0)
        msg.flags |= EVMC_STATIC;

    // Execute the call
    auto result = state.host.call(msg);
    
    // Process the result
    state.return_data = {result.output_data, result.output_size};
    state.gas_left -= msg.gas - result.gas_left;
    
    return result;
}
```

**Tests to Add**:
- Test all call types (CALL, DELEGATECALL, STATICCALL, CALLCODE)
- Test call depth limit enforcement
- Test gas forwarding rules
- Test return data handling between calls
- Test static flag propagation

---

### Issue #24: Error Handling and Status Codes
**Tags**: `errors`, `execution`, `core`

Implement comprehensive error handling and status codes to properly handle execution failures.

**Requirements**:
- Define error types for all possible EVM failures
- Ensure proper propagation of errors through call stack
- Implement consistent state reversion on errors

**Implementation Reference**:
```rust
// From revm/crates/interpreter/src/instruction_result.rs
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum InstructionResult {
    // Successful completion
    Continue,
    Stop,
    Return,
    SelfDestruct,
    
    // Reversion
    Revert,
    
    // Fatal errors (no state changes)
    OutOfGas,
    InvalidOpcode,
    InvalidJump,
    InvalidRange,
    StackUnderflow,
    StackOverflow,
    OutOfOffset,
    OutOfMemory,
    StaticModeViolation,
    CallTooDeep,
    CreateCollision,
    PrecompileError,
    NonceOverflow,
    // ... more error types
}

impl InstructionResult {
    /// Returns true if this result should cause a revert of state changes
    pub fn is_revert(&self) -> bool {
        match self {
            Self::Stop | Self::Return | Self::SelfDestruct => false,
            _ => true,
        }
    }
    
    /// Returns true if execution should continue
    pub fn should_continue(&self) -> bool {
        *self == Self::Continue
    }
}
```

**Tests to Add**:
- Test error propagation through call stack
- Test state reversion for different error types
- Test gas refunds in error conditions
- Test all error case opcodes

---

### Issue #25: Block Information and Environment Context
**Tags**: `context`, `block`, `execution`

Implement a comprehensive block and environment context to support blockchain-aware EVM execution.

**Requirements**:
- Implement context for block information (number, timestamp, etc.)
- Implement context for transaction information (sender, value, etc.)
- Support for chain ID and network parameters

**Implementation Reference**:
```rust
// From revm/crates/context/src/block.rs
pub struct BlockEnv {
    /// Block gas limit.
    pub gas_limit: U256,
    /// Coinbase address.
    pub coinbase: Address,
    /// Block difficulty.
    pub difficulty: U256,
    /// Block random seed (from PREVRANDAO opcode).
    pub prevrandao: Option<B256>,
    /// Block number.
    pub number: U256,
    /// Block timestamp.
    pub timestamp: U256,
    /// Base fee per gas.
    pub basefee: U256,
    /// Chain ID.
    pub chain_id: U256,
    /// Blob gas price.
    pub blob_gas_price: U256,
    /// Blob gas.
    pub blob_gas_used: u64,
}

// From revm/crates/context/src/transaction.rs
pub struct TxEnv {
    /// Caller address.
    pub caller: Address,
    /// Transaction value.
    pub value: U256,
    /// Contract data.
    pub data: Bytes,
    /// Gas limit.
    pub gas_limit: u64,
    /// Gas price.
    pub gas_price: U256,
    /// Chain ID.
    pub chain_id: U256,
    /// Nonce.
    pub nonce: Option<u64>,
    /// Access list.
    pub access_list: Vec<(Address, Vec<U256>)>,
    /// Blob hashes.
    pub blob_hashes: Vec<B256>,
    /// Max fee per blob gas.
    pub max_fee_per_blob_gas: Option<U256>,
}

// Block info opcodes implementation
pub fn number<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    gas!(interpreter, gas::BASE);
    push_top!(interpreter, host.env().block.number);
}

pub fn timestamp<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    gas!(interpreter, gas::BASE);
    push_top!(interpreter, host.env().block.timestamp);
}

pub fn coinbase<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    gas!(interpreter, gas::BASE);
    push_top!(interpreter, host.env().block.coinbase.into_word().into());
}

pub fn difficulty<WIRE: InterpreterTypes, H: Host + ?Sized>(
    interpreter: &mut Interpreter<WIRE>,
    host: &mut H,
) {
    gas!(interpreter, gas::BASE);
    push_top!(interpreter, host.env().block.difficulty);
}
```

**Tests to Add**:
- Test block information opcodes
- Test chain ID access
- Test environment-aware operations
- Test transaction context access

This document will be updated as we identify more missing functionality or refine existing issues.

## Integration and Protocol

### Issue #37: EVM Specifications and Conformance Testing
**Tags**: `specification`, `conformance`, `testing`

Implement comprehensive conformance testing against official Ethereum test vectors to ensure compatibility with the EVM specification.

**Requirements**:
- Set up infrastructure to run official Ethereum test vectors
- Implement test harnesses for all test types (general state tests, VM tests, etc.)
- Create tools to automatically update and run tests
- Track compliance across different EVM versions and forks

**Implementation Reference**:
```cpp
// From evmone/test/unittests/evm_test.cpp
TEST(evm, general_state_test)
{
    // Load a state test from the Ethereum tests repository
    const auto state_test = load_state_test("GeneralStateTests/stExample/add11.json");
    
    // For each test case in the state test
    for (const auto& test_case : state_test.test_cases)
    {
        // Create a state with the pre-state from the test
        state::State state;
        initialize_state(state, test_case.pre);
        
        // Execute the transaction
        const auto result = execute_transaction(state, test_case.transaction);
        
        // Verify the post-state matches the expected state
        verify_state(state, test_case.post);
    }
}
```

**Tests to Add**:
- Ethereum Foundation state tests
- VM tests
- Blockchain tests
- Transaction tests
- Fork-specific compatibility tests

---

### Issue #38: JSON-RPC API Implementation
**Tags**: `json-rpc`, `api`, `integration`

Implement the standard Ethereum JSON-RPC API to allow the ZigEVM to be integrated with existing Ethereum tooling.

**Requirements**:
- Implement the full Ethereum JSON-RPC API specification
- Support all standard methods (eth_*, net_*, web3_*)
- Handle parameter validation and error reporting
- Provide extensibility for custom methods

**Implementation Reference**:
```rust
// From revm/crates/revm-primitives/src/jsonrpc.rs
pub async fn handle_request(
    state: Arc<RwLock<State>>,
    request: JsonRpcRequest,
) -> JsonRpcResponse {
    match request.method.as_str() {
        "eth_getBalance" => {
            let params: GetBalanceParams = parse_params(&request.params)?;
            let state = state.read().await;
            let balance = state.get_balance(&params.address, params.block_tag)?;
            JsonRpcResponse::success(request.id, balance)
        }
        "eth_call" => {
            let params: CallParams = parse_params(&request.params)?;
            let state = state.read().await;
            let result = state.call(&params.transaction, params.block_tag)?;
            JsonRpcResponse::success(request.id, result)
        }
        // ... other methods
        _ => JsonRpcResponse::error(request.id, JsonRpcError::method_not_found()),
    }
}
```

**Tests to Add**:
- Test each JSON-RPC method against specification
- Test error handling and invalid parameters
- Test concurrent request handling
- Test integration with web3 libraries

---

## Optimization and Performance

### Issue #39: Optimized Bytecode Analysis and Execution
**Tags**: `optimization`, `performance`, `analysis`

Implement advanced bytecode analysis and execution techniques to improve performance.

**Requirements**:
- Implement basic block analysis to identify and optimize code paths
- Cache gas costs for frequently executed blocks
- Optimize jump table and jump destination validation
- Support JIT compilation for hot code paths
- Create comprehensive benchmarks to measure optimization impact
- Add performance regression testing in CI pipeline

**Implementation Reference**:
```cpp
// From evmone/lib/evmone/advanced_analysis.cpp
AdvancedCodeAnalysis analyze(bytes_view code) noexcept
{
    // Create a table of valid jump destinations
    std::vector<bool> jumpdest_map(code.size(), false);
    for (size_t i = 0; i < code.size(); ++i)
    {
        if (code[i] == OP_JUMPDEST)
            jumpdest_map[i] = true;
        else if (code[i] >= OP_PUSH1 && code[i] <= OP_PUSH32)
            i += code[i] - OP_PUSH1 + 1;
    }
    
    // Analyze and optimize the code
    AdvancedCodeAnalysis analysis;
    for (size_t i = 0; i < code.size(); ++i)
    {
        const auto op = code[i];
        
        // Pre-compute gas costs for the block
        auto gas_cost = get_gas_cost(op);
        
        // Precompute operand data for PUSHx operations
        uint256 push_value = 0;
        if (op >= OP_PUSH1 && op <= OP_PUSH32)
        {
            const auto push_size = op - OP_PUSH1 + 1;
            const auto push_end = i + push_size;
            if (push_end < code.size())
                push_value = load_push_value(code, i + 1, push_size);
            i = push_end;
        }
        
        // Create optimized instruction
        analysis.instrs.emplace_back(
            gas_cost,
            op,
            push_value,
            jumpdest_map[i] ? i : 0
        );
    }
    
    return analysis;
}
```

**Tests to Add**:
- Test basic block identification
- Test gas cost caching
- Benchmark performance improvements
- Test edge cases like invalid jumps
- Add benchmark suite comparing against reference implementations
- Create performance profiles for different contract types
- Measure execution time and gas usage for standard benchmarks

**Benchmarks to Implement**:
- **Basic Opcode Benchmarks**: 
  - Measure the performance of each individual opcode
  - Compare simple vs. complex operations (ADD vs. DIV)
  - Measure stack operations performance (PUSH, POP, SWAP, DUP)
  - Benchmark arithmetic operations with different input sizes

- **Standard Contract Benchmarks**: 
  - Measure performance on common contracts like ERC20, ERC721, ERC1155
  - Benchmark popular real-world contracts like Uniswap, Aave
  - Test complex smart contract patterns (proxies, factories)
  - Compare performance on different Solidity compiler optimization levels

- **Gas-Intensive Benchmarks**: 
  - Target high-gas operations like SSTORE, KECCAK256
  - Benchmark operations with dynamic gas costs (EXP, CALLDATACOPY)
  - Test gas metering accuracy and overhead
  - Measure performance of gas-heavy loop operations

- **Memory-Intensive Benchmarks**: 
  - Test memory expansion and copy operations
  - Benchmark large memory allocations and growth patterns
  - Test performance of MLOAD/MSTORE with different access patterns
  - Measure performance impact of memory alignment optimizations

- **Storage-Intensive Benchmarks**: 
  - Test scenarios with frequent storage access
  - Benchmark cold vs. warm storage access patterns
  - Test storage slot collisions and hash calculations
  - Measure storage caching effectiveness

- **Blockchain-Specific Benchmarks**: 
  - Test real-world block execution scenarios
  - Benchmark transaction processing pipelines
  - Measure performance on historical mainnet blocks
  - Test block processing with varying transaction counts and types

- **Comparative Benchmarks**: 
  - Compare directly against evmone and revm implementations
  - Benchmark using identical workloads across implementations
  - Measure scaling characteristics with increasing workload complexity
  - Create standardized benchmark suites for cross-implementation comparison

**CI Integration Requirements**:
- Automated benchmark runs for each significant PR
- Performance regression detection with configurable thresholds
- Benchmark result visualization and reporting
- Historical performance tracking across commits
- Comparative analysis against baseline implementations
- Per-commit benchmark data storage and retrieval
- Regular full benchmark suite runs on scheduled intervals
- Documentation of benchmark methodology and interpretation guidelines

---

### Issue #40: SIMD and Hardware Acceleration
**Tags**: `optimization`, `simd`, `performance`

Implement SIMD and hardware acceleration for computationally intensive operations.

**Requirements**:
- Identify operations that can benefit from SIMD parallelism
- Create optimized implementations using hardware intrinsics
- Provide fallbacks for platforms without SIMD support
- Benchmark and validate correctness

**Implementation Reference**:
```zig
// Example of SIMD-optimized U256 addition using AVX2
pub fn addU256Simd(a: *const U256, b: *const U256, result: *U256) void {
    if (comptime builtin.cpu.arch.isX86() and builtin.cpu.features.avx2) {
        // AVX2 implementation using vector operations
        const a_vec = @bitCast(@Vector(4, u64), a.words);
        const b_vec = @bitCast(@Vector(4, u64), b.words);
        
        // Parallel addition with carry handling
        // (simplification - actual implementation would need to handle carries)
        const sum_vec = a_vec +% b_vec;
        
        result.words = @bitCast([4]u64, sum_vec);
    } else {
        // Fallback implementation
        var carry: u1 = 0;
        inline for (0..4) |i| {
            const partial_sum = @addWithOverflow(a.words[i], b.words[i]);
            const with_carry = @addWithOverflow(partial_sum[0], carry);
            result.words[i] = with_carry[0];
            carry = @intCast(partial_sum[1] | with_carry[1]);
        }
    }
}
```

**Tests to Add**:
- Test SIMD implementations against scalar implementations
- Test on different hardware architectures
- Benchmark performance improvements
- Test edge cases and correctness guarantees

---

### Issue #26: WebAssembly Integration and Exports
**Tags**: `wasm`, `export`, `integration`

Implement WebAssembly integration to allow the ZigEVM to be compiled to WebAssembly and used in JavaScript environments.

**Requirements**:
- Create WASM export functions for key EVM operations
- Implement memory management compatible with WASM boundaries
- Handle data transfer between JavaScript and WASM efficiently
- Support asynchronous execution where needed

**Implementation Reference**:
```zig
// From src/wasm/exports.zig (to be created)
pub export fn createInterpreter(
    code_ptr: [*]const u8,
    code_len: usize,
    gas_limit: u64,
    depth: u16
) u32 {
    // Implementation to create an interpreter instance
    // and return a handle to it (as a u32)
}

pub export fn executeInterpreter(handle: u32) u32 {
    // Execute the interpreter instance
    // Return an execution result handle
}

pub export fn getReturnData(result_handle: u32, out_ptr: [*]u8, out_len: usize) usize {
    // Copy result data to the provided buffer
    // Return actual bytes copied
}
```

**Tests to Add**:
- Test WebAssembly compilation
- Test JavaScript integration
- Test data transfer between environments
- Test error handling and resource management

---

### Issue #27: Call Frame Management
**Tags**: `calls`, `execution`, `context`

Implement call frame management to handle nested calls (CALL, DELEGATECALL, STATICCALL, etc.) with proper context isolation and data sharing.

**Requirements**:
- Implement a call frame structure that captures execution context
- Support parent-child relationships between frames
- Handle memory, stack, and storage access across call boundaries
- Implement proper gas forwarding and return behavior

**Implementation Reference**:
```zig
// Call frame structure to track execution context
pub const CallFrame = struct {
    // Execution context
    caller: Address,
    code_address: Address,
    value: U256,
    gas: u64,
    depth: u16,
    read_only: bool,
    
    // Call data
    input_data: []const u8,
    
    // Return handling
    return_data: []u8,
    return_size: usize,
    
    // Execution state
    interpreter: *Interpreter,
    
    // Parent frame for returns
    parent: ?*CallFrame,
    
    // Initialize a new call frame
    pub fn init(
        allocator: std.mem.Allocator,
        parent: ?*CallFrame,
        caller: Address,
        code_address: Address,
        code: []const u8,
        input: []const u8,
        value: U256,
        gas: u64,
        read_only: bool,
    ) !*CallFrame {
        // Implementation
    }
    
    // Execute this call frame
    pub fn execute(self: *CallFrame) ExecutionResult {
        // Setup local interpreter
        // Execute code with proper context
        // Handle return data
    }
    
    // Clean up resources
    pub fn deinit(self: *CallFrame) void {
        // Free resources
    }
};
```

**Tests to Add**:
- Test simple CALL operations
- Test DELEGATECALL context preservation
- Test STATICCALL read-only enforcement
- Test nested calls with proper gas allocation

---

### Issue #28: Testing Infrastructure
**Tags**: `testing`, `conformance`, `benchmarks`

Create comprehensive testing infrastructure to validate ZigEVM against Ethereum specifications and measure performance.

**Requirements**:
- Implement unit tests for individual components
- Create integration tests for full execution paths
- Build conformance tests against Ethereum test vectors
- Implement benchmarking suite for performance comparison

**Implementation Reference**:
```zig
// From tests/conformance/ethereum_tests.zig (to be created)
pub fn runGeneralStateTest(
    allocator: std.mem.Allocator,
    test_file: []const u8
) !void {
    // Load test vector
    const test_data = try std.fs.cwd().readFileAlloc(allocator, test_file, 10 * 1024 * 1024);
    defer allocator.free(test_data);
    
    // Parse JSON
    var parser = std.json.Parser.init(allocator, false);
    defer parser.deinit();
    
    var data = try parser.parse(test_data);
    defer data.deinit();
    
    // Execute test cases
    // ...
}
```

**Tests to Add**:
- Basic VM operations tests
- Gas calculation tests
- State transitions tests
- Ethereum test vectors (from ethereum/tests repository)
- Performance benchmarks against other implementations

---

### Issue #29: Bytecode Analysis and Optimization
**Tags**: `optimization`, `analysis`, `gas`

Implement advanced bytecode analysis to enable more efficient execution.

**Requirements**:
- Implement static analysis of bytecode to identify basic blocks
- Precompute gas costs for basic blocks where possible
- Optimize jump table handling and destination validation
- Support efficient handling of common bytecode patterns

**Implementation Reference**:
```cpp
// From evmone/lib/evmone/advanced_analysis.cpp
AdvancedCodeAnalysis analyze(bytes_view code) noexcept
{
    AdvancedCodeAnalysis analysis;
    analysis.instrs.reserve(code.size());
    
    // Step 1: Build a table of jumpdest instructions
    std::unordered_set<uint32_t> jumpdest_map;
    uint32_t i = 0;
    while (i < code.size()) {
        // ... implementation to identify jump destinations
    }
    
    // Step 2: Basic block analysis
    i = 0;
    auto block_begin = 0;
    while (i < code.size()) {
        // ... implementation to identify basic blocks
    }
    
    return analysis;
}
```

**Tests to Add**:
- Test basic block identification
- Test jump destination validation
- Test gas cost precomputation
- Test optimized execution path

---

### Issue #30: Instrumentation and Profiling
**Tags**: `debugging`, `profiling`, `optimization`

Implement instrumentation and profiling capabilities to help with debugging and performance optimization.

**Requirements**:
- Add instrumentation hooks at key execution points
- Implement execution profiling to identify bottlenecks
- Create debugging tools for stepping through execution
- Support collection of execution statistics

**Implementation Reference**:
```zig
// From src/profiler/profiler.zig (to be created)
pub const ExecutionProfiler = struct {
    // Profiling data
    op_counts: [256]u32,
    gas_used_by_op: [256]u64,
    execution_time_by_op: [256]u64,
    memory_access_count: u32,
    storage_access_count: u32,
    call_count: u32,
    
    // Timestamping
    timer: std.time.Timer,
    last_timestamp: u64,
    
    // Initialize a new profiler
    pub fn init() !ExecutionProfiler {
        // Implementation
    }
    
    // Record the start of an opcode execution
    pub fn beginOp(self: *ExecutionProfiler, opcode: u8) void {
        // Record start time
    }
    
    // Record the end of an opcode execution
    pub fn endOp(self: *ExecutionProfiler, opcode: u8, gas_used: u64) void {
        // Record timing and stats
    }
    
    // Generate a profiling report
    pub fn generateReport(self: *ExecutionProfiler, writer: anytype) !void {
        // Generate human-readable report
    }
};
```

**Tests to Add**:
- Test profiling of simple contracts
- Test identification of gas-intensive operations
- Test reporting functionality

---

### Issue #31: SIMD-optimized EVM Operations
**Tags**: `optimization`, `simd`, `performance`

Implement SIMD (Single Instruction, Multiple Data) optimizations for key EVM operations to improve performance.

**Requirements**:
- Identify operations that can benefit from SIMD parallelism
- Implement SIMD-optimized versions of these operations
- Ensure proper fallback for platforms without SIMD support
- Measure and verify performance improvements

**Implementation Reference**:
```zig
// From src/simd/math.zig (to be created)
const std = @import("std");
const builtin = @import("builtin");
const vector = std.meta.Vector;

// SIMD U256 addition if hardware supports it
pub fn addU256Simd(a: *const U256, b: *const U256, result: *U256) void {
    if (comptime builtin.cpu.arch.isX86() and builtin.cpu.features.avx2) {
        // AVX2 implementation
        const a_vec = @as(vector(4, u64), a.words);
        const b_vec = @as(vector(4, u64), b.words);
        
        // Need to handle carries manually as vector adds don't carry across lanes
        var sum_vec = a_vec +% b_vec;
        
        // Handle carries between vector lanes
        // ... implementation
        
        result.words = sum_vec;
    } else {
        // Fallback implementation
        var carry: u1 = 0;
        inline for (0..4) |i| {
            const partial_sum = @addWithOverflow(a.words[i], b.words[i]);
            const with_carry = @addWithOverflow(partial_sum[0], carry);
            result.words[i] = with_carry[0];
            carry = @intCast(partial_sum[1] | with_carry[1]);
        }
    }
}
```

**Tests to Add**:
- Test SIMD-optimized operations against scalar implementations
- Test on different CPU architectures
- Benchmark performance improvements
- Test edge cases to ensure correctness

---

### Issue #32: Account Management and State Interface
**Tags**: `state`, `accounts`, `core`

Implement account management and state interface to handle Ethereum accounts, balances, and storage.

**Requirements**:
- Create account structure to track balance, nonce, code, and storage
- Implement state management interface for account operations
- Support efficient storage and retrieval of account data
- Handle account creation, modification, and deletion

**Implementation Reference**:
```rust
// From revm/crates/state/src/lib.rs
pub struct Account {
    /// Account nonce.
    pub nonce: u64,
    /// Account balance.
    pub balance: U256,
    /// Account code hash.
    pub code_hash: H256,
    /// Account storage root.
    pub storage_root: H256,
}

pub trait State {
    /// Get a copy of an account.
    fn get_account(&self, address: &Address) -> Option<Account>;
    
    /// Get account storage value.
    fn get_storage(&self, address: &Address, key: &H256) -> Option<H256>;
    
    /// Set account storage value.
    fn set_storage(&mut self, address: &Address, key: H256, value: H256) -> Result<(), Error>;
    
    /// Create or update an account.
    fn set_account(&mut self, address: &Address, account: Account) -> Result<(), Error>;
    
    /// Remove an account.
    fn remove_account(&mut self, address: &Address) -> Result<(), Error>;
    
    /// Check if an account exists.
    fn account_exists(&self, address: &Address) -> bool;
}
```

**Tests to Add**:
- Test account creation, reading, updating, and deletion
- Test storage operations (get, set, delete)
- Test state transitions and rollbacks
- Test account balance and nonce operations

---

### Issue #33: Transaction Execution and Processing
**Tags**: `transaction`, `execution`, `core`

Implement transaction execution and processing to handle Ethereum transactions in the EVM.

**Requirements**:
- Create transaction structure with appropriate fields (nonce, gas price, etc.)
- Implement transaction validation and signature verification
- Support different transaction types (legacy, EIP-1559, etc.)
- Handle transaction execution flow (state transitions, gas payment, etc.)

**Implementation Reference**:
```rust
// From revm/crates/state/src/transaction.rs
pub struct Transaction {
    /// Transaction nonce.
    pub nonce: u64,
    /// Gas price.
    pub gas_price: U256,
    /// Gas limit.
    pub gas_limit: u64,
    /// Transaction target address.
    pub to: Option<Address>,
    /// Transaction value.
    pub value: U256,
    /// Transaction data.
    pub data: Bytes,
    
    // EIP-1559 fields
    pub max_fee_per_gas: Option<U256>,
    pub max_priority_fee_per_gas: Option<U256>,
    
    // EIP-2930 fields
    pub access_list: Vec<(Address, Vec<H256>)>,
    
    // EIP-4844 fields
    pub blob_hashes: Vec<H256>,
    pub max_fee_per_blob_gas: Option<U256>,
}

// From revm/crates/handler/src/lib.rs
pub fn execute_transaction(env: &Env, tx: &Transaction, state: &mut dyn State) -> Result<TransactionResult, Error> {
    // Validate transaction
    validate_transaction(tx, state)?;
    
    // Pay for gas upfront
    let gas_cost = tx.gas_limit * tx.effective_gas_price();
    state.subtract_balance(&tx.sender, gas_cost)?;
    
    // Execute the transaction
    let result = match tx.to {
        Some(to) => {
            // Call to an existing account
            execute_call(env, tx, to, state)?
        }
        None => {
            // Contract creation
            execute_create(env, tx, state)?
        }
    };
    
    // Process gas refund
    let refund = calculate_gas_refund(tx, &result);
    state.add_balance(&tx.sender, refund)?;
    
    // Apply state changes if successful, otherwise revert
    if result.status == TransactionStatus::Success {
        state.commit();
    } else {
        state.revert();
    }
    
    Ok(result)
}
```

**Tests to Add**:
- Test transaction validation
- Test different transaction types
- Test transaction execution flow
- Test gas payment and refunds
- Test state changes from transactions

---

### Issue #34: EVM Events and Logging
**Tags**: `events`, `logs`, `core`

Implement EVM events and logging to support the LOG opcodes and enable proper event emission.

**Requirements**:
- Create log entry structure with address, topics, and data
- Implement LOG0-LOG4 opcodes with proper gas calculations
- Support event collection during execution
- Provide access to logs in execution results

**Implementation Reference**:
```rust
// From revm/crates/primitives/src/log.rs
pub struct Log {
    /// Contract address.
    pub address: Address,
    /// Log topics (0 to 4).
    pub topics: Vec<B256>,
    /// Log data.
    pub data: Bytes,
}

// From revm/crates/interpreter/src/instructions/host.rs
pub fn log<const N: usize, H: Host + ?Sized>(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
    host: &mut H,
) {
    require_non_staticcall!(interpreter);

    popn!([offset, len], interpreter);
    let len = as_usize_or_fail!(interpreter, len);
    gas_or_fail!(interpreter, gas::log_cost(N as u8, len as u64));
    let data = if len == 0 {
        Bytes::new()
    } else {
        let offset = as_usize_or_fail!(interpreter, offset);
        resize_memory!(interpreter, offset, len);
        Bytes::copy_from_slice(interpreter.memory.slice_len(offset, len).as_ref())
    };
    if interpreter.stack.len() < N {
        interpreter
            .control
            .set_instruction_result(InstructionResult::StackUnderflow);
        return;
    }
    let Some(topics) = interpreter.stack.popn::<N>() else {
        interpreter
            .control
            .set_instruction_result(InstructionResult::StackUnderflow);
        return;
    };

    let log = Log {
        address: interpreter.input.target_address(),
        data: LogData::new(topics.into_iter().map(B256::from).collect(), data)
            .expect("LogData should have <=4 topics"),
    };

    host.log(log);
}
```

**Tests to Add**:
- Test LOG0-LOG4 opcodes
- Test log data retrieval
- Test topic filtering
- Test log emission in different contexts (CREATE, CALL, etc.)
- Test static call restrictions

---

### Issue #35: Transaction Pool and Mempool Management
**Tags**: `txpool`, `mempool`, `transactions`

Implement a transaction pool and mempool management system for handling pending transactions.

**Requirements**:
- Create a transaction pool structure to store and manage pending transactions
- Implement transaction sorting based on gas price and other factors
- Support transaction replacement and cancellation
- Handle transaction validation and nonce ordering

**Implementation Reference**:
```rust
// Simplified txpool implementation
pub struct TransactionPool {
    /// Transactions grouped by sender and sorted by nonce
    by_sender: HashMap<Address, BTreeMap<u64, Transaction>>,
    /// Transactions sorted by gas price
    by_gas_price: BTreeSet<TransactionOrder>,
}

impl TransactionPool {
    /// Create a new transaction pool
    pub fn new() -> Self {
        Self {
            by_sender: HashMap::new(),
            by_gas_price: BTreeSet::new(),
        }
    }
    
    /// Add a transaction to the pool
    pub fn add(&mut self, tx: Transaction) -> Result<(), Error> {
        // Validate transaction
        self.validate(&tx)?;
        
        // Check if this is a replacement transaction
        if let Some(sender_txs) = self.by_sender.get_mut(&tx.sender) {
            if let Some(old_tx) = sender_txs.get(&tx.nonce) {
                // Ensure new gas price is at least 10% higher for replacement
                if tx.effective_gas_price() < old_tx.effective_gas_price() * 110 / 100 {
                    return Err(Error::ReplacementUnderpriced);
                }
                
                // Remove old transaction
                sender_txs.remove(&tx.nonce);
                self.by_gas_price.remove(&TransactionOrder::new(old_tx));
            }
        }
        
        // Add to sender map
        self.by_sender
            .entry(tx.sender)
            .or_insert_with(BTreeMap::new)
            .insert(tx.nonce, tx.clone());
        
        // Add to gas price index
        self.by_gas_price.insert(TransactionOrder::new(&tx));
        
        Ok(())
    }
    
    /// Get next batch of transactions to mine
    pub fn get_pending(&self, gas_limit: u64) -> Vec<Transaction> {
        // Implementation to select valid transactions up to gas limit
    }
}
```

**Tests to Add**:
- Test transaction adding and removal
- Test transaction ordering by gas price
- Test transaction replacement rules
- Test pending transaction selection
- Test nonce gap handling

---

### Issue #36: Multiple EIP Support and EVM Versioning
**Tags**: `eips`, `versioning`, `compatibility`

Implement support for multiple Ethereum Improvement Proposals (EIPs) and EVM versioning.

**Requirements**:
- Create a versioning system to track EVM revisions
- Implement feature flags for individual EIPs
- Support conditional execution based on EVM version
- Handle backward compatibility concerns

**Implementation Reference**:
```rust
// From revm/crates/primitives/src/spec_id.rs
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum SpecId {
    FRONTIER, // First Ethereum version
    HOMESTEAD,
    TANGERINE,
    SPURIOUS_DRAGON,
    BYZANTIUM,
    CONSTANTINOPLE,
    PETERSBURG,
    ISTANBUL,
    BERLIN,
    LONDON,
    MERGE,
    SHANGHAI,
    CANCUN,
    PRAGUE,
    OSAKA,
}

impl SpecId {
    /// Check if a specific EIP is enabled in this spec
    pub fn is_enabled(&self, eip: Eip) -> bool {
        match eip {
            Eip::Eip2718TypedTx => *self >= Self::BERLIN, // EIP-2718 started in Berlin
            Eip::Eip1559FeeMarket => *self >= Self::LONDON, // EIP-1559 started in London
            Eip::Eip4844BlobTx => *self >= Self::CANCUN, // EIP-4844 started in Cancun
            // ... other EIPs
        }
    }
}
```

**Tests to Add**:
- Test feature detection for different EVM versions
- Test behavior changes between versions
- Test conditional execution paths
- Test EIP-specific functionality
- Test backward compatibility

This document will be updated as we identify more missing functionality or refine existing issues.

## Integration and Protocol

### Issue #37: EVM Specifications and Conformance Testing
**Tags**: `specification`, `conformance`, `testing`

Implement comprehensive conformance testing against official Ethereum test vectors to ensure compatibility with the EVM specification.

**Requirements**:
- Set up infrastructure to run official Ethereum test vectors
- Implement test harnesses for all test types (general state tests, VM tests, etc.)
- Create tools to automatically update and run tests
- Track compliance across different EVM versions and forks

**Implementation Reference**:
```cpp
// From evmone/test/unittests/evm_test.cpp
TEST(evm, general_state_test)
{
    // Load a state test from the Ethereum tests repository
    const auto state_test = load_state_test("GeneralStateTests/stExample/add11.json");
    
    // For each test case in the state test
    for (const auto& test_case : state_test.test_cases)
    {
        // Create a state with the pre-state from the test
        state::State state;
        initialize_state(state, test_case.pre);
        
        // Execute the transaction
        const auto result = execute_transaction(state, test_case.transaction);
        
        // Verify the post-state matches the expected state
        verify_state(state, test_case.post);
    }
}
```

**Tests to Add**:
- Ethereum Foundation state tests
- VM tests
- Blockchain tests
- Transaction tests
- Fork-specific compatibility tests

---

### Issue #38: JSON-RPC API Implementation
**Tags**: `json-rpc`, `api`, `integration`

Implement the standard Ethereum JSON-RPC API to allow the ZigEVM to be integrated with existing Ethereum tooling.

**Requirements**:
- Implement the full Ethereum JSON-RPC API specification
- Support all standard methods (eth_*, net_*, web3_*)
- Handle parameter validation and error reporting
- Provide extensibility for custom methods

**Implementation Reference**:
```rust
// From revm/crates/revm-primitives/src/jsonrpc.rs
pub async fn handle_request(
    state: Arc<RwLock<State>>,
    request: JsonRpcRequest,
) -> JsonRpcResponse {
    match request.method.as_str() {
        "eth_getBalance" => {
            let params: GetBalanceParams = parse_params(&request.params)?;
            let state = state.read().await;
            let balance = state.get_balance(&params.address, params.block_tag)?;
            JsonRpcResponse::success(request.id, balance)
        }
        "eth_call" => {
            let params: CallParams = parse_params(&request.params)?;
            let state = state.read().await;
            let result = state.call(&params.transaction, params.block_tag)?;
            JsonRpcResponse::success(request.id, result)
        }
        // ... other methods
        _ => JsonRpcResponse::error(request.id, JsonRpcError::method_not_found()),
    }
}
```

**Tests to Add**:
- Test each JSON-RPC method against specification
- Test error handling and invalid parameters
- Test concurrent request handling
- Test integration with web3 libraries