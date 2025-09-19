import { test, expect, chromium } from '@playwright/test';

test.describe.serial('Kommerce HUB Login', () => {

  let browser, context, page;
  const BASE_URL = 'https://preprod.ikhub.biz/auth/login';

  test.beforeAll(async () => {
    browser = await chromium.launch({headless: false,args: ['--start-maximized']});
    context = await browser.newContext({viewport: null,deviceScaleFactor: undefined});
    page = await context.newPage();
  });

  // Login with Invalid credentials
  test('Login with empty username and password', async () => {
     await page.goto(BASE_URL, { timeout: 120000 });
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Username is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });
 
  test('Login with empty username', async () => {
    await page.goto(BASE_URL,{ timeout: 40000 });
    await page.getByPlaceholder('Password').fill('Password@123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Username is required')).toBeVisible();
  });

  test('Login with empty password', async () => {
    await page.goto(BASE_URL, { timeout: 40000 });
    await page.getByPlaceholder('Email or User Name').fill('owner');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Password is required')).toBeVisible();

  });

  test('Login with invalid username', async () => {
    await page.goto(BASE_URL, { timeout: 40000 });
    await page.getByPlaceholder('Email or User Name').fill('invalidUser');
    await page.getByPlaceholder('Password').fill('Password@123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.locator('.alert-text.font-weight-bold')).toContainText('The login detail is incorrect');
  });

  test('Login with invalid password', async () => {
    await page.goto(BASE_URL, { timeout: 40000 });
    await page.getByPlaceholder('Email or User Name').fill('preprod');
    await page.getByPlaceholder('Password').fill('wrongPassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Password must contain 8 characters. uppercase, lowercase, number and symbol.')).toBeVisible();
  });

  test('Login with SQL injection attempt', async () => {
    await page.goto(BASE_URL, { timeout: 40000 });
    await page.getByPlaceholder('Email or User Name').fill("' OR '1'='1");
    await page.getByPlaceholder('Password').fill("' OR '1'='1");
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Password must contain 8 characters. uppercase, lowercase, number and symbol.')).toBeVisible();
  });

  test('Login with XSS attempt', async () => {
    await page.goto(BASE_URL, { timeout: 40000 });
    await page.getByPlaceholder('Email or User Name').fill("<script>alert('hack')</script>");
    await page.getByPlaceholder('Password').fill('Password@123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('The login detail is incorrect')).toBeVisible();
  });

  // Login with Valid credentials
   test('Login page should load correctly', async () => {
    await page.goto(BASE_URL, { timeout: 40000 });
    await expect(page.getByPlaceholder('Email or User Name')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('User should be able to login with valid credentials', async () => {
    await page.getByPlaceholder('Email or User Name').fill('preprod');
    await page.getByPlaceholder('Password').fill('Password@123');
    await page.getByRole('button', { name: 'Sign In' }).click();
  });

  test('User should be able to logout', async () => {
    await page.locator('#kt_quick_user_toggle').click();
    await page.getByRole('button', { name: 'Log out', exact: true }).click();
  });

  test.afterAll(async () => {
     //await page.pause();
     await browser.close();
  });
});
