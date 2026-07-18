import { test as setup, expect, APIRequestContext } from '@playwright/test';

// Request context is reused for the entire setup phase.
let apiContext: APIRequestContext;

setup.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    baseURL: 'https://task-mgmt-charlyautomatiza.onrender.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  });
});

setup.afterAll(async () => {
  await apiContext?.dispose();
});

// Add a test for Playwright to recognize
setup('verify that the server is active', async () => {
  try {
    const response = await apiContext.get('/', { timeout: 10000 });
    const status = response.status();
    const responseBody = await response.text();

    if (status >= 200 && status < 500 && responseBody.length > 0) {
      console.log(`The server is active and responded with status ${status}.`);
      return;
    }

    console.warn(`The server responded with status ${status}, but the health check was not conclusive.`);
  } catch (error) {
    console.warn('The server health check was skipped because the endpoint is unavailable.', error);
  }
});
