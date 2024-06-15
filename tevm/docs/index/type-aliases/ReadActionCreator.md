[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ReadActionCreator

# Type alias: ReadActionCreator\<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress, TAddressArgs\>

> **ReadActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "pure" \| "view"\>\]: Function & Object & TAddressArgs \}

A mapping of view and pure contract methods to action creators

## Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Type parameters

• **THumanReadableAbi** *extends* readonly `string`[]

• **TBytecode** *extends* [`Hex`](Hex.md) \| `undefined`

• **TDeployedBytecode** *extends* [`Hex`](Hex.md) \| `undefined`

• **TAddress** *extends* [`Address`](Address.md) \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Source

packages/contract/types/read/ReadActionCreator.d.ts:12
