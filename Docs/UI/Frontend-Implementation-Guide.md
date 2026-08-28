# Endpoint IQ Frontend Implementation Guide

## Tech Stack Overview
The Endpoint IQ frontend is built using a modern React stack, prioritizing performance, developer experience, and maintainable state management.

- **Framework**: React 18 with Vite for fast HMR and optimized builds.
- **Language**: TypeScript for strict type-checking and interface definitions.
- **State Management**: Zustand (`src/store/useAppStore.ts`). Global state is maintained here to keep component trees clean. Zustand handles project metadata, endpoints, test status, execution logs, and AI insights.
- **Styling**: Tailwind CSS combined with custom CSS Variables (`src/index.css`) to enforce a strict design token system. We use a Carbon Neon theme emphasizing a dark-first, data-rich aesthetic (like Postman or Grafana).
- **Routing**: React Router DOM (`src/app/router.tsx`).
- **Icons**: Lucide React for consistent, crisp SVG iconography.
- **Animations**: Framer Motion for micro-interactions (e.g., active tab indicators, list mounting animations, hover states).
- **Data Fetching (Mocked/Future)**: TanStack Query (React Query) is used in `ReportDetails.tsx` to handle server state, loading skeletons, and error boundaries, preparing the app for real backend integration.

## UI/UX Design System (Carbon Neon)

The UI avoids generic "marketing" aesthetics in favor of a dense, structured, developer-tool look.
All components *must* use the defined CSS variables instead of hardcoded hex colors to ensure the UI is fully dynamic and theme-ready (Light/Dark mode compatible).

### Core Semantic Tokens
- **Backgrounds**: `var(--canvas)` (app background), `var(--surface)` (cards, modals), `var(--surface-hover)` (hover states, table headers).
- **Text**: `var(--ink)` (primary text), `var(--ink-muted)` (secondary/tertiary text).
- **Borders**: `var(--outline)`, `var(--outline-strong)`.
- **Accents**: `var(--color-primary)` (neon green/teal for primary actions).
- **Status Colors**: `var(--color-success)` (Pass), `var(--color-warning)` (Queued/Warnings), `var(--color-danger)` (Fail/Errors), `var(--color-info)` (Running/Info).

## Key Components & Architecture

### 1. Store (`useAppStore.ts`)
The single source of truth for the local application state. 
It stores:
- `projects`: Array of imported Swagger specs, their detected roles, tokens, endpoints, and OTP workflows.
- `endpoints`: Contains status (`Pending`, `Running`, `Pass`, `Fail`), method, path, role, and telemetry (response time, status code).
- `logs`: Real-time execution logs from the test runner.
- `insights`: AI-generated analysis of failed endpoints containing `issue`, `rootCause`, `suggestion`, `fixPrompt`, and `securityFindings`.

### 2. Services (Mocked APIs)
- **`testRunnerService.ts`**: Simulates test execution, OTP extraction, and JWT token passing.
- **`aiService.ts`**: Simulates AI detection of roles, OTP workflows, and generating deep insights (root causes and fix prompts) for failed endpoints.

*Note for AI Agents: When integrating the real backend, these services should be replaced with actual Axios/Fetch calls to the backend REST/WebSocket endpoints.*

### 3. Core Pages
- **`ProjectsList.tsx`**: Dashboard displaying imported projects, pass rates, and status.
- **`ProjectDetails.tsx`**: The main IDE-like workspace. Includes:
  - **API Explorer**: Table of endpoints with search and method filtering.
  - **Testing Console**: Live execution logs with search functionality.
  - **AI Analysis**: High-priority structured cards explaining failures with one-click "Copy Prompt" functionality for developers.
  - **Reports**: Summary cards, charts, and the `FailureTable`.
- **`ReportsList.tsx` & `ReportDetails.tsx`**: Historical view of test runs, utilizing TanStack query for loading/error states.

## Instructions for AI Coding Agents

When continuing development on this frontend, adhere to these strict rules:

1. **Do Not Rebuild**: The frontend architecture is established. Modify and extend existing components instead of creating redundant new ones.
2. **Use Theme Variables**: NEVER use hardcoded colors (e.g., `#0a0a0a`, `bg-gray-900`, `text-white`). Always use `var(--surface)`, `var(--ink)`, etc.
3. **Keep it Dense & Structured**: This is a developer tool. Information density is prioritized over vast whitespace. Use borders (`var(--outline)`) to separate sections cleanly.
4. **State Management**: Do not introduce Redux or Context API. Continue using the existing Zustand store. Add new slices or update functions to `useAppStore.ts` as needed.
5. **Real Backend Transition**: When the backend is ready, update the functions inside `services/` to point to real HTTP endpoints. Ensure WebSocket implementation is used for live log streaming to replace the current `setTimeout` mocks.
6. **Icons**: Stick to `lucide-react` for any new icons to maintain visual consistency.
