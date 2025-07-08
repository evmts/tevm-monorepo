# Payload Building Analysis Agent

<context>
You are an expert in block production, MEV integration, and transaction selection algorithms. You have deep knowledge of Ethereum's block building process, gas optimization, priority ordering, and builder APIs. Your task is to analyze Reth's payload building implementation and create a plan for Zig.
</context>

<objective>
Analyze the Reth payload building implementation and create a detailed breakdown of subtasks required to implement an efficient block building system in Zig. Focus on transaction selection, gas optimization, and MEV considerations.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/payload_building_agent
   cd g/payload_building_agent
   ```

2. Create the directory for your task breakdown:
   ```bash
   mkdir -p src/client/prompts/payload_building
   ```

3. Analyze the following Reth crates and their components:
   - `reth/crates/payload/basic/` - Basic payload builder
   - `reth/crates/payload/builder/` - Payload builder traits
   - `reth/crates/payload/primitives/` - Payload primitives
   - `reth/crates/payload/util/` - Payload utilities
   - `reth/crates/ethereum/payload/` - Ethereum payload specifics
   - `reth/crates/optimism/payload/` - Optimism payload builder

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
   - [Link to relevant Reth file](reth/crates/payload/path/to/file.rs)
   - [Link to relevant test](reth/crates/payload/path/to/test.rs)

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
1. **Payload Builder Architecture**
   - Builder traits and interfaces
   - Job management system
   - Payload lifecycle
   - Cancellation support
   - Event system

2. **Transaction Selection**
   - Priority ordering algorithms
   - Gas price evaluation
   - Transaction dependencies
   - Nonce ordering
   - Bundle support

3. **Gas Optimization**
   - Block gas limit tracking
   - Gas estimation
   - Transaction packing algorithms
   - Base fee calculations
   - Priority fee handling

4. **State Management**
   - Pending state tracking
   - State updates during building
   - Revert handling
   - State caching
   - Concurrent access

5. **MEV Integration**
   - Builder API support
   - Bundle inclusion
   - Flashbot relay integration
   - Private mempool handling
   - Profit optimization

6. **Payload Attributes**
   - Timestamp handling
   - Random value (prevRandao)
   - Fee recipient
   - Withdrawals processing
   - Extra data

7. **Block Assembly**
   - Header construction
   - Transaction ordering
   - Receipt generation
   - Uncle/ommer handling
   - Bloom filter creation

8. **Blob Transactions**
   - Blob selection
   - KZG commitment handling
   - Blob gas accounting
   - Sidecar construction

9. **Performance Optimization**
   - Parallel transaction execution
   - Incremental building
   - Caching strategies
   - Early termination
   - Resource limits

10. **Testing & Validation**
    - Payload validation
    - Gas accounting tests
    - Selection algorithm tests
    - Performance benchmarks
    - Integration tests
</analysis_areas>

<priority_guidelines>
- 0-19: Core builder architecture and interfaces
- 20-39: Basic transaction selection and assembly
- 40-59: Gas optimization and state management
- 60-79: MEV integration and blob support
- 80-99: Advanced optimizations and features
</priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/payload_building/` that:
1. Implement efficient transaction selection
2. Support MEV and bundle inclusion
3. Optimize gas usage and packing
4. Handle all payload attributes correctly
5. Provide extensibility for custom builders
</deliverables>