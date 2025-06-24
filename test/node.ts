import { outerHTML } from '../src/ssr'
import { test } from '@substrate-system/tapzero'

test('get a string of html', t => {
    const el = outerHTML({ progress: 25 })

    t.ok(el.includes('<progress-indicator'), 'should use the custom element')
    t.ok(el.includes('progress="25"'), 'should include the attribute')
})
