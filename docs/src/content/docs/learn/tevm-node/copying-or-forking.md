---
title: TevmNode api
description: Using TevmNode from `tevm/node` package
---
# TevmNode

### Copying or Forking a node

TevmNode can fork another TevmNode by passing it into `fork.transport`

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
const forkedTevm = createTevmNode({
  fork: { transport: tevm },
});
```

Forking should be the default as it's the most performant way to create a new TevmNode instance. But you can also deep copy a TevmNode.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
const tevmCopy = tevm.deepCopy();
```

