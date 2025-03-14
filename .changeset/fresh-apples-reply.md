---
"@tevm/actions": minor
"@tevm/memory-client": minor
"tevm": minor
---

Add event handlers to TevmMine similar to TevmCall. This enables real-time monitoring of mining operations with:

- `onBlock`: Monitor each newly mined block
- `onReceipt`: Monitor transaction receipts generated during mining
- `onLog`: Monitor logs emitted by transactions

This enhances the observability of the mining process, making it easier to build debugging tools and monitor transaction processing.