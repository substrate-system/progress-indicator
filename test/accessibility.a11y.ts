import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Comprehensive accessibility tests for the progress-indicator web component.
 *
 * These tests follow WCAG 2.1/2.2 AA standards and cover:
 * - Automated axe-core violations
 * - ARIA attributes and roles (WCAG 1.3.1, 4.1.2)
 * - Screen reader accessible labels (WCAG 2.4.6, 4.1.2)
 * - Keyboard navigation (WCAG 2.1.1)
 * - Dynamic content announcements (WCAG 4.1.3)
 * - Semantic HTML structure
 */

test.describe('Progress Indicator - Accessibility Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/public/index.html')
        // Wait for the custom element to be defined and rendered
        await page.waitForSelector('progress-indicator', { state: 'attached' })
        await page.waitForTimeout(500) // Give component time to initialize and render
    })

    /**
     * WCAG 1.3.1 Info and Relationships (Level A)
     * WCAG 4.1.2 Name, Role, Value (Level A)
     *
     * Test: Component must have proper ARIA role
     * Expected: role="progressbar"
     */
    test('should have progressbar role', async ({ page }) => {
        const progressIndicator = page.locator('progress-indicator')
        await expect(progressIndicator).toHaveAttribute('role', 'progressbar')
    })

    /**
     * WCAG 2.4.6 Headings and Labels (Level AA)
     * WCAG 4.1.2 Name, Role, Value (Level A)
     *
     * Test: Component must have accessible label
     * Expected: aria-label attribute present with meaningful text
     */
    test('should have aria-label attribute', async ({ page }) => {
        const progressIndicator = page.locator('progress-indicator')
        const ariaLabel = await progressIndicator.getAttribute('aria-label')

        expect(ariaLabel).toBeTruthy()
        expect(ariaLabel?.length).toBeGreaterThan(0)
    })

    /**
     * WCAG 4.1.2 Name, Role, Value (Level A)
     *
     * Test: Component must expose current progress value
     * Expected: aria-valuenow reflects current progress percentage
     */
    test('should have aria-valuenow attribute reflecting current progress', async ({ page }) => {
        const progressIndicator = page.locator('progress-indicator')
        const valueNow = await progressIndicator.getAttribute('aria-valuenow')

        expect(valueNow).toBeTruthy()
        const numValue = parseInt(valueNow || '0')
        expect(numValue).toBeGreaterThanOrEqual(0)
        expect(numValue).toBeLessThanOrEqual(100)
    })

    /**
     * WCAG 4.1.2 Name, Role, Value (Level A)
     *
     * Test: Component must define maximum value
     * Expected: aria-valuemax="100"
     */
    test('should have aria-valuemax attribute set to 100', async ({ page }) => {
        const progressIndicator = page.locator('progress-indicator')
        await expect(progressIndicator).toHaveAttribute('aria-valuemax', '100')
    })

    /**
     * WCAG 4.1.2 Name, Role, Value (Level A)
     *
     * Test: Component should define minimum value for complete progress semantics
     * Expected: aria-valuemin="0"
     */
    test('should have aria-valuemin attribute set to 0', async ({ page }) => {
        const progressIndicator = page.locator('progress-indicator')
        await expect(progressIndicator).toHaveAttribute('aria-valuemin', '0')
    })

    /**
     * WCAG 1.3.1 Info and Relationships (Level A)
     *
     * Test: Decorative SVG elements must be hidden from screen readers
     * Expected: SVG elements have aria-hidden="true" or focusable="false"
     */
    test('should hide decorative SVG elements from screen readers', async ({ page }) => {
        const svgElements = page.locator('progress-indicator svg')
        const count = await svgElements.count()

        expect(count).toBeGreaterThan(0)

        for (let i = 0; i < count; i++) {
            const svg = svgElements.nth(i)
            const ariaHidden = await svg.getAttribute('aria-hidden')
            const focusable = await svg.getAttribute('focusable')

            // SVG should either be aria-hidden or focusable="false"
            const isProperlyHidden = ariaHidden === 'true' || focusable === 'false'
            expect(isProperlyHidden).toBeTruthy()
        }
    })

    /**
     * WCAG 2.4.6 Headings and Labels (Level AA)
     * WCAG 1.3.1 Info and Relationships (Level A)
     *
     * Test: Screen reader users need textual representation of progress
     * Expected: Visually hidden text element announces current progress
     */
    test('should have visually hidden text for screen reader announcements', async ({ page }) => {
        const visuallyHidden = page.locator('progress-indicator .visually-hidden')
        await expect(visuallyHidden).toBeAttached()

        const text = await visuallyHidden.textContent()
        expect(text).toBeTruthy()
        expect(text?.length).toBeGreaterThan(0)
    })

    /**
     * WCAG 4.1.3 Status Messages (Level AA)
     *
     * Test: Progress updates must be announced to screen readers
     * Expected: Live region with role="status" or aria-live="polite"
     */
    test('should have live region for progress announcements', async ({ page }) => {
        const visuallyHidden = page.locator('progress-indicator .visually-hidden')

        // Check for either role="status" or aria-live attribute
        const role = await visuallyHidden.getAttribute('role')
        const ariaLive = await visuallyHidden.getAttribute('aria-live')

        const hasLiveRegion = role === 'status' || ariaLive === 'polite' || ariaLive === 'assertive'
        expect(hasLiveRegion).toBeTruthy()
    })

    /**
     * WCAG 4.1.3 Status Messages (Level AA)
     *
     * Test: Live region should be polite to avoid interrupting screen readers
     * Expected: aria-live="polite" (not "assertive")
     */
    test('should use polite live region announcements', async ({ page }) => {
        const visuallyHidden = page.locator('progress-indicator .visually-hidden')
        const ariaLive = await visuallyHidden.getAttribute('aria-live')
        const role = await visuallyHidden.getAttribute('role')

        // role="status" implies aria-live="polite"
        const isPolite = role === 'status' || ariaLive === 'polite'
        expect(isPolite).toBeTruthy()
    })

    /**
     * WCAG 4.1.3 Status Messages (Level AA)
     *
     * Test: Completion state must be announced to screen readers
     * Expected: When progress reaches 100%, announcement includes "complete" or similar
     */
    test('should announce completion state', async ({ page }) => {
        // Set progress to 100%
        await page.evaluate(() => {
            const el = document.querySelector('progress-indicator') as any
            if (el) el.setProgress(100)
        })

        await page.waitForTimeout(100) // Allow for DOM updates

        const visuallyHidden = page.locator('progress-indicator .visually-hidden')
        const text = await visuallyHidden.textContent()

        // Should include "complete" or "finished" or "done" when at 100%
        const hasCompletionMessage = text?.toLowerCase().includes('complete') ||
                                    text?.toLowerCase().includes('finished') ||
                                    text?.toLowerCase().includes('done')
        expect(hasCompletionMessage).toBeTruthy()
    })

    /**
     * Comprehensive axe-core scan for automated WCAG violations
     *
     * Tests multiple WCAG criteria automatically:
     * - 1.1.1 Non-text Content
     * - 1.3.1 Info and Relationships
     * - 1.4.3 Contrast (Minimum)
     * - 2.1.1 Keyboard
     * - 2.4.4 Link Purpose
     * - 3.1.1 Language of Page
     * - 4.1.1 Parsing
     * - 4.1.2 Name, Role, Value
     * And many more...
     */
    test('should not have any automatically detectable WCAG violations', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    /**
     * Test axe-core scan focusing specifically on ARIA implementation
     *
     * WCAG 4.1.2 Name, Role, Value (Level A)
     */
    test('should have valid ARIA implementation', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag412'])
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    /**
     * WCAG 1.3.1 Info and Relationships (Level A)
     *
     * Test: Progress percentage should update aria-valuenow dynamically
     */
    test('should update aria-valuenow when progress changes', async ({ page }) => {
        const progressIndicator = page.locator('progress-indicator')

        // Set progress to 50%
        await page.evaluate(() => {
            const el = document.querySelector('progress-indicator') as any
            if (el) el.setProgress(50)
        })

        await page.waitForTimeout(100)
        await expect(progressIndicator).toHaveAttribute('aria-valuenow', '50')

        // Set progress to 75%
        await page.evaluate(() => {
            const el = document.querySelector('progress-indicator') as any
            if (el) el.setProgress(75)
        })

        await page.waitForTimeout(100)
        await expect(progressIndicator).toHaveAttribute('aria-valuenow', '75')
    })

    /**
     * WCAG 1.3.1 Info and Relationships (Level A)
     *
     * Test: Visual state changes must be reflected in accessible state
     * Expected: data-progress-state attribute changes to "complete" at 100%
     */
    test('should update state attribute when complete', async ({ page }) => {
        const progressIndicator = page.locator('progress-indicator')

        await page.evaluate(() => {
            const el = document.querySelector('progress-indicator') as any
            if (el) el.setProgress(100)
        })

        await page.waitForTimeout(100)
        await expect(progressIndicator).toHaveAttribute('data-progress-state', 'complete')
    })

    /**
     * Best Practice: Semantic HTML and accessibility
     *
     * Test: Component should use semantic percentage text that's accessible
     */
    test('should have accessible percentage text', async ({ page }) => {
        const progressCount = page.locator('progress-indicator [data-progress-count]')
        await expect(progressCount).toBeAttached()

        const text = await progressCount.textContent()
        expect(text).toMatch(/\d+%/)
    })

    /**
     * WCAG 1.3.1 Info and Relationships (Level A)
     *
     * Test: Visually hidden content should not be visible but remain in DOM
     */
    test('visually hidden content should be in document but not visible', async ({ page }) => {
        const visuallyHidden = page.locator('progress-indicator .visually-hidden')

        // Should be in DOM
        await expect(visuallyHidden).toBeAttached()

        // Should not be visible (height should be 1px or clipped)
        const box = await visuallyHidden.boundingBox()
        if (box) {
            expect(box.height).toBeLessThanOrEqual(1)
        }
    })

    /**
     * Integration test: Comprehensive accessibility check at different progress states
     */
    test('should maintain accessibility at all progress states', async ({ page }) => {
        const states = [0, 25, 50, 75, 100]

        for (const progress of states) {
            await page.evaluate((p) => {
                const el = document.querySelector('progress-indicator') as any
                if (el) el.setProgress(p)
            }, progress)

            await page.waitForTimeout(100)

            // Run axe at each state
            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze()

            expect(results.violations).toEqual([])
        }
    })
})
