import { expect, test } from "@playwright/test";

test("runs campaign and reflects updated state", async ({ page }) => {
  let campaignStatus = "draft";

  await page.route("**/api/templates", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        data: [{ id: "tpl_1", channel: "email", subject: "How was your visit?" }],
      }),
    });
  });

  await page.route("**/api/campaigns", async (route) => {
    const req = route.request();

    if (req.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          data: [
            {
              id: "camp_1",
              name: "Winback April",
              status: campaignStatus,
              trigger: "manual",
              templateId: "tpl_1",
            },
          ],
        }),
      });
      return;
    }

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, data: { id: "camp_2" } }),
    });
  });

  await page.route("**/api/campaigns/camp_1/run", async (route) => {
    campaignStatus = "completed";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, data: { queued: true } }),
    });
  });

  await page.goto("/app/campaigns");
  await expect(page.getByText("Winback April")).toBeVisible();
  await expect(page.getByText("draft")).toBeVisible();

  await page.getByRole("button", { name: "Run now" }).click();
  await expect(page.getByText("completed")).toBeVisible();
});
