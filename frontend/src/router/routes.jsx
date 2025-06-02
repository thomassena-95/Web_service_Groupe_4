import { lazy } from 'react';
import Layout from '../components/Layout';
import ProtectedRoute from './ProtectedRoute';
import { Navigate } from 'react-router-dom';

// Lazy loading des composants
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ProfessorDashboard = lazy(() => import('../pages/professor/Dashboard'));
const StudentDashboard = lazy(() => import('../pages/student/Dashboard'));
const Classrooms = lazy(() => import('../pages/professor/Classrooms'));
const Validations = lazy(() => import('../pages/professor/Validations'));
const Readings = lazy(() => import('../pages/student/Readings'));
const Books = lazy(() => import('../pages/professor/Books'));
const Assignments = lazy(() => import('../pages/professor/Assignments'));

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" replace />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'professor',
        element: <ProtectedRoute requiredRole="professor" />,
        children: [
          {
            path: 'dashboard',
            element: <ProfessorDashboard />
          },
          {
            path: 'classrooms',
            element: <Classrooms />
          },
          {
            path: 'validations',
            element: <Validations />
          },
          {
            path: 'books',
            element: <Books />
          },
          {
            path: 'assignments',
            element: <Assignments />
          }
        ]
      },
      {
        path: 'student',
        element: <ProtectedRoute requiredRole="student" />,
        children: [
          {
            path: 'dashboard',
            element: <StudentDashboard />
          },
          {
            path: 'readings',
            element: <Readings />
          }
        ]
      },
      {
        path: '*',
        element: <Navigate to="/login" replace />
      }
    ]
  }
];
