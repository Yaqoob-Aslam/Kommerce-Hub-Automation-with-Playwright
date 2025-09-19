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

  test('User should be able to navigate to Purchase Orders and create a new order', async () => {
    await page.getByRole('button', { name: 'reconciliation Inventory' }).click();
    await page.waitForTimeout(5000); 
    await page.getByRole('link', { name: '• Purchase Receive' }).click();
    await page.waitForTimeout(15000); 
    await page.getByRole('button', { name: 'Create Purchase Receive' }).click();
    await page.waitForTimeout(1000);

    // Open Purchase Order dropdown
    await page.locator("xpath=//span[@class='ant-select-selection-item']").click();

    // Pick the first (latest) Purchase Order dynamically
    const latestPO = page.locator(".ant-select-item-option-content").first();
    const latestPOText = await latestPO.innerText();
    await latestPO.click();

    await page.getByRole('button', { name: 'Proceed' }).click();
    await page.waitForTimeout(5000);

    // Select current date dynamically
    const today = new Date().getDate().toString();
    await page.getByRole('textbox', { name: 'Select date' }).click();
    await page.getByText(today, { exact: true }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('textbox', { name: 'Enter Supplier Invoice No' }).click();
    await page.getByRole('textbox', { name: 'Enter Supplier Invoice No' }).fill('GD34WE10');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Create Receive' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Proceed' }).click();
  });
  
  test.afterAll(async () => {
     await page.pause();
     //await browser.close();
  });
});
