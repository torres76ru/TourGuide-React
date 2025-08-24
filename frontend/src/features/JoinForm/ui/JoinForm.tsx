import Input from "shared/ui/Input/Input"
import styles from "./JoinForm.module.scss"
import { useState } from "react";
import Button from "shared/ui/Button";
import TextArea from "shared/ui/TextArea/TextArea";
import {excursion } from "features/AddExcursionForm/lib/getExcursion"
import DropDown from "shared/ui/DropDown/DropDown";

export default function JoinForm() {
    
    const formattedDate = excursion.date.replace(/-/g, '.');
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        comment: "",
      });

    const [errors, setErrors] = useState({
        name: "",
        phone: "",
        email: "",
        comment: "",
    });

    const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name) {
      newErrors.name = "Пустое поле";
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Пустое поле";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Пустое поле";
      valid = false;
    }

    if (!formData.comment) {
      newErrors.comment = "Пустое поле";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
        

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
     setFormData(prev => ({
       ...prev,
       [field]: e.target.value
     }));
     setErrors((prev) => ({ ...prev, [field]: "" }));
   };

   const handleSubmit = (e: React.FormEvent) => {
    if (validate()) {
      console.log(formData)
    }
      
     };
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
                <DropDown>
                    
                </DropDown>
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
                    onChange={handleChange('description')}
                    error={errors.comment}>
                    </TextArea>
                </div>
               <Button variant="black" style={{ width: "278px", marginTop: "60px"}} onClick={handleSubmit} type="button">
                    Оплатить
                </Button>
            </form>
        </>
    )
}