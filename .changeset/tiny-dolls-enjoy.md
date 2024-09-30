---
"@tevm/actions": patch
---

Fixed bug in tevm_call json-rpc procedure where deployedBytecode, createTrace and createAccessList were not forwarded to the underlying handler. This bug only affected users using JSON-RPC directly
