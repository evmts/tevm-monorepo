[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / CreateScript

# Type alias: CreateScript()\<TName, THumanReadableAbi, TAddress, TBytecode, TAbi, THasConstructor\>

> **CreateScript**\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TAbi`, `THasConstructor`\>: (...`args`) => [`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `Hex`, `Hex`, `Hex`\>

Creates a deployless instance of a contract
Can be used to execute code that isn't deployed in tevm
or [viem](https://viem.sh/docs/actions/public/call#deployless-calls)

## Type parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* `string`[] \| readonly `string`[]

• **TAddress** *extends* `Address` \| `undefined` = `undefined`

• **TBytecode** *extends* `Hex` \| `undefined` = `undefined`

• **TAbi** *extends* `ParseAbi`\<`THumanReadableAbi`\> = `ParseAbi`\<`THumanReadableAbi`\>

• **THasConstructor** = `TAbi` *extends* `Abi` ? `Abi` *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

## Parameters

• ...**args**: `THasConstructor` *extends* `false` ? `TBytecode` *extends* `Hex` ? [] \| [`object`] \| [`Omit`\<`EncodeDeployDataParameters`\<`TAbi`\>, `"bytecode"` \| `"abi"`\> & `object`] : [`object` \| `Omit`\<`EncodeDeployDataParameters`\<`TAbi`\>, `"abi"`\>] : [`object` \| `Omit`\<`EncodeDeployDataParameters`\<`TAbi`\>, `"bytecode"` \| `"abi"`\> & `TBytecode` *extends* `Hex` ? `object` : `object`]

## Returns

[`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `Hex`, `Hex`, `Hex`\>

## Source

[CreateScript.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/CreateScript.ts#L9)
