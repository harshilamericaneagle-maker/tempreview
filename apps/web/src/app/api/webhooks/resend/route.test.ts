import { beforeEach, describe, expect, it, vi } from "vitest";

const update = vi.fn(async () => ({}));

vi.mock("@reviewhub/db", () => ({
  prisma: {
    $admin: {
      reviewRequest: {
        update,
      },
    },
  },
}));

describe("POST /api/webhooks/resend", () => {
  beforeEach(() => {
    update.mockReset();
    update.mockResolvedValue({});
  });

  it("returns validation error when request id is absent", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/webhooks/resend", {
      method: "POST",
      body: JSON.stringify({ type: "email.delivered", data: {} }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(update).not.toHaveBeenCalled();
  });

  it("updates review request status from resend event", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/webhooks/resend", {
      method: "POST",
      body: JSON.stringify({
        type: "email.delivered",
        data: {
          headers: {
            "X-ReviewRequest-Id": "req_789",
          },
        },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(update).toHaveBeenCalledWith({
      where: { id: "req_789" },
      data: { status: "delivered" },
    });
  });
});
