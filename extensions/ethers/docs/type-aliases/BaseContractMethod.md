[**@tevm/ethers**](../README.md)

***

[@tevm/ethers](../globals.md) / BaseContractMethod

# Type Alias: BaseContractMethod()\<TArguments, TReturnType, TExtendedReturnType\>

> **BaseContractMethod**\<`TArguments`, `TReturnType`, `TExtendedReturnType`\> = `Promise`\<`TReturnType` \| `TExtendedReturnType`\>

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L4)

## Type Parameters

### TArguments

`TArguments` *extends* `ReadonlyArray`\<`any`\> = `ReadonlyArray`\<`any`\>

### TReturnType

`TReturnType` = `any`

### TExtendedReturnType

`TExtendedReturnType` *extends* `TReturnType` \| `ContractTransactionResponse` = `ContractTransactionResponse`

> **BaseContractMethod**(...`args`): `Promise`\<`TReturnType` \| `TExtendedReturnType`\>

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L9)

## Parameters

### args

...[`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

## Returns

`Promise`\<`TReturnType` \| `TExtendedReturnType`\>

## Properties

### \_contract

> **\_contract**: `BaseContract`

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L13)

***

### \_key

> **\_key**: `string`

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L15)

***

### estimateGas()

> **estimateGas**: (...`args`) => `Promise`\<`bigint`\>

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L18)

#### Parameters

##### args

...[`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`Promise`\<`bigint`\>

***

### fragment

> `readonly` **fragment**: `FunctionFragment`

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L24)

***

### getFragment()

> **getFragment**: (...`args`) => `FunctionFragment`

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L17)

#### Parameters

##### args

...[`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`FunctionFragment`

***

### name

> **name**: `string`

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L11)

***

### populateTransaction()

> **populateTransaction**: (...`args`) => `Promise`\<`ContractTransaction`\>

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L19)

#### Parameters

##### args

...[`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`Promise`\<`ContractTransaction`\>

***

### send()

> **send**: (...`args`) => `Promise`\<`ContractTransactionResponse`\>

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L20)

#### Parameters

##### args

...[`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`Promise`\<`ContractTransactionResponse`\>

***

### staticCall()

> **staticCall**: (...`args`) => `Promise`\<`TReturnType`\>

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L21)

#### Parameters

##### args

...[`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`Promise`\<`TReturnType`\>

***

### staticCallResult()

> **staticCallResult**: (...`args`) => `Promise`\<`Result`\>

Defined in: [extensions/ethers/src/contract/BaseContractMethod.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L22)

#### Parameters

##### args

...[`ContractMethodArgs`](ContractMethodArgs.md)\<`TArguments`\>

#### Returns

`Promise`\<`Result`\>
