---
"@tevm/procedures": patch
"@tevm/memory-client": patch
"@tevm/client-types": patch
"@tevm/procedures": patch
"@tevm/ethers": patch
"@tevm/viem": patch
"@tevm/server": patch
"tevm": patch
---

Fixed bug where some supported methods such as eth_signTransaction were falsely being filtered as unsupported methods by some tevm clients
