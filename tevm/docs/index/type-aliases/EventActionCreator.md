**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > EventActionCreator

# Type alias: EventActionCreator`<THumanReadableAbi, TBytecode, TDeployedBytecode, TAddress, TAddressArgs>`

> **EventActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: `{ [TEventName in ExtractAbiEventNames<ParseAbi<THumanReadableAbi>>]: Function & Object & TAddressArgs }`

A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way

## Example

```typescript
tevm.eth.getLog(
  MyScript.withAddress('0x420...').events.Transfer({ from: '0x1234...' }),
)
===

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `THumanReadableAbi` extends readonly `string`[] | - |
| `TBytecode` extends [`Hex`](Hex.md) \| `undefined` | - |
| `TDeployedBytecode` extends [`Hex`](Hex.md) \| `undefined` | - |
| `TAddress` extends [`Address`](Address.md) \| `undefined` | - |
| `TAddressArgs` | `TAddress` extends `undefined` ? `object` : `object` |

## Source

packages/contract/types/event/EventActionCreator.d.ts:17

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
