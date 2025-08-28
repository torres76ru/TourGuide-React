import Input from "shared/ui/Input/Input"
import styles from "./JoinForm.module.scss"
import Button from "shared/ui/Button";
import TextArea from "shared/ui/TextArea/TextArea";
import {excursion } from "features/AddExcursionForm/lib/getExcursion"
import DropDown from "shared/ui/DropDown/DropDown";
import { useJoinForm } from "../model/hooks/useJoinForm";

export default function JoinForm() {
    const { formData, errors, handleChange, handleSubmit, formattedDate, peopleArray} = useJoinForm();
    return (
        <>
            <form className={styles.JoinForm}>
                <Input 
                label="Дата" 
                classLable={styles.font_weight} 
                value={formattedDate}
                readOnly={true} 
                onFocus={(e) => e.target.blur()} 
                classInput={styles.size}></Input>
                <Input 
                label="Время" 
                classLable={styles.font_weight} 
                value={`${excursion.min_time} - ${excursion.max_time}`}
                readOnly={true} 
                onFocus={(e) => e.target.blur()} 
                classInput={styles.size}></Input>
                <div className={styles.dropDown_section}>
                <DropDown
                options={peopleArray}
                selectedValue={formData.people}
                handleChange={handleChange('people')}
                label={`Количество человек (до ${excursion.max_people})`}
                error={errors.people}>
                </DropDown>
                </div>
                <Input 
                label="Ваше имя"
                classLable={styles.font_weight} 
                placeholder="Введите имя..."
                value={formData.name}
                onChange={handleChange('name')}
                classInput={styles.size}
                error={errors.name}
                ></Input>
                <Input 
                label="Номер телефона"
                classLable={styles.font_weight} 
                placeholder="Введите номер..."
                value={formData.phone}
                onChange={handleChange('phone')}
                classInput={styles.size}
                type="tel"
                pattern="[0-9]*"
                maxLength={11} 
                error={errors.phone}
                ></Input>
                <Input 
                label="Эл. почта"
                classLable={styles.font_weight} 
                placeholder="Введите эл. почту..."
                value={formData.email}
                onChange={handleChange('email')}
                classInput={styles.size}
                type="email"
                error={errors.email}
                ></Input>
                <div className={styles.description_section}>
                    <p>Оставьте комментарий, если есть какие-то вопросы или пожелания</p>
                    <TextArea
                    placeholder="Напишите свой комментарий..."
                    value={formData.comment}
                    onChange={handleChange('comment')}
                    error={errors.comment}>
                    </TextArea>
                </div>
               <Button variant="black" style={{ width: "278px", marginTop: "20px"}} onClick={handleSubmit} type="button">
                    Оплатить
                </Button>
            </form>
        </>
    )
}