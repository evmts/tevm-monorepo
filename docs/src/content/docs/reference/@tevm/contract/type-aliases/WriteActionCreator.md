---
editUrl: false
next: false
prev: false
title: "WriteActionCreator"
---

> **WriteActionCreator**\<`THumanReadableAbi`, `TAddress`, `TCode`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "payable" \| "nonpayable"\>\]: Function & Object & (TCode extends undefined ? Object : Object) & TAddressArgs \}

A mapping of payable and nonpayable contract methods to action creators

## Example

```typescript
tevm.contract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Type Parameters

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined`

• **TCode** *extends* [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Defined in

[write/WriteActionCreator.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/write/WriteActionCreator.ts#L23)
