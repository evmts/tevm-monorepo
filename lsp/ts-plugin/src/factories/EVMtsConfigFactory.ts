import type { EVMtsConfig } from '@evmts/config'
import { join } from 'path'
import type typescript from 'typescript/lib/tsserverlibrary'

export const evmTsConfigFactory = (
	createInfo: typescript.server.PluginCreateInfo,
): EVMtsConfig => {
	const { baseUrl } = createInfo.project.getCompilerOptions()
	let config: EVMtsConfig = createInfo.config
	if (baseUrl) {
		config = {
			...config,
			compiler: {
				...config?.compiler,
				libs: [
					...(config?.compiler?.libs || []),
					join(createInfo.project.getCurrentDirectory(), baseUrl),
				],
			},
		}
	}
	return config
}
