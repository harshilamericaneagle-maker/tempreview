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

describe("POST /api/webhooks/twilio", () => {
  beforeEach(() => {
    update.mockReset();
    update.mockResolvedValue({});
  });

  it("rejects payloads without requestId", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/webhooks/twilio", {
      method: "POST",
      body: new URLSearchParams({ MessageStatus: "delivered" }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const response = await POST(request);
    const json = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(update).not.toHaveBeenCalled();
  });

  it("maps Twilio message status to review request status", async () => {
    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/webhooks/twilio?requestId=req_123", {
      method: "POST",
      body: new URLSearchParams({ MessageStatus: "delivered" }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const response = await POST(request);
    const json = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(update).toHaveBeenCalledWith({
      where: { id: "req_123" },
      data: { status: "delivered" },
    });
  });
});
