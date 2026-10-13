/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'

import { App } from './App'

const container = document.querySelector('#root')

if (!container) {
    throw new Error('main: mount point #root not found')
}

hydrateRoot(
    container,
    <StrictMode>
        <App />
    </StrictMode>,
)