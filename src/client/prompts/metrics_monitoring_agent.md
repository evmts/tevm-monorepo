# Metrics & Monitoring Analysis Agent

<context>
You are an expert in observability, performance monitoring, and distributed systems telemetry. You have deep knowledge of Prometheus metrics, OpenTelemetry, performance profiling, and real-time monitoring systems. Your task is to analyze Reth's metrics and monitoring implementation and create a plan for Zig.
</context>

<objective>
Analyze the Reth metrics and monitoring implementation and create a detailed breakdown of subtasks required to implement comprehensive observability in Zig. Focus on performance metrics, diagnostic capabilities, and integration with standard monitoring tools.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/metrics_monitoring_agent
   cd g/metrics_monitoring_agent
   ```

2. Create the directory for your task breakdown:
   ```bash
   mkdir -p src/client/prompts/metrics_monitoring
   ```

3. Analyze the following Reth crates and their components:
   - `reth/crates/metrics/` - Core metrics infrastructure
   - `reth/crates/node/metrics/` - Node metrics
   - `reth/crates/rpc/rpc-builder/src/metrics.rs` - RPC metrics
   - `reth/crates/net/network/src/metrics.rs` - Network metrics
   - `reth/crates/transaction-pool/src/metrics.rs` - Transaction pool metrics
   - `reth/crates/tracing/` - Tracing infrastructure

4. For each subtask you identify, create a markdown file with the naming pattern:
   `<priority>_<task_name>.md`

5. Each markdown file should contain:
   <task_structure>
   # Task Name

   ## Description
   Brief description of what this task accomplishes.

   ## Dependencies
   - **Blocks**: [List of task files this blocks]
   - **Blocked by**: [List of task files this depends on]

   ## Implementation Details
   Detailed explanation of what needs to be implemented.

   ## Reference Code
   - [Link to relevant Reth file](reth/crates/metrics/path/to/file.rs)
   - [Link to relevant test](reth/crates/metrics/path/to/test.rs)

   ## Zig Considerations
   Specific considerations for implementing in Zig.

   ## Acceptance Criteria
   - [ ] Criterion 1
   - [ ] Criterion 2
   - [ ] Tests pass

   ## Estimated Effort
   Small/Medium/Large (1-3 days, 3-7 days, 1-2 weeks)
   </task_structure>
</instructions>

<analysis_areas>
1. **Metrics Infrastructure**
   - Metric types (counters, gauges, histograms)
   - Metric registration
   - Label support
   - Metric collection
   - Memory efficiency

2. **Prometheus Integration**
   - Prometheus exporter
   - Metric formatting
   - HTTP endpoint
   - Scraping support
   - Metric metadata

3. **Core System Metrics**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network I/O
   - Thread counts

4. **Blockchain Metrics**
   - Block height
   - Block processing time
   - Transaction count
   - State size
   - Chain head tracking

5. **Network Metrics**
   - Peer count
   - Message rates
   - Bandwidth usage
   - Connection events
   - Protocol statistics

6. **RPC Metrics**
   - Request rates
   - Response times
   - Error rates
   - Method statistics
   - Connection counts

7. **Transaction Pool Metrics**
   - Pool size
   - Transaction rates
   - Eviction counts
   - Gas price statistics
   - Pending duration

8. **Performance Profiling**
   - CPU profiling
   - Memory profiling
   - Allocation tracking
   - Hot path identification
   - Flame graph support

9. **Tracing & Logging**
   - Structured logging
   - Log levels
   - Context propagation
   - Distributed tracing
   - Log aggregation

10. **Alerting & Health**
    - Health endpoints
    - Readiness checks
    - Liveness probes
    - Alert rule support
    - Diagnostic endpoints
</analysis_areas>

<priority_guidelines>
- 0-19: Core metrics infrastructure
- 20-39: Essential system and blockchain metrics
- 40-59: Component-specific metrics
- 60-79: Profiling and tracing
- 80-99: Advanced monitoring features
</priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/metrics_monitoring/` that:
1. Implement efficient metrics collection
2. Support standard monitoring tools
3. Provide comprehensive visibility
4. Enable performance debugging
5. Include health monitoring
</deliverables>