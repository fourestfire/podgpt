import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/static/', 
    element: <HomePage modelType="Standard" />, 
  },
  {
    path: '/', 
    element: <HomePage modelType="Standard" />, 
  },
  {
    path: '/emoji/', 
    element: <HomePage modelType="Emoji" />, 
  },
  {
    path: '/vision/', 
    element: <HomePage modelType="Vision" />, 
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
