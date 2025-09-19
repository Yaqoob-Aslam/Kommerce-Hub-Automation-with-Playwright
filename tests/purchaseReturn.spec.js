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
  test('Receive returned purchase items', async () => {
    await page.getByRole('button', { name: 'reconciliation Inventory' }).click();
    await page.waitForTimeout(5000); 
    await page.getByRole('link', { name: '• Purchase Returns' }).click();
    await page.waitForTimeout(15000); 
    await page.getByRole('button', { name: 'Add Purchase Return' }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('textbox', { name: 'Search Supplier' }).click();
    await page.getByRole('textbox', { name: 'Search Supplier' }).fill('CHEYENNE INTERNATIONAL');
    await page.waitForTimeout(3000);
    await page.getByText('- CHEYENNE INTERNATIONAL').click();

    await page.getByRole('textbox', { name: 'Search', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search', exact: true }).fill('GOOD TIMES POUCH TUTTI FRUTTI 3/99C 15CT');
    await page.getByText('GOOD TIMES POUCH TUTTI FRUTTI 3/99C 15CT1007ACTIVE$').click();
    await page.getByRole('textbox', { name: 'Enter Notes' }).click();
    await page.getByRole('textbox', { name: 'Enter Notes' }).fill('Nothig');
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Create Purchase Return' }).click();
    await page.waitForTimeout(5000);
  });
  
  test.afterAll(async () => {
     await page.pause();        
     //await browser.close();
  });
});
