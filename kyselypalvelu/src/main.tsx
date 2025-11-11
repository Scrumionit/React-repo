import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Kyselyt from "./components/Kyselyt.tsx";
import Kysely from "./components/Kysely.tsx";
import Kotisivu from "./components/Kotisivu.tsx";
import UusiKysely from "./components/UusiKysely.tsx";
// import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Kotisivu /> },
      { path: "kyselyt", element: <Kyselyt /> },
      {
        path: "kyselyt/:id",
        element: <Kysely />,
      },
      {
        path: "uusikysely",
        element: <UusiKysely />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
