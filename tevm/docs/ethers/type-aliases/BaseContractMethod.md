**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethers](../README.md) > BaseContractMethod

# Type alias: BaseContractMethod`<TArguments, TReturnType, TExtendedReturnType>`

> **BaseContractMethod**\<`TArguments`, `TReturnType`, `TExtendedReturnType`\>: (...`args`) => `Promise`\<`TReturnType` \| `TExtendedReturnType`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TArguments` extends `ReadonlyArray`\<`any`\> | `ReadonlyArray`\<`any`\> |
| `TReturnType` | `any` |
| `TExtendedReturnType` extends `TReturnType` \| `ContractTransactionResponse` | `ContractTransactionResponse` |

## Parameters

▪ ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

## Type declaration

### \_contract

> **\_contract**: `BaseContract`

### \_key

> **\_key**: `string`

### estimateGas

> **estimateGas**: (...`args`) => `Promise`\<`bigint`\>

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

### fragment

> **`readonly`** **fragment**: `FunctionFragment`

### getFragment

> **getFragment**: (...`args`) => `FunctionFragment`

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

### name

> **name**: `string`

### populateTransaction

> **populateTransaction**: (...`args`) => `Promise`\<`ContractTransaction`\>

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

### send

> **send**: (...`args`) => `Promise`\<`ContractTransactionResponse`\>

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

### staticCall

> **staticCall**: (...`args`) => `Promise`\<`TReturnType`\>

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

### staticCallResult

> **staticCallResult**: (...`args`) => `Promise`\<`Result`\>

#### Parameters

▪ ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

## Source

[extensions/ethers/src/BaseContractMethod.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/BaseContractMethod.ts#L10)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
