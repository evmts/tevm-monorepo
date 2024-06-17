[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / EventActionCreator

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

• **TAddress** *extends* `Address` \| `undefined`

• **TBytecode** *extends* `Hex` \| `undefined`

• **TDeployedBytecode** *extends* `Hex` \| `undefined`

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

## Source

[event/EventActionCreator.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/event/EventActionCreator.ts#L38)
