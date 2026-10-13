/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { test } from "node:test"
import assert from "node:assert/strict"
import { toHTML } from "../dist/esm/index.js"

test("a rich message with every construct", () => {
    const input = [
        "*Welcome* 👋",
        "",
        "1. First step",
        "2. Second step",
        "",
        "```",
        "npm install wa-format",
        "```",
        "",
        "> _Note_: works in *Node* and the *browser*.",
    ].join("\n")

    assert.equal(
        toHTML(input),
        "<b>Welcome</b> 👋<br><ol><li>First step</li><li>Second step</li></ol>" +
        "<pre><code>npm install wa-format</code></pre>" +
        "<blockquote><i>Note</i>: works in <b>Node</b> and the <b>browser</b>.</blockquote>",
    )
})

test("an order-summary style message", () => {
    const input = [
        "*Riepilogo ordine*",
        "",
        "Grazie per l'ordine! Ecco i dettagli:",
        "",
        "- Prodotti: _3_",
        "- Totale: ~€ 40,00~ *€ 35,00*",
        "",
        "> Consegna prevista: lunedì",
        "",
        "Codice: `ORD-123`",
    ].join("\n")

    assert.equal(
        toHTML(input),
        "<b>Riepilogo ordine</b><br><br>Grazie per l&#39;ordine! Ecco i dettagli:<br>" +
        "<ul><li>Prodotti: <i>3</i></li><li>Totale: <s>€ 40,00</s> <b>€ 35,00</b></li></ul>" +
        "<blockquote>Consegna prevista: lunedì</blockquote><br>Codice: <code>ORD-123</code>",
    )
})

test("Windows line endings are normalized", () => {
    assert.equal(toHTML("a\r\nb"), "a<br>b")
    assert.equal(toHTML("a\rb"), "a<br>b")
})
