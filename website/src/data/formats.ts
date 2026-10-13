/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

export interface FormatRow {
    format: string
    html: string
    whatsapp: string
}

/** Mirrors the README "Supported formatting" table. */
export const FORMATS: readonly FormatRow[] = [
    { format: "Bold", html: "<b>text</b>", whatsapp: "*text*" },
    { format: "Italic", html: "<i>text</i>", whatsapp: "_text_" },
    { format: "Strikethrough", html: "<s>text</s>", whatsapp: "~text~" },
    { format: "Inline code", html: "<code>text</code>", whatsapp: "`text`" },
    { format: "Code block", html: "<pre><code>text</code></pre>", whatsapp: "```text```" },
    { format: "Block quote", html: "<blockquote>text</blockquote>", whatsapp: "> text" },
    { format: "Bulleted list", html: "<ul><li>text</li></ul>", whatsapp: "- text or * text" },
    { format: "Numbered list", html: "<ol><li>text</li></ol>", whatsapp: "1. text" },
]

export const BULLET_NOTE = "`*` is both the bold marker and a bullet marker. Disambiguation is positional: `* ` at the start of a line is a list item; a `*` touching text is bold."
