const memory_mod = @import("Memory.zig");
pub const Memory = memory_mod.Memory;
pub const MemoryError = memory_mod.MemoryError;
pub const calculateNumWords = memory_mod.calculateNumWords;

const stack_mod = @import("Stack.zig");
pub const Stack = stack_mod.Stack;
pub const StackError = stack_mod.StackError;
pub const STACK_LIMIT = stack_mod.STACK_LIMIT;
pub const makeSwapN = stack_mod.makeSwapN;

const constants_mod = @import("constants.zig");
pub const constants = constants_mod;

pub const EvmError = constants_mod.EvmError;
pub const MemorySize = constants_mod.MemorySize;
pub const GasResult = constants_mod.GasResult;

const bitvec_mod = @import("bitvec.zig");
pub const BitVec = bitvec_mod.BitVec;
pub const BitVecError = bitvec_mod.BitVecError;
pub const analyzeCode = bitvec_mod.analyzeCode;
pub const analyzeJumpdests = bitvec_mod.analyzeJumpdests;
pub const analyzeBytecode = bitvec_mod.analyzeBytecode;
pub const CodeAnalysis = bitvec_mod.CodeAnalysis;
pub const PaddedAnalysis = bitvec_mod.PaddedAnalysis;
pub const analyzeWithPadding = bitvec_mod.analyzeWithPadding;

const contract_mod = @import("Contract.zig");
pub const Contract = contract_mod.Contract;
pub const StoragePool = contract_mod.StoragePool;
pub const clearAnalysisCache = contract_mod.clearAnalysisCache;

const frame_mod = @import("Frame.zig");
pub const Frame = frame_mod.Frame;
pub const FrameError = frame_mod.FrameError;
pub const HaltReason = frame_mod.HaltReason;
pub const FrameGas = frame_mod.Gas;

const journal_mod = @import("Journal.zig");
pub const Journal = journal_mod.Journal;
pub const JournalError = journal_mod.JournalError;
pub const Change = journal_mod.Change;
pub const ChangeType = journal_mod.ChangeType;
pub const Checkpoint = journal_mod.Checkpoint;
pub const LogEntry = journal_mod.LogEntry;
pub const Address = journal_mod.Address;
pub const B256 = journal_mod.B256;

const gas_mod = @import("Gas.zig");
pub const Gas = gas_mod.Gas;
pub const GasError = gas_mod.GasError;
pub const GasCosts = gas_mod.GasCosts;
pub const getStaticGasCost = gas_mod.getStaticGasCost;
pub const OPCODE_GAS_COSTS = gas_mod.OPCODE_GAS_COSTS;

const statedb_mod = @import("StateDB.zig");
pub const StateDB = statedb_mod.StateDB;
pub const StateDBError = statedb_mod.StateDBError;
pub const Account = statedb_mod.Account;

const Evm = struct { depth: u16 };
