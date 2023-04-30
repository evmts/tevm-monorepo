import { describe, expect, it, vi } from "vitest";
import { Decorator, composeDecorators } from ".";

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
type TestAny = any;

describe(composeDecorators.name, () => {
	it("should return the instance if there are no decorators", () => {
		const instance = {} as TestAny;
		const createInfo = {} as TestAny;
		const ts = {} as TestAny;
		const logger = {} as TestAny;
		const decorators = [] as TestAny[];

		const result = composeDecorators(...decorators)(
			instance,
			createInfo,
			ts,
			logger,
		);

		expect(result).toBe(instance);
	});

	it("should return a Proxy", () => {
		const originalMethod = "originalMethod";
		const instance = {
			originalMethod: () => originalMethod,
			decoratedMethod: () => {
				throw new Error("This should not be called");
			},
		} as TestAny;
		const createInfo = {} as TestAny;
		const ts = {} as TestAny;
		const logger = {} as TestAny;
		const expected = "expected";
		const decorators: TestAny = [() => ({ decoratedMethod: () => expected })];

		const result = composeDecorators(...decorators)(
			instance,
			createInfo,
			ts,
			logger,
		);

		expect((result as TestAny).decoratedMethod()).toBe(expected);
		expect((result as TestAny).originalMethod()).toBe(originalMethod);
	});

	it("should work with multiple decorators", () => {
		const originalMethod = "originalMethod";
		const instance = {
			originalMethod: () => originalMethod,
			decoratedMethod: () => {
				throw new Error("This should not be called");
			},
		} as TestAny;
		const createInfo = {} as TestAny;
		const ts = {} as TestAny;
		const logger = {} as TestAny;
		const expected = "expected";
		const expected2 = "expected2";
		const decorators: TestAny = [
			() => ({ decoratedMethod: () => expected }),
			() => ({ decoratedMethod2: () => expected2 }),
		];

		const result = composeDecorators(...decorators)(
			instance,
			createInfo,
			ts,
			logger,
		);

		expect((result as TestAny).decoratedMethod()).toBe(expected);
		expect((result as TestAny).decoratedMethod2()).toBe(expected2);
		expect((result as TestAny).originalMethod()).toBe(originalMethod);
	});

	it("should pass in createInfo, ts, and logger into the decorators", () => {
		const instance = {} as TestAny;
		const createInfo = {} as TestAny;
		const ts = {} as TestAny;
		const logger = {} as TestAny;
		const expected = "expected";
		const decoreator = vi.fn();
		decoreator.mockImplementationOnce((createInfoArg, tsArg, loggerArg) => {
			expect(createInfoArg).toBe(createInfo);
			expect(tsArg).toBe(ts);
			expect(loggerArg).toBe(logger);
			return { decoratedMethod: () => expected } as TestAny;
		});
		const decorators: Decorator[] = [decoreator];

		const result = composeDecorators(...decorators)(
			instance,
			createInfo,
			ts,
			logger,
		);

		expect((result as TestAny).decoratedMethod()).toBe(expected);
		expect(decoreator).toHaveBeenCalledTimes(1);
		expect(decoreator).toBeCalledWith(createInfo, ts, logger);
	});
});
