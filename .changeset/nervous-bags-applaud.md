---
"@tevm/actions": patch
"@tevm/memory-client": minor
"@tevm/client-types": patch
"@tevm/http-client": patch
"@tevm/procedures": patch
"@tevm/viem": minor
---

Added eth_accounts eth_sign and eth_signTransaction JSON-RPC support. Added ethAccounts ethSign and ethSignTransaction actions. Added `accounts` prop to tevm client. The accounts used are the test accounts that are also used by ganache anvil and hardhat
