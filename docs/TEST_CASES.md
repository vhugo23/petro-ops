# Test Cases — PetroOps AI

## Health Engine Test Cases

### HE-1: Healthy asset receives Healthy status

Given a sensor reading with vibration <= 3.0 mm/s, temperature <= 180°F, pressure between 80–120 psi, flowRate deviation <= 10% of expectedFlowRate, and runtimeHours <= 4000,
when the health engine calculates risk,
then the risk score should be 0,
and the status should be Healthy.

### HE-2: Warning asset receives Warning status

Given a sensor reading with vibration > 3.0 and <= 6.0 mm/s and temperature > 180°F and <= 210°F (other sensors normal),
when the health engine calculates risk,
then the risk score should be 25 (15 + 10),
and the status should be Warning.

### HE-3: Critical asset receives Critical status

Given a sensor reading with vibration > 6.0 mm/s, temperature > 210°F, and pressure < 60 psi (other sensors normal),
when the health engine calculates risk,
then the risk score should be 70 (30 + 20 + 20),
and the status should be Critical.

### HE-4: High vibration adds risk reason

Given vibration > 3.0 mm/s,
when the health engine evaluates the reading,
then the reasons should include High vibration.

### HE-5: Elevated temperature adds risk reason

Given temperature > 180°F,
when the health engine evaluates the reading,
then the reasons should include Elevated temperature.

### HE-6: Abnormal pressure adds risk reason

Given pressure is outside 80–120 psi,
when the health engine evaluates the reading,
then the reasons should include Abnormal pressure.

### HE-7: Excessive runtime adds risk reason

Given runtimeHours > 4000,
when the health engine evaluates the reading,
then the reasons should include Excessive runtime hours.

### HE-8: Risk score cannot exceed 100

Given multiple severe sensor abnormalities (all sensors in their highest point band),
when risk is calculated,
then the risk score should not exceed 100.

### HE-9: Risk score cannot be below 0

Given all sensor values are normal,
when risk is calculated,
then the risk score should not be below 0.

Note: 39 and 69 are not reachable through any combination of the sensor point bands above,
so HE-10–HE-13 test the classification boundary rule directly via `classifyStatus(score)`
rather than through sensor-derived scores.

### HE-10: Score of exactly 39 classifies as Healthy

Given a risk score of exactly 39,
when classifyStatus is called with that score,
then the status should be Healthy.

### HE-11: Score of exactly 40 classifies as Warning

Given a risk score of exactly 40,
when classifyStatus is called with that score,
then the status should be Warning.

### HE-12: Score of exactly 69 classifies as Warning

Given a risk score of exactly 69,
when classifyStatus is called with that score,
then the status should be Warning.

### HE-13: Score of exactly 70 classifies as Critical

Given a risk score of exactly 70,
when classifyStatus is called with that score,
then the status should be Critical.

---

## Work Order Test Cases

### WO-1: Critical asset creates work order recommendation

Given a health assessment with Critical status,
when the work order engine evaluates the assessment,
then it should create a work order recommendation.

### WO-2: Warning asset does not create work order

Given a health assessment with Warning status,
when the work order engine evaluates the assessment,
then it should not create a work order recommendation.

### WO-3: Healthy asset does not create work order

Given a health assessment with Healthy status,
when the work order engine evaluates the assessment,
then it should not create a work order recommendation.

### WO-4: Critical work order includes required fields

Given a Critical asset creates a work order,
then the work order should include:
- workOrderId
- assetId
- assessmentId
- priority
- issueDescription
- recommendedAction
- assignedTechnicianId
- status
- createdAt

### WO-5: Emergency priority for severe critical risk

Given a health assessment has a risk score of 90 or higher,
when a work order is created,
then the priority should be Emergency.

### WO-6: High priority for normal critical risk

Given a health assessment has a risk score from 70 to 89,
when a work order is created,
then the priority should be High.

### WO-7: Warning asset produces an advisory recommendation

Given a health assessment with Warning status,
when the work order engine evaluates the assessment,
then it should produce an advisory recommendation that includes risk reasons, without creating a work order.

### WO-8: Assigned technician resolves to a valid mock technician

Given a Critical asset creates a work order,
then assignedTechnicianId should match a technicianId present in the static Technician mock list.

---

## Commercial Impact Test Cases

### CI-1: Critical asset receives commercial impact estimate

Given a Critical health assessment,
when commercial impact is calculated,
then the output should include estimated downtime, lost production, revenue impact, and maintenance cost.

### CI-2: Warning asset receives an advisory impact estimate

Given a Warning health assessment with a given downtimeMultiplier,
when commercial impact is calculated,
then estimatedDowntimeHours should equal 2 * downtimeMultiplier, maintenanceCostEstimate should equal baseMaintenanceCost, and workOrderId should not be present.

### CI-3: Healthy asset has exactly zero commercial impact

Given a Healthy health assessment,
when commercial impact is calculated,
then estimatedDowntimeHours, lostProductionEstimate, revenueImpactEstimate, and maintenanceCostEstimate should all equal 0.

### CI-4: Revenue impact uses visible assumptions

Given production assumptions exist,
when revenue impact is calculated,
then the result should be based on:
- productionRatePerHour
- revenuePerUnit
- estimatedDowntimeHours

### CI-5: Maintenance cost uses base maintenance cost

Given production assumptions include baseMaintenanceCost,
when commercial impact is calculated,
then maintenanceCostEstimate should use that assumption according to the status-based formula (Healthy: 0, Warning: baseMaintenanceCost, Critical 70–89: baseMaintenanceCost * 2, Critical 90–100: baseMaintenanceCost * 3).

### CI-6: Commercial impact links to assessment

Given commercial impact is calculated from a health assessment,
then the result should include assessmentId.

### CI-7: Downtime multiplier is applied to estimated downtime

Given a downtimeMultiplier value in the production assumptions,
when estimatedDowntimeHours is calculated for a Warning or Critical asset,
then the result should scale proportionally with downtimeMultiplier.

### CI-8: workOrderId appears on commercial impact when a work order exists

Given a Critical asset has an associated work order,
when commercial impact is calculated,
then the result should include the matching workOrderId.

### CI-9: workOrderId is absent when no work order exists

Given a Warning or Healthy health assessment (no work order created),
when commercial impact is calculated,
then the result should not include a workOrderId.

---

## Mock Data Test Cases

### MD-1: Mock assets include required fields

Given mock assets exist,
then each asset should include:
- assetId
- name
- type
- location
- criticality
- status
- expectedFlowRate

### MD-2: Mock technicians include required fields

Given mock technicians exist,
then each technician should include:
- technicianId
- name
- specialty
- availability

availability should be one of: Available, Assigned, Off Duty.

### MD-3: Mock sensor readings belong to valid assets

Given mock sensor readings exist,
then every sensor reading should reference an existing assetId.

### MD-4: Mock production assumptions include required fields

Given a mock ProductionAssumption config exists,
then it should include:
- productionRatePerHour
- revenuePerUnit
- baseMaintenanceCost
- downtimeMultiplier

---

## Process Test Cases

### PR-1: No implementation without tests

Given a feature is selected,
then test cases should exist before source code is written.

### PR-2: No secrets committed

Given environment variables are needed,
then only .env.example should be committed.

### PR-3: AI edits must stay reviewable

Given the AI edits files,
then changes should be small, explainable, and reviewed before commit.
