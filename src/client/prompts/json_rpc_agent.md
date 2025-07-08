# JSON-RPC Server Analysis Agent

<context>
You are an expert in JSON-RPC protocol implementation, Ethereum RPC methods, and high-performance server architectures. You have deep knowledge of the Ethereum JSON-RPC specification, WebSocket protocols, and request handling optimization. Your task is to analyze Reth's RPC implementation and create a plan for Zig.
</context>

<objective>
Analyze the Reth JSON-RPC server implementation and create a detailed breakdown of subtasks required to implement a complete JSON-RPC server in Zig. Focus on all standard Ethereum methods, custom extensions, and transport layers.
</objective>

<instructions>
1. First, create a git worktree for your analysis:
   ```bash
   cd /Users/williamcory/tevm/main
   git worktree add g/json_rpc_agent
   cd g/json_rpc_agent
   ```

2. Create the directory for your task breakdown:
   ```bash
   mkdir -p src/client/prompts/json_rpc
   ```

3. Analyze the following Reth crates and their components:
   - `reth/crates/rpc/rpc/` - Core RPC implementations
   - `reth/crates/rpc/rpc-api/` - RPC API definitions
   - `reth/crates/rpc/rpc-builder/` - RPC server builder
   - `reth/crates/rpc/rpc-eth-api/` - Ethereum RPC APIs
   - `reth/crates/rpc/rpc-eth-types/` - Ethereum RPC types
   - `reth/crates/rpc/ipc/` - IPC transport
   - `reth/crates/rpc/rpc-testing-util/` - RPC testing utilities

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
   - [Link to relevant Reth file](reth/crates/rpc/path/to/file.rs)
   - [Link to relevant test](reth/crates/rpc/path/to/test.rs)

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
1. **Core RPC Infrastructure**
   - JSON-RPC 2.0 protocol handling
   - Request routing and dispatch
   - Batch request support
   - Error handling framework
   - Middleware system

2. **Ethereum Methods (eth_*)**
   - eth_blockNumber
   - eth_getBlockByHash/Number
   - eth_getTransactionByHash
   - eth_getTransactionReceipt
   - eth_call
   - eth_estimateGas
   - eth_sendRawTransaction
   - eth_getLogs
   - eth_getBalance
   - eth_getCode
   - eth_getStorageAt
   - And all other eth_ methods

3. **Network Methods (net_*)**
   - net_version
   - net_peerCount
   - net_listening

4. **Web3 Methods**
   - web3_clientVersion
   - web3_sha3

5. **Debug Methods**
   - debug_traceTransaction
   - debug_traceBlockByHash
   - debug_getRawHeader
   - debug_getRawBlock
   - debug_getRawTransaction

6. **Trace Methods**
   - trace_transaction
   - trace_block
   - trace_filter
   - trace_get

7. **Custom Extensions**
   - Anvil methods
   - Hardhat methods
   - Reth-specific methods
   - MEV methods

8. **Transport Layers**
   - HTTP server
   - WebSocket server
   - IPC server
   - Request authentication (JWT)

9. **Performance Features**
   - Connection pooling
   - Request caching
   - Rate limiting
   - Metrics collection

10. **Subscription Support**
    - eth_subscribe/unsubscribe
    - newHeads
    - logs
    - pendingTransactions
</analysis_areas>

<priority_guidelines>
- 0-19: Core infrastructure and basic eth_ methods
- 20-39: Essential eth_ methods for basic functionality
- 40-59: Additional standard methods and transports
- 60-79: Debug, trace, and custom methods
- 80-99: Optimizations and advanced features
</priority_guidelines>

<deliverables>
Create comprehensive task files in `src/client/prompts/json_rpc/` that:
1. Implement all standard Ethereum RPC methods
2. Support multiple transport protocols
3. Include proper error handling and validation
4. Provide subscription support
5. Enable extensibility for custom methods
</deliverables>