/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import { INSTALL_COMMAND } from '../data/stats'
import { copyText } from '../lib/copy'

import { Converter } from './Converter'

import styles from './Hero.module.css'

/**
 * Hero: the promise, the proof, the numbers. The converter sits directly under the
 * headline because it *is* the product — a screenshot would say less and cost more.
 */
export function Hero() {
    return (
        <section className={styles.hero} id="playground">
            <div className={`container ${styles.layout}`}>
                <div>
                    <p className={styles.eyebrow}>
                        <span className={styles.eyebrowMark}>wa-format</span>
                        WhatsApp markup ⇄ HTML
                    </p>

                    <h1 className={styles.title}>
                        WhatsApp formatting to HTML — <span className={styles.titleAccent}>and back.</span>
                    </h1>

                    <p className={styles.lead}>
                        A zero-dependency TypeScript library that parses <code className={styles.leadCode}>
                            *bold*</code>, <code className={styles.leadCode}>_italic_</code>, quotes,
                        lists and code into safe HTML — and converts supported HTML back into
                        WhatsApp markup. Isomorphic. Typed. Escaped by default.
                    </p>

                    <div className={styles.actions}>
                        <InstallButton />
                        <a className={styles.ghost} href="#api">
                            Read the API
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>

                <div className={styles.playground}>
                    <div className={styles.playgroundHead}>
                        <h2 className={styles.playgroundTitle}>Playground</h2>
                        <p className={styles.playgroundHint}>
                            Running the real library. Edit either side.
                        </p>
                    </div>
                    <Converter />
                </div>
            </div>
        </section>
    )
}

/** Primary call to action: copies the install command and confirms in place. */
function InstallButton() {
    const [done, setDone] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => () => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
    }, [])

    const handleClick = useCallback(async () => {
        const ok = await copyText(INSTALL_COMMAND)

        setDone(ok)

        if (timer.current) {
            clearTimeout(timer.current)
        }

        timer.current = setTimeout(() => setDone(false), 2000)
    }, [])

    return (
        <>
            <button className={styles.primary} data-state={done ? 'done' : 'idle'} onClick={handleClick}
                    type="button">
                <span className={styles.primaryCommand}>{done ? 'Copied' : INSTALL_COMMAND}</span>
            </button>
            <span aria-live="polite" className="visually-hidden" role="status">
                {done ? 'Install command copied to clipboard' : ''}
            </span>
        </>
    )
}