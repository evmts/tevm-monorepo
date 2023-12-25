[@tevm/ethers](README.md) / Exports

# @tevm/ethers

## Table of contents

### Type Aliases

- [TypesafeEthersContractConstructor](undefined)
- [TypesafeEthersInterfaceConstructor](undefined)

### Variables

- [Contract](undefined)
- [Interface](undefined)

## Type Aliases

### TypesafeEthersContractConstructor

Ƭ **TypesafeEthersContractConstructor**: Function

#### Type declaration

• **new TypesafeEthersContractConstructor**\<`TAbi`\>(`target`, `abi`, `runner?`, `_deployTx?`): BaseContract & \{ [TFunctionName in string]: BaseContractMethod\<\{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0]\> } & \{ [TFunctionName in string]: BaseContractMethod\<\{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], ContractTransactionResponse\> } & Object & Contract

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi |

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | string \| Addressable |
| `abi` | TAbi \| Object |
| `runner?` | null \| ContractRunner |
| `_deployTx?` | null \| TransactionResponse |

##### Returns

BaseContract & \{ [TFunctionName in string]: BaseContractMethod\<\{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0]\> } & \{ [TFunctionName in string]: BaseContractMethod\<\{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["inputs"][K], AbiParameterKind\> }[K] } & any[], \{ [K in string \| number \| symbol]: \{ [K in string \| number \| symbol]: AbiParameterToPrimitiveType\<Extract\<Extract\<TAbi[number], Object\>, Object\>["outputs"][K], AbiParameterKind\> }[K] }[0], ContractTransactionResponse\> } & Object & Contract

#### Defined in

[extensions/ethers/src/Contract.d.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/Contract.d.ts#L21)

___

### TypesafeEthersInterfaceConstructor

Ƭ **TypesafeEthersInterfaceConstructor**: Function

#### Type declaration

• **new TypesafeEthersInterfaceConstructor**\<`TAbi`\>(`abi`): Omit\<Interface, "fragments"\> & Object

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends Abi |

##### Parameters

| Name | Type |
| :------ | :------ |
| `abi` | InterfaceAbi |

##### Returns

Omit\<Interface, "fragments"\> & Object

#### Defined in

[extensions/ethers/src/Contract.d.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/Contract.d.ts#L12)

## Variables

### Contract

• `Const` **Contract**: TypesafeEthersContractConstructor

#### Defined in

[extensions/ethers/src/Contract.d.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/Contract.d.ts#L30)

___

### Interface

• `Const` **Interface**: TypesafeEthersInterfaceConstructor

#### Defined in

[extensions/ethers/src/Contract.d.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/Contract.d.ts#L19)
