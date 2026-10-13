/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { test } from "node:test"
import assert from "node:assert/strict"
import { toHTML } from "../dist/esm/index.js"

test("angle brackets and ampersands are escaped", () => {
    assert.equal(toHTML("a < b & c > d"), "a &lt; b &amp; c &gt; d")
})

test("quotes are escaped", () => {
    assert.equal(toHTML("\"double\" 'single'"), "&quot;double&quot; &#39;single&#39;")
})

test("escaping applies inside bold", () => {
    assert.equal(toHTML("*<b>&</b>*"), "<b>&lt;b&gt;&amp;&lt;/b&gt;</b>")
})

test("escaping applies inside code", () => {
    assert.equal(toHTML("`<div>`"), "<code>&lt;div&gt;</code>")
})

test("HTML injection is neutralized", () => {
    assert.equal(
        toHTML("<script>alert(1)</script>"),
        "&lt;script&gt;alert(1)&lt;/script&gt;",
    )
})
