---
"@tevm/state": patch
---

Fixed bug with empty accounts not being returned empty in statemanager when in forked mode. This bug would affect both gas estimation and contract creation
