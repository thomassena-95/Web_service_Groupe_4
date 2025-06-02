import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { Suspense } from 'react';

// Composant de chargement
const Loading = () => <div>Chargement...</div>;

export const router = createBrowserRouter(routes);

// Wrapper pour le lazy loading
export const RouterProvider = () => (
  <Suspense fallback={<Loading />}>
    <ReactRouterProvider router={router} />
  </Suspense>
);
