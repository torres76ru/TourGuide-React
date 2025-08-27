import styles from "./UserName.module.scss"
import avatar from "shared/assets/avatar.svg"

interface UserNameProps {
    name?: string;
    headingStyle?: React.CSSProperties;
    imageStyle?: React.CSSProperties;
}

export default function UserName({name, headingStyle = {}, imageStyle = {}} : UserNameProps) {
    return (
        <>
        <div className={styles.name_section}>
            <img className={styles.img} src={avatar} alt="Аватар" style={imageStyle}/>
            <h3 style={headingStyle}>{name}</h3>
        </div>
        </>
    )
}