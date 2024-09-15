[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / EventActionCreator

# Type Alias: EventActionCreator\<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress, TAddressArgs\>

> **EventActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: `{ [TEventName in ExtractAbiEventNames<ParseAbi<THumanReadableAbi>>]: Function & Object & TAddressArgs }`

A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way

## Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

## Type Parameters

• **THumanReadableAbi** *extends* readonly `string`[]

• **TBytecode** *extends* `Hex` \| `undefined`

• **TDeployedBytecode** *extends* `Hex` \| `undefined`

• **TAddress** *extends* `Address` \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Defined in

[event/EventActionCreator.ts:41](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/contract/src/event/EventActionCreator.ts#L41)
