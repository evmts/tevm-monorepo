[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [precompiles](../README.md) / TypedError

# Type Alias: TypedError\<TName\>

> **TypedError**\<`TName`\> = `object`

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

| Property | Type |
| ------ | ------ |
| <a id="_tag"></a> `_tag` | `TName` |
| <a id="message"></a> `message` | `string` |
| <a id="name"></a> `name` | `TName` |
