# Day 2 Requirements — PetroOps AI

## Product Summary

PetroOps AI is an industrial operations intelligence MVP for Houston-based energy companies.

It connects simulated OT-style sensor data, asset health monitoring, SAP-style maintenance work orders, and commercial operations impact into one workflow.

## Core Problem

Energy companies collect operational sensor data from assets such as pumps, compressors, valves, turbines, and pipelines. However, this data is often disconnected from maintenance planning and commercial decision-making.

PetroOps AI helps teams detect risk earlier, recommend maintenance actions, and estimate the business impact of equipment issues before failures cause downtime.

## Primary MVP User

The first MVP should focus on the Reliability Engineer.

The Reliability Engineer wants to:
- Monitor asset health
- Identify risky equipment
- Understand why an asset is risky
- Trigger or recommend maintenance action
- Communicate operational risk to maintenance and business teams

## Supporting Users

- Maintenance Planner
- Operations Manager
- Field Technician
- Commercial Operations Analyst
- Executive Stakeholder

## MVP Workflow

1. Simulated sensor readings are generated for industrial assets.
2. The system calculates asset health and risk status on demand from the latest sensor readings.
3. Risky assets are flagged as Healthy, Warning, or Critical.
4. Warning assets produce an advisory recommendation and risk reasons only — no work order.
   Critical assets generate a recommended maintenance work order.
5. The system estimates downtime, lost production, revenue impact, and maintenance cost.
6. The dashboard displays asset risk, work orders, and commercial impact.

## Core User Stories

### Reliability Engineer

As a Reliability Engineer,
I want to view the health status of industrial assets,
so that I can identify equipment at risk before failure.

### Maintenance Planner

As a Maintenance Planner,
I want critical assets to produce recommended work orders,
so that maintenance can be planned before downtime occurs.

### Operations Manager

As an Operations Manager,
I want to see estimated downtime and production impact,
so that I can prioritize operational decisions.

### Commercial Operations Analyst

As a Commercial Operations Analyst,
I want to estimate revenue impact from asset risk,
so that business stakeholders understand the cost of operational issues.

### Field Technician

As a Field Technician,
I want to see assigned work orders and recommended actions,
so that I know what equipment needs attention.

## MVP Scope

The MVP will include:
- Simulated OT-style sensor data
- Asset health scoring
- Risk categories: Healthy, Warning, Critical
- SAP-style maintenance work orders
- A static Technician mock list for work order assignment
- A configurable ProductionAssumption used by the commercial impact module
- Commercial impact estimates
- Basic dashboard/API workflow

## Out of Scope for MVP

The MVP will not include:
- Real industrial sensor integrations
- Real SAP integration
- Real-time streaming infrastructure
- Real authentication/authorization
- Production AI/ML model training
- Mobile app
- Multi-tenant enterprise deployment

## Engineering Constraints

- Use mock data first.
- Keep logic explainable.
- Do not use real secrets.
- Do not implement features without tests.
- Avoid unnecessary libraries.
- Keep changes small and reviewable.
- Use in-memory mock data for the first implementation. No database, Prisma, SQLite, or
  Postgres yet. A future migration to Postgres should happen behind a repository interface.