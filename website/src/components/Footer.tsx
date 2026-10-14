/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import facts from '../generated/facts.json'

import styles from './Footer.module.css'

const START_YEAR = 2026

function getYearRange(): string {
    const current = new Date().getFullYear()
    return current > START_YEAR ? `${START_YEAR}-${current}` : `${START_YEAR}`
}

/**
 * Footer: wordmark, doc/project columns, PayPal button matching the
 * README badge, and the author credit.
 */
export function Footer() {
    return (
        <footer className={styles.footer} id="credits">
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.intro}>
                        <p className={styles.brand}>
                            <span className={styles.scope}>@darcas/</span>wa-format
                        </p>
                        <p className={styles.tagline}>WhatsApp formatting to HTML — and back.</p>
                        <p className={styles.credit}>
                            Built by <a href="https://casertano.name" rel="noreferrer"
                                        target="_blank">Dario Casertano</a>
                        </p>
                        <p className={styles.credit}>
                            Layout designed with <a
                            href="https://github.com/DarCas/refero-design-mcp" rel="noreferrer"
                            target="_blank">@darcas/refero-design-mcp</a>
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
                            <li><a href={facts.repository} rel="noreferrer"
                                   target="_blank">GitHub</a></li>
                            <li>
                                <a href="https://www.npmjs.com/package/@darcas/wa-format"
                                   rel="noreferrer" target="_blank">
                                    npm
                                </a>
                            </li>
                            <li><a href={`${facts.repository}/issues`} rel="noreferrer"
                                   target="_blank">Issues</a></li>
                        </ul>
                    </nav>
                </div>
                <p className={styles.copy}>
                    © {getYearRange()} Dario Casertano.{' '}
                    <a href={`${facts.repository}/blob/master/LICENSE`} rel="noreferrer" target="_blank">
                        MIT licensed.
                    </a>
                </p>
            </div>
        </footer>
    )
}
