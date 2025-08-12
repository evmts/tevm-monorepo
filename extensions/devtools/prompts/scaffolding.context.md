<devtoolsScaffoldingContext>
  <intro>The following provides context and integration guidance for scaffolding the devtools extension. It is not exhaustive, but aims to enable a consistent, comprehensive first implementation.</intro>
  <objective>
    <text>Single devtools package in `extensions/devtools` that:</text>
    <item>Instruments viem, wagmi, ethers, and raw EIP‑1193 without mutating originals (except optional `window.ethereum` override).</item>
    <item>Is idempotent, deduped across overlap (wagmi + injected).</item>
    <item>Publishes to a global event bus for any UI to subscribe.</item>
    <item>Ships a React widget from the package itself (`@tevm/devtools/react`) that consumers render to get the dock/panel; examples import this widget and focus on wrapping providers.</item>
  </objective>

  <coreBehavior>
    <feature name="withTevmDevtools">
      <item>`withTevmDevtools(input, opts?)`:</item>
      <item>Detects input type; returns a decorated drop‑in equivalent.</item>
      <item>Uses a global event bus to publish request/response/error.</item>
      <item>Idempotent via `Symbol.for('tevm.devtools.wrap')`.</item>
    </feature>
    <feature name="installWindowEthereumDevtools">
      <item>`installWindowEthereumDevtools(opts?)`: optional early override of `window.ethereum.request` and `window.ethereum.providers[]`.</item>
    </feature>
    <feature name="devtoolsBus">
      <item>`devtoolsBus()`: event-based API for UI; history buffer.</item>
    </feature>
    <feature name="reactUI">
      <item>React UI:</item>
      <item>`DevtoolsWidget`: floating button → expands a dock (panel or iframe) that subscribes to `devtoolsBus()` and renders live records.</item>
      <item>Exported via subpath: `import { DevtoolsWidget } from '@tevm/devtools/react'`.</item>
    </feature>
  </coreBehavior>

  <devFlow>
    <text>Adopt an example-first, incremental development flow:</text>
    <item>Start by scaffolding the React example so we can demonstrate working functionality immediately.</item>
    <item>Add the package build skeleton early to produce artifacts, but keep runtime logic minimal.</item>
    <item>Introduce the core event bus and a minimal `DevtoolsWidget` that expands and lists records.</item>
    <item>Implement EIP‑1193 wrapper, `installWindowEthereumDevtools`, and `withTevmDevtools` v1; wire them into the example to show value end-to-end.</item>
    <item>Iterate with additional providers (viem, wagmi, ethers) and strengthen idempotency/dedupe, keeping examples runnable at each step.</item>
  </devFlow>

  <directoryStructure>
    <directory name="extensions/devtools/">
      <directory name="src/">
        <file>index.ts</file>
        <file>withTevmDevtools.ts</file>
        <file>installWindowEthereumDevtools.ts</file>
        <directory name="react/">
          <file>DevtoolsWidget.tsx</file>
          <file>index.ts</file>
          <file>styles.css (optional)</file>
        </directory>
        <directory name="internal/">
          <directory name="common/">
            <file>types.ts</file>
            <file>constants.ts</file>
            <file>eventBus.ts</file>
            <file>guards.ts</file>
            <file>ids.ts</file>
            <file>redaction.ts (optional stub)</file>
            <file>decorateRequestEip1193.ts (common Proxy wrapper for any `{ request({method, params}) }`)</file>
          </directory>
          <directory name="eip1193/">
            <file>decorateEip1193.ts (delegates to common helper)</file>
          </directory>
          <directory name="viem/">
            <file>decorateViemTransport.ts (uses common helper + Proxy/Reflect)</file>
            <file>decorateViemClient.ts</file>
          </directory>
          <directory name="wagmi/">
            <file>decorateWagmiConfig.ts</file>
          </directory>
          <directory name="ethers/">
            <file>decorateEthersInjected.ts</file>
            <file>decorateJsonRpcProvider.ts</file>
          </directory>
        </directory>
      </directory>
      <directory name="examples/react/">
        <file>README.md</file>
        <directory name="src/">(per‑integration pages demonstrating wrapping; they all render the in‑package `DevtoolsWidget`)</directory>
      </directory>
    </directory>
  </directoryStructure>

  <internalImplementation>
    <file path="src/internal/common/types.ts">
      <code language="ts"><![CDATA[
export type TevmRecord = {
  id: string;
  ts: number;
  method: string;
  params?: any;
  result?: any;
  error?: string;
  durationMs?: number;
  chainId?: number;
  providerId?: string;
  context?: Record<string, any>;
};

export type CommonOpts = {}; // for optional later usage
]]></code>
    </file>

    <file path="src/internal/common/constants.ts">
      <code language="ts"><![CDATA[
export const BUS_KEY = '__TEVM_DEVTOOLS_BUS__';
export const WRAP_TAG = Symbol.for('tevm.devtools.wrap');
export const EVENT_RECORD = 'tevm:record';
export const EVENT_CLEAR = 'tevm:clear';
export const MAX_BUFFER = 1000;
]]></code>
    </file>

    <file path="src/internal/common/eventBus.ts">
      <code language="ts"><![CDATA[
import { BUS_KEY, EVENT_CLEAR, EVENT_RECORD, MAX_BUFFER } from './constants';
import type { TevmRecord } from './types';

export type DevtoolsBus = {
  publish: (r: TevmRecord) => void;
  subscribe: (cb: (r: TevmRecord) => void) => () => void;
  history: () => TevmRecord[];
  clear: () => void;
};

function createBus(): DevtoolsBus {
  const target = new EventTarget();
  const buf: TevmRecord[] = [];
  return {
    publish: (r) => {
      buf.push(r);
      if (buf.length > MAX_BUFFER) buf.shift();
      target.dispatchEvent(new CustomEvent(EVENT_RECORD, { detail: r }));
    },
    subscribe: (cb) => {
      const fn = (e: Event) => cb((e as CustomEvent<TevmRecord>).detail);
      target.addEventListener(EVENT_RECORD, fn);
      return () => target.removeEventListener(EVENT_RECORD, fn);
    },
    history: () => buf.slice(),
    clear: () => {
      buf.length = 0;
      target.dispatchEvent(new CustomEvent(EVENT_CLEAR));
    },
  };
}

export function devtoolsBus(): DevtoolsBus {
  if (typeof window === 'undefined') {
    return { publish: () => {}, subscribe: () => () => {}, history: () => [], clear: () => {} };
  }
  const g = window as any;
  if (!g[BUS_KEY]) g[BUS_KEY] = createBus();
  return g[BUS_KEY] as DevtoolsBus;
}
]]></code>
    </file>

    <file path="src/internal/common/ids.ts">
      <code language="ts"><![CDATA[
export const newId = () => (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
export const newProviderId = (prefix: string) => `${prefix}:${Math.random().toString(36).slice(2)}`;
]]></code>
    </file>

    <file path="src/internal/common/guards.ts">
      <code language="ts"><![CDATA[
export const isEip1193 = (x: any) => !!x && typeof x.request === 'function';
export const isViemTransport = (x: any) => typeof x === 'function' && 'length' in x;
export const isViemClient = (x: any) => !!x?.transport?.request;
export const isWagmiConfig = (x: any) => !!x?.connectors || !!x?.transports;
export const isEthersJsonRpcProvider = (x: any) => !!x?.send && !!x?._isProvider;
]]></code>
    </file>

    <file path="src/internal/common/decorateRequestEip1193.ts">
      <code language="ts"><![CDATA[
import { devtoolsBus } from './eventBus';
import { newId, newProviderId } from './ids';
import { WRAP_TAG } from './constants';
import type { CommonOpts } from './types';

// Decorates any object that implements EIP-1193-style request({ method, params? })
export function decorateRequestEip1193<T extends { request: (a: { method: string; params?: any }) => Promise<any> }>(
  obj: T,
  name = 'eip1193',
  _opts?: CommonOpts
): T {
  if (!obj || (obj as any)[WRAP_TAG]) return obj;
  const bus = devtoolsBus();
  const providerId = newProviderId(name);

  const proxy = new Proxy(obj as any, {
    get(target, prop, receiver) {
      if (prop === 'request') {
        return async (args: { method: string; params?: any }) => {
          const start = performance.now();
          try {
            const result = await Reflect.apply(target.request, target, [args]);
            bus.publish({ id: newId(), ts: Date.now(), method: args.method, params: args.params, result, durationMs: performance.now() - start, providerId });
            return result;
          } catch (err: any) {
            bus.publish({ id: newId(), ts: Date.now(), method: args.method, params: args.params, error: err?.message ?? String(err), durationMs: performance.now() - start, providerId });
            throw err;
          }
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });

  (proxy as any)[WRAP_TAG] = true;
  return proxy as T;
}
]]></code>
    </file>

    <file path="src/internal/eip1193/decorateEip1193.ts">
      <code language="ts"><![CDATA[
import type { CommonOpts } from '../common/types';
import { decorateRequestEip1193 } from '../common/decorateRequestEip1193';

export function decorateEip1193<T extends { request: Function }>(provider: T, name = 'eip1193', opts?: CommonOpts): T {
  return decorateRequestEip1193(provider as any, name, opts);
}
]]></code>
    </file>

    <file path="src/internal/viem/decorateViemTransport.ts">
      <code language="ts"><![CDATA[
import type { CommonOpts } from '../common/types';
import { decorateRequestEip1193 } from '../common/decorateRequestEip1193';

// viem Transport is a factory → returns object with request({ method, params })
export function decorateViemTransport<T extends import('viem').Transport>(base: T, opts?: CommonOpts): T {
  return ((initOpts: any) => {
    const t = (base as any)(initOpts);
    if (!t?.request) return t;
    // Reuse EIP-1193 request decorator since signature matches
    return decorateRequestEip1193(t, 'viem:transport', opts);
  }) as unknown as T;
}
]]></code>
    </file>

    <file path="src/internal/viem/decorateViemClient.ts">
      <code language="ts"><![CDATA[
import type { CommonOpts } from '../common/types';
import { decorateViemTransport } from './decorateViemTransport';

export function decorateViemClient<T extends { transport: any }>(client: T, opts?: CommonOpts): T {
  if (!client?.transport) return client;
  const transport = decorateViemTransport(client.transport, opts);
  return { ...client, transport } as T;
}
]]></code>
    </file>

    <file path="src/internal/wagmi/decorateWagmiConfig.ts">
      <code language="ts"><![CDATA[
import type { CommonOpts } from '../common/types';
import { decorateViemTransport } from '../viem/decorateViemTransport';
import { decorateEip1193 } from '../eip1193/decorateEip1193';

export function decorateWagmiConfig(cfg: any, opts?: CommonOpts) {
  const transports = Object.fromEntries(
    Object.entries(cfg.transports ?? {}).map(([k, t]: any) => [k, decorateViemTransport(t, opts)])
  );

  const connectors = (cfg.connectors ?? []).map((c: any) =>
    new Proxy(c, {
      get(target, prop, receiver) {
        if (prop === 'getProvider') {
          return async (...a: any[]) => {
            const p = await target.getProvider(...a);
            return decorateEip1193(p, `wagmi:${target.id ?? 'connector'}`, opts);
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    })
  );

  return { ...cfg, transports, connectors };
}
]]></code>
    </file>

    <file path="src/internal/ethers/decorateEthersInjected.ts">
      <code language="ts"><![CDATA[
import { decorateEip1193 } from '../eip1193/decorateEip1193';
export const decorateEthersInjected = (eip1193: any) => decorateEip1193(eip1193, 'ethers:injected');
]]></code>
    </file>

    <file path="src/internal/ethers/decorateJsonRpcProvider.ts">
      <code language="ts"><![CDATA[
import { devtoolsBus } from '../common/eventBus';
import { newId, newProviderId } from '../common/ids';

export function decorateJsonRpcProvider<T extends { send: Function }>(prov: T): T {
  const bus = devtoolsBus();
  const providerId = newProviderId('ethers:jsonrpc');
  return new Proxy(prov, {
    get(target, prop, receiver) {
      if (prop === 'send') {
        return async (method: string, params?: any[]) => {
          const start = performance.now();
          try {
            const res = await (target as any).send(method, params);
            bus.publish({ id: newId(), ts: Date.now(), method, params, result: res, durationMs: performance.now() - start, providerId });
            return res;
          } catch (e: any) {
            bus.publish({ id: newId(), ts: Date.now(), method, params, error: e?.message ?? String(e), durationMs: performance.now() - start, providerId });
            throw e;
          }
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}
]]></code>
    </file>

    <file path="src/withTevmDevtools.ts">
      <code language="ts"><![CDATA[
import type { CommonOpts } from './internal/common/types';
import { isWagmiConfig, isViemClient, isViemTransport, isEip1193, isEthersJsonRpcProvider } from './internal/common/guards';
import { decorateWagmiConfig } from './internal/wagmi/decorateWagmiConfig';
import { decorateViemTransport } from './internal/viem/decorateViemTransport';
import { decorateViemClient } from './internal/viem/decorateViemClient';
import { decorateEip1193 } from './internal/eip1193/decorateEip1193';
import { decorateJsonRpcProvider } from './internal/ethers/decorateJsonRpcProvider';

export function withTevmDevtools(input: any, opts: CommonOpts = {}): any {
  if (isWagmiConfig(input)) return decorateWagmiConfig(input, opts);
  if (isViemTransport(input)) return decorateViemTransport(input, opts);
  if (isViemClient(input)) return decorateViemClient(input, opts);
  if (isEthersJsonRpcProvider(input)) return decorateJsonRpcProvider(input);
  if (isEip1193(input)) return decorateEip1193(input, 'eip1193', opts);

  return input;
}
]]></code>
    </file>

    <file path="src/installWindowEthereumDevtools.ts">
      <code language="ts"><![CDATA[
import { decorateEip1193 } from './internal/eip1193/decorateEip1193';

export function installWindowEthereumDevtools(opts?: { includeMultiInjected?: boolean }) {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (w.ethereum && !w.ethereum.__tevmWrapped) {
    w.ethereum = decorateEip1193(w.ethereum, 'injected:window.ethereum');
    w.ethereum.__tevmWrapped = true;
  }
  if (opts?.includeMultiInjected && Array.isArray(w.ethereum?.providers)) {
    w.ethereum.providers = w.ethereum.providers.map((p: any) =>
      p?.__tevmWrapped ? p : decorateEip1193(p, 'injected:multi')
    );
  }
}
]]></code>
    </file>

    <file path="src/index.ts">
      <code language="ts"><![CDATA[
export { withTevmDevtools } from './withTevmDevtools';
export { installWindowEthereumDevtools } from './installWindowEthereumDevtools';
export { devtoolsBus } from './internal/common/eventBus';
export type { TevmRecord, CommonOpts } from './internal/common/types';
]]></code>
    </file>

    <file path="src/react/DevtoolsWidget.tsx (high‑level sketch)">
      <code language="tsx"><![CDATA[
import React from 'react';
import { devtoolsBus } from '../internal/common/eventBus';
import type { TevmRecord } from '../internal/common/types';

export function DevtoolsWidget() {
  const [open, setOpen] = React.useState(false);
  const [records, setRecords] = React.useState<TevmRecord[]>(() => devtoolsBus().history());

  React.useEffect(() => {
    const unsub = devtoolsBus().subscribe((r) => setRecords((prev) => [...prev, r].slice(-1000)]);
    return unsub;
  }, []);

  return (
    <>
      <button
        style={{ position: 'fixed', bottom: 12, right: 12, zIndex: 99999 }}
        onClick={() => setOpen((o) => !o)}
      >
        TEVM
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: 56, right: 12, width: 420, height: 360, background: '#111', color: '#eee', overflow: 'auto', borderRadius: 8, padding: 8, zIndex: 99998 }}>
          {records.slice().reverse().map((r) => (
            <div key={r.id} style={{ borderBottom: '1px solid #333', padding: '6px 0' }}>
              <div style={{ fontWeight: 600 }}>{r.method}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {r.error ? `error: ${r.error}` : `ok (${Math.round(r.durationMs ?? 0)}ms)`}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
]]></code>
    </file>

    <file path="src/react/index.ts">
      <code language="ts"><![CDATA[
export { DevtoolsWidget } from './DevtoolsWidget';
]]></code>
    </file>
  </internalImplementation>

  <examples>
    <intro>Examples (React; plain files under `extensions/devtools/examples/react`)</intro>
    <note>They demonstrate wrapping incrementally; UI comes from the in‑package widget:</note>
    <example>viem: `withTevmDevtools(http(...))` → `createPublicClient`; render `<DevtoolsWidget />`.</example>
    <example>wagmi: `withTevmDevtools(createConfig(...))` → render `<WagmiConfig>` and `<DevtoolsWidget />`.</example>
    <example>ethers injected: wrap `window.ethereum` then `new BrowserProvider`; render widget.</example>
    <example>ethers JsonRpc: wrap `JsonRpcProvider` instance (intercept `send`); render widget.</example>
    <example>raw injected EIP‑1193: call `withTevmDevtools(window.ethereum)`; render widget.</example>
    <example>mixed dedup: early injected override + wrapped wagmi config → no duplicates.</example>
  </examples>
</devtoolsScaffoldingContext>