/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Reads the library manifest at the repository root and writes the facts the page
 * needs (version, description, license, repository) to `src/generated/facts.json`.
 *
 * Fail-soft by design: if the manifest cannot be read, a committed fallback is written
 * so a build never breaks on I/O.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(root, '../package.json')
const target = resolve(root, 'src/generated/facts.json')

// The package version is also stated in plain text in the llms files. It is
// synced from the same manifest on every build so it can never drift behind
// a release the way a hand-edited version would.
const LLMS_FILES = ['public/llms.txt', 'public/llms-full.txt']
const VERSION_PATTERN = /(`@darcas\/wa-format` )v\d+\.\d+\.\d+/g

const fallback = {
    description: 'Convert WhatsApp formatted text into HTML and back.',
    keywords: ['whatsapp', 'format', 'html'],
    license: 'MIT',
    name: '@darcas/wa-format',
    nodeEngine: '>=20',
    repository: 'https://github.com/DarCas/wa-format',
    version: '0.0.0',
}

function normalizeRepository(value) {
    const url = typeof value === 'string' ? value : value?.url

    if (typeof url !== 'string') {
        return fallback.repository
    }

    return url.replace(/^git\+/, '').replace(/\.git$/, '')
}

async function main() {
    let facts = fallback

    try {
        const manifest = JSON.parse(await readFile(source, 'utf8'))

        facts = {
            description: manifest.description ?? fallback.description,
            keywords: manifest.keywords ?? fallback.keywords,
            license: manifest.license ?? fallback.license,
            name: manifest.name ?? fallback.name,
            nodeEngine: manifest.engines?.node ?? fallback.nodeEngine,
            repository: normalizeRepository(manifest.repository),
            version: manifest.version ?? fallback.version,
        }
    } catch (error) {
        console.warn(`facts: falling back to defaults (${error.message})`)
    }

    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, `${JSON.stringify(facts, null, 2)}\n`)

    console.log(`facts: ${facts.name}@${facts.version}`)

    for (const file of LLMS_FILES) {
        try {
            const path = resolve(root, file)
            const text = await readFile(path, 'utf8')

            if (!VERSION_PATTERN.test(text)) {
                console.warn(`facts: no version stamp found in ${file}, left untouched`)
                continue
            }

            VERSION_PATTERN.lastIndex = 0
            await writeFile(path, text.replace(VERSION_PATTERN, `$1v${facts.version}`))

            console.log(`facts: version synced in ${file}`)
        } catch (error) {
            console.warn(`facts: could not sync ${file} (${error.message})`)
        }
    }
}

await main()