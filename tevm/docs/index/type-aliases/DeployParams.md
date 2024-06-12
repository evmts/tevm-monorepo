[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / DeployParams

# Type alias: DeployParams\<TThrowOnFail, TAbi, THasConstructor, TAllArgs\>

> **DeployParams**\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>: `Omit`\<`BaseCallParams`\<`TThrowOnFail`\>, `"to"`\> & `object` & [`EncodeDeployDataParameters`](../../utils/type-aliases/EncodeDeployDataParameters.md)\<`TAbi`, `THasConstructor`, `TAllArgs`\>

Wraps tevm_call to deploy a contract
Unlike most call actions `createTransaction` defaults to true

## Type declaration

### salt?

> `optional` `readonly` **salt**: `Hex`

An optional CREATE2 salt.

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

• **TAbi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

• **THasConstructor** = `TAbi` *extends* [`Abi`](Abi.md) ? [`Abi`](Abi.md) *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

• **TAllArgs** = [`ContractConstructorArgs`](../../utils/type-aliases/ContractConstructorArgs.md)\<`TAbi`\>

## Source

packages/actions/types/Deploy/DeployParams.d.ts:8
