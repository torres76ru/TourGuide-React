import styles from "./UserName.module.scss"
import avatar from "shared/assets/Suga.jpg"

interface UserNameProps {
    name?: string;
    headingStyle?: React.CSSProperties;
    imageStyle?: React.CSSProperties;
}

export default function UserName({name, headingStyle = {}, imageStyle = {}} : UserNameProps) {
    return (
        <>
        <div className={styles.name_section}>
            <div className={styles.img_section} style={imageStyle}>
                <img src={avatar} alt="Аватар" />
            </div>
            <h3 style={headingStyle}>{name}</h3>
        </div>
        </>
    )
}