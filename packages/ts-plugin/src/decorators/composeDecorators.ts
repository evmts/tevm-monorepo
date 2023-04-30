import { Decorator } from "./Decorator";

/**
 *
 * @param decorators
 * @returns
 */
export const composeDecorators = (...decorators: Decorator[]): Decorator => {
	return (host, createInfo, ts, logger) => {
		if (decorators.length === 0) {
			return host;
		}

		const [nextDecorator, ...restDecorators] = decorators;

		const decoratedHost = nextDecorator(host, createInfo, ts, logger);

		return composeDecorators(...restDecorators)(
			decoratedHost,
			createInfo,
			ts,
			logger,
		);
	};
};
