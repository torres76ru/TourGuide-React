import { useRef } from 'react';
import styles from './AddPhotoButton.module.scss';

interface AddPhotoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  photo?: File | null;
  onPhotoChange?: (photo: File | null) => void;
  className?: string;
}

export default function AddPhotoButton({
  photo = null,
  onPhotoChange,
  className = '',
  ...buttonProps
}: AddPhotoButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onPhotoChange) {
      onPhotoChange(file);
    }
  };

  return (
    <div className={className}>
      <button type="button" className={styles.button} onClick={handleButtonClick} {...buttonProps}>
        {photo ? 'Изменить фото' : 'Добавить фото'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {photo && (
        <div className={styles.preview}>
          <img src={URL.createObjectURL(photo)} alt="Фото" className={styles.image} />
        </div>
      )}
    </div>
  );
}
