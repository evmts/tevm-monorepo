import type typescript from "typescript/lib/tsserverlibrary";
import { createLogger } from "../utils";
import {
	decorate,
	resolveModuleNameLiteralsDecorator,
	getScriptSnapshotDecorator,
	getScriptKindDecorator,
} from "../decorators";

export type Create = (
	createInfo: typescript.server.PluginCreateInfo,
) => typescript.LanguageServiceHost;

export const createFactory = (ts: typeof typescript): Create => {
	const create: Create = (createInfo) => {
		const logger = createLogger(createInfo);

		return decorate(createInfo.languageServiceHost, createInfo, ts, logger, [
			resolveModuleNameLiteralsDecorator,
			getScriptSnapshotDecorator,
			getScriptKindDecorator,
		]);
	};
	return create;
};
