/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Minimal tokenizers for the converter output.
 *
 * Deliberately produces plain data that is rendered as React children, never as HTML:
 * the output pane must not become an injection path for its own page. Shiki handles the
 * static code samples at build time; this only colours live converter output.
 */

export type TokenKind = 'attr' | 'keyword' | 'markup' | 'plain' | 'string'

export interface Token {
    kind: TokenKind
    text: string
}

const TAG_PATTERN = /<(\/?)([a-zA-Z][\w-]*)([^<>]*?)(\/?)>/g
const ATTR_PATTERN = /([A-Za-z_:][\w:.-]*)(=)?("[^"]*"|'[^']*'|[^\s]+)?/g
const WA_PATTERN = /(```[\s\S]*?```)|(`[^`\n]+`)|(\*\*?[^*\n]+\*\*?)|(~~[^~\n]+~~)|(_[^_\n]+_)|(^[>*-]\s)|(^(\d{1,2})\.\s)/gm

function pushPlain(tokens: Token[], text: string): void {
    if (text === '') {
        return
    }

    const last = tokens[tokens.length - 1]

    if (last && last.kind === 'plain') {
        last.text += text
        return
    }

    tokens.push({ kind: 'plain', text })
}

/** Splits an HTML fragment into tag / attribute / value / plain runs. */
export function tokenizeHtml(source: string): Token[] {
    const tokens: Token[] = []
    let cursor = 0

    for (const tag of source.matchAll(TAG_PATTERN)) {
        pushPlain(tokens, source.slice(cursor, tag.index))
        cursor = tag.index + tag[0].length

        tokens.push({ kind: 'markup', text: `<${tag[1]}` })
        tokens.push({ kind: 'keyword', text: tag[2] })

        const inner = tag[3] ?? ''
        let innerCursor = 0

        for (const attr of inner.matchAll(ATTR_PATTERN)) {
            pushPlain(tokens, inner.slice(innerCursor, attr.index))
            innerCursor = attr.index + attr[0].length

            tokens.push({ kind: 'attr', text: attr[1] })

            if (attr[2]) {
                tokens.push({ kind: 'plain', text: attr[2] })
                tokens.push({ kind: 'string', text: attr[3] })
            }
        }

        pushPlain(tokens, inner.slice(innerCursor))
        tokens.push({ kind: 'markup', text: `>${tag[4]}` })
    }

    pushPlain(tokens, source.slice(cursor))

    return tokens
}

/** Splits WhatsApp markup into marker runs so the raw source can be tinted. */
export function tokenizeWhatsApp(source: string): Token[] {
    const tokens: Token[] = []
    let cursor = 0

    for (const match of source.matchAll(WA_PATTERN)) {
        pushPlain(tokens, source.slice(cursor, match.index))
        cursor = match.index + match[0].length

        // Groups 1-5 are inline markers; group 6 or 7 is a line-level list/quote marker.
        const isLineMarker = Boolean(match[6]) || match[8] !== undefined

        tokens.push({ kind: isLineMarker ? 'keyword' : 'markup', text: match[0] })
    }

    pushPlain(tokens, source.slice(cursor))

    return tokens
}