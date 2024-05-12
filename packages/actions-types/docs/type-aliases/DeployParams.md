**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > DeployParams

# Type alias: DeployParams`<TThrowOnFail, TAbi, THasConstructor, TAllArgs>`

> **DeployParams**\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>: `Omit`\<[`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\>, `"to"`\> & `object` & `EncodeDeployDataParameters`\<`TAbi`, `THasConstructor`, `TAllArgs`\>

Wraps tevm_call to deploy a contract
Unlike most call actions `createTransaction` defaults to true

## Type declaration

### salt

> **salt**?: [`Hex`](Hex.md)

An optional CREATE2 salt.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnFail` extends `boolean` | `boolean` |
| `TAbi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `THasConstructor` | `TAbi` extends `Abi` ? `Abi` extends `TAbi` ? `true` : [`Extract`\<`TAbi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true` |
| `TAllArgs` | `ContractConstructorArgs`\<`TAbi`\> |

## Source

[params/DeployParams.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/DeployParams.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
