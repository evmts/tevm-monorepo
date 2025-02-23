[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ReadActionCreator

# Type Alias: ReadActionCreator\<THumanReadableAbi, TAddress, TCode, TAddressArgs\>

> **ReadActionCreator**\<`THumanReadableAbi`, `TAddress`, `TCode`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "pure" \| "view"\>\]: Function & Object & (TCode extends undefined ? Object : Object) & TAddressArgs \}

A mapping of view and pure contract methods to action creators.
This type provides a way to create type-safe read actions for contract methods.

## Type Parameters

• **THumanReadableAbi** *extends* readonly `string`[]

The human-readable ABI of the contract.

• **TAddress** *extends* [`Address`](Address.md) \| `undefined`

The address of the contract (optional).

• **TCode** *extends* [`Hex`](Hex.md) \| `undefined`

The runtime bytecode of the contract (optional).

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

Additional arguments for the address (derived from TAddress).

## Example

```typescript
// Assuming we have a contract with a 'balanceOf' method
const balanceAction = MyContract.read.balanceOf('0x1234...')

// Use the action with tevm
const balance = await tevm.contract(balanceAction)
console.log('Balance:', balance)
```

## Defined in

packages/contract/types/read/ReadActionCreator.d.ts:26
