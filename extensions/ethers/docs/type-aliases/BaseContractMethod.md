[**@tevm/ethers**](../README.md) • **Docs**

***

[@tevm/ethers](../globals.md) / BaseContractMethod

# Type Alias: BaseContractMethod()\<TArguments, TReturnType, TExtendedReturnType\>

> **BaseContractMethod**\<`TArguments`, `TReturnType`, `TExtendedReturnType`\>: (...`args`) => `Promise`\<`TReturnType` \| `TExtendedReturnType`\>

## Type Parameters

• **TArguments** *extends* `ReadonlyArray`\<`any`\> = `ReadonlyArray`\<`any`\>

• **TReturnType** = `any`

• **TExtendedReturnType** *extends* `TReturnType` \| `ContractTransactionResponse` = `ContractTransactionResponse`

## Parameters

• ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

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

• ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`Promise`\<`bigint`\>

### fragment

> `readonly` **fragment**: `FunctionFragment`

### getFragment()

> **getFragment**: (...`args`) => `FunctionFragment`

#### Parameters

• ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`FunctionFragment`

### name

> **name**: `string`

### populateTransaction()

> **populateTransaction**: (...`args`) => `Promise`\<`ContractTransaction`\>

#### Parameters

• ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`Promise`\<`ContractTransaction`\>

### send()

> **send**: (...`args`) => `Promise`\<`ContractTransactionResponse`\>

#### Parameters

• ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`Promise`\<`ContractTransactionResponse`\>

### staticCall()

> **staticCall**: (...`args`) => `Promise`\<`TReturnType`\>

#### Parameters

• ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`Promise`\<`TReturnType`\>

### staticCallResult()

> **staticCallResult**: (...`args`) => `Promise`\<`Result`\>

#### Parameters

• ...**args**: [`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`Promise`\<`Result`\>

## Defined in

[extensions/ethers/src/contract/BaseContractMethod.ts:4](https://github.com/qbzzt/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L4)
