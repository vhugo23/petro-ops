# Domain Model — PetroOps AI

## Core Entities

### Asset

Represents an industrial asset being monitored.

Fields:
- assetId
- name
- type
- location
- criticality
- status

Example asset types:
- Pump
- Compressor
- Valve
- Turbine
- Pipeline Segment

### SensorReading

Represents OT-style telemetry from an asset.

Fields:
- readingId
- assetId
- timestamp
- temperature
- pressure
- vibration
- flowRate
- runtimeHours

### HealthAssessment

Represents the calculated health state of an asset.

Fields:
- assessmentId
- assetId
- timestamp
- riskScore
- status
- reasons

Allowed statuses:
- Healthy
- Warning
- Critical

### WorkOrder

Represents a SAP-style maintenance work order.

Fields:
- workOrderId
- assetId
- assessmentId
- priority
- issueDescription
- recommendedAction
- assignedTechnician
- status
- createdAt

Allowed priorities:
- Low
- Medium
- High
- Emergency

Allowed statuses:
- Open
- In Progress
- Completed
- Cancelled

### CommercialImpact

Represents estimated business impact from asset risk.

Fields:
- impactId
- assetId
- assessmentId
- workOrderId (optional)
- estimatedDowntimeHours
- lostProductionEstimate
- revenueImpactEstimate
- maintenanceCostEstimate

### Technician

Represents a maintenance technician who can be assigned to a work order.

Fields:
- technicianId
- name
- specialty
- status

Allowed statuses:
- Available
- Assigned

For the MVP, technicians are a static mock list, not a managed entity.

### ProductionAssumption

Represents the configurable assumptions used to calculate commercial impact.

Fields:
- productionRatePerHour
- revenuePerUnit
- baseMaintenanceCost
- downtimeMultiplier

For the MVP, this is a config object, not a relational record.

## Entity Relationships

```text
Asset
  has many SensorReadings
  has many HealthAssessments
  may have many WorkOrders
  may have many CommercialImpact records

SensorReading
  belongs to Asset

HealthAssessment
  belongs to Asset
  may trigger WorkOrder
  may trigger CommercialImpact

WorkOrder
  belongs to Asset
  belongs to HealthAssessment (via assessmentId)
  may be assigned to Technician

CommercialImpact
  belongs to Asset
  belongs to HealthAssessment (via assessmentId)
  may be linked to WorkOrder (via workOrderId)
  calculated using ProductionAssumption

Technician
  may have many WorkOrders (assigned)

ProductionAssumption
  referenced by CommercialImpact calculations