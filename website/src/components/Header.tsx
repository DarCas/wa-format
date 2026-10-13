/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { useEffect, useState } from 'react'

import facts from '../generated/facts.json'

import { CopyButton } from './ui/CopyButton'

import styles from './Header.module.css'

const INSTALL_COMMAND = 'npm i @darcas/wa-format'

const NAV_LINKS = [
    { href: '#playground', label: 'Playground' },
    { href: '#features', label: 'Features' },
    { href: '#formats', label: 'Formats' },
    { href: '#api', label: 'API' },
    { href: '#mcp', label: 'MCP' },
]

/**
 * Sticky site header. The scroll state is read in an effect so the prerendered markup
 * matches the first client render exactly. Below 900px the nav collapses into a
 * disclosure panel; the Install action stays visible.
 */
export function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })

        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className={styles.header} data-scrolled={scrolled}>
            <div className={`container ${styles.inner}`}>
                <a className={styles.brand} href="/">
                    <span className={styles.brandScope}>@darcas/</span>
                    <span className={styles.brandName}>wa-format</span>
                </a>

                <button
                    aria-expanded={open}
                    aria-label="Toggle navigation"
                    className={styles.menu}
                    onClick={() => setOpen((value) => !value)}
                    type="button"
                >
                    Menu
                </button>

                <nav aria-label="Primary" className={styles.nav} data-open={open}>
                    {NAV_LINKS.map((link) => (
                        <a className={styles.navLink} href={link.href} key={link.href} onClick={() => setOpen(false)}>
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className={styles.actions}>
                    <span className={styles.version}>v{facts.version}</span>

                    <a
                        aria-label="wa-format source on GitHub"
                        className={styles.repo}
                        href={facts.repository}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <svg
                            aria-hidden="true"
                            className={styles.repoIcon}
                            viewBox="0 0 24 24"
                        >
                            <polyline points="9 7 4 12 9 17" />
                            <polyline points="15 7 20 12 15 17" />
                        </svg>
                    </a>

                    <CopyButton label="Install command" value={INSTALL_COMMAND}>
                        Install
                    </CopyButton>
                </div>
            </div>
        </header>
    )
}