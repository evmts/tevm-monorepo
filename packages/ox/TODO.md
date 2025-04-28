# Ox API Effect Wrapper Implementation Guide

This document outlines the process for wrapping Ox API functions with Effect.js. Our goal is to maintain consistent patterns across the codebase while properly handling error cases.

## Links

Effect docs on creating effects https://effect.website/docs/getting-started/creating-effects/#try

## Migration Strategy

We're transitioning from the service-based implementation pattern to a more direct functional approach with Effect wrappers. This document provides guidelines for implementing the new pattern consistently.

## Implementation Steps

**IMPORTANT**

These docs are mostly for pure utilities such as creating abi or encoding decoding data types. If you run into a module that is more like a service you should skip it for now and mark it in this doc as being a service. Services we will implement on a case by case basis

### 1. Understand the Ox API Structure

Before implementing, review the original Ox API documentation and source:

- Check function signatures, return types, and error handling patterns
- Note if functions are overloaded or have multiple return types
- Understand the namespace structure (e.g., `Ox.Abi`, `Ox.AbiConstructor`, etc.)
- Review the TypeScript types to identify specific error types

### 2. Namespace Structure

Each Ox component should be implemented as a separate namespace:

- Create a dedicated file for each namespace (e.g., `Abi.ts`, `AbiConstructor.ts`, etc.)
- Export the namespace in `index.ts` using `export * as Namespace from "./Namespace.js"`
- Remove existing `*Effect.ts` files as they're being replaced with the new structure

### 3. Type Exports

For each namespace, export the core types:

```typescript
// Example: AbiFunction.ts
export type AbiFunction = Ox.AbiFunction.AbiFunction;
```

### 4. Error Handling Pattern

For each function, follow this error handling pattern:

1. **Check error type structure**:

   - Examine the original Ox implementation to see if the error type is a union of specific errors
   - Look for `.ErrorType` type definitions which often indicate complex error types
   - Check the Ox source code to identify possible error cases

2. **Error class definition**:

   - Create error classes with clear names (e.g., `FormatError`, `DecodeError`)
   - Include the `_tag` property for Effect.js error matching
   - Use descriptive messages that mention the function and Ox library
   - Preserve the original error as `cause`
   - Ensure unique error names within each namespace

3. **Error class example**:

```typescript
export class FormatError extends Error {
  override name = "FormatError";
  _tag = "FormatError";
  constructor(cause: Ox.Abi.format.ErrorType) {
    super("Unexpected error formatting ABI with ox", {
      cause,
    });
  }
}
```

4. **For discriminated error handling** (when the original API has specific error types):

```typescript
export class ParseError extends Error {
  override name = "ParseError";
  _tag = "ParseError";

  constructor(cause: Ox.Abi.parse.ErrorType) {
    if (cause instanceof Ox.errors.InvalidAbiItemError) {
      super(`Invalid ABI item: ${cause.message}`, { cause });
    } else if (cause instanceof Ox.errors.InvalidSignatureError) {
      super(`Invalid signature: ${cause.message}`, { cause });
    } else {
      super("Unexpected error parsing ABI with ox", { cause });
    }
  }
}
```

### 5. Function Implementation Pattern

For each function, follow this pattern:

1. **Match the original function signature**:

   - Maintain parameter types and names
   - Wrap the return type in `Effect.Effect<ReturnType, ErrorType, never>`

2. **Use Effect.try or Effect.promise for implementation**:

```typescript
export function format(
  abi: Ox.Abi.Abi | readonly string[],
): Effect.Effect<Ox.Abi.format.ReturnType, FormatError, never> {
  return Effect.try({
    try: () => Ox.Abi.format(abi),
    catch: (cause) => new FormatError(cause as Ox.Abi.format.ErrorType),
  });
}
```

3. **For overloaded functions**:
   - Implement each overload with proper Effect typing
   - Use TypeScript overload signatures to maintain type safety

### 6. Implementation Notes

When implementing functions:

1. **Function naming**:

   - Use the same name as the original Ox function (e.g., `format`, `decode`)
   - Do NOT add "Effect" suffix to function names in the new pattern

2. **Error naming**:

   - Use descriptive names for errors that match the function name (e.g., `FormatError` for `format()`)
   - Keep error names scoped to their namespace to avoid conflicts
   - Ensure consistent error message formatting

3. **Type handling**:
   - Export all relevant types from the original Ox library
   - Preserve generic parameters when present in the original functions
   - Ensure proper Error type exports

### 7. Testing

For each wrapped function:

- Test happy path - verify successful operation returns expected results
- Test error path - verify errors are correctly wrapped and typed
- Test with various input types when the function supports them

## Implementation Status

### Completed Modules

Look at completed modules as examples of how to do your module

- [x] **Abi Namespace**

  - [x] `format` function
  - [x] `from` function

- [x] **AbiConstructor Namespace**

  - [x] `decode` function
  - [x] `encode` function
  - [x] `format` function
  - [x] `from` function
  - [x] `fromAbi` function

- [x] **AbiError Namespace**

  - [x] `decode` function
  - [x] `encode` function
  - [x] `format` function
  - [x] `from` function
  - [x] `fromAbi` function
  - [x] `getSelector` function

- [x] **AbiEvent Namespace**

  - [x] `assertArgs` function
  - [x] `decode` function
  - [x] `encode` function
  - [x] `format` function
  - [x] `from` function
  - [x] `fromAbi` function
  - [x] `getSelector` function

- [x] **AbiFunction Namespace**

  - [x] `decodeData` function
  - [x] `decodeResult` function
  - [x] `encodeData` function
  - [x] `encodeResult` function
  - [x] `format` function
  - [x] `from` function
  - [x] `fromAbi` function
  - [x] `getSelector` function

- [x] **AbiItem Namespace**

  - [x] `format` function
  - [x] `from` function
  - [x] `fromAbi` function
  - [x] `getSelector` function
  - [x] `getSignature` function
  - [x] `getSignatureHash` function

- [x] **AbiParameters Namespace**
  - [x] `decode` function
  - [x] `encode` function
  - [x] `encodePacked` function
  - [x] `format` function
  - [x] `from` function

### Modules To Be Implemented

The following modules need to be migrated from the service-based pattern to the new functional pattern:

- [x] **Authorization**
  - [x] `fromTuple` function
  - [x] `fromTupleList` function
  - [x] `fromRpc` function
  - [x] `fromRpcList` function
  - [x] `hash` function
  - [x] `getSignPayload` function
  - [x] `toRpc` function
  - [x] `toRpcList` function
  - [x] `toTuple` function
  - [x] `toTupleList` function
- [x] **BinaryStateTree**
  - [x] `create` function
  - [x] `insert` function
  - [x] `merkelize` function
- [x] **Blobs**

  - [x] `isBlob` function
  - [x] `isValid` function
  - [x] `toBytes` function
  - [x] `toHex` function
  - [x] `fromHex` function
  - [x] `fromBytes` function
  - [x] `toVersionedHash` function
  - [x] `toCommitments` function
  - [x] `toVersionedHashes` function
  - [x] `toProofs` function
  - [x] `toSidecars` function
  - [x] `from` function
  - [x] `to` function
  - [x] `commitmentsToVersionedHashes` function
  - [x] `commitmentToVersionedHash` function
  - [x] `sidecarsToVersionedHashes` function
- [ ] **Crypto modules** (WebCryptoP256)
- [ ] **WebAuthnP256** (PENDING - implementing by Claude)
- [x] **Secp256k1**
  - [x] `getPublicKey` function
  - [x] `randomPrivateKey` function
  - [x] `recoverAddress` function
  - [x] `recoverPublicKey` function
  - [x] `sign` function
  - [x] `verifyWithAddress` function
  - [x] `verifyWithPublicKey` function
- [x] **Mnemonic**
  - [x] `random` function
  - [x] `toSeed` function
  - [x] `validate` function
  - [x] `toHdKey` function
  - [x] `toPrivateKey` function
- [x] **P256**
  - [x] `getPublicKey` function
  - [x] `randomPrivateKey` function
  - [x] `recoverPublicKey` function
  - [x] `sign` function
  - [x] `verify` function
- [x] **BlsPoint**
  - [x] `toBytes` function
  - [x] `toHex` function
  - [x] `fromBytes` function
  - [x] `fromHex` function
- [x] **HdKey**
  - [x] `fromSeed` function
  - [x] `fromExtendedKey` function
  - [x] `derive` function
  - [x] `getExtendedPrivateKey` function
  - [x] `getExtendedPublicKey` function
  - [x] `getAddress` function
- [x] **Bls**
  - [x] `aggregate` function
  - [x] `getPublicKey` function
  - [x] `randomPrivateKey` function
  - [x] `sign` function
  - [x] `verify` function
- [x] **ENS**
  - [x] `getAddress` function
  - [x] `getName` function
  - [x] `getAvatar` function
  - [x] `getText` function
  - [x] `getUniversalResolver` function
  - [x] `normalize` function
  - [x] `labelhash` function
  - [x] `namehash` function
- [ ] **Execution modules** (AccountProof, BlockOverrides, Log, StateOverrides, TransactionRequest, Withdrawal)
- [x] **Filter**
  - [x] `createFilter` function
  - [x] `getFilterChanges` function
  - [x] `uninstallFilter` function
  - [x] `getFilterLogs` function
- [x] **Fee**
  - [x] `calculateNextBaseFee` function
  - [x] `calculatePriorityFee` function
  - [x] `createFeeHistory` function
  - [x] `formatFeeHistory` function
  - [x] `parseFeeHistory` function
- [x] **Bloom**
  - [x] `create` function
  - [x] `addAddress` function
  - [x] `addTopic` function
  - [x] `hasAddress` function
  - [x] `hasTopic` function
- [x] **AccessList**
- [ ] **JSON-RPC modules**
  - [ ] **JsonRpcRequest** (PENDING - implementing)
  - [x] **JsonRpcResponse**
  - [x] `createResponse` function
  - [x] `parseResponse` function
  - [x] `validateResponse` function
  - [x] `getResponseResult` function
  - [x] `getResponseError` function
  - [x] **JsonRpcSchema**
  - [x] `from` function
  - [x] **JsonRpcTransport**
    - [x] `fromHttp` function
    - [x] `create` function
- [ ] **Provider**
- [x] **SIWE**
  - [x] `createMessage` function
  - [x] `verifyMessage` function
  - [x] `parseMessage` function
- [x] **Block**
  - [x] `toRpc` function
  - [x] `fromRpc` function

## Migration Plan

For each module:

1. **Identify Service Components**:

   - Review the existing `*Effect.ts` file to understand the current implementation
   - List all methods that need to be migrated
   - Note any special error handling patterns or complex types

2. **Create New Namespace File**:

   - Create a new file with the plain namespace name (e.g., `Authorization.ts`)
   - Export core types from Ox

3. **Implement Functions**:

   - Convert each service method to a standalone function
   - Implement proper Effect wrapping and error handling
   - Remove Context and Layer-related code

4. **Update index.ts**:

   - Update the exports to point to the new namespace files
   - Remove exports for old service-based implementations

5. **Mark for Removal**:
   - Mark the old `*Effect.ts` file for deletion

## Example Migration

### Old Pattern (`AbiEffect.ts`)

```typescript
import { Context, Effect, Layer } from "effect";
import * as Abi from "ox/core/Abi";
import { BaseErrorEffect } from "../errors/ErrorsEffect.js";

export type AbiEffect = Abi.Abi;

export interface AbiEffectService {
  formatEffect(
    abi: Abi.Abi | readonly unknown[],
  ): Effect.Effect<
    readonly string[],
    BaseErrorEffect<Error | undefined>,
    never
  >;

  fromEffect(
    abi: Abi.Abi | readonly string[],
  ): Effect.Effect<Abi.Abi, BaseErrorEffect<Error | undefined>, never>;
}

export const AbiEffectTag = Context.Tag<AbiEffectService>("@tevm/ox/AbiEffect");

function catchOxErrors<A>(
  effect: Effect.Effect<A, unknown, never>,
): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
  return Effect.catchAll(effect, (error) => {
    if (error instanceof Error) {
      return Effect.fail(new BaseErrorEffect(error.message, { cause: error }));
    }
    return Effect.fail(
      new BaseErrorEffect("Unknown error", {
        cause: error instanceof Error ? error : undefined,
      }),
    );
  });
}

export const AbiEffectLive: AbiEffectService = {
  formatEffect: (abi) => catchOxErrors(Effect.try(() => Abi.format(abi))),
  fromEffect: (abi) => catchOxErrors(Effect.try(() => Abi.from(abi))),
};

export const AbiEffectLayer = Layer.succeed(AbiEffectTag, AbiEffectLive);
```

### New Pattern (`Abi.ts`)

```typescript
import { Effect } from "effect";
import Ox from "ox";

export type Abi = Ox.Abi.Abi;

export class FormatError extends Error {
  override name = "FormatError";
  _tag = "FormatError";
  constructor(cause: Ox.Abi.format.ErrorType) {
    super("Unexpected error formatting ABI with ox", {
      cause,
    });
  }
}

export function format(
  abi: Ox.Abi.Abi | readonly string[],
): Effect.Effect<Ox.Abi.format.ReturnType, FormatError, never> {
  return Effect.try({
    try: () => Ox.Abi.format(abi),
    catch: (cause) => new FormatError(cause as Ox.Abi.format.ErrorType),
  });
}

export class FromError extends Error {
  override name = "FromError";
  _tag = "FromError";
  constructor(cause: Ox.Abi.from.ErrorType) {
    super("Unexpected error parsing ABI with ox", {
      cause,
    });
  }
}

export function from(
  abi: Ox.Abi.Abi | readonly string[],
): Effect.Effect<Ox.Abi.from.ReturnType, FromError, never> {
  return Effect.try({
    try: () => Ox.Abi.from(abi),
    catch: (cause) => new FromError(cause as Ox.Abi.from.ErrorType),
  });
}
```
