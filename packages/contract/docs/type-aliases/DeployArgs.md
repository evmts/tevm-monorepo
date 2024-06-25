[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / DeployArgs

# Type Alias: DeployArgs\<THumanReadableAbi, TBytecode, TAbi, THasConstructor\>

> **DeployArgs**\<`THumanReadableAbi`, `TBytecode`, `TAbi`, `THasConstructor`\>: `THasConstructor` *extends* `false` ? `TBytecode` *extends* `Hex` ? [] \| [`object`] : [`object`] : `TBytecode` *extends* `Hex` ? [`object`] : [`object`]

Inferred arguments for a contract deployment

## Type Parameters

• **THumanReadableAbi** *extends* `string`[] \| readonly `string`[]

• **TBytecode** *extends* `Hex` \| `undefined` = `undefined`

• **TAbi** *extends* `ParseAbi`\<`THumanReadableAbi`\> = `ParseAbi`\<`THumanReadableAbi`\>

• **THasConstructor** = `TAbi` *extends* `Abi` ? `Abi` *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

## Defined in

[DeployArgs.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/DeployArgs.ts#L6)
