import { describe, test, expect } from "vitest";
import { evaluateWorkOrder } from "../src/workOrderEngine";
import { mockTechnicians } from "../../../mock-data/src/technicians";

const criticalAssessment = {
  assessmentId: "assessment-1",
  assetId: "asset-1",
  timestamp: "2026-06-30T00:00:00Z",
  riskScore: 75,
  status: "Critical" as const,
  reasons: ["High vibration", "Elevated temperature"],
};

const warningAssessment = {
  assessmentId: "assessment-2",
  assetId: "asset-2",
  timestamp: "2026-06-30T00:00:00Z",
  riskScore: 51,
  status: "Warning" as const,
  reasons: ["High vibration", "Abnormal pressure"],
};

const healthyAssessment = {
  assessmentId: "assessment-3",
  assetId: "asset-1",
  timestamp: "2026-06-30T00:00:00Z",
  riskScore: 0,
  status: "Healthy" as const,
  reasons: [],
};

describe("Work Order Engine", () => {
  test("WO-1: Critical asset creates work order recommendation", () => {
    const result = evaluateWorkOrder(criticalAssessment);
    expect(result.workOrder).not.toBeNull();
  });

  test("WO-2: Warning asset does not create work order", () => {
    const result = evaluateWorkOrder(warningAssessment);
    expect(result.workOrder).toBeNull();
  });

  test("WO-3: Healthy asset does not create work order", () => {
    const result = evaluateWorkOrder(healthyAssessment);
    expect(result.workOrder).toBeNull();
    expect(result.advisory).toBeNull();
  });

  test("WO-4: Critical work order includes required fields", () => {
    const result = evaluateWorkOrder(criticalAssessment);
    expect(result.workOrder).toMatchObject({
      workOrderId: expect.any(String),
      assetId: expect.any(String),
      assessmentId: expect.any(String),
      priority: expect.any(String),
      issueDescription: expect.any(String),
      recommendedAction: expect.any(String),
      assignedTechnicianId: expect.any(String),
      status: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  test("WO-5: Emergency priority for severe critical risk", () => {
    const result = evaluateWorkOrder({ ...criticalAssessment, riskScore: 95 });
    expect(result.workOrder?.priority).toBe("Emergency");
  });

  test("WO-6: High priority for normal critical risk", () => {
    const result = evaluateWorkOrder({ ...criticalAssessment, riskScore: 80 });
    expect(result.workOrder?.priority).toBe("High");
  });

  test("WO-7: Warning asset produces an advisory recommendation", () => {
    const result = evaluateWorkOrder(warningAssessment);
    expect(result.advisory).not.toBeNull();
    expect(result.advisory?.reasons).toEqual(warningAssessment.reasons);
    expect(result.workOrder).toBeNull();
  });

  test("WO-8: Assigned technician resolves to a valid mock technician", () => {
    const result = evaluateWorkOrder(criticalAssessment);
    const technicianIds = mockTechnicians.map((t) => t.technicianId);
    expect(technicianIds).toContain(result.workOrder?.assignedTechnicianId);
  });
});
