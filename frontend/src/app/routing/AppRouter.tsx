import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { MainLayout } from "app/layouts";

import SearchPage from "pages/search-page";

export const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {routes.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
};
