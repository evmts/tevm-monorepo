[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / ParseError

# Class: ParseError

Represents an error that occurs when invalid JSON is received by the server, resulting in a parsing error.

This error is typically encountered when a JSON-RPC request is malformed or the JSON syntax is incorrect.
It's a standard JSON-RPC error with code -32700, indicating issues at the protocol level rather than
the application level.

## Example

```ts
try {
  await client.request({
    method: 'eth_getBalance',
    params: ['0x1234567890123456789012345678901234567890', 'latest'],
    // Imagine this request is somehow malformed JSON
  })
} catch (error) {
  if (error instanceof ParseError) {
    console.error('JSON-RPC parse error:', error.message);
    console.log('Check the request format and try again');
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

> **new ParseError**(`message`, `args?`, `tag?`): `ParseError`

Constructs a ParseError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`ParseErrorParameters`](../interfaces/ParseErrorParameters.md) = `{}`

Additional parameters for the BaseError.

##### tag?

`string` = `'ParseError'`

The tag for the error.

#### Returns

`ParseError`

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

> `static` **code**: `number` = `-32700`

Error code (-32700), standard JSON-RPC error code for parse errors.

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
