const std = @import("std");
const TestInfo = @import("tests.zig").TestInfo;

// EVM core tests
pub const evmCoreTests = [_]TestInfo{
    // State management tests
    .{ .name = "statedb-test", .root = "src/Evm/StateDB.zig", .step_name = "test-statedb" },
    .{ .name = "state-statedb-test", .root = "src/Evm/State/StateDB.zig", .step_name = "test-state-statedb" },
    .{ .name = "state-statedb-advanced-test", .root = "test/Evm/State/StateDB.test.zig", .step_name = "test-state-statedb-advanced" },
    .{ .name = "account-test", .root = "src/Evm/Account.zig", .step_name = "test-account" },
    .{ .name = "state-account-test", .root = "src/Evm/State/Account.zig", .step_name = "test-state-account" },
    .{ .name = "storage-test", .root = "src/Evm/Storage.zig", .step_name = "test-storage" },
    .{ .name = "state-storage-test", .root = "src/Evm/State/Storage.zig", .step_name = "test-state-storage" },
    .{ .name = "journal-test", .root = "src/Evm/Journal.zig", .step_name = "test-journal" },
    .{ .name = "state-journal-test", .root = "src/Evm/State/Journal.zig", .step_name = "test-state-journal" },
    
    // Memory and Stack tests
    .{ .name = "memory-test", .root = "test/Evm/memory_test.zig", .step_name = "test-memory" },
    .{ .name = "memory-expanded-test", .root = "test/Evm/memory_expanded_test.zig", .step_name = "test-memory-expanded" },
    .{ .name = "memory-fixed-test", .root = "test/Evm/memory_fixed_test.zig", .step_name = "test-memory-fixed" },
    .{ .name = "memory-expanded-fixed-test", .root = "test/Evm/memory_expanded_fixed_test.zig", .step_name = "test-memory-expanded-fixed" },
    .{ .name = "stack-test", .root = "src/Evm/Stack.zig", .step_name = "test-stack" },
    .{ .name = "stack-expanded-test", .root = "test/Evm/stack_expanded_test.zig", .step_name = "test-stack-expanded" },
    
    // Withdrawal tests
    .{ .name = "withdrawal-test", .root = "test/Evm/Withdrawal.test.zig", .step_name = "test-withdrawal" },
    .{ .name = "withdrawal-processor-test", .root = "test/Evm/WithdrawalProcessor.test.zig", .step_name = "test-withdrawal-processor" },
    .{ .name = "withdrawal-simple-test", .root = "test/Evm/withdrawal_test.zig", .step_name = "test-withdrawal-simple" },
    .{ .name = "withdrawal-debug-test", .root = "src/Evm/withdrawal_test_debug.zig", .step_name = "test-withdrawal-debug" },
    .{ .name = "withdrawals-simplified-test", .root = "test/Evm/withdrawals_simplified_test.zig", .step_name = "test-withdrawals-simplified" },
    
    // Integration and other tests
    .{ .name = "interpreter-init-test", .root = "test/Evm/interpreter_init_test.zig", .step_name = "test-interpreter-init" },
    .{ .name = "evm-init-test", .root = "test/Evm/evm_init_test.zig", .step_name = "test-evm-init" },
    .{ .name = "frame-simple-test", .root = "test/Evm/frame_test.zig", .step_name = "test-frame-simple" },
    .{ .name = "test-basic-ops", .root = "src/Evm/test_basic_ops_integration.zig", .step_name = "test-basic-ops" },
    .{ .name = "test-simple-bytecode", .root = "src/Evm/test_simple_bytecode.zig", .step_name = "test-simple-bytecode" },
    .{ .name = "frame-returndata-test", .root = "test/Evm/opcodes/frame_returndata_test.zig", .step_name = "test-frame-returndata" },
};

// EIP implementation tests
pub const eipTests = [_]TestInfo{
    .{ .name = "eip1559-test", .root = "test/Evm/eip1559.test.zig", .step_name = "test-eip1559" },
    .{ .name = "eip3541-test", .root = "test/Evm/eip3541_simplified_test.zig", .step_name = "test-eip3541" },
    .{ .name = "eip3541-direct-test", .root = "test/Evm/tests/eip3541.test.zig", .step_name = "test-eip3541-direct" },
    .{ .name = "eip3651-simplified-test", .root = "test/Evm/eip3651_simplified_test.zig", .step_name = "test-eip3651-simplified" },
    .{ .name = "eip3651-direct-test", .root = "test/Evm/eip3651_direct_test.zig", .step_name = "test-eip3651-direct" },
    .{ .name = "eip3651-test", .root = "test/Evm/tests/eip3651.test.zig", .step_name = "test-eip3651" },
    .{ .name = "eip3855-simplified-test", .root = "test/Evm/eip3855_simplified_test.zig", .step_name = "test-eip3855-simplified" },
    .{ .name = "eip3855-direct-test", .root = "test/Evm/eip3855_direct_test.zig", .step_name = "test-eip3855-direct" },
    .{ .name = "eip3855-test", .root = "test/Evm/tests/eip3855.test.zig", .step_name = "test-eip3855" },
    .{ .name = "eip5656-simplified-test", .root = "test/Evm/eip5656_simplified_test.zig", .step_name = "test-eip5656-simplified" },
    .{ .name = "eip5656-direct-test", .root = "test/Evm/eip5656_direct_test.zig", .step_name = "test-eip5656-direct" },
    .{ .name = "eip5656-test", .root = "test/Evm/tests/eip5656.test.zig", .step_name = "test-eip5656" },
    .{ .name = "eip2200-test", .root = "test/Evm/tests/eip2200.test.zig", .step_name = "test-eip2200" },
    .{ .name = "eip2929-test", .root = "test/Evm/tests/eip2929.test.zig", .step_name = "test-eip2929" },
    .{ .name = "eip3198-test", .root = "test/Evm/tests/eip3198.test.zig", .step_name = "test-eip3198" },
    .{ .name = "eip3860-test", .root = "test/Evm/tests/eip3860.test.zig", .step_name = "test-eip3860" },
};

// Opcode tests - now using a single test runner to avoid relative import issues
pub const opcodeTests = [_]TestInfo{
    .{ .name = "opcodes-all-test", .root = "test/Evm/opcodes/all_tests.zig", .step_name = "test-opcodes-all" },
    // Keep individual expanded tests that are at the Evm level
    .{ .name = "opcode-calls-expanded-test", .root = "test/Evm/opcodes/calls_expanded_test.zig", .step_name = "test-opcode-calls-expanded" },
    .{ .name = "opcode-transient-expanded-test", .root = "test/Evm/opcodes/transient_expanded_test.zig", .step_name = "test-opcode-transient-expanded" },
    .{ .name = "opcode-mcopy-expanded-test", .root = "test/Evm/opcodes/mcopy_expanded_test.zig", .step_name = "test-opcode-mcopy-expanded" },
    .{ .name = "opcodes-expanded-test", .root = "test/Evm/opcodes_expanded_test.zig", .step_name = "test-opcodes-expanded" },
    .{ .name = "opcodes-expanded-simplified-test", .root = "test/Evm/opcodes_expanded_simplified_test.zig", .step_name = "test-opcodes-expanded-simplified" },
};

// Precompile tests
pub const precompileTests = [_]TestInfo{
    .{ .name = "precompile-test", .root = "test/Evm/precompile/precompile_test.zig", .step_name = "test-precompile" },
    .{ .name = "precompile-bls-test", .root = "test/Evm/precompile/bls12_381_test.zig", .step_name = "test-precompile-bls" },
    .{ .name = "precompiled-test", .root = "test/Evm/precompiles/Precompiled.test.zig", .step_name = "test-precompiled" },
};

// Test environment tests
pub const testEnvTests = [_]TestInfo{
    .{ .name = "env-test", .root = "test/Evm/tests/environment_test.zig", .step_name = "test-env" },
    .{ .name = "env-test2", .root = "test/Evm/tests/environment_test2.zig", .step_name = "test-env2" },
    .{ .name = "env-test3", .root = "test/Evm/tests/environment_test3.zig", .step_name = "test-env3" },
    .{ .name = "memory-tests", .root = "test/Evm/tests/memory_tests.zig", .step_name = "test-memory-tests" },
    .{ .name = "withdrawal-tests", .root = "test/Evm/tests/withdrawal_test.zig", .step_name = "test-withdrawal-tests" },
};