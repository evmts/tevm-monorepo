[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / WriteActionCreator

# Type Alias: WriteActionCreator\<THumanReadableAbi, TAddress, TCode, TAddressArgs\>

> **WriteActionCreator**\<`THumanReadableAbi`, `TAddress`, `TCode`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "payable" \| "nonpayable"\>\]: Function & Object & (TCode extends undefined ? Object : Object) & TAddressArgs \}

A mapping of payable and nonpayable contract methods to action creators

## Type Parameters

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* [`Address`](Address.md) \| `undefined`

• **TCode** *extends* [`Hex`](Hex.md) \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Example

```typescript
tevm.contract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Defined in

packages/contract/types/write/WriteActionCreator.d.ts:12
