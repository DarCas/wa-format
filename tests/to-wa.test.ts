/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { test } from "node:test"
import assert from "node:assert/strict"
import { parseHtml, toHTML, toWA } from "../dist/esm/index.js"

test("inline styles map to WhatsApp markers", () => {
    assert.equal(toWA("<b>bold</b>"), "*bold*")
    assert.equal(toWA("<strong>bold</strong>"), "*bold*")
    assert.equal(toWA("<i>italic</i>"), "_italic_")
    assert.equal(toWA("<em>italic</em>"), "_italic_")
    assert.equal(toWA("<s>strike</s>"), "~strike~")
    assert.equal(toWA("<strike>strike</strike>"), "~strike~")
    assert.equal(toWA("<del>strike</del>"), "~strike~")
    assert.equal(toWA("<code>code</code>"), "`code`")
})

test("nested inline styles nest their markers", () => {
    assert.equal(toWA("<b><i>both</i></b>"), "*_both_*")
    assert.equal(toWA("<i><b>both</b></i>"), "_*both*_")
    assert.equal(toWA("<b><s>x</s></b>"), "*~x~*")
})

test("styles inside a sentence", () => {
    assert.equal(toWA("<b>Hello</b> <i>world</i>"), "*Hello* _world_")
})

test("whitespace at style edges is moved outside the markers", () => {
    assert.equal(toWA("<b> x </b>"), " *x* ")
    assert.equal(toWA("<b>\tx\t</b>"), "\t*x*\t")
})

test("empty inline elements produce nothing", () => {
    assert.equal(toWA("<b></b>"), "")
})

test("code blocks", () => {
    assert.equal(toWA("<pre><code>code</code></pre>"), "```code```")
    assert.equal(toWA("<pre><code>a\nb</code></pre>"), "```a\nb```")
    assert.equal(toWA("<pre>line1\nline2</pre>"), "```line1\nline2```")
})

test("block quotes prefix every line", () => {
    assert.equal(toWA("<blockquote>quoted</blockquote>"), "> quoted")
    assert.equal(toWA("<blockquote>a<br>b</blockquote>"), "> a\n> b")
    assert.equal(toWA("<blockquote><b>q</b></blockquote>"), "> *q*")
})

test("bulleted lists", () => {
    assert.equal(toWA("<ul><li>one</li><li>two</li></ul>"), "- one\n- two")
    assert.equal(toWA("<ul><li><b>x</b> item</li></ul>"), "- *x* item")
})

test("bullet marker is configurable", () => {
    assert.equal(toWA("<ul><li>x</li></ul>", {bullet: "*"}), "* x")
})

test("numbered lists are numbered explicitly", () => {
    assert.equal(
        toWA("<ol><li>first</li><li>second</li></ol>"),
        "1. first\n2. second",
    )
    assert.equal(toWA('<ol start="3"><li>c</li><li>d</li></ol>'), "3. c\n4. d")
})

test("line breaks", () => {
    assert.equal(toWA("a<br>b"), "a\nb")
    assert.equal(toWA("a<br/>b"), "a\nb")
})

test("entities are decoded", () => {
    assert.equal(toWA("a &amp; b &lt; c"), "a & b < c")
    assert.equal(toWA("&quot;q&quot; &#39;s&#39;"), "\"q\" 's'")
    assert.equal(toWA("&#x1F600;"), "😀")
    assert.equal(toWA("&eacute;"), "&eacute;")
})

test("anchors keep the URL in parentheses", () => {
    assert.equal(toWA('<a href="https://x.y">link</a>'), "link (https://x.y)")
    assert.equal(toWA('<a href="https://x.y"></a>'), "https://x.y")
    assert.equal(toWA("<a>plain</a>"), "plain")
})

test("line containers force line breaks", () => {
    assert.equal(toWA("<p>para</p><p>second</p>"), "para\n\nsecond")
    assert.equal(toWA("<div>a</div><div>b</div>"), "a\n\nb")
})

test("unknown tags are unwrapped", () => {
    assert.equal(toWA("<span>plain</span>"), "plain")
    assert.equal(toWA("<font color=red>x</font>"), "x")
})

test("attributes and comments are ignored", () => {
    assert.equal(toWA('<b class="x" data-y>bold</b>'), "*bold*")
    assert.equal(toWA("<!-- comment -->text"), "text")
})

test("malformed HTML is tolerated", () => {
    assert.equal(toWA("a < b"), "a < b")
    // An unclosed element is implicitly closed at the end of input.
    assert.equal(toWA("<b>unclosed"), "*unclosed*")
    assert.equal(toWA("</b>stray"), "stray")
})

test("empty input returns an empty string", () => {
    assert.equal(toWA(""), "")
    assert.equal(toWA("<br>"), "")
})

test("non-string input throws a TypeError", () => {
    assert.throws(() => toWA(42 as unknown as string), TypeError)
})

test("parseHtml returns a node tree", () => {
    const nodes = parseHtml("<b>a</b>c")

    assert.equal(nodes.length, 2)
    const [first, second] = nodes as [
        {
            children: unknown[],
            tag: string,
            type: string,
        },
        {
            type: string,
            value: string,
        },
    ]

    assert.equal(first.type, "element")
    assert.equal(first.tag, "b")
    assert.deepEqual(first.children, [{type: "text", value: "a"}])
    assert.deepEqual(second, {type: "text", value: "c"})
})

test("HTML round-trips through toHTML and toWA at the HTML level", () => {
    const inputs = [
        "*bold*",
        "_italic_",
        "~strike~",
        "`code`",
        "```block```",
        "*_both_*",
        "_*both*_",
        "hello *world*!",
        "> quote",
        "> a\n> b",
        "- a\n- b",
        "1. one\n2. two",
        "a\nb",
        "a\n\nb",
        "text\n- a\n- b\nmore",
        "*multi\nline*",
        "a < b & c",
        "`*literal*`",
        "*Hello* _world_",
    ]

    for (const input of inputs) {
        const once = toHTML(input)
        const twice = toHTML(toWA(once))

        assert.equal(twice, once, `round-trip failed for ${JSON.stringify(input)}`)
    }
})
