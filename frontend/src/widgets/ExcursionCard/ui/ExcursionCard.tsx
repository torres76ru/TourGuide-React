import styles from "./ExcursionCard.module.scss"
import starBlue from "shared/assets/star-blue.svg"
import star from "shared/assets/star.svg"
import Location from "shared/ui/Location/ui/Location"

interface ExcursionCardProps {
    img?: string
    name?: string
    date?: string
    rating: number
    sity?: string
}

export default function ExcursionCard({img, name, date, rating, sity} : ExcursionCardProps) {
    const roundedRating = Math.round(rating);

    // Создаем массив из 5 элементов и заполняем звёздами
    const stars = Array(5).fill(0).map((_, index) => (
        <img 
            key={index}
            src={index < roundedRating ? starBlue : star}
            alt={index < roundedRating ? "Голубая звезда" : "Обычная звезда"}
        />
    ));
    return (
        <>
            <div className={styles.excursion_card}>
                <div className={styles.img_section}>
                    <img src={img} alt="Экскурсия" />
                </div>
                <div className={styles.excursion_inf}>
                    <div className={styles.name_section}>
                        <h3 className={styles.text}>{name}</h3>
                    </div>
                    <p className={styles.text}>{date}</p>
                    <Location distance="" sity={sity}></Location>
                    <div className={styles.stars}>{stars}</div>
                </div>
            </div>
        </>
    )
}