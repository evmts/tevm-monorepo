---
editUrl: false
next: false
prev: false
title: "encodeAbiParameters"
---

> **encodeAbiParameters**\<`TParams`\>(`params`, `values`): `EncodeAbiParametersReturnType`

## Type parameters

▪ **TParams** extends readonly `unknown`[] \| readonly `AbiParameter`[]

## Parameters

▪ **params**: `TParams`

▪ **values**: `TParams` extends readonly `AbiParameter`[] ? `{ [K in string | number | symbol]: { [K in string | number | symbol]: AbiParameterToPrimitiveType<TParams[K], AbiParameterKind> }[K] }` : `never`

## Returns

## Description

Encodes a list of primitive values into an ABI-encoded hex value.

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeAbiParameters.d.ts:17

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
