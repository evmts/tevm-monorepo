import type { ResolvedConfig } from '@evmts/config'

export const install = async (
	config: ResolvedConfig,
	logger: Pick<typeof console, 'log' | 'info' | 'error' | 'warn'>,
) => {
	logger.log('TODO', config)
}
