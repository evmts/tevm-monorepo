---
editUrl: false
next: false
prev: false
title: "ViemTevmOptimisticExtension"
---

`Experimental`

> **ViemTevmOptimisticExtension**: () => [`ViemTevmOptimisticClientDecorator`](/reference/tevm/viem/type-aliases/viemtevmoptimisticclientdecorator/)

## Example

```js
import { createClient, parseEth } from 'viem'
import { tevmViemExtension } from '@tevm/viem-extension'

const client = createClient('https://mainnet.optimism.io')
  .extend(tevmViemExtension())

await client.tevm.account({
  address: `0x${'12'.repeat(20)}`,
  balance: parseEth('420'),
})
```

## See

[@tevm/server](https://tevm.sh/generated/tevm/server/functions/createserver) for documentation on creating a tevm backend

:::caution[Deprecated]
in favor of the viem transport

Decorates a viem [public client](https://viem.sh/) with the [tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/)
:::

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Returns

[`ViemTevmOptimisticClientDecorator`](/reference/tevm/viem/type-aliases/viemtevmoptimisticclientdecorator/)

## Source

[extensions/viem/src/ViemTevmOptimisticExtension.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticExtension.ts#L22)
