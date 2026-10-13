/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import type { BlockNode, Document, InlineNode } from "./ast.js"
import { escapeHtml } from "./escape.js"
import type { ResolvedOptions } from "./options.js"

const STYLE_TAGS: Readonly<Record<ResolvedOptions["style"], Readonly<Record<string, string>>>> = {
    legacy: {
        bold: "strong",
        italic: "em",
        strike: "s",
    },
    semantic: {
        bold: "b",
        italic: "i",
        strike: "s",
    },
}

function renderInline(nodes: InlineNode[], options: ResolvedOptions): string {
    let out = ""
    for (const node of nodes) {
        switch (node.type) {
            case "text":
                out += escapeHtml(node.value)
                break

            case "br":
                out += options.lineBreaks ? "<br>" : "\n"
                break

            case "code":
                out += `<code>${escapeHtml(node.value)}</code>`
                break

            case "codeBlock":
                out += `<pre><code>${escapeHtml(node.value)}</code></pre>`
                break

            case "style": {
                const tag = STYLE_TAGS[ options.style ][ node.style ] as string
                out += `<${tag}>${renderInline(node.children, options)}</${tag}>`
                break
            }
        }
    }
    return out
}

function renderBlock(node: BlockNode, options: ResolvedOptions): string {
    switch (node.type) {
        case "paragraph":
            return renderInline(node.children, options)

        case "quote":
            return `<blockquote>${renderInline(node.children, options)}</blockquote>`

        case "codeBlock":
            return `<pre><code>${escapeHtml(node.value)}</code></pre>`

        case "list": {
            const tag = node.ordered ? "ol" : "ul"
            const items = node.items
                .map((item) => `<li>${renderInline(item, options)}</li>`)
                .join("")
            
            return `<${tag}>${items}</${tag}>`
        }
    }
}

/** Renders a parsed {@link Document} to an HTML string. */
export function renderHtml(doc: Document, options: ResolvedOptions): string {
    let out = ""
    for (const block of doc.children) {
        out += renderBlock(block, options)
    }

    return out
}
