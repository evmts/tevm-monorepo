[**@tevm/contract**](../README.md)

***

[@tevm/contract](../globals.md) / ReadActionCreator

# Type Alias: ReadActionCreator\<THumanReadableAbi, TAddress, TCode, TAddressArgs\>

> **ReadActionCreator**\<`THumanReadableAbi`, `TAddress`, `TCode`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "pure" \| "view"\>\]: (args: TArgs) =\> \{ abi: \[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]; functionName: TFunctionName; humanReadableAbi: FormatAbi\<\[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]\> \} & (TCode extends undefined ? \{\} : \{ code: TCode \}) & (TArgs\["length"\] extends 0 ? \{\} : \{ args: TArgs \}) & TAddressArgs & \{ abi: \[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]; functionName: TFunctionName; humanReadableAbi: FormatAbi\<\[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]\> \} & (TCode extends undefined ? \{\} : \{ code: TCode \}) & TAddressArgs \}

Defined in: [read/ReadActionCreator.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/read/ReadActionCreator.ts#L36)

A mapping of view and pure contract methods to action creators.
This type provides a way to create type-safe read actions for contract methods.

## Type Parameters

• **THumanReadableAbi** *extends* readonly `string`[]

The human-readable ABI of the contract.

• **TAddress** *extends* `Address` \| `undefined`

The address of the contract (optional).

• **TCode** *extends* `Hex` \| `undefined`

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
