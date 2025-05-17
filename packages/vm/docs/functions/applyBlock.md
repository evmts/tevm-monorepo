[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / applyBlock

# Function: applyBlock()

> **applyBlock**(`vm`): (`block`, `opts`) => `Promise`\<[`ApplyBlockResult`](../interfaces/ApplyBlockResult.md)\>

Defined in: [packages/vm/src/actions/applyBlock.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/applyBlock.ts#L24)

Validates and applies a block, computing the results of
applying its transactions. This method doesn't modify the
block itself. It computes the block rewards and puts
them on state (but doesn't persist the changes).

## Parameters

### vm

`BaseVm`

## Returns

> (`block`, `opts`): `Promise`\<[`ApplyBlockResult`](../interfaces/ApplyBlockResult.md)\>

### Parameters

#### block

`Block`

#### opts

[`RunBlockOpts`](../interfaces/RunBlockOpts.md)

### Returns

`Promise`\<[`ApplyBlockResult`](../interfaces/ApplyBlockResult.md)\>
