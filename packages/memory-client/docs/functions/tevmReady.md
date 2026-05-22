[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmReady

# Function: tevmReady()

> **tevmReady**(`client`): `Promise`\<`true`\>

Defined in: [packages/memory-client/src/tevmReady.js:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmReady.js#L25)

Tree-shakeable `tevmReady` action. Resolves when the TEVM client (and any fork) is initialized.

All TEVM actions implicitly await readiness, so this is only needed when you want to surface
initialization timing or errors explicitly (e.g. UI loading state, benchmarks, fork-connect timeout).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `Chain` \| `undefined`, `Account` \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\> | The viem client configured with TEVM transport. |

## Returns

`Promise`\<`true`\>

Resolves to `true` when ready, rejects if initialization fails.

## Throws

If initialization fails.

## Example

```typescript
import { createMemoryClient, http } from 'tevm'
import { optimism } from 'tevm/common'

const client = createMemoryClient({
  fork: { transport: http('https://mainnet.optimism.io')({}) },
  common: optimism,
})
await client.tevmReady()
```

## See

[TEVM Actions Guide](https://tevm.sh/learn/actions/)
