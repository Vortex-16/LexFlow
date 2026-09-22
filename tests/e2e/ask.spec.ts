import { test, expect } from '@playwright/test';

test.describe('LexFlow Ask Flow', () => {
  test('Test A - Normal Ask', async ({ page }) => {
    // Wait for the page to load and hydrate
    await page.goto('/');
    
    // Click the example button which populates the form and verifies hydration
    await page.click('text=Notice period for periodic tenancy (NZ)');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify response
    await expect(page.locator('h2').first()).toHaveText('Answer');
    await expect(page.locator('text=90 days').first()).toBeVisible();
    
    // Verify source panel
    await expect(page.locator('text=Section 51(1)(a)').first()).toBeVisible();
  });

  test('Test B - Missing context', async ({ page }) => {
    await page.goto('/');
    
    // Click the example button for missing jurisdiction
    await page.click('text=Notice period (Missing Jurisdiction)');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('h2').first()).toHaveText('Answer');
    await expect(page.locator('text=I need to know your jurisdiction')).toBeVisible();
    await expect(page.locator('text=Assumptions & Missing Context')).toBeVisible();
  });

  test('Test C - High Risk Scenario', async ({ page }) => {
    await page.goto('/');
    
    // Click the example button for high risk
    await page.click('text=Emergency eviction (High Risk)');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=CRITICAL RISK')).toBeVisible();
    await expect(page.locator('text=Consult a qualified attorney immediately.')).toBeVisible();
  });
});
