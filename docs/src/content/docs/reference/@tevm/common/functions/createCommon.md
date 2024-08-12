---
editUrl: false
next: false
prev: false
title: "createCommon"
---

> **createCommon**(`options`): [`Common`](/reference/tevm/common/type-aliases/common/)

Common is the main representation of chain specific configuration for tevm clients.

createCommon creates a typesafe ethereumjs Common object used by the EVM
to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.
Tevm common extends the [viem chain](https://github.com/wevm/viem/blob/main/src/chains/index.ts) interface

## Parameters

• **options**: [`CommonOptions`](/reference/tevm/common/type-aliases/commonoptions/)

## Returns

[`Common`](/reference/tevm/common/type-aliases/common/)

## Throws

only if invalid params are passed

## Examples

```typescript
import { createCommon } from 'tevm/common'

const common = createCommon({
 customCrypto: {},
 loggingLevel: 'debug',
 hardfork: 'london',
 eips: [420],
 id: 69,
 name: 'MyChain',
 ...
})
```
Since common are stateful consider copying it before using it

```typescript
import { createCommon } from 'tevm/common'
const common = createCommon({ ... })

const commonCopy = common.copy()
```

To use with ethereumjs use the ethjsCommon property

```typescript
import { VM } from '@ethereumjs/vm'
import { createMemoryClient } from 'tevm'

const common = createCommon({ ... })

const vm = new VM({
  common: common.ethjsCommon,
})
```

## See

[Tevm client docs](https://tevm.sh/learn/clients/)

## Defined in

[packages/common/src/createCommon.js:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/createCommon.js#L53)
