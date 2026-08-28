import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProjectsList } from '../pages/Projects/ProjectsList';
import { ProjectDetails } from '../pages/Projects/ProjectDetails';
import { ReportsList } from '../pages/Reports/ReportsList';
import { ReportDetails } from '../pages/Reports/ReportDetails';
import { ErrorPage } from '../pages/ErrorPage';
import { Login } from '../pages/Auth/Login';
import { Signup } from '../pages/Auth/Signup';

import { LandingPage } from '../pages/Landing/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/projects', element: <ProjectsList /> },
      { path: '/projects/:id', element: <ProjectDetails /> },
      { path: '/reports', element: <ReportsList /> },
      { path: '/reports/:id', element: <ReportDetails /> }
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);
