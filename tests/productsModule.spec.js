import { test, expect, chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe.serial('Kommerce HUB Brand', () => {

  let browser, context, page;

  // Unique test data for input fields
  const uniqueProductName = getUniqueId("Product");
  const uniqueAlias = getUniqueId("Alias");
  const uniqueEcomName = getUniqueId("Ecom");
  const uniqueNote = `Note-${Date.now()}`;
  const uniqueUPC1 = `${Date.now()}01`;
  const uniqueUPC2 = `${Date.now()}02`;
  const uniqueBin = getUniqueId("BIN");
  const uniqueZone = getUniqueId("Zone");
  const uniqueAisle = getUniqueId("Aisle");
  const uniquePieceUPC = `FEY${Date.now()}01`;
  const uniquePackUPC = `FEY${Date.now()}02`;
  const uniqueCaseUPC = `FEY${Date.now()}03`;
  const uniquePalletUPC = `FEY${Date.now()}04`;
  const uniqueDescription = `Description for ${uniqueProductName}`;

  // Pick random brand image
  const folderPath = path.join(__dirname, '../assets');
  const randomImage = getRandomImage(folderPath);
  console.log(`Uploading image: ${randomImage}`);

  const BASE_URL = 'https://preprod.ikhub.biz/auth/login';

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
    context = await browser.newContext({ viewport: null, deviceScaleFactor: undefined });
    page = await context.newPage();
  });

  // Utility to get random image
  function getRandomImage(folderPath) {
      const files = fs.readdirSync(folderPath).filter(file =>
        file.match(/\.(jpg|jpeg|png|gif)$/i)
      );
      const randomFile = files[Math.floor(Math.random() * files.length)];
      return path.join(folderPath, randomFile);
  }

  // Helper to generate unique values
  function getUniqueId(prefix = "ID") {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  test('Login', async () => {
    await page.goto(BASE_URL, { timeout: 120000 });
    await page.getByPlaceholder('Email or User Name').fill('preprod');
    await page.getByPlaceholder('Password').fill('Password@123');
    await page.getByRole('button', { name: 'Sign In' }).click();
  });

  test('Navigate to Products Module', async () => {
    await page.getByRole('button', { name: 'shop Product Catalog' }).click();
    await page.waitForTimeout(10000);
    await page.getByRole('link', { name: '• Products' }).click();
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'Add Product' }).click();
    await page.waitForTimeout(5000);
  });

test('Add New Product', async () => { 


  // Fill product fields
  await page.locator("input[placeholder='Product Name']").fill(uniqueProductName);
  await page.waitForTimeout(1000);
  await page.locator("xpath=//span[contains(text(),'Alias Name')]/parent::div//input").fill(uniqueAlias);
  await page.waitForTimeout(1000); 
  await page.getByRole('textbox', { name: 'Product Ecom Name' }).fill(uniqueEcomName);
  await page.locator("input[id='basic-url']").fill('100');
  await page.waitForTimeout(1000);

  // Keep dropdowns static
  await page.locator("xpath=//label[.='Select Brand']/following-sibling::div//input").fill('EcoGlow');
  await page.getByTitle('EcoGlow').click();
  await page.waitForTimeout(1000);

  await page.locator("input[name='retail_upc1']").fill(uniqueUPC1);
  await page.locator("input[name='retail_upc2']").fill(uniqueUPC2);
  await page.locator("xpath=//input[@id='bin-field']").fill(uniqueBin);
  await page.locator("xpath=//input[@name='zone']").fill(uniqueZone);
  await page.locator("xpath=//input[@name='aisle']").fill(uniqueAisle);
  await page.waitForTimeout(1000);

  // Keep supplier dropdown static
    await page.locator("xpath=//label[.='Select Suppliers']/following-sibling::div//span[contains(text(),'Select')]").click();
    await page.locator("xpath=//label[.='Select Suppliers']/following-sibling::div//input").fill('fitzone');
    await page.getByTitle('FitZone').click();
    await page.locator("//div[@class='ant-tree-list-holder-inner']//div[1]//span[3]").click();
    await page.locator("//span[contains(text(),'Tags')]").click();
    await page.getByTitle('LAPTOP').click();
    await page.waitForTimeout(2000);

    await page.locator("#note-field").fill(uniqueNote);

  // Checkboxes
  await page.locator("input[name='is_msa_compliant']").check();
  await page.locator("xpath=//input[@name='back_order_portal']").check();
  await page.locator("xpath=//input[@name='is_tax_applicable']").check();
  await page.locator("//input[@name='is_online']").check();
  await page.locator("xpath=//input[@name='is_featured']").check();
  await page.locator("xpath=//input[@name='is_hot_seller']").check();
  await page.locator("xpath=//input[@name='is_new_arrival']").check();
  await page.locator("//input[@name='back_order_ecom']").check({ force: true });
  await page.waitForTimeout(2000);
  // Dynamic description
  await page.locator("xpath=//div[@role='textbox']").fill(uniqueDescription);
  await page.evaluate(() => {
      window.scrollTo(0, 500);
  });

  // Upload product image
  await page.locator("//div[contains(@class,'coa-file-upload')]//input[@type='file']").setInputFiles(randomImage);
  await page.waitForTimeout(5000);
  await page.getByRole('textbox', { name: 'Enter Sticks Count' }).fill('5');
  await page.waitForTimeout(1000);

  // Keep category static
  await page.locator("xpath=//span[contains(text(),'Select MSA Category')]//parent::div//input").click();
  await page.getByText('-E-pod').click();
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(5000);

  await page.locator("xpath=//input[@name='piece_upc']").fill(uniquePieceUPC);
  await page.locator("xpath=//input[@name='pack_definition']").fill('12');
  await page.locator("xpath=//input[@name='pack_upc']").fill(uniquePackUPC);
  await page.locator("xpath=//input[@name='case_definition']").fill('6');
  await page.locator("xpath=//input[@name='case_upc']").fill(uniqueCaseUPC);
  await page.locator("xpath=//input[@name='pallet_definition']").fill('1');
  await page.locator("xpath=//input[@name='pallet_upc']").fill(uniquePalletUPC);

  await page.evaluate(() => {
      window.scrollTo(0, 500);
  }); 
  await page.waitForTimeout(2000);
  await page.locator("xpath=//input[@name='channel_info[0].unit_prices[0].base_cost']").fill('30');
  await page.locator("xpath=//input[@name='channel_info[0].unit_prices[0].price']").fill('35');

  await page.getByRole('button', { name: 'Calculate Prices' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Calculate' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Save' }).click();

  console.log(`✅ Product created: ${uniqueProductName}`);
  await page.waitForTimeout(5000);
  });

  test.afterAll(async () => {
    //await page.pause();
    await browser.close();
  });
});