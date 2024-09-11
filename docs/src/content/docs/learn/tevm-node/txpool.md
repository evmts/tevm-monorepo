---
title: TevmNode api
description: Using TevmNode from `tevm/node` package
---
# TevmNode

### TevmNode.getTxPool()

The TxPool is used by Tevm to represent unmined tx. json-rpc methods such as `eth_sendRawTransaction` work via adding the tx to the tx pool. It is also used to represent json-rpc requests using block tag `pending`.

```typescript
import { createTevmNode } from "tevm/node";

const tevm = createTevmNode();
const mempool = await tevm.getTxPool();

const txs = await mempool.getBySenderAddress();
```

