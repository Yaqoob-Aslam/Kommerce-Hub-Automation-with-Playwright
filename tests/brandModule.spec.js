import { test, expect, chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe.serial('Kommerce HUB Brand', () => {

  let browser, context, page;
  const BASE_URL = 'https://preprod.ikhub.biz/auth/login';

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
    context = await browser.newContext({ viewport: null, deviceScaleFactor: undefined });
    page = await context.newPage();
  });

  // Utility: Generate meaningful brand names
  function generateBrandName() {
    const prefixes = ['Lux', 'Neo', 'Eco', 'Aero', 'Viva', 'Pure', 'Fresh', 'Elite', 'Urban', 'Green'];
    const suffixes = ['Care', 'Style', 'Life', 'Mart', 'Glow', 'World', 'Essence', 'Way', 'Craft', 'Edge'];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${prefix}${suffix}`;
  }

  // Utility to get random image
  function getRandomImage(folderPath) {
    const files = fs.readdirSync(folderPath).filter(file =>
      file.match(/\.(jpg|jpeg|png|gif)$/i)
    );
    const randomFile = files[Math.floor(Math.random() * files.length)];
    return path.join(folderPath, randomFile);
  }

  test('Login', async () => {
    await page.goto(BASE_URL, { timeout: 120000 });
    await page.getByPlaceholder('Email or User Name').fill('preprod');
    await page.getByPlaceholder('Password').fill('Password@123');
    await page.getByRole('button', { name: 'Sign In' }).click();
  });

  test('Add Brand with name & description', async () => {
    const brandName = generateBrandName();
    const description = `Premium brand description for ${brandName}`;

    await page.getByRole('button', { name: 'shop Product Catalog' }).click();
    await page.getByRole('link', { name: '• Brands' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Add Brand' }).click();
    await page.getByRole('textbox', { name: 'Enter Brand Name' }).fill(brandName);
    await page.getByRole('textbox', { name: 'Rich Text Editor, main' }).fill(description);
    await page.getByRole('button', { name: 'Add Brand' }).click();

    // Verify the brand was added successfully
    await expect(page.getByText(brandName)).toBeVisible();
    await page.waitForTimeout(3000);
  });

  test('Add Brand with all details', async () => {
    const brandName = generateBrandName();
    const description = `Premium brand description for ${brandName}`;

    // Pick random brand image
    const folderPath = path.join(__dirname, '../assets');
    const randomImage = getRandomImage(folderPath);
    console.log(`Uploading image: ${randomImage}`);

    await page.getByRole('button', { name: 'Add Brand' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('textbox', { name: 'Enter Brand Name' }).fill(brandName);
    await page.locator('button[name="is_featured_brand"]').click();
    await page.locator('button[name="is_featured"]').click();
    await page.getByRole('textbox', { name: 'Rich Text Editor, main' }).fill(description);
    await page.locator('input[name=images]').setInputFiles(randomImage);
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Add Brand' }).click();
    await page.waitForTimeout(5000);

    // Verify the brand was added successfully
    await expect(page.getByText(brandName)).toBeVisible();
    
  });

  test.afterAll(async () => {
    await browser.close();
  });
});