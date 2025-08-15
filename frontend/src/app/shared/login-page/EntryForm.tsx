import type { MouseEventHandler } from "react";
import Button from "./Button";
import Input from "../../../shared/ui/Input/Input";
import PasswordInput from "./PasswordInput";

interface EntryFormProps {
  className: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function EntryForm({
  className,
  value,
  onChange,
  error,
  onClick,
}: EntryFormProps) {
  return (
    <>
      <form action="" className={`registration__entry-form ${className}`}>
        <Input
          label="Логин"
          id="entry__email-id"
          type="email"
          value={value}
          onChange={onChange}
          error={error}
          placeholder="Почта"
        ></Input>
        <PasswordInput id="entry__password-id"></PasswordInput>
        <Button
          className="registration__button--size"
          onClick={onClick}
          type="submit"
        >
          Войти
        </Button>
      </form>
    </>
  );
}
