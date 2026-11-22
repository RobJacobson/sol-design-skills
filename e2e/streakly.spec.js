import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-22T02:30:00Z'));
});

async function expectNoHorizontalOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
}

test('landing navigation, pricing preview, and sign-up lead to a populated tracker', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Small habits. Big changes.' })).toBeVisible();
  await expect(page.locator('#features article')).toHaveCount(3);
  await expect(page.locator('#pricing article')).toHaveCount(2);
  await expectNoHorizontalOverflow(page);

  await page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Pricing' }).click();
  await expect(page).toHaveURL(/#pricing$/);
  await page.getByRole('button', { name: 'Explore Pro' }).click();
  await expect(page.getByRole('dialog', { name: 'Streakly Pro' })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();

  await page.getByRole('button', { name: 'Start for free', exact: true }).click();
  const signup = page.getByRole('dialog');
  await expect(signup.getByRole('textbox', { name: 'Name' })).toBeFocused();
  await signup.getByRole('textbox', { name: 'Name' }).fill('Taylor Reed');
  await signup.getByRole('textbox', { name: 'Email' }).fill('taylor@example.com');
  await signup.getByRole('button', { name: 'Start tracking' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Hi, Taylor' })).toBeVisible();
  await expect(page.getByText('2 of 5 done')).toBeVisible();
  await expect(page.getByText('8 days', { exact: true })).toBeVisible();
  await expect(page.locator('.heat-cell')).toHaveCount(84);
  await expectNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test('checking and adding a habit updates the checklist, chart, and saved data', async ({ page }) => {
  await page.goto('/dashboard');
  const movement = page.getByRole('checkbox', { name: 'Move for 20 minutes' });
  await expect(movement).not.toBeChecked();
  await page.getByText('Move for 20 minutes', { exact: true }).click();
  await expect(movement).toBeChecked();
  await expect(page.getByText('3 of 5 done')).toBeVisible();
  await expect(page.locator('li[aria-label="Saturday: 3"]')).toBeVisible();
  await expect(page.locator('td[title="Nov 21: 3 check-ins"] .heat-cell')).toHaveClass(/heat-3/);
  await movement.press('Space');
  await expect(movement).not.toBeChecked();

  const addButton = page.getByRole('button', { name: 'Add habit' });
  await addButton.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Add a habit' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(addButton).toBeFocused();

  await addButton.click();
  await dialog.getByRole('button', { name: 'Add habit' }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox', { name: 'Habit name' }).fill('Take a lunch-time walk');
  await dialog.locator('label[title="Exercise"]').click();
  await dialog.getByText('3 days per week', { exact: true }).click();
  await dialog.getByRole('button', { name: 'Add habit' }).click();
  await expect(dialog).not.toBeVisible();
  const row = page.locator('.habit-row').filter({ hasText: 'Take a lunch-time walk' });
  await expect(row).toContainText('0 / 3 days this week');
  await expect(row.locator('.habit-icon')).toHaveClass(/icon-green/);
  await row.click();
  await expect(row).toContainText('1 / 3 days this week');
  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Take a lunch-time walk' })).toBeChecked();
  await expect(page.getByText('3 of 6 done')).toBeVisible();
});

test('exact calendar counts are available by pointer and with one keyboard tab stop', async ({ page }) => {
  await page.goto('/dashboard');
  const calendar = page.getByRole('table');
  const today = calendar.getByRole('button', { name: 'Nov 21: 2 check-ins' });
  await expect(calendar.locator('button[tabindex="0"]')).toHaveCount(1);
  await today.focus();
  await page.keyboard.press('ArrowDown');
  const next = calendar.getByRole('button', { name: 'Nov 22: Upcoming' });
  await expect(next).toBeFocused();
  await expect(page.locator('.activity-footer')).toContainText('Nov 22: Upcoming');
  await page.keyboard.press('ArrowLeft');
  await expect(calendar.locator('button:focus')).toHaveAccessibleName(/^Nov 15:/);
  await today.click();
  await expect(page.locator('.activity-footer')).toContainText('Nov 21: 2 check-ins');
  await expect(calendar.locator('button[tabindex="0"]')).toHaveCount(1);
});

test('profile, dark mode, and evening reminders persist across navigation and reloads', async ({ page }) => {
  await page.goto('/settings');
  await expectNoHorizontalOverflow(page);
  const name = page.getByRole('textbox', { name: 'Name' });
  const email = page.getByRole('textbox', { name: 'Email' });
  await expect(name).toHaveValue('Alex Morgan');
  await expect(email).toHaveValue('alex.morgan@example.com');
  await name.fill('Jamie Rivera');
  await email.fill('jamie@example.com');
  await expect(page.getByRole('status')).toHaveText('Unsaved changes');
  await page.getByRole('link', { name: 'Today' }).click();
  await expect(page.getByRole('heading', { name: 'Hi, Alex' })).toBeVisible();
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await expect(name).toHaveValue('Jamie Rivera');
  await expect(email).toHaveValue('jamie@example.com');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved');
  await page.getByText('Notifications', { exact: true }).click();
  await page.getByText('Dark mode', { exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(name).toHaveValue('Jamie Rivera');
  await expect(email).toHaveValue('jamie@example.com');
  await expect(page.getByRole('switch', { name: 'Notifications' })).toBeChecked();
  await expect(page.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
  await page.getByRole('link', { name: 'Today' }).click();
  await expect(page.getByRole('heading', { name: 'Hi, Jamie' })).toBeVisible();
  await expect(page.getByText(/you still have 3 habits left today/)).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
