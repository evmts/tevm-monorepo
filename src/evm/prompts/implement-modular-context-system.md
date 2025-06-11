# Implement Modular Context System

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_modular_context_system` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_modular_context_system feat_implement_modular_context_system`
3. **Work in isolation**: `cd g/feat_implement_modular_context_system`
4. **Commit message**: `🏗️ feat: implement modular context system with pluggable block, transaction, and configuration contexts`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

<eli5>
Think of the modular context system like a universal adapter system for different electrical devices. Instead of needing completely different devices for different countries, you have one main device that can plug into different "context adapters" - one for European outlets, one for US outlets, one for UK outlets. Each adapter handles the specific requirements of that environment (voltage, plug shape, safety standards) while the core device stays the same. The modular context system works similarly - it can adapt the EVM to work with different blockchain environments (mainnet, testnets, Layer 2 networks) by swapping in the appropriate context modules without changing the core execution logic.
</eli5>

Implement a comprehensive modular context system that allows pluggable block contexts, transaction contexts, and configuration contexts. This enables easy customization for different blockchain environments (mainnet, testnets, L2s) while maintaining type safety and performance. The system should support runtime context switching and context inheritance.

## Modular Context System Specifications

### Core Context Framework

#### 1. Context Manager
```zig
pub const ContextManager = struct {
    allocator: std.mem.Allocator,
    config: ContextConfig,
    context_factory: ContextFactory,
    context_cache: ContextCache,
    inheritance_manager: InheritanceManager,
    
    pub const ContextConfig = struct {
        enable_context_caching: bool,
        enable_context_inheritance: bool,
        enable_runtime_switching: bool,
        max_cached_contexts: u32,
        context_validation: ContextValidation,
        inheritance_depth: u32,
        
        pub const ContextValidation = enum {
            None,       // No validation
            Basic,      // Basic type checking
            Strict,     // Full validation
            Custom,     // Custom validation hooks
        };
        
        pub fn mainnet() ContextConfig {
            return ContextConfig{
                .enable_context_caching = true,
                .enable_context_inheritance = true,
                .enable_runtime_switching = false,
                .max_cached_contexts = 100,
                .context_validation = .Strict,
                .inheritance_depth = 5,
            };
        }
        
        pub fn testnet() ContextConfig {
            return ContextConfig{
                .enable_context_caching = true,
                .enable_context_inheritance = true,
                .enable_runtime_switching = true,
                .max_cached_contexts = 50,
                .context_validation = .Basic,
                .inheritance_depth = 3,
            };
        }
        
        pub fn l2_optimized() ContextConfig {
            return ContextConfig{
                .enable_context_caching = false,
                .enable_context_inheritance = false,
                .enable_runtime_switching = true,
                .max_cached_contexts = 10,
                .context_validation = .None,
                .inheritance_depth = 1,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ContextConfig) !ContextManager {
        return ContextManager{
            .allocator = allocator,
            .config = config,
            .context_factory = try ContextFactory.init(allocator, config),
            .context_cache = try ContextCache.init(allocator, config.max_cached_contexts),
            .inheritance_manager = InheritanceManager.init(config.inheritance_depth),
        };
    }
    
    pub fn deinit(self: *ContextManager) void {
        self.context_factory.deinit();
        self.context_cache.deinit();
    }
    
    pub fn create_execution_context(self: *ContextManager, context_spec: ContextSpec) !ExecutionContext {
        // Check cache first
        if (self.config.enable_context_caching) {
            if (self.context_cache.get(context_spec)) |cached_context| {
                return cached_context.clone();
            }
        }
        
        // Create new context
        var context = try self.context_factory.create_context(context_spec);
        
        // Apply inheritance if enabled
        if (self.config.enable_context_inheritance and context_spec.parent_context != null) {
            try self.inheritance_manager.apply_inheritance(&context, context_spec.parent_context.?);
        }
        
        // Validate context
        try self.validate_context(&context);
        
        // Cache if enabled
        if (self.config.enable_context_caching) {
            try self.context_cache.put(context_spec, context.clone());
        }
        
        return context;
    }
    
    pub fn switch_context(self: *ContextManager, current: *ExecutionContext, new_spec: ContextSpec) !void {
        if (!self.config.enable_runtime_switching) {
            return error.RuntimeSwitchingDisabled;
        }
        
        const new_context = try self.create_execution_context(new_spec);
        
        // Preserve essential state during switch
        try self.preserve_context_state(current, &new_context);
        
        // Replace current context
        current.deinit();
        current.* = new_context;
    }
    
    fn validate_context(self: *ContextManager, context: *const ExecutionContext) !void {
        switch (self.config.context_validation) {
            .None => {},
            .Basic => try self.basic_validation(context),
            .Strict => try self.strict_validation(context),
            .Custom => try self.custom_validation(context),
        }
    }
    
    fn basic_validation(self: *ContextManager, context: *const ExecutionContext) !void {
        _ = self;
        
        // Basic type and null checks
        if (context.block_context == null) {
            return error.MissingBlockContext;
        }
        if (context.transaction_context == null) {
            return error.MissingTransactionContext;
        }
    }
    
    fn strict_validation(self: *ContextManager, context: *const ExecutionContext) !void {
        try self.basic_validation(context);
        
        // Validate block context consistency
        if (context.block_context.?.number < 0) {
            return error.InvalidBlockNumber;
        }
        
        // Validate transaction context consistency
        if (context.transaction_context.?.gas_limit == 0) {
            return error.InvalidGasLimit;
        }
        
        // Validate hardfork compatibility
        try self.validate_hardfork_compatibility(context);
    }
    
    fn custom_validation(self: *ContextManager, context: *const ExecutionContext) !void {
        _ = self;
        _ = context;
        
        // Placeholder for custom validation hooks
        // Would call user-defined validation functions
    }
    
    fn validate_hardfork_compatibility(self: *ContextManager, context: *const ExecutionContext) !void {
        _ = self;
        
        const block_number = context.block_context.?.number;
        const hardfork = context.configuration_context.hardfork;
        
        // Validate that hardfork is appropriate for block number
        switch (hardfork) {
            .Frontier => if (block_number < 0) return error.InvalidHardfork,
            .Homestead => if (block_number < 1150000) return error.InvalidHardfork,
            .Byzantium => if (block_number < 4370000) return error.InvalidHardfork,
            .London => if (block_number < 12965000) return error.InvalidHardfork,
            .Cancun => if (block_number < 19426587) return error.InvalidHardfork,
            else => {},
        }
    }
    
    fn preserve_context_state(self: *ContextManager, old: *const ExecutionContext, new: *ExecutionContext) !void {
        _ = self;
        
        // Preserve gas usage
        new.transaction_context.?.gas_used = old.transaction_context.?.gas_used;
        
        // Preserve call depth
        new.call_depth = old.call_depth;
        
        // Preserve access lists if compatible
        if (new.supports_access_lists() and old.supports_access_lists()) {
            new.access_list = try old.access_list.clone();
        }
    }
    
    pub const ContextSpec = struct {
        block_context_type: BlockContextType,
        transaction_context_type: TransactionContextType,
        configuration_context_type: ConfigurationContextType,
        parent_context: ?*const ExecutionContext,
        custom_parameters: ?CustomParameters,
        
        pub const BlockContextType = enum {
            Mainnet,
            Testnet,
            L2Optimism,
            L2Arbitrum,
            L2Polygon,
            Custom,
        };
        
        pub const TransactionContextType = enum {
            Legacy,
            AccessList,
            EIP1559,
            Blob,
            Custom,
        };
        
        pub const ConfigurationContextType = enum {
            Standard,
            Debug,
            Tracing,
            Fuzzing,
            Custom,
        };
        
        pub const CustomParameters = struct {
            block_params: ?BlockParameters,
            transaction_params: ?TransactionParameters,
            config_params: ?ConfigurationParameters,
        };
    };
};
```

#### 2. Execution Context
```zig
pub const ExecutionContext = struct {
    allocator: std.mem.Allocator,
    block_context: ?*BlockContext,
    transaction_context: ?*TransactionContext,
    configuration_context: ConfigurationContext,
    call_depth: u32,
    access_list: AccessList,
    context_id: u64,
    parent_id: ?u64,
    
    pub fn init(allocator: std.mem.Allocator) ExecutionContext {
        return ExecutionContext{
            .allocator = allocator,
            .block_context = null,
            .transaction_context = null,
            .configuration_context = ConfigurationContext.default(),
            .call_depth = 0,
            .access_list = AccessList.init(allocator),
            .context_id = generate_context_id(),
            .parent_id = null,
        };
    }
    
    pub fn deinit(self: *ExecutionContext) void {
        if (self.block_context) |context| {
            context.deinit();
            self.allocator.destroy(context);
        }
        if (self.transaction_context) |context| {
            context.deinit();
            self.allocator.destroy(context);
        }
        self.access_list.deinit();
    }
    
    pub fn clone(self: *const ExecutionContext) !ExecutionContext {
        var cloned = ExecutionContext.init(self.allocator);
        
        // Clone block context
        if (self.block_context) |block_ctx| {
            cloned.block_context = try self.allocator.create(BlockContext);
            cloned.block_context.?.* = try block_ctx.clone();
        }
        
        // Clone transaction context
        if (self.transaction_context) |tx_ctx| {
            cloned.transaction_context = try self.allocator.create(TransactionContext);
            cloned.transaction_context.?.* = try tx_ctx.clone();
        }
        
        // Clone configuration context
        cloned.configuration_context = self.configuration_context;
        
        // Clone access list
        cloned.access_list = try self.access_list.clone();
        
        cloned.call_depth = self.call_depth;
        cloned.context_id = generate_context_id();
        cloned.parent_id = self.context_id;
        
        return cloned;
    }
    
    pub fn create_child_context(self: *const ExecutionContext, context_type: ChildContextType) !ExecutionContext {
        var child = try self.clone();
        child.call_depth += 1;
        child.parent_id = self.context_id;
        
        // Modify child context based on type
        switch (context_type) {
            .Call => {
                // Preserve most context for calls
            },
            .Create => {
                // Reset some context for contract creation
                if (child.transaction_context) |tx_ctx| {
                    tx_ctx.to = null; // No recipient for CREATE
                }
            },
            .DelegateCall => {
                // Preserve caller context
                if (child.transaction_context) |tx_ctx| {
                    tx_ctx.caller = self.transaction_context.?.caller;
                    tx_ctx.value = self.transaction_context.?.value;
                }
            },
            .StaticCall => {
                // Read-only context
                child.configuration_context.is_static = true;
            },
        }
        
        return child;
    }
    
    pub fn supports_access_lists(self: *const ExecutionContext) bool {
        return self.configuration_context.hardfork.supports_access_lists();
    }
    
    pub fn supports_eip1559(self: *const ExecutionContext) bool {
        return self.configuration_context.hardfork.supports_eip1559();
    }
    
    pub fn supports_blob_transactions(self: *const ExecutionContext) bool {
        return self.configuration_context.hardfork.supports_blob_transactions();
    }
    
    pub fn get_gas_price(self: *const ExecutionContext) u256 {
        if (self.transaction_context) |tx_ctx| {
            return switch (tx_ctx.transaction_type) {
                .Legacy => tx_ctx.gas_price,
                .AccessList => tx_ctx.gas_price,
                .EIP1559 => {
                    const base_fee = self.block_context.?.base_fee_per_gas;
                    const priority_fee = tx_ctx.max_priority_fee_per_gas;
                    const max_fee = tx_ctx.max_fee_per_gas;
                    return @min(base_fee + priority_fee, max_fee);
                },
                .Blob => {
                    // Similar to EIP1559 but with blob fee considerations
                    const base_fee = self.block_context.?.base_fee_per_gas;
                    const priority_fee = tx_ctx.max_priority_fee_per_gas;
                    const max_fee = tx_ctx.max_fee_per_gas;
                    return @min(base_fee + priority_fee, max_fee);
                },
            };
        }
        return 0;
    }
    
    pub const ChildContextType = enum {
        Call,
        Create,
        DelegateCall,
        StaticCall,
    };
    
    fn generate_context_id() u64 {
        // Simple counter-based ID generation
        // In practice, would use atomic counter or UUID
        const static = struct {
            var counter: u64 = 0;
        };
        static.counter += 1;
        return static.counter;
    }
};
```

#### 3. Block Context
```zig
pub const BlockContext = union(enum) {
    Mainnet: MainnetBlockContext,
    Testnet: TestnetBlockContext,
    L2Optimism: OptimismBlockContext,
    L2Arbitrum: ArbitrumBlockContext,
    L2Polygon: PolygonBlockContext,
    Custom: CustomBlockContext,
    
    pub fn deinit(self: *BlockContext) void {
        switch (self.*) {
            inline else => |*context| context.deinit(),
        }
    }
    
    pub fn clone(self: *const BlockContext) !BlockContext {
        return switch (self.*) {
            inline else => |*context| @unionInit(BlockContext, @tagName(self.*), try context.clone()),
        };
    }
    
    pub fn get_number(self: *const BlockContext) u64 {
        return switch (self.*) {
            inline else => |*context| context.number,
        };
    }
    
    pub fn get_timestamp(self: *const BlockContext) u64 {
        return switch (self.*) {
            inline else => |*context| context.timestamp,
        };
    }
    
    pub fn get_difficulty(self: *const BlockContext) u256 {
        return switch (self.*) {
            inline else => |*context| context.difficulty,
        };
    }
    
    pub fn get_gas_limit(self: *const BlockContext) u64 {
        return switch (self.*) {
            inline else => |*context| context.gas_limit,
        };
    }
    
    pub fn get_base_fee_per_gas(self: *const BlockContext) u256 {
        return switch (self.*) {
            inline else => |*context| context.base_fee_per_gas,
        };
    }
    
    pub fn get_coinbase(self: *const BlockContext) Address {
        return switch (self.*) {
            inline else => |*context| context.coinbase,
        };
    }
};

pub const MainnetBlockContext = struct {
    number: u64,
    timestamp: u64,
    difficulty: u256,
    gas_limit: u64,
    base_fee_per_gas: u256,
    coinbase: Address,
    chain_id: u64,
    block_hash: Hash,
    parent_hash: Hash,
    
    pub fn init(block_number: u64) MainnetBlockContext {
        return MainnetBlockContext{
            .number = block_number,
            .timestamp = std.time.timestamp(),
            .difficulty = 0, // PoS era
            .gas_limit = 30_000_000,
            .base_fee_per_gas = 20_000_000_000, // 20 gwei
            .coinbase = Address.zero(),
            .chain_id = 1, // Mainnet
            .block_hash = Hash.zero(),
            .parent_hash = Hash.zero(),
        };
    }
    
    pub fn deinit(self: *MainnetBlockContext) void {
        _ = self;
        // No cleanup needed for basic fields
    }
    
    pub fn clone(self: *const MainnetBlockContext) !MainnetBlockContext {
        return self.*; // Simple copy for basic fields
    }
};

pub const OptimismBlockContext = struct {
    number: u64,
    timestamp: u64,
    difficulty: u256,
    gas_limit: u64,
    base_fee_per_gas: u256,
    coinbase: Address,
    chain_id: u64,
    block_hash: Hash,
    parent_hash: Hash,
    // Optimism-specific fields
    l1_block_number: u64,
    l1_block_hash: Hash,
    l1_timestamp: u64,
    sequence_number: u64,
    
    pub fn init(block_number: u64, l1_block_number: u64) OptimismBlockContext {
        return OptimismBlockContext{
            .number = block_number,
            .timestamp = std.time.timestamp(),
            .difficulty = 0,
            .gas_limit = 30_000_000,
            .base_fee_per_gas = 1_000_000, // 0.001 gwei (much lower on L2)
            .coinbase = Address.zero(),
            .chain_id = 10, // Optimism
            .block_hash = Hash.zero(),
            .parent_hash = Hash.zero(),
            .l1_block_number = l1_block_number,
            .l1_block_hash = Hash.zero(),
            .l1_timestamp = std.time.timestamp(),
            .sequence_number = block_number,
        };
    }
    
    pub fn deinit(self: *OptimismBlockContext) void {
        _ = self;
    }
    
    pub fn clone(self: *const OptimismBlockContext) !OptimismBlockContext {
        return self.*;
    }
};

// Similar implementations for ArbitrumBlockContext, PolygonBlockContext, etc.
```

#### 4. Transaction Context
```zig
pub const TransactionContext = struct {
    transaction_type: TransactionType,
    caller: Address,
    to: ?Address,
    value: u256,
    data: []const u8,
    gas_limit: u64,
    gas_used: u64,
    gas_price: u256,
    max_fee_per_gas: ?u256,
    max_priority_fee_per_gas: ?u256,
    max_fee_per_blob_gas: ?u256,
    blob_versioned_hashes: ?[]Hash,
    access_list: ?[]AccessListEntry,
    nonce: u64,
    
    pub const TransactionType = enum(u8) {
        Legacy = 0,
        AccessList = 1,
        EIP1559 = 2,
        Blob = 3,
    };
    
    pub const AccessListEntry = struct {
        address: Address,
        storage_keys: []Hash,
    };
    
    pub fn init(allocator: std.mem.Allocator, tx_type: TransactionType) TransactionContext {
        return TransactionContext{
            .transaction_type = tx_type,
            .caller = Address.zero(),
            .to = null,
            .value = 0,
            .data = &[_]u8{},
            .gas_limit = 21000,
            .gas_used = 0,
            .gas_price = 0,
            .max_fee_per_gas = null,
            .max_priority_fee_per_gas = null,
            .max_fee_per_blob_gas = null,
            .blob_versioned_hashes = null,
            .access_list = null,
            .nonce = 0,
        };
    }
    
    pub fn deinit(self: *TransactionContext) void {
        // Cleanup dynamically allocated fields if any
        _ = self;
    }
    
    pub fn clone(self: *const TransactionContext) !TransactionContext {
        // Deep clone with proper memory management
        var cloned = self.*;
        
        // Clone data if present
        if (self.data.len > 0) {
            const allocator = std.heap.page_allocator; // Would use proper allocator
            cloned.data = try allocator.dupe(u8, self.data);
        }
        
        // Clone access list if present
        if (self.access_list) |access_list| {
            const allocator = std.heap.page_allocator;
            cloned.access_list = try allocator.dupe(AccessListEntry, access_list);
        }
        
        // Clone blob hashes if present
        if (self.blob_versioned_hashes) |hashes| {
            const allocator = std.heap.page_allocator;
            cloned.blob_versioned_hashes = try allocator.dupe(Hash, hashes);
        }
        
        return cloned;
    }
    
    pub fn is_contract_creation(self: *const TransactionContext) bool {
        return self.to == null;
    }
    
    pub fn supports_access_lists(self: *const TransactionContext) bool {
        return self.transaction_type == .AccessList or 
               self.transaction_type == .EIP1559 or 
               self.transaction_type == .Blob;
    }
    
    pub fn get_effective_gas_price(self: *const TransactionContext, base_fee: u256) u256 {
        return switch (self.transaction_type) {
            .Legacy, .AccessList => self.gas_price,
            .EIP1559, .Blob => {
                const priority_fee = self.max_priority_fee_per_gas.?;
                const max_fee = self.max_fee_per_gas.?;
                return @min(base_fee + priority_fee, max_fee);
            },
        };
    }
};
```

#### 5. Configuration Context
```zig
pub const ConfigurationContext = struct {
    hardfork: Hardfork,
    chain_id: u64,
    is_static: bool,
    debug_mode: bool,
    tracing_enabled: bool,
    gas_tracking: GasTracking,
    validation_level: ValidationLevel,
    optimization_level: OptimizationLevel,
    
    pub const GasTracking = enum {
        None,
        Basic,
        Detailed,
        Profiling,
    };
    
    pub const ValidationLevel = enum {
        None,
        Basic,
        Strict,
        Paranoid,
    };
    
    pub const OptimizationLevel = enum {
        Debug,
        Balanced,
        Performance,
        Size,
    };
    
    pub fn default() ConfigurationContext {
        return ConfigurationContext{
            .hardfork = .Cancun,
            .chain_id = 1,
            .is_static = false,
            .debug_mode = false,
            .tracing_enabled = false,
            .gas_tracking = .Basic,
            .validation_level = .Basic,
            .optimization_level = .Balanced,
        };
    }
    
    pub fn mainnet() ConfigurationContext {
        return ConfigurationContext{
            .hardfork = .Cancun,
            .chain_id = 1,
            .is_static = false,
            .debug_mode = false,
            .tracing_enabled = false,
            .gas_tracking = .Basic,
            .validation_level = .Strict,
            .optimization_level = .Performance,
        };
    }
    
    pub fn testnet() ConfigurationContext {
        return ConfigurationContext{
            .hardfork = .Cancun,
            .chain_id = 11155111, // Sepolia
            .is_static = false,
            .debug_mode = true,
            .tracing_enabled = true,
            .gas_tracking = .Detailed,
            .validation_level = .Strict,
            .optimization_level = .Debug,
        };
    }
    
    pub fn l2_optimism() ConfigurationContext {
        return ConfigurationContext{
            .hardfork = .Cancun,
            .chain_id = 10,
            .is_static = false,
            .debug_mode = false,
            .tracing_enabled = false,
            .gas_tracking = .Basic,
            .validation_level = .Basic,
            .optimization_level = .Performance,
        };
    }
    
    pub fn allows_state_modification(self: *const ConfigurationContext) bool {
        return !self.is_static;
    }
    
    pub fn requires_strict_validation(self: *const ConfigurationContext) bool {
        return self.validation_level == .Strict or self.validation_level == .Paranoid;
    }
    
    pub fn should_optimize_for_performance(self: *const ConfigurationContext) bool {
        return self.optimization_level == .Performance;
    }
};
```

#### 6. Context Factory
```zig
pub const ContextFactory = struct {
    allocator: std.mem.Allocator,
    config: ContextManager.ContextConfig,
    block_factories: BlockFactoryRegistry,
    transaction_factories: TransactionFactoryRegistry,
    
    pub fn init(allocator: std.mem.Allocator, config: ContextManager.ContextConfig) !ContextFactory {
        return ContextFactory{
            .allocator = allocator,
            .config = config,
            .block_factories = try BlockFactoryRegistry.init(allocator),
            .transaction_factories = try TransactionFactoryRegistry.init(allocator),
        };
    }
    
    pub fn deinit(self: *ContextFactory) void {
        self.block_factories.deinit();
        self.transaction_factories.deinit();
    }
    
    pub fn create_context(self: *ContextFactory, spec: ContextManager.ContextSpec) !ExecutionContext {
        var context = ExecutionContext.init(self.allocator);
        
        // Create block context
        context.block_context = try self.create_block_context(spec.block_context_type);
        
        // Create transaction context
        context.transaction_context = try self.create_transaction_context(spec.transaction_context_type);
        
        // Set configuration context
        context.configuration_context = self.create_configuration_context(spec.configuration_context_type);
        
        // Apply custom parameters if provided
        if (spec.custom_parameters) |params| {
            try self.apply_custom_parameters(&context, params);
        }
        
        return context;
    }
    
    fn create_block_context(self: *ContextFactory, context_type: ContextManager.ContextSpec.BlockContextType) !*BlockContext {
        const block_context = try self.allocator.create(BlockContext);
        
        block_context.* = switch (context_type) {
            .Mainnet => BlockContext{ .Mainnet = MainnetBlockContext.init(0) },
            .Testnet => BlockContext{ .Testnet = TestnetBlockContext.init(0) },
            .L2Optimism => BlockContext{ .L2Optimism = OptimismBlockContext.init(0, 0) },
            .L2Arbitrum => BlockContext{ .L2Arbitrum = ArbitrumBlockContext.init(0, 0) },
            .L2Polygon => BlockContext{ .L2Polygon = PolygonBlockContext.init(0) },
            .Custom => BlockContext{ .Custom = CustomBlockContext.init() },
        };
        
        return block_context;
    }
    
    fn create_transaction_context(self: *ContextFactory, context_type: ContextManager.ContextSpec.TransactionContextType) !*TransactionContext {
        const tx_context = try self.allocator.create(TransactionContext);
        
        const tx_type = switch (context_type) {
            .Legacy => TransactionContext.TransactionType.Legacy,
            .AccessList => TransactionContext.TransactionType.AccessList,
            .EIP1559 => TransactionContext.TransactionType.EIP1559,
            .Blob => TransactionContext.TransactionType.Blob,
            .Custom => TransactionContext.TransactionType.Legacy, // Default for custom
        };
        
        tx_context.* = TransactionContext.init(self.allocator, tx_type);
        return tx_context;
    }
    
    fn create_configuration_context(self: *ContextFactory, context_type: ContextManager.ContextSpec.ConfigurationContextType) ConfigurationContext {
        _ = self;
        
        return switch (context_type) {
            .Standard => ConfigurationContext.default(),
            .Debug => blk: {
                var config = ConfigurationContext.default();
                config.debug_mode = true;
                config.tracing_enabled = true;
                config.gas_tracking = .Detailed;
                config.validation_level = .Strict;
                config.optimization_level = .Debug;
                break :blk config;
            },
            .Tracing => blk: {
                var config = ConfigurationContext.default();
                config.tracing_enabled = true;
                config.gas_tracking = .Profiling;
                config.validation_level = .Strict;
                break :blk config;
            },
            .Fuzzing => blk: {
                var config = ConfigurationContext.default();
                config.debug_mode = true;
                config.validation_level = .Paranoid;
                config.optimization_level = .Debug;
                break :blk config;
            },
            .Custom => ConfigurationContext.default(),
        };
    }
    
    fn apply_custom_parameters(self: *ContextFactory, context: *ExecutionContext, params: ContextManager.ContextSpec.CustomParameters) !void {
        _ = self;
        
        if (params.block_params) |block_params| {
            // Apply custom block parameters
            switch (context.block_context.?.*) {
                .Mainnet => |*mainnet| {
                    if (block_params.number) |number| mainnet.number = number;
                    if (block_params.timestamp) |timestamp| mainnet.timestamp = timestamp;
                    if (block_params.gas_limit) |gas_limit| mainnet.gas_limit = gas_limit;
                },
                // Similar for other block context types
                else => {},
            }
        }
        
        if (params.transaction_params) |tx_params| {
            // Apply custom transaction parameters
            if (tx_params.gas_limit) |gas_limit| {
                context.transaction_context.?.gas_limit = gas_limit;
            }
            if (tx_params.gas_price) |gas_price| {
                context.transaction_context.?.gas_price = gas_price;
            }
        }
        
        if (params.config_params) |config_params| {
            // Apply custom configuration parameters
            if (config_params.hardfork) |hardfork| {
                context.configuration_context.hardfork = hardfork;
            }
            if (config_params.chain_id) |chain_id| {
                context.configuration_context.chain_id = chain_id;
            }
        }
    }
};

// Factory registries for extensibility
pub const BlockFactoryRegistry = struct {
    allocator: std.mem.Allocator,
    factories: std.HashMap([]const u8, BlockContextFactory, StringContext, std.hash_map.default_max_load_percentage),
    
    pub const BlockContextFactory = struct {
        create_fn: *const fn(std.mem.Allocator, []const u8) anyerror!*BlockContext,
        name: []const u8,
        version: []const u8,
    };
    
    pub fn init(allocator: std.mem.Allocator) !BlockFactoryRegistry {
        return BlockFactoryRegistry{
            .allocator = allocator,
            .factories = std.HashMap([]const u8, BlockContextFactory, StringContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *BlockFactoryRegistry) void {
        self.factories.deinit();
    }
    
    pub fn register_factory(self: *BlockFactoryRegistry, name: []const u8, factory: BlockContextFactory) !void {
        try self.factories.put(name, factory);
    }
    
    pub fn create_block_context(self: *BlockFactoryRegistry, name: []const u8, params: []const u8) !*BlockContext {
        if (self.factories.get(name)) |factory| {
            return try factory.create_fn(self.allocator, params);
        }
        return error.UnknownBlockContextType;
    }
    
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
};

pub const TransactionFactoryRegistry = struct {
    allocator: std.mem.Allocator,
    factories: std.HashMap([]const u8, TransactionContextFactory, BlockFactoryRegistry.StringContext, std.hash_map.default_max_load_percentage),
    
    pub const TransactionContextFactory = struct {
        create_fn: *const fn(std.mem.Allocator, []const u8) anyerror!*TransactionContext,
        name: []const u8,
        version: []const u8,
    };
    
    pub fn init(allocator: std.mem.Allocator) !TransactionFactoryRegistry {
        return TransactionFactoryRegistry{
            .allocator = allocator,
            .factories = std.HashMap([]const u8, TransactionContextFactory, BlockFactoryRegistry.StringContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *TransactionFactoryRegistry) void {
        self.factories.deinit();
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Pluggable Context Components**: Mix and match block, transaction, and configuration contexts
2. **Runtime Context Switching**: Change contexts during execution based on conditions
3. **Context Inheritance**: Derive new contexts from existing ones with modifications
4. **Type Safety**: Ensure all context combinations are valid and type-safe
5. **Performance Optimization**: Minimize overhead through caching and efficient creation
6. **Extensibility**: Support custom context types through factory registration

## Implementation Tasks

### Task 1: Implement Context Cache
File: `/src/evm/modular_context/context_cache.zig`
```zig
const std = @import("std");
const ContextManager = @import("context_manager.zig").ContextManager;
const ExecutionContext = @import("execution_context.zig").ExecutionContext;

pub const ContextCache = struct {
    allocator: std.mem.Allocator,
    cache: std.HashMap(u64, CacheEntry, HashContext, std.hash_map.default_max_load_percentage),
    max_entries: u32,
    hit_count: u64,
    miss_count: u64,
    
    pub const CacheEntry = struct {
        context: ExecutionContext,
        access_count: u64,
        last_access: i64,
        creation_time: i64,
    };
    
    pub fn init(allocator: std.mem.Allocator, max_entries: u32) !ContextCache {
        return ContextCache{
            .allocator = allocator,
            .cache = std.HashMap(u64, CacheEntry, HashContext, std.hash_map.default_max_load_percentage).init(allocator),
            .max_entries = max_entries,
            .hit_count = 0,
            .miss_count = 0,
        };
    }
    
    pub fn deinit(self: *ContextCache) void {
        // Clean up all cached contexts
        var iterator = self.cache.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.context.deinit();
        }
        self.cache.deinit();
    }
    
    pub fn get(self: *ContextCache, spec: ContextManager.ContextSpec) ?ExecutionContext {
        const key = self.hash_spec(spec);
        
        if (self.cache.getPtr(key)) |entry| {
            entry.access_count += 1;
            entry.last_access = std.time.milliTimestamp();
            self.hit_count += 1;
            
            return entry.context.clone() catch {
                self.miss_count += 1;
                return null;
            };
        }
        
        self.miss_count += 1;
        return null;
    }
    
    pub fn put(self: *ContextCache, spec: ContextManager.ContextSpec, context: ExecutionContext) !void {
        const key = self.hash_spec(spec);
        
        // Check if cache is full
        if (self.cache.count() >= self.max_entries) {
            try self.evict_lru();
        }
        
        const entry = CacheEntry{
            .context = try context.clone(),
            .access_count = 1,
            .last_access = std.time.milliTimestamp(),
            .creation_time = std.time.milliTimestamp(),
        };
        
        try self.cache.put(key, entry);
    }
    
    fn hash_spec(self: *ContextCache, spec: ContextManager.ContextSpec) u64 {
        _ = self;
        
        var hasher = std.hash_map.DefaultHasher.init();
        hasher.update(std.mem.asBytes(&spec.block_context_type));
        hasher.update(std.mem.asBytes(&spec.transaction_context_type));
        hasher.update(std.mem.asBytes(&spec.configuration_context_type));
        
        if (spec.parent_context) |parent| {
            hasher.update(std.mem.asBytes(&parent.context_id));
        }
        
        return hasher.final();
    }
    
    fn evict_lru(self: *ContextCache) !void {
        var oldest_key: ?u64 = null;
        var oldest_time: i64 = std.math.maxInt(i64);
        
        var iterator = self.cache.iterator();
        while (iterator.next()) |entry| {
            if (entry.value_ptr.last_access < oldest_time) {
                oldest_time = entry.value_ptr.last_access;
                oldest_key = entry.key_ptr.*;
            }
        }
        
        if (oldest_key) |key| {
            if (self.cache.fetchRemove(key)) |removed| {
                removed.value.context.deinit();
            }
        }
    }
    
    pub fn get_hit_rate(self: *const ContextCache) f64 {
        const total = self.hit_count + self.miss_count;
        if (total == 0) return 0.0;
        return @as(f64, @floatFromInt(self.hit_count)) / @as(f64, @floatFromInt(total));
    }
    
    pub const HashContext = struct {
        pub fn hash(self: @This(), key: u64) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: u64, b: u64) bool {
            _ = self;
            return a == b;
        }
    };
};
```

### Task 2: Implement Inheritance Manager
File: `/src/evm/modular_context/inheritance_manager.zig`
```zig
const std = @import("std");
const ExecutionContext = @import("execution_context.zig").ExecutionContext;

pub const InheritanceManager = struct {
    max_depth: u32,
    inheritance_rules: InheritanceRules,
    
    pub const InheritanceRules = struct {
        inherit_block_context: bool,
        inherit_transaction_context: bool,
        inherit_configuration_context: bool,
        inherit_access_list: bool,
        override_on_conflict: bool,
        
        pub fn default() InheritanceRules {
            return InheritanceRules{
                .inherit_block_context = true,
                .inherit_transaction_context = true,
                .inherit_configuration_context = true,
                .inherit_access_list = true,
                .override_on_conflict = false,
            };
        }
    };
    
    pub fn init(max_depth: u32) InheritanceManager {
        return InheritanceManager{
            .max_depth = max_depth,
            .inheritance_rules = InheritanceRules.default(),
        };
    }
    
    pub fn apply_inheritance(
        self: *InheritanceManager, 
        child: *ExecutionContext, 
        parent: *const ExecutionContext
    ) !void {
        // Check inheritance depth
        var current_depth: u32 = 0;
        var current_parent = parent;
        
        while (current_parent.parent_id != null and current_depth < self.max_depth) {
            current_depth += 1;
            // Would traverse to actual parent context in real implementation
            break;
        }
        
        if (current_depth >= self.max_depth) {
            return error.InheritanceDepthExceeded;
        }
        
        // Apply inheritance rules
        if (self.inheritance_rules.inherit_block_context and child.block_context == null) {
            if (parent.block_context) |parent_block| {
                child.block_context = try child.allocator.create(@TypeOf(parent_block.*));
                child.block_context.?.* = try parent_block.clone();
            }
        }
        
        if (self.inheritance_rules.inherit_transaction_context and child.transaction_context == null) {
            if (parent.transaction_context) |parent_tx| {
                child.transaction_context = try child.allocator.create(@TypeOf(parent_tx.*));
                child.transaction_context.?.* = try parent_tx.clone();
            }
        }
        
        if (self.inheritance_rules.inherit_configuration_context) {
            // Merge configuration contexts
            try self.merge_configuration_context(&child.configuration_context, &parent.configuration_context);
        }
        
        if (self.inheritance_rules.inherit_access_list) {
            child.access_list = try parent.access_list.clone();
        }
        
        // Set parent relationship
        child.parent_id = parent.context_id;
    }
    
    fn merge_configuration_context(
        self: *InheritanceManager,
        child: *ConfigurationContext,
        parent: *const ConfigurationContext
    ) !void {
        // Merge configuration contexts based on override rules
        if (!self.inheritance_rules.override_on_conflict) {
            // Parent values take precedence when child doesn't have a value set
            if (child.hardfork == .Frontier) { // Assuming Frontier is default
                child.hardfork = parent.hardfork;
            }
            if (child.chain_id == 0) {
                child.chain_id = parent.chain_id;
            }
            // Inherit boolean flags if not explicitly set
            child.is_static = child.is_static or parent.is_static;
        } else {
            // Child values override parent values
            // No action needed as child already has its values
        }
    }
};
```

### Task 3: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const ContextManager = @import("modular_context/context_manager.zig").ContextManager;
const ExecutionContext = @import("modular_context/execution_context.zig").ExecutionContext;

pub const Vm = struct {
    // Existing fields...
    context_manager: ?ContextManager,
    current_context: ?ExecutionContext,
    context_enabled: bool,
    
    pub fn enable_modular_contexts(self: *Vm, config: ContextManager.ContextConfig) !void {
        self.context_manager = try ContextManager.init(self.allocator, config);
        self.context_enabled = true;
    }
    
    pub fn disable_modular_contexts(self: *Vm) void {
        if (self.context_manager) |*manager| {
            manager.deinit();
            self.context_manager = null;
        }
        if (self.current_context) |*context| {
            context.deinit();
            self.current_context = null;
        }
        self.context_enabled = false;
    }
    
    pub fn set_execution_context(self: *Vm, context_spec: ContextManager.ContextSpec) !void {
        if (!self.context_enabled or self.context_manager == null) return;
        
        // Clean up previous context
        if (self.current_context) |*context| {
            context.deinit();
        }
        
        // Create new context
        self.current_context = try self.context_manager.?.create_execution_context(context_spec);
    }
    
    pub fn switch_context_for_call(self: *Vm, call_type: ExecutionContext.ChildContextType) !void {
        if (!self.context_enabled or self.current_context == null) return;
        
        const child_context = try self.current_context.?.create_child_context(call_type);
        
        // Replace current context with child
        self.current_context.?.deinit();
        self.current_context = child_context;
    }
    
    pub fn get_block_number(self: *Vm) u64 {
        if (self.current_context) |*context| {
            if (context.block_context) |block_ctx| {
                return block_ctx.get_number();
            }
        }
        return 0; // Default fallback
    }
    
    pub fn get_gas_price(self: *Vm) u256 {
        if (self.current_context) |*context| {
            return context.get_gas_price();
        }
        return 0;
    }
    
    pub fn is_static_context(self: *Vm) bool {
        if (self.current_context) |*context| {
            return !context.configuration_context.allows_state_modification();
        }
        return false;
    }
    
    pub fn get_chain_id(self: *Vm) u64 {
        if (self.current_context) |*context| {
            return context.configuration_context.chain_id;
        }
        return 1; // Default to mainnet
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/modular_context/modular_context_test.zig`

### Test Cases
```zig
test "context manager initialization and configuration" {
    // Test manager creation with different configs
    // Test context factory setup
    // Test cache initialization
}

test "execution context creation and cloning" {
    // Test context creation with different specifications
    // Test context cloning and deep copying
    // Test context inheritance
}

test "block context variants" {
    // Test mainnet block context
    // Test L2 block contexts (Optimism, Arbitrum, Polygon)
    // Test custom block contexts
}

test "transaction context types" {
    // Test legacy transaction contexts
    // Test EIP-1559 transaction contexts
    // Test blob transaction contexts
}

test "context inheritance system" {
    // Test parent-child context relationships
    // Test inheritance rules application
    // Test inheritance depth limits
}

test "context caching mechanism" {
    // Test cache hit/miss scenarios
    // Test LRU eviction
    // Test cache performance impact
}

test "runtime context switching" {
    // Test context switching during execution
    // Test call context creation
    // Test static call restrictions
}

test "integration with VM execution" {
    // Test VM integration
    // Test context-aware opcode execution
    // Test performance impact measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/modular_context/context_manager.zig` - Main context management framework
- `/src/evm/modular_context/execution_context.zig` - Unified execution context
- `/src/evm/modular_context/block_context.zig` - Block context variants
- `/src/evm/modular_context/transaction_context.zig` - Transaction context types
- `/src/evm/modular_context/configuration_context.zig` - Configuration contexts
- `/src/evm/modular_context/context_factory.zig` - Context creation and management
- `/src/evm/modular_context/context_cache.zig` - Context caching system
- `/src/evm/modular_context/inheritance_manager.zig` - Context inheritance logic
- `/src/evm/vm.zig` - VM integration with modular contexts
- `/test/evm/modular_context/modular_context_test.zig` - Comprehensive tests

## Success Criteria

1. **Flexible Configuration**: Support multiple blockchain environments through pluggable contexts
2. **Type Safety**: All context combinations are validated and type-safe at compile time
3. **Performance Efficiency**: Minimal overhead through intelligent caching and efficient creation
4. **Easy Extensibility**: Simple addition of new context types through factory registration
5. **Runtime Adaptability**: Dynamic context switching based on execution requirements
6. **Clean Integration**: Seamless integration with existing VM execution flow

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Memory safety** - Proper cleanup and management of dynamically allocated contexts
3. **Type safety** - All context interfaces must be properly typed and validated
4. **Performance validation** - Context switching overhead must be minimal (<1% impact)
5. **Correctness** - Context switching must not change execution semantics incorrectly
6. **Resource efficiency** - Context creation and caching must be memory-efficient

## References

- [Strategy Pattern](https://en.wikipedia.org/wiki/Strategy_pattern) - Design pattern for pluggable algorithms
- [Context Object Pattern](https://martinfowler.com/eaaCatalog/contextObject.html) - Pattern for passing context information
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) - Pattern for configurable components
- [Factory Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern) - Pattern for object creation
- [Chain of Responsibility](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) - Pattern for inheritance hierarchies