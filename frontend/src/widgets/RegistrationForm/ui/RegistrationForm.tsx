import type { MouseEventHandler } from "react";
import Button from "shared/ui/Button";
import Input from "shared/ui/Input/Input";
import PasswordInput from "shared/ui/PasswordInput/PasswordInput";
import styles from "./RegistrationForm.module.scss";
import clsx from "clsx";

interface EntryFormProps {
  className: string;
  formData: {
    firstName: string;
    lastName: string;
    login: string;
    email: string;
    password: string;
    repeatPassword: string;
    checkbox: boolean;
  };
  errors: {
    firstName: string;
    lastName: string;
    login: string;
    email: string;
    password: string;
    repeatPassword: string;
    checkbox: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  back: boolean;
}

export default function RegistrationForm({
  className,
  formData,
  errors,
  onChange,
  onClick,
  back,
}: EntryFormProps) {
  return (
    <>
      <form action="" className={clsx(styles.registration_form, className)}>
        <Input
          label="Имя"
          id="reg__first-name-id"
          type="text"
          value={formData.firstName}
          onChange={onChange}
          error={errors.firstName}
        ></Input>
        <Input
          label="Фамилия"
          id="reg__last-name-id"
          type="text"
          value={formData.lastName}
          onChange={onChange}
          error={errors.lastName}
        ></Input>
        <Input
          label="Почта"
          id="reg__email-id"
          type="email"
          placeholder="Почта"
          value={formData.email}
          onChange={onChange}
          error={errors.email}
        ></Input>
        <Input
          label="Логин"
          id="reg__login-id"
          type="email"
          placeholder="Почта"
          value={formData.login}
          onChange={onChange}
          error={errors.login}
        ></Input>
        <PasswordInput
          label="Пароль"
          id="reg__password-id"
          className={styles.container_margin}
          value={formData.password}
          onChange={onChange}
          error={errors.password}
          back={back}
        ></PasswordInput>
        <PasswordInput
          label="Повторите пароль"
          id="reg__repeat-password-id"
          className={styles.container_margin}
          value={formData.repeatPassword}
          onChange={onChange}
          error={errors.repeatPassword}
          back={back}
        ></PasswordInput>
        <div className={styles.checkbox_container}>
          <label className={styles.custom_checkbox}>
            <input
              className={clsx(
                styles.hidden_checkbox,
                errors.checkbox && styles.checkbox_error
              )}
              type="checkbox"
              id="reg__checkbox-id"
              onChange={onChange}
              checked={formData.checkbox}
            />
            {/* <input type="checkbox" class="hidden-checkbox"> */}
            <span className={styles.checkbox_icon}></span>
          </label>
          <label className={styles.checkbox_lable} htmlFor="reg__checkbox-id">
            Я прочитал и согласен с политикой данного сервиса.
          </label>
        </div>
        <Button
          variant="black"
          style={{ width: "278px" }}
          onClick={onClick}
          type="submit"
        >
          Зарегистрироваться
        </Button>
      </form>
    </>
  );
}
