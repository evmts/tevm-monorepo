---
editUrl: false
next: false
prev: false
title: "ReadActionCreator"
---

> **ReadActionCreator**\<`THumanReadableAbi`, `TAddress`, `TCode`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "pure" \| "view"\>\]: Function & Object & (TCode extends undefined ? Object : Object) & TAddressArgs \}

A mapping of view and pure contract methods to action creators

## Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Type parameters

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined`

• **TCode** *extends* [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Source

[read/ReadActionCreator.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/read/ReadActionCreator.ts#L23)
