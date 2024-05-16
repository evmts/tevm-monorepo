[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / encodeAbiParameters

# Function: encodeAbiParameters()

> **encodeAbiParameters**\<`TParams`\>(`params`, `values`): `EncodeAbiParametersReturnType`

## Type parameters

• **TParams** *extends* readonly `unknown`[] \| readonly `AbiParameter`[]

## Parameters

• **params**: `TParams`

a set of ABI Parameters (params), that can be in the shape of the inputs or outputs attribute of an ABI Item.

• **values**: `TParams` *extends* readonly `AbiParameter`[] ? \{ \[K in string \| number \| symbol\]: \{ \[K in string \| number \| symbol\]: AbiParameterToPrimitiveType\<TParams\<TParams\>\[K\<K\>\], AbiParameterKind\> \}\[K\] \} : `never`

a set of values (values) that correspond to the given params.

## Returns

`EncodeAbiParametersReturnType`

## Description

Encodes a list of primitive values into an ABI-encoded hex value.

- Docs: https://viem.sh/docs/abi/encodeAbiParameters#encodeabiparameters

  Generates ABI encoded data using the [ABI specification](https://docs.soliditylang.org/en/latest/abi-spec), given a set of ABI parameters (inputs/outputs) and their corresponding values.

## Examples

```typescript
import { encodeAbiParameters } from 'viem'

const encodedData = encodeAbiParameters(
  [
    { name: 'x', type: 'string' },
    { name: 'y', type: 'uint' },
    { name: 'z', type: 'bool' }
  ],
  ['wagmi', 420n, true]
)
```

You can also pass in Human Readable parameters with the parseAbiParameters utility.

```typescript
import { encodeAbiParameters, parseAbiParameters } from 'viem'

const encodedData = encodeAbiParameters(
  parseAbiParameters('string x, uint y, bool z'),
  ['wagmi', 420n, true]
)
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeAbiParameters.d.ts:49
