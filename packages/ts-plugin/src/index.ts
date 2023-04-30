import type typescript from "typescript/lib/tsserverlibrary";
import { createLogger } from "./factories";
import { languageServiceHostDecorator } from "./languageServiceHost";

const init = (modules: {
	typescript: typeof typescript;
}) => {
	return {
		create: (createInfo: typescript.server.PluginCreateInfo) => {
			const logger = createLogger(createInfo);
			return languageServiceHostDecorator(
				createInfo,
				modules.typescript,
				logger,
			);
		},
	};
};

export = init;
