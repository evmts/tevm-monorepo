[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / applyBlock

# Function: applyBlock()

> **applyBlock**(`vm`): (`block`, `opts`) => `Promise`\<[`ApplyBlockResult`](../interfaces/ApplyBlockResult.md)\>

Defined in: packages/vm/types/actions/applyBlock.d.ts:12

Validates and applies a block, computing the results of
applying its transactions. This method doesn't modify the
block itself. It computes the block rewards and puts
them on state (but doesn't persist the changes).

## Parameters

### vm

`BaseVm`

## Returns

`Function`

### Parameters

#### block

[`Block`](../../block/classes/Block.md)

#### opts

[`RunBlockOpts`](../interfaces/RunBlockOpts.md)

### Returns

`Promise`\<[`ApplyBlockResult`](../interfaces/ApplyBlockResult.md)\>
