# Implement State Test Runner

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_state_test_runner` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_state_test_runner feat_implement_state_test_runner`
3. **Work in isolation**: `cd g/feat_implement_state_test_runner`
4. **Commit message**: `✨ feat: implement official Ethereum state test execution runner`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a state test runner that can execute official Ethereum state tests. This enables comprehensive compatibility testing against the Ethereum Foundation's test suite, ensuring the EVM implementation correctly handles all edge cases and maintains consensus compatibility.

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Use official test vectors** - Download from ethereum/tests repository
3. **Handle all hardforks** - Tests span all Ethereum history
4. **Validate state roots** - Critical for consensus compatibility
5. **Report failures clearly** - Enable easy debugging of issues