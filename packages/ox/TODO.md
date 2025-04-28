# @tevm/ox Implementation TODO

## Overview

This document outlines the remaining work needed to complete the `@tevm/ox` package, which provides Effect.ts wrappers for the Ox Ethereum Standard Library. The goal is to implement Effect-based versions of all Ox utility functions, allowing users to leverage the power of Effect.ts for better error handling, dependency management, and composition when working with Ethereum utilities.

## Implementation Pattern

Each Ox module should be implemented following this pattern:

1. Create a directory for the module in `src/`
2. Create the following files inside the directory:
   - `ModuleNameEffect.ts` - Main implementation with Effect wrappers
   - `ModuleNameEffect.spec.ts` - Tests for the Effect wrappers
   - `index.ts` - Barrel file exporting everything

The implementation should:
- Define a service interface with Effect-wrapped methods
- Create a Context Tag for dependency injection
- Implement a live service
- Create a Layer that provides the implementation
- Include proper error handling for all methods

## Template Example

Here's a template for implementing a new module:

```typescript
// Example for a new module called "Example"
import * as Example from 'ox/path/to/Example'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Example
 */
export type ExampleEffect = Example.Example

/**
 * Ox Example effect service interface
 */
export interface ExampleEffectService {
  /**
   * Example method with Effect
   */
  exampleMethodEffect(
    param: Example.Param,
  ): Effect.Effect<Example.Result, BaseErrorEffect<Error | undefined>, never>

  // Add more methods...
}

/**
 * Tag for ExampleEffectService dependency injection
 */
export const ExampleEffectTag = Context.Tag<ExampleEffectService>('@tevm/ox/ExampleEffect')

/**
 * Catch Ox errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(effect: Effect.Effect<A, unknown, never>): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
  return Effect.catchAll(effect, (error) => {
    if (error instanceof Error) {
      return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
    }
    return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
  })
}

/**
 * Live implementation of ExampleEffectService
 */
export const ExampleEffectLive: ExampleEffectService = {
  exampleMethodEffect: (param) =>
    catchOxErrors(Effect.try(() => Example.exampleMethod(param))),

  // Implement more methods...
}

/**
 * Layer that provides the ExampleEffectService implementation
 */
export const ExampleEffectLayer = Layer.succeed(ExampleEffectTag, ExampleEffectLive)
```

## Modules to Implement

Below is the list of Ox modules that need to be implemented:

### ABI
- [x] Create `abi/AbiEffect.ts` for `ox/abi`
- [x] Create `abi/AbiConstructorEffect.ts` for `ox/abi/AbiConstructor`
- [x] Create `abi/AbiErrorEffect.ts` for `ox/abi/AbiError`
- [x] Create `abi/AbiEventEffect.ts` for `ox/abi/AbiEvent`
- [ ] Create `abi/AbiFunctionEffect.ts` for `ox/abi/AbiFunction`
- [x] Create `abi/AbiItemEffect.ts` for `ox/abi/AbiItem`
- [x] Create `abi/AbiParametersEffect.ts` for `ox/abi/AbiParameters`

### Authorization
- [ ] Create `authorization/AuthorizationEffect.ts` for `ox/authorization`

### Binary State Tree
- [ ] Create `binaryStateTree/BinaryStateTreeEffect.ts` for `ox/binary-state-tree`

### Blobs
- [x] Create `blobs/BlobsEffect.ts` for `ox/blobs` (note: KZG is already implemented)

### Crypto
- [x] Create `bls/BlsEffect.ts` for `ox/crypto/bls`
- [x] Create `blsPoint/BlsPointEffect.ts` for `ox/crypto/bls-point`
- [ ] Create `hdKey/HdKeyEffect.ts` for `ox/crypto/hd-key`
- [ ] Create `mnemonic/MnemonicEffect.ts` for `ox/crypto/mnemonic`
- [ ] Create `p256/P256Effect.ts` for `ox/crypto/p256`
- [ ] Create `secp256k1/Secp256k1Effect.ts` for `ox/crypto/secp256k1`
- [ ] Create `webAuthnP256/WebAuthnP256Effect.ts` for `ox/crypto/webauthn-p256`
- [ ] Create `webCryptoP256/WebCryptoP256Effect.ts` for `ox/crypto/webcrypto-p256`

### ENS
- [ ] Create `ens/EnsEffect.ts` for `ox/ens`

### Execution Spec
- [ ] Create `accessList/AccessListEffect.ts` for `ox/execution/access-list`
- [ ] Create `accountProof/AccountProofEffect.ts` for `ox/execution/account-proof`
- [ ] Create `blockOverrides/BlockOverridesEffect.ts` for `ox/execution/block-overrides`
- [ ] Create `bloom/BloomEffect.ts` for `ox/execution/bloom`
- [ ] Create `fee/FeeEffect.ts` for `ox/execution/fee`
- [ ] Create `filter/FilterEffect.ts` for `ox/execution/filter`
- [ ] Create `log/LogEffect.ts` for `ox/execution/log`
- [ ] Create `stateOverrides/StateOverridesEffect.ts` for `ox/execution/state-overrides`
- [x] Create `transactionRequest/TransactionRequestEffect.ts` for `ox/execution/transaction-request`
- [x] Create `withdrawal/WithdrawalEffect.ts` for `ox/execution/withdrawal`

### JSON-RPC
- [ ] Create `jsonRpc/JsonRpcRequestEffect.ts` for `ox/json-rpc/request`
- [ ] Create `jsonRpc/JsonRpcResponseEffect.ts` for `ox/json-rpc/response`
- [ ] Create `jsonRpc/JsonRpcSchemaEffect.ts` for `ox/json-rpc/schema`
- [ ] Create `jsonRpc/JsonRpcTransportEffect.ts` for `ox/json-rpc/transport`

### Provider
- [ ] Create `provider/ProviderEffect.ts` for `ox/provider`

### Sign-In with Ethereum
- [ ] Create `siwe/SiweEffect.ts` for `ox/siwe` (needs fixes)

### Block
- [x] Create `block/BlockEffect.ts` for `ox/core/Block`

## Final Steps

After implementing all modules:

1. Update `src/index.ts` to export all the new modules
2. Create a combined layer that provides all services (`OxCombinedEffectLayer`)
3. Run tests to ensure everything works correctly
4. Update documentation as needed
