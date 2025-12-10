/// <reference types="@types/node" />
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for accessibility testing
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './test',
    testMatch: '**/*.a11y.ts',

    /* Run tests in files in parallel */
    fullyParallel: true,

    /* Fail the build on CI if you accidentally left test.only in the source code */
    forbidOnly: !!process.env.CI,

    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    /* Opt out of parallel tests on CI */
    workers: process.env.CI ? 1 : undefined,

    /* Reporter to use */
    reporter: [['list', { outputFolder: '' }]],

    /* Shared settings for all the projects below */
    use: {
        /* Base URL to use in actions */
        baseURL: 'http://127.0.0.1:8080',

        /* Collect trace when retrying the failed test */
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],

    /* Run local dev server before starting tests */
    webServer: {
        command: 'npx http-server . -p 8080 -c-1 --silent',
        url: 'http://127.0.0.1:8080',
        reuseExistingServer: !process.env.CI,
        timeout: 10 * 1000,
    },
})
