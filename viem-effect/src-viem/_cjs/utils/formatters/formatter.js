"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineFormatter = void 0;
function defineFormatter(type, format) {
    return ({ exclude, format: overrides, }) => {
        return {
            exclude,
            format: (args) => {
                const formatted = format(args);
                if (exclude) {
                    for (const key of exclude) {
                        delete formatted[key];
                    }
                }
                return {
                    ...formatted,
                    ...overrides(args),
                };
            },
            type,
        };
    };
}
exports.defineFormatter = defineFormatter;
//# sourceMappingURL=formatter.js.map