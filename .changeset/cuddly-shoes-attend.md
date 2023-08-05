---
"@evmts/config": minor
---

Added strict validation of the EVMts config with helpful error messages. 
- If an unknown config option is passed now EVMts will fail early
- Improvements such as better more clear error messages with actionable messages

Validation is done via zod.strictObject
