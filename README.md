# @darcas/wa-format

[![Buy me a coffee](https://img.shields.io/badge/buy_me_a_coffee-%E2%9D%A4%EF%B8%8F-FEEBE7?&labelColor=FF0000)](https://www.paypal.com/donate/?hosted_button_id=YZQDE3TEYDBWA)
[![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FDarCas%2Frefero-design-mcp%2Frefs%2Fheads%2Fmain%2Fpackage.json&query=%24.name&label=design%20by&color=brown)](https://github.com/DarCas/refero-design-mcp)

> Bidirectional WhatsApp formatting library: `toHTML` converts WhatsApp-formatted text into HTML,
> while `toWA` converts supported HTML back into WhatsApp markup. The converters are dependency-free;
> the bundled MCP server uses the Model Context Protocol SDK. Works in Node.js and modern browsers,
> and ships ESM, CommonJS and TypeScript declarations.

![Node.js](https://img.shields.io/badge/node.js-%3E%3D20-5FA04E?logo=nodedotjs&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge)
![Tests](https://img.shields.io/badge/tests-80%20passing-brightgreen?style=for-the-badge)

![npm](https://img.shields.io/npm/v/@darcas/wa-format?style=for-the-badge)
![NPM Downloads](https://img.shields.io/npm/dy/%40darcas%2Fwa-format?style=for-the-badge)

```ts
import {toHTML, toWA} from "@darcas/wa-format"

toHTML("*Hello* _world_")         // => "<b>Hello</b> <i>world</i>"
toWA("<b>Hello</b> <i>world</i>") // => "*Hello* _world_"
```

## Installation

Install the published package:

```bash
npm install @darcas/wa-format
```

Set up the repository for local development:

```bash
git clone https://github.com/DarCas/wa-format.git
cd wa-format
npm install
```

Requirements:

- Node.js `>=20`
- Runtime dependencies: `@modelcontextprotocol/server` and `zod`, used only by the MCP server.
  `toHTML` and `toWA` have no dependencies of their own.
- Development-only dependencies are `typescript` and `@types/node`

## Usage

### ESM

```ts
import {toHTML} from "@darcas/wa-format"

const html = toHTML("*Bold*, _italic_, ~strike~ and `code`.")
```

### CommonJS

```js
const {toHTML} = require("@darcas/wa-format")

const html = toHTML("*Bold* and _italic_.")
```

### Browser

```html

<script type="module">
    import {toHTML} from "https://esm.sh/@darcas/wa-format"

    document.querySelector("#message").innerHTML = toHTML("*Hello* _world_")
</script>
```

## MCP server

The package ships an MCP server, `wa-format-mcp`, that exposes the two
converters as tools: `whatsapp_to_html` and `html_to_whatsapp`. It uses the
stdio transport (Node.js 20 or later).

Register it in an MCP client (Claude Desktop, Codex, Cursor, …):

```json
{
    "mcpServers": {
        "wa-format": {
            "command": "npx",
            "args": [
                "-y",
                "-p",
                "@darcas/wa-format",
                "wa-format-mcp"
            ]
        }
    }
}
```

| Tool               | Arguments                                        | Returns                 |
|--------------------|--------------------------------------------------|-------------------------|
| `whatsapp_to_html` | `text` (required), `style`, `lineBreaks`, `trim` | HTML                    |
| `html_to_whatsapp` | `html` (required), `bullet`                      | WhatsApp-formatted text |

The arguments mirror the options of `toHTML` and `toWA`. Invalid arguments are
rejected by the tool schema.

Both tools are advertised as read-only and side-effect free (`readOnlyHint: true`,
`destructiveHint: false`, `idempotentHint: true`,
`openWorldHint: false`), so clients can auto-approve them.

## Supported formatting

| Format        | WhatsApp syntax                   | HTML output                     |
|---------------|-----------------------------------|---------------------------------|
| Bold          | `*text*`                          | `<b>text</b>`                   |
| Italic        | `_text_`                          | `<i>text</i>`                   |
| Strikethrough | `~text~`                          | `<s>text</s>`                   |
| Inline code   | `` `text` ``                      | `<code>text</code>`             |
| Code block    | ` ```text``` `                    | `<pre><code>text</code></pre>`  |
| Block quote   | `> text` (line start)             | `<blockquote>text</blockquote>` |
| Bulleted list | `- text` or `* text` (line start) | `<ul><li>text</li></ul>`        |
| Numbered list | `1. text` (line start)            | `<ol><li>text</li></ol>`        |

Inline styles can be nested and combined in any order:

```ts
toHTML("*_bold italic_*") // "<b><i>bold italic</i></b>"
toHTML("_*bold italic*_") // "<i><b>bold italic</b></i>"
```

## API

### `toHTML(input, options?)`

Converts a WhatsApp-formatted string to HTML and returns it.

| Option       | Type                     | Default      | Description                                                                 |
|--------------|--------------------------|--------------|-----------------------------------------------------------------------------|
| `style`      | `"semantic" \| "legacy"` | `"semantic"` | `semantic` emits `<b>`/`<i>`/`<s>`; `legacy` emits `<strong>`/`<em>`/`<s>`. |
| `lineBreaks` | `boolean`                | `true`       | Render `\n` as `<br>`. When `false`, newlines are kept as `\n`.             |
| `trim`       | `boolean`                | `true`       | Trim leading/trailing whitespace from the input before parsing.             |

Empty or whitespace-only input returns `""`. A non-string `input` throws a `TypeError`.

### `toWA(html, options?)`

The inverse of `toHTML`: converts HTML into WhatsApp-formatted text.

| Option   | Type         | Default | Description                     |
|----------|--------------|---------|---------------------------------|
| `bullet` | `"-" \| "*"` | `"-"`   | Marker used for bulleted lists. |

Recognized tags: `<b>`/`<strong>`, `<i>`/`<em>`, `<s>`/`<strike>`/`<del>`,
`<code>`, `<pre>`, `<blockquote>`, `<ul>`/`<ol>`/`<li>` (with `start`),
`<a href>` (kept as `text (url)`), `<br>`, and the line containers
`<p>`/`<div>`/`<h1>`–`<h6>`. Unknown tags are unwrapped and entities are decoded.

```ts
toWA("<b>Hello</b> <i>world</i>")        // => "*Hello* _world_"
toWA("<blockquote>a<br>b</blockquote>")  // => "> a\n> b"
toWA("<ul><li>one</li><li>two</li></ul>") // => "- one\n- two"
```

### `parse(input)`

Parses WhatsApp-formatted text into an AST (`Document`) instead of HTML. Input
line endings are normalized before parsing. Useful for custom rendering or
inspection. See [`src/ast.ts`](src/ast.ts) for the node types.

### `renderHtml(document, options)`

Renders a `Document` produced by `parse` to HTML with resolved options.

```ts
import {parse, renderHtml, resolveOptions} from "@darcas/wa-format"

const doc = parse("*Hello*")
const html = renderHtml(doc, resolveOptions())
```

### `parseHtml(html)`

Parses an HTML fragment into a lightweight node tree (`HtmlNode[]`). Lower-level
building block used by `toWA`.

Additional exports include `resolveOptions`, `DEFAULT_OPTIONS`, `FormatOptions`,
`ResolvedOptions`, `ToWAOptions` and the AST node types.

## Behavior notes

The implementation follows these rules:

- **Markers must touch their content.** `* bold *` is not bold; `*bold*` is. A
  marker that sits inside a word (`snake_case`, `2*3*4`) is left literal.
- **No escaping character.** WhatsApp has none, and neither does this library. To
  show a marker literally, wrap the text in code (`` `*not bold*` ``).
- **Code is opaque.** Markers inside `` `code` `` or ` ```code``` ` are never
  parsed, and code content is HTML-escaped.
- **Lists require a space** after the marker: `- text`, `* text`, `1. text`.
  Numbered lists accept up to two digits. Nested lists are not supported by
  WhatsApp and are not produced here.
- **Consecutive quote lines** are grouped into a single `<blockquote>`, with
  `<br>` between lines.
- **All text is HTML-escaped** (`&`, `<`, `>`, `"`, `'`); the output is safe to
  inject into a container element.
- **Newlines:** a `\n` between text lines becomes `<br>`. A newline that joins a
  block element (list, quote, code block) to its neighbours is represented by the
  element itself. A blank line next to a block element is absorbed.
- **`toWA` is best-effort and lossy.** WhatsApp has no escape character, so a
  literal `*`/`_`/`~`/`` ` `` in the text, marker runs adjacent to word characters (`<b>a</b>b` →
  `*a*b`), and code containing backticks cannot round-trip exactly.
  Whitespace at the edges of a style is moved outside its markers. The guaranteed
  property is HTML idempotence: `toHTML(toWA(html)) === toHTML(html)`.

## Development

Package entry points:

- ESM: `./dist/esm/index.js`
- CommonJS: `./dist/cjs/index.js`
- Types: `./dist/esm/index.d.ts`
- MCP binary: `./dist/esm/mcp/bin.js` (`wa-format-mcp`)

Available scripts:

```bash
npm install        # install dependencies and dev tooling
npm run build      # emit dist/esm (ESM + .d.ts) and dist/cjs (CommonJS)
npm test           # build, then run the node:test suite (80 tests)
npm run typecheck  # type-check src and tests
```

The manifest also defines `deploy`, which builds and publishes the package
publicly. Tests run on the built output (`dist/`). The test runner is the Node.js
built-in `node:test`; no test framework is used. The MCP server is compiled into
`dist/esm` only (the CJS build excludes `src/mcp`).

## Contributing

Contributions are welcome. Please open an issue to discuss significant changes before submitting a
pull request.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run `npm run typecheck` and `npm test`.
5. Open a pull request.

Repository: <https://github.com/DarCas/wa-format>

Issues: <https://github.com/DarCas/wa-format/issues>

## License

[MIT](LICENSE)
