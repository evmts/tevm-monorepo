[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmViemActionsApi

# Type Alias: TevmViemActionsApi

> **TevmViemActionsApi** = `object`

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

| Property | Type |
| ------ | ------ |
| <a id="tevmcall"></a> `tevmCall` | [`TevmActionsApi`](TevmActionsApi.md)\[`"call"`\] |
| <a id="tevmcontract"></a> `tevmContract` | [`TevmActionsApi`](TevmActionsApi.md)\[`"contract"`\] |
| <a id="tevmdeal"></a> `tevmDeal` | [`TevmActionsApi`](TevmActionsApi.md)\[`"deal"`\] |
| <a id="tevmdeploy"></a> `tevmDeploy` | [`TevmActionsApi`](TevmActionsApi.md)\[`"deploy"`\] |
| <a id="tevmdumpstate"></a> `tevmDumpState` | [`TevmActionsApi`](TevmActionsApi.md)\[`"dumpState"`\] |
| <a id="tevmgetaccount"></a> `tevmGetAccount` | [`TevmActionsApi`](TevmActionsApi.md)\[`"getAccount"`\] |
| <a id="tevmloadstate"></a> `tevmLoadState` | [`TevmActionsApi`](TevmActionsApi.md)\[`"loadState"`\] |
| <a id="tevmmine"></a> `tevmMine` | [`TevmActionsApi`](TevmActionsApi.md)\[`"mine"`\] |
| <a id="tevmready"></a> `tevmReady` | [`TevmNode`](TevmNode.md)\[`"ready"`\] |
| <a id="tevmsetaccount"></a> `tevmSetAccount` | [`TevmActionsApi`](TevmActionsApi.md)\[`"setAccount"`\] |
