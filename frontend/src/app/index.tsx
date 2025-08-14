// src/app/index.tsx
import "./index.scss";
import { Routing } from "./routing/AppRouter";

const App = () => {
  return (
    <div className="app">
      <Routing />
    </div>
  );
};

export default App;
