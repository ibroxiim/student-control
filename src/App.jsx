import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import RootLayout from "./layout/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "user", element: <UserPage /> },
      { path: "admin", element: <AdminPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
