import { useEffect, useState } from "react";
import styles from "./PasswordInput.module.scss";
import clsx from "clsx";
import Input from "../Input/Input";

interface PasswordInputProps {
  label?: string;
  id: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  back: boolean
}

export default function PasswordInput({ label, id, className = "", value, onChange, error, back }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    if (back) {
      setShowPassword(false);
    }
  }, [back]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className={clsx(styles.password_container, className)}>
      <Input
        label={label}
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        error={error}
      />
      <button
        type="button"
        className={styles.eye_btn}
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
      >
        <img
          src={showPassword ? "/src/shared/assets/icons/PasswordEye-open.svg" : "/src/shared/assets/icons/PasswordEye-close.svg"}
          alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
        />
      </button>
    </div>
  );
}