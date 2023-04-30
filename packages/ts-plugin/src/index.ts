import type typescript from "typescript/lib/tsserverlibrary";
import { createLogger } from "./utils/createLogger";
import { decorate } from "./decorators/decorate";
import { resolveModuleNameLiteralsDecorator } from "./decorators/resolveModuleNameLiterals";
import { getScriptSnapshotDecorator } from "./decorators/getScriptSnapshot";
import { getScriptKindDecorator } from "./decorators/getScriptKind";

const init = (modules: {
	typescript: typeof typescript;
}) => {
	const ts = modules.typescript;

	function create(createInfo: typescript.server.PluginCreateInfo) {
		const logger = createLogger(createInfo);

		return decorate(createInfo.languageServiceHost, createInfo, ts, logger, [
			resolveModuleNameLiteralsDecorator,
			getScriptSnapshotDecorator,
			getScriptKindDecorator,
		]);
	}

	return { create };
};

export = init;
