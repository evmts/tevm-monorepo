import { describe, expect, it, vi } from "vitest";
import { Decorator, composeDecorators } from ".";
import typescript from "typescript/lib/tsserverlibrary";
import { createProxy } from "../factories";

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
type TestAny = any;

describe(composeDecorators.name, () => {
	it("composes decorators into a single decorator", () => {
		const decorator1 = vi.fn();
		const decorator2 = vi.fn();
		const decorator3 = vi.fn();

		const mockDecoratorImplementation =
			(i: number): Decorator =>
			(host, createInfo, ts, logger) => {
				return createProxy(host, { [i]: "decorated" });
			};

		decorator1.mockImplementation(mockDecoratorImplementation(1));
		decorator2.mockImplementation(mockDecoratorImplementation(2));
		decorator3.mockImplementation(mockDecoratorImplementation(3));

		const composedDecorator = composeDecorators(
			decorator1,
			decorator2,
			decorator3,
		);

		const host = { isHost: true };
		const createInfo = { isCreateInfo: true };
		const logger = {
			log: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		};

		const decoratedHost = composedDecorator(
			host as TestAny,
			createInfo as TestAny,
			typescript,
			logger,
		);

		expect((decoratedHost as TestAny)[1]).toBe("decorated");
		expect((decoratedHost as TestAny)[2]).toBe("decorated");
		expect((decoratedHost as TestAny)[3]).toBe("decorated");

		expect(decorator1).toHaveBeenCalledWith(
			host,
			createInfo,
			typescript,
			logger,
		);
		expect(decorator2).toHaveBeenCalledWith(
			host,
			createInfo,
			typescript,
			logger,
		);
		expect(decorator3).toHaveBeenCalledWith(
			host,
			createInfo,
			typescript,
			logger,
		);
	});
});
