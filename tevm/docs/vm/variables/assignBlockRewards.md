[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / assignBlockRewards

# Variable: assignBlockRewards()

> `const` **assignBlockRewards**: (`vm`) => (`block`) => `Promise`\<`void`\>

Defined in: packages/vm/types/actions/assignBlockRewards.d.ts:7

Calculates block rewards for miner and ommers and puts
the updated balances of their accounts to state.

## Parameters

### vm

`BaseVm`

## Returns

> (`block`): `Promise`\<`void`\>

### Parameters

#### block

[`Block`](../../block/classes/Block.md)

### Returns

`Promise`\<`void`\>
