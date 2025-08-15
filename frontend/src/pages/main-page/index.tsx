// import { useNavigate } from "react-router";

import WhereToGo from "widgets/where-to-go";
import styles from "./MainPage.module.scss";
import { Carousel } from "widgets/index";

const MainPage = () => {
  // const navigate = useNavigate();

  // const handleRedirect = (url: string) => {
  //   navigate(url);
  // };
  return (
    <div className={styles.body}>
      <div style={{ margin: "40px 0 66px" }}>
        <WhereToGo />
      </div>
      <Carousel category="Лучшие развлечения этого года" count={10} />
      <div style={{ height: "56px" }}></div>
      <Carousel category="Недалеко от вас" count={3} />
      <div style={{ height: "56px" }}></div>
      <Carousel category="Недавно посещали" count={5} />
      <div style={{ height: "56px" }}></div>
    </div>
  );
};

export default MainPage;
