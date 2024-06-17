[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / WriteActionCreator

# Type alias: WriteActionCreator\<THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, TCode, TAddressArgs\>

> **WriteActionCreator**\<`THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "payable" \| "nonpayable"\>\]: Function & Object & (TBytecode extends undefined ? Object : Object) & (TDeployedBytecode extends undefined ? Object : Object) & (TCode extends undefined ? Object : Object) & TAddressArgs \}

A mapping of payable and nonpayable contract methods to action creators

## Example

```typescript
tevm.contract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
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

packages/contract/types/write/WriteActionCreator.d.ts:12
