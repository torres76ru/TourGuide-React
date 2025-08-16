import { LoginPage, MainPage, SightPage, Test } from "pages";

export const routes = [
  { path: "/", element: MainPage },
  { path: "/auth", element: LoginPage },
  { path: "/test", element: Test },
  { path: "/sight", element: SightPage },
];
