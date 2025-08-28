import PasswordInput from "shared/ui/PasswordInput/PasswordInput";
import styles from "./UserChangePassword.module.scss"
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import { useState } from "react";
import Button from "shared/ui/Button";
// import type { RootState } from "app/store/mainStore";
// import { useSelector } from "react-redux";
// import Input from "shared/ui/Input/Input";
// import { useNavigate } from "react-router-dom";

const UserChangePasswordPage = () => {
  // const { user } = useSelector((state: RootState) => state.user);
//   const navigate = useNavigate();

//   const handleRedirect = (url: string) => {
//     navigate(url);
//   };

 const [passwordData, setPasswordData] = useState({
     oldPassword: "",
     newPassword: "",
     repeatNewPassword: "",
   });

  const [errors, setErrors] = useState({
     oldPassword: "",
     newPassword: "",
     repeatNewPassword: "",
   });
 
   // Функция для обработки изменений
   const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
     setPasswordData(prev => ({
       ...prev,
       [field]: e.target.value
     }));
     setErrors(prev => ({
       ...prev,
       [field]: ""
     }));
   };
 
   const handleSubmit = () => {
     console.log('Сохраненные данные:', passwordData);
     // Здесь будет логика сохранения на сервер
   };

  return (
    <div className={styles.userChangePasswordPage}>
      <BackHeader title="Смена пароля"></BackHeader>
      <form className={styles.change_password_section}>
        <PasswordInput
                label="Введите старый пароль"
                id="old_password-id"
                value={passwordData.oldPassword}
                onChange={handleChange('oldPassword')}
                error={errors.oldPassword}
                className={styles.margin}
                classInput={styles.size}
                classLable={styles.font_weight}
                classEye={styles.eye}
              />
        <PasswordInput
                label="Введите новый пароль"
                id="new_password-id"
                value={passwordData.newPassword}
                onChange={handleChange('newPassword')}
                error={errors.newPassword}
                className={styles.margin}
                classInput={styles.size}
                classLable={styles.font_weight}
                classEye={styles.eye}
              />
        <PasswordInput
                label="Повторите новый пароль"
                id="repeat_new_password-id"
                value={passwordData.repeatNewPassword}
                onChange={handleChange('repeatNewPassword')}
                error={errors.repeatNewPassword}
                className={styles.margin}
                classInput={styles.size}
                classLable={styles.font_weight}
                classEye={styles.eye}
              />
        <Button 
            variant="black" 
            style={{ width: "278px" }} 
            type="button" 
            className={styles.margin_btn}
            onClick={handleSubmit}
          >
            Сохранить
        </Button>
      </form>
    </div>
  );
};

export default UserChangePasswordPage;

