import type { MouseEventHandler } from "react";
import styles from "./MenuButton.module.scss"

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function MenuButton({children, onClick} : MenuButtonProps) {
    return (
        <>
            <button className={styles.button} onClick={onClick}>{children}</button>
        </>
    )
}