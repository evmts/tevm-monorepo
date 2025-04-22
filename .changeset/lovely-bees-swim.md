---
"@tevm/actions": patch
---

Fixes impersonated tx parameters parsing: a specified `caller` parameter would be overriden by the default `origin` as the sender of the transaction.

This fix adds `caller` as a fallback value to `tx.origin`.
