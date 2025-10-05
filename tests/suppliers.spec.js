import { test, expect, chromium } from '@playwright/test';

test.describe.serial('Kommerce HUB Dashboard', () => {
  let browser, context, page;

  // Generate unique test data
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);

  const firstName = `Next${randomNum}`;
  const lastName = `Flow${randomNum}`;
  const businessName = `Next Flow Inc ${timestamp}`;
  const email1 = `test1_${timestamp}@gmail.com`;
  const email2 = `test2_${timestamp}@gmail.com`;
  const email3 = `test3_${timestamp}@gmail.com`;

  const BASE_URL = 'https://stage.ikhub.biz/auth/login';

  test.beforeAll(async () => {
    browser = await chromium.launch({headless: false,args: ['--start-maximized']});
    context = await browser.newContext({viewport: null,deviceScaleFactor: undefined});
    page = await context.newPage();
  });

  test('User should be able to login with valid credentials', async () => {
    await page.goto(BASE_URL, { timeout: 120000 });
    await page.getByPlaceholder('Email or User Name').fill('owner');
    await page.getByPlaceholder('Password').fill('Password@123');
    await page.getByRole('button', { name: 'Sign In' }).click();
  });
  
  test('Stock Adjustment', async () => {

    // Navigate to Suppliers
    await page.getByRole('button', { name: 'reconciliation Inventory' }).click();
    await page.waitForTimeout(10000);
    await page.getByRole('link', { name: '• Suppliers' }).click();
    await page.waitForTimeout(15000);

    // Add Supplier
    await page.getByRole('button', { name: 'Add Supplier' }).click();

    // Fill details with unique data
    await page.locator("xpath=//div//input[@placeholder='Enter First Name']").fill(firstName);
    await page.locator("xpath=//div//input[@placeholder='Enter Last Name']").fill(lastName);
    await page.locator("xpath=//div//input[@id='businessName']").fill(businessName);

    await page.locator('input[name="email"]').fill(email1);
    await page.locator('input[name="email_2"]').fill(email2);
    await page.locator('input[name="email_3"]').fill(email3);
    await page.locator('div').filter({ hasText: /^Phone NumberPhone$/ }).getByRole('button').click();

    await page.getByRole('option', { name: 'Pakistan+' }).click();
    await page.waitForTimeout(2000);
    await page.locator("xpath=//input[contains(@class,'form-control') and @type='tel'][1]").first().fill('+92 3001234567');
    await page.waitForTimeout(2000);
    await page.locator("xpath=//input[@name='website']").fill('www.nextflow.com');
    await page.locator("xpath=//input[@name='business_tax_no']").fill('DE345');
    await page.locator("xpath=//label[normalize-space(text())='Enter Fax']/following::input[@type='tel'][1]").fill('+92 3001234567');

    await page.locator("xpath=//textarea[@name='address.location']").fill('Office 123, 1st Floor, Next Flow Inc');
    await page.locator("xpath=//span[@title='Please Select']").click();
    await page.waitForTimeout(2000);
    await page.locator("xpath=//div[@class='ant-select-item-option-content'][normalize-space()='MARYLAND']").click();
    await page.waitForTimeout(2000);
    await page.locator("xpath=//div[@name='address.county']//span[@class='ant-select-selection-item']").click();
    await page.waitForTimeout(2000);
    await page.getByText('BALTIMORE CITY').click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', {name: 'save'}).click();
  });

  test.afterAll(async () => {
     await page.pause();        
     //await browser.close();
  });
});