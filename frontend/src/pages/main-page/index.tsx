// import { useNavigate } from "react-router";

import WhereToGo from "widgets/where-to-go";
import styles from "./MainPage.module.scss";

const MainPage = () => {
  // const navigate = useNavigate();

  // const handleRedirect = (url: string) => {
  //   navigate(url);
  // };
  return (
    <div className={styles.body}>
      <div style={{ height: "40px" }}></div>
      <WhereToGo />
    </div>
  );
};

export default MainPage;
