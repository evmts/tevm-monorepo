# Sync Pipeline Analysis Agent

<context>
You are an expert in blockchain synchronization protocols, staged sync architectures, and distributed systems optimization. You have deep knowledge of Ethereum's sync mechanisms, checkpoint sync, snap sync, and pipeline orchestration. Your task is to analyze Reth's sync pipeline implementation and create a plan for Zig.
</context>

<objective>
Analyze the Reth sync pipeline implementation and create a detailed breakdown of subtasks required to implement an efficient staged synchronization system in Zig. Focus on modularity, checkpointing, and performance optimization.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/sync_pipeline_agent
   cd g/sync_pipeline_agent
   ```

2. Create the directory for your task breakdown:
   ```bash
   mkdir -p src/client/prompts/sync_pipeline
   ```

3. Analyze the following Reth crates and their components:
   - `reth/crates/stages/stages/` - Stage implementations
   - `reth/crates/stages/api/` - Stage API and interfaces
   - `reth/crates/stages/types/` - Stage types and checkpoints
   - `reth/crates/net/downloaders/` - Download components
   - `reth/crates/engine/tree/src/download.rs` - Block download orchestration
   - `reth/crates/consensus/beacon/` - Beacon consensus integration

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
   - [Link to relevant Reth file](reth/crates/stages/path/to/file.rs)
   - [Link to relevant test](reth/crates/stages/path/to/test.rs)

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
1. **Pipeline Architecture**
   - Stage abstraction and interfaces
   - Pipeline orchestration
   - Stage dependencies
   - Error handling and recovery
   - Progress tracking

2. **Headers Stage**
   - Header download strategy
   - Header validation
   - Chain selection
   - Checkpoint sync support
   - Fork handling

3. **Bodies Stage**
   - Block body downloading
   - Transaction and receipt fetching
   - Parallel downloads
   - Request management
   - Validation

4. **Execution Stage**
   - Block execution orchestration
   - State updates
   - Receipt generation
   - Gas tracking
   - Batch processing

5. **State Root Stage**
   - Merkle root computation
   - Incremental updates
   - Parallel processing
   - Checkpoint management

6. **Index Building Stages**
   - Transaction index
   - Log index
   - Account history index
   - Storage history index
   - Pruning support

7. **Checkpoint System**
   - Stage progress tracking
   - Checkpoint storage
   - Recovery mechanisms
   - Consistency guarantees
   - Rollback support

8. **Network Integration**
   - Peer selection
   - Download prioritization
   - Request timeouts
   - Peer scoring
   - Bandwidth management

9. **Unwind Support**
   - Stage unwind logic
   - State rollback
   - Index cleanup
   - Checkpoint updates
   - Consistency maintenance

10. **Performance Features**
    - Pipeline parallelism
    - Memory management
    - I/O optimization
    - CPU utilization
    - Progress metrics
</analysis_areas>

<priority_guidelines>
- 0-19: Core pipeline infrastructure and stage API
- 20-39: Essential stages (headers, bodies, execution)
- 40-59: Checkpoint system and state root
- 60-79: Index building and network integration
- 80-99: Optimizations and advanced features
</priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/sync_pipeline/` that:
1. Implement modular stage architecture
2. Support multiple sync strategies
3. Provide robust checkpoint/recovery
4. Enable efficient resource usage
5. Include comprehensive monitoring
</deliverables>