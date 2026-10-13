/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { test } from "node:test"
import assert from "node:assert/strict"
import {
    createServer,
    HTML_TO_WHATSAPP,
    runHtmlToWhatsapp,
    runWhatsappToHtml,
    WHATSAPP_TO_HTML,
} from "../dist/esm/mcp/server.js"

interface TextResult {
    content: { type: string; text: string }[]
    isError?: boolean
}

function textOf(result: TextResult): string {
    return result.content[ 0 ].text
}

test("tool names are stable", () => {
    assert.equal(WHATSAPP_TO_HTML, "whatsapp_to_html")
    assert.equal(HTML_TO_WHATSAPP, "html_to_whatsapp")
})

test("runWhatsappToHtml converts a message", () => {
    const result = runWhatsappToHtml({text: "*Hello* _world_"}) as TextResult
    assert.deepEqual(result.content, [{type: "text", text: "<b>Hello</b> <i>world</i>"}])
})

test("runWhatsappToHtml forwards options", () => {
    assert.equal(textOf(runWhatsappToHtml({text: "a\nb", lineBreaks: false}) as TextResult), "a\nb")
    assert.equal(textOf(runWhatsappToHtml({
        text: "*x*",
        style: "legacy",
    }) as TextResult), "<strong>x</strong>")
    assert.equal(textOf(runWhatsappToHtml({text: "  *x*  ", trim: true}) as TextResult), "<b>x</b>")
})

test("runWhatsappToHtml keeps WhatsApp formatting", () => {
    const result = runWhatsappToHtml({text: "> quoted\n- one\n- two"}) as TextResult
    assert.equal(textOf(result), "<blockquote>quoted</blockquote><ul><li>one</li><li>two</li></ul>")
})

test("runHtmlToWhatsapp converts HTML", () => {
    assert.equal(textOf(runHtmlToWhatsapp({html: "<b>Hello</b> <i>world</i>"}) as TextResult), "*Hello* _world_")
    assert.equal(textOf(runHtmlToWhatsapp({html: "<ul><li>one</li><li>two</li></ul>"}) as TextResult), "- one\n- two")
    assert.equal(textOf(runHtmlToWhatsapp({
        html: "<ul><li>one</li></ul>",
        bullet: "*",
    }) as TextResult), "* one")
})

test("tool failures are reported as MCP errors", () => {
    const result = runWhatsappToHtml({text: 42 as unknown as string}) as TextResult
    assert.equal(result.isError, true)
    assert.match(textOf(result), /must be a string/)
})

test("createServer returns an MCP server", () => {
    const server = createServer()
    assert.equal(typeof server.connect, "function")
})
