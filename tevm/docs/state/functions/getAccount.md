[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / getAccount

# Function: getAccount()

> **getAccount**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

Gets the code corresponding to the provided `address`.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

## Defined in

packages/state/dist/index.d.ts:256
