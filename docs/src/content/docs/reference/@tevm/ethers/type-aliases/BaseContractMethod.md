---
editUrl: false
next: false
prev: false
title: "BaseContractMethod"
---

> **BaseContractMethod**\<`TArguments`, `TReturnType`, `TExtendedReturnType`\>: (...`args`) => `Promise`\<`TReturnType` \| `TExtendedReturnType`\>

## Type Parameters

• **TArguments** *extends* `ReadonlyArray`\<`any`\> = `ReadonlyArray`\<`any`\>

• **TReturnType** = `any`

• **TExtendedReturnType** *extends* `TReturnType` \| `ContractTransactionResponse` = `ContractTransactionResponse`

## Parameters

• ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

## Returns

`Promise`\<`TReturnType` \| `TExtendedReturnType`\>

## Type declaration

### \_contract

> **\_contract**: `BaseContract`

### \_key

> **\_key**: `string`

### estimateGas()

> **estimateGas**: (...`args`) => `Promise`\<`bigint`\>

#### Parameters

• ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

#### Returns

`Promise`\<`bigint`\>

### fragment

> `readonly` **fragment**: `FunctionFragment`

### getFragment()

> **getFragment**: (...`args`) => `FunctionFragment`

#### Parameters

• ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

#### Returns

`FunctionFragment`

### name

> **name**: `string`

### populateTransaction()

> **populateTransaction**: (...`args`) => `Promise`\<`ContractTransaction`\>

#### Parameters

• ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

#### Returns

`Promise`\<`ContractTransaction`\>

### send()

> **send**: (...`args`) => `Promise`\<`ContractTransactionResponse`\>

#### Parameters

• ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

#### Returns

`Promise`\<`ContractTransactionResponse`\>

### staticCall()

> **staticCall**: (...`args`) => `Promise`\<`TReturnType`\>

#### Parameters

• ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

#### Returns

`Promise`\<`TReturnType`\>

### staticCallResult()

> **staticCallResult**: (...`args`) => `Promise`\<`Result`\>

#### Parameters

• ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

#### Returns

`Promise`\<`Result`\>

## Defined in

[extensions/ethers/src/contract/BaseContractMethod.ts:4](https://github.com/qbzzt/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L4)
