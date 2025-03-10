[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / TevmViemActionsApi

# Type Alias: TevmViemActionsApi

> **TevmViemActionsApi**: `object`

Defined in: [packages/memory-client/src/TevmViemActionsApi.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L16)

A custom [viem extension](https://viem.sh/docs/clients/custom#extending-with-actions-or-configuration) for adding powerful
Tevm specific actions to the client. These actions come preloaded with [MemoryClient](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient/)
To add these actions use the `extend` method on a TevmClient with the tevmViemActions() extension.

## Type declaration

### tevmCall

> **tevmCall**: `TevmActionsApi`\[`"call"`\]

### tevmContract

> **tevmContract**: `TevmActionsApi`\[`"contract"`\]

### tevmDeploy

> **tevmDeploy**: `TevmActionsApi`\[`"deploy"`\]

### tevmDumpState

> **tevmDumpState**: `TevmActionsApi`\[`"dumpState"`\]

### tevmGetAccount

> **tevmGetAccount**: `TevmActionsApi`\[`"getAccount"`\]

### tevmLoadState

> **tevmLoadState**: `TevmActionsApi`\[`"loadState"`\]

### tevmMine

> **tevmMine**: `TevmActionsApi`\[`"mine"`\]

### tevmReady

> **tevmReady**: `TevmNode`\[`"ready"`\]

### tevmSetAccount

> **tevmSetAccount**: `TevmActionsApi`\[`"setAccount"`\]

## Example

```typescript
import { createTevmClient, tevmViemActions } from 'tevm'

const client = createTevmClient()
  .extend(tevmViemActions())
```
