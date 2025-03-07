[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / WriteActionCreator

# Type Alias: WriteActionCreator\<THumanReadableAbi, TAddress, TCode, TAddressArgs\>

> **WriteActionCreator**\<`THumanReadableAbi`, `TAddress`, `TCode`, `TAddressArgs`\>: \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "payable" \| "nonpayable"\>\]: (args: TArgs) =\> \{ abi: \[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]; address: TAddress; functionName: TFunctionName; humanReadableAbi: FormatAbi\<\[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]\>; to: TAddress \} & (TCode extends undefined ? \{\} : \{ code: TCode \}) & (TArgs\["length"\] extends 0 ? \{\} : \{ args: TArgs \}) & TAddressArgs & \{ abi: \[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]; functionName: TFunctionName; humanReadableAbi: FormatAbi\<\[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]\> \} & (TCode extends undefined ? \{\} : \{ code: TCode \}) & TAddressArgs \}

Defined in: packages/contract/types/write/WriteActionCreator.d.ts:26

A mapping of payable and nonpayable contract methods to action creators.
This type provides a way to create type-safe write actions for contract methods.

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
// Assuming we have a contract with a 'transfer' method
const transferAction = MyContract.write.transfer('0x1234...', 1000n)

// Use the action with tevm
const result = await tevm.contract(transferAction)
console.log('Transaction hash:', result.transactionHash)
```
