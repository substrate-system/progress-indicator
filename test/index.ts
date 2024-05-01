import { test } from '@bicycle-codes/tapzero'
import '../src/index.js'

test('Find the element', async t => {
    const el = document.querySelector('progress-indicator')
    t.ok(el, 'should find the element')
})
