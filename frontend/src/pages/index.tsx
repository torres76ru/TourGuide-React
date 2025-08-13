import { Route, Routes, Navigate } from "react-router-dom";
import TestPage from "./test";

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<TestPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
