# Implement Branch Prediction Optimization

## What
<eli5>
Imagine you're driving and approaching traffic lights. If you could predict whether the light will be green or red, you could prepare by speeding up or slowing down in advance. Branch prediction is similar - the CPU tries to guess which direction the code will go (like "if this, then that") so it can prepare the next instructions ahead of time. When the prediction is right, everything runs smoothly. When it's wrong, the CPU has to stop and restart, which is slow.
</eli5>

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

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_branch_prediction_optimization` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_branch_prediction_optimization feat_implement_branch_prediction_optimization`
3. **Work in isolation**: `cd g/feat_implement_branch_prediction_optimization`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive branch prediction optimization to improve instruction pipeline efficiency and reduce branch misprediction penalties. This includes static branch prediction hints, dynamic branch prediction feedback, hot path optimization, and conditional execution optimization for critical EVM execution paths.

## ELI5

Imagine you're driving and approaching traffic lights. If you could predict whether the light will be green or red, you could prepare by speeding up or slowing down in advance. Branch prediction is similar - the CPU tries to guess which direction the code will go (like "if this, then that") so it can prepare the next instructions ahead of time. When the prediction is right, everything runs smoothly. When it's wrong, the CPU has to stop and restart, which is slow.

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Execution correctness** - Branch prediction must not affect program behavior
3. **Performance validation** - Must demonstrate measurable improvements
4. **Memory efficiency** - Prediction tables must have bounded memory usage
5. **Thread safety** - Concurrent access to prediction data must be safe
6. **Fallback safety** - Must work correctly when prediction fails

## References

- [Branch Prediction](https://en.wikipedia.org/wiki/Branch_predictor) - Branch prediction techniques and algorithms
- [CPU Pipeline](https://en.wikipedia.org/wiki/Instruction_pipelining) - Instruction pipeline and branch prediction impact
- [Profile-Guided Optimization](https://en.wikipedia.org/wiki/Profile-guided_optimization) - Runtime feedback optimization
- [Hot Path Optimization](https://en.wikipedia.org/wiki/Hot_spot_(computing)) - Hot path detection and optimization
- [Control Flow Graph](https://en.wikipedia.org/wiki/Control-flow_graph) - Control flow analysis techniques