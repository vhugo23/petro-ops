import { describe, test, expect } from "vitest";
import { getAssetOperationSummary } from "../src/operationsSummary";
import { mockAssets } from "../../../mock-data/src/assets";
import { mockSensorReadings } from "../../../mock-data/src/sensorReadings";
import { mockProductionAssumptions } from "../../../mock-data/src/productionAssumptions";

const testAsset = {
  assetId: "asset-test",
  name: "Test Pump",
  type: "Pump",
  location: "Site X",
  criticality: "High",
  status: "Healthy",
  expectedFlowRate: 100,
};

// score 0 → Healthy
const healthyReading = {
  readingId: "reading-healthy",
  assetId: "asset-test",
  timestamp: "2026-06-30T00:00:00Z",
  temperature: 150,
  pressure: 100,
  vibration: 2.0,
  flowRate: 100,
  runtimeHours: 1000,
};

// score 51 (15+10+10+8+8) → Warning
const warningReading = {
  readingId: "reading-warning",
  assetId: "asset-test",
  timestamp: "2026-06-30T00:00:00Z",
  temperature: 190,
  pressure: 70,
  vibration: 4.0,
  flowRate: 115,
  runtimeHours: 5000,
};

// score 70 (30+20+20) → Critical
const criticalReading = {
  readingId: "reading-critical",
  assetId: "asset-test",
  timestamp: "2026-06-30T00:00:00Z",
  temperature: 220,
  pressure: 50,
  vibration: 7.0,
  flowRate: 100,
  runtimeHours: 1000,
};

describe("Operations Summary", () => {
  test("OS-1: Summary includes all required top-level sections", () => {
    const summary = getAssetOperationSummary(
      mockAssets[0],
      mockSensorReadings[0],
      mockProductionAssumptions,
    );
    expect(summary).toHaveProperty("asset");
    expect(summary).toHaveProperty("latestReading");
    expect(summary).toHaveProperty("healthAssessment");
    expect(summary).toHaveProperty("workOrderEvaluation");
    expect(summary).toHaveProperty("commercialImpact");
  });

  test("OS-2: Healthy reading produces zero commercial impact and no work order", () => {
    const summary = getAssetOperationSummary(testAsset, healthyReading, mockProductionAssumptions);
    expect(summary.healthAssessment.status).toBe("Healthy");
    expect(summary.workOrderEvaluation.workOrder).toBeNull();
    expect(summary.workOrderEvaluation.advisory).toBeNull();
    expect(summary.commercialImpact.estimatedDowntimeHours).toBe(0);
    expect(summary.commercialImpact.lostProductionEstimate).toBe(0);
    expect(summary.commercialImpact.revenueImpactEstimate).toBe(0);
    expect(summary.commercialImpact.maintenanceCostEstimate).toBe(0);
  });

  test("OS-3: Warning reading produces advisory, no work order, non-zero impact without workOrderId", () => {
    const summary = getAssetOperationSummary(testAsset, warningReading, mockProductionAssumptions);
    expect(summary.healthAssessment.status).toBe("Warning");
    expect(summary.workOrderEvaluation.workOrder).toBeNull();
    expect(summary.workOrderEvaluation.advisory).not.toBeNull();
    expect(summary.commercialImpact.estimatedDowntimeHours).toBeGreaterThan(0);
    expect(summary.commercialImpact).not.toHaveProperty("workOrderId");
  });

  test("OS-4: Critical reading produces work order, no advisory, non-zero impact with workOrderId", () => {
    const summary = getAssetOperationSummary(testAsset, criticalReading, mockProductionAssumptions);
    expect(summary.healthAssessment.status).toBe("Critical");
    expect(summary.workOrderEvaluation.workOrder).not.toBeNull();
    expect(summary.workOrderEvaluation.advisory).toBeNull();
    expect(summary.commercialImpact.estimatedDowntimeHours).toBeGreaterThan(0);
    expect(summary.commercialImpact).toHaveProperty("workOrderId");
  });

  test("OS-5: healthAssessment.assetId matches the input asset", () => {
    const summary = getAssetOperationSummary(testAsset, healthyReading, mockProductionAssumptions);
    expect(summary.healthAssessment.assetId).toBe(testAsset.assetId);
  });

  test("OS-6: commercialImpact.assessmentId matches healthAssessment.assessmentId", () => {
    const summary = getAssetOperationSummary(testAsset, warningReading, mockProductionAssumptions);
    expect(summary.commercialImpact.assessmentId).toBe(summary.healthAssessment.assessmentId);
  });

  test("OS-7: asset and latestReading in summary are the same references passed in", () => {
    const summary = getAssetOperationSummary(
      mockAssets[0],
      mockSensorReadings[0],
      mockProductionAssumptions,
    );
    expect(summary.asset).toBe(mockAssets[0]);
    expect(summary.latestReading).toBe(mockSensorReadings[0]);
  });
});
