# Day 3 Test Plan — PetroOps AI

## Purpose

Day 3 defines how PetroOps AI will be tested before implementation begins.

The MVP will start with deterministic, rule-based business logic. Tests should prove that the health engine, work order module, and commercial impact module behave correctly before API routes or dashboard screens are built.

## Testing Priorities

### Priority 1: Asset Health Engine

The health engine is the core of PetroOps AI.

It must:
- Accept sensor readings
- Calculate a risk score from 0–100
- Classify assets as Healthy, Warning, or Critical
- Explain risk reasons

This should be tested first.

### Priority 2: Work Order Recommendation

The work order module depends on health assessment output.

It must:
- Create a work order recommendation for Critical assets
- Not create a work order for Healthy assets
- Not create a work order for Warning assets in the MVP
- Include traceability through assessmentId
- Map Critical risk score to priority: 70–89 = High, 90–100 = Emergency
- Assign assignedTechnicianId from the static Technician mock list

### Priority 3: Commercial Impact Estimate

The commercial impact module depends on health assessment and production assumptions.
It runs for every health assessment, not just Critical ones.

It must:
- Return exactly zero impact (downtime, lost production, revenue impact, maintenance cost)
  for Healthy assets
- Estimate a lower-severity advisory impact for Warning assets, with no workOrderId
- Estimate full impact for Critical assets, including workOrderId when a work order exists
- Estimate downtime
- Estimate lost production
- Estimate revenue impact
- Estimate maintenance cost
- Expose assumptions used in the calculation (visibleAssumptions)

## Initial Testing Style

The first implementation should use unit tests.

Unit tests are enough because the first version uses:
- In-memory mock data
- Deterministic functions
- No database
- No external APIs
- No real SAP or SCADA integrations

Integration tests can come later when API routes and persistence are added.

## Modules That Need Tests First

Expected future modules:

```text
packages/core/healthEngine
packages/core/workOrderEngine
packages/core/commercialImpactEngine
packages/mock-data