import Input from "shared/ui/Input/Input"
import styles from "./AddExcursionForm.module.scss"
import DropDownSection from "shared/ui/DropDownSection/DropDownSection"
import { type MouseEventHandler } from "react";
import AddPhotoButton from "shared/ui/AddPhotoButton/AddPhotoButton";
import Button from "shared/ui/Button";
import DateExcursion from "widgets/DateExcursion/DateExcursion";
import TextArea from "shared/ui/TextArea/TextArea";
import { useAddExcursionForm } from "../model/hooks/setAddExcursionForm";

interface AddExcursionFormProps{
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function AddExcursionForm({onClick} : AddExcursionFormProps) {
    const { formData, errors, handleChange, handleSubmit, numbArray, timeArray} = useAddExcursionForm();
    return (
        <>
            <form className={styles.addExcursionForm}>
                <Input 
                label="Название"
                classLable={styles.font_weight} 
                placeholder="Введите название..."
                value={formData.title}
                onChange={handleChange('title')}
                classInput={styles.size}
                id="excursion_title"
                error={errors.title}
                ></Input>
                <div className={styles.price_section}>
                  <Input 
                  label="Цена"
                  classLable={styles.font_weight} 
                  value={formData.price}
                  onChange={handleChange('price')}
                  classInput={styles.small_size}
                  id="excursion_price"
                  error={errors.price}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  ></Input>
                  <p>рублей с человека</p>
                </div>
                <DropDownSection 
                title="Количество человек"
                options={numbArray}
                selectedValue_1={formData.min_people}
                onValueChange_1={handleChange('min_people')}
                error_1={errors.min_people}
                selectedValue_2={formData.max_people}
                onValueChange_2={handleChange('max_people')}
                error_2={errors.max_people}
                ></DropDownSection>
                <div className={styles.description_section}>
                    <p>Описание</p>
                    <TextArea
                    placeholder="Введите описание..."
                    value={formData.description}
                    onChange={handleChange('description')}
                    error={errors.description}>
                    </TextArea>
                </div>
                <p>Дата экскурсии</p>
                <DateExcursion
                value={formData.date}
                onChange={handleChange('date')}
                options={timeArray}
                selectedValue_1={formData.min_time}
                onValueChange_1={handleChange('min_time')}
                error_1={errors.min_time}
                selectedValue_2={formData.max_time}
                onValueChange_2={handleChange('max_time')}
                error_2={errors.max_time}
                error_3={errors.date}>
                </DateExcursion>
                <Input 
                label="Номер телефона"
                classLable={styles.font_weight} 
                placeholder="Введите номер..."
                value={formData.phone}
                onChange={handleChange('phone')}
                classInput={styles.size}
                id="excursion_phone"
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
                id="excursion_email"
                type="email"
                error={errors.email}
                ></Input>
                <div className={styles.address_section}>
                    <p>Место встречи</p>
                    <Input 
                    label="Город"
                    classLable={styles.font_weight} 
                    placeholder="Введите город..."
                    value={formData.city}
                    onChange={handleChange('city')}
                    classInput={`${styles.size} ${styles.margin}`}
                    id="excursion_city"
                    error={errors.city}
                    ></Input>
                    <Input 
                    label="Улица"
                    classLable={styles.font_weight} 
                    placeholder="Введите название улицы..."
                    value={formData.street}
                    onChange={handleChange('street')}
                    classInput={`${styles.size} ${styles.margin}`}
                    id="excursion_street"
                    error={errors.street}
                    ></Input>
                    <div className={styles.adress}>
                        <Input 
                        label="Дом"
                        classLable={styles.font_weight} 
                        value={formData.house}
                        onChange={handleChange('house')}
                        classInput={styles.size}
                        id="excursion_house"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        ></Input>
                        <Input 
                        label="Подъезд"
                        classLable={styles.font_weight} 
                        value={formData.entrance}
                        onChange={handleChange('entrance')}
                        classInput={styles.size}
                        id="excursion_entrance"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        ></Input>
                        <Input 
                        label="Квартира"
                        classLable={styles.font_weight} 
                        value={formData.flat}
                        onChange={handleChange('flat')}
                        classInput={styles.size}
                        id="excursion_flat"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        ></Input>
                    </div>
                </div>
                <AddPhotoButton children="Добавить фото"/>
               <Button variant="black" style={{ width: "278px", marginTop: "60px"}} onClick={(event) => {
    handleSubmit(); 
    onClick?.(event);}} type="button">
                    Создать экскурсию
                </Button>
            </form>
        </>
    )
}