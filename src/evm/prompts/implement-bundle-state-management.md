# Implement Bundle State Management

<<<<<<< HEAD
You are implementing Bundle State Management for the Tevm EVM written in Zig. Your goal is to implement bundle state management for transaction batching following Ethereum specifications and maintaining compatibility with existing implementations.

=======
<review>
**Implementation Status: NOT IMPLEMENTED ❌**

**Current Status:**
- Basic state management exists with journal for rollbacks
- No bundle state management or transaction batching support
- Missing efficient diff tracking and checkpoint management for bundles

**Implementation Requirements:**
- Bundle state management system for transaction batching
- Efficient state diff tracking and merging capabilities
- Integration with existing journal.zig for rollback support

**Priority: HIGH - Essential for MEV bundles, transaction batching, and advanced execution scenarios**
</review>

You are implementing Bundle State Management for the Tevm EVM written in Zig. Your goal is to implement bundle state management for transaction batching following Ethereum specifications and maintaining compatibility with existing implementations.

>>>>>>> origin/main
## Development Workflow
- **Branch**: `feat_implement_bundle_state_management` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_bundle_state_management feat_implement_bundle_state_management`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive bundle state management that efficiently handles state transitions, rollbacks, and batch operations. This includes state bundling for transaction execution, efficient diff tracking, checkpoint management, and optimized state merging for complex execution scenarios like MEV bundles and transaction batching.

## ELI5

Think of bundle state management like managing multiple drafts of a document at the same time. Imagine you're editing a complex legal document where different people are making changes simultaneously, and you need to:

1. **Keep track of all changes** (like "track changes" in Word, but much more sophisticated)
2. **Group related changes together** (like bundling all changes from one reviewer)
3. **Try out combinations** of changes without breaking the original
4. **Roll back easily** if something goes wrong

In blockchain terms:
- **State**: The current "version" of all account balances and contract data
- **Bundle**: A group of transactions that should be processed together (like a batch of related edits)
- **Checkpoint**: A save point you can return to if things go wrong (like saving your document before making risky changes)
- **Rollback**: Undoing changes back to a previous checkpoint (like hitting Ctrl+Z)

This is especially critical for:
- **MEV (Maximal Extractable Value)**: Traders who want to execute multiple related transactions as one atomic unit
- **Transaction Batching**: Processing many transactions efficiently while ensuring they don't interfere with each other
- **Simulation**: Testing "what if" scenarios without actually changing the real state

The enhanced version is like having a super-smart document management system that can predict which changes will conflict, optimize the order of changes, and merge complex edits intelligently.

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

#### 1. **Unit Tests** (`/test/evm/state/bundle_state_management_test.zig`)
```zig
// Test basic bundle state management functionality
test "bundle_state_management basic bundle operations with known scenarios"
test "bundle_state_management handles state bundling correctly"
test "bundle_state_management validates bundle consistency"
test "bundle_state_management produces expected bundle results"
```

#### 2. **Integration Tests**
```zig
test "bundle_state_management integrates with EVM state system"
test "bundle_state_management works with existing transaction processing"
test "bundle_state_management maintains state atomicity"
test "bundle_state_management handles bundle rollback scenarios"
```

#### 3. **Performance Tests**
```zig
test "bundle_state_management meets bundle processing speed targets"
test "bundle_state_management memory usage vs baseline"
test "bundle_state_management scalability under high bundle frequency"
test "bundle_state_management benchmark complex bundle scenarios"
```

#### 4. **Error Handling Tests**
```zig
test "bundle_state_management proper bundle failure error handling"
test "bundle_state_management handles corrupted bundles gracefully"
test "bundle_state_management graceful degradation on bundle system failures"
test "bundle_state_management recovery from bundle inconsistency"
```

#### 5. **Compliance Tests**
```zig
test "bundle_state_management EVM specification state consistency compliance"
test "bundle_state_management cross-client bundle behavior consistency"
test "bundle_state_management hardfork bundle rule adherence"
test "bundle_state_management deterministic bundle processing"
```

#### 6. **Security Tests**
```zig
test "bundle_state_management handles malicious bundle manipulation safely"
test "bundle_state_management prevents bundle-based state corruption"
test "bundle_state_management validates bundle isolation properties"
test "bundle_state_management maintains bundle atomic guarantees"
```

### Test Development Priority
1. **Core bundle functionality tests** - Ensure basic bundle state operations work
2. **Compliance tests** - Meet EVM specification state consistency requirements
3. **Performance tests** - Achieve bundle processing efficiency targets
4. **Security tests** - Prevent bundle-related vulnerabilities
5. **Error handling tests** - Robust bundle failure management
6. **Edge case tests** - Handle bundle boundary conditions

### Test Data Sources
- **EVM specification**: Official state consistency and atomicity requirements
- **Reference implementations**: Cross-client bundle compatibility data
- **Performance baselines**: Bundle processing speed and memory measurements
- **Security test vectors**: Bundle manipulation prevention cases
- **Real-world scenarios**: Production bundle pattern validation

### Continuous Testing
- Run `zig build test-all` after every code change
- Maintain 100% test coverage for public bundle state APIs
- Validate bundle processing performance regression prevention
- Test debug and release builds with different bundle configurations
- Verify cross-platform bundle behavior consistency

### Test-First Examples

**Before writing any implementation:**
```zig
test "bundle_state_management basic bundle creation and commit" {
    // This test MUST fail initially
    const state_manager = test_utils.createStateManager();
    const bundle = bundle_state_management.createBundle(state_manager);
    
    // Apply some state changes to bundle
    try bundle_state_management.setBundleAccount(bundle, test_address, test_account);
    
    // Commit bundle
    const result = bundle_state_management.commitBundle(state_manager, bundle);
    try testing.expect(result.success);
}
```

**Only then implement:**
```zig
pub const bundle_state_management = struct {
    pub fn createBundle(state_manager: *StateManager) !*StateBundle {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
    
    pub fn commitBundle(state_manager: *StateManager, bundle: *StateBundle) !CommitResult {
        // Minimal implementation
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Notes
- **Never commit without passing tests** (`zig build test-all`)
- **Test all bundle operation combinations** - Especially for complex state transitions
- **Verify EVM specification compliance** - Critical for protocol state correctness
- **Test bundle performance implications** - Especially for large state bundle processing
- **Validate bundle security properties** - Prevent state corruption and ensure atomicity

## References

- [Database Transactions](https://en.wikipedia.org/wiki/Database_transaction) - ACID transaction principles
- [Copy-on-Write](https://en.wikipedia.org/wiki/Copy-on-write) - Efficient state copying techniques
- [Snapshot Isolation](https://en.wikipedia.org/wiki/Snapshot_isolation) - Isolation level for concurrent operations
- [Version Control Systems](https://en.wikipedia.org/wiki/Version_control) - Branching and merging concepts
- [MEV Bundles](https://docs.flashbots.net/flashbots-auction/searchers/advanced/bundles) - MEV bundle execution patterns

## EVMONE Context

This prompt requests the implementation of a state management system for transaction "bundles", which is analogous to a state journaling and checkpointing system. `evmone` has a robust implementation of this for handling transaction reverts and nested calls. The most relevant parts are the `State` class, which manages the journal of changes, and the `Host` class, which orchestrates state modifications and rollbacks.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/state.hpp">
```cpp
#include "account.hpp"
#include "block.hpp"
#include "bloom_filter.hpp"
#include "errors.hpp"
#include "hash_utils.hpp"
#include "state_diff.hpp"
#include "state_view.hpp"
#include "transaction.hpp"
#include <variant>

namespace evmone::state
{
/// The Ethereum State: the collection of accounts mapped by their addresses.
class State
{
    struct JournalBase
    {
        address addr;
    };

    struct JournalBalanceChange : JournalBase
    {
        intx::uint256 prev_balance;
    };

    struct JournalTouched : JournalBase
    {};

    struct JournalStorageChange : JournalBase
    {
        bytes32 key;
        bytes32 prev_value;
        evmc_access_status prev_access_status;
    };

    struct JournalTransientStorageChange : JournalBase
    {
        bytes32 key;
        bytes32 prev_value;
    };

    struct JournalNonceBump : JournalBase
    {};

    struct JournalCreate : JournalBase
    {
        bool existed;
    };

    struct JournalDestruct : JournalBase
    {};

    struct JournalAccessAccount : JournalBase
    {};

    using JournalEntry =
        std::variant<JournalBalanceChange, JournalTouched, JournalStorageChange, JournalNonceBump,
            JournalCreate, JournalTransientStorageChange, JournalDestruct, JournalAccessAccount>;

    /// The read-only view of the initial (cold) state.
    const StateView& m_initial;

    /// The accounts loaded from the initial state and potentially modified.
    std::unordered_map<address, Account> m_modified;

    /// The state journal: the list of changes made to the state
    /// with information how to revert them.
    std::vector<JournalEntry> m_journal;

public:
    explicit State(const StateView& state_view) noexcept : m_initial{state_view} {}
    State(const State&) = delete;
    State(State&&) = delete;
    State& operator=(State&&) = delete;

    // ... (other state access methods)

    /// Returns the state journal checkpoint. It can be later used to in rollback()
    /// to revert changes newer than the checkpoint.
    [[nodiscard]] size_t checkpoint() const noexcept { return m_journal.size(); }

    /// Reverts state changes made after the checkpoint.
    void rollback(size_t checkpoint);

    /// Methods performing changes to the state which can be reverted by rollback().
    /// @{

    /// Touches (as in EIP-161) an existing account or inserts new erasable account.
    Account& touch(const address& addr);

    void journal_balance_change(const address& addr, const intx::uint256& prev_balance);

    void journal_storage_change(const address& addr, const bytes32& key, const StorageValue& value);

    void journal_transient_storage_change(
        const address& addr, const bytes32& key, const bytes32& value);

    void journal_bump_nonce(const address& addr);

    void journal_create(const address& addr, bool existed);

    void journal_destruct(const address& addr);

    void journal_access_account(const address& addr);

    /// @}
};

/// Executes a valid transaction.
///
/// @return Transaction receipt with state diff.
TransactionReceipt transition(const StateView& state, const BlockInfo& block,
    const BlockHashes& block_hashes, const Transaction& tx, evmc_revision rev, evmc::VM& vm,
    const TransactionProperties& tx_props);
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/state.cpp">
```cpp
// ...

void State::rollback(size_t checkpoint)
{
    while (m_journal.size() != checkpoint)
    {
        std::visit(
            [this](const auto& e) {
                using T = std::decay_t<decltype(e)>;
                if constexpr (std::is_same_v<T, JournalNonceBump>)
                {
                    get(e.addr).nonce -= 1;
                }
                else if constexpr (std::is_same_v<T, JournalTouched>)
                {
                    get(e.addr).erase_if_empty = false;
                }
                else if constexpr (std::is_same_v<T, JournalDestruct>)
                {
                    get(e.addr).destructed = false;
                }
                else if constexpr (std::is_same_v<T, JournalAccessAccount>)
                {
                    get(e.addr).access_status = EVMC_ACCESS_COLD;
                }
                else if constexpr (std::is_same_v<T, JournalCreate>)
                {
                    if (e.existed)
                    {
                        // This account is not always "touched". TODO: Why?
                        auto& a = get(e.addr);
                        a.nonce = 0;
                        a.code_hash = Account::EMPTY_CODE_HASH;
                        a.code.clear();
                    }
                    else
                    {
                        // TODO: Before Spurious Dragon we don't clear empty accounts ("erasable")
                        //       so we need to delete them here explicitly.
                        //       This should be changed by tuning "erasable" flag
                        //       and clear in all revisions.
                        m_modified.erase(e.addr);
                    }
                }
                else if constexpr (std::is_same_v<T, JournalStorageChange>)
                {
                    auto& s = get(e.addr).storage.find(e.key)->second;
                    s.current = e.prev_value;
                    s.access_status = e.prev_access_status;
                }
                else if constexpr (std::is_same_v<T, JournalTransientStorageChange>)
                {
                    auto& s = get(e.addr).transient_storage.find(e.key)->second;
                    s = e.prev_value;
                }
                else if constexpr (std::is_same_v<T, JournalBalanceChange>)
                {
                    get(e.addr).balance = e.prev_balance;
                }
                else
                {
                    // TODO(C++23): Change condition to `false` once CWG2518 is in.
                    static_assert(std::is_void_v<T>, "unhandled journal entry type");
                }
            },
            m_journal.back());
        m_journal.pop_back();
    }
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/account.hpp">
```cpp
#include <evmc/evmc.hpp>
#include <intx/intx.hpp>
#include <unordered_map>

namespace evmone::state
{
using evmc::address;
using evmc::bytes;
using evmc::bytes32;
using namespace evmc::literals;

/// The representation of the account storage value.
struct StorageValue
{
    /// The current value.
    bytes32 current;

    /// The original value.
    bytes32 original;

    evmc_access_status access_status = EVMC_ACCESS_COLD;
};

/// The state account.
struct Account
{
    // ...

    /// The account nonce.
    uint64_t nonce = 0;

    /// The account balance.
    intx::uint256 balance;

    bytes32 code_hash = EMPTY_CODE_HASH;

    // ...

    /// The cached and modified account storage entries.
    std::unordered_map<bytes32, StorageValue> storage;

    /// The EIP-1153 transient (transaction-level lifetime) storage.
    std::unordered_map<bytes32, bytes32> transient_storage;

    /// The cache of the account code.
    bytes code;

    /// The account has been destructed and should be erased at the end of a transaction.
    bool destructed = false;

    // ...
};
}  // namespace evmone::state
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/host.cpp">
```cpp
// ... (includes and other methods)

evmc::Result Host::call(const evmc_message& orig_msg) noexcept
{
    const auto msg = prepare_message(orig_msg);
    if (!msg.has_value())
        return evmc::Result{EVMC_FAILURE, orig_msg.gas};  // Light exception.

    const auto logs_checkpoint = m_logs.size();
    const auto state_checkpoint = m_state.checkpoint();

    auto result = execute_message(*msg);

    if (result.status_code != EVMC_SUCCESS)
    {
        static constexpr auto addr_03 = 0x03_address;
        auto* const acc_03 = m_state.find(addr_03);
        const auto is_03_touched = acc_03 != nullptr && acc_03->erase_if_empty;

        // Revert.
        m_state.rollback(state_checkpoint);
        m_logs.resize(logs_checkpoint);

        // The 0x03 quirk: the touch on this address is never reverted.
        if (is_03_touched && m_rev >= EVMC_SPURIOUS_DRAGON)
            m_state.touch(addr_03);
    }
    return result;
}

// ...

evmc_storage_status Host::set_storage(
    const address& addr, const bytes32& key, const bytes32& value) noexcept
{
    // ... (EIP-2200 status logic)

    auto& storage_slot = m_state.get_storage(addr, key);
    
    // ...

    // In Berlin this is handled in access_storage().
    if (m_rev < EVMC_BERLIN)
        m_state.journal_storage_change(addr, key, storage_slot);
    storage_slot.current = value;  // Update current value.
    return status;
}

// ...

void Host::emit_log(const address& addr, const uint8_t* data, size_t data_size,
    const bytes32 topics[], size_t topics_count) noexcept
{
    m_logs.push_back({addr, {data, data_size}, {topics, topics + topics_count}});
}

evmc_access_status Host::access_account(const address& addr) noexcept
{
    if (m_rev < EVMC_BERLIN)
        return EVMC_ACCESS_COLD;  // Ignore before Berlin.

    auto& acc = m_state.get_or_insert(addr, {.erase_if_empty = true});

    if (acc.access_status == EVMC_ACCESS_WARM || is_precompile(m_rev, addr))
        return EVMC_ACCESS_WARM;

    m_state.journal_access_account(addr);
    acc.access_status = EVMC_ACCESS_WARM;
    return EVMC_ACCESS_COLD;
}

evmc_access_status Host::access_storage(const address& addr, const bytes32& key) noexcept
{
    auto& storage_slot = m_state.get_storage(addr, key);
    m_state.journal_storage_change(addr, key, storage_slot);
    return std::exchange(storage_slot.access_status, EVMC_ACCESS_WARM);
}


void Host::set_transient_storage(
    const address& addr, const bytes32& key, const bytes32& value) noexcept
{
    auto& slot = m_state.get(addr).transient_storage[key];
    m_state.journal_transient_storage_change(addr, key, slot);
    slot = value;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/statetest/statetest_runner.cpp">
```cpp
// ...

void run_state_test(const StateTransitionTest& test, evmc::VM& vm, bool trace_summary)
{
    SCOPED_TRACE(test.name);
    for (const auto& [rev, cases, block] : test.cases)
    {
        validate_state(test.pre_state, rev);
        for (size_t case_index = 0; case_index != cases.size(); ++case_index)
        {
            SCOPED_TRACE(std::string{evmc::to_string(rev)} + '/' + std::to_string(case_index));
            // ...

            const auto& expected = cases[case_index];
            const auto tx = test.multi_tx.get(expected.indexes);
            auto state = test.pre_state;

            const auto res = test::transition(state, block, test.block_hashes, tx, rev, vm,
                block.gas_limit, static_cast<int64_t>(state::max_blob_gas_per_block(rev)));

            // Finalize block with reward 0.
            test::finalize(state, rev, block.coinbase, 0, {}, {});

            const auto state_root = state::mpt_hash(state);

            // ... (logging and assertions)
        }
    }
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// ... (includes and other class definitions)

/// Generic execution state for generic instructions implementations.
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};
    bytes return_data;

    /// Reference to original EVM code container.
    bytes_view original_code;

    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;

    // ...

    /// Pointer to code analysis.
    union
    {
        const baseline::CodeAnalysis* baseline = nullptr;
        const advanced::AdvancedCodeAnalysis* advanced;
    } analysis{};

    std::vector<const uint8_t*> call_stack;

    /// Stack space allocation.
    StackSpace stack_space;

    // ... (constructors and reset method)
};
```
</file>
</evmone>

## Prompt Corrections

The original prompt provides a very detailed and well-structured plan for a Zig implementation. The concepts of `StateBundleManager` and `StateBundle` map well to common patterns for managing state transactions. The `evmone` codebase provides an excellent reference for the low-level mechanics of journaling and rollback, which is the core of this task.

One minor point of clarification based on the `evmone` implementation:

*   **Journal vs. Diff Map**: Your `StateBundle` uses HashMaps (`account_changes`, `storage_changes`) to track the *latest* state change for a given key. This is a "state diff" approach. `evmone`'s `Journal` uses a sequential list (`std::vector`) of *all* state change operations. When rolling back, it unwinds these operations in reverse order.
    *   **Your approach (HashMap)** is good for quickly generating the final state diff but requires more complex logic to handle rollbacks of intermediate changes within a bundle (e.g., if a storage slot is written to twice, the map only has the final value, but a rollback might need the intermediate value).
    *   **evmone's approach (Vector)** is simpler for rollback, as it's a perfect undo-log, but requires iterating through the entire journal to "flatten" it into a final state diff.

    Both approaches are valid. The `evmone` snippets illustrate the sequential log approach, which is very robust for handling nested rollbacks and complex state transitions. You might consider if a sequential log is a better fit for your `StateBundle`'s internal storage, especially for supporting complex rollback scenarios. The provided `JournalEntry` enum in `evmone` is a perfect blueprint for the types of changes to log.



## REVM Context

An analysis of the `revm` codebase reveals a sophisticated, multi-layered state management system that closely aligns with the "Bundle State Management" feature request. The most relevant components are `BundleState`, `TransitionState`, and the underlying `JournaledState`, which work together to track changes, create reverts, and efficiently update the state.

Here are the key code snippets from `revm` that will be most helpful in implementing this feature:

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/states/bundle_state.rs">
```rust
//! Bundle state contain only values that got changed
// ... (rest of the module doc)

/// Bundle state contain only values that got changed
///
/// For every account it contains both original and present state.
///
/// This is needed to decide if there were any changes to the account.
///
/// Reverts and created when TransitionState is applied to BundleState.
///
/// And can be used to revert BundleState to the state before transition.
#[derive(Default, Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct BundleState {
    /// Account state
    pub state: HashMap<Address, BundleAccount>,
    /// All created contracts in this block.
    pub contracts: HashMap<B256, Bytecode>,
    /// Changes to revert
    ///
    /// **Note**: Inside vector is *not* sorted by address.
    ///
    /// But it is unique by address.
    pub reverts: Reverts,
    /// The size of the plain state in the bundle state
    pub state_size: usize,
    /// The size of reverts in the bundle state
    pub reverts_size: usize,
}

// ...

impl BundleState {
    // ...

    /// Consumes [`TransitionState`] by applying the changes and creating the
    /// reverts.
    ///
    /// If [BundleRetention::includes_reverts] is `true`, then the reverts will
    /// be retained.
    pub fn apply_transitions_and_create_reverts(
        &mut self,
        transitions: TransitionState,
        retention: BundleRetention,
    ) {
        let include_reverts = retention.includes_reverts();
        // ... (rest of the implementation)
        let mut reverts = Vec::with_capacity(reverts_capacity);

        for (address, transition) in transitions.transitions.into_iter() {
            // ...
            // Update state and create revert.
            let revert = match self.state.entry(address) {
                Entry::Occupied(mut entry) => {
                    // ...
                    // Update and create revert if it is present
                    let revert = entry.get_mut().update_and_create_revert(transition);
                    // ...
                    revert
                }
                Entry::Vacant(entry) => {
                    // Make revert from transition account
                    let present_bundle = transition.present_bundle_account();
                    let revert = transition.create_revert();
                    if revert.is_some() {
                        self.state_size += present_bundle.size_hint();
                        entry.insert(present_bundle);
                    }
                    revert
                }
            };
            // ...
        }

        self.reverts.push(reverts);
    }

    /// Reverts the state changes by N transitions back.
    ///
    /// See also [Self::revert_latest]
    pub fn revert(&mut self, mut num_transitions: usize) {
        if num_transitions == 0 {
            return;
        }

        while self.revert_latest() {
            num_transitions -= 1;
            if num_transitions == 0 {
                // Break the loop.
                break;
            }
        }
    }
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/states/transition_state.rs">
```rust
#[derive(Clone, Default, Debug, PartialEq, Eq)]
pub struct TransitionState {
    /// Block state account with account state
    pub transitions: HashMap<Address, TransitionAccount>,
}

impl TransitionState {
    // ...

    /// Add transitions to the transition state.
    ///
    /// This will insert new [`TransitionAccount`]s, or update existing ones via
    /// [`update`][TransitionAccount::update].
    pub fn add_transitions(&mut self, transitions: Vec<(Address, TransitionAccount)>) {
        for (address, account) in transitions {
            match self.transitions.entry(address) {
                Entry::Occupied(entry) => {
                    let entry = entry.into_mut();
                    entry.update(account);
                }
                Entry::Vacant(entry) => {
                    entry.insert(account);
                }
            }
        }
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/states/bundle_account.rs">
```rust
/// Account information focused on creating of database changesets
/// and Reverts.
///
/// Status is needed as to know from what state we are applying the TransitionAccount.
///
/// Original account info is needed to know if there was a change.
///
/// Same thing for storage with original value.
///
/// On selfdestruct storage original value is ignored.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct BundleAccount {
    pub info: Option<AccountInfo>,
    pub original_info: Option<AccountInfo>,
    /// Contains both original and present state.
    /// When extracting changeset we compare if original value is different from present value.
    /// If it is different we add it to changeset.
    ///
    /// If Account was destroyed we ignore original value and compare present state with StorageValue::ZERO.
    pub storage: StorageWithOriginalValues,
    /// Account status.
    pub status: AccountStatus,
}

impl BundleAccount {
    // ...

    /// Update to new state and generate AccountRevert that if applied to new state will
    /// revert it to previous state.
    ///
    /// If no revert is present, update is noop.
    pub fn update_and_create_revert(
        &mut self,
        transition: TransitionAccount,
    ) -> Option<AccountRevert> {
        // ... implementation details ...
    }

    /// Revert account to previous state and return true if account can be removed.
    pub fn revert(&mut self, revert: AccountRevert) -> bool {
        // ... implementation details ...
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/states/reverts.rs">
```rust
/// Contains reverts of multiple account in multiple transitions (Transitions as a block).
#[derive(Clone, Debug, Default, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Reverts(Vec<Vec<(Address, AccountRevert)>>);

// ...

/// Assumption is that Revert can return full state from any future state to any past state.
///
/// # Note
/// It is created when new account state is applied to old account state.
///
/// And it is used to revert new account state to the old account state.
#[derive(Clone, Default, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct AccountRevert {
    pub account: AccountInfoRevert,
    pub storage: HashMap<StorageKey, RevertToSlot>,
    pub previous_status: AccountStatus,
    pub wipe_storage: bool,
}

/// Depending on previous state of account info this
/// will tell us what to do on revert.
#[derive(Clone, Default, Debug, PartialEq, Eq, Hash, PartialOrd, Ord)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum AccountInfoRevert {
    #[default]
    /// Nothing changed
    DoNothing,
    /// Account was created and on revert we need to remove it with all storage.
    DeleteIt,
    /// Account was changed and on revert we need to put old state.
    RevertTo(AccountInfo),
}

/// So storage can have multiple types:
/// * Zero, on revert remove plain state.
/// * Value, on revert set this value
/// * Destroyed, should be removed on revert but on Revert set it as zero.
#[derive(Clone, Debug, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum RevertToSlot {
    Some(StorageValue),
    Destroyed,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/states/account_status.rs">
```rust
/// AccountStatus represents the various states an account can be in after being loaded from the database.
/// ... (rest of doc comment)
#[derive(Clone, Copy, Default, Debug, PartialEq, Eq, Hash, PartialOrd, Ord)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum AccountStatus {
    #[default]
    LoadedNotExisting,
    Loaded,
    LoadedEmptyEIP161,
    InMemoryChange,
    Changed,
    Destroyed,
    DestroyedChanged,
    DestroyedAgain,
}

impl AccountStatus {
    // ...

    /// Returns the next account status on creation.
    pub fn on_created(&self) -> AccountStatus {
        // ...
    }

    /// Returns the next account status on change.
    pub fn on_changed(&self, had_no_nonce_and_code: bool) -> AccountStatus {
        // ...
    }

    /// Returns the next account status on selfdestruct.
    pub fn on_selfdestructed(&self) -> AccountStatus {
        // ...
    }

    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/journal.rs">
```rust
//! This module contains [`Journal`] struct and implements [`JournalTr`] trait for it.

// ...

/// A journal of state changes internal to the EVM
///
/// On each additional call, the depth of the journaled state is increased (`depth`) and a new journal is added.
///
/// The journal contains every state change that happens within that call, making it possible to revert changes made in a specific call.
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Journal<DB, ENTRY = JournalEntry>
where
    ENTRY: JournalEntryTr,
{
    /// Database
    pub database: DB,
    /// Inner journal state.
    pub inner: JournalInner<ENTRY>,
}

impl<DB: Database, ENTRY: JournalEntryTr> JournalTr for Journal<DB, ENTRY> {
    // ...
    /// Creates a checkpoint of the current state. State can be revert to this point
    /// if needed.
    fn checkpoint(&mut self) -> JournalCheckpoint {
        self.inner.checkpoint()
    }

    /// Commits the changes made since the last checkpoint.
    fn checkpoint_commit(&mut self) {
        self.inner.checkpoint_commit()
    }

    /// Reverts the changes made since the last checkpoint.
    fn checkpoint_revert(&mut self, checkpoint: JournalCheckpoint) {
        self.inner.checkpoint_revert(checkpoint)
    }

    /// Take logs from journal.
    fn take_logs(&mut self) -> Vec<Log> {
        self.inner.take_logs()
    }

    /// Commit current transaction journal and returns transaction logs.
    fn commit_tx(&mut self) {
        self.inner.commit_tx()
    }

    /// Discard current transaction journal by removing journal entries and logs and incrementing the transaction id.
    fn discard_tx(&mut self) {
        self.inner.discard_tx();
    }

    /// Clear current journal resetting it to initial state and return changes state.
    fn finalize(&mut self) -> Self::State {
        self.inner.finalize()
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/journal/entry.rs">
```rust
//! Contains the journal entry trait and implementations.
// ... (rest of module doc)

/// Trait for tracking and reverting state changes in the EVM.
/// Journal entry contains information about state changes that can be reverted.
pub trait JournalEntryTr {
    // ... method signatures ...
    fn account_warmed(address: Address) -> Self;
    fn account_destroyed(
        address: Address,
        target: Address,
        was_destroyed: bool,
        had_balance: U256,
    ) -> Self;
    fn account_touched(address: Address) -> Self;
    fn balance_transfer(from: Address, to: Address, balance: U256) -> Self;
    fn nonce_changed(address: Address) -> Self;
    fn storage_changed(address: Address, key: StorageKey, had_value: StorageValue) -> Self;
    fn code_changed(address: Address) -> Self;
    // ...
}

/// Journal entries that are used to track changes to the state and are used to revert it.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum JournalEntry {
    /// Used to mark account that is warm inside EVM in regard to EIP-2929 AccessList.
    AccountWarmed { address: Address },
    /// Mark account to be destroyed and journal balance to be reverted
    AccountDestroyed {
        had_balance: U256,
        address: Address,
        target: Address,
        was_destroyed: bool,
    },
    /// Loading account does not mean that account will need to be added to MerkleTree (touched).
    AccountTouched { address: Address },
    /// Balance changed
    BalanceChange { old_balance: U256, address: Address },
    /// Transfer balance between two accounts
    BalanceTransfer {
        balance: U256,
        from: Address,
        to: Address,
    },
    /// Increment nonce
    NonceChange { address: Address },
    /// Create account:
    AccountCreated { address: Address },
    /// Entry used to track storage changes
    StorageChanged {
        key: StorageKey,
        had_value: StorageValue,
        address: Address,
    },
    /// Entry used to track storage warming introduced by EIP-2929.
    StorageWarmed { key: StorageKey, address: Address },
    /// It is used to track an EIP-1153 transient storage change.
    TransientStorageChange {
        key: StorageKey,
        had_value: StorageValue,
        address: Address,
    },
    /// Code changed
    CodeChange { address: Address },
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/state/src/lib.rs">
```rust
//! ...

/// Account type used inside Journal to track changed to state.
#[derive(Debug, Clone, PartialEq, Eq, Default)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Account {
    /// Balance, nonce, and code
    pub info: AccountInfo,
    /// Transaction id, used to track when account was toched/loaded into journal.
    pub transaction_id: usize,
    /// Storage cache
    pub storage: EvmStorage,
    /// Account status flags
    pub status: AccountStatus,
}

impl Account {
    // ...
}


bitflags! {
    /// Account status flags. Generated by bitflags crate.
    #[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
    #[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
    #[cfg_attr(feature = "serde", serde(transparent))]
    pub struct AccountStatus: u8 {
        /// When account is loaded but not touched or interacted with.
        /// This is the default state.
        const Loaded = 0b00000000;
        /// When account is newly created we will not access database
        /// to fetch storage values
        const Created = 0b00000001;
        /// If account is marked for self destruction.
        const SelfDestructed = 0b00000010;
        /// Only when account is marked as touched we will save it to database.
        const Touched = 0b00000100;
        /// used only for pre spurious dragon hardforks where existing and empty were two separate states.
        /// it became same state after EIP-161: State trie clearing
        const LoadedAsNotExisting = 0b0001000;
        /// used to mark account as cold
        const Cold = 0b0010000;
    }
}


/// This type keeps track of the current value of a storage slot.
#[derive(Debug, Clone, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct EvmStorageSlot {
    /// Original value of the storage slot
    pub original_value: StorageValue,
    /// Present value of the storage slot
    pub present_value: StorageValue,
    /// Transaction id, used to track when storage slot was made warm.
    pub transaction_id: usize,
    /// Represents if the storage slot is cold
    pub is_cold: bool,
}

impl EvmStorageSlot {
    // ...
    /// Returns true if the present value differs from the original value.
    pub fn is_changed(&self) -> bool {
        self.original_value != self.present_value
    }
    // ...
}
```
</file>
</revm>

## Prompt Corrections

The original prompt is excellent and very detailed. The structure for `StateBundleManager` and `StateBundle` is well-thought-out. The `revm` code provides a battle-tested reference implementation that can inform the internal logic of the proposed Zig structs.

One key difference and potential improvement inspired by `revm` is the use of an `AccountStatus` enum.

*   **`AccountStatus` vs. `ChangeType`**: The prompt's `AccountChange.ChangeType` enum (`Created`, `Modified`, `Deleted`, `Restored`) is good. However, `revm`'s `AccountStatus` enum (`LoadedNotExisting`, `Loaded`, `InMemoryChange`, `Changed`, `Destroyed`, etc.) is more nuanced. It tracks the state of an account throughout a block's execution, not just the type of a single change. This allows for more sophisticated logic, especially when handling complex sequences like an account being created and then destroyed within the same transaction or block. Adopting a similar status-based approach could make the bundle state management more robust.

*   **Data Structures**: The prompt proposes separate hashmaps for account, storage, and code changes within a `StateBundle`. `revm` uses a more nested structure where the main state `HashMap` maps an `Address` to an `Account` struct, and that `Account` struct contains its own `HashMap` for storage changes. Both are valid designs, but the `revm` approach can be more efficient for accessing all information related to a single account.

These are not corrections but rather alternative design patterns from a production-grade EVM that could be considered during implementation. The provided `revm` snippets showcase these patterns effectively.



## EXECUTION-SPECS Context

An analysis of the `execution-specs` codebase reveals that the concept of "Bundle State Management" is implemented through a snapshot-based journaling mechanism within the `state.py` module of each fork. When a transaction or a nested call begins, a snapshot of the state is taken. If the execution succeeds, the changes are implicitly kept by discarding the snapshot. If it fails (reverts), the state is restored from the snapshot.

This is conceptually equivalent to the prompt's request for creating a bundle of state changes and then committing or rolling it back. The key difference is that `execution-specs` performs this at the granularity of the entire state trie (via copy-on-write on its dictionaries), whereas the prompt specifies a more granular change-tracking system.

The most relevant code snippets are those that demonstrate this transactional state lifecycle.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
"""
State
^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

The state contains all information that is preserved between transactions.

It consists of a main account trie and storage tries for each contract.

There is a distinction between an account that does not exist and
`EMPTY_ACCOUNT`.
"""

from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Set, Tuple

from ethereum_types.bytes import Bytes, Bytes32
from ethereum_types.frozen import modify
from ethereum_types.numeric import U256, Uint

from .fork_types import EMPTY_ACCOUNT, Account, Address, Root
from .trie import EMPTY_TRIE_ROOT, Trie, copy_trie, root, trie_get, trie_set


@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """

    _main_trie: Trie[Address, Optional[Account]] = field(
        default_factory=lambda: Trie(secured=True, default=None)
    )
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(
        default_factory=dict
    )
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    created_accounts: Set[Address] = field(default_factory=set)


@dataclass
class TransientStorage:
    """
    Contains all information that is preserved between message calls
    within a transaction.
    """

    _tries: Dict[Address, Trie[Bytes32, U256]] = field(default_factory=dict)
    _snapshots: List[Dict[Address, Trie[Bytes32, U256]]] = field(
        default_factory=list
    )


def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Start a state transaction.

    Transactions are entirely implicit and can be nested. It is not possible to
    calculate the state root during a transaction.

    Parameters
    ----------
    state : State
        The state.
    transient_storage : TransientStorage
        The transient storage of the transaction.
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )
    transient_storage._snapshots.append(
        {k: copy_trie(t) for (k, t) in transient_storage._tries.items()}
    )


def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Commit a state transaction.

    Parameters
    ----------
    state : State
        The state.
    transient_storage : TransientStorage
        The transient storage of the transaction.
    """
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._snapshots.pop()


def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Rollback a state transaction, resetting the state to the point when the
    corresponding `start_transaction()` call was made.

    Parameters
    ----------
    state : State
        The state.
    transient_storage : TransientStorage
        The transient storage of the transaction.
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._tries = transient_storage._snapshots.pop()


def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    # ...
    
def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    # ...

def get_storage_original(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get the original value in a storage slot i.e. the value before the current
    transaction began. This function reads the value from the snapshots taken
    before executing the transaction.
    ...
    """
    # In the transaction where an account is created, its preexisting storage
    # is ignored.
    if address in state.created_accounts:
        return U256(0)

    _, original_trie = state._snapshots[0]
    original_account_trie = original_trie.get(address)

    if original_account_trie is None:
        original_value = U256(0)
    else:
        original_value = trie_get(original_account_trie, key)

    assert isinstance(original_value, U256)

    return original_value


def get_transient_storage(
    transient_storage: TransientStorage, address: Address, key: Bytes32
) -> U256:
    # ...
    
def set_transient_storage(
    transient_storage: TransientStorage,
    address: Address,
    key: Bytes32,
    value: U256,
) -> None:
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.
    ...
    """
    # ... (code omitted for brevity)
    if message.target == Bytes0(b""):
        # ...
        evm = process_create_message(message)
    else:
        evm = process_message(message)
    # ...
    # ... (rest of the function)

def process_create_message(message: Message) -> Evm:
    """
    Executes a call to create a smart contract.
    ...
    """
    state = message.block_env.state
    transient_storage = message.tx_env.transient_storage
    # take snapshot of state before processing the message
    begin_transaction(state, transient_storage)

    # ... (logic for creating account) ...

    evm = process_message(message)
    if not evm.error:
        # ... (logic to handle contract code) ...
        try:
            # ...
        except ExceptionalHalt as error:
            rollback_transaction(state, transient_storage)
            # ...
        else:
            set_code(state, message.current_target, contract_code)
            commit_transaction(state, transient_storage)
    else:
        rollback_transaction(state, transient_storage)
    return evm


def process_message(message: Message) -> Evm:
    """
    Move ether and execute the relevant code.
    ...
    """
    state = message.block_env.state
    transient_storage = message.tx_env.transient_storage
    if message.depth > STACK_DEPTH_LIMIT:
        raise StackDepthLimitError("Stack depth limit reached")

    # take snapshot of state before processing the message
    begin_transaction(state, transient_storage)

    # ... (move ether, etc.) ...

    evm = execute_code(message)
    if evm.error:
        # revert state to the last saved checkpoint
        # since the message call resulted in an error
        rollback_transaction(state, transient_storage)
    else:
        commit_transaction(state, transient_storage)
    return evm

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/fork.py">
```python
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
    # ... (initial validation and gas deduction) ...

    # This call begins the execution which might have nested calls,
    # each with its own state snapshotting.
    tx_output = process_message_call(message)

    # ... (refunds, fee transfers) ...

    # On success, the state modified by the transaction and its sub-calls is
    # now the canonical one. A failed transaction would have already had its
    # state changes reverted by `process_message_call` and `rollback_transaction`.
    
    # ...
```
</file>
<file path="https://github.com/ethereum/exceptions.py">
```python
class EthereumException(Exception):
    """
    Base class for all Ethereum related exceptions.
    """

    pass


class InvalidBlock(EthereumException):
    """
    Raised when a block is invalid.
    """

    pass

class InvalidTransaction(InvalidBlock):
    """
    Raised when a transaction is invalid.
    """

    pass
```
</file>
</execution-specs>

## Prompt Corrections

The provided Zig implementation in the prompt is excellent and captures the necessary concepts for a robust state management system. Here are a few minor corrections and clarifications based on the `execution-specs`:

1.  **`StateInterface` Abstraction:** The prompt introduces a `StateInterface`. While this is a great design for modularity, the `execution-specs` directly pass the `State` object and use functions within the `state.py` module to modify it (e.g., `set_storage(state, ...)`). The proposed Zig interface is a good abstraction layer over this direct manipulation.
2.  **Snapshot vs. Checkpoint:** The prompt uses the term "Checkpoint" for saving state, while `execution-specs` uses "Snapshot". These terms are functionally equivalent in this context. The `CheckpointManager` in the prompt allows for more persistent, named checkpoints, whereas the `state.py` snapshots are ephemeral and managed as a stack for handling nested calls. Both are valid approaches.
3.  **Rollback Mechanism:** The prompt's `StateBundle.clear()` and `StateBundleManager.rollback_bundle()` imply clearing a set of collected changes. The `execution-specs` equivalent is `rollback_transaction()`, which restores the entire state from a previous snapshot. This is a coarser-grained approach but achieves the same goal of atomicity. The proposed Zig implementation with granular change tracking (`AccountChange`, `StorageChange`) is a more optimized approach than copying entire state tries.
4.  **`set_account_bundled` vs. `set_account`:** The prompt suggests methods like `set_account_bundled` in the VM that would write to both the "real" state and the bundle. In `execution-specs`, changes are applied directly to the current `State` object. The `begin_transaction` call ensures that a snapshot of the *previous* state is saved, so the "diff" is implicitly the difference between the current state and the snapshot. The prompt's approach of explicitly tracking the diff in a `StateBundle` is more direct and likely more efficient.
5.  **`apply_to_state`:** The `StateBundle.apply_to_state` function is the core of the "commit" operation in the prompt's design. In `execution-specs`, the equivalent is `commit_transaction`, which is much simpler: it just discards the snapshot, thereby making the modifications permanent. The `apply_to_state` function is a necessary component for the prompt's change-set-based model.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/state.py">
```python
@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """

    _main_trie: Trie[Address, Optional[Account]] = field(
        default_factory=lambda: Trie(secured=True, default=None)
    )
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(
        default_factory=dict
    )
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    created_accounts: Set[Address] = field(default_factory=set)


def begin_transaction(state: State) -> None:
    """
    Start a state transaction.

    Transactions are entirely implicit and can be nested. It is not possible to
    calculate the state root during a transaction.

    Parameters
    ----------
    state : State
        The state.
    """
    # This is analogous to creating a checkpoint or a new bundle.
    # It saves the current state by creating a copy of the trie pointers.
    # This is a lightweight copy-on-write mechanism.
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )


def commit_transaction(state: State) -> None:
    """
    Commit a state transaction.

    Parameters
    ----------
    state : State
        The state.
    """
    # This is analogous to committing a bundle. The changes made since
    # `begin_transaction` are finalized by simply discarding the snapshot.
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()


def rollback_transaction(state: State) -> None:
    """
    Rollback a state transaction, resetting the state to the point when the
    corresponding `start_transaction()` call was made.

    Parameters
    ----------
    state : State
        The state.
    """
    # This is analogous to rolling back a bundle. The state is restored
    # from the most recent snapshot.
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.
    ...
    """
    # ...
    # This shows the core pattern of wrapping an execution context
    # (a message call) in a transaction-like boundary. This is the
    # fundamental concept behind the requested bundle management.
    if message.target == Bytes0(b""):
        # ... contract creation logic ...
        evm = process_create_message(message)
    else:
        evm = process_message(message)
    # ...
    return MessageCallOutput(...)


def process_create_message(message: Message) -> Evm:
    """
    Executes a call to create a smart contract.
    ...
    """
    state = message.block_env.state
    # A transaction is started, analogous to creating a new bundle for the creation.
    begin_transaction(state)

    # ... logic for account creation ...

    evm = process_message(message)
    if not evm.error:
        # ... logic for handling successful creation ...
        # On success, the changes are committed.
        commit_transaction(state)
    else:
        # On error, all state changes are rolled back.
        rollback_transaction(state)
    return evm


def process_message(message: Message) -> Evm:
    """
    Move ether and execute the relevant code.
    ...
    """
    state = message.block_env.state
    # ...
    # Start a new transaction/bundle for the message call.
    begin_transaction(state)

    # ... logic for touching accounts and moving ether ...

    evm = execute_code(message)
    if evm.error:
        # On error, rollback the transaction/bundle.
        rollback_transaction(state)
    else:
        # On success, commit the transaction/bundle.
        commit_transaction(state)
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
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
    # This function demonstrates how individual transactions are processed.
    # An MEV bundle or batch is simply a sequence of these operations,
    # potentially wrapped in a larger outer "bundle" transaction.
    # ...

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    # ... gas refund and fee logic ...

    # EIP-161: This is where empty accounts might be destroyed at the end
    # of a transaction. This concept is similar to garbage collection
    # within the bundle management system.
    destroy_touched_empty_accounts(block_env.state, tx_output.touched_accounts)

    # ... receipt generation and logging ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork_types.py">
```python
@slotted_freezable
@dataclass
class Account:
    """
    State associated with an address.
    """

    nonce: Uint
    balance: U256
    code: Bytes
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/blocks.py">
```python
@slotted_freezable
@dataclass
class Log:
    """
    Data record produced during the execution of a transaction.
    """

    address: Address
    topics: Tuple[Hash32, ...]
    data: Bytes
```
</file>
</execution-specs>

## Prompt Corrections

The original prompt describes a state management system that is more akin to *journaling* individual changes (`AccountChange`, `StorageChange`, etc.) within a bundle, which are then applied or reverted. This is a valid and potentially more memory-efficient approach for small state changes.

The provided `execution-specs` code uses a different but related pattern: **copy-on-write snapshots**.

-   **`execution-specs` approach (`begin_transaction`)**: Creates a lightweight snapshot by copying the pointers to the state tries. When a change is made, only the modified parts of the trie are copied and updated. This is simpler to implement for rollbacks (just restore the old pointers) but can be more memory-intensive if large parts of the state are modified.
-   **Prompt's approach**: Tracks a list of discrete "diffs" or changes. `commit_bundle` would iterate through these diffs and apply them to the base state. `rollback_bundle` would be a no-op (just discard the bundle).

**Recommendation**: The `execution-specs` snapshotting mechanism is a robust and proven pattern for achieving the desired state management goals (transactions, rollbacks, checkpoints). It's a good reference for implementing the `StateBundleManager`. The `StateBundle` itself could be implemented as a snapshot of the state tries, rather than a list of individual changes. This would simplify merging and forking, as it becomes a matter of merging trie nodes. The journaling approach is still valid but might be more complex to implement correctly, especially for conflict resolution during merges.

