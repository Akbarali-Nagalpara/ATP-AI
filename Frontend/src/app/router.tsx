import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts
import { RootLayout } from '@components/layout/RootLayout'
import { DashboardLayout } from '@components/layout/DashboardLayout'
import { AuthLayout } from '@components/layout/AuthLayout'
import { ProtectedRoute } from '@components/layout/ProtectedRoute'
import { PageLoader } from '@components/common/PageLoader'

// Eager-load auth pages (small, needed immediately)
import { LoginPage } from '@features/auth/pages/LoginPage'
import { RegisterPage } from '@features/auth/pages/RegisterPage'

// Lazy-load dashboard pages
const DashboardPage = lazy(() =>
  import('@features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ProjectsPage = lazy(() =>
  import('@features/projects/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
)
const ProjectDetailPage = lazy(() =>
  import('@features/projects/pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
)
const SpecImportPage = lazy(() =>
  import('@features/specs/pages/SpecImportPage').then((m) => ({ default: m.SpecImportPage })),
)
const EndpointExplorerPage = lazy(() =>
  import('@features/endpoints/pages/EndpointExplorerPage').then((m) => ({ default: m.EndpointExplorerPage })),
)
const TestRunsPage = lazy(() =>
  import('@features/test-runs/pages/TestRunsPage').then((m) => ({ default: m.TestRunsPage })),
)
const TestRunDetailPage = lazy(() =>
  import('@features/test-runs/pages/TestRunDetailPage').then((m) => ({ default: m.TestRunDetailPage })),
)
const ReportsPage = lazy(() =>
  import('@features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
)
const ReportDetailPage = lazy(() =>
  import('@features/reports/pages/ReportDetailPage').then((m) => ({ default: m.ReportDetailPage })),
)
const RolesPage = lazy(() =>
  import('@features/roles/pages/RolesPage').then((m) => ({ default: m.RolesPage })),
)
const SettingsPage = lazy(() =>
  import('@features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

// Wrap lazy component with Suspense
const Lazy = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // ─── Auth Routes ───────────────────────────────────────
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },

      // ─── Protected Dashboard Routes ────────────────────────
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <Lazy><DashboardPage /></Lazy> },
              { path: 'projects', element: <Lazy><ProjectsPage /></Lazy> },
              { path: 'projects/:projectId', element: <Lazy><ProjectDetailPage /></Lazy> },
              { path: 'projects/:projectId/import', element: <Lazy><SpecImportPage /></Lazy> },
              { path: 'projects/:projectId/endpoints', element: <Lazy><EndpointExplorerPage /></Lazy> },
              { path: 'projects/:projectId/runs', element: <Lazy><TestRunsPage /></Lazy> },
              { path: 'projects/:projectId/runs/:runId', element: <Lazy><TestRunDetailPage /></Lazy> },
              { path: 'projects/:projectId/reports', element: <Lazy><ReportsPage /></Lazy> },
              { path: 'projects/:projectId/reports/:reportId', element: <Lazy><ReportDetailPage /></Lazy> },
              { path: 'projects/:projectId/roles', element: <Lazy><RolesPage /></Lazy> },
              { path: 'settings', element: <Lazy><SettingsPage /></Lazy> },
            ],
          },
        ],
      },
    ],
  },
])
