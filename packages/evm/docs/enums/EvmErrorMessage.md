[@tevm/evm](../README.md) / [Exports](../modules.md) / EvmErrorMessage

# Enumeration: EvmErrorMessage

## Table of contents

### Enumeration Members

- [AUTHCALL\_NONZERO\_VALUEEXT](EvmErrorMessage.md#authcall_nonzero_valueext)
- [AUTHCALL\_UNSET](EvmErrorMessage.md#authcall_unset)
- [AUTH\_INVALID\_S](EvmErrorMessage.md#auth_invalid_s)
- [BLS\_12\_381\_FP\_NOT\_IN\_FIELD](EvmErrorMessage.md#bls_12_381_fp_not_in_field)
- [BLS\_12\_381\_INPUT\_EMPTY](EvmErrorMessage.md#bls_12_381_input_empty)
- [BLS\_12\_381\_INVALID\_INPUT\_LENGTH](EvmErrorMessage.md#bls_12_381_invalid_input_length)
- [BLS\_12\_381\_POINT\_NOT\_ON\_CURVE](EvmErrorMessage.md#bls_12_381_point_not_on_curve)
- [CODESIZE\_EXCEEDS\_MAXIMUM](EvmErrorMessage.md#codesize_exceeds_maximum)
- [CODESTORE\_OUT\_OF\_GAS](EvmErrorMessage.md#codestore_out_of_gas)
- [CREATE\_COLLISION](EvmErrorMessage.md#create_collision)
- [INITCODE\_SIZE\_VIOLATION](EvmErrorMessage.md#initcode_size_violation)
- [INSUFFICIENT\_BALANCE](EvmErrorMessage.md#insufficient_balance)
- [INTERNAL\_ERROR](EvmErrorMessage.md#internal_error)
- [INVALID\_BEGINSUB](EvmErrorMessage.md#invalid_beginsub)
- [INVALID\_BYTECODE\_RESULT](EvmErrorMessage.md#invalid_bytecode_result)
- [INVALID\_COMMITMENT](EvmErrorMessage.md#invalid_commitment)
- [INVALID\_EOF\_FORMAT](EvmErrorMessage.md#invalid_eof_format)
- [INVALID\_INPUTS](EvmErrorMessage.md#invalid_inputs)
- [INVALID\_INPUT\_LENGTH](EvmErrorMessage.md#invalid_input_length)
- [INVALID\_JUMP](EvmErrorMessage.md#invalid_jump)
- [INVALID\_JUMPSUB](EvmErrorMessage.md#invalid_jumpsub)
- [INVALID\_OPCODE](EvmErrorMessage.md#invalid_opcode)
- [INVALID\_PROOF](EvmErrorMessage.md#invalid_proof)
- [INVALID\_RETURNSUB](EvmErrorMessage.md#invalid_returnsub)
- [OUT\_OF\_GAS](EvmErrorMessage.md#out_of_gas)
- [OUT\_OF\_RANGE](EvmErrorMessage.md#out_of_range)
- [REFUND\_EXHAUSTED](EvmErrorMessage.md#refund_exhausted)
- [REVERT](EvmErrorMessage.md#revert)
- [STACK\_OVERFLOW](EvmErrorMessage.md#stack_overflow)
- [STACK\_UNDERFLOW](EvmErrorMessage.md#stack_underflow)
- [STATIC\_STATE\_CHANGE](EvmErrorMessage.md#static_state_change)
- [STOP](EvmErrorMessage.md#stop)
- [VALUE\_OVERFLOW](EvmErrorMessage.md#value_overflow)

## Enumeration Members

### AUTHCALL\_NONZERO\_VALUEEXT

• **AUTHCALL\_NONZERO\_VALUEEXT** = ``"attempting to execute AUTHCALL with nonzero external value"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:26

___

### AUTHCALL\_UNSET

• **AUTHCALL\_UNSET** = ``"attempting to AUTHCALL without AUTH set"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:25

___

### AUTH\_INVALID\_S

• **AUTH\_INVALID\_S** = ``"invalid Signature: s-values greater than secp256k1n/2 are considered invalid"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:27

___

### BLS\_12\_381\_FP\_NOT\_IN\_FIELD

• **BLS\_12\_381\_FP\_NOT\_IN\_FIELD** = ``"fp point not in field"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:31

___

### BLS\_12\_381\_INPUT\_EMPTY

• **BLS\_12\_381\_INPUT\_EMPTY** = ``"input is empty"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:30

___

### BLS\_12\_381\_INVALID\_INPUT\_LENGTH

• **BLS\_12\_381\_INVALID\_INPUT\_LENGTH** = ``"invalid input length"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:28

___

### BLS\_12\_381\_POINT\_NOT\_ON\_CURVE

• **BLS\_12\_381\_POINT\_NOT\_ON\_CURVE** = ``"point not on curve"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:29

___

### CODESIZE\_EXCEEDS\_MAXIMUM

• **CODESIZE\_EXCEEDS\_MAXIMUM** = ``"code size to deposit exceeds maximum code size"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:4

___

### CODESTORE\_OUT\_OF\_GAS

• **CODESTORE\_OUT\_OF\_GAS** = ``"code store out of gas"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:3

___

### CREATE\_COLLISION

• **CREATE\_COLLISION** = ``"create collision"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:13

___

### INITCODE\_SIZE\_VIOLATION

• **INITCODE\_SIZE\_VIOLATION** = ``"initcode exceeds max initcode size"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:23

___

### INSUFFICIENT\_BALANCE

• **INSUFFICIENT\_BALANCE** = ``"insufficient balance"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:17

___

### INTERNAL\_ERROR

• **INTERNAL\_ERROR** = ``"internal error"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:12

___

### INVALID\_BEGINSUB

• **INVALID\_BEGINSUB** = ``"invalid BEGINSUB"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:18

___

### INVALID\_BYTECODE\_RESULT

• **INVALID\_BYTECODE\_RESULT** = ``"invalid bytecode deployed"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:21

___

### INVALID\_COMMITMENT

• **INVALID\_COMMITMENT** = ``"kzg commitment does not match versioned hash"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:32

___

### INVALID\_EOF\_FORMAT

• **INVALID\_EOF\_FORMAT** = ``"invalid EOF format"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:22

___

### INVALID\_INPUTS

• **INVALID\_INPUTS** = ``"kzg inputs invalid"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:33

___

### INVALID\_INPUT\_LENGTH

• **INVALID\_INPUT\_LENGTH** = ``"invalid input length"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:24

___

### INVALID\_JUMP

• **INVALID\_JUMP** = ``"invalid JUMP"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:7

___

### INVALID\_JUMPSUB

• **INVALID\_JUMPSUB** = ``"invalid JUMPSUB"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:20

___

### INVALID\_OPCODE

• **INVALID\_OPCODE** = ``"invalid opcode"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:8

___

### INVALID\_PROOF

• **INVALID\_PROOF** = ``"kzg proof invalid"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:34

___

### INVALID\_RETURNSUB

• **INVALID\_RETURNSUB** = ``"invalid RETURNSUB"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:19

___

### OUT\_OF\_GAS

• **OUT\_OF\_GAS** = ``"out of gas"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:2

___

### OUT\_OF\_RANGE

• **OUT\_OF\_RANGE** = ``"value out of range"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:9

___

### REFUND\_EXHAUSTED

• **REFUND\_EXHAUSTED** = ``"refund exhausted"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:15

___

### REVERT

• **REVERT** = ``"revert"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:10

___

### STACK\_OVERFLOW

• **STACK\_OVERFLOW** = ``"stack overflow"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:6

___

### STACK\_UNDERFLOW

• **STACK\_UNDERFLOW** = ``"stack underflow"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:5

___

### STATIC\_STATE\_CHANGE

• **STATIC\_STATE\_CHANGE** = ``"static state change"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:11

___

### STOP

• **STOP** = ``"stop"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:14

___

### VALUE\_OVERFLOW

• **VALUE\_OVERFLOW** = ``"value overflow"``

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.1.0/node_modules/@ethereumjs/evm/dist/esm/exceptions.d.ts:16
