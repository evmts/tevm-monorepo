import type { IncomingMessage, ServerResponse } from 'http';

export function createHTTPHandler(rpc: TevmRpc) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      let jsonBody: JsonRpcRequest
      try {
        jsonBody = JSON.parse(body);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        const error: JsonRpcErrorResponse = {
          id: 'unknown',
          method: 'unknown',
          jsonrpc: '2.0',
          error: {
            code: 500,
            message: 'Invalid jsonrpc request: Unable to parse json',
          }
        }
        res.end(JSON.stringify(error))
        return
      }

      // Verify if it's a valid JSON RPC 2.0 request
      if (jsonBody.jsonrpc !== '2.0') {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        const error: JsonRpcErrorResponse = {
          id: 'unknown',
          method: 'unknown',
          jsonrpc: '2.0',
          error: {
            code: 500,
            message: `Invalid jsonrpc request: Invalid schema ${jsonBody.jsonrpc}`,
          }
        }
        res.end(JSON.stringify(error))
        return
      }

      if (jsonBody.method === '' || typeof jsonBody.method !== 'string') {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        const error: JsonRpcErrorResponse = {
          id: 'unknown',
          method: 'unknown',
          jsonrpc: '2.0',
          error: {
            code: 500,
            message: 'Invalid jsonrpc request',
          }
        }
        res.end(JSON.stringify(error))
        return
      }

      const handler = rpc[jsonBody.method]

      if (!handler) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        const error: JsonRpcErrorResponse = {
          id: jsonBody.id,
          method: jsonBody.method,
          jsonrpc: jsonBody.jsonrpc,
          error: {
            code: 404,
            message: `Request method ${jsonBody.method} not supported`,
          }
        }
        res.end(JSON.stringify(error))
        return
      }

      try {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(handler(jsonBody)))
        return
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        const error: JsonRpcErrorResponse = {
          id: jsonBody.id,
          method: jsonBody.method,
          jsonrpc: jsonBody.jsonrpc,
          error: {
            code: 500,
            message: `Internal server error`,
          }
        }
        res.end(JSON.stringify(error))
        return
      }
    });
  };
}
