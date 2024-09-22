---
editUrl: false
next: false
prev: false
title: "EventActionCreator"
---

> **EventActionCreator**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: `{ [TEventName in ExtractAbiEventNames<ParseAbi<THumanReadableAbi>>]: Function & Object & TAddressArgs }`

A mapping of event names to action creators for events. Can be used to create event filters in a typesafe way.

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

## Type Parameters

• **THumanReadableAbi** *extends* readonly `string`[]

The human-readable ABI of the contract.

• **TBytecode** *extends* [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `undefined`

The bytecode of the contract.

• **TDeployedBytecode** *extends* [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `undefined`

The deployed bytecode of the contract.

• **TAddress** *extends* [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined`

The address of the contract.

• **TAddressArgs** = `TAddress` *extends* `undefined` ? `object` : `object`

Additional arguments for the address.

## Defined in

[event/EventActionCreator.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/event/EventActionCreator.ts#L59)
