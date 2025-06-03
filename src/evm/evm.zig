const std = @import("std");

// Import external modules
pub const Address = @import("Address");

// Import all EVM modules
pub const CodeAnalysis = @import("code_analysis.zig");
pub const Contract = @import("contract.zig");
pub const ExecutionError = @import("execution_error.zig");
pub const Frame = @import("frame.zig");
pub const Hardfork = @import("hardfork.zig");
pub const JumpTable = @import("jump_table.zig");
pub const Memory = @import("memory.zig");
pub const Opcode = @import("opcode.zig");
pub const Operation = @import("operation.zig");
pub const Stack = @import("stack.zig");
pub const StoragePool = @import("storage_pool.zig");
pub const Vm = @import("vm.zig");

// Import opcodes
pub const opcodes = @import("opcodes/package.zig");

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
