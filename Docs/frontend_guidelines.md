# Endpoint IQ - Frontend Development Guidelines

This document serves as a comprehensive guide for AI coding agents and human developers working on the **Endpoint IQ** frontend. It outlines the core technology stack, UI/UX philosophy, state management patterns, and styling conventions.

## 1. Technology Stack
The frontend is built for extreme performance, smooth animations, and strong type safety.

*   **Core Framework**: React 19 + TypeScript
*   **Build Tool**: Vite (Lightning fast HMR)
*   **Routing**: React Router v7 (`react-router-dom`)
*   **Styling**: Tailwind CSS v4 (using CSS variables for dynamic theming)
*   **State Management**: Zustand (Global state, lightweight and hook-based)
*   **Animations**: Framer Motion (Complex layout transitions, modal animations, micro-interactions)
*   **Icons**: Lucide React (Consistent, clean stroke icons)
*   **Data Fetching**: Axios + TanStack React Query (Server state and caching)
*   **UI Primitives**: Radix UI (Accessible, unstyled components wrapped with Tailwind)
*   **Charts/Visuals**: Recharts

---

## 2. UI/UX Implementation Philosophy
Endpoint IQ is a premium, enterprise-grade developer tool. The UI should feel like a high-end native application, not a standard website.

### Aesthetic Principles
*   **Dark Mode First**: The default and primary theme is Dark Mode. The color palette revolves around `deep indigo`, `vibrant purple`, and `neon cyan` (success/action indicators).
*   **Depth & Elevation**: Use borders and subtle shadows rather than harsh contrast. Elements should look layered (e.g., `bg-[var(--canvas)]` for backgrounds, `bg-[var(--surface)]` for cards, `bg-[var(--surface-hover)]` for interactions).
*   **Rounded Geometry**: Extensive use of `rounded-xl` and `rounded-2xl` to create a soft, modern feel. Avoid sharp corners unless necessary for specific UI components.
*   **Micro-interactions**: Every button, card, and row should respond to user interaction. Use Tailwind's `group`, `group-hover`, and transition utilities (`transition-all duration-200`) extensively.

### CSS Variables (Theming System)
We rely strictly on predefined CSS variables in `index.css` rather than hardcoding hex colors. Always use the following semantic tokens:
*   `var(--canvas)`: The deepest background layer (e.g., `bg-[#050505]`).
*   `var(--surface)`: Cards, sidebars, and modals.
*   `var(--surface-hover)`: Hover states and active selections.
*   `var(--outline)` & `var(--outline-strong)`: Borders for separation.
*   `var(--ink)` & `var(--ink-muted)`: Text colors (Primary white/gray vs secondary muted text).
*   `var(--color-primary)`: The main brand color (Indigo/Purple/Cyan gradients or solids).

---

## 3. Animation Guidelines (Framer Motion)
Animations should feel **snappy, purposeful, and fluid**. Avoid slow, dragging animations.

*   **Page Transitions**: Use simple fade or slight Y-axis slides.
    ```tsx
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} />
    ```
*   **Modals & Overlays**: Always wrap modals in `<AnimatePresence>` and scale them in from `0.95` to `1`.
*   **Layout Animations**: Use `layoutId` for smooth transitions between shared elements (like an active navigation indicator moving between tabs).

---

## 4. State Management (Zustand)
We use **Zustand** for global client state. Keep the state normalized and slice it into logical stores:
*   `useAppStore` (`src/store/useAppStore.ts`): Holds Project data, endpoints, test execution states, and AI insights.
*   `useAuthStore` (`src/store/auth.store.ts`): Holds JWT tokens, user profiles, and session states.

**Agent Rule**: When updating complex nested state (like an endpoint within a project), use the specific update functions provided in the store (e.g., `updateEndpoint`, `updateToken`) rather than deeply cloning arrays manually in the UI components.

---

## 5. File Structure Convention
*   `/src/components/`: Reusable UI elements. Grouped by domain (e.g., `/layout`, `/report`, `/Auth`).
*   `/src/pages/`: Full route components (e.g., `Login.tsx`, `ProjectDetails.tsx`).
*   `/src/store/`: Zustand state definitions.
*   `/src/services/`: API clients, Axios instances, and mock simulation logic (`testRunnerService.ts`, `aiService.ts`).
*   `/src/types/`: Shared TypeScript interfaces.
*   `/public/`: Static assets (like `logo.png` and `favicon.svg`).

---

## 6. Rules for AI Agents
1.  **Do not use inline styles.** Always use Tailwind utility classes.
2.  **Respect the theme variables.** Never hardcode colors like `bg-gray-800` or `text-white` unless it's a specific, isolated component (like a glowing badge). Use `bg-[var(--surface)]` and `text-[var(--ink)]`.
3.  **Ensure Type Safety.** Do not use `any` unless mocking data. Import interfaces from `useAppStore` or `/types`.
4.  **Icons.** Always use `lucide-react`. Ensure stroke width is consistent (default is 2).
5.  **Clean Code.** Keep components small. If a file exceeds 250 lines, extract sub-components (like table rows, charts, or headers) into separate files within the same directory.
