import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProjectsList } from '../pages/Projects/ProjectsList';
import { ProjectDetails } from '../pages/Projects/ProjectDetails';
import { ReportsList } from '../pages/Reports/ReportsList';
import { ReportDetails } from '../pages/Reports/ReportDetails';
import { ErrorPage } from '../pages/ErrorPage';
import { Login } from '../pages/Auth/Login';
import { Signup } from '../pages/Auth/Signup';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/projects" replace /> },
      { path: 'projects', element: <ProjectsList /> },
      { path: 'projects/:id', element: <ProjectDetails /> },
      { path: 'reports', element: <ReportsList /> },
      { path: 'reports/:id', element: <ReportDetails /> }
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
