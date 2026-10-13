/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { useState } from 'react'

import facts from '../generated/facts.json'

import { CodeBlock } from './ui/CodeBlock'
import { Section } from './ui/Section'

import styles from './InstallSection.module.css'

type Manager = 'INSTALL_NPM' | 'INSTALL_PNPM' | 'INSTALL_YARN' | 'INSTALL_BUN'

const MANAGERS: ReadonlyArray<{ id: Manager; label: string }> = [
    { id: 'INSTALL_NPM', label: 'npm' },
    { id: 'INSTALL_PNPM', label: 'pnpm' },
    { id: 'INSTALL_YARN', label: 'yarn' },
    { id: 'INSTALL_BUN', label: 'bun' },
]

/** Install: package-manager tabs, browser snippet, requirements, links. */
export function InstallSection() {
    const [manager, setManager] = useState<Manager>('INSTALL_NPM')

    return (
        <Section
            eyebrow="Install"
            id="install"
            lead="One package. The converters run anywhere; only the MCP server needs Node."
            title="Add it."
        >
            <div className={styles.layout}>
                <div>
                    <div aria-label="Package manager" className={styles.tabs} role="tablist">
                        {MANAGERS.map((entry) => (
                            <button
                                aria-selected={manager === entry.id}
                                className={styles.tab}
                                data-active={manager === entry.id}
                                key={entry.id}
                                onClick={() => setManager(entry.id)}
                                role="tab"
                                type="button"
                            >
                                {entry.label}
                            </button>
                        ))}
                    </div>
                    <CodeBlock key={manager} label={`Install with ${MANAGERS.find((entry) => entry.id === manager)?.label}`} snippet={manager} />
                    <p className={styles.req}>Node ≥20 for the MCP server; the converters run anywhere.</p>
                    <ul className={styles.links}>
                        <li>
                            <a href="https://github.com/DarCas/wa-format#readme" rel="noreferrer" target="_blank">
                                README
                            </a>
                        </li>
                        <li>
                            <a href={facts.repository} rel="noreferrer" target="_blank">
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href={`${facts.repository}/issues`} rel="noreferrer" target="_blank">
                                Issues
                            </a>
                        </li>
                        <li>
                            <a href="https://www.npmjs.com/package/@darcas/wa-format" rel="noreferrer" target="_blank">
                                npm
                            </a>
                        </li>
                        <li>
                            <a href={`${facts.repository}/blob/master/LICENSE`} rel="noreferrer" target="_blank">
                                License (MIT)
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <CodeBlock label="Browser via esm.sh" snippet="BROWSER" />
                    <p className={styles.req}>No build step. Import from esm.sh and call toHTML directly.</p>
                </div>
            </div>
        </Section>
    )
}
