---
editUrl: false
next: false
prev: false
title: "CreateScript"
---

> **CreateScript**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`\>: (...`args`) => [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TAddress`, [`Hex`](/reference/tevm/utils/type-aliases/hex/), [`Hex`](/reference/tevm/utils/type-aliases/hex/), [`Hex`](/reference/tevm/utils/type-aliases/hex/)\>

Creates a deployless instance of a contract
Can be used to execute code that isn't deployed in tevm
or [viem](https://viem.sh/docs/actions/public/call#deployless-calls)

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* `string`[] \| readonly `string`[]

• **TAddress** *extends* [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined` = `undefined`

• **TBytecode** *extends* [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `undefined` = `undefined`

## Parameters

• ...**args**: [`DeployArgs`](/reference/tevm/contract/type-aliases/deployargs/)\<`THumanReadableAbi`, `TBytecode`\>

## Returns

[`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TAddress`, [`Hex`](/reference/tevm/utils/type-aliases/hex/), [`Hex`](/reference/tevm/utils/type-aliases/hex/), [`Hex`](/reference/tevm/utils/type-aliases/hex/)\>

## Defined in

[CreateScript.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/CreateScript.ts#L10)
