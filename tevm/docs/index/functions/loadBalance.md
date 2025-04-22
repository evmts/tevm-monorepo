[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / loadBalance

# Function: loadBalance()

> **loadBalance**(`_transports`): `Transport`

Defined in: node\_modules/.pnpm/@ponder+utils@0.2.3\_typescript@5.8.3\_viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.24.3\_/node\_modules/@ponder/utils/dist/index.d.ts:46

## Parameters

### \_transports

`Transport`[]

## Returns

`Transport`

## Description

Creates a load balanced transport that spreads requests between child transports using a round robin algorithm.
