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
  
    test('Stock Alerts', async () => {  
        await page.getByRole('button', { name: 'reconciliation Inventory' }).click();
        await page.waitForTimeout(10000);
        await page.getByRole('link', { name: '• Stock Alerts' }).click();
        await page.waitForTimeout(15000); 
        await page.getByRole('textbox', { name: 'Search' }).click();
        await page.getByRole('textbox', { name: 'Search' }).fill('Baby Ruth Bar 24 Ct');
        await page.waitForTimeout(5000);
        await page.getByRole('textbox', { name: 'Search' }).press('Enter');
    });

  test.afterAll(async () => {
     await page.pause();        
     //await browser.close();
  });
});