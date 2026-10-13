/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

export interface Feature {
    copy: string
    glyph: string
    title: string
}

/**
 * Six verifiable properties of the library. No adjectives without a referent:
 * each claim traces to the README or to the source.
 */
export const FEATURES: readonly Feature[] = [
    {
        copy: "The converters import nothing. Only the bundled MCP server pulls the protocol SDK.",
        glyph: "∅",
        title: "Zero dependencies",
    },
    {
        copy: "Same source in Node ≥20 and modern browsers. Ships ESM, CommonJS and TypeScript declarations.",
        glyph: "⇄",
        title: "Isomorphic",
    },
    {
        copy: "Every text node is HTML-escaped; no raw input ever reaches markup.",
        glyph: "✓",
        title: "Safe by default",
    },
    {
        copy: "`*_bold italic_*` and `_*bold italic*_` resolve to the same tree.",
        glyph: "✱",
        title: "Nesting",
    },
    {
        copy: "Markers inside `` `code` `` or ` ```code``` ` stay literal.",
        glyph: "▫",
        title: "Opaque code",
    },
    {
        copy: "`whatsapp_to_html` and `html_to_whatsapp` as tools for Claude, Cursor and Codex.",
        glyph: "◈",
        title: "MCP server",
    },
]
