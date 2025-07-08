# CLI & Node Runner Analysis Agent

<context>
You are an expert in command-line interface design, application lifecycle management, and system administration tools. You have deep knowledge of CLI frameworks, configuration management, signal handling, and process orchestration. Your task is to analyze Reth's CLI and node runner implementation and create a plan for Zig.
</context>

<objective>
Analyze the Reth CLI and node runner implementation and create a detailed breakdown of subtasks required to implement a user-friendly and robust node management system in Zig. Focus on configuration, lifecycle management, and operational convenience.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/cli_node_runner_agent
   cd g/cli_node_runner_agent
   ```

2. Create the directory for your task breakdown:
   ```bash
   mkdir -p src/client/prompts/cli_node_runner
   ```

3. Analyze the following Reth crates and their components:
   - `reth/crates/cli/cli/` - CLI framework
   - `reth/crates/cli/commands/` - Command implementations
   - `reth/crates/cli/runner/` - Application runner
   - `reth/crates/node/core/` - Node core functionality
   - `reth/crates/node/builder/` - Node builder
   - `reth/bin/reth/` - Main binary

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
   - [Link to relevant Reth file](reth/crates/cli/path/to/file.rs)
   - [Link to relevant test](reth/crates/cli/path/to/test.rs)

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
1. **CLI Framework**
   - Argument parsing
   - Command structure
   - Subcommand support
   - Help generation
   - Version information

2. **Main Commands**
   - node - Run the node
   - init - Initialize node
   - import - Import blocks
   - db - Database operations
   - config - Configuration management
   - debug - Debug commands

3. **Configuration Management**
   - Config file loading (TOML)
   - Environment variables
   - Command-line overrides
   - Default values
   - Config validation

4. **Node Lifecycle**
   - Startup sequence
   - Component initialization
   - Graceful shutdown
   - Signal handling (SIGINT, SIGTERM)
   - Cleanup procedures

5. **Directory Management**
   - Data directory structure
   - Database paths
   - Log file locations
   - Config file discovery
   - Permission checks

6. **Logging Configuration**
   - Log level control
   - Output formatting
   - File rotation
   - Filtering rules
   - Color output

7. **Database Commands**
   - Database stats
   - Database clear
   - Database inspect
   - Migration support
   - Backup/restore

8. **Import/Export**
   - Block import
   - State import
   - Chain export
   - Progress tracking
   - Resume support

9. **Debug Tools**
   - Database inspection
   - State debugging
   - Network diagnostics
   - Performance analysis
   - Replay functionality

10. **Operational Features**
    - Health checks
    - Version compatibility
    - Update notifications
    - Resource limits
    - Monitoring integration
</analysis_areas>

<priority_guidelines>
- 0-19: Core CLI framework and argument parsing
- 20-39: Essential commands (node, init)
- 40-59: Configuration and lifecycle management
- 60-79: Database and import/export commands
- 80-99: Debug tools and advanced features
</priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/cli_node_runner/` that:
1. Implement intuitive CLI interface
2. Support all operational commands
3. Provide robust lifecycle management
4. Enable easy configuration
5. Include helpful debugging tools
</deliverables>