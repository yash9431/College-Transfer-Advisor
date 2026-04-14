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
  - `src/data/universities.json` — static university requirement data (Georgia Tech, UIUC, Purdue — Mechanical Engineering)
  - `src/types/index.ts` — TypeScript interfaces for `University`, `EnglishRequirement`, `RequiredCourse`
  - `src/lib/eligibility.ts` — eligibility evaluation logic (credits, English, courses)
  - `src/pages/Home.tsx` — main page with form and results
  - `src/components/TransferForm.tsx` — student profile input form
  - `src/components/ResultsPanel.tsx` — results list wrapper
  - `src/components/ResultCard.tsx` — per-university result card with status badge
- **Features**:
  - Collects: completed/in-progress credits, English test (TOEFL/IELTS/Duolingo), Composition 1 & 2 completion, intended major, 4 required course statuses
  - Evaluates eligibility as: Eligible / Conditionally Eligible / Not Eligible
  - Shows missing requirements and conditional reasons per university
  - Expandable result cards with course-by-course breakdown
  - No database — all data is static JSON
