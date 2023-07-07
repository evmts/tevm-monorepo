import { createSolidityService } from './createSolidityService'
import { getSolidityLanguageModule } from './getSolidityLanguageModule'
import {
	LanguageServerPlugin,
	MessageType,
	ShowMessageNotification,
} from '@volar/language-server'

export const plugin: LanguageServerPlugin = (_, modules) => {
	return {
		extraFileExtensions: [
			{ extension: 'sol', isMixedContent: false, scriptKind: 7 },
		],
		watchFileExtensions: ['sol'],
		resolveConfig(config, ctx) {
			config.languages ??= {}
			if (ctx) {
				// check that solc or foundry (or hardhat in future) is installed
				// Check that all evmts packages are installed
				const evmtsCore = {} // getEvmtsCoreInstall([ctx.project.rootUri.fsPath]);
				if (!evmtsCore) {
					ctx.server.connection.sendNotification(ShowMessageNotification.type, {
						message: `Couldn't find evmts-core in workspace "${ctx.project.rootUri.fsPath}". Experience might be degraded. For the best experience, please make sure evmts-core is installed into your project and restart the language server.`,
						type: MessageType.Warning,
					})
				}

				// next we set up the language modules for solidity

				if (modules.typescript) {
					config.languages.solidity = getSolidityLanguageModule(
						modules.typescript,
					)
				}
			}

			// next we set up the language services
			config.services ??= {}
			config.services.solidity ??= createSolidityService()

			return config
		},
	}
}
