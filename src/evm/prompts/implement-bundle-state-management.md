# Implement Bundle State Management

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_bundle_state_management` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_bundle_state_management feat_implement_bundle_state_management`
3. **Work in isolation**: `cd g/feat_implement_bundle_state_management`
4. **Commit message**: `✨ feat: implement efficient bundle state management for state transitions and rollback`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive bundle state management that efficiently handles state transitions, rollbacks, and batch operations. This includes state bundling for transaction execution, efficient diff tracking, checkpoint management, and optimized state merging for complex execution scenarios like MEV bundles and transaction batching.

## <eli5>

Bundle state management is like having a sophisticated revision control system for blockchain state changes. Think of it as creating "save points" in a video game - you can group related changes together into bundles, create checkpoints, and if something goes wrong, you can roll back to a previous state. This system helps organize and manage complex state transitions, making it easy to handle batches of transactions and undo changes when needed, just like organizing files in folders and having an undo button.

</eli5>

## Bundle State Management Specifications

### Core Bundle Framework

#### 1. State Bundle Manager
```zig
pub const StateBundleManager = struct {
    allocator: std.mem.Allocator,
    config: BundleConfig,
    active_bundles: std.HashMap(BundleId, StateBundle, BundleIdContext, std.hash_map.default_max_load_percentage),
    bundle_stack: std.ArrayList(BundleId),
    checkpoint_manager: CheckpointManager,
    diff_tracker: DiffTracker,
    conflict_resolver: ConflictResolver,
    statistics: BundleStatistics,
    
    pub const BundleConfig = struct {
        max_active_bundles: u32,
        max_bundle_size: usize,
        enable_diff_tracking: bool,
        enable_conflict_detection: bool,
        enable_compression: bool,
        checkpoint_frequency: u32,
        auto_garbage_collection: bool,
        memory_pressure_threshold: f64,
        bundle_timeout_ms: u64,
        
        pub fn production() BundleConfig {
            return BundleConfig{
                .max_active_bundles = 100,
                .max_bundle_size = 64 * 1024 * 1024, // 64MB
                .enable_diff_tracking = true,
                .enable_conflict_detection = true,
                .enable_compression = true,
                .checkpoint_frequency = 1000,
                .auto_garbage_collection = true,
                .memory_pressure_threshold = 0.8,
                .bundle_timeout_ms = 60000, // 1 minute
            };
        }
        
        pub fn development() BundleConfig {
            return BundleConfig{
                .max_active_bundles = 50,
                .max_bundle_size = 32 * 1024 * 1024, // 32MB
                .enable_diff_tracking = true,
                .enable_conflict_detection = true,
                .enable_compression = false,
                .checkpoint_frequency = 100,
                .auto_garbage_collection = true,
                .memory_pressure_threshold = 0.7,
                .bundle_timeout_ms = 30000, // 30 seconds
            };
        }
        
        pub fn testing() BundleConfig {
            return BundleConfig{
                .max_active_bundles = 10,
                .max_bundle_size = 1024 * 1024, // 1MB
                .enable_diff_tracking = true,
                .enable_conflict_detection = true,
                .enable_compression = false,
                .checkpoint_frequency = 10,
                .auto_garbage_collection = false,
                .memory_pressure_threshold = 0.9,
                .bundle_timeout_ms = 5000, // 5 seconds
            };
        }
    };
    
    pub const BundleId = struct {
        id: u64,
        timestamp: i64,
        parent_id: ?u64,
        
        pub fn new() BundleId {
            return BundleId{
                .id = std.crypto.random.int(u64),
                .timestamp = std.time.milliTimestamp(),
                .parent_id = null,
            };
        }
        
        pub fn child_of(parent: BundleId) BundleId {
            return BundleId{
                .id = std.crypto.random.int(u64),
                .timestamp = std.time.milliTimestamp(),
                .parent_id = parent.id,
            };
        }
        
        pub fn equals(self: *const BundleId, other: *const BundleId) bool {
            return self.id == other.id;
        }
    };
    
    pub const BundleIdContext = struct {
        pub fn hash(self: @This(), key: BundleId) u64 {
            _ = self;
            return key.id;
        }
        
        pub fn eql(self: @This(), a: BundleId, b: BundleId) bool {
            _ = self;
            return a.equals(&b);
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: BundleConfig) StateBundleManager {
        return StateBundleManager{
            .allocator = allocator,
            .config = config,
            .active_bundles = std.HashMap(BundleId, StateBundle, BundleIdContext, std.hash_map.default_max_load_percentage).init(allocator),
            .bundle_stack = std.ArrayList(BundleId).init(allocator),
            .checkpoint_manager = CheckpointManager.init(allocator, config),
            .diff_tracker = DiffTracker.init(allocator, config),
            .conflict_resolver = ConflictResolver.init(allocator),
            .statistics = BundleStatistics.init(),
        };
    }
    
    pub fn deinit(self: *StateBundleManager) void {
        // Clean up all active bundles
        var iterator = self.active_bundles.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.deinit();
        }
        
        self.active_bundles.deinit();
        self.bundle_stack.deinit();
        self.checkpoint_manager.deinit();
        self.diff_tracker.deinit();
        self.conflict_resolver.deinit();
    }
    
    pub fn create_bundle(self: *StateBundleManager, bundle_type: StateBundle.BundleType) !BundleId {
        // Check limits
        if (self.active_bundles.count() >= self.config.max_active_bundles) {
            if (self.config.auto_garbage_collection) {
                try self.garbage_collect();
            } else {
                return BundleError.TooManyActiveBundles;
            }
        }
        
        const bundle_id = BundleId.new();
        const bundle = StateBundle.init(self.allocator, bundle_id, bundle_type, self.config);
        
        try self.active_bundles.put(bundle_id, bundle);
        try self.bundle_stack.append(bundle_id);
        
        self.statistics.record_bundle_creation(bundle_type);
        
        return bundle_id;
    }
    
    pub fn fork_bundle(self: *StateBundleManager, parent_id: BundleId) !BundleId {
        const parent_bundle = self.active_bundles.getPtr(parent_id) orelse {
            return BundleError.BundleNotFound;
        };
        
        const child_id = BundleId.child_of(parent_id);
        const child_bundle = try parent_bundle.fork(child_id);
        
        try self.active_bundles.put(child_id, child_bundle);
        try self.bundle_stack.append(child_id);
        
        self.statistics.record_bundle_fork();
        
        return child_id;
    }
    
    pub fn merge_bundle(
        self: *StateBundleManager,
        source_id: BundleId,
        target_id: BundleId,
        strategy: MergeStrategy
    ) !void {
        const source_bundle = self.active_bundles.getPtr(source_id) orelse {
            return BundleError.BundleNotFound;
        };
        
        const target_bundle = self.active_bundles.getPtr(target_id) orelse {
            return BundleError.BundleNotFound;
        };
        
        // Check for conflicts if enabled
        if (self.config.enable_conflict_detection) {
            const conflicts = try self.conflict_resolver.detect_conflicts(source_bundle, target_bundle);
            if (conflicts.len > 0) {
                try self.conflict_resolver.resolve_conflicts(conflicts, strategy);
            }
        }
        
        // Perform merge
        try target_bundle.merge_from(source_bundle, strategy);
        
        // Update diff tracking
        if (self.config.enable_diff_tracking) {
            try self.diff_tracker.record_merge(source_id, target_id, strategy);
        }
        
        self.statistics.record_bundle_merge(strategy);
    }
    
    pub fn commit_bundle(self: *StateBundleManager, bundle_id: BundleId, base_state: *StateInterface) !void {
        const bundle = self.active_bundles.getPtr(bundle_id) orelse {
            return BundleError.BundleNotFound;
        };
        
        // Apply all changes in the bundle to the base state
        try bundle.apply_to_state(base_state);
        
        // Create checkpoint if needed
        if (self.statistics.operations_since_checkpoint >= self.config.checkpoint_frequency) {
            try self.checkpoint_manager.create_checkpoint(base_state);
            self.statistics.operations_since_checkpoint = 0;
        }
        
        // Remove from active bundles
        _ = self.active_bundles.remove(bundle_id);
        
        // Remove from stack
        for (self.bundle_stack.items, 0..) |stack_id, i| {
            if (stack_id.equals(&bundle_id)) {
                _ = self.bundle_stack.swapRemove(i);
                break;
            }
        }
        
        self.statistics.record_bundle_commit();
    }
    
    pub fn rollback_bundle(self: *StateBundleManager, bundle_id: BundleId) !void {
        const bundle = self.active_bundles.getPtr(bundle_id) orelse {
            return BundleError.BundleNotFound;
        };
        
        // Clear all changes in the bundle
        bundle.clear();
        
        // Remove from active bundles
        _ = self.active_bundles.remove(bundle_id);
        
        // Remove from stack
        for (self.bundle_stack.items, 0..) |stack_id, i| {
            if (stack_id.equals(&bundle_id)) {
                _ = self.bundle_stack.swapRemove(i);
                break;
            }
        }
        
        self.statistics.record_bundle_rollback();
    }
    
    pub fn get_bundle(self: *StateBundleManager, bundle_id: BundleId) ?*StateBundle {
        return self.active_bundles.getPtr(bundle_id);
    }
    
    pub fn get_current_bundle(self: *StateBundleManager) ?*StateBundle {
        if (self.bundle_stack.items.len > 0) {
            const current_id = self.bundle_stack.items[self.bundle_stack.items.len - 1];
            return self.active_bundles.getPtr(current_id);
        }
        return null;
    }
    
    pub fn create_checkpoint(self: *StateBundleManager, state: *StateInterface) !CheckpointId {
        return self.checkpoint_manager.create_checkpoint(state);
    }
    
    pub fn restore_checkpoint(self: *StateBundleManager, checkpoint_id: CheckpointId, state: *StateInterface) !void {
        try self.checkpoint_manager.restore_checkpoint(checkpoint_id, state);
        
        // Clear all active bundles as state has been restored
        self.clear_all_bundles();
    }
    
    pub fn garbage_collect(self: *StateBundleManager) !void {
        const current_time = std.time.milliTimestamp();
        var bundles_to_remove = std.ArrayList(BundleId).init(self.allocator);
        defer bundles_to_remove.deinit();
        
        // Find expired bundles
        var iterator = self.active_bundles.iterator();
        while (iterator.next()) |entry| {
            const bundle = entry.value_ptr;
            const age = current_time - bundle.created_at;
            
            if (age > self.config.bundle_timeout_ms or
                bundle.is_empty() or
                bundle.memory_usage() > self.config.max_bundle_size) {
                
                try bundles_to_remove.append(entry.key_ptr.*);
            }
        }
        
        // Remove expired bundles
        for (bundles_to_remove.items) |bundle_id| {
            try self.rollback_bundle(bundle_id);
        }
        
        // Run checkpoint garbage collection
        try self.checkpoint_manager.garbage_collect();
        
        self.statistics.record_garbage_collection(bundles_to_remove.items.len);
    }
    
    fn clear_all_bundles(self: *StateBundleManager) void {
        var iterator = self.active_bundles.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.deinit();
        }
        
        self.active_bundles.clearRetainingCapacity();
        self.bundle_stack.clearRetainingCapacity();
    }
    
    pub fn get_memory_usage(self: *StateBundleManager) usize {
        var total_usage: usize = 0;
        
        var iterator = self.active_bundles.iterator();
        while (iterator.next()) |entry| {
            total_usage += entry.value_ptr.memory_usage();
        }
        
        total_usage += self.checkpoint_manager.memory_usage();
        total_usage += self.diff_tracker.memory_usage();
        
        return total_usage;
    }
    
    pub fn get_statistics(self: *const StateBundleManager) BundleStatistics {
        return self.statistics;
    }
    
    pub const MergeStrategy = enum {
        OverwriteConflicts,    // Source overwrites target on conflicts
        PreserveTarget,        // Target preserved on conflicts
        ThrowOnConflicts,      // Error on any conflicts
        CustomResolver,        // Use custom conflict resolution
    };
};
```

#### 2. State Bundle Structure
```zig
pub const StateBundle = struct {
    allocator: std.mem.Allocator,
    id: StateBundleManager.BundleId,
    bundle_type: BundleType,
    created_at: i64,
    last_modified: i64,
    
    // State changes tracking
    account_changes: std.HashMap(Address, AccountChange, AddressContext, std.hash_map.default_max_load_percentage),
    storage_changes: std.HashMap(StorageKey, StorageChange, StorageKeyContext, std.hash_map.default_max_load_percentage),
    code_changes: std.HashMap(Address, CodeChange, AddressContext, std.hash_map.default_max_load_percentage),
    log_entries: std.ArrayList(LogEntry),
    
    // Bundle metadata
    operation_count: u64,
    memory_usage_bytes: usize,
    is_sealed: bool,
    parent_id: ?u64,
    
    pub const BundleType = enum {
        Transaction,    // Single transaction execution
        Block,         // Block execution bundle
        MEVBundle,     // MEV bundle execution
        Simulation,    // Simulation bundle
        Fork,          // Forked state bundle
        Checkpoint,    // Checkpoint bundle
    };
    
    pub const AccountChange = struct {
        change_type: ChangeType,
        old_account: ?Account,
        new_account: ?Account,
        timestamp: i64,
        
        pub const ChangeType = enum {
            Created,
            Modified,
            Deleted,
            Restored,
        };
        
        pub fn size(self: *const AccountChange) usize {
            var size: usize = @sizeOf(AccountChange);
            if (self.old_account) |_| size += @sizeOf(Account);
            if (self.new_account) |_| size += @sizeOf(Account);
            return size;
        }
        
        pub fn has_conflict_with(self: *const AccountChange, other: *const AccountChange) bool {
            // Two account changes conflict if they modify the same account
            // and at least one is a write operation
            return (self.change_type != .Created) and (other.change_type != .Created);
        }
    };
    
    pub const StorageChange = struct {
        change_type: ChangeType,
        old_value: U256,
        new_value: U256,
        timestamp: i64,
        
        pub const ChangeType = enum {
            Set,
            Deleted,
            Restored,
        };
        
        pub fn size(self: *const StorageChange) usize {
            _ = self;
            return @sizeOf(StorageChange);
        }
        
        pub fn has_conflict_with(self: *const StorageChange, other: *const StorageChange) bool {
            _ = self;
            _ = other;
            // All storage changes to the same key conflict
            return true;
        }
    };
    
    pub const CodeChange = struct {
        change_type: ChangeType,
        old_code: ?[]const u8,
        new_code: ?[]const u8,
        timestamp: i64,
        
        pub const ChangeType = enum {
            Set,
            Deleted,
            Restored,
        };
        
        pub fn size(self: *const CodeChange) usize {
            var size: usize = @sizeOf(CodeChange);
            if (self.old_code) |code| size += code.len;
            if (self.new_code) |code| size += code.len;
            return size;
        }
        
        pub fn deinit(self: *CodeChange, allocator: std.mem.Allocator) void {
            if (self.old_code) |code| allocator.free(code);
            if (self.new_code) |code| allocator.free(code);
        }
        
        pub fn has_conflict_with(self: *const CodeChange, other: *const CodeChange) bool {
            _ = self;
            _ = other;
            // All code changes to the same address conflict
            return true;
        }
    };
    
    pub const StorageKey = struct {
        address: Address,
        key: U256,
        
        pub fn init(address: Address, key: U256) StorageKey {
            return StorageKey{
                .address = address,
                .key = key,
            };
        }
        
        pub fn equals(self: *const StorageKey, other: *const StorageKey) bool {
            return std.mem.eql(u8, &self.address.bytes, &other.address.bytes) and
                   self.key.equals(other.key);
        }
        
        pub fn hash(self: *const StorageKey) u64 {
            const addr_hash = std.hash_map.hashString(&self.address.bytes);
            const key_hash = self.key.to_u64();
            return addr_hash ^ key_hash;
        }
    };
    
    pub const StorageKeyContext = struct {
        pub fn hash(self: @This(), key: StorageKey) u64 {
            _ = self;
            return key.hash();
        }
        
        pub fn eql(self: @This(), a: StorageKey, b: StorageKey) bool {
            _ = self;
            return a.equals(&b);
        }
    };
    
    pub const AddressContext = struct {
        pub fn hash(self: @This(), key: Address) u64 {
            _ = self;
            return std.hash_map.hashString(&key.bytes);
        }
        
        pub fn eql(self: @This(), a: Address, b: Address) bool {
            _ = self;
            return std.mem.eql(u8, &a.bytes, &b.bytes);
        }
    };
    
    pub const LogEntry = struct {
        address: Address,
        topics: []const Hash,
        data: []const u8,
        timestamp: i64,
        
        pub fn deinit(self: *LogEntry, allocator: std.mem.Allocator) void {
            allocator.free(self.topics);
            allocator.free(self.data);
        }
        
        pub fn size(self: *const LogEntry) usize {
            return @sizeOf(LogEntry) + 
                   (self.topics.len * @sizeOf(Hash)) + 
                   self.data.len;
        }
    };
    
    pub fn init(
        allocator: std.mem.Allocator,
        id: StateBundleManager.BundleId,
        bundle_type: BundleType,
        config: StateBundleManager.BundleConfig
    ) StateBundle {
        _ = config;
        
        return StateBundle{
            .allocator = allocator,
            .id = id,
            .bundle_type = bundle_type,
            .created_at = std.time.milliTimestamp(),
            .last_modified = std.time.milliTimestamp(),
            .account_changes = std.HashMap(Address, AccountChange, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            .storage_changes = std.HashMap(StorageKey, StorageChange, StorageKeyContext, std.hash_map.default_max_load_percentage).init(allocator),
            .code_changes = std.HashMap(Address, CodeChange, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            .log_entries = std.ArrayList(LogEntry).init(allocator),
            .operation_count = 0,
            .memory_usage_bytes = 0,
            .is_sealed = false,
            .parent_id = id.parent_id,
        };
    }
    
    pub fn deinit(self: *StateBundle) void {
        // Clean up code changes
        var code_iterator = self.code_changes.iterator();
        while (code_iterator.next()) |entry| {
            entry.value_ptr.deinit(self.allocator);
        }
        
        // Clean up log entries
        for (self.log_entries.items) |*entry| {
            entry.deinit(self.allocator);
        }
        
        self.account_changes.deinit();
        self.storage_changes.deinit();
        self.code_changes.deinit();
        self.log_entries.deinit();
    }
    
    pub fn set_account(self: *StateBundle, address: Address, old_account: ?Account, new_account: Account) !void {
        if (self.is_sealed) {
            return BundleError.BundleSealed;
        }
        
        const change = AccountChange{
            .change_type = if (old_account == null) .Created else .Modified,
            .old_account = old_account,
            .new_account = new_account,
            .timestamp = std.time.milliTimestamp(),
        };
        
        try self.account_changes.put(address, change);
        self.memory_usage_bytes += change.size();
        self.operation_count += 1;
        self.last_modified = std.time.milliTimestamp();
    }
    
    pub fn delete_account(self: *StateBundle, address: Address, old_account: Account) !void {
        if (self.is_sealed) {
            return BundleError.BundleSealed;
        }
        
        const change = AccountChange{
            .change_type = .Deleted,
            .old_account = old_account,
            .new_account = null,
            .timestamp = std.time.milliTimestamp(),
        };
        
        try self.account_changes.put(address, change);
        self.memory_usage_bytes += change.size();
        self.operation_count += 1;
        self.last_modified = std.time.milliTimestamp();
    }
    
    pub fn set_storage(self: *StateBundle, address: Address, key: U256, old_value: U256, new_value: U256) !void {
        if (self.is_sealed) {
            return BundleError.BundleSealed;
        }
        
        const storage_key = StorageKey.init(address, key);
        const change = StorageChange{
            .change_type = .Set,
            .old_value = old_value,
            .new_value = new_value,
            .timestamp = std.time.milliTimestamp(),
        };
        
        try self.storage_changes.put(storage_key, change);
        self.memory_usage_bytes += change.size();
        self.operation_count += 1;
        self.last_modified = std.time.milliTimestamp();
    }
    
    pub fn set_code(self: *StateBundle, address: Address, old_code: ?[]const u8, new_code: []const u8) !void {
        if (self.is_sealed) {
            return BundleError.BundleSealed;
        }
        
        // Clone the code data
        const cloned_old_code = if (old_code) |code| try self.allocator.dupe(u8, code) else null;
        const cloned_new_code = try self.allocator.dupe(u8, new_code);
        
        const change = CodeChange{
            .change_type = .Set,
            .old_code = cloned_old_code,
            .new_code = cloned_new_code,
            .timestamp = std.time.milliTimestamp(),
        };
        
        // Remove existing change if present
        if (self.code_changes.fetchRemove(address)) |existing| {
            existing.value.deinit(self.allocator);
            self.memory_usage_bytes -= existing.value.size();
        }
        
        try self.code_changes.put(address, change);
        self.memory_usage_bytes += change.size();
        self.operation_count += 1;
        self.last_modified = std.time.milliTimestamp();
    }
    
    pub fn add_log(self: *StateBundle, address: Address, topics: []const Hash, data: []const u8) !void {
        if (self.is_sealed) {
            return BundleError.BundleSealed;
        }
        
        // Clone the log data
        const cloned_topics = try self.allocator.dupe(Hash, topics);
        const cloned_data = try self.allocator.dupe(u8, data);
        
        const log_entry = LogEntry{
            .address = address,
            .topics = cloned_topics,
            .data = cloned_data,
            .timestamp = std.time.milliTimestamp(),
        };
        
        try self.log_entries.append(log_entry);
        self.memory_usage_bytes += log_entry.size();
        self.operation_count += 1;
        self.last_modified = std.time.milliTimestamp();
    }
    
    pub fn fork(self: *const StateBundle, child_id: StateBundleManager.BundleId) !StateBundle {
        var child_bundle = StateBundle.init(
            self.allocator,
            child_id,
            .Fork,
            StateBundleManager.BundleConfig.production()
        );
        
        // Copy all changes from parent
        var account_iterator = self.account_changes.iterator();
        while (account_iterator.next()) |entry| {
            try child_bundle.account_changes.put(entry.key_ptr.*, entry.value_ptr.*);
        }
        
        var storage_iterator = self.storage_changes.iterator();
        while (storage_iterator.next()) |entry| {
            try child_bundle.storage_changes.put(entry.key_ptr.*, entry.value_ptr.*);
        }
        
        var code_iterator = self.code_changes.iterator();
        while (code_iterator.next()) |entry| {
            // Deep copy the code change
            const old_code = if (entry.value_ptr.old_code) |code|
                try self.allocator.dupe(u8, code)
            else
                null;
            
            const new_code = if (entry.value_ptr.new_code) |code|
                try self.allocator.dupe(u8, code)
            else
                null;
            
            const cloned_change = CodeChange{
                .change_type = entry.value_ptr.change_type,
                .old_code = old_code,
                .new_code = new_code,
                .timestamp = entry.value_ptr.timestamp,
            };
            
            try child_bundle.code_changes.put(entry.key_ptr.*, cloned_change);
        }
        
        // Copy log entries
        for (self.log_entries.items) |*entry| {
            const cloned_topics = try self.allocator.dupe(Hash, entry.topics);
            const cloned_data = try self.allocator.dupe(u8, entry.data);
            
            const cloned_entry = LogEntry{
                .address = entry.address,
                .topics = cloned_topics,
                .data = cloned_data,
                .timestamp = entry.timestamp,
            };
            
            try child_bundle.log_entries.append(cloned_entry);
        }
        
        child_bundle.operation_count = self.operation_count;
        child_bundle.memory_usage_bytes = self.memory_usage_bytes;
        
        return child_bundle;
    }
    
    pub fn merge_from(self: *StateBundle, source: *const StateBundle, strategy: StateBundleManager.MergeStrategy) !void {
        if (self.is_sealed) {
            return BundleError.BundleSealed;
        }
        
        // Merge account changes
        var account_iterator = source.account_changes.iterator();
        while (account_iterator.next()) |entry| {
            const address = entry.key_ptr.*;
            const source_change = entry.value_ptr.*;
            
            if (self.account_changes.get(address)) |existing_change| {
                // Handle conflict
                switch (strategy) {
                    .OverwriteConflicts => {
                        try self.account_changes.put(address, source_change);
                    },
                    .PreserveTarget => {
                        // Keep existing change, ignore source
                    },
                    .ThrowOnConflicts => {
                        return BundleError.MergeConflict;
                    },
                    .CustomResolver => {
                        // Would implement custom resolution logic
                        try self.account_changes.put(address, source_change);
                    },
                }
            } else {
                try self.account_changes.put(address, source_change);
            }
        }
        
        // Merge storage changes
        var storage_iterator = source.storage_changes.iterator();
        while (storage_iterator.next()) |entry| {
            const storage_key = entry.key_ptr.*;
            const source_change = entry.value_ptr.*;
            
            if (self.storage_changes.get(storage_key)) |existing_change| {
                switch (strategy) {
                    .OverwriteConflicts => {
                        try self.storage_changes.put(storage_key, source_change);
                    },
                    .PreserveTarget => {
                        // Keep existing
                    },
                    .ThrowOnConflicts => {
                        return BundleError.MergeConflict;
                    },
                    .CustomResolver => {
                        try self.storage_changes.put(storage_key, source_change);
                    },
                }
            } else {
                try self.storage_changes.put(storage_key, source_change);
            }
        }
        
        // Merge code changes (similar pattern)
        var code_iterator = source.code_changes.iterator();
        while (code_iterator.next()) |entry| {
            const address = entry.key_ptr.*;
            const source_change = entry.value_ptr.*;
            
            if (self.code_changes.get(address)) |existing_change| {
                switch (strategy) {
                    .OverwriteConflicts => {
                        // Clean up existing change
                        var existing_mutable = existing_change;
                        existing_mutable.deinit(self.allocator);
                        
                        // Clone the source change
                        const cloned_change = try self.clone_code_change(source_change);
                        try self.code_changes.put(address, cloned_change);
                    },
                    .PreserveTarget => {
                        // Keep existing
                    },
                    .ThrowOnConflicts => {
                        return BundleError.MergeConflict;
                    },
                    .CustomResolver => {
                        var existing_mutable = existing_change;
                        existing_mutable.deinit(self.allocator);
                        
                        const cloned_change = try self.clone_code_change(source_change);
                        try self.code_changes.put(address, cloned_change);
                    },
                }
            } else {
                const cloned_change = try self.clone_code_change(source_change);
                try self.code_changes.put(address, cloned_change);
            }
        }
        
        // Merge log entries (always append)
        for (source.log_entries.items) |*entry| {
            const cloned_topics = try self.allocator.dupe(Hash, entry.topics);
            const cloned_data = try self.allocator.dupe(u8, entry.data);
            
            const cloned_entry = LogEntry{
                .address = entry.address,
                .topics = cloned_topics,
                .data = cloned_data,
                .timestamp = entry.timestamp,
            };
            
            try self.log_entries.append(cloned_entry);
        }
        
        self.operation_count += source.operation_count;
        self.last_modified = std.time.milliTimestamp();
        self.recalculate_memory_usage();
    }
    
    pub fn apply_to_state(self: *const StateBundle, state: *StateInterface) !void {
        // Apply account changes
        var account_iterator = self.account_changes.iterator();
        while (account_iterator.next()) |entry| {
            const address = entry.key_ptr.*;
            const change = entry.value_ptr.*;
            
            switch (change.change_type) {
                .Created, .Modified => {
                    if (change.new_account) |account| {
                        try state.set_account(address, account);
                    }
                },
                .Deleted => {
                    try state.delete_account(address);
                },
                .Restored => {
                    if (change.old_account) |account| {
                        try state.set_account(address, account);
                    }
                },
            }
        }
        
        // Apply storage changes
        var storage_iterator = self.storage_changes.iterator();
        while (storage_iterator.next()) |entry| {
            const storage_key = entry.key_ptr.*;
            const change = entry.value_ptr.*;
            
            switch (change.change_type) {
                .Set => {
                    try state.set_storage(storage_key.address, storage_key.key, change.new_value);
                },
                .Deleted => {
                    try state.set_storage(storage_key.address, storage_key.key, U256.zero());
                },
                .Restored => {
                    try state.set_storage(storage_key.address, storage_key.key, change.old_value);
                },
            }
        }
        
        // Apply code changes
        var code_iterator = self.code_changes.iterator();
        while (code_iterator.next()) |entry| {
            const address = entry.key_ptr.*;
            const change = entry.value_ptr.*;
            
            switch (change.change_type) {
                .Set => {
                    if (change.new_code) |code| {
                        try state.set_code(address, code);
                    }
                },
                .Deleted => {
                    try state.set_code(address, &[_]u8{});
                },
                .Restored => {
                    if (change.old_code) |code| {
                        try state.set_code(address, code);
                    }
                },
            }
        }
        
        // Apply log entries
        for (self.log_entries.items) |*entry| {
            try state.add_log(Log{
                .address = entry.address,
                .topics = entry.topics,
                .data = entry.data,
            });
        }
    }
    
    pub fn clear(self: *StateBundle) void {
        // Clear account changes
        self.account_changes.clearRetainingCapacity();
        
        // Clear storage changes
        self.storage_changes.clearRetainingCapacity();
        
        // Clear and cleanup code changes
        var code_iterator = self.code_changes.iterator();
        while (code_iterator.next()) |entry| {
            entry.value_ptr.deinit(self.allocator);
        }
        self.code_changes.clearRetainingCapacity();
        
        // Clear and cleanup log entries
        for (self.log_entries.items) |*entry| {
            entry.deinit(self.allocator);
        }
        self.log_entries.clearRetainingCapacity();
        
        self.operation_count = 0;
        self.memory_usage_bytes = 0;
        self.last_modified = std.time.milliTimestamp();
    }
    
    pub fn seal(self: *StateBundle) void {
        self.is_sealed = true;
        self.last_modified = std.time.milliTimestamp();
    }
    
    pub fn is_empty(self: *const StateBundle) bool {
        return self.account_changes.count() == 0 and
               self.storage_changes.count() == 0 and
               self.code_changes.count() == 0 and
               self.log_entries.items.len == 0;
    }
    
    pub fn memory_usage(self: *const StateBundle) usize {
        return self.memory_usage_bytes;
    }
    
    fn clone_code_change(self: *StateBundle, source: CodeChange) !CodeChange {
        const old_code = if (source.old_code) |code|
            try self.allocator.dupe(u8, code)
        else
            null;
        
        const new_code = if (source.new_code) |code|
            try self.allocator.dupe(u8, code)
        else
            null;
        
        return CodeChange{
            .change_type = source.change_type,
            .old_code = old_code,
            .new_code = new_code,
            .timestamp = source.timestamp,
        };
    }
    
    fn recalculate_memory_usage(self: *StateBundle) void {
        var total: usize = @sizeOf(StateBundle);
        
        var account_iterator = self.account_changes.iterator();
        while (account_iterator.next()) |entry| {
            total += entry.value_ptr.size();
        }
        
        var storage_iterator = self.storage_changes.iterator();
        while (storage_iterator.next()) |entry| {
            total += entry.value_ptr.size();
        }
        
        var code_iterator = self.code_changes.iterator();
        while (code_iterator.next()) |entry| {
            total += entry.value_ptr.size();
        }
        
        for (self.log_entries.items) |*entry| {
            total += entry.size();
        }
        
        self.memory_usage_bytes = total;
    }
};
```

#### 3. Bundle Statistics and Monitoring
```zig
pub const BundleStatistics = struct {
    bundles_created: u64,
    bundles_committed: u64,
    bundles_rolled_back: u64,
    bundles_forked: u64,
    bundles_merged: u64,
    checkpoints_created: u64,
    checkpoints_restored: u64,
    garbage_collections: u64,
    operations_since_checkpoint: u64,
    
    total_memory_usage: usize,
    peak_memory_usage: usize,
    active_bundles_count: u32,
    
    start_time: i64,
    
    pub fn init() BundleStatistics {
        return BundleStatistics{
            .bundles_created = 0,
            .bundles_committed = 0,
            .bundles_rolled_back = 0,
            .bundles_forked = 0,
            .bundles_merged = 0,
            .checkpoints_created = 0,
            .checkpoints_restored = 0,
            .garbage_collections = 0,
            .operations_since_checkpoint = 0,
            .total_memory_usage = 0,
            .peak_memory_usage = 0,
            .active_bundles_count = 0,
            .start_time = std.time.milliTimestamp(),
        };
    }
    
    pub fn record_bundle_creation(self: *BundleStatistics, bundle_type: StateBundle.BundleType) void {
        _ = bundle_type;
        self.bundles_created += 1;
        self.active_bundles_count += 1;
    }
    
    pub fn record_bundle_commit(self: *BundleStatistics) void {
        self.bundles_committed += 1;
        self.active_bundles_count -= 1;
        self.operations_since_checkpoint += 1;
    }
    
    pub fn record_bundle_rollback(self: *BundleStatistics) void {
        self.bundles_rolled_back += 1;
        self.active_bundles_count -= 1;
    }
    
    pub fn record_bundle_fork(self: *BundleStatistics) void {
        self.bundles_forked += 1;
        self.active_bundles_count += 1;
    }
    
    pub fn record_bundle_merge(self: *BundleStatistics, strategy: StateBundleManager.MergeStrategy) void {
        _ = strategy;
        self.bundles_merged += 1;
    }
    
    pub fn record_checkpoint_creation(self: *BundleStatistics) void {
        self.checkpoints_created += 1;
        self.operations_since_checkpoint = 0;
    }
    
    pub fn record_checkpoint_restoration(self: *BundleStatistics) void {
        self.checkpoints_restored += 1;
    }
    
    pub fn record_garbage_collection(self: *BundleStatistics, bundles_removed: usize) void {
        self.garbage_collections += 1;
        self.active_bundles_count -= @intCast(u32, bundles_removed);
    }
    
    pub fn update_memory_usage(self: *BundleStatistics, current_usage: usize) void {
        self.total_memory_usage = current_usage;
        if (current_usage > self.peak_memory_usage) {
            self.peak_memory_usage = current_usage;
        }
    }
    
    pub fn get_success_rate(self: *const BundleStatistics) f64 {
        const total_operations = self.bundles_committed + self.bundles_rolled_back;
        return if (total_operations > 0)
            @as(f64, @floatFromInt(self.bundles_committed)) / @as(f64, @floatFromInt(total_operations))
        else
            0.0;
    }
    
    pub fn get_uptime_seconds(self: *const BundleStatistics) f64 {
        const now = std.time.milliTimestamp();
        return @as(f64, @floatFromInt(now - self.start_time)) / 1000.0;
    }
    
    pub fn print_summary(self: *const BundleStatistics) void {
        const success_rate = self.get_success_rate() * 100.0;
        const uptime = self.get_uptime_seconds();
        
        std.log.info("=== BUNDLE MANAGEMENT STATISTICS ===");
        std.log.info("Bundles created: {}", .{self.bundles_created});
        std.log.info("Bundles committed: {}", .{self.bundles_committed});
        std.log.info("Bundles rolled back: {}", .{self.bundles_rolled_back});
        std.log.info("Bundles forked: {}", .{self.bundles_forked});
        std.log.info("Bundles merged: {}", .{self.bundles_merged});
        std.log.info("Success rate: {d:.2}%", .{success_rate});
        std.log.info("Active bundles: {}", .{self.active_bundles_count});
        std.log.info("Checkpoints created: {}", .{self.checkpoints_created});
        std.log.info("Checkpoints restored: {}", .{self.checkpoints_restored});
        std.log.info("Garbage collections: {}", .{self.garbage_collections});
        std.log.info("Current memory usage: {} bytes", .{self.total_memory_usage});
        std.log.info("Peak memory usage: {} bytes", .{self.peak_memory_usage});
        std.log.info("Operations since checkpoint: {}", .{self.operations_since_checkpoint});
        std.log.info("Uptime: {d:.2}s", .{uptime});
    }
};

pub const BundleError = error{
    BundleNotFound,
    BundleSealed,
    TooManyActiveBundles,
    BundleTooLarge,
    MergeConflict,
    InvalidBundleType,
    CheckpointNotFound,
    InsufficientMemory,
    OperationTimeout,
    ConflictDetectionFailed,
    InvalidMergeStrategy,
};
```

## Implementation Requirements

### Core Functionality
1. **Efficient State Bundling**: Group related state changes for batch processing
2. **Flexible Rollback**: Support partial and complete rollbacks with proper cleanup
3. **Conflict Detection**: Identify and resolve conflicts between concurrent bundles
4. **Memory Management**: Efficient memory usage with automatic garbage collection
5. **Checkpoint Integration**: Seamless integration with checkpoint/restore functionality
6. **Performance Monitoring**: Comprehensive statistics and performance tracking

## Implementation Tasks

### Task 1: Implement Checkpoint Manager
File: `/src/evm/bundle_state/checkpoint_manager.zig`
```zig
const std = @import("std");
const StateInterface = @import("../state/state_interface.zig").StateInterface;

pub const CheckpointManager = struct {
    allocator: std.mem.Allocator,
    config: StateBundleManager.BundleConfig,
    checkpoints: std.HashMap(CheckpointId, Checkpoint, CheckpointIdContext, std.hash_map.default_max_load_percentage),
    checkpoint_counter: u64,
    
    pub const CheckpointId = struct {
        id: u64,
        timestamp: i64,
        
        pub fn new(id: u64) CheckpointId {
            return CheckpointId{
                .id = id,
                .timestamp = std.time.milliTimestamp(),
            };
        }
    };
    
    pub const Checkpoint = struct {
        id: CheckpointId,
        state_snapshot: StateSnapshot,
        created_at: i64,
        memory_usage: usize,
        
        pub fn deinit(self: *Checkpoint, allocator: std.mem.Allocator) void {
            self.state_snapshot.deinit(allocator);
        }
    };
    
    pub const StateSnapshot = struct {
        accounts: std.HashMap(Address, Account, AddressContext, std.hash_map.default_max_load_percentage),
        storage: std.HashMap(StorageKey, U256, StorageKeyContext, std.hash_map.default_max_load_percentage),
        code: std.HashMap(Address, []const u8, AddressContext, std.hash_map.default_max_load_percentage),
        
        pub fn init(allocator: std.mem.Allocator) StateSnapshot {
            return StateSnapshot{
                .accounts = std.HashMap(Address, Account, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
                .storage = std.HashMap(StorageKey, U256, StorageKeyContext, std.hash_map.default_max_load_percentage).init(allocator),
                .code = std.HashMap(Address, []const u8, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *StateSnapshot, allocator: std.mem.Allocator) void {
            // Clean up code entries
            var code_iterator = self.code.iterator();
            while (code_iterator.next()) |entry| {
                allocator.free(entry.value_ptr.*);
            }
            
            self.accounts.deinit();
            self.storage.deinit();
            self.code.deinit();
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: StateBundleManager.BundleConfig) CheckpointManager {
        return CheckpointManager{
            .allocator = allocator,
            .config = config,
            .checkpoints = std.HashMap(CheckpointId, Checkpoint, CheckpointIdContext, std.hash_map.default_max_load_percentage).init(allocator),
            .checkpoint_counter = 0,
        };
    }
    
    pub fn deinit(self: *CheckpointManager) void {
        var iterator = self.checkpoints.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.deinit(self.allocator);
        }
        self.checkpoints.deinit();
    }
    
    pub fn create_checkpoint(self: *CheckpointManager, state: *StateInterface) !CheckpointId {
        self.checkpoint_counter += 1;
        const checkpoint_id = CheckpointId.new(self.checkpoint_counter);
        
        // Create state snapshot
        var snapshot = StateSnapshot.init(self.allocator);
        try self.capture_state_snapshot(state, &snapshot);
        
        const checkpoint = Checkpoint{
            .id = checkpoint_id,
            .state_snapshot = snapshot,
            .created_at = std.time.milliTimestamp(),
            .memory_usage = self.calculate_snapshot_size(&snapshot),
        };
        
        try self.checkpoints.put(checkpoint_id, checkpoint);
        
        return checkpoint_id;
    }
    
    pub fn restore_checkpoint(self: *CheckpointManager, checkpoint_id: CheckpointId, state: *StateInterface) !void {
        const checkpoint = self.checkpoints.get(checkpoint_id) orelse {
            return BundleError.CheckpointNotFound;
        };
        
        try self.restore_state_snapshot(&checkpoint.state_snapshot, state);
    }
    
    pub fn delete_checkpoint(self: *CheckpointManager, checkpoint_id: CheckpointId) void {
        if (self.checkpoints.fetchRemove(checkpoint_id)) |kv| {
            var checkpoint = kv.value;
            checkpoint.deinit(self.allocator);
        }
    }
    
    pub fn garbage_collect(self: *CheckpointManager) !void {
        const current_time = std.time.milliTimestamp();
        const max_age = 3600000; // 1 hour
        
        var checkpoints_to_remove = std.ArrayList(CheckpointId).init(self.allocator);
        defer checkpoints_to_remove.deinit();
        
        var iterator = self.checkpoints.iterator();
        while (iterator.next()) |entry| {
            const age = current_time - entry.value_ptr.created_at;
            if (age > max_age) {
                try checkpoints_to_remove.append(entry.key_ptr.*);
            }
        }
        
        for (checkpoints_to_remove.items) |checkpoint_id| {
            self.delete_checkpoint(checkpoint_id);
        }
    }
    
    pub fn memory_usage(self: *CheckpointManager) usize {
        var total: usize = 0;
        var iterator = self.checkpoints.iterator();
        while (iterator.next()) |entry| {
            total += entry.value_ptr.memory_usage;
        }
        return total;
    }
    
    fn capture_state_snapshot(self: *CheckpointManager, state: *StateInterface, snapshot: *StateSnapshot) !void {
        // This would require extending StateInterface to support iteration
        // For now, implement a placeholder
        _ = self;
        _ = state;
        _ = snapshot;
        
        // In a real implementation, this would iterate through all state
        // and capture a complete snapshot
    }
    
    fn restore_state_snapshot(self: *CheckpointManager, snapshot: *const StateSnapshot, state: *StateInterface) !void {
        _ = self;
        
        // Restore accounts
        var account_iterator = snapshot.accounts.iterator();
        while (account_iterator.next()) |entry| {
            try state.set_account(entry.key_ptr.*, entry.value_ptr.*);
        }
        
        // Restore storage
        var storage_iterator = snapshot.storage.iterator();
        while (storage_iterator.next()) |entry| {
            const storage_key = entry.key_ptr.*;
            try state.set_storage(storage_key.address, storage_key.key, entry.value_ptr.*);
        }
        
        // Restore code
        var code_iterator = snapshot.code.iterator();
        while (code_iterator.next()) |entry| {
            try state.set_code(entry.key_ptr.*, entry.value_ptr.*);
        }
    }
    
    fn calculate_snapshot_size(self: *CheckpointManager, snapshot: *const StateSnapshot) usize {
        _ = self;
        
        var size: usize = 0;
        
        size += snapshot.accounts.count() * @sizeOf(Account);
        size += snapshot.storage.count() * @sizeOf(U256);
        
        var code_iterator = snapshot.code.iterator();
        while (code_iterator.next()) |entry| {
            size += entry.value_ptr.len;
        }
        
        return size;
    }
    
    pub const CheckpointIdContext = struct {
        pub fn hash(self: @This(), key: CheckpointId) u64 {
            _ = self;
            return key.id;
        }
        
        pub fn eql(self: @This(), a: CheckpointId, b: CheckpointId) bool {
            _ = self;
            return a.id == b.id;
        }
    };
};
```

### Task 2: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const StateBundleManager = @import("bundle_state/state_bundle_manager.zig").StateBundleManager;
const StateBundle = @import("bundle_state/state_bundle.zig").StateBundle;

pub const Vm = struct {
    // Existing fields...
    bundle_manager: ?StateBundleManager,
    current_bundle: ?StateBundleManager.BundleId,
    bundle_enabled: bool,
    
    pub fn enable_bundle_management(self: *Vm, config: StateBundleManager.BundleConfig) !void {
        self.bundle_manager = StateBundleManager.init(self.allocator, config);
        self.bundle_enabled = true;
    }
    
    pub fn disable_bundle_management(self: *Vm) void {
        if (self.bundle_manager) |*manager| {
            manager.deinit();
            self.bundle_manager = null;
        }
        self.bundle_enabled = false;
        self.current_bundle = null;
    }
    
    pub fn begin_bundle(self: *Vm, bundle_type: StateBundle.BundleType) !StateBundleManager.BundleId {
        if (self.bundle_manager) |*manager| {
            const bundle_id = try manager.create_bundle(bundle_type);
            self.current_bundle = bundle_id;
            return bundle_id;
        }
        return BundleError.BundleNotFound;
    }
    
    pub fn commit_current_bundle(self: *Vm) !void {
        if (self.bundle_manager) |*manager| {
            if (self.current_bundle) |bundle_id| {
                try manager.commit_bundle(bundle_id, &self.state);
                self.current_bundle = null;
            }
        }
    }
    
    pub fn rollback_current_bundle(self: *Vm) !void {
        if (self.bundle_manager) |*manager| {
            if (self.current_bundle) |bundle_id| {
                try manager.rollback_bundle(bundle_id);
                self.current_bundle = null;
            }
        }
    }
    
    pub fn get_bundle_statistics(self: *Vm) ?StateBundleManager.BundleStatistics {
        if (self.bundle_manager) |*manager| {
            return manager.get_statistics();
        }
        return null;
    }
    
    // Override state operations to track changes in bundle
    pub fn set_account_bundled(self: *Vm, address: Address, account: Account) !void {
        const old_account = self.state.get_account(address);
        
        // Apply to actual state
        try self.state.set_account(address, account);
        
        // Track in bundle if active
        if (self.bundle_manager) |*manager| {
            if (self.current_bundle) |bundle_id| {
                if (manager.get_bundle(bundle_id)) |bundle| {
                    try bundle.set_account(address, old_account, account);
                }
            }
        }
    }
    
    pub fn set_storage_bundled(self: *Vm, address: Address, key: U256, value: U256) !void {
        const old_value = try self.state.get_storage(address, key);
        
        // Apply to actual state
        try self.state.set_storage(address, key, value);
        
        // Track in bundle if active
        if (self.bundle_manager) |*manager| {
            if (self.current_bundle) |bundle_id| {
                if (manager.get_bundle(bundle_id)) |bundle| {
                    try bundle.set_storage(address, key, old_value, value);
                }
            }
        }
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/bundle_state/bundle_state_management_test.zig`

### Test Cases
```zig
test "bundle creation and basic operations" {
    // Test bundle creation with different types
    // Test basic bundle operations
    // Test bundle sealing
}

test "bundle forking and merging" {
    // Test bundle forking
    // Test merge strategies
    // Test conflict detection and resolution
}

test "checkpoint management" {
    // Test checkpoint creation
    // Test checkpoint restoration
    // Test checkpoint garbage collection
}

test "bundle rollback and commit" {
    // Test successful commit operations
    // Test rollback scenarios
    // Test partial rollbacks
}

test "memory management and garbage collection" {
    // Test memory usage tracking
    // Test automatic garbage collection
    // Test memory pressure handling
}

test "concurrent bundle operations" {
    // Test thread safety
    // Test concurrent bundle modifications
    // Test conflict resolution
}

test "integration with VM execution" {
    // Test VM integration
    // Test execution with bundles
    // Test performance impact
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/bundle_state/state_bundle_manager.zig` - Main bundle management system
- `/src/evm/bundle_state/state_bundle.zig` - Individual state bundle implementation
- `/src/evm/bundle_state/checkpoint_manager.zig` - Checkpoint creation and restoration
- `/src/evm/bundle_state/diff_tracker.zig` - Change tracking and diff management
- `/src/evm/bundle_state/conflict_resolver.zig` - Conflict detection and resolution
- `/src/evm/bundle_state/bundle_statistics.zig` - Performance monitoring and statistics
- `/src/evm/vm.zig` - VM integration with bundle management
- `/src/evm/state/` - State interface integration for bundle operations
- `/test/evm/bundle_state/bundle_state_management_test.zig` - Comprehensive tests

## Success Criteria

1. **Efficient Bundling**: Fast state change grouping and tracking
2. **Reliable Rollback**: Complete and accurate state restoration
3. **Conflict Resolution**: Effective handling of concurrent modifications
4. **Memory Efficiency**: Optimal memory usage with automatic cleanup
5. **Performance**: Minimal overhead for bundle operations
6. **Integration**: Seamless VM integration with existing state management

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Data integrity** - Bundles must maintain state consistency
3. **Memory safety** - No memory leaks or corruption during bundle operations
4. **Atomicity** - Bundle operations must be atomic (all-or-nothing)
5. **Performance** - Bundle overhead must be minimal for normal execution
6. **Thread safety** - Concurrent bundle operations must be safe

## References

- [Database Transactions](https://en.wikipedia.org/wiki/Database_transaction) - ACID transaction principles
- [Copy-on-Write](https://en.wikipedia.org/wiki/Copy-on-write) - Efficient state copying techniques
- [Snapshot Isolation](https://en.wikipedia.org/wiki/Snapshot_isolation) - Isolation level for concurrent operations
- [Version Control Systems](https://en.wikipedia.org/wiki/Version_control) - Branching and merging concepts
- [MEV Bundles](https://docs.flashbots.net/flashbots-auction/searchers/advanced/bundles) - MEV bundle execution patterns