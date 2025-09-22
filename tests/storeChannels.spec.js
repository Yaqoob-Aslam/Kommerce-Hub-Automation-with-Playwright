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

  test('Store Channels - User should be able to navigate to Stock Transfers page', async () => {
  // Navigate to Store Channels
  await page.getByRole('button', { name: 'reconciliation Inventory' }).click();
  await page.waitForTimeout(10000);
  await page.getByRole('link', { name: '• Store Channels' }).click();
  await page.waitForTimeout(15000);
  
  // Add Storefront
  await page.getByRole('button', { name: 'Add Storefront' }).click();

  // Fill in Storefront details
  await page.getByPlaceholder('Enter Storefront Name').fill('Auto Storefront');
  await page.getByRole('textbox', { name: 'Enter Merchant Email' }).fill('test@gmail.com');

  // Select Sale Agent
  await page.locator("xpath=//div[@name='sale_agent_id']//span[@title='Please Select']").click();
  await page.getByText("Saudia Claud").click();

  // Fill Address details
  await page.locator("xpath=//textarea[@placeholder='Address']").fill('567, NewYork, USA');
  await page.locator("xpath=//div[@name='address.state']//span[@title='Please Select'][normalize-space()='Please Select']").click();
  await page.locator("xpath=//div[@class='ant-select-item-option-content'][normalize-space()='MARYLAND']").click();

  // Select City
  await page.locator("xpath=//div[@name='address.city']//span[@class='ant-select-selection-search']//input").click();
  await page.getByTitle('Abingdon').click();

  // Zip Code
  await page.getByPlaceholder('Zip Code').fill('07008');

  // Description
  await page.getByRole('textbox', { name: 'Rich Text Editor, main' }).fill('Test Storefront');

  // Save Storefront
  await page.getByRole('button', { name: 'Save' }).click();
  });

  test.afterAll(async () => {
     await page.pause();        
     //await browser.close();
  });
});
