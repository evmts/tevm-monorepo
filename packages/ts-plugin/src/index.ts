import type typescript from "typescript/lib/tsserverlibrary";
import { createLogger } from "./createLogger";
import { TsPlugin } from "./TsPlugin";

const init = (modules: {
	typescript: typeof typescript;
}) => {
	const ts = modules.typescript;

	function create(createInfo: typescript.server.PluginCreateInfo) {
		const plugin = new TsPlugin(createInfo, ts);
		return plugin.create();
	}

	return { create };
};

export = init;
