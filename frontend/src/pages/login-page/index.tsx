import { useEffect, useState } from "react";
import Button from "shared/ui/Button";
import RegistrationChoice from "widgets/RegistrationChoice/ui/RegistrationChoice";
import EntryForm from "widgets/EntryForm/ui/EntryForm";
import RegistrationForm from "features/RegistrationForm/ui/RegistrationForm";
import styles from "./LoginPage.module.scss";
import clsx from "clsx";
import arrow from "shared/assets/icons/Arrow.svg";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "app/store/mainStore";
import { registerRequest } from "entities/user/model/slice";
const LoginPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  // const { loading, error, user } = useSelector(
  //   (state: RootState) => state.user
  // );

  const handleRedirect = (url: string) => {
    navigate(url);
  };

  const [isBack, setIsBack] = useState(false);
  const [activeBlock, setActiveBlock] = useState<
    null | "entry" | "choice" | "registration"
  >(null);
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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  function CheckIsVisible(className?: string): string {
    return isMounted ? className || "" : "";
  }

  function GoBack() {
    if (activeBlock === null) handleRedirect("/");
    else if (activeBlock === "entry" || activeBlock === "choice")
      setActiveBlock(null);
    else if (activeBlock === "registration") setActiveBlock("choice");

    setFormData({
      login: "",
      email: "",
      password: "",
      repeatPassword: "",
      checkbox: false,
    });

    setErrors({
      login: "",
      email: "",
      password: "",
      repeatPassword: "",
      checkbox: "",
    });

    setIsBack(true);
  }

  const normalizeId = (id: string) => {
    return id
      .replace(/^(entry__|reg__)/, "")
      .replace(/-id$/, "")
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = normalizeId(id);

    setFormData({
      ...formData,
      [fieldName]: fieldName === "checkbox" ? e.target.checked : value,
    });
    setErrors({ ...errors, [fieldName]: "" });
  };

  // Валидация
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (activeBlock === "registration") {
      // Валидация пароля
      if (formData.repeatPassword.length < 6) {
        newErrors.repeatPassword = "Пароль должен быть не менее 6 символов";
        valid = false;
      }

      // Валидация чекбокса
      if (!formData.checkbox) {
        newErrors.checkbox = "Чекбокс не выбран";
        valid = false;
      }
    }

    // Валидация email
    if (!formData.email.includes("@")) {
      newErrors.email = "Некорректный email";
      valid = false;
    }

    // Валидация пароля
    if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Отправка формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Форма отправлена:", formData);

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

  return (
    <div className={styles.registration}>
      <button
        className={clsx(
          styles.btn_back,
          CheckIsVisible(styles.btn_back_visible) && styles.btn_back_visible
        )}
        onClick={GoBack}
      >
        <img src={arrow} />
      </button>
      <div
        className={clsx(
          styles.img,
          CheckIsVisible(styles.img_visible) && styles.img_visible
        )}
      >
        <div
          className={clsx(
            styles.blackout,
            CheckIsVisible(styles.blackout_visible) && styles.blackout_visible
          )}
        ></div>
      </div>
      <div
        className={clsx(
          styles.area,
          styles.container,
          CheckIsVisible(styles.area_visible) && styles.area_visible
        )}
      >
        <h3 className={styles.title}>TourGuide</h3>
        <p className={styles.slogan}>Отправляйся в путешествие с нами</p>
        <div
          className={clsx(
            styles.registration_buttons,
            activeBlock === null && styles.active_block
          )}
        >
          <Button
            variant="black"
            style={{ width: "100%" }}
            onClick={() => {
              setActiveBlock("entry");
              setIsBack(false);
            }}
          >
            Войти
          </Button>
          <Button
            variant="black"
            style={{ width: "100%" }}
            onClick={() => {
              setActiveBlock("choice");
              setIsBack(false);
            }}
          >
            Регистрация
          </Button>
        </div>
        <EntryForm
          className={clsx(activeBlock === "entry" && styles.active_block)}
          formData={formData}
          onChange={handleChange}
          errors={errors}
          onClick={handleSubmit}
          back={isBack}
        />
        <RegistrationChoice
          className={clsx(activeBlock === "choice" && styles.active_block)}
          onClick={() => {
            setActiveBlock("registration");
            setIsBack(false);
          }}
        />
        <RegistrationForm
          className={clsx(
            activeBlock === "registration" && styles.active_block
          )}
          back={isBack}
        />
      </div>
    </div>
  );
};

export default LoginPage;
