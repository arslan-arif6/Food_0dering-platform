// Node's built-in fetch (undici) tries IPv6 first by default. On many
// Windows machines/ISPs, IPv6 to a given host is slow, unreliable, or
// silently dropped — so the IPv6 attempt hangs until it times out
// (UND_ERR_CONNECT_TIMEOUT) or resolves inconsistently (ENOTFOUND),
// and only sometimes falls back to a working IPv4 connection in time.
// That's exactly the intermittent "works / times out / not found"
// pattern seen with Supabase requests from Server Actions.
//
// Next.js evaluates instrumentation.ts for BOTH the Node.js runtime
// and the Edge runtime. A top-level `import dns from "node:dns"`
// would be loaded unconditionally in both — including Edge, which
// has no node:dns and crashes immediately, before the runtime check
// below ever runs. Using a dynamic import INSIDE the guarded branch
// means node:dns is only ever requested when NEXT_RUNTIME is
// "nodejs", so Edge never tries to load it at all.
export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const dns = await import("node:dns");
        dns.setDefaultResultOrder("ipv4first");
    }
}