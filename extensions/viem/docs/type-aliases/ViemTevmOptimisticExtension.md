**@tevm/viem** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ViemTevmOptimisticExtension

# Type alias: ViemTevmOptimisticExtension

> **ViemTevmOptimisticExtension**: () => [`ViemTevmOptimisticClientDecorator`](ViemTevmOptimisticClientDecorator.md)

## Deprecated

in favor of the viem transport

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

## Source

[ViemTevmOptimisticExtension.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/ViemTevmOptimisticExtension.ts#L22)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
