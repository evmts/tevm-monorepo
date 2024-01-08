import * as tsup from 'tsup';

type Target = 'js' | 'node' | 'browser';

declare function createTsUpOptions({ entry, outDir, target, format, }: {
    entry?: string[] | undefined;
    outDir?: string | undefined;
    target?: Target | undefined;
    format?: ("cjs" | "esm")[] | undefined;
}): tsup.Options;

declare const browser: tsup.Options;

declare const js: tsup.Options;

declare const node: tsup.Options;

export { browser, createTsUpOptions, js, node };
