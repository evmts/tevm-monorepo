**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [common](../README.md) / isUrl

# Function: isUrl()

> **isUrl**(`value`): `boolean`

Type guard that returns true if the provided string is a valid URL.

## Parameters

• **value**: `string`

## Returns

`boolean`

## Example

```javascript
import { isUrl } from '@tevm/schemas';
isUrl('https://tevm.sh');  // true
isUrl('not a url'); // false
````

## Source

[experimental/schemas/src/common/SUrl.js:33](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SUrl.js#L33)
