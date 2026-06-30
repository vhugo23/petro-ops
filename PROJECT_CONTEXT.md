# PetroOps - Project Context

## Product Vision

PetroOps is an industrial operations intelligence platform for Houston-based energy companies.

The MVP connects:
1. OT-style sensor data
2. AI asset health monitoring
3. SAP-style maintence work orders
4. Commercial operations impact tracking

The goal is to help energy teams detect asset risk earlier, generate maintence actions, and understand the business imapct of operational issues.

## Target Users

- Realibility
- Maintenance Planner
- Operations Manager
- Asset Manager
- Commercial Operations Analyst
- Field Technician
- Executive Stakeholder

## Core MVP Modules

### 1. Sensor Data Module
Ingests simulated OT-style data from industrial assets such as pumps, compressors, valves, and turbines.

Example data:
- Asset ID
- Timestamp
- Temperature
- Pressure
- Vibration
- Flow rate
- Runtime hours
- Status

### 2. Asset Health Module
Calculates risk scores for assets based on sensor readings.

Example outputs:
- Healthy
- Warning
- Critical
- Failure risk score

### 3. Work Order Module
Creates SAP-style maintence work orders when asset risk passes a threshold.

Example fields:
- Work order ID
- Asset ID
- Priority
- Issue description
- Recommended action
- Assigned technician
- Status

### 4. Commercial Operations Module
Estimates the business impact of downtime or reduced performance.

Example fields:
- Estimated downtime
- Lost production estimate
- Revenue impact estimate
- Maintence cost estimate

## Engineering Principles

- Do not implement features before tests
- Do not add unnecessary complexity
- Keep the MVP samll but realistic.
- Prefer clear code over clever code
- All mock data must live in a dedicated mock/data area
- No real secrets should be committed
- Every major decision should be documented

## AI Agent Rules

The AI agent must:
- Read this file before making changes
- Explain its plan before editing files
- Write tests before feature implementation
- Avoid adding new libraries without justifivation
- Avoid changing architecture without approval
- Keep changes small and reviewable
- Never commit secrets
- Never create production code without matching tests

## Current Challenge Phase

Day 2: Requirements, domain model, system boundaries, and acceptance criteria.

No product features should be implemented today.

The goal is to define what PetroOps AI should do before writing implementation code.

