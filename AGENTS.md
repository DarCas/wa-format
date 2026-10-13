# AGENTS.md

## Project

`@darcas/wa-format` — bidirectional WhatsApp ↔ HTML formatting library.
`toHTML` converts WhatsApp markup to safe HTML; `toWA` converts supported HTML
back to WhatsApp markup. Ships ESM + CommonJS + TypeScript declarations and a
bundled MCP server (`wa-format-mcp`). Isomorphic: Node.js ≥20 and modern browsers.

The core converters are dependency-free. Runtime dependencies
(`@modelcontextprotocol/server`, `zod`) are used only by the MCP server. The build
uses `tsc` only — no bundler.

## Commands

Run from the repository root. Node ≥20 (CI publishes on Node 24).

- Install: `npm install`
- Build: `npm run build` — emits `dist/esm` (ESM + `.d.ts`) and `dist/cjs` (CommonJS), then runs `scripts/postbuild.mjs`.
- Typecheck: `npm run typecheck` — `tsc -p tsconfig.json --noEmit` over `src` and `tests`.
- Test: `npm test` — builds first (`pretest`), then runs `node --test "./tests/**/*.test.ts"` (80 tests).
- Single test file: `node --test tests/options.test.ts`
- Single test by name: `node --test --test-name-pattern="legacy" tests/options.test.ts`
- Clean: `npm run clean`
- Release: `npm run deploy` (clean + build + `npm publish --access public`) — only when publishing.

## Hard rules

- The core (`src/` except `src/mcp/`) must stay dependency-free. Never import `@modelcontextprotocol/server` or `zod` outside `src/mcp/`.
- All user text that reaches HTML must pass through `escapeHtml` (`src/escape.ts`). Never emit raw input into markup.
- Tests run against the built `dist/esm` output, not `src`. Build (or use `npm test`) after changing `src`.
- Import local modules with the `.js` extension and use `import type` for type-only imports (`verbatimModuleSyntax` is enabled).
- Preserve the tested marker semantics in `src/constants.ts` and the boundary rules in `src/inline.ts`.
- `toWA` is best-effort and lossy; the guaranteed property is HTML idempotence: `toHTML(toWA(html)) === toHTML(html)`.
- Use Node.js built-in `node:test` with `node:assert/strict`. Do not add a test framework.
- Keep the MCP server ESM-only; the CJS build excludes `src/mcp`.
- Every source file keeps its MIT copyright header; 4-space indent, no semicolons, double quotes, LF endings (`.editorconfig`).

## External File Loading

CRITICAL: When you encounter a file reference (e.g. @docs/agents/architecture.md), use your Read tool to load it on a need-to-know basis, only if relevant to the SPECIFIC task at hand.

- Do NOT preemptively load all references.
- Once loaded, treat the content as mandatory instructions that override defaults.
- Follow references recursively when needed.

## Project knowledge

- Before changing modules, layers or data flows: @docs/agents/architecture.md
- Before writing or changing code: @docs/agents/conventions.md
- Before writing or running tests: @docs/agents/testing.md
- For the formatting spec and resolved design decisions: @docs/plan/implementation-plan.md

## Map

- `src/` — library source: `parser.ts`, `blocks.ts`, `inline.ts`, `renderer.ts`, `ast.ts`, `options.ts`, `escape.ts`, `constants.ts`, `index.ts`, and `html/` + `mcp/`.
- `tests/` — `node:test` suites, one topic per file (run against `dist/`).
- `scripts/postbuild.mjs` — writes `dist/cjs/package.json` so CJS output is treated as CommonJS.
- `dist/` — build output, generated and gitignored; never edit by hand.
- `docs/plan/implementation-plan.md` — design spec and decision record.
- `website/` — GitHub Pages site deployed by `.github/workflows/pages.yml`; empty in this checkout.
