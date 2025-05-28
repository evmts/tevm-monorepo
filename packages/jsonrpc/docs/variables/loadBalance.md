[**@tevm/jsonrpc**](../README.md)

***

[@tevm/jsonrpc](../globals.md) / loadBalance

# Variable: loadBalance()

> `const` **loadBalance**: (`_transports`) => `Transport`

Defined in: node\_modules/.pnpm/@ponder+utils@0.2.7\_typescript@5.8.3\_viem@2.30.1\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.25.30\_/node\_modules/@ponder/utils/dist/index.d.ts:46

## Parameters

### \_transports

`Transport`[]

## Returns

`Transport`

## Description

Creates a load balanced transport that spreads requests between child transports using a round robin algorithm.
