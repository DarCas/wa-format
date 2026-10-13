# Architecture

## Purpose

A small, dependency-free library that converts WhatsApp-formatted text to HTML
and back. The two directions are independent pipelines sharing one AST.

## Two pipelines

### WhatsApp → HTML (`toHTML`)

1. `toHTML` (`src/index.ts`) validates the input, resolves options and trims.
2. `parse` (`src/parser.ts`) normalizes line endings (`\r\n`/`\r` → `\n`).
3. `parseBlocks` (`src/blocks.ts`) splits lines into block nodes — code blocks,
   quotes, lists, paragraphs — using the marker constants.
4. `parseInline` (`src/inline.ts`) parses inline styles, inline/block code and
   line breaks into `InlineNode[]` with a stack-based algorithm.
5. `renderHtml` (`src/renderer.ts`) walks the AST and emits escaped HTML.
6. `escapeHtml` (`src/escape.ts`) is the only path from user text into markup.

Result: `Document` AST → HTML string.

### HTML → WhatsApp (`toWA`)

1. `toWA` (`src/html/to-wa.ts`) validates the input and resolves options.
2. `parseHtml` (`src/html/dom.ts`) parses the fragment into a tolerant
   `HtmlNode[]` tree (a mini parser, not the full HTML5 algorithm).
3. `toWA` walks the tree, mapping tags to markers and decoding entities with
   `decodeEntities` (`src/html/entities.ts`).
4. Trailing/leading newlines and runs of 3+ newlines are collapsed.

Result: HTML string → WhatsApp markup. This direction is best-effort and lossy.

## Module responsibilities

| Module | Responsibility |
| --- | --- |
| `src/index.ts` | Public API: `toHTML` plus re-exports of `parse`, `renderHtml`, `resolveOptions`, `DEFAULT_OPTIONS`, `toWA`, `parseHtml` and AST/option types. |
| `src/ast.ts` | AST types: `Document`, `BlockNode`, `InlineNode`, `StyleNode`, `TextNode`, `BreakNode`, `CodeNode`, `CodeBlockNode`, `ParagraphNode`, `QuoteNode`, `ListNode`, `InlineStyle`. |
| `src/parser.ts` | Normalizes line endings and builds the `Document`. |
| `src/blocks.ts` | Block-level parsing: fenced code blocks, quote grouping, list grouping. |
| `src/inline.ts` | Inline parsing: `*`/`_`/`~` styles, backtick code, line breaks. |
| `src/renderer.ts` | AST → HTML; selects tag set per `style` option. |
| `src/options.ts` | `FormatOptions`, `ResolvedOptions`, `DEFAULT_OPTIONS`, `resolveOptions`. |
| `src/constants.ts` | Marker characters, `STYLE_BY_MARKER`, `isWordChar`, `isWhitespace`. |
| `src/escape.ts` | `escapeHtml` — the sole escaping path. |
| `src/html/dom.ts` | Tolerant mini HTML parser producing `HtmlElement`/`HtmlText`. |
| `src/html/entities.ts` | Named + numeric HTML entity decoder. |
| `src/html/to-wa.ts` | HTML tree → WhatsApp markup; `ToWAOptions` (`bullet`). |
| `src/mcp/server.ts` | `McpServer` with `whatsapp_to_html` and `html_to_whatsapp` tools. |
| `src/mcp/bin.ts` | `wa-format-mcp` stdio entry point (`serveStdio`). |

Dependency direction is one-way: `index` → `parser` → `blocks`/`inline` →
`constants`/`ast`; `renderer` → `ast`/`escape`/`options`; `html/*` is
self-contained; `mcp/*` depends on `index` and `options`. No module imports
`src/mcp`.

## Public API surface

- `toHTML(input, options?)` — throws `TypeError` on non-string input; returns `""` for empty/whitespace-only input.
- `toWA(html, options?)` — inverse converter; throws `TypeError` on non-string input.
- `parse(input)` — WhatsApp text → `Document`.
- `renderHtml(document, resolvedOptions)` — `Document` → HTML.
- `parseHtml(html)` — HTML → `HtmlNode[]` (low-level).
- `resolveOptions`, `DEFAULT_OPTIONS`, `FormatOptions`, `ResolvedOptions`, `ToWAOptions`, AST types.

## MCP layer

`createServer` registers two tools with matching `inputSchema` (zod) and
`annotations` marking both read-only, idempotent, non-destructive and closed-world.
`runWhatsappToHtml`/`runHtmlToWhatsapp` return a `CallToolResult`; errors are
converted into `{ isError: true }` results instead of thrown. The server version
is read from `package.json` at runtime with a hard-coded fallback (`0.5.0`).

## Build and packaging

- `tsconfig.esm.json` → `dist/esm` with declarations; includes all of `src`.
- `tsconfig.cjs.json` → `dist/cjs`, no declarations; excludes `src/mcp`.
- `scripts/postbuild.mjs` writes `dist/cjs/package.json` (`{"type":"commonjs"}`) because the package root is `"type": "module"`.
- `package.json` `exports` routes `import` to `dist/esm`, `require` to `dist/cjs`, types to `dist/esm/index.d.ts`.
- `bin.wa-format-mcp` → `dist/esm/mcp/bin.js`; `files` ships only `dist`.

## Constraints and invariants

- Zero runtime dependencies for the core; no bundler.
- No escaping character in WhatsApp: a literal marker is shown by wrapping it in code.
- Empty style spans (`**`) keep both markers literal; an unclosed style splices its marker and children back into the parent.
- `_` is not a word character, so `*_bold italic_*` nests.
- Nesting is order-independent: `*_x_*` and `_*x*_` produce equivalent nested output.
- Consecutive quote lines become one `<blockquote>` with `<br>` between lines.
- Nested/indented lists are not supported (matching WhatsApp).

Rationale for these decisions lives in `docs/plan/implementation-plan.md`.
