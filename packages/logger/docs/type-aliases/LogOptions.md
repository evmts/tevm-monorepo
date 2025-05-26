[**@tevm/logger**](../README.md)

***

[@tevm/logger](../globals.md) / LogOptions

# Type Alias: LogOptions

> **LogOptions** = `object`

Defined in: [LogOptions.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/logger/src/LogOptions.ts#L32)

Options for logger

## Properties

### level

> **level**: `Level`

Defined in: [LogOptions.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/logger/src/LogOptions.ts#L41)

The minimum level to log.
Typically, debug and trace logs are only valid for development, and not needed in production.

***

### name

> **name**: `string`

Defined in: [LogOptions.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/logger/src/LogOptions.ts#L36)

The name of the logger. Adds a name field to every JSON line logged.
