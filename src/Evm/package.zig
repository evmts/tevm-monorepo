const std = @import("std");

// Import components directly
pub const Frame = @import("Frame.zig").Frame;
pub const Contract = @import("Contract.zig").Contract;
pub const createContract = @import("Contract.zig").createContract;
pub const Interpreter = @import("interpreter.zig").Interpreter;
pub const InterpreterError = @import("interpreter.zig").InterpreterError;
// Import JumpTable from jumpTable module to avoid circular imports
pub const jumpTable = @import("jumpTable/package.zig");
pub const JumpTable = jumpTable.JumpTable;
pub const Memory = @import("Memory.zig").Memory;
pub const MemoryError = @import("Memory.zig").MemoryError;
pub const Stack = @import("Stack.zig").Stack;
pub const StackError = @import("Stack.zig").StackError;
pub const types = @import("types.zig");
pub const ExecutionError = InterpreterError;

// Import logger utilities - use the TestEvmLogger for regular operations
pub const EvmLogger = @import("TestEvmLogger.zig").EvmLogger;
pub const createLogger = @import("TestEvmLogger.zig").createLogger;
pub const createScopedLogger = @import("TestEvmLogger.zig").createScopedLogger;
pub const debugOnly = @import("TestEvmLogger.zig").debugOnly;
pub const logHexBytes = @import("TestEvmLogger.zig").logHexBytes;
pub const ENABLE_DEBUG_LOGS = @import("TestEvmLogger.zig").ENABLE_DEBUG_LOGS;

// Add full logger utilities
pub const logger = struct {
    pub usingnamespace @import("EvmLogger.zig");
};

// Import state management
pub const Account = @import("Account.zig").Account;
pub const Storage = @import("Storage.zig").Storage;
pub const Journal = @import("Journal.zig").Journal;
pub const JournalEntry = @import("Journal.zig").JournalEntry;
pub const StateDB = @import("StateDB.zig").StateDB;
pub const B256 = @import("StateDB.zig").B256;

// Import withdrawals
pub const WithdrawalData = @import("Withdrawal.zig").WithdrawalData;
pub const processWithdrawals = @import("Withdrawal.zig").processWithdrawals;
pub const WithdrawalProcessor = @import("WithdrawalProcessor.zig").BlockWithdrawalProcessor;
pub const WithdrawalBlock = @import("WithdrawalProcessor.zig").Block;
pub const Withdrawal = @import("Withdrawal.zig").WithdrawalData;

// Import opcodes
pub const opcodes = @import("opcodes.zig");
pub const opcodes_pkg = @import("opcodes/package.zig");

// Import the core Evm and rules
pub const Evm = @import("evm.zig").Evm;
pub const ChainRules = @import("evm.zig").ChainRules;
pub const Hardfork = @import("evm.zig").Hardfork;

// Import EIP-7702
pub const eip7702 = @import("eip7702.zig");

// Export precompiles
pub const precompile = struct {
    pub usingnamespace @import("precompile/Precompiles.zig");
    pub const bls = @import("precompile/bls12_381.zig");
    pub const common_utils = @import("precompile/common.zig");
    pub const crypto_utils = @import("precompile/crypto.zig");
    pub const kzg_functions = @import("precompile/kzg.zig");
    pub const math_utils = @import("precompile/math.zig");
    pub const config_params = @import("precompile/params.zig");
};

// Make components accessible from the package
pub const interpreter = @import("interpreter.zig");
// Import modules directly for internal use - this is a duplicate of jumpTableMod above
pub const memory = @import("Memory.zig");
pub const stack = @import("Stack.zig");
pub const frame = @import("Frame.zig");
pub const testEvmLogger = @import("TestEvmLogger.zig");
pub const withdrawal = @import("Withdrawal.zig");
pub const withdrawalProcessor = @import("WithdrawalProcessor.zig");
pub const state = @import("state.zig");

// Import consolidated opcodes
pub const opcodes_all = @import("opcodes_all.zig");

// External dependencies
pub const utils = @import("utils");
pub const address = @import("address");
pub const state_manager = @import("state_manager");
pub const test_utils = @import("test_utils");