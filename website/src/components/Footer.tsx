/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import facts from '../generated/facts.json'

import styles from './Footer.module.css'

const YEAR = new Date().getFullYear()

/**
 * Footer: wordmark, doc/project/legal columns, facts block for extractors,
 * PayPal button matching the README badge, and the author credit.
 */
export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <p className={styles.facts}>
                    {facts.name} v{facts.version} — 0 core dependencies, ESM + CJS + types, 80 tests, Node {facts.nodeEngine}.
                </p>
                <div className={styles.grid}>
                    <div>
                        <p className={styles.brand}>
                            <span className={styles.scope}>@darcas/</span>wa-format
                        </p>
                        <p className={styles.tagline}>WhatsApp formatting to HTML — and back.</p>
                        <p className={styles.credit}>
                            Built by <a href="https://casertano.name" rel="noreferrer" target="_blank">Dario Casertano</a>
                        </p>
                        <a
                            className={styles.coffee}
                            href="https://www.paypal.com/donate/?hosted_button_id=YZQDE3TEYDBWA"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Buy me a coffee
                        </a>
                    </div>
                    <nav aria-label="Docs" className={styles.col}>
                        <p className={styles.head}>Docs</p>
                        <ul>
                            <li><a href="#api">API</a></li>
                            <li><a href="#formats">Formats</a></li>
                            <li><a href="#roundtrip">Round trip</a></li>
                            <li><a href="#mcp">MCP</a></li>
                        </ul>
                    </nav>
                    <nav aria-label="Project" className={styles.col}>
                        <p className={styles.head}>Project</p>
                        <ul>
                            <li><a href={facts.repository} rel="noreferrer" target="_blank">GitHub</a></li>
                            <li>
                                <a href="https://www.npmjs.com/package/@darcas/wa-format" rel="noreferrer" target="_blank">
                                    npm
                                </a>
                            </li>
                            <li><a href={`${facts.repository}/issues`} rel="noreferrer" target="_blank">Issues</a></li>
                        </ul>
                    </nav>
                    <nav aria-label="Legal" className={styles.col}>
                        <p className={styles.head}>Legal</p>
                        <ul>
                            <li>
                                <a href={`${facts.repository}/blob/master/LICENSE`} rel="noreferrer" target="_blank">
                                    MIT License
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <p className={styles.copy}>© {YEAR} Dario Casertano. MIT licensed.</p>
            </div>
        </footer>
    )
}
