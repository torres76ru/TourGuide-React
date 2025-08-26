import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest } from 'entities/user/model/slice';
import type { AppDispatch, RootState } from 'app/store/mainStore';
import { useNavigate } from 'react-router';

export function useRegistrationForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user) {
      navigate('/'); // на главную
    }
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
    repeatPassword: '',
    checkbox: false,
    is_guide: false,
  });

  const [errors, setErrors] = useState({
    login: '',
    email: '',
    password: '',
    repeatPassword: '',
    checkbox: '',
  });

  const normalizeId = (id: string) =>
    id
      .replace(/^(entry__|reg__)/, '')
      .replace(/-id$/, '')
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked, type } = e.target;
    const fieldName = normalizeId(id);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
      valid = false;
    }

    if (formData.repeatPassword.length < 6) {
      newErrors.repeatPassword = 'Пароль должен быть не менее 6 символов';
      valid = false;
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Некорректный email';
      valid = false;
    }

    if (!formData.checkbox) {
      newErrors.checkbox = 'Чекбокс не выбран';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      dispatch(
        registerRequest({
          username: formData.login,
          email: formData.email,
          password: formData.password,
          password2: formData.repeatPassword,
          is_guide: formData.is_guide,
        })
      );
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData,
    setErrors,
    loading,
    error,
  };
}
