# State & Trie Management Analysis Agent

<context>
You are an expert in Merkle Patricia Tries, Ethereum state management, and parallel computing algorithms. You have deep knowledge of Ethereum's state structure, trie algorithms, state root computation optimization, and witness generation. Your task is to analyze Reth's state and trie implementation and create a plan for Zig.
</context>

<objective>
Analyze the Reth state and trie management implementation and create a detailed breakdown of subtasks required to implement efficient state management and trie computation in Zig. Focus on parallel processing, caching strategies, and state root optimization.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/state_trie_agent
   cd g/state_trie_agent
   ```

2. Create the directory for your task breakdown:
   ```bash
   mkdir -p src/client/prompts/state_trie
   ```

3. Analyze the following Reth crates and their components:
   - `reth/crates/trie/trie/` - Core trie implementation
   - `reth/crates/trie/common/` - Common trie utilities
   - `reth/crates/trie/parallel/` - Parallel trie computation
   - `reth/crates/trie/sparse/` - Sparse trie implementation
   - `reth/crates/trie/db/` - Trie database layer
   - `reth/crates/storage/provider/` - State provider interfaces
   - `reth/crates/engine/tree/src/state/` - State management

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
   - [Link to relevant Reth file](reth/crates/trie/path/to/file.rs)
   - [Link to relevant test](reth/crates/trie/path/to/test.rs)

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
1. **Merkle Patricia Trie Core**
   - Node types (branch, extension, leaf)
   - Path encoding (HP encoding)
   - Node hashing
   - Trie traversal algorithms
   - RLP encoding for nodes

2. **State Management**
   - Account state structure
   - Storage trie handling
   - Code storage
   - State transitions
   - State snapshots

3. **Trie Database**
   - Node storage and retrieval
   - Caching strategies
   - Pruning mechanisms
   - Reference counting
   - Batch operations

4. **Parallel State Root**
   - Work distribution strategies
   - Parallel trie walking
   - Result aggregation
   - Thread pool management
   - Memory efficiency

5. **State Providers**
   - Historical state access
   - State at block height
   - Account providers
   - Storage providers
   - Bundle state handling

6. **Incremental Updates**
   - Trie updates from state changes
   - Partial trie computation
   - Change tracking
   - Efficient recomputation

7. **Witness Generation**
   - Merkle proof generation
   - Witness format
   - Stateless validation
   - Proof verification

8. **Caching Layer**
   - Node cache design
   - State cache
   - LRU eviction
   - Cache invalidation
   - Memory management

9. **Performance Optimization**
   - SIMD for hashing
   - Memory pooling
   - Lock-free data structures
   - Batch processing

10. **Testing Infrastructure**
    - State test vectors
    - Trie consistency checks
    - Performance benchmarks
    - Fuzzing harnesses
</analysis_areas>

<priority_guidelines>
- 0-19: Core MPT implementation and basic operations
- 20-39: State management and providers
- 40-59: Parallel computation infrastructure
- 60-79: Caching and optimization
- 80-99: Advanced features and tools
</priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/state_trie/` that:
1. Implement efficient MPT operations
2. Enable parallel state root computation
3. Provide comprehensive caching
4. Support witness generation
5. Achieve high performance targets
</deliverables>