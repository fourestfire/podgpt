import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/static',
    element: <HomePage />,
  },
  {
    path: '/backend/', // Add this line
    element: <HomePage />, // And this line
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
