import styles from "./UserData.module.scss"
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import avatar from "shared/assets/Suga.jpg";
import type { RootState } from "app/store/mainStore";
import { useSelector } from "react-redux";
import edit from "shared/assets/edit.svg"
import Input from "shared/ui/Input/Input";
import { useNavigate } from "react-router-dom";

const UserDataPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const handleRedirect = (url: string) => {
    navigate(url);
  };

  return (
    <div className={styles.userDataPage}>
      <BackHeader title="Личные данные"></BackHeader>
      <div className={styles.data_section}>
        <div className={styles.user_img}> <img src={avatar} alt="Аватар" /></div>
        <div className={styles.user_name}>
          <span className={styles.name}>{user?.username}</span>
          <div className={styles.name_section}>
            <span className={styles.name}>{user?.first_name}</span>
            <span className={styles.name}>{user?.last_name}</span>
          </div>
        </div>
        <button className={styles.edit_button} onClick={() => handleRedirect("/user/data/editing")}> <img src={edit} alt="Редактировать" /></button>
      </div>
      <Input label="Почта" classLable={styles.font_weight} 
      value={user?.email} readOnly={true} 
      onFocus={(e) => e.target.blur()} classInput={styles.size}
      id="user_email"></Input>
      <button className={styles.button} onClick={() => handleRedirect("/user/data/change_password")}>Сменить пароль</button>
    </div>
  );
};

export default UserDataPage;

