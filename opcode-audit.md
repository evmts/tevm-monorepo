# EVM Opcode Audit (Zig Implementation vs. revm)

## Opcode Group: 0x10 - Comparison & Bitwise Logic Operations

This document provides a systematic review of EVM opcodes, comparing against the `revm` reference implementation to identify potential areas for improvement and correctness in the Zig EVM.

### `0x10` LT (LessThan)

**Purpose:** Pops two items (`a`, `b`) from the stack and pushes `1` if `a < b`, otherwise `0`. Comparison is unsigned.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):**
```rust
pub fn lt<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 is value popped first (stack top - 1), op2 is stack top
                                                // This means op1 = b, op2 = a for a < b
                                                // So it becomes *op2 = U256::from(op1 < *op2); which is effectively b < a
                                                // EVM spec: s[0] = s[1] < s[0] ? 1 : 0. s[0] is top, s[1] is second.
                                                // So, it's second < top.
                                                // revm's popn_top!([op1], op2, ...) means op1 = stack[len-2], op2 = &mut stack[len-1]
                                                // The operation *op2 = U256::from(op1 < *op2) means stack[len-1] = stack[len-2] < stack[len-1]
    *op2 = U256::from(op1 < *op2);
}
```
*Correction on `revm` stack order interpretation:*
`popn_top!([op1], op2, ...)`:
  `op1` will be assigned `stack.pop()`, so it's the second element from top (`a`).
  `op2` will be a mutable reference to `stack.top()`, so it's the top element (`b`).
The operation `*op2 = U256::from(op1 < *op2)` means the top of the stack becomes `(second_from_top < original_top)`.
This matches the EVM specification: `s[1] < s[0]`.

**Zig EVM Review Points (`test.todo.md` for `op_lt` / `op_gt` in `arithmetic_sequences_test.test.Integration: Conditional arithmetic based on comparison`):**
*   **Correctness:**
    *   **Stack Order:** The EVM pops `value2` then `value1` and computes `value1 < value2`. Your Zig implementation must ensure this order:
        ```
        val2 = stack.pop() // top item
        val1 = stack.pop() // second item
        result = (val1 < val2)
        stack.push(result)
        ```
        The `test.todo.md` had a failure in `arithmetic_sequences_test.test.Integration: Conditional arithmetic based on comparison` related to `GT` which was due to incorrect operand order and was supposedly fixed for `GT` and `LT` in `src/evm/opcodes/comparison.zig`. Double-check this fix is robust for `LT` as well.
    *   **Unsigned Comparison:** Ensure the comparison is strictly unsigned.
    *   **Result:** The result pushed to the stack must be `U256(1)` for true or `U256(0)` for false.
*   **Gas:** `VERYLOW` (3 gas) should be consumed *before* execution.
*   **Performance:** Standard U256 comparison should be efficient.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/comparison.zig (or similar)

const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig"); // Assuming Vm might be needed for gas or context
const gas_constants = @import("../gas_constants.zig");
const error_mapping = @import("../error_mapping.zig");

// ... other imports and helpers ...

pub fn op_lt(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc; // pc usually not directly used in simple arithmetic/comparison opcodes
    _ = interpreter; // May be needed if accessing Vm context via interpreter

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop operands: val2 is popped first (top of stack), then val1
    // EVM spec: result = (stack[top-1] < stack[top])
    // stack.pop() gets stack[top]
    // stack.pop() again gets stack[top-1] (which was originally stack[top-1])
    // So if val2 = pop(), val1 = pop(), then it's val1 < val2
    const val2 = try error_mapping.stack_pop(&frame.stack);
    const val1 = try error_mapping.stack_pop(&frame.stack);

    const result_bool = val1 < val2;
    const result_u256: u256 = if (result_bool) 1 else 0;

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/comparison_test.zig

test "Comparison: LT (less than) operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: a < b (true)
    // Stack before: [..., 5, 10] (10 is top)
    // Operation: 5 < 10
    try test_frame.pushStack(&[_]u256{ 5, 10 });
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame); // LT
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Result is 1 (true)
    try testing.expectEqual(@as(usize, 1), test_frame.stackSize());
    _ = try test_frame.popStack(); // Clear stack

    // Test 2: a > b (false)
    // Stack before: [..., 10, 5] (5 is top)
    // Operation: 10 < 5
    try test_frame.pushStack(&[_]u256{ 10, 5 });
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Result is 0 (false)
    _ = try test_frame.popStack();

    // Test 3: a == b (false)
    // Stack before: [..., 7, 7] (7 is top)
    // Operation: 7 < 7
    try test_frame.pushStack(&[_]u256{ 7, 7 });
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Result is 0 (false)
    _ = try test_frame.popStack();

    // Test 4: Edge case with 0
    // Stack before: [..., 0, 1] (1 is top)
    // Operation: 0 < 1
    try test_frame.pushStack(&[_]u256{ 0, 1 });
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Result is 1 (true)
    _ = try test_frame.popStack();

    // Test 5: Edge case with MAX_U256
    // Stack before: [..., MAX_U256 - 1, MAX_U256]
    // Operation: (MAX_U256 - 1) < MAX_U256
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ max_u256 - 1, max_u256 });
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Result is 1 (true)
    _ = try test_frame.popStack();

    // Test 6: MAX_U256 < 0 (false)
    // Stack before: [..., MAX_U256, 0]
    // Operation: MAX_U256 < 0
    try test_frame.pushStack(&[_]u256{ max_u256, 0 });
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Result is 0 (false)
    _ = try test_frame.popStack();
}
```

### `0x11` GT (GreaterThan)

**Purpose:** Pops two items (`a`, `b`) from the stack and pushes `1` if `a > b`, otherwise `0`. Comparison is unsigned.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):**
```rust
pub fn gt<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = stack[len-2], op2 = &mut stack[len-1]
                                                // EVM spec: s[0] = s[1] > s[0] ? 1 : 0
                                                // op1 is second from top (s[1]), *op2 is original top (s[0])
                                                // Operation: stack[len-1] = stack[len-2] > stack[len-1]
    *op2 = U256::from(op1 > *op2);
}
```
**Stack Order Interpretation (same as LT):**
`popn_top!([op1], op2, ...)`:
  `op1` is assigned `stack.pop()` (effectively the second element from the original top, let's call it `a`).
  `op2` is a mutable reference to `stack.top()` (effectively the original top element, let's call it `b`).
The operation `*op2 = U256::from(op1 > *op2)` means the new top of the stack becomes `(a > b)`.
This matches the EVM specification: `s[1] > s[0]`.

**Zig EVM Review Points (`test.todo.md` for `op_lt` / `op_gt` in `arithmetic_sequences_test.test.Integration: Conditional arithmetic based on comparison`):**
*   **Correctness:**
    *   **Stack Order:** The EVM pops `value2` then `value1` and computes `value1 > value2`. Your Zig implementation must ensure this order:
        ```
        val2 = stack.pop() // top item
        val1 = stack.pop() // second item
        result = (val1 > val2)
        stack.push(result)
        ```
        The `test.todo.md` specifically mentioned "Correct GT opcode operand order for comparison tests" as a fix. This needs to be robustly verified. The previous failure `arithmetic_sequences_test.test.Integration: Conditional arithmetic based on comparison` directly implicates `GT` or its interaction with conditional logic.
    *   **Unsigned Comparison:** Comparison must be unsigned.
    *   **Result:** Push `U256(1)` for true, `U256(0)` for false.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Standard U256 comparison.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/comparison.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports) ...

pub fn op_gt(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop operands: val2 is popped first (top of stack), then val1
    // EVM spec: result = (stack[top-1] > stack[top])
    const val2 = try error_mapping.stack_pop(&frame.stack);
    const val1 = try error_mapping.stack_pop(&frame.stack);

    const result_bool = val1 > val2;
    const result_u256: u256 = if (result_bool) 1 else 0;

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/comparison_test.zig

test "Comparison: GT (greater than) operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: a > b (true)
    // Stack before: [..., 10, 5] (5 is top)
    // Operation: 10 > 5
    try test_frame.pushStack(&[_]u256{ 10, 5 });
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame); // GT
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Result is 1 (true)
    _ = try test_frame.popStack();

    // Test 2: a < b (false)
    // Stack before: [..., 5, 10] (10 is top)
    // Operation: 5 > 10
    try test_frame.pushStack(&[_]u256{ 5, 10 });
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Result is 0 (false)
    _ = try test_frame.popStack();

    // Test 3: a == b (false)
    // Stack before: [..., 7, 7] (7 is top)
    // Operation: 7 > 7
    try test_frame.pushStack(&[_]u256{ 7, 7 });
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Result is 0 (false)
    _ = try test_frame.popStack();

    // Test 4: Edge case with 0
    // Stack before: [..., 1, 0] (0 is top)
    // Operation: 1 > 0
    try test_frame.pushStack(&[_]u256{ 1, 0 });
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Result is 1 (true)
    _ = try test_frame.popStack();

    // Test 5: Edge case with MAX_U256
    // Stack before: [..., MAX_U256, MAX_U256 - 1]
    // Operation: MAX_U256 > (MAX_U256 - 1)
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ max_u256, max_u256 - 1 });
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Result is 1 (true)
    _ = try test_frame.popStack();

    // Test 6: 0 > MAX_U256 (false)
    // Stack before: [..., 0, MAX_U256]
    // Operation: 0 > MAX_U256
    try test_frame.pushStack(&[_]u256{ 0, max_u256 });
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Result is 0 (false)
    _ = try test_frame.popStack();
}
```

### `0x12` SLT (Signed LessThan)

**Purpose:** Pops two items (`a`, `b`) from the stack, interprets them as signed 256-bit integers (two's complement), and pushes `1` if `a < b` (signed comparison), otherwise `0`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs` and `i256.rs`):**
```rust
// In bitwise.rs
pub fn slt<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = stack[len-2], op2 = &mut stack[len-1]
                                                // Operation: stack[len-1] = (op1 as i256) < (*op2 as i256)
    *op2 = U256::from(i256_cmp(&op1, op2) == Ordering::Less);
}

// In i256.rs (relevant parts)
#[inline]
pub fn i256_cmp(first: &U256, second: &U256) -> Ordering {
    let first_sign = i256_sign(first);  // Determines sign based on MSB
    let second_sign = i256_sign(second);
    match first_sign.cmp(&second_sign) { // Negative < Zero < Positive
        Ordering::Equal => first.cmp(second), // If signs are same, unsigned cmp is fine for magnitude
        o => o, // If signs differ, that determines order
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(i8)]
pub enum Sign {
    Minus = -1, // MSB is 1
    Zero = 0,   // Value is 0
    Plus = 1,   // MSB is 0 and value is not 0
}

#[inline]
pub fn i256_sign(val: &U256) -> Sign {
    if val.bit(U256::BITS - 1) { // Check MSB (255th bit)
        Sign::Minus
    } else {
        // SAFETY: false == 0 == Zero, true == 1 == Plus
        unsafe { core::mem::transmute::<bool, Sign>(!val.is_zero()) }
    }
}
```
**Stack Order Interpretation (same as LT/GT):**
The operation becomes `new_stack_top = (signed(second_from_top) < signed(original_top))`.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Same as `LT`/`GT`: `val2 = stack.pop()`, `val1 = stack.pop()`, then compare `signed(val1) < signed(val2)`.
    *   **Signed Interpretation:** This is the crucial part. `U256` values from the stack must be treated as two's complement signed integers.
        *   In Zig, you can achieve this by `@bitCast`ing the `u256` to an `i256` (assuming you have a `i256` type or are using `std.meta.Int(.signed, 256)`).
        *   The comparison logic then needs to handle the signs correctly:
            *   Negative numbers are "less than" positive numbers.
            *   For two negative numbers, the one with the larger absolute value (magnitude) is "less than". E.g., -5 < -2.
            *   For two positive numbers, standard unsigned comparison works.
        *   `revm`'s `i256_cmp` function effectively does this by first comparing signs, and if signs are the same, it uses the standard `U256` comparison (which works for positive magnitudes and for negative magnitudes when both are negative due to two's complement properties).
    *   **Result:** Push `U256(1)` for true, `U256(0)` for false.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Signed comparison might involve a few more checks than unsigned, but should still be very fast.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/comparison.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports) ...

pub fn op_slt(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const val2_u256 = try error_mapping.stack_pop(&frame.stack);
    const val1_u256 = try error_mapping.stack_pop(&frame.stack);

    // Interpret as signed integers (two's complement)
    // In Zig, direct comparison of i256 values will handle this.
    const val1_i256 = @as(i256, @bitCast(val1_u256));
    const val2_i256 = @as(i256, @bitCast(val2_u256));

    // Alternative manual sign check if not using a direct i256 type comparison:
    // const msb_val1 = (val1_u256 >> 255) & 1;
    // const msb_val2 = (val2_u256 >> 255) & 1;
    // var result_bool: bool = undefined;
    // if (msb_val1 != msb_val2) { // Different signs
    //     result_bool = (msb_val1 == 1); // val1 is negative, val2 is positive, so val1 < val2
    // } else { // Same signs
    //     result_bool = val1_u256 < val2_u256; // For same signs, unsigned comparison of magnitudes works
    //                                        // (e.g., -2 (0xFE) < -1 (0xFF) in u8; 5 < 10)
    // }

    const result_bool = val1_i256 < val2_i256;
    const result_u256: u256 = if (result_bool) 1 else 0;

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/comparison_test.zig

fn to_i256_twos_complement(val: i256) u256 {
    return @as(u256, @bitCast(val));
}

test "Comparison: SLT (signed less than) operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Positive a < Positive b (5 < 10)
    try test_frame.pushStack(&[_]u256{ 5, 10 });
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame); // SLT
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();

    // Test 2: Positive a > Positive b (10 < 5)
    try test_frame.pushStack(&[_]u256{ 10, 5 });
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 3: Negative a < Positive b (-5 < 10)
    try test_frame.pushStack(&[_]u256{ to_i256_twos_complement(-5), 10 });
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();

    // Test 4: Positive a < Negative b (5 < -10)
    try test_frame.pushStack(&[_]u256{ 5, to_i256_twos_complement(-10) });
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 5: Negative a < Negative b (-10 < -5)
    try test_frame.pushStack(&[_]u256{ to_i256_twos_complement(-10), to_i256_twos_complement(-5) });
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();

    // Test 6: Negative a > Negative b (-5 < -10)
    try test_frame.pushStack(&[_]u256{ to_i256_twos_complement(-5), to_i256_twos_complement(-10) });
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 7: Equal values (0 < 0)
    try test_frame.pushStack(&[_]u256{ 0, 0 });
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 8: Equal negative values (-5 < -5)
    try test_frame.pushStack(&[_]u256{ to_i256_twos_complement(-5), to_i256_twos_complement(-5) });
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 9: Minimum signed vs maximum signed
    const min_i256 = @as(u256, 1) << 255;
    const max_i256 = (@as(u256, 1) << 255) - 1;
    try test_frame.pushStack(&[_]u256{ min_i256, max_i256 }); // min_i256 < max_i256
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();
}
```

### `0x13` SGT (Signed GreaterThan)

**Purpose:** Pops two items (`a`, `b`) from the stack, interprets them as signed 256-bit integers (two's complement), and pushes `1` if `a > b` (signed comparison), otherwise `0`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs` and `i256.rs`):**
```rust
// In bitwise.rs
pub fn sgt<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = stack[len-2], op2 = &mut stack[len-1]
                                                // Operation: stack[len-1] = (op1 as i256) > (*op2 as i256)
    *op2 = U256::from(i256_cmp(&op1, op2) == Ordering::Greater);
}

// In i256.rs (relevant parts for i256_cmp and i256_sign are the same as for SLT)
// ... (i256_cmp and i256_sign definitions as shown in SLT section) ...
```
**Stack Order Interpretation (same as LT/GT/SLT):**
The operation becomes `new_stack_top = (signed(second_from_top) > signed(original_top))`.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Same as `SLT`: `val2 = stack.pop()`, `val1 = stack.pop()`, then compare `signed(val1) > signed(val2)`.
    *   **Signed Interpretation:** Values must be treated as two's complement `i256`.
        *   Use `@bitCast` from `u256` to `i256` for direct signed comparison in Zig.
        *   Ensure logic correctly handles positive vs. negative, and comparisons between two negative numbers (e.g., -2 > -5).
    *   **Result:** Push `U256(1)` for true, `U256(0)` for false.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Similar to `SLT`.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/comparison.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports) ...

pub fn op_sgt(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const val2_u256 = try error_mapping.stack_pop(&frame.stack);
    const val1_u256 = try error_mapping.stack_pop(&frame.stack);

    const val1_i256 = @as(i256, @bitCast(val1_u256));
    const val2_i256 = @as(i256, @bitCast(val2_u256));

    const result_bool = val1_i256 > val2_i256;
    const result_u256: u256 = if (result_bool) 1 else 0;

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/comparison_test.zig

// fn to_i256_twos_complement(val: i256) u256 (already defined for SLT tests)

test "Comparison: SGT (signed greater than) operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Positive a > Positive b (10 > 5)
    try test_frame.pushStack(&[_]u256{ 10, 5 });
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame); // SGT
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();

    // Test 2: Positive a < Positive b (5 > 10)
    try test_frame.pushStack(&[_]u256{ 5, 10 });
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 3: Positive a > Negative b (10 > -5)
    try test_frame.pushStack(&[_]u256{ 10, to_i256_twos_complement(-5) });
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();

    // Test 4: Negative a > Positive b (-10 > 5)
    try test_frame.pushStack(&[_]u256{ to_i256_twos_complement(-10), 5 });
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 5: Negative a > Negative b (-5 > -10)
    try test_frame.pushStack(&[_]u256{ to_i256_twos_complement(-5), to_i256_twos_complement(-10) });
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();

    // Test 6: Negative a < Negative b (-10 > -5)
    try test_frame.pushStack(&[_]u256{ to_i256_twos_complement(-10), to_i256_twos_complement(-5) });
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 7: Equal values (0 > 0)
    try test_frame.pushStack(&[_]u256{ 0, 0 });
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 8: Equal negative values (-5 > -5)
    try test_frame.pushStack(&[_]u256{ to_i256_twos_complement(-5), to_i256_twos_complement(-5) });
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 9: Maximum signed vs minimum signed
    const min_i256 = @as(u256, 1) << 255;
    const max_i256 = (@as(u256, 1) << 255) - 1;
    try test_frame.pushStack(&[_]u256{ max_i256, min_i256 }); // max_i256 > min_i256
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();
}
```

### `0x14` EQ (Equal)

**Purpose:** Pops two items (`a`, `b`) from the stack and pushes `1` if `a == b`, otherwise `0`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):
```rust
pub fn eq<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = stack[len-2], op2 = &mut stack[len-1]
                                                // Operation: stack[len-1] = op1 == *op2
    *op2 = U256::from(op1 == *op2);
}
```
**Stack Order Interpretation:**
The operation becomes `new_stack_top = (second_from_top == original_top)`.
EVM spec: `s[0] = s[1] == s[0] ? 1 : 0`. `s[1]` is `op1`, `s[0]` is `*op2`. Matches.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `value2` then `value1`. Computes `value1 == value2`.
    *   **Comparison:** Standard U256 equality check.
    *   **Result:** Push `U256(1)` for true, `U256(0)` for false.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Standard U256 equality comparison is efficient.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/comparison.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports) ...

pub fn op_eq(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const val2 = try error_mapping.stack_pop(&frame.stack);
    const val1 = try error_mapping.stack_pop(&frame.stack);

    const result_bool = val1 == val2;
    const result_u256: u256 = if (result_bool) 1 else 0;

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/comparison_test.zig

test "Comparison: EQ (equal) operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Equal values
    // Stack: [..., 42, 42]
    try test_frame.pushStack(&[_]u256{ 42, 42 });
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame); // EQ
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();

    // Test 2: Different values
    // Stack: [..., 42, 43]
    try test_frame.pushStack(&[_]u256{ 42, 43 });
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 3: Zero equality
    // Stack: [..., 0, 0]
    try test_frame.pushStack(&[_]u256{ 0, 0 });
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();

    // Test 4: Max value equality
    // Stack: [..., MAX_U256, MAX_U256]
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ max_u256, max_u256 });
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();

    // Test 5: Zero vs Non-zero
    // Stack: [..., 0, 123]
    try test_frame.pushStack(&[_]u256{ 0, 123 });
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();
}
```

### `0x15` ISZERO (IsZero)

**Purpose:** Pops one item (`a`) from the stack and pushes `1` if `a == 0`, otherwise `0`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):
```rust
pub fn iszero<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([], op1, context.interpreter); // op1 is a mutable reference to the top of the stack
                                             // Operation: stack.top = (original_stack.top == 0)
    *op1 = U256::from(op1.is_zero());
}
```
**Stack Order Interpretation:**
`popn_top!([], op1, ...)`:
  `op1` is a mutable reference to `stack.top()`.
The operation `*op1 = U256::from(op1.is_zero())` means the top of the stack is replaced by the result of checking if the original top was zero.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops one value `a`.
    *   **Comparison:** Checks if `a == 0`.
    *   **Result:** Push `U256(1)` if `a == 0`, else push `U256(0)`.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Simple U256 comparison with zero.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/comparison.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports) ...

pub fn op_iszero(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const val = try error_mapping.stack_pop(&frame.stack);

    const result_bool = (val == 0);
    const result_u256: u256 = if (result_bool) 1 else 0;

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/comparison_test.zig

test "Comparison: ISZERO operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Input is 0
    // Stack: [..., 0]
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame); // ISZERO
    try helpers.expectStackValue(test_frame.frame, 0, 1); // True
    _ = try test_frame.popStack();

    // Test 2: Input is non-zero (positive)
    // Stack: [..., 42]
    try test_frame.pushStack(&[_]u256{42});
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 3: Input is non-zero (large positive)
    // Stack: [..., MAX_U256]
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{max_u256});
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();

    // Test 4: Input is non-zero (smallest non-zero)
    // Stack: [..., 1]
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // False
    _ = try test_frame.popStack();
}
```

### `0x16` AND

**Purpose:** Pops two items (`a`, `b`) from the stack and pushes their bitwise AND (`a & b`).

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):
```rust
pub fn bitand<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = stack[len-2], op2 = &mut stack[len-1]
                                                // Operation: stack[len-1] = op1 & *op2
    *op2 = op1 & *op2;
}
```
**Stack Order Interpretation:**
The operation becomes `new_stack_top = (second_from_top & original_top)`.
EVM spec: `s[0] = s[0] & s[1]`. `s[0]` is top, `s[1]` is second.
`revm`: `*op2` is original top, `op1` is second from top. So, `*op2 = op1 & *op2` translates to `new_top = second_from_top & original_top`. This is correct.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `value2` then `value1`. Computes `value1 & value2`.
    *   **Bitwise Operation:** Standard U256 bitwise AND.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Efficient; direct CPU instruction.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/bitwise.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports) ...

pub fn op_and(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const val2 = try error_mapping.stack_pop(&frame.stack);
    const val1 = try error_mapping.stack_pop(&frame.stack);

    const result_u256 = val1 & val2;

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/bitwise_test.zig

test "Bitwise: AND operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Basic AND
    // Stack: [..., 0b1100, 0b1010] (0xC, 0xA) -> 0b1000 (0x8)
    try test_frame.pushStack(&[_]u256{ 0xC, 0xA });
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame); // AND
    try helpers.expectStackValue(test_frame.frame, 0, 0x8);
    _ = try test_frame.popStack();

    // Test 2: AND with 0
    // Stack: [..., 0xFF, 0x00] -> 0x00
    try test_frame.pushStack(&[_]u256{ 0xFF, 0x00 });
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x00);
    _ = try test_frame.popStack();

    // Test 3: AND with MAX_U256 (identity if other is smaller)
    // Stack: [..., 0x1234, MAX_U256] -> 0x1234
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ 0x1234, max_u256 });
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x1234);
    _ = try test_frame.popStack();

    // Test 4: Different bit patterns
    // Stack: [..., 0b10100000, 0b00001010] -> 0b00000000
    try test_frame.pushStack(&[_]u256{ 0xA0, 0x0A });
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x00);
    _ = try test_frame.popStack();

    // Test 5: Larger values
    const valA: u256 = (@as(u256, 0xFF) << 128) | 0xAA;
    const valB: u256 = (@as(u256, 0xF0) << 128) | 0x55;
    const expected_and: u256 = (@as(u256, 0xF0) << 128) | 0x00; // (0xFF & 0xF0) << 128 | (0xAA & 0x55)
    try test_frame.pushStack(&[_]u256{ valA, valB });
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, expected_and);
    _ = try test_frame.popStack();
}
```

### `0x17` OR

**Purpose:** Pops two items (`a`, `b`) from the stack and pushes their bitwise OR (`a | b`).

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):
```rust
pub fn bitor<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = stack[len-2], op2 = &mut stack[len-1]
                                                // Operation: stack[len-1] = op1 | *op2
    *op2 = op1 | *op2;
}
```
**Stack Order Interpretation:**
The operation becomes `new_stack_top = (second_from_top | original_top)`.
EVM spec: `s[0] = s[0] | s[1]`. `s[0]` is top, `s[1]` is second.
`revm`: `*op2` is original top, `op1` is second from top. So, `*op2 = op1 | *op2` translates to `new_top = second_from_top | original_top`. This is correct.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `value2` then `value1`. Computes `value1 | value2`.
    *   **Bitwise Operation:** Standard U256 bitwise OR.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Efficient; direct CPU instruction.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/bitwise.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports) ...

pub fn op_or(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const val2 = try error_mapping.stack_pop(&frame.stack);
    const val1 = try error_mapping.stack_pop(&frame.stack);

    const result_u256 = val1 | val2;

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/bitwise_test.zig

test "Bitwise: OR operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Basic OR
    // Stack: [..., 0b1100, 0b1010] (0xC, 0xA) -> 0b1110 (0xE)
    try test_frame.pushStack(&[_]u256{ 0xC, 0xA });
    _ = try helpers.executeOpcode(0x17, &test_vm.vm, test_frame.frame); // OR
    try helpers.expectStackValue(test_frame.frame, 0, 0xE);
    _ = try test_frame.popStack();

    // Test 2: OR with 0 (identity)
    // Stack: [..., 0xFF, 0x00] -> 0xFF
    try test_frame.pushStack(&[_]u256{ 0xFF, 0x00 });
    _ = try helpers.executeOpcode(0x17, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF);
    _ = try test_frame.popStack();

    // Test 3: OR with MAX_U256 (results in MAX_U256)
    // Stack: [..., 0x1234, MAX_U256] -> MAX_U256
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ 0x1234, max_u256 });
    _ = try helpers.executeOpcode(0x17, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, max_u256);
    _ = try test_frame.popStack();

    // Test 4: Different bit patterns
    // Stack: [..., 0b10100000, 0b00001010] -> 0b10101010
    try test_frame.pushStack(&[_]u256{ 0xA0, 0x0A });
    _ = try helpers.executeOpcode(0x17, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xAA);
    _ = try test_frame.popStack();

    // Test 5: Larger values
    const valA: u256 = (@as(u256, 0xF0) << 128) | 0xAA; // ...11110000...10101010
    const valB: u256 = (@as(u256, 0x0F) << 128) | 0x55; // ...00001111...01010101
    const expected_or: u256 = (@as(u256, 0xFF) << 128) | 0xFF; // (0xF0 | 0x0F) | (0xAA | 0x55)
    try test_frame.pushStack(&[_]u256{ valA, valB });
    _ = try helpers.executeOpcode(0x17, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, expected_or);
    _ = try test_frame.popStack();
}
```

### `0x18` XOR

**Purpose:** Pops two items (`a`, `b`) from the stack and pushes their bitwise XOR (`a ^ b`).

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):
```rust
pub fn bitxor<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = stack[len-2], op2 = &mut stack[len-1]
                                                // Operation: stack[len-1] = op1 ^ *op2
    *op2 = op1 ^ *op2;
}
```
**Stack Order Interpretation:**
The operation becomes `new_stack_top = (second_from_top ^ original_top)`.
EVM spec: `s[0] = s[0] ^ s[1]`. `s[0]` is top, `s[1]` is second.
`revm`: `*op2` is original top, `op1` is second from top. So, `*op2 = op1 ^ *op2` translates to `new_top = second_from_top ^ original_top`. This is correct.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `value2` then `value1`. Computes `value1 ^ value2`.
    *   **Bitwise Operation:** Standard U256 bitwise XOR.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Efficient; direct CPU instruction.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/bitwise.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports) ...

pub fn op_xor(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const val2 = try error_mapping.stack_pop(&frame.stack);
    const val1 = try error_mapping.stack_pop(&frame.stack);

    const result_u256 = val1 ^ val2;

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/bitwise_test.zig

test "Bitwise: XOR operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Basic XOR
    // Stack: [..., 0b1100, 0b1010] (0xC, 0xA) -> 0b0110 (0x6)
    try test_frame.pushStack(&[_]u256{ 0xC, 0xA });
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame); // XOR
    try helpers.expectStackValue(test_frame.frame, 0, 0x6);
    _ = try test_frame.popStack();

    // Test 2: XOR with 0 (identity)
    // Stack: [..., 0xFF, 0x00] -> 0xFF
    try test_frame.pushStack(&[_]u256{ 0xFF, 0x00 });
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF);
    _ = try test_frame.popStack();

    // Test 3: XOR with MAX_U256 (bitwise NOT if other is smaller)
    // Stack: [..., 0x1234, MAX_U256] -> MAX_U256 ^ 0x1234
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ 0x1234, max_u256 });
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, max_u256 ^ 0x1234);
    _ = try test_frame.popStack();

    // Test 4: XOR with self (results in 0)
    // Stack: [..., 0xAAAA, 0xAAAA] -> 0x0000
    try test_frame.pushStack(&[_]u256{ 0xAAAA, 0xAAAA });
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0000);
    _ = try test_frame.popStack();

    // Test 5: Larger values
    const valA: u256 = (@as(u256, 0xF0F0) << 128) | 0xAAAA; // ...1111000011110000...1010101010101010
    const valB: u256 = (@as(u256, 0x0FF0) << 128) | 0x5555; // ...0000111111110000...0101010101010101
    const expected_xor: u256 = (@as(u256, 0xFF00) << 128) | 0xFFFF; // (0xF0F0 ^ 0x0FF0) | (0xAAAA ^ 0x5555)
    try test_frame.pushStack(&[_]u256{ valA, valB });
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, expected_xor);
    _ = try test_frame.popStack();
}
```

### `0x19` NOT

**Purpose:** Pops one item (`a`) from the stack and pushes its bitwise NOT (`~a`).

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):
```rust
pub fn not<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([], op1, context.interpreter); // op1 is a mutable reference to the top of the stack
                                             // Operation: stack.top = !original_stack.top
    *op1 = !*op1; // In Rust, `!` on U256 performs bitwise NOT.
}
```
**Stack Order Interpretation:**
`popn_top!([], op1, ...)`:
  `op1` is a mutable reference to `stack.top()`.
The operation `*op1 = !*op1` means the top of the stack is replaced by its bitwise NOT.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops one value `a`.
    *   **Bitwise Operation:** Standard U256 bitwise NOT (all bits flipped). In Zig, this is the `~` operator.
    *   **Result:** Push `~a`.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Efficient; direct CPU instruction.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/bitwise.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports) ...

pub fn op_not(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const val = try error_mapping.stack_pop(&frame.stack);

    const result_u256 = ~val; // Bitwise NOT in Zig

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/bitwise_test.zig

test "Bitwise: NOT operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: NOT 0
    // Stack: [..., 0] -> MAX_U256
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame); // NOT
    try helpers.expectStackValue(test_frame.frame, 0, std.math.maxInt(u256));
    _ = try test_frame.popStack();

    // Test 2: NOT MAX_U256
    // Stack: [..., MAX_U256] -> 0
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{max_u256});
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 3: NOT a specific pattern
    // Stack: [..., 0x00FF00FF] -> 0xFF00FF00... (assuming 256-bit)
    const pattern: u256 = 0x00FF00FF;
    const expected_not: u256 = ~pattern;
    try test_frame.pushStack(&[_]u256{pattern});
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, expected_not);
    _ = try test_frame.popStack();

    // Test 4: NOT a value with MSB set
    const msb_set: u256 = (@as(u256, 1) << 255); // 0x8000...0000
    const expected_msb_not: u256 = ~msb_set; // Should be 0x7FFF...FFFF
    try test_frame.pushStack(&[_]u256{msb_set});
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, expected_msb_not);
    _ = try test_frame.popStack();
}
```

### `0x1A` BYTE

**Purpose:** Pops two items from the stack: `i` (byte index) and `x` (a 32-byte value). Pushes the `i`-th byte of `x` onto the stack. Byte 0 is the most significant byte. If `i >= 32`, pushes `0`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):
```rust
pub fn byte<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = i (index), op2 = &mut x (value)
                                                // Operation: x = byte i of original x

    let o1 = as_usize_saturated!(op1); // Convert index i to usize, saturating if > usize::MAX
    *op2 = if o1 < 32 {
        // `31 - o1` because `byte` returns LE, while we want BE
        // U256::byte(idx) gets the idx-th byte from the LE representation of U256
        // So, for MSB (EVM byte 0), we need the 31st byte of LE U256.
        // For LSB (EVM byte 31), we need the 0th byte of LE U256.
        U256::from(op2.byte(31 - o1))
    } else {
        U256::ZERO
    };
}
```
**Stack Order Interpretation:**
  `op1` is `i` (index).
  `op2` is `x` (the value).
The operation correctly computes the `i`-th byte of `x`. `revm`'s `U256::byte()` method seems to access bytes from a little-endian representation, hence `31 - o1` is used to get the correct big-endian byte as per EVM spec.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `i` (index) then `x` (value).
        ```
        i_u256 = stack.pop()
        x_u256 = stack.pop()
        ```
    *   **Index Range:** If `i >= 32`, the result must be `0`.
    *   **Byte Selection (Big-Endian):** The EVM treats byte 0 as the most significant byte of the 32-byte word.
        *   If `i` is `0`, it should return the MSB of `x`.
        *   If `i` is `31`, it should return the LSB of `x`.
        *   A simple way to get the `i`-th byte (0-indexed MSB) from `x` is: `(x >> ((31 - i) * 8)) & 0xFF`.
    *   **Result:** The selected byte is pushed onto the stack as a `U256` value (zero-extended).
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Efficient.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/bitwise.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports) ...

pub fn op_byte(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const i_u256 = try error_mapping.stack_pop(&frame.stack); // index i
    const x_u256 = try error_mapping.stack_pop(&frame.stack); // value x

    var result_u256: u256 = 0;

    // Check if i is within the 32-byte range (0-31)
    // u256 comparison handles large i values correctly.
    if (i_u256 < 32) {
        const i_usize = @as(usize, @intCast(i_u256)); // Safe cast as i_u256 < 32
        // Byte 0 is MSB. To get byte i, we shift right by (31-i)*8 positions.
        const shift_amount: u8 = @intCast((31 - i_usize) * 8);
        result_u256 = (x_u256 >> shift_amount) & 0xFF;
    } else {
        // If i >= 32, result is 0
        result_u256 = 0;
    }

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/bitwise_test.zig

test "Bitwise: BYTE operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_val: u256 = 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20;

    // Test 1: Get byte 0 (MSB) -> should be 0x01
    try test_frame.pushStack(&[_]u256{ test_val, 0 }); // value, index
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame); // BYTE
    try helpers.expectStackValue(test_frame.frame, 0, 0x01);
    _ = try test_frame.popStack();

    // Test 2: Get byte 1 -> should be 0x02
    try test_frame.pushStack(&[_]u256{ test_val, 1 });
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x02);
    _ = try test_frame.popStack();

    // Test 3: Get byte 15 (middle) -> should be 0x10
    try test_frame.pushStack(&[_]u256{ test_val, 15 });
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x10);
    _ = try test_frame.popStack();

    // Test 4: Get byte 31 (LSB) -> should be 0x20
    try test_frame.pushStack(&[_]u256{ test_val, 31 });
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x20);
    _ = try test_frame.popStack();

    // Test 5: Index >= 32 (e.g., 32) -> should be 0
    try test_frame.pushStack(&[_]u256{ test_val, 32 });
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x00);
    _ = try test_frame.popStack();

    // Test 6: Index very large -> should be 0
    try test_frame.pushStack(&[_]u256{ test_val, 1000 });
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x00);
    _ = try test_frame.popStack();

    // Test 7: Value is 0
    try test_frame.pushStack(&[_]u256{ 0, 5 }); // 0, index 5
    _ = try helpers.executeOpcode(0x1A, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x00);
    _ = try test_frame.popStack();
}
```

### `0x1B` SHL (Shift Left) - EIP-145 (Constantinople)

**Purpose:** Pops two items from the stack: `shift` (number of bits to shift) and `value`. Pushes `value << shift` onto the stack. If `shift >= 256`, the result is `0`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):
```rust
// EIP-145: Bitwise shifting instructions in EVM
pub fn shl<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CONSTANTINOPLE); // Ensure active hardfork
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = shift, op2 = &mut value
                                                // Operation: value = value << shift

    let shift = as_usize_saturated!(op1); // Convert shift to usize, saturating if > usize::MAX
    *op2 = if shift < 256 {
        *op2 << shift // U256 handles large shifts internally, truncating if shift > 256.
                      // But EVM spec says if shift >= 256, result is 0.
    } else {
        U256::ZERO
    };
}
```
**Stack Order Interpretation:**
  `op1` is `shift`.
  `op2` is `value`.
The operation `*op2 = if shift < 256 { *op2 << shift } else { U256::ZERO }` effectively computes `value = (original_value << shift)` if `shift < 256`, else `0`.
EVM spec: `s[0] = s[1] << s[0]`. `s[0]` is shift, `s[1]` is value.
`revm`: `op1` (shift) is `s[0]`, `*op2` (value) is `s[1]`.
So `*op2 << shift` means `value << shift`. This is correct.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `shift` then `value`.
        ```
        shift = stack.pop()
        value = stack.pop()
        result = value << shift (conditional on shift)
        stack.push(result)
        ```
    *   **Shift Amount:** If `shift >= 256`, the result must be `0`. Otherwise, it's `value << shift`.
    *   **Hardfork:** `SHL` is introduced in Constantinople. Ensure it's not active before that. Your `JumpTable.init_from_hardfork` should handle this.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Bitwise shifts are generally efficient.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/bitwise.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, ChainRules) ...

pub fn op_shl(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter))); // To access chain_rules

    // Check hardfork
    if (!vm.chain_rules.IsConstantinople) { // Or whatever your ChainRules field is
        return ExecutionError.Error.InvalidOpcode; // Or NotActivated if you have that
    }

    const shift_u256 = try error_mapping.stack_pop(&frame.stack);
    const value_u256 = try error_mapping.stack_pop(&frame.stack);

    var result_u256: u256 = 0;

    if (shift_u256 >= 256) {
        result_u256 = 0;
    } else {
        // Zig's << operator on u256 should handle large shifts correctly by shifting out bits.
        // Ensure the shift amount is cast to an appropriate integer type for the shift operation if necessary.
        // Zig's arbitrary precision integers handle shifts naturally.
        // If `shift_u256` can be > 255 but < 256, cast to u8 or similar for safety with some U256 libs.
        // However, std.math.shl expects a comptime ulog for arbitrary precision types.
        // For runtime shifts on u256, direct `<<` is fine.
        // The most significant bits shifted out are lost.
        const shift_amount = @as(u8, @intCast(shift_u256)); // Safe if shift_u256 < 256
        result_u256 = value_u256 << shift_amount;
    }

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/bitwise_test.zig

test "Bitwise: SHL (Shift Left) operations" {
    const allocator = testing.allocator;
    // Ensure VM is initialized for Constantinople or later for SHL
    var test_vm = try helpers.TestVm.initWithHardfork(allocator, .CONSTANTINOPLE);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Basic shift
    // Stack: [..., value=0xFF, shift=8] -> 0xFF00
    try test_frame.pushStack(&[_]u256{ 0xFF, 8 });
    _ = try helpers.executeOpcode(0x1B, &test_vm.vm, test_frame.frame); // SHL
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF00);
    _ = try test_frame.popStack();

    // Test 2: Shift by 0
    // Stack: [..., value=0xABCD, shift=0] -> 0xABCD
    try test_frame.pushStack(&[_]u256{ 0xABCD, 0 });
    _ = try helpers.executeOpcode(0x1B, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xABCD);
    _ = try test_frame.popStack();

    // Test 3: Shift by 255 (value=1)
    // Stack: [..., value=1, shift=255] -> 1 << 255 (MSB set)
    try test_frame.pushStack(&[_]u256{ 1, 255 });
    _ = try helpers.executeOpcode(0x1B, &test_vm.vm, test_frame.frame);
    const expected_msb: u256 = @as(u256, 1) << 255;
    try helpers.expectStackValue(test_frame.frame, 0, expected_msb);
    _ = try test_frame.popStack();

    // Test 4: Shift by 256 (results in 0)
    // Stack: [..., value=0xFFFF, shift=256] -> 0
    try test_frame.pushStack(&[_]u256{ 0xFFFF, 256 });
    _ = try helpers.executeOpcode(0x1B, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 5: Shift by > 256 (results in 0)
    // Stack: [..., value=0x1234, shift=300] -> 0
    try test_frame.pushStack(&[_]u256{ 0x1234, 300 });
    _ = try helpers.executeOpcode(0x1B, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 6: Value is 0
    // Stack: [..., value=0, shift=10] -> 0
    try test_frame.pushStack(&[_]u256{ 0, 10 });
    _ = try helpers.executeOpcode(0x1B, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();
}
```

### `0x1C` SHR (Logical Shift Right) - EIP-145 (Constantinople)

**Purpose:** Pops two items from the stack: `shift` (number of bits to shift) and `value`. Pushes `value >> shift` onto the stack (logical shift). If `shift >= 256`, the result is `0`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):
```rust
// EIP-145: Bitwise shifting instructions in EVM
pub fn shr<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CONSTANTINOPLE); // Ensure active hardfork
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = shift, op2 = &mut value
                                                // Operation: value = value >> shift

    let shift = as_usize_saturated!(op1);
    *op2 = if shift < 256 {
        *op2 >> shift // U256 logical right shift
    } else {
        U256::ZERO
    };
}
```
**Stack Order Interpretation:**
  `op1` is `shift`.
  `op2` is `value`.
The operation `*op2 = if shift < 256 { *op2 >> shift } else { U256::ZERO }` correctly computes `value = (original_value >> shift)` if `shift < 256`, else `0`.
EVM spec: `s[0] = s[1] >> s[0]`. `s[0]` is shift, `s[1]` is value.
`revm`: `op1` (shift) is `s[0]`, `*op2` (value) is `s[1]`. So `*op2 >> shift` means `value >> shift`. Correct.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `shift` then `value`.
        ```
        shift = stack.pop()
        value = stack.pop()
        result = value >> shift (conditional on shift)
        stack.push(result)
        ```
    *   **Shift Amount:** If `shift >= 256`, the result must be `0`. Otherwise, it's `value >> shift`.
    *   **Logical Shift:** Ensure zeros are shifted in from the left (most significant side). This is the default behavior for unsigned integer right shifts in most languages, including Zig's `>>` on unsigned types.
    *   **Hardfork:** `SHR` is introduced in Constantinople.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Efficient.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/bitwise.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, ChainRules) ...

pub fn op_shr(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (!vm.chain_rules.IsConstantinople) {
        return ExecutionError.Error.InvalidOpcode;
    }

    const shift_u256 = try error_mapping.stack_pop(&frame.stack);
    const value_u256 = try error_mapping.stack_pop(&frame.stack);

    var result_u256: u256 = 0;

    if (shift_u256 >= 256) {
        result_u256 = 0;
    } else {
        const shift_amount = @as(u8, @intCast(shift_u256)); // Safe if shift_u256 < 256
        result_u256 = value_u256 >> shift_amount; // Logical right shift
    }

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/bitwise_test.zig

test "Bitwise: SHR (Logical Shift Right) operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.initWithHardfork(allocator, .CONSTANTINOPLE);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Basic shift
    // Stack: [..., value=0xFF00, shift=8] -> 0xFF
    try test_frame.pushStack(&[_]u256{ 0xFF00, 8 });
    _ = try helpers.executeOpcode(0x1C, &test_vm.vm, test_frame.frame); // SHR
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF);
    _ = try test_frame.popStack();

    // Test 2: Shift by 0
    // Stack: [..., value=0xABCD, shift=0] -> 0xABCD
    try test_frame.pushStack(&[_]u256{ 0xABCD, 0 });
    _ = try helpers.executeOpcode(0x1C, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xABCD);
    _ = try test_frame.popStack();

    // Test 3: Shift value with MSB set
    // Stack: [..., value= (1 << 255) | 0xF, shift=8] -> ( (1 << 255) | 0xF ) >> 8
    const msb_val: u256 = (@as(u256, 1) << 255) | 0xF000; // e.g., 0x8000...F000
    const expected_shr_msb: u256 = msb_val >> 8; // Zeros shifted in
    try test_frame.pushStack(&[_]u256{ msb_val, 8 });
    _ = try helpers.executeOpcode(0x1C, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, expected_shr_msb);
    _ = try test_frame.popStack();

    // Test 4: Shift by 255 (value=MAX_U256) -> 1
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ max_u256, 255 });
    _ = try helpers.executeOpcode(0x1C, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1);
    _ = try test_frame.popStack();

    // Test 5: Shift by 256 (results in 0)
    // Stack: [..., value=0xFFFF, shift=256] -> 0
    try test_frame.pushStack(&[_]u256{ 0xFFFF, 256 });
    _ = try helpers.executeOpcode(0x1C, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 6: Shift by > 256 (results in 0)
    // Stack: [..., value=0x1234, shift=300] -> 0
    try test_frame.pushStack(&[_]u256{ 0x1234, 300 });
    _ = try helpers.executeOpcode(0x1C, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 7: Value is 0
    // Stack: [..., value=0, shift=10] -> 0
    try test_frame.pushStack(&[_]u256{ 0, 10 });
    _ = try helpers.executeOpcode(0x1C, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();
}
```

### `0x1D` SAR (Arithmetic Shift Right) - EIP-145 (Constantinople)

**Purpose:** Pops two items from the stack: `shift` (number of bits to shift) and `value`. Pushes `value >> shift` onto the stack (arithmetic shift, preserving sign bit). If `shift >= 256`, the result is `0` if `value` is positive/zero, or `-1` (all bits set) if `value` is negative.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/bitwise.rs`):
```rust
// EIP-145: Bitwise shifting instructions in EVM
pub fn sar<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CONSTANTINOPLE); // Ensure active hardfork
    gas!(context.interpreter, gas::VERYLOW); // 3 gas
    popn_top!([op1], op2, context.interpreter); // op1 = shift, op2 = &mut value
                                                // Operation: value = signed_value >> shift

    let shift = as_usize_saturated!(op1);
    *op2 = if shift < 256 {
        op2.arithmetic_shr(shift) // U256::arithmetic_shr handles sign preservation
    } else if op2.bit(255) { // If value is negative (MSB is 1)
        U256::MAX // All bits set to 1 (represents -1 in two's complement)
    } else { // If value is positive or zero
        U256::ZERO
    };
}
```
**Stack Order Interpretation:**
  `op1` is `shift`.
  `op2` is `value`.
The operation computes `value = arithmetic_shift_right(original_value, shift)`, with specific behavior for `shift >= 256`.
EVM spec: `s[0] = s[1] >> s[0]` (arithmetic). `s[0]` is shift, `s[1]` is value.
`revm`: `op1` (shift) is `s[0]`, `*op2` (value) is `s[1]`. Matches.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `shift` then `value`.
    *   **Shift Amount & Sign Handling:**
        *   If `shift >= 256`:
            *   If `value` is negative (MSB of `value` is 1), result is `-1` (all bits set to 1 in `U256`).
            *   If `value` is positive or zero (MSB is 0), result is `0`.
        *   If `shift < 256`: Perform arithmetic right shift. The sign bit (MSB of `value`) is copied into the higher bits.
            *   Zig's `>>` operator on a signed integer type (`i256`) performs an arithmetic right shift. So, `@as(u256, @bitCast(@as(i256, @bitCast(value_u256)) >> shift_amount))` should work.
    *   **Hardfork:** `SAR` is introduced in Constantinople.
*   **Gas:** `VERYLOW` (3 gas) consumed before execution.
*   **Performance:** Slightly more complex than logical shift due to sign handling, but still efficient.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/bitwise.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, ChainRules) ...
// Assuming i256 type is available or defined (e.g. via std.meta.Int)

pub fn op_sar(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (!vm.chain_rules.IsConstantinople) {
        return ExecutionError.Error.InvalidOpcode;
    }

    const shift_u256 = try error_mapping.stack_pop(&frame.stack);
    const value_u256 = try error_mapping.stack_pop(&frame.stack);

    var result_u256: u256 = 0;

    if (shift_u256 >= 256) {
        // Check sign bit of original value (MSB is bit 255)
        const sign_bit = (value_u256 >> 255) & 1;
        if (sign_bit == 1) {
            result_u256 = std.math.maxInt(u256); // All bits set to 1 (represents -1)
        } else {
            result_u256 = 0;
        }
    } else {
        const shift_amount = @as(u8, @intCast(shift_u256)); // Safe if shift_u256 < 256
        const value_i256 = @as(i256, @bitCast(value_u256));
        const result_i256 = value_i256 >> shift_amount; // Arithmetic right shift
        result_u256 = @as(u256, @bitCast(result_i256));
    }

    try error_mapping.stack_push(&frame.stack, result_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/bitwise_test.zig

// fn to_i256_twos_complement(val: i256) u256 (defined previously)

test "Bitwise: SAR (Arithmetic Shift Right) operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.initWithHardfork(allocator, .CONSTANTINOPLE);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Positive value, small shift
    // Stack: [..., value=0xFF00, shift=8] -> 0xFF
    try test_frame.pushStack(&[_]u256{ 0xFF00, 8 });
    _ = try helpers.executeOpcode(0x1D, &test_vm.vm, test_frame.frame); // SAR
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF);
    _ = try test_frame.popStack();

    // Test 2: Negative value (MSB set), small shift
    // Stack: [..., value=0x8000...00F0 (signed -...240), shift=4] -> 0xF000...000F (signed -...15)
    const neg_val: u256 = (@as(u256, 1) << 255) | 0xF0; // MSB is 1, LSB is 0xF0
    const expected_sar_neg: u256 = (@as(u256,std.math.maxInt(u256)) << (256-4)) | (neg_val >> 4) ; // Sign extend
    try test_frame.pushStack(&[_]u256{ neg_val, 4 });
    _ = try helpers.executeOpcode(0x1D, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, expected_sar_neg);
    _ = try test_frame.popStack();

    // Test 3: Shift by 0
    // Stack: [..., value=0xABCD, shift=0] -> 0xABCD
    try test_frame.pushStack(&[_]u256{ 0xABCD, 0 });
    _ = try helpers.executeOpcode(0x1D, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xABCD);
    _ = try test_frame.popStack();

    // Test 4: Shift positive value by >= 256 (results in 0)
    // Stack: [..., value=0x7FFFFF, shift=256] -> 0
    try test_frame.pushStack(&[_]u256{ 0x7FFFFF, 256 });
    _ = try helpers.executeOpcode(0x1D, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 5: Shift negative value by >= 256 (results in -1 / 0xFF...FF)
    // Stack: [..., value= (1<<255) (negative), shift=300] -> MAX_U256
    const neg_msb_only: u256 = @as(u256, 1) << 255;
    try test_frame.pushStack(&[_]u256{ neg_msb_only, 300 });
    _ = try helpers.executeOpcode(0x1D, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, std.math.maxInt(u256));
    _ = try test_frame.popStack();

    // Test 6: Value is 0
    // Stack: [..., value=0, shift=10] -> 0
    try test_frame.pushStack(&[_]u256{ 0, 10 });
    _ = try helpers.executeOpcode(0x1D, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();
}
```

## Opcode Group: 0x20 - Hashing Operations

### `0x20` KECCAK256 (SHA3)

**Purpose:** Pops two items from the stack: `offset` (memory offset) and `size`. Computes the Keccak-256 hash of the memory segment `memory[offset...(offset+size-1)]` and pushes the 32-byte hash onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/system.rs`):
```rust
pub fn keccak256<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn_top!([offset], top, context.interpreter); // offset = stack[len-2], top = &mut stack[len-1] (this will hold size)
                                                // top (size) is popped first, then offset
    let len = as_usize_or_fail!(context.interpreter, top); // size
    gas_or_fail!(context.interpreter, gas::keccak256_cost(len)); // Gas: 30 + 6 * num_words(len) + memory_expansion_cost
    let hash = if len == 0 {
        KECCAK_EMPTY // Precomputed hash for empty data
    } else {
        let from = as_usize_or_fail!(context.interpreter, offset); // offset
        resize_memory!(context.interpreter, from, len); // Handles memory expansion and its gas
        primitives::keccak256(context.interpreter.memory.slice_len(from, len).as_ref())
    };
    *top = hash.into(); // Result is written back to the stack slot that held `size`
}
```
**Stack Order Interpretation:**
`popn_top!([offset_val], size_val_ref, ...)`:
  `size_val_ref` is `&mut stack.top()` (this is `size`).
  `offset_val` is `stack.pop()` (this is `offset`).
The operation computes `hash = keccak256(memory[offset_val...(offset_val+size_val_ref-1)])`, then `*size_val_ref = hash`.
This means the stack slot that originally held `size` is overwritten with the `hash`.
EVM spec: `s[0]` is offset, `s[1]` is size. Pops `size` then `offset`.
`revm` logic for `popn_top!([op1], op2, ...)` means `op1` is the second item from top (`stack[len-2]`) and `op2` is a mutable ref to the top (`stack[len-1]`).
So `let len = as_usize_or_fail!(context.interpreter, top);` where `top` is `op2` means `len` (size) is taken from the top of the stack.
And `let from = as_usize_or_fail!(context.interpreter, offset);` where `offset` is `op1` means `from` (offset) is taken from the second item on the stack.
This matches the EVM spec: stack is `[..., offset, size]`, `size` is popped first, then `offset`.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `size` then `offset`.
        ```zig
        // Stack: [..., offset, size] (size is top)
        size_u256 = stack.pop();
        offset_u256 = stack.pop();
        ```
    *   **Memory Access:** Read `size_u256` bytes from memory starting at `offset_u256`.
    *   **Hashing Algorithm:** Must be Keccak-256. `std.crypto.hash.sha3.Keccak256.hash` is the correct Zig standard library function.
    *   **Empty Data:** If `size_u256` is `0`, the result is `keccak256("")`, which is the constant `0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470`.
    *   **Result:** The 32-byte hash is pushed onto the stack as a `U256`.
*   **Gas:**
    *   Base cost: 30 gas.
    *   Word cost: 6 gas per 32-byte word of data read from memory (rounded up). `gas_constants.calculate_num_words(size_usize) * 6`.
    *   Memory expansion cost: If accessing `memory[offset...(offset+size-1)]` expands memory, this cost must be added. This should happen *before* the hashing and its associated gas costs.
    *   `revm` calculates this as `gas::keccak256_cost(len)` (base + word cost for data size) and then `resize_memory!` handles memory expansion and its own gas cost.
*   **Error Handling:**
    *   `OutOfOffset`: If `offset + size` calculation overflows or accesses memory out of bounds (after potential expansion).
    *   `OutOfGas`: For base cost, word cost, or memory expansion cost.
*   **Performance:**
    *   Hashing can be computationally intensive for large data. Zig's direct memory access should be efficient. No major performance pitfalls beyond the algorithm itself, assuming memory access and stack operations are optimized. Ensure memory expansion is handled efficiently.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/crypto.zig (or similar)

const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig"); // Assuming Vm might be needed for gas or context
const gas_constants = @import("../gas_constants.zig");
const error_mapping = @import("../error_mapping.zig");

pub fn op_sha3( // op_keccak256 is an alias in your code
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter; // May be needed for Vm context or gas_constants

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const size_u256 = try error_mapping.stack_pop(&frame.stack);
    const offset_u256 = try error_mapping.stack_pop(&frame.stack);

    // Gas: word cost for data to be hashed
    // This must be done BEFORE memory expansion for memory cost calculation
    if (size_u256 > std.math.maxInt(usize)) {
        // Technically, an offset error or OOG if size is too large to represent
        try frame.consume_gas(gas_constants.Keccak256WordGas * gas_constants.calculate_num_words(std.math.maxInt(usize)));
        return ExecutionError.Error.OutOfOffset;
    }
    const size_usize = @as(usize, @intCast(size_u256)); // Safe after check
    const word_gas_cost = gas_constants.Keccak256WordGas * gas_constants.calculate_num_words(size_usize);
    try frame.consume_gas(word_gas_cost);

    var hash_bytes: [32]u8 = undefined;

    if (size_usize == 0) {
        hash_bytes = std.crypto.hash.sha3.Keccak256.hash(&[_]u8{}, &hash_bytes, .{});
    } else {
        if (offset_u256 > std.math.maxInt(usize)) {
            // Similar to above, could be OOG or OutOfOffset
            // Memory expansion to maxInt(usize) would OOG first
            return ExecutionError.Error.OutOfOffset;
        }
        const offset_usize = @as(usize, @intCast(offset_u256));

        // Memory expansion and its gas cost
        // ensure_context_capacity returns new words added for gas calculation
        // The memory_gas_cost helper function should be used here.
        const mem_end_offset = offset_usize +% size_usize; // Check for overflow
        if (mem_end_offset < offset_usize and size_usize != 0) { // Overflow occurred
            return ExecutionError.Error.OutOfOffset;
        }

        // Gas: memory expansion cost
        // The gas model expects this to be calculated based on the *new* memory size required.
        const current_mem_size = frame.memory.context_size();
        const required_mem_size = mem_end_offset;
        const expansion_gas = gas_constants.memory_gas_cost(current_mem_size, required_mem_size);
        try frame.consume_gas(expansion_gas);

        // Now ensure capacity (this might reallocate/grow)
        _ = try frame.memory.ensure_context_capacity(required_mem_size) catch |err| {
            return error_mapping.map_memory_error(err);
        };

        const data_to_hash = try frame.memory.get_slice(offset_usize, size_usize) catch |err| {
            return error_mapping.map_memory_error(err);
        };
        hash_bytes = std.crypto.hash.sha3.Keccak256.hash(data_to_hash, &hash_bytes, .{});
    }

    // Convert [32]u8 hash to u256
    var hash_u256: u256 = 0;
    // Assuming big-endian for u256 conversion from hash bytes
    for (hash_bytes) |byte, i| {
        hash_u256 |= (@as(u256, byte) << (@as(u5, @intCast(31 - i)) * 8));
    }
    // A more robust way (std.mem.readIntBE might be better if available for u256)
    // hash_u256 = std.mem.readInt(u256, &hash_bytes, .big);

    try error_mapping.stack_push(&frame.stack, hash_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/crypto_test.zig

test "Crypto: KECCAK256 basic operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000); // Sufficient gas
    defer test_frame.deinit();

    // Test 1: Hash empty data
    // Stack: [..., offset=0, size=0]
    try test_frame.pushStack(&[_]u256{ 0, 0 });
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame); // KECCAK256
    const empty_hash_expected: u256 = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
    try helpers.expectStackValue(test_frame.frame, 0, empty_hash_expected);
    _ = try test_frame.popStack();

    // Test 2: Hash "hello"
    const hello_data = "hello";
    try test_frame.setMemory(0, hello_data.ptr[0..hello_data.len]);
    // Stack: [..., offset=0, size=5]
    try test_frame.pushStack(&[_]u256{ 0, 5 });
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    // keccak256("hello") = 0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8
    const hello_hash_expected: u256 = 0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8;
    try helpers.expectStackValue(test_frame.frame, 0, hello_hash_expected);
    _ = try test_frame.popStack();

    // Test 3: Hash with non-zero offset and memory expansion
    const data_segment = "Ethereum";
    try test_frame.setMemory(100, data_segment.ptr[0..data_segment.len]);
    // Stack: [..., offset=100, size=8]
    try test_frame.pushStack(&[_]u256{ 100, 8 });
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    // keccak256("Ethereum") = 0x5602c962cb58707507476396698c59737539309d6f7887911452383822151420
    const ethereum_hash_expected: u256 = 0x5602c962cb58707507476396698c59737539309d6f7887911452383822151420;
    try helpers.expectStackValue(test_frame.frame, 0, ethereum_hash_expected);
    _ = try test_frame.popStack();
    try testing.expect(test_frame.frame.memory.context_size() >= 100 + 8); // Check memory expanded

    // Test 4: Hash 64 bytes (2 words)
    var data64: [64]u8 = undefined;
    for (0..64) |k| { data64[k] = @intCast(k); }
    try test_frame.setMemory(0, &data64);
    try test_frame.pushStack(&[_]u256{0, 64});
    const gas_before_hash64 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    const hash_result_64 = try test_frame.popStack();
    try testing.expect(hash_result_64 != 0);
    // Gas: 30 (base) + 6 * 2 (words) = 42. Memory expansion also costs.
    // Ensure correct dynamic gas for data length is applied.
    const gas_used_for_hash64 = gas_before_hash64 - test_frame.frame.gas_remaining;
    // Actual memory expansion depends on prior state, but word cost for hash is fixed.
    try testing.expect(gas_used_for_hash64 >= (30 + 6*2) );
}


test "Crypto: KECCAK256 gas costs and memory expansion" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 20000); // Sufficient gas for expansion
    defer test_frame.deinit();

    // Scenario 1: Hash 32 bytes, no prior memory, memory expands to 1 word (32 bytes)
    // Stack: [offset=0, size=32]
    var data32: [32]u8 = undefined; @memset(&data32, 0xAA);
    try test_frame.setMemory(0, &data32);

    try test_frame.pushStack(&[_]u256{ 0, 32 });
    var gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    var gas_after = test_frame.frame.gas_remaining;
    var gas_consumed = gas_before - gas_after;
    // Expected: base(30) + word_cost(6*1=6) + mem_expansion_cost(3*1 + 1*1/512 = 3)
    try testing.expectEqual(@as(u64, 30 + 6 + 3), gas_consumed);
    _ = try test_frame.popStack();
    try testing.expectEqual(@as(usize, 32), test_frame.frame.memory.context_size());

    // Scenario 2: Hash 60 bytes, memory already 32, expands to 2 words (64 bytes)
    // Stack: [offset=0, size=60]
    var data60: [60]u8 = undefined; @memset(&data60, 0xBB);
    try test_frame.setMemory(0, &data60); // Overwrites previous, but size is important for gas

    try test_frame.pushStack(&[_]u256{ 0, 60 });
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    gas_after = test_frame.frame.gas_remaining;
    gas_consumed = gas_before - gas_after;
    // Memory: 32 (1 word) -> 64 (2 words). Expansion cost = (3*2 + 0) - (3*1 + 0) = 3
    // Expected: base(30) + word_cost(6*2=12) + mem_expansion_cost(3)
    try testing.expectEqual(@as(u64, 30 + 12 + 3), gas_consumed);
    _ = try test_frame.popStack();
    try testing.expectEqual(@as(usize, 64), test_frame.frame.memory.context_size());

    // Scenario 3: Hash from offset 32, size 32. Memory already 64. No new expansion cost.
    // Stack: [offset=32, size=32]
    try test_frame.pushStack(&[_]u256{ 32, 32 });
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    gas_after = test_frame.frame.gas_remaining;
    gas_consumed = gas_before - gas_after;
    // Expected: base(30) + word_cost(6*1=6) + mem_expansion_cost(0)
    try testing.expectEqual(@as(u64, 30 + 6 + 0), gas_consumed);
    _ = try test_frame.popStack();
    try testing.expectEqual(@as(usize, 64), test_frame.frame.memory.context_size());

    // Scenario 4: Hash 0 bytes, no memory expansion
    try test_frame.pushStack(&[_]u256{0, 0});
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    gas_after = test_frame.frame.gas_remaining;
    gas_consumed = gas_before - gas_after;
    // Expected: base(30) + word_cost(0) + mem_expansion_cost(0)
    try testing.expectEqual(@as(u64, 30), gas_consumed);
    _ = try test_frame.popStack();
    try testing.expectEqual(@as(usize, 64), test_frame.frame.memory.context_size()); // Memory size unchanged
}
```

## Opcode Group: 0x30 - Environmental Information

This group includes opcodes that provide information about the current transaction execution environment and the blockchain state.

### `0x30` ADDRESS

**Purpose:** Pushes the address of the currently executing account onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/system.rs`):
```rust
pub fn address<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(
        context.interpreter,
        context
            .interpreter
            .input
            .target_address() // In revm, input.target_address() is context.address
            .into_word()      // Converts Address to B256 (H256)
            .into()           // Converts B256 to U256
    );
}
```
**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the 20-byte address of the current contract (`frame.contract.address`), zero-extended to 32 bytes (`U256`), onto the stack.
    *   The `target_address` in `revm`'s `CallInputs` (accessed via `context.interpreter.input.target_address()`) corresponds to the address of the account whose code is being executed.
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple read and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_address(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // The address of the current contract is in frame.contract.address
    // Address.Address is [20]u8. We need to convert it to u256.
    // Assuming Address.to_u256 pads with leading zeros.
    const addr_u256 = Address.to_u256(frame.contract.address);

    try error_mapping.stack_push(&frame.stack, addr_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: ADDRESS opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    const contract_addr_bytes = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF, 0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF, 0x12, 0x34, 0x56, 0x78};
    const contract_address = @as(evm.Address.Address, contract_addr_bytes);

    var contract = try helpers.createTestContract(allocator, contract_address, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    _ = try helpers.executeOpcode(0x30, &test_vm.vm, test_frame.frame); // ADDRESS

    const expected_u256 = evm.Address.to_u256(contract_address);
    try helpers.expectStackValue(test_frame.frame, 0, expected_u256);
    _ = try test_frame.popStack();
}
```

### `0x31` BALANCE

**Purpose:** Pops an `address` from the stack and pushes the balance of that account (in Wei) onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/host.rs`):
```rust
pub fn balance<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn_top!([], top, context.interpreter); // top = &mut stack.top (this will hold address, then balance)
    let address = top.into_address(); // Convert U256 from stack top to Address
    let Some(balance) = context.host.balance(address) else { // host.balance returns Option<StateLoad<U256>>
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };
    let spec_id = context.interpreter.runtime_flag.spec_id();
    gas!( // Gas consumption depends on hardfork and whether the account is cold/warm
        context.interpreter,
        if spec_id.is_enabled_in(BERLIN) {
            warm_cold_cost(balance.is_cold) // EIP-2929: 2600 if cold, 100 if warm
        } else if spec_id.is_enabled_in(ISTANBUL) {
            // EIP-1884: Repricing for trie-size-dependent opcodes
            700
        } else if spec_id.is_enabled_in(TANGERINE) {
            400
        } else {
            20
        }
    );
    *top = balance.data; // Write balance back to the stack slot
}
```
**Stack Order Interpretation:**
  `top` initially holds the `address_u256`. It's converted to `Address`.
  The balance is fetched, and then `*top = balance.data` overwrites the original `address_u256` stack slot with the `balance_u256`.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `address_u256`.
    *   **Address Conversion:** Convert `address_u256` to your `Address.Address` type.
    *   **State Access:** Fetch balance from `Vm.balances` (or your state manager).
    *   **Non-Existent Accounts:** If an account does not exist, its balance is `0`.
    *   **Result:** Push the balance (`U256`) onto the stack.
*   **Gas:**
    *   **Pre-Berlin:**
        *   Frontier: 20 gas.
        *   Tangerine Whistle (EIP-150): 400 gas.
        *   Istanbul (EIP-1884): 700 gas.
    *   **Berlin (EIP-2929) and later:**
        *   Warm access: `WARM_STORAGE_READ_COST` (100 gas).
        *   Cold access: `COLD_ACCOUNT_ACCESS_COST` (2600 gas).
        *   The `Vm.access_list` must be checked and updated. The gas should be consumed *before* the state lookup if possible, or at least before pushing the result. `revm` does gas after fetching, using the `is_cold` flag returned by `host.balance`.
*   **Performance:** HashMap lookup for balance.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address, AccessList) ...

pub fn op_balance(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try error_mapping.stack_pop(&frame.stack);
    const address_to_check = Address.from_u256(address_u256);

    // Gas accounting (EIP-2929 aware)
    var access_cost: u64 = 0;
    if (vm.chain_rules.IsBerlin) { // Assuming IsBerlin implies EIP-2929
        // access_address updates the access list and returns the cost
        access_cost = try vm.access_list.access_address(address_to_check);
    } else if (vm.chain_rules.IsIstanbul) {
        access_cost = 700;
    } else if (vm.chain_rules.IsEIP150) { // Tangerine Whistle
        access_cost = 400;
    } else { // Frontier
        access_cost = 20;
    }
    try frame.consume_gas(access_cost);

    const balance = vm.balances.get(address_to_check) orelse 0;

    try error_mapping.stack_push(&frame.stack, balance);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: BALANCE opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator); // Default is Cancun, which includes Berlin
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    const addr_alice = helpers.TestAddresses.ALICE;
    const addr_bob = helpers.TestAddresses.BOB; // Assume Bob is not pre-warmed

    // Setup Alice's balance
    try test_vm.vm.balances.put(addr_alice, 12345);
    // Pre-warm Alice for one test variation
    _ = try test_vm.vm.access_list.access_address(addr_alice);


    // Test 1: Get balance of existing, pre-warmed account (Alice)
    try test_frame.pushStack(&[_]u256{ Address.to_u256(addr_alice) });
    var gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x31, &test_vm.vm, test_frame.frame); // BALANCE
    var gas_consumed = gas_before - test_frame.frame.gas_remaining;
    try helpers.expectStackValue(test_frame.frame, 0, 12345);
    try testing.expectEqual(@as(u64, gas_constants.WarmStorageReadCost), gas_consumed); // Berlin: Warm access
    _ = try test_frame.popStack();


    // Test 2: Get balance of existing, cold account (Bob)
    try test_vm.vm.balances.put(addr_bob, 67890);
    // Ensure Bob is not in access list for this sub-test or use a fresh one for Bob
    // For simplicity here, we assume addr_bob is cold if not accessed before in this frame.
    // A more robust test might reset access_list between sub-tests if needed.

    try test_frame.pushStack(&[_]u256{ Address.to_u256(addr_bob) });
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x31, &test_vm.vm, test_frame.frame);
    gas_consumed = gas_before - test_frame.frame.gas_remaining;
    try helpers.expectStackValue(test_frame.frame, 0, 67890);
    try testing.expectEqual(@as(u64, gas_constants.ColdAccountAccessCost), gas_consumed); // Berlin: Cold access
    _ = try test_frame.popStack();

    // Test 3: Get balance of Bob again (now warm)
    try test_frame.pushStack(&[_]u256{ Address.to_u256(addr_bob) });
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x31, &test_vm.vm, test_frame.frame);
    gas_consumed = gas_before - test_frame.frame.gas_remaining;
    try helpers.expectStackValue(test_frame.frame, 0, 67890);
    try testing.expectEqual(@as(u64, gas_constants.WarmStorageReadCost), gas_consumed); // Berlin: Warm access
    _ = try test_frame.popStack();


    // Test 4: Get balance of non-existent account (cold)
    const addr_non_existent = helpers.TestAddresses.RANDOM;
    try test_frame.pushStack(&[_]u256{ Address.to_u256(addr_non_existent) });
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x31, &test_vm.vm, test_frame.frame);
    gas_consumed = gas_before - test_frame.frame.gas_remaining;
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Balance is 0
    try testing.expectEqual(@as(u64, gas_constants.ColdAccountAccessCost), gas_consumed); // Berlin: Cold access
    _ = try test_frame.popStack();
}
```

### `0x32` ORIGIN

**Purpose:** Pushes the address of the original transaction sender (externally owned account that initiated the transaction) onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/tx_info.rs`):
```rust
pub fn origin<WIRE: InterpreterTypes, H: Host + ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(
        context.interpreter,
        context.host.caller().into_word().into() // `revm`'s Host::caller() provides tx.origin
                                                  // context.tx().caller()
    );
}
```
*Note on `revm`'s `Host::caller()`*: In `revm/crates/interpreter/src/host.rs`, `Host::caller()` is implemented as `self.tx().caller()`. The `Transaction` trait's `caller()` method is documented to return the transaction origin (EOA). So, `context.host.caller()` correctly provides `tx.origin`.

**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the 20-byte `tx.origin` address, zero-extended to 32 bytes (`U256`), onto the stack.
    *   `tx.origin` is constant throughout a transaction's execution, regardless of call depth.
    *   Your `Vm.tx_origin` field should hold this value.
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple read and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_origin(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // vm.tx_origin should store the EOA sender of the transaction
    const origin_addr_u256 = Address.to_u256(vm.tx_origin);

    try error_mapping.stack_push(&frame.stack, origin_addr_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: ORIGIN opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    const tx_origin_addr = helpers.TestAddresses.ALICE; // EOA
    test_vm.vm.tx_origin = tx_origin_addr;

    // Current contract's caller might be different from tx.origin in a nested call
    var contract = try helpers.createTestContract(allocator, helpers.TestAddresses.CONTRACT, helpers.TestAddresses.BOB, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    _ = try helpers.executeOpcode(0x32, &test_vm.vm, test_frame.frame); // ORIGIN

    const expected_u256 = evm.Address.to_u256(tx_origin_addr);
    try helpers.expectStackValue(test_frame.frame, 0, expected_u256);
    _ = try test_frame.popStack();

    // Verify gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}
```

### `0x33` CALLER

**Purpose:** Pushes the address of the immediate caller of the current execution context onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/system.rs`):
```rust
pub fn caller<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(
        context.interpreter,
        context
            .interpreter
            .input
            .caller_address() // In revm, input.caller_address() is context.caller
            .into_word()
            .into()
    );
}
```

**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the 20-byte `msg.sender` (immediate caller) address, zero-extended to 32 bytes (`U256`), onto the stack.
    *   This value comes from `frame.contract.caller`.
    *   For the initial call frame of a transaction, `CALLER` is the same as `ORIGIN`. In nested calls, `CALLER` is the address of the contract that made the current call.
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple read and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_caller(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // frame.contract.caller stores the msg.sender for the current context
    const caller_addr_u256 = Address.to_u256(frame.contract.caller);

    try error_mapping.stack_push(&frame.stack, caller_addr_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: CALLER opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    const caller_addr = helpers.TestAddresses.BOB;
    var contract = try helpers.createTestContract(allocator, helpers.TestAddresses.CONTRACT, caller_addr, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    _ = try helpers.executeOpcode(0x33, &test_vm.vm, test_frame.frame); // CALLER

    const expected_u256 = evm.Address.to_u256(caller_addr);
    try helpers.expectStackValue(test_frame.frame, 0, expected_u256);
    _ = try test_frame.popStack();

    // Verify gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);

    // Test case: CALLER in initial transaction frame (should be same as ORIGIN)
    test_vm.vm.tx_origin = helpers.TestAddresses.ALICE;
    var top_level_contract = try helpers.createTestContract(allocator, helpers.TestAddresses.CONTRACT, helpers.TestAddresses.ALICE, 0, &[_]u8{});
    defer top_level_contract.deinit(null);
    var top_level_frame = try helpers.TestFrame.init(allocator, &top_level_contract, 1000);
    defer top_level_frame.deinit();

    _ = try helpers.executeOpcode(0x33, &test_vm.vm, top_level_frame.frame); // CALLER
    const expected_origin_u256 = evm.Address.to_u256(helpers.TestAddresses.ALICE);
    try helpers.expectStackValue(top_level_frame.frame, 0, expected_origin_u256);
    _ = try top_level_frame.popStack();
}
```

### `0x34` CALLVALUE

**Purpose:** Pushes the `msg.value` (amount of Wei sent with the current call) of the current execution context onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/system.rs`):
```rust
pub fn callvalue<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(context.interpreter, context.interpreter.input.call_value()); // input.call_value() is the CallValue enum (Transfer or Apparent)
                                                                         // which has a .get() method to return the U256 value.
}
```
*Note on `revm`'s `CallValue` enum*:
`revm/crates/interpreter/src/interpreter_action/call_inputs.rs`
```rust
pub enum CallValue {
    Transfer(U256), // Actual value transferred
    Apparent(U256), // Value for DELEGATECALL or CALLCODE, not actually transferred
}
impl CallValue {
    pub const fn get(&self) -> U256 { // This is what CALLVALUE opcode uses
        match *self {
            Self::Transfer(value) | Self::Apparent(value) => value,
        }
    }
}
```
The `CALLVALUE` opcode should return the `apparent_value` in `DELEGATECALL` and `CALLCODE` contexts (which is the value of the original caller to the delegating contract), and the actual transferred `value` in `CALL` and `STATICCALL` contexts. `revm`'s `input.call_value()` handles this distinction via the `CallValue` enum.

**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the `U256` value of `msg.value` for the current context onto the stack.
    *   This value is stored in `frame.contract.value`.
    *   **`DELEGATECALL` Context:** In a `DELEGATECALL`, `CALLVALUE` returns the `value` passed to the *delegating contract*, not the value of the original transaction or any value associated with the `DELEGATECALL` itself (which is always 0 for `DELEGATECALL`). Your `Frame.contract.value` must be correctly set by the VM when a `DELEGATECALL` frame is initiated.
    *   **`CALLCODE` Context:** Similar to `DELEGATECALL` but deprecated.
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple read and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_callvalue(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // frame.contract.value should hold the msg.value for the current execution context.
    // This value must be correctly propagated by the Vm during CALL, DELEGATECALL, etc.
    try error_mapping.stack_push(&frame.stack, frame.contract.value);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: CALLVALUE opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    const sent_value: u256 = 123456789;
    var contract = try helpers.createTestContract(allocator, .{}, .{}, sent_value, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    _ = try helpers.executeOpcode(0x34, &test_vm.vm, test_frame.frame); // CALLVALUE

    try helpers.expectStackValue(test_frame.frame, 0, sent_value);
    _ = try test_frame.popStack();

    // Verify gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);

    // Test in a DELEGATECALL context (conceptual, needs VM support for setting this up)
    // In a DELEGATECALL, frame.contract.value should be the value of the *calling* frame, not the delegate call itself.
    // If contract_A calls contract_B via DELEGATECALL with value V, inside contract_B's code:
    // - CALLER will be contract_A's caller.
    // - CALLVALUE will be V (the value contract_A received).
    // This requires the Vm to set frame.contract.value appropriately when creating a DELEGATECALL frame.

    // Simulate a frame that was created via DELEGATECALL where the original call had a value.
    var delegate_target_contract = try helpers.createTestContract(allocator, helpers.TestAddresses.CONTRACT, .{}, 0, &[_]u8{}); // a dummy contract whose code is executed
    defer delegate_target_contract.deinit(null);

    // This frame represents the context *inside* the DELEGATECALL execution.
    // Its .caller and .value should be those of the *calling contract's frame*.
    const original_caller_to_delegator = helpers.TestAddresses.ALICE;
    const value_to_delegator: u256 = 777;

    var delegate_frame_contract_state = evm.Contract.init(
        original_caller_to_delegator, // This is msg.sender from the perspective of the delegate-called code
        helpers.TestAddresses.DELEGATOR_CONTRACT, // This is ADDRESS from the perspective of the delegate-called code
        value_to_delegator, // This is msg.value from the perspective of the delegate-called code
        1000,
        &[_]u8{}, // code of the delegate target (BOB) would be used, but not relevant for CALLVALUE opcode itself
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    var delegate_test_frame = try helpers.TestFrame.init(allocator, &delegate_frame_contract_state, 1000);
    defer delegate_test_frame.deinit();

    _ = try helpers.executeOpcode(0x34, &test_vm.vm, delegate_test_frame.frame); // CALLVALUE
    try helpers.expectStackValue(delegate_test_frame.frame, 0, value_to_delegator);
    _ = try delegate_test_frame.popStack();
}
```

### `0x36` CALLDATASIZE

**Purpose:** Pushes the size of the call data (input data for the current execution context) in bytes onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/system.rs`):
```rust
pub fn calldatasize<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(
        context.interpreter,
        U256::from(context.interpreter.input.input().len())
    );
}
```

**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the length (in bytes) of `frame.input` as a `U256` onto the stack.
    *   If `frame.input` is empty, it should push `0`.
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple length check and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_calldatasize(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const calldata_len_u256 = @as(u256, @intCast(frame.input.len));

    try error_mapping.stack_push(&frame.stack, calldata_len_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: CALLDATASIZE opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Empty calldata
    test_frame.setInput(&[_]u8{});
    _ = try helpers.executeOpcode(0x36, &test_vm.vm, test_frame.frame); // CALLDATASIZE
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 2: Calldata with some bytes
    const some_calldata = [_]u8{ 0x01, 0x02, 0x03, 0x04, 0x05 };
    test_frame.setInput(&some_calldata);
    _ = try helpers.executeOpcode(0x36, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 5);
    _ = try test_frame.popStack();

    // Test 3: Calldata with 32 bytes
    var calldata32: [32]u8 = undefined;
    @memset(&calldata32, 0xAA);
    test_frame.setInput(&calldata32);
    _ = try helpers.executeOpcode(0x36, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 32);
    _ = try test_frame.popStack();

    // Verify gas consumption
    test_frame.frame.gas_remaining = 1000; // Reset gas
    test_frame.setInput(&[_]u8{});
     _ = try helpers.executeOpcode(0x36, &test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}
```

### `0x37` CALLDATACOPY

**Purpose:** Pops three items from the stack: `destOffset` (memory offset), `offset` (calldata offset), and `size`. Copies `size` bytes from calldata at `offset` to memory at `destOffset`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/system.rs`):
```rust
pub fn calldatacopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn!([memory_offset, data_offset, len], context.interpreter); // Pops in order: len, data_offset, memory_offset
                                                                  // So, EVM stack: [..., memory_offset, data_offset, len]
    let len = as_usize_or_fail!(context.interpreter, len);
    // memory_resize handles gas for copy and memory expansion.
    // `gas::copy_cost_verylow` is `VERYLOW (3) * num_words(len)`
    let Some(memory_offset) = memory_resize(context.interpreter, memory_offset, len) else {
        // memory_resize fails if len is 0 (no gas cost, no memory op)
        // or if memory expansion OOG, or if offset/len is too large for usize.
        // If len is 0, it returns None and the function early exits.
        return;
    };

    let data_offset = as_usize_saturated!(data_offset); // Clamps to usize::MAX if data_offset is too large
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

// memory_resize helper from instructions/contract.rs (also used by system.rs codecopy)
// pub fn memory_resize(
//     interpreter: &mut Interpreter<impl InterpreterTypes>,
//     memory_offset: U256,
//     len: usize,
// ) -> Option<usize> {
//     gas_or_fail!(interpreter, gas::copy_cost_verylow(len), None); // Gas for copying words
//     if len == 0 {
//         return None; // Returns None if len is 0 to skip memory operations
//     }
//     let memory_offset = as_usize_or_fail_ret!(interpreter, memory_offset, None);
//     resize_memory!(interpreter, memory_offset, len, None); // Gas for memory expansion
//     Some(memory_offset)
// }
```
**Stack Order Interpretation:**
Stack: `[..., destOffset, offset, size]` (size is top)
1.  `len` (size) = `stack.pop()`
2.  `data_offset` (offset) = `stack.pop()`
3.  `memory_offset` (destOffset) = `stack.pop()`
This matches `revm`'s `popn!([memory_offset, data_offset, len], ...)` order.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `size`, then `offset`, then `destOffset`.
    *   **Data Source:** Reads from `frame.input` (calldata).
    *   **Destination:** Writes to `frame.memory`.
    *   **Bounds Handling for Calldata:** If `offset + size` exceeds `calldata.length`, bytes beyond calldata are treated as zeros during the copy. Your `Memory.set_data_bounded` or equivalent should handle this.
    *   **Bounds Handling for Memory:** If `destOffset + size` causes memory expansion, it should expand.
    *   **Zero-Length Copy:** If `size` is 0, the operation is a no-op (after stack pops and base gas). `revm`'s `memory_resize` helper returns `None` if `len` is 0, causing `calldatacopy` to return early.
    *   **Offset Saturation:** `revm` uses `as_usize_saturated!` for `data_offset`. This means if `data_offset` from the stack is larger than `usize::MAX`, it's clamped. If the calldata is smaller than `usize::MAX`, a clamped large `data_offset` will correctly lead to copying zeros.
*   **Gas:**
    *   Base cost: `VERYLOW` (3 gas).
    *   Copy cost: `COPY_GAS_PER_WORD` (3 gas in `revm`, also `VERYLOW`) per 32-byte word copied, rounded up. `gas_constants.calculate_num_words(size_usize) * gas_constants.CopyGas`.
    *   Memory expansion cost: If writing to `memory[destOffset...(destOffset+size-1)]` expands memory.
    *   The order of gas deduction matters. `revm` seems to charge copy cost first, then memory expansion.
*   **Error Handling:**
    *   `OutOfOffset` if any offset + size calculation overflows usize, or if memory access is invalid (though memory expansion should handle most cases).
    *   `OutOfGas` for any of anbove gas costs.
*   **Performance:** Memory copy. Efficient if memory management is good.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_calldatacopy(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const size_u256 = try error_mapping.stack_pop(&frame.stack);
    const data_offset_u256 = try error_mapping.stack_pop(&frame.stack);
    const mem_offset_u256 = try error_mapping.stack_pop(&frame.stack);

    // Gas: copy cost (dynamic based on size)
    if (size_u256 > std.math.maxInt(usize)) { // Prevent overflow for usize conversion
        try frame.consume_gas(gas_constants.CopyGas * gas_constants.calculate_num_words(std.math.maxInt(usize)));
        return ExecutionError.Error.OutOfOffset; // Or OOG due to gas for huge size
    }
    const size_usize = @as(usize, @intCast(size_u256));
    const copy_word_cost = gas_constants.CopyGas * gas_constants.calculate_num_words(size_usize);
    try frame.consume_gas(copy_word_cost);

    if (size_usize == 0) {
        return Operation.ExecutionResult{}; // No-op if size is 0
    }

    // Gas: memory expansion cost
    if (mem_offset_u256 > std.math.maxInt(usize)) {
         // Memory expansion to maxInt(usize) would OOG first
        return ExecutionError.Error.OutOfOffset;
    }
    const mem_offset_usize = @as(usize, @intCast(mem_offset_u256));

    const mem_end_offset = mem_offset_usize +% size_usize;
    if (mem_end_offset < mem_offset_usize and size_usize != 0) { // Overflow
        return ExecutionError.Error.OutOfOffset;
    }

    const current_mem_size = frame.memory.context_size();
    const expansion_gas = gas_constants.memory_gas_cost(current_mem_size, mem_end_offset);
    try frame.consume_gas(expansion_gas);

    // Ensure memory capacity AFTER charging gas for it
    _ = try frame.memory.ensure_context_capacity(mem_end_offset) catch |err| {
        return error_mapping.map_memory_error(err);
    };

    // Handle large data_offset (EVM behavior: reads past end of calldata are zeros)
    const data_offset_usize = if (data_offset_u256 > std.math.maxInt(usize))
        std.math.maxInt(usize) // Effectively out of bounds for any reasonable calldata
    else
        @as(usize, @intCast(data_offset_u256));

    // Perform the copy using a bounded copy function that handles padding
    try error_mapping.memory_set_data_bounded(
        &frame.memory,
        mem_offset_usize,
        frame.input, // calldata
        data_offset_usize,
        size_usize,
    );

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: CALLDATACOPY opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    const calldata_bytes = [_]u8{0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88};
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 2000); // Enough gas
    defer test_frame.deinit();
    test_frame.setInput(&calldata_bytes);

    // Test 1: Copy full calldata to memory offset 0
    // Stack: [mem_offset=0, data_offset=0, size=8]
    try test_frame.pushStack(&[_]u256{ 0, 0, 8 });
    _ = try helpers.executeOpcode(0x37, &test_vm.vm, test_frame.frame); // CALLDATACOPY
    var copied_data = try test_frame.getMemory(0, 8);
    try testing.expectEqualSlices(u8, &calldata_bytes, copied_data);
    try testing.expectEqual(@as(usize, 32), test_frame.frame.memory.context_size()); // Should expand to 1 word

    // Test 2: Copy partial calldata to different memory offset, with padding
    // Calldata: 1122334455667788
    // Copy size=10, data_offset=4, mem_offset=50
    // Expected memory at 50: 55667788000000000000 (reads 4 bytes from calldata, pads 6 with 0)
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("reset failed"); // Reset memory
    try test_frame.pushStack(&[_]u256{ 50, 4, 10 });
    _ = try helpers.executeOpcode(0x37, &test_vm.vm, test_frame.frame);
    copied_data = try test_frame.getMemory(50, 10);
    const expected_partial = [_]u8{0x55, 0x66, 0x77, 0x88, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
    try testing.expectEqualSlices(u8, &expected_partial, copied_data);
    try testing.expectEqual(@as(usize, 64), test_frame.frame.memory.context_size()); // Expanded to offset 50 + 10 = 60 -> 2 words

    // Test 3: Size is 0 (no-op, minimal gas)
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("reset failed");
    const gas_before_zero_copy = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 10, 10, 0 }); // size=0
    _ = try helpers.executeOpcode(0x37, &test_vm.vm, test_frame.frame);
    const gas_after_zero_copy = test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, helpers.opcodes.gas_constants.GasFastestStep), gas_before_zero_copy - gas_after_zero_copy);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.memory.context_size()); // No memory expansion

    // Test 4: data_offset out of bounds (all zeros copied)
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("reset failed");
    try test_frame.pushStack(&[_]u256{ 0, 100, 5 }); // data_offset=100 (out of bounds)
    _ = try helpers.executeOpcode(0x37, &test_vm.vm, test_frame.frame);
    copied_data = try test_frame.getMemory(0, 5);
    const expected_zeros = [_]u8{0x00,0x00,0x00,0x00,0x00};
    try testing.expectEqualSlices(u8, &expected_zeros, copied_data);
     try testing.expectEqual(@as(usize, 32), test_frame.frame.memory.context_size());

    // Test 5: Gas consumption for copy and expansion
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("reset failed");
    test_frame.frame.gas_remaining = 1000;
    // Copy 60 bytes (2 words) to offset 0. Memory expands from 0 to 64 bytes (2 words).
    // Gas: base(3) + copy_words(3*2=6) + mem_expansion(3*2 + 2*2/512 = 6) = 3+6+6 = 15
    try test_frame.pushStack(&[_]u256{ 0, 0, 60 });
    _ = try helpers.executeOpcode(0x37, &test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, 3 + (3*2) + 6);
}
```

### `0x38` CODESIZE

**Purpose:** Pushes the size of the currently executing contract's code in bytes onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/system.rs`):
```rust
pub fn codesize<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(
        context.interpreter,
        U256::from(context.interpreter.bytecode.bytecode_len())
    );
}
```
*Note:* `context.interpreter.bytecode` is an `ExtBytecode` which implements `LegacyBytecode::bytecode_len()` to return the length of the original (non-EOF) bytecode.

**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the length (in bytes) of `frame.contract.code` as a `U256` onto the stack.
    *   If the contract code is empty, it should push `0`.
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple length check of the code slice and push. `frame.contract.code_size` can be used if pre-calculated.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_codesize(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // frame.contract.code_size holds the pre-calculated length
    const code_len_u256 = @as(u256, @intCast(frame.contract.code_size));

    try error_mapping.stack_push(&frame.stack, code_len_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: CODESIZE opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    // Test 1: Contract with some code
    const code_bytes = [_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01, 0x00 }; // 6 bytes
    var contract1 = try helpers.createTestContract(allocator, .{}, .{}, 0, &code_bytes);
    defer contract1.deinit(null);
    var test_frame1 = try helpers.TestFrame.init(allocator, &contract1, 1000);
    defer test_frame1.deinit();

    _ = try helpers.executeOpcode(0x38, &test_vm.vm, test_frame1.frame); // CODESIZE
    try helpers.expectStackValue(test_frame1.frame, 0, code_bytes.len);
    _ = try test_frame1.popStack();

    // Test 2: Empty contract code
    var contract2 = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{}); // Empty code
    defer contract2.deinit(null);
    var test_frame2 = try helpers.TestFrame.init(allocator, &contract2, 1000);
    defer test_frame2.deinit();

    _ = try helpers.executeOpcode(0x38, &test_vm.vm, test_frame2.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame2.popStack();

    // Verify gas consumption
    test_frame2.frame.gas_remaining = 1000; // Reset gas
     _ = try helpers.executeOpcode(0x38, &test_vm.vm, test_frame2.frame);
    try helpers.expectGasUsed(test_frame2.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}
```

### `0x39` CODECOPY

**Purpose:** Pops three items from the stack: `destOffset` (memory offset), `offset` (code offset), and `size`. Copies `size` bytes from the currently executing contract's code at `offset` to memory at `destOffset`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/system.rs`):
```rust
pub fn codecopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn!([memory_offset, code_offset, len], context.interpreter); // Pops: len, code_offset, memory_offset
    let len = as_usize_or_fail!(context.interpreter, len);
    // memory_resize handles gas for copy and memory expansion.
    let Some(memory_offset) = memory_resize(context.interpreter, memory_offset, len) else {
        // len is 0, or OOG, or offset too large
        return;
    };
    let code_offset = as_usize_saturated!(code_offset); // Clamp code_offset

    // Note: This can't panic because we resized memory to fit.
    context.interpreter.memory.set_data( // Uses the bounded version internally
        memory_offset,
        code_offset,
        len,
        context.interpreter.bytecode.bytecode_slice(), // Gets original_byte_slice for legacy
    );
}
```
**Stack Order Interpretation:**
Stack: `[..., destOffset, offset, size]` (size is top)
1.  `len` (size) = `stack.pop()`
2.  `code_offset` (offset) = `stack.pop()`
3.  `memory_offset` (destOffset) = `stack.pop()`
This matches `revm`'s `popn!([memory_offset, code_offset, len], ...)` order.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `size`, then `codeOffset`, then `destMemoryOffset`.
    *   **Data Source:** Reads from `frame.contract.code`.
    *   **Destination:** Writes to `frame.memory`.
    *   **Bounds Handling for Code:** If `codeOffset + size` exceeds `code.length`, bytes beyond the code are treated as zeros during the copy. Your `Memory.set_data_bounded` or equivalent should handle this.
    *   **Bounds Handling for Memory:** If `destMemoryOffset + size` causes memory expansion, it should expand.
    *   **Zero-Length Copy:** If `size` is 0, the operation is a no-op (after stack pops and base gas).
    *   **Offset Saturation:** `revm` clamps `code_offset`. Ensure your logic correctly handles large `code_offset` by effectively copying zeros.
*   **Gas:**
    *   Base cost: `VERYLOW` (3 gas).
    *   Copy cost: `COPY_GAS_PER_WORD` (3 gas) per 32-byte word copied, rounded up.
    *   Memory expansion cost: If writing to memory expands it.
*   **Error Handling:**
    *   `OutOfOffset` if offset/size calculations overflow or memory access is invalid.
    *   `OutOfGas`.
*   **Performance:** Memory copy.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_codecopy(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const size_u256 = try error_mapping.stack_pop(&frame.stack);
    const code_offset_u256 = try error_mapping.stack_pop(&frame.stack);
    const mem_offset_u256 = try error_mapping.stack_pop(&frame.stack);

    // Gas: copy cost (dynamic based on size)
    if (size_u256 > std.math.maxInt(usize)) {
        try frame.consume_gas(gas_constants.CopyGas * gas_constants.calculate_num_words(std.math.maxInt(usize)));
        return ExecutionError.Error.OutOfOffset;
    }
    const size_usize = @as(usize, @intCast(size_u256));
    const copy_word_gas = gas_constants.CopyGas * gas_constants.calculate_num_words(size_usize);
    try frame.consume_gas(copy_word_gas);

    if (size_usize == 0) {
        return Operation.ExecutionResult{};
    }

    // Gas: memory expansion cost
    if (mem_offset_u256 > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    const mem_offset_usize = @as(usize, @intCast(mem_offset_u256));

    const mem_end_offset = mem_offset_usize +% size_usize;
     if (mem_end_offset < mem_offset_usize and size_usize != 0) { // Overflow
        return ExecutionError.Error.OutOfOffset;
    }

    const current_mem_size = frame.memory.context_size();
    const expansion_gas = gas_constants.memory_gas_cost(current_mem_size, mem_end_offset);
    try frame.consume_gas(expansion_gas);

    _ = try frame.memory.ensure_context_capacity(mem_end_offset) catch |err| {
        return error_mapping.map_memory_error(err);
    };

    const code_offset_usize = if (code_offset_u256 > std.math.maxInt(usize))
        std.math.maxInt(usize)
    else
        @as(usize, @intCast(code_offset_u256));

    try error_mapping.memory_set_data_bounded(
        &frame.memory,
        mem_offset_usize,
        frame.contract.code,
        code_offset_usize,
        size_usize,
    );

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: CODECOPY opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    const contract_code_bytes = [_]u8{0x60, 0x01, 0x60, 0x02, 0x01, 0x60, 0x00, 0x55, 0x00}; // 9 bytes
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &contract_code_bytes);
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 2000); // Sufficient gas
    defer test_frame.deinit();

    // Test 1: Copy full code to memory offset 0
    // Stack: [mem_offset=0, code_offset=0, size=9]
    try test_frame.pushStack(&[_]u256{ 0, 0, contract_code_bytes.len });
    _ = try helpers.executeOpcode(0x39, &test_vm.vm, test_frame.frame); // CODECOPY
    var copied_data = try test_frame.getMemory(0, contract_code_bytes.len);
    try testing.expectEqualSlices(u8, &contract_code_bytes, copied_data);
    try testing.expectEqual(@as(usize, 32), test_frame.frame.memory.context_size()); // Expanded to 1 word

    // Test 2: Copy partial code to different memory offset, with padding
    // Code: 600160020160005500
    // Copy size=10, code_offset=4, mem_offset=50
    // Expected memory at 50: 016000550000 (reads 5 bytes from code, pads 5 with 0)
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("mem reset failed"); // Reset memory
    try test_frame.pushStack(&[_]u256{ 50, 4, 10 });
    _ = try helpers.executeOpcode(0x39, &test_vm.vm, test_frame.frame);
    copied_data = try test_frame.getMemory(50, 10);
    const expected_partial = [_]u8{0x01, 0x60, 0x00, 0x55, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
    try testing.expectEqualSlices(u8, &expected_partial, copied_data);
    try testing.expectEqual(@as(usize, 64), test_frame.frame.memory.context_size());

    // Test 3: Size is 0 (no-op, minimal gas)
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("mem reset failed");
    const gas_before_zero_copy = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 10, 10, 0 }); // size=0
    _ = try helpers.executeOpcode(0x39, &test_vm.vm, test_frame.frame);
    const gas_after_zero_copy = test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, helpers.opcodes.gas_constants.GasFastestStep), gas_before_zero_copy - gas_after_zero_copy);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.memory.context_size());

    // Test 4: code_offset out of bounds (all zeros copied)
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("mem reset failed");
    try test_frame.pushStack(&[_]u256{ 0, 100, 5 }); // code_offset=100 (out of bounds for 9 byte code)
    _ = try helpers.executeOpcode(0x39, &test_vm.vm, test_frame.frame);
    copied_data = try test_frame.getMemory(0, 5);
    const expected_zeros = [_]u8{0x00,0x00,0x00,0x00,0x00};
    try testing.expectEqualSlices(u8, &expected_zeros, copied_data);
    try testing.expectEqual(@as(usize, 32), test_frame.frame.memory.context_size());
}
```

### `0x3A` GASPRICE

**Purpose:** Pushes the gas price of the current transaction onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/tx_info.rs`):
```rust
pub fn gasprice<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(
        context.interpreter,
        U256::from(context.host.effective_gas_price())
    );
}
```
*Note on `Host::effective_gas_price()`*: In `revm/crates/interpreter/src/host.rs`, this is implemented as:
```rust
    fn effective_gas_price(&self) -> U256 {
        let basefee = self.block().basefee(); // from ContextTr::block()
        U256::from(self.tx().effective_gas_price(basefee as u128)) // from ContextTr::tx()
    }
```
For legacy transactions, `tx.effective_gas_price()` would return `tx.gas_price()`. For EIP-1559 transactions, it's `min(tx.max_fee_per_gas, base_fee + tx.max_priority_fee_per_gas)`. The `GASPRICE` opcode should return the `effective_gas_price` of the current transaction.

**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the `U256` value of the transaction's effective gas price (in Wei) onto the stack.
    *   This value should be available from your `Vm.gas_price` (or equivalent transaction context field). For EIP-1559, this `Vm.gas_price` should reflect the *effective* gas price.
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple read and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_gasprice(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // vm.gas_price should hold the effective gas price for the current transaction
    try error_mapping.stack_push(&frame.stack, vm.gas_price);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: GASPRICE opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Set a specific gas price
    const mock_gas_price: u256 = 20_000_000_000; // 20 Gwei
    test_vm.vm.gas_price = mock_gas_price;
    _ = try helpers.executeOpcode(0x3A, &test_vm.vm, test_frame.frame); // GASPRICE
    try helpers.expectStackValue(test_frame.frame, 0, mock_gas_price);
    _ = try test_frame.popStack();

    // Test 2: Another gas price
    const mock_gas_price_2: u256 = 5_000_000_000; // 5 Gwei
    test_vm.vm.gas_price = mock_gas_price_2;
    _ = try helpers.executeOpcode(0x3A, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, mock_gas_price_2);
    _ = try test_frame.popStack();

    // Verify gas consumption
    test_frame.frame.gas_remaining = 1000; // Reset gas
     _ = try helpers.executeOpcode(0x3A, &test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}
```

### `0x3C` EXTCODECOPY

**Purpose:** Pops four items from the stack: `addr` (account address), `destOffset` (memory offset), `offset` (code offset), and `size`. Copies `size` bytes from account `addr`'s code at `offset` to memory at `destOffset`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/host.rs`):
```rust
pub fn extcodecopy<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    popn!( // Pops in order: size, code_offset, memory_offset, address
        [address, memory_offset, code_offset, len_u256],
        context.interpreter
    );
    let address = address.into_address();
    let Some(code) = context.host.load_account_code(address) else { // code is StateLoad<Bytes>
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };

    let len = as_usize_or_fail!(context.interpreter, len_u256); // size

    // Gas: Dynamic based on len and cold/warm status of `address`
    gas_or_fail!(
        context.interpreter,
        gas::extcodecopy_cost( // Includes base cost for opcode + copy cost
            context.interpreter.runtime_flag.spec_id(),
            len,
            code.is_cold // is_cold from load_account_code
        )
    );
    if len == 0 {
        return;
    }
    let memory_offset = as_usize_or_fail!(context.interpreter, memory_offset);
    let code_offset = min(as_usize_saturated!(code_offset), code.len()); // code_offset cannot exceed actual code length
    resize_memory!(context.interpreter, memory_offset, len); // Handles memory expansion and its gas

    // Note: This can't panic because we resized memory to fit.
    context
        .interpreter
        .memory
        .set_data(memory_offset, code_offset, len, &code); // Uses bounded copy
}

// gas::extcodecopy_cost from revm/crates/interpreter/src/gas/calc.rs
// pub const fn extcodecopy_cost(spec_id: SpecId, len: usize, is_cold: bool) -> Option<u64> {
//     let base_gas = if spec_id.is_enabled_in(SpecId::BERLIN) {
//         warm_cold_cost(is_cold) // 2600 cold, 100 warm
//     } else if spec_id.is_enabled_in(SpecId::TANGERINE) {
//         700
//     } else {
//         20
//     };
//     copy_cost(base_gas, len) // base_gas + (3 * num_words(len))
// }
```

**Stack Order Interpretation:**
Stack: `[..., addr, destOffset, offset, size]` (size is top)
1.  `len_u256` (size) = `stack.pop()`
2.  `code_offset_u256` (offset) = `stack.pop()`
3.  `memory_offset_u256` (destOffset) = `stack.pop()`
4.  `address_u256` (addr) = `stack.pop()`
This matches `revm`'s `popn!([address, memory_offset, code_offset, len_u256], ...)` order.

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `size`, then `codeOffset`, then `destMemoryOffset`, then `addr`.
    *   **Data Source:** Reads code of account `addr` from `Vm.code`.
    *   **Destination:** Writes to `frame.memory`.
    *   **Bounds Handling for Code:** If `codeOffset + size` exceeds `addr`'s `code.length`, bytes beyond `addr`'s code are treated as zeros during the copy. `Memory.set_data_bounded` is crucial.
    *   **Bounds Handling for Memory:** If `destMemoryOffset + size` causes memory expansion, it should expand.
    *   **Zero-Length Copy:** If `size` is 0, the operation is a no-op (after stack pops and base gas).
    *   **Offset Saturation:** `code_offset` should be clamped to the actual code length of `addr`. `revm` does `min(as_usize_saturated!(code_offset), code.len())`.
    *   **Non-Existent Account:** If `addr` does not exist or has no code, it's treated as having empty code, so all zeros are copied.
*   **Gas:**
    *   **Base Cost (Account Access):**
        *   Frontier: 20 gas.
        *   Tangerine Whistle (EIP-150): 700 gas.
        *   Berlin (EIP-2929) and later: `COLD_ACCOUNT_ACCESS_COST` (2600 gas) if `addr` is cold, `WARM_STORAGE_READ_COST` (100 gas) if warm. `Vm.access_list` must be used.
    *   **Copy cost:** `COPY_GAS_PER_WORD` (3 gas) per 32-byte word copied, rounded up.
    *   **Memory expansion cost:** If writing to memory expands it.
    *   Order of gas: Account access cost and copy_word_cost are charged first by `extcodecopy_cost`. Then `resize_memory!` inside `extcodecopy` charges memory expansion.
*   **Error Handling:**
    *   `OutOfOffset` for memory or code offset issues.
    *   `OutOfGas`.
*   **Performance:** HashMap lookup for external code, then memory copy.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/environment.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address, AccessList) ...

pub fn op_extcodecopy(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const size_u256 = try error_mapping.stack_pop(&frame.stack);
    const code_offset_u256 = try error_mapping.stack_pop(&frame.stack);
    const mem_offset_u256 = try error_mapping.stack_pop(&frame.stack);
    const addr_u256 = try error_mapping.stack_pop(&frame.stack);
    const ext_address = Address.from_u256(addr_u256);

    // Gas: Account Access Cost
    var access_gas_cost: u64 = 0;
    if (vm.chain_rules.IsBerlin) {
        access_gas_cost = try vm.access_list.access_address(ext_address);
    } else if (vm.chain_rules.IsEIP150) {
        access_gas_cost = 700;
    } else {
        access_gas_cost = 20;
    }
    try frame.consume_gas(access_gas_cost);

    // Gas: Copy word cost
    if (size_u256 > std.math.maxInt(usize)) {
        try frame.consume_gas(gas_constants.CopyGas * gas_constants.calculate_num_words(std.math.maxInt(usize)));
        return ExecutionError.Error.OutOfOffset;
    }
    const size_usize = @as(usize, @intCast(size_u256));
    const copy_word_gas = gas_constants.CopyGas * gas_constants.calculate_num_words(size_usize);
    try frame.consume_gas(copy_word_gas);

    if (size_usize == 0) {
        return Operation.ExecutionResult{};
    }

    // Gas: Memory Expansion Cost
    if (mem_offset_u256 > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    const mem_offset_usize = @as(usize, @intCast(mem_offset_u256));
    const mem_end_offset = mem_offset_usize +% size_usize;
    if (mem_end_offset < mem_offset_usize and size_usize != 0) {
        return ExecutionError.Error.OutOfOffset;
    }

    const current_mem_size = frame.memory.context_size();
    const expansion_gas = gas_constants.memory_gas_cost(current_mem_size, mem_end_offset);
    try frame.consume_gas(expansion_gas);

    _ = try frame.memory.ensure_context_capacity(mem_end_offset) catch |err| {
        return error_mapping.map_memory_error(err);
    };

    const external_code = vm.code.get(ext_address) orelse &[_]u8{};

    const code_offset_usize = if (code_offset_u256 > std.math.maxInt(usize))
        std.math.maxInt(usize) // Effectively out of bounds for any code
    else
        @as(usize, @intCast(code_offset_u256));

    // Perform bounded copy
    try error_mapping.memory_set_data_bounded(
        &frame.memory,
        mem_offset_usize,
        external_code,
        code_offset_usize,
        size_usize,
    );

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/environment_test.zig

test "Environment: EXTCODECOPY opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.initWithHardfork(allocator, .BERLIN); // Test with EIP-2929
    defer test_vm.deinit();

    const ext_addr = helpers.TestAddresses.BOB;
    const ext_code_bytes = [_]u8{0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED, 0xFA, 0xCE};
    try test_vm.vm.code.put(ext_addr, &ext_code_bytes);

    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 30000); // Enough gas
    defer test_frame.deinit();

    // Test 1: Copy full code (cold access)
    // Stack: [addr, mem_offset=0, code_offset=0, size=8]
    try test_frame.pushStack(&[_]u256{ Address.to_u256(ext_addr), 0, 0, ext_code_bytes.len });
    var gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x3C, &test_vm.vm, test_frame.frame); // EXTCODECOPY
    var gas_consumed = gas_before - test_frame.frame.gas_remaining;

    var copied_data = try test_frame.getMemory(0, ext_code_bytes.len);
    try testing.expectEqualSlices(u8, &ext_code_bytes, copied_data);
    // Gas: COLD_ACCOUNT_ACCESS_COST (2600) + copy_cost (3*1=3) + mem_expansion (32 bytes -> 3) = 2606
    try testing.expectEqual(@as(u64, gas_constants.ColdAccountAccessCost + 3 + 3), gas_consumed);

    // Test 2: Copy partial code (warm access for ext_addr now)
    // Stack: [addr, mem_offset=50, code_offset=2, size=4]
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("mem reset failed"); // Reset memory for clearer gas
    test_frame.frame.gas_remaining = 3000; // Reset gas
    try test_frame.pushStack(&[_]u256{ Address.to_u256(ext_addr), 50, 2, 4 });
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x3C, &test_vm.vm, test_frame.frame);
    gas_consumed = gas_before - test_frame.frame.gas_remaining;

    copied_data = try test_frame.getMemory(50, 4);
    try testing.expectEqualSlices(u8, ext_code_bytes[2..6], copied_data);
    // Gas: WARM_STORAGE_READ_COST (100) + copy_cost(3*1=3) + mem_expansion(50+4=54 -> 2 words -> 6 gas) = 100+3+6 = 109
    try testing.expectEqual(@as(u64, gas_constants.WarmStorageReadCost + 3 + 6), gas_consumed);

    // Test 3: Copy from non-existent account (cold access)
    const non_existent_addr = helpers.TestAddresses.RANDOM;
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("mem reset failed");
    test_frame.frame.gas_remaining = 3000;
    try test_frame.pushStack(&[_]u256{ Address.to_u256(non_existent_addr), 0, 0, 5 });
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x3C, &test_vm.vm, test_frame.frame);
    gas_consumed = gas_before - test_frame.frame.gas_remaining;

    copied_data = try test_frame.getMemory(0, 5);
    const expected_zeros = [_]u8{0,0,0,0,0};
    try testing.expectEqualSlices(u8, &expected_zeros, copied_data);
    // Gas: COLD_ACCOUNT_ACCESS_COST (2600) + copy_cost(3*1=3) + mem_expansion(3) = 2606
    try testing.expectEqual(@as(u64, gas_constants.ColdAccountAccessCost + 3 + 3), gas_consumed);
}
```

### `0x3D` RETURNDATASIZE - EIP-211 (Byzantium)

**Purpose:** Pushes the size of the data in the return data buffer onto the stack. The return data buffer holds the output from the last sub-call (`CALL`, `CALLCODE`, `DELEGATECALL`, `STATICCALL`).

**`revm` Implementation (`revm/crates/interpreter/src/instructions/system.rs`):
```rust
// EIP-211: New opcodes: RETURNDATASIZE and RETURNDATACOPY
pub fn returndatasize<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, BYZANTIUM); // Ensure active hardfork
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(
        context.interpreter,
        U256::from(context.interpreter.return_data.buffer().len())
    );
}
```

**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the length (in bytes) of `frame.return_data_buffer` as a `U256` onto the stack.
    *   The return data buffer is set by a previous call opcode (`CALL`, `CALLCODE`, `DELEGATECALL`, `STATICCALL`). If no call has been made, or the last call returned no data, its size is `0`.
    *   **Hardfork:** Introduced in Byzantium.
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple length check and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/memory.zig (or system.zig, environment.zig depending on your structure)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address, ChainRules) ...

pub fn op_returndatasize(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (!vm.chain_rules.IsByzantium) { // Or your equivalent ChainRules check
        return ExecutionError.Error.InvalidOpcode; // Or NotActivated
    }

    // frame.return_data_buffer holds the data from the last call
    const size_u256 = @as(u256, @intCast(frame.return_data_buffer.len));

    try error_mapping.stack_push(&frame.stack, size_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/memory_test.zig or system_test.zig

test "Memory: RETURNDATASIZE opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.initWithHardfork(allocator, .BYZANTIUM); // Test with Byzantium
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: No previous call, or call returned no data
    test_frame.frame.return_data_buffer = &[_]u8{}; // Explicitly empty
    _ = try helpers.executeOpcode(0x3D, &test_vm.vm, test_frame.frame); // RETURNDATASIZE
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 2: Previous call returned some data
    const sample_return_data = [_]u8{0xAA, 0xBB, 0xCC, 0xDD, 0xEE};
    test_frame.frame.return_data_buffer = &sample_return_data;
    _ = try helpers.executeOpcode(0x3D, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, sample_return_data.len);
    _ = try test_frame.popStack();

    // Test 3: Previous call returned 32 bytes of data
    var data32: [32]u8 = undefined;
    @memset(&data32, 0x77);
    test_frame.frame.return_data_buffer = &data32;
    _ = try helpers.executeOpcode(0x3D, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 32);
    _ = try test_frame.popStack();

    // Verify gas consumption
    test_frame.frame.gas_remaining = 1000; // Reset gas
    test_frame.frame.return_data_buffer = &[_]u8{};
    _ = try helpers.executeOpcode(0x3D, &test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}
```

### `0x3E` RETURNDATACOPY - EIP-211 (Byzantium)

**Purpose:** Pops three items from the stack: `destOffset` (memory offset), `offset` (return data offset), and `size`. Copies `size` bytes from the return data buffer at `offset` to memory at `destOffset`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/system.rs`):
```rust
// EIP-211: New opcodes: RETURNDATASIZE and RETURNDATACOPY
pub fn returndatacopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, BYZANTIUM); // Ensure active hardfork
    popn!([memory_offset, offset, len], context.interpreter); // Pops: len, offset, memory_offset
                                                              // Stack: [..., memory_offset, offset, len]

    let len = as_usize_or_fail!(context.interpreter, len);
    let data_offset = as_usize_saturated!(offset); // Clamp return data offset

    // Old legacy behavior is to panic if data_end is out of scope of return buffer.
    // This behavior is changed in EOF.
    let data_end = data_offset.saturating_add(len);
    if data_end > context.interpreter.return_data.buffer().len()
        && !context.interpreter.runtime_flag.is_eof() // For non-EOF, strict bounds check
    {
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::OutOfOffset);
        return;
    }
    // For EOF, it would pad with zeros if reading past end of return_data_buffer, similar to CALLDATACOPY.
    // The `memory_resize` helper (which calls `gas::copy_cost_verylow` and `resize_memory!`)
    // will handle gas and memory expansion.
    let Some(memory_offset) = memory_resize(context.interpreter, memory_offset, len) else {
        // len is 0, or OOG, or offset too large
        return;
    };

    // Note: This can't panic because we resized memory to fit.
    // The set_data here will implicitly handle reading past end of return_data.buffer() by zero-padding
    // if the source (return_data.buffer()) is shorter than `len` starting from `data_offset`.
    context.interpreter.memory.set_data(
        memory_offset,
        data_offset,
        len,
        context.interpreter.return_data.buffer(),
    );
}
```

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `size`, then `offset` (from return data), then `destOffset` (in memory).
    *   **Data Source:** Reads from `frame.return_data_buffer`.
    *   **Destination:** Writes to `frame.memory`.
    *   **Bounds Handling for Return Data (Critical Difference from `revm` pre-EOF):**
        *   **EVM Spec (pre-EOF/legacy):** If `offset + size` exceeds `return_data_buffer.length`, the operation MUST fail with an out-of-bounds/`OutOfOffset` error. It does *not* pad with zeros like `CALLDATACOPY`.
        *   `revm`'s code snippet has a check: `if data_end > context.interpreter.return_data.buffer().len() && !context.interpreter.runtime_flag.is_eof() { OutOfOffset }`. This is correct for legacy.
        *   Your Zig implementation must perform this strict bounds check for `frame.return_data_buffer`.
    *   **Bounds Handling for Memory:** If `destOffset + size` causes memory expansion, it should expand.
    *   **Zero-Length Copy:** If `size` is 0, it's a no-op (after stack pops and base gas).
    *   **Hardfork:** Introduced in Byzantium.
*   **Gas:**
    *   Base cost: `VERYLOW` (3 gas).
    *   Copy cost: `COPY_GAS_PER_WORD` (3 gas) per 32-byte word copied, rounded up.
    *   Memory expansion cost.
*   **Error Handling:**
    *   `OutOfOffset`: Crucially, if `offset + size` for return data is out of bounds. Also for memory offset issues.
    *   `OutOfGas`.
*   **Performance:** Memory copy.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/memory.zig (or system.zig)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address, ChainRules) ...

pub fn op_returndatacopy(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (!vm.chain_rules.IsByzantium) {
        return ExecutionError.Error.InvalidOpcode;
    }

    const size_u256 = try error_mapping.stack_pop(&frame.stack);
    const return_data_offset_u256 = try error_mapping.stack_pop(&frame.stack);
    const mem_offset_u256 = try error_mapping.stack_pop(&frame.stack);

    // Gas: copy cost
    if (size_u256 > std.math.maxInt(usize)) {
        try frame.consume_gas(gas_constants.CopyGas * gas_constants.calculate_num_words(std.math.maxInt(usize)));
        return ExecutionError.Error.OutOfOffset;
    }
    const size_usize = @as(usize, @intCast(size_u256));
    const copy_word_gas = gas_constants.CopyGas * gas_constants.calculate_num_words(size_usize);
    try frame.consume_gas(copy_word_gas);

    if (size_usize == 0) {
        return Operation.ExecutionResult{};
    }

    // Check return data bounds STRICTLY (no padding for RETURNDATACOPY)
    if (return_data_offset_u256 > std.math.maxInt(usize)) {
        return ExecutionError.Error.ReturnDataOutOfBounds; // Offset itself is too large
    }
    const return_data_offset_usize = @as(usize, @intCast(return_data_offset_u256));

    const return_data_end_offset = return_data_offset_usize +% size_usize;
    if (return_data_end_offset < return_data_offset_usize and size_usize != 0) { // Overflow
        return ExecutionError.Error.ReturnDataOutOfBounds;
    }
    if (return_data_end_offset > frame.return_data_buffer.len) {
        return ExecutionError.Error.ReturnDataOutOfBounds; // Read exceeds buffer
    }

    // Gas: memory expansion cost
    if (mem_offset_u256 > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    const mem_offset_usize = @as(usize, @intCast(mem_offset_u256));
    const mem_end_offset = mem_offset_usize +% size_usize;
     if (mem_end_offset < mem_offset_usize and size_usize != 0) { // Overflow
        return ExecutionError.Error.OutOfOffset;
    }

    const current_mem_size = frame.memory.context_size();
    const expansion_gas = gas_constants.memory_gas_cost(current_mem_size, mem_end_offset);
    try frame.consume_gas(expansion_gas);

    _ = try frame.memory.ensure_context_capacity(mem_end_offset) catch |err| {
        return error_mapping.map_memory_error(err);
    };

    // Perform the copy (no padding, exact slice from return_data_buffer)
    try error_mapping.memory_set_data(
        &frame.memory,
        mem_offset_usize,
        frame.return_data_buffer[return_data_offset_usize .. return_data_offset_usize + size_usize],
    );

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/memory_test.zig or system_test.zig

test "Memory: RETURNDATACOPY opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.initWithHardfork(allocator, .BYZANTIUM);
    defer test_vm.deinit();
    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();

    const sample_return_data = [_]u8{0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF};
    test_frame.setReturnData(&sample_return_data);

    // Test 1: Copy full return data
    // Stack: [mem_offset=0, data_offset=0, size=6]
    try test_frame.pushStack(&[_]u256{ 0, 0, sample_return_data.len });
    _ = try helpers.executeOpcode(0x3E, &test_vm.vm, test_frame.frame); // RETURNDATACOPY
    var copied_data = try test_frame.getMemory(0, sample_return_data.len);
    try testing.expectEqualSlices(u8, &sample_return_data, copied_data);
    try testing.expectEqual(@as(usize, 32), test_frame.frame.memory.context_size());

    // Test 2: Copy partial return data
    // Stack: [mem_offset=10, data_offset=2, size=3] (copy CC, DD, EE)
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("mem reset failed");
    try test_frame.pushStack(&[_]u256{ 10, 2, 3 });
    _ = try helpers.executeOpcode(0x3E, &test_vm.vm, test_frame.frame);
    copied_data = try test_frame.getMemory(10, 3);
    try testing.expectEqualSlices(u8, sample_return_data[2..5], copied_data);
    try testing.expectEqual(@as(usize, 32), test_frame.frame.memory.context_size()); // 10+3 = 13 -> 1 word

    // Test 3: Size is 0 (no-op)
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("mem reset failed");
    const gas_before_zero = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 0, 0, 0 }); // size=0
    _ = try helpers.executeOpcode(0x3E, &test_vm.vm, test_frame.frame);
    const gas_after_zero = test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, helpers.opcodes.gas_constants.GasFastestStep), gas_before_zero - gas_after_zero);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.memory.context_size());

    // Test 4: Read out of bounds - data_offset + size > return_data_buffer.len
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 0, 4, 5 }); // data_offset=4, size=5 (buffer has 6, 4+5=9 > 6)
    var result = helpers.executeOpcode(0x3E, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.ReturnDataOutOfBounds, result);

    // Test 5: Read out of bounds - data_offset >= return_data_buffer.len
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 0, sample_return_data.len, 1 }); // data_offset=6, size=1
    result = helpers.executeOpcode(0x3E, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.ReturnDataOutOfBounds, result);

    // Test 6: Memory expansion gas
    test_frame.frame.stack.clear();
    test_frame.frame.memory.resize_context(0) catch @panic("mem reset failed");
    test_frame.frame.gas_remaining = 1000;
    // Copy 60 bytes (needs 2 words in memory) from return data (assume it's large enough)
    var large_return_data: [60]u8 = undefined; @memset(&large_return_data, 0xDD);
    test_frame.setReturnData(&large_return_data);

    try test_frame.pushStack(&[_]u256{ 0, 0, 60 });
    const gas_before_exp = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x3E, &test_vm.vm, test_frame.frame);
    const gas_after_exp = test_frame.frame.gas_remaining;
    // Gas: base(3) + copy_words(3*2=6) + mem_expansion(0->64 bytes => 6 gas) = 3+6+6 = 15
    try helpers.expectGasUsed(test_frame.frame, gas_before_exp, 3 + (3*2) + 6);
}
```

## Opcode Group: 0x40 - Block Information

This group includes opcodes that provide information about the current block.

### `0x40` BLOCKHASH

**Purpose:** Pops a `blockNumber` from the stack and pushes the hash of the specified block. Only hashes for the most recent 256 blocks are available, excluding the current block. If the block number is not available (current, future, or too old), it pushes `0`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/host.rs`):
```rust
pub fn blockhash<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BLOCKHASH); // 20 gas
    popn_top!([], number, context.interpreter); // number = &mut stack.top() (will hold block_number, then hash)

    let requested_number_u256 = *number; // The U256 value from stack
    let current_block_number_u256 = context.host.block_number(); // U256

    // Check if requested_number is >= current_block_number or if current_block_number - requested_number > 256
    // U256 subtraction handles underflow by wrapping, so direct comparison is tricky.
    // `revm` converts to u64 for the diff logic which is safer if numbers are within u64 range.
    // The diff logic is:
    // current_block_number_u256.checked_sub(requested_number_u256)
    let Some(diff_u256) = current_block_number_u256.checked_sub(requested_number_u256) else {
        // This means requested_number_u256 > current_block_number_u256 (future block)
        *number = U256::ZERO;
        return;
    };

    let diff_saturated_u64 = as_u64_saturated!(diff_u256); // Saturates to u64::MAX

    // Blockhash should push zero if number is same as current block number (diff is 0).
    // Also if requested block is too old (diff > BLOCK_HASH_HISTORY, which is 256).
    if diff_saturated_u64 == 0 || diff_saturated_u64 > BLOCK_HASH_HISTORY as u64 {
        *number = U256::ZERO;
        return;
    }

    // At this point, 0 < diff_saturated_u64 <= 256.
    // The requested_number_u256 is valid to query.
    // Convert requested_number_u256 to u64 for host.block_hash.
    let requested_number_u64 = as_u64_saturated!(requested_number_u256);
    // It's possible requested_number_u256 is > u64::MAX but diff_saturated_u64 was still valid.
    // However, block numbers are u64. If requested_number_u256 > u64::MAX, it's an invalid block number.
    // `revm`'s `as_u64_saturated` would clamp it.
    // A more robust check would be to ensure requested_number_u256 <= u64::MAX before calling host.
    if requested_number_u256 > U256::from(u64::MAX) {
         *number = U256::ZERO; // Technically this block number can't exist.
         return;
    }


    let Some(hash_b256) = context.host.block_hash(requested_number_u64) else {
        // This implies a host/DB error if the number was deemed valid.
        context
            .interpreter
            .control
            .set_instruction_result(InstructionResult::FatalExternalError);
        return;
    };
    *number = U256::from_be_bytes(hash_b256.0); // Convert B256 to U256
}
```

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Stack Order:** Pops `blockNumber_u256`.
    *   **Availability Window:**
        *   `requested_block_number >= current_block_number` (current or future block) -> result is `0`.
        *   `requested_block_number < current_block_number - 256` (too old) -> result is `0`.
        *   Otherwise, the hash of the block `requested_block_number` is pushed.
    *   **U256 vs u64:** Block numbers in Ethereum are `u64`. The stack operand `blockNumber_u256` could be larger. If `blockNumber_u256 > u64::MAX`, it refers to a non-existent block, so the result should be `0`.
    *   `Vm.block_number` should provide the current block number.
    *   Accessing historical block hashes typically requires a host interface to the blockchain state/database. For a standalone EVM interpreter, this might be mocked or return `0` for unavailable blocks.
*   **Gas:** `BLOCKHASH` gas (20 gas) consumed before execution.
*   **Performance:** If it involves DB lookup, it can be slower. For an in-memory mock, it's a simple lookup.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/block.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_blockhash(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const requested_block_num_u256 = try error_mapping.stack_pop(&frame.stack);

    var result_hash_u256: u256 = 0; // Default to 0

    // Convert current block number (u64) to u256 for comparison ease
    const current_block_num_u256 = @as(u256, @intCast(vm.block_number));

    // Rule 1: If requested_block_num_u256 >= current_block_num_u256, result is 0.
    // Rule 2: If requested_block_num_u256 is too large to be a valid u64 block number, result is 0.
    // Rule 3: If current_block_num_u256 - requested_block_num_u256 > 256, result is 0 (too old).

    if (requested_block_num_u256 >= current_block_num_u256 or
        requested_block_num_u256 > std.math.maxInt(u64)) {
        result_hash_u256 = 0;
    } else {
        // Now requested_block_num_u256 < current_block_num_u256 and fits in u64
        const requested_block_num_u64 = @as(u64, @intCast(requested_block_num_u256)); // Safe cast

        // Calculate difference carefully to avoid underflow if current_block_num_u256 is small
        const diff: u64 = vm.block_number - requested_block_num_u64;

        if (diff > 256) { // Too old
            result_hash_u256 = 0;
        } else {
            // TODO: Actual block hash lookup from Vm's host interface or mock
            // For now, a placeholder hash or just zero if not mocking.
            // For testing, you might have a Vm.block_hashes map:
            // if (vm.historical_block_hashes.get(requested_block_num_u64)) |hash_bytes| {
            //    result_hash_u256 = std.mem.readInt(u256, hash_bytes, .big);
            // } else {
            //    result_hash_u256 = 0; // Block hash not available in mock
            // }
            // For this example, let's assume a mock that returns a pseudo-hash
            // if the block is within the valid range, otherwise 0.
            // This logic is simplified; a real VM would query a database.
            if (vm.block_number > requested_block_num_u64 and (vm.block_number - requested_block_num_u64) <= 256) {
                 // Placeholder: generate a pseudo-hash for testing
                 var temp_hash_bytes: [32]u8 = undefined;
                 std.crypto.hash.sha3.Keccak256.hash(std.mem.asBytes(&requested_block_num_u64), &temp_hash_bytes, .{});
                 result_hash_u256 = std.mem.readInt(u256, &temp_hash_bytes, .big);
            } else {
                result_hash_u256 = 0;
            }
        }
    }

    try error_mapping.stack_push(&frame.stack, result_hash_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/block_test.zig

test "Block: BLOCKHASH opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    test_vm.vm.block_number = 1000; // Set current block number

    // Mock historical hashes (optional, for more complete testing)
    // var pseudo_hash_900_bytes: [32]u8 = undefined;
    // std.crypto.hash.sha3.Keccak256.hash(std.mem.asBytes(&@as(u64,900)), &pseudo_hash_900_bytes, .{});
    // try test_vm.vm.historical_block_hashes.put(900, pseudo_hash_900_bytes);


    // Test 1: Request hash of a recent valid block (e.g., current_block - 100)
    // (Assuming mock returns non-zero for valid recent blocks)
    try test_frame.pushStack(&[_]u256{900});
    _ = try helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame); // BLOCKHASH
    var pseudo_hash_900: u256 = 0;
    var temp_hash_bytes_900: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(std.mem.asBytes(&@as(u64,900)), &temp_hash_bytes_900, .{});
    pseudo_hash_900 = std.mem.readInt(u256, &temp_hash_bytes_900, .big);
    try helpers.expectStackValue(test_frame.frame, 0, pseudo_hash_900);
    _ = try test_frame.popStack();

    // Test 2: Request hash of current block number (should be 0)
    try test_frame.pushStack(&[_]u256{1000});
    _ = try helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 3: Request hash of a future block number (should be 0)
    try test_frame.pushStack(&[_]u256{1001});
    _ = try helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 4: Request hash of a block too old (current_block - 257) (should be 0)
    // 1000 - 257 = 743
    try test_frame.pushStack(&[_]u256{1000 - 257});
    _ = try helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 5: Request hash of block (current_block - 256) (should be valid hash if available)
    // (Assuming mock returns non-zero for valid recent blocks)
    try test_frame.pushStack(&[_]u256{1000 - 256}); // 744
    _ = try helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame);
    var pseudo_hash_744: u256 = 0;
    var temp_hash_bytes_744: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(std.mem.asBytes(&@as(u64,744)), &temp_hash_bytes_744, .{});
    pseudo_hash_744 = std.mem.readInt(u256, &temp_hash_bytes_744, .big);
    try helpers.expectStackValue(test_frame.frame, 0, pseudo_hash_744);
    _ = try test_frame.popStack();

    // Test 6: Requested block number > u64::MAX (should be 0)
    const very_large_block_num = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{very_large_block_num});
    _ = try helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Verify gas consumption
    test_frame.frame.gas_remaining = 1000; // Reset gas
    try test_frame.pushStack(&[_]u256{900});
     _ = try helpers.executeOpcode(0x40, &test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasExtStep); // BLOCKHASH_GAS = 20
}
```

### `0x41` COINBASE

**Purpose:** Pushes the address of the current block's beneficiary (often the miner or validator) onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/block_info.rs`):
```rust
pub fn coinbase<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(
        context.interpreter,
        context.host.beneficiary().into_word().into() // host.beneficiary() returns Address
    );
}
```

**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the 20-byte `block.coinbase` address, zero-extended to 32 bytes (`U256`), onto the stack.
    *   This value should come from `Vm.block_coinbase`.
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple read and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/block.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_coinbase(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const coinbase_addr_u256 = Address.to_u256(vm.block_coinbase);

    try error_mapping.stack_push(&frame.stack, coinbase_addr_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/block_test.zig

test "Block: COINBASE opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const mock_coinbase = helpers.TestAddresses.CHARLIE;
    test_vm.vm.block_coinbase = mock_coinbase;

    _ = try helpers.executeOpcode(0x41, &test_vm.vm, test_frame.frame); // COINBASE

    const expected_u256 = evm.Address.to_u256(mock_coinbase);
    try helpers.expectStackValue(test_frame.frame, 0, expected_u256);
    _ = try test_frame.popStack();

    // Verify gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}
```

### `0x42` TIMESTAMP

**Purpose:** Pushes the current block's timestamp (Unix time in seconds) onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/block_info.rs`):
```rust
pub fn timestamp<WIRE: InterpreterTypes, H: Host + ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(context.interpreter, context.host.timestamp()); // host.timestamp() returns U256
}
```

**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the `U256` value of the current block's timestamp onto the stack.
    *   This value should come from `Vm.block_timestamp` (which is a `u64` and needs conversion to `u256`).
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple read and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/block.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_timestamp(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const timestamp_u256 = @as(u256, @intCast(vm.block_timestamp));

    try error_mapping.stack_push(&frame.stack, timestamp_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/block_test.zig

test "Block: TIMESTAMP opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const mock_timestamp: u64 = 1678886400; // Example: March 15, 2023
    test_vm.vm.block_timestamp = mock_timestamp;

    _ = try helpers.executeOpcode(0x42, &test_vm.vm, test_frame.frame); // TIMESTAMP

    try helpers.expectStackValue(test_frame.frame, 0, mock_timestamp);
    _ = try test_frame.popStack();

    // Verify gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}
```

### `0x43` NUMBER

**Purpose:** Pushes the current block's number onto the stack.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/block_info.rs`):
```rust
pub fn block_number<WIRE: InterpreterTypes, H: Host + ?Sized>( // Renamed from "number" in revm
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    push!(context.interpreter, U256::from(context.host.block_number())); // host.block_number() returns U256
}
```
*Note: `revm`'s `ContextTr::block().number()` returns a `U256`. The `Host::block_number` trait method in `revm` also directly returns `U256`.*

**Zig EVM Review Points:**
*   **Correctness:**
    *   Pushes the `U256` value of the current block's number onto the stack.
    *   This value should come from `Vm.block_number` (which is a `u64` and needs conversion to `u256`).
*   **Gas:** `BASE` (2 gas) consumed before execution.
*   **Performance:** Simple read and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/block.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address) ...

pub fn op_number(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const block_num_u256 = @as(u256, @intCast(vm.block_number));

    try error_mapping.stack_push(&frame.stack, block_num_u256);

    return Operation.ExecutionResult{};
}
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/block_test.zig

test "Block: NUMBER opcode" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const mock_block_number: u64 = 15000000;
    test_vm.vm.block_number = mock_block_number;

    _ = try helpers.executeOpcode(0x43, &test_vm.vm, test_frame.frame); // NUMBER

    try helpers.expectStackValue(test_frame.frame, 0, mock_block_number);
    _ = try test_frame.popStack();

    // Verify gas consumption
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}
```

### `0x44` DIFFICULTY / PREVRANDAO

**Purpose:**
*   **Pre-Merge (e.g., London and earlier):** Pushes the current block's difficulty onto the stack.
*   **Post-Merge (Merge hardfork and later, EIP-4399):** Pushes the `prevrandao` value (the output of the randomness beacon from the previous block) from the block header onto the stack. The `DIFFICULTY` opcode (0x44) is repurposed to return `PREVRANDAO`.

**`revm` Implementation (`revm/crates/interpreter/src/instructions/block_info.rs`):
```rust
pub fn difficulty<WIRE: InterpreterTypes, H: Host + ?Sized>( // Name remains difficulty for the opcode byte
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::BASE); // 2 gas
    if context
        .interpreter
        .runtime_flag
        .spec_id()
        .is_enabled_in(MERGE) // Check if Merge hardfork is active
    {
        // Unwrap is safe as this fields is checked in validation handler.
        // Host::prevrandao() returns Option<U256>
        push!(context.interpreter, context.host.prevrandao().unwrap());
    } else {
        push!(context.interpreter, context.host.difficulty()); // Host::difficulty() returns U256
    }
}
```

**Zig EVM Review Points:**
*   **Correctness:**
    *   **Hardfork Behavior:** This is the most critical aspect.
        *   If `vm.chain_rules.IsMerge` (or equivalent) is true, the opcode must push `Vm.block_prevrandao` (a `[32]u8` or `u256` representing it).
        *   If `vm.chain_rules.IsMerge` is false, it must push `Vm.block_difficulty` (a `u256`).
    *   **Data Source:** `Vm.block_difficulty` or `Vm.block_prevrandao` (you'll need a field for prevrandao if supporting Merge+).
    *   **Value:** `prevrandao` is a 32-byte value, pushed as `U256`. Difficulty is also `U256`.
*   **Gas:** `BASE` (2 gas) consumed before execution, regardless of hardfork.
*   **Performance:** Simple read and push.

**Conceptual Zig Code Suggestion (Illustrative):**
```zig
// In src/evm/opcodes/block.zig (or similar)

// ... (std, Operation, ExecutionError, Stack, Frame, Vm, gas_constants, error_mapping imports, Address, ChainRules) ...

pub fn op_difficulty_or_prevrandao( // Renamed for clarity
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State,
) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    var value_to_push: u256 = 0;

    if (vm.chain_rules.IsMerge) { // Check if Merge hardfork is active
        // Assuming Vm stores prevrandao as [32]u8 or u256 directly
        // If it's [32]u8, convert to u256:
        // value_to_push = std.mem.readInt(u256, &vm.block_prevrandao, .big);
        // If it's already u256:
        value_to_push = vm.block_prevrandao; // Assuming vm.block_prevrandao is u256
    } else {
        value_to_push = vm.block_difficulty;
    }

    try error_mapping.stack_push(&frame.stack, value_to_push);

    return Operation.ExecutionResult{};
}

// In your JumpTable setup:
// jt.table[0x44] = &op_difficulty_or_prevrandao;
// or directly use op_difficulty if the logic is inside that.
```

**Zig Test Case Suggestions:**
```zig
// In a test file like test/evm/opcodes/block_test.zig

test "Block: DIFFICULTY opcode (Pre-Merge)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.initWithHardfork(allocator, .LONDON); // Pre-Merge hardfork
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const mock_difficulty: u256 = 123456789012345;
    test_vm.vm.block_difficulty = mock_difficulty;
    test_vm.vm.block_prevrandao = 0; // Should not be used

    _ = try helpers.executeOpcode(0x44, &test_vm.vm, test_frame.frame); // DIFFICULTY

    try helpers.expectStackValue(test_frame.frame, 0, mock_difficulty);
    _ = try test_frame.popStack();
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Block: PREVRANDAO opcode (Post-Merge, via 0x44 DIFFICULTY)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.initWithHardfork(allocator, .MERGE); // Post-Merge hardfork
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(allocator, .{}, .{}, 0, &[_]u8{});
    defer contract.deinit(null);
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const mock_prevrandao: u256 = 0xABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789;
    test_vm.vm.block_prevrandao = mock_prevrandao;
    test_vm.vm.block_difficulty = 999; // Should not be used

    _ = try helpers.executeOpcode(0x44, &test_vm.vm, test_frame.frame); // DIFFICULTY (becomes PREVRANDAO)

    try helpers.expectStackValue(test_frame.frame, 0, mock_prevrandao);
    _ = try test_frame.popStack();
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}
```

---

</rewritten_file>