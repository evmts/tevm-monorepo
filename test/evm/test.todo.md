**Instructions for Multi-Agent EVM Debugging Workflow**

This is important. You are a multi agent so you should be on a loop marking test failure as in progress working in a worktree and then merging back

**Overall Goal:** Collaboratively resolve all failing EVM tests by assigning specific failure categories or individual test failures to different AI agents. Each agent will work in an isolated Git worktree, merge successful fixes back into the main development branch, and update a shared `test.todo.md` file to track progress.

**Identifier Scheme for Worktrees:**
Each agent will create a worktree using the format: `g/evm-fix-<category_or_test_name>`
Examples:
*   `g/evm-fix-stack-validation`
*   `g/evm-fix-op-gt`
*   `g/evm-fix-memory-mstore`
*   `g/evm-fix-log-gas`

**Workflow for Each Agent:**

1.  **Assign a Task:**
    *   Manually assign a specific failing test or a category of related failures (e.g., "Stack Validation Failures", "Arithmetic Opcode Failures - GT", "Memory MSTORE issues") from the `test.todo.md` file to an agent.
    *   Prioritize tasks based on potential impact (e.g., core component fixes before highly specific test fixes) or by grouping similar errors.

2.  **Update `test.todo.md` - Mark "In Progress":**
    *   Before starting work, the assigned agent (or a human coordinator) **MUST** update the `test.todo.md` file.
    *   Locate the relevant failure message(s) in the markdown file.
    *   Add a note directly under the failure message:
        ```markdown
        *   **Status:** IN PROGRESS - Agent <Agent_Identifier_Or_Name> - Worktree: `g/evm-fix-<your_identifier>`
        ```

3.  **Create Git Worktree:**
    *   Ensure you are on the main development branch (e.g., `06-02-feat_implement_jump_table_and_opcodes`).
    *   Pull the latest changes: `git pull origin 06-02-feat_implement_jump_table_and_opcodes`
    *   Create a new worktree for your assigned task. Replace `<your_identifier>` with the one chosen in step 1.
        ```bash
        git worktree add g/evm-fix-<your_identifier> -b feat/evm-fix-<your_identifier>
        ```
    *   Navigate to the new worktree directory:
        ```bash
        cd g/evm-fix-<your_identifier>
        ```

4.  **Implement Fixes and Debug:**
    *   Refer to the detailed analysis for your assigned failure(s) in `test.todo.md` (the prompt sections including Theory, Logging, Coding Changes, Plan).
    *   Implement the suggested logging if the cause is unclear. Analyze logs.
    *   Implement the proposed coding changes or your own derived fixes in the relevant `src/evm/**/*.zig` files or test files (`test/evm/**/*.zig`).
    *   Iteratively build and run the specific failing test(s) you are addressing. Use focused test commands if possible (e.g., `zig build test-opcodes -Dtest-filter="Test Name"` or similar, depending on your test runner setup).
        ```bash
        zig build && zig build test # Or more specific test command
        ```

5.  **Verify Fix and Check for Regressions:**
    *   Once your assigned test(s) pass, run the *entire relevant test suite* (e.g., `zig build test-opcodes` or `zig build test-integration`) to ensure your changes haven't introduced new failures (regressions) within that suite.
    *   If time permits and changes are core, consider running all test suites (`zig build test-all`).

6.  **Commit Changes:**
    *   Stage your changes: `git add src/evm/your_changed_file.zig test/evm/your_changed_test.zig`
    *   Commit with a clear message describing the fix. Reference the original failure if possible.
        ```bash
        git commit -m "fix(evm): Correct GT opcode operand order for comparison tests"
        git commit -m "test(evm): Adjust Fibonacci sequence test logic for accurate simulation"
        ```

7.  **Integrate Changes into Main Development Branch:**
    *   Switch back to the main development branch's working directory (NOT the worktree):
        ```bash
        cd ../..
        # (Assuming your workspace root is two levels up from g/evm-fix-<identifier>)
        # Ensure you are in the main workspace directory, not the worktree's.
        ```
    *   Ensure your main branch is up-to-date:
        ```bash
        git checkout 06-02-feat_implement_jump_table_and_opcodes
        git pull origin 06-02-feat_implement_jump_table_and_opcodes
        ```
    *   Cherry-pick the commit(s) from your worktree's branch:
        ```bash
        git cherry-pick feat/evm-fix-<your_identifier>
        ```
        (If you made multiple commits in your worktree branch, you might cherry-pick a range or squash them first on the worktree branch before cherry-picking).
    *   Resolve any merge conflicts if they occur.
    *   Run all test suites again on the main development branch to ensure integration was successful:
        ```bash
        zig build && zig build test-all
        ```

8.  **Update `test.todo.md` - Mark "Complete" and Report:**
    *   Edit the `test.todo.md` file on the `06-02-feat_implement_jump_table_and_opcodes` branch.
    *   Find your "IN PROGRESS" entry.
    *   Update the status and add a brief report:
        ```markdown
        *   **Status:** COMPLETE - Agent <Agent_Identifier_Or_Name> - Worktree: `g/evm-fix-<your_identifier>`
        *   **Report:**
            *   **Fix:** Corrected operand order in `op_gt` and `op_lt` in `src/evm/opcodes/comparison.zig`.
            *   **Tests Fixed:** `arithmetic_sequences_test.test.Integration: Conditional arithmetic based on comparison`, potentially `vm-opcode-test.test.VM: Conditional logic with comparison`.
            *   **Regressions Checked:** Ran `integration-test` and `opcodes-test` suites, no new failures.
            *   **Commit SHA (on 06-02-feat_implement_jump_table_and_opcodes after cherry-pick):** `<paste_commit_sha_here>`
        ```

9.  **Clean Up Worktree:**
    *   Once changes are successfully integrated and verified on the main development branch:
        ```bash
        git worktree remove g/evm-fix-<your_identifier>
        git branch -D feat/evm-fix-<your_identifier>
        ```

10. **Push Main Branch (Optional - Coordinator Task):**
    *   A human coordinator or a designated agent should periodically push the `06-02-feat_implement_jump_table_and_opcodes` branch to the remote repository after several fixes have been integrated.
        ```bash
        git push origin 06-02-feat_implement_jump_table_and_opcodes
        ```

**Coordination Notes:**

*   **Avoid Overlapping Work:** A human coordinator should try to assign tasks that are as isolated as possible to minimize merge conflicts. If two agents need to modify the same file for different issues, careful coordination or sequential work on that file might be necessary.
*   **Regularly Update Main Branch:** Agents should regularly pull from the main development branch into their worktree's feature branch (`git pull origin 06-02-feat_implement_jump_table_and_opcodes`) to stay updated and reduce the complexity of the final cherry-pick/merge.
*   **Communication:** If an agent discovers a fix that might impact other areas or resolve other listed failures, this should be communicated (e.g., by updating the `test.todo.md` with cross-references or notes).

This workflow should allow multiple agents to work in parallel while maintaining a structured approach to fixing the test failures and tracking progress.


**Introduction**

You are an AI coding assistant tasked with debugging and refining a Zig-based Ethereum Virtual Machine (EVM) implementation. The project has progressed to a stage where core EVM components, including opcode execution logic and a jump table dispatch mechanism, have been developed. However, a comprehensive suite of automated tests is revealing numerous failures across various aspects of EVM functionality. These failures span arithmetic operations, memory management, storage interactions, control flow, system calls, and gas accounting.

Your primary objective is to work through a detailed analysis of these test failures (which will be provided subsequently) to identify and rectify bugs within the Zig EVM source code (primarily located in `src/evm/`) or, if necessary, to correct inaccuracies in the test cases themselves (located in `test/evm/`). You will be provided with specific failure messages, theories about the root causes, suggestions for logging, potential coding changes, and a plan for addressing each category of error.

The overall goal is to achieve a robust and correctly functioning EVM implementation that passes all provided tests, adhering to Ethereum specifications and Zig best practices.

---

**Success Criteria**

The debugging and fixing process will be considered successful when the following criteria are met:

1.  **All Test Suites Pass:**
    *   All tests within the `integration-test` suite must pass.
    *   All tests within the `opcodes-test` suite must pass.
    *   All tests within the `vm-opcode-test` suite must pass.
    *   All tests within the `stack-validation-test` suite must pass.
    *   All other provided EVM-related tests must pass.

2.  **No Regressions:** Fixes applied should not introduce new failures in previously passing tests.

3.  **Correct EVM Behavior:** The EVM implementation must accurately reflect the behavior defined in Ethereum specifications (e.g., Yellow Paper, relevant EIPs) for all tested opcodes and scenarios. This includes, but is not limited to:
    *   Correct stack manipulation (depth, push/pop order, overflow/underflow handling).
    *   Accurate memory expansion and data access.
    *   Correct state modification logic for storage (SSTORE, TSTORE) and account state.
    *   Proper gas accounting for all opcodes, including base costs, dynamic costs (memory, hashing, etc.), and EIP-2929 cold/warm access costs.
    *   Valid control flow (JUMP, JUMPI, JUMPDEST validation).
    *   Correct handling of system opcodes (CREATE, CALL variants, LOGs, SELFDESTRUCT, etc.), including static call protections.
    *   Accurate retrieval and processing of environment and block information.

4.  **Code Quality:**
    *   Implemented fixes should be clear, maintainable, and follow Zig best practices.
    *   Solutions should be efficient and consider performance implications, especially in hot paths of EVM execution.
    *   Memory safety must be ensured, with proper handling of allocations and deallocations.

5.  **Problem Resolution:** The underlying causes of the identified test failures should be addressed, not just patched to make tests pass superficially. If a test is found to be flawed, it should be corrected to accurately reflect desired EVM behavior.

---

**Objective:** Resolve all failing EVM tests by identifying and fixing bugs in the Zig EVM implementation (`src/evm/**/*.zig`) or the tests themselves (`test/evm/**/*.zig`).

**Methodology:** For each failing test listed below, analyze the failure message, the provided theory, logging suggestions, potential coding changes, and the plan. Implement the necessary fixes or logging, rerun tests, and iterate until the test passes. Prioritize fixes that might address multiple failures (e.g., issues in core components like Stack, Memory, Gas Accounting, or JumpTable).

---
<prompt_preamble>
You are an expert Zig and EVM engineer. Your task is to help me debug a series of test failures in my Zig EVM implementation. I have provided detailed test output which includes specific error messages, failing test names, and relevant `JumpTable` logs showing opcode execution and gas consumption. I also have access to the `revm` (Rust EVM) source code as a reference for correct EVM behavior.

For each failing test or group of related failing tests, please perform the following:
1.  **Analyze the Failure**: Based on the test name, expected vs. found output, error messages, and `JumpTable` logs, explain what the test is trying to achieve and precisely how it's failing in my Zig EVM.
2.  **Formulate a Hypothesis**: Propose the most likely root cause(s) of the bug in the Zig implementation. Consider issues with opcode logic, gas calculation, stack/memory manipulation, state updates, or error handling.
3.  **Suggest Logging (Zig Code)**: Identify specific locations in the Zig source code (e.g., `src/evm/opcodes/*.zig`, `src/evm/memory.zig`, `src/evm/frame.zig`, `src/evm/vm.zig`, `src/evm/jump_table.zig`) where `std.debug.print` statements would be most effective for diagnosis. Specify what variables or state (e.g., stack contents, memory snippets, gas values, function parameters, return values) should be logged at these points.
4.  **Propose a Fix Strategy**: Outline the steps to verify the hypothesis and fix the bug. This might involve comparing logic with `revm` (I've provided relevant `revm` file paths in the initial query), stepping through data transformations in the Zig code, or correcting specific calculations or state updates.
5.  **Provide Code Snippets**: If applicable, include brief Zig code snippets for logging (using `std.debug.print`) or conceptual fixes. Use `// ... existing code ...` to indicate context. If showing `revm` code for comparison, clearly label it.

Let's proceed systematically through the failures.
</prompt_preamble>

<debugging_session>

  <test_failure_group name="CREATE_CREATE2_ZeroAddress">
    *   **Status:** COMPLETE - Agent Claude - Worktree: `g/evm-fix-create-zero-address`
    *   **Report:**
        *   **Fix:** Implemented CREATE/CREATE2 address calculation with RLP encoding and keccak256, added nonce tracking to VM
        *   **Tests Fixed:** CREATE/CREATE2 now return calculated addresses instead of 0
        *   **Regressions Checked:** Basic implementation working, actual initcode execution still TODO
        *   **Commit SHA:** 03f4b7ee1
    <failure_summary>
      Tests `system_test.test.CREATE: create new contract` and `system_test.test.CREATE2: create with deterministic address` are failing.
      - `CREATE` output: `expected 97433442488726861213578988847752201310395502865, found 0`
      - `CREATE2` output: `expected 194866884977453722427157977695504402620791005730, found 0`
      In both cases, the EVM is expected to return a specific, non-zero contract address but is returning address `0`.
      The `JumpTable` logs are similar for both:
      - Initial gas: 100000
      - Constant gas consumed: 32000 (remaining: 68000)
      - Gas after `op_execute`: 1062
      This very low gas remaining after `op_execute` (68000 -> 1062) strongly suggests that the initcode execution consumed almost all available gas or failed, leading to the `0` address result.
    </failure_summary>
    <hypothesis>
      1.  The initcode execution (sub-call within `op_create`/`op_create2`) is consuming excessive gas or encountering an error (e.g., `OutOfGas`, `REVERT`), causing the creation to fail and thus return address `0`.
      2.  The address calculation logic itself (nonce-based for `CREATE`, hash-based for `CREATE2`) within `src/evm/opcodes/system.zig` might be flawed, but the gas issue is more prominent.
      3.  The mechanism for returning the `created_address` to the stack after successful creation might be faulty, but this is less likely if the creation itself is failing.
    </hypothesis>
    <logging_suggestions>
      In `src/evm/opcodes/system.zig`, within `op_create` and `op_create2` functions:
      ```zig
      // op_create / op_create2
      // ...
      std.debug.print("CREATE/2: Caller Address: {any}\n", .{frame.contract.address}); // Or however sender is determined
      std.debug.print("CREATE/2: Nonce/Salt: {any}\n", .{nonce_or_salt});
      std.debug.print("CREATE/2: Init Code (first 32 bytes): {x}\n", .{init_code_slice[0..@min(32, init_code_slice.len)]});
      std.debug.print("CREATE/2: Value being sent: {any}\n", .{value});
      std.debug.print("CREATE/2: Gas for initcode execution: {d}\n", .{gas_for_sub_creation});
      // ... after the internal call to execute init_code ...
      std.debug.print("CREATE/2: Initcode execution result (success? {any}, gas_left={d})\n", .{initcode_success_flag, gas_returned_from_initcode});
      std.debug.print("CREATE/2: Computed new address: {any}\n", .{newly_created_address});
      std.debug.print("CREATE/2: Address pushed to stack: {any}\n", .{address_pushed_to_stack});
      std.debug.print("CREATE/2: Frame gas remaining after all: {d}\n", .{frame.gas_remaining});
      ```
    </logging_suggestions>
    <fix_strategy>
      1.  **Focus on Initcode Gas**: The `gas after op_execute: 1062` is the primary clue. Investigate how gas is allocated to the initcode execution. Ensure the "63/64th rule" (EIP-150) is applied correctly if the hardfork is Tangerine or later. The initcode might be running out of gas.
      2.  **Initcode Execution Success**: Verify how the success/failure of the initcode execution is determined and how it influences the address returned by `CREATE`/`CREATE2` (should be `0` on failure).
      3.  **Address Calculation**: Once initcode execution is confirmed to be handled correctly, re-verify the address generation logic:
          - `CREATE`: `keccak256(rlp([sender, nonce]))`.
          - `CREATE2`: `keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]`.
          Compare with `revm/crates/interpreter/src/interpreter_action/create_inputs.rs -> created_address()`.
      4.  **Stack Push**: Ensure the final address (`0` or the new contract address) is correctly pushed as a `u256` onto the parent frame's stack.
    </fix_strategy>
  </test_failure_group>

  <test_failure_group name="CALL_DELEGATECALL_STATICCALL_OutOfOffset_Mapping">
    *   **Status:** COMPLETE - Agent Claude - Worktree: `g/evm-fix-error-mapping`
    *   **Report:**
        *   **Fix:** Implemented centralized error_mapping module and updated all opcode files to properly map memory errors instead of generic OutOfOffset
        *   **Tests Fixed:** CALL/DELEGATECALL/STATICCALL memory error mapping issues
        *   **Regressions Checked:** Cherry-picked to main branch
        *   **Commit SHA:** e4e505a35
    <failure_summary>
      Tests for `CALL` (0xf1), `DELEGATECALL` (0xf4), and `STATICCALL` (0xfa) in `system_test.zig` and `environment_system_test.zig` are failing.
      - Many report `ExecutionError.Error.OutOfOffset` originating from the respective opcode handlers in `src/evm/opcodes/system.zig`.
      - Example `CALL` trace: `src/evm/opcodes/system.zig:222:13`.
      - Example `DELEGATECALL` trace: `src/evm/opcodes/system.zig:415:13`.
      - Example `STATICCALL` trace: `src/evm/opcodes/system.zig:508:13`.
      - The `environment_system_test.test.Integration: Call with value transfer` failure shows `memory.zig:216:9 (ensure_context_capacity)` returning `MemoryError.MemoryLimitExceeded`, which is then caught and re-thrown as `ExecutionError.Error.OutOfOffset` by `op_call` (`system.zig:215:93`).
      The `JumpTable` logs consistently show `gas after op_execute` being the same as `gas after const_consume`, meaning the error happens before any dynamic gas or the sub-call.
    </failure_summary>
    <hypothesis>
      1.  **Incorrect Error Mapping**: The primary issue is that errors from `frame.memory.ensure_context_capacity` (like `MemoryError.MemoryLimitExceeded` or other memory allocation/access errors from `memory.zig`) are being caught with a generic `catch` and incorrectly re-mapped to `ExecutionError.Error.OutOfOffset` within the opcode handlers (`op_call`, `op_delegatecall`, etc.). The actual error is being masked.
      2.  **Memory Argument Handling**: There might be an issue with how `args_offset`, `args_size`, `ret_offset`, `ret_size` are read from the stack and used. If these result in an extremely large required memory size, `ensure_context_capacity` could rightly fail with `MemoryLimitExceeded`.
      3.  **Memory Module Logic**: Less likely given the specific trace, but there could be a bug in `ensure_context_capacity` itself in `memory.zig` or `arena_memory.zig` that causes it to fail prematurely or miscalculate required capacity/limits.
    </hypothesis>
    <logging_suggestions>
      In `src/evm/opcodes/system.zig` (for `op_call`, `op_delegatecall`, `op_staticcall` etc.):
      ```zig
      // Inside op_call, op_delegatecall, op_staticcall, etc.
      // Before calling ensure_context_capacity for args:
      std.debug.print("Opcode 0x{x}: args_offset_u256={any}, args_size_u256={any}\n", .{opcode_byte, args_offset_from_stack, args_size_from_stack});
      std.debug.print("Opcode 0x{x}: args_offset_usize={d}, args_size_usize={d}\n", .{opcode_byte, args_offset_usize, args_size_usize});
      std.debug.print("Opcode 0x{x}: Calculated required args memory: {d}\n", .{opcode_byte, args_offset_usize + args_size_usize});
      std.debug.print("Opcode 0x{x}: Current memory size: {d}\n", .{opcode_byte, frame.memory.context_size()});
      // Change the catch block:
      // _ = frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize) catch |err| {
      //     std.debug.print("Opcode 0x{x}: ensure_context_capacity for args FAILED with error: {any}\n", .{opcode_byte, err});
      //     return map_memory_error_to_execution_error(err); // Implement this mapping
      // };

      // Similar logging for ret_offset and ret_size.
      ```
      In `src/evm/memory.zig` (or `arena_memory.zig`), inside `ensure_context_capacity`:
      ```zig
      std.debug.print("ensure_context_capacity: requested_min_context_size={d}, current_context_start_offset={d}, current_total_buffer_len={d}, memory_limit={d}\n", .{min_context_size, self.my_checkpoint, self.root_ptr.shared_buffer.items.len, self.memory_limit});
      const required_total_len = self.my_checkpoint + min_context_size;
      std.debug.print("ensure_context_capacity: calculated required_total_len={d}\n", .{required_total_len});
      // If returning MemoryLimitExceeded:
      // std.debug.print("ensure_context_capacity: returning MemoryLimitExceeded because required_total_len ({d}) > memory_limit ({d})\n", .{required_total_len, self.memory_limit});
      ```
    </logging_suggestions>
    <fix_strategy>
      1.  **Implement Granular Error Mapping**:
          In `src/evm/opcodes/system.zig` (and other opcode files that call memory functions), modify the `catch` blocks. Instead of a generic `catch return ExecutionError.Error.OutOfOffset`, use a `switch` on the error returned by memory functions:
          ```zig
          // Example for a memory call
          frame.memory.ensure_context_capacity(required_size) catch |err| switch (err) {
              error.MemoryLimitExceeded => return ExecutionError.Error.OutOfGas, // Or a new specific error
              error.OutOfMemory => return ExecutionError.Error.OutOfGas,
              error.InvalidOffset => return ExecutionError.Error.OutOfOffset, // This mapping might be correct
              // Add other mappings from MemoryError
              else => return ExecutionError.Error.OutOfOffset, // Fallback, but try to be specific
          };
          ```
          This will reveal the true underlying memory error in tests.
      2.  **Validate Memory Size Calculations**: Log the `offset` and `size` values popped from the stack for memory operations. Ensure that their sum, when used to determine required memory, does not cause `usize` overflow or request an unreasonable amount of memory that would hit `MemoryLimitExceeded`.
      3.  **Review `ensure_context_capacity`**: Check the conditions under which it returns `MemoryError.MemoryLimitExceeded`. Ensure it's correctly comparing against `self.memory_limit`.
      4.  **REVM Reference**: `revm/crates/interpreter/src/instructions/contract/call_helpers.rs` (`resize_memory` and `get_memory_input_and_out_ranges`) and `revm/crates/interpreter/src/gas.rs` (`record_memory_expansion`). REVM maps memory OOG directly to `InstructionResult::MemoryOOG`.
    </fix_strategy>
  </test_failure_group>

  <test_failure_group name="CREATE_EIP3860_MaxCodeSizeLogic">
    <failure_summary>
      Tests `system_test.test.CREATE: EIP-3860 initcode size limit` and `system_test.test.CREATE2: EIP-3860 initcode size limit` fail.
      They expect an `error.MaxCodeSizeExceeded` but the opcodes succeed, returning an `operation.ExecutionResult`. This means the initcode size check (EIP-3860, active since Shanghai) is not being enforced.
    </failure_summary>
    <hypothesis>
      1.  The check `if init_code_len > max_initcode_size` is missing in `op_create` and `op_create2` in `src/evm/opcodes/system.zig` when the Shanghai hardfork is active.
      2.  The `max_initcode_size` constant (should be `0xC000` or `49152`) or the way it's accessed (e.g., via host) is incorrect.
      3.  The hardfork check (e.g., `frame.rules.IsShanghai`) is not correctly implemented or evaluated.
    </hypothesis>
    <logging_suggestions>
      In `src/evm/opcodes/system.zig`, inside `op_create` and `op_create2` (specifically where EIP-3860 logic should be):
      ```zig
      std.debug.print("EIP-3860 check: init_code_len={d}\n", .{init_code_len});
      // Assuming 'rules' is accessible: std.debug.print("EIP-3860 check: IsShanghai active? {any}\n", .{frame.rules.IsShanghai});
      std.debug.print("EIP-3860 check: MaxInitcodeSize constant = {d}\n", .{gas_constants.MaxInitcodeSize}); // Or however it's accessed
      // If the check `if (frame.rules.IsShanghai and init_code_len > gas_constants.MaxInitcodeSize)` exists:
      // Inside the if block:
      // std.debug.print("EIP-3860: CreateInitCodeSizeLimit triggered.\n", .{});
      ```
    </logging_suggestions>
    <fix_strategy>
      1.  **Implement EIP-3860 Check**: Add or correct the initcode size check in `op_create` and `op_create2`. This check should be conditional on the Shanghai hardfork (or later) being active.
          ```zig
          // In op_create/op_create2, after determining init_code_len
          // if (frame.rules.IsShanghai and init_code_len > gas_constants.MaxInitcodeSize) { // Ensure gas_constants.MaxInitcodeSize is 49152
          //     return ExecutionError.Error.MaxCodeSizeExceeded; // Or your specific error for this
          // }
          // Also apply gas cost:
          // if (frame.rules.IsShanghai) {
          //    const word_cost = gas_constants.InitcodeWordGas * @divCeil(init_code_len, 32);
          //    try frame.consume_gas(word_cost);
          // }
          ```
      2.  **Verify Constants and Hardfork**: Ensure `gas_constants.MaxInitcodeSize` is `49152` and that the hardfork check correctly identifies Shanghai.
      3.  **REVM Reference**: See `revm/crates/interpreter/src/instructions/contract.rs` (function `create`) for the EIP-3860 implementation.
    </fix_strategy>
  </test_failure_group>

  <test_failure_group name="JUMPI_InvalidJump_ControlTest">
    <failure_summary>
      Test `control_test.test.Control: JUMPI conditional jump` fails with `ExecutionError.Error.InvalidJump` from `src/evm/opcodes/control.zig:70:13` in `op_jumpi`.
      This indicates the jump destination was invalid. The `JumpTable` logs show constant gas consumed but no change after `op_execute`, meaning the error happened early.
    </failure_summary>
    <hypothesis>
      1.  The `contract.valid_jumpdest(target_usize)` check within `op_jumpi` is incorrectly determining the validity of the jump destination.
      2.  The `CodeAnalysis` module is not correctly identifying or storing `JUMPDEST` (0x5b) locations, or it's failing to distinguish `JUMPDEST` opcodes from data bytes within `PUSH` instructions.
      3.  The test itself in `control_test.zig` might provide a destination that is legitimately invalid, but the test expects it to be valid.
    </hypothesis>
    <logging_suggestions>
      In `src/evm/opcodes/control.zig`, inside `op_jumpi`:
      ```zig
      std.debug.print("op_jumpi: target_from_stack={any}, condition={any}\n", .{target_from_stack, condition_from_stack});
      std.debug.print("op_jumpi: target_usize={d}, code_len={d}\n", .{target_usize, frame.contract.code.len});
      // Before calling valid_jumpdest:
      std.debug.print("op_jumpi: Is target {d} a JUMPDEST? Opcode there: 0x{x}\n", .{target_usize, if (target_usize < frame.contract.code.len) frame.contract.code[target_usize] else 0xFF});
      // if (frame.contract.analysis) |analysis| { // Assuming analysis contains jumpdest info
      //     std.debug.print("op_jumpi: Analysis jumpdest_positions: {any}\n", .{analysis.jumpdest_positions});
      // }
      // const is_valid = frame.contract.valid_jumpdest(target_usize);
      // std.debug.print("op_jumpi: valid_jumpdest returned: {any}\n", .{is_valid});
      ```
    </logging_suggestions>
    <fix_strategy>
      1.  **Review `Contract.valid_jumpdest`**:
          - This function (likely in `src/evm/contract.zig` or using `src/evm/code_analysis.zig`) must verify:
              a. `target_usize < frame.contract.code.len`.
              b. `frame.contract.code[target_usize] == 0x5b` (JUMPDEST).
              c. The byte at `target_usize` is a genuine opcode, not part of PUSHdata. This usually requires a bitmap from code analysis (e.g., `CodeAnalysis.code_segments`).
      2.  **Inspect Code Analysis**: Ensure `CodeAnalysis` correctly builds the `jumpdest_positions` list or the `code_segments` bitmap.
      3.  **Examine Test Bytecode**: Look at the bytecode used in `control_test.test.Control: JUMPI conditional jump` and the target destination being used. Manually verify if it should be a valid jump.
      4.  **REVM Reference**: `revm/crates/bytecode/src/legacy_jump_table.rs -> LegacyJumpTable::new` shows how jump destinations are analyzed and `is_valid`.
    </fix_strategy>
  </test_failure_group>

  <test_failure_group name="SELFDESTRUCT_GasMismatch_ControlTest">
    <failure_summary>
      Test `control_test.test.Control: SELFDESTRUCT basic operation` fails on gas expectation: `expected 2600, found 7600`.
      The Zig EVM correctly found 7600 gas consumed. The `JumpTable` log is `Opcode 0xff (SELFDESTRUCT), initial frame gas: 10000, const_gas = 5000, gas after const_consume: 5000, gas after op_execute: 2400`. This means `10000 - 2400 = 7600` gas was used.
      The error points to `control_test.zig:349:5`, which is `try helpers.expectGasUsed(test_frame.frame, 10000, helpers.opcodes.gas_constants.ColdAccountAccessCost);`.
    </failure_summary>
    <hypothesis>
      The Zig EVM's gas calculation for `SELFDESTRUCT` (0xff) is likely correct. The test's expectation is incorrect.
      - `SELFDESTRUCT` base cost (since Tangerine Whistle) is 5000 gas.
      - If the beneficiary is a cold account (since Berlin), an additional `COLD_ACCOUNT_ACCESS_COST` (2600 gas) is charged.
      - Total for a cold beneficiary: `5000 + 2600 = 7600` gas.
      The test expects only the `COLD_ACCOUNT_ACCESS_COST`.
    </hypothesis>
    <logging_suggestions>
      Minimal EVM code logging needed. Confirm the conditions in the test:
      In `src/evm/opcodes/control.zig`, inside `op_selfdestruct`:
      ```zig
      std.debug.print("op_selfdestruct: Target beneficiary: {any}\n", .{beneficiary_address});
      // Assuming 'vm.access_list.is_cold(beneficiary_address)' or similar check:
      // std.debug.print("op_selfdestruct: Is beneficiary cold? {any}\n", .{is_beneficiary_cold});
      std.debug.print("op_selfdestruct: Base SELFDESTRUCT gas: {d}\n", .{gas_constants.SelfDestructGas}); // Assuming this is 5000
      // if (is_beneficiary_cold) {
      //    std.debug.print("op_selfdestruct: Adding COLD_ACCOUNT_ACCESS_COST: {d}\n", .{gas_constants.ColdAccountAccessCost});
      // }
      ```
    </logging_suggestions>
    <fix_strategy>
      1.  **Confirm Gas Logic**: Briefly ensure `op_selfdestruct` adds the 5000 base gas and conditionally the 2600 cold access cost.
      2.  **Correct The Test**: Modify `test/evm/opcodes/control_test.zig:349`.
          Change:
          ```zig
          try helpers.expectGasUsed(test_frame.frame, 10000, helpers.opcodes.gas_constants.ColdAccountAccessCost);
          ```
          To:
          ```zig
          try helpers.expectGasUsed(test_frame.frame, 10000, 5000 + helpers.opcodes.gas_constants.ColdAccountAccessCost);
          // Or using constants if available:
          // try helpers.expectGasUsed(test_frame.frame, 10000, gas_constants.SelfDestructGas + gas_constants.ColdAccountAccessCost);
          ```
      3.  **REVM Reference**: `revm/crates/interpreter/src/gas/calc.rs -> selfdestruct_cost` confirms this gas logic.
    </fix_strategy>
  </test_failure_group>

  <test_failure_group name="MemoryStorage_IntegrationFailures">
    *   **Status:** IN PROGRESS - Agent Claude - Worktree: `g/evm-fix-memory-ops`
    <failure_summary>
      Multiple tests in `memory_storage_test.zig` are failing:
      1.  `Memory operations with arithmetic`: `MLOAD` returns 0 instead of 30 after `MSTORE`.
          `JumpTable` logs: `MSTORE` gas seems plausible. `MLOAD` dynamic gas 0 (correct if memory already expanded).
      2.  `Memory copy operations`: `MSTORE` causes `ExecutionError.Error.OutOfGas` from `frame.zig:90:9` (in `consume_gas`).
      3.  `MSTORE8 with bitwise operations`: `MLOAD` returns 0 instead of a large expected value after `MSTORE8` sequence.
      4.  `Memory expansion tracking`: `MSIZE` returns 74, expected 32, after an `MSTORE`.
    </failure_summary>
    <hypothesis>
      General memory system issues in `src/evm/memory.zig` (or `arena_memory.zig`) and/or opcode implementations in `src/evm/opcodes/memory.zig`.
      1.  **`MSTORE`/`MSTORE8` Write Path**: Might not be writing data to the correct internal buffer offset, or failing to update memory's internal size correctly.
      2.  **`MLOAD` Read Path**: Might be reading from incorrect offsets, misinterpreting byte endianness (EVM is big-endian), or not respecting the current memory context/size.
      3.  **Memory Expansion**:
          - For `MSTORE OutOfGas` in "Memory copy operations": `ensure_context_capacity` or `resize_context` (and its gas calculation `gas_constants.memory_gas_cost`) might be requesting an excessively large expansion or miscalculating gas, leading to OOG. The `offset` passed to `MSTORE` from the stack could be faulty.
          - For `MSIZE` returning 74: `MSIZE` should return the highest byte accessed + 1, rounded up to the nearest multiple of 32 bytes if word-operations like `MSTORE` caused the last expansion. If `MSTORE8` was the last op to expand memory, the size can be non-multiple of 32. A value of 74 is odd; if `MSTORE` wrote up to byte 73 (e.g. offset 42 + 31), size should be 96. If it wrote up to byte 31 (offset 0), size is 32. The test expects 32.
    </hypothesis>
    <logging_suggestions>
      In `src/evm/opcodes/memory.zig`:
      ```zig
      // op_mload
      std.debug.print("op_mload: offset_from_stack={any}, offset_usize={d}\n", .{offset_u256, offset_usize});
      std.debug.print("op_mload: memory.context_size={d}\n", .{frame.memory.context_size()});
      // std.debug.print("op_mload: bytes_read_from_memory (first 32)={x}\n", .{read_bytes_slice[0..@min(32, read_bytes_slice.len)]});
      std.debug.print("op_mload: value_pushed={any}\n", .{value_pushed});

      // op_mstore
      std.debug.print("op_mstore: offset_from_stack={any}, value_from_stack={any}\n", .{offset_u256, value_u256});
      std.debug.print("op_mstore: offset_usize={d}\n", .{offset_usize});
      std.debug.print("op_mstore: memory.context_size_before={d}, required_mem_for_write={d}\n", .{current_mem_size, offset_usize + 32});
      // If calling ensure_context_capacity or resize_context:
      std.debug.print("op_mstore: expansion_gas_cost_calc={d}, frame_gas_before_consume={d}\n", .{expansion_gas, frame.gas_remaining});
      // std.debug.print("op_mstore: memory_after_write (around offset {d})={x}\n", .{offset_usize, frame.memory.get_slice(offset_usize, 32) catch &.{},});

      // op_mstore8 (similar to MSTORE, log byte_to_store)
      // op_msize
      std.debug.print("op_msize: frame.memory.context_size() returns {d}\n", .{frame.memory.context_size()});
      ```
      In `src/evm/memory.zig` or `arena_memory.zig` (e.g., `resize_context`, `set_byte`, `get_slice`):
      ```zig
      std.debug.print("MemoryModule.{s}: effective_offset={d}, len={d}, current_buffer_len={d}, my_checkpoint={d}\n", .{@src().fn_name, effective_offset, len_param, self.root_ptr.shared_buffer.items.len, self.my_checkpoint});
      ```
    </logging_suggestions>
    <fix_strategy>
      1.  **Verify `MSTORE`/`MLOAD`/`MSTORE8` data paths**:
          - Ensure correct big-endian conversion for `u256 <-> [32]u8`.
          - Check that `MSTORE8` correctly uses the lowest byte of the `u256` value.
          - Confirm reads/writes use correct absolute offsets in the shared buffer (`my_checkpoint + relative_offset`).
      2.  **Debug `MSIZE` (Memory expansion tracking failure)**:
          - `MSIZE` should return `frame.memory.context_size()`.
          - `frame.memory.context_size()` should be `highest_accessed_offset + 1`, potentially rounded up to a word boundary by some EVM specs/implementations for gas calculation purposes, but MSIZE itself reports active bytes.
          - The test expects 32, found 74. This suggests an `MSTORE` or `MSTORE8` wrote to an address around `73`, making the active memory size 74. The test's expectation of 32 implies it expected an MSTORE at offset 0. Log the offset used by `MSTORE` in this test.
      3.  **Debug `MSTORE OutOfGas` (Memory copy operations failure)**:
          - Log the `offset` passed to the failing `MSTORE`. It might be excessively large.
          - Log `frame.gas_remaining` before `consume_gas` and the `expansion_gas_cost` being consumed.
          - Verify `gas_constants.memory_gas_cost` and the memory expansion logic in `resize_context` or `ensure_context_capacity`.
      4.  **REVM Reference**: `revm/crates/interpreter/src/instructions/memory.rs` and `revm/crates/interpreter/src/interpreter/shared_memory.rs`.
    </fix_strategy>
  </test_failure_group>

  <test_failure_group name="ControlFlow_InvalidOpcodeGas_IntegrationTest">
    <failure_summary>
      Test `control_flow_test.test.Integration: Invalid opcode handling` fails.
      It `expected 0, found 10000` for `frame.gas_remaining` after an `INVALID` (0xfe) opcode.
      The `JumpTable` log: `Opcode 0xfe (INVALID), initial frame gas: 10000, gas after op_execute: 10000` confirms the opcode itself didn't consume gas.
      EVM spec: `INVALID` consumes all remaining gas.
    </failure_summary>
    <hypothesis>
      The `op_invalid` function (in `src/evm/opcodes/control.zig`) likely returns `ExecutionError.Error.InvalidOpcode`. The main execution loop in `src/evm/vm.zig` (or interpreter) fails to handle this error by setting `frame.gas_remaining = 0`.
    </hypothesis>
    <logging_suggestions>
      In the main execution loop in `src/evm/vm.zig` (e.g., `Vm.run` or similar method that calls `JumpTable.execute`):
      ```zig
      // Inside the catch block after JumpTable.execute
      // catch |err| {
      //     std.debug.print("MainLoop: Opcode execution failed with: {any}\n", .{err});
      //     if (err == ExecutionError.Error.InvalidOpcode or err == ExecutionError.Error.InvalidFEOpcode) { // Adjust for your error type
      //         std.debug.print("MainLoop: INVALID opcode detected. Gas before consuming all: {d}\n", .{frame.gas_remaining});
      //         frame.gas_remaining = 0; // Consume all gas
      //         std.debug.print("MainLoop: Gas after consuming all: {d}\n", .{frame.gas_remaining});
      //     }
      //     // ... handle other errors or set return status ...
      // }
      ```
    </logging_suggestions>
    <fix_strategy>
      1.  **Modify Execution Loop**: In the main EVM execution loop, add logic to check if the error returned by an opcode execution is `ExecutionError.Error.InvalidOpcode` (or your equivalent for invalid opcodes like 0xfe).
      2.  If it is, set `frame.gas_remaining = 0` immediately.
      3.  The `InterpreterResult` should then reflect this (0 gas left, status `InvalidOpcode`).
    </fix_strategy>
  </test_failure_group>

  <test_failure_group name="EnvironmentSystem_MemoryErrors_Opcodes">
    <failure_summary>
      Multiple tests in `environment_system_test.zig` fail due to memory access issues within opcodes that interact with memory or external data sources:
      - `Log emission with topics` (`LOG3`): `ExecutionError.Error.OutOfOffset` from `log.zig:56:17`.
      - `External code operations` (`EXTCODECOPY`): `ExecutionError.Error.OutOfOffset` from `environment.zig:147:9`.
      - `Calldata operations` (`CALLDATACOPY`): `MemoryError.InvalidOffset` from `memory.zig:315:9` (in `get_slice` called by test helper `getMemory`).
      - `Self balance and code operations` (`CODECOPY`): `MemoryError.InvalidOffset` from `memory.zig:315:9` (in `get_slice` called by test helper `getMemory`).
    </failure_summary>
    <hypothesis>
      These point to issues in how these opcodes:
      1.  Calculate memory offsets and sizes from stack arguments.
      2.  Ensure sufficient memory is allocated/expanded via `ensure_context_capacity` or `resize_context` before memory access.
      3.  Handle bounds when copying data from a source (calldata, code, external code) to memory.
      4.  For `CALLDATACOPY` and `CODECOPY`, the error is in the test helper `getMemory`. This suggests the opcode might have written data correctly, but either didn't expand memory to the size the test helper expects, or the test helper is using an incorrect offset/size to read back.
      5.  Error mis-mapping from memory module to `OutOfOffset` by opcode handlers might still be a factor.
    </hypothesis>
    <logging_suggestions>
      For each failing opcode (`op_logN` in `log.zig`, `op_extcodecopy`, `op_calldatacopy`, `op_codecopy` in `environment.zig` or `system.zig`):
      ```zig
      // Generic logging pattern
      std.debug.print("Opcode 0x{x}: Stack inputs: mem_offset={any}, src_offset={any}, len={any}\n", .{opcode_byte, mem_offset_u256, src_offset_u256, len_u256});
      std.debug.print("Opcode 0x{x}: usize conversions: mem_offset_usize={d}, src_offset_usize={d}, len_usize={d}\n", .{opcode_byte, mem_offset_usize, src_offset_usize, len_usize});
      std.debug.print("Opcode 0x{x}: frame.memory.context_size() BEFORE expansion = {d}\n", .{opcode_byte, frame.memory.context_size()});
      std.debug.print("Opcode 0x{x}: Required memory for op: {d}\n", .{opcode_byte, mem_offset_usize + len_usize});
      // ... call to ensure_context_capacity or resize_memory ...
      // std.debug.print("Opcode 0x{x}: frame.memory.context_size() AFTER expansion = {d}\n", .{opcode_byte, frame.memory.context_size()});
      // std.debug.print("Opcode 0x{x}: Source data length (if applicable, e.g., calldata.len): {d}\n", .{opcode_byte, source_data_len});
      // ... before actual memory.set_data or memory.get_slice ...
      ```
      For `CALLDATACOPY` and `CODECOPY` failures in `test_helpers.zig` (`getMemory`):
      ```zig
      // Inside test_helpers.getMemory
      // std.debug.print("getMemory: Attempting to read offset={d}, size={d}. Current frame memory size={d}\n", .{offset_param, size_param, self.frame.memory.context_size()});
      // const slice = try self.frame.memory.get_slice(offset_param, size_param);
      ```
    </logging_suggestions>
    <fix_strategy>
      1.  **Verify Memory Expansion**: For each opcode, ensure `frame.memory.ensure_context_capacity(mem_offset_usize + len_usize)` (or equivalent `resize_context`) is called correctly *before* any attempt to write to memory. The size passed to `ensure_context_capacity` must be the highest byte address that will be touched by the operation.
      2.  **Check `set_data_bounded` (or similar)**: For `EXTCODECOPY`, `CALLDATACOPY`, `CODECOPY`, these opcodes copy data from a source to memory. The function handling this copy (likely `frame.memory.set_data_bounded`) must correctly handle cases where `src_offset + len` exceeds source length (by zero-padding the destination memory) and where `len` is zero.
      3.  **Source Lengths**: Ensure `calldata.len` (for `CALLDATACOPY`), `contract.code.len` (for `CODECOPY`), and external code length (for `EXTCODECOPY`) are correctly obtained and used for bounds checking *before* copying.
      4.  **Test Helper `getMemory`**: For `CALLDATACOPY` and `CODECOPY` failures, the test helper calls `test_frame.getMemory(0, calldata.len)` or `test_frame.getMemory(0, contract_code.len)`. This assumes the opcodes wrote to memory offset `0`. If the opcodes used a different `mem_offset` from the stack, the test helper is reading the wrong location. The `len` parameter to `getMemory` must also match what was actually written and allocated.
      5.  **Error Propagation**: Reiterate ensuring memory errors are mapped correctly by opcode handlers.
      6.  **REVM Comparison**:
          - `revm/crates/interpreter/src/instructions/system.rs` (for `CALLDATACOPY`, `CODECOPY`).
          - `revm/crates/interpreter/src/instructions/host.rs` (for `EXTCODECOPY`, `LOGx`).
          - Note REVM's use of `resize_memory!` macro and `Memory::set_data`.
    </fix_strategy>
  </test_failure_group>

  <test_failure_group name="ComplexInteractions_MSTORE_SLOAD_Logic">
    <failure_summary>
      Tests in `complex_interactions_test.zig` are failing:
      1.  `Token balance check pattern` (`MSTORE`): `ExecutionError.Error.OutOfOffset` from `memory.zig:67:9` within `op_mstore`. `gas after op_execute` is same as `gas after const_consume`, error is early.
      2.  `Packed struct storage`: `expected 12345, found 0` after `SLOAD` and bitwise ops.
      3.  `Multi-sig wallet threshold check`: `expected 1, found 0` after a complex sequence.
    </failure_summary>
    <hypothesis>
      - **`MSTORE OutOfOffset`**: The `offset` provided to `MSTORE` is extremely large, causing `offset_usize + 32` to overflow `usize`, or it's triggering a hard limit check within your memory module's store function (at `memory.zig:67`) even before gas for expansion is considered. The test is likely preparing data for a `KECCAK256` or call, and the offset calculation for this preparation is flawed.
      - **`Packed struct storage` & `Multi-sig wallet threshold check`**: These are likely logic errors within the sequence of operations in the test or subtle bugs in individual opcodes (`SSTORE`, `SLOAD`, bitwise ops, arithmetic ops, comparison ops) that only manifest in these complex interactions. "Found 0" often means `SLOAD` returned 0 unexpectedly or a subsequent calculation zeroed out the result.
    </hypothesis>
    <logging_suggestions>
      For `MSTORE OutOfOffset` (Token balance check):
      ```zig
      // In op_mstore (src/evm/opcodes/memory.zig)
      std.debug.print("op_mstore (TokenBalance): offset_from_stack={any} (hex: 0x{x})\n", .{offset_from_stack, offset_from_stack});
      // If offset is converted to usize:
      // std.debug.print("op_mstore (TokenBalance): offset_usize={d}\n", .{offset_usize});
      // std.debug.print("op_mstore (TokenBalance): calculated_required_end_address={d}\n", .{offset_usize + 32});
      ```
      For `Packed struct storage` & `Multi-sig`:
      Log the inputs and outputs of *every* opcode in the sequence within the test case execution.
      ```zig
      // Example for SLOAD in these tests:
      std.debug.print("ComplexTest SLOAD: slot={any}, value_read={any}\n", .{slot_from_stack, value_from_storage});
      // Example for SSTORE:
      std.debug.print("ComplexTest SSTORE: slot={any}, value_written={any}\n", .{slot_from_stack, value_to_write});
      // Example for AND:
      std.debug.print("ComplexTest AND: val1={any}, val2={any}, result={any}\n", .{val1, val2, result_of_and});
      ```
    </logging_suggestions>
    <fix_strategy>
      **For `MSTORE OutOfOffset` (Token balance check)**:
      1.  The `MSTORE` error at `memory.zig:67` is crucial. Identify this line. It's a check that fails *before* memory expansion gas is deducted.
      2.  Log the `offset` value popped from the stack by `op_mstore`. It's highly probable this offset is astronomically large or invalid.
      3.  Trace back in the `Token balance check pattern` test to see how this offset is calculated and pushed onto the stack. It could be an uninitialized value or an error in SHA3/KECCAK256 input preparation.

      **For `Packed struct storage` & `Multi-sig wallet threshold check`**:
      1.  **Detailed Trace**: Manually (or with extensive logging) execute the sequence of opcodes shown in the test log, tracking stack, storage, and memory changes. Compare with expected intermediate values.
      2.  **Verify Bitwise Operations**: For "Packed struct storage," ensure `SHL`, `OR`, `AND` (and `SHR` if used implicitly for unpacking high bits) are correctly implemented for `u256` and match EVM semantics (e.g., shift amounts > 255).
      3.  **Verify Storage Operations**: Confirm `SSTORE` writes the exact bits of the packed `u256` and `SLOAD` retrieves them faithfully.
      4.  **Verify Logic/Arithmetic**: For "Multi-sig," double-check all comparison and arithmetic operations in the sequence. A single off-by-one or incorrect comparison can break the logic.
      5.  **Gas**: While not the primary error, ensure gas isn't running out prematurely in these long sequences, which could truncate execution. The logs usually show plenty of gas, though.
    </fix_strategy>
  </test_failure_group>

</debugging_session>