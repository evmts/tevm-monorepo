---
"@tevm/vm": minor
---

Added optimistic updates to the viem extension writeContractOptimistic. It takes same parameters as writeContract but returns two functions. One to unpack the writeContract result and the other to unpack the optimistic result. This is the most naive implementation and will be expanded over time.
