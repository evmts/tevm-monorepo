[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / ReadActionCreator

# Type alias: ReadActionCreator\<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress, TCode, TAddressArgs\>

> **ReadActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TCode`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "pure" \| "view"\>\]: Function & Object & (TBytecode extends undefined ? Object : Object) & (TDeployedBytecode extends undefined ? Object : Object) & (TCode extends undefined ? Object : Object) & TAddressArgs \}

A mapping of view and pure contract methods to action creators

## Example

```typescript
tevm.contract(
  MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Type parameters

• **THumanReadableAbi** *extends* readonly `string`[]

• **TBytecode** *extends* `Hex` \| `undefined`

• **TDeployedBytecode** *extends* `Hex` \| `undefined`

• **TAddress** *extends* `Address` \| `undefined`

• **TCode** *extends* `Hex` \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Source

[read/ReadActionCreator.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/read/ReadActionCreator.ts#L23)
