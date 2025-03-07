[**@tevm/logger**](../README.md)

***

[@tevm/logger](../globals.md) / LogOptions

# Type Alias: LogOptions

> **LogOptions**: `object`

Defined in: [LogOptions.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/logger/src/LogOptions.ts#L8)

Options for logger

## Type declaration

### level

> **level**: `Level`

The minimum level to log.
Typically, debug and trace logs are only valid for development, and not needed in production.

### name

> **name**: `string`

The name of the logger. Adds a name field to every JSON line logged.
