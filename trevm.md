# Design Document: Integrating trevm with tevm

## Overview

This document outlines the design for integrating [trevm](https://github.com/init4tech/trevm), a Rust-based Ethereum Virtual Machine (EVM) implementation with [tevm](https://github.com/evmts/tevm-monorepo), a JavaScript/TypeScript EVM environment. The goal is to create a `createTrevm` function that serves as a drop-in replacement for the current `createEvm` function, leveraging trevm's typesafe design while maintaining compatibility with tevm's API.

## Current Architecture

The current tevm architecture uses:
- **@ethereumjs/evm**: JavaScript implementation of the EVM
- **StateManager**: JavaScript implementation that manages Ethereum state (accounts, contracts, storage)
- **Blockchain**: Manages blocks and chain state

The `createEvm` function in tevm wraps ethereumjs's EVM with tevm-specific functionality, primarily exposing a `runCall` method that executes EVM transactions.

## Proposed Architecture

### 1. Node.js Native Extension Approach

We'll create a Node.js native extension using the Node-API (N-API) to expose trevm functionality to JavaScript:

```
┌────────────────────────────────────────┐
│  JavaScript (tevm)                     │
│                                        │
│  ┌─────────────────┐ ┌───────────────┐ │
│  │ createTrevm()   │ │ StateManager  │ │
│  └─────────────────┘ └───────────────┘ │
│           │                  ▲         │
│           ▼                  │         │
│  ┌────────────────────────────────────┐│
│  │        Node.js Native Module       ││
│  └────────────────────────────────────┘│
└────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────┐
│  Rust (trevm)                          │
│                                        │
│  ┌─────────────────┐ ┌───────────────┐ │
│  │ TrevmBuilder    │ │ JS StateDB    │ │
│  └─────────────────┘ └───────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

### 2. Key Components

1. **Native Extension Module**: 
   - A Rust module compiled to a native Node.js addon
   - Exposes trevm functionality to JavaScript

2. **JavaScript StateDB Adapter**:
   - A Rust implementation of trevm's database trait
   - Forwards all state requests to the JavaScript StateManager

3. **createTrevm Function**:
   - JavaScript function that initializes the trevm native module
   - Mirrors the `createEvm` API for drop-in compatibility

4. **Trevm Wrapper**:
   - JavaScript class that wraps the native trevm instance
   - Provides the same API as the current Evm class, focusing on runCall

## Implementation Details

### JavaScript to Rust Interface

The core of this design revolves around creating a Rust implementation of trevm's database trait that forwards requests to JavaScript:

```rust
struct StateBridge {
    get_account: ThreadsafeFunction<String, ErrorStrategy::CalleeHandled>,
    put_account: ThreadsafeFunction<(String, JsAccount), ErrorStrategy::CalleeHandled>,
    get_storage: ThreadsafeFunction<(String, String), ErrorStrategy::CalleeHandled>,
    put_storage: ThreadsafeFunction<(String, String, String), ErrorStrategy::CalleeHandled>,
    get_code: ThreadsafeFunction<String, ErrorStrategy::CalleeHandled>,
    put_code: ThreadsafeFunction<(String, String), ErrorStrategy::CalleeHandled>,
    get_block_hash: ThreadsafeFunction<u64, ErrorStrategy::CalleeHandled>,
}

#[async_trait::async_trait]
impl Database for StateBridge {
    async fn basic_account(&self, address: Address) -> Result<Option<Account>> {
        // Call into JavaScript to get account data
        let account = self.get_account
            .call_async(format!("{:#x}", address))
            .await?;
        
        // Convert JavaScript account to trevm Account
        Ok(convert_account(account))
    }
    
    // Implement other methods...
}
```

### Threadsafe Functions and Callbacks

We use N-API's ThreadsafeFunction to safely call JavaScript functions from Rust:

```typescript
// JavaScript side:
const nativeTrevm = await init_trevm({
  stateCallbacks: {
    getAccount: async (address: string) => {
      const account = await stateManager.getAccount(address);
      return account ? {
        nonce: account.nonce,
        balance: account.balance,
        codeHash: account.codeHash ? `0x${Buffer.from(account.codeHash).toString('hex')}` : undefined,
        code: account.code ? `0x${Buffer.from(account.code).toString('hex')}` : undefined,
      } : null;
    },
    // Other callbacks...
  }
});
```

### Type Conversion

We need to convert between JavaScript and Rust types:

```rust
#[napi(object)]
pub struct JsAccount {
    pub nonce: Option<BigInt>,
    pub balance: Option<BigInt>,
    pub code_hash: Option<String>,
    pub code: Option<String>,
}

impl TryFrom<JsAccount> for Account {
    type Error = Error;

    fn try_from(js_account: JsAccount) -> Result<Self> {
        Ok(Account {
            nonce: js_account.nonce.map(js_to_u256).transpose()?.unwrap_or_default(),
            balance: js_account.balance.map(js_to_u256).transpose()?.unwrap_or_default(),
            code_hash: js_account.code_hash.map(js_to_bytes).transpose()?,
            code: js_account.code.map(js_to_bytes).transpose()?,
        })
    }
}
```

### Transaction Execution Flow

The execution flow starts in JavaScript with `runCall`, then proceeds through the native module:

```rust
// Rust side
#[napi]
pub fn run_call(&self, opts: TxCallOpts) -> Promise<Object> {
    // Parse transaction options...
    
    let tx_filler = TxFiller {
        caller,
        to: to.ok(),
        data,
        value,
        gas_limit,
        skip_balance,
    };
    
    Promise::new(move |env, resolve, reject| {
        // Execute in tokio runtime
        tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap()
            .block_on(async move {
                // Build trevm with state bridge
                let trevm = TrevmBuilder::new()
                    .with_db(state_bridge.clone())
                    .build_trevm()?
                    .fill_cfg(&NoopCfg)
                    .fill_block(&NoopBlock);
                
                // Execute transaction
                let result = trevm.fill_tx(&tx_filler).run();
                
                // Process result and resolve promise
                // ...
            })
    })
}
```

## Completed Implementation

The implementation consists of:

1. **@tevm/trevm-native**: Low-level Node.js native module
   - Rust code using napi-rs for JavaScript bindings
   - State bridge implementation
   - Type conversions

2. **@tevm/trevm**: High-level JavaScript package
   - Drop-in replacement for @tevm/evm
   - Compatible API surface

## Technical Challenges and Solutions

### 1. Asynchronous State Access

**Challenge**: trevm expects its database to support async operations, but N-API's thread-safe functions might block.

**Solution**: We use tokio to run async operations in Rust and N-API's promise integration to handle async JavaScript callbacks.

### 2. Memory Management

**Challenge**: Proper memory handling across the JS/Rust boundary.

**Solution**: We use N-API's reference management system and avoid unnecessary data copying.

### 3. Error Handling

**Challenge**: Propagating errors correctly across language boundaries.

**Solution**: We convert Rust errors to JavaScript errors with proper status codes and messages.

### 4. Performance Considerations

**Challenge**: Frequent cross-language calls could impact performance.

**Solution**: 
- Batch state operations where possible
- Implement caching on the Rust side to reduce JavaScript calls
- Profile and optimize the most frequently used paths

## Next Steps

1. **Integration Testing**: Verify the trevm implementation against the existing ethereumjs implementation for correctness.

2. **Performance Benchmarking**: Measure performance gains from the Rust implementation.

3. **Extended Features**:
   - Support for custom precompiles
   - Support for EVM inspectors/tracers
   - Support for saving and loading VM state

4. **Documentation and Examples**: Create comprehensive documentation and usage examples.

## Conclusion

This design leverages trevm's typesafe implementation while maintaining compatibility with tevm's existing API. The Node.js native extension approach provides a balance of performance and integration simplicity.

By using trevm's state machine approach, we can potentially improve performance and type safety while maintaining the familiar API that tevm users expect. The design is flexible enough to evolve as both trevm and tevm mature.