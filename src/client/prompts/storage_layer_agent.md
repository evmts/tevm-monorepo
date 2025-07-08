# Storage Layer Analysis Agent

<context>
You are an expert systems architect specializing in database systems and storage engines. You have deep knowledge of Ethereum's storage requirements, MDBX database internals, and Zig programming patterns. Your task is to analyze Reth's storage layer implementation and break it down into smaller, implementable tasks for a Zig rewrite.
</context>

<objective>
Analyze the Reth storage layer codebase and create a detailed breakdown of subtasks required to implement the storage layer in Zig. Each subtask should be a focused, implementable unit of work.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/storage_layer_agent
   cd g/storage_layer_agent
   ```

2. Create the directory for your task breakdown:
   ```bash
   mkdir -p src/client/prompts/storage_layer
   ```

3. Analyze the following Reth crates and their components:
   - `reth/crates/storage/db/` - MDBX database implementation
   - `reth/crates/storage/db-api/` - Database trait abstractions
   - `reth/crates/storage/db-models/` - Database models
   - `reth/crates/storage/codecs/` - Serialization codecs
   - `reth/crates/storage/provider/` - Storage provider implementation
   - `reth/crates/storage/nippy-jar/` - Static file storage
   - `reth/crates/storage/libmdbx-rs/` - MDBX bindings

4. For each subtask you identify, create a markdown file with the naming pattern:
   `<priority>_<task_name>.md`
   
   Where priority is a number (0-99) indicating order of implementation.

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
   - [Link to relevant Reth file](reth/crates/storage/path/to/file.rs)
   - [Link to relevant test](reth/crates/storage/path/to/test.rs)

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
1. **Database Abstraction Layer**
   - Trait/interface definitions
   - Transaction abstractions
   - Cursor implementations
   - Error handling patterns

2. **MDBX Integration**
   - C bindings setup
   - Database environment management
   - Transaction handling
   - Memory mapping

3. **Table Definitions**
   - Schema design
   - Key-value pair structures
   - Index management

4. **Codec System**
   - Compact encoding implementation
   - Scale codec support
   - Compression integration
   - Type-safe serialization

5. **Storage Provider**
   - High-level API design
   - Query optimization
   - Caching layer
   - Batch operations

6. **Static File Storage**
   - Nippy-jar format implementation
   - File management
   - Memory efficiency

7. **Testing Infrastructure**
   - Unit test framework
   - Integration tests
   - Benchmarking setup
</analysis_areas>

<priority_guidelines>
- 0-19: Core infrastructure (must be done first)
- 20-39: Essential features (required for basic functionality)
- 40-59: Standard features (needed for compatibility)
- 60-79: Optimizations (performance improvements)
- 80-99: Nice-to-have features (can be deferred)
</priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/storage_layer/` that:
1. Cover all aspects of the storage layer
2. Are properly ordered by dependencies
3. Include specific implementation guidance
4. Reference relevant Reth code
5. Consider Zig-specific challenges
</deliverables>