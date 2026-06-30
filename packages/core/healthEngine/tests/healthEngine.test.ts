import { describe, test, expect } from "vitest";
import { calculateHealthAssessment, classifyStatus } from "../src/healthEngine";

const baseAsset = {
  assetId: "asset-1",
  name: "Pump 1",
  type: "Pump",
  location: "Site A",
  criticality: "High",
  status: "Healthy",
  expectedFlowRate: 100,
};

const normalReading = {
  readingId: "reading-1",
  assetId: "asset-1",
  timestamp: "2026-06-30T00:00:00Z",
  temperature: 150,
  pressure: 100,
  vibration: 2.0,
  flowRate: 100,
  runtimeHours: 1000,
};

describe("Health Engine", () => {
  test("HE-1: Healthy asset receives Healthy status", () => {
    const result = calculateHealthAssessment(baseAsset, normalReading);
    expect(result.riskScore).toBe(0);
    expect(result.status).toBe("Healthy");
  });

  test("HE-2: Warning asset receives Warning status", () => {
    const reading = {
      ...normalReading,
      vibration: 4.0,
      temperature: 190,
      pressure: 70,
      flowRate: 115,
      runtimeHours: 5000,
    };
    const result = calculateHealthAssessment(baseAsset, reading);
    expect(result.riskScore).toBe(51);
    expect(result.status).toBe("Warning");
  });

  test("HE-3: Critical asset receives Critical status", () => {
    const reading = { ...normalReading, vibration: 7.0, temperature: 220, pressure: 50 };
    const result = calculateHealthAssessment(baseAsset, reading);
    expect(result.riskScore).toBe(70);
    expect(result.status).toBe("Critical");
  });

  test("HE-4: High vibration adds risk reason", () => {
    const reading = { ...normalReading, vibration: 4.0 };
    const result = calculateHealthAssessment(baseAsset, reading);
    expect(result.reasons).toContain("High vibration");
  });

  test("HE-5: Elevated temperature adds risk reason", () => {
    const reading = { ...normalReading, temperature: 190 };
    const result = calculateHealthAssessment(baseAsset, reading);
    expect(result.reasons).toContain("Elevated temperature");
  });

  test("HE-6: Abnormal pressure adds risk reason", () => {
    const reading = { ...normalReading, pressure: 50 };
    const result = calculateHealthAssessment(baseAsset, reading);
    expect(result.reasons).toContain("Abnormal pressure");
  });

  test("HE-7: Excessive runtime adds risk reason", () => {
    const reading = { ...normalReading, runtimeHours: 5000 };
    const result = calculateHealthAssessment(baseAsset, reading);
    expect(result.reasons).toContain("Excessive runtime hours");
  });

  test("HE-8: Risk score cannot exceed 100", () => {
    const reading = {
      ...normalReading,
      vibration: 7.0,
      temperature: 220,
      pressure: 50,
      flowRate: 200,
      runtimeHours: 9000,
    };
    const result = calculateHealthAssessment(baseAsset, reading);
    expect(result.riskScore).toBeLessThanOrEqual(100);
  });

  test("HE-9: Risk score cannot be below 0", () => {
    const result = calculateHealthAssessment(baseAsset, normalReading);
    expect(result.riskScore).toBeGreaterThanOrEqual(0);
  });

  test("HE-10: Score of exactly 39 classifies as Healthy", () => {
    expect(classifyStatus(39)).toBe("Healthy");
  });

  test("HE-11: Score of exactly 40 classifies as Warning", () => {
    expect(classifyStatus(40)).toBe("Warning");
  });

  test("HE-12: Score of exactly 69 classifies as Warning", () => {
    expect(classifyStatus(69)).toBe("Warning");
  });

  test("HE-13: Score of exactly 70 classifies as Critical", () => {
    expect(classifyStatus(70)).toBe("Critical");
  });
});
