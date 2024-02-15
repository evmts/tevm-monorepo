---
editUrl: false
next: false
prev: false
title: "WriteActionCreator"
---

> **WriteActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: `{ [TFunctionName in ExtractAbiFunctionNames<ParseAbi<THumanReadableAbi>, "payable" | "nonpayable">]: Function & Object & TAddressArgs }`

A mapping of payable and nonpayable contract methods to action creators

## Example

```typescript
tevm.contract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `THumanReadableAbi` extends readonly `string`[] | - |
| `TBytecode` extends `Hex` \| `undefined` | - |
| `TDeployedBytecode` extends `Hex` \| `undefined` | - |
| `TAddress` extends `Address` \| `undefined` | - |
| `TAddressArgs` | `TAddress` extends `undefined` ? `object` : `object` |

## Source

[write/WriteActionCreator.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/write/WriteActionCreator.ts#L23)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
