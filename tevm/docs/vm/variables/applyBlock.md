[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / applyBlock

# Variable: applyBlock

> `const` **applyBlock**: (`vm`) => (`block`, `opts`) => `Promise`\<[`ApplyBlockResult`](../interfaces/ApplyBlockResult.md)\>

Validates and applies a block, computing the results of
applying its transactions. This method doesn't modify the
block itself. It computes the block rewards and puts
them on state (but doesn't persist the changes).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `vm` | `BaseVm` |

## Returns

(`block`, `opts`) => `Promise`\<[`ApplyBlockResult`](../interfaces/ApplyBlockResult.md)\>
