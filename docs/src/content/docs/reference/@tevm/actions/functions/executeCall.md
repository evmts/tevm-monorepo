---
editUrl: false
next: false
prev: false
title: "executeCall"
---

> **executeCall**(`client`, `evmInput`, `params`): `Promise`\<[`ExecuteCallResult`](/reference/tevm/actions/type-aliases/executecallresult/) & `object` \| `object`\>

executeCall encapsalates the internal logic of running a call in the EVM

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

• **evmInput**: [`EvmRunCallOpts`](/reference/tevm/evm/interfaces/evmruncallopts/)

• **params**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams/)\<`boolean`\>

## Returns

`Promise`\<[`ExecuteCallResult`](/reference/tevm/actions/type-aliases/executecallresult/) & `object` \| `object`\>

## Throws

returns errors as values

## Defined in

[packages/actions/src/Call/executeCall.js:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/executeCall.js#L28)
