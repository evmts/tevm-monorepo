# Implement Custom Chain Framework

You are implementing Custom Chain Framework for the Tevm EVM written in Zig. Your goal is to implement framework for supporting custom blockchain configurations following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_custom_chain_framework` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_custom_chain_framework feat_implement_custom_chain_framework`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive custom chain framework that enables easy implementation of custom blockchain variants (L2s, sidechains, private chains, testnets). The framework should provide configurable consensus rules, custom opcodes, modified gas schedules, custom precompiles, and chain-specific behavior while maintaining compatibility with the core EVM execution engine.

## ELI5

Think of this as building a universal blockchain factory. Just like how a car factory can be reconfigured to build different types of vehicles (sports cars, trucks, electric cars), this framework lets you create different types of blockchains from the same base system. You can adjust the "assembly line" settings to create faster chains, more secure chains, or chains with special features, all while using the same proven engine underneath.

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

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/chain/custom_chain_framework_test.zig`)
```zig
// Test basic custom chain functionality
test "chain_definition basic functionality with known scenarios"
test "chain_definition handles edge cases correctly"
test "chain_definition validates input parameters"
test "chain_definition produces correct output format"
test "consensus_rules validate chain behavior"
test "opcode_registry manages custom opcodes"
test "gas_schedule calculates costs correctly"
test "precompile_registry handles custom precompiles"
```

#### 2. **Integration Tests**
```zig
test "custom_chain integrates with EVM execution context"
test "custom_chain works with existing EVM systems"
test "custom_chain maintains compatibility with hardforks"
test "custom_chain handles system-level interactions"
test "chain_validator ensures configuration consistency"
test "extension_manager loads plugins correctly"
test "chain_migration preserves state across updates"
test "multi_chain supports parallel execution"
```

#### 3. **Functional Tests**
```zig
test "custom_chain end-to-end functionality works correctly"
test "custom_chain handles realistic usage scenarios"
test "custom_chain maintains behavior under load"
test "custom_chain processes complex inputs correctly"
test "l2_rollup_chain executes transactions correctly"
test "sidechain_setup configures correctly"
test "private_chain maintains privacy"
test "testnet_configuration supports development"
```

#### 4. **Performance Tests**
```zig
test "custom_chain meets performance requirements"
test "custom_chain memory usage within bounds"
test "custom_chain scalability with large inputs"
test "custom_chain benchmark against baseline"
test "chain_switching_overhead acceptable"
test "custom_opcode_performance optimal"
test "precompile_execution_speed satisfactory"
test "consensus_algorithm_efficiency adequate"
```

#### 5. **Error Handling Tests**
```zig
test "custom_chain error propagation works correctly"
test "custom_chain proper error types and messages"
test "custom_chain graceful handling of invalid inputs"
test "custom_chain recovery from failure states"
test "chain_validation rejects invalid configurations"
test "custom_opcodes handle execution errors"
test "precompile_errors propagate correctly"
test "consensus_failures trigger fallbacks"
```

#### 6. **Compatibility Tests**
```zig
test "custom_chain maintains EVM specification compliance"
test "custom_chain cross-client behavior consistency"
test "custom_chain backward compatibility preserved"
test "custom_chain platform-specific behavior verified"
test "chain_interoperability works correctly"
test "standard_evm_compatibility maintained"
test "hardfork_compatibility preserved"
test "client_compatibility ensured"
```

### Test Development Priority
1. **Start with core functionality** - Ensure basic chain definition and configuration works correctly
2. **Add integration tests** - Verify system-level interactions with EVM execution
3. **Implement performance tests** - Meet efficiency requirements for custom chain operations
4. **Add error handling tests** - Robust failure management for invalid configurations
5. **Test edge cases** - Handle boundary conditions like chain migration and upgrade scenarios
6. **Verify compatibility** - Ensure EVM specification compliance and client compatibility

### Test Data Sources
- **EVM specification requirements**: Core compatibility and behavior verification
- **Reference implementation data**: Cross-client compatibility testing
- **Performance benchmarks**: Custom chain execution efficiency baseline
- **Real-world chain configurations**: L2 and sidechain validation scenarios
- **Synthetic test cases**: Edge condition and stress testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify cross-platform compatibility

### Test-First Examples

**Before writing any implementation:**
```zig
test "chain_definition basic functionality" {
    // This test MUST fail initially
    const allocator = testing.allocator;
    
    var chain_def = ChainDefinition.init(allocator, test_data.l2_chain_config);
    defer chain_def.deinit();
    
    const custom_opcode = CustomOpcode{
        .opcode = 0xF0,
        .name = "CUSTOM_ADD",
        .gas_cost = 5,
        .implementation = test_implementations.custom_add,
    };
    
    try chain_def.registerCustomOpcode(custom_opcode);
    
    const is_registered = chain_def.hasOpcode(0xF0);
    try testing.expect(is_registered);
    
    const opcode_info = chain_def.getOpcodeInfo(0xF0);
    try testing.expectEqualStrings("CUSTOM_ADD", opcode_info.name);
    try testing.expectEqual(@as(u64, 5), opcode_info.gas_cost);
}
```

**Only then implement:**
```zig
pub const ChainDefinition = struct {
    pub fn registerCustomOpcode(self: *ChainDefinition, opcode: CustomOpcode) !void {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test custom chain configuration** - Ensure proper chain parameter validation
- **Verify opcode and precompile correctness** - Custom implementations must be secure
- **Test cross-platform chain behavior** - Ensure consistent results across platforms
- **Validate integration points** - Test all external interfaces thoroughly

## References

- [Ethereum Improvement Proposals](https://eips.ethereum.org/) - EIP specifications for custom features
- [Optimism Specs](https://specs.optimism.io/) - L2 rollup chain specifications
- [Polygon Architecture](https://docs.polygon.technology/) - Sidechain implementation details
- [Tendermint Consensus](https://docs.tendermint.com/) - Alternative consensus mechanisms
- [Substrate Framework](https://substrate.io/) - Blockchain framework design patterns

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
```cpp
/// The table of instruction gas costs per EVM revision.
using GasCostTable = std::array<std::array<int16_t, 256>, EVMC_MAX_REVISION + 1>;

/// The EVM revision specific table of EVM instructions gas costs. For instructions undefined
/// in given EVM revision, the value is instr::undefined.
constexpr inline GasCostTable gas_costs = []() noexcept {
    GasCostTable table{};

    for (auto& t : table[EVMC_FRONTIER])
        t = undefined;
    table[EVMC_FRONTIER][OP_STOP] = 0;
    table[EVMC_FRONTIER][OP_ADD] = 3;
    table[EVMC_FRONTIER][OP_MUL] = 5;
    // ... many more opcodes
    table[EVMC_FRONTIER][OP_SELFDESTRUCT] = 0;

    table[EVMC_HOMESTEAD] = table[EVMC_FRONTIER];
    table[EVMC_HOMESTEAD][OP_DELEGATECALL] = 40;

    table[EVMC_TANGERINE_WHISTLE] = table[EVMC_HOMESTEAD];
    table[EVMC_TANGERINE_WHISTLE][OP_BALANCE] = 400;
    // ... gas changes for Tangerine Whistle

    table[EVMC_SPURIOUS_DRAGON] = table[EVMC_TANGERINE_WHISTLE];

    table[EVMC_BYZANTIUM] = table[EVMC_SPURIOUS_DRAGON];
    table[EVMC_BYZANTIUM][OP_RETURNDATASIZE] = 2;
    table[EVMC_BYZANTIUM][OP_RETURNDATACOPY] = 3;
    table[EVMC_BYZANTIUM][OP_STATICCALL] = 700;
    table[EVMC_BYZANTIUM][OP_REVERT] = 0;

    table[EVMC_CONSTANTINOPLE] = table[EVMC_BYZANTIUM];
    table[EVMC_CONSTANTINOPLE][OP_SHL] = 3;
    table[EVMC_CONSTANTINOPLE][OP_SHR] = 3;
    table[EVMC_CONSTANTINOPLE][OP_SAR] = 3;
    table[EVMC_CONSTANTINOPLE][OP_EXTCODEHASH] = 400;
    table[EVMC_CONSTANTINOPLE][OP_CREATE2] = 32000;
    //... and so on for each hardfork

    return table;
}();

/// The EVM instruction traits.
struct Traits
{
    /// The instruction name;
    const char* name = nullptr;

    /// Size of the immediate argument in bytes.
    uint8_t immediate_size = 0;

    /// Whether the instruction terminates execution.
    bool is_terminating = false;

    /// The number of stack items the instruction accesses during execution.
    uint8_t stack_height_required = 0;

    /// The stack height change caused by the instruction execution. Can be negative.
    int8_t stack_height_change = 0;

    /// The EVM revision in which the instruction has been defined.
    std::optional<evmc_revision> since;

    /// The EVM revision in which the instruction has become valid in EOF.
    std::optional<evmc_revision> eof_since;
};

/// The global, EVM revision independent, table of traits of all known EVM instructions.
constexpr inline std::array<Traits, 256> traits = []() noexcept {
    std::array<Traits, 256> table{};

    table[OP_STOP] = {"STOP", 0, true, 0, 0, EVMC_FRONTIER, REV_EOF1};
    table[OP_ADD] = {"ADD", 0, false, 2, -1, EVMC_FRONTIER, REV_EOF1};
    // ...
    table[OP_DELEGATECALL] = {"DELEGATECALL", 0, false, 6, -5, EVMC_HOMESTEAD};
    // ...
    table[OP_SHL] = {"SHL", 0, false, 2, -1, EVMC_CONSTANTINOPLE, REV_EOF1};
    // ...
    table[OP_PUSH0] = {"PUSH0", 0, false, 0, 1, EVMC_SHANGHAI, REV_EOF1};
    // ...
    table[OP_MCOPY] = {"MCOPY", 0, false, 3, -3, EVMC_CANCUN, REV_EOF1};
    // ...

    return table;
}();
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_xmacro.hpp">
```cpp
/// The "X Macro" for opcodes and their matching identifiers.
/// It has 3 knobs for users.
///
/// 1. The ON_OPCODE(OPCODE) macro must be defined. It will receive all defined opcodes from
///    the evmc_opcode enum.
/// 2. The ON_OPCODE_UNDEFINED(OPCODE) macro may be defined to receive
///    the values of all undefined opcodes.
/// 3. The ON_OPCODE_IDENTIFIER(OPCODE, IDENTIFIER) macro may be defined to receive
///    the pairs of all defined opcodes and their matching identifiers.
///
/// See for more about X Macros: https://en.wikipedia.org/wiki/X_Macro.
#define MAP_OPCODES                                           \
    ON_OPCODE_IDENTIFIER(OP_STOP, stop)                       \
    ON_OPCODE_IDENTIFIER(OP_ADD, add)                         \
    ON_OPCODE_IDENTIFIER(OP_MUL, mul)                         \
    ON_OPCODE_IDENTIFIER(OP_SUB, sub)                         \
    // ... and so on for all opcodes
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.hpp">
```cpp
class CodeAnalysis
{
public:
    using JumpdestMap = std::vector<bool>;

private:
    bytes_view m_raw_code;         ///< Unmodified full code.
    bytes_view m_executable_code;  ///< Executable code section.
    JumpdestMap m_jumpdest_map;    ///< Map of valid jump destinations.
    EOF1Header m_eof_header;       ///< The EOF header.

    /// Padded code for faster legacy code execution.
    /// If not nullptr the executable_code must point to it.
    std::unique_ptr<uint8_t[]> m_padded_code;

public:
    // ...
    /// Check if given position is valid jump destination. Use only for legacy code.
    [[nodiscard]] bool check_jumpdest(uint64_t position) const noexcept
    {
        if (position >= m_jumpdest_map.size())
            return false;
        return m_jumpdest_map[static_cast<size_t>(position)];
    }
};

/// Analyze the EVM code in preparation for execution.
///
/// For legacy code this builds the map of valid JUMPDESTs.
/// If EOF is enabled, it recognizes the EOF code by the code prefix.
///
/// @param code         The reference to the EVM code to be analyzed.
/// @param eof_enabled  Should the EOF code prefix be recognized as EOF code?
EVMC_EXPORT CodeAnalysis analyze(bytes_view code, bool eof_enabled);
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_analysis.cpp">
```cpp
namespace
{
CodeAnalysis::JumpdestMap analyze_jumpdests(bytes_view code)
{
    // To find if op is any PUSH opcode (OP_PUSH1 <= op <= OP_PUSH32)
    // it can be noticed that OP_PUSH32 is INT8_MAX (0x7f) therefore
    // static_cast<int8_t>(op) <= OP_PUSH32 is always true and can be skipped.
    static_assert(OP_PUSH32 == std::numeric_limits<int8_t>::max());

    CodeAnalysis::JumpdestMap map(code.size());  // Allocate and init bitmap with zeros.
    for (size_t i = 0; i < code.size(); ++i)
    {
        const auto op = code[i];
        if (static_cast<int8_t>(op) >= OP_PUSH1)  // If any PUSH opcode (see explanation above).
            i += op - size_t{OP_PUSH1 - 1};       // Skip PUSH data.
        else if (INTX_UNLIKELY(op == OP_JUMPDEST))
            map[i] = true;
    }

    return map;
}
//...
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
```cpp
bool is_precompile(evmc_revision rev, const evmc::address& addr) noexcept
{
    if (evmc::is_zero(addr) || addr > evmc::address{stdx::to_underlying(PrecompileId::latest)})
        return false;

    const auto id = addr.bytes[19];
    if (rev < EVMC_BYZANTIUM && id >= stdx::to_underlying(PrecompileId::since_byzantium))
        return false;
    // ... more hardfork checks ...
    return true;
}

evmc::Result call_precompile(evmc_revision rev, const evmc_message& msg) noexcept
{
    assert(msg.gas >= 0);

    const auto id = msg.code_address.bytes[19];
    const auto [analyze, execute] = traits[id];

    const bytes_view input{msg.input_data, msg.input_size};
    const auto [gas_cost, max_output_size] = analyze(input, rev);
    const auto gas_left = msg.gas - gas_cost;
    if (gas_left < 0)
        return evmc::Result{EVMC_OUT_OF_GAS};

    // Allocate buffer for the precompile's output and pass its ownership to evmc::Result.
    const auto output_data = new (std::nothrow) uint8_t[max_output_size];
    const auto [status_code, output_size] =
        execute(msg.input_data, msg.input_size, output_data, max_output_size);
    const evmc_result result{status_code, status_code == EVMC_SUCCESS ? gas_left : 0, 0,
        output_data, output_size,
        [](const evmc_result* res) noexcept { delete[] res->output_data; }};
    return evmc::Result{result};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/state.cpp">
```cpp
/// Validates transaction and computes its execution gas limit (the amount of gas provided to EVM).
/// @return  Execution gas limit or transaction validation error.
std::variant<TransactionProperties, std::error_code> validate_transaction(
    const StateView& state_view, const BlockInfo& block, const Transaction& tx, evmc_revision rev,
    int64_t block_gas_left, int64_t blob_gas_left) noexcept
{
    switch (tx.type)  // Validate "special" transaction types.
    {
    case Transaction::Type::blob:
        if (rev < EVMC_CANCUN)
            return make_error_code(TX_TYPE_NOT_SUPPORTED);
        // ... more blob validation
        break;

    // ... other tx types
    default:;
    }
    // ...

    if (tx.gas_limit > block_gas_left)
        return make_error_code(GAS_LIMIT_REACHED);

    if (tx.max_gas_price < block.base_fee)
        return make_error_code(FEE_CAP_LESS_THAN_BLOCKS);

    const auto sender_acc = state_view.get_account(tx.sender).value_or(
        StateView::Account{.code_hash = Account::EMPTY_CODE_HASH});
    
    // ... nonce checks, sender checks ...
    
    // Compute and check if sender has enough balance for the theoretical maximum transaction cost.
    auto max_total_fee = umul(uint256{tx.gas_limit}, tx.max_gas_price);
    max_total_fee += tx.value;
    // ... blob fee calculation ...
    if (sender_acc.balance < max_total_fee)
        return make_error_code(INSUFFICIENT_FUNDS);

    const auto [intrinsic_cost, min_cost] = compute_tx_intrinsic_cost(rev, tx);
    if (tx.gas_limit < std::max(intrinsic_cost, min_cost))
        return make_error_code(INTRINSIC_GAS_TOO_LOW);

    const auto execution_gas_limit = tx.gas_limit - intrinsic_cost;
    return TransactionProperties{execution_gas_limit, min_cost};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/block.cpp">
```cpp
uint64_t calc_base_fee(
    int64_t parent_gas_limit, int64_t parent_gas_used, uint64_t parent_base_fee) noexcept
{
    auto parent_gas_target = parent_gas_limit / GAS_LIMIT_ELASTICITY_MULTIPLIER;

    // Special logic for block activating EIP-1559 is not implemented, because test don't cover it.
    if (parent_gas_used == parent_gas_target)
    {
        return parent_base_fee;
    }
    else if (parent_gas_used > parent_gas_target)
    {
        const auto gas_used_delta = parent_gas_used - parent_gas_target;
        const auto base_fee_delta =
            std::max(intx::uint256{parent_base_fee} * gas_used_delta / parent_gas_target /
                         BASE_FEE_MAX_CHANGE_DENOMINATOR,
                intx::uint256{1});
        return parent_base_fee + static_cast<uint64_t>(base_fee_delta);
    }
    else
    {
        const auto gas_used_delta = parent_gas_target - parent_gas_used;
        const auto base_fee_delta = intx::uint256{parent_base_fee} * gas_used_delta /
                                    parent_gas_target / BASE_FEE_MAX_CHANGE_DENOMINATOR;
        return parent_base_fee - static_cast<uint64_t>(base_fee_delta);
    }
}

intx::uint256 compute_blob_gas_price(evmc_revision rev, uint64_t excess_blob_gas) noexcept
{
    /// A helper function approximating `factor * e ** (numerator / denominator)`.
    /// https://eips.ethereum.org/EIPS/eip-4844#helpers
    static constexpr auto fake_exponential = [](uint64_t factor, uint64_t numerator,
                                                 uint64_t denominator) noexcept {
        // ... implementation ...
    };

    static constexpr auto MIN_BLOB_GASPRICE = 1;
    const uint64_t blob_gasprice_update_fraction = rev >= EVMC_PRAGUE ?
                                                       BLOB_GASPRICE_UPDATE_FRACTION_PRAGUE :
                                                       BLOB_GASPRICE_UPDATE_FRACTION_CANCUN;
    return fake_exponential(MIN_BLOB_GASPRICE, excess_blob_gas, blob_gasprice_update_fraction);
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/utils/utils.cpp">
```cpp
evmc_revision to_rev(std::string_view s)
{
    if (s == "Frontier")
        return EVMC_FRONTIER;
    if (s == "Homestead")
        return EVMC_HOMESTEAD;
    if (s == "Tangerine Whistle" || s == "EIP150")
        return EVMC_TANGERINE_WHISTLE;
    if (s == "Spurious Dragon" || s == "EIP158")
        return EVMC_SPURIOUS_DRAGON;
    if (s == "Byzantium")
        return EVMC_BYZANTIUM;
    if (s == "Constantinople")
        return EVMC_CONSTANTINOPLE;
    if (s == "Petersburg" || s == "ConstantinopleFix")
        return EVMC_PETERSBURG;
    if (s == "Istanbul")
        return EVMC_ISTANBUL;
    if (s == "Berlin")
        return EVMC_BERLIN;
    if (s == "London" || s == "ArrowGlacier")
        return EVMC_LONDON;
    if (s == "Paris" || s == "Merge")
        return EVMC_PARIS;
    if (s == "Shanghai")
        return EVMC_SHANGHAI;
    if (s == "Cancun")
        return EVMC_CANCUN;
    if (s == "Prague")
        return EVMC_PRAGUE;
    if (s == "Osaka")
        return EVMC_OSAKA;
    if (s == "EOFv1")
        return EVMC_EXPERIMENTAL;
    if (s == "Experimental")
        return EVMC_EXPERIMENTAL;
    throw std::invalid_argument{"unknown revision: " + std::string{s}};
}
```
</file>
</evmone>
## Prompt Corrections

The provided Zig specification is excellent and very detailed. It serves as a strong blueprint for the desired framework. One minor correction and clarification based on `evmone`'s design:

1.  **Hardfork Schedule vs. Chain Rules**: The prompt uses `HardforkSchedule` to manage activation blocks. In `evmone`, this is combined with the concept of `ChainRules` (or revision feature flags). A hardfork name (e.g., "Cancun") implies a set of features. The `gas_costs` table and `traits` table in `instructions_traits.hpp` are good examples of this, where behavior is keyed by the `evmc_revision` enum. It would be beneficial to combine these concepts: the `HardforkSchedule` determines the active `evmc_revision` for a given block/timestamp, and that `evmc_revision` is then used to look up the correct opcodes, gas costs, and feature flags. Your proposed `HardforkSchedule.is_active()` method already aligns with this.

2.  **Consensus Rules**: The `ConsensusRules` struct in the prompt is quite comprehensive, covering aspects like difficulty adjustment and reward distribution. It's important to note that `evmone` is an EVM *execution* library and does not implement a full consensus engine. Its "consensus" logic is limited to what's needed for state transition, such as EIP-1559 base fee calculations (`test/state/block.cpp`). The provided `evmone` snippets will help with the *execution-related* aspects of your consensus rules (like transaction validation), but you will need to look at full client implementations (e.g., Geth, Erigon) for inspiration on the broader consensus mechanisms.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/primitives/src/hardfork.rs">
```rust
//! Specification IDs and their activation block
///
/// Information was obtained from the [Ethereum Execution Specifications](https://github.com/ethereum/execution-specs).
#[repr(u8)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, PartialOrd, Ord, Hash, TryFromPrimitive)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum SpecId {
    /// Frontier hard fork
    /// Activated at block 0
    FRONTIER = 0,
    /// Frontier Thawing hard fork
    /// Activated at block 200000
    FRONTIER_THAWING,
    /// Homestead hard fork
    /// Activated at block 1150000
    HOMESTEAD,
    /// DAO Fork hard fork
    /// Activated at block 1920000
    DAO_FORK,
    /// Tangerine Whistle hard fork
    /// Activated at block 2463000
    TANGERINE,
    /// Spurious Dragon hard fork
    /// Activated at block 2675000
    SPURIOUS_DRAGON,
    /// Byzantium hard fork
    /// Activated at block 4370000
    BYZANTIUM,
    /// Constantinople hard fork
    /// Activated at block 7280000 is overwritten with PETERSBURG
    CONSTANTINOPLE,
    /// Petersburg hard fork
    /// Activated at block 7280000
    PETERSBURG,
    /// Istanbul hard fork
    /// Activated at block 9069000
    ISTANBUL,
    /// Muir Glacier hard fork
    /// Activated at block 9200000
    MUIR_GLACIER,
    /// Berlin hard fork
    /// Activated at block 12244000
    BERLIN,
    /// London hard fork
    /// Activated at block 12965000
    LONDON,
    /// Arrow Glacier hard fork
    /// Activated at block 13773000
    ARROW_GLACIER,
    /// Gray Glacier hard fork
    /// Activated at block 15050000
    GRAY_GLACIER,
    /// Paris/Merge hard fork
    /// Activated at block 15537394 (TTD: 58750000000000000000000)
    MERGE,
    /// Shanghai hard fork
    /// Activated at block 17034870 (Timestamp: 1681338455)
    SHANGHAI,
    /// Cancun hard fork
    /// Activated at block 19426587 (Timestamp: 1710338135)
    CANCUN,
    /// Prague hard fork
    /// Activated at block 22431084 (Timestamp: 1746612311)
    #[default]
    PRAGUE,
    /// Osaka hard fork
    /// Activated at block TBD
    OSAKA,
}

impl SpecId {
    /// Returns the [`SpecId`] for the given [`u8`].
    #[inline]
    pub fn try_from_u8(spec_id: u8) -> Option<Self> {
        Self::try_from(spec_id).ok()
    }

    /// Returns `true` if the given specification ID is enabled in this spec.
    #[inline]
    pub const fn is_enabled_in(self, other: Self) -> bool {
        self as u8 >= other as u8
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/cfg.rs">
```rust
//! This module contains [`CfgEnv`] and implements [`Cfg`] trait for it.
pub use context_interface::Cfg;

use primitives::{eip170::MAX_CODE_SIZE, hardfork::SpecId};

/// EVM configuration
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
#[non_exhaustive]
pub struct CfgEnv<SPEC = SpecId> {
    /// Chain ID of the EVM
    ///
    /// `chain_id` will be compared to the transaction's Chain ID.
    ///
    /// Chain ID is introduced EIP-155.
    pub chain_id: u64,
    /// Specification for EVM represent the hardfork
    pub spec: SPEC,
    /// If some it will effects EIP-170: Contract code size limit.
    ///
    /// Useful to increase this because of tests.
    ///
    /// By default it is `0x6000` (~25kb).
    pub limit_contract_code_size: Option<usize>,
    /// Skips the nonce validation against the account's nonce
    pub disable_nonce_check: bool,
    /// Blob max count. EIP-7840 Add blob schedule to EL config files.
    ///
    /// If this config is not set, the check for max blobs will be skipped.
    pub blob_max_count: Option<u64>,
    /// Blob base fee update fraction. EIP-4844 Blob base fee update fraction.
    ///
    /// If this config is not set, the blob base fee update fraction will be set to the default value.
    /// See also [CfgEnv::blob_base_fee_update_fraction].
    ///
    /// Default values for Cancun is [`primitives::eip4844::BLOB_BASE_FEE_UPDATE_FRACTION_CANCUN`]
    /// and for Prague is [`primitives::eip4844::BLOB_BASE_FEE_UPDATE_FRACTION_PRAGUE`].
    pub blob_base_fee_update_fraction: Option<u64>,
    /// A hard memory limit in bytes beyond which
    /// [OutOfGasError::Memory][context_interface::result::OutOfGasError::Memory] cannot be resized.
    ///
    /// In cases where the gas limit may be extraordinarily high, it is recommended to set this to
    /// a sane value to prevent memory allocation panics.
    ///
    /// Defaults to `2^32 - 1` bytes per EIP-1985.
    #[cfg(feature = "memory_limit")]
    pub memory_limit: u64,
    /// Skip balance checks if `true`
    ///
    /// Adds transaction cost to balance to ensure execution doesn't fail.
    ///
    /// By default, it is set to `false`.
    #[cfg(feature = "optional_balance_check")]
    pub disable_balance_check: bool,
    /// There are use cases where it's allowed to provide a gas limit that's higher than a block's gas limit.
    ///
    /// To that end, you can disable the block gas limit validation.
    ///
    /// By default, it is set to `false`.
    #[cfg(feature = "optional_block_gas_limit")]
    pub disable_block_gas_limit: bool,
    /// EIP-3607 rejects transactions from senders with deployed code
    ///
    /// In development, it can be desirable to simulate calls from contracts, which this setting allows.
    ///
    /// By default, it is set to `false`.
    #[cfg(feature = "optional_eip3607")]
    pub disable_eip3607: bool,
    /// Disables base fee checks for EIP-1559 transactions
    ///
    /// This is useful for testing method calls with zero gas price.
    ///
    /// By default, it is set to `false`.
    #[cfg(feature = "optional_no_base_fee")]
    pub disable_base_fee: bool,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
use cfg_if::cfg_if;
use core::hash::Hash;
use once_cell::race::OnceBox;
use primitives::{hardfork::SpecId, Address, HashMap, HashSet};
use std::{boxed::Box, vec::Vec};

/// Precompiles contain map of precompile addresses to functions and HashSet of precompile addresses.
#[derive(Clone, Default, Debug)]
pub struct Precompiles {
    /// Precompiles
    inner: HashMap<Address, PrecompileFn>,
    /// Addresses of precompile
    addresses: HashSet<Address>,
}

impl Precompiles {
    /// Returns the precompiles for the given spec.
    pub fn new(spec: PrecompileSpecId) -> &'static Self {
        match spec {
            PrecompileSpecId::HOMESTEAD => Self::homestead(),
            PrecompileSpecId::BYZANTIUM => Self::byzantium(),
            PrecompileSpecId::ISTANBUL => Self::istanbul(),
            PrecompileSpecId::BERLIN => Self::berlin(),
            PrecompileSpecId::CANCUN => Self::cancun(),
            PrecompileSpecId::PRAGUE => Self::prague(),
            PrecompileSpecId::OSAKA => Self::osaka(),
        }
    }

    /// Returns precompiles for Homestead spec.
    pub fn homestead() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Precompiles::default();
            precompiles.extend([
                secp256k1::ECRECOVER,
                hash::SHA256,
                hash::RIPEMD160,
                identity::FUN,
            ]);
            Box::new(precompiles)
        })
    }

    /// Returns precompiles for Byzantium spec.
    pub fn byzantium() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::homestead().clone();
            precompiles.extend([
                // EIP-198: Big integer modular exponentiation.
                modexp::BYZANTIUM,
                // EIP-196: Precompiled contracts for addition and scalar multiplication on the elliptic curve alt_bn128.
                // EIP-197: Precompiled contracts for optimal ate pairing check on the elliptic curve alt_bn128.
                bn128::add::BYZANTIUM,
                bn128::mul::BYZANTIUM,
                bn128::pair::BYZANTIUM,
            ]);
            Box::new(precompiles)
        })
    }

    /// Returns precompiles for Istanbul spec.
    pub fn istanbul() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::byzantium().clone();
            precompiles.extend([
                // EIP-1108: Reduce alt_bn128 precompile gas costs.
                bn128::add::ISTANBUL,
                bn128::mul::ISTANBUL,
                bn128::pair::ISTANBUL,
                // EIP-152: Add BLAKE2 compression function `F` precompile.
                blake2::FUN,
            ]);
            Box::new(precompiles)
        })
    }

    /// Returns precompiles for Berlin spec.
    pub fn berlin() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::istanbul().clone();
            precompiles.extend([
                // EIP-2565: ModExp Gas Cost.
                modexp::BERLIN,
            ]);
            Box::new(precompiles)
        })
    }

    /// Returns precompiles for Cancun spec.
    ///
    /// If the `c-kzg` feature is not enabled KZG Point Evaluation precompile will not be included,
    /// effectively making this the same as Berlin.
    pub fn cancun() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::berlin().clone();

            // EIP-4844: Shard Blob Transactions
            cfg_if! {
                if #[cfg(any(feature = "c-kzg", feature = "kzg-rs"))] {
                    let precompile = kzg_point_evaluation::POINT_EVALUATION.clone();
                } else {
                    let precompile = PrecompileWithAddress(u64_to_address(0x0A), |_,_| Err(PrecompileError::Fatal("c-kzg feature is not enabled".into())));
                }
            }


            precompiles.extend([
                precompile,
            ]);

            Box::new(precompiles)
        })
    }
//...
}

/// Ethereum hardfork spec ids. Represents the specs where precompiles had a change.
#[derive(Copy, Clone, Debug, PartialEq, Eq, Hash, Ord, PartialOrd)]
pub enum PrecompileSpecId {
    /// Frontier spec.
    HOMESTEAD,
    /// Byzantium spec introduced
    /// * [EIP-198](https://eips.ethereum.org/EIPS/eip-198) a EIP-198: Big integer modular exponentiation (at 0x05 address).
    /// * [EIP-196](https://eips.ethereum.org/EIPS/eip-196) a bn_add (at 0x06 address) and bn_mul (at 0x07 address) precompile
    /// * [EIP-197](https://eips.ethereum.org/EIPS/eip-197) a bn_pair (at 0x08 address) precompile
    BYZANTIUM,
    /// Istanbul spec introduced
    /// * [`EIP-152: Add BLAKE2 compression function`](https://eips.ethereum.org/EIPS/eip-152) `F` precompile (at 0x09 address).
    /// * [`EIP-1108: Reduce alt_bn128 precompile gas costs`](https://eips.ethereum.org/EIPS/eip-1108). It reduced the
    ///   gas cost of the bn_add, bn_mul, and bn_pair precompiles.
    ISTANBUL,
    /// Berlin spec made a change to:
    /// * [`EIP-2565: ModExp Gas Cost`](https://eips.ethereum.org/EIPS/eip-2565). It changed the gas cost of the modexp precompile.
    BERLIN,
    /// Cancun spec added
    /// * [`EIP-4844: Shard Blob Transactions`](https://eips.ethereum.org/EIPS/eip-4844). It added the KZG point evaluation precompile (at 0x0A address).
    CANCUN,
    /// Prague spec added bls precompiles [`EIP-2537: Precompile for BLS12-381 curve operations`](https://eips.ethereum.org/EIPS/eip-2537).
    /// * `BLS12_G1ADD` at address 0x0b
    /// * `BLS12_G1MSM` at address 0x0c
    /// * `BLS12_G2ADD` at address 0x0d
    /// * `BLS12_G2MSM` at address 0x0e
    /// * `BLS12_PAIRING_CHECK` at address 0x0f
    /// * `BLS12_MAP_FP_TO_G1` at address 0x10
    /// * `BLS12_MAP_FP2_TO_G2` at address 0x11
    PRAGUE,
    /// Osaka spec added changes to modexp precompile:
    /// * [`EIP-7823: Set upper bounds for MODEXP`](https://eips.ethereum.org/EIPS/eip-7823).
    /// * [`EIP-7883: ModExp Gas Cost Increase`](https://eips.ethereum.org/EIPS/eip-7883)
    OSAKA,
}

impl From<SpecId> for PrecompileSpecId {
    fn from(spec_id: SpecId) -> Self {
        Self::from_spec_id(spec_id)
    }
}

impl PrecompileSpecId {
    /// Returns the appropriate precompile Spec for the primitive [SpecId].
    pub const fn from_spec_id(spec_id: primitives::hardfork::SpecId) -> Self {
        use primitives::hardfork::SpecId::*;
        match spec_id {
            FRONTIER | FRONTIER_THAWING | HOMESTEAD | DAO_FORK | TANGERINE | SPURIOUS_DRAGON => {
                Self::HOMESTEAD
            }
            BYZANTIUM | CONSTANTINOPLE | PETERSBURG => Self::BYZANTIUM,
            ISTANBUL | MUIR_GLACIER => Self::ISTANBUL,
            BERLIN | LONDON | ARROW_GLACIER | GRAY_GLACIER | MERGE | SHANGHAI => Self::BERLIN,
            CANCUN => Self::CANCUN,
            PRAGUE => Self::PRAGUE,
            OSAKA => Self::OSAKA,
        }
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions.rs">
```rust
//! EVM opcode implementations.

#[macro_use]
pub mod macros;
// ... other modules

use crate::{interpreter_types::InterpreterTypes, Host, InstructionContext};

/// EVM opcode function signature.
pub type Instruction<W, H> = fn(InstructionContext<'_, H, W>);

/// Instruction table is list of instruction function pointers mapped to 256 EVM opcodes.
pub type InstructionTable<W, H> = [Instruction<W, H>; 256];

/// Returns the instruction table for the given spec.
pub const fn instruction_table<WIRE: InterpreterTypes, H: Host + ?Sized>(
) -> [Instruction<WIRE, H>; 256] {
    use bytecode::opcode::*;
    let mut table = [control::unknown as Instruction<WIRE, H>; 256];

    table[STOP as usize] = control::stop;
    table[ADD as usize] = arithmetic::add;
    table[MUL as usize] = arithmetic::mul;
    // ... more opcodes
    table[SHL as usize] = bitwise::shl;
    table[SHR as usize] = bitwise::shr;
    table[SAR as usize] = bitwise::sar;
    // ... more opcodes
    table[PUSH0 as usize] = stack::push0;
    table[PUSH1 as usize] = stack::push::<1, _, _>;
    // ... more push opcodes
    table[PUSH32 as usize] = stack::push::<32, _, _>;
    // ... more opcodes
    table[CREATE as usize] = contract::create::<_, false, _>;
    table[CALL as usize] = contract::call;
    // ... more opcodes
    table
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/bitwise.rs">
```rust
// ...

/// EIP-145: Bitwise shifting instructions in EVM
pub fn shl<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CONSTANTINOPLE);
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    let shift = as_usize_saturated!(op1);
    *op2 = if shift < 256 {
        *op2 << shift
    } else {
        U256::ZERO
    }
}

/// EIP-145: Bitwise shifting instructions in EVM
pub fn shr<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CONSTANTINOPLE);
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);

    let shift = as_usize_saturated!(op1);
    *op2 = if shift < 256 {
        *op2 >> shift
    } else {
        U256::ZERO
    }
}
//...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/calc.rs">
```rust
use super::constants::*;
use crate::{num_words, tri, SStoreResult, SelfDestructResult, StateLoad};
use context_interface::{
    journaled_state::AccountLoad, transaction::AccessListItemTr as _, Transaction, TransactionType,
};
use primitives::{eip7702, hardfork::SpecId, U256};


// ...

/// `SLOAD` opcode cost calculation.
#[inline]
pub const fn sload_cost(spec_id: SpecId, is_cold: bool) -> u64 {
    if spec_id.is_enabled_in(SpecId::BERLIN) {
        if is_cold {
            COLD_SLOAD_COST
        } else {
            WARM_STORAGE_READ_COST
        }
    } else if spec_id.is_enabled_in(SpecId::ISTANBUL) {
        // EIP-1884: Repricing for trie-size-dependent opcodes
        ISTANBUL_SLOAD_GAS
    } else if spec_id.is_enabled_in(SpecId::TANGERINE) {
        // EIP-150: Gas cost changes for IO-heavy operations
        200
    } else {
        50
    }
}

/// `SSTORE` opcode cost calculation.
#[inline]
pub fn sstore_cost(spec_id: SpecId, vals: &SStoreResult, is_cold: bool) -> u64 {
    if spec_id.is_enabled_in(SpecId::BERLIN) {
        // Berlin specification logic
        let mut gas_cost = istanbul_sstore_cost::<WARM_STORAGE_READ_COST, WARM_SSTORE_RESET>(vals);

        if is_cold {
            gas_cost += COLD_SLOAD_COST;
        }
        gas_cost
    } else if spec_id.is_enabled_in(SpecId::ISTANBUL) {
        // Istanbul logic
        istanbul_sstore_cost::<ISTANBUL_SLOAD_GAS, SSTORE_RESET>(vals)
    } else {
        // Frontier logic
        frontier_sstore_cost(vals)
    }
}

/// EIP-2200: Structured Definitions for Net Gas Metering
#[inline]
fn istanbul_sstore_cost<const SLOAD_GAS: u64, const SSTORE_RESET_GAS: u64>(
    vals: &SStoreResult,
) -> u64 {
    if vals.is_new_eq_present() {
        SLOAD_GAS
    } else if vals.is_original_eq_present() && vals.is_original_zero() {
        SSTORE_SET
    } else if vals.is_original_eq_present() {
        SSTORE_RESET_GAS
    } else {
        SLOAD_GAS
    }
}

// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/handler.rs">
```rust
// ...
/// The main implementation of Ethereum Mainnet transaction execution.
///
/// The [`Handler::run`] method serves as the entry point for execution and provides
/// out-of-the-box support for executing Ethereum mainnet transactions.
///
/// This trait allows EVM variants to customize execution logic by implementing
/// their own method implementations.
///
/// The handler logic consists of four phases:
///   * Validation - Validates tx/block/config fields and loads caller account and validates initial gas requirements and
///     balance checks.
///   * Pre-execution - Loads and warms accounts, deducts initial gas
///   * Execution - Executes the main frame loop, delegating to [`Frame`] for sub-calls
///   * Post-execution - Calculates final refunds, validates gas floor, reimburses caller,
///     and rewards beneficiary
///
///
/// The [`Handler::catch_error`] method handles cleanup of intermediate state if an error
/// occurs during execution.
pub trait Handler {
    /// The EVM type containing Context, Instruction, and Precompiles implementations.
    type Evm: EvmTr<Context: ContextTr<Journal: JournalTr<State = EvmState>>>;
    /// The error type returned by this handler.
    type Error: EvmTrError<Self::Evm>;
    /// The Frame type containing data for frame execution. Supports Call, Create and EofCreate frames.
    // TODO `FrameResult` should be a generic trait.
    // TODO `FrameInit` should be a generic.
    type Frame: Frame<
        Evm = Self::Evm,
        Error = Self::Error,
        FrameResult = FrameResult,
        FrameInit = FrameInput,
    >;
    /// The halt reason type included in the output
    type HaltReason: HaltReasonTr;

    /// The main entry point for transaction execution.
    #[inline]
    fn run(
        &mut self,
        evm: &mut Self::Evm,
    ) -> Result<ExecutionResult<Self::HaltReason>, Self::Error> {
        // Run inner handler and catch all errors to handle cleanup.
        match self.run_without_catch_error(evm) {
            Ok(output) => Ok(output),
            Err(e) => self.catch_error(evm, e),
        }
    }
    
    // ...
    /// Validates the execution environment and transaction parameters.
    #[inline]
    fn validate(&self, evm: &mut Self::Evm) -> Result<InitialAndFloorGas, Self::Error> { ... }

    /// Prepares the EVM state for execution.
    #[inline]
    fn pre_execution(&self, evm: &mut Self::Evm) -> Result<u64, Self::Error> { ... }

    /// Creates and executes the initial frame, then processes the execution loop.
    #[inline]
    fn execution(
        &mut self,
        evm: &mut Self::Evm,
        init_and_floor_gas: &InitialAndFloorGas,
    ) -> Result<FrameResult, Self::Error> { ... }

    /// Handles the final steps of transaction execution.
    #[inline]
    fn post_execution(
        &self,
        evm: &mut Self::Evm,
        exec_result: &mut FrameResult,
        init_and_floor_gas: InitialAndFloorGas,
        eip7702_gas_refund: i64,
    ) -> Result<(), Self::Error> { ... }

    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/validation.rs">
```rust
// ...
/// Validate transaction against block and configuration for mainnet.
pub fn validate_tx_env<CTX: ContextTr, Error>(
    context: CTX,
    spec_id: SpecId,
) -> Result<(), InvalidTransaction> {
    // Check if the transaction's chain id is correct
    let tx_type = context.tx().tx_type();
    let tx = context.tx();

    let base_fee = if context.cfg().is_base_fee_check_disabled() {
        None
    } else {
        Some(context.block().basefee() as u128)
    };

    match TransactionType::from(tx_type) {
        TransactionType::Legacy => {
            // Check chain_id only if it is present in the legacy transaction.
            // EIP-155: Simple replay attack protection
            if let Some(chain_id) = tx.chain_id() {
                if chain_id != context.cfg().chain_id() {
                    return Err(InvalidTransaction::InvalidChainId);
                }
            }
            // Gas price must be at least the basefee.
            if let Some(base_fee) = base_fee {
                if tx.gas_price() < base_fee {
                    return Err(InvalidTransaction::GasPriceLessThanBasefee);
                }
            }
        }
        TransactionType::Eip2930 => {
            // Enabled in BERLIN hardfork
            if !spec_id.is_enabled_in(SpecId::BERLIN) {
                return Err(InvalidTransaction::Eip2930NotSupported);
            }
            // ...
        }
        TransactionType::Eip1559 => {
            if !spec_id.is_enabled_in(SpecId::LONDON) {
                return Err(InvalidTransaction::Eip1559NotSupported);
            }
            // ...
        }
        TransactionType::Eip4844 => {
            if !spec_id.is_enabled_in(SpecId::CANCUN) {
                return Err(InvalidTransaction::Eip4844NotSupported);
            }
            // ...
        }
        // ...
    };

    // Check if gas_limit is more than block_gas_limit
    if !context.cfg().is_block_gas_limit_disabled() && tx.gas_limit() > context.block().gas_limit()
    {
        return Err(InvalidTransaction::CallerGasLimitMoreThanBlock);
    }

    // EIP-3860: Limit and meter initcode
    if spec_id.is_enabled_in(SpecId::SHANGHAI) && tx.kind().is_create() {
        let max_initcode_size = context.cfg().max_code_size().saturating_mul(2);
        if context.tx().input().len() > max_initcode_size {
            return Err(InvalidTransaction::CreateInitCodeSizeLimit);
        }
    }

    Ok(())
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/op-revm/src/precompiles.rs">
```rust
// ...
/// Optimism precompile provider
#[derive(Debug, Clone)]
pub struct OpPrecompiles {
    /// Inner precompile provider is same as Ethereums.
    inner: EthPrecompiles,
    spec: OpSpecId,
}

impl OpPrecompiles {
    /// Create a new precompile provider with the given OpSpec.
    #[inline]
    pub fn new_with_spec(spec: OpSpecId) -> Self {
        let precompiles = match spec {
            spec @ (OpSpecId::BEDROCK
            | OpSpecId::REGOLITH
            | OpSpecId::CANYON
            | OpSpecId::ECOTONE) => Precompiles::new(spec.into_eth_spec().into()),
            OpSpecId::FJORD => fjord(),
            OpSpecId::GRANITE | OpSpecId::HOLOCENE => granite(),
            OpSpecId::ISTHMUS | OpSpecId::INTEROP | OpSpecId::OSAKA => isthmus(),
        };

        Self {
            inner: EthPrecompiles {
                precompiles,
                spec: SpecId::default(),
            },
            spec,
        }
    }
//...
}


/// Returns precompiles for Fjord spec.
pub fn fjord() -> &'static Precompiles {
    static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
    INSTANCE.get_or_init(|| {
        let mut precompiles = Precompiles::cancun().clone();
        // RIP-7212: secp256r1 P256verify
        precompiles.extend([secp256r1::P256VERIFY]);
        Box::new(precompiles)
    })
}

/// Returns precompiles for Granite spec.
pub fn granite() -> &'static Precompiles {
    static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
    INSTANCE.get_or_init(|| {
        let mut precompiles = fjord().clone();
        // Restrict bn256Pairing input size
        precompiles.extend([bn128_pair::GRANITE]);
        Box::new(precompiles)
    })
}
//...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/evm.rs">
```rust
//! This module contains [`Evm`] struct.
use core::fmt::Debug;
use core::ops::{Deref, DerefMut};

/// Main EVM structure that contains all data needed for execution.
#[derive(Debug, Clone)]
pub struct Evm<CTX, INSP, I, P> {
    /// [`context_interface::ContextTr`] of the EVM it is used to fetch data from database.
    pub ctx: CTX,
    /// Inspector of the EVM it is used to inspect the EVM.
    /// Its trait are defined in revm-inspector crate.
    pub inspector: INSP,
    /// Instructions provider of the EVM it is used to execute instructions.
    /// `InstructionProvider` trait is defined in revm-handler crate.
    pub instruction: I,
    /// Precompile provider of the EVM it is used to execute precompiles.
    /// `PrecompileProvider` trait is defined in revm-handler crate.
    pub precompiles: P,
}
//...
```
</file>
</revm>



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
"""
Ethereum Specification
^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Entry point for the Ethereum specification.
"""

from dataclasses import dataclass
from typing import List, Optional, Set, Tuple, Union

from ethereum_rlp import rlp
from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U64, U256, Uint

from ethereum.crypto.hash import Hash32, keccak256
from ethereum.exceptions import (
    EthereumException,
    InvalidBlock,
    InvalidSenderError,
)

from . import vm
from .blocks import Block, Header, Log, Receipt, encode_receipt
from .bloom import logs_bloom
from .fork_types import Address
from .state import (
    State,
    account_exists_and_is_empty,
    create_ether,
    destroy_account,
    destroy_touched_empty_accounts,
    get_account,
    increment_nonce,
    set_account_balance,
    state_root,
)
from .transactions import (
    AccessListTransaction,
    FeeMarketTransaction,
    LegacyTransaction,
    Transaction,
    decode_transaction,
    encode_transaction,
    get_transaction_hash,
    recover_sender,
    validate_transaction,
)
from .trie import root, trie_set
from .utils.message import prepare_message
from .vm.interpreter import process_message_call

BLOCK_REWARD = U256(2 * 10**18)
BASE_FEE_MAX_CHANGE_DENOMINATOR = Uint(8)
ELASTICITY_MULTIPLIER = Uint(2)
# ...
# ...

def state_transition(chain: BlockChain, block: Block) -> None:
    # ...
    validate_header(chain, block.header)
    # ...

    block_env = vm.BlockEnvironment(
        chain_id=chain.chain_id,
        state=chain.state,
        block_gas_limit=block.header.gas_limit,
        block_hashes=get_last_256_block_hashes(chain),
        coinbase=block.header.coinbase,
        number=block.header.number,
        base_fee_per_gas=block.header.base_fee_per_gas,
        time=block.header.timestamp,
        difficulty=block.header.difficulty,
    )

    block_output = apply_body(
        block_env=block_env,
        transactions=block.transactions,
        ommers=block.ommers,
    )
    # ... (validation of roots)

def calculate_base_fee_per_gas(
    block_gas_limit: Uint,
    parent_gas_limit: Uint,
    parent_gas_used: Uint,
    parent_base_fee_per_gas: Uint,
) -> Uint:
    """
    Calculates the base fee per gas for the block.
    """
    parent_gas_target = parent_gas_limit // ELASTICITY_MULTIPLIER
    # ... (base fee adjustment logic)

def validate_header(chain: BlockChain, header: Header) -> None:
    """
    Verifies a block header.
    """
    # ...
    parent_header = chain.blocks[-1].header

    if header.gas_used > header.gas_limit:
        raise InvalidBlock

    expected_base_fee_per_gas = calculate_base_fee_per_gas(
        header.gas_limit,
        parent_header.gas_limit,
        parent_header.gas_used,
        parent_header.base_fee_per_gas,
    )
    if expected_base_fee_per_gas != header.base_fee_per_gas:
        raise InvalidBlock
    # ... (other header validation checks)

def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    """
    Execute a transaction against the provided environment.
    """
    intrinsic_gas = validate_transaction(tx)

    (
        sender,
        effective_gas_price,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )
    # ... (gas deduction, nonce increment)

    tx_env = vm.TransactionEnvironment(
        origin=sender,
        gas_price=effective_gas_price,
        gas=gas,
        access_list_addresses=access_list_addresses,
        access_list_storage_keys=access_list_storage_keys,
        index_in_block=index,
        tx_hash=get_transaction_hash(encode_transaction(tx)),
        traces=[],
    )

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)
    # ... (refunds, fee transfers, etc.)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/__init__.py">
```python
"""
EVM Instruction Encoding (Opcodes)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Machine readable representations of EVM instructions, and a mapping to their
implementations.
"""

import enum
from typing import Callable, Dict

from . import arithmetic as arithmetic_instructions
from . import bitwise as bitwise_instructions
# ... imports for other instruction categories

class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # ... (Opcode definitions)
    ADD = 0x01
    MUL = 0x02
    # ...
    BLOBHASH = 0x49
    BLOBBASEFEE = 0x4A
    # ...
    TLOAD = 0x5C
    TSTORE = 0x5D
    MCOPY = 0x5E
    PUSH0 = 0x5F
    # ...

op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    Ops.MUL: arithmetic_instructions.mul,
    # ... (mapping of opcodes to functions)
    Ops.SELFBALANCE: environment_instructions.self_balance,
    Ops.BASEFEE: environment_instructions.base_fee,
    Ops.BLOBHASH: environment_instructions.blob_hash,
    Ops.BLOBBASEFEE: environment_instructions.blob_base_fee,
    Ops.SSTORE: storage_instructions.sstore,
    Ops.TLOAD: storage_instructions.tload,
    Ops.TSTORE: storage_instructions.tstore,
    # ...
    Ops.MCOPY: memory_instructions.mcopy,
    Ops.PUSH0: stack_instructions.push0,
    # ...
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
"""
Ethereum Virtual Machine (EVM) Gas
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

EVM gas constants and calculators.
"""
from dataclasses import dataclass
from typing import List, Tuple

from ethereum_types.numeric import U64, U256, Uint

from ethereum.trace import GasAndRefund, evm_trace
from ethereum.utils.numeric import ceil32, taylor_exponential

from ..blocks import Header
from ..transactions import BlobTransaction, Transaction
from . import Evm
from .exceptions import OutOfGasError

GAS_JUMPDEST = Uint(1)
GAS_BASE = Uint(2)
GAS_VERY_LOW = Uint(3)
# ... (many gas constants)
GAS_COLD_SLOAD = Uint(2100)
GAS_COLD_ACCOUNT_ACCESS = Uint(2600)
GAS_WARM_ACCESS = Uint(100)
GAS_INIT_CODE_WORD_COST = Uint(2)
GAS_BLOBHASH_OPCODE = Uint(3)
GAS_POINT_EVALUATION = Uint(50000)

TARGET_BLOB_GAS_PER_BLOCK = U64(393216)
GAS_PER_BLOB = U64(2**17)
MIN_BLOB_GASPRICE = Uint(1)
BLOB_BASE_FEE_UPDATE_FRACTION = Uint(3338477)


@dataclass
class ExtendMemory:
    """
    Define the parameters for memory extension in opcodes

    `cost`: `ethereum.base_types.Uint`
        The gas required to perform the extension
    `expand_by`: `ethereum.base_types.Uint`
        The size by which the memory will be extended
    """

    cost: Uint
    expand_by: Uint


def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.
    """
    # ...
    if evm.gas_left < amount:
        raise OutOfGasError
    else:
        evm.gas_left -= amount

# ...

def calculate_message_call_gas(
    value: U256,
    gas: Uint,
    gas_left: Uint,
    memory_cost: Uint,
    extra_gas: Uint,
    call_stipend: Uint = GAS_CALL_STIPEND,
) -> MessageCallGas:
# ...

def max_message_call_gas(gas: Uint) -> Uint:
# ...

def init_code_cost(init_code_length: Uint) -> Uint:
# ...

def calculate_excess_blob_gas(parent_header: Header) -> U64:
# ...

def calculate_total_blob_gas(tx: Transaction) -> U64:
# ...

def calculate_blob_gas_price(excess_blob_gas: U64) -> Uint:
# ...

def calculate_data_fee(excess_blob_gas: U64, tx: Transaction) -> Uint:
# ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/precompiled_contracts/mapping.py">
```python
"""
Precompiled Contract Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Mapping of precompiled contracts their implementations.
"""
from typing import Callable, Dict

from ...fork_types import Address
from . import (
    ALT_BN128_ADD_ADDRESS,
    ALT_BN128_MUL_ADDRESS,
    ALT_BN128_PAIRING_CHECK_ADDRESS,
    BLAKE2F_ADDRESS,
    ECRECOVER_ADDRESS,
    IDENTITY_ADDRESS,
    MODEXP_ADDRESS,
    POINT_EVALUATION_ADDRESS,
    RIPEMD160_ADDRESS,
    SHA256_ADDRESS,
)
from .alt_bn128 import alt_bn128_add, alt_bn128_mul, alt_bn128_pairing_check
from .blake2f import blake2f
from .ecrecover import ecrecover
from .identity import identity
from .modexp import modexp
from .point_evaluation import point_evaluation
from .ripemd160 import ripemd160
from .sha256 import sha256

PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
    MODEXP_ADDRESS: modexp,
    ALT_BN128_ADD_ADDRESS: alt_bn128_add,
    ALT_BN128_MUL_ADDRESS: alt_bn128_mul,
    ALT_BN128_PAIRING_CHECK_ADDRESS: alt_bn128_pairing_check,
    BLAKE2F_ADDRESS: blake2f,
    POINT_EVALUATION_ADDRESS: point_evaluation,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum_spec_tools/forks.py">
```python
"""
Ethereum Forks
^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Detects Python packages that specify Ethereum hardforks.
"""
# ... imports ...
class Hardfork:
    """
    Metadata associated with an Ethereum hardfork.
    """

    mod: ModuleType

    @classmethod
    def discover(cls: Type[H], base: Optional[PurePath] = None) -> List[H]:
        """
        Find packages which contain Ethereum hardfork specifications.
        """
        # ... logic to discover fork modules ...

    @classmethod
    def load_from_json(cls: Type[H], json: Any) -> List[H]:
        """
        Load fork config from the json format used by Geth.
        """
        from ethereum.fork_criteria import ByBlockNumber, ByTimestamp

        c = json["config"]
        config = {
            ByBlockNumber(0): "frontier",
            ByBlockNumber(c["homesteadBlock"]): "homestead",
            ByBlockNumber(c["eip150Block"]): "tangerine_whistle",
            ByBlockNumber(c["eip155Block"]): "spurious_dragon",
            ByBlockNumber(c["byzantiumBlock"]): "byzantium",
            ByBlockNumber(c["constantinopleBlock"]): "constantinople",
            ByBlockNumber(c["istanbulBlock"]): "istanbul",
            ByBlockNumber(c["berlinBlock"]): "berlin",
            ByBlockNumber(c["londonBlock"]): "london",
            ByBlockNumber(c["mergeForkBlock"]): "paris",
            ByTimestamp(c["shanghaiTime"]): "shanghai",
        }
        # ...
        return cls.load(config)

    def has_activated(self, block_number: Uint, timestamp: U256) -> bool:
        """
        Check whether this fork has activated.
        """
        return self.criteria.check(block_number, timestamp)

    # ... other properties and methods ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/berlin/transactions.py">
```python
"""
Transactions are atomic units of work created externally to Ethereum and
submitted to be executed. If Ethereum is viewed as a state machine,
transactions are the events that move between states.
"""
from dataclasses import dataclass
from typing import Tuple, Union

from ethereum_rlp import rlp
# ...
from .exceptions import TransactionTypeError
from .fork_types import Address

TX_BASE_COST = Uint(21000)
TX_DATA_COST_PER_NON_ZERO = Uint(16)
TX_DATA_COST_PER_ZERO = Uint(4)
TX_CREATE_COST = Uint(32000)
TX_ACCESS_LIST_ADDRESS_COST = Uint(2400)
TX_ACCESS_LIST_STORAGE_KEY_COST = Uint(1900)


@slotted_freezable
@dataclass
class LegacyTransaction:
    # ...

@slotted_freezable
@dataclass
class Access:
    # ...

@slotted_freezable
@dataclass
class AccessListTransaction:
    """
    The transaction type added in EIP-2930 to support access lists.
    """

    chain_id: U64
    nonce: U256
    gas_price: Uint
    gas: Uint
    to: Union[Bytes0, Address]
    value: U256
    data: Bytes
    access_list: Tuple[Access, ...]
    y_parity: U256
    r: U256
    s: U256


Transaction = Union[LegacyTransaction, AccessListTransaction]


def encode_transaction(tx: Transaction) -> Union[LegacyTransaction, Bytes]:
    """
    Encode a transaction. Needed because non-legacy transactions aren't RLP.
    """
    if isinstance(tx, LegacyTransaction):
        return tx
    else:
        return b"\x01" + rlp.encode(tx)


def decode_transaction(tx: Union[LegacyTransaction, Bytes]) -> Transaction:
    """
    Decode a transaction. Needed because non-legacy transactions aren't RLP.
    """
    if isinstance(tx, Bytes):
        if tx[0] == 1:
            return rlp.decode_to(AccessListTransaction, tx[1:])
        else:
            raise TransactionTypeError(tx[0])
    else:
        return tx
```
</file>
</execution-specs>

## Prompt Corrections
The provided prompt outlines a robust and well-structured framework for custom chain implementation. The design is comprehensive and appears to be more abstract and flexible than the `execution-specs` implementation, which is a positive for its intended purpose. There are no direct "errors," but here are some observations on how the `execution-specs` approach differs, which might inform the implementation:

1.  **Hardfork Activation vs. Separate Modules**:
    *   **Prompt**: The prompt uses a `HardforkSchedule` struct to manage a list of `HardforkActivation`s. This is a very clean and data-driven approach, allowing a single `ChainDefinition` to dynamically change its behavior based on block number or timestamp.
    *   **Execution-Specs**: The specs use a more direct approach where each hardfork is a distinct Python package (e.g., `ethereum.london`, `ethereum.cancun`). Code is duplicated and modified between forks. The active fork is determined at a higher level, and the corresponding module is used.
    *   **Recommendation**: The prompt's approach is superior for building a flexible framework that can easily define custom hardfork schedules. The `execution-specs` approach is better for a strict, linear representation of Ethereum's mainnet evolution.

2.  **Opcode and Gas Management**:
    *   **Prompt**: The prompt centralizes opcode definitions in an `OpcodeRegistry` and gas costs in a `GasSchedule`. These are part of the `ChainDefinition` and are configured at runtime. This allows for easy modification of opcodes and gas costs for a custom chain. The `is_available` method on opcodes is a good pattern for this.
    *   **Execution-Specs**: Opcode-to-implementation mappings and gas constants are defined per-fork module (e.g., `.../cancun/vm/instructions/__init__.py` and `.../cancun/vm/gas.py`). This means changing opcodes or gas costs requires forking the entire Python package.
    *   **Recommendation**: The prompt's design is more aligned with the goal of a *custom chain framework*. The `execution-specs` approach is less flexible but provides a clear, versioned history of changes.

3.  **Transaction Types**:
    *   The prompt specifies custom transaction types as a configurable part of `TransactionValidation`. This is a powerful feature for custom chains.
    *   `execution-specs` handles this by introducing new transaction `dataclass`es in each fork that requires them (e.g., `AccessListTransaction` in Berlin, `BlobTransaction` in Cancun). The `decode_transaction` function acts as a dispatcher based on the transaction type byte. This pattern from `.../transactions.py` is a good reference for implementing the custom transaction type validation and decoding logic.

Overall, the prompt's design is more abstract and suited for a "framework" approach than the `execution-specs` direct implementation. The provided specs code is still an excellent reference for the low-level details of how specific opcodes, gas rules, and fork transitions are implemented.

---

An excellent and detailed prompt. Implementing a modular chain framework requires understanding how different consensus rules, opcodes, and gas schedules are managed across various hardforks. The Python `execution-specs` provide a clear, fork-by-fork reference implementation for these concepts.

The following snippets from the `execution-specs` illustrate the core patterns for chain configuration, opcode dispatch, gas scheduling, and state management that you will need to implement this framework.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
# ... other imports
from . import vm
from .transactions import (
    Transaction,
    decode_transaction,
    validate_transaction,
)
from .state import (
    State,
    get_account,
    # ... more state functions
)
# ...

@dataclass
class BlockChain:
    """
    History and current state of the block chain.
    """

    blocks: List[Block]
    state: State
    chain_id: U64


def apply_fork(old: BlockChain) -> BlockChain:
    """
    Transforms the state from the previous hard fork (`old`) into the block
    chain object for this hard fork and returns it.
    ...
    """
    return old


def state_transition(chain: BlockChain, block: Block) -> None:
    """
    Attempts to apply a block to an existing block chain.
    ...
    """
    validate_header(chain, block.header)
    # ...

    block_env = vm.BlockEnvironment(
        chain_id=chain.chain_id,
        state=chain.state,
        block_gas_limit=block.header.gas_limit,
        block_hashes=get_last_256_block_hashes(chain),
        coinbase=block.header.coinbase,
        number=block.header.number,
        base_fee_per_gas=block.header.base_fee_per_gas,
        time=block.header.timestamp,
        difficulty=block.header.difficulty,
    )

    block_output = apply_body(
        block_env=block_env,
        transactions=block.transactions,
        ommers=block.ommers,
    )
    # ... validate block_output against header ...
    
    chain.blocks.append(block)
    # ...


def validate_header(chain: BlockChain, header: Header) -> None:
    """
    Verifies a block header.
    ...
    """
    # ...
    expected_base_fee_per_gas = calculate_base_fee_per_gas(
        header.gas_limit,
        parent_header.gas_limit,
        parent_header.gas_used,
        parent_header.base_fee_per_gas,
    )

    if expected_base_fee_per_gas != header.base_fee_per_gas:
        raise InvalidBlock
    # ...


def apply_body(
    block_env: vm.BlockEnvironment,
    transactions: Tuple[Union[LegacyTransaction, Bytes], ...],
    ommers: Tuple[Header, ...],
) -> vm.BlockOutput:
    """
    Executes a block.
    ...
    """
    block_output = vm.BlockOutput()

    for i, tx in enumerate(map(decode_transaction, transactions)):
        process_transaction(block_env, block_output, tx, Uint(i))

    pay_rewards(block_env.state, block_env.number, block_env.coinbase, ommers)

    return block_output


def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    """
    Execute a transaction against the provided environment.
    ...
    """
    # ...
    intrinsic_gas = validate_transaction(tx)

    (
        sender,
        effective_gas_price,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )
    
    # ... update sender balance, nonce ...

    tx_env = vm.TransactionEnvironment(
        # ...
    )

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    # ... process refunds, fees, and state changes ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/genesis.py">
```python
@slotted_freezable
@dataclass
class GenesisConfiguration:
    """
    Configuration for the first block of an Ethereum chain.
    ...
    """

    chain_id: U64
    difficulty: Uint
    extra_data: Bytes
    gas_limit: Uint
    nonce: Bytes8
    timestamp: U256
    initial_accounts: Dict[str, Dict]


def add_genesis_block(
    hardfork: GenesisFork[
        AddressT, AccountT, StateT, TrieT, BloomT, HeaderT, BlockT
    ],
    chain: Any,
    genesis: GenesisConfiguration,
) -> None:
    """
    Adds the genesis block to an empty blockchain.
    ...
    """
    # ...
    for hex_address, account in genesis.initial_accounts.items():
        address = hardfork.hex_to_address(hex_address)
        hardfork.set_account(
            chain.state,
            address,
            hardfork.Account(
                Uint(int(account.get("nonce", "0"))),
                hex_or_base_10_str_to_u256(account.get("balance", 0)),
                hex_to_bytes(account.get("code", "0x")),
            ),
        )
        for key, value in account.get("storage", {}).items():
            hardfork.set_storage(
                chain.state, address, hex_to_bytes32(key), hex_to_u256(value)
            )
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/fork_criteria.py">
```python
@functools.total_ordering
class ForkCriteria(ABC):
    """
    Abstract base class for conditions specifying when a fork activates.
    ...
    """
    # ...
    @abstractmethod
    def check(self, block_number: Uint, timestamp: U256) -> bool:
        """
        Check whether fork criteria have been met.
        ...
        """
        raise NotImplementedError()


class ByBlockNumber(ForkCriteria):
    """
    Forks that occur when a specific block number has been reached.
    """
    block_number: Uint
    
    @override
    def check(self, block_number: Uint, timestamp: U256) -> bool:
        """
        Check whether the block number has been reached.
        ...
        """
        return block_number >= self.block_number


class ByTimestamp(ForkCriteria):
    """
    Forks that occur when a specific timestamp has been reached.
    """
    timestamp: U256
    
    @override
    def check(self, block_number: Uint, timestamp: U256) -> bool:
        """
        Check whether the timestamp has been reached.
        ...
        """
        return timestamp >= self.timestamp
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/__init__.py">
```python
class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """
    # ...
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    # ...
    PUSH1 = 0x60
    # ...
    DELEGATECALL = 0xF4
    CREATE2 = 0xF5
    STATICCALL = 0xFA
    REVERT = 0xFD
    SELFDESTRUCT = 0xFF


op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    Ops.MUL: arithmetic_instructions.mul,
    Ops.SUB: arithmetic_instructions.sub,
    # ...
    Ops.DELEGATECALL: system_instructions.delegatecall,
    Ops.SELFDESTRUCT: system_instructions.selfdestruct,
    Ops.STATICCALL: system_instructions.staticcall,
    Ops.REVERT: system_instructions.revert,
    Ops.CREATE2: system_instructions.create2,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
GAS_JUMPDEST = Uint(1)
GAS_BASE = Uint(2)
GAS_VERY_LOW = Uint(3)
# ...
GAS_STORAGE_SET = Uint(20000)
GAS_STORAGE_UPDATE = Uint(5000)
GAS_STORAGE_CLEAR_REFUND = Uint(4800)
# ...
GAS_MEMORY = Uint(3)
GAS_KECCAK256 = Uint(30)
GAS_KECCAK256_WORD = Uint(6)
# ...
GAS_CREATE = Uint(32000)
GAS_NEW_ACCOUNT = Uint(25000)
GAS_CALL_VALUE = Uint(9000)
# ...
GAS_COLD_SLOAD = Uint(2100)
GAS_COLD_ACCOUNT_ACCESS = Uint(2600)
GAS_WARM_ACCESS = Uint(100)


@dataclass
class ExtendMemory:
    """
    ...
    """
    cost: Uint
    expand_by: Uint

# ...

def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    ...
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words ** Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/precompiled_contracts/mapping.py">
```python
from typing import Callable, Dict

from ...fork_types import Address
from . import (
    ALT_BN128_ADD_ADDRESS,
    ALT_BN128_MUL_ADDRESS,
    ALT_BN128_PAIRING_CHECK_ADDRESS,
    BLAKE2F_ADDRESS,
    ECRECOVER_ADDRESS,
    IDENTITY_ADDRESS,
    MODEXP_ADDRESS,
    RIPEMD160_ADDRESS,
    SHA256_ADDRESS,
)
from .alt_bn128 import alt_bn128_add, alt_bn128_mul, alt_bn128_pairing_check
from .blake2f import blake2f
from .ecrecover import ecrecover
from .identity import identity
from .modexp import modexp
from .ripemd160 import ripemd160
from .sha256 import sha256

PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
    MODEXP_ADDRESS: modexp,
    ALT_BN128_ADD_ADDRESS: alt_bn128_add,
    ALT_BN128_MUL_ADDRESS: alt_bn128_mul,
    ALT_BN128_PAIRING_CHECK_ADDRESS: alt_bn128_pairing_check,
    BLAKE2F_ADDRESS: blake2f,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
@dataclass
class MessageCallOutput:
    # ...
    gas_left: Uint
    refund_counter: U256
    logs: Tuple[Log, ...]
    accounts_to_delete: Set[Address]
    touched_accounts: Set[Address]
    error: Optional[EthereumException]


def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.
    ...
    """
    # ...
    if message.target == Bytes0(b""):
        # ... contract creation logic ...
        evm = process_create_message(message)
    else:
        evm = process_message(message)
        # ...
    # ...


def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    ...
    """
    # ...
    evm = Evm(
        # ... evm context setup ...
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # ... precompile execution ...
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            # ...
            op_implementation[op](evm)
            # ...

    except ExceptionalHalt as error:
        # ... error handling ...
    # ...
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/transactions.py">
```python
@slotted_freezable
@dataclass
class LegacyTransaction:
    # ...

@slotted_freezable
@dataclass
class AccessListTransaction:
    # ...

@slotted_freezable
@dataclass
class FeeMarketTransaction:
    # ...

@slotted_freezable
@dataclass
class BlobTransaction:
    """
    The transaction type added in EIP-4844.
    """
    chain_id: U64
    nonce: U256
    max_priority_fee_per_gas: Uint
    max_fee_per_gas: Uint
    gas: Uint
    to: Address
    value: U256
    data: Bytes
    access_list: Tuple[Access, ...]
    max_fee_per_blob_gas: U256
    blob_versioned_hashes: Tuple[VersionedHash, ...]
    y_parity: U256
    r: U256
    s: U256

Transaction = Union[
    LegacyTransaction, AccessListTransaction, FeeMarketTransaction, BlobTransaction
]

def encode_transaction(tx: Transaction) -> Union[LegacyTransaction, Bytes]:
    # ...

def decode_transaction(tx: Union[LegacyTransaction, Bytes]) -> Transaction:
    # ...
```
</file>
</execution-specs>
## Prompt Corrections
The original prompt is exceptionally well-structured and detailed. It provides a clear architectural vision for a modular EVM implementation. There are no significant errors, but here are a few minor suggestions for refinement based on the `execution-specs`:

1.  **Hardfork Activation Conditions**: The `HardforkActivation` struct is good. You might consider simplifying the `conditions` field. In the `execution-specs`, a fork is activated either by `block_number` (pre-merge) or `timestamp` (post-merge), but not a complex combination of both. A simpler `union(enum)` for the activation trigger might be sufficient:
    ```zig
    pub const ActivationTrigger = union(enum) {
        BlockNumber: u64,
        Timestamp: u64,
    };
    ```

2.  **State Management**: The prompt separates consensus rules and state transitions. In practice, they are tightly coupled. The `State` object in `execution-specs` uses snapshots (`begin_transaction`, `commit_transaction`, `rollback_transaction`) to manage state reversions, which is a powerful pattern you may want to adopt explicitly in your `StateTransition` or a dedicated `Journal` object.

3.  **Gas Calculation in Opcodes**: The `OpcodeImplementation` struct has `gas_cost` as a union. This is a great pattern. Be aware that some gas costs (like for `CALL` or `SSTORE`) depend on a mix of stack values, memory expansion, and "warmth" of the accessed account/storage slot. The dynamic gas function might need access to more context than just the `ExecutionContext` to calculate these costs correctly, as seen in the `gas.py` files. The `execution-specs` often calculate and charge this dynamic gas within the opcode implementation itself rather than through a separate `GasSchedule` call. Your design centralizes this well, but ensure the context passed to `get_gas_cost` is rich enough.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// Copyright 2015 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package params

import (
	"fmt"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
)

// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own

// unique general configuration.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations gas repricing.
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients as only gas pricing changed)

	// EIP155 implements replay-protected transaction signatures.
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements state clearing for empty accounts.
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = no fork, 0 = already activated)
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// MuirGlacier switch block (nil = no fork, 0 = already on muirglacier)
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on berlin)
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on london)
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// ArrowGlacier switch block (nil = no fork, 0 = already on arrow-glacier)
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// GrayGlacier switch block (nil = no fork, 0 = already on gray-glacier)
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplitBlock defines the block number at which the network splits for the merge.
	// It is used to avert a situation where the network is in trouble and a non-updated node
	// thinks the merge has happened.
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// TerminalTotalDifficulty is the total difficulty at which the network transitions from
	// PoW to PoS.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag that indicates the terminal total difficulty
	// has been reached and the consensus engine should be switched to PoS.
	// This flag is needed to handle reorgs across the TTD and in order to restart a node
	// that is already post-merge.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// ShanghaiTime is the timestamp at which the Shanghai hard-fork activates.
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`
	// CancunTime is the timestamp at which the Cancun hard-fork activates.
	CancunTime *uint64 `json:"cancunTime,omitempty"`
	// PragueTime is the timestamp at which the Prague hard-fork activates.
	PragueTime *uint64 `json:"pragueTime,omitempty"`
	// OsakaTime is the timestamp at which the Osaka hard-fork activates.
	OsakaTime *uint64 `json:"osakaTime,omitempty"`
	// VerkleTime is the timestamp at which the Verkle hard-fork activates.
	VerkleTime *uint64 `json:"verkleTime,omitempty"`

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// IsHomestead returns whether num is either equal to the homestead block or greater.
func (c *ChainConfig) IsHomestead(num *big.Int) bool {
	return isForked(c.HomesteadBlock, num)
}

// IsDAOFork returns whether num is either equal to the DAO fork block or greater.
func (c *ChainConfig) IsDAOFork(num *big.Int) bool {
	return isForked(c.DAOForkBlock, num)
}

// IsEIP150 returns whether num is either equal to the EIP150 fork block or greater.
func (c *ChainConfig) IsEIP150(num *big.Int) bool {
	return isForked(c.EIP150Block, num)
}

// IsEIP155 returns whether num is either equal to the EIP155 fork block or greater.
func (c *ChainConfig) IsEIP155(num *big.Int) bool {
	return isForked(c.EIP155Block, num)
}

// IsEIP158 returns whether num is either equal to the EIP158 fork block or greater.
func (c *ChainConfig) IsEIP158(num *big.Int) bool {
	return isForked(c.EIP158Block, num)
}

// IsByzantium returns whether num is either equal to the Byzantium fork block or greater.
func (c *ChainConfig) IsByzantium(num *big.Int) bool {
	return isForked(c.ByzantiumBlock, num)
}

// IsConstantinople returns whether num is either equal to the Constantinople fork block or greater.
func (c *ChainConfig) IsConstantinople(num *big.Int) bool {
	return isForked(c.ConstantinopleBlock, num)
}

// IsMuirGlacier returns whether num is either equal to the Muir Glacier fork block or greater.
func (c *ChainConfig) IsMuirGlacier(num *big.Int) bool {
	return isForked(c.MuirGlacierBlock, num)
}

// IsBerlin returns whether num is either equal to the Berlin fork block or greater.
func (c *ChainConfig) IsBerlin(num *big.Int) bool {
	return isForked(c.BerlinBlock, num)
}

// IsLondon returns whether num is either equal to the London fork block or greater.
func (c *ChainConfig) IsLondon(num *big.Int) bool {
	return isForked(c.LondonBlock, num)
}

// IsShanghai returns whether the shanghai fork is active at the given time.
func (c *ChainConfig) IsShanghai(num *big.Int, time uint64) bool {
	return isForked(c.LondonBlock, num) && isForkedTS(c.ShanghaiTime, time)
}
// isForked returns whether a fork scheduled at block s is active at the given head block.
func isForked(s, head *big.Int) bool {
	if s == nil || head == nil {
		return false
	}
	return s.Cmp(head) <= 0
}

// isForkedTS returns whether a fork scheduled at timestamp s is active at the given
// head timestamp.
func isForkedTS(s *uint64, head uint64) bool {
	if s == nil {
		return false
	}
	return *s <= head
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

// Package params defines the network parameters for the Ethereum blockchain.
package params

import "math/big"

const (
	// These are the multipliers for call operations.
	//
	// Note: This is the GASCAP for all call-type opcodes, not only for the
	// CALL opcode.
	CallValueTransferGas   uint64 = 9000  // Paid for CALL when the value transfer is non-zero.
	CallNewAccountGas      uint64 = 25000 // Paid for CALL when the destination address didn't exist prior.
	CallStipend            uint64 = 2300  // Free gas given to account during CALL.

	// Gas costs for access list transactions
	TxAccessListAddressGas uint64 = 2400 // Gas cost of an address in an EIP-2930 access list.
	TxAccessListStorageKeyGas uint64 = 1900 // Gas cost of a storage key in an EIP-2930 access list.

	// Gas costs for EIP-4844 transactions
	BlobTxBlobGasPerBlob uint64 = 1 << 17 // 131072 gas per blob.
	BlobTxMinBlobGasprice uint64 = 1      // The minimum gas price for a blob.

	// Gas costs for EIP-7702 transactions
	SetCodeTxAuthGas uint64 = 3000 // Gas cost of an authorization in an EIP-7702 set-code transaction.
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import "github.com/ethereum/go-ethereum/params"

// gas price of the instructions
var (
	gasStep   = uint64(1)
	gasZero   = uint64(0)
	gasBase   = uint64(2)
	gasVeryLow  = uint64(3)
	gasLow    = uint64(5)
	gasMid    = uint64(8)
	gasHigh   = uint64(10)
	gasExt    = uint64(20)
	gasExp    = uint64(10)
	gasExpByte  = uint64(50)
	gasMemory = uint64(3)
	gasSha3   = uint64(30)
	gasSha3Word = uint64(6)
	gasCopy   = uint64(3)
	gasSload  = uint64(0) // Now calculated based on temperature
	gasSstore = uint64(0) // Now calculated based on state
	gasBalance  = uint64(0) // Now calculated based on temperature
	gasCreate = uint64(32000)
	gasCall   = uint64(0) // Now calculated based on complexity
	gasCallCode = uint64(0)
	gasDelegateCall = uint64(0)
	gasStaticCall = uint64(0)
	gasReturn = uint64(0)
	gasRevert = uint64(0)
	gasSuicide  = uint64(5000)
	gasLog    = uint64(375)
	gasLogData  = uint64(8)
	gasLogTopic = uint64(375)
	gasTload    = uint64(params.WarmStorageReadCost)
	gasTstore   = uint64(params.WarmStorageReadCost)
	gasMcopy    = uint64(3)
	gasPush0    = uint64(2)
)

// Gas costs for the EVM opcodes
var gasTable = [256]uint64{
	STOP:         gasZero,
	ADD:          gasVeryLow,
	MUL:          gasLow,
	SUB:          gasVeryLow,
	DIV:          gasLow,
	SDIV:         gasLow,
	MOD:          gasLow,
	SMOD:         gasLow,
	ADDMOD:       gasMid,
	MULMOD:       gasMid,
	EXP:          gasHigh,
	SIGNEXTEND:   gasLow,
	LT:           gasVeryLow,
	GT:           gasVeryLow,
	SLT:          gasVeryLow,
	SGT:          gasVeryLow,
	EQ:           gasVeryLow,
	ISZERO:       gasVeryLow,
	AND:          gasVeryLow,
	OR:           gasVeryLow,
	XOR:          gasVeryLow,
	NOT:          gasVeryLow,
	BYTE:         gasVeryLow,
	SHA3:         gasSha3,
	ADDRESS:      gasBase,
	BALANCE:      gasBalance,
	ORIGIN:       gasBase,
	CALLER:       gasBase,
	CALLVALUE:    gasBase,
	CALLDATALOAD: gasVeryLow,
	CALLDATASIZE: gasBase,
	CALLDATACOPY: gasVeryLow,
	CODESIZE:     gasBase,
	CODECOPY:     gasVeryLow,
	GASPRICE:     gasBase,
	EXTCODESIZE:  gasExt,
	EXTCODECOPY:  gasExt,
	BLOCKHASH:    gasExt,
	COINBASE:     gasBase,
	TIMESTAMP:    gasBase,
	NUMBER:       gasBase,
	DIFFICULTY:   gasBase,
	GASLIMIT:     gasBase,
	POP:          gasBase,
	MLOAD:        gasVeryLow,
	MSTORE:       gasVeryLow,
	MSTORE8:      gasVeryLow,
	SLOAD:        gasSload,
	SSTORE:       gasSstore,
	JUMP:         gasMid,
	JUMPI:        gasHigh,
	PC:           gasBase,
	MSIZE:        gasBase,
	GAS:          gasBase,
	JUMPDEST:     gasStep,
	PUSH1:        gasVeryLow,
	PUSH2:        gasVeryLow,
	PUSH3:        gasVeryLow,
	PUSH4:        gasVeryLow,
	PUSH5:        gasVeryLow,
	PUSH6:        gasVeryLow,
	PUSH7:        gasVeryLow,
	PUSH8:        gasVeryLow,
	PUSH9:        gasVeryLow,
	PUSH10:       gasVeryLow,
	PUSH11:       gasVeryLow,
	PUSH12:       gasVeryLow,
	PUSH13:       gasVeryLow,
	PUSH14:       gasVeryLow,
	PUSH15:       gasVeryLow,
	PUSH16:       gasVeryLow,
	PUSH17:       gasVeryLow,
	PUSH18:       gasVeryLow,
	PUSH19:       gasVeryLow,
	PUSH20:       gasVeryLow,
	PUSH21:       gasVeryLow,
	PUSH22:       gasVeryLow,
	PUSH23:       gasVeryLow,
	PUSH24:       gasVeryLow,
	PUSH25:       gasVeryLow,
	PUSH26:       gasVeryLow,
	PUSH27:       gasVeryLow,
	PUSH28:       gasVeryLow,
	PUSH29:       gasVeryLow,
	PUSH30:       gasVeryLow,
	PUSH31:       gasVeryLow,
	PUSH32:       gasVeryLow,
	DUP1:         gasVeryLow,
	DUP2:         gasVeryLow,
	DUP3:         gasVeryLow,
	DUP4:         gasVeryLow,
	DUP5:         gasVeryLow,
	DUP6:         gasVeryLow,
	DUP7:         gasVeryLow,
	DUP8:         gasVeryLow,
	DUP9:         gasVeryLow,
	DUP10:        gasVeryLow,
	DUP11:        gasVeryLow,
	DUP12:        gasVeryLow,
	DUP13:        gasVeryLow,
	DUP14:        gasVeryLow,
	DUP15:        gasVeryLow,
	DUP16:        gasVeryLow,
	SWAP1:        gasVeryLow,
	SWAP2:        gasVeryLow,
	SWAP3:        gasVeryLow,
	SWAP4:        gasVeryLow,
	SWAP5:        gasVeryLow,
	SWAP6:        gasVeryLow,
	SWAP7:        gasVeryLow,
	SWAP8:        gasVeryLow,
	SWAP9:        gasVeryLow,
	SWAP10:       gasVeryLow,
	SWAP11:       gasVeryLow,
	SWAP12:       gasVeryLow,
	SWAP13:       gasVeryLow,
	SWAP14:       gasVeryLow,
	SWAP15:       gasVeryLow,
	SWAP16:       gasVeryLow,
	LOG0:         gasLog,
	LOG1:         gasLog,
	LOG2:         gasLog,
	LOG3:         gasLog,
	LOG4:         gasLog,
	CREATE:       gasCreate,
	CALL:         gasCall,
	CALLCODE:     gasCallCode,
	RETURN:       gasZero,
	DELEGATECALL: gasDelegateCall,
	STATICCALL:   gasStaticCall,
	REVERT:       gasZero,
	INVALID:      gasZero,
	SUICIDE:      gasSuicide,
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiled.go">
```go
// Copyright 2016 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/crypto/bn256"
	"github.com/ethereum/go-ethereum/crypto/blake2b"
	"github.com/ethereum/go-ethereum/crypto/kzg4844"
	"github.com/ethereum/go-ethereum/params"
)

// PrecompiledContract is the interface for a precompiled contract.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the precompiled contract.
	RequiredGas(input []byte) uint64
	// Run executes the precompiled contract.
	Run(input []byte) ([]byte, error)
}

// PrecompiledContracts contains the default set of pre-compiled Ethereum contracts.
var PrecompiledContracts = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// ActivePrecompiles returns the precompiled contracts active in the given chain configuration.
func ActivePrecompiles(config *params.ChainConfig, blockNumber *big.Int, timestamp uint64) map[common.Address]PrecompiledContract {
	precompiles := make(map[common.Address]PrecompiledContract)
	for addr, p := range PrecompiledContracts {
		precompiles[addr] = p
	}
	if config.IsCancun(blockNumber, timestamp) {
		precompiles[common.BytesToAddress([]byte{0xa})] = &pointEvaluation{}
	}
	return precompiles
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/consensus.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

// Package consensus implements different Ethereum consensus engines.
package consensus

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
)

// ChainHeaderReader defines a small collection of methods needed to access the local
// blockchain during header verification.
type ChainHeaderReader interface {
	// Config retrieves the blockchain's chain configuration.
	Config() *params.ChainConfig

	// CurrentHeader retrieves the current header from the local chain.
	CurrentHeader() *types.Header

	// GetHeader retrieves a block header from the database by hash and number.
	GetHeader(hash common.Hash, number uint64) *types.Header

	// GetHeaderByNumber retrieves a block header from the database by number.
	GetHeaderByNumber(number uint64) *types.Header

	// GetHeaderByHash retrieves a block header from the database by its hash.
	GetHeaderByHash(hash common.Hash) *types.Header
}

// ChainReader defines a small collection of methods needed to access the local
// blockchain during header and/or uncle verification.
type ChainReader interface {
	ChainHeaderReader

	// GetBlock retrieves a block from the database by hash and number.
	GetBlock(hash common.Hash, number uint64) *types.Block
}

// Engine is an algorithm agnostic consensus engine.
type Engine interface {
	// Author retrieves the Ethereum address of the account that minted the given
	// block, which may be different from the header's coinbase if a consensus
	// engine is based on signatures.
	Author(header *types.Header) (common.Address, error)

	// VerifyHeader checks whether a header conforms to the consensus rules of a
	// given engine.
	VerifyHeader(chain ChainHeaderReader, header *types.Header) error

	// VerifyHeaders is similar to VerifyHeader, but verifies a batch of headers
	// concurrently. The method returns a quit channel to abort the operations and
	// a results channel to retrieve the async verifications (the order is that of
	// the input slice).
	VerifyHeaders(chain ChainHeaderReader, headers []*types.Header) (chan<- struct{}, <-chan error)

	// VerifyUncles verifies that the given block's uncles conform to the consensus
	// rules of a given engine.
	VerifyUncles(chain ChainReader, block *types.Block) error

	// Prepare initializes the consensus fields of a block header according to the
	// rules of a particular engine. The changes are executed inline.
	Prepare(chain ChainHeaderReader, header *types.Header) error

	// Finalize runs any post-transaction state modifications (e.g. block rewards
	// or process withdrawals) but does not assemble the block.
	//
	// Note: The state database might be updated to reflect any consensus rules
	// that happen at finalization (e.g. block rewards).
	Finalize(chain ChainHeaderReader, header *types.Header, state vm.StateDB, body *types.Body)

	// FinalizeAndAssemble runs any post-transaction state modifications (e.g. block
	// rewards or process withdrawals) and assembles the final block.
	//
	// Note: The block header and state database might be updated to reflect any
	// consensus rules that happen at finalization (e.g. block rewards).
	FinalizeAndAssemble(chain ChainHeaderReader, header *types.Header, state *state.StateDB, body *types.Body, receipts []*types.Receipt) (*types.Block, error)

	// Seal generates a new sealing request for the given input block and pushes
	// the result into the given channel.
	//
	// Note, the method returns immediately and will send the result async. More
	// than one result may also be returned depending on the consensus algorithm.
	Seal(chain ChainHeaderReader, block *types.Block, results chan<- *types.Block, stop <-chan struct{}) error

	// SealHash returns the hash of a block prior to it being sealed.
	SealHash(header *types.Header) common.Hash

	// CalcDifficulty is the difficulty adjustment algorithm. It returns the difficulty
	// that a new block should have.
	CalcDifficulty(chain ChainHeaderReader, time uint64, parent *types.Header) *big.Int

	// Close terminates any background threads maintained by the consensus engine.
	Close() error
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"errors"
	"math/big"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// Interpreter is an EVM interpreter for use with the EVM object.
type Interpreter struct {
	evm *EVM

	// For callTracer, we need to keep track of the last call frame,
	// so that we can patch in the "output" on a subsequent call/return
	lastCallFrame *callFrame

	// This is the call stack of the interpreter
	callStack *callStack

	// This is used for gas tracking inside the interpreter
	gas                 uint64
	gasPool             *GasPool
	parent              *Interpreter
	returnData          []byte
	readOnly            bool
	contract            Contract
	err                 error
	lastOp              OpCode
	cfg                 Config
	activePrecompiles   map[common.Address]PrecompiledContract
	lastReturnData      []byte
	lastReturnDataGas   uint64
	hasher              common.Hash
	hasherBuf           common.Hash
	hasherForAddress    common.Hash
	intPool             *intPool
	analysis            *codeAnalysis
	hasCodeAnalysisHook bool
	callCodeSetup       bool
}

// NewInterpreter returns a new interpreter
func NewInterpreter(evm *EVM, contract Contract, readOnly bool, gasPool *GasPool) *Interpreter {
	// We can do this without fetching the config because the choice of jump table is the same for all forks after Berlin.
	var jt JumpTable
	if evm.ChainConfig().IsCancun(evm.BlockContext.Number, evm.BlockContext.Time) {
		jt = cancunInstructionSet
	} else if evm.ChainConfig().IsShanghai(evm.BlockContext.Number, evm.BlockContext.Time) {
		jt = shanghaiInstructionSet
	} else {
		jt = londonInstructionSet
	}

	intrprt := &Interpreter{
		evm:               evm,
		readOnly:          readOnly,
		gasPool:           gasPool,
		contract:          contract,
		activePrecompiles: ActivePrecompiles(evm.ChainConfig(), evm.BlockContext.Number, evm.BlockContext.Time),
		intPool:           evm.intPool,
	}
	intrprt.callStack = newCallStack()
	intrprt.callStack.push(&callFrame{
		i:      intrprt,
		code:   contract.Code,
		codeAs: codeAs(contract.Code),
		gas:    contract.Gas,
		callee: contract.Address(),
	})

	if evm.Config.Tracer != nil {
		intrprt.cfg.Tracer = evm.Config.Tracer
		intrprt.hasCodeAnalysisHook = evm.Config.Tracer.OnCodeAnalysis != nil
	}
	if evm.Config.EVMInterpreter != "" {
		// This should not happen
		panic("Config.EVMInterpreter is not supported on this interpreter")
	}

	// It may be that the current interpreter is a short-lived object.
	// We therefore pull the analysis from the cache, or create one if this is the first time this
	// contract has been encountered.
	hash := contract.CodeHash
	analysis, err := anaylzeCode(hash, jt, contract.Code)
	if err != nil {
		// This should not happen, it means that the jump table is misconfigured
		panic(err)
	}
	intrprt.analysis = analysis
	return intrprt
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *Interpreter) Run(input []byte) (ret []byte, err error) {
	// The Interpreter can be called multiple times, e.g. during a STATICCALL from
	// a contract. On the first call, we can do some setup. The 'callCodeSetup'
	// flag is used to do this setup only once.
	if !in.callCodeSetup {
		in.callCodeSetup = true
		if in.hasCodeAnalysisHook {
			in.evm.Config.Tracer.OnCodeAnalysis(in.contract.Code, in.analysis)
		}
	}
	frame := in.callStack.current()
	in.gas = frame.gas
	frame.input = input

	// The `err` variable is on the interpreter, and will be used to track
	// any error during the execution.
	in.err = nil
	defer func() {
		err = in.err // return the final error to caller
	}()

	// The main loop for executing instructions.
	var (
		op OpCode // current opcode
		pc uint64 // program counter
	)
	for {
		op = frame.codeAs.op(pc)
		operation := in.analysis.jumpTable[op]
		if !operation.valid {
			in.err = &ErrInvalidOpcode{opcode: op}
			break
		}
		// Apply the gas constraints
		cost, err := operation.gasCost(in.evm, in, frame)
		if err != nil {
			in.err = err
			break
		}
		if in.gas < cost {
			in.err = ErrOutOfGas
			break
		}
		in.gas -= cost

		// For tracing purposes, the opcode's cost is recorded in the interpreter.
		// This is needed for callTracer.
		in.lastOp = op

		// Don't trace STOP, since it terminates the execution.
		// The greypaper says "The pc is not advanced on the STOP instruction.".
		if in.cfg.Tracer != nil && op != STOP {
			in.cfg.Tracer.OnOpcode(pc, op, in.gas, cost, in, in.lastReturnData, in.callStack.depth(), in.err)
		}
		// Don't trace STOP, since it terminates the execution.
		if in.evm.Config.EVMInterpreter != "" && op != STOP {
			in.evm.interpreter.CaptureState(pc, op, in.gas, cost, in, in.lastReturnData, in.callStack.depth(), in.err)
		}
		// Execute the operation
		operation.execute(&pc, in, frame)

		// If the operation has returned an error, we abort the execution
		if in.err != nil {
			break
		}
		pc++
		// If the STOP opcode was executed, exit the loop
		if op == STOP {
			break
		}
	}
	if in.err == ErrExecutionReverted {
		return frame.ret, nil
	}
	if in.err != nil {
		return nil, in.err
	}
	return frame.ret, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package types

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"math/big"
	"sync/atomic"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/rlp"
)

var (
	ErrInvalidSig           = errors.New("invalid transaction v, r, s values")
	ErrUnexpectedProtection = errors.New("transaction type does not supported EIP-155 protected signatures")
	ErrInvalidTxType        = errors.New("transaction type not valid in this context")
	ErrTxTypeNotSupported   = errors.New("transaction type not supported")
	ErrGasFeeCapTooLow      = errors.New("fee cap less than base fee")
	errShortTypedTx         = errors.New("typed transaction too short")
	errInvalidYParity       = errors.New("'yParity' field must be 0 or 1")
	errVYParityMismatch     = errors.New("'v' and 'yParity' fields do not match")
	errVYParityMissing      = errors.New("missing 'yParity' or 'v' field in transaction")
)

// Transaction types.
const (
	LegacyTxType     = 0x00
	AccessListTxType = 0x01
	DynamicFeeTxType = 0x02
	BlobTxType       = 0x03
	SetCodeTxType    = 0x04
)

// Transaction is an Ethereum transaction.
type Transaction struct {
	inner TxData    // Consensus contents of a transaction
	time  time.Time // Time first seen locally (spam avoidance)

	// caches
	hash atomic.Pointer[common.Hash]
	size atomic.Uint64
	from atomic.Pointer[sigCache]
}

// NewTx creates a new transaction.
func NewTx(inner TxData) *Transaction {
	tx := new(Transaction)
	tx.setDecoded(inner.copy(), 0)
	return tx
}

// TxData is the underlying data of a transaction.
//
// This is implemented by DynamicFeeTx, LegacyTx and AccessListTx.
type TxData interface {
	txType() byte // returns the type ID
	copy() TxData // creates a deep copy and initializes all fields

	chainID() *big.Int
	accessList() AccessList
	data() []byte
	gas() uint64
	gasPrice() *big.Int
	gasTipCap() *big.Int
	gasFeeCap() *big.Int
	value() *big.Int
	nonce() uint64
	to() *common.Address

	rawSignatureValues() (v, r, s *big.Int)
	setSignatureValues(chainID, v, r, s *big.Int)

	// effectiveGasPrice computes the gas price paid by the transaction, given
	// the inclusion block baseFee.
	//
	// Unlike other TxData methods, the returned *big.Int should be an independent
	// copy of the computed value, i.e. callers are allowed to mutate the result.
	// Method implementations can use 'dst' to store the result.
	effectiveGasPrice(dst *big.Int, baseFee *big.Int) *big.Int

	encode(*bytes.Buffer) error
	decode([]byte) error

	// sigHash returns the hash of the transaction that is ought to be signed
	sigHash(*big.Int) common.Hash
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/tx_blob.go">
```go
// Copyright 2023 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package types

import (
	"bytes"
	"crypto/sha256"
	"errors"
	"fmt"
	"math/big"

	"slices"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto/kzg4844"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/holiman/uint256"
)

// BlobTx represents an EIP-4844 transaction.
type BlobTx struct {
	ChainID    *uint256.Int
	Nonce      uint64
	GasTipCap  *uint256.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap  *uint256.Int // a.k.a. maxFeePerGas
	Gas        uint64
	To         common.Address
	Value      *uint256.Int
	Data       []byte
	AccessList AccessList
	BlobFeeCap *uint256.Int // a.k.a. maxFeePerBlobGas
	BlobHashes []common.Hash

	// A blob transaction can optionally contain blobs. This field must be set when BlobTx
	// is used to create a transaction for signing.
	Sidecar *BlobTxSidecar `rlp:"-"`

	// Signature values
	V *uint256.Int
	R *uint256.Int
	S *uint256.Int
}

// BlobTxSidecar contains the blobs of a blob transaction.
type BlobTxSidecar struct {
	Version     byte                 // Version
	Blobs       []kzg4844.Blob       // Blobs needed by the blob pool
	Commitments []kzg4844.Commitment // Commitments needed by the blob pool
	Proofs      []kzg4844.Proof      // Proofs needed by the blob pool
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/clique/clique.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

// Package clique implements the proof-of-authority consensus engine.
package clique

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"math/big"
	"math/rand"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/common/lru"
	"github.com/ethereum/go-ethereum/consensus"
	"github.com/ethereum/go-ethereum/consensus/misc"
	"github.com/ethereum/go-ethereum/consensus/misc/eip1559"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethdb"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/trie"
	"golang.org/x/crypto/sha3"
)

const (
	checkpointInterval = 1024 // Number of blocks after which to save the vote snapshot to the database
	inmemorySnapshots  = 128  // Number of recent vote snapshots to keep in memory
	inmemorySignatures = 4096 // Number of recent block signatures to keep in memory
)

// Clique proof-of-authority protocol constants.
var (
	epochLength = uint64(30000) // Default number of blocks after which to checkpoint and reset the pending votes

	extraVanity = 32                     // Fixed number of extra-data prefix bytes reserved for signer vanity
	extraSeal   = crypto.SignatureLength // Fixed number of extra-data suffix bytes reserved for signer seal

	nonceAuthVote = hexutil.MustDecode("0xffffffffffffffff") // Magic nonce number to vote on adding a new signer
	nonceDropVote = hexutil.MustDecode("0x0000000000000000") // Magic nonce number to vote on removing a signer.

	uncleHash = types.CalcUncleHash(nil) // Always Keccak256(RLP([])) as uncles are meaningless outside of PoW.

	diffInTurn = big.NewInt(2) // Block difficulty for in-turn signatures
	diffNoTurn = big.NewInt(1) // Block difficulty for out-of-turn signatures
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/ethash/consensus.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package ethash

import (
	"errors"
	"fmt"
	"math/big"
	"time"

	mapset "github.com/deckarep/golang-set/v2"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/consensus"
	"github.com/ethereum/go-ethereum/consensus/misc"
	"github.com/ethereum/go-ethereum/consensus/misc/eip1559"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/trie"
	"github.com/holiman/uint256"
	"golang.org/x/crypto/sha3"
)

// Ethash proof-of-work protocol constants.
var (
	FrontierBlockReward           = uint256.NewInt(5e+18) // Block reward in wei for successfully mining a block
	ByzantiumBlockReward          = uint256.NewInt(3e+18) // Block reward in wei for successfully mining a block upward from Byzantium
	ConstantinopleBlockReward     = uint256.NewInt(2e+18) // Block reward in wei for successfully mining a block upward from Constantinople
	maxUncles                     = 2                     // Maximum number of uncles allowed in a single block
	allowedFutureBlockTimeSeconds = int64(15)             // Max seconds from current time allowed for blocks, before they're considered future blocks
)

// FinalizeAndAssemble implements consensus.Engine, accumulating the block and
// uncle rewards, setting the final state and assembling the block.
func (ethash *Ethash) FinalizeAndAssemble(chain consensus.ChainHeaderReader, header *types.Header, state *state.StateDB, body *types.Body, receipts []*types.Receipt) (*types.Block, error) {
	if len(body.Withdrawals) > 0 {
		return nil, errors.New("ethash does not support withdrawals")
	}
	// Finalize block
	ethash.Finalize(chain, header, state, body)

	// Assign the final state root to header.
	header.Root = state.IntermediateRoot(chain.Config().IsEIP158(header.Number))

	// Header seems complete, assemble into a block and return
	return types.NewBlock(header, &types.Body{Transactions: body.Transactions, Uncles: body.Uncles}, receipts, trie.NewStackTrie(nil)), nil
}

// accumulateRewards credits the coinbase of the given block with the mining
// reward. The total reward consists of the static block reward and rewards for
// included uncles. The coinbase of each uncle block is also rewarded.
func accumulateRewards(config *params.ChainConfig, stateDB vm.StateDB, header *types.Header, uncles []*types.Header) {
	// Select the correct block reward based on chain progression
	blockReward := FrontierBlockReward
	if config.IsByzantium(header.Number) {
		blockReward = ByzantiumBlockReward
	}
	if config.IsConstantinople(header.Number) {
		blockReward = ConstantinopleBlockReward
	}
	// Accumulate the rewards for the miner and any included uncles
	reward := new(uint256.Int).Set(blockReward)
	r := new(uint256.Int)
	hNum, _ := uint256.FromBig(header.Number)
	for _, uncle := range uncles {
		uNum, _ := uint256.FromBig(uncle.Number)
		r.AddUint64(uNum, 8)
		r.Sub(r, hNum)
		r.Mul(r, blockReward)
		r.Rsh(r, 3)
		stateDB.AddBalance(uncle.Coinbase, r, tracing.BalanceIncreaseRewardMineUncle)

		r.Rsh(blockReward, 5)
		reward.Add(reward, r)
	}
	stateDB.AddBalance(header.Coinbase, reward, tracing.BalanceIncreaseRewardMineBlock)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"errors"
	"math"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// ErrOutOfGas is returned if the gas limit of a transaction is exceeded.
var ErrOutOfGas = errors.New("out of gas")

// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(mem *Memory, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// The maximum new size is capped at 2^256-1 to avoid overflow.
	if newSize > math.MaxUint64 {
		return 0, ErrGasUintOverflow
	}
	// old size in terms of words
	oldSize := uint64(mem.Len())
	oldWords := (oldSize + 31) / 32
	newWords := (newSize + 31) / 32
	if oldWords >= newWords {
		return 0, nil
	}

	// new cost can be calculated via the following:
	//
	//   C(s) = Gmemory * s + s^2 / Cquad
	//
	// where s is the new size in words.
	// The cost of memory expansion is the difference between the new cost and the old cost.
	//
	//   C(s) - C(s_old) = Gmemory * (s - s_old) + (s^2 - s_old^2) / Cquad
	//
	// where Gmemory is 3 and Cquad is 512
	oldCost := oldWords*params.MemoryGas + oldWords*oldWords/params.QuadCoeffDiv
	newCost := newWords*params.MemoryGas + newWords*newWords/params.QuadCoeffDiv

	// Check that we have enough gas for the memory expansion
	if newCost < oldCost {
		return 0, ErrGasUintOverflow
	}
	return newCost - oldCost, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jumptable.go">
```go
// Copyright 2021 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import "github.com/ethereum/go-ethereum/params"

// JumpTable contains the EVM opcodes and their corresponding instructions.
type JumpTable [256]operation

// newBerlinInstructionSet returns the instruction set for the Berlin hard fork.
func newBerlinInstructionSet() JumpTable {
	return JumpTable{
		STOP:         &opStop{},
		ADD:          &opAdd{},
		MUL:          &opMul{},
		SUB:          &opSub{},
		DIV:          &opDiv{},
		SDIV:         &opSdiv{},
		MOD:          &opMod{},
		SMOD:         &opSmod{},
		ADDMOD:       &opAddmod{},
		MULMOD:       &opMulmod{},
		EXP:          &opExp{},
		SIGNEXTEND:   &opSignExtend{},
		LT:           &opLt{},
		GT:           &opGt{},
		SLT:          &opSlt{},
		SGT:          &opSgt{},
		EQ:           &opEq{},
		ISZERO:       &opIszero{},
		AND:          &opAnd{},
		OR:           &opOr{},
		XOR:          &opXor{},
		NOT:          &opNot{},
		BYTE:         &opByte{},
		SHL:          &opShl{},
		SHR:          &opShr{},
		SAR:          &opSar{},
		SHA3:         &opSha3{},
		ADDRESS:      &opAddress{},
		BALANCE:      &opBalance{},
		ORIGIN:       &opOrigin{},
		CALLER:       &opCaller{},
		CALLVALUE:    &opCallValue{},
		CALLDATALOAD: &opCalldataload{},
		CALLDATASIZE: &opCalldatasize{},
		CALLDATACOPY: &opCalldatacopy{},
		CODESIZE:     &opCodesize{},
		CODECOPY:     &opCodecopy{},
		GASPRICE:     &opGasprice{},
		EXTCODESIZE:  &opExtcodesize{},
		EXTCODECOPY:  &opExtcodecopy{},
		RETURNDATASIZE: &opReturndatasize{},
		RETURNDATACOPY: &opReturndatacopy{},
		EXTCODEHASH:  &opExtcodehash{},
		BLOCKHASH:    &opBlockhash{},
		COINBASE:     &opCoinbase{},
		TIMESTAMP:    &opTimestamp{},
		NUMBER:       &opNumber{},
		DIFFICULTY:   &opDifficulty{},
		GASLIMIT:     &opGaslimit{},
		POP:          &opPop{},
		MLOAD:        &opMload{},
		MSTORE:       &opMstore{},
		MSTORE8:      &opMstore8{},
		SLOAD:        &opSload{},
		SSTORE:       &opSstore{},
		JUMP:         &opJump{},
		JUMPI:        &opJumpi{},
		PC:           &opPc{},
		MSIZE:        &opMsize{},
		GAS:          &opGas{},
		JUMPDEST:     &opJumpdest{},
		PUSH1:        &opPush1{},
		PUSH2:        &opPush2{},
		PUSH3:        &opPush3{},
		PUSH4:        &opPush4{},
		PUSH5:        &opPush5{},
		PUSH6:        &opPush6{},
		PUSH7:        &opPush7{},
		PUSH8:        &opPush8{},
		PUSH9:        &opPush9{},
		PUSH10:       &opPush10{},
		PUSH11:       &opPush11{},
		PUSH12:       &opPush12{},
		PUSH13:       &opPush13{},
		PUSH14:       &opPush14{},
		PUSH15:       &opPush15{},
		PUSH16:       &opPush16{},
		PUSH17:       &opPush17{},
		PUSH18:       &opPush18{},
		PUSH19:       &opPush19{},
		PUSH20:       &opPush20{},
		PUSH21:       &opPush21{},
		PUSH22:       &opPush22{},
		PUSH23:       &opPush23{},
		PUSH24:       &opPush24{},
		PUSH25:       &opPush25{},
		PUSH26:       &opPush26{},
		PUSH27:       &opPush27{},
		PUSH28:       &opPush28{},
		PUSH29:       &opPush29{},
		PUSH30:       &opPush30{},
		PUSH31:       &opPush31{},
		PUSH32:       &opPush32{},
		DUP1:         &opDup1{},
		DUP2:         &opDup2{},
		DUP3:         &opDup3{},
		DUP4:         &opDup4{},
		DUP5:         &opDup5{},
		DUP6:         &opDup6{},
		DUP7:         &opDup7{},
		DUP8:         &opDup8{},
		DUP9:         &opDup9{},
		DUP10:        &opDup10{},
		DUP11:        &opDup11{},
		DUP12:        &opDup12{},
		DUP13:        &opDup13{},
		DUP14:        &opDup14{},
		DUP15:        &opDup15{},
		DUP16:        &opDup16{},
		SWAP1:        &opSwap1{},
		SWAP2:        &opSwap2{},
		SWAP3:        &opSwap3{},
		SWAP4:        &opSwap4{},
		SWAP5:        &opSwap5{},
		SWAP6:        &opSwap6{},
		SWAP7:        &opSwap7{},
		SWAP8:        &opSwap8{},
		SWAP9:        &opSwap9{},
		SWAP10:       &opSwap10{},
		SWAP11:       &opSwap11{},
		SWAP12:       &opSwap12{},
		SWAP13:       &opSwap13{},
		SWAP14:       &opSwap14{},
		SWAP15:       &opSwap15{},
		SWAP16:       &opSwap16{},
		LOG0:         &opLog0{},
		LOG1:         &opLog1{},
		LOG2:         &opLog2{},
		LOG3:         &opLog3{},
		LOG4:         &opLog4{},
		CREATE:       &opCreate{},
		CALL:         &opCall{},
		CALLCODE:     &opCallCode{},
		RETURN:       &opReturn{},
		DELEGATECALL: &opDelegateCall{},
		CREATE2:      &opCreate2{},
		STATICCALL:   &opStaticCall{},
		REVERT:       &opRevert{},
		SELFDESTRUCT: &opSelfDestruct{},
	}
}

var (
	berlinInstructionSet   = newBerlinInstructionSet()
	londonInstructionSet   = newLondonInstructionSet()
	shanghaiInstructionSet = newShanghaiInstructionSet()
	cancunInstructionSet   = newCancunInstructionSet()
)

// newLondonInstructionSet returns the instruction set for the London hard fork.
func newLondonInstructionSet() JumpTable {
	// Start with Berlin and add the new opcodes
	instructionSet := berlinInstructionSet
	instructionSet[BASEFEE] = &opBaseFee{}
	return instructionSet
}

// newShanghaiInstructionSet returns the instruction set for the Shanghai hard fork.
func newShanghaiInstructionSet() JumpTable {
	// Start with London and add the new opcodes
	instructionSet := londonInstructionSet
	instructionSet[PUSH0] = &opPush0{}
	instructionSet[PREVRANDAO] = &opPrevrandao{} // DIFFICULTY is an alias
	return instructionSet
}

// newCancunInstructionSet returns the instruction set for the Cancun hard fork.
func newCancunInstructionSet() JumpTable {
	// Start with Shanghai and add the new opcodes
	instructionSet := shanghaiInstructionSet
	instructionSet[BLOBHASH] = &opBlobhash{}
	instructionSet[BLOBBASEFEE] = &opBlobBasefee{}
	instructionSet[TLOAD] = &opTload{}
	instructionSet[TSTORE] = &opTstore{}
	instructionSet[MCOPY] = &opMcopy{}
	return instructionSet
}

// Gas costs for the EVM opcodes
var gasTableEIP2929 = [256]uint64{
	STOP:         gasZero,
	ADD:          gasVeryLow,
	MUL:          gasLow,
	SUB:          gasVeryLow,
	DIV:          gasLow,
	SDIV:         gasLow,
	MOD:          gasLow,
	SMOD:         gasLow,
	ADDMOD:       gasMid,
	MULMOD:       gasMid,
	EXP:          gasHigh,
	SIGNEXTEND:   gasLow,
	LT:           gasVeryLow,
	GT:           gasVeryLow,
	SLT:          gasVeryLow,
	SGT:          gasVeryLow,
	EQ:           gasVeryLow,
	ISZERO:       gasVeryLow,
	AND:          gasVeryLow,
	OR:           gasVeryLow,
	XOR:          gasVeryLow,
	NOT:          gasVeryLow,
	BYTE:         gasVeryLow,
	SHL:          gasVeryLow,
	SHR:          gasVeryLow,
	SAR:          gasVeryLow,
	SHA3:         gasSha3,
	ADDRESS:      gasBase,
	BALANCE:      params.ColdAccountAccessCostEIP2929, // EIP-2929 changed
	ORIGIN:       gasBase,
	CALLER:       gasBase,
	CALLVALUE:    gasBase,
	CALLDATALOAD: gasVeryLow,
	CALLDATASIZE: gasBase,
	CALLDATACOPY: gasVeryLow,
	CODESIZE:     gasBase,
	CODECOPY:     gasVeryLow,
	GASPRICE:     gasBase,
	EXTCODESIZE:  params.ColdAccountAccessCostEIP2929, // EIP-2929 changed
	EXTCODECOPY:  params.ColdAccountAccessCostEIP2929, // EIP-2929 changed
	RETURNDATASIZE: gasBase,
	RETURNDATACOPY: gasVeryLow,
	EXTCODEHASH:  params.ColdAccountAccessCostEIP2929, // EIP-2929 changed
	BLOCKHASH:    gasExt,
	COINBASE:     gasBase,
	TIMESTAMP:    gasBase,
	NUMBER:       gasBase,
	DIFFICULTY:   gasBase,
	GASLIMIT:     gasBase,
	CHAINID:      gasBase,
	SELFBALANCE:  gasLow,
	BASEFEE:      gasBase,
	POP:          gasBase,
	MLOAD:        gasVeryLow,
	MSTORE:       gasVeryLow,
	MSTORE8:      gasVeryLow,
	SLOAD:        params.ColdSloadCostEIP2929, // EIP-2929 changed
	SSTORE:       gasSstore,
	JUMP:         gasMid,
	JUMPI:        gasHigh,
	PC:           gasBase,
	MSIZE:        gasBase,
	GAS:          gasBase,
	JUMPDEST:     gasStep,
	PUSH1:        gasVeryLow,
	...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/misc/dao.go">
```go
// Copyright 2016 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package misc

import (
	"bytes"
	"errors"
	"math/big"

	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
)

var (
	// ErrBadProDAOExtra is returned if a header doesn't support the DAO fork on a
	// pro-fork client.
	ErrBadProDAOExtra = errors.New("bad DAO pro-fork extra-data")

	// ErrBadNoDAOExtra is returned if a header does support the DAO fork on a no-
	// fork client.
	ErrBadNoDAOExtra = errors.New("bad DAO no-fork extra-data")
)

// VerifyDAOHeaderExtraData validates the extra-data field of a block header to
// ensure it conforms to DAO hard-fork rules.
//
// DAO hard-fork extension to the header validity:
//
//   - if the node is no-fork, do not accept blocks in the [fork, fork+10) range
//     with the fork specific extra-data set.
//   - if the node is pro-fork, require blocks in the specific range to have the
//     unique extra-data set.
func VerifyDAOHeaderExtraData(config *params.ChainConfig, header *types.Header) error {
	// Short circuit validation if the node doesn't care about the DAO fork
	if config.DAOForkBlock == nil {
		return nil
	}
	// Make sure the block is within the fork's modified extra-data range
	limit := new(big.Int).Add(config.DAOForkBlock, params.DAOForkExtraRange)
	if header.Number.Cmp(config.DAOForkBlock) < 0 || header.Number.Cmp(limit) >= 0 {
		return nil
	}
	// Depending on whether we support or oppose the fork, validate the extra-data contents
	if config.DAOForkSupport {
		if !bytes.Equal(header.Extra, params.DAOForkBlockExtra) {
			return ErrBadProDAOExtra
		}
	} else {
		if bytes.Equal(header.Extra, params.DAOForkBlockExtra) {
			return ErrBadNoDAOExtra
		}
	}
	// All ok, header has the same extra-data we expect
	return nil
}

// ApplyDAOHardFork modifies the state database according to the DAO hard-fork
// rules, transferring all balances of a set of DAO accounts to a single refund
// contract.
func ApplyDAOHardFork(statedb vm.StateDB) {
	// Retrieve the contract to refund balances into
	if !statedb.Exist(params.DAORefundContract) {
		statedb.CreateAccount(params.DAORefundContract)
	}

	// Move every DAO account and extra-balance account funds into the refund contract
	for _, addr := range params.DAODrainList() {
		balance := statedb.GetBalance(addr)
		statedb.AddBalance(params.DAORefundContract, balance, tracing.BalanceIncreaseDaoContract)
		statedb.SubBalance(addr, balance, tracing.BalanceDecreaseDaoAccount)
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations.
	// https://eips.ethereum.org/EIPS/eip-150
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients)

	// EIP155 implements replay-protected transaction signatures.
	// https://eips.ethereum.org/EIPS/eip-155
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements state clearing for non-existing accounts.
	// https://eips.ethereum.org/EIPS/eip-158
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	// https://eips.ethereum.org/EIPS/eip-649
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	// https://eips.ethereum.org/EIPS/eip-1013
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = no fork, 0 = already activated)
	// https://eips.ethereum.org/EIPS/eip-1716
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	// https://eips.ethereum.org/EIPS/eip-1679
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// MuirGlacier switch block (nil = no fork, 0 = already on muirglacier)
	// https://eips.ethereum.org/EIPS/eip-2384
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on berlin)
	// https://eips.ethereum.org/EIPS/eip-2070
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on london)
	// https://eips.ethereum.org/EIPS/eip-3026
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// ArrowGlacier switch block (nil = no fork, 0 = already on arrow-glacier)
	// https://eips.ethereum.org/EIPS/eip-4345
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// GrayGlacier switch block (nil = no fork, 0 = already on gray-glacier)
	// https://eips.ethereum.org/EIPS/eip-5133
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplit switch block (nil = no fork, 0 = already on merge-netsplit)
	// https://eips.ethereum.org/EIPS/eip-3675
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// Shanghai switch block (nil = no fork, 0 = already on shanghai)
	// https://eips.ethereum.org/EIPS/eip-3675
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// Cancun switch block (nil = no fork, 0 = already on cancun)
	// https://eips.ethereum.org/EIPS/eip-7569
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// Prague switch block (nil = no fork, 0 = already on prague)
	// https://eips.ethereum.org/EIPS/eip-7600
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// Verkle switch block (nil = no fork, 0 = already on verkle)
	VerkleTime *uint64 `json:"verkleTime,omitempty"`

	// TerminalTotalDifficulty is the total difficulty post-merge.
	// https://eips.ethereum.org/EIPS/eip-3675
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag that indicates the terminal total difficulty has been reached.
	// This is a flag only needed for header-only clients that cannot validate the TTD against the blocks.
	// It is not safe to set this flag for full nodes.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Consensus engine specific parameters
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// IsHomestead returns whether num is either equal to the homestead block or greater.
func (c *ChainConfig) IsHomestead(num *big.Int) bool {
	return isForked(c.HomesteadBlock, num)
}

// IsByzantium returns whether num is either equal to the Byzantium block or greater.
func (c *ChainConfig) IsByzantium(num *big.Int) bool {
	return isForked(c.ByzantiumBlock, num)
}

// IsConstantinople returns whether num is either equal to the Constantinople block or greater.
func (c *ChainConfig) IsConstantinople(num *big.Int) bool {
	return isForked(c.ConstantinopleBlock, num)
}

// IsPetersburg returns whether num is either equal to the Petersburg block or greater.
func (c *ChainConfig) IsPetersburg(num *big.Int) bool {
	return isForked(c.PetersburgBlock, num)
}

// IsIstanbul returns whether num is either equal to the Istanbul block or greater.
func (c *ChainConfig) IsIstanbul(num *big.Int) bool {
	return isForked(c.IstanbulBlock, num)
}

// IsBerlin returns whether num is either equal to the Berlin block or greater.
func (c *ChainConfig) IsBerlin(num *big.Int) bool {
	return isForked(c.BerlinBlock, num)
}

// IsLondon returns whether num is either equal to the London block or greater.
func (c *ChainConfig) IsLondon(num *big.Int) bool {
	return isForked(c.LondonBlock, num)
}

// IsShanghai returns whether the shanghai fork is active at the given time.
func (c *ChainConfig) IsShanghai(num *big.Int, time uint64) bool {
	return isForkedReal(c.ShanghaiTime, num, time)
}

// IsCancun returns whether the cancun fork is active at the given time.
func (c *ChainConfig) IsCancun(num *big.Int, time uint64) bool {
	return isForkedReal(c.CancunTime, num, time)
}
//... and so on for other hardforks.
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// stateTransition represents a state transition.
//
// == The State Transitioning Model
//
// A state transition is a change made when a transaction is applied to the current world
// state. The state transitioning model does all the necessary work to work out a valid new
// state root.
//
//  1. Nonce handling
//  2. Pre pay gas
//  3. Create a new state object if the recipient is nil
//  4. Value transfer
//
// == If contract creation ==
//
//	4a. Attempt to run transaction data
//	4b. If valid, use result as code for the new state object
//
// == end ==
//
//  5. Run Script section
//  6. Derive new state root
type stateTransition struct {
	gp           *GasPool
	msg          *Message
	gasRemaining uint64
	initialGas   uint64
	state        vm.StateDB
	evm          *vm.EVM
}

// ApplyMessage computes the new state by applying the given message
// against the old state within the environment.
//
// ApplyMessage returns the bytes returned by any EVM execution (if it took place),
// the gas used (which includes gas refunds) and an error if it failed. An error always
// indicates a core error meaning that the message would always fail for that particular
// state and would never be accepted within a block.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	evm.SetTxContext(NewEVMTxContext(msg))
	return newStateTransition(evm, msg, gp).execute()
}

// execute will transition the state by applying the current message and
// returning the evm execution result with following fields.
//
//   - used gas: total gas used (including gas being refunded)
//   - returndata: the returned data from evm
//   - concrete execution error: various EVM errors which abort the execution, e.g.
//     ErrOutOfGas, ErrExecutionReverted
//
// However if any consensus issue encountered, return the error directly with
// nil evm execution result.
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// First check this message satisfies all consensus rules before
	// applying the message.
    // ...
	if err := st.preCheck(); err != nil {
		return nil, err
	}

	var (
		msg              = st.msg
		rules            = st.evm.ChainConfig().Rules(st.evm.Context.BlockNumber, st.evm.Context.Random != nil, st.evm.Context.Time)
		contractCreation = msg.To == nil
		floorDataGas     uint64
	)
	//...
	// Subtract intrinsic gas
	gas, err := IntrinsicGas(msg.Data, msg.AccessList, msg.SetCodeAuthorizations, contractCreation, rules.IsHomestead, rules.IsIstanbul, rules.IsShanghai)
	if err != nil {
		return nil, err
	}
	st.gasRemaining -= gas

    //... more validation ...

	// Execute the preparatory steps for state transition which includes:
	// - prepare accessList(post-berlin)
	// - reset transient storage(eip 1153)
	st.state.Prepare(rules, msg.From, st.evm.Context.Coinbase, msg.To, vm.ActivePrecompiles(rules), msg.AccessList)

	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not assigned to err
	)
	if contractCreation {
		ret, _, st.gasRemaining, vmerr = st.evm.Create(msg.From, msg.Data, st.gasRemaining, value)
	} else {
		// Increment the nonce for the next transaction.
		st.state.SetNonce(msg.From, st.state.GetNonce(msg.From)+1, tracing.NonceChangeEoACall)
		// ...
		// Execute the transaction's call.
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}
    // ... gas refund and fee distribution logic ...

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for native contracts.
//
// Note: the `Run` function is not supposed to modify the given input. If the
// contract returns a reference to the input, it must be copied beforehand.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the contract
	Run(input []byte) ([]byte, error)   // Run runs the precompiled contract
}

// PrecompiledContracts contains the default set of pre-compiled Ethereum contracts.
var PrecompiledContracts = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}
// ...
// ActivePrecompiles returns the precompiled contracts for the given chain configuration.
func ActivePrecompiles(rules params.Rules) map[common.Address]PrecompiledContract {
	// Create a copy of the default precompiles
	precompiles := maps.Clone(PrecompiledContracts)

	// Add Berlin precompiles
	if rules.IsBerlin {
		precompiles[common.BytesToAddress([]byte{5})] = &modExp{} // Re-enables it
		precompiles[common.BytesToAddress([]byte{6})] = &altbn128.G1Add{}
		precompiles[common.BytesToAddress([]byte{7})] = &altbn128.G1Mul{}
		precompiles[common.BytesToAddress([]byte{8})] = &altbn128.Pairing{}
		precompiles[common.BytesToAddress([]byte{9})] = &blake2F{}
	}
	// Add Cancun precompiles.
	if rules.IsCancun {
		precompiles[common.BytesToAddress([]byte{10})] = &pointEvaluation{} // EIP-4844
	}
	// Note: there's no need to check for IsIstanbul, since we fork off of the
	// default map, which already has the Istanbul precompiles activated.
	return precompiles
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jumptable.go">
```go
// operation represents an operation of the EVM.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// constantGas is the gas that is taken by the operation
	// These gas costs are derived from the ethereum yellow paper
	constantGas uint64
	// dynamicGas is the dynamic gas taken by the operation
	dynamicGas gasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack height after operation.
	maxStack int
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc
}

// JumpTable is a jump table for the EVM's opcodes.
type JumpTable [256]*operation

// newCancunInstructionSet returns the instruction set for the Cancun hard fork.
func newCancunInstructionSet() JumpTable {
	// Start with Shanghai instructions and add the new opcodes
	instructionSet := newShanghaiInstructionSet()
	instructionSet[BLOBHASH] = &operation{
		execute:     opBlobHash,
		constantGas: GasFastestStep,
		minStack:    minStack(1, 1),
		maxStack:    maxStack(1, 1),
	}
	instructionSet[BLOBBASEFEE] = &operation{
		execute:     opBlobBaseFee,
		constantGas: GasQuickStep,
		minStack:    minStack(0, 1),
		maxStack:    maxStack(0, 1),
	}
	instructionSet[TLOAD] = &operation{
		execute:     opTload,
		constantGas: GasTLoad,
		minStack:    minStack(1, 1),
		maxStack:    maxStack(1, 1),
	}
	instructionSet[TSTORE] = &operation{
		execute:     opTstore,
		constantGas: GasTStore,
		minStack:    minStack(2, 0),
		maxStack:    maxStack(2, 0),
	}
	instructionSet[MCOPY] = &operation{
		execute:     opMcopy,
		constantGas: GasFastestStep,
		minStack:    minStack(3, 0),
		maxStack:    maxStack(3, 0),
		dynamicGas:  gasMcopy,
		memorySize:  memoryMcopy,
	}
	return instructionSet
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// gasSha3 calculates the gas used by the SHA3 operation.
func gasSha3(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// We need to do this on the interpreter because it has access to the memory,
	// which is required for calculating the cost of the words
	words, overflow := toWordSize(memorySize)
	if overflow {
		return 0, ErrGasUintOverflow
	}
	// memory expansion gas is calculated and deducted in memory.go
	return GasSha3 + words*GasSha3Word, nil
}

// gasExp calculates the gas used by the EXP operation.
func gasExp(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	exp := stack.Back(1)
	// EIP-160: The gas cost of an EXP instruction is 10 + 50 * (number of bytes in exponent).
	//
	// E.g. `2**255` requires 32 bytes to represent the exponent 255, so that is
	// `10 + 50 * 32 = 1610` gas.
	byteSize := uint64((exp.BitLen() + 7) / 8)
	return GasExp + byteSize*GasExpByte, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/clique/clique.go">
```go
// VerifyHeader checks whether a header conforms to the consensus rules of a
// given newParent block.
func (c *Clique) VerifyHeader(chain consensus.ChainReader, header *types.Header, parent *types.Header) error {
	number := header.Number.Uint64()
	if number == 0 {
		return errUnknownBlock
	}
	// Don't waste time checking blocks from the future
	if header.Time > uint64(time.Now().Unix()) {
		return consensus.ErrFutureBlock
	}
	// Check that the extra-data contains the vanity, signer and signature.
	if len(header.Extra) < extraVanity {
		return errMissingVanity
	}
	if len(header.Extra) < extraVanity+common.AddressLength+crypto.SignatureLength {
		return errMissingSignature
	}
	// Ensure that the mix digest is zero as we don't have fork protection currently
	if header.MixDigest != (common.Hash{}) {
		return errInvalidMixDigest
	}
	// Ensure that the block doesn't contain any uncles
	if header.UncleHash != types.EmptyUncleHash {
		return errInvalidUncleHash
	}
	// If the block is a epoch transition, verify the signer list
	if number%c.config.Epoch == 0 {
		if err := c.verifySigners(chain, header); err != nil {
			return err
		}
	}
	// If the block is not a checkpoint, verify the signer is in the list
	if number > 0 {
		// Get the newParent's snapshot (or the previous one if not available)
		snap, err := c.snapshot(chain, number-1, header.ParentHash, nil)
		if err != nil {
			return err
		}
		// Verify that the sigs are in-turn
		if err := c.verifyCascadingFields(header, snap); err != nil {
			return err
		}
	}
	return nil
}

// Reward returns the reward amount for a given block.
// The Clique consensus has no block rewards, only transaction fees.
func (c *Clique) Reward(state *state.StateDB, header *types.Header, uncles []*types.Header, withdrawals []*types.Withdrawal) {
	// does nothing
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/block_validator.go">
```go
// BlockValidator is responsible for validating block headers.
//
// BlockValidator implements consensus.Engine. It's the general parts of
// the consensus package that validates blocks and is not specific to any
// particular consensus engine.
type BlockValidator struct {
	config *params.ChainConfig // Chain configuration options
	bc     ChainContext        // Canonical block chain
	engine consensus.Engine    // Consensus engine used for verifying seals
}

// NewBlockValidator returns a new block validator using the given consensus
// engine.
func NewBlockValidator(config *params.ChainConfig, bc ChainContext, engine consensus.Engine) *BlockValidator {
	return &BlockValidator{
		config: config,
		bc:     bc,
		engine: engine,
	}
}

// ValidateHeader validates a block header using the consensus engine and contextual
// validation rules held by the validator.
//
// These are the validation rules for all blocks:
//
// - The header must be known to the chain (already processed)
// - The header's gas limit must be within the protocol's bounds
// - The header's gas used must be at most the gas limit
// - The header's timestamp must not be in the future
// - The block's difficulty must match the turn of the signer
// - The block's size must be within the protocol's bounds
// - The block must be a valid seal according to the consensus engine
//
// These are the validation rules for London blocks:
// - The header's base fee must be correct.
func (v *BlockValidator) ValidateHeader(header *types.Header) error {
    // ... validation logic for timestamp, gas, etc. ...
    return v.engine.VerifyHeader(v.bc, header, nil)
}

// ValidateBody validates a block body using the consensus engine and contextual
// validation rules held by the validator.
func (v *BlockValidator) ValidateBody(block *types.Block) error {
	// Check whether the block's uncles are valid.
	if err := v.engine.VerifyUncles(v.bc, block); err != nil {
		return err
	}
	// Check whether the block's transactions are valid.
	if hash := types.DeriveSha(block.Transactions(), trie.NewStackTrie(nil)); hash != block.TxHash() {
		return fmt.Errorf("transaction root hash mismatch: got %x, want %x", hash, block.TxHash())
	}
	// Check whether the block's withdrawals are valid.
	if v.config.IsShanghai(nil, block.Time()) {
		if err := v.engine.VerifyWithdrawals(v.bc, block); err != nil {
			return err
		}
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/gas.go">
```go
const (
	// GasQuickStep is the gas cost for the quickest tier of operations.
	GasQuickStep uint64 = 2
	// GasFastestStep is the gas cost for the fastest tier of operations.
	GasFastestStep uint64 = 3
	// GasFastStep is the gas cost for the fast tier of operations.
	GasFastStep uint64 = 5
	// GasMidStep is the gas cost for the mid tier of operations.
	GasMidStep uint64 = 8
	// GasSlowStep is the gas cost for the slow tier of operations.
	GasSlowStep uint64 = 10
	// GasExtStep is the gas cost for the external tier of operations.
	GasExtStep uint64 = 20

	// GasTx is the gas cost for the transaction.
	GasTx uint64 = 21000
	// GasTxContractCreation is the gas cost for the contract creation transaction.
	GasTxContractCreation uint64 = 53000
	// GasTxDataZero is the gas cost for the zero data byte of a transaction.
	GasTxDataZero uint64 = 4
	// GasTxDataNonZeroFrontier is the gas cost for the non-zero data byte of a transaction before the Istanbul fork.
	GasTxDataNonZeroFrontier uint64 = 68
	// GasTxDataNonZeroEIP2028 is the gas cost for the non-zero data byte of a transaction after the Istanbul fork.
	GasTxDataNonZeroEIP2028 uint64 = 16
    // ... and many more gas constants ...
)

// GasTable returns the gas table for a given hard fork.
func GasTable(rules Rules) vm.GasTable {
	if rules.IsCancun {
		return CancunGasTable
	}
	if rules.IsShanghai {
		return ShanghaiGasTable
	}
	if rules.IsLondon {
		return LondonGasTable
	}
	if rules.IsBerlin {
		return BerlinGasTable
	}
	if rules.IsIstanbul {
		return IstanbulGasTable
	}
	if rules.IsConstantinople {
		return ConstantinopleGasTable
	}
	if rules.IsByzantium {
		return ByzantiumGasTable
	}
	if rules.IsEIP158 {
		return EIP158GasTable
	}
	if rules.IsEIP150 {
		return EIP150GasTable
	}
	return FrontierGasTable
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
// Transaction is an Ethereum transaction.
type Transaction struct {
	inner TxData
	time  time.Time

	// caches
	hash atomic.Pointer[common.Hash]
	size atomic.Uint64
	from atomic.Pointer[common.Address]
}

// TxData is the underlying data of a transaction.
// This interface is implemented by LegacyTx, AccessListTx, DynamicFeeTx and BlobTx.
type TxData interface {
	// TODO: These methods should be combined into a single method.
	txType() byte
	copy() TxData
	chainID() *big.Int
	accessList() AccessList
	data() []byte
	gas() uint64
	gasPrice() *big.Int
	gasTipCap() *big.Int
	gasFeeCap() *big.Int
	value() *big.Int
	nonce() uint64
	to() *common.Address

	// Blob relevant methods.
	blobGas() uint64
	blobGasFeeCap() *big.Int
	blobHashes() []common.Hash

	setSignatureValues(chainID, v, r, s *big.Int)
	rawSignatureValues() (v, r, s *big.Int)

	// This is only implemented for signed transactions.
	sender(Signer) (common.Address, error)

	// For unsigned transactions, use sigHash.
	// For signed transactions, hash is the tx hash.
	hash() common.Hash

	encode(*bytes.Buffer) error
	decode([]byte) error

	// These methods are implemented for signed transactions.
	// They panic if called on unsigned transactions.
	effectiveGasPrice(dst *big.Int, baseFee *big.Int) *big.Int
	effectiveGasTip(dst *big.Int, baseFee *big.Int) (*big.Int, error)
	size() uint64
	marshalBinary() ([]byte, error)

	// Methods for EIP-7702 transactions
	setCodeAuths(auths []SetCodeAuthorization)
	setCodeAuthsWithSigs(sigs []rpcSetCodeAuthWithSig) error
	authList() []SetCodeAuthorization
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current execution environment.
	Context BlockContext

	// StateDB gives access to the underlying state.
	StateDB StateDB

	// Depth is the current call stack
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// chainRules contains the chain rules for the current epoch
	chainRules params.Rules

	// vmConfig contains configuration options for the EVM
	Config VMConfig

	// interpreter is the contract interpreter
	interpreter *Interpreter

	// AccessEvents tracks all state access during execution, including
	// accounts, storage slots and transient storage slots.
	AccessEvents *tracing.AccessEvents

	// readOnly is the read-only indicator, which is calculated from the initial
	// static call flag and can be changed during execution if a sub-call with different
	// static flag is being executed.
	readOnly bool
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx BlockContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig VMConfig) *EVM {
	evm := &EVM{
		Context:      blockCtx,
		StateDB:      statedb,
		chainConfig:  chainConfig,
		chainRules:   chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
		Config:       vmConfig,
		AccessEvents: tracing.NewAccessEvents(),
	}
	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}

// Call executes the contract associated with the destination address, running its
// input data as code and returning the result of the execution. Any value passed
-
// along is transferred from the caller to the destination address.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
    //...
	p, isEip7702 := evm.StateDB.GetCode(addr), false
	if len(p) == 0 && evm.chainRules.IsPrague {
		p, isEip7702 = evm.StateDB.GetDelegatedCode(addr)
	}
    //...
	if isEip7702 {
		addr, _ = types.ParseDelegation(p)
	}
    //...
	// Create a new account on the state DB if it doesn't exist, or if it's a
	// precompile that's not meant to be stateful.
	if !evm.StateDB.Exist(addr) {
		// If the EIP-158 is not active, we can't create new accounts this way
		if !evm.chainRules.IsEIP158 {
			return nil, gas, nil
		}
		evm.StateDB.CreateAccount(addr)
	}
    //...
	if evm.interpreter.readOnly {
		return nil, gas, ErrWriteProtection
	}
    //...
	// If the destination address is a precompile, run it and return
	if evm.precompile(addr) {
		return RunPrecompiledContract(p[0], input, gas)
	}
    //...
	// Create the contract object.
	code := evm.StateDB.GetCode(addr)
	codeHash := evm.StateDB.GetCodeHash(addr)

	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(addr, codeHash, code)

	// Execute the code.
	ret, err = evm.interpreter.Run(contract, input, false)
	return ret, contract.Gas, err
}

// Create executes a contract creation transaction, running the code specified
// in the input and returning the address of the new contract and leftover gas.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
    //...
	// Create a new contract address for the transaction
	contractAddr = crypto.CreateAddress(caller.Address(), evm.StateDB.GetNonce(caller.Address()))

	// Ensure the contract address is not only non-existent, but also not a precompile
	if evm.precompile(contractAddr) {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
    //...
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1)
	}
    //...
	// Create a new contract and execute the code
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCallCode(contractAddr, crypto.Keccak256Hash(code), code)

	// See EIP-3860: Limit and meter initcode
	if evm.chainRules.IsShanghai {
		if err := initCodeLimits(code, contract.Gas); err != nil {
			return nil, contractAddr, gas, err
		}
	}
    //...
	// Run the code and returned the gas left.
	ret, err = evm.interpreter.Run(contract, nil, false)
    // ...
	return ret, contractAddr, contract.Gas, err
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt is very well-structured and provides an excellent blueprint for a custom EVM framework in Zig. The concepts map cleanly to how production EVM implementations like go-ethereum are designed. I have no major corrections, but here are a few minor suggestions based on go-ethereum's implementation that could enhance the proposed Zig design:

1.  **Hardfork Management**: In go-ethereum, the `ChainConfig` struct directly contains fields for each hardfork activation block/time (e.g., `LondonBlock *big.Int`, `ShanghaiTime *uint64`). This is then used to create a `params.Rules` struct which contains simple boolean flags (`IsLondon`, `IsShanghai`). The EVM `Run` loop and opcode functions then check against these boolean flags. This is very efficient at runtime.
    *   **Suggestion**: Consider a similar pattern for your `HardforkSchedule`. The `HardforkSchedule` could have a method `get_active_rules(block_number, timestamp) -> ActiveRules` which returns a struct of booleans. This avoids repeated lookups and comparisons against the schedule during transaction execution. The `ChainConfig` itself can hold the activation numbers/timestamps.

2.  **Opcode Table Generation**: In go-ethereum, the `JumpTable` for each hardfork is constructed by starting with the previous hardfork's table and then modifying it (adding/changing opcodes). This is a clean, inheritable pattern.
    *   **Suggestion**: Your `OpcodeRegistry.init` could adopt this. Instead of a large `switch` statement in `init_chain_specific_opcodes`, you could have `init_london()`, `init_shanghai()`, etc., where each function takes the previous hardfork's registry and applies its changes. This makes the evolution of the EVM instruction set clearer.

3.  **Precompiles**: Go-ethereum defines precompiles in a `map[common.Address]PrecompiledContract`, where `PrecompiledContract` is an interface with `RequiredGas` and `Run` methods. This is a very clean and extensible pattern.
    *   **Suggestion**: Your `PrecompileRegistry` could be implemented as a hash map from `Address` to a `PrecompileImplementation` trait/interface. The `init` function could then populate this map based on the active hardfork, similar to how go-ethereum's `ActivePrecompiles` function works. This is more flexible than a simple array or list.

4.  **Gas Calculation**: In go-ethereum, dynamic gas costs are calculated by `gasFunc` functions that are part of the `operation` struct in the `JumpTable`. This keeps the gas logic tightly coupled with the opcode implementation.
    *   **Suggestion**: Your `GasSchedule` struct is a good central place, but consider attaching the dynamic gas calculation logic directly to the `OpcodeImplementation` struct as a function pointer. This is similar to your proposed `GasCostFunction` union, which is an excellent design. The key is that the main interpreter loop calls this function on the specific opcode, rather than having a monolithic `GasSchedule.get_gas_cost` that needs to switch on every opcode.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations gas price changes.
	// https://eips.ethereum.org/EIPS/eip-150
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients)

	// EIP155 implements replay-protected transaction signatures.
	// https://eips.ethereum.org/EIPS/eip-155
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements the state clearing rules.
	// https://eips.ethereum.org/EIPS/eip-158
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = no fork)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork)
	ArrowGlacierBlock   *big.Int `json::"arrowGlacierBlock,omitempty"`   // Arrow Glacier switch block (nil = no fork)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier switch block (nil = no fork)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use fork choice rules from consensus layer
	ShanghaiTime        *uint64  `json:"shanghaiTime,omitempty"`        // Shanghai switch time (nil = no fork)
	CancunTime          *uint64  `json:"cancunTime,omitempty"`          // Cancun switch time (nil = no fork)
	PragueTime          *uint64  `json:"pragueTime,omitempty"`          // Prague switch time (nil = no fork)
	VerkleTime          *uint64  `json:"verkleTime,omitempty"`          // Verkle switch time (nil = no fork)

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof of Work to Proof of Stake.
	//
	// This value is set on the execution layer client. When the total difficulty
	// exceeds this value, the client will stop importing blocks from the ethash
	// network and will begin importing blocks from the beacon chain.
	//
	// A nil value means the client will not transition to Proof of Stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag indicating that the TTD has been reached
	// and the Merge transition is complete. This is a read-only field derived from the
	// preceding one and shouldn't be set by users.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Ethash is the consensus engine based on Proof of Work.
	Ethash *EthashConfig `json:"ethash,omitempty"`
	// Clique is the consensus engine based on Proof of Authority.
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// MainnetChainConfig is the chain parameters for the Ethereum mainnet.
var MainnetChainConfig = &ChainConfig{
	ChainID:             big.NewInt(1),
	HomesteadBlock:      big.NewInt(1150000),
	DAOForkBlock:        big.NewInt(1920000),
	DAOForkSupport:      true,
	EIP150Block:         big.NewInt(2463000),
	EIP155Block:         big.NewInt(2675000),
	EIP158Block:         big.NewInt(2675000),
	ByzantiumBlock:      big.NewInt(4370000),
	ConstantinopleBlock: big.NewInt(7280000),
	PetersburgBlock:     big.NewInt(7280000),
	IstanbulBlock:       big.NewInt(9069000),
	MuirGlacierBlock:    big.NewInt(9200000),
	BerlinBlock:         big.NewInt(12244000),
	LondonBlock:         big.NewInt(12965000),
	ArrowGlacierBlock:   big.NewInt(13773000),
	GrayGlacierBlock:    big.NewInt(15050000),
	MergeNetsplitBlock:  big.NewInt(15537394),
	ShanghaiTime:        p(1681338455),
	CancunTime:          p(1710338135),
	PragueTime:          nil,
	TerminalTotalDifficulty:       big.NewInt(58750000000000000000000),
	Ethash:              new(EthashConfig),
}

// SepoliaChainConfig contains the chain parameters for the Sepolia testnet.
var SepoliaChainConfig = &ChainConfig{
	ChainID:             big.NewInt(11155111),
	HomesteadBlock:      big.NewInt(0),
	DAOForkBlock:        nil,
	DAOForkSupport:      true,
	EIP150Block:         big.NewInt(0),
	EIP155Block:         big.NewInt(0),
	EIP158Block:         big.NewInt(0),
	ByzantiumBlock:      big.NewInt(0),
	ConstantinopleBlock: big.NewInt(0),
	PetersburgBlock:     big.NewInt(0),
	IstanbulBlock:       big.NewInt(0),
	MuirGlacierBlock:    big.NewInt(0),
	BerlinBlock:         big.NewInt(0),
	LondonBlock:         big.NewInt(1735371),
	ArrowGlacierBlock:   nil,
	GrayGlacierBlock:    nil,
	MergeNetsplitBlock:  big.NewInt(1735371),
	ShanghaiTime:        p(1677557088),
	CancunTime:          p(1706655072),
	PragueTime:          nil,
	TerminalTotalDifficulty:       big.NewInt(17000000000000000),
	Ethash:              new(EthashConfig),
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Gas and refund related constants
	MaxRefundQuotient   uint64 = 5  // After EIP-3529, SSTOR refunds are capped to 1/5 of the gas used.
	SstoreSentryGasEIP2200 uint64 = 2300 // Minimum gas required to be present for an SSTORE call, not consumed
	SstoreNoopGasEIP2200   uint64 = 800  // Gas consumption of a no-op SSTORE
	SstoreDirtyGasEIP2200  uint64 = 800  // Gas consumption of a dirty SSTORE
	SstoreInitGasEIP2200   uint64 = 20000 // Gas consumption of an SSTORE that sets a slot to a non-zero value
	SstoreInitRefundEIP2200 uint64 = 19200 // Gas refund of an SSTORE that sets a slot to a non-zero value
	SstoreCleanGasEIP2200  uint64 = 5000 // Gas consumption of an SSTORE that sets a slot to a zero value
	SstoreCleanRefundEIP2200 uint64 = 4200 // Gas refund of an SSTORE that sets a slot to a zero value
	SstoreClearRefundEIP2200 uint64 = 15000 // Gas refund for clearing a slot to zero
	SstoreSetGasEIP2929      uint64 = 20000 - ColdSloadCost // Berlin gas cost for SSTORE when address is warm and slot is cold
	SstoreResetGasEIP2929    uint64 = 5000 - ColdSloadCost  // Berlin gas cost for SSTORE when address is warm and slot is warm
	SstoreClearsRefundEIP3529 uint64 = 4800
)

// Gas costs for basic EVM operations.
//
// Note: These constants are used in the form of `params.GasXXX`.
const (
	GasQuickStep   uint64 = 2
	GasFastestStep uint64 = 3
	GasFastStep    uint64 = 5
	GasMidStep     uint64 = 8
	GasSlowStep    uint64 = 10
	GasExtStep     uint64 = 20
)

// Gas costs for the KECCAK256 opcode.
const (
	Keccak256Gas     uint64 = 30
	Keccak256WordGas uint64 = 6
)

// Gas costs for the SLOAD opcode.
const (
	SloadGasEIP2200 = 800
)

// Gas costs for the various call operations.
const (
	CallGas        uint64 = 40
	CallValueGas   uint64 = 9000 // Paid for CALL when the value transfer is non-zero
	CallStipend    uint64 = 2300 // Free gas given to account during CALL
	SelfdestructGasEIP150 uint64 = 5000
	CreateGas      uint64 = 32000
)

// Pre-EIP-2929 gas costs
const (
	SloadGas               uint64 = 200
	SelfdestructRefundGas  uint64 = 24000
	CallNewAccountGas      uint64 = 25000 // Paid for CALL when the target address is not existent
)

// EIP-2929 gas costs
const (
	ColdSloadCost         = 2100
	ColdAccountAccessCost = 2600
	WarmStorageReadCost   = 100
)

const (
	// BlobTxBlobGasPerBlob is the amount of blob gas that is charged per blob in a blob transaction.
	BlobTxBlobGasPerBlob = uint64(1 << 17) // 131072
	// BlobTxMinBlobGasPrice is the minimum price of blob gas.
	BlobTxMinBlobGasPrice = uint64(1)
	// BlobGasPriceUpdateFraction is the rate at which blob gas price is updated.
	BlobGasPriceUpdateFraction = uint64(3338477)
	// BlobTxTargetBlobGasPerBlock is the target amount of blob gas to be consumed per block.
	BlobTxTargetBlobGasPerBlock = uint64(393216) // 3 blobs
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// operation is the low-level representation of a single EVM opcode.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// constantGas is the static gas charged for the operation
	constantGas uint64
	// dynamicGas is the dynamic gas charged for the operation
	dynamicGas dynamicGasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack height after operation
	maxStack int
	// memorySize returns the required memory size for the operation
	memorySize memorySizeFunc

	// Common properties derived from the above
	writes bool // determines whether this operation writes to state
	halts  bool // determines whether this operation halts execution
	jumps  bool // determines whether this operation represents a jump
}

// JumpTable contains the EVM opcodes supported by a given fork.
type JumpTable [256]*operation

// newFrontierInstructionSet returns the frontier instruction set.
func newFrontierInstructionSet() JumpTable {
	return JumpTable{
		STOP: {
			execute:     opStop,
			constantGas: 0,
			minStack:    0,
			maxStack:    0,
			halts:       true,
		},
		ADD: {
			execute:     opAdd,
			constantGas: params.GasFastestStep,
			minStack:    2,
			maxStack:    1,
		},
		// ... (many more opcodes)
		SSTORE: {
			execute:     opSstore,
			constantGas: 0,
			dynamicGas:  gasSStoreFrontier,
			minStack:    2,
			maxStack:    0,
			writes:      true,
		},
		// ...
	}
}

// newByzantiumInstructionSet returns the instruction set for the Byzantium fork.
func newByzantiumInstructionSet() JumpTable {
	// Start with Frontier and apply changes
	instructionSet := newHomesteadInstructionSet()
	instructionSet[REVERT] = &operation{
		execute:     opRevert,
		constantGas: 0,
		minStack:    2,
		maxStack:    0,
		memorySize:  memoryReturn,
		halts:       true,
	}
	// ... (other changes for Byzantium)
	return instructionSet
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for native contracts.
//
// The native contracts are implemented in Go and are rather cheap to execute.
// Their cost is not dynamic based on the amount of work they do, but is a simple
// fixed fee.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the pre-compiled contract.
	RequiredGas(input []byte) uint64

	// Run executes the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}

// PrecompiledContracts contains the default set of pre-compiled contracts used
// in the Ethereum mainnet.
var PrecompiledContracts = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// RunPrecompiledContract runs the precompiled contract specified by the address.
// This method is exported to be used in state processing since it won't be included
// in the jump table.
func RunPrecompiledContract(p PrecompiledContract, input []byte, suppliedGas uint64) (ret []byte, remainingGas uint64, err error) {
	gas := p.RequiredGas(input)
	if suppliedGas < gas {
		return nil, 0, vm.ErrOutOfGas
	}
	suppliedGas -= gas
	output, err := p.Run(input)
	if err != nil {
		return nil, 0, err
	}
	return output, suppliedGas, nil
}

// dataCopy implements the precompiled contract for data copying.
type dataCopy struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *dataCopy) RequiredGas(input []byte) uint64 {
	return params.IdentityBaseGas + uint64(len(input)+31)/32*params.IdentityPerWordGas
}

// Run executes the pre-compiled contract.
func (c *dataCopy) Run(input []byte) ([]byte, error) {
	return input, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// StateProcessor is a basic Processor, which takes care of transitioning
// state from one point to another.
//
// StateProcessor implements Processor.
type StateProcessor struct {
	config *params.ChainConfig // Chain configuration options
	engine consensus.Engine    // Consensus engine
}

// NewStateProcessor initialises a new StateProcessor.
func NewStateProcessor(config *params.ChainConfig, engine consensus.Engine) *StateProcessor {
	return &StateProcessor{
		config: config,
		engine: engine,
	}
}

// Process processes the state changes according to the Ethereum rules by running
// the transaction messages using the statedb and applying any rewards to both
// the processor (coinbase) and any included uncles.
//
// Process returns the receipts and logs accumulated during the process and
// returns the amount of gas that was used in the process. If any of the
// transactions failed to execute due to insufficient gas it will return an error.
func (p *StateProcessor) Process(block *types.Block, statedb *state.StateDB, cfg vm.Config) (*ProcessResult, error) {
	var (
		receipts    types.Receipts
		usedGas     = new(uint64)
		header      = block.Header()
		blockCtx    = NewEVMBlockContext(header, p.engine)
		allLogs     []*types.Log
		gp          = new(GasPool).AddGas(header.GasLimit)
		legacyTxs   types.Transactions
		nonLegacyTxs types.Transactions
	)
	// A new transaction will be applied on a statedb forked from the last statedb
	// The snapshot statedb will be left intact and doesn't need to be copied.
	statedb.Prepare(block.Transactions(), len(block.Transactions()))

	// Iterate over and process the individual transactions
	for i, tx := range block.Transactions() {
		if tx.Type() == types.LegacyTxType {
			legacyTxs = append(legacyTxs, tx)
		} else {
			nonLegacyTxs = append(nonLegacyTxs, tx)
		}
		statedb.SetTxContext(tx.Hash(), i)
		receipt, err := ApplyTransaction(p.config, nil, gp, statedb, header, tx, usedGas, cfg)
		if err != nil {
			return nil, err
		}
		receipts = append(receipts, receipt)
		allLogs = append(allLogs, receipt.Logs...)
	}
	// Finalize the block, applying any consensus engine specific extras (e.g. block rewards)
	var uncles []*types.Header
	if p.config.IsMuirGlacier(header.Number) {
		uncles = block.Uncles()
	}
	accumulateRewards(p.config, statedb, header, uncles)

	// The process result contains the receipts, logs, and gas used.
	// It's up to the caller to determine if the result is valid or not.
	return &ProcessResult{
		Receipts: receipts,
		Logs:     allLogs,
		GasUsed:  *usedGas,
	}, nil
}

// ApplyTransaction attempts to apply a transaction to the given state database
// and uses the input parameters for its environment. It returns the receipt
// for the transaction, interface-wrapped logs and the amount of gas used in the
// transaction. It returns an error if the transaction failed to execute.
func ApplyTransaction(config *params.ChainConfig, chain ChainContext, gp *GasPool, statedb *state.StateDB, header *types.Header, tx *types.Transaction, usedGas *uint64, cfg vm.Config) (*types.Receipt, error) {
	msg, err := tx.AsMessage(types.MakeSigner(config, header.Number, header.Time), header.BaseFee, cfg.BaseFeeRecipient)
	if err != nil {
		return nil, err
	}
	// Create a new context to be used in the EVM environment.
	blockCtx := NewEVMBlockContext(header, chain)
	vmenv := vm.NewEVM(blockCtx, vm.TxContext{
		Origin:   msg.From(),
		GasPrice: msg.GasPrice(),
	}, statedb, config, cfg)

	// Apply the transaction to the current state (included in the env).
	result, err := ApplyMessage(vmenv, msg, gp)
	if err != nil {

		return nil, err
	}

	// Update the state with pending changes.
	*usedGas += result.UsedGas

	// Create a new receipt for the transaction, storing the intermediate root and gas used
	// by the transaction.
	receipt := &types.Receipt{Type: tx.Type(), PostState: statedb.IntermediateRoot(config.IsEIP158(header.Number)).Bytes(), CumulativeGasUsed: *usedGas}
	if result.Failed() {
		receipt.Status = types.ReceiptStatusFailed
	} else {
		receipt.Status = types.ReceiptStatusSuccessful
	}
	receipt.TxHash = tx.Hash()
	receipt.GasUsed = result.UsedGas
	// If the transaction created a contract, store the creation address in the receipt.
	if msg.To() == nil {
		receipt.ContractAddress = crypto.CreateAddress(vmenv.TxContext.Origin, tx.Nonce())
	}
	// Set the receipt logs and bloom.
	receipt.Logs = statedb.GetLogs(tx.Hash())
	receipt.Bloom = types.CreateBloom(types.Receipts{receipt})
	receipt.TransactionFee = new(big.Int).Mul(new(big.Int).SetUint64(result.UsedGas), msg.GasPrice())

	// Add the optional EIP2718 fee fields for LONDON transactions.
	if tx.Type() != types.LegacyTxType {
		receipt.EffectiveGasPrice = msg.EffectiveGasPrice(header.BaseFee)
	}

	// For blob transactions, add the blob fee fields.
	if tx.Type() == types.BlobTxType {
		if !config.IsCancun(header.Time) {
			// This case should be unreachable, as the transaction pool should
			// not accept blob transactions before Cancun.
			return nil, errors.New("blob transaction in non-cancun block")
		}
		receipt.BlobGasUsed = tx.BlobGas()
		receipt.BlobGasPrice = vmenv.BlobBaseFee()
	}
	return receipt, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/ethash/consensus.go">
```go
// Finalize implements consensus.Engine, accumulating the block and uncle rewards,
// setting the final state and assembling the block.
func (ethash *Ethash) Finalize(chain consensus.ChainHeaderReader, header *types.Header, state *state.StateDB, txs []*types.Transaction, uncles []*types.Header) {
	// Accumulate any block and uncle rewards and commit the final state root
	accumulateRewards(chain.Config(), state, header, uncles)
	header.Root = state.IntermediateRoot(chain.Config().IsEIP158(header.Number))
}

// FinalizeAndAssemble implements consensus.Engine, accumulating the block and
// uncle rewards, setting the final state and assembling the block.
func (ethash *Ethash) FinalizeAndAssemble(chain consensus.ChainHeaderReader, header *types.Header, state *state.StateDB, txs []*types.Transaction, uncles []*types.Header, receipts []*types.Receipt) (*types.Block, error) {
	// Finalize block
	ethash.Finalize(chain, header, state, txs, uncles)

	// Assemble and return the final block
	return types.NewBlock(header, txs, uncles, receipts, trie.NewStackTrie(nil)), nil
}

// accumulateRewards credits the coinbase of the given block with the mining
// reward. The total reward consists of the static block reward and rewards for
// included uncles. The coinbase of each uncle block is also rewarded.
func accumulateRewards(config *params.ChainConfig, state *state.StateDB, header *types.Header, uncles []*types.Header) {
	// Select the correct block reward based on chain progression
	blockReward := FrontierBlockReward
	if config.IsByzantium(header.Number) {
		blockReward = ByzantiumBlockReward
	}
	if config.IsConstantinople(header.Number) {
		blockReward = ConstantinopleBlockReward
	}
	// Accumulate the rewards for the miner and any included uncles
	reward := new(big.Int).Set(blockReward)
	r := new(big.Int)
	for _, uncle := range uncles {
		r.Sub(uncle.Number, header.Number)
		r.Mul(r, blockReward)
		r.Div(r, big8)
		state.AddBalance(header.Coinbase, r)

		r.Div(blockReward, big32)
		reward.Add(reward, r)
	}
	state.AddBalance(header.Coinbase, reward)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/genesis.go">
```go
// Genesis specifies the header fields, difficulty, and funds of the genesis block.
type Genesis struct {
	Config     *params.ChainConfig `json:"config"`
	Nonce      uint64              `json:"nonce"`
	Timestamp  uint64              `json:"timestamp"`
	ExtraData  []byte              `json:"extraData"`
	GasLimit   uint64              `json:"gasLimit"   gencodec:"required"`
	Difficulty *big.Int            `json:"difficulty" gencodec:"required"`
	Mixhash    common.Hash         `json:"mixHash"`
	Coinbase   common.Address      `json:"coinbase"`
	Alloc      GenesisAlloc        `json:"alloc"      gencodec:"required"`

	// These fields are used for consensus tests. Please don't use them
	// in production.
	Number     uint64      `json:"number"`
	GasUsed    uint64      `json:"gasUsed"`
	ParentHash common.Hash `json:"parentHash"`
	BaseFee    *big.Int    `json:"baseFeePerGas"`
}

// GenesisAlloc specifies the initial state that is part of the genesis block.
type GenesisAlloc map[common.Address]GenesisAccount

// GenesisAccount is an account in the state of the genesis block.
type GenesisAccount struct {
	Code       []byte                      `json:"code,omitempty"`
	Storage    map[common.Hash]common.Hash `json:"storage,omitempty"`
	Balance    *big.Int                    `json:"balance" gencodec:"required"`
	Nonce      uint64                      `json:"nonce,omitempty"`
	PrivateKey []byte                      `json:"secretKey,omitempty"` // For test chains
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/clique/clique.go">
```go
// Clique is the proof-of-authority consensus engine under the EIP-225 proposal.
type Clique struct {
	config *params.CliqueConfig // Consensus engine configuration parameters
	db     ethdb.Database       // Database for retrieving and storing snapshot checkpoints

	recents    *lru.ARCCache // Snapshots for recent block to speed up reorgs
	signatures *lru.ARCCache // Signature cache to prevent constant re-verification

	proposals map[common.Address]bool // Current list of proposals we are pushing

	signer common.Address // Ethereum address of the signing key
	signFn SignerFn       // Signer function to authorize hashes with
	lock   sync.RWMutex   // Protects the signer and proposals fields
}

// Authorize injects a private key into the consensus engine to be used for
// signing blocks.
func (c *Clique) Authorize(signer common.Address, signFn SignerFn) {
	c.lock.Lock()
	defer c.lock.Unlock()

	c.signer = signer
	c.signFn = signFn
}

// Finalize implements consensus.Engine, ensuring that the block reward is zero.
func (c *Clique) Finalize(chain consensus.ChainHeaderReader, header *types.Header, state *state.StateDB, txs []*types.Transaction, uncles []*types.Header) {
	// The proof-of-authority feature is introduced as part of the Metropolis
	// fork, which means all block rewards should be zero.
	header.Root = state.IntermediateRoot(chain.Config().IsEIP158(header.Number))
	header.UncleHash = types.EmptyUncleHash
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
// OpCode is a single byte representing an instruction.
type OpCode byte

//go:generate stringer -type=OpCode -trimprefix=OP

const (
	// 0x0 range - arithmetic ops
	STOP OpCode = iota
	ADD
	MUL
	SUB
	DIV
	SDIV
	MOD
	SMOD
	ADDMOD
	MULMOD
	EXP
	SIGNEXTEND

	// 0x10 range - comparison ops
	LT OpCode = iota + 0x10
	GT
	SLT
	SGT
	EQ
	ISZERO
	AND
	OR
	XOR
	NOT
	BYTE
	SHL
	SHR
	SAR

	// 0x20 range - crypto
	KECCAK256 OpCode = iota + 0x10

	// 0x30 range - closure state
	ADDRESS OpCode = iota + 0x10
	BALANCE
	ORIGIN
	CALLER
	CALLVALUE
	CALLDATALOAD
	CALLDATASIZE
	CALLDATACOPY
	CODESIZE
	CODECOPY
	GASPRICE
	EXTCODESIZE
	EXTCODECOPY
	RETURNDATASIZE
	RETURNDATACOPY
	EXTCODEHASH

	// 0x40 range - block operations
	BLOCKHASH OpCode = iota + 0x10
	COINBASE
	TIMESTAMP
	NUMBER
	DIFFICULTY // DEPRECATED IN MERGE, USE PREVRANDAO.
	PREVRANDAO
	GASLIMIT
	CHAINID
	SELFBALANCE
	BASEFEE

	// 0x50 range - 'storage' and execution ops
	POP OpCode = iota + 0x10
	MLOAD
	MSTORE
	MSTORE8
	SLOAD
	SSTORE
	JUMP
	JUMPI
	PC
	MSIZE
	GAS
	JUMPDEST

	// 0x60 range
	PUSH1 OpCode = iota + 0x10
	PUSH2
	// ... (PUSH opcodes up to PUSH32)
	PUSH32

	// 0x80 range
	DUP1 OpCode = iota + 0x21
	DUP2
	// ... (DUP opcodes up to DUP16)
	DUP16

	// 0x90 range
	SWAP1 OpCode = iota + 0x31
	SWAP2
	// ... (SWAP opcodes up to SWAP16)
	SWAP16

	// 0xa0 range
	LOG0 OpCode = iota + 0x41
	LOG1
	LOG2
	LOG3
	LOG4

	// 0xf0 range - closures
	CREATE OpCode = iota + 0x91
	CALL
	CALLCODE
	RETURN
	DELEGATECALL
	CREATE2
	STATICCALL OpCode = iota + 0x6
	REVERT OpCode = iota + 0x2
	INVALID
	SELFDESTRUCT
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Config contains interpreter parameters.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer Tracer
	// NoBaseFee may be used to temporary disable LondonHF rules, until the formal forking.
	// This is a temporary flag, and will be removed when London is enabled on mainnet.
	NoBaseFee bool
	// EnablePreimageRecording can be used to record the preimages of SHA3
	// operations.
	EnablePreimageRecording bool
	// JumpTable contains the EVM instruction table.
	JumpTable [256]*operation
	// Type of the EWASM interpreter
	EWASMInterpreter string
	// Type of the EVM interpreter
	EVMInterpreter string
	// BaseFeeRecipient is the recipient of the base fee. This is the zero address
	// prior to bedrock, and the fee vault otherwise.
	BaseFeeRecipient common.Address
}

// EVM is the Ethereum Virtual Machine base object for the required
// computation settings and executing the EVM bytecode.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	// TxContext provides auxiliary transaction related information
	TxContext TxContext
	// StateDB gives access to the underlying state
	StateDB StateDB
	// Depth is the call depth, which is restricted to 1024
	depth int
	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig
	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules
	// virtual machine configuration options used to run the contract
	vmConfig Config
	// global gas pool for the transaction
	gasPool *GasPool
	// readOnly denotes whether the EVM is in read only state mode
	readOnly bool
	// returnData is the data returned by the last call or create
	returnData []byte
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		TxContext:   txCtx,
		StateDB:     statedb,
		chainConfig: chainConfig,
		vmConfig:    vmConfig,
		chainRules:  chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
	}
	if len(vmConfig.JumpTable) == 0 {
		// We use a shared jumptable for the frontier rules, but later forks
		// might replace this, so we'll need to listen for new blocks and
		// create new jumptables accordingly.
		switch {
		case evm.chainRules.IsCancun:
			evm.vmConfig.JumpTable = cancunInstructionSet
		case evm.chainRules.IsShanghai:
			evm.vmConfig.JumpTable = shanghaiInstructionSet
		// ... (and so on for other hardforks)
		default:
			evm.vmConfig.JumpTable = frontierInstructionSet
		}
	}
	return evm
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/blockchain.go">
```go
// BlockChain represents the canonical chain of blocks and states.
type BlockChain struct {
	chainConfig *params.ChainConfig // Chain & network configuration
	cacheConfig *CacheConfig        // Cache configuration for pruning

	db     ethdb.Database // Low level persistent database to store final content in
	snaps  *snapshot.Tree // In-memory state snapshots for recent blocks
	triegc *pruner.Pruner // Trie garbage collector logic
	gcproc time.Duration  // Accumulator for time spent in trie garbage collection

	hc            *HeaderChain
	rmLogsCh      chan struct{}
	chainHeadCh   chan ChainHeadEvent
	headBlockCh   chan BlockEvent
	headFastBlockCh chan BlockEvent
	headHeaderCh  chan HeadEvent
	scope         event.SubscriptionScope
	genesisBlock  *types.Block

	mu      sync.RWMutex // global blockchain mutex
	chainmu sync.RWMutex // protects textual part of the chain that can be modified by setHead

	currentBlock          *types.Block   // Current head of the block chain
	currentSnapBlock      *types.Block   // Current head of the fast-sync chain (used for snap-sync)
	currentFinalBlock     *types.Block   // Current head of the final block chain
	currentSafeBlock      *types.Block   // Current head of the safe block chain
	currentHeader         *types.Header  // Current head of the header chain (may be ahead of the block chain)
	currentSnapHeader     *types.Header  // Current head of the header chain during snap-sync
	currentFinalHeader    *types.Header  // Current head of the final header chain
	currentSafeHeader     *types.Header  // Current head of the safe header chain
	lastInsertion         *types.Block   // Last inserted block
	lastAnnouncedBlock    *types.Block   // Last non-bad block whose announcement is finished
	lastAnnouncedFinality *types.Block   // Last finality block which is announced
	lastAnnouncedSafe     *types.Block   // Last safe block which is announced

	stateCache   state.Database // State database to reuse between imports
	bodyCache    *lru.Cache[common.Hash, *types.Body]
	bodyRLPCache *lru.Cache[common.Hash, rlp.RawValue]
	blockCache   *lru.Cache[common.Hash, *types.Block]
	futureBlocks *lru.Cache[common.Hash, *types.Block] // Blocks whose parents are not in the chain yet

	quit          chan struct{}   // blockchain quit channel
	wg            sync.WaitGroup  // block processing & broadcasting waiting group
	running       int32           // running must be called atomically
	procInterrupt int32           // interrupt must be called atomically
	badBlocks     *lru.Cache[common.Hash, struct{}] // cache of bad blocks
	forkChoice    *ForkChoice     // fork choice implementation based on consensus events
	engine        consensus.Engine
	processor     Processor
	validator     Validator
	prefetcher    Prefetcher
	vmConfig      vm.Config
	triedb        *trie.Database

	reorgProt    *reorgProtector // Protection against deep reorgs
	postponed    *postponedBlocks
	quitReorg    chan struct{} // quite channel for reorg loop
	wgReorg      sync.WaitGroup
	pendingQueue *blockQueue // queue of non-processed blocks pushed by engine.

	wgSnap sync.WaitGroup
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/consensus.go">
```go
// Engine is an algorithm-agnostic consensus engine.
type Engine interface {
	// Author retrieves the Ethereum address of the account that minted the given
	// block, which may be different from the header's coinbase if a consensus
	// engine is based on signatures.
	Author(header *types.Header) (common.Address, error)

	// VerifyHeader checks whether a header conforms to the consensus rules of a
	// given engine. Verifying the seal may be done optionally here, or explicitly
	// via the VerifySeal method.
	VerifyHeader(chain ChainHeaderReader, header *types.Header, seal bool) error

	// VerifyHeaders is similar to VerifyHeader, but verifies a batch of headers
	// concurrently. The method returns a quit channel to abort the operations and
	// a results channel to retrieve the validation results.
	VerifyHeaders(chain ChainHeaderReader, headers []*types.Header, seals []bool) (chan<- struct{}, <-chan error)

	// VerifyUncles verifies that the given block's uncles conform to the consensus
	// rules of a given engine.
	VerifyUncles(chain ChainReader, block *types.Block) error

	// VerifySeal checks whether the crypto seal on a header is valid according to
	// the consensus rules of the given engine.
	VerifySeal(chain ChainHeaderReader, header *types.Header) error

	// Prepare initializes the consensus fields of a block header according to the
	// rules of a given engine. The method returns a header derived from the parent
	// with the consensus fields set.
	Prepare(chain ChainHeaderReader, header *types.Header) error

	// Finalize runs any post-transaction state modifications (e.g. block rewards)
	// and returns the final state root.
	//
	// Note: The block header and state database might be updated to reflect any
	// consensus rules that happen at finalization (e.g. block rewards).
	Finalize(chain ChainHeaderReader, header *types.Header, state *state.StateDB, txs []*types.Transaction, uncles []*types.Header)

	// FinalizeAndAssemble runs any post-transaction state modifications (e.g. block
	// rewards) and assembles the final block.
	//
	// Note: The block header and state database might be updated to reflect any
	// consensus rules that happen at finalization (e.g. block rewards).
	FinalizeAndAssemble(chain ChainHeaderReader, header *types.Header, state *state.StateDB, txs []*types.Transaction, uncles []*types.Header, receipts []*types.Receipt) (*types.Block, error)

	// Seal generates a new block for the given input block with the local miner's
	// seal attached.
	Seal(chain ChainHeaderReader, block *types.Block, results chan<- *types.Block, stop <-chan struct{}) error

	// SealHash returns the hash of a block prior to it being sealed.
	SealHash(header *types.Header) common.Hash

	// CalcDifficulty is the difficulty adjustment algorithm. It returns the difficulty
	// that a new block should have when created at time given the parent header.
	CalcDifficulty(chain ChainHeaderReader, time uint64, parent *types.Header) *big.Int

	// APIs returns the RPC APIs this consensus engine provides.
	APIs(chain ChainHeaderReader) []rpc.API

	// Close terminates any background threads maintained by the consensus engine.
	Close() error
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/rawdb/schema.go">
```go
var (
	// BCN is the block number to hash mapping.
	//   number:uint64 -> hash:common.Hash
	BCN = newTable("bcn-", 8)
	// Snapshots is a placeholder record to indicate that snapshots are enabled.
	Snapshots = newTable("snapshots", 0)

	// The fields below define the snapshot scheme.
	//   snapshotRootKey -> hash:common.Hash
	SnapshotRootKey = []byte("snapshotRoot")
	//   snapshotJournalKey -> rlp-list-of-hashes
	SnapshotJournalKey = []byte("snapshotJournal")
	//   snapshotGeneratorKey -> rlp-encoded-bytes
	SnapshotGeneratorKey = []byte("snapshotGenerator")
	//   snapshotDisabledKey -> bool
	SnapshotDisabledKey = []byte("snapshotDisabled")
	//   snapshotWiping = bool
	SnapshotWipingKey = []byte("snapshotWiping")

	// The fields below define the path-based storage scheme.
	// This database scheme is only used in tests. In a real node, the trie is
	// stored in a separate key-value store.
	//   Path-based storage scheme.
	//   metaDataKey -> rlp-encoded-bytes
	PathDataKey = []byte("pathData")
	//   Path-based storage scheme.
	//   metaDataKey -> rlp-encoded-bytes
	PathRootKey = []byte("pathRoot")
	//   Path-based storage scheme.
	//   path:[]byte -> data:[]byte
	Path = newTable("path-", 0)
)
```
</file>

## Prompt Corrections
The original prompt specifies a very flexible and modular framework, which is excellent for a modern EVM implementation. However, some concepts in the prompt are abstractions that don't have a direct 1:1 mapping in go-ethereum, but are instead implemented through a combination of features. Here are some clarifications that might help the implementation:

1.  **`ChainConfig.ChainType`**: In go-ethereum, the "type" of chain (e.g., Mainnet, PoA testnet) is not defined by a single enum field. Instead, it's determined by the *combination* of fields in the `params.ChainConfig` struct. For example:
    *   A chain is PoA if `ChainConfig.Clique` is not `nil`.
    *   A chain is PoW if `ChainConfig.Ethash` is not `nil`.
    *   A chain is a specific testnet or mainnet based on its `ChainID` and hardfork block numbers.
    The Zig implementation can certainly use a `ChainType` enum for convenience, but the underlying logic will likely involve checking the consensus engine configuration within the `ChainConfig`.

2.  **Custom Opcodes (`OpcodeRegistry`)**: Geth's architecture doesn't support dynamically adding custom opcodes. Instead, opcodes are gated by hardforks. The `core/vm/jump_table.go` file contains different functions (e.g., `newByzantiumInstructionSet`, `newLondonInstructionSet`) that construct a fixed array (`[256]*operation`) of opcode implementations for each hardfork. The prompt's `OpcodeRegistry` is a more extensible design, but the Geth jump table is a good reference for how to manage different sets of opcodes based on chain configuration.

3.  **`ConsensusRules.FinalityRules`**: In go-ethereum, finality is not a simple check against a `confirmation_depth`.
    *   For PoW (Ethash), finality is probabilistic and based on the "total difficulty" of a chain. A block is considered final after a certain number of confirmations, but this is a client-side convention, not a consensus rule.
    *   For PoS, finality is explicit. The consensus client (e.g., Prysm, Lighthouse) determines "justified" and "finalized" blocks based on validator votes. The execution client (geth) then receives this information via the Engine API. The Zig prompt simplifies this, which is fine, but it's important to know the real mechanism is more complex and involves a separate consensus client.

4.  **`ConsensusRules.BlockValidation`**: In go-ethereum, this is not a single struct. Block validation is split:
    *   `consensus.Engine.VerifyHeader`: Validates consensus-related fields (PoW, PoA signatures, etc.).
    *   `core.BlockChain.ValidateBody`: Validates transactions, uncles, and other body content *after* the header is verified.
    This separation of concerns (consensus vs. core validation) is a robust pattern to follow.

---

An analysis of the `go-ethereum` codebase reveals several key architectural patterns and data structures that are highly relevant to implementing the requested custom chain framework. The following snippets provide context on how Geth handles chain configuration, hardfork scheduling, opcode/gas management, and precompiled contracts.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork
	EIP150Block    *big.Int `json:"eip150Block,omitempty"`    // EIP150 HF block (nil = no fork)
	EIP155Block    *big.Int `json:"eip155Block,omitempty"`    // EIP155 HF block
	EIP158Block    *big.Int `json.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go` (`operation` struct) is responsible for both the execution logic and the gas cost of an opcode, whereas the prompt separates `OpcodeRegistry` and `GasSchedule`. While the prompt's design offers a cleaner separation of concerns, Geth's approach combines related logic for efficiency. The `operation` struct in Geth effectively serves as a single entry for both the opcode implementation and its corresponding gas cost function.

---

This is an excellent and well-structured prompt for implementing a custom chain framework. The Go-Ethereum codebase provides a production-grade reference for many of the concepts you've outlined. Here are the most relevant code snippets to guide your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations gas repricing.
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients as only gas pricing changed)

	// EIP155 implements replay-protected transaction signatures.
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements state clearing for non-existing accounts.
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = no fork, 0 = already activated)
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// MuirGlacier switch block (nil = no fork, 0 = already on MuirGlacier)
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on Berlin)
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on London)
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// ArrowGlacier switch block (nil = no fork, 0 = already on ArrowGlacier)
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// GrayGlacier switch block (nil = no fork, 0 = already on GrayGlacier)
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplit switch block (nil = no fork, 0 = already on MergeNetsplit)
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// TerminalTotalDifficulty is the total difficulty for the merge fork.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag indicating that the TTD has been reached.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Shanghai switch time (nil = no fork, 0 = already on shanghai)
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// Cancun switch time (nil = no fork, 0 = already on cancun)
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// Prague switch time (nil = no fork, 0 = already on prague)
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// Consensus engine specific parameters
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// Rules is a set of chain configuration rules based on a block number.
type Rules struct {
	ChainID *big.Int
	IsBerlin, IsLondon, IsMerge, IsShanghai, IsCancun, IsPrague, IsVerkle bool
}

// Rules returns the rule set for the given block number and time.
func (c *ChainConfig) Rules(num *big.Int, isMerge, isVerkle bool, time uint64) Rules {
	chainID := c.ChainID
	if chainID == nil {
		chainID = new(big.Int)
	}
	return Rules{
		ChainID:    chainID,
		IsBerlin:   c.IsBerlin(num),
		IsLondon:   c.IsLondon(num),
		IsMerge:    isMerge,
		IsShanghai: c.IsShanghai(time),
		IsCancun:   c.IsCancun(num, time),
		IsPrague:   c.IsPrague(num, time),
		IsVerkle:   isVerkle,
	}
}

// IsBerlin tells whether Berlin is active at the given block number.
func (c *ChainConfig) IsBerlin(num *big.Int) bool {
	return c.BerlinBlock != nil && num.Cmp(c.BerlinBlock) >= 0
}

// IsLondon tells whether London is active at the given block number.
func (c *ChainConfig) IsLondon(num *big.Int) bool {
	return c.LondonBlock != nil && num.Cmp(c.LondonBlock) >= 0
}

// IsShanghai tells whether Shanghai is active at the given timestamp.
func (c *ChainConfig) IsShanghai(time uint64) bool {
	return c.ShanghaiTime != nil && time >= *c.ShanghaiTime
}

// IsCancun tells whether Cancun is active at the given timestamp.
func (c *ChainConfig) IsCancun(num *big.Int, time uint64) bool {
	return c.CancunTime != nil && time >= *c.CancunTime
}
// ... and so on for all hardforks.

// MainnetChainConfig is the chain parameters for the Ethereum mainnet.
var MainnetChainConfig = &ChainConfig{
	ChainID:                       big.NewInt(1),
	HomesteadBlock:                big.NewInt(1150000),
	DAOForkBlock:                  big.NewInt(1920000),
	DAOForkSupport:                true,
	EIP150Block:                   big.NewInt(2463000),
	EIP150Hash:                    common.HexToHash("0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0"),
	EIP155Block:                   big.NewInt(2675000),
	EIP158Block:                   big.NewInt(2675000),
	ByzantiumBlock:                big.NewInt(4370000),
	ConstantinopleBlock:           big.NewInt(7280000),
	PetersburgBlock:               big.NewInt(7280000),
	IstanbulBlock:                 big.NewInt(9069000),
	MuirGlacierBlock:              big.NewInt(9200000),
	BerlinBlock:                   big.NewInt(12244000),
	LondonBlock:                   big.NewInt(12965000),
	ArrowGlacierBlock:             big.NewInt(13773000),
	GrayGlacierBlock:              big.NewInt(15050000),
	MergeNetsplitBlock:            big.NewInt(15537394),
	TerminalTotalDifficulty:       big.NewInt(58750000000000000000000),
	TerminalTotalDifficultyPassed: true,
	ShanghaiTime:                  u64(1681338455),
	CancunTime:                    u64(1710338135),
	Ethash:                        new(EthashConfig),
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContracts a map of address to PrecompiledContract
var PrecompiledContracts = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// PrecompiledContractsBerlin contains the precompiled contracts after the Berlin fork.
var PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// PrecompiledContractsCancun contains the precompiled contracts after the Cancun fork.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
	common.BytesToAddress([]byte{10}): &pointEvaluation{},
}

// PrecompiledContract is the interface for a native contract.
//
// Note: Precompiled contracts should not modify the state.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the pre-compiled contract.
	RequiredGas(input []byte) uint64

	// Run executes the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}
// ...
// implementation of ecrecover, sha256hash, etc.
// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// JumpTable contains the EVM opcodes supported by a given EVM
// instatiation.
type JumpTable [256]*operation

// newParisInstructionSet returns the instruction set for the Paris hard fork.
func newParisInstructionSet() JumpTable {
	// Start with the instruction set of the previous fork
	instructionSet := newLondonInstructionSet()
	// Add the new opcode
	instructionSet[PREVRANDAO] = &operation{
		execute:     opPrevrandao,
		constantGas: GasQuickStep,
		minStack:    0,
		maxStack:    1,
	}
	// The 'difficulty' is now an alias for 'prevrandao'
	instructionSet[DIFFICULTY] = instructionSet[PREVRANDAO]
	return instructionSet
}

// newShanghaiInstructionSet returns the instruction set for the Shanghai hard fork.
func newShanghaiInstructionSet() JumpTable {
	// Start with the instruction set of the previous fork
	instructionSet := newParisInstructionSet()
	// Add the new opcode
	instructionSet[PUSH0] = &operation{
		execute:     opPush0,
		constantGas: GasQuickStep,
		minStack:    0,
		maxStack:    1,
	}
	return instructionSet
}

// newCancunInstructionSet returns the instruction set for the Cancun hard fork.
func newCancunInstructionSet() JumpTable {
	// Start with the instruction set of the previous fork
	instructionSet := newShanghaiInstructionSet()
	// Add the new opcodes
	instructionSet[TLOAD] = &operation{
		execute:     opTload,
		constantGas: GasTLoad,
		minStack:    1,
		maxStack:    1,
	}
	instructionSet[TSTORE] = &operation{
		execute:     opTstore,
		constantGas: GasTStore,
		minStack:    2,
		maxStack:    0,
	}
	instructionSet[MCOPY] = &operation{
		execute:      opMcopy,
		constantGas:  GasFastestStep,
		dynamicGas:   gasMcopy,
		minStack:     3,
		maxStack:     0,
		memorySize:   memMcopy,
		writes:       true,
		reverts:      true,
		returns:      false,
		jumps:        false,
		calls:        false,
		usesStack:    true,
		usesMemory:   true,
		usesState:    false,
		needsEVM:     false,
		opName:       "MCOPY",
		opCodeString: "MCOPY",
	}
	instructionSet[BLOBHASH] = &operation{
		execute:     opBlobHash,
		constantGas: GasBlobHash,
		minStack:    1,
		maxStack:    1,
	}
	instructionSet[BLOBBASEFEE] = &operation{
		execute:     opBlobBaseFee,
		constantGas: GasQuickStep,
		minStack:    0,
		maxStack:    1,
	}
	return instructionSet
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas costs for basic operations.
const (
	GasQuickStep   = 2
	GasFastestStep = 3
	GasFastStep    = 5
	GasMidStep     = 8
	GasSlowStep    = 10
	GasExtStep     = 20
)
// Gas costs for reading and writing state.
const (
	SloadGas          = 50
	SstoreSetGas      = 20000
	SstoreResetGas    = 5000
	SstoreClearGas    = 5000
	SstoreRefundGas   = 15000
	JumpdestGas       = 1
	CreateGas         = 32000
	CallGas           = 40
	CallValueGas      = 9000
	CallStipend       = 2300
	SelfdestructGas   = 5000
	CreateDataGas     = 200
	CallCreateDepth   = 1024
	ExpByteGas        = 10
	LogGas            = 375
	CopyGas           = 3
	StackLimit        = 1024
	TierStepGas       = 0
	LogDataGas        = 8
	LogTopicGas       = 375
	Sha3Gas           = 30
	Sha3WordGas       = 6
	SstoreSentryGasEIP2200   = 2300
	SstoreNoopGasEIP2200     = 200
	SstoreDirtyGasEIP2200    = 200
	SstoreInitGasEIP2200     = 20000
	SstoreInitRefundEIP2200  = 19800
	SstoreCleanGasEIP2200    = 5000
	SstoreClearRefundEIP2200 = 15000
	SstoreDirtyRefundEIP2200 = 4800
	ColdSloadCostEIP2929     = 2100
	ColdAccountAccessCostEIP2929 = 2600
	WarmStorageReadCostEIP2929   = 100
)
// ... and many more gas constants for various EIPs ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// StateProcessor is a basic Processor, which takes care of transitioning
// state from one point to another.
//
// StateProcessor implements Process(). It is the thread-safe centre of the state
// transition logic.
type StateProcessor struct {
	config *params.ChainConfig // Chain configuration options
	engine consensus.Engine    // Consensus engine
}

// NewStateProcessor initialises a new state processor.
func NewStateProcessor(config *params.ChainConfig, engine consensus.Engine) *StateProcessor {
	return &StateProcessor{
		config: config,
		engine: engine,
	}
}

// Process processes the state changes according to the Ethereum rules by running
// the transaction messages using the statedb and applying any rewards to both
// the processor and any included uncles.
//
// Process returns the receipts, logs, and used gas for the block.
func (p *StateProcessor) Process(block *types.Block, statedb *state.StateDB, vmConfig vm.Config) (types.Receipts, []*types.Log, uint64, error) {
	var (
		receipts    types.Receipts
		usedGas     = new(uint64)
		header      = block.Header()
		blockCtx    = NewEVMBlockContext(header, p.engine.NewFakerChain(), nil)
		initialUsed = block.GasUsed()
	)
	// Mutate the state sequentially
	for i, tx := range block.Transactions() {
		statedb.SetTxContext(tx.Hash(), i)
		receipt, err := applyTransaction(p.config, nil, &initialUsed, gp, statedb, header, tx, usedGas, vmConfig)
		if err != nil {
			return nil, nil, 0, err
		}
		receipts = append(receipts, receipt)
	}
	// Finalize the block, applying any consensus engine specific extras (e.g. block rewards)
	accumulateRewards(p.config, statedb, header, block.Uncles())
	return receipts, statedb.Logs(), *usedGas, nil
}

// applyTransaction attempts to apply a transaction to the given state database
// and uses the input parameters for its environment. It returns the receipt
// for the transaction, interface{}, error.
func applyTransaction(config *params.ChainConfig, chain ChainContext, initialUsed *uint64,
	gp *GasPool, statedb *state.StateDB, header *types.Header, tx *types.Transaction,
	usedGas *uint64, vmConfig vm.Config) (*types.Receipt, error) {

	// Apply the transaction to the current state (included in the env)
	result, err := ApplyTransaction(config, chain, initialUsed, gp, statedb, header, tx, usedGas, vmConfig)
	if err != nil {
		return nil, err
	}
	// Create a new receipt for the transaction, storing the intermediate root and gas used
	// by the tx.
	receipt := types.NewReceipt(result.UsedGas, config.IsByzantium(header.Number))
	receipt.TxHash = tx.Hash()
	receipt.GasUsed = result.UsedGas
	// if the transaction created a contract, store the creation address in the receipt.
	if tx.To() == nil {
		receipt.ContractAddress = crypto.CreateAddress(result.Message().From(), tx.Nonce())
	}
	// Set the receipt logs and bloom
	receipt.Logs = statedb.GetLogs(tx.Hash())
	receipt.Bloom = types.CreateBloom(types.Receipts{receipt})
	receipt.CumulativeGasUsed = *usedGas

	return receipt, result.Err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/ethash/consensus.go">
```go
// CalcDifficulty is the difficulty adjustment algorithm. It returns
// the difficulty that a new block should have when created at time
// given the parent block's time and difficulty.
func (ethash *Ethash) CalcDifficulty(chain consensus.ChainHeaderReader, time uint64, parent *types.Header) *big.Int {
	return CalcDifficulty(chain.Config(), time, parent)
}

// Finalize implements consensus.Engine, accumulating the block and uncle rewards,
// setting the final state and assembling the block.
func (ethash *Ethash) Finalize(chain consensus.ChainHeaderReader, header *types.Header, state *state.StateDB, txs []*types.Transaction,
	uncles []*types.Header, withdrawals []*types.Withdrawal) (*types.Block, error) {
	// Accumulate any block and uncle rewards and commit the final state root
	accumulateRewards(chain.Config(), state, header, uncles)
	header.Root = state.IntermediateRoot(chain.Config().IsEIP158(header.Number))

	// Header seems complete, assemble into a block and return
	return types.NewBlock(header, txs, uncles, nil, hasher.New()), nil
}

// accumulateRewards credits the coinbase of the given block with the mining
// reward. The total reward consists of the static block reward and rewards for
// included uncles. The coinbase of each uncle block is also rewarded.
func accumulateRewards(config *params.ChainConfig, state *state.StateDB, header *types.Header, uncles []*types.Header) {
	// Select the correct block reward based on chain progression
	reward := FrontierBlockReward
	if config.IsByzantium(header.Number) {
		reward = ByzantiumBlockReward
	}
	if config.IsConstantinople(header.Number) {
		reward = ConstantinopleBlockReward
	}
	// Accumulate the rewards for the miner and any included uncles
	reward_for_miner := new(big.Int).Set(reward)
	reward_for_uncles := new(big.Int)
	for _, uncle := range uncles {
		r := new(big.Int).Add(reward, new(big.Int).Mul(uncle.Number, big8))
		r.Sub(r, header.Number)
		r.Mul(r, reward)
		r.Div(r, big8)
		state.AddBalance(uncle.Coinbase, r, tracing.BalanceChangeUncleReward)

		reward_for_uncles.Add(reward_for_uncles, new(big.Int).Div(reward, big32))
	}
	reward_for_miner.Add(reward_for_miner, reward_for_uncles)
	state.AddBalance(header.Coinbase, reward_for_miner, tracing.BalanceChangeRewardMineBlock)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tx_validator.go">
```go
// txValidator is a helper struct to encapsulate the transaction validation logic.
// The validator is not safe for concurrent use.
type txValidator struct {
	config          *params.ChainConfig
	chain           ChainHeaderReader
	currentHeader   *types.Header // The header of the current block
	gasPool         *GasPool
	statedb         *state.StateDB
	initialGasUsed  uint64
	initialBlobUsed uint64
}
// ValidateTx validates a transaction with the given state and returns a reason
// for rejection. It does not run any EVM code.
func (v *txValidator) ValidateTx(tx *types.Transaction, isLocal bool) error {
	// EIP-3860: Limit and meter initcode
	if v.config.IsShanghai(v.currentHeader.Time) {
		if err := v.validateInitCode(tx.Data()); err != nil {
			return err
		}
	}
	// SetCodeTx validation
	if tx.Type() == types.SetCodeTxType {
		if err := v.validateSetCodeTx(tx, isLocal); err != nil {
			return err
		}
	}
	// Basic checks
	if tx.Size() > types.MaxTransactionSize {
		return ErrTxTooLarge
	}
	// Drop non-local transactions under our own minimal gas price or tip
	if !isLocal && !v.validateGasPrice(tx) {
		return ErrUnderpriced
	}
	// Check whether the sender is EOA.
	if v.config.IsShanghai(v.currentHeader.Time) {
		sender, err := types.Sender(v.signer(), tx)
		if err != nil {
			return NewInvalidSenderError(err)
		}
		if v.statedb.GetCodeSize(sender) > 0 {
			return ErrSenderNoEOA
		}
	}
	// Ensure the transaction has a valid signature.
	if _, err := types.Sender(v.signer(), tx); err != nil {
		return NewInvalidSenderError(err)
	}
	// ... more checks for gas, balance, nonce, etc. ...
	return nil
}
```
</file>
</go-ethereum>

## Prompt Corrections

Your prompt is well-designed and covers the essential aspects of a modular EVM framework. The Go-Ethereum snippets above should provide excellent real-world context. Here are a few minor corrections and suggestions based on the Geth implementation:

1.  **`ChainConfig.ConsensusAlgorithm`**: In Go-Ethereum, the consensus algorithm isn't just an enum; it's an entire interface (`consensus.Engine`) with methods like `VerifyHeader`, `Finalize`, `Seal`, etc. Your `ConsensusRules` struct captures some of this, but it's worth noting that in a production system, the consensus logic is often a swappable module implementing a core interface. This is more of a design pattern observation than a correction.

2.  **`ConsensusRules.RewardDistribution`**: Your prompt models reward distribution with fields like `block_reward` and `uncle_reward_fraction`. In Go-Ethereum, these are hard-coded constants for mainnet (`FrontierBlockReward`, `ByzantiumBlockReward`, etc.) and are selected based on the active hardfork. This is a common pattern: rules are often tied to hardforks rather than being a dynamic part of the `ChainConfig` itself. Your design is more flexible, which is great for a custom framework, but Geth's approach is simpler for supporting specific known chains.

3.  **Custom Opcodes (`OpcodeRegistry`)**: The Go-Ethereum `JumpTable` is created at startup for a specific hardfork configuration (`params.Rules`). It doesn't support dynamic registration of opcodes at runtime. Your `OpcodeRegistry` is more akin to a plugin system, which is a powerful concept. The Geth `JumpTable` initialization functions (e.g., `newCancunInstructionSet`) are the best reference for how opcodes are enabled or have their gas costs changed per-fork.

4.  **`HardforkSchedule`**: Your `HardforkActivation` struct with multiple `ActivationCondition`s is more flexible than Geth's, which primarily uses block numbers and timestamps. Geth's `ChainConfig` has separate fields for each hardfork (`ByzantiumBlock`, `LondonBlock`, etc.), which is less elegant than your list-based approach but serves the same purpose. Your design is a good improvement.

Your Zig struct definitions are clear and capture the necessary components for building a flexible EVM. The provided Go-Ethereum snippets should help you flesh out the implementation details with patterns proven in a large-scale, production environment.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/config.go">
```go
// Copyright 2016 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package params

import (
	"errors"
	"fmt"
	"math"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params/forks"
)

// ...

var (
	// MainnetChainConfig is the chain parameters to run a node on the main network.
	MainnetChainConfig = &ChainConfig{
		ChainID:                 big.NewInt(1),
		HomesteadBlock:          big.NewInt(1_150_000),
		DAOForkBlock:            big.NewInt(1_920_000),
		DAOForkSupport:          true,
		EIP150Block:             big.NewInt(2_463_000),
		EIP155Block:             big.NewInt(2_675_000),
		EIP158Block:             big.NewInt(2_675_000),
		ByzantiumBlock:          big.NewInt(4_370_000),
		ConstantinopleBlock:     big.NewInt(7_280_000),
		PetersburgBlock:         big.NewInt(7_280_000),
		IstanbulBlock:           big.NewInt(9_069_000),
		MuirGlacierBlock:        big.NewInt(9_200_000),
		BerlinBlock:             big.NewInt(12_244_000),
		LondonBlock:             big.NewInt(12_965_000),
		ArrowGlacierBlock:       big.NewInt(13_773_000),
		GrayGlacierBlock:        big.NewInt(15_050_000),
		TerminalTotalDifficulty: MainnetTerminalTotalDifficulty, // 58_750_000_000_000_000_000_000
		ShanghaiTime:            newUint64(1681338455),
		CancunTime:              newUint64(1710338135),
		PragueTime:              newUint64(1746612311),
		DepositContractAddress:  common.HexToAddress("0x00000000219ab540356cbb839cbe05303d7705fa"),
		Ethash:                  new(EthashConfig),
		BlobScheduleConfig: &BlobScheduleConfig{
			Cancun: DefaultCancunBlobConfig,
			Prague: DefaultPragueBlobConfig,
		},
	}
	// SepoliaChainConfig contains the chain parameters to run a node on the Sepolia test network.
	SepoliaChainConfig = &ChainConfig{
		ChainID:                 big.NewInt(11155111),
		HomesteadBlock:          big.NewInt(0),
		DAOForkBlock:            nil,
		DAOForkSupport:          true,
		EIP150Block:             big.NewInt(0),
		EIP155Block:             big.NewInt(0),
		EIP158Block:             big.NewInt(0),
		ByzantiumBlock:          big.NewInt(0),
		ConstantinopleBlock:     big.NewInt(0),
		PetersburgBlock:         big.NewInt(0),
		IstanbulBlock:           big.NewInt(0),
		MuirGlacierBlock:        big.NewInt(0),
		BerlinBlock:             big.NewInt(0),
		LondonBlock:             big.NewInt(0),
		ArrowGlacierBlock:       nil,
		GrayGlacierBlock:        nil,
		TerminalTotalDifficulty: big.NewInt(17_000_000_000_000_000),
		MergeNetsplitBlock:      big.NewInt(1735371),
		ShanghaiTime:            newUint64(1677557088),
		CancunTime:              newUint64(1706655072),
		PragueTime:              newUint64(1741159776),
		DepositContractAddress:  common.HexToAddress("0x7f02c3e3c98b133055b8b348b2ac625669ed295d"),
		Ethash:                  new(EthashConfig),
		BlobScheduleConfig: &BlobScheduleConfig{
			Cancun: DefaultCancunBlobConfig,
			Prague: DefaultPragueBlobConfig,
		},
	}
	// ...
)

// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)

	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes (https://github.com/ethereum/EIPs/issues/150)
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork, 0 = already activated)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = same as Constantinople)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork, 0 = already on istanbul)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Eip-2384 (bomb delay) switch block (nil = no fork, 0 = already activated)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork, 0 = already on berlin)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork, 0 = already on london)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Eip-4345 (bomb delay) switch block (nil = no fork, 0 = already activated)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Eip-5133 (bomb delay) switch block (nil = no fork, 0 = already activated)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use as a network splitter

	// Fork scheduling was switched from blocks to timestamps here

	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"` // Shanghai switch time (nil = no fork, 0 = already on shanghai)
	CancunTime   *uint64 `json:"cancunTime,omitempty"`   // Cancun switch time (nil = no fork, 0 = already on cancun)
	PragueTime   *uint64 `json:"pragueTime,omitempty"`   // Prague switch time (nil = no fork, 0 = already on prague)
	OsakaTime    *uint64 `json:"osakaTime,omitempty"`    // Osaka switch time (nil = no fork, 0 = already on osaka)
	VerkleTime   *uint64 `json:"verkleTime,omitempty"`   // Verkle switch time (nil = no fork, 0 = already on verkle)

	// TerminalTotalDifficulty is the amount of total difficulty reached by
	// the network that triggers the consensus upgrade.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	DepositContractAddress common.Address `json:"depositContractAddress,omitempty"`

	// ...

	// Various consensus engines
	Ethash             *EthashConfig       `json:"ethash,omitempty"`
	Clique             *CliqueConfig       `json:"clique,omitempty"`
	BlobScheduleConfig *BlobScheduleConfig `json:"blobSchedule,omitempty"`
}

// ...

// BlobConfig specifies the target and max blobs per block for the associated fork.
type BlobConfig struct {
	Target         int    `json:"target"`
	Max            int    `json:"max"`
	UpdateFraction uint64 `json:"baseFeeUpdateFraction"`
}

// BlobScheduleConfig determines target and max number of blobs allow per fork.
type BlobScheduleConfig struct {
	Cancun *BlobConfig `json:"cancun,omitempty"`
	Prague *BlobConfig `json:"prague,omitempty"`
	Osaka  *BlobConfig `json:"osaka,omitempty"`
	Verkle *BlobConfig `json:"verkle,omitempty"`
}

// IsHomestead returns whether num is either equal to the homestead block or greater.
func (c *ChainConfig) IsHomestead(num *big.Int) bool {
	return isBlockForked(c.HomesteadBlock, num)
}

// ... (other Is... methods follow the same pattern)

// IsCancun returns whether time is either equal to the Cancun fork time or greater.
func (c *ChainConfig) IsCancun(num *big.Int, time uint64) bool {
	return c.IsLondon(num) && isTimestampForked(c.CancunTime, time)
}

// ...

// Rules wraps ChainConfig and is merely syntactic sugar or can be used for functions
// that do not have or require information about the block.
//
// Rules is a one time interface meaning that it shouldn't be used in between transition
// phases.
type Rules struct {
	ChainID                                                 *big.Int
	IsHomestead, IsEIP150, IsEIP155, IsEIP158               bool
	IsEIP2929, IsEIP4762                                    bool
	IsByzantium, IsConstantinople, IsPetersburg, IsIstanbul bool
	IsBerlin, IsLondon                                      bool
	IsMerge, IsShanghai, IsCancun, IsPrague, IsOsaka        bool
	IsVerkle                                                bool
}

// Rules ensures c's ChainID is not nil.
func (c *ChainConfig) Rules(num *big.Int, isMerge bool, timestamp uint64) Rules {
	chainID := c.ChainID
	if chainID == nil {
		chainID = new(big.Int)
	}
	// ...
	return Rules{
		ChainID:          new(big.Int).Set(chainID),
		IsHomestead:      c.IsHomestead(num),
		IsEIP150:         c.IsEIP150(num),
		IsEIP155:         c.IsEIP155(num),
		IsEIP158:         c.IsEIP158(num),
		IsByzantium:      c.IsByzantium(num),
		IsConstantinople: c.IsConstantinople(num),
		IsPetersburg:     c.IsPetersburg(num),
		IsIstanbul:       c.IsIstanbul(num),
		IsBerlin:         c.IsBerlin(num),
		IsEIP2929:        c.IsBerlin(num) && !isVerkle,
		IsLondon:         c.IsLondon(num),
		IsMerge:          isMerge,
		IsShanghai:       isMerge && c.IsShanghai(num, timestamp),
		IsCancun:         isMerge && c.IsCancun(num, timestamp),
		IsPrague:         isMerge && c.IsPrague(num, timestamp),
		IsOsaka:          isMerge && c.IsOsaka(num, timestamp),
		IsVerkle:         isVerkle,
		IsEIP4762:        isVerkle,
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/protocol_params.go">
```go
// Copyright 2015 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package params

import (
	"math/big"
)

const (
	// ...
	CallNewAccountGas     uint64 = 25000 // Paid for CALL when the destination address didn't exist prior.
	TxGas                 uint64 = 21000 // Per transaction not creating a contract. NOTE: Not payable on data of calls between transactions.
	TxGasContractCreation uint64 = 53000 // Per transaction that creates a contract. NOTE: Not payable on data of calls between transactions.
	TxDataZeroGas         uint64 = 4     // Per byte of data attached to a transaction that equals zero. NOTE: Not payable on data of calls between transactions.
	QuadCoeffDiv          uint64 = 512   // Divisor for the quadratic particle of the memory cost equation.
	LogDataGas            uint64 = 8     // Per byte in a LOG* operation's data.
	CallStipend           uint64 = 2300  // Free gas given at beginning of call.

	// ...

	SstoreSetGas    uint64 = 20000 // Once per SSTORE operation.
	SstoreResetGas  uint64 = 5000  // Once per SSTORE operation if the zeroness changes from zero.
	SstoreClearGas  uint64 = 5000  // Once per SSTORE operation if the zeroness doesn't change.
	SstoreRefundGas uint64 = 15000 // Once per SSTORE operation if the zeroness changes to zero.

	NetSstoreNoopGas  uint64 = 200   // Once per SSTORE operation if the value doesn't change.
	NetSstoreInitGas  uint64 = 20000 // Once per SSTORE operation from clean zero.
	NetSstoreCleanGas uint64 = 5000  // Once per SSTORE operation from clean non-zero.
	NetSstoreDirtyGas uint64 = 200   // Once per SSTORE operation from dirty.
	// ...
	ColdAccountAccessCostEIP2929 = uint64(2600) // COLD_ACCOUNT_ACCESS_COST
	ColdSloadCostEIP2929         = uint64(2100) // COLD_SLOAD_COST
	WarmStorageReadCostEIP2929   = uint64(100)  // WARM_STORAGE_READ_COST

	// ...

	// EIP-4844: Shard Blob Transactions
	// ...
	BlobTxBytesPerFieldElement         = 32      // Size in bytes of a field element
	BlobTxFieldElementsPerBlob         = 4096    // Number of field elements stored in a single data blob
	BlobTxBlobGasPerBlob               = 1 << 17 // Gas consumption of a single data blob (== blob byte size)
	BlobTxMinBlobGasprice              = 1       // Minimum gas price for data blobs
	BlobTxPointEvaluationPrecompileGas = 50000   // Gas price for the point evaluation precompile.

	// ...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts.go">
```go
// Copyright 2015 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// PrecompiledContract is the interface for native contracts.
//
// Note: Orders of arguments in native contracts are same as in EVM,
// which means data is constructing by method selector and arguments
// based on right-to-left rule.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}

var (
	// PrecompiledContractsBerlin contains the default set of pre-compiled contracts used
	// in the Berlin release.
	PrecompiledContractsBerlin = newPrecompiles(berlinPrecompiles)
	// PrecompiledContractsCancun contains the default set of pre-compiled contracts used
	// in the Cancun release.
	PrecompiledContractsCancun = newPrecompiles(cancunPrecompiles)
	// PrecompiledContractsPrague contains the default set of pre-compiled contracts used
	// in the Prague release.
	PrecompiledContractsPrague = newPrecompiles(praguePrecompiles)
	// ...
)

// newPrecompiles returns a new copy of the precompile map.
func newPrecompiles(p precompileSet) map[common.Address]PrecompiledContract {
	// ...
}

// precompileSet contains the precompiled contracts for a specific hardfork.
type precompileSet struct {
	// static precompiles, cannot be overridden
	ecrecover         common.Address
	sha256hash        common.Address
	ripemd160hash     common.Address
	identity          common.Address
	modexp            common.Address
	ecadd             common.Address
	ecmul             common.Address
	ecpairing         common.Address
	blake2f           common.Address
	kzgPointEvaluation common.Address

	// overridable precompiles
	// ...
}

// berlinPrecompiles has the precompiles after the Berlin hard fork.
var berlinPrecompiles = precompileSet{
	ecrecover:         common.Address{1},
	sha256hash:        common.Address{2},
	ripemd160hash:     common.Address{3},
	identity:          common.Address{4},
	modexp:            common.Address{5},
	ecadd:             common.Address{6},
	ecmul:             common.Address{7},
	ecpairing:         common.Address{8},
	blake2f:           common.Address{9},
}

// cancunPrecompiles has the precompiles after the Cancun hard fork.
var cancunPrecompiles = precompileSet{
	ecrecover:         common.Address{1},
	sha256hash:        common.Address{2},
	ripemd160hash:     common.Address{3},
	identity:          common.Address{4},
	modexp:            common.Address{5},
	ecadd:             common.Address{6},
	ecmul:             common.Address{7},
	ecpairing:         common.Address{8},
	blake2f:           common.Address{9},
	kzgPointEvaluation: common.Address{10},
}
// ...

// ActivePrecompiles returns the precompiled contracts for the given chain configuration.
func ActivePrecompiles(rules params.Rules) map[common.Address]PrecompiledContract {
	if rules.IsPrague {
		return PrecompiledContractsPrague
	}
	if rules.IsCancun {
		return PrecompiledContractsCancun
	}
	// ...
	return PrecompiledContractsBerlin
}

// RunPrecompiledContract runs the precompiled contract specified by the address.
func RunPrecompiledContract(p PrecompiledContract, input []byte, suppliedGas uint64) (ret []byte, remainingGas uint64, err error) {
	gas := p.RequiredGas(input)
	if suppliedGas < gas {
		return nil, 0, ErrOutOfGas
	}
	suppliedGas -= gas
	output, err := p.Run(input)
	return output, suppliedGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/jumptable.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"github.com/ethereum/go-ethereum/params"
)

// JumpTable is a map of opcodes to their implementations.
type JumpTable [256]operation

var (
	frontierInstructionSet         = newFrontierInstructionSet()
	homesteadInstructionSet        = newHomesteadInstructionSet()
	tangerineWhistleInstructionSet = newTangerineWhistleInstructionSet()
	spuriousDragonInstructionSet   = newSpuriousDragonInstructionSet()
	byzantiumInstructionSet        = newByzantiumInstructionSet()
	constantinopleInstructionSet   = newConstantinopleInstructionSet()
	petersburgInstructionSet       = newPetersburgInstructionSet()
	istanbulInstructionSet         = newIstanbulInstructionSet()
	berlinInstructionSet           = newBerlinInstructionSet()
	londonInstructionSet           = newLondonInstructionSet()
	shanghaiInstructionSet         = newShanghaiInstructionSet()
	cancunInstructionSet           = newCancunInstructionSet()
	pragueInstructionSet           = newPragueInstructionSet()
)

// newJumpTable returns a jump table with the opcodes enabled at the given ChainConfig and block number.
func newJumpTable(rules params.Rules) *JumpTable {
	if rules.IsPrague {
		return &pragueInstructionSet
	}
	if rules.IsCancun {
		return &cancunInstructionSet
	}
	if rules.IsShanghai {
		return &shanghaiInstructionSet
	}
	if rules.IsLondon {
		return &londonInstructionSet
	}
	if rules.IsBerlin {
		return &berlinInstructionSet
	}
	if rules.IsIstanbul {
		return &istanbulInstructionSet
	}
	if rules.IsPetersburg {
		return &petersburgInstructionSet
	}
	if rules.IsConstantinople {
		return &constantinopleInstructionSet
	}
	if rules.IsByzantium {
		return &byzantiumInstructionSet
	}
	if rules.IsEIP158 {
		return &spuriousDragonInstructionSet
	}
	if rules.IsEIP150 {
		return &tangerineWhistleInstructionSet
	}
	if rules.IsHomestead {
		return &homesteadInstructionSet
	}
	return &frontierInstructionSet
}

func newCancunInstructionSet() JumpTable {
	instructionSet := newShanghaiInstructionSet()
	instructionSet[TLOAD] = operation{
		execute:     opTload,
		gasCost:     GasTLoad,
		validate:    stack_1_1,
		memsize:     nil,
		minStack:    minStack(1, 1),
		maxStack:    maxStack(1, 1),
		address:     false,
		jumps:       false,
		writes:      false,
		returns:     false,
		reverts:     false,
		valid:       true,
		name:        "TLOAD",
		dynamicGas:  nil,
		extraGas:    0,
		memorySize:  nil,
		isPush:      false,
		pushes:      false,
		reads:       false,
		halts:       false,
		addsTop:     0,
		removesTop:  1,
		tier:        0,
		unconstrained: false,
	}
	// ... (other Cancun opcodes)
	return instructionSet
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/opcodes.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"fmt"
)

// OpCode is a single byte representing an opcode of the Ethereum Virtual Machine.
type OpCode byte

const (
	// 0x0 range - arithmetic ops
	STOP OpCode = iota
	ADD
	MUL
	SUB
	DIV
	SDIV
	MOD
	SMOD
	ADDMOD
	MULMOD
	EXP
	SIGNEXTEND
	// ...
	PUSH0 OpCode = 0x5f
	// 0x60 range - push ops
	PUSH1
	PUSH2
	// ...
	PUSH32 OpCode = 0x7f
	// ...
)

// ...

// opPush0 is the PUSH0 opcode.
// It is only enabled in Shanghai.
func opPush0(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	scope.Stack.push(U256(0))
	return nil, nil
}

// opPush is the PUSH opcode.
// It is a template function that returns an opcode implementation for a PUSH operation.
func opPush(size uint64) executionFunc {
	return func(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
		start := *pc + 1
		end := start + size
		if end < start || end > uint64(len(scope.Contract.Code)) {
			return nil, ErrCodeStoreOutOfGas
		}
		// The value is taken from the memory and NOT from the stack.
		val := U256(common.RightPadBytes(scope.Contract.Code[start:end], 32))
		scope.Stack.push(val)
		*pc += size
		return nil, nil
	}
}

// opAdd is the ADD opcode.
func opAdd(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	x, y := scope.Stack.pop(), scope.Stack.peek()
	y.Add(x, y)
	return nil, nil
}

// opSstore is the SSTORE opcode.
func opSstore(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	loc := scope.Stack.pop()
	val := scope.Stack.pop()
	return nil, scope.StateDB.SetState(scope.Contract.Address(), loc.Bytes32(), val.Bytes32())
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/types/transaction.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package types

import (
	"errors"
	"io"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/rlp"
)

//go:generate go run github.com/fjl/gencodec -type Transaction -field-override transactionMarshaling -out gen_tx_json.go

// Transaction represents an Ethereum transaction.
type Transaction struct {
	inner TxData    // Consensus contents of a transaction
	time  time.Time // Time first seen locally
}

// TxData is the underlying data of a transaction.
//
// This is a sensitive interface. The RLP encoding of a transaction is the RLP
// encoding of its TxData. If you want to add a new transaction type, you must also
// add it to the list of allowed transaction types in the NewTx function.
type TxData interface {
	// "read only" methods
	TxType() byte
	Copy() TxData
	ChainID() *big.Int
	AccessList() AccessList
	// ... (other getter methods)

	// signature values
	GetR() *big.Int
	GetS() *big.Int
	GetV() *big.Int
	SetR(*big.Int)
	SetS(*big.Int)
	SetV(*big.Int)

	// for signing
	Hash() common.Hash

	// for gas price calculation
	EffectiveGasTip(baseFee *big.Int) (*big.Int, error)

	// for marshaling
	MarshalBinary() ([]byte, error)
	encodeRLP(w io.Writer) error
}

// NewTx creates a new transaction.
func NewTx(inner TxData) *Transaction {
	// The call below is what makes this a sensitive interface.
	// We are verifying here that the transaction type is valid.
	if _, ok := txTypes[inner.TxType()]; !ok {
		panic("invalid transaction type")
	}
	return &Transaction{inner: inner}
}
// ...

// txTypes is a map of valid transaction types.
var txTypes = map[byte]reflect.Type{
	LegacyTxType:     reflect.TypeOf(LegacyTx{}),
	AccessListTxType: reflect.TypeOf(AccessListTx{}),
	DynamicFeeTxType: reflect.TypeOf(DynamicFeeTx{}),
	BlobTxType:       reflect.TypeOf(BlobTx{}),
}

// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/types/blob_tx.go">
```go
// Copyright 2022 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package types

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/crypto/kzg4844"
	"github.com/ethereum/go-ethereum/rlp"
)

// BlobTxSidecar contains the blobs of a blob transaction.
type BlobTxSidecar struct {
	Blobs       []kzg4844.Blob       // Array of blobs.
	Commitments []kzg4844.Commitment // Array of KZG commitments.
	Proofs      []kzg4844.Proof      // Array of KZG proofs.
}

// BlobTx represents a transaction with blob data.
type BlobTx struct {
	ChainID    *big.Int       // destination chain ID
	Nonce      uint64         // nonce of sender account
	GasTipCap  *big.Int       // max priority fee per gas
	GasFeeCap  *big.Int       // max fee per gas
	Gas        uint64         // gas limit
	To         *common.Address // destination of the transaction
	Value      *big.Int       // value to transfer
	Data       []byte         // contract call data
	AccessList AccessList     // EIP-2930 access list

	BlobFeeCap          *big.Int      // max fee per blob gas
	BlobHashes          []common.Hash // EIP-4844 blob versioned hashes
	Sidecar             *BlobTxSidecar `rlp:"-"` // EIP-4844 sidecar that contains the blobs.
	yParity             *big.Int       // Signature Y parity
	r, s                *big.Int       // Signature values
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

// Package params contains the consensus and network parameters for Ethereum.
package params

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/consensus/misc/eip4844"
)

// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own

// set of configuration options.
type ChainConfig struct {
	ChainID             *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection
	HomesteadBlock      *big.Int `json:"homesteadBlock,omitempty"`
	DAOForkBlock        *big.Int `json:"daoForkBlock,omitempty"`
	DAOForkSupport      bool     `json:"daoForkSupport,omitempty"`
	EIP150Block         *big.Int `json:"eip150Block,omitempty"`
	EIP150Hash          common.Hash `json:"eip150Hash,omitempty"`
	EIP155Block         *big.Int `json:"eip155Block,omitempty"`
	EIP158Block         *big.Int `json:"eip158Block,omitempty"`
	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from proof of work to proof of stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`
	// TerminalTotalDifficultyPassed is a flag specifying that the network has passed the
	// terminal total difficulty. This is a non-consensus field.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// The following fields are for post-merge netowrks
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`
	CancunTime   *uint64 `json:"cancunTime,omitempty"`
	PragueTime   *uint64 `json:"pragueTime,omitempty"`
	OsakaTime    *uint64 `json:"osakaTime,omitempty"` // OP-mainnet Fjord fork, not yet on ethereum mainnet
	VerkleTime   *uint64 `json:"verkleTime,omitempty"`

	// Consensus fields
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`

	// Blob-related configuration items for Cancun.
	//
	// Note: these values are defined by the EIPs and are not subject to any
	// runtime configuration.
	BlobScheduleConfig *BlobScheduleConfig `json:"blobScheduleConfig,omitempty"`
}

// MainnetChainConfig is the chain parameters for the mainnet.
var MainnetChainConfig = &ChainConfig{
	ChainID:             big.NewInt(1),
	HomesteadBlock:      big.NewInt(1150000),
	DAOForkBlock:        big.NewInt(1920000),
	DAOForkSupport:      true,
	EIP150Block:         big.NewInt(2463000),
	EIP150Hash:          common.HexToHash("0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0"),
	EIP155Block:         big.NewInt(2675000),
	EIP158Block:         big.NewInt(2675000),
	ByzantiumBlock:      big.NewInt(4370000),
	ConstantinopleBlock: big.NewInt(7280000),
	PetersburgBlock:     big.NewInt(7280000),
	IstanbulBlock:       big.NewInt(9069000),
	MuirGlacierBlock:    big.NewInt(9200000),
	BerlinBlock:         big.NewInt(12244000),
	LondonBlock:         big.NewInt(12965000),
	ArrowGlacierBlock:   big.NewInt(13773000),
	GrayGlacierBlock:    big.NewInt(15050000),
	MergeNetsplitBlock:  big.NewInt(15537394),

	TerminalTotalDifficulty:       big.NewInt(58750000000000000000000),
	TerminalTotalDifficultyPassed: true,

	ShanghaiTime:       uint64Ptr(1681338455),
	CancunTime:         uint64Ptr(1710338135),
	PragueTime:         uint64Ptr(1735689600), // January 1, 2025
	VerkleTime:         nil,
	BlobScheduleConfig: DefaultBlobSchedule,

	Ethash: new(EthashConfig),
}

// Rules is a convenience struct to check for hard-fork activation blocks.
type Rules struct {
	ChainID                             *big.Int
	IsHomestead, IsEIP150, IsEIP155     bool
	IsEIP158, IsByzantium, IsPetersburg bool
	IsIstanbul, IsBerlin, IsLondon      bool
	IsMerge, IsShanghai, IsCancun       bool
	IsPrague, IsOsaka, IsVerkle         bool
}

// Rules returns the rule-set of the chain configuration at a given block number.
func (c *ChainConfig) Rules(num *big.Int, time uint64) Rules {
	chainID := c.ChainID
	if chainID == nil {
		chainID = new(big.Int)
	}
	return Rules{
		ChainID:        new(big.Int).Set(chainID),
		IsHomestead:    c.IsHomestead(num),
		IsEIP150:       c.IsEIP150(num),
		IsEIP155:       c.IsEIP155(num),
		IsEIP158:       c.IsEIP158(num),
		IsByzantium:    c.IsByzantium(num),
		IsPetersburg:   c.IsPetersburg(num),
		IsIstanbul:     c.IsIstanbul(num),
		IsBerlin:       c.IsBerlin(num),
		IsLondon:       c.IsLondon(num),
		IsMerge:        c.IsMerge(num),
		IsShanghai:     c.IsShanghai(num, time),
		IsCancun:       c.IsCancun(num, time),
		IsPrague:       c.IsPrague(num, time),
		IsOsaka:        c.IsOsaka(num, time),
		IsVerkle:       c.IsVerkle(num, time),
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/consensus.go">
```go
// Engine is an algorithm-agnostic consensus engine.
type Engine interface {
	// Author retrieves the Ethereum address of the account that minted the given
	// block, which may be different from the header's coinbase if a consensus
	// engine is based on signatures.
	Author(header *types.Header) (common.Address, error)

	// VerifyHeader checks whether a header conforms to the consensus rules of a
	// given engine. Verifying the seal may be done optionally here, or explicitly
	// via the VerifySeal method.
	VerifyHeader(chain ChainReader, header *types.Header) error

	// VerifyHeaders is similar to VerifyHeader, but verifies a batch of headers
	// concurrently. The method returns a quit channel to abort the operations and
	// a results channel to retrieve the async verifications.
	VerifyHeaders(chain ChainReader, headers []*types.Header) (chan<- struct{}, <-chan error)

	// VerifySeal checks whether the crypto seal on a header is valid according to
	// the consensus rules of the given engine.
	VerifySeal(chain ChainReader, header *types.Header) error

	// Prepare initializes the consensus fields of a block header according to the
	// rules of a given engine. The changes are executed inline.
	Prepare(chain ChainReader, header *types.Header) error

	// Finalize runs any post-transaction state modifications (e.g. block rewards)
	// and assembles the final block.
	//
	// Note: The block header and state database might be updated to reflect any
	// consensus rules that happen at finalization (e.g. block rewards).
	Finalize(chain ChainReader, header *types.Header, state *state.StateDB, txs []*types.Transaction,
		uncles []*types.Header, withdrawals []*types.Withdrawal, receipts []*types.Receipt) (*types.Block, error)

	// FinalizeAndAssemble runs any post-transaction state modifications (e.g. block
	// rewards) and assembles the final block. It also returns the state of the
	// given block.
	//
	// Note: The block header and state database might be updated to reflect any
	// consensus rules that happen at finalization (e.g. block rewards).
	FinalizeAndAssemble(chain ChainReader, header *types.Header, state *state.StateDB, txs []*types.Transaction,
		uncles []*types.Header, withdrawals []*types.Withdrawal, receipts []*types.Receipt) (*state.StateDB, *types.Block, error)

	// Seal generates a new block for the given input block with the local miner's
	// seal attached.
	//
	// Note, the method returns a quit channel allowing the caller to abort the
	// sealing operation.
	Seal(chain ChainReader, block *types.Block, results chan<- *types.Block, stop <-chan struct{}) error

	// SealHash returns the hash of a block prior to it being sealed.
	SealHash(header *types.Header) common.Hash

	// CalcDifficulty is the difficulty adjustment algorithm. It returns the
	// difficulty that a new block should have.
	CalcDifficulty(chain ChainReader, time uint64, parent *types.Header) *big.Int

	// APIs returns the RPC APIs this consensus engine provides.
	APIs(chain ChainReader) []rpc.API

	// Close terminates any background threads maintained by the consensus engine.
	Close() error
}

// ChainReader defines a small collection of methods needed to access the local
// blockchain during header and/or uncle verification.
type ChainReader interface {
	// Config retrieves the chain's consensus configuration.
	Config() *params.ChainConfig

	// CurrentHeader retrieves the current head header of the canonical chain.
	CurrentHeader() *types.Header

	// GetHeader retrieves a block header from the database by hash and number.
	GetHeader(hash common.Hash, number uint64) *types.Header

	// GetHeaderByNumber retrieves a block header from the database by number.
	GetHeaderByNumber(number uint64) *types.Header

	// GetHeaderByHash retrieves a block header from the database by its hash.
	GetHeaderByHash(hash common.Hash) *types.Header

	// GetBlock retrieves a block from the database by hash and number.
	GetBlock(hash common.Hash, number uint64) *types.Block

	// GetTd retrieves a block's total difficulty from the database by hash and number.
	GetTd(hash common.Hash, number uint64) *big.Int
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// Gas costs for the EVM opcodes
var gasTable = [256]uint64{
	Stop:         0,
	Add:          GasFastestStep,
	Mul:          GasFastStep,
	Sub:          GasFastestStep,
	Div:          GasFastStep,
	Sdiv:         GasFastStep,
	Mod:          GasFastStep,
	Smod:         GasFastStep,
	Addmod:       GasMidStep,
	Mulmod:       GasMidStep,
	Exp:          GasSlowStep,
	Signextend:   GasFastStep,
	Lt:           GasFastestStep,
	Gt:           GasFastestStep,
	Slt:          GasFastestStep,
	Sgt:          GasFastestStep,
	Eq:           GasFastestStep,
	Iszero:       GasFastestStep,
	And:          GasFastestStep,
	Or:           GasFastestStep,
	Xor:          GasFastestStep,
	Not:          GasFastestStep,
	Byte:         GasFastestStep,
	Shl:          GasFastestStep,
	Shr:          GasFastestStep,
	Sar:          GasFastestStep,
	Sha3:         30,
	Address:      2,
	Balance:      0,
	Origin:       2,
	Caller:       2,
	Callvalue:    2,
	Calldataload: 3,
	Calldatasize: 2,
	Calldatacopy: 3,
	Codesize:     2,
	Codecopy:     3,
	Gasprice:     2,
	Extcodesize:  0,
	Extcodecopy:  0,
	Returndatasize: 2,
	Returndatacopy: 3,
	Extcodehash:  0,
	Blockhash:    20,
	Coinbase:     2,
	Timestamp:    2,
	Number:       2,
	Difficulty:   2,
	Gaslimit:     2,
	Pop:          2,
	Mload:        3,
	Mstore:       3,
	Mstore8:      3,
	Sload:        0,
	Sstore:       0,
	Jump:         8,
	Jumpi:        10,
	Pc:           2,
	Msize:        2,
	Gas:          2,
	Jumpdest:     1,
	Tload:        params.WarmStorageReadCost, // EIP-1153
	Tstore:       params.WarmStorageReadCost, // EIP-1153
	Mcopy:        3,                          // EIP-5656
	Push0:        2,                          // EIP-3855
	Push1:        3,
	// ... PUSH opcodes ...
	Return:       0,
	Delegatecall: 0,
	Call:         0,
	Callcode:     0,
	Revert:       0,
	Invalid:      0,
	Selfdestruct: 0,
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

// This file contains the consensus parameters for the non-beacon-related forks.
// Please note that this file is not the place for temporary fork-related parameters.
// This file is for the 'final' values that we will carry over for all future forks.

package params

import "math/big"

// These are the consensus parameters for the various hard forks.
//
// See EIP-1559 spec for how these params are used:
// https://eips.ethereum.org/EIPS/eip-1559
var (
	// Blah blah blah
	InitialBaseFee           = big.NewInt(1000000000)
	ElasticityMultiplier     = uint64(2)
	BaseFeeChangeDenominator = big.NewInt(8)
)

const (
	MaxCodeSize = 24576 // Maximum code size for a contract. See EIP-170

	// See EIP-150
	CallStipend = 2300 // A stipend for call/callcode to allow execution despite OOG in sender.

	// Pre-EIP-2200:
	SstoreSetGas    = 20000 // Once per transaction, for setting a non-zero storage value to a non-zero value.
	SstoreResetGas  = 5000  // Once per transaction, for resetting a storage value to zero.
	SstoreRefundGas = 15000 // Once per transaction, for resetting a storage value to zero (refunded).

	// EIP-2200:
	SstoreSentryGasEIP2200          = 2300  // Minimum gas required to be present for an SSTORE call, not consumed
	SstoreNoopGasEIP2200            = 800   // Gas consumption for doing a no-op SSTORE
	SstoreDirtyGasEIP2200           = 800   // Gas consumption for an SSTORE that touches a dirty slot
	SstoreInitGasEIP2200            = 20000 // Gas consumption for an SSTORE that creates a new slot
	SstoreInitRefundEIP2200         = 19200 // Gas refunded for an SSTORE that deletes a slot
	SstoreCleanRefundEIP2200        = 4200  // Gas refunded for an SSTORE that deletes a slot but writes a new value
	SstoreClearRefundEIP2200        = 15000 // Gas refunded for an SSTORE that clears a slot to original value
	SstoreResetRefundEIP2200        = 4200  // Gas refunded for an SSTORE that resets a slot to original value
	SstoreResetClearRefundEIP2200   = 19200 // Gas refunded for an SSTORE that resets a slot to original value and clears
	SstoreDeleteRefundEIP2200       = 15000 // Gas refunded for an SSTORE that deletes a slot
	SstoreDeleteWarmRefundEIP2200   = 4200  // Gas refunded for an SSTORE that deletes a slot, and it was already dirty
	SstoreRevertToOriginalGasEIP2200 = 800
	SstoreRevertToOriginalRefundEIP2200 = 4200
	SstoreRevertToOriginalClearRefundEIP2200 = 19200
	SstoreRevertToOriginalDeleteRefundEIP2200 = 15000

	// EIP-3529:
	SstoreClearsScheduleRefundEIP3529   = 4800
	SstoreSetGasEIP3529                 = 22100 // EIP-2929 + EIP-3529
	SstoreResetGasEIP3529               = 2900  // EIP-2929 + EIP-3529
	ColdsloadCostEIP2929                = 2100
	ColdaccountaccessCostEIP2929        = 2600
	WarmStorageReadCostEIP2929          = 100
	SstoreSentryGasEIP2929              = 2300
	AccessListStorageKeyCost            = 1900 // Cost per storage key in an access list
	AccessListAddressCost               = 2400 // Cost per address in an access list
)

// Gas constants for transient storage, see EIP-1153
const (
	TstoreGas = 100 // Gas cost of a TSTORE operation.
	TloadGas  = 100 // Gas cost of a TLOAD operation.
)

// Gas constants for blob transactions, see EIP-4844
const (
	BlobTxBlobGasPerBlob = uint64(1 << 17) // Gas cost per blob in a transaction.
	BlobTxMinBlobGasPrice = uint64(1)
	BlobTxTargetBlobGasPerBlock = 3 * BlobTxBlobGasPerBlob
	BlobTxMaxBlobGasPerBlock = 6 * BlobTxBlobGasPerBlob
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiled.go">
```go
// PrecompiledContract is the interface for a native contract.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jumptable.go">
```go
// JumpTable contains the EVM opcodes supported at a given fork.
type JumpTable [256]operation

var (
	frontierInstructionSet = newFrontierInstructionSet()
	homesteadInstructionSet = newHomesteadInstructionSet()
	byzantiumInstructionSet = newByzantiumInstructionSet()
	constantinopleInstructionSet = newConstantinopleInstructionSet()
	istanbulInstructionSet = newIstanbulInstructionSet()
	berlinInstructionSet = newBerlinInstructionSet()
	londonInstructionSet = newLondonInstructionSet()
	shanghaiInstructionSet = newShanghaiInstructionSet()
	cancunInstructionSet = newCancunInstructionSet()
)

// newCancunInstructionSet returns the frontier gas table with the istanbul changes.
func newCancunInstructionSet() JumpTable {
	// Start with Shanghai
	instructionSet := newShanghaiInstructionSet()
	// Add opcodes for Cancun
	instructionSet[TLOAD] = operation{
		execute:     opTload,
		gasCost:     params.TloadGas,
		validate:    makeStackFunc(1, 1),
		minStack:    minStack(1, 1),
		maxStack:    maxStack(1, 1),
		description: "Load transient storage",
	}
	instructionSet[TSTORE] = operation{
		execute:     opTstore,
		gasCost:     params.TstoreGas,
		validate:    makeStackFunc(2, 0),
		minStack:    minStack(2, 0),
		maxStack:    maxStack(2, 0),
		description: "Save transient storage",
	}
	// ... more opcodes
	return instructionSet
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/genesis.go">
```go
// Genesis specifies the header fields, starting allocation and difficulty of a
// genesis block.
type Genesis struct {
	Config     *params.ChainConfig `json:"config"`
	Nonce      uint64              `json:"nonce"`
	Timestamp  uint64              `json:"timestamp"`
	ExtraData  []byte              `json:"extraData"`
	GasLimit   uint64              `json:"gasLimit"   gencodec:"required"`
	Difficulty *big.Int            `json:"difficulty" gencodec:"required"`
	Mixhash    common.Hash         `json:"mixHash"`
	Coinbase   common.Address      `json:"coinbase"`
	Alloc      GenesisAlloc        `json:"alloc"      gencodec:"required"`

	// These fields are used for consensus tests. Please don't use them
	// in production.
	Number     uint64      `json:"number"`
	GasUsed    uint64      `json:"gasUsed"`
	ParentHash common.Hash `json:"parentHash"`

	// These fields are used for post-merge networks.
	BaseFee       *big.Int `json:"baseFeePerGas,omitempty"`
	ExcessBlobGas *uint64  `json:"excessBlobGas,omitempty"`
	BlobGasUsed   *uint64  `json:"blobGasUsed,omitempty"`

	// This field is used for verifying header a pre-shanghai header.
	// It's not a consensus-critical field and can be nil.
	WithdrawalsHash *common.Hash `json:"withdrawalsHash,omitempty"`

	// This field is used for verifying header of a pre-prague header.
	// It's not a consensus-critical field and can be nil.
	BeaconRoot *common.Hash `json:"parentBeaconBlockRoot,omitempty"`

	// This field is used for verifying header of a pre-prague header.
	// It's not a consensus-critical field and can be nil.
	RequestsHash *common.Hash `json:"requestsHash,omitempty"`

	// This is a fields to indicate that the genesis is for testing purpose.
	// It can be used to signal that the verification of the genesis fields,
	// e.g. TTD check can be skipped.
	ForTesting bool `json:"-"`
}

// GenesisAlloc specifies the initial state that is part of the genesis block.
type GenesisAlloc map[common.Address]Account

// Account is the Ethereum consensus representation of accounts.
// These objects are stored in the state database and are used by the
// consensus layer.
type Account struct {
	Code       []byte                      `json:"code,omitempty"`
	Storage    map[common.Hash]common.Hash `json:"storage,omitempty"`
	Balance    *big.Int                    `json:"balance" gencodec:"required"`
	Nonce      uint64                      `json:"nonce,omitempty"`
	PrivateKey []byte                      `json:"secretKey,omitempty"` // For custom VMs
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethclient/simulated/backend.go">
```go
// NewBackend creates a new simulated blockchain that can be used as a backend for
// contract bindings in unit tests.
//
// A simulated backend always uses chainID 1337.
func NewBackend(alloc types.GenesisAlloc, options ...func(nodeConf *node.Config, ethConf *ethconfig.Config)) *Backend {
	// Create the default configurations for the outer node shell and the Ethereum
	// service to mutate with the options afterwards
	nodeConf := node.DefaultConfig
	nodeConf.DataDir = ""
	nodeConf.P2P = p2p.Config{NoDiscovery: true}

	ethConf := ethconfig.Defaults
	ethConf.Genesis = &core.Genesis{
		Config:   params.AllDevChainProtocolChanges,
		GasLimit: ethconfig.Defaults.Miner.GasCeil,
		Alloc:    alloc,
	}
	ethConf.SyncMode = ethconfig.FullSync
	ethConf.TxPool.NoLocals = true

	for _, option := range options {
		option(&nodeConf, &ethConf)
	}
	// Assemble the Ethereum stack to run the chain with
	stack, err := node.New(&nodeConf)
	if err != nil {
		panic(err) // this should never happen
	}
	sim, err := newWithNode(stack, &ethConf, 0)
	if err != nil {
		panic(err) // this should never happen
	}
	return sim
}

// newWithNode sets up a simulated backend on an existing node. The provided node
// must not be started and will be started by this method.
func newWithNode(stack *node.Node, conf *eth.Config, blockPeriod uint64) (*Backend, error) {
	backend, err := eth.New(stack, conf)
	if err != nil {
		return nil, err
	}
	// Register the filter system
	filterSystem := filters.NewFilterSystem(backend.APIBackend, filters.Config{})
	stack.RegisterAPIs([]rpc.API{{
		Namespace: "eth",
		Service:   filters.NewFilterAPI(filterSystem),
	}})
	// Start the node
	if err := stack.Start(); err != nil {
		return nil, err
	}
	// Set up the simulated beacon
	beacon, err := catalyst.NewSimulatedBeacon(blockPeriod, common.Address{}, backend)
	if err != nil {
		return nil, err
	}
	// Reorg our chain back to genesis
	if err := beacon.Fork(backend.BlockChain().GetCanonicalHash(0)); err != nil {
		return nil, err
	}
	return &Backend{
		node:   stack,
		beacon: beacon,
		client: simClient{ethclient.NewClient(stack.Attach())},
	}, nil
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt is well-structured and provides a clear outline for a Zig implementation. However, there are a few areas where go-ethereum's design patterns could offer improvements or clarifications:

1.  **Consensus Abstraction**:
    *   The prompt's `ConsensusRules` struct mixes high-level chain parameters (like `block_gas_limit`) with low-level validation logic.
    *   **Geth's Approach**: Geth uses a `consensus.Engine` interface (`consensus/consensus.go`). This interface provides a clean separation between different consensus algorithms (like Ethash, Clique). The `ChainConfig` struct (`params/config.go`) holds the parameters, which are then passed to the `Engine` for validation.
    *   **Suggestion**: Instead of a monolithic `ConsensusRules` struct, consider adopting an `Engine` interface in Zig. This would make the consensus logic more pluggable and align better with how Geth separates concerns. The `ChainConfig` would then be the primary source of truth for parameters, passed to the `Engine` and other components as needed.

2.  **Opcode and Jump Table Management**:
    *   The prompt's `OpcodeRegistry` is excellent. It closely mirrors Geth's `JumpTable` concept.
    *   **Geth's Approach**: In `core/vm/jumptable.go`, Geth defines different "instruction sets" (e.g., `istanbulInstructionSet`, `berlinInstructionSet`) for each hardfork. A final `JumpTable` is constructed by taking a base set and applying the changes for each active hardfork.
    *   **Suggestion**: This is a great pattern to replicate. The Zig implementation could have functions that return the `OpcodeRegistry` for a specific hardfork, layering changes on top of a base (e.g., Frontier) set. This makes the evolution of the EVM explicit and easy to manage.

3.  **Custom Chain Genesis**:
    *   The prompt's `ChainConfig` includes fields like `initial_supply`, which is part of a chain's genesis state.
    *   **Geth's Approach**: Geth uses a dedicated `Genesis` struct (`core/genesis.go`) which contains the `ChainConfig` as well as the initial state allocation (`GenesisAlloc`). This provides a clear separation between the chain's *rules* (`ChainConfig`) and its *initial state* (`GenesisAlloc`).
    *   **Suggestion**: It would be beneficial to create a `Genesis` struct in Zig that contains both the `ChainConfig` and an `alloc` field, similar to Geth. This makes it easier to define custom chains with pre-funded accounts or pre-deployed contracts, a key requirement for L2s and testnets. The `ethclient/simulated/backend.go` provides a great example of how this is used in practice to spin up a new chain from a genesis definition.

By incorporating these patterns, the custom chain framework would be more modular, extensible, and closely aligned with the battle-tested architecture of `go-ethereum`.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations fork.
	// EIP150 HF block (nil = no fork)
	EIP150Block *big.Int `json:"eip150Block,omitempty"`
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"` // EIP150 HF hash (needed for header only clients)

	// EIP155 implements replay-protected transaction signatures.
	// EIP155 HF block (nil = no fork)
	EIP155Block *big.Int `json:"eip155Block,omitempty"`

	// EIP158 implements state clearing (https://github.com/ethereum/EIPs/issues/158).
	// EIP158 HF block (nil = no fork)
	EIP158Block *big.Int `json:"eip158Block,omitempty"`

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = no fork, 0 = already activated)
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// MuirGlacier switch block (nil = no fork, 0 = already on muirglacier)
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on berlin)
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on london)
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// ArrowGlacier switch block (nil = no fork, 0 = already on arrowglacier)
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// GrayGlacier switch block (nil = no fork, 0 = already on grayglacier)
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplitBlock defines the block number at which post-merge validation rules are enforced.
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// ShanghaiTime defines the timestamp at which the Shanghai rules are enforced.
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// CancunTime defines the timestamp at which the Cancun rules are enforced.
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// PragueTime defines the timestamp at which the Prague rules are enforced.
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof of Work to Proof of Stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag indicating that the TTD has been reached.
	// This is a flag only needed for header-only clients. The flag is set when a block
	// passing the TTD is confirmed by a finalized checkpoint.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Consensus engine specific parameters
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// IsHomestead returns whether the Homestead hard-fork is active at the given block number.
func (c *ChainConfig) IsHomestead(num *big.Int) bool {
	return isForked(c.HomesteadBlock, num)
}

// IsEIP150 returns whether the EIP150 hard-fork is active at the given block number.
func (c *ChainConfig) IsEIP150(num *big.Int) bool {
	return isForked(c.EIP150Block, num)
}

// IsEIP155 returns whether the EIP155 hard-fork is active at the given block number.
func (c *ChainConfig) IsEIP155(num *big.Int) bool {
	return isForked(c.EIP155Block, num)
}

// IsEIP158 returns whether the EIP158 hard-fork is active at the given block number.
func (c *ChainConfig) IsEIP158(num *big.Int) bool {
	return isForked(c.EIP158Block, num)
}

// IsByzantium returns whether the Byzantium hard-fork is active at the given block number.
func (c *ChainConfig) IsByzantium(num *big.Int) bool {
	return isForked(c.ByzantiumBlock, num)
}

// IsConstantinople returns whether the Constantinople hard-fork is active at the given block number.
func (c *ChainConfig) IsConstantinople(num *big.Int) bool {
	return isForked(c.ConstantinopleBlock, num)
}

// IsMuirGlacier returns whether the Muir Glacier hard-fork is active at the given block number.
func (c *ChainConfig) IsMuirGlacier(num *big.Int) bool {
	return isForked(c.MuirGlacierBlock, num)
}

// IsPetersburg returns whether the Petersburg hard-fork is active at the given block number.
func (c *ChainConfig) IsPetersburg(num *big.Int) bool {
	return isForked(c.PetersburgBlock, num)
}

// IsIstanbul returns whether the Istanbul hard-fork is active at the given block number.
func (c *ChainConfig) IsIstanbul(num *big.Int) bool {
	return isForked(c.IstanbulBlock, num)
}

// IsBerlin returns whether the Berlin hard-fork is active at the given block number.
func (c *ChainConfig) IsBerlin(num *big.Int) bool {
	return isForked(c.BerlinBlock, num)
}

// IsLondon returns whether the London hard-fork is active at the given block number.
func (c *ChainConfig) IsLondon(num *big.Int) bool {
	return isForked(c.LondonBlock, num)
}

// IsArrowGlacier returns whether the Arrow Glacier hard-fork is active at the given block number.
func (c *ChainConfig) IsArrowGlacier(num *big.Int) bool {
	return isForked(c.ArrowGlacierBlock, num)
}

// IsGrayGlacier returns whether the Gray Glacier hard-fork is active at the given block number.
func (c *ChainConfig) IsGrayGlacier(num *big.Int) bool {
	return isForked(c.GrayGlacierBlock, num)
}

// IsMergeNetsplit returns whether the merge netsplit hard-fork is active at the given block number.
func (c *ChainConfig) IsMergeNetsplit(num *big.Int) bool {
	return isForked(c.MergeNetsplitBlock, num)
}

// IsShanghai returns whether the Shanghai hard-fork is active at the given timestamp.
func (c *ChainConfig) IsShanghai(num *big.Int, time uint64) bool {
	return c.IsLondon(num) && isForkedTS(c.ShanghaiTime, time)
}

// IsCancun returns whether the Cancun hard-fork is active at the given timestamp.
func (c *ChainConfig) IsCancun(num *big.Int, time uint64) bool {
	return c.IsShanghai(num, time) && isForkedTS(c.CancunTime, time)
}

// IsPrague returns whether the Prague hard-fork is active at the given timestamp.
func (c *ChainConfig) IsPrague(num *big.Int, time uint64) bool {
	return c.IsCancun(num, time) && isForkedTS(c.PragueTime, time)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/networks.go">
```go
// MainnetChainConfig is the chain parameters for the Ethereum mainnet.
var MainnetChainConfig = &ChainConfig{
	ChainID:             big.NewInt(1),
	HomesteadBlock:      big.NewInt(1150000),
	DAOForkBlock:        big.NewInt(1920000),
	DAOForkSupport:      true,
	EIP150Block:         big.NewInt(2463000),
	EIP155Block:         big.NewInt(2675000),
	EIP158Block:         big.NewInt(2675000),
	ByzantiumBlock:      big.NewInt(4370000),
	ConstantinopleBlock: big.NewInt(7280000),
	PetersburgBlock:     big.NewInt(7280000),
	IstanbulBlock:       big.NewInt(9069000),
	MuirGlacierBlock:    big.NewInt(9200000),
	BerlinBlock:         big.NewInt(12244000),
	LondonBlock:         big.NewInt(12965000),
	ArrowGlacierBlock:   big.NewInt(13773000),
	GrayGlacierBlock:    big.NewInt(15050000),
	MergeNetsplitBlock:  big.NewInt(15537394),
	ShanghaiTime:        &shanghaiTime,
	CancunTime:          &cancunTime,
	PragueTime:          &pragueTime,
	Ethash:              new(EthashConfig),
}

// SepoliaChainConfig contains the chain parameters for the Sepolia testnet.
var SepoliaChainConfig = &ChainConfig{
	ChainID:             big.NewInt(11155111),
	HomesteadBlock:      big.NewInt(0),
	DAOForkBlock:        nil,
	DAOForkSupport:      true,
	EIP150Block:         big.NewInt(0),
	EIP155Block:         big.NewInt(0),
	EIP158Block:         big.NewInt(0),
	ByzantiumBlock:      big.NewInt(0),
	ConstantinopleBlock: big.NewInt(0),
	PetersburgBlock:     big.NewInt(0),
	IstanbulBlock:       big.NewInt(0),
	MuirGlacierBlock:    big.NewInt(0),
	BerlinBlock:         big.NewInt(0),
	LondonBlock:         big.NewInt(1735371),
	ArrowGlacierBlock:   nil,
	GrayGlacierBlock:    nil,
	MergeNetsplitBlock:  big.NewInt(1735371),
	ShanghaiTime:        &sepoliaShanghaiTime,
	CancunTime:          &sepoliaCancunTime,
	PragueTime:          &sepoliaPragueTime,
	Ethash:              new(EthashConfig),
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Gas limit of Geth's initial genesis block.
	GenesisGasLimit = 4712388

	// Maximum size of the genesis block's extra-data field.
	MaximumExtraDataSize = 32

	// Gas limit of a transaction.
	TxGas = 21000
	// Gas cost of a transaction that creates a contract.
	TxGasContractCreation = 53000

	// Gas cost for every byte of data or code for a transaction.
	TxDataZeroGas = 4
	// Gas cost for every non-zero byte of data or code for a transaction.
	TxDataNonZeroGasEIP2028 = 16 // EIP-2028 reduced the cost from 68 to 16.
	TxDataNonZeroGasFrontier = 68

	// Sstore set gas.
	SstoreSetGasEIP2200 = 20000
	// Sstore reset gas.
	SstoreResetGasEIP2200 = 5000
	// Sstore refund gas.
	SstoreRefundGasEIP2200 = 15000
	// Sstore clears refund.
	SstoreClearsRefundEIP3529 = 4800

	// EIP-2929 gas costs
	ColdSloadCost         = 2100
	ColdAccountAccessCost = 2600
	WarmStorageReadCost   = 100
)

// GasTable returns the gas table for a given hard fork.
func GasTable(config *ChainConfig, num *big.Int, time uint64) vm.GasTable {
	if config.IsCancun(num, time) {
		return GasTableCancun
	}
	if config.IsShanghai(num, time) {
		return GasTableShanghai
	}
	if config.IsLondon(num, time) {
		return GasTableLondon
	}
	if config.IsBerlin(num, time) {
		return GasTableBerlin
	}
	if config.IsIstanbul(num, time) {
		return GasTableIstanbul
	}
	if config.IsConstantinople(num, time) {
		return GasTableConstantinople
	}
	if config.IsByzantium(num, time) {
		return GasTableByzantium
	}
	if config.IsEIP158(num) {
		return GasTableEIP158
	}
	if config.IsEIP150(num) {
		return GasTableEIP150
	}
	if config.IsHomestead(num) {
		return GasTableHomestead
	}
	return GasTableFrontier
}

// Gas costs for Constantinople.
var GasTableConstantinople = vm.GasTable{
	ExtcodeSize:         700,
	ExtcodeCopy:         700,
	Balance:             700,
	Sload:               200,
	SstoreSet:           20000,
	SstoreReset:         5000,
	SstoreRefund:        15000,
	Jumpdest:            1,
	// ... (many more opcodes)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// operation represents an instruction in the EVM.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// constantGas is the gas required for executing the instruction
	constantGas uint64
	// dynamicGas is the dynamic gas required for executing the instruction
	dynamicGas gasFunc
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack tells how many stack items are returned
	maxStack int
	// reads return data
	readsReturnData bool
	// writes to the state
	writes bool
	// valid returns whether the operation is valid
	valid bool
	// name is the mnemonic of the instruction
	name string
}

// JumpTable contains the EVM instructions mapped by opcode.
type JumpTable [256]*operation

var (
	frontierInstructionSet         = newFrontierInstructionSet()
	homesteadInstructionSet        = newHomesteadInstructionSet()
	tangerineWhistleInstructionSet = newTangerineWhistleInstructionSet()
	spuriousDragonInstructionSet   = newSpuriousDragonInstructionSet()
	byzantiumInstructionSet        = newByzantiumInstructionSet()
	constantinopleInstructionSet   = newConstantinopleInstructionSet()
	petersburgInstructionSet       = newPetersburgInstructionSet()
	istanbulInstructionSet         = newIstanbulInstructionSet()
	berlinInstructionSet           = newBerlinInstructionSet()
	londonInstructionSet           = newLondonInstructionSet()
	shanghaiInstructionSet         = newShanghaiInstructionSet()
	cancunInstructionSet           = newCancunInstructionSet()
	pragueInstructionSet           = newPragueInstructionSet()
)

// newFrontierInstructionSet returns the frontier instruction set.
func newFrontierInstructionSet() JumpTable {
	instructionSet := JumpTable{}
	for i := 0; i < 256; i++ {
		instructionSet[i] = &operation{
			execute:     opInvalid,
			constantGas: 0,
			minStack:    0,
			maxStack:    0,
			name:        "INVALID",
		}
	}
	// ... (omitted initialization of all opcodes)
	instructionSet[STOP] = &operation{
		execute:     opStop,
		constantGas: 0,
		minStack:    0,
		maxStack:    0,
		name:        "STOP",
	}
	instructionSet[ADD] = &operation{
		execute:     opAdd,
		constantGas: GasFastestStep,
		minStack:    2,
		maxStack:    1,
		name:        "ADD",
	}
	// ... (etc for all opcodes)
	return instructionSet
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for a native contract.
//
// Note: the gas parameter is the amount of gas given to the pre-compiled
// contract, it should not be used to track gas usage. Gas usage is recorded
// separately and is returned by the Run method of the pre-compiled contract.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}

// PrecompiledContractsHomestead contains the default pre-compiled contracts for
// the Homestead hard fork.
var PrecompiledContractsHomestead = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
}

// PrecompiledContractsByzantium contains the default pre-compiled contracts for
// the Byzantium hard fork.
var PrecompiledContractsByzantium = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
}

// dataCopy implements the precompiled contract for data copying.
type dataCopy struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *dataCopy) RequiredGas(input []byte) uint64 {
	return params.IdentityBaseGas + uint64(len(input)+31)/32*params.IdentityPerWordGas
}
func (c *dataCopy) Run(input []byte) ([]byte, error) {
	return input, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/consensus.go">
```go
// Engine is an algorithm-agnostic consensus engine.
type Engine interface {
	// Author retrieves the Ethereum address of the account that minted the given
	// block, which may be different from the header's coinbase if a consensus
	// engine is based on signatures.
	Author(header *types.Header) (common.Address, error)

	// VerifyHeader checks whether a header conforms to the consensus rules of a
	// given engine. Verifying the seal may be computationally expensive, so might
	// be skipped by setting the `seal` flag to false.
	VerifyHeader(chain ChainHeaderReader, header *types.Header, seal bool) error

	// VerifyHeaders is similar to VerifyHeader, but verifies a batch of headers
	// concurrently. The method returns a quit channel to abort the operations and
	// a results channel to retrieve the async verifications.
	VerifyHeaders(chain ChainHeaderReader, headers []*types.Header, seals []bool) (chan<- struct{}, <-chan error)

	// VerifyUncles verifies that the given block's uncles conform to the consensus
	// rules of a given engine.
	VerifyUncles(chain ChainReader, block *types.Block) error

	// VerifyBody is similar to VerifyUncles, but verifies all consensus contents of
	// a block body. The method may be called with a nil block.
	//
	// Note, this method is not used in the main block validation path. It is used
	// for verifying the body of a block retrieved through `eth/66` protocol.
	VerifyBody(chain ChainReader, block *types.Block) error

	// Prepare initializes the consensus fields of a block header according to the
	// rules of a particular engine. The changes are executed inline.
	Prepare(chain ChainHeaderReader, header *types.Header) error

	// Finalize runs any post-transaction state modifications (e.g. block rewards)
	// and assembles the final block.
	//
	// Note: The block header and state database might be updated to reflect any
	// consensus rules that happen at finalization (e.g. block rewards).
	Finalize(chain ChainHeaderReader, header *types.Header, state *state.StateDB, txs []*types.Transaction,
		uncles []*types.Header, withdrawals []*types.Withdrawal)

	// FinalizeAndAssemble runs any post-transaction state modifications (e.g. block
	// rewards) and assembles the final block. It also returns the final block.
	//
	// Note: The block header and state database might be updated to reflect any
	// consensus rules that happen at finalization (e.g. block rewards).
	FinalizeAndAssemble(chain ChainHeaderReader, header *types.Header, state *state.StateDB, body *types.Body,
		receipts []*types.Receipt) (*types.Block, error)

	// Seal generates a new block for the given input block with the local miner's
	// seal attached.
	Seal(chain ChainHeaderReader, block *types.Block, results chan<- *types.Block, stop <-chan struct{}) error

	// SealHash returns the hash of a block prior to it being sealed.
	SealHash(header *types.Header) common.Hash

	// CalcDifficulty is the difficulty adjustment algorithm. It returns the difficulty
	// that a new block should have.
	CalcDifficulty(chain ChainHeaderReader, time uint64, parent *types.Header) *big.Int

	// APIs returns the RPC APIs this consensus engine provides.
	APIs(chain ChainHeaderReader) []rpc.API
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/miner/worker.go">
```go
// environment is the worker's current environment and holds all
// information of the sealing block generation.
type environment struct {
	signer   types.Signer
	state    *state.StateDB // apply state changes here
	tcount   int            // tx count in cycle
	gasPool  *core.GasPool  // available gas used to pack transactions
	coinbase common.Address
	evm      *vm.EVM

	header   *types.Header
	txs      []*types.Transaction
	receipts []*types.Receipt
	sidecars []*types.BlobTxSidecar
	blobs    int

	witness *stateless.Witness
}

// generateWork generates a sealing block based on the given parameters.
func (miner *Miner) generateWork(params *generateParams, witness bool) *newPayloadResult {
	work, err := miner.prepareWork(params, witness)
	if err != nil {
		return &newPayloadResult{err: err}
	}
	if !params.noTxs {
		interrupt := new(atomic.Int32)
		timer := time.AfterFunc(miner.config.Recommit, func() {
			interrupt.Store(commitInterruptTimeout)
		})
		defer timer.Stop()

		err := miner.fillTransactions(interrupt, work)
		if errors.Is(err, errBlockInterruptedByTimeout) {
			log.Warn("Block building is interrupted", "allowance", common.PrettyDuration(miner.config.Recommit))
		}
	}
	// ... (omitted consensus-layer requests)
	
	block, err := miner.engine.FinalizeAndAssemble(miner.chain, work.header, work.state, &body, work.receipts)
	if err != nil {
		return &newPayloadResult{err: err}
	}
	return &newPayloadResult{
		block:    block,
		fees:     totalFees(block, work.receipts),
		sidecars: work.sidecars,
		stateDB:  work.state,
		receipts: work.receipts,
		requests: requests,
		witness:  work.witness,
	}
}

// commitTransactions attempts to fill a block with transactions.
func (miner *Miner) commitTransactions(env *environment, plainTxs, blobTxs *transactionsByPriceAndNonce, interrupt *atomic.Int32) error {
	// ... (transaction selection logic)

	for {
		// Check interruption signal
		if interrupt != nil {
			if signal := interrupt.Load(); signal != commitInterruptNone {
				return signalToErr(signal)
			}
		}
		// If we don't have enough gas for any further transactions then we're done.
		if env.gasPool.Gas() < params.TxGas {
			break
		}
		// Retrieve the next transaction and abort if all done.
		// ... (logic to pick best transaction from plainTxs or blobTxs)
		
		// Start executing the transaction
		env.state.SetTxContext(tx.Hash(), env.tcount)
		err := miner.commitTransaction(env, tx)
		// ... (handle transaction result and continue)
	}
	return nil
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt is very well-structured and detailed, outlining a robust framework for custom chains in Zig. The proposed `ChainDefinition` struct and its components are logical and map well to the concepts found in mature clients like go-ethereum.

One architectural suggestion based on go-ethereum's design is to consider making the consensus engine more pluggable at the top level.

### Suggested Improvement: Pluggable Consensus Engine

The prompt defines `ConsensusAlgorithm` as an `enum` within `ChainConfig` and a `ConsensusRules` struct that seems to contain the logic. A slightly more flexible approach, similar to `go-ethereum`, is to define a `ConsensusEngine` interface (or a `struct` with function pointers in Zig) and have it be a direct field of the `ChainDefinition`.

**Current Prompt's `ChainConfig`:**
```zig
pub const ChainConfig = struct {
    // ...
    consensus_algorithm: ConsensusAlgorithm, // enum
    // ...
};
```

**Alternative (go-ethereum-style) `ChainDefinition`:**
```zig
pub const ChainDefinition = struct {
    // ...
    config: ChainConfig,
    engine: *ConsensusEngine, // A struct of function pointers
    // ...
};

pub const ConsensusEngine = struct {
    // Defines the consensus behavior, e.g., for PoW, PoA, PoS
    context: *anyopaque, // To hold engine-specific state
    
    // Function pointers for consensus logic
    verify_header: *const fn(ctx: *anyopaque, header: *const Block, parent: *const Block) !void,
    verify_body: *const fn(ctx: *anyopaque, block: *const Block) !void,
    prepare_header: *const fn(ctx: *anyopaque, header: *Block) !void,
    finalize_block: *const fn(ctx: *anyopaque, block: *Block, state: *StateDB, receipts: []const Receipt) !void,
    // ... and other consensus methods
};
```

This alternative approach more closely follows go-ethereum's `consensus.Engine` interface, making it easier to implement and inject entirely novel consensus mechanisms without modifying the core `ChainDefinition` framework. The prompt's current design is still valid and achieves a similar outcome, but this is a common pattern in blockchain clients worth considering.

