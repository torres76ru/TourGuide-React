// src/app/index.tsx
import { Routing } from "../pages";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </div>
  );
};

export default App;
