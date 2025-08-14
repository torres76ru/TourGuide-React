import { useNavigate } from "react-router";

const MainPage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/auth");
  };
  return (
    <div>
      <h1>Welcome to TourGuide</h1>
      <p>Discover amazing tours and experiences!</p>
      <button onClick={handleRedirect}>Go to Auth</button>
    </div>
  );
};

export default MainPage;
