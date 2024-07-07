[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / assignBlockRewards

# Function: assignBlockRewards()

> **assignBlockRewards**(`vm`): (`block`) => `Promise`\<`void`\>

Calculates block rewards for miner and ommers and puts
the updated balances of their accounts to state.

## Parameters

• **vm**: `BaseVm`

## Returns

`Function`

### Parameters

• **block**: `Block`

### Returns

`Promise`\<`void`\>

## Defined in

[packages/vm/src/actions/assignBlockRewards.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/assignBlockRewards.ts#L12)
