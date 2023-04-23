import type typescript from "typescript/lib/tsserverlibrary";
import { createLogger } from "./creatLogger";

function init(modules: {
	typescript: typeof import("typescript/lib/tsserverlibrary");
}) {
	const ts = modules.typescript;

	function create(pluginCreateInfo: typescript.server.PluginCreateInfo) {
		const logger = createLogger(pluginCreateInfo);
	}

	return { create };
}

export = init;
