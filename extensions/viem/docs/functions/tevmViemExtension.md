[**@tevm/viem**](../README.md) • **Docs**

***

[@tevm/viem](../globals.md) / tevmViemExtension

# Function: tevmViemExtension()

> **tevmViemExtension**(): [`ViemTevmClientDecorator`](../type-aliases/ViemTevmClientDecorator.md)

Decorates a viem [public client](https://viem.sh/) with the [tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/)

## Returns

[`ViemTevmClientDecorator`](../type-aliases/ViemTevmClientDecorator.md)

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

[extensions/viem/src/tevmViemExtension.js:36](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmViemExtension.js#L36)
