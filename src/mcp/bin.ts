#!/usr/bin/env node

/*
 * Dario Casertano <dario@casertano.name>
 * Copyright (c) 2026 Casertano Dario – All rights reserved.
 * Licensed under the MIT License.
 */

import { serveStdio } from "@modelcontextprotocol/server/stdio"
import { createServer } from "./server.js"

serveStdio(() => createServer(), {
    onerror: (error) => {
        console.error(`wa-format-mcp: ${error.message}`)
    },
})

console.error("wa-format-mcp: WhatsApp <-> HTML MCP server running on stdio")
