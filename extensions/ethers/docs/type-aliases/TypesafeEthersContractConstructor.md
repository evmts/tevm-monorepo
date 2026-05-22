[**@tevm/ethers**](../README.md)

***

[@tevm/ethers](../globals.md) / TypesafeEthersContractConstructor

# Type Alias: TypesafeEthersContractConstructor

> **TypesafeEthersContractConstructor** = \{\<`TAbi`\>(`target`, `abi`, `runner?`, `_deployTx?`): `BaseContract` & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\], AbiParameterKind\> \}\[key\] \} & any\[\], EthersFunctionOutput\<TAbi, TFunctionName\>, EthersFunctionOutput\<TAbi, TFunctionName\>\> \} & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\], AbiParameterKind\> \}\[key\] \} & any\[\], EthersFunctionOutput\<TAbi, TFunctionName\>, ContractTransactionResponse\> \} & `object` & `Contract`; (`target`, `abi`, `runner?`, `_deployTx?`): `Contract`; \}

Defined in: [extensions/ethers/src/contract/Contract.d.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/Contract.d.ts#L18)

## Call Signature

> **new TypesafeEthersContractConstructor**\<`TAbi`\>(`target`, `abi`, `runner?`, `_deployTx?`): `BaseContract` & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\], AbiParameterKind\> \}\[key\] \} & any\[\], EthersFunctionOutput\<TAbi, TFunctionName\>, EthersFunctionOutput\<TAbi, TFunctionName\>\> \} & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\], AbiParameterKind\> \}\[key\] \} & any\[\], EthersFunctionOutput\<TAbi, TFunctionName\>, ContractTransactionResponse\> \} & `object` & `Contract`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `string` \| `Addressable` |
| `abi` | `TAbi` \| \{ `fragments`: `TAbi`; \} |
| `runner?` | `ContractRunner` \| `null` |
| `_deployTx?` | `TransactionResponse` \| `null` |

### Returns

`BaseContract` & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\], AbiParameterKind\> \}\[key\] \} & any\[\], EthersFunctionOutput\<TAbi, TFunctionName\>, EthersFunctionOutput\<TAbi, TFunctionName\>\> \} & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\], AbiParameterKind\> \}\[key\] \} & any\[\], EthersFunctionOutput\<TAbi, TFunctionName\>, ContractTransactionResponse\> \} & `object` & `Contract`

## Call Signature

> **new TypesafeEthersContractConstructor**(`target`, `abi`, `runner?`, `_deployTx?`): `Contract`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `string` \| `Addressable` |
| `abi` | `InterfaceAbi` \| `Interface` |
| `runner?` | `ContractRunner` \| `null` |
| `_deployTx?` | `TransactionResponse` \| `null` |

### Returns

`Contract`
