import "./app.css";

import { Effect } from "effect";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { RootStoreProvider } from "./stores/root";

const createAppRoot = Effect.sync(() => createRoot(document.body));
const createAppRouter = Effect.sync(() => createBrowserRouter(routes));

Effect.runPromise(Effect.Do.pipe(
  Effect.andThen(() => Effect.all([createAppRoot, createAppRouter], { concurrency: "unbounded" })), 
  Effect.andThen(([root, router]) => Effect.sync(() => root.render((
    <RootStoreProvider>
      <RouterProvider router={router} />
    </RootStoreProvider>
  ))))),
);
