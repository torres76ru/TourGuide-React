import { useState } from "react";
import Button from "shared/ui/Button";
import RegistrationChoice from "../../shared/ui/RegistrationChoice/RegistrationChoice";
import EntryForm from "../../shared/ui/EntryForm/EntryForm";
import RegistrationForm from "../../shared/ui/RegistrationForm/RegistrationForm";
import styles from "./LoginPage.module.scss"
import clsx from 'clsx';

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [activeBlock, setActiveBlock] = useState<
    null | "entry" | "choice" | "registration"
  >(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  function CheckIsVisible(className?: string): string {
    return isVisible ? className || "" : "";
  }

  function GoBack() {
    if (activeBlock === null) setIsVisible(false);
    else if (activeBlock === "entry" || activeBlock === "choice") setActiveBlock(null);
    else if (activeBlock === "registration") setActiveBlock("choice");
    setFormData({ firstName: "", lastName: "", email: "", password: "", repeatPassword: ""});
    setErrors({ firstName: "", lastName: "", email: "", password: "", repeatPassword: "" });
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

    setFormData({ ...formData, [fieldName]: value });
    setErrors({ ...errors, [fieldName]: "" });
  };

  // Валидация
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (activeBlock === "registration") {
      // Валидация имени
      if (!formData.firstName.trim()) {
        newErrors.firstName = "Имя обязательно";
        valid = false;
      }

      // Валидация фамилии
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Фамилия обязательна";
        valid = false;
      }

      // Валидация пароля
      if (formData.repeatPassword.length < 6) {
        newErrors.repeatPassword = "Пароль должен быть не менее 6 символов";
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
      // Отправка данных...
    }
  };

  return (
    <div>
      <button 
        className={clsx( styles.btn, CheckIsVisible('btn_click') && styles['btn_click'])}
        onClick={() => setIsVisible(true)}
      >
        Войти
      </button>
      <div className={styles.registration}>
        <button
          className={clsx( styles.btn_back, CheckIsVisible('btn_back_visible') && styles['btn_back_visible'])}
          onClick={GoBack}
        >
          <img src="/src/shared/assets/icons/Arrow.svg" />
        </button>
        <div
          className={clsx( styles.img, CheckIsVisible('img_visible') && styles['img_visible'])}
        >
          <div
            className={clsx( styles.blackout, CheckIsVisible('blackout_visible') && styles['blackout_visible'])}
          ></div>
        </div>
        <div
          className={clsx( styles.area, styles.container, CheckIsVisible('area_visible') && styles['area_visible'])}
        >
          <h3 className={styles.title}>TourGuide</h3>
          <p className={styles.slogan}>
            Отправляйся в путешествие с нами
          </p>
          <div
          className={clsx( styles.registration_buttons, activeBlock === null && styles['active_block'])}
          >
            <Button variant = "black" style={{ width: "100%" }} onClick={() => setActiveBlock("entry")}>Войти</Button>
            <Button variant = "black" style={{ width: "100%" }} onClick={() => setActiveBlock("choice")}>
              Регистрация
            </Button>
          </div>
          <EntryForm
            className={clsx(activeBlock === "entry" && styles['active_block'])}
            formData={formData}
            onChange={handleChange}
            errors={errors}
            onClick={handleSubmit}
            back={isBack}
          />
          <RegistrationChoice
            className={clsx(activeBlock === "choice" && styles['active_block'])}
            onClick={() => setActiveBlock("registration")}
          />
          <RegistrationForm
            className={clsx(activeBlock === "registration" && styles['active_block'])}
            formData={formData}
            onChange={handleChange}
            errors={errors}
            onClick={handleSubmit}
            back={isBack}
          />
        </div>
      </div>
      {/* <button onClick={handleRedirect}>Go to Main</button> */}
    </div>
  );
};

export default LoginPage;
