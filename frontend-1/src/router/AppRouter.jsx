import { createBrowserRouter, RouterProvider } from "react-router";
import PublicLayout from "../layout/PublicLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import GotoHome from "../pages/GotoHome";
import TodoPage from "../pages/TodoPage";
import useAuthStore from "../stores/authStore";
import Homepage from "../pages/Homepage";
import TodoDetailPage from "../pages/TodoDetailPage";

const PublicRouter = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: Homepage },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "*", Component: GotoHome },
    ],
  },
]);

const UserRouter = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: TodoPage },
      { path: "detail/:id", Component: TodoDetailPage },
      { path: "*", Component: GotoHome },
    ],
  },
]);

function AppRouter() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const finalRouter = accessToken === "" ? PublicRouter : UserRouter;
  return <RouterProvider router={finalRouter} />;
}

export default AppRouter;
