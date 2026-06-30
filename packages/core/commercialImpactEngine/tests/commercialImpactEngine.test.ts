import { describe, test, expect } from "vitest";
import { calculateCommercialImpact } from "../src/commercialImpactEngine";
import { mockProductionAssumptions } from "../../../mock-data/src/productionAssumptions";

const criticalHighAssessment = {
  assessmentId: "assessment-1",
  assetId: "asset-1",
  riskScore: 80,
  status: "Critical" as const,
};

const criticalEmergencyAssessment = {
  assessmentId: "assessment-2",
  assetId: "asset-1",
  riskScore: 95,
  status: "Critical" as const,
};

const warningAssessment = {
  assessmentId: "assessment-3",
  assetId: "asset-2",
  riskScore: 51,
  status: "Warning" as const,
};

const healthyAssessment = {
  assessmentId: "assessment-4",
  assetId: "asset-1",
  riskScore: 0,
  status: "Healthy" as const,
};

describe("Commercial Impact Engine", () => {
  test("CI-1: Critical asset receives commercial impact estimate", () => {
    const result = calculateCommercialImpact(criticalHighAssessment, mockProductionAssumptions);
    expect(result.estimatedDowntimeHours).toBeGreaterThan(0);
    expect(result.lostProductionEstimate).toBeGreaterThan(0);
    expect(result.revenueImpactEstimate).toBeGreaterThan(0);
    expect(result.maintenanceCostEstimate).toBeGreaterThan(0);
  });

  test("CI-2: Warning asset receives an advisory impact estimate", () => {
    const result = calculateCommercialImpact(warningAssessment, mockProductionAssumptions);
    expect(result.estimatedDowntimeHours).toBe(3); // 2 * 1.5
    expect(result.maintenanceCostEstimate).toBe(2000); // baseMaintenanceCost
    expect(result).not.toHaveProperty("workOrderId");
  });

  test("CI-3: Healthy asset has exactly zero commercial impact", () => {
    const result = calculateCommercialImpact(healthyAssessment, mockProductionAssumptions);
    expect(result.estimatedDowntimeHours).toBe(0);
    expect(result.lostProductionEstimate).toBe(0);
    expect(result.revenueImpactEstimate).toBe(0);
    expect(result.maintenanceCostEstimate).toBe(0);
  });

  test("CI-4: Revenue impact uses visible assumptions", () => {
    // Critical 70–89: estimatedDowntime = 8 * 1.5 = 12
    // lostProduction = 12 * 50 = 600
    // revenueImpact = 600 * 120 = 72000
    const result = calculateCommercialImpact(criticalHighAssessment, mockProductionAssumptions);
    expect(result.revenueImpactEstimate).toBe(72000);
  });

  test("CI-5: Maintenance cost uses base maintenance cost", () => {
    const warningResult = calculateCommercialImpact(warningAssessment, mockProductionAssumptions);
    expect(warningResult.maintenanceCostEstimate).toBe(2000); // baseMaintenanceCost

    const criticalHighResult = calculateCommercialImpact(criticalHighAssessment, mockProductionAssumptions);
    expect(criticalHighResult.maintenanceCostEstimate).toBe(4000); // baseMaintenanceCost * 2

    const criticalEmergencyResult = calculateCommercialImpact(criticalEmergencyAssessment, mockProductionAssumptions);
    expect(criticalEmergencyResult.maintenanceCostEstimate).toBe(6000); // baseMaintenanceCost * 3
  });

  test("CI-6: Commercial impact links to assessment", () => {
    const result = calculateCommercialImpact(criticalHighAssessment, mockProductionAssumptions);
    expect(result.assessmentId).toBe(criticalHighAssessment.assessmentId);
  });

  test("CI-7: Downtime multiplier is applied to estimated downtime", () => {
    const assumptions15 = { ...mockProductionAssumptions, downtimeMultiplier: 1.5 };
    const assumptions20 = { ...mockProductionAssumptions, downtimeMultiplier: 2.0 };

    const result15 = calculateCommercialImpact(warningAssessment, assumptions15);
    const result20 = calculateCommercialImpact(warningAssessment, assumptions20);

    expect(result15.estimatedDowntimeHours).toBe(3);  // 2 * 1.5
    expect(result20.estimatedDowntimeHours).toBe(4);  // 2 * 2.0
  });

  test("CI-8: workOrderId appears on commercial impact when a work order exists", () => {
    const result = calculateCommercialImpact(
      criticalHighAssessment,
      mockProductionAssumptions,
      "wo-assessment-1",
    );
    expect(result.workOrderId).toBe("wo-assessment-1");
  });

  test("CI-9: workOrderId is absent when no work order exists", () => {
    const result = calculateCommercialImpact(warningAssessment, mockProductionAssumptions);
    expect(result).not.toHaveProperty("workOrderId");
  });
});
