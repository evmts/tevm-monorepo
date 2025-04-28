import { Effect } from "effect";
import Ox from "ox";

// Export types
export type JsonRpcResponse = Ox.JsonRpcResponse.JsonRpcResponse;
export type JsonRpcError = Ox.JsonRpcResponse.JsonRpcError;
export type CreateResponseParams = Ox.JsonRpcResponse.CreateResponseParams;

/**
 * Error class for createResponse function
 */
export class CreateResponseError extends Error {
  override name = "CreateResponseError";
  _tag = "CreateResponseError";
  constructor(cause: unknown) {
    super("Failed to create JSON-RPC response with ox", {
      cause,
    });
  }
}

/**
 * Creates a JSON-RPC response
 * @param params Parameters for creating the response
 * @returns An Effect that succeeds with a JSON-RPC response
 */
export function createResponse(
  params: CreateResponseParams
): Effect.Effect<JsonRpcResponse, CreateResponseError, never> {
  return Effect.try({
    try: () => Ox.JsonRpcResponse.createResponse(params),
    catch: (cause) => new CreateResponseError(cause),
  });
}

/**
 * Error class for parseResponse function
 */
export class ParseResponseError extends Error {
  override name = "ParseResponseError";
  _tag = "ParseResponseError";
  constructor(cause: unknown) {
    super("Failed to parse JSON-RPC response with ox", {
      cause,
    });
  }
}

/**
 * Parses a JSON-RPC response
 * @param response The response string to parse
 * @returns An Effect that succeeds with a JSON-RPC response
 */
export function parseResponse(
  response: string
): Effect.Effect<JsonRpcResponse, ParseResponseError, never> {
  return Effect.try({
    try: () => Ox.JsonRpcResponse.parseResponse(response),
    catch: (cause) => new ParseResponseError(cause),
  });
}

/**
 * Error class for validateResponse function
 */
export class ValidateResponseError extends Error {
  override name = "ValidateResponseError";
  _tag = "ValidateResponseError";
  constructor(cause: unknown) {
    super("Failed to validate JSON-RPC response with ox", {
      cause,
    });
  }
}

/**
 * Validates a JSON-RPC response
 * @param response The response to validate
 * @returns An Effect that succeeds with a boolean indicating if the response is valid
 */
export function validateResponse(
  response: JsonRpcResponse
): Effect.Effect<boolean, ValidateResponseError, never> {
  return Effect.try({
    try: () => Ox.JsonRpcResponse.validateResponse(response),
    catch: (cause) => new ValidateResponseError(cause),
  });
}

/**
 * Error class for getResponseResult function
 */
export class GetResponseResultError extends Error {
  override name = "GetResponseResultError";
  _tag = "GetResponseResultError";
  constructor(cause: unknown) {
    super("Failed to get result from JSON-RPC response with ox", {
      cause,
    });
  }
}

/**
 * Gets the result from a JSON-RPC response
 * @param response The response to get the result from
 * @returns An Effect that succeeds with the response result
 */
export function getResponseResult(
  response: JsonRpcResponse
): Effect.Effect<unknown, GetResponseResultError, never> {
  return Effect.try({
    try: () => Ox.JsonRpcResponse.getResponseResult(response),
    catch: (cause) => new GetResponseResultError(cause),
  });
}

/**
 * Error class for getResponseError function
 */
export class GetResponseErrorError extends Error {
  override name = "GetResponseErrorError";
  _tag = "GetResponseErrorError";
  constructor(cause: unknown) {
    super("Failed to get error from JSON-RPC response with ox", {
      cause,
    });
  }
}

/**
 * Gets the error from a JSON-RPC response
 * @param response The response to get the error from
 * @returns An Effect that succeeds with the response error or undefined
 */
export function getResponseError(
  response: JsonRpcResponse
): Effect.Effect<JsonRpcError | undefined, GetResponseErrorError, never> {
  return Effect.try({
    try: () => Ox.JsonRpcResponse.getResponseError(response),
    catch: (cause) => new GetResponseErrorError(cause),
  });
}