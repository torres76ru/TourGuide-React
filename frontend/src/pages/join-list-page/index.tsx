import styles from "./JoinListPage.module.scss"
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import { excursion } from "features/AddExcursionForm/lib/getExcursion";

const JoinListPage = () => {
    const formattedDate = excursion.date.replace(/-/g, '.');
  return (
    <div className={styles.JoinListPage}>
      <BackHeader title={excursion.title}></BackHeader>
      <ul className={styles.join_list}>
       <li className={styles.list_item}>
            <div className={styles.section}> 
                <span>{formattedDate}</span> 
                <span>{excursion.min_time} - {excursion.max_time}</span>
            </div>
            <div className={styles.section}> 
                <span>Всего зарегистрировано</span> 
                <span>2 из {excursion.max_people}</span>
            </div>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <td rowSpan={3} className={styles.firstColumn}>
                            Андрей Иванов
                        </td>
                        <td className={styles.secondColumn}>2 человека</td>
                    </tr>
                    <tr>
                        <td className={styles.secondColumn}>89674585847</td>
                    </tr>
                    <tr>
                        <td className={styles.secondColumn}>chtoto@mail.ru</td>
                    </tr>
                </tbody>
            </table>
       </li>
      </ul>
    </div>
  );
};

export default JoinListPage;

