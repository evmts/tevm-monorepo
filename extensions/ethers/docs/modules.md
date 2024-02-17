[@tevm/ethers](README.md) / Exports

# @tevm/ethers

## Table of contents

### Classes

- [TevmProvider](classes/TevmProvider.md)

### Type Aliases

- [BaseContractMethod](modules.md#basecontractmethod)
- [ContractMethodArgs](modules.md#contractmethodargs)
- [TypesafeEthersContract](modules.md#typesafeetherscontract)
- [TypesafeEthersContractConstructor](modules.md#typesafeetherscontractconstructor)
- [TypesafeEthersInterfaceConstructor](modules.md#typesafeethersinterfaceconstructor)

### Variables

- [Contract](modules.md#contract)
- [Interface](modules.md#interface)

## Type Aliases

### BaseContractMethod

Ƭ **BaseContractMethod**\<`TArguments`, `TReturnType`, `TExtendedReturnType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TArguments` | extends `ReadonlyArray`\<`any`\> = `ReadonlyArray`\<`any`\> |
| `TReturnType` | `any` |
| `TExtendedReturnType` | extends `TReturnType` \| `ContractTransactionResponse` = `ContractTransactionResponse` |

#### Call signature

▸ (`...args`): `Promise`\<`TReturnType` \| `TExtendedReturnType`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`ContractMethodArgs`](modules.md#contractmethodargs)\<`TArguments`\> |

##### Returns

`Promise`\<`TReturnType` \| `TExtendedReturnType`\>

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_contract` | `BaseContract` |
| `_key` | `string` |
| `estimateGas` | (...`args`: [`ContractMethodArgs`](modules.md#contractmethodargs)\<`TArguments`\>) => `Promise`\<`bigint`\> |
| `fragment` | `FunctionFragment` |
| `getFragment` | (...`args`: [`ContractMethodArgs`](modules.md#contractmethodargs)\<`TArguments`\>) => `FunctionFragment` |
| `name` | `string` |
| `populateTransaction` | (...`args`: [`ContractMethodArgs`](modules.md#contractmethodargs)\<`TArguments`\>) => `Promise`\<`ContractTransaction`\> |
| `send` | (...`args`: [`ContractMethodArgs`](modules.md#contractmethodargs)\<`TArguments`\>) => `Promise`\<`ContractTransactionResponse`\> |
| `staticCall` | (...`args`: [`ContractMethodArgs`](modules.md#contractmethodargs)\<`TArguments`\>) => `Promise`\<`TReturnType`\> |
| `staticCallResult` | (...`args`: [`ContractMethodArgs`](modules.md#contractmethodargs)\<`TArguments`\>) => `Promise`\<`Result`\> |

#### Defined in

[extensions/ethers/src/contract/BaseContractMethod.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/BaseContractMethod.ts#L10)

___

### ContractMethodArgs

Ƭ **ContractMethodArgs**\<`A`\>: [...A, `Overrides`] \| `A`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends `ReadonlyArray`\<`any`\> |

#### Defined in

[extensions/ethers/src/contract/ContractMethodArgs.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/ContractMethodArgs.ts#L3)

___

### TypesafeEthersContract

Ƭ **TypesafeEthersContract**\<`TAbi`\>: `BaseContract` & \{ [TFunctionName in ExtractAbiFunctionNames\<TAbi, "pure" \| "view"\>]: BaseContractMethod\<AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>["inputs"]\> & any[], AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>["outputs"]\>[0], AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>["outputs"]\>[0]\> } & \{ [TFunctionName in ExtractAbiFunctionNames\<TAbi, "nonpayable" \| "payable"\>]: BaseContractMethod\<AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>["inputs"]\> & any[], AbiParametersToPrimitiveTypes\<ExtractAbiFunction\<TAbi, TFunctionName\>["outputs"]\>[0], ContractTransactionResponse\> } & \{ `queryFilter`: \<TContractEventName\>(`event`: `TContractEventName`, `fromBlock?`: `BlockTag`, `toBlock?`: `BlockTag`) => `Promise`\<`TContractEventName` extends `ExtractAbiEventNames`\<`TAbi`\> ? `ExtractAbiEvent`\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` |

#### Defined in

[extensions/ethers/src/contract/TypesafeEthersContract.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/TypesafeEthersContract.ts#L19)

___

### TypesafeEthersContractConstructor

Ƭ **TypesafeEthersContractConstructor**: \<TAbi\>(`target`: `string` \| `Addressable`, `abi`: `TAbi` \| \{ `fragments`: `TAbi`  }, `runner?`: ``null`` \| `ContractRunner`, `_deployTx?`: ``null`` \| `TransactionResponse`) => `BaseContract` & \{ [TFunctionName in string]: BaseContractMethod\<\{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0]\> } & \{ [TFunctionName in string]: BaseContractMethod\<\{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], ContractTransactionResponse\> } & \{ `queryFilter`: \<TContractEventName\>(`event`: `TContractEventName`, `fromBlock?`: `BlockTag`, `toBlock?`: `BlockTag`) => `Promise`\<`TContractEventName` extends `ExtractAbiEventNames`\<`TAbi`\> ? `ExtractAbiEvent`\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>  } & `Contract`

#### Type declaration

• **new TypesafeEthersContractConstructor**\<`TAbi`\>(`target`, `abi`, `runner?`, `_deployTx?`): `BaseContract` & \{ [TFunctionName in string]: BaseContractMethod\<\{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0]\> } & \{ [TFunctionName in string]: BaseContractMethod\<\{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], ContractTransactionResponse\> } & \{ `queryFilter`: \<TContractEventName\>(`event`: `TContractEventName`, `fromBlock?`: `BlockTag`, `toBlock?`: `BlockTag`) => `Promise`\<`TContractEventName` extends `ExtractAbiEventNames`\<`TAbi`\> ? `ExtractAbiEvent`\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>  } & `Contract`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `string` \| `Addressable` |
| `abi` | `TAbi` \| \{ `fragments`: `TAbi`  } |
| `runner?` | ``null`` \| `ContractRunner` |
| `_deployTx?` | ``null`` \| `TransactionResponse` |

##### Returns

`BaseContract` & \{ [TFunctionName in string]: BaseContractMethod\<\{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0]\> } & \{ [TFunctionName in string]: BaseContractMethod\<\{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], ContractTransactionResponse\> } & \{ `queryFilter`: \<TContractEventName\>(`event`: `TContractEventName`, `fromBlock?`: `BlockTag`, `toBlock?`: `BlockTag`) => `Promise`\<`TContractEventName` extends `ExtractAbiEventNames`\<`TAbi`\> ? `ExtractAbiEvent`\<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>  } & `Contract`

#### Defined in

[extensions/ethers/src/contract/Contract.d.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/Contract.d.ts#L21)

___

### TypesafeEthersInterfaceConstructor

Ƭ **TypesafeEthersInterfaceConstructor**: \<TAbi\>(`abi`: `InterfaceAbi`) => `Omit`\<`Interface`, ``"fragments"``\> & \{ `fragments`: `TAbi`  }

#### Type declaration

• **new TypesafeEthersInterfaceConstructor**\<`TAbi`\>(`abi`): `Omit`\<`Interface`, ``"fragments"``\> & \{ `fragments`: `TAbi`  }

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `abi` | `InterfaceAbi` |

##### Returns

`Omit`\<`Interface`, ``"fragments"``\> & \{ `fragments`: `TAbi`  }

#### Defined in

[extensions/ethers/src/contract/Contract.d.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/Contract.d.ts#L12)

## Variables

### Contract

• `Const` **Contract**: [`TypesafeEthersContractConstructor`](modules.md#typesafeetherscontractconstructor)

#### Defined in

[extensions/ethers/src/contract/Contract.d.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/Contract.d.ts#L30)

___

### Interface

• `Const` **Interface**: [`TypesafeEthersInterfaceConstructor`](modules.md#typesafeethersinterfaceconstructor)

#### Defined in

[extensions/ethers/src/contract/Contract.d.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/Contract.d.ts#L19)
