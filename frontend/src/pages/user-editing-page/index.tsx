import styles from "./UserEditingPage.module.scss";
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import avatar from "shared/assets/Suga.jpg";
import type { RootState } from "app/store/mainStore";
import { useSelector } from "react-redux";
import Input from "shared/ui/Input/Input";
import Button from "shared/ui/Button";
import { useState } from "react";

const UserEditingPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    firstName: user?.first_name || '',
    lastName: user?.last_name || ''
  });

  // Функция для обработки изменений
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = () => {
    console.log('Сохраненные данные:', formData);
    // Здесь будет логика сохранения на сервер
  };

  return (
    <div className={styles.userEditingPage}>
      <BackHeader title="Личные данные"></BackHeader>
      <div className={styles.img_section}>
        <div className={styles.user_img}> 
          <img src={avatar} alt="Аватар" />
        </div>
        <button className={styles.btn}>Изменить фото</button>
      </div>
      <div className={styles.editing_section}>
        <Input 
          label="Имя пользователя" 
          classLable={styles.font_weight} 
          value={formData.username}
          onChange={handleInputChange('username')}
          classInput={styles.size}
          id="user_name"
        />
        <Input 
          label="Имя" 
          classLable={styles.font_weight} 
          value={formData.firstName}
          onChange={handleInputChange('firstName')}
          classInput={styles.size}
          id="user_firstname"
        />
        <Input 
          label="Фамилия" 
          classLable={styles.font_weight} 
          value={formData.lastName}
          onChange={handleInputChange('lastName')}
          classInput={styles.size}
          id="user_lastname"
        />
        <Button 
          variant="black" 
          style={{ width: "278px" }} 
          type="button" 
          className={styles.margin}
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default UserEditingPage;
