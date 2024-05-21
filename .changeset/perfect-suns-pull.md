---
"@tevm/procedures": patch
---

Fixed bug with blobGasUsed being '0x' rather than undefined. This causes issues with viem decoding.
