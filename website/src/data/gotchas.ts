/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

export interface Gotcha {
    input: string
    output: string
    why: string
}

/** The rules that surprise people, stated as input → output → reason. */
export const GOTCHAS: readonly Gotcha[] = [
    { input: "*bold*", output: "<b>bold</b>", why: "marker touches its content" },
    { input: "* bold *", output: "literal", why: "space between marker and text" },
    { input: "snake_case", output: "literal", why: "opening marker is inside a word" },
    { input: "`*not bold*`", output: "<code>*not bold*</code>", why: "code is opaque" },
    { input: "2*3*4", output: "literal", why: "marker inside a word" },
    { input: "- text", output: "<ul><li>text</li></ul>", why: "marker + space at line start" },
    { input: "-text", output: "literal", why: "list marker requires a space" },
]
