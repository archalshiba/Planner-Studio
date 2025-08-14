import { test, expect } from "@playwright/test"

test.describe("Dashboard", () => {
  test("should display dashboard for authenticated users", async ({ page }) => {
    await page.goto("/dashboard")

    // Should show sign in option for demo user
    await expect(page.getByText("Sign In")).toBeVisible()

    // Sign in as demo user
    await page.getByText("Sign In").click()

    // Should redirect to dashboard
    await expect(page.getByText("Dashboard")).toBeVisible()
    await expect(page.getByText("Your Project Plans")).toBeVisible()
  })

  test("should show plan history", async ({ page }) => {
    await page.goto("/dashboard")

    // Sign in first
    await page.getByText("Sign In").click()

    // Check for plan history section
    await expect(page.getByText("Recent Plans")).toBeVisible()
  })
})
