---
"@tevm/blockchain": patch
---

Fixed bug where on optimism based chains block.header.parentHash would falsely not exist. This is because deposit transactions are filtered out at this time thus the block hashes are changed. As a workaround until optimism deposit transactions are supported getBlock(realHash) will still return the intended block
