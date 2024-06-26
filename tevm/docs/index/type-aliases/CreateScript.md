[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CreateScript

# Type Alias: CreateScript()\<TName, THumanReadableAbi, TAddress, TBytecode\>

> **CreateScript**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`\>: (...`args`) => [`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, [`Hex`](Hex.md), [`Hex`](Hex.md), [`Hex`](Hex.md)\>

Creates a deployless instance of a contract
Can be used to execute code that isn't deployed in tevm
or [viem](https://viem.sh/docs/actions/public/call#deployless-calls)

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* `string`[] \| readonly `string`[]

• **TAddress** *extends* [`Address`](Address.md) \| `undefined` = `undefined`

• **TBytecode** *extends* [`Hex`](Hex.md) \| `undefined` = `undefined`

## Parameters

• ...**args**: [`DeployArgs`](DeployArgs.md)\<`THumanReadableAbi`, `TBytecode`\>

## Returns

[`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, [`Hex`](Hex.md), [`Hex`](Hex.md), [`Hex`](Hex.md)\>

## Defined in

packages/contract/types/CreateScript.d.ts:9
