import { Logger } from '../types'
import { resolveArtifactsSync } from './resolveArtifactsSync'
import { ResolvedConfig } from '@evmts/config'

/**
 * Currently unimplemented just uses resolveArtifactsSync
 */
export const resolveArtifacts = async (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedConfig,
): Promise<
	| Record<string, { contractName: string; abi: any; bytecode: string }>
	| undefined
> => {
	return resolveArtifactsSync(solFile, basedir, logger, config)
}
