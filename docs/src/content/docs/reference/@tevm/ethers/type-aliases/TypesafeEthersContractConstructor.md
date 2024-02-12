---
editUrl: false
next: false
prev: false
title: "TypesafeEthersContractConstructor"
---

> **TypesafeEthersContractConstructor**: \<`TAbi`\>(`target`, `abi`, `runner`?, `_deployTx`?) => `BaseContract` & `{ [TFunctionName in string]: BaseContractMethod<{ [K in string | number | symbol]: { [K in string | number | symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object>, Object>["inputs"][K], AbiParameterKind> }[K] } & any[], { [K in string | number | symbol]: { [K in string | number | symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object>, Object>["outputs"][K], AbiParameterKind> }[K] }[0], { [K in string | number | symbol]: { [K in string | number | symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object>, Object>["outputs"][K], AbiParameterKind> }[K] }[0]> }` & `{ [TFunctionName in string]: BaseContractMethod<{ [K in string | number | symbol]: { [K in string | number | symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object>, Object>["inputs"][K], AbiParameterKind> }[K] } & any[], { [K in string | number | symbol]: { [K in string | number | symbol]: AbiParameterToPrimitiveType<Extract<Extract<TAbi[number], Object>, Object>["outputs"][K], AbiParameterKind> }[K] }[0], ContractTransactionResponse> }` & `object` & `Contract`

## Parameters

▪ **target**: `string` \| `Addressable`

▪ **abi**: `TAbi` \| `object`

▪ **runner?**: `null` \| `ContractRunner`

▪ **\_deployTx?**: `null` \| `TransactionResponse`

## Source

[extensions/ethers/src/contract/Contract.d.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/contract/Contract.d.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
