# Implement Account Status Tracking

<<<<<<< HEAD
You are implementing Account Status Tracking for the Tevm EVM written in Zig. Your goal is to implement comprehensive account status tracking system following Ethereum specifications and maintaining compatibility with existing implementations.

=======
<review>
**Implementation Status: PARTIALLY IMPLEMENTED 🟡**

**Current Status:**
- Basic account operations exist in state management (balance, nonce, code)
- Account lifecycle events are tracked in system.zig for some operations
- Missing comprehensive status tracking, monitoring, and analytics infrastructure

**Implementation Requirements:**
- Comprehensive account lifecycle tracking system with detailed state transitions
- Account status monitoring and analytics framework
- Integration with existing state management in state.zig and journal.zig

**Priority: MEDIUM - Valuable for debugging and optimization but not critical for core EVM functionality**
</review>

You are implementing Account Status Tracking for the Tevm EVM written in Zig. Your goal is to implement comprehensive account status tracking system following Ethereum specifications and maintaining compatibility with existing implementations.

>>>>>>> origin/main
## Development Workflow
- **Branch**: `feat_implement_account_status_tracking` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_account_status_tracking feat_implement_account_status_tracking`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive account status tracking to provide detailed account lifecycle management, monitoring account creation, modification, destruction, and various state transitions. This system enables efficient account management, debugging capabilities, and optimization opportunities while maintaining EVM execution correctness.

## ELI5

Think of account status tracking like having a detailed medical chart for every patient in a hospital. Just as hospitals need to track when patients are admitted, what treatments they receive, their current condition, and when they're discharged, the EVM needs to track the "health" and "lifecycle" of every account (address) on the blockchain.

Here's what it tracks:
- **Account Birth**: When a new address gets its first transaction or contract deployment (like hospital admission)
- **Account Changes**: Every time the account's balance, code, or storage changes (like medical treatments)
- **Account Health**: Whether the account is active, empty, or has special properties (like patient vital signs)
- **Account Death**: When an account is destroyed via SELFDESTRUCT (like patient discharge)

This is incredibly useful for:
- **Debugging**: Understanding why a transaction failed by seeing the complete account history
- **Optimization**: Knowing which accounts are frequently accessed to improve caching
- **Analytics**: Tracking patterns in how accounts are used across the network
- **Security**: Detecting unusual account behavior that might indicate attacks

The enhanced version includes:
- **Real-time Monitoring**: Instant updates as accounts change state
- **Historical Analysis**: Complete audit trails of every account modification
- **Performance Tracking**: Metrics about account access patterns and costs
- **Predictive Insights**: Learning from patterns to optimize future operations

Without proper account tracking, debugging complex transactions would be like trying to diagnose a patient without any medical history - you'd be working blind!

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

#### 1. **Unit Tests** (`/test/evm/account_status/account_status_tracking_test.zig`)
```zig
// Test basic account status tracking functionality
test "account_status_tracking basic functionality with known scenarios"
test "account_status_tracking handles edge cases correctly"
test "account_status_tracking validates state changes"
test "account_status_tracking correct behavior under load"
```

#### 2. **Integration Tests**
```zig
test "account_status_tracking integrates with EVM context correctly"
test "account_status_tracking works with existing systems"
test "account_status_tracking maintains backward compatibility"
test "account_status_tracking handles system interactions"
```

#### 3. **State Management Tests**
```zig
test "account_status_tracking state transitions work correctly"
test "account_status_tracking handles concurrent state access"
test "account_status_tracking maintains state consistency"
test "account_status_tracking reverts state on failure"
```

#### 4. **Performance Tests**
```zig
test "account_status_tracking performance with realistic workloads"
test "account_status_tracking memory efficiency and allocation patterns"
test "account_status_tracking scalability under high load"
test "account_status_tracking benchmark against baseline implementation"
```

#### 5. **Error Handling Tests**
```zig
test "account_status_tracking error propagation works correctly"
test "account_status_tracking proper error types returned"
test "account_status_tracking handles resource exhaustion gracefully"
test "account_status_tracking recovery from failure states"
```

#### 6. **Event System Tests**
```zig
test "account_status_tracking event notification correctness"
test "account_status_tracking lifecycle transition tracking"
test "account_status_tracking historical data integrity"
test "account_status_tracking performance metrics accuracy"
```

#### 7. **Account Lifecycle Tests**
```zig
test "account_status_tracking maintains EVM specification compliance"
test "account_status_tracking account creation detection"
test "account_status_tracking account modification tracking"
test "account_status_tracking account destruction handling"
```

### Test Development Priority
1. **Start with core status tracking tests** - Ensures basic account monitoring works
2. **Add lifecycle transition tests** - Verifies account state change detection
3. **Implement event notification tests** - Critical for debugging and monitoring
4. **Add performance benchmarks** - Ensures production readiness
5. **Test historical data accuracy** - Robust audit trail functionality
6. **Add integration tests** - System-level correctness verification

### Test Data Sources
- **EVM specification requirements**: Account model compliance
- **Reference implementation behavior**: State transition patterns
- **Performance benchmarks**: Tracking overhead and memory usage
- **Real-world scenarios**: Account usage patterns and lifecycle events
- **Edge case generation**: Boundary testing for tracking limits and history

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify memory safety and leak detection

### Test-First Examples

**Before writing any implementation:**
```zig
test "account_status_tracking basic functionality" {
    // This test MUST fail initially
    const context = test_utils.createTestContext();
    var status_manager = AccountStatusManager.init(context.allocator);
    
    try status_manager.track_account_creation(test_address);
    const status = try status_manager.get_account_status(test_address);
    try testing.expectEqual(AccountStatus.Active, status.current_status);
}
```

**Only then implement:**
```zig
pub const AccountStatusManager = struct {
    pub fn track_account_creation(self: *AccountStatusManager, address: Address) !void {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test lifecycle tracking thoroughly** - Architecture changes affect account monitoring
- **Verify event accuracy** - Especially important for debugging and analytics
- **Test performance implications** - Ensure tracking doesn't impact EVM execution
- **Validate data integrity** - Critical for audit trails and historical analysis

## References

- [Ethereum Account Model](https://ethereum.org/en/developers/docs/accounts/) - Account structure and lifecycle
- [State Management Patterns](https://en.wikipedia.org/wiki/State_pattern) - State tracking design patterns
- [Event-Driven Architecture](https://en.wikipedia.org/wiki/Event-driven_architecture) - Event notification systems
- [Time Series Databases](https://en.wikipedia.org/wiki/Time_series_database) - Historical data management
- [Performance Monitoring](https://en.wikipedia.org/wiki/Application_performance_monitoring) - Metrics collection strategies

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/host.cpp">
```cpp
// This file is highly relevant as it implements the EVMC Host interface, which is the bridge
// between the EVM and the world state. The methods here are the ideal integration points
// for the AccountStatusManager to track state changes.

/// In evmone, the Host class implements the callbacks the VM can make to query or modify state.
/// These methods are direct analogues for the tracking functions in the prompt.

// ...

evmc_storage_status Host::set_storage(
    const address& addr, const bytes32& key, const bytes32& value) noexcept
{
    // This is the ideal place to call `track_storage_access` from the prompt.
    // It provides the address, storage key, and both old and new values.
    // evmone's implementation here determines the gas refund based on the change,
    // which is a form of status tracking.

    auto& storage_slot = m_state.get_storage(addr, key);
    const auto& [current, original, _] = storage_slot; // Old value is `current`.

    // ... (gas refund logic based on current vs value)

    // In Berlin this is handled in access_storage().
    if (m_rev < EVMC_BERLIN)
        m_state.journal_storage_change(addr, key, storage_slot);
    storage_slot.current = value;  // Update current value.
    return status;
}

// ...

bool Host::selfdestruct(const address& addr, const address& beneficiary) noexcept
{
    // This function handles the SELFDESTRUCT opcode logic.
    // It's the perfect hook for `track_account_deletion`.
    // It provides the address of the account being deleted and the beneficiary.
    // The account's final balance is transferred here.

    if (m_state.find(beneficiary) == nullptr)
        m_state.journal_create(beneficiary, false);
    auto& acc = m_state.get(addr);
    const auto balance = acc.balance;
    auto& beneficiary_acc = m_state.touch(beneficiary);

    m_state.journal_balance_change(beneficiary, beneficiary_acc.balance);
    m_state.journal_balance_change(addr, balance);

    if (m_rev >= EVMC_CANCUN && !acc.just_created)
    {
        // ... (EIP-6780 logic)
        acc.balance = 0;
        beneficiary_acc.balance += balance;
        return false;
    }

    beneficiary_acc.balance += balance;
    acc.balance = 0;

    if (!acc.destructed)
    {
        m_state.journal_destruct(addr);
        acc.destructed = true;
        return true;
    }
    return false;
}

evmc::Result Host::create(const evmc_message& msg) noexcept
{
    // This function handles contract creation (CREATE, CREATE2).
    // It's the ideal hook for `track_account_creation`.
    // It computes the new address, transfers the endowment, and executes the init code.

    assert(msg.kind == EVMC_CREATE || msg.kind == EVMC_CREATE2 || msg.kind == EVMC_EOFCREATE);

    auto* new_acc = m_state.find(msg.recipient);
    const bool new_acc_exists = new_acc != nullptr;
    if (!new_acc_exists)
        new_acc = &m_state.insert(msg.recipient);
    else if (is_create_collision(*new_acc))
        return evmc::Result{EVMC_FAILURE};
    m_state.journal_create(msg.recipient, new_acc_exists);

    // ...

    if (m_rev >= EVMC_SPURIOUS_DRAGON)
        new_acc->nonce = 1;

    // ...

    auto& sender_acc = m_state.get(msg.sender);
    const auto value = intx::be::load<intx::uint256>(msg.value);
    sender_acc.balance -= value;
    new_acc->balance += value;

    auto create_msg = msg;
    // ... (init code execution)
    auto result = m_vm.execute(*this, m_rev, create_msg, initcode.data(), initcode.size());

    // ... (code deployment logic)

    if (!code.empty())
    {
        // This is where the new account's code is set.
        // A `track_account_modification` for a code change could be hooked here.
        new_acc->code_hash = keccak256(code);
        new_acc->code = code;
        new_acc->code_changed = true;
    }

    return evmc::Result{result.status_code, gas_left, result.gas_refund, msg.recipient};
}

evmc::Result Host::call(const evmc_message& orig_msg) noexcept
{
    // This is the generic call handler. It's a good place to track modifications
    // from value transfers.
    // The `msg.value` contains the amount being transferred.

    // ... (prepare message, handle reverts)

    if (msg.kind == EVMC_CALL)
    {
        if (evmc::is_zero(msg.value))
            m_state.touch(msg.recipient);
        else
        {
            auto& dst_acc = m_state.get_or_insert(msg.recipient);

            // Transfer value: sender → recipient.
            // This is the point to hook `track_account_modification` for balance changes.
            const auto value = intx::be::load<intx::uint256>(msg.value);
            m_state.journal_balance_change(msg.sender, m_state.get(msg.sender).balance);
            m_state.journal_balance_change(msg.recipient, dst_acc.balance);
            m_state.get(msg.sender).balance -= value;
            dst_acc.balance += value;
        }
    }

    // ... (execute message)
    return result;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/transaction.cpp">
```cpp
// This file shows how a transaction is processed at a high level.
// It's the entry point for state changes initiated by external users.

TransactionReceipt transition(const StateView& state_view, const BlockInfo& block,
    const BlockHashes& block_hashes, const Transaction& tx, evmc_revision rev, evmc::VM& vm,
    const TransactionProperties& tx_props)
{
    State state{state_view};

    // The sender's nonce is incremented here. This is a key event to track
    // for `track_account_modification`.
    auto& sender_acc = state.get_or_insert(tx.sender);
    assert(sender_acc.nonce < Account::NonceMax);
    ++sender_acc.nonce;

    // ... (gas price and fee calculation)

    // The initial cost of the transaction is deducted from the sender's balance here.
    // Another key event for `track_account_modification`.
    sender_acc.balance -= tx_max_cost;

    // ...

    Host host{rev, vm, state, block, block_hashes, tx};

    // ... (access list and pre-warming logic)

    auto result = host.call(message);

    auto gas_used = tx.gas_limit - result.gas_left;

    // ... (refund logic)

    // Final balance adjustments for sender (gas refund) and coinbase (priority fee).
    // These are also important modification events to track.
    sender_acc.balance += tx_max_cost - gas_used * effective_gas_price;
    state.touch(block.coinbase).balance += gas_used * priority_gas_price;

    TransactionReceipt receipt{
        tx.type, result.status_code, gas_used, {}, host.take_logs(), {}, state.build_diff(rev)};
    // ...
    return receipt;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/state.hpp">
```cpp
// The Journal system in evmone provides a pattern for tracking state changes,
// although its primary purpose is for reverts. The `JournalEntry` union is a
// good example of how to represent different types of state modifications,
// which is directly applicable to the `LifecycleEvent` system in the prompt.

class State
{
    // This `JournalEntry` union is a great reference for the types of state
    // changes that need to be tracked. It's very similar to the prompt's
    // `LifecycleEvent.EventDetails` union.
    using JournalEntry =
        std::variant<JournalBalanceChange, JournalTouched, JournalStorageChange, JournalNonceBump,
            JournalCreate, JournalTransientStorageChange, JournalDestruct, JournalAccessAccount>;

    /// The state journal: the list of changes made to the state
    /// with information how to revert them.
    std::vector<JournalEntry> m_journal;

public:
    // ...

    /// Returns the state journal checkpoint. It can be later used to in rollback()
    /// to revert changes newer than the checkpoint.
    [[nodiscard]] size_t checkpoint() const noexcept { return m_journal.size(); }

    /// Reverts state changes made after the checkpoint.
    void rollback(size_t checkpoint);

    // Methods for adding different types of changes to the journal.
    // These would be analogous to the `record_status_change` function in the prompt.
    void journal_balance_change(const address& addr, const intx::uint256& prev_balance);
    void journal_storage_change(const address& addr, const bytes32& key, const StorageValue& value);
    void journal_bump_nonce(const address& addr);
    void journal_create(const address& addr, bool existed);
    void journal_destruct(const address& addr);
    // ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.hpp">
```cpp
// evmone's Tracer interface is an excellent architectural pattern for implementing
// the `AccountStatusManager`. It allows observing EVM execution without modifying
// the core logic. An `AccountStatusManager` could be implemented as a `Tracer`.

class Tracer
{
    friend class VM;
    std::unique_ptr<Tracer> m_next_tracer;

public:
    virtual ~Tracer() = default;

    // The following are hooks that an observer/tracer can implement.
    // These could be used to drive the AccountStatusManager's tracking functions.

    // Called at the beginning of an execution context.
    // Useful for setting up tracking for a specific call or transaction.
    virtual void on_execution_start(
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept = 0;

    // Called before each instruction is executed.
    // This provides deep insight for detailed tracking modes (e.g., 'Debug' or 'Comprehensive').
    // The opcode, PC, stack, and gas are available.
    virtual void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept = 0;

    // Called at the end of an execution context.
    // Useful for finalizing tracking data for a call or transaction.
    virtual void on_execution_end(const evmc_result& result) noexcept = 0;
};

// evmone provides factory functions for creating different kinds of tracers.
// A similar pattern could be used for the AccountStatusManager.
EVMC_EXPORT std::unique_ptr<Tracer> create_histogram_tracer(std::ostream& out);
EVMC_EXPORT std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out);

```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/account.hpp">
```cpp
// This file shows the basic structure of an account in evmone's state representation.
// This is a good reference for the core fields that are tracked by default,
// which the prompt's `AccountStatus` struct aims to expand upon significantly.

namespace evmone::state
{
/// The state account.
struct Account
{
    /// The account nonce.
    uint64_t nonce = 0;

    /// The account balance.
    intx::uint256 balance;

    /// The keccak256 hash of the account's code.
    bytes32 code_hash = EMPTY_CODE_HASH;

    /// The cached and modified account storage entries.
    std::unordered_map<bytes32, StorageValue> storage;

    /// The cache of the account code.
    bytes code;

    /// The account has been destructed and should be erased at the end of a transaction.
    bool destructed = false;

    // ... other flags for state management

    [[nodiscard]] bool is_empty() const noexcept
    {
        return nonce == 0 && balance == 0 && code_hash == EMPTY_CODE_HASH;
    }
};
}
```
</file>
</evmone>
## Prompt Corrections

The original prompt is well-structured and detailed. No corrections are strictly necessary. However, the following suggestions could enhance it by drawing from `evmone`'s architecture:

1.  **Adopt a `Tracer` or `Observer` Pattern**: The prompt's design requires deep integration into state management and VM execution. `evmone` uses a `Tracer` interface (`lib/evmone/tracing.hpp`) which acts as an observer that can be attached to the VM. This is a clean architectural pattern that avoids polluting the core EVM logic with tracking-specific code. The `AccountStatusManager` could be implemented as a `Tracer`, receiving notifications for events like `on_instruction_start` (to catch `SSTORE`, `CREATE`, etc.) and `on_execution_start`/`end` (to track call frames). This pattern naturally provides the context needed for tracking (e.g., `ExecutionState`, `evmc_message`).

2.  **Leverage Journaling Concepts**: The prompt's `status_history` and `lifecycle_events` are forms of historical logging. `evmone`'s `Journal` (`test/state/state.hpp`) is designed for reverts but provides a robust model for representing discrete state changes as a union of types (`JournalEntry`). Adopting a similar structure for `AccountStatusChange` could make the implementation more robust and explicit about what kind of change occurred (e.g., `BalanceChange`, `NonceBump`, `StorageChange`, `AccountCreated`). This provides more structured data than a simple `StatusChangeType` enum.

By leveraging these patterns from a mature EVM implementation like `evmone`, the resulting system would be more modular, maintainable, and decoupled from the core execution logic.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/state/src/account_info.rs">
```rust
//! Account information and bytecode.
use bytecode::Bytecode;
use core::hash::{Hash, Hasher};
use primitives::{B256, KECCAK_EMPTY, U256};

/// Account information that contains balance, nonce, code hash and code
///
/// Code is set as optional.
#[derive(Clone, Debug, Eq, Ord, PartialOrd)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct AccountInfo {
    /// Account balance.
    pub balance: U256,
    /// Account nonce.
    pub nonce: u64,
    /// Hash of the raw bytes in `code`, or [`KECCAK_EMPTY`].
    pub code_hash: B256,
    /// [`Bytecode`] data associated with this account.
    ///
    /// If [`None`], `code_hash` will be used to fetch it from the database, if code needs to be
    /// loaded from inside `revm`.
    ///
    /// By default, this is `Some(Bytecode::default())`.
    pub code: Option<Bytecode>,
}

impl Default for AccountInfo {
    fn default() -> Self {
        Self {
            balance: U256::ZERO,
            code_hash: KECCAK_EMPTY,
            code: Some(Bytecode::default()),
            nonce: 0,
        }
    }
}
// ...
impl AccountInfo {
    // ...
    /// Returns if an account is empty.
    ///
    /// An account is empty if the following conditions are met.
    /// - code hash is zero or set to the Keccak256 hash of the empty string `""`
    /// - balance is zero
    /// - nonce is zero
    #[inline]
    pub fn is_empty(&self) -> bool {
        let code_empty = self.is_empty_code_hash() || self.code_hash.is_zero();
        code_empty && self.balance.is_zero() && self.nonce == 0
    }

    /// Returns `true` if the account is not empty.
    #[inline]
    pub fn exists(&self) -> bool {
        !self.is_empty()
    }
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/state/src/lib.rs">
```rust
// ...
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
// ...
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
    /// Is account empty, check if nonce and balance are zero and code is empty.
    pub fn is_empty(&self) -> bool {
        self.info.is_empty()
    }
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/journal/entry.rs">
```rust
//! Contains the journal entry trait and implementations.
// ...
/// Journal entries that are used to track changes to the state and are used to revert it.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum JournalEntry {
    // ...
    /// Mark account to be destroyed and journal balance to be reverted
    /// Action: Mark account and transfer the balance
    /// Revert: Unmark the account and transfer balance back
    AccountDestroyed {
        /// Balance of account got transferred to target.
        had_balance: U256,
        /// Address of account to be destroyed.
        address: Address,
        /// Address of account that received the balance.
        target: Address,
        /// Whether the account had already been destroyed before this journal entry.
        was_destroyed: bool,
    },
    /// Loading account does not mean that account will need to be added to MerkleTree (touched).
    /// Only when account is called (to execute contract or transfer balance) only then account is made touched.
    /// Action: Mark account touched
    /// Revert: Unmark account touched
    AccountTouched {
        /// Address of account that is touched.
        address: Address,
    },
    // ...
    /// Balance changed
    /// Action: Balance changed
    /// Revert: Revert to previous balance
    BalanceChange {
        /// New balance of account.
        old_balance: U256,
        /// Address of account that had its balance changed.
        address: Address,
    },
    /// Transfer balance between two accounts
    /// Action: Transfer balance
    /// Revert: Transfer balance back
    BalanceTransfer {
        /// Balance that is transferred.
        balance: U256,
        /// Address of account that sent the balance.
        from: Address,
        /// Address of account that received the balance.
        to: Address,
    },
    /// Increment nonce
    /// Action: Increment nonce by one
    /// Revert: Decrement nonce by one
    NonceChange {
        /// Address of account that had its nonce changed.
        /// Nonce is incremented by one.
        address: Address,
    },
    /// Create account:
    /// Actions: Mark account as created
    /// Revert: Unmark account as created and reset nonce to zero.
    AccountCreated {
        /// Address of account that is created.
        /// On revert, this account will be set to empty.
        address: Address,
    },
    /// Entry used to track storage changes
    /// Action: Storage change
    /// Revert: Revert to previous value
    StorageChanged {
        /// Key of storage slot that is changed.
        key: StorageKey,
        /// Previous value of storage slot.
        had_value: StorageValue,
        /// Address of account that had its storage changed.
        address: Address,
    },
    // ...
    /// Code changed
    /// Action: Account code changed
    /// Revert: Revert to previous bytecode.
    CodeChange {
        /// Address of account that had its code changed.
        address: Address,
    },
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/states/transition_account.rs">
```rust
// ...
/// Account Created when EVM state is merged to cache state.
/// And it is sent to Block state.
///
/// It is used when block state gets merged to bundle state to
/// create needed Reverts.
#[derive(Clone, Debug, PartialEq, Eq, Default)]
pub struct TransitionAccount {
    pub info: Option<AccountInfo>,
    pub status: AccountStatus,
    /// Previous account info is needed for account that got initially loaded.
    /// Initially loaded account are not present inside bundle and are needed
    /// to generate Reverts.
    pub previous_info: Option<AccountInfo>,
    /// Mostly needed when previous status Loaded/LoadedEmpty.
    pub previous_status: AccountStatus,
    /// Storage contains both old and new account
    pub storage: StorageWithOriginalValues,
    /// If there is transition that clears the storage we should mark it here and
    /// delete all storages in BundleState. This flag is needed if we have transition
    /// between Destroyed states from DestroyedChanged-> DestroyedAgain-> DestroyedChanged
    /// in the end transition that we would have would be `DestroyedChanged->DestroyedChanged`
    /// and with only that info we couldn't decide what to do.
    pub storage_was_destroyed: bool,
}
// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/states/account_status.rs">
```rust
/// AccountStatus represents the various states an account can be in after being loaded from the database.
///
/// After account get loaded from database it can be in a lot of different states
/// while we execute multiple transaction and even blocks over account that is in memory.
/// This structure models all possible states that account can be in.
///
/// # Variants
///
/// - `LoadedNotExisting`: the account has been loaded but does not exist.
/// - `Loaded`: the account has been loaded and exists.
/// - `LoadedEmptyEIP161`: the account is loaded and empty, as per EIP-161.
/// - `InMemoryChange`: there are changes in the account that exist only in memory.
/// - `Changed`: the account has been modified.
/// - `Destroyed`: the account has been destroyed.
/// - `DestroyedChanged`: the account has been destroyed and then modified.
/// - `DestroyedAgain`: the account has been destroyed again.
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
    /// Account is not modified and just loaded from database.
    pub fn is_not_modified(&self) -> bool {
        matches!(
            self,
            AccountStatus::LoadedNotExisting
                | AccountStatus::Loaded
                | AccountStatus::LoadedEmptyEIP161
        )
    }

    /// Account was destroyed by calling SELFDESTRUCT.
    /// This means that full account and storage are inside memory.
    pub fn was_destroyed(&self) -> bool {
        matches!(
            self,
            AccountStatus::Destroyed
                | AccountStatus::DestroyedChanged
                | AccountStatus::DestroyedAgain
        )
    }

    /// This means storage is known, it can be newly created or storage got destroyed.
    pub fn is_storage_known(&self) -> bool {
        matches!(
            self,
            AccountStatus::LoadedNotExisting
                | AccountStatus::InMemoryChange
                | AccountStatus::Destroyed
                | AccountStatus::DestroyedChanged
                | AccountStatus::DestroyedAgain
        )
    }

    /// Account is modified but not destroyed.
    /// This means that some storage values can be found in both
    /// memory and database.
    pub fn is_modified_and_not_destroyed(&self) -> bool {
        matches!(self, AccountStatus::Changed | AccountStatus::InMemoryChange)
    }

    /// Returns the next account status on creation.
    pub fn on_created(&self) -> AccountStatus {
        match self {
            // If account was destroyed previously just copy new info to it.
            AccountStatus::DestroyedAgain
            | AccountStatus::Destroyed
            | AccountStatus::DestroyedChanged => AccountStatus::DestroyedChanged,
            // If account is loaded from db.
            AccountStatus::LoadedNotExisting
            // Loaded empty eip161 to creates is not possible as CREATE2 was added after EIP-161
            | AccountStatus::LoadedEmptyEIP161
            | AccountStatus::Loaded
            | AccountStatus::Changed
            | AccountStatus::InMemoryChange => {
                // If account is loaded and not empty this means that account has some balance.
                // This means that account cannot be created.
                // We are assuming that EVM did necessary checks before allowing account to be created.
                AccountStatus::InMemoryChange
            }
        }
    }
    // ... more status transition functions
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/journal/inner.rs">
```rust
// ...
impl<ENTRY: JournalEntryTr> JournalInner<ENTRY> {
    // ...
    /// Creates account or returns false if collision is detected.
    ///
    /// There are few steps done:
    /// 1. Make created account warm loaded (AccessList) and this should
    ///    be done before subroutine checkpoint is created.
    /// 2. Check if there is collision of newly created account with existing one.
    /// 3. Mark created account as created.
    /// 4. Add fund to created account
    /// 5. Increment nonce of created account if SpuriousDragon is active
    /// 6. Decrease balance of caller account.
    #[inline]
    pub fn create_account_checkpoint(
        &mut self,
        caller: Address,
        target_address: Address,
        balance: U256,
        spec_id: SpecId,
    ) -> Result<JournalCheckpoint, TransferError> {
        // ...
        // Newly created account is present, as we just loaded it.
        let target_acc = self.state.get_mut(&target_address).unwrap();
        let last_journal = &mut self.journal;

        // ... collision check ...

        // set account status to create.
        target_acc.mark_created();

        // this entry will revert set nonce.
        last_journal.push(ENTRY::account_created(target_address));
        // ...
    }

    /// Performs selfdestruct action.
    /// Transfers balance from address to target. Check if target exist/is_cold
    #[inline]
    pub fn selfdestruct<DB: Database>(
        &mut self,
        db: &mut DB,
        address: Address,
        target: Address,
    ) -> Result<StateLoad<SelfDestructResult>, DB::Error> {
        // ...
        let acc = self.state.get_mut(&address).unwrap();
        let balance = acc.info.balance;
        let previously_destroyed = acc.is_selfdestructed();
        // ...
        let journal_entry = if acc.is_created() || !is_cancun_enabled {
            acc.mark_selfdestruct();
            acc.info.balance = U256::ZERO;
            Some(ENTRY::account_destroyed(
                address,
                target,
                previously_destroyed,
                balance,
            ))
        } 
        // ...
    }
}
```
</file>
</revm>
## Prompt Corrections
The original prompt outlines a comprehensive account status tracking system. While its design is sound, `revm` already has a sophisticated and highly relevant state management system that can be leveraged. Instead of building from scratch, it would be more idiomatic and efficient to integrate with `revm`'s existing patterns.

### Key `revm` Concepts to Utilize:

1.  **`AccountStatus` Enum:** `revm` already has an `AccountStatus` enum in `revm/crates/database/src/states/account_status.rs`. This enum tracks an account's state *within the cache* (e.g., `Loaded`, `Changed`, `Destroyed`). This is different from the prompt's lifecycle-focused statuses (`Active`, `Empty`), but it's a critical component for understanding how `revm` tracks state changes internally. It would be best to use or extend this system.

2.  **Journaling for Change Tracking:** The core of `revm`'s state management is its `Journal`. All state modifications (balance changes, nonce increments, storage writes, creations, destructions) are recorded as a `JournalEntry`. This is the single most important integration point. The `AccountStatusManager` should likely observe the creation of `JournalEntry`s rather than being called from many different places in the EVM.
    *   The `JournalEntry` enum in `revm/crates/context/src/journal/entry.rs` directly maps to the user's required tracking events (`AccountCreated`, `StorageChanged`, `BalanceTransfer`, `AccountDestroyed`).

3.  **`TransitionAccount` for "Before and After" State:** The prompt's requirement to track modifications (e.g., `old_account` vs `new_account`) is elegantly handled by `revm`'s `TransitionAccount` struct (`revm/crates/database/src/states/transition_account.rs`). This struct explicitly holds `previous_info` and `info`, as well as `previous_status` and `status`, perfectly capturing the "before and after" state for any account modified within a block. The `AccountStatusManager` could be designed to consume a stream of `TransitionAccount`s at the end of a block to update its statistics and history.

### Recommended Implementation Approach:

Instead of integrating the `AccountStatusManager` directly into the `Vm` and `State` structs as proposed, a more `revm`-native approach would be:

1.  **Observe the `Journal`:** The most effective place to hook in tracking logic is where `JournalEntry`s are created within the `Journal` struct (`revm/crates/context/src/journal/inner.rs`). This centralizes all change detection.

2.  **Process `TransitionState`:** At the end of a block's execution, `revm` aggregates all changes into a `TransitionState`, which is a collection of `TransitionAccount`s. This is the ideal data structure to feed into the `AccountStatusManager`. It contains a clean, consolidated list of every account that was created, modified, or destroyed, along with its before-and-after state.

3.  **Refine `AccountStatus`:** The user's `AccountStatus` (`Active`, `Empty`, `Deleted`) can be derived from `revm`'s `Account` and `AccountInfo` structs (`is_empty()` method, etc.) and `revm`'s internal `AccountStatus` (`Destroyed`). This avoids reinventing the wheel and ensures consistency with `revm`'s state management.



## EXECUTION-SPECS Context

An analysis of the `execution-specs` codebase reveals the key areas where account status tracking needs to be integrated. The most relevant files are those handling state transitions, account manipulation, and the execution of specific opcodes that create, modify, or destroy accounts.

The following snippets from the **London** hardfork provide a clear blueprint for this task. The logic is broadly applicable to other forks, as the core state transition and opcode execution mechanisms are similar.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/state.py">
```python
"""
State
^^^^^
...
"""
# ... (imports)

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

# ... (other functions)

def set_account(
    state: State, address: Address, account: Optional[Account]
) -> None:
    """
    Set the `Account` object at an address. Setting to `None` deletes
    the account (but not its storage, see `destroy_account()`).
    ...
    """
    trie_set(state._main_trie, address, account)


def destroy_account(state: State, address: Address) -> None:
    """
    Completely remove the account at `address` and all of its storage.
    ...
    """
    destroy_storage(state, address)
    set_account(state, address, None)

def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get a value at a storage key on an account. Returns `U256(0)` if the
    storage key has not been set previously.
    ...
    """
    # ...

def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    """
    Set a value at a storage key on an account. Setting to `U256(0)` deletes
    the key.
    ...
    """
    assert trie_get(state._main_trie, address) is not None

    trie = state._storage_tries.get(address)
    if trie is None:
        trie = Trie(secured=True, default=U256(0))
        state._storage_tries[address] = trie
    trie_set(trie, key, value)
    if trie._data == {}:
        del state._storage_tries[address]

# ... (other functions)

def begin_transaction(state: State) -> None:
    """
    Start a state transaction.
    ...
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )


def commit_transaction(state: State) -> None:
    """
    Commit a state transaction.
    ...
    """
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()


def rollback_transaction(state: State) -> None:
    """
    Rollback a state transaction, resetting the state to the point when the
    corresponding `start_transaction()` call was made.
    ...
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork.py">
```python
# ... (imports)
from .state import (
    State,
    account_exists_and_is_empty,
    destroy_account,
    destroy_touched_empty_accounts,
    get_account,
    increment_nonce,
    set_account_balance,
    state_root,
)
# ...

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
    # This is the primary entry point for a transaction.
    # Hooks for tracking can be placed here to observe the entire lifecycle.

    # 1. Validate transaction and get sender.
    intrinsic_gas = validate_transaction(tx)
    (
        sender,
        effective_gas_price,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )
    sender_account = get_account(block_env.state, sender)

    # 2. Account modification: Nonce is incremented.
    # This is a key point to track nonce changes.
    gas = tx.gas - intrinsic_gas
    increment_nonce(block_env.state, sender)

    # 3. Account modification: Balance is reduced for gas fee.
    gas_fee = tx.gas * effective_gas_price
    sender_balance_after_gas_fee = (
        Uint(sender_account.balance) - gas_fee
    )
    set_account_balance(
        block_env.state, sender, U256(sender_balance_after_gas_fee)
    )

    # ... (access list setup)

    # 4. Prepare and execute the message call (CREATE or CALL).
    message = prepare_message(block_env, tx_env, tx)
    tx_output = process_message_call(message)

    # ... (refund and fee transfer logic, which also modifies balances)

    # 5. Handle deletions from SELFDESTRUCT.
    for address in tx_output.accounts_to_delete:
        destroy_account(block_env.state, address)

    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
# ... (imports)
from ..state import (
    # ...
    begin_transaction,
    commit_transaction,
    destroy_storage,
    increment_nonce,
    mark_account_created,
    move_ether,
    rollback_transaction,
    set_code,
)
# ...

def process_create_message(message: Message) -> Evm:
    """
    Executes a call to create a smart contract.
    This is the ideal place to hook `track_account_creation`.
    """
    state = message.block_env.state
    begin_transaction(state)

    # ...

    # Mark the account as created for storage refund purposes.
    # This is analogous to tracking the 'Created' status.
    mark_account_created(state, message.current_target)

    # Nonce is incremented on the creator's account.
    increment_nonce(state, message.current_target)
    
    # Execute the init code
    evm = process_message(message)

    if not evm.error:
        # ... (gas calculation for code deployment)
        # Account code is set here, a key event to track.
        set_code(state, message.current_target, contract_code)
        commit_transaction(state)
    else:
        rollback_transaction(state)
    return evm

def process_message(message: Message) -> Evm:
    """
    Move ether and execute the relevant code.
    This function is central to tracking state modifications like balance changes.
    """
    state = message.block_env.state
    # ... (depth check)

    begin_transaction(state)

    # Touches the target account, making it warm. Could be considered a 'modification' event.
    touch_account(state, message.current_target)

    # Explicit balance change via value transfer.
    if message.should_transfer_value and message.value != 0:
        move_ether(
            state, message.caller, message.current_target, message.value
        )
    
    # Core execution loop
    evm = execute_code(message)
    
    if evm.error:
        rollback_transaction(state)
    else:
        commit_transaction(state)
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
# ... (imports)

def selfdestruct(evm: Evm) -> None:
    """
    Halt execution and register account for later deletion.
    This is the hook for `track_account_deletion`. The `beneficiary`
    and `originator` are available here.
    """
    # STACK
    beneficiary = to_address(pop(evm.stack))

    # ... (gas calculations)

    originator = evm.message.current_target

    # ... (refund logic)

    # Balance of the originator is transferred to the beneficiary.
    beneficiary_balance = get_account(
        evm.message.block_env.state, beneficiary
    ).balance
    originator_balance = get_account(
        evm.message.block_env.state, originator
    ).balance
    set_account_balance(
        evm.message.block_env.state,
        beneficiary,
        beneficiary_balance + originator_balance,
    )

    # Balance of the originator is zeroed out.
    set_account_balance(evm.message.block_env.state, originator, U256(0))

    # register account for deletion
    evm.accounts_to_delete.add(originator)
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/storage.py">
```python
# ... (imports)

def sload(evm: Evm) -> None:
    """
    Loads to the stack, the value corresponding to a certain key from the
    storage of the current account. This is the hook for `track_storage_access` (Read).
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    
    # GAS
    # Access list logic is relevant for tracking warm/cold slots
    if (evm.message.current_target, key) in evm.accessed_storage_keys:
        charge_gas(evm, GAS_WARM_ACCESS)
    else:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        charge_gas(evm, GAS_COLD_SLOAD)

    # OPERATION
    value = get_storage(
        evm.message.block_env.state, evm.message.current_target, key
    )

    push(evm.stack, value)
    # ...

def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.
    This is the hook for `track_storage_access` (Write/Delete).
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)

    # ...

    # The original and current values are retrieved, which is necessary
    # for detailed tracking of storage changes.
    original_value = get_storage_original(
        state, evm.message.current_target, key
    )
    current_value = get_storage(state, evm.message.current_target, key)

    # ... (gas logic)

    # The actual state change.
    set_storage(state, evm.message.current_target, key, new_value)
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork_types.py">
```python
# ... (imports)

@slotted_freezable
@dataclass
class Account:
    """
    State associated with an address.
    """

    nonce: Uint
    balance: U256
    code: Bytes


EMPTY_ACCOUNT = Account(
    nonce=Uint(0),
    balance=U256(0),
    code=bytearray(),
)


def encode_account(raw_account_data: Account, storage_root: Bytes) -> Bytes:
    """
    Encode `Account` dataclass.
    ...
    """
    return rlp.encode(
        (
            raw_account_data.nonce,
            raw_account_data.balance,
            storage_root,
            keccak256(raw_account_data.code),
        )
    )
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt provides a comprehensive and well-structured specification for the `AccountStatusManager`. There are no significant errors. The provided snippets from `execution-specs` should serve as excellent reference points for integrating this new module into the existing state and VM logic. The key is to identify the precise locations within the transaction processing and opcode execution flow to insert the tracking calls (`track_account_creation`, `track_account_modification`, etc.). The provided files show exactly where these state-altering events occur.

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
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()


def get_account(state: State, address: Address) -> Account:
    """
    Get the `Account` object at an address. Returns `EMPTY_ACCOUNT` if there
    is no account at the address.
    """
    account = get_account_optional(state, address)
    if isinstance(account, Account):
        return account
    else:
        return EMPTY_ACCOUNT

def set_account(
    state: State, address: Address, account: Optional[Account]
) -> None:
    """
    Set the `Account` object at an address. Setting to `None` deletes
    the account (but not its storage, see `destroy_account()`).
    """
    trie_set(state._main_trie, address, account)


def destroy_account(state: State, address: Address) -> None:
    """
    Completely remove the account at `address` and all of its storage.
    """
    destroy_storage(state, address)
    set_account(state, address, None)

def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get a value at a storage key on an account. Returns `U256(0)` if the
    storage key has not been set previously.
    """
    trie = state._storage_tries.get(address)
    if trie is None:
        return U256(0)

    value = trie_get(trie, key)

    assert isinstance(value, U256)
    return value

def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    """
    Set a value at a storage key on an account. Setting to `U256(0)` deletes
    the key.
    """
    assert trie_get(state._main_trie, address) is not None

    trie = state._storage_tries.get(address)
    if trie is None:
        trie = Trie(secured=True, default=U256(0))
        state._storage_tries[address] = trie
    trie_set(trie, key, value)
    if trie._data == {}:
        del state._storage_tries[address]

def is_account_alive(state: State, address: Address) -> bool:
    """
    Check whether is an account is both in the state and non empty.
    """
    account = get_account_optional(state, address)
    return account is not None and account != EMPTY_ACCOUNT

def move_ether(
    state: State,
    sender_address: Address,
    recipient_address: Address,
    amount: U256,
) -> None:
    """
    Move funds between accounts.
    """
    ...

def increment_nonce(state: State, address: Address) -> None:
    """
    Increments the nonce of an account.
    """
    def increase_nonce(sender: Account) -> None:
        sender.nonce += Uint(1)

    modify_state(state, address, increase_nonce)


def set_code(state: State, address: Address, code: Bytes) -> None:
    """
    Sets Account code.
    """
    def write_code(sender: Account) -> None:
        sender.code = code

    modify_state(state, address, write_code)
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


EMPTY_ACCOUNT = Account(
    nonce=Uint(0),
    balance=U256(0),
    code=bytearray(),
)
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
    """
    # ... initial validation ...

    (
        sender,
        effective_gas_price,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )

    sender_account = get_account(block_env.state, sender)

    # ... gas fee calculation and sender balance deduction ...
    
    gas = tx.gas - intrinsic_gas
    increment_nonce(block_env.state, sender)

    sender_balance_after_gas_fee = (
        Uint(sender_account.balance) - effective_gas_fee
    )
    set_account_balance(
        block_env.state, sender, U256(sender_balance_after_gas_fee)
    )

    # ... access list setup ...

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    # ... gas refund and fee transfer logic ...
    
    # After a successful or failed transaction, process deletions
    for address in tx_output.accounts_to_delete:
        destroy_account(block_env.state, address)

    destroy_touched_empty_accounts(block_env.state, tx_output.touched_accounts)

    # ... receipt generation ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.
    """
    # ...
    if message.target == Bytes0(b""):
        # This is a contract creation call
        is_collision = account_has_code_or_nonce(
            block_env.state, message.current_target
        ) or account_has_storage(block_env.state, message.current_target)
        if is_collision:
            # Handle address collision
            # ...
        else:
            evm = process_create_message(message)
    else:
        # This is a regular message call
        evm = process_message(message)
    # ...

    # This is where accounts marked for deletion are collected
    if evm.error:
        logs: Tuple[Log, ...] = ()
        accounts_to_delete = set()
        touched_accounts = set()
    else:
        logs = evm.logs
        accounts_to_delete = evm.accounts_to_delete
        touched_accounts = evm.touched_accounts
        refund_counter += U256(evm.refund_counter)

    # ...
    return MessageCallOutput(
        # ...
        accounts_to_delete=accounts_to_delete,
        touched_accounts=touched_accounts,
        # ...
    )


def process_create_message(message: Message) -> Evm:
    """
    Executes a call to create a smart contract.
    """
    # ...
    # This is where the account is marked for creation in the state
    mark_account_created(state, message.current_target)

    # The nonce of the creator is incremented
    increment_nonce(state, message.current_target)
    
    # The message is processed, which involves executing init code
    evm = process_message(message)
    
    if not evm.error:
        contract_code = evm.output
        # ... gas calculation ...
        
        # The resulting code is set on the new account
        set_code(state, message.current_target, contract_code)
        commit_transaction(state)
    else:
        rollback_transaction(state)
    return evm

def process_message(message: Message) -> Evm:
    """
    Move ether and execute the relevant code.
    """
    state = message.block_env.state
    # ...
    
    # Snapshot state for potential revert
    begin_transaction(state)

    # Account is touched, might be created if it doesn't exist
    touch_account(state, message.current_target)

    # Value transfer happens, modifying balances
    if message.should_transfer_value and message.value != 0:
        move_ether(
            state, message.caller, message.current_target, message.value
        )
    
    # Code execution
    evm = execute_code(message)
    
    if evm.error:
        rollback_transaction(state)
    else:
        commit_transaction(state)
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
def selfdestruct(evm: Evm) -> None:
    """
    Halt execution and register account for later deletion.
    """
    # STACK
    beneficiary = to_address(pop(evm.stack))

    # ... gas calculations ...

    if evm.message.is_static:
        raise WriteInStaticContext

    originator = evm.message.current_target
    beneficiary_balance = get_account(
        evm.message.block_env.state, beneficiary
    ).balance
    originator_balance = get_account(
        evm.message.block_env.state, originator
    ).balance

    # First Transfer to beneficiary
    set_account_balance(
        evm.message.block_env.state,
        beneficiary,
        beneficiary_balance + originator_balance,
    )
    # Next, Zero the balance of the address being deleted
    set_account_balance(evm.message.block_env.state, originator, U256(0))

    # register account for deletion
    evm.accounts_to_delete.add(originator)

    # ...

    # HALT the execution
    evm.running = False
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/storage.py">
```python
def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)
    
    # ... gas checks ...

    state = evm.message.block_env.state
    original_value = get_storage_original(
        state, evm.message.current_target, key
    )
    current_value = get_storage(state, evm.message.current_target, key)

    # ... gas cost calculation ...
    
    charge_gas(evm, gas_cost)
    if evm.message.is_static:
        raise WriteInStaticContext
    set_storage(state, evm.message.current_target, key, new_value)

    # ...
```
</file>
</execution-specs>

## Prompt Corrections
The prompt provides a very comprehensive specification for a new account status tracking system. It is well-defined and includes most necessary components. The following are minor suggestions and clarifications based on the `execution-specs` that could improve the prompt:

1.  **Context for `ModificationContext` and `CreationContext`**: The prompt uses `ModificationContext` and `CreationContext` but does not define them. The implementation should clarify what information is necessary in these contexts. Based on the `execution-specs`, this would likely include `transaction_hash`, `block_number`, and possibly the `caller` or `origin` address.

2.  **State Reversion Handling**: The `execution-specs` make heavy use of snapshotting (`begin_transaction`, `commit_transaction`, `rollback_transaction`) to handle reverts. The `AccountStatusManager` should also be designed to correctly handle state rollbacks. When a transaction or sub-call reverts, the changes recorded by the manager (new history entries, updated statistics) must also be reverted to maintain consistency with the world state. The prompt should explicitly require integration with a similar snapshot/journaling system.

3.  **Distinction between `Account.code_hash` and `keccak256(account.code)`**: The `Account` struct in `fork_types.py` does not store a `code_hash`. Instead, the hash is computed on-demand when the account is encoded into the state trie. The Zig implementation should be aware of this; it might be more efficient to compute and cache the code hash within the tracking system rather than assuming it's always present on the base account object.

4.  **"Empty" vs "Non-Existent" Accounts**: The specs make a distinction between an account that has a record in the state trie but is "empty" (`nonce=0, balance=0, code=empty`) and an account that has no record at all. The `AccountState` enum in the prompt (`Unknown`, `Active`, `Empty`, `Deleted`) is a good abstraction for this. It's worth noting that an account can be "touched" (e.g., as the recipient of a zero-value transfer) which creates an empty account record in the state. This transition from non-existent to "Empty" is a lifecycle event worth tracking.

5.  **`track_account_modification` Parameter Consolidation**: The function `track_account_modification` takes both `old_account` and `new_account` as well as a `ModificationType`. It might be simpler to infer the modification type by comparing the old and new account states directly within the function, reducing the number of arguments and simplifying the call sites.



## GO-ETHEREUM Context

An analysis of the `go-ethereum` codebase reveals several key patterns and implementations that are highly relevant to building an Account Status Tracking system. The most pertinent concepts are Geth's state journaling mechanism for handling reverts, its extensive metrics library for performance tracking, and the state management objects that encapsulate account data.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// First you need to obtain a state object.
// To get a state object use statedb.GetOrNewStateObject.
// Once you have a state object you can retrieve it's values using GetBalance, GetNonce, GetCode, and GetState.
// To change the state object values use SetBalance, SetNonce, SetCode, and SetState.
// These methods will cause changes to be cached in the state object. If you want to write
// these changes to the state trie call statedb.Finalise.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.StateAccount
	db       *StateDB

	// Write caches.
	code Code // contract code, which gets stored in the account trie

	// Cache flags.
	// When an object is marked suicided it will be delete from the trie
	// during the commit pass and whatever number of balance it has will be returned
	// to the parent object.
	suicided bool
	deleted  bool
}

// SetNonce sets the nonce of the account.
func (s *stateObject) SetNonce(nonce uint64) {
	s.db.journal.append(nonceChange{
		account: &s.address,
		prev:    s.data.Nonce,
	})
	s.setNonce(nonce)
}

func (s *stateObject) setNonce(nonce uint64) {
	s.data.Nonce = nonce
}

// SetBalance sets the balance of the account.
func (s *stateObject) SetBalance(amount *uint256.Int) {
	s.db.journal.append(balanceChange{
		account: &s.address,
		prev:    s.data.Balance,
	})
	s.setBalance(amount)
}

func (s *stateObject) setBalance(amount *uint256.Int) {
	s.data.Balance = amount
}

// SetCode sets the code of the account.
func (s *stateObject) SetCode(codeHash common.Hash, code []byte) {
	s.db.journal.append(codeChange{
		account:  &s.address,
		prevhash: s.data.CodeHash,
		prevcode: s.code,
	})
	s.setCode(codeHash, code)
}

func (s *stateObject) setCode(codeHash common.Hash, code []byte) {
	s.code = code
	s.data.CodeHash = codeHash.Bytes()
}

// GetState gets a value from the account's storage trie.
func (s *stateObject) GetState(key common.Hash) common.Hash {
	// If we have a dirty value for this state entry, return it
	value, dirty := s.dirtyStorage[key]
	if dirty {
		return value
	}
	// Otherwise return the entry's original value
	return s.GetCommittedState(key)
}

// SetState updates a value in the account's storage trie.
func (s *stateObject) SetState(key, value common.Hash) {
	// If the new value is the same as old, don't set
	prev := s.GetState(key)
	if prev == value {
		return
	}
	// New value is different, update and journal the change
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: prev,
	})
	s.setState(key, value)
}

func (s *stateObject) setState(key, value common.Hash) {
	s.dirtyStorage[key] = value
}

// Suicide marks the account as suicided.
// This clears the account balance.
//
// The account's state object is still available until the state is committed,
// GetBalance will return zero, but original balance, nonce and code are still
// available in the parent db.
func (s *stateObject) Suicide(balance *uint256.Int) bool {
	if s.suicided {
		return false
	}
	s.db.journal.append(suicideChange{
		account:     &s.address,
		prev:        s.suicided,
		prevbalance: new(uint256.Int).Set(s.data.Balance),
	})
	s.suicided = true
	s.data.Balance = balance

	return true
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state. It is a concrete
// implementation of the vm.StateDB interface.
type StateDB struct {
	db     Database
	triedb *triedb.Database

	// This map holds the state objects that have been modified in the current transaction.
	stateObjects        map[common.Address]*stateObject
	stateObjectsPending map[common.Address]struct{} // state objects being processed
	stateObjectsDirty   map[common.Address]struct{} // state objects modified in the current transaction

	// The refund counter, also used by state transitioning.
	refund uint64

	// The access list and the nested access list logic.
	accessList *accessList

	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// Measurements gathered during execution for debugging purposes
	AccountReads         time.Duration
	AccountHashes        time.Duration
	AccountUpdates       time.Duration
	AccountCommits       time.Duration
	StorageReads         time.Duration
	StorageHashes        time.Duration
	StorageUpdates       time.Duration
	StorageCommits       time.Duration
	SnapshotAccountReads time.Duration
	SnapshotStorageReads time.Duration
	SnapshotCommits      time.Duration
}


// CreateAccount explicitly creates a state object. If a state object with the address
// already exists the balance is carried over to the new account.
//
// CreateAccount is called during the EVM CREATE operation. The situation might arise that
// a contract does the following:
//
//   1. sends funds to sha(account ++ (nonce))
//   2. CREATEs a contract with sha(account ++ (nonce))
//
// Making this an explicit method ensures that the balance remains intact.
func (s *StateDB) CreateAccount(addr common.Address) {
	newobj, prevobj := s.createObject(addr)
	if prevobj != nil {
		newobj.setBalance(prevobj.data.Balance)
	}
}

// Suicide marks the given account as suicided.
// This clears the account balance.
//
// The account's state object is still available until the state is committed,
// GetBalance will return zero, but original balance, nonce and code are still
// available in the parent db.
func (s *StateDB) Suicide(addr common.Address) bool {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject == nil {
		return false
	}
	s.journal.append(suicideChange{
		account:     &addr,
		prev:        stateObject.suicided,
		prevbalance: new(uint256.Int).Set(stateObject.Balance()),
	})
	stateObject.suicided = true
	stateObject.data.Balance = new(uint256.Int)

	return true
}

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	id := s.nextRevisionId
	s.nextRevisionId++
	s.validRevisions = append(s.validRevisions, revision{id, len(s.journal.entries)})
	return id
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(s.validRevisions), func(i int) bool {
		return s.validRevisions[i].id >= revid
	})
	if idx == len(s.validRevisions) || s.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v cannot be reverted", revid))
	}
	snapshot := s.validRevisions[idx].journalIndex

	// Replay the journal to undo changes and remove invalidated snapshots
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/journal.go">
```go
// journal is a state change journal to be wrapped around a tracer.
// It will emit the state change hooks with reverse values when a call reverts.
type journal struct {
	hooks     *Hooks
	entries   []entry
	revisions []int
}

type entry interface {
	revert(tracer *Hooks)
}

// WrapWithJournal wraps the given tracer with a journaling layer.
func WrapWithJournal(hooks *Hooks) (*Hooks, error) {
    // ... (initialization logic) ...
	// Create journal
	j := &journal{hooks: hooks}
	// Scope hooks need to be re-implemented.
	wrapped.OnTxEnd = j.OnTxEnd
	wrapped.OnEnter = j.OnEnter
	wrapped.OnExit = j.OnExit
	// Wrap state change hooks.
	if hooks.OnBalanceChange != nil {
		wrapped.OnBalanceChange = j.OnBalanceChange
	}
    // ... (other hooks) ...
	return &wrapped, nil
}


// OnEnter is invoked for each EVM call frame and records a journal revision.
func (j *journal) OnEnter(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	j.snapshot()
	if j.hooks.OnEnter != nil {
		j.hooks.OnEnter(depth, typ, from, to, input, gas, value)
	}
}

// OnExit is invoked when an EVM call frame ends.
// If the call has reverted, all state changes made by that frame are undone.
// If the call did not revert, we forget about changes in that revision.
func (j *journal) OnExit(depth int, output []byte, gasUsed uint64, err error, reverted bool) {
	if reverted {
		j.revert(j.hooks)
	} else {
		j.popRevision()
	}
	if j.hooks.OnExit != nil {
		j.hooks.OnExit(depth, output, gasUsed, err, reverted)
	}
}

func (j *journal) OnBalanceChange(addr common.Address, prev, new *big.Int, reason BalanceChangeReason) {
	j.entries = append(j.entries, balanceChange{addr: addr, prev: prev, new: new})
	if j.hooks.OnBalanceChange != nil {
		j.hooks.OnBalanceChange(addr, prev, new, reason)
	}
}

func (j *journal) OnNonceChangeV2(addr common.Address, prev, new uint64, reason NonceChangeReason) {
	// When a contract is created, the nonce of the creator is incremented.
	// This change is not reverted when the creation fails.
	if reason != NonceChangeContractCreator {
		j.entries = append(j.entries, nonceChange{addr: addr, prev: prev, new: new})
	}
	if j.hooks.OnNonceChangeV2 != nil {
		j.hooks.OnNonceChangeV2(addr, prev, new, reason)
	} else if j.hooks.OnNonceChange != nil {
		j.hooks.OnNonceChange(addr, prev, new)
	}
}

func (j *journal) OnCodeChange(addr common.Address, prevCodeHash common.Hash, prevCode []byte, codeHash common.Hash, code []byte) {
	j.entries = append(j.entries, codeChange{
		addr:         addr,
		prevCodeHash: prevCodeHash,
		prevCode:     prevCode,
		newCodeHash:  codeHash,
		newCode:      code,
	})
	if j.hooks.OnCodeChange != nil {
		j.hooks.OnCodeChange(addr, prevCodeHash, prevCode, codeHash, code)
	}
}

func (j *journal) OnStorageChange(addr common.Address, slot common.Hash, prev, new common.Hash) {
	j.entries = append(j.entries, storageChange{addr: addr, slot: slot, prev: prev, new: new})
	if j.hooks.OnStorageChange != nil {
		j.hooks.OnStorageChange(addr, slot, prev, new)
	}
}

type (
	balanceChange struct {
		addr common.Address
		prev *big.Int
		new  *big.Int
	}
    // ... other entry types
)

func (b balanceChange) revert(hooks *Hooks) {
	if hooks.OnBalanceChange != nil {
		hooks.OnBalanceChange(b.addr, b.new, b.prev, BalanceChangeRevert)
	}
}
// ... other revert methods
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
// Meter count events to produce exponentially-weighted moving average rates
// at one-, five-, and fifteen-minutes and a mean rate.
type Meter struct {
	count     atomic.Int64
	uncounted atomic.Int64 // not yet added to the EWMAs
	rateMean  atomic.Uint64

	a1, a5, a15 *EWMA
	startTime   time.Time
	stopped     atomic.Bool
}

// Mark records the occurrence of n events.
func (m *Meter) Mark(n int64) {
	m.uncounted.Add(n)
}

// Snapshot returns a read-only copy of the meter.
func (m *Meter) Snapshot() *MeterSnapshot {
	return &MeterSnapshot{
		count:    m.count.Load() + m.uncounted.Load(),
		rate1:    m.a1.Snapshot().Rate(),
		rate5:    m.a5.Snapshot().Rate(),
		rate15:   m.a15.Snapshot().Rate(),
		rateMean: math.Float64frombits(m.rateMean.Load()),
	}
}

func (m *Meter) tick() {
	// Take the uncounted values, add to count
	n := m.uncounted.Swap(0)
	count := m.count.Add(n)
	m.rateMean.Store(math.Float64bits(float64(count) / time.Since(m.startTime).Seconds()))
	// Update the EWMA's internal state
	m.a1.Update(n)
	m.a5.Update(n)
	m.a15.Update(n)
	// And trigger them to calculate the rates
	m.a1.tick()
	m.a5.tick()
	m.a15.tick()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/counter.go">
```go
// GetOrRegisterCounter returns an existing Counter or constructs and registers
// a new Counter.
func GetOrRegisterCounter(name string, r Registry) *Counter {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewCounter).(*Counter)
}

// Counter hold an int64 value that can be incremented and decremented.
type Counter atomic.Int64

// Clear sets the counter to zero.
func (c *Counter) Clear() {
	(*atomic.Int64)(c).Store(0)
}

// Dec decrements the counter by the given amount.
func (c *Counter) Dec(i int64) {
	(*atomic.Int64)(c).Add(-i)
}

// Inc increments the counter by the given amount.
func (c *Counter) Inc(i int64) {
	(*atomic.Int64)(c).Add(i)
}

// Snapshot returns a read-only copy of the counter.
func (c *Counter) Snapshot() CounterSnapshot {
	return CounterSnapshot((*atomic.Int64)(c).Load())
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
	chain  *HeaderChain        // Canonical header chain
}

// Process processes the state changes according to the Ethereum rules by running
// the transaction messages using the statedb and applying any rewards to both
// the processor (coinbase) and any included uncles.
func (p *StateProcessor) Process(block *types.Block, statedb *state.StateDB, cfg vm.Config) (*ProcessResult, error) {
	var (
		receipts    types.Receipts
		usedGas     = new(uint64)
		header      = block.Header()
		blockHash   = block.Hash()
		blockNumber = block.Number()
		allLogs     []*types.Log
		gp          = new(GasPool).AddGas(block.GasLimit())
	)
    // ... (fork logic) ...
	var (
		context vm.BlockContext
		signer  = types.MakeSigner(p.config, header.Number, header.Time)
	)

	// ... (system calls) ...

	// Iterate over and process the individual transactions
	for i, tx := range block.Transactions() {
		msg, err := TransactionToMessage(tx, signer, header.BaseFee)
		if err != nil {
			return nil, fmt.Errorf("could not apply tx %d [%v]: %w", i, tx.Hash().Hex(), err)
		}
		statedb.SetTxContext(tx.Hash(), i)

		receipt, err := ApplyTransactionWithEVM(msg, gp, statedb, blockNumber, blockHash, context.Time, tx, usedGas, evm)
		if err != nil {
			return nil, fmt.Errorf("could not apply tx %d [%v]: %w", i, tx.Hash().Hex(), err)
		}
		receipts = append(receipts, receipt)
		allLogs = append(allLogs, receipt.Logs...)
	}
	// ... (finalization) ...
	return &ProcessResult{
		Receipts: receipts,
		Logs:     allLogs,
		GasUsed:  *usedGas,
	}, nil
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// First you need to obtain a state object.
//
//	obj := s.getStateObject(addr)
//
// You can then perform operations on the state object.
//
//	obj.AddBalance(big.NewInt(10))
//
// Finally, call s.updateStateObject(obj) to write the changes to the StateDB's
// intermediate trie.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.StateAccount
	db       *StateDB

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which gets stored when the account becomes a contract

	origin      *stateObject // used for lazyJournal, tracks the original stateObject
	dirty       bool         // true if the state object has been modified
	dirtyAppend bool         // true if the state object has been modified by appending to storage
	deleted     bool         // true if the state object is resurrected from suicide

	// Cache flags.
	// When an object is marked suicided it will be delete from the trie
	// during the commit phase of the state transition.
	suicided bool
	touched  bool
	exist    bool // exist indicates whether the account is empty or not
}

// newObject creates a state object.
func newObject(db *StateDB, address common.Address, data types.StateAccount) *stateObject {
	return &stateObject{
		db:       db,
		address:  address,
		addrHash: crypto.Keccak256Hash(address[:]),
		data:     data,
	}
}

// createObject creates a new state object. If there is an existing account with
// the given address, it is overwritten and returned as the second return value.
func (s *StateDB) createObject(addr common.Address) (newobj, prevobj *stateObject) {
	prevobj = s.getStateObject(addr)
	// Even if the account is empty, it can be marked as touched, and we can't allow
	// accounts to be created over touched addresses.
	if prevobj != nil && prevobj.touched {
		s.setError(fmt.Errorf("account already exists and is touched: %x", addr))
		return nil, nil
	}
	newobj = newObject(s, addr, types.StateAccount{})
	newobj.setNonce(0) // sets the object to dirty
	if prevobj != nil {
		// If the previous object is not nil, it means it's an empty account.
		// We need to `touch` it to be able to overwrite it.
		//
		// N.B: The contract creation of an empty account is allowed only if
		// it's `empty`. But an account can also be empty but `touched`, in
		// which case the creation will fail.
		prevobj.touch()
		if s.journal != nil {
			s.journal.append(resetObjectChange{prev: prevobj})
		}
	} else if s.journal != nil {
		s.journal.append(createObjectChange{account: &addr})
	}
	s.setStateObject(newobj)
	// The returned object is not a copy, so any modifications will be written to
	// the trie. But the state object history is not tracked, so if the caller
	// wants to revert the change, it's the caller's responsibility to restore
	// the original object.
	//
	// In the statedb, there are two variants of 'object creation'. One is via
	// a transaction, where the new object is created and added to the journal.
	// Later, if a revert happens, this journal entry will be reverted, and the
	// original object will be restored.
	//
	// The other use case is when an object is created on the fly, e.g. for a
	// trace, without being part of a transaction. For those cases, there is
	// no journaling taking place, and it's up to the caller to retain the
	// original `prevobj` and restore it if the changes should be undone.
	return newobj, prevobj
}

// SetNonce sets the nonce of the state object.
func (s *stateObject) SetNonce(nonce uint64) {
	if s.data.Nonce == nonce {
		return
	}
	if s.db.journal != nil {
		s.db.journal.append(nonceChange{
			account: &s.address,
			prev:    s.data.Nonce,
		})
	}
	s.setNonce(nonce)
}

func (s *stateObject) setNonce(nonce uint64) {
	s.data.Nonce = nonce
	s.markDirty()
}

// SetCode sets the code of the state object.
func (s *stateObject) SetCode(codeHash common.Hash, code []byte) {
	s.setCode(codeHash, code)
}

func (s *stateObject) setCode(codeHash common.Hash, code []byte) {
	// Don't do anything if the code is the same
	if s.CodeHash() == codeHash {
		return
	}
	// Create the journal entry. If the new code is empty, it means the code is cleared.
	if s.db.journal != nil {
		s.db.journal.append(codeChange{
			account:  &s.address,
			prevhash: s.CodeHash(),
			prevcode: s.Code(),
		})
	}
	// The code is already stored in the database, we only need to update the
	// code hash of account.
	s.data.CodeHash = codeHash[:]
	s.code = code
	s.markDirty()
}
// ... other setters for Balance, Storage, etc. follow a similar pattern ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// A Journal holds the changes to the state so that they can be reverted.
// The journal is a stack of changes.
type Journal struct {
	entries []journalEntry // Current changes tracked by the journal
	dirties map[common.Address]int
	// The following fields are used for journalv2 (which is the default).
	// They replace the `refunds` map and `thaw` bool map.
	// When a new account is created, it's added to the journal, and the address
	// is added to the `creates` map.
	creates map[common.Address]struct{}
	// When an account is suicided, it is added to the `suicides` map.
	suicides map[common.Address]struct{}
}

// newJournal creates a new journal.
func newJournal() *Journal {
	return &Journal{
		dirties:  make(map[common.Address]int),
		creates:  make(map[common.Address]struct{}),
		suicides: make(map[common.Address]struct{}),
	}
}

// journalEntry is a modification to the state.
type journalEntry interface {
	// revert undoes the change in the state database.
	revert(db *StateDB)

	// dirties returns the address that is modified by this journal entry.
	// The dirty address is used to revert the changes in the state object.
	dirties() *common.Address
}

// Append inserts a new change into the journal.
func (j *Journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirties(); addr != nil {
		j.dirties[*addr] = len(j.entries)
	}
}

// revert undoes all changes in the journal.
func (j *Journal) revert(statedb *StateDB) {
	for i := len(j.entries) - 1; i >= 0; i-- {
		// It's important to clear the dirty flags in the state objects
		// before reverting, so the statedb can be used again correctly.
		if addr := j.entries[i].dirties(); addr != nil {
			delete(j.dirties, *addr)
		}
		j.entries[i].revert(statedb)
	}
	j.entries = nil
	j.creates = make(map[common.Address]struct{})
	j.suicides = make(map[common.Address]struct{})
}

// The following types are the concrete journal entries.

// createObjectChange is the journal entry for creating a new object.
type createObjectChange struct {
	account *common.Address
}

func (ch createObjectChange) revert(s *StateDB) {
	delete(s.stateObjects, *ch.account)
	delete(s.stateObjectsDirty, *ch.account)
}

func (ch createObjectChange) dirties() *common.Address {
	return ch.account
}

// resetObjectChange is the journal entry for resetting an object.
// A reset means that the object was marked as dirty, and we need to
// undo that. This happens e.g. when an account is created, but then
// the creation is reverted.
type resetObjectChange struct {
	prev *stateObject
}

func (ch resetObjectChange) revert(s *StateDB) {
	s.setStateObject(ch.prev)
}

func (ch resetObjectChange) dirties() *common.Address {
	return &ch.prev.address
}

// suicideChange is the journal entry for an account suicide.
type suicideChange struct {
	account     *common.Address
	prev        bool // Whether the account was originally suicided
	prevBalance *uint256.Int
}

func (ch suicideChange) revert(s *StateDB) {
	obj := s.getStateObject(*ch.account)
	if obj != nil {
		obj.suicided = ch.prev
		obj.setBalance(ch.prevBalance)
	}
}

func (ch suicideChange) dirties() *common.Address {
	return ch.account
}

// a bunch of other change types here:
// touchChange, balanceChange, nonceChange, storageChange, codeChange, refundChange, addLogChange etc.

type nonceChange struct {
	account *common.Address
	prev    uint64
}

func (ch nonceChange) revert(s *StateDB) {
	obj := s.getStateObject(*ch.account)
	if obj != nil {
		obj.data.Nonce = ch.prev
	}
}

func (ch nonceChange) dirties() *common.Address {
	return ch.account
}

type balanceChange struct {
	account *common.Address
	prev    *uint256.Int
}

func (ch balanceChange) revert(s *StateDB) {
	obj := s.getStateObject(*ch.account)
	if obj != nil {

		obj.setBalance(ch.prev)
	}
}

func (ch balanceChange) dirties() *common.Address {
	return ch.account
}

type storageChange struct {
	account       *common.Address
	key, prevalue common.Hash
}

func (ch storageChange) revert(s *StateDB) {
	obj := s.getStateObject(*ch.account)
	if obj != nil {
		obj.setState(ch.key, ch.prevalue)
	}
}

func (ch storageChange) dirties() *common.Address {
	return ch.account
}

type codeChange struct {
	account  *common.Address
	prevhash common.Hash
	prevcode []byte
}

func (ch codeChange) revert(s *StateDB) {
	obj := s.getStateObject(*ch.account)
	if obj != nil {
		obj.setCode(ch.prevhash, ch.prevcode)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run contracts.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// Depth is the current call stack
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// chainRules contains the chain rules for the current epoch
	chainRules params.Rules

	// virtual machine configuration options used to initialise the
	// virtual machine.
	Config Config

	// interpreter is the contract interpreter
	interpreter *Interpreter

	// readOnly is the read-only indicator, which is calculated based on
	// the initial readOnly flag and the IsEIP214.
	readOnly bool
}

// ...

// opSelfdestruct is the permanent storage deletion of a contract.
func opSelfdestruct(pc *uint64, evm *EVM, contract *Contract, stack *Stack) ([]byte, error) {
	// EIP-6780: SELFDESTRUCT is only executed if it is in the same transaction as it was created
	// EIP-6046 introduced SELFDESTRUCT that only sends funds, but this was not adopted.
	if evm.chainRules.IsCancun && !evm.StateDB.GetCreationTx(contract.Address()) {
		// Pop beneficiary from stack.
		stack.pop()
		return nil, nil
	}

	beneficiary := common.Address(stack.pop().Bytes20())

	// The balance of the caller is transferred to the beneficiary.
	// This is a nop if the self-destructing contract has no balance.
	balance := evm.StateDB.GetBalance(contract.Address())
	evm.StateDB.AddBalance(beneficiary, balance, tracing.BalanceIncreaseSelfDestruct)
	evm.StateDB.SubBalance(contract.Address(), balance, tracing.BalanceDecreaseSelfDestruct)

	evm.StateDB.SelfDestruct(contract.Address())
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
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

// stateTransition represents a state transition.
type stateTransition struct {
	gp           *GasPool
	msg          *Message
	gasRemaining uint64
	initialGas   uint64
	state        vm.StateDB
	evm          *vm.EVM
}

// execute will transition the state by applying the current message and
// returning the evm execution result with following fields.
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// First check this message satisfies all consensus rules before
	// applying the message. The rules include these clauses
	// ... (preCheck logic)
	if err := st.preCheck(); err != nil {
		return nil, err
	}

	// ... (intrinsic gas calculation)
	gas, err := IntrinsicGas(msg.Data, msg.AccessList, msg.SetCodeAuthorizations, contractCreation, rules.IsHomestead, rules.IsIstanbul, rules.IsShanghai)
	if err != nil {
		return nil, err
	}
	st.gasRemaining -= gas

	// ... (value transfer check)
	value, overflow := uint256.FromBig(msg.Value)
	if overflow {
		return nil, fmt.Errorf("%w: address %v", ErrInsufficientFundsForTransfer, msg.From.Hex())
	}
	if !value.IsZero() && !st.evm.Context.CanTransfer(st.state, msg.From, value) {
		return nil, fmt.Errorf("%w: address %v", ErrInsufficientFundsForTransfer, msg.From.Hex())
	}

	// Execute the preparatory steps for state transition
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
		
		// ... (EIP-7702 authorizations)

		// Execute the transaction's call.
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}

	// ... (refund and fee logic)
	st.gasRemaining += st.calcRefund()
	st.returnGas()

	// ... (pay fees to coinbase)
	
	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/account.go">
```go
// Account is the Ethereum consensus representation of accounts.
// These objects are stored in the state trie.
type Account struct {
	Nonce    uint64
	Balance  *big.Int
	Root     common.Hash // storage root.
	CodeHash []byte
}

// StateAccount is the RLP structure of an account in the state trie.
type StateAccount struct {
	Nonce    uint64
	Balance  *uint256.Int
	Root     common.Hash
	CodeHash []byte
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt provides an excellent and detailed specification for an `AccountStatusManager`. However, it misses a critical aspect of EVM state management: **reverts**.

The `go-ethereum` codebase uses a `journal` to track every single state change (balance, nonce, storage, code, etc.) during a transaction's execution. If the transaction reverts (due to an error or the `REVERT` opcode), this journal is played backward to undo every change, restoring the state to its pre-transaction condition.

Your `AccountStatusManager` needs a similar mechanism. When `track_account_modification` is called, it should not be considered a final state change until the transaction is successfully committed.

**Recommendation:**

1.  **Introduce a Journal**: Consider adding a `Journal` to your `AccountStatusManager` that logs all potential status changes. A snapshot of the journal can be taken before a sub-call.
2.  **Revert Mechanism**: Implement a `revert(snapshot_id)` method on your manager. This method would process the journal entries since the snapshot in reverse, undoing the tracked changes in your `account_registry` and `status_history`.
3.  **Commit Mechanism**: Implement a `commit(snapshot_id)` method that finalizes the changes recorded in the journal since the snapshot.

The provided `go-ethereum/core/state/journal.go` is an excellent reference for this pattern. The `journalEntry` interface and its various implementations (`balanceChange`, `nonceChange`, etc.) show exactly what data needs to be stored to enable reverts. Integrating this concept will make your tracking system robust and consistent with EVM execution rules.

---

An excellent and detailed prompt. Implementing a system to track the EVM account lifecycle requires observing state changes at their source. In Go-Ethereum, this is primarily managed by the `StateDB` and its `journal`. The journal records every state modification, which allows for both transaction reverts and detailed tracing.

The most relevant Go-Ethereum concepts for this task are:
1.  **The `StateDB` journal**: This is the core mechanism for tracking all state changes within a transaction. It logs every modification (balance, nonce, storage, etc.) in a way that can be reverted. This is a direct parallel to the `status_history` and detailed tracking requested.
2.  **State Objects**: The in-memory representation of an account (`stateObject`), which caches state and tracks when it becomes "dirty" (modified).
3.  **EVM Interpreter Hooks**: The points within the EVM execution loop where state is modified and thus where tracking should be triggered.
4.  **Structural Logging**: Geth's `StructLogger` is a concrete example of a system that consumes state change information to produce a detailed trace, similar to the reporting and history features requested.

Below are the most relevant code snippets to guide your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journalEntry is a modification entry in the state journal.
type journalEntry interface {
	// revert undoes the state change a journal entry represents.
	revert(db *StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied since the last state
// commit. These are tracked to be able to revert undesired changes.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// Append inserts a new modification entry to the end of the journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// revert undoes all modifications up-to a specific snapshot in the journal.
func (j *journal) revert(db *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the entry
		j.entries[i].revert(db)

		// Drop the dirty reference
		if addr := j.entries[i].dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}

// createObjectChange is a journal entry for recording a new account creation.
type createObjectChange struct {
	account *common.Address
}

func (ch createObjectChange) revert(db *StateDB) {
	delete(db.stateObjects, *ch.account)
	delete(db.stateObjectsDirty, *ch.account)
}

// selfDestructChange is a journal entry for recording a self-destruct operation.
type selfDestructChange struct {
	account  *common.Address
	prev     bool // Whether the account had already been suicided
	prevSui  bool // Whether the account was previously suicided in this tx
	prevData stateObject // The account's state before the self-destruct
}

func (ch selfDestructChange) revert(db *StateDB) {
	obj := db.getStateObject(*ch.account)
	if obj != nil {
		obj.suicided = ch.prev
		obj.data = ch.prevData.data
		obj.code = ch.prevData.code
		if !ch.prevSui {
			// Do not revert the touch status if the account was touched
			// more than once in this transaction.
			obj.touched = false
		}
	}
}

// balanceChange is a journal entry for recording a balance change.
type balanceChange struct {
	account *common.Address
	prev    *big.Int
}

func (ch balanceChange) revert(db *StateDB) {
	db.getStateObject(*ch.account).setBalance(ch.prev)
}

// nonceChange is a journal entry for recording a nonce change.
type nonceChange struct {

	account *common.Address
	prev    uint64
}

func (ch nonceChange) revert(db *StateDB) {
	db.getStateObject(*ch.account).setNonce(ch.prev)
}

// storageChange is a journal entry for recording a storage change.
type storageChange struct {
	account       *common.Address
	key, prevalue common.Hash
}

func (ch storageChange) revert(db *StateDB) {
	db.getStateObject(*ch.account).setState(ch.key, ch.prevalue)
}

// codeChange is a journal entry for recording a code change.
type codeChange struct {
	account            *common.Address
	prevCode, prevHash common.Hash
}

func (ch codeChange) revert(db *StateDB) {
	db.getStateObject(*ch.account).setCode(ch.prevHash, ch.prevCode.Bytes())
}

// addLogChange is a journal entry for recording an emitted log.
type addLogChange struct {
	txhash common.Hash
}

func (ch addLogChange) revert(db *StateDB) {
	logs := db.logs[ch.txhash]
	if len(logs) == 1 {
		delete(db.logs, ch.txhash)
	} else {
		db.logs[ch.txhash] = logs[:len(logs)-1]
	}
}

// addPreimageChange is a journal entry for recording a used preimage.
type addPreimageChange struct {
	hash common.Hash
}

func (ch addPreimageChange) revert(db *StateDB) {
	delete(db.preimages, ch.hash)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state. It is a concrete
// implementation of the State interface.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which will be written to the trie at the end of
	// the transaction. It is initialized with the objects that are touched in the
	// current block.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	dbErr error

	// Journal of state modifications. This is the backbone of
	// snapshot and revert support.
	journal *journal

	// The refund counter, also used by state transitioning.
	refund uint64

	logs    map[common.Hash][]*types.Log
	logSize uint
	...
}

// CreateAccount explicitly creates a state object. If a state object with the address
// already exists the balance is carried over to the new account.
//
// CreateAccount is called during the EVM CREATE operation. The situation might arise that
// a contract does not contain object code and subsequently gets called by zero-value
// CALL or SUICIDE. Before starting new instructions the BAL instruction is called
// and the account needs to exist for this precondition to pass.
func (s *StateDB) CreateAccount(addr common.Address) {
	newObj, prev := s.createObject(addr)
	if prev != nil {
		newObj.setBalance(prev.data.Balance)
	}
}

// Suicide marks the given account as suicided.
// This clears the account balance.
//
// The account's state object is still available until the state is committed,
// getStateObject will return a non-nil account after Suicide.
func (s *StateDB) Suicide(addr common.Address) bool {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return false
	}
	s.journal.append(selfDestructChange{
		account:  &addr,
		prev:     stateObject.suicided,
		prevSui:  stateObject.isSuicided(),
		prevData: stateObject.deepCopy(),
	})
	stateObject.suicided = true
	stateObject.setBalance(new(big.Int))

	return true
}


// The following methods modify the state of accounts in the StateDB.
func (s *StateDB) AddBalance(addr common.Address, amount *big.Int) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.AddBalance(amount)
	}
}
func (s *StateDB) SubBalance(addr common.Address, amount *big.Int) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SubBalance(amount)
	}
}
func (s *StateDB) SetBalance(addr common.Address, amount *big.Int) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetBalance(amount)
	}
}
func (s *StateDB) SetNonce(addr common.Address, nonce uint64) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetNonce(nonce)
	}
}
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetCode(crypto.Keccak256Hash(code), code)
	}
}
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetState(key, value)
	}
}

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	id := s.nextRevisionId
	s.nextRevisionId++
	s.validRevisions = append(s.validRevisions, revision{id, s.journal.length()})
	return id
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(s.validRevisions), func(i int) bool {
		return s.validRevisions[i].id >= revid
	})
	if idx == len(s.validRevisions) || s.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v cannot be reverted", revid))
	}
	snapshot := s.validRevisions[idx].journalIndex

	// Replay the journal to specified snapshot.
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
//  1. You can obtain a state object by calling StateDB.GetStateObject.
//  2. It will obtain an object from the cache or from the database.
//  3. You can use state object to query account properties and modify them.
//  4. When you're done with the object you have to call StateDB.updateStateObject
//     to commit your changes to the trie.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     Account
	db       *StateDB

	// DB error.
	// State objects are lazy loaded and thus might accumulate errors.
	dbErr error

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which gets set when code is loaded

	originStorage  Storage // Storage cache of original entries to dedup rewrites
	pendingStorage Storage // Storage entries that need to be flushed to disk
	dirtyStorage   Storage // Dirty storage entries that have been written to the trie

	// Cache flags.
	// When an object is marked suicided it will be removed from the trie
	// during the commit phase of the state transition.
	dirtyCode bool // true if the code was updated
	suicided  bool
	touched   bool
	deleted   bool
}

// SetBalance sets the balance of the state object.
func (s *stateObject) SetBalance(amount *big.Int) {
	s.db.journal.append(balanceChange{
		account: &s.address,
		prev:    new(big.Int).Set(s.data.Balance),
	})
	s.setBalance(amount)
}
func (s *stateObject) setBalance(amount *big.Int) {
	s.data.Balance = amount
}

// SetNonce sets the nonce of the state object.
func (s *stateObject) SetNonce(nonce uint64) {
	s.db.journal.append(nonceChange{
		account: &s.address,
		prev:    s.data.Nonce,
	})
	s.setNonce(nonce)
}
func (s *stateObject) setNonce(nonce uint64) {
	s.data.Nonce = nonce
}

// SetCode sets the code of the state object.
func (s *stateObject) SetCode(codeHash common.Hash, code []byte) {
	s.db.journal.append(codeChange{
		account:  &s.address,
		prevCode: s.Code(),
		prevHash: s.CodeHash(),
	})
	s.setCode(codeHash, code)
}
func (s *stateObject) setCode(codeHash common.Hash, code []byte) {
	s.code = code
	s.data.CodeHash = codeHash.Bytes()
	s.dirtyCode = true
}

// SetState updates a value in account storage.
func (s *stateObject) SetState(key, value common.Hash) {
	// If the new value is the same as old, don't set
	prev := s.GetState(key)
	if prev == value {
		return
	}
	// New value is different, update and journal the change
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: prev,
	})
	s.setState(key, value)
}

func (s *stateObject) setState(key, value common.Hash) {
	// If the entry is being deleted, remove from pending and dirty.
	if value == (common.Hash{}) {
		delete(s.pendingStorage, key)
	} else {
		// The value is being set, so it's a pending change.
		s.pendingStorage[key] = value
	}
	// The entry will be written to the trie, no matter what.
	s.dirtyStorage[key] = value
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// StructLogger is a EVM state logger and captures execution steps of the EVM
// into a structured format.
type StructLogger struct {
	cfg *Config

	storage map[common.Address]map[common.Hash]common.Hash
	logs    []*types.Log
	err     error

	gas         uint64
	gasUsed     uint64
	depth       int
	pc          uint64
	stack       []*big.Int
	memory      []byte
	memSize     int
	op          OpCode
	call        callCtx
	contract    *Contract
	statedb     *StateDB
	skip        bool
	reason      string
	interrupt   bool
	output      []byte
	reverted    bool
	precompiles []common.Address
}

// CaptureState is called for each step of the EVM execution. It saves the current
// state and tracks the changes in the state that are caused by the instruction.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ... (stack, memory capture logic omitted for brevity) ...

	// Capture the contract storage changes
	storage := make(map[common.Hash]common.Hash)
	if l.cfg.EnableStorage {
		// It's a bit of an overkill to copy the storage on every step, but it's
		// the simplest way to demonstrate the storage changes.
		l.statedb.ForEachStorage(l.contract.Address(), func(key, value common.Hash) bool {
			if _, ok := l.storage[l.contract.Address()][key]; !ok {
				l.storage[l.contract.Address()][key] = value
			}
			storage[key] = value
			return true
		})
	}
	// That's it, we're done.
	l.gas = gas
	l.gasUsed = cost
	l.err = err
	l.op = op
	l.pc = pc
	l.depth = depth
	l.skip = false // It's a new state, don't skip it
	l.reason = ""
}

// CaptureFault is invoked when an execution faults.
func (l *StructLogger) CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error) {
	l.CaptureState(pc, op, gas, cost, scope, nil, depth, err)
}

// StructLog is a structured log message captures a single EVM instruction
// execution step.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            string                      `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []string                    `json:"memory,omitempty"`
	MemorySize    int                         `json:"memSize"`
	Stack         []string                    `json:"stack,omitempty"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           string                      `json:"error,omitempty"`
	OpName        string                      `json:"opName"` // Added for backwards-compatibility reasons
	ErrorString   string                      `json:"errorString,omitempty"`
}
```
</file>

## Prompt Corrections

Your prompt is exceptionally well-structured and provides a clear specification for the desired Zig implementation. There are no major errors. However, based on the Go-Ethereum implementation, here are a few suggestions for refinement:

1.  **Journaling Pattern**: The prompt's design has the `AccountStatusManager` as a central registry. Go-Ethereum's pattern of a `journal` that lives within the state management object (`StateDB`) is very effective. It naturally ties state changes to transaction lifecycle (commit/revert). You might consider a similar pattern where your `AccountStatusManager` is owned by the `State` struct and its history/events are managed in "snapshots" that correspond to call frames, just like Geth's journal.

2.  **Distinguishing `Modified` vs. `TypeChanged`**: In your `StatusChangeType` enum, you have `Modified` and `TypeChanged`. In practice, a type change (e.g., EOA to Contract) is just a specific kind of modification (the `code_hash` changes from empty to non-empty). You could model `TypeChanged` as a `LifecycleEvent` that is triggered during the `track_account_modification` flow, rather than a separate top-level status change type. This simplifies the top-level tracking.

3.  **`AccountState` Enum**: The `AccountState` enum in your prompt (`Unknown`, `Active`, `Empty`, `Deleted`, `Suspended`) is a great high-level abstraction. In Geth, this is determined implicitly:
    *   `Active`: `nonce > 0 || balance > 0 || codehash != empty`
    *   `Empty`: The inverse of Active.
    *   `Deleted`: `stateObject.suicided == true`
    *   `Unknown/Suspended` are not explicit states in Geth's core logic but could be useful for your higher-level system. It's a good design, but be aware that the core EVM only cares about existence and the "suicided" flag.

4.  **`track_account_modification` Context**: The `ModificationType` enum is a good idea. Geth's journal provides even more detail. For example, a balance change could be from a `CALL`, a `SELFDESTRUCT` refund, or a block reward. If you want comprehensive tracking, you might expand your `ModificationContext` to include the source of the change (e.g., which opcode or protocol action). The Geth `journalEntry` types (`balanceChange`, `selfDestructChange`, etc.) are a good model for this.

These are minor suggestions on a very strong prompt. The provided Go-Ethereum snippets should offer a robust, battle-tested architectural pattern for implementing your vision.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB structs within the ethereum protocol are used to store anything
// within the merkle trie. StateDBs take care of caching and storing
// nested states. It's the general query interface to retrieve:
//
// * Contracts
// * Accounts
type StateDB struct {
	db         Database
	prefetcher *triePrefetcher
	trie       Trie
	reader     Reader

	// originalRoot is the pre-state root, before any changes were made.
	// It will be updated when the Commit is called.
	originalRoot common.Hash

	// This map holds 'live' objects, which will get modified while
	// processing a state transition.
	stateObjects map[common.Address]*stateObject

	// This map holds 'deleted' objects. An object with the same address
	// might also occur in the 'stateObjects' map due to account
	// resurrection. The account value is tracked as the original value
	// before the transition. This map is populated at the transaction
	// boundaries.
	stateObjectsDestruct map[common.Address]*stateObject

	// This map tracks the account mutations that occurred during the
	// transition. Uncommitted mutations belonging to the same account
	// can be merged into a single one which is equivalent from database's
	// perspective. This map is populated at the transaction boundaries.
	mutations map[common.Address]*mutation

	// DB error.
	// State objects are used by the consensus core and VM which are
	// unable to deal with database-level errors. Any error that occurs
	// during a database read is memoized here and will eventually be
	// returned by StateDB.Commit. Notably, this error is also shared
	// by all cached state objects in case the database failure occurs
	// when accessing state of accounts.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	// The tx context and all occurred logs in the scope of transaction.
	thash   common.Hash
	txIndex int
	logs    map[common.Hash][]*types.Log
	logSize uint

	// Preimages occurred seen by VM in the scope of block.
	preimages map[common.Hash][]byte

	// Per-transaction access list
	accessList   *accessList
	accessEvents *AccessEvents

	// Transient storage
	transientStorage transientStorage

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
	journal *journal
	// ...
}

// CreateAccount explicitly creates a new state object, assuming that the
// account did not previously exist in the state. If the account already
// exists, this function will silently overwrite it which might lead to a
// consensus bug eventually.
func (s *StateDB) CreateAccount(addr common.Address) {
	s.createObject(addr)
}

// createObject creates a new state object. The assumption is held there is no
// existing account with the given address, otherwise it will be silently overwritten.
func (s *StateDB) createObject(addr common.Address) *stateObject {
	obj := newObject(s, addr, nil)
	s.journal.createObject(addr)
	s.setStateObject(obj)
	return obj
}

// SelfDestruct marks the given account as selfdestructed.
// This clears the account balance.
//
// The account's state object is still available until the state is committed,
// getStateObject will return a non-nil account after SelfDestruct.
func (s *StateDB) SelfDestruct(addr common.Address) uint256.Int {
	stateObject := s.getStateObject(addr)
	var prevBalance uint256.Int
	if stateObject == nil {
		return prevBalance
	}
	prevBalance = *(stateObject.Balance())
	// Regardless of whether it is already destructed or not, we do have to
	// journal the balance-change, if we set it to zero here.
	if !stateObject.Balance().IsZero() {
		stateObject.SetBalance(new(uint256.Int))
	}
	// If it is already marked as self-destructed, we do not need to add it
	// for journalling a second time.
	if !stateObject.selfDestructed {
		s.journal.destruct(addr)
		stateObject.markSelfdestructed()
	}
	return prevBalance
}

// AddBalance adds amount to the account associated with addr.
func (s *StateDB) AddBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) uint256.Int {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject == nil {
		return uint256.Int{}
	}
	return stateObject.AddBalance(amount)
}

// SubBalance subtracts amount from the account associated with addr.
func (s *StateDB) SubBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) uint256.Int {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject == nil {
		return uint256.Int{}
	}
	if amount.IsZero() {
		return *(stateObject.Balance())
	}
	return stateObject.SetBalance(new(uint256.Int).Sub(stateObject.Balance(), amount))
}

func (s *StateDB) SetBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetBalance(amount)
	}
}

func (s *StateDB) SetNonce(addr common.Address, nonce uint64, reason tracing.NonceChangeReason) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetNonce(nonce)
	}
}

func (s *StateDB) SetCode(addr common.Address, code []byte) (prev []byte) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject != nil {
		return stateObject.SetCode(crypto.Keccak256Hash(code), code)
	}
	return nil
}

func (s *StateDB) SetState(addr common.Address, key, value common.Hash) common.Hash {
	if stateObject := s.getOrNewStateObject(addr); stateObject != nil {
		return stateObject.SetState(key, value)
	}
	return common.Hash{}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb_hooked.go">
```go
// hookedStateDB represents a statedb which emits calls to tracing-hooks
// on state operations.
type hookedStateDB struct {
	inner *StateDB
	hooks *tracing.Hooks
}

// NewHookedState wraps the given stateDb with the given hooks
func NewHookedState(stateDb *StateDB, hooks *tracing.Hooks) *hookedStateDB {
	s := &hookedStateDB{stateDb, hooks}
	if s.hooks == nil {
		s.hooks = new(tracing.Hooks)
	}
	return s
}

func (s *hookedStateDB) SubBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) uint256.Int {
	prev := s.inner.SubBalance(addr, amount, reason)
	if s.hooks.OnBalanceChange != nil && !amount.IsZero() {
		newBalance := new(uint256.Int).Sub(&prev, amount)
		s.hooks.OnBalanceChange(addr, prev.ToBig(), newBalance.ToBig(), reason)
	}
	return prev
}

func (s *hookedStateDB) AddBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) uint256.Int {
	prev := s.inner.AddBalance(addr, amount, reason)
	if s.hooks.OnBalanceChange != nil && !amount.IsZero() {
		newBalance := new(uint256.Int).Add(&prev, amount)
		s.hooks.OnBalanceChange(addr, prev.ToBig(), newBalance.ToBig(), reason)
	}
	return prev
}

func (s *hookedStateDB) SetNonce(address common.Address, nonce uint64, reason tracing.NonceChangeReason) {
	prev := s.inner.GetNonce(address)
	s.inner.SetNonce(address, nonce, reason)
	if s.hooks.OnNonceChangeV2 != nil {
		s.hooks.OnNonceChangeV2(address, prev, nonce, reason)
	} else if s.hooks.OnNonceChange != nil {
		s.hooks.OnNonceChange(address, prev, nonce)
	}
}

func (s *hookedStateDB) SetCode(address common.Address, code []byte) []byte {
	prev := s.inner.SetCode(address, code)
	if s.hooks.OnCodeChange != nil {
		prevHash := types.EmptyCodeHash
		if len(prev) != 0 {
			prevHash = crypto.Keccak256Hash(prev)
		}
		s.hooks.OnCodeChange(address, prevHash, prev, crypto.Keccak256Hash(code), code)
	}
	return prev
}

func (s *hookedStateDB) SetState(address common.Address, key common.Hash, value common.Hash) common.Hash {
	prev := s.inner.SetState(address, key, value)
	if s.hooks.OnStorageChange != nil && prev != value {
		s.hooks.OnStorageChange(address, key, prev, value)
	}
	return prev
}

func (s *hookedStateDB) SelfDestruct(address common.Address) uint256.Int {
	var prevCode []byte
	var prevCodeHash common.Hash

	if s.hooks.OnCodeChange != nil {
		prevCode = s.inner.GetCode(address)
		prevCodeHash = s.inner.GetCodeHash(address)
	}

	prev := s.inner.SelfDestruct(address)

	if s.hooks.OnBalanceChange != nil && !prev.IsZero() {
		s.hooks.OnBalanceChange(address, prev.ToBig(), new(big.Int), tracing.BalanceDecreaseSelfdestruct)
	}

	if s.hooks.OnCodeChange != nil && len(prevCode) > 0 {
		s.hooks.OnCodeChange(address, prevCodeHash, prevCode, types.EmptyCodeHash, nil)
	}

	return prev
}

func (s *hookedStateDB) AddLog(log *types.Log) {
	// The inner will modify the log (add fields), so invoke that first
	s.inner.AddLog(log)
	if s.hooks.OnLog != nil {
		s.hooks.OnLog(log)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journalEntry is a modification entry in the state change journal that can be
// reverted on demand.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the Ethereum address modified by this journal entry.
	dirtied() *common.Address

	// copy returns a deep-copied journal entry.
	copy() journalEntry
}

// journal contains the list of state modifications applied since the last state
// commit. These are tracked to be able to be reverted in the case of an execution
// exception or request for reversal.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes

	validRevisions []revision
	nextRevisionId int
}

type (
	// Changes to the account trie.
	createObjectChange struct {
		account common.Address
	}
	// createContractChange represents an account becoming a contract-account.
	// This event happens prior to executing initcode. The journal-event simply
	// manages the created-flag, in order to allow same-tx destruction.
	createContractChange struct {
		account common.Address
	}
	selfDestructChange struct {
		account common.Address
	}

	// Changes to individual accounts.
	balanceChange struct {
		account common.Address
		prev    *uint256.Int
	}
	nonceChange struct {
		account common.Address
		prev    uint64
	}
	storageChange struct {
		account   common.Address
		key       common.Hash
		prevvalue common.Hash
		origvalue common.Hash
	}
	codeChange struct {
		account  common.Address
		prevCode []byte
	}

	// Changes to other state values.
	refundChange struct {
		prev uint64
	}
	addLogChange struct {
		txhash common.Hash
	}
	touchChange struct {
		account common.Address
	}

	// Changes to the access list
	accessListAddAccountChange struct {
		address common.Address
	}
	accessListAddSlotChange struct {
		address common.Address
		slot    common.Hash
	}

	// Changes to transient storage
	transientStorageChange struct {
		account       common.Address
		key, prevalue common.Hash
	}
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// - First you need to obtain a state object.
// - Account values as well as storages can be accessed and modified through the object.
// - Finally, call commit to return the changes of storage trie and update account data.
type stateObject struct {
	db       *StateDB
	address  common.Address      // address of ethereum account
	addrHash common.Hash         // hash of ethereum address of the account
	origin   *types.StateAccount // Account original data without any change applied, nil means it was not existent
	data     types.StateAccount  // Account data with all mutations applied in the scope of block

	// Write caches.
	trie Trie   // storage trie, which becomes non-nil on first access
	code []byte // contract bytecode, which gets set when code is loaded

	originStorage  Storage // Storage entries that have been accessed within the current block
	dirtyStorage   Storage // Storage entries that have been modified within the current transaction
	pendingStorage Storage // Storage entries that have been modified within the current block

	// uncommittedStorage tracks a set of storage entries that have been modified
	// but not yet committed since the "last commit operation", along with their
	// original values before mutation.
	uncommittedStorage Storage

	// Cache flags.
	dirtyCode bool // true if the code was updated

	// Flag whether the account was marked as self-destructed. The self-destructed
	// account is still accessible in the scope of same transaction.
	selfDestructed bool

	// This is an EIP-6780 flag indicating whether the object is eligible for
	// self-destruct according to EIP-6780. The flag could be set either when
	// the contract is just created within the current transaction, or when the
	// object was previously existent and is being deployed as a contract within
	// the current transaction.
	newContract bool
}

// SetState updates a value in account storage.
// It returns the previous value
func (s *stateObject) SetState(key, value common.Hash) common.Hash {
	// If the new value is the same as old, don't set. Otherwise, track only the
	// dirty changes, supporting reverting all of it back to no change.
	prev, origin := s.getState(key)
	if prev == value {
		return prev
	}
	// New value is different, update and journal the change
	s.db.journal.storageChange(s.address, key, prev, origin)
	s.setState(key, value, origin)
	return prev
}

// AddBalance adds amount to s's balance.
// It is used to add funds to the destination account of a transfer.
// returns the previous balance
func (s *stateObject) AddBalance(amount *uint256.Int) uint256.Int {
	// EIP161: We must check emptiness for the objects such that the account
	// clearing (0,0,0 objects) can take effect.
	if amount.IsZero() {
		if s.empty() {
			s.touch()
		}
		return *(s.Balance())
	}
	return s.SetBalance(new(uint256.Int).Add(s.Balance(), amount))
}

// SetBalance sets the balance for the object, and returns the previous balance.
func (s *stateObject) SetBalance(amount *uint256.Int) uint256.Int {
	prev := *s.data.Balance
	s.db.journal.balanceChange(s.address, s.data.Balance)
	s.setBalance(amount)
	return prev
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opSstore(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.readOnly {
		return nil, ErrWriteProtection
	}
	loc := scope.Stack.pop()
	val := scope.Stack.pop()
	interpreter.evm.StateDB.SetState(scope.Contract.Address(), loc.Bytes32(), val.Bytes32())
	return nil, nil
}

func opSload(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	loc := scope.Stack.peek()
	hash := common.Hash(loc.Bytes32())
	val := interpreter.evm.StateDB.GetState(scope.Contract.Address(), hash)
	loc.SetBytes(val.Bytes())
	return nil, nil
}

func opCreate(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.readOnly {
		return nil, ErrWriteProtection
	}
	var (
		value        = scope.Stack.pop()
		offset, size = scope.Stack.pop(), scope.Stack.pop()
		input        = scope.Memory.GetCopy(offset.Uint64(), size.Uint64())
		gas          = scope.Contract.Gas
	)
	if interpreter.evm.chainRules.IsEIP150 {
		gas -= gas / 64
	}

	// reuse size int for stackvalue
	stackvalue := size

	scope.Contract.UseGas(gas, interpreter.evm.Config.Tracer, tracing.GasChangeCallContractCreation)

	res, addr, returnGas, suberr := interpreter.evm.Create(scope.Contract.Address(), input, gas, &value)
	// ...
	scope.Stack.push(&stackvalue)
	scope.Contract.RefundGas(returnGas, interpreter.evm.Config.Tracer, tracing.GasChangeCallLeftOverRefunded)

	if suberr == ErrExecutionReverted {
		interpreter.returnData = res // set REVERT data to return data buffer
		return res, nil
	}
	interpreter.returnData = nil // clear dirty return data buffer
	return nil, nil
}

func opSelfdestruct(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.readOnly {
		return nil, ErrWriteProtection
	}
	beneficiary := scope.Stack.pop()
	balance := interpreter.evm.StateDB.GetBalance(scope.Contract.Address())
	interpreter.evm.StateDB.AddBalance(beneficiary.Bytes20(), balance, tracing.BalanceIncreaseSelfdestruct)
	interpreter.evm.StateDB.SelfDestruct(scope.Contract.Address())
	if tracer := interpreter.evm.Config.Tracer; tracer != nil {
		if tracer.OnEnter != nil {
			tracer.OnEnter(interpreter.evm.depth, byte(SELFDESTRUCT), scope.Contract.Address(), beneficiary.Bytes20(), []byte{}, 0, balance.ToBig())
		}
		if tracer.OnExit != nil {
			tracer.OnExit(interpreter.evm.depth, []byte{}, 0, nil, false)
		}
	}
	return nil, errStopToken
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/core/state/access_list.go">
```go
type accessList struct {
	addresses map[common.Address]int
	slots     []map[common.Hash]struct{}
}

// AddAddress adds an address to the access list, and returns 'true' if the operation
// caused a change (addr was not previously in the list).
func (al *accessList) AddAddress(address common.Address) bool {
	if _, present := al.addresses[address]; present {
		return false
	}
	al.addresses[address] = -1
	return true
}

// AddSlot adds the specified (addr, slot) combo to the access list.
// Return values are:
// - address added
// - slot added
// For any 'true' value returned, a corresponding journal entry must be made.
func (al *accessList) AddSlot(address common.Address, slot common.Hash) (addrChange bool, slotChange bool) {
	idx, addrPresent := al.addresses[address]
	if !addrPresent || idx == -1 {
		// Address not present, or addr present but no slots there
		al.addresses[address] = len(al.slots)
		slotmap := map[common.Hash]struct{}{slot: {}}
		al.slots = append(al.slots, slotmap)
		return !addrPresent, true
	}
	// There is already an (address,slot) mapping
	slotmap := al.slots[idx]
	if _, ok := slotmap[slot]; !ok {
		slotmap[slot] = struct{}{}
		// Journal add slot change
		return false, true
	}
	// No changes required
	return false, false
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt's data structures are very comprehensive, almost resembling a full-fledged APM (Application Performance Monitoring) tool for EVM accounts. While this is a great goal, go-ethereum's implementation is much simpler and more integrated into its core state management.

1.  **State History vs. Journaling**: The prompt envisions detailed historical tracking (`BalanceHistory`, `NonceHistory`, `CodeChangeHistory`). Go-ethereum's `StateDB` does not maintain this kind of long-term history for individual accounts. Instead, it uses a `journal` (`core/state/journal.go`) to track changes *within a single transaction*. This journal's primary purpose is to enable reverts (rolling back changes if a transaction fails). The `journalEntry` enum is an excellent reference for the types of discrete changes that could be tracked in the requested `LifecycleEvent` system. For a persistent history, one would typically rely on an external system that consumes events, rather than storing it directly in the EVM's state database.

2.  **Status Listeners vs. Tracers**: The prompt's concept of `StatusListener` is implemented in go-ethereum via `vm.Tracer` and more specifically, the `statedb_hooked.go` pattern. Instead of a list of callbacks, Geth allows a single `Tracer` to be attached to the `EVM` config. This tracer has hook methods (e.g., `OnBalanceChange`, `OnCodeChange`) that are called when state modifications occur. The `hookedStateDB` is a `StateDB` wrapper that emits these calls. This is a more direct and efficient way to achieve the same goal as the proposed listener system. I've included the `statedb_hooked.go` file as it provides a perfect template for this functionality.

3.  **Access Pattern Tracking**: The prompt specifies `StorageActivityTracker` and `AccessPatternTracker`. A direct and highly relevant parallel in go-ethereum is the `AccessList` (`core/state/access_list.go`), introduced in EIP-2929 (Berlin hardfork). It tracks which accounts and storage slots have been "touched" (accessed) within a transaction to implement "warm" vs. "cold" access gas pricing. This is a perfect starting point for implementing the requested storage access tracking features.

By studying `journal.go` for change tracking, `statedb_hooked.go` for an event/listener pattern, and `access_list.go` for access tracking, the developer will have a solid foundation based on a production-grade EVM implementation to build the requested features.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journalEntry is a modification entry in the state journal.
type journalEntry interface {
	revert(db *StateDB)
	// dirtied returns the address of the account that was modified. In case of
	// a create or selfdestruct, it may be nil.
	dirtied() *common.Address
}

// Journal is a log of state changes. It is used to revert changes that
// are made to the state.
type Journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// createObjectChange appears in the journal when a new account is created.
type createObjectChange struct {
	account *common.Address
}

// resetObjectChange appears in the journal when an account is reset to its
// pristine state.
type resetObjectChange struct {
	prev *stateObject
}

// suicideChange appears in the journal when an account self-destructs.
type suicideChange struct {
	account     *common.Address
	prev        bool // whether account had already been suicided
	prevBalance *uint256.Int
}

// balanceChange appears in the journal when the balance of an account is changed.
type balanceChange struct {
	account     *common.Address
	prev        *uint256.Int
	prevBalance *uint256.Int
}

// nonceChange appears in the journal when the nonce of an account is changed.
type nonceChange struct {
	account *common.Address
	prev    uint64
}

// storageChange appears in the journal when a storage value is changed.
type storageChange struct {
	account       *common.Address
	key, prevalue common.Hash
}

// codeChange appears in the journal when the code of an account is changed.
type codeChange struct {
	account            *common.Address
	prevcode, prevhash []byte
}

// addLogChange appears in the journal when a log is added.
type addLogChange struct {
	txhash common.Hash
}

// addPreimageChange appears in the journal when a new preimage is added.
type addPreimageChange struct {
	hash common.Hash
}

// touchChange appears in the journal when an account is touched by a transaction.
type touchChange struct {
	account *common.Address
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.StateAccount
	db       *StateDB

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which gets stored when setting code

	originStorage Storage // Storage cache of original entries to dedup rewrites, updated only by first touch.
	dirtyStorage  Storage // Storage entries that have been modified in the current transaction.

	// Caching flags.
	// When an object is marked suicided it will be delete from the trie
	// during the commit pass and whatever number of balance it has will be returned
	// to the suicide beneficiary.
	suicided bool
	deleted  bool
}

// SetNonce sets the nonce of the account.
func (s *stateObject) SetNonce(nonce uint64) {
	s.db.journal.append(nonceChange{
		account: &s.address,
		prev:    s.data.Nonce,
	})
	s.setNonce(nonce)
}

// SetBalance sets the balance of the account.
func (s *stateObject) SetBalance(amount *uint256.Int) {
	s.db.journal.append(balanceChange{
		account: &s.address,
		prev:    new(uint256.Int).Set(s.data.Balance),
	})
	s.setBalance(amount)
}

// SetCode sets the code of the account.
func (s *stateObject) SetCode(codeHash common.Hash, code []byte) {
	s.db.journal.append(codeChange{
		account:  &s.address,
		prevhash: s.CodeHash(),
		prevcode: s.Code(s.db.db),
	})
	s.setCode(codeHash, code)
}

// SetState updates a value in account storage.
func (s *stateObject) SetState(key, value common.Hash) {
	// If the new value is the same as old, don't set
	prev := s.GetState(key)
	if prev == value {
		return
	}
	// New value is different, update and journal the change
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: prev,
	})
	s.setState(key, value)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state. It is a concrete
// implementation of the state.Database interface.
type StateDB struct {
	db   TrieBackend
	trie Trie

	// This map holds 'live' objects, which will get modified while processing a
	// state transition.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// snapshot and revert handling.
	journal        *Journal
	validRevisions []Revision
	nextRevisionId int
    // ...
}


// createObject creates a new state object. If there is an existing account with
// the given address, it is overwritten and returned as the second return value.
func (s *StateDB) createObject(addr common.Address) (newobj, prev *stateObject) {
	prev = s.getStateObject(addr)

	newobj = newObject(s, addr, types.StateAccount{})
	newobj.setNonce(0) // sets the object to dirty
	if prev == nil {
		s.journal.append(createObjectChange{account: &addr})
	} else {
		s.journal.append(resetObjectChange{prev: prev})
	}
	s.setStateObject(newobj)
	return newobj, prev
}

// Suicide marks the given account as suicided.
// This clears the account balance.
func (s *StateDB) Suicide(addr common.Address) bool {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return false
	}
	s.journal.append(suicideChange{
		account:     &addr,
		prev:        stateObject.suicided,
		prevBalance: new(uint256.Int).Set(stateObject.data.Balance),
	})
	stateObject.suicided = true
	stateObject.setBalance(new(uint256.Int))

	return true
}

// AddLog adds a log to the current transaction's log set.
func (s *StateDB) AddLog(log *types.Log) {
	s.journal.append(addLogChange{txhash: s.thash})

	log.TxHash = s.thash
	log.TxIndex = uint(s.txIndex)
	log.Index = s.logSize
	s.logs[s.thash] = append(s.logs[s.thash], log)
	s.logSize++
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLogger is a EVM state logger and implements Tracer.
type StructLogger struct {
	// these fields are set by the tracer and used by the hooks
	cfg             *Config
	env             *vm.EVM
	storage         map[common.Address]map[common.Hash]common.Hash
	logs            []StructLog
	err             error
	gasLimit        uint64
	output          []byte
	currentRevision int
	journal         *state.Journal // a snapshot of the journal, to see which accounts are dirty

	// these fields are set by the hooks and used by the tracer
	reason      error
	interrupt   atomic.Bool // Atomic bool to signal execution interruption
	started     time.Time   // The time when the logger was started
	mu          sync.Mutex
	txLogs      []*types.Log // Appended by opLOG, but only committed if tx succeeds
	statedb     *state.StateDB
	memory      *vm.Memory
	stack       *vm.Stack
	callStack   []*call
	ret         []byte // Hold the return value of sub-call
	pc          uint64
	gas         uint64
	op          vm.OpCode
	depth       int
	deferred    []func()
	next        TracerHooks
}

// StructLog is a structured log message used by the logger and logs various
// information about the state of the EVM at a given time.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            vm.OpCode                   `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*big.Int                  `json:"stack"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"-"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
	OpName        string                      `json:"opName"`
	ErrorString   string                      `json:"error,omitempty"`
}

// CaptureStart is called at the very start of the EVM execution.
func (l *StructLogger) CaptureStart(env *vm.EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
    // ...
}

// CaptureState is called after each opcode execution.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
    // ...
}

// CaptureFault is called when an error occurs during the execution of an opcode.
func (l *StructLogger) CaptureFault(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, depth int, err error) {
    // ...
}

// CaptureEnd is called at the end of the EVM execution.
func (l *StructLogger) CaptureEnd(output []byte, gasUsed uint64, err error) {
    // ...
}

// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
func (l *StructLogger) CaptureEnter(typ vm.OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
    // ...
}

// CaptureExit is called when the EVM exits a scope, returning the results.
func (l *StructLogger) CaptureExit(output []byte, gasUsed uint64, err error) {
    // ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiles.go">
```go
// PrecompiledContractsBerlin contains the default precompiled contracts for
// the Berlin fork.
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

// PrecompiledContractsCancun contains the default precompiled contracts for
// the Cancun fork.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}):  &ecrecover{},
	common.BytesToAddress([]byte{2}):  &sha256hash{},
	common.BytesToAddress([]byte{3}):  &ripemd160hash{},
	common.BytesToAddress([]byte{4}):  &dataCopy{},
	common.BytesToAddress([]byte{5}):  &bigModExp{},
	common.BytesToAddress([]byte{6}):  &bn256Add{},
	common.BytesToAddress([]byte{7}):  &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}):  &bn256Pairing{},
	common.BytesToAddress([]byte{9}):  &blake2F{},
	common.BytesToAddress([]byte{10}): &pointEvaluation{}, // EIP-4844
}

// ActivePrecompiledContracts returns the precompiled contracts active in the
// given chain configuration.
func ActivePrecompiledContracts(rules params.Rules) []common.Address {
	// Determine which precompiles are active
	var precompiles []common.Address
	switch {
	case rules.IsCancun:
		precompiles = maps.Keys(PrecompiledContractsCancun)
	case rules.IsIstanbul:
		precompiles = maps.Keys(PrecompiledContractsBerlin) // Berlin added no precompiles
	case rules.IsByzantium:
		precompiles = maps.Keys(PrecompiledContractsByzantium)
	default:
		precompiles = maps.Keys(PrecompiledContractsHomestead)
	}
	// Sort the addresses for determinism
	slices.SortFunc(precompiles, func(a, b common.Address) int {
		return bytes.Compare(a[:], b[:])
	})
	return precompiles
}
```
</file>
</go-ethereum>

---

An excellent and detailed prompt. Implementing a robust account status tracking system requires hooking into the core state management logic of the EVM. Go-ethereum's `StateDB` and its journaling system provide a perfect architectural reference for this task. The `StateDB` is responsible for all state modifications, and its internal `journal` is designed to capture every single change for potential reversion, making it the ideal place to observe the "before" and "after" state of accounts.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// core/state/statedb.go

// StateDB is an EVM database for full state processing.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which are guaranteed to be up-to-date.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are managed by memory, and delayed writing to disk.
	// So if any error happens, it will be returned here.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// snapshot and revert support.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// Measurements gathered during execution for debugging purposes
	AccountReads            time.Duration
	AccountUpdates          time.Duration
	AccountHashes           time.Duration
	StorageReads            time.Duration
	StorageUpdates          time.Duration
	StorageHashes           time.Duration
	TrieReads               time.Duration
	TrieUpdates             time.Duration
	TrieCommits             time.Duration
	SnapshotAccountReads    time.Duration
	SnapshotStorageReads    time.Duration
	SnapshotCommits         time.Duration
	AccountUpdated          int
	StorageUpdated          int
	GuaranteedBroadcastHook func()
}

// CreateAccount explicitly creates a state object. If a state object with the address
// already exists the balance is carried over to the new account.
//
// CreateAccount is called for four situations:
// 1. When contracting calling CREATE.
// 2. When contracting calling CREATE2.
// 3. When executing a transaction associated with a create contract.
// 4. When EVM creates accounts for transfer with value.
func (s *StateDB) CreateAccount(addr common.Address) {
	newobj, prevobj := s.createObject(addr)
	if prevobj != nil {
		newobj.setBalance(prevobj.data.Balance)
	}
}

// createObject creates a new state object. If there is an existing account with
// the given address, it is overwritten and returned as the second return value.
func (s *StateDB) createObject(addr common.Address) (newobj, prevobj *stateObject) {
	prevobj = s.getStateObject(addr)

	newobj = newObject(s, addr, state.Account{})
	newobj.setNonce(0) // Clear the nonce of the new account
	s.setStateObject(newobj)
	if prevobj == nil {
		s.journal.append(createObjectChange{account: &addr})
	} else {
		s.journal.append(resetObjectChange{prev: prevobj})
	}
	return newobj, prevobj
}

// AddBalance adds amount to the account associated with addr.
func (s *StateDB) AddBalance(addr common.Address, amount *big.Int) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.AddBalance(amount)
	}
}

// SubBalance subtracts amount from the account associated with addr.
func (s *StateDB) SubBalance(addr common.Address, amount *big.Int) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SubBalance(amount)
	}
}

// SetBalance sets the balance of the account associated with addr.
func (s *StateDB) SetBalance(addr common.Address, amount *big.Int) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetBalance(amount)
	}
}

// SetNonce sets the nonce of the account associated with addr.
func (s *StateDB) SetNonce(addr common.Address, nonce uint64) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetNonce(nonce)
	}
}

// SetCode sets the code of the account associated with addr.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetCode(crypto.Keccak256Hash(code), code)
	}
}

// SetState sets the storage value for the account associated with addr.
func (s *StateDB) SetState(addr common.Address, key common.Hash, value common.Hash) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetState(s.db, key, value)
	}
}

// Suicide marks the given account as suicided.
// This clears the account balance.
//
// The account's state object is still available until the state is committed,
// getBalance returns zero for suicided accounts.
func (s *StateDB) Suicide(addr common.Address) bool {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return false
	}
	s.journal.append(suicideChange{
		account:  &addr,
		prev:     stateObject.suicided,
		prevData: stateObject.data,
	})
	stateObject.markSuicided()
	stateObject.data.Balance = new(big.Int)

	return true
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// core/state/journal.go

// journalEntry is a modification entry in the state journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirties returns the address that is changed by this journal entry.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied since the last state
// commit. These are used to reverse computation states during transaction execution
// and also to track dirty addresses to write out to disk.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// append inserts a new modification entry to the end of the journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// The following types are the concrete journalEntry types.

type createObjectChange struct {
	account *common.Address
}

type resetObjectChange struct {
	prev *stateObject
}

type suicideChange struct {
	account  *common.Address
	prev     bool // whether account had already been suicided
	prevData state.Account
}

type balanceChange struct {
	account *common.Address
	prev    *big.Int
}

type nonceChange struct {
	account *common.Address
	prev    uint64
}

type storageChange struct {
	account       *common.Address
	key, prevalue common.Hash
}

type codeChange struct {
	account            *common.Address
	prevcode, prevhash common.Hash
}

type refundChange struct {
	prev uint64
}

type addLogChange struct {
	txhash common.Hash
}

type addPreimageChange struct {
	hash common.Hash
}

type touchChange struct {
	account *common.Address
	prev    bool
	prevOld bool
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// core/state/state_object.go

// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
//
// 1. You need to obtain a state object.
// 2. You may modify fields in the state object.
// 3. When you're done, write the changes back to the state db.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     state.Account
	db       *StateDB

	// DB error.
	// State objects are managed by memory, and delayed writing to disk.
	// So if any error happens, it will be returned here.
	dbErr error

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which becomes non-nil on first access

	originStorage state.Storage // Storage cache of original entries to dedup rewrites, updated only at first load
	dirtyStorage  state.Storage // Storage entries that have been modified in the current transaction execution

	// Cache flags.
	// When an object is marked suicided it will be delete from the trie
	// during the commit phase of the state transition.
	dirtyCode bool // true if the code was updated
	suicided  bool
	deleted   bool
}

// empty returns whether the account is considered empty.
func (s *stateObject) empty() bool {
	return s.data.Nonce == 0 && s.data.Balance.Sign() == 0 && bytes.Equal(s.data.CodeHash, types.EmptyCodeHash.Bytes())
}

// SetBalance sets the balance of the account.
func (s *stateObject) SetBalance(amount *big.Int) {
	s.db.journal.append(balanceChange{
		account: &s.address,
		prev:    new(big.Int).Set(s.data.Balance),
	})
	s.setBalance(amount)
}

func (s *stateObject) setBalance(amount *big.Int) {
	s.data.Balance = amount
}

// SetNonce sets the nonce of the account.
func (s *stateObject) SetNonce(nonce uint64) {
	s.db.journal.append(nonceChange{
		account: &s.address,
		prev:    s.data.Nonce,
	})
	s.setNonce(nonce)
}

func (s *stateObject) setNonce(nonce uint64) {
	s.data.Nonce = nonce
}

// SetCode sets the code of the account.
func (s *stateObject) SetCode(codeHash common.Hash, code []byte) {
	s.db.journal.append(codeChange{
		account:  &s.address,
		prevhash: s.CodeHash(),
		prevcode: s.Code(s.db.db),
	})
	s.setCode(codeHash, code)
}

// SetState updates a value in account storage.
func (s *stateObject) SetState(db Database, key, value common.Hash) {
	// If the new value is the same as old, don't set
	prev := s.GetState(db, key)
	if prev == value {
		return
	}
	// New value is different, update and journal the change
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: prev,
	})
	s.setState(key, value)
}

// Suicide marks the account as suicided.
// This clears the account balance.
func (s *stateObject) Suicide(db Database) bool {
	if s.suicided {
		return false
	}
	s.db.journal.append(suicideChange{
		account:  &s.address,
		prev:     s.suicided,
		prevData: s.data,
	})
	s.suicided = true
	s.data.Balance = new(big.Int)

	return true
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// core/vm/logger.go

// EVMLogger is used to collect execution traces from the EVM.
//
// The EVMLogger is a fine-grained logger which is triggered on each new opcode
// and provides context for the operation, the EVM's internal state which are
// the stack, memory and the returned data.
//
// It is separate from the go-ethereum logger and should not be confused
// with that.
type EVMLogger interface {
	// CaptureStart is called when an EVM begins executing a new transaction.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// CaptureState is called after each EVM opcode and captures the current
	// state of the VM.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *Scope, rData []byte, depth int, err error)
	// CaptureFault is called when the EVM returns with an error.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *Scope, depth int, err error)
	// CaptureEnd is called when an EVM finished executing a transaction and returns
	// the final output whatever it may be.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)

	// CaptureEnter is called when the EVM starts a new call frame.
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	// CaptureExit is called when the EVM exits a call frame.
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// StructLogger is an EVMLogger that captures execution steps and converts them to
// a format that can be used by other tools to structured trace a transaction.
type StructLogger struct {
	cfg Config // Config differentiates between struct logger types.

	storage map[common.Hash]common.Hash
	logs    []StructLog
	err     error

	stack  *Stack // Old stack is used to produce previous stack for logging.
	memory *Memory

	// output is the data returned by the last call
	output []byte
	// gas is the amount of gas after the step
	gas uint64
}

// CaptureState logs a new execution step to the logger.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *Scope, rData []byte, depth int, err error) {
	// Make a copy of the stack and memory because the pointers passed to this
	// function are not guaranteed to be persistent.
	stack := scope.Stack.Copy()
	memory := scope.Memory.Copy()

	// When tracing is turned on, the sampling frequency is 1.
	if l.cfg.EnableMemory || l.cfg.EnableStack {
		// As an exception, REVERT and RETURN opcodes are logged with their input
		// memory, which is not returned by the VM due to being out of gas. The VM
		// also doesn't return memory for invalid opcodes, but that's fine.
		if op == REVERT || op == RETURN {
			l.memory.Resize(uint64(stack.len())*32 + 1024)
			if size, ok := stack.Back(1).Uint64OK(); ok {
				if offset, ok2 := stack.Back(0).Uint64OK(); ok2 {
					l.memory.Resize(offset + size)
					copy(l.memory.Data()[offset:], scope.Memory.Data()[offset:offset+size])
				}
			}
		}
	}
	// create the log item
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		MemorySize: memory.Len(),
		Depth:      depth,
		Err:        err,
	}
	if l.cfg.EnableStack {
		log.Stack = stack.Data()
	}
	if l.cfg.EnableMemory {
		log.Memory = memory.Data()
	}
	if l.cfg.EnableReturnData {
		log.ReturnData = rData
	}
	l.logs = append(l.logs, log)

	l.stack = stack
	l.memory = memory
	l.gas = gas
}
```
</file>
</go-ethereum>

## Prompt Corrections

The prompt provides an excellent and well-structured plan for implementing account status tracking. The Go-ethereum codebase validates that this is a sound approach. Here are a few corrections and refinements based on Go-ethereum's architecture that will make the implementation even more robust:

1.  **Central Integration Point**: The prompt suggests modifying `State.set_account_with_tracking`. In Go-ethereum, state changes are more granular (e.g., `SetBalance`, `SetNonce`, `SetCode`). A more elegant and maintainable approach would be to integrate the tracking logic into the `StateDB`'s **journaling system**.
    *   **Recommendation**: Modify the `journal.append` method. This single method sees *every* state change (balance, nonce, storage, code, account creation/deletion). By hooking in here, you can capture the "before" and "after" state for any modification without touching multiple functions. The different `journalEntry` types (like `balanceChange`, `codeChange`, `suicideChange`) directly correspond to the `ModificationType` in your spec. This is the most idiomatic Geth-like approach.

2.  **Capturing Historical State**: The prompt's `track_account_modification` function requires `old_account` and `new_account`. The `journalEntry` types in `journal.go` are perfect for this, as they are specifically designed to store the *previous* state for rollback purposes (e.g., `balanceChange.prev`, `nonceChange.prev`). When a change is journaled, you have access to both the old value (in the entry) and the new value (in the `stateObject`).

3.  **Detailed Runtime Tracking (Storage/Performance)**: For highly detailed, opcode-by-opcode tracking (like `track_storage_access` or performance metrics), the `EVMLogger` interface (in `core/vm/logger.go`) is the best reference.
    *   **Recommendation**: Implement your `AccountStatusManager` to also satisfy the `EVMLogger` interface. The `CaptureState` method is called for every opcode, giving you access to the program counter, opcode, gas, stack, memory, and `StateDB`. This is how you can precisely track `SLOAD`/`SSTORE` operations and gather performance data as they happen, which is more accurate than trying to infer it later.

4.  **Account State vs. Account Object**: In the prompt, `Account` seems to be the main data structure. In Go-ethereum, the persistent on-disk representation is `state.Account`, but the in-memory, "live" version is the `stateObject`. The `stateObject` is what you'll interact with most during a transaction. It caches the account data and tracks dirty storage slots. Your `AccountStatus` struct would likely hold or reference a `stateObject`.

5.  **Empty Account Check**: The logic for determining if an account is "empty" (and thus prunable after a state change) is encapsulated in `stateObject.empty()`. This method checks for zero balance, zero nonce, and empty code hash, which is exactly what's needed for the `Empty` state in your `AccountState` enum. Similarly, account deletion is handled by the `Suicide` method, which marks the `stateObject` as `suicided=true`. These are the precise flags to monitor for `Active` -> `Empty` or `Active` -> `Deleted` state transitions.

By leveraging the `journal` for state change events and the `EVMLogger` for detailed execution tracing, your `AccountStatusManager` can be cleanly integrated with minimal changes to the core `StateDB` logic, resulting in a more maintainable and powerful system.

---

An account's lifecycle and state transitions are primarily managed within the `StateDB` object, which is modified during EVM execution. Changes are often tracked for transaction reverts using a `journal`, and external monitoring can be achieved via `tracers` that hook into the EVM's execution loop.

The most relevant concepts in go-ethereum for this task are:
1.  **State Journaling**: Geth uses a `journal` to track every state change (balance, nonce, storage, code, account creation/destruction). This allows for efficient reverts. The same principle can be used for status tracking.
2.  **EVM Tracing Hooks**: The `core/tracing.Hooks` struct provides callbacks for all significant EVM events, including state changes. This is the ideal integration point for an `AccountStatusManager`.
3.  **StateDB**: This is the core object that manages all account states. Its methods (`SetBalance`, `SetNonce`, `SetState`, `Suicide`, etc.) are the triggers for the tracing hooks.
4.  **Tracers**: Go-ethereum's native tracers (like `prestateTracer`) are excellent examples of how to consume EVM hooks to build a picture of state changes, which is very similar to the requested feature.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state/journal.go">
```go
// Journal is a log of state changes. It is used to revert changes that are made
// to the state.
type Journal struct {
	entries []journalEntry // Current changes tracked by the journal
	dirties map[common.Address]int
}

// journalEntry is a modification to the state tree.
type journalEntry interface {
	revert(db *StateDB)
	// dirtied returns the address of the account that was modified.
	dirtied() *common.Address
}

// The following types are the concrete journal entries.

type createObjectChange struct {
	account *common.Address
}

func (ch createObjectChange) revert(db *StateDB) {
	delete(db.stateObjects, *ch.account)
	delete(db.stateObjectsDirty, *ch.account)
}

func (ch createObjectChange) dirtied() *common.Address {
	return ch.account
}

type resetObjectChange struct {
	prev *stateObject
}

func (ch resetObjectChange) revert(db *StateDB) {
	db.setStateObject(ch.prev)
}

func (ch resetObjectChange) dirtied() *common.Address {
	return &ch.prev.address
}

type suicideChange struct {
	account     *stateObject
	prev        bool // whether account had already been suicided
	prevBalance *uint256.Int
}

func (ch suicideChange) revert(db *StateDB) {
	ch.account.suicided = ch.prev
	ch.account.SetBalance(ch.prevBalance)
}

func (ch suicideChange) dirtied() *common.Address {
	return &ch.account.address
}

type balanceChange struct {
	account *stateObject
	prev    *uint256.Int
}

func (ch balanceChange) revert(db *StateDB) {
	ch.account.SetBalance(ch.prev)
}

func (ch balanceChange) dirtied() *common.Address {
	return &ch.account.address
}

type nonceChange struct {
	account *stateObject
	prev    uint64
}

func (ch nonceChange) revert(db *StateDB) {
	ch.account.setNonce(ch.prev)
}

func (ch nonceChange) dirtied() *common.Address {
	return &ch.account.address
}

type storageChange struct {
	account       *stateObject
	key, prevalue common.Hash
}

func (ch storageChange) revert(db *StateDB) {
	ch.account.SetState(db.db, ch.key, ch.prevalue)
}

func (ch storageChange) dirtied() *common.Address {
	return &ch.account.address
}

type codeChange struct {
	account            *stateObject
	prevCode, prevHash common.Hash
}

func (ch codeChange) revert(db *StateDB) {
	ch.account.setCode(ch.prevHash, ch.prevCode)
}

func (ch codeChange) dirtied() *common.Address {
	return &ch.account.address
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/tracing/hooks.go">
```go
// Hooks can be used to install hooks into the EVM.
// If any hook is non-nil, it will be invoked on the corresponding event.
//
// The hooks are not re-entrant. E.g. it is not possible to call the EVM from
// within a hook.
type Hooks struct {
	// OnTxStart is called at the start of a transaction.
	OnTxStart func(env *VMContext, tx *types.Transaction, from common.Address)
	// OnTxEnd is called at the end of a transaction.
	OnTxEnd func(receipt *types.Receipt, err error)

	// OnEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	OnEnter func(depth int, typ byte, from, to common.Address, input []byte, gas uint64, value *big.Int)
	// OnExit is called when the EVM exits a scope, even if the scope didn't
	// execute any code.
	OnExit func(depth int, output []byte, gasUsed uint64, err error, reverted bool)

	// OnOpcode is called before the execution of each opcode.
	//
	// Note that this hook is not called for instructions that are executed
	// as part of a precompiled contract.
	OnOpcode func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)
	// OnFault is called when the EVM returns an error.
	OnFault func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)
	// OnGasChange is called when the amount of available gas changes.
	OnGasChange func(old, new uint64, reason GasChangeReason)

	// OnBalanceChange is called when the balance of an account changes.
	OnBalanceChange func(addr common.Address, prev, new *big.Int, reason BalanceChangeReason)
	// OnNonceChange is called when the nonce of an account changes.
	OnNonceChange func(addr common.Address, prev, new uint64)
	// OnCodeChange is called when the code of an account changes.
	OnCodeChange func(addr common.Address, prevCodeHash common.Hash, prevCode []byte, codeHash common.Hash, newCode []byte)
	// OnStorageChange is called when the storage of an account changes.
	OnStorageChange func(addr common.Address, slot, prev, new common.Hash)

	// OnLog is called when a LOG opcode is executed.
	OnLog func(*types.Log)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
type StateDB struct {
	db         Database
	prefetcher *Prefetcher
	trie       Trie

	// This map holds 'live' objects, which will be written to the trie at the
	// end of the transaction.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// Journal of state modifications. This is the backbone of
	// snapshot and revertToSnapshot.
	journal        *journal
	validRevisions []revision
	nextRevisionID int
    // ...
}

// CreateAccount explicitly creates a state object. If a state object with the address
// already exists the balance is carried over to the new account.
//
// CreateAccount is called during the EVM CREATE operation. The situation might arise that
// a contract does the following:
//
//   1. sends funds to sha(account ++ nonce)
//   2. CREATE sha(account ++ nonce)
func (s *StateDB) CreateAccount(addr common.Address) {
	newObj, prev := s.createObject(addr)
	if prev != nil {
		newObj.setBalance(prev.Balance())
	}
}

// Suicide marks the given account as suicided.
// This clears the account balance.
//
// The account's state object is still available until the state is committed,
// getOrNewStateObject will still return the object that is marked as suicided.
func (s *StateDB) Suicide(addr common.Address) bool {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return false
	}
	s.journal.append(suicideChange{
		account:     stateObject,
		prev:        stateObject.suicided,
		prevBalance: stateObject.Balance(),
	})
	stateObject.markSuicided()
	stateObject.SetBalance(new(uint256.Int))

	return true
}


// SetNonce sets the nonce of an account.
func (s *StateDB) SetNonce(addr common.Address, nonce uint64) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject != nil {
		s.journal.append(nonceChange{
			account: stateObject,
			prev:    stateObject.getNonce(),
		})
		stateObject.setNonce(nonce)
	}
}

// SetCode sets the code of an account.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject != nil {
		s.journal.append(codeChange{
			account:  stateObject,
			prevCode: stateObject.Code(),
			prevHash: stateObject.CodeHash(),
		})
		stateObject.SetCode(crypto.Keccak256Hash(code), code)
	}
}

// SetBalance sets the balance of an account.
func (s *StateDB) SetBalance(addr common.Address, amount *uint256.Int) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject != nil {
		s.journal.append(balanceChange{
			account: stateObject,
			prev:    stateObject.Balance(),
		})
		stateObject.SetBalance(amount)
	}
}

// SetState updates a value in account storage.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		prev := stateObject.GetState(s.db, key)
		if prev != value {
			s.journal.append(storageChange{
				account:  stateObject,
				key:      key,
				prevalue: prev,
			})
			stateObject.SetState(s.db, key, value)
		}
	}
}

// AddLog adds a log to the current transaction's log set.
func (s *StateDB) AddLog(log *types.Log) {
	s.journal.append(addLogChange{txhash: s.thash})
	log.TxHash = s.thash
	log.BlockHash = s.bhash
	log.TxIndex = uint(s.txIndex)
	log.Index = s.logSize
	s.logs[s.thash] = append(s.logs[s.thash], log)
	s.logSize++
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/eth/tracers/native/prestate.go">
```go
// prestateTracer is a tracer that collects all accounts and storage slots that
// are touched by a transaction. It can be used to generate a prestate for
// transactions.
type prestateTracer struct {
	env       *tracing.VMContext
	pre       stateMap
	post      stateMap
	to        common.Address
	config    prestateTracerConfig
	interrupt atomic.Bool // Atomic flag to signal execution interruption
	reason    error       // Textual reason for the interruption
	created   map[common.Address]bool
	deleted   map[common.Address]bool
}

// OnOpcode implements the EVMLogger interface to trace a single step of VM execution.
func (t *prestateTracer) OnOpcode(pc uint64, opcode byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
...
	op := vm.OpCode(opcode)
	stackData := scope.StackData()
	stackLen := len(stackData)
	caller := scope.Address()
	switch {
	case stackLen >= 1 && (op == vm.SLOAD || op == vm.SSTORE):
		slot := common.Hash(stackData[stackLen-1].Bytes32())
		t.lookupStorage(caller, slot)
	case stackLen >= 1 && (op == vm.EXTCODECOPY || op == vm.EXTCODEHASH || op == vm.EXTCODESIZE || op == vm.BALANCE || op == vm.SELFDESTRUCT):
		addr := common.Address(stackData[stackLen-1].Bytes20())
		t.lookupAccount(addr)
		if op == vm.SELFDESTRUCT {
			t.deleted[caller] = true
		}
	case stackLen >= 5 && (op == vm.DELEGATECALL || op == vm.CALL || op == vm.STATICCALL || op == vm.CALLCODE):
		addr := common.Address(stackData[stackLen-2].Bytes20())
		t.lookupAccount(addr)
	case op == vm.CREATE:
		nonce := t.env.StateDB.GetNonce(caller)
		addr := crypto.CreateAddress(caller, nonce)
		t.lookupAccount(addr)
		t.created[addr] = true
	case stackLen >= 4 && op == vm.CREATE2:
...
		addr := crypto.CreateAddress2(caller, salt.Bytes32(), inithash)
		t.lookupAccount(addr)
		t.created[addr] = true
	}
}

// lookupAccount fetches details of an account and adds it to the prestate
// if it doesn't exist there.
func (t *prestateTracer) lookupAccount(addr common.Address) {
	if _, ok := t.pre[addr]; ok {
		return
	}

	acc := &account{
		Balance: t.env.StateDB.GetBalance(addr).ToBig(),
		Nonce:   t.env.StateDB.GetNonce(addr),
		Code:    t.env.StateDB.GetCode(addr),
	}
	if !acc.exists() {
		acc.empty = true
	}
...
	t.pre[addr] = acc
}

// lookupStorage fetches the requested storage slot and adds
// it to the prestate of the given contract. It assumes `lookupAccount`
// has been performed on the contract before.
func (t *prestateTracer) lookupStorage(addr common.Address, key common.Hash) {
	if t.config.DisableStorage {
		return
	}
	if _, ok := t.pre[addr].Storage[key]; ok {
		return
	}
	t.pre[addr].Storage[key] = t.env.StateDB.GetState(addr, key)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/instructions.go">
```go
func opSstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// The gas cost for SSTORE is calculated in gas_table.go, and includes the
	// cost of the cold slot and account access.
	// pop value, pop key
	loc := stack.pop()
	val := stack.pop()
	evm.StateDB.SetState(contract.Address(), loc, val)
	return nil, nil
}

func opCreate(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// The gas cost for CREATE is paid in gas_table.go, and is dynamic.
	var (
		value        = stack.pop()
		offset, size = stack.pop(), stack.pop()
		input        = memory.GetPtr(offset.Uint64(), size.Uint64())
		gas          = contract.Gas()
	)
	// Apply EIP-150.
	// Always take 1/64th of the remaining gas.
	gas = gas - gas/64
	// Call EVM method to create contract.
	res, addr, returnGas, suberr := evm.Create(contract, input, gas, value)
	// Push the address to the stack.
	if suberr == nil {
		stack.push(addr.Bytes())
	} else {
		stack.push(zero)
	}
	//
	contract.Gas += returnGas
	return res, suberr
}

func opSelfdestruct(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// The gas cost of SELFDESTRUCT is paid in gas_table.go.
	// It is a dynamic cost, and will compute the gas needed for the cold/warm
	// access of the beneficiary.
	beneficiary := common.Address(stack.pop())

	// The logic for EIP-6780 is not in the instruction but in the state transition,
	// because it needs to be checked after the entire transaction has been executed.
	// For this reason, we only do the SELFDESTRUCT logic here, and the state
	// transition logic will handle the clearing of the account.
	evm.StateDB.AddRefund(params.SelfdestructRefundEIP2200)
	if evm.StateDB.Suicide(contract.Address()) {
		// As per EIP-2929, if the beneficiary is not already warm, the cold access
		// cost is added to the gas consumption.
		if !evm.StateDB.AddressInAccessList(beneficiary) {
			evm.StateDB.AddAddressToAccessList(beneficiary)
			gascost := params.ColdAccountAccessCostEIP2929
			if !evm.StateDB.Exist(beneficiary) {
				gascost += params.CreateDataGas
			}
			if !contract.UseGas(gascost) {
				return nil, ErrOutOfGas
			}
		}
	}
	return nil, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt defines a very detailed and stateful `AccountStatusManager`. While this approach is valid, it can be complex to maintain during execution, especially with reverts.

An alternative and common pattern in go-ethereum is to use a **stateless tracer**. The tracer's job is to simply record a stream of state changes as they happen, without building a complex internal model.

For instance, instead of `track_account_modification` which updates a complex `AccountStatus` object, a tracer would just emit events like:
- `BalanceChanged{Address, Old, New, ...}`
- `NonceChanged{Address, Old, New, ...}`
- `CodeChanged{Address, OldHash, NewHash, ...}`

**Recommendation:**
Consider implementing the `AccountStatusManager` as a consumer of a raw event stream generated by a tracer hooked into the EVM. The tracer would be simple and stateless, only capturing and forwarding events. The `AccountStatusManager` would then be responsible for processing this stream *after* the transaction has completed to build its detailed historical analysis.

This approach offers several benefits:
1.  **Isolation**: The tracer remains simple and performant, minimizing overhead during EVM execution.
2.  **Simpler Reverts**: If a transaction reverts, the tracer's event stream can simply be discarded. There is no complex state to roll back.
3.  **Flexibility**: The raw event stream can be used by multiple systems (e.g., live monitoring, historical indexing, debugging) without changing the core EVM hooks.

Go-ethereum's `StructLogger` (`eth/tracers/logger/logger.go`) is a good example of this pattern, as it produces a simple list of `StructLog` objects that can be post-processed.

---

An excellent and detailed prompt. Go-ethereum's design for state management, journaling, and tracing provides a robust foundation for implementing the requested features. Here are the most relevant code snippets from the `go-ethereum` codebase to guide the implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// First you need to obtain a state object.
// You can interact with the state object and update it.
// Finally, calling CommitTrie will write the modified storage trie
// to the database.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.Account
	db       *StateDB

	// DB error.
	// State objects are lazy loaded and stored in the database
	// when changed. An error may occur when accessing the database.
	dbErr error

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which gets stored when holding a non-nil value

	originStorage  Storage // Storage cache of original entries to dedup rewrites, updated only at first load
	pendingStorage Storage // Storage entries that need to be flushed to disk, at the end of an entire block
	dirtyStorage   Storage // Storage entries that have been modified in the current transaction execution
	fakeStorage    Storage // Fake storage stored for transactions which will be rolled back

	// Cache flags.
	// When an object is marked suicided it will be deleted from the trie
	// during the commit phase of the state transition.
	suicided bool
	deleted  bool
}

// newObject creates a state object.
func newObject(db *StateDB, address common.Address, data types.Account) *stateObject {
	//...
}

// setError remembers the first non-nil error it is called with.
func (s *stateObject) setError(err error) {
	if s.dbErr == nil {
		s.dbErr = err
	}
}

func (s *stateObject) getTrie(db Database) Trie {
	if s.trie == nil {
		// Try fetching from specified DB, then fallback to the owner db.
		// This is necessary for state-sync which needs to query offline
		// database.
		var err error
		trie, err := db.OpenStorageTrie(s.addrHash, s.data.Root)
		if err != nil {
			// Hitting a missing trie root is a server-side issue, but we can't do
			// much about it. Lower the error level to debug and hope the chain
			// eventually recovers.
			//
			// This issue is seen on Gnosis chain when an ancient chain is re-synced
			// after a bad snapshot import.
			log.Debug("Failed to open storage trie", "addr", s.address, "root", s.data.Root, "err", err)
			s.setError(err)
			return nil
		}
		s.trie = trie
	}
	return s.trie
}

// GetState retrieves a value from the account storage trie.
func (s *stateObject) GetState(db Database, key common.Hash) common.Hash {
	// If we have a dirty value for this state entry, return it
	if value, dirty := s.dirtyStorage[key]; dirty {
		return value
	}
	// Otherwise return the entry's original value
	return s.GetCommittedState(db, key)
}

// SetState updates a value in the account storage trie.
func (s *stateObject) SetState(db Database, key, value common.Hash) {
	// If the new value is the same as old, don't set
	if s.GetState(db, key) == value {
		return
	}
	// New value is different, update the dirty storage
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: s.GetState(db, key),
	})
	s.setState(key, value)
}

// GetCommittedState retrieves a value from the committed account storage trie.
func (s *stateObject) GetCommittedState(db Database, key common.Hash) common.Hash {
	//...
}

// Code returns the contract code associated with this object.
func (s *stateObject) Code(db Database) []byte {
	//...
}

func (s *stateObject) SetCode(codeHash common.Hash, code []byte) {
	s.db.journal.append(codeChange{
		account:  &s.address,
		prevhash: s.CodeHash(),
		prevcode: s.Code(s.db.db),
	})
	s.setCode(codeHash, code)
}

// AddBalance adds amount to s's balance.
// It is used to add funds to the destination account of a transfer.
func (s *stateObject) AddBalance(amount *big.Int) {
	// ...
	s.SetBalance(new(big.Int).Add(s.Balance(), amount))
}

// SubBalance removes amount from s's balance.
// It is used to remove funds from the origin account of a transfer.
func (s *stateObject) SubBalance(amount *big.Int) {
	// ...
	s.SetBalance(new(big.Int).Sub(s.Balance(), amount))
}

func (s *stateObject) SetBalance(amount *big.Int) {
	s.db.journal.append(balanceChange{
		account: &s.address,
		prev:    new(big.Int).Set(s.data.Balance),
	})
	s.setBalance(amount)
}

// SetNonce sets the nonce of the account.
func (s *stateObject) SetNonce(nonce uint64) {
	s.db.journal.append(nonceChange{
		account: &s.address,
		prev:    s.data.Nonce,
	})
	s.setNonce(nonce)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// Journal is a log of state changes.
// It is used to revert changes made to the state tree.
type Journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Hash]int    // Dirty accounts and the number of changes
	confs   []*journalConfig       // Historic snapshots for deferred revert creation
	// The fields below are for testing only
	postponed bool // Flag whether the self-destruction is postponed
}

// journalEntry is an interface for any structured log message.
type journalEntry interface {
	// revert undoes the changes introduced by the journal entry.
	revert(*StateDB)
	// dirtied returns the address of an account whose state was changed.
	dirtied() *common.Address
}

// journalConfig is a snapshot of the journal configuration.
type journalConfig struct {
	clears int // Number of dirty entries after which a new snapshot should be created
	dirties map[common.Address]int // The number of changes for each dirty address
}

// Append inserts a new journal entry into the log.
func (j *Journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// journalEntry implementation for creating a new account.
type createObjectChange struct {
	account *common.Address
}

func (ch createObjectChange) revert(s *StateDB) {
	delete(s.stateObjects, *ch.account)
	delete(s.stateObjectsDirty, *ch.account)
}

// journalEntry implementation for resetting an account.
type resetObjectChange struct {
	prev *stateObject
}

// ...

// journalEntry implementation for processing a suicided account.
type suicideChange struct {
	account     *common.Address
	prev        bool // whether account had already been suicided
	prevbalance *big.Int
}

// ...

type balanceChange struct {
	account *common.Address
	prev    *big.Int
}

func (ch balanceChange) revert(s *StateDB) {
	s.getStateObject(*ch.account).setBalance(ch.prev)
}

// ...

type nonceChange struct {
	account *common.Address
	prev    uint64
}

// ...

type storageChange struct {
	account       *common.Address
	key, prevalue common.Hash
}

// ...

type codeChange struct {
	account            *common.Address
	prevcode, prevhash []byte
}

// ...

// refundChange is a journalEntry for refund addition or subtraction.
type refundChange struct {
	prev *big.Int
}

// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state. It is a concrete
// implementation of the state.Database interface. StateDBs are not safe for
// concurrent use.
type StateDB struct {
	db         Database
	prefetcher *Prefetcher
	journal    *Journal
	hasher     crypto.KeccakState

	// This map holds 'live' objects, which will be written to the trie at the
	// end of a transaction.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are lazy loaded and stored in the database
	// when changed. An error may occur when accessing the database.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund *big.Int

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Per-transaction access list
	accessList *accessList
}

// CreateAccount explicitly creates a state object. If a state object with the address
// already exists the balance is carried over to the new account.
//
// CreateAccount is called during the EVM CREATE operation. The situation might arise that
// a contract does the following:
//
//   1. sends funds to sha(account ++ (nonce))
//   2. CREATEs a contract at sha(account ++ (nonce))
//
// It is important to carry over the balance in order to get the correct balance
// for the newly created contract.
func (s *StateDB) CreateAccount(addr common.Address) {
	newObj, prev := s.createObject(addr)
	if prev != nil {
		newObj.setBalance(prev.data.Balance)
	}
}


// AddBalance adds amount to the account associated with addr.
func (s *StateDB) AddBalance(addr common.Address, amount *big.Int) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.AddBalance(amount)
	}
}

// SubBalance subtracts amount from the account associated with addr.
func (s *StateDB) SubBalance(addr common.Address, amount *big.Int) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SubBalance(amount)
	}
}

// SetNonce sets the nonce of the account associated with addr.
func (s *StateDB) SetNonce(addr common.Address, nonce uint64) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetNonce(nonce)
	}
}

// SetCode sets the code of the account associated with addr.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		codeHash := crypto.Keccak256Hash(code)
		stateObject.SetCode(codeHash, code)
	}
}

// SetState sets the storage value for the account associated with addr.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetState(s.db, key, value)
	}
}

// Suicide marks the given account as suicided.
// This clears the account balance.
//
// The account's state object is still available until the state is committed,
// getStateObject will return a non-nil account after Suicide.
func (s *StateDB) Suicide(addr common.Address) bool {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return false
	}
	s.journal.append(suicideChange{
		account:     &addr,
		prev:        stateObject.suicided,
		prevbalance: new(big.Int).Set(stateObject.Balance()),
	})
	stateObject.markSuicided()
	stateObject.setBalance(new(big.Int))

	return true
}

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	return s.journal.snapshot()
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	s.journal.revert(s, revid)
}

// AddLog adds a log to the current transaction's list of logs.
func (s *StateDB) AddLog(log *types.Log) {
	s.journal.append(addLogChange{txhash: s.thash})

	log.TxHash = s.thash
	log.TxIndex = uint(s.txIndex)
	log.Index = s.logSize
	s.logs[s.thash] = append(s.logs[s.thash], log)
	s.logSize++
}

// AddPreimage records a SHA3 preimage seen by the VM.
func (s *StateDB) AddPreimage(hash common.Hash, preimage []byte) {
	if _, ok := s.preimages[hash]; !ok {
		s.journal.append(addPreimageChange{hash: hash})
		// The AddPreimage logic is not thread-safe.
		// The lock here is to protect the potential concurrent read in other goroutines.
		// E.g. internal/ethapi/api.go:732
		s.preimageMu.Lock()
		s.preimages[hash] = common.CopyBytes(preimage)
		s.preimageMu.Unlock()
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// StateTransition a state transition object
type StateTransition struct {
	gp         *GasPool
	msg        Message
	gas        uint64
	gasPrice   *big.Int
	initialGas uint64
	value      *big.Int
	data       []byte
	state      *state.StateDB
	evm        *vm.EVM
}

// ApplyMessage computes the new state by applying the given message
// against the old state.
func ApplyMessage(evm *vm.EVM, msg Message, gp *GasPool) (*ExecutionResult, error) {
	return NewStateTransition(evm, msg, gp).TransitionDb()
}

// TransitionDb will transition the state by applying the current message and
// returning the result including the used gas. It returns an error if failed.
// An error indicates a consensus issue.
func (st *StateTransition) TransitionDb() (*ExecutionResult, error) {
	// ... (initial checks and setup) ...

	// If the message is a contract creation.
	if st.msg.To() == nil {
		ret, _, gasUsed, err = st.evm.Create(st.msg.From(), st.data, st.gas, st.value)
	} else {
		// Increment the nonce for the next transaction
		st.state.SetNonce(st.msg.From(), st.state.GetNonce(st.msg.From())+1)
		// Call the contract as plain transaction
		ret, gasUsed, err = st.evm.Call(st.msg.From(), st.msg.To(), st.data, st.gas, st.value)
	}
	
	// ... (refund gas and finalize) ...

	return &ExecutionResult{
		UsedGas:    gasUsed,
		Err:        err,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opSstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// The gas charging model for SSTORE is a bit complex.
	// EIP-2200 is the latest specification.
	// The cost of a SSTORE operation is determined by the current value of the
	// storage slot and the new value.
	//
	// The terms used in the EIP are:
	// - 'original value': the value of the slot at the start of the current transaction.
	// - 'current value': the value of the slot prior to this SSTORE.
	// - 'new value': the value to be stored by this SSTORE.

	// pop value and slot from the stack
	loc, val := stack.pop(), stack.pop()
	// ensure the execution is not static
	if evm.Context.IsStatic {
		return nil, ErrWriteProtection
	}
	// The evm should not be running when this is called, so this is safe
	// to do.
	// EIP-1706: disable SSTORE with gasleft lower than call stipend
	if evm.chainRules.IsIstanbul && contract.Gas <= params.SstoreSentryGasEIP2200 {
		return nil, ErrOutOfGas
	}

	// Gas calculations
	var (
		gas            uint64
		address        = contract.Address()
		slot           = common.Hash(val.Bytes32())
		originalVal    = evm.StateDB.GetState(address, slot)
		currentVal     = evm.StateDB.GetState(address, slot) // same as original, since we have no dirty yet
		newVal         = common.Hash(loc.Bytes32())
		isSloadCold, _ = evm.StateDB.SlotIsCold(address, slot)
	)
	if isSloadCold {
		// The slot is cold, so we need to charge for the cold SLOAD.
		// Don't mark it warm yet, we'll do that at the end.
		gas = params.ColdSloadCost
	}
	// ... (complex gas calculation logic based on EIPs) ...

	// Charge the gas
	if !contract.UseGas(gas) {
		return nil, ErrOutOfGas
	}

	evm.StateDB.SetState(address, slot, newVal)
	evm.StateDB.MarkSlotWarm(address, slot) // EIP-2929
	return nil, nil
}


func opSelfdestruct(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Ensure the execution is not static
	if evm.Context.IsStatic {
		return nil, ErrWriteProtection
	}
	// Pop the beneficiary address from the stack
	beneficiary := common.Address(stack.pop().Bytes20())

	// The suicides are accumulated and processed at the end of the transaction.
	// This is both to prevent contracts from aborting mid-way and to make the
	// event propagation cheaper.
	evm.StateDB.AddBalance(beneficiary, contract.Balance())
	evm.StateDB.Suicide(contract.Address())
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// EVMLogger is an interface to trace execution of EVM.
//
// The EVMLogger interface is used to implement a structured logger for tracing
// EVM execution. The logger is called for each step of the EVM, and for each
// call/create frame.
//
// The EVM will call the logger methods in the following order:
//
//   - When a new frame is created:
//     - CaptureStart
//   - For each step of the EVM:
//     - CaptureState
//   - When a frame returns:
//     - CaptureEnd
//   - If a frame encounters an error:
//     - CaptureFault
type EVMLogger interface {
	// CaptureStart is called when an execution frame is entered.
	CaptureStart(evm *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureState is called for each step of the EVM.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during execution.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnd is called when an execution frame returns.
	CaptureEnd(output []byte, gasUsed uint64, err error)
}

// StructLogger is an EVMLogger that captures execution steps and converts them to
// a JSON object.
type StructLogger struct {
	cfg *Config

	storage map[common.Hash]common.Hash
	logs    []*StructLog
	mu      sync.Mutex // lock should be held for cross-goroutine access

	err error // any error encountered during logging
}

// StructLog is a structured log message captures at each step of the EVM
// execution.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            string                      `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*big.Int                  `json:"stack"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
	OpName        string                      `json:"opName"` // Added for EVM Playground
	ErrorString   string                      `json:"error,omitempty"`
}

// NewStructLogger returns a new logger that captures execution traces during the
// run of the EVM and returns them as a JSON object.
func NewStructLogger(cfg *Config) *StructLogger {
	//...
}

// CaptureState captures the system state for the given PC and returns a new
// StructLog.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ... (capture stack)
	// ... (capture memory)
	// ... (capture storage)

	// Create a new structured log entry
	log := StructLog{
		Pc:             pc,
		Op:             op.String(),
		Gas:            gas,
		GasCost:        cost,
		Memory:         mem,
		MemorySize:     scope.Memory.Len(),
		Stack:          stack,
		ReturnData:     returnData,
		Storage:        storage,
		Depth:          depth,
		RefundCounter:  scope.Contract.Gas,
		OpName:         op.String(), // Keep original for compatibility
		ErrorString:    formatError(err),
	}
	l.logs = append(l.logs, &log)
}

// formatError formats the given error for inclusion in the trace.
func formatError(err error) string {
	if err == nil {
		return ""
	}
	return err.Error()
}
```
</file>
</go-ethereum>

