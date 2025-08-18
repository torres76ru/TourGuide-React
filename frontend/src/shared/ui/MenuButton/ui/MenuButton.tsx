import styles from "./MenuButton.module.scss"

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function MenuButton({children} : MenuButtonProps) {
    return (
        <>
            <button className={styles.button}>{children}</button>
        </>
    )
}