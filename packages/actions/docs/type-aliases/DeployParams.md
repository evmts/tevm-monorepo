[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / DeployParams

# Type Alias: DeployParams\<TThrowOnFail, TAbi, THasConstructor, TAllArgs\>

> **DeployParams**\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>: `Omit`\<[`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\>, `"to"`\> & `object` & `EncodeDeployDataParameters`\<`TAbi`, `THasConstructor`, `TAllArgs`\>

Wraps tevm_call to deploy a contract
Unlike most call actions `createTransaction` defaults to true

## Type declaration

### salt?

> `readonly` `optional` **salt**: [`Hex`](Hex.md)

An optional CREATE2 salt.

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **THasConstructor** = `TAbi` *extends* `Abi` ? `Abi` *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

• **TAllArgs** = `ContractConstructorArgs`\<`TAbi`\>

## Defined in

[packages/actions/src/Deploy/DeployParams.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Deploy/DeployParams.ts#L9)
