import { FoundryOptions } from './getFoundryConfig'
import { execa } from 'execa'

export const buildContracts = async ({
	forgeExecutable = 'forge',
	projectRoot = process.cwd(),
}: FoundryOptions) => {
	return execa(forgeExecutable, ['build', '--root', projectRoot])
}
