/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * A tiny, dependency-free HTML parser.
 *
 * It is deliberately tolerant: it targets the well-formed output of
 * {@link toHTML} and common editor markup, not the full HTML5 parsing
 * algorithm. Unknown tags are kept as nodes (the renderer decides what to do
 * with them); attributes are preserved as a lower-cased map.
 */

export interface HtmlElement {
    attrs: Record<string, string>
    children: HtmlNode[]
    /** Lower-cased tag name. */
    tag: string
    type: "element"
}

export interface HtmlText {
    type: "text"
    value: string
}

export type HtmlNode = HtmlElement | HtmlText

const VOID_TAGS = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
])

const TAG_NAME = /^[a-zA-Z][a-zA-Z0-9:-]*/
const ATTR_NAME = /^[^\s=/>]+/
const ATTR_VALUE = /^[^\s>]+/

interface OpenTag {
    attrs: Record<string, string>
    /** Index just past the closing `>`. */
    end: number
    selfClosing: boolean
    tag: string
}

/** Parses an opening tag starting at `start` (which points at `<`). */
function parseOpenTag(html: string, start: number): OpenTag | null {
    const nameMatch = TAG_NAME.exec(html.slice(start + 1))
    if (nameMatch === null) return null

    const tag = nameMatch[ 0 ].toLowerCase()
    const attrs: Record<string, string> = {}
    let i = start + 1 + nameMatch[ 0 ].length

    while (i < html.length) {
        while (i < html.length && /\s/.test(html[ i ] as string)) i++
        if (i >= html.length) return null

        const ch = html[ i ] as string
        if (ch === ">") return {
            attrs,
            end: i + 1,
            selfClosing: false,
            tag,
        }

        if (ch === "/") {
            if (html[ i + 1 ] === ">") return {
                attrs,
                end: i + 2,
                selfClosing: true,
                tag,
            }
            i++

            continue
        }

        const attrMatch = ATTR_NAME.exec(html.slice(i))
        if (attrMatch === null) {
            i++

            continue
        }

        const name = attrMatch[ 0 ].toLowerCase()
        i += attrMatch[ 0 ].length

        const before = i
        while (i < html.length && /\s/.test(html[ i ] as string)) i++

        if (html[ i ] !== "=") {
            attrs[ name ] = ""
            i = before

            continue
        }

        i++

        while (i < html.length && /\s/.test(html[ i ] as string)) i++

        const quote = html[ i ]
        if (quote === '"' ||
            quote === "'"
        ) {
            const close = html.indexOf(quote, i + 1)
            if (close === -1) return null

            attrs[ name ] = html.slice(i + 1, close)
            i = close + 1
        } else {
            const valueMatch = ATTR_VALUE.exec(html.slice(i))
            attrs[ name ] = valueMatch === null ? "" : valueMatch[ 0 ]
            i += valueMatch === null ? 0 : valueMatch[ 0 ].length
        }
    }

    return null
}

function appendText(parent: HtmlElement, value: string): void {
    if (value === "") return

    const last = parent.children[ parent.children.length - 1 ]
    if (last !== undefined &&
        last.type === "text"
    ) {
        last.value += value
    } else {
        parent.children.push({
            type: "text",
            value,
        })
    }
}

function closeElement(stack: HtmlElement[], tag: string): void {
    for (let k = stack.length - 1; k >= 1; k--) {
        if (( stack[ k ] as HtmlElement ).tag === tag) {
            stack.length = k

            return
        }
    }
    // Unmatched close tag: ignore it.
}

/**
 * Parses an HTML fragment into a list of top-level nodes.
 */
export function parseHtml(html: string): HtmlNode[] {
    const root: HtmlElement = {
        attrs: {},
        children: [],
        tag: "#root",
        type: "element",
    }
    const stack: HtmlElement[] = [root]
    const n = html.length
    let i = 0

    while (i < n) {
        const lt = html.indexOf("<", i)
        if (lt === -1) {
            appendText(stack[ stack.length - 1 ] as HtmlElement, html.slice(i))
            break
        }

        if (lt > i) appendText(stack[ stack.length - 1 ] as HtmlElement, html.slice(i, lt))

        if (html.startsWith("<!--", lt)) {
            const end = html.indexOf("-->", lt + 4)
            i = end === -1 ? n : end + 3

            continue
        }

        if (html.startsWith("<!", lt) ||
            html.startsWith("<?", lt)
        ) {
            const end = html.indexOf(">", lt)
            i = end === -1 ? n : end + 1

            continue
        }

        if (html.startsWith("</", lt)) {
            const end = html.indexOf(">", lt)
            if (end === -1) {
                appendText(stack[ stack.length - 1 ] as HtmlElement, "<")
                i = lt + 1

                continue
            }

            closeElement(stack, html.slice(lt + 2, end).trim().toLowerCase())
            i = end + 1

            continue
        }

        const opened = parseOpenTag(html, lt)
        if (opened === null) {
            appendText(stack[ stack.length - 1 ] as HtmlElement, "<")
            i = lt + 1

            continue
        }

        const element: HtmlElement = {
            attrs: opened.attrs,
            children: [],
            tag: opened.tag,
            type: "element",
        };

        ( stack[ stack.length - 1 ] as HtmlElement ).children.push(element)

        if (!opened.selfClosing && !VOID_TAGS.has(opened.tag)) {
            stack.push(element)
        }

        i = opened.end
    }

    return root.children
}
