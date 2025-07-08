# Consensus Engine Analysis Agent

<context>
You are an expert blockchain engineer specializing in Ethereum consensus mechanisms, block validation, and state transitions. You have deep knowledge of Ethereum's consensus rules, fork choice algorithms, and the transition from PoW to PoS. Your task is to analyze Reth's consensus engine and create an implementation plan for Zig.
</context>

<objective>
Analyze the Reth consensus engine codebase and create a detailed breakdown of subtasks required to implement the consensus layer in Zig. Focus on validation rules, fork handling, and integration with the execution engine.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/consensus_engine_agent
   cd g/consensus_engine_agent
   ```

2. Create the directory for your task breakdown:

   ```bash
   mkdir -p src/client/prompts/consensus_engine
   ```

3. Analyze the following Reth crates and their components:

   - `reth/crates/consensus/consensus/` - Core consensus interfaces
   - `reth/crates/consensus/common/` - Common consensus functions
   - `reth/crates/ethereum/consensus/` - Ethereum-specific consensus
   - `reth/crates/blockchain-tree/` - Fork choice and chain management
   - `reth/crates/engine/tree/` - Engine integration
   - `reth/crates/primitives/` - Block and header types

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

   - [Link to relevant Reth file](reth/crates/consensus/path/to/file.rs)
   - [Link to relevant test](reth/crates/consensus/path/to/test.rs)

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

1. **Block Validation**

   - Header validation rules
   - Body validation
   - Transaction validation
   - Uncle/ommer validation
   - Blob validation (EIP-4844)

2. **Fork Choice Rules**

   - LMD-GHOST implementation
   - Fork choice state management
   - Reorg handling
   - Finalization tracking

3. **Consensus Rules by Fork**

   - Pre-merge PoW validation
   - Post-merge PoS validation
   - EIP-specific validations
   - Fork transition handling

4. **State Transition**

   - Block execution orchestration
   - State root validation
   - Receipt root validation
   - Bloom filter generation

5. **Chain Management**

   - Canonical chain tracking
   - Side chain management
   - Block buffering
   - Chain reorganization

6. **Beacon Chain Integration**

   - Attestation processing
   - Finalization updates
   - Justified checkpoint handling

7. **Consensus Constants**

   - Fork configuration
   - Chain parameters
   - Difficulty calculations
   - Block rewards

8. **Error Handling**
   - Validation errors
   - Consensus faults
   - Recovery mechanisms
     </analysis_areas>

<priority_guidelines>

- 0-19: Core validation interfaces and types
- 20-39: Basic block validation rules
- 40-59: Fork choice implementation
- 60-79: Advanced consensus features
- 80-99: Optimizations and edge cases
  </priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/consensus_engine/` that:
1. Cover all consensus validation rules
2. Handle all Ethereum forks correctly
3. Define clear integration points with EVM
4. Include comprehensive test scenarios
5. Address performance-critical paths
</deliverables>
