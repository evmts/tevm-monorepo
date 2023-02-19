import { execa } from 'execa'
import { FoundryOptions } from './getFoundryConfig'

export const buildContracts = async ({
  forgeExecutable = 'forge',
  projectRoot = process.cwd(),
}: FoundryOptions) => {
  await execa(forgeExecutable, ['build', '--root', projectRoot])
}
