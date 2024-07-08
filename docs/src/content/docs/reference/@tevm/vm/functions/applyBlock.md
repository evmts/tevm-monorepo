---
editUrl: false
next: false
prev: false
title: "applyBlock"
---

> **applyBlock**(`vm`): (`block`, `opts`) => `Promise`\<[`ApplyBlockResult`](/reference/tevm/vm/interfaces/applyblockresult/)\>

Validates and applies a block, computing the results of
applying its transactions. This method doesn't modify the
block itself. It computes the block rewards and puts
them on state (but doesn't persist the changes).

## Parameters

• **vm**: `BaseVm`

## Returns

`Function`

### Parameters

• **block**: [`Block`](/reference/tevm/block/classes/block/)

• **opts**: [`RunBlockOpts`](/reference/tevm/vm/interfaces/runblockopts/)

### Returns

`Promise`\<[`ApplyBlockResult`](/reference/tevm/vm/interfaces/applyblockresult/)\>

## Defined in

[packages/vm/src/actions/applyBlock.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/applyBlock.ts#L24)
