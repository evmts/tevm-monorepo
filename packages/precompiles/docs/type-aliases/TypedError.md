[**@tevm/precompiles**](../README.md)

***

[@tevm/precompiles](../globals.md) / TypedError

# Type Alias: TypedError\<TName\>

> **TypedError**\<`TName`\>: `object`

Defined in: [TypedError.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/TypedError.ts#L17)

Represents a typed error with a tag for identification

## Type Parameters

• **TName** *extends* `string`

The string literal type that identifies this error

## Type declaration

### \_tag

> **\_tag**: `TName`

### message

> **message**: `string`

### name

> **name**: `TName`

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
