[**@tevm/contract**](../README.md)

***

[@tevm/contract](../globals.md) / WriteActionCreator

# Type Alias: WriteActionCreator\<THumanReadableAbi, TAddress, TCode, TAddressArgs\>

> **WriteActionCreator**\<`THumanReadableAbi`, `TAddress`, `TCode`, `TAddressArgs`\> = \{ \[TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "payable" \| "nonpayable"\>\]: (args: TArgs) =\> \{ abi: \[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]; address: TAddress; functionName: TFunctionName; humanReadableAbi: FormatAbi\<\[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]\>; to: TAddress \} & (TCode extends undefined ? \{\} : \{ code: TCode \}) & (TArgs\["length"\] extends 0 ? \{\} : \{ args: TArgs \}) & TAddressArgs & \{ abi: \[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]; functionName: TFunctionName; humanReadableAbi: FormatAbi\<\[ExtractAbiFunction\<ParseAbi\<THumanReadableAbi\>, TFunctionName\>\]\> \} & (TCode extends undefined ? \{\} : \{ code: TCode \}) & TAddressArgs \}

Defined in: [write/WriteActionCreator.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/write/WriteActionCreator.ts#L36)

A mapping of payable and nonpayable contract methods to action creators.
This type provides a way to create type-safe write actions for contract methods.

## Type Parameters

### THumanReadableAbi

`THumanReadableAbi` *extends* readonly `string`[]

The human-readable ABI of the contract.

### TAddress

`TAddress` *extends* `Address` \| `undefined`

The address of the contract (optional).

### TCode

`TCode` *extends* `Hex` \| `undefined`

The runtime bytecode of the contract (optional).

### TAddressArgs

`TAddressArgs` = `TAddress` *extends* `undefined` ? `object` : `object`

Additional arguments for the address (derived from TAddress).

## Example

```typescript
// Assuming we have a contract with a 'transfer' method
const transferAction = MyContract.write.transfer('0x1234...', 1000n)

// Use the action with tevm
const result = await tevm.contract(transferAction)
console.log('Transaction hash:', result.transactionHash)
```
