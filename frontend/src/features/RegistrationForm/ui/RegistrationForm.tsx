import Button from 'shared/ui/Button';
import Input from 'shared/ui/Input/Input';
import PasswordInput from 'shared/ui/PasswordInput/PasswordInput';
import styles from './RegistrationForm.module.scss';
import clsx from 'clsx';
import { useRegistrationForm } from '../model/hooks/useRegistrationForm';
import type { UserType } from 'entities/user/model/types';

interface RegistrationFormProps {
  className?: string;
  back: boolean;
  userType: UserType;
}

export default function RegistrationForm({ className, back, userType }: RegistrationFormProps) {
  const { formData, errors, handleChange, handleSubmit, loading, error } = useRegistrationForm();

  if (userType === 'guide') {
    formData.is_guide = true;
  }

  return (
    <form onSubmit={handleSubmit} className={clsx(styles.registration_form, className)}>
      {userType}
      <Input
        label="Почта"
        id="reg__email-id"
        type="email"
        placeholder="Почта"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        label="Логин"
        id="reg__login-id"
        type="text"
        placeholder="Логин"
        value={formData.login}
        onChange={handleChange}
        error={errors.login}
      />
      <PasswordInput
        label="Пароль"
        id="reg__password-id"
        className={styles.container_margin}
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        back={back}
      />
      <PasswordInput
        label="Повторите пароль"
        id="reg__repeat-password-id"
        className={styles.container_margin}
        value={formData.repeatPassword}
        onChange={handleChange}
        error={errors.repeatPassword}
        back={back}
      />
      <div className={styles.checkbox_container}>
        <label className={styles.custom_checkbox}>
          <input
            className={clsx(styles.hidden_checkbox, errors.checkbox && styles.checkbox_error)}
            type="checkbox"
            id="reg__checkbox-id"
            onChange={handleChange}
            checked={formData.checkbox}
          />
          <span className={styles.checkbox_icon}></span>
        </label>
        <label className={styles.checkbox_lable} htmlFor="reg__checkbox-id">
          Я прочитал и согласен с политикой данного сервиса.
        </label>
      </div>
      <Button variant="black" style={{ width: '278px' }} type="submit" disabled={loading}>
        {loading ? 'Загрузка...' : 'Зарегистрироваться'}
      </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
