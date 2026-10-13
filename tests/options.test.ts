/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { test } from "node:test"
import assert from "node:assert/strict"
import { DEFAULT_OPTIONS, parse, renderHtml, resolveOptions, toHTML } from "../dist/esm/index.js"

test("default style uses <b>/<i>/<s>", () => {
    assert.equal(toHTML("*a* _b_ ~c~"), "<b>a</b> <i>b</i> <s>c</s>")
})

test("legacy style uses <strong>/<em>", () => {
    assert.equal(
        toHTML("*a* _b_ ~c~", {style: "legacy"}),
        "<strong>a</strong> <em>b</em> <s>c</s>",
    )
})

test("lineBreaks: false keeps \\n", () => {
    assert.equal(toHTML("a\nb", {lineBreaks: false}), "a\nb")
    assert.equal(toHTML("a\nb", {lineBreaks: true}), "a<br>b")
})

test("trim is enabled by default", () => {
    assert.equal(toHTML("  *a*  "), "<b>a</b>")
    assert.equal(toHTML("\n*a*\n"), "<b>a</b>")
})

test("trim: false keeps surrounding whitespace", () => {
    assert.equal(toHTML("  *a*  ", {trim: false}), "  <b>a</b>  ")
    assert.equal(toHTML("\n*a*\n", {trim: false}), "<br><b>a</b><br>")
})

test("empty and whitespace-only input returns empty string", () => {
    assert.equal(toHTML(""), "")
    assert.equal(toHTML("   "), "")
    assert.equal(toHTML("\n\n"), "")
})

test("non-string input throws a TypeError", () => {
    assert.throws(() => toHTML(42 as unknown as string), TypeError)
})

test("resolveOptions applies defaults", () => {
    assert.deepEqual(resolveOptions(), DEFAULT_OPTIONS)
    assert.deepEqual(
        resolveOptions({trim: true}),
        {
            lineBreaks: true,
            style: "semantic",
            trim: true,
        },
    )
})

test("parse + renderHtml compose to toHTML", () => {
    const doc = parse("*Hello* _world_")

    assert.equal(renderHtml(doc, resolveOptions()), toHTML("*Hello* _world_"))
})

test("parse produces an expected AST shape", () => {
    const doc = parse("*a*")

    assert.equal(doc.children.length, 1)
    const block = doc.children[ 0 ] as { type: string, children: unknown[] }

    assert.equal(block.type, "paragraph")
    assert.deepEqual(block.children, [
        {type: "style", style: "bold", children: [{type: "text", value: "a"}]},
    ])
})
