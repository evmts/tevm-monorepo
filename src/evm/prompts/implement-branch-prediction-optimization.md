# Implement Branch Prediction Optimization

<<<<<<< HEAD
## What
<eli5>
Imagine you're driving and approaching traffic lights. If you could predict whether the light will be green or red, you could prepare by speeding up or slowing down in advance. Branch prediction is similar - the CPU tries to guess which direction the code will go (like "if this, then that") so it can prepare the next instructions ahead of time. When the prediction is right, everything runs smoothly. When it's wrong, the CPU has to stop and restart, which is slow.
</eli5>

=======
<review>
**Implementation Status: PARTIALLY IMPLEMENTED 🟡**

**Current Status:**
- @branchHint is used throughout codebase for basic optimization
- Static branch hints exist for likely/unlikely scenarios
- Missing comprehensive dynamic prediction and hot path optimization

**Implementation Requirements:**
- Dynamic branch prediction feedback system
- Hot path detection and adaptive optimization
- Integration with VM execution loop for conditional operations

**Priority: MEDIUM - Performance optimization that can provide measurable benefits but not essential**
</review>

## What
<eli5>
Imagine you're driving and approaching traffic lights. If you could predict whether the light will be green or red, you could prepare by speeding up or slowing down in advance. Branch prediction is similar - the CPU tries to guess which direction the code will go (like "if this, then that") so it can prepare the next instructions ahead of time. When the prediction is right, everything runs smoothly. When it's wrong, the CPU has to stop and restart, which is slow.
</eli5>

>>>>>>> origin/main
Implement comprehensive branch prediction optimization to improve instruction pipeline efficiency and reduce branch misprediction penalties. This includes static branch prediction hints, dynamic branch prediction feedback, hot path optimization, and conditional execution optimization for critical EVM execution paths.

## Why
Branch prediction optimization can significantly improve EVM execution performance by reducing pipeline stalls caused by mispredicted branches. This is especially important for conditional operations (JUMPI), loop constructs, and call/return patterns in smart contracts, where better predictions can reduce execution time by 10-20%.

## How
1. Implement static branch hint generation based on opcode types and execution patterns
2. Create dynamic branch prediction feedback system using execution history
3. Add hot path detection and optimization for frequently executed code paths
4. Integrate branch hints with VM execution loop and control flow operations
5. Implement comprehensive branch statistics and monitoring
6. Add adaptive optimization that improves predictions over time

## Development Workflow
- **Branch**: `feat_implement_branch_prediction_optimization` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_branch_prediction_optimization feat_implement_branch_prediction_optimization`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive branch prediction optimization to improve instruction pipeline efficiency and reduce branch misprediction penalties. This includes static branch prediction hints, dynamic branch prediction feedback, hot path optimization, and conditional execution optimization for critical EVM execution paths.

## <eli5>

Imagine you're driving and approaching traffic lights. If you could predict whether the light will be green or red, you could prepare by speeding up or slowing down in advance. Branch prediction is similar - the CPU tries to guess which direction the code will go (like "if this, then that") so it can prepare the next instructions ahead of time. When the prediction is right, everything runs smoothly. When it's wrong, the CPU has to stop and restart, which is slow.

</eli5>

## Branch Prediction Optimization Specifications

### Core Branch Prediction Framework

#### 1. Branch Prediction Analyzer
```zig
pub const BranchPredictionAnalyzer = struct {
    allocator: std.mem.Allocator,
    config: BranchConfig,
    branch_history: BranchHistory,
    prediction_table: PredictionTable,
    hot_paths: HotPathTracker,
    statistics: BranchStatistics,
    
    pub const BranchConfig = struct {
        enable_branch_prediction: bool,
        enable_static_hints: bool,
        enable_dynamic_feedback: bool,
        enable_hot_path_optimization: bool,
        prediction_table_size: u32,
        history_window_size: u32,
        hot_path_threshold: u32,
        confidence_threshold: f64,
        optimization_frequency: u32,
        
        pub fn aggressive() BranchConfig {
            return BranchConfig{
                .enable_branch_prediction = true,
                .enable_static_hints = true,
                .enable_dynamic_feedback = true,
                .enable_hot_path_optimization = true,
                .prediction_table_size = 8192,
                .history_window_size = 1000,
                .hot_path_threshold = 100,
                .confidence_threshold = 0.8,
                .optimization_frequency = 100,
            };
        }
        
        pub fn conservative() BranchConfig {
            return BranchConfig{
                .enable_branch_prediction = true,
                .enable_static_hints = true,
                .enable_dynamic_feedback = false,
                .enable_hot_path_optimization = true,
                .prediction_table_size = 2048,
                .history_window_size = 500,
                .hot_path_threshold = 50,
                .confidence_threshold = 0.9,
                .optimization_frequency = 500,
            };
        }
        
        pub fn disabled() BranchConfig {
            return BranchConfig{
                .enable_branch_prediction = false,
                .enable_static_hints = false,
                .enable_dynamic_feedback = false,
                .enable_hot_path_optimization = false,
                .prediction_table_size = 0,
                .history_window_size = 0,
                .hot_path_threshold = 0,
                .confidence_threshold = 0.0,
                .optimization_frequency = 0,
            };
        }
    };
    
    pub const BranchType = enum {
        ConditionalJump,      // JUMPI opcode
        LoopBack,            // Backward jumps in loops
        FunctionCall,        // CALL, DELEGATECALL, etc.
        ExceptionHandling,   // REVERT, THROW paths
        StackCheck,          // Stack overflow/underflow checks
        GasCheck,            // Gas limit checks
        MemoryBounds,        // Memory access bounds checks
        ArithmeticOverflow,  // Arithmetic overflow checks
    };
    
    pub const BranchOutcome = enum {
        Taken,
        NotTaken,
        Unknown,
    };
    
    pub const BranchInfo = struct {
        branch_type: BranchType,
        instruction_pointer: u32,
        target_address: u32,
        condition_register: ?u8,  // Stack position of condition
        frequency: u64,
        last_outcomes: [16]BranchOutcome,  // Recent history
        outcome_index: u8,
        confidence: f64,
        prediction: BranchOutcome,
        mispredictions: u64,
        correct_predictions: u64,
        
        pub fn init(branch_type: BranchType, ip: u32, target: u32) BranchInfo {
            return BranchInfo{
                .branch_type = branch_type,
                .instruction_pointer = ip,
                .target_address = target,
                .condition_register = null,
                .frequency = 0,
                .last_outcomes = std.mem.zeroes([16]BranchOutcome),
                .outcome_index = 0,
                .confidence = 0.5,
                .prediction = .Unknown,
                .mispredictions = 0,
                .correct_predictions = 0,
            };
        }
        
        pub fn record_outcome(self: *BranchInfo, outcome: BranchOutcome) void {
            self.last_outcomes[self.outcome_index] = outcome;
            self.outcome_index = (self.outcome_index + 1) % 16;
            self.frequency += 1;
            
            // Update prediction based on recent history
            self.update_prediction();
            
            // Track accuracy
            if (self.prediction == outcome) {
                self.correct_predictions += 1;
            } else {
                self.mispredictions += 1;
            }
        }
        
        fn update_prediction(self: *BranchInfo) void {
            var taken_count: u32 = 0;
            var total_count: u32 = 0;
            
            for (self.last_outcomes) |outcome| {
                if (outcome != .Unknown) {
                    total_count += 1;
                    if (outcome == .Taken) {
                        taken_count += 1;
                    }
                }
            }
            
            if (total_count > 0) {
                const taken_ratio = @as(f64, @floatFromInt(taken_count)) / @as(f64, @floatFromInt(total_count));
                self.confidence = @abs(taken_ratio - 0.5) * 2.0; // 0.0 = no confidence, 1.0 = high confidence
                
                if (taken_ratio > 0.6) {
                    self.prediction = .Taken;
                } else if (taken_ratio < 0.4) {
                    self.prediction = .NotTaken;
                } else {
                    self.prediction = .Unknown;
                }
            }
        }
        
        pub fn get_accuracy(self: *const BranchInfo) f64 {
            const total = self.correct_predictions + self.mispredictions;
            return if (total > 0)
                @as(f64, @floatFromInt(self.correct_predictions)) / @as(f64, @floatFromInt(total))
            else
                0.0;
        }
        
        pub fn is_predictable(self: *const BranchInfo) bool {
            return self.confidence > 0.7 and self.frequency > 10;
        }
        
        pub fn get_static_hint(self: *const BranchInfo) StaticHint {
            return switch (self.branch_type) {
                .ConditionalJump => if (self.prediction == .Taken) .Likely else .Unlikely,
                .LoopBack => .Likely,  // Loop back branches are usually taken
                .FunctionCall => .Likely,  // Function calls usually succeed
                .ExceptionHandling => .Cold,  // Exception paths are cold
                .StackCheck => .Unlikely,  // Stack overflow is rare
                .GasCheck => .Unlikely,  // Gas exhaustion is rare
                .MemoryBounds => .Unlikely,  // Memory bounds violations are rare
                .ArithmeticOverflow => .Unlikely,  // Arithmetic overflow is rare
            };
        }
    };
    
    pub const StaticHint = enum {
        Likely,
        Unlikely,
        Cold,
        Hot,
    };
    
    pub fn init(allocator: std.mem.Allocator, config: BranchConfig) BranchPredictionAnalyzer {
        return BranchPredictionAnalyzer{
            .allocator = allocator,
            .config = config,
            .branch_history = BranchHistory.init(allocator, config.history_window_size),
            .prediction_table = PredictionTable.init(allocator, config.prediction_table_size),
            .hot_paths = HotPathTracker.init(allocator, config.hot_path_threshold),
            .statistics = BranchStatistics.init(),
        };
    }
    
    pub fn deinit(self: *BranchPredictionAnalyzer) void {
        self.branch_history.deinit();
        self.prediction_table.deinit();
        self.hot_paths.deinit();
    }
    
    pub fn analyze_branch(
        self: *BranchPredictionAnalyzer,
        branch_type: BranchType,
        ip: u32,
        target: u32,
        condition: ?bool
    ) BranchPrediction {
        if (!self.config.enable_branch_prediction) {
            return BranchPrediction.unknown();
        }
        
        // Get or create branch info
        var branch_info = self.prediction_table.get_or_create(ip, branch_type, target);
        
        // Record the branch execution
        if (condition) |cond| {
            const outcome: BranchOutcome = if (cond) .Taken else .NotTaken;
            branch_info.record_outcome(outcome);
            
            // Update dynamic feedback if enabled
            if (self.config.enable_dynamic_feedback) {
                self.branch_history.record_branch(ip, outcome);
            }
        }
        
        // Generate prediction
        var prediction = BranchPrediction{
            .prediction = branch_info.prediction,
            .confidence = branch_info.confidence,
            .static_hint = if (self.config.enable_static_hints) 
                branch_info.get_static_hint() 
            else 
                .Likely,
            .is_hot_path = self.hot_paths.is_hot_path(ip),
            .optimization_advice = self.get_optimization_advice(branch_info),
        };
        
        // Track hot paths
        if (self.config.enable_hot_path_optimization) {
            self.hot_paths.record_execution(ip, target);
        }
        
        self.statistics.record_branch_analysis(branch_type, prediction.confidence);
        
        return prediction;
    }
    
    pub fn optimize_branch_layout(self: *BranchPredictionAnalyzer) !void {
        if (!self.config.enable_hot_path_optimization) return;
        
        // Analyze hot paths and suggest optimizations
        const hot_paths = self.hot_paths.get_hot_paths();
        
        for (hot_paths) |path| {
            // Suggest code layout optimizations for hot paths
            self.suggest_layout_optimization(path);
        }
        
        self.statistics.record_optimization_pass();
    }
    
    fn get_optimization_advice(self: *BranchPredictionAnalyzer, branch_info: *const BranchInfo) OptimizationAdvice {
        _ = self;
        
        if (branch_info.is_predictable()) {
            return switch (branch_info.prediction) {
                .Taken => .OptimizeForTaken,
                .NotTaken => .OptimizeForNotTaken,
                .Unknown => .NoOptimization,
            };
        }
        
        if (branch_info.get_accuracy() < 0.6) {
            return .ConsiderCodeReorganization;
        }
        
        return .NoOptimization;
    }
    
    fn suggest_layout_optimization(self: *BranchPredictionAnalyzer, path: HotPath) void {
        _ = self;
        _ = path;
        
        // This would suggest specific code layout optimizations
        // For now, just log the suggestion
        std.log.debug("Hot path detected: {} -> {} (frequency: {})", .{
            path.start_address, path.end_address, path.frequency
        });
    }
    
    pub const BranchPrediction = struct {
        prediction: BranchOutcome,
        confidence: f64,
        static_hint: StaticHint,
        is_hot_path: bool,
        optimization_advice: OptimizationAdvice,
        
        pub fn unknown() BranchPrediction {
            return BranchPrediction{
                .prediction = .Unknown,
                .confidence = 0.0,
                .static_hint = .Likely,
                .is_hot_path = false,
                .optimization_advice = .NoOptimization,
            };
        }
        
        pub fn should_optimize(self: *const BranchPrediction) bool {
            return self.confidence > 0.8 or self.is_hot_path;
        }
    };
    
    pub const OptimizationAdvice = enum {
        OptimizeForTaken,
        OptimizeForNotTaken,
        ConsiderCodeReorganization,
        NoOptimization,
    };
    
    pub fn get_statistics(self: *const BranchPredictionAnalyzer) BranchStatistics {
        return self.statistics;
    }
};
```

#### 2. Branch History Tracking
```zig
pub const BranchHistory = struct {
    allocator: std.mem.Allocator,
    history: std.ArrayList(BranchRecord),
    window_size: u32,
    
    pub const BranchRecord = struct {
        instruction_pointer: u32,
        outcome: BranchPredictionAnalyzer.BranchOutcome,
        timestamp: u64,
        
        pub fn init(ip: u32, outcome: BranchPredictionAnalyzer.BranchOutcome) BranchRecord {
            return BranchRecord{
                .instruction_pointer = ip,
                .outcome = outcome,
                .timestamp = @intCast(std.time.milliTimestamp()),
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, window_size: u32) BranchHistory {
        return BranchHistory{
            .allocator = allocator,
            .history = std.ArrayList(BranchRecord).init(allocator),
            .window_size = window_size,
        };
    }
    
    pub fn deinit(self: *BranchHistory) void {
        self.history.deinit();
    }
    
    pub fn record_branch(self: *BranchHistory, ip: u32, outcome: BranchPredictionAnalyzer.BranchOutcome) void {
        const record = BranchRecord.init(ip, outcome);
        
        self.history.append(record) catch return;
        
        // Maintain window size
        if (self.history.items.len > self.window_size) {
            _ = self.history.orderedRemove(0);
        }
    }
    
    pub fn get_pattern(self: *const BranchHistory, ip: u32, lookback: u32) BranchPattern {
        var pattern = BranchPattern.init();
        var count: u32 = 0;
        
        // Look for recent patterns for this instruction pointer
        var i = self.history.items.len;
        while (i > 0 and count < lookback) {
            i -= 1;
            const record = &self.history.items[i];
            
            if (record.instruction_pointer == ip) {
                pattern.add_outcome(record.outcome);
                count += 1;
            }
        }
        
        return pattern;
    }
    
    pub fn get_correlation(self: *const BranchHistory, ip1: u32, ip2: u32) f64 {
        var matches: u32 = 0;
        var total: u32 = 0;
        
        for (self.history.items, 0..) |record1, i| {
            if (record1.instruction_pointer == ip1) {
                // Look for following record with ip2
                for (self.history.items[i+1..]) |record2| {
                    if (record2.instruction_pointer == ip2) {
                        total += 1;
                        if (record1.outcome == record2.outcome) {
                            matches += 1;
                        }
                        break;
                    }
                }
            }
        }
        
        return if (total > 0)
            @as(f64, @floatFromInt(matches)) / @as(f64, @floatFromInt(total))
        else
            0.0;
    }
};

pub const BranchPattern = struct {
    outcomes: [8]BranchPredictionAnalyzer.BranchOutcome,
    count: u8,
    
    pub fn init() BranchPattern {
        return BranchPattern{
            .outcomes = std.mem.zeroes([8]BranchPredictionAnalyzer.BranchOutcome),
            .count = 0,
        };
    }
    
    pub fn add_outcome(self: *BranchPattern, outcome: BranchPredictionAnalyzer.BranchOutcome) void {
        if (self.count < 8) {
            self.outcomes[self.count] = outcome;
            self.count += 1;
        }
    }
    
    pub fn predict_next(self: *const BranchPattern) BranchPredictionAnalyzer.BranchOutcome {
        if (self.count == 0) return .Unknown;
        
        // Simple pattern detection
        if (self.count >= 3) {
            // Check for alternating pattern
            if (self.outcomes[self.count-1] != self.outcomes[self.count-2] and
                self.outcomes[self.count-2] != self.outcomes[self.count-3]) {
                return if (self.outcomes[self.count-1] == .Taken) .NotTaken else .Taken;
            }
            
            // Check for repeating pattern
            if (self.outcomes[self.count-1] == self.outcomes[self.count-2] and
                self.outcomes[self.count-2] == self.outcomes[self.count-3]) {
                return self.outcomes[self.count-1];
            }
        }
        
        // Fall back to most recent outcome
        return self.outcomes[self.count-1];
    }
    
    pub fn get_confidence(self: *const BranchPattern) f64 {
        if (self.count < 2) return 0.0;
        
        var same_count: u32 = 0;
        for (1..self.count) |i| {
            if (self.outcomes[i] == self.outcomes[i-1]) {
                same_count += 1;
            }
        }
        
        return @as(f64, @floatFromInt(same_count)) / @as(f64, @floatFromInt(self.count - 1));
    }
};
```

#### 3. Prediction Table Management
```zig
pub const PredictionTable = struct {
    allocator: std.mem.Allocator,
    table: std.HashMap(u32, BranchPredictionAnalyzer.BranchInfo, IPContext, std.hash_map.default_max_load_percentage),
    capacity: u32,
    
    pub const IPContext = struct {
        pub fn hash(self: @This(), key: u32) u64 {
            _ = self;
            return @intCast(key);
        }
        
        pub fn eql(self: @This(), a: u32, b: u32) bool {
            _ = self;
            return a == b;
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, capacity: u32) PredictionTable {
        return PredictionTable{
            .allocator = allocator,
            .table = std.HashMap(u32, BranchPredictionAnalyzer.BranchInfo, IPContext, std.hash_map.default_max_load_percentage).init(allocator),
            .capacity = capacity,
        };
    }
    
    pub fn deinit(self: *PredictionTable) void {
        self.table.deinit();
    }
    
    pub fn get_or_create(self: *PredictionTable, ip: u32, branch_type: BranchPredictionAnalyzer.BranchType, target: u32) *BranchPredictionAnalyzer.BranchInfo {
        if (self.table.getPtr(ip)) |branch_info| {
            return branch_info;
        }
        
        // Check capacity
        if (self.table.count() >= self.capacity) {
            self.evict_lru();
        }
        
        // Create new entry
        const new_info = BranchPredictionAnalyzer.BranchInfo.init(branch_type, ip, target);
        self.table.put(ip, new_info) catch |err| {
            std.log.err("Failed to add branch info: {}", .{err});
            // Return a dummy entry if we can't add to table
            // In practice, this should be handled more gracefully
            return &BranchPredictionAnalyzer.BranchInfo.init(branch_type, ip, target);
        };
        
        return self.table.getPtr(ip).?;
    }
    
    pub fn get(self: *const PredictionTable, ip: u32) ?*const BranchPredictionAnalyzer.BranchInfo {
        return self.table.getPtr(ip);
    }
    
    pub fn update_all_predictions(self: *PredictionTable) void {
        var iterator = self.table.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.update_prediction();
        }
    }
    
    fn evict_lru(self: *PredictionTable) void {
        // Simple LRU eviction - remove least frequently used entry
        var min_frequency: u64 = std.math.maxInt(u64);
        var lru_ip: u32 = 0;
        
        var iterator = self.table.iterator();
        while (iterator.next()) |entry| {
            if (entry.value_ptr.frequency < min_frequency) {
                min_frequency = entry.value_ptr.frequency;
                lru_ip = entry.key_ptr.*;
            }
        }
        
        _ = self.table.remove(lru_ip);
    }
    
    pub fn get_statistics(self: *const PredictionTable) TableStatistics {
        var total_accuracy: f64 = 0.0;
        var predictable_branches: u32 = 0;
        var total_predictions: u64 = 0;
        var total_mispredictions: u64 = 0;
        
        var iterator = self.table.iterator();
        while (iterator.next()) |entry| {
            const info = entry.value_ptr;
            total_accuracy += info.get_accuracy();
            total_predictions += info.correct_predictions;
            total_mispredictions += info.mispredictions;
            
            if (info.is_predictable()) {
                predictable_branches += 1;
            }
        }
        
        const count = self.table.count();
        return TableStatistics{
            .total_branches = @intCast(count),
            .predictable_branches = predictable_branches,
            .average_accuracy = if (count > 0) total_accuracy / @as(f64, @floatFromInt(count)) else 0.0,
            .total_predictions = total_predictions,
            .total_mispredictions = total_mispredictions,
        };
    }
    
    pub const TableStatistics = struct {
        total_branches: u32,
        predictable_branches: u32,
        average_accuracy: f64,
        total_predictions: u64,
        total_mispredictions: u64,
    };
};
```

#### 4. Hot Path Tracking
```zig
pub const HotPathTracker = struct {
    allocator: std.mem.Allocator,
    paths: std.HashMap(PathKey, HotPath, PathKeyContext, std.hash_map.default_max_load_percentage),
    threshold: u32,
    
    pub const PathKey = struct {
        start: u32,
        end: u32,
        
        pub fn init(start: u32, end: u32) PathKey {
            return PathKey{ .start = start, .end = end };
        }
        
        pub fn equals(self: *const PathKey, other: *const PathKey) bool {
            return self.start == other.start and self.end == other.end;
        }
        
        pub fn hash(self: *const PathKey) u64 {
            return (@as(u64, self.start) << 32) | @as(u64, self.end);
        }
    };
    
    pub const PathKeyContext = struct {
        pub fn hash(self: @This(), key: PathKey) u64 {
            _ = self;
            return key.hash();
        }
        
        pub fn eql(self: @This(), a: PathKey, b: PathKey) bool {
            _ = self;
            return a.equals(&b);
        }
    };
    
    pub const HotPath = struct {
        start_address: u32,
        end_address: u32,
        frequency: u64,
        last_access: u64,
        average_execution_time: f64,
        
        pub fn init(start: u32, end: u32) HotPath {
            return HotPath{
                .start_address = start,
                .end_address = end,
                .frequency = 1,
                .last_access = @intCast(std.time.milliTimestamp()),
                .average_execution_time = 0.0,
            };
        }
        
        pub fn record_execution(self: *HotPath, execution_time: f64) void {
            self.frequency += 1;
            self.last_access = @intCast(std.time.milliTimestamp());
            
            // Update average execution time with exponential moving average
            const alpha = 0.1;
            self.average_execution_time = (1.0 - alpha) * self.average_execution_time + alpha * execution_time;
        }
        
        pub fn is_hot(self: *const HotPath, threshold: u32) bool {
            return self.frequency >= threshold;
        }
        
        pub fn get_heat_score(self: *const HotPath) f64 {
            const current_time = @as(f64, @floatFromInt(std.time.milliTimestamp()));
            const last_access = @as(f64, @floatFromInt(self.last_access));
            const time_factor = 1.0 / (1.0 + (current_time - last_access) / 1000.0); // Decay over seconds
            
            return @as(f64, @floatFromInt(self.frequency)) * time_factor;
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, threshold: u32) HotPathTracker {
        return HotPathTracker{
            .allocator = allocator,
            .paths = std.HashMap(PathKey, HotPath, PathKeyContext, std.hash_map.default_max_load_percentage).init(allocator),
            .threshold = threshold,
        };
    }
    
    pub fn deinit(self: *HotPathTracker) void {
        self.paths.deinit();
    }
    
    pub fn record_execution(self: *HotPathTracker, start: u32, end: u32) void {
        const key = PathKey.init(start, end);
        
        if (self.paths.getPtr(key)) |path| {
            path.record_execution(0.0); // Would measure actual execution time in practice
        } else {
            const new_path = HotPath.init(start, end);
            self.paths.put(key, new_path) catch {};
        }
    }
    
    pub fn is_hot_path(self: *const HotPathTracker, ip: u32) bool {
        var iterator = self.paths.iterator();
        while (iterator.next()) |entry| {
            const path = entry.value_ptr;
            if (ip >= path.start_address and ip <= path.end_address and path.is_hot(self.threshold)) {
                return true;
            }
        }
        return false;
    }
    
    pub fn get_hot_paths(self: *const HotPathTracker) []const HotPath {
        var hot_paths = std.ArrayList(HotPath).init(self.allocator);
        defer hot_paths.deinit();
        
        var iterator = self.paths.iterator();
        while (iterator.next()) |entry| {
            const path = entry.value_ptr;
            if (path.is_hot(self.threshold)) {
                hot_paths.append(path.*) catch continue;
            }
        }
        
        // Sort by heat score
        std.sort.sort(HotPath, hot_paths.items, {}, struct {
            fn lessThan(context: void, lhs: HotPath, rhs: HotPath) bool {
                _ = context;
                return lhs.get_heat_score() > rhs.get_heat_score();
            }
        }.lessThan);
        
        return hot_paths.toOwnedSlice() catch &[_]HotPath{};
    }
    
    pub fn optimize_hot_paths(self: *HotPathTracker) void {
        const hot_paths = self.get_hot_paths();
        defer self.allocator.free(hot_paths);
        
        for (hot_paths) |path| {
            std.log.debug("Hot path optimization candidate: 0x{X} -> 0x{X} (heat: {d:.2})", .{
                path.start_address, path.end_address, path.get_heat_score()
            });
            
            // Here we would implement actual hot path optimizations
            // Such as code reordering, instruction scheduling, etc.
        }
    }
};
```

#### 5. Branch Statistics and Monitoring
```zig
pub const BranchStatistics = struct {
    total_branches: u64,
    conditional_branches: u64,
    loop_branches: u64,
    function_calls: u64,
    exception_branches: u64,
    
    correct_predictions: u64,
    mispredictions: u64,
    unknown_predictions: u64,
    
    hot_path_executions: u64,
    cold_path_executions: u64,
    
    optimization_passes: u64,
    layout_optimizations: u64,
    
    average_confidence: f64,
    confidence_sum: f64,
    confidence_count: u64,
    
    start_time: i64,
    
    pub fn init() BranchStatistics {
        return BranchStatistics{
            .total_branches = 0,
            .conditional_branches = 0,
            .loop_branches = 0,
            .function_calls = 0,
            .exception_branches = 0,
            .correct_predictions = 0,
            .mispredictions = 0,
            .unknown_predictions = 0,
            .hot_path_executions = 0,
            .cold_path_executions = 0,
            .optimization_passes = 0,
            .layout_optimizations = 0,
            .average_confidence = 0.0,
            .confidence_sum = 0.0,
            .confidence_count = 0,
            .start_time = std.time.milliTimestamp(),
        };
    }
    
    pub fn record_branch_analysis(self: *BranchStatistics, branch_type: BranchPredictionAnalyzer.BranchType, confidence: f64) void {
        self.total_branches += 1;
        
        switch (branch_type) {
            .ConditionalJump => self.conditional_branches += 1,
            .LoopBack => self.loop_branches += 1,
            .FunctionCall => self.function_calls += 1,
            .ExceptionHandling => self.exception_branches += 1,
            else => {},
        }
        
        // Update confidence tracking
        self.confidence_sum += confidence;
        self.confidence_count += 1;
        self.average_confidence = self.confidence_sum / @as(f64, @floatFromInt(self.confidence_count));
    }
    
    pub fn record_prediction_result(self: *BranchStatistics, correct: bool) void {
        if (correct) {
            self.correct_predictions += 1;
        } else {
            self.mispredictions += 1;
        }
    }
    
    pub fn record_hot_path_execution(self: *BranchStatistics) void {
        self.hot_path_executions += 1;
    }
    
    pub fn record_cold_path_execution(self: *BranchStatistics) void {
        self.cold_path_executions += 1;
    }
    
    pub fn record_optimization_pass(self: *BranchStatistics) void {
        self.optimization_passes += 1;
    }
    
    pub fn record_layout_optimization(self: *BranchStatistics) void {
        self.layout_optimizations += 1;
    }
    
    pub fn get_prediction_accuracy(self: *const BranchStatistics) f64 {
        const total = self.correct_predictions + self.mispredictions;
        return if (total > 0)
            @as(f64, @floatFromInt(self.correct_predictions)) / @as(f64, @floatFromInt(total))
        else
            0.0;
    }
    
    pub fn get_hot_path_ratio(self: *const BranchStatistics) f64 {
        const total = self.hot_path_executions + self.cold_path_executions;
        return if (total > 0)
            @as(f64, @floatFromInt(self.hot_path_executions)) / @as(f64, @floatFromInt(total))
        else
            0.0;
    }
    
    pub fn get_uptime_seconds(self: *const BranchStatistics) f64 {
        const now = std.time.milliTimestamp();
        return @as(f64, @floatFromInt(now - self.start_time)) / 1000.0;
    }
    
    pub fn print_summary(self: *const BranchStatistics) void {
        const accuracy = self.get_prediction_accuracy() * 100.0;
        const hot_path_ratio = self.get_hot_path_ratio() * 100.0;
        const uptime = self.get_uptime_seconds();
        
        std.log.info("=== BRANCH PREDICTION STATISTICS ===");
        std.log.info("Total branches: {}", .{self.total_branches});
        std.log.info("  Conditional: {}", .{self.conditional_branches});
        std.log.info("  Loop back: {}", .{self.loop_branches});
        std.log.info("  Function calls: {}", .{self.function_calls});
        std.log.info("  Exception handling: {}", .{self.exception_branches});
        std.log.info("Prediction accuracy: {d:.2}%", .{accuracy});
        std.log.info("  Correct: {}", .{self.correct_predictions});
        std.log.info("  Mispredictions: {}", .{self.mispredictions});
        std.log.info("  Unknown: {}", .{self.unknown_predictions});
        std.log.info("Average confidence: {d:.2}", .{self.average_confidence});
        std.log.info("Hot path ratio: {d:.2}%", .{hot_path_ratio});
        std.log.info("  Hot executions: {}", .{self.hot_path_executions});
        std.log.info("  Cold executions: {}", .{self.cold_path_executions});
        std.log.info("Optimizations: {} passes, {} layout optimizations", .{
            self.optimization_passes, self.layout_optimizations
        });
        std.log.info("Uptime: {d:.2}s", .{uptime});
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Multi-Level Prediction**: Static hints, dynamic feedback, and pattern recognition
2. **Hot Path Detection**: Identify and optimize frequently executed code paths
3. **Branch Pattern Analysis**: Detect and exploit branch execution patterns
4. **Performance Monitoring**: Track prediction accuracy and optimization effectiveness
5. **Adaptive Optimization**: Dynamic adjustment of prediction strategies
6. **Code Layout Optimization**: Suggest improvements for better branch prediction

## Implementation Tasks

### Task 1: Implement Static Branch Hints
File: `/src/evm/branch_prediction/static_hints.zig`
```zig
const std = @import("std");
const Opcode = @import("../opcodes/opcode.zig").Opcode;

pub const StaticHints = struct {
    pub fn get_branch_hint(opcode: Opcode, context: ExecutionContext) StaticHint {
        return switch (opcode) {
            .JUMPI => analyze_conditional_jump(context),
            .JUMP => .Likely,  // Unconditional jumps are always taken
            .CALL, .DELEGATECALL, .STATICCALL => .Likely,  // Calls usually succeed
            .REVERT, .INVALID => .Cold,  // Error paths are cold
            else => .Likely,
        };
    }
    
    fn analyze_conditional_jump(context: ExecutionContext) StaticHint {
        // Analyze the condition being tested
        if (context.condition_is_zero_check) {
            return .Unlikely;  // Zero checks usually pass (condition is false)
        }
        
        if (context.condition_is_loop_counter) {
            return .Likely;  // Loop conditions are usually true
        }
        
        if (context.condition_is_error_check) {
            return .Unlikely;  // Error conditions are rare
        }
        
        return .Likely;  // Default to likely
    }
    
    pub const StaticHint = enum {
        Likely,
        Unlikely,
        Cold,
    };
    
    pub const ExecutionContext = struct {
        condition_is_zero_check: bool,
        condition_is_loop_counter: bool,
        condition_is_error_check: bool,
        recent_branch_history: []const bool,
    };
};
```

### Task 2: Integrate with VM Execution
File: `/src/evm/vm.zig` (modify existing)
```zig
const BranchPredictionAnalyzer = @import("branch_prediction/branch_prediction_analyzer.zig").BranchPredictionAnalyzer;

pub const Vm = struct {
    // Existing fields...
    branch_predictor: ?BranchPredictionAnalyzer,
    prediction_enabled: bool,
    
    pub fn enable_branch_prediction(self: *Vm, config: BranchPredictionAnalyzer.BranchConfig) !void {
        self.branch_predictor = BranchPredictionAnalyzer.init(self.allocator, config);
        self.prediction_enabled = true;
    }
    
    pub fn disable_branch_prediction(self: *Vm) void {
        if (self.branch_predictor) |*predictor| {
            predictor.deinit();
            self.branch_predictor = null;
        }
        self.prediction_enabled = false;
    }
    
    pub fn analyze_branch(self: *Vm, opcode: Opcode, ip: u32, target: u32, condition: ?bool) void {
        if (self.branch_predictor) |*predictor| {
            const branch_type = switch (opcode) {
                .JUMPI => .ConditionalJump,
                .CALL, .DELEGATECALL, .STATICCALL => .FunctionCall,
                .REVERT, .INVALID => .ExceptionHandling,
                else => .ConditionalJump,
            };
            
            const prediction = predictor.analyze_branch(branch_type, ip, target, condition);
            
            // Use prediction for optimization hints
            if (prediction.should_optimize()) {
                self.apply_branch_optimization(prediction);
            }
        }
    }
    
    fn apply_branch_optimization(self: *Vm, prediction: BranchPredictionAnalyzer.BranchPrediction) void {
        // Apply compiler hints for better code generation
        switch (prediction.static_hint) {
            .Likely => @branchHint(.likely),
            .Unlikely => @branchHint(.unlikely),
            .Cold => @branchHint(.cold),
            .Hot => @branchHint(.likely),
        }
        
        // Additional optimizations based on prediction
        if (prediction.is_hot_path) {
            // Could prefetch next instructions or optimize register allocation
        }
    }
    
    pub fn get_branch_statistics(self: *Vm) ?BranchPredictionAnalyzer.BranchStatistics {
        if (self.branch_predictor) |*predictor| {
            return predictor.get_statistics();
        }
        return null;
    }
};
```

### Task 3: Optimize Control Flow Operations
File: `/src/evm/execution/control.zig` (modify existing)
```zig
pub fn execute_jumpi(frame: *Frame, vm: *Vm) !void {
    const condition_u256 = frame.stack.pop_unsafe();
    const dest_u256 = frame.stack.pop_unsafe();
    
    const dest = dest_u256.to_u32() catch {
        return ExecutionError.Error.InvalidJumpDestination;
    };
    
    const condition = !condition_u256.is_zero();
    
    // Analyze branch for prediction
    vm.analyze_branch(.JUMPI, @intCast(frame.pc), dest, condition);
    
    if (condition) {
        @branchHint(.likely);  // Most conditional jumps are taken
        
        // Validate jump destination
        if (!frame.contract.is_valid_jump_destination(dest)) {
            return ExecutionError.Error.InvalidJumpDestination;
        }
        
        frame.pc = dest;
    } else {
        @branchHint(.unlikely);  // Not taken branch
        frame.pc += 1;
    }
}

pub fn execute_jump(frame: *Frame, vm: *Vm) !void {
    const dest_u256 = frame.stack.pop_unsafe();
    
    const dest = dest_u256.to_u32() catch {
        return ExecutionError.Error.InvalidJumpDestination;
    };
    
    // Analyze unconditional branch
    vm.analyze_branch(.JUMP, @intCast(frame.pc), dest, true);
    
    @branchHint(.likely);  // Unconditional jumps are always taken
    
    // Validate jump destination
    if (!frame.contract.is_valid_jump_destination(dest)) {
        return ExecutionError.Error.InvalidJumpDestination;
    }
    
    frame.pc = dest;
}
```

## Testing Requirements

### Test File
Create `/test/evm/branch_prediction/branch_prediction_test.zig`

### Test Cases
```zig
test "branch prediction capability detection" {
    // Test prediction analyzer initialization
    // Test configuration validation
    // Test capability flags
}

test "static branch hint generation" {
    // Test static hint generation for different opcodes
    // Test context-aware hint optimization
    // Test hint accuracy assessment
}

test "dynamic branch prediction" {
    // Test dynamic prediction based on history
    // Test prediction accuracy improvement over time
    // Test pattern recognition algorithms
}

test "hot path detection and optimization" {
    // Test hot path identification
    // Test optimization suggestion generation
    // Test performance impact measurement
}

test "branch pattern analysis" {
    // Test pattern detection algorithms
    // Test correlation analysis
    // Test prediction confidence calculation
}

test "integration with VM execution" {
    // Test VM integration
    // Test execution correctness with predictions
    // Test performance impact on real workloads
}

test "performance benchmarks" {
    // Benchmark prediction overhead
    // Test prediction accuracy
    // Measure execution speedup
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/branch_prediction/branch_prediction_analyzer.zig` - Main prediction framework
- `/src/evm/branch_prediction/branch_history.zig` - Branch execution history tracking
- `/src/evm/branch_prediction/prediction_table.zig` - Branch prediction table management
- `/src/evm/branch_prediction/hot_path_tracker.zig` - Hot path detection and optimization
- `/src/evm/branch_prediction/static_hints.zig` - Static branch hint generation
- `/src/evm/branch_prediction/branch_statistics.zig` - Performance monitoring and statistics
- `/src/evm/execution/control.zig` - Integration with control flow opcodes
- `/src/evm/vm.zig` - VM integration with branch prediction
- `/test/evm/branch_prediction/branch_prediction_test.zig` - Comprehensive tests

## Success Criteria

1. **Improved Branch Prediction**: 80%+ prediction accuracy for predictable branches
2. **Hot Path Optimization**: Automatic detection and optimization of frequently executed paths
3. **Reduced Misprediction Penalty**: Minimize performance impact of branch mispredictions
4. **Adaptive Learning**: Dynamic improvement of prediction accuracy over time
5. **Low Overhead**: <2% performance overhead for prediction analysis
6. **Integration**: Seamless integration with existing VM execution flow

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

#### 1. **Unit Tests** (`/test/evm/optimization/branch_prediction_optimization_test.zig`)
```zig
// Test basic branch prediction optimization functionality
test "branch_prediction_optimization basic functionality works correctly"
test "branch_prediction_optimization handles edge cases properly"
test "branch_prediction_optimization validates inputs appropriately"
test "branch_prediction_optimization produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "branch_prediction_optimization integrates with EVM properly"
test "branch_prediction_optimization maintains system compatibility"
test "branch_prediction_optimization works with existing components"
test "branch_prediction_optimization handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "branch_prediction_optimization meets performance requirements"
test "branch_prediction_optimization optimizes resource usage"
test "branch_prediction_optimization scales appropriately with load"
test "branch_prediction_optimization benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "branch_prediction_optimization meets specification requirements"
test "branch_prediction_optimization maintains EVM compatibility"
test "branch_prediction_optimization handles hardfork transitions"
test "branch_prediction_optimization cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "branch_prediction_optimization handles errors gracefully"
test "branch_prediction_optimization proper error propagation"
test "branch_prediction_optimization recovery from failure states"
test "branch_prediction_optimization validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "branch_prediction_optimization prevents security vulnerabilities"
test "branch_prediction_optimization handles malicious inputs safely"
test "branch_prediction_optimization maintains isolation boundaries"
test "branch_prediction_optimization validates security properties"
```

### Test Development Priority
1. **Core functionality** - Basic feature operation
2. **Specification compliance** - Meet requirements
3. **Integration** - System-level correctness
4. **Performance** - Efficiency targets
5. **Error handling** - Robust failures
6. **Security** - Vulnerability prevention

### Test Data Sources
- **Specification documents**: Official requirements and test vectors
- **Reference implementations**: Cross-client compatibility
- **Performance baselines**: Optimization targets
- **Real-world data**: Production scenarios
- **Synthetic cases**: Edge conditions and stress testing

### Continuous Testing
- Run `zig build test-all` after every change
- Maintain 100% test coverage for public APIs
- Validate performance regression prevention
- Test both debug and release builds
- Verify cross-platform behavior

### Test-First Examples

**Before implementation:**
```zig
test "branch_prediction_optimization basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = branch_prediction_optimization.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const branch_prediction_optimization = struct {
    pub fn process(input: InputType) !OutputType {
        return error.NotImplemented; // Initially
    }
};
```

### Critical Requirements
- **Never commit without passing tests**
- **Test all configuration paths**
- **Verify specification compliance**
- **Validate performance implications**
- **Ensure cross-platform compatibility**

## References

- [Branch Prediction](https://en.wikipedia.org/wiki/Branch_predictor) - Branch prediction techniques and algorithms
- [CPU Pipeline](https://en.wikipedia.org/wiki/Instruction_pipelining) - Instruction pipeline and branch prediction impact
- [Profile-Guided Optimization](https://en.wikipedia.org/wiki/Profile-guided_optimization) - Runtime feedback optimization
- [Hot Path Optimization](https://en.wikipedia.org/wiki/Hot_spot_(computing)) - Hot path detection and optimization
- [Control Flow Graph](https://en.wikipedia.org/wiki/Control-flow_graph) - Control flow analysis techniques

## EVMONE Context

This is an excellent and well-structured prompt for implementing a sophisticated performance optimization. Branch prediction is a key area for improving interpreter performance.

`evmone` provides excellent examples of how to approach this, particularly through its **"Advanced" interpreter** which performs JIT-like static analysis and its **computed goto dispatch loop** which is a direct form of branch optimization.

Here are the most relevant code snippets from `evmone` that will help you implement this feature.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/advanced_analysis.cpp">
```cpp
// evmone's "Advanced" interpreter is a great example of hot path optimization.
// It performs a static analysis pass to break down bytecode into basic blocks,
// pre-calculates gas costs, and determines stack requirements for each block.
// This avoids repeated checks and calculations during execution.

struct BlockAnalysis
{
    int64_t gas_cost = 0;

    int stack_req = 0;
    int stack_max_growth = 0;
    int stack_change = 0;

    /// The index of the beginblock instruction that starts the block.
    /// This is the place where the analysis data is going to be dumped.
    size_t begin_block_index = 0;

    explicit BlockAnalysis(size_t index) noexcept : begin_block_index{index} {}

    /// Close the current block by producing compressed information about the block.
    [[nodiscard]] BlockInfo close() const noexcept
    {
        return {clamp<decltype(BlockInfo{}.gas_cost)>(gas_cost),
            clamp<decltype(BlockInfo{}.stack_req)>(stack_req),
            clamp<decltype(BlockInfo{}.stack_max_growth)>(stack_max_growth)};
    }
};

AdvancedCodeAnalysis analyze(evmc_revision rev, bytes_view code) noexcept
{
    const auto& op_tbl = get_op_table(rev);
    const auto opx_beginblock_fn = op_tbl[OPX_BEGINBLOCK].fn;

    AdvancedCodeAnalysis analysis;
    // ... (analysis setup)

    // Create first block.
    analysis.instrs.emplace_back(opx_beginblock_fn);
    auto block = BlockAnalysis{0};

    // ... (loop over bytecode)
    while (code_pos != code_end)
    {
        const auto opcode = *code_pos++;
        const auto& opcode_info = op_tbl[opcode];

        if (opcode == OP_JUMPDEST)
        {
            // A JUMPDEST marks the beginning of a new basic block.
            // Save the analysis of the preceding block.
            analysis.instrs[block.begin_block_index].arg.block = block.close();
            // Create new block.
            block = BlockAnalysis{analysis.instrs.size()};
            // ...
        }

        // ... (analyze individual opcodes)

        // Accumulate block-level statistics.
        block.stack_req = std::max(block.stack_req, opcode_info.stack_req - block.stack_change);
        block.stack_change += opcode_info.stack_change;
        block.stack_max_growth = std::max(block.stack_max_growth, block.stack_change);
        block.gas_cost += opcode_info.gas_cost;

        // ...
    }
    // ...
    return analysis;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_execution.cpp">
```cpp
// evmone uses a computed goto dispatch loop, which is a C/C++ extension that
// significantly improves interpreter performance by reducing branch mispredictions
// in the main execution loop. This is directly relevant to your task.
// A similar optimization could be achieved in Zig using a switch statement
// over an enum of opcodes, as the Zig compiler is very effective at
// optimizing switches into jump tables.

#if EVMONE_CGOTO_SUPPORTED
int64_t dispatch_cgoto(
    const CostTable& cost_table, ExecutionState& state, int64_t gas, const uint8_t* code) noexcept
{
#pragma GCC diagnostic ignored "-Wpedantic"

    // Create a table of direct addresses for each opcode's implementation.
    static constexpr void* cgoto_table[] = {
#define ON_OPCODE(OPCODE) &&TARGET_##OPCODE,
#undef ON_OPCODE_UNDEFINED
#define ON_OPCODE_UNDEFINED(_) &&TARGET_OP_UNDEFINED,
        MAP_OPCODES
#undef ON_OPCODE
#undef ON_OPCODE_UNDEFINED
#define ON_OPCODE_UNDEFINED ON_OPCODE_UNDEFINED_DEFAULT
    };
    static_assert(std::size(cgoto_table) == 256);

    const auto stack_bottom = state.stack_space.bottom();
    Position position{code, stack_bottom};

    // The first jump to the implementation of the first opcode.
    goto* cgoto_table[*position.code_it];

// Each instruction implementation ends with a `goto` to the next instruction's
// implementation, creating a highly optimized dispatch loop.
#define ON_OPCODE(OPCODE)                                                                 \
    TARGET_##OPCODE : ASM_COMMENT(OPCODE);                                                \
    if (const auto next = invoke<OPCODE>(cost_table, stack_bottom, position, gas, state); \
        next.code_it == nullptr)                                                          \
    {                                                                                     \
        return gas;                                                                       \
    }                                                                                     \
    else                                                                                  \
    {                                                                                     \
        position = next;                                                                  \
    }                                                                                     \
    goto* cgoto_table[*position.code_it];

    MAP_OPCODES
#undef ON_OPCODE

TARGET_OP_UNDEFINED:
    state.status = EVMC_UNDEFINED_INSTRUCTION;
    return gas;
}
#endif
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_analysis.cpp">
```cpp
// For legacy (pre-EOF) code, evmone performs a static analysis pass to build a
// bitmap of valid JUMPDEST locations. This avoids re-scanning the bytecode on every
// JUMP/JUMPI, which is a significant performance win. This is a direct example of
// static analysis for control-flow optimization.

namespace
{
CodeAnalysis::JumpdestMap analyze_jumpdests(bytes_view code)
{
    CodeAnalysis::JumpdestMap map(code.size());  // Allocate and init bitmap with zeros.
    for (size_t i = 0; i < code.size(); ++i)
    {
        const auto op = code[i];
        if (static_cast<int8_t>(op) >= OP_PUSH1)  // If any PUSH opcode.
            i += op - size_t{OP_PUSH1 - 1};       // Skip PUSH data.
        else if (INTX_UNLIKELY(op == OP_JUMPDEST))
            map[i] = true;
    }
    return map;
}
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/eof.cpp">
```cpp
// The EOF (EVM Object Format) validation logic is a prime example of advanced
// static analysis for control flow. It validates all relative jumps (RJUMP/RJUMPI/RJUMPV)
// to ensure they don't land inside instruction immediates. This pre-validation
// is a powerful form of static branch prediction hinting.

/// Validates that we don't rjump inside an instruction's immediate.
/// Requires that the input is validated against truncation.
bool validate_rjump_destinations(bytes_view code) noexcept
{
    // Collect relative jump destinations and immediate locations
    const auto code_size = code.size();
    // list of all possible absolute rjumps destinations positions
    std::vector<size_t> rjumpdests;
    // bool map of immediate arguments positions in the code
    std::vector<bool> immediate_map(code_size);

    /// Validates relative jump destination. If valid pushes the destination to the rjumpdests.
    const auto check_rjump_destination = [code_size, &rjumpdests](
                                             auto rel_offset_data_it, size_t post_pos) -> bool {
        const auto rel_offset = read_int16_be(rel_offset_data_it);
        const auto jumpdest = static_cast<int32_t>(post_pos) + rel_offset;
        if (jumpdest < 0 || static_cast<size_t>(jumpdest) >= code_size)
            return false;

        rjumpdests.emplace_back(static_cast<size_t>(jumpdest));
        return true;
    };

    for (size_t i = 0; i < code_size; ++i)
    {
        const auto op = code[i];
        size_t imm_size = instr::traits[op].immediate_size;

        if (op == OP_RJUMP || op == OP_RJUMPI)
        {
            if (!check_rjump_destination(&code[i + 1], i + REL_OFFSET_SIZE + 1))
                return false;
        }
        else if (op == OP_RJUMPV)
        {
            // ... complex logic for RJUMPV ...
        }

        // Mark immediate bytes as non-jumpable.
        std::fill_n(immediate_map.begin() + static_cast<ptrdiff_t>(i) + 1, imm_size, true);
        i += imm_size;
    }

    // Check relative jump destinations against immediate locations.
    for (const auto rjumpdest : rjumpdests)
        if (immediate_map[rjumpdest])
            return false;

    return true;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/lru_cache.hpp">
```cpp
// The prompt specifies a `PredictionTable` with a fixed capacity, which implies
// an eviction policy is needed. evmone's LRUCache is a good reference for how to
// implement this efficiently. It uses a combination of a hash map for fast lookups
// and a list to track usage order, achieving O(1) for both get and put operations.
// This would be ideal for implementing your dynamic branch prediction feedback system.

template <typename Key, typename Value>
class LRUCache
{
    struct LRUEntry
    {
        const Key& key;
        Value value;
    };

    using LRUList = std::list<LRUEntry>;
    using LRUIterator = typename LRUList::iterator;
    using Map = std::unordered_map<Key, LRUIterator>;

    const size_t capacity_;
    LRUList lru_list_;
    Map map_;

    void move_to_back(LRUIterator it) noexcept { lru_list_.splice(lru_list_.end(), lru_list_, it); }

public:
    explicit LRUCache(size_t capacity);

    void clear() noexcept;

    std::optional<Value> get(const Key& key) noexcept;

    void put(Key key, Value value);
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions.hpp">
```cpp
// The implementation of JUMP and JUMPI shows how the pre-analyzed jump
// destination map is used to validate the target address. This is a core part
// of integrating your static analysis with the VM execution loop.

/// Internal jump implementation for JUMP/JUMPI instructions.
inline code_iterator jump_impl(ExecutionState& state, const uint256& dst) noexcept
{
    // The high bits of the destination must be 0, because code size is limited.
    const auto hi_part_is_nonzero = (dst[3] | dst[2] | dst[1]) != 0;

    // The check_jumpdest uses the pre-computed bitmap for O(1) validation.
    if (hi_part_is_nonzero || !state.analysis.baseline->check_jumpdest(dst[0])) [[unlikely]]
    {
        state.status = EVMC_BAD_JUMP_DESTINATION;
        return nullptr;
    }

    return &state.analysis.baseline->executable_code()[static_cast<size_t>(dst[0])];
}

/// JUMPI instruction implementation using baseline::CodeAnalysis.
inline code_iterator jumpi(StackTop stack, ExecutionState& state, code_iterator pos) noexcept
{
    const auto& dst = stack.pop();
    const auto& cond = stack.pop();

    // The likely branch is the one where the condition is true.
    // The Zig `@branchHint(.likely)` would be perfectly placed here.
    return cond ? jump_impl(state, dst) : pos + 1;
}
```
</file>
## Prompt Corrections

Your prompt is exceptionally well-written and thorough. The provided Zig specifications are clear and demonstrate a deep understanding of the problem. There are no major corrections needed.

One minor suggestion: The Zig code in the prompt uses `std.log`, which is great for debugging. However, for a high-performance EVM, you might consider a logging framework that can be completely compiled out in release builds to ensure zero overhead, or a more advanced tracing framework that can be enabled/disabled at runtime. `evmone`'s `Tracer` class is a good example of the latter.

Overall, this is a fantastic prompt. The context from `evmone` should provide excellent real-world implementation patterns for your task. Good luck



## REVM Context

An analysis of the `revm` codebase reveals several key areas that are highly relevant to implementing branch prediction. The most pertinent snippets focus on the interpreter's execution loop, the handling of control flow opcodes (`JUMP`, `JUMPI`), static bytecode analysis for `JUMPDEST` locations, and the overall structure for opcode dispatch.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/control.rs">
```rust
//! This file contains the implementation of the control flow opcodes.
//! JUMP and JUMPI are the primary targets for branch prediction optimization.
//! The logic here shows where a prediction would be checked and how the
//! program counter (`pc`) is updated based on the branch outcome.

use crate::{
    gas,
    interpreter::Interpreter,
    interpreter_types::{
        EofCodeInfo, Immediates, InterpreterTypes, Jumps, LoopControl, MemoryTr, RuntimeFlag,
        StackTr, SubRoutineStack,
    },
    InstructionResult, InterpreterAction, InterpreterResult,
};
// ...

pub fn jump<ITy: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, ITy>) {
    gas!(context.interpreter, gas::MID);
    popn!([target], context.interpreter);
    jump_inner(context.interpreter, target);
}

pub fn jumpi<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::HIGH);
    popn!([target, cond], context.interpreter);

    // This is the core branching point. A branch predictor would try to guess
    // the outcome of `!cond.is_zero()` before this check is executed.
    // A correct prediction allows pre-fetching instructions from the target address.
    // A misprediction would require flushing the pipeline and fetching from the
    // sequential path (pc + 1).
    if !cond.is_zero() {
        jump_inner(context.interpreter, target);
    }
}

#[inline]
fn jump_inner<WIRE: InterpreterTypes>(interpreter: &mut Interpreter<WIRE>, target: U256) {
    let target = as_usize_or_fail!(interpreter, target, InstructionResult::InvalidJump);

    // The check `is_valid_legacy_jump` relies on pre-computed analysis of the bytecode.
    // A branch prediction system could use this same analysis to generate static hints.
    // For example, if a JUMPI is followed by an opcode that always reverts, the "not taken"
    // path is likely cold.
    if !interpreter.bytecode.is_valid_legacy_jump(target) {
        interpreter
            .control
            .set_instruction_result(InstructionResult::InvalidJump);
        return;
    }
    // SAFETY: `is_valid_jump` ensures that `dest` is in bounds.
    interpreter.bytecode.absolute_jump(target);
}

// ...

pub fn jumpdest_or_nop<WIRE: InterpreterTypes, H: ?Sized>(
    context: InstructionContext<'_, H, WIRE>,
) {
    gas!(context.interpreter, gas::JUMPDEST);
}
```
</file>

<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/legacy/analysis.rs">
```rust
//! This file implements the static analysis of legacy bytecode to identify valid JUMPDESTs.
//! This process is analogous to generating static branch hints. A similar analysis pass could
//! be used to identify branch patterns (e.g., loop-back jumps, error-handling jumps)
//! and generate hints for the branch predictor.

use super::JumpTable;
use crate::opcode;
use bitvec::{bitvec, order::Lsb0, vec::BitVec};
use primitives::Bytes;
use std::{sync::Arc, vec, vec::Vec};

/// Analyze the bytecode to find the jumpdests. Used to create a jump table
/// that is needed for [`crate::LegacyAnalyzedBytecode`].
/// This function contains a hot loop and should be optimized as much as possible.
pub fn analyze_legacy(bytecode: Bytes) -> (JumpTable, Bytes) {
    if bytecode.is_empty() {
        return (JumpTable::default(), Bytes::from_static(&[opcode::STOP]));
    }

    // Create a bit vector to mark valid jump destinations. This is a memory-efficient
    // way to store analysis results. A branch prediction system could use a similar
    // data structure to store hints (e.g., likely, unlikely, cold).
    let mut jumps: BitVec<u8> = bitvec



## EXECUTION-SPECS Context

An analysis of the `execution-specs` codebase reveals that the core logic for branching is handled within the `vm.zig` execution loop, which dispatches to opcode implementations in `execution/control.zig` via a `JumpTable`. The `Contract` and `CodeAnalysis` structs are used for static analysis of the bytecode to identify valid jump destinations, which is a perfect parallel for implementing static branch prediction hints.

The most relevant files for implementing branch prediction are:
- `src/evm/vm.zig`: The main VM struct and execution loop.
- `src/evm/execution/control.zig`: The implementations for `JUMP` and `JUMPI` opcodes.
- `src/evm/jump_table/jump_table.zig`: The dispatch mechanism for opcodes.
- `src/evm/contract/contract.zig`: The contract struct holding bytecode and analysis.
- `src/evm/contract/code_analysis.zig`: The structure for storing static analysis results.
- `src/evm/contract/bitvec.zig`: The utility used for mapping valid jump destinations.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/v1.1.0-alpha.5/src/ethereum/shanghai/vm/interpreter.py">
```python
def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: `ethereum.vm.EVM`
        Items containing execution specific objects
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        valid_jump_destinations=valid_jump_destinations,
        logs=(),
        refund_counter=0,
        running=True,
        message=message,
        output=b"",
        accounts_to_delete=set(),
        return_data=b"",
        error=None,
        accessed_addresses=message.accessed_addresses,
        accessed_storage_keys=message.accessed_storage_keys,
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/v1.1.0-alpha.5/src/ethereum/shanghai/vm/instructions/control_flow.py">
```python
def jump(evm: Evm) -> None:
    """
    Alter the program counter to the location specified by the top of the
    stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    jump_dest = Uint(pop(evm.stack))

    # GAS
    charge_gas(evm, GAS_MID)

    # OPERATION
    if jump_dest not in evm.valid_jump_destinations:
        raise InvalidJumpDestError

    # PROGRAM COUNTER
    evm.pc = Uint(jump_dest)


def jumpi(evm: Evm) -> None:
    """
    Alter the program counter to the specified location if and only if a
    condition is true. If the condition is not true, then the program counter
    would increase only by 1.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    jump_dest = Uint(pop(evm.stack))
    conditional_value = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_HIGH)

    # OPERATION
    if conditional_value == 0:
        destination = evm.pc + Uint(1)
    elif jump_dest not in evm.valid_jump_destinations:
        raise InvalidJumpDestError
    else:
        destination = jump_dest

    # PROGRAM COUNTER
    evm.pc = destination


def jumpdest(evm: Evm) -> None:
    """
    Mark a valid destination for jumps. This is a noop, present only
    to be used by `JUMP` and `JUMPI` opcodes to verify that their jump is
    valid.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_JUMPDEST)

    # OPERATION
    pass

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/v1.1.0-alpha.5/src/ethereum/shanghai/vm/runtime.py">
```python
def get_valid_jump_destinations(code: Bytes) -> Set[Uint]:
    """
    Analyze the evm code to obtain the set of valid jump destinations.

    Valid jump destinations are defined as follows:
        * The jump destination is less than the length of the code.
        * The jump destination should have the `JUMPDEST` opcode (0x5B).
        * The jump destination shouldn't be part of the data corresponding to
          `PUSH-N` opcodes.

    Note - Jump destinations are 0-indexed.

    Parameters
    ----------
    code :
        The EVM code which is to be executed.

    Returns
    -------
    valid_jump_destinations: `Set[Uint]`
        The set of valid jump destinations in the code.
    """
    valid_jump_destinations = set()
    pc = Uint(0)

    while pc < ulen(code):
        try:
            current_opcode = Ops(code[pc])
        except ValueError:
            # Skip invalid opcodes, as they don't affect the jumpdest
            # analysis. Nevertheless, such invalid opcodes would be caught
            # and raised when the interpreter runs.
            pc += Uint(1)
            continue

        if current_opcode == Ops.JUMPDEST:
            valid_jump_destinations.add(pc)
        elif Ops.PUSH1.value <= current_opcode.value <= Ops.PUSH32.value:
            # If PUSH-N opcodes are encountered, skip the current opcode along
            # with the trailing data segment corresponding to the PUSH-N
            # opcodes.
            push_data_size = current_opcode.value - Ops.PUSH1.value + 1
            pc += Uint(push_data_size)

        pc += Uint(1)

    return valid_jump_destinations
```
</file>
</execution-specs>

## Prompt Corrections

The original prompt provides a comprehensive Zig-based implementation plan. However, there are some minor discrepancies between the function signatures in the prompt and the actual `execution-specs` codebase, which uses Python.

1.  **Function Signatures:** The prompt uses a signature like `execute_jumpi(frame: *Frame, vm: *Vm)`. The `execution-specs` codebase uses a single `evm: Evm` parameter for its instruction implementations (e.g., `jumpi(evm: Evm)`). The `evm` object contains all the necessary context (stack, memory, message, etc.) that the `frame` and `vm` pointers would provide. The implementation should adapt to this pattern.
2.  **Opcode Naming:** The prompt uses `execute_jumpi`, while the codebase uses `jumpi`. The naming convention is slightly different but maps directly.
3.  **VM Integration:** The `vm.zig` modification example in the prompt is a good conceptual guide. In the Python implementation, the integration would happen inside `ethereum.shanghai.vm.interpreter.execute_code` before the `op_implementation[op](evm)` call. The branch predictor would be an attribute of the `Evm` object itself, or accessible through it. The `vm.analyze_branch` call would need access to the `evm` object to get the necessary context.
4.  **Existing Static Analysis**: The `get_valid_jump_destinations` function is a great starting point for static analysis. The proposed `StaticHint` generation can be integrated here, extending the existing bytecode walk to not only find `JUMPDEST`s but also to analyze patterns around `JUMPI` opcodes.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: `ethereum.vm.EVM`
        Items containing execution specific objects
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        valid_jump_destinations=valid_jump_destinations,
        logs=(),
        refund_counter=0,
        running=True,
        message=message,
        output=b"",
        accounts_to_delete=set(),
        touched_accounts=set(),
        return_data=b"",
        error=None,
        accessed_addresses=message.accessed_addresses,
        accessed_storage_keys=message.accessed_storage_keys,
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/control_flow.py">
```python
"""
Ethereum Virtual Machine (EVM) Control Flow Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM control flow instructions.
"""

from ethereum_types.numeric import U256, Uint

from ...vm.gas import GAS_BASE, GAS_HIGH, GAS_JUMPDEST, GAS_MID, charge_gas
from .. import Evm
from ..exceptions import InvalidJumpDestError
from ..stack import pop, push


def stop(evm: Evm) -> None:
    """
    Stop further execution of EVM code.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    pass

    # GAS
    pass

    # OPERATION
    evm.running = False

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def jump(evm: Evm) -> None:
    """
    Alter the program counter to the location specified by the top of the
    stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    jump_dest = Uint(pop(evm.stack))

    # GAS
    charge_gas(evm, GAS_MID)

    # OPERATION
    if jump_dest not in evm.valid_jump_destinations:
        raise InvalidJumpDestError

    # PROGRAM COUNTER
    evm.pc = Uint(jump_dest)


def jumpi(evm: Evm) -> None:
    """
    Alter the program counter to the specified location if and only if a
    condition is true. If the condition is not true, then the program counter
    would increase only by 1.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    jump_dest = Uint(pop(evm.stack))
    conditional_value = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_HIGH)

    # OPERATION
    if conditional_value == 0:
        destination = evm.pc + Uint(1)
    elif jump_dest not in evm.valid_jump_destinations:
        raise InvalidJumpDestError
    else:
        destination = jump_dest

    # PROGRAM COUNTER
    evm.pc = destination


def pc(evm: Evm) -> None:
    """
    Push onto the stack the value of the program counter after reaching the
    current instruction and without increasing it for the next instruction.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_BASE)

    # OPERATION
    push(evm.stack, U256(evm.pc))

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def gas_left(evm: Evm) -> None:
    """
    Push the amount of available gas (including the corresponding reduction
    for the cost of this instruction) onto the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_BASE)

    # OPERATION
    push(evm.stack, U256(evm.gas_left))

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def jumpdest(evm: Evm) -> None:
    """
    Mark a valid destination for jumps. This is a noop, present only
    to be used by `JUMP` and `JUMPI` opcodes to verify that their jump is
    valid.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_JUMPDEST)

    # OPERATION
    pass

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
def return_(evm: Evm) -> None:
    """
    Halts execution returning output data.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    memory_start_position = pop(evm.stack)
    memory_size = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(memory_start_position, memory_size)]
    )

    charge_gas(evm, GAS_ZERO + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    evm.output = memory_read_bytes(
        evm.memory, memory_start_position, memory_size
    )

    evm.running = False

    # PROGRAM COUNTER
    pass

def revert(evm: Evm) -> None:
    """
    Stop execution and revert state changes, without consuming all provided gas
    and also has the ability to return a reason
    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    memory_start_index = pop(evm.stack)
    size = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(memory_start_index, size)]
    )

    charge_gas(evm, extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    output = memory_read_bytes(evm.memory, memory_start_index, size)
    evm.output = Bytes(output)
    raise Revert

    # PROGRAM COUNTER
    # no-op
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/runtime.py">
```python
"""
Ethereum Virtual Machine (EVM) Runtime Operations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Runtime related operations used while executing EVM code.
"""
from typing import Set

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import Uint, ulen

from .instructions import Ops


def get_valid_jump_destinations(code: Bytes) -> Set[Uint]:
    """
    Analyze the evm code to obtain the set of valid jump destinations.

    Valid jump destinations are defined as follows:
        * The jump destination is less than the length of the code.
        * The jump destination should have the `JUMPDEST` opcode (0x5B).
        * The jump destination shouldn't be part of the data corresponding to
          `PUSH-N` opcodes.

    Note - Jump destinations are 0-indexed.

    Parameters
    ----------
    code :
        The EVM code which is to be executed.

    Returns
    -------
    valid_jump_destinations: `Set[Uint]`
        The set of valid jump destinations in the code.
    """
    valid_jump_destinations = set()
    pc = Uint(0)

    while pc < ulen(code):
        try:
            current_opcode = Ops(code[pc])
        except ValueError:
            # Skip invalid opcodes, as they don't affect the jumpdest
            # analysis. Nevertheless, such invalid opcodes would be caught
            # and raised when the interpreter runs.
            pc += Uint(1)
            continue

        if current_opcode == Ops.JUMPDEST:
            valid_jump_destinations.add(pc)
        elif Ops.PUSH1.value <= current_opcode.value <= Ops.PUSH32.value:
            # If PUSH-N opcodes are encountered, skip the current opcode along
            # with the trailing data segment corresponding to the PUSH-N
            # opcodes.
            push_data_size = current_opcode.value - Ops.PUSH1.value + 1
            pc += Uint(push_data_size)

        pc += Uint(1)

    return valid_jump_destinations
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
@dataclass
class Evm:
    """The internal state of the virtual machine."""

    pc: Uint
    stack: List[U256]
    memory: bytearray
    code: Bytes
    gas_left: Uint
    valid_jump_destinations: Set[Uint]
    logs: Tuple[Log, ...]
    refund_counter: int
    running: bool
    message: Message
    output: Bytes
    accounts_to_delete: Set[Address]
    touched_accounts: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/__init__.py">
```python
class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # ... (Arithmetic, Comparison, Bitwise, Keccak, Environmental, Block Opcodes)

    # Control Flow Ops
    STOP = 0x00
    JUMP = 0x56
    JUMPI = 0x57
    PC = 0x58
    GAS = 0x5A
    JUMPDEST = 0x5B

    # ... (Storage, Pop, Push, Dup, Swap, Memory, Log Opcodes)

    # System Operations
    CREATE = 0xF0
    CALL = 0xF1
    CALLCODE = 0xF2
    RETURN = 0xF3
    DELEGATECALL = 0xF4
    CREATE2 = 0xF5
    STATICCALL = 0xFA
    REVERT = 0xFD
    SELFDESTRUCT = 0xFF


op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    # ...
    Ops.JUMP: control_flow_instructions.jump,
    Ops.JUMPI: control_flow_instructions.jumpi,
    Ops.PC: control_flow_instructions.pc,
    Ops.GAS: control_flow_instructions.gas_left,
    Ops.JUMPDEST: control_flow_instructions.jumpdest,
    # ...
    Ops.CREATE: system_instructions.create,
    Ops.RETURN: system_instructions.return_,
    Ops.CALL: system_instructions.call,
    Ops.CALLCODE: system_instructions.callcode,
    Ops.DELEGATECALL: system_instructions.delegatecall,
    Ops.SELFDESTRUCT: system_instructions.selfdestruct,
    Ops.STATICCALL: system_instructions.staticcall,
    Ops.REVERT: system_instructions.revert,
    Ops.CREATE2: system_instructions.create2,
}
```
</file>
</execution-specs>
```



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run starts execution of the contract's code with the given input data.
// It will not modify the state, the state database is only used for read operations.
// The returned byte slice is the output of the execution.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	//[...]
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &callCtx{}
		// For optimisation, we have a stack consisting of 256 words (uint256)
		// and seek into it for the 'next' value. This is a bit ugly, but speeds
		// up the execution of the EVM considerably.
		stackPtr = 0
		sp       = common.Uint256(0)
		pc       = uint64(0) // program counter
		cost     uint64
		// Don't move this variable to inside the loop, to avoid constant memory allaction
		pcCopy  uint64 // needed for logging
		gas     = contract.Gas
		instrs  = in.cfg.JumpTable(contract.Code)
		savedIP = contract.savedIP
	)
	//[...]
	for {
		// Get next opcode from the jump table
		op = instrs.ops[pc]
		// The op-code is always valid, we don't need to check it
		// In case of non-existing op-code, it's marked as 'undefined',
		// and the validation below will become a fatal error
		operation := op.operation
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Static calls can't alter state
		if readOnly {
			// If the interpreter is operating in readonly mode, make sure no
			// state-modifying operation is performed. The stack validation
			// call above will already check for stack underflows.
			if operation.writes {
				return nil, errWriteProtection
			}
		}
		//[...]
		// Switch on the opcode and execute the operation
		switch op.op {
		//[...]
		case JUMPI:
			// EIP-2, EIP-150
			// pop value1, value2 from stack
			// if value2 is !0, jump to location value1
			sp, _ = stack.pop()
			sp, _ = stack.pop()

			if stack.data[stack.len-1].Sign() != 0 {
				pc = sp.Uint64()
			} else {
				pc++
			}
			// Don't push anything to the stack, see EIP-2
		//[...]
		}
	}
	//[...]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
package vm

import (
	"bytes"

	"github.com/ethereum/go-ethereum/common"
)

// JumpdestMap is a map of possible jump locations.
type JumpdestMap common.Bitvec

// newBitvec creates a new bit vector with the given length.
func newBitvec(size int) JumpdestMap {
	return common.NewBitvec(size)
}

// set sets the given bit in the bit vector
func (b JumpdestMap) set(i uint64) {
	common.Bitvec(b).Set(int(i))
}

// isset returns whether the given bit is set in the bit vector
func (b Jumpmatp) isset(i int) bool {
	return common.Bitvec(b).Get(i)
}

// CodeSegmentMap is a map of valid code segments. A code segment is a part of
// the code that is not data.
type CodeSegmentMap common.Bitvec

// analyse is a helper function that analyses the given code and returns a
// bit vector of valid jump destinations.
func analyse(code []byte) (JumpdestMap, CodeSegmentMap) {
	// The analysis is a simple single pass over the code.
	var (
		destinations = newBitvec(len(code))
		codeSegments = newBitvec(len(code))
	)
	for i := 0; i < len(code); i++ {
		// The opcode is a valid destination if it's a JUMPDEST.
		if OpCode(code[i]) == JUMPDEST {
			destinations.set(uint64(i))
		}
		// The opcode is part of a valid code segment if it is not data.
		if isCode(code[i]) {
			codeSegments.set(uint64(i))
		}
		// If the opcode is a PUSHn, skip the next n bytes since they're data
		if code[i] >= PUSH1 && code[i] <= PUSH32 {
			i += int(code[i] - PUSH1 + 1)
		}
	}
	return destinations, CodeSegmentMap(codeSegments)
}

// isCode returns whether the given opcode is a valid code segment.
// A code segment is a part of the code that is not data.
// In the yellow paper, this is defined as all opcodes except PUSH-opcodes'
// data, and JUMPDEST.
// Our interpretation is that any opcode is valid code.
func isCode(opcode byte) bool {
	return opcode < PUSH1 || opcode > PUSH32
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jumptable.go">
```go
package vm

import "github.com/ethereum/go-ethereum/common"

const (
	maxStack = 1024
	// The call-depth of the evm is capped at 1024
	callDepth = 1024
)

// JumpTable contains the EVM opcodes and their corresponding instructions.
type JumpTable [256]operation

// opcodes is the general jump table, which contains the execution functions
// for each opcode.
var opcodes = [256]operation{
	// 0x0 range - arithmetic ops.
	STOP: {
		execute:     opStop,
		constantGas: 0,
		minStack:    minStack(0, 0),
		maxStack:    maxStack(0, 0),
	},
	ADD: {
		execute:     opAdd,
		constantGas: GasFastestStep,
		minStack:    minStack(2, 1),
		maxStack:    maxStack(2, 1),
	},
	// ... (many more opcodes)
	JUMPI: {
		execute:     opJumpi,
		constantGas: GasSlowStep,
		minStack:    minStack(2, 0),
		maxStack:    maxStack(2, 0),
	},
	// ...
}

// NewLondonInstructionSet returns the instruction set for the London hard-fork.
func NewLondonInstructionSet() JumpTable {
	// The London instruction set is equal to the Berlin one, but with a new
	// opcode: BASEFEE
	instructionSet := NewBerlinInstructionSet()
	instructionSet[BASEFEE] = operation{
		execute:     opBaseFee,
		constantGas: GasQuickStep,
		minStack:    minStack(0, 1),
		maxStack:    maxStack(0, 1),
	}
	return instructionSet
}

// ... (other instruction set constructors)

// An operation is the lowest level of execution in the EVM.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// constantGas is the gas that should be charged *before* the execution of the operation
	// for any opcode that has a constant gas cost.
	constantGas uint64
	// dynamicGas is the gas that should be charged *before* the execution of the operation
	// for any opcode that has a dynamic gas cost.
	dynamicGas gasFunc
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack height of the operation.
	maxStack int

	// TBD - legacy, remove?
	halts   bool // indicates whether the operation should halt further execution
	jumps   bool // indicates whether the program counter should not be advanced for this operation
	writes  bool // determines whether this operation writes to state
	valid   bool // indication whether the operation is valid
	reverts bool // determines whether the operation reverts state (e.g. REVERT)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/metrics.go">
```go
// CollectProcessMetrics periodically collects various metrics about the running process.
func CollectProcessMetrics(refresh time.Duration) {
	// Short circuit if the metrics system is disabled
	if !metricsEnabled {
		return
	}

	// Create the various data collectors
	var (
		cpustats  = make([]CPUStats, 2)
		diskstats = make([]DiskStats, 2)
		rstats    = make([]runtimeStats, 2)
	)

	// ... (metric definitions)
	var (
		cpuSysLoad            = GetOrRegisterGauge("system/cpu/sysload", DefaultRegistry)
		cpuSysWait            = GetOrRegisterGauge("system/cpu/syswait", DefaultRegistry)
		cpuProcLoad           = GetOrRegisterGauge("system/cpu/procload", DefaultRegistry)
		//...
		diskReads             = GetOrRegisterMeter("system/disk/readcount", DefaultRegistry)
		diskReadBytes         = GetOrRegisterMeter("system/disk/readdata", DefaultRegistry)
		//...
	)

	var lastCollectTime time.Time

	// Iterate loading the different stats and updating the meters.
	now, prev := 0, 1
	for ; ; now, prev = prev, now {
		// Gather CPU times.
		ReadCPUStats(&cpustats[now])
		//... (update logic for cpuSysLoad, cpuProcLoad etc.)

		// Go runtime metrics
		readRuntimeStats(&rstats[now])
		//... (update logic for various memory and scheduler metrics)

		// Disk
		if ReadDiskStats(&diskstats[now]) == nil {
			diskReads.Mark(diskstats[now].ReadCount - diskstats[prev].ReadCount)
			diskReadBytes.Mark(diskstats[now].ReadBytes - diskstats[prev].ReadBytes)
			//...
		}

		time.Sleep(refresh)
	}
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

// NewCounter constructs a new Counter.
func NewCounter() *Counter {
	return new(Counter)
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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/histogram.go">
```go
// Histogram calculates distribution statistics from a series of int64 values.
type Histogram interface {
	Clear()
	Update(int64)
	Snapshot() HistogramSnapshot
}

type HistogramSnapshot interface {
	Count() int64
	Max() int64
	Mean() float64
	Min() int64
	Percentile(float64) float64
	Percentiles([]float64) []float64
	Size() int
	StdDev() float64
	Sum() int64
	Variance() float64
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
// GetOrRegisterMeter returns an existing Meter or constructs and registers a
// new Meter.
func GetOrRegisterMeter(name string, r Registry) *Meter {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewMeter).(*Meter)
}

// NewMeter constructs a new Meter and launches a goroutine.
func NewMeter() *Meter {
	m := newMeter()
	arbiter.add(m)
	return m
}

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

// Rate1 returns the one-minute moving average rate of events per second at the
// time the snapshot was taken.
func (m *MeterSnapshot) Rate1() float64 { return m.rate1 }

// Rate5 returns the five-minute moving average rate of events per second at
// the time the snapshot was taken.
func (m *MeterSnapshot) Rate5() float64 { return m.rate5 }

// Rate15 returns the fifteen-minute moving average rate of events per second
// at the time the snapshot was taken.
func (m *MeterSnapshot) Rate15() float64 { return m.rate15 }

// RateMean returns the meter's mean rate of events per second at the time the
// snapshot was taken.
func (m *MeterSnapshot) RateMean() float64 { return m.rateMean }
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
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
		blockHash   = block.Hash()
		blockNumber = block.Number()
		allLogs     []*types.Log
		gp          = new(GasPool).AddGas(block.GasLimit())
	)
	//[...]
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
	//[...]
	// Finalize the block, applying any consensus engine specific extras (e.g. block rewards)
	p.chain.engine.Finalize(p.chain, header, tracingStateDB, block.Body())

	return &ProcessResult{
		Receipts: receipts,
		Requests: requests,
		Logs:     allLogs,
		GasUsed:  *usedGas,
	}, nil
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt describes "Branch Prediction Optimization" in the context of a software-based EVM, which is a slight misnomer. True branch prediction is a hardware feature of CPUs. The prompt's goal is to optimize the EVM's execution flow to be more friendly to the CPU's branch predictor and to reduce software-level overhead for branching operations like `JUMPI`.

The `go-ethereum` codebase offers a more realistic approach to this kind of optimization for an interpreter:

1.  **Static Analysis via Jump Tables:** Instead of compiler hints like Zig's `@branchHint`, Geth pre-analyzes bytecode to create a `JumpTable`. This table maps each opcode directly to its implementation function. This is a one-time analysis per contract code, which avoids a massive `switch` statement in the hot execution loop. This is a powerful optimization that reduces instruction cache misses and avoids repeated branching logic for opcode dispatch. This is the most direct parallel to the prompt's "static analysis" goal.

2.  **`JUMPDEST` Analysis:** Geth pre-scans bytecode to create a bitmap of all valid `JUMPDEST` locations. During execution, a `JUMPI` or `JUMP` can check this bitmap in O(1) time. This is a form of static analysis that makes the branching logic much faster and safer. This is analogous to the prompt's concept of pre-analyzing code for branch patterns.

3.  **Metrics and Monitoring:** The `metrics` package in Geth is a perfect real-world example of how to implement the "Branch Statistics and Monitoring" feature. It provides robust, thread-safe primitives for counters, gauges, timers, and histograms that can be used to track things like `JUMPI` frequency, hot paths, or misprediction rates (if you were to implement a predictive cache).

Instead of trying to influence the CPU's hardware branch predictor directly, a more practical implementation for an EVM interpreter would focus on:
-   **Static bytecode analysis** to optimize the main execution loop (like Geth's jump tables).
-   **Implementing a simple predictive cache** for `JUMPI` outcomes in software.
-   **Using a robust metrics library** to monitor the effectiveness of these optimizations.

The provided Geth snippets give a concrete blueprint for these more practical approaches.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
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

package vm

import "github.com/ethereum/go-ethereum/common/math"

// Code análise identifies valid jump destinations in byte code.
// The resulting bit vector is cached with the code hash.
//
// This is the most relevant piece of code for the "static analysis" part of the prompt.
// It pre-scans the bytecode to determine which locations are valid JUMP destinations,
// avoiding repeated analysis during execution. This is analogous to generating
// static branch hints.
func Analyse(code []byte) destTable {
	// The analysis is a simple single-pass over the code. This is possible
	// because of the EVM code guarantees:
	//   - All instructions are encoded as a single byte.
	//   - PUSH instructions are followed by 1 to 32 bytes of data.
	//   - All other instructions have no immediate data.
	//
	// We can thus simply iterate over the code and inspect the opcode.
	var (
		i        = 0
		table    = make(destTable, len(code))
		pushedAt = make(map[uint64]int)
	)
	for i < len(code) {
		// The opcode is the first byte in the instruction.
		op := OpCode(code[i])
		// Check for JUMPDEST instruction.
		if op == JUMPDEST {
			table[i] = true
		}
		// Check for PUSH<N> instructions, which are followed by N bytes of
		// data. All other instructions have no immediate data.
		if op.IsPush() {
			// Record the start of the push data. It will not be considered a valid
			// jump destination.
			pushedAt[uint64(i)] = int(op) - int(PUSH1) + 1
			i += int(op) - int(PUSH1) + 2
		} else {
			i++
		}
	}
	// Post-process the analysis to produce a more compact table.
	// If the code is large, the number of jump destinations is likely to be
	// low. We can thus try to flatten the table into a list of offsets.
	//
	// We do this if the number of destinations is less than 1/4 of the code size.
	// We also have a special case for size 0, to avoid division by zero.
	var (
		destinations = make([]uint64, 0, 64)
		codeSize     = uint64(len(code))
	)
	for i, dst := range table {
		if dst {
			destinations = append(destinations, uint64(i))
		}
	}
	if len(code) > 0 && len(destinations)*4 <= len(code) {
		// This is the sparse map, which is what we'll use from now on.
		return destinations
	}
	// This is the dense map, which is what we'll use from now on.
	// It's the same as table, but we clear it to avoid referencing it from
	// the returned destTable.
	for _, dst := range destinations {
		pushed, ok := pushedAt[dst]
		if ok {
			// This can only happen if a JUMPDEST is part of push-data.
			// Such a JUMPDEST is not valid, and it is impossible to jump to.
			// However, we have seen such code on mainnet.
			// In order to not have to check this in the interpreter, we just
			// remove it from the valid destinations.
			//
			// E.g. PUSH1 JUMPDEST is 0x605b. The JUMPDEST is at pc+1.
			// We've already marked pc+1 as a valid jumpdest, but now we are
			// at pc=0, and realize that the byte at pc+1 is push-data.
			// We'll mark it as invalid.
			//
			// The old implementation did a second pass to identify push-data,
			// but it's easier to just keep track of what's been pushed.
			delete(pushedAt, dst) // in case JUMPDEST is valid, but was pushed
			for j := 1; j <= pushed; j++ {
				if dst+uint64(j) < codeSize {
					table[dst+uint64(j)] = false
				}
			}
		}
	}
	return table
}

// destTable is a jump destination table.
type destTable []bool
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
//
// This object is very relevant because it holds the analyzed bytecode (`analysis`).
// The `ValidJumpdest` method uses this pre-computed analysis at runtime, which is
// a core concept of static optimization for branching.
type Contract struct {
	// CallerAddress is the result of address(0)
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destTable // Aggregated result of JUMPDEST analysis.
	analysis  destTable // JUMPDEST analysis of the code.

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	value *big.Int
	Gas   uint64
}

// NewContract returns a new contract environment for the execution of EVM bytecode.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{CallerAddress: caller.Address(), caller: caller, self: object, value: value, Gas: gas}

	// This is kind of making a mess, but we need to keep track of the object
	// ref. The reason for this, is that during a DELEGATECALL, the self reference
	// is the caller's and not the callee's.
	if s, ok := object.(StateDB); ok {
		c.Code = s.GetCode(object.Address())
		c.CodeHash = s.GetCodeHash(object.Address())
	} else {
		// Not a 'real' contract, so we can't get code.
	}
	return c
}

// AsDelegate sets the contract to be a delegate call and returns the contract.
func (c *Contract) AsDelegate() *Contract {
	// NOTE: caller is not checked for nil. It's an error to call this function
	// on a contract with a nil caller.
	c.self = c.caller
	return c
}

// GetOp returns the n'th element in the contract's byte code
func (c *Contract) GetOp(n uint64) OpCode {
	if n < uint64(len(c.Code)) {
		return OpCode(c.Code[n])
	}
	return STOP
}

// ValidJumpdest checks whether the given PC is a valid jump destination.
//
// This method is the runtime consumer of the static analysis. It's called by
// JUMP and JUMPI opcodes to validate their target. This efficient check is
// possible because of the pre-computed `jumpdests` bitmap.
func (c *Contract) ValidJumpdest(dest uint64) bool {
	if dest >= uint64(len(c.Code)) {
		return false
	}
	// Cache jump destinations if not already analysed
	if c.jumpdests == nil {
		c.jumpdests = Analyse(c.Code)
	}
	udest := uint(dest)
	// Fall back to the old (original) analysis if the new one is not available.
	if c.analysis == nil {
		c.analysis = c.jumpdests
	}
	if udest >= uint(len(c.analysis)) {
		return false
	}
	return c.analysis[udest]
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run executes the given contract and returns the output as a byte slice and an error if one occurred.
//
// The interpreter will loop over the contract's code and execute the operations until `ret` is returned
// or an error is returned.
//
// This is the core execution loop of the EVM. A "mispredicted branch" in a software interpreter like this
// just means taking the wrong `if/else` path in the Go code for an opcode, which is a very minor penalty.
// The main optimization goal is to make this loop as fast as possible.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (error and defer setup) ...

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		// For optimisation, sub-call return data is not copied back to the parent unless specific instructions are used.
		returnData = make([]byte, 0)
		pc         = uint64(0) // program counter
		cost       uint64
		// copies used by tracer
		pcCopy  uint64
		gasCopy uint64
		logged  bool
	)
    
    // ... (tracer setup) ...

	// The Interpreter main loop. This loop will continue until execution of an
	// opcode alters the program counter (via a jump), terminates the whole
	// execution (via return, revert or stop) or an error occurred.
	for {
		// ... (tracer capture logic) ...

		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if operation == nil {
			err = &ErrInvalidOpcode{opcode: op}
			break
		}
		// Validate stack
		if err = operation.validateStack(stack); err != nil {
			break
		}
		// Static calls can't write to state.
		if in.readOnly && operation.writes {
			err = ErrWriteProtection
			break
		}
		// Execute the operation
		switch op {
        // ... (Cases for many opcodes are here. The default handles most) ...
		default:
			// execute the operation
			var memorySize uint64
			// Between opcodes, we charge for memory expansion.
			if operation.memorySize != nil {
				// This is a dirty hack, and only works because these happen to be
				// the only operations that have a dynamic memory size.
				// This should be redesigned.
				var size uint64
				switch op {
				case CREATE, RETURN, REVERT:
					// Create, return and revert need to be calculated with
					// the values from the stack.
					// We read the values and don't pop them.
					size, _ = stack.peek().Uint64WithOverflow()
				case CREATE2:
					// Create2 has an extra argument.
					size, _ = stack.peekN(1).Uint64WithOverflow()
				}
				memorySize, err = operation.memorySize(stack)
				if err != nil {
					break
				}
				if memorySize, err = mem.newMemory(size, memorySize); err != nil {
					break
				}
			}
			// an error means gas failed on memory expansion
			if cost, err = operation.gasCost(in.gas, in.evm, contract, stack, mem, memorySize); err != nil {
				break
			}
			if err = in.useGas(cost); err != nil {
				break
			}

			// If the operation has a return value, it is pushed on the stack.
			// TODO: check if this is correct, but it seems that the return value is
			// always a single value.
			var ret []byte
			if ret, err = operation.execute(&pc, in, callContext, contract, mem, stack); err != nil {
				break
			}
			// if the operation has a return value, it is pushed on the stack
			if operation.returns {
				stack.push(new(uint256.Int).SetBytes(ret))
			}
		}
		// ...
	}
    // ... (return logic) ...
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// This file contains the implementations for all recognized EVM opcodes.
// This is the most relevant file for understanding the actual branching logic.
// The opJump and opJumpi functions directly implement the EVM's control flow.

func opJump(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	pos := stack.pop()
	dest := pos.Uint64()

	if !contract.ValidJumpdest(dest) {
		return nil, &ErrInvalidJump{pc: *pc, dest: dest}
	}
	*pc = dest
	return nil, nil
}

func opJumpi(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	pos, cond := stack.pop(), stack.pop()
	// The JUMPI instruction is the primary conditional branch in the EVM.
	// The `if` statement here is what would be "predicted" by a CPU. In a
	// software interpreter, the goal is to structure this `if` so that the
	// most common case is handled first, which is what a hardware branch
	// predictor would do automatically.
	if !cond.IsZero() {
		dest := pos.Uint64()
		if !contract.ValidJumpdest(dest) {
			return nil, &ErrInvalidJump{pc: *pc, dest: dest}
		}
		*pc = dest
	} else {
		*pc++
	}
	return nil, nil
}

func opPc(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	stack.push(new(uint256.Int).SetUint64(*pc))
	return nil, nil
}

func opJumpdest(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	return nil, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// This file contains the jump table for the EVM.
// It maps opcodes to their implementations. This is analogous to the prompt's
// Zig `JumpTable` and is fundamental to the EVM's dispatch mechanism.

// operation is the low-level representation of a single EVM opcode.
type operation struct {
	// execute is the opcode's implementation function
	execute executionFunc
	// gasCost is the gas function for the opcode
	gasCost gasFunc
	// validateStack validates the stack for the operation
	validateStack stackValidationFunc
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// These fields are used by the interpreter to see what the operation
	// does.
	writes     bool // determines whether this op writes to the state
	returns    bool // determines whether this op returns data to the caller
	terminates bool // determines whether this op terminates the vm
	jumps      bool // determines whether this op can result in a jump
}

// JumpTable contains the EVM opcodes and their implementations.
type JumpTable [256]*operation

// newShanghaiInstructionSet returns the instruction set for the Shanghai hard fork.
func newShanghaiInstructionSet() JumpTable {
	// Start with Cancun and remove opcodes
	jt := newCancunInstructionSet()
	jt[PUSH0] = &operation{
		execute:       opPush0,
		gasCost:       constGasFunc(GasQuickStep),
		validateStack: makeStackFunc(0, 1),
		returns:       true,
	}
	return jt
}

// newCancunInstructionSet returns the instruction set for the Cancun hard fork.
func newCancunInstructionSet() JumpTable {
	// Start with Shanghai and add opcodes
	jt := newShanghaiInstructionSet()
	jt[TLOAD] = &operation{
		execute:       opTload,
		gasCost:       constGasFunc(params.TloadGas),
		validateStack: makeStackFunc(1, 1),
		returns:       true,
	}
	// ... (other Cancun opcodes) ...
	return jt
}

// newLondonInstructionSet returns the instruction set for the London hard fork.
func newLondonInstructionSet() JumpTable {
	jt := newBerlinInstructionSet()
	jt[BASEFEE] = &operation{
		execute:       opBaseFee,
		gasCost:       constGasFunc(GasQuickStep),
		validateStack: makeStackFunc(0, 1),
		returns:       true,
	}
	return jt
}

// And so on for other hardforks...
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt requests the implementation of "branch prediction optimization," a concept typically associated with hardware CPU pipelines. Applying this directly to a software EVM interpreter requires some translation, as software interpreters do not have features like speculative execution or instruction pipelines that can be flushed.

Here are some corrections and clarifications to guide the implementation:

1.  **Nature of "Branch Misprediction Penalty"**: In a software interpreter, a "mispredicted" branch (e.g., a `JUMPI`) is not a pipeline flush. It is simply an `if/else` statement in the host language (Zig, Go, etc.) where the less-traveled path is taken. The penalty is minimal—usually a single CPU branch misprediction on the machine running the EVM, not a complex state rollback within the EVM itself. The primary optimization goal is to make the interpreter's main loop execute as fast as possible.

2.  **`@branchHint` Role**: The prompt's use of `@branchHint(.likely)` and `@branchHint(.unlikely)` in Zig is a hint to the **Zig compiler**, not a feature of the EVM being implemented. It tells the compiler how to arrange the machine code for the `if/else` that implements the `JUMPI` opcode. The Go code does not have a direct equivalent, but the principle is the same: structure the Go `if` statements so the most likely execution path is checked first. The EVM itself does not process these hints.

3.  **Static Analysis vs. Dynamic Prediction**:
    *   **Static Analysis**: This is the most practical and relevant optimization. The Go-ethereum code in `core/vm/analysis.go` is a perfect example. It pre-scans bytecode to create a `destTable` (a bitmap) of all valid `JUMPDEST` locations. At runtime, `JUMP` and `JUMPI` can check this bitmap in O(1) time instead of re-scanning the code. This is a direct parallel to the prompt's "static branch hint generation."
    *   **Dynamic Prediction**: Implementing a dynamic prediction table (e.g., a 2-bit counter for every `JUMPI` pc) inside the interpreter would add significant overhead. The cost of maintaining and looking up in this table would likely outweigh the small benefit of ordering the `if/else` statement correctly. This part of the prompt is less practical for a standard interpreter and is more relevant for a JIT (Just-In-Time) compiler.

**Recommendation for Implementation:**

Focus heavily on the **static analysis** aspect, drawing inspiration from Go-ethereum's `Analyse` function. This provides a clear, measurable performance benefit with a one-time cost per contract.

1.  **Static Analysis (`BranchPredictionAnalyzer`):** Instead of complex dynamic tracking, the primary job of this analyzer should be to pre-process bytecode to identify structural properties, just like Go-ethereum's `JUMPDEST` analysis. This can be extended to identify common patterns:
    *   `JUMPI` followed immediately by `REVERT` (likely an error check, so the jump is `unlikely`).
    *   Backward `JUMPI` (a jump to a lower `pc` value), which often indicates a loop and is `likely` to be taken.

2.  **VM Integration**: The analysis results (e.g., a bitmap of `likely` and `unlikely` branches) should be stored with the contract code.

3.  **Control Flow Opcodes (`execute_jumpi`)**: The `JUMPI` implementation should use the pre-computed hints to structure its `if/else` logic using `@branchHint`.

This approach aligns with the spirit of the prompt's optimization goal while being practical and effective for a software interpreter.

---

An analysis of the go-ethereum codebase reveals several components that are highly relevant to implementing branch prediction, particularly in the areas of static code analysis and integration with the VM's execution loop.

The most significant optimization in go-ethereum related to this task is the pre-analysis of bytecode to identify all valid `JUMPDEST` locations. This avoids a costly scan during every `JUMP` or `JUMPI` operation. This pre-computation is a form of static analysis that directly informs how branch-like operations are handled at runtime.

The following snippets from the go-ethereum source code provide the most relevant context.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
This file contains the logic for analyzing EVM bytecode to identify valid jump destinations. This is a form of static analysis that is performed once per contract code, and the results are cached. This pre-computation is crucial for efficient `JUMP` and `JUMPI` validation at runtime and serves as a real-world example of the static analysis requested in the prompt.

```go
// analyse analyses the given code and returns the findings.
func analyse(code []byte) (jumpdests destinations, err error) {
	// Don't analyse code over the size limit, it's not possible to call it anyway.
	if len(code) > params.MaxCodeSize {
		return nil, fmt.Errorf("contract code size exceeds %d bytes: %d", params.MaxCodeSize, len(code))
	}
	// Do a cheap analysis first. If there are no JUMPDESTs, we can completely
	// skip the costly bit-by-bit analysis.
	if bytes.IndexByte(code, JUMPDEST) == -1 {
		return destinations{}.make(), nil
	}
	// Do the full analysis.
	// We're not using a map here, because we want to be able to do a binary search
	// over the results, which is faster for JUMP validation than a map lookup.
	var dests []uint64
	for i := 0; i < len(code); {
		var op OpCode = OpCode(code[i])
		if op >= PUSH1 && op <= PUSH32 {
			i += int(op) - int(PUSH1) + 2
		} else {
			if op == JUMPDEST {
				dests = append(dests, uint64(i))
			}
			i++
		}
	}
	return destinations(dests).make(), nil
}

// destinations contains the results of jump destination analysis.
// A destination map is a bitmap of valid jump locations.
type destinations map[uint64]struct{}

// make creates a bitmap of the valid jump destinations.
func (d destinations) make() destinations {
	// Turn the slice into a map for faster lookups
	if len(d) == 0 {
		return nil
	}
	m := make(destinations, len(d))
	for _, dst := range d {
		m[dst] = struct{}{}
	}
	return m
}

// has returns true if the provided destination is a valid jump destination.
func (d destinations) has(dest uint64) bool {
	_, ok := d[dest]
	return ok
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
The `Contract` object in go-ethereum stores the result of the bytecode analysis. The `validJumpdest` method is the runtime consumer of this static analysis, checking if a jump target is valid before execution proceeds. This is a key integration point for any branch-related logic.

```go
// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements the vm.ContractRef
// interface for the EVM.
type Contract struct {
	// CallerAddress is the result of the CALLER opcode (EIP-210)
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	Code      []byte
	CodeHash  common.Hash
	CodeAddr  *common.Address
	Input     []byte

	value *big.Int
	Gas   uint64

	// ...
}

// ...

// validJumpdest checks whether the given destination is a valid JUMP destination.
func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64WithOverflow()
	// The maximum code size is 24576 bytes, well within uint64.
	if overflow || udest >= uint64(len(c.Code)) {
		return false
	}
	// JUMPDESTs are not allowed within push data.
	// We only need to check if the destination is a JUMPDEST,
	// and not within push data. The latter is checked by the
	// jumpdest analysis.
	if c.Code[udest] != JUMPDEST {
		return false
	}
	// This is a valid jump destination if we've not generated a jumpdest map,
	// or if the jumpdest map has the destination.
	return c.jumpdests == nil || c.jumpdests.has(udest)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
The `EVMInterpreter`'s `Run` method contains the main execution loop. This loop demonstrates the critical path of fetching an opcode, validating stack requirements, consuming gas, and executing the operation. This is the central place where branch prediction hints and optimizations would be integrated. The prompt identifies stack and gas checks as branch types, and this loop shows how they are handled before opcode execution.

```go
// Run loops and executes the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		// For optimisation, we'll do a look-up in the jump table now.
		// If the code is invalid, this function will return an error and we won't have
		// to worry about errors from this particular code.
		jumpTable = in.evm.jumpTable
		// ...
	)
	// ...
	for {
		// ... gas checking logic ...

		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := jumpTable[op]
		if operation == nil {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// ... calculate gas cost ...
		if !contract.UseGas(cost) {
			return nil, ErrOutOfGas
		}
		// ...
		// Execute the operation
		res, err := operation.execute(&pc, in, contract, mem, stack)
		if err != nil {
			return nil, err
		}
		// if the operation is a stopping operation, interrupt the loop
		if operation.halts {
			return res, nil
		}
		// if the operation has a jump, assign to pc
		if operation.jumps {
			// The pc has already been changed by the jump operation.
		} else {
			pc++
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
This file contains the implementations for individual opcodes. The `opJumpi` function is the most relevant, as it contains the core conditional logic that branch prediction aims to optimize. This is where the actual branch—taken or not taken—is decided.

```go
// opJump is the execution function for the JUMP instruction.
func opJump(pc *uint64, interpreter *EVMInterpreter, contract *Contract, mem *Memory, stack *stack) ([]byte, error) {
	pos := stack.pop()
	if !contract.validJumpdest(pos) {
		return nil, ErrInvalidJump
	}
	*pc = pos.Uint64()
	return nil, nil
}

// opJumpi is the execution function for the JUMPI instruction.
func opJumpi(pc *uint64, interpreter *EVMInterpreter, contract *Contract, mem *Memory, stack *stack) ([]byte, error) {
	pos, cond := stack.pop(), stack.pop()
	if !cond.IsZero() {
		if !contract.validJumpdest(pos) {
			return nil, ErrInvalidJump
		}
		*pc = pos.Uint64()
	} else {
		*pc++
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
The `JumpTable` is the core dispatch mechanism of the interpreter. It is an array of `operation` structs, indexed by opcode. Understanding this structure is key to integrating any prediction framework into the VM's execution flow. The `operation` struct itself contains metadata about stack requirements and gas costs, which can be used for static analysis.

```go
// operation represents a single opcode of the Ethereum Virtual Machine.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// gasCost is the static gas cost of the operation
	gasCost gasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack height after execution
	maxStack int
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// halts tells whether the operation terminates the execution
	halts bool
	// jumps tells whether the operation modifies the program counter
	jumps bool
	// writes tells whether the operation writes to the state
	writes bool
	// valid indicates whether the operation is valid
	valid bool
	// dynamic indicates whether the operation has a dynamic gas cost
	dynamic bool
}

// JumpTable contains the EVM opcodes and their corresponding instructions.
type JumpTable [256]*operation

// newParisInstructionSet returns the instruction set for the Paris hard fork.
func newParisInstructionSet() JumpTable {
	// ...
	jt[JUMPI] = &operation{
		execute:     opJumpi,
		gasCost:     gasSlow,
		minStack:    2,
		maxStack:    2,
		jumps:       true,
		reachesEof:  true,
		returns:     true,
		valid:       true,
		canoverflow: true,
	}
	// ...
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm   *EVM
	table *JumpTable

	hasher    crypto.KeccakState // Keccak256 hasher instance shared across opcodes
	hasherBuf common.Hash        // Keccak256 hasher result array shared across opcodes

	readOnly   bool   // Whether to throw on stateful modifications
	returnData []byte // Last CALL's return data for subsequent reuse
}

// ...

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation except for
// ErrExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() { in.evm.depth-- }()

	// Make sure the readOnly is only set if we aren't in readOnly yet.
	// This also makes sure that the readOnly flag isn't removed for child calls.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}

	// Reset the previous call's return data. It's unimportant to preserve the old buffer
	// as every returning call will return new data anyway.
	in.returnData = nil

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go above 2^64. The YP defines the PC
		// to be uint256. Practically much less so feasible.
		pc   = uint64(0) // program counter
		cost uint64
		// ...
		res     []byte // result of the opcode execution function
		debug   = in.evm.Config.Tracer != nil
	)
	// ...
	contract.Input = input

	// The Interpreter main run loop (contextual). This loop runs until either an
	// explicit STOP, RETURN or SELFDESTRUCT is executed, an error occurred during
	// the execution of one of the operations or until the done flag is set by the
	// parent context.
	for {
		// ... (debug tracing)

		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.table[op]
		cost = operation.constantGas // For tracing
		// Validate stack
		if sLen := stack.len(); sLen < operation.minStack {
			return nil, &ErrStackUnderflow{stackLen: sLen, required: operation.minStack}
		} else if sLen > operation.maxStack {
			return nil, &ErrStackOverflow{stackLen: sLen, limit: operation.maxStack}
		}
		// for tracing: this gas consumption event is emitted below in the debug section.
		if contract.Gas < cost {
			return nil, ErrOutOfGas
		} else {
			contract.Gas -= cost
		}

		// All ops with a dynamic memory usage also has a dynamic gas cost.
		var memorySize uint64
		if operation.dynamicGas != nil {
			// ... (dynamic gas calculation) ...
			var dynamicCost uint64
			dynamicCost, err = operation.dynamicGas(in.evm, contract, stack, mem, memorySize)
			cost += dynamicCost // for tracing
			if err != nil {
				return nil, fmt.Errorf("%w: %v", ErrOutOfGas, err)
			}
			// for tracing: this gas consumption event is emitted below in the debug section.
			if contract.Gas < dynamicCost {
				return nil, ErrOutOfGas
			} else {
				contract.Gas -= dynamicCost
			}
		}

		if memorySize > 0 {
			mem.Resize(memorySize)
		}
		// ... (debug tracing) ...
		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
		if err != nil {
			break
		}
		pc++
	}

	if err == errStopToken {
		err = nil // clear stop token error
	}

	return res, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// executionFunc is the actual opcode function.
type executionFunc func(pc *uint64, interpreter *EVMInterpreter, callContext *ScopeContext) ([]byte, error)

// gasFunc is the gas function for an opcode.
type gasFunc func(*EVM, *Contract, *Stack, *Memory, uint64) (uint64, error) // last parameter is the requested memory size as a uint64

// memorySizeFunc returns the required size, and whether the operation overflowed a uint64
type memorySizeFunc func(*Stack) (size uint64, overflow bool)

// operation represents an instruction in the EVM
type operation struct {
	// execute is the operation function
	execute     executionFunc
	constantGas uint64
	dynamicGas  gasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max length the stack can have for this operation
	// to not overflow the stack.
	maxStack int

	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// undefined denotes if the instruction is not officially defined in the jump table
	undefined bool
}

// JumpTable contains the EVM opcodes supported at a given fork.
type JumpTable [256]*operation

// newCancunInstructionSet returns the Cancun instructions
// that can be executed during the Cancun phase.
func newCancunInstructionSet() JumpTable {
	instructionSet := newShanghaiInstructionSet()
	enable4844(&instructionSet) // EIP-4844 (BLOBHASH opcode)
	enable7516(&instructionSet) // EIP-7516 (BLOBBASEFEE opcode)
	enable1153(&instructionSet) // EIP-1153 "Transient Storage"
	enable5656(&instructionSet) // EIP-5656 (MCOPY opcode)
	enable6780(&instructionSet) // EIP-6780 SELFDESTRUCT only in same transaction
	return validate(instructionSet)
}

// newFrontierInstructionSet returns the frontier instructions
// that can be executed during the frontier phase.
func newFrontierInstructionSet() JumpTable {
	tbl := JumpTable{
		// ...
		JUMP: {
			execute:     opJump,
			constantGas: GasMidStep,
			minStack:    minStack(1, 0),
			maxStack:    maxStack(1, 0),
		},
		JUMPI: {
			execute:     opJumpi,
			constantGas: GasSlowStep,
			minStack:    minStack(2, 0),
			maxStack:    maxStack(2, 0),
		},
		// ...
		CREATE: {
			execute:     opCreate,
			constantGas: params.CreateGas,
			dynamicGas:  gasCreate,
			minStack:    minStack(3, 1),
			maxStack:    maxStack(3, 1),
			memorySize:  memoryCreate,
		},
		CALL: {
			execute:     opCall,
			constantGas: params.CallGasFrontier,
			dynamicGas:  gasCall,
			minStack:    minStack(7, 1),
			maxStack:    maxStack(7, 1),
			memorySize:  memoryCall,
		},
		// ...
	}

	// Fill all unassigned slots with opUndefined.
	for i, entry := range tbl {
		if entry == nil {
			tbl[i] = &operation{execute: opUndefined, maxStack: maxStack(0, 0), undefined: true}
		}
	}

	return validate(tbl)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opJump(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.evm.abort.Load() {
		return nil, errStopToken
	}
	pos := scope.Stack.pop()
	if !scope.Contract.validJumpdest(&pos) {
		return nil, ErrInvalidJump
	}
	*pc = pos.Uint64() - 1 // pc will be increased by the interpreter loop
	return nil, nil
}

func opJumpi(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.evm.abort.Load() {
		return nil, errStopToken
	}
	pos, cond := scope.Stack.pop(), scope.Stack.pop()
	if !cond.IsZero() {
		if !scope.Contract.validJumpdest(&pos) {
			return nil, ErrInvalidJump
		}
		*pc = pos.Uint64() - 1 // pc will be increased by the interpreter loop
	}
	return nil, nil
}

func opCall(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	stack := scope.Stack
	// Pop gas. The actual gas in interpreter.evm.callGasTemp.
	// We can use this as a temporary value
	temp := stack.pop()
	gas := interpreter.evm.callGasTemp
	// Pop other call parameters.
	addr, value, inOffset, inSize, retOffset, retSize := stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop()
	toAddr := common.Address(addr.Bytes20())
	// Get the arguments from the memory.
	args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	if interpreter.readOnly && !value.IsZero() {
		return nil, ErrWriteProtection
	}
	if !value.IsZero() {
		gas += params.CallStipend
	}
	ret, returnGas, err := interpreter.evm.Call(scope.Contract.Address(), toAddr, args, gas, &value)

	if err != nil {
		temp.Clear()
	} else {
		temp.SetOne()
	}
	stack.push(&temp)
	if err == nil || err == ErrExecutionReverted {
		scope.Memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}

	scope.Contract.RefundGas(returnGas, interpreter.evm.Config.Tracer, tracing.GasChangeCallLeftOverRefunded)

	interpreter.returnData = ret
	return ret, nil
}

func opRevert(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	offset, size := scope.Stack.pop(), scope.Stack.pop()
	ret := scope.Memory.GetCopy(offset.Uint64(), size.Uint64())

	interpreter.returnData = ret
	return ret, ErrExecutionReverted
}

func opUndefined(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	return nil, &ErrInvalidOpCode{opcode: OpCode(scope.Contract.Code[*pc])}
}

func opStop(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	return nil, errStopToken
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef
type Contract struct {
	// ...
	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  bitvec                 // Locally cached result of JUMPDEST analysis

	Code     []byte
	CodeHash common.Hash
	// ...
}

func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64WithOverflow()
	// PC cannot go beyond len(code) and certainly can't be bigger than 63bits.
	// Don't bother checking for JUMPDEST in that case.
	if overflow || udest >= uint64(len(c.Code)) {
		return false
	}
	// Only JUMPDESTs allowed for destinations
	if OpCode(c.Code[udest]) != JUMPDEST {
		return false
	}
	return c.isCode(udest)
}

// isCode returns true if the provided PC location is an actual opcode, as
// opposed to a data-segment following a PUSHN operation.
func (c *Contract) isCode(udest uint64) bool {
	// Do we already have an analysis laying around?
	if c.analysis != nil {
		return c.analysis.codeSegment(udest)
	}
	// Do we have a contract hash already?
	// If we do have a hash, that means it's a 'regular' contract. For regular
	// contracts ( not temporary initcode), we store the analysis in a map
	if c.CodeHash != (common.Hash{}) {
		// Does parent context have the analysis?
		analysis, exist := c.jumpdests[c.CodeHash]
		if !exist {
			// Do the analysis and save in parent context
			// We do not need to store it in c.analysis
			analysis = codeBitmap(c.Code)
			c.jumpdests[c.CodeHash] = analysis
		}
		// Also stash it in current contract for faster access
		c.analysis = analysis
		return analysis.codeSegment(udest)
	}
	// We don't have the code hash, most likely a piece of initcode not already
	// in state trie. In that case, we do an analysis, and save it locally, so
	// we don't have to recalculate it for every JUMP instruction in the execution
	// However, we don't save it within the parent context
	if c.analysis == nil {
		c.analysis = codeBitmap(c.Code)
	}
	return c.analysis.codeSegment(udest)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis_legacy.go">
```go
// bitvec is a bit vector which maps bytes in a program.
// An unset bit means the byte is an opcode, a set bit means
// it's data (i.e. argument of PUSHxx).
type bitvec []byte

// ... (bitvec methods) ...

// codeSegment checks if the position is in a code segment.
func (bits *bitvec) codeSegment(pos uint64) bool {
	return (((*bits)[pos/8] >> (pos % 8)) & 1) == 0
}

// codeBitmap collects data locations in code.
func codeBitmap(code []byte) bitvec {
	// The bitmap is 4 bytes longer than necessary, in case the code
	// ends with a PUSH32, the algorithm will set bits on the
	// bitvector outside the bounds of the actual code.
	bits := make(bitvec, len(code)/8+1+4)
	return codeBitmapInternal(code, bits)
}

// codeBitmapInternal is the internal implementation of codeBitmap.
// It exists for the purpose of being able to run benchmark tests
// without dynamic allocations affecting the results.
func codeBitmapInternal(code, bits bitvec) bitvec {
	for pc := uint64(0); pc < uint64(len(code)); {
		op := OpCode(code[pc])
		pc++
		if int8(op) < int8(PUSH1) { // If not PUSH (the int8(op) > int(PUSH32) is always false).
			continue
		}
		numbits := op - PUSH1 + 1
		if numbits >= 8 {
			for ; numbits >= 16; numbits -= 16 {
				bits.set16(pc)
				pc += 16
			}
			for ; numbits >= 8; numbits -= 8 {
				bits.set8(pc)
				pc += 8
			}
		}
		// ... (switch for remaining numbits) ...
	}
	return bits
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// runBn256Pairing implements the Bn256Pairing precompile, referenced by both
// Byzantium and Istanbul operations.
func runBn256Pairing(input []byte) ([]byte, error) {
	// Handle some corner cases cheaply
	if len(input)%192 > 0 {
		return nil, errBadPairingInput
	}
	// Convert the input into a set of coordinates
	var (
		cs []*bn256.G1
		ts []*bn256.G2
	)
	for i := 0; i < len(input); i += 192 {
		c, err := newCurvePoint(input[i : i+64])
		if err != nil {
			return nil, err
		}
		t, err := newTwistPoint(input[i+64 : i+192])
		if err != nil {
			return nil, err
		}
		cs = append(cs, c)
		ts = append(ts, t)
	}
	// Execute the pairing checks and return the results
	if bn256.PairingCheck(cs, ts) {
		return true32Byte, nil
	}
	return false32Byte, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// gasSStoreEIP2200 implements the gas ruls for SStore when EIP2200 is active
func gasSStoreEIP2200(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// If we fail the minimum gas availability invariant, fail (0)
	if contract.Gas <= params.SstoreSentryGasEIP2200 {
		return 0, errors.New("not enough gas for reentrancy sentry")
	}
	// Gas sentry honoured, do the actual gas calculation based on the stored value
	var (
		y, x    = stack.Back(1), stack.Back(0)
		current = evm.StateDB.GetState(contract.Address(), x.Bytes32())
	)
	value := common.Hash(y.Bytes32())

	if current == value { // noop (1)
		return params.SloadGasEIP2200, nil
	}
	original := evm.StateDB.GetCommittedState(contract.Address(), x.Bytes32())
	if original == current {
		if original == (common.Hash{}) { // create slot (2.1.1)
			return params.SstoreSetGasEIP2200, nil
		}
		if value == (common.Hash{}) { // delete slot (2.1.2b)
			evm.StateDB.AddRefund(params.SstoreClearsScheduleRefundEIP2200)
		}
		return params.SstoreResetGasEIP2200, nil // write existing slot (2.1.2)
	}
	if original != (common.Hash{}) {
		if current == (common.Hash{}) { // recreate slot (2.2.1.1)
			evm.StateDB.SubRefund(params.SstoreClearsScheduleRefundEIP2200)
		} else if value == (common.Hash{}) { // delete slot (2.2.1.2)
			evm.StateDB.AddRefund(params.SstoreClearsScheduleRefundEIP2200)
		}
	}
	if original == value {
		if original == (common.Hash{}) { // reset to original inexistent slot (2.2.2.1)
			evm.StateDB.AddRefund(params.SstoreSetGasEIP2200 - params.SloadGasEIP2200)
		} else { // reset to original existing slot (2.2.2.2)
			evm.StateDB.AddRefund(params.SstoreResetGasEIP2200 - params.SloadGasEIP2200)
		}
	}
	return params.SloadGasEIP2200, nil // dirty update (2.2)
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt specifies a very advanced feature set, including dynamic branch prediction and hot path optimization, which are typically found in Just-In-Time (JIT) compilers, not simple interpreters. The Go-Ethereum (Geth) EVM is an interpreter and does not implement these dynamic features.

- The prompt's data structures like `BranchPredictionAnalyzer`, `BranchHistory`, `PredictionTable`, and `HotPathTracker` are novel and do not have direct equivalents in Geth. The provided Geth context focuses on areas where *static* analysis and compiler hints (`@branchHint` in Zig) could be applied, which is a more realistic first step for an interpreter-based EVM.

- The idea of using static hints for different opcodes (`JUMPI`, `CALL`, `REVERT`) and for various checks (gas, stack) is sound. The provided Geth code shows the exact locations for these control flow operations and checks, which are the ideal places to integrate such hints. The `JumpTable` structure in Geth is a good model for how to centralize static opcode-based information.

- The concept of analyzing bytecode for `JUMPDEST` validity is a form of static analysis that Geth performs. The provided snippets from `contract.go` and `analysis_legacy.go` show how this is done and can serve as a foundation for more advanced static analysis to generate branch hints.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm *EVM
	cfg Config

	hasher    crypto.KeccakState
	hasherBuf common.Hash

	readOnly   bool   // whether to throw on state modifying opcodes
	returnData []byte // last CALL's return data for subsequent reuse
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for
// errExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Make sure the interpreter is not exceeding the maximum call depth
	if in.evm.depth > int(params.CallCreateDepth) {
		return nil, ErrDepth
	}
	// Don't change the readonly modifier on subsequent calls.
	if in.readOnly {
		// Child calls are also readonly, regardless of the 'static' flag.
		in.cfg.ReadOnly = true
	}
	// Reset the previous return data. It's persistent plain bytes,
	// we can reuse it between calls.
	in.returnData = nil

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond 2^64. The PC wrap around
		// is handled by the contractPC method.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64
		gasCopy uint64
		res     []byte
	)
	contract.Input = input

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	if in.cfg.Tracer != nil {
		in.cfg.Tracer.OnEnter(in.evm.depth, 0, contract.Address(), contract.Address(), input, contract.Gas, in.cfg.ReadOnly)
	}
	defer func() {
		if err != nil && in.cfg.Tracer != nil {
			in.cfg.Tracer.OnExit(in.evm.depth, nil, 0, err)
		}
	}()

	// The Interpreter main run loop
	for {
		if in.cfg.Tracer != nil {
			pcCopy = pc
			gasCopy = contract.Gas
		}
		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			return nil, &ErrInvalidOpcode{opcode: op}
		}

		// ... (gas and stack validation)

		// Static calls can't write to state
		if in.readOnly && operation.writes {
			return nil, ErrWriteProtection
		}

		// Execute the operation
		res, err = operation.execute(&pc, in, callContext)
		// ... (error handling)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opJumpi(pc *uint64, in *EVMInterpreter, callContext *callCtx) ([]byte, error) {
	// Note, the callContext is only valid for the current call, it can't be
	// modified directly, and is not supposed to be passed to other calls.
	// We don't need to reset the callContext since it's not a pointer.
	// See also: https://github.com/ethereum/go-ethereum/pull/23933
	callContext.mu.Lock()
	defer callContext.mu.Unlock()

	// Pop destination and condition from the stack
	dst, cond := in.stack.pop(), in.stack.pop()

	// If the condition is non-zero, jump to the destination
	if !cond.IsZero() {
		// The JUMP instruction is only allowed to jump to destinations that
		// are marked as valid jump destinations. This is checked by using a
		// bit map stored in the contract.
		if !in.evm.interpreter.cfg.DisableJumpiCheck && !in.evm.ActivePrecompiles.IsJumpi(dst) {
			if !in.contract.jumpdests.has(dst) {
				return nil, &ErrInvalidJump{Dest: dst.Uint64()}
			}
		}
		// Set the program counter to the destination. Do not add yet because
		// the PC is expected to be incremented inside the loop.
		*pc = dst.Uint64()
	} else {
		// Continue with the next instruction
		*pc++
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// JumpAnalysis performs a one-pass analysis of the given code, returning a bit map of
// valid jump destinations.
func JumpAnalysis(code []byte) bitvec {
	// The analysis is implemented as a stack machine.
	var (
		stack = new(intStack)
		// Don't try to reuse jumpdests, it may be used by different contracts.
		// And also it is a bit map, it's not easy to be reused.
		jumpdests = bitvec(make([]byte, len(code)/8+1))
		// For each position in the code, we want to know how many items are on the stack.
		// For the purpose of jumpdest analysis, we're only interested in the _size_ of the stack,
		// not its contents.
		// The stack size is tracked for each position in the code.
		stackHeights = make(map[uint64]int)
	)

	// Perform a single pass of the code
	for pc := uint64(0); pc < uint64(len(code)); pc++ {
		op := OpCode(code[pc])

		var (
			stackNeed int
			stackAdd  int
		)

		// Validate stack
		stackNeed, stackAdd = stackreqs[op]
		if stack.len() < stackNeed {
			// This can happen in case of invalid code, where the JUMPDEST is not
			// reachable during normal execution.
			// It is not allowed to jump to this position, so we do nothing.
			continue
		}
		// Pop the items from the stack
		if stackNeed > 0 {
			stack.pop(stackNeed)
		}
		if op >= PUSH1 && op <= PUSH32 {
			// PUSH is a special case, it adds an item to the stack. The size of the
			// pushed data is between 1 and 32 bytes, and is determined by the opcode.
			stackAdd = 1
			// The data bytes are skipped.
			pc += uint64(op - PUSH1 + 1)
		}
		// Add the new items to the stack.
		if stackAdd > 0 {
			stack.push(stackAdd)
		}

		// If the operation is a JUMPDEST, then it's a valid destination.
		if op == JUMPDEST {
			// We don't care if the same pestoition is marked more than once.
			jumpdests.set(pc)
		}
		// Track the stack height at the next instruction.
		stackHeights[pc+1] = stack.len()
	}
	return jumpdests
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of address(this) in the Yul specification.
	// Changing this seems to be only useful for tests.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests bitvec // result of JUMPDEST analysis.
	code      []byte
	CodeHash  common.Hash
	Input     []byte

	Gas   uint64
	value *big.Int
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{caller: caller, self: object, value: value, Gas: gas}

	if object != nil {
		// No need to copy the address. The LValue of the caller is not a pointer.
		c.CallerAddress = object.Address()
	}
	return c
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/logger.go">
```go
// StructLogger is a structured logger for EVM state transitions.
//
// StructLogger can be used to capture execution traces of transactions straight
// from the EVM and parameterize them with various details.
type StructLogger struct {
	cfg Config

	storage map[common.Hash]common.Hash
	logs    []*types.Log
	depth   int
	err     error

	logsMu sync.Mutex
}

// OnOpcode captures a single EVM opcode call and can be used as a callback for the EVM
// tracer hooks.
func (l *StructLogger) OnOpcode(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	l.captureState(pc, op, gas, cost, scope, rData, depth, err)
}
//...
// captureState logs a new structured log message for a single EVM instruction.
func (l *StructLogger) captureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// ... (implementation detail)
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt is well-structured and detailed. Here is one minor correction for added clarity:

1.  **Hardcoded Branch Hints**: In `Task 3: Optimize Control Flow Operations`, the `execute_jumpi` function includes hardcoded `@branchHint` calls:
    ```zig
    if (condition) {
        @branchHint(.likely);
    //...
    } else {
        @branchHint(.unlikely);
    }
    ```
    This is a simplification. The purpose of the `BranchPredictionAnalyzer` is to provide *dynamic* or *statically-analyzed* hints. A more accurate integration would use the prediction result from the analyzer to determine the hint, rather than assuming one path is always more likely. The code in `Task 2: Integrate with VM Execution` (`apply_branch_optimization` function) correctly demonstrates this by using the `prediction.static_hint` value. The implementation should follow the pattern from Task 2.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
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

package vm

import (
	"math/big"
)

// This file contains the EVM bytecode static analysis tool. The purpose of this is to
// generate meta-information about a contract's code at deploy time so that the EVM
// does not need to re-evaluate this during execution.

// destinations contains the results of the jump analysis.
// For each method, it holds a mapping from instruction offsets to code offsets.
type destinations map[uint64]map[uint64]struct{}

// analyse performs a jump analysis on the given bytecode.
func analyse(code []byte) destinations {
	// Do a preliminary analysis of the code and contracts to only analyse contracts
	// that are newly seen.
	// The analysis performs a single pass over the code and constructs a jump table
	// and verifies that each jump destination is valid.
	dests := destinations{0: map[uint64]struct{}{}}

	// TODO: methods
	var (
		currentMethod uint64
	)
	for pc := uint64(0); pc < uint64(len(code)); pc++ {
		op := OpCode(code[pc])

		switch op {
		case JUMPDEST:
			dests[currentMethod][pc] = struct{}{}
		case PUSH1, PUSH2, PUSH3, PUSH4, PUSH5, PUSH6, PUSH7, PUSH8, PUSH9, PUSH10, PUSH11, PUSH12, PUSH13, PUSH14, PUSH15, PUSH16, PUSH17, PUSH18, PUSH19, PUSH20, PUSH21, PUSH22, PUSH23, PUSH24, PUSH25, PUSH26, PUSH27, PUSH28, PUSH29, PUSH30, PUSH31, PUSH32:
			pc += uint64(op - PUSH1 + 1)
		}
	}
	return dests
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
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
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	//
	// Note this is not the actual caller either but the call's context.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  bitvec         // result of CODECOPY analysis.

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	value *big.Int
	Args  []byte

	DelegateCall bool
}

// NewContract returns a new contract environment for the execution of EVM bytecode.
func NewContract(caller, object ContractRef, value *big.Int, gas uint64) *Contract {
	// The caller is the contract which has initiated the current execution.
	// The self is the contract to which the call was made.
	//
	// Note that during a DELEGATECALL the self address will be the caller's
	// address.
	contract := &Contract{
		caller:        caller,
		self:          object,
		value:         new(big.Int),
		jumpdests:     make(destinations),
		CallerAddress: caller.Address(),
	}
	if value != nil {
		contract.value.Set(value)
	}

	return contract
}

// validJumpdest checks whether the given destination is a valid jump destination.
func (c *Contract) validJumpdest(dest *big.Int) bool {
	udest := dest.Uint64()
	// The JUMPDEST location must be within the code bounds
	if dest.IsUint64() && udest < uint64(len(c.Code)) {
		// It must be a JUMPDEST instruction
		if OpCode(c.Code[udest]) != JUMPDEST {
			return false
		}
		// The JUMPDEST must be on a valid code path. This is not checked
		// for backwards compatibility, see EIP-4200.
		return true
	}
	return false
}

// SetCode sets the contract's code and also performs JUMPDEST analysis.
func (c *Contract) SetCode(hash common.Address, code []byte) {
	c.Code = code
	c.CodeHash = crypto.Keccak256Hash(code)
	c.jumpdests = analyse(code)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
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

package vm

import "github.com/ethereum/go-ethereum/params"

// JumpTable contains the EVM instructions mapped by their corresponding op code.
type JumpTable [256]operation

// newhomesteadInstructionSet returns the frontier instruction set.
func newHomesteadInstructionSet() JumpTable {
	return JumpTable{
		STOP:       {executeStop, 0, 0, 0},
		ADD:        {executeAdd, 3, 2, 1},
		// ... (many opcodes) ...
		JUMP:       {executeJump, 8, 1, 0},
		JUMPI:      {executeJumpi, 10, 2, 0},
		PC:         {executePC, 2, 0, 1},
		// ... (many opcodes) ...
	}
}

// newByzantiumInstructionSet returns the Byzantium instruction set.
// The Byzantium instruction set includes the three new opcodes
// defined in EIP-649, EIP-658 and EIP-140.
func newByzantiumInstructionSet() JumpTable {
	jt := newHomesteadInstructionSet()
	jt[STATICCALL] = operation{executeStaticCall, 700, 6, 1}
	jt[RETURNDATACOPY] = operation{executeReturnDataCopy, 3, 3, 0}
	jt[RETURNDATASIZE] = operation{executeReturnDataSize, 2, 0, 1}
	jt[REVERT] = operation{executeRevert, 0, 2, 0}
	return jt
}

// ... other instruction set constructors for different forks
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
	"math/big"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/params"
)

// Run executes the given contract and returns the output as a byte slice and
// an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation except for
// errExecutionReverted which means revert-and-keep-gas-left.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup code) ...

	// The Interpreter main loop. This loop will continue until execution ends
	// with STOP, RETURN, REVERT or an error.
	for {
		// ... (tracing and gas check code) ...

		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			return nil, &ErrInvalidOpCode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Execute the operation
		res, err := operation.execute(&pc, in, contract, mem, stack)

		// ... (error and return handling) ...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
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
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
)
// ...

func opJump(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	dest := stack.pop()
	if !contract.validJumpdest(dest) {
		return nil, ErrInvalidJump
	}
	*pc = dest.Uint64()
	return nil, nil
}

func opJumpi(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	dest, cond := stack.pop(), stack.pop()
	if !cond.IsZero() {
		if !contract.validJumpdest(dest) {
			return nil, ErrInvalidJump
		}
		*pc = dest.Uint64()
	} else {
		*pc++
	}
	return nil, nil
}

// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiles.go">
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
	"crypto/sha256"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
	"golang.org/x/crypto/ripemd160"
)

// PrecompiledContract is the interface that a precompiled contract is expected to implement.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}

// PrecompiledContracts an interface for the state of a contract defined in the黄皮书
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

// dataCopy implements the PrecompiledContract interface for the identity function.
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
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return data and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means a valid revert instruction was executed.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.depth++
	defer func() { in.depth-- }()

	// Make sure the interpreter is not exceeding the call depth limit
	if in.depth > int(params.CallCreateDepth) {
		return nil, ErrDepth
	}
	// Make sure the interpreter is not executing in readonly mode.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}
	// Reset the previous call's return data. It's important to do this before
	// starting a new call since the return data is determined by the last call.
	in.returnData = nil

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go above 2^64. The YP defines the PC
		// to be uint256. Practically much smaller PC is possible.
		pc   = uint64(0) // program counter
		gas  = contract.Gas
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the deferred logger
		gasCopy uint64 // for logging
		logged  bool   // deferred logger should ignore already logged steps
		res     []byte // result of the opcode execution function
	)
	// Don't allocate err if not needed.
	var vmerr error
	contract.Input = input

	// The Interpreter main run loop. This loop will continue until execution of
	// the contract is completed or an error is returned.
	for {
		if in.cfg.Tracer != nil && !logged {
			in.cfg.Tracer.CaptureState(in.evm, pc, op, gas, cost, mem, stack, contract, in.depth, vmerr)
		}
		// Get next opcode from the jump table
		op = contract.GetOp(pc)
		// Validate stack
		if err := op.validateStack(stack); err != nil {
			return nil, err
		}
		// Execute the operation
		switch op {
		case JUMP, JUMPI:
			res, err = op.execute(&pc, in, contract, mem, stack)
		default:
			res, err = op.execute(&pc, in, contract, mem, stack)
		}
		// If the preparation of the exec function returned an error, return
		if err != nil {
			return nil, err
		}
		// Every step, watch for cancellation from the outside world.
		if in.evm.Cancelled() {
			return nil, errCancelled
		}
		pc++

		// if the interpreter returned a result means it has halted returning
		// value to the parent context.
		if res != nil {
			return res, nil
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
func opJump(pc *uint64, i *Interpreter, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	dest := stack.pop()
	if !contract.validJumpdest(dest) {
		return nil, ErrInvalidJump
	}
	*pc = dest.Uint64()
	return nil, nil
}

func opJumpi(pc *uint64, i *Interpreter, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	dest, cond := stack.pop(), stack.peek()
	if !cond.IsZero() {
		if !contract.validJumpdest(dest) {
			return nil, ErrInvalidJump
		}
		*pc = dest.Uint64()
	} else {
		*pc++
	}
	stack.pop()
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  bitvec       // result of analysis.

	Code     []byte
	CodeHash common.Hash
	Input    []byte
	Gas      uint64
	value    *uint256.Int
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *uint256.Int, gas uint64) *Contract {
	c := &Contract{caller: caller, self: object, value: value, Gas: gas}

	if object != nil {
		// No need to run analysis on precompiled contracts.
		if p, ok := precompiledContracts[object.Address()]; !ok || (p == nil) {
			// If the contract is not a precompiled contract, we should analysze the code.
			// But even if the code is empty, we still need to run analysis, e.g. for
			// determining `CodeHash`.
			c.Code = object.Code()
			c.CodeHash = object.CodeHash()
			c.analysis, _ = analyse(c.Code)
		}
		c.CallerAddress = caller.Address()
	}
	return c
}

// GetOp returns the n'th element in the contract's byte code
func (c *Contract) GetOp(n uint64) OpCode {
	if n < uint64(len(c.Code)) {
		return OpCode(c.Code[n])
	}
	return STOP
}

// validJumpdest returns whether the given destination is a valid JUMPDEST.
func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest := dest.Uint64()
	// The JUMPDEST location must be within the program bounds
	if udest >= uint64(len(c.Code)) {
		return false
	}
	// The JUMPDEST location must be an actual JUMPDEST opcode
	if OpCode(c.Code[udest]) != JUMPDEST {
		return false
	}
	// The JUMPDEST location must be on a valid code path
	if !c.analysis.isCode(udest) {
		return false
	}
	return true
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
package vm

import "github.com/ethereum/go-ethereum/params"

// bitvec is a bit vector which can be used to track metadata of a contract's
// code.
type bitvec []byte

// op represents an operation with its position in the code.
type op struct {
	loc  uint64
	code OpCode
}

// isCode returns whether the position is an opcode, not data.
func (b bitvec) isCode(pos uint64) bool {
	if pos >= uint64(len(b)*8) {
		return false
	}
	return (b[pos/8] & (1 << (pos % 8))) != 0
}

// destinations is a sorted list of valid jump destinations.
type destinations []uint64

// analyse is a helper function that performs a number of checks on the contract
// code and constructs a jump destination table.
//
// The last return value is a list of found JUMPDEST locations, sorted.
// It is only intended to be used for testing, and can be removed.
func analyse(code []byte) (bitvec, destinations) {
	// Avoid doing analysis on empty contracts.
	if len(code) == 0 {
		return bitvec{}, nil
	}
	// The analysis loop requires a very large amount of gas to complete, that's why
	// we have this hard limit. But this is not a consensus rule, just a safety-net.
	if len(code) >= params.MaxCodeSize {
		return bitvec{}, nil
	}
	var (
		// Don't allocate the bitvec on the stack, it's too large
		analysis = new(bitvec)
		// We're using a stack to iterate through the code recursively.
		ops       = []op{{0, OpCode(code[0])}}
		dests     = make(destinations, 0, 10)
		gas       = uint64(len(code) * 3) // Gas to consume during analysis
		pc        = uint64(0)             // Current position in the code
		prevop    = op{}                  // Previous op-code
		stopped   = false                 // Contract has stopped, no further analysis necessary
		opcount   = 0                     // Number of operations analysed
		maxopcount= len(code) * 3
	)
	*analysis = make(bitvec, (len(code)+7)/8)

	for len(ops) > 0 {
		// Pop the next instruction from the stack
		opcount++
		op := ops[len(ops)-1]
		ops = ops[:len(ops)-1]

		pc = op.loc
		// If the gas is depleted, we're not doing any further analysis
		if gas == 0 {
			continue
		}
		gas--

		// If the operation is not a valid opcode, then all following operations
		// are invalid.
		if op.code > PUSH32 && op.code != JUMPDEST {
			stopped = true
		}
		// If the contract is stopped, we're not doing any further analysis.
		if stopped || pc >= uint64(len(code)) {
			stopped = true
			continue
		}
		// If we've already analysed this part of the code, skip.
		if analysis.isCode(pc) {
			continue
		}
		analysis.set(pc)

		if op.code == JUMPDEST {
			dests = append(dests, pc)
		}

		switch op.code {
		case JUMP:
			// JUMP is a tricky opcode. It depends on the stack in order to
			// figure out the next instruction. We can't know the stack so
			// we have to abort analysis at this point.
			stopped = true

		case JUMPI:
			// JUMPI is just like JUMP, we can't figure out the next instruction
			// on the stack. But we do know that it can also be a NOP.
			ops = append(ops, opAt(pc+1, code))
		case JUMPTO, JUMPTOI, JUMPV, JUMPSUB, JUMPV_I, JUMPSUBV, BEGINSUB, BEGINDATA, RETURNSUB, DELEGATECALL, RETF, EXTCALL, EXTDELEGATECALL, CREATE, CALL, CALLCODE, RETURN, REVERT, SELFDESTRUCT, CREATE2, EXTSTATICCALL:
			// These are all stopping opcodes. They do not branch any further.
			stopped = true

		case RJUMP, RJUMPI, RJUMPV:
			// Relative jumps hardcode the destination, so we can do a limited
			// analysis on them.
			offset, err := readOprand(pc, code, 2)
			if err != nil {
				stopped = true
				break
			}
			dest := pc + 3 + offset
			ops = append(ops, opAt(dest, code))
			// JUMPI and JUMPV also continue to the next op, so add that too.
			if op.code != RJUMP {
				ops = append(ops, opAt(pc+3, code))
			}

		case PUSH1, PUSH2, PUSH3, PUSH4, PUSH5, PUSH6, PUSH7, PUSH8, PUSH9, PUSH10, PUSH11, PUSH12, PUSH13, PUSH14, PUSH15, PUSH16, PUSH17, PUSH18, PUSH19, PUSH20, PUSH21, PUSH22, PUSH23, PUSH24, PUSH25, PUSH26, PUSH27, PUSH28, PUSH29, PUSH30, PUSH31, PUSH32:
			// PUSH is a special case. It pushes a value on the stack. We have to
			// add the next instruction to the stack which is pc + size + 1
			pc += uint64(op.code-PUSH1) + 1
			fallthrough
		default:
			// All other instructions are plain and simple.
			ops = append(ops, opAt(pc+1, code))
		}
		// If we're doing a lot of operations, we probably have a circular
		// reference. Stop analysing.
		if opcount > maxopcount {
			stopped = true
		}
		prevop = op
	}
	// Sort the destinations
	dests.sort()

	// The analysis is empty if the code is empty.
	if len(code) == 0 {
		return nil, nil
	}
	return *analysis, dests
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// EVMLogger is used to collect execution traces from an EVM evaluation.
//
// The EVMLogger is called for each step of the EVM execution and is used
// to accumulate execution traces.
//
// Note, the EVMLogger is called for each step of the EVM, this means that
// the EVMLogger can be called with the same PC and stack multiple times
// during a single transaction.
type EVMLogger interface {
	// CaptureStart is called once before the start of execution.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// CaptureState is called after each EVM opcode execution.
	CaptureState(evm *EVM, pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	// CaptureFault is called when an error occurs during the execution of an EVM
	// opcode.
	CaptureFault(evm *EVM, pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	// CaptureEnd is called after the execution of the transaction and returns
	// the runtime error (if any)
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)
	// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	// CaptureExit is called when the EVM exits a scope, even if the scope didn't
	// execute any code.
	CaptureExit(output []byte, gasUsed uint64, err error)
}


// StructLogger is an EVM state logger and implements EVMLogger.
//
// StructLogger can be used to capture execution traces of transactions.
// Captured traces can be used in debugging to replay transactions.
type StructLogger struct {
	cfg Config

	storage map[common.Address]Storage
	logs    []StructLog
	output  []byte
	err     error

	interrupt         atomic.Bool // Atomic flag to signal execution interruption
	reason            error       // Textual reason for the interruption
	useBlockOverrides bool
}

// ...

// CaptureState logs a new structured log message and pushes it out to the environment
//
// CaptureState also tracks SLOAD/SSTORE ops to track storage change.
func (l *StructLogger) CaptureState(evm *EVM, pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// check if already accumulated the size of the response
	if l.cfg.Limit != 0 && len(l.logs) >= l.cfg.Limit {
		return
	}
	// Stop trace if interruption was requested
	if l.interrupt.Load() {
		evm.interpreter.Stop()
		return
	}
	// copy stack to a new slice
	stack := newstack()
	for _, item := range scope.Stack.Data() {
		stack.push(item.Copy())
	}
	// copy memory to a new slice
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}
	var returnData []byte
	if l.cfg.EnableReturnData {
		returnData = common.CopyBytes(rData)
	}

	// Copy a snapshot of the current storage to a new container
	var storage Storage
	if !l.cfg.DisableStorage && (op == SSTORE || op == SLOAD) {
		// initialise new changed values storage container for this contract
		// if not present.
		if l.storage[scope.Contract.Address()] == nil {
			l.storage[scope.Contract.Address()] = make(Storage)
		}
		// capture SLOAD opcodes and record the read entry in the local storage
		if op == SLOAD && stack.len() >= 1 {
			var (
				address = common.Hash(stack.data[stack.len()-1].Bytes32())
				value   = evm.StateDB.GetState(scope.Contract.Address(), address)
			)
			l.storage[scope.Contract.Address()][address] = value
			storage = l.storage[scope.Contract.Address()].Copy()
		} else if op == SSTORE && stack.len() >= 2 {
			// capture SSTORE opcodes and record the written entry in the local storage.
			var (
				value   = common.Hash(stack.data[stack.len()-2].Bytes32())
				address = common.Hash(stack.data[stack.len()-1].Bytes32())
			)
			l.storage[scope.Contract.Address()][address] = value
			storage = l.storage[scope.Contract.Address()].Copy()
		}
	}
	// create a new log entry
	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Memory:        memory,
		MemorySize:    scope.Memory.Len(),
		Stack:         stack.data,
		ReturnData:    returnData,
		Storage:       storage,
		Depth:         depth,
		RefundCounter: evm.StateDB.GetRefund(),
		Err:           err,
	}
	l.logs = append(l.logs, log)
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt's Zig implementation is an excellent, detailed starting point for what a branch prediction framework could look like in an EVM. However, there are a few points to clarify or correct when translating this concept to an existing, mature EVM implementation like `go-ethereum`:

1.  **Branch Hinting (`@branchHint`)**: The prompt's use of `@branchHint(.likely)` and `@branchHint(.unlikely)` is a Zig-specific compiler intrinsic. Go does not have a direct, stable equivalent that developers can use to guide the compiler's branch prediction. Go's compiler performs its own branch prediction analysis. The common Go idiom for this is structuring `if` statements so the common/fast path has no `err != nil` check. While `go-ethereum` does not explicitly use branch hints for `JUMPI`, the logic inside `opJumpi` (`if !cond.IsZero()`) is where such optimization would be relevant. A more practical implementation in Go would involve reordering the `if/else` blocks to place the more likely path first, though the performance gain from this is often minimal and dependent on the compiler's sophistication.

2.  **Static Analysis Location**: The `analyse` function in `core/vm/analysis.go` is the perfect place to implement static hint generation. It already produces a `jumpdest` bitmap. It could be extended to produce another bitmap or data structure indicating "likely" or "unlikely" jump targets based on surrounding opcode patterns (e.g., a `JUMPI` at the end of a sequence that looks like a loop is "likely taken").

3.  **Dynamic Prediction Integration**: The prompt suggests a `BranchPredictionAnalyzer` being called from the VM loop. `go-ethereum` has a precedent for this with its `EVMLogger` (tracer) interface. The `Interpreter.Run` method calls `Tracer.CaptureState` at every step. A dynamic branch prediction system could be implemented as a specialized type of `EVMLogger` that:
    *   On `CaptureState` for a `JUMPI`, it would consult its history to *predict* the outcome.
    *   After the `JUMPI` executes, a subsequent hook (or analysis of the next PC) would be needed to *update* the history with the actual outcome. This is the most significant integration point.

4.  **Hot Path Tracking**: This is a form of Profile-Guided Optimization (PGO). While Geth doesn't have this for general execution, a similar `EVMLogger` could be used to build a profile of executed instruction pointers (PCs) and basic block transitions. This profile could then be used in a JIT-compiler (if one were to be added) or an AOT-compiler to optimize bytecode layout, though this is a much more advanced feature than simple branch prediction.

In summary, the prompt's specifications are sound, but their implementation in Go would rely on adapting existing `go-ethereum` patterns:
*   **Static Analysis**: Extend `core/vm/analysis.go`.
*   **Dynamic Analysis & Feedback**: Implement a system similar to the `EVMLogger` in `core/vm/logger.go`.
*   **Integration**: Hook into `core/vm/interpreter.go`'s `Run` loop and modify the `JUMPI` logic in `core/vm/jump_table.go`.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
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
	"fmt"
	"math"
	"sync"
)

// JumpdestBitmap is a bit-vector of valid jump destinations.
// The benefit of using a bitmap is that it's faster and more memory-efficient
// than a map or a slice.
type JumpdestBitmap struct {
	// The backing-store of the bitmap, and the bit-length of the bitmap
	bitmap  []byte
	bitlen  int
	readMtx sync.RWMutex
}

// newBitmap creates a new bitmap of the given size. All bits are initialized to zero.
func newBitmap(size int) *JumpdestBitmap {
	return &JumpdestBitmap{bitmap: make([]byte, size/8+1), bitlen: size}
}

// Set sets the bit at the given position.
func (b *Jumpmobp) Set(pos uint64) {
	b.readMtx.Lock()
	defer b.readMtx.Unlock()
	b.bitmap[pos/8] |= 0x80 >> (pos % 8)
}

// IsSet returns true if the bit at the given position is set.
func (b *JumpdestBitmap) IsSet(pos uint64) bool {
	// Any position outside of the bitmap is invalid.
	if pos >= uint64(b.bitlen) {
		return false
	}
	b.readMtx.RLock()
	defer b.readMtx.RUnlock()
	return b.bitmap[pos/8]&(0x80>>(pos%8)) != 0
}

// CodeSegment represents a jump destination anlysis result for a given code.
// It is a bitmap where each bit corresponds to a byte in the code.
// The bit is set to 1 if the byte is a JUMPDEST instruction.
// The segments can be used to determine if a jump is valid.
type CodeSegment struct {
	// The bitmap of valid jump destinations.
	Bitmap *JumpdestBitmap
}

// IsJumpDest returns true if the given position is a valid jump destination.
func (c CodeSegment) IsJumpDest(pos uint64) bool {
	return c.Bitmap.IsSet(pos)
}

// codeAnalysis contains the results of a jump destination analysis.
type codeAnalysis struct {
	// The jump destinations, including the size of the code.
	jumpdests CodeSegment
}

var (
	analyserCacheLock sync.Mutex
	analyserCache     = make(map[common.Hash]*codeAnalysis)
)

// Analyse analyses the given code and returns the destinations.
func Analyse(code []byte) CodeSegment {
	// If the code is empty, return empty bits
	if len(code) == 0 {
		return CodeSegment{newBitmap(0)}
	}
	h := crypto.Keccak256Hash(code)
	analyserCacheLock.Lock()
	defer analyserCacheLock.Unlock()
	// Allready in cache?
	if analysis, exist := analyserCache[h]; exist {
		return analysis.jumpdests
	}

	analysis := &codeAnalysis{
		jumpdests: CodeSegment{newBitmap(len(code))},
	}
	for pc := uint64(0); pc < uint64(len(code)); {
		op := OpCode(code[pc])

		if op == JUMPDEST {
			analysis.jumpdests.Bitmap.Set(pc)
		} else if op.IsPush() {
			pc += uint64(op) - 0x5f
		}
		pc++
	}
	analyserCache[h] = analysis
	return analysis.jumpdests
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
//
// When a contract is created, it is given a separate memory space and has access
// to the persistent storage on the blockchain. A contract can call other
// contracts and can be called by other contracts.
type Contract struct {
	// CallerAddress is the address of the contract that initiated the current
	// message call. It is created by the contract's creator.
	CallerAddress common.Address
	// caller is a reference to the contract that initiated the current execution.
	caller ContractRef
	// self is a reference to the contract that is being executed.
	self ContractRef

	// jumpdests contains the valid jump destinations for the contract's code.
	jumpdests CodeSegment

	Code     []byte
	CodeHash common.Hash
	CodeAddr *common.Address
	Input    []byte

	Gas   uint64
	value *big.Int

	// Previously not part of the struct, but seems sensible to include it here
	Args []byte
}

// NewContract creates a new contract for the specified caller with the given
// code.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	contract := &Contract{CallerAddress: caller.Address(), caller: caller, self: object, Args: nil}

	if parent, ok := caller.(*Contract); ok {
		// The new contract gets the same code and jumpdest analysis as the
		// calling contract.
		contract.jumpdests = parent.jumpdests
		contract.Code = parent.Code
		contract.CodeHash = parent.CodeHash
		contract.CodeAddr = parent.CodeAddr
	}
	contract.Gas = gas
	contract.value = value

	return contract
}


// AsDelegate sets the contract to be a delegate call and returns the contract.
//
// Delegate calls are calls that execute code in the context of the caller, a
// contract can be responsible for executing code on behalf of another contract.
func (c *Contract) AsDelegate() *Contract {
	// NOTE: caller remains the same on delegate calls.
	c.self = c.caller
	// Code and code address is swapped, jumpdest are swapped too.
	// So that when JUMP/JUMPI is executed, it will use the callee's
	// jump destination bitmap.
	if parent, ok := c.caller.(*Contract); ok {
		c.Code = parent.Code
		c.CodeHash = parent.CodeHash
		c.CodeAddr = parent.CodeAddr
		c.jumpdests = parent.jumpdests
	}
	return c
}

// GetOp returns the n'th element in the contract's code.
func (c *Contract) GetOp(n uint64) OpCode {
	if n < uint64(len(c.Code)) {
		return OpCode(c.Code[n])
	}
	return STOP
}

// validJumpdest returns whether the given destination is a valid jump destination.
//
// A jump destination is valid if it is a JUMPDEST instruction.
// See EIP-2315 for more information.
func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64WithOverflow()
	// The only circumstance where we can have an overflow is on 32-bit platforms,
	// but this is not supported. We need to check for this case too.
	if overflow || udest >= uint64(len(c.Code)) {
		return false
	}
	// We usually have the jump destination bitmap, but if we don't, we have to
	// manually check the code.
	if c.jumpdests.Bitmap != nil {
		return c.jumpdests.IsJumpDest(udest)
	}
	return OpCode(c.Code[udest]) == JUMPDEST
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Loop is the main EVM execution loop.
// It is used to execute a contract's code.
// It will execute the code until it is halted or until an error is returned.
func (evm *EVM) Loop(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (initialization code omitted for brevity)

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &callCtx{   // call context for Interpreter
			memory:   mem,
			stack:    stack,
			contract: contract,
		}
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond 2^64. The YP defines the PC
		// to be uint256. Practically much smaller code size are seen.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the defer
		gasCopy uint64 // for Tracer to log gas remaining before execution
		logged  bool   // deferred logging executed with trace end
	)
	// ... (tracer setup omitted)

	// The Interpreter main loop will execute until something happens.
	for {
		// ... (tracer logging omitted)

		// Get the operation from the jump table and validate the stack.
		op = contract.GetOp(pc)
		operation := evm.interpreter.opd[op]
		if operation == nil {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Static calls can't alter state.
		if readOnly && evm.interpreter.readOnly && operation.writes {
			return nil, ErrWriteProtection
		}
		// Execute the operation
		var memorySize uint64
		// Don't expand memory for invalid opcodes
		if !operation.invalid {
			// calculate the new memory size and expand the memory
			memorySize, err = operation.memorySize(stack)
			if err != nil {
// ...
			}
			if memorySize > 0 {
				mem.Resize(memorySize)
			}
		}
		// consume the gas for the operation
		cost, err = operation.gasCost(evm, contract, stack, mem, memorySize)
		if err != nil || !contract.UseGas(cost) {
			return nil, ErrOutOfGas
		}

		// execute the operation
		res, err := operation.execute(&pc, evm, callContext)
		if err != nil {
			return nil, err
		}
		// if the operation is a return operation, return the data
		if operation.returns {
			return res, nil
		}
		// if the operation is a revert operation, return the data
		if operation.reverts {
			return res, ErrExecutionReverted
		}
		pc++
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/operations_acl.go">
```go
// opJumpi executes a conditional jump operation.
func opJumpi(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize *uint64) ([]byte, error) {
	pos, cond := stack.pop(), stack.pop()
	if !cond.IsZero() {
		if !contract.validJumpdest(pos) {
			return nil, ErrInvalidJump
		}
		*pc = pos.Uint64()
	} else {
		*pc++
	}
	return nil, nil
}

// opJump executes a jump operation.
func opJump(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize *uint64) ([]byte, error) {
	pos := stack.pop()
	if !contract.validJumpdest(pos) {
		return nil, ErrInvalidJump
	}
	*pc = pos.Uint64()
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
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

// JumpTable contains the EVM opcodes supported by a given interpreter.
type JumpTable [256]*operation

// newBerlinInstructionSet returns the supported opcodes of the Berlin fork.
func newBerlinInstructionSet() JumpTable {
	return JumpTable{
// ... (opcode definitions)
		JUMP: {
			execute:     opJump,
			gasCost:     gasMid,
			validate:    makeStackFunc(1, 0),
			minStack:    minStack(1, 0),
			maxStack:    maxStack(1, 0),
			writes:      false,
			valid:       true,
			jumps:       true,
			returns:     false,
			reverts:     false,
			invalid:     false,
			memorySize:  nil,
			constantGas: true,
		},
		JUMPI: {
			execute:     opJumpi,
			gasCost:     gasSlow,
			validate:    makeStackFunc(2, 0),
			minStack:    minStack(2, 0),
			maxStack:    maxStack(2, 0),
			writes:      false,
			valid:       true,
			jumps:       true,
			returns:     false,
			reverts:     false,
			invalid:     false,
			memorySize:  nil,
			constantGas: true,
		},
// ... (more opcode definitions)
	}
}

// newShanghaiInstructionSet returns the supported opcodes of the Shanghai fork.
func newShanghaiInstructionSet() JumpTable {
	// PUSH0 is the only new opcode in Shanghai
	// It's added to the instruction set.
	jt := newBerlinInstructionSet()
	jt[PUSH0] = &operation{
		execute:     opPush0,
		gasCost:     gasQuick,
		validate:    makeStackFunc(0, 1),
		minStack:    minStack(0, 1),
		maxStack:    maxStack(0, 1),
		constantGas: true,
	}
	return jt
}

// newCancunInstructionSet returns the supported opcodes of the Cancun fork.
func newCancunInstructionSet() JumpTable {
	// TLOAD, TSTORE, MCOPY, BLOBHASH, and BLOBBASEFEE are the new opcodes in Cancun
	// They are added to the instruction set.
	jt := newShanghaiInstructionSet()
	jt[TLOAD] = &operation{
		execute:     opTload,
		gasCost:     gasWarmAccess,
		validate:    makeStackFunc(1, 1),
		minStack:    minStack(1, 1),
		maxStack:    maxStack(1, 1),
		constantGas: true,
	}
// ... (rest of opcodes)
	return jt
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt's ELI5 explanation for branch prediction is excellent but subtly misaligned with how a simple EVM *interpreter* works. An interpreter typically follows a `fetch -> decode -> execute` loop and doesn't have an instruction pipeline to stall or speculatively execute code paths. The concept of "preparing the next instructions ahead of time" is a feature of hardware CPUs and Just-In-Time (JIT) compilers, not simple interpreters.

A more accurate "Why" section for an *interpreted* EVM would be:

**"Why (for an Interpreter):"**
While a simple interpreter doesn't have a hardware pipeline that can be stalled, using branch prediction techniques can still offer performance benefits. By analyzing branch history (`JUMPI`), we can provide hints to the host machine's CPU (via built-ins like Zig's `@branchHint` or C++'s `[[likely]]`/`[[unlikely]]`). This helps the *actual CPU* executing the EVM interpreter's code make better predictions, reducing misprediction penalties on the host and improving overall interpreter performance. Furthermore, identifying "hot paths" allows for future optimizations, such as generating specialized interpreter loops or preparing for a transition to a Just-In-Time (JIT) compilation model where these hints become even more critical.

The provided Zig code is well-structured for this purpose, as it correctly uses `@branchHint` to pass these hints to the underlying compiler and CPU. The provided Geth code shows how *static analysis* (`analysis.go`) is currently used to pre-calculate valid jump destinations, which is a conceptual predecessor to the more advanced static and dynamic analysis requested in the prompt.

