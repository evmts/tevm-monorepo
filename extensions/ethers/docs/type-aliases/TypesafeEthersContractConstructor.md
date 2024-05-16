[**@tevm/ethers**](../README.md) • **Docs**

***

[@tevm/ethers](../globals.md) / TypesafeEthersContractConstructor

# Type alias: TypesafeEthersContractConstructor()

> **TypesafeEthersContractConstructor**: \<`TAbi`\>(`target`, `abi`, `runner`?, `_deployTx`?) => `BaseContract` & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[K\<(...)\>\], AbiParameterKind\> \}\[K\] \} & any\[\], \{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[K\<(...)\>\], AbiParameterKind\> \}\[K\] \}\[0\], \{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[K\<(...)\>\], AbiParameterKind\> \}\[K\] \}\[0\]\> \} & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[K\<(...)\>\], AbiParameterKind\> \}\[K\] \} & any\[\], \{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[K\<(...)\>\], AbiParameterKind\> \}\[K\] \}\[0\], ContractTransactionResponse\> \} & `object` & `Contract`

## Parameters

• **target**: `string` \| `Addressable`

• **abi**: `TAbi` \| `object`

• **runner?**: `null` \| `ContractRunner`

• **\_deployTx?**: `null` \| `TransactionResponse`

## Returns

`BaseContract` & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[K\<(...)\>\], AbiParameterKind\> \}\[K\] \} & any\[\], \{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[K\<(...)\>\], AbiParameterKind\> \}\[K\] \}\[0\], \{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[K\<(...)\>\], AbiParameterKind\> \}\[K\] \}\[0\]\> \} & \{ \[TFunctionName in string\]: BaseContractMethod\<\{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[K\<(...)\>\], AbiParameterKind\> \}\[K\] \} & any\[\], \{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<(...)\[(...)\]\[K\<(...)\>\], AbiParameterKind\> \}\[K\] \}\[0\], ContractTransactionResponse\> \} & `object` & `Contract`

## Source

[extensions/ethers/src/contract/Contract.d.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/Contract.d.ts#L18)
