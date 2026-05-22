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

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="tevmcall"></a> `tevmCall` | `TevmActionsApi`\[`"call"`\] | [packages/memory-client/src/TevmViemActionsApi.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L18) |
| <a id="tevmcontract"></a> `tevmContract` | `TevmActionsApi`\[`"contract"`\] | [packages/memory-client/src/TevmViemActionsApi.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L19) |
| <a id="tevmdeal"></a> `tevmDeal` | `TevmActionsApi`\[`"deal"`\] | [packages/memory-client/src/TevmViemActionsApi.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L26) |
| <a id="tevmdeploy"></a> `tevmDeploy` | `TevmActionsApi`\[`"deploy"`\] | [packages/memory-client/src/TevmViemActionsApi.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L20) |
| <a id="tevmdumpstate"></a> `tevmDumpState` | `TevmActionsApi`\[`"dumpState"`\] | [packages/memory-client/src/TevmViemActionsApi.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L23) |
| <a id="tevmgetaccount"></a> `tevmGetAccount` | `TevmActionsApi`\[`"getAccount"`\] | [packages/memory-client/src/TevmViemActionsApi.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L25) |
| <a id="tevmloadstate"></a> `tevmLoadState` | `TevmActionsApi`\[`"loadState"`\] | [packages/memory-client/src/TevmViemActionsApi.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L22) |
| <a id="tevmmine"></a> `tevmMine` | `TevmActionsApi`\[`"mine"`\] | [packages/memory-client/src/TevmViemActionsApi.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L21) |
| <a id="tevmready"></a> `tevmReady` | `TevmNode`\[`"ready"`\] | [packages/memory-client/src/TevmViemActionsApi.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L17) |
| <a id="tevmsetaccount"></a> `tevmSetAccount` | `TevmActionsApi`\[`"setAccount"`\] | [packages/memory-client/src/TevmViemActionsApi.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmViemActionsApi.ts#L24) |
