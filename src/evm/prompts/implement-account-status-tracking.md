# Implement Account Status Tracking

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_account_status_tracking` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_account_status_tracking feat_implement_account_status_tracking`
3. **Work in isolation**: `cd g/feat_implement_account_status_tracking`
4. **Commit message**: `✨ feat: implement detailed account lifecycle management and status tracking`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive account status tracking to provide detailed account lifecycle management, monitoring account creation, modification, destruction, and various state transitions. This system enables efficient account management, debugging capabilities, and optimization opportunities while maintaining EVM execution correctness.

## Account Status Tracking Specifications

### Core Account Tracking Framework

#### 1. Account Status Manager
```zig
pub const AccountStatusManager = struct {
    allocator: std.mem.Allocator,
    config: TrackingConfig,
    account_registry: std.HashMap(Address, AccountStatus, AddressContext, std.hash_map.default_max_load_percentage),
    status_history: std.ArrayList(AccountStatusChange),
    lifecycle_statistics: LifecycleStatistics,
    status_listeners: std.ArrayList(StatusListener),
    cleanup_scheduler: CleanupScheduler,
    
    pub const TrackingConfig = struct {
        enable_status_tracking: bool,
        enable_lifecycle_history: bool,
        enable_performance_metrics: bool,
        enable_status_notifications: bool,
        max_history_entries: u32,
        history_retention_days: u32,
        cleanup_interval_seconds: u32,
        detailed_tracking_mode: TrackingMode,
        
        pub const TrackingMode = enum {
            Disabled,
            Basic,        // Track existence and balance changes
            Standard,     // Track + nonce, code changes
            Comprehensive, // Track + storage access patterns
            Debug,        // Track + full operation history
        };
        
        pub fn production() TrackingConfig {
            return TrackingConfig{
                .enable_status_tracking = true,
                .enable_lifecycle_history = true,
                .enable_performance_metrics = true,
                .enable_status_notifications = false,
                .max_history_entries = 100000,
                .history_retention_days = 30,
                .cleanup_interval_seconds = 3600, // 1 hour
                .detailed_tracking_mode = .Standard,
            };
        }
        
        pub fn development() TrackingConfig {
            return TrackingConfig{
                .enable_status_tracking = true,
                .enable_lifecycle_history = true,
                .enable_performance_metrics = true,
                .enable_status_notifications = true,
                .max_history_entries = 1000000,
                .history_retention_days = 90,
                .cleanup_interval_seconds = 1800, // 30 minutes
                .detailed_tracking_mode = .Comprehensive,
            };
        }
        
        pub fn debugging() TrackingConfig {
            return TrackingConfig{
                .enable_status_tracking = true,
                .enable_lifecycle_history = true,
                .enable_performance_metrics = true,
                .enable_status_notifications = true,
                .max_history_entries = 10000000,
                .history_retention_days = 365,
                .cleanup_interval_seconds = 300, // 5 minutes
                .detailed_tracking_mode = .Debug,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: TrackingConfig) AccountStatusManager {
        return AccountStatusManager{
            .allocator = allocator,
            .config = config,
            .account_registry = std.HashMap(Address, AccountStatus, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            .status_history = std.ArrayList(AccountStatusChange).init(allocator),
            .lifecycle_statistics = LifecycleStatistics.init(),
            .status_listeners = std.ArrayList(StatusListener).init(allocator),
            .cleanup_scheduler = CleanupScheduler.init(allocator, config.cleanup_interval_seconds),
        };
    }
    
    pub fn deinit(self: *AccountStatusManager) void {
        // Clean up any allocated data in account statuses
        var iterator = self.account_registry.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.deinit(self.allocator);
        }
        
        // Clean up history
        for (self.status_history.items) |*change| {
            change.deinit(self.allocator);
        }
        
        self.account_registry.deinit();
        self.status_history.deinit();
        self.status_listeners.deinit();
        self.cleanup_scheduler.deinit();
    }
    
    pub fn track_account_creation(
        self: *AccountStatusManager,
        address: Address,
        initial_account: Account,
        context: CreationContext
    ) !void {
        if (!self.config.enable_status_tracking) return;
        
        const status = AccountStatus{
            .address = address,
            .current_state = .Active,
            .account_type = self.determine_account_type(initial_account),
            .created_at = std.time.milliTimestamp(),
            .last_modified = std.time.milliTimestamp(),
            .balance_history = BalanceHistory.init(self.allocator),
            .nonce_history = NonceHistory.init(self.allocator),
            .code_changes = CodeChangeHistory.init(self.allocator),
            .storage_activity = StorageActivityTracker.init(self.allocator),
            .access_patterns = AccessPatternTracker.init(self.allocator),
            .performance_metrics = AccountPerformanceMetrics.init(),
            .lifecycle_events = std.ArrayList(LifecycleEvent).init(self.allocator),
        };
        
        try self.account_registry.put(address, status);
        
        // Record creation event
        try self.record_status_change(address, .Created, context.transaction_hash, context.block_number);
        
        // Update statistics
        self.lifecycle_statistics.record_account_creation(status.account_type);
        
        // Notify listeners
        try self.notify_status_listeners(address, .Created, &status);
    }
    
    pub fn track_account_modification(
        self: *AccountStatusManager,
        address: Address,
        old_account: Account,
        new_account: Account,
        modification_type: ModificationType,
        context: ModificationContext
    ) !void {
        if (!self.config.enable_status_tracking) return;
        
        if (self.account_registry.getPtr(address)) |status| {
            // Update last modified timestamp
            status.last_modified = std.time.milliTimestamp();
            
            // Track specific changes
            try self.track_balance_change(status, old_account.balance, new_account.balance, context);
            try self.track_nonce_change(status, old_account.nonce, new_account.nonce, context);
            try self.track_code_change(status, old_account.code_hash, new_account.code_hash, context);
            
            // Record modification event
            try self.record_status_change(address, .Modified, context.transaction_hash, context.block_number);
            
            // Update performance metrics
            status.performance_metrics.record_modification(modification_type);
            
            // Check for status transitions
            try self.check_status_transitions(address, status, old_account, new_account);
            
            // Notify listeners
            try self.notify_status_listeners(address, .Modified, status);
        } else {
            // Account not tracked, create new tracking entry
            try self.track_account_creation(address, new_account, CreationContext{
                .creation_type = .External,
                .transaction_hash = context.transaction_hash,
                .block_number = context.block_number,
                .creator_address = null,
            });
        }
    }
    
    pub fn track_account_deletion(
        self: *AccountStatusManager,
        address: Address,
        final_account: Account,
        context: DeletionContext
    ) !void {
        if (!self.config.enable_status_tracking) return;
        
        if (self.account_registry.getPtr(address)) |status| {
            // Mark as deleted
            status.current_state = .Deleted;
            status.last_modified = std.time.milliTimestamp();
            
            // Record deletion event
            try self.record_status_change(address, .Deleted, context.transaction_hash, context.block_number);
            
            // Record final account state
            const deletion_event = LifecycleEvent{
                .event_type = .AccountDeleted,
                .timestamp = std.time.milliTimestamp(),
                .block_number = context.block_number,
                .transaction_hash = context.transaction_hash,
                .details = .{ .deletion = DeletionDetails{
                    .final_balance = final_account.balance,
                    .final_nonce = final_account.nonce,
                    .beneficiary = context.beneficiary_address,
                    .deletion_reason = context.deletion_reason,
                }},
            };
            
            try status.lifecycle_events.append(deletion_event);
            
            // Update statistics
            self.lifecycle_statistics.record_account_deletion(status.account_type);
            
            // Notify listeners
            try self.notify_status_listeners(address, .Deleted, status);
            
            // Schedule for cleanup if configured
            if (self.config.history_retention_days > 0) {
                try self.cleanup_scheduler.schedule_cleanup(address, self.config.history_retention_days);
            }
        }
    }
    
    pub fn track_storage_access(
        self: *AccountStatusManager,
        address: Address,
        key: U256,
        old_value: U256,
        new_value: U256,
        access_type: StorageAccessType,
        context: StorageContext
    ) !void {
        if (!self.config.enable_status_tracking) return;
        if (self.config.detailed_tracking_mode == .Basic) return;
        
        if (self.account_registry.getPtr(address)) |status| {
            try status.storage_activity.record_access(key, old_value, new_value, access_type, context);
            
            // Update access patterns
            try status.access_patterns.record_storage_access(key, access_type, context.block_number);
            
            // Update performance metrics
            status.performance_metrics.record_storage_operation(access_type);
        }
    }
    
    pub fn get_account_status(self: *AccountStatusManager, address: Address) ?AccountStatus {
        return self.account_registry.get(address);
    }
    
    pub fn get_account_history(
        self: *AccountStatusManager,
        address: Address,
        from_block: ?u64,
        to_block: ?u64
    ) ![]const AccountStatusChange {
        var history = std.ArrayList(AccountStatusChange).init(self.allocator);
        defer history.deinit();
        
        for (self.status_history.items) |change| {
            if (!std.mem.eql(u8, &change.address.bytes, &address.bytes)) continue;
            
            if (from_block) |from| {
                if (change.block_number < from) continue;
            }
            
            if (to_block) |to| {
                if (change.block_number > to) continue;
            }
            
            try history.append(change);
        }
        
        return history.toOwnedSlice();
    }
    
    pub fn get_lifecycle_statistics(self: *const AccountStatusManager) LifecycleStatistics {
        return self.lifecycle_statistics;
    }
    
    pub fn register_status_listener(self: *AccountStatusManager, listener: StatusListener) !void {
        try self.status_listeners.append(listener);
    }
    
    pub fn unregister_status_listener(self: *AccountStatusManager, listener_id: u64) void {
        for (self.status_listeners.items, 0..) |listener, i| {
            if (listener.id == listener_id) {
                _ = self.status_listeners.swapRemove(i);
                break;
            }
        }
    }
    
    pub fn cleanup_old_entries(self: *AccountStatusManager) !void {
        try self.cleanup_scheduler.run_cleanup(&self.account_registry, &self.status_history);
    }
    
    pub fn generate_status_report(self: *AccountStatusManager, report_type: ReportType) !StatusReport {
        return StatusReport{
            .report_type = report_type,
            .generation_timestamp = std.time.milliTimestamp(),
            .total_tracked_accounts = self.account_registry.count(),
            .lifecycle_statistics = self.lifecycle_statistics,
            .top_active_accounts = try self.get_top_active_accounts(10),
            .performance_summary = try self.generate_performance_summary(),
            .status_distribution = try self.get_status_distribution(),
        };
    }
    
    fn determine_account_type(self: *AccountStatusManager, account: Account) AccountType {
        _ = self;
        
        if (account.code_hash.equals(EMPTY_CODE_HASH)) {
            return .EOA; // Externally Owned Account
        } else {
            return .Contract;
        }
    }
    
    fn track_balance_change(
        self: *AccountStatusManager,
        status: *AccountStatus,
        old_balance: U256,
        new_balance: U256,
        context: ModificationContext
    ) !void {
        if (!old_balance.equals(new_balance)) {
            const balance_change = BalanceChange{
                .old_balance = old_balance,
                .new_balance = new_balance,
                .timestamp = std.time.milliTimestamp(),
                .block_number = context.block_number,
                .transaction_hash = context.transaction_hash,
                .change_reason = context.change_reason,
            };
            
            try status.balance_history.record_change(balance_change);
        }
    }
    
    fn track_nonce_change(
        self: *AccountStatusManager,
        status: *AccountStatus,
        old_nonce: u64,
        new_nonce: u64,
        context: ModificationContext
    ) !void {
        _ = self;
        
        if (old_nonce != new_nonce) {
            const nonce_change = NonceChange{
                .old_nonce = old_nonce,
                .new_nonce = new_nonce,
                .timestamp = std.time.milliTimestamp(),
                .block_number = context.block_number,
                .transaction_hash = context.transaction_hash,
            };
            
            try status.nonce_history.record_change(nonce_change);
        }
    }
    
    fn track_code_change(
        self: *AccountStatusManager,
        status: *AccountStatus,
        old_code_hash: Hash,
        new_code_hash: Hash,
        context: ModificationContext
    ) !void {
        _ = self;
        
        if (!old_code_hash.equals(new_code_hash)) {
            const code_change = CodeChange{
                .old_code_hash = old_code_hash,
                .new_code_hash = new_code_hash,
                .timestamp = std.time.milliTimestamp(),
                .block_number = context.block_number,
                .transaction_hash = context.transaction_hash,
                .change_type = if (old_code_hash.equals(EMPTY_CODE_HASH)) .CodeDeployment else .CodeUpdate,
            };
            
            try status.code_changes.record_change(code_change);
        }
    }
    
    fn check_status_transitions(
        self: *AccountStatusManager,
        address: Address,
        status: *AccountStatus,
        old_account: Account,
        new_account: Account
    ) !void {
        _ = self;
        _ = address;
        
        // Check for EOA -> Contract transition
        if (old_account.code_hash.equals(EMPTY_CODE_HASH) and !new_account.code_hash.equals(EMPTY_CODE_HASH)) {
            status.account_type = .Contract;
            
            const event = LifecycleEvent{
                .event_type = .AccountTypeChanged,
                .timestamp = std.time.milliTimestamp(),
                .block_number = 0, // Would be filled in by caller
                .transaction_hash = null,
                .details = .{ .type_change = TypeChangeDetails{
                    .old_type = .EOA,
                    .new_type = .Contract,
                }},
            };
            
            try status.lifecycle_events.append(event);
        }
        
        // Check for balance threshold transitions
        if (old_account.balance.is_zero() and !new_account.balance.is_zero()) {
            status.current_state = .Active;
        } else if (!old_account.balance.is_zero() and new_account.balance.is_zero()) {
            status.current_state = .Empty;
        }
    }
    
    fn record_status_change(
        self: *AccountStatusManager,
        address: Address,
        change_type: StatusChangeType,
        transaction_hash: ?Hash,
        block_number: u64
    ) !void {
        if (!self.config.enable_lifecycle_history) return;
        
        const change = AccountStatusChange{
            .address = address,
            .change_type = change_type,
            .timestamp = std.time.milliTimestamp(),
            .block_number = block_number,
            .transaction_hash = transaction_hash,
            .additional_data = null,
        };
        
        // Maintain history size limit
        if (self.status_history.items.len >= self.config.max_history_entries) {
            const oldest = self.status_history.orderedRemove(0);
            oldest.deinit(self.allocator);
        }
        
        try self.status_history.append(change);
    }
    
    fn notify_status_listeners(
        self: *AccountStatusManager,
        address: Address,
        change_type: StatusChangeType,
        status: *const AccountStatus
    ) !void {
        if (!self.config.enable_status_notifications) return;
        
        for (self.status_listeners.items) |listener| {
            listener.callback(address, change_type, status, listener.context) catch |err| {
                std.log.warn("Status listener {} failed: {}", .{ listener.id, err });
            };
        }
    }
    
    const EMPTY_CODE_HASH = Hash.from_hex("c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470") catch unreachable;
};
```

#### 2. Account Status Data Structures
```zig
pub const AccountStatus = struct {
    address: Address,
    current_state: AccountState,
    account_type: AccountType,
    created_at: i64,
    last_modified: i64,
    balance_history: BalanceHistory,
    nonce_history: NonceHistory,
    code_changes: CodeChangeHistory,
    storage_activity: StorageActivityTracker,
    access_patterns: AccessPatternTracker,
    performance_metrics: AccountPerformanceMetrics,
    lifecycle_events: std.ArrayList(LifecycleEvent),
    
    pub const AccountState = enum {
        Unknown,     // Not yet observed
        Active,      // Has balance or code
        Empty,       // Zero balance and no code
        Deleted,     // Explicitly deleted (SELFDESTRUCT)
        Suspended,   // Temporarily inactive
    };
    
    pub const AccountType = enum {
        EOA,         // Externally Owned Account
        Contract,    // Smart Contract
        Precompile,  // Precompiled Contract
        System,      // System Account
    };
    
    pub fn deinit(self: *AccountStatus, allocator: std.mem.Allocator) void {
        self.balance_history.deinit();
        self.nonce_history.deinit();
        self.code_changes.deinit();
        self.storage_activity.deinit();
        self.access_patterns.deinit();
        self.lifecycle_events.deinit();
    }
    
    pub fn get_current_balance(self: *const AccountStatus) ?U256 {
        return self.balance_history.get_latest_balance();
    }
    
    pub fn get_current_nonce(self: *const AccountStatus) ?u64 {
        return self.nonce_history.get_latest_nonce();
    }
    
    pub fn get_age_seconds(self: *const AccountStatus) i64 {
        return (std.time.milliTimestamp() - self.created_at) / 1000;
    }
    
    pub fn get_last_activity_seconds_ago(self: *const AccountStatus) i64 {
        return (std.time.milliTimestamp() - self.last_modified) / 1000;
    }
    
    pub fn is_active(self: *const AccountStatus) bool {
        return self.current_state == .Active and
               (self.get_current_balance() orelse U256.zero()).gt(U256.zero());
    }
    
    pub fn get_activity_score(self: *const AccountStatus) f64 {
        const age_days = @as(f64, @floatFromInt(self.get_age_seconds())) / 86400.0;
        const last_activity_days = @as(f64, @floatFromInt(self.get_last_activity_seconds_ago())) / 86400.0;
        const total_operations = self.performance_metrics.get_total_operations();
        
        // Activity score based on operations per day and recency
        var score: f64 = 0.0;
        
        if (age_days > 0) {
            score += (@as(f64, @floatFromInt(total_operations)) / age_days) * 10.0;
        }
        
        // Penalty for inactivity
        if (last_activity_days > 0) {
            score *= @exp(-last_activity_days / 30.0); // Decay over 30 days
        }
        
        return @min(score, 100.0);
    }
};

pub const BalanceHistory = struct {
    allocator: std.mem.Allocator,
    changes: std.ArrayList(BalanceChange),
    
    pub fn init(allocator: std.mem.Allocator) BalanceHistory {
        return BalanceHistory{
            .allocator = allocator,
            .changes = std.ArrayList(BalanceChange).init(allocator),
        };
    }
    
    pub fn deinit(self: *BalanceHistory) void {
        self.changes.deinit();
    }
    
    pub fn record_change(self: *BalanceHistory, change: BalanceChange) !void {
        try self.changes.append(change);
    }
    
    pub fn get_latest_balance(self: *const BalanceHistory) ?U256 {
        if (self.changes.items.len > 0) {
            return self.changes.items[self.changes.items.len - 1].new_balance;
        }
        return null;
    }
    
    pub fn get_balance_at_block(self: *const BalanceHistory, block_number: u64) ?U256 {
        for (self.changes.items) |change| {
            if (change.block_number <= block_number) {
                continue;
            }
            return change.old_balance;
        }
        
        return self.get_latest_balance();
    }
    
    pub fn get_total_received(self: *const BalanceHistory) U256 {
        var total = U256.zero();
        
        for (self.changes.items) |change| {
            if (change.new_balance.gt(change.old_balance)) {
                total = total.add(change.new_balance.sub(change.old_balance));
            }
        }
        
        return total;
    }
    
    pub fn get_total_sent(self: *const BalanceHistory) U256 {
        var total = U256.zero();
        
        for (self.changes.items) |change| {
            if (change.old_balance.gt(change.new_balance)) {
                total = total.add(change.old_balance.sub(change.new_balance));
            }
        }
        
        return total;
    }
};

pub const BalanceChange = struct {
    old_balance: U256,
    new_balance: U256,
    timestamp: i64,
    block_number: u64,
    transaction_hash: ?Hash,
    change_reason: BalanceChangeReason,
    
    pub const BalanceChangeReason = enum {
        Transfer,
        ContractCall,
        Mining,
        Burn,
        Unknown,
    };
    
    pub fn get_delta(self: *const BalanceChange) I256 {
        if (self.new_balance.gte(self.old_balance)) {
            return I256.from_u256(self.new_balance.sub(self.old_balance));
        } else {
            return I256.from_u256(self.old_balance.sub(self.new_balance)).neg();
        }
    }
};

pub const StorageActivityTracker = struct {
    allocator: std.mem.Allocator,
    storage_accesses: std.HashMap(U256, StorageAccessHistory, U256Context, std.hash_map.default_max_load_percentage),
    total_reads: u64,
    total_writes: u64,
    total_deletes: u64,
    
    pub fn init(allocator: std.mem.Allocator) StorageActivityTracker {
        return StorageActivityTracker{
            .allocator = allocator,
            .storage_accesses = std.HashMap(U256, StorageAccessHistory, U256Context, std.hash_map.default_max_load_percentage).init(allocator),
            .total_reads = 0,
            .total_writes = 0,
            .total_deletes = 0,
        };
    }
    
    pub fn deinit(self: *StorageActivityTracker) void {
        var iterator = self.storage_accesses.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.deinit();
        }
        self.storage_accesses.deinit();
    }
    
    pub fn record_access(
        self: *StorageActivityTracker,
        key: U256,
        old_value: U256,
        new_value: U256,
        access_type: StorageAccessType,
        context: StorageContext
    ) !void {
        // Update counters
        switch (access_type) {
            .Read => self.total_reads += 1,
            .Write => self.total_writes += 1,
            .Delete => self.total_deletes += 1,
        }
        
        // Get or create storage history for this key
        var storage_history = self.storage_accesses.getPtr(key) orelse blk: {
            const new_history = StorageAccessHistory.init(self.allocator);
            try self.storage_accesses.put(key, new_history);
            break :blk self.storage_accesses.getPtr(key).?;
        };
        
        const access_record = StorageAccessRecord{
            .old_value = old_value,
            .new_value = new_value,
            .access_type = access_type,
            .timestamp = std.time.milliTimestamp(),
            .block_number = context.block_number,
            .transaction_hash = context.transaction_hash,
        };
        
        try storage_history.record_access(access_record);
    }
    
    pub fn get_storage_statistics(self: *const StorageActivityTracker) StorageStatistics {
        return StorageStatistics{
            .total_reads = self.total_reads,
            .total_writes = self.total_writes,
            .total_deletes = self.total_deletes,
            .unique_slots_accessed = self.storage_accesses.count(),
        };
    }
};

pub const StorageAccessType = enum {
    Read,
    Write,
    Delete,
};

pub const AccountPerformanceMetrics = struct {
    total_balance_changes: u64,
    total_nonce_changes: u64,
    total_code_changes: u64,
    total_storage_reads: u64,
    total_storage_writes: u64,
    gas_consumed: u64,
    execution_count: u64,
    creation_cost: u64,
    
    pub fn init() AccountPerformanceMetrics {
        return std.mem.zeroes(AccountPerformanceMetrics);
    }
    
    pub fn record_modification(self: *AccountPerformanceMetrics, modification_type: ModificationType) void {
        switch (modification_type) {
            .BalanceChange => self.total_balance_changes += 1,
            .NonceChange => self.total_nonce_changes += 1,
            .CodeChange => self.total_code_changes += 1,
        }
    }
    
    pub fn record_storage_operation(self: *AccountPerformanceMetrics, access_type: StorageAccessType) void {
        switch (access_type) {
            .Read => self.total_storage_reads += 1,
            .Write, .Delete => self.total_storage_writes += 1,
        }
    }
    
    pub fn get_total_operations(self: *const AccountPerformanceMetrics) u64 {
        return self.total_balance_changes + 
               self.total_nonce_changes + 
               self.total_code_changes + 
               self.total_storage_reads + 
               self.total_storage_writes;
    }
    
    pub fn get_efficiency_score(self: *const AccountPerformanceMetrics) f64 {
        const total_ops = self.get_total_operations();
        if (total_ops == 0) return 0.0;
        
        const gas_per_operation = if (self.gas_consumed > 0) 
            @as(f64, @floatFromInt(self.gas_consumed)) / @as(f64, @floatFromInt(total_ops))
        else 
            0.0;
        
        // Lower gas per operation = higher efficiency
        return @max(0.0, 100.0 - (gas_per_operation / 1000.0));
    }
};
```

#### 3. Lifecycle Event System
```zig
pub const LifecycleEvent = struct {
    event_type: EventType,
    timestamp: i64,
    block_number: u64,
    transaction_hash: ?Hash,
    details: EventDetails,
    
    pub const EventType = enum {
        AccountCreated,
        AccountModified,
        AccountDeleted,
        AccountTypeChanged,
        BalanceThresholdCrossed,
        CodeDeployed,
        CodeUpdated,
        StorageThresholdReached,
        ActivitySuspended,
        ActivityResumed,
    };
    
    pub const EventDetails = union(enum) {
        creation: CreationDetails,
        modification: ModificationDetails,
        deletion: DeletionDetails,
        type_change: TypeChangeDetails,
        threshold: ThresholdDetails,
        code_deployment: CodeDeploymentDetails,
        storage_milestone: StorageMilestoneDetails,
        activity_change: ActivityChangeDetails,
    };
    
    pub const CreationDetails = struct {
        initial_balance: U256,
        creation_method: CreationMethod,
        creator_address: ?Address,
        creation_cost: u64,
        
        pub const CreationMethod = enum {
            Transaction,
            ContractCreation,
            GenesisAllocation,
            Mining,
            Precompile,
        };
    };
    
    pub const DeletionDetails = struct {
        final_balance: U256,
        final_nonce: u64,
        beneficiary: ?Address,
        deletion_reason: DeletionReason,
        
        pub const DeletionReason = enum {
            SelfDestruct,
            ZeroBalance,
            Cleanup,
            Migration,
        };
    };
    
    pub const TypeChangeDetails = struct {
        old_type: AccountStatus.AccountType,
        new_type: AccountStatus.AccountType,
    };
};

pub const LifecycleStatistics = struct {
    accounts_created: u64,
    eoa_accounts_created: u64,
    contract_accounts_created: u64,
    accounts_deleted: u64,
    accounts_modified: u64,
    total_balance_changes: u64,
    total_nonce_changes: u64,
    total_code_deployments: u64,
    total_storage_operations: u64,
    peak_active_accounts: u64,
    current_active_accounts: u64,
    
    pub fn init() LifecycleStatistics {
        return std.mem.zeroes(LifecycleStatistics);
    }
    
    pub fn record_account_creation(self: *LifecycleStatistics, account_type: AccountStatus.AccountType) void {
        self.accounts_created += 1;
        self.current_active_accounts += 1;
        
        switch (account_type) {
            .EOA => self.eoa_accounts_created += 1,
            .Contract => self.contract_accounts_created += 1,
            else => {},
        }
        
        if (self.current_active_accounts > self.peak_active_accounts) {
            self.peak_active_accounts = self.current_active_accounts;
        }
    }
    
    pub fn record_account_deletion(self: *LifecycleStatistics, account_type: AccountStatus.AccountType) void {
        _ = account_type;
        self.accounts_deleted += 1;
        if (self.current_active_accounts > 0) {
            self.current_active_accounts -= 1;
        }
    }
    
    pub fn get_creation_rate(self: *const LifecycleStatistics) f64 {
        const total_operations = self.accounts_created + self.accounts_deleted + self.accounts_modified;
        return if (total_operations > 0)
            @as(f64, @floatFromInt(self.accounts_created)) / @as(f64, @floatFromInt(total_operations))
        else
            0.0;
    }
    
    pub fn get_deletion_rate(self: *const LifecycleStatistics) f64 {
        return if (self.accounts_created > 0)
            @as(f64, @floatFromInt(self.accounts_deleted)) / @as(f64, @floatFromInt(self.accounts_created))
        else
            0.0;
    }
};

pub const StatusListener = struct {
    id: u64,
    callback: *const fn(address: Address, change_type: StatusChangeType, status: *const AccountStatus, context: ?*anyopaque) anyerror!void,
    context: ?*anyopaque,
    filter: ?StatusFilter,
    
    pub const StatusFilter = struct {
        account_types: []const AccountStatus.AccountType,
        change_types: []const StatusChangeType,
        address_pattern: ?AddressPattern,
        
        pub const AddressPattern = struct {
            prefix: ?[]const u8,
            suffix: ?[]const u8,
            exact_matches: ?[]const Address,
        };
    };
};

pub const StatusChangeType = enum {
    Created,
    Modified,
    Deleted,
    Activated,
    Deactivated,
    TypeChanged,
};

pub const ModificationType = enum {
    BalanceChange,
    NonceChange,
    CodeChange,
    StorageChange,
};

pub const StatusReport = struct {
    report_type: ReportType,
    generation_timestamp: i64,
    total_tracked_accounts: u32,
    lifecycle_statistics: LifecycleStatistics,
    top_active_accounts: []const AccountActivitySummary,
    performance_summary: PerformanceSummary,
    status_distribution: StatusDistribution,
    
    pub const ReportType = enum {
        Summary,
        Detailed,
        Performance,
        Lifecycle,
    };
    
    pub const AccountActivitySummary = struct {
        address: Address,
        activity_score: f64,
        total_operations: u64,
        last_activity: i64,
        account_type: AccountStatus.AccountType,
        current_balance: U256,
    };
    
    pub const PerformanceSummary = struct {
        average_operations_per_account: f64,
        median_activity_score: f64,
        top_performers: []const Address,
        efficiency_metrics: EfficiencyMetrics,
    };
    
    pub const StatusDistribution = struct {
        active_accounts: u32,
        empty_accounts: u32,
        deleted_accounts: u32,
        contract_accounts: u32,
        eoa_accounts: u32,
    };
};
```

## Implementation Requirements

### Core Functionality
1. **Comprehensive Tracking**: Monitor all account state changes and lifecycle events
2. **Performance Metrics**: Track efficiency and activity patterns for optimization
3. **Flexible Configuration**: Support different tracking modes for various use cases
4. **Event System**: Pluggable event listeners for real-time monitoring
5. **Historical Analysis**: Maintain queryable history with configurable retention
6. **Resource Management**: Efficient cleanup and memory management

## Implementation Tasks

### Task 1: Implement Core Account Status System
File: `/src/evm/account_status/account_status_manager.zig`
```zig
const std = @import("std");
const Address = @import("../../Address/Address.ts").Address;
const U256 = @import("../../Types/U256.ts").U256;
const Hash = @import("../../Hash/Keccak256.ts").Hash;

pub const AccountStatusManager = struct {
    // Implementation based on the specification above
    // ... (full implementation details)
};
```

### Task 2: Integrate with State Management
File: `/src/evm/state/state.zig` (modify existing)
```zig
const AccountStatusManager = @import("../account_status/account_status_manager.zig").AccountStatusManager;

pub const State = struct {
    // Existing fields...
    account_status_manager: ?AccountStatusManager,
    status_tracking_enabled: bool,
    
    pub fn enable_account_status_tracking(
        self: *State, 
        config: AccountStatusManager.TrackingConfig
    ) !void {
        self.account_status_manager = AccountStatusManager.init(self.allocator, config);
        self.status_tracking_enabled = true;
    }
    
    pub fn disable_account_status_tracking(self: *State) void {
        if (self.account_status_manager) |*manager| {
            manager.deinit();
            self.account_status_manager = null;
        }
        self.status_tracking_enabled = false;
    }
    
    pub fn set_account_with_tracking(
        self: *State,
        address: Address,
        account: Account,
        context: ModificationContext
    ) !void {
        const old_account = self.get_account(address);
        
        // Set the account normally
        try self.set_account(address, account);
        
        // Track the change if enabled
        if (self.account_status_manager) |*manager| {
            if (old_account) |old| {
                try manager.track_account_modification(address, old, account, .BalanceChange, context);
            } else {
                try manager.track_account_creation(address, account, CreationContext{
                    .creation_type = .External,
                    .transaction_hash = context.transaction_hash,
                    .block_number = context.block_number,
                    .creator_address = null,
                });
            }
        }
    }
    
    pub fn delete_account_with_tracking(
        self: *State,
        address: Address,
        context: DeletionContext
    ) !void {
        const final_account = self.get_account(address) orelse return;
        
        // Delete the account normally
        try self.delete_account(address);
        
        // Track the deletion if enabled
        if (self.account_status_manager) |*manager| {
            try manager.track_account_deletion(address, final_account, context);
        }
    }
    
    pub fn get_account_status_report(self: *State, report_type: StatusReport.ReportType) !?StatusReport {
        if (self.account_status_manager) |*manager| {
            return manager.generate_status_report(report_type);
        }
        return null;
    }
};
```

### Task 3: Integrate with VM Execution
File: `/src/evm/vm.zig` (modify existing)
```zig
const AccountStatusManager = @import("account_status/account_status_manager.zig").AccountStatusManager;

pub const Vm = struct {
    // Existing fields...
    
    pub fn enable_account_status_tracking(
        self: *Vm,
        config: AccountStatusManager.TrackingConfig
    ) !void {
        try self.state.enable_account_status_tracking(config);
    }
    
    pub fn disable_account_status_tracking(self: *Vm) void {
        self.state.disable_account_status_tracking();
    }
    
    pub fn get_account_status_summary(self: *Vm) !?AccountStatusSummary {
        const report = try self.state.get_account_status_report(.Summary);
        
        if (report) |r| {
            return AccountStatusSummary{
                .total_accounts = r.total_tracked_accounts,
                .active_accounts = r.status_distribution.active_accounts,
                .deleted_accounts = r.status_distribution.deleted_accounts,
                .contract_accounts = r.status_distribution.contract_accounts,
                .eoa_accounts = r.status_distribution.eoa_accounts,
                .lifecycle_stats = r.lifecycle_statistics,
            };
        }
        
        return null;
    }
    
    pub const AccountStatusSummary = struct {
        total_accounts: u32,
        active_accounts: u32,
        deleted_accounts: u32,
        contract_accounts: u32,
        eoa_accounts: u32,
        lifecycle_stats: LifecycleStatistics,
    };
};
```

## Testing Requirements

### Test File
Create `/test/evm/account_status/account_status_tracking_test.zig`

### Test Cases
```zig
test "account status manager initialization" {
    // Test manager creation with different configs
    // Test enable/disable functionality
    // Test configuration validation
}

test "account lifecycle tracking" {
    // Test account creation tracking
    // Test account modification tracking
    // Test account deletion tracking
}

test "balance and nonce history" {
    // Test balance change tracking
    // Test nonce change tracking
    // Test historical queries
}

test "storage activity tracking" {
    // Test storage read/write tracking
    // Test storage access patterns
    // Test storage statistics
}

test "performance metrics" {
    // Test activity score calculation
    // Test efficiency metrics
    // Test performance reporting
}

test "event listeners and notifications" {
    // Test listener registration
    // Test event notifications
    // Test listener filtering
}

test "cleanup and resource management" {
    // Test automatic cleanup
    // Test history retention
    // Test memory management
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/account_status/account_status_manager.zig` - Main account status tracking system
- `/src/evm/account_status/account_status.zig` - Account status data structures
- `/src/evm/account_status/lifecycle_events.zig` - Event system and tracking
- `/src/evm/account_status/balance_history.zig` - Balance change tracking
- `/src/evm/account_status/storage_activity.zig` - Storage access tracking
- `/src/evm/account_status/performance_metrics.zig` - Performance monitoring
- `/src/evm/account_status/cleanup_scheduler.zig` - Resource cleanup system
- `/src/evm/account_status/status_listeners.zig` - Event notification system
- `/src/evm/state/state.zig` - State management integration
- `/src/evm/vm.zig` - VM integration with account tracking
- `/test/evm/account_status/account_status_tracking_test.zig` - Comprehensive tests

## Success Criteria

1. **Complete Lifecycle Tracking**: Track all account state changes and transitions
2. **Performance Efficiency**: <2% overhead when enabled, zero overhead when disabled
3. **Historical Accuracy**: Accurate historical queries and reporting
4. **Resource Management**: Efficient memory usage with configurable cleanup
5. **Integration Quality**: Seamless integration with existing state management
6. **Flexibility**: Support for different tracking modes and use cases

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Zero performance impact when disabled** - No overhead for production use
3. **Memory efficiency** - Configurable history retention and automatic cleanup
4. **Data consistency** - Accurate tracking without state corruption
5. **Event isolation** - Listener failures must not affect tracking
6. **Thread safety** - Safe concurrent access to tracking data

## References

- [Ethereum Account Model](https://ethereum.org/en/developers/docs/accounts/) - Account structure and lifecycle
- [State Management Patterns](https://en.wikipedia.org/wiki/State_pattern) - State tracking design patterns
- [Event-Driven Architecture](https://en.wikipedia.org/wiki/Event-driven_architecture) - Event notification systems
- [Time Series Databases](https://en.wikipedia.org/wiki/Time_series_database) - Historical data management
- [Performance Monitoring](https://en.wikipedia.org/wiki/Application_performance_monitoring) - Metrics collection strategies