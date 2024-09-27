---
editUrl: false
next: false
prev: false
title: "cloneVmWithBlockTag"
---

> **cloneVmWithBlockTag**(`client`, `block`): `Promise`\<[`Vm`](/reference/tevm/vm/type-aliases/vm/) \| [`InternalError`](/reference/tevm/errors/classes/internalerror/) \| [`ForkError`](/reference/tevm/errors/classes/forkerror/)\>

Prepares the VM for a call given a block tag. This includes
- Cloning the VM
- Setting the state root
- Setting the fork transport if the block is in the past

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

• **block**: [`Block`](/reference/tevm/block/classes/block/)

## Returns

`Promise`\<[`Vm`](/reference/tevm/vm/type-aliases/vm/) \| [`InternalError`](/reference/tevm/errors/classes/internalerror/) \| [`ForkError`](/reference/tevm/errors/classes/forkerror/)\>

VM or errors

## Throws

returns errors as values

## Defined in

[packages/actions/src/Call/cloneVmWithBlock.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/cloneVmWithBlock.js#L15)
