/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import type { BlockNode, InlineNode } from "./ast.js"
import { BULLET_MARKERS, CODE_BLOCK_MARKER, QUOTE_MARKER } from "./constants.js"
import { parseInline } from "./inline.js"

interface ListItem {
    content: string
    ordered: boolean
}

/** A line that opens a ` ``` ` code block. */
function isFenceStart(line: string): boolean {
    return line.startsWith(CODE_BLOCK_MARKER)
}

/** A block quote line: `>` optionally followed by a space and content. */
function isQuoteLine(line: string): boolean {
    return line === QUOTE_MARKER || line.startsWith(QUOTE_MARKER + " ")
}

/** The content of a quote line, with the `> ` prefix removed. */
function quoteLineContent(line: string): string {
    return line === QUOTE_MARKER ? "" : line.slice(QUOTE_MARKER.length + 1)
}

const NUMBERED_ITEM = /^\d{1,2}\. (.*)$/

/** Matches a list item line, or returns `null`. */
function matchListItem(line: string): ListItem | null {
    for (const marker of BULLET_MARKERS) {
        const prefix = marker + " "

        if (line.startsWith(prefix)) {
            return {
                content: line.slice(prefix.length),
                ordered: false,
            }
        }
    }

    const numbered = NUMBERED_ITEM.exec(line)
    if (numbered !== null) {
        return {
            content: numbered[ 1 ] as string,
            ordered: true,
        }
    }

    return null
}

interface CodeBlockResult {
    /** Index of the line after the closing fence. */
    next: number
    value: string
}

/**
 * Reads a ` ``` ` fenced block starting at `start`.
 * Returns `null` when there is no closing fence (the fence is then literal).
 */
function readCodeBlock(lines: string[], start: number): CodeBlockResult | null {
    const first = lines[ start ] as string
    const tail = first.slice(CODE_BLOCK_MARKER.length)

    const sameLine = tail.indexOf(CODE_BLOCK_MARKER)
    if (sameLine !== -1) {
        return {
            value: tail.slice(0, sameLine),
            next: start + 1,
        }
    }

    const interior: string[] = []
    if (tail !== "") interior.push(tail)

    let j = start + 1
    while (j < lines.length) {
        const line = lines[ j ] as string
        const closeAt = line.indexOf(CODE_BLOCK_MARKER)

        if (closeAt !== -1) {
            const head = line.slice(0, closeAt)
            if (head !== "") interior.push(head)

            return {
                value: interior.join("\n"),
                next: j + 1,
            }
        }

        interior.push(line)
        j++
    }

    return null
}

/**
 * Parses the block structure (paragraphs, quotes, lists, code blocks) of a
 * newline-normalized message.
 */
export function parseBlocks(text: string): BlockNode[] {
    const lines = text.split("\n")
    const blocks: BlockNode[] = []
    let i = 0

    while (i < lines.length) {
        const line = lines[ i ] as string

        if (isFenceStart(line)) {
            const block = readCodeBlock(lines, i)
            if (block !== null) {
                blocks.push({
                    type: "codeBlock",
                    value: block.value,
                })
                i = block.next

                continue
            }

            // No closing fence: the fence marker is literal text.
            blocks.push({
                type: "paragraph",
                children: parseInline(line),
            })
            i++

            continue
        }

        if (isQuoteLine(line)) {
            const parts: string[] = []
            while (i < lines.length && isQuoteLine(lines[ i ] as string)) {
                parts.push(quoteLineContent(lines[ i ] as string))
                i++
            }

            blocks.push({
                type: "quote",
                children: parseInline(parts.join("\n")),
            })
            continue
        }

        const first = matchListItem(line)
        if (first !== null) {
            const ordered = first.ordered
            const items: InlineNode[][] = []

            while (i < lines.length) {
                const item = matchListItem(lines[ i ] as string)
                if (item === null || item.ordered !== ordered) break
                items.push(parseInline(item.content))
                i++
            }

            blocks.push({
                type: "list",
                ordered,
                items,
            })

            continue
        }

        const parts: string[] = []
        while (i < lines.length) {
            const current = lines[ i ] as string
            if (isFenceStart(current) ||
                isQuoteLine(current) ||
                matchListItem(current) !== null
            ) {
                break
            }

            parts.push(current)
            i++
        }

        if (parts.length === 0) {
            // Defensive: never loop forever.
            parts.push(line)
            i++
        }

        blocks.push({
            type: "paragraph",
            children: parseInline(parts.join("\n")),
        })
    }

    return blocks
}
