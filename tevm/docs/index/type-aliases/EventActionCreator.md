[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EventActionCreator

# Type Alias: EventActionCreator\<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress, TAddressArgs\>

> **EventActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\> = \{ \[TEventName in ExtractAbiEventNames\<ParseAbi\<THumanReadableAbi\>\>\]: (params: Pick\<CreateEventFilterParameters\<ExtractAbiEvent\<ParseAbi\<THumanReadableAbi\>, TEventName\>, ParseAbi\<THumanReadableAbi\>, TStrict, TFromBlock, TToBlock, TEventName, MaybeExtractEventArgsFromAbi\<ParseAbi\<THumanReadableAbi\>, TEventName\>\>, "fromBlock" \| "toBlock" \| "args" \| "strict"\>) =\> CreateEventFilterParameters\<ExtractAbiEvent\<ParseAbi\<THumanReadableAbi\>, TEventName\>, ParseAbi\<THumanReadableAbi\>, TStrict, TFromBlock, TToBlock, TEventName, MaybeExtractEventArgsFromAbi\<ParseAbi\<THumanReadableAbi\>, TEventName\>\> & \{ abi: \[ExtractAbiEvent\<ParseAbi\<THumanReadableAbi\>, TEventName\>\]; bytecode: TBytecode; deployedBytecode: TDeployedBytecode; eventName: TEventName \} & \{ abi: \[ExtractAbiEvent\<ParseAbi\<THumanReadableAbi\>, TEventName\>\]; bytecode: TBytecode; deployedBytecode: TDeployedBytecode; eventName: TEventName; humanReadableAbi: FormatAbi\<\[ExtractAbiEvent\<ParseAbi\<THumanReadableAbi\>, TEventName\>\]\> \} & TAddressArgs \}

Defined in: packages/contract/types/event/EventActionCreator.d.ts:34

A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way.

## Type Parameters

### THumanReadableAbi

`THumanReadableAbi` *extends* readonly `string`[]

The human-readable ABI of the contract.

### TBytecode

`TBytecode` *extends* [`Hex`](Hex.md) \| `undefined`

The bytecode of the contract.

### TDeployedBytecode

`TDeployedBytecode` *extends* [`Hex`](Hex.md) \| `undefined`

The deployed bytecode of the contract.

### TAddress

`TAddress` *extends* [`Address`](Address.md) \| `undefined`

The address of the contract.

### TAddressArgs

`TAddressArgs` = `TAddress` *extends* `undefined` ? `object` : `object`

Additional arguments for the address.

## Example

```typescript
// Creating an event filter for a Transfer event
const filter = MyContract.events.Transfer({
  fromBlock: 'latest',
  toBlock: 'latest',
  args: { from: '0x1234...', to: '0x5678...' }
})

// Using the filter with tevm
const logs = await tevm.eth.getLogs(filter)
```
