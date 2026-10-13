/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Abstract syntax tree produced by {@link parse}.
 *
 * The tree has two levels: a document contains block nodes, and block nodes
 * contain inline nodes. Inline styles can nest, so inline nodes form a tree too.
 */

/** The three nestable inline styles made of a pairing marker. */
export type InlineStyle = "bold" | "italic" | "strike"

/** Literal text. `value` is raw (not HTML-escaped). */
export interface TextNode {
    type: "text"
    value: string
}

/** A line break (a `\n` in the source that is not inside code). */
export interface BreakNode {
    type: "br"
}

/** Inline monospace: `` `value` ``. */
export interface CodeNode {
    type: "code"
    value: string
}

/** Monospace block: ` ```value``` `. */
export interface CodeBlockNode {
    type: "codeBlock"
    value: string
}

/** A nestable inline style wrapping its children. */
export interface StyleNode {
    children: InlineNode[]
    style: InlineStyle
    type: "style"
}

export type InlineNode = TextNode | BreakNode | CodeNode | CodeBlockNode | StyleNode

/** A run of consecutive plain lines, joined by line breaks. */
export interface ParagraphNode {
    children: InlineNode[]
    type: "paragraph"
}

/** One or more consecutive block quote lines (`> ...`). */
export interface QuoteNode {
    children: InlineNode[]
    type: "quote"
}

/** One or more consecutive list items. */
export interface ListNode {
    items: InlineNode[][]
    ordered: boolean
    type: "list"
}

export type BlockNode = ParagraphNode | QuoteNode | ListNode | CodeBlockNode

/** The root of a parsed message. */
export interface Document {
    children: BlockNode[]
}
