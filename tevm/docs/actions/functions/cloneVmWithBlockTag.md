[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / cloneVmWithBlockTag

# Function: cloneVmWithBlockTag()

> **cloneVmWithBlockTag**(`client`, `block`): `Promise`\<[`Vm`](../../vm/type-aliases/Vm.md) \| [`InternalError`](../../errors/classes/InternalError.md) \| [`ForkError`](../../errors/classes/ForkError.md)\>

## Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | [`TevmNode`](../../index/type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{ \}\> |
| `block` | [`Block`](../../block/classes/Block.md) |

## Returns

`Promise`\<[`Vm`](../../vm/type-aliases/Vm.md) \| [`InternalError`](../../errors/classes/InternalError.md) \| [`ForkError`](../../errors/classes/ForkError.md)\>
