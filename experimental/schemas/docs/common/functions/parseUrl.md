[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [common](../README.md) / parseUrl

# Function: parseUrl()

> **parseUrl**\<`TUrl`\>(`url`): `TUrl`

Parses a Url and returns the value if no errors.

## Type Parameters

• **TUrl** *extends* `string`

## Parameters

• **url**: `TUrl`

## Returns

`TUrl`

## Example

```javascript
import { parseUrl } from '@tevm/schemas';
const parsedUrl = parseUrl('https://tevm.sh');
```

## Defined in

[experimental/schemas/src/common/SUrl.js:109](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SUrl.js#L109)
