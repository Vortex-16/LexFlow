import { test, expect } from '@playwright/test';

test.describe('LexFlow Compare Flow', () => {
  let docAFilename: string;
  let docBFilename: string;

  test.beforeEach(async ({ page }) => {
    docAFilename = `contract-v1-${Date.now()}-${Math.random()}.txt`;
    docBFilename = `contract-v2-${Date.now()}-${Math.random()}.txt`;
    
    // 1. Upload Doc A
    await page.goto('/documents');
    
    let fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('label').first().click();
    let fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: docAFilename,
      mimeType: 'text/plain',
      buffer: Buffer.from('The notice period is 30 days.\n\nThis is a standard contract.\n\nTermination requires mutual consent.')
    });
    
    // Wait for it to be READY
    await expect(page.locator('text=READY').first()).toBeVisible({ timeout: 10000 });
    
    // 2. Upload Doc B
    fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('label').first().click();
    fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: docBFilename,
      mimeType: 'text/plain',
      buffer: Buffer.from('The notice period is 60 days.\n\nThis is a standard contract.\n\nWe added a new clause here.')
    });
    
    // Wait for the second one to be READY
    // Because there are two "READY" labels, we wait for both or just wait 1s.
    await page.waitForTimeout(1000);
    
    // Go to compare page
    await page.goto('/compare');
  });

  test('Test A - Select documents and compare', async ({ page }) => {
    // Select the options by their unique label
    const valA = await page.locator('select').nth(0).locator(`option:has-text("${docAFilename}")`).getAttribute('value');
    const valB = await page.locator('select').nth(1).locator(`option:has-text("${docBFilename}")`).getAttribute('value');
    await page.locator('select').nth(0).selectOption(valA!);
    await page.locator('select').nth(1).selectOption(valB!);
    
    await page.click('button:has-text("Compare")');
    
    // Check if error message is visible
    try {
      const errorText = await page.locator('.bg-red-50').innerText({ timeout: 2000 });
      console.log('UI ERROR:', errorText);
    } catch {
      // no error visible
    }
    
    await expect(page.locator('text=Comparison Summary')).toBeVisible();
    
    // Should detect differences
    // 1. "30 days" -> "60 days" (MODIFIED)
    await expect(page.locator('text=MODIFIED').first()).toBeVisible();
    await expect(page.locator('text=60 days')).toBeVisible();
    await expect(page.locator('text=30 days')).toBeVisible();
    
    // 2. "Termination requires mutual consent." -> REMOVED
    await expect(page.locator('text=REMOVED').first()).toBeVisible();
    await expect(page.locator('text=Termination requires mutual consent.')).toBeVisible();
    
    // 3. "We added a new clause here." -> ADDED
    await expect(page.locator('text=ADDED').first()).toBeVisible();
    await expect(page.locator('text=We added a new clause here.')).toBeVisible();
  });

  test('Test B - Identical documents', async ({ page }) => {
    const valA = await page.locator('select').nth(0).locator(`option:has-text("${docAFilename}")`).getAttribute('value');
    await page.locator('select').nth(0).selectOption(valA!);
    // Compare A with A
    await page.locator('select').nth(1).selectOption(valA!);
    
    await page.click('button:has-text("Compare")');
    
    await expect(page.locator('text=No substantive differences detected.')).toBeVisible();
  });
});
