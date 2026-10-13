/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { ApiReference } from './components/ApiReference'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { FormatMatrix } from './components/FormatMatrix'
import { Gotchas } from './components/Gotchas'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { InstallSection } from './components/InstallSection'
import { InvariantStrip } from './components/InvariantStrip'
import { McpSection } from './components/McpSection'
import { RoundTrip } from './components/RoundTrip'

/**
 * Page composition.
 *
 * This module is the prerender entrypoint: `scripts/prerender.mjs` loads it in
 * middleware mode and calls `renderToString` on `<App />`. It must therefore stay
 * SSR-safe — no browser globals at module scope or during the first render.
 */
export function App() {
    return (
        <>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <Header />
            <main id="main">
                <Hero />
                <InvariantStrip />
                <Features />
                <FormatMatrix />
                <RoundTrip />
                <ApiReference />
                <Gotchas />
                <McpSection />
                <InstallSection />
            </main>
            <Footer />
        </>
    )
}
