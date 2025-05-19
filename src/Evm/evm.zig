const std = @import("std");
const Frame = @import("Frame.zig").Frame;
const StateManager = @import("../StateManager/StateManager.zig").StateManager;

/// EVM represents the Ethereum Virtual Machine
pub const Evm = struct {
    /// Current call depth (max 1024)
    depth: u16 = 0,
    
    /// Whether the current execution is in the context of a static call
    readOnly: bool = false,
    
    /// Chain rules configuration (e.g., which hardfork rules to apply)
    chainRules: ChainRules = ChainRules{},
    
    /// State manager for accessing account and storage state
    state_manager: ?*StateManager = null,
    
    /// Create a new EVM instance
    pub fn init() Evm {
        return Evm{};
    }
    
    /// Set chain rules
    pub fn setChainRules(self: *Evm, rules: ChainRules) void {
        self.chainRules = rules;
    }
    
    /// Set read-only mode
    pub fn setReadOnly(self: *Evm, readOnly: bool) void {
        self.readOnly = readOnly;
    }
    
    /// Set state manager
    pub fn setStateManager(self: *Evm, stateManager: *StateManager) void {
        self.state_manager = stateManager;
    }
};

/// Chain rules for different Ethereum hardforks
pub const ChainRules = struct {
    /// Is Homestead rules enabled
    IsHomestead: bool = true,
    /// Is EIP150 rules enabled
    IsEIP150: bool = true,
    /// Is EIP158 rules enabled
    IsEIP158: bool = true,
    /// Is Byzantium rules enabled
    IsByzantium: bool = true,
    /// Is Constantinople rules enabled
    IsConstantinople: bool = true,
    /// Is Petersburg rules enabled
    IsPetersburg: bool = true,
    /// Is Istanbul rules enabled
    IsIstanbul: bool = true,
    /// Is Berlin rules enabled
    IsBerlin: bool = true,
    /// Is London rules enabled
    IsLondon: bool = true,
    /// Is Merge rules enabled
    IsMerge: bool = true,
    /// Is Shanghai rules enabled
    IsShanghai: bool = true,
    /// Is Cancun rules enabled
    IsCancun: bool = true,
    /// Is Prague rules enabled
    IsPrague: bool = false,
    /// Is Verkle rules enabled
    IsVerkle: bool = false,
    /// Is EIP1559 rules enabled
    IsEIP1559: bool = true,
    /// Is EIP2930 rules enabled
    IsEIP2930: bool = true,
    /// Is EIP3651 rules enabled (warm COINBASE)
    IsEIP3651: bool = true,
    /// Is EIP3855 rules enabled (PUSH0 instruction)
    IsEIP3855: bool = true,
    /// Is EIP3860 rules enabled (limit and meter initcode)
    IsEIP3860: bool = true,
    /// Is EIP4895 rules enabled (beacon chain withdrawals)
    IsEIP4895: bool = true,
    /// Is EIP4844 rules enabled (shard blob transactions)
    IsEIP4844: bool = true,
    
    /// Create chain rules for a specific hardfork
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
pub const Hardfork = enum {
    Frontier,
    Homestead,
    TangerineWhistle,
    SpuriousDragon,
    Byzantium,
    Constantinople,
    Petersburg,
    Istanbul,
    Berlin,
    London,
    ArrowGlacier,
    GrayGlacier,
    Merge,
    Shanghai,
    Cancun,
    Prague,
    Verkle,
};