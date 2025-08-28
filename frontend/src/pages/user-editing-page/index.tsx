import styles from "./UserEditingPage.module.scss";
import BackHeader from "shared/ui/BackHeader/ui/BachHeader";
import type { RootState } from "app/store/mainStore";
import { useSelector } from "react-redux";
import Input from "shared/ui/Input/Input";
import Button from "shared/ui/Button";
import { useState } from "react";

const UserEditingPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || ''
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
      <form className={styles.editing_section}>
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
          value={formData.first_name}
          onChange={handleInputChange('first_name')}
          classInput={styles.size}
          id="user_firstname"
        />
        <Input 
          label="Фамилия" 
          classLable={styles.font_weight} 
          value={formData.last_name}
          onChange={handleInputChange('last_name')}
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
      </form>
    </div>
  );
};

export default UserEditingPage;
