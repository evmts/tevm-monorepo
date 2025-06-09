# Implement Complete CALL Operations

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_complete_call_operations` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_complete_call_operations feat_implement_complete_call_operations`
3. **Work in isolation**: `cd g/feat_implement_complete_call_operations`
4. **Commit message**: `✨ feat: implement complete CALL operations with gas tracking`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Complete the implementation of CALL, CALLCODE, DELEGATECALL, and STATICCALL operations. These are currently set up but not wired up to properly track gas or execute recursive calls. This is critical for EVM compatibility and contract interaction.

## Ethereum Specification

### Call Operations Overview
- **CALL (0xF1)**: External call with new context and value transfer
- **CALLCODE (0xF2)**: Call with caller's context (deprecated)
- **DELEGATECALL (0xF4)**: Call with caller's context and sender
- **STATICCALL (0xFA)**: Read-only call, no state modifications

### Gas Calculation Rules
1. **Base Gas Cost**: Fixed cost per operation type
2. **Dynamic Gas**: Calculated based on call parameters
3. **63/64th Rule**: Maximum 63/64 of remaining gas can be forwarded
4. **Value Transfer Cost**: Additional cost for non-zero value transfers
5. **Account Creation Cost**: Cost when calling non-existent accounts
6. **Memory Expansion**: Cost for input/output memory expansion

### Call Stack Depth
- **Maximum Depth**: 1024 calls
- **Depth Tracking**: Each call increments depth counter
- **Overflow Protection**: Calls fail if depth exceeds limit

## Reference Implementations

### evmone Implementation
Files to search:
- Call operation implementations
- Gas calculation for calls
- Call stack management

### revm Implementation
Files to search:
- Call handler implementations
- Gas forwarding logic
- Context switching mechanisms

## Implementation Requirements

### Core Functionality
1. **Gas Calculation**: Accurate gas cost calculation per EVM spec
2. **Gas Forwarding**: Implement 63/64th gas forwarding rule
3. **Context Switching**: Proper isolation between contract calls
4. **Return Data Handling**: RETURNDATASIZE/RETURNDATACOPY support
5. **Value Transfer**: ETH transfer mechanics for CALL operations
6. **Static Call Protection**: Prevent state modifications in STATICCALL

### Call Input Structure
```zig
pub const CallInput = struct {
    contract_address: Address,
    caller: Address,
    value: U256,
    input: []const u8,
    gas_limit: u64,
    is_static: bool,
    depth: u32,
    
    // Context fields for DELEGATECALL
    original_caller: ?Address = null,
    original_value: ?U256 = null,
};
```

## Implementation Tasks

### Task 1: Complete Gas Calculation
File: `/src/evm/execution/system.zig` (modify existing)
```zig
pub fn calculate_call_gas(
    call_type: CallType,
    value: U256,
    target_exists: bool,
    remaining_gas: u64,
    memory_expansion_cost: u64,
) u64 {
    var gas_cost: u64 = switch (call_type) {
        .Call => if (value > 0) gas_constants.CALL_VALUE_COST else gas_constants.CALL_COST,
        .CallCode => gas_constants.CALLCODE_COST,
        .DelegateCall => gas_constants.DELEGATECALL_COST,
        .StaticCall => gas_constants.STATICCALL_COST,
    };
    
    // Add memory expansion cost
    gas_cost += memory_expansion_cost;
    
    // Add account creation cost if target doesn't exist
    if (!target_exists and call_type == .Call and value > 0) {
        gas_cost += gas_constants.ACCOUNT_CREATION_COST;
    }
    
    // Calculate gas to forward (63/64th rule)
    const gas_to_forward = calculate_63_64_gas(remaining_gas - gas_cost);
    
    return gas_cost + gas_to_forward;
}

fn calculate_63_64_gas(remaining_gas: u64) u64 {
    return remaining_gas - (remaining_gas / 64);
}
```

### Task 2: Implement Call Context Management
File: `/src/evm/call_context.zig` (new file)
```zig
pub const CallContext = struct {
    caller: Address,
    call_value: U256,
    call_data: []const u8,
    gas_limit: u64,
    gas_used: u64,
    depth: u32,
    is_static: bool,
    return_data: std.ArrayList(u8),
    
    pub fn init(allocator: std.mem.Allocator, input: CallInput) CallContext {
        return CallContext{
            .caller = input.caller,
            .call_value = input.value,
            .call_data = input.input,
            .gas_limit = input.gas_limit,
            .gas_used = 0,
            .depth = input.depth,
            .is_static = input.is_static,
            .return_data = std.ArrayList(u8).init(allocator),
        };
    }
    
    pub fn deinit(self: *CallContext) void {
        self.return_data.deinit();
    }
};
```

### Task 3: Complete CALL Operation
File: `/src/evm/execution/system.zig` (modify existing)
```zig
pub fn op_call(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    // Validate stack requirements
    if (interpreter.stack.size < 7) return ExecutionError.Error.StackUnderflow;
    if (interpreter.depth >= constants.MAX_CALL_DEPTH) return ExecutionError.Error.CallDepthExceeded;
    
    // Pop call parameters
    const gas = interpreter.stack.pop_unsafe();
    const target_address = Address.from_u256(interpreter.stack.pop_unsafe());
    const value = interpreter.stack.pop_unsafe();
    const args_offset = interpreter.stack.pop_unsafe();
    const args_size = interpreter.stack.pop_unsafe();
    const ret_offset = interpreter.stack.pop_unsafe();
    const ret_size = interpreter.stack.pop_unsafe();
    
    // Calculate memory expansion cost
    const memory_expansion = try interpreter.memory.calculate_expansion_cost(
        @max(args_offset + args_size, ret_offset + ret_size)
    );
    
    // Check if target account exists
    const target_exists = state.account_exists(target_address);
    
    // Calculate total gas cost
    const total_gas_cost = calculate_call_gas(
        .Call,
        value,
        target_exists,
        interpreter.gas_remaining,
        memory_expansion.cost,
    );
    
    // Check gas availability
    if (total_gas_cost > interpreter.gas_remaining) {
        return ExecutionError.Error.OutOfGas;
    }
    
    // Consume gas
    interpreter.gas_remaining -= total_gas_cost;
    
    // Handle value transfer
    if (value > 0) {
        try handle_value_transfer(state, interpreter.contract.address, target_address, value);
    }
    
    // Prepare call input
    const call_input = try prepare_call_input(
        interpreter,
        target_address,
        value,
        args_offset,
        args_size,
        false, // not static
    );
    
    // Execute the call
    const call_result = try execute_subcall(state, call_input);
    
    // Handle return data
    try handle_call_return(interpreter, call_result, ret_offset, ret_size);
    
    // Push success flag
    const success = if (call_result.is_success) 1 else 0;
    try interpreter.stack.push_unsafe(success);
    
    return Operation.ExecutionResult.continue_execution(pc + 1);
}
```

### Task 4: Implement DELEGATECALL Operation  
```zig
pub fn op_delegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    // Similar structure but preserve caller context
    // No value transfer in DELEGATECALL
    // Preserve original caller and value
    
    const call_input = CallInput{
        .contract_address = target_address,
        .caller = interpreter.contract.caller, // Preserve original caller
        .value = interpreter.contract.call_value, // Preserve original value
        .input = call_data,
        .gas_limit = gas_to_forward,
        .is_static = interpreter.is_static,
        .depth = interpreter.depth + 1,
    };
    
    // Execute with preserved context
    const call_result = try execute_subcall(state, call_input);
    
    // Handle result...
}
```

### Task 5: Implement STATICCALL Operation
```zig
pub fn op_staticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    // Similar to CALL but with static restrictions
    // No value parameter (implicitly 0)
    // Set is_static = true
    
    const call_input = CallInput{
        .contract_address = target_address,
        .caller = interpreter.contract.address,
        .value = 0, // No value transfer in STATICCALL
        .input = call_data,
        .gas_limit = gas_to_forward,
        .is_static = true, // Force static context
        .depth = interpreter.depth + 1,
    };
    
    // Execute in static context
    const call_result = try execute_subcall(state, call_input);
    
    // Handle result...
}
```

### Task 6: Implement Return Data Handling
File: `/src/evm/return_data.zig` (new file)
```zig
pub const ReturnData = struct {
    data: std.ArrayList(u8),
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) ReturnData {
        return ReturnData{
            .data = std.ArrayList(u8).init(allocator),
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *ReturnData) void {
        self.data.deinit();
    }
    
    pub fn set(self: *ReturnData, data: []const u8) !void {
        self.data.clearRetainingCapacity();
        try self.data.appendSlice(data);
    }
    
    pub fn get(self: *const ReturnData) []const u8 {
        return self.data.items;
    }
    
    pub fn size(self: *const ReturnData) usize {
        return self.data.items.len;
    }
};
```

### Task 7: Add Return Data Opcodes
File: `/src/evm/execution/system.zig` (add functions)
```zig
pub fn op_returndatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    const size = interpreter.return_data.size();
    try interpreter.stack.push_unsafe(@as(u256, @intCast(size)));
    return Operation.ExecutionResult.continue_execution(pc + 1);
}

pub fn op_returndatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    if (interpreter.stack.size < 3) return ExecutionError.Error.StackUnderflow;
    
    const dest_offset = interpreter.stack.pop_unsafe();
    const offset = interpreter.stack.pop_unsafe();
    const size = interpreter.stack.pop_unsafe();
    
    // Validate return data bounds
    const return_data = interpreter.return_data.get();
    if (offset + size > return_data.len) {
        return ExecutionError.Error.InvalidReturnDataAccess;
    }
    
    // Calculate memory expansion
    const memory_expansion = try interpreter.memory.calculate_expansion_cost(dest_offset + size);
    try interpreter.consume_gas(memory_expansion.cost);
    
    // Copy return data to memory
    const source_data = return_data[offset..offset + size];
    try interpreter.memory.write(dest_offset, source_data);
    
    return Operation.ExecutionResult.continue_execution(pc + 1);
}
```

### Task 8: Comprehensive Testing
File: `/test/evm/opcodes/call_operations_test.zig`

### Test Cases
1. **Basic CALL**: Simple contract-to-contract calls
2. **Value Transfer**: ETH transfer in CALL operations
3. **Gas Forwarding**: 63/64th rule implementation
4. **Call Depth**: Maximum depth enforcement
5. **DELEGATECALL Context**: Proper context preservation
6. **STATICCALL Restrictions**: State modification prevention
7. **Return Data**: RETURNDATASIZE/RETURNDATACOPY functionality
8. **Error Handling**: Out of gas, invalid calls, etc.
9. **Memory Expansion**: Complex memory access patterns
10. **Hardfork Compatibility**: Different gas costs across forks

## Integration Points

### Files to Modify
- `/src/evm/execution/system.zig` - Complete call operations
- `/src/evm/call_context.zig` - New call context management
- `/src/evm/return_data.zig` - New return data handling
- `/src/evm/vm.zig` - Integrate call stack management
- `/src/evm/frame.zig` - Add return data and depth tracking
- `/test/evm/opcodes/call_operations_test.zig` - Comprehensive tests

### Gas Constants
Add to `/src/evm/constants/gas_constants.zig`:
```zig
pub const CALL_COST: u64 = 700;
pub const CALL_VALUE_COST: u64 = 9000;
pub const CALLCODE_COST: u64 = 700;
pub const DELEGATECALL_COST: u64 = 700;
pub const STATICCALL_COST: u64 = 700;
pub const ACCOUNT_CREATION_COST: u64 = 25000;
```

## Performance Considerations

### Call Stack Optimization
```zig
// Efficient call stack management
pub const CallStack = struct {
    frames: std.ArrayList(CallFrame),
    depth: u32,
    
    pub fn push_frame(self: *CallStack, frame: CallFrame) !void {
        if (self.depth >= constants.MAX_CALL_DEPTH) {
            return ExecutionError.Error.CallDepthExceeded;
        }
        try self.frames.append(frame);
        self.depth += 1;
    }
    
    pub fn pop_frame(self: *CallStack) ?CallFrame {
        if (self.depth == 0) return null;
        self.depth -= 1;
        return self.frames.pop();
    }
};
```

### Memory Optimization
- **Return Data Pooling**: Reuse return data buffers
- **Call Context Pooling**: Reuse call context objects  
- **Stack Frame Pooling**: Minimize allocation overhead
- **Gas Calculation Caching**: Cache expensive calculations

## Complex Scenarios

### Recursive Calls
```zig
// Test recursive contract calls
test "recursive calls with gas limit" {
    // Contract A calls Contract B
    // Contract B calls Contract A again
    // Verify proper gas tracking and depth limits
}
```

### Mixed Call Types
```zig
// Test sequence: CALL -> DELEGATECALL -> STATICCALL
test "mixed call type sequence" {
    // Verify context preservation across different call types
    // Check gas accounting across the entire sequence
    // Validate return data handling
}
```

### Error Propagation
- Gas exhaustion during calls
- Revert in nested calls
- Static call violations
- Call depth exceeded

## Success Criteria

1. **Ethereum Compatibility**: Matches reference implementation behavior
2. **Gas Accuracy**: Exact gas costs per EVM specification
3. **Context Isolation**: Proper context switching between calls
4. **Return Data**: Correct RETURNDATASIZE/RETURNDATACOPY behavior
5. **Error Handling**: Proper error propagation and recovery
6. **Performance**: Minimal overhead for call operations

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test all call types thoroughly** - Each has unique behavior
3. **Verify gas calculations exactly** - Must match specification
4. **Test call depth limits** - Critical for DoS protection
5. **Validate context switching** - Incorrect context breaks contracts
6. **Test error scenarios** - Proper error handling is crucial

## References

- [EVM Call Operations](https://ethereum.github.io/yellowpaper/paper.pdf)
- [EIP-7: DELEGATECALL](https://eips.ethereum.org/EIPS/eip-7)
- [EIP-214: Static Call](https://eips.ethereum.org/EIPS/eip-214)
- [Gas Cost Calculations](https://www.evm.codes/)

## Reference Implementations

### revm

<explanation>
Revm implements call operations in a sophisticated way that separates gas calculation, memory management, and actual call execution. The key patterns:

1. **Gas Calculation**: Uses `call_cost()` function that considers hardfork rules, value transfers, and account state
2. **Memory Management**: `get_memory_input_and_out_ranges()` handles input/output memory expansion with proper gas accounting
3. **Call Execution**: Creates `CallInputs` structure and delegates to interpreter action system
4. **63/64 Gas Rule**: Uses `remaining_63_of_64_parts()` for gas forwarding calculation

The implementation is very clean with clear separation of concerns and proper hardfork compatibility.
</explanation>

<filename>revm/crates/interpreter/src/instructions/contract.rs</filename>
<line start="528" end="588">
```rust
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
```
</line>

<filename>revm/crates/interpreter/src/instructions/contract.rs</filename>
<line start="645" end="691">
```rust
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
```
</line>

<filename>revm/crates/interpreter/src/instructions/contract.rs</filename>
<line start="693" end="737">
```rust
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
</line>

<filename>revm/crates/interpreter/src/instructions/contract/call_helpers.rs</filename>
<line start="46" end="72">
```rust
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
</line>

<filename>revm/crates/interpreter/src/gas/calc.rs</filename>
<line start="261" end="317">
```rust
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
```
</line>

<filename>revm/crates/interpreter/src/instructions/system.rs</filename>
<line start="155" end="197">
```rust
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
```
</line>