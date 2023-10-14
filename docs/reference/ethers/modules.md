[@evmts/ethers](/reference/ethers/README.md) / Exports

# @evmts/ethers

## Table of contents

### Type Aliases

- [BaseContractMethod](/reference/ethers/modules.md#basecontractmethod)
- [ContractMethodArgs](/reference/ethers/modules.md#contractmethodargs)
- [TypesafeEthersContract](/reference/ethers/modules.md#typesafeetherscontract)

### Variables

- [Contract](/reference/ethers/modules.md#contract)
- [Interface](/reference/ethers/modules.md#interface)

## Type Aliases

### BaseContractMethod

Ƭ **BaseContractMethod**<`TArguments`, `TReturnType`, `TExtendedReturnType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TArguments` | extends `ReadonlyArray`<`any`\> = `ReadonlyArray`<`any`\> |
| `TReturnType` | `any` |
| `TExtendedReturnType` | extends `TReturnType` \| `ContractTransactionResponse` = `ContractTransactionResponse` |

#### Call signature

▸ (`...args`): `Promise`<`TReturnType` \| `TExtendedReturnType`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`ContractMethodArgs`](/reference/ethers/modules.md#contractmethodargs)<`TArguments`\> |

##### Returns

`Promise`<`TReturnType` \| `TExtendedReturnType`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_contract` | `BaseContract` |
| `_key` | `string` |
| `estimateGas` | (...`args`: [`ContractMethodArgs`](/reference/ethers/modules.md#contractmethodargs)<`TArguments`\>) => `Promise`<`bigint`\> |
| `fragment` | `FunctionFragment` |
| `getFragment` | (...`args`: [`ContractMethodArgs`](/reference/ethers/modules.md#contractmethodargs)<`TArguments`\>) => `FunctionFragment` |
| `name` | `string` |
| `populateTransaction` | (...`args`: [`ContractMethodArgs`](/reference/ethers/modules.md#contractmethodargs)<`TArguments`\>) => `Promise`<`ContractTransaction`\> |
| `send` | (...`args`: [`ContractMethodArgs`](/reference/ethers/modules.md#contractmethodargs)<`TArguments`\>) => `Promise`<`ContractTransactionResponse`\> |
| `staticCall` | (...`args`: [`ContractMethodArgs`](/reference/ethers/modules.md#contractmethodargs)<`TArguments`\>) => `Promise`<`TReturnType`\> |
| `staticCallResult` | (...`args`: [`ContractMethodArgs`](/reference/ethers/modules.md#contractmethodargs)<`TArguments`\>) => `Promise`<`Result`\> |

#### Defined in

[BaseContractMethod.ts:10](https://github.com/evmts/evmts-monorepo/blob/main/ethers/src/BaseContractMethod.ts#L10)

___

### ContractMethodArgs

Ƭ **ContractMethodArgs**<`A`\>: [...A, `Overrides`] \| `A`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends `ReadonlyArray`<`any`\> |

#### Defined in

[ContractMethodArgs.ts:3](https://github.com/evmts/evmts-monorepo/blob/main/ethers/src/ContractMethodArgs.ts#L3)

___

### TypesafeEthersContract

Ƭ **TypesafeEthersContract**<`TAbi`\>: `BaseContract` & { [TFunctionName in ExtractAbiFunctionNames<TAbi, "pure" \| "view"\>]: BaseContractMethod<AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName\>["inputs"]\> & any[], AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName\>["outputs"]\>[0], AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName\>["outputs"]\>[0]\> } & { [TFunctionName in ExtractAbiFunctionNames<TAbi, "nonpayable" \| "payable"\>]: BaseContractMethod<AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName\>["inputs"]\> & any[], AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName\>["outputs"]\>[0], ContractTransactionResponse\> } & { `queryFilter`: <TContractEventName\>(`event`: `TContractEventName`, `fromBlock?`: `BlockTag`, `toBlock?`: `BlockTag`) => `Promise`<`TContractEventName` extends `ExtractAbiEventNames`<`TAbi`\> ? `ExtractAbiEvent`<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` |

#### Defined in

[TypesafeEthersContract.ts:19](https://github.com/evmts/evmts-monorepo/blob/main/ethers/src/TypesafeEthersContract.ts#L19)

## Variables

### Contract

• `Const` **Contract**: `TypesafeEthersContractConstructor`

#### Defined in

[Contract.ts:30](https://github.com/evmts/evmts-monorepo/blob/main/ethers/src/Contract.ts#L30)

___

### Interface

• `Const` **Interface**: `TypesafeEthersInterfaceConstructor`

#### Defined in

[Contract.ts:19](https://github.com/evmts/evmts-monorepo/blob/main/ethers/src/Contract.ts#L19)
