[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / DeployArgs

# Type alias: DeployArgs\<THumanReadableAbi, TBytecode, TAbi, THasConstructor\>

> **DeployArgs**\<`THumanReadableAbi`, `TBytecode`, `TAbi`, `THasConstructor`\>: `THasConstructor` *extends* `false` ? `TBytecode` *extends* `Hex` ? [] \| [`object`] \| [`Omit`\<`EncodeDeployDataParameters`\<`TAbi`\>, `"bytecode"` \| `"abi"`\> & `object`] : [`object` \| `Omit`\<`EncodeDeployDataParameters`\<`TAbi`\>, `"abi"`\>] : [`object` \| `Omit`\<`EncodeDeployDataParameters`\<`TAbi`\>, `"bytecode"` \| `"abi"`\> & `TBytecode` *extends* `Hex` ? `object` : `object`]

Inferred arguments for a contract deployment

## Type parameters

• **THumanReadableAbi** *extends* `string`[] \| readonly `string`[]

• **TBytecode** *extends* `Hex` \| `undefined` = `undefined`

• **TAbi** *extends* `ParseAbi`\<`THumanReadableAbi`\> = `ParseAbi`\<`THumanReadableAbi`\>

• **THasConstructor** = `TAbi` *extends* `Abi` ? `Abi` *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

## Source

[DeployArgs.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/DeployArgs.ts#L6)
