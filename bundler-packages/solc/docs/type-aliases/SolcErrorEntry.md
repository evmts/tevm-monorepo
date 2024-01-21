**@tevm/solc** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > SolcErrorEntry

# Type alias: SolcErrorEntry

> **SolcErrorEntry**: `object`

## Type declaration

### component

> **component**: `string`

### errorCode

> **errorCode**?: `string`

### formattedMessage

> **formattedMessage**?: `string`

### message

> **message**: `string`

### secondarySourceLocations

> **secondarySourceLocations**?: [`SolcSecondarySourceLocation`](SolcSecondarySourceLocation.md)[]

### severity

> **severity**: `"error"` \| `"warning"` \| `"info"`

### sourceLocation

> **sourceLocation**?: [`SolcSourceLocation`](SolcSourceLocation.md)

### type

> **type**: `string`

## Source

[solcTypes.ts:359](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L359)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
