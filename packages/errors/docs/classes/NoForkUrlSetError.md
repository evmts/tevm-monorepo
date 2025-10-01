[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / NoForkUrlSetError

# Class: NoForkUrlSetError

Error represents the tevm client attempted to fetch a resource from a Forked transport but no fork url was set in the transport.

## Example

```javascript
import { NoForkUrlSetError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'

const client = createMemoryClient() // No fork configuration

try {
  await client.getBalance('0x...') // This might throw if it needs to access forked state
} catch (error) {
  if (error instanceof NoForkUrlSetError) {
    console.error('No fork url set:', error.message)
    console.log('Documentation:', error.docsLink)
    // Handle the error, e.g., by setting up a fork configuration
  }
}
```

## Extends

- [`BaseError`](BaseError.md)

## Constructors

### Constructor

> **new NoForkUrlSetError**(`message`, `args?`): `NoForkUrlSetError`

Constructs a NoForkUrlSetError.

#### Parameters

##### message

`string`

Human-readable error message.

##### args?

[`NoForkUrlSetErrorParameters`](../interfaces/NoForkUrlSetErrorParameters.md) = `{}`

Additional parameters for the error.

#### Returns

`NoForkUrlSetError`

#### Overrides

[`BaseError`](BaseError.md).[`constructor`](BaseError.md#constructor)

## Properties

### \_tag

> **\_tag**: `string`

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

#### Inherited from

[`BaseError`](BaseError.md).[`docsPath`](BaseError.md#docspath)

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

#### Inherited from

[`BaseError`](BaseError.md).[`metaMessages`](BaseError.md#metamessages)

***

### name

> **name**: `string`

#### Inherited from

`BaseError.name`

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
