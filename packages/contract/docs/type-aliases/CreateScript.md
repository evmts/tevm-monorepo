[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / CreateScript

# Type Alias: CreateScript()\<TName, THumanReadableAbi, TAddress, TBytecode\>

> **CreateScript**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`\>: (...`args`) => [`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `Hex`, `Hex`, `Hex`\>

Creates a deployless instance of a contract
Can be used to execute code that isn't deployed in tevm
or [viem](https://viem.sh/docs/actions/public/call#deployless-calls)

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* `string`[] \| readonly `string`[]

• **TAddress** *extends* `Address` \| `undefined` = `undefined`

• **TBytecode** *extends* `Hex` \| `undefined` = `undefined`

## Parameters

• ...**args**: [`DeployArgs`](DeployArgs.md)\<`THumanReadableAbi`, `TBytecode`\>

## Returns

[`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `Hex`, `Hex`, `Hex`\>

## Defined in

[CreateScript.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/CreateScript.ts#L10)
