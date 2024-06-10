import type { InternalError } from "@tevm/errors";
import type { ValidateCallParamsError } from "../zod/validators/validateCallParams.js";
import type { CallHandlerOptsError } from "./callHandlerOpts.js";

export type TevmCallError = ValidateCallParamsError | CallHandlerOptsError | InternalError
