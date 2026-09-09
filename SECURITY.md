# AEGIS deployment security boundary

The Vite application is a presentation client. It is not permitted to be the
authority for authentication, RBAC, medical records, audit logs, or wearable
provider credentials. Demo credentials exist only during Vite development and
are disabled in production builds.

## Required local Node service

Before exposing AEGIS beyond a single developer machine, the same-origin Node
service must provide:

- authenticated, `HttpOnly`, `Secure`, `SameSite=Strict` session cookies;
- server-side RBAC checks for every personnel, assessment and medical route;
- immutable, append-only audit events with protected storage;
- a CSRF-protected `POST /api/v1/wearables/sync` endpoint;
- OAuth authorization-code flow with PKCE where appropriate, with provider
  tokens encrypted at rest and never returned to the browser;
- input validation, request size limits, rate limiting and structured security
  logs; and
- TLS, even on an internal network. Bind to `127.0.0.1` when the service is
  intended for one host only.

Health Connect itself is an Android API. A web browser cannot read it directly;
an Android companion application should obtain Health Connect permissions and
send only approved, attributable records to the Node service. The service must
retain source, timestamp, timezone and device metadata and reject implausible
or stale readings.

For this local demo, the browser uses Google Identity Services with a public
OAuth client ID saved in local storage. The resulting short-lived access token
is held only in memory and is sent to the Google Fitness API in an
`Authorization: Bearer` header. Invalid, missing or unauthorized data is
surfaced as an error; it is never replaced by simulated readings.
