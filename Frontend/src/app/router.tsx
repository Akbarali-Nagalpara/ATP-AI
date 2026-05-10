import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Projects } from '../pages/Projects/Projects';
import { Endpoints } from '../pages/Endpoints/Endpoints';
import { TestRuns } from '../pages/TestRuns/TestRuns';
import { AIInsights } from '../pages/AIInsights/AIInsights';
import { Reports } from '../pages/Reports/Reports';
import { Logs } from '../pages/Logs/Logs';
import { Workers } from '../pages/Workers/Workers';
import { Settings } from '../pages/Settings/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true,             element: <Dashboard />  },
      { path: 'projects',        element: <Projects />   },
      { path: 'endpoints',       element: <Endpoints />  },
      { path: 'test-runs',       element: <TestRuns />   },
      { path: 'ai-insights',     element: <AIInsights /> },
      { path: 'reports',         element: <Reports />    },
      { path: 'logs',            element: <Logs />       },
      { path: 'workers',         element: <Workers />    },
      { path: 'settings',        element: <Settings />   },
    ],
  },
]);
