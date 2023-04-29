import { describe, expect, it } from "vitest";
import { isRelativeSolidity } from "./isRelativeSolidity";

describe(isRelativeSolidity.name, () => {
	it("should return true for .sol files", () => {
		expect(isRelativeSolidity("./foo.sol")).toBe(true);
	});

	it("should return false for non .sol files", () => {
		expect(isRelativeSolidity("foo.ts")).toBe(false);
	});

	it("should return false for non relative .sol files", () => {
		expect(isRelativeSolidity("foo.sol")).toBe(false);
	});
});
