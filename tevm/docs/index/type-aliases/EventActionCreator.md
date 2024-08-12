[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / EventActionCreator

# Type Alias: EventActionCreator\<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress, TAddressArgs\>

> **EventActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: `{ [TEventName in ExtractAbiEventNames<ParseAbi<THumanReadableAbi>>]: Function & Object & TAddressArgs }`

A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way

## Type Parameters

• **THumanReadableAbi** *extends* readonly `string`[]

• **TBytecode** *extends* [`Hex`](Hex.md) \| `undefined`

• **TDeployedBytecode** *extends* [`Hex`](Hex.md) \| `undefined`

• **TAddress** *extends* [`Address`](Address.md) \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

## Defined in

packages/contract/types/event/EventActionCreator.d.ts:16
