// @ts-ignore - TODO figure out why these types don't work
import fs from 'fs-extra/esm'
import { globby } from 'globby'

/**
 * @see wagmis implementation as reference https://github.com/wagmi-dev/wagmi/blob/main/packages/cli/src/plugins/foundry.ts
 */
export const getArtifactPaths = async (artifactsDirectory: string) => {
	const include = ['*.json']

	return globby(include.map((x) => `${artifactsDirectory}/**/${x}`))
}
