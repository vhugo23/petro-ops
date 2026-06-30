type Status = "Healthy" | "Warning" | "Critical";

type HealthAssessment = {
  assessmentId: string;
  assetId: string;
  riskScore: number;
  status: Status;
};

type ProductionAssumption = {
  productionRatePerHour: number;
  revenuePerUnit: number;
  baseMaintenanceCost: number;
  downtimeMultiplier: number;
};

type CommercialImpact = {
  assessmentId: string;
  assetId: string;
  workOrderId?: string;
  estimatedDowntimeHours: number;
  lostProductionEstimate: number;
  revenueImpactEstimate: number;
  maintenanceCostEstimate: number;
  visibleAssumptions: ProductionAssumption;
};

function estimateDowntime(status: Status, riskScore: number, multiplier: number): number {
  if (status === "Healthy") return 0;
  if (status === "Warning") return 2 * multiplier;
  if (riskScore >= 90) return 16 * multiplier;
  return 8 * multiplier;
}

function estimateMaintenanceCost(status: Status, riskScore: number, baseCost: number): number {
  if (status === "Healthy") return 0;
  if (status === "Warning") return baseCost;
  if (riskScore >= 90) return baseCost * 3;
  return baseCost * 2;
}

export function calculateCommercialImpact(
  assessment: HealthAssessment,
  assumptions: ProductionAssumption,
  workOrderId?: string | null,
): CommercialImpact {
  const estimatedDowntimeHours = estimateDowntime(
    assessment.status,
    assessment.riskScore,
    assumptions.downtimeMultiplier,
  );
  const lostProductionEstimate = estimatedDowntimeHours * assumptions.productionRatePerHour;
  const revenueImpactEstimate = lostProductionEstimate * assumptions.revenuePerUnit;
  const maintenanceCostEstimate = estimateMaintenanceCost(
    assessment.status,
    assessment.riskScore,
    assumptions.baseMaintenanceCost,
  );

  return {
    assessmentId: assessment.assessmentId,
    assetId: assessment.assetId,
    ...(workOrderId != null ? { workOrderId } : {}),
    estimatedDowntimeHours,
    lostProductionEstimate,
    revenueImpactEstimate,
    maintenanceCostEstimate,
    visibleAssumptions: assumptions,
  };
}
