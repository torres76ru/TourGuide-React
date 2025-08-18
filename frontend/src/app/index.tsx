// src/app/index.tsx
import { Provider } from "react-redux";
import "./index.scss";
import { Routing } from "./routing/AppRouter";
import { store } from "./store/mainStore";

const App = () => {
  return (
    <div className="app">
      <Provider store={store}>
        <Routing />
      </Provider>
    </div>
  );
};

export default App;
