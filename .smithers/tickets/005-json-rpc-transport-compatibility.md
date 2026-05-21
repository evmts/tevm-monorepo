---
id: 005
status: done
priority: P1
area: server
---

# JSON-RPC Transport Compatibility

## Problem

Tevm's `@tevm/server` should support stricter JSON-RPC transport behavior so the same node can be used in compatibility test suites.

## Scope

- Add a compatibility mode or new handler that enforces:
  - `/` endpoint only.
  - `POST` only.
  - `application/json` content type.
  - JSON-RPC notification responses as HTTP 204.
  - empty batch as invalid request.
  - body size limit.
  - header size behavior where practical in Node.
  - consistent `Content-Type: application/json` for response bodies.
- Preserve current lightweight server behavior unless compatibility mode is enabled.

## Acceptance Criteria

- Transport tests cover 404, 405, 415, 204, 413, parse errors, empty batch, notification-only batch, and mixed batch.
- Existing server users are not broken by default.
- Compatibility mode uses the same runtime dispatch as the normal request path.
