# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### US College Transfer Eligibility Checker (`artifacts/transfer-checker`)

- **Type**: React + Vite (frontend-only, no backend)
- **Preview path**: `/`
- **Stack**: React, TypeScript, Tailwind CSS, shadcn/ui, wouter, react-hook-form, zod
- **Key files**:
  - `src/data/gt-majors.json` — Georgia Tech (~35 majors, all colleges)
  - `src/data/uiuc-majors.json` — UIUC Grainger Engineering (20 majors)
  - `src/data/purdue-majors.json` — Purdue College of Engineering (13 majors)
  - `src/data/utaustin-majors.json` — UT Austin Cockrell School (12 majors)
  - `src/data/uwmadison-majors.json` — UW-Madison College of Engineering (13 majors)
  - `src/types/index.ts` — TypeScript interfaces for all universities + `EnglishRequirement` (incl. `duolingoAccepted`, `singleCompWaiver`)
  - `src/lib/eligibility.ts` — eligibility evaluation logic (credits, English test, courses, composition waivers)
  - `src/pages/Home.tsx` — main page; builds University objects per selected major, runs evaluateAll()
  - `src/components/TransferForm.tsx` — 5-school major dropdowns + course statuses + English proficiency form
  - `src/components/ResultsPanel.tsx` — results list wrapper
  - `src/components/ResultCard.tsx` — per-university result card with status badge
- **Universities supported**: Georgia Tech, UIUC, Purdue, UT Austin, UW-Madison
- **Course IDs**: calc1-3, diffEq, linAlg, discreteStructures, physics1-2, chem1-2, orgChem, bio1-2, molecularBio, compSci1-2, computing, ece110, ece120, statics, engrGraphics, engrDesign, labSciElective, advancedScience, englishComp
- **English logic**: TOEFL (new/legacy), IELTS, Duolingo; `duolingoAccepted:false` (UT Austin); `singleCompWaiver` (UW-Madison); `compositionWaiver` (GT)
- **Features**:
  - Evaluates eligibility as: Eligible / Conditionally Eligible / Not Eligible
  - Shows missing requirements and conditional reasons per university
  - Expandable result cards with course-by-course breakdown
  - No database — all data is static JSON
