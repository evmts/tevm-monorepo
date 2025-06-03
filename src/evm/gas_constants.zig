// Gas cost constants for basic operations
// These define the static gas costs for various opcode categories
// Very cheap operations (like PC, CALLDATASIZE)
pub const GasQuickStep: u64 = 2;
// Fast operations (like ADD, SUB, NOT)
pub const GasFastestStep: u64 = 3;
// Faster operations (like MUL, DIV)
pub const GasFastStep: u64 = 5;
// Mid-range operations (like ADDMOD, MULMOD)
pub const GasMidStep: u64 = 8;
// Slow operations
pub const GasSlowStep: u64 = 10;
// Extended/expensive operations (like BALANCE)
pub const GasExtStep: u64 = 20;

// Gas cost constants for specific operations
// Base gas for KECCAK256
pub const Keccak256Gas: u64 = 30;
// Gas per word for KECCAK256
pub const Keccak256WordGas: u64 = 6;
// Base gas for SLOAD (warm access)
pub const SloadGas: u64 = 100;
// Gas for first-time (cold) SLOAD access (EIP-2929)
pub const ColdSloadCost: u64 = 2100;
// Gas for first-time (cold) account access (EIP-2929)
pub const ColdAccountAccessCost: u64 = 2600;
// Gas for warm storage access (EIP-2929)
pub const WarmStorageReadCost: u64 = 100;

// Gas sent with a call
pub const SstoreSentryGas: u64 = 2300;
// Gas for SSTORE when setting from zero
pub const SstoreSetGas: u64 = 20000;
// Gas for SSTORE when changing existing value
pub const SstoreResetGas: u64 = 5000;
// Gas for SSTORE when clearing to zero
pub const SstoreClearGas: u64 = 5000;
// Gas refund for clearing storage (EIP-3529 reduced from 15000)
pub const SstoreRefundGas: u64 = 4800;
// Gas for JUMPDEST
pub const JumpdestGas: u64 = 1;
// Base gas for LOG
pub const LogGas: u64 = 375;
// Gas per byte of LOG data
pub const LogDataGas: u64 = 8;
// Gas per LOG topic
pub const LogTopicGas: u64 = 375;
// Gas for CREATE
pub const CreateGas: u64 = 32000;
// Base gas for CALL
pub const CallGas: u64 = 40;
// Stipend for CALL when transferring value
pub const CallStipend: u64 = 2300;
// Extra gas for transferring value in CALL
pub const CallValueTransferGas: u64 = 9000;
// Extra gas for creating a new account in CALL
pub const CallNewAccountGas: u64 = 25000;
// Gas refund for SELFDESTRUCT
pub const SelfdestructRefundGas: u64 = 24000;
// Linear coefficient for memory gas
pub const MemoryGas: u64 = 3;
// Quadratic coefficient divisor for memory gas
pub const QuadCoeffDiv: u64 = 512;
// Gas per byte of CREATE data
pub const CreateDataGas: u64 = 200;
// EIP-3860: Limit and meter initcode
// Gas per 32-byte word of initcode (EIP-3860)
pub const InitcodeWordGas: u64 = 2;
// Maximum initcode size (2 * 24576 bytes) (EIP-3860)
pub const MaxInitcodeSize: u64 = 49152;
// Base gas for a transaction
pub const TxGas: u64 = 21000;
// Base gas for contract creation
pub const TxGasContractCreation: u64 = 53000;
// Gas per zero byte of tx data
pub const TxDataZeroGas: u64 = 4;
// Gas per non-zero byte of tx data
pub const TxDataNonZeroGas: u64 = 16;
pub const CopyGas: u64 = 3;
// Maximum refund quotient (EIP-3529 - gas_used/5 maximum)
pub const MaxRefundQuotient: u64 = 5;

// EIP-4844: Shard Blob Transactions
pub const BlobHashGas: u64 = 3;
pub const BlobBaseFeeGas: u64 = 2;

// EIP-1153: Transient Storage
pub const TLoadGas: u64 = 100;
// Gas for memory copy operations
pub const TStoreGas: u64 = 100;

// Calculate memory expansion gas cost
pub fn memory_gas_cost(current_size: u64, new_size: u64) u64 {
    if (new_size <= current_size) return 0;
    
    const current_words = (current_size + 31) / 32;
    const new_words = (new_size + 31) / 32;
    
    const current_cost = MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;
    const new_cost = MemoryGas * new_words + (new_words * new_words) / QuadCoeffDiv;
    
    return new_cost - current_cost;
}
