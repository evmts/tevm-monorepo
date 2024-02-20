---
editUrl: false
next: false
prev: false
title: "EventActionCreator"
---

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
| `TBytecode` extends [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `undefined` | - |
| `TDeployedBytecode` extends [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `undefined` | - |
| `TAddress` extends [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined` | - |
| `TAddressArgs` | `TAddress` extends `undefined` ? `object` : `object` |

## Source

[event/EventActionCreator.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/event/EventActionCreator.ts#L38)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
