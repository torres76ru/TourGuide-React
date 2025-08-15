import { useState } from "react";
import Button from "../../app/shared/login-page/Button";
import RegistrationChoice from "../../app/shared/login-page/RegistrationChoice";
import EntryForm from "../../app/shared/login-page/EntryForm";
import RegistrationForm from "../../app/shared/login-page/RegistrationForm";
import "./style.css";

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeBlock, setActiveBlock] = useState<
    null | "entry" | "choice" | "registration"
  >(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  function CheckIsVisible(className?: string): string {
    return isVisible ? className || "" : "";
  }

  function GoBack() {
    if (activeBlock === null) setIsVisible(false);
    else if (activeBlock === "entry" || activeBlock === "choice")
      setActiveBlock(null);
    else if (activeBlock === "registration") setActiveBlock("choice");
    setFormData({ firstName: "", lastName: "", email: "", password: "" });
    setErrors({ firstName: "", lastName: "", email: "", password: "" });
  }

  const normalizeId = (id: string) => {
    if (id.includes("repeat-password")) {
      return "password";
    }
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
      if (formData.password.length < 6) {
        newErrors.password = "Пароль должен быть не менее 6 символов";
        valid = false;
      }
    }

    // Валидация email
    if (!formData.email.includes("@")) {
      newErrors.email = "Некорректный email";
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
        className={`btn ${CheckIsVisible("btn--click")}`}
        onClick={() => setIsVisible(true)}
      >
        Войти
      </button>
      <div className="registration">
        <button
          className={`registration__btn-back ${CheckIsVisible(
            "registration__btn-back--visible"
          )}`}
          onClick={GoBack}
        >
          <img src="/src/assets/icons/Arrow.svg" />
        </button>
        <div
          className={`registration__img ${CheckIsVisible(
            "registration__img--visible"
          )}`}
        >
          <div
            className={`registration__blackout ${CheckIsVisible(
              "registration__blackout--visible"
            )}`}
          ></div>
        </div>
        <div
          className={`registration__area container ${CheckIsVisible(
            "registration__area--visible"
          )}`}
        >
          <h3 className="registration__title">TourGuide</h3>
          <p className="registration__slogan">
            Отправляйся в путешествие с нами
          </p>
          <div
            className={`registration__buttons ${
              activeBlock === null ? "active-block" : ""
            }`}
          >
            <Button onClick={() => setActiveBlock("entry")}>Войти</Button>
            <Button onClick={() => setActiveBlock("choice")}>
              Регистрация
            </Button>
          </div>
          <EntryForm
            className={activeBlock === "entry" ? "active-block" : ""}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            onClick={handleSubmit}
          />
          <RegistrationChoice
            className={activeBlock === "choice" ? "active-block" : ""}
            onClick={() => setActiveBlock("registration")}
          />
          <RegistrationForm
            className={activeBlock === "registration" ? "active-block" : ""}
            formData={formData}
            onChange={handleChange}
            errors={errors}
            onClick={handleSubmit}
          />
        </div>
      </div>
      {/* <button onClick={handleRedirect}>Go to Main</button> */}
    </div>
  );
};

export default LoginPage;
