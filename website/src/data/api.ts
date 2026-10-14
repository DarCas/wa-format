/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

export interface OptionRow {
    def: string
    desc: string
    name: string
    type: string
}

export interface ApiEntry {
    desc: string
    example: string
    id: string
    label: string
    options: readonly OptionRow[]
    optionsNote: string
    signature: string
}

/**
 * API reference content. Mirrors README §API. Signatures are the contract;
 * option tables are data so `llms-full.txt` cannot drift from the page.
 */
export const API_ENTRIES: readonly ApiEntry[] = [
    {
        desc: "Converts WhatsApp-formatted text to safe HTML. This is the main export — use it to render messages.",
        example: `toHTML("*Bold*, _italic_, ~strike~ and \`code\`.")`,
        id: "toHTML",
        label: "toHTML",
        options: [
            {
                def: `"semantic"`,
                desc: "`semantic` emits `<b>`/`<i>`/`<s>`; `legacy` emits `<strong>`/`<em>`/`<s>`.",
                name: "style",
                type: `"semantic" | "legacy"`,
            },
            {
                def: "true",
                desc: "Render `\\n` as `<br>`. When `false`, newlines are kept as `\\n`.",
                name: "lineBreaks",
                type: "boolean",
            },
            {
                def: "true",
                desc: "Trim leading/trailing whitespace from the input before parsing.",
                name: "trim",
                type: "boolean",
            },
        ],
        optionsNote: `Empty or whitespace-only input returns "". A non-string input throws a TypeError.`,
        signature: "toHTML(input: string, options?: FormatOptions): string",
    },
    {
        desc: "Converts supported HTML back to WhatsApp markup. Best-effort and lossy — the guarantee is HTML idempotence, not byte equality.",
        example: `toWA("<b>Hello</b> <i>world</i>") // "*Hello* _world_"`,
        id: "toWA",
        label: "toWA",
        options: [
            {
                def: `"-"`,
                desc: "Marker used for bulleted lists.",
                name: "bullet",
                type: `"-" | "*"`,
            },
        ],
        optionsNote: "Best-effort and lossy — see the round-trip section. A non-string input throws a TypeError.",
        signature: "toWA(html: string, options?: ToWAOptions): string",
    },
    {
        desc: "Parses WhatsApp-formatted text into an AST instead of HTML. Use it to inspect the structure or to feed a custom renderer.",
        example: `import { parse, renderHtml, resolveOptions } from "@darcas/wa-format"\n\nconst doc = parse("*Hello*")\nconst html = renderHtml(doc, resolveOptions())`,
        id: "parse",
        label: "parse",
        options: [],
        optionsNote: "Input line endings are normalized before parsing.",
        signature: "parse(input: string): Document",
    },
    {
        desc: "Renders a Document produced by parse to HTML. Pair the two when toHTML alone is not enough — for example to parse once and render with several option sets.",
        example: `import { parse, renderHtml, resolveOptions } from "@darcas/wa-format"\n\nrenderHtml(parse("*Hello*"), resolveOptions()) // "<b>Hello</b>"`,
        id: "renderHtml",
        label: "renderHtml",
        options: [],
        optionsNote: "Takes resolved options — see resolveOptions and DEFAULT_OPTIONS.",
        signature: "renderHtml(document: Document, options: ResolvedOptions): string",
    },
    {
        desc: "Parses an HTML fragment into a lightweight node tree. Low-level counterpart of parse on the HTML side, used internally by toWA.",
        example: `import { parseHtml } from "@darcas/wa-format"\n\nparseHtml("<b>Hello</b>") // [{ type: "element", tag: "b", ... }]`,
        id: "parseHtml",
        label: "parseHtml",
        options: [],
        optionsNote: "Low-level building block used by toWA.",
        signature: "parseHtml(html: string): HtmlNode[]",
    },
]
