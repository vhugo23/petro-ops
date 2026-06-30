import { mockTechnicians } from "../../../mock-data/src/technicians";

type Status = "Healthy" | "Warning" | "Critical";

type HealthAssessment = {
  assessmentId: string;
  assetId: string;
  timestamp: string;
  riskScore: number;
  status: Status;
  reasons: string[];
};

type WorkOrder = {
  workOrderId: string;
  assetId: string;
  assessmentId: string;
  priority: "High" | "Emergency";
  issueDescription: string;
  recommendedAction: string;
  assignedTechnicianId: string;
  status: "Open";
  createdAt: string;
};

type Advisory = {
  assetId: string;
  assessmentId: string;
  reasons: string[];
};

type WorkOrderEvaluation = {
  workOrder: WorkOrder | null;
  advisory: Advisory | null;
};

function mapPriority(riskScore: number): "High" | "Emergency" {
  if (riskScore >= 90) return "Emergency";
  return "High";
}

function resolveTechnician(): string {
  const available = mockTechnicians.find((t) => t.availability === "Available");
  return (available ?? mockTechnicians[0]).technicianId;
}

export function evaluateWorkOrder(assessment: HealthAssessment): WorkOrderEvaluation {
  if (assessment.status === "Critical") {
    return {
      workOrder: {
        workOrderId: `wo-${assessment.assessmentId}`,
        assetId: assessment.assetId,
        assessmentId: assessment.assessmentId,
        priority: mapPriority(assessment.riskScore),
        issueDescription: `Risk factors: ${assessment.reasons.join(", ")}`,
        recommendedAction: "Schedule maintenance inspection",
        assignedTechnicianId: resolveTechnician(),
        status: "Open",
        createdAt: assessment.timestamp,
      },
      advisory: null,
    };
  }

  if (assessment.status === "Warning") {
    return {
      workOrder: null,
      advisory: {
        assetId: assessment.assetId,
        assessmentId: assessment.assessmentId,
        reasons: assessment.reasons,
      },
    };
  }

  return { workOrder: null, advisory: null };
}
