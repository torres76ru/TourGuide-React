import { useEffect, useState } from "react";
import Button from "shared/ui/Button";
import RegistrationChoice from "widgets/RegistrationChoice/ui/RegistrationChoice";
import EntryForm from "features/EntryForm/ui/EntryForm";
import RegistrationForm from "features/RegistrationForm/ui/RegistrationForm";
import styles from "./LoginPage.module.scss";
import clsx from "clsx";
import arrow from "shared/assets/icons/Arrow.svg";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleRedirect = (url: string) => {
    navigate(url);
  };

  const [isBack, setIsBack] = useState(false);
  const [activeBlock, setActiveBlock] = useState<
    null | "entry" | "choice" | "registration"
  >(null);

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

    setIsBack(true);
  }

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
