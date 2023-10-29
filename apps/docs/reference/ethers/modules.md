[@evmts/ethers](/reference/ethers/README.md) / Exports

# @evmts/ethers

## Table of contents

### Type Aliases

- [TypesafeEthersContractConstructor](/reference/ethers/modules.md#typesafeetherscontractconstructor)
- [TypesafeEthersInterfaceConstructor](/reference/ethers/modules.md#typesafeethersinterfaceconstructor)

### Variables

- [Contract](/reference/ethers/modules.md#contract)
- [Interface](/reference/ethers/modules.md#interface)

## Type Aliases

### TypesafeEthersContractConstructor

Ƭ **TypesafeEthersContractConstructor**: <TAbi\>(`target`: `string` \| `Addressable`, `abi`: `TAbi` \| { `fragments`: `TAbi`  }, `runner?`: ``null`` \| `ContractRunner`, `_deployTx?`: ``null`` \| `TransactionResponse`) => `BaseContract` & { [TFunctionName in string]: BaseContractMethod<{ [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], { [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], { [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0]\> } & { [TFunctionName in string]: BaseContractMethod<{ [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], { [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], ContractTransactionResponse\> } & { `queryFilter`: <TContractEventName\>(`event`: `TContractEventName`, `fromBlock?`: `BlockTag`, `toBlock?`: `BlockTag`) => `Promise`<`TContractEventName` extends `ExtractAbiEventNames`<`TAbi`\> ? `ExtractAbiEvent`<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>  } & `Contract`

#### Type declaration

• **new TypesafeEthersContractConstructor**<`TAbi`\>(`target`, `abi`, `runner?`, `_deployTx?`): `BaseContract` & { [TFunctionName in string]: BaseContractMethod<{ [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], { [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], { [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0]\> } & { [TFunctionName in string]: BaseContractMethod<{ [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], { [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], ContractTransactionResponse\> } & { `queryFilter`: <TContractEventName\>(`event`: `TContractEventName`, `fromBlock?`: `BlockTag`, `toBlock?`: `BlockTag`) => `Promise`<`TContractEventName` extends `ExtractAbiEventNames`<`TAbi`\> ? `ExtractAbiEvent`<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>  } & `Contract`

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `string` \| `Addressable` |
| `abi` | `TAbi` \| { `fragments`: `TAbi`  } |
| `runner?` | ``null`` \| `ContractRunner` |
| `_deployTx?` | ``null`` \| `TransactionResponse` |

##### Returns

`BaseContract` & { [TFunctionName in string]: BaseContractMethod<{ [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], { [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], { [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0]\> } & { [TFunctionName in string]: BaseContractMethod<{ [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], { [K in string \| number \| symbol]: { [K in string \| number \| symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], ContractTransactionResponse\> } & { `queryFilter`: <TContractEventName\>(`event`: `TContractEventName`, `fromBlock?`: `BlockTag`, `toBlock?`: `BlockTag`) => `Promise`<`TContractEventName` extends `ExtractAbiEventNames`<`TAbi`\> ? `ExtractAbiEvent`<`TAbi`, `TContractEventName`\> : `EventLog` \| `Log`[]\>  } & `Contract`

#### Defined in

[ethers/src/Contract.d.ts:21](https://github.com/evmts/evmts-monorepo/blob/main/ethers/src/Contract.d.ts#L21)

___

### TypesafeEthersInterfaceConstructor

Ƭ **TypesafeEthersInterfaceConstructor**: <TAbi\>(`abi`: `InterfaceAbi`) => `Omit`<`Interface`, ``"fragments"``\> & { `fragments`: `TAbi`  }

#### Type declaration

• **new TypesafeEthersInterfaceConstructor**<`TAbi`\>(`abi`): `Omit`<`Interface`, ``"fragments"``\> & { `fragments`: `TAbi`  }

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `abi` | `InterfaceAbi` |

##### Returns

`Omit`<`Interface`, ``"fragments"``\> & { `fragments`: `TAbi`  }

#### Defined in

[ethers/src/Contract.d.ts:12](https://github.com/evmts/evmts-monorepo/blob/main/ethers/src/Contract.d.ts#L12)

## Variables

### Contract

• `Const` **Contract**: [`TypesafeEthersContractConstructor`](/reference/ethers/modules.md#typesafeetherscontractconstructor)

#### Defined in

[ethers/src/Contract.d.ts:30](https://github.com/evmts/evmts-monorepo/blob/main/ethers/src/Contract.d.ts#L30)

___

### Interface

• `Const` **Interface**: [`TypesafeEthersInterfaceConstructor`](/reference/ethers/modules.md#typesafeethersinterfaceconstructor)

#### Defined in

[ethers/src/Contract.d.ts:19](https://github.com/evmts/evmts-monorepo/blob/main/ethers/src/Contract.d.ts#L19)
