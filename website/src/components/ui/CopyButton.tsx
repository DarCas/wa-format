/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import { copyText } from '../../lib/copy'

import styles from './CopyButton.module.css'

interface CopyButtonProps {
    /** Text placed on the clipboard. */
    value: string
    /** Visible label. */
    children: string
    /** What the clipboard action copies, announced to screen readers. */
    label: string
}

/**
 * Copies `value` to the clipboard and reports the outcome through a visually hidden
 * live region, so the confirmation is never announced twice or missed.
 */
export function CopyButton({ value, children, label }: CopyButtonProps) {
    const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle')
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => () => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
    }, [])

    const handleClick = useCallback(async () => {
        const ok = await copyText(value)

        setState(ok ? 'done' : 'failed')

        if (timer.current) {
            clearTimeout(timer.current)
        }

        timer.current = setTimeout(() => setState('idle'), 2000)
    }, [value])

    return (
        <>
            <button
                className={styles.button}
                data-state={state}
                onClick={handleClick}
                type="button"
            >
                {state === 'done' ? 'Copied' : children}
            </button>
            <span aria-live="polite" className="visually-hidden" role="status">
                {state === 'done' ? `${label} copied to clipboard` : ''}
                {state === 'failed' ? `Could not copy ${label}` : ''}
            </span>
        </>
    )
}