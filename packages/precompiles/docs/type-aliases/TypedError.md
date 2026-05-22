[**@tevm/precompiles**](../README.md)

***

[@tevm/precompiles](../globals.md) / TypedError

# Type Alias: TypedError\<TName\>

> **TypedError**\<`TName`\> = `object`

Defined in: [TypedError.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/TypedError.ts#L17)

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

| Type Parameter | Description |
| ------ | ------ |
| `TName` *extends* `string` | The string literal type that identifies this error |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `TName` | [TypedError.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/TypedError.ts#L18) |
| <a id="message"></a> `message` | `string` | [TypedError.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/TypedError.ts#L20) |
| <a id="name"></a> `name` | `TName` | [TypedError.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/TypedError.ts#L19) |
