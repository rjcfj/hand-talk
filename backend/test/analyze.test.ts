import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import Analysis from "../src/models/Analysis";

vi.mock("../src/models/Analysis", () => ({
  default: {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue([
        { _id: "1", url: "https://exemplo.com", issues: [], date: new Date() }
      ])
    })
  }
}));

const app = createApp();

describe("Test API", () => {
  it("should return 200 on /api/results", async () => {
    const res = await request(app).get("/api/results");
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty("url", "https://exemplo.com");
  });
});
