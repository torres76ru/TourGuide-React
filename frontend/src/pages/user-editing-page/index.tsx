import styles from './UserEditingPage.module.scss';
import BackHeader from 'shared/ui/BackHeader/ui/BachHeader';
import type { RootState } from 'app/store/mainStore';
import { useSelector } from 'react-redux';
import Input from 'shared/ui/Input/Input';
import Button from 'shared/ui/Button';
import { useState } from 'react';
import { authApi } from 'entities/user/model/api';
import { updateProfile } from 'entities/user/model/slice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

const UserEditingPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });

  const navigate = useNavigate();

  // Функция для обработки изменений
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = async () => {
    console.log('Сохраненные данные:', formData);
    try {
      const updatedUser = await authApi.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      console.log('Ответ от сервера:', updatedUser);
      dispatch(updateProfile({ ...updatedUser }));

      navigate(-1);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setError('Не удалось обновить профиль');
    }
  };

  return (
    <div className={styles.userEditingPage}>
      <BackHeader title="Личные данные"></BackHeader>
      <form className={styles.editing_section}>
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
          style={{ width: '278px' }}
          type="button"
          className={styles.margin}
          onClick={handleSave}
        >
          Сохранить
        </Button>
        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
};

export default UserEditingPage;
