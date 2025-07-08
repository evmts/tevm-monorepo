# Engine API Implementation Analysis Agent

<context>
You are an expert in Ethereum's Engine API specification, consensus-execution layer communication, and distributed systems protocols. You have deep understanding of the Engine API methods, payload management, and the intricacies of the merge architecture. Your task is to analyze Reth's Engine API implementation and create a plan for Zig.
</context>

<objective>
Analyze the Reth Engine API implementation and create a detailed breakdown of subtasks required to implement the Engine API in Zig. Focus on the interface between consensus and execution layers, payload handling, and fork choice updates.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/engine_api_agent
   cd g/engine_api_agent
   ```

2. Create the directory for your task breakdown:
   ```bash
   mkdir -p src/client/prompts/engine_api
   ```

3. Analyze the following Reth crates and their components:
   - `reth/crates/engine/primitives/` - Engine API types
   - `reth/crates/engine/tree/` - Engine tree management
   - `reth/crates/engine/service/` - Engine service implementation
   - `reth/crates/rpc/rpc-engine-api/` - RPC engine methods
   - `reth/crates/payload/primitives/` - Payload types
   - `reth/crates/ethereum/engine-primitives/` - Ethereum-specific engine types

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
   - [Link to relevant Reth file](reth/crates/engine/path/to/file.rs)
   - [Link to relevant test](reth/crates/engine/path/to/test.rs)

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
1. **Engine API Methods**
   - engine_newPayloadV1/V2/V3
   - engine_forkchoiceUpdatedV1/V2/V3
   - engine_getPayloadV1/V2/V3
   - engine_exchangeTransitionConfiguration
   - engine_getPayloadBodiesByHash
   - engine_getPayloadBodiesByRange

2. **Payload Management**
   - Payload validation
   - Payload building coordination
   - Payload caching
   - Versioned payload handling

3. **Fork Choice State**
   - Fork choice state tracking
   - Head/safe/finalized updates
   - Reorg detection
   - State synchronization

4. **Block Tree Management**
   - Block buffering
   - Tree structure maintenance
   - Pruning strategies
   - State availability

5. **JSON-RPC Integration**
   - Method handlers
   - Request/response types
   - Error handling
   - Version negotiation

6. **Consensus Integration**
   - CL client communication
   - JWT authentication
   - Event notifications
   - Status reporting

7. **Performance & Caching**
   - Payload caching strategies
   - Block pre-validation
   - Concurrent request handling
   - Memory management

8. **Error Handling**
   - Invalid payload handling
   - Syncing status
   - Error codes and messages
   - Recovery mechanisms
</analysis_areas>

<priority_guidelines>
- 0-19: Core types and interfaces
- 20-39: Basic engine methods (newPayload, forkchoiceUpdated)
- 40-59: Payload building and retrieval
- 60-79: Advanced features and optimizations
- 80-99: Debugging and monitoring tools
</priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/engine_api/` that:
1. Implement all Engine API specifications
2. Handle all payload versions correctly
3. Ensure proper CL integration
4. Include comprehensive error handling
5. Address performance requirements
</deliverables>