const std = @import("std");

// Export Evm-related components for easier access
pub const EVM = @import("evm.zig").Evm;
pub const ExecutionStatus = @import("evm.zig").ExecutionStatus;
pub const Log = @import("evm.zig").Log;
pub const ChainRules = @import("evm.zig").ChainRules;
pub const Hardfork = @import("evm.zig").Hardfork;

pub const Frame = @import("Frame.zig").Frame;
pub const ExecutionError = @import("Frame.zig").ExecutionError;
pub const Interpreter = @import("interpreter.zig").Interpreter;
pub const Stack = @import("Stack.zig").Stack;
pub const Memory = @import("Memory.zig").Memory;
pub const Contract = @import("Contract.zig").Contract;
pub const EvmLogger = @import("EvmLogger.zig").EvmLogger;
pub const JumpTable = @import("JumpTable.zig");
pub const bitvec = @import("bitvec.zig");
pub const FeeMarket = @import("FeeMarket.zig");
pub const FeeMarketTransaction = @import("FeeMarketTransaction.zig");
pub const WithdrawalProcessor = @import("WithdrawalProcessor.zig");
pub const Withdrawal = @import("Withdrawal.zig");
pub const InterpreterState = @import("InterpreterState.zig");

// Export opcodes modules
pub const opcodes = struct {
    pub const blob = @import("opcodes/blob.zig");
    pub const bitwise = @import("opcodes/bitwise.zig");
    pub const block = @import("opcodes/block.zig");
    pub const calls = @import("opcodes/calls.zig");
    pub const comparison = @import("opcodes/comparison.zig");
    pub const controlflow = @import("opcodes/controlflow.zig");
    pub const crypto = @import("opcodes/crypto.zig");
    pub const environment = @import("opcodes/environment.zig");
    pub const log = @import("opcodes/log.zig");
    pub const math = @import("opcodes/math.zig");
    pub const math2 = @import("opcodes/math2.zig");
    pub const memory = @import("opcodes/memory.zig");
    pub const storage = @import("opcodes/storage.zig");
    pub const transient = @import("opcodes/transient.zig");
};

// Export precompiles
pub const precompiles = @import("precompiles.zig");