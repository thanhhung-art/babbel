import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./screens/login/Login.tsx";
import Register from "./screens/register/Register.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react_query/reactquery.ts";
import Auth from "./components/Auth.tsx";
import Home from "./screens/home/Home.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Auth>
        <Home />
      </Auth>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
