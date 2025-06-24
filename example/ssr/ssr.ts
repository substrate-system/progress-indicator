import fs from 'node:fs/promises'
import { outerHTML } from '../../src/ssr.js'
import path from 'node:path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const el = outerHTML({})

/**
 * __Server-side__
 * Create a string of HTML
 */

function page (content:string) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Example</title>
        <link rel="stylesheet" href="/index.css">
    </head>
    <body>
        <div id="root">
            ${content}
        </div>
        <script src="./umd.min.js"></script>
        <script src="./index.js"></script>
    </body>
    </html>`
}

// path is weird b/c we are running from CLI in npm script
fs.writeFile(path.join(__dirname, 'example', 'ssr', 'index.html'), page(el))
