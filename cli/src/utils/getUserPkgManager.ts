export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

// Originally from https://github.com/t3-oss/create-t3-app/blob/main/cli/src/utils/getUserPkgManager.ts
export const getUserPkgManager: () => PackageManager = () => {
	// This environment variable is set by npm and yarn but pnpm seems less consistent
	const userAgent = process.env['npm_config_user_agent']

	if (userAgent) {
		if (userAgent.startsWith('yarn')) {
			return 'yarn'
		}
		if (userAgent.startsWith('pnpm')) {
			return 'pnpm'
		}
		if (userAgent.startsWith('bun')) {
			return 'bun'
		}
		return 'npm'
	}
	// If no user agent is set, assume npm
	return 'npm'
}
