# Vocs Documentation Build Bugs

vocs 1.0.5 does not export `Tabs`/`Tab`, `Cards`/`Card`, or `FileTree`. Builds that import them fail with errors like `"Tabs" is not exported by ".../vocs/_lib/components.js"`.

**Affected files:** `/docs/pages/core/managing-state.mdx`, `/docs/pages/api/methods.mdx`, `/docs/pages/core/mining-modes.mdx`.

**Fixes:**
- `Tabs`/`Tab` → `:::code-group` markdown directive.
- `Cards`/`Card` → custom div-based grid with inline styles.
- `FileTree` → nested `<details>`/`<summary>`, or remove if unused.

See [components.md](./components.md) for the full list of vocs 1.0.5 exports and supported markdown directives.
