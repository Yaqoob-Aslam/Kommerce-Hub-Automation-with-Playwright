import { test, expect, chromium } from '@playwright/test';

test.describe.serial('Kommerce HUB Dashboard', () => {
  let browser, context, page;
  const BASE_URL = 'https://preprod.ikhub.biz/auth/login';

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
    context = await browser.newContext({ viewport: null, deviceScaleFactor: undefined });
    page = await context.newPage();
  });

  test('User should be able to login with valid credentials', async () => {
    await page.goto(BASE_URL, { timeout: 120000 });
    await page.getByPlaceholder('Email or User Name').fill('preprod');
    await page.getByPlaceholder('Password').fill('Password@123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify dashboard loads
    await expect(page).toHaveURL('https://preprod.ikhub.biz/dashboard', { timeout: 120000 });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 30000 });
  });

  test('Select report for the current month (1st to end)', async () => {
    // --- Calculate 1st and last day of current month ---
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 = Jan
    const startDay = 1;
    const endDay = new Date(year, month + 1, 0).getDate(); // last day of month

    console.log(`Start Date: ${year}-${month + 1}-${startDay}`);
    console.log(`End Date: ${year}-${month + 1}-${endDay}`);

    // --- Select Start Date ---
    await page.getByRole('textbox', { name: 'Start date' }).click();
    await page.locator(`[title="${year}-${String(month + 1).padStart(2, '0')}-01"].ant-picker-cell-in-view`).click();

    // --- Select End Date ---
    await page.getByRole('textbox', { name: 'End date' }).click();
    await page.locator(`[title="${year}-${String(month + 1).padStart(2, '0')}-${endDay}"].ant-picker-cell-in-view`).click();

    await page.waitForTimeout(10000);
  });
  
  test('Calculate total amount for the month', async () => {

    // Wait for table rows
    await page.waitForSelector('tbody tr td:last-child', { timeout: 30000 });

    // Extract amounts
    const amounts = await page.$$eval('tbody tr td:last-child', (cells) =>
      cells.map(cell => cell.textContent.trim())
    );

    console.log('Extracted amounts:', amounts);
    const total = amounts.reduce((sum, val) => {
      if (!val) return sum;
      let numStr = val.replace('$', '').replace(',', '').trim();
      let multiplier = 1;
      if (numStr.endsWith('K')) {
        multiplier = 1000;
        numStr = numStr.replace('K', '').trim();
      }
      const parsed = parseFloat(numStr);
      return sum + (isNaN(parsed) ? 0 : parsed * multiplier);
    }, 0)
    console.log(`Total amount: $${total.toFixed(2)}`);
  });

  test.afterAll(async () => {
    // await page.pause();
     await browser.close();
  });
});
