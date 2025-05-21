[**@tevm/ethers**](../README.md)

***

[@tevm/ethers](../globals.md) / TypesafeEthersContractConstructor

# Type Alias: TypesafeEthersContractConstructor()

> **TypesafeEthersContractConstructor** = \<`TAbi`\>(`target`, `abi`, `runner?`, `_deployTx?`) => `BaseContract` & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\<(...)\>\], AbiParameterKind\> \}\[key\] \} & any\[\], \{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\<(...)\>\], AbiParameterKind\> \}\[key\] \}\[0\], \{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\<(...)\>\], AbiParameterKind\> \}\[key\] \}\[0\]\> \} & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\<(...)\>\], AbiParameterKind\> \}\[key\] \} & any\[\], \{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\<(...)\>\], AbiParameterKind\> \}\[key\] \}\[0\], ContractTransactionResponse\> \} & `object` & `Contract`

Defined in: [extensions/ethers/src/contract/Contract.d.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/Contract.d.ts#L18)

## Parameters

### target

`string` | `Addressable`

### abi

`TAbi` | \{ `fragments`: `TAbi`; \}

### runner?

`null` | `ContractRunner`

### \_deployTx?

`null` | `TransactionResponse`

## Returns

`BaseContract` & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\<(...)\>\], AbiParameterKind\> \}\[key\] \} & any\[\], \{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\<(...)\>\], AbiParameterKind\> \}\[key\] \}\[0\], \{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\<(...)\>\], AbiParameterKind\> \}\[key\] \}\[0\]\> \} & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\<(...)\>\], AbiParameterKind\> \}\[key\] \} & any\[\], \{ \[key in string \| number \| symbol\]: \{ \[key in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[key\<(...)\>\], AbiParameterKind\> \}\[key\] \}\[0\], ContractTransactionResponse\> \} & `object` & `Contract`
