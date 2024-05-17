---
"@tevm/memory-client": patch
"@tevm/actions": patch
"tevm": patch
---

Fixed bug where eth_getBalance which previously was implemented for block tag 'pending' was not updated. Now eth_getBalance works for all block tags except pending.
