[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / ReadActionCreator

# Type Alias: ReadActionCreator\<THumanReadableAbi, TAddress, TCode, TAddressArgs\>

> **ReadActionCreator**\<`THumanReadableAbi`, `TAddress`, `TCode`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "pure" \| "view"\>\]: Function & Object & (TCode extends undefined ? Object : Object) & TAddressArgs \}

A mapping of view and pure contract methods to action creators

## Type Parameters

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* `Address` \| `undefined`

• **TCode** *extends* `Hex` \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Defined in

[read/ReadActionCreator.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/read/ReadActionCreator.ts#L23)
