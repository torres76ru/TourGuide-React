import JoinForm from "features/JoinForm/ui/JoinForm";
import styles from "./JoinPage.module.scss"
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import { excursion } from "features/AddExcursionForm/lib/getExcursion";

const JoinPage = () => {
  return (
    <div className={styles.JoinPage}>
      <BackHeader title={excursion.title}></BackHeader>
      <JoinForm></JoinForm>
    </div>
  );
};

export default JoinPage;

