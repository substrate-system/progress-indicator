import { test } from '@substrate-system/tapzero'
import { ProgressIndicator } from '../src/index.js'

ProgressIndicator.define()

test('setup', () => {
    document.body.innerHTML += `
        <progress-indicator progress="0" stroke="8">
            <div role="alert" aria-live="polite">
                <p>Loading, please wait…</p>
            </div>
        </progress-indicator>
    `
})

let el:ProgressIndicator
test('Find the element', async t => {
    el = document.querySelector('progress-indicator') as ProgressIndicator
    t.ok(el, 'should find the element')
})

test('set the attribute', t => {
    el.setProgress(50)
    const progressCount = el.querySelector('[data-progress-count]') as
        HTMLElement
    t.ok(progressCount.innerText.includes('50'),
        'should set the attribute to 50')
})

test('all done', () => {
    // @ts-expect-error
    window.testsFinished = true
})
