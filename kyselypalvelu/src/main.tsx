import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Kyselyt from "./components/Kyselyt.tsx";
import Kysely from "./components/Kysely.tsx";
import Kotisivu from "./components/Kotisivu.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Kotisivu /> },
      { path: "kyselyt", element: <Kyselyt /> },
      {
        path: "kysely", // <-- dynamic route for single Kysely(kyselyt/:id)
        element: <Kysely />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
