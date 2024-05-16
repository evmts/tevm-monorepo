[**@tevm/solc**](../README.md) • **Docs**

***

[@tevm/solc](../globals.md) / SolcErrorEntry

# Type alias: SolcErrorEntry

> **SolcErrorEntry**: `object`

## Type declaration

### component

> **component**: `string`

### errorCode?

> `optional` **errorCode**: `string`

### formattedMessage?

> `optional` **formattedMessage**: `string`

### message

> **message**: `string`

### secondarySourceLocations?

> `optional` **secondarySourceLocations**: [`SolcSecondarySourceLocation`](SolcSecondarySourceLocation.md)[]

### severity

> **severity**: `"error"` \| `"warning"` \| `"info"`

### sourceLocation?

> `optional` **sourceLocation**: [`SolcSourceLocation`](SolcSourceLocation.md)

### type

> **type**: `string`

## Source

[solcTypes.ts:351](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L351)
