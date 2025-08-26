import styles from "./AddPhotoButton.module.scss"

interface AddPhotoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function AddPhotoButton({children, className=""} : AddPhotoButtonProps) {
    return (
        <>
        <button type="button" className={`${styles.button} ${className}`}>{children}</button>
        </>
    )
}