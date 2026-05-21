/** @jsxImportSource react */
import { useMemo, useState } from "react";
import {
  createGatewayReactRoot,
  useGatewayActions,
  useGatewayApprovals,
  useGatewayNodeOutput,
  useGatewayRunEvents,
  useGatewayRuns,
} from "smithers-orchestrator/gateway-react";

const WORKFLOW_KEY = "kanban";

type RunSummary = {
  runId: string;
  workflowKey?: string;
  status?: string;
  createdAtMs?: number;
  startedAtMs?: number;
};

type BoardLane = "pending" | "in-progress" | "completed";
type TicketState = "pending" | "in-progress" | "finished" | "failed";

type TicketSummary = {
  id: string;
  slug: string;
  title: string;
};

type TicketView = {
  id: string;
  slug: string;
  title: string;
  lane: BoardLane;
  state: TicketState;
  events: number;
  currentStep?: string;
  nodeId?: string;
};

const laneLabels: Record<BoardLane, string> = {
  pending: "Todo",
  "in-progress": "In Progress",
  completed: "Done",
};

const laneOrder: BoardLane[] = ["pending", "in-progress", "completed"];

const styles = [
  ":root { --bg: #0c0c0e; --panel: #151518; --card: #1c1c1f; --text: #eeeeee; --muted: #8a8a8e; --border: #262629; --primary: #5e6ad2; --success: #4ade80; --error: #f87171; --warning: #fbbf24; color-scheme: dark; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; }",
  "* { box-sizing: border-box; -webkit-font-smoothing: antialiased; }",
  "body { margin: 0; background: var(--bg); color: var(--text); font-size: 13px; line-height: 1.4; }",
  "button, input { font: inherit; transition: all 0.1s ease; }",
  ".shell { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }",
  ".topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid var(--border); background: var(--bg); z-index: 10; }",
  ".title-group { display: flex; align-items: center; gap: 12px; }",
  "h1 { margin: 0; font-size: 14px; font-weight: 600; }",
  ".run-indicator { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); background: var(--panel); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border); }",
  ".toolbar { display: flex; align-items: center; gap: 12px; }",
  ".field { display: flex; align-items: center; gap: 8px; }",
  ".field label { color: var(--muted); font-size: 11px; font-weight: 600; text-transform: uppercase; }",
  ".field input { width: 32px; border: 0; outline: none; color: var(--text); background: transparent; font-weight: 600; text-align: center; border-bottom: 1px solid var(--border); }",
  ".button { display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: 6px; height: 28px; padding: 0 12px; background: var(--panel); color: var(--text); cursor: pointer; font-weight: 500; font-size: 12px; }",
  ".button:hover { background: var(--card); border-color: #3f3f46; }",
  ".button.primary { background: var(--primary); color: white; border-color: var(--primary); }",
  ".button.primary:hover { opacity: 0.9; }",
  ".button.danger { color: var(--error); }",
  ".button:disabled { opacity: 0.4; cursor: not-allowed; }",
  ".main { display: grid; grid-template-columns: 1fr 280px; flex: 1; overflow: hidden; }",
  ".board { display: grid; grid-template-columns: repeat(3, 1fr); background: var(--border); gap: 1px; overflow-x: auto; height: 100%; }",
  ".lane { background: var(--bg); display: flex; flex-direction: column; min-width: 300px; height: 100%; }",
  ".lane-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; position: sticky; top: 0; background: var(--bg); z-index: 5; }",
  ".lane-title-wrap { display: flex; align-items: center; gap: 8px; }",
  ".lane-title { font-weight: 600; font-size: 12px; }",
  ".count { color: var(--muted); font-size: 12px; }",
  ".status-circle { width: 14px; height: 14px; border: 1.5px solid var(--muted); border-radius: 50%; display: inline-block; position: relative; }",
  ".lane.in-progress .status-circle { border-color: var(--warning); border-left-color: transparent; }",
  ".lane.completed .status-circle { border-color: var(--primary); background: var(--primary); }",
  ".lane.completed .status-circle::after { content: ''; position: absolute; left: 3px; top: 1px; width: 4px; height: 7px; border: solid white; border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }",
  ".cards { padding: 8px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; flex: 1; }",
  ".ticket { background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.1s; }",
  ".ticket:hover { border-color: #3f3f46; }",
  ".ticket-id { font-family: monospace; font-size: 11px; color: var(--muted); }",
  ".ticket-title { font-size: 13px; font-weight: 500; color: var(--text); line-height: 1.4; }",
  ".ticket-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }",
  ".pill { font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 4px; background: #262629; color: var(--muted); border: 1px solid transparent; }",
  ".pill.active { border-color: rgba(94, 106, 210, 0.4); color: #8e96ff; background: rgba(94, 106, 210, 0.1); }",
  ".ticket-step { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 6px; }",
  ".dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); }",
  ".ticket.in-progress .dot { background: var(--warning); box-shadow: 0 0 6px var(--warning); }",
  ".ticket.failed .dot { background: var(--error); }",
  ".ticket.finished .dot { background: var(--success); }",
  ".sidebar { border-left: 1px solid var(--border); display: flex; flex-direction: column; background: var(--bg); overflow: hidden; }",
  ".side-block { display: flex; flex-direction: column; flex: 1; overflow: hidden; border-bottom: 1px solid var(--border); }",
  ".side-head { padding: 12px 16px; border-bottom: 1px solid var(--border); }",
  ".side-head h2 { margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }",
  ".side-list { overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 2px; }",
  ".run-btn { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; text-align: left; background: transparent; width: 100%; color: inherit; }",
  ".run-btn:hover { background: var(--panel); }",
  ".run-btn.selected { background: var(--panel); border-color: var(--border); }",
  ".run-info { display: flex; align-items: center; justify-content: space-between; }",
  ".run-name { font-family: monospace; font-weight: 600; font-size: 12px; }",
  ".run-time { font-size: 11px; color: var(--muted); }",
  ".approval-box { padding: 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--panel); margin-bottom: 8px; display: flex; flex-direction: column; gap: 8px; }",
  ".approval-txt { font-weight: 600; font-size: 12px; }",
  ".approval-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }",
  ".empty { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 12px; font-style: italic; opacity: 0.5; }",
  ".toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 8px 16px; border-radius: 8px; background: var(--card); border: 1px solid var(--border); box-shadow: 0 8px 24px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 12px; z-index: 100; font-size: 12px; font-weight: 500; }",
  ".error-msg { color: var(--error); }",
].join("\n");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function shortRunId(runId: string | undefined) {
  return runId ? runId.slice(0, 8) : "none";
}

function formatTime(ms: number | undefined) {
  if (!ms) return "--";
  const d = new Date(ms);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function titleFromSlug(slug: string) {
  return slug
    .replace(/__/g, " / ")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function extractDiscoveredTickets(value: unknown): TicketSummary[] {
  const response = isRecord(value) ? value : {};
  const row = isRecord(response.row) ? response.row : {};
  const rawTickets = Array.isArray(row.tickets) ? row.tickets : [];
  return rawTickets.flatMap((ticket): TicketSummary[] => {
    if (!isRecord(ticket)) return [];
    const slug = asString(ticket.slug);
    const id = asString(ticket.id) ?? (slug ? slug + ".md" : undefined);
    if (!slug || !id) return [];
    return [{ id, slug, title: asString(ticket.title) ?? titleFromSlug(slug) }];
  });
}

function parseTicketNode(nodeId: string): { slug: string; step: string; result: boolean } | null {
  if (nodeId.startsWith("result-")) {
    const slug = nodeId.slice("result-".length);
    return slug ? { slug, step: "result", result: true } : null;
  }
  const [slug, step] = nodeId.split(":");
  if (!slug || slug === "tickets" || slug === "merge" || step === "loop") return null;
  return { slug, step: step ?? "process", result: false };
}

function stepLabel(step: string) {
  if (step === "implement") return "Implementing";
  if (step === "validate") return "Validating";
  if (step === "review") return "Reviewing";
  if (step === "result") return "Done";
  return titleFromSlug(step);
}

function collectStreamEvents(events: Array<Record<string, unknown>>) {
  return events
    .map((frame) => (isRecord(frame.payload) ? frame.payload : frame))
    .filter((frame): frame is Record<string, unknown> => isRecord(frame));
}

function deriveTickets(discovered: TicketSummary[], events: Array<Record<string, unknown>>): TicketView[] {
  const tickets = new Map<string, TicketView>();
  for (const ticket of discovered) {
    tickets.set(ticket.slug, {
      id: ticket.id,
      slug: ticket.slug,
      title: ticket.title,
      lane: "pending",
      state: "pending",
      events: 0,
      currentStep: "Backlog",
    });
  }
  for (const event of events) {
    const eventName = asString(event.event);
    if (eventName !== "node.started" && eventName !== "node.finished" && eventName !== "node.failed") continue;
    const payload = isRecord(event.payload) ? event.payload : {};
    const nodeId = asString(payload.nodeId);
    if (!nodeId) continue;
    const parsed = parseTicketNode(nodeId);
    if (!parsed) continue;
    const existing = tickets.get(parsed.slug) ?? {
      id: parsed.slug + ".md",
      slug: parsed.slug,
      title: titleFromSlug(parsed.slug),
      lane: "pending" as BoardLane,
      state: "pending" as TicketState,
      events: 0,
    };
    if (eventName === "node.failed") {
      existing.lane = "completed";
      existing.state = "failed";
      existing.currentStep = "Failed: " + stepLabel(parsed.step);
    } else if (parsed.result && eventName === "node.finished") {
      existing.lane = "completed";
      existing.state = "finished";
      existing.currentStep = "Completed";
    } else {
      existing.lane = existing.lane === "completed" ? existing.lane : "in-progress";
      existing.state = existing.state === "failed" || existing.state === "finished" ? existing.state : "in-progress";
      existing.currentStep = stepLabel(parsed.step);
    }
    existing.nodeId = nodeId;
    existing.events += 1;
    tickets.set(parsed.slug, existing);
  }
  return Array.from(tickets.values()).sort((left, right) => left.title.localeCompare(right.title));
}

function App() {
  const [maxConcurrency, setMaxConcurrency] = useState(3);
  const [selectedRunId, setSelectedRunId] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const runs = useGatewayRuns({ filter: { limit: 20 } });
  const approvals = useGatewayApprovals({ filter: { workflow: WORKFLOW_KEY, limit: 10 } });
  const actions = useGatewayActions();

  const kanbanRuns = useMemo(() => {
    return ((runs.data ?? []) as RunSummary[]).filter((run) => !run.workflowKey || run.workflowKey === WORKFLOW_KEY);
  }, [runs.data]);
  const activeRunId = selectedRunId ?? kanbanRuns[0]?.runId;
  const activeRun = kanbanRuns.find((run) => run.runId === activeRunId);
  const stream = useGatewayRunEvents(activeRunId, { afterSeq: 0 });
  const ticketsOutput = useGatewayNodeOutput({ runId: activeRunId, nodeId: "tickets", iteration: 0 });
  const streamEvents = useMemo(() => {
    return collectStreamEvents(stream.events as Array<Record<string, unknown>>)
      .filter((event) => !activeRunId || asString(event.runId) === activeRunId);
  }, [activeRunId, stream.events]);
  const discoveredTickets = useMemo(() => extractDiscoveredTickets(ticketsOutput.data), [ticketsOutput.data]);
  const tickets = useMemo(() => deriveTickets(discoveredTickets, streamEvents), [discoveredTickets, streamEvents]);
  const pendingApprovals = approvals.data ?? [];
  const ticketsByLane = useMemo(() => {
    const grouped: Record<BoardLane, TicketView[]> = { pending: [], "in-progress": [], completed: [] };
    for (const ticket of tickets) grouped[ticket.lane].push(ticket);
    return grouped;
  }, [tickets]);

  function notify(msg: string) {
    setMessage(msg);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3000);
  }

  async function refresh() {
    await Promise.all([runs.refetch(), approvals.refetch(), ticketsOutput.refetch()]);
  }

  async function launch() {
    setBusy(true);
    try {
      const run = await actions.launchRun({ workflow: WORKFLOW_KEY, input: { maxConcurrency } });
      setSelectedRunId(run.runId);
      notify("Launched " + shortRunId(run.runId));
      await refresh();
    } catch (e) { notify(String(e)); } finally { setBusy(false); }
  }

  async function cancelRun() {
    if (!activeRunId) return;
    setBusy(true);
    try {
      await actions.cancelRun({ runId: activeRunId });
      notify("Cancelled run");
      await refresh();
    } catch (e) { notify(String(e)); } finally { setBusy(false); }
  }

  async function decide(approval: (typeof pendingApprovals)[number], ok: boolean) {
    setBusy(true);
    try {
      await actions.submitApproval({
        runId: approval.runId, nodeId: approval.nodeId, iteration: approval.iteration,
        decision: { approved: ok, note: (ok ? 'Approved' : 'Denied') + ' via UI' }
      });
      notify(ok ? 'Approved' : 'Denied');
      await refresh();
    } catch (e) { notify(String(e)); } finally { setBusy(false); }
  }

  const hasError = !!(stream.error || ticketsOutput.error);

  return (
    <main className="shell">
      <style>{styles}</style>
      <header className="topbar">
        <div className="title-group">
          <h1>Kanban</h1>
          <div className="run-indicator">
            <div className="status-circle" style={{ border: '1.5px solid var(--primary)', background: activeRun?.status === 'running' ? 'var(--primary)' : 'transparent' }}></div>
            <span>{activeRunId ? shortRunId(activeRunId) : 'No Run'}</span>
            <span style={{ color: activeRun?.status === 'running' ? 'var(--warning)' : 'var(--muted)', fontWeight: 600 }}>
              {activeRun?.status ?? 'Idle'}
            </span>
          </div>
        </div>
        <div className="toolbar">
          <div className="field">
            <label>Limit</label>
            <input
              type="number" min={1} max={10} value={maxConcurrency}
              onChange={(e) => setMaxConcurrency(Math.max(1, Number(e.currentTarget.value) || 1))}
            />
          </div>
          <button className="button" onClick={() => void refresh()} disabled={busy}>Refresh</button>
          {activeRun?.status === "running" && (
            <button className="button danger" onClick={() => void cancelRun()} disabled={busy}>Cancel</button>
          )}
          <button className="button primary" onClick={() => void launch()} disabled={busy}>Launch Run</button>
        </div>
      </header>

      <div className="main">
        <div className="board">
          {laneOrder.map((lane) => (
            <section className={"lane " + lane} key={lane}>
              <div className="lane-head">
                <div className="lane-title-wrap">
                  <div className="status-circle"></div>
                  <div className="lane-title">{laneLabels[lane]}</div>
                  <div className="count">{ticketsByLane[lane].length}</div>
                </div>
              </div>
              <div className="cards">
                {ticketsByLane[lane].map((t) => (
                  <article className={"ticket " + t.state} key={t.slug}>
                    <span className="ticket-id">{t.slug.slice(0, 12).toUpperCase()}</span>
                    <div className="ticket-title">{t.title}</div>
                    <div className="ticket-meta">
                      <div className="ticket-step">
                        <div className="dot"></div>
                        <span>{t.currentStep ?? t.state}</span>
                      </div>
                      <div className={"pill " + (t.state === 'in-progress' ? 'active' : '')}>{t.events} Events</div>
                    </div>
                  </article>
                ))}
                {ticketsByLane[lane].length === 0 && <div className="empty">Empty</div>}
              </div>
            </section>
          ))}
        </div>

        <aside className="sidebar">
          <section className="side-block">
            <div className="side-head"><h2>Recent Runs</h2></div>
            <div className="side-list">
              {kanbanRuns.map((r) => (
                <button
                  key={r.runId} className={"run-btn " + (r.runId === activeRunId ? 'selected' : '')}
                  onClick={() => setSelectedRunId(r.runId)}
                >
                  <div className="run-info">
                    <span className="run-name">{shortRunId(r.runId)}</span>
                    <div className="pill">{r.status}</div>
                  </div>
                  <span className="run-time">{formatTime(asNumber(r.startedAtMs) ?? asNumber(r.createdAtMs))}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="side-block" style={{ flex: 1.5 }}>
            <div className="side-head"><h2>Approvals</h2></div>
            <div className="side-list">
              {pendingApprovals.map((a) => (
                <div className="approval-box" key={a.runId + a.nodeId + a.iteration}>
                  <div className="approval-txt">{a.requestTitle ?? a.nodeId}</div>
                  <div className="approval-grid">
                    <button className="button" onClick={() => void decide(a, false)} disabled={busy}>Deny</button>
                    <button className="button primary" onClick={() => void decide(a, true)} disabled={busy}>Approve</button>
                  </div>
                </div>
              ))}
              {pendingApprovals.length === 0 && <div className="empty">All clear</div>}
            </div>
          </section>
        </aside>
      </div>

      {showMsg && (
        <div className="toast">
          <div className={hasError ? "error-msg" : ""}>{stream.error?.message ?? ticketsOutput.error?.message ?? message}</div>
        </div>
      )}
    </main>
  );
}

createGatewayReactRoot(<App />);
