import { test, expect, chromium } from '@playwright/test';

test.describe.serial('Kommerce HUB Dashboard', () => {
  let browser, context, page;

  const BASE_URL = 'https://preprod.ikhub.biz/auth/login';

  test.beforeAll(async () => {
    browser = await chromium.launch({headless: false,args: ['--start-maximized']});
    context = await browser.newContext({viewport: null,deviceScaleFactor: undefined});
    page = await context.newPage();
  });

  test('User should be able to login with valid credentials', async () => {
    await page.goto(BASE_URL, { timeout: 120000 });
    await page.getByPlaceholder('Email or User Name').fill('preprod');
    await page.getByPlaceholder('Password').fill('Password@123');
    await page.getByRole('button', { name: 'Sign In' }).click();
  });
  

  test('User should be able to navigate to Stock Transfers page', async () => {
        await page.getByRole('button', { name: 'reconciliation Inventory' }).click();
        await page.waitForTimeout(10000);
        await page.getByRole('link', { name: '• Stock Transfers' }).click();
        await page.waitForTimeout(15000);
        await page.getByRole('button', { name: 'Add Stock Transfer' }).click();

        // Open the date picker
        await page.locator("//input[@placeholder='Select date']").click();
        // Get today’s date
        const today = new Date().getDate().toString();
        // Click the current date in the date picker
        await page.getByText(today, { exact: true }).click();
        await page.locator('input[name="from"]').click();
        await page.locator('input[name="from"]').fill('Primary');
        await page.getByText('Primary').click();

        await page.locator("xpath=//div[@name='channel_from_status']//div[@class='ant-select-selector']").click();
        await page.getByText('Available').click();
        await page.getByRole('textbox', { name: 'Search Warehouse or Storefront' }).click();
        await page.getByRole('textbox', { name: 'Search Warehouse or Storefront' }).fill('Primary');
        await page.locator("xpath=//div[@class='d-flex align-items-center flex-grow-1 border rounded m-3 p-3']").click();
        await page.waitForTimeout(1000);
        await page.locator('#rc_select_1').click();
        await page.getByText('On Hold').nth(1).click();
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: 'Next' }).click();
        await page.waitForTimeout(2000);
        // await page.getByRole('row', { name: '*****Christmas Gift ******' }).locator('a').click();
        await page.locator("xpath=//tbody//tr[2]/td[4]/child::a/span").click();
        await page.waitForTimeout(3000);
        await page.getByRole('button', { name: 'Finish' }).click();
        await page.waitForTimeout(2000);
   });

  test.afterAll(async () => {
     await page.pause();        
     //await browser.close();
  });
});