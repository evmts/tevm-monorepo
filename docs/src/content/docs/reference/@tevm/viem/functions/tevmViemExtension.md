---
editUrl: false
next: false
prev: false
title: "tevmViemExtension"
---

> **tevmViemExtension**(): [`ViemTevmClientDecorator`](/reference/tevm/viem/type-aliases/viemtevmclientdecorator/)

:::caution[Deprecated]
in favor of the viem transport
Decorates a viem [public client](https://viem.sh/) with the [tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/)
:::

## Returns

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

## Source

[tevmViemExtension.js:42](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmViemExtension.js#L42)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
