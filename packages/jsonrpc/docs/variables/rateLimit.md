[**@tevm/jsonrpc**](../README.md)

***

[@tevm/jsonrpc](../globals.md) / rateLimit

# Variable: rateLimit

> `const` **rateLimit**: (`_transport`, `{ requestsPerSecond, browser, }`) => `Transport`

Defined in: node\_modules/.pnpm/@ponder+utils@0.2.18\_typescript@6.0.3\_viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3\_/node\_modules/@ponder/utils/dist/index.d.ts:51

## Parameters

### \_transport

`Transport`

### \{ requestsPerSecond, browser, \}

#### browser?

`boolean`

#### requestsPerSecond

`number`

## Returns

`Transport`

## Description

Creates a rate limited transport that throttles request throughput.
