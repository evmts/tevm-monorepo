# Vocs Documentation Build Bugs

## Bug 1: Missing Tabs and Tab Components
- **Issue**: The build fails with error: `"Tabs" is not exported by "../../node_modules/.pnpm/vocs@1.0.5_@types+node@22.13.10_@types+react-dom@19.0.4_@types+react@19.0.10__@types+re_99c0f22c807543b18d8879f9059cd986/node_modules/vocs/_lib/components.js"`
- **File**: `/docs/pages/core/managing-state.mdx`
- **Component**: `Tabs` and `Tab` components are being imported but not available in the current version of vocs (1.0.5)
- **Investigation**: Checked the exports in `vocs/components.ts` and found that `Tabs` and `Tab` are not exported
- **Solution**: Replaced with the `:::code-group` directive from the Markdown syntax

## Bug 2: Missing Cards and Card Components
- **Issue**: After fixing the first bug, we discovered that `Cards` and `Card` components also don't exist
- **File**: `/docs/pages/core/managing-state.mdx`
- **Component**: `Cards` and `Card` components are being imported but not available in vocs/components
- **Investigation**: These components are not in the exported list in vocs/components.ts
- **Solution**: Replaced with custom div-based grid layouts using inline styles

## Bug 3: Missing FileTree Component
- **Issue**: The `FileTree` component is imported but doesn't exist
- **File**: `/docs/pages/core/managing-state.mdx`
- **Investigation**: This component is not listed in the exports of vocs/components.ts
- **Solution**: Removed from imports since it's not used in the file

## Bug 4: More Missing Components in methods.mdx
- **Issue**: After fixing the first file, the build failed with similar errors in methods.mdx
- **File**: `/docs/pages/api/methods.mdx`
- **Component**: Multiple missing components (`Tabs`, `Tab`, `Cards`, `Card`, `FileTree`)
- **Investigation**: These components are not exported by vocs/components.ts
- **Solution**: Removed from imports, replaced `Tabs`/`Tab` with `:::code-group`, `Cards`/`Card` with custom div-based grid layouts, and `FileTree` with custom nested details/summary elements

## Bug 5: More Missing Components in mining-modes.mdx
- **Issue**: After fixing the previous files, the build failed with similar errors in mining-modes.mdx
- **File**: `/docs/pages/core/mining-modes.mdx`
- **Component**: Similar missing components (`Tabs`, `Tab`, `Cards`, `Card`, `FileTree`)
- **Investigation**: Same issue with components not being exported by vocs/components.ts
- **Solution**: Will follow the same approach as in the previous files - removing imports and replacing with alternative implementations