**@tevm/contract** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/contract](../README.md) / WriteActionCreator

# Type alias: WriteActionCreator\<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress, TAddressArgs\>

> **WriteActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: `{ [TFunctionName in ExtractAbiFunctionNames<ParseAbi<THumanReadableAbi>, "payable" | "nonpayable">]: Function & Object & TAddressArgs }`

A mapping of payable and nonpayable contract methods to action creators

## Example

```typescript
tevm.contract(
  MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
)
```

## Type parameters

• **THumanReadableAbi** extends readonly `string`[]

• **TBytecode** extends `Hex` \| `undefined`

• **TDeployedBytecode** extends `Hex` \| `undefined`

• **TAddress** extends `Address` \| `undefined`

• **TAddressArgs** = `TAddress` extends `undefined` ? `object` : `object`

## Source

[write/WriteActionCreator.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/write/WriteActionCreator.ts#L23)
