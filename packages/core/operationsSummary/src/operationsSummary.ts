import { calculateHealthAssessment } from "../../healthEngine/src/healthEngine";
import { evaluateWorkOrder } from "../../workOrderEngine/src/workOrderEngine";
import { calculateCommercialImpact } from "../../commercialImpactEngine/src/commercialImpactEngine";

type Asset = {
  assetId: string;
  name: string;
  type: string;
  location: string;
  criticality: string;
  expectedFlowRate: number;
};

type SensorReading = {
  readingId: string;
  assetId: string;
  timestamp: string;
  temperature: number;
  pressure: number;
  vibration: number;
  flowRate: number;
  runtimeHours: number;
};

type ProductionAssumption = {
  productionRatePerHour: number;
  revenuePerUnit: number;
  baseMaintenanceCost: number;
  downtimeMultiplier: number;
};

export function getAssetOperationSummary(
  asset: Asset,
  reading: SensorReading,
  assumptions: ProductionAssumption,
) {
  const { riskScore, status, reasons } = calculateHealthAssessment(asset, reading);

  const healthAssessment = {
    assessmentId: `assessment-${reading.readingId}`,
    assetId: asset.assetId,
    timestamp: reading.timestamp,
    riskScore,
    status,
    reasons,
  };

  const workOrderEvaluation = evaluateWorkOrder(healthAssessment);

  const commercialImpact = calculateCommercialImpact(
    healthAssessment,
    assumptions,
    workOrderEvaluation.workOrder?.workOrderId ?? null,
  );

  return {
    asset,
    latestReading: reading,
    healthAssessment,
    workOrderEvaluation,
    commercialImpact,
  };
}
