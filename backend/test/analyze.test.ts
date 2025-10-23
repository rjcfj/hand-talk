import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

// Mock MongoDB
vi.mock("../src/models/Analysis", () => ({
  default: {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue([
        { _id: "1", url: "https://exemplo.com", issues: [], date: new Date() },
      ]),
    }),
  },
}));

// Mock Redis
vi.mock("../src/config/redis", () => ({
  default: {
    get: vi.fn().mockResolvedValue(null), // simula cache vazio
    setEx: vi.fn().mockResolvedValue("OK"), // simula gravação no cache
  },
}));

const app = createApp();

describe("Test API", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // limpa mocks antes de cada teste
  });

  it("should return 200 on /api/results", async () => {
    const res = await request(app).get("/api/results?page=1&limit=1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data[0]).toHaveProperty("url", "https://exemplo.com");
    expect(res.body).toHaveProperty("page", 1);
    expect(res.body).toHaveProperty("limit", 1);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("totalPages");
  });
});
