[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / EventActionCreator

# Type alias: EventActionCreator\<THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, TAddressArgs\>

> **EventActionCreator**\<`THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TAddressArgs`\>: `{ [TEventName in ExtractAbiEventNames<ParseAbi<THumanReadableAbi>>]: Function & Object & TAddressArgs }`

A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way

## Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

## Type parameters

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* [`Address`](Address.md) \| `undefined`

• **TBytecode** *extends* [`Hex`](Hex.md) \| `undefined`

• **TDeployedBytecode** *extends* [`Hex`](Hex.md) \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Source

packages/contract/types/event/EventActionCreator.d.ts:16
