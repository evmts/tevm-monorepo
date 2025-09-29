[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / rateLimit

# Variable: rateLimit()

> `const` **rateLimit**: (`_transport`, `{ requestsPerSecond, browser, }`) => `Transport`

Defined in: node\_modules/.pnpm/@ponder+utils@0.2.13\_typescript@5.9.2\_viem@2.37.8\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@4.1.11\_/node\_modules/@ponder/utils/dist/index.d.ts:51

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
