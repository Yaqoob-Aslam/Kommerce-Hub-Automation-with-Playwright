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

  // Utility to generate random category data
  function generateCategory() {
  const categories = [
    'Shirt', 'Jeans', 'Jacket', 'Dress', 'Kurti', 'Blazer', 'Sneakers', 'Skirt', 'Hoodie', 'Trousers',
    'T-shirt', 'Shorts', 'Coat', 'Sweater', 'Vest', 'Blouse', 'Polo', 'Cardigan', 'Jumper', 'Tank Top',
    'Leggings', 'Capris', 'Joggers', 'Sweatpants', 'Cargo Pants', 'Chinos', 'Palazzo', 'Culottes', 'Bodysuit',
    'Peplum Top', 'Crop Top', 'Tube Top', 'Halter Top', 'Flannel', 'Tunic', 'Kimono', 'Poncho', 'Bootcut Jeans',
    'Flared Jeans', 'Skinny Jeans', 'High-waisted', 'Low-rise', 'Boyfriend Jeans', 'Mom Jeans', 'Jeggings',
    'Trench Coat', 'Pea Coat', 'Raincoat', 'Windbreaker', 'Parka', 'Puffer', 'Leather Jacket', 'Denim Jacket',
    'Bomber Jacket', 'Sports Jacket', 'Gilet', 'Shawl', 'Cape', 'Maxi Dress', 'Midi Dress', 'Mini Dress',
    'Shift Dress', 'A-line Dress', 'Bodycon', 'Wrap Dress', 'Sundress', 'Cocktail Dress', 'Evening Gown',
    'Wedding Dress', 'Skater Dress', 'Shirt Dress', 'Smock Dress', 'Pleated Skirt', 'Pencil Skirt',
    'A-line Skirt', 'Maxi Skirt', 'Mini Skirt', 'Denim Skirt', 'Tiered Skirt', 'Wrap Skirt', 'Boots',
    'Ankle Boots', 'Knee-high Boots', 'Sandals', 'Flip Flops', 'Heels', 'Wedges', 'Flats', 'Loafers',
    'Oxfords', 'Brogues', 'Mules', 'Clogs', 'Espadrilles', 'Slippers', 'Athletic Shoes', 'Hiking Boots',
    'Chelsea Boots', 'Platform Shoes', 'Stilettos', 'Block Heels', 'Ballet Flats', 'Boat Shoes'
  ];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];
  const year = new Date().getFullYear();
  const timestamp = Date.now();

  const name = `${randomCategory}-${randomSeason}-${year}-${timestamp}`;
  const description = `This is ${randomCategory} category for ${randomSeason} ${year}.`;
  const slug = `/${randomCategory.toLowerCase().replace(/\s+/g, '-')}-${randomSeason.toLowerCase()}-${year}-${timestamp}`;
  const metaTitle = `${randomCategory} for ${randomSeason} ${year}`;
  const metaDescription = `Explore our ${randomCategory} collection designed for ${randomSeason} ${year}.`;

  return { name, description, slug, metaTitle, metaDescription };
}

   // Utility to get random image
   function getRandomImage(folderPath) {
     const files = fs.readdirSync(folderPath).filter(file =>
       file.match(/\.(jpg|jpeg|png|gif)$/i)
     );
     const randomFile = files[Math.floor(Math.random() * files.length)];
     return path.join(folderPath, randomFile);
   }

  // Pick random brand image
  const folderPath = path.join(__dirname, '../assets');
  const randomImage = getRandomImage(folderPath);
  console.log(`Uploading image: ${randomImage}`);
  
  test('Login', async () => {
    await page.goto(BASE_URL, { timeout: 120000 });
    await page.getByPlaceholder('Email or User Name').fill('preprod');
    await page.getByPlaceholder('Password').fill('Password@123');
    await page.getByRole('button', { name: 'Sign In' }).click();
  });

  test('Add Category', async () => {
    const { name, description } = generateCategory();

    await page.getByRole('button', { name: 'shop Product Catalog' }).click();
    await page.getByRole('link', { name: '• Categories' }).click();
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'Add Root Category' }).click();
    await page.getByRole('textbox', { name: 'Enter Category Name' }).fill(name);
    await page.getByRole('textbox', { name: 'Rich Text Editor, main' }).fill(description);
    await page.getByRole('button', { name: 'Add Category' }).click();

    await expect(page.getByText(name)).toBeVisible();
    await page.waitForTimeout(5000);
  });

  test('Add Category with MSA & ECOM', async () => {
    const { name, description } = generateCategory();

    await page.getByRole('button', { name: 'Add Root Category' }).click();
    await page.getByRole('textbox', { name: 'Enter Category Name' }).fill(name);
    await page.getByRole('checkbox', { name: 'Is MSA' }).check();
    await page.getByRole('checkbox', { name: 'Show on ECOM' }).check();
    
    await page.getByText('Please select Msa Code').click();
    await page.getByText('- Moist Snuff').click();
    await page.getByRole('textbox', { name: 'Rich Text Editor, main' }).fill(description);
    await page.getByRole('button', { name: 'Add Category' }).click();

    await expect(page.getByText(name)).toBeVisible();
    await page.waitForTimeout(5000);
  });

  test('Add Category with MSA, ECOM & Parent Category', async () => {
    const { name, description } = generateCategory();

    await page.getByRole('button', { name: 'Add Root Category' }).click();
    await page.getByRole('textbox', { name: 'Enter Category Name' }).fill(name);
    await page.waitForTimeout(2000);
    await page.getByRole('checkbox', { name: 'Is MSA' }).check();
    await page.waitForTimeout(2000);
    await page.getByRole('checkbox', { name: 'Show on ECOM' }).check();
    
    await page.getByText('Please select Msa Code').click();
    await page.getByText('- Moist Snuff').click();

    // Dropdown virtual list container (AntD usually uses .rc-virtual-list or .ant-select-dropdown .rc-virtual-list-holder)
    // Ant Design’s dropdown uses virtual scroll → your option may not load at exactly that scroll offset

    await page.getByText('Please Select', { exact: true }).click();

    // Get the dropdown scroll container (last in case multiple dropdowns exist)
    const dropdown = page.locator('.ant-select-dropdown .rc-virtual-list-holder').last();

    // The option we want
    const option = page.locator('.ant-select-dropdown .ant-select-item')
      .filter({ hasText: 'Wrap Dress-Summer-2025-1756217534783' })
      .first();

    // Incrementally scroll until the option is visible
    for (let i = 0; i < 15; i++) {
      if (await option.isVisible()) break;
      await dropdown.evaluate(el => el.scrollBy(0, 200));
      await page.waitForTimeout(300);
    }

    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click({ force: true });
    await page.waitForTimeout(2000);

    await page.getByRole('textbox', { name: 'Rich Text Editor, main' }).fill(description);
    await page.getByRole('button', { name: 'Add Category' }).click();
    await expect(page.getByText(name)).toBeVisible();
    await page.waitForTimeout(5000);    
  });

  test('Add Category with MSA, ECOM, Parent Category & Image Upload', async () => {
    const { name, description } = generateCategory();
    
    await page.getByRole('button', { name: 'Add Root Category' }).click();
    await page.getByRole('textbox', { name: 'Enter Category Name' }).fill(name);
    await page.getByRole('checkbox', { name: 'Is MSA' }).check();
    await page.getByRole('checkbox', { name: 'Show on ECOM' }).check();
    
    await page.getByText('Please select Msa Code').click();
    await page.getByText('- Moist Snuff').click();

    // Dropdown virtual list container (AntD usually uses .rc-virtual-list or .ant-select-dropdown .rc-virtual-list-holder)
    // Ant Design’s dropdown uses virtual scroll → your option may not load at exactly that scroll offset

    await page.getByText('Please Select', { exact: true }).click();

    // Get the dropdown scroll container (last in case multiple dropdowns exist)
    const dropdown = page.locator('.ant-select-dropdown .rc-virtual-list-holder').last();

    // The option we want
    const option = page.locator('.ant-select-dropdown .ant-select-item')
      .filter({ hasText: 'Wrap Dress-Summer-2025-1756217534783' })
      .first();

    // Incrementally scroll until the option is visible
    for (let i = 0; i < 15; i++) {
      if (await option.isVisible()) break;
      await dropdown.evaluate(el => el.scrollBy(0, 200));
      await page.waitForTimeout(300);
    }

    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click({ force: true });
    await page.waitForTimeout(2000);

    await page.getByRole('textbox', { name: 'Rich Text Editor, main' }).fill(description);
    await page.locator('input[name=images]').setInputFiles(randomImage);
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Add Category' }).click();
    await expect(page.getByText(name)).toBeVisible();
    await page.waitForTimeout(5000);
  });

  test('Add Category with SEO Section', async () => {
    const { name, description, slug, metaTitle, metaDescription } = generateCategory();

    await page.getByRole('button', { name: 'Add Root Category' }).click();
    await page.getByRole('textbox', { name: 'Enter Category Name' }).fill(name);
    await page.getByRole('textbox', { name: 'Rich Text Editor, main' }).fill(description);

    // SEO Section
    await page.getByRole('textbox', { name: 'Enter Category Slug' }).fill(slug);
    await page.getByRole('textbox', { name: 'Enter Meta Title' }).fill(metaTitle);
    await page.getByRole('textbox', { name: 'Enter Meta Description' }).fill(metaDescription);
    await page.getByRole('button', { name: 'Add Category' }).click();
    await expect(page.getByText(name)).toBeVisible();
    await page.waitForTimeout(5000);
});

  test.afterAll(async () => {
    // await page.pause();
    await browser.close();
  });
});