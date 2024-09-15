---
editUrl: false
next: false
prev: false
title: "assignBlockRewards"
---

> **assignBlockRewards**(`vm`): (`block`) => `Promise`\<`void`\>

Calculates block rewards for miner and ommers and puts
the updated balances of their accounts to state.

## Parameters

• **vm**: `BaseVm`

## Returns

`Function`

### Parameters

• **block**: [`Block`](/reference/tevm/block/classes/block/)

### Returns

`Promise`\<`void`\>

## Defined in

[packages/vm/src/actions/assignBlockRewards.ts:12](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/actions/assignBlockRewards.ts#L12)
