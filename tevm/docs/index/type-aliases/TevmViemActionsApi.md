[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / TevmViemActionsApi

# Type Alias: TevmViemActionsApi

> **TevmViemActionsApi**: `object`

A custom [viem extension](https://viem.sh/docs/clients/custom#extending-with-actions-or-configuration) for adding powerful
Tevm specific actions to the client. These actions come preloaded with [MemoryClient](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient/)
To add these actions use the `extend` method on a TevmClient with the tevmViemActions() extension.

## Example

```typescript
import { createTevmClient, tevmViemActions } from 'tevm'

const client = createTevmClient()
  .extend(tevmViemActions())
```

## Type declaration

### tevm

> **tevm**: [`TevmNode`](TevmNode.md) & [`Eip1193RequestProvider`](Eip1193RequestProvider.md)

### tevmCall

> **tevmCall**: [`TevmActionsApi`](TevmActionsApi.md)\[`"call"`\]

### tevmContract

> **tevmContract**: [`TevmActionsApi`](TevmActionsApi.md)\[`"contract"`\]

### tevmDeploy

> **tevmDeploy**: [`TevmActionsApi`](TevmActionsApi.md)\[`"deploy"`\]

### tevmDumpState

> **tevmDumpState**: [`TevmActionsApi`](TevmActionsApi.md)\[`"dumpState"`\]

### tevmGetAccount

> **tevmGetAccount**: [`TevmActionsApi`](TevmActionsApi.md)\[`"getAccount"`\]

### tevmLoadState

> **tevmLoadState**: [`TevmActionsApi`](TevmActionsApi.md)\[`"loadState"`\]

### tevmMine

> **tevmMine**: [`TevmActionsApi`](TevmActionsApi.md)\[`"mine"`\]

### tevmReady

> **tevmReady**: [`TevmNode`](TevmNode.md)\[`"ready"`\]

### tevmScript

> **tevmScript**: [`TevmActionsApi`](TevmActionsApi.md)\[`"script"`\]

### tevmSetAccount

> **tevmSetAccount**: [`TevmActionsApi`](TevmActionsApi.md)\[`"setAccount"`\]

## Defined in

packages/memory-client/types/TevmViemActionsApi.d.ts:15
