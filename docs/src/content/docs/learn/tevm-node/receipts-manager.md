---
title: TevmNode api
description: Using TevmNode from `tevm/node` package
---
# TevmNode

### TevmNode.getReceiptsManager()

This internal cache is used by tevm clients to cache receipt and log information.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
const manager = await tevm.getReceiptsManager();
```

Note: the VM does not cache anything in the receipts manager.

