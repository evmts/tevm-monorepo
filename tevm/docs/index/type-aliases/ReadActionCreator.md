[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ReadActionCreator

# Type alias: ReadActionCreator\<THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, TCode, TAddressArgs\>

> **ReadActionCreator**\<`THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "pure" \| "view"\>\]: Function & Object & (TBytecode extends undefined ? Object : Object) & (TDeployedBytecode extends undefined ? Object : Object) & (TCode extends undefined ? Object : Object) & TAddressArgs \}

A mapping of view and pure contract methods to action creators

## Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Type parameters

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* [`Address`](Address.md) \| `undefined`

• **TBytecode** *extends* [`Hex`](Hex.md) \| `undefined`

• **TDeployedBytecode** *extends* [`Hex`](Hex.md) \| `undefined`

• **TCode** *extends* [`Hex`](Hex.md) \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Source

packages/contract/types/read/ReadActionCreator.d.ts:12
