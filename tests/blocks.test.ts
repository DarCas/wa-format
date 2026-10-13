/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { test } from "node:test"
import assert from "node:assert/strict"
import { toHTML } from "../dist/esm/index.js"

test("single block quote line", () => {
    assert.equal(toHTML("> quoted"), "<blockquote>quoted</blockquote>")
})

test("consecutive quote lines are grouped with <br>", () => {
    assert.equal(
        toHTML("> line one\n> line two"),
        "<blockquote>line one<br>line two</blockquote>",
    )
})

test("quotes separated by plain text are separate blocks", () => {
    assert.equal(
        toHTML("> a\nplain\n> b"),
        "<blockquote>a</blockquote>plain<blockquote>b</blockquote>",
    )
})

test("quote content is inline-parsed", () => {
    assert.equal(
        toHTML("> *bold* quote"),
        "<blockquote><b>bold</b> quote</blockquote>",
    )
})

test("bulleted list with hyphen", () => {
    assert.equal(toHTML("- one\n- two"), "<ul><li>one</li><li>two</li></ul>")
})

test("bulleted list with asterisk", () => {
    assert.equal(toHTML("* one\n* two"), "<ul><li>one</li><li>two</li></ul>")
})

test("numbered list", () => {
    assert.equal(
        toHTML("1. first\n2. second\n3. third"),
        "<ol><li>first</li><li>second</li><li>third</li></ol>",
    )
})

test("numbered list accepts two-digit numbers", () => {
    assert.equal(toHTML("10. ten"), "<ol><li>ten</li></ol>")
    assert.equal(toHTML("100. hundred"), "100. hundred")
})

test("list requires a space after the marker", () => {
    assert.equal(toHTML("-no space"), "-no space")
    assert.equal(toHTML("*nospace"), "*nospace")
    assert.equal(toHTML("1.nospace"), "1.nospace")
})

test("list items are inline-parsed", () => {
    assert.equal(
        toHTML("- *bold* item\n- _italic_ item"),
        "<ul><li><b>bold</b> item</li><li><i>italic</i> item</li></ul>",
    )
})

test("changing list type starts a new list", () => {
    assert.equal(
        toHTML("- a\n1. b"),
        "<ul><li>a</li></ul><ol><li>b</li></ol>",
    )
})

test("single-line code block", () => {
    assert.equal(toHTML("```code```"), "<pre><code>code</code></pre>")
})

test("multi-line code block", () => {
    assert.equal(
        toHTML("```\na\nb\n```"),
        "<pre><code>a\nb</code></pre>",
    )
})

test("code block content is opaque", () => {
    assert.equal(
        toHTML("```*not bold*```"),
        "<pre><code>*not bold*</code></pre>",
    )
})

test("fence without a closing marker is literal", () => {
    assert.equal(toHTML("```no close"), "```no close")
})

test("newlines become <br>", () => {
    assert.equal(toHTML("line1\nline2"), "line1<br>line2")
})

test("blank lines are preserved", () => {
    assert.equal(toHTML("a\n\nb"), "a<br><br>b")
})

test("plain text around a list", () => {
    assert.equal(
        toHTML("text\n- a\n- b\nmore"),
        "text<ul><li>a</li><li>b</li></ul>more",
    )
})
