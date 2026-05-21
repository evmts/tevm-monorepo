---
id: 010
status: done
priority: P1
area: rpc
---

# eth_sign And eth_signTransaction Runtime Support

## Problem

Tevm has type/docs traces for `eth_sign` and `eth_signTransaction`, but these methods are not registered in the current `createHandlers.js` runtime map.

## Scope

- Register runtime handlers for:
  - `eth_sign`
  - `eth_signTransaction`
- Support managed dev accounts.
- Define behavior for impersonated and unmanaged accounts.
- Validate legacy, EIP-1559, EIP-4844, and EIP-7702 transaction request support according to Tevm's hardfork capabilities.

## Acceptance Criteria

- Methods are callable through `.request`, HTTP server, and decorators.
- Tests cover managed signer success, unmanaged signer failure, malformed params, and transaction signing for supported tx types.
- Published types and runtime registration stay in sync.

