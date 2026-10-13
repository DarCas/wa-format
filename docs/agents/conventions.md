# Conventions

Project-specific rules that are not obvious from TypeScript defaults. Follow
`.editorconfig` for formatting; it is authoritative.

## Runtime

`package.json` `engines` and the README require Node ≥20. Note that `.nvmrc`
currently pins `18`, which is below the supported floor — trust the `engines`
field and use Node ≥20 (CI publishes on Node 24).

## Code style

- 4-space indentation; LF line endings; final newline; max line length 100.
- No semicolons; double quotes; spaces inside brackets, parentheses and imports.
- One blank line after the import block.
- Every source file starts with the MIT copyright header used across `src/` and `tests/`.
- JSON and YAML use 2-space indentation.

## TypeScript

Configured in `tsconfig.base.json` (`strict: true`):

- `noUnusedLocals` and `noUnusedParameters` — remove dead code and unused args instead of prefixing.
- `noFallthroughCasesInSwitch` — every `switch` case must `break`/`return`.
- `verbatimModuleSyntax` — type-only imports must use `import type`; values and types must not be mixed in one statement when a type-only import would do.
- `isolatedModules`, `forceConsistentCasingInFileNames`, `esModuleInterop`, `skipLibCheck`.
- Target `ES2020`, `moduleResolution: "Bundler"`.

`tsconfig.json` is the typecheck config (`noEmit`) covering `src` and `tests`.
`tsconfig.esm.json` and `tsconfig.cjs.json` are the build configs (see architecture).

## Imports

- Always use the `.js` extension on relative imports, even from `.ts` files (`import { parse } from "./parser.js"`).
- Prefer `import type` for types and split type-only re-exports (`export type { ... }`) from value exports, as in `src/index.ts`.
- Keep the public API centralized in `src/index.ts`; `src/mcp/` imports from `../index.js` and `../options.js`, not from deep internals where avoidable.

## Error handling

- `toHTML` and `toWA` throw `TypeError` when the input is not a string; they never coerce.
- Empty or whitespace-only input returns `""` (after applying `trim`).
- The MCP layer converts thrown errors into a `CallToolResult` with `isError: true`; do not let exceptions escape a tool handler.

## Safety

- `escapeHtml` (`src/escape.ts`) is the only path from user text into HTML. Add no other emission path.
- `decodeEntities` (`src/html/entities.ts`) decodes a fixed named set plus numeric references; unknown entities are left as written.
- The mini HTML parser in `src/html/dom.ts` is deliberately tolerant. It targets well-formed `toHTML` output and common editor markup, not the HTML5 spec. Do not expand it into a spec-complete parser without a decision.

## Markers and parsing

- Marker characters, `STYLE_BY_MARKER`, `isWordChar` and `isWhitespace` live in `src/constants.ts`. Do not scatter literals for markers elsewhere.
- Word-boundary behaviour in `src/inline.ts` is tested. `_` is intentionally not a word character so styles can nest.
- Backtick runs are opaque: code content is captured verbatim and never re-parsed; three or more backticks produce a `codeBlock` node.
- A style left open at end of input is unwound: its marker is emitted as literal text and its children are spliced into the parent in order.

## Commits and releases

- Commit messages follow Conventional Commits with an emoji prefix; the full rules live in `.opencode/commands/commit.md`.
- Type precedence: feat > fix > perf > refactor > docs > test > build > ci > chore > style. Breaking changes add `!` and a `BREAKING CHANGE:` section.
- `package.json`, `package-lock.json` and `REPORT.log` changes are excluded from generated commit bodies.
- Releases are published by `.github/workflows/publish.yml` on `v*` tags (runs `npm ci`, `npm run test`, `npm run build`, `npm publish`). `npm run deploy` performs the same steps locally.
- The website under `website/` is deployed by `.github/workflows/pages.yml` on pushes to `master` touching `website/**`.
