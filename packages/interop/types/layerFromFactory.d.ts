export function layerFromFactory<I, S, O>(tag: Context.Tag<I, S>, factory: (options: O) => Promise<S>): (options: O) => Layer.Layer<I, unknown, never>;
import { Context } from 'effect';
import { Layer } from 'effect';
//# sourceMappingURL=layerFromFactory.d.ts.map