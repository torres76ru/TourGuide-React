import { LoginPage, MainPage, SightPage, Test, UserPage, ExcursionPage, EditingExcursionPage } from "pages";

export const routes = [
  { path: "/", element: MainPage },
  { path: "/auth", element: LoginPage },
  { path: "/test", element: Test },
  { path: "/sight/:id", element: SightPage },
  { path: "/user", element: UserPage },
  { path: "/excursion", element: ExcursionPage },
];
