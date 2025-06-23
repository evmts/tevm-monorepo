---
"@tevm/actions": patch
"@tevm/errors": patch
---

- Improved error responses to include additional raw data for better context when call procedures fail, and allow viem `writeContract` to decode contract reverts.
- Enhanced transaction receipt responses by converting numeric status values to hexadecimal strings for consistency.
- Updated error code for specific Ethereum errors to align with standard codes (3 for revert).
