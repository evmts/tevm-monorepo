const std = @import("std");
const Frame = @import("Frame.zig").Frame;
const StateManager = @import("../StateManager/StateManager.zig").StateManager;
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;

// Create a file-specific logger
const logger = createLogger(@src().file);

/// EVM represents the Ethereum Virtual Machine
/// 
/// The EVM is the runtime environment for smart contracts in Ethereum.
/// It's responsible for executing contract code in a sandboxed environment
/// according to specific chain rules and protocol versions.
///
/// This implementation provides:
/// - A configurable execution environment for EVM bytecode
/// - Support for different Ethereum protocol versions (hardforks)
/// - Access to state through a StateManager
/// - Context awareness (static calls, depth tracking)
pub const Evm = struct {
    /// Current call depth (max 1024)
    /// The Ethereum protocol limits call depth to prevent stack overflows
    /// and infinite recursion between contracts
    depth: u16 = 0,
    
    /// Whether the current execution is in the context of a static call
    /// In static calls, state modifications are not allowed (view-only)
    /// This is used for STATICCALL operations and certain precompiles
    readOnly: bool = false,
    
    /// Chain rules configuration (e.g., which hardfork rules to apply)
    /// This determines which EIPs and protocol rules are active for execution
    chainRules: ChainRules = ChainRules{},
    
    /// State manager for accessing account and storage state
    /// This provides access to the world state (accounts, balances, storage, code)
    state_manager: ?*StateManager = null,
    
    /// Create a new EVM instance
    ///
    /// This initializes a fresh EVM with default settings:
    /// - Zero call depth
    /// - Not read-only
    /// - Latest chain rules (Cancun by default)
    /// - No state manager attached
    ///
    /// Returns: A new Evm instance
    pub fn init() Evm {
        logger.debug("Creating new EVM instance", .{});
        return Evm{};
    }
    
    /// Set chain rules for the EVM
    ///
    /// This configures which protocol version and EIPs are active for execution.
    /// It's typically used to set the EVM to a specific Ethereum hardfork.
    ///
    /// Parameters:
    /// - rules: The ChainRules to apply
    pub fn setChainRules(self: *Evm, rules: ChainRules) void {
        logger.debug("Setting chain rules", .{});
        logger.debug("  - Homestead: {}", .{rules.IsHomestead});
        logger.debug("  - EIP150: {}", .{rules.IsEIP150});
        logger.debug("  - EIP158: {}", .{rules.IsEIP158});
        logger.debug("  - Byzantium: {}", .{rules.IsByzantium});
        logger.debug("  - Constantinople: {}", .{rules.IsConstantinople});
        logger.debug("  - Petersburg: {}", .{rules.IsPetersburg});
        logger.debug("  - Istanbul: {}", .{rules.IsIstanbul});
        logger.debug("  - Berlin: {}", .{rules.IsBerlin});
        logger.debug("  - London: {}", .{rules.IsLondon});
        logger.debug("  - Merge: {}", .{rules.IsMerge});
        logger.debug("  - Shanghai: {}", .{rules.IsShanghai});
        logger.debug("  - Cancun: {}", .{rules.IsCancun});
        logger.debug("  - Prague: {}", .{rules.IsPrague});
        logger.debug("  - Verkle: {}", .{rules.IsVerkle});
        self.chainRules = rules;
    }
    
    /// Set read-only mode for the EVM
    ///
    /// When in read-only mode, operations that would modify state (like SSTORE)
    /// will fail with a WriteProtection error. This is used to implement STATICCALL
    /// semantics and view functions.
    ///
    /// Parameters:
    /// - readOnly: Whether to enable read-only mode
    pub fn setReadOnly(self: *Evm, readOnly: bool) void {
        logger.debug("Setting EVM read-only mode: {}", .{readOnly});
        self.readOnly = readOnly;
    }
    
    /// Set the state manager for the EVM
    ///
    /// The state manager provides access to accounts, balances, contract code,
    /// and storage. It's required for most EVM operations that interact with
    /// the blockchain state.
    ///
    /// Parameters:
    /// - stateManager: Pointer to the StateManager to use
    pub fn setStateManager(self: *Evm, stateManager: *StateManager) void {
        logger.debug("Setting state manager for EVM", .{});
        self.state_manager = stateManager;
    }
};

/// Chain rules for different Ethereum hardforks
///
/// This struct configures which Ethereum protocol rules and EIPs are active
/// during EVM execution. The default is set to the latest Ethereum version (Cancun),
/// but can be configured for any supported hardfork.
///
/// Each field represents a specific hardfork or EIP activation status.
pub const ChainRules = struct {
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
    
    /// Create chain rules for a specific hardfork
    ///
    /// This is a factory method that creates a ChainRules configuration
    /// properly configured for the specified Ethereum hardfork.
    ///
    /// Parameters:
    /// - hardfork: The Ethereum hardfork to create rules for
    ///
    /// Returns: A ChainRules instance configured for the specified hardfork
    pub fn forHardfork(hardfork: Hardfork) ChainRules {
        var rules = ChainRules{};
        
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
            },
            .Merge => {
                rules.IsShanghai = false;
                rules.IsCancun = false;
                rules.IsEIP3651 = false;
                rules.IsEIP3855 = false;
                rules.IsEIP3860 = false;
                rules.IsEIP4895 = false;
                rules.IsEIP4844 = false;
            },
            .Shanghai => {
                rules.IsCancun = false;
                rules.IsEIP4844 = false;
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
        
        return rules;
    }
};

/// Ethereum hardforks
///
/// This enum represents the various Ethereum protocol upgrades (hardforks)
/// that have occurred throughout Ethereum's history.
///
/// Each hardfork introduced changes to the protocol rules, added or removed
/// opcodes, changed gas costs, or added other features.
pub const Hardfork = enum {
    /// The original Ethereum protocol (July 2015)
    Frontier,
    
    /// Added DELEGATECALL and other changes (March 2016)
    Homestead,
    
    /// Gas cost increases for IO-heavy operations (October 2016)
    TangerineWhistle,
    
    /// Added EIP-150, EIP-155, EIP-160, EIP-161 (October 2016)
    SpuriousDragon,
    
    /// Added new opcodes and precompiles, zkSNARK support (October 2017)
    Byzantium,
    
    /// Added bitshift opcodes, reduced SSTORE costs (February 2019)
    Constantinople,
    
    /// Same as Constantinople but removed EIP-1283 (February 2019)
    Petersburg,
    
    /// Added CHAINID, SELFBALANCE, changed gas costs (December 2019)
    Istanbul,
    
    /// Added EIP-2565, EIP-2718, EIP-2929, EIP-2930 (April 2021)
    Berlin,
    
    /// Added EIP-1559 fee market, BASEFEE opcode (August 2021)
    London,
    
    /// Delayed difficulty bomb (December 2021)
    ArrowGlacier,
    
    /// Further delayed difficulty bomb (June 2022)
    GrayGlacier,
    
    /// Transitioned to Proof of Stake (September 2022)
    Merge,
    
    /// Added validator withdrawals, PUSH0 instruction (April 2023)
    Shanghai,
    
    /// Added EIP-4844 for data blobs, changed gas costs (March 2024)
    Cancun,
    
    /// Future planned upgrade (not yet specified)
    Prague,
    
    /// Future planned upgrade with Verkle trees
    Verkle,
};