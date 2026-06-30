# Acceptance Criteria — PetroOps AI

## Sensor Data

### AC-1: Sensor readings belong to assets

Given an asset exists,
when a sensor reading is created,
then the reading must include the assetId.

### AC-2: Sensor readings include industrial measurements

Given a sensor reading exists,
then it must include timestamp, temperature, pressure, vibration, flowRate, and runtimeHours.

## Asset Health

### AC-3: Health assessment produces a risk score

Given sensor readings exist for an asset,
when the health engine evaluates the asset,
then it must return a numeric risk score.

### AC-4: Risk score maps to status

Given a risk score is calculated,
then the system must classify the asset as Healthy, Warning, or Critical.

Confirmed thresholds:
- Healthy: 0–39
- Warning: 40–69
- Critical: 70–100

The risk score is a deterministic, rule-based sum of sensor weights:
- vibration: up to 30 points
- temperature: up to 20 points
- pressure: up to 20 points
- flowRate deviation: up to 15 points
- runtimeHours: up to 15 points

Sensor scoring thresholds:
- vibration: <=3.0 mm/s = 0 pts, >3.0–6.0 mm/s = 15 pts, >6.0 mm/s = 30 pts
- temperature: <=180°F = 0 pts, >180–210°F = 10 pts, >210°F = 20 pts
- pressure: 80–120 psi = 0 pts, 60–79 or 121–140 psi = 10 pts, <60 or >140 psi = 20 pts
- flowRate deviation (vs. asset expectedFlowRate): <=10% = 0 pts, >10–25% = 8 pts, >25% = 15 pts
- runtimeHours: <=4000 hrs = 0 pts, >4000–8000 hrs = 8 pts, >8000 hrs = 15 pts

Explicit classification boundary rule:
- score 39 → Healthy
- score 40 → Warning
- score 69 → Warning
- score 70 → Critical

### AC-5: Health assessment explains risk

Given an asset is Warning or Critical,
then the system must provide reasons for the risk status.

Example reasons:
- High vibration
- Abnormal pressure
- Elevated temperature
- Excessive runtime hours

## Work Orders

### AC-6: Critical asset creates work order recommendation

Given an asset is classified as Critical,
when the work order module evaluates the health assessment,
then it must create a work order recommendation linked to the triggering health assessment.

### AC-6a: Warning asset produces an advisory only

Given an asset is classified as Warning,
when the work order module evaluates the health assessment,
then it must produce an advisory recommendation and risk reasons, and must not create a work order.

### AC-6b: Healthy asset produces no work order or advisory

Given an asset is classified as Healthy,
when the work order module evaluates the health assessment,
then it must not create a work order or an advisory recommendation.

### AC-6c: Critical work order priority mapping

Given a work order is created for a Critical asset,
then priority must be High when the risk score is 70–89, and Emergency when the risk score is 90–100.

### AC-7: Work order includes required fields

Given a work order is created,
then it must include assetId, assessmentId, priority, issueDescription, recommendedAction, assignedTechnicianId, and status.

### AC-7a: Assigned technician comes from the mock technician list

Given a work order is created,
then assignedTechnicianId must reference a technician from the static Technician mock list.

## Commercial Impact

### AC-8: Commercial impact is calculated for every health assessment

Given any asset has a health assessment (Healthy, Warning, or Critical),
when commercial impact is calculated,
then the system must estimate downtime, lost production, revenue impact, and maintenance cost.

### AC-8a: Healthy asset has exactly zero commercial impact

Given an asset is classified as Healthy,
when commercial impact is calculated,
then estimatedDowntimeHours, lostProductionEstimate, revenueImpactEstimate, and maintenanceCostEstimate must all equal 0.

### AC-8b: Warning asset receives an advisory impact estimate with no work order link

Given an asset is classified as Warning,
when commercial impact is calculated,
then an advisory impact estimate must be generated, and workOrderId must not be present.

### AC-9: Commercial impact must be explainable

Given commercial impact is calculated,
then the output must be based on visible assumptions.

Example assumptions:
- Estimated downtime hours
- Production rate
- Revenue per production unit
- Maintenance cost estimate

### AC-9a: Commercial impact includes the production assumptions used

Given commercial impact is calculated,
then the output must include a visibleAssumptions object with the ProductionAssumption values used in the calculation:
productionRatePerHour, revenuePerUnit, baseMaintenanceCost, and downtimeMultiplier.

### AC-9b: Commercial impact is traceable to its source

Given commercial impact is calculated,
then it must include assessmentId, and workOrderId only when a work order exists (Critical case).

### AC-9c: Commercial impact formulas are deterministic

Given commercial impact is calculated, then:
- estimatedDowntimeHours = 0 (Healthy), 2 * downtimeMultiplier (Warning), 8 * downtimeMultiplier (Critical 70–89), or 16 * downtimeMultiplier (Critical 90–100)
- lostProductionEstimate = estimatedDowntimeHours * productionRatePerHour
- revenueImpactEstimate = lostProductionEstimate * revenuePerUnit
- maintenanceCostEstimate = 0 (Healthy), baseMaintenanceCost (Warning), baseMaintenanceCost * 2 (Critical 70–89), or baseMaintenanceCost * 3 (Critical 90–100)

## AI-Assisted Development Rules

### AC-10: No feature implementation without test plan

Given a feature is selected for implementation,
then tests or test cases must be defined before implementation begins.

### AC-11: AI must not change architecture without approval

Given the AI proposes architecture changes,
then it must explain the reason and wait for approval before editing files.

### AC-12: Secrets must not be committed

Given environment variables are needed,
then only .env.example should be committed.