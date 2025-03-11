import { createUnplugin, tevmUnplugin } from '@tevm/unplugin'

/**
 * Creates a universal plugin instance from the Tevm unplugin factory.
 *
 * This exports a universal plugin created by the @tevm/unplugin package,
 * which is then adapted to work with Webpack's plugin system. The unplugin
 * architecture allows the same core implementation to be used across different
 * build tools.
 *
 * @internal
 */
export const unplugin = createUnplugin(tevmUnplugin)
