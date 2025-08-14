import { useNavigate } from "react-router";

const MainPage = () => {
  const navigate = useNavigate();

  const handleRedirect = (url: string) => {
    navigate(url);
  };
  return (
    <div>
      <h1>Welcome to TourGuide</h1>
      <p>Discover amazing tours and experiences!</p>
      <button onClick={() => handleRedirect("/auth")}>Go to Auth</button>
      <button onClick={() => handleRedirect("/test")}>Go to Test</button>
    </div>
  );
};

export default MainPage;
