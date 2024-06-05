[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [utils](../README.md) / AsyncEventEmitter

# Class: AsyncEventEmitter\<T\>

## Extends

- `EventEmitter`

## Type parameters

• **T** *extends* `EventMap`

## Constructors

### new AsyncEventEmitter()

> **new AsyncEventEmitter**\<`T`\>(`options`?): [`AsyncEventEmitter`](AsyncEventEmitter.md)\<`T`\>

#### Parameters

• **options?**: `EventEmitterOptions`

#### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)\<`T`\>

#### Inherited from

`EventEmitter.constructor`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:110

## Properties

### beforeOrAfter

> `private` **beforeOrAfter**: `any`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:21

***

### captureRejectionSymbol

> `static` `readonly` **captureRejectionSymbol**: *typeof* [`captureRejectionSymbol`](AsyncEventEmitter.md#capturerejectionsymbol)

Value: `Symbol.for('nodejs.rejection')`

See how to write a custom `rejection handler`.

#### Since

v13.4.0, v12.16.0

#### Inherited from

`EventEmitter.captureRejectionSymbol`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:402

***

### captureRejections

> `static` **captureRejections**: `boolean`

Value: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Change the default `captureRejections` option on all new `EventEmitter` objects.

#### Since

v13.4.0, v12.16.0

#### Inherited from

`EventEmitter.captureRejections`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:409

***

### defaultMaxListeners

> `static` **defaultMaxListeners**: `number`

By default, a maximum of `10` listeners can be registered for any single
event. This limit can be changed for individual `EventEmitter` instances
using the `emitter.setMaxListeners(n)` method. To change the default
for _all_`EventEmitter` instances, the `events.defaultMaxListeners`property can be used. If this value is not a positive number, a `RangeError`is thrown.

Take caution when setting the `events.defaultMaxListeners` because the
change affects _all_`EventEmitter` instances, including those created before
the change is made. However, calling `emitter.setMaxListeners(n)` still has
precedence over `events.defaultMaxListeners`.

This is not a hard limit. The `EventEmitter` instance will allow
more listeners to be added but will output a trace warning to stderr indicating
that a "possible EventEmitter memory leak" has been detected. For any single`EventEmitter`, the `emitter.getMaxListeners()` and `emitter.setMaxListeners()`methods can be used to
temporarily avoid this warning:

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

The `--trace-warnings` command-line flag can be used to display the
stack trace for such warnings.

The emitted warning can be inspected with `process.on('warning')` and will
have the additional `emitter`, `type`, and `count` properties, referring to
the event emitter instance, the event's name and the number of attached
listeners, respectively.
Its `name` property is set to `'MaxListenersExceededWarning'`.

#### Since

v0.11.2

#### Inherited from

`EventEmitter.defaultMaxListeners`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:446

***

### errorMonitor

> `static` `readonly` **errorMonitor**: *typeof* [`errorMonitor`](AsyncEventEmitter.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`events. Listeners installed using this symbol are called before the regular`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an`'error'` event is emitted. Therefore, the process will still crash if no
regular `'error'` listener is installed.

#### Since

v13.6.0, v12.17.0

#### Inherited from

`EventEmitter.errorMonitor`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:395

## Methods

### `[captureRejectionSymbol]`()?

> `optional` **\[captureRejectionSymbol\]**(`error`, `event`, ...`args`): `void`

#### Parameters

• **error**: `Error`

• **event**: `string`

• ...**args**: `any`[]

#### Returns

`void`

#### Inherited from

`EventEmitter.[captureRejectionSymbol]`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:112

***

### `[captureRejectionSymbol]`()?

> `optional` **\[captureRejectionSymbol\]**\<`K`\>(`error`, `event`, ...`args`): `void`

#### Type parameters

• **K**

#### Parameters

• **error**: `Error`

• **event**: `string` \| `symbol`

• ...**args**: `AnyRest`

#### Returns

`void`

#### Inherited from

`EventEmitter.[captureRejectionSymbol]`

#### Source

node\_modules/.pnpm/@types+node@20.14.1/node\_modules/@types/node/events.d.ts:565

***

### addListener()

> **addListener**\<`E`\>(`event`, `listener`): `this`

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

• **listener**: `T`\[`E`\]

#### Returns

`this`

#### Overrides

`EventEmitter.addListener`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:23

***

### after()

> **after**\<`E`\>(`event`, `target`, `listener`): `this`

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

• **target**: `T`\[`E`\]

• **listener**: `T`\[`E`\]

#### Returns

`this`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:20

***

### before()

> **before**\<`E`\>(`event`, `target`, `listener`): `this`

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

• **target**: `T`\[`E`\]

• **listener**: `T`\[`E`\]

#### Returns

`this`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:19

***

### emit()

> **emit**\<`E`\>(`event`, ...`args`): `boolean`

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

• ...**args**: `Parameters`\<`T`\[`E`\]\>

#### Returns

`boolean`

#### Overrides

`EventEmitter.emit`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:16

***

### eventNames()

> **eventNames**(): keyof `T` & `string`[]

#### Returns

keyof `T` & `string`[]

#### Overrides

`EventEmitter.eventNames`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:28

***

### first()

> **first**\<`E`\>(`event`, `listener`): `this`

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

• **listener**: `T`\[`E`\]

#### Returns

`this`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:18

***

### getMaxListeners()

> **getMaxListeners**(): `number`

#### Returns

`number`

#### Overrides

`EventEmitter.getMaxListeners`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:31

***

### listenerCount()

> **listenerCount**(`event`): `number`

#### Parameters

• **event**: keyof `T` & `string`

#### Returns

`number`

#### Overrides

`EventEmitter.listenerCount`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:30

***

### listeners()

> **listeners**\<`E`\>(`event`): `T`\[`E`\][]

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

#### Returns

`T`\[`E`\][]

#### Overrides

`EventEmitter.listeners`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:29

***

### off()

#### off(eventName, listener)

> **off**(`eventName`, `listener`): `this`

Alias for `emitter.removeListener()`.

##### Parameters

• **eventName**: `string` \| `symbol`

• **listener**

##### Returns

`this`

##### Inherited from

`EventEmitter.off`

##### Since

v10.0.0

##### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:695

#### off(eventName, listener)

> **off**\<`K`\>(`eventName`, `listener`): `this`

Alias for `emitter.removeListener()`.

##### Type parameters

• **K**

##### Parameters

• **eventName**: `Key`\<`K`, `T`\>

• **listener**: `Listener`\<`K`, `T`, (...`args`) => `void`\>

##### Returns

`this`

##### Inherited from

`EventEmitter.off`

##### Since

v10.0.0

##### Source

node\_modules/.pnpm/@types+node@20.14.1/node\_modules/@types/node/events.d.ts:720

***

### on()

> **on**\<`E`\>(`event`, `listener`): `this`

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

• **listener**: `T`\[`E`\]

#### Returns

`this`

#### Overrides

`EventEmitter.on`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:22

***

### once()

> **once**\<`E`\>(`event`, `listener`): `this`

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

• **listener**: `T`\[`E`\]

#### Returns

`this`

#### Overrides

`EventEmitter.once`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:17

***

### prependListener()

> **prependListener**\<`E`\>(`event`, `listener`): `this`

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

• **listener**: `T`\[`E`\]

#### Returns

`this`

#### Overrides

`EventEmitter.prependListener`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:24

***

### prependOnceListener()

> **prependOnceListener**\<`E`\>(`event`, `listener`): `this`

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

• **listener**: `T`\[`E`\]

#### Returns

`this`

#### Overrides

`EventEmitter.prependOnceListener`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:25

***

### rawListeners()

#### rawListeners(eventName)

> **rawListeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

##### Parameters

• **eventName**: `string` \| `symbol`

##### Returns

`Function`[]

##### Inherited from

`EventEmitter.rawListeners`

##### Since

v9.4.0

##### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:766

#### rawListeners(eventName)

> **rawListeners**\<`K`\>(`eventName`): `Listener`\<`K`, `T`, `Function`\>[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

##### Type parameters

• **K**

##### Parameters

• **eventName**: `Key`\<`K`, `T`\>

##### Returns

`Listener`\<`K`, `T`, `Function`\>[]

##### Inherited from

`EventEmitter.rawListeners`

##### Since

v9.4.0

##### Source

node\_modules/.pnpm/@types+node@20.14.1/node\_modules/@types/node/events.d.ts:791

***

### removeAllListeners()

> **removeAllListeners**(`event`?): `this`

#### Parameters

• **event?**: keyof `T` & `string`

#### Returns

`this`

#### Overrides

`EventEmitter.removeAllListeners`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:26

***

### removeListener()

> **removeListener**\<`E`\>(`event`, `listener`): `this`

#### Type parameters

• **E** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `E` & `string`

• **listener**: `T`\[`E`\]

#### Returns

`this`

#### Overrides

`EventEmitter.removeListener`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:27

***

### setMaxListeners()

> **setMaxListeners**(`maxListeners`): `this`

#### Parameters

• **maxListeners**: `number`

#### Returns

`this`

#### Overrides

`EventEmitter.setMaxListeners`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/asyncEventEmitter.d.ts:32

***

### addAbortListener()

`Experimental`

> `static` **addAbortListener**(`signal`, `resource`): `Disposable`

Listens once to the `abort` event on the provided `signal`.

Listening to the `abort` event on abort signals is unsafe and may
lead to resource leaks since another third party with the signal can
call `e.stopImmediatePropagation()`. Unfortunately Node.js cannot change
this since it would violate the web standard. Additionally, the original
API makes it easy to forget to remove listeners.

This API allows safely using `AbortSignal`s in Node.js APIs by solving these
two issues by listening to the event such that `stopImmediatePropagation` does
not prevent the listener from running.

Returns a disposable so that it may be unsubscribed from more easily.

```js
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

#### Parameters

• **signal**: `AbortSignal`

• **resource**

#### Returns

`Disposable`

Disposable that removes the `abort` listener.

#### Inherited from

`EventEmitter.addAbortListener`

#### Since

v20.5.0

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:387

***

### getEventListeners()

> `static` **getEventListeners**(`emitter`, `name`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listeners` on
the emitter.

For `EventTarget`s this is the only way to get the event listeners for the
event target. This is useful for debugging and diagnostic purposes.

```js
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

#### Parameters

• **emitter**: `EventEmitter`\<`DefaultEventMap`\> \| `_DOMEventTarget`

• **name**: `string` \| `symbol`

#### Returns

`Function`[]

#### Inherited from

`EventEmitter.getEventListeners`

#### Since

v15.2.0, v14.17.0

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:308

***

### getMaxListeners()

> `static` **getMaxListeners**(`emitter`): `number`

Returns the currently set max amount of listeners.

For `EventEmitter`s this behaves exactly the same as calling `.getMaxListeners` on
the emitter.

For `EventTarget`s this is the only way to get the max event listeners for the
event target. If the number of event handlers on a single EventTarget exceeds
the max set, the EventTarget will print a warning.

```js
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

#### Parameters

• **emitter**: `EventEmitter`\<`DefaultEventMap`\> \| `_DOMEventTarget`

#### Returns

`number`

#### Inherited from

`EventEmitter.getMaxListeners`

#### Since

v19.9.0

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:337

***

### ~~listenerCount()~~

> `static` **listenerCount**(`emitter`, `eventName`): `number`

A class method that returns the number of listeners for the given `eventName`registered on the given `emitter`.

```js
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

#### Parameters

• **emitter**: `EventEmitter`\<`DefaultEventMap`\>

The emitter to query

• **eventName**: `string` \| `symbol`

The event name

#### Returns

`number`

#### Inherited from

`EventEmitter.listenerCount`

#### Since

v0.9.12

#### Deprecated

Since v3.2.0 - Use `listenerCount` instead.

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:280

***

### on()

> `static` **on**(`emitter`, `eventName`, `options`?): `AsyncIterableIterator`\<`any`\>

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // The execution of this inner block is synchronous and it
  // processes one event at a time (even with await). Do not use
  // if concurrent execution is required.
  console.log(event); // prints ['bar'] [42]
}
// Unreachable here
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An `AbortSignal` can be used to cancel waiting on events:

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

#### Parameters

• **emitter**: `EventEmitter`\<`DefaultEventMap`\>

• **eventName**: `string`

The name of the event being listened for

• **options?**: `StaticEventEmitterOptions`

#### Returns

`AsyncIterableIterator`\<`any`\>

that iterates `eventName` events emitted by the `emitter`

#### Inherited from

`EventEmitter.on`

#### Since

v13.6.0, v12.16.0

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:258

***

### once()

#### once(emitter, eventName, options)

> `static` **once**(`emitter`, `eventName`, `options`?): `Promise`\<`any`[]\>

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special`'error'` event
semantics and does not listen to the `'error'` event.

```js
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

The special handling of the `'error'` event is only used when `events.once()`is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

An `AbortSignal` can be used to cancel waiting for the event:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Abort waiting for the event
ee.emit('foo'); // Prints: Waiting for the event was canceled!
```

##### Parameters

• **emitter**: `_NodeEventTarget`

• **eventName**: `string` \| `symbol`

• **options?**: `StaticEventEmitterOptions`

##### Returns

`Promise`\<`any`[]\>

##### Inherited from

`EventEmitter.once`

##### Since

v11.13.0, v10.16.0

##### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:193

#### once(emitter, eventName, options)

> `static` **once**(`emitter`, `eventName`, `options`?): `Promise`\<`any`[]\>

##### Parameters

• **emitter**: `_DOMEventTarget`

• **eventName**: `string`

• **options?**: `StaticEventEmitterOptions`

##### Returns

`Promise`\<`any`[]\>

##### Inherited from

`EventEmitter.once`

##### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:198

***

### setMaxListeners()

> `static` **setMaxListeners**(`n`?, ...`eventTargets`?): `void`

```js
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

#### Parameters

• **n?**: `number`

A non-negative number. The maximum number of listeners per `EventTarget` event.

• ...**eventTargets?**: (`EventEmitter`\<`DefaultEventMap`\> \| `_DOMEventTarget`)[]

#### Returns

`void`

#### Inherited from

`EventEmitter.setMaxListeners`

#### Since

v15.4.0

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/events.d.ts:352
