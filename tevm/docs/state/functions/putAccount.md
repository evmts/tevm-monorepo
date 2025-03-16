[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / putAccount

# Function: putAccount()

> **putAccount**(`baseState`, `skipFetchingFromFork`?): (`address`, `account`?) => `Promise`\<`void`\>

Defined in: packages/state/dist/index.d.ts:475

Saves an account into state under the provided `address`.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

`Function`

### Parameters

#### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### account?

[`EthjsAccount`](../../utils/classes/EthjsAccount.md)

### Returns

`Promise`\<`void`\>
