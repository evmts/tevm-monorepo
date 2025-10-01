[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [precompiles](../README.md) / TypedError

# Type Alias: TypedError\<TName\>

> **TypedError**\<`TName`\> = `object`

Defined in: packages/precompiles/dist/index.d.ts:25

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

Defined in: packages/precompiles/dist/index.d.ts:26

***

### message

> **message**: `string`

Defined in: packages/precompiles/dist/index.d.ts:28

***

### name

> **name**: `TName`

Defined in: packages/precompiles/dist/index.d.ts:27
