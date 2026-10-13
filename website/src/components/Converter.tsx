/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'

import { copyText } from '../lib/copy'
import { convert, DEFAULT_STATE, INPUT_LIMIT } from '../lib/convert'
import type { BulletOption, ConverterState, Direction, StyleOption } from '../lib/convert'
import { tokenizeHtml, tokenizeWhatsApp } from '../lib/tokenize'
import type { TokenKind } from '../lib/tokenize'

import styles from './Converter.module.css'

const DIRECTIONS: ReadonlyArray<{ label: string; value: Direction }> = [
    { label: 'WhatsApp → HTML', value: 'to-html' },
    { label: 'HTML → WhatsApp', value: 'to-wa' },
]

const STYLES: ReadonlyArray<{ label: string; value: StyleOption }> = [
    { label: 'semantic', value: 'semantic' },
    { label: 'legacy', value: 'legacy' },
]

const BULLETS: ReadonlyArray<{ label: string; value: BulletOption }> = [
    { label: '-', value: '-' },
    { label: '*', value: '*' },
]

const TOKEN_CLASS: Record<TokenKind, string | undefined> = {
    attr: styles.tokenAttr,
    keyword: styles.tokenKeyword,
    markup: styles.tokenMarkup,
    plain: undefined,
    string: styles.tokenString,
}

const ANNOUNCE_DELAY = 400

interface OptionToggleProps<T extends string> {
    label: string
    onChange: (value: T) => void
    options: ReadonlyArray<{ label: string; value: T }>
    value: T
}

function OptionToggle<T extends string>({ label, onChange, options, value }: OptionToggleProps<T>) {
    return (
        <div className={styles.option}>
            <span>{label}</span>
            <div className={styles.optionToggle}>
                {options.map((option) => (
                    <button
                        aria-pressed={option.value === value}
                        data-active={option.value === value}
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        type="button"
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

interface SwitchProps {
    checked: boolean
    label: string
    onChange: (checked: boolean) => void
}

function Switch({ checked, label, onChange }: SwitchProps) {
    return (
        <div className={styles.option}>
            <button
                aria-checked={checked}
                className={styles.switch}
                onClick={() => onChange(!checked)}
                role="switch"
                type="button"
            >
                <span className="visually-hidden">{label}</span>
            </button>
            <span>{label}</span>
        </div>
    )
}

/**
 * The live converter: WhatsApp text on one side, HTML on the other, running the real
 * library. The tone of each pane follows the content it holds, so the warm paper always
 * means "WhatsApp" and the cold surface always means "HTML".
 */
export function Converter() {
    const [state, setState] = useState<ConverterState>(DEFAULT_STATE)

    const output = useMemo(() => convert(state), [state])
    const tokens = useMemo(
        () => (state.direction === 'to-wa' ? tokenizeWhatsApp(output) : tokenizeHtml(output)),
        [output, state.direction],
    )

    const inputName = state.direction === 'to-html' ? 'WhatsApp' : 'HTML'
    const outputName = state.direction === 'to-html' ? 'HTML' : 'WhatsApp'
    const inputTone = state.direction === 'to-html' ? 'paper' : 'dark'
    const overBudget = state.input.length > INPUT_LIMIT

    const patch = useCallback((next: Partial<ConverterState>) => {
        setState((current) => ({ ...current, ...next }))
    }, [])

    /** Flipping direction carries the current result across, so the swap reads as a round trip. */
    const setDirection = useCallback((direction: Direction) => {
        setState((current) => (current.direction === direction
            ? current
            : { ...current, direction, input: convert(current) }))
    }, [])

    const [announcement, setAnnouncement] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnnouncement(`${outputName} updated, ${output.length} characters`)
        }, ANNOUNCE_DELAY)

        return () => clearTimeout(timer)
    }, [output, outputName])

    return (
        <div className={styles.converter}>
            <div className={styles.bar}>
                <div aria-label="Conversion direction" className={styles.segment} role="group">
                    {DIRECTIONS.map((direction) => (
                        <button
                            aria-pressed={state.direction === direction.value}
                            data-active={state.direction === direction.value}
                            key={direction.value}
                            onClick={() => setDirection(direction.value)}
                            type="button"
                        >
                            {direction.label}
                        </button>
                    ))}
                </div>

                <span className={styles.budget} data-over={overBudget}>
                    {state.input.length} / {INPUT_LIMIT} chars
                </span>
            </div>

            <div className={styles.panes}>
                <section aria-label={`${inputName} input`} className={styles.pane} data-tone={inputTone}>
                    <div className={styles.paneHead}>
                        <span className={styles.paneTitle}>{inputName}</span>
                        <span className={styles.badge}>Input</span>
                    </div>
                    <textarea
                        aria-label={`${inputName} input`}
                        className={styles.textarea}
                        onChange={(event) => patch({ input: event.target.value })}
                        spellCheck={false}
                        value={state.input}
                    />
                </section>

                <div>
                    <button
                        aria-label="Swap conversion direction"
                        className={styles.swap}
                        data-reversed={state.direction === 'to-wa'}
                        onClick={() => setDirection(state.direction === 'to-html' ? 'to-wa' : 'to-html')}
                        type="button"
                    >
                        <svg aria-hidden="true" className={styles.swapIcon} viewBox="0 0 24 24">
                            <path d="M4 8h13l-3-3" />
                            <path d="M20 16H7l3 3" />
                        </svg>
                    </button>
                </div>

                <section
                    aria-label={`${outputName} output`}
                    className={styles.pane}
                    data-tone={inputTone === 'paper' ? 'dark' : 'paper'}
                >
                    <div className={styles.paneHead}>
                        <span className={styles.paneTitle}>{outputName}</span>
                        <span className={styles.badge}>Output</span>
                        <span className={styles.paneTools}>
                            <OutputCopy value={output} />
                        </span>
                    </div>
                    <pre className={styles.output} tabIndex={0}>
                        {tokens.length === 0
                            ? '—'
                            : tokens.map((token, index) => (
                                <span className={TOKEN_CLASS[token.kind]} key={index}>
                                    {token.text}
                                </span>
                            ))}
                    </pre>
                </section>
            </div>

            <div className={styles.options}>
                {state.direction === 'to-html'
                    ? (
                        <>
                            <OptionToggle
                                label="style"
                                onChange={(style) => patch({ style })}
                                options={STYLES}
                                value={state.style}
                            />
                            <Switch
                                checked={state.lineBreaks}
                                label="lineBreaks"
                                onChange={(lineBreaks) => patch({ lineBreaks })}
                            />
                            <Switch
                                checked={state.trim}
                                label="trim"
                                onChange={(trim) => patch({ trim })}
                            />
                        </>
                    )
                    : (
                        <OptionToggle
                            label="bullet"
                            onChange={(bullet) => patch({ bullet })}
                            options={BULLETS}
                            value={state.bullet}
                        />
                    )}
            </div>

            <p className={styles.footnote}>
                Every text node goes through a single escape path — the output is safe to inject.
            </p>

            <span aria-live="polite" className="visually-hidden" role="status">
                {announcement}
            </span>
        </div>
    )
}

/** Copy control rendered inside the pane header, kept out of the token list. */
function OutputCopy({ value }: { value: string }) {
    const [done, setDone] = useState(false)

    const handleClick = useCallback(async () => {
        const ok = await copyText(value)

        setDone(ok)
        setTimeout(() => setDone(false), 2000)
    }, [value])

    return (
        <button onClick={handleClick} type="button">
            {done ? 'Copied' : 'Copy'}
        </button>
    )
}