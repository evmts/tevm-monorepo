[**@tevm/precompiles**](../README.md)

***

[@tevm/precompiles](../globals.md) / TypedError

# Type Alias: TypedError\<TName\>

> **TypedError**\<`TName`\> = `object`

Defined in: [precompiles/src/TypedError.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/TypedError.ts#L17)

Represents a typed error with a tag for identification

## Example

```typescript
import { TypedError } from '@tevm/precompiles'

type MyCustomError = TypedError<'MyCustomError'>

const error: MyCustomError = {
  _tag: 'MyCustomError',
  name: 'MyCustomError',
  message: 'Something went wrong'
}
```

## Type Parameters

### TName

`TName` *extends* `string`

The string literal type that identifies this error

## Properties

### \_tag

> **\_tag**: `TName`

Defined in: [precompiles/src/TypedError.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/TypedError.ts#L18)

***

### message

> **message**: `string`

Defined in: [precompiles/src/TypedError.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/TypedError.ts#L20)

***

### name

> **name**: `TName`

Defined in: [precompiles/src/TypedError.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/TypedError.ts#L19)
