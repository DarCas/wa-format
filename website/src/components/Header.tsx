/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useState } from 'react'
import type { MouseEvent } from 'react'

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
    { href: '#credits', label: 'Credits' },
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

    /** While the mobile disclosure is open the page behind stays put. */
    useEffect(() => {
        if (!open) {
            return
        }

        const prev = document.body.style.overflow

        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = prev
        }
    }, [open])

    /** Brand click scrolls to the top without reloading and drops any section hash. */
    const scrollTop = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()

        if (window.location.hash !== '') {
            window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        window.scrollTo({ behavior: reduce ? 'auto' : 'smooth', top: 0 })
    }, [])

    return (
        <>
            <header className={styles.header} data-open={open} data-scrolled={scrolled}>
                <div className={`container ${styles.inner}`}>
                    <a className={styles.brand} href="/" onClick={scrollTop}>
                        <span className={styles.brandScope}>@darcas/</span>
                        <span className={styles.brandName}>wa-format</span>
                    </a>

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

                    <button
                        aria-expanded={open}
                        className={styles.menu}
                        onClick={() => setOpen((value) => !value)}
                        type="button"
                    >
                        Menu
                    </button>
                </div>
            </header>
            {/* Sibling of the header, not a child: the header's backdrop-filter
             * would otherwise become its containing block and inset: 0 would
             * cover the header itself instead of the viewport. */}
            <button
                aria-label="Close navigation"
                className={styles.scrim}
                data-open={open}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                type="button"
            />
        </>
    )
}