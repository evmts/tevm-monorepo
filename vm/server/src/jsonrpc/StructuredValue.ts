import type { PrimitiveType } from "./PrimitiveType.js";

export type StructuredValue = Record<string, PrimitiveType> | ReadonlyArray<PrimitiveType>
