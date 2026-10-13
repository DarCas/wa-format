# Testing

## Runner and style

- Node.js built-in `node:test` (`import { test } from "node:test"`) with `node:assert/strict`. No external framework.
- Test files are `tests/*.test.ts`, named by topic. Keep one concern per file.
- Every test file carries the same MIT copyright header as the source.
- The typecheck config includes `tests`, so test files are type-checked too.

## How tests run

- `npm test` runs `pretest` first, which runs `npm run build`. Tests import the
  **built output** (`../dist/esm/index.js`, `../dist/esm/mcp/bin.js`), not `src`.
  Changing `src` without rebuilding leaves tests running against stale code.
- Run a single file: `node --test tests/options.test.ts`.
- Run by name: `node --test --test-name-pattern="legacy" tests/options.test.ts`.
- The full suite is 80 tests and takes under a second once built.

## Suites

| File | Covers |
| --- | --- |
| `tests/inline.test.ts` | Inline markers, nesting, boundaries, empty/unclosed spans. |
| `tests/blocks.test.ts` | Quotes, lists, code blocks, grouping. |
| `tests/escape.test.ts` | HTML escaping. |
| `tests/options.test.ts` | `FormatOptions` resolution, empty input, `TypeError`, `parse`/`renderHtml` composition. |
| `tests/message.test.ts` | End-to-end `toHTML` on realistic multi-construct messages. |
| `tests/to-wa.test.ts` | `toWA` tag mapping, options, lossy edges. |
| `tests/mcp.test.ts` | Tool handlers `runWhatsappToHtml`/`runHtmlToWhatsapp` and server creation. |
| `tests/mcp-stdio.test.ts` | The compiled `dist/esm/mcp/bin.js` over stdio JSON-RPC (`initialize`, `tools/list`, `tools/call`, invalid args). |

## What to mock or avoid

- Tests are pure Node: there is no DOM and no network. Do not add a DOM shim; the HTML parser is a custom mini parser in `src/html/dom.ts`.
- The MCP stdio test spawns the real built binary via `node:child_process`; keep it against `dist/`, not a mock server.
- Assert exact strings for conversions. The spec is defined by example pairs (see `docs/plan/implementation-plan.md`).
- For `toWA`, assert HTML idempotence where exact round-trips are not possible: `toHTML(toWA(html)) === toHTML(html)`.
