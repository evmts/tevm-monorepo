# Implement State Test Runner

You are implementing State Test Runner for the Tevm EVM written in Zig. Your goal is to implement Ethereum state test runner for compliance verification following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_state_test_runner` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_state_test_runner feat_implement_state_test_runner`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a state test runner that can execute official Ethereum state tests. This enables comprehensive compatibility testing against the Ethereum Foundation's test suite, ensuring the EVM implementation correctly handles all edge cases and maintains consensus compatibility.

## ELI5

Imagine you're building a clone of a complex recipe and want to make sure it tastes exactly like the original. The state test runner is like having the master chef's official cookbook with thousands of precise test recipes - each one specifies exact ingredients (initial state), cooking steps (transactions), and what the final dish should look like (expected final state). By running our EVM through these official "cooking tests" from the Ethereum Foundation, we can verify that our implementation produces exactly the same results as the reference implementation, ensuring perfect compatibility with the real Ethereum network.

## Ethereum State Test Format

### Test Structure
```json
{
  "testName": {
    "env": {
      "currentCoinbase": "0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba",
      "currentDifficulty": "0x020000",
      "currentGasLimit": "0x7fffffffffffffff",
      "currentNumber": "0x01",
      "currentTimestamp": "0x03e8",
      "previousHash": "0x5e20a0453cecd065ea59c37ac63e079ee08998b6045136a8ce6635c7912ec0b6"
    },
    "pre": {
      "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b": {
        "balance": "0x0de0b6b3a7640000",
        "code": "0x",
        "nonce": "0x00",
        "storage": {}
      }
    },
    "transaction": {
      "data": ["0x"],
      "gasLimit": ["0x5208"],
      "gasPrice": "0x01",
      "nonce": "0x00",
      "secretKey": "0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8",
      "to": "0x095e7baea6a6c7c4c2dfeb977efac326af552d87",
      "value": ["0x0186a0"]
    },
    "post": {
      "EIP150": [
        {
          "hash": "0x...",
          "logs": "0x...",
          "indexes": {
            "data": 0,
            "gas": 0,
            "value": 0
          }
        }
      ]
    }
  }
}
```

## Implementation Requirements

### Core Functionality
1. **Test Loading**: Parse JSON state test files
2. **State Setup**: Initialize EVM state from pre-state
3. **Transaction Execution**: Execute test transactions
4. **Result Validation**: Compare against expected post-state
5. **Fork Support**: Handle tests across different hardforks
6. **Batch Processing**: Run multiple tests efficiently

### Files to Create/Modify
- `/src/evm/testing/state_test_runner.zig` - New state test runner
- `/src/evm/testing/test_parser.zig` - JSON test file parser
- `/src/evm/testing/state_validator.zig` - State comparison utilities
- `/src/evm/testing/test_types.zig` - Test data structures
- `/test/evm/state_tests/` - Directory for running actual state tests

### Test Runner Architecture
```zig
pub const StateTestRunner = struct {
    allocator: std.mem.Allocator,
    vm: *VM,
    
    pub fn run_test_file(self: *StateTestRunner, file_path: []const u8) !TestResults {
        const test_data = try self.parse_test_file(file_path);
        var results = TestResults.init(self.allocator);
        
        for (test_data.tests) |test| {
            const result = try self.run_single_test(test);
            try results.append(result);
        }
        
        return results;
    }
    
    fn run_single_test(self: *StateTestRunner, test: StateTest) !TestResult {
        // Setup pre-state
        try self.setup_pre_state(test.pre);
        
        // Execute transaction
        const tx_result = try self.execute_transaction(test.transaction, test.env);
        
        // Validate post-state
        const validation = try self.validate_post_state(test.post, tx_result.fork);
        
        return TestResult{
            .name = test.name,
            .passed = validation.passed,
            .expected_hash = validation.expected_hash,
            .actual_hash = validation.actual_hash,
            .error = validation.error,
        };
    }
};
```

## Success Criteria

1. **Test Compatibility**: Successfully runs official Ethereum state tests
2. **Fork Support**: Handles all hardforks from Frontier to latest
3. **Result Validation**: Accurately validates state root hashes and logs
4. **Error Reporting**: Provides detailed failure analysis
5. **Performance**: Efficiently processes large test suites
6. **Integration**: Works with existing EVM and state management

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

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/state/state_test_runner_test.zig`)
```zig
// Test basic state test runner functionality
test "state_test_runner basic functionality works correctly"
test "state_test_runner handles edge cases properly"
test "state_test_runner validates inputs appropriately"
test "state_test_runner produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "state_test_runner integrates with EVM properly"
test "state_test_runner maintains system compatibility"
test "state_test_runner works with existing components"
test "state_test_runner handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "state_test_runner meets performance requirements"
test "state_test_runner optimizes resource usage"
test "state_test_runner scales appropriately with load"
test "state_test_runner benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "state_test_runner meets specification requirements"
test "state_test_runner maintains EVM compatibility"
test "state_test_runner handles hardfork transitions"
test "state_test_runner cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "state_test_runner handles errors gracefully"
test "state_test_runner proper error propagation"
test "state_test_runner recovery from failure states"
test "state_test_runner validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "state_test_runner prevents security vulnerabilities"
test "state_test_runner handles malicious inputs safely"
test "state_test_runner maintains isolation boundaries"
test "state_test_runner validates security properties"
```

### Test Development Priority
1. **Core functionality** - Basic feature operation
2. **Specification compliance** - Meet requirements
3. **Integration** - System-level correctness
4. **Performance** - Efficiency targets
5. **Error handling** - Robust failures
6. **Security** - Vulnerability prevention

### Test Data Sources
- **Specification documents**: Official requirements and test vectors
- **Reference implementations**: Cross-client compatibility
- **Performance baselines**: Optimization targets
- **Real-world data**: Production scenarios
- **Synthetic cases**: Edge conditions and stress testing

### Continuous Testing
- Run `zig build test-all` after every change
- Maintain 100% test coverage for public APIs
- Validate performance regression prevention
- Test both debug and release builds
- Verify cross-platform behavior

### Test-First Examples

**Before implementation:**
```zig
test "state_test_runner basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = state_test_runner.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const state_test_runner = struct {
    pub fn process(input: InputType) !OutputType {
        return error.NotImplemented; // Initially
    }
};
```

### Critical Requirements
- **Never commit without passing tests**
- **Test all configuration paths**
- **Verify specification compliance**
- **Validate performance implications**
- **Ensure cross-platform compatibility**

