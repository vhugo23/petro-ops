import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { mockAssets } from "../../mock-data/src/assets";
import { mockSensorReadings } from "../../mock-data/src/sensorReadings";
import { mockProductionAssumptions } from "../../mock-data/src/productionAssumptions";
import { getAssetOperationSummary } from "../../core/operationsSummary/src/operationsSummary";

function sendJson(res: http.ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export function createServer(): http.Server {
  return http.createServer((req, res) => {
    const pathname = new URL(req.url ?? "/", "http://localhost").pathname;

    if (req.method === "GET" && pathname === "/assets") {
      return sendJson(res, 200, mockAssets);
    }

    if (req.method === "GET" && pathname === "/operations-summary") {
      const summaries = mockAssets.flatMap((asset) => {
        const reading = mockSensorReadings.find((r) => r.assetId === asset.assetId);
        if (!reading) return [];
        return [getAssetOperationSummary(asset, reading, mockProductionAssumptions)];
      });
      return sendJson(res, 200, summaries);
    }

    if (req.method === "GET" && pathname === "/") {
      try {
        const html = fs.readFileSync(path.resolve("public", "index.html"), "utf-8");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      } catch {
        sendJson(res, 404, { error: "Dashboard not found" });
      }
      return;
    }

    const assetMatch = pathname.match(/^\/assets\/([^/]+)\/summary$/);
    if (req.method === "GET" && assetMatch) {
      const assetId = assetMatch[1];
      const asset = mockAssets.find((a) => a.assetId === assetId);
      if (!asset) {
        return sendJson(res, 404, { error: `Asset '${assetId}' not found` });
      }
      const reading = mockSensorReadings.find((r) => r.assetId === assetId);
      if (!reading) {
        return sendJson(res, 404, { error: `No sensor reading found for asset '${assetId}'` });
      }
      return sendJson(res, 200, getAssetOperationSummary(asset, reading, mockProductionAssumptions));
    }

    sendJson(res, 404, { error: "Not found" });
  });
}
