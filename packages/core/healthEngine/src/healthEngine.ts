type Status = "Healthy" | "Warning" | "Critical";

type Asset = {
  expectedFlowRate: number;
};

type SensorReading = {
  temperature: number;
  pressure: number;
  vibration: number;
  flowRate: number;
  runtimeHours: number;
};

function scoreVibration(vibration: number): number {
  if (vibration > 6.0) return 30;
  if (vibration > 3.0) return 15;
  return 0;
}

function scoreTemperature(temperature: number): number {
  if (temperature > 210) return 20;
  if (temperature > 180) return 10;
  return 0;
}

function scorePressure(pressure: number): number {
  if (pressure < 60 || pressure > 140) return 20;
  if (pressure < 80 || pressure > 120) return 10;
  return 0;
}

function scoreFlowRateDeviation(flowRate: number, expectedFlowRate: number): number {
  const deviationPercent = (Math.abs(flowRate - expectedFlowRate) / expectedFlowRate) * 100;
  if (deviationPercent > 25) return 15;
  if (deviationPercent > 10) return 8;
  return 0;
}

function scoreRuntimeHours(runtimeHours: number): number {
  if (runtimeHours > 8000) return 15;
  if (runtimeHours > 4000) return 8;
  return 0;
}

export function classifyStatus(score: number): Status {
  if (score >= 70) return "Critical";
  if (score >= 40) return "Warning";
  return "Healthy";
}

export function calculateHealthAssessment(asset: Asset, reading: SensorReading) {
  const vibrationPoints = scoreVibration(reading.vibration);
  const temperaturePoints = scoreTemperature(reading.temperature);
  const pressurePoints = scorePressure(reading.pressure);
  const flowRatePoints = scoreFlowRateDeviation(reading.flowRate, asset.expectedFlowRate);
  const runtimePoints = scoreRuntimeHours(reading.runtimeHours);

  const rawScore =
    vibrationPoints + temperaturePoints + pressurePoints + flowRatePoints + runtimePoints;
  const riskScore = Math.min(100, Math.max(0, rawScore));

  const reasons: string[] = [];
  if (vibrationPoints > 0) reasons.push("High vibration");
  if (temperaturePoints > 0) reasons.push("Elevated temperature");
  if (pressurePoints > 0) reasons.push("Abnormal pressure");
  if (runtimePoints > 0) reasons.push("Excessive runtime hours");

  return {
    riskScore,
    status: classifyStatus(riskScore),
    reasons,
  };
}
