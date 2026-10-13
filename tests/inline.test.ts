/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { test } from "node:test"
import assert from "node:assert/strict"
import { toHTML } from "../dist/esm/index.js"

test("single style markers", () => {
    assert.equal(toHTML("*bold*"), "<b>bold</b>")
    assert.equal(toHTML("_italic_"), "<i>italic</i>")
    assert.equal(toHTML("~strike~"), "<s>strike</s>")
})

test("styles inside a sentence", () => {
    assert.equal(toHTML("a *b* c"), "a <b>b</b> c")
    assert.equal(toHTML("*Hello* _world_"), "<b>Hello</b> <i>world</i>")
    assert.equal(toHTML("hello *world*!"), "hello <b>world</b>!")
})

test("multiple independent pairs", () => {
    assert.equal(toHTML("a *b* c *d* e"), "a <b>b</b> c <b>d</b> e")
})

test("nested styles in both orders", () => {
    assert.equal(toHTML("*_x_*"), "<b><i>x</i></b>")
    assert.equal(toHTML("_*x*_"), "<i><b>x</b></i>")
    assert.equal(toHTML("~*x*~"), "<s><b>x</b></s>")
    assert.equal(toHTML("*~x~*"), "<b><s>x</s></b>")
})

test("three-level nesting", () => {
    assert.equal(toHTML("*_~x~_*"), "<b><i><s>x</s></i></b>")
})

test("adjacent pairs close and reopen", () => {
    assert.equal(toHTML("*a**b*"), "<b>a</b><b>b</b>")
    assert.equal(toHTML("*bold*_italic_"), "<b>bold</b><i>italic</i>")
})

test("spaces inside markers disable formatting", () => {
    assert.equal(toHTML("a * b * c"), "a * b * c")
    assert.equal(toHTML("a _ b _ c"), "a _ b _ c")
    assert.equal(toHTML("a ~ b ~ c"), "a ~ b ~ c")
})

test("markers inside words stay literal (snake_case)", () => {
    assert.equal(toHTML("snake_case_name"), "snake_case_name")
    assert.equal(toHTML("word_under_score"), "word_under_score")
    assert.equal(toHTML("a*b*c"), "a*b*c")
    assert.equal(toHTML("2*3*4"), "2*3*4")
})

test("markers at word boundaries are recognized after punctuation", () => {
    assert.equal(toHTML("*bold*."), "<b>bold</b>.")
    assert.equal(toHTML("(*bold*)"), "(<b>bold</b>)")
    assert.equal(toHTML("[x *y* z]"), "[x <b>y</b> z]")
})

test("unbalanced markers stay literal", () => {
    assert.equal(toHTML("*unclosed"), "*unclosed")
    assert.equal(toHTML("closing*"), "closing*")
    assert.equal(toHTML("a _b"), "a _b")
})

test("empty markers stay literal", () => {
    assert.equal(toHTML("**"), "**")
    assert.equal(toHTML("__"), "__")
    assert.equal(toHTML("~~"), "~~")
})

test("spans can cross a line break", () => {
    assert.equal(toHTML("*a\nb*"), "<b>a<br>b</b>")
    assert.equal(toHTML("_x\ny_"), "<i>x<br>y</i>")
})

test("unicode letters are word characters", () => {
    assert.equal(toHTML("àèì *città* ò"), "àèì <b>città</b> ò")
    assert.equal(toHTML("emoji 😀 *bold 😀*"), "emoji 😀 <b>bold 😀</b>")
})

test("code span is opaque", () => {
    assert.equal(toHTML("`code`"), "<code>code</code>")
    assert.equal(toHTML("`*not bold*`"), "<code>*not bold*</code>")
    assert.equal(toHTML("`a_b_c`"), "<code>a_b_c</code>")
})

test("unterminated code span stays literal", () => {
    assert.equal(toHTML("`unterminated"), "`unterminated")
})
