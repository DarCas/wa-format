# wa-format

Convert **WhatsApp formatted text into HTML**. Zero runtime dependencies. Works in
Node.js and the browser. Written in TypeScript, ships ESM, CommonJS and type
declarations.

```ts
import { toHTML } from "@darcas/wa-format";

toHTML("*Hello* _world_");
// => "<b>Hello</b> <i>world</i>"
```

## Install

```sh
npm install @darcas/wa-format
```

## Supported formatting

| Format | WhatsApp syntax | HTML output |
| --- | --- | --- |
| Bold | `*text*` | `<b>text</b>` |
| Italic | `_text_` | `<i>text</i>` |
| Strikethrough | `~text~` | `<s>text</s>` |
| Inline code | `` `text` `` | `<code>text</code>` |
| Code block | ` ```text``` ` | `<pre><code>text</code></pre>` |
| Block quote | `> text` (line start) | `<blockquote>text</blockquote>` |
| Bulleted list | `- text` or `* text` (line start) | `<ul><li>text</li></ul>` |
| Numbered list | `1. text` (line start) | `<ol><li>text</li></ol>` |

Inline styles can be nested and combined in any order:

```ts
toHTML("*_bold italic_*"); // "<b><i>bold italic</i></b>"
toHTML("_*bold italic*_"); // "<i><b>bold italic</b></i>"
```

## Usage

### ESM

```ts
import { toHTML } from "@darcas/wa-format";

const html = toHTML("*Bold*, _italic_, ~strike~ and `code`.");
```

### CommonJS

```js
const { toHTML } = require("@darcas/wa-format");

const html = toHTML("*Bold* and _italic_.");
```

### Browser

```html
<script type="module">
  import { toHTML } from "https://esm.sh/@darcas/wa-format";
  document.querySelector("#message").innerHTML = toHTML("*Hello* _world_");
</script>
```

## API

### `toHTML(input, options?)`

Converts a WhatsApp-formatted string to HTML and returns it.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `style` | `"semantic" \| "legacy"` | `"semantic"` | `semantic` emits `<b>`/`<i>`/`<s>`; `legacy` emits `<strong>`/`<em>`/`<s>`. |
| `lineBreaks` | `boolean` | `true` | Render `\n` as `<br>`. When `false`, newlines are kept as `\n`. |
| `trim` | `boolean` | `false` | Trim leading/trailing whitespace from the input before parsing. |

Empty or whitespace-only input returns `""`. A non-string `input` throws a `TypeError`.

### `parse(input)`

Parses the input into an AST (`Document`) instead of HTML. Useful for custom
rendering or inspection. See [`src/ast.ts`](src/ast.ts) for the node types.

### `renderHtml(document, options)`

Renders a `Document` produced by `parse` to HTML with resolved options.

```ts
import { parse, renderHtml, resolveOptions } from "@darcas/wa-format";

const doc = parse("*Hello*");
const html = renderHtml(doc, resolveOptions());
```

## Behavior notes

Client-side WhatsApp rendering has some undocumented corners. This library uses
the following rules, all covered by tests:

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

## Development

The package has **no runtime dependencies**. `typescript` and `@types/node` are
development-only.

```bash
npm install        # install dev tooling
npm run build      # emit dist/esm (ESM + .d.ts) and dist/cjs (CommonJS)
npm test           # build, then run the node:test suite (50 tests)
npm run typecheck  # type-check src and tests
```

Tests run on the built output (`dist/`). The test runner is the Node.js built-in
`node:test`; no test framework is used.

## License

[MIT](LICENSE)
