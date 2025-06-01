const std = @import("std");

// Import all EVM modules
pub const CodeAnalysis = @import("code_analysis.zig");
pub const Contract = @import("Contract.zig");
pub const ExecutionError = @import("execution_error.zig");
pub const EvmLogger = @import("evm_logger.zig");
pub const Frame = @import("Frame.zig");
pub const Hardfork = @import("hardfork.zig");
pub const JumpTable = @import("jump_table.zig");
pub const Memory = @import("memory.zig");
pub const Opcode = @import("Opcode.zig");
pub const Operation = @import("Operation.zig");
pub const Stack = @import("Stack.zig");
pub const StoragePool = @import("storage_pool.zig");
pub const Vm = @import("Vm.zig");

// Import utility modules
pub const bitvec = @import("bitvec.zig");
pub const chain_rules = @import("chain_rules.zig");
pub const constants = @import("constants.zig");
pub const eip_7702_bytecode = @import("eip_7702_bytecode.zig");
pub const fee_market = @import("fee_market.zig");
pub const gas_constants = @import("gas_constants.zig");

// Tests - run all module tests
test {
    std.testing.refAllDeclsRecursive(@This());
}
