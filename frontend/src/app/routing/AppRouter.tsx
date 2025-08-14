import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes";

export const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, element: Element }) => (
          <Route key={path} path={path} element={<Element />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
