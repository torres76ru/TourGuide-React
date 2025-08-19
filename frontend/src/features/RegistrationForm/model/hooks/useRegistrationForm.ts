import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerRequest } from "entities/user/model/slice";
import type { AppDispatch } from "app/store/mainStore";

export function useRegistrationForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    login: "",
    email: "",
    password: "",
    repeatPassword: "",
    checkbox: false,
  });

  const [errors, setErrors] = useState({
    login: "",
    email: "",
    password: "",
    repeatPassword: "",
    checkbox: "",
  });

  const normalizeId = (id: string) =>
    id
      .replace(/^(entry__|reg__)/, "")
      .replace(/-id$/, "")
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = normalizeId(id);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldName === "checkbox" ? e.target.checked : value,
    }));
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
      valid = false;
    }

    if (formData.repeatPassword.length < 6) {
      newErrors.repeatPassword = "Пароль должен быть не менее 6 символов";
      valid = false;
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Некорректный email";
      valid = false;
    }

    if (!formData.checkbox) {
      newErrors.checkbox = "Чекбокс не выбран";
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
  };
}
