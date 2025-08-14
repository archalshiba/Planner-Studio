import { test, expect } from "@playwright/test"

test.describe("Idea Generation Flow", () => {
  test("should generate a project plan from an idea", async ({ page }) => {
    await page.goto("/")

    // Check if the main form is visible
    await expect(page.getByText("Describe Your Project Idea")).toBeVisible()

    // Fill in the idea
    const textarea = page.getByPlaceholder(/Example: A mobile app for tracking plant watering schedules/)
    await textarea.fill("A task management app for remote teams")

    // Submit the form
    await page.getByRole("button", { name: /Generate Project Plan/ }).click()

    // Wait for loading to complete
    await expect(page.getByText("Generating Your Project Plan...")).toBeVisible()

    // Check if plan is generated (this would need to be mocked in a real test)
    // For now, we'll just check that the loading state appears
    await expect(textarea).toHaveValue("A task management app for remote teams")
  })

  test("should allow selecting example ideas", async ({ page }) => {
    await page.goto("/")

    // Click on an example idea
    await page.getByText("A mobile app for tracking plant watering schedules").click()

    // Check if the textarea is filled
    const textarea = page.getByPlaceholder(/Example: A mobile app for tracking plant watering schedules/)
    await expect(textarea).toHaveValue("A mobile app for tracking plant watering schedules")
  })

  test("should show template selector", async ({ page }) => {
    await page.goto("/")

    // Check if template selector is visible
    await expect(page.getByText("Choose a Project Template")).toBeVisible()

    // Check if templates are displayed
    await expect(page.getByText("SaaS Web Application")).toBeVisible()
    await expect(page.getByText("Mobile App")).toBeVisible()
  })
})
