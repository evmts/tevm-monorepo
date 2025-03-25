[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmViemActionsApi

# Type Alias: TevmViemActionsApi

> **TevmViemActionsApi** = `object`

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:15

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

> **tevmCall**: [`TevmActionsApi`](TevmActionsApi.md)\[`"call"`\]

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:17

***

### tevmContract

> **tevmContract**: [`TevmActionsApi`](TevmActionsApi.md)\[`"contract"`\]

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:18

***

### tevmDeal

> **tevmDeal**: [`TevmActionsApi`](TevmActionsApi.md)\[`"deal"`\]

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:25

***

### tevmDeploy

> **tevmDeploy**: [`TevmActionsApi`](TevmActionsApi.md)\[`"deploy"`\]

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:19

***

### tevmDumpState

> **tevmDumpState**: [`TevmActionsApi`](TevmActionsApi.md)\[`"dumpState"`\]

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:22

***

### tevmGetAccount

> **tevmGetAccount**: [`TevmActionsApi`](TevmActionsApi.md)\[`"getAccount"`\]

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:24

***

### tevmLoadState

> **tevmLoadState**: [`TevmActionsApi`](TevmActionsApi.md)\[`"loadState"`\]

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:21

***

### tevmMine

> **tevmMine**: [`TevmActionsApi`](TevmActionsApi.md)\[`"mine"`\]

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:20

***

### tevmReady

> **tevmReady**: [`TevmNode`](TevmNode.md)\[`"ready"`\]

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:16

***

### tevmSetAccount

> **tevmSetAccount**: [`TevmActionsApi`](TevmActionsApi.md)\[`"setAccount"`\]

Defined in: packages/memory-client/types/TevmViemActionsApi.d.ts:23
