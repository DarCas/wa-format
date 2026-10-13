import { test } from "node:test";
import assert from "node:assert/strict";
import { toHTML, parse, renderHtml, resolveOptions, DEFAULT_OPTIONS } from "../dist/esm/index.js";

test("default style uses <b>/<i>/<s>", () => {
  assert.equal(toHTML("*a* _b_ ~c~"), "<b>a</b> <i>b</i> <s>c</s>");
});

test("legacy style uses <strong>/<em>", () => {
  assert.equal(
    toHTML("*a* _b_ ~c~", { style: "legacy" }),
    "<strong>a</strong> <em>b</em> <s>c</s>",
  );
});

test("lineBreaks: false keeps \\n", () => {
  assert.equal(toHTML("a\nb", { lineBreaks: false }), "a\nb");
  assert.equal(toHTML("a\nb", { lineBreaks: true }), "a<br>b");
});

test("trim removes surrounding whitespace", () => {
  assert.equal(toHTML("  *a*  ", { trim: true }), "<b>a</b>");
  assert.equal(toHTML("\n*a*\n", { trim: true }), "<b>a</b>");
});

test("empty and whitespace-only input returns empty string", () => {
  assert.equal(toHTML(""), "");
  assert.equal(toHTML("   "), "");
  assert.equal(toHTML("\n\n"), "");
});

test("non-string input throws a TypeError", () => {
  assert.throws(() => toHTML(42 as unknown as string), TypeError);
});

test("resolveOptions applies defaults", () => {
  assert.deepEqual(resolveOptions(), DEFAULT_OPTIONS);
  assert.deepEqual(resolveOptions({ trim: true }), {
    style: "semantic",
    lineBreaks: true,
    trim: true,
  });
});

test("parse + renderHtml compose to toHTML", () => {
  const doc = parse("*Hello* _world_");
  assert.equal(renderHtml(doc, resolveOptions()), toHTML("*Hello* _world_"));
});

test("parse produces an expected AST shape", () => {
  const doc = parse("*a*");
  assert.equal(doc.children.length, 1);
  const block = doc.children[0] as { type: string; children: unknown[] };
  assert.equal(block.type, "paragraph");
  assert.deepEqual(block.children, [
    { type: "style", style: "bold", children: [{ type: "text", value: "a" }] },
  ]);
});
