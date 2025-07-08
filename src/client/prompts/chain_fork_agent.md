# Chain & Fork Management Analysis Agent

<context>
You are an expert in blockchain protocol upgrades, chain configuration management, and hard fork coordination. You have deep knowledge of Ethereum's upgrade history, EIP activation mechanisms, and multi-chain support architectures. Your task is to analyze Reth's chain and fork management implementation and create a plan for Zig.
</context>

<objective>
Analyze the Reth chain specification and fork management implementation and create a detailed breakdown of subtasks required to implement flexible chain configuration and fork handling in Zig. Focus on supporting multiple chains and smooth protocol upgrades.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/chain_fork_agent
   cd g/chain_fork_agent
   ```

2. Create the directory for your task breakdown:
   ```bash
   mkdir -p src/client/prompts/chain_fork
   ```

3. Analyze the following Reth crates and their components:
   - `reth/crates/chainspec/` - Chain specification
   - `reth/crates/ethereum/hardforks/` - Ethereum hard forks
   - `reth/crates/optimism/chainspec/` - Optimism chain specs
   - `reth/crates/primitives/src/chain/` - Chain primitives
   - `reth/crates/config/` - Configuration management
   - `reth/crates/node/core/src/args/` - Chain arguments

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
   - [Link to relevant Reth file](reth/crates/chainspec/path/to/file.rs)
   - [Link to relevant test](reth/crates/chainspec/path/to/test.rs)

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
1. **Chain Specification**
   - Chain ID management
   - Genesis block configuration
   - Network parameters
   - Bootnodes and static peers
   - Chain metadata

2. **Hard Fork Management**
   - Fork activation heights
   - EIP activation tracking
   - Fork condition checking
   - Feature flags
   - Fork transitions

3. **Genesis State**
   - Genesis allocation loading
   - Precompile deployment
   - Initial state setup
   - Genesis validation
   - Custom genesis support

4. **Multi-Chain Support**
   - Ethereum mainnet
   - Goerli, Sepolia, Holesky testnets
   - Optimism chains
   - Custom chains
   - Chain detection

5. **Fork Constants**
   - Block rewards
   - Difficulty adjustments
   - Gas limit changes
   - Base fee parameters
   - Blob gas parameters

6. **Configuration Loading**
   - JSON configuration parsing
   - Environment variable support
   - Configuration validation
   - Default configurations
   - Configuration merging

7. **Fork-Specific Logic**
   - London (EIP-1559)
   - Paris (The Merge)
   - Shanghai (Withdrawals)
   - Cancun (EIP-4844)
   - Future forks

8. **Chain Validation**
   - Chain ID validation
   - Fork order validation
   - Configuration consistency
   - Network compatibility
   - Genesis validation

9. **Runtime Fork Detection**
   - Current fork determination
   - Next fork calculation
   - Fork activation monitoring
   - Feature availability
   - Fork-specific behavior

10. **Testing Infrastructure**
    - Test chain configurations
    - Fork transition tests
    - Configuration tests
    - Multi-chain tests
    - Upgrade simulations
</analysis_areas>

<priority_guidelines>
- 0-19: Core chain specification and fork types
- 20-39: Genesis and configuration loading
- 40-59: Major fork implementations
- 60-79: Multi-chain support and validation
- 80-99: Advanced features and testing
</priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/chain_fork/` that:
1. Support multiple chain configurations
2. Handle all Ethereum hard forks correctly
3. Enable smooth protocol upgrades
4. Provide extensibility for custom chains
5. Include comprehensive validation
</deliverables>