import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/");
  };
  return (
    <div>
      <h1>Registration</h1>
      <p>Discover amazing tours and experiences!</p>
      <button onClick={handleRedirect}>Go to Main</button>
    </div>
  );
};

export default LoginPage;
