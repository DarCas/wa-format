/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/** Common named HTML entities. Rarer ones are left as written. */
const NAMED: Readonly<Record<string, string>> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: "\u00a0",
    copy: "\u00a9",
    reg: "\u00ae",
    trade: "\u2122",
    hellip: "\u2026",
    mdash: "\u2014",
    ndash: "\u2013",
    lsquo: "\u2018",
    rsquo: "\u2019",
    ldquo: "\u201c",
    rdquo: "\u201d",
    laquo: "\u00ab",
    raquo: "\u00bb",
    times: "\u00d7",
    divide: "\u00f7",
    deg: "\u00b0",
    euro: "\u20ac",
    pound: "\u00a3",
    middot: "\u00b7",
    bull: "\u2022",
}

const ENTITY = /&(#[xX]?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g

/** Decodes HTML character references (numeric and a small set of named ones). */
export function decodeEntities(text: string): string {
    return text.replace(ENTITY, (match, body: string) => {
        if (body.charCodeAt(0) === 35 /* # */) {
            const hex = body[ 1 ] === "x" || body[ 1 ] === "X"
            const code = Number.parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10)

            if (!Number.isFinite(code) ||
                code < 0 ||
                code > 0x10ffff
            ) return match

            return String.fromCodePoint(code)
        }

        return NAMED[ body ] ?? match
    })
}
