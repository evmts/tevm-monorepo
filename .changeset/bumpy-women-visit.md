---
"@tevm/vm": patch
---

Fixes the blockchain deep copy in `vm.deepCopy`.

This was previously returning the original blockchain reference, when it should return its deep copy that was created previously.

This was causing the original blockchain to receive incomplete references of blocks created by the temporary deep copy of the blockchain in `getPendingClient` (when mining pending blocks), as these blocks would be shared with the original blockchain.

This is now fixed by returning the deep copy of the blockchain instead of the original reference.