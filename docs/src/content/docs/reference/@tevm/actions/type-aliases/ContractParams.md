---
editUrl: false
next: false
prev: false
title: "ContractParams"
---

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](/reference/tevm/utils/type-aliases/encodefunctiondataparameters/)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on a contract

## Type declaration

### code?

> `optional` `readonly` **code**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

Alias for deployedBytecode

### deployedBytecode?

> `optional` `readonly` **deployedBytecode**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

Code to execute at the contract address.
If not provideded the code will be fetched from state

### to?

> `optional` `readonly` **to**: [`Address`](/reference/tevm/actions/type-aliases/address/)

The address to call.

## Type parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/actions/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/actions/type-aliases/abi/)

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[packages/actions/src/Contract/ContractParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractParams.ts#L8)
