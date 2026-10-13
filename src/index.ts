/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import type { FormatOptions } from "./options.js"
import { resolveOptions } from "./options.js"
import { parse } from "./parser.js"
import { renderHtml } from "./renderer.js"

export { parse } from "./parser.js"
export { renderHtml } from "./renderer.js"
export { resolveOptions, DEFAULT_OPTIONS } from "./options.js"
export { toWA } from "./html/to-wa.js"
export type { ToWAOptions } from "./html/to-wa.js"
export { parseHtml } from "./html/dom.js"
export type { HtmlElement, HtmlNode, HtmlText } from "./html/dom.js"
export type { FormatOptions, ResolvedOptions } from "./options.js"
export type {
    BlockNode,
    BreakNode,
    CodeBlockNode,
    CodeNode,
    Document,
    InlineNode,
    InlineStyle,
    ListNode,
    ParagraphNode,
    QuoteNode,
    StyleNode,
    TextNode,
} from "./ast.js"

/**
 * Converts a WhatsApp-formatted message into HTML.
 *
 * Supported formatting: `*bold*`, `_italic_`, `~strikethrough~`, `` `code` ``,
 * ` ```code block``` `, `> block quote`, `- `/`* ` bulleted lists and
 * `1. ` numbered lists. Inline styles can be nested and combined.
 *
 * All text is HTML-escaped; the output is safe to inject into a container
 * element. Empty or whitespace-only input returns `""`.
 *
 * @example
 * ```ts
 * toHTML("*Hello* _world_") // "<b>Hello</b> <i>world</i>"
 * ```
 */
export function toHTML(input: string, options?: FormatOptions): string {
    if (typeof input !== "string") {
        throw new TypeError("wa-format: `input` must be a string")
    }

    const resolved = resolveOptions(options)
    const source = resolved.trim ? input.trim() : input
    if (source.trim() === "") return ""

    return renderHtml(parse(source), resolved)
}
