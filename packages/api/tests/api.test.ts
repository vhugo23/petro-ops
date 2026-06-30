import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { createServer } from "../src/server";
import { mockAssets } from "../../mock-data/src/assets";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";

let server: Server;
let base: string;

beforeAll(async () => {
  server = createServer();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

describe("API", () => {
  test("API-1: GET /assets returns all mock assets", async () => {
    const res = await fetch(`${base}/assets`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(mockAssets.length);
    expect(body[0].assetId).toBe(mockAssets[0].assetId);
  });

  test("API-2: GET /assets/:id/summary returns summary for a valid assetId", async () => {
    const res = await fetch(`${base}/assets/asset-1/summary`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("asset");
    expect(body).toHaveProperty("latestReading");
    expect(body).toHaveProperty("healthAssessment");
    expect(body).toHaveProperty("workOrderEvaluation");
    expect(body).toHaveProperty("commercialImpact");
  });

  test("API-3: GET /assets/:id/summary returns 404 for unknown assetId", async () => {
    const res = await fetch(`${base}/assets/does-not-exist/summary`);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  test("API-4: GET /operations-summary returns summaries for all assets", async () => {
    const res = await fetch(`${base}/operations-summary`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(mockAssets.length);
  });

  test("API-5: All successful endpoints respond with Content-Type application/json", async () => {
    const routes = ["/assets", "/assets/asset-1/summary", "/operations-summary"];
    for (const route of routes) {
      const res = await fetch(`${base}${route}`);
      expect(res.headers.get("content-type")).toContain("application/json");
    }
  });

  test("API-6: Unknown route returns 404", async () => {
    const res = await fetch(`${base}/not-a-real-route`);
    expect(res.status).toBe(404);
  });
});
