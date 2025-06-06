<Prompt>
  <Introduction>
    Your goal is to fix all failing tests in our EVM implementation. For each failure, determine whether the test or the implementation is incorrect, apply the fix, and ensure no regressions occur.
  </Introduction>
  <MultAgentWarning>
   You are one of many agents working on this. This is why you will be using worktrees. But be aware that other agents will be fixing bugs in their worktree with this same prompt. For this reason you should focus on one bug at a time as another agent is taking care of other bugs so simply make a todo list for one at a time
  </MultAgentWarning>
  <BranchGuidelines>
    <WorkBranch>
      <CreateWorktree>
        Always create a Git worktree named <code>g/&lt;bug-fix-name&gt;</code> and work there instead of on the main codebase.
      </CreateWorktree>
      <CommentOnMain>
        On the main branch (not the worktree), add a comment on the failing test you’re working on to indicate ownership. This prevents others from duplicating effort.
      </CommentOnMain>
      <CherryPickPolicy>
        When cherry-picking changes back into the branch we’re working off of:
        <PreCherryPick>
          Run the full test suite to confirm a clean baseline.
        </PreCherryPick>
        <PostCherryPick>
          Run the tests again immediately. If any regressions appear in tests you did not touch, revert the cherry-pick, rebase your worktree, fix the conflicts or issues, and repeat.
        </PostCherryPick>
      </CherryPickPolicy>
    </WorkBranch>
  </BranchGuidelines>

  <BugFixWorkflow>
    <RunTests>
      <Step number="1">
        Execute the entire test suite and identify the most strategic failing test to tackle next.
      </Step>
    </RunTests>

    <AnalyzeFailure>
      <Step number="2">
        For the selected failing test:
        <DetermineRootCause>
          Compare our implementation to the reference in <code>revm/crates/interpreter</code> (and other relevant revm crates). Identify discrepancies between our code and revm’s behavior.
        </DetermineRootCause>
      </Step>
    </AnalyzeFailure>

    <DebugLogging>
      <Step number="3">
        Before making a final decision, add debug logging around the failing opcode or function. Re-run tests with logging enabled to validate your assumptions about state, stack, and storage.
      </Step>
    </DebugLogging>

    <Fix>
      <Step number="4">
        Based on the analysis and logs, decide whether to:
        <FixTest>
          Update the test expectation or setup if the test is wrong.
        </FixTest>
        <FixImplementation>
          Correct our implementation (opcode handling, gas calculations, stack operations, etc.) if our code is at fault.
        </FixImplementation>
      </Step>
    </Fix>

    <VerifyFix>
      <Step number="5">
        After applying your fix:
        <RerunTests>
          Run the full test suite again.
        </RerunTests>
        <CheckNoRegressions>
          Confirm that:
          <TestUnderFix>the originally failing test now passes</TestUnderFix>
          <OtherTests>no other tests have regressed</OtherTests>
        </CheckNoRegressions>
      </Step>
    </VerifyFix>

    <RevertIfNecessary>
      <Step number="6">
        If regressions are detected:
        <RevertChange>
          Revert your cherry-pick.
        </RevertChange>
        <RebaseAndIterate>
          Return to your worktree, rebase onto the latest main, resolve conflicts or new issues, and repeat the workflow starting at <Step number="1"/>.
        </RebaseAndIterate>
      </Step>
    </RevertIfNecessary>

  </BugFixWorkflow>

  <RepeatUntilAllPass>
    Once a failing test is fixed with no regressions, start over at <RunTests> and repeat the workflow until every test in the repository passes.
  </RepeatUntilAllPass>
</Prompt>
<FailingTests>
  <!--
    EVM source code is located in evm/src
    Test code is located in test/evm
  -->

  <FailingTest name="SLOAD Test" status="pending">
    <Description>
      Verifies correct behavior of SLOAD: fetching storage values under Berlin rules (cold vs. warm access) and pushing onto the stack.
    </Description>
    <Opcodes>
      <Opcode code="0x54">SLOAD</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/sload_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        Cold access gas cost = 2100, push correct value from storage.
      </Expected>
      <Actual>
        Gas cost incorrectly computed or wrong value on stack.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="SSTORE Test" status="pending">
    <Description>
      Verifies correct behavior of SSTORE: storing values to storage, handling gas refunds, and interaction with prior storage state.
    </Description>
    <Opcodes>
      <Opcode code="0x55">SSTORE</Opcode>
      <Opcode code="0x54">SLOAD</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/sstore_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        Storage slot updated, correct gas refund logic, subsequent SLOAD returns new value.
      </Expected>
      <Actual>
        Either storage not updated or gas refund incorrect.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="DUP Underflow Test" status="pending">
    <Description>
      Ensures DUPn reverts with StackUnderflow when the stack is too small, and duplicates the nth-from-top value otherwise.
    </Description>
    <Opcodes>
      <Opcode code="0x80">DUP1</Opcode>
      <Opcode code="0x81">DUP2</Opcode>
      <Opcode code="0x82">DUP3</Opcode>
      <Opcode code="0x83">DUP4</Opcode>
      <Opcode code="0x84">DUP5</Opcode>
      <Opcode code="0x85">DUP6</Opcode>
      <!-- Continue up to the maximum DUP opcode used in this test -->
    </Opcodes>
    <TestFile>test/evm/opcodes/dup_underflow_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        When stack size < n, error.StackUnderflow; else duplicate correct stack entry.
      </Expected>
      <Actual>
        Either wrong item duplicated or no underflow error thrown.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="SWAP Behavior Test" status="pending">
    <Description>
      Validates SWAPn swaps the top-of-stack with the nth-from-top value, and reverts on underflow if the stack is too short.
    </Description>
    <Opcodes>
      <Opcode code="0x90">SWAP1</Opcode>
      <Opcode code="0x91">SWAP2</Opcode>
      <Opcode code="0x92">SWAP3</Opcode>
      <!-- Continue for all SWAP variants tested -->
    </Opcodes>
    <TestFile>test/evm/opcodes/swap_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        After SWAPn, positions of top and nth-from-top values are exchanged.
      </Expected>
      <Actual>
        Either wrong positions swapped or no error when stack too short.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="LOG Opcodes Test" status="pending">
    <Description>
      Checks LOG0–LOG4: correct gas consumption, memory expansion, and topic/data handling for events.
    </Description>
    <Opcodes>
      <Opcode code="0xa0">LOG0</Opcode>
      <Opcode code="0xa1">LOG1</Opcode>
      <Opcode code="0xa2">LOG2</Opcode>
      <Opcode code="0xa3">LOG3</Opcode>
      <Opcode code="0xa4">LOG4</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/log_opcodes_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        Correct gas based on data size, correct number of topics popped, and memory expansion when needed.
      </Expected>
      <Actual>
        Gas charged incorrectly or memory offset bounds not enforced correctly.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="KECCAK256 Test" status="pending">
    <Description>
      Ensures KECCAK256 computes correct hashes for given memory offset/length, and charges proper gas for memory expansion.
    </Description>
    <Opcodes>
      <Opcode code="0x20">KECCAK256</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/keccak256_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        Hash matches reference data, gas = 6 + 6 * ceil(size/32).
      </Expected>
      <Actual>
        Either wrong hash output or incorrect gas calculation.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Undefined Opcode Error Test" status="pending">
    <Description>
      Verifies that execution of an opcode not present in the jump table returns InvalidOpcode.
    </Description>
    <Opcodes>
      <Opcode code="0x21">(Undefined)</Opcode>
      <Opcode code="0x22">(Undefined)</Opcode>
      <Opcode code="0x23">(Undefined)</Opcode>
      <Opcode code="0x24">(Undefined)</Opcode>
      <!-- Include all undefined opcodes tested -->
    </Opcodes>
    <TestFile>test/evm/opcodes/undefined_opcode_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        ExecutionError.Error.InvalidOpcode for each undefined opcode.
      </Expected>
      <Actual>
        Different error or no error raised.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Jump and JUMPI Tests" status="pending">
    <Description>
      Validates JUMP and JUMPI behavior: correct PC update on valid destinations, revert on invalid, and conditional vs. unconditional jumps.
    </Description>
    <Opcodes>
      <Opcode code="0x56">JUMP</Opcode>
      <Opcode code="0x57">JUMPI</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/jump_tests.zig</TestFile>
    <FailureDetails>
      <Expected>
        Valid jump destinations only (to a JUMPDEST), correct condition check for JUMPI.
      </Expected>
      <Actual>
        Either skipping validation or wrong PC update.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Pushn Instruction Tests" status="pending">
    <Description>
      Checks PUSH1–PUSH32 load correct immediate bytes onto the stack and advance PC properly.
    </Description>
    <Opcodes>
      <Opcode code="0x60">PUSH1</Opcode>
      <Opcode code="0x61">PUSH2</Opcode>
      <!-- Continue up to PUSH32 as used in these tests -->
    </Opcodes>
    <TestFile>test/evm/opcodes/push_tests.zig</TestFile>
    <FailureDetails>
      <Expected>
        Immediate bytes pushed as a single U256, PC increment by n+1.
      </Expected>
      <Actual>
        Incorrect concatenation of bytes or wrong PC increment.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Arithmetic and Comparison Tests" status="pending">
    <Description>
      Verifies ADD, SUB, MUL, DIV, LT, GT, EQ, ISZERO, etc., produce correct results and handle overflow/wraparound.
    </Description>
    <Opcodes>
      <Opcode code="0x01">ADD</Opcode>
      <Opcode code="0x03">SUB</Opcode>
      <Opcode code="0x02">MUL</Opcode>
      <Opcode code="0x04">DIV</Opcode>
      <Opcode code="0x10">LT</Opcode>
      <Opcode code="0x11">GT</Opcode>
      <Opcode code="0x14">EQ</Opcode>
      <Opcode code="0x15">ISZERO</Opcode>
      <!-- Include any other arithmetic/comparison opcodes in these tests -->
    </Opcodes>
    <TestFile>test/evm/opcodes/arithmetic_tests.zig</TestFile>
    <FailureDetails>
      <Expected>
        Correct mathematical result for both small and large U256 values, proper flag setting for comparisons.
      </Expected>
      <Actual>
        Arithmetic overflow not handled or wrong comparison result.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Memory Load/Store Tests" status="pending">
    <Description>
      Checks MLOAD, MSTORE, MSTORE8: correct reading/writing to byte-addressable memory, with proper zero-extension and gas cost.
    </Description>
    <Opcodes>
      <Opcode code="0x51">MLOAD</Opcode>
      <Opcode code="0x52">MSTORE</Opcode>
      <Opcode code="0x53">MSTORE8</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/memory_tests.zig</TestFile>
    <FailureDetails>
      <Expected>
        Read/write bytes correctly, expand memory as needed with correct gas.
      </Expected>
      <Actual>
        Wrong byte order or memory not expanded correctly.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="SHA3/KECCAK Memory Offset Bound Test" status="pending">
    <Description>
      Ensures KECCAK256 reverts on invalid memory offset or length (out-of-bounds).
    </Description>
    <Opcodes>
      <Opcode code="0x20">KECCAK256</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/keccak_bounds_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        ExecutionError.Error.InvalidOffset when offset+length exceeds memory size.
      </Expected>
      <Actual>
        No error or incorrect error code.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Stack Validation Comprehensive Test" status="pending">
    <Description>
      Verifies that any opcode requiring N stack arguments fails with StackUnderflow when fewer than N items exist.
    </Description>
    <Opcodes>
      <!-- Sample of opcodes covering various required stack sizes -->
      <Opcode code="0x01">ADD</Opcode>
      <Opcode code="0x02">MUL</Opcode>
      <Opcode code="0x80">DUP1</Opcode>
      <Opcode code="0x90">SWAP1</Opcode>
      <!-- etc. -->
    </Opcodes>
    <TestFile>test/evm/opcodes/stack_validation_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        Error.StackUnderflow when insufficient stack items.
      </Expected>
      <Actual>
        Either no error or wrong error variant.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Call and Create Opcode Tests" status="pending">
    <Description>
      Validates CALL, CALLCODE, DELEGATECALL, STATICCALL, CREATE, CREATE2: correct parameter handling, gas, and context rules.
    </Description>
    <Opcodes>
      <Opcode code="0xf0">CREATE</Opcode>
      <Opcode code="0xf1">CALL</Opcode>
      <Opcode code="0xf2">CALLCODE</Opcode>
      <Opcode code="0xf4">DELEGATECALL</Opcode>
      <Opcode code="0xfa">STATICCALL</Opcode>
      <Opcode code="0xf5">CREATE2</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/call_create_tests.zig</TestFile>
    <FailureDetails>
      <Expected>
        Proper context switch, gas check (static call protection, balance checks), and correct return values.
      </Expected>
      <Actual>
        Wrong error code (e.g., OutOfGas instead of WriteProtection) or incorrect address/bytecode handling.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Selfdestruct Opcode Test" status="pending">
    <Description>
      Ensures SELFDESTRUCT (0xff) has correct owner check, gas refund, and account deletion semantics.
    </Description>
    <Opcodes>
      <Opcode code="0xff">SELFDESTRUCT</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/selfdestruct_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        Revert on static context, correct beneficiary transfer, account removal.
      </Expected>
      <Actual>
        No revert or incorrect transfer values.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Invalid Opcode Range Test" status="pending">
    <Description>
      Verifies that any opcode in the 0x5e–0x5f and 0x60–0x7f range not explicitly implemented results in InvalidOpcode.
    </Description>
    <Opcodes>
      <Opcode code="0x5e">(Undefined)</Opcode>
      <Opcode code="0x5f">(Undefined)</Opcode>
      <Opcode code="0x61">PUSH2 (if missing)</Opcode>
      <!-- List all in-range opcodes tested -->
    </Opcodes>
    <TestFile>test/evm/opcodes/invalid_range_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        ExecutionError.Error.InvalidOpcode for each missing implementation.
      </Expected>
      <Actual>
        Either no error or wrong behavior.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Gas Calculation Edge Case Test" status="pending">
    <Description>
      Checks that certain opcodes (e.g., SLOAD, SSTORE, EXP) use correct gas formulas in edge scenarios (extreme inputs).
    </Description>
    <Opcodes>
      <Opcode code="0x0b">EXP</Opcode>
      <Opcode code="0x54">SLOAD</Opcode>
      <Opcode code="0x55">SSTORE</Opcode>
      <!-- Any others with special gas rules -->
    </Opcodes>
    <TestFile>test/evm/opcodes/gas_edge_case_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        Exact gas per EIP-1884/EIP-2200/EIP-2929 as applicable.
      </Expected>
      <Actual>
        Gas too low/high or no refund applied.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Logic and Comparison Integration Test" status="pending">
    <Description>
      Runs a small snippet combining SLOAD, arithmetic, and conditional JUMPI to test combined logic.
    </Description>
    <Opcodes>
      <Opcode code="0x54">SLOAD</Opcode>
      <Opcode code="0x03">SUB</Opcode>
      <Opcode code="0x10">LT</Opcode>
      <Opcode code="0x57">JUMPI</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/combined_logic_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        Correct result of comparison and jump behavior.
      </Expected>
      <Actual>
        Comparison yields wrong boolean or JUMPI does not branch correctly.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Integration: Complex Interaction Test" status="pending">
    <Description>
      An end-to-end scenario combining multiple opcodes (MLOAD/MSTORE, SLOAD/SSTORE, LOG, CALL) to simulate a contract invocation with logs and storage.
    </Description>
    <Opcodes>
      <Opcode code="0x51">MLOAD</Opcode>
      <Opcode code="0x52">MSTORE</Opcode>
      <Opcode code="0x54">SLOAD</Opcode>
      <Opcode code="0x55">SSTORE</Opcode>
      <Opcode code="0xa0">LOG0</Opcode>
      <Opcode code="0xf1">CALL</Opcode>
    </Opcodes>
    <TestFile>test/evm/integration/complex_interactions_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        All intermediate steps succeed, final state matches expected.
      </Expected>
      <Actual>
        Mismatch in storage value or wrong log emission.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Storage Comprehensive Test: EIP-2200 gas cost scenarios" status="pending">
    <Description>
      Verifies SSTORE gas cost according to EIP-2200: fresh storage vs. rewritten storage yields different gas updates.
    </Description>
    <Opcodes>
      <Opcode code="0x55">SSTORE</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/storage_comprehensive_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        For overwriting a nonzero value, <code>gas_update</code> should be less than <code>gas_fresh</code>.
      </Expected>
      <Actual>
        <code>gas_update</code> ≥ <code>gas_fresh</code>, indicating incorrect refund or gas calculation.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="Storage Comprehensive Test: Overwriting values" status="pending">
    <Description>
      Ensures SSTORE overwriting a slot updates storage value correctly and charges the expected gas.
    </Description>
    <Opcodes>
      <Opcode code="0x55">SSTORE</Opcode>
      <Opcode code="0x54">SLOAD</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/storage_comprehensive_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        After SSTORE, a subsequent SLOAD returns the new value (e.g., 2457).
      </Expected>
      <Actual>
        SLOAD returned 0 instead of 2457, indicating storage not updated properly.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="VM Opcode Test: JUMPI conditional jump taken" status="pending">
    <Description>
      Validates that JUMPI takes the jump when the condition is nonzero.
    </Description>
    <Opcodes>
      <Opcode code="0x57">JUMPI</Opcode>
    </Opcodes>
    <TestFile>test/evm/vm_opcode_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        <code>result.status == .Success</code> when the jump condition is true.
      </Expected>
      <Actual>
        <code>result.status</code> indicates failure (not .Success), meaning JUMPI did not branch.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="VM Opcode Test: JUMPI conditional jump not taken" status="pending">
    <Description>
      Validates that JUMPI does not take the jump when the condition is zero.
    </Description>
    <Opcodes>
      <Opcode code="0x57">JUMPI</Opcode>
    </Opcodes>
    <TestFile>test/evm/vm_opcode_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        <code>result.status == .Success</code> when the jump condition is zero (no jump).
      </Expected>
      <Actual>
        <code>result.status</code> indicates failure, meaning JUMPI incorrectly branched or produced an error.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="VM Opcode Test: SUB large numbers" status="pending">
    <Description>
      Ensures SUB on large U256 values wraps around correctly (mod 2^256 subtraction).
    </Description>
    <Opcodes>
      <Opcode code="0x03">SUB</Opcode>
    </Opcodes>
    <TestFile>test/evm/vm_opcode_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        For underflow subtraction, result should be 
        28948022309329048855892746252171976963317496166410141009864396001978282409984.
      </Expected>
      <Actual>
        Got 
        57896044618658097711785492504343953926634992332820282019728792003956564819968,
        indicating incorrect wraparound.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="VM Opcode Test: Conditional logic with comparison" status="pending">
    <Description>
      Runs an SLOAD, comparison (LT/GT/EQ), and then JUMPI to verify correct conditional behavior.
    </Description>
    <Opcodes>
      <Opcode code="0x54">SLOAD</Opcode>
      <Opcode code="0x10">LT</Opcode>
      <Opcode code="0x57">JUMPI</Opcode>
    </Opcodes>
    <TestFile>test/evm/vm_opcode_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        <code>result.status == .Success</code> when comparison yields correct boolean and JUMPI branches appropriately.
      </Expected>
      <Actual>
        <code>result.status</code> indicates failure; either comparison or JUMPI logic is incorrect.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="VM Opcode Test: Out of gas" status="pending">
    <Description>
      Verifies that executing a gas-intensive opcode sequence results in an OutOfGas error when gas is insufficient.
    </Description>
    <Opcodes>
      <!-- The specific opcodes depend on the test scenario; typically a loop of arithmetic or memory ops -->
      <Opcode code="0x01">ADD</Opcode>
      <Opcode code="0x02">MUL</Opcode>
      <Opcode code="0x51">MLOAD</Opcode>
      <!-- etc. -->
    </Opcodes>
    <TestFile>test/evm/vm_opcode_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        Error.OutOfGas when gas consumption exceeds the allowance.
      </Expected>
      <Actual>
        Test did not return OutOfGas or returned a different error.
      </Actual>
    </FailureDetails>
  </FailingTest>

  <FailingTest name="CALL InvalidOffset Test" status="pending">
    <Description>
      Multiple CALL-related opcodes (CALL, CALLCODE, DELEGATECALL, STATICCALL) are failing with InvalidOffset error when checking memory bounds, even with valid parameters.
    </Description>
    <Opcodes>
      <Opcode code="0xF1">CALL</Opcode>
      <Opcode code="0xF2">CALLCODE</Opcode>
      <Opcode code="0xF4">DELEGATECALL</Opcode>
      <Opcode code="0xFA">STATICCALL</Opcode>
    </Opcodes>
    <TestFile>test/evm/opcodes/create_call_comprehensive_test.zig</TestFile>
    <FailureDetails>
      <Expected>
        CALL operations should succeed with valid parameters, or fail with appropriate errors (WriteProtection for static context).
      </Expected>
      <Actual>
        All CALL-related tests failing with InvalidOffset error from check_offset_bounds function in system.zig:23.
      </Actual>
    </FailureDetails>
  </FailingTest>

</FailingTests>
