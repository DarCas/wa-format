/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import type { HtmlElement, HtmlNode } from "./dom.js"
import { decodeEntities } from "./entities.js"
import { parseHtml } from "./dom.js"

/** Options accepted by {@link toWA}. */
export interface ToWAOptions {
    /** Marker used for bulleted lists. Default `"-"`. */
    bullet?: "-" | "*"
}

interface ResolvedToWA {
    bullet: "-" | "*"
}

/** Tags that map directly to an inline WhatsApp marker. */
const INLINE_MARKERS: Readonly<Record<string, string>> = {
    b: "*",
    strong: "*",
    i: "_",
    em: "_",
    s: "~",
    strike: "~",
    del: "~",
    code: "`",
}

/** Tags treated as line-level containers (they force a line break). */
const BLOCK_TAGS = new Set([
    "p",
    "div",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
])

function applyMarker(content: string, marker: string): string {
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(content)
    if (match === null) return content
    const lead = match[ 1 ] as string
    const core = match[ 2 ] as string
    const trail = match[ 3 ] as string
    if (core === "") return content
    return `${lead}${marker}${core}${marker}${trail}`
}

/** Concatenates the text of a subtree (used for `<pre>` and raw content). */
function collectText(element: HtmlElement): string {
    let out = ""
    for (const child of element.children) {
        if (child.type === "text") {
            out += decodeEntities(child.value)
        } else if (child.tag === "br") {
            out += "\n"
        } else {
            out += collectText(child)
        }
    }
    return out
}

function renderQuote(element: HtmlElement, options: ResolvedToWA): string {
    const inner = renderNodes(element.children, options)
    return inner
        .split("\n")
        .map((line) => ( line === "" ? ">" : "> " + line ))
        .join("\n")
}

function renderList(element: HtmlElement, options: ResolvedToWA): string {
    const ordered = element.tag === "ol"
    const start = Number.parseInt(element.attrs.start ?? "1", 10)
    const startAt = Number.isFinite(start) ? start : 1

    const lines: string[] = []
    let index = 0
    for (const child of element.children) {
        if (child.type === "element" && child.tag === "li") {
            const marker = ordered ? `${startAt + index}. ` : `${options.bullet} `
            index++
            lines.push(marker + renderNodes(child.children, options))
            continue
        }
        const rendered = renderNodes([child], options)
        if (rendered.trim() !== "") lines.push(rendered)
    }
    return lines.join("\n")
}

function renderAnchor(element: HtmlElement, options: ResolvedToWA): string {
    const inner = renderNodes(element.children, options)
    const href = element.attrs.href
    if (href !== undefined && href !== "") {
        return inner.trim() === "" ? href : `${inner} (${href})`
    }
    return inner
}

function renderElement(element: HtmlElement, options: ResolvedToWA): string {
    const marker = INLINE_MARKERS[ element.tag ]
    if (marker !== undefined) {
        return applyMarker(renderNodes(element.children, options), marker)
    }
    return renderNodes(element.children, options)
}

function renderNodes(nodes: HtmlNode[], options: ResolvedToWA): string {
    let out = ""
    for (const node of nodes) {
        if (node.type === "text") {
            out += decodeEntities(node.value)
            continue
        }
        switch (node.tag) {
            case "br":
                out += "\n"
                break

            case "pre":
                out += "\n```" + collectText(node) + "```\n"
                break

            case "blockquote":
                out += "\n" + renderQuote(node, options) + "\n"
                break

            case "ul":
            case "ol":
                out += "\n" + renderList(node, options) + "\n"
                break

            case "a":
                out += renderAnchor(node, options)
                break

            case "hr":
                out += "\n"
                break

            default:
                if (BLOCK_TAGS.has(node.tag)) {
                    out += "\n" + renderNodes(node.children, options) + "\n"
                } else {
                    out += renderElement(node, options)
                }
        }
    }
    return out
}

function resolveOptions(options?: ToWAOptions): ResolvedToWA {
    return {
        bullet: options?.bullet ?? "-",
    }
}

/**
 * Converts HTML into WhatsApp-formatted text — the inverse of {@link toHTML}.
 *
 * Supported tags: `<b>`/`<strong>`, `<i>`/`<em>`, `<s>`/`<strike>`/`<del>`,
 * `<code>`, `<pre>`, `<blockquote>`, `<ul>`/`<ol>`/`<li>`, `<a href>`, `<br>`,
 * and the line containers `<p>`/`<div>`/`<h1>`–`<h6>`. Unknown tags are
 * unwrapped (their text is kept) and entities are decoded.
 *
 * This direction is **best-effort and lossy**: WhatsApp has no escape
 * character, so a literal `*`/`_`/`~`/`` ` `` in the text, marker runs adjacent
 * to word characters, and code containing backticks cannot be round-tripped
 * exactly. Whitespace at the edges of an inline style is moved outside its
 * markers so the result re-parses as formatted.
 *
 * @example
 * ```ts
 * toWA("<b>Hello</b> <i>world</i>") // "*Hello* _world_"
 * ```
 */
export function toWA(html: string, options?: ToWAOptions): string {
    if (typeof html !== "string") {
        throw new TypeError("wa-format: `html` must be a string")
    }
    const resolved = resolveOptions(options)
    const rendered = renderNodes(parseHtml(html), resolved)

    return rendered.replace(/\n{3,}/g, "\n\n")
        .replace(/^\n+/, "")
        .replace(/\n+$/, "")
}
