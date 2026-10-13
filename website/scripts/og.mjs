/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Renders the Open Graph card (1200×630) to `dist/og.png` after the Vite build, so the
 * preview image always matches the current version and palette.
 *
 * Fail-soft: a missing renderer or font set must never break the site build, only the
 * social preview.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const target = resolve(root, 'dist/og.png')
const factsFile = resolve(root, 'src/generated/facts.json')

const FONT_FILES = [
    'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
    'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
]

const COLORS = {
    accent: '#2fd07a',
    accentDim: '#1b8a4f',
    bg: '#0b0d0e',
    ink: '#e9edf0',
    ink3: '#7f8b94',
    line: '#262d33',
    paper: '#efe9dd',
}

const DISPLAY = 'Space Grotesk Variable'
const MONO = 'JetBrains Mono Variable'

function escape(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function text(x, y, content, {
    fill = COLORS.ink,
    fontFamily = DISPLAY,
    fontSize = 24,
    fontWeight = 400,
    letterSpacing = 0,
    textAnchor = 'start',
} = {}) {
    const spacing = letterSpacing === 0 ? '' : ` letter-spacing="${letterSpacing}"`

    return `<text x="${x}" y="${y}" fill="${fill}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="${textAnchor}"${spacing}>${escape(content)}</text>`
}

function buildSvg(version) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${COLORS.bg}"/>
    <rect x="0" y="0" width="8" height="630" fill="${COLORS.accent}"/>

    ${text(88, 118, '@darcas/', { fill: COLORS.ink3, fontFamily: MONO, fontSize: 24 })}
    ${text(88 + '@darcas/'.length * 14.4, 118, 'wa-format', { fill: COLORS.ink, fontFamily: MONO, fontSize: 24 })}
    ${text(1112, 118, `v${version}`, {
        fill: COLORS.accent,
        fontFamily: MONO,
        fontSize: 24,
        textAnchor: 'end',
    })}

    ${text(88, 236, 'WhatsApp formatting', { fontSize: 68, fontWeight: 700, letterSpacing: -2 })}
    ${text(88, 318, 'to HTML — and back.', { fontSize: 68, fontWeight: 700, letterSpacing: -2 })}

    <rect x="88" y="380" width="1024" height="1" fill="${COLORS.line}"/>

    <rect x="88" y="416" width="1024" height="104" rx="12" fill="#12161a" stroke="${COLORS.line}" stroke-width="2"/>
    <rect x="88" y="416" width="6" height="104" rx="3" fill="${COLORS.accentDim}"/>

    ${text(126, 458, '*Hello* _world_', {
        fill: COLORS.paper,
        fontFamily: MONO,
        fontSize: 30,
    })}
    ${text(126, 494, '→ <b>Hello</b> <i>world</i>', {
        fill: COLORS.accent,
        fontFamily: MONO,
        fontSize: 30,
    })}

    ${text(88, 578, '0 core dependencies · ESM + CJS · Node ≥ 20', {
        fill: COLORS.ink3,
        fontFamily: MONO,
        fontSize: 22,
        letterSpacing: 0.4,
    })}
</svg>`
}

async function main() {
    const { Resvg } = await import('@resvg/resvg-js')

    const facts = JSON.parse(await readFile(factsFile, 'utf8'))
    const fontFiles = FONT_FILES.map((file) => resolve(root, file)).filter(existsSync)

    const renderer = new Resvg(buildSvg(facts.version), {
        fitTo: { mode: 'width', value: 1200 },
        font: { fontFiles, loadSystemFonts: false },
    })

    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, renderer.render().asPng())

    console.log('og: dist/og.png written')
}

try {
    await main()
} catch (error) {
    console.warn(`og: skipped (${error.message})`)
}