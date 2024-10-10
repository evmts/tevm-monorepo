---
"@tevm/actions": patch
---

Fixed bug where input params arrays for some json rpc requests were not readonly. This would cause typescript to error if a readonly array was used rather than a normal one
