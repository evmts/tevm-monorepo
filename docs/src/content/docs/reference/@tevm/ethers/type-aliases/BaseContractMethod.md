---
editUrl: false
next: false
prev: false
title: "BaseContractMethod"
---

> **BaseContractMethod**\<`TArguments`, `TReturnType`, `TExtendedReturnType`\>: (...`args`) => `Promise`\<`TReturnType` \| `TExtendedReturnType`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TArguments` extends `ReadonlyArray`\<`any`\> | `ReadonlyArray`\<`any`\> |
| `TReturnType` | `any` |
| `TExtendedReturnType` extends `TReturnType` \| `ContractTransactionResponse` | `ContractTransactionResponse` |

## Parameters

▪ ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

## Type declaration

### \_contract

> **\_contract**: `BaseContract`

### \_key

> **\_key**: `string`

### estimateGas

> **estimateGas**: (...`args`) => `Promise`\<`bigint`\>

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

### fragment

> **`readonly`** **fragment**: `FunctionFragment`

### getFragment

> **getFragment**: (...`args`) => `FunctionFragment`

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

### name

> **name**: `string`

### populateTransaction

> **populateTransaction**: (...`args`) => `Promise`\<`ContractTransaction`\>

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

### send

> **send**: (...`args`) => `Promise`\<`ContractTransactionResponse`\>

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

### staticCall

> **staticCall**: (...`args`) => `Promise`\<`TReturnType`\>

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

### staticCallResult

> **staticCallResult**: (...`args`) => `Promise`\<`Result`\>

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](/reference/tevm/ethers/type-aliases/contractmethodargs/)\<`TArguments`\>

## Source

[extensions/ethers/src/contract/BaseContractMethod.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L10)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
