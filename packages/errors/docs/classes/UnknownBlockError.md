[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / UnknownBlockError

# Class: UnknownBlockError

Represents an error that occurs when the specified block could not be found.

This error is typically encountered when a block hash or number is provided that does not correspond
to any block known to the node. This can happen if the block hasn't been mined yet, if it's on a
different chain, or if the node is not fully synced.

The error code -32001 is a non-standard extension used by some Ethereum clients to
indicate this specific condition.

## Example

```ts
try {
  const block = await client.getBlock({
    blockHash: '0x1234567890123456789012345678901234567890123456789012345678901234'
  })
} catch (error) {
  if (error instanceof UnknownBlockError) {
    console.error('Unknown block:', error.message);
    console.log('The specified block does not exist or is not available to this node');
  }
}
```

## Param

A human-readable error message.

## Param

Additional parameters for the BaseError.

## Extends

- [`BaseError`](BaseError.md)

## Constructors

### Constructor

> **new UnknownBlockError**(`message`, `args?`, `tag?`): `UnknownBlockError`

Constructs an UnknownBlockError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`UnknownBlockErrorParameters`](../interfaces/UnknownBlockErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'UnknownBlock'`

The tag for the error.

#### Returns

`UnknownBlockError`

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

Same as name, used internally.

#### Inherited from

[`BaseError`](BaseError.md).[`_tag`](BaseError.md#_tag)

***

### cause

> **cause**: `any`

#### Inherited from

[`BaseError`](BaseError.md).[`cause`](BaseError.md#cause)

***

### code

> **code**: `number`

#### Inherited from

[`BaseError`](BaseError.md).[`code`](BaseError.md#code)

***

### details

> **details**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`details`](BaseError.md#details)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Path to the documentation for this error.

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Additional meta messages for more context.

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

***

### shortMessage

> **shortMessage**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`shortMessage`](BaseError.md#shortmessage)

***

### version

> **version**: `string`

#### Inherited from

[`BaseError`](BaseError.md).[`version`](BaseError.md#version)

***

### code

> `static` **code**: `number` = `-32001`

Error code (-32001), a non-standard extension for this specific error.

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Walks through the error chain.

#### Parameters

##### fn?

`Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Inherited from

[`BaseError`](BaseError.md).[`walk`](BaseError.md#walk)
