import { Outlet } from "react-router-dom";
import Footer from "widgets/Footer";
import Header from "widgets/Header";

const MainLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <main style={{ flex: "1 1 100%" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
