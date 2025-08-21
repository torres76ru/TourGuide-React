import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { MainLayout } from "app/layouts";

import SearchPage from "pages/search-page";
import UserDataPage from "pages/user-data-page";
import UserEditingPage from "pages/user-editing-page";
import UserChangePasswordPage from "pages/user-change-password-page";
import UserVisitedExcursionsPage from "pages/user-visited-excursions-page";
import UserScheduledExcursionsPage from "pages/user-scheduled-excursions-page";
import ReviewPage from "pages/review-page"

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
        <Route path="/user/data" element={<UserDataPage />} />
        <Route path="/user/data/editing" element={<UserEditingPage />} />
        <Route path="/user/data/change_password" element={<UserChangePasswordPage />} />
        <Route path="/user/visited_excursions" element={<UserVisitedExcursionsPage />} />
        <Route path="/user/scheduled_excursions" element={<UserScheduledExcursionsPage />} />
        <Route path="/sight/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
};
