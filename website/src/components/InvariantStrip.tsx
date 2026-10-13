/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import styles from './InvariantStrip.module.css'

/**
 * The one guarantee, set as a mono line in a hairline strip: HTML idempotence.
 * Three short columns define each side of the equation.
 */
export function InvariantStrip() {
    return (
        <section aria-label="Round-trip guarantee" className={styles.strip}>
            <div className="container">
                <p className={styles.line}>
                    <span aria-hidden="true" className={styles.check}>
                        ✓
                    </span>
                    <code className={styles.code}>toHTML(toWA(html)) === toHTML(html)</code>
                    <span className={styles.caption}>The one guarantee — HTML idempotence.</span>
                </p>
                <dl className={styles.cols}>
                    <div className={styles.col}>
                        <dt className={styles.term}>toHTML</dt>
                        <dd className={styles.def}>WhatsApp markup → safe HTML.</dd>
                    </div>
                    <div className={styles.col}>
                        <dt className={styles.term}>toWA</dt>
                        <dd className={styles.def}>
                            HTML → WhatsApp markup. Best-effort and lossy; WhatsApp has no escape character.
                        </dd>
                    </div>
                    <div className={styles.col}>
                        <dt className={styles.term}>Idempotent</dt>
                        <dd className={styles.def}>
                            Anything <code className={styles.inline}>toHTML</code> produced survives a round-trip unchanged.
                        </dd>
                    </div>
                </dl>
            </div>
        </section>
    )
}
