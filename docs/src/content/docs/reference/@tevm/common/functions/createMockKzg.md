---
editUrl: false
next: false
prev: false
title: "createMockKzg"
---

> **createMockKzg**(): [`MockKzg`](/reference/tevm/common/type-aliases/mockkzg/)

Returns a mock kzg object that always trusts never verifies
The real kzg commitmenet is over 500kb added to bundle size
so this is useful alternative for smaller bundles and the default

## Returns

[`MockKzg`](/reference/tevm/common/type-aliases/mockkzg/)

## Throws

## Example

```typescript
import { createCommon, createMockKzg, mainnet } from 'tevm/common'

const common = createCommon({
  ...mainnet,
  customCrypto: {
    kzg: createMockKzg(),
  },
})
```

## See

[createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)

## Source

[packages/common/src/createMockKzg.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/createMockKzg.js#L22)
