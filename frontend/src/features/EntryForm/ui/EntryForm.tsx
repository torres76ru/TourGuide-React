import { useEffect, useState } from 'react';
import Button from 'shared/ui/Button';
import Input from 'shared/ui/Input/Input';
import PasswordInput from 'shared/ui/PasswordInput/PasswordInput';
import styles from './EntryForm.module.scss';
import clsx from 'clsx';
import { loginRequest } from 'entities/user/model/slice';
import { useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from 'app/store/mainStore';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

interface EntryFormProps {
  className?: string;
  back?: boolean;
}

export default function EntryForm({ className, back }: EntryFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const normalizeId = (id: string) =>
    id
      .replace(/^(entry__|login__)/, '')
      .replace(/-id$/, '')
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = normalizeId(id);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.username) {
      newErrors.username = 'Введите логин';
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      dispatch(
        loginRequest({
          username: formData.username,
          password: formData.password,
        })
      );
    }
  };

  const { loading, error, user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/'); // на главную
    }
  }, [user, navigate]);
  return (
    <form className={clsx(styles.entry_form, className)} onSubmit={handleSubmit}>
      <Input
        label="Логин"
        id="entry__username-id"
        type="text"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="Введите логин"
      />

      <PasswordInput
        label="Пароль"
        id="entry__password-id"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        back={back}
      />

      <Button variant="black" style={{ width: '278px' }} type="submit" disabled={loading}>
        {loading ? 'Загрузка...' : 'Войти'}
      </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
