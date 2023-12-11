import type { PrimitiveType } from "./PrimitiveType";

export type StructuredValue = Record<string, PrimitiveType> | ReadonlyArray<PrimitiveType>
