const std = @import("std");
const TestInfo = @import("tests.zig").TestInfo;

// EVM core tests
pub const evmCoreTests = [_]TestInfo{
    // State management tests
    .{ .name = "statedb-test", .root = "src/Evm/StateDB.zig", .step_name = "test-statedb" },
    .{ .name = "state-statedb-test", .root = "src/Evm/State/StateDB.zig", .step_name = "test-state-statedb" },
    .{ .name = "state-statedb-advanced-test", .root = "src/Evm/State/StateDB.test.zig", .step_name = "test-state-statedb-advanced" },
    .{ .name = "account-test", .root = "src/Evm/Account.zig", .step_name = "test-account" },
    .{ .name = "state-account-test", .root = "src/Evm/State/Account.zig", .step_name = "test-state-account" },
    .{ .name = "storage-test", .root = "src/Evm/Storage.zig", .step_name = "test-storage" },
    .{ .name = "state-storage-test", .root = "src/Evm/State/Storage.zig", .step_name = "test-state-storage" },
    .{ .name = "journal-test", .root = "src/Evm/Journal.zig", .step_name = "test-journal" },
    .{ .name = "state-journal-test", .root = "src/Evm/State/Journal.zig", .step_name = "test-state-journal" },
    
    // Memory and Stack tests
    .{ .name = "memory-test", .root = "src/Evm/memory_test.zig", .step_name = "test-memory" },
    .{ .name = "memory-expanded-test", .root = "src/Evm/memory_expanded_test.zig", .step_name = "test-memory-expanded" },
    .{ .name = "memory-fixed-test", .root = "src/Evm/memory_fixed_test.zig", .step_name = "test-memory-fixed" },
    .{ .name = "memory-expanded-fixed-test", .root = "src/Evm/memory_expanded_fixed_test.zig", .step_name = "test-memory-expanded-fixed" },
    .{ .name = "stack-test", .root = "src/Evm/Stack.zig", .step_name = "test-stack" },
    .{ .name = "stack-expanded-test", .root = "src/Evm/stack_expanded_test.zig", .step_name = "test-stack-expanded" },
    
    // Withdrawal tests
    .{ .name = "withdrawal-test", .root = "src/Evm/Withdrawal.test.zig", .step_name = "test-withdrawal" },
    .{ .name = "withdrawal-processor-test", .root = "src/Evm/WithdrawalProcessor.test.zig", .step_name = "test-withdrawal-processor" },
    .{ .name = "withdrawal-simple-test", .root = "src/Evm/withdrawal_test.zig", .step_name = "test-withdrawal-simple" },
    .{ .name = "withdrawal-debug-test", .root = "src/Evm/withdrawal_test_debug.zig", .step_name = "test-withdrawal-debug" },
    .{ .name = "withdrawals-simplified-test", .root = "src/Evm/withdrawals_simplified_test.zig", .step_name = "test-withdrawals-simplified" },
    
    // Integration and other tests
    .{ .name = "interpreter-init-test", .root = "src/Evm/interpreter_init_test.zig", .step_name = "test-interpreter-init" },
    .{ .name = "evm-init-test", .root = "src/Evm/evm_init_test.zig", .step_name = "test-evm-init" },
    .{ .name = "frame-simple-test", .root = "src/Evm/frame_test.zig", .step_name = "test-frame-simple" },
    .{ .name = "test-basic-ops", .root = "src/Evm/test_basic_ops_integration.zig", .step_name = "test-basic-ops" },
    .{ .name = "test-simple-bytecode", .root = "src/Evm/test_simple_bytecode.zig", .step_name = "test-simple-bytecode" },
    .{ .name = "frame-returndata-test", .root = "src/Evm/opcodes/frame_returndata_test.zig", .step_name = "test-frame-returndata" },
};

// EIP implementation tests
pub const eipTests = [_]TestInfo{
    .{ .name = "eip1559-test", .root = "src/Evm/eip1559.test.zig", .step_name = "test-eip1559" },
    .{ .name = "eip3541-test", .root = "src/Evm/eip3541_simplified_test.zig", .step_name = "test-eip3541" },
    .{ .name = "eip3541-direct-test", .root = "src/Evm/tests/eip3541.test.zig", .step_name = "test-eip3541-direct" },
    .{ .name = "eip3651-simplified-test", .root = "src/Evm/eip3651_simplified_test.zig", .step_name = "test-eip3651-simplified" },
    .{ .name = "eip3651-direct-test", .root = "src/Evm/eip3651_direct_test.zig", .step_name = "test-eip3651-direct" },
    .{ .name = "eip3651-test", .root = "src/Evm/tests/eip3651.test.zig", .step_name = "test-eip3651" },
    .{ .name = "eip3855-simplified-test", .root = "src/Evm/eip3855_simplified_test.zig", .step_name = "test-eip3855-simplified" },
    .{ .name = "eip3855-direct-test", .root = "src/Evm/eip3855_direct_test.zig", .step_name = "test-eip3855-direct" },
    .{ .name = "eip3855-test", .root = "src/Evm/tests/eip3855.test.zig", .step_name = "test-eip3855" },
    .{ .name = "eip5656-simplified-test", .root = "src/Evm/eip5656_simplified_test.zig", .step_name = "test-eip5656-simplified" },
    .{ .name = "eip5656-direct-test", .root = "src/Evm/eip5656_direct_test.zig", .step_name = "test-eip5656-direct" },
    .{ .name = "eip5656-test", .root = "src/Evm/tests/eip5656.test.zig", .step_name = "test-eip5656" },
    .{ .name = "eip2200-test", .root = "src/Evm/tests/eip2200.test.zig", .step_name = "test-eip2200" },
    .{ .name = "eip2929-test", .root = "src/Evm/tests/eip2929.test.zig", .step_name = "test-eip2929" },
    .{ .name = "eip3198-test", .root = "src/Evm/tests/eip3198.test.zig", .step_name = "test-eip3198" },
    .{ .name = "eip3860-test", .root = "src/Evm/tests/eip3860.test.zig", .step_name = "test-eip3860" },
};

// Opcode tests (now integrated into main source files)
pub const opcodeTests = [_]TestInfo{
    .{ .name = "opcode-math-test", .root = "src/Evm/opcodes/math.zig", .step_name = "test-opcode-math" },
    .{ .name = "opcode-math2-test", .root = "src/Evm/opcodes/math2.zig", .step_name = "test-opcode-math2" },
    .{ .name = "opcode-bitwise-test", .root = "src/Evm/opcodes/bitwise.zig", .step_name = "test-opcode-bitwise" },
    .{ .name = "opcode-comparison-test", .root = "src/Evm/opcodes/comparison.zig", .step_name = "test-opcode-comparison" },
    .{ .name = "opcode-memory-test", .root = "src/Evm/opcodes/memory.zig", .step_name = "test-opcode-memory" },
    .{ .name = "opcode-storage-test", .root = "src/Evm/opcodes/storage.test.zig", .step_name = "test-opcode-storage" },
    .{ .name = "opcode-controlflow-test", .root = "src/Evm/opcodes/controlflow.zig", .step_name = "test-opcode-controlflow" },
    .{ .name = "opcode-fixed-controlflow-test", .root = "src/Evm/opcodes/fixed_controlflow.test.zig", .step_name = "test-opcode-fixed-controlflow" },
    .{ .name = "opcode-environment-test", .root = "src/Evm/opcodes/environment.test.zig", .step_name = "test-opcode-environment" },
    .{ .name = "opcode-block-test", .root = "src/Evm/opcodes/block.zig", .step_name = "test-opcode-block" },
    .{ .name = "opcode-crypto-test", .root = "src/Evm/opcodes/crypto.zig", .step_name = "test-opcode-crypto" },
    .{ .name = "opcode-log-test", .root = "src/Evm/opcodes/log.zig", .step_name = "test-opcode-log" },
    .{ .name = "opcode-calls-test", .root = "src/Evm/opcodes/calls.test.zig", .step_name = "test-opcode-calls" },
    .{ .name = "opcode-calls-expanded-test", .root = "src/Evm/opcodes/calls_expanded_test.zig", .step_name = "test-opcode-calls-expanded" },
    .{ .name = "opcode-blob-test", .root = "src/Evm/opcodes/blob.zig", .step_name = "test-opcode-blob" },
    .{ .name = "opcode-transient-test", .root = "src/Evm/opcodes/transient.test.zig", .step_name = "test-opcode-transient" },
    .{ .name = "opcode-transient-expanded-test", .root = "src/Evm/opcodes/transient_expanded_test.zig", .step_name = "test-opcode-transient-expanded" },
    .{ .name = "opcode-eip1153-test", .root = "src/Evm/opcodes/eip1153.test.zig", .step_name = "test-opcode-eip1153" },
    .{ .name = "opcode-eip4844-test", .root = "src/Evm/opcodes/eip4844.test.zig", .step_name = "test-opcode-eip4844" },
    .{ .name = "opcode-mcopy-expanded-test", .root = "src/Evm/opcodes/mcopy_expanded_test.zig", .step_name = "test-opcode-mcopy-expanded" },
    .{ .name = "opcodes-expanded-test", .root = "src/Evm/opcodes_expanded_test.zig", .step_name = "test-opcodes-expanded" },
    .{ .name = "opcodes-expanded-simplified-test", .root = "src/Evm/opcodes_expanded_simplified_test.zig", .step_name = "test-opcodes-expanded-simplified" },
};

// Precompile tests
pub const precompileTests = [_]TestInfo{
    .{ .name = "precompile-test", .root = "src/Evm/precompile/precompile_test.zig", .step_name = "test-precompile" },
    .{ .name = "precompile-bls-test", .root = "src/Evm/precompile/bls12_381_test.zig", .step_name = "test-precompile-bls" },
    .{ .name = "precompiled-test", .root = "src/Evm/precompiles/Precompiled.test.zig", .step_name = "test-precompiled" },
};

// Test environment tests
pub const testEnvTests = [_]TestInfo{
    .{ .name = "env-test", .root = "src/Evm/tests/environment_test.zig", .step_name = "test-env" },
    .{ .name = "env-test2", .root = "src/Evm/tests/environment_test2.zig", .step_name = "test-env2" },
    .{ .name = "env-test3", .root = "src/Evm/tests/environment_test3.zig", .step_name = "test-env3" },
    .{ .name = "memory-tests", .root = "src/Evm/tests/memory_tests.zig", .step_name = "test-memory-tests" },
    .{ .name = "withdrawal-tests", .root = "src/Evm/tests/withdrawal_test.zig", .step_name = "test-withdrawal-tests" },
};