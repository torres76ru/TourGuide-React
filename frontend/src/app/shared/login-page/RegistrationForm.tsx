import type { MouseEventHandler } from "react";
import Button from "./Button";
import Input from "../../../shared/ui/Input/Input";
import PasswordInput from "./PasswordInput";

interface EntryFormProps {
  className: string;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  errors: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function RegistrationForm({
  className,
  formData,
  errors,
  onChange,
  onClick,
}: EntryFormProps) {
  return (
    <>
      <form
        action=""
        className={`registration__registration-form ${className}`}
      >
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
          id="reg__password-id"
          className="password-container--margin"
        ></PasswordInput>
        <Input
          label="Повторите пароль"
          id="reg__repeat-password-id"
          type="text"
          value={formData.password}
          onChange={onChange}
          error={errors.password}
        ></Input>
        <div className="registration__checkbox-container">
          <input
            className="registration__checkbox"
            type="checkbox"
            id="reg__checkbox-id"
          />
          <label
            className="registration__checkbox-lable"
            htmlFor="reg__checkbox-id"
          >
            Я прочитал и согласен с политикой данного сервиса.
          </label>
        </div>
        <Button
          className="registration__button--size"
          onClick={onClick}
          type="submit"
        >
          Зарегистрироваться
        </Button>
      </form>
    </>
  );
}
