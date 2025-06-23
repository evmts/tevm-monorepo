---
"@tevm/contract": patch
"@tevm/actions": patch
"@tevm/errors": patch
"@tevm/test-utils": patch
---

- **New Features**
  - Improved error messages for contract call failures by decoding and displaying detailed revert reasons, including custom errors and panic codes.
  - Added a comprehensive revert reason decoder to provide clearer explanations for contract execution failures.
  - Error responses now include more context and human-readable explanations when contract execution fails.

- **Enhancements**
  - Contract factories now handle ABI errors and events more precisely, resulting in more accurate contract interaction and event filtering.
  - Error handling across contract calls and actions is more robust, with raw revert data included for advanced debugging.
  - Expanded test coverage for revert scenarios, ensuring reliable error decoding in various contract call contexts.