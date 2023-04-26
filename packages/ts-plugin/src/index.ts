import type typescript from "typescript/lib/tsserverlibrary";
import { createLogger } from "./createLogger";

function init(modules: {
	typescript: typeof typescript;
}) {
	const ts = modules.typescript;

	function create(pluginCreateInfo: typescript.server.PluginCreateInfo) {
		const logger = createLogger(pluginCreateInfo);
	}

	return { create };
}

export = init;
