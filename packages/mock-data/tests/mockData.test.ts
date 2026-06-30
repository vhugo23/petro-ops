import { describe, test, expect } from "vitest";
import { mockAssets } from "../src/assets";
import { mockTechnicians } from "../src/technicians";
import { mockSensorReadings } from "../src/sensorReadings";
import { mockProductionAssumptions } from "../src/productionAssumptions";

describe("Mock Data", () => {
  test("MD-1: mock assets include required fields", () => {
    expect(mockAssets.length).toBeGreaterThan(0);
    for (const asset of mockAssets) {
      expect(typeof asset.assetId).toBe("string");
      expect(typeof asset.name).toBe("string");
      expect(typeof asset.type).toBe("string");
      expect(typeof asset.location).toBe("string");
      expect(typeof asset.criticality).toBe("string");
      expect(asset).not.toHaveProperty("status");
      expect(typeof asset.expectedFlowRate).toBe("number");
    }
  });

  test("MD-2: mock technicians include required fields", () => {
    expect(mockTechnicians.length).toBeGreaterThan(0);
    for (const technician of mockTechnicians) {
      expect(typeof technician.technicianId).toBe("string");
      expect(typeof technician.name).toBe("string");
      expect(typeof technician.specialty).toBe("string");
      expect(["Available", "Assigned", "Off Duty"]).toContain(technician.availability);
    }
  });

  test("MD-3: mock sensor readings belong to valid assets", () => {
    expect(mockSensorReadings.length).toBeGreaterThan(0);
    const assetIds = mockAssets.map((asset) => asset.assetId);
    for (const reading of mockSensorReadings) {
      expect(assetIds).toContain(reading.assetId);
    }
  });

  test("MD-4: mock production assumptions include required fields", () => {
    expect(typeof mockProductionAssumptions.productionRatePerHour).toBe("number");
    expect(typeof mockProductionAssumptions.revenuePerUnit).toBe("number");
    expect(typeof mockProductionAssumptions.baseMaintenanceCost).toBe("number");
    expect(typeof mockProductionAssumptions.downtimeMultiplier).toBe("number");
  });
});
