/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

export interface TagMapping {
    html: string
    whatsapp: string
}

/** Tag mapping for the `toWA` direction, from README §`toWA`. */
export const TAG_MAPPINGS: readonly TagMapping[] = [
    { html: "<b>, <strong>", whatsapp: "*text*" },
    { html: "<i>, <em>", whatsapp: "_text_" },
    { html: "<s>, <strike>, <del>", whatsapp: "~text~" },
    { html: "<code>", whatsapp: "`text`" },
    { html: "<pre>", whatsapp: "```text```" },
    { html: "<blockquote>", whatsapp: "> text" },
    { html: "<ul>, <li>", whatsapp: "- text" },
    { html: "<ol>, <li>", whatsapp: "1. text" },
    { html: "<a href>", whatsapp: "text (url)" },
    { html: "<br>", whatsapp: "line break" },
    { html: "<p>, <div>, <h1>–<h6>", whatsapp: "line containers" },
]

export const ROUND_TRIP_LIMITS: readonly string[] = [
    "Literal marker characters have nowhere to hide — WhatsApp defines no escape character.",
    "Markers adjacent to word characters cannot round-trip: <b>a</b>b becomes *a*b, which parses as literal.",
    "Backticks inside code cannot round-trip: code is opaque, and its fence is structural.",
    "Whitespace at the edges of a style is moved outside its markers.",
]
