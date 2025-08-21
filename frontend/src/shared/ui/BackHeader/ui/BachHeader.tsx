import BackButton from "features/back-button"
import styles from "./BackHeader.module.scss"

interface BackHeaderProps {
    title?: string
    className?: string
}

export default function BackHeader({title ="", className=""} : BackHeaderProps) {
    return (
        <>
        <div className={`${styles.header} ${className}`}>
          <BackButton />
          <h3>{title}</h3>
        </div>
        </>
    )
}