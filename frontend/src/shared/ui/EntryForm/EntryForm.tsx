import type { MouseEventHandler } from "react";
import Button from "../Button";
import Input from "../Input/Input";
// import PasswordInput from "../PasswordInput/PasswordInput";
import styles from "./EntryForm.module.scss";
import clsx from "clsx";
import PasswordInput from "../PasswordInput/PasswordInput";
 
interface EntryFormProps {
  className: string;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   errors: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string
  };
  onClick?: MouseEventHandler<HTMLButtonElement>;
  back: boolean
}

export default function EntryForm({ className, formData, onChange, errors, onClick, back}: EntryFormProps) {
  return (
    <>
      <form action="" className={clsx(styles.entry_form, className)}>
        <Input
          label="Логин"
          id="entry__email-id"
          type="email"
          value={formData.email}
          onChange={onChange}
          error={errors.email}
          placeholder="Почта"
        ></Input>
        <PasswordInput
          label="Пароль"
          id="entry__password-id"
          value={formData.password}
          onChange={onChange}
          error={errors.password}
          back={back}
        ></PasswordInput>
        {/* <PasswordInput id="entry__password-id"></PasswordInput> */}
        <Button
          variant = "black"
          style={{ width: "278px" }}
          onClick={onClick}
          type="submit"
        >
          Войти
        </Button>
      </form>
    </>
  );
}
