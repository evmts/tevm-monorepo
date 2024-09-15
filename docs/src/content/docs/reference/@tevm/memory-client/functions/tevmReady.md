---
editUrl: false
next: false
prev: false
title: "tevmReady"
---

> **tevmReady**(`client`): `Promise`\<`true`\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](/reference/tevm/utils/type-aliases/account/), `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

## Returns

`Promise`\<`true`\>

Resolves when ready, rejects if VM fails to initialize.

## Defined in

[packages/memory-client/src/tevmReady.js:43](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/memory-client/src/tevmReady.js#L43)
