import { test } from '@playwright/test'

test('debug page content', async ({ page }) => {
    // Listen for console messages
    page.on('console', msg => console.log('Browser console:', msg.text()))
    page.on('pageerror', err => console.error('Browser error:', err))

    await page.goto('/public/index.html')

    // Wait for page to load
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Get page content
    const html = await page.content()
    console.log('Page HTML:', html.substring(0, 500))

    // Check if element exists
    const element = await page.locator('progress-indicator').count()
    console.log('Number of progress-indicator elements:', element)

    // Check if it has role
    const role = await page.locator('progress-indicator').getAttribute('role')
    console.log('Progress indicator role:', role)

    // Check inner HTML
    const inner = await page.locator('progress-indicator').innerHTML()
    console.log('Inner HTML:', inner.substring(0, 300))

    // Check if setProgress exists
    const hasSetProgress = await page.evaluate(() => {
        const el = document.querySelector('progress-indicator') as any
        return typeof el?.setProgress === 'function'
    })
    console.log('Has setProgress method:', hasSetProgress)

    // Check all attributes
    const attrs = await page.evaluate(() => {
        const el = document.querySelector('progress-indicator')
        const result:any = {}
        if (el) {
            for (const attr of el.attributes) {
                result[attr.name] = attr.value
            }
        }
        return result
    })
    console.log('All attributes:', JSON.stringify(attrs, null, 2))
})
