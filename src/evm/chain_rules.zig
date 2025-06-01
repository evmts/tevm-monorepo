const std = @import("std");
const Hardfork = @import("Hardfork.zig").Hardfork;

// Chain rules for different Ethereum hardforks
///
// This struct configures which Ethereum protocol rules and EIPs are active
// during EVM execution. The default is set to the latest Ethereum version (Cancun),
// but can be configured for any supported hardfork.
///
// Each field represents a specific hardfork or EIP activation status.
const Self = @This();

/// Is Homestead rules enabled (March 2016)
/// Changed gas calculation for certain operations and introduced DELEGATECALL
IsHomestead: bool = true,

/// Is EIP150 rules enabled (October 2016, "Tangerine Whistle")
/// Gas cost increases for IO-heavy operations to prevent DoS attacks
IsEIP150: bool = true,

/// Is EIP158 rules enabled (October 2016, "Spurious Dragon")
/// Changes to account clearing and empty account handling
IsEIP158: bool = true,

/// Is Byzantium rules enabled (October 2017)
/// Introduced REVERT, RETURNDATASIZE, RETURNDATACOPY, STATICCALL
/// Added support for zkSNARKs
IsEIP1559: bool = true,

/// Is Constantinople rules enabled (February 2019)
/// Added bitwise shifting instructions and EXTCODEHASH
/// Reduced costs for SSTORE operations
IsConstantinople: bool = true,

/// Is Petersburg rules enabled (February 2019)
/// Same as Constantinople but removed the SSTORE net gas metering
IsPetersburg: bool = true,

/// Is Istanbul rules enabled (December 2019)
/// Changed gas costs for SLOAD, BALANCE, EXTCODEHASH, CALL
/// Added CHAINID and SELFBALANCE instructions
IsIstanbul: bool = true,

/// Is Berlin rules enabled (April 2021)
/// Added EIP-2565, EIP-2718, EIP-2929, EIP-2930
/// Changed gas calculation for state access operations
IsBerlin: bool = true,

/// Is London rules enabled (August 2021)
/// Added EIP-1559 (fee market change)
/// Added BASEFEE instruction
IsLondon: bool = true,

/// Is Merge rules enabled (September 2022)
/// Transitioned from Proof of Work to Proof of Stake
/// Changed DIFFICULTY opcode to PREVRANDAO
IsMerge: bool = true,

/// Is Shanghai rules enabled (April 2023)
/// Added support for validator withdrawals
/// Introduced the PUSH0 instruction
IsShanghai: bool = true,

/// Is Cancun rules enabled (March 2024)
/// Added EIP-4844 (proto-danksharding)
/// Changed various gas costs and added new opcodes
IsCancun: bool = true,

/// Is Prague rules enabled (future upgrade)
/// Not yet specified
IsPrague: bool = false,

/// Is Verkle rules enabled (future upgrade)
/// Will transition state to Verkle trees
IsVerkle: bool = false,

/// Is EIP1559 rules enabled (London)
/// Fee market change with burn and variable block size
IsByzantium: bool = true,

/// Is EIP2930 rules enabled (Berlin)
/// Optional access lists for transactions
IsEIP2930: bool = true,

/// Is EIP3198 rules enabled (London)
/// BASEFEE opcode to access block's base fee
IsEIP3198: bool = true,

/// Is EIP3651 rules enabled (Shanghai, warm COINBASE)
/// Makes the COINBASE address warm for EIP-2929 gas calculations
IsEIP3651: bool = true,

/// Is EIP3855 rules enabled (Shanghai, PUSH0 instruction)
/// Adds PUSH0 instruction that pushes 0 onto the stack
IsEIP3855: bool = true,

/// Is EIP3860 rules enabled (Shanghai, limit and meter initcode)
/// Limits maximum initcode size and adds gas metering
IsEIP3860: bool = true,

/// Is EIP4895 rules enabled (Shanghai, beacon chain withdrawals)
/// Allows withdrawals from the beacon chain to the EVM
IsEIP4895: bool = true,

/// Is EIP4844 rules enabled (Cancun, shard blob transactions)
/// Adds a new transaction type for data blobs (proto-danksharding)
IsEIP4844: bool = true,

/// Is EIP1153 rules enabled (Cancun, transient storage)
/// Adds TLOAD and TSTORE instructions for transient storage
IsEIP1153: bool = true,

/// Is EIP5656 rules enabled (Cancun, MCOPY instruction)
/// Adds MCOPY instruction for efficient memory copying
IsEIP5656: bool = true,

/// Is EIP3541 rules enabled (London, reject new contracts that start with 0xEF)
/// Rejects new contract code starting with the 0xEF byte to reserve this prefix for future protocol upgrades
IsEIP3541: bool = true,

/// Create chain rules for a specific hardfork
///
/// This is a factory method that creates a ChainRules configuration
/// properly configured for the specified Ethereum hardfork.
///
/// Parameters:
/// - hardfork: The Ethereum hardfork to create rules for
///
/// Returns: A ChainRules instance configured for the specified hardfork
pub fn forHardfork(hardfork: Hardfork) Self {
    std.log.debug("Creating chain rules for hardfork: {s}", .{@tagName(hardfork)});
    var rules = Self{};
    switch (hardfork) {
        .Frontier => {
            rules.IsHomestead = false;
            rules.IsEIP150 = false;
            rules.IsEIP158 = false;
            rules.IsByzantium = false;
            rules.IsConstantinople = false;
            rules.IsPetersburg = false;
            rules.IsIstanbul = false;
            rules.IsBerlin = false;
            rules.IsLondon = false;
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP1559 = false;
            rules.IsEIP2930 = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
        },
        .Homestead => {
            rules.IsEIP150 = false;
            rules.IsEIP158 = false;
            rules.IsByzantium = false;
            rules.IsConstantinople = false;
            rules.IsPetersburg = false;
            rules.IsIstanbul = false;
            rules.IsBerlin = false;
            rules.IsLondon = false;
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP1559 = false;
            rules.IsEIP2930 = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
        },
        .TangerineWhistle => {
            rules.IsEIP158 = false;
            rules.IsByzantium = false;
            rules.IsConstantinople = false;
            rules.IsPetersburg = false;
            rules.IsIstanbul = false;
            rules.IsBerlin = false;
            rules.IsLondon = false;
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP1559 = false;
            rules.IsEIP2930 = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
        },
        .SpuriousDragon => {
            rules.IsByzantium = false;
            rules.IsConstantinople = false;
            rules.IsPetersburg = false;
            rules.IsIstanbul = false;
            rules.IsBerlin = false;
            rules.IsLondon = false;
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP1559 = false;
            rules.IsEIP2930 = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
        },
        .Byzantium => {
            rules.IsConstantinople = false;
            rules.IsPetersburg = false;
            rules.IsIstanbul = false;
            rules.IsBerlin = false;
            rules.IsLondon = false;
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP1559 = false;
            rules.IsEIP2930 = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
        },
        .Constantinople => {
            rules.IsPetersburg = false;
            rules.IsIstanbul = false;
            rules.IsBerlin = false;
            rules.IsLondon = false;
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP1559 = false;
            rules.IsEIP2930 = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
        },
        .Petersburg => {
            rules.IsIstanbul = false;
            rules.IsBerlin = false;
            rules.IsLondon = false;
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP1559 = false;
            rules.IsEIP2930 = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
        },
        .Istanbul => {
            rules.IsBerlin = false;
            rules.IsLondon = false;
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP1559 = false;
            rules.IsEIP2930 = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
        },
        .Berlin => {
            rules.IsLondon = false;
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP1559 = false;
            rules.IsEIP3541 = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
        },
        .London => {
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
            rules.IsEIP5656 = false;
        },
        .ArrowGlacier => {
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
            rules.IsEIP5656 = false;
        },
        .GrayGlacier => {
            rules.IsMerge = false;
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
            rules.IsEIP5656 = false;
        },
        .Merge => {
            rules.IsShanghai = false;
            rules.IsCancun = false;
            rules.IsEIP3651 = false;
            rules.IsEIP3855 = false;
            rules.IsEIP3860 = false;
            rules.IsEIP4895 = false;
            rules.IsEIP4844 = false;
            rules.IsEIP5656 = false;
        },
        .Shanghai => {
            rules.IsCancun = false;
            rules.IsEIP4844 = false;
            rules.IsEIP5656 = false;
        },
        .Cancun => {},
        .Prague => {
            rules.IsPrague = true;
        },
        .Verkle => {
            rules.IsPrague = true;
            rules.IsVerkle = true;
        },
    }
    std.log.debug("Chain rules created for hardfork: {s}", .{@tagName(hardfork)});
    return rules;
}
