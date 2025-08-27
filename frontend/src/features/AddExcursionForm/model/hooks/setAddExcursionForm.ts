import { useState } from "react";
import { updateMockExcursion } from "features/AddExcursionForm/lib/getExcursion";

export function useAddExcursionForm() {

 const [formData, setFormData] = useState({
        title: "",
        price: "",
        max_people: "",
        description: "",
        date: "",
        min_time: "",
        max_time: "",
        phone: "",
        email: "",
        city: "",
        street: "",
        house: "",
        entrance: "",
        flat: "",
      });

    const [errors, setErrors] = useState({
        title: "",
        price: "",
        max_people: "",
        description: "",
        date: "",
        min_time: "",
        max_time: "",
        phone: "",
        email: "",
        city: "",
        street: "",
        house: "",
        entrance: "",
        flat: "",
    });

    const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    const requiredFields = [
      'title', 'price', 'max_people', 'description',
      'date', 'min_time', 'max_time', 'phone', 'email', 'city', 'street'
    ] as const;
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "Пустое поле";
        valid = false;
      }
    });

    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "Некорректный email";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

      // Создание массива времени с интервалом 30 минут
      const timeArray = Array.from({ length: 48 }, (_, i) => {
        const hours = Math.floor(i / 2);
        const minutes = (i % 2) * 30;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        });

      // Создание массива чисел от 1 до 100
      const numbArray = Array.from({ length: 100 }, (_, index) => (index + 1).toString());
        

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
     setFormData(prev => ({
       ...prev,
       [field]: e.target.value
     }));
     setErrors((prev) => ({ ...prev, [field]: "" }));
   };

   const handleSubmit = () => {
    if (validate()) {
      updateMockExcursion(formData);
      console.log(formData);
    }
      
};

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData,
    setErrors,
    timeArray,
    numbArray
  };
}
