# System Boundaries — PetroOps AI

## System Purpose

PetroOps AI connects simulated industrial asset data to maintenance and commercial operations workflows.

The system should answer:

1. What assets are at risk?
2. Why are they at risk?
3. What maintenance action should happen?
4. What is the estimated business impact?

## Main System Components

### 1. Mock Sensor Data Module

Responsible for producing simulated OT-style readings.

It should not connect to real industrial systems in the MVP.

### 2. Asset Health Engine

Responsible for calculating risk score and asset status.

Scoring is deterministic and rule-based for the MVP — no machine learning model training.

Risk score range: 0–100.

Risk thresholds:
- Healthy: 0–39
- Warning: 40–69
- Critical: 70–100

Sensor risk weights (sum to 100):
- vibration: up to 30 points
- temperature: up to 20 points
- pressure: up to 20 points
- flowRate deviation: up to 15 points
- runtimeHours: up to 15 points

Sensor scoring thresholds (deterministic point bands):

vibration (max 30 points):
- <= 3.0 mm/s: 0 points
- > 3.0 and <= 6.0 mm/s: 15 points
- > 6.0 mm/s: 30 points

temperature (max 20 points):
- <= 180°F: 0 points
- > 180°F and <= 210°F: 10 points
- > 210°F: 20 points

pressure (max 20 points):
- 80–120 psi: 0 points
- 60–79 psi or 121–140 psi: 10 points
- < 60 psi or > 140 psi: 20 points

flowRate deviation (max 15 points), measured against the asset's expectedFlowRate:
- <= 10% deviation: 0 points
- > 10% and <= 25% deviation: 8 points
- > 25% deviation: 15 points

runtimeHours (max 15 points):
- <= 4000 hours: 0 points
- > 4000 and <= 8000 hours: 8 points
- > 8000 hours: 15 points

Classification boundary rule (applied to the summed score):
- 39 → Healthy
- 40 → Warning
- 69 → Warning
- 70 → Critical

Trigger model: health assessments are calculated on demand from the latest sensor readings
for an asset, not on a schedule or stream. Each assessment output must include enough fields
to be traceable (assessmentId, timestamp, contributing factors/reasons).

Inputs:
- Asset information
- Sensor readings

Outputs:
- Risk score
- Healthy, Warning, or Critical status
- Explanation/reasons

### 3. Work Order Module

Responsible for creating SAP-style maintenance recommendations.

Behavior depends on health status:
- Critical assets: the module creates a work order recommendation, linked to the triggering
  health assessment via assessmentId.
- Warning assets: the module produces an advisory recommendation and risk reasons only — no
  work order is created.
- Healthy assets: no work order and no advisory.

Priority mapping for Critical work orders:
- Critical score 70–89: High priority
- Critical score 90–100: Emergency priority

Technician assignment: assignedTechnicianId must resolve to a valid entry in the static
Technician mock list.

Inputs:
- Asset
- Health assessment

Outputs:
- Work order recommendation (Critical only) or advisory recommendation (Warning only)
- Priority
- Issue description
- Recommended action

### 4. Commercial Impact Module

Responsible for estimating business impact.

Commercial impact is calculated on demand for every health assessment, not just Critical
ones:
- Healthy: estimatedDowntimeHours, lostProductionEstimate, revenueImpactEstimate, and
  maintenanceCostEstimate are all exactly 0.
- Warning: an advisory impact estimate is generated. No workOrderId is attached (no work
  order exists for Warning).
- Critical: a full impact estimate is generated, including workOrderId when a work order
  exists.

Formulas:

estimatedDowntimeHours:
- Healthy: 0
- Warning: 2 * downtimeMultiplier
- Critical 70–89: 8 * downtimeMultiplier
- Critical 90–100: 16 * downtimeMultiplier

lostProductionEstimate = estimatedDowntimeHours * productionRatePerHour

revenueImpactEstimate = lostProductionEstimate * revenuePerUnit

maintenanceCostEstimate:
- Healthy: 0
- Warning: baseMaintenanceCost
- Critical 70–89: baseMaintenanceCost * 2
- Critical 90–100: baseMaintenanceCost * 3

Inputs:
- Asset
- Risk level
- Estimated downtime
- ProductionAssumption config (productionRatePerHour, revenuePerUnit, baseMaintenanceCost,
  downtimeMultiplier)

Outputs:
- Lost production estimate
- Revenue impact estimate
- Maintenance cost estimate
- assessmentId (the triggering health assessment)
- workOrderId (optional, present only when a work order exists)
- visibleAssumptions (the ProductionAssumption values used in the calculation)

### 5. API Layer

Responsible for exposing system data to the frontend.

Potential endpoints:
- GET /assets
- GET /assets/:id
- GET /assets/:id/health
- GET /work-orders
- GET /commercial-impact

### 6. Dashboard

Responsible for displaying asset health, work orders, and commercial impact.

A basic web dashboard is the eventual MVP goal, but it is not built during Day 3. Day 3 is
scoped to test planning and test cases only.

## Persistence

In-memory mock data is used for the first implementation. No database, Prisma, SQLite, or
Postgres is introduced yet.

Later, the application can move to Postgres behind a repository interface, without changing
the modules that depend on it.

## MVP Data Flow

```text
Mock Sensor Data
      ↓
Asset Health Engine
      ↓
Health Assessment
      ↓
Work Order Module
      ↓
Commercial Impact Module
      ↓
API
      ↓
Dashboard