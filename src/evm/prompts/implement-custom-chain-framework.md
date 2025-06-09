# Implement Custom Chain Framework

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_custom_chain_framework` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_custom_chain_framework feat_implement_custom_chain_framework`
3. **Work in isolation**: `cd g/feat_implement_custom_chain_framework`
4. **Commit message**: `🔧 feat: implement custom chain framework for easy blockchain variant implementation`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a comprehensive custom chain framework that enables easy implementation of custom blockchain variants (L2s, sidechains, private chains, testnets). The framework should provide configurable consensus rules, custom opcodes, modified gas schedules, custom precompiles, and chain-specific behavior while maintaining compatibility with the core EVM execution engine.

## Custom Chain Framework Specifications

### Core Chain Framework

#### 1. Chain Definition System
```zig
pub const ChainDefinition = struct {
    allocator: std.mem.Allocator,
    config: ChainConfig,
    consensus_rules: ConsensusRules,
    opcode_registry: OpcodeRegistry,
    gas_schedule: GasSchedule,
    precompile_registry: PrecompileRegistry,
    chain_validator: ChainValidator,
    extension_manager: ExtensionManager,
    
    pub const ChainConfig = struct {
        chain_id: u64,
        name: []const u8,
        chain_type: ChainType,
        hardfork_schedule: HardforkSchedule,
        consensus_algorithm: ConsensusAlgorithm,
        block_time: u64, // seconds
        block_gas_limit: u64,
        native_currency: Currency,
        custom_features: CustomFeatures,
        
        pub const ChainType = enum {
            Mainnet,
            Testnet,
            L2Rollup,
            L2Sidechain,
            Private,
            Consortium,
            Custom,
        };
        
        pub const ConsensusAlgorithm = enum {
            ProofOfWork,
            ProofOfStake,
            ProofOfAuthority,
            DelegatedProofOfStake,
            Tendermint,
            Clique,
            Custom,
        };
        
        pub const Currency = struct {
            symbol: []const u8,
            decimals: u8,
            initial_supply: ?u256,
        };
        
        pub const CustomFeatures = struct {
            enable_native_staking: bool,
            enable_governance: bool,
            enable_bridge_contracts: bool,
            enable_fast_finality: bool,
            enable_custom_addressing: bool,
            enable_meta_transactions: bool,
            enable_account_abstraction: bool,
        };
        
        pub fn ethereum_mainnet() ChainConfig {
            return ChainConfig{
                .chain_id = 1,
                .name = "Ethereum Mainnet",
                .chain_type = .Mainnet,
                .hardfork_schedule = HardforkSchedule.ethereum_mainnet(),
                .consensus_algorithm = .ProofOfStake,
                .block_time = 12,
                .block_gas_limit = 30_000_000,
                .native_currency = Currency{
                    .symbol = "ETH",
                    .decimals = 18,
                    .initial_supply = null,
                },
                .custom_features = std.mem.zeroes(CustomFeatures),
            };
        }
        
        pub fn optimism() ChainConfig {
            return ChainConfig{
                .chain_id = 10,
                .name = "Optimism",
                .chain_type = .L2Rollup,
                .hardfork_schedule = HardforkSchedule.optimism(),
                .consensus_algorithm = .ProofOfAuthority,
                .block_time = 2,
                .block_gas_limit = 30_000_000,
                .native_currency = Currency{
                    .symbol = "ETH",
                    .decimals = 18,
                    .initial_supply = null,
                },
                .custom_features = CustomFeatures{
                    .enable_native_staking = false,
                    .enable_governance = true,
                    .enable_bridge_contracts = true,
                    .enable_fast_finality = true,
                    .enable_custom_addressing = false,
                    .enable_meta_transactions = true,
                    .enable_account_abstraction = false,
                },
            };
        }
        
        pub fn polygon() ChainConfig {
            return ChainConfig{
                .chain_id = 137,
                .name = "Polygon",
                .chain_type = .L2Sidechain,
                .hardfork_schedule = HardforkSchedule.polygon(),
                .consensus_algorithm = .DelegatedProofOfStake,
                .block_time = 2,
                .block_gas_limit = 30_000_000,
                .native_currency = Currency{
                    .symbol = "MATIC",
                    .decimals = 18,
                    .initial_supply = 10_000_000_000,
                },
                .custom_features = CustomFeatures{
                    .enable_native_staking = true,
                    .enable_governance = true,
                    .enable_bridge_contracts = true,
                    .enable_fast_finality = true,
                    .enable_custom_addressing = false,
                    .enable_meta_transactions = true,
                    .enable_account_abstraction = true,
                },
            };
        }
        
        pub fn custom_chain(name: []const u8, chain_id: u64) ChainConfig {
            return ChainConfig{
                .chain_id = chain_id,
                .name = name,
                .chain_type = .Custom,
                .hardfork_schedule = HardforkSchedule.latest(),
                .consensus_algorithm = .Custom,
                .block_time = 5,
                .block_gas_limit = 15_000_000,
                .native_currency = Currency{
                    .symbol = "CUSTOM",
                    .decimals = 18,
                    .initial_supply = 1_000_000_000,
                },
                .custom_features = CustomFeatures{
                    .enable_native_staking = true,
                    .enable_governance = true,
                    .enable_bridge_contracts = false,
                    .enable_fast_finality = false,
                    .enable_custom_addressing = true,
                    .enable_meta_transactions = true,
                    .enable_account_abstraction = true,
                },
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ChainConfig) !ChainDefinition {
        return ChainDefinition{
            .allocator = allocator,
            .config = config,
            .consensus_rules = try ConsensusRules.init(allocator, config),
            .opcode_registry = try OpcodeRegistry.init(allocator, config),
            .gas_schedule = try GasSchedule.init(allocator, config),
            .precompile_registry = try PrecompileRegistry.init(allocator, config),
            .chain_validator = ChainValidator.init(config),
            .extension_manager = try ExtensionManager.init(allocator),
        };
    }
    
    pub fn deinit(self: *ChainDefinition) void {
        self.consensus_rules.deinit();
        self.opcode_registry.deinit();
        self.gas_schedule.deinit();
        self.precompile_registry.deinit();
        self.extension_manager.deinit();
    }
    
    pub fn create_execution_context(self: *ChainDefinition) !ChainExecutionContext {
        return ChainExecutionContext{
            .chain_definition = self,
            .runtime_state = try ChainRuntimeState.init(self.allocator, self.config),
            .execution_hooks = ExecutionHooks.init(self.config),
        };
    }
    
    pub fn validate_block(self: *ChainDefinition, block: *const Block) !bool {
        return try self.chain_validator.validate_block(block, &self.consensus_rules);
    }
    
    pub fn validate_transaction(self: *ChainDefinition, tx: *const Transaction) !bool {
        return try self.chain_validator.validate_transaction(tx, &self.consensus_rules);
    }
    
    pub fn get_opcode_implementation(self: *ChainDefinition, opcode: u8) ?OpcodeImplementation {
        return self.opcode_registry.get_implementation(opcode);
    }
    
    pub fn get_gas_cost(self: *ChainDefinition, opcode: u8, context: *const ExecutionContext) u64 {
        return self.gas_schedule.get_gas_cost(opcode, context);
    }
    
    pub fn get_precompile(self: *ChainDefinition, address: Address) ?PrecompileImplementation {
        return self.precompile_registry.get_precompile(address);
    }
};
```

#### 2. Consensus Rules System
```zig
pub const ConsensusRules = struct {
    allocator: std.mem.Allocator,
    config: ChainDefinition.ChainConfig,
    block_validation: BlockValidation,
    transaction_validation: TransactionValidation,
    state_transition: StateTransition,
    finality_rules: FinalityRules,
    reward_distribution: RewardDistribution,
    
    pub const BlockValidation = struct {
        max_block_size: usize,
        max_transaction_count: u32,
        min_gas_price: u256,
        max_gas_limit: u64,
        block_time_tolerance: u64,
        difficulty_adjustment: DifficultyAdjustment,
        
        pub const DifficultyAdjustment = struct {
            algorithm: DifficultyAlgorithm,
            target_block_time: u64,
            adjustment_period: u64,
            
            pub const DifficultyAlgorithm = enum {
                Ethereum,
                BitcoinLike,
                Fixed,
                Custom,
            };
        };
        
        pub fn validate_block_basic(self: *const BlockValidation, block: *const Block) !bool {
            // Basic block validation rules
            if (block.transactions.len > self.max_transaction_count) {
                return error.TooManyTransactions;
            }
            
            if (block.gas_limit > self.max_gas_limit) {
                return error.ExcessiveGasLimit;
            }
            
            if (block.size() > self.max_block_size) {
                return error.BlockTooLarge;
            }
            
            return true;
        }
        
        pub fn validate_block_timestamp(self: *const BlockValidation, block: *const Block, parent: *const Block) !bool {
            const time_diff = block.timestamp - parent.timestamp;
            
            if (time_diff < self.block_time_tolerance) {
                return error.BlockTimestampTooEarly;
            }
            
            // Allow some flexibility in block timing
            const max_time_ahead = self.block_time_tolerance * 2;
            if (time_diff > max_time_ahead) {
                return error.BlockTimestampTooLate;
            }
            
            return true;
        }
    };
    
    pub const TransactionValidation = struct {
        max_transaction_size: usize,
        min_gas_price: u256,
        max_gas_limit: u64,
        enable_eip155: bool,
        enable_access_lists: bool,
        enable_blob_transactions: bool,
        custom_transaction_types: []TransactionType,
        
        pub const TransactionType = struct {
            type_id: u8,
            name: []const u8,
            validator: *const fn(*const Transaction) bool,
        };
        
        pub fn validate_transaction_basic(self: *const TransactionValidation, tx: *const Transaction) !bool {
            if (tx.size() > self.max_transaction_size) {
                return error.TransactionTooLarge;
            }
            
            if (tx.gas_limit > self.max_gas_limit) {
                return error.ExcessiveGasLimit;
            }
            
            if (tx.gas_price < self.min_gas_price) {
                return error.GasPriceTooLow;
            }
            
            return true;
        }
        
        pub fn validate_transaction_signature(self: *const TransactionValidation, tx: *const Transaction) !bool {
            if (self.enable_eip155) {
                return try tx.validate_eip155_signature();
            } else {
                return try tx.validate_legacy_signature();
            }
        }
    };
    
    pub const StateTransition = struct {
        gas_refund_cap: f64, // As fraction of gas used
        max_code_size: usize,
        enable_account_abstraction: bool,
        enable_meta_transactions: bool,
        custom_state_hooks: []StateHook,
        
        pub const StateHook = struct {
            event_type: StateEventType,
            handler: *const fn(*StateTransition, *const StateEvent) void,
            
            pub const StateEventType = enum {
                AccountCreated,
                AccountDestroyed,
                BalanceChanged,
                StorageChanged,
                CodeDeployed,
                Custom,
            };
        };
        
        pub fn apply_state_change(self: *StateTransition, change: *const StateChange) !void {
            // Apply the state change
            try change.apply();
            
            // Trigger hooks
            for (self.custom_state_hooks) |hook| {
                if (hook.event_type == change.event_type or hook.event_type == .Custom) {
                    hook.handler(self, &change.event);
                }
            }
        }
    };
    
    pub const FinalityRules = struct {
        confirmation_depth: u32,
        finality_algorithm: FinalityAlgorithm,
        checkpoint_interval: u32,
        
        pub const FinalityAlgorithm = enum {
            LongestChain,
            GHOST,
            Casper,
            Tendermint,
            Custom,
        };
        
        pub fn is_finalized(self: *const FinalityRules, block_number: u64, chain_head: u64) bool {
            return switch (self.finality_algorithm) {
                .LongestChain => (chain_head - block_number) >= self.confirmation_depth,
                .GHOST => self.is_ghost_finalized(block_number, chain_head),
                .Casper => self.is_casper_finalized(block_number, chain_head),
                .Tendermint => true, // Instant finality
                .Custom => false, // Would call custom handler
            };
        }
        
        fn is_ghost_finalized(self: *const FinalityRules, block_number: u64, chain_head: u64) bool {
            // GHOST protocol finality rules
            _ = self;
            return (chain_head - block_number) >= 64; // Ethereum's finality depth
        }
        
        fn is_casper_finalized(self: *const FinalityRules, block_number: u64, chain_head: u64) bool {
            // Casper FFG finality rules
            const checkpoint_gap = (chain_head - block_number) / self.checkpoint_interval;
            return checkpoint_gap >= 2; // Two checkpoint finality
        }
    };
    
    pub const RewardDistribution = struct {
        block_reward: u256,
        uncle_reward_fraction: f64,
        validator_commission: f64,
        treasury_allocation: f64,
        reward_decay: RewardDecay,
        
        pub const RewardDecay = struct {
            algorithm: DecayAlgorithm,
            half_life_blocks: u64,
            min_reward: u256,
            
            pub const DecayAlgorithm = enum {
                None,
                Exponential,
                Linear,
                StepFunction,
                Custom,
            };
        };
        
        pub fn calculate_block_reward(self: *const RewardDistribution, block_number: u64) u256 {
            var base_reward = self.block_reward;
            
            // Apply decay if configured
            switch (self.reward_decay.algorithm) {
                .None => {},
                .Exponential => {
                    const blocks_since_genesis = block_number;
                    const decay_factor = @exp(-@as(f64, @floatFromInt(blocks_since_genesis)) / @as(f64, @floatFromInt(self.reward_decay.half_life_blocks)));
                    base_reward = @intFromFloat(@as(f64, @floatFromInt(base_reward)) * decay_factor);
                },
                .Linear => {
                    const decay_per_block = (self.block_reward - self.reward_decay.min_reward) / self.reward_decay.half_life_blocks;
                    base_reward = @max(self.reward_decay.min_reward, self.block_reward - (decay_per_block * block_number));
                },
                .StepFunction => {
                    const era = block_number / self.reward_decay.half_life_blocks;
                    base_reward = self.block_reward >> @intCast(era);
                },
                .Custom => {
                    // Would call custom reward calculation
                },
            }
            
            return @max(self.reward_decay.min_reward, base_reward);
        }
        
        pub fn distribute_rewards(self: *const RewardDistribution, total_reward: u256) RewardAllocation {
            const treasury_amount = @intFromFloat(@as(f64, @floatFromInt(total_reward)) * self.treasury_allocation);
            const validator_amount = total_reward - treasury_amount;
            
            return RewardAllocation{
                .validator_reward = validator_amount,
                .treasury_allocation = treasury_amount,
                .uncle_rewards = &[_]u256{},
            };
        }
        
        pub const RewardAllocation = struct {
            validator_reward: u256,
            treasury_allocation: u256,
            uncle_rewards: []const u256,
        };
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ChainDefinition.ChainConfig) !ConsensusRules {
        return ConsensusRules{
            .allocator = allocator,
            .config = config,
            .block_validation = BlockValidation{
                .max_block_size = 1024 * 1024, // 1MB
                .max_transaction_count = 1000,
                .min_gas_price = 1_000_000_000, // 1 gwei
                .max_gas_limit = config.block_gas_limit,
                .block_time_tolerance = config.block_time / 2,
                .difficulty_adjustment = BlockValidation.DifficultyAdjustment{
                    .algorithm = .Ethereum,
                    .target_block_time = config.block_time,
                    .adjustment_period = 2048,
                },
            },
            .transaction_validation = TransactionValidation{
                .max_transaction_size = 128 * 1024, // 128KB
                .min_gas_price = 1_000_000_000,
                .max_gas_limit = config.block_gas_limit,
                .enable_eip155 = true,
                .enable_access_lists = true,
                .enable_blob_transactions = false,
                .custom_transaction_types = &[_]TransactionValidation.TransactionType{},
            },
            .state_transition = StateTransition{
                .gas_refund_cap = 0.2, // 20% refund cap
                .max_code_size = 24576, // EIP-170
                .enable_account_abstraction = config.custom_features.enable_account_abstraction,
                .enable_meta_transactions = config.custom_features.enable_meta_transactions,
                .custom_state_hooks = &[_]StateTransition.StateHook{},
            },
            .finality_rules = FinalityRules{
                .confirmation_depth = 12,
                .finality_algorithm = switch (config.consensus_algorithm) {
                    .ProofOfWork => .LongestChain,
                    .ProofOfStake => .Casper,
                    .ProofOfAuthority => .LongestChain,
                    .Tendermint => .Tendermint,
                    else => .LongestChain,
                },
                .checkpoint_interval = 32,
            },
            .reward_distribution = RewardDistribution{
                .block_reward = 2_000_000_000_000_000_000, // 2 ETH equivalent
                .uncle_reward_fraction = 0.03125, // 1/32
                .validator_commission = 0.1, // 10%
                .treasury_allocation = 0.05, // 5%
                .reward_decay = RewardDistribution.RewardDecay{
                    .algorithm = .None,
                    .half_life_blocks = 0,
                    .min_reward = 0,
                },
            },
        };
    }
    
    pub fn deinit(self: *ConsensusRules) void {
        _ = self;
        // Cleanup any dynamically allocated resources
    }
};
```

#### 3. Custom Opcode Registry
```zig
pub const OpcodeRegistry = struct {
    allocator: std.mem.Allocator,
    standard_opcodes: [256]?OpcodeImplementation,
    custom_opcodes: std.HashMap(u8, OpcodeImplementation, OpcodeContext, std.hash_map.default_max_load_percentage),
    opcode_aliases: std.HashMap([]const u8, u8, StringContext, std.hash_map.default_max_load_percentage),
    chain_config: ChainDefinition.ChainConfig,
    
    pub const OpcodeImplementation = struct {
        opcode: u8,
        name: []const u8,
        stack_input: u8,
        stack_output: u8,
        gas_cost: GasCostFunction,
        execution_fn: ExecutionFunction,
        validation_fn: ?ValidationFunction,
        availability: OpcodeAvailability,
        
        pub const GasCostFunction = union(enum) {
            Static: u64,
            Dynamic: *const fn(*const ExecutionContext) u64,
            Complex: *const fn(*const ExecutionContext, []const u256) u64,
        };
        
        pub const ExecutionFunction = *const fn(*ExecutionContext, []const u256) ExecutionError![]const u256;
        pub const ValidationFunction = *const fn(*const ExecutionContext, []const u256) bool;
        
        pub const OpcodeAvailability = struct {
            hardfork: Hardfork,
            chain_types: []const ChainDefinition.ChainConfig.ChainType,
            custom_condition: ?*const fn(*const ChainDefinition.ChainConfig) bool,
        };
        
        pub fn is_available(self: *const OpcodeImplementation, config: *const ChainDefinition.ChainConfig) bool {
            // Check hardfork availability
            if (!config.hardfork_schedule.is_active(self.availability.hardfork)) {
                return false;
            }
            
            // Check chain type availability
            if (self.availability.chain_types.len > 0) {
                var chain_type_supported = false;
                for (self.availability.chain_types) |supported_type| {
                    if (config.chain_type == supported_type) {
                        chain_type_supported = true;
                        break;
                    }
                }
                if (!chain_type_supported) return false;
            }
            
            // Check custom condition
            if (self.availability.custom_condition) |condition| {
                return condition(config);
            }
            
            return true;
        }
        
        pub fn calculate_gas(self: *const OpcodeImplementation, context: *const ExecutionContext, inputs: []const u256) u64 {
            return switch (self.gas_cost) {
                .Static => |cost| cost,
                .Dynamic => |func| func(context),
                .Complex => |func| func(context, inputs),
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ChainDefinition.ChainConfig) !OpcodeRegistry {
        var registry = OpcodeRegistry{
            .allocator = allocator,
            .standard_opcodes = std.mem.zeroes([256]?OpcodeImplementation),
            .custom_opcodes = std.HashMap(u8, OpcodeImplementation, OpcodeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .opcode_aliases = std.HashMap([]const u8, u8, StringContext, std.hash_map.default_max_load_percentage).init(allocator),
            .chain_config = config,
        };
        
        // Initialize standard opcodes
        try registry.init_standard_opcodes();
        
        // Initialize chain-specific custom opcodes
        try registry.init_chain_specific_opcodes();
        
        return registry;
    }
    
    pub fn deinit(self: *OpcodeRegistry) void {
        self.custom_opcodes.deinit();
        self.opcode_aliases.deinit();
    }
    
    fn init_standard_opcodes(self: *OpcodeRegistry) !void {
        // Standard Ethereum opcodes
        self.standard_opcodes[0x01] = OpcodeImplementation{
            .opcode = 0x01,
            .name = "ADD",
            .stack_input = 2,
            .stack_output = 1,
            .gas_cost = .{ .Static = 3 },
            .execution_fn = execute_add,
            .validation_fn = null,
            .availability = OpcodeImplementation.OpcodeAvailability{
                .hardfork = .Frontier,
                .chain_types = &[_]ChainDefinition.ChainConfig.ChainType{},
                .custom_condition = null,
            },
        };
        
        // Add more standard opcodes...
    }
    
    fn init_chain_specific_opcodes(self: *OpcodeRegistry) !void {
        switch (self.chain_config.chain_type) {
            .L2Rollup => try self.init_l2_opcodes(),
            .Private => try self.init_private_chain_opcodes(),
            .Custom => try self.init_custom_opcodes(),
            else => {},
        }
    }
    
    fn init_l2_opcodes(self: *OpcodeRegistry) !void {
        // L2-specific opcodes
        try self.register_custom_opcode(OpcodeImplementation{
            .opcode = 0xF8,
            .name = "L1BLOCKHASH",
            .stack_input = 1,
            .stack_output = 1,
            .gas_cost = .{ .Static = 20 },
            .execution_fn = execute_l1_blockhash,
            .validation_fn = null,
            .availability = OpcodeImplementation.OpcodeAvailability{
                .hardfork = .Frontier,
                .chain_types = &[_]ChainDefinition.ChainConfig.ChainType{ .L2Rollup, .L2Sidechain },
                .custom_condition = null,
            },
        });
        
        try self.register_custom_opcode(OpcodeImplementation{
            .opcode = 0xF9,
            .name = "L1SEQUENCER",
            .stack_input = 0,
            .stack_output = 1,
            .gas_cost = .{ .Static = 2 },
            .execution_fn = execute_l1_sequencer,
            .validation_fn = null,
            .availability = OpcodeImplementation.OpcodeAvailability{
                .hardfork = .Frontier,
                .chain_types = &[_]ChainDefinition.ChainConfig.ChainType{ .L2Rollup },
                .custom_condition = null,
            },
        });
    }
    
    fn init_private_chain_opcodes(self: *OpcodeRegistry) !void {
        // Private chain specific opcodes
        try self.register_custom_opcode(OpcodeImplementation{
            .opcode = 0xFA,
            .name = "GOVERNANCE",
            .stack_input = 1,
            .stack_output = 1,
            .gas_cost = .{ .Dynamic = calculate_governance_gas },
            .execution_fn = execute_governance,
            .validation_fn = validate_governance_permission,
            .availability = OpcodeImplementation.OpcodeAvailability{
                .hardfork = .Frontier,
                .chain_types = &[_]ChainDefinition.ChainConfig.ChainType{ .Private, .Consortium },
                .custom_condition = is_governance_enabled,
            },
        });
    }
    
    fn init_custom_opcodes(self: *OpcodeRegistry) !void {
        // Load custom opcodes from configuration
        // This would be implemented based on specific requirements
    }
    
    pub fn register_custom_opcode(self: *OpcodeRegistry, implementation: OpcodeImplementation) !void {
        // Verify opcode doesn't conflict with standard opcodes
        if (self.standard_opcodes[implementation.opcode] != null) {
            return error.OpcodeConflict;
        }
        
        // Verify availability for current chain
        if (!implementation.is_available(&self.chain_config)) {
            return error.OpcodeNotAvailable;
        }
        
        try self.custom_opcodes.put(implementation.opcode, implementation);
        try self.opcode_aliases.put(implementation.name, implementation.opcode);
    }
    
    pub fn get_implementation(self: *OpcodeRegistry, opcode: u8) ?OpcodeImplementation {
        // Check standard opcodes first
        if (self.standard_opcodes[opcode]) |impl| {
            if (impl.is_available(&self.chain_config)) {
                return impl;
            }
        }
        
        // Check custom opcodes
        if (self.custom_opcodes.get(opcode)) |impl| {
            if (impl.is_available(&self.chain_config)) {
                return impl;
            }
        }
        
        return null;
    }
    
    pub fn get_implementation_by_name(self: *OpcodeRegistry, name: []const u8) ?OpcodeImplementation {
        if (self.opcode_aliases.get(name)) |opcode| {
            return self.get_implementation(opcode);
        }
        return null;
    }
    
    pub const OpcodeContext = struct {
        pub fn hash(self: @This(), key: u8) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: u8, b: u8) bool {
            _ = self;
            return a == b;
        }
    };
    
    pub const StringContext = struct {
        pub fn hash(self: @This(), key: []const u8) u64 {
            _ = self;
            return std.hash_map.hashString(key);
        }
        
        pub fn eql(self: @This(), a: []const u8, b: []const u8) bool {
            _ = self;
            return std.mem.eql(u8, a, b);
        }
    };
    
    // Example opcode implementations
    fn execute_add(context: *ExecutionContext, inputs: []const u256) ExecutionError![]const u256 {
        if (inputs.len != 2) return ExecutionError.StackUnderflow;
        
        const a = inputs[0];
        const b = inputs[1];
        const result = a +% b; // Wrapping addition
        
        var results = try context.allocator.alloc(u256, 1);
        results[0] = result;
        return results;
    }
    
    fn execute_l1_blockhash(context: *ExecutionContext, inputs: []const u256) ExecutionError![]const u256 {
        if (inputs.len != 1) return ExecutionError.StackUnderflow;
        
        const block_number = inputs[0];
        // Implementation would fetch L1 block hash
        const l1_hash = Hash.zero(); // Placeholder
        
        var results = try context.allocator.alloc(u256, 1);
        results[0] = l1_hash.to_u256();
        return results;
    }
    
    fn execute_l1_sequencer(context: *ExecutionContext, inputs: []const u256) ExecutionError![]const u256 {
        _ = inputs;
        
        // Return L1 sequencer address
        const sequencer_address = Address.from_bytes(&[_]u8{0} ** 20); // Placeholder
        
        var results = try context.allocator.alloc(u256, 1);
        results[0] = sequencer_address.to_u256();
        return results;
    }
    
    fn execute_governance(context: *ExecutionContext, inputs: []const u256) ExecutionError![]const u256 {
        if (inputs.len != 1) return ExecutionError.StackUnderflow;
        
        const proposal_id = inputs[0];
        // Implementation would handle governance operations
        
        var results = try context.allocator.alloc(u256, 1);
        results[0] = proposal_id; // Placeholder
        return results;
    }
    
    fn calculate_governance_gas(context: *const ExecutionContext) u64 {
        _ = context;
        return 50000; // Base governance operation cost
    }
    
    fn validate_governance_permission(context: *const ExecutionContext, inputs: []const u256) bool {
        _ = inputs;
        // Check if caller has governance permissions
        return context.caller.is_governance_address();
    }
    
    fn is_governance_enabled(config: *const ChainDefinition.ChainConfig) bool {
        return config.custom_features.enable_governance;
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Flexible Chain Configuration**: Support for different blockchain types and consensus mechanisms
2. **Custom Opcode Support**: Registration and execution of chain-specific opcodes
3. **Configurable Gas Schedules**: Chain-specific gas pricing and consumption rules
4. **Custom Precompiles**: Chain-specific precompiled contracts
5. **Consensus Rule Validation**: Pluggable consensus and validation logic
6. **Extension System**: Framework for adding custom blockchain features

## Implementation Tasks

### Task 1: Implement Custom Gas Schedule
File: `/src/evm/custom_chain/gas_schedule.zig`
```zig
const std = @import("std");
const ChainDefinition = @import("chain_definition.zig").ChainDefinition;

pub const GasSchedule = struct {
    allocator: std.mem.Allocator,
    base_costs: [256]u64,
    dynamic_costs: std.HashMap(u8, DynamicGasCalculator, OpcodeContext, std.hash_map.default_max_load_percentage),
    memory_costs: MemoryCosts,
    call_costs: CallCosts,
    storage_costs: StorageCosts,
    chain_specific_costs: ChainSpecificCosts,
    
    pub const DynamicGasCalculator = struct {
        calculator_fn: *const fn(*const ExecutionContext, []const u256) u64,
        base_cost: u64,
        description: []const u8,
    };
    
    pub const MemoryCosts = struct {
        memory_gas: u64,
        quad_coeff_div: u64,
        copy_gas: u64,
        
        pub fn calculate_memory_cost(self: *const MemoryCosts, size: u64) u64 {
            const memory_size_word = (size + 31) / 32;
            const memory_cost = (memory_size_word * self.memory_gas) + 
                               ((memory_size_word * memory_size_word) / self.quad_coeff_div);
            return memory_cost;
        }
    };
    
    pub const CallCosts = struct {
        call_gas: u64,
        call_value_transfer_gas: u64,
        call_new_account_gas: u64,
        call_stipend: u64,
        
        pub fn calculate_call_cost(
            self: *const CallCosts,
            is_value_transfer: bool,
            is_new_account: bool,
            call_gas: u64
        ) u64 {
            var cost = self.call_gas + call_gas;
            
            if (is_value_transfer) {
                cost += self.call_value_transfer_gas;
                cost += self.call_stipend;
            }
            
            if (is_new_account) {
                cost += self.call_new_account_gas;
            }
            
            return cost;
        }
    };
    
    pub const StorageCosts = struct {
        sload_gas: u64,
        sstore_set_gas: u64,
        sstore_reset_gas: u64,
        sstore_refund: u64,
        
        pub fn calculate_sstore_cost(
            self: *const StorageCosts,
            original_value: u256,
            current_value: u256,
            new_value: u256
        ) struct { cost: u64, refund: u64 } {
            // EIP-2929/3529 SSTORE pricing
            if (current_value == new_value) {
                return .{ .cost = 100, .refund = 0 }; // Warm access
            }
            
            if (original_value == current_value) {
                if (original_value == 0) {
                    return .{ .cost = self.sstore_set_gas, .refund = 0 };
                } else {
                    return .{ .cost = self.sstore_reset_gas, .refund = 0 };
                }
            }
            
            // Complex refund logic
            var cost: u64 = 100; // Warm access
            var refund: u64 = 0;
            
            if (current_value != 0 and new_value == 0) {
                refund += self.sstore_refund;
            }
            
            return .{ .cost = cost, .refund = refund };
        }
    };
    
    pub const ChainSpecificCosts = struct {
        l2_data_cost: u64,
        governance_operation_cost: u64,
        bridge_operation_cost: u64,
        staking_operation_cost: u64,
        
        pub fn get_chain_cost(self: *const ChainSpecificCosts, operation: ChainOperation) u64 {
            return switch (operation) {
                .L2DataPosting => self.l2_data_cost,
                .GovernanceVote => self.governance_operation_cost,
                .BridgeTransfer => self.bridge_operation_cost,
                .StakingDelegate => self.staking_operation_cost,
            };
        }
        
        pub const ChainOperation = enum {
            L2DataPosting,
            GovernanceVote,
            BridgeTransfer,
            StakingDelegate,
        };
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ChainDefinition.ChainConfig) !GasSchedule {
        var schedule = GasSchedule{
            .allocator = allocator,
            .base_costs = [_]u64{0} ** 256,
            .dynamic_costs = std.HashMap(u8, DynamicGasCalculator, OpcodeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .memory_costs = MemoryCosts{
                .memory_gas = 3,
                .quad_coeff_div = 512,
                .copy_gas = 3,
            },
            .call_costs = CallCosts{
                .call_gas = 700,
                .call_value_transfer_gas = 9000,
                .call_new_account_gas = 25000,
                .call_stipend = 2300,
            },
            .storage_costs = StorageCosts{
                .sload_gas = 100,
                .sstore_set_gas = 20000,
                .sstore_reset_gas = 5000,
                .sstore_refund = 4800,
            },
            .chain_specific_costs = ChainSpecificCosts{
                .l2_data_cost = 16,
                .governance_operation_cost = 50000,
                .bridge_operation_cost = 100000,
                .staking_operation_cost = 30000,
            },
        };
        
        try schedule.init_standard_costs();
        try schedule.init_chain_specific_costs(config);
        
        return schedule;
    }
    
    pub fn deinit(self: *GasSchedule) void {
        self.dynamic_costs.deinit();
    }
    
    fn init_standard_costs(self: *GasSchedule) !void {
        // Initialize standard Ethereum gas costs
        self.base_costs[0x01] = 3;  // ADD
        self.base_costs[0x02] = 5;  // MUL
        self.base_costs[0x03] = 3;  // SUB
        self.base_costs[0x04] = 5;  // DIV
        self.base_costs[0x05] = 5;  // SDIV
        self.base_costs[0x06] = 5;  // MOD
        self.base_costs[0x07] = 5;  // SMOD
        self.base_costs[0x08] = 8;  // ADDMOD
        self.base_costs[0x09] = 8;  // MULMOD
        self.base_costs[0x0A] = 10; // EXP (base cost, dynamic for large exponents)
        
        // Register dynamic cost calculators
        try self.dynamic_costs.put(0x0A, DynamicGasCalculator{
            .calculator_fn = calculate_exp_gas,
            .base_cost = 10,
            .description = "EXP dynamic gas calculation",
        });
        
        try self.dynamic_costs.put(0x20, DynamicGasCalculator{
            .calculator_fn = calculate_keccak_gas,
            .base_cost = 30,
            .description = "KECCAK256 dynamic gas calculation",
        });
    }
    
    fn init_chain_specific_costs(self: *GasSchedule, config: ChainDefinition.ChainConfig) !void {
        switch (config.chain_type) {
            .L2Rollup => {
                // L2 typically has lower gas costs
                for (&self.base_costs) |*cost| {
                    cost.* = cost.* / 2; // 50% reduction
                }
                
                // But higher costs for data availability
                self.chain_specific_costs.l2_data_cost = 32;
            },
            .L2Sidechain => {
                // Even lower costs for sidechains
                for (&self.base_costs) |*cost| {
                    cost.* = cost.* / 4; // 75% reduction
                }
            },
            .Private => {
                // Private chains might have custom gas models
                if (config.custom_features.enable_governance) {
                    self.chain_specific_costs.governance_operation_cost = 10000; // Lower than public chains
                }
            },
            else => {},
        }
    }
    
    pub fn get_gas_cost(self: *GasSchedule, opcode: u8, context: *const ExecutionContext) u64 {
        // Check for dynamic cost calculator
        if (self.dynamic_costs.get(opcode)) |calculator| {
            return calculator.calculator_fn(context, &[_]u256{});
        }
        
        // Return base cost
        return self.base_costs[opcode];
    }
    
    fn calculate_exp_gas(context: *const ExecutionContext, inputs: []const u256) u64 {
        _ = context;
        
        if (inputs.len < 2) return 10; // Base cost
        
        const exponent = inputs[1];
        if (exponent == 0) return 10;
        
        // Calculate bit length of exponent
        const bit_length = 256 - @clz(exponent);
        return 10 + (50 * ((bit_length + 7) / 8));
    }
    
    fn calculate_keccak_gas(context: *const ExecutionContext, inputs: []const u256) u64 {
        _ = inputs;
        
        // Would calculate based on data size from context
        const data_size = context.get_call_data_size();
        const word_count = (data_size + 31) / 32;
        return 30 + (6 * word_count);
    }
    
    pub const OpcodeContext = struct {
        pub fn hash(self: @This(), key: u8) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: u8, b: u8) bool {
            _ = self;
            return a == b;
        }
    };
};
```

### Task 2: Implement Hardfork Schedule
File: `/src/evm/custom_chain/hardfork_schedule.zig`
```zig
const std = @import("std");
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;

pub const HardforkSchedule = struct {
    allocator: std.mem.Allocator,
    hardforks: std.ArrayList(HardforkActivation),
    current_hardfork: Hardfork,
    
    pub const HardforkActivation = struct {
        hardfork: Hardfork,
        block_number: u64,
        timestamp: ?u64,
        conditions: []const ActivationCondition,
        
        pub const ActivationCondition = union(enum) {
            BlockNumber: u64,
            Timestamp: u64,
            Custom: *const fn(u64, u64) bool, // (block_number, timestamp) -> bool
        };
        
        pub fn is_active(self: *const HardforkActivation, block_number: u64, timestamp: u64) bool {
            for (self.conditions) |condition| {
                switch (condition) {
                    .BlockNumber => |required_block| {
                        if (block_number < required_block) return false;
                    },
                    .Timestamp => |required_timestamp| {
                        if (timestamp < required_timestamp) return false;
                    },
                    .Custom => |condition_fn| {
                        if (!condition_fn(block_number, timestamp)) return false;
                    },
                }
            }
            return true;
        }
    };
    
    pub fn init(allocator: std.mem.Allocator) HardforkSchedule {
        return HardforkSchedule{
            .allocator = allocator,
            .hardforks = std.ArrayList(HardforkActivation).init(allocator),
            .current_hardfork = .Frontier,
        };
    }
    
    pub fn deinit(self: *HardforkSchedule) void {
        self.hardforks.deinit();
    }
    
    pub fn ethereum_mainnet() HardforkSchedule {
        var schedule = HardforkSchedule.init(std.heap.page_allocator);
        
        // Ethereum mainnet hardfork schedule
        schedule.add_hardfork(.Frontier, 0, null, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 0 },
        }) catch {};
        
        schedule.add_hardfork(.Homestead, 1150000, null, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 1150000 },
        }) catch {};
        
        schedule.add_hardfork(.Byzantium, 4370000, null, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 4370000 },
        }) catch {};
        
        schedule.add_hardfork(.London, 12965000, null, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 12965000 },
        }) catch {};
        
        schedule.add_hardfork(.Cancun, 19426587, 1710338135, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 19426587 },
            .{ .Timestamp = 1710338135 },
        }) catch {};
        
        return schedule;
    }
    
    pub fn optimism() HardforkSchedule {
        var schedule = HardforkSchedule.init(std.heap.page_allocator);
        
        // Optimism follows Ethereum but with different activation blocks
        schedule.add_hardfork(.Frontier, 0, null, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 0 },
        }) catch {};
        
        schedule.add_hardfork(.London, 105235063, null, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 105235063 },
        }) catch {};
        
        schedule.add_hardfork(.Cancun, 118900000, 1710374400, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 118900000 },
            .{ .Timestamp = 1710374400 },
        }) catch {};
        
        return schedule;
    }
    
    pub fn polygon() HardforkSchedule {
        var schedule = HardforkSchedule.init(std.heap.page_allocator);
        
        // Polygon hardfork schedule
        schedule.add_hardfork(.Frontier, 0, null, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 0 },
        }) catch {};
        
        schedule.add_hardfork(.London, 23850000, null, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 23850000 },
        }) catch {};
        
        return schedule;
    }
    
    pub fn latest() HardforkSchedule {
        var schedule = HardforkSchedule.init(std.heap.page_allocator);
        
        // Latest hardfork from genesis
        schedule.add_hardfork(.Cancun, 0, null, &[_]HardforkActivation.ActivationCondition{
            .{ .BlockNumber = 0 },
        }) catch {};
        
        return schedule;
    }
    
    pub fn add_hardfork(
        self: *HardforkSchedule,
        hardfork: Hardfork,
        block_number: u64,
        timestamp: ?u64,
        conditions: []const HardforkActivation.ActivationCondition
    ) !void {
        const activation = HardforkActivation{
            .hardfork = hardfork,
            .block_number = block_number,
            .timestamp = timestamp,
            .conditions = conditions,
        };
        
        try self.hardforks.append(activation);
        
        // Keep hardforks sorted by block number
        std.sort.sort(HardforkActivation, self.hardforks.items, {}, struct {
            fn lessThan(context: void, lhs: HardforkActivation, rhs: HardforkActivation) bool {
                _ = context;
                return lhs.block_number < rhs.block_number;
            }
        }.lessThan);
    }
    
    pub fn get_active_hardfork(self: *HardforkSchedule, block_number: u64, timestamp: u64) Hardfork {
        var active_hardfork = Hardfork.Frontier;
        
        for (self.hardforks.items) |activation| {
            if (activation.is_active(block_number, timestamp)) {
                active_hardfork = activation.hardfork;
            } else {
                break; // Hardforks are sorted, so no later ones will be active
            }
        }
        
        self.current_hardfork = active_hardfork;
        return active_hardfork;
    }
    
    pub fn is_active(self: *HardforkSchedule, hardfork: Hardfork) bool {
        return @intFromEnum(self.current_hardfork) >= @intFromEnum(hardfork);
    }
    
    pub fn get_next_hardfork(self: *HardforkSchedule, block_number: u64, timestamp: u64) ?HardforkActivation {
        for (self.hardforks.items) |activation| {
            if (!activation.is_active(block_number, timestamp)) {
                return activation;
            }
        }
        return null;
    }
};
```

### Task 3: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const ChainDefinition = @import("custom_chain/chain_definition.zig").ChainDefinition;
const ChainExecutionContext = @import("custom_chain/chain_execution_context.zig").ChainExecutionContext;

pub const Vm = struct {
    // Existing fields...
    chain_definition: ?ChainDefinition,
    chain_execution_context: ?ChainExecutionContext,
    custom_chain_enabled: bool,
    
    pub fn enable_custom_chain(self: *Vm, config: ChainDefinition.ChainConfig) !void {
        self.chain_definition = try ChainDefinition.init(self.allocator, config);
        self.chain_execution_context = try self.chain_definition.?.create_execution_context();
        self.custom_chain_enabled = true;
    }
    
    pub fn disable_custom_chain(self: *Vm) void {
        if (self.chain_execution_context) |*context| {
            context.deinit();
            self.chain_execution_context = null;
        }
        if (self.chain_definition) |*definition| {
            definition.deinit();
            self.chain_definition = null;
        }
        self.custom_chain_enabled = false;
    }
    
    pub fn execute_custom_opcode(self: *Vm, opcode: u8) !void {
        if (!self.custom_chain_enabled) return error.CustomChainDisabled;
        
        if (self.chain_definition.?.get_opcode_implementation(opcode)) |implementation| {
            const gas_cost = implementation.calculate_gas(&self.execution_context, &[_]u256{});
            
            // Consume gas
            try self.consume_gas(gas_cost);
            
            // Get stack inputs
            var inputs = try self.allocator.alloc(u256, implementation.stack_input);
            defer self.allocator.free(inputs);
            
            for (0..implementation.stack_input) |i| {
                inputs[i] = try self.stack.pop();
            }
            
            // Execute opcode
            const outputs = try implementation.execution_fn(&self.execution_context, inputs);
            defer self.allocator.free(outputs);
            
            // Push outputs to stack
            for (outputs) |output| {
                try self.stack.push(output);
            }
        } else {
            return error.UnknownOpcode;
        }
    }
    
    pub fn validate_block_custom(self: *Vm, block: *const Block) !bool {
        if (!self.custom_chain_enabled) return true;
        
        return try self.chain_definition.?.validate_block(block);
    }
    
    pub fn validate_transaction_custom(self: *Vm, tx: *const Transaction) !bool {
        if (!self.custom_chain_enabled) return true;
        
        return try self.chain_definition.?.validate_transaction(tx);
    }
    
    pub fn get_custom_gas_cost(self: *Vm, opcode: u8) u64 {
        if (!self.custom_chain_enabled) return 0;
        
        return self.chain_definition.?.get_gas_cost(opcode, &self.execution_context);
    }
    
    pub fn get_chain_id_custom(self: *Vm) u64 {
        if (self.chain_definition) |*definition| {
            return definition.config.chain_id;
        }
        return 1; // Default to mainnet
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/custom_chain/custom_chain_test.zig`

### Test Cases
```zig
test "chain definition creation and configuration" {
    // Test creation of different chain types
    // Test configuration validation
    // Test hardfork schedule setup
}

test "consensus rules validation" {
    // Test block validation rules
    // Test transaction validation rules
    // Test finality calculations
}

test "custom opcode registration and execution" {
    // Test opcode registration
    // Test opcode execution
    // Test availability checking
}

test "gas schedule customization" {
    // Test custom gas costs
    // Test dynamic gas calculations
    // Test chain-specific gas adjustments
}

test "hardfork schedule management" {
    // Test hardfork activation
    // Test hardfork schedule updates
    // Test compatibility checking
}

test "precompile registry functionality" {
    // Test precompile registration
    // Test precompile execution
    // Test chain-specific precompiles
}

test "integration with VM execution" {
    // Test VM integration
    // Test custom chain execution
    // Test performance impact measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/custom_chain/chain_definition.zig` - Main chain definition framework
- `/src/evm/custom_chain/consensus_rules.zig` - Consensus and validation rules
- `/src/evm/custom_chain/opcode_registry.zig` - Custom opcode management
- `/src/evm/custom_chain/gas_schedule.zig` - Custom gas pricing
- `/src/evm/custom_chain/precompile_registry.zig` - Custom precompiles
- `/src/evm/custom_chain/hardfork_schedule.zig` - Hardfork management
- `/src/evm/custom_chain/chain_validator.zig` - Chain-specific validation
- `/src/evm/custom_chain/extension_manager.zig` - Extension system
- `/src/evm/vm.zig` - VM integration with custom chains
- `/test/evm/custom_chain/custom_chain_test.zig` - Comprehensive tests

## Success Criteria

1. **Easy Chain Creation**: Simple API for creating custom blockchain variants
2. **Full Configurability**: Support for custom consensus rules, opcodes, and gas schedules
3. **Type Safety**: All custom configurations are validated and type-safe
4. **Performance Efficiency**: Minimal overhead when custom features are disabled
5. **Extensibility**: Easy addition of new chain types and features
6. **Compatibility**: Maintain compatibility with standard Ethereum execution

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Backward compatibility** - Standard Ethereum execution must remain unchanged
3. **Performance validation** - Custom chain features must not degrade standard performance
4. **Type safety** - All custom implementations must be properly typed and validated
5. **Security** - Custom chains must not compromise EVM security guarantees
6. **Resource efficiency** - Custom features should be memory and CPU efficient

## References

- [Ethereum Improvement Proposals](https://eips.ethereum.org/) - EIP specifications for custom features
- [Optimism Specs](https://specs.optimism.io/) - L2 rollup chain specifications
- [Polygon Architecture](https://docs.polygon.technology/) - Sidechain implementation details
- [Tendermint Consensus](https://docs.tendermint.com/) - Alternative consensus mechanisms
- [Substrate Framework](https://substrate.io/) - Blockchain framework design patterns