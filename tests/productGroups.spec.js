import { test, expect, chromium } from '@playwright/test';

test.describe.serial('Kommerce HUB Dashboard', () => {
  let browser, context, page;

  // Utility to generate a unique string
  function generateUniqueName(prefix = "Test Product Group") {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ""); // compact timestamp
    const random = Math.random().toString(36).substring(2, 8); // short random string
    return `${prefix}_${timestamp}_${random}`;
  }

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
  });

  test('Add new Product Group', async () => {
    // Generate unique group name
    const uniqueGroupName = generateUniqueName();

    await page.getByRole('button', { name: 'shop Product Catalog' }).click();
    await page.waitForTimeout(5000);

    await page.getByRole('link', { name: '• Product Groups' }).click();
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Create Product Group' }).click();
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Add Products' }).click();
    await page.waitForTimeout(2000);

    await page.locator("xpath=//tbody//tr[2]/td[1]/label/span/input").check();
    await page.waitForTimeout(1000);

    await page.locator("xpath=//table/tbody/tr[2]/td[6]/div[1]/button[1]").click();
    await page.waitForTimeout(1000);

    await page.getByLabel('Add Product').getByRole('button', { name: 'Add Products' }).click();
    await page.waitForTimeout(2000);

    // Fill with unique group name
    await page.getByPlaceholder("Enter group name").fill(uniqueGroupName);

    await page.locator("xpath=//span[@class='ant-select-selection-search']/input").click();
    await page.getByText('Suggested Preserve Price').click();

    await page.getByRole('button', { name: 'Create Group' }).click();
    await page.waitForTimeout(2000);
    console.log(`✅ Created Product Group: ${uniqueGroupName}`);

    // Verify the new product group is created
    const createdGroup = page.locator(`text=${uniqueGroupName}`);
    await expect(createdGroup).toBeVisible();

    await page.waitForTimeout(5000);
    // Scroll into view before deleting
    await createdGroup.scrollIntoViewIfNeeded();

    // Open group actions (use locator relative to the group row instead of global icon)
    const groupRow = page.locator(`//tr[td[contains(., "${uniqueGroupName}")]]`);
    await groupRow.locator(".ki-bold-more-hor").click();

    // Delete the product group
    await page.locator("xpath=//span[contains(text(),'Delete Product Group')]").click();
    await page.getByRole('button', { name: 'Confirm' }).click();

  });

  test.afterAll(async () => {
     await page.pause();
    //  await browser.close();
  });
});
