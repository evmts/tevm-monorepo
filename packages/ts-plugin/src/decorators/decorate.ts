import type typescript from "typescript/lib/tsserverlibrary";
import { Logger, createLogger } from "../createLogger";

export type Decorator = (
	createInfo: typescript.server.PluginCreateInfo,
	ts: typeof typescript,
	logger: Logger,
) => Partial<typescript.LanguageServiceHost>;

export const decorate = (
	instance: typescript.LanguageServiceHost,
	createInfo: typescript.server.PluginCreateInfo,
	ts: typeof typescript,
	logger: Logger,
	decorators: Decorator[],
): typescript.LanguageServiceHost => {
	if (decorators.length === 0) {
		return instance;
	}

	const [nextDecorator, ...rest] = decorators;

	const proxyInstance = nextDecorator(createInfo, ts, logger);

	const decoratedInstance = new Proxy(instance, {
		get(target, key: keyof typescript.LanguageServiceHost) {
			if (key in proxyInstance) {
				return proxyInstance[key];
			}
			return target[key];
		},
	});

	return decorate(decoratedInstance, createInfo, ts, logger, rest);
};
