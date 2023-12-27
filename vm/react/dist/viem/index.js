import { parse, stringify } from 'superjson';
import { waitForTransactionReceipt } from 'viem/actions';

// src/viem/tevmViemExtension.js
var tevmViemExtension = () => {
  return (client) => {
    const tevmRequest = async (request) => {
      return (
        /** @type {any} */
        parse(
          JSON.stringify(
            await client.request({
              method: (
                /** @type {any}*/
                request.method
              ),
              params: (
                /** @type {any}*/
                JSON.parse(stringify(request.params))
              )
            })
          )
        )
      );
    };
    return {
      tevmRequest,
      runScript: async (action) => {
        return (
          /** @type {any} */
          tevmRequest({
            method: "tevm_script",
            params: (
              /** @type any*/
              action
            )
          })
        );
      },
      putAccount: async (action) => {
        return tevmRequest({
          method: "tevm_putAccount",
          params: action
        });
      },
      putContractCode: async (action) => {
        return tevmRequest({
          method: "tevm_putContractCode",
          params: action
        });
      },
      runCall: async (action) => {
        return tevmRequest({
          method: "tevm_call",
          params: action
        });
      },
      runContractCall: async (action) => {
        return (
          /** @type {any} */
          tevmRequest({
            method: "tevm_contractCall",
            params: (
              /** @type {any}*/
              action
            )
          })
        );
      }
    };
  };
};
var tevmViemExtensionOptimistic = () => {
  const decorator = (client) => {
    return {
      writeContractOptimistic: async function* (action) {
        const errors = [];
        const getErrorsIfExist = () => errors.length > 0 ? { errors } : {};
        const tevmRequest = async (request) => {
          return parse(
            JSON.stringify(
              await client.request({
                method: request.method,
                params: JSON.parse(stringify(request.params))
              })
            )
          );
        };
        const writeContractResult = client.writeContract(action);
        const optimisticResult = tevmRequest({
          method: "tevm_contractCall",
          params: (
            /** @type {any}*/
            action
          )
        });
        try {
          yield {
            success: true,
            tag: "OPTIMISTIC_RESULT",
            data: (
              /** @type {any}*/
              await optimisticResult
            ),
            ...getErrorsIfExist()
          };
        } catch (error) {
          errors.push(
            /** @type {any}*/
            error
          );
          yield {
            success: false,
            tag: "OPTIMISTIC_RESULT",
            error: (
              /** @type {any} */
              error
            ),
            ...getErrorsIfExist()
          };
        }
        let hash = void 0;
        try {
          hash = await writeContractResult;
          yield {
            success: true,
            tag: "HASH",
            data: (
              /** @type {any}*/
              hash
            ),
            ...getErrorsIfExist()
          };
        } catch (error) {
          errors.push(
            /** @type {any}*/
            error
          );
          yield {
            success: false,
            tag: "HASH",
            error: (
              /** @type {any}*/
              error
            ),
            ...getErrorsIfExist()
          };
        }
        if (hash) {
          try {
            const receipt = await waitForTransactionReceipt(
              /** @type{any}*/
              client,
              { hash }
            );
            yield {
              success: true,
              tag: "RECEIPT",
              data: (
                /** @type {any} */
                receipt
              ),
              ...getErrorsIfExist()
            };
          } catch (error) {
            errors.push(
              /** @type {any}*/
              error
            );
            yield {
              success: false,
              tag: "RECEIPT",
              error: (
                /** @type {any} */
                error
              ),
              errors,
              ...getErrorsIfExist()
            };
          }
        }
        return;
      }
    };
  };
  return decorator;
};

export { tevmViemExtension, tevmViemExtensionOptimistic };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map