import { test } from '@substrate-system/tapzero'
import { ProgressIndicator } from '../src/index.js'

ProgressIndicator.define()

let el:ProgressIndicator
test('Find the element', async t => {
    el = document.querySelector('progress-indicator') as ProgressIndicator
    t.ok(el, 'should find the element')
})

test('set the attribute', t => {
    console.log(el instanceof ProgressIndicator)
    el.setProgress(50)
    const progressCount = el.querySelector('[data-progress-count]') as
        HTMLElement
    t.ok(progressCount.innerText.includes('50'), 'should set the attribute to 50')
})
