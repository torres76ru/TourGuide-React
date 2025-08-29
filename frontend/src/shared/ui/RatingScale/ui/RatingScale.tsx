import styles from "./RatingScale.module.scss"

interface RatingScaleProps {
    number: number
    width: number
}

export default function RatingScale({number, width} : RatingScaleProps) {
    return (
        <>
        <div className={styles.rating_scale}>
            <span>{number}</span>
            <div className={styles.scale}>
                <div className={`${styles.scale} ${styles.blue}`}  style={{ width: `${width}%` }}></div>
             </div>
        </div>
        </>
    )
}