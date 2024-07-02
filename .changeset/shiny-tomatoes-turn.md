---
"@tevm/state": patch
---

Fixed closure bug which would cause StateManager.dumpStorage to dump the wrong storage. This caused getAccount downstream to sometimes falsely return empty storage
