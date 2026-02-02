export function LoggerTest(level?: LogLevel, name?: string): Layer.Layer<import("effect/Context").Tag<any, any>, never, never>;
export function isTestLogger(logger: LoggerShape): logger is TestLoggerShape;
export type LogLevel = import("./types.js").LogLevel;
export type LogSeverity = import("./types.js").LogSeverity;
export type LogEntry = import("./types.js").LogEntry;
export type LoggerShape = import("./LoggerShape.js").LoggerShape;
/**
 * Extended LoggerShape with additional methods for test assertions.
 * Note: The `child` method returns `TestLoggerShape` (not `LoggerShape`) so child loggers
 * also have access to test-specific methods like `getLogs`, `clearLogs`, etc.
 */
export type TestLoggerShape = Omit<LoggerShape, "child"> & {
    child: (name: string) => TestLoggerShape;
    getLogs: () => Effect.Effect<readonly LogEntry[], never, never>;
    getLogsByLevel: (level: LogSeverity) => Effect.Effect<readonly LogEntry[], never, never>;
    clearLogs: () => Effect.Effect<void, never, never>;
    getLastLog: () => Effect.Effect<LogEntry | undefined, never, never>;
    getLogCount: () => Effect.Effect<number, never, never>;
    getAndClearLogs: () => Effect.Effect<readonly LogEntry[], never, never>;
};
import { Layer } from 'effect';
import { Effect } from 'effect';
//# sourceMappingURL=LoggerTest.d.ts.map