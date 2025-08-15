import { LoginPage, MainPage, Test } from "../../pages";

export const routes = [
  { path: "/", element: MainPage },
  { path: "/auth", element: LoginPage },
  { path: "/test", element: Test },
];
