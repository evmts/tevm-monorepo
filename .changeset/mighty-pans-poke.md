---
"@tevm/actions": patch
---

Fixed bug where tevmCall and related methods would improperly validate params such as depth and value. Previously it would not throw a validation error if these numbers are negative
