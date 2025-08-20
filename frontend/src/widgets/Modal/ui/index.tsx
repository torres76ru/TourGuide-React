// widgets/Modal/ui/Modal.tsx
import styles from "./Modal.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: Props) => {

  return (
    <>
      <div className={`${styles.backdrop} ${isOpen && styles.backdrop_visible}`} onClick={onClose}></div>
      <div className={`${styles.modal} ${isOpen && styles.modal_visible}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </>
  );
};

export default Modal;
