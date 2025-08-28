import styles from './ModalAddExcursions.module.scss';
import { IconArrowBack } from 'shared/ui/ArrowBackSvg';
import AddExcursionForm from 'features/AddExcursionForm/ui/AddExcursionForm';

interface ModalAddExcursionProps {
  onClick: () => void;
}

export default function ModalAddExcursion({ onClick }: ModalAddExcursionProps) {
  return (
    <>
      <div className={styles.ModalAddExcursion}>
        <div className={styles.title_section}>
          <button className={styles.back_button} onClick={onClick}>
            {' '}
            <IconArrowBack />{' '}
          </button>
          <h3>Добавить экскурию</h3>
        </div>
        <AddExcursionForm handleBack={onClick}></AddExcursionForm>
      </div>
    </>
  );
}
