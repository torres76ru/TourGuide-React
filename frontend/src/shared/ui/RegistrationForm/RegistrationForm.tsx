// переместить в widgets
import type { MouseEventHandler } from "react";
import Button from "../Button";
import Input from "../Input/Input";
import PasswordInput from "../PasswordInput/PasswordInput";
import styles from "./RegistrationForm.module.scss";
import clsx from "clsx";

interface EntryFormProps {
  className: string;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
  };
  errors: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
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
          label="Логин"
          id="reg__email-id"
          type="email"
          placeholder="Почта"
          value={formData.email}
          onChange={onChange}
          error={errors.email}
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
        {/* <Input
          label="Повторите пароль"
          id="reg__repeat-password-id"
          type="text"
          value={formData.repeatPassword}
          onChange={onChange}
          error={errors.repeatPassword}
        ></Input> */}
        <div className={styles.checkbox_container}>
          <input
            className={styles.checkbox}
            type="checkbox"
            id="reg__checkbox-id"
          />
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
