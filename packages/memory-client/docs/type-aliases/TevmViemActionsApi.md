[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / TevmViemActionsApi

# Type Alias: TevmViemActionsApi

> **TevmViemActionsApi** = `object`

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L16)

A custom [viem extension](https://viem.sh/docs/clients/custom#extending-with-actions-or-configuration) for adding powerful
Tevm specific actions to the client. These actions come preloaded with [MemoryClient](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient/)
To add these actions use the `extend` method on a TevmClient with the tevmViemActions() extension.

## Example

```typescript
import { createTevmClient, tevmViemActions } from 'tevm'

const client = createTevmClient()
  .extend(tevmViemActions())
```

## Properties

### tevmCall

> **tevmCall**: `TevmActionsApi`\[`"call"`\]

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L18)

***

### tevmContract

> **tevmContract**: `TevmActionsApi`\[`"contract"`\]

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L19)

***

### tevmDeal

> **tevmDeal**: `TevmActionsApi`\[`"deal"`\]

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L26)

***

### tevmDeploy

> **tevmDeploy**: `TevmActionsApi`\[`"deploy"`\]

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L20)

***

### tevmDumpState

> **tevmDumpState**: `TevmActionsApi`\[`"dumpState"`\]

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L23)

***

### tevmGetAccount

> **tevmGetAccount**: `TevmActionsApi`\[`"getAccount"`\]

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L25)

***

### tevmLoadState

> **tevmLoadState**: `TevmActionsApi`\[`"loadState"`\]

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L22)

***

### tevmMine

> **tevmMine**: `TevmActionsApi`\[`"mine"`\]

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L21)

***

### tevmReady

> **tevmReady**: `TevmNode`\[`"ready"`\]

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L17)

***

### tevmSetAccount

> **tevmSetAccount**: `TevmActionsApi`\[`"setAccount"`\]

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L24)
