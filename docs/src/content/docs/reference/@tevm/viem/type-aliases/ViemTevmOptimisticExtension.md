---
editUrl: false
next: false
prev: false
title: "ViemTevmOptimisticExtension"
---

> **ViemTevmOptimisticExtension**: () => [`ViemTevmOptimisticClientDecorator`](/reference/tevm/viem/type-aliases/viemtevmoptimisticclientdecorator/)

Decorates a viem [public client](https://viem.sh/) with the [tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/)

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

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Source

[ViemTevmOptimisticExtension.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticExtension.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
