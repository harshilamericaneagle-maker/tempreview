import { expect, test } from "@playwright/test";

test("shows and clears impersonation banner", async ({ page }) => {
  let impersonationActive = true;

  await page.route("**/api/admin/impersonation", async (route) => {
    const req = route.request();
    if (req.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          data: impersonationActive ? { tenantId: "tenant_demo", tenantName: "Demo Bistro" } : null,
        }),
      });
      return;
    }

    if (req.method() === "DELETE") {
      impersonationActive = false;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, data: { cleared: true } }),
      });
      return;
    }

    await route.fallback();
  });

  await page.goto("/app");
  await expect(page.getByText("Impersonating tenant:")).toBeVisible();
  await expect(page.getByText("Demo Bistro")).toBeVisible();

  await page.getByRole("button", { name: "Stop" }).click();
  await expect(page.getByText("Impersonating tenant:")).toHaveCount(0);
});
