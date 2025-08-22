import ChoiceButton from 'shared/ui/ChoiceButton/ChoiceButton';
import styles from './RegistrationChoice.module.scss';
import clsx from 'clsx';
import tourist from 'shared/assets/icons/Tourist.svg';
import guide from 'shared/assets/icons/Guide.svg';
import type { UserType } from 'entities/user/model/types';

interface ChoiceProps {
  className?: string;
  onClick: (userType: UserType) => void;
}

export default function RegistrationChoice({ className, onClick }: ChoiceProps) {
  const handleChoice = (userType: UserType) => {
    onClick(userType);
  };
  return (
    <>
      <div className={clsx(styles.choice, className)}>
        <p className={styles.choice_text}>Зарегистрироваться как:</p>
        <div className={styles.choice_buttons}>
          <ChoiceButton
            onClick={() => handleChoice('tourist')}
            label="Турист"
            iconSrc={tourist}
            altText="Турист"
          ></ChoiceButton>
          <ChoiceButton
            onClick={() => handleChoice('guide')}
            label="Экскурсовод"
            iconSrc={guide}
            altText="Экскурсовод"
          ></ChoiceButton>
        </div>
      </div>
    </>
  );
}
