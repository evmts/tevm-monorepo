# Transaction Pool Analysis Agent

<context>
You are an expert in mempool design, transaction validation, and concurrent data structures. You have deep knowledge of Ethereum transaction types, gas pricing mechanisms, MEV considerations, and high-performance pool management. Your task is to analyze Reth's transaction pool implementation and create a plan for Zig.
</context>

<objective>
Analyze the Reth transaction pool implementation and create a detailed breakdown of subtasks required to implement a high-performance transaction pool in Zig. Focus on validation, ordering, eviction policies, and blob transaction support.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/transaction_pool_agent
   cd g/transaction_pool_agent
   ```

2. Create the directory for your task breakdown:
   ```bash
   mkdir -p src/client/prompts/transaction_pool
   ```

3. Analyze the following Reth crates and their components:
   - `reth/crates/transaction-pool/` - Core transaction pool
   - `reth/crates/primitives/src/transaction/` - Transaction types
   - `reth/crates/net/network/src/transactions/` - Transaction propagation
   - `reth/crates/optimism/txpool/` - Optimism-specific pool features
   - `reth/crates/payload/util/` - Transaction selection utilities

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
   - [Link to relevant Reth file](reth/crates/transaction-pool/path/to/file.rs)
   - [Link to relevant test](reth/crates/transaction-pool/path/to/test.rs)

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
1. **Pool Data Structures**
   - Transaction storage structures
   - Indexing by hash, sender, nonce
   - Priority queues for ordering
   - Concurrent access patterns

2. **Transaction Validation**
   - Signature verification
   - Nonce validation
   - Gas price validation
   - Balance checks
   - Transaction type validation
   - Blob transaction validation (EIP-4844)

3. **Pool Management**
   - Transaction insertion
   - Replacement rules (gas price bumping)
   - Eviction policies
   - Pool size limits
   - Memory management

4. **Transaction Ordering**
   - Gas price ordering
   - Priority fee ordering (EIP-1559)
   - MEV-aware ordering
   - Nonce ordering per account

5. **State Integration**
   - Account state tracking
   - Nonce gap handling
   - Balance monitoring
   - State change notifications

6. **Network Integration**
   - Transaction broadcasting
   - Transaction announcement
   - Peer transaction handling
   - Transaction fetching

7. **Blob Transactions (EIP-4844)**
   - Blob storage and management
   - Blob validation
   - Blob garbage collection
   - KZG proof handling

8. **Event System**
   - Transaction events
   - Pool events
   - Subscription support
   - Event filtering

9. **Metrics and Monitoring**
   - Pool statistics
   - Transaction lifecycle tracking
   - Performance metrics
   - Health monitoring

10. **Special Features**
    - Local transaction handling
    - Transaction persistence
    - Pool snapshots
    - Recovery mechanisms
</analysis_areas>

<priority_guidelines>
- 0-19: Core data structures and basic validation
- 20-39: Essential pool operations (add, remove, get)
- 40-59: Ordering and state integration
- 60-79: Network integration and blob support
- 80-99: Advanced features and optimizations
</priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/transaction_pool/` that:
1. Implement a high-performance concurrent pool
2. Support all Ethereum transaction types
3. Handle blob transactions efficiently
4. Integrate with state and network layers
5. Provide monitoring and debugging capabilities
</deliverables>